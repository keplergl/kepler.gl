// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  histogramFromThreshold,
  histogramFromValues,
  mergePolygonLayerIndexes,
  runGpuFilterForPlot
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
