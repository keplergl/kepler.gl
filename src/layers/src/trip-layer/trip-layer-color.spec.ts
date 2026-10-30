// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import TripLayer from './trip-layer';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES, DEFAULT_TEXT_LABEL, SCALE_TYPES} from '@kepler.gl/constants';

/**
 * Build a small taxi-trip table: 3 trips (2 points each) across 3 companies.
 * Rows are grouped by trip id so that feature index != row index — the first
 * trip occupies rows 0-1, so reading the color field by feature index would
 * return the first trip's company for the first two features.
 */
async function makeTripTable(rows?: any[][]) {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: rows ?? [
        // trip 1 (Uber): 2 points
        ['t1', 37.77, -122.42, '2024-01-01 00:00:00', 'Uber'],
        ['t1', 37.78, -122.41, '2024-01-01 00:00:10', 'Uber'],
        // trip 2 (Lyft): 2 points
        ['t2', 37.79, -122.4, '2024-01-01 00:00:20', 'Lyft'],
        ['t2', 37.8, -122.39, '2024-01-01 00:00:30', 'Lyft'],
        // trip 3 (Waymo): 2 points
        ['t3', 37.81, -122.38, '2024-01-01 00:00:40', 'Waymo'],
        ['t3', 37.82, -122.37, '2024-01-01 00:00:50', 'Waymo']
      ],
      fields: [
        {name: 'id', type: ALL_FIELD_TYPES.string},
        {name: 'latitude', type: ALL_FIELD_TYPES.real},
        {name: 'longitude', type: ALL_FIELD_TYPES.real},
        {name: 'timestamp', type: ALL_FIELD_TYPES.timestamp},
        {name: 'company', type: ALL_FIELD_TYPES.string}
      ]
    } as any
  });
  return table;
}

function makeTripLayer(table: KeplerTable) {
  const layer = new TripLayer({
    id: 'trip1',
    dataId: table.id,
    columnMode: 'table',
    columns: {
      id: {value: 'id', fieldIdx: table.fields.findIndex(f => f.name === 'id')},
      lat: {value: 'latitude', fieldIdx: table.fields.findIndex(f => f.name === 'latitude')},
      lng: {value: 'longitude', fieldIdx: table.fields.findIndex(f => f.name === 'longitude')},
      timestamp: {
        value: 'timestamp',
        fieldIdx: table.fields.findIndex(f => f.name === 'timestamp')
      },
      geojson: {value: null, fieldIdx: -1}
    }
  } as any);

  const companyField = table.fields.find(f => f.name === 'company')!;
  layer.updateLayerConfig({
    colorField: companyField,
    colorScale: SCALE_TYPES.customOrdinal,
    colorDomain: ['Uber', 'Lyft', 'Waymo'],
    visConfig: {
      ...layer.config.visConfig,
      colorRange: {
        name: 'custom',
        type: 'customOrdinal',
        category: 'Custom',
        colors: ['#000000', '#FF00BF', '#00A86B', '#E82127'],
        colorMap: [
          ['Lyft', '#000000'],
          ['Tesla', '#FF00BF'],
          ['Uber', '#00A86B'],
          ['Waymo', '#E82127']
        ]
      }
    }
  });
  return layer;
}

describe('TripLayer stroke width slider', () => {
  it('maps 0–1 onto the first 20% of the track at 0.01 steps', () => {
    const layer = new TripLayer({id: 'trip_stroke'});
    expect(layer.visConfigSettings.thickness).toMatchObject({
      step: 0.01,
      range: [0, 100],
      focusRange: [0, 1],
      focusWeight: 0.2
    });
  });
});

describe('TripLayer TABLE mode color by field', () => {
  it('getColor accessor maps each trip to its own company color', async () => {
    const table = await makeTripTable();
    const layer = makeTripLayer(table);

    layer.updateLayerMeta(table);
    const layerData = layer.formatLayerData({[table.id]: table}, null);

    // Each feature is a trip; getColor should return the trip's company color,
    // not the company of the row at the feature index.
    const colors = layerData.data.map(f => layerData.getColor(f));
    // Uber -> green [0,168,107], Lyft -> black [0,0,0], Waymo -> red [232,33,39]
    expect(colors[0]).toEqual([0, 168, 107]);
    expect(colors[1]).toEqual([0, 0, 0]);
    expect(colors[2]).toEqual([232, 33, 39]);
  });
});

