// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {WebMercatorViewport} from '@deck.gl/core';
import Console from 'global/console';

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

  const coordinates = [];

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

function hex_corner(center, radius, i) {
  const angle_deg = 60 * i + 30;
  const angle_rad = (Math.PI / 180) * angle_deg;

  return [center[0] + radius * Math.cos(angle_rad), center[1] + radius * Math.sin(angle_rad)];
}
