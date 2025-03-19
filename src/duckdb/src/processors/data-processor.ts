// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import normalize from '@mapbox/geojson-normalize';

import {
  getSampleForTypeAnalyze,
  getFieldsFromData,
  generateHashId,
  notNullorUndefined
} from '@kepler.gl/common-utils';
import {ProtoDatasetField} from '@kepler.gl/types';
import {ALL_FIELD_TYPES, GUIDES_FILE_FORMAT_DOC} from '@kepler.gl/constants';
import {processKeplerglJSON} from '@kepler.gl/processors';
import {getApplicationConfig} from '@kepler.gl/utils';

export const CSV_NULLS = /^(null|NULL|Null|NaN|\/N||)$/;

type RowsAsArray = any[][];
type RowsAsObject = Record<string, unknown>[];
type RowData = RowsAsArray | RowsAsObject;

export type ProcessorResult = {
  cols?: arrow.Vector[];
  rows: RowData;
  fields: ProtoDatasetField[];
};

enum COLUMN_TYPES {
  GEOMETRY = 'GEOMETRY',
  BOOLEAN = 'BOOLEAN',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  TIME = 'TIME',
  DATE = 'DATE',
  TIMESTAMP = 'TIMESTAMP',
  VARCHAR = 'VARCHAR'
}
// https://duckdb.org/docs/data/csv/auto_detection.html#type-detection
export const COLUMN_TYPES_PRIORITIES = [
  'GEOMETRY',
  'BOOLEAN',
  'INTEGER',
  'FLOAT',
  'TIME',
  'DATE',
  'TIMESTAMP',
  'VARCHAR'
];

export function columnTypeToFieldType(columnType: string): string | null {
  switch (columnType) {
    case COLUMN_TYPES.BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case COLUMN_TYPES.DATE:
      return ALL_FIELD_TYPES.date;
    case COLUMN_TYPES.INTEGER:
      return ALL_FIELD_TYPES.integer;
    case COLUMN_TYPES.FLOAT:
      return ALL_FIELD_TYPES.real;
    case COLUMN_TYPES.VARCHAR:
      return ALL_FIELD_TYPES.string;
    case COLUMN_TYPES.TIMESTAMP:
      return ALL_FIELD_TYPES.timestamp;
    case COLUMN_TYPES.GEOMETRY:
      return ALL_FIELD_TYPES.geojson;
    default:
      // is there any other type we didn't cover?
      console.warn(`Unsupported DuckDB Column type: ${columnType}`);
      return null;
  }
}

export function fieldTypeToColumnType(fieldType: string): string | null {
  switch (fieldType) {
    case ALL_FIELD_TYPES.boolean:
      return COLUMN_TYPES.BOOLEAN;
    case ALL_FIELD_TYPES.date:
      return COLUMN_TYPES.DATE;
    case ALL_FIELD_TYPES.integer:
      return COLUMN_TYPES.INTEGER;
    case ALL_FIELD_TYPES.real:
      return COLUMN_TYPES.FLOAT;
    case ALL_FIELD_TYPES.string:
      return COLUMN_TYPES.VARCHAR;
    case ALL_FIELD_TYPES.timestamp:
      return COLUMN_TYPES.TIMESTAMP;
    case ALL_FIELD_TYPES.geojson:
      return COLUMN_TYPES.GEOMETRY;
    default:
      // is there any other type we didn't cover?
      console.warn(`Unsupported Field type for DuckDb: ${fieldType}`);
      return null;
  }
}

/*
 * Process uploaded exported Keplergl json map.
 * We need to populate field with proper DuckDb compatible type.
 */
// TODO: merge with logic from processCsvRowObject. Different formats: [[]] vs [{}]
export async function processKeplerglJSONforDuckDb(
  keplerJson
): Promise<ReturnType<typeof processKeplerglJSON>> {
  const res = processKeplerglJSON(keplerJson);

  const datasets = res?.datasets || [];
  for (const dataset of datasets) {
    const rowsAll = dataset.data.rows;
    const fieldsAll = dataset.data.fields;

    const header = fieldsAll.map(f => f.name);
    const sample = getSampleForTypeAnalyze({fields: header, rows: rowsAll});

    const schema =
      sample.length > 0
        ? await sniffCsvSchema(sample)
        : fieldsAll.reduce((acc, field) => {
            acc[field.name] = fieldTypeToColumnType(field.type);
            return acc;
          }, {});
    const fieldsUpd = consolidateFieldTypes(dataset.data.fields, schema);

    dataset.data.fields = fieldsAll.map((f, i) => {
      return {...fieldsUpd[i], ...f};
    });
  }

  return res;
}

