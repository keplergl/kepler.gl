// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GeoJsonLayer, {GeoJsonLayerConfig, getTextLabelPosition} from './geojson-layer';
import {ALL_FIELD_TYPES, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {valueToPosition} from '@kepler.gl/utils';
import {KeplerTable, copyTableAndUpdate} from '@kepler.gl/table';
import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';
import {Response} from 'node-fetch';
import {
  processCsvData,
  processFileData,
  processGeojson,
  processRowObject
} from '@kepler.gl/processors';
import {convertGeometryToWKB} from '@loaders.gl/gis';

const point = (x: number) => ({type: 'Point', coordinates: [x, x]});
const line = (x: number) => ({
  type: 'LineString',
  coordinates: [
    [x, x],
    [x + 0.25, x + 0.25]
  ]
});
const polygon = (x: number) => ({
  type: 'Polygon',
  coordinates: [
    [
      [x, x],
      [x + 0.25, x],
      [x + 0.25, x + 0.25],
      [x, x]
    ]
  ]
});

async function initializeGeoJsonLayer(
  features: Array<{geometry: Record<string, unknown>; properties: Record<string, unknown>}>,
  rowCount?: number
) {
  const dataset = new KeplerTable({
    info: {id: 'geojson-default-color'},
    color: [0, 0, 0]
  });
  const data = processGeojson({
    type: 'FeatureCollection',
    features: features.map(feature => ({type: 'Feature', ...feature}))
  } as any);
  if (!data) {
    throw new Error('Expected processed GeoJSON data');
  }
  await dataset.importData({data});

  const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);
  if (!props.length) {
    throw new Error('Expected GeoJSON layer props');
  }
  const layer = new GeoJsonLayer({...props[0], dataId: dataset.id});
  if (rowCount !== undefined) {
    // Cache geometry metadata before simulating a large dataset's row count.
    layer.updateLayerMeta(dataset);
    jest.spyOn(dataset.dataContainer, 'numRows').mockReturnValue(rowCount);
  }
  layer.setInitialLayerConfig(dataset);
  return {dataset, layer};
}

async function initializeGeoJsonColumnLayer(
  features: Array<{geometry: Record<string, unknown>; properties: Record<string, unknown>}>
) {
  const dataset = new KeplerTable({
    info: {id: 'geojson-column-default-color'},
    color: [0, 0, 0]
  });
  await dataset.importData({
    data: {
      fields: [
        {name: 'geometry', type: ALL_FIELD_TYPES.geojson, analyzerType: 'GEOMETRY'},
        {name: 'score', type: ALL_FIELD_TYPES.real}
      ],
      rows: features.map((feature, index) => [{type: 'Feature', ...feature}, index + 0.25])
    } as any
  });

  const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);
  if (!props.length) {
    throw new Error('Expected GeoJSON column layer props');
  }
  const layer = new GeoJsonLayer({...props[0], dataId: dataset.id});
  layer.setInitialLayerConfig(dataset);
  return {dataset, layer};
}

describe('GeoJsonLayer default layer discovery', () => {
  const createDataset = async (geometryCount: number) => {
    const dataset = new KeplerTable({
      info: {id: 'geojson-default-layers'},
      color: [0, 0, 0]
    });
    await dataset.importData({
      data: {
        fields: [
          {name: 'id', type: ALL_FIELD_TYPES.string},
          ...Array.from({length: geometryCount}, (_, index) => ({
            name: `geometry_${index}`,
            type: ALL_FIELD_TYPES.geojson,
            analyzerType: 'GEOMETRY'
          }))
        ],
        rows: [
          [
            'feature',
            ...Array.from({length: geometryCount}, (_, index) => ({
              type: 'Feature',
              geometry: polygon(index),
              properties: {}
            }))
          ]
        ]
      } as any
    });
    return dataset;
  };

  test.each([0, 1, 2, 4])(
    'creates at most two defaults for %i geometry columns in field order',
    async geometryCount => {
      const dataset = await createDataset(geometryCount);
      const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);

      expect(props.map(prop => prop.columns.geojson.value)).toEqual(
        Array.from({length: Math.min(geometryCount, 2)}, (_, index) => `geometry_${index}`)
      );
    }
  );

  test('allows a layer to use a geometry column beyond the automatic defaults', async () => {
    const dataset = await createDataset(4);
    const layer = new GeoJsonLayer({
      dataId: dataset.id,
      columns: {geojson: {value: 'geometry_3', fieldIdx: 4}}
    });

    layer.setInitialLayerConfig(dataset);

    expect(layer.config.columns.geojson.value).toBe('geometry_3');
    expect(layer.config.columns.geojson.fieldIdx).toBe(4);
    expect(layer.dataToFeature).toEqual([expect.objectContaining({geometry: polygon(3)})]);
  });
});

