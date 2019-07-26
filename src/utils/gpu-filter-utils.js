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

import {set} from './utils';
import {MAX_GPU_FILTERS} from 'constants/default-settings';
import {notNullorUndefined} from './data-utils';
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
 * @returns {{filterMin: Array<Number>,filterMax: Array<Number>}}
 */
function getEmptyFilterRange() {
  return {
    filterMin: new Array(MAX_GPU_FILTERS).fill(0),
    filterMax: new Array(MAX_GPU_FILTERS).fill(0)
  };
}

// By default filterValueAccessor expect each datum to be formated as {index, data}
// data is the row in allData, and index is its index in allData
const defaultGetIndex = d => d.index;
const defaultGetData = d => d.data;

/**
 *
 * @param {Array<Object>} channels
 * @return {Function} getFilterValue
 */
const getFilterValueAccessor = channels => (
  getIndex = defaultGetIndex,
  getData = defaultGetData
) => d =>
  // for empty channel, value is 0 and min max would be [0, 0]
  channels.map(filter => {
    if (!filter) {
      return 0;
    }
    const value = filter.mappedValue ?
      filter.mappedValue[getIndex(d)] :
      getData(d)[filter.fieldIdx];

    return notNullorUndefined(value) ? value : Number.MIN_SAFE_INTEGER;
  });

/**
 * Get filter properties for gpu filtering
 * @param {Array<Object>} filters
 * @param {string} dataId
 * @returns {{filterRange: {Object}, filterValueUpdateTriggers: Object, getFilterValue: Function}}
 */
export function getGpuFilterProps(filters, dataId) {
  const filterRange = getEmptyFilterRange();
  const triggers = {};

  // array of filter for each channel, undefined, if no filter is assigned to that channel
  const channels = [];

  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    const filter = filters.find(
      f => f.dataId === dataId && f.gpu && f.gpuChannel === i
    );
    filterRange.filterMin[i] = filter ? filter.value[0] : 0;
    filterRange.filterMax[i] = filter ? filter.value[1] : 0;

    triggers[i] = filter ? filter.name : null;
    channels.push(filter);
  }

  const filterValueAccessor = getFilterValueAccessor(channels);

  return {
    filterRange,
    filterValueUpdateTriggers: triggers,
    filterValueAccessor
  };
}
