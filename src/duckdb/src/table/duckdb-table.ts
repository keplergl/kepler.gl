// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';

import {
  DatasetType,
  DATASET_FORMATS,
  GEOARROW_EXTENSIONS,
  GEOARROW_METADATA_KEY
} from '@kepler.gl/constants';
import {
  arrowSchemaToFields,
  isArrowData,
  isGeoJson,
  isKeplerGlMap,
  isRowObject,
  processArrowBatches
} from '@kepler.gl/processors';
import {KeplerTable} from '@kepler.gl/table';
import {Field} from '@kepler.gl/types';
import {getApplicationConfig, DatabaseAdapter, DatabaseConnection} from '@kepler.gl/utils';

import {
  processCsvRowObject,
  processGeojson,
  processKeplerglJSONforDuckDb,
  ProcessorResult
} from '../processors/data-processor';

import {
  isGeoArrowPoint,
  isGeoArrowLineString,
  isGeoArrowPolygon,
  isGeoArrowMultiPoint,
  isGeoArrowMultiLineString,
  isGeoArrowMultiPolygon
} from './duckdb-table-utils';

import {
  castDuckDBTypesForKepler,
  dropTableIfExists,
  getDuckDBColumnTypes,
  getDuckDBColumnTypesMap,
  removeUnsupportedExtensions,
  restoreArrowTable,
  restoreUnsupportedExtensions
} from '../table/duckdb-table-utils';

// TODO use files from disk or url directly, without parsing by loaders and then ingection into DeckDb

/**
 * Default DuckDb geometry columns created by ST_READ
 */
const DUCKDB_GEOM_COLUMN = 'geom';
const DUCKDB_WKB_COLUMN = 'wkb_geometry';

/**
 Default column name for processed geojson in Kepler.
 Use this name to rename default 'geom' column from DuckDb
 in order to support Kepler maps saved before introduction of DuckDb plugin.
 */
const KEPLER_GEOM_FROM_GEOJSON_COLUMN = '_geojson';

/**
 * Names of columns that most likely contain binary wkb geometry
 */
const SUGGESTED_GEOM_COLUMNS = {
  [KEPLER_GEOM_FROM_GEOJSON_COLUMN]: GEOARROW_EXTENSIONS.WKB,
  [DUCKDB_GEOM_COLUMN]: GEOARROW_EXTENSIONS.WKB,
  geometry: GEOARROW_EXTENSIONS.WKB
};

type ImportDataToDuckProps = {
  data: ProcessorResult & {arrowSchema: arrow.Schema};
  db: DatabaseAdapter;
  c: DatabaseConnection;
};

type ImportDataToDuckResult = {
  // DuckDb drops geoarrow metadata, so try to preserve and then restore the extension name
  geoarrowMetadata?: Record<string, string>;
  // Use fields from arrow table even if fields are provided
  useNewFields?: boolean;
};

export class KeplerGlDuckDbTable extends KeplerTable {
  declare readonly id: string;
  declare label: string;
  declare type: string;
  declare metadata: Record<string, any>;

  constructor(props) {
    super(props);
  }

  async importRowData({data, db, c}: ImportDataToDuckProps): Promise<void> {
    try {
      const {fields, rows} = data;

      // DATASET_FORMATS.keplergl loads data as any[][] instead of [{}]
      // TODO potential memory usage explosion: original data, new object and then DuckDb table
      const rowsForDb = Array.isArray(rows[0])
        ? rows.map(row => {
            const newRow = {};
            row.forEach((value, index) => {
              newRow[fields[index].name] = value;
            });
            return newRow;
          })
        : rows;

      await db.registerFileText(this.id, JSON.stringify(rowsForDb));

      const columns = fields.reduce((acc, field, index) => {
        // @ts-expect-error TODO extend fields to contain duckDBColumnType
        return `${acc}${index > 0 ? ',' : ''} '${field.name}': '${field.duckDBColumnType}'`;
      }, '');

      const createTableSql = `
        CREATE TABLE '${this.label}' AS
        SELECT *
        FROM read_json('${this.id}',
                       columns = {${columns}});
      `;
      await c.query(createTableSql);
    } catch (error) {
      console.log('importRowData', error);
      throw error;
    }
  }

