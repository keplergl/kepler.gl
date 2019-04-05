import {set} from './utils';
import {MAX_GPU_FILTERS} from 'constants/default-settings';
/**
 * Set gpu mode based on current number of gpu filters exists
 * @param {Object} gpuFilter
 * @param {Array<Object>} filters
 */
export function setFilterGpuMode(gpuFilter, filters) {
  const gpuFilters = filters.filter(
    f => f.dateId === gpuFilter.dataId && f.gpu
  );
  if (gpuFilter.gpu && gpuFilters.length === MAX_GPU_FILTERS) {
    return set(['gpu'], false, gpuFilter);
  }
  return gpuFilter;
}

export function assignGpuChannels(allFilters) {
  return allFilters.reduce((accu, f, index) => {
    let filters = accu;
    if (f.gpu && !Number.isFinite(f.gpuChannel)) {
      f = assignGpuChannel(f, accu);
      filters = set([index], f, accu);
    }
    return filters;
  }, allFilters);
}
/**
 * Assign a new gpu filter a channel based on first availability
 * @param {Object} gpuFilter
 * @param {Array<Object>} filters
 */
export function assignGpuChannel(gpuFilter, filters) {
  const findGpuChannel = channel => f =>
    f.dataId === gpuFilter.dataId && f.gpu && f.gpuChannel === channel;

  let i = 0;

  while (i < MAX_GPU_FILTERS) {
    if (!filters.find(findGpuChannel(i))) {
      return set(['gpuChannel'], i, gpuFilter);
    }
    i++;
  }

  return gpuFilter;
}
/**
 * Edit filter.gpu to ensure that only
 * X number of gpu filers can coexist.
 * @param {Array<Object>} filters
 * @returns {Array<Object>} updated filters
 */
export function resetFilterGpuMode(filters) {
  const gpuPerDataset = {};

  return filters.map(f => {
    if (f.gpu) {
      const count = gpuPerDataset[f.dataId];

      if (count === MAX_GPU_FILTERS) {
        return set(['gpu'], false, f);
      }

      gpuPerDataset[f.dataId] = count ? count + 1 : 1;
    }

    return f;
  }, filters);
}

/**
 * Initial filter uniform
 * @returns {{filter_min: Array<Number>,filter_max: Array<Number>}}
 */
function getEmptyFilterUniform() {
  return {
    filter_min: new Array(MAX_GPU_FILTERS).fill(0),
    filter_max: new Array(MAX_GPU_FILTERS).fill(0)
  };
}

/**
 *
 * @param {Array<Object>} channels
 * @return {Function} getFilterValue
 */
function getFilterValueAccessor(channels) {
  // for empty channel, value is 0 and min max would be [0, 0]
  return d =>
    channels.map(filter =>
      filter
        ? filter.mappedValue
          ? filter.mappedValue[d.index]
          : d.data[filter.fieldIdx]
        : 0
    );
}

/**
 * Get filter properties for gpu filtering
 * @param {Array<Object>} filters
 * @param {string} dataId
 * @returns {{filterUniform: {Object}, filterValueUpdateTriggers: Object, getFilterValue: Function}}
 */
export function getGpuFilterProps(filters, dataId) {
  const filterUniform = getEmptyFilterUniform();
  const triggers = {};

  // array of filter for each channel, undefined, if no filter is assigned to that channel
  const channels = [];

  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    const filter = filters.find(
      f => f.dataId === dataId && f.gpu && f.gpuChannel === i
    );
    filterUniform.filter_min[i] = filter ? filter.value[0] : 0;
    filterUniform.filter_max[i] = filter ? filter.value[1] : 0;

    triggers[i] = filter ? filter.name : null;
    channels.push(filter);
  }

  const getFilterValue = getFilterValueAccessor(channels);

  return {filterUniform, filterValueUpdateTriggers: triggers, getFilterValue};
}