describe('GeoJsonLayer default color field', () => {
  test('keeps string and integer-only polygon data uniformly colored', async () => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: polygon(0), properties: {category: 'a', count: 1}},
      {geometry: polygon(1), properties: {category: 'b', count: 2}}
    ]);

    expect(layer.config.colorField).toBeNull();
    expect(layer.config.strokeColorField).toBeNull();
  });

  test.each([
    ['point', point],
    ['polygon', polygon]
  ])('selects an eligible real field for %s fill color', async (_name, geometry) => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: geometry(0), properties: {score: 0.25}},
      {geometry: geometry(1), properties: {score: 0.75}}
    ]);

    expect(layer.config.colorField?.name).toBe('score');
    expect(layer.config.colorDomain).toEqual([0.25, 0.75]);
    expect(layer.config.strokeColorField).toBeNull();
  });

  test.each([
    ['point', point, 'colorField', 'colorDomain'],
    ['polygon', polygon, 'colorField', 'colorDomain'],
    ['line', line, 'strokeColorField', 'strokeColorDomain']
  ] as const)(
    'skips constant real fields and selects the next preferred field for %s color',
    async (_name, geometry, field, domain) => {
      const {layer} = await initializeGeoJsonLayer([
        {
          geometry: geometry(0),
          properties: {score: 0.5, metric: 1.25, depth: 2.25, value: 0.25}
        },
        {
          geometry: geometry(1),
          properties: {score: 0.5, metric: 1.25, depth: 3.75, value: 0.75}
        }
      ]);

      expect(layer.config[field]?.name).toBe('value');
      expect(layer.config[domain]).toEqual([0.25, 0.75]);
    }
  );

  test.each([
    ['point', point],
    ['polygon', polygon],
    ['line', line]
  ] as const)(
    'keeps %s color uniform when all eligible real fields are constant',
    async (_name, geometry) => {
      const {layer} = await initializeGeoJsonLayer([
        {geometry: geometry(0), properties: {score: 0.5, metric: 1.25, count: 1}},
        {geometry: geometry(1), properties: {score: 0.5, metric: 1.25, count: 2}}
      ]);

      expect(layer.config.colorField).toBeNull();
      expect(layer.config.strokeColorField).toBeNull();
    }
  );

  test('ignores missing values when skipping a constant real field', async () => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: polygon(0), properties: {score: 0.5, value: 0.25}},
      {geometry: polygon(1), properties: {score: null, value: 0.75}},
      {geometry: polygon(2), properties: {score: 0.5, value: 1.25}}
    ]);

    expect(layer.config.colorField?.name).toBe('value');
    expect(layer.config.colorDomain).toEqual([0.25, 0.75, 1.25]);
  });

  test('keeps a single-feature dataset uniformly colored', async () => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: polygon(0), properties: {score: 0.5}}
    ]);

    expect(layer.config.colorField).toBeNull();
    expect(layer.config.strokeColorField).toBeNull();
  });

  test.each([
    {rowCount: 20_000, varyingColumn: 9, expected: 'score_9'},
    {rowCount: 300_000, varyingColumn: 2, expected: 'score_2'},
    {rowCount: 300_000, varyingColumn: 3, expected: null},
    {rowCount: 250_000, varyingColumn: 3, expected: 'score_3'},
    {rowCount: 250_001, varyingColumn: 3, expected: null},
    {rowCount: 1_000_000, varyingColumn: 0, expected: 'score_0'},
    {rowCount: 1_000_001, varyingColumn: 0, expected: null}
  ])(
    'limits candidate checks for $rowCount rows with varying column $varyingColumn',
    async ({rowCount, varyingColumn, expected}) => {
      const properties = Object.fromEntries(
        Array.from({length: 10}, (_, index) => [`score_${index}`, 0.5])
      );
      const {layer} = await initializeGeoJsonLayer(
        [
          {geometry: point(0), properties: {...properties, [`score_${varyingColumn}`]: 0.25}},
          {geometry: point(1), properties: {...properties, [`score_${varyingColumn}`]: 0.75}}
        ],
        rowCount
      );

      expect(layer.config.colorField?.name ?? null).toBe(expected);
      expect(layer.config.strokeColorField).toBeNull();
    }
  );

  describe.each([
    ['point', point],
    ['polygon', polygon],
    ['line', line]
  ] as const)('%s initialization after automatic color failure', (name, geometry) => {
    test.each(['field values', 'color domain'])(
      'continues with uniform color when reading %s throws',
      async failure => {
        const {dataset, layer} = await initializeGeoJsonLayer([
          {geometry: geometry(0), properties: {score: 0.25}},
          {geometry: geometry(1), properties: {score: 0.75}}
        ]);
        layer.updateLayerConfig<GeoJsonLayerConfig>({
          colorField: null,
          strokeColorField: null,
          colorDomain: [0, 1],
          strokeColorDomain: [0, 1]
        });
        layer.updateLayerVisConfig({filled: false, stroked: false});

        if (failure === 'field values') {
          const field = dataset.fields.find(candidate => candidate.name === 'score')!;
          jest.spyOn(field, 'valueAccessor').mockImplementation(() => {
            throw new Error('Cannot read field values');
          });
        } else {
          jest.spyOn(dataset, 'getColumnLayerDomain').mockImplementation(() => {
            throw new Error('Cannot calculate color domain');
          });
        }

        expect(() => layer.setInitialLayerConfig(dataset)).not.toThrow();
        expect(layer.config.colorField).toBeNull();
        expect(layer.config.strokeColorField).toBeNull();
        expect(layer.config.colorDomain).toEqual([0, 1]);
        expect(layer.config.strokeColorDomain).toEqual([0, 1]);
        expect(layer.config.visConfig).toMatchObject({
          filled: name !== 'line',
          stroked: name !== 'point'
        });
      }
    );
  });

  test('uses stroke color for line-only data', async () => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: line(0), properties: {score: 0.25}},
      {geometry: line(1), properties: {score: 0.75}}
    ]);

    expect(layer.config.colorField).toBeNull();
    expect(layer.config.strokeColorField?.name).toBe('score');
    expect(layer.config.strokeColorDomain).toEqual([0.25, 0.75]);
    expect(layer.config.visConfig.filled).toBe(false);
    expect(layer.config.visConfig.stroked).toBe(true);
  });

  test('uses fill color for mixed polygon and line data without changing outlines', async () => {
    const {layer} = await initializeGeoJsonLayer([
      {geometry: polygon(0), properties: {score: 0.25}},
      {geometry: line(1), properties: {score: 0.75}}
    ]);

    expect(layer.config.colorField?.name).toBe('score');
    expect(layer.config.strokeColorField).toBeNull();
  });

  test('preserves embedded fill and line colors', async () => {
    const {layer: pointLayer} = await initializeGeoJsonLayer([
      {geometry: point(0), properties: {score: 0.25, fillColor: [1, 2, 3]}},
      {geometry: point(1), properties: {score: 0.75, fillColor: [4, 5, 6]}}
    ]);
    const {layer: lineLayer} = await initializeGeoJsonLayer([
      {geometry: line(0), properties: {score: 0.25, lineColor: [1, 2, 3]}},
      {geometry: line(1), properties: {score: 0.75, lineColor: [4, 5, 6]}}
    ]);

    expect(pointLayer.config.colorField).toBeNull();
    expect(lineLayer.config.strokeColorField).toBeNull();
  });

  test('preserves embedded colors stored only inside a GeoJSON column', async () => {
    const {dataset, layer} = await initializeGeoJsonColumnLayer([
      {geometry: point(0), properties: {fillColor: [1, 2, 3]}},
      {geometry: point(1), properties: {fillColor: [4, 5, 6]}}
    ]);

    expect(dataset.fields.map(field => field.name)).toEqual(['geometry', 'score']);
    expect(layer.config.colorField).toBeNull();
  });

  test('selects a real stroke field for manually initialized table mode data', async () => {
    const dataset = new KeplerTable({
      info: {id: 'geojson-table-default-color'},
      color: [0, 0, 0]
    });
    await dataset.importData({
      data: {
        fields: [
          {name: 'id', type: ALL_FIELD_TYPES.string},
          {name: 'latitude', type: ALL_FIELD_TYPES.real},
          {name: 'longitude', type: ALL_FIELD_TYPES.real},
          {name: 'timestamp', type: ALL_FIELD_TYPES.timestamp},
          {name: 'score', type: ALL_FIELD_TYPES.real},
          {name: 'lineColor', type: ALL_FIELD_TYPES.string}
        ],
        rows: [
          ['trip', 0, 0, '2024-01-01 00:00:00', 0.25, '#ff0000'],
          ['trip', 1, 1, '2024-01-01 00:00:01', 0.75, '#00ff00']
        ]
      } as any
    });

    const layer = new GeoJsonLayer({id: 'geojson-table', dataId: dataset.id});
    layer.setInitialLayerConfig(dataset);

    expect(layer.config.columnMode).toBe('table');
    expect(layer.config.strokeColorField?.name).toBe('score');
  });
});