  async importGeoJsonData({data, db, c}: ImportDataToDuckProps): Promise<ImportDataToDuckResult> {
    try {
      const {rows} = data;
      await db.registerFileText(this.id, JSON.stringify(rows));

      const createTableSql = `
        install spatial;
        load spatial;
        CREATE TABLE '${this.label}' AS 
        SELECT *
        FROM ST_READ('${this.id}', keep_wkb = TRUE);
        ALTER TABLE '${this.label}' RENAME '${DUCKDB_WKB_COLUMN}' TO '${KEPLER_GEOM_FROM_GEOJSON_COLUMN}';
      `;

      await c.query(createTableSql);
    } catch (error) {
      console.error('importGeoJsonData', error);
      throw error;
    }

    return {
      // _geojson column is created from geometry with keep_wkb flag and contains valid WKB data.
      geoarrowMetadata: {[KEPLER_GEOM_FROM_GEOJSON_COLUMN]: GEOARROW_EXTENSIONS.WKB}
    };
  }

  async importArrowData({data, c}: ImportDataToDuckProps): Promise<ImportDataToDuckResult> {
    let adjustedMetadata = {};
    try {
      // 1) data.rows contains an arrow table created by Add to Map data from DuckDb query.
      // 2) arrow table is in cols & fields when a file is dragged & dropped into Add Data To Map dialog.
      const arrowTable =
        data.rows instanceof arrow.Table
          ? data.rows
          : restoreArrowTable(data.cols || [], data.fields, data.arrowSchema);

      // remove unsupported extensions from an arrow table that throw exceptions in DuckDB.
      adjustedMetadata = removeUnsupportedExtensions(arrowTable);

      const setupSql = `
        install spatial;
        load spatial;
      `;
      await c.query(setupSql);
      await c.insertArrowTable(arrowTable, {name: this.label});

      // restore unsupported extensions that throw exceptions in DuckDb
      restoreUnsupportedExtensions(arrowTable, adjustedMetadata);
    } catch (error) {
      // Known issues:
      // 1) Arrow Type with extension name: geoarrow.point and format: +w:2 is not currently supported in DuckDB.
      console.error('importArrowData', error);
      throw error;
    }

    return {
      geoarrowMetadata: {...SUGGESTED_GEOM_COLUMNS, ...adjustedMetadata},
      // use fields generated from the created arrow table
      useNewFields: true
    };
  }

  /**
   * Creates a table from data, returns an arrow table with the data
   * @param data
   * @returns {Promise<{fields: Field[], cols: any[]}>}
   */
  protected async createTableAndGetArrow(data): Promise<{fields: any[]; cols: arrow.Vector[]}> {
    const db = await getApplicationConfig().database;
    if (!db) {
      console.error('The database is not configured properly.');
      return {fields: [], cols: []};
    }
    const c = await db.connect();

    const tableName = this.label;
    await dropTableIfExists(c, tableName);

    let format = this.metadata.format;
    if (!format) {
      // format is missing when we load Kepler.gl examples
      if (Array.isArray(data.rows?.[0]) || typeof data.rows?.[0] === 'object') {
        format = DATASET_FORMATS.row;
      } else if (data.rows?.type === 'FeatureCollection') {
        format = DATASET_FORMATS.geojson;
      } else if (data.cols?.[0] instanceof arrow.Vector) {
        format = DATASET_FORMATS.arrow;
      }
    }

    let importDetails: ImportDataToDuckResult | undefined;
    if (format === DATASET_FORMATS.row) {
      await this.importRowData({data, db, c});
    } else if (format === DATASET_FORMATS.geojson) {
      importDetails = await this.importGeoJsonData({data, db, c});
    } else if (format === DATASET_FORMATS.arrow) {
      importDetails = await this.importArrowData({data, db, c});
    } else {
      console.error('Unrecognized format', format);
    }

    let fields: Field[] = [];
    let cols: arrow.Vector[] = [];

    try {
      const {geoarrowMetadata = {}, useNewFields = false} = importDetails || {};

      const duckDbColumns = await getDuckDBColumnTypes(c, tableName);
      const tableDuckDBTypes = getDuckDBColumnTypesMap(duckDbColumns);
      const adjustedQuery = castDuckDBTypesForKepler(tableName, duckDbColumns);
      const arrowResult = await c.query(adjustedQuery);

      // TODO if format is an arrow table then just use the original one, instead of the new table from the query?

      restoreGeoarrowMetadata(arrowResult, geoarrowMetadata);

      fields = useNewFields
        ? arrowSchemaToFields(arrowResult, tableDuckDBTypes)
        : data.fields ?? arrowSchemaToFields(arrowResult, tableDuckDBTypes);
      cols = [...Array(arrowResult.numCols).keys()]
        .map(i => arrowResult.getChildAt(i))
        .filter(col => col) as arrow.Vector[];
    } catch (error) {
      console.error('DuckDB table: createTableAndGetArrow', error);
      throw error;
    }

    await c.close();

    return {fields, cols};
  }

