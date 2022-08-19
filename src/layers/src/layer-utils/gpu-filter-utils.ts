// Copyright (c) 2022 Uber Technologies, Inc.
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
import {MAX_GPU_FILTERS, FILTER_TYPES} from '@kepler.gl/constants';
import {Field, Filter} from '@kepler.gl/types';

import {set, toArray} from '@kepler.gl/utils';
import {notNullorUndefined} from './data-utils';
import {DataContainerInterface} from './table-utils/data-container-interface';
import {GpuFilter} from './table-utils/kepler-table';

/**
 * Set gpu mode based on current number of gpu filters exists
 */
export function setFilterGpuMode(filter: Filter, filters: Filter[]) {
  // filter can be applied to multiple datasets, hence gpu filter mode should also be
  // an array, however, to keep us sane, for now, we only check if there is available channel for every dataId,
  // if all of them has, we set gpu mode to true
  // TODO: refactor filter so we don't keep an array of everything

  filter.dataId.forEach((dataId, datasetIdx) => {
    const gpuFilters = filters.filter(f => f.dataId.includes(dataId) && f.gpu);

    if (filter.gpu && gpuFilters.length === MAX_GPU_FILTERS) {
      return set(['gpu'], false, filter);
    }
  });

  return filter;
}

/**
 * Scan though all filters and assign gpu chanel to gpu filter
 */
export function assignGpuChannels(allFilters: Filter[]) {
  return allFilters.reduce((accu, f, index) => {
    let filters = accu;

    // if gpu is true assign and validate gpu Channel
    if (f.gpu) {
      f = assignGpuChannel(f, accu);
      filters = set([index], f, accu);
    }

    return filters;
  }, allFilters);
}
/**
 * Assign a new gpu filter a channel based on first availability
 */
export function assignGpuChannel(filter: Filter, filters: Filter[]) {
  // find first available channel
  if (!filter.gpu) {
    return filter;
  }

  const gpuChannel = filter.gpuChannel || [];

  filter.dataId.forEach((dataId, datasetIdx) => {
    const findGpuChannel = channel => f => {
      const dataIdx = toArray(f.dataId).indexOf(dataId);
      return (
        f.id !== filter.id && dataIdx > -1 && f.gpu && toArray(f.gpuChannel)[dataIdx] === channel
      );
    };

    if (
      Number.isFinite(gpuChannel[datasetIdx]) &&
      !filters.find(findGpuChannel(gpuChannel[datasetIdx]))
    ) {
      // if value is already assigned and valid
      return;
    }

    let i = 0;

    while (i < MAX_GPU_FILTERS) {
      if (!filters.find(findGpuChannel(i))) {
        gpuChannel[datasetIdx] = i;
        return;
      }
      i++;
    }
  });

  // if cannot find channel for all dataid, set gpu back to false
  // TODO: refactor filter to handle same filter different gpu mode
  if (!gpuChannel.length || !gpuChannel.every(Number.isFinite)) {
    return {
      ...filter,
      gpu: false
    };
  }

  return {
    ...filter,
    gpuChannel
  };
}
/**
 * Edit filter.gpu to ensure that only
 * X number of gpu filers can coexist.
 */
export function resetFilterGpuMode(filters: Filter[]): Filter[] {
  const gpuPerDataset = {};

  return filters.map((f, i) => {
    if (f.gpu) {
      let gpu = true;
      toArray(f.dataId).forEach(dataId => {
        const count = gpuPerDataset[dataId];

        if (count === MAX_GPU_FILTERS) {
          gpu = false;
        } else {
          gpuPerDataset[dataId] = count ? count + 1 : 1;
        }
      });

      if (!gpu) {
        return set(['gpu'], false, f);
      }
    }

    return f;
  });
}

/**
 * Initial filter uniform
 */
function getEmptyFilterRange() {
  return new Array(MAX_GPU_FILTERS).fill(0).map(d => [0, 0]);
}

/**
 * Returns index of the data element.
 * @param {any} d Data element with row index info.
 * @returns number
 */
const defaultGetIndex = d => d.index;

/**
 * Returns value at the specified row from the data container.
 * @param dc Data container.
 * @param d Data element with row index info.
 * @param fieldIndex Column index in the data container.
 * @returns
 */
const defaultGetData = (dc: DataContainerInterface, d: any, fieldIndex: number) => {
  return dc.valueAt(d.index, fieldIndex);
};

/**
 * @param channels
 * @param dataId
 * @param fields
 * @return {Function} getFilterValue
 */
const getFilterValueAccessor = (
  channels: (Filter | undefined)[],
  dataId: string,
  fields: any[]
) => (dc: DataContainerInterface) => (getIndex = defaultGetIndex, getData = defaultGetData) => d =>
  // for empty channel, value is 0 and min max would be [0, 0]
  channels.map(filter => {
    if (!filter) {
      return 0;
    }
    const fieldIndex = getDatasetFieldIndexForFilter(dataId, filter);
    const field = fields[fieldIndex];

    const value =
      filter.type === FILTER_TYPES.timeRange
        ? field.filterProps && Array.isArray(field.filterProps.mappedValue)
          ? field.filterProps.mappedValue[getIndex(d)]
          : moment.utc(getData(dc, d, fieldIndex)).valueOf()
        : getData(dc, d, fieldIndex);

    return notNullorUndefined(value) ? value - filter.domain?.[0] : Number.MIN_SAFE_INTEGER;
  });

/**
 * Get filter properties for gpu filtering
 */
export function getGpuFilterProps(filters: Filter[], dataId: string, fields: Field[]): GpuFilter {
  const filterRange = getEmptyFilterRange();
  const triggers = {};

  // array of filter for each channel, undefined, if no filter is assigned to that channel
  const channels: (Filter | undefined)[] = [];

  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    const filter = filters.find(
      f =>
        f.gpu &&
        f.dataId.includes(dataId) &&
        f.gpuChannel &&
        f.gpuChannel[f.dataId.indexOf(dataId)] === i
    );

    filterRange[i][0] = filter ? filter.value[0] - filter.domain?.[0] : 0;
    filterRange[i][1] = filter ? filter.value[1] - filter.domain?.[0] : 0;

    triggers[`gpuFilter_${i}`] = filter ? filter.name[filter.dataId.indexOf(dataId)] : null;
    channels.push(filter);
  }

  const filterValueAccessor = getFilterValueAccessor(channels, dataId, fields);

  return {
    filterRange,
    filterValueUpdateTriggers: triggers,
    // @ts-expect-error
    filterValueAccessor
  };
}

/**
 * Return dataset field index from filter.fieldIdx
 * The index matches the same dataset index for filter.dataId
 */
export function getDatasetFieldIndexForFilter(dataId: string, filter: Filter): number {
  const datasetIndex = toArray(filter.dataId).indexOf(dataId);
  if (datasetIndex < 0) {
    return -1;
  }

  const fieldIndex = filter.fieldIdx[datasetIndex];

  return notNullorUndefined(fieldIndex) ? fieldIndex : -1;
}
