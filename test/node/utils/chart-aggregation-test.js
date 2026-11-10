// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {timeToUnixMilli} from '@kepler.gl/utils';
import {processCsvData} from '@kepler.gl/processors';
import {KeplerTable} from '@kepler.gl/table';

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
  propsForChartDatasetChange,
  toChartableDataset,
  computeDatasetChart,
  formatNumber,
  displayBinKey,
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

test('charts -> boolean unique bins keep scalar boolean filter values', t => {
  const rows = [
    {flag: true, value: 1},
    {flag: false, value: 2},
    {flag: true, value: 3}
  ];
  const dataset = {
    id: 'bools',
    label: 'Bools',
    allIndexes: [0, 1, 2],
    filteredIndex: [0, 1, 2],
    fields: [
      {name: 'flag', type: 'boolean'},
      {name: 'value', type: 'real'}
    ],
    getValue: (name, idx) => rows[idx][name]
  };
  const bins = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'flag', type: 'boolean'}, aggregation: BinType.uniqueBin},
    valueAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'}
  });
  const byKey = Object.fromEntries(bins.map(bin => [String(bin.key), bin]));
  t.deepEqual(byKey.true.filterValue, [true]);
  t.deepEqual(byKey.false.filterValue, [false]);
  t.equal(byKey.true.value, 4);
  t.end();
});

test('charts -> bar without category field is empty', t => {
  const dataset = mockDataset([{category: 'A', value: 10, time: new Date('2020-01-01'), id: '1'}]);
  const chart = createChart({type: ChartType.barChart, dataset});
  chart.xAxis = {field: null, aggregation: BinType.uniqueBin};
  const view = computeDatasetChart(chart, dataset);
  t.equal(view.kind, 'bars');
  t.deepEqual(view.bins, []);
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
  const first = displayBinKey(String(bins[0].key));
  const last = displayBinKey(String(bins[bins.length - 1].key));
  t.ok(/2(\.\d+)?/.test(first), `first bin starts near min, got ${first}`);
  t.ok(/[78]/.test(last), `last bin reaches max, got ${last}`);
  t.end();
});

test('charts -> numeric bins keep distinct keys when compact labels collide', t => {
  const rows = Array.from({length: 20}, (_, i) => ({
    category: 'A',
    value: 1e6 + i * 500,
    time: new Date('2020-01-01'),
    id: String(i)
  }));
  const dataset = mockDataset(rows);
  const bins = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: {field: {name: 'value', type: 'real'}, aggregation: BinType.numericBin},
    valueAxis: {field: null, aggregation: 'count'},
    numGroups: 10,
    sort: 'dataOrder',
    truncate: false
  });
  const keys = bins.map(bin => bin.key);
  t.equal(new Set(keys).size, keys.length, 'numeric bin keys must be unique');
  t.ok(bins.length >= 8, `expected ~10 bins, got ${bins.length}`);
  t.end();
});

