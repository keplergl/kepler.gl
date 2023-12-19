// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable no-unused-vars */
import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {appInjector, RangePlotFactory} from '@kepler.gl/components';

const RangePlot = appInjector.get(RangePlotFactory);

test('Components -> RangePlot.render', t => {
  const props = {
    histogram: [],
    isEnlarged: true,
    isRanged: true,
    onBrush: () => {},
    plotType: 'histogram',
    range: [1421315219000, 1421348744000],
    value: [1421315219000, 1421348744000],
    width: 137
  };
  t.doesNotThrow(() => {
    const wrapper = mountWithTheme(<RangePlot {...props} />);
  }, 'Show not fail without histogram');

  // cant test D3 in jsDom for now
  // props.histogram = [
  //   {count: 20, x0: 1421315219000, x1: 1421315500000},
  //   {count: 0, x0: 1421315500000, x1: 1421316000000},
  //   {count: 0, x0: 1421316000000, x1: 1421316500000},
  //   {count: 0, x0: 1421316500000, x1: 1421317000000},
  //   {count: 0, x0: 1421317000000, x1: 1421317500000},
  //   {count: 21, x0: 1421317500000, x1: 1421318000000}
  // ];

  t.doesNotThrow(() => {
    const wrapper = mountWithTheme(<RangePlot {...props} />);
  }, 'Show not fail render histogram');

  t.end();
});
