// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  cutPolygonByGrid,
  cutPolygonByMercatorBounds,
  earcut,
  modifyPolygonWindingDirection,
  WINDING
} from '@math.gl/polygon';
import {lngLatToWorld} from '@math.gl/web-mercator';
import {ContourFeature} from './contour-utils';

export type ContourMeshData = {
  length: number;
  startIndices: Uint32Array;
  attributes: {
    getPolygon: {value: Float64Array; size: 3};
    indices: {value: Uint32Array; size: 1};
  };
};

type Triangulation = {vertices: number[][]; indices: number[]};
type ContourMeshOptions = {resolution?: number; wrapLongitude?: boolean};

function ringLength(ring: number[][]): number {
  const first = ring[0];
  const last = ring[ring.length - 1];
  return ring.length > 1 && first.every((value, index) => value === last[index])
    ? ring.length - 1
    : ring.length;
}

function triangulate(polygon: number[][][]): Triangulation {
  if (polygon.length === 1 && ringLength(polygon[0]) === 3) {
    const vertices = polygon[0];
    const [a, b, c] = vertices.slice(0, 3).map(lngLatToWorld);
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return {vertices, indices: area > 0 ? [0, 1, 2] : area < 0 ? [2, 1, 0] : []};
  }
  const vertices: number[][] = [];
  const positions: number[] = [];
  const holes: number[] = [];
  polygon.forEach((ring, index) => {
    const length = ringLength(ring);
    if (index && length) holes.push(vertices.length);
    for (let i = 0; i < length; i++) {
      vertices.push(ring[i]);
      const [x, y] = lngLatToWorld(ring[i]);
      positions.push(x, y);
    }
  });
  return {vertices, indices: earcut(positions, holes, 2)};
}

/** Keep contour draw order while sharing vertices within each color/picking row. */
export function buildContourMesh(
  features: ContourFeature[],
  options: ContourMeshOptions = {}
): {
  fill: ContourMeshData;
  depth: ContourMeshData;
} {
  const triangulations = new WeakMap<number[][][], Triangulation>();
  const normalizedPoints = new Map<string, number[]>();
  const triangulateNormalized = (polygon: number[][][]): Triangulation => {
    const result: Triangulation = {vertices: [], indices: []};
    if (!polygon[0]?.length) return result;
    const positions: number[] = [];
    const holes: number[] = [];
    polygon.forEach((ring, index) => {
      if (!ring.length) return;
      const start = positions.length;
      if (index) holes.push(start);
      for (const point of ring) positions.push(point[0], point[1], point[2] || 0);
      if (ringLength(ring) === ring.length) positions.push(ring[0][0], ring[0][1], ring[0][2] || 0);
      modifyPolygonWindingDirection(
        positions,
        index ? WINDING.COUNTER_CLOCKWISE : WINDING.CLOCKWISE,
        {start, end: positions.length, size: 3, isClosed: true}
      );
    });
    const pieces = options.resolution
      ? cutPolygonByGrid(positions, holes, {size: 3, gridResolution: options.resolution})
      : cutPolygonByMercatorBounds(positions, holes, {size: 3, maxLatitude: 86});
    for (const piece of pieces) {
      const offset = result.vertices.length;
      const projected: number[] = [];
      for (let i = 0; i < piece.positions.length; i += 3) {
        const [x, y, z] = [piece.positions[i], piece.positions[i + 1], piece.positions[i + 2]];
        const key = `${x},${y},${z}`;
        let point = normalizedPoints.get(key);
        if (!point) {
          point = [x, y, z];
          normalizedPoints.set(key, point);
        }
        result.vertices.push(point);
        // GlobeViewport.projectFlat uses longitude/latitude directly.
        const xy = options.resolution ? point : lngLatToWorld(point);
        projected.push(xy[0], xy[1]);
      }
      const indices = earcut(
        projected,
        Array.from(piece.holeIndices || [], index => index / 3),
        2
      );
      for (const index of indices) result.indices.push(offset + index);
    }
    return result;
  };
  const getTriangles = (polygon: number[][][]) => {
    let result = triangulations.get(polygon);
    if (!result) {
      result =
        options.resolution || options.wrapLongitude
          ? triangulateNormalized(polygon)
          : triangulate(polygon);
      triangulations.set(polygon, result);
    }
    return result;
  };
  const startIndices = new Uint32Array(features.length + 1);
  let vertexCount = 0;
  let indexCount = 0;
  let depthIndexCount = 0;
  const unique = new Set<number[]>();
  features.forEach((feature, featureIndex) => {
    unique.clear();
    for (const polygon of feature.geometry.coordinates) {
      const {vertices, indices} = getTriangles(polygon);
      indexCount += indices.length;
      for (const index of indices) unique.add(vertices[index]);
    }
    vertexCount += unique.size;
    startIndices[featureIndex + 1] = vertexCount;
    if (featureIndex === 0) depthIndexCount = indexCount;
  });

  const positions = new Float64Array(vertexCount * 3);
  const indices = new Uint32Array(indexCount);
  const vertexIndices = new Map<number[], number>();
  let vertexOffset = 0;
  let indexOffset = 0;
  for (const feature of features) {
    vertexIndices.clear();
    for (const polygon of feature.geometry.coordinates) {
      const triangle = getTriangles(polygon);
      for (const localIndex of triangle.indices) {
        const point = triangle.vertices[localIndex];
        let index = vertexIndices.get(point);
        if (index === undefined) {
          index = vertexOffset++;
          vertexIndices.set(point, index);
          positions.set(point, index * 3);
        }
        indices[indexOffset++] = index;
      }
    }
  }
  const fill: ContourMeshData = {
    length: features.length,
    startIndices,
    attributes: {
      getPolygon: {value: positions, size: 3},
      indices: {value: indices, size: 1}
    }
  };
  const depth: ContourMeshData = {
    length: Math.min(1, features.length),
    startIndices: startIndices.subarray(0, Math.min(2, startIndices.length)),
    attributes: {
      getPolygon: {value: positions.subarray(0, (startIndices[1] ?? 0) * 3), size: 3},
      indices: {value: indices.subarray(0, depthIndexCount), size: 1}
    }
  };
  return {fill, depth};
}
