// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Table as ApacheArrowTable, Field as ArrowField, Column as ArrowColumn} from 'apache-arrow';
import {csvParseRows} from 'd3-dsv';
import {Console} from 'global/console';
import {DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import normalize from '@mapbox/geojson-normalize';
import {
  ALL_FIELD_TYPES,
  DATASET_FORMATS,
  GUIDES_FILE_FORMAT_DOC,
  ARROW_GEO_METADATA_KEY
} from '@kepler.gl/constants';
import {ProcessorResult, Field} from '@kepler.gl/types';
import {
  arrowDataTypeToAnalyzerDataType,
  arrowDataTypeToFieldType,
  notNullorUndefined,
  hasOwnProperty,
  isPlainObject,
  analyzerTypeToFieldType,
  getSampleForTypeAnalyze,
  getFieldsFromData,
  toArray
} from '@kepler.gl/utils';
import {KeplerGlSchema, ParsedDataset, SavedMap, LoadedMap} from '@kepler.gl/schemas';
import {Feature} from '@nebula.gl/edit-modes';

// if any of these value occurs in csv, parse it to null;
// const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];
// matches empty string
export const CSV_NULLS = /^(null|NULL|Null|NaN|\/N||)$/;

function tryParseJsonString(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export const PARSE_FIELD_VALUE_FROM_STRING = {
  [ALL_FIELD_TYPES.boolean]: {
    valid: (d: unknown): boolean => typeof d === 'boolean',
    parse: (d: unknown): boolean => d === 'true' || d === 'True' || d === 'TRUE' || d === '1'
  },
  [ALL_FIELD_TYPES.integer]: {
    // @ts-ignore
    valid: (d: unknown): boolean => parseInt(d, 10) === d,
    // @ts-ignore
    parse: (d: unknown): number => parseInt(d, 10)
  },
  [ALL_FIELD_TYPES.timestamp]: {
    valid: (d: unknown, field: Field): boolean =>
      ['x', 'X'].includes(field.format) ? typeof d === 'number' : typeof d === 'string',
    parse: (d: any, field: Field) => (['x', 'X'].includes(field.format) ? Number(d) : d)
  },
  [ALL_FIELD_TYPES.real]: {
    // @ts-ignore
    valid: (d: unknown): boolean => parseFloat(d) === d,
    // Note this will result in NaN for some string
    parse: parseFloat
  },
  [ALL_FIELD_TYPES.object]: {
    valid: isPlainObject,
    parse: tryParseJsonString
  },

  [ALL_FIELD_TYPES.array]: {
    valid: Array.isArray,
    parse: tryParseJsonString
  }
};

/**
 * Process csv data, output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * @param rawData raw csv string
 * @returns data object `{fields: [], rows: []}` can be passed to addDataToMaps
 * @public
 * @example
 * import {processCsvData} from 'kepler.gl/processors';
 *
 * const testData = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,id,time,begintrip_ts_utc,begintrip_ts_local,date
 * 2016-09-17 00:09:55,29.9900937,31.2590542,driver_analytics,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
 * 2016-09-17 00:10:56,29.9927699,31.2461142,driver_analytics,1472688000000,False,2,2016-09-23T00:00:00.000Z,2016-10-01 09:46:37+00:00,2016-10-01 16:46:37+00:00,2016-09-23
 * 2016-09-17 00:11:56,29.9907261,31.2312742,driver_analytics,1472688000000,False,3,2016-09-23T00:00:00.000Z,,,2016-09-23
 * 2016-09-17 00:12:58,29.9870074,31.2175827,driver_analytics,1472688000000,False,4,2016-09-23T00:00:00.000Z,,,2016-09-23`
 *
 * const dataset = {
 *  info: {id: 'test_data', label: 'My Csv'},
 *  data: processCsvData(testData)
 * };
 *
 * dispatch(addDataToMap({
 *  datasets: [dataset],
 *  options: {centerMap: true, readOnly: true}
 * }));
 */
export function processCsvData(rawData: unknown[][] | string, header?: string[]): ProcessorResult {
  let rows: unknown[][] | undefined;
  let headerRow: string[] | undefined;

  if (typeof rawData === 'string') {
    const parsedRows: string[][] = csvParseRows(rawData);

    if (!Array.isArray(parsedRows) || parsedRows.length < 2) {
      // looks like an empty file, throw error to be catch
      throw new Error('process Csv Data Failed: CSV is empty');
    }
    headerRow = parsedRows[0];
    rows = parsedRows.slice(1);
  } else if (Array.isArray(rawData) && rawData.length) {
    rows = rawData;
    headerRow = header;

    if (!Array.isArray(headerRow)) {
      // if data is passed in as array of rows and missing header
      // assume first row is header
      // @ts-ignore
      headerRow = rawData[0];
      rows = rawData.slice(1);
    }
  }

  if (!rows || !headerRow) {
    throw new Error('invalid input passed to processCsvData');
  }

  // here we assume the csv file that people uploaded will have first row
  // as name of the column

  cleanUpFalsyCsvValue(rows);
  // No need to run type detection on every data point
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze({fields: headerRow, rows});
  const fields = getFieldsFromData(sample, headerRow);
  const parsedRows = parseRowsByFields(rows, fields);

  return {fields, rows: parsedRows};
}

/**
 * Parse rows of csv by analyzed field types. So that `'1'` -> `1`, `'True'` -> `true`
 * @param rows
 * @param fields
 */
export function parseRowsByFields(rows: any[][], fields: Field[]) {
  // Edit rows in place
  const geojsonFieldIdx = fields.findIndex(f => f.name === '_geojson');
  fields.forEach(parseCsvRowsByFieldType.bind(null, rows, geojsonFieldIdx));

  return rows;
}

/**
 * Convert falsy value in csv including `'', 'null', 'NULL', 'Null', 'NaN'` to `null`,
 * so that type-analyzer won't detect it as string
 *
 * @param rows
 */
function cleanUpFalsyCsvValue(rows: unknown[][]): void {
  const re = new RegExp(CSV_NULLS, 'g');
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      // analyzer will set any fields to 'string' if there are empty values
      // which will be parsed as '' by d3.csv
      // here we parse empty data as null
      // TODO: create warning when deltect `CSV_NULLS` in the data
      if (typeof rows[i][j] === 'string' && (rows[i][j] as string).match(re)) {
        rows[i][j] = null;
      }
    }
  }
}

