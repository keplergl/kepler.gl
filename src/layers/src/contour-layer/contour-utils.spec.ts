// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildContourGrid,
  ContourFeature,
  ContourOptions,
  generateContours,
  ScalarSample,
  ScalarGrid,
  smoothScalarGrid
} from './contour-utils';
import {buildContourSurface} from './contour-surface';
import {buildContourMesh} from './contour-mesh';
import {lngLatToWorld} from '@math.gl/web-mercator';
import {SolidPolygonLayer} from '@deck.gl/layers';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import * as DeckCore from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';

const GlobeViewport = (DeckCore as any)._GlobeViewport;

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
    // Only values from -8 upward are visible; preserve their share of the full
    // -28..4 relief while placing the lowest visible contour at ground level.
    const peakHeight = 8 * 111320 * 0.1 * (12 / 32);
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

  test.each([
    ['automatic', undefined, 2],
    ['custom', [4, 6] as [number, number], 4]
  ] as const)('anchors the first visible %s contour at zero', (_label, domain, firstLevel) => {
    const grid = testGrid(samples(9, x => x));
    const contours = generateContours(grid, {...options, below: false, domain});
    const surface = buildContourSurface(grid, contours);
    const reliefPerLevel = 111320 * 0.1;
    for (const pass of [surface.fills, surface.outlines]) {
      const vertices = pass.flatMap(feature => feature.geometry.coordinates.flat(2));
      expect(Math.min(...vertices.map(point => point[2]))).toBe(0);
      const ground = pass[0].geometry.coordinates.flat(2).filter(point => point[0] === firstLevel);
      expect(ground.length).toBeGreaterThan(0);
      ground.forEach(point => expect(point[2]).toBeCloseTo(0, 8));
      const nextLevel = contours[1].properties.threshold;
      const raised = pass[1].geometry.coordinates.flat(2).filter(point => point[0] === nextLevel);
      expect(raised.length).toBeGreaterThan(0);
      raised.forEach(point =>
        expect(point[2]).toBeCloseTo((nextLevel - firstLevel) * reliefPerLevel, 8)
      );
    }
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

describe('contour mesh', () => {
  const feature = (coordinates: number[][][][], rank = 0): ContourFeature => ({
    type: 'Feature',
    properties: {threshold: rank, below: false, rank},
    geometry: {type: 'MultiPolygon', coordinates}
  });
  const projectedArea = (ring: number[][]) => {
    const points = ring.map(lngLatToWorld);
    return (
      Math.abs(
        points.reduce((sum, point, index) => {
          const next = points[(index + 1) % points.length];
          return sum + point[0] * next[1] - next[0] * point[1];
        }, 0)
      ) / 2
    );
  };
  const triangles = (mesh: {
    attributes: {
      getPolygon: {value: ArrayLike<number>};
      indices: {value: ArrayLike<number>};
    };
  }) => {
    const positions = mesh.attributes.getPolygon.value;
    const indices = mesh.attributes.indices.value;
    return Array.from({length: indices.length / 3}, (_, triangle) =>
      Array.from({length: 3}, (_, corner) => {
        const offset = indices[triangle * 3 + corner] * 3;
        return Array.from({length: 3}, (_, coordinate) => positions[offset + coordinate]);
      })
    );
  };

  test('triangulates holes in projected space without changing source heights', () => {
    const outer = [
      [0, 60, 0],
      [4, 60, 4],
      [4, 64, 8],
      [0, 64, 4],
      [0, 60, 0]
    ];
    const hole = [
      [1, 61, 2],
      [1, 63, 4],
      [3, 63, 6],
      [3, 61, 4],
      [1, 61, 2]
    ];
    const source = [feature([[outer, hole]])];
    const original = JSON.stringify(source);
    const {fill, depth} = buildContourMesh(source);
    const actual = triangles(fill);
    expect(actual.length).toBeGreaterThan(0);
    expect(actual.reduce((sum, triangle) => sum + projectedArea(triangle), 0)).toBeCloseTo(
      projectedArea(outer) - projectedArea(hole),
      8
    );
    for (const triangle of actual) {
      for (const point of triangle) expect([...outer, ...hole]).toContainEqual(point);
      const centroid = triangle
        .map(lngLatToWorld)
        .reduce((sum, point) => [sum[0] + point[0] / 3, sum[1] + point[1] / 3], [0, 0]);
      const [west, south] = lngLatToWorld([1, 61]);
      const [east, north] = lngLatToWorld([3, 63]);
      expect(
        centroid[0] > west && centroid[0] < east && centroid[1] > south && centroid[1] < north
      ).toBe(false);
    }
    expect(triangles(depth)).toEqual(actual);
    expect(JSON.stringify(source)).toBe(original);
  });

  test.each([true, false])(
    'preserves draped footprints and heights in level order, below=%s',
    below => {
      const grid = testGrid(
        samples(9, (x, y) => (x === 4 && y === 4 ? null : (x - 4) ** 2 + (y - 4) ** 2))
      );
      const surface = buildContourSurface(grid, generateContours(grid, {...options, below}));
      const {fill, depth} = buildContourMesh(surface.fills);
      expect(fill.length).toBe(surface.fills.length);
      expect(fill.attributes.getPolygon.value.every(Number.isFinite)).toBe(true);
      const indices = fill.attributes.indices.value;
      expect(indices.every(index => index < fill.attributes.getPolygon.value.length / 3)).toBe(
        true
      );
      let previousLevel = 0;
      for (let i = 0; i < indices.length; i += 3) {
        const level = surface.fills.findIndex(
          (_, rank) => indices[i] < fill.startIndices[rank + 1]
        );
        expect(level).toBeGreaterThanOrEqual(previousLevel);
        for (let corner = 0; corner < 3; corner++) {
          expect(indices[i + corner]).toBeGreaterThanOrEqual(fill.startIndices[level]);
          expect(indices[i + corner]).toBeLessThan(fill.startIndices[level + 1]);
        }
        previousLevel = level;
      }
      const allTriangles = triangles(fill);
      const onError = jest.fn();
      const manager = new LayerManager(device, {
        viewport: new WebMercatorViewport({
          width: 200,
          height: 200,
          longitude: 4,
          latitude: 4,
          zoom: 5
        })
      });
      manager.setProps({onError});
      try {
        surface.fills.forEach((source, rank) => {
          const actual = allTriangles.filter(
            (_, i) =>
              indices[i * 3] >= fill.startIndices[rank] &&
              indices[i * 3] < fill.startIndices[rank + 1]
          );
          // Clipped holes can touch cell boundaries and leave degenerate vertices.
          // Compare what the existing renderer triangulates, including those cases.
          const legacy = new SolidPolygonLayer({
            id: `legacy-contour-${rank}`,
            data: source.geometry.coordinates,
            getPolygon: polygon => polygon,
            extruded: false
          });
          manager.setLayers([legacy]);
          const tessellator = legacy.state.polygonTesselator;
          const expected = triangles({
            attributes: {
              getPolygon: {value: tessellator.get('positions')!},
              indices: {value: tessellator.get('indices')!}
            }
          });
          expect(actual.reduce((sum, triangle) => sum + projectedArea(triangle), 0)).toBeCloseTo(
            expected.reduce((sum, triangle) => sum + projectedArea(triangle), 0),
            8
          );
          const heights = actual.flat().map(point => point[2]);
          const expectedHeights = expected.flat().map(point => point[2]);
          expect(Math.min(...heights)).toBeCloseTo(Math.min(...expectedHeights), 8);
          expect(Math.max(...heights)).toBeCloseTo(Math.max(...expectedHeights), 8);
        });
        expect(onError).not.toHaveBeenCalled();
      } finally {
        manager.finalize();
      }
      expect(depth.length).toBe(1);
      expect(depth.attributes.getPolygon.value.buffer).toBe(
        fill.attributes.getPolygon.value.buffer
      );
      expect(depth.attributes.indices.value.buffer).toBe(indices.buffer);
      expect(depth.attributes.indices.value.every(index => index < fill.startIndices[1])).toBe(
        true
      );
    }
  );

  test.each(['globe', 'mercator'])('matches legacy viewport normalization for %s', projection => {
    const globe = projection === 'globe';
    const coordinates: number[][][][] = globe
      ? [
          [
            [
              [-25, 50, 0],
              [25, 50, 100],
              [10, 80, 200],
              [-25, 50, 0]
            ]
          ]
        ]
      : [
          [
            [
              [170, 84, 0],
              [190, 84, 10],
              [190, 88, 20],
              [170, 88, 10],
              [170, 84, 0]
            ]
          ],
          [
            [
              [-170, 85, 0],
              [-60, 85, 10],
              [60, 85, 20],
              [170, 85, 30],
              [-170, 85, 0]
            ]
          ]
        ];
    const source = [feature(coordinates)];
    const original = JSON.stringify(source);
    const meshOptions = globe ? {resolution: 10, wrapLongitude: false} : {wrapLongitude: true};
    const {fill} = buildContourMesh(source, meshOptions);
    const viewport = globe
      ? new GlobeViewport({
          width: 200,
          height: 200,
          longitude: 0,
          latitude: 60,
          zoom: 1,
          resolution: 10
        })
      : new WebMercatorViewport({width: 200, height: 200, longitude: 180, latitude: 85, zoom: 3});
    const onError = jest.fn();
    const manager = new LayerManager(device, {viewport});
    manager.setProps({onError});
    try {
      const legacy = new SolidPolygonLayer({
        id: `legacy-normalization-${projection}`,
        data: coordinates,
        getPolygon: polygon => polygon,
        wrapLongitude: !globe,
        extruded: false
      });
      manager.setLayers([legacy]);
      const tessellator = legacy.state.polygonTesselator;
      const expected = triangles({
        attributes: {
          getPolygon: {value: tessellator.get('positions')!},
          indices: {value: tessellator.get('indices')!}
        }
      });
      const triangleKeys = (values: number[][][]) =>
        values
          .map(triangle =>
            triangle
              .map(point => point.join(','))
              .sort()
              .join(';')
          )
          .sort();
      const actual = triangles(fill);
      expect(actual.length).toBeGreaterThan(1);
      expect(triangleKeys(actual)).toEqual(triangleKeys(expected));
      expect(onError).not.toHaveBeenCalled();
      if (globe) {
        for (const triangle of actual) {
          for (const axis of [0, 1]) {
            const values = triangle.map(point => point[axis]);
            expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(10);
          }
        }
      } else {
        expect(actual.flat().every(point => Math.abs(point[0]) <= 180)).toBe(true);
        expect(actual.flat().some(point => point[1] === 86)).toBe(true);
      }
      expect(JSON.stringify(source)).toBe(original);
    } finally {
      manager.finalize();
    }
    expect(buildContourMesh([feature([])], meshOptions).fill.attributes.indices.value).toHaveLength(
      0
    );
  });

  test('bounds vertex storage by grid points per level instead of repeated triangle corners', () => {
    const size = 16;
    const points = Array.from({length: size * size}, (_, i) => [
      (i % size) / 100,
      40 + Math.floor(i / size) / 100,
      (i % size) + Math.floor(i / size)
    ]);
    const polygons: number[][][][] = [];
    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size - 1; col++) {
        const a = points[row * size + col];
        const b = points[row * size + col + 1];
        const c = points[(row + 1) * size + col];
        const d = points[(row + 1) * size + col + 1];
        polygons.push([[a, b, d, a]], [[a, d, c, a]]);
      }
    }
    const levels = 20;
    const {fill, depth} = buildContourMesh(
      Array.from({length: levels}, (_, rank) => feature(polygons, rank))
    );
    expect(fill.attributes.getPolygon.value.length / 3).toBeLessThanOrEqual(levels * size * size);
    expect(fill.attributes.indices.value.length).toBe(levels * (size - 1) ** 2 * 6);
    expect(depth.attributes.getPolygon.value.length / 3).toBeLessThanOrEqual(size * size);
    expect(depth.attributes.indices.value.length).toBe((size - 1) ** 2 * 6);
  });

  test('handles empty features and degenerate pieces', () => {
    for (const source of [
      [],
      [feature([])],
      [
        feature([
          [
            [
              [0, 0, 0],
              [1, 0, 1],
              [2, 0, 2],
              [0, 0, 0]
            ]
          ]
        ])
      ]
    ]) {
      const {fill, depth} = buildContourMesh(source);
      expect(fill.length).toBe(source.length);
      expect(fill.attributes.getPolygon.value).toHaveLength(0);
      expect(fill.attributes.indices.value).toHaveLength(0);
      expect(depth.length).toBe(Math.min(1, source.length));
      expect(depth.attributes.indices.value).toHaveLength(0);
    }
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
    const spike = testGrid(samples(9, (x, y) => (x === 4 && y === 4 ? 100 : 0)));
    expect(smoothScalarGrid(spike, 0)).toBe(spike.values);
    const smooth = smoothScalarGrid(spike, 1.5);
    expect(smooth[40]).toBeLessThan(100);
    expect(smooth[40]).toBeGreaterThan(smooth[41]);
    expect(smooth[41]).toBeGreaterThan(0);
    const constant = testGrid(samples(9, () => -12));
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
        const grid = testGrid(samples(9, (x, y) => (holes && x === 4 && y === 4 ? null : value)));
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
    const grid = testGrid(samples(9, (x, y) => (x === 4 && y === 4 ? null : 1)));
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
    expect(grid.latitude + (grid.height - 1 - grid.border!) * grid.stepLat).toBeCloseTo(60.01);
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

  test.each([false, true])('reserves and preserves one ring in a 10-cell axis, below=%s', below => {
    const sign = below ? -1 : 1;
    const grid = buildContourGrid([point(0, 0, 100 * sign), point(0.03, 0.03, 0.2 * sign)], 10)!;
    expect(grid.width).toBe(10);
    expect(grid.height).toBe(10);
    expect(grid.longitude + grid.stepLng).toBeCloseTo(0, 12);
    expect(grid.latitude + grid.stepLat).toBeCloseTo(0, 12);
    expect(grid.longitude + 8 * grid.stepLng).toBeCloseTo(0.03, 8);
    expect(grid.latitude + 8 * grid.stepLat).toBeCloseTo(0.03, 12);
    expect(grid.values[11]).toBe(100 * sign);
    expect(grid.values[88]).toBe(0.2 * sign);
    const smoothed = smoothScalarGrid(grid, 2);
    for (let i = 0; i < 10; i++) {
      for (const edge of [i, 90 + i, i * 10, i * 10 + 9]) {
        expect(grid.values[edge]).toBe(0);
        expect(smoothed[edge]).toBe(0);
      }
    }
    const contours = generateContours(grid, {
      smoothing: 2,
      levels: 2,
      below,
      domain: below ? [-2, -1] : [1, 2]
    });
    expect(contours).toHaveLength(2);
    const west = Math.min(
      ...contours.flatMap(feature =>
        feature.geometry.coordinates.flat(2).map(([longitude]) => longitude)
      )
    );
    expect(west).toBeGreaterThan(grid.longitude);
    expect(west).toBeLessThan(0);
  });

  test.each([
    [32, 1],
    [48, 2],
    [64, 2],
    [80, 3],
    [128, 4],
    [256, 8]
  ])('fits a %s-cell axis around %s border cells on each side', (resolution, border) => {
    const grid = buildContourGrid([point(0, 0, 100), point(0.03, 0.03, 1)], resolution)!;
    expect(grid).toMatchObject({width: resolution, height: resolution, border});
    expect(grid.longitude + border * grid.stepLng).toBeCloseTo(0, 12);
    expect(grid.latitude + border * grid.stepLat).toBeCloseTo(0, 12);
    const last = resolution - 1 - border;
    expect(grid.longitude + last * grid.stepLng).toBeCloseTo(0.03, 8);
    expect(grid.latitude + last * grid.stepLat).toBeCloseTo(0.03, 12);
    expect(grid.values[border * resolution + border]).toBe(100);
    expect(grid.values[last * resolution + last]).toBe(1);
    for (let row = 0; row < resolution; row++) {
      for (let col = 0; col < resolution; col++) {
        if (row < border || row > last || col < border || col > last) {
          expect(grid.values[row * resolution + col]).toBe(0);
        }
      }
    }
  });

  test.each([false, true])('smooths edge peaks across the padding, below=%s', below => {
    const sign = below ? -1 : 1;
    const grid = buildContourGrid([point(0, 0, 100 * sign), point(0.03, 0.03, sign)], 128)!;
    const border = grid.border!;
    const smoothed = smoothScalarGrid(grid, 2);
    const edge = Array.from(smoothed.slice(border * grid.width, border * grid.width + border + 1));
    expect(edge[0]).toBe(0);
    for (let col = 1; col <= border; col++) {
      expect(edge[col] * sign).toBeGreaterThan(edge[col - 1] * sign);
    }
    const contours = generateContours(grid, {
      smoothing: 2,
      levels: 2,
      below,
      domain: below ? [-2, -1] : [1, 2]
    });
    expect(contours).toHaveLength(2);
    const west = Math.min(
      ...contours.flatMap(feature =>
        feature.geometry.coordinates.flat(2).map(([longitude]) => longitude)
      )
    );
    expect(west).toBeGreaterThan(grid.longitude);
    expect(west).toBeLessThan(-grid.stepLng);
  });

  test('limits zero-inclusive contours to the same ten-cell grid', () => {
    const grid = buildContourGrid([point(0, 0, 100), point(0.03, 0.03, 1)], 10)!;
    const result = generateContours(grid, {smoothing: 2, levels: 2, below: true, domain: [1, 2]});
    const west = (feature: (typeof result)[number]) =>
      Math.min(...feature.geometry.coordinates.flat(2).map(([longitude]) => longitude));
    expect(result.map(feature => feature.properties.threshold)).toEqual([2, 1]);
    for (const feature of result) {
      expect(west(feature)).toBeCloseTo(grid.longitude - grid.stepLng / 2, 12);
    }
  });

  test.each([4, 64])(
    'derives automatic levels inside a %s-cell grid without dropping real zeros',
    resolution => {
      const settings = {smoothing: 0, levels: 2, below: false};
      const grid = buildContourGrid(
        [point(0, 0, 50), point(0.01, 0, 60), point(0, 0.01, 80), point(0.01, 0.01, 110)],
        resolution
      )!;
      const border = grid.border!;
      for (let row = border; row < grid.height - border; row++) {
        for (let col = border; col < grid.width - border; col++) {
          const index = row * grid.width + col;
          if (grid.values[index] === 0) grid.values[index] = 50;
        }
      }
      const levels = (opts: ContourOptions = settings) =>
        generateContours(grid, opts).map(feature => feature.properties.threshold);
      expect(levels()).toEqual([70, 90]);
      expect(levels({...settings, domain: [0, 30]})).toEqual([0, 30]);

      grid.values[border * grid.width + border] = 0;
      expect(levels()).toEqual([110 / 3, (110 * 2) / 3]);
    }
  );

  test.each<[string, [number, number][]]>([
    [
      'west',
      [
        [-179.99, 0],
        [-179.89, 0]
      ]
    ],
    [
      'east',
      [
        [179.89, 0],
        [179.99, 0]
      ]
    ],
    [
      'north',
      [
        [0, 89.89],
        [0, 89.99]
      ]
    ],
    [
      'south',
      [
        [0, -89.99],
        [0, -89.89]
      ]
    ]
  ])('retains the unpadded layout near the %s world limit', (_, coordinates) => {
    const input = coordinates.map(([longitude, latitude], index) =>
      point(longitude, latitude, index + 1)
    );
    const grid = buildContourGrid(input, 10)!;
    expect(grid.border).toBeUndefined();
    expect(grid).toEqual(buildContourGrid(input, 10, 'MEAN', false));
  });

  test('reserves the ring just inside the eastern fallback cutoff', () => {
    const grid = buildContourGrid([point(179.85, 0, 1), point(179.95, 0, 2)], 10)!;
    expect(grid.border).toBe(1);
    expect(grid.longitude + (grid.width - 0.5) * grid.stepLng).toBeLessThanOrEqual(180);
  });

  test('keeps a zero field empty and handles a single nonzero sample', () => {
    const zero = buildContourGrid([point(0, 0, 0)], 10)!;
    expect(generateContours(zero, {smoothing: 2, levels: 2, below: false})).toEqual([]);
    const peak = buildContourGrid([point(0, 0, 100)], 10)!;
    const contour = generateContours(peak, {smoothing: 2, levels: 2, below: false});
    expect(contour).toHaveLength(2);
    expect(
      buildContourSurface({...peak, values: smoothScalarGrid(peak, 2)}, contour).fills
    ).toHaveLength(2);
  });

  test.each(['MEAN', 'COUNT'] as const)(
    'aggregates worldwide samples without merging the antimeridian endpoints in %s mode',
    aggregation => {
      const input = [-89, 0, 89].flatMap(latitude =>
        [-180, -90, 0, 90, 180].map(longitude => point(longitude, latitude, 2))
      );
      input.push(point(-180, 0, 6));
      const grid = buildContourGrid(input, 64, aggregation)!;
      expect(grid.width).toBe(64);
      expect(grid.values.every(Number.isFinite)).toBe(true);
      expect(grid.longitude - grid.stepLng / 2).toBe(-180);
      expect(grid.longitude + (grid.width - 0.5) * grid.stepLng).toBe(180);
      expect(grid.latitude - grid.stepLat / 2).toBeCloseTo(-90);
      expect(grid.latitude + (grid.height - 0.5) * grid.stepLat).toBeCloseTo(90);
      expect(at(grid, grid.longitude, 0)).toBe(aggregation === 'MEAN' ? 4 : 2);
      expect(at(grid, grid.longitude + (grid.width - 1) * grid.stepLng, 0)).toBe(
        aggregation === 'MEAN' ? 2 : 1
      );
      if (aggregation === 'COUNT') {
        expect(grid.values.reduce((sum, value) => sum + value, 0)).toBe(input.length);
      }
    }
  );

  test.each([2, 32, 64, 256, 100000])(
    'keeps global contour rings inside the world at resolution %s',
    resolution => {
      const grid = buildContourGrid(
        [-89.99, 0, 89.99].flatMap(latitude =>
          [-180, -90, 0, 90, 180].map(longitude => point(longitude, latitude, 10))
        ),
        resolution
      )!;
      expect(Math.max(grid.width, grid.height)).toBe(Math.min(resolution, 256));
      const features = generateContours(grid, {...options, below: false});
      expect(features).toHaveLength(3);
      const positions = features.flatMap(feature => feature.geometry.coordinates.flat(2));
      expect(positions.some(([longitude]) => longitude === -180)).toBe(true);
      expect(positions.some(([longitude]) => longitude === 180)).toBe(true);
      for (const [longitude, latitude] of positions) {
        expect(Number.isFinite(longitude) && Number.isFinite(latitude)).toBe(true);
        expect(Math.abs(longitude)).toBeLessThanOrEqual(180);
        expect(Math.abs(latitude)).toBeLessThanOrEqual(90);
      }
      for (const feature of features) {
        for (const ring of feature.geometry.coordinates.flat()) {
          expect(ring[ring.length - 1]).toEqual(ring[0]);
        }
      }
    }
  );

  test.each([false, true])(
    'cuts date-line peaks without smoothing or joining across the seam (below: %s)',
    below => {
      const sign = below ? -1 : 1;
      const makeGrid = (west: number, east: number) =>
        buildContourGrid(
          [point(-179, 0, west * sign), point(0, 0, 0), point(179, 0, east * sign)],
          64
        )!;
      const grid = makeGrid(10, 10);
      const smoothed = smoothScalarGrid(grid, 1);
      const western = smoothScalarGrid(makeGrid(10, 0), 1);
      const eastern = smoothScalarGrid(makeGrid(0, 10), 1);
      for (let row = 0; row < grid.height; row++) {
        const left = row * grid.width;
        const right = left + grid.width - 1;
        expect(smoothed[left]).toBe(western[left]);
        expect(smoothed[right]).toBe(eastern[right]);
        expect(western[right]).toBe(0);
        expect(eastern[left]).toBe(0);
      }
      const features = generateContours(grid, {
        smoothing: 1,
        levels: 2,
        below,
        domain: below ? [-2, -1] : [1, 2]
      });
      expect(features).toHaveLength(2);
      for (const feature of features) {
        const polygons = feature.geometry.coordinates;
        expect(polygons).toHaveLength(2);
        expect(polygons.some(polygon => polygon.flat().some(([lng]) => lng === -180))).toBe(true);
        expect(polygons.some(polygon => polygon.flat().some(([lng]) => lng === 180))).toBe(true);
        for (const polygon of polygons) {
          const longitudes = polygon.flat().map(([lng]) => lng);
          expect(Math.max(...longitudes) - Math.min(...longitudes)).toBeLessThan(90);
        }
      }
    }
  );

  test('bounds grid allocation and handles empty inputs and invalid settings', () => {
    const grid = buildContourGrid([point(0, 0, 4), point(10, 10, 8)], 100000)!;
    expect(Math.max(grid.width, grid.height)).toBe(256);
    expect(grid.values.length).toBeLessThanOrEqual(256 * 256);
    expect([...grid.values].every(Number.isFinite)).toBe(true);
    expect(buildContourGrid([])).toBeNull();
    for (const resolution of [0, 1, -1, NaN, Infinity]) {
      expect(() => buildContourGrid([point(0, 0, 1)], resolution)).toThrow('grid resolution');
    }
  });
});
