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

import Protobuf from 'pbf';
import {VectorTile} from '@mapbox/vector-tile';
import {worldToLngLat} from 'viewport-mercator-project';

/* global fetch */
const TILE_SIZE = 512;
const MAPBOX_HOST = 'https://a.tiles.mapbox.com';
const MAP_SOURCE = '/v4/mapbox.mapbox-streets-v7';

export function getTileData(host, token, {x, y, z}) {
  const mapSource = `${host ||
    MAPBOX_HOST}${MAP_SOURCE}/${z}/${x}/${y}.vector.pbf?access_token=${token}`;

  return fetch(mapSource)
    .then(response => response.arrayBuffer())
    .then(buffer => decodeTile(x, y, z, buffer));
}

export function decodeTile(x, y, z, arrayBuffer) {
  const tile = new VectorTile(new Protobuf(arrayBuffer));

  const result = [];
  const xProj = x * TILE_SIZE;
  const yProj = y * TILE_SIZE;
  const scale = Math.pow(2, z);

  const projectFunc = project.bind(null, xProj, yProj, scale);

  /* eslint-disable guard-for-in */
  const layerName = 'building';
  const vectorTileLayer = tile.layers[layerName];
  if (!vectorTileLayer) {
    return [];
  }
  for (let i = 0; i < vectorTileLayer.length; i++) {
    const vectorTileFeature = vectorTileLayer.feature(i);
    const features = vectorTileFeatureToProp(vectorTileFeature, projectFunc);
    features.forEach(f => {
      f.properties.layer = layerName;
      if (f.properties.height) {
        result.push(f);
      }
    });
  }
  return result;
}

function project(x, y, scale, line, extent) {
  const sizeToPixel = extent / TILE_SIZE;

  for (let ii = 0; ii < line.length; ii++) {
    const p = line[ii];
    // LNGLAT
    line[ii] = worldToLngLat([x + p[0] / sizeToPixel, y + p[1] / sizeToPixel], scale);
  }
}

/* adapted from @mapbox/vector-tile/lib/vectortilefeature.js for better perf */
/* eslint-disable */
export function vectorTileFeatureToProp(vectorTileFeature, project) {
  let coords = getCoordinates(vectorTileFeature);
  const extent = vectorTileFeature.extent;
  let i;
  let j;

  coords = classifyRings(coords);
  for (i = 0; i < coords.length; i++) {
    for (j = 0; j < coords[i].length; j++) {
      project(coords[i][j], extent);
    }
  }

  return coords.map(coordinates => ({
    coordinates,
    properties: vectorTileFeature.properties
  }));
}

function getCoordinates(vectorTileFeature) {
  const pbf = vectorTileFeature._pbf;
  pbf.pos = vectorTileFeature._geometry;

  const end = pbf.readVarint() + pbf.pos;
  let cmd = 1;
  let length = 0;
  let x = 0;
  let y = 0;

  const lines = [];
  let line;

  while (pbf.pos < end) {
    if (length <= 0) {
      const cmdLen = pbf.readVarint();
      cmd = cmdLen & 0x7;
      length = cmdLen >> 3;
    }

    length--;

    if (cmd === 1 || cmd === 2) {
      x += pbf.readSVarint();
      y += pbf.readSVarint();

      if (cmd === 1) {
        // moveTo
        if (line) lines.push(line);
        line = [];
      }

      if (line) line.push([x, y]);
    } else if (cmd === 7) {
      // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
      if (line) {
        line.push(line[0].slice()); // closePolygon
      }
    } else {
      throw new Error(`unknown command ${cmd}`);
    }
  }

  if (line) lines.push(line);

  return lines;
}

// classifies an array of rings into polygons with outer rings and holes

function classifyRings(rings) {
  const len = rings.length;

  if (len <= 1) return [rings];

  const polygons = [];
  let polygon;
  let ccw;

  for (let i = 0; i < len; i++) {
    const area = signedArea(rings[i]);
    if (area === 0) {
      continue;
    }

    if (ccw === undefined) {
      ccw = area < 0;
    }

    if (ccw === area < 0) {
      if (polygon) {
        polygons.push(polygon);
      }
      polygon = [rings[i]];
    } else if (polygon) {
      polygon.push(rings[i]);
    }
  }
  if (polygon) {
    polygons.push(polygon);
  }

  return polygons;
}

function signedArea(ring) {
  let sum = 0;
  for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2[0] - p1[0]) * (p1[1] + p2[1]);
  }
  return sum;
}