describe('GeoJsonLayer default deck parameters', () => {
  const gpuFilter = null as any;
  const layerCallbacks = {};

  const propsFor = (layer: GeoJsonLayer, mapState: Record<string, unknown>) =>
    layer.getDefaultDeckLayerProps({
      idx: 0,
      gpuFilter,
      mapState: mapState as any,
      layerCallbacks,
      visible: true
    }).parameters;

  test('flat layer in top view depth-tests but does not write depth', () => {
    const layer = new GeoJsonLayer({id: 'geojson_depth'});
    expect(propsFor(layer, {dragRotate: false})).toMatchObject({
      depthTest: true,
      depthMask: false
    });
  });

  test('extruded layer writes depth even in top view so it can occlude a flat plane', () => {
    const layer = new GeoJsonLayer({id: 'geojson_depth'});
    layer.config.visConfig.enable3d = true;
    expect(propsFor(layer, {dragRotate: false})).toMatchObject({
      depthTest: true,
      depthMask: true
    });
  });

  test('stroke width gives 0–1 the first 20% of the slider at 0.01 steps', () => {
    const thickness = LAYER_VIS_CONFIGS.thickness;
    const scale = {focusRange: [0, 1] as [number, number], focusWeight: 0.2};
    expect(thickness.step).toBe(0.01);
    expect(thickness.range).toEqual([0, 100]);
    expect(thickness.focusRange).toEqual(scale.focusRange);
    expect(thickness.focusWeight).toBe(scale.focusWeight);

    const [min, max] = thickness.range;
    expect(valueToPosition(0, min, max, scale)).toBe(0);
    expect(valueToPosition(1, min, max, scale)).toBeCloseTo(0.2);
    expect(valueToPosition(0.5, min, max, scale)).toBeCloseTo(0.1);

    const layer = new GeoJsonLayer({id: 'geojson_stroke'});
    expect(layer.visConfigSettings.thickness).toMatchObject({
      step: 0.01,
      focusRange: [0, 1],
      focusWeight: 0.2,
      defaultValue: 0.5
    });
  });

  test('defaults elevationOffset to 0 so existing maps stay on the ground', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    expect(layer.config.visConfig.elevationScale).toBe(1);
    expect(layer.config.visConfig.elevationOffset).toBe(0);
    expect(layer.config.visConfig.elevationOffsetRange).toEqual([0, 500]);
    expect(layer.config.visConfig.fixedElevation).toBe(true);
    expect(layer.config.elevationOffsetField).toBeNull();
    expect(layer.visualChannels.elevationOffset.accessor).toBe('getElevationOffset');
    expect(layer.isElevationOffsetActive()).toBe(false);
    expect(layer.isExtruded()).toBe(false);
  });

  test('treats a positive offset or mapped field as elevation offset in use', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    layer.config.visConfig.elevationOffset = 12;
    expect(layer.isElevationOffsetActive()).toBe(true);

    layer.config.visConfig.elevationOffset = 0;
    layer.config.elevationOffsetField = {name: 'offset'} as any;
    expect(layer.isElevationOffsetActive()).toBe(true);
    expect(layer.isExtruded()).toBe(true);
  });

  test('rebuilds elevation when Enable height is toggled after offset', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    expect(layer.getVisualChannelUpdateTriggers().getElevation.enable3d).toBe(false);
    layer.config.visConfig.enable3d = true;
    expect(layer.getVisualChannelUpdateTriggers().getElevation.enable3d).toBe(true);
  });

  test('writes depth when elevation offset is used even if height is off', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    layer.config.visConfig.elevationOffset = 12;
    expect(propsFor(layer, {dragRotate: false})).toMatchObject({
      depthTest: true,
      depthMask: true
    });
  });

  test('reads elevationOffset from visConfig or GeoJSON properties', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    layer.config.visConfig.elevationOffset = 120;
    const accessors = layer.getAttributeAccessors({
      dataContainer: {} as any
    });

    expect(accessors.getElevationOffset({})).toBe(120);
    expect(accessors.getElevationOffset({properties: {elevationOffset: 50}})).toBe(50);
  });

  test('uses raw elevationOffset field values instead of normalizing to the min', () => {
    const layer = new GeoJsonLayer({id: 'geojson_offset'});
    expect(layer.visualChannels.elevationOffset.fixed).toBe('fixedElevation');
    expect(layer.config.visConfig.fixedElevation).toBe(true);

    layer.config.elevationOffsetField = {
      name: 'offset',
      type: 'real',
      valueAccessor: d => d.offset
    } as any;
    layer.config.elevationOffsetDomain = [10, 40];
    layer.config.visConfig.elevationOffsetRange = [0, 500];

    const accessors = layer.getAttributeAccessors({
      dataAccessor: () => d => d,
      dataContainer: {} as any
    });

    // Linear mapping of [10, 40] onto [0, 500] would put 10 on the ground.
    expect(accessors.getElevationOffset({offset: 10})).toBe(10);
    expect(accessors.getElevationOffset({offset: 20})).toBe(20);
    expect(accessors.getElevationOffset({offset: 40})).toBe(40);
  });

  test('3D view writes depth for flat layers so they participate in occlusion', () => {
    const layer = new GeoJsonLayer({id: 'geojson_depth'});
    expect(propsFor(layer, {dragRotate: true})).toMatchObject({
      depthTest: true,
      depthMask: true
    });
  });

  test('places text labels at the elevation offset, not on the extrusion top', () => {
    const feature = {properties: {index: 0}};
    expect(getTextLabelPosition([-122, 37], feature, 0)).toEqual([-122, 37]);
    expect(getTextLabelPosition([-122, 37], feature, 40)).toEqual([-122, 37, 40]);
  });
});

