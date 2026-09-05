// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import moment from 'moment';
import {MAX_GPU_FILTERS, FILTER_TYPES} from '@kepler.gl/constants';
import {Field, Filter, TimeRangeFilter} from '@kepler.gl/types';
import {set, DataContainerInterface, isTimeIntervalFilter} from '@kepler.gl/utils';
import {toArray, notNullorUndefined} from '@kepler.gl/common-utils';

import {GpuFilter} from './kepler-table';

type GpuFilterRole = 'value' | 'start' | 'end';
type GpuChannelBinding = {filter: Filter; role: GpuFilterRole};

/**
 * Interval time filters occupy two GPU channels (start <= windowEnd AND end >= windowStart).
 */
export function getFilterGpuChannelCount(filter: Filter, datasetIdx = 0): number {
  return isTimeIntervalFilter(filter, datasetIdx) ? 2 : 1;
}

function isGpuChannelTaken(
  filters: Filter[],
  dataId: string,
  channel: number,
  excludeFilterId?: string
): boolean {
  return filters.some(f => {
    if (f.id === excludeFilterId || !f.gpu) {
      return false;
    }
    const dataIdx = toArray(f.dataId).indexOf(dataId);
    if (dataIdx < 0) {
      return false;
    }
    return (
      toArray(f.gpuChannel)[dataIdx] === channel || toArray(f.gpuEndChannel)[dataIdx] === channel
    );
  });
}

function findFreeGpuChannel(
  filters: Filter[],
  dataId: string,
  excludeFilterId: string,
  occupiedBySelf: number[] = []
): number | undefined {
  let i = 0;
  while (i < MAX_GPU_FILTERS) {
    if (!occupiedBySelf.includes(i) && !isGpuChannelTaken(filters, dataId, i, excludeFilterId)) {
      return i;
    }
    i++;
  }
  return undefined;
}

/**
 * Set gpu mode based on current number of gpu filter channels in use
 */
