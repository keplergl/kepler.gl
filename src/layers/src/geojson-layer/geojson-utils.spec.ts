// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature} from 'geojson';
import {featureToHoverOutline} from './geojson-utils';

describe('featureToHoverOutline', () => {
  test('converts Polygon rings to MultiLineString so hover overlay skips fill tessellation', () => {
    const coordinates = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0]
      ]
    ];
    const feature: Feature = {
      type: 'Feature',
      properties: {index: 0},
      geometry: {
        type: 'Polygon',
        coordinates
      }
    };

    expect(featureToHoverOutline(feature)).toEqual({
      ...feature,
      geometry: {
        type: 'MultiLineString',
        coordinates
      }
    });
  });

  test('flattens MultiPolygon rings into a MultiLineString', () => {
    const rings = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0]
      ],
      [
        [2, 2],
        [3, 2],
        [3, 3],
        [2, 2]
      ]
    ];
    const feature: Feature = {
      type: 'Feature',
      properties: {index: 1},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[rings[0]], [rings[1]]]
      }
    };

    expect(featureToHoverOutline(feature).geometry).toEqual({
      type: 'MultiLineString',
      coordinates: rings
    });
  });

  test('leaves point and line features unchanged', () => {
    const point: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {type: 'Point', coordinates: [1, 2]}
    };
    const line: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }
    };

    expect(featureToHoverOutline(point)).toBe(point);
    expect(featureToHoverOutline(line)).toBe(line);
  });
});
