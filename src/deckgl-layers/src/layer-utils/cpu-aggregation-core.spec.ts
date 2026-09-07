// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  aggregatePointsToBins,
  isWorkerCompatibleAggregation,
  lngLatToWorld,
  pointToHexbin,
  reduceChannel,
  shouldUseAsyncCpuAggregation,
  toDeckAggregationOperation,
  ASYNC_CPU_AGGREGATION_THRESHOLD,
  WEB_MERCATOR_TILE_SIZE
} from './cpu-aggregation-core';

describe('cpu-aggregation-core', () => {
  test('lngLatToWorld maps 0,0 to the mercator origin', () => {
    const [x, y] = lngLatToWorld(0, 0, 1);
    expect(x).toBeCloseTo(WEB_MERCATOR_TILE_SIZE / 2, 6);
    expect(y).toBeCloseTo(WEB_MERCATOR_TILE_SIZE / 2, 6);
  });

  test('lngLatToWorld scales linearly with zoom scale', () => {
    const [x1, y1] = lngLatToWorld(-122.4, 37.8, 1);
    const [x2, y2] = lngLatToWorld(-122.4, 37.8, 4096);
    expect(x2 / x1).toBeCloseTo(4096, 6);
    expect(y2 / y1).toBeCloseTo(4096, 6);
  });

  test('pointToHexbin is stable for a cell center and a nearby point', () => {
    const radius = 1000;
    const a = pointToHexbin(0, 0, radius);
    const b = pointToHexbin(10, 10, radius);
    expect(a).toEqual(b);
  });

  test('reduceChannel COUNT / SUM / MAX skip or include values as documented', () => {
    const values = [1, NaN, 3, 0];
    const getValue = (i: number) => values[i];
    const idx = [0, 1, 2, 3];
    expect(reduceChannel(idx, getValue, 'COUNT')).toBe(4);
    expect(reduceChannel(idx, getValue, 'SUM')).toBe(4);
    expect(reduceChannel(idx, getValue, 'MAX')).toBe(3);
    expect(reduceChannel(idx, getValue, 'MEAN')).toBeCloseTo(4 / 3, 6);
    expect(reduceChannel([1], getValue, 'MAX')).toBeNaN();
    expect(reduceChannel([1], getValue, 'SUM')).toBe(0);
  });

  test('toDeckAggregationOperation maps kepler names', () => {
    expect(toDeckAggregationOperation('average')).toBe('MEAN');
    expect(toDeckAggregationOperation('maximum')).toBe('MAX');
    expect(toDeckAggregationOperation('count')).toBe('COUNT');
    expect(toDeckAggregationOperation('count', {countAsSum: true})).toBe('SUM');
    expect(isWorkerCompatibleAggregation('median')).toBe(false);
    expect(isWorkerCompatibleAggregation('count')).toBe(true);
    expect(shouldUseAsyncCpuAggregation(ASYNC_CPU_AGGREGATION_THRESHOLD, 'count', 'count')).toBe(
      true
    );
    expect(
      shouldUseAsyncCpuAggregation(ASYNC_CPU_AGGREGATION_THRESHOLD, 'average', 'average')
    ).toBe(true);
    // No color field is treated as count by formatLayerData.
    expect(shouldUseAsyncCpuAggregation(ASYNC_CPU_AGGREGATION_THRESHOLD, 'count', 'count')).toBe(
      true
    );
    expect(
      shouldUseAsyncCpuAggregation(ASYNC_CPU_AGGREGATION_THRESHOLD - 1, 'count', 'count')
    ).toBe(false);
    expect(shouldUseAsyncCpuAggregation(ASYNC_CPU_AGGREGATION_THRESHOLD, 'median', 'count')).toBe(
      false
    );
  });

  test('aggregatePointsToBins groups nearby points and counts them', () => {
    const positions = new Float64Array([-122.4, 37.8, 0, -122.4001, 37.8001, 0, -122.5, 37.9, 0]);
    const colorWeights = new Float32Array([1, 1, 1]);
    const elevationWeights = new Float32Array([1, 1, 1]);
    const origin = lngLatToWorld(-122.45, 37.85, 1);
    const result = aggregatePointsToBins({
      id: 1,
      binType: 'grid',
      pointCount: 3,
      positions,
      positionSize: 3,
      preprojected: false,
      colorWeights,
      elevationWeights,
      colorOperation: 'SUM',
      elevationOperation: 'SUM',
      scale: 1,
      originX: origin[0],
      originY: origin[1],
      cellSizeX: 0.5,
      cellSizeY: 0.5,
      radiusCommon: 1
    });

    expect(result.binCount).toBe(2);
    const counts = Array.from(result.counts).sort((a, b) => a - b);
    expect(counts).toEqual([1, 2]);
    expect(result.pointIndices.length).toBe(3);
  });

  test('grid bin placement stays in common space when cell size changes', () => {
    const lng = -122.4;
    const lat = 37.8;
    const origin = lngLatToWorld(lng - 0.05, lat - 0.05, 1);
    const [wx, wy] = lngLatToWorld(lng, lat, 1);
    const colorWeights = new Float32Array([1]);
    const elevationWeights = new Float32Array([1]);
    const positions = new Float64Array([lng, lat, 0]);

    const binAtSize = (cellSize: number) =>
      aggregatePointsToBins({
        id: 1,
        binType: 'grid',
        pointCount: 1,
        positions,
        positionSize: 3,
        preprojected: false,
        colorWeights,
        elevationWeights,
        colorOperation: 'COUNT',
        elevationOperation: 'COUNT',
        scale: 1,
        originX: origin[0],
        originY: origin[1],
        cellSizeX: cellSize,
        cellSizeY: cellSize,
        radiusCommon: 1
      });

    const small = binAtSize(0.01);
    const large = binAtSize(0.02);
    const colSmall = small.binIds[0];
    const colLarge = large.binIds[0];
    const rowSmall = small.binIds[1];
    const rowLarge = large.binIds[1];

    const placedSmallX = origin[0] + colSmall * 0.01;
    const placedLargeX = origin[0] + colLarge * 0.02;
    expect(Math.abs(placedSmallX - wx)).toBeLessThan(0.01);
    expect(Math.abs(placedLargeX - wx)).toBeLessThan(0.02);
    expect(Math.abs(origin[1] + rowSmall * 0.01 - wy)).toBeLessThan(0.01);
    expect(Math.abs(origin[1] + rowLarge * 0.02 - wy)).toBeLessThan(0.02);

    // Reusing the small-cell col with the large cell size would scale the point away.
    const wronglyScaledX = origin[0] + colSmall * 0.02;
    expect(Math.abs(wronglyScaledX - wx)).toBeGreaterThan(0.01);
  });
});
