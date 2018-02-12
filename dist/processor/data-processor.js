'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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
      _csvParseRows2 = (0, _toArray3.default)(_csvParseRows),
      headerRow = _csvParseRows2[0],
      rows = _csvParseRows2.slice(1);

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
  return (0, _d3Dsv.csvFormatRows)([columns].concat((0, _toConsumableArray3.default)(data)));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3IvZGF0YS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsicHJvY2Vzc0NzdkRhdGEiLCJwYXJzZUNzdkRhdGFCeUZpZWxkVHlwZSIsImdldEZpZWxkc0Zyb21EYXRhIiwicmVuYW1lRHVwbGljYXRlRmllbGRzIiwiYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUiLCJwcm9jZXNzUm93T2JqZWN0IiwicHJvY2Vzc0dlb2pzb24iLCJmb3JtYXRDc3YiLCJyYXdEYXRhIiwiaGVhZGVyUm93Iiwicm93cyIsInJvd09ianMiLCJmb3JFYWNoIiwicm93Iiwicm93SWR4IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsImkiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJmaWVsZHMiLCJiaW5kIiwiZmllbGQiLCJ1bml4Rm9ybWF0IiwidHlwZSIsInJlYWwiLCJwYXJzZUZsb2F0IiwidGltZXN0YW1wIiwiaW5jbHVkZXMiLCJmb3JtYXQiLCJOdW1iZXIiLCJpbnRlZ2VyIiwicGFyc2VJbnQiLCJib29sZWFuIiwiZGF0YSIsImZpZWxkT3JkZXIiLCJtZXRhZGF0YSIsImNvbXB1dGVDb2xNZXRhIiwicmVnZXgiLCJkYXRhVHlwZSIsImZpZWxkQnlJbmRleCIsInJlZHVjZSIsIm9yZGVyZWRBcnJheSIsImluZGV4IiwibmFtZSIsImZpZWxkTWV0YSIsImZpbmQiLCJtIiwidGFibGVGaWVsZEluZGV4IiwiYWNjdSIsImFsbE5hbWVzIiwiZmllbGROYW1lIiwiY291bnRlciIsInB1c2giLCJhVHlwZSIsIkRBVEUiLCJUSU1FIiwiREFURVRJTUUiLCJOVU1CRVIiLCJJTlQiLCJGTE9BVCIsIkJPT0xFQU4iLCJTVFJJTkciLCJDSVRZIiwiR0VPTUVUUlkiLCJHRU9NRVRSWV9GUk9NX1NUUklORyIsIlpJUENPREUiLCJQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HIiwiZGF0ZSIsImdlb2pzb24iLCJzdHJpbmciLCJ3YXJuIiwibWFwIiwiZCIsIm5vcm1hbGl6ZWRHZW9qc29uIiwiQXJyYXkiLCJpc0FycmF5IiwiZmVhdHVyZXMiLCJhbGxEYXRhIiwiZiIsImdlb21ldHJ5IiwiX2dlb2pzb24iLCJwcm9wZXJ0aWVzIiwicHJldiIsImN1cnIiLCJjb2x1bW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFPZ0JBLGMsR0FBQUEsYztRQTZDQUMsdUIsR0FBQUEsdUI7UUErQ0FDLGlCLEdBQUFBLGlCO1FBa0NBQyxxQixHQUFBQSxxQjtRQStCQUMsdUIsR0FBQUEsdUI7UUFrREFDLGdCLEdBQUFBLGdCO1FBZUFDLGMsR0FBQUEsYztRQTBDQUMsUyxHQUFBQSxTOztBQS9RaEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUVPLFNBQVNQLGNBQVQsQ0FBd0JRLE9BQXhCLEVBQWlDO0FBQ3RDO0FBQ0E7QUFGc0Msc0JBSVQseUJBQWFBLE9BQWIsQ0FKUztBQUFBO0FBQUEsTUFJL0JDLFNBSitCO0FBQUEsTUFJakJDLElBSmlCOztBQU10Qzs7O0FBQ0EsTUFBTUMsVUFBVSxxQkFBU0gsT0FBVCxDQUFoQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUFHLFVBQVFDLE9BQVIsQ0FBZ0IsVUFBQ0MsR0FBRCxFQUFNQyxNQUFOLEVBQWlCO0FBQy9CQyxXQUFPQyxJQUFQLENBQVlILEdBQVosRUFBaUJELE9BQWpCLENBQXlCLFVBQUNLLEdBQUQsRUFBTUMsQ0FBTixFQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLFVBQUlMLElBQUlJLEdBQUosTUFBYSxFQUFiLElBQW1CSixJQUFJSSxHQUFKLE1BQWFFLFNBQXBDLEVBQStDO0FBQzdDTixZQUFJSSxHQUFKLElBQVcsSUFBWDtBQUNBUCxhQUFLSSxNQUFMLEVBQWFJLENBQWIsSUFBa0IsSUFBbEI7QUFDRDtBQUNGLEtBUkQ7QUFTRCxHQVZEOztBQVlBLE1BQUksQ0FBQ1AsUUFBUVMsTUFBVCxJQUFtQixDQUFDWCxTQUF4QixFQUFtQztBQUNqQztBQUNBO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBTVksU0FBU25CLGtCQUFrQlMsT0FBbEIsRUFBMkJGLFNBQTNCLENBQWY7QUFDQVksU0FBT1QsT0FBUCxDQUFlWCx3QkFBd0JxQixJQUF4QixDQUE2QixJQUE3QixFQUFtQ1osSUFBbkMsQ0FBZjs7QUFFQSxTQUFPLEVBQUNXLGNBQUQsRUFBU1gsVUFBVCxFQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUU8sU0FBU1QsdUJBQVQsQ0FBaUNTLElBQWpDLEVBQXVDYSxLQUF2QyxFQUE4Q0wsQ0FBOUMsRUFBaUQ7QUFDdEQsTUFBTU0sYUFBYSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQW5COztBQUVBLFVBQVFELE1BQU1FLElBQWQ7QUFDRSxTQUFLLGlDQUFnQkMsSUFBckI7QUFDRWhCLFdBQUtFLE9BQUwsQ0FBYSxlQUFPO0FBQ2xCQyxZQUFJSyxDQUFKLElBQVNTLFdBQVdkLElBQUlLLENBQUosQ0FBWCxDQUFUO0FBQ0QsT0FGRDtBQUdBOztBQUVGO0FBQ0E7QUFDQSxTQUFLLGlDQUFnQlUsU0FBckI7QUFDRWxCLFdBQUtFLE9BQUwsQ0FBYSxlQUFPO0FBQ2xCQyxZQUFJSyxDQUFKLElBQ0VMLElBQUlLLENBQUosTUFBVyxJQUFYLElBQW1CTCxJQUFJSyxDQUFKLE1BQVcsRUFBOUIsSUFBb0NNLFdBQVdLLFFBQVgsQ0FBb0JOLE1BQU1PLE1BQTFCLENBQXBDLEdBQ0lDLE9BQU9sQixJQUFJSyxDQUFKLENBQVAsQ0FESixHQUVJTCxJQUFJSyxDQUFKLENBSE47QUFJRCxPQUxEOztBQU9BOztBQUVGLFNBQUssaUNBQWdCYyxPQUFyQjtBQUNFdEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFBU0wsSUFBSUssQ0FBSixNQUFXLElBQVgsR0FBa0JMLElBQUlLLENBQUosQ0FBbEIsR0FBMkJlLFNBQVNwQixJQUFJSyxDQUFKLENBQVQsRUFBaUIsRUFBakIsQ0FBcEM7QUFDRCxPQUZEO0FBR0E7O0FBRUYsU0FBSyxpQ0FBZ0JnQixPQUFyQjtBQUNFeEIsV0FBS0UsT0FBTCxDQUFhLGVBQU87QUFDbEJDLFlBQUlLLENBQUosSUFDRUwsSUFBSUssQ0FBSixNQUFXLElBQVgsR0FBa0JMLElBQUlLLENBQUosQ0FBbEIsR0FBMkJMLElBQUlLLENBQUosTUFBVyxNQUFYLElBQXFCTCxJQUFJSyxDQUFKLE1BQVcsTUFEN0Q7QUFFRCxPQUhEO0FBSUE7O0FBRUY7QUFDRTtBQWpDSjtBQW1DRDs7QUFFRDs7Ozs7OztBQU9PLFNBQVNoQixpQkFBVCxDQUEyQmlDLElBQTNCLEVBQWlDQyxVQUFqQyxFQUE2QztBQUNsRDtBQUNBLE1BQU1DLFdBQVcsdUJBQVNDLGNBQVQsQ0FBd0JILElBQXhCLEVBQThCLENBQzdDLEVBQUNJLE9BQU8sdUJBQVIsRUFBaUNDLFVBQVUsVUFBM0MsRUFENkMsQ0FBOUIsQ0FBakI7O0FBRmtELDhCQU0zQnJDLHNCQUFzQmlDLFVBQXRCLENBTjJCO0FBQUEsTUFNM0NLLFlBTjJDLHlCQU0zQ0EsWUFOMkM7O0FBUWxELFNBQU9MLFdBQVdNLE1BQVgsQ0FBa0IsVUFBQ0MsWUFBRCxFQUFlcEIsS0FBZixFQUFzQnFCLEtBQXRCLEVBQWdDO0FBQ3ZELFFBQU1DLE9BQU9KLGFBQWFHLEtBQWIsQ0FBYjtBQUNBLFFBQU1FLFlBQVlULFNBQVNVLElBQVQsQ0FBYztBQUFBLGFBQUtDLEVBQUUvQixHQUFGLEtBQVVNLEtBQWY7QUFBQSxLQUFkLENBQWxCOztBQUZ1RCxlQUdoQ3VCLGFBQWEsRUFIbUI7QUFBQSxRQUdoRHJCLElBSGdELFFBR2hEQSxJQUhnRDtBQUFBLFFBRzFDSyxNQUgwQyxRQUcxQ0EsTUFIMEM7O0FBS3ZEYSxpQkFBYUMsS0FBYixJQUFzQjtBQUNwQkMsZ0JBRG9CO0FBRXBCZixvQkFGb0I7O0FBSXBCO0FBQ0E7QUFDQW1CLHVCQUFpQkwsUUFBUSxDQU5MO0FBT3BCbkIsWUFBTXJCLHdCQUF3QnFCLElBQXhCO0FBUGMsS0FBdEI7O0FBVUEsV0FBT2tCLFlBQVA7QUFDRCxHQWhCTSxFQWdCSixFQWhCSSxDQUFQO0FBaUJEOztBQUVEOzs7Ozs7O0FBT08sU0FBU3hDLHFCQUFULENBQStCaUMsVUFBL0IsRUFBMkM7QUFDaEQsU0FBT0EsV0FBV00sTUFBWCxDQUNMLFVBQUNRLElBQUQsRUFBTzNCLEtBQVAsRUFBY0wsQ0FBZCxFQUFvQjtBQUFBLFFBQ1hpQyxRQURXLEdBQ0NELElBREQsQ0FDWEMsUUFEVzs7QUFFbEIsUUFBSUMsWUFBWTdCLEtBQWhCOztBQUVBO0FBQ0EsUUFBSTRCLFNBQVN0QixRQUFULENBQWtCTixLQUFsQixDQUFKLEVBQThCO0FBQzVCLFVBQUk4QixVQUFVLENBQWQ7QUFDQSxhQUFPRixTQUFTdEIsUUFBVCxDQUFxQk4sS0FBckIsU0FBOEI4QixPQUE5QixDQUFQLEVBQWlEO0FBQy9DQTtBQUNEO0FBQ0RELGtCQUFlN0IsS0FBZixTQUF3QjhCLE9BQXhCO0FBQ0Q7O0FBRURILFNBQUtULFlBQUwsQ0FBa0J2QixDQUFsQixJQUF1QmtDLFNBQXZCO0FBQ0FGLFNBQUtDLFFBQUwsQ0FBY0csSUFBZCxDQUFtQkYsU0FBbkI7O0FBRUEsV0FBT0YsSUFBUDtBQUNELEdBbEJJLEVBbUJMLEVBQUNDLFVBQVUsRUFBWCxFQUFlVixjQUFjLEVBQTdCLEVBbkJLLENBQVA7QUFxQkQ7O0FBRUQ7Ozs7OztBQU1BO0FBQ08sU0FBU3JDLHVCQUFULENBQWlDbUQsS0FBakMsRUFBd0M7QUFBQSxNQUUzQ0MsSUFGMkMsNEJBRTNDQSxJQUYyQztBQUFBLE1BRzNDQyxJQUgyQyw0QkFHM0NBLElBSDJDO0FBQUEsTUFJM0NDLFFBSjJDLDRCQUkzQ0EsUUFKMkM7QUFBQSxNQUszQ0MsTUFMMkMsNEJBSzNDQSxNQUwyQztBQUFBLE1BTTNDQyxHQU4yQyw0QkFNM0NBLEdBTjJDO0FBQUEsTUFPM0NDLEtBUDJDLDRCQU8zQ0EsS0FQMkM7QUFBQSxNQVEzQ0MsT0FSMkMsNEJBUTNDQSxPQVIyQztBQUFBLE1BUzNDQyxNQVQyQyw0QkFTM0NBLE1BVDJDO0FBQUEsTUFVM0NDLElBVjJDLDRCQVUzQ0EsSUFWMkM7QUFBQSxNQVczQ0MsUUFYMkMsNEJBVzNDQSxRQVgyQztBQUFBLE1BWTNDQyxvQkFaMkMsNEJBWTNDQSxvQkFaMkM7QUFBQSxNQWEzQ0MsT0FiMkMsNEJBYTNDQSxPQWIyQztBQUFBLE1BYzNDQyx5QkFkMkMsNEJBYzNDQSx5QkFkMkM7O0FBaUI3QztBQUNBOztBQUNBLFVBQVFiLEtBQVI7QUFDRSxTQUFLQyxJQUFMO0FBQ0UsYUFBTyxpQ0FBZ0JhLElBQXZCO0FBQ0YsU0FBS1osSUFBTDtBQUNBLFNBQUtDLFFBQUw7QUFDRSxhQUFPLGlDQUFnQjlCLFNBQXZCO0FBQ0YsU0FBSytCLE1BQUw7QUFDQSxTQUFLRSxLQUFMO0FBQ0UsYUFBTyxpQ0FBZ0JuQyxJQUF2QjtBQUNGLFNBQUtrQyxHQUFMO0FBQ0UsYUFBTyxpQ0FBZ0I1QixPQUF2QjtBQUNGLFNBQUs4QixPQUFMO0FBQ0UsYUFBTyxpQ0FBZ0I1QixPQUF2QjtBQUNGLFNBQUsrQixRQUFMO0FBQ0EsU0FBS0Msb0JBQUw7QUFDQSxTQUFLRSx5QkFBTDtBQUNFLGFBQU8saUNBQWdCRSxPQUF2QjtBQUNGLFNBQUtQLE1BQUw7QUFDQSxTQUFLQyxJQUFMO0FBQ0EsU0FBS0csT0FBTDtBQUNFLGFBQU8saUNBQWdCSSxNQUF2QjtBQUNGO0FBQ0Usc0JBQWNDLElBQWQsaUNBQWlEakIsS0FBakQ7QUFDQSxhQUFPLGlDQUFnQmdCLE1BQXZCO0FBdkJKO0FBeUJEO0FBQ0Q7O0FBRUE7OztBQUdPLFNBQVNsRSxnQkFBVCxDQUEwQkcsT0FBMUIsRUFBbUM7QUFDeEMsTUFBSSxDQUFDQSxRQUFRWSxNQUFiLEVBQXFCO0FBQ25CLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQU1KLE9BQU9ELE9BQU9DLElBQVAsQ0FBWVIsUUFBUSxDQUFSLENBQVosQ0FBYjtBQUNBLE1BQU1FLE9BQU9GLFFBQVFpRSxHQUFSLENBQVk7QUFBQSxXQUFLekQsS0FBS3lELEdBQUwsQ0FBUztBQUFBLGFBQU9DLEVBQUV6RCxHQUFGLENBQVA7QUFBQSxLQUFULENBQUw7QUFBQSxHQUFaLENBQWI7QUFDQSxNQUFNSSxTQUFTbkIsa0JBQWtCTSxPQUFsQixFQUEyQlEsSUFBM0IsQ0FBZjs7QUFFQSxTQUFPO0FBQ0xLLGtCQURLO0FBRUxYO0FBRkssR0FBUDtBQUlEOztBQUVNLFNBQVNKLGNBQVQsQ0FBd0JFLE9BQXhCLEVBQWlDO0FBQ3RDLE1BQU1tRSxvQkFBb0IsZ0NBQVVuRSxPQUFWLENBQTFCOztBQUVBLE1BQUksQ0FBQ21FLGlCQUFELElBQXNCLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0Ysa0JBQWtCRyxRQUFoQyxDQUEzQixFQUFzRTtBQUNwRTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsTUFBTUMsVUFBVUosa0JBQWtCRyxRQUFsQixDQUEyQnBDLE1BQTNCLENBQWtDLFVBQUNRLElBQUQsRUFBTzhCLENBQVAsRUFBVTlELENBQVYsRUFBZ0I7QUFDaEUsUUFBSThELEVBQUVDLFFBQU4sRUFBZ0I7QUFDZC9CLFdBQUtJLElBQUw7QUFDRTtBQUNBNEIsa0JBQVVGO0FBRlosU0FHTUEsRUFBRUcsVUFBRixJQUFnQixFQUh0QjtBQUtEO0FBQ0QsV0FBT2pDLElBQVA7QUFDRCxHQVRlLEVBU2IsRUFUYSxDQUFoQjs7QUFXQTtBQUNBLE1BQU03QixTQUFTMEQsUUFBUXJDLE1BQVIsQ0FBZSxVQUFDMEMsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQzVDdEUsV0FBT0MsSUFBUCxDQUFZcUUsSUFBWixFQUFrQnpFLE9BQWxCLENBQTBCLGVBQU87QUFDL0IsVUFBSSxDQUFDd0UsS0FBS3ZELFFBQUwsQ0FBY1osR0FBZCxDQUFMLEVBQXlCO0FBQ3ZCbUUsYUFBSzlCLElBQUwsQ0FBVXJDLEdBQVY7QUFDRDtBQUNGLEtBSkQ7QUFLQSxXQUFPbUUsSUFBUDtBQUNELEdBUGMsRUFPWixFQVBZLENBQWY7O0FBU0E7QUFDQUwsVUFBUW5FLE9BQVIsQ0FBZ0IsYUFBSztBQUNuQlMsV0FBT1QsT0FBUCxDQUFlLGFBQUs7QUFDbEIsVUFBSSxFQUFFb0UsS0FBS04sQ0FBUCxDQUFKLEVBQWU7QUFDYkEsVUFBRU0sQ0FBRixJQUFPLElBQVA7QUFDRDtBQUNGLEtBSkQ7QUFLRCxHQU5EOztBQVFBLFNBQU8zRSxpQkFBaUIwRSxPQUFqQixDQUFQO0FBQ0Q7O0FBRU0sU0FBU3hFLFNBQVQsQ0FBbUI0QixJQUFuQixFQUF5QmQsTUFBekIsRUFBaUM7QUFDdEMsTUFBTWlFLFVBQVVqRSxPQUFPb0QsR0FBUCxDQUFXO0FBQUEsV0FBS08sRUFBRW5DLElBQVA7QUFBQSxHQUFYLENBQWhCO0FBQ0EsU0FBTywyQkFBZXlDLE9BQWYsMENBQTJCbkQsSUFBM0IsR0FBUDtBQUNEIiwiZmlsZSI6ImRhdGEtcHJvY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjc3ZQYXJzZSwgY3N2UGFyc2VSb3dzLCBjc3ZGb3JtYXRSb3dzfSBmcm9tICdkMy1kc3YnO1xuaW1wb3J0IHtjb25zb2xlIGFzIGdsb2JhbENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtBbmFseXplciwgREFUQV9UWVBFUyBhcyBBbmFseXplckRBVEFfVFlQRVN9IGZyb20gJ3R5cGUtYW5hbHl6ZXInO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdnZW9qc29uLW5vcm1hbGl6ZSc7XG5cbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzQ3N2RGF0YShyYXdEYXRhKSB7XG4gIC8vIGhlcmUgd2UgYXNzdW1lIHRoZSBjc3YgZmlsZSB0aGF0IHBlb3BsZSB1cGxvYWRlZCB3aWxsIGhhdmUgZmlyc3Qgcm93XG4gIC8vIGFzIG5hbWUgb2YgdGhlIGNvbHVtblxuICAvL1RPRE86IGFkZCBhIGFsZXJ0IGF0IHVwbG9hZCBjc3YgdG8gcmVtaW5kIGRlZmluZSBmaXJzdCByb3dcbiAgY29uc3QgW2hlYWRlclJvdywgLi4ucm93c10gPSBjc3ZQYXJzZVJvd3MocmF3RGF0YSk7XG5cbiAgLy8gTk9URTogaWYgcmF3RGF0YSBoYXMgZHVwbGljYXRlZCBjb2x1bW4gbmFtZSwgdGhpcyB3aWxsIGVycm9yIG91dFxuICBjb25zdCByb3dPYmpzID0gY3N2UGFyc2UocmF3RGF0YSk7XG5cbiAgLy8gYW5hbHl6ZXIgd2lsbCBzZXQgYW55IGZpZWxkcyB0byAnc3RyaW5nJyBpZiB0aGVyZSBhcmUgZW1wdHkgdmFsdWVzXG4gIC8vIHdoaWNoIHdpbGwgYmUgcGFyc2VkIGFzICcnIGJ5IGQzLmNzdlxuICAvLyBoZXJlIHdlIHBhcnNlIGVtcHR5IGRhdGEgYXMgbnVsbFxuXG4gIHJvd09ianMuZm9yRWFjaCgocm93LCByb3dJZHgpID0+IHtcbiAgICBPYmplY3Qua2V5cyhyb3cpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgLy8gJ3VuZGVmaW5lZCcgY2FuIGhhcHBlbiBpZiB0aGVyZVxuICAgICAgLy8gaXMgbm8gZW5kLW9mLWxpbmUgbWFya2VyLCBhbmQgY2F1c2UgcHJvYmxlbXMgZG93biBzdHJlYW1cbiAgICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgd2h5IGQzIGlzbid0IGhhbmRsaW5nIHRoaXMuXG4gICAgICBpZiAocm93W2tleV0gPT09ICcnIHx8IHJvd1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcm93W2tleV0gPSBudWxsO1xuICAgICAgICByb3dzW3Jvd0lkeF1baV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBpZiAoIXJvd09ianMubGVuZ3RoIHx8ICFoZWFkZXJSb3cpIHtcbiAgICAvLyBsb29rcyBsaWtlIGFuIGVtcHR5IGZpbGVcbiAgICAvLyByZXNvbHZlIG51bGwsIGFuZCBjYXRjaCB0aGVtIGxhdGVyIGluIG9uZSBwbGFjZVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEocm93T2JqcywgaGVhZGVyUm93KTtcbiAgZmllbGRzLmZvckVhY2gocGFyc2VDc3ZEYXRhQnlGaWVsZFR5cGUuYmluZChudWxsLCByb3dzKSk7XG5cbiAgcmV0dXJuIHtmaWVsZHMsIHJvd3N9O1xufVxuXG4vKipcbiAqIFByb2Nlc3MgdXBsb2FkZWQgY3N2IGZpbGUgdG8gcGFyc2UgdmFsdWUgYnkgZmllbGQgdHlwZVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IHJvd3NcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDc3ZEYXRhQnlGaWVsZFR5cGUocm93cywgZmllbGQsIGkpIHtcbiAgY29uc3QgdW5peEZvcm1hdCA9IFsneCcsICdYJ107XG5cbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICAgIHJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICByb3dbaV0gPSBwYXJzZUZsb2F0KHJvd1tpXSk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgLy8gVE9ETzogdGltZXN0YW1wIGNhbiBiZSBlaXRoZXIgJzE0OTU4MjczMjYnIG9yICcyMDE2LTAzLTEwIDExOjIwJ1xuICAgIC8vIGlmIGl0J3MgJzE0OTU4MjczMjYnIHdlIHBhc3MgaXQgdG8gaW50XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgcm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIHJvd1tpXSA9XG4gICAgICAgICAgcm93W2ldICE9PSBudWxsICYmIHJvd1tpXSAhPT0gJycgJiYgdW5peEZvcm1hdC5pbmNsdWRlcyhmaWVsZC5mb3JtYXQpXG4gICAgICAgICAgICA/IE51bWJlcihyb3dbaV0pXG4gICAgICAgICAgICA6IHJvd1tpXTtcbiAgICAgIH0pO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgcm93W2ldID0gcm93W2ldID09PSBudWxsID8gcm93W2ldIDogcGFyc2VJbnQocm93W2ldLCAxMCk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuYm9vbGVhbjpcbiAgICAgIHJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICByb3dbaV0gPVxuICAgICAgICAgIHJvd1tpXSA9PT0gbnVsbCA/IHJvd1tpXSA6IHJvd1tpXSA9PT0gJ3RydWUnIHx8IHJvd1tpXSA9PT0gJ1RydWUnO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vKipcbiAqIGdldCBmaWVsZHMgZnJvbSBjc3YgZGF0YVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGRhdGFcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkT3JkZXJcbiAqIEByZXR1cm5zIHthcnJheX0gZm9ybWF0dGVkIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRzRnJvbURhdGEoZGF0YSwgZmllbGRPcmRlcikge1xuICAvLyBhZGQgYSBjaGVjayBmb3IgZXBvY2ggdGltZXN0YW1wXG4gIGNvbnN0IG1ldGFkYXRhID0gQW5hbHl6ZXIuY29tcHV0ZUNvbE1ldGEoZGF0YSwgW1xuICAgIHtyZWdleDogLy4qZ2VvanNvbnxhbGxfcG9pbnRzL2csIGRhdGFUeXBlOiAnR0VPTUVUUlknfVxuICBdKTtcblxuICBjb25zdCB7ZmllbGRCeUluZGV4fSA9IHJlbmFtZUR1cGxpY2F0ZUZpZWxkcyhmaWVsZE9yZGVyKTtcblxuICByZXR1cm4gZmllbGRPcmRlci5yZWR1Y2UoKG9yZGVyZWRBcnJheSwgZmllbGQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGZpZWxkQnlJbmRleFtpbmRleF07XG4gICAgY29uc3QgZmllbGRNZXRhID0gbWV0YWRhdGEuZmluZChtID0+IG0ua2V5ID09PSBmaWVsZCk7XG4gICAgY29uc3Qge3R5cGUsIGZvcm1hdH0gPSBmaWVsZE1ldGEgfHwge307XG5cbiAgICBvcmRlcmVkQXJyYXlbaW5kZXhdID0ge1xuICAgICAgbmFtZSxcbiAgICAgIGZvcm1hdCxcblxuICAgICAgLy8gbmVlZCB0aGlzIGZvciBtYXBidWlsZGVyIGNvbnZlcnNpb246IGZpbHRlciB0eXBlIGRldGVjdGlvblxuICAgICAgLy8gY2F0ZWdvcnksXG4gICAgICB0YWJsZUZpZWxkSW5kZXg6IGluZGV4ICsgMSxcbiAgICAgIHR5cGU6IGFuYWx5emVyVHlwZVRvRmllbGRUeXBlKHR5cGUpXG4gICAgfTtcblxuICAgIHJldHVybiBvcmRlcmVkQXJyYXk7XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBwYXNzIGluIGFuIGFycmF5IG9mIGZpZWxkIG5hbWVzLCByZW5hbWUgZHVwbGljYXRlZCBvbmVcbiAqIGFuZCByZXR1cm4gYSBtYXAgZnJvbSBvbGQgZmllbGQgaW5kZXggdG8gbmV3IG5hbWVcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBmaWVsZE9yZGVyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgZmllbGQgbmFtZSBieSBpbmRleFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lRHVwbGljYXRlRmllbGRzKGZpZWxkT3JkZXIpIHtcbiAgcmV0dXJuIGZpZWxkT3JkZXIucmVkdWNlKFxuICAgIChhY2N1LCBmaWVsZCwgaSkgPT4ge1xuICAgICAgY29uc3Qge2FsbE5hbWVzfSA9IGFjY3U7XG4gICAgICBsZXQgZmllbGROYW1lID0gZmllbGQ7XG5cbiAgICAgIC8vIGFkZCBhIGNvdW50ZXIgdG8gZHVwbGljYXRlZCBuYW1lc1xuICAgICAgaWYgKGFsbE5hbWVzLmluY2x1ZGVzKGZpZWxkKSkge1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlIChhbGxOYW1lcy5pbmNsdWRlcyhgJHtmaWVsZH0tJHtjb3VudGVyfWApKSB7XG4gICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkTmFtZSA9IGAke2ZpZWxkfS0ke2NvdW50ZXJ9YDtcbiAgICAgIH1cblxuICAgICAgYWNjdS5maWVsZEJ5SW5kZXhbaV0gPSBmaWVsZE5hbWU7XG4gICAgICBhY2N1LmFsbE5hbWVzLnB1c2goZmllbGROYW1lKTtcblxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSxcbiAgICB7YWxsTmFtZXM6IFtdLCBmaWVsZEJ5SW5kZXg6IHt9fVxuICApO1xufVxuXG4vKipcbiAqIE1hcCBBbmFseXplciB0eXBlcyB0byBsb2NhbCBmaWVsZCB0eXBlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBhVHlwZVxuICogQHJldHVybnMge3N0cmluZ30gY29ycmVzcG9uZGluZyB0eXBlIGluIEFMTF9GSUVMRF9UWVBFU1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUoYVR5cGUpIHtcbiAgY29uc3Qge1xuICAgIERBVEUsXG4gICAgVElNRSxcbiAgICBEQVRFVElNRSxcbiAgICBOVU1CRVIsXG4gICAgSU5ULFxuICAgIEZMT0FULFxuICAgIEJPT0xFQU4sXG4gICAgU1RSSU5HLFxuICAgIENJVFksXG4gICAgR0VPTUVUUlksXG4gICAgR0VPTUVUUllfRlJPTV9TVFJJTkcsXG4gICAgWklQQ09ERSxcbiAgICBQQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HXG4gIH0gPSBBbmFseXplckRBVEFfVFlQRVM7XG5cbiAgLy8gVE9ETzogdW4gcmVjb2duaXplZCB0eXBlc1xuICAvLyBDVVJSRU5DWSBQRVJDRU5UIE5PTkVcbiAgc3dpdGNoIChhVHlwZSkge1xuICAgIGNhc2UgREFURTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuZGF0ZTtcbiAgICBjYXNlIFRJTUU6XG4gICAgY2FzZSBEQVRFVElNRTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICAgIGNhc2UgTlVNQkVSOlxuICAgIGNhc2UgRkxPQVQ6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLnJlYWw7XG4gICAgY2FzZSBJTlQ6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI7XG4gICAgY2FzZSBCT09MRUFOOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuO1xuICAgIGNhc2UgR0VPTUVUUlk6XG4gICAgY2FzZSBHRU9NRVRSWV9GUk9NX1NUUklORzpcbiAgICBjYXNlIFBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkc6XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb247XG4gICAgY2FzZSBTVFJJTkc6XG4gICAgY2FzZSBDSVRZOlxuICAgIGNhc2UgWklQQ09ERTpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuc3RyaW5nO1xuICAgIGRlZmF1bHQ6XG4gICAgICBnbG9iYWxDb25zb2xlLndhcm4oYFVuc3VwcG9ydGVkIGFuYWx5emVyIHR5cGU6ICR7YVR5cGV9YCk7XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLnN0cmluZztcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qXG4gKiBQcm9jZXNzIHJhd0RhdGEgd2hlcmUgZWFjaCByb3cgaXMgYW4gb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzUm93T2JqZWN0KHJhd0RhdGEpIHtcbiAgaWYgKCFyYXdEYXRhLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJhd0RhdGFbMF0pO1xuICBjb25zdCByb3dzID0gcmF3RGF0YS5tYXAoZCA9PiBrZXlzLm1hcChrZXkgPT4gZFtrZXldKSk7XG4gIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc0Zyb21EYXRhKHJhd0RhdGEsIGtleXMpO1xuXG4gIHJldHVybiB7XG4gICAgZmllbGRzLFxuICAgIHJvd3NcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NHZW9qc29uKHJhd0RhdGEpIHtcbiAgY29uc3Qgbm9ybWFsaXplZEdlb2pzb24gPSBub3JtYWxpemUocmF3RGF0YSk7XG5cbiAgaWYgKCFub3JtYWxpemVkR2VvanNvbiB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkR2VvanNvbi5mZWF0dXJlcykpIHtcbiAgICAvLyBmYWlsIHRvIG5vcm1hbGl6ZSBnZW9qc29uXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBnZXR0aW5nIGFsbCBmZWF0dXJlIGZpZWxkc1xuICBjb25zdCBhbGxEYXRhID0gbm9ybWFsaXplZEdlb2pzb24uZmVhdHVyZXMucmVkdWNlKChhY2N1LCBmLCBpKSA9PiB7XG4gICAgaWYgKGYuZ2VvbWV0cnkpIHtcbiAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgIC8vIGFkZCBmZWF0dXJlIHRvIF9nZW9qc29uIGZpZWxkXG4gICAgICAgIF9nZW9qc29uOiBmLFxuICAgICAgICAuLi4oZi5wcm9wZXJ0aWVzIHx8IHt9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhY2N1O1xuICB9LCBbXSk7XG5cbiAgLy8gZ2V0IGFsbCB0aGUgZmllbGRcbiAgY29uc3QgZmllbGRzID0gYWxsRGF0YS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICBPYmplY3Qua2V5cyhjdXJyKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXByZXYuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICBwcmV2LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwgW10pO1xuXG4gIC8vIG1ha2Ugc3VyZSBlYWNoIGZlYXR1cmUgaGFzIGV4YWN0IHNhbWUgZmllbGRzXG4gIGFsbERhdGEuZm9yRWFjaChkID0+IHtcbiAgICBmaWVsZHMuZm9yRWFjaChmID0+IHtcbiAgICAgIGlmICghKGYgaW4gZCkpIHtcbiAgICAgICAgZFtmXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBwcm9jZXNzUm93T2JqZWN0KGFsbERhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q3N2KGRhdGEsIGZpZWxkcykge1xuICBjb25zdCBjb2x1bW5zID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIHJldHVybiBjc3ZGb3JtYXRSb3dzKFtjb2x1bW5zLCAuLi5kYXRhXSk7XG59XG4iXX0=