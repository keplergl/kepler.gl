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

/*
 * Query, manage and format OpenStreetMap data
 */

import {MAPZEN_API_KEY} from 'constants/default-settings';
import {WebMercatorViewport} from 'deck.gl';
import {extent} from 'd3-array';

// only use tiles from this zoom level to maximize caching
const MAX_ZOOM = 16;
// only load tiles above this zoom level
const MIN_ZOOM = 12;

function mercatorY(latitude) {
  return Math.asinh(Math.tan(latitude / 180 * Math.PI));
}

/*
 * Construct an URL to retreive vector tile from Mapzen API
 * https://mapzen.com/documentation/vector-tiles/use-service/
 */
export function getQueryURL(x, y, z) {
  return (
    'https://vector.mapzen.com/osm/buildings/' +
    `${z}/${x}/${y}.json?api_key=${MAPZEN_API_KEY}`
  );
}

/*
 * get z value from zoom
 */
export function normalizeZ(zoom) {
  return Math.min(Math.floor(zoom), MAX_ZOOM);
}

/*
 * Calculate OpenStreetMap tile names from lng, lat and zoom
 * http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y
 */
export function getTileCoordinates(longitude, latitude, zoom) {
  const z = normalizeZ(zoom);
  longitude = Math.min(180, Math.max(-180, longitude));
  latitude = Math.min(85.0511, Math.max(-85.0511, latitude));

  const scale = Math.pow(2, z);
  const x = Math.floor((longitude / 360 + 1 / 2) * scale);
  const y = Math.floor((1 - mercatorY(latitude) / Math.PI) / 2 * scale);

  return {x, y, z};
}

export function getBounds(mapState) {
  const viewport = new WebMercatorViewport(mapState);

  // project 4 corners of perspective viewport
  const topLeft = viewport.unproject([0, 0]);
  const bottomRight = viewport.unproject([mapState.width, mapState.height]);
  const topRight = viewport.unproject([mapState.width, 0]);
  const bottomLeft = viewport.unproject([0, mapState.height]);

  // normalize bearing, always return [[lngMin, latMax], [lngMax. latMin]]
  const [lngMin, lngMax] = extent(
    [topLeft, bottomRight, topRight, bottomLeft],
    d => d[0]
  );

  const [latMin, latMax] = extent(
    [topLeft, bottomRight, topRight, bottomLeft],
    d => d[1]
  );

  return [[lngMin, latMax], [lngMax, latMin]];
}

/*
 * Simple manager that caches and looks up tiles data
 */
export class TilesCache {
  constructor() {
    this.cache = {};
  }

  set(x, y, z, value) {
    this.cache[`${x}-${y}-${z}`] = value;
    return this;
  }

  get(x, y, z) {
    return this.cache[`${x}-${y}-${z}`];
  }

  has(x, y, z) {
    return `${x}-${y}-${z}` in this.cache;
  }
}

/*
 * Calculates the set of tiles that need to be loaded to fill a given viewport.
 */
/* eslint-disable max-statements */
export class TilesCollection {
  constructor(mapState) {
    if (mapState && mapState.zoom >= MIN_ZOOM) {
      // approx. bounds of the viewport
      const queryZoom = normalizeZ(mapState.zoom);
      const bounds = getBounds(mapState);

      const topLeft = getTileCoordinates(...bounds[0], queryZoom);
      const bottomRight = getTileCoordinates(...bounds[1], queryZoom);

      this.left = topLeft.x;
      this.right = bottomRight.x;
      this.zoom = queryZoom;
      this.top = topLeft.y;
      this.bottom = bottomRight.y;
      this.size =
        (bottomRight.x - topLeft.x + 1) * (bottomRight.y - topLeft.y + 1);
    } else {
      this.size = 0;
    }

    this.tiles = this.getTiles();
  }

  // returns an array of tiles as {x, y} coordinates
  getTiles() {
    if (this.tiles) {
      return this.tiles;
    }

    let tiles = null;

    if (this.size > 0) {
      tiles = [];
      for (let x0 = this.left; x0 <= this.right; x0++) {
        for (let y0 = this.top; y0 <= this.bottom; y0++) {
          tiles.push({x: x0, y: y0, z: this.zoom});
        }
      }
    }

    return tiles;
  }

  // supplying 2 parameters x, y:
  // [returns] true if the given tile is inside this collection
  // supplying 1 parameter tilesCollection:
  // [returns] true if given collection is a subset of this one
  contains(x, y, z) {
    if (y === undefined) {
      const that = x;
      return (
        this.zoom === that.zoom &&
        this.left <= that.left &&
        this.right >= that.right &&
        this.top <= that.top &&
        this.bottom >= that.bottom
      );
    }

    return (
      z === this.zoom &&
      x >= this.left &&
      x <= this.right &&
      y >= this.top &&
      y <= this.bottom
    );
  }
}
/* eslint-enable max-statements */