  async importData({data}: {data: ProcessorResult}): Promise<void> {
    // VectorTile is a special case, ignore for now
    if (this.type === DatasetType.VECTOR_TILE) {
      super.importData({data: {...data, rows: []}});
      return;
    }

    const {fields, cols} = await this.createTableAndGetArrow(data);

    super.importData({data: {fields, cols, rows: []}});
  }

  async update(data) {
    // VectorTile is a special case, ignore for now
    if (this.type === DatasetType.VECTOR_TILE) {
      super.importData({data});
      return this;
    }

    const {cols} = await this.createTableAndGetArrow(data);

    return super.update({cols, rows: [], fields: []});
  }

  static getFileProcessor = function (data: any, inputFormat?: string) {
    let processor;
    let format;
    if (inputFormat === DATASET_FORMATS.arrow || isArrowData(data)) {
      format = DATASET_FORMATS.arrow;
      processor = processArrowBatches;
    } else if (inputFormat === DATASET_FORMATS.keplergl || isKeplerGlMap(data)) {
      format = DATASET_FORMATS.keplergl;
      processor = processKeplerglJSONforDuckDb;
    } else if (inputFormat === DATASET_FORMATS.row || isRowObject(data)) {
      // csv file goes here
      format = DATASET_FORMATS.row;
      processor = processCsvRowObject; // directly import json object into duckdb-wasm
    } else if (inputFormat === DATASET_FORMATS.geojson || isGeoJson(data)) {
      format = DATASET_FORMATS.geojson;
      processor = processGeojson;
    }
    return {processor, format};
  };

  static getInputDataValidator = function () {
    // In DuckDB mode data is validated later during import.
    return d => d;
  };
}

/**
 * Try to restore geoarrow metadata lost during DuckDb ingestion.
 * Note that this function can generate wrong geometry types.
 * @param arrowTable Arrow table to update.
 * @param geoarrowMetadata A map with field names that usually used to store geoarrow geometry.
 */
export const restoreGeoarrowMetadata = (
  arrowTable: arrow.Table,
  geoarrowMetadata: Record<string, string>
) => {
  arrowTable.schema.fields.forEach(f => {
    if (arrow.DataType.isBinary(f.type) && geoarrowMetadata[f.name]) {
      f.metadata.set(GEOARROW_METADATA_KEY, geoarrowMetadata[f.name]);
    } else if (isGeoArrowPoint(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT);
    } else if (isGeoArrowLineString(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.LINESTRING);
    } else if (isGeoArrowPolygon(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POLYGON);
    } else if (isGeoArrowMultiPoint(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.MULTIPOINT);
    } else if (isGeoArrowMultiLineString(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.MULTILINESTRING);
    } else if (isGeoArrowMultiPolygon(f.type)) {
      f.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.MULTIPOLYGON);
    }
  });
};
