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

import supercluster from 'supercluster';
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
  return supercluster({
    maxZoom: 20,
    radius: clusterRadius,
    initial: () => ({points: []}),
    map: props => props.data,
    reduce: (accumulated, props) => {
      if (props.points) {
        // avoid using spread to prevent max call stack exceeded error
        props.points.forEach(p => {
          accumulated.points.push(p);
        });
      } else {
        accumulated.points.push(props);
      }
    }
  }).load(geoJSON);
}, clusterResolver);

export function clustersAtZoom({bbox, clusterRadius, geoJSON, zoom}) {
  const clusterer = getClusterer({clusterRadius, geoJSON});

  return clusterer.getClusters(bbox, zoom);
}

export function clearClustererCache() {
  getClusterer.cache.clear();
}
