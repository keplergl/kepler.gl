// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {TOOLTIP_KEY, TICK_INTERVALS} from '@kepler.gl/constants';
import {TimeLabelFormat} from '@kepler.gl/types';

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

export const getFormatValue = (fmt: TimeLabelFormat): string | null => fmt[TOOLTIP_KEY];