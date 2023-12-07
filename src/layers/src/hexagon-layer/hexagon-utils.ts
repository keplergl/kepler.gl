// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {WebMercatorViewport} from '@deck.gl/core';
import Console from 'global/console';
import {Centroid} from '@kepler.gl/utils';

export function hexagonToPolygonGeo(object, properties, radius, mapState) {
  const viewport = new WebMercatorViewport(mapState);
  if (!Array.isArray(object.position)) {
    return null;
  }

  const screenCenter = viewport.projectFlat(object.position);
  const {unitsPerMeter} = viewport.getDistanceScales(object.position);

  if (!Array.isArray(unitsPerMeter)) {
    Console.warn(`unitsPerMeter is undefined`);
    return null;
  }

  const pixRadius = radius * unitsPerMeter[0];

  const coordinates: any[] = [];

  for (let i = 0; i < 6; i++) {
    const vertex = hex_corner(screenCenter, pixRadius, i);
    coordinates.push(viewport.unprojectFlat(vertex));
  }

  coordinates.push(coordinates[0]);

  return {
    geometry: {
      coordinates,
      type: 'LineString'
    },
    properties
  };
}

function hex_corner(center: Centroid, radius: number, i: number) {
  const angle_deg = 60 * i + 30;
  const angle_rad = (Math.PI / 180) * angle_deg;

  return [center[0] + radius * Math.cos(angle_rad), center[1] + radius * Math.sin(angle_rad)];
}
