// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import ClusterBuilder, {getGeoJSON} from './cluster-utils';

const WORLD_BBOX: [number, number, number, number] = [-180, -85, 180, 85];

// Three points at the same spot cluster together, the fourth stays on its own.
const data = [
  {index: 0, position: [-122.1, 37.4]},
  {index: 1, position: [-122.1001, 37.4001]},
  {index: 2, position: [-122.1002, 37.4]},
  {index: 3, position: [20, -10]}
];

function clusterSizes(minPointCount?: number) {
  const geoJSON = getGeoJSON(data, d => d.position, null);
  const clusters = new ClusterBuilder().clustersAtZoom({
    bbox: WORLD_BBOX,
    clusterRadius: 40,
    geoJSON,
    zoom: 4,
    minPointCount
  });
  return {
    sizes: clusters.map(c => c.points.length).sort(),
    indices: clusters.map(c => c.index)
  };
}

describe('ClusterBuilder.clustersAtZoom', () => {
  test('keeps every cluster without a cutoff', () => {
    expect(clusterSizes()).toEqual({sizes: [1, 3], indices: [0, 1]});
  });

  test('drops clusters below the cutoff and keeps indices contiguous', () => {
    expect(clusterSizes(2)).toEqual({sizes: [3], indices: [0]});
  });

  test('a cutoff above every cluster leaves nothing to draw', () => {
    expect(clusterSizes(4)).toEqual({sizes: [], indices: []});
  });
});
