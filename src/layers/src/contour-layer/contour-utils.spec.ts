// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildContourGrid,
  buildScalarGrid,
  generateContours,
  interpolateScalarSamples,
  ScalarSample,
  smoothScalarGrid
} from './contour-utils';

function samples(size: number, value: (x: number, y: number) => number | null): ScalarSample[] {
  return Array.from({length: size * size}, (_, i) => ({
    longitude: i % size,
    latitude: Math.floor(i / size),
    value: value(i % size, Math.floor(i / size))
  }));
}

const options = {smoothing: 0, levels: 3, below: true, domain: [2, 6] as [number, number]};

describe('scalar contours', () => {
  test('traces nested lower-value regions with thresholds in the original units', () => {
    const grid = buildScalarGrid(samples(9, (x, y) => (x - 4) ** 2 + (y - 4) ** 2));
    const features = generateContours(grid, options);
    expect(features.map(f => f.properties.threshold)).toEqual([6, 4, 2]);
    const widths = features.map(f => {
      const xs = f.geometry.coordinates.flat(2).map(p => p[0]);
      return Math.max(...xs) - Math.min(...xs);
    });
    expect(widths[0]).toBeGreaterThan(widths[1]);
    expect(widths[1]).toBeGreaterThan(widths[2]);
    // The value = 4 contour crosses the center row exactly at x = 2 and x = 6.
    expect(features[1].geometry.coordinates.flat(2)).toContainEqual([2, 4]);
    expect(features[1].geometry.coordinates.flat(2)).toContainEqual([6, 4]);
  });

  test('also supports upper-value regions and negative scalar values', () => {
    const grid = buildScalarGrid(samples(9, (x, y) => -((x - 4) ** 2 + (y - 4) ** 2)));
    const result = generateContours(grid, {...options, below: false, domain: [-6, -2]});
    expect(result.map(f => f.properties.threshold)).toEqual([-6, -4, -2]);
    expect(result.every(f => f.geometry.coordinates.length === 1)).toBe(true);
  });

  test('smooths an isolated spike and preserves constant values at boundaries', () => {
    const spike = buildScalarGrid(samples(9, (x, y) => (x === 4 && y === 4 ? 100 : 0)))!;
    expect(smoothScalarGrid(spike, 0)).toBe(spike.values);
    const smooth = smoothScalarGrid(spike, 1.5);
    expect(smooth[40]).toBeLessThan(100);
    expect(smooth[40]).toBeGreaterThan(smooth[41]);
    expect(smooth[41]).toBeGreaterThan(0);
    const constant = buildScalarGrid(samples(9, () => -12))!;
    expect([...smoothScalarGrid(constant, 2)].every(value => Math.abs(value + 12) < 1e-10)).toBe(
      true
    );
  });

  test('keeps missing values as holes after smoothing', () => {
    const grid = buildScalarGrid(samples(9, (x, y) => (x === 4 && y === 4 ? null : 1)))!;
    expect(Number.isNaN(smoothScalarGrid(grid, 2)[40])).toBe(true);
    const result = generateContours(grid, {...options, smoothing: 2});
    expect(result).toHaveLength(3);
    expect(result.every(f => f.geometry.coordinates[0].length === 2)).toBe(true);
    expect(
      result
        .flatMap(f => f.geometry.coordinates.flat(2))
        .flat()
        .every(Number.isFinite)
    ).toBe(true);
  });

  test('retains a missing full column at the original spacing', () => {
    const input = samples(5, () => 1).filter(d => d.longitude !== 2);
    const grid = buildScalarGrid(input)!;
    expect(grid.width).toBe(5);
    expect(Number.isNaN(grid.values[2])).toBe(true);
    expect(grid.values[3]).toBe(1);
  });

  test('averages duplicate measurements without treating them as weights', () => {
    const grid = buildScalarGrid([
      ...samples(3, () => 10),
      {longitude: 1, latitude: 1, value: 30}
    ])!;
    expect(grid.values[4]).toBe(20);
  });

  test('handles empty, nonfinite, constant, and invalid inputs', () => {
    expect(buildScalarGrid([])).toBeNull();
    expect(generateContours(null, options)).toEqual([]);
    expect(generateContours(buildScalarGrid(samples(3, () => NaN)), options)).toEqual([]);
    expect(
      generateContours(buildScalarGrid(samples(3, () => 4)), {...options, domain: undefined})
    ).toEqual([]);
    expect(() => buildScalarGrid([{longitude: 1, latitude: 1, value: 2}])).toThrow('at least two');
    expect(() =>
      buildScalarGrid(
        samples(3, () => 1).map(d => ({...d, longitude: d.longitude === 2 ? 2.5 : d.longitude}))
      )
    ).toThrow('regularly spaced');
    expect(() =>
      generateContours(buildScalarGrid(samples(3, () => 1)), {...options, domain: [5, 2]})
    ).toThrow('minimum');
  });
});