describe('GeoJsonLayer invert height', () => {
  const heightField = {
    name: 'height',
    type: 'real',
    valueAccessor: d => d.height
  };

  const layerWithHeight = () => {
    const layer = new GeoJsonLayer({id: 'geojson_invert_height'});
    layer.config.heightField = heightField as any;
    layer.config.heightDomain = [10, 40];
    layer.config.heightScale = 'linear';
    layer.config.visConfig.heightRange = [0, 500];
    return layer;
  };

  const elevations = (layer: GeoJsonLayer) => {
    const getElevation = layer.getAttributeAccessors({
      dataAccessor: () => d => d,
      dataContainer: {} as any
    }).getElevation;
    return [10, 25, 40, null].map(height => getElevation({height}));
  };

  test('defaults to off and sits on the height channel next to fixed height', () => {
    const layer = new GeoJsonLayer({id: 'geojson_invert_height'});

    expect(layer.config.visConfig.invertHeight).toBe(false);
    expect(layer.visConfigSettings.invertHeight).toMatchObject({
      defaultValue: false,
      property: 'invertHeight',
      group: 'height'
    });
    expect(layer.visualChannels.height.invert).toBe('invertHeight');
    expect(layer.visualChannels.height.fixed).toBe('fixedHeight');
    expect(layer.getVisualChannelUpdateTriggers().getElevation.invertHeight).toBe(false);

    layer.config.visConfig.invertHeight = true;
    expect(layer.getVisualChannelUpdateTriggers().getElevation.invertHeight).toBe(true);
  });

  test('swaps low and high polygons with fixed height off and on', () => {
    const scaled = layerWithHeight();
    expect(elevations(scaled)).toEqual([0, 250, 500, 0]);

    scaled.config.visConfig.invertHeight = true;
    expect(elevations(scaled)).toEqual([500, 250, 0, 0]);
    expect(scaled.config.visConfig.heightRange).toEqual([0, 500]);

    const fixed = layerWithHeight();
    fixed.config.visConfig.fixedHeight = true;
    expect(elevations(fixed)).toEqual([10, 25, 40, 0]);

    fixed.config.visConfig.invertHeight = true;
    expect(elevations(fixed)).toEqual([40, 25, 10, 0]);
    expect(fixed.config.heightDomain).toEqual([10, 40]);
    expect(fixed.config.visConfig.heightRange).toEqual([0, 500]);
  });
});

