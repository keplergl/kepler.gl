// Copyright (c) 2019 Uber Technologies, Inc.
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

import Supercluster from 'supercluster';
import memoize from 'lodash.memoize';

export function getGeoJSON(data, getPosition) {
  return data
    .map(d => ({
      type: 'Point',
      properties: {
        data: d,
        points: [d],
        point_count: 1,
        point_count_abbreviated: '1'
      },
      geometry: {
        coordinates: getPosition(d)
      }
    }))
    .filter(d => d.geometry.coordinates.every(Number.isFinite));
}

const clusterResolver = ({clusterRadius}) => `${clusterRadius}`;

const getClusterer = memoize(({clusterRadius, geoJSON}) => {
  return new Supercluster({
    maxZoom: 20,
    radius: clusterRadius,
    reduce: (accumulated, props) => {
      accumulated.points = [...accumulated.points, ...props.points]
    },
    map: props => ({points: [props.data]})
  }).load(geoJSON);
}, clusterResolver);

export function clustersAtZoom({bbox, clusterRadius, geoJSON, zoom}) {
  console.log({clusterRadius})
  const clusterer = getClusterer({clusterRadius, geoJSON});
  return clusterer.getClusters(bbox, zoom);
}

export function clearClustererCache() {
  getClusterer.cache.clear();
}
