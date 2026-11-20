// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getDistanceScales} from '@math.gl/web-mercator';

const equatorialUnitsPerMeter = getDistanceScales({latitude: 0, longitude: 0}).unitsPerMeter[0];

/** Keep existing zoom scaling, but size data-driven symbols in projected units on Mercator. */
export function getSymbolRadiusProps(
  radiusScale: number,
  latitudeStable: boolean,
  fixedRadius: boolean,
  isGlobe: boolean
): {radiusScale: number; radiusUnits: 'meters' | 'common'} {
  return latitudeStable && !fixedRadius && !isGlobe
    ? {radiusScale: radiusScale * equatorialUnitsPerMeter, radiusUnits: 'common'}
    : {radiusScale, radiusUnits: 'meters'};
}
