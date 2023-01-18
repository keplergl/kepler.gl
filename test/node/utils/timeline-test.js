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

import test from 'tape';
import {getTimelineFromFilter, getTimelineFromAnimationConfig} from '@kepler.gl/utils';

test('#timeline -> getTimelineFromFilter', t => {
  const filter = {
    dataId: ['test_trip_data'],
    id: 'lojgttzht',
    fixedDomain: true,
    enlarged: true,
    isAnimating: false,
    animationWindow: 'free',
    speed: 1,
    name: ['tpep_pickup_datetime'],
    type: 'timeRange',
    fieldIdx: [0],
    domain: [1421315219000, 1421348744000],
    value: [1421315219000, 1421348744000],
    plotType: {
      interval: '5-minute',
      defaultTimeFormat: 'L  LT',
      type: 'histogram',
      aggregation: 'sum'
    },
    yAxis: null,
    gpu: true,
    step: 1000,
    mappedValue: [
      null,
      null,
      1421348740000,
      null,
      1421348741000,
      1421348741000,
      1421348741000,
      1421348741000,
      1421348741000,
      1421348741000,
      1421348741000,
      1421348741000,
      1421320174000
    ],
    defaultTimeFormat: 'L LTS',
    fieldType: 'timestamp',
    gpuChannel: [0]
  };

  const timeline = getTimelineFromFilter(filter);
  t.deepEqual(
    Object.keys(timeline),
    [
      'value',
      'enableInteraction',
      'domain',
      'speed',
      'isAnimating',
      'step',
      'timeSteps',
      'defaultTimeFormat',
      'timeFormat',
      'timezone',
      'animationWindow',
      'marks'
    ],
    'Should generate the correct keys for filter timeline'
  );
  t.end();
});

test('#timeline -> getTimelineFromAnimationConfig', t => {
  const animationConfig = {
    domain: [1565577697000, 1565578881000],
    currentTime: 1565577697000,
    speed: 1,
    isAnimating: false,
    timeSteps: null,
    timeFormat: null,
    timezone: null,
    defaultTimeFormat: 'L LTS',
    duration: null
  };

  const timeline = getTimelineFromAnimationConfig(animationConfig);

  t.deepEqual(
    Object.keys(timeline),
    [
      'value',
      'enableInteraction',
      'domain',
      'speed',
      'isAnimating',
      'timeSteps',
      'defaultTimeFormat',
      'timeFormat',
      'timezone',
      'marks'
    ],
    'Should generate the correct keys for animationConfig timeline'
  );

  t.deepEqual(
    getTimelineFromAnimationConfig(animationConfig).value,
    [animationConfig.currentTime],
    'Should have converted animationConfig currentTime to value and array shaped'
  );

  t.end();
});
