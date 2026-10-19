// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GeoJsonLayer, {getTextLabelPosition} from './geojson-layer';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {valueToPosition} from '@kepler.gl/utils';
import {KeplerTable, copyTableAndUpdate} from '@kepler.gl/table';
import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';
import {Response} from 'node-fetch';

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
