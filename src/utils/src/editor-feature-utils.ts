// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature} from '@kepler.gl/types';

const EDITOR_INTERNAL_PROPERTIES = new Set([
  'isClosed',
  'filterId',
  'bbox',
  'isVisible',
  'guideType',
  'editHandleType',
  'shape',
  'renderType'
]);

export type EditorFeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

/**
 * Strip editor-only properties so copied / converted GeoJSON is usable as data.
 */
export function sanitizeEditorFeature(feature: Feature): Feature {
  const properties = Object.entries(feature.properties || {}).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (!EDITOR_INTERNAL_PROPERTIES.has(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  return {
    type: 'Feature',
    id: feature.id,
    properties,
    geometry: feature.geometry
  };
}

/**
 * Convert editor sketch features into a GeoJSON FeatureCollection.
 */
export function editorFeaturesToFeatureCollection(
  features: Feature[] = []
): EditorFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: features.filter(feature => Boolean(feature?.geometry)).map(sanitizeEditorFeature)
  };
}

/**
 * Convert a polygon-filter feature back into an editor sketch.
 */
export function toSketchFeature(feature: Feature): Feature {
  const properties = {...(feature.properties || {})};
  delete properties.filterId;
  return {
    ...feature,
    properties
  };
}

/**
 * Map position for a filter badge: the vertex nearest the north-east bbox corner.
 */
export function getFilterFeatureAnchor(feature: Feature): [number, number] | null {
  const geometry = feature?.geometry;
  if (!geometry) {
    return null;
  }

  let ring: number[][] | undefined;
  if (geometry.type === 'Polygon') {
    ring = geometry.coordinates?.[0];
  } else if (geometry.type === 'MultiPolygon') {
    ring = geometry.coordinates?.[0]?.[0];
  }

  if (!Array.isArray(ring) || !ring.length) {
    const bbox = feature.properties?.bbox;
    if (Array.isArray(bbox) && bbox.length >= 4 && Number.isFinite(bbox[2]) && Number.isFinite(bbox[3])) {
      return [bbox[2], bbox[3]];
    }
    return null;
  }

  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const coord of ring) {
    if (coord[0] > maxLng) maxLng = coord[0];
    if (coord[1] > maxLat) maxLat = coord[1];
  }
  if (!Number.isFinite(maxLng) || !Number.isFinite(maxLat)) {
    return null;
  }

  let nearest = ring[0];
  let best = Infinity;
  for (const coord of ring) {
    const dx = coord[0] - maxLng;
    const dy = coord[1] - maxLat;
    const dist = dx * dx + dy * dy;
    if (dist < best) {
      best = dist;
      nearest = coord;
    }
  }
  return [nearest[0], nearest[1]];
}