describe('GeoJsonLayer hover overlay cache', () => {
  const polygonFeature = {
    type: 'Feature' as const,
    properties: {index: 0},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0]
        ]
      ]
    }
  };

  const hovered = (index: number, overrides: {picked?: boolean} = {}) => ({
    picked: true,
    index,
    layer: {props: {id: 'hover_geojson'}},
    object: {...polygonFeature, properties: {index}},
    ...overrides
  });

  test('reuses overlay data for the same feature across redraws', () => {
    const layer = new GeoJsonLayer({id: 'hover_geojson'});
    const first = layer._getHoverOverlayData(hovered(0));
    const second = layer._getHoverOverlayData(hovered(0));

    expect(first).toBeTruthy();
    expect(first).toBe(second);
    expect(first?.[0].geometry.type).toBe('MultiLineString');
  });

  test('rebuilds overlay data when the hovered feature changes', () => {
    const layer = new GeoJsonLayer({id: 'hover_geojson'});
    const first = layer._getHoverOverlayData(hovered(0));
    const other = layer._getHoverOverlayData(hovered(1));

    expect(first).not.toBe(other);
    expect(other?.[0].geometry.type).toBe('MultiLineString');
  });

  test('clears overlay data when nothing is picked', () => {
    const layer = new GeoJsonLayer({id: 'hover_geojson'});
    layer._getHoverOverlayData(hovered(0));

    expect(layer._getHoverOverlayData(hovered(0, {picked: false}))).toBeNull();
  });
});

