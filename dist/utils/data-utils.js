'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.validateInputData = validateInputData;
exports.getSampleForTypeAnalyze = getSampleForTypeAnalyze;
exports.unique = unique;
exports.findMapBounds = findMapBounds;
exports.getLatLngBounds = getLatLngBounds;
exports.getSampleData = getSampleData;
exports.maybeToDate = maybeToDate;
exports.notNullorUndefined = notNullorUndefined;
exports.isPlainObject = isPlainObject;
exports.numberSort = numberSort;
exports.getSortingFunction = getSortingFunction;
exports.preciseRound = preciseRound;
exports.getRoundingDecimalFromStep = getRoundingDecimalFromStep;
exports.roundValToStep = roundValToStep;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _d3Array = require('d3-array');

var _defaultSettings = require('../constants/default-settings');

var _dataProcessor = require('../processor/data-processor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param data
 * @returns {{allData: Array, fields: Array}}
 */
function validateInputData(data) {
  /*
   * expected input data format
   * {
   *   fields: [],
   *   rows: []
   * }
   */
  var proceed = true;
  if (!data) {
    (0, _assert2.default)('receiveVisData: data cannot be null');
    proceed = false;
  }

  if (!Array.isArray(data.fields)) {
    (0, _assert2.default)('receiveVisData: expect data.fields to be an array');
    proceed = false;
  }

  if (!Array.isArray(data.rows)) {
    (0, _assert2.default)('receiveVisData: expect data.rows to be an array');
    proceed = false;
  }

  if (!proceed) {
    return null;
  }

  var fields = data.fields,
      rows = data.rows;

  // check if all fields has name, format and type

  var allValid = fields.every(function (f, i) {
    if ((typeof f === 'undefined' ? 'undefined' : (0, _typeof3.default)(f)) !== 'object') {
      (0, _assert2.default)('fields needs to be an array of object, but find ' + f);
      return false;
    }

    if (!f.name) {
      (0, _assert2.default)('field.name is required but missing in field ' + JSON.stringify(f));
      // assign a name
      f.name = 'column_' + i;
    }

    if (!_defaultSettings.ALL_FIELD_TYPES[f.type]) {
      (0, _assert2.default)('unknown field type ' + f.type);
      return false;
    }

    return f.type && f.format && f.name;
  });

  if (allValid) {
    return { rows: rows, fields: fields };
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  var sampleData = getSampleForTypeAnalyze({ fields: fields, allData: rows });
  var fieldOrder = fields.map(function (f) {
    return f.name;
  });
  var meta = (0, _dataProcessor.getFieldsFromData)(sampleData, fieldOrder);
  var updatedFields = fields.map(function (f, i) {
    return (0, _extends3.default)({}, f, {
      type: meta[i].type,
      format: meta[i].format
    });
  });

  return { fields: updatedFields, rows: rows };
}

/**
 * get fields from csv data
 *
 * @param {array} fields
 * @param {array} allData
 * @param {array} sampleCount
 * @returns {array} formatted fields
 */
function getSampleForTypeAnalyze(_ref) {
  var fields = _ref.fields,
      allData = _ref.allData,
      _ref$sampleCount = _ref.sampleCount,
      sampleCount = _ref$sampleCount === undefined ? 50 : _ref$sampleCount;

  var total = Math.min(sampleCount, allData.length);
  var fieldOrder = fields.map(function (f) {
    return f.name;
  });
  var sample = (0, _d3Array.range)(0, total, 1).map(function (d) {
    return {};
  });

  // collect sample data for each field
  fieldOrder.forEach(function (field, fieldIdx) {
    // data counter
    var i = 0;
    // sample counter
    var j = 0;

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
 * simple getting unique values of an array
 *
 * @param {array} values
 * @returns {array} unique values
 */
function unique(values) {
  var results = [];
  values.forEach(function (v) {
    if (!results.includes(v) && v !== null && v !== undefined) {
      results.push(v);
    }
  });

  return results;
}

/* eslint-disable max-statements */
/**
 * return center of map from given points
 * @param {array} layers
 * @param {string} dataId
 * @returns {object} coordinates of map center, empty if not found
 */
function findMapBounds(layers, dataId) {
  // find bounds in formatted layerData
  // use first isVisible Layer

  var newLayers = dataId ? layers.filter(function (l) {
    return l.config.dataId === dataId;
  }) : layers;
  var firstVisibleLayer = newLayers.find(function (l) {
    return l.config.isVisible;
  });
  if (!firstVisibleLayer) {
    return null;
  }

  // if first visible layer has bounds, use it
  if (firstVisibleLayer.meta && firstVisibleLayer.meta.bounds) {
    return firstVisibleLayer.meta.bounds;
  }

  // if not, find any layer that has bound
  var anyLayerWBound = newLayers.find(function (l) {
    return l.meta && l.meta.bounds;
  });

  return anyLayerWBound ? anyLayerWBound.meta.bounds : null;
}
/* eslint-enable max-statements */

function getLatLngBounds(points, idx, limit) {
  var lats = points.map(function (d) {
    return Array.isArray(d) && d[idx];
  }).filter(Number.isFinite).sort(numberSort);

  if (!lats.length) {
    return null;
  }
  // use 99 percentile to filter out outliers
  // clamp to limit
  return [Math.max(lats[Math.floor(0.01 * (lats.length - 1))], limit[0]), Math.min(lats[Math.ceil(0.99 * (lats.length - 1))], limit[1])];
}

function getSampleData(data) {
  var sampleSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  var sampleStep = Math.max(Math.floor(data.length / sampleSize), 1);
  var output = [];
  for (var i = 0; i < data.length; i += sampleStep) {
    output.push(data[i]);
  }

  return output;
}

function maybeToDate(isTime, fieldIdx, format, d) {
  if (isTime) {
    if (notNullorUndefined(d[fieldIdx])) {
      return typeof d[fieldIdx] === 'string' ? _moment2.default.utc(d[fieldIdx], format).valueOf() : format === 'x' ? d[fieldIdx] * 1000 : d[fieldIdx];
    }

    return null;
  }

  return d[fieldIdx];
}

function notNullorUndefined(d) {
  return d !== undefined && d !== null;
}

function isPlainObject(obj) {
  return obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj);
}

function numberSort(a, b) {
  return a - b;
}

function getSortingFunction(fieldType) {
  switch (fieldType) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return numberSort;
    default:
      return undefined;
  }
}

/**
 * round number with exact number of decimals
 * return as a string
 * @param {number} num
 * @param {number} decimals
 * @returns {string} - a rounded number in string format
 */
function preciseRound(num, decimals) {
  var t = Math.pow(10, decimals);
  return (Math.round(num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}

/**
 * get number of decimals to round to for slider from step
 * @param {number} step
 * @returns {number} - number of decimal
 */
function getRoundingDecimalFromStep(step) {
  if (isNaN(step)) {
    (0, _assert2.default)('step is not a number');
    (0, _assert2.default)(step);
  }

  var splitZero = step.toString().split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

/**
 * round the value to step for the slider
 * @param {number} minValue
 * @param {number} step
 * @param {number} val
 * @returns {number} - rounded number
 */
function roundValToStep(minValue, step, val) {
  if (isNaN(step)) {
    return val;
  }

  var decimal = getRoundingDecimalFromStep(step);
  var steps = Math.floor((val - minValue) / step);
  var remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  var closest = void 0;
  if (remain === 0) {
    closest = val;
  } else if (remain < step / 2) {
    closest = steps * step + minValue;
  } else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  var rounded = preciseRound(closest, decimal);

  return Number(rounded);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhLXV0aWxzLmpzIl0sIm5hbWVzIjpbInZhbGlkYXRlSW5wdXREYXRhIiwiZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUiLCJ1bmlxdWUiLCJmaW5kTWFwQm91bmRzIiwiZ2V0TGF0TG5nQm91bmRzIiwiZ2V0U2FtcGxlRGF0YSIsIm1heWJlVG9EYXRlIiwibm90TnVsbG9yVW5kZWZpbmVkIiwiaXNQbGFpbk9iamVjdCIsIm51bWJlclNvcnQiLCJnZXRTb3J0aW5nRnVuY3Rpb24iLCJwcmVjaXNlUm91bmQiLCJnZXRSb3VuZGluZ0RlY2ltYWxGcm9tU3RlcCIsInJvdW5kVmFsVG9TdGVwIiwiZGF0YSIsInByb2NlZWQiLCJBcnJheSIsImlzQXJyYXkiLCJmaWVsZHMiLCJyb3dzIiwiYWxsVmFsaWQiLCJldmVyeSIsImYiLCJpIiwibmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwiZm9ybWF0Iiwic2FtcGxlRGF0YSIsImFsbERhdGEiLCJmaWVsZE9yZGVyIiwibWFwIiwibWV0YSIsInVwZGF0ZWRGaWVsZHMiLCJzYW1wbGVDb3VudCIsInRvdGFsIiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsInNhbXBsZSIsImZvckVhY2giLCJmaWVsZCIsImZpZWxkSWR4IiwiaiIsInZhbHVlcyIsInJlc3VsdHMiLCJpbmNsdWRlcyIsInYiLCJ1bmRlZmluZWQiLCJwdXNoIiwibGF5ZXJzIiwiZGF0YUlkIiwibmV3TGF5ZXJzIiwiZmlsdGVyIiwibCIsImNvbmZpZyIsImZpcnN0VmlzaWJsZUxheWVyIiwiZmluZCIsImlzVmlzaWJsZSIsImJvdW5kcyIsImFueUxheWVyV0JvdW5kIiwicG9pbnRzIiwiaWR4IiwibGltaXQiLCJsYXRzIiwiZCIsIk51bWJlciIsImlzRmluaXRlIiwic29ydCIsIm1heCIsImZsb29yIiwiY2VpbCIsInNhbXBsZVNpemUiLCJzYW1wbGVTdGVwIiwib3V0cHV0IiwiaXNUaW1lIiwidXRjIiwidmFsdWVPZiIsIm9iaiIsIk9iamVjdCIsImEiLCJiIiwiZmllbGRUeXBlIiwicmVhbCIsImludGVnZXIiLCJ0aW1lc3RhbXAiLCJudW0iLCJkZWNpbWFscyIsInQiLCJwb3ciLCJyb3VuZCIsInNpZ24iLCJ0b0ZpeGVkIiwic3RlcCIsImlzTmFOIiwic3BsaXRaZXJvIiwidG9TdHJpbmciLCJzcGxpdCIsIm1pblZhbHVlIiwidmFsIiwiZGVjaW1hbCIsInN0ZXBzIiwicmVtYWluIiwiY2xvc2VzdCIsInJvdW5kZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBVWdCQSxpQixHQUFBQSxpQjtRQTZFQUMsdUIsR0FBQUEsdUI7UUFvQ0FDLE0sR0FBQUEsTTtRQWtCQUMsYSxHQUFBQSxhO1FBc0JBQyxlLEdBQUFBLGU7UUFlQUMsYSxHQUFBQSxhO1FBVUFDLFcsR0FBQUEsVztRQWVBQyxrQixHQUFBQSxrQjtRQUlBQyxhLEdBQUFBLGE7UUFJQUMsVSxHQUFBQSxVO1FBSUFDLGtCLEdBQUFBLGtCO1FBa0JBQyxZLEdBQUFBLFk7UUFXQUMsMEIsR0FBQUEsMEI7UUFvQkFDLGMsR0FBQUEsYzs7QUF4UWhCOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7OztBQUtPLFNBQVNiLGlCQUFULENBQTJCYyxJQUEzQixFQUFpQztBQUN0Qzs7Ozs7OztBQU9BLE1BQUlDLFVBQVUsSUFBZDtBQUNBLE1BQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1QsMEJBQU8scUNBQVA7QUFDQUMsY0FBVSxLQUFWO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWNILEtBQUtJLE1BQW5CLENBQUwsRUFBaUM7QUFDL0IsMEJBQU8sbURBQVA7QUFDQUgsY0FBVSxLQUFWO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWNILEtBQUtLLElBQW5CLENBQUwsRUFBK0I7QUFDN0IsMEJBQU8saURBQVA7QUFDQUosY0FBVSxLQUFWO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDQSxPQUFMLEVBQWM7QUFDWixX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LElBQTlCLENBQWQ7QUFDQSxNQUFJUyxTQUFTSCxPQUFPRSxRQUFRUixJQUFSLEdBQWVLLFFBQXRCLENBQWI7O0FBRUE7QUFDQUksV0FBU3BDLE9BQU94RCxhQUFhNEYsTUFBYixFQUFxQixDQUFyQixDQUFQLENBQVQ7O0FBRUEsTUFBSUMsZ0JBQUo7QUFDQSxNQUFJRCxXQUFXLENBQWYsRUFBa0I7QUFDaEJDLGNBQVVKLEdBQVY7QUFDRCxHQUZELE1BRU8sSUFBSUcsU0FBU1QsT0FBTyxDQUFwQixFQUF1QjtBQUM1QlUsY0FBVUYsUUFBUVIsSUFBUixHQUFlSyxRQUF6QjtBQUNELEdBRk0sTUFFQTtBQUNMSyxjQUFVLENBQUNGLFFBQVEsQ0FBVCxJQUFjUixJQUFkLEdBQXFCSyxRQUEvQjtBQUNEOztBQUVEO0FBQ0EsTUFBTU0sVUFBVTlGLGFBQWE2RixPQUFiLEVBQXNCSCxPQUF0QixDQUFoQjs7QUFFQSxTQUFPbEMsT0FBT3NDLE9BQVAsQ0FBUDtBQUNEIiwiZmlsZSI6ImRhdGEtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRGaWVsZHNGcm9tRGF0YX0gZnJvbSAncHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcbi8qKlxuICpcbiAqIEBwYXJhbSBkYXRhXG4gKiBAcmV0dXJucyB7e2FsbERhdGE6IEFycmF5LCBmaWVsZHM6IEFycmF5fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXREYXRhKGRhdGEpIHtcbiAgLypcbiAgICogZXhwZWN0ZWQgaW5wdXQgZGF0YSBmb3JtYXRcbiAgICoge1xuICAgKiAgIGZpZWxkczogW10sXG4gICAqICAgcm93czogW11cbiAgICogfVxuICAgKi9cbiAgbGV0IHByb2NlZWQgPSB0cnVlO1xuICBpZiAoIWRhdGEpIHtcbiAgICBhc3NlcnQoJ3JlY2VpdmVWaXNEYXRhOiBkYXRhIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgcHJvY2VlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuZmllbGRzKSkge1xuICAgIGFzc2VydCgncmVjZWl2ZVZpc0RhdGE6IGV4cGVjdCBkYXRhLmZpZWxkcyB0byBiZSBhbiBhcnJheScpO1xuICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnJvd3MpKSB7XG4gICAgYXNzZXJ0KCdyZWNlaXZlVmlzRGF0YTogZXhwZWN0IGRhdGEucm93cyB0byBiZSBhbiBhcnJheScpO1xuICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghcHJvY2VlZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qge2ZpZWxkcywgcm93c30gPSBkYXRhO1xuXG4gIC8vIGNoZWNrIGlmIGFsbCBmaWVsZHMgaGFzIG5hbWUsIGZvcm1hdCBhbmQgdHlwZVxuICBjb25zdCBhbGxWYWxpZCA9IGZpZWxkcy5ldmVyeSgoZiwgaSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZiAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGFzc2VydChgZmllbGRzIG5lZWRzIHRvIGJlIGFuIGFycmF5IG9mIG9iamVjdCwgYnV0IGZpbmQgJHtmfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghZi5uYW1lKSB7XG4gICAgICBhc3NlcnQoYGZpZWxkLm5hbWUgaXMgcmVxdWlyZWQgYnV0IG1pc3NpbmcgaW4gZmllbGQgJHtKU09OLnN0cmluZ2lmeShmKX1gKTtcbiAgICAgIC8vIGFzc2lnbiBhIG5hbWVcbiAgICAgIGYubmFtZSA9IGBjb2x1bW5fJHtpfWA7XG4gICAgfVxuXG4gICAgaWYgKCFBTExfRklFTERfVFlQRVNbZi50eXBlXSkge1xuICAgICAgYXNzZXJ0KGB1bmtub3duIGZpZWxkIHR5cGUgJHtmLnR5cGV9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGYudHlwZSAmJiBmLmZvcm1hdCAmJiBmLm5hbWU7XG4gIH0pO1xuXG4gIGlmIChhbGxWYWxpZCkge1xuICAgIHJldHVybiB7cm93cywgZmllbGRzfTtcbiAgfVxuXG4gIC8vIGlmIGFueSBmaWVsZCBoYXMgbWlzc2luZyB0eXBlLCByZWNhbGN1bGF0ZSBpdCBmb3IgZXZlcnlvbmVcbiAgLy8gYmVjYXVzZSB3ZSBzaW1wbHkgbG9zdCBmYWl0aCBpbiBodW1hbml0eVxuICBjb25zdCBzYW1wbGVEYXRhID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YTogcm93c30pO1xuICBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIGNvbnN0IG1ldGEgPSBnZXRGaWVsZHNGcm9tRGF0YShzYW1wbGVEYXRhLCBmaWVsZE9yZGVyKTtcbiAgY29uc3QgdXBkYXRlZEZpZWxkcyA9IGZpZWxkcy5tYXAoKGYsIGkpID0+ICh7XG4gICAgLi4uZixcbiAgICB0eXBlOiBtZXRhW2ldLnR5cGUsXG4gICAgZm9ybWF0OiBtZXRhW2ldLmZvcm1hdFxuICB9KSk7XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3N9O1xufVxuXG4vKipcbiAqIGdldCBmaWVsZHMgZnJvbSBjc3YgZGF0YVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHthcnJheX0gYWxsRGF0YVxuICogQHBhcmFtIHthcnJheX0gc2FtcGxlQ291bnRcbiAqIEByZXR1cm5zIHthcnJheX0gZm9ybWF0dGVkIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YSwgc2FtcGxlQ291bnQgPSA1MH0pIHtcbiAgY29uc3QgdG90YWwgPSBNYXRoLm1pbihzYW1wbGVDb3VudCwgYWxsRGF0YS5sZW5ndGgpO1xuICBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIGNvbnN0IHNhbXBsZSA9IHJhbmdlKDAsIHRvdGFsLCAxKS5tYXAoZCA9PiAoe30pKTtcblxuICAvLyBjb2xsZWN0IHNhbXBsZSBkYXRhIGZvciBlYWNoIGZpZWxkXG4gIGZpZWxkT3JkZXIuZm9yRWFjaCgoZmllbGQsIGZpZWxkSWR4KSA9PiB7XG4gICAgLy8gZGF0YSBjb3VudGVyXG4gICAgbGV0IGkgPSAwO1xuICAgIC8vIHNhbXBsZSBjb3VudGVyXG4gICAgbGV0IGogPSAwO1xuXG4gICAgd2hpbGUgKGogPCB0b3RhbCkge1xuICAgICAgaWYgKGkgPj0gYWxsRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgZGVwbGV0ZWQgZGF0YSBwb29sXG4gICAgICAgIHNhbXBsZVtqXVtmaWVsZF0gPSBudWxsO1xuICAgICAgICBqKys7XG4gICAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChhbGxEYXRhW2ldW2ZpZWxkSWR4XSkpIHtcbiAgICAgICAgc2FtcGxlW2pdW2ZpZWxkXSA9IGFsbERhdGFbaV1bZmllbGRJZHhdO1xuICAgICAgICBqKys7XG4gICAgICAgIGkrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzYW1wbGU7XG59XG5cbi8qKlxuICogc2ltcGxlIGdldHRpbmcgdW5pcXVlIHZhbHVlcyBvZiBhbiBhcnJheVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICogQHJldHVybnMge2FycmF5fSB1bmlxdWUgdmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUodmFsdWVzKSB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgdmFsdWVzLmZvckVhY2godiA9PiB7XG4gICAgaWYgKCFyZXN1bHRzLmluY2x1ZGVzKHYpICYmIHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHRzLnB1c2godik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbi8qKlxuICogcmV0dXJuIGNlbnRlciBvZiBtYXAgZnJvbSBnaXZlbiBwb2ludHNcbiAqIEBwYXJhbSB7YXJyYXl9IGxheWVyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge29iamVjdH0gY29vcmRpbmF0ZXMgb2YgbWFwIGNlbnRlciwgZW1wdHkgaWYgbm90IGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWFwQm91bmRzKGxheWVycywgZGF0YUlkKSB7XG4gIC8vIGZpbmQgYm91bmRzIGluIGZvcm1hdHRlZCBsYXllckRhdGFcbiAgLy8gdXNlIGZpcnN0IGlzVmlzaWJsZSBMYXllclxuXG4gIGNvbnN0IG5ld0xheWVycyA9IGRhdGFJZCA/IGxheWVycy5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFJZCkgOiBsYXllcnM7XG4gIGNvbnN0IGZpcnN0VmlzaWJsZUxheWVyID0gbmV3TGF5ZXJzLmZpbmQobCA9PiBsLmNvbmZpZy5pc1Zpc2libGUpO1xuICBpZiAoIWZpcnN0VmlzaWJsZUxheWVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBpZiBmaXJzdCB2aXNpYmxlIGxheWVyIGhhcyBib3VuZHMsIHVzZSBpdFxuICBpZiAoZmlyc3RWaXNpYmxlTGF5ZXIubWV0YSAmJiBmaXJzdFZpc2libGVMYXllci5tZXRhLmJvdW5kcykge1xuICAgIHJldHVybiBmaXJzdFZpc2libGVMYXllci5tZXRhLmJvdW5kcztcbiAgfVxuXG4gIC8vIGlmIG5vdCwgZmluZCBhbnkgbGF5ZXIgdGhhdCBoYXMgYm91bmRcbiAgY29uc3QgYW55TGF5ZXJXQm91bmQgPSBuZXdMYXllcnMuZmluZChsID0+IGwubWV0YSAmJiBsLm1ldGEuYm91bmRzKTtcblxuICByZXR1cm4gYW55TGF5ZXJXQm91bmQgPyBhbnlMYXllcldCb3VuZC5tZXRhLmJvdW5kcyA6IG51bGw7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCBpZHgsIGxpbWl0KSB7XG4gIGNvbnN0IGxhdHMgPSBwb2ludHMubWFwKGQgPT4gQXJyYXkuaXNBcnJheShkKSAmJiBkW2lkeF0pXG4gICAgLmZpbHRlcihOdW1iZXIuaXNGaW5pdGUpLnNvcnQobnVtYmVyU29ydCk7XG5cbiAgaWYgKCFsYXRzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIHVzZSA5OSBwZXJjZW50aWxlIHRvIGZpbHRlciBvdXQgb3V0bGllcnNcbiAgLy8gY2xhbXAgdG8gbGltaXRcbiAgcmV0dXJuIFtcbiAgICBNYXRoLm1heChsYXRzW01hdGguZmxvb3IoMC4wMSAqIChsYXRzLmxlbmd0aCAtIDEpKV0sIGxpbWl0WzBdKSxcbiAgICBNYXRoLm1pbihsYXRzW01hdGguY2VpbCgwLjk5ICogKGxhdHMubGVuZ3RoIC0gMSkpXSwgbGltaXRbMV0pXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTYW1wbGVEYXRhKGRhdGEsIHNhbXBsZVNpemUgPSA1MDApIHtcbiAgY29uc3Qgc2FtcGxlU3RlcCA9IE1hdGgubWF4KE1hdGguZmxvb3IoZGF0YS5sZW5ndGggLyBzYW1wbGVTaXplKSwgMSk7XG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IHNhbXBsZVN0ZXApIHtcbiAgICBvdXRwdXQucHVzaChkYXRhW2ldKTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXliZVRvRGF0ZShpc1RpbWUsIGZpZWxkSWR4LCBmb3JtYXQsIGQpIHtcbiAgaWYgKGlzVGltZSkge1xuICAgIGlmIChub3ROdWxsb3JVbmRlZmluZWQoZFtmaWVsZElkeF0pKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGRbZmllbGRJZHhdID09PSAnc3RyaW5nJyA/XG4gICAgICAgIG1vbWVudC51dGMoZFtmaWVsZElkeF0sIGZvcm1hdCkudmFsdWVPZigpIDpcbiAgICAgICAgZm9ybWF0ID09PSAneCcgPyBkW2ZpZWxkSWR4XSAqIDEwMDAgOlxuICAgICAgICAgIGRbZmllbGRJZHhdO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGRbZmllbGRJZHhdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90TnVsbG9yVW5kZWZpbmVkKGQpIHtcbiAgcmV0dXJuIGQgIT09IHVuZGVmaW5lZCAmJiBkICE9PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaikgJiYgdHlwZW9mIG9iaiAhPT0gJ2Z1bmN0aW9uJyAmJiAhQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyU29ydChhLCBiKSB7XG4gIHJldHVybiBhIC0gYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRpbmdGdW5jdGlvbihmaWVsZFR5cGUpIHtcbiAgc3dpdGNoIChmaWVsZFR5cGUpIHtcbiAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgIHJldHVybiBudW1iZXJTb3J0O1xuICBkZWZhdWx0OlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiByb3VuZCBudW1iZXIgd2l0aCBleGFjdCBudW1iZXIgb2YgZGVjaW1hbHNcbiAqIHJldHVybiBhcyBhIHN0cmluZ1xuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHBhcmFtIHtudW1iZXJ9IGRlY2ltYWxzXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIGEgcm91bmRlZCBudW1iZXIgaW4gc3RyaW5nIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlY2lzZVJvdW5kKG51bSwgZGVjaW1hbHMpIHtcbiAgY29uc3QgdCA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XG4gIHJldHVybiAoTWF0aC5yb3VuZCgobnVtICogdCkgKyAoZGVjaW1hbHMgPiAwID8gMSA6IDApICpcbiAgICAoTWF0aC5zaWduKG51bSkgKiAoMTAgLyBNYXRoLnBvdygxMDAsIGRlY2ltYWxzKSkpKSAvIHQpLnRvRml4ZWQoZGVjaW1hbHMpO1xufVxuXG4vKipcbiAqIGdldCBudW1iZXIgb2YgZGVjaW1hbHMgdG8gcm91bmQgdG8gZm9yIHNsaWRlciBmcm9tIHN0ZXBcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIG51bWJlciBvZiBkZWNpbWFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb3VuZGluZ0RlY2ltYWxGcm9tU3RlcChzdGVwKSB7XG4gIGlmIChpc05hTihzdGVwKSkge1xuICAgIGFzc2VydCgnc3RlcCBpcyBub3QgYSBudW1iZXInKTtcbiAgICBhc3NlcnQoc3RlcCk7XG4gIH1cblxuICBjb25zdCBzcGxpdFplcm8gPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0WmVyby5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3BsaXRaZXJvWzFdLmxlbmd0aDtcbn1cblxuLyoqXG4gKiByb3VuZCB0aGUgdmFsdWUgdG8gc3RlcCBmb3IgdGhlIHNsaWRlclxuICogQHBhcmFtIHtudW1iZXJ9IG1pblZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gc3RlcFxuICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICogQHJldHVybnMge251bWJlcn0gLSByb3VuZGVkIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRWYWxUb1N0ZXAobWluVmFsdWUsIHN0ZXAsIHZhbCkge1xuICBpZiAoaXNOYU4oc3RlcCkpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgY29uc3QgZGVjaW1hbCA9IGdldFJvdW5kaW5nRGVjaW1hbEZyb21TdGVwKHN0ZXApO1xuICBjb25zdCBzdGVwcyA9IE1hdGguZmxvb3IoKHZhbCAtIG1pblZhbHVlKSAvIHN0ZXApO1xuICBsZXQgcmVtYWluID0gdmFsIC0gKHN0ZXBzICogc3RlcCArIG1pblZhbHVlKTtcblxuICAvLyBoYXMgdG8gcm91bmQgYmVjYXVzZSBqYXZhc2NyaXB0IHR1cm5zIDAuMSBpbnRvIDAuOTk5OTk5OTk5OTk5OTk4N1xuICByZW1haW4gPSBOdW1iZXIocHJlY2lzZVJvdW5kKHJlbWFpbiwgOCkpO1xuXG4gIGxldCBjbG9zZXN0O1xuICBpZiAocmVtYWluID09PSAwKSB7XG4gICAgY2xvc2VzdCA9IHZhbDtcbiAgfSBlbHNlIGlmIChyZW1haW4gPCBzdGVwIC8gMikge1xuICAgIGNsb3Nlc3QgPSBzdGVwcyAqIHN0ZXAgKyBtaW5WYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZXN0ID0gKHN0ZXBzICsgMSkgKiBzdGVwICsgbWluVmFsdWU7XG4gIH1cblxuICAvLyBwcmVjaXNlIHJvdW5kIHJldHVybiBhIHN0cmluZyByb3VuZGVkIHRvIHRoZSBkZWZpbmVkIGRlY2ltYWxcbiAgY29uc3Qgcm91bmRlZCA9IHByZWNpc2VSb3VuZChjbG9zZXN0LCBkZWNpbWFsKTtcblxuICByZXR1cm4gTnVtYmVyKHJvdW5kZWQpO1xufVxuIl19