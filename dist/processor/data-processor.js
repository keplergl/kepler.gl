'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.processCsvData = processCsvData;
exports.parseCsvDataByFieldType = parseCsvDataByFieldType;
exports.getFieldsFromData = getFieldsFromData;
exports.renameDuplicateFields = renameDuplicateFields;
exports.analyzerTypeToFieldType = analyzerTypeToFieldType;
exports.processRowObject = processRowObject;
exports.processGeojson = processGeojson;
exports.formatCsv = formatCsv;

var _d3Dsv = require('d3-dsv');

var _window = require('global/window');

var _typeAnalyzer = require('type-analyzer');

var _geojsonNormalize = require('geojson-normalize');

var _geojsonNormalize2 = _interopRequireDefault(_geojsonNormalize);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processCsvData(rawData) {
  // here we assume the csv file that people uploaded will have first row
  // as name of the column
  var _csvParseRows = (0, _d3Dsv.csvParseRows)(rawData),
      headerRow = _csvParseRows[0],
      rows = _csvParseRows.slice(1);

  // NOTE: if rawData has duplicated column name, this will error out


  var rowObjs = (0, _d3Dsv.csvParse)(rawData);

  // analyzer will set any fields to 'string' if there are empty values
  // which will be parsed as '' by d3.csv
  // here we parse empty data as null

  rowObjs.forEach(function (row, rowIdx) {
    Object.keys(row).forEach(function (key, i) {
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

  var fields = getFieldsFromData(rowObjs, headerRow);
  fields.forEach(parseCsvDataByFieldType.bind(null, rows));

  return { fields: fields, rows: rows };
}

/**
 * Process uploaded csv file to parse value by field type
 *
 * @param {array} rows
 * @param {object} field
 * @param {number} i
 * @returns {void}
 */
function parseCsvDataByFieldType(rows, field, i) {
  var unixFormat = ['x', 'X'];

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
      rows.forEach(function (row) {
        row[i] = parseFloat(row[i]);
      });
      break;

    // TODO: timestamp can be either '1495827326' or '2016-03-10 11:20'
    // if it's '1495827326' we pass it to int
    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      rows.forEach(function (row) {
        row[i] = row[i] !== null && row[i] !== '' && unixFormat.includes(field.format) ? Number(row[i]) : row[i];
      });

      break;

    case _defaultSettings.ALL_FIELD_TYPES.integer:
      rows.forEach(function (row) {
        row[i] = row[i] === null ? row[i] : parseInt(row[i], 10);
      });
      break;

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      rows.forEach(function (row) {
        row[i] = row[i] === null ? row[i] : row[i] === 'true' || row[i] === 'True';
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
function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  var metadata = _typeAnalyzer.Analyzer.computeColMeta(data, [{ regex: /.*geojson|all_points/g, dataType: 'GEOMETRY' }]);

  var _renameDuplicateField = renameDuplicateFields(fieldOrder),
      fieldByIndex = _renameDuplicateField.fieldByIndex;

  return fieldOrder.reduce(function (orderedArray, field, index) {
    var name = fieldByIndex[index];
    var fieldMeta = metadata.find(function (m) {
      return m.key === field;
    });

    var _ref = fieldMeta || {},
        type = _ref.type,
        format = _ref.format;

    orderedArray[index] = {
      name: name,
      format: format,
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
function renameDuplicateFields(fieldOrder) {
  return fieldOrder.reduce(function (accu, field, i) {
    var allNames = accu.allNames;

    var fieldName = field;

    // add a counter to duplicated names
    if (allNames.includes(field)) {
      var counter = 0;
      while (allNames.includes(field + '-' + counter)) {
        counter++;
      }
      fieldName = field + '-' + counter;
    }

    accu.fieldByIndex[i] = fieldName;
    accu.allNames.push(fieldName);

    return accu;
  }, { allNames: [], fieldByIndex: {} });
}

/**
 * Map Analyzer types to local field types
 *
 * @param {string} aType
 * @returns {string} corresponding type in ALL_FIELD_TYPES
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
      CITY = _typeAnalyzer.DATA_TYPES.CITY,
      GEOMETRY = _typeAnalyzer.DATA_TYPES.GEOMETRY,
      GEOMETRY_FROM_STRING = _typeAnalyzer.DATA_TYPES.GEOMETRY_FROM_STRING,
      ZIPCODE = _typeAnalyzer.DATA_TYPES.ZIPCODE,
      PAIR_GEOMETRY_FROM_STRING = _typeAnalyzer.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING;

  // TODO: un recognized types
  // CURRENCY PERCENT NONE

  switch (aType) {
    case DATE:
      return _defaultSettings.ALL_FIELD_TYPES.date;
    case TIME:
    case DATETIME:
      return _defaultSettings.ALL_FIELD_TYPES.timestamp;
    case NUMBER:
    case FLOAT:
      return _defaultSettings.ALL_FIELD_TYPES.real;
    case INT:
      return _defaultSettings.ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return _defaultSettings.ALL_FIELD_TYPES.boolean;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
      return _defaultSettings.ALL_FIELD_TYPES.geojson;
    case STRING:
    case CITY:
    case ZIPCODE:
      return _defaultSettings.ALL_FIELD_TYPES.string;
    default:
      _window.console.warn('Unsupported analyzer type: ' + aType);
      return _defaultSettings.ALL_FIELD_TYPES.string;
  }
}
/* eslint-enable complexity */

/*
 * Process rawData where each row is an object
 */
function processRowObject(rawData) {
  if (!rawData.length) {
    return null;
  }

  var keys = Object.keys(rawData[0]);
  var rows = rawData.map(function (d) {
    return keys.map(function (key) {
      return d[key];
    });
  });
  var fields = getFieldsFromData(rawData, keys);

  return {
    fields: fields,
    rows: rows
  };
}

function processGeojson(rawData) {

  var normalizedGeojson = (0, _geojsonNormalize2.default)(rawData);

  if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
    // fail to normalize geojson
    return null;
  }

  // getting all feature fields
  var allData = normalizedGeojson.features.reduce(function (accu, f, i) {
    if (f.geometry) {
      accu.push((0, _extends3.default)({
        // add feature to _geojson field
        _geojson: f
      }, f.properties || {}));
    }
    return accu;
  }, []);

  // get all the field
  var fields = allData.reduce(function (prev, curr) {
    Object.keys(curr).forEach(function (key) {
      if (!prev.includes(key)) {
        prev.push(key);
      }
    });
    return prev;
  }, []);

  // make sure each feature has exact same fields
  allData.forEach(function (d) {
    fields.forEach(function (f) {
      if (!(f in d)) {
        d[f] = null;
      }
    });
  });

  return processRowObject(allData);
}

function formatCsv(data, fields) {
  var columns = fields.map(function (f) {
    return f.name;
  });
  return (0, _d3Dsv.csvFormatRows)([columns].concat(data));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3IvZGF0YS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsicHJvY2Vzc0NzdkRhdGEiLCJwYXJzZUNzdkRhdGFCeUZpZWxkVHlwZSIsImdldEZpZWxkc0Zyb21EYXRhIiwicmVuYW1lRHVwbGljYXRlRmllbGRzIiwiYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUiLCJwcm9jZXNzUm93T2JqZWN0IiwicHJvY2Vzc0dlb2pzb24iLCJmb3JtYXRDc3YiLCJyYXdEYXRhIiwiaGVhZGVyUm93Iiwicm93cyIsInJvd09ianMiLCJmb3JFYWNoIiwicm93Iiwicm93SWR4IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsImkiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJmaWVsZHMiLCJiaW5kIiwiZmllbGQiLCJ1bml4Rm9ybWF0IiwidHlwZSIsInJlYWwiLCJwYXJzZUZsb2F0IiwidGltZXN0YW1wIiwiaW5jbHVkZXMiLCJmb3JtYXQiLCJOdW1iZXIiLCJpbnRlZ2VyIiwicGFyc2VJbnQiLCJib29sZWFuIiwiZGF0YSIsImZpZWxkT3JkZXIiLCJtZXRhZGF0YSIsImNvbXB1dGVDb2xNZXRhIiwicmVnZXgiLCJkYXRhVHlwZSIsImZpZWxkQnlJbmRleCIsInJlZHVjZSIsIm9yZGVyZWRBcnJheSIsImluZGV4IiwibmFtZSIsImZpZWxkTWV0YSIsImZpbmQiLCJtIiwidGFibGVGaWVsZEluZGV4IiwiYWNjdSIsImFsbE5hbWVzIiwiZmllbGROYW1lIiwiY291bnRlciIsInB1c2giLCJhVHlwZSIsIkRBVEUiLCJUSU1FIiwiREFURVRJTUUiLCJOVU1CRVIiLCJJTlQiLCJGTE9BVCIsIkJPT0xFQU4iLCJTVFJJTkciLCJDSVRZIiwiR0VPTUVUUlkiLCJHRU9NRVRSWV9GUk9NX1NUUklORyIsIlpJUENPREUiLCJQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HIiwiZGF0ZSIsImdlb2pzb24iLCJzdHJpbmciLCJ3YXJuIiwibWFwIiwiZCIsIm5vcm1hbGl6ZWRHZW9qc29uIiwiQXJyYXkiLCJpc0FycmF5IiwiZmVhdHVyZXMiLCJhbGxEYXRhIiwiZiIsImdlb21ldHJ5IiwiX2dlb2pzb24iLCJwcm9wZXJ0aWVzIiwicHJldiIsImN1cnIiLCJjb2x1bW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBT2dCQSxjLEdBQUFBLGM7UUE2Q0FDLHVCLEdBQUFBLHVCO1FBNENBQyxpQixHQUFBQSxpQjtRQWdDQUMscUIsR0FBQUEscUI7UUE0QkFDLHVCLEdBQUFBLHVCO1FBd0NBQyxnQixHQUFBQSxnQjtRQWVBQyxjLEdBQUFBLGM7UUEyQ0FDLFMsR0FBQUEsUzs7QUE5UGhCOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFFTyxTQUFTUCxjQUFULENBQXdCUSxPQUF4QixFQUFpQztBQUN0QztBQUNBO0FBRnNDLHNCQUlULHlCQUFhQSxPQUFiLENBSlM7QUFBQSxNQUkvQkMsU0FKK0I7QUFBQSxNQUlqQkMsSUFKaUI7O0FBTXRDOzs7QUFDQSxNQUFNQyxVQUFVLHFCQUFTSCxPQUFULENBQWhCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQUcsVUFBUUMsT0FBUixDQUFnQixVQUFDQyxHQUFELEVBQU1DLE1BQU4sRUFBaUI7QUFDL0JDLFdBQU9DLElBQVAsQ0FBWUgsR0FBWixFQUFpQkQsT0FBakIsQ0FBeUIsVUFBQ0ssR0FBRCxFQUFNQyxDQUFOLEVBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsVUFBSUwsSUFBSUksR0FBSixNQUFhLEVBQWIsSUFBbUJKLElBQUlJLEdBQUosTUFBYUUsU0FBcEMsRUFBK0M7QUFDN0NOLFlBQUlJLEdBQUosSUFBVyxJQUFYO0FBQ0FQLGFBQUtJLE1BQUwsRUFBYUksQ0FBYixJQUFrQixJQUFsQjtBQUNEO0FBQ0YsS0FSRDtBQVNELEdBVkQ7O0FBWUEsTUFBSSxDQUFDUCxRQUFRUyxNQUFULElBQW1CLENBQUNYLFNBQXhCLEVBQW1DO0FBQ2pDO0FBQ0E7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFNWSxTQUFTbkIsa0JBQWtCUyxPQUFsQixFQUEyQkYsU0FBM0IsQ0FBZjtBQUNBWSxTQUFPVCxPQUFQLENBQWVYLHdCQUF3QnFCLElBQXhCLENBQTZCLElBQTdCLEVBQW1DWixJQUFuQyxDQUFmOztBQUVBLFNBQU8sRUFBQ1csY0FBRCxFQUFTWCxVQUFULEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRTyxTQUFTVCx1QkFBVCxDQUFpQ1MsSUFBakMsRUFBdUNhLEtBQXZDLEVBQThDTCxDQUE5QyxFQUFpRDtBQUN0RCxNQUFNTSxhQUFhLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBbkI7O0FBRUEsVUFBUUQsTUFBTUUsSUFBZDtBQUNFLFNBQUssaUNBQWdCQyxJQUFyQjtBQUNFaEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFBU1MsV0FBV2QsSUFBSUssQ0FBSixDQUFYLENBQVQ7QUFDRCxPQUZEO0FBR0E7O0FBRUY7QUFDQTtBQUNBLFNBQUssaUNBQWdCVSxTQUFyQjtBQUNFbEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFBU0wsSUFBSUssQ0FBSixNQUFXLElBQVgsSUFBbUJMLElBQUlLLENBQUosTUFBVyxFQUE5QixJQUFvQ00sV0FBV0ssUUFBWCxDQUFvQk4sTUFBTU8sTUFBMUIsQ0FBcEMsR0FDUEMsT0FBT2xCLElBQUlLLENBQUosQ0FBUCxDQURPLEdBQ1VMLElBQUlLLENBQUosQ0FEbkI7QUFFRCxPQUhEOztBQUtBOztBQUVGLFNBQUssaUNBQWdCYyxPQUFyQjtBQUNFdEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFBU0wsSUFBSUssQ0FBSixNQUFXLElBQVgsR0FBa0JMLElBQUlLLENBQUosQ0FBbEIsR0FBMkJlLFNBQVNwQixJQUFJSyxDQUFKLENBQVQsRUFBaUIsRUFBakIsQ0FBcEM7QUFDRCxPQUZEO0FBR0E7O0FBRUYsU0FBSyxpQ0FBZ0JnQixPQUFyQjtBQUNFeEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFBU0wsSUFBSUssQ0FBSixNQUFXLElBQVgsR0FBa0JMLElBQUlLLENBQUosQ0FBbEIsR0FBMkJMLElBQUlLLENBQUosTUFBVyxNQUFYLElBQXFCTCxJQUFJSyxDQUFKLE1BQVcsTUFBcEU7QUFDRCxPQUZEO0FBR0E7O0FBRUY7QUFDRTtBQTlCSjtBQWdDRDs7QUFFRDs7Ozs7OztBQU9PLFNBQVNoQixpQkFBVCxDQUEyQmlDLElBQTNCLEVBQWlDQyxVQUFqQyxFQUE2QztBQUNsRDtBQUNBLE1BQU1DLFdBQVcsdUJBQVNDLGNBQVQsQ0FBd0JILElBQXhCLEVBQ2YsQ0FDRSxFQUFDSSxPQUFPLHVCQUFSLEVBQWlDQyxVQUFVLFVBQTNDLEVBREYsQ0FEZSxDQUFqQjs7QUFGa0QsOEJBTzNCckMsc0JBQXNCaUMsVUFBdEIsQ0FQMkI7QUFBQSxNQU8zQ0ssWUFQMkMseUJBTzNDQSxZQVAyQzs7QUFTbEQsU0FBT0wsV0FBV00sTUFBWCxDQUFrQixVQUFDQyxZQUFELEVBQWVwQixLQUFmLEVBQXNCcUIsS0FBdEIsRUFBZ0M7QUFDdkQsUUFBTUMsT0FBT0osYUFBYUcsS0FBYixDQUFiO0FBQ0EsUUFBTUUsWUFBWVQsU0FBU1UsSUFBVCxDQUFjO0FBQUEsYUFBS0MsRUFBRS9CLEdBQUYsS0FBVU0sS0FBZjtBQUFBLEtBQWQsQ0FBbEI7O0FBRnVELGVBR2hDdUIsYUFBYSxFQUhtQjtBQUFBLFFBR2hEckIsSUFIZ0QsUUFHaERBLElBSGdEO0FBQUEsUUFHMUNLLE1BSDBDLFFBRzFDQSxNQUgwQzs7QUFLdkRhLGlCQUFhQyxLQUFiLElBQXNCO0FBQ3BCQyxnQkFEb0I7QUFFcEJmLG9CQUZvQjtBQUdwQm1CLHVCQUFpQkwsUUFBUSxDQUhMO0FBSXBCbkIsWUFBTXJCLHdCQUF3QnFCLElBQXhCO0FBSmMsS0FBdEI7O0FBT0EsV0FBT2tCLFlBQVA7QUFDRCxHQWJNLEVBYUosRUFiSSxDQUFQO0FBY0Q7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTeEMscUJBQVQsQ0FBK0JpQyxVQUEvQixFQUEyQztBQUNoRCxTQUFPQSxXQUFXTSxNQUFYLENBQWtCLFVBQUNRLElBQUQsRUFBTzNCLEtBQVAsRUFBY0wsQ0FBZCxFQUFvQjtBQUFBLFFBQ3BDaUMsUUFEb0MsR0FDeEJELElBRHdCLENBQ3BDQyxRQURvQzs7QUFFM0MsUUFBSUMsWUFBWTdCLEtBQWhCOztBQUVBO0FBQ0EsUUFBSTRCLFNBQVN0QixRQUFULENBQWtCTixLQUFsQixDQUFKLEVBQThCO0FBQzVCLFVBQUk4QixVQUFVLENBQWQ7QUFDQSxhQUFPRixTQUFTdEIsUUFBVCxDQUFxQk4sS0FBckIsU0FBOEI4QixPQUE5QixDQUFQLEVBQWlEO0FBQy9DQTtBQUNEO0FBQ0RELGtCQUFlN0IsS0FBZixTQUF3QjhCLE9BQXhCO0FBQ0Q7O0FBRURILFNBQUtULFlBQUwsQ0FBa0J2QixDQUFsQixJQUF1QmtDLFNBQXZCO0FBQ0FGLFNBQUtDLFFBQUwsQ0FBY0csSUFBZCxDQUFtQkYsU0FBbkI7O0FBRUEsV0FBT0YsSUFBUDtBQUNELEdBakJNLEVBaUJKLEVBQUNDLFVBQVUsRUFBWCxFQUFlVixjQUFjLEVBQTdCLEVBakJJLENBQVA7QUFrQkQ7O0FBRUQ7Ozs7OztBQU1BO0FBQ08sU0FBU3JDLHVCQUFULENBQWlDbUQsS0FBakMsRUFBd0M7QUFBQSxNQUUzQ0MsSUFGMkMsNEJBRTNDQSxJQUYyQztBQUFBLE1BRXJDQyxJQUZxQyw0QkFFckNBLElBRnFDO0FBQUEsTUFFL0JDLFFBRitCLDRCQUUvQkEsUUFGK0I7QUFBQSxNQUVyQkMsTUFGcUIsNEJBRXJCQSxNQUZxQjtBQUFBLE1BRWJDLEdBRmEsNEJBRWJBLEdBRmE7QUFBQSxNQUVSQyxLQUZRLDRCQUVSQSxLQUZRO0FBQUEsTUFHM0NDLE9BSDJDLDRCQUczQ0EsT0FIMkM7QUFBQSxNQUdsQ0MsTUFIa0MsNEJBR2xDQSxNQUhrQztBQUFBLE1BRzFCQyxJQUgwQiw0QkFHMUJBLElBSDBCO0FBQUEsTUFHcEJDLFFBSG9CLDRCQUdwQkEsUUFIb0I7QUFBQSxNQUdWQyxvQkFIVSw0QkFHVkEsb0JBSFU7QUFBQSxNQUdZQyxPQUhaLDRCQUdZQSxPQUhaO0FBQUEsTUFJM0NDLHlCQUoyQyw0QkFJM0NBLHlCQUoyQzs7QUFPN0M7QUFDQTs7QUFDQSxVQUFRYixLQUFSO0FBQ0UsU0FBS0MsSUFBTDtBQUNFLGFBQU8saUNBQWdCYSxJQUF2QjtBQUNGLFNBQUtaLElBQUw7QUFDQSxTQUFLQyxRQUFMO0FBQ0UsYUFBTyxpQ0FBZ0I5QixTQUF2QjtBQUNGLFNBQUsrQixNQUFMO0FBQ0EsU0FBS0UsS0FBTDtBQUNFLGFBQU8saUNBQWdCbkMsSUFBdkI7QUFDRixTQUFLa0MsR0FBTDtBQUNFLGFBQU8saUNBQWdCNUIsT0FBdkI7QUFDRixTQUFLOEIsT0FBTDtBQUNFLGFBQU8saUNBQWdCNUIsT0FBdkI7QUFDRixTQUFLK0IsUUFBTDtBQUNBLFNBQUtDLG9CQUFMO0FBQ0EsU0FBS0UseUJBQUw7QUFDRSxhQUFPLGlDQUFnQkUsT0FBdkI7QUFDRixTQUFLUCxNQUFMO0FBQ0EsU0FBS0MsSUFBTDtBQUNBLFNBQUtHLE9BQUw7QUFDRSxhQUFPLGlDQUFnQkksTUFBdkI7QUFDRjtBQUNFLHNCQUFjQyxJQUFkLGlDQUFpRGpCLEtBQWpEO0FBQ0EsYUFBTyxpQ0FBZ0JnQixNQUF2QjtBQXZCSjtBQXlCRDtBQUNEOztBQUVBOzs7QUFHTyxTQUFTbEUsZ0JBQVQsQ0FBMEJHLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQUksQ0FBQ0EsUUFBUVksTUFBYixFQUFxQjtBQUNuQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFNSixPQUFPRCxPQUFPQyxJQUFQLENBQVlSLFFBQVEsQ0FBUixDQUFaLENBQWI7QUFDQSxNQUFNRSxPQUFPRixRQUFRaUUsR0FBUixDQUFZO0FBQUEsV0FBS3pELEtBQUt5RCxHQUFMLENBQVM7QUFBQSxhQUFPQyxFQUFFekQsR0FBRixDQUFQO0FBQUEsS0FBVCxDQUFMO0FBQUEsR0FBWixDQUFiO0FBQ0EsTUFBTUksU0FBU25CLGtCQUFrQk0sT0FBbEIsRUFBMkJRLElBQTNCLENBQWY7O0FBRUEsU0FBTztBQUNMSyxrQkFESztBQUVMWDtBQUZLLEdBQVA7QUFJRDs7QUFFTSxTQUFTSixjQUFULENBQXdCRSxPQUF4QixFQUFpQzs7QUFFdEMsTUFBTW1FLG9CQUFvQixnQ0FBVW5FLE9BQVYsQ0FBMUI7O0FBRUEsTUFBSSxDQUFDbUUsaUJBQUQsSUFBc0IsQ0FBQ0MsTUFBTUMsT0FBTixDQUFjRixrQkFBa0JHLFFBQWhDLENBQTNCLEVBQXNFO0FBQ3BFO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFNQyxVQUFVSixrQkFBa0JHLFFBQWxCLENBQTJCcEMsTUFBM0IsQ0FBa0MsVUFBQ1EsSUFBRCxFQUFPOEIsQ0FBUCxFQUFVOUQsQ0FBVixFQUFnQjtBQUNoRSxRQUFJOEQsRUFBRUMsUUFBTixFQUFnQjtBQUNkL0IsV0FBS0ksSUFBTDtBQUNFO0FBQ0E0QixrQkFBVUY7QUFGWixTQUdNQSxFQUFFRyxVQUFGLElBQWdCLEVBSHRCO0FBS0Q7QUFDRCxXQUFPakMsSUFBUDtBQUNELEdBVGUsRUFTYixFQVRhLENBQWhCOztBQVdBO0FBQ0EsTUFBTTdCLFNBQVMwRCxRQUFRckMsTUFBUixDQUFlLFVBQUMwQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDNUN0RSxXQUFPQyxJQUFQLENBQVlxRSxJQUFaLEVBQWtCekUsT0FBbEIsQ0FBMEIsZUFBTztBQUMvQixVQUFJLENBQUN3RSxLQUFLdkQsUUFBTCxDQUFjWixHQUFkLENBQUwsRUFBeUI7QUFDdkJtRSxhQUFLOUIsSUFBTCxDQUFVckMsR0FBVjtBQUNEO0FBQ0YsS0FKRDtBQUtBLFdBQU9tRSxJQUFQO0FBQ0QsR0FQYyxFQU9aLEVBUFksQ0FBZjs7QUFTQTtBQUNBTCxVQUFRbkUsT0FBUixDQUFnQixhQUFLO0FBQ25CUyxXQUFPVCxPQUFQLENBQWUsYUFBSztBQUNsQixVQUFJLEVBQUVvRSxLQUFLTixDQUFQLENBQUosRUFBZTtBQUNiQSxVQUFFTSxDQUFGLElBQU8sSUFBUDtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBTkQ7O0FBUUEsU0FBTzNFLGlCQUFpQjBFLE9BQWpCLENBQVA7QUFDRDs7QUFFTSxTQUFTeEUsU0FBVCxDQUFtQjRCLElBQW5CLEVBQXlCZCxNQUF6QixFQUFpQztBQUN0QyxNQUFNaUUsVUFBVWpFLE9BQU9vRCxHQUFQLENBQVc7QUFBQSxXQUFLTyxFQUFFbkMsSUFBUDtBQUFBLEdBQVgsQ0FBaEI7QUFDQSxTQUFPLDJCQUFleUMsT0FBZixTQUEyQm5ELElBQTNCLEVBQVA7QUFDRCIsImZpbGUiOiJkYXRhLXByb2Nlc3Nvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3N2UGFyc2UsIGNzdlBhcnNlUm93cywgY3N2Rm9ybWF0Um93c30gZnJvbSAnZDMtZHN2JztcbmltcG9ydCB7Y29uc29sZSBhcyBnbG9iYWxDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7QW5hbHl6ZXIsIERBVEFfVFlQRVMgYXMgQW5hbHl6ZXJEQVRBX1RZUEVTfSBmcm9tICd0eXBlLWFuYWx5emVyJztcbmltcG9ydCBub3JtYWxpemUgZnJvbSAnZ2VvanNvbi1ub3JtYWxpemUnO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0NzdkRhdGEocmF3RGF0YSkge1xuICAvLyBoZXJlIHdlIGFzc3VtZSB0aGUgY3N2IGZpbGUgdGhhdCBwZW9wbGUgdXBsb2FkZWQgd2lsbCBoYXZlIGZpcnN0IHJvd1xuICAvLyBhcyBuYW1lIG9mIHRoZSBjb2x1bW5cbiAgLy9UT0RPOiBhZGQgYSBhbGVydCBhdCB1cGxvYWQgY3N2IHRvIHJlbWluZCBkZWZpbmUgZmlyc3Qgcm93XG4gIGNvbnN0IFtoZWFkZXJSb3csIC4uLnJvd3NdID0gY3N2UGFyc2VSb3dzKHJhd0RhdGEpO1xuXG4gIC8vIE5PVEU6IGlmIHJhd0RhdGEgaGFzIGR1cGxpY2F0ZWQgY29sdW1uIG5hbWUsIHRoaXMgd2lsbCBlcnJvciBvdXRcbiAgY29uc3Qgcm93T2JqcyA9IGNzdlBhcnNlKHJhd0RhdGEpO1xuXG4gIC8vIGFuYWx5emVyIHdpbGwgc2V0IGFueSBmaWVsZHMgdG8gJ3N0cmluZycgaWYgdGhlcmUgYXJlIGVtcHR5IHZhbHVlc1xuICAvLyB3aGljaCB3aWxsIGJlIHBhcnNlZCBhcyAnJyBieSBkMy5jc3ZcbiAgLy8gaGVyZSB3ZSBwYXJzZSBlbXB0eSBkYXRhIGFzIG51bGxcblxuICByb3dPYmpzLmZvckVhY2goKHJvdywgcm93SWR4KSA9PiB7XG4gICAgT2JqZWN0LmtleXMocm93KS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIC8vICd1bmRlZmluZWQnIGNhbiBoYXBwZW4gaWYgdGhlcmVcbiAgICAgIC8vIGlzIG5vIGVuZC1vZi1saW5lIG1hcmtlciwgYW5kIGNhdXNlIHByb2JsZW1zIGRvd24gc3RyZWFtXG4gICAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSBkMyBpc24ndCBoYW5kbGluZyB0aGlzLlxuICAgICAgaWYgKHJvd1trZXldID09PSAnJyB8fCByb3dba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJvd1trZXldID0gbnVsbDtcbiAgICAgICAgcm93c1tyb3dJZHhdW2ldID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKCFyb3dPYmpzLmxlbmd0aCB8fCAhaGVhZGVyUm93KSB7XG4gICAgLy8gbG9va3MgbGlrZSBhbiBlbXB0eSBmaWxlXG4gICAgLy8gcmVzb2x2ZSBudWxsLCBhbmQgY2F0Y2ggdGhlbSBsYXRlciBpbiBvbmUgcGxhY2VcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc0Zyb21EYXRhKHJvd09ianMsIGhlYWRlclJvdyk7XG4gIGZpZWxkcy5mb3JFYWNoKHBhcnNlQ3N2RGF0YUJ5RmllbGRUeXBlLmJpbmQobnVsbCwgcm93cykpO1xuXG4gIHJldHVybiB7ZmllbGRzLCByb3dzfTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHVwbG9hZGVkIGNzdiBmaWxlIHRvIHBhcnNlIHZhbHVlIGJ5IGZpZWxkIHR5cGVcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSByb3dzXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3N2RGF0YUJ5RmllbGRUeXBlKHJvd3MsIGZpZWxkLCBpKSB7XG4gIGNvbnN0IHVuaXhGb3JtYXQgPSBbJ3gnLCAnWCddO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgcm93W2ldID0gcGFyc2VGbG9hdChyb3dbaV0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIC8vIFRPRE86IHRpbWVzdGFtcCBjYW4gYmUgZWl0aGVyICcxNDk1ODI3MzI2JyBvciAnMjAxNi0wMy0xMCAxMToyMCdcbiAgICAvLyBpZiBpdCdzICcxNDk1ODI3MzI2JyB3ZSBwYXNzIGl0IHRvIGludFxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICByb3dbaV0gPSByb3dbaV0gIT09IG51bGwgJiYgcm93W2ldICE9PSAnJyAmJiB1bml4Rm9ybWF0LmluY2x1ZGVzKGZpZWxkLmZvcm1hdCkgP1xuICAgICAgICAgIE51bWJlcihyb3dbaV0pIDogcm93W2ldO1xuICAgICAgfSk7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICAgIHJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICByb3dbaV0gPSByb3dbaV0gPT09IG51bGwgPyByb3dbaV0gOiBwYXJzZUludChyb3dbaV0sIDEwKTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgcm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIHJvd1tpXSA9IHJvd1tpXSA9PT0gbnVsbCA/IHJvd1tpXSA6IHJvd1tpXSA9PT0gJ3RydWUnIHx8IHJvd1tpXSA9PT0gJ1RydWUnO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vKipcbiAqIGdldCBmaWVsZHMgZnJvbSBjc3YgZGF0YVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGRhdGFcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkT3JkZXJcbiAqIEByZXR1cm5zIHthcnJheX0gZm9ybWF0dGVkIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRzRnJvbURhdGEoZGF0YSwgZmllbGRPcmRlcikge1xuICAvLyBhZGQgYSBjaGVjayBmb3IgZXBvY2ggdGltZXN0YW1wXG4gIGNvbnN0IG1ldGFkYXRhID0gQW5hbHl6ZXIuY29tcHV0ZUNvbE1ldGEoZGF0YSxcbiAgICBbXG4gICAgICB7cmVnZXg6IC8uKmdlb2pzb258YWxsX3BvaW50cy9nLCBkYXRhVHlwZTogJ0dFT01FVFJZJ31cbiAgICBdKTtcblxuICBjb25zdCB7ZmllbGRCeUluZGV4fSA9IHJlbmFtZUR1cGxpY2F0ZUZpZWxkcyhmaWVsZE9yZGVyKTtcblxuICByZXR1cm4gZmllbGRPcmRlci5yZWR1Y2UoKG9yZGVyZWRBcnJheSwgZmllbGQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGZpZWxkQnlJbmRleFtpbmRleF07XG4gICAgY29uc3QgZmllbGRNZXRhID0gbWV0YWRhdGEuZmluZChtID0+IG0ua2V5ID09PSBmaWVsZCk7XG4gICAgY29uc3Qge3R5cGUsIGZvcm1hdH0gPSBmaWVsZE1ldGEgfHwge307XG5cbiAgICBvcmRlcmVkQXJyYXlbaW5kZXhdID0ge1xuICAgICAgbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIHRhYmxlRmllbGRJbmRleDogaW5kZXggKyAxLFxuICAgICAgdHlwZTogYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUodHlwZSlcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9yZGVyZWRBcnJheTtcbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIHBhc3MgaW4gYW4gYXJyYXkgb2YgZmllbGQgbmFtZXMsIHJlbmFtZSBkdXBsaWNhdGVkIG9uZVxuICogYW5kIHJldHVybiBhIG1hcCBmcm9tIG9sZCBmaWVsZCBpbmRleCB0byBuZXcgbmFtZVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkT3JkZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG5ldyBmaWVsZCBuYW1lIGJ5IGluZGV4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVEdXBsaWNhdGVGaWVsZHMoZmllbGRPcmRlcikge1xuICByZXR1cm4gZmllbGRPcmRlci5yZWR1Y2UoKGFjY3UsIGZpZWxkLCBpKSA9PiB7XG4gICAgY29uc3Qge2FsbE5hbWVzfSA9IGFjY3U7XG4gICAgbGV0IGZpZWxkTmFtZSA9IGZpZWxkO1xuXG4gICAgLy8gYWRkIGEgY291bnRlciB0byBkdXBsaWNhdGVkIG5hbWVzXG4gICAgaWYgKGFsbE5hbWVzLmluY2x1ZGVzKGZpZWxkKSkge1xuICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgd2hpbGUgKGFsbE5hbWVzLmluY2x1ZGVzKGAke2ZpZWxkfS0ke2NvdW50ZXJ9YCkpIHtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfVxuICAgICAgZmllbGROYW1lID0gYCR7ZmllbGR9LSR7Y291bnRlcn1gO1xuICAgIH1cblxuICAgIGFjY3UuZmllbGRCeUluZGV4W2ldID0gZmllbGROYW1lO1xuICAgIGFjY3UuYWxsTmFtZXMucHVzaChmaWVsZE5hbWUpO1xuXG4gICAgcmV0dXJuIGFjY3U7XG4gIH0sIHthbGxOYW1lczogW10sIGZpZWxkQnlJbmRleDoge319KTtcbn1cblxuLyoqXG4gKiBNYXAgQW5hbHl6ZXIgdHlwZXMgdG8gbG9jYWwgZmllbGQgdHlwZXNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYVR5cGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvcnJlc3BvbmRpbmcgdHlwZSBpbiBBTExfRklFTERfVFlQRVNcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVyVHlwZVRvRmllbGRUeXBlKGFUeXBlKSB7XG4gIGNvbnN0IHtcbiAgICBEQVRFLCBUSU1FLCBEQVRFVElNRSwgTlVNQkVSLCBJTlQsIEZMT0FULFxuICAgIEJPT0xFQU4sIFNUUklORywgQ0lUWSwgR0VPTUVUUlksIEdFT01FVFJZX0ZST01fU1RSSU5HLCBaSVBDT0RFLFxuICAgIFBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkdcbiAgfSA9IEFuYWx5emVyREFUQV9UWVBFUztcblxuICAvLyBUT0RPOiB1biByZWNvZ25pemVkIHR5cGVzXG4gIC8vIENVUlJFTkNZIFBFUkNFTlQgTk9ORVxuICBzd2l0Y2ggKGFUeXBlKSB7XG4gICAgY2FzZSBEQVRFOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5kYXRlO1xuICAgIGNhc2UgVElNRTpcbiAgICBjYXNlIERBVEVUSU1FOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gICAgY2FzZSBOVU1CRVI6XG4gICAgY2FzZSBGTE9BVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMucmVhbDtcbiAgICBjYXNlIElOVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuaW50ZWdlcjtcbiAgICBjYXNlIEJPT0xFQU46XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW47XG4gICAgY2FzZSBHRU9NRVRSWTpcbiAgICBjYXNlIEdFT01FVFJZX0ZST01fU1RSSU5HOlxuICAgIGNhc2UgUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklORzpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuZ2VvanNvbjtcbiAgICBjYXNlIFNUUklORzpcbiAgICBjYXNlIENJVFk6XG4gICAgY2FzZSBaSVBDT0RFOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc7XG4gICAgZGVmYXVsdDpcbiAgICAgIGdsb2JhbENvbnNvbGUud2FybihgVW5zdXBwb3J0ZWQgYW5hbHl6ZXIgdHlwZTogJHthVHlwZX1gKTtcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuc3RyaW5nO1xuICB9XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuLypcbiAqIFByb2Nlc3MgcmF3RGF0YSB3aGVyZSBlYWNoIHJvdyBpcyBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NSb3dPYmplY3QocmF3RGF0YSkge1xuICBpZiAoIXJhd0RhdGEubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmF3RGF0YVswXSk7XG4gIGNvbnN0IHJvd3MgPSByYXdEYXRhLm1hcChkID0+IGtleXMubWFwKGtleSA9PiBkW2tleV0pKTtcbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEocmF3RGF0YSwga2V5cyk7XG5cbiAgcmV0dXJuIHtcbiAgICBmaWVsZHMsXG4gICAgcm93c1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0dlb2pzb24ocmF3RGF0YSkge1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWRHZW9qc29uID0gbm9ybWFsaXplKHJhd0RhdGEpO1xuXG4gIGlmICghbm9ybWFsaXplZEdlb2pzb24gfHwgIUFycmF5LmlzQXJyYXkobm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXMpKSB7XG4gICAgLy8gZmFpbCB0byBub3JtYWxpemUgZ2VvanNvblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gZ2V0dGluZyBhbGwgZmVhdHVyZSBmaWVsZHNcbiAgY29uc3QgYWxsRGF0YSA9IG5vcm1hbGl6ZWRHZW9qc29uLmZlYXR1cmVzLnJlZHVjZSgoYWNjdSwgZiwgaSkgPT4ge1xuICAgIGlmIChmLmdlb21ldHJ5KSB7XG4gICAgICBhY2N1LnB1c2goe1xuICAgICAgICAvLyBhZGQgZmVhdHVyZSB0byBfZ2VvanNvbiBmaWVsZFxuICAgICAgICBfZ2VvanNvbjogZixcbiAgICAgICAgLi4uKGYucHJvcGVydGllcyB8fCB7fSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWNjdTtcbiAgfSwgW10pO1xuXG4gIC8vIGdldCBhbGwgdGhlIGZpZWxkXG4gIGNvbnN0IGZpZWxkcyA9IGFsbERhdGEucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgT2JqZWN0LmtleXMoY3VycikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCFwcmV2LmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgcHJldi5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIFtdKTtcblxuICAvLyBtYWtlIHN1cmUgZWFjaCBmZWF0dXJlIGhhcyBleGFjdCBzYW1lIGZpZWxkc1xuICBhbGxEYXRhLmZvckVhY2goZCA9PiB7XG4gICAgZmllbGRzLmZvckVhY2goZiA9PiB7XG4gICAgICBpZiAoIShmIGluIGQpKSB7XG4gICAgICAgIGRbZl0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvY2Vzc1Jvd09iamVjdChhbGxEYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENzdihkYXRhLCBmaWVsZHMpIHtcbiAgY29uc3QgY29sdW1ucyA9IGZpZWxkcy5tYXAoZiA9PiBmLm5hbWUpO1xuICByZXR1cm4gY3N2Rm9ybWF0Um93cyhbY29sdW1ucywgLi4uZGF0YV0pO1xufVxuIl19