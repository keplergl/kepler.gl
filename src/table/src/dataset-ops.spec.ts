// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {latLngToCell} from '@kepler.gl/common-utils';
import {Int64, Table, Uint64, vectorFromArray} from 'apache-arrow';

import KeplerTable from './kepler-table';
import {aggregateValues} from './dataset-ops/aggregations';
import {
  DATASET_OPS_AGGREGATIONS,
  aggregationOptionsForField,
  defaultAggregationsForFields,
  groupByDataset,
  isDatasetOpsAggregationField,
  canMutateDatasetSchema,
  isTabularDatasetForOps,
  joinDatasets,
  spatialJoinDatasets,
  defaultSuitabilityWeights,
  isSuitabilityWeightField,
  suitabilityDataset
} from './dataset-ops';

function makeTable({
  id,
  fields,
  rows,
  type = 'local'
}: {
  id: string;
  fields: {name: string; type: string}[];
  rows: any[][];
  type?: string;
}) {
  const table = new KeplerTable({
    info: {id, label: id, type},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: fields.map(field => ({
      name: field.name,
      type: field.type,
      analyzerType: field.type
    })),
    rows
  });
  return table;
}

function makeInt64Data(values: (bigint | null)[], type: Int64 | Uint64 = new Int64()) {
  const region = vectorFromArray(values.map(value => (value === null ? 'missing' : 'west')));
  const pop = vectorFromArray(values, type);
  return {
    fields: [
      {name: 'region', type: ALL_FIELD_TYPES.string},
      {name: 'pop', type: ALL_FIELD_TYPES.integer}
    ],
    cols: [region, pop],
    rows: [],
    arrowTable: new Table({region, pop})
  };
}

const square = (west: number, south: number, east: number, north: number) => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south]
      ]
    ]
  }
});