describe('GeoJsonLayer source revisions', () => {
  const originalResponse = globalThis.Response;
  beforeAll(() => {
    globalThis.Response = Response as any;
  });
  afterAll(() => {
    globalThis.Response = originalResponse;
  });
  const point = (coordinates: number[]) => ({type: 'Point', coordinates});
  const feature = (coordinates: number[]) => ({
    type: 'Feature',
    geometry: point(coordinates),
    properties: {}
  });
  const wkbPoint = ([x, y]: number[]) => {
    const bytes = new Uint8Array(21);
    const view = new DataView(bytes.buffer);
    view.setUint8(0, 1);
    view.setUint32(1, 1, true);
    view.setFloat64(5, x, true);
    view.setFloat64(13, y, true);
    return bytes;
  };
  const layerFor = (dataset: KeplerTable) => {
    const layer = new GeoJsonLayer({
      id: 'refresh_geometry',
      dataId: dataset.id,
      columns: {geojson: {value: 'geometry', fieldIdx: 0}}
    });
    layer.setInitialLayerConfig(dataset);
    return layer;
  };
  const rowTable = (value: unknown) =>
    new KeplerTable({info: {id: 'refresh'}, color: [1, 2, 3]}).updateSchema({
      fields: [{name: 'geometry', type: 'geojson'}],
      rows: [[value]]
    });

  test.each([
    ['Feature', feature],
    ['Geometry', point],
    ['GeoJSON string', coordinates => JSON.stringify(feature(coordinates))],
    ['WKT', ([x, y]) => `POINT (${x} ${y})`],
    ['WKB hex', coordinates => Buffer.from(wkbPoint(coordinates)).toString('hex')]
  ] as const)('rebuilds same-length %s rows in place', async (_name, encode) => {
    const dataset = rowTable(encode([1, 2]));
    const container = dataset.dataContainer;
    const layer = layerFor(dataset);
    const initialData = layer.formatLayerData({refresh: dataset}, {}) as any;
    const hovered = object => ({picked: true, index: 0, object, layer: {props: {id: layer.id}}});
    const retainedHover = hovered(initialData.data[0]);
    const initialOverlay = layer._getHoverOverlayData(retainedHover);

    await dataset.update({fields: dataset.fields, rows: [[encode([30, 40])]]});
    const data = layer.formatLayerData({refresh: dataset}, initialData) as any;

    expect(dataset.dataContainer).toBe(container);
    expect(data.data[0].geometry.coordinates).toEqual([30, 40]);
    expect(layer.centroids).toEqual([[30, 40]]);
    expect(layer.meta).toMatchObject({bounds: [30, 40, 30, 40]});
    expect(data.getPosition({index: 0})).toEqual([30, 40]);
    const overlay = layer._getHoverOverlayData(retainedHover);
    expect(overlay).not.toBe(initialOverlay);
    expect(overlay?.[0].geometry).toEqual(point([30, 40]));
    expect(layer._getHoverOverlayData(hovered(data.data[0]))).toBe(overlay);
  });

  test.each([{rows: []}, {rows: [[null]]}, {rows: [['invalid geometry']]}])(
    'clears old geometry and centroids for empty or invalid rows (%j)',
    async ({rows}) => {
      const dataset = rowTable(feature([1, 2]));
      const layer = layerFor(dataset);
      const initialData = layer.formatLayerData({refresh: dataset}, {});
      await dataset.update({fields: dataset.fields, rows});
      const data = layer.formatLayerData({refresh: dataset}, initialData) as any;
      expect(data.data).toEqual([]);
      expect(layer.centroids).toEqual([]);
      expect(layer.meta).not.toMatchObject({bounds: [1, 2, 1, 2]});
    }
  );

  test('reuses geometry for styling, filters and metadata-only table copies', () => {
    const dataset = rowTable(feature([1, 2]));
    const layer = layerFor(dataset);
    const geometry = layer.dataToFeature;
    const centroids = layer.centroids;
    layer.updateLayerVisConfig({opacity: 0.3});
    const filtered = copyTableAndUpdate(dataset, {filteredIndex: []});
    layer.updateLayerMeta(filtered);
    expect(layer.calculateDataAttribute(filtered)).toEqual([]);
    layer.updateLayerMeta(copyTableAndUpdate(dataset, {metadata: {refreshProgress: 50}}));
    expect(layer.dataToFeature).toBe(geometry);
    expect(layer.centroids).toBe(centroids);
  });

  test('rebuilds when a new container has the same revision', () => {
    const original = rowTable(feature([1, 2]));
    const layer = layerFor(original);
    const replacement = rowTable(feature([30, 40]));
    expect(replacement.dataRevision).toBe(original.dataRevision);
    layer.updateLayerMeta(replacement);
    expect(layer.centroids).toEqual([[30, 40]]);
    expect(layer.meta).toMatchObject({bounds: [30, 40, 30, 40]});
  });

  test('keeps filtered table-column line segments out of the hover overlay', () => {
    const dataset = new KeplerTable({info: {id: 'refresh'}, color: [1, 2, 3]}).updateSchema({
      fields: [
        {name: 'id', type: 'integer'},
        {name: 'lat', type: 'real'},
        {name: 'lng', type: 'real'}
      ],
      rows: [
        [1, 1, 2],
        [1, 3, 4],
        [1, 5, 6]
      ]
    });
    const layer = new GeoJsonLayer({
      id: 'table-hover',
      dataId: dataset.id,
      columnMode: 'table',
      columns: {
        geojson: {value: null, fieldIdx: -1},
        id: {value: 'id', fieldIdx: 0},
        lat: {value: 'lat', fieldIdx: 1},
        lng: {value: 'lng', fieldIdx: 2},
        sortBy: {value: null, fieldIdx: -1, optional: true}
      }
    });
    dataset.filteredIndex = [0, 2];
    const data = layer.formatLayerData({refresh: dataset}, {}) as any;
    const rendered = data.data[0];
    expect(rendered.geometry.coordinates.map(coordinate => coordinate.slice(0, 2))).toEqual([
      [2, 1],
      [6, 5]
    ]);
    const overlay = layer._getHoverOverlayData({
      picked: true,
      index: 0,
      object: rendered,
      layer: {props: {id: layer.id}}
    });
    expect(overlay?.[0].geometry).toEqual(rendered.geometry);
  });

  // Exact-sized buffers match decoded Arrow data. Builder padding otherwise
  // introduces extra zero coordinates in the loaders.gl native point parser.
  const pointVector = (coordinates: number[][]) =>
    arrow.makeVector(
      arrow.makeData({
        type: new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64(), false)),
        length: coordinates.length,
        child: arrow.makeData({
          type: new arrow.Float64(),
          data: Float64Array.from(coordinates.flat())
        })
      })
    );
  const arrowTable = (column: arrow.Vector, encoding: string) =>
    new KeplerTable({info: {id: 'refresh'}, color: [1, 2, 3]}).updateSchema({
      fields: [
        {
          name: 'geometry',
          type: 'geoarrow',
          metadata: new Map([[GEOARROW_METADATA_KEY, encoding]])
        }
      ],
      cols: [column],
      rows: []
    });

  test.each([
    [GEOARROW_EXTENSIONS.POINT, pointVector],
    [
      GEOARROW_EXTENSIONS.WKB,
      (coordinates: number[][]) =>
        arrow.vectorFromArray(coordinates.map(wkbPoint), new arrow.Binary())
    ]
  ] as const)(
    'rebuilds same-length %s columns and reuses unchanged data',
    async (encoding, vector) => {
      const dataset = arrowTable(vector([[1, 2]]), encoding);
      const layer = layerFor(dataset);
      const initialData = layer.formatLayerData({refresh: dataset}, {});
      await dataset.update({fields: dataset.fields, cols: [vector([[30, 40]])], rows: []});
      const data = layer.formatLayerData({refresh: dataset}, initialData) as any;
      expect(Array.from(data.data[0].points.positions.value).slice(0, 2)).toEqual([30, 40]);
      expect(layer.centroids).toEqual([[30, 40]]);
      expect(layer.meta).toMatchObject({bounds: [30, 40, 30, 40]});
      layer.updateLayerMeta(dataset);
      expect(layer.dataToFeature).toBe(data.data);
    }
  );

  test('retains parsed Arrow chunks only for real appends, and rebuilds after compaction', async () => {
    const first = pointVector([[1, 2]]);
    const second = pointVector([[3, 4]]);
    const dataset = arrowTable(first, GEOARROW_EXTENSIONS.POINT);
    const layer = layerFor(dataset);
    const parsedFirst = layer.dataToFeature[0];
    await dataset.update({fields: dataset.fields, cols: [first.concat(second)], rows: []});
    layer.updateLayerMeta(dataset);
    expect(layer.dataToFeature).toHaveLength(2);
    expect(layer.dataToFeature[0]).toBe(parsedFirst);
    expect(layer.centroids).toEqual([
      [1, 2],
      [3, 4]
    ]);

    // A larger replacement is not an append just because it adds one chunk.
    const replacement = pointVector([[30, 40]])
      .concat(pointVector([[50, 60]]))
      .concat(pointVector([[70, 80]]));
    await dataset.update({fields: dataset.fields, cols: [replacement], rows: []});
    layer.updateLayerMeta(dataset);
    expect(layer.centroids).toEqual([
      [30, 40],
      [50, 60],
      [70, 80]
    ]);

    await dataset.update({
      fields: dataset.fields,
      cols: [
        pointVector([
          [30, 40],
          [50, 60],
          [70, 80]
        ])
      ],
      rows: []
    });
    layer.updateLayerMeta(dataset);
    expect(layer.dataToFeature).toHaveLength(1);
    expect(layer.centroids).toEqual([
      [30, 40],
      [50, 60],
      [70, 80]
    ]);
    expect(layer.meta).toMatchObject({bounds: [30, 40, 70, 80]});
  });
});

