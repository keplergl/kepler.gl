// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {WebMercatorViewport} from '@deck.gl/core';
import {MapState} from '@kepler.gl/types';

/**
 * top left of the grid to a square polygon for the hover layer
 * and current latitude
 * @param object
 * @param cellSize
 * @param coverage
 * @param properties
 * @param mapState
 * @returns - geojson feature
 */

// TODO: TEST
export function pointToPolygonGeo({
  object,
  cellSize,
  coverage,
  properties,
  mapState
}: {
  object: any;
  cellSize: number;
  coverage: number;
  properties?: any;
  mapState: MapState;
}) {
  const {position} = object;
  const viewport = new WebMercatorViewport(mapState);

  if (!position) {
    return null;
  }

  return {
    geometry: {
      coordinates: [
        viewport.addMetersToLngLat(position, [
          cellSize * (0.5 - coverage / 2),
          cellSize * (0.5 - coverage / 2)
        ]),
        viewport.addMetersToLngLat(position, [
          cellSize * (0.5 + coverage / 2),
          cellSize * (0.5 - coverage / 2)
        ]),
        viewport.addMetersToLngLat(position, [
          cellSize * (0.5 + coverage / 2),
          cellSize * (0.5 + coverage / 2)
        ]),
        viewport.addMetersToLngLat(position, [
          cellSize * (0.5 - coverage / 2),
          cellSize * (0.5 + coverage / 2)
        ]),
        viewport.addMetersToLngLat(position, [
          cellSize * (0.5 - coverage / 2),
          cellSize * (0.5 - coverage / 2)
        ])
      ],
      type: 'LineString'
    },
    properties
  };
}
