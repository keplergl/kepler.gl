// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {ascending, extent, histogram as d3Histogram, ticks} from 'd3-array';
import keyMirror from 'keymirror';
import get from 'lodash.get';
import booleanWithin from '@turf/boolean-within';
import {point as turfPoint} from '@turf/helpers';
import {Decimal} from 'decimal.js';
import {ALL_FIELD_TYPES, FILTER_TYPES} from 'constants/default-settings';
import {maybeToDate, notNullorUndefined, unique, timeToUnixMilli} from './data-utils';
import * as ScaleUtils from './data-scale-utils';
import {LAYER_TYPES} from '../constants';
import {generateHashId, set, toArray} from './utils';
import {getGpuFilterProps, getDatasetFieldIndexForFilter} from './gpu-filter-utils';

// TYPE
/** @typedef {import('../reducers/vis-state-updaters').FilterRecord} FilterRecord */
/** @typedef {import('./filter-utils').FilterResult} FilterResult */

export const TimestampStepMap = [
  {max: 1, step: 0.05},
  {max: 10, step: 0.1},
  {max: 100, step: 1},
  {max: 500, step: 5},
  {max: 1000, step: 10},
  {max: 5000, step: 50},
  {max: Number.POSITIVE_INFINITY, step: 1000}
];

export const histogramBins = 30;
export const enlargedHistogramBins = 100;

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationYear = durationDay * 365;

export const PLOT_TYPES = keyMirror({
  histogram: null,
  lineChart: null
});

export const FILTER_UPDATER_PROPS = keyMirror({
  dataId: null,
  name: null,
  layerId: null
});

export const LIMITED_FILTER_EFFECT_PROPS = keyMirror({
  [FILTER_UPDATER_PROPS.name]: null
});
/**
 * Max number of filter value buffers that deck.gl provides
 */

const SupportedPlotType = {
  [FILTER_TYPES.timeRange]: {
    default: 'histogram',
    [ALL_FIELD_TYPES.integer]: 'lineChart',
    [ALL_FIELD_TYPES.real]: 'lineChart'
  },
  [FILTER_TYPES.range]: {
    default: 'histogram',
    [ALL_FIELD_TYPES.integer]: 'lineChart',
    [ALL_FIELD_TYPES.real]: 'lineChart'
  }
};

export const FILTER_COMPONENTS = {
  [FILTER_TYPES.select]: 'SingleSelectFilter',
  [FILTER_TYPES.multiSelect]: 'MultiSelectFilter',
  [FILTER_TYPES.timeRange]: 'TimeRangeFilter',
  [FILTER_TYPES.range]: 'RangeFilter',
  [FILTER_TYPES.polygon]: 'PolygonFilter'
};

export const DEFAULT_FILTER_STRUCTURE = {
  dataId: [], // [string]
  freeze: false,
  id: null,

  // time range filter specific
  fixedDomain: false,
  enlarged: false,
  isAnimating: false,
  speed: 1,

  // field specific
  name: [], // string
  type: null,
  fieldIdx: [], // [integer]
  domain: null,
  value: null,

  // plot
  plotType: PLOT_TYPES.histogram,
  yAxis: null,
  interval: null,

  // mode
  gpu: false
};

export const FILTER_ID_LENGTH = 4;

export const LAYER_FILTERS = [FILTER_TYPES.polygon];

/**
 * Generates a filter with a dataset id as dataId
 * @type {typeof import('./filter-utils').getDefaultFilter}
 */
export function getDefaultFilter(dataId) {
  return {
    ...DEFAULT_FILTER_STRUCTURE,
    // store it as dataId and it could be one or many
    dataId: toArray(dataId),
    id: generateHashId(FILTER_ID_LENGTH)
  };
}

/**
 * Check if a filter is valid based on the given dataId
 * @param  filter to validate
 * @param  datasetId id to validate filter against
 * @return true if a filter is valid, false otherwise
 * @type {typeof import('./filter-utils').shouldApplyFilter}
 */
