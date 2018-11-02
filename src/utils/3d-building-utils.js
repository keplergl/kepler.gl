// Copyright (c) 2018 Uber Technologies, Inc.
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
import {vectorTileFeatureToGeoJSON} from './feature-utils';

/* global fetch process */
const TILE_SIZE = 512;
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

export function getTileData({x, y, z}) {
  const mapSource = `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/${z}/${x}/${y}.vector.pbf?access_token=${MAPBOX_TOKEN}`;
  return fetch(mapSource)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(buffer => {
      const data = decodeTile(x, y, z, buffer);
      return data;
    });
}

export function decodeTile(x, y, z, arrayBuffer) {
  const tile = new VectorTile(new Protobuf(arrayBuffer));

  const result = [];
  const xProj = x * TILE_SIZE;
  const yProj = y * TILE_SIZE;
  const scale = Math.pow(2, z);

  const projectFunc = project.bind(null, xProj, yProj, scale);

  /* eslint-disable guard-for-in */
  const layerName = "building";
  const vectorTileLayer = tile.layers[layerName];
  if (!vectorTileLayer) {
    return [];
  }
  for (let i = 0; i < vectorTileLayer.length; i++) {
    const vectorTileFeature = vectorTileLayer.feature(i);
    const features = vectorTileFeatureToGeoJSON(vectorTileFeature, projectFunc);
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
