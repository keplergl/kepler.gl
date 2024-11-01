// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ascending, bisector, tickStep} from 'd3-array';
import moment from 'moment';

import {
  TICK_INTERVALS,
  BINS_LARGE,
  DURATIONS,
  TIME_INTERVALS,
  durationYear,
  INTERVAL,
  TickInterval
} from '@kepler.gl/constants';
import {AnimationConfig, Timeline, TimeRangeFilter} from '@kepler.gl/types';

import {toArray} from './utils';
import {getFrequency} from './aggregation';

export const TileTimeInterval = {
  YEAR: 'Y',
  MONTH: 'M',
  DAY: 'D',
  HOUR: 'H',
  MINUTE: 'T'
};

export const TIME_INTERVALS_ORDERED = [
  TileTimeInterval.MINUTE,
  TileTimeInterval.HOUR,
  TileTimeInterval.DAY,
  TileTimeInterval.MONTH,
  TileTimeInterval.YEAR
];

export const LayerToFilterTimeInterval = {
  [TileTimeInterval.MINUTE]: INTERVAL['1-minute'],
  [TileTimeInterval.HOUR]: INTERVAL['1-hour'],
  [TileTimeInterval.DAY]: INTERVAL['1-day'],
  [TileTimeInterval.MONTH]: INTERVAL['1-month'],
  [TileTimeInterval.YEAR]: INTERVAL['1-year']
};

export const TIMELINE_MODES = {
  inner: 'inner',
  outer: 'outer'
};

export const SAMPLE_TIMELINE = {
  // value: [15], // represent 15% of the all width
  value: [5, 15], // represent start at 5% and ends at 15%
  domain: [1, 100], // represent the total domain
  speed: 1,
  enableInteraction: false, // can use interact with this timeline
  isAnimating: false,
  step: null,
  // @todo: giuseppe coverType: 'inner' | 'outer'
  mode: TIMELINE_MODES.inner
  //  ....
};

export const getTimelineFromAnimationConfig = (animationConfig: AnimationConfig): Timeline => {
  const {
    currentTime,
    domain,
    speed,
    isAnimating,
    timeSteps,
    defaultTimeFormat,
    timeFormat,
    timezone
  } = animationConfig;

  return {
    // @ts-expect-error
    value: toArray(currentTime),
    enableInteraction: true,
    domain,
    speed,
    isAnimating: isAnimating || false,
    timeSteps,
    defaultTimeFormat,
    timeFormat,
    timezone,
    marks: null
  };
};

export const getTimelineFromFilter = (filter: TimeRangeFilter): Timeline => {
  const {
    value,
    domain,
    speed,
    isAnimating,
    step,
    // @ts-expect-error
    timeSteps,
    defaultTimeFormat,
    timeFormat,
    timezone,
    animationWindow
  } = filter;

  return {
    value,
    enableInteraction: true,
    domain,
    speed,
    isAnimating,
    step,
    timeSteps,
    defaultTimeFormat,
    timeFormat,
    timezone,
    animationWindow,
    marks: null
  };
};

// check if the data inherent default time interval

// https://github.com/d3/d3-scale/blob/732ed4b1cd5c643700571d1089c7deb8472242a6/src/time.js#L69
// given number of ticks, calculate a reasonable interval
export function getIntervalByTicks(ticks, start, stop) {
  if (ticks === null) ticks = 10;
  const tickIntervals = Object.values(TICK_INTERVALS);
  let interval;
  let step;
  // If a desired tick count is specified, pick a reasonable tick interval
  // based on the extent of the domain and a rough estimate of tick size.
  // Otherwise, assume interval is already a time interval and use it.
  if (typeof ticks === 'number') {
    const target = Math.abs(stop - start) / ticks;
    let i = bisector((d: TickInterval) => d.duration).right(tickIntervals, target);
    if (i === tickIntervals.length) {
      step = tickStep(start / durationYear, stop / durationYear, ticks);
      interval = 'year';
    } else if (i) {
      const tickInterval =
        tickIntervals[
          target / tickIntervals[i - 1].duration < tickIntervals[i].duration / target ? i - 1 : i
        ];
      // @ts-ignore TODO/ib
      step = tickInterval.step;
      // @ts-ignore TODO/ib
      interval = tickInterval.interval;
    } else {
      step = Math.max(tickStep(start, stop, ticks), 1);
      interval = 'millisecond';
    }
  }

  return `${step}-${interval}`;
}

// get a  number of unique samples
function getUniqueSamples(values, count) {
  let i = -1;
  const samples: any[] = [];
  const sampleMap = {};
  while (i++ < values.length && samples.length < count) {
    const v = values[i];
    if (v !== undefined && v !== null && !sampleMap[v]) {
      sampleMap[v] = true;
      samples.push(v);
    }
  }

  return Object.values(samples);
}

