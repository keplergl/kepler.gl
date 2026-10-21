// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FlyToInterpolator} from '@deck.gl/core';
import {CameraSnapshot} from '@kepler.gl/types';

export function cameraTransition(camera: CameraSnapshot) {
  return {...camera, transitionDuration: 1000, transitionInterpolator: new FlyToInterpolator()};
}
