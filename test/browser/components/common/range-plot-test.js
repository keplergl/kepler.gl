// Copyright (c) 2021 Uber Technologies, Inc.
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

/* eslint-disable no-unused-vars */
import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {appInjector} from 'components/container';
import {RangePlotFactory} from 'components';

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