describe('TripLayer text label collision', () => {
  test('renders moving labels with collision off, on, and off again', async () => {
    const table = await makeTripTable();
    const layer = makeTripLayer(table);
    const field = table.fields[4];
    let previousData = null;

    for (const collisionEnabled of [false, true, false]) {
      layer.updateLayerConfig({textLabel: [{...DEFAULT_TEXT_LABEL, field, collisionEnabled}]});
      const data = layer.formatLayerData({[table.id]: table}, previousData);
      const domain = layer.config.animation.domain;
      if (!domain) {
        throw new Error('Trip data should provide an animation domain');
      }
      const [trail, text] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 10, latitude: 37.77, longitude: -122.42},
        animationConfig: {domain, currentTime: domain[0] + 5000},
        visible: true,
        layerCallbacks: {},
        idx: 0
      });
      expect(text.props.getText(data.data[0])).toBe('Uber');
      expect(text.props.getPosition(data.data[0])[0]).toBeCloseTo(-122.415);
      expect(text.props.getPosition(data.data[0])[1]).toBeCloseTo(37.775);
      expect(text.props.extensions).toHaveLength(collisionEnabled ? 1 : 0);
      expect(text.props.extensions.map(extension => extension.constructor.extensionName)).toEqual(
        collisionEnabled ? ['CollisionFilterExtension'] : []
      );
      expect(trail.props.extensions.map(extension => extension.constructor.extensionName)).toEqual([
        'DataFilterExtension'
      ]);
      previousData = data;
    }
  });
});

describe('TripLayer TABLE mode grouping', () => {
  test.each([
    {
      name: 'month/day dates crossing a year',
      times: ['01/01/2024 00:00:00', '12/31/2023 23:59:50'],
      expected: [Date.UTC(2023, 11, 31, 23, 59, 50), Date.UTC(2024, 0, 1)]
    },
    {
      name: 'ISO dates with timezone offsets',
      times: ['2024-01-01T00:00:00+00:00', '2024-01-01T00:59:50+01:00'],
      expected: [Date.UTC(2023, 11, 31, 23, 59, 50), Date.UTC(2024, 0, 1)]
    },
    {
      name: 'numeric Unix milliseconds',
      times: [1704067200000, 1704067190000],
      expected: [1704067190000, 1704067200000]
    },
    {
      name: 'numeric Unix seconds',
      times: [1704067200, 1704067190],
      expected: [1704067190000, 1704067200000]
    }
  ])('orders $name chronologically while retaining row alignment', async ({times, expected}) => {
    const rows = [
      ['t1', 20, 10, times[0], 'Uber'],
      ['t1', 21, 11, times[1], 'Lyft'],
      ['t1', 22, 12, times[0], 'Waymo']
    ];
    const table = await makeTripTable(rows);
    const layer = makeTripLayer(table);
    layer.updateLayerMeta(table);
    const feature = layer.dataToFeature[0] as any;

    expect(layer.dataToTimeStamp[0]).toEqual([expected[0], expected[1], expected[1]]);
    expect(layer.config.animation.domain).toEqual(expected);
    expect(feature.geometry.coordinates.map(coord => coord.slice(0, 2))).toEqual([
      [11, 21],
      [10, 20],
      [12, 22]
    ]);
    expect(feature.geometry.coordinates.map(coord => coord[3])).toEqual([
      times[1],
      times[0],
      times[0]
    ]);
    expect(feature.properties.values).toEqual([rows[1], rows[0], rows[2]]);
    expect(feature.geometry.coordinates.map(coord => coord.datumIndex)).toEqual([1, 0, 2]);
  });

  test.each(['constructor', '__proto__', 'toString'])(
    'groups the valid trip ID %s without consulting inherited object properties',
    async id => {
      const rows = [
        [id, 20, 10, '2024-01-01 00:00:10', 'Uber'],
        ['ordinary', 40, 30, '2024-01-01 00:00:00', 'Lyft'],
        [id, 21, 11, '2024-01-01 00:00:00', 'Uber']
      ];
      const table = await makeTripTable(rows);
      const layer = makeTripLayer(table);
      layer.updateLayerMeta(table);

      expect(layer.dataToFeature).toHaveLength(2);
      expect(layer.dataToFeature.map((feature: any) => feature.properties.values)).toEqual([
        [rows[2], rows[0]],
        [rows[1]]
      ]);
    }
  );

  test('preserves ID coercion and ordering, skips missing IDs and required timestamps', async () => {
    const time = '2024-01-01 00:00:00';
    const rows = [
      ['10', 20, 10, time, 'Uber'],
      [2, 20, 11, time, 'Uber'],
      ['2', 20, 12, time, 'Uber'],
      ['', 20, 13, time, 'Uber'],
      ['ordinary', 20, 14, time, 'Uber'],
      [null, 20, 15, time, 'Uber'],
      [undefined, 20, 16, time, 'Uber'],
      ['ordinary', 20, 17, null, 'Uber'],
      ['ordinary', 20, 18, undefined, 'Uber'],
      ['ordinary', 20, 19, '', 'Uber'],
      ['ordinary', 20, 20, 0, 'Uber'],
      ['ordinary', null, 21, time, 'Uber'],
      ['ordinary', 20, null, time, 'Uber']
    ];
    const table = await makeTripTable(rows);
    const layer = makeTripLayer(table);
    layer.updateLayerMeta(table);

    expect(layer.dataToFeature.map((feature: any) => feature.properties.values)).toEqual([
      [rows[1], rows[2]],
      [rows[0]],
      [rows[3]],
      [rows[4]]
    ]);
  });
});
