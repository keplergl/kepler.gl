// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import ClusterBuilder, {getGeoJSON} from './cluster-utils';
import Supercluster from 'supercluster';

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

  test('membership reads grow linearly for coincident points', () => {
    for (const size of [128, 256, 512]) {
      let reads = 0;
      const proxies = new WeakMap<object[], object[]>();
      const countReads = (points: object[]) => {
        const existing = proxies.get(points);
        if (existing) return existing;
        const proxy = new Proxy(points, {
          get(target, key, receiver) {
            if (typeof key === 'string' && /^\d+$/.test(key)) reads++;
            return Reflect.get(target, key, receiver);
          }
        });
        proxies.set(points, proxy);
        proxies.set(proxy, proxy);
        return proxy;
      };
      const load = Supercluster.prototype.load;
      const spy = jest
        .spyOn(Supercluster.prototype, 'load')
        .mockImplementation(function (this: Supercluster, points) {
          const {options} = this as unknown as {
            options: {
              reduce: (accumulated: {points: object[]}, props: {points: object[]}) => void;
            };
          };
          const reduce = options.reduce;
          options.reduce = (accumulated, props) => {
            // Observe reference reads by the real reducer, including slice/concat/spread.
            // Preserve accumulator identity and never modify the incoming properties.
            accumulated.points = countReads(accumulated.points);
            reduce(accumulated, {...props, points: countReads(props.points)});
          };
          return load.call(this, points);
        });
      try {
        const input = Array.from({length: size}, (_, index) => ({index, position: [0, 0]}));
        const clusters = query(
          new ClusterBuilder(),
          getGeoJSON(input, d => d.position, null)
        );
        expect(clusters).toHaveLength(1);
        expect(clusters[0].points).toHaveLength(size);
        // Allow constant-factor implementation differences, but reject repeated prefixes.
        expect(reads).toBeLessThanOrEqual(size * 4);
      } finally {
        spy.mockRestore();
      }
    }
  });

  test('preserves child membership, identity, multiplicity and order across zooms', () => {
    const hierarchy = [0, 0.0002, 0.002, 0.02, 0.2, 2, 20].flatMap((lng, group) =>
      Array.from({length: group + 2}, (_, index) =>
        Object.freeze({index: group * 100 + index, position: Object.freeze([lng, 0])})
      )
    );
    const scattered = Array.from({length: 128}, (_, index) =>
      Object.freeze({
        index,
        position: Object.freeze([-170 + ((index * 37) % 340), -65 + ((index * 19) % 130)])
      })
    );
    for (const input of [Object.freeze([...hierarchy, hierarchy[0]]), Object.freeze(scattered)]) {
      const geoJSON = getGeoJSON(input, d => d.position, null);
      for (const point of geoJSON) {
        Object.freeze(point.properties.points);
        Object.freeze(point.properties);
        Object.freeze(point.geometry);
        Object.freeze(point);
      }
      Object.freeze(geoJSON);

      // The immutable reducer defines the existing ordering independently of ownership.
      const reference = new Supercluster({
        maxZoom: 20,
        radius: 40,
        map: props => ({points: [props.data]}),
        reduce: (accumulated, props) => {
          accumulated.points = accumulated.points.concat(props.points);
        }
      }).load(geoJSON);
      const builder = new ClusterBuilder();
      for (const zoom of [21, 20, 18, 15, 12, 9, 6, 3, 0, 20, 4, 21]) {
        const expected = reference.getClusters(WORLD_BBOX, zoom);
        const actual = query(builder, geoJSON, zoom);
        expect(actual).toHaveLength(expected.length);
        actual.forEach((cluster, index) => {
          const members = expected[index].properties.points;
          expect(cluster.index).toBe(index);
          expect(cluster.position).toEqual(expected[index].geometry.coordinates);
          expect(cluster.points).toHaveLength(members.length);
          cluster.points.forEach((point, i) => expect(point).toBe(members[i]));
        });
        expect(actual.reduce((sum, cluster) => sum + cluster.points.length, 0)).toBe(input.length);
      }
      geoJSON.forEach(point => {
        expect(point.properties.points).toHaveLength(1);
        expect(point.properties.points[0]).toBe(point.properties.data);
      });
    }
  });

  test('keeps cached membership stable through radius changes and filtered rebuilds', () => {
    const input = [...data, {index: 4, position: [NaN, 0]}, {index: 5, position: [0, Infinity]}];
    const geoJSON = getGeoJSON(input, d => d.position, null);
    const builder = new ClusterBuilder();
    const initial = query(builder, geoJSON);
    const snapshot = initial.map(cluster => cluster.points.slice());
    const firstIndex = builder.clusterer({clusterRadius: 40, geoJSON});
    query(builder, geoJSON, 12, 60);
    expect(builder.clusterer({clusterRadius: 40, geoJSON})).toBe(firstIndex);
    expect(query(builder, geoJSON).map(cluster => cluster.points)).toEqual(snapshot);

    builder.clearClustererCache();
    const filtered = getGeoJSON(
      input,
      d => d.position,
      d => d.index % 2 === 0
    );
    expect(query(builder, filtered).flatMap(cluster => cluster.points)).toEqual([data[0], data[2]]);
    expect(builder.clusterer({clusterRadius: 40, geoJSON: filtered})).not.toBe(firstIndex);
    expect(initial.map(cluster => cluster.points)).toEqual(snapshot);

    for (const remaining of [[], [data[3]]]) {
      builder.clearClustererCache();
      const next = getGeoJSON(remaining, d => d.position, null);
      expect(query(builder, next).flatMap(cluster => cluster.points)).toEqual(remaining);
    }
  });
});

