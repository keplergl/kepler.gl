// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {layerVisualChannelConfigChange} from '@kepler.gl/actions';
import {
  ColorBreaksDisplay,
  ColorBreaksPanelFactory,
  ColorChartHeader,
  ColorChartTick,
  ColumnStatsChartFactory,
  EditButton,
  HISTOGRAM_HEIGHT,
  HISTOGRAM_WIDTH,
  appInjector
} from '@kepler.gl/components';
import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
import {getLayerColorScale, getLegendOfScale} from '@kepler.gl/utils';
import {scaleLinear} from 'd3-scale';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';
import {histogramFromThreshold, histogramFromValues, getHistogramDomain} from '@kepler.gl/utils';

const ColorBreaksPanel = appInjector.get(ColorBreaksPanelFactory);
const ColumnStatsChart = appInjector.get(ColumnStatsChartFactory);

const TEST_PALETTE_COLORS = ['#FFF7F3', '#F369A3', '#49006A'];

const ColumnStatsChartProps = (filterData = false) => {
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];
  const dataset = datasets[pointLayer.config.dataId];

  // use uid as colorField (contains null values)
  const colorField = datasets[pointLayer.config.dataId].fields[6];
  const updatedState = coreReducer(
    InitialState,
    layerVisualChannelConfigChange(pointLayer, {colorField}, 'color')
  );

  if (filterData) {
    dataset.filteredIndexForDomain = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  }

  const pointLayer1 = updatedState.visState.layers[0];

  const domain = pointLayer1.config.colorDomain;
  const scaleType = 'quantize';
  const range = {
    colors: TEST_PALETTE_COLORS,
    name: 'RdPu',
    type: 'sequential',
    category: 'ColorBrewer'
  };
  const colorScale = getLayerColorScale({range, domain, scaleType, layer: pointLayer1});
  const colorBreaks = getLegendOfScale({scale: colorScale, scaleType, fieldType: colorField.type});
  const fieldValueAccessor = idx => dataset.getValue(colorField.name, idx);
  const histogramDomain = getHistogramDomain({dataset, fieldValueAccessor});
  const allBins = histogramFromValues(dataset.allIndexes, 30, fieldValueAccessor);
  const filteredBins = !filterData
    ? allBins
    : histogramFromThreshold(
        allBins.map(b => b.x0),
        dataset.filteredIndexForDomain,
        fieldValueAccessor,
        false
      );
  const isFiltered = filterData;
  return {
    colorField,
    dataset,
    colorBreaks,
    allBins,
    filteredBins,
    isFiltered,
    histogramDomain,
    onChangedUpdater: sinon.spy()
  };
};

const GetTickPositions = colorBreaks => {
  const x = scaleLinear().domain([1, 12124]).range([0, HISTOGRAM_WIDTH]);
  return colorBreaks.map(cb => x(cb.range[1]));
};

