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
 * @param coordinate - fallback position from picking info (deck.gl 9 no longer provides object.position)
 * @returns - geojson feature
 */

// TODO: TEST
export function pointToPolygonGeo({
  object,
  cellSize,
  coverage,
  properties,
  mapState,
  coordinate
}: {
  object: any;
  cellSize: number;
  coverage: number;
  properties?: any;
  mapState: MapState;
  coordinate?: number[];
}) {
  const position = object.position || coordinate;
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
