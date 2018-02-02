import {csvParse, csvParseRows, csvFormatRows} from 'd3-dsv';
import {console as globalConsole} from 'global/window';
import {Analyzer, DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import normalize from 'geojson-normalize';

import {ALL_FIELD_TYPES} from '../constants/default-settings';

export function processCsvData(rawData) {
  // here we assume the csv file that people uploaded will have first row
  // as name of the column
  //TODO: add a alert at upload csv to remind define first row
  const [headerRow, ...rows] = csvParseRows(rawData);

  // NOTE: if rawData has duplicated column name, this will error out
  const rowObjs = csvParse(rawData);

  // analyzer will set any fields to 'string' if there are empty values
  // which will be parsed as '' by d3.csv
  // here we parse empty data as null

  rowObjs.forEach((row, rowIdx) => {
    Object.keys(row).forEach((key, i) => {
      // 'undefined' can happen if there
      // is no end-of-line marker, and cause problems down stream
      // TODO: figure out why d3 isn't handling this.
      if (row[key] === '' || row[key] === undefined) {
        row[key] = null;
        rows[rowIdx][i] = null;
      }
    });
  });

  if (!rowObjs.length || !headerRow) {
    // looks like an empty file
    // resolve null, and catch them later in one place
    return null;
  }

  const fields = getFieldsFromData(rowObjs, headerRow);
  fields.forEach(parseCsvDataByFieldType.bind(null, rows));

  return {fields, rows};
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

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
      rows.forEach(row => {
        row[i] = parseFloat(row[i]);
      });
      break;

    // TODO: timestamp can be either '1495827326' or '2016-03-10 11:20'
    // if it's '1495827326' we pass it to int
    case ALL_FIELD_TYPES.timestamp:
      rows.forEach(row => {
        row[i] =
          row[i] !== null && row[i] !== '' && unixFormat.includes(field.format)
            ? Number(row[i])
            : row[i];
      });

      break;

    case ALL_FIELD_TYPES.integer:
      rows.forEach(row => {
        row[i] = row[i] === null ? row[i] : parseInt(row[i], 10);
      });
      break;

    case ALL_FIELD_TYPES.boolean:
      rows.forEach(row => {
        row[i] =
          row[i] === null ? row[i] : row[i] === 'true' || row[i] === 'True';
      });
      break;

    default:
      break;
  }
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
    const {type, format, category} = fieldMeta || {};

    orderedArray[index] = {
      name,
      format,
      category, // need this for mapbuilder conversion: filter type detection
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

export function formatCsv(data, fields) {
  const columns = fields.map(f => f.name);
  return csvFormatRows([columns, ...data]);
}
