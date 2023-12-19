// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Bounds} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';

const MAX_LATITUDE = 90;
const MIN_LATITUDE = -90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;

/**
 * return center of map from given points
 * @param layers
 * @returns coordinates of map center, empty if not found
 */
export function findMapBounds(layers: Layer[]): Bounds | null {
  // find bounds in formatted layerData
  // take ALL layers into account when finding map bounds
  const availableLayerBounds: Bounds | [] = layers.reduce((res, l) => {
    if (l.meta && l.meta.bounds) {
      // @ts-expect-error
      res.push(l.meta.bounds);
    }
    return res;
  }, []);
  // return null if no layer is available
  if (availableLayerBounds.length === 0) {
    return null;
  }
  // merge bounds in each layer
  const newBounds = (availableLayerBounds as Bounds).reduce(
    (res, b) => {
      return [
        Math.min(res[0], b[0]),
        Math.min(res[1], b[1]),
        Math.max(res[2], b[2]),
        Math.max(res[3], b[3])
      ];
    },
    [MAX_LONGITUDE, MAX_LATITUDE, MIN_LONGITUDE, MIN_LATITUDE]
  );
  // @ts-expect-error
  return newBounds;
}
