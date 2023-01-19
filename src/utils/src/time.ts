// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
    // @ts-expect-error not in anim
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
