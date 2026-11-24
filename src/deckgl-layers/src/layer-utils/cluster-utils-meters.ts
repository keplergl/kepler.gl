// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Supercluster from 'supercluster';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import type {Feature, Point} from 'geojson';

const EARTH_RADIUS_METERS = 6371008.8;
const RADIANS = Math.PI / 180;
type Vector = [number, number, number];

/**
 * Greedy, spherical-distance grouping in source order. Every member is within
 * radius of its group's first point; groups do not expand through neighbors.
 * The sphere's chord length gives an exact great-circle threshold without a
 * viewport projection. A 3D grid limits searches to 27 neighboring buckets.
 */
export function getMeterClusterer(geoJSON, radius: number): Supercluster {
  const meters =
    Number.isFinite(radius) && radius >= 0
      ? radius
      : LAYER_VIS_CONFIGS.clusterRadiusMeters.defaultValue;
  const chord = 2 * Math.sin(Math.min(Math.PI, meters / EARTH_RADIUS_METERS) / 2);
  // Keep bucket coordinates safely below the integer precision limit at zero
  // or very small radii. The exact distance test still uses the requested radius.
  const cellSize = Math.max(chord, 1e-12);
  const buckets = new Map<string, Set<number>>();
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const sources: {data: any; position: [number, number]; vector: Vector; cell: Vector}[] = [];

  for (const feature of geoJSON) {
    const [longitude, latitude] = feature.geometry.coordinates;
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      continue;
    }
    const lng = ((((longitude + 180) % 360) + 360) % 360) - 180;
    const lat = latitude * RADIANS;
    const cosLat = Math.abs(latitude) === 90 ? 0 : Math.cos(lat);
    const vector: Vector = [
      cosLat * Math.cos(lng * RADIANS),
      cosLat * Math.sin(lng * RADIANS),
      Math.sin(lat)
    ];
    const cell = vector.map(value => Math.floor(value / cellSize)) as Vector;
    const cellKey = key(...cell);
    let bucket = buckets.get(cellKey);
    if (!bucket) {
      bucket = new Set();
      buckets.set(cellKey, bucket);
    }
    bucket.add(sources.length);
    sources.push({data: feature.properties.data, position: [lng, latitude], vector, cell});
  }

  const assigned = new Uint8Array(sources.length);
  const clusters: Feature<Point, {points: any[]}>[] = [];
  for (let seed = 0; seed < sources.length; seed++) {
    if (assigned[seed]) continue;
    const origin = sources[seed];
    const members: number[] = [];
    const sum: Vector = [0, 0, 0];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const bucket = buckets.get(
            key(origin.cell[0] + dx, origin.cell[1] + dy, origin.cell[2] + dz)
          );
          if (!bucket) continue;
          for (const index of bucket) {
            const vector = sources[index].vector;
            const distanceSquared = vector.reduce(
              (sum, value, axis) => sum + (value - origin.vector[axis]) ** 2,
              0
            );
            if (Math.min(4, distanceSquared) > chord * chord) continue;
            assigned[index] = 1;
            bucket.delete(index);
            members.push(index);
            for (let axis = 0; axis < 3; axis++) sum[axis] += vector[axis];
          }
        }
      }
    }
    // Preserve source-row ordering for aggregation and picking. Spherical means
    // avoid moving dateline clusters to Greenwich; antipodal means use the seed.
    members.sort((a, b) => a - b);
    const length = Math.hypot(...sum);
    const position =
      members.length === 1 || length < 1e-12
        ? origin.position
        : [
            Math.atan2(sum[1], sum[0]) / RADIANS,
            Math.atan2(sum[2], Math.hypot(sum[0], sum[1])) / RADIANS
          ];
    clusters.push({
      type: 'Feature',
      geometry: {type: 'Point', coordinates: position},
      properties: {points: members.map(index => sources[index].data)}
    });
  }

  // Reuse Supercluster only as a viewport index. Query zoom 1 (above maxZoom)
  // always returns these precomputed groups, without another clustering pass.
  return new Supercluster({maxZoom: 0, radius: 0}).load(clusters);
}
