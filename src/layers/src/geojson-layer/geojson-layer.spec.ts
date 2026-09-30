// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GeoJsonLayer, {getTextLabelPosition} from './geojson-layer';

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
