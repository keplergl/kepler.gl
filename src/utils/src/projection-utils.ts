// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import geoViewport from '@mapbox/geo-viewport';

import {WebMercatorViewport} from '@math.gl/web-mercator';
import Console from 'global/console';

import type {Bounds, ViewportPadding} from '@kepler.gl/types';

export const MAPBOX_TILE_SIZE = 512;

function isLat(num) {
  return Number.isFinite(num) && num <= 90 && num >= -90;
}
function isLng(num) {
  return Number.isFinite(num) && num <= 180 && num >= -180;
}

/**
 * bounds should be [west, south, east, north]
 * @param {*} bounds
 */
export function validateBounds(bounds) {
  // array: [ -180, -85.05112877980659, 180, 85.0511287798066 ]
  // validate bounds
  if (
    Array.isArray(bounds) &&
    bounds.length === 4 &&
    [bounds[0], bounds[2]].every(isLng) &&
    [bounds[1], bounds[3]].every(isLat)
  ) {
    return bounds;
  }
  return null;
}

/**
 * A compact camera extent crossing the dateline, or null if the supplied extents
 * cannot fit within that hemisphere. Ordinary extents cover their entire
 * interval, not just their endpoints: a wide polygon must never be shortened.
 * West > east explicitly denotes a dateline crossing; geographic bounds stay
 * unchanged. Deliberately retain the existing view for spans of 180° or more.
 */
export function getWrappedCameraBounds(bounds: Iterable<Bounds>): Bounds | null {
  let west = 180;
  let east = -180;
  let south = 90;
  let north = -90;
  let hasWest = false;
  let hasEast = false;

  for (const bound of bounds) {
    if (!validateBounds(bound)) return null;
    const [w, s, e, n] = bound;
    if (w <= e) {
      // A continuous interval containing Greenwich cannot fit in a compact
      // dateline-centered view, even if its endpoints are close on the globe.
      if (w <= 0 && e >= 0) return null;
      if (w > 0) {
        west = Math.min(west, w);
        hasWest = true;
      } else {
        east = Math.max(east, e);
        hasEast = true;
      }
    } else {
      if (w <= 0 || e >= 0) return null;
      west = Math.min(west, w);
      east = Math.max(east, e);
      hasWest = hasEast = true;
    }
    south = Math.min(south, s);
    north = Math.max(north, n);
  }

  return hasWest && hasEast && east + 360 - west < 180 ? [west, south, east, north] : null;
}

function normalizeViewportPadding(padding?: ViewportPadding | null): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} | null {
  if (padding == null) {
    return null;
  }
  if (typeof padding === 'number') {
    return padding > 0 ? {top: padding, bottom: padding, left: padding, right: padding} : null;
  }
  const normalized = {
    top: padding.top || 0,
    bottom: padding.bottom || 0,
    left: padding.left || 0,
    right: padding.right || 0
  };
  return normalized.top || normalized.bottom || normalized.left || normalized.right
    ? normalized
    : null;
}

/** Fit an explicit west > east extent across the dateline; never shorten an ordinary extent. */
export function getCenterAndZoomFromBounds(
  bounds,
  {
    width,
    height,
    padding
  }: {
    width: number;
    height: number;
    padding?: ViewportPadding;
  }
) {
  const validBounds = validateBounds(bounds);
  if (!validBounds) {
    Console.warn('invalid map bounds provided');
    return null;
  }

  const normalizedPadding = normalizeViewportPadding(padding);
  const crossesDateline = validBounds[0] > validBounds[2];
  if (normalizedPadding || crossesDateline) {
    try {
      const viewport = new WebMercatorViewport({width, height, zoom: 0}).fitBounds(
        [
          [validBounds[0], validBounds[1]],
          [validBounds[2] + (crossesDateline ? 360 : 0), validBounds[3]]
        ],
        {padding: normalizedPadding || 0, ...(!normalizedPadding ? {maxZoom: 20} : {})}
      );
      let zoom = viewport.zoom;
      const longitude = crossesDateline
        ? ((((viewport.longitude + 180) % 360) + 360) % 360) - 180
        : viewport.longitude;
      const center = [longitude, viewport.latitude];

      // NOTE: this logic is used in deck.gl normalizeViewportProps
      // This is required in order to prevent projection matrix mismatch between basemap and layers
      const minZoom = Math.log2(height / MAPBOX_TILE_SIZE);
      if (zoom <= minZoom) {
        zoom = minZoom;
        center[1] = 0;
      }

      return {zoom, center};
    } catch (err) {
      Console.warn('failed to fit map bounds', err);
      // The legacy fallback cannot fit reversed longitude bounds.
      if (crossesDateline) return null;
    }
  }

  // viewport(bounds, dimensions, minzoom, maxzoom, tileSize, allowFloat)
  let {zoom} = geoViewport.viewport(
    bounds,
    [width, height],
    undefined,
    undefined,
    MAPBOX_TILE_SIZE,
    true
  );
  // center being calculated by geo-vieweport.viewport has a complex logic that
  // projects and then unprojects the coordinates to determine the center
  // Calculating a simple average instead as that is the expected behavior in most of cases
  const center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];

  // NOTE: this logic is used in deck.gl normalizeViewportProps
  // This is required in order to prevent projection matrix mismatch between basemap and layers
  const minZoom = Math.log2(height / MAPBOX_TILE_SIZE);
  if (zoom <= minZoom) {
    zoom = minZoom;
    center[1] = 0;
  }

  return {zoom, center};
}

/**
 * Add extra info about screen space position and world position to the event.
 * @param {*} event Event to normalize.
 * @param {*} viewport Current viewport.
 * @returns Normalized event with extra information compatible with React-map-gl MapLayerMouseEvent
 * https://visgl.github.io/react-map-gl/docs/api-reference/types#maplayermouseevent
 */
export function normalizeEvent(event: any, viewport: WebMercatorViewport) {
  const bounds = event.target?.getBoundingClientRect();
  if (!bounds) {
    return event;
  }

  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return event;
  }

  event.point = [x, y];
  const location = viewport.unproject(event.point, {targetZ: 0});
  event.lngLat = [location[0], location[1]];

  return event;
}
