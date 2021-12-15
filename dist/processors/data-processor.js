"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processCsvData = processCsvData;
exports.parseRowsByFields = parseRowsByFields;
exports.getSampleForTypeAnalyze = getSampleForTypeAnalyze;
exports.parseCsvRowsByFieldType = parseCsvRowsByFieldType;
exports.getFieldsFromData = getFieldsFromData;
exports.renameDuplicateFields = renameDuplicateFields;
exports.analyzerTypeToFieldType = analyzerTypeToFieldType;
exports.processRowObject = processRowObject;
exports.processGeojson = processGeojson;
exports.formatCsv = formatCsv;
exports.validateInputData = validateInputData;
exports.processKeplerglJSON = processKeplerglJSON;
exports.processKeplerglDataset = processKeplerglDataset;
exports.Processors = exports.DATASET_HANDLERS = exports.PARSE_FIELD_VALUE_FROM_STRING = exports.CSV_NULLS = exports.ACCEPTED_ANALYZER_TYPES = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _d3Dsv = require("d3-dsv");

var _d3Array = require("d3-array");

var _window = require("global/window");

var _assert = _interopRequireDefault(require("assert"));

var _typeAnalyzer = require("type-analyzer");

var _geojsonNormalize = _interopRequireDefault(require("@mapbox/geojson-normalize"));

var _defaultSettings = require("../constants/default-settings");

var _dataUtils = require("../utils/data-utils");

var _schemas = _interopRequireDefault(require("../schemas"));

var _userGuides = require("../constants/user-guides");

var _utils = require("../utils/utils");

var _PARSE_FIELD_VALUE_FR, _DATASET_HANDLERS;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ACCEPTED_ANALYZER_TYPES = [_typeAnalyzer.DATA_TYPES.DATE, _typeAnalyzer.DATA_TYPES.TIME, _typeAnalyzer.DATA_TYPES.DATETIME, _typeAnalyzer.DATA_TYPES.NUMBER, _typeAnalyzer.DATA_TYPES.INT, _typeAnalyzer.DATA_TYPES.FLOAT, _typeAnalyzer.DATA_TYPES.BOOLEAN, _typeAnalyzer.DATA_TYPES.STRING, _typeAnalyzer.DATA_TYPES.GEOMETRY, _typeAnalyzer.DATA_TYPES.GEOMETRY_FROM_STRING, _typeAnalyzer.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING, _typeAnalyzer.DATA_TYPES.ZIPCODE, _typeAnalyzer.DATA_TYPES.ARRAY, _typeAnalyzer.DATA_TYPES.OBJECT]; // if any of these value occurs in csv, parse it to null;
// const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];
// matches empty string

exports.ACCEPTED_ANALYZER_TYPES = ACCEPTED_ANALYZER_TYPES;
var CSV_NULLS = /^(null|NULL|Null|NaN|\/N||)$/;
exports.CSV_NULLS = CSV_NULLS;
var IGNORE_DATA_TYPES = Object.keys(_typeAnalyzer.DATA_TYPES).filter(function (type) {
  return !ACCEPTED_ANALYZER_TYPES.includes(type);
});
var PARSE_FIELD_VALUE_FROM_STRING = (_PARSE_FIELD_VALUE_FR = {}, (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES["boolean"], {
  valid: function valid(d) {
    return typeof d === 'boolean';
  },
  parse: function parse(d) {
    return d === 'true' || d === 'True' || d === 'TRUE' || d === '1';
  }
}), (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES.integer, {
  valid: function valid(d) {
    return parseInt(d, 10) === d;
  },
  parse: function parse(d) {
    return parseInt(d, 10);
  }
}), (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES.timestamp, {
  valid: function valid(d, field) {
    return ['x', 'X'].includes(field.format) ? typeof d === 'number' : typeof d === 'string';
  },
  parse: function parse(d, field) {
    return ['x', 'X'].includes(field.format) ? Number(d) : d;
  }
}), (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES.array, {
  valid: function valid(d) {
    return Array.isArray(d);
  },
  parse: function parse(d) {
    return JSON.parse(d);
  }
}), (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES.real, {
  valid: function valid(d) {
    return parseFloat(d) === d;
  },
  // Note this will result in NaN for some string
  parse: parseFloat
}), _PARSE_FIELD_VALUE_FR);
/**
 * Process csv data, output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * @param rawData raw csv string
 * @returns  data object `{fields: [], rows: []}` can be passed to addDataToMaps
 * @type {typeof import('./data-processor').processCsvData}
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

exports.PARSE_FIELD_VALUE_FROM_STRING = PARSE_FIELD_VALUE_FROM_STRING;

function processCsvData(rawData, header) {
  var rows;
  var headerRow;

  if (typeof rawData === 'string') {
    var _parsedRows = (0, _d3Dsv.csvParseRows)(rawData);

    if (!Array.isArray(_parsedRows) || _parsedRows.length < 2) {
      // looks like an empty file, throw error to be catch
      throw new Error('process Csv Data Failed: CSV is empty');
    }

    headerRow = _parsedRows[0];
    rows = _parsedRows.slice(1);
  } else if (Array.isArray(rawData) && rawData.length) {
    rows = rawData;
    headerRow = header;

    if (!Array.isArray(headerRow)) {
      // if data is passed in as array of rows and missing header
      // assume first row is header
      headerRow = rawData[0];
      rows = rawData.slice(1);
    }
  }

  if (!rows || !headerRow) {
    throw new Error('invalid input passed to processCsvData');
  } // here we assume the csv file that people uploaded will have first row
  // as name of the column


  cleanUpFalsyCsvValue(rows); // No need to run type detection on every data point
  // here we get a list of none null values to run analyze on

  var sample = getSampleForTypeAnalyze({
    fields: headerRow,
    allData: rows
  });
  var fields = getFieldsFromData(sample, headerRow);
  var parsedRows = parseRowsByFields(rows, fields);
  return {
    fields: fields,
    rows: parsedRows
  };
}
/**
 * Parse rows of csv by analyzed field types. So that `'1'` -> `1`, `'True'` -> `true`
 * @param {Array<Array>} rows
 * @param {Array<Object>} fields
 */


function parseRowsByFields(rows, fields) {
  // Edit rows in place
  var geojsonFieldIdx = fields.findIndex(function (f) {
    return f.name === '_geojson';
  });
  fields.forEach(parseCsvRowsByFieldType.bind(null, rows, geojsonFieldIdx));
  return rows;
}
/**
 * Getting sample data for analyzing field type.
 *
 * @type {typeof import('./data-processor').getSampleForTypeAnalyze}
 */


