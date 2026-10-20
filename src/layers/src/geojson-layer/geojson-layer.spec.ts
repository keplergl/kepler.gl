// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GeoJsonLayer, {GeoJsonLayerConfig, getTextLabelPosition} from './geojson-layer';
import {ALL_FIELD_TYPES, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {valueToPosition} from '@kepler.gl/utils';
import {processGeojson} from '@kepler.gl/processors';
import {KeplerTable} from '@kepler.gl/table';

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
    const {layer} = await initializeGeoJsonLayer([{geometry: polygon(0), properties: {score: 0.5}}]);

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
