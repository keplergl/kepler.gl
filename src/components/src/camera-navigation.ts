// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FlyToInterpolator} from '@deck.gl/core';
import {CameraSnapshot, MapState} from '@kepler.gl/types';
import {cameraForMap} from '@kepler.gl/utils';

export function cameraTransition(
  camera: CameraSnapshot,
  mapState?: MapState
): CameraSnapshot & {transitionDuration: number; transitionInterpolator?: FlyToInterpolator} {
  // Mercator fly interpolation cannot represent globe views near the poles.
  return mapState?.globe?.enabled
    ? {...cameraForMap(camera, true), transitionDuration: 0}
    : {...camera, transitionDuration: 1000, transitionInterpolator: new FlyToInterpolator()};
}
