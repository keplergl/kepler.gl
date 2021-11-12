import {FILTER_TYPES, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import get from 'lodash.get';
import {TimeRangeFilter, Filter} from '@kepler.gl/types';

export const durationSecond = 1000;
export const durationMinute = durationSecond * 60;
export const durationHour = durationMinute * 60;
export const durationDay = durationHour * 24;
export const durationWeek = durationDay * 7;
export const durationYear = durationDay * 365;

/**
 * Sanity check on filters to prepare for save
 */

/* eslint-disable complexity */
export function isValidFilterValue(type: string | null, value: any): boolean {
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
 * Retrieve interval bins for time filter
 */
export function getIntervalBins(filter: TimeRangeFilter) {
  const {bins} = filter;
  const interval = filter.plotType?.interval;
  if (!interval || !bins || Object.keys(bins).length === 0) {
    return null;
  }
  const values = Object.values(bins);
  return values[0] ? values[0][interval] : null;
}

export function isValidTimeDomain(domain) {
  return Array.isArray(domain) && domain.every(Number.isFinite);
}

export function getTimeWidgetHintFormatter(domain: [number, number]): string | undefined {
  if (!isValidTimeDomain(domain)) {
    return undefined;
  }

  const diff = domain[1] - domain[0];
  return diff > durationWeek
    ? 'L'
    : diff > durationDay
    ? 'L LT'
    : diff > durationHour
    ? 'LT'
    : 'LTS';
}

export function isSideFilter(filter: Filter): boolean {
  return filter.view === FILTER_VIEW_TYPES.side;
}
