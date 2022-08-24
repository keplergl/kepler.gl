import {FILTER_TYPES} from '@kepler.gl/constants';
import get from 'lodash.get';

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