/*
 * Process uploaded csv returned by loaders.gl as row object and string value
 */
export async function processCsvRowObject(
  rawData: Record<string, string | null>[]
): Promise<ProcessorResult> {
  if (!Array.isArray(rawData) || !rawData.length) {
    return {
      fields: [],
      rows: []
    };
  }

  const header = Object.keys(rawData[0]); // [lat, lng, value]

  // row object can still contain values like `Null` or `N/A`
  cleanUpFalsyCsvValue(rawData);
  const sample = getSampleForTypeAnalyze({fields: header, rows: rawData});
  // add sample data to duckdb and get schema
  const schema = await sniffCsvSchema(sample);

  const fieldsWAnalyzerType = getFieldsFromData(sample, header);

  const fields = consolidateFieldTypes(fieldsWAnalyzerType, schema);

  return {rows: rawData, fields};
}

function cleanUpFalsyCsvValue(rows: RowData): void {
  const re = new RegExp(CSV_NULLS, 'g');
  for (let i = 0; i < rows.length; i++) {
    Object.keys(rows[i]).forEach(key => {
      // here we parse empty data as null
      if (typeof rows[i][key] === 'string' && (rows[i][key] as string).match(re)) {
        rows[i][key] = null;
      }
    });
  }
}

// align type analyzer types with DuckDB csv auto detected column types
function consolidateFieldTypes(fields, schema) {
  return fields.map(field => {
    const columnName = field.name;

    const detectedColumnType = schema[columnName];

    // TODO columnTypeToFieldType tranforms detected timestamps to string,
    // completely breaking time filter logic.
    // const fieldType = columnTypeToFieldType(detectedColumnType) || field.type;

    return {
      ...field,
      // type: fieldType,
      duckDBColumnType: detectedColumnType
    };
  });
}

function toCSVRow(row: unknown[]): string {
  return `${row
    .map(r => {
      const rToStr = notNullorUndefined(r) ? String(r).replace(/"/g, '\\"') : '';
      return rToStr.includes(',') ? `"${rToStr}"` : rToStr;
    })
    .join(',')}\n`;
}

// Use DucckDB to detect csv column schema
async function sniffCsvSchema(sample: RowData) {
  if (!Array.isArray(sample) || sample.length < 0) {
    return;
  }
  const headerRow = toCSVRow(Object.keys(sample[0]));

  const csvContent = (sample as (any[] | Record<string, unknown>)[]).reduce(
    (accu: string, row) => `${accu}${toCSVRow(Object.values(row))}`,
    headerRow
  );

  const db = getApplicationConfig().database;
  if (!db) {
    console.error('The database is not configured properly.');
    return;
  }
  const c = await db.connect();

  const fileName = generateHashId();
  await db.registerFileText(`${fileName}-${generateHashId}.csv`, csvContent);

  // https://duckdb.org/docs/data/csv/auto_detection.html
  const result = await c.query(`
        FROM sniff_csv('${fileName}-${generateHashId}.csv', 
        sample_size = 500,
        auto_type_candidates = ['FLOAT', 'INTEGER', 'TIMESTAMP', 'DATE', 'TIME', 'VARCHAR', 'BOOLEAN']);
    `);

  const schemaResult = result.toArray().map(row => row.toJSON());

  const columns = schemaResult[0].Columns;
  const schema = {};
  for (let i = 0; i < columns.length; i++) {
    schema[columns.get(i).name] = columns.get(i).type;
  }

  return schema;
}

export function processGeojson(rawData: unknown): ProcessorResult {
  const normalizedGeojson = normalize(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    const error = new Error(
      `Read File Failed: File is not a valid GeoJSON. Read more about [supported file format](${GUIDES_FILE_FORMAT_DOC})`
    );
    throw error;
  }

  // @ts-expect-error Don't pass empty fields, as duck db outputs an empty dataset
  return {
    rows: normalizedGeojson
    // TODO get fields to preserve field names?
    // fields: []
  };
}
