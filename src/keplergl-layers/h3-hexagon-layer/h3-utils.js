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

const {h3ToGeo, h3ToGeoBoundary} = require('@uber/h3-transitional');

// get vertices should return [lon, lat]
export function getVertices({id}) {
  // always reverse it
  return h3ToGeoBoundary(id).map(d => d.reverse());
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
      coordinates: [...vertices, vertices[0]],
      type: 'LineString'
    },
    properties
  };
}
