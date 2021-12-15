"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultFilter = getDefaultFilter;
exports.shouldApplyFilter = shouldApplyFilter;
exports.validatePolygonFilter = validatePolygonFilter;
exports.validateFilter = validateFilter;
exports.validateFilterWithData = validateFilterWithData;
exports.getFilterProps = getFilterProps;
exports.getFilterFunction = getFilterFunction;
exports.updateFilterDataId = updateFilterDataId;
exports.filterDataByFilterTypes = filterDataByFilterTypes;
exports.getFilterRecord = getFilterRecord;
exports.diffFilters = diffFilters;
exports.adjustValueToFilterDomain = adjustValueToFilterDomain;
exports.getNumericFieldDomain = getNumericFieldDomain;
exports.getNumericStepSize = getNumericStepSize;
exports.getTimestampFieldDomain = getTimestampFieldDomain;
exports.histogramConstruct = histogramConstruct;
exports.getHistogram = getHistogram;
exports.formatNumberByStep = formatNumberByStep;
exports.isInRange = isInRange;
exports.isInPolygon = isInPolygon;
exports.isValidTimeDomain = isValidTimeDomain;
exports.getTimeWidgetTitleFormatter = getTimeWidgetTitleFormatter;
exports.getTimeWidgetHintFormatter = getTimeWidgetHintFormatter;
exports.isValidFilterValue = isValidFilterValue;
exports.getFilterPlot = getFilterPlot;
exports.getDefaultFilterPlotType = getDefaultFilterPlotType;
exports.applyFiltersToDatasets = applyFiltersToDatasets;
exports.applyFilterFieldName = applyFilterFieldName;
exports.mergeFilterDomainStep = mergeFilterDomainStep;
exports.generatePolygonFilter = generatePolygonFilter;
exports.filterDatasetCPU = filterDatasetCPU;
exports.validateFiltersUpdateDatasets = validateFiltersUpdateDatasets;
exports.getIntervalBins = getIntervalBins;
exports.getFilterIdInFeature = exports.featureToFilterValue = exports.getPolygonFilterFunctor = exports.LAYER_FILTERS = exports.FILTER_ID_LENGTH = exports.DEFAULT_FILTER_STRUCTURE = exports.FILTER_COMPONENTS = exports.LIMITED_FILTER_EFFECT_PROPS = exports.FILTER_UPDATER_PROPS = exports.PLOT_TYPES = exports.enlargedHistogramBins = exports.histogramBins = exports.TimestampStepMap = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _d3Array = require("d3-array");

var _keymirror = _interopRequireDefault(require("keymirror"));

var _console = require("global/console");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.isequal"));

var _booleanWithin = _interopRequireDefault(require("@turf/boolean-within"));

var _helpers = require("@turf/helpers");

var _decimal = require("decimal.js");

var _defaultSettings = require("../constants/default-settings");

var _dataUtils = require("./data-utils");

var ScaleUtils = _interopRequireWildcard(require("./data-scale-utils"));

var _types = require("../layers/types");

var _utils = require("./utils");

var _h3Utils = require("../layers/h3-hexagon-layer/h3-utils");

var _FILTER_TYPES$timeRan, _FILTER_TYPES$range, _SupportedPlotType, _FILTER_COMPONENTS;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// TYPE

/** @typedef {import('./table-utils/kepler-table').FilterRecord} FilterRecord */

/** @typedef {import('./filter-utils').FilterResult} FilterResult */
var TimestampStepMap = [{
  max: 1,
  step: 0.05
}, {
  max: 10,
  step: 0.1
}, {
  max: 100,
  step: 1
}, {
  max: 500,
  step: 5
}, {
  max: 1000,
  step: 10
}, {
  max: 5000,
  step: 50
}, {
  max: Number.POSITIVE_INFINITY,
  step: 1000
}];
exports.TimestampStepMap = TimestampStepMap;
var histogramBins = 30;
exports.histogramBins = histogramBins;
var enlargedHistogramBins = 100;
exports.enlargedHistogramBins = enlargedHistogramBins;
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationYear = durationDay * 365;
var PLOT_TYPES = (0, _keymirror["default"])({
  histogram: null,
  lineChart: null
});
exports.PLOT_TYPES = PLOT_TYPES;
var FILTER_UPDATER_PROPS = (0, _keymirror["default"])({
  dataId: null,
  name: null,
  layerId: null
});
exports.FILTER_UPDATER_PROPS = FILTER_UPDATER_PROPS;
var LIMITED_FILTER_EFFECT_PROPS = (0, _keymirror["default"])((0, _defineProperty2["default"])({}, FILTER_UPDATER_PROPS.name, null));
/**
 * Max number of filter value buffers that deck.gl provides
 */

exports.LIMITED_FILTER_EFFECT_PROPS = LIMITED_FILTER_EFFECT_PROPS;
var SupportedPlotType = (_SupportedPlotType = {}, (0, _defineProperty2["default"])(_SupportedPlotType, _defaultSettings.FILTER_TYPES.timeRange, (_FILTER_TYPES$timeRan = {
  "default": 'histogram'
}, (0, _defineProperty2["default"])(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty2["default"])(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$timeRan)), (0, _defineProperty2["default"])(_SupportedPlotType, _defaultSettings.FILTER_TYPES.range, (_FILTER_TYPES$range = {
  "default": 'histogram'
}, (0, _defineProperty2["default"])(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty2["default"])(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$range)), _SupportedPlotType);
var FILTER_COMPONENTS = (_FILTER_COMPONENTS = {}, (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.select, 'SingleSelectFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.multiSelect, 'MultiSelectFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.timeRange, 'TimeRangeFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.range, 'RangeFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.polygon, 'PolygonFilter'), _FILTER_COMPONENTS);
exports.FILTER_COMPONENTS = FILTER_COMPONENTS;
var DEFAULT_FILTER_STRUCTURE = {
  dataId: [],
  // [string]
  freeze: false,
  id: null,
  // time range filter specific
  fixedDomain: false,
  enlarged: false,
  isAnimating: false,
  animationWindow: _defaultSettings.ANIMATION_WINDOW.free,
  speed: 1,
  // field specific
  name: [],
  // string
  type: null,
  fieldIdx: [],
  // [integer]
  domain: null,
  value: null,
  // plot
  plotType: PLOT_TYPES.histogram,
  yAxis: null,
  interval: null,
  // mode
  gpu: false
};
exports.DEFAULT_FILTER_STRUCTURE = DEFAULT_FILTER_STRUCTURE;
var FILTER_ID_LENGTH = 4;
exports.FILTER_ID_LENGTH = FILTER_ID_LENGTH;
var LAYER_FILTERS = [_defaultSettings.FILTER_TYPES.polygon];
/**
 * Generates a filter with a dataset id as dataId
 * @type {typeof import('./filter-utils').getDefaultFilter}
 */

exports.LAYER_FILTERS = LAYER_FILTERS;

function getDefaultFilter(dataId) {
  return _objectSpread(_objectSpread({}, DEFAULT_FILTER_STRUCTURE), {}, {
    // store it as dataId and it could be one or many
    dataId: (0, _utils.toArray)(dataId),
    id: (0, _utils.generateHashId)(FILTER_ID_LENGTH)
  });
}
/**
 * Check if a filter is valid based on the given dataId
 * @param  filter to validate
 * @param  datasetId id to validate filter against
 * @return true if a filter is valid, false otherwise
 * @type {typeof import('./filter-utils').shouldApplyFilter}
 */


function shouldApplyFilter(filter, datasetId) {
  var dataIds = (0, _utils.toArray)(filter.dataId);
  return dataIds.includes(datasetId) && filter.value !== null;
}
/**
 * Validates and modifies polygon filter structure
 * @param dataset
 * @param filter
 * @param layers
 * @return - {filter, dataset}
 * @type {typeof import('./filter-utils').validatePolygonFilter}
 */


function validatePolygonFilter(dataset, filter, layers) {
  var failed = {
    dataset: dataset,
    filter: null
  };
  var value = filter.value,
      layerId = filter.layerId,
      type = filter.type,
      dataId = filter.dataId;

  if (!layerId || !isValidFilterValue(type, value)) {
    return failed;
  }

  var isValidDataset = dataId.includes(dataset.id);

  if (!isValidDataset) {
    return failed;
  }

  var layer = layers.find(function (l) {
    return layerId.includes(l.id);
  });

  if (!layer) {
    return failed;
  }

  return {
    filter: _objectSpread(_objectSpread({}, filter), {}, {
      freeze: true,
      fieldIdx: []
    }),
    dataset: dataset
  };
}
/**
 * Custom filter validators
 */


var filterValidators = (0, _defineProperty2["default"])({}, _defaultSettings.FILTER_TYPES.polygon, validatePolygonFilter);
/**
 * Default validate filter function
 * @param dataset
 * @param filter
 * @return - {filter, dataset}
 * @type {typeof import('./filter-utils').validateFilter}
 */

function validateFilter(dataset, filter) {
  // match filter.dataId
  var failed = {
    dataset: dataset,
    filter: null
  };
  var filterDataId = (0, _utils.toArray)(filter.dataId);
  var filterDatasetIndex = filterDataId.indexOf(dataset.id);

  if (filterDatasetIndex < 0) {
    // the current filter is not mapped against the current dataset
    return failed;
  }

  var initializeFilter = _objectSpread(_objectSpread(_objectSpread({}, getDefaultFilter(filter.dataId)), filter), {}, {
    dataId: filterDataId,
    name: (0, _utils.toArray)(filter.name)
  });

  var fieldName = initializeFilter.name[filterDatasetIndex];

  var _applyFilterFieldName = applyFilterFieldName(initializeFilter, dataset, fieldName, filterDatasetIndex, {
    mergeDomain: true
  }),
      updatedFilter = _applyFilterFieldName.filter,
      updatedDataset = _applyFilterFieldName.dataset;

  if (!updatedFilter) {
    return failed;
  }

  updatedFilter.value = adjustValueToFilterDomain(filter.value, updatedFilter);
  updatedFilter.enlarged = typeof filter.enlarged === 'boolean' ? filter.enlarged : updatedFilter.enlarged;

  if (updatedFilter.value === null) {
    // cannot adjust saved value to filter
    return failed;
  }

  return {
    filter: validateFilterYAxis(updatedFilter, updatedDataset),
    dataset: updatedDataset
  };
}
/**
 * Validate saved filter config with new data,
 * calculate domain and fieldIdx based new fields and data
 *
 * @param dataset
 * @param filter - filter to be validate
 * @param layers - layers
 * @return validated filter
 * @type {typeof import('./filter-utils').validateFilterWithData}
 */


function validateFilterWithData(dataset, filter, layers) {
  // @ts-ignore
  return filterValidators.hasOwnProperty(filter.type) ? filterValidators[filter.type](dataset, filter, layers) : validateFilter(dataset, filter);
}
/**
 * Validate YAxis
 * @param filter
 * @param dataset
 * @return {*}
 */


function validateFilterYAxis(filter, dataset) {
  // TODO: validate yAxis against other datasets
  var fields = dataset.fields;
  var _filter = filter,
      yAxis = _filter.yAxis; // TODO: validate yAxis against other datasets

  if (yAxis) {
    var matchedAxis = fields.find(function (_ref) {
      var name = _ref.name,
          type = _ref.type;
      return name === yAxis.name && type === yAxis.type;
    });
    filter = matchedAxis ? _objectSpread(_objectSpread({}, filter), {}, {
      yAxis: matchedAxis
    }, getFilterPlot(_objectSpread(_objectSpread({}, filter), {}, {
      yAxis: matchedAxis
    }), dataset)) : filter;
  }

  return filter;
}
/**
 * Get default filter prop based on field type
 *
 * @param field
 * @param fieldDomain
 * @returns default filter
 * @type {typeof import('./filter-utils').getFilterProps}
 */


function getFilterProps(field, fieldDomain) {
  var filterProps = _objectSpread(_objectSpread({}, fieldDomain), {}, {
    fieldType: field.type
  });

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        value: fieldDomain.domain,
        type: _defaultSettings.FILTER_TYPES.range,
        typeOptions: [_defaultSettings.FILTER_TYPES.range],
        gpu: true
      });

    case _defaultSettings.ALL_FIELD_TYPES["boolean"]:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.select,
        value: true,
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.array:
    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.multiSelect,
        value: [],
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.timeRange,
        enlarged: true,
        fixedDomain: true,
        value: filterProps.domain,
        gpu: true
      });

    default:
      return {};
  }
}

var getPolygonFilterFunctor = function getPolygonFilterFunctor(layer, filter) {
  var getPosition = layer.getPositionAccessor();

  switch (layer.type) {
    case _types.LAYER_TYPES.point:
    case _types.LAYER_TYPES.icon:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };

    case _types.LAYER_TYPES.arc:
    case _types.LAYER_TYPES.line:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && [[pos[0], pos[1]], [pos[3], pos[4]]].every(function (point) {
          return isInPolygon(point, filter.value);
        });
      };

    case _types.LAYER_TYPES.hexagonId:
      if (layer.dataToFeature && layer.dataToFeature.centroids) {
        return function (data, index) {
          // null or getCentroid({id})
          var centroid = layer.dataToFeature.centroids[index];
          return centroid && isInPolygon(centroid, filter.value);
        };
      }

      return function (data) {
        var id = getPosition({
          data: data
        });

        if (!(0, _h3Utils.h3IsValid)(id)) {
          return false;
        }

        var pos = (0, _h3Utils.getCentroid)({
          id: id
        });
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };

    default:
      return function () {
        return true;
      };
  }
};
/**
 * @param field dataset Field
 * @param dataId Dataset id
 * @param filter Filter object
 * @param layers list of layers to filter upon
 * @return filterFunction
 * @type {typeof import('./filter-utils').getFilterFunction}
 */


exports.getPolygonFilterFunctor = getPolygonFilterFunctor;

