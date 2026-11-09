// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cutPolygonByGrid, cutPolylineByGrid} from '@math.gl/polygon';
import {lngLatToWorld, worldToLngLat, unitsPerMeter} from '@math.gl/web-mercator';
import {ContourFeature, ScalarGrid} from './contour-utils';

/** Drape the existing contours over one common, piecewise planar height field. */
export function buildContourSurface(
  grid: ScalarGrid | null,
  contours: ContourFeature[],
  projectToMercator = false
) {
  const flatNormal = (): [number, number, number] => [0, 0, 1];
  const empty = {
    fills: [] as ContourFeature[],
    outlines: [] as ContourFeature[],
    getNormal: flatNormal
  };
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
  const range = maximum - minimum;
  const toHeight = (value: number) => {
    if (range === 0) return 0;
    // Normalize before applying relief so tiny units cannot overflow a scale.
    // Halve opposite-sign extremes before subtracting if their range overflows.
    const fraction = Number.isFinite(range)
      ? (value - minimum) / range
      : (value / 2 - minimum / 2) / (maximum / 2 - minimum / 2);
    return fraction * (span * 0.1);
  };
  let heights = Float64Array.from(grid.values, value =>
    Number.isFinite(value) ? toHeight(value) : NaN
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
          sum += toHeight(value);
          count++;
        }
      }
    }
    heights[index] = count ? sum / count : 0;
  }
  const origin = projectToMercator
    ? lngLatToWorld([grid.longitude, grid.latitude])
    : [grid.longitude, grid.latitude];
  const end = projectToMercator
    ? lngLatToWorld([
        grid.longitude + (grid.width - 1) * grid.stepLng,
        grid.latitude + (grid.height - 1) * grid.stepLat
      ])
    : [
        grid.longitude + (grid.width - 1) * grid.stepLng,
        grid.latitude + (grid.height - 1) * grid.stepLat
      ];
  const stepX = (end[0] - origin[0]) / (grid.width - 1);
  const stepY = (end[1] - origin[1]) / (grid.height - 1);
  if (projectToMercator) {
    // Resample the same field onto a regular Mercator grid before cutting it.
    // Projecting already-cut lng/lat polygons warps their planes differently,
    // so the depth pass can clip triangular patches out of overlapping fills.
    const sourceHeights = heights;
    heights = Float64Array.from(sourceHeights, (_, index) => {
      const col = index % grid.width;
      const row = Math.floor(index / grid.width);
      const lat = worldToLngLat([origin[0], origin[1] + row * stepY])[1];
      const sourceY = Math.max(0, Math.min(grid.height - 1, (lat - grid.latitude) / grid.stepLat));
      const lowerRow = Math.min(grid.height - 2, Math.floor(sourceY));
      const fraction = sourceY - lowerRow;
      const lower = sourceHeights[lowerRow * grid.width + col];
      const upper = sourceHeights[(lowerRow + 1) * grid.width + col];
      return (lower + (upper - lower) * fraction) * unitsPerMeter(lat);
    });
  }
  const toGrid = (position: number[]) => {
    const [x, y] = projectToMercator ? lngLatToWorld(position) : position;
    return [(x - origin[0]) / stepX, (y - origin[1]) / stepY];
  };
  const heightAt = (x: number, y: number): number => {
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
    return (col + row) % 2 === 0
      ? fx >= fy
        ? a + (b - a) * fx + (d - b) * fy
        : a + (d - c) * fx + (c - a) * fy
      : fx + fy <= 1
      ? a + (b - a) * fx + (c - a) * fy
      : d + (c - d) * (1 - fx) + (b - d) * (1 - fy);
  };
  const toSurface = (x: number, y: number): number[] => {
    const height = heightAt(x, y);
    return [origin[0] + x * stepX, origin[1] + y * stepY, height];
  };
  // Use the field gradient around every tessellated vertex, rather than a
  // triangle derivative. This keeps lighting smooth across contour cuts.
  const getNormal = ([longitude, latitude]: number[]): [number, number, number] => {
    const x = (longitude - origin[0]) / stepX;
    const y = (latitude - origin[1]) / stepY;
    const delta = 0.5;
    const metersPerLongitude = projectToMercator
      ? 1
      : 111320 * Math.cos((latitude * Math.PI) / 180);
    const metersPerLatitude = projectToMercator ? 1 : 111320;
    const slopeLongitude =
      (heightAt(x + delta, y) - heightAt(x - delta, y)) / (2 * delta * stepX * metersPerLongitude);
    const slopeLatitude =
      (heightAt(x, y + delta) - heightAt(x, y - delta)) / (2 * delta * stepY * metersPerLatitude);
    const length = Math.hypot(slopeLongitude, slopeLatitude, 1);
    // Mercator normals are already in common space. The geographic fallback
    // uses lng/lat offset normals for SolidPolygonLayer's projection helper.
    return [
      -slopeLongitude / (metersPerLongitude * length),
      -slopeLatitude / (metersPerLatitude * length),
      1 / length
    ];
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
  return {fills, outlines, getNormal};
}