export function setFilterGpuMode(filter: Filter, filters: Filter[]) {
  // filter can be applied to multiple datasets, hence gpu filter mode should also be
  // an array, however, to keep us sane, for now, we only check if there is available channel for every dataId,
  // if all of them has, we set gpu mode to true
  // TODO: refactor filter so we don't keep an array of everything

  let next = filter;
  next.dataId.forEach((dataId, datasetIdx) => {
    let used = 0;
    filters.forEach(f => {
      if (f.id === next.id || !f.gpu || !toArray(f.dataId).includes(dataId)) {
        return;
      }
      const idx = toArray(f.dataId).indexOf(dataId);
      used += getFilterGpuChannelCount(f, idx);
    });

    if (next.gpu && used + getFilterGpuChannelCount(next, datasetIdx) > MAX_GPU_FILTERS) {
      next = set(['gpu'], false, next);
    }
  });

  return next;
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
 * Assign a new gpu filter a channel based on first availability.
 * Interval time filters receive a second channel for the end timestamp.
 */
export function assignGpuChannel(filter: Filter, filters: Filter[]) {
  // find first available channel
  if (!filter.gpu) {
    return filter;
  }

  const gpuChannel = [...(filter.gpuChannel || [])];
  const gpuEndChannel = [...(filter.gpuEndChannel || [])];
  let assignedAll = true;

  filter.dataId.forEach((dataId, datasetIdx) => {
    const needsEnd = isTimeIntervalFilter(filter, datasetIdx);
    const occupiedBySelf: number[] = [];

    const currentStart = gpuChannel[datasetIdx];
    if (
      Number.isFinite(currentStart) &&
      !isGpuChannelTaken(filters, dataId, currentStart, filter.id)
    ) {
      occupiedBySelf.push(currentStart);
    } else {
      const nextChannel = findFreeGpuChannel(filters, dataId, filter.id, occupiedBySelf);
      if (Number.isFinite(nextChannel)) {
        gpuChannel[datasetIdx] = nextChannel as number;
        occupiedBySelf.push(nextChannel as number);
      } else {
        assignedAll = false;
      }
    }

    if (needsEnd) {
      const currentEnd = gpuEndChannel[datasetIdx];
      if (
        Number.isFinite(currentEnd) &&
        currentEnd !== gpuChannel[datasetIdx] &&
        !isGpuChannelTaken(filters, dataId, currentEnd, filter.id)
      ) {
        occupiedBySelf.push(currentEnd);
      } else {
        const nextEnd = findFreeGpuChannel(filters, dataId, filter.id, occupiedBySelf);
        if (Number.isFinite(nextEnd)) {
          gpuEndChannel[datasetIdx] = nextEnd as number;
        } else {
          assignedAll = false;
        }
      }
    } else {
      gpuEndChannel[datasetIdx] = undefined as unknown as number;
    }
  });

  // if cannot find channel for all dataid, set gpu back to false
  // TODO: refactor filter to handle same filter different gpu mode
  if (!assignedAll || !gpuChannel.length || !gpuChannel.every(Number.isFinite)) {
    return {
      ...filter,
      gpu: false
    };
  }

  const next: Filter = {
    ...filter,
    gpuChannel
  };

  if (filter.dataId.some((_, idx) => isTimeIntervalFilter(filter, idx))) {
    next.gpuEndChannel = gpuEndChannel;
  } else {
    delete next.gpuEndChannel;
  }

  return next;
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
      toArray(f.dataId).forEach((dataId, datasetIdx) => {
        const count = gpuPerDataset[dataId] || 0;
        const needed = getFilterGpuChannelCount(f, datasetIdx);

        if (count + needed > MAX_GPU_FILTERS) {
          gpu = false;
        } else {
          gpuPerDataset[dataId] = count + needed;
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

function getGpuFilterRange(filter: Filter, role: GpuFilterRole): [number, number] {
  const domain0 = filter.domain?.[0] ?? 0;
  const domain1 = filter.domain?.[1] ?? 0;
  const [v0, v1] = filter.value;
  switch (role) {
    case 'start':
      // start <= windowEnd (and start >= domain min)
      return [0, v1 - domain0];
    case 'end':
      // end >= windowStart (and end <= domain max)
      return [v0 - domain0, domain1 - domain0];
    default:
      return [v0 - domain0, v1 - domain0];
  }
}

function findGpuChannelBinding(
  filters: Filter[],
  dataId: string,
  channel: number
): GpuChannelBinding | undefined {
  for (const filter of filters) {
    if (!filter.gpu || !filter.dataId.includes(dataId)) {
      continue;
    }
    const datasetIdx = filter.dataId.indexOf(dataId);
    if (filter.gpuChannel && filter.gpuChannel[datasetIdx] === channel) {
      return {
        filter,
        role: isTimeIntervalFilter(filter, datasetIdx) ? 'start' : 'value'
      };
    }
    if (filter.gpuEndChannel && filter.gpuEndChannel[datasetIdx] === channel) {
      return {filter, role: 'end'};
    }
  }
  return undefined;
}

const getFilterValueAccessor =
  (channels: (GpuChannelBinding | undefined)[], dataId: string, fields: any[]) =>
  (dc: DataContainerInterface) =>
  (
    getIndex = defaultGetIndex,
    getData?: (dc: DataContainerInterface, d: any, fieldIndex: number) => any
  ) =>
  (d, objectInfo?: {index: number}) => {
    // for empty channel, value is 0 and min max would be [0, 0]
    const channelValues = channels.map(binding => {
      if (!binding) {
        return 0;
      }
      const {filter, role} = binding;
      const fieldIndex =
        role === 'end'
          ? getDatasetEndFieldIndexForFilter(dataId, filter)
          : getDatasetFieldIndexForFilter(dataId, filter);
      const field = fields[fieldIndex];

      let value;
      // d can be undefined when called from attribute updater from deck,
      // when data is an ArrowTable, so use objectInfo instead.
      const datum = d || objectInfo;
      // field.valueAccessor is Number() for Int64 columns; valueAt stays raw BigInt.
      const data = getData ? getData(dc, datum, fieldIndex) : field.valueAccessor(datum);
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

      if (!notNullorUndefined(value)) {
        // Null end timestamps mean "still active": map to domain max so end >= windowStart always holds.
        if (role === 'end') {
          return (filter.domain?.[1] ?? 0) - (filter.domain?.[0] ?? 0);
        }
        return Number.MIN_SAFE_INTEGER;
      }

      return Array.isArray(value)
        ? value.map(v => v - filter.domain?.[0])
        : value - filter.domain?.[0];
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
  const channels: (GpuChannelBinding | undefined)[] = [];

  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    const binding = findGpuChannelBinding(filters, dataId, i);
    const filter = binding?.filter;

    if (filter && binding) {
      const range = getGpuFilterRange(filter, binding.role);
      filterRange[i][0] = range[0];
      filterRange[i][1] = range[1];
    } else {
      filterRange[i][0] = 0;
      filterRange[i][1] = 0;
    }
    const oldFilterTrigger = oldGpuFilter?.filterValueUpdateTriggers?.[`gpuFilter_${i}`] || null;

    const datasetIdx = filter ? filter.dataId.indexOf(dataId) : -1;
    const trigger = filter
      ? {
          name:
            binding?.role === 'end'
              ? toArray((filter as TimeRangeFilter).endName)[datasetIdx]
              : filter.name[datasetIdx],
          domain0: filter.domain?.[0]
        }
      : null;
    // don't create a new object, cause deck.gl use shallow compare
    triggers[`gpuFilter_${i}`] = isFilterTriggerEqual(trigger, oldFilterTrigger)
      ? oldFilterTrigger
      : trigger;
    channels.push(binding);
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

/**
 * Return dataset field index from filter.endFieldIdx for interval time filters.
 */
export function getDatasetEndFieldIndexForFilter(dataId: string, filter: Filter): number {
  const datasetIndex = toArray(filter.dataId).indexOf(dataId);
  if (datasetIndex < 0) {
    return -1;
  }

  const fieldIndex = toArray((filter as TimeRangeFilter).endFieldIdx)[datasetIndex];

  return notNullorUndefined(fieldIndex) ? fieldIndex : -1;
}
