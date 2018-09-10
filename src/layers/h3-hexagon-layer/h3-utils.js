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

import {h3GetResolution, h3ToGeo, h3ToGeoBoundary, geoToH3} from 'h3-js';
export {h3GetResolution};

// get vertices should return [lon, lat]
export function getVertices({id}) {
  // always reverse it
  return h3ToGeoBoundary(id, true);
}

// get centroid should return [lon, lat]
export function getCentroid({id}) {
  // always reverse it to [lng, lat]
  return h3ToGeo(id).reverse();
}

export function idToPolygonGeo({object}, properties) {
  if (!object || !object.id) {
    return null;
  }

  const vertices = getVertices(object);

  return {
    geometry: {
      coordinates: vertices,
      type: 'LineString'
    },
    properties
  };
}

export function getCenterHex({latitude, longitude}, resolution) {
  return geoToH3(latitude, longitude, resolution);
}

// H3 hexagon are not perfect hexagon after projection, they are slightly distorted
// Here we calculate the distortion from perfect hexagon to h3 hexagon
// A mathematica proof can be found at
// https://beta.observablehq.com/@heshan0131/h3-hexagon-shape-normalize
export function getH3VerticeTransform(rawVertices, centroid) {
  const vertices = revertVertices(rawVertices.map(vt => offset(vt, centroid)));
  const radius = getRadius(vertices[0], vertices[3]);

  const angle = getAngle(vertices[0], vertices[3])

  // rotate hexagon vertices, so that v0 - v3 axis parallel with xAxis
  //   2___1
  // 3 /   \ 0
  //   \___/
  //   4   5
  //
  const rotatedVertices = vertices.map(vt => rotate([0, 0], vt, angle));

  // vertices of a perfect hexagon
  const normalVertices = getHexagonVertices(radius);

  // calculate distortion
  return getDistortions(rotatedVertices, normalVertices)
}

// Vertices index based on
// https://github.com/uber/luma.gl/blob/master/modules/core/src/geometry/truncated-cone-geometry.js
export function distortCylinderPositions(positions, distortions) {

  const primitives = distortions.map(({dr, da}, i) =>
    getPtOnCircle(dr, da + Math.PI * i / 3));
  // close it
  primitives.push(primitives[0]);

  // starting from the 8th vertice, repeat 4 times, only replace x(0), y(1)
  return positions.map((v, i) => {
    if (i > 20 && i < 21 * 5 && i % 3 < 2) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return primitives[row % 7][col];
    }
    return v;
  });
}

function offset([px, py], [x0, y0]) {
  return [[px - x0], [py - y0]];
}

function rotate([cx, cy], [x, y], radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
  const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

  return [nx, ny];
}

function getDistance(pt0, pt1) {
  const dx = pt0[0] - pt1[0];
  const dy = pt0[1] - pt1[1];
  const dxy = Math.sqrt(dx * dx + dy * dy);
  return dxy;
}

export function getRadius(pt0, pt3) {
  const dxy = getDistance(pt0, pt3);
  return dxy / 2;
}

export function getAngle(pt0, pt3) {
  const dx = pt0[0] - pt3[0];
  const dy = pt0[1] - pt3[1];
  const dxy = Math.sqrt(dx * dx + dy * dy);

  // Calculate angle that the perpendicular hexagon vertex axis is tilted
  const angle = Math.acos(dx / dxy) * Math.sign(dy);
  return angle;
}

function getPtOnCircle(radius, angle) {
  return [radius *  Math.cos(angle), radius *  Math.sin(angle)];
}

function getHexagonVertices(r) {
  const ang60 = Math.PI / 3;
  const pts = []
  for (let i = 0; i < 6; i++) {
    pts.push(getPtOnCircle(r, ang60 * i))
  }

  return pts;
}

function revertVertices(verts) {
  // reverting verts from clock (h3) to counter clock wise (luma cylinder)
  const seq = [0, 5, 4, 3, 2, 1];
  return seq.map(s => verts[s]);
}

function getDistortions(vts, origs) {
  // 0 and 3 should be the guide
  const ct = [0, 0];
  const distortions = [];

  for (let i = 0; i < 6; i++) {
    const vt = vts[i];
    const org = origs[i];

    const r = getRadius(org, ct);
    const dr = getRadius(vt, ct) / r

    const da = Math.atan2(vt[1], vt[0]) - Math.atan2(org[1], org[0]);

    distortions.push({dr, da});
  }

  return distortions;
}
