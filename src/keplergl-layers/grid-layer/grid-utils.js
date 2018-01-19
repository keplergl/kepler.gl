import {WebMercatorViewport} from 'deck.gl';

/**
 * top left of the grid to a square polygon for the hover layer
 * and current latitude
 * @param {object} object
 * @param {number} cellSize
 * @param {number} coverage
 * @param {object} properties
 * @param {object} mapState
 * @returns {object} - geojson feature
 */

// TODO: TEST
export function pointToPolygonGeo({
  object,
  cellSize,
  coverage,
  properties,
  mapState
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