describe('dataset-ops engine', () => {
  test('groupByDataset aggregates numeric and unique string values', () => {
    const dataset = makeTable({
      id: 'cities',
      fields: [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer},
        {name: 'name', type: ALL_FIELD_TYPES.string}
      ],
      rows: [
        ['west', 10, 'a'],
        ['west', 20, 'b'],
        ['east', 40, 'c']
      ]
    });

    const result = groupByDataset(dataset, {
      fieldName: 'region',
      aggregations: {
        pop: DATASET_OPS_AGGREGATIONS.sum,
        name: DATASET_OPS_AGGREGATIONS.countUnique
      },
      resultId: 'cities-grouped',
      operationId: 'gb-1'
    });

    expect(result.info.id).toBe('cities-grouped');
    expect(result.metadata.derivedDataset).toEqual({
      type: 'groupBy',
      sourceDataIds: ['cities'],
      operationId: 'gb-1'
    });
    expect(result.data.fields.map(f => f.name)).toEqual(['region', 'pop_sum', 'name_countUnique']);
    const byRegion = Object.fromEntries(result.data.rows.map(row => [row[0], row]));
    expect(byRegion.west).toEqual(['west', 30, 2]);
    expect(byRegion.east).toEqual(['east', 40, 1]);
  });

  describe.each([new Int64(), new Uint64()])('Arrow %s Group By', arrowType => {
    test.each([
      [DATASET_OPS_AGGREGATIONS.sum, 30, 80],
      [DATASET_OPS_AGGREGATIONS.average, 15, 40],
      [DATASET_OPS_AGGREGATIONS.median, 15, 40]
    ] as const)('%s works before and after repeated updates', async (technique, first, next) => {
      const dataset = new KeplerTable({info: {id: 'int64'}, color: [0, 0, 0]});
      dataset.updateSchema(makeInt64Data([10n, 20n, null], arrowType));
      const config = {fieldName: 'region', aggregations: {pop: technique}};

      expect(groupByDataset(dataset, config).data.rows).toEqual([
        ['west', first],
        ['missing', null]
      ]);

      for (let i = 0; i < 2; i++) {
        const data = makeInt64Data([30n, 50n, null], arrowType);
        await dataset.update(data);
        const result = groupByDataset(dataset, config);
        expect(result.data.rows).toEqual([
          ['west', next],
          ['missing', null]
        ]);
        expect([0, 1, 2].map(index => dataset.dataContainer.valueAt(index, 1))).toEqual([
          30n,
          50n,
          null
        ]);
        expect([0, 1, 2].map(index => data.cols[1].get(index))).toEqual([30n, 50n, null]);

        const reloaded = new KeplerTable({info: result.info, color: [0, 0, 0]});
        await reloaded.importData({data: result.data});
        expect(reloaded.dataContainer.valueAt(0, 1)).toBe(next);
      }
    });
  });

  test.each([
    [DATASET_OPS_AGGREGATIONS.sum, 18014398509481984],
    [DATASET_OPS_AGGREGATIONS.average, 9007199254740992],
    [DATASET_OPS_AGGREGATIONS.median, 9007199254740992],
    [DATASET_OPS_AGGREGATIONS.minimum, 9007199254740992n],
    [DATASET_OPS_AGGREGATIONS.maximum, 9007199254740993n],
    [DATASET_OPS_AGGREGATIONS.countUnique, 2],
    [DATASET_OPS_AGGREGATIONS.count, 2]
  ] as const)('Int64 %s preserves source precision', (technique, expected) => {
    const values = [9007199254740992n, 9007199254740993n];
    const data = makeInt64Data(values);
    const dataset = new KeplerTable({info: {id: 'int64'}, color: [0, 0, 0]});
    dataset.updateSchema(data);

    const result = groupByDataset(dataset, {
      fieldName: 'region',
      aggregations: {pop: technique}
    });

    // Arithmetic uses Number precision; extrema and distinct counts retain exact BigInts.
    expect(result.data.rows).toEqual([['west', expected]]);
    expect([0, 1].map(index => dataset.dataContainer.valueAt(index, 1))).toEqual(values);
    expect([0, 1].map(index => data.cols[1].get(index))).toEqual(values);
  });

  test.each([
    [DATASET_OPS_AGGREGATIONS.sum, 30, 1],
    [DATASET_OPS_AGGREGATIONS.average, 15, 0.5],
    [DATASET_OPS_AGGREGATIONS.median, 15, 0.5]
  ] as const)('%s handles mixed numbers and missing values', (technique, numeric, boolean) => {
    expect(aggregateValues([10n, null, 20, undefined], technique)).toBe(numeric);
    expect(aggregateValues([true, false, null], technique)).toBe(boolean);
    expect(aggregateValues([], technique)).toBeNull();
    expect(aggregateValues([null, undefined], technique)).toBeNull();
  });

  test('groupByDataset keeps null groups distinct from the string __null__', () => {
    const dataset = makeTable({
      id: 'cities',
      fields: [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [null, 1],
        [null, 2],
        ['__null__', 10],
        ['__null__', 20],
        ['west', 3]
      ]
    });

    const result = groupByDataset(dataset, {
      fieldName: 'region',
      aggregations: {pop: DATASET_OPS_AGGREGATIONS.sum}
    });

    const byRegion = Object.fromEntries(
      result.data.rows.map(row => [row[0] === null ? 'null' : String(row[0]), row])
    );
    expect(result.data.rows).toHaveLength(3);
    expect(byRegion.null).toEqual([null, 3]);
    expect(byRegion.__null__).toEqual(['__null__', 30]);
    expect(byRegion.west).toEqual(['west', 3]);
  });

  test('groupByDataset merges geojson geometries so the result stays mappable', () => {
    const dataset = makeTable({
      id: 'shapes',
      fields: [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'geom', type: ALL_FIELD_TYPES.geojson}
      ],
      rows: [
        ['west', square(-10, -10, 0, 0)],
        ['west', square(0, 0, 10, 10)],
        ['east', square(20, -10, 40, 10)]
      ]
    });

    const result = groupByDataset(dataset, {
      fieldName: 'region',
      aggregations: {geom: DATASET_OPS_AGGREGATIONS.merge}
    });

    expect(result.data.fields.map(field => ({name: field.name, type: field.type}))).toEqual([
      {name: 'region', type: ALL_FIELD_TYPES.string},
      {name: 'geom_merge', type: ALL_FIELD_TYPES.geojson}
    ]);
    const byRegion = Object.fromEntries(result.data.rows.map(row => [row[0], row[1]]));
    expect(byRegion.west.geometry.type).toBe('MultiPolygon');
    expect(byRegion.west.geometry.coordinates).toHaveLength(2);
    expect(byRegion.east.geometry.type).toBe('Polygon');
  });

  test('joinDatasets supports LEFT, INNER, and FULL with null keys', () => {
    const left = makeTable({
      id: 'orders',
      fields: [
        {name: 'id', type: ALL_FIELD_TYPES.string},
        {name: 'city', type: ALL_FIELD_TYPES.string}
      ],
      rows: [
        ['1', 'sf'],
        ['2', null],
        ['3', 'nyc']
      ]
    });
    const right = makeTable({
      id: 'cities',
      fields: [
        {name: 'city', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        ['sf', 100],
        ['la', 50]
      ]
    });

    const leftJoin = joinDatasets(left, right, {
      leftField: 'city',
      rightField: 'city',
      type: 'LEFT',
      resultId: 'left-join'
    });
    expect(leftJoin.data.rows).toHaveLength(3);
    expect(leftJoin.data.rows[0][3]).toBe(100);
    expect(leftJoin.data.rows[1][3]).toBeNull();
    expect(leftJoin.data.rows[2][3]).toBeNull();

    const innerJoin = joinDatasets(left, right, {
      leftField: 'city',
      rightField: 'city',
      type: 'INNER'
    });
    expect(innerJoin.data.rows).toHaveLength(1);
    expect(innerJoin.data.rows[0][0]).toBe('1');

    const fullJoin = joinDatasets(left, right, {
      leftField: 'city',
      rightField: 'city',
      type: 'FULL'
    });
    expect(fullJoin.data.rows).toHaveLength(4);
    expect(fullJoin.data.rows.some(row => row[0] === null && row[3] === 50)).toBe(true);
    expect(fullJoin.metadata.derivedDataset.type).toBe('join');
    expect(fullJoin.metadata.derivedDataset.sourceDataIds).toEqual(['orders', 'cities']);
  });

  test('joinDatasets leftColumns and rightColumns omit unselected fields', () => {
    const left = makeTable({
      id: 'orders',
      fields: [
        {name: 'id', type: ALL_FIELD_TYPES.string},
        {name: 'city', type: ALL_FIELD_TYPES.string}
      ],
      rows: [['1', 'sf']]
    });
    const right = makeTable({
      id: 'cities',
      fields: [
        {name: 'city', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [['sf', 100]]
    });

    const result = joinDatasets(left, right, {
      leftField: 'city',
      rightField: 'city',
      type: 'LEFT',
      leftColumns: ['city'],
      rightColumns: []
    });
    expect(result.data.fields.map(field => field.name)).toEqual(['city']);
    expect(result.data.rows[0]).toEqual(['sf']);
  });

  test('spatialJoinDatasets joins points contained by polygons', () => {
    const polygons = makeTable({
      id: 'polys',
      fields: [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'geom', type: ALL_FIELD_TYPES.geojson}
      ],
      rows: [
        ['west', square(-10, -10, 10, 10)],
        ['east', square(20, -10, 40, 10)]
      ]
    });
    const points = makeTable({
      id: 'pts',
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [0, 0, 10],
        [0, 30, 5],
        [50, 50, 99]
      ]
    });

    const result = spatialJoinDatasets(polygons, points, {
      leftGeo: {kind: 'geojson', fieldName: 'geom'},
      rightGeo: {kind: 'latlng', latField: 'lat', lngField: 'lng'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
      resultId: 'pip'
    });

    expect(result.data.rows).toHaveLength(2);
    expect(result.data.rows[0][2]).toBe(1);
    expect(result.data.rows[0][3]).toBe(10);
    expect(result.data.rows[1][2]).toBe(1);
    expect(result.data.rows[1][3]).toBe(5);
    expect(result.metadata.derivedDataset.type).toBe('spatialJoin');
  });

  test('spatialJoinDatasets leftColumns omits unselected attributes and keeps geometry', () => {
    const polygons = makeTable({
      id: 'polys',
      fields: [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'geom', type: ALL_FIELD_TYPES.geojson}
      ],
      rows: [['west', square(-10, -10, 10, 10)]]
    });
    const points = makeTable({
      id: 'pts',
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [[0, 0, 10]]
    });

    const result = spatialJoinDatasets(polygons, points, {
      leftGeo: {kind: 'geojson', fieldName: 'geom'},
      rightGeo: {kind: 'latlng', latField: 'lat', lngField: 'lng'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
      leftColumns: []
    });

    expect(result.data.fields.map(field => field.name)).toEqual(['geom', 'count', 'value_sum']);
    expect(result.data.rows[0]).toHaveLength(3);
  });

  test('spatialJoinDatasets joins points contained by H3 cells', () => {
    const cell = latLngToCell(37.77, -122.42, 8);
    const hexes = makeTable({
      id: 'hexes',
      fields: [
        {name: 'hex', type: ALL_FIELD_TYPES.h3},
        {name: 'label', type: ALL_FIELD_TYPES.string}
      ],
      rows: [[cell, 'sf']]
    });
    const points = makeTable({
      id: 'pts',
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [37.77, -122.42, 3],
        [0, 0, 1]
      ]
    });

    const result = spatialJoinDatasets(hexes, points, {
      leftGeo: {kind: 'h3', fieldName: 'hex'},
      rightGeo: {kind: 'latlng', latField: 'lat', lngField: 'lng'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum}
    });

    expect(result.data.rows[0][2]).toBe(1);
    expect(result.data.rows[0][3]).toBe(3);
  });

  test('spatialJoinDatasets joins polygons contained by the left polygon', () => {
    const left = makeTable({
      id: 'outer',
      fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
      rows: [[square(-10, -10, 10, 10)]]
    });
    const right = makeTable({
      id: 'inner',
      fields: [
        {name: 'geom', type: ALL_FIELD_TYPES.geojson},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [square(-1, -1, 1, 1), 4],
        [square(40, 40, 50, 50), 8]
      ]
    });

    const result = spatialJoinDatasets(left, right, {
      leftGeo: {kind: 'geojson', fieldName: 'geom'},
      rightGeo: {kind: 'geojson', fieldName: 'geom'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum}
    });

    expect(result.data.rows[0][1]).toBe(1);
    expect(result.data.rows[0][2]).toBe(4);
  });

  test('spatialJoinDatasets intersects overlapping polygons and not disjoint ones', () => {
    const left = makeTable({
      id: 'left',
      fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
      rows: [[square(-10, -10, 10, 10)]]
    });
    const right = makeTable({
      id: 'right',
      fields: [
        {name: 'geom', type: ALL_FIELD_TYPES.geojson},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [square(0, 0, 20, 20), 3],
        [square(40, 40, 50, 50), 9]
      ]
    });

    const result = spatialJoinDatasets(left, right, {
      leftGeo: {kind: 'geojson', fieldName: 'geom'},
      rightGeo: {kind: 'geojson', fieldName: 'geom'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
      predicate: 'intersects'
    });

    expect(result.data.rows[0][1]).toBe(1);
    expect(result.data.rows[0][2]).toBe(3);
  });

  test('spatialJoinDatasets within matches when the target is inside the join geometry', () => {
    const inner = makeTable({
      id: 'inner',
      fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
      rows: [[square(-1, -1, 1, 1)]]
    });
    const outer = makeTable({
      id: 'outer',
      fields: [
        {name: 'geom', type: ALL_FIELD_TYPES.geojson},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [[square(-10, -10, 10, 10), 7]]
    });

    const result = spatialJoinDatasets(inner, outer, {
      leftGeo: {kind: 'geojson', fieldName: 'geom'},
      rightGeo: {kind: 'geojson', fieldName: 'geom'},
      aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
      predicate: 'within'
    });

    expect(result.data.rows[0][1]).toBe(1);
    expect(result.data.rows[0][2]).toBe(7);
  });

  test.each(['within', 'intersects'] as const)(
    'spatialJoinDatasets %s excludes centroid-only polygon matches from aggregates',
    predicate => {
      const donut = square(-10, -10, 10, 10);
      donut.geometry.coordinates.push(square(-8, -8, 8, 8).geometry.coordinates[0]);
      const left = makeTable({
        id: 'target',
        fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
        rows: [[predicate === 'within' ? square(-10, -10, 10, 10) : square(-3, -3, 3, 3)]]
      });
      const right = makeTable({
        id: 'join',
        fields: [
          {name: 'geom', type: ALL_FIELD_TYPES.geojson},
          {name: 'value', type: ALL_FIELD_TYPES.integer}
        ],
        rows: [[predicate === 'within' ? square(-5, -5, 5, 5) : donut, 99]]
      });

      const result = spatialJoinDatasets(left, right, {
        leftGeo: {kind: 'geojson', fieldName: 'geom'},
        rightGeo: {kind: 'geojson', fieldName: 'geom'},
        aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
        predicate
      });

      expect(result.data.rows.map(row => row.slice(1))).toEqual([[0, null]]);
    }
  );

  describe('spatial join polygon predicates', () => {
    const outer = square(-10, -10, 10, 10);
    const donut = square(-10, -10, 10, 10);
    donut.geometry.coordinates.push(square(-8, -8, 8, 8).geometry.coordinates[0]);
    const multi = (...polygons: ReturnType<typeof square>[]) => ({
      type: 'MultiPolygon',
      coordinates: polygons.map(polygon => polygon.geometry.coordinates)
    });
    const islands = multi(square(-10, -10, -5, -5), square(5, 5, 10, 10));
    const concave = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [6, 0],
          [6, 6],
          [4, 6],
          [4, 2],
          [2, 2],
          [2, 6],
          [0, 6],
          [0, 0]
        ]
      ]
    };

    test.each([
      {name: 'equal polygons', target: outer, join: outer, within: true, intersects: true},
      {
        name: 'shared contained edge',
        target: square(-10, -10, 0, 0),
        join: outer,
        within: true,
        intersects: true
      },
      {
        name: 'edge contact',
        target: square(10, 0, 12, 2),
        join: outer,
        within: false,
        intersects: true
      },
      {
        name: 'vertex contact',
        target: square(10, 10, 12, 12),
        join: outer,
        within: false,
        intersects: true
      },
      {
        name: 'partial overlap',
        target: square(5, 5, 15, 15),
        join: outer,
        within: false,
        intersects: true
      },
      {
        name: 'disjoint bounds',
        target: square(20, 20, 30, 30),
        join: outer,
        within: false,
        intersects: false
      },
      {
        name: 'enclosed hole',
        target: square(-9, -9, 9, 9),
        join: donut,
        within: false,
        intersects: true
      },
      {name: 'equal donuts', target: donut, join: donut, within: true, intersects: true},
      {name: 'donut in solid polygon', target: donut, join: outer, within: true, intersects: true},
      {
        name: 'hole boundary contact',
        target: square(-8, -2, -6, 2),
        join: donut,
        within: false,
        intersects: true
      },
      {
        name: 'edge crosses concavity',
        target: square(1, 1, 5, 5),
        join: concave,
        within: false,
        intersects: true
      },
      {
        name: 'contained components',
        target: multi(square(-9, -9, -6, -6), square(6, 6, 9, 9)),
        join: islands,
        within: true,
        intersects: true
      },
      {
        name: 'one outside component',
        target: multi(square(-9, -9, -6, -6), square(20, 20, 21, 21)),
        join: islands,
        within: false,
        intersects: true
      },
      {
        name: 'between components',
        target: square(-1, -1, 1, 1),
        join: islands,
        within: false,
        intersects: false
      },
      {name: 'point inside', target: [0, 0], join: outer, within: true, intersects: true},
      {name: 'point on boundary', target: [10, 0], join: outer, within: false, intersects: true},
      {name: 'point in hole', target: [0, 0], join: donut, within: false, intersects: false}
    ])('$name preserves count, sum and average', ({target, join, within, intersects}) => {
      const left = makeTable({
        id: 'target',
        fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
        rows: [[target]]
      });
      const right = makeTable({
        id: 'join',
        fields: [
          {name: 'geom', type: ALL_FIELD_TYPES.geojson},
          {name: 'value', type: ALL_FIELD_TYPES.integer},
          {name: 'score', type: ALL_FIELD_TYPES.integer}
        ],
        rows: [
          [join, 10, 10],
          [join, 20, 20],
          [square(60, 60, 70, 70), 999, 999]
        ]
      });
      for (const predicate of ['within', 'intersects'] as const) {
        const result = spatialJoinDatasets(left, right, {
          leftGeo: {kind: 'geojson', fieldName: 'geom'},
          rightGeo: {kind: 'geojson', fieldName: 'geom'},
          aggregations: {
            value: DATASET_OPS_AGGREGATIONS.sum,
            score: DATASET_OPS_AGGREGATIONS.average
          },
          predicate
        });
        const matches = predicate === 'within' ? within : intersects;
        expect(result.data.rows[0].slice(1)).toEqual(matches ? [2, 30, 15] : [0, null, null]);
      }
    });

    test.each([
      null,
      'invalid json',
      {type: 'Feature', geometry: null, properties: {}},
      {type: 'Polygon', coordinates: []},
      {type: 'Polygon', coordinates: [[]]},
      {type: 'MultiPolygon', coordinates: []},
      {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [0, 1]
          ]
        ]
      },
      {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
          ]
        ]
      },
      {type: 'Feature', geometry: {type: 'Polygon', coordinates: null}, properties: {}},
      {
        type: 'Polygon',
        coordinates: [
          [
            [NaN, 0],
            [1, 0],
            [0, 1],
            [NaN, 0]
          ]
        ]
      }
    ])('ignores missing, empty or malformed polygon geometry: %j', invalid => {
      const left = makeTable({
        id: 'target',
        fields: [{name: 'geom', type: ALL_FIELD_TYPES.geojson}],
        rows: [[invalid], [outer]]
      });
      const right = makeTable({
        id: 'join',
        fields: [
          {name: 'geom', type: ALL_FIELD_TYPES.geojson},
          {name: 'value', type: ALL_FIELD_TYPES.integer}
        ],
        rows: [
          [invalid, 99],
          [outer, 7]
        ]
      });
      for (const predicate of ['within', 'intersects'] as const) {
        const result = spatialJoinDatasets(left, right, {
          leftGeo: {kind: 'geojson', fieldName: 'geom'},
          rightGeo: {kind: 'geojson', fieldName: 'geom'},
          aggregations: {value: DATASET_OPS_AGGREGATIONS.sum},
          predicate
        });
        expect(result.data.rows.map(row => row.slice(1))).toEqual([
          [0, null],
          [1, 7]
        ]);
      }
    });
  });

  test('isTabularDatasetForOps skips tiles and disabled datasets', () => {
    expect(isTabularDatasetForOps({type: 'local'})).toBe(true);
    expect(isTabularDatasetForOps({type: ''})).toBe(true);
    expect(isTabularDatasetForOps({type: 'externally-hosted'})).toBe(true);
    expect(isTabularDatasetForOps({type: 'vector-tile'})).toBe(false);
    expect(isTabularDatasetForOps({type: 'local', disableDataOperation: true})).toBe(false);

    expect(canMutateDatasetSchema({type: 'local'})).toBe(true);
    expect(canMutateDatasetSchema({type: ''})).toBe(true);
    expect(canMutateDatasetSchema({type: 'externally-hosted'})).toBe(false);
    expect(canMutateDatasetSchema({type: 'vector-tile'})).toBe(false);
    expect(canMutateDatasetSchema({type: 'local', disableDataOperation: true})).toBe(false);
  });

  test('aggregation options depend on field type', () => {
    const ids = (type: string) => aggregationOptionsForField({type}).map(option => option.id);

    expect(ids(ALL_FIELD_TYPES.integer)).toEqual([
      'count',
      'sum',
      'average',
      'maximum',
      'minimum',
      'median',
      'countUnique'
    ]);
    expect(ids(ALL_FIELD_TYPES.boolean)).toEqual(['count', 'sum', 'average', 'countUnique']);
    expect(ids(ALL_FIELD_TYPES.string)).toEqual(['count', 'countUnique']);
    expect(ids(ALL_FIELD_TYPES.timestamp)).toEqual(['count', 'maximum', 'minimum', 'countUnique']);
    expect(ids(ALL_FIELD_TYPES.geojson)).toEqual(['merge', 'count', 'countUnique']);
    expect(isDatasetOpsAggregationField({type: ALL_FIELD_TYPES.real})).toBe(true);
    expect(isDatasetOpsAggregationField({type: ALL_FIELD_TYPES.boolean})).toBe(true);
    expect(isDatasetOpsAggregationField({type: ALL_FIELD_TYPES.geojson})).toBe(true);
    expect(
      defaultAggregationsForFields([{name: 'geom', type: ALL_FIELD_TYPES.geojson} as any])
    ).toEqual({geom: 'merge'});
  });
});

