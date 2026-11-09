// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cutPolygonByGrid, cutPolylineByGrid} from '@math.gl/polygon';
import {ContourFeature, ScalarGrid} from './contour-utils';

/** Drape the existing contours over one common, piecewise planar height field. */
export function buildContourSurface(grid: ScalarGrid | null, contours: ContourFeature[]) {
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
  const heights = Float64Array.from(grid.values, value =>
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
  const toGrid = ([longitude, lat]: number[]) => [
    (longitude - grid.longitude) / grid.stepLng,
    (lat - grid.latitude) / grid.stepLat
  ];
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
  let minimumVisibleHeight = Infinity;
  const toSurface = (x: number, y: number): number[] => {
    const height = heightAt(x, y);
    minimumVisibleHeight = Math.min(minimumVisibleHeight, height);
    return [grid.longitude + x * grid.stepLng, grid.latitude + y * grid.stepLat, height];
  };
  // Use the field gradient around every tessellated vertex, rather than a
  // triangle derivative. This keeps lighting smooth across contour cuts.
  const getNormal = ([longitude, latitude]: number[]): [number, number, number] => {
    const x = (longitude - grid.longitude) / grid.stepLng;
    const y = (latitude - grid.latitude) / grid.stepLat;
    const delta = 0.5;
    const metersPerLongitude = 111320 * Math.cos((latitude * Math.PI) / 180);
    const metersPerLatitude = 111320;
    const slopeLongitude =
      (heightAt(x + delta, y) - heightAt(x - delta, y)) /
      (2 * delta * grid.stepLng * metersPerLongitude);
    const slopeLatitude =
      (heightAt(x, y + delta) - heightAt(x, y - delta)) /
      (2 * delta * grid.stepLat * metersPerLatitude);
    const length = Math.hypot(slopeLongitude, slopeLatitude, 1);
    // SolidPolygonLayer expects lng/lat offset normals. The vertex shader
    // projects and normalizes this physical-space normal before interpolation.
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
  // The grid minimum can be outside the selected contours. Ground the visible
  // surface with one shared offset, preserving its relief, planes and normals.
  if (Number.isFinite(minimumVisibleHeight) && minimumVisibleHeight !== 0) {
    for (const feature of [...fills, ...outlines]) {
      for (const polygon of feature.geometry.coordinates) {
        for (const ring of polygon) {
          for (let i = 0; i < ring.length; i++) {
            const point = ring[i];
            // Closed fill rings share their first and last vertex. Replace each
            // entry so that the shared vertex is not shifted twice.
            ring[i] = [point[0], point[1], point[2] - minimumVisibleHeight];
          }
        }
      }
    }
  }
  return {fills, outlines, getNormal};
}
