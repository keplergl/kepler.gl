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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhLXV0aWxzLmpzIl0sIm5hbWVzIjpbInZhbGlkYXRlSW5wdXREYXRhIiwiZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUiLCJ1bmlxdWUiLCJmaW5kTWFwQm91bmRzIiwiZ2V0TGF0TG5nQm91bmRzIiwiZ2V0U2FtcGxlRGF0YSIsIm1heWJlVG9EYXRlIiwibm90TnVsbG9yVW5kZWZpbmVkIiwiaXNQbGFpbk9iamVjdCIsIm51bWJlclNvcnQiLCJnZXRTb3J0aW5nRnVuY3Rpb24iLCJwcmVjaXNlUm91bmQiLCJnZXRSb3VuZGluZ0RlY2ltYWxGcm9tU3RlcCIsInJvdW5kVmFsVG9TdGVwIiwiZGF0YSIsInByb2NlZWQiLCJBcnJheSIsImlzQXJyYXkiLCJmaWVsZHMiLCJyb3dzIiwiYWxsVmFsaWQiLCJldmVyeSIsImYiLCJpIiwibmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwiZm9ybWF0Iiwic2FtcGxlRGF0YSIsImFsbERhdGEiLCJmaWVsZE9yZGVyIiwibWFwIiwibWV0YSIsInVwZGF0ZWRGaWVsZHMiLCJzYW1wbGVDb3VudCIsInRvdGFsIiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsInNhbXBsZSIsImZvckVhY2giLCJmaWVsZCIsImZpZWxkSWR4IiwiaiIsInZhbHVlcyIsInJlc3VsdHMiLCJpbmNsdWRlcyIsInYiLCJ1bmRlZmluZWQiLCJwdXNoIiwibGF5ZXJzIiwiZGF0YUlkIiwibmV3TGF5ZXJzIiwiZmlsdGVyIiwibCIsImNvbmZpZyIsImZpcnN0VmlzaWJsZUxheWVyIiwiZmluZCIsImlzVmlzaWJsZSIsImJvdW5kcyIsImFueUxheWVyV0JvdW5kIiwicG9pbnRzIiwiaWR4IiwibGltaXQiLCJsYXRzIiwiZCIsIk51bWJlciIsImlzRmluaXRlIiwic29ydCIsIm1heCIsImZsb29yIiwiY2VpbCIsInNhbXBsZVNpemUiLCJzYW1wbGVTdGVwIiwib3V0cHV0IiwiaXNUaW1lIiwidXRjIiwidmFsdWVPZiIsIm9iaiIsIk9iamVjdCIsImEiLCJiIiwiZmllbGRUeXBlIiwicmVhbCIsImludGVnZXIiLCJ0aW1lc3RhbXAiLCJudW0iLCJkZWNpbWFscyIsInQiLCJwb3ciLCJyb3VuZCIsInNpZ24iLCJ0b0ZpeGVkIiwic3RlcCIsImlzTmFOIiwic3BsaXRaZXJvIiwidG9TdHJpbmciLCJzcGxpdCIsIm1pblZhbHVlIiwidmFsIiwiZGVjaW1hbCIsInN0ZXBzIiwicmVtYWluIiwiY2xvc2VzdCIsInJvdW5kZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBVWdCQSxpQixHQUFBQSxpQjtRQStFQUMsdUIsR0FBQUEsdUI7UUFvQ0FDLE0sR0FBQUEsTTtRQWtCQUMsYSxHQUFBQSxhO1FBd0JBQyxlLEdBQUFBLGU7UUFpQkFDLGEsR0FBQUEsYTtRQVVBQyxXLEdBQUFBLFc7UUFjQUMsa0IsR0FBQUEsa0I7UUFJQUMsYSxHQUFBQSxhO1FBTUFDLFUsR0FBQUEsVTtRQUlBQyxrQixHQUFBQSxrQjtRQWtCQUMsWSxHQUFBQSxZO1FBZ0JBQywwQixHQUFBQSwwQjtRQW9CQUMsYyxHQUFBQSxjOztBQXBSaEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7O0FBS08sU0FBU2IsaUJBQVQsQ0FBMkJjLElBQTNCLEVBQWlDO0FBQ3RDOzs7Ozs7O0FBT0EsTUFBSUMsVUFBVSxJQUFkO0FBQ0EsTUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDVCwwQkFBTyxxQ0FBUDtBQUNBQyxjQUFVLEtBQVY7QUFDRDs7QUFFRCxNQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0gsS0FBS0ksTUFBbkIsQ0FBTCxFQUFpQztBQUMvQiwwQkFBTyxtREFBUDtBQUNBSCxjQUFVLEtBQVY7QUFDRDs7QUFFRCxNQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0gsS0FBS0ssSUFBbkIsQ0FBTCxFQUErQjtBQUM3QiwwQkFBTyxpREFBUDtBQUNBSixjQUFVLEtBQVY7QUFDRDs7QUFFRCxNQUFJLENBQUNBLE9BQUwsRUFBYztBQUNa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QWQ7QUFDQSxNQUFJUyxTQUFTSCxPQUFPRSxRQUFRUixJQUFSLEdBQWVLLFFBQXRCLENBQWI7O0FBRUE7QUFDQUksV0FBU3BDLE9BQU94RCxhQUFhNEYsTUFBYixFQUFxQixDQUFyQixDQUFQLENBQVQ7O0FBRUEsTUFBSUMsZ0JBQUo7QUFDQSxNQUFJRCxXQUFXLENBQWYsRUFBa0I7QUFDaEJDLGNBQVVKLEdBQVY7QUFDRCxHQUZELE1BRU8sSUFBSUcsU0FBU1QsT0FBTyxDQUFwQixFQUF1QjtBQUM1QlUsY0FBVUYsUUFBUVIsSUFBUixHQUFlSyxRQUF6QjtBQUNELEdBRk0sTUFFQTtBQUNMSyxjQUFVLENBQUNGLFFBQVEsQ0FBVCxJQUFjUixJQUFkLEdBQXFCSyxRQUEvQjtBQUNEOztBQUVEO0FBQ0EsTUFBTU0sVUFBVTlGLGFBQWE2RixPQUFiLEVBQXNCSCxPQUF0QixDQUFoQjs7QUFFQSxTQUFPbEMsT0FBT3NDLE9BQVAsQ0FBUDtBQUNEIiwiZmlsZSI6ImRhdGEtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRGaWVsZHNGcm9tRGF0YX0gZnJvbSAncHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcbi8qKlxuICpcbiAqIEBwYXJhbSBkYXRhXG4gKiBAcmV0dXJucyB7e2FsbERhdGE6IEFycmF5LCBmaWVsZHM6IEFycmF5fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXREYXRhKGRhdGEpIHtcbiAgLypcbiAgICogZXhwZWN0ZWQgaW5wdXQgZGF0YSBmb3JtYXRcbiAgICoge1xuICAgKiAgIGZpZWxkczogW10sXG4gICAqICAgcm93czogW11cbiAgICogfVxuICAgKi9cbiAgbGV0IHByb2NlZWQgPSB0cnVlO1xuICBpZiAoIWRhdGEpIHtcbiAgICBhc3NlcnQoJ3JlY2VpdmVWaXNEYXRhOiBkYXRhIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgcHJvY2VlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuZmllbGRzKSkge1xuICAgIGFzc2VydCgncmVjZWl2ZVZpc0RhdGE6IGV4cGVjdCBkYXRhLmZpZWxkcyB0byBiZSBhbiBhcnJheScpO1xuICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnJvd3MpKSB7XG4gICAgYXNzZXJ0KCdyZWNlaXZlVmlzRGF0YTogZXhwZWN0IGRhdGEucm93cyB0byBiZSBhbiBhcnJheScpO1xuICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghcHJvY2VlZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qge2ZpZWxkcywgcm93c30gPSBkYXRhO1xuXG4gIC8vIGNoZWNrIGlmIGFsbCBmaWVsZHMgaGFzIG5hbWUsIGZvcm1hdCBhbmQgdHlwZVxuICBjb25zdCBhbGxWYWxpZCA9IGZpZWxkcy5ldmVyeSgoZiwgaSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZiAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGFzc2VydChgZmllbGRzIG5lZWRzIHRvIGJlIGFuIGFycmF5IG9mIG9iamVjdCwgYnV0IGZpbmQgJHtmfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghZi5uYW1lKSB7XG4gICAgICBhc3NlcnQoXG4gICAgICAgIGBmaWVsZC5uYW1lIGlzIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGluIGZpZWxkICR7SlNPTi5zdHJpbmdpZnkoZil9YFxuICAgICAgKTtcbiAgICAgIC8vIGFzc2lnbiBhIG5hbWVcbiAgICAgIGYubmFtZSA9IGBjb2x1bW5fJHtpfWA7XG4gICAgfVxuXG4gICAgaWYgKCFBTExfRklFTERfVFlQRVNbZi50eXBlXSkge1xuICAgICAgYXNzZXJ0KGB1bmtub3duIGZpZWxkIHR5cGUgJHtmLnR5cGV9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGYudHlwZSAmJiBmLmZvcm1hdCAmJiBmLm5hbWU7XG4gIH0pO1xuXG4gIGlmIChhbGxWYWxpZCkge1xuICAgIHJldHVybiB7cm93cywgZmllbGRzfTtcbiAgfVxuXG4gIC8vIGlmIGFueSBmaWVsZCBoYXMgbWlzc2luZyB0eXBlLCByZWNhbGN1bGF0ZSBpdCBmb3IgZXZlcnlvbmVcbiAgLy8gYmVjYXVzZSB3ZSBzaW1wbHkgbG9zdCBmYWl0aCBpbiBodW1hbml0eVxuICBjb25zdCBzYW1wbGVEYXRhID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YTogcm93c30pO1xuICBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIGNvbnN0IG1ldGEgPSBnZXRGaWVsZHNGcm9tRGF0YShzYW1wbGVEYXRhLCBmaWVsZE9yZGVyKTtcbiAgY29uc3QgdXBkYXRlZEZpZWxkcyA9IGZpZWxkcy5tYXAoKGYsIGkpID0+ICh7XG4gICAgLi4uZixcbiAgICB0eXBlOiBtZXRhW2ldLnR5cGUsXG4gICAgZm9ybWF0OiBtZXRhW2ldLmZvcm1hdFxuICB9KSk7XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3N9O1xufVxuXG4vKipcbiAqIGdldCBmaWVsZHMgZnJvbSBjc3YgZGF0YVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHthcnJheX0gYWxsRGF0YVxuICogQHBhcmFtIHthcnJheX0gc2FtcGxlQ291bnRcbiAqIEByZXR1cm5zIHthcnJheX0gZm9ybWF0dGVkIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YSwgc2FtcGxlQ291bnQgPSA1MH0pIHtcbiAgY29uc3QgdG90YWwgPSBNYXRoLm1pbihzYW1wbGVDb3VudCwgYWxsRGF0YS5sZW5ndGgpO1xuICBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG4gIGNvbnN0IHNhbXBsZSA9IHJhbmdlKDAsIHRvdGFsLCAxKS5tYXAoZCA9PiAoe30pKTtcblxuICAvLyBjb2xsZWN0IHNhbXBsZSBkYXRhIGZvciBlYWNoIGZpZWxkXG4gIGZpZWxkT3JkZXIuZm9yRWFjaCgoZmllbGQsIGZpZWxkSWR4KSA9PiB7XG4gICAgLy8gZGF0YSBjb3VudGVyXG4gICAgbGV0IGkgPSAwO1xuICAgIC8vIHNhbXBsZSBjb3VudGVyXG4gICAgbGV0IGogPSAwO1xuXG4gICAgd2hpbGUgKGogPCB0b3RhbCkge1xuICAgICAgaWYgKGkgPj0gYWxsRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgZGVwbGV0ZWQgZGF0YSBwb29sXG4gICAgICAgIHNhbXBsZVtqXVtmaWVsZF0gPSBudWxsO1xuICAgICAgICBqKys7XG4gICAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChhbGxEYXRhW2ldW2ZpZWxkSWR4XSkpIHtcbiAgICAgICAgc2FtcGxlW2pdW2ZpZWxkXSA9IGFsbERhdGFbaV1bZmllbGRJZHhdO1xuICAgICAgICBqKys7XG4gICAgICAgIGkrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzYW1wbGU7XG59XG5cbi8qKlxuICogc2ltcGxlIGdldHRpbmcgdW5pcXVlIHZhbHVlcyBvZiBhbiBhcnJheVxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICogQHJldHVybnMge2FycmF5fSB1bmlxdWUgdmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUodmFsdWVzKSB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgdmFsdWVzLmZvckVhY2godiA9PiB7XG4gICAgaWYgKCFyZXN1bHRzLmluY2x1ZGVzKHYpICYmIHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHRzLnB1c2godik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbi8qKlxuICogcmV0dXJuIGNlbnRlciBvZiBtYXAgZnJvbSBnaXZlbiBwb2ludHNcbiAqIEBwYXJhbSB7YXJyYXl9IGxheWVyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge29iamVjdH0gY29vcmRpbmF0ZXMgb2YgbWFwIGNlbnRlciwgZW1wdHkgaWYgbm90IGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWFwQm91bmRzKGxheWVycywgZGF0YUlkKSB7XG4gIC8vIGZpbmQgYm91bmRzIGluIGZvcm1hdHRlZCBsYXllckRhdGFcbiAgLy8gdXNlIGZpcnN0IGlzVmlzaWJsZSBMYXllclxuXG4gIGNvbnN0IG5ld0xheWVycyA9IGRhdGFJZFxuICAgID8gbGF5ZXJzLmZpbHRlcihsID0+IGwuY29uZmlnLmRhdGFJZCA9PT0gZGF0YUlkKVxuICAgIDogbGF5ZXJzO1xuICBjb25zdCBmaXJzdFZpc2libGVMYXllciA9IG5ld0xheWVycy5maW5kKGwgPT4gbC5jb25maWcuaXNWaXNpYmxlKTtcbiAgaWYgKCFmaXJzdFZpc2libGVMYXllcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gaWYgZmlyc3QgdmlzaWJsZSBsYXllciBoYXMgYm91bmRzLCB1c2UgaXRcbiAgaWYgKGZpcnN0VmlzaWJsZUxheWVyLm1ldGEgJiYgZmlyc3RWaXNpYmxlTGF5ZXIubWV0YS5ib3VuZHMpIHtcbiAgICByZXR1cm4gZmlyc3RWaXNpYmxlTGF5ZXIubWV0YS5ib3VuZHM7XG4gIH1cblxuICAvLyBpZiBub3QsIGZpbmQgYW55IGxheWVyIHRoYXQgaGFzIGJvdW5kXG4gIGNvbnN0IGFueUxheWVyV0JvdW5kID0gbmV3TGF5ZXJzLmZpbmQobCA9PiBsLm1ldGEgJiYgbC5tZXRhLmJvdW5kcyk7XG5cbiAgcmV0dXJuIGFueUxheWVyV0JvdW5kID8gYW55TGF5ZXJXQm91bmQubWV0YS5ib3VuZHMgOiBudWxsO1xufVxuLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgaWR4LCBsaW1pdCkge1xuICBjb25zdCBsYXRzID0gcG9pbnRzXG4gICAgLm1hcChkID0+IEFycmF5LmlzQXJyYXkoZCkgJiYgZFtpZHhdKVxuICAgIC5maWx0ZXIoTnVtYmVyLmlzRmluaXRlKVxuICAgIC5zb3J0KG51bWJlclNvcnQpO1xuXG4gIGlmICghbGF0cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyB1c2UgOTkgcGVyY2VudGlsZSB0byBmaWx0ZXIgb3V0IG91dGxpZXJzXG4gIC8vIGNsYW1wIHRvIGxpbWl0XG4gIHJldHVybiBbXG4gICAgTWF0aC5tYXgobGF0c1tNYXRoLmZsb29yKDAuMDEgKiAobGF0cy5sZW5ndGggLSAxKSldLCBsaW1pdFswXSksXG4gICAgTWF0aC5taW4obGF0c1tNYXRoLmNlaWwoMC45OSAqIChsYXRzLmxlbmd0aCAtIDEpKV0sIGxpbWl0WzFdKVxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2FtcGxlRGF0YShkYXRhLCBzYW1wbGVTaXplID0gNTAwKSB7XG4gIGNvbnN0IHNhbXBsZVN0ZXAgPSBNYXRoLm1heChNYXRoLmZsb29yKGRhdGEubGVuZ3RoIC8gc2FtcGxlU2l6ZSksIDEpO1xuICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSBzYW1wbGVTdGVwKSB7XG4gICAgb3V0cHV0LnB1c2goZGF0YVtpXSk7XG4gIH1cblxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF5YmVUb0RhdGUoaXNUaW1lLCBmaWVsZElkeCwgZm9ybWF0LCBkKSB7XG4gIGlmIChpc1RpbWUpIHtcbiAgICBpZiAobm90TnVsbG9yVW5kZWZpbmVkKGRbZmllbGRJZHhdKSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkW2ZpZWxkSWR4XSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBtb21lbnQudXRjKGRbZmllbGRJZHhdLCBmb3JtYXQpLnZhbHVlT2YoKVxuICAgICAgICA6IGZvcm1hdCA9PT0gJ3gnID8gZFtmaWVsZElkeF0gKiAxMDAwIDogZFtmaWVsZElkeF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZFtmaWVsZElkeF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3ROdWxsb3JVbmRlZmluZWQoZCkge1xuICByZXR1cm4gZCAhPT0gdW5kZWZpbmVkICYmIGQgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICByZXR1cm4gKFxuICAgIG9iaiA9PT0gT2JqZWN0KG9iaikgJiYgdHlwZW9mIG9iaiAhPT0gJ2Z1bmN0aW9uJyAmJiAhQXJyYXkuaXNBcnJheShvYmopXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJTb3J0KGEsIGIpIHtcbiAgcmV0dXJuIGEgLSBiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydGluZ0Z1bmN0aW9uKGZpZWxkVHlwZSkge1xuICBzd2l0Y2ggKGZpZWxkVHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICByZXR1cm4gbnVtYmVyU29ydDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIHJvdW5kIG51bWJlciB3aXRoIGV4YWN0IG51bWJlciBvZiBkZWNpbWFsc1xuICogcmV0dXJuIGFzIGEgc3RyaW5nXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcGFyYW0ge251bWJlcn0gZGVjaW1hbHNcbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gYSByb3VuZGVkIG51bWJlciBpbiBzdHJpbmcgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVjaXNlUm91bmQobnVtLCBkZWNpbWFscykge1xuICBjb25zdCB0ID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgcmV0dXJuIChcbiAgICBNYXRoLnJvdW5kKFxuICAgICAgbnVtICogdCArXG4gICAgICAgIChkZWNpbWFscyA+IDAgPyAxIDogMCkgKlxuICAgICAgICAgIChNYXRoLnNpZ24obnVtKSAqICgxMCAvIE1hdGgucG93KDEwMCwgZGVjaW1hbHMpKSlcbiAgICApIC8gdFxuICApLnRvRml4ZWQoZGVjaW1hbHMpO1xufVxuXG4vKipcbiAqIGdldCBudW1iZXIgb2YgZGVjaW1hbHMgdG8gcm91bmQgdG8gZm9yIHNsaWRlciBmcm9tIHN0ZXBcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIG51bWJlciBvZiBkZWNpbWFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb3VuZGluZ0RlY2ltYWxGcm9tU3RlcChzdGVwKSB7XG4gIGlmIChpc05hTihzdGVwKSkge1xuICAgIGFzc2VydCgnc3RlcCBpcyBub3QgYSBudW1iZXInKTtcbiAgICBhc3NlcnQoc3RlcCk7XG4gIH1cblxuICBjb25zdCBzcGxpdFplcm8gPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0WmVyby5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3BsaXRaZXJvWzFdLmxlbmd0aDtcbn1cblxuLyoqXG4gKiByb3VuZCB0aGUgdmFsdWUgdG8gc3RlcCBmb3IgdGhlIHNsaWRlclxuICogQHBhcmFtIHtudW1iZXJ9IG1pblZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gc3RlcFxuICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICogQHJldHVybnMge251bWJlcn0gLSByb3VuZGVkIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRWYWxUb1N0ZXAobWluVmFsdWUsIHN0ZXAsIHZhbCkge1xuICBpZiAoaXNOYU4oc3RlcCkpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgY29uc3QgZGVjaW1hbCA9IGdldFJvdW5kaW5nRGVjaW1hbEZyb21TdGVwKHN0ZXApO1xuICBjb25zdCBzdGVwcyA9IE1hdGguZmxvb3IoKHZhbCAtIG1pblZhbHVlKSAvIHN0ZXApO1xuICBsZXQgcmVtYWluID0gdmFsIC0gKHN0ZXBzICogc3RlcCArIG1pblZhbHVlKTtcblxuICAvLyBoYXMgdG8gcm91bmQgYmVjYXVzZSBqYXZhc2NyaXB0IHR1cm5zIDAuMSBpbnRvIDAuOTk5OTk5OTk5OTk5OTk4N1xuICByZW1haW4gPSBOdW1iZXIocHJlY2lzZVJvdW5kKHJlbWFpbiwgOCkpO1xuXG4gIGxldCBjbG9zZXN0O1xuICBpZiAocmVtYWluID09PSAwKSB7XG4gICAgY2xvc2VzdCA9IHZhbDtcbiAgfSBlbHNlIGlmIChyZW1haW4gPCBzdGVwIC8gMikge1xuICAgIGNsb3Nlc3QgPSBzdGVwcyAqIHN0ZXAgKyBtaW5WYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZXN0ID0gKHN0ZXBzICsgMSkgKiBzdGVwICsgbWluVmFsdWU7XG4gIH1cblxuICAvLyBwcmVjaXNlIHJvdW5kIHJldHVybiBhIHN0cmluZyByb3VuZGVkIHRvIHRoZSBkZWZpbmVkIGRlY2ltYWxcbiAgY29uc3Qgcm91bmRlZCA9IHByZWNpc2VSb3VuZChjbG9zZXN0LCBkZWNpbWFsKTtcblxuICByZXR1cm4gTnVtYmVyKHJvdW5kZWQpO1xufVxuIl19