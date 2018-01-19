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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0RGVmYXVsdGZpbHRlciIsImdldEZpbHRlclByb3BzIiwiZ2V0RmllbGREb21haW4iLCJmaWx0ZXJEYXRhIiwiaXNEYXRhTWF0Y2hGaWx0ZXIiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiZ2V0VGltZXN0YW1wRmllbGREb21haW4iLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJpc0luUmFuZ2UiLCJnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIiLCJnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlciIsImlzVmFsaWRGaWx0ZXJWYWx1ZSIsImdldEZpbHRlclBsb3QiLCJnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUiLCJTY2FsZVV0aWxzIiwiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImR1cmF0aW9uU2Vjb25kIiwiZHVyYXRpb25NaW51dGUiLCJkdXJhdGlvbkhvdXIiLCJkdXJhdGlvbkRheSIsImR1cmF0aW9uV2VlayIsImR1cmF0aW9uWWVhciIsIkZJTFRFUl9UWVBFUyIsInJhbmdlIiwic2VsZWN0IiwidGltZVJhbmdlIiwibXVsdGlTZWxlY3QiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiU3VwcG9ydGVkUGxvdFR5cGUiLCJkZWZhdWx0IiwiaW50ZWdlciIsInJlYWwiLCJGSUxURVJfQ09NUE9ORU5UUyIsImRhdGFJZCIsImZyZWV6ZSIsImlkIiwiZW5sYXJnZWQiLCJpc0FuaW1hdGluZyIsIm5hbWUiLCJ0eXBlIiwiZmllbGRJZHgiLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwieUF4aXMiLCJpbnRlcnZhbCIsImRhdGEiLCJmaWVsZCIsImZpZWxkVHlwZSIsImZpbHRlckRvbWFpbiIsInR5cGVPcHRpb25zIiwiYm9vbGVhbiIsInN0cmluZyIsImRhdGUiLCJ0aW1lc3RhbXAiLCJ0YWJsZUZpZWxkSW5kZXgiLCJpc1RpbWUiLCJ2YWx1ZUFjY2Vzc29yIiwiYmluZCIsImZvcm1hdCIsImdldE9yZGluYWxEb21haW4iLCJmaWx0ZXJzIiwiZmlsdGVyZWRJbmRleCIsImxlbmd0aCIsIm1hcCIsImQiLCJpIiwiYXBwbGllZEZpbHRlcnMiLCJmaWx0ZXIiLCJyZWR1Y2UiLCJhY2N1IiwibWF0Y2hlZCIsImV2ZXJ5IiwiZmlsdGVyZWQiLCJwdXNoIiwidmFsIiwidGltZVZhbCIsIm1hcHBlZFZhbHVlIiwidXRjIiwidmFsdWVPZiIsImluY2x1ZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyZWRWYWx1ZSIsImdldExpbmVhckRvbWFpbiIsImRpZmYiLCJnZXROdW1lcmljU3RlcFNpemUiLCJnZXRIaXN0b2dyYW0iLCJlbmxhcmdlZEhpc3RvZ3JhbSIsImVudHJ5IiwiZmluZCIsImYiLCJiaW5zIiwidGhyZXNob2xkcyIsImNvdW50IiwiYmluIiwieDAiLCJ4MSIsImJvdW5kIiwiTWF0aCIsImZsb29yIiwiY2VpbCIsInYiLCJpc05hTiIsIkJvb2xlYW4iLCJpbnB1dCIsImFsbERhdGEiLCJzZXJpZXMiLCJ4IiwieSIsImlzRmluaXRlIiwic29ydCIsImEiLCJiIiwieURvbWFpbiIsInhEb21haW4iLCJmaWx0ZXJQbG90VHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUEwRGdCQSxnQixHQUFBQSxnQjtRQStCQUMsYyxHQUFBQSxjO1FBc0VBQyxjLEdBQUFBLGM7UUFxQ0FDLFUsR0FBQUEsVTtRQTJDQUMsaUIsR0FBQUEsaUI7UUF1Q0FDLHlCLEdBQUFBLHlCO1FBd0NBQyxxQixHQUFBQSxxQjtRQTBDQUMsdUIsR0FBQUEsdUI7UUFtQkFDLGtCLEdBQUFBLGtCO1FBZ0NBQyxrQixHQUFBQSxrQjtRQVFBQyxTLEdBQUFBLFM7UUFRQUMsMkIsR0FBQUEsMkI7UUFXQUMsMEIsR0FB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bnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7YXNjZW5kaW5nLCBleHRlbnQsIGhpc3RvZ3JhbSBhcyBkM0hpc3RvZ3JhbSwgdGlja3N9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7bWF5YmVUb0RhdGUsIG5vdE51bGxvclVuZGVmaW5lZH0gZnJvbSAnLi9kYXRhLXV0aWxzJztcbmltcG9ydCAqIGFzIFNjYWxlVXRpbHMgZnJvbSAnLi9kYXRhLXNjYWxlLXV0aWxzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgVGltZXN0YW1wU3RlcE1hcCA9IFtcbiAge21heDogMSwgc3RlcDogMC4wNX0sXG4gIHttYXg6IDEwLCBzdGVwOiAwLjF9LFxuICB7bWF4OiAxMDAsIHN0ZXA6IDF9LFxuICB7bWF4OiA1MDAsIHN0ZXA6IDV9LFxuICB7bWF4OiAxMDAwLCBzdGVwOiAxMH0sXG4gIHttYXg6IDUwMDAsIHN0ZXA6IDUwfSxcbiAge21heDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCBzdGVwOiAxMDAwfVxuXTtcblxuY29uc3QgZHVyYXRpb25TZWNvbmQgPSAxMDAwO1xuY29uc3QgZHVyYXRpb25NaW51dGUgPSBkdXJhdGlvblNlY29uZCAqIDYwO1xuY29uc3QgZHVyYXRpb25Ib3VyID0gZHVyYXRpb25NaW51dGUgKiA2MDtcbmNvbnN0IGR1cmF0aW9uRGF5ID0gZHVyYXRpb25Ib3VyICogMjQ7XG5jb25zdCBkdXJhdGlvbldlZWsgPSBkdXJhdGlvbkRheSAqIDc7XG5jb25zdCBkdXJhdGlvblllYXIgPSBkdXJhdGlvbkRheSAqIDM2NTtcblxuZXhwb3J0IGNvbnN0IEZJTFRFUl9UWVBFUyA9IGtleU1pcnJvcih7XG4gIHJhbmdlOiBudWxsLFxuICBzZWxlY3Q6IG51bGwsXG4gIHRpbWVSYW5nZTogbnVsbCxcbiAgbXVsdGlTZWxlY3Q6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgUExPVF9UWVBFUyA9IGtleU1pcnJvcih7XG4gIGhpc3RvZ3JhbTogbnVsbCxcbiAgbGluZUNoYXJ0OiBudWxsXG59KTtcblxuY29uc3QgU3VwcG9ydGVkUGxvdFR5cGUgPSB7XG4gIFtGSUxURVJfVFlQRVMudGltZVJhbmdlXToge1xuICAgIGRlZmF1bHQ6ICdoaXN0b2dyYW0nLFxuICAgIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06ICdsaW5lQ2hhcnQnLFxuICAgIFtBTExfRklFTERfVFlQRVMucmVhbF06ICdsaW5lQ2hhcnQnXG4gIH0sXG4gIFtGSUxURVJfVFlQRVMucmFuZ2VdOiB7XG4gICAgZGVmYXVsdDogJ2hpc3RvZ3JhbScsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogJ2xpbmVDaGFydCcsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXTogJ2xpbmVDaGFydCdcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEZJTFRFUl9DT01QT05FTlRTID0ge1xuICBbRklMVEVSX1RZUEVTLnNlbGVjdF06ICdTaW5nbGVTZWxlY3RGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0XTogJ011bHRpU2VsZWN0RmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiAnVGltZVJhbmdlRmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy5yYW5nZV06ICdSYW5nZUZpbHRlcidcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0ZmlsdGVyKGRhdGFJZCkge1xuICByZXR1cm4ge1xuICAgIC8vIGxpbmsgdG8gZGF0YXNldCBJZFxuICAgIGRhdGFJZCxcbiAgICAvLyBzaG91bGQgYWxsb3cgdG8gZWRpdCBkYXRhSWRcbiAgICBmcmVlemU6IGZhbHNlLFxuICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICBlbmxhcmdlZDogZmFsc2UsXG4gICAgaXNBbmltYXRpbmc6IGZhbHNlLFxuXG4gICAgLy8gZmllbGQgc3BlY2lmaWNcbiAgICBuYW1lOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgZmllbGRJZHg6IG51bGwsXG4gICAgZG9tYWluOiBudWxsLFxuICAgIHZhbHVlOiBudWxsLFxuXG4gICAgLy8gcGxvdFxuICAgIHBsb3RUeXBlOiBQTE9UX1RZUEVTLmhpc3RvZ3JhbSxcbiAgICB5QXhpczogbnVsbCxcbiAgICBpbnRlcnZhbDogbnVsbFxuICB9O1xufVxuXG4vKipcbiAqIEdldCBkZWZhdWx0IGZpbHRlciBwcm9wIGJhc2VkIG9uIGZpZWxkIHR5cGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEByZXR1cm5zIHtvYmplY3R9IGRlZmF1bHQgZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJQcm9wcyhkYXRhLCBmaWVsZCkge1xuICBjb25zdCBmaWVsZFR5cGUgPSBmaWVsZC50eXBlO1xuICBsZXQgdHlwZTtcbiAgbGV0IHZhbHVlO1xuXG4gIGNvbnN0IGZpbHRlckRvbWFpbiA9IGdldEZpZWxkRG9tYWluKGRhdGEsIGZpZWxkKTtcblxuICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5yZWFsOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgICB0eXBlID0gRklMVEVSX1RZUEVTLnJhbmdlO1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBbRklMVEVSX1RZUEVTLnJhbmdlXTtcbiAgICAgIHZhbHVlID0gZmlsdGVyRG9tYWluLmRvbWFpbjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGZpZWxkVHlwZSxcbiAgICAgICAgdHlwZU9wdGlvbnNcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgdHlwZSA9IEZJTFRFUl9UWVBFUy5zZWxlY3Q7XG4gICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBmaWVsZFR5cGVcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIHR5cGUgPSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q7XG4gICAgICB2YWx1ZSA9IFtdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB0eXBlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgZmllbGRUeXBlXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgdHlwZSA9IEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U7XG4gICAgICB2YWx1ZSA9IGZpbHRlckRvbWFpbi5kb21haW47XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGZpZWxkVHlwZVxuICAgICAgfTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0eXBlID0gZmllbGRUeXBlO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB0eXBlLFxuICAgICAgICBmaWVsZFR5cGVcbiAgICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgZmllbGQgZG9tYWluIGJhc2VkIG9uIGZpZWxkIHR5cGUgYW5kIGRhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHdpdGggZG9tYWluIGFzIGtleVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGREb21haW4oZGF0YSwgZmllbGQpIHtcbiAgY29uc3QgZmllbGRJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICBjb25zdCBpc1RpbWUgPSBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChudWxsLCBpc1RpbWUsIGZpZWxkSWR4LCBmaWVsZC5mb3JtYXQpO1xuICBsZXQgZG9tYWluO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICAgIC8vIGNhbGN1bGF0ZSBkb21haW4gYW5kIHN0ZXBcbiAgICAgIHJldHVybiBnZXROdW1lcmljRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgcmV0dXJuIHtkb21haW46IFt0cnVlLCBmYWxzZV19O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuc3RyaW5nOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmRhdGU6XG4gICAgICBkb21haW4gPSBTY2FsZVV0aWxzLmdldE9yZGluYWxEb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgICByZXR1cm4ge2RvbWFpbn07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICByZXR1cm4gZ2V0VGltZXN0YW1wRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtkb21haW46IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKX07XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBhbiBhcnJheSBvZiBmaWx0ZXJzXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtPYmplY3RbXX0gZmlsdGVyc1xuICogQHJldHVybnMge09iamVjdFtdfSBkYXRhXG4gKiBAcmV0dXJucyB7TnVtYmVyW119IGZpbHRlcmVkSW5kZXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGEoZGF0YSwgZGF0YUlkLCBmaWx0ZXJzKSB7XG4gIGlmICghZGF0YSB8fCAhZGF0YUlkKSB7XG4gICAgLy8gd2h5IHdvdWxkIHRoZXJlIG5vdCBiZSBhbnkgZGF0YT8gYXJlIHdlIG92ZXIgZG9pbmcgdGhpcz9cbiAgICByZXR1cm4ge2RhdGE6IFtdLCBmaWx0ZXJlZEluZGV4OiBbXX07XG4gIH1cblxuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHtkYXRhLCBmaWx0ZXJlZEluZGV4OiBkYXRhLm1hcCgoZCwgaSkgPT4gaSl9O1xuICB9XG5cbiAgY29uc3QgYXBwbGllZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihcbiAgICBkID0+IGQuZGF0YUlkID09PSBkYXRhSWQgJiYgZC5maWVsZElkeCA+IC0xICYmIGQudmFsdWUgIT09IG51bGxcbiAgKTtcblxuICAvLyB3ZSBzYXZlIGEgcmVmZXJlbmNlIG9mIGFsbERhdGEgaW5kZXggaGVyZSB0byBhY2Nlc3MgZGF0YVRvRmVhdHVyZVxuICAvLyBpbiBnZW9qc29uIGFuZCBoZXhnb25JZCBsYXllclxuICBjb25zdCB7ZmlsdGVyZWQsIGZpbHRlcmVkSW5kZXh9ID0gZGF0YS5yZWR1Y2UoXG4gICAgKGFjY3UsIGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoZWQgPSBhcHBsaWVkRmlsdGVycy5ldmVyeShmaWx0ZXIgPT5cbiAgICAgICAgaXNEYXRhTWF0Y2hGaWx0ZXIoZCwgZmlsdGVyLCBpKVxuICAgICAgKTtcblxuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgYWNjdS5maWx0ZXJlZC5wdXNoKGQpO1xuICAgICAgICBhY2N1LmZpbHRlcmVkSW5kZXgucHVzaChpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSxcbiAgICB7ZmlsdGVyZWQ6IFtdLCBmaWx0ZXJlZEluZGV4OiBbXX1cbiAgKTtcblxuICByZXR1cm4ge2RhdGE6IGZpbHRlcmVkLCBmaWx0ZXJlZEluZGV4fTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBpbiByYW5nZSBvZiBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICogQHJldHVybnMge0Jvb2xlYW59IC0gd2hldGhlciB2YWx1ZSBmYWxscyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIGZpbHRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhTWF0Y2hGaWx0ZXIoZGF0YSwgZmlsdGVyLCBpKSB7XG4gIGNvbnN0IHZhbCA9IGRhdGFbZmlsdGVyLmZpZWxkSWR4XTtcbiAgaWYgKCFmaWx0ZXIudHlwZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3dpdGNoIChmaWx0ZXIudHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgICAgcmV0dXJuIGlzSW5SYW5nZSh2YWwsIGZpbHRlci52YWx1ZSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICBjb25zdCB0aW1lVmFsID0gZmlsdGVyLm1hcHBlZFZhbHVlXG4gICAgICAgID8gZmlsdGVyLm1hcHBlZFZhbHVlW2ldXG4gICAgICAgIDogbW9tZW50LnV0Yyh2YWwpLnZhbHVlT2YoKTtcbiAgICAgIHJldHVybiBpc0luUmFuZ2UodGltZVZhbCwgZmlsdGVyLnZhbHVlKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZS5pbmNsdWRlcyh2YWwpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9PT0gdmFsO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQ2FsbCBieSBwYXJzaW5nIGZpbHRlcnMgZnJvbSBVUkxcbiAqIENoZWNrIGlmIHZhbHVlIG9mIGZpbHRlciB3aXRoaW4gZmlsdGVyIGRvbWFpbiwgaWYgbm90IGFkanVzdCBpdCB0byBtYXRjaFxuICogZmlsdGVyIGRvbWFpblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW10gfCBzdHJpbmcgfCBudW1iZXIgfCBudW1iZXJbXX0gdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IGZpbHRlci5kb21haW5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXIudHlwZVxuICogQHJldHVybnMgeyp9IC0gYWRqdXN0ZWQgdmFsdWUgdG8gbWF0Y2ggZmlsdGVyIG9yIG51bGwgdG8gcmVtb3ZlIGZpbHRlclxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKHZhbHVlLCB7ZG9tYWluLCB0eXBlfSkge1xuICBpZiAoIWRvbWFpbiB8fCAhdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ubWFwKGQgPT4gZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZS5tYXAoXG4gICAgICAgIChkLCBpKSA9PlxuICAgICAgICAgIG5vdE51bGxvclVuZGVmaW5lZChkKSAmJiBpc0luUmFuZ2UoZCwgZG9tYWluKSA/IGQgOiBkb21haW5baV1cbiAgICAgICk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyZWRWYWx1ZSA9IHZhbHVlLmZpbHRlcihkID0+IGRvbWFpbi5pbmNsdWRlcyhkKSk7XG4gICAgICByZXR1cm4gZmlsdGVyZWRWYWx1ZS5sZW5ndGggPyBmaWx0ZXJlZFZhbHVlIDogW107XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZG9tYWluLmluY2x1ZGVzKHZhbHVlKSA/IHZhbHVlIDogdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogQ2FsY3VsYXRlIG51bWVyaWMgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gdmFsdWVBY2Nlc3NvclxuICogQHJldHVybnMge29iamVjdH0gZG9tYWluIGFuZCBzdGVwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1lcmljRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcikge1xuICBsZXQgZG9tYWluID0gWzAsIDFdO1xuICBsZXQgc3RlcCA9IDAuMTtcblxuICBjb25zdCBtYXBwZWRWYWx1ZSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLm1hcCh2YWx1ZUFjY2Vzc29yKSA6IFtdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID4gMSkge1xuICAgIGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuXG4gICAgLy8gaW4gY2FzZSBlcXVhbCBkb21haW4sIFs5NiwgOTZdLCB3aGljaCB3aWxsIGJyZWFrIHF1YW50aXplIHNjYWxlXG4gICAgaWYgKCFkaWZmKSB7XG4gICAgICBkb21haW5bMV0gPSBkb21haW5bMF0gKyAxO1xuICAgIH1cblxuICAgIHN0ZXAgPSBnZXROdW1lcmljU3RlcFNpemUoZGlmZikgfHwgc3RlcDtcbiAgICBkb21haW5bMF0gPSBmb3JtYXROdW1iZXJCeVN0ZXAoZG9tYWluWzBdLCBzdGVwLCAnZmxvb3InKTtcbiAgICBkb21haW5bMV0gPSBmb3JtYXROdW1iZXJCeVN0ZXAoZG9tYWluWzFdLCBzdGVwLCAnY2VpbCcpO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtZXJpY1N0ZXBTaXplKGRpZmYpIHtcbiAgaWYgKGRpZmYgPiAxMDApIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChkaWZmIDwgMjAgJiYgZGlmZiA+IDMpIHtcbiAgICByZXR1cm4gMC4wMTtcbiAgfSBlbHNlIGlmIChkaWZmIDw9IDMpIHtcbiAgICByZXR1cm4gMC4wMDE7XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGltZXN0YW1wIGRvbWFpbiBhbmQgc3VpdGFibGUgc3RlcFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHZhbHVlQWNjZXNzb3JcbiAqIEByZXR1cm5zIHtvYmplY3R9IGRvbWFpbiBhbmQgc3RlcFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZXN0YW1wRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcikge1xuICAvLyB0byBhdm9pZCBjb252ZXJ0aW5nIHN0cmluZyBmb3JtYXQgdGltZSB0byBlcG9jaFxuICAvLyBldmVyeSB0aW1lIHdlIGNvbXBhcmUgd2Ugc3RvcmUgYSB2YWx1ZSBtYXBwZWQgdG8gaW50IGluIGZpbHRlciBkb21haW5cblxuICBjb25zdCBtYXBwZWRWYWx1ZSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLm1hcCh2YWx1ZUFjY2Vzc29yKSA6IFtdO1xuICBjb25zdCBkb21haW4gPSBTY2FsZVV0aWxzLmdldExpbmVhckRvbWFpbihtYXBwZWRWYWx1ZSk7XG4gIGxldCBzdGVwID0gMC4wMTtcblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICBjb25zdCBlbnRyeSA9IFRpbWVzdGFtcFN0ZXBNYXAuZmluZChmID0+IGYubWF4ID49IGRpZmYpO1xuICBpZiAoZW50cnkpIHtcbiAgICBzdGVwID0gZW50cnkuc3RlcDtcbiAgfVxuXG4gIGNvbnN0IHtoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfSA9IGdldEhpc3RvZ3JhbShkb21haW4sIG1hcHBlZFZhbHVlKTtcblxuICByZXR1cm4ge2RvbWFpbiwgc3RlcCwgbWFwcGVkVmFsdWUsIGhpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGJpbnMpIHtcbiAgcmV0dXJuIGQzSGlzdG9ncmFtKClcbiAgICAudGhyZXNob2xkcyh0aWNrcyhkb21haW5bMF0sIGRvbWFpblsxXSwgYmlucykpXG4gICAgLmRvbWFpbihkb21haW4pKG1hcHBlZFZhbHVlKVxuICAgIC5tYXAoYmluID0+ICh7XG4gICAgICBjb3VudDogYmluLmxlbmd0aCxcbiAgICAgIHgwOiBiaW4ueDAsXG4gICAgICB4MTogYmluLngxXG4gICAgfSkpO1xufVxuLyoqXG4gKiBDYWxjdWxhdGUgaGlzdG9ncmFtIGZyb20gZG9tYWluIGFuZCBhcnJheSBvZiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBkb21haW5cbiAqIEBwYXJhbSB7T2JqZWN0W119IG1hcHBlZHZhbHVlXG4gKiBAcmV0dXJucyB7QXJyYXlbXX0gaGlzdG9ncmFtXG4gKi9cbmZ1bmN0aW9uIGdldEhpc3RvZ3JhbShkb21haW4sIG1hcHBlZFZhbHVlKSB7XG4gIGNvbnN0IGhpc3RvZ3JhbSA9IGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCA1MCk7XG4gIGNvbnN0IGVubGFyZ2VkSGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIDEwMCk7XG5cbiAgcmV0dXJuIHtoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuLyoqXG4gKiByb3VuZCBudW1iZXIgYmFzZWQgb24gc3RlcFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwXG4gKiBAcGFyYW0ge3N0cmluZ30gYm91bmRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJvdW5kZWQgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXROdW1iZXJCeVN0ZXAodmFsLCBzdGVwLCBib3VuZCkge1xuICBpZiAoYm91bmQgPT09ICdmbG9vcicpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWwgKiAoMSAvIHN0ZXApKSAvICgxIC8gc3RlcCk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5jZWlsKHZhbCAqICgxIC8gc3RlcCkpIC8gKDEgLyBzdGVwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5SYW5nZSh2YWwsIGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB2YWwgPj0gZG9tYWluWzBdICYmIHZhbCA8PSBkb21haW5bMV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uWWVhclxuICAgID8gJ01NL0REL1lZJ1xuICAgIDogZGlmZiA+IGR1cmF0aW9uRGF5ID8gJ01NL0REIGhoYScgOiAnTU0vREQgaGg6bW1hJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcbiAgcmV0dXJuIGRpZmYgPiBkdXJhdGlvblllYXJcbiAgICA/ICdNTS9ERC9ZWSdcbiAgICA6IGRpZmYgPiBkdXJhdGlvbldlZWtcbiAgICAgID8gJ01NL0REJ1xuICAgICAgOiBkaWZmID4gZHVyYXRpb25EYXlcbiAgICAgICAgPyAnTU0vREQgaGhhJ1xuICAgICAgICA6IGRpZmYgPiBkdXJhdGlvbkhvdXIgPyAnaGg6bW1hJyA6ICdoaDptbTpzc2EnO1xufVxuXG4vKipcbiAqIFNhbml0eSBjaGVjayBvbiBmaWx0ZXJzIHRvIHByZXBhcmUgZm9yIHNhdmVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gZmlsdGVyIHR5cGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBmaWx0ZXIgdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufSB3aGV0aGVyIGZpbHRlciBpcyB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEZpbHRlclZhbHVlKHt0eXBlLCB2YWx1ZX0pIHtcbiAgaWYgKCF0eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5yYW5nZTpcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUuZXZlcnkodiA9PiB2ICE9PSBudWxsICYmICFpc05hTih2KSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBCb29sZWFuKHZhbHVlLmxlbmd0aCk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5pbnB1dDpcbiAgICAgIHJldHVybiBCb29sZWFuKHZhbHVlLmxlbmd0aCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclBsb3QoZmlsdGVyLCBhbGxEYXRhKSB7XG4gIGlmIChmaWx0ZXIucGxvdFR5cGUgPT09IFBMT1RfVFlQRVMuaGlzdG9ncmFtIHx8ICFmaWx0ZXIueUF4aXMpIHtcbiAgICAvLyBoaXN0b2dyYW0gc2hvdWxkIGJlIGNhbGN1bGF0ZWQgd2hlbiBjcmVhdGUgZmlsdGVyXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3Qge21hcHBlZFZhbHVlfSA9IGZpbHRlcjtcbiAgY29uc3Qge3lBeGlzfSA9IGZpbHRlcjtcblxuICAvLyByZXR1cm4gbGluZUNoYXJ0XG4gIGNvbnN0IHNlcmllcyA9IGFsbERhdGFcbiAgICAubWFwKChkLCBpKSA9PiAoe1xuICAgICAgeDogbWFwcGVkVmFsdWVbaV0sXG4gICAgICB5OiBkW3lBeGlzLnRhYmxlRmllbGRJbmRleCAtIDFdXG4gICAgfSkpXG4gICAgLmZpbHRlcigoe3gsIHl9KSA9PiBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhc2NlbmRpbmcoYS54LCBiLngpKTtcblxuICBjb25zdCB5RG9tYWluID0gZXh0ZW50KHNlcmllcywgZCA9PiBkLnkpO1xuICBjb25zdCB4RG9tYWluID0gW3Nlcmllc1swXS54LCBzZXJpZXNbc2VyaWVzLmxlbmd0aCAtIDFdLnhdO1xuXG4gIHJldHVybiB7bGluZUNoYXJ0OiB7c2VyaWVzLCB5RG9tYWluLCB4RG9tYWlufSwgeUF4aXN9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKGZpbHRlcikge1xuICBjb25zdCBmaWx0ZXJQbG90VHlwZXMgPSBTdXBwb3J0ZWRQbG90VHlwZVtmaWx0ZXIudHlwZV07XG4gIGlmICghZmlsdGVyUGxvdFR5cGVzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWZpbHRlci55QXhpcykge1xuICAgIHJldHVybiBmaWx0ZXJQbG90VHlwZXMuZGVmYXVsdDtcbiAgfVxuXG4gIHJldHVybiBmaWx0ZXJQbG90VHlwZXNbZmlsdGVyLnlBeGlzLnR5cGVdIHx8IG51bGw7XG59XG4iXX0=