// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {requireValue} from '../../../../test/helpers/require-value';
import {lngLatToWorld} from '@math.gl/web-mercator';
import {buildVoronoiMosaic, VoronoiSite} from './voronoi-utils';

const sites = (coordinates: number[][]): VoronoiSite[] =>
  coordinates.map((position, index) => ({index, position: position as [number, number]}));

test('creates a cell for each site with vertices closest to its owner in projected space', () => {
  const input = sites([
    [-2, -1],
    [1, -2],
    [2, 2],
    [-1, 3],
    [0, 0]
  ]);
  const {cells} = buildVoronoiMosaic(input, 15);
  expect(cells.map(cell => cell.index)).toEqual([0, 1, 2, 3, 4]);
  const projected = input.map(site => lngLatToWorld(site.position));
  const distance = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  for (const cell of cells) {
    expect(cell.polygon[0]).toEqual(cell.polygon[cell.polygon.length - 1]);
    for (const vertex of cell.polygon) {
      const point = lngLatToWorld(vertex);
      for (const other of projected) {
        expect(distance(point, projected[cell.index])).toBeLessThanOrEqual(
          distance(point, other) + 1e-8
        );
      }
    }
  }
});

test.each(
  [
    [[0, 0]],
    [
      [-1, 0],
      [1, 0]
    ],
    [
      [-1, 0],
      [0, 0],
      [1, 0]
    ],
    [
      [0, -1],
      [0, 0],
      [0, 1]
    ]
  ].map(coordinates => ({coordinates}))
)('produces finite nonzero cells for $coordinates', ({coordinates}) => {
  const {cells, bounds} = buildVoronoiMosaic(sites(coordinates), 0);
  expect(cells).toHaveLength(coordinates.length);
  expect(requireValue(bounds)[2]).toBeGreaterThan(requireValue(bounds)[0]);
  expect(requireValue(bounds)[3]).toBeGreaterThan(requireValue(bounds)[1]);
  cells.forEach(cell => {
    expect(cell.polygon.length).toBeGreaterThanOrEqual(4);
    expect(cell.polygon.flat().every(Number.isFinite)).toBe(true);
    const area = cell.polygon.slice(1).reduce((sum, point, i) => {
      const previous = cell.polygon[i];
      return sum + previous[0] * point[1] - point[0] * previous[1];
    }, 0);
    expect(Math.abs(area)).toBeGreaterThan(0);
  });
});

test('ignores invalid coordinates and assigns coincident sites to the first row', () => {
  expect(buildVoronoiMosaic([], 10)).toEqual({cells: [], bounds: null});
  const {cells} = buildVoronoiMosaic(
    sites([
      [NaN, 0],
      [0, Infinity],
      [181, 0],
      [0, 90],
      [0, 0],
      [0, 0],
      [1, 1]
    ]),
    10
  );
  expect(cells.map(cell => cell.index)).toEqual([4, 6]);
  expect(buildVoronoiMosaic(sites([[NaN, NaN]]), 10)).toEqual({cells: [], bounds: null});
});

test('clips cells to padded dataset bounds without moving their internal bisector', () => {
  const input = sites([
    [-1, -1],
    [1, 1]
  ]);
  const tight = buildVoronoiMosaic(input, 0);
  const padded = buildVoronoiMosaic(input, 25);
  expect(requireValue(tight.bounds)[0]).toBeCloseTo(-1);
  expect(requireValue(tight.bounds)[2]).toBeCloseTo(1);
  expect(requireValue(padded.bounds)[0]).toBeCloseTo(-1.5);
  expect(requireValue(padded.bounds)[2]).toBeCloseTo(1.5);
  for (const cell of padded.cells) {
    for (const [lng, lat] of cell.polygon) {
      expect(lng).toBeGreaterThanOrEqual(requireValue(padded.bounds)[0] - 1e-8);
      expect(lng).toBeLessThanOrEqual(requireValue(padded.bounds)[2] + 1e-8);
      expect(lat).toBeGreaterThanOrEqual(requireValue(padded.bounds)[1] - 1e-8);
      expect(lat).toBeLessThanOrEqual(requireValue(padded.bounds)[3] + 1e-8);
    }
  }
});

test('keeps neighboring sites together across the antimeridian', () => {
  const {cells, bounds} = buildVoronoiMosaic(
    sites([
      [179, 0],
      [-179, 0]
    ]),
    0
  );
  expect(cells).toHaveLength(2);
  expect(requireValue(bounds)[0]).toBeCloseTo(179);
  expect(requireValue(bounds)[2]).toBeCloseTo(181);
  expect(Math.max(...cells[0].polygon.map(point => point[0]))).toBeCloseTo(180);
  expect(Math.min(...cells[1].polygon.map(point => point[0]))).toBeCloseTo(180);
});

test('filtered dateline sites retain the full extent and the same longitude unwrapping', () => {
  const input = sites([
    [179, 0],
    [-179, 0]
  ]);
  const original = buildVoronoiMosaic(input, 10);
  const filtered = buildVoronoiMosaic(input, 10, site => site.index === 1);
  expect(filtered.bounds).toEqual(original.bounds);
  expect(filtered.cells.map(cell => cell.index)).toEqual([1]);
  expect(Math.min(...filtered.cells[0].polygon.map(point => point[0]))).toBeCloseTo(
    requireValue(original.bounds)[0]
  );
  expect(Math.max(...filtered.cells[0].polygon.map(point => point[0]))).toBeCloseTo(
    requireValue(original.bounds)[2]
  );
  expect(buildVoronoiMosaic(input, 10, () => false)).toEqual({cells: [], bounds: original.bounds});
});

test('the first remaining duplicate owns the cell when an earlier duplicate is filtered out', () => {
  const input = sites([
    [0, 0],
    [0, 0],
    [2, 0]
  ]);
  const original = buildVoronoiMosaic(input, 10);
  const filtered = buildVoronoiMosaic(input, 10, site => site.index !== 0);
  expect(filtered.cells.map(cell => cell.index)).toEqual([1, 2]);
  expect(filtered.cells[0].polygon).toEqual(original.cells[0].polygon);
  expect(filtered.bounds).toEqual(original.bounds);
});
