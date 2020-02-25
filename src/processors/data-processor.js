// Copyright (c) 2020 Uber Technologies, Inc.
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

import {csvParseRows, csvFormatRows} from 'd3-dsv';
import {range} from 'd3-array';
import {console as globalConsole} from 'global/window';
import assert from 'assert';
import {Analyzer, DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import normalize from '@mapbox/geojson-normalize';
import {ALL_FIELD_TYPES, DATASET_FORMATS} from 'constants/default-settings';
import {notNullorUndefined, parseFieldValue, getSampleData} from 'utils/data-utils';
import KeplerGlSchema from 'schemas';
import {GUIDES_FILE_FORMAT} from 'constants/user-guides';
import {isPlainObject, toArray} from 'utils/utils';

export const ACCEPTED_ANALYZER_TYPES = [
  AnalyzerDATA_TYPES.DATE,
  AnalyzerDATA_TYPES.TIME,
  AnalyzerDATA_TYPES.DATETIME,
  AnalyzerDATA_TYPES.NUMBER,
  AnalyzerDATA_TYPES.INT,
  AnalyzerDATA_TYPES.FLOAT,
  AnalyzerDATA_TYPES.BOOLEAN,
  AnalyzerDATA_TYPES.STRING,
  AnalyzerDATA_TYPES.GEOMETRY,
  AnalyzerDATA_TYPES.GEOMETRY_FROM_STRING,
  AnalyzerDATA_TYPES.PAIR_GEOMETRY_FROM_STRING,
  AnalyzerDATA_TYPES.ZIPCODE,
  AnalyzerDATA_TYPES.ARRAY,
  AnalyzerDATA_TYPES.OBJECT
];

// if any of these value occurs in csv, parse it to null;
const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];

const IGNORE_DATA_TYPES = Object.keys(AnalyzerDATA_TYPES).filter(
  type => !ACCEPTED_ANALYZER_TYPES.includes(type)
);

export const PARSE_FIELD_VALUE_FROM_STRING = {
  [ALL_FIELD_TYPES.boolean]: {
    valid: d => typeof d === 'boolean',
    parse: d => d === 'true' || d === 'True' || d === '1'
  },
  [ALL_FIELD_TYPES.integer]: {
    valid: d => parseInt(d, 10) === d,
    parse: d => parseInt(d, 10)
  },
  [ALL_FIELD_TYPES.timestamp]: {
    valid: (d, field) =>
      ['x', 'X'].includes(field.format) ? typeof d === 'number' : typeof d === 'string',
    parse: (d, field) => (['x', 'X'].includes(field.format) ? Number(d) : d)
  },
  [ALL_FIELD_TYPES.real]: {
    valid: d => parseFloat(d) === d,
    parse: parseFloat
  }
};

/**
 * Process csv data, output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * @param {string} rawData raw csv string
 * @returns {Object} data object `{fields: [], rows: []}`
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
export function processCsvData(rawData) {
  // here we assume the csv file that people uploaded will have first row
  // as name of the column
  // TODO: add a alert at upload csv to remind define first row
  const result = csvParseRows(rawData);
  if (!Array.isArray(result) || result.length < 2) {
    // looks like an empty file, throw error to be catch
    throw new Error('Read File Failed: CSV is empty');
  }

  const [headerRow, ...rows] = result;

  cleanUpFalsyCsvValue(rows);
  // No need to run type detection on every data point
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze({fields: headerRow, allData: rows});

  const fields = getFieldsFromData(sample, headerRow);

  const parsedRows = parseRowsByFields(rows, fields);

  return {fields, rows: parsedRows};
}

/**
 * Parse rows of csv by analyzed field types. So that `'1'` -> `1`, `'True'` -> `true`
 * @param {Array<Array>} rows
 * @param {Array<Object} fields
 */
export function parseRowsByFields(rows, fields) {
  // Edit rows in place
  const geojsonFieldIdx = fields.findIndex(f => f.name === '_geojson');
  fields.forEach(parseCsvRowsByFieldType.bind(null, rows, geojsonFieldIdx));

  return rows;
}
/**
 * Getting sample data for analyzing field type.
 *
 * @param {Array<string>} fields an array of field names
 * @param {Array<Array>} allData
 * @param {Array} sampleCount
 * @returns {Array} formatted fields
 */