test('charts -> time bins retain every range when display labels collide', t => {
  const start = Date.UTC(2020, 0, 1);
  const rows = Array.from({length: 31}, (_, i) => ({time: start + i * 1000, category: 'A'}));
  const dataset = mockDataset(rows);
  const timeAxis = {field: {name: 'time', type: 'timestamp'}, aggregation: BinType.timeBin};
  const categoryAxis = {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin};
  const valueAxis = {field: null, aggregation: 'count'};
  const chart = {
    ...createChart({type: ChartType.barChart, dataset}),
    xAxis: timeAxis,
    yAxis: valueAxis,
    numGroups: 10
  };
  const {bins} = computeDatasetChart(chart, dataset);
  t.equal(bins.length, 10, 'all ten bins survive');
  t.equal(new Set(bins.map(bin => bin.key)).size, 10, 'each bin has its own identity');
  t.deepEqual(
    bins.map(bin => bin.count),
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 4]
  );
  t.equal(
    bins.reduce((total, bin) => total + bin.value, 0),
    31,
    'no rows are lost'
  );
  t.deepEqual(
    bins.map(bin => bin.filterValue),
    bins.map((_, i) => [start + i * 3000, start + (i + 1) * 3000]),
    'each bin keeps its own original numeric filter range in chronological order'
  );
  const label = '2020-01-01 00:00 – 2020-01-01 00:00';
  t.ok(
    bins.every(bin => displayBinKey(bin.key) === label),
    'readable labels are unchanged'
  );
  t.equal(bins[9].key, label, 'legacy selected key still identifies the previously retained bin');
  const identities = bins.map(({key, filterValue}) => ({key, filterValue}));
  t.deepEqual(
    JSON.parse(JSON.stringify(identities)),
    identities,
    'identities and ranges survive JSON'
  );
  t.deepEqual(computeDatasetChart(chart, dataset).bins, bins, 'identities are deterministic');
  const horizontal = computeDatasetChart(
    {...chart, type: ChartType.horizontalBar, xAxis: valueAxis, yAxis: timeAxis},
    dataset
  );
  t.deepEqual(horizontal.bins, bins, 'horizontal charts use the same bins');
  const grouped = buildGroupedBins({
    dataset,
    applyFilters: true,
    binAxis: timeAxis,
    valueAxis,
    groupByAxis: categoryAxis
  });
  t.deepEqual(
    grouped.map(bin => bin.series[0].count),
    bins.map(bin => bin.count)
  );
  const cells = buildHeatmapCells({
    dataset,
    applyFilters: true,
    xAxis: timeAxis,
    yAxis: categoryAxis,
    valueAxis
  });
  t.equal(cells.length, 10, 'heatmap keeps every time column');
  t.deepEqual(
    cells.map(cell => cell.filterValueX),
    bins.map(bin => bin.filterValue)
  );
  t.deepEqual(
    cells.map(cell => cell.value),
    bins.map(bin => bin.value)
  );
  const table = buildPivotTable({
    dataset,
    applyFilters: true,
    xAxis: timeAxis,
    yAxis: categoryAxis,
    valueAxis
  });
  t.deepEqual(
    table.columnKeys,
    bins.map(bin => bin.key),
    'pivot preserves ordered identities'
  );
  t.deepEqual(
    table.columnKeys.map(key => table.values.A[key]),
    bins.map(bin => bin.count)
  );
  t.end();
});

