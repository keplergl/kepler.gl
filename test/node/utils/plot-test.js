// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  histogramFromThreshold,
  histogramFromValues,
  histogramFromTimeIntervals,
  mergePolygonLayerIndexes,
  runGpuFilterForPlot,
  getLineChart,
  mergePlotGroupBy,
  lineChartSeriesLegend,
  PLOT_GROUP_OTHERS_NAME
} from '@kepler.gl/utils';

const values1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

test('Utils -> mergePolygonLayerIndexes', t => {
  const baseIndex = [0, 1, 2, 3];

  t.deepEqual(
    mergePolygonLayerIndexes(baseIndex, {}),
    baseIndex,
    'should return base index when no layers are polygon-filtered'
  );

  t.deepEqual(
    mergePolygonLayerIndexes(baseIndex, {layerA: [0, 2]}),
    [0, 2],
    'should keep rows visible on a single targeted layer'
  );

  t.deepEqual(
    mergePolygonLayerIndexes(baseIndex, {layerA: [0, 2], layerB: [1]}),
    [0, 1, 2],
    'should keep the union of rows visible on any targeted layer'
  );

  t.deepEqual(
    mergePolygonLayerIndexes(baseIndex, {layerA: [], layerB: []}),
    [],
    'should export no rows when all targeted layers are empty'
  );

  t.end();
});

function mockGpuPlotDataset(rows) {
  return {
    id: 'dsA',
    filteredIndex: rows.map((_, i) => i),
    filteredIndexByLayer: {},
    dataContainer: {},
    gpuFilter: {
      filterRange: [
        [0, 10],
        [0, 10]
      ],
      filterValueUpdateTriggers: {
        gpu0: {name: 'colA'},
        gpu1: {name: 'colB'}
      },
      filterValueAccessor:
        () =>
        () =>
        ({index}) =>
          rows[index]
    }
  };
}

test('Utils -> runGpuFilterForPlot applies polygon layer indexes', t => {
  const dataset = {
    id: 'puppy',
    filteredIndex: [0, 1, 2, 3],
    filteredIndexByLayer: {layerA: [0, 2]},
    dataContainer: {},
    gpuFilter: {
      filterRange: [],
      filterValueUpdateTriggers: {},
      filterValueAccessor: () => () => () => []
    }
  };

  t.deepEqual(
    runGpuFilterForPlot(dataset),
    [0, 2],
    'should start plots from polygon-visible rows when filteredIndexByLayer is set'
  );

  t.deepEqual(
    runGpuFilterForPlot({...dataset, filteredIndexByLayer: {}}),
    [0, 1, 2, 3],
    'should fall back to filteredIndex when no polygon layer indexes exist'
  );

  t.end();
});

test('Utils -> runGpuFilterForPlot skips only this dataset column on multi-dataset filters', t => {
  // GPU channel 0 = colA, channel 1 = colB. Range [0, 10] on both.
  // Row 0: both in range. Row 1: colB out. Row 2: colA out. Row 3: both out.
  const dataset = mockGpuPlotDataset([
    [5, 5],
    [5, 100],
    [100, 5],
    [100, 100]
  ]);

  t.deepEqual(
    runGpuFilterForPlot(dataset, {
      dataId: ['dsA', 'dsB'],
      name: ['colA', 'colB']
    }),
    [0, 2],
    'should skip only this dataset column and still apply sibling GPU channels'
  );

  t.deepEqual(
    runGpuFilterForPlot(dataset, {
      dataId: ['dsA'],
      name: ['colA']
    }),
    [0, 2],
    'should skip the plotted field on a single-dataset filter and still apply other GPU channels'
  );

  t.deepEqual(
    runGpuFilterForPlot(dataset, undefined, ['colA', 'colB']),
    [0, 1, 2, 3],
    'should skip every extra field name passed by charts without changing filter pairing'
  );

  t.end();
});