/**
 * Process uploaded csv file to parse value by field type
 *
 * @param rows
 * @param geoFieldIdx field index
 * @param field
 * @param i
 */
export function parseCsvRowsByFieldType(
  rows: unknown[][],
  geoFieldIdx: number,
  field: Field,
  i: number
): void {
  const parser = PARSE_FIELD_VALUE_FROM_STRING[field.type];
  if (parser) {
    // check first not null value of it's already parsed
    const first = rows.find(r => notNullorUndefined(r[i]));
    if (!first || parser.valid(first[i], field)) {
      return;
    }
    rows.forEach(row => {
      // parse string value based on field type
      if (row[i] !== null) {
        row[i] = parser.parse(row[i], field);
        if (
          geoFieldIdx > -1 &&
          isPlainObject(row[geoFieldIdx]) &&
          // @ts-ignore
          hasOwnProperty(row[geoFieldIdx], 'properties')
        ) {
          // @ts-ignore
          row[geoFieldIdx].properties[field.name] = row[i];
        }
      }
    });
  }
}

/* eslint-enable complexity */

/**
 * Process data where each row is an object, output can be passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * NOTE: This function may mutate input.
 * @param rawData an array of row object, each object should have the same number of keys
 * @returns dataset containing `fields` and `rows`
 * @public
 * @example
 * import {addDataToMap} from 'kepler.gl/actions';
 * import {processRowObject} from 'kepler.gl/processors';
 *
 * const data = [
 *  {lat: 31.27, lng: 127.56, value: 3},
 *  {lat: 31.22, lng: 126.26, value: 1}
 * ];
 *
 * dispatch(addDataToMap({
 *  datasets: {
 *    info: {label: 'My Data', id: 'my_data'},
 *    data: processRowObject(data)
 *  }
 * }));
 */
export function processRowObject(rawData: object[]): ProcessorResult {
  if (!Array.isArray(rawData)) {
    return null;
  } else if (!rawData.length) {
    // data is empty
    return {
      fields: [],
      rows: []
    };
  }

  const keys = Object.keys(rawData[0]); // [lat, lng, value]
  const rows = rawData.map(d => keys.map(key => d[key])); // [[31.27, 127.56, 3]]

  // row object an still contain values like `Null` or `N/A`
  cleanUpFalsyCsvValue(rows);

  return processCsvData(rows, keys);
}

/**
 * Process GeoJSON [`FeatureCollection`](http://wiki.geojson.org/GeoJSON_draft_version_6#FeatureCollection),
 * output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * NOTE: This function may mutate input.
 *
 * @param rawData raw geojson feature collection
 * @returns dataset containing `fields` and `rows`
 * @public
 * @example
 * import {addDataToMap} from 'kepler.gl/actions';
 * import {processGeojson} from 'kepler.gl/processors';
 *
 * const geojson = {
 * 	"type" : "FeatureCollection",
 * 	"features" : [{
 * 		"type" : "Feature",
 * 		"properties" : {
 * 			"capacity" : "10",
 * 			"type" : "U-Rack"
 * 		},
 * 		"geometry" : {
 * 			"type" : "Point",
 * 			"coordinates" : [ -71.073283, 42.417500 ]
 * 		}
 * 	}]
 * };
 *
 * dispatch(addDataToMap({
 *  datasets: {
 *    info: {
 *      label: 'Sample Taxi Trips in New York City',
 *      id: 'test_trip_data'
 *    },
 *    data: processGeojson(geojson)
 *  }
 * }));
 */
