// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {appInjector, HistogramPlotFactory, HISTOGRAM_MASK_MODE} from '@kepler.gl/components';
import {theme} from '@kepler.gl/styles';

const HistogramPlot = appInjector.get(HistogramPlotFactory);

const histogramProps = {
  width: 200,
  height: 60,
  margin: {top: 0, bottom: 0, left: 0, right: 0},
  isRanged: true,
  range: [0, 4],
  value: [1, 3],
  histogramsByGroup: {
    default: [
      {count: 5, x0: 0, x1: 1},
      {count: 8, x0: 1, x1: 2},
      {count: 3, x0: 2, x1: 3},
      {count: 6, x0: 3, x1: 4}
    ]
  },
  brushComponent: <g className="test-brush" />
};

// SVG paints its children in document order, so whatever comes later is drawn on top.
const paintOrder = (svg, selector) =>
  Array.from(svg.children).findIndex(child => child.querySelector(selector));

test('Components -> HistogramPlot -> brush is painted above the bars', t => {
  const wrapper = mountWithTheme(
    <HistogramPlot {...histogramProps} isMasked={HISTOGRAM_MASK_MODE.NoMask} />
  );
  const svg = wrapper.find('svg').getDOMNode();

  const bars = paintOrder(svg, '.histogram-bars');
  const brush = paintOrder(svg, '.test-brush');
  t.ok(bars >= 0 && brush >= 0, 'should render both the bars and the brush');
  t.ok(brush > bars, 'should paint the brush after the bars, so the bars do not cover it');

  t.end();
});

// Styled-components writes the plot color into a stylesheet, not an inline style.
const paintedBackground = node => {
  const classes = new Set((node.getAttribute('class') || '').split(/\s+/).filter(Boolean));
  let background = '';
  Array.from(document.styleSheets).forEach(sheet => {
    let rules = [];
    try {
      rules = Array.from(sheet.cssRules || []);
    } catch (err) {
      return;
    }
    rules.forEach(rule => {
      if (!rule.selectorText || !rule.style) return;
      const matches = rule.selectorText.split(',').some(selector => {
        const required = selector.match(/\.[\w-]+/g) || [];
        return required.length > 0 && required.every(token => classes.has(token.slice(1)));
      });
      if (!matches) return;
      const value =
        rule.style.getPropertyValue('background-color') ||
        rule.style.getPropertyValue('background');
      if (value) background = value.trim();
    });
  });
  return background;
};

test('Components -> HistogramPlot -> column histograms stay on the light data table', t => {
  const columnStats = mountWithTheme(
    <HistogramPlot {...histogramProps} isMasked={HISTOGRAM_MASK_MODE.NoMask} />
  );
  t.equal(
    paintedBackground(columnStats.find('svg').getDOMNode()).toLowerCase(),
    'transparent',
    'should leave the data-table histogram transparent'
  );

  const rangePlot = mountWithTheme(
    <HistogramPlot {...histogramProps} isMasked={HISTOGRAM_MASK_MODE.NoMask} recessed />
  );
  t.equal(
    paintedBackground(rangePlot.find('svg').getDOMNode()).toLowerCase(),
    theme.rangePlotBgd.toLowerCase(),
    'should keep the recessed surface behind the range brush'
  );

  t.end();
});
