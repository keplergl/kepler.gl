// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Feature, Polygon} from 'geojson';

/** Keep missing, open, nonfinite, or collapsed picked rings out of the editor. */
export function polygonFromRing(ring: unknown): Feature<Polygon> | null {
  if (
    !Array.isArray(ring) ||
    ring.length < 4 ||
    !ring.every(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))
  ) {
    return null;
  }
  const [first] = ring;
  const last = ring[ring.length - 1];
  // Translate to the first vertex to avoid cancellation for small cells.
  const area = ring.slice(1).reduce((sum, point, index) => {
    const previous = ring[index];
    return (
      sum +
      (previous[0] - first[0]) * (point[1] - first[1]) -
      (point[0] - first[0]) * (previous[1] - first[1])
    );
  }, 0);
  return first[0] === last[0] && first[1] === last[1] && area !== 0
    ? {type: 'Feature', properties: {}, geometry: {type: 'Polygon', coordinates: [ring]}}
    : null;
}
