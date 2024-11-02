// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import moment from 'moment';
import {MAX_GPU_FILTERS, FILTER_TYPES} from '@kepler.gl/constants';
import {Field, Filter} from '@kepler.gl/types';

import {set, toArray, notNullorUndefined, DataContainerInterface} from '@kepler.gl/utils';
import {GpuFilter} from './kepler-table';

/**
 * Set gpu mode based on current number of gpu filters exists
 */
export function setFilterGpuMode(filter: Filter, filters: Filter[]) {
  // filter can be applied to multiple datasets, hence gpu filter mode should also be
  // an array, however, to keep us sane, for now, we only check if there is available channel for every dataId,
  // if all of them has, we set gpu mode to true
  // TODO: refactor filter so we don't keep an array of everything

  filter.dataId.forEach(dataId => {
    const gpuFilters = filters.filter(f => f.dataId.includes(dataId) && f.gpu);

    if (filter.gpu && gpuFilters.length === MAX_GPU_FILTERS) {
      set(['gpu'], false, filter);
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

  return filters.map(f => {
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
  return new Array(MAX_GPU_FILTERS).fill(0).map(() => [0, 0]);
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

const getFilterValueAccessor =
  (channels: (Filter | undefined)[], dataId: string, fields: any[]) =>
  (dc: DataContainerInterface) =>
  (getIndex = defaultGetIndex, getData = defaultGetData) =>
  (d, objectInfo?: {index: number}) => {
    // for empty channel, value is 0 and min max would be [0, 0]
    const channelValues = channels.map(filter => {
      if (!filter) {
        return 0;
      }
      const fieldIndex = getDatasetFieldIndexForFilter(dataId, filter);
      const field = fields[fieldIndex];

      let value;
      // d can be undefined when called from attribute updater from deck,
      // when data is an ArrowTable, so use objectInfo instead.
      const data = getData(dc, d || objectInfo, fieldIndex);
      if (typeof data === 'function') {
        value = data(field);
      } else {
        value =
          filter.type === FILTER_TYPES.timeRange
            ? field.filterProps && Array.isArray(field.filterProps.mappedValue)
              ? field.filterProps.mappedValue[getIndex(d)]
              : moment.utc(data).valueOf()
            : data;
      }

      return notNullorUndefined(value)
        ? Array.isArray(value)
          ? value.map(v => v - filter.domain?.[0])
          : value - filter.domain?.[0]
        : Number.MIN_SAFE_INTEGER;
    });

    // TODO: can we refactor the above to avoid the transformation below?
    const arrChannel = channelValues.find(v => Array.isArray(v));
    if (Array.isArray(arrChannel)) {
      // Convert info form supported by DataFilterExtension (relevant for TripLayer)
      const vals: number[][] = [];
      // if there are multiple arrays, they should have the same length
      for (let i = 0; i < arrChannel.length; i++) {
        vals.push(channelValues.map(v => (Array.isArray(v) ? v[i] : v)));
      }
      return vals;
    }

    return channelValues;
  };

function isFilterTriggerEqual(a, b) {
  return a === b || (a?.name === b?.name && a?.domain0 === b?.domain0);
}

/**
 * Get filter properties for gpu filtering
 */
export function getGpuFilterProps(
  filters: Filter[],
  dataId: string,
  fields: Field[],
  oldGpuFilter?: GpuFilter
): GpuFilter {
  const filterRange = getEmptyFilterRange();
  const triggers: GpuFilter['filterValueUpdateTriggers'] = {};

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
    const oldFilterTrigger = oldGpuFilter?.filterValueUpdateTriggers?.[`gpuFilter_${i}`] || null;

    const trigger = filter
      ? {
          name: filter.name[filter.dataId.indexOf(dataId)],
          domain0: filter.domain?.[0]
        }
      : null;
    // don't create a new object, cause deck.gl use shallow compare
    triggers[`gpuFilter_${i}`] = isFilterTriggerEqual(trigger, oldFilterTrigger)
      ? oldFilterTrigger
      : trigger;
    channels.push(filter);
  }

  const filterValueAccessor = getFilterValueAccessor(channels, dataId, fields);

  return {
    filterRange,
    filterValueUpdateTriggers: triggers,
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
