// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildContourGrid,
  generateContours,
  ScalarSample,
  ScalarGrid,
  smoothScalarGrid
} from './contour-utils';
import {buildContourSurface} from './contour-surface';

function samples(size: number, value: (x: number, y: number) => number | null): ScalarSample[] {
  return Array.from({length: size * size}, (_, i) => ({
    longitude: i % size,
    latitude: Math.floor(i / size),
    value: value(i % size, Math.floor(i / size))
  }));
}

// Contour geometry and smoothing tests use a fixed surface independently of aggregation.
function testGrid(input: ScalarSample[]): ScalarGrid {
  const size = Math.sqrt(input.length);
  return {
    width: size,
    height: size,
    longitude: 0,
    latitude: 0,
    stepLng: 1,
    stepLat: 1,
    values: Float64Array.from(input, sample => sample.value ?? NaN)
  };
}

const options = {smoothing: 0, levels: 3, below: true, domain: [2, 6] as [number, number]};

describe('contour surface', () => {
  const area = (coordinates: number[][][][]) =>
    coordinates.reduce(
      (total, polygon) =>
        total +
        polygon.reduce((sum, ring, index) => {
          const signed =
            ring.reduce((value, point, i) => {
              const next = ring[(i + 1) % ring.length];
              return value + point[0] * next[1] - next[0] * point[1];
            }, 0) / 2;
          return sum + Math.abs(signed) * (index ? -1 : 1);
        }, 0),
      0
    );

  test.each([true, false])('preserves the 2D footprint, holes and levels (below: %s)', below => {
    const grid = testGrid(
      samples(9, (x, y) => (x === 4 && y === 4 ? null : (x - 4) ** 2 + (y - 4) ** 2))
    );
    const contours = generateContours(grid, {...options, below});
    const original = JSON.stringify(contours);
    const surface = buildContourSurface(grid, contours);
    expect(surface.fills).toHaveLength(contours.length);
    surface.fills.forEach((feature, index) => {
      expect(feature.properties).toEqual(contours[index].properties);
      expect(area(feature.geometry.coordinates)).toBeCloseTo(
        area(contours[index].geometry.coordinates),
        8
      );
      expect(feature.geometry.coordinates.flat(3).every(Number.isFinite)).toBe(true);
      const outline = surface.outlines[index];
      expect(outline.properties).toEqual(contours[index].properties);
      contours[index].geometry.coordinates.forEach((polygon, p) =>
        polygon.forEach((ring, r) => {
          const draped = outline.geometry.coordinates[p][r];
          for (const point of ring) {
            expect(
              draped.some(
                vertex =>
                  Math.abs(vertex[0] - point[0]) < 1e-9 && Math.abs(vertex[1] - point[1]) < 1e-9
              )
            ).toBe(true);
          }
        })
      );
    });
    expect(JSON.stringify(contours)).toBe(original);
  });

  test('retains interior peaks and scales signed values to map-relative relief', () => {
    const grid = testGrid(samples(9, (x, y) => 4 - (x - 4) ** 2 - (y - 4) ** 2));
    const contours = generateContours(grid, {...options, below: false, domain: [-8, 0]});
    const surface = buildContourSurface(grid, contours);
    const peakHeight = 8 * 111320 * 0.1;
    for (const feature of surface.fills) {
      const peak = feature.geometry.coordinates.flat(2).find(p => p[0] === 4 && p[1] === 4);
      expect(peak?.[2]).toBeCloseTo(peakHeight);
      expect(new Set(feature.geometry.coordinates.flat(2).map(p => p[2])).size).toBeGreaterThan(3);
    }
    // Changing only the numeric units must not change the relief or footprint.
    const convertedGrid = {...grid, values: Float64Array.from(grid.values, v => v * 100 + 20)};
    const converted = buildContourSurface(convertedGrid, contours);
    surface.fills.forEach((feature, index) => {
      feature.geometry.coordinates.flat(2).forEach((point, i) => {
        const actual = converted.fills[index].geometry.coordinates.flat(2)[i];
        point.forEach((value, channel) => expect(actual[channel]).toBeCloseTo(value));
      });
    });
  });

  test('samples normalized field-gradient normals at draped vertices', () => {
    const grid = testGrid(samples(5, (x, y) => x * x + y));
    const contours = generateContours(grid, {...options, domain: [1, 12]});
    const surface = buildContourSurface(grid, contours);
    const normal = surface.getNormal([2, 2]);
    const physical = [normal[0] * 111320, normal[1] * 111320, normal[2]];
    expect(Math.hypot(...physical)).toBeCloseTo(1);
    expect(physical[0]).toBeLessThan(0);
    expect(physical[1]).toBeLessThan(0);
    expect(physical[2]).toBeGreaterThan(0);
  });

  test.each([
    ['tiny', (value: number) => value * 1e-310],
    ['subnormal', (value: number) => value * Number.MIN_VALUE],
    ['overflowing signed range', (value: number) => (value - 1) * Number.MAX_VALUE]
  ])('preserves finite relief with %s units beside missing data', (_label, convert) => {
    const grid = testGrid(samples(3, (x, y) => (x === 1 && y === 1 ? null : x)));
    const contours = generateContours(grid, {...options, domain: [0, 2]});
    const reference = buildContourSurface(grid, contours);
    const converted = buildContourSurface(
      {...grid, values: Float64Array.from(grid.values, convert)},
      contours
    );
    for (const pass of ['fills', 'outlines'] as const) {
      const expected = reference[pass].flatMap(feature => feature.geometry.coordinates.flat(2));
      const actual = converted[pass].flatMap(feature => feature.geometry.coordinates.flat(2));
      expect(actual.length).toBeGreaterThan(0);
      expect(actual).toHaveLength(expected.length);
      expect(actual.flat().every(Number.isFinite)).toBe(true);
      expect(Math.max(...actual.map(point => point[2]))).toBeGreaterThan(0);
      actual.forEach((point, i) => {
        point.forEach((value, channel) => expect(value).toBeCloseTo(expected[i][channel]));
        expect(converted.getNormal(point).every(Number.isFinite)).toBe(true);
      });
    }
  });

  test('handles empty, missing and constant surfaces', () => {
    expect(buildContourSurface(null, [])).toMatchObject({fills: [], outlines: []});
    const constant = testGrid(samples(3, () => -5));
    const contours = generateContours(constant, {...options, domain: [-6, -4]});
    const surface = buildContourSurface(constant, contours);
    expect(surface.fills.length).toBeGreaterThan(0);
    expect(surface.fills.flatMap(f => f.geometry.coordinates.flat(2)).every(p => p[2] === 0)).toBe(
      true
    );
    expect(buildContourSurface(testGrid(samples(3, () => NaN)), contours)).toMatchObject({
      fills: [],
      outlines: []
    });
  });
});

