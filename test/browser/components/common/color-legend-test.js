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

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';

import ColorLegend, {LegendRow} from 'components/common/color-legend';

test('Components -> ColorLegend.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<ColorLegend />);
  }, 'Show not fail without props');

  const width = 180;
  const fieldType = 'real';
  const domain = [0, 20];
  const scaleType = 'quantize';
  const range = {
    colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
  };
  const displayLabel = true;

  const props = {
    scaleType,
    displayLabel,
    domain,
    fieldType,
    range,
    width
  };

  let wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 6, 'Should render 6 legends');
  const row1 = wrapper
    .find(LegendRow)
    .at(0)
    .find('rect')
    .at(0)
    .html();

  t.ok(row1.indexOf('fill: #5A1846'), 'should render color rect');

  props.scaleType = 'quantile';
  wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 6, 'Should render 6 legends');

  props.scaleType = 'log';
  wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 0, 'Should render 0 legends');

  props.displayLabel = false;
  props.scaleType = 'quantile';
  wrapper = mountWithTheme(<ColorLegend {...props} />);

  const row1Txt = wrapper
    .find(LegendRow)
    .at(0)
    .find('text')
    .at(0)
    .text();
  t.equal(row1Txt, '', 'should not render text');

  t.end();
});

test('Components -> ColorLegend.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<ColorLegend />);
  }, 'Show not fail without props');

  const width = 180;
  const range = {
    colorMap: [
      ['apple', '#C1C9CC'],
      ['pear', '#DFB02F'],
      ['car', '#7F8120'],
      ['dog', '#DCD0A4'],
      ['chicken', '#AD5633']
    ]
  };

  const props = {
    displayLabel: true,
    range,
    width
  };

  let wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 5, 'Should render 5 legends');
  let row1 = wrapper
    .find(LegendRow)
    .at(0)
    .find('rect')
    .at(0)
    .html();

  t.ok(row1.indexOf('fill: #C1C9CC'), 'should render color rect based on colorMap');
  t.ok(row1.indexOf('apple'), 'should render color text based on colorMap');

  props.range = {
    colorLegends: {
      '#DFB02F': 'Apple',
      '#7F8120': 'Pear',
      '#DCD0A4': 'Car',
      '#AD5633': 'Dog',
      '#C1C9CC': 'Chicken'
    }
  };

  wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 5, 'Should render 5 legends');
  row1 = wrapper
    .find(LegendRow)
    .at(0)
    .find('rect')
    .at(0)
    .html();

  t.ok(row1.indexOf('fill: #DFB02F'), 'should render color rect based on colorMap');
  t.ok(row1.indexOf('Apple'), 'should render color text based on colorMap');
  t.end();
});
