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
        format = _ref.format,
        category = _ref.category;

    orderedArray[index] = {
      name: name,
      format: format,
      category: category, // need this for mapbuilder conversion: filter type detection
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3IvZGF0YS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsicHJvY2Vzc0NzdkRhdGEiLCJwYXJzZUNzdkRhdGFCeUZpZWxkVHlwZSIsImdldEZpZWxkc0Zyb21EYXRhIiwicmVuYW1lRHVwbGljYXRlRmllbGRzIiwiYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUiLCJwcm9jZXNzUm93T2JqZWN0IiwicHJvY2Vzc0dlb2pzb24iLCJmb3JtYXRDc3YiLCJyYXdEYXRhIiwiaGVhZGVyUm93Iiwicm93cyIsInJvd09ianMiLCJmb3JFYWNoIiwicm93Iiwicm93SWR4IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsImkiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJmaWVsZHMiLCJiaW5kIiwiZmllbGQiLCJ1bml4Rm9ybWF0IiwidHlwZSIsInJlYWwiLCJwYXJzZUZsb2F0IiwidGltZXN0YW1wIiwiaW5jbHVkZXMiLCJmb3JtYXQiLCJOdW1iZXIiLCJpbnRlZ2VyIiwicGFyc2VJbnQiLCJib29sZWFuIiwiZGF0YSIsImZpZWxkT3JkZXIiLCJtZXRhZGF0YSIsImNvbXB1dGVDb2xNZXRhIiwicmVnZXgiLCJkYXRhVHlwZSIsImZpZWxkQnlJbmRleCIsInJlZHVjZSIsIm9yZGVyZWRBcnJheSIsImluZGV4IiwibmFtZSIsImZpZWxkTWV0YSIsImZpbmQiLCJtIiwiY2F0ZWdvcnkiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhY2N1IiwiYWxsTmFtZXMiLCJmaWVsZE5hbWUiLCJjb3VudGVyIiwicHVzaCIsImFUeXBlIiwiREFURSIsIlRJTUUiLCJEQVRFVElNRSIsIk5VTUJFUiIsIklOVCIsIkZMT0FUIiwiQk9PTEVBTiIsIlNUUklORyIsIkNJVFkiLCJHRU9NRVRSWSIsIkdFT01FVFJZX0ZST01fU1RSSU5HIiwiWklQQ09ERSIsIlBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkciLCJkYXRlIiwiZ2VvanNvbiIsInN0cmluZyIsIndhcm4iLCJtYXAiLCJkIiwibm9ybWFsaXplZEdlb2pzb24iLCJBcnJheSIsImlzQXJyYXkiLCJmZWF0dXJlcyIsImFsbERhdGEiLCJmIiwiZ2VvbWV0cnkiLCJfZ2VvanNvbiIsInByb3BlcnRpZXMiLCJwcmV2IiwiY3VyciIsImNvbHVtbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFPZ0JBLGMsR0FBQUEsYztRQTZDQUMsdUIsR0FBQUEsdUI7UUErQ0FDLGlCLEdBQUFBLGlCO1FBZ0NBQyxxQixHQUFBQSxxQjtRQStCQUMsdUIsR0FBQUEsdUI7UUFrREFDLGdCLEdBQUFBLGdCO1FBZUFDLGMsR0FBQUEsYztRQTBDQUMsUyxHQUFBQSxTOztBQTdRaEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUVPLFNBQVNQLGNBQVQsQ0FBd0JRLE9BQXhCLEVBQWlDO0FBQ3RDO0FBQ0E7QUFGc0Msc0JBSVQseUJBQWFBLE9BQWIsQ0FKUztBQUFBLE1BSS9CQyxTQUorQjtBQUFBLE1BSWpCQyxJQUppQjs7QUFNdEM7OztBQUNBLE1BQU1DLFVBQVUscUJBQVNILE9BQVQsQ0FBaEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBRyxVQUFRQyxPQUFSLENBQWdCLFVBQUNDLEdBQUQsRUFBTUMsTUFBTixFQUFpQjtBQUMvQkMsV0FBT0MsSUFBUCxDQUFZSCxHQUFaLEVBQWlCRCxPQUFqQixDQUF5QixVQUFDSyxHQUFELEVBQU1DLENBQU4sRUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxVQUFJTCxJQUFJSSxHQUFKLE1BQWEsRUFBYixJQUFtQkosSUFBSUksR0FBSixNQUFhRSxTQUFwQyxFQUErQztBQUM3Q04sWUFBSUksR0FBSixJQUFXLElBQVg7QUFDQVAsYUFBS0ksTUFBTCxFQUFhSSxDQUFiLElBQWtCLElBQWxCO0FBQ0Q7QUFDRixLQVJEO0FBU0QsR0FWRDs7QUFZQSxNQUFJLENBQUNQLFFBQVFTLE1BQVQsSUFBbUIsQ0FBQ1gsU0FBeEIsRUFBbUM7QUFDakM7QUFDQTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQU1ZLFNBQVNu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SUFBUDtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBTkQ7O0FBUUEsU0FBTzVFLGlCQUFpQjJFLE9BQWpCLENBQVA7QUFDRDs7QUFFTSxTQUFTekUsU0FBVCxDQUFtQjRCLElBQW5CLEVBQXlCZCxNQUF6QixFQUFpQztBQUN0QyxNQUFNa0UsVUFBVWxFLE9BQU9xRCxHQUFQLENBQVc7QUFBQSxXQUFLTyxFQUFFcEMsSUFBUDtBQUFBLEdBQVgsQ0FBaEI7QUFDQSxTQUFPLDJCQUFlMEMsT0FBZixTQUEyQnBELElBQTNCLEVBQVA7QUFDRCIsImZpbGUiOiJkYXRhLXByb2Nlc3Nvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3N2UGFyc2UsIGNzdlBhcnNlUm93cywgY3N2Rm9ybWF0Um93c30gZnJvbSAnZDMtZHN2JztcbmltcG9ydCB7Y29uc29sZSBhcyBnbG9iYWxDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7QW5hbHl6ZXIsIERBVEFfVFlQRVMgYXMgQW5hbHl6ZXJEQVRBX1RZUEVTfSBmcm9tICd0eXBlLWFuYWx5emVyJztcbmltcG9ydCBub3JtYWxpemUgZnJvbSAnZ2VvanNvbi1ub3JtYWxpemUnO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0NzdkRhdGEocmF3RGF0YSkge1xuICAvLyBoZXJlIHdlIGFzc3VtZSB0aGUgY3N2IGZpbGUgdGhhdCBwZW9wbGUgdXBsb2FkZWQgd2lsbCBoYXZlIGZpcnN0IHJvd1xuICAvLyBhcyBuYW1lIG9mIHRoZSBjb2x1bW5cbiAgLy9UT0RPOiBhZGQgYSBhbGVydCBhdCB1cGxvYWQgY3N2IHRvIHJlbWluZCBkZWZpbmUgZmlyc3Qgcm93XG4gIGNvbnN0IFtoZWFkZXJSb3csIC4uLnJvd3NdID0gY3N2UGFyc2VSb3dzKHJhd0RhdGEpO1xuXG4gIC8vIE5PVEU6IGlmIHJhd0RhdGEgaGFzIGR1cGxpY2F0ZWQgY29sdW1uIG5hbWUsIHRoaXMgd2lsbCBlcnJvciBvdXRcbiAgY29uc3Qgcm93T2JqcyA9IGNzdlBhcnNlKHJhd0RhdGEpO1xuXG4gIC8vIGFuYWx5emVyIHdpbGwgc2V0IGFueSBmaWVsZHMgdG8gJ3N0cmluZycgaWYgdGhlcmUgYXJlIGVtcHR5IHZhbHVlc1xuICAvLyB3aGljaCB3aWxsIGJlIHBhcnNlZCBhcyAnJyBieSBkMy5jc3ZcbiAgLy8gaGVyZSB3ZSBwYXJzZSBlbXB0eSBkYXRhIGFzIG51bGxcblxuICByb3dPYmpzLmZvckVhY2goKHJvdywgcm93SWR4KSA9PiB7XG4gICAgT2JqZWN0LmtleXMocm93KS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIC8vICd1bmRlZmluZWQnIGNhbiBoYXBwZW4gaWYgdGhlcmVcbiAgICAgIC8vIGlzIG5vIGVuZC1vZi1saW5lIG1hcmtlciwgYW5kIGNhdXNlIHByb2JsZW1zIGRvd24gc3RyZWFtXG4gICAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSBkMyBpc24ndCBoYW5kbGluZyB0aGlzLlxuICAgICAgaWYgKHJvd1trZXldID09PSAnJyB8fCByb3dba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJvd1trZXldID0gbnVsbDtcbiAgICAgICAgcm93c1tyb3dJZHhdW2ldID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKCFyb3dPYmpzLmxlbmd0aCB8fCAhaGVhZGVyUm93KSB7XG4gICAgLy8gbG9va3MgbGlrZSBhbiBlbXB0eSBmaWxlXG4gICAgLy8gcmVzb2x2ZSBudWxsLCBhbmQgY2F0Y2ggdGhlbSBsYXRlciBpbiBvbmUgcGxhY2VcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc0Zyb21EYXRhKHJvd09ianMsIGhlYWRlclJvdyk7XG4gIGZpZWxkcy5mb3JFYWNoKHBhcnNlQ3N2RGF0YUJ5RmllbGRUeXBlLmJpbmQobnVsbCwgcm93cykpO1xuXG4gIHJldHVybiB7ZmllbGRzLCByb3dzfTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHVwbG9hZGVkIGNzdiBmaWxlIHRvIHBhcnNlIHZhbHVlIGJ5IGZpZWxkIHR5cGVcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSByb3dzXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3N2RGF0YUJ5RmllbGRUeXBlKHJvd3MsIGZpZWxkLCBpKSB7XG4gIGNvbnN0IHVuaXhGb3JtYXQgPSBbJ3gnLCAnWCddO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgcm93W2ldID0gcGFyc2VGbG9hdChyb3dbaV0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIC8vIFRPRE86IHRpbWVzdGFtcCBjYW4gYmUgZWl0aGVyICcxNDk1ODI3MzI2JyBvciAnMjAxNi0wMy0xMCAxMToyMCdcbiAgICAvLyBpZiBpdCdzICcxNDk1ODI3MzI2JyB3ZSBwYXNzIGl0IHRvIGludFxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICByb3dbaV0gPVxuICAgICAgICAgIHJvd1tpXSAhPT0gbnVsbCAmJiByb3dbaV0gIT09ICcnICYmIHVuaXhGb3JtYXQuaW5jbHVkZXMoZmllbGQuZm9ybWF0KVxuICAgICAgICAgICAgPyBOdW1iZXIocm93W2ldKVxuICAgICAgICAgICAgOiByb3dbaV07XG4gICAgICB9KTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgICAgcm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIHJvd1tpXSA9IHJvd1tpXSA9PT0gbnVsbCA/IHJvd1tpXSA6IHBhcnNlSW50KHJvd1tpXSwgMTApO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgcm93W2ldID1cbiAgICAgICAgICByb3dbaV0gPT09IG51bGwgPyByb3dbaV0gOiByb3dbaV0gPT09ICd0cnVlJyB8fCByb3dbaV0gPT09ICdUcnVlJztcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyoqXG4gKiBnZXQgZmllbGRzIGZyb20gY3N2IGRhdGFcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBkYXRhXG4gKiBAcGFyYW0ge2FycmF5fSBmaWVsZE9yZGVyXG4gKiBAcmV0dXJucyB7YXJyYXl9IGZvcm1hdHRlZCBmaWVsZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkc0Zyb21EYXRhKGRhdGEsIGZpZWxkT3JkZXIpIHtcbiAgLy8gYWRkIGEgY2hlY2sgZm9yIGVwb2NoIHRpbWVzdGFtcFxuICBjb25zdCBtZXRhZGF0YSA9IEFuYWx5emVyLmNvbXB1dGVDb2xNZXRhKGRhdGEsIFtcbiAgICB7cmVnZXg6IC8uKmdlb2pzb258YWxsX3BvaW50cy9nLCBkYXRhVHlwZTogJ0dFT01FVFJZJ31cbiAgXSk7XG5cbiAgY29uc3Qge2ZpZWxkQnlJbmRleH0gPSByZW5hbWVEdXBsaWNhdGVGaWVsZHMoZmllbGRPcmRlcik7XG5cbiAgcmV0dXJuIGZpZWxkT3JkZXIucmVkdWNlKChvcmRlcmVkQXJyYXksIGZpZWxkLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IG5hbWUgPSBmaWVsZEJ5SW5kZXhbaW5kZXhdO1xuICAgIGNvbnN0IGZpZWxkTWV0YSA9IG1ldGFkYXRhLmZpbmQobSA9PiBtLmtleSA9PT0gZmllbGQpO1xuICAgIGNvbnN0IHt0eXBlLCBmb3JtYXQsIGNhdGVnb3J5fSA9IGZpZWxkTWV0YSB8fCB7fTtcblxuICAgIG9yZGVyZWRBcnJheVtpbmRleF0gPSB7XG4gICAgICBuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgY2F0ZWdvcnksIC8vIG5lZWQgdGhpcyBmb3IgbWFwYnVpbGRlciBjb252ZXJzaW9uOiBmaWx0ZXIgdHlwZSBkZXRlY3Rpb25cbiAgICAgIHRhYmxlRmllbGRJbmRleDogaW5kZXggKyAxLFxuICAgICAgdHlwZTogYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUodHlwZSlcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9yZGVyZWRBcnJheTtcbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIHBhc3MgaW4gYW4gYXJyYXkgb2YgZmllbGQgbmFtZXMsIHJlbmFtZSBkdXBsaWNhdGVkIG9uZVxuICogYW5kIHJldHVybiBhIG1hcCBmcm9tIG9sZCBmaWVsZCBpbmRleCB0byBuZXcgbmFtZVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkT3JkZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG5ldyBmaWVsZCBuYW1lIGJ5IGluZGV4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVEdXBsaWNhdGVGaWVsZHMoZmllbGRPcmRlcikge1xuICByZXR1cm4gZmllbGRPcmRlci5yZWR1Y2UoXG4gICAgKGFjY3UsIGZpZWxkLCBpKSA9PiB7XG4gICAgICBjb25zdCB7YWxsTmFtZXN9ID0gYWNjdTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBmaWVsZDtcblxuICAgICAgLy8gYWRkIGEgY291bnRlciB0byBkdXBsaWNhdGVkIG5hbWVzXG4gICAgICBpZiAoYWxsTmFtZXMuaW5jbHVkZXMoZmllbGQpKSB7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgd2hpbGUgKGFsbE5hbWVzLmluY2x1ZGVzKGAke2ZpZWxkfS0ke2NvdW50ZXJ9YCkpIHtcbiAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGROYW1lID0gYCR7ZmllbGR9LSR7Y291bnRlcn1gO1xuICAgICAgfVxuXG4gICAgICBhY2N1LmZpZWxkQnlJbmRleFtpXSA9IGZpZWxkTmFtZTtcbiAgICAgIGFjY3UuYWxsTmFtZXMucHVzaChmaWVsZE5hbWUpO1xuXG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LFxuICAgIHthbGxOYW1lczogW10sIGZpZWxkQnlJbmRleDoge319XG4gICk7XG59XG5cbi8qKlxuICogTWFwIEFuYWx5emVyIHR5cGVzIHRvIGxvY2FsIGZpZWxkIHR5cGVzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGFUeXBlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb3JyZXNwb25kaW5nIHR5cGUgaW4gQUxMX0ZJRUxEX1RZUEVTXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmFseXplclR5cGVUb0ZpZWxkVHlwZShhVHlwZSkge1xuICBjb25zdCB7XG4gICAgREFURSxcbiAgICBUSU1FLFxuICAgIERBVEVUSU1FLFxuICAgIE5VTUJFUixcbiAgICBJTlQsXG4gICAgRkxPQVQsXG4gICAgQk9PTEVBTixcbiAgICBTVFJJTkcsXG4gICAgQ0lUWSxcbiAgICBHRU9NRVRSWSxcbiAgICBHRU9NRVRSWV9GUk9NX1NUUklORyxcbiAgICBaSVBDT0RFLFxuICAgIFBBSVJfR0VPTUVUUllfRlJPTV9TVFJJTkdcbiAgfSA9IEFuYWx5emVyREFUQV9UWVBFUztcblxuICAvLyBUT0RPOiB1biByZWNvZ25pemVkIHR5cGVzXG4gIC8vIENVUlJFTkNZIFBFUkNFTlQgTk9ORVxuICBzd2l0Y2ggKGFUeXBlKSB7XG4gICAgY2FzZSBEQVRFOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5kYXRlO1xuICAgIGNhc2UgVElNRTpcbiAgICBjYXNlIERBVEVUSU1FOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gICAgY2FzZSBOVU1CRVI6XG4gICAgY2FzZSBGTE9BVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMucmVhbDtcbiAgICBjYXNlIElOVDpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuaW50ZWdlcjtcbiAgICBjYXNlIEJPT0xFQU46XG4gICAgICByZXR1cm4gQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW47XG4gICAgY2FzZSBHRU9NRVRSWTpcbiAgICBjYXNlIEdFT01FVFJZX0ZST01fU1RSSU5HOlxuICAgIGNhc2UgUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklORzpcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuZ2VvanNvbjtcbiAgICBjYXNlIFNUUklORzpcbiAgICBjYXNlIENJVFk6XG4gICAgY2FzZSBaSVBDT0RFOlxuICAgICAgcmV0dXJuIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc7XG4gICAgZGVmYXVsdDpcbiAgICAgIGdsb2JhbENvbnNvbGUud2FybihgVW5zdXBwb3J0ZWQgYW5hbHl6ZXIgdHlwZTogJHthVHlwZX1gKTtcbiAgICAgIHJldHVybiBBTExfRklFTERfVFlQRVMuc3RyaW5nO1xuICB9XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuLypcbiAqIFByb2Nlc3MgcmF3RGF0YSB3aGVyZSBlYWNoIHJvdyBpcyBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NSb3dPYmplY3QocmF3RGF0YSkge1xuICBpZiAoIXJhd0RhdGEubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmF3RGF0YVswXSk7XG4gIGNvbnN0IHJvd3MgPSByYXdEYXRhLm1hcChkID0+IGtleXMubWFwKGtleSA9PiBkW2tleV0pKTtcbiAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzRnJvbURhdGEocmF3RGF0YSwga2V5cyk7XG5cbiAgcmV0dXJuIHtcbiAgICBmaWVsZHMsXG4gICAgcm93c1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0dlb2pzb24ocmF3RGF0YSkge1xuICBjb25zdCBub3JtYWxpemVkR2VvanNvbiA9IG5vcm1hbGl6ZShyYXdEYXRhKTtcblxuICBpZiAoIW5vcm1hbGl6ZWRHZW9qc29uIHx8ICFBcnJheS5pc0FycmF5KG5vcm1hbGl6ZWRHZW9qc29uLmZlYXR1cmVzKSkge1xuICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIGdldHRpbmcgYWxsIGZlYXR1cmUgZmllbGRzXG4gIGNvbnN0IGFsbERhdGEgPSBub3JtYWxpemVkR2VvanNvbi5mZWF0dXJlcy5yZWR1Y2UoKGFjY3UsIGYsIGkpID0+IHtcbiAgICBpZiAoZi5nZW9tZXRyeSkge1xuICAgICAgYWNjdS5wdXNoKHtcbiAgICAgICAgLy8gYWRkIGZlYXR1cmUgdG8gX2dlb2pzb24gZmllbGRcbiAgICAgICAgX2dlb2pzb246IGYsXG4gICAgICAgIC4uLihmLnByb3BlcnRpZXMgfHwge30pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFjY3U7XG4gIH0sIFtdKTtcblxuICAvLyBnZXQgYWxsIHRoZSBmaWVsZFxuICBjb25zdCBmaWVsZHMgPSBhbGxEYXRhLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgIE9iamVjdC5rZXlzKGN1cnIpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICghcHJldi5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgIHByZXYucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwcmV2O1xuICB9LCBbXSk7XG5cbiAgLy8gbWFrZSBzdXJlIGVhY2ggZmVhdHVyZSBoYXMgZXhhY3Qgc2FtZSBmaWVsZHNcbiAgYWxsRGF0YS5mb3JFYWNoKGQgPT4ge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgaWYgKCEoZiBpbiBkKSkge1xuICAgICAgICBkW2ZdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb2Nlc3NSb3dPYmplY3QoYWxsRGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDc3YoZGF0YSwgZmllbGRzKSB7XG4gIGNvbnN0IGNvbHVtbnMgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKTtcbiAgcmV0dXJuIGNzdkZvcm1hdFJvd3MoW2NvbHVtbnMsIC4uLmRhdGFdKTtcbn1cbiJdfQ==