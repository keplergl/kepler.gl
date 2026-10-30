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
async function makeTripTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
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

// The discarded middle vertex bends east; the retained trail runs due north.
async function makeFilteredModelTrip() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        ['removed', 0, 50, '2024-01-01 00:00:00', 'Uber', 0, 45],
        ['trip', 0, 0, '2024-01-01 00:00:00', 'Uber', 0, 45],
        ['trip', 10, 0, '2024-01-01 00:00:10', 'Lyft', 0, 30],
        ['trip', 15, 10, '2024-01-01 00:00:15', 'Uber', 0, 45],
        ['trip', 20, 0, '2024-01-01 00:00:20', 'Waymo', 0, 60]
      ],
      fields: [
        {name: 'id', type: ALL_FIELD_TYPES.string},
        {name: 'latitude', type: ALL_FIELD_TYPES.real},
        {name: 'longitude', type: ALL_FIELD_TYPES.real},
        {name: 'timestamp', type: ALL_FIELD_TYPES.timestamp},
        {name: 'company', type: ALL_FIELD_TYPES.string},
        {name: 'altitude', type: ALL_FIELD_TYPES.real},
        {name: 'heading', type: ALL_FIELD_TYPES.real}
      ]
    } as any
  });
  const layer = makeTripLayer(table);
  layer.updateLayerConfig({
    columns: {...layer.config.columns, altitude: {value: 'altitude', fieldIdx: 5}}
  });
  layer.updateLayerConfig({textLabel: [{...DEFAULT_TEXT_LABEL, field: table.fields[4]}]});
  layer.updateLayerVisConfig({
    scenegraphEnabled: true,
    scenegraph: 'custom',
    scenegraphCustomModelUrl: 'https://example.com/model.glb',
    scenegraphColorEnabled: true,
    scenegraphUseTrailColor: true
  });
  return {table, layer};
}

