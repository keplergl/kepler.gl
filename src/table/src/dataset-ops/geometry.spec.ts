// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Geometry, Position} from 'geojson';
import {h3ContainsH3, h3ContainsPoint, mergeGeometries} from './geometry';

const lineA: Position[] = [
  [0, 0, 10],
  [1, 1, 20]
];
const lineB: Position[] = [
  [2, 2],
  [3, 3]
];
const outer = [
  [0, 0],
  [4, 0],
  [4, 4],
  [0, 4],
  [0, 0]
];
const hole = [
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 1],
  [1, 1]
];
const other = [
  [5, 5],
  [6, 5],
  [6, 6],
  [5, 5]
];

const mergeCases: {name: string; inputs: Geometry[]; expected: Geometry}[] = [
  {
    name: 'points retain altitude and ordering',
    inputs: [
      {type: 'Point', coordinates: [0, 0, 10]},
      {type: 'Point', coordinates: [1, 1, 20]}
    ],
    expected: {
      type: 'MultiPoint',
      coordinates: [
        [0, 0, 10],
        [1, 1, 20]
      ]
    }
  },
  {
    name: 'multipoints concatenate without an extra nesting level',
    inputs: [
      {type: 'MultiPoint', coordinates: lineA},
      {type: 'MultiPoint', coordinates: lineB}
    ],
    expected: {type: 'MultiPoint', coordinates: [...lineA, ...lineB]}
  },
  {
    name: 'lines remain separate paths',
    inputs: [
      {type: 'LineString', coordinates: lineA},
      {type: 'LineString', coordinates: lineB}
    ],
    expected: {type: 'MultiLineString', coordinates: [lineA, lineB]}
  },
  {
    name: 'multilines concatenate paths rather than vertices',
    inputs: [
      {type: 'MultiLineString', coordinates: [lineA]},
      {type: 'MultiLineString', coordinates: [lineB]}
    ],
    expected: {type: 'MultiLineString', coordinates: [lineA, lineB]}
  },
  {
    name: 'polygons retain holes within their original polygon',
    inputs: [
      {type: 'Polygon', coordinates: [outer, hole]},
      {type: 'Polygon', coordinates: [other]}
    ],
    expected: {type: 'MultiPolygon', coordinates: [[outer, hole], [other]]}
  },
  {
    name: 'multipolygons concatenate polygons rather than rings',
    inputs: [
      {type: 'MultiPolygon', coordinates: [[outer, hole]]},
      {type: 'MultiPolygon', coordinates: [[other]]}
    ],
    expected: {type: 'MultiPolygon', coordinates: [[outer, hole], [other]]}
  }
];

describe('dataset geometry merging', () => {
  test.each(mergeCases)('$name', ({inputs, expected}) => {
    const before = JSON.parse(JSON.stringify(inputs));
    expect(mergeGeometries(inputs)).toEqual({type: 'Feature', geometry: expected, properties: {}});
    expect(inputs).toEqual(before);
  });

  test('flattens nested collections while retaining mixed geometry order', () => {
    const point: Geometry = {type: 'Point', coordinates: [7, 8]};
    const line: Geometry = {type: 'LineString', coordinates: lineA};
    const polygon: Geometry = {type: 'Polygon', coordinates: [outer, hole]};
    const collection: Geometry = {
      type: 'GeometryCollection',
      geometries: [point, {type: 'GeometryCollection', geometries: [line]}]
    };
    expect(
      mergeGeometries([{type: 'Feature', geometry: collection, properties: {}}, polygon])
    ).toEqual({
      type: 'Feature',
      geometry: {type: 'GeometryCollection', geometries: [point, line, polygon]},
      properties: {}
    });
  });

  test('homogeneous nested collections still produce a single multipart geometry', () => {
    const point: Geometry = {type: 'Point', coordinates: [7, 8]};
    expect(
      mergeGeometries([
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'GeometryCollection',
            geometries: [point, {type: 'GeometryCollection', geometries: [point]}]
          }
        }
      ])?.geometry
    ).toEqual({
      type: 'MultiPoint',
      coordinates: [
        [7, 8],
        [7, 8]
      ]
    });
  });

  test('skips missing and unreadable rows without losing the one usable geometry', () => {
    expect(
      mergeGeometries([
        null,
        undefined,
        'not geometry',
        42,
        JSON.stringify({type: 'Point', coordinates: [7, 8]})
      ])
    ).toEqual({
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [7, 8]},
      properties: {}
    });
    expect(
      mergeGeometries([
        null,
        'invalid',
        {type: 'Feature', properties: {}, geometry: {type: 'GeometryCollection', geometries: []}}
      ])
    ).toBeNull();
    expect(mergeGeometries([])).toBeNull();
  });
});

describe('dataset H3 containment', () => {
  // San Francisco at resolutions 5, 7 and 9; New York at resolutions 7 and 9.
  const sf5 = '85283083fffffff';
  const sf7 = '872830828ffffff';
  const sf9 = '89283082803ffff';
  const ny7 = '872a1072dffffff';
  const ny9 = '892a1072d6bffff';

  test('uses longitude/latitude input order and the containing cell resolution', () => {
    for (const cell of [sf5, sf7, sf9]) {
      expect(h3ContainsPoint(cell, [-122.418, 37.775])).toBe(true);
      expect(h3ContainsPoint(cell, [-74, 40.7])).toBe(false);
    }
    expect(h3ContainsPoint(ny7, [-74, 40.7])).toBe(true);
  });

  test('cell containment is directional, including exact identity', () => {
    expect(h3ContainsH3(sf7, sf7)).toBe(true);
    expect(h3ContainsH3(sf5, sf7)).toBe(true);
    expect(h3ContainsH3(sf5, sf9)).toBe(true);
    expect(h3ContainsH3(sf7, sf9)).toBe(true);
    expect(h3ContainsH3(sf9, sf7)).toBe(false);
    expect(h3ContainsH3(sf7, ny7)).toBe(false);
    expect(h3ContainsH3(sf7, ny9)).toBe(false);
  });

  test.each([null, undefined, '', 'not-a-cell', 0])(
    'invalid cell %p never contains or is contained',
    invalid => {
      expect(h3ContainsPoint(invalid, [-122.418, 37.775])).toBe(false);
      expect(h3ContainsH3(invalid, sf7)).toBe(false);
      expect(h3ContainsH3(sf7, invalid)).toBe(false);
    }
  );
});
