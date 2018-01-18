'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILTER_COMPONENTS = exports.PLOT_TYPES = exports.FILTER_TYPES = exports.TimestampStepMap = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _FILTER_TYPES$timeRan, _FILTER_TYPES$range, _SupportedPlotType, _FILTER_COMPONENTS;

exports.getDefaultfilter = getDefaultfilter;
exports.getFilterProps = getFilterProps;
exports.getFieldDomain = getFieldDomain;
exports.filterData = filterData;
exports.isDataMatchFilter = isDataMatchFilter;
exports.adjustValueToFilterDomain = adjustValueToFilterDomain;
exports.getNumericFieldDomain = getNumericFieldDomain;
exports.getTimestampFieldDomain = getTimestampFieldDomain;
exports.histogramConstruct = histogramConstruct;
exports.formatNumberByStep = formatNumberByStep;
exports.isInRange = isInRange;
exports.getTimeWidgetTitleFormatter = getTimeWidgetTitleFormatter;
exports.getTimeWidgetHintFormatter = getTimeWidgetHintFormatter;
exports.isValidFilterValue = isValidFilterValue;
exports.getFilterPlot = getFilterPlot;
exports.getDefaultFilterPlotType = getDefaultFilterPlotType;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _d3Array = require('d3-array');

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _defaultSettings = require('../constants/default-settings');

var _dataUtils = require('./data-utils');

var _dataScaleUtils = require('./data-scale-utils');

var ScaleUtils = _interopRequireWildcard(_dataScaleUtils);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimestampStepMap = exports.TimestampStepMap = [{ max: 1, step: 0.05 }, { max: 10, step: 0.1 }, { max: 100, step: 1 }, { max: 500, step: 5 }, { max: 1000, step: 10 }, { max: 5000, step: 50 }, { max: Number.POSITIVE_INFINITY, step: 1000 }];

var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationYear = durationDay * 365;

var FILTER_TYPES = exports.FILTER_TYPES = (0, _keymirror2.default)({
  range: null,
  select: null,
  timeRange: null,
  multiSelect: null
});

var PLOT_TYPES = exports.PLOT_TYPES = (0, _keymirror2.default)({
  histogram: null,
  lineChart: null
});

var SupportedPlotType = (_SupportedPlotType = {}, _SupportedPlotType[FILTER_TYPES.timeRange] = (_FILTER_TYPES$timeRan = {
  default: 'histogram'
}, _FILTER_TYPES$timeRan[_defaultSettings.ALL_FIELD_TYPES.integer] = 'lineChart', _FILTER_TYPES$timeRan[_defaultSettings.ALL_FIELD_TYPES.real] = 'lineChart', _FILTER_TYPES$timeRan), _SupportedPlotType[FILTER_TYPES.range] = (_FILTER_TYPES$range = {
  default: 'histogram'
}, _FILTER_TYPES$range[_defaultSettings.ALL_FIELD_TYPES.integer] = 'lineChart', _FILTER_TYPES$range[_defaultSettings.ALL_FIELD_TYPES.real] = 'lineChart', _FILTER_TYPES$range), _SupportedPlotType);

var FILTER_COMPONENTS = exports.FILTER_COMPONENTS = (_FILTER_COMPONENTS = {}, _FILTER_COMPONENTS[FILTER_TYPES.select] = 'SingleSelectFilter', _FILTER_COMPONENTS[FILTER_TYPES.multiSelect] = 'MultiSelectFilter', _FILTER_COMPONENTS[FILTER_TYPES.timeRange] = 'TimeRangeFilter', _FILTER_COMPONENTS[FILTER_TYPES.range] = 'RangeFilter', _FILTER_COMPONENTS);

function getDefaultfilter(dataId) {
  return {
    // link to dataset Id
    dataId: dataId,
    // should allow to edit dataId
    freeze: false,
    id: (0, _utils.generateHashId)(4),
    enlarged: false,
    isAnimating: false,

    // field specific
    name: null,
    type: null,
    fieldIdx: null,
    domain: null,
    value: null,

    // plot
    plotType: PLOT_TYPES.histogram,
    yAxis: null,
    interval: null
  };
}

/**
 * Get default filter prop based on field type
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} default filter
 */
