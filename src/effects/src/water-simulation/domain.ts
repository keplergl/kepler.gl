// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Viewport, WebMercatorViewport, Layer} from '@deck.gl/core';
import {Matrix4} from '@math.gl/core';

export const RESOLUTION = 256;
export const MIN_HEIGHT = -12000;
export const MAX_HEIGHT = 20000;

/** Fixed, north-up Mercator grid. Texture rows increase toward north. */
export function createWaterDomain(viewport: Viewport, requestedResolution = RESOLUTION) {
  const resolution = Number.isFinite(requestedResolution)
    ? Math.max(64, Math.min(1024, Math.round(requestedResolution)))
    : RESOLUTION;
  if (!(viewport instanceof WebMercatorViewport)) {
    throw new Error('Water simulation requires a flat map.');
  }
  const corners = [
    [0, 0],
    [viewport.width, 0],
    [0, viewport.height],
    [viewport.width, viewport.height]
  ].map(pixel => viewport.projectPosition(viewport.unproject(pixel, {targetZ: 0})));
  if (corners.some(p => p.some(n => !Number.isFinite(n)))) {
    throw new Error('Tilt the map down so the capture area is below the horizon.');
  }
  const minX = Math.min(...corners.map(p => p[0]));
  const maxX = Math.max(...corners.map(p => p[0]));
  const minY = Math.min(...corners.map(p => p[1]));
  const maxY = Math.max(...corners.map(p => p[1]));
  const center = [(minX + maxX) / 2, (minY + maxY) / 2, 0];
  const [longitude, latitude] = viewport.unprojectPosition(center);
  const units = new WebMercatorViewport({longitude, latitude}).distanceScales.unitsPerMeter[2];
  const span = Math.max(maxX - minX, maxY - minY) * 1.05;
  const widthMeters = span / units;
  if (!Number.isFinite(widthMeters) || widthMeters < 1 || widthMeters > 100000) {
    throw new Error('Choose a local area between 1 m and 100 km across.');
  }
  const captureViewport = new Viewport({
    id: `${viewport.id}-water-capture`,
    width: resolution,
    height: resolution,
    longitude,
    latitude,
    zoom: Math.log2(resolution / span),
    viewMatrix: new Matrix4().lookAt({eye: [0, 0, MAX_HEIGHT * units]}),
    projectionMatrix: new Matrix4().ortho({
      left: -span / 2,
      right: span / 2,
      bottom: -span / 2,
      top: span / 2,
      near: 0,
      far: (MAX_HEIGHT - MIN_HEIGHT) * units
    })
  });
  // Geospatial shader uniforms read these fields, while the base Viewport only
  // uses the constructor options to derive its matrices and distance scales.
  Object.assign(captureViewport, {longitude, latitude});
  return {
    viewport: captureViewport,
    center,
    span,
    units,
    resolution,
    cellSize: widthMeters / resolution
  };
}

export type WaterDomain = ReturnType<typeof createWaterDomain>;

/** Mark exterior-facing terrain in G, preserving heights (R) and coverage (A).
 * Flood only missing cells connected to the texture border: enclosed holes stay
 * walls. Returns the number of captured surface cells for the coverage status.
 */
export function markWaterBoundary(heights: Float32Array, resolution: number): number {
  const count = resolution * resolution;
  const exterior = new Uint8Array(count);
  const queue = new Int32Array(count);
  let start = 0;
  let end = 0;
  let valid = 0;
  for (let i = 0; i < count; i++) {
    heights[i * 4 + 1] = 0;
    if (heights[i * 4 + 3] >= 0.5) valid++;
  }
  const visit = (i: number) => {
    if (heights[i * 4 + 3] >= 0.5) {
      heights[i * 4 + 1] = 1;
    } else if (!exterior[i]) {
      exterior[i] = 1;
      queue[end++] = i;
    }
  };
  for (let i = 0; i < resolution; i++) {
    visit(i);
    visit(count - resolution + i);
    visit(i * resolution);
    visit((i + 1) * resolution - 1);
  }
  while (start < end) {
    const i = queue[start++];
    const x = i % resolution;
    if (x > 0) visit(i - 1);
    if (x < resolution - 1) visit(i + 1);
    if (i >= resolution) visit(i - resolution);
    if (i < count - resolution) visit(i + resolution);
  }
  return valid;
}

/** Exclude labels, screen-sized markers, paths, and the water itself. */
export function isWaterSurface(layer: Layer): boolean {
  // Kepler's raster and Arrow layers subclass these with their own layer names.
  let constructor = layer.constructor as typeof Layer;
  while (constructor && constructor !== Layer) {
    if (
      ['SolidPolygonLayer', 'ColumnLayer', 'SimpleMeshLayer', 'ScenegraphLayer'].includes(
        constructor.layerName
      )
    )
      return true;
    constructor = Object.getPrototypeOf(constructor);
  }
  return false;
}
