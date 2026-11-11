// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FlyToInterpolator, LinearInterpolator} from '@deck.gl/core';
import {CameraSnapshot, MapState} from '@kepler.gl/types';
import {cameraForMap} from '@kepler.gl/utils';

export function cameraTransition(
  camera: CameraSnapshot,
  mapState?: MapState
): CameraSnapshot & {
  transitionDuration: number;
  transitionInterpolator?: FlyToInterpolator | LinearInterpolator;
} {
  // GlobeController supplies shortest-path longitude endpoints. Linear interpolation
  // stays in geographic coordinates, unlike Mercator fly interpolation near poles.
  return mapState?.globe?.enabled
    ? {
        ...cameraForMap(camera, true),
        transitionDuration: 1000,
        transitionInterpolator: new LinearInterpolator()
      }
    : {...camera, transitionDuration: 1000, transitionInterpolator: new FlyToInterpolator()};
}
