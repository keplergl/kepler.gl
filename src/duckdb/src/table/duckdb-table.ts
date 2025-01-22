import * as arrow from 'apache-arrow';
import {AsyncDuckDB, AsyncDuckDBConnection} from '@duckdb/duckdb-wasm';

import {DatasetType, DATASET_FORMATS} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {Field, ProtoDatasetField} from '@kepler.gl/types';
import {
  arrowSchemaToFields,
  isArrowData,
  isGeoJson,
  isKeplerGlMap,
  isRowObject,
  processArrowBatches
} from '@kepler.gl/processors';

import {getDuckDB} from '../init';
import {
  processCsvRowObject,
  processGeojson,
  processKeplerglJSONforDuckDb,
  ProcessorResult
} from '../processors/data-processor';

// TODO format geojson, all binary geogson columns should be tranformed to wkb
const GEOMETRY_COLUMN = 'geom';

type ImportDataToDuckProps = {
  data: ProcessorResult;
  db: AsyncDuckDB;
  c: AsyncDuckDBConnection;
};

/**
 * Creates an arrow table from arrow vectors and fields.
 * @param columns An array of arrow vectors.
 * @param fields An array of fields per arrow vector.
 * @returns An arrow table.
 */
// TODO: consider using original drag&dropped arrow table, as it could contain extra metadata, not passed to the fields.
const restoreArrowTable = (columns: arrow.Vector[], fields: ProtoDatasetField[]) => {
  const creaOpts = {};
  fields.map((field, index) => {
    creaOpts[field.name] = columns[index];
  });
  return new arrow.Table(creaOpts);
};

const dropIfTableExists = async (c: AsyncDuckDBConnection, tableName: string) => {
  try {
    await c.query(`DROP TABLE IF EXISTS "${tableName}";`);
  } catch (error) {
    console.error('Dropping table failed', tableName, error);
  }
};

export class KeplerGlDuckDbTable extends KeplerTable {
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
    }
  }

  async importGeoJsonData({data, db, c}: ImportDataToDuckProps): Promise<void> {
    try {
      const {rows} = data;
      await db.registerFileText(this.id, JSON.stringify(rows));

      const createTableSql = `
        install spatial;
        load spatial;
        CREATE TABLE '${this.label}' AS 
        SELECT *
        FROM ST_READ('${this.id}');
      `;
      await c.query(createTableSql);
    } catch (error) {
      console.error('importGeoJsonData', error);
    }
  }

  async importArrowData({data, db, c}: ImportDataToDuckProps): Promise<void> {
    try {
      // 1) data.rows contains an arrow table created by Add to Map data from DuckDb query.
      // 2) arrow table is in cols & fields when a file is dragged & dropped into Add Data To Map dialog.
      const arrowTable =
        data.rows instanceof arrow.Table
          ? data.rows
          : restoreArrowTable(data.cols || [], data.fields);

      const setupSql = `
        install spatial;
        load spatial;
      `;
      await c.query(setupSql);
      await c.insertArrowTable(arrowTable, {name: this.label});
    } catch (error) {
      // Known issues:
      // 1) Arrow Type with extension name: geoarrow.point and format: +w:2 is not currently supported in DuckDB.
      console.error('importArrowData', error);
    }
  }

  /**
   * Creates a table from data, returns an arrow table with the data
   * @param data
   * @returns {Promise<{fields: Field[], cols: any[]}>}
   */
  protected async createTableAndGetArrow(data): Promise<{fields: any[]; cols: arrow.Vector[]}> {
    const db = await getDuckDB();
    const c = await db.connect();

    const tableName = this.label;
    await dropIfTableExists(c, tableName);

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

    if (format === DATASET_FORMATS.row) {
      await this.importRowData({data, db, c});
    } else if (format === DATASET_FORMATS.geojson) {
      await this.importGeoJsonData({data, db, c});
    } else if (format === DATASET_FORMATS.arrow) {
      await this.importArrowData({data, db, c});
    } else {
      console.error('Unrecognized format', format);
    }

    let fields: Field[] = [];
    let cols: arrow.Vector[] = [];

    try {
      // We need to transform the binary geometry column to proper wkb.
      // First check whether such a column exists, then query with ST_AsWKB.
      const dummyResult = await c.query(`
        SELECT * FROM '${tableName}' LIMIT 0;
      `);
      const hasBinaryGeoField = Boolean(
        dummyResult.schema.fields.find(
          f => f.name === GEOMETRY_COLUMN && arrow.DataType.isBinary(f.type)
        )
      );

      // TODO don't do this for all columns named 'geom', check whether it's a wkb and not something else!
      // query and transform geometry column to wkb
      const arrowResult = await c.query(
        `SELECT * ${
          hasBinaryGeoField
            ? `EXCLUDE ${GEOMETRY_COLUMN}, ST_AsWKB(${GEOMETRY_COLUMN}) as ${GEOMETRY_COLUMN}`
            : ''
        } FROM '${tableName}';`
      );
      const geoField = arrowResult.schema.fields.find(
        f => f.name === GEOMETRY_COLUMN && arrow.DataType.isBinary(f.type)
      );
      geoField?.metadata.set('ARROW:extension:name', 'geoarrow.wkb');

      fields = data.fields ?? arrowSchemaToFields(arrowResult.schema);
      cols = [...Array(arrowResult.numCols).keys()]
        .map(i => arrowResult.getChildAt(i))
        .filter(col => col) as arrow.Vector[];
    } catch (error) {
      // Known issues:
      // 1) ST_AsWKB binder error, no type match
      console.error('DuckDb table: binary geometry column to wkb', error);
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
      // TODO injest arrow files from disk without loaders
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
}
