// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AnimationConfig, Timeline, TimeRangeFilter} from '@kepler.gl/types';

import {toArray} from './utils';

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
    // @ts-expect-error
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