function getSampleForTypeAnalyze(_ref) {
  var fields = _ref.fields,
      allData = _ref.allData,
      _ref$sampleCount = _ref.sampleCount,
      sampleCount = _ref$sampleCount === void 0 ? 50 : _ref$sampleCount;
  var total = Math.min(sampleCount, allData.length); // const fieldOrder = fields.map(f => f.name);

  var sample = (0, _d3Array.range)(0, total, 1).map(function (d) {
    return {};
  }); // collect sample data for each field

  fields.forEach(function (field, fieldIdx) {
    // data counter
    var i = 0; // sample counter

    var j = 0;

    while (j < total) {
      if (i >= allData.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if ((0, _dataUtils.notNullorUndefined)(allData[i][fieldIdx])) {
        sample[j][field] = typeof allData[i][fieldIdx] === 'string' ? allData[i][fieldIdx].trim() : allData[i][fieldIdx];
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
  var re = new RegExp(CSV_NULLS, 'g');

  for (var i = 0; i < rows.length; i++) {
    for (var j = 0; j < rows[i].length; j++) {
      // analyzer will set any fields to 'string' if there are empty values
      // which will be parsed as '' by d3.csv
      // here we parse empty data as null
      // TODO: create warning when deltect `CSV_NULLS` in the data
      if (typeof rows[i][j] === 'string' && rows[i][j].match(re)) {
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
 * @type {typeof import('./data-processor').parseCsvRowsByFieldType}
 */


function parseCsvRowsByFieldType(rows, geoFieldIdx, field, i) {
  var parser = PARSE_FIELD_VALUE_FROM_STRING[field.type];

  if (parser) {
    // check first not null value of it's already parsed
    var first = rows.find(function (r) {
      return (0, _dataUtils.notNullorUndefined)(r[i]);
    });

    if (!first || parser.valid(first[i], field)) {
      return;
    }

    rows.forEach(function (row) {
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
 * Assign `type`, `fieldIdx` and `format` (timestamp only) to each field
 *
 * @param data array of row object
 * @param fieldOrder array of field names as string
 * @returns formatted fields
 * @type {typeof import('./data-processor').getFieldsFromData}
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
 * // {name: 'time', format: 'YYYY-M-D H:m:s', fieldIdx: 1, type: 'timestamp'},
 * // {name: 'value', format: '', fieldIdx: 4, type: 'integer'},
 * // {name: 'surge', format: '', fieldIdx: 5, type: 'real'},
 * // {name: 'isTrip', format: '', fieldIdx: 6, type: 'boolean'},
 * // {name: 'zeroOnes', format: '', fieldIdx: 7, type: 'integer'}];
 *
 */


function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  var metadata = _typeAnalyzer.Analyzer.computeColMeta(data, [{
    regex: /.*array/g,
    dataType: 'ARRAY'
  }, {
    regex: /.*geojson|all_points/g,
    dataType: 'GEOMETRY'
  }, {
    regex: /.*census/g,
    dataType: 'STRING'
  }], {
    ignoredDataTypes: IGNORE_DATA_TYPES
  });

  var _renameDuplicateField = renameDuplicateFields(fieldOrder),
      fieldByIndex = _renameDuplicateField.fieldByIndex;

  var result = fieldOrder.map(function (field, index) {
    var name = fieldByIndex[index];
    var fieldMeta = metadata.find(function (m) {
      return m.key === field;
    });

    var _ref2 = fieldMeta || {},
        type = _ref2.type,
        format = _ref2.format;

    return {
      name: name,
      id: name,
      displayName: name,
      format: format,
      fieldIdx: index,
      type: analyzerTypeToFieldType(type),
      analyzerType: type,
      valueAccessor: function valueAccessor(values) {
        return values[index];
      }
    };
  }); // @ts-ignore

  return result;
}
/**
 * pass in an array of field names, rename duplicated one
 * and return a map from old field index to new name
 *
 * @param {Array} fieldOrder
 * @returns {Object} new field name by index
 */


function renameDuplicateFields(fieldOrder) {
  return fieldOrder.reduce(function (accu, field, i) {
    var allNames = accu.allNames;
    var fieldName = field; // add a counter to duplicated names

    if (allNames.includes(field)) {
      var counter = 0;

      while (allNames.includes("".concat(field, "-").concat(counter))) {
        counter++;
      }

      fieldName = "".concat(field, "-").concat(counter);
    }

    accu.fieldByIndex[i] = fieldName;
    accu.allNames.push(fieldName);
    return accu;
  }, {
    allNames: [],
    fieldByIndex: {}
  });
}
/**
 * Convert type-analyzer output to kepler.gl field types
 *
 * @param aType
 * @returns corresponding type in `ALL_FIELD_TYPES`
 * @type {typeof import('./data-processor').analyzerTypeToFieldType}}
 */

/* eslint-disable complexity */


function analyzerTypeToFieldType(aType) {
  var DATE = _typeAnalyzer.DATA_TYPES.DATE,
      TIME = _typeAnalyzer.DATA_TYPES.TIME,
      DATETIME = _typeAnalyzer.DATA_TYPES.DATETIME,
      NUMBER = _typeAnalyzer.DATA_TYPES.NUMBER,
      INT = _typeAnalyzer.DATA_TYPES.INT,
      FLOAT = _typeAnalyzer.DATA_TYPES.FLOAT,
      BOOLEAN = _typeAnalyzer.DATA_TYPES.BOOLEAN,
      STRING = _typeAnalyzer.DATA_TYPES.STRING,
      GEOMETRY = _typeAnalyzer.DATA_TYPES.GEOMETRY,
      GEOMETRY_FROM_STRING = _typeAnalyzer.DATA_TYPES.GEOMETRY_FROM_STRING,
      PAIR_GEOMETRY_FROM_STRING = _typeAnalyzer.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING,
      ZIPCODE = _typeAnalyzer.DATA_TYPES.ZIPCODE,
      ARRAY = _typeAnalyzer.DATA_TYPES.ARRAY,
      OBJECT = _typeAnalyzer.DATA_TYPES.OBJECT; // TODO: un recognized types
  // CURRENCY PERCENT NONE

  switch (aType) {
    case DATE:
      return _defaultSettings.ALL_FIELD_TYPES.date;

    case TIME:
    case DATETIME:
      return _defaultSettings.ALL_FIELD_TYPES.timestamp;

    case FLOAT:
      return _defaultSettings.ALL_FIELD_TYPES.real;

    case INT:
      return _defaultSettings.ALL_FIELD_TYPES.integer;

    case BOOLEAN:
      return _defaultSettings.ALL_FIELD_TYPES["boolean"];

    case ARRAY:
      return _defaultSettings.ALL_FIELD_TYPES.array;

    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case OBJECT:
      // TODO: create a new data type for objects
      return _defaultSettings.ALL_FIELD_TYPES.geojson;

    case NUMBER:
    case STRING:
    case ZIPCODE:
      return _defaultSettings.ALL_FIELD_TYPES.string;

    default:
      _window.console.warn("Unsupported analyzer type: ".concat(aType));

      return _defaultSettings.ALL_FIELD_TYPES.string;
  }
}
/* eslint-enable complexity */

/**
 * Process data where each row is an object, output can be passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * NOTE: This function may mutate input.
 * @param rawData an array of row object, each object should have the same number of keys
 * @returns dataset containing `fields` and `rows`
 * @type {typeof import('./data-processor').processRowObject}
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


function processRowObject(rawData) {
  if (!Array.isArray(rawData) || !rawData.length) {
    return null;
  }

  var keys = Object.keys(rawData[0]);
  var rows = rawData.map(function (d) {
    return keys.map(function (key) {
      return d[key];
    });
  }); // row object an still contain values like `Null` or `N/A`

  cleanUpFalsyCsvValue(rows);
  return processCsvData(rows, keys);
}
/**
 * Process GeoJSON [`FeatureCollection`](http://wiki.geojson.org/GeoJSON_draft_version_6#FeatureCollection),
 * output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
 * NOTE: This function may mutate input.
 *
 * @param  rawData raw geojson feature collection
 * @returns  dataset containing `fields` and `rows`
 * @type {typeof import('./data-processor').processGeojson}
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


function processGeojson(rawData) {
  var normalizedGeojson = (0, _geojsonNormalize["default"])(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    var error = new Error("Read File Failed: File is not a valid GeoJSON. Read more about [supported file format](".concat(_userGuides.GUIDES_FILE_FORMAT_DOC, ")"));
    throw error; // fail to normalize geojson
  } // getting all feature fields


  var allDataRows = [];

  for (var i = 0; i < normalizedGeojson.features.length; i++) {
    var f = normalizedGeojson.features[i];

    if (f.geometry) {
      allDataRows.push(_objectSpread({
        // add feature to _geojson field
        _geojson: f
      }, f.properties || {}));
    }
  } // get all the field


  var fields = allDataRows.reduce(function (prev, curr) {
    Object.keys(curr).forEach(function (key) {
      if (!prev.includes(key)) {
        prev.push(key);
      }
    });
    return prev;
  }, []); // make sure each feature has exact same fields

  allDataRows.forEach(function (d) {
    fields.forEach(function (f) {
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


function formatCsv(data, fields) {
  var columns = fields.map(function (f) {
    return f.displayName || f.name;
  });
  var formattedData = [columns]; // parse geojson object as string

  data.forEach(function (row) {
    formattedData.push(row.map(function (d, i) {
      return (0, _dataUtils.parseFieldValue)(d, fields[i].type);
    }));
  });
  return (0, _d3Dsv.csvFormatRows)(formattedData);
}
/**
 * Validate input data, adding missing field types, rename duplicate columns
 * @type {typeof import('./data-processor').validateInputData}
 */


function validateInputData(data) {
  if (!(0, _utils.isPlainObject)(data)) {
    (0, _assert["default"])('addDataToMap Error: dataset.data cannot be null');
    return null;
  } else if (!Array.isArray(data.fields)) {
    (0, _assert["default"])('addDataToMap Error: expect dataset.data.fields to be an array');
    return null;
  } else if (!Array.isArray(data.rows)) {
    (0, _assert["default"])('addDataToMap Error: expect dataset.data.rows to be an array');
    return null;
  }

  var fields = data.fields,
      rows = data.rows; // check if all fields has name, format and type

  var allValid = fields.every(function (f, i) {
    if (!(0, _utils.isPlainObject)(f)) {
      (0, _assert["default"])("fields needs to be an array of object, but find ".concat((0, _typeof2["default"])(f)));
      fields[i] = {};
    }

    if (!f.name) {
      (0, _assert["default"])("field.name is required but missing in ".concat(JSON.stringify(f))); // assign a name

      fields[i].name = "column_".concat(i);
    }

    if (!_defaultSettings.ALL_FIELD_TYPES[f.type]) {
      (0, _assert["default"])("unknown field type ".concat(f.type));
      return false;
    }

    if (!fields.every(function (field) {
      return field.analyzerType;
    })) {
      (0, _assert["default"])('field missing analyzerType');
      return false;
    } // check time format is correct based on first 10 not empty element


    if (f.type === _defaultSettings.ALL_FIELD_TYPES.timestamp) {
      var sample = findNonEmptyRowsAtField(rows, i, 10).map(function (r) {
        return {
          ts: r[i]
        };
      });

      var analyzedType = _typeAnalyzer.Analyzer.computeColMeta(sample)[0];

      return analyzedType && analyzedType.category === 'TIME' && analyzedType.format === f.format;
    }

    return true;
  });

  if (allValid) {
    return {
      rows: rows,
      fields: fields
    };
  } // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity


  var sampleData = getSampleForTypeAnalyze({
    fields: fields.map(function (f) {
      return f.name;
    }),
    allData: rows
  });
  var fieldOrder = fields.map(function (f) {
    return f.name;
  });
  var meta = getFieldsFromData(sampleData, fieldOrder);
  var updatedFields = fields.map(function (f, i) {
    return _objectSpread(_objectSpread({}, f), {}, {
      type: meta[i].type,
      format: meta[i].format,
      analyzerType: meta[i].analyzerType
    });
  });
  return {
    fields: updatedFields,
    rows: rows
  };
}

function findNonEmptyRowsAtField(rows, fieldIdx, total) {
  var sample = [];
  var i = 0;

  while (sample.length < total && i < rows.length) {
    if ((0, _dataUtils.notNullorUndefined)(rows[i][fieldIdx])) {
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


function processKeplerglJSON(rawData) {
  return rawData ? _schemas["default"].load(rawData.datasets, rawData.config) : null;
}
/**
 * Parse a single or an array of datasets saved using kepler.gl schema
 * @param {Array | Array<Object>} rawData
 */


function processKeplerglDataset(rawData) {
  if (!rawData) {
    return null;
  }

  var results = _schemas["default"].parseSavedData((0, _utils.toArray)(rawData));

  if (!results) {
    return null;
  }

  return Array.isArray(rawData) ? results : results[0];
}

var DATASET_HANDLERS = (_DATASET_HANDLERS = {}, (0, _defineProperty2["default"])(_DATASET_HANDLERS, _defaultSettings.DATASET_FORMATS.row, processRowObject), (0, _defineProperty2["default"])(_DATASET_HANDLERS, _defaultSettings.DATASET_FORMATS.geojson, processGeojson), (0, _defineProperty2["default"])(_DATASET_HANDLERS, _defaultSettings.DATASET_FORMATS.csv, processCsvData), (0, _defineProperty2["default"])(_DATASET_HANDLERS, _defaultSettings.DATASET_FORMATS.keplergl, processKeplerglDataset), _DATASET_HANDLERS);
exports.DATASET_HANDLERS = DATASET_HANDLERS;
var Processors = {
  processGeojson: processGeojson,
  processCsvData: processCsvData,
  processRowObject: processRowObject,
  processKeplerglJSON: processKeplerglJSON,
  processKeplerglDataset: processKeplerglDataset,
  analyzerTypeToFieldType: analyzerTypeToFieldType,
  getFieldsFromData: getFieldsFromData,
  parseCsvRowsByFieldType: parseCsvRowsByFieldType,
  formatCsv: formatCsv
};
exports.Processors = Processors;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3JzL2RhdGEtcHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbIkFDQ0VQVEVEX0FOQUxZWkVSX1RZUEVTIiwiQW5hbHl6ZXJEQVRBX1RZUEVTIiwiREFURSIsIlRJTUUiLCJEQVRFVElNRSIsIk5VTUJFUiIsIklOVCIsIkZMT0FUIiwiQk9PTEVBTiIsIlNUUklORyIsIkdFT01FVFJZIiwiR0VPTUVUUllfRlJPTV9TVFJJTkciLCJQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HIiwiWklQQ09ERSIsIkFSUkFZIiwiT0JKRUNUIiwiQ1NWX05VTExTIiwiSUdOT1JFX0RBVEFfVFlQRVMiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwidHlwZSIsImluY2x1ZGVzIiwiUEFSU0VfRklFTERfVkFMVUVfRlJPTV9TVFJJTkciLCJBTExfRklFTERfVFlQRVMiLCJ2YWxpZCIsImQiLCJwYXJzZSIsImludGVnZXIiLCJwYXJzZUludCIsInRpbWVzdGFtcCIsImZpZWxkIiwiZm9ybWF0IiwiTnVtYmVyIiwiYXJyYXkiLCJBcnJheSIsImlzQXJyYXkiLCJKU09OIiwicmVhbCIsInBhcnNlRmxvYXQiLCJwcm9jZXNzQ3N2RGF0YSIsInJhd0RhdGEiLCJoZWFkZXIiLCJyb3dzIiwiaGVhZGVyUm93IiwicGFyc2VkUm93cyIsImxlbmd0aCIsIkVycm9yIiwic2xpY2UiLCJjbGVhblVwRmFsc3lDc3ZWYWx1ZSIsInNhbXBsZSIsImdldFNhbXBsZUZvclR5cGVBbmFseXplIiwiZmllbGRzIiwiYWxsRGF0YSIsImdldEZpZWxkc0Zyb21EYXRhIiwicGFyc2VSb3dzQnlGaWVsZHMiLCJnZW9qc29uRmllbGRJZHgiLCJmaW5kSW5kZXgiLCJmIiwibmFtZSIsImZvckVhY2giLCJwYXJzZUNzdlJvd3NCeUZpZWxkVHlwZSIsImJpbmQiLCJzYW1wbGVDb3VudCIsInRvdGFsIiwiTWF0aCIsIm1pbiIsIm1hcCIsImZpZWxkSWR4IiwiaSIsImoiLCJ0cmltIiwicmUiLCJSZWdFeHAiLCJtYXRjaCIsImdlb0ZpZWxkSWR4IiwicGFyc2VyIiwiZmlyc3QiLCJmaW5kIiwiciIsInJvdyIsInByb3BlcnRpZXMiLCJkYXRhIiwiZmllbGRPcmRlciIsIm1ldGFkYXRhIiwiQW5hbHl6ZXIiLCJjb21wdXRlQ29sTWV0YSIsInJlZ2V4IiwiZGF0YVR5cGUiLCJpZ25vcmVkRGF0YVR5cGVzIiwicmVuYW1lRHVwbGljYXRlRmllbGRzIiwiZmllbGRCeUluZGV4IiwicmVzdWx0IiwiaW5kZXgiLCJmaWVsZE1ldGEiLCJtIiwia2V5IiwiaWQiLCJkaXNwbGF5TmFtZSIsImFuYWx5emVyVHlwZVRvRmllbGRUeXBlIiwiYW5hbHl6ZXJUeXBlIiwidmFsdWVBY2Nlc3NvciIsInZhbHVlcyIsInJlZHVjZSIsImFjY3UiLCJhbGxOYW1lcyIsImZpZWxkTmFtZSIsImNvdW50ZXIiLCJwdXNoIiwiYVR5cGUiLCJkYXRlIiwiZ2VvanNvbiIsInN0cmluZyIsImdsb2JhbENvbnNvbGUiLCJ3YXJuIiwicHJvY2Vzc1Jvd09iamVjdCIsInByb2Nlc3NHZW9qc29uIiwibm9ybWFsaXplZEdlb2pzb24iLCJmZWF0dXJlcyIsImVycm9yIiwiR1VJREVTX0ZJTEVfRk9STUFUX0RPQyIsImFsbERhdGFSb3dzIiwiZ2VvbWV0cnkiLCJfZ2VvanNvbiIsInByZXYiLCJjdXJyIiwiZm9ybWF0Q3N2IiwiY29sdW1ucyIsImZvcm1hdHRlZERhdGEiLCJ2YWxpZGF0ZUlucHV0RGF0YSIsImFsbFZhbGlkIiwiZXZlcnkiLCJzdHJpbmdpZnkiLCJmaW5kTm9uRW1wdHlSb3dzQXRGaWVsZCIsInRzIiwiYW5hbHl6ZWRUeXBlIiwiY2F0ZWdvcnkiLCJzYW1wbGVEYXRhIiwibWV0YSIsInVwZGF0ZWRGaWVsZHMiLCJwcm9jZXNzS2VwbGVyZ2xKU09OIiwiS2VwbGVyR2xTY2hlbWEiLCJsb2FkIiwiZGF0YXNldHMiLCJjb25maWciLCJwcm9jZXNzS2VwbGVyZ2xEYXRhc2V0IiwicmVzdWx0cyIsInBhcnNlU2F2ZWREYXRhIiwiREFUQVNFVF9IQU5ETEVSUyIsIkRBVEFTRVRfRk9STUFUUyIsImNzdiIsImtlcGxlcmdsIiwiUHJvY2Vzc29ycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sSUFBTUEsdUJBQXVCLEdBQUcsQ0FDckNDLHlCQUFtQkMsSUFEa0IsRUFFckNELHlCQUFtQkUsSUFGa0IsRUFHckNGLHlCQUFtQkcsUUFIa0IsRUFJckNILHlCQUFtQkksTUFKa0IsRUFLckNKLHlCQUFtQkssR0FMa0IsRUFNckNMLHlCQUFtQk0sS0FOa0IsRUFPckNOLHlCQUFtQk8sT0FQa0IsRUFRckNQLHlCQUFtQlEsTUFSa0IsRUFTckNSLHlCQUFtQlMsUUFUa0IsRUFVckNULHlCQUFtQlUsb0JBVmtCLEVBV3JDVix5QkFBbUJXLHlCQVhrQixFQVlyQ1gseUJBQW1CWSxPQVprQixFQWFyQ1oseUJBQW1CYSxLQWJrQixFQWNyQ2IseUJBQW1CYyxNQWRrQixDQUFoQyxDLENBaUJQO0FBQ0E7QUFDQTs7O0FBQ08sSUFBTUMsU0FBUyxHQUFHLDhCQUFsQjs7QUFFUCxJQUFNQyxpQkFBaUIsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlsQix3QkFBWixFQUFnQ21CLE1BQWhDLENBQ3hCLFVBQUFDLElBQUk7QUFBQSxTQUFJLENBQUNyQix1QkFBdUIsQ0FBQ3NCLFFBQXhCLENBQWlDRCxJQUFqQyxDQUFMO0FBQUEsQ0FEb0IsQ0FBMUI7QUFJTyxJQUFNRSw2QkFBNkIsd0ZBQ3ZDQywyQ0FEdUMsRUFDYjtBQUN6QkMsRUFBQUEsS0FBSyxFQUFFLGVBQUFDLENBQUM7QUFBQSxXQUFJLE9BQU9BLENBQVAsS0FBYSxTQUFqQjtBQUFBLEdBRGlCO0FBRXpCQyxFQUFBQSxLQUFLLEVBQUUsZUFBQUQsQ0FBQztBQUFBLFdBQUlBLENBQUMsS0FBSyxNQUFOLElBQWdCQSxDQUFDLEtB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Sm1DLGdCQURJLHVEQUUxQmtDLGlDQUFnQnRDLE9BRlUsRUFFQUssY0FGQSx1REFHMUJpQyxpQ0FBZ0JDLEdBSFUsRUFHSjlHLGNBSEksdURBSTFCNkcsaUNBQWdCRSxRQUpVLEVBSUNOLHNCQUpELHFCQUF0Qjs7QUFPQSxJQUFNTyxVQUFVLEdBQUc7QUFDeEJwQyxFQUFBQSxjQUFjLEVBQWRBLGNBRHdCO0FBRXhCNUUsRUFBQUEsY0FBYyxFQUFkQSxjQUZ3QjtBQUd4QjJFLEVBQUFBLGdCQUFnQixFQUFoQkEsZ0JBSHdCO0FBSXhCeUIsRUFBQUEsbUJBQW1CLEVBQW5CQSxtQkFKd0I7QUFLeEJLLEVBQUFBLHNCQUFzQixFQUF0QkEsc0JBTHdCO0FBTXhCOUMsRUFBQUEsdUJBQXVCLEVBQXZCQSx1QkFOd0I7QUFPeEI3QyxFQUFBQSxpQkFBaUIsRUFBakJBLGlCQVB3QjtBQVF4Qk8sRUFBQUEsdUJBQXVCLEVBQXZCQSx1QkFSd0I7QUFTeEJpRSxFQUFBQSxTQUFTLEVBQVRBO0FBVHdCLENBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjc3ZQYXJzZVJvd3MsIGNzdkZvcm1hdFJvd3N9IGZyb20gJ2QzLWRzdic7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge2NvbnNvbGUgYXMgZ2xvYmFsQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQge0FuYWx5emVyLCBEQVRBX1RZUEVTIGFzIEFuYWx5emVyREFUQV9UWVBFU30gZnJvbSAndHlwZS1hbmFseXplcic7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ0BtYXBib3gvZ2VvanNvbi1ub3JtYWxpemUnO1xuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIERBVEFTRVRfRk9STUFUU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWQsIHBhcnNlRmllbGRWYWx1ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQgS2VwbGVyR2xTY2hlbWEgZnJvbSAnc2NoZW1hcyc7XG5pbXBvcnQge0dVSURFU19GSUxFX0ZPUk1BVF9ET0N9IGZyb20gJ2NvbnN0YW50cy91c2VyLWd1aWRlcyc7XG5pbXBvcnQge2lzUGxhaW5PYmplY3QsIHRvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IEFDQ0VQVEVEX0FOQUxZWkVSX1RZUEVTID0gW1xuICBBbmFseXplckRBVEFfVFlQRVMuREFURSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLlRJTUUsXG4gIEFuYWx5emVyREFUQV9UWVBFUy5EQVRFVElNRSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLk5VTUJFUixcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLklOVCxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkZMT0FULFxuICBBbmFseXplckRBVEFfVFlQRVMuQk9PTEVBTixcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLlNUUklORyxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkdFT01FVFJZLFxuICBBbmFseXplckRBVEFfVFlQRVMuR0VPTUVUUllfRlJPTV9TVFJJTkcsXG4gIEFuYWx5emVyREFUQV9UWVBFUy5QQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HLFxuICBBbmFseXplckRBVEFfVFlQRVMuWklQQ09ERSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkFSUkFZLFxuICBBbmFseXplckRBVEFfVFlQRVMuT0JKRUNUXG5dO1xuXG4vLyBpZiBhbnkgb2YgdGhlc2UgdmFsdWUgb2NjdXJzIGluIGNzdiwgcGFyc2UgaXQgdG8gbnVsbDtcbi8vIGNvbnN0IENTVl9OVUxMUyA9IFsnJywgJ251bGwnLCAnTlVMTCcsICdOdWxsJywgJ05hTicsICcvTiddO1xuLy8gbWF0Y2hlcyBlbXB0eSBzdHJpbmdcbmV4cG9ydCBjb25zdCBDU1ZfTlVMTFMgPSAvXihudWxsfE5VTEx8TnVsbHxOYU58XFwvTnx8KSQvO1xuXG5jb25zdCBJR05PUkVfREFUQV9UWVBFUyA9IE9iamVjdC5rZXlzKEFuYWx5emVyREFUQV9UWVBFUykuZmlsdGVyKFxuICB0eXBlID0+ICFBQ0NFUFRFRF9BTkFMWVpFUl9UWVBFUy5pbmNsdWRlcyh0eXBlKVxuKTtcblxuZXhwb3J0IGNvbnN0IFBBUlNFX0ZJRUxEX1ZBTFVFX0ZST01fU1RSSU5HID0ge1xuICBbQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW5dOiB7XG4gICAgdmFsaWQ6IGQgPT4gdHlwZW9mIGQgPT09ICdib29sZWFuJyxcbiAgICBwYXJzZTogZCA9PiBkID09PSAndHJ1ZScgfHwgZCA9PT0gJ1RydWUnIHx8IGQgPT09ICdUUlVFJyB8fCBkID09PSAnMSdcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXToge1xuICAgIHZhbGlkOiBkID0+IHBhcnNlSW50KGQsIDEwKSA9PT0gZCxcbiAgICBwYXJzZTogZCA9PiBwYXJzZUludChkLCAxMClcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXBdOiB7XG4gICAgdmFsaWQ6IChkLCBmaWVsZCkgPT5cbiAgICAgIFsneCcsICdYJ10uaW5jbHVkZXMoZmllbGQuZm9ybWF0KSA/IHR5cGVvZiBkID09PSAnbnVtYmVyJyA6IHR5cGVvZiBkID09PSAnc3RyaW5nJyxcbiAgICBwYXJzZTogKGQsIGZpZWxkKSA9PiAoWyd4JywgJ1gnXS5pbmNsdWRlcyhmaWVsZC5mb3JtYXQpID8gTnVtYmVyKGQpIDogZClcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5hcnJheV06IHtcbiAgICB2YWxpZDogZCA9PiBBcnJheS5pc0FycmF5KGQpLFxuICAgIHBhcnNlOiBkID0+IEpTT04ucGFyc2UoZClcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXToge1xuICAgIHZhbGlkOiBkID0+IHBhcnNlRmxvYXQoZCkgPT09IGQsXG4gICAgLy8gTm90ZSB0aGlzIHdpbGwgcmVzdWx0IGluIE5hTiBmb3Igc29tZSBzdHJpbmdcbiAgICBwYXJzZTogcGFyc2VGbG9hdFxuICB9XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgY3N2IGRhdGEsIG91dHB1dCBhIGRhdGEgb2JqZWN0IHdpdGggYHtmaWVsZHM6IFtdLCByb3dzOiBbXX1gLlxuICogVGhlIGRhdGEgb2JqZWN0IGNhbiBiZSB3cmFwcGVkIGluIGEgYGRhdGFzZXRgIGFuZCBwYXNzIHRvIFtgYWRkRGF0YVRvTWFwYF0oLi4vYWN0aW9ucy9hY3Rpb25zLm1kI2FkZGRhdGF0b21hcClcbiAqIEBwYXJhbSByYXdEYXRhIHJhdyBjc3Ygc3RyaW5nXG4gKiBAcmV0dXJucyAgZGF0YSBvYmplY3QgYHtmaWVsZHM6IFtdLCByb3dzOiBbXX1gIGNhbiBiZSBwYXNzZWQgdG8gYWRkRGF0YVRvTWFwc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5wcm9jZXNzQ3N2RGF0YX1cbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge3Byb2Nlc3NDc3ZEYXRhfSBmcm9tICdrZXBsZXIuZ2wvcHJvY2Vzc29ycyc7XG4gKlxuICogY29uc3QgdGVzdERhdGEgPSBgZ3BzX2RhdGEudXRjX3RpbWVzdGFtcCxncHNfZGF0YS5sYXQsZ3BzX2RhdGEubG5nLGdwc19kYXRhLnR5cGVzLGVwb2NoLGhhc19yZXN1bHQsaWQsdGltZSxiZWdpbnRyaXBfdHNfdXRjLGJlZ2ludHJpcF90c19sb2NhbCxkYXRlXG4gKiAyMDE2LTA5LTE3IDAwOjA5OjU1LDI5Ljk5MDA5MzcsMzEuMjU5MDU0Mixkcml2ZXJfYW5hbHl0aWNzLDE0NzI2ODgwMDAwMDAsRmFsc2UsMSwyMDE2LTA5LTIzVDAwOjAwOjAwLjAwMFosMjAxNi0xMC0wMSAwOTo0MTozOSswMDowMCwyMDE2LTEwLTAxIDA5OjQxOjM5KzAwOjAwLDIwMTYtMDktMjNcbiAqIDIwMTYtMDktMTcgMDA6MTA6NTYsMjkuOTkyNzY5OSwzMS4yNDYxMTQyLGRyaXZlcl9hbmFseXRpY3MsMTQ3MjY4ODAwMDAwMCxGYWxzZSwyLDIwMTYtMDktMjNUMDA6MDA6MDAuMDAwWiwyMDE2LTEwLTAxIDA5OjQ2OjM3KzAwOjAwLDIwMTYtMTAtMDEgMTY6NDY6MzcrMDA6MDAsMjAxNi0wOS0yM1xuICogMjAxNi0wOS0xNyAwMDoxMTo1NiwyOS45OTA3MjYxLDMxLjIzMTI3NDIsZHJpdmVyX2FuYWx5dGljcywxNDcyNjg4MDAwMDAwLEZhbHNlLDMsMjAxNi0wOS0yM1QwMDowMDowMC4wMDBaLCwsMjAxNi0wOS0yM1xuICogMjAxNi0wOS0xNyAwMDoxMjo1OCwyOS45ODcwMDc0LDMxLjIxNzU4MjcsZHJpdmVyX2FuYWx5dGljcywxNDcyNjg4MDAwMDAwLEZhbHNlLDQsMjAxNi0wOS0yM1QwMDowMDowMC4wMDBaLCwsMjAxNi0wOS0yM2BcbiAqXG4gKiBjb25zdCBkYXRhc2V0ID0ge1xuICogIGluZm86IHtpZDogJ3Rlc3RfZGF0YScsIGxhYmVsOiAnTXkgQ3N2J30sXG4gKiAgZGF0YTogcHJvY2Vzc0NzdkRhdGEodGVzdERhdGEpXG4gKiB9O1xuICpcbiAqIGRpc3BhdGNoKGFkZERhdGFUb01hcCh7XG4gKiAgZGF0YXNldHM6IFtkYXRhc2V0XSxcbiAqICBvcHRpb25zOiB7Y2VudGVyTWFwOiB0cnVlLCByZWFkT25seTogdHJ1ZX1cbiAqIH0pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NDc3ZEYXRhKHJhd0RhdGEsIGhlYWRlcikge1xuICBsZXQgcm93cztcbiAgbGV0IGhlYWRlclJvdztcblxuICBpZiAodHlwZW9mIHJhd0RhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgcGFyc2VkUm93cyA9IGNzdlBhcnNlUm93cyhyYXdEYXRhKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShwYXJzZWRSb3dzKSB8fCBwYXJzZWRSb3dzLmxlbmd0aCA8IDIpIHtcbiAgICAgIC8vIGxvb2tzIGxpa2UgYW4gZW1wdHkgZmlsZSwgdGhyb3cgZXJyb3IgdG8gYmUgY2F0Y2hcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHJvY2VzcyBDc3YgRGF0YSBGYWlsZWQ6IENTViBpcyBlbXB0eScpO1xuICAgIH1cbiAgICBoZWFkZXJSb3cgPSBwYXJzZWRSb3dzWzBdO1xuICAgIHJvd3MgPSBwYXJzZWRSb3dzLnNsaWNlKDEpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3RGF0YSkgJiYgcmF3RGF0YS5sZW5ndGgpIHtcbiAgICByb3dzID0gcmF3RGF0YTtcbiAgICBoZWFkZXJSb3cgPSBoZWFkZXI7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaGVhZGVyUm93KSkge1xuICAgICAgLy8gaWYgZGF0YSBpcyBwYXNzZWQgaW4gYXMgYXJyYXkgb2Ygcm93cyBhbmQgbWlzc2luZyBoZWFkZXJcbiAgICAgIC8vIGFzc3VtZSBmaXJzdCByb3cgaXMgaGVhZGVyXG4gICAgICBoZWFkZXJSb3cgPSByYXdEYXRhWzBdO1xuICAgICAgcm93cyA9IHJhd0RhdGEuc2xpY2UoMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFyb3dzIHx8ICFoZWFkZXJSb3cpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaW5wdXQgcGFzc2VkIHRvIHByb2Nlc3NDc3ZEYXRhJyk7XG4gIH1cblxuICAvLyBoZXJlIHdlIGFzc3VtZSB0aGUgY3N2IGZpbGUgdGhhdCBwZW9wbGUgdXBsb2FkZWQgd2lsbCBoYXZlIGZpcnN0IHJvd1xuICAvLyBhcyBuYW1lIG9mIHRoZSBjb2x1bW5cblxuICBjbGVhblVwRmFsc3lDc3ZWYWx1ZShyb3dzKTtcbiAgLy8gTm8gbmVlZCB0byBydW4gdHlwZSBkZXRlY3Rpb24gb24gZXZlcnkgZGF0YSBwb2ludFxuICAvLyBoZXJlIHdlIGdldCBhIGxpc3Qgb2Ygbm9uZSBudWxsIHZhbHVlcyB0byBydW4gYW5hbHl6ZSBvblxuICBjb25zdCBzYW1wbGUgPSBnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZSh7ZmllbGRzOiBoZWFkZXJSb3csIGFsbERhdGE6IHJvd3N9KTtcbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlLCBoZWFkZXJSb3cpO1xuICBjb25zdCBwYXJzZWRSb3dzID0gcGFyc2VSb3dzQnlGaWVsZHMocm93cywgZmllbGRzKTtcblxuICByZXR1cm4ge2ZpZWxkcywgcm93czogcGFyc2VkUm93c307XG59XG5cbi8qKlxuICogUGFyc2Ugcm93cyBvZiBjc3YgYnkgYW5hbHl6ZWQgZmllbGQgdHlwZXMuIFNvIHRoYXQgYCcxJ2AgLT4gYDFgLCBgJ1RydWUnYCAtPiBgdHJ1ZWBcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk+fSByb3dzXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSb3dzQnlGaWVsZHMocm93cywgZmllbGRzKSB7XG4gIC8vIEVkaXQgcm93cyBpbiBwbGFjZVxuICBjb25zdCBnZW9qc29uRmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSAnX2dlb2pzb24nKTtcbiAgZmllbGRzLmZvckVhY2gocGFyc2VDc3ZSb3dzQnlGaWVsZFR5cGUuYmluZChudWxsLCByb3dzLCBnZW9qc29uRmllbGRJZHgpKTtcblxuICByZXR1cm4gcm93cztcbn1cbi8qKlxuICogR2V0dGluZyBzYW1wbGUgZGF0YSBmb3IgYW5hbHl6aW5nIGZpZWxkIHR5cGUuXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5nZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNhbXBsZUZvclR5cGVBbmFseXplKHtmaWVsZHMsIGFsbERhdGEsIHNhbXBsZUNvdW50ID0gNTB9KSB7XG4gIGNvbnN0IHRvdGFsID0gTWF0aC5taW4oc2FtcGxlQ291bnQsIGFsbERhdGEubGVuZ3RoKTtcbiAgLy8gY29uc3QgZmllbGRPcmRlciA9IGZpZWxkcy5tYXAoZiA9PiBmLm5hbWUpO1xuICBjb25zdCBzYW1wbGUgPSByYW5nZSgwLCB0b3RhbCwgMSkubWFwKGQgPT4gKHt9KSk7XG5cbiAgLy8gY29sbGVjdCBzYW1wbGUgZGF0YSBmb3IgZWFjaCBmaWVsZFxuICBmaWVsZHMuZm9yRWFjaCgoZmllbGQsIGZpZWxkSWR4KSA9PiB7XG4gICAgLy8gZGF0YSBjb3VudGVyXG4gICAgbGV0IGkgPSAwO1xuICAgIC8vIHNhbXBsZSBjb3VudGVyXG4gICAgbGV0IGogPSAwO1xuXG4gICAgd2hpbGUgKGogPCB0b3RhbCkge1xuICAgICAgaWYgKGkgPj0gYWxsRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgZGVwbGV0ZWQgZGF0YSBwb29sXG4gICAgICAgIHNhbXBsZVtqXVtmaWVsZF0gPSBudWxsO1xuICAgICAgICBqKys7XG4gICAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChhbGxEYXRhW2ldW2ZpZWxkSWR4XSkpIHtcbiAgICAgICAgc2FtcGxlW2pdW2ZpZWxkXSA9XG4gICAgICAgICAgdHlwZW9mIGFsbERhdGFbaV1bZmllbGRJZHhdID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgPyBhbGxEYXRhW2ldW2ZpZWxkSWR4XS50cmltKClcbiAgICAgICAgICAgIDogYWxsRGF0YVtpXVtmaWVsZElkeF07XG4gICAgICAgIGorKztcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNhbXBsZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGZhbHN5IHZhbHVlIGluIGNzdiBpbmNsdWRpbmcgYCcnLCAnbnVsbCcsICdOVUxMJywgJ051bGwnLCAnTmFOJ2AgdG8gYG51bGxgLFxuICogc28gdGhhdCB0eXBlLWFuYWx5emVyIHdvbid0IGRldGVjdCBpdCBhcyBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5Pn0gcm93c1xuICovXG5mdW5jdGlvbiBjbGVhblVwRmFsc3lDc3ZWYWx1ZShyb3dzKSB7XG4gIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChDU1ZfTlVMTFMsICdnJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93c1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgLy8gYW5hbHl6ZXIgd2lsbCBzZXQgYW55IGZpZWxkcyB0byAnc3RyaW5nJyBpZiB0aGVyZSBhcmUgZW1wdHkgdmFsdWVzXG4gICAgICAvLyB3aGljaCB3aWxsIGJlIHBhcnNlZCBhcyAnJyBieSBkMy5jc3ZcbiAgICAgIC8vIGhlcmUgd2UgcGFyc2UgZW1wdHkgZGF0YSBhcyBudWxsXG4gICAgICAvLyBUT0RPOiBjcmVhdGUgd2FybmluZyB3aGVuIGRlbHRlY3QgYENTVl9OVUxMU2AgaW4gdGhlIGRhdGFcbiAgICAgIGlmICh0eXBlb2Ygcm93c1tpXVtqXSA9PT0gJ3N0cmluZycgJiYgcm93c1tpXVtqXS5tYXRjaChyZSkpIHtcbiAgICAgICAgcm93c1tpXVtqXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvY2VzcyB1cGxvYWRlZCBjc3YgZmlsZSB0byBwYXJzZSB2YWx1ZSBieSBmaWVsZCB0eXBlXG4gKlxuICogQHBhcmFtIHJvd3NcbiAqIEBwYXJhbSBnZW9GaWVsZElkeCBmaWVsZCBpbmRleFxuICogQHBhcmFtIGZpZWxkXG4gKiBAcGFyYW0gaVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5wYXJzZUNzdlJvd3NCeUZpZWxkVHlwZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3N2Um93c0J5RmllbGRUeXBlKHJvd3MsIGdlb0ZpZWxkSWR4LCBmaWVsZCwgaSkge1xuICBjb25zdCBwYXJzZXIgPSBQQVJTRV9GSUVMRF9WQUxVRV9GUk9NX1NUUklOR1tmaWVsZC50eXBlXTtcbiAgaWYgKHBhcnNlcikge1xuICAgIC8vIGNoZWNrIGZpcnN0IG5vdCBudWxsIHZhbHVlIG9mIGl0J3MgYWxyZWFkeSBwYXJzZWRcbiAgICBjb25zdCBmaXJzdCA9IHJvd3MuZmluZChyID0+IG5vdE51bGxvclVuZGVmaW5lZChyW2ldKSk7XG4gICAgaWYgKCFmaXJzdCB8fCBwYXJzZXIudmFsaWQoZmlyc3RbaV0sIGZpZWxkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgIC8vIHBhcnNlIHN0cmluZyB2YWx1ZSBiYXNlZCBvbiBmaWVsZCB0eXBlXG4gICAgICBpZiAocm93W2ldICE9PSBudWxsKSB7XG4gICAgICAgIHJvd1tpXSA9IHBhcnNlci5wYXJzZShyb3dbaV0sIGZpZWxkKTtcbiAgICAgICAgaWYgKGdlb0ZpZWxkSWR4ID4gLTEgJiYgcm93W2dlb0ZpZWxkSWR4XSAmJiByb3dbZ2VvRmllbGRJZHhdLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICByb3dbZ2VvRmllbGRJZHhdLnByb3BlcnRpZXNbZmllbGQubmFtZV0gPSByb3dbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEFuYWx5emUgZmllbGQgdHlwZXMgZnJvbSBkYXRhIGluIGBzdHJpbmdgIGZvcm1hdCwgZS5nLiB1cGxvYWRlZCBjc3YuXG4gKiBBc3NpZ24gYHR5cGVgLCBgZmllbGRJZHhgIGFuZCBgZm9ybWF0YCAodGltZXN0YW1wIG9ubHkpIHRvIGVhY2ggZmllbGRcbiAqXG4gKiBAcGFyYW0gZGF0YSBhcnJheSBvZiByb3cgb2JqZWN0XG4gKiBAcGFyYW0gZmllbGRPcmRlciBhcnJheSBvZiBmaWVsZCBuYW1lcyBhcyBzdHJpbmdcbiAqIEByZXR1cm5zIGZvcm1hdHRlZCBmaWVsZHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGEtcHJvY2Vzc29yJykuZ2V0RmllbGRzRnJvbURhdGF9XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIGltcG9ydCB7Z2V0RmllbGRzRnJvbURhdGF9IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqIGNvbnN0IGRhdGEgPSBbe1xuICogICB0aW1lOiAnMjAxNi0wOS0xNyAwMDowOTo1NScsXG4gKiAgIHZhbHVlOiAnNCcsXG4gKiAgIHN1cmdlOiAnMS4yJyxcbiAqICAgaXNUcmlwOiAndHJ1ZScsXG4gKiAgIHplcm9PbmVzOiAnMCdcbiAqIH0sIHtcbiAqICAgdGltZTogJzIwMTYtMDktMTcgMDA6MzA6MDgnLFxuICogICB2YWx1ZTogJzMnLFxuICogICBzdXJnZTogbnVsbCxcbiAqICAgaXNUcmlwOiAnZmFsc2UnLFxuICogICB6ZXJvT25lczogJzEnXG4gKiB9LCB7XG4gKiAgIHRpbWU6IG51bGwsXG4gKiAgIHZhbHVlOiAnMicsXG4gKiAgIHN1cmdlOiAnMS4zJyxcbiAqICAgaXNUcmlwOiBudWxsLFxuICogICB6ZXJvT25lczogJzEnXG4gKiB9XTtcbiAqXG4gKiBjb25zdCBmaWVsZE9yZGVyID0gWyd0aW1lJywgJ3ZhbHVlJywgJ3N1cmdlJywgJ2lzVHJpcCcsICd6ZXJvT25lcyddO1xuICogY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEoZGF0YSwgZmllbGRPcmRlcik7XG4gKiAvLyBmaWVsZHMgPSBbXG4gKiAvLyB7bmFtZTogJ3RpbWUnLCBmb3JtYXQ6ICdZWVlZLU0tRCBIOm06cycsIGZpZWxkSWR4OiAxLCB0eXBlOiAndGltZXN0YW1wJ30sXG4gKiAvLyB7bmFtZTogJ3ZhbHVlJywgZm9ybWF0OiAnJywgZmllbGRJZHg6IDQsIHR5cGU6ICdpbnRlZ2VyJ30sXG4gKiAvLyB7bmFtZTogJ3N1cmdlJywgZm9ybWF0OiAnJywgZmllbGRJZHg6IDUsIHR5cGU6ICdyZWFsJ30sXG4gKiAvLyB7bmFtZTogJ2lzVHJpcCcsIGZvcm1hdDogJycsIGZpZWxkSWR4OiA2LCB0eXBlOiAnYm9vbGVhbid9LFxuICogLy8ge25hbWU6ICd6ZXJvT25lcycsIGZvcm1hdDogJycsIGZpZWxkSWR4OiA3LCB0eXBlOiAnaW50ZWdlcid9XTtcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZHNGcm9tRGF0YShkYXRhLCBmaWVsZE9yZGVyKSB7XG4gIC8vIGFkZCBhIGNoZWNrIGZvciBlcG9jaCB0aW1lc3RhbXBcbiAgY29uc3QgbWV0YWRhdGEgPSBBbmFseXplci5jb21wdXRlQ29sTWV0YShcbiAgICBkYXRhLFxuICAgIFtcbiAgICAgIHtyZWdleDogLy4qYXJyYXkvZywgZGF0YVR5cGU6ICdBUlJBWSd9LFxuICAgICAge3JlZ2V4OiAvLipnZW9qc29ufGFsbF9wb2ludHMvZywgZGF0YVR5cGU6ICdHRU9NRVRSWSd9LFxuICAgICAge3JlZ2V4OiAvLipjZW5zdXMvZywgZGF0YVR5cGU6ICdTVFJJTkcnfVxuICAgIF0sXG4gICAge2lnbm9yZWREYXRhVHlwZXM6IElHTk9SRV9EQVRBX1RZUEVTfVxuICApO1xuXG4gIGNvbnN0IHtmaWVsZEJ5SW5kZXh9ID0gcmVuYW1lRHVwbGljYXRlRmllbGRzKGZpZWxkT3JkZXIpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGZpZWxkT3JkZXIubWFwKChmaWVsZCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBuYW1lID0gZmllbGRCeUluZGV4W2luZGV4XTtcblxuICAgIGNvbnN0IGZpZWxkTWV0YSA9IG1ldGFkYXRhLmZpbmQobSA9PiBtLmtleSA9PT0gZmllbGQpO1xuICAgIGNvbnN0IHt0eXBlLCBmb3JtYXR9ID0gZmllbGRNZXRhIHx8IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWUsXG4gICAgICBpZDogbmFtZSxcbiAgICAgIGRpc3BsYXlOYW1lOiBuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgZmllbGRJZHg6IGluZGV4LFxuICAgICAgdHlwZTogYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUodHlwZSksXG4gICAgICBhbmFseXplclR5cGU6IHR5cGUsXG4gICAgICB2YWx1ZUFjY2Vzc29yOiB2YWx1ZXMgPT4gdmFsdWVzW2luZGV4XVxuICAgIH07XG4gIH0pO1xuXG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBwYXNzIGluIGFuIGFycmF5IG9mIGZpZWxkIG5hbWVzLCByZW5hbWUgZHVwbGljYXRlZCBvbmVcbiAqIGFuZCByZXR1cm4gYSBtYXAgZnJvbSBvbGQgZmllbGQgaW5kZXggdG8gbmV3IG5hbWVcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBmaWVsZE9yZGVyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgZmllbGQgbmFtZSBieSBpbmRleFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lRHVwbGljYXRlRmllbGRzKGZpZWxkT3JkZXIpIHtcbiAgcmV0dXJuIGZpZWxkT3JkZXIucmVkdWNlKFxuICAgIChhY2N1LCBmaWVsZCwgaSkgPT4ge1xuICAgICAgY29uc3Qge2FsbE5hbWVzfSA9IGFjY3U7XG4gICAgICBsZXQgZmllbGROYW1lID0gZmllbGQ7XG5cbiAgICAgIC8vIGFkZCBhIGNvdW50ZXIgdG8gZHVwbGljYXRlZCBuYW1lc1xuICAgICAgaWYgKGFsbE5hbWVzLmluY2x1ZGVzKGZpZWxkKSkge1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlIChhbGxOYW1lcy5pbmNsdWRlcyhgJHtmaWVsZH0tJHtjb3VudGVyfWApKSB7XG4gICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkTmFtZSA9IGAke2ZpZWxkfS0ke2NvdW50ZXJ9YDtcbiAgICAgIH1cblxuICAgICAgYWNjdS5maWVsZEJ5SW5kZXhbaV0gPSBmaWVsZE5hbWU7XG4gICAgICBhY2N1LmFsbE5hbWVzLnB1c2goZmllbGROYW1lKTtcblxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSxcbiAgICB7YWxsTmFtZXM6IFtdLCBmaWVsZEJ5SW5kZXg6IHt9fVxuICApO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdHlwZS1hbmFseXplciBvdXRwdXQgdG8ga2VwbGVyLmdsIGZpZWxkIHR5cGVzXG4gKlxuICogQHBhcmFtIGFUeXBlXG4gKiBAcmV0dXJucyBjb3JyZXNwb25kaW5nIHR5cGUgaW4gYEFMTF9GSUVMRF9UWVBFU2BcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGEtcHJvY2Vzc29yJykuYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGV9fVxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUoYVR5cGUpIHtcbiAgY29uc3Qge1xuICAgIERBVEUsXG4gICAgVElNRSxcbiAgICBEQVRFVElNRSxcbiAgICBOVU1CRVIsXG4gICAgSU5ULFxuICAgIEZMT0FULFxuICAgIEJPT0xFQU4sXG4gICAgU1RSSU5HLFxuICAgIEdFT01FVFJZLFxuICAgIEdFT01FVFJZX0ZST01fU1RSSU5HLFxuICAgIFBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkcsXG4gICAgWklQQ09ERSxcbiAgICBBUlJBWSxcbiAgICBPQkpFQ1RcbiAgfSA9IEFuYWx5emVyREFUQV9UWVBFUztcblxuICAvLyBUT0RPOiB1biByZWNvZ25pemVkIHR5cGVzXG4gIC8vIENVUlJFTkNZIFBFUkNFTlQgTk9ORVxuICBzd2l0Y2ggKGFUeXBlKSB7XG4gICAgY2FzZSBEQVRFOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5kYXRlO1xuICAgIGNhc2UgVElNRTpcbiAgICBjYXNlIERBVEVUSU1FOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gICAgY2FzZSBGTE9BVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMucmVhbDtcbiAgICBjYXNlIElOVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuaW50ZWdlcjtcbiAgICBjYXNlIEJPT0xFQU46XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW47XG4gICAgY2FzZSBBUlJBWTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuYXJyYXk7XG4gICAgY2FzZSBHRU9NRVRSWTpcbiAgICBjYXNlIEdFT01FVFJZX0ZST01fU1RSSU5HOlxuICAgIGNhc2UgUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklORzpcbiAgICBjYXNlIE9CSkVDVDpcbiAgICAgIC8vIFRPRE86IGNyZWF0ZSBhIG5ldyBkYXRhIHR5cGUgZm9yIG9iamVjdHNcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuZ2VvanNvbjtcbiAgICBjYXNlIE5VTUJFUjpcbiAgICBjYXNlIFNUUklORzpcbiAgICBjYXNlIFpJUENPREU6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLnN0cmluZztcbiAgICBkZWZhdWx0OlxuICAgICAgZ2xvYmFsQ29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCBhbmFseXplciB0eXBlOiAke2FUeXBlfWApO1xuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc7XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4vKipcbiAqIFByb2Nlc3MgZGF0YSB3aGVyZSBlYWNoIHJvdyBpcyBhbiBvYmplY3QsIG91dHB1dCBjYW4gYmUgcGFzc2VkIHRvIFtgYWRkRGF0YVRvTWFwYF0oLi4vYWN0aW9ucy9hY3Rpb25zLm1kI2FkZGRhdGF0b21hcClcbiAqIE5PVEU6IFRoaXMgZnVuY3Rpb24gbWF5IG11dGF0ZSBpbnB1dC5cbiAqIEBwYXJhbSByYXdEYXRhIGFuIGFycmF5IG9mIHJvdyBvYmplY3QsIGVhY2ggb2JqZWN0IHNob3VsZCBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBrZXlzXG4gKiBAcmV0dXJucyBkYXRhc2V0IGNvbnRhaW5pbmcgYGZpZWxkc2AgYW5kIGByb3dzYFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5wcm9jZXNzUm93T2JqZWN0fVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7YWRkRGF0YVRvTWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiBpbXBvcnQge3Byb2Nlc3NSb3dPYmplY3R9IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqXG4gKiBjb25zdCBkYXRhID0gW1xuICogIHtsYXQ6IDMxLjI3LCBsbmc6IDEyNy41NiwgdmFsdWU6IDN9LFxuICogIHtsYXQ6IDMxLjIyLCBsbmc6IDEyNi4yNiwgdmFsdWU6IDF9XG4gKiBdO1xuICpcbiAqIGRpc3BhdGNoKGFkZERhdGFUb01hcCh7XG4gKiAgZGF0YXNldHM6IHtcbiAqICAgIGluZm86IHtsYWJlbDogJ015IERhdGEnLCBpZDogJ215X2RhdGEnfSxcbiAqICAgIGRhdGE6IHByb2Nlc3NSb3dPYmplY3QoZGF0YSlcbiAqICB9XG4gKiB9KSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzUm93T2JqZWN0KHJhd0RhdGEpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhd0RhdGEpIHx8ICFyYXdEYXRhLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJhd0RhdGFbMF0pO1xuICBjb25zdCByb3dzID0gcmF3RGF0YS5tYXAoZCA9PiBrZXlzLm1hcChrZXkgPT4gZFtrZXldKSk7XG5cbiAgLy8gcm93IG9iamVjdCBhbiBzdGlsbCBjb250YWluIHZhbHVlcyBsaWtlIGBOdWxsYCBvciBgTi9BYFxuICBjbGVhblVwRmFsc3lDc3ZWYWx1ZShyb3dzKTtcblxuICByZXR1cm4gcHJvY2Vzc0NzdkRhdGEocm93cywga2V5cyk7XG59XG5cbi8qKlxuICogUHJvY2VzcyBHZW9KU09OIFtgRmVhdHVyZUNvbGxlY3Rpb25gXShodHRwOi8vd2lraS5nZW9qc29uLm9yZy9HZW9KU09OX2RyYWZ0X3ZlcnNpb25fNiNGZWF0dXJlQ29sbGVjdGlvbiksXG4gKiBvdXRwdXQgYSBkYXRhIG9iamVjdCB3aXRoIGB7ZmllbGRzOiBbXSwgcm93czogW119YC5cbiAqIFRoZSBkYXRhIG9iamVjdCBjYW4gYmUgd3JhcHBlZCBpbiBhIGBkYXRhc2V0YCBhbmQgcGFzc2VkIHRvIFtgYWRkRGF0YVRvTWFwYF0oLi4vYWN0aW9ucy9hY3Rpb25zLm1kI2FkZGRhdGF0b21hcClcbiAqIE5PVEU6IFRoaXMgZnVuY3Rpb24gbWF5IG11dGF0ZSBpbnB1dC5cbiAqXG4gKiBAcGFyYW0gIHJhd0RhdGEgcmF3IGdlb2pzb24gZmVhdHVyZSBjb2xsZWN0aW9uXG4gKiBAcmV0dXJucyAgZGF0YXNldCBjb250YWluaW5nIGBmaWVsZHNgIGFuZCBgcm93c2BcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGEtcHJvY2Vzc29yJykucHJvY2Vzc0dlb2pzb259XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHthZGREYXRhVG9NYXB9IGZyb20gJ2tlcGxlci5nbC9hY3Rpb25zJztcbiAqIGltcG9ydCB7cHJvY2Vzc0dlb2pzb259IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqXG4gKiBjb25zdCBnZW9qc29uID0ge1xuICogXHRcInR5cGVcIiA6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAqIFx0XCJmZWF0dXJlc1wiIDogW3tcbiAqIFx0XHRcInR5cGVcIiA6IFwiRmVhdHVyZVwiLFxuICogXHRcdFwicHJvcGVydGllc1wiIDoge1xuICogXHRcdFx0XCJjYXBhY2l0eVwiIDogXCIxMFwiLFxuICogXHRcdFx0XCJ0eXBlXCIgOiBcIlUtUmFja1wiXG4gKiBcdFx0fSxcbiAqIFx0XHRcImdlb21ldHJ5XCIgOiB7XG4gKiBcdFx0XHRcInR5cGVcIiA6IFwiUG9pbnRcIixcbiAqIFx0XHRcdFwiY29vcmRpbmF0ZXNcIiA6IFsgLTcxLjA3MzI4MywgNDIuNDE3NTAwIF1cbiAqIFx0XHR9XG4gKiBcdH1dXG4gKiB9O1xuICpcbiAqIGRpc3BhdGNoKGFkZERhdGFUb01hcCh7XG4gKiAgZGF0YXNldHM6IHtcbiAqICAgIGluZm86IHtcbiAqICAgICAgbGFiZWw6ICdTYW1wbGUgVGF4aSBUcmlwcyBpbiBOZXcgWW9yayBDaXR5JyxcbiAqICAgICAgaWQ6ICd0ZXN0X3RyaXBfZGF0YSdcbiAqICAgIH0sXG4gKiAgICBkYXRhOiBwcm9jZXNzR2VvanNvbihnZW9qc29uKVxuICogIH1cbiAqIH0pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NHZW9qc29uKHJhd0RhdGEpIHtcbiAgY29uc3Qgbm9ybWFsaXplZEdlb2pzb24gPSBub3JtYWxpemUocmF3RGF0YSk7XG5cbiAgaWYgKCFub3JtYWxpemVkR2VvanNvbiB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkR2VvanNvbi5mZWF0dXJlcykpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgIGBSZWFkIEZpbGUgRmFpbGVkOiBGaWxlIGlzIG5vdCBhIHZhbGlkIEdlb0pTT04uIFJlYWQgbW9yZSBhYm91dCBbc3VwcG9ydGVkIGZpbGUgZm9ybWF0XSgke0dVSURFU19GSUxFX0ZPUk1BVF9ET0N9KWBcbiAgICApO1xuICAgIHRocm93IGVycm9yO1xuICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgfVxuXG4gIC8vIGdldHRpbmcgYWxsIGZlYXR1cmUgZmllbGRzXG4gIGNvbnN0IGFsbERhdGFSb3dzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBmID0gbm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXNbaV07XG4gICAgaWYgKGYuZ2VvbWV0cnkpIHtcbiAgICAgIGFsbERhdGFSb3dzLnB1c2goe1xuICAgICAgICAvLyBhZGQgZmVhdHVyZSB0byBfZ2VvanNvbiBmaWVsZFxuICAgICAgICBfZ2VvanNvbjogZixcbiAgICAgICAgLi4uKGYucHJvcGVydGllcyB8fCB7fSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvLyBnZXQgYWxsIHRoZSBmaWVsZFxuICBjb25zdCBmaWVsZHMgPSBhbGxEYXRhUm93cy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICBPYmplY3Qua2V5cyhjdXJyKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXByZXYuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICBwcmV2LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwgW10pO1xuXG4gIC8vIG1ha2Ugc3VyZSBlYWNoIGZlYXR1cmUgaGFzIGV4YWN0IHNhbWUgZmllbGRzXG4gIGFsbERhdGFSb3dzLmZvckVhY2goZCA9PiB7XG4gICAgZmllbGRzLmZvckVhY2goZiA9PiB7XG4gICAgICBpZiAoIShmIGluIGQpKSB7XG4gICAgICAgIGRbZl0gPSBudWxsO1xuICAgICAgICBkLl9nZW9qc29uLnByb3BlcnRpZXNbZl0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvY2Vzc1Jvd09iamVjdChhbGxEYXRhUm93cyk7XG59XG5cbi8qKlxuICogT24gZXhwb3J0IGRhdGEgdG8gY3N2XG4gKiBAcGFyYW0ge0FycmF5PEFycmF5Pn0gZGF0YSBgZGF0YXNldC5hbGxEYXRhYCBvciBmaWx0ZXJlZCBkYXRhIGBkYXRhc2V0LmRhdGFgXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpZWxkcyBgZGF0YXNldC5maWVsZHNgXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjc3Ygc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDc3YoZGF0YSwgZmllbGRzKSB7XG4gIGNvbnN0IGNvbHVtbnMgPSBmaWVsZHMubWFwKGYgPT4gZi5kaXNwbGF5TmFtZSB8fCBmLm5hbWUpO1xuICBjb25zdCBmb3JtYXR0ZWREYXRhID0gW2NvbHVtbnNdO1xuXG4gIC8vIHBhcnNlIGdlb2pzb24gb2JqZWN0IGFzIHN0cmluZ1xuICBkYXRhLmZvckVhY2gocm93ID0+IHtcbiAgICBmb3JtYXR0ZWREYXRhLnB1c2gocm93Lm1hcCgoZCwgaSkgPT4gcGFyc2VGaWVsZFZhbHVlKGQsIGZpZWxkc1tpXS50eXBlKSkpO1xuICB9KTtcblxuICByZXR1cm4gY3N2Rm9ybWF0Um93cyhmb3JtYXR0ZWREYXRhKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBpbnB1dCBkYXRhLCBhZGRpbmcgbWlzc2luZyBmaWVsZCB0eXBlcywgcmVuYW1lIGR1cGxpY2F0ZSBjb2x1bW5zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9kYXRhLXByb2Nlc3NvcicpLnZhbGlkYXRlSW5wdXREYXRhfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dERhdGEoZGF0YSkge1xuICBpZiAoIWlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICBhc3NlcnQoJ2FkZERhdGFUb01hcCBFcnJvcjogZGF0YXNldC5kYXRhIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5maWVsZHMpKSB7XG4gICAgYXNzZXJ0KCdhZGREYXRhVG9NYXAgRXJyb3I6IGV4cGVjdCBkYXRhc2V0LmRhdGEuZmllbGRzIHRvIGJlIGFuIGFycmF5Jyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5yb3dzKSkge1xuICAgIGFzc2VydCgnYWRkRGF0YVRvTWFwIEVycm9yOiBleHBlY3QgZGF0YXNldC5kYXRhLnJvd3MgdG8gYmUgYW4gYXJyYXknKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHtmaWVsZHMsIHJvd3N9ID0gZGF0YTtcblxuICAvLyBjaGVjayBpZiBhbGwgZmllbGRzIGhhcyBuYW1lLCBmb3JtYXQgYW5kIHR5cGVcbiAgY29uc3QgYWxsVmFsaWQgPSBmaWVsZHMuZXZlcnkoKGYsIGkpID0+IHtcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoZikpIHtcbiAgICAgIGFzc2VydChgZmllbGRzIG5lZWRzIHRvIGJlIGFuIGFycmF5IG9mIG9iamVjdCwgYnV0IGZpbmQgJHt0eXBlb2YgZn1gKTtcbiAgICAgIGZpZWxkc1tpXSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghZi5uYW1lKSB7XG4gICAgICBhc3NlcnQoYGZpZWxkLm5hbWUgaXMgcmVxdWlyZWQgYnV0IG1pc3NpbmcgaW4gJHtKU09OLnN0cmluZ2lmeShmKX1gKTtcbiAgICAgIC8vIGFzc2lnbiBhIG5hbWVcbiAgICAgIGZpZWxkc1tpXS5uYW1lID0gYGNvbHVtbl8ke2l9YDtcbiAgICB9XG5cbiAgICBpZiAoIUFMTF9GSUVMRF9UWVBFU1tmLnR5cGVdKSB7XG4gICAgICBhc3NlcnQoYHVua25vd24gZmllbGQgdHlwZSAke2YudHlwZX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWZpZWxkcy5ldmVyeShmaWVsZCA9PiBmaWVsZC5hbmFseXplclR5cGUpKSB7XG4gICAgICBhc3NlcnQoJ2ZpZWxkIG1pc3NpbmcgYW5hbHl6ZXJUeXBlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgdGltZSBmb3JtYXQgaXMgY29ycmVjdCBiYXNlZCBvbiBmaXJzdCAxMCBub3QgZW1wdHkgZWxlbWVudFxuICAgIGlmIChmLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXApIHtcbiAgICAgIGNvbnN0IHNhbXBsZSA9IGZpbmROb25FbXB0eVJvd3NBdEZpZWxkKHJvd3MsIGksIDEwKS5tYXAociA9PiAoe3RzOiByW2ldfSkpO1xuICAgICAgY29uc3QgYW5hbHl6ZWRUeXBlID0gQW5hbHl6ZXIuY29tcHV0ZUNvbE1ldGEoc2FtcGxlKVswXTtcbiAgICAgIHJldHVybiBhbmFseXplZFR5cGUgJiYgYW5hbHl6ZWRUeXBlLmNhdGVnb3J5ID09PSAnVElNRScgJiYgYW5hbHl6ZWRUeXBlLmZvcm1hdCA9PT0gZi5mb3JtYXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIGlmIChhbGxWYWxpZCkge1xuICAgIHJldHVybiB7cm93cywgZmllbGRzfTtcbiAgfVxuXG4gIC8vIGlmIGFueSBmaWVsZCBoYXMgbWlzc2luZyB0eXBlLCByZWNhbGN1bGF0ZSBpdCBmb3IgZXZlcnlvbmVcbiAgLy8gYmVjYXVzZSB3ZSBzaW1wbHkgbG9zdCBmYWl0aCBpbiBodW1hbml0eVxuICBjb25zdCBzYW1wbGVEYXRhID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe1xuICAgIGZpZWxkczogZmllbGRzLm1hcChmID0+IGYubmFtZSksXG4gICAgYWxsRGF0YTogcm93c1xuICB9KTtcbiAgY29uc3QgZmllbGRPcmRlciA9IGZpZWxkcy5tYXAoZiA9PiBmLm5hbWUpO1xuICBjb25zdCBtZXRhID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlRGF0YSwgZmllbGRPcmRlcik7XG4gIGNvbnN0IHVwZGF0ZWRGaWVsZHMgPSBmaWVsZHMubWFwKChmLCBpKSA9PiAoe1xuICAgIC4uLmYsXG4gICAgdHlwZTogbWV0YVtpXS50eXBlLFxuICAgIGZvcm1hdDogbWV0YVtpXS5mb3JtYXQsXG4gICAgYW5hbHl6ZXJUeXBlOiBtZXRhW2ldLmFuYWx5emVyVHlwZVxuICB9KSk7XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3N9O1xufVxuXG5mdW5jdGlvbiBmaW5kTm9uRW1wdHlSb3dzQXRGaWVsZChyb3dzLCBmaWVsZElkeCwgdG90YWwpIHtcbiAgY29uc3Qgc2FtcGxlID0gW107XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKHNhbXBsZS5sZW5ndGggPCB0b3RhbCAmJiBpIDwgcm93cy5sZW5ndGgpIHtcbiAgICBpZiAobm90TnVsbG9yVW5kZWZpbmVkKHJvd3NbaV1bZmllbGRJZHhdKSkge1xuICAgICAgc2FtcGxlLnB1c2gocm93c1tpXSk7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuICByZXR1cm4gc2FtcGxlO1xufVxuLyoqXG4gKiBQcm9jZXNzIHNhdmVkIGtlcGxlci5nbCBqc29uIHRvIGJlIHBhc3MgdG8gW2BhZGREYXRhVG9NYXBgXSguLi9hY3Rpb25zL2FjdGlvbnMubWQjYWRkZGF0YXRvbWFwKS5cbiAqIFRoZSBqc29uIG9iamVjdCBzaG91bGQgY29udGFpbiBgZGF0YXNldHNgIGFuZCBgY29uZmlnYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSByYXdEYXRhXG4gKiBAcGFyYW0ge0FycmF5fSByYXdEYXRhLmRhdGFzZXRzXG4gKiBAcGFyYW0ge09iamVjdH0gcmF3RGF0YS5jb25maWdcbiAqIEByZXR1cm5zIHtPYmplY3R9IGRhdGFzZXRzIGFuZCBjb25maWcgYHtkYXRhc2V0czoge30sIGNvbmZpZzoge319YFxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7YWRkRGF0YVRvTWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiBpbXBvcnQge3Byb2Nlc3NLZXBsZXJnbEpTT059IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqXG4gKiBkaXNwYXRjaChhZGREYXRhVG9NYXAocHJvY2Vzc0tlcGxlcmdsSlNPTihrZXBsZXJHbEpzb24pKSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzS2VwbGVyZ2xKU09OKHJhd0RhdGEpIHtcbiAgcmV0dXJuIHJhd0RhdGEgPyBLZXBsZXJHbFNjaGVtYS5sb2FkKHJhd0RhdGEuZGF0YXNldHMsIHJhd0RhdGEuY29uZmlnKSA6IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgYSBzaW5nbGUgb3IgYW4gYXJyYXkgb2YgZGF0YXNldHMgc2F2ZWQgdXNpbmcga2VwbGVyLmdsIHNjaGVtYVxuICogQHBhcmFtIHtBcnJheSB8IEFycmF5PE9iamVjdD59IHJhd0RhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NLZXBsZXJnbERhdGFzZXQocmF3RGF0YSkge1xuICBpZiAoIXJhd0RhdGEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdHMgPSBLZXBsZXJHbFNjaGVtYS5wYXJzZVNhdmVkRGF0YSh0b0FycmF5KHJhd0RhdGEpKTtcbiAgaWYgKCFyZXN1bHRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocmF3RGF0YSkgPyByZXN1bHRzIDogcmVzdWx0c1swXTtcbn1cblxuZXhwb3J0IGNvbnN0IERBVEFTRVRfSEFORExFUlMgPSB7XG4gIFtEQVRBU0VUX0ZPUk1BVFMucm93XTogcHJvY2Vzc1Jvd09iamVjdCxcbiAgW0RBVEFTRVRfRk9STUFUUy5nZW9qc29uXTogcHJvY2Vzc0dlb2pzb24sXG4gIFtEQVRBU0VUX0ZPUk1BVFMuY3N2XTogcHJvY2Vzc0NzdkRhdGEsXG4gIFtEQVRBU0VUX0ZPUk1BVFMua2VwbGVyZ2xdOiBwcm9jZXNzS2VwbGVyZ2xEYXRhc2V0XG59O1xuXG5leHBvcnQgY29uc3QgUHJvY2Vzc29ycyA9IHtcbiAgcHJvY2Vzc0dlb2pzb24sXG4gIHByb2Nlc3NDc3ZEYXRhLFxuICBwcm9jZXNzUm93T2JqZWN0LFxuICBwcm9jZXNzS2VwbGVyZ2xKU09OLFxuICBwcm9jZXNzS2VwbGVyZ2xEYXRhc2V0LFxuICBhbmFseXplclR5cGVUb0ZpZWxkVHlwZSxcbiAgZ2V0RmllbGRzRnJvbURhdGEsXG4gIHBhcnNlQ3N2Um93c0J5RmllbGRUeXBlLFxuICBmb3JtYXRDc3Zcbn07XG4iXX0=