describe('TripLayer models follow filtered vertices', () => {
  test('positions, headings, labels, hover rows and vertex colors share the retained trajectory', async () => {
    const {table, layer} = await makeFilteredModelTrip();
    table.filteredIndex = [2, 4];
    const data = layer.formatLayerData({[table.id]: table}, null);
    const feature = data.data[0];
    expect(feature.properties.index).toBe(1);
    expect(data.getPath(feature).map(c => c.slice(0, 2))).toEqual([
      [0, 10],
      [0, 20]
    ]);
    const start = Date.UTC(2024, 0, 1);
    for (const seconds of [15, 10, 20]) {
      const animationConfig = {
        domain: layer.config.animation.domain,
        currentTime: start + seconds * 1000
      };
      const [, model, label] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 4, latitude: 0, longitude: 0},
        animationConfig,
        visible: true,
        layerCallbacks: {},
        idx: 0
      });
      expect(model.props.getPosition(feature)).toEqual([0, seconds, 0]);
      expect(label.props.getPosition(feature)).toEqual([0, seconds, 0]);
      expect(label.props.getText(feature)).toBe('Waymo');
      expect(
        layer.getHoverData(feature, table.dataContainer, table.fields, animationConfig)
      ).toEqual(table.dataContainer.rowAsArray(4));
      // Both retained vertices head north. Removing the eastward vertex must also remove its yaw.
      const matrix = model.props.getTransformMatrix(feature);
      expect(Array.from(matrix).every(Number.isFinite)).toBe(true);
      expect(matrix[0]).toBeCloseTo(0);
      // Also retain the supported per-vertex color accessor behavior.
      const getColor = layer._getColorGetter(
        {
          getColor: () => [
            [10, 20, 30],
            [40, 50, 60]
          ]
        },
        animationConfig
      );
      if (typeof getColor !== 'function') {
        throw new Error('Expected a per-vertex color accessor');
      }
      expect(getColor(feature)).toEqual([40, 50, 60]);
    }
    for (const seconds of [0, 9, 21]) {
      const animationConfig = {
        domain: layer.config.animation.domain,
        currentTime: start + seconds * 1000
      };
      const [, model] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 4, latitude: 0, longitude: 0},
        animationConfig
      });
      expect(model.props.getPosition(feature)).toEqual([0, 0, -Number.MAX_VALUE]);
    }
  });

  test.each([[[4]], [[]], [[0, 1, 2, 3, 4]]])(
    'handles one, zero and all retained vertices (%j)',
    async indices => {
      const {table, layer} = await makeFilteredModelTrip();
      table.filteredIndex = indices;
      const data = layer.formatLayerData({[table.id]: table}, null);
      const animationConfig = {
        domain: layer.config.animation.domain,
        currentTime: Date.UTC(2024, 0, 1, 0, 0, 20)
      };
      const [, model] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 4, latitude: 0, longitude: 0},
        animationConfig
      });
      expect(data.data).toHaveLength(indices.length === 0 ? 0 : indices.length === 1 ? 1 : 2);
      if (indices.length) {
        const feature = data.data.find(f => f.properties.index === 1);
        expect(model.props.getPosition(feature)).toEqual([0, 20, 0]);
        expect(Array.from(model.props.getTransformMatrix(feature)).every(Number.isFinite)).toBe(
          true
        );
      }
    }
  );

  test.each([false, true])(
    'keeps the configured yaw for a single retained vertex (invert=%s)',
    async invertYaw => {
      const {table, layer} = await makeFilteredModelTrip();
      table.filteredIndex = [4];
      layer.config.yawField = table.fields[6];
      layer.updateLayerVisConfig({invertYaw});
      const data = layer.formatLayerData({[table.id]: table}, null);
      const [, model, label] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 4, latitude: 0, longitude: 0},
        animationConfig: {
          domain: layer.config.animation.domain,
          currentTime: Date.UTC(2024, 0, 1, 0, 0, 20)
        }
      });
      const feature = data.data[0];
      const matrix = model.props.getTransformMatrix(feature);
      expect((Math.atan2(matrix[1], matrix[0]) * 180) / Math.PI).toBeCloseTo(invertYaw ? 150 : 30);
      expect(model.props.getPosition(feature)).toEqual([0, 20, 0]);
      expect(label.props.getText(feature)).toBe('Waymo');
    }
  );

  test('reuses filtered timestamps across frames and refreshes them after filters or data change', async () => {
    const {table, layer} = await makeFilteredModelTrip();
    const start = Date.UTC(2024, 0, 1);
    table.filteredIndex = [2, 4];
    let data = layer.formatLayerData({[table.id]: table}, null);
    let feature = data.data[0];
    const firstTimes = data.getTimestamps(feature);
    expect(firstTimes).toEqual([start + 10000, start + 20000]);
    for (const seconds of [11, 15, 19]) {
      const [, model, label] = layer.renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {zoom: 4, latitude: 0, longitude: 0},
        animationConfig: {
          domain: layer.config.animation.domain,
          currentTime: start + seconds * 1000
        }
      });
      expect(model.props.getPosition(feature)).toEqual([0, seconds, 0]);
      expect(label.props.getText(feature)).toBe('Waymo');
      expect(Array.from(model.props.getTransformMatrix(feature)).every(Number.isFinite)).toBe(true);
      expect(data.getTimestamps(feature)).toBe(firstTimes);
    }

    table.filteredIndex = [3, 4];
    data = layer.formatLayerData({[table.id]: table}, data);
    feature = data.data[0];
    const nextTimes = data.getTimestamps(feature);
    expect(nextTimes).toEqual([start + 15000, start + 20000]);
    expect(nextTimes).not.toBe(firstTimes);

    const rows = Array.from({length: table.dataContainer.numRows()}, (_, i) => [
      ...table.dataContainer.rowAsArray(i)
    ]);
    rows[3][3] = '2024-01-01 00:00:30';
    rows[4][3] = '2024-01-01 00:00:40';
    await table.update({rows, fields: table.fields});
    table.filteredIndex = [3, 4];
    data = layer.formatLayerData({[table.id]: table}, data);
    feature = data.data[0];
    expect(data.getTimestamps(feature)).toEqual([start + 30000, start + 40000]);
    expect(data.getTimestamps(feature)).not.toBe(nextTimes);
    const [, model] = layer.renderLayer({
      data,
      gpuFilter: table.gpuFilter,
      mapState: {zoom: 4, latitude: 0, longitude: 0},
      animationConfig: {domain: layer.config.animation.domain, currentTime: start + 35000}
    });
    expect(model.props.getPosition(feature)).toEqual([5, 17.5, 0]);

    table.filteredIndex = [];
    data = layer.formatLayerData({[table.id]: table}, data);
    expect(data.data).toEqual([]);
    table.filteredIndex = [2, 4];
    data = layer.formatLayerData({[table.id]: table}, data);
    expect(data.getTimestamps(data.data[0])).toEqual([start + 10000, start + 40000]);
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