function query(builder: ClusterBuilder, geoJSON, zoom = 4, clusterRadius = 40) {
  return builder.clustersAtZoom({bbox: WORLD_BBOX, clusterRadius, geoJSON, zoom});
}

describe('ClusterBuilder meter radius', () => {
  const world: [number, number, number, number] = [-180, -90, 180, 90];
  const degrees = (meters: number) => ((meters / 6371008.8) * 180) / Math.PI;
  const makeData = (positions: number[][]) =>
    positions.map((position, index) => ({index, position}));
  const geo = input => getGeoJSON(input, d => d.position, null);
  const memberships = clusters =>
    clusters.map(c => c.points.map(p => p.index)).sort((a, b) => a[0] - b[0]);
  const run = (builder, geoJSON, overrides = {}) =>
    builder.clustersAtZoom({
      bbox: world,
      geoJSON,
      zoom: 4,
      clusterRadius: 100,
      clusterRadiusInMeters: true,
      ...overrides
    });

  test('uses the same ground distance at different latitudes and every zoom', () => {
    const input = makeData(
      [0, 60, 85].flatMap((lat, i) => [
        [i * 30, lat],
        [i * 30, lat + degrees(80)],
        [i * 30, lat + degrees(220)]
      ])
    );
    const builder = new ClusterBuilder();
    const points = geo(input);
    const load = jest.spyOn(Supercluster.prototype, 'load');
    try {
      for (const zoom of [0, 4, 14.5, 20, 22, 5]) {
        expect(memberships(run(builder, points, {zoom}))).toEqual([
          [0, 1],
          [2],
          [3, 4],
          [5],
          [6, 7],
          [8]
        ]);
      }
      expect(load).toHaveBeenCalledTimes(1);
      const local = run(builder, points, {bbox: [29, 59, 31, 61]});
      expect(memberships(local)).toEqual([[3, 4], [5]]);
      expect(local.map(c => c.index)).toEqual([0, 1]);
      expect(load).toHaveBeenCalledTimes(1);
    } finally {
      load.mockRestore();
    }
  });

  test('uses a great-circle threshold east-west at high latitude', () => {
    for (const lat of [0, 60, 85]) {
      const offset = meters => degrees(meters) / Math.cos((lat * Math.PI) / 180);
      const input = makeData([
        [0, lat],
        [offset(99), lat],
        [-offset(101), lat]
      ]);
      expect(memberships(run(new ClusterBuilder(), geo(input)))).toEqual([[0, 1], [2]]);
    }
  });

  test('groups across the dateline and keeps the centroid there', () => {
    const input = makeData([
      [179.9998, 0],
      [-179.9998, 0],
      [0, 0]
    ]);
    const builder = new ClusterBuilder();
    const points = geo(input);
    const clusters = run(builder, points);
    expect(memberships(clusters)).toEqual([[0, 1], [2]]);
    expect(Math.abs(clusters.find(c => c.points.length === 2)!.position[0])).toBeCloseTo(180);
    expect(memberships(run(builder, points, {bbox: [179, -1, -179, 1]}))).toEqual([[0, 1]]);
  });

  test('groups around the first unassigned point without expanding through chains', () => {
    const input = makeData([0, 80, 160].map(meters => [0, degrees(meters)]));
    const clusters = run(new ClusterBuilder(), geo(input));
    expect(memberships(clusters)).toEqual([[0, 1], [2]]);
    expect(clusters[0].points[0]).toBe(input[0]);
    expect(clusters[0].points[1]).toBe(input[1]);
  });

  test('switches units and radius without reusing incompatible groups', () => {
    const input = makeData([
      [0, 0],
      [0, degrees(80)]
    ]);
    const points = geo(input);
    const builder = new ClusterBuilder();
    expect(memberships(run(builder, points))).toEqual([[0, 1]]);
    expect(memberships(run(builder, points, {clusterRadius: 50}))).toEqual([[0], [1]]);
    expect(memberships(run(builder, points, {clusterRadiusInMeters: false, zoom: 22}))).toEqual([
      [0],
      [1]
    ]);
    expect(memberships(run(builder, points))).toEqual([[0, 1]]);
    expect(run(builder, points, {minPointCount: 3})).toEqual([]);
    expect(memberships(run(builder, geo(input.slice(1))))).toEqual([[1]]);
    builder.clearClustererCache();
    expect(memberships(run(builder, points))).toEqual([[0, 1]]);
  });

  test('handles empty, invalid, coincident, wrapped and polar coordinates', () => {
    expect(run(new ClusterBuilder(), [])).toEqual([]);
    const input = makeData([
      [NaN, 0],
      [0, Infinity],
      [0, 91],
      [0, -91],
      [0, 0],
      [360, 0],
      [0, 90],
      [180, 90]
    ]);
    expect(memberships(run(new ClusterBuilder(), geo(input), {clusterRadius: 0}))).toEqual([
      [4, 5],
      [6, 7]
    ]);
    const dense = makeData(Array.from({length: 10000}, () => [0, 0]));
    const clusters = run(new ClusterBuilder(), geo(dense));
    expect(clusters).toHaveLength(1);
    expect(clusters[0].points).toEqual(dense);
  });

  test.each([NaN, Infinity, -1, undefined])(
    'falls back to the default for invalid radius %p',
    clusterRadius => {
      const input = makeData([
        [0, 0],
        [0, degrees(30)],
        [0, degrees(100)]
      ]);
      expect(memberships(run(new ClusterBuilder(), geo(input), {clusterRadius}))).toEqual([
        [0, 1],
        [2]
      ]);
    }
  );

  test('matches a great-circle reference across small and global distances', () => {
    const input = makeData(
      Array.from({length: 128}, (_, index) => [
        -179 + ((index * 71) % 358),
        -89 + ((index * 29) % 178)
      ]).flatMap(position => [position, [position[0] + degrees(10), position[1]]])
    );
    const distance = (a, b) => {
      const radians = Math.PI / 180;
      const haversine =
        Math.sin(((b[1] - a[1]) * radians) / 2) ** 2 +
        Math.cos(a[1] * radians) *
          Math.cos(b[1] * radians) *
          Math.sin(((b[0] - a[0]) * radians) / 2) ** 2;
      return 2 * 6371008.8 * Math.asin(Math.sqrt(Math.min(1, haversine)));
    };
    for (const radius of [1, 25, 100000, 5000000, 21000000]) {
      const remaining = new Set(input);
      const expected: number[][] = [];
      for (const seed of input) {
        if (!remaining.has(seed)) continue;
        const members = [...remaining].filter(
          point => distance(seed.position, point.position) <= radius
        );
        members.forEach(point => remaining.delete(point));
        expected.push(members.map(point => point.index));
      }
      expect(memberships(run(new ClusterBuilder(), geo(input), {clusterRadius: radius}))).toEqual(
        expected
      );
    }
  });
});