function getFilterFunction(field, dataId, filter, layers) {
  // field could be null in polygon filter
  var valueAccessor = field ? field.valueAccessor : function (data) {
    return null;
  };

  var defaultFunc = function defaultFunc(d) {
    return true;
  };

  switch (filter.type) {
    case _defaultSettings.FILTER_TYPES.range:
      return function (data) {
        return isInRange(valueAccessor(data), filter.value);
      };

    case _defaultSettings.FILTER_TYPES.multiSelect:
      return function (data) {
        var value = valueAccessor(data);

        if (Array.isArray(value)) {
          return value.some(function (v) {
            return filter.value.includes(v);
          });
        }

        return filter.value.includes(value);
      };

    case _defaultSettings.FILTER_TYPES.select:
      return function (data) {
        return valueAccessor(data) === filter.value;
      };

    case _defaultSettings.FILTER_TYPES.timeRange:
      if (!field) {
        return defaultFunc;
      }

      var mappedValue = (0, _lodash["default"])(field, ['filterProps', 'mappedValue']);
      var accessor = Array.isArray(mappedValue) ? function (data, index) {
        return mappedValue[index];
      } : function (data) {
        return (0, _dataUtils.timeToUnixMilli)(valueAccessor(data), field.format);
      };
      return function (data, index) {
        return isInRange(accessor(data, index), filter.value);
      };

    case _defaultSettings.FILTER_TYPES.polygon:
      if (!layers || !layers.length) {
        return defaultFunc;
      } // @ts-ignore


      var layerFilterFunctions = filter.layerId.map(function (id) {
        return layers.find(function (l) {
          return l.id === id;
        });
      }).filter(function (l) {
        return l && l.config.dataId === dataId;
      }).map(function (layer) {
        return getPolygonFilterFunctor(layer, filter);
      });
      return function (data, index) {
        return layerFilterFunctions.every(function (filterFunc) {
          return filterFunc(data, index);
        });
      };

    default:
      return defaultFunc;
  }
}

function updateFilterDataId(dataId) {
  return getDefaultFilter(dataId);
}
/**
 * @type {typeof import('./filter-utils').filterDataByFilterTypes}
 */


function filterDataByFilterTypes(_ref2, allData) {
  var dynamicDomainFilters = _ref2.dynamicDomainFilters,
      cpuFilters = _ref2.cpuFilters,
      filterFuncs = _ref2.filterFuncs;

  var result = _objectSpread(_objectSpread({}, dynamicDomainFilters ? {
    filteredIndexForDomain: []
  } : {}), cpuFilters ? {
    filteredIndex: []
  } : {});

  var _loop = function _loop(i) {
    var d = allData[i];
    var matchForDomain = dynamicDomainFilters && dynamicDomainFilters.every(function (filter) {
      return filterFuncs[filter.id](d, i);
    });

    if (matchForDomain) {
      // @ts-ignore
      result.filteredIndexForDomain.push(i);
    }

    var matchForRender = cpuFilters && cpuFilters.every(function (filter) {
      return filterFuncs[filter.id](d, i);
    });

    if (matchForRender) {
      // @ts-ignore
      result.filteredIndex.push(i);
    }
  };

  for (var i = 0; i < allData.length; i++) {
    _loop(i);
  }

  return result;
}
/**
 * Get a record of filters based on domain type and gpu / cpu
 * @type {typeof import('./filter-utils').getFilterRecord}
 */


function getFilterRecord(dataId, filters) {
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  /**
   * @type {FilterRecord}
   */
  var filterRecord = {
    dynamicDomain: [],
    fixedDomain: [],
    cpu: [],
    gpu: []
  };
  filters.forEach(function (f) {
    if (isValidFilterValue(f.type, f.value) && (0, _utils.toArray)(f.dataId).includes(dataId)) {
      (f.fixedDomain || opt.ignoreDomain ? filterRecord.fixedDomain : filterRecord.dynamicDomain).push(f);
      (f.gpu && !opt.cpuOnly ? filterRecord.gpu : filterRecord.cpu).push(f);
    }
  });
  return filterRecord;
}
/**
 * Compare filter records to get what has changed
 * @type {typeof import('./filter-utils').diffFilters}
 */


function diffFilters(filterRecord) {
  var oldFilterRecord = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var filterChanged = {};
  Object.entries(filterRecord).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        record = _ref4[0],
        items = _ref4[1];

    items.forEach(function (filter) {
      var oldFilter = (oldFilterRecord[record] || []).find(function (f) {
        return f.id === filter.id;
      });

      if (!oldFilter) {
        // added
        filterChanged = (0, _utils.set)([record, filter.id], 'added', filterChanged);
      } else {
        // check  what has changed
        ['name', 'value', 'dataId'].forEach(function (prop) {
          if (filter[prop] !== oldFilter[prop]) {
            filterChanged = (0, _utils.set)([record, filter.id], "".concat(prop, "_changed"), filterChanged);
          }
        });
      }
    });
    (oldFilterRecord[record] || []).forEach(function (oldFilter) {
      // deleted
      if (!items.find(function (f) {
        return f.id === oldFilter.id;
      })) {
        filterChanged = (0, _utils.set)([record, oldFilter.id], 'deleted', filterChanged);
      }
    });

    if (!filterChanged[record]) {
      filterChanged[record] = null;
    }
  }); // @ts-ignore

  return filterChanged;
}
/**
 * Call by parsing filters from URL
 * Check if value of filter within filter domain, if not adjust it to match
 * filter domain
 *
 * @type {typeof import('./filter-utils').adjustValueToFilterDomain}
 * @returns value - adjusted value to match filter or null to remove filter
 */

/* eslint-disable complexity */


function adjustValueToFilterDomain(value, _ref5) {
  var domain = _ref5.domain,
      type = _ref5.type;

  if (!domain || !type) {
    return false;
  }

  switch (type) {
    case _defaultSettings.FILTER_TYPES.range:
    case _defaultSettings.FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(function (d) {
          return d;
        });
      }

      return value.map(function (d, i) {
        return (0, _dataUtils.notNullorUndefined)(d) && isInRange(d, domain) ? d : domain[i];
      });

    case _defaultSettings.FILTER_TYPES.multiSelect:
      if (!Array.isArray(value)) {
        return [];
      }

      var filteredValue = value.filter(function (d) {
        return domain.includes(d);
      });
      return filteredValue.length ? filteredValue : [];

    case _defaultSettings.FILTER_TYPES.select:
      return domain.includes(value) ? value : true;

    default:
      return null;
  }
}
/* eslint-enable complexity */

/**
 * Calculate numeric domain and suitable step
 *
 * @type {typeof import('./filter-utils').getNumericFieldDomain}
 */


function getNumericFieldDomain(data, valueAccessor) {
  var domain = [0, 1];
  var step = 0.1;
  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];

  if (Array.isArray(data) && data.length > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    var diff = domain[1] - domain[0]; // in case equal domain, [96, 96], which will break quantize scale

    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  } // @ts-ignore


  var _getHistogram = getHistogram(domain, mappedValue),
      histogram = _getHistogram.histogram,
      enlargedHistogram = _getHistogram.enlargedHistogram;

  return {
    domain: domain,
    step: step,
    histogram: histogram,
    enlargedHistogram: enlargedHistogram
  };
}
/**
 * Calculate step size for range and timerange filter
 *
 * @type {typeof import('./filter-utils').getNumericStepSize}
 */


function getNumericStepSize(diff) {
  diff = Math.abs(diff);

  if (diff > 100) {
    return 1;
  } else if (diff > 3) {
    return 0.01;
  } else if (diff > 1) {
    return 0.001;
  } // Try to get at least 1000 steps - and keep the step size below that of
  // the (diff > 1) case.


  var x = diff / 1000; // Find the exponent and truncate to 10 to the power of that exponent

  var exponentialForm = x.toExponential();
  var exponent = parseFloat(exponentialForm.split('e')[1]); // Getting ready for node 12
  // this is why we need decimal.js
  // Math.pow(10, -5) = 0.000009999999999999999
  // the above result shows in browser and node 10
  // node 12 behaves correctly

  return new _decimal.Decimal(10).pow(exponent).toNumber();
}
/**
 * Calculate timestamp domain and suitable step
 *
 * @type {typeof import('./filter-utils').getTimestampFieldDomain}
 */


function getTimestampFieldDomain(data, valueAccessor) {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain
  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  var domain = ScaleUtils.getLinearDomain(mappedValue);
  var defaultTimeFormat = getTimeWidgetTitleFormatter(domain);
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

  return {
    domain: domain,
    step: step,
    mappedValue: mappedValue,
    histogram: histogram,
    enlargedHistogram: enlargedHistogram,
    defaultTimeFormat: defaultTimeFormat
  };
}
/**
 *
 * @type {typeof import('./filter-utils').histogramConstruct}
 */


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
 * @type {typeof import('./filter-utils').getHistogram}
 */


function getHistogram(domain, mappedValue) {
  var histogram = histogramConstruct(domain, mappedValue, histogramBins);
  var enlargedHistogram = histogramConstruct(domain, mappedValue, enlargedHistogramBins);
  return {
    histogram: histogram,
    enlargedHistogram: enlargedHistogram
  };
}
/**
 * round number based on step
 *
 * @param {Number} val
 * @param {Number} step
 * @param {string} bound
 * @returns {Number} rounded number
 */


function formatNumberByStep(val, step, bound) {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}
/**
 *
 * @type {typeof import('./filter-utils').isInRange}
 */


function isInRange(val, domain) {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
}
/**
 * Determines whether a point is within the provided polygon
 *
 * @param point as input search [lat, lng]
 * @param polygon Points must be within these (Multi)Polygon(s)
 * @return {boolean}
 */


function isInPolygon(point, polygon) {
  return (0, _booleanWithin["default"])((0, _helpers.point)(point), polygon);
}

function isValidTimeDomain(domain) {
  return Array.isArray(domain) && domain.every(Number.isFinite);
}

function getTimeWidgetTitleFormatter(domain) {
  if (!isValidTimeDomain(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0]; // Local aware formats
  // https://momentjs.com/docs/#/parsing/string-format

  return diff > durationYear ? 'L' : diff > durationDay ? 'L LT' : 'L LTS';
}

function getTimeWidgetHintFormatter(domain) {
  if (!isValidTimeDomain(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationWeek ? 'L' : diff > durationDay ? 'L LT' : diff > durationHour ? 'LT' : 'LTS';
}
/**
 * Sanity check on filters to prepare for save
 * @type {typeof import('./filter-utils').isValidFilterValue}
 */

/* eslint-disable complexity */


function isValidFilterValue(type, value) {
  if (!type) {
    return false;
  }

  switch (type) {
    case _defaultSettings.FILTER_TYPES.select:
      return value === true || value === false;

    case _defaultSettings.FILTER_TYPES.range:
    case _defaultSettings.FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(function (v) {
        return v !== null && !isNaN(v);
      });

    case _defaultSettings.FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case _defaultSettings.FILTER_TYPES.input:
      return Boolean(value.length);

    case _defaultSettings.FILTER_TYPES.polygon:
      var coordinates = (0, _lodash["default"])(value, ['geometry', 'coordinates']);
      return Boolean(value && value.id && coordinates);

    default:
      return true;
  }
}
/**
 *
 * @type {typeof import('./filter-utils').getFilterPlot}
 */


function getFilterPlot(filter, dataset) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  var _filter$mappedValue = filter.mappedValue,
      mappedValue = _filter$mappedValue === void 0 ? [] : _filter$mappedValue;
  var yAxis = filter.yAxis;
  var fieldIdx = dataset.getColumnFieldIdx(yAxis.name);

  if (fieldIdx < 0) {
    _console.console.warn("yAxis ".concat(yAxis.name, " does not exist in dataset"));

    return {
      lineChart: {},
      yAxis: yAxis
    };
  } // return lineChart


  var series = dataset.allData.map(function (d, i) {
    return {
      x: mappedValue[i],
      y: d[fieldIdx]
    };
  }).filter(function (_ref6) {
    var x = _ref6.x,
        y = _ref6.y;
    return Number.isFinite(x) && Number.isFinite(y);
  }).sort(function (a, b) {
    return (0, _d3Array.ascending)(a.x, b.x);
  });
  var yDomain = (0, _d3Array.extent)(series, function (d) {
    return d.y;
  });
  var xDomain = [series[0].x, series[series.length - 1].x];
  return {
    lineChart: {
      series: series,
      yDomain: yDomain,
      xDomain: xDomain
    },
    yAxis: yAxis
  };
}

function getDefaultFilterPlotType(filter) {
  var filterPlotTypes = SupportedPlotType[filter.type];

  if (!filterPlotTypes) {
    return null;
  }

  if (!filter.yAxis) {
    return filterPlotTypes["default"];
  }

  return filterPlotTypes[filter.yAxis.type] || null;
}
/**
 *
 * @param datasetIds list of dataset ids to be filtered
 * @param datasets all datasets
 * @param filters all filters to be applied to datasets
 * @return datasets - new updated datasets
 * @type {typeof import('./filter-utils').applyFiltersToDatasets}
 */


function applyFiltersToDatasets(datasetIds, datasets, filters, layers) {
  var dataIds = (0, _utils.toArray)(datasetIds);
  return dataIds.reduce(function (acc, dataId) {
    var layersToFilter = (layers || []).filter(function (l) {
      return l.config.dataId === dataId;
    });
    var appliedFilters = filters.filter(function (d) {
      return shouldApplyFilter(d, dataId);
    });
    var table = datasets[dataId];
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, dataId, table.filterTable(appliedFilters, layersToFilter, {})));
  }, datasets);
}
/**
 * Applies a new field name value to fielter and update both filter and dataset
 * @param filter - to be applied the new field name on
 * @param dataset - dataset the field belongs to
 * @param fieldName - field.name
 * @param filterDatasetIndex - field.name
 * @param option
 * @return - {filter, datasets}
 * @type {typeof import('./filter-utils').applyFilterFieldName}
 */


