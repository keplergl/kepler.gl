'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIME_ANIMATION_SPEED = exports.BASE_SPEED = exports.FILTER_COMPONENTS = exports.PLOT_TYPES = exports.FILTER_TYPES = exports.enlargedHistogramBins = exports.histogramBins = exports.TimestampStepMap = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var histogramBins = exports.histogramBins = 30;
var enlargedHistogramBins = exports.enlargedHistogramBins = 100;

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

var SupportedPlotType = (_SupportedPlotType = {}, (0, _defineProperty3.default)(_SupportedPlotType, FILTER_TYPES.timeRange, (_FILTER_TYPES$timeRan = {
  default: 'histogram'
}, (0, _defineProperty3.default)(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty3.default)(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$timeRan)), (0, _defineProperty3.default)(_SupportedPlotType, FILTER_TYPES.range, (_FILTER_TYPES$range = {
  default: 'histogram'
}, (0, _defineProperty3.default)(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty3.default)(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$range)), _SupportedPlotType);

var FILTER_COMPONENTS = exports.FILTER_COMPONENTS = (_FILTER_COMPONENTS = {}, (0, _defineProperty3.default)(_FILTER_COMPONENTS, FILTER_TYPES.select, 'SingleSelectFilter'), (0, _defineProperty3.default)(_FILTER_COMPONENTS, FILTER_TYPES.multiSelect, 'MultiSelectFilter'), (0, _defineProperty3.default)(_FILTER_COMPONENTS, FILTER_TYPES.timeRange, 'TimeRangeFilter'), (0, _defineProperty3.default)(_FILTER_COMPONENTS, FILTER_TYPES.range, 'RangeFilter'), _FILTER_COMPONENTS);

var BASE_SPEED = exports.BASE_SPEED = 600;
var TIME_ANIMATION_SPEED = exports.TIME_ANIMATION_SPEED = [{
  label: '1x',
  value: 1
}, {
  label: '2x',
  value: 2
}, {
  label: '4x',
  value: 4
}];

function getDefaultfilter(dataId) {
  return {
    // link to dataset Id
    dataId: dataId,
    // should allow to edit dataId
    freeze: false,
    id: (0, _utils.generateHashId)(4),
    enlarged: false,
    isAnimating: false,
    speed: 1,

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
        value: value,
        type: type,
        fieldType: fieldType,
        typeOptions: typeOptions
      });

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      type = FILTER_TYPES.select;
      value = true;
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      type = FILTER_TYPES.multiSelect;
      value = [];
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      type = FILTER_TYPES.timeRange;
      value = filterDomain.domain;

      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    default:
      type = fieldType;
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        fieldType: fieldType
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
 * @param {Object[]} mappedValue
 * @returns {Array[]} histogram
 */
function getHistogram(domain, mappedValue) {
  var histogram = histogramConstruct(domain, mappedValue, histogramBins);
  var enlargedHistogram = histogramConstruct(domain, mappedValue, enlargedHistogramBins);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0RGVmYXVsdGZpbHRlciIsImdldEZpbHRlclByb3BzIiwiZ2V0RmllbGREb21haW4iLCJmaWx0ZXJEYXRhIiwiaXNEYXRhTWF0Y2hGaWx0ZXIiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiZ2V0VGltZXN0YW1wRmllbGREb21haW4iLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJpc0luUmFuZ2UiLCJnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIiLCJnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlciIsImlzVmFsaWRGaWx0ZXJWYWx1ZSIsImdldEZpbHRlclBsb3QiLCJnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUiLCJTY2FsZVV0aWxzIiwiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImhpc3RvZ3JhbUJpbnMiLCJlbmxhcmdlZEhpc3RvZ3JhbUJpbnMiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJkdXJhdGlvblllYXIiLCJGSUxURVJfVFlQRVMiLCJyYW5nZSIsInNlbGVjdCIsInRpbWVSYW5nZSIsIm11bHRpU2VsZWN0IiwiUExPVF9UWVBFUyIsImhpc3RvZ3JhbSIsImxpbmVDaGFydCIsIlN1cHBvcnRlZFBsb3RUeXBlIiwiZGVmYXVsdCIsImludGVnZXIiLCJyZWFsIiwiRklMVEVSX0NPTVBPTkVOVFMiLCJCQVNFX1NQRUVEIiwiVElNRV9BTklNQVRJT05fU1BFRUQiLCJsYWJlbCIsInZhbHVlIiwiZGF0YUlkIiwiZnJlZXplIiwiaWQiLCJlbmxhcmdlZCIsImlzQW5pbWF0aW5nIiwic3BlZWQiLCJuYW1lIiwidHlwZSIsImZpZWxkSWR4IiwiZG9tYWluIiwicGxvdFR5cGUiLCJ5QXhpcyIsImludGVydmFsIiwiZGF0YSIsImZpZWxkIiwiZmllbGRUeXBlIiwiZmlsdGVyRG9tYWluIiwidHlwZU9wdGlvbnMiLCJib29sZWFuIiwic3RyaW5nIiwiZGF0ZSIsInRpbWVzdGFtcCIsInRhYmxlRmllbGRJbmRleCIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJiaW5kIiwiZm9ybWF0IiwiZ2V0T3JkaW5hbERvbWFpbiIsImZpbHRlcnMiLCJmaWx0ZXJlZEluZGV4IiwibGVuZ3RoIiwibWFwIiwiZCIsImkiLCJhcHBsaWVkRmlsdGVycyIsImZpbHRlciIsInJlZHVjZSIsImFjY3UiLCJtYXRjaGVkIiwiZXZlcnkiLCJmaWx0ZXJlZCIsInB1c2giLCJ2YWwiLCJ0aW1lVmFsIiwibWFwcGVkVmFsdWUiLCJ1dGMiLCJ2YWx1ZU9mIiwiaW5jbHVkZXMiLCJBcnJheSIsImlzQXJyYXkiLCJmaWx0ZXJlZFZhbHVlIiwiZ2V0TGluZWFyRG9tYWluIiwiZGlmZiIsImdldE51bWVyaWNTdGVwU2l6ZSIsImdldEhpc3RvZ3JhbSIsImVubGFyZ2VkSGlzdG9ncmFtIiwiZW50cnkiLCJmaW5kIiwiZiIsImJpbnMiLCJ0aHJlc2hvbGRzIiwiY291bnQiLCJiaW4iLCJ4MCIsIngxIiwiYm91bmQiLCJNYXRoIiwiZmxvb3IiLCJjZWlsIiwidiIsImlzTmFOIiwiQm9vbGVhbiIsImlucHV0IiwiYWxsRGF0YSIsInNlcmllcyIsIngiLCJ5IiwiaXNGaW5pdGUiLCJzb3J0IiwiYSIsImIiLCJ5RG9tYWluIiwieERvbWFpbiIsImZpbHRlclBsb3RUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF5RWdCQSxnQixHQUFBQSxnQjtRQWdDQUMsYyxHQUFBQSxjO1FBc0VBQyxjLEdBQUFBLGM7UUFxQ0FDLFUsR0FBQUEsVTtRQTJDQUMsaUIsR0FBQUEsaUI7UUF1Q0FDLHlCLEdBQUFBLHlCO1FBd0NBQyxxQixHQUFBQSxxQjtRQTBDQUMs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QUF3Q3ZFLFlBQXhDLEVBQVA7QUFDRDs7QUFFTSxTQUFTM0Msd0JBQVQsQ0FBa0NtRSxNQUFsQyxFQUEwQztBQUMvQyxNQUFNZ0Qsa0JBQWtCNUYsa0JBQWtCNEMsT0FBTzVCLElBQXpCLENBQXhCO0FBQ0EsTUFBSSxDQUFDNEUsZUFBTCxFQUFzQjtBQUNwQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLENBQUNoRCxPQUFPeEIsS0FBWixFQUFtQjtBQUNqQixXQUFPd0UsZ0JBQWdCM0YsT0FBdkI7QUFDRDs7QUFFRCxTQUFPMkYsZ0JBQWdCaEQsT0FBT3hCLEtBQVAsQ0FBYUosSUFBN0IsS0FBc0MsSUFBN0M7QUFDRCIsImZpbGUiOiJmaWx0ZXItdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge2FzY2VuZGluZywgZXh0ZW50LCBoaXN0b2dyYW0gYXMgZDNIaXN0b2dyYW0sIHRpY2tzfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5cbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge21heWJlVG9EYXRlLCBub3ROdWxsb3JVbmRlZmluZWR9IGZyb20gJy4vZGF0YS11dGlscyc7XG5pbXBvcnQgKiBhcyBTY2FsZVV0aWxzIGZyb20gJy4vZGF0YS1zY2FsZS11dGlscyc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IFRpbWVzdGFtcFN0ZXBNYXAgPSBbXG4gIHttYXg6IDEsIHN0ZXA6IDAuMDV9LFxuICB7bWF4OiAxMCwgc3RlcDogMC4xfSxcbiAge21heDogMTAwLCBzdGVwOiAxfSxcbiAge21heDogNTAwLCBzdGVwOiA1fSxcbiAge21heDogMTAwMCwgc3RlcDogMTB9LFxuICB7bWF4OiA1MDAwLCBzdGVwOiA1MH0sXG4gIHttYXg6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgc3RlcDogMTAwMH1cbl07XG5cbmV4cG9ydCBjb25zdCBoaXN0b2dyYW1CaW5zID0gMzA7XG5leHBvcnQgY29uc3QgZW5sYXJnZWRIaXN0b2dyYW1CaW5zID0gMTAwO1xuXG5jb25zdCBkdXJhdGlvblNlY29uZCA9IDEwMDA7XG5jb25zdCBkdXJhdGlvbk1pbnV0ZSA9IGR1cmF0aW9uU2Vjb25kICogNjA7XG5jb25zdCBkdXJhdGlvbkhvdXIgPSBkdXJhdGlvbk1pbnV0ZSAqIDYwO1xuY29uc3QgZHVyYXRpb25EYXkgPSBkdXJhdGlvbkhvdXIgKiAyNDtcbmNvbnN0IGR1cmF0aW9uV2VlayA9IGR1cmF0aW9uRGF5ICogNztcbmNvbnN0IGR1cmF0aW9uWWVhciA9IGR1cmF0aW9uRGF5ICogMzY1O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgcmFuZ2U6IG51bGwsXG4gIHNlbGVjdDogbnVsbCxcbiAgdGltZVJhbmdlOiBudWxsLFxuICBtdWx0aVNlbGVjdDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBQTE9UX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgaGlzdG9ncmFtOiBudWxsLFxuICBsaW5lQ2hhcnQ6IG51bGxcbn0pO1xuXG5jb25zdCBTdXBwb3J0ZWRQbG90VHlwZSA9IHtcbiAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiB7XG4gICAgZGVmYXVsdDogJ2hpc3RvZ3JhbScsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogJ2xpbmVDaGFydCcsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXTogJ2xpbmVDaGFydCdcbiAgfSxcbiAgW0ZJTFRFUl9UWVBFUy5yYW5nZV06IHtcbiAgICBkZWZhdWx0OiAnaGlzdG9ncmFtJyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiAnbGluZUNoYXJ0JyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiAnbGluZUNoYXJ0J1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0NPTVBPTkVOVFMgPSB7XG4gIFtGSUxURVJfVFlQRVMuc2VsZWN0XTogJ1NpbmdsZVNlbGVjdEZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMubXVsdGlTZWxlY3RdOiAnTXVsdGlTZWxlY3RGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnRpbWVSYW5nZV06ICdUaW1lUmFuZ2VGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnJhbmdlXTogJ1JhbmdlRmlsdGVyJ1xufTtcblxuZXhwb3J0IGNvbnN0IEJBU0VfU1BFRUQgPSA2MDA7XG5leHBvcnQgY29uc3QgVElNRV9BTklNQVRJT05fU1BFRUQgPSBbe1xuICBsYWJlbDogJzF4JyxcbiAgdmFsdWU6IDFcbn0sIHtcbiAgbGFiZWw6ICcyeCcsXG4gIHZhbHVlOiAyXG59LCB7XG4gIGxhYmVsOiAnNHgnLFxuICB2YWx1ZTogNFxufV07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0ZmlsdGVyKGRhdGFJZCkge1xuICByZXR1cm4ge1xuICAgIC8vIGxpbmsgdG8gZGF0YXNldCBJZFxuICAgIGRhdGFJZCxcbiAgICAvLyBzaG91bGQgYWxsb3cgdG8gZWRpdCBkYXRhSWRcbiAgICBmcmVlemU6IGZhbHNlLFxuICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICBlbmxhcmdlZDogZmFsc2UsXG4gICAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICAgIHNwZWVkOiAxLFxuXG4gICAgLy8gZmllbGQgc3BlY2lmaWNcbiAgICBuYW1lOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgZmllbGRJZHg6IG51bGwsXG4gICAgZG9tYWluOiBudWxsLFxuICAgIHZhbHVlOiBudWxsLFxuXG4gICAgLy8gcGxvdFxuICAgIHBsb3RUeXBlOiBQTE9UX1RZUEVTLmhpc3RvZ3JhbSxcbiAgICB5QXhpczogbnVsbCxcbiAgICBpbnRlcnZhbDogbnVsbFxuICB9O1xufVxuXG4vKipcbiAqIEdldCBkZWZhdWx0IGZpbHRlciBwcm9wIGJhc2VkIG9uIGZpZWxkIHR5cGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEByZXR1cm5zIHtvYmplY3R9IGRlZmF1bHQgZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJQcm9wcyhkYXRhLCBmaWVsZCkge1xuICBjb25zdCBmaWVsZFR5cGUgPSBmaWVsZC50eXBlO1xuICBsZXQgdHlwZTtcbiAgbGV0IHZhbHVlO1xuXG4gIGNvbnN0IGZpbHRlckRvbWFpbiA9IGdldEZpZWxkRG9tYWluKGRhdGEsIGZpZWxkKTtcblxuICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5yZWFsOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgICB0eXBlID0gRklMVEVSX1RZUEVTLnJhbmdlO1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBbRklMVEVSX1RZUEVTLnJhbmdlXTtcbiAgICAgIHZhbHVlID0gZmlsdGVyRG9tYWluLmRvbWFpbjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGZpZWxkVHlwZSxcbiAgICAgICAgdHlwZU9wdGlvbnNcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgdHlwZSA9IEZJTFRFUl9UWVBFUy5zZWxlY3Q7XG4gICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBmaWVsZFR5cGVcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIHR5cGUgPSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q7XG4gICAgICB2YWx1ZSA9IFtdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB0eXBlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgZmllbGRUeXBlXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgdHlwZSA9IEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U7XG4gICAgICB2YWx1ZSA9IGZpbHRlckRvbWFpbi5kb21haW47XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGZpZWxkVHlwZVxuICAgICAgfTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0eXBlID0gZmllbGRUeXBlO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB0eXBlLFxuICAgICAgICBmaWVsZFR5cGVcbiAgICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgZmllbGQgZG9tYWluIGJhc2VkIG9uIGZpZWxkIHR5cGUgYW5kIGRhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHdpdGggZG9tYWluIGFzIGtleVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGREb21haW4oZGF0YSwgZmllbGQpIHtcbiAgY29uc3QgZmllbGRJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICBjb25zdCBpc1RpbWUgPSBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChudWxsLCBpc1RpbWUsIGZpZWxkSWR4LCBmaWVsZC5mb3JtYXQpO1xuICBsZXQgZG9tYWluO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICAgIC8vIGNhbGN1bGF0ZSBkb21haW4gYW5kIHN0ZXBcbiAgICAgIHJldHVybiBnZXROdW1lcmljRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgcmV0dXJuIHtkb21haW46IFt0cnVlLCBmYWxzZV19O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuc3RyaW5nOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmRhdGU6XG4gICAgICBkb21haW4gPSBTY2FsZVV0aWxzLmdldE9yZGluYWxEb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgICByZXR1cm4ge2RvbWFpbn07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICByZXR1cm4gZ2V0VGltZXN0YW1wRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtkb21haW46IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKX07XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBhbiBhcnJheSBvZiBmaWx0ZXJzXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtPYmplY3RbXX0gZmlsdGVyc1xuICogQHJldHVybnMge09iamVjdFtdfSBkYXRhXG4gKiBAcmV0dXJucyB7TnVtYmVyW119IGZpbHRlcmVkSW5kZXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGEoZGF0YSwgZGF0YUlkLCBmaWx0ZXJzKSB7XG4gIGlmICghZGF0YSB8fCAhZGF0YUlkKSB7XG4gICAgLy8gd2h5IHdvdWxkIHRoZXJlIG5vdCBiZSBhbnkgZGF0YT8gYXJlIHdlIG92ZXIgZG9pbmcgdGhpcz9cbiAgICByZXR1cm4ge2RhdGE6IFtdLCBmaWx0ZXJlZEluZGV4OiBbXX07XG4gIH1cblxuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHtkYXRhLCBmaWx0ZXJlZEluZGV4OiBkYXRhLm1hcCgoZCwgaSkgPT4gaSl9O1xuICB9XG5cbiAgY29uc3QgYXBwbGllZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihcbiAgICBkID0+IGQuZGF0YUlkID09PSBkYXRhSWQgJiYgZC5maWVsZElkeCA+IC0xICYmIGQudmFsdWUgIT09IG51bGxcbiAgKTtcblxuICAvLyB3ZSBzYXZlIGEgcmVmZXJlbmNlIG9mIGFsbERhdGEgaW5kZXggaGVyZSB0byBhY2Nlc3MgZGF0YVRvRmVhdHVyZVxuICAvLyBpbiBnZW9qc29uIGFuZCBoZXhnb25JZCBsYXllclxuICBjb25zdCB7ZmlsdGVyZWQsIGZpbHRlcmVkSW5kZXh9ID0gZGF0YS5yZWR1Y2UoXG4gICAgKGFjY3UsIGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoZWQgPSBhcHBsaWVkRmlsdGVycy5ldmVyeShmaWx0ZXIgPT5cbiAgICAgICAgaXNEYXRhTWF0Y2hGaWx0ZXIoZCwgZmlsdGVyLCBpKVxuICAgICAgKTtcblxuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgYWNjdS5maWx0ZXJlZC5wdXNoKGQpO1xuICAgICAgICBhY2N1LmZpbHRlcmVkSW5kZXgucHVzaChpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSxcbiAgICB7ZmlsdGVyZWQ6IFtdLCBmaWx0ZXJlZEluZGV4OiBbXX1cbiAgKTtcblxuICByZXR1cm4ge2RhdGE6IGZpbHRlcmVkLCBmaWx0ZXJlZEluZGV4fTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBpbiByYW5nZSBvZiBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICogQHJldHVybnMge0Jvb2xlYW59IC0gd2hldGhlciB2YWx1ZSBmYWxscyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIGZpbHRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhTWF0Y2hGaWx0ZXIoZGF0YSwgZmlsdGVyLCBpKSB7XG4gIGNvbnN0IHZhbCA9IGRhdGFbZmlsdGVyLmZpZWxkSWR4XTtcbiAgaWYgKCFmaWx0ZXIudHlwZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3dpdGNoIChmaWx0ZXIudHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgICAgcmV0dXJuIGlzSW5SYW5nZSh2YWwsIGZpbHRlci52YWx1ZSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICBjb25zdCB0aW1lVmFsID0gZmlsdGVyLm1hcHBlZFZhbHVlXG4gICAgICAgID8gZmlsdGVyLm1hcHBlZFZhbHVlW2ldXG4gICAgICAgIDogbW9tZW50LnV0Yyh2YWwpLnZhbHVlT2YoKTtcbiAgICAgIHJldHVybiBpc0luUmFuZ2UodGltZVZhbCwgZmlsdGVyLnZhbHVlKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZS5pbmNsdWRlcyh2YWwpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9PT0gdmFsO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQ2FsbCBieSBwYXJzaW5nIGZpbHRlcnMgZnJvbSBVUkxcbiAqIENoZWNrIGlmIHZhbHVlIG9mIGZpbHRlciB3aXRoaW4gZmlsdGVyIGRvbWFpbiwgaWYgbm90IGFkanVzdCBpdCB0byBtYXRjaFxuICogZmlsdGVyIGRvbWFpblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW10gfCBzdHJpbmcgfCBudW1iZXIgfCBudW1iZXJbXX0gdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IGZpbHRlci5kb21haW5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXIudHlwZVxuICogQHJldHVybnMgeyp9IC0gYWRqdXN0ZWQgdmFsdWUgdG8gbWF0Y2ggZmlsdGVyIG9yIG51bGwgdG8gcmVtb3ZlIGZpbHRlclxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKHZhbHVlLCB7ZG9tYWluLCB0eXBlfSkge1xuICBpZiAoIWRvbWFpbiB8fCAhdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ubWFwKGQgPT4gZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZS5tYXAoXG4gICAgICAgIChkLCBpKSA9PlxuICAgICAgICAgIG5vdE51bGxvclVuZGVmaW5lZChkKSAmJiBpc0luUmFuZ2UoZCwgZG9tYWluKSA/IGQgOiBkb21haW5baV1cbiAgICAgICk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyZWRWYWx1ZSA9IHZhbHVlLmZpbHRlcihkID0+IGRvbWFpbi5pbmNsdWRlcyhkKSk7XG4gICAgICByZXR1cm4gZmlsdGVyZWRWYWx1ZS5sZW5ndGggPyBmaWx0ZXJlZFZhbHVlIDogW107XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZG9tYWluLmluY2x1ZGVzKHZhbHVlKSA/IHZhbHVlIDogdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogQ2FsY3VsYXRlIG51bWVyaWMgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gdmFsdWVBY2Nlc3NvclxuICogQHJldHVybnMge29iamVjdH0gZG9tYWluIGFuZCBzdGVwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1lcmljRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcikge1xuICBsZXQgZG9tYWluID0gWzAsIDFdO1xuICBsZXQgc3RlcCA9IDAuMTtcblxuICBjb25zdCBtYXBwZWRWYWx1ZSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLm1hcCh2YWx1ZUFjY2Vzc29yKSA6IFtdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID4gMSkge1xuICAgIGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuXG4gICAgLy8gaW4gY2FzZSBlcXVhbCBkb21haW4sIFs5NiwgOTZdLCB3aGljaCB3aWxsIGJyZWFrIHF1YW50aXplIHNjYWxlXG4gICAgaWYgKCFkaWZmKSB7XG4gICAgICBkb21haW5bMV0gPSBkb21haW5bMF0gKyAxO1xuICAgIH1cblxuICAgIHN0ZXAgPSBnZXROdW1lcmljU3RlcFNpemUoZGlmZikgfHwgc3RlcDtcbiAgICBkb21haW5bMF0gPSBmb3JtYXROdW1iZXJCeVN0ZXAoZG9tYWluWzBdLCBzdGVwLCAnZmxvb3InKTtcbiAgICBkb21haW5bMV0gPSBmb3JtYXROdW1iZXJCeVN0ZXAoZG9tYWluWzFdLCBzdGVwLCAnY2VpbCcpO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtZXJpY1N0ZXBTaXplKGRpZmYpIHtcbiAgaWYgKGRpZmYgPiAxMDApIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChkaWZmIDwgMjAgJiYgZGlmZiA+IDMpIHtcbiAgICByZXR1cm4gMC4wMTtcbiAgfSBlbHNlIGlmIChkaWZmIDw9IDMpIHtcbiAgICByZXR1cm4gMC4wMDE7XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGltZXN0YW1wIGRvbWFpbiBhbmQgc3VpdGFibGUgc3RlcFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHZhbHVlQWNjZXNzb3JcbiAqIEByZXR1cm5zIHtvYmplY3R9IGRvbWFpbiBhbmQgc3RlcFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZXN0YW1wRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcikge1xuICAvLyB0byBhdm9pZCBjb252ZXJ0aW5nIHN0cmluZyBmb3JtYXQgdGltZSB0byBlcG9jaFxuICAvLyBldmVyeSB0aW1lIHdlIGNvbXBhcmUgd2Ugc3RvcmUgYSB2YWx1ZSBtYXBwZWQgdG8gaW50IGluIGZpbHRlciBkb21haW5cblxuICBjb25zdCBtYXBwZWRWYWx1ZSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLm1hcCh2YWx1ZUFjY2Vzc29yKSA6IFtdO1xuICBjb25zdCBkb21haW4gPSBTY2FsZVV0aWxzLmdldExpbmVhckRvbWFpbihtYXBwZWRWYWx1ZSk7XG4gIGxldCBzdGVwID0gMC4wMTtcblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICBjb25zdCBlbnRyeSA9IFRpbWVzdGFtcFN0ZXBNYXAuZmluZChmID0+IGYubWF4ID49IGRpZmYpO1xuICBpZiAoZW50cnkpIHtcbiAgICBzdGVwID0gZW50cnkuc3RlcDtcbiAgfVxuXG4gIGNvbnN0IHtoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfSA9IGdldEhpc3RvZ3JhbShkb21haW4sIG1hcHBlZFZhbHVlKTtcblxuICByZXR1cm4ge2RvbWFpbiwgc3RlcCwgbWFwcGVkVmFsdWUsIGhpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGJpbnMpIHtcbiAgcmV0dXJuIGQzSGlzdG9ncmFtKClcbiAgICAudGhyZXNob2xkcyh0aWNrcyhkb21haW5bMF0sIGRvbWFpblsxXSwgYmlucykpXG4gICAgLmRvbWFpbihkb21haW4pKG1hcHBlZFZhbHVlKVxuICAgIC5tYXAoYmluID0+ICh7XG4gICAgICBjb3VudDogYmluLmxlbmd0aCxcbiAgICAgIHgwOiBiaW4ueDAsXG4gICAgICB4MTogYmluLngxXG4gICAgfSkpO1xufVxuLyoqXG4gKiBDYWxjdWxhdGUgaGlzdG9ncmFtIGZyb20gZG9tYWluIGFuZCBhcnJheSBvZiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBkb21haW5cbiAqIEBwYXJhbSB7T2JqZWN0W119IG1hcHBlZFZhbHVlXG4gKiBAcmV0dXJucyB7QXJyYXlbXX0gaGlzdG9ncmFtXG4gKi9cbmZ1bmN0aW9uIGdldEhpc3RvZ3JhbShkb21haW4sIG1hcHBlZFZhbHVlKSB7XG4gIGNvbnN0IGhpc3RvZ3JhbSA9IGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCBoaXN0b2dyYW1CaW5zKTtcbiAgY29uc3QgZW5sYXJnZWRIaXN0b2dyYW0gPSBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgZW5sYXJnZWRIaXN0b2dyYW1CaW5zKTtcblxuICByZXR1cm4ge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG4vKipcbiAqIHJvdW5kIG51bWJlciBiYXNlZCBvbiBzdGVwXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICogQHBhcmFtIHtudW1iZXJ9IHN0ZXBcbiAqIEBwYXJhbSB7c3RyaW5nfSBib3VuZFxuICogQHJldHVybnMge251bWJlcn0gcm91bmRlZCBudW1iZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE51bWJlckJ5U3RlcCh2YWwsIHN0ZXAsIGJvdW5kKSB7XG4gIGlmIChib3VuZCA9PT0gJ2Zsb29yJykge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbCAqICgxIC8gc3RlcCkpIC8gKDEgLyBzdGVwKTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLmNlaWwodmFsICogKDEgLyBzdGVwKSkgLyAoMSAvIHN0ZXApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJblJhbmdlKHZhbCwgZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHZhbCA+PSBkb21haW5bMF0gJiYgdmFsIDw9IGRvbWFpblsxXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRvbWFpbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIHJldHVybiBkaWZmID4gZHVyYXRpb25ZZWFyXG4gICAgPyAnTU0vREQvWVknXG4gICAgOiBkaWZmID4gZHVyYXRpb25EYXkgPyAnTU0vREQgaGhhJyA6ICdNTS9ERCBoaDptbWEnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uWWVhclxuICAgID8gJ01NL0REL1lZJ1xuICAgIDogZGlmZiA+IGR1cmF0aW9uV2Vla1xuICAgICAgPyAnTU0vREQnXG4gICAgICA6IGRpZmYgPiBkdXJhdGlvbkRheVxuICAgICAgICA/ICdNTS9ERCBoaGEnXG4gICAgICAgIDogZGlmZiA+IGR1cmF0aW9uSG91ciA/ICdoaDptbWEnIDogJ2hoOm1tOnNzYSc7XG59XG5cbi8qKlxuICogU2FuaXR5IGNoZWNrIG9uIGZpbHRlcnMgdG8gcHJlcGFyZSBmb3Igc2F2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBmaWx0ZXIgdHlwZVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIGZpbHRlciB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHdoZXRoZXIgZmlsdGVyIGlzIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVmFsdWUoe3R5cGUsIHZhbHVlfSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeSh2ID0+IHYgIT09IG51bGwgJiYgIWlzTmFOKHYpKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLmlucHV0OlxuICAgICAgcmV0dXJuIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyUGxvdChmaWx0ZXIsIGFsbERhdGEpIHtcbiAgaWYgKGZpbHRlci5wbG90VHlwZSA9PT0gUExPVF9UWVBFUy5oaXN0b2dyYW0gfHwgIWZpbHRlci55QXhpcykge1xuICAgIC8vIGhpc3RvZ3JhbSBzaG91bGQgYmUgY2FsY3VsYXRlZCB3aGVuIGNyZWF0ZSBmaWx0ZXJcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCB7bWFwcGVkVmFsdWV9ID0gZmlsdGVyO1xuICBjb25zdCB7eUF4aXN9ID0gZmlsdGVyO1xuXG4gIC8vIHJldHVybiBsaW5lQ2hhcnRcbiAgY29uc3Qgc2VyaWVzID0gYWxsRGF0YVxuICAgIC5tYXAoKGQsIGkpID0+ICh7XG4gICAgICB4OiBtYXBwZWRWYWx1ZVtpXSxcbiAgICAgIHk6IGRbeUF4aXMudGFibGVGaWVsZEluZGV4IC0gMV1cbiAgICB9KSlcbiAgICAuZmlsdGVyKCh7eCwgeX0pID0+IE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGFzY2VuZGluZyhhLngsIGIueCkpO1xuXG4gIGNvbnN0IHlEb21haW4gPSBleHRlbnQoc2VyaWVzLCBkID0+IGQueSk7XG4gIGNvbnN0IHhEb21haW4gPSBbc2VyaWVzWzBdLngsIHNlcmllc1tzZXJpZXMubGVuZ3RoIC0gMV0ueF07XG5cbiAgcmV0dXJuIHtsaW5lQ2hhcnQ6IHtzZXJpZXMsIHlEb21haW4sIHhEb21haW59LCB5QXhpc307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUoZmlsdGVyKSB7XG4gIGNvbnN0IGZpbHRlclBsb3RUeXBlcyA9IFN1cHBvcnRlZFBsb3RUeXBlW2ZpbHRlci50eXBlXTtcbiAgaWYgKCFmaWx0ZXJQbG90VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyLnlBeGlzKSB7XG4gICAgcmV0dXJuIGZpbHRlclBsb3RUeXBlcy5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlclBsb3RUeXBlc1tmaWx0ZXIueUF4aXMudHlwZV0gfHwgbnVsbDtcbn1cbiJdfQ==