export function getSampleForTypeAnalyze({fields, allData, sampleCount = 50}) {
  const total = Math.min(sampleCount, allData.length);
  // const fieldOrder = fields.map(f => f.name);
  const sample = range(0, total, 1).map(d => ({}));

  // collect sample data for each field
  fields.forEach((field, fieldIdx) => {
    // data counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < total) {
      if (i >= allData.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (notNullorUndefined(allData[i][fieldIdx])) {
        sample[j][field] = allData[i][fieldIdx];
        j++;
        i++;
      } else {
        i++;
      }
    }
  });

  return sample;
}

/**
 * Convert falsy value in csv including `'', 'null', 'NULL', 'Null', 'NaN'` to `null`,
 * so that type-analyzer won't detect it as string
 *
 * @param {Array<Array>} rows
 */
function cleanUpFalsyCsvValue(rows) {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      // analyzer will set any fields to 'string' if there are empty values
      // which will be parsed as '' by d3.csv
      // here we parse empty data as null
      // TODO: create warning when deltect `CSV_NULLS` in the data
      if (!rows[i][j] || CSV_NULLS.includes(rows[i][j])) {
        rows[i][j] = null;
      }
    }
  }
}

/**
 * Process uploaded csv file to parse value by field type
 *
 * @param {Array<Array>} rows
 * @param {Number} geo field index
 * @param {Object} field
 * @param {Number} i
 * @returns {void}
 */
export function parseCsvRowsByFieldType(rows, geoFieldIdx, field, i) {
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
        if (geoFieldIdx > -1 && row[geoFieldIdx] && row[geoFieldIdx].properties) {
          row[geoFieldIdx].properties[field.name] = row[i];
        }
      }
    });
  }
}

/**
 * Analyze field types from data in `string` format, e.g. uploaded csv.
 * Assign `type`, `tableFieldIndex` and `format` (timestamp only) to each field
 *
 * @param {Array<Object>} data array of row object
 * @param {Array} fieldOrder array of field names as string
 * @returns {Array<Object>} formatted fields
 * @public
 * @example
 *
 * import {getFieldsFromData} from 'kepler.gl/processors';
 * const data = [{
 *   time: '2016-09-17 00:09:55',
 *   value: '4',
 *   surge: '1.2',
 *   isTrip: 'true',
 *   zeroOnes: '0'
 * }, {
 *   time: '2016-09-17 00:30:08',
 *   value: '3',
 *   surge: null,
 *   isTrip: 'false',
 *   zeroOnes: '1'
 * }, {
 *   time: null,
 *   value: '2',
 *   surge: '1.3',
 *   isTrip: null,
 *   zeroOnes: '1'
 * }];
 *
 * const fieldOrder = ['time', 'value', 'surge', 'isTrip', 'zeroOnes'];
 * const fields = getFieldsFromData(data, fieldOrder);
 * // fields = [
 * // {name: 'time', format: 'YYYY-M-D H:m:s', tableFieldIndex: 1, type: 'timestamp'},
 * // {name: 'value', format: '', tableFieldIndex: 4, type: 'integer'},
 * // {name: 'surge', format: '', tableFieldIndex: 5, type: 'real'},
 * // {name: 'isTrip', format: '', tableFieldIndex: 6, type: 'boolean'},
 * // {name: 'zeroOnes', format: '', tableFieldIndex: 7, type: 'integer'}];
 *
 */
export function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(
    data,
    [{regex: /.*geojson|all_points/g, dataType: 'GEOMETRY'}],
    {ignoredDataTypes: IGNORE_DATA_TYPES}
  );

  const {fieldByIndex} = renameDuplicateFields(fieldOrder);

  const result = fieldOrder.reduce((orderedArray, field, index) => {
    const name = fieldByIndex[index];

    const fieldMeta = metadata.find(m => m.key === field);
    const {type, format} = fieldMeta || {};

    orderedArray[index] = {
      name,
      format,
      tableFieldIndex: index + 1,
      type: analyzerTypeToFieldType(type),
      analyzerType: type
    };
    return orderedArray;
  }, []);

  return result;
}

