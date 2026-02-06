// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {parseGeoJsonRawFeature} from './geojson-utils';

/**
 * Parse a raw geo field into Point/MultiPoint coordinates.
 * Supports GeoJSON objects, WKT strings (via loaders.gl), and binary geometries.
 */
export function getGeojsonPointPositionFromRaw(
  raw: unknown
): number[] | number[][] | null {
  const feature = parseGeoJsonRawFeature(raw);
  const geometry = feature?.geometry as any;
  if (!geometry) {
    return null;
  }

  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
    return geometry.coordinates;
  }

  if (geometry.type === 'GeometryCollection') {
    const geometries = geometry.geometries || [];
    const coords = geometries.reduce((accu, g) => {
      if (g?.type === 'Point') {
        accu.push(g.coordinates);
      } else if (g?.type === 'MultiPoint') {
        accu.push(...g.coordinates);
      }
      return accu;
    }, []);

    return coords.length ? coords : null;
  }

  return null;
}