describe('GeoJsonLayer inferred geometry fields', () => {
  const originalResponse = globalThis.Response;
  beforeAll(() => {
    globalThis.Response = Response as any;
  });
  afterAll(() => {
    globalThis.Response = originalResponse;
  });
  const point = {type: 'Point' as const, coordinates: [10, 10]};
  const line = {
    type: 'LineString' as const,
    coordinates: [
      [10, 10],
      [10.25, 10.25]
    ]
  };
  const polygon = {
    type: 'Polygon' as const,
    coordinates: [
      [
        [10, 10],
        [10.25, 10],
        [10.25, 10.25],
        [10, 10]
      ]
    ]
  };
  const collection = {type: 'GeometryCollection' as const, geometries: [point, line]};
  const cases = [
    {name: 'GeoJSON Point string', value: JSON.stringify(point)},
    {name: 'GeometryCollection object', value: collection},
    {
      name: 'GeometryCollection WKT',
      value: 'GEOMETRYCOLLECTION (POINT (10 10), LINESTRING (10 10, 10.25 10.25))'
    },
    ...[
      point,
      line,
      polygon,
      {type: 'MultiPoint' as const, coordinates: [point.coordinates]},
      {type: 'MultiLineString' as const, coordinates: [line.coordinates]},
      {type: 'MultiPolygon' as const, coordinates: [polygon.coordinates]}
    ].map(geometry => ({
      name: `${geometry.type} numeric WKB`,
      value: Buffer.from(convertGeometryToWKB(geometry)).toString('hex')
    }))
  ];

  test.each(cases)(
    'imports $name from a custom column and keeps styling/filter cache reuse',
    async ({value}) => {
      const data = processRowObject([
        {shape: value, score: 0.25},
        {shape: value, score: 0.75}
      ])!;
      const dataset = new KeplerTable({info: {id: 'inferred'}, color: [0, 0, 0]});
      await dataset.importData({data});
      const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);
      expect(props).toHaveLength(1);
      const layer = new GeoJsonLayer({...props[0], id: 'inferred-layer', dataId: dataset.id});
      layer.setInitialLayerConfig(dataset);
      const initial = layer.formatLayerData({inferred: dataset}, {}) as any;
      expect(initial.data.map(feature => feature.properties.index)).toEqual([0, 1]);
      expect(layer.centroids).toHaveLength(2);
      expect(layer.centroids.flat().every(Number.isFinite)).toBe(true);
      expect(
        layer._getHoverOverlayData({
          picked: true,
          index: 1,
          object: initial.data[1],
          layer: {props: {id: layer.id}}
        })
      ).not.toBeNull();
      const geometry = layer.dataToFeature;
      layer.updateLayerVisConfig({opacity: 0.37});
      const filtered = copyTableAndUpdate(dataset, {filteredIndex: [1]});
      const updated = layer.formatLayerData({inferred: filtered}, initial) as any;
      expect(updated.data.map(feature => feature.properties.index)).toEqual([1]);
      expect(layer.dataToFeature).toBe(geometry);
      expect(layer.config.visConfig.opacity).toBe(0.37);
    }
  );

  test.each([
    '{"type":"Point","coordinates":["x","y"]}',
    '{"type":"Point","coordinates":[null,null]}',
    '{"type":"Polygon","coordinates":[1,2]}',
    'GEOMETRYCOLLECTION (',
    'GEOMETRYCOLLECTION (ordinary text)'
  ])('does not create a geometry layer for malformed custom-column values (%s)', async value => {
    const data = processRowObject([{shape: value}])!;
    const dataset = new KeplerTable({info: {id: 'invalid-geometry'}, color: [0, 0, 0]});
    await dataset.importData({data});
    expect(GeoJsonLayer.findDefaultLayerProps(dataset).props).toHaveLength(0);
  });

  test.each([
    ['GeoJSON dataset', 'GeoJSON'],
    ['CSV', 'GeoJSON'],
    ['CSV', 'WKT'],
    ['CSV', 'WKB hex'],
    ['Arrow', 'GeoJSON'],
    ['Arrow', 'WKT'],
    ['Arrow', 'WKB hex'],
    ['Arrow', 'WKB bytes'],
    ['Parquet', 'GeoJSON'],
    ['Parquet', 'WKT'],
    ['Parquet', 'WKB hex'],
    ['Parquet', 'WKB bytes']
  ])('preserves initial %s imports with %s geometry', async (format, encoding) => {
    const geometries = [10, 40].map(value => ({
      type: 'Point' as const,
      coordinates: [value, value]
    }));
    const values = geometries.map(geometry =>
      encoding === 'GeoJSON'
        ? JSON.stringify(geometry)
        : encoding === 'WKT'
        ? `POINT (${geometry.coordinates.join(' ')})`
        : encoding === 'WKB hex'
        ? Buffer.from(convertGeometryToWKB(geometry)).toString('hex')
        : new Uint8Array(convertGeometryToWKB(geometry))
    );
    let data;
    if (format === 'GeoJSON dataset') {
      data = processGeojson({
        type: 'FeatureCollection',
        features: geometries.map((geometry, index) => ({
          type: 'Feature',
          geometry,
          properties: {label: `row-${index}`}
        }))
      });
    } else if (format === 'CSV') {
      data = processCsvData(
        `shape,label\n${values
          .map(
            (value, index) => `${JSON.stringify(String(value)).replace(/\\"/g, '""')},row-${index}`
          )
          .join('\n')}`
      );
    } else {
      let table = new arrow.Table({
        _geojson: arrow.vectorFromArray(
          values as any[],
          encoding === 'WKB bytes' ? new arrow.Binary() : new arrow.Utf8()
        ),
        label: arrow.vectorFromArray(['row-0', 'row-1'], new arrow.Utf8())
      });
      if (encoding === 'WKB bytes') {
        table.schema.fields[0].metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB);
      }
      if (format === 'Parquet') {
        if (encoding === 'WKB bytes') {
          table.schema.metadata.set(
            'geo',
            JSON.stringify({
              version: '1.1.0',
              primary_column: '_geojson',
              columns: {_geojson: {encoding: 'WKB'}}
            })
          );
        }
        const specifier = 'parquet-wasm/node';
        const imported = await import(specifier);
        const wasm = imported.readParquet ? imported : imported.default;
        const properties = new wasm.WriterPropertiesBuilder()
          .setKeyValueMetadata(table.schema.metadata)
          .build();
        const parquet = wasm.writeParquet(
          wasm.Table.fromIPCStream(arrow.tableToIPC(table, 'stream')),
          properties
        );
        table = arrow.tableFromIPC(wasm.readParquet(parquet).intoIPCStream());
      } else {
        table = arrow.tableFromIPC(arrow.tableToIPC(table, 'stream'));
      }
      const [file] = await processFileData({
        content: {
          fileName: `points.${format === 'Parquet' ? 'parquet' : 'arrow'}`,
          data: table.batches
        },
        fileCache: []
      } as any);
      data = file.data as any;
    }
    const dataset = new KeplerTable({info: {id: 'import-compatibility'}, color: [0, 0, 0]});
    await dataset.importData({data});
    const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);
    expect(props).toHaveLength(1);
    const layer = new GeoJsonLayer({...props[0], id: 'import-compatibility', dataId: dataset.id});
    layer.setInitialLayerConfig(dataset);
    const formatted = layer.formatLayerData({[dataset.id]: dataset}, {}) as any;
    expect(layer.centroids).toEqual([
      [10, 10],
      [40, 40]
    ]);
    expect(layer.meta).toMatchObject({bounds: [10, 10, 40, 40]});
    expect(
      layer._getHoverOverlayData({
        picked: true,
        index: 1,
        object: layer.geoArrowMode ? undefined : formatted.data[1],
        layer: {props: {id: layer.id}}
      })?.[0].geometry
    ).toEqual(geometries[1]);
  });
});
