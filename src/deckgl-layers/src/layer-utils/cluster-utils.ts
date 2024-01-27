// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Supercluster from 'supercluster';
import memoize from 'lodash.memoize';
import {MemoizedFunction} from 'lodash';
import {BBox, Position} from 'geojson';

export function getGeoJSON(data, getPosition, filterData) {
  const raw = typeof filterData === 'function' ? data.filter(filterData) : data;

  return raw
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

const clusterResolver = ({clusterRadius}: {clusterRadius: number}) => `${clusterRadius}`;

const getClusterer = ({clusterRadius, geoJSON}: {clusterRadius: number; geoJSON}) =>
  new Supercluster({
    maxZoom: 20,
    radius: clusterRadius,
    reduce: (accumulated, props) => {
      accumulated.points = [...accumulated.points, ...props.points];
    },
    map: props => ({points: [props.data]})
  }).load(geoJSON);

export default class ClusterBuilder {
  clusterer: (({clusterRadius, geoJSON}: {clusterRadius: number; geoJSON}) => Supercluster) &
    MemoizedFunction;

  constructor() {
    this.clusterer = memoize(getClusterer, clusterResolver);
  }

  clustersAtZoom({
    bbox,
    clusterRadius,
    geoJSON,
    zoom
  }: {
    bbox: BBox;
    clusterRadius: number;
    geoJSON;
    zoom: number;
  }): {
    points: any;
    position: Position;
    index: number;
  }[] {
    const clusterer = this.clusterer({clusterRadius, geoJSON});

    // map clusters to formatted bins to be passed to deck.gl bin-sorter
    const clusters = clusterer.getClusters(bbox, zoom).map((c, i) => ({
      points: c.properties.points,
      position: c.geometry.coordinates,
      index: i
    }));

    return clusters;
  }

  clearClustererCache() {
    this.clusterer.cache.clear?.();
  }
}