function getFilterProps(data, field) {
  var fieldType = field.type;
  var type = void 0;
  var value = void 0;

  var filterDomain = getFieldDomain(data, field);

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      type = FILTER_TYPES.range;
      var typeOptions = [FILTER_TYPES.range];
      value = filterDomain.domain;
      return (0, _extends3.default)({}, filterDomain, {
        value: value, type: type, fieldType: fieldType, typeOptions: typeOptions
      });

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      type = FILTER_TYPES.select;
      value = true;
      return (0, _extends3.default)({}, filterDomain, {
        type: type, value: value, fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:

      type = FILTER_TYPES.multiSelect;
      value = [];
      return (0, _extends3.default)({}, filterDomain, {
        type: type, value: value, fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:

      type = FILTER_TYPES.timeRange;
      value = filterDomain.domain;

      return (0, _extends3.default)({}, filterDomain, {
        type: type, value: value, fieldType: fieldType
      });

    default:
      type = fieldType;
      return (0, _extends3.default)({}, filterDomain, {
        type: type, fieldType: fieldType
      });
  }
}

/**
 * Calculate field domain based on field type and data
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} with domain as key
 */
function getFieldDomain(data, field) {
  var fieldIdx = field.tableFieldIndex - 1;
  var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;
  var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);
  var domain = void 0;

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:

      // calculate domain and step
      return getNumericFieldDomain(data, valueAccessor);

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      return { domain: [true, false] };

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:

      domain = ScaleUtils.getOrdinalDomain(data, valueAccessor);
      return { domain: domain };

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:

      return getTimestampFieldDomain(data, valueAccessor);

    default:
      return { domain: ScaleUtils.getOrdinalDomain(data, valueAccessor) };
  }
}

/**
 * Filter data based on an array of filters
 *
 * @param {Object[]} data
 * @param {string} dataId
 * @param {Object[]} filters
 * @returns {Object[]} data
 * @returns {Number[]} filteredIndex
 */
function filterData(data, dataId, filters) {

  if (!data || !dataId) {
    // why would there not be any data? are we over doing this?
    return { data: [], filteredIndex: [] };
  }

  if (!filters.length) {
    return { data: data, filteredIndex: data.map(function (d, i) {
        return i;
      }) };
  }

  var appliedFilters = filters.filter(function (d) {
    return d.dataId === dataId && d.fieldIdx > -1 && d.value !== null;
  });

  // we save a reference of allData index here to access dataToFeature
  // in geojson and hexgonId layer

  var _data$reduce = data.reduce(function (accu, d, i) {
    var matched = appliedFilters.every(function (filter) {
      return isDataMatchFilter(d, filter, i);
    });

    if (matched) {
      accu.filtered.push(d);
      accu.filteredIndex.push(i);
    }

    return accu;
  }, { filtered: [], filteredIndex: [] }),
      filtered = _data$reduce.filtered,
      filteredIndex = _data$reduce.filteredIndex;

  return { data: filtered, filteredIndex: filteredIndex };
}

/**
 * Check if value is in range of filter
 *
 * @param {Object[]} data
 * @param {Object} filter
 * @param {number} i
 * @returns {Boolean} - whether value falls in the range of the filter
 */
function isDataMatchFilter(data, filter, i) {
  var val = data[filter.fieldIdx];
  if (!filter.type) {
    return true;
  }

  switch (filter.type) {
    case FILTER_TYPES.range:
      return isInRange(val, filter.value);

    case FILTER_TYPES.timeRange:

      var timeVal = filter.mappedValue ? filter.mappedValue[i] : _moment2.default.utc(val).valueOf();
      return isInRange(timeVal, filter.value);

    case FILTER_TYPES.multiSelect:
      return filter.value.includes(val);

    case FILTER_TYPES.select:
      return filter.value === val;

    default:
      return true;
  }
}

/**
 * Call by parsing filters from URL
 * Check if value of filter within filter domain, if not adjust it to match
 * filter domain
 *
 * @param {string[] | string | number | number[]} value
 * @param {Array} filter.domain
 * @param {String} filter.type
 * @returns {*} - adjusted value to match filter or null to remove filter
 */

/* eslint-disable complexity */
function adjustValueToFilterDomain(value, _ref) {
  var domain = _ref.domain,
      type = _ref.type;


  if (!domain || !type) {
    return false;
  }

  switch (type) {
    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(function (d) {
          return d;
        });
      }

      return value.map(function (d, i) {
        return (0, _dataUtils.notNullorUndefined)(d) && isInRange(d, domain) ? d : domain[i];
      });

    case FILTER_TYPES.multiSelect:
      if (!Array.isArray(value)) {
        return [];
      }
      var filteredValue = value.filter(function (d) {
        return domain.includes(d);
      });
      return filteredValue.length ? filteredValue : [];

    case FILTER_TYPES.select:
      return domain.includes(value) ? value : true;

    default:
      return null;
  }
}
/* eslint-enable complexity */

/**
 * Calculate numeric domain and suitable step
 *
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
 */
function getNumericFieldDomain(data, valueAccessor) {
  var domain = [0, 1];
  var step = 0.1;

  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];

  if (Array.isArray(data) && data.length > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    var diff = domain[1] - domain[0];

    // in case equal domain, [96, 96], which will break quantize scale
    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  }

  var _getHistogram = getHistogram(domain, mappedValue),
      histogram = _getHistogram.histogram,
      enlargedHistogram = _getHistogram.enlargedHistogram;

  return { domain: domain, step: step, histogram: histogram, enlargedHistogram: enlargedHistogram };
}

function getNumericStepSize(diff) {
  if (diff > 100) {
    return 1;
  } else if (diff < 20 && diff > 3) {
    return 0.01;
  } else if (diff <= 3) {
    return 0.001;
  }
}

/**
 * Calculate timestamp domain and suitable step
 *
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
 */
function getTimestampFieldDomain(data, valueAccessor) {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain

  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  var domain = ScaleUtils.getLinearDomain(mappedValue);
  var step = 0.01;

  var diff = domain[1] - domain[0];
  var entry = TimestampStepMap.find(function (f) {
    return f.max >= diff;
  });
  if (entry) {
    step = entry.step;
  }

  var _getHistogram2 = getHistogram(domain, mappedValue),
      histogram = _getHistogram2.histogram,
      enlargedHistogram = _getHistogram2.enlargedHistogram;

  return { domain: domain, step: step, mappedValue: mappedValue, histogram: histogram, enlargedHistogram: enlargedHistogram };
}

