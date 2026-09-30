// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {point} from '@turf/helpers';
import {distance as turfDistance} from '@turf/distance';

function formatMeasureKmLabel(kind: 'Radius' | 'Length', km: number): string {
  if (!Number.isFinite(km) || km <= 0) {
    return '';
  }
  return `${kind}: ${km.toFixed(2)} km`;
}

/** Format a Turf radius (kilometers) as a map label. */
export function formatCircleRadiusLabel(radiusKm: number): string {
  return formatMeasureKmLabel('Radius', radiusKm);
}

/** Format a geodesic line length (kilometers) as a map label. */
export function formatLineLengthLabel(lengthKm: number): string {
  return formatMeasureKmLabel('Length', lengthKm);
}

/** Sum geodesic distances between consecutive coordinates, in kilometers. */
export function getLineLengthKm(coordinates: number[][] = []): number {
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const from = coordinates[i - 1];
    const to = coordinates[i];
    if (!from || !to || from.length < 2 || to.length < 2) {
      continue;
    }
    total += turfDistance(point(from), point(to));
  }
  return total;
}
