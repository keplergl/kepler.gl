// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClusterBuilder, getClusterGeoJSON} from '@kepler.gl/deckgl-layers';
import {DonutComposition, getDonutBoundaries, getDonutComposition} from './donut-utils';

export type DonutPoint = DonutComposition & {
  index: number;
  position: [number, number];
  boundaries: number[];
  pointCount?: number;
  ignoredValueCount?: number;
};

export function prepareDonutAggregation(points: DonutPoint[]) {
  return {
    points,
    builder: new ClusterBuilder(),
    geoJSON: getClusterGeoJSON(points, point => point.position, null)
  };
}

/** Sum valid cells independently, so one invalid cell cannot erase a category's valid contributions. */
function sumGroup(points: DonutPoint[], position: number[], index: number): DonutPoint {
  let ignoredValueCount = points.reduce(
    (count, point) => count + (point.ignoredValueCount ?? 0),
    0
  );
  const values = points[0].values.map((_, fieldIndex) => {
    let sum = 0;
    for (const point of points) {
      const value = point.values[fieldIndex];
      if (value === null) {
        if (point.status === 'invalid') ignoredValueCount++;
        continue;
      }
      sum += value;
    }
    return sum;
  });
  const composition = getDonutComposition(values);
  const missingField = points.some(point => point.status === 'missing');
  if (missingField) {
    // Unavailable selected columns remain configuration errors, not omitted cells.
    composition.values = composition.values.map((value, i) =>
      points.some(point => point.values[i] === null) ? null : value
    );
    composition.status = 'missing';
    composition.total = null;
    composition.shares.fill(0);
  }
  return {
    ...composition,
    index,
    position: position as [number, number],
    boundaries: getDonutBoundaries(composition),
    pointCount: points.length,
    ignoredValueCount
  };
}

export function aggregateDonutPoints(
  source: ReturnType<typeof prepareDonutAggregation>,
  zoom: number,
  sizePixels: number
): DonutPoint[] {
  if (!source.points.length) return [];
  return source.builder
    .clustersAtZoom({
      // Query the whole dataset so panning cannot change membership or totals.
      bbox: [-180, -90, 180, 90],
      clusterRadius: sizePixels,
      geoJSON: source.geoJSON,
      zoom
    })
    .map(group => sumGroup(group.points, group.position, group.index));
}