function applyFilterFieldName(filter, dataset, fieldName) {
  var filterDatasetIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var option = arguments.length > 4 ? arguments[4] : undefined;
  // using filterDatasetIndex we can filter only the specified dataset
  var mergeDomain = option && option.hasOwnProperty('mergeDomain') ? option.mergeDomain : false;
  var fieldIndex = dataset.getColumnFieldIdx(fieldName); // if no field with same name is found, move to the next datasets

  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {
      filter: null,
      dataset: dataset
    };
  } // TODO: validate field type


  var filterProps = dataset.getColumnFilterProps(fieldName);

  var newFilter = _objectSpread(_objectSpread({}, mergeDomain ? mergeFilterDomainStep(filter, filterProps) : _objectSpread(_objectSpread({}, filter), filterProps)), {}, {
    name: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.name)), (0, _defineProperty2["default"])({}, filterDatasetIndex, fieldName)),
    fieldIdx: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.fieldIdx)), (0, _defineProperty2["default"])({}, filterDatasetIndex, fieldIndex)),
    // TODO, since we allow to add multiple fields to a filter we can no longer freeze the filter
    freeze: true
  });

  return {
    filter: newFilter,
    dataset: dataset
  };
}
/**
 * Merge one filter with other filter prop domain
 * @type {typeof import('./filter-utils').mergeFilterDomainStep}
 */

/* eslint-disable complexity */


