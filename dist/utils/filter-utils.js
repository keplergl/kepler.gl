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
exports.getFieldDomain = getFieldDomain;
exports.getFilterFunction = getFilterFunction;
exports.updateFilterDataId = updateFilterDataId;
exports.filterDataset = filterDataset;
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
exports.getFilterIdInFeature = exports.featureToFilterValue = exports.getPolygonFilterFunctor = exports.LAYER_FILTERS = exports.FILTER_ID_LENGTH = exports.DEFAULT_FILTER_STRUCTURE = exports.FILTER_COMPONENTS = exports.LIMITED_FILTER_EFFECT_PROPS = exports.FILTER_UPDATER_PROPS = exports.PLOT_TYPES = exports.enlargedHistogramBins = exports.histogramBins = exports.TimestampStepMap = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _d3Array = require("d3-array");

var _keymirror = _interopRequireDefault(require("keymirror"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _booleanWithin = _interopRequireDefault(require("@turf/boolean-within"));

var _helpers = require("@turf/helpers");

var _decimal = require("decimal.js");

var _defaultSettings = require("../constants/default-settings");

var _dataUtils = require("./data-utils");

var ScaleUtils = _interopRequireWildcard(require("./data-scale-utils"));

var _constants = require("../constants");

var _utils = require("./utils");

var _gpuFilterUtils = require("./gpu-filter-utils");

var _FILTER_TYPES$timeRan, _FILTER_TYPES$range, _SupportedPlotType, _FILTER_COMPONENTS;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// TYPE

/** @typedef {import('../reducers/vis-state-updaters').FilterRecord} FilterRecord */

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
  return _objectSpread({}, DEFAULT_FILTER_STRUCTURE, {
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
    filter: _objectSpread({}, filter, {
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

  var initializeFilter = _objectSpread({}, getDefaultFilter(filter.dataId), {}, filter, {
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
  var fields = dataset.fields,
      allData = dataset.allData;
  var _filter = filter,
      yAxis = _filter.yAxis; // TODO: validate yAxis against other datasets

  if (yAxis) {
    var matchedAxis = fields.find(function (_ref) {
      var name = _ref.name,
          type = _ref.type;
      return name === yAxis.name && type === yAxis.type;
    });
    filter = matchedAxis ? _objectSpread({}, filter, {
      yAxis: matchedAxis
    }, getFilterPlot(_objectSpread({}, filter, {
      yAxis: matchedAxis
    }), allData)) : filter;
  }

  return filter;
}
/**
 * Get default filter prop based on field type
 *
 * @param allData
 * @param field
 * @returns default filter
 * @type {typeof import('./filter-utils').getFilterProps}
 */


function getFilterProps(allData, field) {
  var filterProps = _objectSpread({}, getFieldDomain(allData, field), {
    fieldType: field.type
  });

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      return _objectSpread({}, filterProps, {
        value: filterProps.domain,
        type: _defaultSettings.FILTER_TYPES.range,
        typeOptions: [_defaultSettings.FILTER_TYPES.range],
        gpu: true
      });

    case _defaultSettings.ALL_FIELD_TYPES["boolean"]:
      return _objectSpread({}, filterProps, {
        type: _defaultSettings.FILTER_TYPES.select,
        value: true,
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread({}, filterProps, {
        type: _defaultSettings.FILTER_TYPES.multiSelect,
        value: [],
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return _objectSpread({}, filterProps, {
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
/**
 * Calculate field domain based on field type and data
 *
 * @type {typeof import('./filter-utils').getFieldDomain}
 */


function getFieldDomain(allData, field) {
  var fieldIdx = field.tableFieldIndex - 1;
  var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;

  var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);

  var domain;

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      // calculate domain and step
      return getNumericFieldDomain(allData, valueAccessor);

    case _defaultSettings.ALL_FIELD_TYPES["boolean"]:
      return {
        domain: [true, false]
      };

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      domain = ScaleUtils.getOrdinalDomain(allData, valueAccessor);
      return {
        domain: domain
      };

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return getTimestampFieldDomain(allData, valueAccessor);

    default:
      return {
        domain: ScaleUtils.getOrdinalDomain(allData, valueAccessor)
      };
  }
}

var getPolygonFilterFunctor = function getPolygonFilterFunctor(layer, filter) {
  var getPosition = layer.getPositionAccessor();

  switch (layer.type) {
    case _constants.LAYER_TYPES.point:
    case _constants.LAYER_TYPES.icon:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };

    case _constants.LAYER_TYPES.arc:
    case _constants.LAYER_TYPES.line:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && [[pos[0], pos[1]], [pos[3], pos[4]]].every(function (point) {
          return isInPolygon(point, filter.value);
        });
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
  var valueAccessor = function valueAccessor(data) {
    return field ? data[field.tableFieldIndex - 1] : null;
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
        return filter.value.includes(valueAccessor(data));
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
      return function (data) {
        return layerFilterFunctions.every(function (filterFunc) {
          return filterFunc(data);
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
 * Filter data based on an array of filters
 * @type {typeof import('./filter-utils').filterDataset}
 */


function filterDataset(dataset, filters, layers, opt) {
  var allData = dataset.allData,
      dataId = dataset.id,
      oldFilterRecord = dataset.filterRecord,
      fields = dataset.fields; // if there is no filters

  var filterRecord = getFilterRecord(dataId, filters, opt || {});
  var newDataset = (0, _utils.set)(['filterRecord'], filterRecord, dataset);

  if (!filters.length) {
    return _objectSpread({}, newDataset, {
      gpuFilter: (0, _gpuFilterUtils.getGpuFilterProps)(filters, dataId, fields),
      filteredIndex: dataset.allIndexes,
      filteredIndexForDomain: dataset.allIndexes
    });
  }

  var changedFilters = diffFilters(filterRecord, oldFilterRecord); // generate 2 sets of filter result
  // filteredIndex used to calculate layer data
  // filteredIndexForDomain used to calculate layer Domain

  var shouldCalDomain = Boolean(changedFilters.dynamicDomain);
  var shouldCalIndex = Boolean(changedFilters.cpu);
  var filterResult = {};

  if (shouldCalDomain || shouldCalIndex) {
    var dynamicDomainFilters = shouldCalDomain ? filterRecord.dynamicDomain : null;
    var cpuFilters = shouldCalIndex ? filterRecord.cpu : null;
    var filterFuncs = filters.reduce(function (acc, filter) {
      var fieldIndex = (0, _gpuFilterUtils.getDatasetFieldIndexForFilter)(dataset.id, filter);
      var field = fieldIndex !== -1 ? fields[fieldIndex] : null;
      return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, filter.id, getFilterFunction(field, dataset.id, filter, layers)));
    }, {});
    filterResult = filterDataByFilterTypes({
      dynamicDomainFilters: dynamicDomainFilters,
      cpuFilters: cpuFilters,
      filterFuncs: filterFuncs
    }, allData);
  }

  return _objectSpread({}, newDataset, {}, filterResult, {
    gpuFilter: (0, _gpuFilterUtils.getGpuFilterProps)(filters, dataId, fields)
  });
}
/**
 * @type {typeof import('./filter-utils').filterDataByFilterTypes}
 */


function filterDataByFilterTypes(_ref2, allData) {
  var dynamicDomainFilters = _ref2.dynamicDomainFilters,
      cpuFilters = _ref2.cpuFilters,
      filterFuncs = _ref2.filterFuncs;

  var result = _objectSpread({}, dynamicDomainFilters ? {
    filteredIndexForDomain: []
  } : {}, {}, cpuFilters ? {
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
    enlargedHistogram: enlargedHistogram
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

function getTimeWidgetTitleFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationYear ? 'MM/DD/YY' : diff > durationDay ? 'MM/DD/YY hh:mma' : 'MM/DD/YY hh:mm:ssa';
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


function getFilterPlot(filter, allData) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  var _filter$mappedValue = filter.mappedValue,
      mappedValue = _filter$mappedValue === void 0 ? [] : _filter$mappedValue;
  var yAxis = filter.yAxis; // return lineChart

  var series = allData.map(function (d, i) {
    return {
      x: mappedValue[i],
      y: d[yAxis.tableFieldIndex - 1]
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
    return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, dataId, filterDataset(datasets[dataId], appliedFilters, layersToFilter, {})));
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
  var fields = dataset.fields,
      allData = dataset.allData;
  var fieldIndex = fields.findIndex(function (f) {
    return f.name === fieldName;
  }); // if no field with same name is found, move to the next datasets

  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {
      filter: null,
      dataset: dataset
    };
  } // TODO: validate field type


  var field = fields[fieldIndex];
  var filterProps = field.hasOwnProperty('filterProps') ? field.filterProps : getFilterProps(allData, field);

  var newFilter = _objectSpread({}, mergeDomain ? mergeFilterDomainStep(filter, filterProps) : _objectSpread({}, filter, {}, filterProps), {
    name: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.name)), (0, _defineProperty2["default"])({}, filterDatasetIndex, field.name)),
    fieldIdx: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.fieldIdx)), (0, _defineProperty2["default"])({}, filterDatasetIndex, field.tableFieldIndex - 1)),
    // TODO, since we allow to add multiple fields to a filter we can no longer freeze the filter
    freeze: true
  });

  var fieldWithFilterProps = _objectSpread({}, field, {
    filterProps: filterProps
  });

  var newFields = Object.assign((0, _toConsumableArray2["default"])(fields), (0, _defineProperty2["default"])({}, fieldIndex, fieldWithFilterProps));
  return {
    filter: newFilter,
    dataset: _objectSpread({}, dataset, {
      fields: newFields
    })
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

  var newFilter = _objectSpread({}, filter, {}, filterProps, {
    domain: [combinedDomain[0], combinedDomain[combinedDomain.length - 1]]
  });

  switch (filterProps.fieldType) {
    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread({}, newFilter, {
        domain: (0, _dataUtils.unique)(combinedDomain).sort()
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      // @ts-ignore
      var step = filter.step < filterProps.step ? filter.step : filterProps.step;
      return _objectSpread({}, newFilter, {
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
  return _objectSpread({}, feature, {
    id: feature.id,
    properties: _objectSpread({}, feature.properties, {}, properties, {
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
  return _objectSpread({}, filter, {
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
  var selectedDataset = state.datasets[dataId];

  if (!selectedDataset) {
    return state;
  }

  var opt = {
    cpuOnly: true,
    ignoreDomain: true
  };

  if (!datasetFilters.length) {
    // no filter
    var _filtered = _objectSpread({}, selectedDataset, {
      filteredIdxCPU: selectedDataset.allIndexes,
      filterRecordCPU: getFilterRecord(dataId, state.filters, opt)
    });

    return (0, _utils.set)(['datasets', dataId], _filtered, state);
  } // no gpu filter


  if (!datasetFilters.find(function (f) {
    return f.gpu;
  })) {
    var _filtered2 = _objectSpread({}, selectedDataset, {
      filteredIdxCPU: selectedDataset.filteredIndex,
      filterRecordCPU: getFilterRecord(dataId, state.filters, opt)
    });

    return (0, _utils.set)(['datasets', dataId], _filtered2, state);
  } // make a copy for cpu filtering


  var copied = _objectSpread({}, selectedDataset, {
    filterRecord: selectedDataset.filterRecordCPU,
    filteredIndex: selectedDataset.filteredIdxCPU || []
  });

  var filtered = filterDataset(copied, state.filters, state.layers, opt);

  var cpuFilteredDataset = _objectSpread({}, selectedDataset, {
    filteredIdxCPU: filtered.filteredIndex,
    filterRecordCPU: filtered.filterRecord
  });

  return (0, _utils.set)(['datasets', dataId], cpuFilteredDataset, state);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImhpc3RvZ3JhbUJpbnMiLCJlbmxhcmdlZEhpc3RvZ3JhbUJpbnMiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJkdXJhdGlvblllYXIiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiRklMVEVSX1VQREFURVJfUFJPUFMiLCJkYXRhSWQiLCJuYW1lIiwibGF5ZXJJZCIsIkxJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyIsIlN1cHBvcnRlZFBsb3RUeXBlIiwiRklMVEVSX1RZUEVTIiwidGltZVJhbmdlIiwiQUxMX0ZJRUxEX1RZUEVTIiwiaW50ZWdlciIsInJlYWwiLCJyYW5nZSIsIkZJTFRFUl9DT01QT05FTlRTIiwic2VsZWN0IiwibXVsdGlTZWxlY3QiLCJwb2x5Z29uIiwiREVGQVVMVF9GSUxURVJfU1RSVUNUVVJFIiwiZnJlZXplIiwiaWQiLCJmaXhlZERvbWFpbiIsImVubGFyZ2VkIiwiaXNBbmltYXRpbmciLCJzcGVlZCIsInR5cGUiLCJmaWVsZElkeCIsImRvbWFpbiIsInZhbHVlIiwicGxvdFR5cGUiLCJ5QXhpcyIsImludGVydmFsIiwiZ3B1IiwiRklMVEVSX0lEX0xFTkdUSCIsIkxBWUVSX0ZJTFRFUlMiLCJnZXREZWZhdWx0RmlsdGVyIiwic2hvdWxkQXBwbHlGaWx0ZXIiLCJmaWx0ZXIiLCJkYXRhc2V0SWQiLCJkYXRhSWRzIiwiaW5jbHVkZXMiLCJ2YWxpZGF0ZVBvbHlnb25GaWx0ZXIiLCJkYXRhc2V0IiwibGF5ZXJzIiwiZmFpbGVkIiwiaXNWYWxpZEZpbHRlclZhbHVlIiwiaXNWYWxpZERhdGFzZXQiLCJsYXllciIsImZpbmQiLCJsIiwiZmlsdGVyVmFsaWRhdG9ycyIsInZhbGlkYXRlRmlsdGVyIiwiZmlsdGVyRGF0YUlkIiwiZmlsdGVyRGF0YXNldEluZGV4IiwiaW5kZXhPZiIsImluaXRpYWxpemVGaWx0ZXIiLCJmaWVsZE5hbWUiLCJhcHBseUZpbHRlckZpZWxkTmFtZSIsIm1lcmdlRG9tYWluIiwidXBkYXRlZEZpbHRlciIsInVwZGF0ZWREYXRhc2V0IiwiYWRqdXN0VmFsdWVUb0ZpbHRlckRvbWFpbiIsInZhbGlkYXRlRmlsdGVyWUF4aXMiLCJ2YWxpZGF0ZUZpbHRlcldpdGhEYXRhIiwiaGFzT3duUHJvcGVydHkiLCJmaWVsZHMiLCJhbGxEYXRhIiwibWF0Y2hlZEF4aXMiLCJnZXRGaWx0ZXJQbG90IiwiZ2V0RmlsdGVyUHJvcHMiLCJmaWVsZCIsImZpbHRlclByb3BzIiwiZ2V0RmllbGREb21haW4iLCJmaWVsZFR5cGUiLCJ0eXBlT3B0aW9ucyIsInN0cmluZyIsImRhdGUiLCJ0aW1lc3RhbXAiLCJ0YWJsZUZpZWxkSW5kZXgiLCJpc1RpbWUiLCJ2YWx1ZUFjY2Vzc29yIiwibWF5YmVUb0RhdGUiLCJiaW5kIiwiZm9ybWF0IiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiU2NhbGVVdGlscyIsImdldE9yZGluYWxEb21haW4iLCJnZXRUaW1lc3RhbXBGaWVsZERvbWFpbiIsImdldFBvbHlnb25GaWx0ZXJGdW5jdG9yIiwiZ2V0UG9zaXRpb24iLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiTEFZRVJfVFlQRVMiLCJwb2ludCIsImljb24iLCJkYXRhIiwicG9zIiwiZXZlcnkiLCJpc0Zpbml0ZSIsImlzSW5Qb2x5Z29uIiwiYXJjIiwibGluZSIsImdldEZpbHRlckZ1bmN0aW9uIiwiZGVmYXVsdEZ1bmMiLCJkIiwiaXNJblJhbmdlIiwibWFwcGVkVmFsdWUiLCJhY2Nlc3NvciIsIkFycmF5IiwiaXNBcnJheSIsImluZGV4IiwibGVuZ3RoIiwibGF5ZXJGaWx0ZXJGdW5jdGlvbnMiLCJtYXAiLCJjb25maWciLCJmaWx0ZXJGdW5jIiwidXBkYXRlRmlsdGVyRGF0YUlkIiwiZmlsdGVyRGF0YXNldCIsImZpbHRlcnMiLCJvcHQiLCJvbGRGaWx0ZXJSZWNvcmQiLCJmaWx0ZXJSZWNvcmQiLCJnZXRGaWx0ZXJSZWNvcmQiLCJuZXdEYXRhc2V0IiwiZ3B1RmlsdGVyIiwiZmlsdGVyZWRJbmRleCIsImFsbEluZGV4ZXMiLCJmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIiwiY2hhbmdlZEZpbHRlcnMiLCJkaWZmRmlsdGVycyIsInNob3VsZENhbERvbWFpbiIsIkJvb2xlYW4iLCJkeW5hbWljRG9tYWluIiwic2hvdWxkQ2FsSW5kZXgiLCJjcHUiLCJmaWx0ZXJSZXN1bHQiLCJkeW5hbWljRG9tYWluRmlsdGVycyIsImNwdUZpbHRlcnMiLCJmaWx0ZXJGdW5jcyIsInJlZHVjZSIsImFjYyIsImZpZWxkSW5kZXgiLCJmaWx0ZXJEYXRhQnlGaWx0ZXJUeXBlcyIsInJlc3VsdCIsImkiLCJtYXRjaEZvckRvbWFpbiIsInB1c2giLCJtYXRjaEZvclJlbmRlciIsImZvckVhY2giLCJmIiwiaWdub3JlRG9tYWluIiwiY3B1T25seSIsImZpbHRlckNoYW5nZWQiLCJPYmplY3QiLCJlbnRyaWVzIiwicmVjb3JkIiwiaXRlbXMiLCJvbGRGaWx0ZXIiLCJwcm9wIiwiZmlsdGVyZWRWYWx1ZSIsImdldExpbmVhckRvbWFpbiIsImRpZmYiLCJnZXROdW1lcmljU3RlcFNpemUiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJnZXRIaXN0b2dyYW0iLCJlbmxhcmdlZEhpc3RvZ3JhbSIsIk1hdGgiLCJhYnMiLCJ4IiwiZXhwb25lbnRpYWxGb3JtIiwidG9FeHBvbmVudGlhbCIsImV4cG9uZW50IiwicGFyc2VGbG9hdCIsInNwbGl0IiwiRGVjaW1hbCIsInBvdyIsInRvTnVtYmVyIiwiZW50cnkiLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJiaW5zIiwidGhyZXNob2xkcyIsImJpbiIsImNvdW50IiwieDAiLCJ4MSIsInZhbCIsImJvdW5kIiwiZmxvb3IiLCJjZWlsIiwiZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyIiwiZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIiLCJ2IiwiaXNOYU4iLCJpbnB1dCIsImNvb3JkaW5hdGVzIiwic2VyaWVzIiwieSIsInNvcnQiLCJhIiwiYiIsInlEb21haW4iLCJ4RG9tYWluIiwiZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlIiwiZmlsdGVyUGxvdFR5cGVzIiwiYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyIsImRhdGFzZXRJZHMiLCJkYXRhc2V0cyIsImxheWVyc1RvRmlsdGVyIiwiYXBwbGllZEZpbHRlcnMiLCJvcHRpb24iLCJmaW5kSW5kZXgiLCJuZXdGaWx0ZXIiLCJtZXJnZUZpbHRlckRvbWFpblN0ZXAiLCJhc3NpZ24iLCJmaWVsZFdpdGhGaWx0ZXJQcm9wcyIsIm5ld0ZpZWxkcyIsImNvbWJpbmVkRG9tYWluIiwiZmVhdHVyZVRvRmlsdGVyVmFsdWUiLCJmZWF0dXJlIiwiZmlsdGVySWQiLCJwcm9wZXJ0aWVzIiwiZ2V0RmlsdGVySWRJbkZlYXR1cmUiLCJnZW5lcmF0ZVBvbHlnb25GaWx0ZXIiLCJsYWJlbCIsImlzVmlzaWJsZSIsImZpbHRlckRhdGFzZXRDUFUiLCJzdGF0ZSIsImRhdGFzZXRGaWx0ZXJzIiwic2VsZWN0ZWREYXRhc2V0IiwiZmlsdGVyZWQiLCJmaWx0ZXJlZElkeENQVSIsImZpbHRlclJlY29yZENQVSIsImNvcGllZCIsImNwdUZpbHRlcmVkRGF0YXNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTtBQUVPLElBQU1BLGdCQUFnQixHQUFHLENBQzlCO0FBQUNDLEVBQUFBLEdBQUcsRUFBRSxDQUFOO0FBQVNDLEVBQUFBLElBQUksRUFBRTtBQUFmLENBRDhCLEVBRTlC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QUosRUFBMEJpTyxVQUExQixFQUFvQ0gsS0FBcEMsQ0FBUDtBQUNELEdBaEM2QyxDQWtDOUM7OztBQUNBLE1BQU1NLE1BQU0scUJBQ1BKLGVBRE87QUFFVjNHLElBQUFBLFlBQVksRUFBRTJHLGVBQWUsQ0FBQ0csZUFGcEI7QUFHVjFHLElBQUFBLGFBQWEsRUFBRXVHLGVBQWUsQ0FBQ0UsY0FBaEIsSUFBa0M7QUFIdkMsSUFBWjs7QUFNQSxNQUFNRCxRQUFRLEdBQUdoSCxhQUFhLENBQUNtSCxNQUFELEVBQVNOLEtBQUssQ0FBQzVHLE9BQWYsRUFBd0I0RyxLQUFLLENBQUN0TCxNQUE5QixFQUFzQzJFLEdBQXRDLENBQTlCOztBQUVBLE1BQU1rSCxrQkFBa0IscUJBQ25CTCxlQURtQjtBQUV0QkUsSUFBQUEsY0FBYyxFQUFFRCxRQUFRLENBQUN4RyxhQUZIO0FBR3RCMEcsSUFBQUEsZUFBZSxFQUFFRixRQUFRLENBQUM1RztBQUhKLElBQXhCOztBQU1BLFNBQU8sZ0JBQUksQ0FBQyxVQUFELEVBQWFySCxNQUFiLENBQUosRUFBMEJxTyxrQkFBMUIsRUFBOENQLEtBQTlDLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7YXNjZW5kaW5nLCBleHRlbnQsIGhpc3RvZ3JhbSBhcyBkM0hpc3RvZ3JhbSwgdGlja3N9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5pbXBvcnQgYm9vbGVhbldpdGhpbiBmcm9tICdAdHVyZi9ib29sZWFuLXdpdGhpbic7XG5pbXBvcnQge3BvaW50IGFzIHR1cmZQb2ludH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQge0RlY2ltYWx9IGZyb20gJ2RlY2ltYWwuanMnO1xuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIEZJTFRFUl9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHttYXliZVRvRGF0ZSwgbm90TnVsbG9yVW5kZWZpbmVkLCB1bmlxdWUsIHRpbWVUb1VuaXhNaWxsaX0gZnJvbSAnLi9kYXRhLXV0aWxzJztcbmltcG9ydCAqIGFzIFNjYWxlVXRpbHMgZnJvbSAnLi9kYXRhLXNjYWxlLXV0aWxzJztcbmltcG9ydCB7TEFZRVJfVFlQRVN9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkLCBzZXQsIHRvQXJyYXl9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtnZXRHcHVGaWx0ZXJQcm9wcywgZ2V0RGF0YXNldEZpZWxkSW5kZXhGb3JGaWx0ZXJ9IGZyb20gJy4vZ3B1LWZpbHRlci11dGlscyc7XG5cbi8vIFRZUEVcbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMnKS5GaWx0ZXJSZWNvcmR9IEZpbHRlclJlY29yZCAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuRmlsdGVyUmVzdWx0fSBGaWx0ZXJSZXN1bHQgKi9cblxuZXhwb3J0IGNvbnN0IFRpbWVzdGFtcFN0ZXBNYXAgPSBbXG4gIHttYXg6IDEsIHN0ZXA6IDAuMDV9LFxuICB7bWF4OiAxMCwgc3RlcDogMC4xfSxcbiAge21heDogMTAwLCBzdGVwOiAxfSxcbiAge21heDogNTAwLCBzdGVwOiA1fSxcbiAge21heDogMTAwMCwgc3RlcDogMTB9LFxuICB7bWF4OiA1MDAwLCBzdGVwOiA1MH0sXG4gIHttYXg6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgc3RlcDogMTAwMH1cbl07XG5cbmV4cG9ydCBjb25zdCBoaXN0b2dyYW1CaW5zID0gMzA7XG5leHBvcnQgY29uc3QgZW5sYXJnZWRIaXN0b2dyYW1CaW5zID0gMTAwO1xuXG5jb25zdCBkdXJhdGlvblNlY29uZCA9IDEwMDA7XG5jb25zdCBkdXJhdGlvbk1pbnV0ZSA9IGR1cmF0aW9uU2Vjb25kICogNjA7XG5jb25zdCBkdXJhdGlvbkhvdXIgPSBkdXJhdGlvbk1pbnV0ZSAqIDYwO1xuY29uc3QgZHVyYXRpb25EYXkgPSBkdXJhdGlvbkhvdXIgKiAyNDtcbmNvbnN0IGR1cmF0aW9uV2VlayA9IGR1cmF0aW9uRGF5ICogNztcbmNvbnN0IGR1cmF0aW9uWWVhciA9IGR1cmF0aW9uRGF5ICogMzY1O1xuXG5leHBvcnQgY29uc3QgUExPVF9UWVBFUyA9IGtleU1pcnJvcih7XG4gIGhpc3RvZ3JhbTogbnVsbCxcbiAgbGluZUNoYXJ0OiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IEZJTFRFUl9VUERBVEVSX1BST1BTID0ga2V5TWlycm9yKHtcbiAgZGF0YUlkOiBudWxsLFxuICBuYW1lOiBudWxsLFxuICBsYXllcklkOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IExJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyA9IGtleU1pcnJvcih7XG4gIFtGSUxURVJfVVBEQVRFUl9QUk9QUy5uYW1lXTogbnVsbFxufSk7XG4vKipcbiAqIE1heCBudW1iZXIgb2YgZmlsdGVyIHZhbHVlIGJ1ZmZlcnMgdGhhdCBkZWNrLmdsIHByb3ZpZGVzXG4gKi9cblxuY29uc3QgU3VwcG9ydGVkUGxvdFR5cGUgPSB7XG4gIFtGSUxURVJfVFlQRVMudGltZVJhbmdlXToge1xuICAgIGRlZmF1bHQ6ICdoaXN0b2dyYW0nLFxuICAgIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06ICdsaW5lQ2hhcnQnLFxuICAgIFtBTExfRklFTERfVFlQRVMucmVhbF06ICdsaW5lQ2hhcnQnXG4gIH0sXG4gIFtGSUxURVJfVFlQRVMucmFuZ2VdOiB7XG4gICAgZGVmYXVsdDogJ2hpc3RvZ3JhbScsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogJ2xpbmVDaGFydCcsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXTogJ2xpbmVDaGFydCdcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEZJTFRFUl9DT01QT05FTlRTID0ge1xuICBbRklMVEVSX1RZUEVTLnNlbGVjdF06ICdTaW5nbGVTZWxlY3RGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0XTogJ011bHRpU2VsZWN0RmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiAnVGltZVJhbmdlRmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy5yYW5nZV06ICdSYW5nZUZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMucG9seWdvbl06ICdQb2x5Z29uRmlsdGVyJ1xufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfRklMVEVSX1NUUlVDVFVSRSA9IHtcbiAgZGF0YUlkOiBbXSwgLy8gW3N0cmluZ11cbiAgZnJlZXplOiBmYWxzZSxcbiAgaWQ6IG51bGwsXG5cbiAgLy8gdGltZSByYW5nZSBmaWx0ZXIgc3BlY2lmaWNcbiAgZml4ZWREb21haW46IGZhbHNlLFxuICBlbmxhcmdlZDogZmFsc2UsXG4gIGlzQW5pbWF0aW5nOiBmYWxzZSxcbiAgc3BlZWQ6IDEsXG5cbiAgLy8gZmllbGQgc3BlY2lmaWNcbiAgbmFtZTogW10sIC8vIHN0cmluZ1xuICB0eXBlOiBudWxsLFxuICBmaWVsZElkeDogW10sIC8vIFtpbnRlZ2VyXVxuICBkb21haW46IG51bGwsXG4gIHZhbHVlOiBudWxsLFxuXG4gIC8vIHBsb3RcbiAgcGxvdFR5cGU6IFBMT1RfVFlQRVMuaGlzdG9ncmFtLFxuICB5QXhpczogbnVsbCxcbiAgaW50ZXJ2YWw6IG51bGwsXG5cbiAgLy8gbW9kZVxuICBncHU6IGZhbHNlXG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0lEX0xFTkdUSCA9IDQ7XG5cbmV4cG9ydCBjb25zdCBMQVlFUl9GSUxURVJTID0gW0ZJTFRFUl9UWVBFUy5wb2x5Z29uXTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmaWx0ZXIgd2l0aCBhIGRhdGFzZXQgaWQgYXMgZGF0YUlkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXREZWZhdWx0RmlsdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbHRlcihkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5ERUZBVUxUX0ZJTFRFUl9TVFJVQ1RVUkUsXG4gICAgLy8gc3RvcmUgaXQgYXMgZGF0YUlkIGFuZCBpdCBjb3VsZCBiZSBvbmUgb3IgbWFueVxuICAgIGRhdGFJZDogdG9BcnJheShkYXRhSWQpLFxuICAgIGlkOiBnZW5lcmF0ZUhhc2hJZChGSUxURVJfSURfTEVOR1RIKVxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgZmlsdGVyIGlzIHZhbGlkIGJhc2VkIG9uIHRoZSBnaXZlbiBkYXRhSWRcbiAqIEBwYXJhbSAgZmlsdGVyIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0gIGRhdGFzZXRJZCBpZCB0byB2YWxpZGF0ZSBmaWx0ZXIgYWdhaW5zdFxuICogQHJldHVybiB0cnVlIGlmIGEgZmlsdGVyIGlzIHZhbGlkLCBmYWxzZSBvdGhlcndpc2VcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLnNob3VsZEFwcGx5RmlsdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkQXBwbHlGaWx0ZXIoZmlsdGVyLCBkYXRhc2V0SWQpIHtcbiAgY29uc3QgZGF0YUlkcyA9IHRvQXJyYXkoZmlsdGVyLmRhdGFJZCk7XG4gIHJldHVybiBkYXRhSWRzLmluY2x1ZGVzKGRhdGFzZXRJZCkgJiYgZmlsdGVyLnZhbHVlICE9PSBudWxsO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbmQgbW9kaWZpZXMgcG9seWdvbiBmaWx0ZXIgc3RydWN0dXJlXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHBhcmFtIGZpbHRlclxuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybiAtIHtmaWx0ZXIsIGRhdGFzZXR9XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS52YWxpZGF0ZVBvbHlnb25GaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBvbHlnb25GaWx0ZXIoZGF0YXNldCwgZmlsdGVyLCBsYXllcnMpIHtcbiAgY29uc3QgZmFpbGVkID0ge2RhdGFzZXQsIGZpbHRlcjogbnVsbH07XG4gIGNvbnN0IHt2YWx1ZSwgbGF5ZXJJZCwgdHlwZSwgZGF0YUlkfSA9IGZpbHRlcjtcblxuICBpZiAoIWxheWVySWQgfHwgIWlzVmFsaWRGaWx0ZXJWYWx1ZSh0eXBlLCB2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgY29uc3QgaXNWYWxpZERhdGFzZXQgPSBkYXRhSWQuaW5jbHVkZXMoZGF0YXNldC5pZCk7XG5cbiAgaWYgKCFpc1ZhbGlkRGF0YXNldCkge1xuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICBjb25zdCBsYXllciA9IGxheWVycy5maW5kKGwgPT4gbGF5ZXJJZC5pbmNsdWRlcyhsLmlkKSk7XG5cbiAgaWYgKCFsYXllcikge1xuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpbHRlcjoge1xuICAgICAgLi4uZmlsdGVyLFxuICAgICAgZnJlZXplOiB0cnVlLFxuICAgICAgZmllbGRJZHg6IFtdXG4gICAgfSxcbiAgICBkYXRhc2V0XG4gIH07XG59XG5cbi8qKlxuICogQ3VzdG9tIGZpbHRlciB2YWxpZGF0b3JzXG4gKi9cbmNvbnN0IGZpbHRlclZhbGlkYXRvcnMgPSB7XG4gIFtGSUxURVJfVFlQRVMucG9seWdvbl06IHZhbGlkYXRlUG9seWdvbkZpbHRlclxufTtcblxuLyoqXG4gKiBEZWZhdWx0IHZhbGlkYXRlIGZpbHRlciBmdW5jdGlvblxuICogQHBhcmFtIGRhdGFzZXRcbiAqIEBwYXJhbSBmaWx0ZXJcbiAqIEByZXR1cm4gLSB7ZmlsdGVyLCBkYXRhc2V0fVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykudmFsaWRhdGVGaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZpbHRlcihkYXRhc2V0LCBmaWx0ZXIpIHtcbiAgLy8gbWF0Y2ggZmlsdGVyLmRhdGFJZFxuICBjb25zdCBmYWlsZWQgPSB7ZGF0YXNldCwgZmlsdGVyOiBudWxsfTtcbiAgY29uc3QgZmlsdGVyRGF0YUlkID0gdG9BcnJheShmaWx0ZXIuZGF0YUlkKTtcblxuICBjb25zdCBmaWx0ZXJEYXRhc2V0SW5kZXggPSBmaWx0ZXJEYXRhSWQuaW5kZXhPZihkYXRhc2V0LmlkKTtcbiAgaWYgKGZpbHRlckRhdGFzZXRJbmRleCA8IDApIHtcbiAgICAvLyB0aGUgY3VycmVudCBmaWx0ZXIgaXMgbm90IG1hcHBlZCBhZ2FpbnN0IHRoZSBjdXJyZW50IGRhdGFzZXRcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZUZpbHRlciA9IHtcbiAgICAuLi5nZXREZWZhdWx0RmlsdGVyKGZpbHRlci5kYXRhSWQpLFxuICAgIC4uLmZpbHRlcixcbiAgICBkYXRhSWQ6IGZpbHRlckRhdGFJZCxcbiAgICBuYW1lOiB0b0FycmF5KGZpbHRlci5uYW1lKVxuICB9O1xuXG4gIGNvbnN0IGZpZWxkTmFtZSA9IGluaXRpYWxpemVGaWx0ZXIubmFtZVtmaWx0ZXJEYXRhc2V0SW5kZXhdO1xuICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiB1cGRhdGVkRGF0YXNldH0gPSBhcHBseUZpbHRlckZpZWxkTmFtZShcbiAgICBpbml0aWFsaXplRmlsdGVyLFxuICAgIGRhdGFzZXQsXG4gICAgZmllbGROYW1lLFxuICAgIGZpbHRlckRhdGFzZXRJbmRleCxcbiAgICB7bWVyZ2VEb21haW46IHRydWV9XG4gICk7XG5cbiAgaWYgKCF1cGRhdGVkRmlsdGVyKSB7XG4gICAgcmV0dXJuIGZhaWxlZDtcbiAgfVxuXG4gIHVwZGF0ZWRGaWx0ZXIudmFsdWUgPSBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKGZpbHRlci52YWx1ZSwgdXBkYXRlZEZpbHRlcik7XG4gIGlmICh1cGRhdGVkRmlsdGVyLnZhbHVlID09PSBudWxsKSB7XG4gICAgLy8gY2Fubm90IGFkanVzdCBzYXZlZCB2YWx1ZSB0byBmaWx0ZXJcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmaWx0ZXI6IHZhbGlkYXRlRmlsdGVyWUF4aXModXBkYXRlZEZpbHRlciwgdXBkYXRlZERhdGFzZXQpLFxuICAgIGRhdGFzZXQ6IHVwZGF0ZWREYXRhc2V0XG4gIH07XG59XG5cbi8qKlxuICogVmFsaWRhdGUgc2F2ZWQgZmlsdGVyIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogY2FsY3VsYXRlIGRvbWFpbiBhbmQgZmllbGRJZHggYmFzZWQgbmV3IGZpZWxkcyBhbmQgZGF0YVxuICpcbiAqIEBwYXJhbSBkYXRhc2V0XG4gKiBAcGFyYW0gZmlsdGVyIC0gZmlsdGVyIHRvIGJlIHZhbGlkYXRlXG4gKiBAcGFyYW0gbGF5ZXJzIC0gbGF5ZXJzXG4gKiBAcmV0dXJuIHZhbGlkYXRlZCBmaWx0ZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLnZhbGlkYXRlRmlsdGVyV2l0aERhdGF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZpbHRlcldpdGhEYXRhKGRhdGFzZXQsIGZpbHRlciwgbGF5ZXJzKSB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIGZpbHRlclZhbGlkYXRvcnMuaGFzT3duUHJvcGVydHkoZmlsdGVyLnR5cGUpXG4gICAgPyBmaWx0ZXJWYWxpZGF0b3JzW2ZpbHRlci50eXBlXShkYXRhc2V0LCBmaWx0ZXIsIGxheWVycylcbiAgICA6IHZhbGlkYXRlRmlsdGVyKGRhdGFzZXQsIGZpbHRlcik7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgWUF4aXNcbiAqIEBwYXJhbSBmaWx0ZXJcbiAqIEBwYXJhbSBkYXRhc2V0XG4gKiBAcmV0dXJuIHsqfVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUZpbHRlcllBeGlzKGZpbHRlciwgZGF0YXNldCkge1xuICAvLyBUT0RPOiB2YWxpZGF0ZSB5QXhpcyBhZ2FpbnN0IG90aGVyIGRhdGFzZXRzXG5cbiAgY29uc3Qge2ZpZWxkcywgYWxsRGF0YX0gPSBkYXRhc2V0O1xuICBjb25zdCB7eUF4aXN9ID0gZmlsdGVyO1xuICAvLyBUT0RPOiB2YWxpZGF0ZSB5QXhpcyBhZ2FpbnN0IG90aGVyIGRhdGFzZXRzXG4gIGlmICh5QXhpcykge1xuICAgIGNvbnN0IG1hdGNoZWRBeGlzID0gZmllbGRzLmZpbmQoKHtuYW1lLCB0eXBlfSkgPT4gbmFtZSA9PT0geUF4aXMubmFtZSAmJiB0eXBlID09PSB5QXhpcy50eXBlKTtcblxuICAgIGZpbHRlciA9IG1hdGNoZWRBeGlzXG4gICAgICA/IHtcbiAgICAgICAgICAuLi5maWx0ZXIsXG4gICAgICAgICAgeUF4aXM6IG1hdGNoZWRBeGlzLFxuICAgICAgICAgIC4uLmdldEZpbHRlclBsb3Qoey4uLmZpbHRlciwgeUF4aXM6IG1hdGNoZWRBeGlzfSwgYWxsRGF0YSlcbiAgICAgICAgfVxuICAgICAgOiBmaWx0ZXI7XG4gIH1cblxuICByZXR1cm4gZmlsdGVyO1xufVxuXG4vKipcbiAqIEdldCBkZWZhdWx0IGZpbHRlciBwcm9wIGJhc2VkIG9uIGZpZWxkIHR5cGVcbiAqXG4gKiBAcGFyYW0gYWxsRGF0YVxuICogQHBhcmFtIGZpZWxkXG4gKiBAcmV0dXJucyBkZWZhdWx0IGZpbHRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmlsdGVyUHJvcHN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJQcm9wcyhhbGxEYXRhLCBmaWVsZCkge1xuICBjb25zdCBmaWx0ZXJQcm9wcyA9IHtcbiAgICAuLi5nZXRGaWVsZERvbWFpbihhbGxEYXRhLCBmaWVsZCksXG4gICAgZmllbGRUeXBlOiBmaWVsZC50eXBlXG4gIH07XG5cbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyUHJvcHMsXG4gICAgICAgIHZhbHVlOiBmaWx0ZXJQcm9wcy5kb21haW4sXG4gICAgICAgIHR5cGU6IEZJTFRFUl9UWVBFUy5yYW5nZSxcbiAgICAgICAgdHlwZU9wdGlvbnM6IFtGSUxURVJfVFlQRVMucmFuZ2VdLFxuICAgICAgICBncHU6IHRydWVcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyUHJvcHMsXG4gICAgICAgIHR5cGU6IEZJTFRFUl9UWVBFUy5zZWxlY3QsXG4gICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICBncHU6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuc3RyaW5nOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmRhdGU6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0LFxuICAgICAgICB2YWx1ZTogW10sXG4gICAgICAgIGdwdTogZmFsc2VcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLnRpbWVSYW5nZSxcbiAgICAgICAgZW5sYXJnZWQ6IHRydWUsXG4gICAgICAgIGZpeGVkRG9tYWluOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZmlsdGVyUHJvcHMuZG9tYWluLFxuICAgICAgICBncHU6IHRydWVcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIGZpZWxkIGRvbWFpbiBiYXNlZCBvbiBmaWVsZCB0eXBlIGFuZCBkYXRhXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmllbGREb21haW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZERvbWFpbihhbGxEYXRhLCBmaWVsZCkge1xuICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gIGNvbnN0IGlzVGltZSA9IGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBtYXliZVRvRGF0ZS5iaW5kKG51bGwsIGlzVGltZSwgZmllbGRJZHgsIGZpZWxkLmZvcm1hdCk7XG4gIGxldCBkb21haW47XG5cbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgICAgLy8gY2FsY3VsYXRlIGRvbWFpbiBhbmQgc3RlcFxuICAgICAgcmV0dXJuIGdldE51bWVyaWNGaWVsZERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgICByZXR1cm4ge2RvbWFpbjogW3RydWUsIGZhbHNlXX07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcbiAgICAgIHJldHVybiB7ZG9tYWlufTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJldHVybiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge2RvbWFpbjogU2NhbGVVdGlscy5nZXRPcmRpbmFsRG9tYWluKGFsbERhdGEsIHZhbHVlQWNjZXNzb3IpfTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UG9seWdvbkZpbHRlckZ1bmN0b3IgPSAobGF5ZXIsIGZpbHRlcikgPT4ge1xuICBjb25zdCBnZXRQb3NpdGlvbiA9IGxheWVyLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcblxuICBzd2l0Y2ggKGxheWVyLnR5cGUpIHtcbiAgICBjYXNlIExBWUVSX1RZUEVTLnBvaW50OlxuICAgIGNhc2UgTEFZRVJfVFlQRVMuaWNvbjpcbiAgICAgIHJldHVybiBkYXRhID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGF9KTtcbiAgICAgICAgcmV0dXJuIHBvcy5ldmVyeShOdW1iZXIuaXNGaW5pdGUpICYmIGlzSW5Qb2x5Z29uKHBvcywgZmlsdGVyLnZhbHVlKTtcbiAgICAgIH07XG4gICAgY2FzZSBMQVlFUl9UWVBFUy5hcmM6XG4gICAgY2FzZSBMQVlFUl9UWVBFUy5saW5lOlxuICAgICAgcmV0dXJuIGRhdGEgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YX0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHBvcy5ldmVyeShOdW1iZXIuaXNGaW5pdGUpICYmXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW3Bvc1swXSwgcG9zWzFdXSxcbiAgICAgICAgICAgIFtwb3NbM10sIHBvc1s0XV1cbiAgICAgICAgICBdLmV2ZXJ5KHBvaW50ID0+IGlzSW5Qb2x5Z29uKHBvaW50LCBmaWx0ZXIudmFsdWUpKVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICgpID0+IHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkIGRhdGFzZXQgRmllbGRcbiAqIEBwYXJhbSBkYXRhSWQgRGF0YXNldCBpZFxuICogQHBhcmFtIGZpbHRlciBGaWx0ZXIgb2JqZWN0XG4gKiBAcGFyYW0gbGF5ZXJzIGxpc3Qgb2YgbGF5ZXJzIHRvIGZpbHRlciB1cG9uXG4gKiBAcmV0dXJuIGZpbHRlckZ1bmN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRGaWx0ZXJGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlckZ1bmN0aW9uKGZpZWxkLCBkYXRhSWQsIGZpbHRlciwgbGF5ZXJzKSB7XG4gIC8vIGZpZWxkIGNvdWxkIGJlIG51bGwgaW4gcG9seWdvbiBmaWx0ZXJcbiAgY29uc3QgdmFsdWVBY2Nlc3NvciA9IGRhdGEgPT4gKGZpZWxkID8gZGF0YVtmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXSA6IG51bGwpO1xuICBjb25zdCBkZWZhdWx0RnVuYyA9IGQgPT4gdHJ1ZTtcblxuICBzd2l0Y2ggKGZpbHRlci50eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMucmFuZ2U6XG4gICAgICByZXR1cm4gZGF0YSA9PiBpc0luUmFuZ2UodmFsdWVBY2Nlc3NvcihkYXRhKSwgZmlsdGVyLnZhbHVlKTtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIHJldHVybiBkYXRhID0+IGZpbHRlci52YWx1ZS5pbmNsdWRlcyh2YWx1ZUFjY2Vzc29yKGRhdGEpKTtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZGF0YSA9PiB2YWx1ZUFjY2Vzc29yKGRhdGEpID09PSBmaWx0ZXIudmFsdWU7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMudGltZVJhbmdlOlxuICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdEZ1bmM7XG4gICAgICB9XG4gICAgICBjb25zdCBtYXBwZWRWYWx1ZSA9IGdldChmaWVsZCwgWydmaWx0ZXJQcm9wcycsICdtYXBwZWRWYWx1ZSddKTtcbiAgICAgIGNvbnN0IGFjY2Vzc29yID0gQXJyYXkuaXNBcnJheShtYXBwZWRWYWx1ZSlcbiAgICAgICAgPyAoZGF0YSwgaW5kZXgpID0+IG1hcHBlZFZhbHVlW2luZGV4XVxuICAgICAgICA6IGRhdGEgPT4gdGltZVRvVW5peE1pbGxpKHZhbHVlQWNjZXNzb3IoZGF0YSksIGZpZWxkLmZvcm1hdCk7XG4gICAgICByZXR1cm4gKGRhdGEsIGluZGV4KSA9PiBpc0luUmFuZ2UoYWNjZXNzb3IoZGF0YSwgaW5kZXgpLCBmaWx0ZXIudmFsdWUpO1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnBvbHlnb246XG4gICAgICBpZiAoIWxheWVycyB8fCAhbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdEZ1bmM7XG4gICAgICB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBsYXllckZpbHRlckZ1bmN0aW9ucyA9IGZpbHRlci5sYXllcklkXG4gICAgICAgIC5tYXAoaWQgPT4gbGF5ZXJzLmZpbmQobCA9PiBsLmlkID09PSBpZCkpXG4gICAgICAgIC5maWx0ZXIobCA9PiBsICYmIGwuY29uZmlnLmRhdGFJZCA9PT0gZGF0YUlkKVxuICAgICAgICAubWFwKGxheWVyID0+IGdldFBvbHlnb25GaWx0ZXJGdW5jdG9yKGxheWVyLCBmaWx0ZXIpKTtcblxuICAgICAgcmV0dXJuIGRhdGEgPT4gbGF5ZXJGaWx0ZXJGdW5jdGlvbnMuZXZlcnkoZmlsdGVyRnVuYyA9PiBmaWx0ZXJGdW5jKGRhdGEpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGRlZmF1bHRGdW5jO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWx0ZXJEYXRhSWQoZGF0YUlkKSB7XG4gIHJldHVybiBnZXREZWZhdWx0RmlsdGVyKGRhdGFJZCk7XG59XG5cbi8qKlxuICogRmlsdGVyIGRhdGEgYmFzZWQgb24gYW4gYXJyYXkgb2YgZmlsdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZmlsdGVyRGF0YXNldH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGFzZXQoZGF0YXNldCwgZmlsdGVycywgbGF5ZXJzLCBvcHQpIHtcbiAgY29uc3Qge2FsbERhdGEsIGlkOiBkYXRhSWQsIGZpbHRlclJlY29yZDogb2xkRmlsdGVyUmVjb3JkLCBmaWVsZHN9ID0gZGF0YXNldDtcblxuICAvLyBpZiB0aGVyZSBpcyBubyBmaWx0ZXJzXG4gIGNvbnN0IGZpbHRlclJlY29yZCA9IGdldEZpbHRlclJlY29yZChkYXRhSWQsIGZpbHRlcnMsIG9wdCB8fCB7fSk7XG5cbiAgY29uc3QgbmV3RGF0YXNldCA9IHNldChbJ2ZpbHRlclJlY29yZCddLCBmaWx0ZXJSZWNvcmQsIGRhdGFzZXQpO1xuXG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ubmV3RGF0YXNldCxcbiAgICAgIGdwdUZpbHRlcjogZ2V0R3B1RmlsdGVyUHJvcHMoZmlsdGVycywgZGF0YUlkLCBmaWVsZHMpLFxuICAgICAgZmlsdGVyZWRJbmRleDogZGF0YXNldC5hbGxJbmRleGVzLFxuICAgICAgZmlsdGVyZWRJbmRleEZvckRvbWFpbjogZGF0YXNldC5hbGxJbmRleGVzXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZWRGaWx0ZXJzID0gZGlmZkZpbHRlcnMoZmlsdGVyUmVjb3JkLCBvbGRGaWx0ZXJSZWNvcmQpO1xuXG4gIC8vIGdlbmVyYXRlIDIgc2V0cyBvZiBmaWx0ZXIgcmVzdWx0XG4gIC8vIGZpbHRlcmVkSW5kZXggdXNlZCB0byBjYWxjdWxhdGUgbGF5ZXIgZGF0YVxuICAvLyBmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIHVzZWQgdG8gY2FsY3VsYXRlIGxheWVyIERvbWFpblxuICBjb25zdCBzaG91bGRDYWxEb21haW4gPSBCb29sZWFuKGNoYW5nZWRGaWx0ZXJzLmR5bmFtaWNEb21haW4pO1xuICBjb25zdCBzaG91bGRDYWxJbmRleCA9IEJvb2xlYW4oY2hhbmdlZEZpbHRlcnMuY3B1KTtcblxuICBsZXQgZmlsdGVyUmVzdWx0ID0ge307XG4gIGlmIChzaG91bGRDYWxEb21haW4gfHwgc2hvdWxkQ2FsSW5kZXgpIHtcbiAgICBjb25zdCBkeW5hbWljRG9tYWluRmlsdGVycyA9IHNob3VsZENhbERvbWFpbiA/IGZpbHRlclJlY29yZC5keW5hbWljRG9tYWluIDogbnVsbDtcbiAgICBjb25zdCBjcHVGaWx0ZXJzID0gc2hvdWxkQ2FsSW5kZXggPyBmaWx0ZXJSZWNvcmQuY3B1IDogbnVsbDtcblxuICAgIGNvbnN0IGZpbHRlckZ1bmNzID0gZmlsdGVycy5yZWR1Y2UoKGFjYywgZmlsdGVyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZEluZGV4ID0gZ2V0RGF0YXNldEZpZWxkSW5kZXhGb3JGaWx0ZXIoZGF0YXNldC5pZCwgZmlsdGVyKTtcbiAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRJbmRleCAhPT0gLTEgPyBmaWVsZHNbZmllbGRJbmRleF0gOiBudWxsO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5hY2MsXG4gICAgICAgIFtmaWx0ZXIuaWRdOiBnZXRGaWx0ZXJGdW5jdGlvbihmaWVsZCwgZGF0YXNldC5pZCwgZmlsdGVyLCBsYXllcnMpXG4gICAgICB9O1xuICAgIH0sIHt9KTtcblxuICAgIGZpbHRlclJlc3VsdCA9IGZpbHRlckRhdGFCeUZpbHRlclR5cGVzKFxuICAgICAge2R5bmFtaWNEb21haW5GaWx0ZXJzLCBjcHVGaWx0ZXJzLCBmaWx0ZXJGdW5jc30sXG4gICAgICBhbGxEYXRhXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ubmV3RGF0YXNldCxcbiAgICAuLi5maWx0ZXJSZXN1bHQsXG4gICAgZ3B1RmlsdGVyOiBnZXRHcHVGaWx0ZXJQcm9wcyhmaWx0ZXJzLCBkYXRhSWQsIGZpZWxkcylcbiAgfTtcbn1cblxuLyoqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5maWx0ZXJEYXRhQnlGaWx0ZXJUeXBlc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGFCeUZpbHRlclR5cGVzKHtkeW5hbWljRG9tYWluRmlsdGVycywgY3B1RmlsdGVycywgZmlsdGVyRnVuY3N9LCBhbGxEYXRhKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAuLi4oZHluYW1pY0RvbWFpbkZpbHRlcnMgPyB7ZmlsdGVyZWRJbmRleEZvckRvbWFpbjogW119IDoge30pLFxuICAgIC4uLihjcHVGaWx0ZXJzID8ge2ZpbHRlcmVkSW5kZXg6IFtdfSA6IHt9KVxuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGQgPSBhbGxEYXRhW2ldO1xuXG4gICAgY29uc3QgbWF0Y2hGb3JEb21haW4gPVxuICAgICAgZHluYW1pY0RvbWFpbkZpbHRlcnMgJiYgZHluYW1pY0RvbWFpbkZpbHRlcnMuZXZlcnkoZmlsdGVyID0+IGZpbHRlckZ1bmNzW2ZpbHRlci5pZF0oZCwgaSkpO1xuXG4gICAgaWYgKG1hdGNoRm9yRG9tYWluKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXN1bHQuZmlsdGVyZWRJbmRleEZvckRvbWFpbi5wdXNoKGkpO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoRm9yUmVuZGVyID0gY3B1RmlsdGVycyAmJiBjcHVGaWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXJGdW5jc1tmaWx0ZXIuaWRdKGQsIGkpKTtcblxuICAgIGlmIChtYXRjaEZvclJlbmRlcikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmVzdWx0LmZpbHRlcmVkSW5kZXgucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldCBhIHJlY29yZCBvZiBmaWx0ZXJzIGJhc2VkIG9uIGRvbWFpbiB0eXBlIGFuZCBncHUgLyBjcHVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEZpbHRlclJlY29yZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclJlY29yZChkYXRhSWQsIGZpbHRlcnMsIG9wdCA9IHt9KSB7XG4gIC8qKlxuICAgKiBAdHlwZSB7RmlsdGVyUmVjb3JkfVxuICAgKi9cbiAgY29uc3QgZmlsdGVyUmVjb3JkID0ge1xuICAgIGR5bmFtaWNEb21haW46IFtdLFxuICAgIGZpeGVkRG9tYWluOiBbXSxcbiAgICBjcHU6IFtdLFxuICAgIGdwdTogW11cbiAgfTtcblxuICBmaWx0ZXJzLmZvckVhY2goZiA9PiB7XG4gICAgaWYgKGlzVmFsaWRGaWx0ZXJWYWx1ZShmLnR5cGUsIGYudmFsdWUpICYmIHRvQXJyYXkoZi5kYXRhSWQpLmluY2x1ZGVzKGRhdGFJZCkpIHtcbiAgICAgIChmLmZpeGVkRG9tYWluIHx8IG9wdC5pZ25vcmVEb21haW5cbiAgICAgICAgPyBmaWx0ZXJSZWNvcmQuZml4ZWREb21haW5cbiAgICAgICAgOiBmaWx0ZXJSZWNvcmQuZHluYW1pY0RvbWFpblxuICAgICAgKS5wdXNoKGYpO1xuXG4gICAgICAoZi5ncHUgJiYgIW9wdC5jcHVPbmx5ID8gZmlsdGVyUmVjb3JkLmdwdSA6IGZpbHRlclJlY29yZC5jcHUpLnB1c2goZik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZmlsdGVyUmVjb3JkO1xufVxuXG4vKipcbiAqIENvbXBhcmUgZmlsdGVyIHJlY29yZHMgdG8gZ2V0IHdoYXQgaGFzIGNoYW5nZWRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmRpZmZGaWx0ZXJzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZkZpbHRlcnMoZmlsdGVyUmVjb3JkLCBvbGRGaWx0ZXJSZWNvcmQgPSB7fSkge1xuICBsZXQgZmlsdGVyQ2hhbmdlZCA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKGZpbHRlclJlY29yZCkuZm9yRWFjaCgoW3JlY29yZCwgaXRlbXNdKSA9PiB7XG4gICAgaXRlbXMuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgY29uc3Qgb2xkRmlsdGVyID0gKG9sZEZpbHRlclJlY29yZFtyZWNvcmRdIHx8IFtdKS5maW5kKGYgPT4gZi5pZCA9PT0gZmlsdGVyLmlkKTtcblxuICAgICAgaWYgKCFvbGRGaWx0ZXIpIHtcbiAgICAgICAgLy8gYWRkZWRcbiAgICAgICAgZmlsdGVyQ2hhbmdlZCA9IHNldChbcmVjb3JkLCBmaWx0ZXIuaWRdLCAnYWRkZWQnLCBmaWx0ZXJDaGFuZ2VkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNoZWNrICB3aGF0IGhhcyBjaGFuZ2VkXG4gICAgICAgIFsnbmFtZScsICd2YWx1ZScsICdkYXRhSWQnXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgIGlmIChmaWx0ZXJbcHJvcF0gIT09IG9sZEZpbHRlcltwcm9wXSkge1xuICAgICAgICAgICAgZmlsdGVyQ2hhbmdlZCA9IHNldChbcmVjb3JkLCBmaWx0ZXIuaWRdLCBgJHtwcm9wfV9jaGFuZ2VkYCwgZmlsdGVyQ2hhbmdlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIChvbGRGaWx0ZXJSZWNvcmRbcmVjb3JkXSB8fCBbXSkuZm9yRWFjaChvbGRGaWx0ZXIgPT4ge1xuICAgICAgLy8gZGVsZXRlZFxuICAgICAgaWYgKCFpdGVtcy5maW5kKGYgPT4gZi5pZCA9PT0gb2xkRmlsdGVyLmlkKSkge1xuICAgICAgICBmaWx0ZXJDaGFuZ2VkID0gc2V0KFtyZWNvcmQsIG9sZEZpbHRlci5pZF0sICdkZWxldGVkJywgZmlsdGVyQ2hhbmdlZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWZpbHRlckNoYW5nZWRbcmVjb3JkXSkge1xuICAgICAgZmlsdGVyQ2hhbmdlZFtyZWNvcmRdID0gbnVsbDtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIGZpbHRlckNoYW5nZWQ7XG59XG4vKipcbiAqIENhbGwgYnkgcGFyc2luZyBmaWx0ZXJzIGZyb20gVVJMXG4gKiBDaGVjayBpZiB2YWx1ZSBvZiBmaWx0ZXIgd2l0aGluIGZpbHRlciBkb21haW4sIGlmIG5vdCBhZGp1c3QgaXQgdG8gbWF0Y2hcbiAqIGZpbHRlciBkb21haW5cbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5hZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWlufVxuICogQHJldHVybnMgdmFsdWUgLSBhZGp1c3RlZCB2YWx1ZSB0byBtYXRjaCBmaWx0ZXIgb3IgbnVsbCB0byByZW1vdmUgZmlsdGVyXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKHZhbHVlLCB7ZG9tYWluLCB0eXBlfSkge1xuICBpZiAoIWRvbWFpbiB8fCAhdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ubWFwKGQgPT4gZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZS5tYXAoKGQsIGkpID0+IChub3ROdWxsb3JVbmRlZmluZWQoZCkgJiYgaXNJblJhbmdlKGQsIGRvbWFpbikgPyBkIDogZG9tYWluW2ldKSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyZWRWYWx1ZSA9IHZhbHVlLmZpbHRlcihkID0+IGRvbWFpbi5pbmNsdWRlcyhkKSk7XG4gICAgICByZXR1cm4gZmlsdGVyZWRWYWx1ZS5sZW5ndGggPyBmaWx0ZXJlZFZhbHVlIDogW107XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZG9tYWluLmluY2x1ZGVzKHZhbHVlKSA/IHZhbHVlIDogdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogQ2FsY3VsYXRlIG51bWVyaWMgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0TnVtZXJpY0ZpZWxkRG9tYWlufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtZXJpY0ZpZWxkRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpIHtcbiAgbGV0IGRvbWFpbiA9IFswLCAxXTtcbiAgbGV0IHN0ZXAgPSAwLjE7XG5cbiAgY29uc3QgbWFwcGVkVmFsdWUgPSBBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5tYXAodmFsdWVBY2Nlc3NvcikgOiBbXTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICBkb21haW4gPSBTY2FsZVV0aWxzLmdldExpbmVhckRvbWFpbihtYXBwZWRWYWx1ZSk7XG4gICAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICAgIC8vIGluIGNhc2UgZXF1YWwgZG9tYWluLCBbOTYsIDk2XSwgd2hpY2ggd2lsbCBicmVhayBxdWFudGl6ZSBzY2FsZVxuICAgIGlmICghZGlmZikge1xuICAgICAgZG9tYWluWzFdID0gZG9tYWluWzBdICsgMTtcbiAgICB9XG5cbiAgICBzdGVwID0gZ2V0TnVtZXJpY1N0ZXBTaXplKGRpZmYpIHx8IHN0ZXA7XG4gICAgZG9tYWluWzBdID0gZm9ybWF0TnVtYmVyQnlTdGVwKGRvbWFpblswXSwgc3RlcCwgJ2Zsb29yJyk7XG4gICAgZG9tYWluWzFdID0gZm9ybWF0TnVtYmVyQnlTdGVwKGRvbWFpblsxXSwgc3RlcCwgJ2NlaWwnKTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgc3RlcCBzaXplIGZvciByYW5nZSBhbmQgdGltZXJhbmdlIGZpbHRlclxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldE51bWVyaWNTdGVwU2l6ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNTdGVwU2l6ZShkaWZmKSB7XG4gIGRpZmYgPSBNYXRoLmFicyhkaWZmKTtcblxuICBpZiAoZGlmZiA+IDEwMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPiAzKSB7XG4gICAgcmV0dXJuIDAuMDE7XG4gIH0gZWxzZSBpZiAoZGlmZiA+IDEpIHtcbiAgICByZXR1cm4gMC4wMDE7XG4gIH1cbiAgLy8gVHJ5IHRvIGdldCBhdCBsZWFzdCAxMDAwIHN0ZXBzIC0gYW5kIGtlZXAgdGhlIHN0ZXAgc2l6ZSBiZWxvdyB0aGF0IG9mXG4gIC8vIHRoZSAoZGlmZiA+IDEpIGNhc2UuXG4gIGNvbnN0IHggPSBkaWZmIC8gMTAwMDtcbiAgLy8gRmluZCB0aGUgZXhwb25lbnQgYW5kIHRydW5jYXRlIHRvIDEwIHRvIHRoZSBwb3dlciBvZiB0aGF0IGV4cG9uZW50XG5cbiAgY29uc3QgZXhwb25lbnRpYWxGb3JtID0geC50b0V4cG9uZW50aWFsKCk7XG4gIGNvbnN0IGV4cG9uZW50ID0gcGFyc2VGbG9hdChleHBvbmVudGlhbEZvcm0uc3BsaXQoJ2UnKVsxXSk7XG5cbiAgLy8gR2V0dGluZyByZWFkeSBmb3Igbm9kZSAxMlxuICAvLyB0aGlzIGlzIHdoeSB3ZSBuZWVkIGRlY2ltYWwuanNcbiAgLy8gTWF0aC5wb3coMTAsIC01KSA9IDAuMDAwMDA5OTk5OTk5OTk5OTk5OTk5XG4gIC8vIHRoZSBhYm92ZSByZXN1bHQgc2hvd3MgaW4gYnJvd3NlciBhbmQgbm9kZSAxMFxuICAvLyBub2RlIDEyIGJlaGF2ZXMgY29ycmVjdGx5XG4gIHJldHVybiBuZXcgRGVjaW1hbCgxMCkucG93KGV4cG9uZW50KS50b051bWJlcigpO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aW1lc3RhbXAgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0VGltZXN0YW1wRmllbGREb21haW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIC8vIHRvIGF2b2lkIGNvbnZlcnRpbmcgc3RyaW5nIGZvcm1hdCB0aW1lIHRvIGVwb2NoXG4gIC8vIGV2ZXJ5IHRpbWUgd2UgY29tcGFyZSB3ZSBzdG9yZSBhIHZhbHVlIG1hcHBlZCB0byBpbnQgaW4gZmlsdGVyIGRvbWFpblxuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG4gIGNvbnN0IGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgbGV0IHN0ZXAgPSAwLjAxO1xuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIGNvbnN0IGVudHJ5ID0gVGltZXN0YW1wU3RlcE1hcC5maW5kKGYgPT4gZi5tYXggPj0gZGlmZik7XG4gIGlmIChlbnRyeSkge1xuICAgIHN0ZXAgPSBlbnRyeS5zdGVwO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBtYXBwZWRWYWx1ZSwgaGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmhpc3RvZ3JhbUNvbnN0cnVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCBiaW5zKSB7XG4gIHJldHVybiBkM0hpc3RvZ3JhbSgpXG4gICAgLnRocmVzaG9sZHModGlja3MoZG9tYWluWzBdLCBkb21haW5bMV0sIGJpbnMpKVxuICAgIC5kb21haW4oZG9tYWluKShtYXBwZWRWYWx1ZSlcbiAgICAubWFwKGJpbiA9PiAoe1xuICAgICAgY291bnQ6IGJpbi5sZW5ndGgsXG4gICAgICB4MDogYmluLngwLFxuICAgICAgeDE6IGJpbi54MVxuICAgIH0pKTtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIGhpc3RvZ3JhbSBmcm9tIGRvbWFpbiBhbmQgYXJyYXkgb2YgdmFsdWVzXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0SGlzdG9ncmFtfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpIHtcbiAgY29uc3QgaGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGhpc3RvZ3JhbUJpbnMpO1xuICBjb25zdCBlbmxhcmdlZEhpc3RvZ3JhbSA9IGhpc3RvZ3JhbUNvbnN0cnVjdChkb21haW4sIG1hcHBlZFZhbHVlLCBlbmxhcmdlZEhpc3RvZ3JhbUJpbnMpO1xuXG4gIHJldHVybiB7aGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbi8qKlxuICogcm91bmQgbnVtYmVyIGJhc2VkIG9uIHN0ZXBcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdmFsXG4gKiBAcGFyYW0ge051bWJlcn0gc3RlcFxuICogQHBhcmFtIHtzdHJpbmd9IGJvdW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSByb3VuZGVkIG51bWJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TnVtYmVyQnlTdGVwKHZhbCwgc3RlcCwgYm91bmQpIHtcbiAgaWYgKGJvdW5kID09PSAnZmxvb3InKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsICogKDEgLyBzdGVwKSkgLyAoMSAvIHN0ZXApO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguY2VpbCh2YWwgKiAoMSAvIHN0ZXApKSAvICgxIC8gc3RlcCk7XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmlzSW5SYW5nZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5SYW5nZSh2YWwsIGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB2YWwgPj0gZG9tYWluWzBdICYmIHZhbCA8PSBkb21haW5bMV07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgcG9pbnQgaXMgd2l0aGluIHRoZSBwcm92aWRlZCBwb2x5Z29uXG4gKlxuICogQHBhcmFtIHBvaW50IGFzIGlucHV0IHNlYXJjaCBbbGF0LCBsbmddXG4gKiBAcGFyYW0gcG9seWdvbiBQb2ludHMgbXVzdCBiZSB3aXRoaW4gdGhlc2UgKE11bHRpKVBvbHlnb24ocylcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0luUG9seWdvbihwb2ludCwgcG9seWdvbikge1xuICByZXR1cm4gYm9vbGVhbldpdGhpbih0dXJmUG9pbnQocG9pbnQpLCBwb2x5Z29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRvbWFpbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIHJldHVybiBkaWZmID4gZHVyYXRpb25ZZWFyXG4gICAgPyAnTU0vREQvWVknXG4gICAgOiBkaWZmID4gZHVyYXRpb25EYXlcbiAgICA/ICdNTS9ERC9ZWSBoaDptbWEnXG4gICAgOiAnTU0vREQvWVkgaGg6bW06c3NhJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZG9tYWluKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcbiAgcmV0dXJuIGRpZmYgPiBkdXJhdGlvblllYXJcbiAgICA/ICdNTS9ERC9ZWSdcbiAgICA6IGRpZmYgPiBkdXJhdGlvbldlZWtcbiAgICA/ICdNTS9ERCdcbiAgICA6IGRpZmYgPiBkdXJhdGlvbkRheVxuICAgID8gJ01NL0REIGhoYSdcbiAgICA6IGRpZmYgPiBkdXJhdGlvbkhvdXJcbiAgICA/ICdoaDptbWEnXG4gICAgOiAnaGg6bW06c3NhJztcbn1cblxuLyoqXG4gKiBTYW5pdHkgY2hlY2sgb24gZmlsdGVycyB0byBwcmVwYXJlIGZvciBzYXZlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5pc1ZhbGlkRmlsdGVyVmFsdWV9XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVmFsdWUodHlwZSwgdmFsdWUpIHtcbiAgaWYgKCF0eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5yYW5nZTpcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy50aW1lUmFuZ2U6XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUuZXZlcnkodiA9PiB2ICE9PSBudWxsICYmICFpc05hTih2KSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBCb29sZWFuKHZhbHVlLmxlbmd0aCk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5pbnB1dDpcbiAgICAgIHJldHVybiBCb29sZWFuKHZhbHVlLmxlbmd0aCk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5wb2x5Z29uOlxuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXQodmFsdWUsIFsnZ2VvbWV0cnknLCAnY29vcmRpbmF0ZXMnXSk7XG4gICAgICByZXR1cm4gQm9vbGVhbih2YWx1ZSAmJiB2YWx1ZS5pZCAmJiBjb29yZGluYXRlcyk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmlsdGVyUGxvdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclBsb3QoZmlsdGVyLCBhbGxEYXRhKSB7XG4gIGlmIChmaWx0ZXIucGxvdFR5cGUgPT09IFBMT1RfVFlQRVMuaGlzdG9ncmFtIHx8ICFmaWx0ZXIueUF4aXMpIHtcbiAgICAvLyBoaXN0b2dyYW0gc2hvdWxkIGJlIGNhbGN1bGF0ZWQgd2hlbiBjcmVhdGUgZmlsdGVyXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3Qge21hcHBlZFZhbHVlID0gW119ID0gZmlsdGVyO1xuICBjb25zdCB7eUF4aXN9ID0gZmlsdGVyO1xuXG4gIC8vIHJldHVybiBsaW5lQ2hhcnRcbiAgY29uc3Qgc2VyaWVzID0gYWxsRGF0YVxuICAgIC5tYXAoKGQsIGkpID0+ICh7XG4gICAgICB4OiBtYXBwZWRWYWx1ZVtpXSxcbiAgICAgIHk6IGRbeUF4aXMudGFibGVGaWVsZEluZGV4IC0gMV1cbiAgICB9KSlcbiAgICAuZmlsdGVyKCh7eCwgeX0pID0+IE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGFzY2VuZGluZyhhLngsIGIueCkpO1xuXG4gIGNvbnN0IHlEb21haW4gPSBleHRlbnQoc2VyaWVzLCBkID0+IGQueSk7XG4gIGNvbnN0IHhEb21haW4gPSBbc2VyaWVzWzBdLngsIHNlcmllc1tzZXJpZXMubGVuZ3RoIC0gMV0ueF07XG5cbiAgcmV0dXJuIHtsaW5lQ2hhcnQ6IHtzZXJpZXMsIHlEb21haW4sIHhEb21haW59LCB5QXhpc307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUoZmlsdGVyKSB7XG4gIGNvbnN0IGZpbHRlclBsb3RUeXBlcyA9IFN1cHBvcnRlZFBsb3RUeXBlW2ZpbHRlci50eXBlXTtcbiAgaWYgKCFmaWx0ZXJQbG90VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyLnlBeGlzKSB7XG4gICAgcmV0dXJuIGZpbHRlclBsb3RUeXBlcy5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlclBsb3RUeXBlc1tmaWx0ZXIueUF4aXMudHlwZV0gfHwgbnVsbDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFzZXRJZHMgbGlzdCBvZiBkYXRhc2V0IGlkcyB0byBiZSBmaWx0ZXJlZFxuICogQHBhcmFtIGRhdGFzZXRzIGFsbCBkYXRhc2V0c1xuICogQHBhcmFtIGZpbHRlcnMgYWxsIGZpbHRlcnMgdG8gYmUgYXBwbGllZCB0byBkYXRhc2V0c1xuICogQHJldHVybiBkYXRhc2V0cyAtIG5ldyB1cGRhdGVkIGRhdGFzZXRzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5hcHBseUZpbHRlcnNUb0RhdGFzZXRzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyhkYXRhc2V0SWRzLCBkYXRhc2V0cywgZmlsdGVycywgbGF5ZXJzKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0b0FycmF5KGRhdGFzZXRJZHMpO1xuICByZXR1cm4gZGF0YUlkcy5yZWR1Y2UoKGFjYywgZGF0YUlkKSA9PiB7XG4gICAgY29uc3QgbGF5ZXJzVG9GaWx0ZXIgPSAobGF5ZXJzIHx8IFtdKS5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFJZCk7XG4gICAgY29uc3QgYXBwbGllZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihkID0+IHNob3VsZEFwcGx5RmlsdGVyKGQsIGRhdGFJZCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmFjYyxcbiAgICAgIFtkYXRhSWRdOiBmaWx0ZXJEYXRhc2V0KGRhdGFzZXRzW2RhdGFJZF0sIGFwcGxpZWRGaWx0ZXJzLCBsYXllcnNUb0ZpbHRlciwge30pXG4gICAgfTtcbiAgfSwgZGF0YXNldHMpO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgYSBuZXcgZmllbGQgbmFtZSB2YWx1ZSB0byBmaWVsdGVyIGFuZCB1cGRhdGUgYm90aCBmaWx0ZXIgYW5kIGRhdGFzZXRcbiAqIEBwYXJhbSBmaWx0ZXIgLSB0byBiZSBhcHBsaWVkIHRoZSBuZXcgZmllbGQgbmFtZSBvblxuICogQHBhcmFtIGRhdGFzZXQgLSBkYXRhc2V0IHRoZSBmaWVsZCBiZWxvbmdzIHRvXG4gKiBAcGFyYW0gZmllbGROYW1lIC0gZmllbGQubmFtZVxuICogQHBhcmFtIGZpbHRlckRhdGFzZXRJbmRleCAtIGZpZWxkLm5hbWVcbiAqIEBwYXJhbSBvcHRpb25cbiAqIEByZXR1cm4gLSB7ZmlsdGVyLCBkYXRhc2V0c31cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmFwcGx5RmlsdGVyRmllbGROYW1lfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlGaWx0ZXJGaWVsZE5hbWUoZmlsdGVyLCBkYXRhc2V0LCBmaWVsZE5hbWUsIGZpbHRlckRhdGFzZXRJbmRleCA9IDAsIG9wdGlvbikge1xuICAvLyB1c2luZyBmaWx0ZXJEYXRhc2V0SW5kZXggd2UgY2FuIGZpbHRlciBvbmx5IHRoZSBzcGVjaWZpZWQgZGF0YXNldFxuICBjb25zdCBtZXJnZURvbWFpbiA9IG9wdGlvbiAmJiBvcHRpb24uaGFzT3duUHJvcGVydHkoJ21lcmdlRG9tYWluJykgPyBvcHRpb24ubWVyZ2VEb21haW4gOiBmYWxzZTtcbiAgY29uc3Qge2ZpZWxkcywgYWxsRGF0YX0gPSBkYXRhc2V0O1xuXG4gIGNvbnN0IGZpZWxkSW5kZXggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSBmaWVsZE5hbWUpO1xuICAvLyBpZiBubyBmaWVsZCB3aXRoIHNhbWUgbmFtZSBpcyBmb3VuZCwgbW92ZSB0byB0aGUgbmV4dCBkYXRhc2V0c1xuICBpZiAoZmllbGRJbmRleCA9PT0gLTEpIHtcbiAgICAvLyB0aHJvdyBuZXcgRXJyb3IoYGZpZWxkSW5kZXggbm90IGZvdW5kLiBEYXRhc2V0IG11c3QgY29udGFpbiBhIHByb3BlcnR5IHdpdGggbmFtZTogJHtmaWVsZE5hbWV9YCk7XG4gICAgcmV0dXJuIHtmaWx0ZXI6IG51bGwsIGRhdGFzZXR9O1xuICB9XG5cbiAgLy8gVE9ETzogdmFsaWRhdGUgZmllbGQgdHlwZVxuICBjb25zdCBmaWVsZCA9IGZpZWxkc1tmaWVsZEluZGV4XTtcbiAgY29uc3QgZmlsdGVyUHJvcHMgPSBmaWVsZC5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyUHJvcHMnKVxuICAgID8gZmllbGQuZmlsdGVyUHJvcHNcbiAgICA6IGdldEZpbHRlclByb3BzKGFsbERhdGEsIGZpZWxkKTtcblxuICBjb25zdCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uKG1lcmdlRG9tYWluID8gbWVyZ2VGaWx0ZXJEb21haW5TdGVwKGZpbHRlciwgZmlsdGVyUHJvcHMpIDogey4uLmZpbHRlciwgLi4uZmlsdGVyUHJvcHN9KSxcbiAgICBuYW1lOiBPYmplY3QuYXNzaWduKFsuLi50b0FycmF5KGZpbHRlci5uYW1lKV0sIHtbZmlsdGVyRGF0YXNldEluZGV4XTogZmllbGQubmFtZX0pLFxuICAgIGZpZWxkSWR4OiBPYmplY3QuYXNzaWduKFsuLi50b0FycmF5KGZpbHRlci5maWVsZElkeCldLCB7XG4gICAgICBbZmlsdGVyRGF0YXNldEluZGV4XTogZmllbGQudGFibGVGaWVsZEluZGV4IC0gMVxuICAgIH0pLFxuICAgIC8vIFRPRE8sIHNpbmNlIHdlIGFsbG93IHRvIGFkZCBtdWx0aXBsZSBmaWVsZHMgdG8gYSBmaWx0ZXIgd2UgY2FuIG5vIGxvbmdlciBmcmVlemUgdGhlIGZpbHRlclxuICAgIGZyZWV6ZTogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0IGZpZWxkV2l0aEZpbHRlclByb3BzID0ge1xuICAgIC4uLmZpZWxkLFxuICAgIGZpbHRlclByb3BzXG4gIH07XG5cbiAgY29uc3QgbmV3RmllbGRzID0gT2JqZWN0LmFzc2lnbihbLi4uZmllbGRzXSwge1tmaWVsZEluZGV4XTogZmllbGRXaXRoRmlsdGVyUHJvcHN9KTtcblxuICByZXR1cm4ge1xuICAgIGZpbHRlcjogbmV3RmlsdGVyLFxuICAgIGRhdGFzZXQ6IHtcbiAgICAgIC4uLmRhdGFzZXQsXG4gICAgICBmaWVsZHM6IG5ld0ZpZWxkc1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBNZXJnZSBvbmUgZmlsdGVyIHdpdGggb3RoZXIgZmlsdGVyIHByb3AgZG9tYWluXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5tZXJnZUZpbHRlckRvbWFpblN0ZXB9XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUZpbHRlckRvbWFpblN0ZXAoZmlsdGVyLCBmaWx0ZXJQcm9wcykge1xuICBpZiAoIWZpbHRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFmaWx0ZXJQcm9wcykge1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBpZiAoKGZpbHRlci5maWVsZFR5cGUgJiYgZmlsdGVyLmZpZWxkVHlwZSAhPT0gZmlsdGVyUHJvcHMuZmllbGRUeXBlKSB8fCAhZmlsdGVyUHJvcHMuZG9tYWluKSB7XG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkRG9tYWluID0gIWZpbHRlci5kb21haW5cbiAgICA/IGZpbHRlclByb3BzLmRvbWFpblxuICAgIDogWy4uLihmaWx0ZXIuZG9tYWluIHx8IFtdKSwgLi4uKGZpbHRlclByb3BzLmRvbWFpbiB8fCBbXSldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICBjb25zdCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uZmlsdGVyLFxuICAgIC4uLmZpbHRlclByb3BzLFxuICAgIGRvbWFpbjogW2NvbWJpbmVkRG9tYWluWzBdLCBjb21iaW5lZERvbWFpbltjb21iaW5lZERvbWFpbi5sZW5ndGggLSAxXV1cbiAgfTtcblxuICBzd2l0Y2ggKGZpbHRlclByb3BzLmZpZWxkVHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnN0cmluZzpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5kYXRlOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICBkb21haW46IHVuaXF1ZShjb21iaW5lZERvbWFpbikuc29ydCgpXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3Qgc3RlcCA9IGZpbHRlci5zdGVwIDwgZmlsdGVyUHJvcHMuc3RlcCA/IGZpbHRlci5zdGVwIDogZmlsdGVyUHJvcHMuc3RlcDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICBzdGVwXG4gICAgICB9O1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG5ld0ZpbHRlcjtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogR2VuZXJhdGVzIHBvbHlnb24gZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5mZWF0dXJlVG9GaWx0ZXJWYWx1ZX1cbiAqL1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVUb0ZpbHRlclZhbHVlID0gKGZlYXR1cmUsIGZpbHRlcklkLCBwcm9wZXJ0aWVzID0ge30pID0+ICh7XG4gIC4uLmZlYXR1cmUsXG4gIGlkOiBmZWF0dXJlLmlkLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLi4uZmVhdHVyZS5wcm9wZXJ0aWVzLFxuICAgIC4uLnByb3BlcnRpZXMsXG4gICAgZmlsdGVySWRcbiAgfVxufSk7XG5cbi8qKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmlsdGVySWRJbkZlYXR1cmV9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJJZEluRmVhdHVyZSA9IGYgPT4gZ2V0KGYsIFsncHJvcGVydGllcycsICdmaWx0ZXJJZCddKTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgcG9seWdvbiBmaWx0ZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdlbmVyYXRlUG9seWdvbkZpbHRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUG9seWdvbkZpbHRlcihsYXllcnMsIGZlYXR1cmUpIHtcbiAgY29uc3QgZGF0YUlkID0gbGF5ZXJzLm1hcChsID0+IGwuY29uZmlnLmRhdGFJZCkuZmlsdGVyKGQgPT4gZCk7XG4gIGNvbnN0IGxheWVySWQgPSBsYXllcnMubWFwKGwgPT4gbC5pZCk7XG4gIGNvbnN0IG5hbWUgPSBsYXllcnMubWFwKGwgPT4gbC5jb25maWcubGFiZWwpO1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGZpbHRlciA9IGdldERlZmF1bHRGaWx0ZXIoZGF0YUlkKTtcbiAgcmV0dXJuIHtcbiAgICAuLi5maWx0ZXIsXG4gICAgZml4ZWREb21haW46IHRydWUsXG4gICAgdHlwZTogRklMVEVSX1RZUEVTLnBvbHlnb24sXG4gICAgbmFtZSxcbiAgICBsYXllcklkLFxuICAgIHZhbHVlOiBmZWF0dXJlVG9GaWx0ZXJWYWx1ZShmZWF0dXJlLCBmaWx0ZXIuaWQsIHtpc1Zpc2libGU6IHRydWV9KVxuICB9O1xufVxuXG4vKipcbiAqIFJ1biBmaWx0ZXIgZW50aXJlbHkgb24gQ1BVXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5maWx0ZXJEYXRhc2V0Q1BVfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRGF0YXNldENQVShzdGF0ZSwgZGF0YUlkKSB7XG4gIGNvbnN0IGRhdGFzZXRGaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZiA9PiBmLmRhdGFJZC5pbmNsdWRlcyhkYXRhSWQpKTtcbiAgY29uc3Qgc2VsZWN0ZWREYXRhc2V0ID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXTtcblxuICBpZiAoIXNlbGVjdGVkRGF0YXNldCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IG9wdCA9IHtcbiAgICBjcHVPbmx5OiB0cnVlLFxuICAgIGlnbm9yZURvbWFpbjogdHJ1ZVxuICB9O1xuXG4gIGlmICghZGF0YXNldEZpbHRlcnMubGVuZ3RoKSB7XG4gICAgLy8gbm8gZmlsdGVyXG4gICAgY29uc3QgZmlsdGVyZWQgPSB7XG4gICAgICAuLi5zZWxlY3RlZERhdGFzZXQsXG4gICAgICBmaWx0ZXJlZElkeENQVTogc2VsZWN0ZWREYXRhc2V0LmFsbEluZGV4ZXMsXG4gICAgICBmaWx0ZXJSZWNvcmRDUFU6IGdldEZpbHRlclJlY29yZChkYXRhSWQsIHN0YXRlLmZpbHRlcnMsIG9wdClcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNldChbJ2RhdGFzZXRzJywgZGF0YUlkXSwgZmlsdGVyZWQsIHN0YXRlKTtcbiAgfVxuXG4gIC8vIG5vIGdwdSBmaWx0ZXJcbiAgaWYgKCFkYXRhc2V0RmlsdGVycy5maW5kKGYgPT4gZi5ncHUpKSB7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB7XG4gICAgICAuLi5zZWxlY3RlZERhdGFzZXQsXG4gICAgICBmaWx0ZXJlZElkeENQVTogc2VsZWN0ZWREYXRhc2V0LmZpbHRlcmVkSW5kZXgsXG4gICAgICBmaWx0ZXJSZWNvcmRDUFU6IGdldEZpbHRlclJlY29yZChkYXRhSWQsIHN0YXRlLmZpbHRlcnMsIG9wdClcbiAgICB9O1xuICAgIHJldHVybiBzZXQoWydkYXRhc2V0cycsIGRhdGFJZF0sIGZpbHRlcmVkLCBzdGF0ZSk7XG4gIH1cblxuICAvLyBtYWtlIGEgY29weSBmb3IgY3B1IGZpbHRlcmluZ1xuICBjb25zdCBjb3BpZWQgPSB7XG4gICAgLi4uc2VsZWN0ZWREYXRhc2V0LFxuICAgIGZpbHRlclJlY29yZDogc2VsZWN0ZWREYXRhc2V0LmZpbHRlclJlY29yZENQVSxcbiAgICBmaWx0ZXJlZEluZGV4OiBzZWxlY3RlZERhdGFzZXQuZmlsdGVyZWRJZHhDUFUgfHwgW11cbiAgfTtcblxuICBjb25zdCBmaWx0ZXJlZCA9IGZpbHRlckRhdGFzZXQoY29waWVkLCBzdGF0ZS5maWx0ZXJzLCBzdGF0ZS5sYXllcnMsIG9wdCk7XG5cbiAgY29uc3QgY3B1RmlsdGVyZWREYXRhc2V0ID0ge1xuICAgIC4uLnNlbGVjdGVkRGF0YXNldCxcbiAgICBmaWx0ZXJlZElkeENQVTogZmlsdGVyZWQuZmlsdGVyZWRJbmRleCxcbiAgICBmaWx0ZXJSZWNvcmRDUFU6IGZpbHRlcmVkLmZpbHRlclJlY29yZFxuICB9O1xuXG4gIHJldHVybiBzZXQoWydkYXRhc2V0cycsIGRhdGFJZF0sIGNwdUZpbHRlcmVkRGF0YXNldCwgc3RhdGUpO1xufVxuIl19