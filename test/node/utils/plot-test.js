// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';
import {TIME_INTERVALS} from '@kepler.gl/constants';
import {
  getBinThresholds,
  histogramFromThreshold,
  histogramFromValues,
  histogramFromTimeIntervals,
  getNumericBinThresholds,
  getNumericPlotInterval,
  getNumericRangeMinimum,
  intervalBinFromMarks,
  nextDown,
  nextUp,
  mergePolygonLayerIndexes,
  runGpuFilterForPlot,
  getLineChart,
  mergePlotGroupBy,
  lineChartSeriesLegend,
  PLOT_GROUP_OTHERS_NAME,
  PLOT_NUM_GROUPS_ALL,
  MAX_PLOT_NUM_GROUPS
} from '@kepler.gl/utils';

const values1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

test('Utils -> time thresholds bound allocation before expanding a millisecond domain', t => {
  const every = TIME_INTERVALS.millisecond.every;
  const stub = sinon.stub(TIME_INTERVALS.millisecond, 'every').callsFake(step => {
    const interval = every(step);
    return {
      ...interval,
      range(start, stop) {
        const requested = Math.ceil((stop - start) / step);
        if (requested > 2049) {
          throw new Error(`Intercepted unsafe allocation of ${requested} Dates`);
        }
        return interval.range(start, stop);
      }
    };
  });
  try {
    const start = Date.UTC(2020, 0, 1);
    const end = start + 86400000;
    const thresholds = getBinThresholds('1-millisecond', [start, end]);
    t.ok(thresholds.length <= 2049, 'should bound the number of bins including endpoint padding');
    t.equal(thresholds[0], start, 'should keep the full domain start');
    t.ok(thresholds[thresholds.length - 1] > end, 'should include the maximum in a complete bin');
    t.equal(
      histogramFromThreshold(thresholds, [start, end]).reduce((sum, bin) => sum + bin.count, 0),
      2,
      'should retain both endpoint rows instead of truncating the domain'
    );
  } catch (error) {
    t.fail(error.message);
  } finally {
    stub.restore();
  }
  t.end();
});

test('Utils -> time thresholds preserve safe calendar intervals and reject invalid domains', t => {
  t.equal(
    getBinThresholds('1-millisecond', [0, 2047]).length,
    2049,
    'should keep exactly 2048 bins'
  );
  t.ok(
    getBinThresholds('1-millisecond', [0, 2048]).length < 2049,
    'should coarsen one bin over the cap'
  );
  const dates = [Date.UTC(2020, 0, 1), Date.UTC(2020, 1, 1), Date.UTC(2020, 2, 1)];
  t.deepEqual(
    getBinThresholds('1-month', [dates[0], dates[1] + 1]),
    dates,
    'should preserve leap-year calendar boundaries'
  );
  t.deepEqual(
    getBinThresholds('1-month', [dates[0], dates[1]]),
    dates,
    'should retain inclusive maximum padding'
  );
  for (const interval of [
    '5-second',
    '15-minute',
    '3-hour',
    '2-day',
    '2-week',
    '3-month',
    '5-year'
  ]) {
    const [step, unitName] = interval.split('-');
    const unit = TIME_INTERVALS[unitName].every(Number(step));
    const start = Date.UTC(2020, 0, 2, 1, 2, 3);
    const end = Number(unit.offset(start, 3));
    const expected = unit.range(unit.floor(start), Number(unit.ceil(end)) + 1).map(Number);
    if (expected[expected.length - 1] === end) expected.push(Number(unit.offset(end)));
    t.deepEqual(
      getBinThresholds(interval, [start, end]),
      expected,
      `${interval} should keep calendar alignment`
    );
  }
  t.ok(
    getBinThresholds('1000000-week', [0, 86400000]).length <= 2049,
    'should bound large calendar steps'
  );
  for (const domain of [[], [NaN, 1], [0, Infinity], [2, 1], [0, 9e15]]) {
    t.deepEqual(
      getBinThresholds('1-millisecond', domain),
      [],
      'should reject an invalid time domain'
    );
  }
  for (const interval of [undefined, '', '0-day', '-1-day', 'no-such-unit']) {
    const thresholds = getBinThresholds(interval, [0, 86400000]);
    t.ok(
      thresholds.length > 1 && thresholds.length <= 2049,
      'should safely replace an invalid interval'
    );
    t.ok(thresholds[thresholds.length - 1] >= 86400000, 'should cover the full domain');
  }
  t.end();
});

