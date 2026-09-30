// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Feature, LineString, Polygon} from 'geojson';

const BASE32_CODES = '0123456789bcdefghjkmnpqrstuvwxyz';
const BASE32_CODES_DICT: Record<string, number> = {};
for (let i = 0; i < BASE32_CODES.length; i++) {
  BASE32_CODES_DICT[BASE32_CODES.charAt(i)] = i;
}

const GEOHASH_RE = /^[0123456789bcdefghjkmnpqrstuvwxyz]+$/;
const MIN_GEOHASH_LENGTH = 1;
const MAX_GEOHASH_LENGTH = 12;

const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LON = -180;
const MAX_LON = 180;

export function maybeStripQuotes(token: string): string {
  if (token.length >= 2) {
    const first = token[0];
    const last = token[token.length - 1];
    if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
      return token.slice(1, -1);
    }
  }
  return token;
}

/**
 * Validate a geohash string (base32, length 1–12).
 */
export function validGeohash(token: unknown): boolean {
  if (typeof token !== 'string') {
    return false;
  }
  const cleaned = maybeStripQuotes(token).trim().toLowerCase();
  return (
    cleaned.length >= MIN_GEOHASH_LENGTH &&
    cleaned.length <= MAX_GEOHASH_LENGTH &&
    GEOHASH_RE.test(cleaned)
  );
}

/**
 * Normalize a geohash to a lowercase unquoted string.
 */
export function normalizeGeohash(token: unknown): string | null {
  if (typeof token !== 'string') {
    return null;
  }
  const cleaned = maybeStripQuotes(token).trim().toLowerCase();
  if (!validGeohash(cleaned)) {
    return null;
  }
  return cleaned;
}

/**
 * Decode a geohash to a bounding box [minLat, minLon, maxLat, maxLon].
 * Adapted from deck.gl GeohashLayer / ngeohash decode_bbox.
 */
export function getGeohashBounds(geohash: string): [number, number, number, number] | null {
  const normalized = normalizeGeohash(geohash);
  if (!normalized) {
    return null;
  }

  let isLon = true;
  let maxLat = MAX_LAT;
  let minLat = MIN_LAT;
  let maxLon = MAX_LON;
  let minLon = MIN_LON;

  for (let i = 0; i < normalized.length; i++) {
    const hashValue = BASE32_CODES_DICT[normalized[i]];
    for (let bits = 4; bits >= 0; bits--) {
      const bit = (hashValue >> bits) & 1;
      if (isLon) {
        const mid = (maxLon + minLon) / 2;
        if (bit === 1) {
          minLon = mid;
        } else {
          maxLon = mid;
        }
      } else {
        const mid = (maxLat + minLat) / 2;
        if (bit === 1) {
          minLat = mid;
        } else {
          maxLat = mid;
        }
      }
      isLon = !isLon;
    }
  }

  return [minLat, minLon, maxLat, maxLon];
}

/**
 * Retrieve geohash cell center as [lng, lat].
 */
export function getGeohashCenter(token: string): [number, number] | null {
  const bounds = getGeohashBounds(token);
  if (!bounds) {
    return null;
  }
  const [minLat, minLon, maxLat, maxLon] = bounds;
  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}

/**
 * Convert a geohash token to a GeoJSON Feature for hover outline rendering.
 */
export function geohashToPolygonGeo(
  object?: {token?: string},
  properties?: {isClosed?: boolean; [key: string]: any}
): Feature<LineString | Polygon> | null {
  if (!object?.token) {
    return null;
  }

  const bounds = getGeohashBounds(object.token);
  if (!bounds) {
    return null;
  }

  const [minLat, minLon, maxLat, maxLon] = bounds;
  const vertices: [number, number][] = [
    [maxLon, maxLat],
    [maxLon, minLat],
    [minLon, minLat],
    [minLon, maxLat],
    [maxLon, maxLat]
  ];

  if (properties?.isClosed) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [vertices]
      },
      properties: properties ?? null
    };
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: vertices
    },
    properties: properties ?? null
  };
}