function histogramConstruct(domain, mappedValue, bins) {
  return (0, _d3Array.histogram)().thresholds((0, _d3Array.ticks)(domain[0], domain[1], bins)).domain(domain)(mappedValue).map(function (bin) {
    return {
      count: bin.length,
      x0: bin.x0,
      x1: bin.x1
    };
  });
}
/**
 * Calculate histogram from domain and array of values
 *
 * @param {number[]} domain
 * @param {Object[]} mappedvalue
 * @returns {Array[]} histogram
 */
function getHistogram(domain, mappedValue) {
  var histogram = histogramConstruct(domain, mappedValue, 50);
  var enlargedHistogram = histogramConstruct(domain, mappedValue, 100);

  return { histogram: histogram, enlargedHistogram: enlargedHistogram };
}

/**
 * round number based on step
 *
 * @param {number} val
 * @param {number} step
 * @param {string} bound
 * @returns {number} rounded number
 */
function formatNumberByStep(val, step, bound) {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}

function isInRange(val, domain) {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
}

function getTimeWidgetTitleFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationYear ? 'MM/DD/YY' : diff > durationDay ? 'MM/DD hha' : 'MM/DD hh:mma';
}

function getTimeWidgetHintFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationYear ? 'MM/DD/YY' : diff > durationWeek ? 'MM/DD' : diff > durationDay ? 'MM/DD hha' : diff > durationHour ? 'hh:mma' : 'hh:mm:ssa';
}

/**
 * Sanity check on filters to prepare for save
 * @param {String} type - filter type
 * @param {*} value - filter value
 * @returns {boolean} whether filter is value
 */
function isValidFilterValue(_ref2) {
  var type = _ref2.type,
      value = _ref2.value;

  if (!type) {
    return false;
  }
  switch (type) {
    case FILTER_TYPES.select:
      return value === true || value === false;

    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(function (v) {
        return v !== null && !isNaN(v);
      });

    case FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case FILTER_TYPES.input:
      return Boolean(value.length);

    default:
      return true;

  }
}

function getFilterPlot(filter, allData) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  var mappedValue = filter.mappedValue;
  var yAxis = filter.yAxis;

  // return lineChart

  var series = allData.map(function (d, i) {
    return {
      x: mappedValue[i],
      y: d[yAxis.tableFieldIndex - 1]
    };
  }).filter(function (_ref3) {
    var x = _ref3.x,
        y = _ref3.y;
    return Number.isFinite(x) && Number.isFinite(y);
  }).sort(function (a, b) {
    return (0, _d3Array.ascending)(a.x, b.x);
  });

  var yDomain = (0, _d3Array.extent)(series, function (d) {
    return d.y;
  });
  var xDomain = [series[0].x, series[series.length - 1].x];

  return { lineChart: { series: series, yDomain: yDomain, xDomain: xDomain }, yAxis: yAxis };
}

