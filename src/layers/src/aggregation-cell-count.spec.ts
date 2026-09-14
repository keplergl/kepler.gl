// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  AGGREGATION_CELL_COUNT_WARNING_THRESHOLD,
  estimateAggregationCellCount,
  estimateBboxAggregationCellCount,
  isAggregationCellCountSlow
} from './aggregation-cell-count';

describe('aggregation-cell-count', () => {
  const sfBounds = [-122.52, 37.7, -122.35, 37.84];

  test('returns null for missing bounds or invalid size', () => {
    expect(estimateBboxAggregationCellCount(null, 1)).toBeNull();
    expect(estimateAggregationCellCount(null, 1)).toBeNull();
    expect(estimateAggregationCellCount(sfBounds, 0)).toBeNull();
    expect(estimateAggregationCellCount(sfBounds, -1)).toBeNull();
  });

  test('grid cell count grows as cell size shrinks', () => {
    const at1km = estimateBboxAggregationCellCount(sfBounds, 1, 'grid') as number;
    const at01km = estimateBboxAggregationCellCount(sfBounds, 0.1, 'grid') as number;
    expect(at1km).toBeGreaterThan(0);
    expect(at01km / at1km).toBeGreaterThan(50);
    expect(isAggregationCellCountSlow(at1km)).toBe(false);
  });

  test('occupied count is capped by the number of points', () => {
    const bayArea = [-123.1, 36.9, -121.5, 38.5];
    const bbox = estimateBboxAggregationCellCount(bayArea, 0.01, 'grid') as number;
    expect(bbox).toBeGreaterThan(1_000_000);
    expect(estimateAggregationCellCount(bayArea, 0.01, 'grid', 50_000)).toBe(50_000);
    expect(estimateAggregationCellCount(bayArea, 0.01, 'grid', 1000)).toBe(1000);
  });

  test('does not warn for tens of thousands of points', () => {
    const bayArea = [-123.1, 36.9, -121.5, 38.5];
    expect(isAggregationCellCountSlow(22_652, 22_652)).toBe(false);
    expect(isAggregationCellCountSlow(50_000, 50_000)).toBe(false);
    expect(
      isAggregationCellCountSlow(
        estimateAggregationCellCount(bayArea, 0.01, 'grid', 50_000),
        50_000
      )
    ).toBe(false);
  });

  test('warns only when both points and occupied cells are large', () => {
    expect(isAggregationCellCountSlow(100_000, 100_000)).toBe(true);
    expect(isAggregationCellCountSlow(500, 200_000)).toBe(false);
    expect(isAggregationCellCountSlow(200_000, 200_000)).toBe(true);
    expect(100_000).toBe(AGGREGATION_CELL_COUNT_WARNING_THRESHOLD);
  });

  test('occupied count is the bbox count when cells are coarser than the point set', () => {
    const count = estimateAggregationCellCount(sfBounds, 50, 'grid', 1_000_000) as number;
    expect(count).toBeLessThan(100);
  });

  test('hexagon count is on the same order as the grid for the same radius', () => {
    const grid = estimateBboxAggregationCellCount(sfBounds, 0.5, 'grid') as number;
    const hex = estimateBboxAggregationCellCount(sfBounds, 0.5, 'hexagon') as number;
    expect(hex).toBeGreaterThan(0);
    expect(hex / grid).toBeGreaterThan(0.3);
    expect(hex / grid).toBeLessThan(3);
  });
});
