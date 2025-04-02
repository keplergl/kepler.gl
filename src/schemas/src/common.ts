// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

const TIME_INTERVALS_KEYS = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond'
] as const;

export const TIME_INTERVAL_REGEX = new RegExp(`^([0-9]+)-(${TIME_INTERVALS_KEYS.join('|')})$`);

export const TIME_INTERVAL_DESC =
  `Should be in the form (number)-(interval), where interval is one of: ` +
  `${TIME_INTERVALS_KEYS.join(', ')}, e.g 1-day, 2-week, 3-month, 4-year`;

export const TimeIntervalSchema = z.string().regex(TIME_INTERVAL_REGEX);

export enum AggregationKey {
  COUNT = 'COUNT',
  SUM = 'SUM',
  MEAN = 'MEAN',
  MAX = 'MAX',
  MIN = 'MIN',
  DEVIATION = 'DEVIATION',
  VARIANCE = 'VARIANCE',
  MEDIAN = 'MEDIAN',
  P05 = 'P05',
  P25 = 'P25',
  P50 = 'P50',
  P75 = 'P75',
  P95 = 'P95',
  MODE = 'MODE',
  UNIQUE = 'UNIQUE',
  MERGE = 'MERGE'
}
export const AggregationKeySchema = z.nativeEnum(AggregationKey);
export type AggregationKeySchema = z.infer<typeof AggregationKeySchema>;