test('charts -> time range identities handle fine precision, UTC boundaries, and empty input', t => {
  const timeAxis = {field: {name: 'time', type: 'timestamp'}, aggregation: BinType.timeBin};
  const cases = [
    ['epoch zero', 0, 30],
    ['negative epoch', -30000, -15000],
    ['across epoch', -15000, 15000],
    ['fractional millisecond boundaries', 0, 1],
    ['millisecond boundaries at modern epoch', Date.UTC(2020, 0, 1), Date.UTC(2020, 0, 1) + 1],
    ['crossing UTC midnight', Date.UTC(2020, 0, 1, 23, 59, 59), Date.UTC(2020, 0, 2, 0, 0, 1)],
    ['subday bins with date-only labels', Date.UTC(2020, 0, 1), Date.UTC(2020, 0, 16)],
    [
      'DST fall back',
      Date.parse('2020-11-01T01:00:00-04:00'),
      Date.parse('2020-11-01T01:00:00-05:00')
    ]
  ];
  for (const [name, start, end] of cases) {
    const dataset = mockDataset([{time: start}, {time: new Date(end)}]);
    const bins = buildGroupedBins({dataset, applyFilters: true, binAxis: timeAxis, numGroups: 10});
    t.equal(bins.length, 10, `${name}: all ranges remain`);
    t.equal(new Set(bins.map(bin => bin.key)).size, 10, `${name}: unique identities`);
    t.equal(
      bins.reduce((n, bin) => n + bin.count, 0),
      2,
      `${name}: rows are retained`
    );
    t.equal(bins[0].filterValue[0], start, `${name}: starts at minimum`);
    t.equal(bins[9].filterValue[1], end, `${name}: ends at maximum`);
    t.ok(
      bins.every((bin, i) => i === 0 || bins[i - 1].filterValue[1] === bin.filterValue[0]),
      `${name}: adjacent ranges remain ordered`
    );
  }
  for (const rows of [[], [{time: 'invalid'}, {time: new Date(NaN)}]]) {
    t.deepEqual(
      buildGroupedBins({dataset: mockDataset(rows), applyFilters: true, binAxis: timeAxis}),
      []
    );
  }
  const identical = buildGroupedBins({
    dataset: mockDataset([{time: 0}, {time: 0}]),
    applyFilters: true,
    binAxis: timeAxis
  });
  t.equal(identical.length, 1, 'equal timestamps still produce one bin');
  t.equal(identical[0].count, 2);
  t.deepEqual(identical[0].filterValue, [0, 0]);
  const unique = buildGroupedBins({
    dataset: mockDataset([{time: '2020-01-01T00:00:00Z'}, {time: '2020-01-11T00:00:00Z'}]),
    applyFilters: true,
    binAxis: timeAxis
  });
  t.ok(
    unique.every(bin => bin.key === displayBinKey(bin.key)),
    'noncolliding keys are unchanged'
  );
  const period = buildTimeSeries({
    dataset: mockDataset([{time: 0}, {time: 30000}]),
    indexes: [0, 1],
    xAxis: timeAxis,
    interval: 'hour'
  });
  t.equal(period.length, 1, 'period grouping is unchanged');
  t.equal(period[0].key, '1970-01-01 00:00');
  t.equal(period[0].count, 2);
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
    xAxis: {field: {name: 'id', type: 'string'}, aggregation: BinType.uniqueBin},
    yAxis: {field: {name: 'category', type: 'string'}, aggregation: BinType.uniqueBin},
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

test('charts -> calendar dates use UTC days without shifting timestamp instants', t => {
  const values = [
    '09/17/2016',
    '9/17/2016',
    '2016/9/17',
    '2016-09-17',
    new Date('2016-09-17T00:00:00Z'),
    Date.UTC(2016, 8, 17),
    '2016-09-17T00:00:00+03:00',
    '2016-09-17T23:00:00-04:00',
    null,
    undefined,
    '',
    'invalid',
    '02/30/2016',
    '2016-02-30',
    '13/17/2016'
  ];
  const dataset = mockDataset(values.map(time => ({time, value: 1})));
  const options = {
    dataset,
    indexes: dataset.allIndexes,
    xAxis: {field: {name: 'time', type: 'date'}, aggregation: BinType.timeBin},
    yAxis: {field: {name: 'value', type: 'real'}, aggregation: 'sum'},
    interval: 'day'
  };
  const bins = buildTimeSeries(options);
  t.deepEqual(
    bins.map(bin => [bin.key, bin.value]),
    [
      ['2016-09-16', 1],
      ['2016-09-17', 6],
      ['2016-09-18', 1]
    ]
  );
  t.deepEqual(bins[1].filterValue, [Date.UTC(2016, 8, 17), Date.UTC(2016, 8, 18)]);
  const grouped = buildGroupedBins({
    dataset: mockDataset([
      {time: '09/17/2016', value: 1},
      {time: '09/19/2016', value: 1}
    ]),
    numGroups: 2,
    applyFilters: true,
    binAxis: {...options.xAxis, interval: 'day'},
    valueAxis: options.yAxis
  });
  t.equal(grouped.length, 2, 'uses the requested two time bins');
  t.equal(grouped[0].filterValue[0], Date.UTC(2016, 8, 17));
  t.equal(grouped[grouped.length - 1].filterValue[1], Date.UTC(2016, 8, 19));
  t.end();
});

test('charts -> zone-less year-first timestamps use UTC instants', t => {
  const cases = [
    ['2016-09-17 00:00:00', Date.UTC(2016, 8, 17)],
    ['2016-9-7 1:2:3', Date.UTC(2016, 8, 7, 1, 2, 3)],
    ['2016/9/17 0:0:0', Date.UTC(2016, 8, 17)],
    ['2016-09-17T00:00', Date.UTC(2016, 8, 17)],
    ['2016-09-17T12:34:56.123456', Date.UTC(2016, 8, 17, 12, 34, 56, 123)],
    [' 2016-09-17 12:34:56.1 ', Date.UTC(2016, 8, 17, 12, 34, 56, 100)],
    ['2016-02-29 00:00:00', Date.UTC(2016, 1, 29)],
    ['2016-09-17T24:00:00', Date.UTC(2016, 8, 18)],
    ['2020-03-08 02:30:00', Date.UTC(2020, 2, 8, 2, 30)],
    ['2020-11-01 01:30:00', Date.UTC(2020, 10, 1, 1, 30)],
    ['0099-01-01 00:00:00', Date.parse('0099-01-01T00:00:00Z')],
    ['2016-09-17T00:00:00Z', Date.UTC(2016, 8, 17)],
    ['2016-09-17T00:00:00+03:00', Date.UTC(2016, 8, 16, 21)],
    ['2016-09-17T23:00:00-04:00', Date.UTC(2016, 8, 18, 3)],
    [new Date('2016-09-17T00:00:00Z'), Date.UTC(2016, 8, 17)],
    [0, 0],
    [-1000, -1000]
  ];
  const timeAxis = {field: {name: 'time', type: 'timestamp'}, aggregation: BinType.timeBin};
  for (const [time, expected] of cases) {
    const dataset = mockDataset([{time}]);
    const bins = buildGroupedBins({dataset, applyFilters: true, binAxis: timeAxis});
    t.equal(bins.length, 1, `${time}: row is retained`);
    t.deepEqual(bins[0]?.filterValue, [expected, expected], `${time}: expected instant`);
  }
  const value = '2016-09-17 00:00:00';
  const expected = timeToUnixMilli(value, 'YYYY-M-D H:m:s');
  const dataset = mockDataset([{time: value}]);
  const bins = buildTimeSeries({
    dataset,
    indexes: dataset.allIndexes,
    xAxis: timeAxis,
    interval: 'day'
  });
  t.equal(bins[0].key, '2016-09-17', 'calendar day agrees with the field parser');
  t.deepEqual(bins[0].filterValue, [expected, expected + 86400000]);
  t.end();
});

test('charts -> zone-less timestamps reject invalid calendars and clocks', t => {
  const values = [
    '2016-02-30 00:00:00',
    '2015-02-29T12:00:00',
    '2016-13-01 00:00:00',
    '2016-00-01 00:00:00',
    '2016-01-00 00:00:00',
    '2016-09-17 25:00:00',
    '2016-09-17 00:60:00',
    '2016-09-17 00:00:60',
    '2016-09-17T24:00:01',
    '2016-09-17T24:00:00.1',
    null,
    undefined,
    '',
    ' '
  ];
  const dataset = mockDataset(values.map(time => ({time})));
  t.deepEqual(
    buildTimeSeries({
      dataset,
      indexes: dataset.allIndexes,
      xAxis: {field: {name: 'time', type: 'timestamp'}, aggregation: BinType.timeBin},
      interval: 'day'
    }),
    []
  );
  t.end();
});

test('charts -> zone-less time bins retain UTC range identities for saved selections', t => {
  const times = ['2016-09-17 00:00:00', '2016-09-17 00:00:30', '2016-09-17 00:01:00'];
  const dataset = mockDataset(times.map(time => ({time})));
  const utcDataset = mockDataset(times.map(time => ({time: `${time.replace(' ', 'T')}Z`})));
  const chart = createChart({type: ChartType.barChart, dataset});
  chart.xAxis = {
    field: {name: 'time', type: 'timestamp'},
    aggregation: BinType.timeBin,
    numBins: 10
  };
  const utcBins = computeDatasetChart(chart, utcDataset).bins;
  chart.crossFilter = {
    enabled: true,
    fieldNames: {x: 'time'},
    value: {x: utcBins[0].key}
  };
  const restored = JSON.parse(JSON.stringify(chart));
  const bins = computeDatasetChart(restored, dataset).bins;
  t.deepEqual(bins, utcBins, 'keys, membership, and filter ranges agree with explicit UTC');
  t.equal(bins[0].key, restored.crossFilter.value.x, 'saved UTC selection keeps its identity');
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

test('charts -> toChartableDataset does not look up missing fields', t => {
  const missingLookups = [];
  const raw = {
    id: 'new-ds',
    allIndexes: [0, 1, 2],
    filteredIndex: [0, 1, 2],
    fields: [{name: 'mag', type: 'real'}],
    getValue: name => {
      missingLookups.push(name);
      return null;
    }
  };
  const dataset = toChartableDataset(raw);
  t.equal(dataset.getValue('Join_Count', 0), null);
  t.equal(dataset.getValue('Join_Count', 1), null);
  t.deepEqual(missingLookups, [], 'KeplerTable.getValue must not run for unknown fields');
  t.equal(dataset.getValue('mag', 0), null);
  t.deepEqual(missingLookups, ['mag']);
  t.end();
});

test('charts -> switching dataset rebuilds line-chart axes from the new table', t => {
  const oldDataset = mockDataset([
    {category: 'A', value: 1, time: new Date('2020-01-01'), id: '1'}
  ]);
  const chart = createChart({type: ChartType.lineChart, dataset: oldDataset, dataId: 'old'});
  chart.xAxis = {field: {name: 'Join_Count', type: 'integer'}, aggregation: BinType.uniqueBin};
  chart.yAxis = {field: {name: 'Join_Count', type: 'integer'}, aggregation: 'sum'};
  const nextDataset = mockDataset([
    {category: 'B', value: 2, time: new Date('2021-01-01'), id: '2'}
  ]);
  nextDataset.id = 'new';
  const props = propsForChartDatasetChange(chart, nextDataset, {dataId: 'new'});
  t.equal(props.dataId, 'new');
  t.notEqual(props.xAxis.field.name, 'Join_Count');
  t.ok(nextDataset.fields.some(field => field.name === props.xAxis.field.name));
  t.notEqual(props.yAxis.field && props.yAxis.field.name, 'Join_Count');
  const view = computeDatasetChart({...chart, ...props}, nextDataset);
  t.equal(view.kind, 'line');
  t.ok(view.bins.length > 0);
  t.end();
});

test('charts -> stale line-chart field does not emit bins', t => {
  const dataset = mockDataset([{category: 'A', value: 1, time: new Date('2020-01-01'), id: '1'}]);
  const chart = createChart({type: ChartType.lineChart, dataset});
  chart.xAxis = {field: {name: 'Join_Count', type: 'integer'}, aggregation: BinType.uniqueBin};
  const view = computeDatasetChart(chart, dataset);
  t.equal(view.kind, 'line');
  t.deepEqual(view.bins, []);
  t.end();
});

test('charts -> imported day-first dates retain rows and calendar-day filters', t => {
  const data = processCsvData('date,value\n17/09/2016,1\n05/06/2016,2\n18/09/2016,3');
  const table = new KeplerTable({info: {id: 'day-first'}, color: [0, 0, 0]});
  table.updateSchema(data);
  const dataset = toChartableDataset(table);
  const options = {
    dataset,
    indexes: dataset.allIndexes,
    xAxis: {field: {name: 'date', type: 'date'}, aggregation: BinType.timeBin},
    yAxis: {field: {name: 'value', type: 'integer'}, aggregation: 'sum'},
    interval: 'day'
  };
  t.equal(dataset.fields[0].format, 'D/M/YYYY');
  const bins = buildTimeSeries(options);
  t.deepEqual(
    bins.map(bin => [bin.key, bin.value, bin.count]),
    [
      ['2016-06-05', 2, 1],
      ['2016-09-17', 1, 1],
      ['2016-09-18', 3, 1]
    ]
  );
  t.deepEqual(bins[0].filterValue, [Date.UTC(2016, 5, 5), Date.UTC(2016, 5, 6)]);
  const grouped = buildGroupedBins({
    dataset,
    applyFilters: true,
    numGroups: 2,
    binAxis: options.xAxis,
    valueAxis: options.yAxis
  });
  t.equal(
    grouped.reduce((count, bin) => count + bin.count, 0),
    3,
    'all rows reach time bins'
  );
  t.equal(
    grouped.reduce((sum, bin) => sum + bin.value, 0),
    6
  );
  t.end();
});

test('charts -> slash dates follow declared format and preserve the month-first default', t => {
  for (const format of ['D/M/YYYY', 'DD/MM/YYYY', 'M/D/YYYY', undefined]) {
    const dataset = mockDataset([
      {time: '05/06/2016'},
      {time: '17/09/2016'},
      {time: '31/02/2016'},
      {time: null},
      {time: ''}
    ]);
    dataset.fields.find(field => field.name === 'time').format = format;
    const bins = buildTimeSeries({
      dataset,
      indexes: dataset.allIndexes,
      xAxis: {field: {name: 'time', type: 'date'}, aggregation: BinType.timeBin},
      yAxis: {aggregation: 'count'},
      interval: 'day'
    });
    const dayFirst = format?.startsWith('D');
    t.deepEqual(
      bins.map(bin => [bin.key, bin.count]),
      dayFirst
        ? [
            ['2016-06-05', 1],
            ['2016-09-17', 1]
          ]
        : [['2016-05-06', 1]],
      `respects ${format || 'missing format'}, skipping invalid values`
    );
  }
  t.end();
});
