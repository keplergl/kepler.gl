// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {TOOLTIP_KEY, TICK_INTERVALS} from '@kepler.gl/constants';

export const getFormatValue = fmt => fmt[TOOLTIP_KEY];

export function getDefaultTimeFormat(interval?: string): string {
  const timeInterval = interval ? TICK_INTERVALS[interval] : {interval: 'none'};

  switch ((timeInterval || {}).interval) {
    case 'year':
      // 2020
      return 'YYYY';
    case 'month':
    case 'week':
    case 'day':
      return 'L';
    case 'hour':
      return 'L  H A';
    case 'minute':
      return 'L  LT';
    case 'millisecond':
      return 'L  LTS.SSS';

    case 'second':
    default:
      return 'L  LTS';
  }
}
