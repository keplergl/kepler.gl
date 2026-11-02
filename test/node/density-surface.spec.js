// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildContourPaths,
  buildSurfaceMesh,
  computeDensityGrid,
  MAX_GRID_CELLS,
  MAX_SMOOTHING_PASSES
} from '../../examples/custom-layer/src/density-surface';

const sumGrid = grid => grid.reduce((sum, value) => sum + value, 0);

const forEachPosition = (positions, callback) => {
  for (let i = 0; i < positions.length; i += 3) {
    callback(positions[i], positions[i + 1], positions[i + 2]);
  }
};

describe('density surface', () => {
  test('computeDensityGrid counts points into a north-to-south grid', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const grid = computeDensityGrid(points, {cellSizeMeters: 5000, smoothing: 0});

    expect(grid).not.toBeNull();
    expect(grid.cols).toBeGreaterThan(1);
    expect(grid.rows).toBeGreaterThan(1);
    expect(sumGrid(grid.grid)).toBeCloseTo(points.length, 5);
    expect(grid.maxValue).toBe(2);

    const [west, south, east, north] = grid.bounds;
    points.forEach(([lng, lat]) => {
      expect(lng).toBeGreaterThanOrEqual(west);
      expect(lng).toBeLessThanOrEqual(east);
      expect(lat).toBeGreaterThanOrEqual(south);
      expect(lat).toBeLessThanOrEqual(north);
    });
  });

  test('weights aggregate per cell with SUM or MEAN', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const weights = [10, 20, 30];

    const sum = computeDensityGrid(points, {
      cellSizeMeters: 5000,
      smoothing: 0,
      weights,
      aggregation: 'SUM'
    });
    expect(sumGrid(sum.grid)).toBeCloseTo(60, 5);

    const mean = computeDensityGrid(points, {
      cellSizeMeters: 5000,
      smoothing: 0,
      weights,
      aggregation: 'MEAN'
    });
    const values = Array.from(mean.grid)
      .filter(value => value > 0)
      .sort((a, b) => a - b);
    expect(values[0]).toBeCloseTo(15, 5);
    expect(values[values.length - 1]).toBeCloseTo(30, 5);
  });

  test('smoothing lowers the peak without losing points', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const raw = computeDensityGrid(points, {cellSizeMeters: 1000, smoothing: 0});
    const smoothed = computeDensityGrid(points, {cellSizeMeters: 1000, smoothing: 1});

    expect(smoothed.maxValue).toBeLessThanOrEqual(raw.maxValue);
    expect(sumGrid(smoothed.grid)).toBeCloseTo(points.length, 5);
  });

  test('clamps custom smoothing passes to the safe maximum', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const grid = computeDensityGrid(points, {
      cellSizeMeters: 5000,
      smoothing: MAX_SMOOTHING_PASSES * 1000
    });

    expect(grid).not.toBeNull();
    expect(sumGrid(grid.grid)).toBeCloseTo(points.length, 3);
  });

  test('caps the grid resolution for a large extent and small cells', () => {
    const grid = computeDensityGrid(
      [
        [-180, -85],
        [180, 85]
      ],
      {cellSizeMeters: 1, smoothing: 0}
    );

    expect(grid.cols * grid.rows).toBeLessThanOrEqual(MAX_GRID_CELLS);
    expect(sumGrid(grid.grid)).toBeCloseTo(2, 5);
  });

  test('buildSurfaceMesh builds a north-up colored triangle mesh', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const grid = computeDensityGrid(points, {cellSizeMeters: 5000, smoothing: 0});
    const vertexCount = grid.cols * grid.rows;
    const mesh = buildSurfaceMesh(grid, 1000);

    expect(mesh.vertexCount).toBe(vertexCount);
    expect(mesh.positions).toHaveLength(vertexCount * 3);
    expect(mesh.colors).toHaveLength(vertexCount * 3);
    expect(mesh.indices).toHaveLength((grid.cols - 1) * (grid.rows - 1) * 6);
    expect(mesh.triangleCount).toBe(mesh.indices.length / 3);

    let maxZ = -Infinity;
    let maxIndex = 0;
    forEachPosition(mesh.positions, (lng, lat, z) => {
      expect(Number.isFinite(lng)).toBe(true);
      expect(Number.isFinite(lat)).toBe(true);
      expect(Number.isFinite(z)).toBe(true);
      maxZ = Math.max(maxZ, z);
    });
    for (const index of mesh.indices) {
      maxIndex = Math.max(maxIndex, index);
    }

    expect(maxZ).toBeCloseTo(1000, 3);
    expect(maxIndex).toBeLessThan(vertexCount);

    mesh.colors.forEach(channel => {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    });
    // The hypsometric ramp + hillshade should produce more than one color.
    expect(new Set(Array.from(mesh.colors).map(value => value.toFixed(3))).size).toBeGreaterThan(1);
  });

  test('buildSurfaceMesh colors from the provided color range', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const grid = computeDensityGrid(points, {cellSizeMeters: 5000, smoothing: 0});
    const grayscale = buildSurfaceMesh(grid, 1000, ['#000000', '#ffffff']);
    const colored = buildSurfaceMesh(grid, 1000, ['#ff0000', '#00ff00']);

    expect(Array.from(grayscale.colors)).not.toEqual(Array.from(colored.colors));
    // A black/white palette stays grayscale after the hillshade multiplier.
    for (let i = 0; i < grayscale.colors.length; i += 3) {
      expect(grayscale.colors[i]).toBeCloseTo(grayscale.colors[i + 1], 4);
      expect(grayscale.colors[i + 1]).toBeCloseTo(grayscale.colors[i + 2], 4);
    }
  });

  test('buildContourPaths creates segments raised to the surface height', () => {
    const points = [
      [-122.4, 37.8],
      [-122.4, 37.8],
      [-122.3, 37.9]
    ];
    const grid = computeDensityGrid(points, {cellSizeMeters: 5000, smoothing: 0});
    const paths = buildContourPaths(grid, 1000, 4);

    expect(paths.length).toBeGreaterThan(0);
    paths.forEach(path => {
      expect(path).toHaveLength(2);
      path.forEach(([lng, lat, z]) => {
        expect(Number.isFinite(lng)).toBe(true);
        expect(Number.isFinite(lat)).toBe(true);
        expect(Number.isFinite(z)).toBe(true);
        expect(z).toBeGreaterThan(0);
      });
    });

    const constant = {
      ...grid,
      grid: new Float32Array(grid.grid.length).fill(1),
      minValue: 1,
      maxValue: 1
    };
    expect(buildContourPaths(constant, 1000, 4)).toEqual([]);
  });

  test('returns null for empty or invalid input', () => {
    expect(computeDensityGrid([], {cellSizeMeters: 1000})).toBeNull();
    expect(computeDensityGrid([[0, 0]], {cellSizeMeters: 0})).toBeNull();
  });
});
