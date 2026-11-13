// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {TileLayer, MVTLayer} from '@deck.gl/geo-layers';
import {DEFAULT_GLOBE_CONFIG} from '@kepler.gl/constants';
import {
  DEFAULT_BASEMAP_COLOR,
  getBasemapColors,
  getBasemapColorsForStyle,
  getGlobeBaseLayers,
  getGlobeBasemapAttributions,
  getGlobeClearColor,
  resolveGlobeBasemapProvider
} from './globe-layers';

const globe = {enabled: true, config: {...DEFAULT_GLOBE_CONFIG, atmosphere: false}};
const base = {globe, mapboxApiAccessToken: '', mapStyleType: 'dark'};
const vectorLayer = (options = {}): any =>
  getGlobeBaseLayers({...base, ...options}).find(layer => layer instanceof MVTLayer);

describe('globe basemap adapter', () => {
  test('respects selected library and falls back to token-free tiles', () => {
    expect(resolveGlobeBasemapProvider('maplibre', 'token')).toBe('carto');
    expect(resolveGlobeBasemapProvider('mapbox', 'token')).toBe('mapbox');
    expect(resolveGlobeBasemapProvider('mapbox', '')).toBe('carto');
    expect(resolveGlobeBasemapProvider(undefined)).toBe('carto');
    expect(resolveGlobeBasemapProvider(undefined, 'token')).toBe('mapbox');
    expect(vectorLayer().props.data).toEqual(
      expect.arrayContaining([expect.stringContaining('cartocdn.com')])
    );
    expect(vectorLayer({mapboxApiAccessToken: 'token'}).props.data).toContain('access_token=token');
    expect(vectorLayer({basemapProvider: 'mapbox'})).toBeUndefined();
  });

  test('uses provider-specific native zoom limits, extents, and schema layers', () => {
    const carto = vectorLayer();
    const mapbox = vectorLayer({mapboxApiAccessToken: 'token'});
    expect(carto.props.maxZoom).toBe(14);
    expect(mapbox.props.maxZoom).toBe(16);
    expect(carto.props.extent).toEqual([-180, -85.051129, 180, 85.051129]);
    expect(carto.props.loadOptions.mvt.layers).toEqual([
      'place',
      'boundary',
      'water',
      'transportation'
    ]);
    expect(mapbox.props.loadOptions.mvt.layers).toEqual(['place_label', 'admin', 'water', 'road']);
    expect(carto.props.parameters).toMatchObject({depthTest: true, depthMask: false, cull: false});
  });

  test('compensates tile detail for latitude without allowing non-finite offsets', () => {
    const equator = vectorLayer().props.zoomOffset;
    expect(vectorLayer({latitude: 60}).props.zoomOffset - equator).toBeCloseTo(1);
    expect(vectorLayer({latitude: -60}).props.zoomOffset).toBeCloseTo(
      vectorLayer({latitude: 60}).props.zoomOffset
    );
    expect(vectorLayer({latitude: NaN}).props.zoomOffset).toBe(equator);
    expect(vectorLayer({latitude: 90}).props.zoomOffset).toBe(
      vectorLayer({latitude: 85}).props.zoomOffset
    );
  });

  test('satellite mode uses raster tiles and hybrid adds labels without vector water', () => {
    const satellite = getGlobeBaseLayers({...base, mapStyleType: 'satellite'});
    expect(satellite.some(layer => layer instanceof MVTLayer)).toBe(false);
    const raster: any = satellite.find(layer => layer instanceof TileLayer);
    expect(raster.props.data[0]).toContain('arcgisonline.com');
    const image = {width: 1, height: 1, data: new Uint8Array([0, 0, 0, 255])};
    const bitmap = raster.props.renderSubLayers({
      id: 'test',
      data: image,
      tile: {bbox: {west: 1, south: 2, east: 3, north: 4}}
    })[0];
    expect(bitmap.props.bounds).toEqual([1, 2, 3, 4]);
    expect(bitmap.props.image).toBe(image);
    const hybrid = vectorLayer({mapStyleType: 'satellite-street'});
    expect(hybrid.props.loadOptions.mvt.layers).toEqual(['place', 'boundary']);
  });

  test('water and boundary accessors honor visibility across provider schemas', () => {
    const hidden = vectorLayer({
      globe: {...globe, config: {...globe.config, water: false, adminLines: false}}
    });
    for (const layerName of ['admin', 'boundary']) {
      expect(hidden.props.getLineColor({properties: {layerName}})).toEqual([0, 0, 0, 0]);
      expect(hidden.props.getLineWidth({properties: {layerName, admin_level: 2}})).toBe(1);
      expect(hidden.props.getLineWidth({properties: {layerName, admin_level: 4}})).toBe(0.75);
    }
    expect(hidden.props.getFillColor({properties: {layerName: 'water'}})).toEqual([0, 0, 0, 0]);
    const visible = vectorLayer();
    expect(visible.props.getFillColor({properties: {layerName: 'water'}})).toEqual(
      globe.config.waterColor
    );
    expect(visible.props.getLineColor({properties: {layerName: 'boundary'}})).toEqual(
      globe.config.adminLinesColor
    );
    expect(visible.props.getLineWidth({properties: {layerName: 'road'}})).toBe(0);
  });

  test('disabling the basemap removes tile layers and source attribution', () => {
    const disabled = {...globe, config: {...globe.config, basemap: false}};
    expect(
      getGlobeBaseLayers({...base, globe: disabled}).some(layer => layer instanceof TileLayer)
    ).toBe(false);
    expect(getGlobeBasemapAttributions({globe: disabled})).toEqual([]);
    expect(getGlobeBasemapAttributions({globe: {...globe, enabled: false}})).toEqual([]);
  });

  test('credits the actual imagery and vector providers', () => {
    const hrefs = (options = {}) =>
      getGlobeBasemapAttributions({globe, ...options}).map(item => item.href);
    expect(hrefs()).toEqual([
      'https://carto.com/attributions',
      'https://www.openstreetmap.org/copyright'
    ]);
    expect(hrefs({mapStyleType: 'satellite'})).toContain('https://www.esri.com/');
    expect(hrefs({mapboxApiAccessToken: 'token'})).toEqual([
      'https://www.mapbox.com/about/maps/',
      'https://www.openstreetmap.org/copyright'
    ]);
    expect(hrefs({basemapProvider: 'mapbox'})).toEqual([]);
  });

  test('extracts colors from style JSON and semantic layer groups', () => {
    const style = {
      layers: [
        {
          id: 'land',
          paint: {'background-color': ['interpolate', ['linear'], ['zoom'], 0, '#123456']}
        },
        {id: 'lake', paint: {'fill-color': 'rgb(1, 2, 3)'}},
        {id: 'border', paint: {'line-color': 'hsl(120, 100%, 50%)'}},
        {id: 'label', paint: {'text-color': 'hsl(0, 0%, 50%)'}}
      ]
    };
    const layerGroups = ['water', 'border', 'label'].map((slug, index) => ({
      slug,
      filter: (layer: any) => layer === style.layers[index + 1]
    }));
    const colors = getBasemapColors({style, layerGroups});
    expect(colors).toEqual({
      backgroundFillColor: [18, 52, 86],
      basemapWaterFillColor: [1, 2, 3],
      basemapAdminLineColor: [0, 255, 0],
      basemapLabelColor: [128, 128, 128]
    });
    expect(getBasemapColorsForStyle('dark', {style, layerGroups})).toEqual(colors);
  });

  test('falls back for missing or unsupported paint and preserves black space', () => {
    const defaults = getBasemapColors({});
    expect(defaults.backgroundFillColor).toEqual(DEFAULT_BASEMAP_COLOR.backgroundFillColor);
    expect(
      getBasemapColors({style: {layers: [{id: 'water', paint: {'fill-color': ['get', 'color']}}]}})
    ).toEqual(defaults);
    expect(getBasemapColorsForStyle('unknown')).toEqual(defaults);
    expect(getBasemapColorsForStyle('light')).not.toEqual(defaults);
    expect(getGlobeClearColor([0, 0, 0])).toEqual([0, 0, 0, 255]);
    expect(getGlobeClearColor()).toHaveLength(4);
  });
});
