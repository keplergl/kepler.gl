// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Delaunay} from 'd3-delaunay';
import {lngLatToWorld, worldToLngLat, MAX_LATITUDE} from '@math.gl/web-mercator';

export type VoronoiSite = {index: number; position: [number, number]};
export type VoronoiCell = VoronoiSite & {polygon: [number, number][]};
export type VoronoiMosaic = {
  cells: VoronoiCell[];
  bounds: [number, number, number, number] | null;
};

// A single site still needs a finite display extent: a 1 km square at the equator.
const MIN_EXTENT = (512 * 1000) / 40075016.68557849;

/** Planar nearest-site cells in Web Mercator, independent of the map viewport. */
export function buildVoronoiMosaic(sites: VoronoiSite[], paddingPercent: number): VoronoiMosaic {
  const unique: VoronoiSite[] = [];
  const seen = new Set<string>();
  for (const site of sites) {
    const [lng, lat] = site.position;
    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      Math.abs(lng) > 180 ||
      Math.abs(lat) > MAX_LATITUDE
    ) {
      continue;
    }
    const longitude = lng === 180 ? -180 : lng;
    const key = `${longitude},${lat}`;
    // Coincident sites have no distinct nearest-site region. Keep the first row.
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({index: site.index, position: [longitude, lat]});
  }
  if (!unique.length) return {cells: [], bounds: null};

  // Unwrap across the largest empty longitude gap so dateline neighbors stay neighbors.
  const longitudes = unique.map(site => site.position[0]).sort((a, b) => a - b);
  let west = longitudes[0];
  let largestGap = longitudes[0] + 360 - longitudes[longitudes.length - 1];
  for (let i = 1; i < longitudes.length; i++) {
    const gap = longitudes[i] - longitudes[i - 1];
    if (gap > largestGap) {
      largestGap = gap;
      west = longitudes[i];
    }
  }
  const coordinates = unique.map(({position: [lng, lat]}) =>
    lngLatToWorld([lng < west ? lng + 360 : lng, lat])
  );
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of coordinates) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const span = Math.max(maxX - minX, maxY - minY, MIN_EXTENT);
  // Give collinear/single-site data a nonzero extent even with no padding.
  if (maxX === minX) {
    minX -= span / 2;
    maxX += span / 2;
  }
  if (maxY === minY) {
    minY -= span / 2;
    maxY += span / 2;
  }
  const padding = Number.isFinite(paddingPercent)
    ? Math.max(0, Math.min(100, paddingPercent)) / 100
    : 0.1;
  const padX = (maxX - minX) * padding;
  const padY = (maxY - minY) * padding;
  const extent: [number, number, number, number] = [
    minX - padX,
    Math.max(0, minY - padY),
    maxX + padX,
    Math.min(512, maxY + padY)
  ];
  const voronoi = Delaunay.from(coordinates).voronoi(extent);
  const cells: VoronoiCell[] = [];
  unique.forEach((site, index) => {
    const polygon = voronoi.cellPolygon(index);
    if (polygon) {
      cells.push({
        ...site,
        polygon: polygon.map(point => worldToLngLat(point) as [number, number])
      });
    }
  });
  const [westLng, south] = worldToLngLat([extent[0], extent[1]]);
  const [east, north] = worldToLngLat([extent[2], extent[3]]);
  return {cells, bounds: [westLng, south, east, north]};
}
