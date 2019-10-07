// Copyright (c) 2019 Uber Technologies, Inc.
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
import {generateHashId} from './utils';

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
  name: null,
  type: null,
  fieldIdx: [], // [integer]
  domain: null,
  value: null,

  // plot
  plotType: PLOT_TYPES.histogram,
  yAxis: null,
  interval: null
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
export function validateFilter(filter, datasetId) {
  const valid = Boolean(filter.dataId)
    // datasetId is contained in dataId
    && (
      // filter.dataId is an array
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
  const {fields, allData} = dataset;

  // match filter.name to field.name
  const fieldIndex = fields.findIndex(({name}) => name === filter.name);

  const field = fields[fieldIndex];

  const filterDatasetIndex = Array.isArray(filter.dataId) ? getDatasetIndexForFilter(dataset, filter) : 0;

  if (filterDatasetIndex === -1) {
    // the current filter is not mapped against the current dataset
    return null;
  }

  // update fieldIdx with the current value
  const newFieldIdx = [
    ...(Array.isArray(filter.fieldIdx) ? filter.fieldIdx : [filter.fieldIdx])
  ];

  newFieldIdx[filterDatasetIndex] = fieldIndex;

  // return filter type, default value, fieldType and fieldDomain from field
  const filterPropsFromField = getFilterProps(allData, field);

  let matchedFilter = {
    ...getDefaultFilter(filter.dataId),
    ...filter,
    ...filterPropsFromField,
    freeze: true,
    fieldIdx: newFieldIdx
  };

  const {yAxis} = matchedFilter;
  if (yAxis) {
    const matcheAxis = fields.find(
      ({name, type}) => name === yAxis.name && type === yAxis.type
    );

    matchedFilter = matcheAxis
      ? {
        ...matchedFilter,
        yAxis: matcheAxis,
        ...getFilterPlot({...matchedFilter, yAxis: matcheAxis}, allData)
      }
      : matchedFilter;
  }

  matchedFilter.value = adjustValueToFilterDomain(filter.value, matchedFilter);

  if (matchedFilter.value === null) {
    // cannot adjust saved value to filter
    return null;
  }

  return matchedFilter;
}

/**
 * Get default filter prop based on field type
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} default filter
 */
export function getFilterProps(data, field) {
  const filterProp = {
    ...getFieldDomain(data, field),
    fieldType: field.type
  };

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return {
        ...filterProp,
        value: filterProp.domain,
        type: FILTER_TYPES.range,
        typeOptions: [FILTER_TYPES.range]
      };

    case ALL_FIELD_TYPES.boolean:
      return {
        ...filterProp,
        type: FILTER_TYPES.select,
        value: true
      };

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return {
        ...filterProp,
        type: FILTER_TYPES.multiSelect,
        value: []
      };

    case ALL_FIELD_TYPES.timestamp:
      return {
        ...filterProp,
        type: FILTER_TYPES.timeRange,
        enlarged: true,
        fixedDomain: true,
        value: filterProp.domain
      };

    default:
      return {};
  }
}

/**
 * Calculate field domain based on field type and data
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} with domain as key
 */
export function getFieldDomain(data, field) {
  const fieldIdx = field.tableFieldIndex - 1;
  const isTime = field.type === ALL_FIELD_TYPES.timestamp;
  const valueAccessor = maybeToDate.bind(null, isTime, fieldIdx, field.format);
  let domain;

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      // calculate domain and step
      return getNumericFieldDomain(data, valueAccessor);

    case ALL_FIELD_TYPES.boolean:
      return {domain: [true, false]};

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      domain = ScaleUtils.getOrdinalDomain(data, valueAccessor);
      return {domain};

    case ALL_FIELD_TYPES.timestamp:
      return getTimestampFieldDomain(data, valueAccessor);

    default:
      return {domain: ScaleUtils.getOrdinalDomain(data, valueAccessor)};
  }
}

/**
 * Filter data based on an array of filters
 * @param {Object} dataset to perform the filter on
 * @param {Object[]} filters list of filters to use against dataset
 */
export function filterData(dataset, filters) {
  const {allData: data, fields} = dataset;

  if (!filters.length) {
    const defaultValues = data.map((d, i) => i);
    return {data, filteredIndex: defaultValues, filteredIndexForDomain: defaultValues};
  }

  const appliedFilters = filters.filter(d => validateFilter(d, dataset.id));

  // Map filter against current dataset field
  const filtersToFields = filters.reduce((acc, filter) => {
    const fieldIndex = getDatasetFieldIndexForFilter(dataset, filter);

    return {
      ...acc,
      ...(fieldIndex !== -1 ? {[filter.id]: fields[fieldIndex]} : {})
    }
  }, {
    // [filterId]: field
  });

  const {dynamicDomainFilters, fixedDomainFilters} = appliedFilters.reduce(
    (accu, f) => {
      return {
        ...accu,
        ...(f.fixedDomain ? {
          fixedDomainFilters: [
            ...accu.fixedDomainFilters,
            f
          ]
        } : {
          dynamicDomainFilters: [
            ...accu.dynamicDomainFilters,
            f
          ]
        })
      };
    },
    {dynamicDomainFilters: [], fixedDomainFilters: []}
  );

  const {filtered, filteredIndex, filteredIndexForDomain} = data.reduce(
    (accu, d, i) => {
      // generate 2 sets of
      // filter data used to calculate layer Domain
      const matchForDomain = dynamicDomainFilters.every(filter => {
        return isDataMatchFilter(d, filter, i, filtersToFields[filter.id]);
      });

      if (matchForDomain) {
        accu.filteredIndexForDomain.push(i);

        // filter data for render
        const matchForRender = fixedDomainFilters.every(filter =>
          isDataMatchFilter(d, filter, i, filtersToFields[filter.id])
        );

        if (matchForRender) {
          accu.filtered.push(d);
          accu.filteredIndex.push(i);
        }
      }

      return accu;
    },
    {filtered: [], filteredIndex: [], filteredIndexForDomain: []}
  );

  return {data: filtered, filteredIndex, filteredIndexForDomain};
}

