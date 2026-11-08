// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cutPolygonByGrid, cutPolylineByGrid} from '@math.gl/polygon';
import {ContourFeature, ScalarGrid} from './contour-utils';

/** Drape the existing contours over one common, piecewise planar height field. */
export function buildContourSurface(grid: ScalarGrid | null, contours: ContourFeature[]) {
  const empty = {fills: [] as ContourFeature[], outlines: [] as ContourFeature[]};
  if (!grid || !contours.length) return empty;
  let minimum = Infinity;
  let maximum = -Infinity;
  for (const value of grid.values) {
    if (Number.isFinite(value)) {
      minimum = Math.min(minimum, value);
      maximum = Math.max(maximum, value);
    }
  }
  if (!Number.isFinite(minimum)) return empty;
  const latitude = grid.latitude + ((grid.height - 1) * grid.stepLat) / 2;
  const span =
    Math.max(
      (grid.width - 1) * grid.stepLng * Math.cos((latitude * Math.PI) / 180),
      (grid.height - 1) * grid.stepLat
    ) * 111320;
  const scale = maximum > minimum ? (span * 0.1) / (maximum - minimum) : 0;
  const heights = Float64Array.from(grid.values, value =>
    Number.isFinite(value) ? (value - minimum) * scale : NaN
  );
  // Only geometry already present in the 2D contours is draped. Supply finite
  // heights beside no-data boundaries without filling their holes.
  for (let index = 0; index < heights.length; index++) {
    if (Number.isFinite(heights[index])) continue;
    const col = index % grid.width;
    const row = Math.floor(index / grid.width);
    let sum = 0;
    let count = 0;
    for (let y = Math.max(0, row - 1); y <= Math.min(grid.height - 1, row + 1); y++) {
      for (let x = Math.max(0, col - 1); x <= Math.min(grid.width - 1, col + 1); x++) {
        const value = grid.values[y * grid.width + x];
        if (Number.isFinite(value)) {
          sum += (value - minimum) * scale;
          count++;
        }
      }
    }
    heights[index] = count ? sum / count : 0;
  }
  const toGrid = ([longitude, lat]: number[]) => [
    (longitude - grid.longitude) / grid.stepLng,
    (lat - grid.latitude) / grid.stepLat
  ];
  const toSurface = (x: number, y: number): number[] => {
    const clampedX = Math.max(0, Math.min(grid.width - 1, x));
    const clampedY = Math.max(0, Math.min(grid.height - 1, y));
    const col = Math.min(grid.width - 2, Math.floor(clampedX));
    const row = Math.min(grid.height - 2, Math.floor(clampedY));
    const fx = clampedX - col;
    const fy = clampedY - row;
    const a = heights[row * grid.width + col];
    const b = heights[row * grid.width + col + 1];
    const c = heights[(row + 1) * grid.width + col];
    const d = heights[(row + 1) * grid.width + col + 1];
    // The diagonal alternates with cell parity, matching the rotated grid cuts
    // below. Every overlapping fill and outline uses these same triangle planes.
    const height =
      (col + row) % 2 === 0
        ? fx >= fy
          ? a + (b - a) * fx + (d - b) * fy
          : a + (d - c) * fx + (c - a) * fy
        : fx + fy <= 1
        ? a + (b - a) * fx + (c - a) * fy
        : d + (c - d) * (1 - fx) + (b - d) * (1 - fy);
    return [grid.longitude + x * grid.stepLng, grid.latitude + y * grid.stepLat, height];
  };
  const fromDiagonal = (positions: Readonly<ArrayLike<number>>) => {
    const result: number[][] = [];
    for (let i = 0; i < positions.length; i += 2) {
      result.push(
        toSurface((positions[i] + positions[i + 1]) / 2, (positions[i + 1] - positions[i]) / 2)
      );
    }
    return result;
  };
  const toDiagonal = (positions: Readonly<ArrayLike<number>>) => {
    const result: number[] = [];
    for (let i = 0; i < positions.length; i += 2) {
      result.push(positions[i] - positions[i + 1], positions[i] + positions[i + 1]);
    }
    return result;
  };
  const fills = contours.map(feature => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.flatMap(polygon => {
        const positions: number[] = [];
        const holes: number[] = [];
        polygon.forEach((ring, index) => {
          if (index) holes.push(positions.length);
          for (const point of ring) positions.push(...toGrid(point));
        });
        // Cutting adds interior vertices: raising only the original contour
        // vertices would produce flat terraces and miss peaks inside each ring.
        return cutPolygonByGrid(positions, holes, {gridResolution: 1}).flatMap(cell =>
          cutPolygonByGrid(toDiagonal(cell.positions), cell.holeIndices, {
            gridResolution: 2
          }).map(triangle => {
            const vertices = fromDiagonal(triangle.positions);
            const starts = [
              0,
              ...Array.from(triangle.holeIndices || [], i => i / 2),
              vertices.length
            ];
            return starts.slice(0, -1).map((start, index) => {
              const ring = vertices.slice(start, starts[index + 1]);
              if (ring.length) ring.push(ring[0]);
              return ring;
            });
          })
        );
      })
    }
  }));
  const outlines = contours.map(feature => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map(polygon =>
        polygon.map(ring => {
          const positions = cutPolylineByGrid(ring.flatMap(toGrid), {
            gridResolution: 1
          }) as number[];
          return fromDiagonal(
            cutPolylineByGrid(toDiagonal(positions), {
              gridResolution: 2
            }) as number[]
          );
        })
      )
    }
  }));
  return {fills, outlines};
}
