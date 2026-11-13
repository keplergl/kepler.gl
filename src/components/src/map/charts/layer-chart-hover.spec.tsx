// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import {createBigNumberChart, createLayerChart, LayerChartType} from '@kepler.gl/charts';
import {getApplicationConfig} from '@kepler.gl/utils';
import LayerChartHover, {LayerChartHoverProps} from './layer-chart-hover';

jest.mock('@kepler.gl/utils', () => ({getApplicationConfig: jest.fn()}));
jest.mock('@kepler.gl/charts', () => ({
  ...jest.requireActual('@kepler.gl/charts'),
  ChartRenderer: ({data}) => <output data-testid="chart-view">{JSON.stringify(data)}</output>
}));

const rows = [
  ['A', 'first'],
  ['B', 'second'],
  ['A', 'third']
];
const dataset = {
  id: 'data',
  allIndexes: [0, 1, 2],
  filteredIndex: [1],
  fields: [
    {name: 'group', type: 'string'},
    {name: 'category', type: 'string'}
  ],
  getValue: (field: string, index: number) => rows[index][field === 'group' ? 0 : 1]
};
const chart = createLayerChart('layer', LayerChartType.BREAKDOWN_BY_CATEGORY, {
  id: 'hover',
  title: 'Hovered categories',
  axis: {field: {name: 'category', type: 'string'}, aggregation: 'uniqueBin'}
});
function props(overrides: Partial<LayerChartHoverProps> = {}): LayerChartHoverProps {
  return {
    charts: [chart],
    datasets: {data: dataset} as any,
    layerHoverProp: {layer: {id: 'layer', config: {dataId: 'data'}}, data: {_rowIndex: 0}} as any,
    ...overrides
  };
}
function view() {
  return JSON.parse(screen.getByTestId('chart-view').textContent || '{}');
}
beforeEach(() => {
  jest.mocked(getApplicationConfig).mockReturnValue({enableChartsPanel: true} as any);
});

describe('LayerChartHover', () => {
  test.each([
    ['no hover', {layerHoverProp: null}],
    ['no charts', {charts: undefined}],
    ['no datasets', {datasets: undefined}],
    ['missing dataset', {datasets: {}}],
    ['unsupported dataset', {datasets: {data: {id: 'data'}}}],
    ['unrelated charts', {charts: [createBigNumberChart(), {...chart, layerId: 'other'}]}]
  ])('renders nothing with %s', (_name, overrides) => {
    const {container} = render(<LayerChartHover {...props(overrides as any)} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('does not render when charts are disabled', () => {
    jest.mocked(getApplicationConfig).mockReturnValue({enableChartsPanel: false} as any);
    const {container} = render(<LayerChartHover {...props()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('uses row zero and follows the hovered row rather than the filtered index', () => {
    const {rerender} = render(<LayerChartHover {...props()} />);
    expect(view().bins).toEqual([expect.objectContaining({key: 'first', value: 1})]);
    rerender(
      <LayerChartHover
        {...props({
          layerHoverProp: {
            layer: {id: 'layer', config: {dataId: 'data'}},
            data: {_rowIndex: 2}
          } as any
        })}
      />
    );
    expect(view().bins).toEqual([expect.objectContaining({key: 'third', value: 1})]);
  });

  test('groups rows with the hovered id and excludes other layers and dataset charts', () => {
    render(
      <LayerChartHover
        {...props({
          charts: [
            {...chart, chartDisplay: {...chart.chartDisplay, idField: 'group'}},
            {...chart, id: 'other', layerId: 'other'},
            createBigNumberChart()
          ]
        })}
      />
    );
    expect(screen.getAllByTestId('chart-view')).toHaveLength(1);
    expect(
      view()
        .bins.map(bin => bin.key)
        .sort()
    ).toEqual(['first', 'third']);
  });

  test('does not substitute row zero when hover data has no row index', () => {
    render(
      <LayerChartHover
        {...props({
          layerHoverProp: {
            layer: {id: 'layer', config: {dataId: 'data'}},
            data: null
          } as any
        })}
      />
    );
    expect(view().kind).toBe('empty');
  });
});
