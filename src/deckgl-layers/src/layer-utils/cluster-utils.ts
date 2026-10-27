// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Supercluster from 'supercluster';
import memoize from 'es-toolkit/compat/memoize';
import {BBox, Position} from 'geojson';

// es-toolkit/compat memoize does not export lodash's MemoizedFunction type.
type MemoizedFunction = {
  cache: {
    clear?: () => void;
  };
};

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

const getClusterer = ({clusterRadius, geoJSON}: {clusterRadius: number; geoJSON}) => {
  const ownedAccumulators = new WeakSet();
  return new Supercluster({
    maxZoom: 20,
    radius: clusterRadius,
    reduce: (accumulated, props) => {
      // Supercluster shallow-copies a child's properties when starting a parent.
      // Clone its shared points once per accumulator, then append without copying
      // the growing prefix. Track object identity so a parent acquires its own array.
      if (!ownedAccumulators.has(accumulated)) {
        accumulated.points = accumulated.points.slice();
        ownedAccumulators.add(accumulated);
      }
      for (const point of props.points) {
        accumulated.points.push(point);
      }
    },
    map: props => ({points: [props.data]})
  }).load(geoJSON);
};

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
    zoom,
    minPointCount = 1
  }: {
    bbox: BBox;
    clusterRadius: number;
    geoJSON;
    zoom: number;
    /** Drop clusters holding fewer points than this, so sparse noise is not drawn. */
    minPointCount?: number;
  }): {
    points: any;
    position: Position;
    index: number;
  }[] {
    const clusterer = this.clusterer({clusterRadius, geoJSON});
    const cutoff = Number.isFinite(minPointCount) ? minPointCount : 1;

    // map clusters to formatted bins to be passed to deck.gl bin-sorter.
    // `index` must stay the position in the returned array: the bin sorter and
    // picking both look cells up by it.
    const clusters: {points: any; position: Position; index: number}[] = [];
    for (const c of clusterer.getClusters(bbox, zoom)) {
      const points = c.properties.points;
      if (points.length < cutoff) {
        continue;
      }
      clusters.push({
        points,
        position: c.geometry.coordinates,
        index: clusters.length
      });
    }

    return clusters;
  }

  clearClustererCache() {
    this.clusterer.cache.clear?.();
  }
}
