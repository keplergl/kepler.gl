// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Bins, LineChart, TimeRangeFilter} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {getDefaultFilter, mergePlotGroupBy} from '@kepler.gl/utils';
import HistogramPlotFactory from './histogram-plot';
import RangePlotFactory from './range-plot';

const Plot = RangePlotFactory(
  () => null,
  HistogramPlotFactory(),
  () => null
);
const filter = {
  ...getDefaultFilter({dataId: 'data', id: 'time'}),
  type: 'timeRange',
  view: 'enlarged',
  yAxis: null
} as TimeRangeFilter;
const categories = ['Solar', 'Wind', 'Solar', 'Wind'];
const datasets = {
  data: {
    allIndexes: [0, 1, 2, 3],
    fields: [{name: 'source', valueAccessor: ({index}) => categories[index]}]
  }
} as unknown as Datasets;
const bins: Bins = {
  data: [
    {x0: 0, x1: 1, count: 3, indexes: [0, 1, 2]},
    {x0: 1, x1: 2, count: 1, indexes: [3]}
  ]
};
const plotType = {
  type: 'histogram',
  groupBy: mergePlotGroupBy(null, {fieldName: 'source'})
};

function setup() {
  let props: React.ComponentProps<typeof Plot> = {
    bins,
    datasets,
    filter,
    plotType,
    range: [0, 2],
    value: [0, 2],
    width: 200,
    isEnlarged: true,
    isRanged: true,
    onBrush: jest.fn(),
    setFilterPlot: jest.fn(),
    style: {}
  };
  const view = () => (
    <ThemeProvider theme={theme}>
      <Plot {...props} />
    </ThemeProvider>
  );
  const result = render(view());
  return {
    ...result,
    update(updates: Partial<typeof props>) {
      props = {...props, ...updates};
      result.rerender(view());
    }
  };
}

test('renders categorical count bins and updates after cross-filtering, palette changes, and clearing', () => {
  const {container, update} = setup();
  expect(screen.getByText('Solar')).toBeInTheDocument();
  expect(screen.getByText('Wind')).toBeInTheDocument();
  expect(
    Array.from(container.querySelectorAll('.histogram-segment title'), el => el.textContent)
  ).toEqual(['Solar: 2', 'Wind: 1', 'Wind: 1']);
  const wind = container.querySelectorAll('.histogram-segment')[1];
  const windColor = getComputedStyle(wind).fill;

  update({bins: {data: [{x0: 0, x1: 1, count: 1, indexes: [1]}]}});
  expect(screen.queryByText('Solar')).not.toBeInTheDocument();
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(1);
  expect(screen.getByText('Wind: 1')).toBeInTheDocument();
  expect(container.querySelector('.histogram-segment')).toHaveStyle({fill: windColor});

  update({
    plotType: {
      ...plotType,
      groupBy: {
        ...plotType.groupBy,
        colorRange: {
          name: 'Custom',
          type: 'qualitative',
          category: 'Custom',
          colors: ['#ff0000']
        }
      }
    }
  });
  expect(container.querySelector('.histogram-segment')).toHaveStyle({fill: '#ff0000'});

  update({plotType: {...plotType, groupBy: null}});
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(0);
  expect(container.querySelectorAll('.histogram-bars rect')).toHaveLength(1);
  expect(container.querySelector('.time-widget__series-legend')).not.toBeInTheDocument();
  expect(bins.data[0]).not.toHaveProperty('segments');
});

test('uses the active chart legend when switching between Y-axis lines and count bins', () => {
  const {container, update} = setup();
  const lineChart = {
    series: {lines: [], markers: [], names: ['Line category'], colors: ['#000000']},
    xDomain: [0, 2],
    yDomain: [0, 1],
    aggregation: 'average',
    interval: null,
    yAxis: 'value'
  } as LineChart;
  update({plotType: {...plotType, type: 'lineChart'}, lineChart});
  expect(screen.getByText('Line category')).toBeInTheDocument();
  expect(screen.queryByText('Solar')).not.toBeInTheDocument();
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(0);

  update({plotType});
  expect(screen.queryByText('Line category')).not.toBeInTheDocument();
  expect(screen.getByText('Solar')).toBeInTheDocument();
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(3);

  update({plotType: {...plotType, groupBy: {...plotType.groupBy, fieldName: 'missing'}}});
  expect(container.querySelector('.time-widget__series-legend')).not.toBeInTheDocument();
  expect(container.querySelectorAll('.histogram-bars rect')).toHaveLength(2);
});

test('clears linked grouping when the source layer changes to another dataset', () => {
  const {container, update} = setup();
  const layer = new KeplerGlLayers.PointLayer({id: 'source-layer', dataId: 'data'});
  layer.updateLayerConfig({
    colorField: {...datasets.data.fields[0], type: 'string'},
    colorScale: 'ordinal',
    colorDomain: ['Solar', 'Wind']
  });
  update({
    layers: [layer],
    plotType: {
      ...plotType,
      groupBy: mergePlotGroupBy(null, {source: 'layer', layerId: layer.id})
    }
  });
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(3);

  layer.updateLayerConfig({dataId: 'other'});
  update({
    layers: [layer],
    datasets: {...datasets, other: datasets.data},
    bins: {...bins, other: bins.data}
  });
  expect(container.querySelectorAll('.histogram-segment')).toHaveLength(0);
  expect(container.querySelectorAll('.histogram-bars rect')).toHaveLength(4);
  expect(container.querySelector('.time-widget__series-legend')).not.toBeInTheDocument();
});
