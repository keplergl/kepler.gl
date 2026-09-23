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
  formatNumber,
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

test('charts -> buildBigNumber percentiles and countUnique', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'},
    {category: 'A', value: 20, time: new Date('2020-01-01'), id: '2'},
    {category: 'B', value: 30, time: new Date('2020-01-02'), id: '3'},
    {category: 'C', value: 40, time: new Date('2020-01-02'), id: '4'}
  ]);
  t.equal(
    buildBigNumber({
      dataset,
      applyFilters: true,
      axis: {field: {name: 'value', type: 'real'}, aggregation: 'p50'}
    }).value,
    25
  );
  t.equal(
    buildBigNumber({
      dataset,
      applyFilters: true,
      axis: {field: {name: 'category', type: 'string'}, aggregation: 'countUnique'}
    }).value,
    3
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

test('charts -> numeric bin axis spans full domain', t => {
  const dataset = mockDataset([
    {category: 'A', value: 2.54, time: new Date('2020-01-01'), id: '1'},
    {category: 'A', value: 2.55, time: new Date('2020-01-01'), id: '2'},
    {category: 'A', value: 2.56, time: new Date('2020-01-01'), id: '3'},
    {category: 'B', value: 5, time: new Date('2020-01-02'), id: '4'},
    {category: 'C', value: 8, time: new Date('2020-01-02'), id: '5'}
  ]);
  const bins = buildGroupedBins({
    dataset,
    applyFilters: true,
    // uniqueBin leftover should still histogram real fields
    binAxis: {field: {name: 'value', type: 'real'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: null, aggregation: 'count'},
    numGroups: 5,
    sort: 'dataOrder',
    truncate: false
  });
  t.ok(bins.length >= 2, 'should produce multiple numeric bins');
  const first = String(bins[0].key);
  const last = String(bins[bins.length - 1].key);
  t.ok(/2(\.\d+)?/.test(first), `first bin starts near min, got ${first}`);
  t.ok(/[78]/.test(last), `last bin reaches max, got ${last}`);
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

test('charts -> extra aggregations', t => {
  const dataset = mockDataset([
    {category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'},
    {category: 'A', value: 2, time: new Date('2020-01-01'), id: '1'},
    {category: 'B', value: 5, time: new Date('2020-01-02'), id: '2'}
  ]);
  const unique = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'countUnique'}
  });
  t.equal(unique.find(bin => bin.key === 'A').value, 2);
  const mode = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'mode'}
  });
  t.ok(mode.find(bin => bin.key === 'A'));
  const stdev = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'stdev'}
  });
  t.ok(stdev.find(bin => bin.key === 'A').value > 0);
  t.end();
});

test('charts -> integer categorical fields', t => {
  const fields = [
    {name: 'code', type: 'integer'},
    {name: 'value', type: 'real'}
  ];
  const rows = [
    {code: 1, value: 10},
    {code: 2, value: 5}
  ];
  const dataset = {
    id: 'codes',
    label: 'Codes',
    allIndexes: [0, 1],
    filteredIndex: [0, 1],
    fields,
    getValue: (name, idx) => rows[idx][name]
  };
  const chart = createChart({type: ChartType.barChart, dataset});
  t.equal(chart.xAxis.field.name, 'code');
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

test('charts -> formatNumber uses compact SI instead of scientific notation', t => {
  t.equal(formatNumber(767000), '767k');
  t.equal(formatNumber(123456), '123.5k');
  t.equal(formatNumber(1500000), '1.5M');
  t.equal(formatNumber(9999), '9,999');
  t.equal(formatNumber(42), '42');
  t.equal(formatNumber(3.14159), '3.142');
  t.equal(formatNumber(-1500000), '-1.5M');
  t.end();
});
