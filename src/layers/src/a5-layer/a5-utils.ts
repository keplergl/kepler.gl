// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cellToBoundary, cellToLonLat, getResolution, hexToU64, u64ToHex} from 'a5-js';
import type {Feature, LineString, Polygon} from 'geojson';

const HEX_RE = /^[0-9a-fA-F]+$/;
const MAX_A5_RESOLUTION = 30;

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
 * Convert an A5 cell id (hex string or bigint) to a bigint cell index.
 */
export function toA5Cell(token: string | bigint | number): bigint | null {
  if (typeof token === 'bigint') {
    return token;
  }

  if (typeof token === 'number') {
    if (!Number.isSafeInteger(token) || token < 0) {
      return null;
    }
    try {
      return BigInt(token);
    } catch {
      return null;
    }
  }

  if (typeof token !== 'string') {
    return null;
  }

  const cleaned = maybeStripQuotes(token).trim();
  if (!cleaned || !HEX_RE.test(cleaned)) {
    return null;
  }

  try {
    return hexToU64(cleaned);
  } catch {
    return null;
  }
}

/**
 * Validate an A5 cell token (hex string or bigint).
 */
export function validA5Token(token: unknown): boolean {
  if (typeof token !== 'string' && typeof token !== 'bigint' && typeof token !== 'number') {
    return false;
  }

  const cell = toA5Cell(token as string | bigint | number);
  if (cell === null) {
    return false;
  }

  try {
    const resolution = getResolution(cell);
    return resolution >= 0 && resolution <= MAX_A5_RESOLUTION;
  } catch {
    return false;
  }
}

/**
 * Normalize an A5 token to a lowercase hex string for deck.gl A5Layer.
 */
export function normalizeA5Token(token: unknown): string | null {
  if (typeof token !== 'string' && typeof token !== 'bigint' && typeof token !== 'number') {
    return null;
  }
  const cell = toA5Cell(token);
  if (cell === null || !validA5Token(cell)) {
    return null;
  }
  return u64ToHex(cell);
}

/**
 * Retrieve A5 cell center as [lng, lat].
 */
export function getA5Center(token: string | bigint | number): [number, number] | null {
  const cell = toA5Cell(token);
  if (cell === null) {
    return null;
  }

  try {
    if (!validA5Token(cell)) {
      return null;
    }
    const [lng, lat] = cellToLonLat(cell);
    return [lng, lat];
  } catch {
    return null;
  }
}

/**
 * Convert an A5 cell token to a GeoJSON Feature for hover outline rendering.
 */
export function a5TokenToPolygonGeo(
  object?: {token?: string},
  properties?: {isClosed?: boolean; [key: string]: any}
): Feature<LineString | Polygon> | null {
  if (!object?.token) {
    return null;
  }

  const cell = toA5Cell(object.token);
  if (cell === null || !validA5Token(cell)) {
    return null;
  }

  try {
    const vertices = cellToBoundary(cell, {closedRing: true, segments: 'auto'}) as [
      number,
      number
    ][];

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
  } catch {
    return null;
  }
}
