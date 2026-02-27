// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** @jest-environment node */

// loaders.gl expects fetch globals (Response, etc). Node < 18 / Jest may not provide them.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeFetch = require('node-fetch');
(global as any).fetch = (global as any).fetch || nodeFetch;
(global as any).Response = (global as any).Response || nodeFetch.Response;
(global as any).Headers = (global as any).Headers || nodeFetch.Headers;
(global as any).Request = (global as any).Request || nodeFetch.Request;

import {getPolygonFilterFunctor} from './filter-utils';
import {getGeojsonPointPositionFromRaw} from '../../layers/src/geojson-layer/geojson-position-utils';

describe('filterUtils - polygon filter', () => {
  const squarePolygon = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1]
        ]
      ]
    }
  };

  test('WKT POINT string can be used for polygon filter', () => {
    const layer = {
      type: 'point',
      getPositionAccessor: () => (d: {raw: unknown}) => getGeojsonPointPositionFromRaw(d.raw)
    };

    const filter = {value: squarePolygon};
    const fn = getPolygonFilterFunctor(layer, filter, null);

    expect(getGeojsonPointPositionFromRaw('POINT (0.5 0.5)')).toEqual([0.5, 0.5]);

    expect(fn({raw: 'POINT (0.5 0.5)'})).toBe(true);
    expect(fn({raw: 'POINT (10 10)'})).toBe(false);
  });

  test('MultiPoint keeps row if any point is inside polygon', () => {
    const layer = {
      type: 'point',
      getPositionAccessor: () => (d: {pos: any}) => d.pos
    };

    const filter = {value: squarePolygon};
    const fn = getPolygonFilterFunctor(layer, filter, null);

    expect(
      fn({
        pos: [
          [10, 10],
          [0.2, 0.2]
        ]
      })
    ).toBe(true);

    expect(
      fn({
        pos: [
          [10, 10],
          [20, 20]
        ]
      })
    ).toBe(false);
  });
});