describe('scalar contours', () => {
  test('traces nested lower-value regions with thresholds in the original units', () => {
    const grid = testGrid(samples(9, (x, y) => (x - 4) ** 2 + (y - 4) ** 2));
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
    const grid = testGrid(samples(9, (x, y) => -((x - 4) ** 2 + (y - 4) ** 2)));
    const result = generateContours(grid, {...options, below: false, domain: [-6, -2]});
    expect(result.map(f => f.properties.threshold)).toEqual([-6, -4, -2]);
    expect(result.every(f => f.geometry.coordinates.length === 1)).toBe(true);
  });

  test('smooths an isolated spike and preserves constant values at boundaries', () => {
    const spike = testGrid(samples(9, (x, y) => (x === 4 && y === 4 ? 100 : 0)))!;
    expect(smoothScalarGrid(spike, 0)).toBe(spike.values);
    const smooth = smoothScalarGrid(spike, 1.5);
    expect(smooth[40]).toBeLessThan(100);
    expect(smooth[40]).toBeGreaterThan(smooth[41]);
    expect(smooth[41]).toBeGreaterThan(0);
    const constant = testGrid(samples(9, () => -12))!;
    expect([...smoothScalarGrid(constant, 2)].every(value => Math.abs(value + 12) < 1e-10)).toBe(
      true
    );
  });

  test.each([0, 10, -12, 1e-20, 1e20])(
    'does not invent automatic contours in a constant field of %s',
    value => {
      for (const holes of [false, true]) {
        const grid = testGrid(samples(9, (x, y) => (holes && x === 4 && y === 4 ? null : value)));
        for (const smoothing of [0, 1.5, 6]) {
          for (const below of [false, true]) {
            expect(generateContours(grid, {smoothing, levels: 7, below})).toEqual([]);
          }
        }
      }
    }
  );

  test.each([
    [0, 1e-20],
    [10, 1e-10]
  ])('preserves real small variations around %s at scale %s', (baseline, scale) => {
    const grid = testGrid(samples(9, (x, y) => baseline + scale * (x + y)));
    const result = generateContours(grid, {smoothing: 1.5, levels: 7, below: true});
    expect(result).toHaveLength(7);
    expect(new Set(result.map(feature => feature.properties.threshold)).size).toBe(7);
    expect(
      result.flatMap(feature => feature.geometry.coordinates.flat(3)).every(Number.isFinite)
    ).toBe(true);
  });

  test.each([0, 10, -12, 1e-20, 1e20])(
    'preserves constant values and explicit threshold regions for %s',
    value => {
      const span = Math.abs(value) || 1;
      for (const holes of [false, true]) {
        const grid = testGrid(samples(9, (x, y) => (holes && x === 4 && y === 4 ? null : value)))!;
        for (const below of [false, true]) {
          const settings = {
            levels: 3,
            below,
            domain: [value - span, value + span] as [number, number]
          };
          const expected = generateContours(grid, {...settings, smoothing: 0});
          const atValue = expected.find(feature => feature.properties.threshold === value)!;
          expect(atValue.geometry.coordinates).toHaveLength(1);
          expect(atValue.geometry.coordinates[0]).toHaveLength(holes ? 2 : 1);
          for (const smoothing of [1.5, 6]) {
            expect(smoothScalarGrid(grid, smoothing)).toEqual(grid.values);
            expect(generateContours(grid, {...settings, smoothing})).toEqual(expected);
          }
        }
      }
    }
  );

  test('keeps missing values as holes after smoothing', () => {
    const grid = testGrid(samples(9, (x, y) => (x === 4 && y === 4 ? null : 1)))!;
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

  test('handles empty surfaces and invalid custom thresholds', () => {
    expect(generateContours(null, options)).toEqual([]);
    expect(generateContours(testGrid(samples(3, () => NaN)), options)).toEqual([]);
    expect(() =>
      generateContours(testGrid(samples(3, () => 1)), {...options, domain: [5, 2]})
    ).toThrow('minimum');
  });
});

describe('point aggregation for contours', () => {
  const point = (longitude: number, latitude: number, value: number | null): ScalarSample => ({
    longitude,
    latitude,
    value
  });
  const at = (grid: ScalarGrid, longitude: number, latitude: number) =>
    grid.values[
      Math.round((latitude - grid.latitude) / grid.stepLat) * grid.width +
        Math.round((longitude - grid.longitude) / grid.stepLng)
    ];

  test('averages distinct points in the same cell and leaves empty cells at zero', () => {
    const grid = buildContourGrid(
      [point(0, 0, 10), point(0.0001, 0.0001, 30), point(0.03, 0.03, -8)],
      32
    )!;
    expect(at(grid, 0, 0)).toBe(20);
    expect(at(grid, 0.03, 0.03)).toBe(-8);
    expect(at(grid, 0.015, 0.015)).toBe(0);
    expect([...grid.values].filter(value => value !== 0).sort((a, b) => a - b)).toEqual([-8, 20]);
    expect(generateContours(grid, {...options, below: false, domain: [5, 15]})).toHaveLength(3);
  });

  test('counts every point when weights are absent, including duplicate positions', () => {
    const grid = buildContourGrid(
      [point(0, 0, null), point(0, 0, NaN), point(0.0001, 0.0001, -100), point(0.03, 0.03, 99)],
      32,
      'COUNT'
    )!;
    expect(at(grid, 0, 0)).toBe(3);
    expect(at(grid, 0.03, 0.03)).toBe(1);
    expect([...grid.values].reduce((a, b) => a + b, 0)).toBe(4);
  });

  test('skips invalid weights without counting them or extending the weighted surface', () => {
    const valid = [point(0, 0, 0), point(0.0001, 0.0001, -10), point(0.03, 0.03, 4)];
    const invalid = [point(0, 0, null), point(10, 10, NaN), point(10, 10, Infinity)];
    const grid = buildContourGrid([...valid, ...invalid], 32)!;
    expect(grid).toEqual(buildContourGrid(valid, 32));
    expect(at(grid, 0, 0)).toBe(-5);
    expect(buildContourGrid(invalid)).toBeNull();
  });

  test.each(['MEAN', 'COUNT'] as const)('ignores invalid coordinates in %s mode', aggregation => {
    const valid = [point(0, 0, 4), point(0.03, 0.03, 8)];
    expect(
      buildContourGrid(
        [
          ...valid,
          point(NaN, 0, 2),
          point(0, Infinity, 3),
          point(181, 0, 4),
          point(0, 90, 5),
          {longitude: null, latitude: 0, value: 6} as unknown as ScalarSample
        ],
        32,
        aggregation
      )
    ).toEqual(buildContourGrid(valid, 32, aggregation));
  });

  test.each([undefined, 32, 192, 256])(
    'fits small and large datasets to a maximum axis of %s',
    resolution => {
      const makeGrid = (scale: number) =>
        buildContourGrid(
          [point(-0.5 * scale, -0.25 * scale, 10), point(0.5 * scale, 0.25 * scale, 30)],
          resolution
        )!;
      const small = makeGrid(0.00001);
      const large = makeGrid(1);
      for (const grid of [small, large]) {
        expect(Math.max(grid.width, grid.height)).toBe(resolution ?? 64);
        expect(grid.height).toBeLessThan(grid.width);
        expect(grid.stepLng).toBeCloseTo(grid.stepLat, 12);
      }
      expect(small.width).toBe(large.width);
      expect(small.height).toBe(large.height);
      expect(small.values).toEqual(large.values);
      expect(small.stepLng / large.stepLng).toBeCloseTo(0.00001, 12);
    }
  );

  test('keeps cells geographically square at higher latitudes', () => {
    const grid = buildContourGrid([point(0, 59.99, 10), point(0.03, 60.01, 30)], 192)!;
    expect(grid.height).toBe(192);
    expect(grid.width).toBeGreaterThan(2);
    expect(grid.width).toBeLessThan(grid.height);
    expect(grid.stepLng * Math.cos(Math.PI / 3)).toBeCloseTo(grid.stepLat, 12);
    expect(grid.longitude + (grid.width - 1) * grid.stepLng).toBeGreaterThanOrEqual(0.03);
    expect(grid.latitude).toBeLessThanOrEqual(59.99);
    expect(grid.latitude + (grid.height - 1) * grid.stepLat).toBeCloseTo(60.01);
  });

  test('resolution determines which observations are averaged', () => {
    const input = [point(0, 0, 10), point(0.0004, 0.0004, 30), point(0.03, 0.03, 8)];
    const fine = buildContourGrid(input, 256)!;
    const coarse = buildContourGrid(input, 32)!;
    expect(at(fine, 0, 0)).toBe(10);
    expect(at(fine, 0.0004, 0.0004)).toBe(30);
    expect(at(coarse, 0, 0)).toBe(20);
  });

  test('accepts single points and collinear inputs without triangulation', () => {
    for (const input of [[point(0, 0, 8)], [point(0, 0, 8), point(0, 0.03, 12)]]) {
      const grid = buildContourGrid(input, 32)!;
      expect(grid.width).toBeGreaterThanOrEqual(2);
      expect(grid.height).toBeGreaterThanOrEqual(2);
      expect(generateContours(grid, {...options, below: false})).toHaveLength(3);
    }
  });

  test('bounds grid allocation and handles empty, invalid settings and global inputs', () => {
    const grid = buildContourGrid([point(0, 0, 4), point(10, 10, 8)], 100000)!;
    expect(Math.max(grid.width, grid.height)).toBe(256);
    expect(grid.values.length).toBeLessThanOrEqual(256 * 256);
    expect([...grid.values].every(Number.isFinite)).toBe(true);
    expect(buildContourGrid([])).toBeNull();
    for (const resolution of [0, 1, -1, NaN, Infinity]) {
      expect(() => buildContourGrid([point(0, 0, 1)], resolution)).toThrow('grid resolution');
    }
    expect(() => buildContourGrid([point(-179, 0, 1), point(179, 1, 2)])).toThrow('antimeridian');
  });
});