/**
 * Given an array of epoch timestamp. sort it, if number of element
 * share the same time interval exceed thresholf, and total steps smaller than 100, return it, else return null
 * @param values
 */
function detectInterval(values: number[] = [], domain, maxSteps = 10) {
  const threshold = 0.7;

  const sorted = values.sort(ascending);

  // get first 100 unique sorted ts
  const samples = getUniqueSamples(sorted, 100);
  if (samples.length < 2) {
    return null;
  }

  // get all intervals
  const intervals = samples.reduce((accu, d, i) => {
    if (i > 0) {
      const duration = moment.duration(moment.utc(samples[i]).diff(moment.utc(samples[i - 1])));
      const [dur, c] = getDurationUnit(duration);
      accu.push(`${c}-${dur}`);
    }
    return accu;
  }, []);

  // find the most occured interval
  const occur = getFrequency(intervals);
  const maxOccr = Object.keys(occur).reduce(
    (prev, key) => (occur[prev] >= occur[key] ? prev : key),
    Object.keys(occur)[0]
  );

  // if occurance passed threshold
  const mostOccur = occur[maxOccr] / intervals.length;
  if (mostOccur >= threshold) {
    const [step, dur] = maxOccr.split('-');
    const durationSecond = DURATIONS[dur] * parseInt(step); // eslint-disable-line radix
    const totalSteps = (domain[1] - domain[0]) / durationSecond;

    if (totalSteps < maxSteps) {
      // duration function is .days interval is day
      return maxOccr.substring(0, maxOccr.length - 1);
    }
  }

  return null;
}

/**
 * mappedValue is saved to dataset.fields.filterProps
 * @param dataset
 * @param filter
 */
export function getFilterMappedValue(dataset, filter) {
  const dataId = dataset.id;
  const fieldName = filter.name[filter.dataId.indexOf(dataId)];
  const field = dataset.getColumnField(fieldName);

  if (!field) {
    // eslint-disable-next-line no-console, no-undef
    console.warn(`field ${fieldName} does not exist on dataset`);
    return null;
  }
  const mappedValue = (field.filterProps || {}).mappedValue;
  if (!mappedValue) {
    // eslint-disable-next-line no-console, no-undef
    console.warn(`mappedValue doesnt exist on filter field ${filter.name}`);
    return null;
  }
  return mappedValue;
}
/**
 * Find the round unit of given durmostOccurtion: x years | months | days
 * @param duration
 */
function getDurationUnit(duration) {
  const durFuncs = Object.keys(DURATIONS);
  for (let i = 0; i < durFuncs.length; i++) {
    const c = duration[durFuncs[i]]();
    if (c > 0) {
      return [durFuncs[i], c];
    }
  }
  return ['milliseconds', 1];
}

export function intervalToFunction(id) {
  const [stepStr, interval] = id.split('-');
  const step = parseInt(stepStr); // eslint-disable-line radix
  if (!step) {
    // eslint-disable-next-line no-console, no-undef
    console.warn('Step is not an integer');
    return null;
  }

  if (!TIME_INTERVALS[interval]) {
    // eslint-disable-next-line no-console, no-undef
    console.warn(`Undefined time interval ${interval}`);
    return null;
  }

  return TIME_INTERVALS[interval].every(step);
}

export function getInitialInterval(filter, datasets) {
  const {domain} = filter;
  const mergeMappedValue = filter.dataId.reduce((accu, dataId) => {
    const mappedValue = getFilterMappedValue(datasets[dataId], filter);
    if (!mappedValue) {
      return accu;
    }

    for (let i = 0; i < mappedValue.length; i++) {
      accu.push(mappedValue[i]);
    }
    return accu;
  }, []);

  // check if data has predefined interval
  let interval = detectInterval(mergeMappedValue, domain);

  if (!interval) {
    const [t0, t1] = domain;
    interval = getIntervalByTicks(BINS_LARGE, t0, t1);
  }

  return interval;
}

// Filter interval options by time filter domain
// max number of interval is 1000
/**
 *
 * @param options
 * @param domain
 */
export function filterIntervalOptions(options, domain) {
  const maxBins = 1000;
  const minBins = 2;
  const timeSpan = domain[1] - domain[0];

  return options.filter(op => {
    const {id} = op;
    if (!TICK_INTERVALS[id]) {
      return false;
    }

    const interval = TICK_INTERVALS[id];

    // rough count on bins
    const count = timeSpan / (interval.step * interval.duration);

    return count >= minBins && count <= maxBins;
  });
}
