// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