describe('suitability engine', () => {
  const sites = () =>
    makeTable({
      id: 'sites',
      fields: [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'access', type: ALL_FIELD_TYPES.integer},
        {name: 'cost', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        ['a', 0, 100],
        ['b', 5, 200],
        ['c', 10, 300]
      ]
    });

  test('scores rows as a normalized weighted sum of range-standardized columns', () => {
    const result = suitabilityDataset(sites(), {
      weights: {access: 1, cost: 1},
      resultId: 'sites-score',
      operationId: 'su-1'
    });

    expect(result.info.id).toBe('sites-score');
    expect(result.metadata.derivedDataset).toEqual({
      type: 'suitability',
      sourceDataIds: ['sites'],
      operationId: 'su-1'
    });
    // source columns are kept, score is appended last as a real column
    expect(result.data.fields.map(field => field.name)).toEqual([
      'name',
      'access',
      'cost',
      'score'
    ]);
    expect(result.data.fields[3].type).toBe(ALL_FIELD_TYPES.real);
    // both columns span their full range, so normalized weights put scores on 0..1
    expect(result.data.rows.map(row => row[3])).toEqual([0, 0.5, 1]);
  });

  test('raw weights skip normalization', () => {
    const result = suitabilityDataset(sites(), {
      weights: {access: 1, cost: 1},
      weightStandardization: 'raw'
    });

    expect(result.data.rows.map(row => row[3])).toEqual([0, 1, 2]);
  });

  test('z-score standardization divides by the standard deviation', () => {
    const result = suitabilityDataset(sites(), {
      weights: {access: 1},
      weightStandardization: 'raw',
      dataStandardization: 'zScore'
    });

    const deviation = Math.sqrt(((0 - 5) ** 2 + (5 - 5) ** 2 + (10 - 5) ** 2) / 3);
    expect(result.data.rows.map(row => row[3])).toEqual([-5 / deviation, 0, 5 / deviation]);
  });

  test('raw data standardization leaves values untouched', () => {
    const result = suitabilityDataset(sites(), {
      weights: {access: 2},
      weightStandardization: 'raw',
      dataStandardization: 'raw'
    });

    expect(result.data.rows.map(row => row[3])).toEqual([0, 10, 20]);
  });

  test('a constant column falls back to its raw values', () => {
    const dataset = makeTable({
      id: 'flat',
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[3], [3]]
    });

    const result = suitabilityDataset(dataset, {
      weights: {value: 1},
      weightStandardization: 'raw'
    });

    expect(result.data.rows.map(row => row[1])).toEqual([3, 3]);
  });

  test('rows missing a weighted value score null', () => {
    const dataset = makeTable({
      id: 'gaps',
      fields: [
        {name: 'a', type: ALL_FIELD_TYPES.integer},
        {name: 'b', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [0, 1],
        [null, 2],
        [10, 3]
      ]
    });

    const result = suitabilityDataset(dataset, {weights: {a: 1, b: 1}});
    expect(result.data.rows[1][2]).toBeNull();
    expect(result.data.rows[0][2]).not.toBeNull();
  });

  test('columns restricts the copied source columns and renames a clashing score column', () => {
    const dataset = makeTable({
      id: 'clash',
      fields: [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'score', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        ['a', 1],
        ['b', 2]
      ]
    });

    const result = suitabilityDataset(dataset, {
      weights: {score: 1},
      columns: ['score']
    });

    expect(result.data.fields.map(field => field.name)).toEqual(['score', 'score_1']);
    expect(result.data.rows[0]).toEqual([1, 0]);
  });

  test('rejects empty, unknown, and non-numeric weight fields', () => {
    expect(() => suitabilityDataset(sites(), {weights: {}})).toThrow(
      'Select at least one field to score'
    );
    expect(() => suitabilityDataset(sites(), {weights: {nope: 1}})).toThrow(
      'Suitability field "nope" was not found'
    );
    expect(() => suitabilityDataset(sites(), {weights: {name: 1}})).toThrow(
      'Suitability field "name" is not numeric'
    );
  });

  test('only numeric fields can be weighted', () => {
    expect(isSuitabilityWeightField({type: ALL_FIELD_TYPES.real})).toBe(true);
    expect(isSuitabilityWeightField({type: ALL_FIELD_TYPES.integer})).toBe(true);
    expect(isSuitabilityWeightField({type: ALL_FIELD_TYPES.boolean})).toBe(false);
    expect(isSuitabilityWeightField({type: ALL_FIELD_TYPES.string})).toBe(false);
    expect(defaultSuitabilityWeights(sites().fields)).toEqual({access: 1, cost: 1});
  });
});