test('Utils -> time thresholds stop before calendar padding overflows Date', t => {
  const setMonth = Date.prototype.setUTCMonth;
  let operations = 0;
  const stub = sinon.stub(Date.prototype, 'setUTCMonth').callsFake(function (...args) {
    if (++operations > 100) throw new Error('Intercepted unbounded calendar stepping');
    return setMonth.apply(this, args);
  });
  try {
    const july = Date.UTC(275760, 6, 1);
    const september = Date.UTC(275760, 8, 1);
    t.deepEqual(
      getBinThresholds('2-month', [july, july + 86400000]),
      [july, september],
      'should keep finite calendar boundaries near the Date limit'
    );
    t.deepEqual(
      getBinThresholds('2-month', [8640000000000000 - 86400000, 8640000000000000]),
      [],
      'should reject unrepresentable upper padding'
    );
    const minimum = -8640000000000000;
    const thresholds = getBinThresholds('2-month', [minimum, minimum + 86400000]);
    t.equal(
      thresholds[0],
      minimum,
      'should replace unrepresentable lower padding with a finite interval'
    );
    t.ok(
      thresholds.length <= 2049 && thresholds[thresholds.length - 1] > minimum + 86400000,
      'should bound the fallback and cover the entire domain'
    );
  } catch (error) {
    t.fail(error.message);
  } finally {
    stub.restore();
  }
  t.end();
});

test('Utils -> getNumericBinThresholds uses numeric units', t => {
  t.deepEqual(
    getNumericBinThresholds([-1.5, 1], 0.5),
    [-1.5, -1, -0.5, 0, 0.5, 1],
    'should preserve negative and fractional numeric boundaries'
  );
  t.deepEqual(
    getNumericBinThresholds([7, 8], 0.25),
    [7, 7.25, 7.5, 7.75, 8],
    'should bin the padded domain of a constant numeric field'
  );
  t.deepEqual(
    getNumericBinThresholds([-0.2, -0.19], 0.01),
    [-0.2, -0.19],
    'should not duplicate a decimal domain end because of floating-point division'
  );
  const maximumBins = getNumericBinThresholds([-4.42, 16.060000000000002], 0.01);
  t.equal(maximumBins.length, 2049, 'should keep exactly 2048 bins at the safety cap');
  t.equal(maximumBins[0], -4.42, 'should preserve the capped domain start');
  t.equal(
    maximumBins[maximumBins.length - 1],
    16.060000000000002,
    'should preserve the capped domain end'
  );
  t.ok(
    maximumBins.every((boundary, index) => index === 0 || boundary > maximumBins[index - 1]),
    'should generate only strictly increasing numeric boundaries'
  );
  const fallback = getNumericBinThresholds([0, 1], -1);
  t.ok(fallback.length > 2 && fallback.length < 100, 'should safely replace an invalid bin size');
  t.equal(fallback[0], 0, 'should keep the numeric domain start');
  t.equal(fallback[fallback.length - 1], 1, 'should keep the numeric domain end');
  t.end();
});

test('Utils -> getNumericPlotInterval ignores padded edge bins', t => {
  const filter = {
    domain: [-0.20000000000000004, -0.18999],
    step: 0.00001,
    plotType: {},
    bins: {
      dataset: [
        {x0: -0.20000000000000004, x1: -0.2},
        {x0: -0.2, x1: -0.1995},
        {x0: -0.1995, x1: -0.199}
      ]
    }
  };

  t.equal(
    getNumericPlotInterval(filter),
    0.0005,
    'should use the median positive width instead of a floating-point edge sliver'
  );
  t.equal(
    getNumericPlotInterval({...filter, plotType: {numericInterval: 0.0025}}),
    0.0025,
    'should preserve an explicit numeric interval'
  );
  t.end();
});

test('Utils -> numeric range precision follows representable domain spacing', t => {
  const domains = [
    [0, 1e-20],
    [1e12, 1e12 + 0.001],
    [0, 0.1]
  ];

  for (const domain of domains) {
    const [start, end] = domain;
    const span = end - start;
    const minimum = getNumericRangeMinimum(domain);
    t.ok(minimum > 0, `${domain} should have a positive representable minimum`);
    t.ok(minimum <= span, `${domain} minimum should not exceed its span`);
    t.ok(start + minimum > start, `${domain} minimum should advance the lower endpoint`);
    t.ok(end - minimum < end, `${domain} minimum should retreat the upper endpoint`);
  }

  t.equal(nextDown(nextUp(1e12)), 1e12, 'adjacent numeric values should round-trip');
  t.equal(nextDown(0), -Number.MIN_VALUE, 'zero should have a negative predecessor');
  t.end();
});

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

