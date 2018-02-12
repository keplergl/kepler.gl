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
 * @param data
 * @returns {{allData: Array, fields: Array}}
 */
function validateInputData(data) {
  // TODO: add test
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
  } else if (!Array.isArray(data.fields)) {
    (0, _assert2.default)('receiveVisData: expect data.fields to be an array');
    proceed = false;
  } else if (!Array.isArray(data.rows)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhLXV0aWxzLmpzIl0sIm5hbWVzIjpbInZhbGlkYXRlSW5wdXREYXRhIiwiZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUiLCJ1bmlxdWUiLCJmaW5kTWFwQm91bmRzIiwiZ2V0TGF0TG5nQm91bmRzIiwiZ2V0U2FtcGxlRGF0YSIsIm1heWJlVG9EYXRlIiwibm90TnVsbG9yVW5kZWZpbmVkIiwiaXNQbGFpbk9iamVjdCIsIm51bWJlclNvcnQiLCJnZXRTb3J0aW5nRnVuY3Rpb24iLCJwcmVjaXNlUm91bmQiLCJnZXRSb3VuZGluZ0RlY2ltYWxGcm9tU3RlcCIsInJvdW5kVmFsVG9TdGVwIiwiZGF0YSIsInByb2NlZWQiLCJBcnJheSIsImlzQXJyYXkiLCJmaWVsZHMiLCJyb3dzIiwiYWxsVmFsaWQiLCJldmVyeSIsImYiLCJpIiwibmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwiZm9ybWF0Iiwic2FtcGxlRGF0YSIsImFsbERhdGEiLCJmaWVsZE9yZGVyIiwibWFwIiwibWV0YSIsInVwZGF0ZWRGaWVsZHMiLCJzYW1wbGVDb3VudCIsInRvdGFsIiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsInNhbXBsZSIsImZvckVhY2giLCJmaWVsZCIsImZpZWxkSWR4IiwiaiIsInZhbHVlcyIsInJlc3VsdHMiLCJpbmNsdWRlcyIsInYiLCJ1bmRlZmluZWQiLCJwdXNoIiwibGF5ZXJzIiwiZGF0YUlkIiwibmV3TGF5ZXJzIiwiZmlsdGVyIiwibCIsImNvbmZpZyIsImZpcnN0VmlzaWJsZUxheWVyIiwiZmluZCIsImlzVmlzaWJsZSIsImJvdW5kcyIsImFueUxheWVyV0JvdW5kIiwicG9pbnRzIiwiaWR4IiwibGltaXQiLCJsYXRzIiwiZCIsIk51bWJlciIsImlzRmluaXRlIiwic29ydCIsIm1heCIsImZsb29yIiwiY2VpbCIsInNhbXBsZVNpemUiLCJzYW1wbGVTdGVwIiwib3V0cHV0IiwiaXNUaW1lIiwidXRjIiwidmFsdWVPZiIsIm9iaiIsIk9iamVjdCIsImEiLCJiIiwiZmllbGRUeXBlIiwicmVhbCIsImludGVnZXIiLCJ0aW1lc3RhbXAiLCJudW0iLCJkZWNpbWFscyIsInQiLCJwb3ciLCJyb3VuZCIsInNpZ24iLCJ0b0ZpeGVkIiwic3RlcCIsImlzTmFOIiwic3BsaXRaZXJvIiwidG9TdHJpbmciLCJzcGxpdCIsIm1pblZhbHVlIiwidmFsIiwiZGVjaW1hbCIsInN0ZXBzIiwicmVtYWluIiwiY2xvc2VzdCIsInJvdW5kZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBU2dCQSxpQixHQUFBQSxpQjtRQTRFQUMsdUIsR0FBQUEsdUI7UUFvQ0FDLE0sR0FBQUEsTTtRQWtCQUMsYSxHQUFBQSxhO1FBd0JBQyxlLEdBQUFBLGU7UUFpQkFDLGEsR0FBQUEsYTtRQVVBQyxXLEdBQUFBLFc7UUFjQUMsa0IsR0FBQUEsa0I7UUFJQUMsYSxHQUFBQSxhO1FBTUFDLFUsR0FBQUEsVTtRQUlBQyxrQixHQUFBQSxrQjtRQWtCQUMsWSxHQUFBQSxZO1FBZ0JBQywwQixHQUFBQSwwQjtRQW9CQUMsYyxHQUFBQSxjOztBQWhSaEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFJTyxTQUFTYixpQkFBVCxDQUEyQmMsSUFBM0IsRUFBaUM7QUFDdEM7QUFDQTs7Ozs7OztBQU9BLE1BQUlDLFVBQVUsSUFBZDtBQUNBLE1BQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1QsMEJBQU8scUNBQVA7QUFDQUMsY0FBVSxLQUFWO0FBQ0QsR0FIRCxNQUdPLElBQUksQ0FBQ0MsTUFBTUMsT0FBTixDQUFjSCxLQUFLSSxNQUFuQixDQUFMLEVBQWlDO0FBQ3RDLDBCQUFPLG1EQUFQO0FBQ0FILGNBQVUsS0FBVjtBQUNELEdBSE0sTUFHQSxJQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0gsS0FBS0ssSUFBbkIsQ0FBTCxFQUErQjtBQUNwQywwQkFBTyxpREFBUDtBQUNBSixjQUFVLEtBQVY7QUFDRDs7QUFFRCxNQUFJLENBQUNBLE9B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bUJMLElBQTlCLENBQWQ7QUFDQSxNQUFJUyxTQUFTSCxPQUFPRSxRQUFRUixJQUFSLEdBQWVLLFFBQXRCLENBQWI7O0FBRUE7QUFDQUksV0FBU3BDLE9BQU94RCxhQUFhNEYsTUFBYixFQUFxQixDQUFyQixDQUFQLENBQVQ7O0FBRUEsTUFBSUMsZ0JBQUo7QUFDQSxNQUFJRCxXQUFXLENBQWYsRUFBa0I7QUFDaEJDLGNBQVVKLEdBQVY7QUFDRCxHQUZELE1BRU8sSUFBSUcsU0FBU1QsT0FBTyxDQUFwQixFQUF1QjtBQUM1QlUsY0FBVUYsUUFBUVIsSUFBUixHQUFlSyxRQUF6QjtBQUNELEdBRk0sTUFFQTtBQUNMSyxjQUFVLENBQUNGLFFBQVEsQ0FBVCxJQUFjUixJQUFkLEdBQXFCSyxRQUEvQjtBQUNEOztBQUVEO0FBQ0EsTUFBTU0sVUFBVTlGLGFBQWE2RixPQUFiLEVBQXNCSCxPQUF0QixDQUFoQjs7QUFFQSxTQUFPbEMsT0FBT3NDLE9BQVAsQ0FBUDtBQUNEIiwiZmlsZSI6ImRhdGEtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRGaWVsZHNGcm9tRGF0YX0gZnJvbSAncHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcbi8qKlxuICogQHBhcmFtIGRhdGFcbiAqIEByZXR1cm5zIHt7YWxsRGF0YTogQXJyYXksIGZpZWxkczogQXJyYXl9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dERhdGEoZGF0YSkge1xuICAvLyBUT0RPOiBhZGQgdGVzdFxuICAvKlxuICAgKiBleHBlY3RlZCBpbnB1dCBkYXRhIGZvcm1hdFxuICAgKiB7XG4gICAqICAgZmllbGRzOiBbXSxcbiAgICogICByb3dzOiBbXVxuICAgKiB9XG4gICAqL1xuICBsZXQgcHJvY2VlZCA9IHRydWU7XG4gIGlmICghZGF0YSkge1xuICAgIGFzc2VydCgncmVjZWl2ZVZpc0RhdGE6IGRhdGEgY2Fubm90IGJlIG51bGwnKTtcbiAgICBwcm9jZWVkID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5maWVsZHMpKSB7XG4gICAgYXNzZXJ0KCdyZWNlaXZlVmlzRGF0YTogZXhwZWN0IGRhdGEuZmllbGRzIHRvIGJlIGFuIGFycmF5Jyk7XG4gICAgcHJvY2VlZCA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucm93cykpIHtcbiAgICBhc3NlcnQoJ3JlY2VpdmVWaXNEYXRhOiBleHBlY3QgZGF0YS5yb3dzIHRvIGJlIGFuIGFycmF5Jyk7XG4gICAgcHJvY2VlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCFwcm9jZWVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7ZmllbGRzLCByb3dzfSA9IGRhdGE7XG5cbiAgLy8gY2hlY2sgaWYgYWxsIGZpZWxkcyBoYXMgbmFtZSwgZm9ybWF0IGFuZCB0eXBlXG4gIGNvbnN0IGFsbFZhbGlkID0gZmllbGRzLmV2ZXJ5KChmLCBpKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBmICE9PSAnb2JqZWN0Jykge1xuICAgICAgYXNzZXJ0KGBmaWVsZHMgbmVlZHMgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqZWN0LCBidXQgZmluZCAke2Z9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFmLm5hbWUpIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgYGZpZWxkLm5hbWUgaXMgcmVxdWlyZWQgYnV0IG1pc3NpbmcgaW4gZmllbGQgJHtKU09OLnN0cmluZ2lmeShmKX1gXG4gICAgICApO1xuICAgICAgLy8gYXNzaWduIGEgbmFtZVxuICAgICAgZi5uYW1lID0gYGNvbHVtbl8ke2l9YDtcbiAgICB9XG5cbiAgICBpZiAoIUFMTF9GSUVMRF9UWVBFU1tmLnR5cGVdKSB7XG4gICAgICBhc3NlcnQoYHVua25vd24gZmllbGQgdHlwZSAke2YudHlwZX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZi50eXBlICYmIGYuZm9ybWF0ICYmIGYubmFtZTtcbiAgfSk7XG5cbiAgaWYgKGFsbFZhbGlkKSB7XG4gICAgcmV0dXJuIHtyb3dzLCBmaWVsZHN9O1xuICB9XG5cbiAgLy8gaWYgYW55IGZpZWxkIGhhcyBtaXNzaW5nIHR5cGUsIHJlY2FsY3VsYXRlIGl0IGZvciBldmVyeW9uZVxuICAvLyBiZWNhdXNlIHdlIHNpbXBseSBsb3N0IGZhaXRoIGluIGh1bWFuaXR5XG4gIGNvbnN0IHNhbXBsZURhdGEgPSBnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZSh7ZmllbGRzLCBhbGxEYXRhOiByb3dzfSk7XG4gIGNvbnN0IGZpZWxkT3JkZXIgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKTtcbiAgY29uc3QgbWV0YSA9IGdldEZpZWxkc0Zyb21EYXRhKHNhbXBsZURhdGEsIGZpZWxkT3JkZXIpO1xuICBjb25zdCB1cGRhdGVkRmllbGRzID0gZmllbGRzLm1hcCgoZiwgaSkgPT4gKHtcbiAgICAuLi5mLFxuICAgIHR5cGU6IG1ldGFbaV0udHlwZSxcbiAgICBmb3JtYXQ6IG1ldGFbaV0uZm9ybWF0XG4gIH0pKTtcblxuICByZXR1cm4ge2ZpZWxkczogdXBkYXRlZEZpZWxkcywgcm93c307XG59XG5cbi8qKlxuICogZ2V0IGZpZWxkcyBmcm9tIGNzdiBkYXRhXG4gKlxuICogQHBhcmFtIHthcnJheX0gZmllbGRzXG4gKiBAcGFyYW0ge2FycmF5fSBhbGxEYXRhXG4gKiBAcGFyYW0ge2FycmF5fSBzYW1wbGVDb3VudFxuICogQHJldHVybnMge2FycmF5fSBmb3JtYXR0ZWQgZmllbGRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZSh7ZmllbGRzLCBhbGxEYXRhLCBzYW1wbGVDb3VudCA9IDUwfSkge1xuICBjb25zdCB0b3RhbCA9IE1hdGgubWluKHNhbXBsZUNvdW50LCBhbGxEYXRhLmxlbmd0aCk7XG4gIGNvbnN0IGZpZWxkT3JkZXIgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKTtcbiAgY29uc3Qgc2FtcGxlID0gcmFuZ2UoMCwgdG90YWwsIDEpLm1hcChkID0+ICh7fSkpO1xuXG4gIC8vIGNvbGxlY3Qgc2FtcGxlIGRhdGEgZm9yIGVhY2ggZmllbGRcbiAgZmllbGRPcmRlci5mb3JFYWNoKChmaWVsZCwgZmllbGRJZHgpID0+IHtcbiAgICAvLyBkYXRhIGNvdW50ZXJcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gc2FtcGxlIGNvdW50ZXJcbiAgICBsZXQgaiA9IDA7XG5cbiAgICB3aGlsZSAoaiA8IHRvdGFsKSB7XG4gICAgICBpZiAoaSA+PSBhbGxEYXRhLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBkZXBsZXRlZCBkYXRhIHBvb2xcbiAgICAgICAgc2FtcGxlW2pdW2ZpZWxkXSA9IG51bGw7XG4gICAgICAgIGorKztcbiAgICAgIH0gZWxzZSBpZiAobm90TnVsbG9yVW5kZWZpbmVkKGFsbERhdGFbaV1bZmllbGRJZHhdKSkge1xuICAgICAgICBzYW1wbGVbal1bZmllbGRdID0gYWxsRGF0YVtpXVtmaWVsZElkeF07XG4gICAgICAgIGorKztcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNhbXBsZTtcbn1cblxuLyoqXG4gKiBzaW1wbGUgZ2V0dGluZyB1bmlxdWUgdmFsdWVzIG9mIGFuIGFycmF5XG4gKlxuICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gKiBAcmV0dXJucyB7YXJyYXl9IHVuaXF1ZSB2YWx1ZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZSh2YWx1ZXMpIHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICB2YWx1ZXMuZm9yRWFjaCh2ID0+IHtcbiAgICBpZiAoIXJlc3VsdHMuaW5jbHVkZXModikgJiYgdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdHMucHVzaCh2KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuLyoqXG4gKiByZXR1cm4gY2VudGVyIG9mIG1hcCBmcm9tIGdpdmVuIHBvaW50c1xuICogQHBhcmFtIHthcnJheX0gbGF5ZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YUlkXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBjb29yZGluYXRlcyBvZiBtYXAgY2VudGVyLCBlbXB0eSBpZiBub3QgZm91bmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNYXBCb3VuZHMobGF5ZXJzLCBkYXRhSWQpIHtcbiAgLy8gZmluZCBib3VuZHMgaW4gZm9ybWF0dGVkIGxheWVyRGF0YVxuICAvLyB1c2UgZmlyc3QgaXNWaXNpYmxlIExheWVyXG5cbiAgY29uc3QgbmV3TGF5ZXJzID0gZGF0YUlkXG4gICAgPyBsYXllcnMuZmlsdGVyKGwgPT4gbC5jb25maWcuZGF0YUlkID09PSBkYXRhSWQpXG4gICAgOiBsYXllcnM7XG4gIGNvbnN0IGZpcnN0VmlzaWJsZUxheWVyID0gbmV3TGF5ZXJzLmZpbmQobCA9PiBsLmNvbmZpZy5pc1Zpc2libGUpO1xuICBpZiAoIWZpcnN0VmlzaWJsZUxheWVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBpZiBmaXJzdCB2aXNpYmxlIGxheWVyIGhhcyBib3VuZHMsIHVzZSBpdFxuICBpZiAoZmlyc3RWaXNpYmxlTGF5ZXIubWV0YSAmJiBmaXJzdFZpc2libGVMYXllci5tZXRhLmJvdW5kcykge1xuICAgIHJldHVybiBmaXJzdFZpc2libGVMYXllci5tZXRhLmJvdW5kcztcbiAgfVxuXG4gIC8vIGlmIG5vdCwgZmluZCBhbnkgbGF5ZXIgdGhhdCBoYXMgYm91bmRcbiAgY29uc3QgYW55TGF5ZXJXQm91bmQgPSBuZXdMYXllcnMuZmluZChsID0+IGwubWV0YSAmJiBsLm1ldGEuYm91bmRzKTtcblxuICByZXR1cm4gYW55TGF5ZXJXQm91bmQgPyBhbnlMYXllcldCb3VuZC5tZXRhLmJvdW5kcyA6IG51bGw7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCBpZHgsIGxpbWl0KSB7XG4gIGNvbnN0IGxhdHMgPSBwb2ludHNcbiAgICAubWFwKGQgPT4gQXJyYXkuaXNBcnJheShkKSAmJiBkW2lkeF0pXG4gICAgLmZpbHRlcihOdW1iZXIuaXNGaW5pdGUpXG4gICAgLnNvcnQobnVtYmVyU29ydCk7XG5cbiAgaWYgKCFsYXRzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIHVzZSA5OSBwZXJjZW50aWxlIHRvIGZpbHRlciBvdXQgb3V0bGllcnNcbiAgLy8gY2xhbXAgdG8gbGltaXRcbiAgcmV0dXJuIFtcbiAgICBNYXRoLm1heChsYXRzW01hdGguZmxvb3IoMC4wMSAqIChsYXRzLmxlbmd0aCAtIDEpKV0sIGxpbWl0WzBdKSxcbiAgICBNYXRoLm1pbihsYXRzW01hdGguY2VpbCgwLjk5ICogKGxhdHMubGVuZ3RoIC0gMSkpXSwgbGltaXRbMV0pXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTYW1wbGVEYXRhKGRhdGEsIHNhbXBsZVNpemUgPSA1MDApIHtcbiAgY29uc3Qgc2FtcGxlU3RlcCA9IE1hdGgubWF4KE1hdGguZmxvb3IoZGF0YS5sZW5ndGggLyBzYW1wbGVTaXplKSwgMSk7XG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IHNhbXBsZVN0ZXApIHtcbiAgICBvdXRwdXQucHVzaChkYXRhW2ldKTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXliZVRvRGF0ZShpc1RpbWUsIGZpZWxkSWR4LCBmb3JtYXQsIGQpIHtcbiAgaWYgKGlzVGltZSkge1xuICAgIGlmIChub3ROdWxsb3JVbmRlZmluZWQoZFtmaWVsZElkeF0pKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGRbZmllbGRJZHhdID09PSAnc3RyaW5nJ1xuICAgICAgICA/IG1vbWVudC51dGMoZFtmaWVsZElkeF0sIGZvcm1hdCkudmFsdWVPZigpXG4gICAgICAgIDogZm9ybWF0ID09PSAneCcgPyBkW2ZpZWxkSWR4XSAqIDEwMDAgOiBkW2ZpZWxkSWR4XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBkW2ZpZWxkSWR4XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdE51bGxvclVuZGVmaW5lZChkKSB7XG4gIHJldHVybiBkICE9PSB1bmRlZmluZWQgJiYgZCAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIHJldHVybiAoXG4gICAgb2JqID09PSBPYmplY3Qob2JqKSAmJiB0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nICYmICFBcnJheS5pc0FycmF5KG9iailcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclNvcnQoYSwgYikge1xuICByZXR1cm4gYSAtIGI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0aW5nRnVuY3Rpb24oZmllbGRUeXBlKSB7XG4gIHN3aXRjaCAoZmllbGRUeXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJldHVybiBudW1iZXJTb3J0O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogcm91bmQgbnVtYmVyIHdpdGggZXhhY3QgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiByZXR1cm4gYXMgYSBzdHJpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWNpbWFsc1xuICogQHJldHVybnMge3N0cmluZ30gLSBhIHJvdW5kZWQgbnVtYmVyIGluIHN0cmluZyBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWNpc2VSb3VuZChudW0sIGRlY2ltYWxzKSB7XG4gIGNvbnN0IHQgPSBNYXRoLnBvdygxMCwgZGVjaW1hbHMpO1xuICByZXR1cm4gKFxuICAgIE1hdGgucm91bmQoXG4gICAgICBudW0gKiB0ICtcbiAgICAgICAgKGRlY2ltYWxzID4gMCA/IDEgOiAwKSAqXG4gICAgICAgICAgKE1hdGguc2lnbihudW0pICogKDEwIC8gTWF0aC5wb3coMTAwLCBkZWNpbWFscykpKVxuICAgICkgLyB0XG4gICkudG9GaXhlZChkZWNpbWFscyk7XG59XG5cbi8qKlxuICogZ2V0IG51bWJlciBvZiBkZWNpbWFscyB0byByb3VuZCB0byBmb3Igc2xpZGVyIGZyb20gc3RlcFxuICogQHBhcmFtIHtudW1iZXJ9IHN0ZXBcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gbnVtYmVyIG9mIGRlY2ltYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJvdW5kaW5nRGVjaW1hbEZyb21TdGVwKHN0ZXApIHtcbiAgaWYgKGlzTmFOKHN0ZXApKSB7XG4gICAgYXNzZXJ0KCdzdGVwIGlzIG5vdCBhIG51bWJlcicpO1xuICAgIGFzc2VydChzdGVwKTtcbiAgfVxuXG4gIGNvbnN0IHNwbGl0WmVybyA9IHN0ZXAudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICBpZiAoc3BsaXRaZXJvLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiBzcGxpdFplcm9bMV0ubGVuZ3RoO1xufVxuXG4vKipcbiAqIHJvdW5kIHRoZSB2YWx1ZSB0byBzdGVwIGZvciB0aGUgc2xpZGVyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluVmFsdWVcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIHJvdW5kZWQgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFZhbFRvU3RlcChtaW5WYWx1ZSwgc3RlcCwgdmFsKSB7XG4gIGlmIChpc05hTihzdGVwKSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBjb25zdCBkZWNpbWFsID0gZ2V0Um91bmRpbmdEZWNpbWFsRnJvbVN0ZXAoc3RlcCk7XG4gIGNvbnN0IHN0ZXBzID0gTWF0aC5mbG9vcigodmFsIC0gbWluVmFsdWUpIC8gc3RlcCk7XG4gIGxldCByZW1haW4gPSB2YWwgLSAoc3RlcHMgKiBzdGVwICsgbWluVmFsdWUpO1xuXG4gIC8vIGhhcyB0byByb3VuZCBiZWNhdXNlIGphdmFzY3JpcHQgdHVybnMgMC4xIGludG8gMC45OTk5OTk5OTk5OTk5OTg3XG4gIHJlbWFpbiA9IE51bWJlcihwcmVjaXNlUm91bmQocmVtYWluLCA4KSk7XG5cbiAgbGV0IGNsb3Nlc3Q7XG4gIGlmIChyZW1haW4gPT09IDApIHtcbiAgICBjbG9zZXN0ID0gdmFsO1xuICB9IGVsc2UgaWYgKHJlbWFpbiA8IHN0ZXAgLyAyKSB7XG4gICAgY2xvc2VzdCA9IHN0ZXBzICogc3RlcCArIG1pblZhbHVlO1xuICB9IGVsc2Uge1xuICAgIGNsb3Nlc3QgPSAoc3RlcHMgKyAxKSAqIHN0ZXAgKyBtaW5WYWx1ZTtcbiAgfVxuXG4gIC8vIHByZWNpc2Ugcm91bmQgcmV0dXJuIGEgc3RyaW5nIHJvdW5kZWQgdG8gdGhlIGRlZmluZWQgZGVjaW1hbFxuICBjb25zdCByb3VuZGVkID0gcHJlY2lzZVJvdW5kKGNsb3Nlc3QsIGRlY2ltYWwpO1xuXG4gIHJldHVybiBOdW1iZXIocm91bmRlZCk7XG59XG4iXX0=