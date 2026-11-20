// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getDistanceScales} from '@math.gl/web-mercator';

const equatorialUnitsPerMeter = getDistanceScales({latitude: 0, longitude: 0}).unitsPerMeter[0];

/** Keep existing zoom scaling, but size symbols in projected units on Mercator. */
export function getSymbolRadiusProps(
  radiusScale: number,
  fixedRadius: boolean,
  isGlobe: boolean
): {radiusScale: number; radiusUnits: 'meters' | 'common'} {
  return !fixedRadius && !isGlobe
    ? {radiusScale: radiusScale * equatorialUnitsPerMeter, radiusUnits: 'common'}
    : {radiusScale, radiusUnits: 'meters'};
}