/**
 * pass in an array of field names, rename duplicated one
 * and return a map from old field index to new name
 *
 * @param {Array} fieldOrder
 * @returns {Object} new field name by index
 */
export function renameDuplicateFields(fieldOrder) {
  return fieldOrder.reduce(
    (accu, field, i) => {
      const {allNames} = accu;
      let fieldName = field;

      // add a counter to duplicated names
      if (allNames.includes(field)) {
        let counter = 0;
        while (allNames.includes(`${field}-${counter}`)) {
          counter++;
        }
        fieldName = `${field}-${counter}`;
      }

      accu.fieldByIndex[i] = fieldName;
      accu.allNames.push(fieldName);

      return accu;
    },
    {allNames: [], fieldByIndex: {}}
  );
}

/**
 * Convert type-analyzer output to kepler.gl field types
 *
 * @param {string} aType
 * @returns {string} corresponding type in `ALL_FIELD_TYPES`
 */
/* eslint-disable complexity */
export function analyzerTypeToFieldType(aType) {
  const {
    DATE,
    TIME,
    DATETIME,
    NUMBER,
    INT,
    FLOAT,
    BOOLEAN,
    STRING,
    GEOMETRY,
    GEOMETRY_FROM_STRING,
    PAIR_GEOMETRY_FROM_STRING,
    ZIPCODE,
    ARRAY,
    OBJECT
  } = AnalyzerDATA_TYPES;

  // TODO: un recognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
    case DATETIME:
      return ALL_FIELD_TYPES.timestamp;
    case FLOAT:
      return ALL_FIELD_TYPES.real;
    case INT:
      return ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case ARRAY:
    case OBJECT:
      // TODO: create a new data type for objects and arrays
      return ALL_FIELD_TYPES.geojson;
    case NUMBER:
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      globalConsole.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
}
/* eslint-enable complexity */

/**
 * Process data where each row is an object, output can be passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * @param {Array<Object>} rawData an array of row object, each object should have the same number of keys
 * @returns {Object} dataset containing `fields` and `rows`
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
export function processRowObject(rawData) {
  if (!Array.isArray(rawData) || !rawData.length) {
    return null;
  }

  const keys = Object.keys(rawData[0]);
  const rows = rawData.map(d => keys.map(key => d[key]));

  // pick samples
  const sampleData = getSampleData(rawData, 500);
  const fields = getFieldsFromData(sampleData, keys);
  const parsedRows = parseRowsByFields(rows, fields);

  return {
    fields,
    rows: parsedRows
  };
}

/**
 * Process GeoJSON [`FeatureCollection`](http://wiki.geojson.org/GeoJSON_draft_version_6#FeatureCollection),
 * output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
 *
 * @param {Object} rawData raw geojson feature collection
 * @returns {Object} dataset containing `fields` and `rows`
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
export function processGeojson(rawData) {
  const normalizedGeojson = normalize(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    const error = new Error(
      `Read File Failed: File is not a valid GeoJSON. Read more about [supported file format](${GUIDES_FILE_FORMAT})`
    );
    throw error;
    // fail to normalize geojson
  }

  // getting all feature fields
  const allDataRows = [];
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
  const fields = allDataRows.reduce((prev, curr) => {
    Object.keys(curr).forEach(key => {
      if (!prev.includes(key)) {
        prev.push(key);
      }
    });
    return prev;
  }, []);

  // make sure each feature has exact same fields
  allDataRows.forEach(d => {
    fields.forEach(f => {
      if (!(f in d)) {
        d[f] = null;
        d._geojson.properties[f] = null;
      }
    });
  });

  return processRowObject(allDataRows);
}

/**
 * On export data to csv
 * @param {Array<Array>} data `dataset.allData` or filtered data `dataset.data`
 * @param {Array<Object>} fields `dataset.fields`
 * @returns {string} csv string
 */
export function formatCsv(data, fields) {
  const columns = fields.map(f => f.name);
  const formattedData = [columns];

  // parse geojson object as string
  data.forEach(row => {
    formattedData.push(row.map((d, i) => parseFieldValue(d, fields[i].type)));
  });

  return csvFormatRows(formattedData);
}