test('Utils -> histogramFromThreshold', t => {
  const thresholds1 = [1, 3, 6, 13];

  const bins1 = histogramFromThreshold(thresholds1, values1);
  const expectedHistogram1 = [
    {
      count: 2,
      indexes: [1, 2],
      x0: 1,
      x1: 3
    },
    {
      count: 3,
      indexes: [3, 4, 5],
      x0: 3,
      x1: 6
    },
    {
      count: 7,
      indexes: [6, 7, 8, 9, 10, 11, 12],
      x0: 6,
      x1: 13
    },
    {
      count: 1,
      indexes: [13],
      x0: 13,
      x1: 13
    }
  ];
  expectedHistogram1.forEach(bin => {
    bin.indexes.x0 = bin.x0;
    bin.indexes.x1 = bin.x1;
  });
  t.deepEqual(bins1.length, 4, 'should create histogram with 4 bins.');
  t.deepEqual(expectedHistogram1, bins1, 'should create histogram as expectedHistogram1.');

  const bins2 = histogramFromThreshold([], values1);
  t.deepEqual(bins2.length, 0, 'should create no histogram no threshold.');

  const bins3 = histogramFromThreshold(thresholds1, []);
  t.deepEqual(bins3.length, 0, 'should create no histogram no values.');

  const valueAccessor = idx => values1[idx];
  const filteredIndex = [0, 1, 3, 5, 7, 9, 11];
  const bins4 = histogramFromThreshold(thresholds1, filteredIndex, valueAccessor);

  const expectedHistogram4 = [
    {
      count: 2,
      indexes: [0, 1],
      x0: 1,
      x1: 3
    },
    {
      count: 1,
      indexes: [3],
      x0: 3,
      x1: 6
    },
    {
      count: 4,
      indexes: [5, 7, 9, 11],
      x0: 6,
      x1: 13
    }
  ];
  expectedHistogram4.forEach(bin => {
    bin.indexes.x0 = bin.x0;
    bin.indexes.x1 = bin.x1;
  });

  t.deepEqual(bins4, expectedHistogram4, 'should create histogram with valueAccessor.');

  t.end();
});

test('Utils -> histogramFromValues', t => {
  const numBins = 4;
  const bins5 = histogramFromValues(values1, numBins);
  const expectedHistogram5 = [
    {
      count: 4,
      indexes: [1, 2, 3, 4],
      x0: 0,
      x1: 5
    },
    {
      count: 5,
      indexes: [5, 6, 7, 8, 9],
      x0: 5,
      x1: 10
    },
    {
      count: 4,
      indexes: [10, 11, 12, 13],
      x0: 10,
      x1: 15
    }
  ];
  expectedHistogram5.forEach(bin => {
    bin.indexes.x0 = bin.x0;
    bin.indexes.x1 = bin.x1;
  });

  // d3.histogram uses ticks() to find nice number of breaks (bins), so the
  // number of returned bins may be different than the input number of bins
  t.deepEqual(bins5, expectedHistogram5, 'should create histogram with 3 bins from values.');

  t.end();
});

test('Utils -> histogramFromTimeIntervals', t => {
  const thresholds = [0, 10, 20, 30];
  const starts = [5, 15, 0, 25];
  const ends = [15, 15, 30, null];

  const bins = histogramFromTimeIntervals(
    thresholds,
    [0, 1, 2, 3],
    idx => starts[idx],
    idx => ends[idx]
  );

  t.deepEqual(
    bins.map(b => ({count: b.count, indexes: b.indexes, x0: b.x0, x1: b.x1})),
    [
      {count: 2, indexes: [0, 2], x0: 0, x1: 10},
      {count: 3, indexes: [0, 1, 2], x0: 10, x1: 20},
      {count: 2, indexes: [2, 3], x0: 20, x1: 30}
    ],
    'should count a feature in every bin that overlaps [start, end]'
  );

  t.deepEqual(
    histogramFromTimeIntervals(
      thresholds,
      [0],
      idx => 10,
      idx => 10
    ),
    [{count: 1, indexes: [0], x0: 10, x1: 20}],
    'an instant at a bin boundary should land in the following bin'
  );

  t.deepEqual(
    histogramFromTimeIntervals(
      thresholds,
      [0],
      () => null,
      () => 20
    ),
    [],
    'should skip rows with no start time'
  );

  t.deepEqual(
    histogramFromTimeIntervals(
      [],
      [0],
      () => 5,
      () => 15
    ),
    [],
    'should return no bins without thresholds'
  );

  t.deepEqual(
    histogramFromTimeIntervals(
      thresholds,
      [0],
      () => 15,
      () => 5
    ),
    [],
    'should skip inverted intervals (end < start)'
  );

  t.end();
});

