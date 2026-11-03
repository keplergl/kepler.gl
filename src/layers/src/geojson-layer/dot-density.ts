// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import earcut from 'earcut';
import type {Feature, Geometry, Position} from 'geojson';

export const MAX_DENSITY_DOTS = 250000;
export type DensitySource = {index: number; feature: Feature; quantity: number};
export type DensityDot = {index: number; feature: Feature; position: [number, number]};
type Triangle = {vertices: Position[]; cumulativeArea: number};

function polygonParts(geometry: Geometry | null): Position[][][] {
  if (!geometry) return [];
  switch (geometry.type) {
    case 'Polygon':
      return [geometry.coordinates];
    case 'MultiPolygon':
      return Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
    case 'GeometryCollection':
      return Array.isArray(geometry.geometries) ? geometry.geometries.flatMap(polygonParts) : [];
    default:
      return [];
  }
}

function triangulate(geometry: Geometry | null): Triangle[] {
  const triangles: Triangle[] = [];
  let cumulativeArea = 0;
  for (const rings of polygonParts(geometry)) {
    if (
      !Array.isArray(rings) ||
      !rings.length ||
      !rings.every(
        ring =>
          Array.isArray(ring) &&
          ring.length >= 3 &&
          ring.every(
            p =>
              Array.isArray(p) &&
              Number.isFinite(p[0]) &&
              Number.isFinite(p[1]) &&
              Math.abs(p[0]) <= 180 &&
              Math.abs(p[1]) <= 90
          )
      )
    )
      continue;
    const anchor = rings[0][0][0];
    // Keep dateline-crossing rings and their holes in the same longitude interval.
    const unwrapped = rings.map(ring =>
      ring.map(([lng, lat]) => [anchor + ((lng - anchor + 540) % 360) - 180, lat])
    );
    const {vertices, holes, dimensions} = earcut.flatten(unwrapped);
    const indices = earcut(vertices, holes, dimensions);
    if (earcut.deviation(vertices, holes, dimensions, indices) > 1e-6) continue;
    for (let i = 0; i < indices.length; i += 3) {
      const points = indices.slice(i, i + 3).map(index => vertices.slice(index * 2, index * 2 + 2));
      const [a, b, c] = points;
      const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / 2;
      if (!Number.isFinite(area) || area <= 0) continue;
      cumulativeArea += area;
      triangles.push({vertices: points, cumulativeArea});
    }
  }
  return triangles;
}

function randomForRow(index: number) {
  let seed = (Math.imul(index + 1, 2654435761) ^ 0x9e3779b9) >>> 0;
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let n = Math.imul(seed ^ (seed >>> 15), seed | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return (((n ^ (n >>> 14)) >>> 0) + 0.5) / 4294967296;
  };
}

/** Deterministic, area-weighted placement in polygon longitude/latitude coordinates. */
export function buildDotDensity(
  sources: DensitySource[],
  requestedValue: number,
  limit = MAX_DENSITY_DOTS
) {
  limit =
    Number.isFinite(limit) && limit >= 1
      ? Math.min(MAX_DENSITY_DOTS, Math.floor(limit))
      : MAX_DENSITY_DOTS;
  const value = Number.isFinite(requestedValue) && requestedValue > 0 ? requestedValue : 100;
  const prepared = sources
    .filter(source => Number.isFinite(source.quantity) && source.quantity > 0)
    .map(source => ({...source, triangles: triangulate(source.feature.geometry)}))
    .filter(source => source.triangles.length > 0);
  const largest = prepared.reduce((max, source) => Math.max(max, source.quantity), 0);
  const scaledTotal = prepared.reduce((sum, source) => sum + source.quantity / largest, 0);
  // Never truncate a subset of polygons: use one effective value across the full dataset.
  const effectiveValue = Math.max(value, (largest / limit) * scaledTotal);
  const dots: DensityDot[] = [];
  let cumulativeCount = 0;
  let previousCount = 0;
  for (const source of prepared) {
    cumulativeCount += source.quantity / effectiveValue;
    const roundedCount = Math.min(limit, Math.round(cumulativeCount));
    const count = roundedCount - previousCount;
    previousCount = roundedCount;
    const random = randomForRow(source.index);
    const {triangles} = source;
    const area = triangles[triangles.length - 1].cumulativeArea;
    for (let i = 0; i < count; i++) {
      const target = random() * area;
      let low = 0;
      let high = triangles.length - 1;
      while (low < high) {
        const mid = (low + high) >>> 1;
        if (triangles[mid].cumulativeArea < target) low = mid + 1;
        else high = mid;
      }
      const [a, b, c] = triangles[low].vertices;
      const u = Math.sqrt(random());
      const v = random();
      const lng = a[0] * (1 - u) + b[0] * u * (1 - v) + c[0] * u * v;
      const lat = a[1] * (1 - u) + b[1] * u * (1 - v) + c[1] * u * v;
      dots.push({
        index: source.index,
        feature: source.feature,
        position: [((lng + 540) % 360) - 180, lat]
      });
    }
  }
  return {dots, effectiveValue, requestedValue: value};
}
