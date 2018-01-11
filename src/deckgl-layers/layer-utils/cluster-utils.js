import supercluster from 'supercluster';
import memoize from 'lodash/memoize';

export function getGeoJSON(data, getPosition) {
  return data.map(d => ({
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
  })).filter(d => d.geometry.coordinates.every(Number.isFinite));
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
        })
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