function mergeFilterDomainStep(filter, filterProps) {
  if (!filter) {
    return null;
  }

  if (!filterProps) {
    return filter;
  }

  if (filter.fieldType && filter.fieldType !== filterProps.fieldType || !filterProps.domain) {
    return filter;
  }

  var combinedDomain = !filter.domain ? filterProps.domain : [].concat((0, _toConsumableArray2["default"])(filter.domain || []), (0, _toConsumableArray2["default"])(filterProps.domain || [])).sort(function (a, b) {
    return a - b;
  });

  var newFilter = _objectSpread(_objectSpread(_objectSpread({}, filter), filterProps), {}, {
    domain: [combinedDomain[0], combinedDomain[combinedDomain.length - 1]]
  });

  switch (filterProps.fieldType) {
    case _defaultSettings.ALL_FIELD_TYPES.array:
    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread(_objectSpread({}, newFilter), {}, {
        domain: (0, _dataUtils.unique)(combinedDomain).sort()
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      // @ts-ignore
      var step = filter.step < filterProps.step ? filter.step : filterProps.step;
      return _objectSpread(_objectSpread({}, newFilter), {}, {
        step: step
      });

    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
    default:
      return newFilter;
  }
}
/* eslint-enable complexity */

/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').featureToFilterValue}
 */


var featureToFilterValue = function featureToFilterValue(feature, filterId) {
  var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _objectSpread(_objectSpread({}, feature), {}, {
    id: feature.id,
    properties: _objectSpread(_objectSpread(_objectSpread({}, feature.properties), properties), {}, {
      filterId: filterId
    })
  });
};
/**
 * @type {typeof import('./filter-utils').getFilterIdInFeature}
 */


exports.featureToFilterValue = featureToFilterValue;

var getFilterIdInFeature = function getFilterIdInFeature(f) {
  return (0, _lodash["default"])(f, ['properties', 'filterId']);
};
/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').generatePolygonFilter}
 */


exports.getFilterIdInFeature = getFilterIdInFeature;

function generatePolygonFilter(layers, feature) {
  var dataId = layers.map(function (l) {
    return l.config.dataId;
  }).filter(function (d) {
    return d;
  });
  var layerId = layers.map(function (l) {
    return l.id;
  });
  var name = layers.map(function (l) {
    return l.config.label;
  }); // @ts-ignore

  var filter = getDefaultFilter(dataId);
  return _objectSpread(_objectSpread({}, filter), {}, {
    fixedDomain: true,
    type: _defaultSettings.FILTER_TYPES.polygon,
    name: name,
    layerId: layerId,
    value: featureToFilterValue(feature, filter.id, {
      isVisible: true
    })
  });
}
/**
 * Run filter entirely on CPU
 * @type {typeof import('./filter-utils').filterDatasetCPU}
 */


function filterDatasetCPU(state, dataId) {
  var datasetFilters = state.filters.filter(function (f) {
    return f.dataId.includes(dataId);
  });
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  var cpuFilteredDataset = dataset.filterTableCPU(datasetFilters, state.layers);
  return (0, _utils.set)(['datasets', dataId], cpuFilteredDataset, state);
}
/**
 * Validate parsed filters with datasets and add filterProps to field
 * @type {typeof import('./filter-utils').validateFiltersUpdateDatasets}
 */


function validateFiltersUpdateDatasets(state) {
  var filtersToValidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validated = [];
  var failed = [];
  var datasets = state.datasets;
  var updatedDatasets = datasets; // merge filters

  filtersToValidate.forEach(function (filter) {
    // we can only look for datasets define in the filter dataId
    var datasetIds = (0, _utils.toArray)(filter.dataId); // we can merge a filter only if all datasets in filter.dataId are loaded

    if (datasetIds.every(function (d) {
      return datasets[d];
    })) {
      // all datasetIds in filter must be present the state datasets
      var _datasetIds$reduce = datasetIds.reduce(function (acc, datasetId) {
        var dataset = updatedDatasets[datasetId];
        var layers = state.layers.filter(function (l) {
          return l.config.dataId === dataset.id;
        });

        var _validateFilterWithDa = validateFilterWithData(acc.augmentedDatasets[datasetId] || dataset, filter, layers),
            updatedFilter = _validateFilterWithDa.filter,
            updatedDataset = _validateFilterWithDa.dataset;

        if (updatedFilter) {
          return _objectSpread(_objectSpread({}, acc), {}, {
            // merge filter props
            filter: acc.filter ? _objectSpread(_objectSpread({}, acc.filter), mergeFilterDomainStep(acc, updatedFilter)) : updatedFilter,
            applyToDatasets: [].concat((0, _toConsumableArray2["default"])(acc.applyToDatasets), [datasetId]),
            augmentedDatasets: _objectSpread(_objectSpread({}, acc.augmentedDatasets), {}, (0, _defineProperty2["default"])({}, datasetId, updatedDataset))
          });
        }

        return acc;
      }, {
        filter: null,
        applyToDatasets: [],
        augmentedDatasets: {}
      }),
          validatedFilter = _datasetIds$reduce.filter,
          applyToDatasets = _datasetIds$reduce.applyToDatasets,
          augmentedDatasets = _datasetIds$reduce.augmentedDatasets;

      if (validatedFilter && (0, _lodash2["default"])(datasetIds, applyToDatasets)) {
        validated.push(validatedFilter);
        updatedDatasets = _objectSpread(_objectSpread({}, updatedDatasets), augmentedDatasets);
      }
    } else {
      failed.push(filter);
    }
  });
  return {
    validated: validated,
    failed: failed,
    updatedDatasets: updatedDatasets
  };
}
/**
 * Retrieve interval bins for time filter
 * @type {typeof import('./filter-utils').getIntervalBins}
 */


function getIntervalBins(filter) {
  var _filter$plotType;

  var bins = filter.bins;
  var interval = (_filter$plotType = filter.plotType) === null || _filter$plotType === void 0 ? void 0 : _filter$plotType.interval;

  if (!interval || !bins || Object.keys(bins).length === 0) {
    return null;
  }

  var values = Object.values(bins);
  return values[0] ? values[0][interval] : null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImhpc3RvZ3JhbUJpbnMiLCJlbmxhcmdlZEhpc3RvZ3JhbUJpbnMiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJkdXJhdGlvblllYXIiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiRklMVEVSX1VQREFURVJfUFJPUFMiLCJkYXRhSWQiLCJuYW1lIiwibGF5ZXJJZCIsIkxJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyIsIlN1cHBvcnRlZFBsb3RUeXBlIiwiRklMVEVSX1RZUEVTIiwidGltZVJhbmdlIiwiQUxMX0ZJRUxEX1RZUEVTIiwiaW50ZWdlciIsInJlYWwiLCJyYW5nZSIsIkZJTFRFUl9DT01QT05FTlRTIiwic2VsZWN0IiwibXVsdGlTZWxlY3QiLCJwb2x5Z29uIiwiREVGQVVMVF9GSUxURVJfU1RSVUNUVVJFIiwiZnJlZXplIiwiaWQiLCJmaXhlZERvbWFpbiIsImVubGFyZ2VkIiwiaXNBbmltYXRpbmciLCJhbmltYXRpb25XaW5kb3ciLCJBTklNQVRJT05fV0lORE9XIiwiZnJlZSIsInNwZWVkIiwidHlwZSIsImZpZWxkSWR4IiwiZG9tYWluIiwidmFsdWUiLCJwbG90VHlwZSIsInlBeGlzIiwiaW50ZXJ2YWwiLCJncHUiLCJGSUxURVJfSURfTEVOR1RIIiwiTEFZRVJfRklMVEVSUyIsImdldERlZmF1bHRGaWx0ZXIiLCJzaG91bGRBcHBseUZpbHRlciIsImZpbHRlciIsImRhdGFzZXRJZCIsImRhdGFJZHMiLCJpbmNsdWRlcyIsInZhbGlkYXRlUG9seWdvbkZpbHRlciIsImRhdGFzZXQiLCJsYXllcnMiLCJmYWlsZWQiLCJpc1ZhbGlkRmlsdGVyVmFsdWUiLCJpc1ZhbGlkRGF0YXNldCIsImxheWVyIiwiZmluZCIsImwiLCJmaWx0ZXJWYWxpZGF0b3JzIiwidmFsaWRhdGVGaWx0ZXIiLCJmaWx0ZXJEYXRhSWQiLCJmaWx0ZXJEYXRhc2V0SW5kZXgiLCJpbmRleE9mIiwiaW5pdGlhbGl6ZUZpbHRlciIsImZpZWxkTmFtZSIsImFwcGx5RmlsdGVyRmllbGROYW1lIiwibWVyZ2VEb21haW4iLCJ1cGRhdGVkRmlsdGVyIiwidXBkYXRlZERhdGFzZXQiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwidmFsaWRhdGVGaWx0ZXJZQXhpcyIsInZhbGlkYXRlRmlsdGVyV2l0aERhdGEiLCJoYXNPd25Qcm9wZXJ0eSIsImZpZWxkcyIsIm1hdGNoZWRBeGlzIiwiZ2V0RmlsdGVyUGxvdCIsImdldEZpbHRlclByb3BzIiwiZmllbGQiLCJmaWVsZERvbWFpbiIsImZpbHRlclByb3BzIiwiZmllbGRUeXBlIiwidHlwZU9wdGlvbnMiLCJhcnJheSIsInN0cmluZyIsImRhdGUiLCJ0aW1lc3RhbXAiLCJnZXRQb2x5Z29uRmlsdGVyRnVuY3RvciIsImdldFBvc2l0aW9uIiwiZ2V0UG9zaXRpb25BY2Nlc3NvciIsIkxBWUVSX1RZUEVTIiwicG9pbnQiLCJpY29uIiwiZGF0YSIsInBvcyIsImV2ZXJ5IiwiaXNGaW5pdGUiLCJpc0luUG9seWdvbiIsImFyYyIsImxpbmUiLCJoZXhhZ29uSWQiLCJkYXRhVG9GZWF0dXJlIiwiY2VudHJvaWRzIiwiaW5kZXgiLCJjZW50cm9pZCIsImdldEZpbHRlckZ1bmN0aW9uIiwidmFsdWVBY2Nlc3NvciIsImRlZmF1bHRGdW5jIiwiZCIsImlzSW5SYW5nZSIsIkFycmF5IiwiaXNBcnJheSIsInNvbWUiLCJ2IiwibWFwcGVkVmFsdWUiLCJhY2Nlc3NvciIsImZvcm1hdCIsImxlbmd0aCIsImxheWVyRmlsdGVyRnVuY3Rpb25zIiwibWFwIiwiY29uZmlnIiwiZmlsdGVyRnVuYyIsInVwZGF0ZUZpbHRlckRhdGFJZCIsImZpbHRlckRhdGFCeUZpbHRlclR5cGVzIiwiYWxsRGF0YSIsImR5bmFtaWNEb21haW5GaWx0ZXJzIiwiY3B1RmlsdGVycyIsImZpbHRlckZ1bmNzIiwicmVzdWx0IiwiZmlsdGVyZWRJbmRleEZvckRvbWFpbiIsImZpbHRlcmVkSW5kZXgiLCJpIiwibWF0Y2hGb3JEb21haW4iLCJwdXNoIiwibWF0Y2hGb3JSZW5kZXIiLCJnZXRGaWx0ZXJSZWNvcmQiLCJmaWx0ZXJzIiwib3B0IiwiZmlsdGVyUmVjb3JkIiwiZHluYW1pY0RvbWFpbiIsImNwdSIsImZvckVhY2giLCJmIiwiaWdub3JlRG9tYWluIiwiY3B1T25seSIsImRpZmZGaWx0ZXJzIiwib2xkRmlsdGVyUmVjb3JkIiwiZmlsdGVyQ2hhbmdlZCIsIk9iamVjdCIsImVudHJpZXMiLCJyZWNvcmQiLCJpdGVtcyIsIm9sZEZpbHRlciIsInByb3AiLCJmaWx0ZXJlZFZhbHVlIiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiU2NhbGVVdGlscyIsImdldExpbmVhckRvbWFpbiIsImRpZmYiLCJnZXROdW1lcmljU3RlcFNpemUiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJnZXRIaXN0b2dyYW0iLCJlbmxhcmdlZEhpc3RvZ3JhbSIsIk1hdGgiLCJhYnMiLCJ4IiwiZXhwb25lbnRpYWxGb3JtIiwidG9FeHBvbmVudGlhbCIsImV4cG9uZW50IiwicGFyc2VGbG9hdCIsInNwbGl0IiwiRGVjaW1hbCIsInBvdyIsInRvTnVtYmVyIiwiZ2V0VGltZXN0YW1wRmllbGREb21haW4iLCJkZWZhdWx0VGltZUZvcm1hdCIsImdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlciIsImVudHJ5IiwiaGlzdG9ncmFtQ29uc3RydWN0IiwiYmlucyIsInRocmVzaG9sZHMiLCJiaW4iLCJjb3VudCIsIngwIiwieDEiLCJ2YWwiLCJib3VuZCIsImZsb29yIiwiY2VpbCIsImlzVmFsaWRUaW1lRG9tYWluIiwiZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIiLCJpc05hTiIsIkJvb2xlYW4iLCJpbnB1dCIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sdW1uRmllbGRJZHgiLCJDb25zb2xlIiwid2FybiIsInNlcmllcyIsInkiLCJzb3J0IiwiYSIsImIiLCJ5RG9tYWluIiwieERvbWFpbiIsImdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSIsImZpbHRlclBsb3RUeXBlcyIsImFwcGx5RmlsdGVyc1RvRGF0YXNldHMiLCJkYXRhc2V0SWRzIiwiZGF0YXNldHMiLCJyZWR1Y2UiLCJhY2MiLCJsYXllcnNUb0ZpbHRlciIsImFwcGxpZWRGaWx0ZXJzIiwidGFibGUiLCJmaWx0ZXJUYWJsZSIsIm9wdGlvbiIsImZpZWxkSW5kZXgiLCJnZXRDb2x1bW5GaWx0ZXJQcm9wcyIsIm5ld0ZpbHRlciIsIm1lcmdlRmlsdGVyRG9tYWluU3RlcCIsImFzc2lnbiIsImNvbWJpbmVkRG9tYWluIiwiZmVhdHVyZVRvRmlsdGVyVmFsdWUiLCJmZWF0dXJlIiwiZmlsdGVySWQiLCJwcm9wZXJ0aWVzIiwiZ2V0RmlsdGVySWRJbkZlYXR1cmUiLCJnZW5lcmF0ZVBvbHlnb25GaWx0ZXIiLCJsYWJlbCIsImlzVmlzaWJsZSIsImZpbHRlckRhdGFzZXRDUFUiLCJzdGF0ZSIsImRhdGFzZXRGaWx0ZXJzIiwiY3B1RmlsdGVyZWREYXRhc2V0IiwiZmlsdGVyVGFibGVDUFUiLCJ2YWxpZGF0ZUZpbHRlcnNVcGRhdGVEYXRhc2V0cyIsImZpbHRlcnNUb1ZhbGlkYXRlIiwidmFsaWRhdGVkIiwidXBkYXRlZERhdGFzZXRzIiwiYXVnbWVudGVkRGF0YXNldHMiLCJhcHBseVRvRGF0YXNldHMiLCJ2YWxpZGF0ZWRGaWx0ZXIiLCJnZXRJbnRlcnZhbEJpbnMiLCJrZXlzIiwidmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7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LGlCQUZYOztBQXlDdEMsVUFBSUUsZUFBZSxJQUFJLHlCQUFRbEMsVUFBUixFQUFvQmlDLGVBQXBCLENBQXZCLEVBQTZEO0FBQzNESCxRQUFBQSxTQUFTLENBQUN6RyxJQUFWLENBQWU2RyxlQUFmO0FBQ0FILFFBQUFBLGVBQWUsbUNBQ1ZBLGVBRFUsR0FFVkMsaUJBRlUsQ0FBZjtBQUlEO0FBQ0YsS0FoREQsTUFnRE87QUFDTDNMLE1BQUFBLE1BQU0sQ0FBQ2dGLElBQVAsQ0FBWXZGLE1BQVo7QUFDRDtBQUNGLEdBeEREO0FBMERBLFNBQU87QUFBQ2dNLElBQUFBLFNBQVMsRUFBVEEsU0FBRDtBQUFZekwsSUFBQUEsTUFBTSxFQUFOQSxNQUFaO0FBQW9CMEwsSUFBQUEsZUFBZSxFQUFmQTtBQUFwQixHQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0ksZUFBVCxDQUF5QnJNLE1BQXpCLEVBQWlDO0FBQUE7O0FBQUEsTUFDL0JxSSxJQUQrQixHQUN2QnJJLE1BRHVCLENBQy9CcUksSUFEK0I7QUFFdEMsTUFBTTNJLFFBQVEsdUJBQUdNLE1BQU0sQ0FBQ1IsUUFBVixxREFBRyxpQkFBaUJFLFFBQWxDOztBQUNBLE1BQUksQ0FBQ0EsUUFBRCxJQUFhLENBQUMySSxJQUFkLElBQXNCL0IsTUFBTSxDQUFDZ0csSUFBUCxDQUFZakUsSUFBWixFQUFrQjlELE1BQWxCLEtBQTZCLENBQXZELEVBQTBEO0FBQ3hELFdBQU8sSUFBUDtBQUNEOztBQUNELE1BQU1nSSxNQUFNLEdBQUdqRyxNQUFNLENBQUNpRyxNQUFQLENBQWNsRSxJQUFkLENBQWY7QUFDQSxTQUFPa0UsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZQSxNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVU3TSxRQUFWLENBQVosR0FBa0MsSUFBekM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7YXNjZW5kaW5nLCBleHRlbnQsIGhpc3RvZ3JhbSBhcyBkM0hpc3RvZ3JhbSwgdGlja3N9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvY29uc29sZSc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuaW1wb3J0IGlzRXF1YWwgZnJvbSAnbG9kYXNoLmlzZXF1YWwnO1xuXG5pbXBvcnQgYm9vbGVhbldpdGhpbiBmcm9tICdAdHVyZi9ib29sZWFuLXdpdGhpbic7XG5pbXBvcnQge3BvaW50IGFzIHR1cmZQb2ludH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQge0RlY2ltYWx9IGZyb20gJ2RlY2ltYWwuanMnO1xuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIEZJTFRFUl9UWVBFUywgQU5JTUFUSU9OX1dJTkRPV30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWQsIHVuaXF1ZSwgdGltZVRvVW5peE1pbGxpfSBmcm9tICcuL2RhdGEtdXRpbHMnO1xuaW1wb3J0ICogYXMgU2NhbGVVdGlscyBmcm9tICcuL2RhdGEtc2NhbGUtdXRpbHMnO1xuaW1wb3J0IHtMQVlFUl9UWVBFU30gZnJvbSAnbGF5ZXJzL3R5cGVzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWQsIHNldCwgdG9BcnJheX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2dldENlbnRyb2lkLCBoM0lzVmFsaWR9IGZyb20gJ2xheWVycy9oMy1oZXhhZ29uLWxheWVyL2gzLXV0aWxzJztcblxuLy8gVFlQRVxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdGFibGUtdXRpbHMva2VwbGVyLXRhYmxlJykuRmlsdGVyUmVjb3JkfSBGaWx0ZXJSZWNvcmQgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2ZpbHRlci11dGlscycpLkZpbHRlclJlc3VsdH0gRmlsdGVyUmVzdWx0ICovXG5cbmV4cG9ydCBjb25zdCBUaW1lc3RhbXBTdGVwTWFwID0gW1xuICB7bWF4OiAxLCBzdGVwOiAwLjA1fSxcbiAge21heDogMTAsIHN0ZXA6IDAuMX0sXG4gIHttYXg6IDEwMCwgc3RlcDogMX0sXG4gIHttYXg6IDUwMCwgc3RlcDogNX0sXG4gIHttYXg6IDEwMDAsIHN0ZXA6IDEwfSxcbiAge21heDogNTAwMCwgc3RlcDogNTB9LFxuICB7bWF4OiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHN0ZXA6IDEwMDB9XG5dO1xuXG5leHBvcnQgY29uc3QgaGlzdG9ncmFtQmlucyA9IDMwO1xuZXhwb3J0IGNvbnN0IGVubGFyZ2VkSGlzdG9ncmFtQmlucyA9IDEwMDtcblxuY29uc3QgZHVyYXRpb25TZWNvbmQgPSAxMDAwO1xuY29uc3QgZHVyYXRpb25NaW51dGUgPSBkdXJhdGlvblNlY29uZCAqIDYwO1xuY29uc3QgZHVyYXRpb25Ib3VyID0gZHVyYXRpb25NaW51dGUgKiA2MDtcbmNvbnN0IGR1cmF0aW9uRGF5ID0gZHVyYXRpb25Ib3VyICogMjQ7XG5jb25zdCBkdXJhdGlvbldlZWsgPSBkdXJhdGlvbkRheSAqIDc7XG5jb25zdCBkdXJhdGlvblllYXIgPSBkdXJhdGlvbkRheSAqIDM2NTtcblxuZXhwb3J0IGNvbnN0IFBMT1RfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBoaXN0b2dyYW06IG51bGwsXG4gIGxpbmVDaGFydDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBGSUxURVJfVVBEQVRFUl9QUk9QUyA9IGtleU1pcnJvcih7XG4gIGRhdGFJZDogbnVsbCxcbiAgbmFtZTogbnVsbCxcbiAgbGF5ZXJJZDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBMSU1JVEVEX0ZJTFRFUl9FRkZFQ1RfUFJPUFMgPSBrZXlNaXJyb3Ioe1xuICBbRklMVEVSX1VQREFURVJfUFJPUFMubmFtZV06IG51bGxcbn0pO1xuLyoqXG4gKiBNYXggbnVtYmVyIG9mIGZpbHRlciB2YWx1ZSBidWZmZXJzIHRoYXQgZGVjay5nbCBwcm92aWRlc1xuICovXG5cbmNvbnN0IFN1cHBvcnRlZFBsb3RUeXBlID0ge1xuICBbRklMVEVSX1RZUEVTLnRpbWVSYW5nZV06IHtcbiAgICBkZWZhdWx0OiAnaGlzdG9ncmFtJyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiAnbGluZUNoYXJ0JyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiAnbGluZUNoYXJ0J1xuICB9LFxuICBbRklMVEVSX1RZUEVTLnJhbmdlXToge1xuICAgIGRlZmF1bHQ6ICdoaXN0b2dyYW0nLFxuICAgIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06ICdsaW5lQ2hhcnQnLFxuICAgIFtBTExfRklFTERfVFlQRVMucmVhbF06ICdsaW5lQ2hhcnQnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBGSUxURVJfQ09NUE9ORU5UUyA9IHtcbiAgW0ZJTFRFUl9UWVBFUy5zZWxlY3RdOiAnU2luZ2xlU2VsZWN0RmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdF06ICdNdWx0aVNlbGVjdEZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMudGltZVJhbmdlXTogJ1RpbWVSYW5nZUZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMucmFuZ2VdOiAnUmFuZ2VGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnBvbHlnb25dOiAnUG9seWdvbkZpbHRlcidcbn07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0ZJTFRFUl9TVFJVQ1RVUkUgPSB7XG4gIGRhdGFJZDogW10sIC8vIFtzdHJpbmddXG4gIGZyZWV6ZTogZmFsc2UsXG4gIGlkOiBudWxsLFxuXG4gIC8vIHRpbWUgcmFuZ2UgZmlsdGVyIHNwZWNpZmljXG4gIGZpeGVkRG9tYWluOiBmYWxzZSxcbiAgZW5sYXJnZWQ6IGZhbHNlLFxuICBpc0FuaW1hdGluZzogZmFsc2UsXG4gIGFuaW1hdGlvbldpbmRvdzogQU5JTUFUSU9OX1dJTkRPVy5mcmVlLFxuICBzcGVlZDogMSxcblxuICAvLyBmaWVsZCBzcGVjaWZpY1xuICBuYW1lOiBbXSwgLy8gc3RyaW5nXG4gIHR5cGU6IG51bGwsXG4gIGZpZWxkSWR4OiBbXSwgLy8gW2ludGVnZXJdXG4gIGRvbWFpbjogbnVsbCxcbiAgdmFsdWU6IG51bGwsXG5cbiAgLy8gcGxvdFxuICBwbG90VHlwZTogUExPVF9UWVBFUy5oaXN0b2dyYW0sXG4gIHlBeGlzOiBudWxsLFxuICBpbnRlcnZhbDogbnVsbCxcblxuICAvLyBtb2RlXG4gIGdwdTogZmFsc2Vcbn07XG5cbmV4cG9ydCBjb25zdCBGSUxURVJfSURfTEVOR1RIID0gNDtcblxuZXhwb3J0IGNvbnN0IExBWUVSX0ZJTFRFUlMgPSBbRklMVEVSX1RZUEVTLnBvbHlnb25dO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGZpbHRlciB3aXRoIGEgZGF0YXNldCBpZCBhcyBkYXRhSWRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldERlZmF1bHRGaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0RmlsdGVyKGRhdGFJZCkge1xuICByZXR1cm4ge1xuICAgIC4uLkRFRkFVTFRfRklMVEVSX1NUUlVDVFVSRSxcbiAgICAvLyBzdG9yZSBpdCBhcyBkYXRhSWQgYW5kIGl0IGNvdWxkIGJlIG9uZSBvciBtYW55XG4gICAgZGF0YUlkOiB0b0FycmF5KGRhdGFJZCksXG4gICAgaWQ6IGdlbmVyYXRlSGFzaElkKEZJTFRFUl9JRF9MRU5HVEgpXG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBmaWx0ZXIgaXMgdmFsaWQgYmFzZWQgb24gdGhlIGdpdmVuIGRhdGFJZFxuICogQHBhcmFtICBmaWx0ZXIgdG8gdmFsaWRhdGVcbiAqIEBwYXJhbSAgZGF0YXNldElkIGlkIHRvIHZhbGlkYXRlIGZpbHRlciBhZ2FpbnN0XG4gKiBAcmV0dXJuIHRydWUgaWYgYSBmaWx0ZXIgaXMgdmFsaWQsIGZhbHNlIG90aGVyd2lzZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuc2hvdWxkQXBwbHlGaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRBcHBseUZpbHRlcihmaWx0ZXIsIGRhdGFzZXRJZCkge1xuICBjb25zdCBkYXRhSWRzID0gdG9BcnJheShmaWx0ZXIuZGF0YUlkKTtcbiAgcmV0dXJuIGRhdGFJZHMuaW5jbHVkZXMoZGF0YXNldElkKSAmJiBmaWx0ZXIudmFsdWUgIT09IG51bGw7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGFuZCBtb2RpZmllcyBwb2x5Z29uIGZpbHRlciBzdHJ1Y3R1cmVcbiAqIEBwYXJhbSBkYXRhc2V0XG4gKiBAcGFyYW0gZmlsdGVyXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJuIC0ge2ZpbHRlciwgZGF0YXNldH1cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLnZhbGlkYXRlUG9seWdvbkZpbHRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUG9seWdvbkZpbHRlcihkYXRhc2V0LCBmaWx0ZXIsIGxheWVycykge1xuICBjb25zdCBmYWlsZWQgPSB7ZGF0YXNldCwgZmlsdGVyOiBudWxsfTtcbiAgY29uc3Qge3ZhbHVlLCBsYXllcklkLCB0eXBlLCBkYXRhSWR9ID0gZmlsdGVyO1xuXG4gIGlmICghbGF5ZXJJZCB8fCAhaXNWYWxpZEZpbHRlclZhbHVlKHR5cGUsIHZhbHVlKSkge1xuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICBjb25zdCBpc1ZhbGlkRGF0YXNldCA9IGRhdGFJZC5pbmNsdWRlcyhkYXRhc2V0LmlkKTtcblxuICBpZiAoIWlzVmFsaWREYXRhc2V0KSB7XG4gICAgcmV0dXJuIGZhaWxlZDtcbiAgfVxuXG4gIGNvbnN0IGxheWVyID0gbGF5ZXJzLmZpbmQobCA9PiBsYXllcklkLmluY2x1ZGVzKGwuaWQpKTtcblxuICBpZiAoIWxheWVyKSB7XG4gICAgcmV0dXJuIGZhaWxlZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmlsdGVyOiB7XG4gICAgICAuLi5maWx0ZXIsXG4gICAgICBmcmVlemU6IHRydWUsXG4gICAgICBmaWVsZElkeDogW11cbiAgICB9LFxuICAgIGRhdGFzZXRcbiAgfTtcbn1cblxuLyoqXG4gKiBDdXN0b20gZmlsdGVyIHZhbGlkYXRvcnNcbiAqL1xuY29uc3QgZmlsdGVyVmFsaWRhdG9ycyA9IHtcbiAgW0ZJTFRFUl9UWVBFUy5wb2x5Z29uXTogdmFsaWRhdGVQb2x5Z29uRmlsdGVyXG59O1xuXG4vKipcbiAqIERlZmF1bHQgdmFsaWRhdGUgZmlsdGVyIGZ1bmN0aW9uXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHBhcmFtIGZpbHRlclxuICogQHJldHVybiAtIHtmaWx0ZXIsIGRhdGFzZXR9XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS52YWxpZGF0ZUZpbHRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRmlsdGVyKGRhdGFzZXQsIGZpbHRlcikge1xuICAvLyBtYXRjaCBmaWx0ZXIuZGF0YUlkXG4gIGNvbnN0IGZhaWxlZCA9IHtkYXRhc2V0LCBmaWx0ZXI6IG51bGx9O1xuICBjb25zdCBmaWx0ZXJEYXRhSWQgPSB0b0FycmF5KGZpbHRlci5kYXRhSWQpO1xuXG4gIGNvbnN0IGZpbHRlckRhdGFzZXRJbmRleCA9IGZpbHRlckRhdGFJZC5pbmRleE9mKGRhdGFzZXQuaWQpO1xuICBpZiAoZmlsdGVyRGF0YXNldEluZGV4IDwgMCkge1xuICAgIC8vIHRoZSBjdXJyZW50IGZpbHRlciBpcyBub3QgbWFwcGVkIGFnYWluc3QgdGhlIGN1cnJlbnQgZGF0YXNldFxuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICBjb25zdCBpbml0aWFsaXplRmlsdGVyID0ge1xuICAgIC4uLmdldERlZmF1bHRGaWx0ZXIoZmlsdGVyLmRhdGFJZCksXG4gICAgLi4uZmlsdGVyLFxuICAgIGRhdGFJZDogZmlsdGVyRGF0YUlkLFxuICAgIG5hbWU6IHRvQXJyYXkoZmlsdGVyLm5hbWUpXG4gIH07XG5cbiAgY29uc3QgZmllbGROYW1lID0gaW5pdGlhbGl6ZUZpbHRlci5uYW1lW2ZpbHRlckRhdGFzZXRJbmRleF07XG4gIGNvbnN0IHtmaWx0ZXI6IHVwZGF0ZWRGaWx0ZXIsIGRhdGFzZXQ6IHVwZGF0ZWREYXRhc2V0fSA9IGFwcGx5RmlsdGVyRmllbGROYW1lKFxuICAgIGluaXRpYWxpemVGaWx0ZXIsXG4gICAgZGF0YXNldCxcbiAgICBmaWVsZE5hbWUsXG4gICAgZmlsdGVyRGF0YXNldEluZGV4LFxuICAgIHttZXJnZURvbWFpbjogdHJ1ZX1cbiAgKTtcblxuICBpZiAoIXVwZGF0ZWRGaWx0ZXIpIHtcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgdXBkYXRlZEZpbHRlci52YWx1ZSA9IGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW4oZmlsdGVyLnZhbHVlLCB1cGRhdGVkRmlsdGVyKTtcbiAgdXBkYXRlZEZpbHRlci5lbmxhcmdlZCA9XG4gICAgdHlwZW9mIGZpbHRlci5lbmxhcmdlZCA9PT0gJ2Jvb2xlYW4nID8gZmlsdGVyLmVubGFyZ2VkIDogdXBkYXRlZEZpbHRlci5lbmxhcmdlZDtcblxuICBpZiAodXBkYXRlZEZpbHRlci52YWx1ZSA9PT0gbnVsbCkge1xuICAgIC8vIGNhbm5vdCBhZGp1c3Qgc2F2ZWQgdmFsdWUgdG8gZmlsdGVyXG4gICAgcmV0dXJuIGZhaWxlZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmlsdGVyOiB2YWxpZGF0ZUZpbHRlcllBeGlzKHVwZGF0ZWRGaWx0ZXIsIHVwZGF0ZWREYXRhc2V0KSxcbiAgICBkYXRhc2V0OiB1cGRhdGVkRGF0YXNldFxuICB9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIGZpbHRlciBjb25maWcgd2l0aCBuZXcgZGF0YSxcbiAqIGNhbGN1bGF0ZSBkb21haW4gYW5kIGZpZWxkSWR4IGJhc2VkIG5ldyBmaWVsZHMgYW5kIGRhdGFcbiAqXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHBhcmFtIGZpbHRlciAtIGZpbHRlciB0byBiZSB2YWxpZGF0ZVxuICogQHBhcmFtIGxheWVycyAtIGxheWVyc1xuICogQHJldHVybiB2YWxpZGF0ZWQgZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS52YWxpZGF0ZUZpbHRlcldpdGhEYXRhfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVGaWx0ZXJXaXRoRGF0YShkYXRhc2V0LCBmaWx0ZXIsIGxheWVycykge1xuICAvLyBAdHMtaWdub3JlXG4gIHJldHVybiBmaWx0ZXJWYWxpZGF0b3JzLmhhc093blByb3BlcnR5KGZpbHRlci50eXBlKVxuICAgID8gZmlsdGVyVmFsaWRhdG9yc1tmaWx0ZXIudHlwZV0oZGF0YXNldCwgZmlsdGVyLCBsYXllcnMpXG4gICAgOiB2YWxpZGF0ZUZpbHRlcihkYXRhc2V0LCBmaWx0ZXIpO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIFlBeGlzXG4gKiBAcGFyYW0gZmlsdGVyXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHJldHVybiB7Kn1cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGaWx0ZXJZQXhpcyhmaWx0ZXIsIGRhdGFzZXQpIHtcbiAgLy8gVE9ETzogdmFsaWRhdGUgeUF4aXMgYWdhaW5zdCBvdGhlciBkYXRhc2V0c1xuXG4gIGNvbnN0IHtmaWVsZHN9ID0gZGF0YXNldDtcbiAgY29uc3Qge3lBeGlzfSA9IGZpbHRlcjtcbiAgLy8gVE9ETzogdmFsaWRhdGUgeUF4aXMgYWdhaW5zdCBvdGhlciBkYXRhc2V0c1xuICBpZiAoeUF4aXMpIHtcbiAgICBjb25zdCBtYXRjaGVkQXhpcyA9IGZpZWxkcy5maW5kKCh7bmFtZSwgdHlwZX0pID0+IG5hbWUgPT09IHlBeGlzLm5hbWUgJiYgdHlwZSA9PT0geUF4aXMudHlwZSk7XG5cbiAgICBmaWx0ZXIgPSBtYXRjaGVkQXhpc1xuICAgICAgPyB7XG4gICAgICAgICAgLi4uZmlsdGVyLFxuICAgICAgICAgIHlBeGlzOiBtYXRjaGVkQXhpcyxcbiAgICAgICAgICAuLi5nZXRGaWx0ZXJQbG90KHsuLi5maWx0ZXIsIHlBeGlzOiBtYXRjaGVkQXhpc30sIGRhdGFzZXQpXG4gICAgICAgIH1cbiAgICAgIDogZmlsdGVyO1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlcjtcbn1cblxuLyoqXG4gKiBHZXQgZGVmYXVsdCBmaWx0ZXIgcHJvcCBiYXNlZCBvbiBmaWVsZCB0eXBlXG4gKlxuICogQHBhcmFtIGZpZWxkXG4gKiBAcGFyYW0gZmllbGREb21haW5cbiAqIEByZXR1cm5zIGRlZmF1bHQgZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRGaWx0ZXJQcm9wc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclByb3BzKGZpZWxkLCBmaWVsZERvbWFpbikge1xuICBjb25zdCBmaWx0ZXJQcm9wcyA9IHtcbiAgICAuLi5maWVsZERvbWFpbixcbiAgICBmaWVsZFR5cGU6IGZpZWxkLnR5cGVcbiAgfTtcblxuICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5yZWFsOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdmFsdWU6IGZpZWxkRG9tYWluLmRvbWFpbixcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLnJhbmdlLFxuICAgICAgICB0eXBlT3B0aW9uczogW0ZJTFRFUl9UWVBFUy5yYW5nZV0sXG4gICAgICAgIGdwdTogdHJ1ZVxuICAgICAgfTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLnNlbGVjdCxcbiAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgIGdwdTogZmFsc2VcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5hcnJheTpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlclByb3BzLFxuICAgICAgICB0eXBlOiBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3QsXG4gICAgICAgIHZhbHVlOiBbXSxcbiAgICAgICAgZ3B1OiBmYWxzZVxuICAgICAgfTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlclByb3BzLFxuICAgICAgICB0eXBlOiBGSUxURVJfVFlQRVMudGltZVJhbmdlLFxuICAgICAgICBlbmxhcmdlZDogdHJ1ZSxcbiAgICAgICAgZml4ZWREb21haW46IHRydWUsXG4gICAgICAgIHZhbHVlOiBmaWx0ZXJQcm9wcy5kb21haW4sXG4gICAgICAgIGdwdTogdHJ1ZVxuICAgICAgfTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge307XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFBvbHlnb25GaWx0ZXJGdW5jdG9yID0gKGxheWVyLCBmaWx0ZXIpID0+IHtcbiAgY29uc3QgZ2V0UG9zaXRpb24gPSBsYXllci5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG5cbiAgc3dpdGNoIChsYXllci50eXBlKSB7XG4gICAgY2FzZSBMQVlFUl9UWVBFUy5wb2ludDpcbiAgICBjYXNlIExBWUVSX1RZUEVTLmljb246XG4gICAgICByZXR1cm4gZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhfSk7XG4gICAgICAgIHJldHVybiBwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSAmJiBpc0luUG9seWdvbihwb3MsIGZpbHRlci52YWx1ZSk7XG4gICAgICB9O1xuICAgIGNhc2UgTEFZRVJfVFlQRVMuYXJjOlxuICAgIGNhc2UgTEFZRVJfVFlQRVMubGluZTpcbiAgICAgIHJldHVybiBkYXRhID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGF9KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSAmJlxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtwb3NbMF0sIHBvc1sxXV0sXG4gICAgICAgICAgICBbcG9zWzNdLCBwb3NbNF1dXG4gICAgICAgICAgXS5ldmVyeShwb2ludCA9PiBpc0luUG9seWdvbihwb2ludCwgZmlsdGVyLnZhbHVlKSlcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgY2FzZSBMQVlFUl9UWVBFUy5oZXhhZ29uSWQ6XG4gICAgICBpZiAobGF5ZXIuZGF0YVRvRmVhdHVyZSAmJiBsYXllci5kYXRhVG9GZWF0dXJlLmNlbnRyb2lkcykge1xuICAgICAgICByZXR1cm4gKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgLy8gbnVsbCBvciBnZXRDZW50cm9pZCh7aWR9KVxuICAgICAgICAgIGNvbnN0IGNlbnRyb2lkID0gbGF5ZXIuZGF0YVRvRmVhdHVyZS5jZW50cm9pZHNbaW5kZXhdO1xuICAgICAgICAgIHJldHVybiBjZW50cm9pZCAmJiBpc0luUG9seWdvbihjZW50cm9pZCwgZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhID0+IHtcbiAgICAgICAgY29uc3QgaWQgPSBnZXRQb3NpdGlvbih7ZGF0YX0pO1xuICAgICAgICBpZiAoIWgzSXNWYWxpZChpZCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zID0gZ2V0Q2VudHJvaWQoe2lkfSk7XG4gICAgICAgIHJldHVybiBwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSAmJiBpc0luUG9seWdvbihwb3MsIGZpbHRlci52YWx1ZSk7XG4gICAgICB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKCkgPT4gdHJ1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0gZmllbGQgZGF0YXNldCBGaWVsZFxuICogQHBhcmFtIGRhdGFJZCBEYXRhc2V0IGlkXG4gKiBAcGFyYW0gZmlsdGVyIEZpbHRlciBvYmplY3RcbiAqIEBwYXJhbSBsYXllcnMgbGlzdCBvZiBsYXllcnMgdG8gZmlsdGVyIHVwb25cbiAqIEByZXR1cm4gZmlsdGVyRnVuY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEZpbHRlckZ1bmN0aW9ufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyRnVuY3Rpb24oZmllbGQsIGRhdGFJZCwgZmlsdGVyLCBsYXllcnMpIHtcbiAgLy8gZmllbGQgY291bGQgYmUgbnVsbCBpbiBwb2x5Z29uIGZpbHRlclxuICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gZmllbGQgPyBmaWVsZC52YWx1ZUFjY2Vzc29yIDogZGF0YSA9PiBudWxsO1xuICBjb25zdCBkZWZhdWx0RnVuYyA9IGQgPT4gdHJ1ZTtcblxuICBzd2l0Y2ggKGZpbHRlci50eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMucmFuZ2U6XG4gICAgICByZXR1cm4gZGF0YSA9PiBpc0luUmFuZ2UodmFsdWVBY2Nlc3NvcihkYXRhKSwgZmlsdGVyLnZhbHVlKTtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIHJldHVybiBkYXRhID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKGRhdGEpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuc29tZSh2ID0+IGZpbHRlci52YWx1ZS5pbmNsdWRlcyh2KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZS5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgICB9O1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICAgIHJldHVybiBkYXRhID0+IHZhbHVlQWNjZXNzb3IoZGF0YSkgPT09IGZpbHRlci52YWx1ZTtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0RnVuYztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcHBlZFZhbHVlID0gZ2V0KGZpZWxkLCBbJ2ZpbHRlclByb3BzJywgJ21hcHBlZFZhbHVlJ10pO1xuICAgICAgY29uc3QgYWNjZXNzb3IgPSBBcnJheS5pc0FycmF5KG1hcHBlZFZhbHVlKVxuICAgICAgICA/IChkYXRhLCBpbmRleCkgPT4gbWFwcGVkVmFsdWVbaW5kZXhdXG4gICAgICAgIDogZGF0YSA9PiB0aW1lVG9Vbml4TWlsbGkodmFsdWVBY2Nlc3NvcihkYXRhKSwgZmllbGQuZm9ybWF0KTtcbiAgICAgIHJldHVybiAoZGF0YSwgaW5kZXgpID0+IGlzSW5SYW5nZShhY2Nlc3NvcihkYXRhLCBpbmRleCksIGZpbHRlci52YWx1ZSk7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMucG9seWdvbjpcbiAgICAgIGlmICghbGF5ZXJzIHx8ICFsYXllcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0RnVuYztcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGxheWVyRmlsdGVyRnVuY3Rpb25zID0gZmlsdGVyLmxheWVySWRcbiAgICAgICAgLm1hcChpZCA9PiBsYXllcnMuZmluZChsID0+IGwuaWQgPT09IGlkKSlcbiAgICAgICAgLmZpbHRlcihsID0+IGwgJiYgbC5jb25maWcuZGF0YUlkID09PSBkYXRhSWQpXG4gICAgICAgIC5tYXAobGF5ZXIgPT4gZ2V0UG9seWdvbkZpbHRlckZ1bmN0b3IobGF5ZXIsIGZpbHRlcikpO1xuXG4gICAgICByZXR1cm4gKGRhdGEsIGluZGV4KSA9PiBsYXllckZpbHRlckZ1bmN0aW9ucy5ldmVyeShmaWx0ZXJGdW5jID0+IGZpbHRlckZ1bmMoZGF0YSwgaW5kZXgpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGRlZmF1bHRGdW5jO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWx0ZXJEYXRhSWQoZGF0YUlkKSB7XG4gIHJldHVybiBnZXREZWZhdWx0RmlsdGVyKGRhdGFJZCk7XG59XG5cbi8qKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZmlsdGVyRGF0YUJ5RmlsdGVyVHlwZXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJEYXRhQnlGaWx0ZXJUeXBlcyh7ZHluYW1pY0RvbWFpbkZpbHRlcnMsIGNwdUZpbHRlcnMsIGZpbHRlckZ1bmNzfSwgYWxsRGF0YSkge1xuICBjb25zdCByZXN1bHQgPSB7XG4gICAgLi4uKGR5bmFtaWNEb21haW5GaWx0ZXJzID8ge2ZpbHRlcmVkSW5kZXhGb3JEb21haW46IFtdfSA6IHt9KSxcbiAgICAuLi4oY3B1RmlsdGVycyA/IHtmaWx0ZXJlZEluZGV4OiBbXX0gOiB7fSlcbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkID0gYWxsRGF0YVtpXTtcblxuICAgIGNvbnN0IG1hdGNoRm9yRG9tYWluID1cbiAgICAgIGR5bmFtaWNEb21haW5GaWx0ZXJzICYmIGR5bmFtaWNEb21haW5GaWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXJGdW5jc1tmaWx0ZXIuaWRdKGQsIGkpKTtcblxuICAgIGlmIChtYXRjaEZvckRvbWFpbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmVzdWx0LmZpbHRlcmVkSW5kZXhGb3JEb21haW4ucHVzaChpKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaEZvclJlbmRlciA9IGNwdUZpbHRlcnMgJiYgY3B1RmlsdGVycy5ldmVyeShmaWx0ZXIgPT4gZmlsdGVyRnVuY3NbZmlsdGVyLmlkXShkLCBpKSk7XG5cbiAgICBpZiAobWF0Y2hGb3JSZW5kZXIpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJlc3VsdC5maWx0ZXJlZEluZGV4LnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXQgYSByZWNvcmQgb2YgZmlsdGVycyBiYXNlZCBvbiBkb21haW4gdHlwZSBhbmQgZ3B1IC8gY3B1XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRGaWx0ZXJSZWNvcmR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJSZWNvcmQoZGF0YUlkLCBmaWx0ZXJzLCBvcHQgPSB7fSkge1xuICAvKipcbiAgICogQHR5cGUge0ZpbHRlclJlY29yZH1cbiAgICovXG4gIGNvbnN0IGZpbHRlclJlY29yZCA9IHtcbiAgICBkeW5hbWljRG9tYWluOiBbXSxcbiAgICBmaXhlZERvbWFpbjogW10sXG4gICAgY3B1OiBbXSxcbiAgICBncHU6IFtdXG4gIH07XG5cbiAgZmlsdGVycy5mb3JFYWNoKGYgPT4ge1xuICAgIGlmIChpc1ZhbGlkRmlsdGVyVmFsdWUoZi50eXBlLCBmLnZhbHVlKSAmJiB0b0FycmF5KGYuZGF0YUlkKS5pbmNsdWRlcyhkYXRhSWQpKSB7XG4gICAgICAoZi5maXhlZERvbWFpbiB8fCBvcHQuaWdub3JlRG9tYWluXG4gICAgICAgID8gZmlsdGVyUmVjb3JkLmZpeGVkRG9tYWluXG4gICAgICAgIDogZmlsdGVyUmVjb3JkLmR5bmFtaWNEb21haW5cbiAgICAgICkucHVzaChmKTtcblxuICAgICAgKGYuZ3B1ICYmICFvcHQuY3B1T25seSA/IGZpbHRlclJlY29yZC5ncHUgOiBmaWx0ZXJSZWNvcmQuY3B1KS5wdXNoKGYpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZpbHRlclJlY29yZDtcbn1cblxuLyoqXG4gKiBDb21wYXJlIGZpbHRlciByZWNvcmRzIHRvIGdldCB3aGF0IGhhcyBjaGFuZ2VkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5kaWZmRmlsdGVyc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZGaWx0ZXJzKGZpbHRlclJlY29yZCwgb2xkRmlsdGVyUmVjb3JkID0ge30pIHtcbiAgbGV0IGZpbHRlckNoYW5nZWQgPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhmaWx0ZXJSZWNvcmQpLmZvckVhY2goKFtyZWNvcmQsIGl0ZW1zXSkgPT4ge1xuICAgIGl0ZW1zLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGNvbnN0IG9sZEZpbHRlciA9IChvbGRGaWx0ZXJSZWNvcmRbcmVjb3JkXSB8fCBbXSkuZmluZChmID0+IGYuaWQgPT09IGZpbHRlci5pZCk7XG5cbiAgICAgIGlmICghb2xkRmlsdGVyKSB7XG4gICAgICAgIC8vIGFkZGVkXG4gICAgICAgIGZpbHRlckNoYW5nZWQgPSBzZXQoW3JlY29yZCwgZmlsdGVyLmlkXSwgJ2FkZGVkJywgZmlsdGVyQ2hhbmdlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjaGVjayAgd2hhdCBoYXMgY2hhbmdlZFxuICAgICAgICBbJ25hbWUnLCAndmFsdWUnLCAnZGF0YUlkJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICBpZiAoZmlsdGVyW3Byb3BdICE9PSBvbGRGaWx0ZXJbcHJvcF0pIHtcbiAgICAgICAgICAgIGZpbHRlckNoYW5nZWQgPSBzZXQoW3JlY29yZCwgZmlsdGVyLmlkXSwgYCR7cHJvcH1fY2hhbmdlZGAsIGZpbHRlckNoYW5nZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAob2xkRmlsdGVyUmVjb3JkW3JlY29yZF0gfHwgW10pLmZvckVhY2gob2xkRmlsdGVyID0+IHtcbiAgICAgIC8vIGRlbGV0ZWRcbiAgICAgIGlmICghaXRlbXMuZmluZChmID0+IGYuaWQgPT09IG9sZEZpbHRlci5pZCkpIHtcbiAgICAgICAgZmlsdGVyQ2hhbmdlZCA9IHNldChbcmVjb3JkLCBvbGRGaWx0ZXIuaWRdLCAnZGVsZXRlZCcsIGZpbHRlckNoYW5nZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFmaWx0ZXJDaGFuZ2VkW3JlY29yZF0pIHtcbiAgICAgIGZpbHRlckNoYW5nZWRbcmVjb3JkXSA9IG51bGw7XG4gICAgfVxuICB9KTtcblxuICAvLyBAdHMtaWdub3JlXG4gIHJldHVybiBmaWx0ZXJDaGFuZ2VkO1xufVxuLyoqXG4gKiBDYWxsIGJ5IHBhcnNpbmcgZmlsdGVycyBmcm9tIFVSTFxuICogQ2hlY2sgaWYgdmFsdWUgb2YgZmlsdGVyIHdpdGhpbiBmaWx0ZXIgZG9tYWluLCBpZiBub3QgYWRqdXN0IGl0IHRvIG1hdGNoXG4gKiBmaWx0ZXIgZG9tYWluXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuYWRqdXN0VmFsdWVUb0ZpbHRlckRvbWFpbn1cbiAqIEByZXR1cm5zIHZhbHVlIC0gYWRqdXN0ZWQgdmFsdWUgdG8gbWF0Y2ggZmlsdGVyIG9yIG51bGwgdG8gcmVtb3ZlIGZpbHRlclxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gYWRqdXN0VmFsdWVUb0ZpbHRlckRvbWFpbih2YWx1ZSwge2RvbWFpbiwgdHlwZX0pIHtcbiAgaWYgKCFkb21haW4gfHwgIXR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5yYW5nZTpcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlLmxlbmd0aCAhPT0gMikge1xuICAgICAgICByZXR1cm4gZG9tYWluLm1hcChkID0+IGQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWUubWFwKChkLCBpKSA9PiAobm90TnVsbG9yVW5kZWZpbmVkKGQpICYmIGlzSW5SYW5nZShkLCBkb21haW4pID8gZCA6IGRvbWFpbltpXSkpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q6XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlcmVkVmFsdWUgPSB2YWx1ZS5maWx0ZXIoZCA9PiBkb21haW4uaW5jbHVkZXMoZCkpO1xuICAgICAgcmV0dXJuIGZpbHRlcmVkVmFsdWUubGVuZ3RoID8gZmlsdGVyZWRWYWx1ZSA6IFtdO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIGRvbWFpbi5pbmNsdWRlcyh2YWx1ZSkgPyB2YWx1ZSA6IHRydWU7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4vKipcbiAqIENhbGN1bGF0ZSBudW1lcmljIGRvbWFpbiBhbmQgc3VpdGFibGUgc3RlcFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldE51bWVyaWNGaWVsZERvbWFpbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIGxldCBkb21haW4gPSBbMCwgMV07XG4gIGxldCBzdGVwID0gMC4xO1xuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgZG9tYWluID0gU2NhbGVVdGlscy5nZXRMaW5lYXJEb21haW4obWFwcGVkVmFsdWUpO1xuICAgIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG5cbiAgICAvLyBpbiBjYXNlIGVxdWFsIGRvbWFpbiwgWzk2LCA5Nl0sIHdoaWNoIHdpbGwgYnJlYWsgcXVhbnRpemUgc2NhbGVcbiAgICBpZiAoIWRpZmYpIHtcbiAgICAgIGRvbWFpblsxXSA9IGRvbWFpblswXSArIDE7XG4gICAgfVxuXG4gICAgc3RlcCA9IGdldE51bWVyaWNTdGVwU2l6ZShkaWZmKSB8fCBzdGVwO1xuICAgIGRvbWFpblswXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMF0sIHN0ZXAsICdmbG9vcicpO1xuICAgIGRvbWFpblsxXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMV0sIHN0ZXAsICdjZWlsJyk7XG4gIH1cblxuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IHtoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfSA9IGdldEhpc3RvZ3JhbShkb21haW4sIG1hcHBlZFZhbHVlKTtcblxuICByZXR1cm4ge2RvbWFpbiwgc3RlcCwgaGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHN0ZXAgc2l6ZSBmb3IgcmFuZ2UgYW5kIHRpbWVyYW5nZSBmaWx0ZXJcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXROdW1lcmljU3RlcFNpemV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1lcmljU3RlcFNpemUoZGlmZikge1xuICBkaWZmID0gTWF0aC5hYnMoZGlmZik7XG5cbiAgaWYgKGRpZmYgPiAxMDApIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChkaWZmID4gMykge1xuICAgIHJldHVybiAwLjAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPiAxKSB7XG4gICAgcmV0dXJuIDAuMDAxO1xuICB9XG4gIC8vIFRyeSB0byBnZXQgYXQgbGVhc3QgMTAwMCBzdGVwcyAtIGFuZCBrZWVwIHRoZSBzdGVwIHNpemUgYmVsb3cgdGhhdCBvZlxuICAvLyB0aGUgKGRpZmYgPiAxKSBjYXNlLlxuICBjb25zdCB4ID0gZGlmZiAvIDEwMDA7XG4gIC8vIEZpbmQgdGhlIGV4cG9uZW50IGFuZCB0cnVuY2F0ZSB0byAxMCB0byB0aGUgcG93ZXIgb2YgdGhhdCBleHBvbmVudFxuXG4gIGNvbnN0IGV4cG9uZW50aWFsRm9ybSA9IHgudG9FeHBvbmVudGlhbCgpO1xuICBjb25zdCBleHBvbmVudCA9IHBhcnNlRmxvYXQoZXhwb25lbnRpYWxGb3JtLnNwbGl0KCdlJylbMV0pO1xuXG4gIC8vIEdldHRpbmcgcmVhZHkgZm9yIG5vZGUgMTJcbiAgLy8gdGhpcyBpcyB3aHkgd2UgbmVlZCBkZWNpbWFsLmpzXG4gIC8vIE1hdGgucG93KDEwLCAtNSkgPSAwLjAwMDAwOTk5OTk5OTk5OTk5OTk5OVxuICAvLyB0aGUgYWJvdmUgcmVzdWx0IHNob3dzIGluIGJyb3dzZXIgYW5kIG5vZGUgMTBcbiAgLy8gbm9kZSAxMiBiZWhhdmVzIGNvcnJlY3RseVxuICByZXR1cm4gbmV3IERlY2ltYWwoMTApLnBvdyhleHBvbmVudCkudG9OdW1iZXIoKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGltZXN0YW1wIGRvbWFpbiBhbmQgc3VpdGFibGUgc3RlcFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldFRpbWVzdGFtcEZpZWxkRG9tYWlufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZXN0YW1wRmllbGREb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcikge1xuICAvLyB0byBhdm9pZCBjb252ZXJ0aW5nIHN0cmluZyBmb3JtYXQgdGltZSB0byBlcG9jaFxuICAvLyBldmVyeSB0aW1lIHdlIGNvbXBhcmUgd2Ugc3RvcmUgYSB2YWx1ZSBtYXBwZWQgdG8gaW50IGluIGZpbHRlciBkb21haW5cblxuICBjb25zdCBtYXBwZWRWYWx1ZSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLm1hcCh2YWx1ZUFjY2Vzc29yKSA6IFtdO1xuICBjb25zdCBkb21haW4gPSBTY2FsZVV0aWxzLmdldExpbmVhckRvbWFpbihtYXBwZWRWYWx1ZSk7XG4gIGNvbnN0IGRlZmF1bHRUaW1lRm9ybWF0ID0gZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyKGRvbWFpbik7XG5cbiAgbGV0IHN0ZXAgPSAwLjAxO1xuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIGNvbnN0IGVudHJ5ID0gVGltZXN0YW1wU3RlcE1hcC5maW5kKGYgPT4gZi5tYXggPj0gZGlmZik7XG4gIGlmIChlbnRyeSkge1xuICAgIHN0ZXAgPSBlbnRyeS5zdGVwO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7XG4gICAgZG9tYWluLFxuICAgIHN0ZXAsXG4gICAgbWFwcGVkVmFsdWUsXG4gICAgaGlzdG9ncmFtLFxuICAgIGVubGFyZ2VkSGlzdG9ncmFtLFxuICAgIGRlZmF1bHRUaW1lRm9ybWF0XG4gIH07XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmhpc3RvZ3JhbUNvbnN0cnVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCBiaW5zKSB7XG4gIHJldHVybiBkM0hpc3RvZ3JhbSgpXG4gICAgLnRocmVzaG9sZHModGlja3MoZG9tYWluWzBdLCBkb21haW5bMV0sIGJpbnMpKVxuICAgIC5kb21haW4oZG9tYWluKShtYXBwZWRWYWx1ZSlcbiAgICAubWFwKGJpbiA9PiAoe1xuICAgICAgY291bnQ6IGJpbi5sZW5ndGgsXG4gICAgICB4MDogYmluLngwLFxuICAgICAgeDE6IGJpbi54MVxuICAgIH0pKTtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIGhpc3RvZ3JhbSBmcm9tIGRvbWFpbiBhbmQgYXJyYXkgb2YgdmFsdWVzXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0SGlzdG9ncmFtfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpIHtcbiAgY29uc3QgaGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGhpc3RvZ3JhbUJpbnMpO1xuICBjb25zdCBlbmxhcmdlZEhpc3RvZ3JhbSA9IGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCBlbmxhcmdlZEhpc3RvZ3JhbUJpbnMpO1xuXG4gIHJldHVybiB7aGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbi8qKlxuICogcm91bmQgbnVtYmVyIGJhc2VkIG9uIHN0ZXBcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdmFsXG4gKiBAcGFyYW0ge051bWJlcn0gc3RlcFxuICogQHBhcmFtIHtzdHJpbmd9IGJvdW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSByb3VuZGVkIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TnVtYmVyQnlTdGVwKHZhbCwgc3RlcCwgYm91bmQpIHtcbiAgaWYgKGJvdW5kID09PSAnZmxvb3InKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsICogKDEgLyBzdGVwKSkgLyAoMSAvIHN0ZXApO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguY2VpbCh2YWwgKiAoMSAvIHN0ZXApKSAvICgxIC8gc3RlcCk7XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmlzSW5SYW5nZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5SYW5nZSh2YWwsIGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB2YWwgPj0gZG9tYWluWzBdICYmIHZhbCA8PSBkb21haW5bMV07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgcG9pbnQgaXMgd2l0aGluIHRoZSBwcm92aWRlZCBwb2x5Z29uXG4gKlxuICogQHBhcmFtIHBvaW50IGFzIGlucHV0IHNlYXJjaCBbbGF0LCBsbmddXG4gKiBAcGFyYW0gcG9seWdvbiBQb2ludHMgbXVzdCBiZSB3aXRoaW4gdGhlc2UgKE11bHRpKVBvbHlnb24ocylcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0luUG9seWdvbihwb2ludCwgcG9seWdvbikge1xuICByZXR1cm4gYm9vbGVhbldpdGhpbih0dXJmUG9pbnQocG9pbnQpLCBwb2x5Z29uKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVGltZURvbWFpbihkb21haW4pIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZG9tYWluKSAmJiBkb21haW4uZXZlcnkoTnVtYmVyLmlzRmluaXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghaXNWYWxpZFRpbWVEb21haW4oZG9tYWluKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICAvLyBMb2NhbCBhd2FyZSBmb3JtYXRzXG4gIC8vIGh0dHBzOi8vbW9tZW50anMuY29tL2RvY3MvIy9wYXJzaW5nL3N0cmluZy1mb3JtYXRcbiAgcmV0dXJuIGRpZmYgPiBkdXJhdGlvblllYXIgPyAnTCcgOiBkaWZmID4gZHVyYXRpb25EYXkgPyAnTCBMVCcgOiAnTCBMVFMnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghaXNWYWxpZFRpbWVEb21haW4oZG9tYWluKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcbiAgcmV0dXJuIGRpZmYgPiBkdXJhdGlvbldlZWtcbiAgICA/ICdMJ1xuICAgIDogZGlmZiA+IGR1cmF0aW9uRGF5XG4gICAgPyAnTCBMVCdcbiAgICA6IGRpZmYgPiBkdXJhdGlvbkhvdXJcbiAgICA/ICdMVCdcbiAgICA6ICdMVFMnO1xufVxuXG4vKipcbiAqIFNhbml0eSBjaGVjayBvbiBmaWx0ZXJzIHRvIHByZXBhcmUgZm9yIHNhdmVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmlzVmFsaWRGaWx0ZXJWYWx1ZX1cbiAqL1xuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRGaWx0ZXJWYWx1ZSh0eXBlLCB2YWx1ZSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeSh2ID0+IHYgIT09IG51bGwgJiYgIWlzTmFOKHYpKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLmlucHV0OlxuICAgICAgcmV0dXJuIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnBvbHlnb246XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldCh2YWx1ZSwgWydnZW9tZXRyeScsICdjb29yZGluYXRlcyddKTtcbiAgICAgIHJldHVybiBCb29sZWFuKHZhbHVlICYmIHZhbHVlLmlkICYmIGNvb3JkaW5hdGVzKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRGaWx0ZXJQbG90fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyUGxvdChmaWx0ZXIsIGRhdGFzZXQpIHtcbiAgaWYgKGZpbHRlci5wbG90VHlwZSA9PT0gUExPVF9UWVBFUy5oaXN0b2dyYW0gfHwgIWZpbHRlci55QXhpcykge1xuICAgIC8vIGhpc3RvZ3JhbSBzaG91bGQgYmUgY2FsY3VsYXRlZCB3aGVuIGNyZWF0ZSBmaWx0ZXJcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCB7bWFwcGVkVmFsdWUgPSBbXX0gPSBmaWx0ZXI7XG4gIGNvbnN0IHt5QXhpc30gPSBmaWx0ZXI7XG4gIGNvbnN0IGZpZWxkSWR4ID0gZGF0YXNldC5nZXRDb2x1bW5GaWVsZElkeCh5QXhpcy5uYW1lKTtcbiAgaWYgKGZpZWxkSWR4IDwgMCkge1xuICAgIENvbnNvbGUud2FybihgeUF4aXMgJHt5QXhpcy5uYW1lfSBkb2VzIG5vdCBleGlzdCBpbiBkYXRhc2V0YCk7XG4gICAgcmV0dXJuIHtsaW5lQ2hhcnQ6IHt9LCB5QXhpc307XG4gIH1cblxuICAvLyByZXR1cm4gbGluZUNoYXJ0XG4gIGNvbnN0IHNlcmllcyA9IGRhdGFzZXQuYWxsRGF0YVxuICAgIC5tYXAoKGQsIGkpID0+ICh7XG4gICAgICB4OiBtYXBwZWRWYWx1ZVtpXSxcbiAgICAgIHk6IGRbZmllbGRJZHhdXG4gICAgfSkpXG4gICAgLmZpbHRlcigoe3gsIHl9KSA9PiBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhc2NlbmRpbmcoYS54LCBiLngpKTtcblxuICBjb25zdCB5RG9tYWluID0gZXh0ZW50KHNlcmllcywgZCA9PiBkLnkpO1xuICBjb25zdCB4RG9tYWluID0gW3Nlcmllc1swXS54LCBzZXJpZXNbc2VyaWVzLmxlbmd0aCAtIDFdLnhdO1xuXG4gIHJldHVybiB7bGluZUNoYXJ0OiB7c2VyaWVzLCB5RG9tYWluLCB4RG9tYWlufSwgeUF4aXN9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKGZpbHRlcikge1xuICBjb25zdCBmaWx0ZXJQbG90VHlwZXMgPSBTdXBwb3J0ZWRQbG90VHlwZVtmaWx0ZXIudHlwZV07XG4gIGlmICghZmlsdGVyUGxvdFR5cGVzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWZpbHRlci55QXhpcykge1xuICAgIHJldHVybiBmaWx0ZXJQbG90VHlwZXMuZGVmYXVsdDtcbiAgfVxuXG4gIHJldHVybiBmaWx0ZXJQbG90VHlwZXNbZmlsdGVyLnlBeGlzLnR5cGVdIHx8IG51bGw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBkYXRhc2V0SWRzIGxpc3Qgb2YgZGF0YXNldCBpZHMgdG8gYmUgZmlsdGVyZWRcbiAqIEBwYXJhbSBkYXRhc2V0cyBhbGwgZGF0YXNldHNcbiAqIEBwYXJhbSBmaWx0ZXJzIGFsbCBmaWx0ZXJzIHRvIGJlIGFwcGxpZWQgdG8gZGF0YXNldHNcbiAqIEByZXR1cm4gZGF0YXNldHMgLSBuZXcgdXBkYXRlZCBkYXRhc2V0c1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuYXBwbHlGaWx0ZXJzVG9EYXRhc2V0c31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5RmlsdGVyc1RvRGF0YXNldHMoZGF0YXNldElkcywgZGF0YXNldHMsIGZpbHRlcnMsIGxheWVycykge1xuICBjb25zdCBkYXRhSWRzID0gdG9BcnJheShkYXRhc2V0SWRzKTtcbiAgcmV0dXJuIGRhdGFJZHMucmVkdWNlKChhY2MsIGRhdGFJZCkgPT4ge1xuICAgIGNvbnN0IGxheWVyc1RvRmlsdGVyID0gKGxheWVycyB8fCBbXSkuZmlsdGVyKGwgPT4gbC5jb25maWcuZGF0YUlkID09PSBkYXRhSWQpO1xuICAgIGNvbnN0IGFwcGxpZWRGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZCA9PiBzaG91bGRBcHBseUZpbHRlcihkLCBkYXRhSWQpKTtcbiAgICBjb25zdCB0YWJsZSA9IGRhdGFzZXRzW2RhdGFJZF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYWNjLFxuICAgICAgW2RhdGFJZF06IHRhYmxlLmZpbHRlclRhYmxlKGFwcGxpZWRGaWx0ZXJzLCBsYXllcnNUb0ZpbHRlciwge30pXG4gICAgfTtcbiAgfSwgZGF0YXNldHMpO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgYSBuZXcgZmllbGQgbmFtZSB2YWx1ZSB0byBmaWVsdGVyIGFuZCB1cGRhdGUgYm90aCBmaWx0ZXIgYW5kIGRhdGFzZXRcbiAqIEBwYXJhbSBmaWx0ZXIgLSB0byBiZSBhcHBsaWVkIHRoZSBuZXcgZmllbGQgbmFtZSBvblxuICogQHBhcmFtIGRhdGFzZXQgLSBkYXRhc2V0IHRoZSBmaWVsZCBiZWxvbmdzIHRvXG4gKiBAcGFyYW0gZmllbGROYW1lIC0gZmllbGQubmFtZVxuICogQHBhcmFtIGZpbHRlckRhdGFzZXRJbmRleCAtIGZpZWxkLm5hbWVcbiAqIEBwYXJhbSBvcHRpb25cbiAqIEByZXR1cm4gLSB7ZmlsdGVyLCBkYXRhc2V0c31cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmFwcGx5RmlsdGVyRmllbGROYW1lfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlGaWx0ZXJGaWVsZE5hbWUoZmlsdGVyLCBkYXRhc2V0LCBmaWVsZE5hbWUsIGZpbHRlckRhdGFzZXRJbmRleCA9IDAsIG9wdGlvbikge1xuICAvLyB1c2luZyBmaWx0ZXJEYXRhc2V0SW5kZXggd2UgY2FuIGZpbHRlciBvbmx5IHRoZSBzcGVjaWZpZWQgZGF0YXNldFxuICBjb25zdCBtZXJnZURvbWFpbiA9IG9wdGlvbiAmJiBvcHRpb24uaGFzT3duUHJvcGVydHkoJ21lcmdlRG9tYWluJykgPyBvcHRpb24ubWVyZ2VEb21haW4gOiBmYWxzZTtcblxuICBjb25zdCBmaWVsZEluZGV4ID0gZGF0YXNldC5nZXRDb2x1bW5GaWVsZElkeChmaWVsZE5hbWUpO1xuICAvLyBpZiBubyBmaWVsZCB3aXRoIHNhbWUgbmFtZSBpcyBmb3VuZCwgbW92ZSB0byB0aGUgbmV4dCBkYXRhc2V0c1xuICBpZiAoZmllbGRJbmRleCA9PT0gLTEpIHtcbiAgICAvLyB0aHJvdyBuZXcgRXJyb3IoYGZpZWxkSW5kZXggbm90IGZvdW5kLiBEYXRhc2V0IG11c3QgY29udGFpbiBhIHByb3BlcnR5IHdpdGggbmFtZTogJHtmaWVsZE5hbWV9YCk7XG4gICAgcmV0dXJuIHtmaWx0ZXI6IG51bGwsIGRhdGFzZXR9O1xuICB9XG5cbiAgLy8gVE9ETzogdmFsaWRhdGUgZmllbGQgdHlwZVxuICBjb25zdCBmaWx0ZXJQcm9wcyA9IGRhdGFzZXQuZ2V0Q29sdW1uRmlsdGVyUHJvcHMoZmllbGROYW1lKTtcblxuICBjb25zdCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uKG1lcmdlRG9tYWluID8gbWVyZ2VGaWx0ZXJEb21haW5TdGVwKGZpbHRlciwgZmlsdGVyUHJvcHMpIDogey4uLmZpbHRlciwgLi4uZmlsdGVyUHJvcHN9KSxcbiAgICBuYW1lOiBPYmplY3QuYXNzaWduKFsuLi50b0FycmF5KGZpbHRlci5uYW1lKV0sIHtbZmlsdGVyRGF0YXNldEluZGV4XTogZmllbGROYW1lfSksXG4gICAgZmllbGRJZHg6IE9iamVjdC5hc3NpZ24oWy4uLnRvQXJyYXkoZmlsdGVyLmZpZWxkSWR4KV0sIHtcbiAgICAgIFtmaWx0ZXJEYXRhc2V0SW5kZXhdOiBmaWVsZEluZGV4XG4gICAgfSksXG4gICAgLy8gVE9ETywgc2luY2Ugd2UgYWxsb3cgdG8gYWRkIG11bHRpcGxlIGZpZWxkcyB0byBhIGZpbHRlciB3ZSBjYW4gbm8gbG9uZ2VyIGZyZWV6ZSB0aGUgZmlsdGVyXG4gICAgZnJlZXplOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBmaWx0ZXI6IG5ld0ZpbHRlcixcbiAgICBkYXRhc2V0XG4gIH07XG59XG5cbi8qKlxuICogTWVyZ2Ugb25lIGZpbHRlciB3aXRoIG90aGVyIGZpbHRlciBwcm9wIGRvbWFpblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykubWVyZ2VGaWx0ZXJEb21haW5TdGVwfVxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VGaWx0ZXJEb21haW5TdGVwKGZpbHRlciwgZmlsdGVyUHJvcHMpIHtcbiAgaWYgKCFmaWx0ZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyUHJvcHMpIHtcbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgaWYgKChmaWx0ZXIuZmllbGRUeXBlICYmIGZpbHRlci5maWVsZFR5cGUgIT09IGZpbHRlclByb3BzLmZpZWxkVHlwZSkgfHwgIWZpbHRlclByb3BzLmRvbWFpbikge1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBjb25zdCBjb21iaW5lZERvbWFpbiA9ICFmaWx0ZXIuZG9tYWluXG4gICAgPyBmaWx0ZXJQcm9wcy5kb21haW5cbiAgICA6IFsuLi4oZmlsdGVyLmRvbWFpbiB8fCBbXSksIC4uLihmaWx0ZXJQcm9wcy5kb21haW4gfHwgW10pXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgY29uc3QgbmV3RmlsdGVyID0ge1xuICAgIC4uLmZpbHRlcixcbiAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICBkb21haW46IFtjb21iaW5lZERvbWFpblswXSwgY29tYmluZWREb21haW5bY29tYmluZWREb21haW4ubGVuZ3RoIC0gMV1dXG4gIH07XG5cbiAgc3dpdGNoIChmaWx0ZXJQcm9wcy5maWVsZFR5cGUpIHtcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5hcnJheTpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgZG9tYWluOiB1bmlxdWUoY29tYmluZWREb21haW4pLnNvcnQoKVxuICAgICAgfTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IHN0ZXAgPSBmaWx0ZXIuc3RlcCA8IGZpbHRlclByb3BzLnN0ZXAgPyBmaWx0ZXIuc3RlcCA6IGZpbHRlclByb3BzLnN0ZXA7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgc3RlcFxuICAgICAgfTtcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5yZWFsOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBuZXdGaWx0ZXI7XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4vKipcbiAqIEdlbmVyYXRlcyBwb2x5Z29uIGZpbHRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZmVhdHVyZVRvRmlsdGVyVmFsdWV9XG4gKi9cbmV4cG9ydCBjb25zdCBmZWF0dXJlVG9GaWx0ZXJWYWx1ZSA9IChmZWF0dXJlLCBmaWx0ZXJJZCwgcHJvcGVydGllcyA9IHt9KSA9PiAoe1xuICAuLi5mZWF0dXJlLFxuICBpZDogZmVhdHVyZS5pZCxcbiAgcHJvcGVydGllczoge1xuICAgIC4uLmZlYXR1cmUucHJvcGVydGllcyxcbiAgICAuLi5wcm9wZXJ0aWVzLFxuICAgIGZpbHRlcklkXG4gIH1cbn0pO1xuXG4vKipcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEZpbHRlcklkSW5GZWF0dXJlfVxuICovXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVySWRJbkZlYXR1cmUgPSBmID0+IGdldChmLCBbJ3Byb3BlcnRpZXMnLCAnZmlsdGVySWQnXSk7XG5cbi8qKlxuICogR2VuZXJhdGVzIHBvbHlnb24gZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZW5lcmF0ZVBvbHlnb25GaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBvbHlnb25GaWx0ZXIobGF5ZXJzLCBmZWF0dXJlKSB7XG4gIGNvbnN0IGRhdGFJZCA9IGxheWVycy5tYXAobCA9PiBsLmNvbmZpZy5kYXRhSWQpLmZpbHRlcihkID0+IGQpO1xuICBjb25zdCBsYXllcklkID0gbGF5ZXJzLm1hcChsID0+IGwuaWQpO1xuICBjb25zdCBuYW1lID0gbGF5ZXJzLm1hcChsID0+IGwuY29uZmlnLmxhYmVsKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBmaWx0ZXIgPSBnZXREZWZhdWx0RmlsdGVyKGRhdGFJZCk7XG4gIHJldHVybiB7XG4gICAgLi4uZmlsdGVyLFxuICAgIGZpeGVkRG9tYWluOiB0cnVlLFxuICAgIHR5cGU6IEZJTFRFUl9UWVBFUy5wb2x5Z29uLFxuICAgIG5hbWUsXG4gICAgbGF5ZXJJZCxcbiAgICB2YWx1ZTogZmVhdHVyZVRvRmlsdGVyVmFsdWUoZmVhdHVyZSwgZmlsdGVyLmlkLCB7aXNWaXNpYmxlOiB0cnVlfSlcbiAgfTtcbn1cblxuLyoqXG4gKiBSdW4gZmlsdGVyIGVudGlyZWx5IG9uIENQVVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZmlsdGVyRGF0YXNldENQVX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGFzZXRDUFUoc3RhdGUsIGRhdGFJZCkge1xuICBjb25zdCBkYXRhc2V0RmlsdGVycyA9IHN0YXRlLmZpbHRlcnMuZmlsdGVyKGYgPT4gZi5kYXRhSWQuaW5jbHVkZXMoZGF0YUlkKSk7XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuXG4gIGlmICghZGF0YXNldCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGNwdUZpbHRlcmVkRGF0YXNldCA9IGRhdGFzZXQuZmlsdGVyVGFibGVDUFUoZGF0YXNldEZpbHRlcnMsIHN0YXRlLmxheWVycyk7XG5cbiAgcmV0dXJuIHNldChbJ2RhdGFzZXRzJywgZGF0YUlkXSwgY3B1RmlsdGVyZWREYXRhc2V0LCBzdGF0ZSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgcGFyc2VkIGZpbHRlcnMgd2l0aCBkYXRhc2V0cyBhbmQgYWRkIGZpbHRlclByb3BzIHRvIGZpZWxkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS52YWxpZGF0ZUZpbHRlcnNVcGRhdGVEYXRhc2V0c31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRmlsdGVyc1VwZGF0ZURhdGFzZXRzKHN0YXRlLCBmaWx0ZXJzVG9WYWxpZGF0ZSA9IFtdKSB7XG4gIGNvbnN0IHZhbGlkYXRlZCA9IFtdO1xuICBjb25zdCBmYWlsZWQgPSBbXTtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuICBsZXQgdXBkYXRlZERhdGFzZXRzID0gZGF0YXNldHM7XG5cbiAgLy8gbWVyZ2UgZmlsdGVyc1xuICBmaWx0ZXJzVG9WYWxpZGF0ZS5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgLy8gd2UgY2FuIG9ubHkgbG9vayBmb3IgZGF0YXNldHMgZGVmaW5lIGluIHRoZSBmaWx0ZXIgZGF0YUlkXG4gICAgY29uc3QgZGF0YXNldElkcyA9IHRvQXJyYXkoZmlsdGVyLmRhdGFJZCk7XG5cbiAgICAvLyB3ZSBjYW4gbWVyZ2UgYSBmaWx0ZXIgb25seSBpZiBhbGwgZGF0YXNldHMgaW4gZmlsdGVyLmRhdGFJZCBhcmUgbG9hZGVkXG4gICAgaWYgKGRhdGFzZXRJZHMuZXZlcnkoZCA9PiBkYXRhc2V0c1tkXSkpIHtcbiAgICAgIC8vIGFsbCBkYXRhc2V0SWRzIGluIGZpbHRlciBtdXN0IGJlIHByZXNlbnQgdGhlIHN0YXRlIGRhdGFzZXRzXG4gICAgICBjb25zdCB7ZmlsdGVyOiB2YWxpZGF0ZWRGaWx0ZXIsIGFwcGx5VG9EYXRhc2V0cywgYXVnbWVudGVkRGF0YXNldHN9ID0gZGF0YXNldElkcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGRhdGFzZXRJZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGFzZXQgPSB1cGRhdGVkRGF0YXNldHNbZGF0YXNldElkXTtcbiAgICAgICAgICBjb25zdCBsYXllcnMgPSBzdGF0ZS5sYXllcnMuZmlsdGVyKGwgPT4gbC5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0LmlkKTtcbiAgICAgICAgICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiB1cGRhdGVkRGF0YXNldH0gPSB2YWxpZGF0ZUZpbHRlcldpdGhEYXRhKFxuICAgICAgICAgICAgYWNjLmF1Z21lbnRlZERhdGFzZXRzW2RhdGFzZXRJZF0gfHwgZGF0YXNldCxcbiAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgIGxheWVyc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAodXBkYXRlZEZpbHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgICAgICAvLyBtZXJnZSBmaWx0ZXIgcHJvcHNcbiAgICAgICAgICAgICAgZmlsdGVyOiBhY2MuZmlsdGVyXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmFjYy5maWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgIC4uLm1lcmdlRmlsdGVyRG9tYWluU3RlcChhY2MsIHVwZGF0ZWRGaWx0ZXIpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1cGRhdGVkRmlsdGVyLFxuXG4gICAgICAgICAgICAgIGFwcGx5VG9EYXRhc2V0czogWy4uLmFjYy5hcHBseVRvRGF0YXNldHMsIGRhdGFzZXRJZF0sXG5cbiAgICAgICAgICAgICAgYXVnbWVudGVkRGF0YXNldHM6IHtcbiAgICAgICAgICAgICAgICAuLi5hY2MuYXVnbWVudGVkRGF0YXNldHMsXG4gICAgICAgICAgICAgICAgW2RhdGFzZXRJZF06IHVwZGF0ZWREYXRhc2V0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcjogbnVsbCxcbiAgICAgICAgICBhcHBseVRvRGF0YXNldHM6IFtdLFxuICAgICAgICAgIGF1Z21lbnRlZERhdGFzZXRzOiB7fVxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBpZiAodmFsaWRhdGVkRmlsdGVyICYmIGlzRXF1YWwoZGF0YXNldElkcywgYXBwbHlUb0RhdGFzZXRzKSkge1xuICAgICAgICB2YWxpZGF0ZWQucHVzaCh2YWxpZGF0ZWRGaWx0ZXIpO1xuICAgICAgICB1cGRhdGVkRGF0YXNldHMgPSB7XG4gICAgICAgICAgLi4udXBkYXRlZERhdGFzZXRzLFxuICAgICAgICAgIC4uLmF1Z21lbnRlZERhdGFzZXRzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhaWxlZC5wdXNoKGZpbHRlcik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge3ZhbGlkYXRlZCwgZmFpbGVkLCB1cGRhdGVkRGF0YXNldHN9O1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGludGVydmFsIGJpbnMgZm9yIHRpbWUgZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRJbnRlcnZhbEJpbnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnRlcnZhbEJpbnMoZmlsdGVyKSB7XG4gIGNvbnN0IHtiaW5zfSA9IGZpbHRlcjtcbiAgY29uc3QgaW50ZXJ2YWwgPSBmaWx0ZXIucGxvdFR5cGU/LmludGVydmFsO1xuICBpZiAoIWludGVydmFsIHx8ICFiaW5zIHx8IE9iamVjdC5rZXlzKGJpbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYmlucyk7XG4gIHJldHVybiB2YWx1ZXNbMF0gPyB2YWx1ZXNbMF1baW50ZXJ2YWxdIDogbnVsbDtcbn1cbiJdfQ==