function mockGpuPlotDataset(rows, fieldNames = ['colA', 'colB']) {
  return {
    id: 'dsA',
    filteredIndex: rows.map((_, i) => i),
    filteredIndexByLayer: {},
    dataContainer: {},
    gpuFilter: {
      filterRange: fieldNames.map(() => [0, 10]),
      filterValueUpdateTriggers: fieldNames.reduce(
        (triggers, name, index) => ({...triggers, [`gpu${index}`]: {name}}),
        {}
      ),
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

  t.deepEqual(
    runGpuFilterForPlot(dataset, undefined, undefined, [1, 3]),
    [1, 3],
    'should plot from an explicit polygon-filtered base instead of stale polygon indexes'
  );

  t.end();
});

test('Utils -> runGpuFilterForPlot skips the plotted filter GPU channels', t => {
  // Channels 0 and 1 belong to the plotted interval filter. Channel 2 belongs
  // to a sibling filter that deliberately uses the same start field name.
  const dataset = mockGpuPlotDataset(
    [
      [5, 5, 5],
      [5, 100, 5],
      [100, 5, 100],
      [100, 100, 5]
    ],
    ['start', 'end', 'start']
  );

  t.deepEqual(
    runGpuFilterForPlot(dataset, {
      gpu: true,
      dataId: ['dsA'],
      name: ['start'],
      endName: ['end'],
      gpuChannel: [0],
      gpuEndChannel: [1]
    }),
    [0, 1, 3],
    'should skip both own interval channels and still apply a same-field sibling channel'
  );

  t.deepEqual(
    runGpuFilterForPlot(mockGpuPlotDataset([[5], [100]], ['start']), {
      gpu: false,
      dataId: ['dsA'],
      name: ['start']
    }),
    [0],
    'should apply a same-field GPU sibling when the plotted filter runs on the CPU'
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
      gpu: true,
      dataId: ['dsB', 'dsA'],
      name: ['colB', 'colA'],
      gpuChannel: [3, 0]
    }),
    [0, 2],
    'should use the channel paired with the current dataset in a multi-dataset filter'
  );

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

test('Utils -> getLineChart aggregates numeric range bins on a numeric X axis', t => {
  const rows = [
    {x: -1.25, y: 2},
    {x: -0.75, y: 3},
    {x: -0.25, y: null},
    {x: 0.25, y: 5}
  ];
  const bins = [
    {count: 1, indexes: [0], x0: -1.5, x1: -1},
    {count: 1, indexes: [1], x0: -1, x1: -0.5},
    {count: 1, indexes: [2], x0: -0.5, x1: 0},
    {count: 1, indexes: [3], x0: 0, x1: 0.5}
  ];
  const chart = getLineChart(
    {
      ds: {
        fields: [
          {name: 'x', type: 'real', valueAccessor: ({index}) => rows[index].x},
          {name: 'y', type: 'real', valueAccessor: ({index}) => rows[index].y}
        ]
      }
    },
    {
      type: 'range',
      dataId: ['ds'],
      yAxis: {name: 'y', type: 'real'},
      plotType: {type: 'lineChart', aggregation: 'sum', numericInterval: 0.5},
      bins: {ds: bins}
    }
  );

  t.deepEqual(chart.xDomain, [-1.5, 0.5], 'should keep numeric X-domain values');
  t.equal(chart.interval, 0.5, 'should cache the numeric bin size without calendar conversion');
  t.deepEqual(
    chart.series.lines.map(line => line.map(point => [point.x, point.y])),
    [
      [
        [-1.5, 2],
        [-1, 3],
        [-0.5, 0],
        [0, 5]
      ]
    ],
    'should aggregate each numeric bin and tolerate missing Y values'
  );
  t.end();
});

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

  const collided = getLineChart(
    datasets,
    groupedFilter({
      fieldName: 'g',
      numGroups: 2,
      groupOthers: true,
      colorRange: {colors: ['#111111', '#222222']}
    })
  );
  const collidedColors = seriesSummary(collided).colors;
  t.deepEqual(
    collidedColors.slice(0, 2),
    ['#111111', '#222222'],
    'should keep the colors of the groups that fit'
  );
  t.ok(
    !collidedColors.slice(0, 2).includes(collidedColors[2]),
    'should give Others a color that is not already used'
  );

  const mapped = getLineChart(
    datasets,
    groupedFilter({
      fieldName: 'g',
      numGroups: 2,
      groupOthers: true,
      colorRange: {
        colors: ['#111111', '#222222'],
        colorMap: [[PLOT_GROUP_OTHERS_NAME, '#abcdef']]
      }
    })
  );
  t.equal(
    seriesSummary(mapped).colors[2],
    '#abcdef',
    'should keep an explicit Others color from the color map'
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

test('Utils -> getLineChart groupBy caps All at the palette size', t => {
  const rowCount = MAX_PLOT_NUM_GROUPS + 5;
  const rows = Array.from({length: rowCount}, (_, index) => ({v: 1, g: `g${index}`}));
  const datasets = {
    ds: {
      fields: [
        {name: 'v', type: 'integer', valueAccessor: ({index}) => rows[index].v},
        {name: 'g', type: 'string', valueAccessor: ({index}) => rows[index].g}
      ]
    }
  };
  const filter = {
    dataId: ['ds'],
    yAxis: {name: 'v', type: 'integer'},
    plotType: {
      aggregation: 'sum',
      interval: '1-day',
      type: 'lineChart',
      groupBy: {
        fieldName: 'g',
        numGroups: PLOT_NUM_GROUPS_ALL,
        groupOthers: true,
        colorRange: {colors: ['#111111']}
      }
    },
    timeBins: {
      ds: {
        '1-day': [{count: rowCount, indexes: rows.map((_, index) => index), x0: 0, x1: 1}]
      }
    }
  };

  const chart = getLineChart(datasets, filter);
  const names = seriesSummary(chart).names;
  t.equal(names.length, MAX_PLOT_NUM_GROUPS + 1, 'should keep the cap plus Others');
  t.equal(names[names.length - 1], PLOT_GROUP_OTHERS_NAME, 'should fold the rest into Others');
  t.deepEqual(
    names.slice(0, MAX_PLOT_NUM_GROUPS),
    rows.slice(0, MAX_PLOT_NUM_GROUPS).map(row => row.g),
    'should keep the first groups in first-seen order'
  );

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

test('Utils -> intervalBinFromMarks snaps a brush position to one histogram bin', t => {
  const marks = [0, 100, 200, 300];

  t.deepEqual(intervalBinFromMarks(marks, 0), [0, 99], 'should select the first bin');
  t.deepEqual(
    intervalBinFromMarks(marks, 100),
    [100, 199],
    'should select the bin that starts on the mark'
  );
  t.deepEqual(
    intervalBinFromMarks(marks, 149),
    [100, 199],
    'should snap toward the nearer bin start'
  );
  t.deepEqual(
    intervalBinFromMarks(marks, 150),
    [200, 299],
    'should snap to the next bin at the midpoint'
  );
  t.deepEqual(
    intervalBinFromMarks(marks, 250),
    [200, 299],
    'should keep the right half of the last bin on that bin'
  );
  t.deepEqual(
    intervalBinFromMarks(marks, 300),
    [200, 299],
    'should keep the final mark on the last bin'
  );
  t.deepEqual(intervalBinFromMarks([10], 10), [10, 10], 'should keep a single mark as a point');
  t.deepEqual(
    intervalBinFromMarks([], 10),
    [10, 10],
    'should leave the value unchanged without marks'
  );
  t.deepEqual(
    intervalBinFromMarks([-1.5, -1, -0.5], -1.3, 0),
    [-1.5, nextDown(-1)],
    'should end a numeric bin at the representable value before its next boundary'
  );
  t.deepEqual(
    intervalBinFromMarks([0, 0.05, 0.1], 0, 0),
    [0, nextDown(0.05)],
    'should exclude the next fractional bin boundary without subtracting a nominal step'
  );
  t.deepEqual(
    intervalBinFromMarks([0, 0.05, 0.1], 0.1, 0),
    [0.05, 0.1],
    'should include the numeric domain maximum in the final interval'
  );

  t.end();
});

test('Utils -> numeric interval selection matches histogram row membership', t => {
  const values = [0, 0.05, 0.075, 0.1];
  const rowIds = values.map((_, index) => index);
  const thresholds = getNumericBinThresholds([0, 0.1], 0.05);
  const bins = histogramFromThreshold(thresholds, rowIds, index => values[index], false);
  const marks = [...bins.map(bin => bin.x0), bins[bins.length - 1].x1];
  const dataset = {
    dataContainer: {},
    filteredIndex: rowIds,
    filteredIndexByLayer: {},
    gpuFilter: {
      filterValueUpdateTriggers: {gpuFilter_0: {name: 'x'}},
      filterRange: [[0, 0]],
      filterValueAccessor:
        () =>
        () =>
        ({index}) =>
          [values[index]]
    }
  };

  t.deepEqual(
    bins.map(bin => bin.count),
    [1, 2, 1],
    'fixture should exercise two half-open boundaries and the final maximum bin'
  );
  bins.forEach((bin, index) => {
    dataset.gpuFilter.filterRange = [intervalBinFromMarks(marks, bin.x0, 0)];
    t.deepEqual(
      runGpuFilterForPlot(dataset),
      [...bin.indexes],
      `interval ${index} should select exactly the row IDs assigned to its histogram bin`
    );
  });

  t.end();
});