export function shouldApplyFilter(filter, datasetId) {
  const dataIds = toArray(filter.dataId);
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
export function validatePolygonFilter(dataset, filter, layers) {
  const failed = {dataset, filter: null};
  const {value, layerId, type, dataId} = filter;

  if (!layerId || !isValidFilterValue(type, value)) {
    return failed;
  }

  const isValidDataset = dataId.includes(dataset.id);

  if (!isValidDataset) {
    return failed;
  }

  const layer = layers.find(l => layerId.includes(l.id));

  if (!layer) {
    return failed;
  }

  return {
    filter: {
      ...filter,
      freeze: true,
      fieldIdx: []
    },
    dataset
  };
}

/**
 * Custom filter validators
 */
const filterValidators = {
  [FILTER_TYPES.polygon]: validatePolygonFilter
};

/**
 * Default validate filter function
 * @param dataset
 * @param filter
 * @return - {filter, dataset}
 * @type {typeof import('./filter-utils').validateFilter}
 */
export function validateFilter(dataset, filter) {
  // match filter.dataId
  const failed = {dataset, filter: null};
  const filterDataId = toArray(filter.dataId);

  const filterDatasetIndex = filterDataId.indexOf(dataset.id);
  if (filterDatasetIndex < 0) {
    // the current filter is not mapped against the current dataset
    return failed;
  }

  const initializeFilter = {
    ...getDefaultFilter(filter.dataId),
    ...filter,
    dataId: filterDataId,
    name: toArray(filter.name)
  };

  const fieldName = initializeFilter.name[filterDatasetIndex];
  const {filter: updatedFilter, dataset: updatedDataset} = applyFilterFieldName(
    initializeFilter,
    dataset,
    fieldName,
    filterDatasetIndex,
    {mergeDomain: true}
  );

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
export function validateFilterWithData(dataset, filter, layers) {
  // @ts-ignore
  return filterValidators.hasOwnProperty(filter.type)
    ? filterValidators[filter.type](dataset, filter, layers)
    : validateFilter(dataset, filter);
}

/**
 * Validate YAxis
 * @param filter
 * @param dataset
 * @return {*}
 */
function validateFilterYAxis(filter, dataset) {
  // TODO: validate yAxis against other datasets

  const {fields, allData} = dataset;
  const {yAxis} = filter;
  // TODO: validate yAxis against other datasets
  if (yAxis) {
    const matchedAxis = fields.find(({name, type}) => name === yAxis.name && type === yAxis.type);

    filter = matchedAxis
      ? {
          ...filter,
          yAxis: matchedAxis,
          ...getFilterPlot({...filter, yAxis: matchedAxis}, allData)
        }
      : filter;
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
export function getFilterProps(allData, field) {
  const filterProps = {
    ...getFieldDomain(allData, field),
    fieldType: field.type
  };

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return {
        ...filterProps,
        value: filterProps.domain,
        type: FILTER_TYPES.range,
        typeOptions: [FILTER_TYPES.range],
        gpu: true
      };

    case ALL_FIELD_TYPES.boolean:
      return {
        ...filterProps,
        type: FILTER_TYPES.select,
        value: true,
        gpu: false
      };

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return {
        ...filterProps,
        type: FILTER_TYPES.multiSelect,
        value: [],
        gpu: false
      };

    case ALL_FIELD_TYPES.timestamp:
      return {
        ...filterProps,
        type: FILTER_TYPES.timeRange,
        enlarged: true,
        fixedDomain: true,
        value: filterProps.domain,
        gpu: true
      };

    default:
      return {};
  }
}

/**
 * Calculate field domain based on field type and data
 *
 * @type {typeof import('./filter-utils').getFieldDomain}
 */
export function getFieldDomain(allData, field) {
  const fieldIdx = field.tableFieldIndex - 1;
  const isTime = field.type === ALL_FIELD_TYPES.timestamp;
  const valueAccessor = maybeToDate.bind(null, isTime, fieldIdx, field.format);
  let domain;

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      // calculate domain and step
      return getNumericFieldDomain(allData, valueAccessor);

    case ALL_FIELD_TYPES.boolean:
      return {domain: [true, false]};

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      domain = ScaleUtils.getOrdinalDomain(allData, valueAccessor);
      return {domain};

    case ALL_FIELD_TYPES.timestamp:
      return getTimestampFieldDomain(allData, valueAccessor);

    default:
      return {domain: ScaleUtils.getOrdinalDomain(allData, valueAccessor)};
  }
}

export const getPolygonFilterFunctor = (layer, filter) => {
  const getPosition = layer.getPositionAccessor();

  switch (layer.type) {
    case LAYER_TYPES.point:
    case LAYER_TYPES.icon:
      return data => {
        const pos = getPosition({data});
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };
    case LAYER_TYPES.arc:
    case LAYER_TYPES.line:
      return data => {
        const pos = getPosition({data});
        return (
          pos.every(Number.isFinite) &&
          [
            [pos[0], pos[1]],
            [pos[3], pos[4]]
          ].every(point => isInPolygon(point, filter.value))
        );
      };
    default:
      return () => true;
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
export function getFilterFunction(field, dataId, filter, layers) {
  // field could be null in polygon filter
  const valueAccessor = data => (field ? data[field.tableFieldIndex - 1] : null);
  const defaultFunc = d => true;

  switch (filter.type) {
    case FILTER_TYPES.range:
      return data => isInRange(valueAccessor(data), filter.value);
    case FILTER_TYPES.multiSelect:
      return data => filter.value.includes(valueAccessor(data));
    case FILTER_TYPES.select:
      return data => valueAccessor(data) === filter.value;
    case FILTER_TYPES.timeRange:
      if (!field) {
        return defaultFunc;
      }
      const mappedValue = get(field, ['filterProps', 'mappedValue']);
      const accessor = Array.isArray(mappedValue)
        ? (data, index) => mappedValue[index]
        : data => timeToUnixMilli(valueAccessor(data), field.format);
      return (data, index) => isInRange(accessor(data, index), filter.value);
    case FILTER_TYPES.polygon:
      if (!layers || !layers.length) {
        return defaultFunc;
      }
      // @ts-ignore
      const layerFilterFunctions = filter.layerId
        .map(id => layers.find(l => l.id === id))
        .filter(l => l && l.config.dataId === dataId)
        .map(layer => getPolygonFilterFunctor(layer, filter));

      return data => layerFilterFunctions.every(filterFunc => filterFunc(data));
    default:
      return defaultFunc;
  }
}

export function updateFilterDataId(dataId) {
  return getDefaultFilter(dataId);
}

/**
 * Filter data based on an array of filters
 * @type {typeof import('./filter-utils').filterDataset}
 */
export function filterDataset(dataset, filters, layers, opt) {
  const {allData, id: dataId, filterRecord: oldFilterRecord, fields} = dataset;

  // if there is no filters
  const filterRecord = getFilterRecord(dataId, filters, opt || {});

  const newDataset = set(['filterRecord'], filterRecord, dataset);

  if (!filters.length) {
    return {
      ...newDataset,
      gpuFilter: getGpuFilterProps(filters, dataId, fields),
      filteredIndex: dataset.allIndexes,
      filteredIndexForDomain: dataset.allIndexes
    };
  }

  const changedFilters = diffFilters(filterRecord, oldFilterRecord);

  // generate 2 sets of filter result
  // filteredIndex used to calculate layer data
  // filteredIndexForDomain used to calculate layer Domain
  const shouldCalDomain = Boolean(changedFilters.dynamicDomain);
  const shouldCalIndex = Boolean(changedFilters.cpu);

  let filterResult = {};
  if (shouldCalDomain || shouldCalIndex) {
    const dynamicDomainFilters = shouldCalDomain ? filterRecord.dynamicDomain : null;
    const cpuFilters = shouldCalIndex ? filterRecord.cpu : null;

    const filterFuncs = filters.reduce((acc, filter) => {
      const fieldIndex = getDatasetFieldIndexForFilter(dataset.id, filter);
      const field = fieldIndex !== -1 ? fields[fieldIndex] : null;

      return {
        ...acc,
        [filter.id]: getFilterFunction(field, dataset.id, filter, layers)
      };
    }, {});

    filterResult = filterDataByFilterTypes(
      {dynamicDomainFilters, cpuFilters, filterFuncs},
      allData
    );
  }

  return {
    ...newDataset,
    ...filterResult,
    gpuFilter: getGpuFilterProps(filters, dataId, fields)
  };
}

/**
 * @type {typeof import('./filter-utils').filterDataByFilterTypes}
 */
export function filterDataByFilterTypes({dynamicDomainFilters, cpuFilters, filterFuncs}, allData) {
  const result = {
    ...(dynamicDomainFilters ? {filteredIndexForDomain: []} : {}),
    ...(cpuFilters ? {filteredIndex: []} : {})
  };

  for (let i = 0; i < allData.length; i++) {
    const d = allData[i];

    const matchForDomain =
      dynamicDomainFilters && dynamicDomainFilters.every(filter => filterFuncs[filter.id](d, i));

    if (matchForDomain) {
      // @ts-ignore
      result.filteredIndexForDomain.push(i);
    }

    const matchForRender = cpuFilters && cpuFilters.every(filter => filterFuncs[filter.id](d, i));

    if (matchForRender) {
      // @ts-ignore
      result.filteredIndex.push(i);
    }
  }

  return result;
}

/**
 * Get a record of filters based on domain type and gpu / cpu
 * @type {typeof import('./filter-utils').getFilterRecord}
 */
export function getFilterRecord(dataId, filters, opt = {}) {
  /**
   * @type {FilterRecord}
   */
  const filterRecord = {
    dynamicDomain: [],
    fixedDomain: [],
    cpu: [],
    gpu: []
  };

  filters.forEach(f => {
    if (isValidFilterValue(f.type, f.value) && toArray(f.dataId).includes(dataId)) {
      (f.fixedDomain || opt.ignoreDomain
        ? filterRecord.fixedDomain
        : filterRecord.dynamicDomain
      ).push(f);

      (f.gpu && !opt.cpuOnly ? filterRecord.gpu : filterRecord.cpu).push(f);
    }
  });

  return filterRecord;
}

/**
 * Compare filter records to get what has changed
 * @type {typeof import('./filter-utils').diffFilters}
 */
export function diffFilters(filterRecord, oldFilterRecord = {}) {
  let filterChanged = {};

  Object.entries(filterRecord).forEach(([record, items]) => {
    items.forEach(filter => {
      const oldFilter = (oldFilterRecord[record] || []).find(f => f.id === filter.id);

      if (!oldFilter) {
        // added
        filterChanged = set([record, filter.id], 'added', filterChanged);
      } else {
        // check  what has changed
        ['name', 'value', 'dataId'].forEach(prop => {
          if (filter[prop] !== oldFilter[prop]) {
            filterChanged = set([record, filter.id], `${prop}_changed`, filterChanged);
          }
        });
      }
    });

    (oldFilterRecord[record] || []).forEach(oldFilter => {
      // deleted
      if (!items.find(f => f.id === oldFilter.id)) {
        filterChanged = set([record, oldFilter.id], 'deleted', filterChanged);
      }
    });

    if (!filterChanged[record]) {
      filterChanged[record] = null;
    }
  });

  // @ts-ignore
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
export function adjustValueToFilterDomain(value, {domain, type}) {
  if (!domain || !type) {
    return false;
  }

  switch (type) {
    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(d => d);
      }

      return value.map((d, i) => (notNullorUndefined(d) && isInRange(d, domain) ? d : domain[i]));

    case FILTER_TYPES.multiSelect:
      if (!Array.isArray(value)) {
        return [];
      }
      const filteredValue = value.filter(d => domain.includes(d));
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
 * @type {typeof import('./filter-utils').getNumericFieldDomain}
 */
export function getNumericFieldDomain(data, valueAccessor) {
  let domain = [0, 1];
  let step = 0.1;

  const mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];

  if (Array.isArray(data) && data.length > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    const diff = domain[1] - domain[0];

    // in case equal domain, [96, 96], which will break quantize scale
    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  }

  // @ts-ignore
  const {histogram, enlargedHistogram} = getHistogram(domain, mappedValue);

  return {domain, step, histogram, enlargedHistogram};
}

/**
 * Calculate step size for range and timerange filter
 *
 * @type {typeof import('./filter-utils').getNumericStepSize}
 */
export function getNumericStepSize(diff) {
  diff = Math.abs(diff);

  if (diff > 100) {
    return 1;
  } else if (diff > 3) {
    return 0.01;
  } else if (diff > 1) {
    return 0.001;
  }
  // Try to get at least 1000 steps - and keep the step size below that of
  // the (diff > 1) case.
  const x = diff / 1000;
  // Find the exponent and truncate to 10 to the power of that exponent

  const exponentialForm = x.toExponential();
  const exponent = parseFloat(exponentialForm.split('e')[1]);

  // Getting ready for node 12
  // this is why we need decimal.js
  // Math.pow(10, -5) = 0.000009999999999999999
  // the above result shows in browser and node 10
  // node 12 behaves correctly
  return new Decimal(10).pow(exponent).toNumber();
}

/**
 * Calculate timestamp domain and suitable step
 *
 * @type {typeof import('./filter-utils').getTimestampFieldDomain}
 */
export function getTimestampFieldDomain(data, valueAccessor) {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain

  const mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  const domain = ScaleUtils.getLinearDomain(mappedValue);
  let step = 0.01;

  const diff = domain[1] - domain[0];
  const entry = TimestampStepMap.find(f => f.max >= diff);
  if (entry) {
    step = entry.step;
  }

  const {histogram, enlargedHistogram} = getHistogram(domain, mappedValue);

  return {domain, step, mappedValue, histogram, enlargedHistogram};
}

/**
 *
 * @type {typeof import('./filter-utils').histogramConstruct}
 */
export function histogramConstruct(domain, mappedValue, bins) {
  return d3Histogram()
    .thresholds(ticks(domain[0], domain[1], bins))
    .domain(domain)(mappedValue)
    .map(bin => ({
      count: bin.length,
      x0: bin.x0,
      x1: bin.x1
    }));
}
/**
 * Calculate histogram from domain and array of values
 *
 * @type {typeof import('./filter-utils').getHistogram}
 */
export function getHistogram(domain, mappedValue) {
  const histogram = histogramConstruct(domain, mappedValue, histogramBins);
  const enlargedHistogram = histogramConstruct(domain, mappedValue, enlargedHistogramBins);

  return {histogram, enlargedHistogram};
}

/**
 * round number based on step
 *
 * @param {Number} val
 * @param {Number} step
 * @param {string} bound
 * @returns {Number} rounded number
 */
export function formatNumberByStep(val, step, bound) {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}

/**
 *
 * @type {typeof import('./filter-utils').isInRange}
 */
export function isInRange(val, domain) {
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
export function isInPolygon(point, polygon) {
  return booleanWithin(turfPoint(point), polygon);
}

export function getTimeWidgetTitleFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  const diff = domain[1] - domain[0];
  return diff > durationYear
    ? 'MM/DD/YY'
    : diff > durationDay
    ? 'MM/DD/YY hh:mma'
    : 'MM/DD/YY hh:mm:ssa';
}

export function getTimeWidgetHintFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  const diff = domain[1] - domain[0];
  return diff > durationYear
    ? 'MM/DD/YY'
    : diff > durationWeek
    ? 'MM/DD'
    : diff > durationDay
    ? 'MM/DD hha'
    : diff > durationHour
    ? 'hh:mma'
    : 'hh:mm:ssa';
}

/**
 * Sanity check on filters to prepare for save
 * @type {typeof import('./filter-utils').isValidFilterValue}
 */
/* eslint-disable complexity */
export function isValidFilterValue(type, value) {
  if (!type) {
    return false;
  }
  switch (type) {
    case FILTER_TYPES.select:
      return value === true || value === false;

    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(v => v !== null && !isNaN(v));

    case FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case FILTER_TYPES.input:
      return Boolean(value.length);

    case FILTER_TYPES.polygon:
      const coordinates = get(value, ['geometry', 'coordinates']);
      return Boolean(value && value.id && coordinates);

    default:
      return true;
  }
}

/**
 *
 * @type {typeof import('./filter-utils').getFilterPlot}
 */
export function getFilterPlot(filter, allData) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  const {mappedValue = []} = filter;
  const {yAxis} = filter;

  // return lineChart
  const series = allData
    .map((d, i) => ({
      x: mappedValue[i],
      y: d[yAxis.tableFieldIndex - 1]
    }))
    .filter(({x, y}) => Number.isFinite(x) && Number.isFinite(y))
    .sort((a, b) => ascending(a.x, b.x));

  const yDomain = extent(series, d => d.y);
  const xDomain = [series[0].x, series[series.length - 1].x];

  return {lineChart: {series, yDomain, xDomain}, yAxis};
}

export function getDefaultFilterPlotType(filter) {
  const filterPlotTypes = SupportedPlotType[filter.type];
  if (!filterPlotTypes) {
    return null;
  }

  if (!filter.yAxis) {
    return filterPlotTypes.default;
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
export function applyFiltersToDatasets(datasetIds, datasets, filters, layers) {
  const dataIds = toArray(datasetIds);
  return dataIds.reduce((acc, dataId) => {
    const layersToFilter = (layers || []).filter(l => l.config.dataId === dataId);
    const appliedFilters = filters.filter(d => shouldApplyFilter(d, dataId));

    return {
      ...acc,
      [dataId]: filterDataset(datasets[dataId], appliedFilters, layersToFilter, {})
    };
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
export function applyFilterFieldName(filter, dataset, fieldName, filterDatasetIndex = 0, option) {
  // using filterDatasetIndex we can filter only the specified dataset
  const mergeDomain = option && option.hasOwnProperty('mergeDomain') ? option.mergeDomain : false;
  const {fields, allData} = dataset;

  const fieldIndex = fields.findIndex(f => f.name === fieldName);
  // if no field with same name is found, move to the next datasets
  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {filter: null, dataset};
  }

  // TODO: validate field type
  const field = fields[fieldIndex];
  const filterProps = field.hasOwnProperty('filterProps')
    ? field.filterProps
    : getFilterProps(allData, field);

  const newFilter = {
    ...(mergeDomain ? mergeFilterDomainStep(filter, filterProps) : {...filter, ...filterProps}),
    name: Object.assign([...toArray(filter.name)], {[filterDatasetIndex]: field.name}),
    fieldIdx: Object.assign([...toArray(filter.fieldIdx)], {
      [filterDatasetIndex]: field.tableFieldIndex - 1
    }),
    // TODO, since we allow to add multiple fields to a filter we can no longer freeze the filter
    freeze: true
  };

  const fieldWithFilterProps = {
    ...field,
    filterProps
  };

  const newFields = Object.assign([...fields], {[fieldIndex]: fieldWithFilterProps});

  return {
    filter: newFilter,
    dataset: {
      ...dataset,
      fields: newFields
    }
  };
}

/**
 * Merge one filter with other filter prop domain
 * @type {typeof import('./filter-utils').mergeFilterDomainStep}
 */
/* eslint-disable complexity */
export function mergeFilterDomainStep(filter, filterProps) {
  if (!filter) {
    return null;
  }

  if (!filterProps) {
    return filter;
  }

  if ((filter.fieldType && filter.fieldType !== filterProps.fieldType) || !filterProps.domain) {
    return filter;
  }

  const combinedDomain = !filter.domain
    ? filterProps.domain
    : [...(filter.domain || []), ...(filterProps.domain || [])].sort((a, b) => a - b);

  const newFilter = {
    ...filter,
    ...filterProps,
    domain: [combinedDomain[0], combinedDomain[combinedDomain.length - 1]]
  };

  switch (filterProps.fieldType) {
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return {
        ...newFilter,
        domain: unique(combinedDomain).sort()
      };

    case ALL_FIELD_TYPES.timestamp:
      // @ts-ignore
      const step = filter.step < filterProps.step ? filter.step : filterProps.step;

      return {
        ...newFilter,
        step
      };
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    default:
      return newFilter;
  }
}
/* eslint-enable complexity */

/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').featureToFilterValue}
 */
export const featureToFilterValue = (feature, filterId, properties = {}) => ({
  ...feature,
  id: feature.id,
  properties: {
    ...feature.properties,
    ...properties,
    filterId
  }
});

/**
 * @type {typeof import('./filter-utils').getFilterIdInFeature}
 */
export const getFilterIdInFeature = f => get(f, ['properties', 'filterId']);

/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').generatePolygonFilter}
 */
export function generatePolygonFilter(layers, feature) {
  const dataId = layers.map(l => l.config.dataId).filter(d => d);
  const layerId = layers.map(l => l.id);
  const name = layers.map(l => l.config.label);
  // @ts-ignore
  const filter = getDefaultFilter(dataId);
  return {
    ...filter,
    fixedDomain: true,
    type: FILTER_TYPES.polygon,
    name,
    layerId,
    value: featureToFilterValue(feature, filter.id, {isVisible: true})
  };
}

/**
 * Run filter entirely on CPU
 * @type {typeof import('./filter-utils').filterDatasetCPU}
 */
export function filterDatasetCPU(state, dataId) {
  const datasetFilters = state.filters.filter(f => f.dataId.includes(dataId));
  const selectedDataset = state.datasets[dataId];

  if (!selectedDataset) {
    return state;
  }

  const opt = {
    cpuOnly: true,
    ignoreDomain: true
  };

  if (!datasetFilters.length) {
    // no filter
    const filtered = {
      ...selectedDataset,
      filteredIdxCPU: selectedDataset.allIndexes,
      filterRecordCPU: getFilterRecord(dataId, state.filters, opt)
    };

    return set(['datasets', dataId], filtered, state);
  }

  // no gpu filter
  if (!datasetFilters.find(f => f.gpu)) {
    const filtered = {
      ...selectedDataset,
      filteredIdxCPU: selectedDataset.filteredIndex,
      filterRecordCPU: getFilterRecord(dataId, state.filters, opt)
    };
    return set(['datasets', dataId], filtered, state);
  }

  // make a copy for cpu filtering
  const copied = {
    ...selectedDataset,
    filterRecord: selectedDataset.filterRecordCPU,
    filteredIndex: selectedDataset.filteredIdxCPU || []
  };

  const filtered = filterDataset(copied, state.filters, state.layers, opt);

  const cpuFilteredDataset = {
    ...selectedDataset,
    filteredIdxCPU: filtered.filteredIndex,
    filterRecordCPU: filtered.filterRecord
  };

  return set(['datasets', dataId], cpuFilteredDataset, state);
}
