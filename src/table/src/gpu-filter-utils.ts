// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import moment from 'moment';
import {MAX_GPU_FILTERS, FILTER_TYPES} from '@kepler.gl/constants';
import {Field, Filter, TimeRangeFilter} from '@kepler.gl/types';
import {set, DataContainerInterface, isTimeIntervalFilter} from '@kepler.gl/utils';
import {toArray, notNullorUndefined} from '@kepler.gl/common-utils';

import {GpuFilter} from './kepler-table';

/**
 * Interval time filters occupy two GPU channels (start <= windowEnd AND end >= windowStart).
 * All other GPU filters still occupy one.
 */
function getFilterGpuChannelCount(filter: Filter, datasetIdx = 0): number {
  return isTimeIntervalFilter(filter, datasetIdx) ? 2 : 1;
}

function channelOccupiedByFilter(f: Filter, dataId: string, channel: number): boolean {
  const dataIdx = toArray(f.dataId).indexOf(dataId);
  if (dataIdx < 0 || !f.gpu) {
    return false;
  }
  return (
    toArray(f.gpuChannel)[dataIdx] === channel || toArray(f.gpuEndChannel)[dataIdx] === channel
  );
}

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
    const findGpuChannel = channel => f =>
      f.id !== filter.id && channelOccupiedByFilter(f, dataId, channel);

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

  const next: Filter = {
    ...filter,
    gpuChannel
  };

  if (!filter.dataId.some((_, idx) => isTimeIntervalFilter(filter, idx))) {
    delete next.gpuEndChannel;
    return next;
  }

  const withEnd = assignGpuEndChannel(next, filters);
  if (!withEnd.gpu) {
    return {
      ...filter,
      gpu: false
    };
  }
  return withEnd;
}

/**
 * Reserve a second GPU channel for the end timestamp of an interval time filter.
 */
function assignGpuEndChannel(filter: Filter, filters: Filter[]): Filter {
  const gpuEndChannel = [...(filter.gpuEndChannel || [])];

  filter.dataId.forEach((dataId, datasetIdx) => {
    if (!isTimeIntervalFilter(filter, datasetIdx)) {
      return;
    }

    const startChannel = toArray(filter.gpuChannel)[datasetIdx];
    const findGpuChannel = channel => f =>
      f.id !== filter.id && channelOccupiedByFilter(f, dataId, channel);

    if (
      Number.isFinite(gpuEndChannel[datasetIdx]) &&
      gpuEndChannel[datasetIdx] !== startChannel &&
      !filters.find(findGpuChannel(gpuEndChannel[datasetIdx]))
    ) {
      return;
    }

    let i = 0;
    while (i < MAX_GPU_FILTERS) {
      if (i !== startChannel && !filters.find(findGpuChannel(i))) {
        gpuEndChannel[datasetIdx] = i;
        return;
      }
      i++;
    }

    gpuEndChannel[datasetIdx] = undefined as unknown as number;
  });

  const assignedAll = filter.dataId.every(
    (_, idx) => !isTimeIntervalFilter(filter, idx) || Number.isFinite(gpuEndChannel[idx])
  );

  if (!assignedAll) {
    return {
      ...filter,
      gpu: false
    };
  }

  return {
    ...filter,
    gpuEndChannel
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
      toArray(f.dataId).forEach((dataId, datasetIdx) => {
        const count = gpuPerDataset[dataId];
        const needed = getFilterGpuChannelCount(f, datasetIdx);

        if ((count || 0) + needed > MAX_GPU_FILTERS) {
          gpu = false;
        } else {
          gpuPerDataset[dataId] = (count || 0) + needed;
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

function isEndGpuChannel(filter: Filter, dataId: string, channelIndex: number): boolean {
  const datasetIdx = toArray(filter.dataId).indexOf(dataId);
  return datasetIdx > -1 && toArray(filter.gpuEndChannel)[datasetIdx] === channelIndex;
}

const getFilterValueAccessor =
  (channels: (Filter | undefined)[], dataId: string, fields: any[]) =>
  (dc: DataContainerInterface) =>
  (
    getIndex = defaultGetIndex,
    getData?: (dc: DataContainerInterface, d: any, fieldIndex: number) => any
  ) =>
  (d, objectInfo?: {index: number}) => {
    // for empty channel, value is 0 and min max would be [0, 0]
    const channelValues = channels.map((filter, channelIndex) => {
      if (!filter) {
        return 0;
      }
      const useEndField = isEndGpuChannel(filter, dataId, channelIndex);
      const fieldIndex = useEndField
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
        if (useEndField) {
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

function findFilterOnGpuChannel(
  filters: Filter[],
  dataId: string,
  channel: number
): Filter | undefined {
  return filters.find(
    f =>
      f.gpu &&
      f.dataId.includes(dataId) &&
      f.gpuChannel &&
      f.gpuChannel[f.dataId.indexOf(dataId)] === channel
  );
}

function findFilterOnGpuEndChannel(
  filters: Filter[],
  dataId: string,
  channel: number
): Filter | undefined {
  return filters.find(
    f =>
      f.gpu &&
      f.dataId.includes(dataId) &&
      f.gpuEndChannel &&
      f.gpuEndChannel[f.dataId.indexOf(dataId)] === channel
  );
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
    const filter = findFilterOnGpuChannel(filters, dataId, i);
    const endFilter = filter ? undefined : findFilterOnGpuEndChannel(filters, dataId, i);
    const assigned = filter || endFilter;
    const datasetIdx = assigned ? assigned.dataId.indexOf(dataId) : -1;
    const isIntervalStart = Boolean(
      filter && datasetIdx > -1 && isTimeIntervalFilter(filter, datasetIdx)
    );

    if (endFilter) {
      filterRange[i][0] = endFilter.value[0] - endFilter.domain?.[0];
      filterRange[i][1] = endFilter.domain?.[1] - endFilter.domain?.[0];
    } else if (isIntervalStart && filter) {
      // start <= windowEnd
      filterRange[i][0] = 0;
      filterRange[i][1] = filter.value[1] - filter.domain?.[0];
    } else {
      filterRange[i][0] = filter ? filter.value[0] - filter.domain?.[0] : 0;
      filterRange[i][1] = filter ? filter.value[1] - filter.domain?.[0] : 0;
    }

    const oldFilterTrigger = oldGpuFilter?.filterValueUpdateTriggers?.[`gpuFilter_${i}`] || null;

    const trigger = assigned
      ? {
          name: endFilter
            ? toArray((endFilter as TimeRangeFilter).endName)[datasetIdx]
            : assigned.name[datasetIdx],
          domain0: assigned.domain?.[0]
        }
      : null;
    // don't create a new object, cause deck.gl use shallow compare
    triggers[`gpuFilter_${i}`] = isFilterTriggerEqual(trigger, oldFilterTrigger)
      ? oldFilterTrigger
      : trigger;
    channels.push(assigned);
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