test('Components -> ColumnStatsChart -> ColorChartTick', t => {
  const ExpectedTickPositions = [70, 140];
  let MovedTickPositions = null;

  const InitialProps = {
    colors: ['#FFF7F3', '#F369A3'],
    positions: ExpectedTickPositions,
    onTickMoving: positions => {
      MovedTickPositions = positions;
    },
    onTickChanged: sinon.spy()
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColorChartTick {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColorChartTick');

  const colorChartTickWrapper = wrapper.find('.color-chart-tick-container');
  t.equal(colorChartTickWrapper.length, 1, 'should render 1 ColorChartTickContainer');
  t.equal(colorChartTickWrapper.children().length, 2, 'should render 2 ticks');

  const TestTickPositions = colorChartTickWrapper.children().map(x => {
    const style = x.props().style;
    return (
      parseInt(style.left, 10) + parseInt(style.borderWidth, 10) + parseInt(style.width, 10) / 2
    );
  });

  t.deepEqual(
    ExpectedTickPositions,
    TestTickPositions,
    'should position 2 ticks at correct locations'
  );

  // simulate drag tick to move
  const firstTick = colorChartTickWrapper.childAt(0);
  firstTick.simulate('mousedown');
  firstTick.simulate('mousemove', {clientX: 80});
  firstTick.simulate('mouseup');

  t.deepEqual(MovedTickPositions, [80, 140], 'should move 2 ticks to correct locations');

  firstTick.simulate('mousedown');
  firstTick.simulate('mousemove', {clientX: -10});
  firstTick.simulate('mouseup');

  t.deepEqual(MovedTickPositions, [0, 140], 'should move the first tick to correct locations');

  firstTick.simulate('mousedown');
  firstTick.simulate('mousemove', {clientX: 150});
  firstTick.simulate('mouseup');

  t.deepEqual(
    MovedTickPositions,
    [139, 140],
    'should move the first tick 1 pixel left to the second tick'
  );

  t.end();
});

test('Components -> ColumnStatsChart -> ColorChartHeader', t => {
  const InitialProps = {
    minVal: 1,
    maxVal: 100,
    meanVal: 50
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColorChartHeader {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColorChartHeader');

  const colorChartHeader = wrapper.find('.color-chart-header');
  t.equal(colorChartHeader.length, 1, 'should render 1 ColorChartHeader');
  t.equal(colorChartHeader.children().length, 3, 'should render 3 divs in color chart header');
  t.equal(
    colorChartHeader.children().at(0).text(),
    'MIN: 1',
    'should render MIN value in color chart header'
  );
  t.equal(
    colorChartHeader.children().at(1).text(),
    'MEAN: 50',
    'should render MEAN value in color chart header'
  );
  t.equal(
    colorChartHeader.children().at(2).text(),
    'MAX: 100',
    'should render MAX value in color chart header'
  );

  t.end();
});

const GetColorPaletteWidths = tickPositions => {
  const n = tickPositions.length;
  const widths = [tickPositions[0]];
  for (let i = 1; i < n; ++i) {
    widths.push(tickPositions[i] - tickPositions[i - 1]);
  }
  return widths;
};

test('Components -> ColumnStatsChart -> IsLoading', t => {
  const InitialProps = ColumnStatsChartProps();
  const modifiedDataset = InitialProps.dataset;
  modifiedDataset.fields = modifiedDataset.fields.map(f => {
    // hack to test case of loading stats
    f.isLoadingStats = true;
    return f;
  });
  const InitialPropsWithLoading = {
    ...InitialProps,
    dataset: modifiedDataset
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColumnStatsChart {...InitialPropsWithLoading} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColumnStatsChart');

  t.equal(wrapper.find('.color-chart-header').length, 0, 'should not render ColorChartHeader');
  t.end();
});

test('Components -> ColumnStatsChart', t => {
  const InitialProps = ColumnStatsChartProps();
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColumnStatsChart {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColumnStatsChart');

  // test ColorChartHeader
  const colorChartHeader = wrapper.find('.color-chart-header');
  t.equal(colorChartHeader.length, 1, 'should render 1 ColorChartHeader');
  t.equal(colorChartHeader.children().length, 3, 'should render 3 divs in color chart header');

  // test ColorPalette
  const colorChartPalette = wrapper.find('.color-range-palette__inner');
  t.equal(colorChartPalette.length, 1, 'should render 1 ColorChartPalette');

  const ExpectedTickPositions = GetTickPositions(InitialProps.colorBreaks);
  const ExpectedColorPaletteWidths = GetColorPaletteWidths(ExpectedTickPositions);

  const TestColorPaletteWidths = colorChartPalette.children().map(x => x.props().style.width);
  t.deepEqual(
    TestColorPaletteWidths,
    ExpectedColorPaletteWidths,
    'should render color palette widths correctly.'
  );

  const TestColorPaletteColors = colorChartPalette
    .children()
    .map(x => x.props().style.backgroundColor);
  t.deepEqual(
    TestColorPaletteColors,
    TEST_PALETTE_COLORS,
    'should render color palette colors correctly'
  );

  // test histogram
  const colorChartHistogram = wrapper.find('.color-chart-histogram');
  const histogramSVG = colorChartHistogram.find('svg');
  t.equal(histogramSVG.length, 1, 'should render 1 histogram');
  t.equal(histogramSVG.props().width, HISTOGRAM_WIDTH, 'should render histogram with 210 width');
  t.equal(histogramSVG.props().height, HISTOGRAM_HEIGHT, 'should render histogram with 210 width');
  t.equal(
    histogramSVG.find('mask').props().id,
    'histogram-mask',
    'should render a mask using histogram bins'
  );
  t.equal(
    histogramSVG.find('.histogram-bars').children().length,
    25,
    'should render histogram bars'
  );

  t.end();
});

test('Components -> ColumnStatsChart -> FilteredBins', t => {
  const InitialProps = ColumnStatsChartProps(true);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColumnStatsChart {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColumnStatsChart');

  const colorChartHistogram = wrapper.find('.color-chart-histogram');
  t.equal(
    colorChartHistogram.find('mask').props().id,
    'histogram-mask',
    'should render a mask using histogram bins'
  );
  t.equal(
    colorChartHistogram.find('.histogram-bars').children().length,
    25,
    'should render histogram bars'
  );
  t.equal(
    colorChartHistogram.find('.overlay-histogram-bars').children().length,
    25,
    'should render additional overlayed histogram bars'
  );
  t.end();
});

test('Components -> ColorBreaksPanel -> ColorBreaksDisplay', t => {
  let wrapper;

  const InitialProps1 = {
    currentBreaks: [],
    onEdit: false
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColorBreaksDisplay {...InitialProps1} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColorBreaksDisplay even with empty colorBreaks');

  const {colorBreaks} = ColumnStatsChartProps();
  const InitialProps = {
    currentBreaks: colorBreaks,
    onEdit: true
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColorBreaksDisplay {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColorBreaksDisplay');

  t.ok(wrapper.find(EditButton).length, 'should render EditButton');

  t.end();
});

test('Components -> ColorBreaksPanel -> ColumnStatsChart', t => {
  const InitialProps = {
    ...ColumnStatsChartProps(),
    colorUIConfig: {
      customPalette: {},
      showSketcher: false,
      colorRangeConfig: {
        customBreaks: false
      }
    },
    isCustomBreaks: false,
    setColorUI: sinon.spy(),
    onApply: sinon.spy(),
    onCancel: sinon.spy(),
    onScaleChange: sinon.spy()
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ColorBreaksPanel {...InitialProps} />
      </IntlWrapper>
    );
  }, 'should not fail rendering ColorBreaksPanel');

  const colorChartTickWrapper = wrapper.find('.color-chart-tick-container');

  // simulate drag tick to move
  const firstTick = colorChartTickWrapper.childAt(0);
  firstTick.simulate('mousedown');
  firstTick.simulate('mousemove', {clientX: 80});
  firstTick.simulate('mouseup');

  wrapper.update();

  const TestTickPositions = wrapper
    .find('.color-chart-tick-container')
    .children()
    .map(x => {
      const style = x.props().style;
      return (
        parseInt(style.left, 10) + parseInt(style.borderWidth, 10) + parseInt(style.width, 10) / 2
      );
    });

  t.deepEqual(TestTickPositions, [80, 140], 'should move ticks to correct positions');

  t.end();
});