/**
 * Validate input data, adding missing field types, rename duplicate columns
 * @param {Object} data dataset.data
 * @param {Array<Object>} data.fields an array of fields
 * @param {Array<Object>} data.rows an array of data rows
 * @returns {{allData: Array, fields: Array}}
 */
export function validateInputData(data) {
  if (!isPlainObject(data)) {
    assert('addDataToMap Error: dataset.data cannot be null');
    return null;
  } else if (!Array.isArray(data.fields)) {
    assert('addDataToMap Error: expect dataset.data.fields to be an array');
    return null;
  } else if (!Array.isArray(data.rows)) {
    assert('addDataToMap Error: expect dataset.data.rows to be an array');
    return null;
  }

  const {fields, rows} = data;

  // check if all fields has name, format and type
  const allValid = fields.every((f, i) => {
    if (!isPlainObject(f)) {
      assert(`fields needs to be an array of object, but find ${typeof f}`);
      fields[i] = {};
    }

    if (!f.name) {
      assert(`field.name is required but missing in ${JSON.stringify(f)}`);
      // assign a name
      fields[i].name = `column_${i}`;
    }

    if (!ALL_FIELD_TYPES[f.type]) {
      assert(`unknown field type ${f.type}`);
      return false;
    }

    if (!fields.every(field => field.analyzerType)) {
      assert('field missing analyzerType');
      return false;
    }

    // check time format is correct based on first 10 not empty element
    if (f.type === ALL_FIELD_TYPES.timestamp) {
      const sample = findNonEmptyRowsAtField(rows, i, 10).map(r => ({ts: r[i]}));
      const analyzedType = Analyzer.computeColMeta(sample)[0];
      return analyzedType.category === 'TIME' && analyzedType.format === f.format;
    }

    return true;
  });

  if (allValid) {
    return {rows, fields};
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  const sampleData = getSampleForTypeAnalyze({
    fields: fields.map(f => f.name),
    allData: rows
  });
  const fieldOrder = fields.map(f => f.name);
  const meta = getFieldsFromData(sampleData, fieldOrder);
  const updatedFields = fields.map((f, i) => ({
    ...f,
    type: meta[i].type,
    format: meta[i].format,
    analyzerType: meta[i].analyzerType
  }));

  return {fields: updatedFields, rows};
}

function findNonEmptyRowsAtField(rows, fieldIdx, total) {
  const sample = [];
  let i = 0;
  while (sample.length < total && i < rows.length) {
    if (notNullorUndefined(rows[i][fieldIdx])) {
      sample.push(rows[i]);
    }
    i++;
  }
  return sample;
}
/**
 * Process saved kepler.gl json to be pass to [`addDataToMap`](../actions/actions.md#adddatatomap).
 * The json object should contain `datasets` and `config`.
 * @param {Object} rawData
 * @param {Array} rawData.datasets
 * @param {Object} rawData.config
 * @returns {Object} datasets and config `{datasets: {}, config: {}}`
 * @public
 * @example
 * import {addDataToMap} from 'kepler.gl/actions';
 * import {processKeplerglJSON} from 'kepler.gl/processors';
 *
 * dispatch(addDataToMap(processKeplerglJSON(keplerGlJson)));
 */
export function processKeplerglJSON(rawData) {
  return rawData ? KeplerGlSchema.load(rawData.datasets, rawData.config) : null;
}

/**
 * Parse a single or an array of datasets saved using kepler.gl schema
 * @param {Array | Array<Object>} rawData
 */
export function processKeplerglDataset(rawData) {
  if (!rawData) {
    return null;
  }

  const results = KeplerGlSchema.parseSavedData(toArray(rawData));
  return Array.isArray(rawData) ? results : results[0];
}

export const DATASET_HANDLERS = {
  [DATASET_FORMATS.row]: processRowObject,
  [DATASET_FORMATS.geojson]: processGeojson,
  [DATASET_FORMATS.csv]: processCsvData,
  [DATASET_FORMATS.keplergl]: processKeplerglDataset
};

export const Processors = {
  processGeojson,
  processCsvData,
  processRowObject,
  processKeplerglJSON,
  processKeplerglDataset,
  analyzerTypeToFieldType,
  getFieldsFromData,
  parseCsvRowsByFieldType,
  formatCsv
};