const groupedRows = [
  {v: 10, g: 'a'},
  {v: 30, g: 'b'},
  {v: 20, g: 'a'},
  {v: 5, g: 'c'},
  {v: 7, g: null}
];

function groupedDataset() {
  return {
    fields: [
      {name: 'v', type: 'integer', valueAccessor: ({index}) => groupedRows[index].v},
      {name: 'g', type: 'string', valueAccessor: ({index}) => groupedRows[index].g}
    ]
  };
}

const groupedBins = [
  {count: 3, indexes: [0, 1, 4], x0: 0, x1: 1},
  {count: 1, indexes: [2], x0: 1, x1: 2},
  {count: 1, indexes: [3], x0: 2, x1: 3}
];

function groupedFilter(groupBy) {
  return {
    dataId: ['ds'],
    yAxis: {name: 'v', type: 'integer'},
    plotType: {
      aggregation: 'sum',
      interval: '1-day',
      type: 'lineChart',
      groupBy
    },
    timeBins: {ds: {'1-day': groupedBins}}
  };
}

function seriesSummary(lineChart) {
  return {
    names: lineChart.series.names,
    colors: lineChart.series.colors,
    ys: lineChart.series.lines.map(line => line.map(point => point.y))
  };
}

test('Utils -> getLineChart groupBy splits series and folds the rest into Others', t => {
  const datasets = {ds: groupedDataset()};
  const colors = ['#111111', '#222222', '#333333'];
  const filter = groupedFilter({
    fieldName: 'g',
    numGroups: 2,
    groupOthers: true,
    colorRange: {colors}
  });

  const ungrouped = getLineChart(datasets, groupedFilter(null));
  t.deepEqual(
    seriesSummary(ungrouped).ys,
    [[47, 20, 5]],
    'should keep a single series when groupBy is cleared'
  );

  const grouped = getLineChart(datasets, filter);
  t.deepEqual(
    seriesSummary(grouped),
    {
      names: ['a', 'b', PLOT_GROUP_OTHERS_NAME],
      colors,
      ys: [[10, 20], [30], [5]]
    },
    'should keep the first groups and aggregate the rest as Others'
  );
  t.deepEqual(
    lineChartSeriesLegend(grouped),
    [
      {name: 'a', color: '#111111'},
      {name: 'b', color: '#222222'},
      {name: PLOT_GROUP_OTHERS_NAME, color: '#333333'}
    ],
    'should expose one legend entry per series'
  );

  const capped = getLineChart(datasets, {
    ...filter,
    plotType: {
      ...filter.plotType,
      groupBy: {...filter.plotType.groupBy, groupOthers: false}
    }
  });
  t.deepEqual(
    seriesSummary(capped).names,
    ['a', 'b'],
    'should drop groups past numGroups when groupOthers is off'
  );

  const cached = getLineChart(datasets, {...filter, lineChart: grouped});
  t.equal(cached, grouped, 'should reuse the line chart when groupBy and bins are unchanged');

  const narrowed = getLineChart(datasets, {
    ...filter,
    lineChart: grouped,
    plotType: {
      ...filter.plotType,
      groupBy: {...filter.plotType.groupBy, numGroups: 1, groupOthers: false}
    }
  });
  t.deepEqual(seriesSummary(narrowed).names, ['a'], 'should recompute when numGroups changes');

  t.end();
});

test('Utils -> mergePlotGroupBy fills defaults and clears', t => {
  const created = mergePlotGroupBy(null, {fieldName: 'city'});
  t.equal(created.fieldName, 'city', 'should keep the selected field');
  t.equal(created.numGroups, 10, 'should default max groups to 10');
  t.equal(created.groupOthers, false, 'should default group others off');
  t.ok(created.colorRange.colors.length >= 2, 'should assign a qualitative color range');
  t.equal(
    created.colorUI.colorRangeConfig.type,
    'qualitative',
    'should use a qualitative color UI'
  );

  const updated = mergePlotGroupBy(created, {numGroups: 3, groupOthers: true});
  t.equal(updated.fieldName, 'city', 'should keep the field when only the cap changes');
  t.equal(updated.numGroups, 3, 'should apply the new cap');
  t.equal(updated.groupOthers, true, 'should apply group others');
  t.equal(updated.colorRange, created.colorRange, 'should keep the existing series colors');

  t.equal(mergePlotGroupBy(updated, null), null, 'should clear groupBy');

  t.end();
});
