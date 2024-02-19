// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import keyMirror from 'keymirror';
import {AGGREGATION_TYPES, PLOT_TYPES} from './';

import {
  utcDay,
  utcHour,
  utcMillisecond,
  utcMinute,
  utcMonth,
  utcSecond,
  utcWeek,
  utcYear
} from 'd3-time';

type ValueOf<T> = T[keyof T];

export interface IntervalOption {
  label: string;
  id: string;
}

export interface TimeAggregation {
  label: string;
  id: string;
}

export interface TimeIntervals {
  year: any;
  month: any;
  week: any;
  day: any;
  hour: any;
  minute: any;
  second: any;
  millisecond: any;
}

export interface Durations {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface AnimatinWindow {
  free: string;
  interval: string;
}

export type TimeInterval = string; // TODO: TimeInterval should be an enum

export interface TickInterval {
  interval: TimeInterval;
  step: number;
  duration: number;
}

export interface TickIntervals {
  [key: ValueOf<Interval>]: TickInterval;
}

export interface Interval {
  '1-second': string;
  '5-second': string;
  '15-second': string;
  '30-second': string;
  '1-minute': string;
  '5-minute': string;
  '15-minute': string;
  '30-minute': string;
  '1-hour': string;
  '3-hour': string;
  '6-hour': string;
  '12-hour': string;
  '1-day': string;
  '2-day': string;
  '1-week': string;
  '1-month': string;
  '3-month': string;
  '1-year': string;
}

export interface AnimationType {
  continuous: string;
  interval: string;
}

export type AnimationWindow = any;

export const durationMillisecond = 1;
export const durationSecond = 1000;
export const durationMinute = durationSecond * 60;
export const durationHour = durationMinute * 60;
export const durationDay = durationHour * 24;
export const durationWeek = durationDay * 7;
export const durationMonth = durationDay * 30;
export const durationYear = durationDay * 365;

// moment.duration functions
export const DURATIONS: Durations = {
  years: durationYear,
  months: durationMonth,
  weeks: durationWeek,
  days: durationDay,
  hours: durationHour,
  minutes: durationMinute,
  seconds: durationSecond,
  milliseconds: durationMillisecond
};

// interval key to d3 time interval function
export const TIME_INTERVALS: TimeIntervals = {
  year: utcYear,
  month: utcMonth,
  week: utcWeek,
  day: utcDay,
  hour: utcHour,
  minute: utcMinute,
  second: utcSecond,
  millisecond: utcMillisecond
};

export const INTERVAL: Interval = keyMirror({
  '1-second': null,
  '5-second': null,
  '15-second': null,
  '30-second': null,
  '1-minute': null,
  '5-minute': null,
  '15-minute': null,
  '30-minute': null,
  '1-hour': null,
  '3-hour': null,
  '6-hour': null,
  '12-hour': null,
  '1-day': null,
  '2-day': null,
  '1-week': null,
  '1-month': null,
  '3-month': null,
  '1-year': null
});

// interval eligible for calculate week over week
export const WOW: {
  [key: ValueOf<Interval>]: number;
} = {
  [INTERVAL['1-day']]: 7,
  [INTERVAL['1-week']]: 1
};

export const INTERVAL_OPTIONS: IntervalOption[] = Object.keys(INTERVAL).map(id => {
  const [step, interval] = id.split('-');
  // capitalizeFirstLetter(interval)
  return {id, label: `${step} ${interval}`};
});

export const TICK_INTERVALS: TickIntervals = {
  [INTERVAL['1-millisecond']]: {interval: 'millisecond', step: 1, duration: durationMillisecond},
  [INTERVAL['1-second']]: {interval: 'second', step: 1, duration: durationSecond},
  [INTERVAL['5-second']]: {interval: 'second', step: 5, duration: 5 * durationSecond},
  [INTERVAL['15-second']]: {interval: 'second', step: 15, duration: 15 * durationSecond},
  [INTERVAL['30-second']]: {interval: 'second', step: 30, duration: 30 * durationSecond},
  [INTERVAL['1-minute']]: {interval: 'minute', step: 1, duration: durationMinute},
  [INTERVAL['5-minute']]: {interval: 'minute', step: 5, duration: 5 * durationMinute},
  [INTERVAL['15-minute']]: {interval: 'minute', step: 15, duration: 15 * durationMinute},
  [INTERVAL['30-minute']]: {interval: 'minute', step: 30, duration: 30 * durationMinute},
  [INTERVAL['1-hour']]: {interval: 'hour', step: 1, duration: durationHour},
  [INTERVAL['3-hour']]: {interval: 'hour', step: 3, duration: 3 * durationHour},
  [INTERVAL['6-hour']]: {interval: 'hour', step: 6, duration: 6 * durationHour},
  [INTERVAL['12-hour']]: {interval: 'hour', step: 12, duration: 12 * durationHour},
  [INTERVAL['1-day']]: {interval: 'day', step: 1, duration: durationDay},
  [INTERVAL['2-day']]: {interval: 'day', step: 2, duration: 2 * durationDay},
  [INTERVAL['1-week']]: {interval: 'week', step: 1, duration: durationWeek},
  [INTERVAL['1-month']]: {interval: 'month', step: 1, duration: durationMonth},
  [INTERVAL['3-month']]: {interval: 'month', step: 3, duration: 3 * durationMonth},
  [INTERVAL['1-year']]: {interval: 'year', step: 1, duration: durationYear}
};

export const PLOT_TYPE_OPTIONS = {
  [PLOT_TYPES.lineChart]: {
    id: PLOT_TYPES.lineChart,
    label: 'Chart',
    icon: 'LineChart'
  },
  [PLOT_TYPES.histogram]: {
    id: PLOT_TYPES.histogram,
    label: 'Histogram',
    icon: 'Histogram'
  }
};

export const BINS_LARGE = 100;
export const BINS = 30;

export const TIME_AGGREGATION: TimeAggregation[] = [
  {
    id: AGGREGATION_TYPES.average,
    label: 'Average'
  },
  {
    id: AGGREGATION_TYPES.sum,
    label: 'Sum'
  },
  {
    id: AGGREGATION_TYPES.maximum,
    label: 'Maximum'
  },
  {
    id: AGGREGATION_TYPES.minimum,
    label: 'Minimum'
  },
  {
    id: AGGREGATION_TYPES.median,
    label: 'Median'
  },
  {
    id: AGGREGATION_TYPES.stdev,
    label: 'Std Deviation'
  }
];

export const ANIMATION_TYPE: AnimationType = keyMirror({
  interval: null,
  continuous: null
});
