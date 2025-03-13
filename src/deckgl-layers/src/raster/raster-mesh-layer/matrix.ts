// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, Viewport, CoordinateSystem} from '@deck.gl/core/typed';

// only apply composeModelMatrix when in cartesian or meter_offsets coordinate system
// with `composeModelMatrix` enabled, the rotation part of the layer's modelMatrix will be composed to instance's transformations
// since rotating latitude and longitude can not provide meaningful results, hence `composeModelMatrix` is disabled
// when in LNGLAT and LNGLAT_OFFSET coordinates.
export function shouldComposeModelMatrix(
  viewport: Viewport,
  coordinateSystem: CoordinateSystem
): boolean {
  return (
    coordinateSystem === COORDINATE_SYSTEM.CARTESIAN ||
    coordinateSystem === COORDINATE_SYSTEM.METER_OFFSETS ||
    (coordinateSystem === COORDINATE_SYSTEM.DEFAULT && !viewport.isGeospatial)
  );
}