function getDefaultFilterPlotType(filter) {

  var filterPlotTypes = SupportedPlotType[filter.type];
  if (!filterPlotTypes) {
    return null;
  }

  if (!filter.yAxis) {
    return filterPlotTypes.default;
  }

  return filterPlotTypes[filter.yAxis.type] || null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0RGVmYXVsdGZpbHRlciIsImdldEZpbHRlclByb3BzIiwiZ2V0RmllbGREb21haW4iLCJmaWx0ZXJEYXRhIiwiaXNEYXRhTWF0Y2hGaWx0ZXIiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiZ2V0VGltZXN0YW1wRmllbGREb21haW4iLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJpc0luUmFuZ2UiLCJnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIiLCJnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlciIsImlzVmFsaWRGaWx0ZXJWYWx1ZSIsImdldEZpbHRlclBsb3QiLCJnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUiLCJTY2FsZVV0aWxzIiwiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImR1cmF0aW9uU2Vjb25kIiwiZHVyYXRpb25NaW51dGUiLCJkdXJhdGlvbkhvdXIiLCJkdXJhdGlvbkRheSIsImR1cmF0aW9uV2VlayIsImR1cmF0aW9uWWVhciIsIkZJTFRFUl9UWVBFUyIsInJhbmdlIiwic2VsZWN0IiwidGltZVJhbmdlIiwibXVsdGlTZWxlY3QiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiU3VwcG9ydGVkUGxvdFR5cGUiLCJkZWZhdWx0IiwiaW50ZWdlciIsInJlYWwiLCJGSUxURVJfQ09NUE9ORU5UUyIsImRhdGFJZCIsImZyZWV6ZSIsImlkIiwiZW5sYXJnZWQiLCJpc0FuaW1hdGluZyIsIm5hbWUiLCJ0eXBlIiwiZmllbGRJZHgiLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwieUF4aXMiLCJpbnRlcnZhbCIsImRhdGEiLCJmaWVsZCIsImZpZWxkVHlwZSIsImZpbHRlckRvbWFpbiIsInR5cGVPcHRpb25zIiwiYm9vbGVhbiIsInN0cmluZyIsImRhdGUiLCJ0aW1lc3RhbXAiLCJ0YWJsZUZpZWxkSW5kZXgiLCJpc1RpbWUiLCJ2YWx1ZUFjY2Vzc29yIiwiYmluZCIsImZvcm1hdCIsImdldE9yZGluYWxEb21haW4iLCJmaWx0ZXJzIiwiZmlsdGVyZWRJbmRleCIsImxlbmd0aCIsIm1hcCIsImQiLCJpIiwiYXBwbGllZEZpbHRlcnMiLCJmaWx0ZXIiLCJyZWR1Y2UiLCJhY2N1IiwibWF0Y2hlZCIsImV2ZXJ5IiwiZmlsdGVyZWQiLCJwdXNoIiwidmFsIiwidGltZVZhbCIsIm1hcHBlZFZhbHVlIiwidXRjIiwidmFsdWVPZiIsImluY2x1ZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyZWRWYWx1ZSIsImdldExpbmVhckRvbWFpbiIsImRpZmYiLCJnZXROdW1lcmljU3RlcFNpemUiLCJnZXRIaXN0b2dyYW0iLCJlbmxhcmdlZEhpc3RvZ3JhbSIsImVudHJ5IiwiZmluZCIsImYiLCJiaW5zIiwidGhyZXNob2xkcyIsImNvdW50IiwiYmluIiwieDAiLCJ4MSIsImJvdW5kIiwiTWF0aCIsImZsb29yIiwiY2VpbCIsInYiLCJpc05hTiIsIkJvb2xlYW4iLCJpbnB1dCIsImFsbERhdGEiLCJzZXJpZXMiLCJ4IiwieSIsImlzRmluaXRlIiwic29ydCIsImEiLCJiIiwieURvbWFpbiIsInhEb21haW4iLCJmaWx0ZXJQbG90VHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUEwRGdCQSxnQixHQUFBQSxnQjtRQStCQUMsYyxHQUFBQSxjO1FBOERBQyxjLEdBQUFBLGM7UUF3Q0FDLFUsR0FBQUEsVTtRQXVDQUMsaUIsR0FBQUEsaUI7UUFzQ0FDLHlCLEdBQUFBLHlCO1FBdUNBQyxxQixHQUFBQSxxQjtRQTBDQUMsdUIsR0FBQUEsdUI7UUFtQkFDLGtCLEdBQUFBLGtCO1FBZ0NBQyxrQixHQUFBQSxrQjtRQVFBQyxTLEdBQUFBLFM7UUFRQUMsMkIsR0FBQUEsMkI7UUFVQUMsMEIsR0FB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bnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHthc2NlbmRpbmcsIGV4dGVudCwgaGlzdG9ncmFtIGFzIGQzSGlzdG9ncmFtLCB0aWNrc30gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IGtleU1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHttYXliZVRvRGF0ZSwgbm90TnVsbG9yVW5kZWZpbmVkfSBmcm9tICcuL2RhdGEtdXRpbHMnO1xuaW1wb3J0ICogYXMgU2NhbGVVdGlscyBmcm9tICcuL2RhdGEtc2NhbGUtdXRpbHMnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBUaW1lc3RhbXBTdGVwTWFwID0gW1xuICB7bWF4OiAxLCBzdGVwOiAwLjA1fSxcbiAge21heDogMTAsIHN0ZXA6IDAuMX0sXG4gIHttYXg6IDEwMCwgc3RlcDogMX0sXG4gIHttYXg6IDUwMCwgc3RlcDogNX0sXG4gIHttYXg6IDEwMDAsIHN0ZXA6IDEwfSxcbiAge21heDogNTAwMCwgc3RlcDogNTB9LFxuICB7bWF4OiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHN0ZXA6IDEwMDB9XG5dO1xuXG5jb25zdCBkdXJhdGlvblNlY29uZCA9IDEwMDA7XG5jb25zdCBkdXJhdGlvbk1pbnV0ZSA9IGR1cmF0aW9uU2Vjb25kICogNjA7XG5jb25zdCBkdXJhdGlvbkhvdXIgPSBkdXJhdGlvbk1pbnV0ZSAqIDYwO1xuY29uc3QgZHVyYXRpb25EYXkgPSBkdXJhdGlvbkhvdXIgKiAyNDtcbmNvbnN0IGR1cmF0aW9uV2VlayA9IGR1cmF0aW9uRGF5ICogNztcbmNvbnN0IGR1cmF0aW9uWWVhciA9IGR1cmF0aW9uRGF5ICogMzY1O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgcmFuZ2U6IG51bGwsXG4gIHNlbGVjdDogbnVsbCxcbiAgdGltZVJhbmdlOiBudWxsLFxuICBtdWx0aVNlbGVjdDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBQTE9UX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgaGlzdG9ncmFtOiBudWxsLFxuICBsaW5lQ2hhcnQ6IG51bGxcbn0pO1xuXG5jb25zdCBTdXBwb3J0ZWRQbG90VHlwZSA9IHtcbiAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiB7XG4gICAgZGVmYXVsdDogJ2hpc3RvZ3JhbScsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogJ2xpbmVDaGFydCcsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXTogJ2xpbmVDaGFydCdcbiAgfSxcbiAgW0ZJTFRFUl9UWVBFUy5yYW5nZV06IHtcbiAgICBkZWZhdWx0OiAnaGlzdG9ncmFtJyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiAnbGluZUNoYXJ0JyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiAnbGluZUNoYXJ0J1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0NPTVBPTkVOVFMgPSB7XG4gIFtGSUxURVJfVFlQRVMuc2VsZWN0XTogJ1NpbmdsZVNlbGVjdEZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMubXVsdGlTZWxlY3RdOiAnTXVsdGlTZWxlY3RGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnRpbWVSYW5nZV06ICdUaW1lUmFuZ2VGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnJhbmdlXTogJ1JhbmdlRmlsdGVyJ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRmaWx0ZXIoZGF0YUlkKSB7XG4gIHJldHVybiB7XG4gICAgLy8gbGluayB0byBkYXRhc2V0IElkXG4gICAgZGF0YUlkLFxuICAgIC8vIHNob3VsZCBhbGxvdyB0byBlZGl0IGRhdGFJZFxuICAgIGZyZWV6ZTogZmFsc2UsXG4gICAgaWQ6IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgIGVubGFyZ2VkOiBmYWxzZSxcbiAgICBpc0FuaW1hdGluZzogZmFsc2UsXG5cbiAgICAvLyBmaWVsZCBzcGVjaWZpY1xuICAgIG5hbWU6IG51bGwsXG4gICAgdHlwZTogbnVsbCxcbiAgICBmaWVsZElkeDogbnVsbCxcbiAgICBkb21haW46IG51bGwsXG4gICAgdmFsdWU6IG51bGwsXG5cbiAgICAvLyBwbG90XG4gICAgcGxvdFR5cGU6IFBMT1RfVFlQRVMuaGlzdG9ncmFtLFxuICAgIHlBeGlzOiBudWxsLFxuICAgIGludGVydmFsOiBudWxsXG4gIH07XG59XG5cbi8qKlxuICogR2V0IGRlZmF1bHQgZmlsdGVyIHByb3AgYmFzZWQgb24gZmllbGQgdHlwZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZFxuICogQHJldHVybnMge29iamVjdH0gZGVmYXVsdCBmaWx0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclByb3BzKGRhdGEsIGZpZWxkKSB7XG4gIGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkLnR5cGU7XG4gIGxldCB0eXBlO1xuICBsZXQgdmFsdWU7XG5cbiAgY29uc3QgZmlsdGVyRG9tYWluID0gZ2V0RmllbGREb21haW4oZGF0YSwgZmllbGQpO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5yZWFsOlxuICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgIHR5cGUgPSBGSUxURVJfVFlQRVMucmFuZ2U7XG4gICAgY29uc3QgdHlwZU9wdGlvbnMgPSBbRklMVEVSX1RZUEVTLnJhbmdlXTtcbiAgICB2YWx1ZSA9IGZpbHRlckRvbWFpbi5kb21haW47XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgIHZhbHVlLCB0eXBlLCBmaWVsZFR5cGUsIHR5cGVPcHRpb25zXG4gICAgfTtcblxuICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgIHR5cGUgPSBGSUxURVJfVFlQRVMuc2VsZWN0O1xuICAgIHZhbHVlID0gdHJ1ZTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgdHlwZSwgdmFsdWUsIGZpZWxkVHlwZVxuICAgIH07XG5cbiAgY2FzZSBBTExfRklFTERfVFlQRVMuc3RyaW5nOlxuICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5kYXRlOlxuXG4gICAgdHlwZSA9IEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDtcbiAgICB2YWx1ZSA9IFtdO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICB0eXBlLCB2YWx1ZSwgZmllbGRUeXBlXG4gICAgfTtcblxuICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG5cbiAgICB0eXBlID0gRklMVEVSX1RZUEVTLnRpbWVSYW5nZTtcbiAgICB2YWx1ZSA9IGZpbHRlckRvbWFpbi5kb21haW47XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgdHlwZSwgdmFsdWUsIGZpZWxkVHlwZVxuICAgIH07XG5cbiAgZGVmYXVsdDpcbiAgICB0eXBlID0gZmllbGRUeXBlO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICB0eXBlLCBmaWVsZFR5cGVcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIGZpZWxkIGRvbWFpbiBiYXNlZCBvbiBmaWVsZCB0eXBlIGFuZCBkYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtvYmplY3R9IGZpZWxkXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB3aXRoIGRvbWFpbiBhcyBrZXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRG9tYWluKGRhdGEsIGZpZWxkKSB7XG4gIGNvbnN0IGZpZWxkSWR4ID0gZmllbGQudGFibGVGaWVsZEluZGV4IC0gMTtcbiAgY29uc3QgaXNUaW1lID0gZmllbGQudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDtcbiAgY29uc3QgdmFsdWVBY2Nlc3NvciA9IG1heWJlVG9EYXRlLmJpbmQobnVsbCwgaXNUaW1lLCBmaWVsZElkeCwgZmllbGQuZm9ybWF0KTtcbiAgbGV0IGRvbWFpbjtcblxuICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcblxuICAgIC8vIGNhbGN1bGF0ZSBkb21haW4gYW5kIHN0ZXBcbiAgICByZXR1cm4gZ2V0TnVtZXJpY0ZpZWxkRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpO1xuXG4gIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgcmV0dXJuIHtkb21haW46IFt0cnVlLCBmYWxzZV19O1xuXG4gIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnN0cmluZzpcbiAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcblxuICAgIGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKTtcbiAgICByZXR1cm4ge2RvbWFpbn07XG5cbiAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuXG4gICAgcmV0dXJuIGdldFRpbWVzdGFtcEZpZWxkRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpO1xuXG4gIGRlZmF1bHQ6XG4gICAgcmV0dXJuIHtkb21haW46IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKX07XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBhbiBhcnJheSBvZiBmaWx0ZXJzXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtPYmplY3RbXX0gZmlsdGVyc1xuICogQHJldHVybnMge09iamVjdFtdfSBkYXRhXG4gKiBAcmV0dXJucyB7TnVtYmVyW119IGZpbHRlcmVkSW5kZXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGEoZGF0YSwgZGF0YUlkLCBmaWx0ZXJzKSB7XG5cbiAgaWYgKCFkYXRhIHx8ICFkYXRhSWQpIHtcbiAgICAvLyB3aHkgd291bGQgdGhlcmUgbm90IGJlIGFueSBkYXRhPyBhcmUgd2Ugb3ZlciBkb2luZyB0aGlzP1xuICAgIHJldHVybiB7ZGF0YTogW10sIGZpbHRlcmVkSW5kZXg6IFtdfTtcbiAgfVxuXG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4ge2RhdGEsIGZpbHRlcmVkSW5kZXg6IGRhdGEubWFwKChkLCBpKSA9PiBpKX07XG4gIH1cblxuICBjb25zdCBhcHBsaWVkRmlsdGVycyA9IGZpbHRlcnMuZmlsdGVyKGQgPT5cbiAgZC5kYXRhSWQgPT09IGRhdGFJZCAmJiBkLmZpZWxkSWR4ID4gLTEgJiYgZC52YWx1ZSAhPT0gbnVsbCk7XG5cbiAgLy8gd2Ugc2F2ZSBhIHJlZmVyZW5jZSBvZiBhbGxEYXRhIGluZGV4IGhlcmUgdG8gYWNjZXNzIGRhdGFUb0ZlYXR1cmVcbiAgLy8gaW4gZ2VvanNvbiBhbmQgaGV4Z29uSWQgbGF5ZXJcbiAgY29uc3Qge2ZpbHRlcmVkLCBmaWx0ZXJlZEluZGV4fSA9IGRhdGEucmVkdWNlKChhY2N1LCBkLCBpKSA9PiB7XG4gICAgY29uc3QgbWF0Y2hlZCA9IGFwcGxpZWRGaWx0ZXJzXG4gICAgICAuZXZlcnkoZmlsdGVyID0+IGlzRGF0YU1hdGNoRmlsdGVyKGQsIGZpbHRlciwgaSkpO1xuXG4gICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgIGFjY3UuZmlsdGVyZWQucHVzaChkKTtcbiAgICAgIGFjY3UuZmlsdGVyZWRJbmRleC5wdXNoKGkpO1xuICAgIH1cblxuICAgIHJldHVybiBhY2N1O1xuICB9LCB7ZmlsdGVyZWQ6IFtdLCBmaWx0ZXJlZEluZGV4OiBbXX0pO1xuXG4gIHJldHVybiB7ZGF0YTogZmlsdGVyZWQsIGZpbHRlcmVkSW5kZXh9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHZhbHVlIGlzIGluIHJhbmdlIG9mIGZpbHRlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSB3aGV0aGVyIHZhbHVlIGZhbGxzIGluIHRoZSByYW5nZSBvZiB0aGUgZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFNYXRjaEZpbHRlcihkYXRhLCBmaWx0ZXIsIGkpIHtcbiAgY29uc3QgdmFsID0gZGF0YVtmaWx0ZXIuZmllbGRJZHhdO1xuICBpZiAoIWZpbHRlci50eXBlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzd2l0Y2ggKGZpbHRlci50eXBlKSB7XG4gIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIHJldHVybiBpc0luUmFuZ2UodmFsLCBmaWx0ZXIudmFsdWUpO1xuXG4gIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcblxuICAgIGNvbnN0IHRpbWVWYWwgPSBmaWx0ZXIubWFwcGVkVmFsdWUgPyBmaWx0ZXIubWFwcGVkVmFsdWVbaV0gOiBtb21lbnQudXRjKHZhbCkudmFsdWVPZigpO1xuICAgIHJldHVybiBpc0luUmFuZ2UodGltZVZhbCwgZmlsdGVyLnZhbHVlKTtcblxuICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICByZXR1cm4gZmlsdGVyLnZhbHVlLmluY2x1ZGVzKHZhbCk7XG5cbiAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPT09IHZhbDtcblxuICBkZWZhdWx0OlxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQ2FsbCBieSBwYXJzaW5nIGZpbHRlcnMgZnJvbSBVUkxcbiAqIENoZWNrIGlmIHZhbHVlIG9mIGZpbHRlciB3aXRoaW4gZmlsdGVyIGRvbWFpbiwgaWYgbm90IGFkanVzdCBpdCB0byBtYXRjaFxuICogZmlsdGVyIGRvbWFpblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW10gfCBzdHJpbmcgfCBudW1iZXIgfCBudW1iZXJbXX0gdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IGZpbHRlci5kb21haW5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXIudHlwZVxuICogQHJldHVybnMgeyp9IC0gYWRqdXN0ZWQgdmFsdWUgdG8gbWF0Y2ggZmlsdGVyIG9yIG51bGwgdG8gcmVtb3ZlIGZpbHRlclxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKHZhbHVlLCB7ZG9tYWluLCB0eXBlfSkge1xuXG4gIGlmICghZG9tYWluIHx8ICF0eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggIT09IDIpIHtcbiAgICAgIHJldHVybiBkb21haW4ubWFwKGQgPT4gZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlLm1hcCgoZCwgaSkgPT5cbiAgICAgIG5vdE51bGxvclVuZGVmaW5lZChkKSAmJiBpc0luUmFuZ2UoZCwgZG9tYWluKSA/IGQgOiBkb21haW5baV0pO1xuXG4gIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyZWRWYWx1ZSA9IHZhbHVlLmZpbHRlcihkID0+IGRvbWFpbi5pbmNsdWRlcyhkKSk7XG4gICAgcmV0dXJuIGZpbHRlcmVkVmFsdWUubGVuZ3RoID8gZmlsdGVyZWRWYWx1ZSA6IFtdO1xuXG4gIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICByZXR1cm4gZG9tYWluLmluY2x1ZGVzKHZhbHVlKSA/IHZhbHVlIDogdHJ1ZTtcblxuICBkZWZhdWx0OlxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuLyoqXG4gKiBDYWxjdWxhdGUgbnVtZXJpYyBkb21haW4gYW5kIHN1aXRhYmxlIHN0ZXBcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB2YWx1ZUFjY2Vzc29yXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBkb21haW4gYW5kIHN0ZXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIGxldCBkb21haW4gPSBbMCwgMV07XG4gIGxldCBzdGVwID0gMC4xO1xuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgZG9tYWluID0gU2NhbGVVdGlscy5nZXRMaW5lYXJEb21haW4obWFwcGVkVmFsdWUpO1xuICAgIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG5cbiAgICAvLyBpbiBjYXNlIGVxdWFsIGRvbWFpbiwgWzk2LCA5Nl0sIHdoaWNoIHdpbGwgYnJlYWsgcXVhbnRpemUgc2NhbGVcbiAgICBpZiAoIWRpZmYpIHtcbiAgICAgIGRvbWFpblsxXSA9IGRvbWFpblswXSArIDE7XG4gICAgfVxuXG4gICAgc3RlcCA9IGdldE51bWVyaWNTdGVwU2l6ZShkaWZmKSB8fCBzdGVwO1xuICAgIGRvbWFpblswXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMF0sIHN0ZXAsICdmbG9vcicpO1xuICAgIGRvbWFpblsxXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMV0sIHN0ZXAsICdjZWlsJyk7XG4gIH1cblxuICBjb25zdCB7aGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX0gPSBnZXRIaXN0b2dyYW0oZG9tYWluLCBtYXBwZWRWYWx1ZSk7XG5cbiAgcmV0dXJuIHtkb21haW4sIHN0ZXAsIGhpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG5mdW5jdGlvbiBnZXROdW1lcmljU3RlcFNpemUoZGlmZikge1xuICBpZiAoZGlmZiA+IDEwMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPCAyMCAmJiBkaWZmID4gMykge1xuICAgIHJldHVybiAwLjAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPD0gMykge1xuICAgIHJldHVybiAwLjAwMTtcbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aW1lc3RhbXAgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gdmFsdWVBY2Nlc3NvclxuICogQHJldHVybnMge29iamVjdH0gZG9tYWluIGFuZCBzdGVwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIC8vIHRvIGF2b2lkIGNvbnZlcnRpbmcgc3RyaW5nIGZvcm1hdCB0aW1lIHRvIGVwb2NoXG4gIC8vIGV2ZXJ5IHRpbWUgd2UgY29tcGFyZSB3ZSBzdG9yZSBhIHZhbHVlIG1hcHBlZCB0byBpbnQgaW4gZmlsdGVyIGRvbWFpblxuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG4gIGNvbnN0IGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgbGV0IHN0ZXAgPSAwLjAxO1xuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIGNvbnN0IGVudHJ5ID0gVGltZXN0YW1wU3RlcE1hcC5maW5kKGYgPT4gZi5tYXggPj0gZGlmZik7XG4gIGlmIChlbnRyeSkge1xuICAgIHN0ZXAgPSBlbnRyeS5zdGVwO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBtYXBwZWRWYWx1ZSwgaGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgYmlucykge1xuICByZXR1cm4gZDNIaXN0b2dyYW0oKVxuICAgIC50aHJlc2hvbGRzKHRpY2tzKGRvbWFpblswXSwgZG9tYWluWzFdLCBiaW5zKSlcbiAgICAuZG9tYWluKGRvbWFpbikobWFwcGVkVmFsdWUpXG4gICAgLm1hcChiaW4gPT4gKHtcbiAgICAgIGNvdW50OiBiaW4ubGVuZ3RoLFxuICAgICAgeDA6IGJpbi54MCxcbiAgICAgIHgxOiBiaW4ueDFcbiAgICB9KSk7XG59XG4vKipcbiAqIENhbGN1bGF0ZSBoaXN0b2dyYW0gZnJvbSBkb21haW4gYW5kIGFycmF5IG9mIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGRvbWFpblxuICogQHBhcmFtIHtPYmplY3RbXX0gbWFwcGVkdmFsdWVcbiAqIEByZXR1cm5zIHtBcnJheVtdfSBoaXN0b2dyYW1cbiAqL1xuZnVuY3Rpb24gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpIHtcbiAgY29uc3QgaGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIDUwKTtcbiAgY29uc3QgZW5sYXJnZWRIaXN0b2dyYW0gPSBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgMTAwKTtcblxuICByZXR1cm4ge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19XG59XG5cbi8qKlxuICogcm91bmQgbnVtYmVyIGJhc2VkIG9uIHN0ZXBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gKiBAcGFyYW0ge251bWJlcn0gc3RlcFxuICogQHBhcmFtIHtzdHJpbmd9IGJvdW5kXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByb3VuZGVkIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TnVtYmVyQnlTdGVwKHZhbCwgc3RlcCwgYm91bmQpIHtcbiAgaWYgKGJvdW5kID09PSAnZmxvb3InKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsICogKDEgLyBzdGVwKSkgLyAoMSAvIHN0ZXApO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguY2VpbCh2YWwgKiAoMSAvIHN0ZXApKSAvICgxIC8gc3RlcCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luUmFuZ2UodmFsLCBkb21haW4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRvbWFpbikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdmFsID49IGRvbWFpblswXSAmJiB2YWwgPD0gZG9tYWluWzFdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyKGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcbiAgcmV0dXJuIGRpZmYgPiBkdXJhdGlvblllYXIgPyAnTU0vREQvWVknIDpcbiAgICBkaWZmID4gZHVyYXRpb25EYXkgPyAnTU0vREQgaGhhJyA6ICdNTS9ERCBoaDptbWEnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uWWVhciA/ICdNTS9ERC9ZWScgOlxuICAgIGRpZmYgPiBkdXJhdGlvbldlZWsgPyAnTU0vREQnIDpcbiAgICBkaWZmID4gZHVyYXRpb25EYXkgPyAnTU0vREQgaGhhJyA6XG4gICAgZGlmZiA+IGR1cmF0aW9uSG91ciA/ICdoaDptbWEnIDpcbiAgICAgICdoaDptbTpzc2EnXG59XG5cbi8qKlxuICogU2FuaXR5IGNoZWNrIG9uIGZpbHRlcnMgdG8gcHJlcGFyZSBmb3Igc2F2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBmaWx0ZXIgdHlwZVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIGZpbHRlciB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHdoZXRoZXIgZmlsdGVyIGlzIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVmFsdWUoe3R5cGUsIHZhbHVlfSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuXG4gIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KHYgPT4gdiAhPT0gbnVsbCAmJiAhaXNOYU4odikpO1xuXG4gIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBCb29sZWFuKHZhbHVlLmxlbmd0aCk7XG5cbiAgY2FzZSBGSUxURVJfVFlQRVMuaW5wdXQ6XG4gICAgcmV0dXJuIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICBkZWZhdWx0OlxuICAgIHJldHVybiB0cnVlO1xuXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclBsb3QoZmlsdGVyLCBhbGxEYXRhKSB7XG4gIGlmIChmaWx0ZXIucGxvdFR5cGUgPT09IFBMT1RfVFlQRVMuaGlzdG9ncmFtIHx8ICFmaWx0ZXIueUF4aXMpIHtcbiAgICAvLyBoaXN0b2dyYW0gc2hvdWxkIGJlIGNhbGN1bGF0ZWQgd2hlbiBjcmVhdGUgZmlsdGVyXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3Qge21hcHBlZFZhbHVlfSA9IGZpbHRlcjtcbiAgY29uc3Qge3lBeGlzfSA9IGZpbHRlcjtcblxuICAvLyByZXR1cm4gbGluZUNoYXJ0XG4gIGNvbnN0IHNlcmllcyA9IGFsbERhdGEubWFwKChkLCBpKSA9PiAoe1xuICAgIHg6IG1hcHBlZFZhbHVlW2ldLFxuICAgIHk6IGRbeUF4aXMudGFibGVGaWVsZEluZGV4IC0gMV1cbiAgfSkpXG4gICAgLmZpbHRlcigoe3gsIHl9KSA9PiBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhc2NlbmRpbmcoYS54LCBiLngpKTtcblxuICBjb25zdCB5RG9tYWluID0gZXh0ZW50KHNlcmllcywgZCA9PiBkLnkpO1xuICBjb25zdCB4RG9tYWluID0gW3Nlcmllc1swXS54LCBzZXJpZXNbc2VyaWVzLmxlbmd0aCAtIDFdLnhdO1xuXG4gIHJldHVybiB7bGluZUNoYXJ0OiB7c2VyaWVzLCB5RG9tYWluLCB4RG9tYWlufSwgeUF4aXN9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKGZpbHRlcikge1xuXG4gIGNvbnN0IGZpbHRlclBsb3RUeXBlcyA9IFN1cHBvcnRlZFBsb3RUeXBlW2ZpbHRlci50eXBlXTtcbiAgaWYgKCFmaWx0ZXJQbG90VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyLnlBeGlzKSB7XG4gICAgcmV0dXJuIGZpbHRlclBsb3RUeXBlcy5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlclBsb3RUeXBlc1tmaWx0ZXIueUF4aXMudHlwZV0gfHwgbnVsbDtcbn1cbiJdfQ==