export function processGeojson(rawData: unknown): ProcessorResult {
  const normalizedGeojson = normalize(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    const error = new Error(
      `Read File Failed: File is not a valid GeoJSON. Read more about [supported file format](${GUIDES_FILE_FORMAT_DOC})`
    );
    throw error;
    // fail to normalize geojson
  }

  // getting all feature fields
  const allDataRows: Array<{_geojson: Feature} & keyof Feature> = [];
  for (let i = 0; i < normalizedGeojson.features.length; i++) {
    const f = normalizedGeojson.features[i];
    if (f.geometry) {
      allDataRows.push({
        // add feature to _geojson field
        _geojson: f,
        ...(f.properties || {})
      });
    }
  }
  // get all the field
  const fields = allDataRows.reduce<string[]>((accu, curr) => {
    Object.keys(curr).forEach(key => {
      if (!accu.includes(key)) {
        accu.push(key);
      }
    });
    return accu;
  }, []);

  // make sure each feature has exact same fields
  allDataRows.forEach(d => {
    fields.forEach(f => {
      if (!(f in d)) {
        d[f] = null;
        if (d._geojson.properties) {
          d._geojson.properties[f] = null;
        }
      }
    });
  });

  return processRowObject(allDataRows);
}

/**
 * Process saved kepler.gl json to be pass to [`addDataToMap`](../actions/actions.md#adddatatomap).
 * The json object should contain `datasets` and `config`.
 * @param rawData
 * @param schema
 * @returns datasets and config `{datasets: {}, config: {}}`
 * @public
 * @example
 * import {addDataToMap} from 'kepler.gl/actions';
 * import {processKeplerglJSON} from 'kepler.gl/processors';
 *
 * dispatch(addDataToMap(processKeplerglJSON(keplerGlJson)));
 */
export function processKeplerglJSON(rawData: SavedMap, schema = KeplerGlSchema): LoadedMap | null {
  return rawData ? schema.load(rawData.datasets, rawData.config) : null;
}

/**
 * Parse a single or an array of datasets saved using kepler.gl schema
 * @param rawData
 * @param schema
 */
export function processKeplerglDataset(
  rawData: object | object[],
  schema = KeplerGlSchema
): ParsedDataset | ParsedDataset[] | null {
  if (!rawData) {
    return null;
  }

  const results = schema.parseSavedData(toArray(rawData));
  if (!results) {
    return null;
  }
  return Array.isArray(rawData) ? results : results[0];
}

/**
 * Parse a arrow table with geometry columns and return a dataset
 *
 * @param arrowTable the arrow table to parse
 * @returns dataset containing `fields` and `rows` or null
 */
export function processArrowTable(arrowTable: ApacheArrowTable): ProcessorResult | null {
  if (!arrowTable) {
    return null;
  }
  const metadata = arrowTable.schema.metadata;
  // get geometry columns if metadata has key 'geo'
  let geometryColumns = [];
  if (metadata.get(ARROW_GEO_METADATA_KEY) !== undefined) {
    // load geo metadata
    // parse metadata string to JSON object
    const geoMeta = JSON.parse(metadata.get(ARROW_GEO_METADATA_KEY) || '');
    // check if schema_version in geoMeta equals to '0.1.0'
    const SCHEMA_VERSION = '0.1.0';
    if (geoMeta.schema_version !== SCHEMA_VERSION) {
      Console.warn('Apache Arrow schema version not supported');
    }
    // get all geometry columns
    geometryColumns = geoMeta.columns;
  }

  const fields: Field[] = [];

  // parse fields
  arrowTable.schema.fields.forEach((field: ArrowField, index: number) => {
    const isGeometryColumn =
      geometryColumns[field.name] !== undefined ||
      field.metadata.get('ARROW:extension:name')?.startsWith('geoarrow');
    fields.push({
      name: field.name,
      id: field.name,
      displayName: field.name,
      format: '',
      fieldIdx: index,
      type: isGeometryColumn ? ALL_FIELD_TYPES.geojson : arrowDataTypeToFieldType(field.type),
      analyzerType: isGeometryColumn
        ? AnalyzerDATA_TYPES.GEOMETRY
        : arrowDataTypeToAnalyzerDataType(field.type),
      valueAccessor: (dc: any) => d => {
        return dc.valueAt(d.index, index);
      }
    });
  });

  // return empty rows and use raw arrow table to construct column-wise data container
  return {fields, rows: [], rawData: arrowTable};
}

export const DATASET_HANDLERS = {
  [DATASET_FORMATS.row]: processRowObject,
  [DATASET_FORMATS.geojson]: processGeojson,
  [DATASET_FORMATS.csv]: processCsvData,
  [DATASET_FORMATS.keplergl]: processKeplerglDataset
};

export const Processors: {
  processGeojson: typeof processGeojson;
  processCsvData: typeof processCsvData;
  processRowObject: typeof processRowObject;
  processKeplerglJSON: typeof processKeplerglJSON;
  processKeplerglDataset: typeof processKeplerglDataset;
  analyzerTypeToFieldType: typeof analyzerTypeToFieldType;
  getFieldsFromData: typeof getFieldsFromData;
  parseCsvRowsByFieldType: typeof parseCsvRowsByFieldType;
} = {
  processGeojson,
  processCsvData,
  processRowObject,
  processKeplerglJSON,
  processKeplerglDataset,
  analyzerTypeToFieldType,
  getFieldsFromData,
  parseCsvRowsByFieldType
};