/**
 * Check if value is in range of filter
 *
 * @param {Object[]} data
 * @param {Object} filter
 * @param {number} i
 * @param {field} field containing values to test data against. This is used only when
 * testing timestamp filters
 * @returns {Boolean} - whether value falls in the range of the filter
 */
export function isDataMatchFilter(data, filter, i, field) {
  const val = data[filter.fieldIdx];
  if (!filter.type) {
    return true;
  }

  switch (filter.type) {
    case FILTER_TYPES.range:
      return isInRange(val, filter.value);

    case FILTER_TYPES.timeRange:
      const timeVal = field && field.filterProp && field.filterProp.mappedValue
        ? field.filterProp.mappedValue[i]
        : moment.utc(data[field.tableFieldIndex - 1]).valueOf();

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
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
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
 * @param {number[]} domain
 * @param {Object[]} mappedValue
 * @returns {Array[]} histogram
 */
function getHistogram(domain, mappedValue) {
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
 * @param {number} val
 * @param {number} step
 * @param {string} bound
 * @returns {number} rounded number
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

/**
 *
 * @param datasetIds list of dataset ids
 * @param datasets
 * @param filters
 * @return {{[p: string]: *}}
 */
export function applyFiltersToDatasets(datasetIds, datasets, filters) {
  const dataIds = Array.isArray(datasetIds) ? datasetIds : [datasetIds];
  return dataIds.reduce((acc, dataIdentifier) => ({
    ...acc,
    [dataIdentifier]: {
      ...datasets[dataIdentifier],
      ...filterData(datasets[dataIdentifier], filters)
    }
  }), datasets);
}

/**
 * Applies a new field name value to fielter and update both filter and dataset
 * @param filter to be applied the new field name on
 * @param datasets
 * @param fieldName
 * @return {object} {filter, datasets}
 */
export function applyFilterFieldName(filter, datasets, fieldName) {
  const {dataId} = filter;
  if (!dataId || !dataId.length) {
    return filter;
  }

  return dataId.reduce((acc, dataIdentifier) => {
    const {fields, allData} = datasets[dataIdentifier];

    // TODO: Next PR for UI filter name will only update filter name but it won't have side effects
    // we are gonna use pair of datasets and fieldIdx to update the filter
    const fieldIndex = fields.findIndex(f => f.name === fieldName);

    // if no field with same name is found, move to the next datasets
    if (fieldIndex === -1) {
      throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    }

    // TODO: validate field type
    const field = fields[fieldIndex];
    const filterProps = getFilterProps(allData, field);
    const filterDatasetIndex = getDatasetIndexForFilter(datasets[dataIdentifier], filter);

    const newFieldIdx = [
      ...acc.filter.fieldIdx
    ];

    newFieldIdx[filterDatasetIndex] = fieldIndex;

    const filterWithProps = {
      ...mergeFilterProps(acc.filter, filterProps),
      fieldIdx: newFieldIdx
    };

    const fieldWithFilterProps = {
      ...field,
      filterProp: filterProps
    };

    const newFields = fields.map((d, i) => (i === fieldIndex ? fieldWithFilterProps : d));

    const newDatasets = {
      ...acc.datasets,
      [dataIdentifier]: {
        ...datasets[dataIdentifier],
        fields: newFields
      }
    };

    return {
      ...acc,
      filter: filterWithProps,
      datasets: newDatasets
    };
  }, {
    filter:{
      ...filter,
      freeze: true
    },
    datasets
  });
}

/**
 * Merge one filter with other filter prop domain
 * @param filter
 * @param filterProps
 * @return {*}
 */
export function mergeFilterProps(filter, filterProps) {
  if (!filter) {
    return filterProps;
  }

  if (filter.fieldType && filter.fieldType !== filterProps.fieldType) {
    return filter;
  }

  const newFilter = {
    ...filter,
    ...filterProps
  };

  const combinedDomain = [
    ...(filter.domain || []),
    ...filterProps.domain
  ].sort((a, b) => a - b);

  switch (filterProps.fieldType) {
    // do nothing since it's always the same
    // case ALL_FIELD_TYPES.boolean:
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
        step,
        domain: [
          combinedDomain[0],
          combinedDomain[combinedDomain.length -1]
        ]
      };
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    default:
      return {
        ...newFilter,
        domain: [
          combinedDomain[0],
          combinedDomain[combinedDomain.length -1]
        ]
      };
  }
}

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

