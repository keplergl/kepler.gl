// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable no-unused-vars */

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {appInjector, RangePlotFactory, LoadingSpinner} from '@kepler.gl/components';
import sinon from 'sinon';

const RangePlot = appInjector.get(RangePlotFactory);

test('Components -> RangePlot.render', t => {
  const setFilterPlot = sinon.spy();
  const props = {
    isEnlarged: true,
    isRanged: true,
    onBrush: () => {},
    plotType: {type: 'histogram'},
    range: [1421315219000, 1421348744000],
    value: [1421315219000, 1421348744000],
    width: 137,
    setFilterPlot
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(<RangePlot {...props} />);
  }, 'Show not fail without histogram');

  // t.ok(setFilterPlot.calledOnce, 'should call setFilterPlot');
  // t.deepEqual(
  //   setFilterPlot.getCall(0).args,
  //   [{plotType: {type: 'histogram'}}],
  //   'should call setfilterPlot with plotType'
  // );
  // t.equal(wrapper.find(LoadingSpinner).length, 1, 'should render loading spinner');

  const propsWLineChart = {
    isEnlarged: true,
    isRanged: true,
    onBrush: () => {},
    plotType: {type: 'lineChart'},
    range: [1421315219000, 1421348744000],
    value: [1421315219000, 1421348744000],
    width: 137,
    setFilterPlot
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(<RangePlot {...propsWLineChart} />);
  }, 'Show not fail without lineChart');

  t.ok(setFilterPlot.calledTwice, 'should call setFilterPlot');
  t.deepEqual(
    setFilterPlot.getCall(1).args,
    [{plotType: {type: 'lineChart'}}],
    'should call setfilterPlot with plotType'
  );
  t.equal(wrapper.find(LoadingSpinner).length, 1, 'should render loading spinner');

  // cant test D3 in jsDom for now
  // props.histogram = [
  //   {count: 20, x0: 1421315219000, x1: 1421315500000},
  //   {count: 0, x0: 1421315500000, x1: 1421316000000},
  //   {count: 0, x0: 1421316000000, x1: 1421316500000},
  //   {count: 0, x0: 1421316500000, x1: 1421317000000},
  //   {count: 0, x0: 1421317000000, x1: 1421317500000},
  //   {count: 21, x0: 1421317500000, x1: 1421318000000}
  // ];

  t.end();
});
