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
exports.Processors = exports.DATASET_HANDLERS = exports.PARSE_FIELD_VALUE_FROM_STRING = exports.ACCEPTED_ANALYZER_TYPES = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

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

exports.ACCEPTED_ANALYZER_TYPES = ACCEPTED_ANALYZER_TYPES;
var CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];
var IGNORE_DATA_TYPES = Object.keys(_typeAnalyzer.DATA_TYPES).filter(function (type) {
  return !ACCEPTED_ANALYZER_TYPES.includes(type);
});
var PARSE_FIELD_VALUE_FROM_STRING = (_PARSE_FIELD_VALUE_FR = {}, (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES["boolean"], {
  valid: function valid(d) {
    return typeof d === 'boolean';
  },
  parse: function parse(d) {
    return d === 'true' || d === 'True' || d === '1';
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
}), (0, _defineProperty2["default"])(_PARSE_FIELD_VALUE_FR, _defaultSettings.ALL_FIELD_TYPES.real, {
  valid: function valid(d) {
    return parseFloat(d) === d;
  },
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

function processCsvData(rawData) {
  // here we assume the csv file that people uploaded will have first row
  // as name of the column
  // TODO: add a alert at upload csv to remind define first row
  var result = (0, _d3Dsv.csvParseRows)(rawData);

  if (!Array.isArray(result) || result.length < 2) {
    // looks like an empty file, throw error to be catch
    throw new Error('Read File Failed: CSV is empty');
  }

  var _result = (0, _toArray2["default"])(result),
      headerRow = _result[0],
      rows = _result.slice(1);

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
  for (var i = 0; i < rows.length; i++) {
    for (var j = 0; j < rows[i].length; j++) {
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
 * Assign `type`, `tableFieldIndex` and `format` (timestamp only) to each field
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
 * // {name: 'time', format: 'YYYY-M-D H:m:s', tableFieldIndex: 1, type: 'timestamp'},
 * // {name: 'value', format: '', tableFieldIndex: 4, type: 'integer'},
 * // {name: 'surge', format: '', tableFieldIndex: 5, type: 'real'},
 * // {name: 'isTrip', format: '', tableFieldIndex: 6, type: 'boolean'},
 * // {name: 'zeroOnes', format: '', tableFieldIndex: 7, type: 'integer'}];
 *
 */


function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  var metadata = _typeAnalyzer.Analyzer.computeColMeta(data, [{
    regex: /.*geojson|all_points/g,
    dataType: 'GEOMETRY'
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
      format: format,
      tableFieldIndex: index + 1,
      type: analyzerTypeToFieldType(type),
      analyzerType: type
    };
  });
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

    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case ARRAY:
    case OBJECT:
      // TODO: create a new data type for objects and arrays
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
  }); // pick samples

  var sampleData = (0, _dataUtils.getSampleData)(rawData, 500);
  var fields = getFieldsFromData(sampleData, keys);
  var parsedRows = parseRowsByFields(rows, fields);
  return {
    fields: fields,
    rows: parsedRows
  };
}
/**
 * Process GeoJSON [`FeatureCollection`](http://wiki.geojson.org/GeoJSON_draft_version_6#FeatureCollection),
 * output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
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
    return f.name;
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

      return analyzedType.category === 'TIME' && analyzedType.format === f.format;
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
    return _objectSpread({}, f, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3JzL2RhdGEtcHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbIkFDQ0VQVEVEX0FOQUxZWkVSX1RZUEVTIiwiQW5hbHl6ZXJEQVRBX1RZUEVTIiwiREFURSIsIlRJTUUiLCJEQVRFVElNRSIsIk5VTUJFUiIsIklOVCIsIkZMT0FUIiwiQk9PTEVBTiIsIlNUUklORyIsIkdFT01FVFJZIiwiR0VPTUVUUllfRlJPTV9TVFJJTkciLCJQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HIiwiWklQQ09ERSIsIkFSUkFZIiwiT0JKRUNUIiwiQ1NWX05VTExTIiwiSUdOT1JFX0RBVEFfVFlQRVMiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwidHlwZSIsImluY2x1ZGVzIiwiUEFSU0VfRklFTERfVkFMVUVfRlJPTV9TVFJJTkciLCJBTExfRklFTERfVFlQRVMiLCJ2YWxpZCIsImQiLCJwYXJzZSIsImludGVnZXIiLCJwYXJzZUludCIsInRpbWVzdGFtcCIsImZpZWxkIiwiZm9ybWF0IiwiTnVtYmVyIiwicmVhbCIsInBhcnNlRmxvYXQiLCJwcm9jZXNzQ3N2RGF0YSIsInJhd0RhdGEiLCJyZXN1bHQiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJFcnJvciIsImhlYWRlclJvdyIsInJvd3MiLCJjbGVhblVwRmFsc3lDc3ZWYWx1ZSIsInNhbXBsZSIsImdldFNhbXBsZUZvclR5cGVBbmFseXplIiwiZmllbGRzIiwiYWxsRGF0YSIsImdldEZpZWxkc0Zyb21EYXRhIiwicGFyc2VkUm93cyIsInBhcnNlUm93c0J5RmllbGRzIiwiZ2VvanNvbkZpZWxkSWR4IiwiZmluZEluZGV4IiwiZiIsIm5hbWUiLCJmb3JFYWNoIiwicGFyc2VDc3ZSb3dzQnlGaWVsZFR5cGUiLCJiaW5kIiwic2FtcGxlQ291bnQiLCJ0b3RhbCIsIk1hdGgiLCJtaW4iLCJtYXAiLCJmaWVsZElkeCIsImkiLCJqIiwiZ2VvRmllbGRJZHgiLCJwYXJzZXIiLCJmaXJzdCIsImZpbmQiLCJyIiwicm93IiwicHJvcGVydGllcyIsImRhdGEiLCJmaWVsZE9yZGVyIiwibWV0YWRhdGEiLCJBbmFseXplciIsImNvbXB1dGVDb2xNZXRhIiwicmVnZXgiLCJkYXRhVHlwZSIsImlnbm9yZWREYXRhVHlwZXMiLCJyZW5hbWVEdXBsaWNhdGVGaWVsZHMiLCJmaWVsZEJ5SW5kZXgiLCJpbmRleCIsImZpZWxkTWV0YSIsIm0iLCJrZXkiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhbmFseXplclR5cGVUb0ZpZWxkVHlwZSIsImFuYWx5emVyVHlwZSIsInJlZHVjZSIsImFjY3UiLCJhbGxOYW1lcyIsImZpZWxkTmFtZSIsImNvdW50ZXIiLCJwdXNoIiwiYVR5cGUiLCJkYXRlIiwiZ2VvanNvbiIsInN0cmluZyIsImdsb2JhbENvbnNvbGUiLCJ3YXJuIiwicHJvY2Vzc1Jvd09iamVjdCIsInNhbXBsZURhdGEiLCJwcm9jZXNzR2VvanNvbiIsIm5vcm1hbGl6ZWRHZW9qc29uIiwiZmVhdHVyZXMiLCJlcnJvciIsIkdVSURFU19GSUxFX0ZPUk1BVF9ET0MiLCJhbGxEYXRhUm93cyIsImdlb21ldHJ5IiwiX2dlb2pzb24iLCJwcmV2IiwiY3VyciIsImZvcm1hdENzdiIsImNvbHVtbnMiLCJmb3JtYXR0ZWREYXRhIiwidmFsaWRhdGVJbnB1dERhdGEiLCJhbGxWYWxpZCIsImV2ZXJ5IiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbmROb25FbXB0eVJvd3NBdEZpZWxkIiwidHMiLCJhbmFseXplZFR5cGUiLCJjYXRlZ29yeSIsIm1ldGEiLCJ1cGRhdGVkRmllbGRzIiwicHJvY2Vzc0tlcGxlcmdsSlNPTiIsIktlcGxlckdsU2NoZW1hIiwibG9hZCIsImRhdGFzZXRzIiwiY29uZmlnIiwicHJvY2Vzc0tlcGxlcmdsRGF0YXNldCIsInJlc3VsdHMiLCJwYXJzZVNhdmVkRGF0YSIsIkRBVEFTRVRfSEFORExFUlMiLCJEQVRBU0VUX0ZPUk1BVFMiLCJjc3YiLCJrZXBsZXJnbCIsIlByb2Nlc3NvcnMiXSwibWFwcGluZ3Mi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QWdCRSxRQUpVLEVBSUNOLHNCQUpELHFCQUF0Qjs7QUFPQSxJQUFNTyxVQUFVLEdBQUc7QUFDeEJwQyxFQUFBQSxjQUFjLEVBQWRBLGNBRHdCO0FBRXhCdEUsRUFBQUEsY0FBYyxFQUFkQSxjQUZ3QjtBQUd4Qm9FLEVBQUFBLGdCQUFnQixFQUFoQkEsZ0JBSHdCO0FBSXhCMEIsRUFBQUEsbUJBQW1CLEVBQW5CQSxtQkFKd0I7QUFLeEJLLEVBQUFBLHNCQUFzQixFQUF0QkEsc0JBTHdCO0FBTXhCN0MsRUFBQUEsdUJBQXVCLEVBQXZCQSx1QkFOd0I7QUFPeEJ4QyxFQUFBQSxpQkFBaUIsRUFBakJBLGlCQVB3QjtBQVF4QlEsRUFBQUEsdUJBQXVCLEVBQXZCQSx1QkFSd0I7QUFTeEIwRCxFQUFBQSxTQUFTLEVBQVRBO0FBVHdCLENBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjc3ZQYXJzZVJvd3MsIGNzdkZvcm1hdFJvd3N9IGZyb20gJ2QzLWRzdic7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge2NvbnNvbGUgYXMgZ2xvYmFsQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQge0FuYWx5emVyLCBEQVRBX1RZUEVTIGFzIEFuYWx5emVyREFUQV9UWVBFU30gZnJvbSAndHlwZS1hbmFseXplcic7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ0BtYXBib3gvZ2VvanNvbi1ub3JtYWxpemUnO1xuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIERBVEFTRVRfRk9STUFUU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWQsIHBhcnNlRmllbGRWYWx1ZSwgZ2V0U2FtcGxlRGF0YX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQgS2VwbGVyR2xTY2hlbWEgZnJvbSAnc2NoZW1hcyc7XG5pbXBvcnQge0dVSURFU19GSUxFX0ZPUk1BVF9ET0N9IGZyb20gJ2NvbnN0YW50cy91c2VyLWd1aWRlcyc7XG5pbXBvcnQge2lzUGxhaW5PYmplY3QsIHRvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IEFDQ0VQVEVEX0FOQUxZWkVSX1RZUEVTID0gW1xuICBBbmFseXplckRBVEFfVFlQRVMuREFURSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLlRJTUUsXG4gIEFuYWx5emVyREFUQV9UWVBFUy5EQVRFVElNRSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLk5VTUJFUixcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLklOVCxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkZMT0FULFxuICBBbmFseXplckRBVEFfVFlQRVMuQk9PTEVBTixcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLlNUUklORyxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkdFT01FVFJZLFxuICBBbmFseXplckRBVEFfVFlQRVMuR0VPTUVUUllfRlJPTV9TVFJJTkcsXG4gIEFuYWx5emVyREFUQV9UWVBFUy5QQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HLFxuICBBbmFseXplckRBVEFfVFlQRVMuWklQQ09ERSxcbiAgQW5hbHl6ZXJEQVRBX1RZUEVTLkFSUkFZLFxuICBBbmFseXplckRBVEFfVFlQRVMuT0JKRUNUXG5dO1xuXG4vLyBpZiBhbnkgb2YgdGhlc2UgdmFsdWUgb2NjdXJzIGluIGNzdiwgcGFyc2UgaXQgdG8gbnVsbDtcbmNvbnN0IENTVl9OVUxMUyA9IFsnJywgJ251bGwnLCAnTlVMTCcsICdOdWxsJywgJ05hTicsICcvTiddO1xuXG5jb25zdCBJR05PUkVfREFUQV9UWVBFUyA9IE9iamVjdC5rZXlzKEFuYWx5emVyREFUQV9UWVBFUykuZmlsdGVyKFxuICB0eXBlID0+ICFBQ0NFUFRFRF9BTkFMWVpFUl9UWVBFUy5pbmNsdWRlcyh0eXBlKVxuKTtcblxuZXhwb3J0IGNvbnN0IFBBUlNFX0ZJRUxEX1ZBTFVFX0ZST01fU1RSSU5HID0ge1xuICBbQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW5dOiB7XG4gICAgdmFsaWQ6IGQgPT4gdHlwZW9mIGQgPT09ICdib29sZWFuJyxcbiAgICBwYXJzZTogZCA9PiBkID09PSAndHJ1ZScgfHwgZCA9PT0gJ1RydWUnIHx8IGQgPT09ICcxJ1xuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiB7XG4gICAgdmFsaWQ6IGQgPT4gcGFyc2VJbnQoZCwgMTApID09PSBkLFxuICAgIHBhcnNlOiBkID0+IHBhcnNlSW50KGQsIDEwKVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcF06IHtcbiAgICB2YWxpZDogKGQsIGZpZWxkKSA9PlxuICAgICAgWyd4JywgJ1gnXS5pbmNsdWRlcyhmaWVsZC5mb3JtYXQpID8gdHlwZW9mIGQgPT09ICdudW1iZXInIDogdHlwZW9mIGQgPT09ICdzdHJpbmcnLFxuICAgIHBhcnNlOiAoZCwgZmllbGQpID0+IChbJ3gnLCAnWCddLmluY2x1ZGVzKGZpZWxkLmZvcm1hdCkgPyBOdW1iZXIoZCkgOiBkKVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiB7XG4gICAgdmFsaWQ6IGQgPT4gcGFyc2VGbG9hdChkKSA9PT0gZCxcbiAgICBwYXJzZTogcGFyc2VGbG9hdFxuICB9XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgY3N2IGRhdGEsIG91dHB1dCBhIGRhdGEgb2JqZWN0IHdpdGggYHtmaWVsZHM6IFtdLCByb3dzOiBbXX1gLlxuICogVGhlIGRhdGEgb2JqZWN0IGNhbiBiZSB3cmFwcGVkIGluIGEgYGRhdGFzZXRgIGFuZCBwYXNzIHRvIFtgYWRkRGF0YVRvTWFwYF0oLi4vYWN0aW9ucy9hY3Rpb25zLm1kI2FkZGRhdGF0b21hcClcbiAqIEBwYXJhbSByYXdEYXRhIHJhdyBjc3Ygc3RyaW5nXG4gKiBAcmV0dXJucyAgZGF0YSBvYmplY3QgYHtmaWVsZHM6IFtdLCByb3dzOiBbXX1gIGNhbiBiZSBwYXNzZWQgdG8gYWRkRGF0YVRvTWFwc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5wcm9jZXNzQ3N2RGF0YX1cbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge3Byb2Nlc3NDc3ZEYXRhfSBmcm9tICdrZXBsZXIuZ2wvcHJvY2Vzc29ycyc7XG4gKlxuICogY29uc3QgdGVzdERhdGEgPSBgZ3BzX2RhdGEudXRjX3RpbWVzdGFtcCxncHNfZGF0YS5sYXQsZ3BzX2RhdGEubG5nLGdwc19kYXRhLnR5cGVzLGVwb2NoLGhhc19yZXN1bHQsaWQsdGltZSxiZWdpbnRyaXBfdHNfdXRjLGJlZ2ludHJpcF90c19sb2NhbCxkYXRlXG4gKiAyMDE2LTA5LTE3IDAwOjA5OjU1LDI5Ljk5MDA5MzcsMzEuMjU5MDU0Mixkcml2ZXJfYW5hbHl0aWNzLDE0NzI2ODgwMDAwMDAsRmFsc2UsMSwyMDE2LTA5LTIzVDAwOjAwOjAwLjAwMFosMjAxNi0xMC0wMSAwOTo0MTozOSswMDowMCwyMDE2LTEwLTAxIDA5OjQxOjM5KzAwOjAwLDIwMTYtMDktMjNcbiAqIDIwMTYtMDktMTcgMDA6MTA6NTYsMjkuOTkyNzY5OSwzMS4yNDYxMTQyLGRyaXZlcl9hbmFseXRpY3MsMTQ3MjY4ODAwMDAwMCxGYWxzZSwyLDIwMTYtMDktMjNUMDA6MDA6MDAuMDAwWiwyMDE2LTEwLTAxIDA5OjQ2OjM3KzAwOjAwLDIwMTYtMTAtMDEgMTY6NDY6MzcrMDA6MDAsMjAxNi0wOS0yM1xuICogMjAxNi0wOS0xNyAwMDoxMTo1NiwyOS45OTA3MjYxLDMxLjIzMTI3NDIsZHJpdmVyX2FuYWx5dGljcywxNDcyNjg4MDAwMDAwLEZhbHNlLDMsMjAxNi0wOS0yM1QwMDowMDowMC4wMDBaLCwsMjAxNi0wOS0yM1xuICogMjAxNi0wOS0xNyAwMDoxMjo1OCwyOS45ODcwMDc0LDMxLjIxNzU4MjcsZHJpdmVyX2FuYWx5dGljcywxNDcyNjg4MDAwMDAwLEZhbHNlLDQsMjAxNi0wOS0yM1QwMDowMDowMC4wMDBaLCwsMjAxNi0wOS0yM2BcbiAqXG4gKiBjb25zdCBkYXRhc2V0ID0ge1xuICogIGluZm86IHtpZDogJ3Rlc3RfZGF0YScsIGxhYmVsOiAnTXkgQ3N2J30sXG4gKiAgZGF0YTogcHJvY2Vzc0NzdkRhdGEodGVzdERhdGEpXG4gKiB9O1xuICpcbiAqIGRpc3BhdGNoKGFkZERhdGFUb01hcCh7XG4gKiAgZGF0YXNldHM6IFtkYXRhc2V0XSxcbiAqICBvcHRpb25zOiB7Y2VudGVyTWFwOiB0cnVlLCByZWFkT25seTogdHJ1ZX1cbiAqIH0pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NDc3ZEYXRhKHJhd0RhdGEpIHtcbiAgLy8gaGVyZSB3ZSBhc3N1bWUgdGhlIGNzdiBmaWxlIHRoYXQgcGVvcGxlIHVwbG9hZGVkIHdpbGwgaGF2ZSBmaXJzdCByb3dcbiAgLy8gYXMgbmFtZSBvZiB0aGUgY29sdW1uXG4gIC8vIFRPRE86IGFkZCBhIGFsZXJ0IGF0IHVwbG9hZCBjc3YgdG8gcmVtaW5kIGRlZmluZSBmaXJzdCByb3dcbiAgY29uc3QgcmVzdWx0ID0gY3N2UGFyc2VSb3dzKHJhd0RhdGEpO1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSB8fCByZXN1bHQubGVuZ3RoIDwgMikge1xuICAgIC8vIGxvb2tzIGxpa2UgYW4gZW1wdHkgZmlsZSwgdGhyb3cgZXJyb3IgdG8gYmUgY2F0Y2hcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlYWQgRmlsZSBGYWlsZWQ6IENTViBpcyBlbXB0eScpO1xuICB9XG5cbiAgY29uc3QgW2hlYWRlclJvdywgLi4ucm93c10gPSByZXN1bHQ7XG5cbiAgY2xlYW5VcEZhbHN5Q3N2VmFsdWUocm93cyk7XG4gIC8vIE5vIG5lZWQgdG8gcnVuIHR5cGUgZGV0ZWN0aW9uIG9uIGV2ZXJ5IGRhdGEgcG9pbnRcbiAgLy8gaGVyZSB3ZSBnZXQgYSBsaXN0IG9mIG5vbmUgbnVsbCB2YWx1ZXMgdG8gcnVuIGFuYWx5emUgb25cbiAgY29uc3Qgc2FtcGxlID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkczogaGVhZGVyUm93LCBhbGxEYXRhOiByb3dzfSk7XG5cbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlLCBoZWFkZXJSb3cpO1xuXG4gIGNvbnN0IHBhcnNlZFJvd3MgPSBwYXJzZVJvd3NCeUZpZWxkcyhyb3dzLCBmaWVsZHMpO1xuXG4gIHJldHVybiB7ZmllbGRzLCByb3dzOiBwYXJzZWRSb3dzfTtcbn1cblxuLyoqXG4gKiBQYXJzZSByb3dzIG9mIGNzdiBieSBhbmFseXplZCBmaWVsZCB0eXBlcy4gU28gdGhhdCBgJzEnYCAtPiBgMWAsIGAnVHJ1ZSdgIC0+IGB0cnVlYFxuICogQHBhcmFtIHtBcnJheTxBcnJheT59IHJvd3NcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZmllbGRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJvd3NCeUZpZWxkcyhyb3dzLCBmaWVsZHMpIHtcbiAgLy8gRWRpdCByb3dzIGluIHBsYWNlXG4gIGNvbnN0IGdlb2pzb25GaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoZiA9PiBmLm5hbWUgPT09ICdfZ2VvanNvbicpO1xuICBmaWVsZHMuZm9yRWFjaChwYXJzZUNzdlJvd3NCeUZpZWxkVHlwZS5iaW5kKG51bGwsIHJvd3MsIGdlb2pzb25GaWVsZElkeCkpO1xuXG4gIHJldHVybiByb3dzO1xufVxuLyoqXG4gKiBHZXR0aW5nIHNhbXBsZSBkYXRhIGZvciBhbmFseXppbmcgZmllbGQgdHlwZS5cbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9kYXRhLXByb2Nlc3NvcicpLmdldFNhbXBsZUZvclR5cGVBbmFseXplfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YSwgc2FtcGxlQ291bnQgPSA1MH0pIHtcbiAgY29uc3QgdG90YWwgPSBNYXRoLm1pbihzYW1wbGVDb3VudCwgYWxsRGF0YS5sZW5ndGgpO1xuICAvLyBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIGNvbnN0IHNhbXBsZSA9IHJhbmdlKDAsIHRvdGFsLCAxKS5tYXAoZCA9PiAoe30pKTtcblxuICAvLyBjb2xsZWN0IHNhbXBsZSBkYXRhIGZvciBlYWNoIGZpZWxkXG4gIGZpZWxkcy5mb3JFYWNoKChmaWVsZCwgZmllbGRJZHgpID0+IHtcbiAgICAvLyBkYXRhIGNvdW50ZXJcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gc2FtcGxlIGNvdW50ZXJcbiAgICBsZXQgaiA9IDA7XG5cbiAgICB3aGlsZSAoaiA8IHRvdGFsKSB7XG4gICAgICBpZiAoaSA+PSBhbGxEYXRhLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBkZXBsZXRlZCBkYXRhIHBvb2xcbiAgICAgICAgc2FtcGxlW2pdW2ZpZWxkXSA9IG51bGw7XG4gICAgICAgIGorKztcbiAgICAgIH0gZWxzZSBpZiAobm90TnVsbG9yVW5kZWZpbmVkKGFsbERhdGFbaV1bZmllbGRJZHhdKSkge1xuICAgICAgICBzYW1wbGVbal1bZmllbGRdID0gYWxsRGF0YVtpXVtmaWVsZElkeF07XG4gICAgICAgIGorKztcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNhbXBsZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGZhbHN5IHZhbHVlIGluIGNzdiBpbmNsdWRpbmcgYCcnLCAnbnVsbCcsICdOVUxMJywgJ051bGwnLCAnTmFOJ2AgdG8gYG51bGxgLFxuICogc28gdGhhdCB0eXBlLWFuYWx5emVyIHdvbid0IGRldGVjdCBpdCBhcyBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5Pn0gcm93c1xuICovXG5mdW5jdGlvbiBjbGVhblVwRmFsc3lDc3ZWYWx1ZShyb3dzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93c1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgLy8gYW5hbHl6ZXIgd2lsbCBzZXQgYW55IGZpZWxkcyB0byAnc3RyaW5nJyBpZiB0aGVyZSBhcmUgZW1wdHkgdmFsdWVzXG4gICAgICAvLyB3aGljaCB3aWxsIGJlIHBhcnNlZCBhcyAnJyBieSBkMy5jc3ZcbiAgICAgIC8vIGhlcmUgd2UgcGFyc2UgZW1wdHkgZGF0YSBhcyBudWxsXG4gICAgICAvLyBUT0RPOiBjcmVhdGUgd2FybmluZyB3aGVuIGRlbHRlY3QgYENTVl9OVUxMU2AgaW4gdGhlIGRhdGFcbiAgICAgIGlmICghcm93c1tpXVtqXSB8fCBDU1ZfTlVMTFMuaW5jbHVkZXMocm93c1tpXVtqXSkpIHtcbiAgICAgICAgcm93c1tpXVtqXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvY2VzcyB1cGxvYWRlZCBjc3YgZmlsZSB0byBwYXJzZSB2YWx1ZSBieSBmaWVsZCB0eXBlXG4gKlxuICogQHBhcmFtIHJvd3NcbiAqIEBwYXJhbSBnZW9GaWVsZElkeCBmaWVsZCBpbmRleFxuICogQHBhcmFtIGZpZWxkXG4gKiBAcGFyYW0gaVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS5wYXJzZUNzdlJvd3NCeUZpZWxkVHlwZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3N2Um93c0J5RmllbGRUeXBlKHJvd3MsIGdlb0ZpZWxkSWR4LCBmaWVsZCwgaSkge1xuICBjb25zdCBwYXJzZXIgPSBQQVJTRV9GSUVMRF9WQUxVRV9GUk9NX1NUUklOR1tmaWVsZC50eXBlXTtcbiAgaWYgKHBhcnNlcikge1xuICAgIC8vIGNoZWNrIGZpcnN0IG5vdCBudWxsIHZhbHVlIG9mIGl0J3MgYWxyZWFkeSBwYXJzZWRcbiAgICBjb25zdCBmaXJzdCA9IHJvd3MuZmluZChyID0+IG5vdE51bGxvclVuZGVmaW5lZChyW2ldKSk7XG4gICAgaWYgKCFmaXJzdCB8fCBwYXJzZXIudmFsaWQoZmlyc3RbaV0sIGZpZWxkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgIC8vIHBhcnNlIHN0cmluZyB2YWx1ZSBiYXNlZCBvbiBmaWVsZCB0eXBlXG4gICAgICBpZiAocm93W2ldICE9PSBudWxsKSB7XG4gICAgICAgIHJvd1tpXSA9IHBhcnNlci5wYXJzZShyb3dbaV0sIGZpZWxkKTtcbiAgICAgICAgaWYgKGdlb0ZpZWxkSWR4ID4gLTEgJiYgcm93W2dlb0ZpZWxkSWR4XSAmJiByb3dbZ2VvRmllbGRJZHhdLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICByb3dbZ2VvRmllbGRJZHhdLnByb3BlcnRpZXNbZmllbGQubmFtZV0gPSByb3dbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEFuYWx5emUgZmllbGQgdHlwZXMgZnJvbSBkYXRhIGluIGBzdHJpbmdgIGZvcm1hdCwgZS5nLiB1cGxvYWRlZCBjc3YuXG4gKiBBc3NpZ24gYHR5cGVgLCBgdGFibGVGaWVsZEluZGV4YCBhbmQgYGZvcm1hdGAgKHRpbWVzdGFtcCBvbmx5KSB0byBlYWNoIGZpZWxkXG4gKlxuICogQHBhcmFtIGRhdGEgYXJyYXkgb2Ygcm93IG9iamVjdFxuICogQHBhcmFtIGZpZWxkT3JkZXIgYXJyYXkgb2YgZmllbGQgbmFtZXMgYXMgc3RyaW5nXG4gKiBAcmV0dXJucyBmb3JtYXR0ZWQgZmllbGRzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9kYXRhLXByb2Nlc3NvcicpLmdldEZpZWxkc0Zyb21EYXRhfVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQge2dldEZpZWxkc0Zyb21EYXRhfSBmcm9tICdrZXBsZXIuZ2wvcHJvY2Vzc29ycyc7XG4gKiBjb25zdCBkYXRhID0gW3tcbiAqICAgdGltZTogJzIwMTYtMDktMTcgMDA6MDk6NTUnLFxuICogICB2YWx1ZTogJzQnLFxuICogICBzdXJnZTogJzEuMicsXG4gKiAgIGlzVHJpcDogJ3RydWUnLFxuICogICB6ZXJvT25lczogJzAnXG4gKiB9LCB7XG4gKiAgIHRpbWU6ICcyMDE2LTA5LTE3IDAwOjMwOjA4JyxcbiAqICAgdmFsdWU6ICczJyxcbiAqICAgc3VyZ2U6IG51bGwsXG4gKiAgIGlzVHJpcDogJ2ZhbHNlJyxcbiAqICAgemVyb09uZXM6ICcxJ1xuICogfSwge1xuICogICB0aW1lOiBudWxsLFxuICogICB2YWx1ZTogJzInLFxuICogICBzdXJnZTogJzEuMycsXG4gKiAgIGlzVHJpcDogbnVsbCxcbiAqICAgemVyb09uZXM6ICcxJ1xuICogfV07XG4gKlxuICogY29uc3QgZmllbGRPcmRlciA9IFsndGltZScsICd2YWx1ZScsICdzdXJnZScsICdpc1RyaXAnLCAnemVyb09uZXMnXTtcbiAqIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc0Zyb21EYXRhKGRhdGEsIGZpZWxkT3JkZXIpO1xuICogLy8gZmllbGRzID0gW1xuICogLy8ge25hbWU6ICd0aW1lJywgZm9ybWF0OiAnWVlZWS1NLUQgSDptOnMnLCB0YWJsZUZpZWxkSW5kZXg6IDEsIHR5cGU6ICd0aW1lc3RhbXAnfSxcbiAqIC8vIHtuYW1lOiAndmFsdWUnLCBmb3JtYXQ6ICcnLCB0YWJsZUZpZWxkSW5kZXg6IDQsIHR5cGU6ICdpbnRlZ2VyJ30sXG4gKiAvLyB7bmFtZTogJ3N1cmdlJywgZm9ybWF0OiAnJywgdGFibGVGaWVsZEluZGV4OiA1LCB0eXBlOiAncmVhbCd9LFxuICogLy8ge25hbWU6ICdpc1RyaXAnLCBmb3JtYXQ6ICcnLCB0YWJsZUZpZWxkSW5kZXg6IDYsIHR5cGU6ICdib29sZWFuJ30sXG4gKiAvLyB7bmFtZTogJ3plcm9PbmVzJywgZm9ybWF0OiAnJywgdGFibGVGaWVsZEluZGV4OiA3LCB0eXBlOiAnaW50ZWdlcid9XTtcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZHNGcm9tRGF0YShkYXRhLCBmaWVsZE9yZGVyKSB7XG4gIC8vIGFkZCBhIGNoZWNrIGZvciBlcG9jaCB0aW1lc3RhbXBcbiAgY29uc3QgbWV0YWRhdGEgPSBBbmFseXplci5jb21wdXRlQ29sTWV0YShcbiAgICBkYXRhLFxuICAgIFt7cmVnZXg6IC8uKmdlb2pzb258YWxsX3BvaW50cy9nLCBkYXRhVHlwZTogJ0dFT01FVFJZJ31dLFxuICAgIHtpZ25vcmVkRGF0YVR5cGVzOiBJR05PUkVfREFUQV9UWVBFU31cbiAgKTtcblxuICBjb25zdCB7ZmllbGRCeUluZGV4fSA9IHJlbmFtZUR1cGxpY2F0ZUZpZWxkcyhmaWVsZE9yZGVyKTtcblxuICBjb25zdCByZXN1bHQgPSBmaWVsZE9yZGVyLm1hcCgoZmllbGQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGZpZWxkQnlJbmRleFtpbmRleF07XG5cbiAgICBjb25zdCBmaWVsZE1ldGEgPSBtZXRhZGF0YS5maW5kKG0gPT4gbS5rZXkgPT09IGZpZWxkKTtcbiAgICBjb25zdCB7dHlwZSwgZm9ybWF0fSA9IGZpZWxkTWV0YSB8fCB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgdGFibGVGaWVsZEluZGV4OiBpbmRleCArIDEsXG4gICAgICB0eXBlOiBhbmFseXplclR5cGVUb0ZpZWxkVHlwZSh0eXBlKSxcbiAgICAgIGFuYWx5emVyVHlwZTogdHlwZVxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogcGFzcyBpbiBhbiBhcnJheSBvZiBmaWVsZCBuYW1lcywgcmVuYW1lIGR1cGxpY2F0ZWQgb25lXG4gKiBhbmQgcmV0dXJuIGEgbWFwIGZyb20gb2xkIGZpZWxkIGluZGV4IHRvIG5ldyBuYW1lXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmllbGRPcmRlclxuICogQHJldHVybnMge09iamVjdH0gbmV3IGZpZWxkIG5hbWUgYnkgaW5kZXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmFtZUR1cGxpY2F0ZUZpZWxkcyhmaWVsZE9yZGVyKSB7XG4gIHJldHVybiBmaWVsZE9yZGVyLnJlZHVjZShcbiAgICAoYWNjdSwgZmllbGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IHthbGxOYW1lc30gPSBhY2N1O1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGZpZWxkO1xuXG4gICAgICAvLyBhZGQgYSBjb3VudGVyIHRvIGR1cGxpY2F0ZWQgbmFtZXNcbiAgICAgIGlmIChhbGxOYW1lcy5pbmNsdWRlcyhmaWVsZCkpIHtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICB3aGlsZSAoYWxsTmFtZXMuaW5jbHVkZXMoYCR7ZmllbGR9LSR7Y291bnRlcn1gKSkge1xuICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBmaWVsZE5hbWUgPSBgJHtmaWVsZH0tJHtjb3VudGVyfWA7XG4gICAgICB9XG5cbiAgICAgIGFjY3UuZmllbGRCeUluZGV4W2ldID0gZmllbGROYW1lO1xuICAgICAgYWNjdS5hbGxOYW1lcy5wdXNoKGZpZWxkTmFtZSk7XG5cbiAgICAgIHJldHVybiBhY2N1O1xuICAgIH0sXG4gICAge2FsbE5hbWVzOiBbXSwgZmllbGRCeUluZGV4OiB7fX1cbiAgKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHR5cGUtYW5hbHl6ZXIgb3V0cHV0IHRvIGtlcGxlci5nbCBmaWVsZCB0eXBlc1xuICpcbiAqIEBwYXJhbSBhVHlwZVxuICogQHJldHVybnMgY29ycmVzcG9uZGluZyB0eXBlIGluIGBBTExfRklFTERfVFlQRVNgXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9kYXRhLXByb2Nlc3NvcicpLmFuYWx5emVyVHlwZVRvRmllbGRUeXBlfX1cbiAqL1xuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVyVHlwZVRvRmllbGRUeXBlKGFUeXBlKSB7XG4gIGNvbnN0IHtcbiAgICBEQVRFLFxuICAgIFRJTUUsXG4gICAgREFURVRJTUUsXG4gICAgTlVNQkVSLFxuICAgIElOVCxcbiAgICBGTE9BVCxcbiAgICBCT09MRUFOLFxuICAgIFNUUklORyxcbiAgICBHRU9NRVRSWSxcbiAgICBHRU9NRVRSWV9GUk9NX1NUUklORyxcbiAgICBQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HLFxuICAgIFpJUENPREUsXG4gICAgQVJSQVksXG4gICAgT0JKRUNUXG4gIH0gPSBBbmFseXplckRBVEFfVFlQRVM7XG5cbiAgLy8gVE9ETzogdW4gcmVjb2duaXplZCB0eXBlc1xuICAvLyBDVVJSRU5DWSBQRVJDRU5UIE5PTkVcbiAgc3dpdGNoIChhVHlwZSkge1xuICAgIGNhc2UgREFURTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuZGF0ZTtcbiAgICBjYXNlIFRJTUU6XG4gICAgY2FzZSBEQVRFVElNRTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICAgIGNhc2UgRkxPQVQ6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLnJlYWw7XG4gICAgY2FzZSBJTlQ6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI7XG4gICAgY2FzZSBCT09MRUFOOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuO1xuICAgIGNhc2UgR0VPTUVUUlk6XG4gICAgY2FzZSBHRU9NRVRSWV9GUk9NX1NUUklORzpcbiAgICBjYXNlIFBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkc6XG4gICAgY2FzZSBBUlJBWTpcbiAgICBjYXNlIE9CSkVDVDpcbiAgICAgIC8vIFRPRE86IGNyZWF0ZSBhIG5ldyBkYXRhIHR5cGUgZm9yIG9iamVjdHMgYW5kIGFycmF5c1xuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5nZW9qc29uO1xuICAgIGNhc2UgTlVNQkVSOlxuICAgIGNhc2UgU1RSSU5HOlxuICAgIGNhc2UgWklQQ09ERTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuc3RyaW5nO1xuICAgIGRlZmF1bHQ6XG4gICAgICBnbG9iYWxDb25zb2xlLndhcm4oYFVuc3VwcG9ydGVkIGFuYWx5emVyIHR5cGU6ICR7YVR5cGV9YCk7XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLnN0cmluZztcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogUHJvY2VzcyBkYXRhIHdoZXJlIGVhY2ggcm93IGlzIGFuIG9iamVjdCwgb3V0cHV0IGNhbiBiZSBwYXNzZWQgdG8gW2BhZGREYXRhVG9NYXBgXSguLi9hY3Rpb25zL2FjdGlvbnMubWQjYWRkZGF0YXRvbWFwKVxuICogQHBhcmFtIHJhd0RhdGEgYW4gYXJyYXkgb2Ygcm93IG9iamVjdCwgZWFjaCBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIGtleXNcbiAqIEByZXR1cm5zIGRhdGFzZXQgY29udGFpbmluZyBgZmllbGRzYCBhbmQgYHJvd3NgXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9kYXRhLXByb2Nlc3NvcicpLnByb2Nlc3NSb3dPYmplY3R9XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHthZGREYXRhVG9NYXB9IGZyb20gJ2tlcGxlci5nbC9hY3Rpb25zJztcbiAqIGltcG9ydCB7cHJvY2Vzc1Jvd09iamVjdH0gZnJvbSAna2VwbGVyLmdsL3Byb2Nlc3NvcnMnO1xuICpcbiAqIGNvbnN0IGRhdGEgPSBbXG4gKiAge2xhdDogMzEuMjcsIGxuZzogMTI3LjU2LCB2YWx1ZTogM30sXG4gKiAge2xhdDogMzEuMjIsIGxuZzogMTI2LjI2LCB2YWx1ZTogMX1cbiAqIF07XG4gKlxuICogZGlzcGF0Y2goYWRkRGF0YVRvTWFwKHtcbiAqICBkYXRhc2V0czoge1xuICogICAgaW5mbzoge2xhYmVsOiAnTXkgRGF0YScsIGlkOiAnbXlfZGF0YSd9LFxuICogICAgZGF0YTogcHJvY2Vzc1Jvd09iamVjdChkYXRhKVxuICogIH1cbiAqIH0pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NSb3dPYmplY3QocmF3RGF0YSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmF3RGF0YSkgfHwgIXJhd0RhdGEubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmF3RGF0YVswXSk7XG4gIGNvbnN0IHJvd3MgPSByYXdEYXRhLm1hcChkID0+IGtleXMubWFwKGtleSA9PiBkW2tleV0pKTtcblxuICAvLyBwaWNrIHNhbXBsZXNcbiAgY29uc3Qgc2FtcGxlRGF0YSA9IGdldFNhbXBsZURhdGEocmF3RGF0YSwgNTAwKTtcbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlRGF0YSwga2V5cyk7XG4gIGNvbnN0IHBhcnNlZFJvd3MgPSBwYXJzZVJvd3NCeUZpZWxkcyhyb3dzLCBmaWVsZHMpO1xuXG4gIHJldHVybiB7XG4gICAgZmllbGRzLFxuICAgIHJvd3M6IHBhcnNlZFJvd3NcbiAgfTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzIEdlb0pTT04gW2BGZWF0dXJlQ29sbGVjdGlvbmBdKGh0dHA6Ly93aWtpLmdlb2pzb24ub3JnL0dlb0pTT05fZHJhZnRfdmVyc2lvbl82I0ZlYXR1cmVDb2xsZWN0aW9uKSxcbiAqIG91dHB1dCBhIGRhdGEgb2JqZWN0IHdpdGggYHtmaWVsZHM6IFtdLCByb3dzOiBbXX1gLlxuICogVGhlIGRhdGEgb2JqZWN0IGNhbiBiZSB3cmFwcGVkIGluIGEgYGRhdGFzZXRgIGFuZCBwYXNzIHRvIFtgYWRkRGF0YVRvTWFwYF0oLi4vYWN0aW9ucy9hY3Rpb25zLm1kI2FkZGRhdGF0b21hcClcbiAqXG4gKiBAcGFyYW0gIHJhd0RhdGEgcmF3IGdlb2pzb24gZmVhdHVyZSBjb2xsZWN0aW9uXG4gKiBAcmV0dXJucyAgZGF0YXNldCBjb250YWluaW5nIGBmaWVsZHNgIGFuZCBgcm93c2BcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGEtcHJvY2Vzc29yJykucHJvY2Vzc0dlb2pzb259XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHthZGREYXRhVG9NYXB9IGZyb20gJ2tlcGxlci5nbC9hY3Rpb25zJztcbiAqIGltcG9ydCB7cHJvY2Vzc0dlb2pzb259IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqXG4gKiBjb25zdCBnZW9qc29uID0ge1xuICogXHRcInR5cGVcIiA6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAqIFx0XCJmZWF0dXJlc1wiIDogW3tcbiAqIFx0XHRcInR5cGVcIiA6IFwiRmVhdHVyZVwiLFxuICogXHRcdFwicHJvcGVydGllc1wiIDoge1xuICogXHRcdFx0XCJjYXBhY2l0eVwiIDogXCIxMFwiLFxuICogXHRcdFx0XCJ0eXBlXCIgOiBcIlUtUmFja1wiXG4gKiBcdFx0fSxcbiAqIFx0XHRcImdlb21ldHJ5XCIgOiB7XG4gKiBcdFx0XHRcInR5cGVcIiA6IFwiUG9pbnRcIixcbiAqIFx0XHRcdFwiY29vcmRpbmF0ZXNcIiA6IFsgLTcxLjA3MzI4MywgNDIuNDE3NTAwIF1cbiAqIFx0XHR9XG4gKiBcdH1dXG4gKiB9O1xuICpcbiAqIGRpc3BhdGNoKGFkZERhdGFUb01hcCh7XG4gKiAgZGF0YXNldHM6IHtcbiAqICAgIGluZm86IHtcbiAqICAgICAgbGFiZWw6ICdTYW1wbGUgVGF4aSBUcmlwcyBpbiBOZXcgWW9yayBDaXR5JyxcbiAqICAgICAgaWQ6ICd0ZXN0X3RyaXBfZGF0YSdcbiAqICAgIH0sXG4gKiAgICBkYXRhOiBwcm9jZXNzR2VvanNvbihnZW9qc29uKVxuICogIH1cbiAqIH0pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NHZW9qc29uKHJhd0RhdGEpIHtcbiAgY29uc3Qgbm9ybWFsaXplZEdlb2pzb24gPSBub3JtYWxpemUocmF3RGF0YSk7XG5cbiAgaWYgKCFub3JtYWxpemVkR2VvanNvbiB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkR2VvanNvbi5mZWF0dXJlcykpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgIGBSZWFkIEZpbGUgRmFpbGVkOiBGaWxlIGlzIG5vdCBhIHZhbGlkIEdlb0pTT04uIFJlYWQgbW9yZSBhYm91dCBbc3VwcG9ydGVkIGZpbGUgZm9ybWF0XSgke0dVSURFU19GSUxFX0ZPUk1BVF9ET0N9KWBcbiAgICApO1xuICAgIHRocm93IGVycm9yO1xuICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgfVxuXG4gIC8vIGdldHRpbmcgYWxsIGZlYXR1cmUgZmllbGRzXG4gIGNvbnN0IGFsbERhdGFSb3dzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBmID0gbm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXNbaV07XG4gICAgaWYgKGYuZ2VvbWV0cnkpIHtcbiAgICAgIGFsbERhdGFSb3dzLnB1c2goe1xuICAgICAgICAvLyBhZGQgZmVhdHVyZSB0byBfZ2VvanNvbiBmaWVsZFxuICAgICAgICBfZ2VvanNvbjogZixcbiAgICAgICAgLi4uKGYucHJvcGVydGllcyB8fCB7fSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvLyBnZXQgYWxsIHRoZSBmaWVsZFxuICBjb25zdCBmaWVsZHMgPSBhbGxEYXRhUm93cy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICBPYmplY3Qua2V5cyhjdXJyKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXByZXYuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICBwcmV2LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwgW10pO1xuXG4gIC8vIG1ha2Ugc3VyZSBlYWNoIGZlYXR1cmUgaGFzIGV4YWN0IHNhbWUgZmllbGRzXG4gIGFsbERhdGFSb3dzLmZvckVhY2goZCA9PiB7XG4gICAgZmllbGRzLmZvckVhY2goZiA9PiB7XG4gICAgICBpZiAoIShmIGluIGQpKSB7XG4gICAgICAgIGRbZl0gPSBudWxsO1xuICAgICAgICBkLl9nZW9qc29uLnByb3BlcnRpZXNbZl0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvY2Vzc1Jvd09iamVjdChhbGxEYXRhUm93cyk7XG59XG5cbi8qKlxuICogT24gZXhwb3J0IGRhdGEgdG8gY3N2XG4gKiBAcGFyYW0ge0FycmF5PEFycmF5Pn0gZGF0YSBgZGF0YXNldC5hbGxEYXRhYCBvciBmaWx0ZXJlZCBkYXRhIGBkYXRhc2V0LmRhdGFgXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpZWxkcyBgZGF0YXNldC5maWVsZHNgXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjc3Ygc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDc3YoZGF0YSwgZmllbGRzKSB7XG4gIGNvbnN0IGNvbHVtbnMgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKTtcbiAgY29uc3QgZm9ybWF0dGVkRGF0YSA9IFtjb2x1bW5zXTtcblxuICAvLyBwYXJzZSBnZW9qc29uIG9iamVjdCBhcyBzdHJpbmdcbiAgZGF0YS5mb3JFYWNoKHJvdyA9PiB7XG4gICAgZm9ybWF0dGVkRGF0YS5wdXNoKHJvdy5tYXAoKGQsIGkpID0+IHBhcnNlRmllbGRWYWx1ZShkLCBmaWVsZHNbaV0udHlwZSkpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNzdkZvcm1hdFJvd3MoZm9ybWF0dGVkRGF0YSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgaW5wdXQgZGF0YSwgYWRkaW5nIG1pc3NpbmcgZmllbGQgdHlwZXMsIHJlbmFtZSBkdXBsaWNhdGUgY29sdW1uc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YS1wcm9jZXNzb3InKS52YWxpZGF0ZUlucHV0RGF0YX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXREYXRhKGRhdGEpIHtcbiAgaWYgKCFpc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgYXNzZXJ0KCdhZGREYXRhVG9NYXAgRXJyb3I6IGRhdGFzZXQuZGF0YSBjYW5ub3QgYmUgbnVsbCcpO1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuZmllbGRzKSkge1xuICAgIGFzc2VydCgnYWRkRGF0YVRvTWFwIEVycm9yOiBleHBlY3QgZGF0YXNldC5kYXRhLmZpZWxkcyB0byBiZSBhbiBhcnJheScpO1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucm93cykpIHtcbiAgICBhc3NlcnQoJ2FkZERhdGFUb01hcCBFcnJvcjogZXhwZWN0IGRhdGFzZXQuZGF0YS5yb3dzIHRvIGJlIGFuIGFycmF5Jyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7ZmllbGRzLCByb3dzfSA9IGRhdGE7XG5cbiAgLy8gY2hlY2sgaWYgYWxsIGZpZWxkcyBoYXMgbmFtZSwgZm9ybWF0IGFuZCB0eXBlXG4gIGNvbnN0IGFsbFZhbGlkID0gZmllbGRzLmV2ZXJ5KChmLCBpKSA9PiB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KGYpKSB7XG4gICAgICBhc3NlcnQoYGZpZWxkcyBuZWVkcyB0byBiZSBhbiBhcnJheSBvZiBvYmplY3QsIGJ1dCBmaW5kICR7dHlwZW9mIGZ9YCk7XG4gICAgICBmaWVsZHNbaV0gPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIWYubmFtZSkge1xuICAgICAgYXNzZXJ0KGBmaWVsZC5uYW1lIGlzIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGluICR7SlNPTi5zdHJpbmdpZnkoZil9YCk7XG4gICAgICAvLyBhc3NpZ24gYSBuYW1lXG4gICAgICBmaWVsZHNbaV0ubmFtZSA9IGBjb2x1bW5fJHtpfWA7XG4gICAgfVxuXG4gICAgaWYgKCFBTExfRklFTERfVFlQRVNbZi50eXBlXSkge1xuICAgICAgYXNzZXJ0KGB1bmtub3duIGZpZWxkIHR5cGUgJHtmLnR5cGV9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFmaWVsZHMuZXZlcnkoZmllbGQgPT4gZmllbGQuYW5hbHl6ZXJUeXBlKSkge1xuICAgICAgYXNzZXJ0KCdmaWVsZCBtaXNzaW5nIGFuYWx5emVyVHlwZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIHRpbWUgZm9ybWF0IGlzIGNvcnJlY3QgYmFzZWQgb24gZmlyc3QgMTAgbm90IGVtcHR5IGVsZW1lbnRcbiAgICBpZiAoZi50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wKSB7XG4gICAgICBjb25zdCBzYW1wbGUgPSBmaW5kTm9uRW1wdHlSb3dzQXRGaWVsZChyb3dzLCBpLCAxMCkubWFwKHIgPT4gKHt0czogcltpXX0pKTtcbiAgICAgIGNvbnN0IGFuYWx5emVkVHlwZSA9IEFuYWx5emVyLmNvbXB1dGVDb2xNZXRhKHNhbXBsZSlbMF07XG4gICAgICByZXR1cm4gYW5hbHl6ZWRUeXBlLmNhdGVnb3J5ID09PSAnVElNRScgJiYgYW5hbHl6ZWRUeXBlLmZvcm1hdCA9PT0gZi5mb3JtYXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIGlmIChhbGxWYWxpZCkge1xuICAgIHJldHVybiB7cm93cywgZmllbGRzfTtcbiAgfVxuXG4gIC8vIGlmIGFueSBmaWVsZCBoYXMgbWlzc2luZyB0eXBlLCByZWNhbGN1bGF0ZSBpdCBmb3IgZXZlcnlvbmVcbiAgLy8gYmVjYXVzZSB3ZSBzaW1wbHkgbG9zdCBmYWl0aCBpbiBodW1hbml0eVxuICBjb25zdCBzYW1wbGVEYXRhID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe1xuICAgIGZpZWxkczogZmllbGRzLm1hcChmID0+IGYubmFtZSksXG4gICAgYWxsRGF0YTogcm93c1xuICB9KTtcbiAgY29uc3QgZmllbGRPcmRlciA9IGZpZWxkcy5tYXAoZiA9PiBmLm5hbWUpO1xuICBjb25zdCBtZXRhID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlRGF0YSwgZmllbGRPcmRlcik7XG4gIGNvbnN0IHVwZGF0ZWRGaWVsZHMgPSBmaWVsZHMubWFwKChmLCBpKSA9PiAoe1xuICAgIC4uLmYsXG4gICAgdHlwZTogbWV0YVtpXS50eXBlLFxuICAgIGZvcm1hdDogbWV0YVtpXS5mb3JtYXQsXG4gICAgYW5hbHl6ZXJUeXBlOiBtZXRhW2ldLmFuYWx5emVyVHlwZVxuICB9KSk7XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3N9O1xufVxuXG5mdW5jdGlvbiBmaW5kTm9uRW1wdHlSb3dzQXRGaWVsZChyb3dzLCBmaWVsZElkeCwgdG90YWwpIHtcbiAgY29uc3Qgc2FtcGxlID0gW107XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKHNhbXBsZS5sZW5ndGggPCB0b3RhbCAmJiBpIDwgcm93cy5sZW5ndGgpIHtcbiAgICBpZiAobm90TnVsbG9yVW5kZWZpbmVkKHJvd3NbaV1bZmllbGRJZHhdKSkge1xuICAgICAgc2FtcGxlLnB1c2gocm93c1tpXSk7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuICByZXR1cm4gc2FtcGxlO1xufVxuLyoqXG4gKiBQcm9jZXNzIHNhdmVkIGtlcGxlci5nbCBqc29uIHRvIGJlIHBhc3MgdG8gW2BhZGREYXRhVG9NYXBgXSguLi9hY3Rpb25zL2FjdGlvbnMubWQjYWRkZGF0YXRvbWFwKS5cbiAqIFRoZSBqc29uIG9iamVjdCBzaG91bGQgY29udGFpbiBgZGF0YXNldHNgIGFuZCBgY29uZmlnYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSByYXdEYXRhXG4gKiBAcGFyYW0ge0FycmF5fSByYXdEYXRhLmRhdGFzZXRzXG4gKiBAcGFyYW0ge09iamVjdH0gcmF3RGF0YS5jb25maWdcbiAqIEByZXR1cm5zIHtPYmplY3R9IGRhdGFzZXRzIGFuZCBjb25maWcgYHtkYXRhc2V0czoge30sIGNvbmZpZzoge319YFxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7YWRkRGF0YVRvTWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiBpbXBvcnQge3Byb2Nlc3NLZXBsZXJnbEpTT059IGZyb20gJ2tlcGxlci5nbC9wcm9jZXNzb3JzJztcbiAqXG4gKiBkaXNwYXRjaChhZGREYXRhVG9NYXAocHJvY2Vzc0tlcGxlcmdsSlNPTihrZXBsZXJHbEpzb24pKSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzS2VwbGVyZ2xKU09OKHJhd0RhdGEpIHtcbiAgcmV0dXJuIHJhd0RhdGEgPyBLZXBsZXJHbFNjaGVtYS5sb2FkKHJhd0RhdGEuZGF0YXNldHMsIHJhd0RhdGEuY29uZmlnKSA6IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgYSBzaW5nbGUgb3IgYW4gYXJyYXkgb2YgZGF0YXNldHMgc2F2ZWQgdXNpbmcga2VwbGVyLmdsIHNjaGVtYVxuICogQHBhcmFtIHtBcnJheSB8IEFycmF5PE9iamVjdD59IHJhd0RhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NLZXBsZXJnbERhdGFzZXQocmF3RGF0YSkge1xuICBpZiAoIXJhd0RhdGEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdHMgPSBLZXBsZXJHbFNjaGVtYS5wYXJzZVNhdmVkRGF0YSh0b0FycmF5KHJhd0RhdGEpKTtcbiAgaWYgKCFyZXN1bHRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocmF3RGF0YSkgPyByZXN1bHRzIDogcmVzdWx0c1swXTtcbn1cblxuZXhwb3J0IGNvbnN0IERBVEFTRVRfSEFORExFUlMgPSB7XG4gIFtEQVRBU0VUX0ZPUk1BVFMucm93XTogcHJvY2Vzc1Jvd09iamVjdCxcbiAgW0RBVEFTRVRfRk9STUFUUy5nZW9qc29uXTogcHJvY2Vzc0dlb2pzb24sXG4gIFtEQVRBU0VUX0ZPUk1BVFMuY3N2XTogcHJvY2Vzc0NzdkRhdGEsXG4gIFtEQVRBU0VUX0ZPUk1BVFMua2VwbGVyZ2xdOiBwcm9jZXNzS2VwbGVyZ2xEYXRhc2V0XG59O1xuXG5leHBvcnQgY29uc3QgUHJvY2Vzc29ycyA9IHtcbiAgcHJvY2Vzc0dlb2pzb24sXG4gIHByb2Nlc3NDc3ZEYXRhLFxuICBwcm9jZXNzUm93T2JqZWN0LFxuICBwcm9jZXNzS2VwbGVyZ2xKU09OLFxuICBwcm9jZXNzS2VwbGVyZ2xEYXRhc2V0LFxuICBhbmFseXplclR5cGVUb0ZpZWxkVHlwZSxcbiAgZ2V0RmllbGRzRnJvbURhdGEsXG4gIHBhcnNlQ3N2Um93c0J5RmllbGRUeXBlLFxuICBmb3JtYXRDc3Zcbn07XG4iXX0=