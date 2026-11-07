// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Bounds} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {
  MAX_LATITUDE,
  MIN_LATITUDE,
  MAX_LONGITUDE,
  MIN_LONGITUDE,
  validateLongitude,
  validateLatitude,
  getWrappedCameraBounds
} from '@kepler.gl/utils';

/**
 * takes a list of layer bounds and returns a single bound
 */
export function processLayerBounds(layerBounds: Bounds[]): Bounds {
  return layerBounds.reduce(
    (res, b) => {
      const minLongitude = Math.min(res[0], b[0]);
      const minLatitude = Math.min(res[1], b[1]);
      const maxLongitude = Math.max(res[2], b[2]);
      const maxLatitude = Math.max(res[3], b[3]);

      // for some reason WebMercatorViewport can't handle latitude -90,90 and throws an error
      // so we default to lat/lng (0,0)
      // viewport.js:81 Uncaught Error: Pixel project matrix not invertible
      // at WebMercatorViewport16.Viewport5 (viewport.js:81:13)
      // at new WebMercatorViewport16 (web-mercator-viewport.js:92:5)
      // at getViewportFromMapState (map-utils.js:46:66)
      return [
        validateLongitude(minLongitude),
        validateLatitude(minLatitude),
        validateLongitude(maxLongitude),
        validateLatitude(maxLatitude)
      ];
    },
    [MAX_LONGITUDE, MAX_LATITUDE, MIN_LONGITUDE, MIN_LATITUDE]
  );
}

/**
 * Return camera-fitting bounds for layers, or null when none have bounds.
 * A compact, fully known point extent can have west > east across the dateline.
 * Geographic layer.meta.bounds and processLayerBounds retain their contract.
 * @param layers
 */
export function findMapBounds(layers: Layer[]): Bounds | null {
  // find bounds in formatted layerData
  // take ALL layers into account when finding map bounds
  const availableLayerBounds = layers.reduce((res, l) => {
    if (l.meta && l.meta.bounds) {
      res.push(l.meta.bounds);
    }
    return res;
  }, [] as Bounds[]);
  // return null if no layer is available
  if (availableLayerBounds.length === 0) {
    return null;
  }
  const geographicBounds = processLayerBounds(availableLayerBounds);
  // Point layers supply a complete coordinate or authoritative metadata extent.
  // Other geometry retains its entire geographic interval when combining it
  // with points. Keep processLayerBounds and layer.meta.bounds unchanged.
  const cameraBounds = layers
    .filter(layer => layer.meta?.bounds)
    .map(layer => layer.meta.cameraBounds || layer.meta.bounds);
  const hasCameraBounds = layers.some(layer => layer.meta?.cameraBounds);
  // An explicit null opts out: this point layer was sampled, so even a narrow
  // sampled interval must not be used to infer a gap across multiple layers.
  const hasIncompleteBounds = layers.some(
    layer => layer.meta?.bounds && layer.meta.cameraBounds === null
  );
  const wrapped =
    hasCameraBounds && !hasIncompleteBounds ? getWrappedCameraBounds(cameraBounds) : null;
  return wrapped
    ? [wrapped[0], geographicBounds[1], wrapped[2], geographicBounds[3]]
    : geographicBounds;
}