describe('scattered scalar interpolation', () => {
  const plane = (x: number, y: number) => 3 + 2 * x + 3 * y;
  const scattered = [
    [0, 0],
    [2, 0],
    [0.7, 2],
    [1.1, 0.6]
  ].map(([longitude, latitude]) => ({
    longitude,
    latitude,
    value: plane(longitude, latitude)
  }));

  test('reproduces a linear field and keeps cells outside the sample hull empty', () => {
    const grid = interpolateScalarSamples(scattered, 64)!;
    let valid = 0;
    for (let i = 0; i < grid.values.length; i++) {
      if (!Number.isFinite(grid.values[i])) continue;
      valid++;
      expect(grid.values[i]).toBeCloseTo(
        plane(
          grid.longitude + (i % grid.width) * grid.stepLng,
          grid.latitude + Math.floor(i / grid.width) * grid.stepLat
        ),
        10
      );
    }
    expect(valid).toBeGreaterThan(1000);
    expect(grid.values[0]).toBe(3);
    expect(grid.values[grid.width - 1]).toBeCloseTo(7);
    expect(Number.isNaN(grid.values[grid.values.length - 1])).toBe(true);
    expect(Number.isNaN(smoothScalarGrid(grid, 2)[grid.values.length - 1])).toBe(true);
  });

  test('auto interpolates irregular positions and generates contours in the input units', () => {
    const grid = buildContourGrid(scattered, 'auto', 64)!;
    expect(Math.max(grid.width, grid.height)).toBe(64);
    expect(
      generateContours(grid, {...options, domain: [4, 8], smoothing: 1}).map(
        f => f.properties.threshold
      )
    ).toEqual([8, 6, 4]);
    expect(() => buildContourGrid(scattered, 'grid')).toThrow('regularly spaced');
  });

  test('auto preserves the original grid and its holes; explicit points mode fills gaps', () => {
    const input = samples(5, (x, y) => (x === 2 && y === 2 ? null : plane(x, y)));
    expect(buildContourGrid(input, 'auto', 256)).toEqual(buildScalarGrid(input));
    const interpolated = buildContourGrid(input, 'points', 33)!;
    expect(interpolated.width).toBeGreaterThan(5);
    expect([...interpolated.values].every(Number.isFinite)).toBe(true);
  });

  test('averages duplicate measurements and ignores missing or invalid samples', () => {
    const grid = interpolateScalarSamples(
      [
        {longitude: 0, latitude: 0, value: 2},
        {longitude: 0, latitude: 0, value: 6},
        {longitude: 2, latitude: 0, value: 8},
        {longitude: 0.7, latitude: 2, value: 10},
        {longitude: 20, latitude: 20, value: null},
        {longitude: 20, latitude: 20, value: Infinity},
        {longitude: NaN, latitude: 0, value: 100}
      ],
      32
    )!;
    expect(grid.values[0]).toBe(4);
    expect(grid.longitude + (grid.width - 1) * grid.stepLng).toBeCloseTo(2);
    expect([...grid.values].filter(Number.isFinite).every(value => value >= 4 && value <= 10)).toBe(
      true
    );
  });

  test('bounds resolution and handles empty, insufficient, collinear and global samples', () => {
    const grid = interpolateScalarSamples(scattered, 10000)!;
    expect(Math.max(grid.width, grid.height)).toBe(256);
    expect(interpolateScalarSamples([])).toBeNull();
    expect(interpolateScalarSamples(scattered.map(d => ({...d, value: null})))).toBeNull();
    expect(() => interpolateScalarSamples(scattered.slice(0, 2))).toThrow('non-collinear');
    expect(() =>
      interpolateScalarSamples(
        [0, 1, 2].map(x => ({
          longitude: x,
          latitude: 2 * x,
          value: x
        }))
      )
    ).toThrow('non-collinear');
    expect(() =>
      buildContourGrid([
        {longitude: -179, latitude: 0, value: 1},
        {longitude: 179, latitude: 0, value: 2},
        {longitude: 179, latitude: 1, value: 3}
      ])
    ).toThrow('antimeridian');
  });
});
