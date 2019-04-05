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

import moment from 'moment';
import {ascending, extent, histogram as d3Histogram, ticks} from 'd3-array';
import keyMirror from 'keymirror';
import {ALL_FIELD_TYPES} from 'constants/default-settings';
import {maybeToDate, notNullorUndefined, unique} from './data-utils';
import * as ScaleUtils from './data-scale-utils';
import {generateHashId, set} from './utils';
import {
  setFilterGpuMode,
  assignGpuChannel,
  getGpuFilterProps
} from './gpu-filter-utils';

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

export const FILTER_TYPES = keyMirror({
  range: null,
  select: null,
  timeRange: null,
  multiSelect: null
});

export const PLOT_TYPES = keyMirror({
  histogram: null,
  lineChart: null
});

export const FILTER_UPDATER_PROPS = keyMirror({
  dataId: null,
  name: null
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
  [FILTER_TYPES.range]: 'RangeFilter'
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

/**
 * Generates a filter with a dataset id as dataId
 * @param {[string]} dataId
 * @return {object} filter
 */
export function getDefaultFilter(dataId) {
  return {
    ...DEFAULT_FILTER_STRUCTURE,
    // store it as dataId and it could be one or many
    dataId: Array.isArray(dataId) ? dataId : [dataId],
    id: generateHashId(FILTER_ID_LENGTH)
  };
}

/**
 * Check if a filter is valid based on the given dataId
 * @param {object} filter to validate
 * @param {string} dataset id to validate filter against
 * @return {boolean} true if a filter is valid, false otherwise
 */
export function shouldApplyFilter(filter, datasetId) {
  const valid = Boolean(filter.dataId)
    // datasetId is contained in dataId
    && (
      // filter.dataId is an array or or matches exactly the datasetId
      (Array.isArray(filter.dataId) && filter.dataId.includes(datasetId))
      || filter.dataId === datasetId
    )
    // value must be defined
    && filter.value !== null;

  return valid;
}

/**
 * Validate saved filter config with new data,
 * calculate domain and fieldIdx based new fields and data
 *
 * @param {Object} dataset
 * @param {Object} filter - filter to be validate
 * @return {Object | null} - validated filter
 */
export function validateFilterWithData(dataset, filter) {

  // match filter.dataId
  const failed = {dataset, filter: null};

  const filterDataId = Array.isArray(filter.dataId) ? filter.dataId : [filter.dataId];

  const filterDatasetIndex = filterDataId.indexOf(dataset.id);
  if (filterDatasetIndex < 0) {
    // the current filter is not mapped against the current dataset
    return failed;
  }

  const initializeFilter = {
    ...getDefaultFilter(filter.dataId),
    ...filter,
    dataId: filterDataId,
    name: Array.isArray(filter.name) ? filter.name : [filter.name]
  };

  const fieldName = initializeFilter.name[filterDatasetIndex];
  const {filter: updatedFilter, dataset: updatedDataset} =
    applyFilterFieldName(initializeFilter, dataset, fieldName, filterDatasetIndex, {mergeDomain: true});

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
  }
}

function validateFilterYAxis(filter, dataset) {
  // TODO: validate yAxis against other datasets

  const {fields, allData} = dataset;
  const {yAxis} = filter;
  // TODO: validate yAxis against other datasets
  if (yAxis) {
    const matchedAxis = fields.find(
      ({name, type}) => name === yAxis.name && type === yAxis.type
    );

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
 * @param {Array<Array>} allData
 * @param {Object} field
 * @returns {Object} default filter
 */
export function getFilterProps(allData, field) {
  const filterProp = {
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
 * @param {Array<Array>} allData
 * @param {Object} field
 * @returns {Object} with domain as key
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

export function updateFilterDataId(dataId) {
  return getDefaultFilter(dataId);
}

/**
 *
 * @param {Object} filter
 * @param {Number} idx
 * @param {Object} dataset
 * @param {Array<Object>} filters
 * @returns {{newField: Object, newFilter: Object}}
 */
export function updateFilterField(filter, idx, dataset, filters) {
  const {name} = filter;
  const {fields, allData} = dataset;
  // find the field
  const fieldIdx = fields.findIndex(f => f.name === name);

  let newField = fields[fieldIdx];

  if (!newField.filterProp) {
    // get filter domain from field
    // save filterProps: {domain, steps, value} to field, avoid recalculate
    newField = set(['filterProp'], getFilterProps(allData, newField), newField);
  }

  let newFilter = {
    ...filter,
    ...newField.filterProp,
    name: newField.name,
    // can't edit dataId once name is selected
    freeze: true,
    fieldIdx
  };

  const enlargedFilterIdx = filters.findIndex(f => f.enlarged);

  if (enlargedFilterIdx > -1 && enlargedFilterIdx !== idx) {
    // there should be only one enlarged filter
    newFilter.enlarged = false;
  }

  if (newFilter.gpu) {
    newFilter = setFilterGpuMode(newFilter, filters);
    newFilter = assignGpuChannel(newFilter, filters);
  }

  return {newField, newFilter};
}
/**
 * Filter data based on an array of filters
 *
 * @param {Object} dataset
 * @param {Array<Object>} filters
 * @param {Object} opt
 * @param {Object} opt.cpuOnly only allow cpu filtering
 * @returns {Object} dataset
 * @returns {Array<Number>} dataset.filteredIndex
 * @returns {Array<Number>} dataset.filteredIndexForDomain
 */
export function filterDataset(dataset, filters, opt = {}) {
  const {allData, id: dataId, filterRecord: oldFilterRecord, fields} = dataset;

  // if there is no filters
  const filterRecord = getFilterRecord(dataId, filters);

  const newDataset = set(['filterRecord'], filterRecord, dataset);
  if (!filters.length) {
    return {
      ...newDataset,
      filteredIndex: dataset.allIndexes,
      filteredIndexForDomain: dataset.allIndexes
    };
  }

  const changedFilters = diffFilters(filterRecord, oldFilterRecord);

  // generate 2 sets of filter result
  // filteredIndex used to calculate layer data
  // filteredIndexForDomain used to calculate layer Domain
  const shouldCalDomain = Boolean(changedFilters.dynamicDomain);
  const shouldCalIndex = Boolean(changedFilters.cpu) || opt.cpuOnly;

  let filterResult = {};
  if (shouldCalDomain || shouldCalIndex) {

    const dynamicDomainFilters = shouldCalDomain ? filterRecord.dynamicDomain : null;
    const cpuFilters = shouldCalIndex ? (opt.cpuOnly ? filters : filterRecord.cpu) : null;
    const filtersToFields = filters.reduce((acc, filter) => {
      const fieldIndex = getDatasetFieldIndexForFilter(dataset, filter);

      return {
        ...acc,
        ...(fieldIndex !== -1 ? {[filter.id]: fields[fieldIndex]} : {})
      }
    }, {
      // [filterId]: field
    });

    filterResult = filterDataByFilterTypes(
      {dynamicDomainFilters, cpuFilters, filtersToFields},
      allData
    );
  }

  return {
    ...newDataset,
    ...filterResult,
    gpuFilter: getGpuFilterProps(filters, dataId)
  };
}

/**
 *
 * @param {Object} filters
 * @param {Array|null} filters.dynamicDomainFilters
 * @param {Array|null} filters.cpuFilters
 * @returns {{filteredIndex: Array, filteredIndexForDomain: Array}} filteredIndex and filteredIndexForDomain
 */
function filterDataByFilterTypes({dynamicDomainFilters, cpuFilters, filtersToFields}, allData) {
  // const filteredIndexForDomain = [];
  // const filteredIndex = [];
  const result = {
    ...(dynamicDomainFilters ? {filteredIndexForDomain: []} : {}),
    ...(cpuFilters ? {filteredIndex: []} : {})
  };

  // const appliedFilters = filters.filter(d => shouldApplyFilter(d, dataset.id));
  for (let i = 0; i < allData.length; i++) {
    const matchForDomain =
      dynamicDomainFilters &&
      dynamicDomainFilters.every(filter =>
        isDataMatchFilter(allData[i], filter, i, filtersToFields[filter.id])
      );

    if (matchForDomain) {
      result.filteredIndexForDomain.push(i);
    }

    const matchForRender =
      cpuFilters &&
      cpuFilters.every(filter =>
        isDataMatchFilter(allData[i], filter, i)
      );

    if (matchForRender) {
      result.filteredIndex.push(i);
    }
  }

  return result;
}

/**
 * Get a record of filters based on domain type and gpu / cpu
 * @param {string} dataId
 * @param {Array<Object>} filters
 * @returns {{dynamicDomain: Array, fixedDomain: Array, cpu: Array, gpu: Array}} filterRecord
 */
export function getFilterRecord(dataId, filters) {
  const filterRecord = {
    dynamicDomain: [],
    fixedDomain: [],
    cpu: [],
    gpu: []
  };

  filters.forEach(f => {
    if (f.dataId === dataId && f.fieldIdx > -1 && f.value !== null) {
      (f.fixedDomain
        ? filterRecord.fixedDomain
        : filterRecord.dynamicDomain
      ).push(f);
      (f.gpu ? filterRecord.gpu : filterRecord.cpu).push(f);
    }
  });

  return filterRecord;
}

/**
 * Compare filter records to get what has changed
 * @param {Object} filterRecord
 * @param {Object} oldFilterRecord
 * @returns {{dynamicDomain: Object, fixedDomain: Object, cpu: Object, gpu: Object}} changed filters based on type
 */
export function diffFilters(filterRecord, oldFilterRecord = {}) {
  let filterChanged = {};

  Object.entries(filterRecord).forEach(([record, items]) => {

    items.forEach(filter => {

      const oldFilter = (oldFilterRecord[record] || []).find(
        f => f.id === filter.id
      );

      if (!oldFilter) {
        // added
        filterChanged = set([record, filter.id], 'added', filterChanged);
      } else {
        // check  what has changed
        ['name', 'value'].forEach(prop => {
          if (filter[prop] !== oldFilter[prop]) {
            filterChanged = set(
              [record, filter.id],
              `${prop}_changed`,
              filterChanged
            );
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

  return filterChanged;
}
/**
 * Check if value is in range of filter
 *
 * @param {Array<Array>} data
 * @param {Object} filter
 * @param {Number} i
 * @param {Object} field - containing values to test data against. This is used only when
 * testing timestamp filters
 * @returns {Boolean} - whether value falls in the range of the filter
 */
export function isDataMatchFilter(data, filter, i, field) {
  const val = data[field.tableFieldIndex - 1];
  if (!filter.type) {
    return true;
  }

  switch (filter.type) {
    case FILTER_TYPES.range:
      return isInRange(val, filter.value);

    case FILTER_TYPES.timeRange:
      const timeVal = field && field.filterProps && Array.isArray(field.filterProps.mappedValue)
        ? field.filterProps.mappedValue[i]
        : moment.utc(val).valueOf();

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
 * @param {Array<string> | string | Number | Array<Number>} value
 * @param {Array} filter.domain
 * @param {String} filter.type
 * @returns {*} - adjusted value to match filter or null to remove filter
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

      return value.map((d, i) =>
        notNullorUndefined(d) && isInRange(d, domain) ? d : domain[i]
      );

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
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
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

  const {histogram, enlargedHistogram} = getHistogram(domain, mappedValue);

  return {domain, step, histogram, enlargedHistogram};
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
 * @param {Array<Array>} data
 * @param {Function} valueAccessor
 * @returns {{
 *  domain: Array<Number>,
 *  step: Number,
 *  mappedValue: Array<Number>,
 *  histogram: Array<Object>,
 *  enlargedHistogram: Array<Object>
 * }} timestamp field domain
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
 * @param {Array<Number>} domain
 * @param {Array<Number>} mappedValue
 * @param {Number} bins
 * @returns {Array<{count: Number, x0: Number, x1: number}>} histogram
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
 * @param {Array<Number>} domain
 * @param {Array<Object>} mappedValue
 * @returns {{histogram: Array<Object>, enlargedHistogram: Array<Object>}} 2 sets of histogram
 */
export function getHistogram(domain, mappedValue) {
  const histogram = histogramConstruct(domain, mappedValue, histogramBins);
  const enlargedHistogram = histogramConstruct(
    domain,
    mappedValue,
    enlargedHistogramBins
  );

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

export function isInRange(val, domain) {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
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
 * @param {String} type - filter type
 * @param {*} value - filter value
 * @returns {boolean} whether filter is value
 */
export function isValidFilterValue({type, value}) {
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

    default:
      return true;
  }
}

export function getFilterPlot(filter, allData) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  const {mappedValue} = filter;
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

// /**
//  * Apply a list of filters to a given dataset
//  * @param dataset
//  * @param filters
//  * @return {Object} filtered dataset
//  */
// export function applyFilterToDataset(dataset, filters) {
//   return {
//     ...dataset,
//     ...filterDataByFilterTypes(dataset, filters)
//   };
// }

/**
 *
 * @param datasetIds list of dataset ids to be filtered
 * @param datasets all datasets
 * @param filters all filters to be applied to datasets
 * @return {{[datasetId: string]: Object}} datasets - new updated datasets
 */
export function applyFiltersToDatasets(datasetIds, datasets, filters) {
  const dataIds = Array.isArray(datasetIds) ? datasetIds : [datasetIds];
  return dataIds.reduce((acc, dataIdentifier) => ({
    ...acc,
    [dataIdentifier]: filterDataset(datasets[dataIdentifier], filters)
  }), datasets);
}

/**
 * Applies a new field name value to fielter and update both filter and dataset
 * @param {Object} filter - to be applied the new field name on
 * @param {Object} dataset - dataset the field belongs to
 * @param {string} fieldName - field.name
 * @param {Number} filterDatasetIndex - field.name
 * @param {Object} option
 * @return {Object} {filter, datasets}
 */
export function applyFilterFieldName(
  filter,
  dataset,
  fieldName,
  filterDatasetIndex = 0,
  {mergeDomain = false} = {}
) {

  // using filterDatasetIndex we can filter only the specified dataset
  const {fields, allData} = dataset;

  const fieldIndex = fields.findIndex(f => f.name === fieldName);
  // if no field with same name is found, move to the next datasets
  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {filter: null, dataset};
  }

  const newFilter = {
    ...filter,
    // TODO, since we allow to add multiple fields to a filter we can no longer freeze the filter
    freeze: true
  };

  // TODO: validate field type
  const field = fields[fieldIndex];
  const filterProps = field.hasOwnProperty('filterProps') ? field.filterProps : getFilterProps(allData, field);

  const filterWithProps = {
    ...(mergeDomain ? mergeFilterDomainStep(newFilter, filterProps) : {...newFilter, ...filterProps}),
    name: Object.assign([].concat(filter.name), {[filterDatasetIndex]: field.name}),
    fieldIdx: Object.assign([].concat(filter.fieldIdx), {[filterDatasetIndex]: field.tableFieldIndex - 1})
  };

  const fieldWithFilterProps = {
    ...field,
    filterProps
  };

  const newFields = fields.map((d, i) => (i === fieldIndex ? fieldWithFilterProps : d));

  return {
    filter: filterWithProps,
    dataset: {
      ...dataset,
      fields: newFields
    }
  };
}

/**
 * Merge one filter with other filter prop domain
 * @param filter
 * @param filterProps
 * @param fieldIndex
 * @param datasetIndex
 * @return {*}
 */
/* eslint-disable complexity */
export function mergeFilterDomainStep(filter, filterProps) {
  if (!filter) {
    return null;
  }

  if (!filterProps) {
    return filter;
  }

  if (
    (filter.fieldType && filter.fieldType !== filterProps.fieldType)
    || !filterProps.domain
  ) {
    return filter;
  }

  const combinedDomain = !filter.domain ? filterProps.domain : [
    ...(filter.domain || []),
    ...(filterProps.domain || [])
  ].sort((a, b) => a - b);

  const newFilter = {
    ...filter,
    ...filterProps,
    domain: [
      combinedDomain[0],
      combinedDomain[combinedDomain.length -1]
    ]
  };

  switch (filterProps.fieldType) {
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return {
        ...newFilter,
        domain: unique(combinedDomain).sort()
      };

    case ALL_FIELD_TYPES.timestamp:
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
 * Return filter dataset index from filter.dataId
 * @param dataset
 * @param filter
 * @return {*}
 */
export function getDatasetIndexForFilter(dataset, filter) {
  const {dataId} = filter;
  // dataId is an array
  return Array.isArray(dataId) ? dataId.findIndex(id => id === dataset.id)
    // if not an array check if the current filter.dataid is equal to dataset.id
    : dataId === dataset.id ? 0 : -1;
}

/**
 * Return dataset field index from filter.fieldIdx
 * The index matches the same dataset index for filter.dataId
 * @param dataset
 * @param filter
 * @return {*}
 */
export function getDatasetFieldIndexForFilter(dataset, filter) {
  const datasetIndex = getDatasetIndexForFilter(dataset, filter);
  if (datasetIndex === -1) {
    return datasetIndex;
  }

  const fieldIndex = filter.fieldIdx[datasetIndex];

  return notNullorUndefined(fieldIndex) ? fieldIndex : -1;
}

