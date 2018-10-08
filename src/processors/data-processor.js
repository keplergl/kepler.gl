// Copyright (c) 2018 Uber Technologies, Inc.
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
import {ALL_FIELD_TYPES, GEOJSON_FIELDS} from 'constants/default-settings';
import {notNullorUndefined} from 'utils/data-utils';

// if any of these value occurs in csv, parse it to null;
const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN'];

export function processCsvData(rawData) {

  // here we assume the csv file that people uploaded will have first row
  // as name of the column
  //TODO: add a alert at upload csv to remind define first row
  const [headerRow, ...rows] = csvParseRows(rawData);

  if (!rows.length || !headerRow) {
    // looks like an empty file
    // resolve null, and catch them later in one place
    return null;
  }

  cleanUpFalsyCsvValue(rows);
  // No need to run type detection on every data point
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze({fields: headerRow, allData: rows});

  const fields = getFieldsFromData(sample, headerRow);

  fields.forEach(parseCsvDataByFieldType.bind(null, rows));

  return {fields, rows};
}

/**
 * get fields from csv data
 *
 * @param {array} fields - an array of fields name
 * @param {array} allData
 * @param {array} sampleCount
 * @returns {array} formatted fields
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
 * @param {array} rows
 * @param {object} field
 * @param {number} i
 * @returns {void}
 */
export function parseCsvDataByFieldType(rows, field, i) {
  const unixFormat = ['x', 'X'];

  rows.forEach(row => {
    if (row[i] !== null) {
      switch (field.type) {
        case ALL_FIELD_TYPES.real:
          row[i] = parseFloat(row[i]);
          break;

        // TODO: timestamp can be either '1495827326' or '2016-03-10 11:20'
        // if it's '1495827326' we pass it to int
        case ALL_FIELD_TYPES.timestamp:
          row[i] = unixFormat.includes(field.format) ? Number(row[i]) : row[i];
          break;

        case ALL_FIELD_TYPES.integer:
          row[i] = parseInt(row[i], 10);
          break;

        case ALL_FIELD_TYPES.boolean:
          // 0 and 1 only field can also be boolean
          row[i] = row[i] === 'true' || row[i] === 'True' || row[i] === '1';
          break;

        default:
          break;
      }
    }
  });
}

/**
 * get fields from csv data
 *
 * @param {array} data
 * @param {array} fieldOrder
 * @returns {array} formatted fields
 */
export function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(data, [
    {regex: /.*geojson|all_points/g, dataType: 'GEOMETRY'}
  ]);

  const {fieldByIndex} = renameDuplicateFields(fieldOrder);

  return fieldOrder.reduce((orderedArray, field, index) => {
    const name = fieldByIndex[index];
    const fieldMeta = metadata.find(m => m.key === field);
    const {type, format} = fieldMeta || {};

    orderedArray[index] = {
      name,
      format,

      // need this for mapbuilder conversion: filter type detection
      // category,
      tableFieldIndex: index + 1,
      type: analyzerTypeToFieldType(type)
    };

    return orderedArray;
  }, []);
}

/**
 * pass in an array of field names, rename duplicated one
 * and return a map from old field index to new name
 *
 * @param {array} fieldOrder
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
 * Map Analyzer types to local field types
 *
 * @param {string} aType
 * @returns {string} corresponding type in ALL_FIELD_TYPES
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
    CITY,
    GEOMETRY,
    GEOMETRY_FROM_STRING,
    ZIPCODE,
    PAIR_GEOMETRY_FROM_STRING
  } = AnalyzerDATA_TYPES;

  // TODO: un recognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
    case DATETIME:
      return ALL_FIELD_TYPES.timestamp;
    case NUMBER:
    case FLOAT:
      return ALL_FIELD_TYPES.real;
    case INT:
      return ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
      return ALL_FIELD_TYPES.geojson;
    case STRING:
    case CITY:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      globalConsole.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
}
/* eslint-enable complexity */

/*
 * Process rawData where each row is an object
 */
export function processRowObject(rawData) {
  if (!rawData.length) {
    return null;
  }

  const keys = Object.keys(rawData[0]);
  const rows = rawData.map(d => keys.map(key => d[key]));
  const fields = getFieldsFromData(rawData, keys);

  return {
    fields,
    rows
  };
}

export function processGeojson(rawData) {
  const normalizedGeojson = normalize(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    // fail to normalize geojson
    return null;
  }

  // getting all feature fields
  const allData = normalizedGeojson.features.reduce((accu, f, i) => {
    if (f.geometry) {
      accu.push({
        // add feature to _geojson field
        _geojson: f,
        ...(f.properties || {})
      });
    }
    return accu;
  }, []);

  // get all the field
  const fields = allData.reduce((prev, curr) => {
    Object.keys(curr).forEach(key => {
      if (!prev.includes(key)) {
        prev.push(key);
      }
    });
    return prev;
  }, []);

  // make sure each feature has exact same fields
  allData.forEach(d => {
    fields.forEach(f => {
      if (!(f in d)) {
        d[f] = null;
      }
    });
  });

  return processRowObject(allData);
}

/**
 * On export data to csv
 * @param data
 * @param fields
 */
export function formatCsv(data, fields) {
  const columns = fields.map(f => f.name);
  const formattedData = [columns];

  // parse geojson object as string
  data.forEach(row => {
    formattedData.push(
      row.map(
        (d, i) => d && GEOJSON_FIELDS.geojson.includes(fields[i].name) ?
          JSON.stringify(d) : d
      )
    )
  });

  return csvFormatRows(formattedData);
}

/**
 * @param data
 * @returns {{allData: Array, fields: Array}}
 */
export function validateInputData(data) {
  // TODO: add test
  /*
   * expected input data format
   * {
   *   fields: [],
   *   rows: []
   * }
   */
  let proceed = true;
  if (!data) {
    assert('receiveVisData: data cannot be null');
    proceed = false;
  } else if (!Array.isArray(data.fields)) {
    assert('receiveVisData: expect data.fields to be an array');
    proceed = false;
  } else if (!Array.isArray(data.rows)) {
    assert('receiveVisData: expect data.rows to be an array');
    proceed = false;
  }

  if (!proceed) {
    return null;
  }

  const {fields, rows} = data;

  // check if all fields has name, format and type
  const allValid = fields.every((f, i) => {
    if (typeof f !== 'object') {
      assert(`fields needs to be an array of object, but find ${f}`);
      return false;
    }

    if (!f.name) {
      assert(
        `field.name is required but missing in field ${JSON.stringify(f)}`
      );
      // assign a name
      f.name = `column_${i}`;
    }

    if (!ALL_FIELD_TYPES[f.type]) {
      assert(`unknown field type ${f.type}`);
      return false;
    }

    return f.type !== ALL_FIELD_TYPES.timestamp || typeof f.format === 'string';
  });

  if (allValid) {
    return {rows, fields};
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  const sampleData = getSampleForTypeAnalyze({fields: fields.map(f => f.name), allData: rows});
  const fieldOrder = fields.map(f => f.name);
  const meta = getFieldsFromData(sampleData, fieldOrder);
  const updatedFields = fields.map((f, i) => ({
    ...f,
    type: meta[i].type,
    format: meta[i].format
  }));

  return {fields: updatedFields, rows};
}

export default {
  processGeojson,
  processCsvData,
  processRowObject,
  analyzerTypeToFieldType,
  getFieldsFromData,
  parseCsvDataByFieldType
};
