// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';

import {
  ChartType,
  LayerChartType,
  BinType,
  buildBigNumber,
  buildGroupedBins,
  buildHeatmapCells,
  buildPivotTable,
  buildTimeSeries,
  createChart,
  computeDatasetChart,
  getHoverRowIndexes
} from '@kepler.gl/charts';

function mockDataset(rows) {
  const fields = [
    {name: 'category', type: 'string'},
    {name: 'value', type: 'real'},
    {name: 'time', type: 'timestamp'},
    {name: 'id', type: 'string'}
  ];
  return {
    id: 'test',
    label: 'Test',
    color: [18, 147, 154],
    allIndexes: rows.map((_, i) => i),
    filteredIndex: rows.map((_, i) => i),
    fields,
    getValue: (name, idx) => rows[idx][name]
  };
}

test('charts -> createChart builders', t => {
  const dataset = mockDataset([{category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'}]);
  t.equal(createChart({type: ChartType.bigNumber, dataset}).type, ChartType.bigNumber);
  t.equal(createChart({type: ChartType.barChart, dataset}).type, ChartType.barChart);
  t.equal(createChart({type: ChartType.horizontalBar, dataset}).type, ChartType.horizontalBar);
  t.equal(createChart({type: ChartType.lineChart, dataset}).type, ChartType.lineChart);
  t.equal(createChart({type: ChartType.heatmapChart, dataset}).type, ChartType.heatmapChart);
  t.equal(createChart({type: ChartType.pivotTable, dataset}).type, ChartType.pivotTable);
  t.equal(
    createChart({type: LayerChartType.BREAKDOWN_BY_CATEGORY, dataset, layerId: 'l1'})
      .layerChartType,
    LayerChartType.BREAKDOWN_BY_CATEGORY
  );
  t.equal(createChart({type: LayerChartType.TIME_SERIES, dataset}), null);
  t.end();
});

test('charts -> buildBigNumber count and sum', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'},
    {category: 'B', value: 5, time: new Date('2020-01-02'), id: '1'}
  ]);
  t.equal(buildBigNumber({dataset, applyFilters: true}).value, 2);
  t.equal(
    buildBigNumber({
      dataset,
      applyFilters: true,
      axis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'}
    }).value,
    15
  );
  t.end();
});

test('charts -> buildGroupedBins unique categories', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'},
    {category: 'A', value: 2, time: new Date('2020-01-01'), id: '1'},
    {category: 'B', value: 5, time: new Date('2020-01-02'), id: '2'}
  ]);
  const bins = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'}
  });
  const byKey = Object.fromEntries(bins.map(bin => [bin.key, bin.value]));
  t.equal(byKey.A, 12);
  t.equal(byKey.B, 5);
  t.end();
});

test('charts -> heatmap and pivot table', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01'), id: 'x'},
    {category: 'B', value: 4, time: new Date('2020-01-01'), id: 'x'},
    {category: 'A', value: 1, time: new Date('2020-01-01'), id: 'y'}
  ]);
  const cells = buildHeatmapCells({
    dataset,
    applyFilters: true,
    xAxis: {field: {name: 'id', type: 'string'}, aggregation: BinType.uniqueBin},
    yAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'}
  });
  t.ok(cells.some(cell => cell.x === 'x' && cell.y === 'A' && cell.value === 10));
  const table = buildPivotTable({
    dataset,
    applyFilters: true,
    rowField: 'category',
    columnField: 'id',
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'}
  });
  t.equal(table.values.A.x, 10);
  t.equal(table.values.A.y, 1);
  t.end();
});

test('charts -> time series and hover indexes', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01T00:00:00Z'), id: '1'},
    {category: 'A', value: 5, time: new Date('2020-01-02T00:00:00Z'), id: '1'},
    {category: 'B', value: 99, time: new Date('2020-01-02T00:00:00Z'), id: '2'}
  ]);
  const bins = buildTimeSeries({
    dataset,
    indexes: [0, 1],
    xAxis: {field: {name: 'time', type: 'timestamp'}, aggregation: BinType.timeBin},
    yAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'},
    interval: 'day'
  });
  t.equal(bins.length, 2);
  const chart = createChart({
    type: LayerChartType.BREAKDOWN_BY_CATEGORY,
    dataset,
    layerId: 'l1'
  });
  chart.chartDisplay.idField = 'id';
  t.deepEqual(getHoverRowIndexes(dataset, chart, 0), [0, 1]);
  t.end();
});

test('charts -> computeDatasetChart big number', t => {
  const dataset = mockDataset([{category: 'A', value: 3, time: new Date('2020-01-01'), id: '1'}]);
  const chart = createChart({type: ChartType.bigNumber, dataset});
  const view = computeDatasetChart(chart, dataset);
  t.equal(view.kind, 'bigNumber');
  t.ok(typeof view.value === 'number');
  t.end();
});
