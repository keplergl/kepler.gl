// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

  t.deepEqual(
    Object.keys(getTimelineFromFilter(filter)),
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

  t.deepEqual(
    Object.keys(getTimelineFromAnimationConfig(animationConfig)),
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
