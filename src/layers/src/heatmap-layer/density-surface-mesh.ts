// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {WebMercatorViewport} from '@deck.gl/core';

type Bounds = [number, number, number, number];

/** A bounded, uniformly sampled density texture grid. Heights stay on the GPU. */
export function createHeatmapSurfaceMesh(
  worldBounds: Bounds,
  commonBounds: Bounds,
  viewport: WebMercatorViewport,
  longitude?: number
) {
  if (
    !worldBounds?.every(Number.isFinite) ||
    !commonBounds?.every(Number.isFinite) ||
    worldBounds.length !== 4 ||
    commonBounds.length !== 4
  ) {
    return null;
  }
  const [west, south, east, north] = worldBounds;
  const [xMin, yMin, xMax, yMax] = commonBounds;
  // Keep unwrapped longitudes: a viewport panned past the antimeridian can
  // legitimately produce a density texture entirely outside [-180, 180].
  const center = (west + east) / 2;
  const w = Math.max(west, center - 180);
  const e = Math.min(east, center + 180);
  const s = Math.max(-85.051129, south);
  const n = Math.min(85.051129, north);
  if (e <= w || n <= s || xMax <= xMin || yMax <= yMin) {
    return null;
  }

  // Sampling in Mercator space keeps vertex spacing aligned with the texture,
  // including high latitudes. A fixed grid bounds memory at every map scale.
  const lower = viewport.projectPosition([w, s, 0]);
  const upper = viewport.projectPosition([e, n, 0]);
  const segments = 256;
  const side = segments + 1;
  const positions = new Float64Array(side * side * 3);
  const texCoords = new Float32Array(side * side * 2);
  const indices = new Uint32Array(segments * segments * 6);
  const shift =
    typeof longitude === 'number' && Number.isFinite(longitude)
      ? Math.round((longitude - (w + e) / 2) / 360) * 360
      : 0;
  let vertex = 0;
  let index = 0;
  for (let v = 0; v <= segments; v++) {
    const y = lower[1] + (upper[1] - lower[1]) * (v / segments);
    for (let u = 0; u <= segments; u++, vertex++) {
      const x = lower[0] + (upper[0] - lower[0]) * (u / segments);
      const [lng, lat] = viewport.unprojectPosition([x, y, 0]);
      positions.set([lng + shift, lat, 0], vertex * 3);
      texCoords.set([(x - xMin) / (xMax - xMin), (y - yMin) / (yMax - yMin)], vertex * 2);
      if (u < segments && v < segments) {
        indices.set(
          [vertex, vertex + 1, vertex + side, vertex + 1, vertex + side + 1, vertex + side],
          index
        );
        index += 6;
      }
    }
  }
  return {positions, texCoords, indices, vertexCount: indices.length};
}
