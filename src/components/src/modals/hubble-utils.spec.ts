// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {TileLayer, MVTLayer, _Tileset2D} from '@deck.gl/geo-layers';
import {
  FILTER_TYPES,
  FILTER_VIEW_TYPES,
  GLOBE_MIN_ZOOM,
  GLOBE_MAX_ZOOM
} from '@kepler.gl/constants';
import {
  getTimeRangeFilterKeyframes,
  getBeforeLayerId,
  getStaticMapProps,
  getAnimatableFilters,
  scaleToVideoExport,
  getResolutionSetting,
  getVideoExportContainer,
  getHubbleDeckGlProps,
  getGlobeExportLayers,
  getFlatExportLayers,
  scaleZoomOpacityForVideoExport
} from './hubble-utils';

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('../../../utils/src/utils'),
  ...jest.requireActual('../../../utils/src/layer-visibility'),
  getMapLayersFromSplitMaps: jest.requireActual('../../../utils/src/map-utils')
    .getMapLayersFromSplitMaps,
  getLayerBlendingParameters: jest.fn(() => ({blend: true})),
  getBaseMapLibrary: jest.fn(() => 'maplibre')
}));

// The export regression uses the real reducer render path with a minimal layer
// renderer, so no concrete layer classes or GPU resources are needed.
jest.mock('@kepler.gl/layers', () => ({OVERLAY_TYPE_CONST: {deckgl: 'deckgl'}}));

jest.mock('maplibregl-mapbox-request-transformer', () => ({
  isMapboxURL: jest.fn((url: string) => url.startsWith('mapbox:')),
  transformMapboxUrl: jest.fn((url: string, _resourceType: string, token: string) => ({
    url: `${url.replace('mapbox://', 'https://api.mapbox.com/')}?access_token=${token}`
  }))
}));

describe('hubble-utils', () => {
  describe('getTimeRangeFilterKeyframes', () => {
    const baseFilter = {
      type: FILTER_TYPES.timeRange,
      domain: [100, 500],
      value: [200, 300],
      animationWindow: 'free',
      plotType: {interval: null},
      timeBins: null,
      dataId: ['dataset1']
    };

    test('throws when filter type is not timeRange', () => {
      expect(() =>
        getTimeRangeFilterKeyframes({
          filter: {...baseFilter, type: 'range'},
          timings: [0, 1000]
        })
      ).toThrow("filter type must be 'timeRange'.");
    });

    test('returns free keyframes by default', () => {
      const result = getTimeRangeFilterKeyframes({
        filter: baseFilter,
        timings: [0, 1000]
      });

      const delta = baseFilter.value[1] - baseFilter.value[0]; // 100
      expect(result.keyframes).toEqual([{value: [100, 100 + delta]}, {value: [500 - delta, 500]}]);
      expect(typeof result.easings).toBe('function');
      expect(result.easings(0.5)).toBe(0.5);
    });

    test('returns incremental keyframes', () => {
      const result = getTimeRangeFilterKeyframes({
        filter: {...baseFilter, animationWindow: 'incremental'},
        timings: [0, 1000]
      });

      expect(result.keyframes).toEqual([{value: [200, 201]}, {value: [200, 500]}]);
    });

    test('returns point keyframes', () => {
      const result = getTimeRangeFilterKeyframes({
        filter: {...baseFilter, animationWindow: 'point'},
        timings: [0, 1000]
      });

      expect(result.keyframes).toEqual([{value: 100}, {value: 500}]);
    });

    test('returns interval keyframes with bins', () => {
      const bins = [
        {x0: 100, x1: 200},
        {x0: 200, x1: 300},
        {x0: 300, x1: 400}
      ];
      const filter = {
        ...baseFilter,
        animationWindow: 'interval',
        plotType: {interval: 'day'},
        timeBins: {dataset1: {day: bins}},
        dataId: ['dataset1']
      };

      const result = getTimeRangeFilterKeyframes({
        filter,
        timings: [0, 900]
      });

      expect(result.keyframes).toEqual([
        {value: [100, 200]},
        {value: [200, 300]},
        {value: [300, 400]}
      ]);
      expect(result.timings).toEqual([0, 300, 600]);
      // hold easing: returns 0 unless p === 1
      expect(result.easings(0)).toBe(0);
      expect(result.easings(0.5)).toBe(0);
      expect(result.easings(1)).toBe(1);
    });

    test('falls back to free keyframes when interval has no bins', () => {
      const filter = {
        ...baseFilter,
        animationWindow: 'interval',
        plotType: {interval: null},
        timeBins: null
      };

      const result = getTimeRangeFilterKeyframes({
        filter,
        timings: [0, 1000]
      });

      const delta = baseFilter.value[1] - baseFilter.value[0];
      expect(result.keyframes).toEqual([{value: [100, 100 + delta]}, {value: [500 - delta, 500]}]);
    });
  });

  describe('getBeforeLayerId', () => {
    test('returns null when topMapStyle is null', () => {
      expect(getBeforeLayerId(null, {layers: [{id: 'a'}]})).toBeNull();
    });

    test('returns null when bottomMapStyle is null', () => {
      expect(getBeforeLayerId({layers: [{id: 'a'}]}, null)).toBeNull();
    });

    test('returns null when either has empty layers', () => {
      expect(getBeforeLayerId({layers: []}, {layers: [{id: 'a'}]})).toBeNull();
    });

    test('returns the layer before the first top layer in the bottom style', () => {
      const topMapStyle = {layers: [{id: 'layer-b'}]};
      const bottomMapStyle = {
        layers: [{id: 'layer-a'}, {id: 'layer-b'}, {id: 'layer-c'}]
      };

      const result = getBeforeLayerId(topMapStyle, bottomMapStyle);
      expect(result).toEqual({id: 'layer-a'});
    });

    test('returns null when first top layer is at index 0 in bottom style', () => {
      const topMapStyle = {layers: [{id: 'layer-a'}]};
      const bottomMapStyle = {layers: [{id: 'layer-a'}, {id: 'layer-b'}]};

      expect(getBeforeLayerId(topMapStyle, bottomMapStyle)).toBeNull();
    });

    test('returns null when first top layer is not found in bottom style', () => {
      const topMapStyle = {layers: [{id: 'missing'}]};
      const bottomMapStyle = {layers: [{id: 'layer-a'}, {id: 'layer-b'}]};

      expect(getBeforeLayerId(topMapStyle, bottomMapStyle)).toBeNull();
    });
  });

  describe('getStaticMapProps', () => {
    const mockKeplerState = {
      visState: {},
      mapState: {latitude: 37.7, longitude: -122.4, zoom: 10},
      mapStyle: {
        styleType: 'dark',
        mapStyles: {
          dark: {accessToken: 'style-token'}
        },
        bottomMapStyle: {id: 'dark-map-style'}
      }
    };
    const onViewChange = jest.fn();

    test('spreads mapState into result', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'global-token');

      expect(result.latitude).toBe(37.7);
      expect(result.longitude).toBe(-122.4);
      expect(result.zoom).toBe(10);
    });

    test('uses style accessToken when available', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'global-token');
      expect(result.mapboxApiAccessToken).toBe('style-token');
    });

    test('falls back to global token when style has no accessToken', () => {
      const state = {
        ...mockKeplerState,
        mapStyle: {
          ...mockKeplerState.mapStyle,
          mapStyles: {dark: {}}
        }
      };
      const result = getStaticMapProps(state, onViewChange, 'global-token');
      expect(result.mapboxApiAccessToken).toBe('global-token');
    });

    test('sets preserveDrawingBuffer to true', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'token');
      expect(result.preserveDrawingBuffer).toBe(true);
    });

    test('passes bottomMapStyle as mapStyle', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'token');
      expect(result.mapStyle).toEqual({id: 'dark-map-style'});
    });

    test('passes onViewChange as onViewportChange', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'token');
      expect(result.onViewportChange).toBe(onViewChange);
    });

    test('includes mapLib as a Promise (always maplibre-gl)', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'token');
      expect(result.mapLib).toBeDefined();
      expect(result.mapLib).toBeInstanceOf(Promise);
    });

    test('provides transformRequest that handles mapbox:// URLs', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'global-token');
      expect(typeof result.transformRequest).toBe('function');

      const transformed = result.transformRequest('mapbox://styles/user/style1', 'Style');
      expect(transformed.url).toContain('api.mapbox.com');

      const regular = result.transformRequest('https://example.com/tiles', 'Source');
      expect(regular.url).toBe('https://example.com/tiles');
    });

    test('converts mapbox:// URLs in style object for mapbox styles', () => {
      const {getBaseMapLibrary} = require('@kepler.gl/utils');
      getBaseMapLibrary.mockReturnValueOnce('mapbox');

      const state = {
        ...mockKeplerState,
        mapStyle: {
          ...mockKeplerState.mapStyle,
          bottomMapStyle: {
            id: 'mapbox-style',
            sprite: 'mapbox://sprites/user/style1',
            glyphs: 'mapbox://fonts/user/{fontstack}/{range}.pbf',
            sources: {
              composite: {url: 'mapbox://mapbox.mapbox-streets-v8'}
            }
          }
        }
      };

      const result = getStaticMapProps(state, onViewChange, 'token');
      expect(result.mapStyle.sprite).toContain('api.mapbox.com');
      expect(result.mapStyle.glyphs).toContain('api.mapbox.com');
      expect(result.mapStyle.sources.composite.url).toContain('api.mapbox.com');
    });

    test('does not convert style URLs for non-mapbox styles', () => {
      const result = getStaticMapProps(mockKeplerState, onViewChange, 'token');
      expect(result.mapStyle).toEqual({id: 'dark-map-style'});
    });
  });

  describe('getAnimatableFilters', () => {
    test('returns empty array when no filters', () => {
      const state = {visState: {filters: []}, mapState: {}, mapStyle: {}};
      expect(getAnimatableFilters(state)).toEqual([]);
    });

    test('returns empty array when visState.filters is undefined', () => {
      const state = {visState: {}, mapState: {}, mapStyle: {}};
      expect(getAnimatableFilters(state)).toEqual([]);
    });

    test('filters only timeRange filters with enlarged view', () => {
      const filters = [
        {type: FILTER_TYPES.timeRange, view: FILTER_VIEW_TYPES.enlarged, id: 'f1'},
        {type: FILTER_TYPES.range, view: FILTER_VIEW_TYPES.enlarged, id: 'f2'},
        {type: FILTER_TYPES.timeRange, view: FILTER_VIEW_TYPES.side, id: 'f3'}
      ];
      const state = {visState: {filters}, mapState: {}, mapStyle: {}};
      const result = getAnimatableFilters(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('f1');
    });

    test('includes timeRange filters synced with layer timeline', () => {
      const filters = [
        {
          type: FILTER_TYPES.timeRange,
          view: FILTER_VIEW_TYPES.side,
          syncedWithLayerTimeline: true,
          id: 'synced'
        },
        {
          type: FILTER_TYPES.timeRange,
          view: FILTER_VIEW_TYPES.side,
          syncedWithLayerTimeline: false,
          id: 'not-synced'
        }
      ];
      const state = {visState: {filters}, mapState: {}, mapStyle: {}};
      const result = getAnimatableFilters(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('synced');
    });
  });

  describe('getResolutionSetting', () => {
    test.each([
      ['2560x1440', 2560, 1440],
      ['3840x2160', 3840, 2160]
    ])('returns the export dimensions for %s', (resolution, width, height) => {
      expect(getResolutionSetting(resolution)).toMatchObject({width, height});
    });

    test.each(['', 'unknown'])('keeps the fallback dimensions for %j', resolution => {
      expect(getResolutionSetting(resolution)).toMatchObject({width: 960, height: 540});
    });
  });

  describe('getVideoExportContainer', () => {
    test.each(['1280x720', '2560x1440', '3840x2160'])(
      'keeps the preview size at the selected 16:9 aspect ratio for %s',
      resolution => {
        expect(getVideoExportContainer(540, resolution)).toEqual({width: 540, height: 303.75});
      }
    );
  });

  describe('scaleToVideoExport', () => {
    const container = {width: 540, height: 304};

    test('keeps the original camera target in 2D', () => {
      const viewState = {
        latitude: 37.75,
        longitude: -122.35,
        zoom: 11,
        pitch: 0,
        bearing: 0,
        width: 1400,
        height: 900
      };
      const result = scaleToVideoExport(viewState, container);

      expect(result.latitude).toBe(37.75);
      expect(result.longitude).toBe(-122.35);
      expect(result.width).toBe(container.width);
      expect(result.height).toBe(container.height);
      expect(result.zoom).toBeLessThan(viewState.zoom);
    });

    test('keeps the original camera target when the map is pitched', () => {
      const viewState = {
        latitude: 37.75,
        longitude: -122.35,
        zoom: 12,
        pitch: 50,
        bearing: 30,
        width: 1400,
        height: 900
      };
      const result = scaleToVideoExport(viewState, container);

      expect(result.latitude).toBe(37.75);
      expect(result.longitude).toBe(-122.35);
      expect(result.pitch).toBe(50);
      expect(result.bearing).toBe(30);
    });

    test.each([undefined, 1])(
      'preserves flat framing below zoom zero with live minimum %s',
      minZoom => {
        const {MapController, WebMercatorViewport} = require('@deck.gl/core');
        const makeViewport = props => new WebMercatorViewport(props);
        const {ControllerState} = new MapController({makeViewport});
        const constrain = props => new ControllerState({...props, makeViewport}).getViewportProps();
        const source = constrain({
          longitude: 20.782920358671,
          latitude: 38.3983734702045,
          zoom: 2.1433240466230803,
          pitch: 0,
          bearing: 0,
          width: 1600,
          height: 900,
          minZoom
        });
        // The live controller supplies its default zero minimum after interaction.
        expect(source.minZoom).toBe(minZoom ?? 0);
        const preview = scaleToVideoExport(source, {width: 320, height: 180});
        const rendered = constrain(preview);
        expect(preview.zoom).toBeLessThan(0);
        expect(rendered.zoom).toBeCloseTo(preview.zoom);

        const project = (camera, point) => {
          const [x, y] = makeViewport(camera).project(point);
          return [x / camera.width, y / camera.height];
        };
        for (const point of [
          [source.longitude, source.latitude],
          [source.longitude + 10, source.latitude + 5],
          [source.longitude - 15, source.latitude - 10]
        ]) {
          const expected = project(source, point);
          const actual = project(rendered, point);
          expect(actual[0]).toBeCloseTo(expected[0], 6);
          expect(actual[1]).toBeCloseTo(expected[1], 6);
        }
        // The modal scales first; the export container then sees matching dimensions.
        expect(scaleToVideoExport({...source, ...preview}, preview)).toEqual(preview);
      }
    );

    test('keeps a narrow flat zoom interval valid at the renderer minimum', () => {
      const {MapController, WebMercatorViewport} = require('@deck.gl/core');
      const makeViewport = props => new WebMercatorViewport(props);
      const {ControllerState} = new MapController({makeViewport});
      const source = {
        longitude: 0,
        latitude: 0,
        zoom: 0.25,
        minZoom: 0,
        maxZoom: 0.25,
        width: 1600,
        height: 300
      };
      const preview = scaleToVideoExport(source, {width: 320, height: 180});
      expect(preview.minZoom).toBe(-2);
      expect(preview.maxZoom).toBeGreaterThanOrEqual(preview.minZoom);
      const rendered = new ControllerState({...preview, makeViewport}).getViewportProps();
      expect(Number.isFinite(rendered.zoom)).toBe(true);
      expect(rendered.zoom).toBeGreaterThanOrEqual(preview.minZoom);
      expect(rendered.zoom).toBeLessThanOrEqual(preview.maxZoom);
      expect(scaleToVideoExport({...source, ...preview}, preview)).toEqual(preview);
    });

    test('does not recenter globe cameras toward the equator', () => {
      const viewState = {
        latitude: 37.75,
        longitude: -122.35,
        zoom: 1,
        pitch: 0,
        bearing: 0,
        width: 1400,
        height: 900,
        globe: {enabled: true}
      };
      const result = scaleToVideoExport(viewState as any, container);

      expect(result.latitude).toBe(37.75);
      expect(result.longitude).toBe(-122.35);
      expect(result.zoom).toBeCloseTo(1 + Math.log2(304 / 900));
    });
    test('uses live globe limits even when generic map bounds differ', () => {
      const source = {
        longitude: 0,
        latitude: 0,
        zoom: 4,
        minZoom: 0,
        maxZoom: 30,
        width: 1440,
        height: 900,
        globe: {enabled: true}
      };
      const result = scaleToVideoExport(source, {width: 360, height: 225});
      expect(result.minZoom).toBe(GLOBE_MIN_ZOOM - 2);
      expect(result.maxZoom).toBe(GLOBE_MAX_ZOOM - 2);
    });

    test.each([undefined, 0])('leaves zoom unchanged when source dimensions are %s', size => {
      const source = {
        longitude: 0,
        latitude: 0,
        zoom: 4,
        width: size,
        height: size,
        globe: {enabled: true}
      };
      expect(scaleToVideoExport(source, {width: 360, height: 225})).toMatchObject({
        zoom: 4,
        zoomOffset: 0,
        minZoom: GLOBE_MIN_ZOOM,
        maxZoom: GLOBE_MAX_ZOOM
      });
    });

    test.each([0, 40])('preserves the globe framing at latitude %s', latitude => {
      const {KeplerGlobeView} = require('@kepler.gl/deckgl-layers');
      const source = {
        longitude: 0,
        latitude,
        zoom: 3,
        pitch: 0,
        bearing: 0,
        width: 1440,
        height: 900,
        globe: {enabled: true}
      };
      const preview = scaleToVideoExport(source, {width: 360, height: 225});
      const view = new KeplerGlobeView();
      const project = (camera, point) => {
        const viewport = view.makeViewport({...camera, viewState: camera});
        const [x, y] = viewport.project(point);
        return [x / camera.width, y / camera.height];
      };
      for (const point of [
        [0, latitude],
        [30, latitude],
        [-20, latitude + 10]
      ]) {
        const expected = project(source, point);
        const actual = project(preview, point);
        expect(actual[0]).toBeCloseTo(expected[0]);
        expect(actual[1]).toBeCloseTo(expected[1]);
      }
      expect(preview.minZoom).toBe(GLOBE_MIN_ZOOM - 2);
      expect(preview.maxZoom).toBe(GLOBE_MAX_ZOOM - 2);
      expect(scaleToVideoExport({...source, ...preview}, preview)).toEqual(preview);
    });
  });
});

jest.mock('@kepler.gl/reducers', () => ({computeDeckLayers: jest.fn()}));
jest.mock('@kepler.gl/deckgl-layers', () => ({
  KeplerGlobeView: jest.requireActual('../../../deckgl-layers/src/globe/globe-view')
    .KeplerGlobeView,
  getGlobeBaseLayers: jest.fn(),
  getGlobeTopLayers: jest.fn()
}));

describe('globe export layer composition', () => {
  const {computeDeckLayers} = require('@kepler.gl/reducers');
  const {getGlobeBaseLayers, getGlobeTopLayers} = require('@kepler.gl/deckgl-layers');
  const state = {
    visState: {layerBlending: 'normal'},
    mapState: {longitude: 12, latitude: 40, zoom: 2, globe: {enabled: true}},
    mapStyle: {styleType: 'dark'}
  };
  beforeEach(() => {
    jest.clearAllMocks();
    getGlobeBaseLayers.mockImplementation(() => [{id: 'base'}]);
    getGlobeTopLayers.mockImplementation(() => [{id: 'top'}]);
    computeDeckLayers.mockImplementation(() => [{id: 'data'}]);
  });

  test('orders globe background, data and atmosphere for capture', () => {
    const props = getHubbleDeckGlProps(state, 'export-token', 'https://maps.test');
    expect(props.layers.map(layer => layer.id)).toEqual(['base', 'data', 'top']);
    expect(computeDeckLayers).toHaveBeenCalledWith(state, {
      primaryMap: true,
      mapboxApiAccessToken: 'export-token',
      mapboxApiUrl: 'https://maps.test'
    });
    expect(getGlobeBaseLayers).toHaveBeenCalledWith({
      globe: state.mapState.globe,
      mapStyleType: 'dark',
      mapboxApiAccessToken: 'export-token',
      latitude: 40,
      zoom: 2
    });
  });

  test('seeds a valid interactive globe camera even when pitch and bearing are absent', () => {
    const props = getHubbleDeckGlProps(state, 'token');
    expect(props.initialViewState).toMatchObject({
      longitude: 12,
      latitude: 40,
      zoom: 2,
      pitch: 0,
      bearing: 0
    });
    expect(props.initialViewState.minZoom).toBe(props.controller.minZoom);
    expect(props.initialViewState.maxZoom).toBe(props.controller.maxZoom);
    expect(props.initialViewState.minZoom).toBe(GLOBE_MIN_ZOOM);
    expect(props.initialViewState.maxZoom).toBe(GLOBE_MAX_ZOOM);
  });

  test('keeps globe controller bounds and tile detail aligned with the scaled preview', () => {
    const tile = new MVTLayer({id: 'basemap', data: [], zoomOffset: -1});
    getGlobeBaseLayers.mockReturnValue([tile]);
    const scaledMap = {
      ...state.mapState,
      ...scaleToVideoExport(
        {...state.mapState, width: 1440, height: 900},
        {width: 360, height: 225}
      )
    };
    const props = getHubbleDeckGlProps({...state, mapState: scaledMap}, 'token');
    expect(props.controller).toEqual({minZoom: 0, maxZoom: 14});
    expect(props.initialViewState).toMatchObject({zoom: 0, minZoom: 0, maxZoom: 14});
    expect(props.layers[0].props.zoomOffset).toBe(1);
    expect(tile.props.zoomOffset).toBe(-1);
    expect(getGlobeBaseLayers).toHaveBeenLastCalledWith(
      expect.objectContaining({latitude: 40, zoom: 2})
    );
    expect(getGlobeTopLayers).toHaveBeenLastCalledWith({globe: state.mapState.globe, zoom: 2});
    getGlobeExportLayers(
      {...state, mapState: scaledMap},
      {
        mapIndex: 0,
        viewState: {...scaledMap, zoom: 1, latitude: 30}
      }
    );
    expect(getGlobeBaseLayers).toHaveBeenLastCalledWith(
      expect.objectContaining({latitude: 30, zoom: 3})
    );
    expect(getGlobeTopLayers).toHaveBeenLastCalledWith({globe: state.mapState.globe, zoom: 3});
  });

  test.each([TileLayer, MVTLayer])(
    'preserves tile selection detail for %p data layers',
    LayerType => {
      const {KeplerGlobeView} = require('@kepler.gl/deckgl-layers');
      const source = {...state.mapState, zoom: 4, width: 1440, height: 900};
      const preview = {...source, ...scaleToVideoExport(source, {width: 360, height: 225})};
      const tile = new LayerType({id: 'data-tile', data: [], zoomOffset: -1});
      const ordinary = {id: 'ordinary'};
      computeDeckLayers.mockReturnValue([null, [tile, ordinary]]);
      const selectedZooms = (camera, layer) => {
        const view = new KeplerGlobeView().makeViewport({...camera, viewState: camera});
        const tileset = new _Tileset2D({zoomOffset: layer.props.zoomOffset});
        return [
          ...new Set(tileset.getTileIndices({viewport: view, zRange: null}).map(index => index.z))
        ];
      };
      for (const layers of [
        getHubbleDeckGlProps({...state, mapState: preview}, 'token').layers,
        getGlobeExportLayers({...state, mapState: preview}, {mapIndex: 0})
      ]) {
        const [exported, unchanged] = layers
          .flat(Infinity)
          .filter(layer => layer?.id === 'data-tile' || layer === ordinary);
        expect(exported).not.toBe(tile);
        expect(exported.props.zoomOffset).toBe(1);
        expect(selectedZooms(preview, exported)).toEqual(selectedZooms(source, tile));
        expect(selectedZooms(source, tile).length).toBeGreaterThan(0);
        expect(unchanged).toBe(ordinary);
      }
      expect(tile.props.zoomOffset).toBe(-1);
    }
  );

  test('preserves the current tilted camera in the globe export', () => {
    const props = getHubbleDeckGlProps(
      {...state, mapState: {...state.mapState, pitch: 30, bearing: -45}},
      'token'
    );
    expect(props.initialViewState).toMatchObject({pitch: 30, bearing: -45});
    expect(props.views.props.clearColor).toBe(false);
  });

  test('flat deck props leave layers to the per-frame export renderer', () => {
    const props = getHubbleDeckGlProps(
      {...state, mapState: {...state.mapState, globe: {enabled: false}}},
      'token'
    );
    expect(props.controller).toBe(true);
    expect(props.views.id).toBe('mapbox');
    expect(props.layers).toBeUndefined();
    expect(computeDeckLayers).not.toHaveBeenCalled();
    expect(getGlobeBaseLayers).not.toHaveBeenCalled();
  });

  test('builds separate layer instances and split visibility for each export deck', () => {
    const left = getGlobeExportLayers(state, {mapIndex: 0});
    const right = getGlobeExportLayers(state, {mapIndex: 1});
    expect(left.map(layer => layer.id)).toEqual(['base', 'data', 'top']);
    left.forEach((layer, i) => expect(layer).not.toBe(right[i]));
    expect(
      computeDeckLayers.mock.calls.map(call => [call[1].mapIndex, call[1].primaryMap])
    ).toEqual([
      [0, true],
      [1, false]
    ]);
  });

  test('uses the animated camera for zoom-dependent data layers without mutating the source map', () => {
    const viewState = {longitude: 30, latitude: 50, zoom: 8, bearing: 90};
    getGlobeExportLayers(state, {
      mapIndex: 1,
      viewState,
      mapboxApiAccessToken: 'key',
      mapboxApiUrl: 'https://maps.test'
    });
    expect(computeDeckLayers.mock.calls[0][0]).toEqual({
      ...state,
      mapState: {...state.mapState, ...viewState}
    });
    expect(computeDeckLayers.mock.calls[0][1]).toMatchObject({
      mapboxApiAccessToken: 'key',
      mapboxApiUrl: 'https://maps.test'
    });
    expect(state.mapState.zoom).toBe(2);
    expect(state.mapState.longitude).toBe(12);
  });

  test('passes the elapsed frame to globe layer visibility without changing saved state', () => {
    getGlobeExportLayers(state, {mapIndex: 1, animationTimeMs: 3500});
    expect(computeDeckLayers.mock.lastCall[0]).toMatchObject({animationTimeMs: 3500});
    expect(state).not.toHaveProperty('animationTimeMs');
    getGlobeExportLayers(state, {mapIndex: 1});
    expect(computeDeckLayers.mock.lastCall[0].animationTimeMs).toBeUndefined();
  });

  test('does not add a flat basemap behind the globe preview', () => {
    const props = getStaticMapProps(
      {...state, mapStyle: {...state.mapStyle, bottomMapStyle: {layers: [{id: 'flat'}]}}},
      jest.fn(),
      'key'
    );
    expect(props.mapStyle.layers).toEqual([]);
  });
});

describe('flat export zoom fading', () => {
  const {computeDeckLayers} = require('@kepler.gl/reducers');
  const realComputeDeckLayers = jest.requireActual(
    '../../../reducers/src/layer-utils'
  ).computeDeckLayers;
  const stops = {appear: 2, full: 4, fade: 8, gone: 10};

  function makeDeckLayer(props) {
    return {id: props.id, props, clone: next => makeDeckLayer({...props, ...next})};
  }

  function setup() {
    const source = makeDeckLayer({
      id: 'data-layer',
      opacity: 0.8,
      visible: true,
      pickable: true,
      _subLayerProps: {'polygons-stroke': {opacity: 0.6}}
    });
    const layer = {
      id: 'a',
      config: {dataId: 'data', isVisible: true},
      overlayType: 'deckgl',
      shouldRenderLayer: () => true,
      renderLayer: ({visible}) => [source.clone({visible: layer.config.isVisible && visible})]
    };
    const state = {
      visState: {
        datasets: {},
        effects: [],
        layers: [layer],
        layerData: [{}],
        layerOrder: ['a'],
        splitMaps: [],
        interactionConfig: {
          zoomOpacity: {
            enabled: true,
            config: {controllers: [{id: 'fade', layerIds: ['a'], stops: {...stops}}]}
          }
        }
      },
      mapState: {longitude: 12, latitude: 40, zoom: 6},
      mapStyle: {visibleLayerGroups: {}}
    };
    return {source, state};
  }

  beforeEach(() => {
    computeDeckLayers.mockImplementation(realComputeDeckLayers);
  });

  test('follows each animated frame without capturing fully faded layers or changing the saved map', () => {
    const {source, state} = setup();
    const savedInteraction = JSON.parse(JSON.stringify(state.visState.interactionConfig));
    const frames = [1, 3, 6, 9, 10].map(zoom =>
      getFlatExportLayers(state, {
        mapIndex: 0,
        viewState: {...state.mapState, zoom},
        beforeId: 'labels'
      })
    );

    expect(frames.map(layers => layers.map(layer => layer.props.opacity))).toEqual([
      [],
      [0.4],
      [0.8],
      [0.4],
      []
    ]);
    expect(frames[1][0].props._subLayerProps['polygons-stroke'].opacity).toBe(0.3);
    frames.flat().forEach(layer => {
      expect(layer.props.visible).toBe(true);
      expect(layer.props.pickable).toBe(false);
      expect(layer.props.beforeId).toBe('labels');
    });
    expect(source.props.opacity).toBe(0.8);
    expect(source.props._subLayerProps['polygons-stroke'].opacity).toBe(0.6);
    expect(source.props.pickable).toBe(true);
    expect(state.mapState.zoom).toBe(6);
    expect(state.visState.interactionConfig).toEqual(savedInteraction);
  });

  test.each(['disabled', 'unassigned'])('preserves base opacity when fading is %s', condition => {
    const {state} = setup();
    const fade = state.visState.interactionConfig.zoomOpacity;
    if (condition === 'disabled') fade.enabled = false;
    else fade.config.controllers[0].layerIds = ['other'];

    const [layer] = getFlatExportLayers(state, {
      mapIndex: 0,
      viewState: {...state.mapState, zoom: 1}
    });

    expect(layer.props.opacity).toBe(0.8);
    expect(layer.props.visible).toBe(true);
    expect(layer.props._subLayerProps['polygons-stroke'].opacity).toBe(0.6);
  });

  test('excludes config-hidden layers from capture readiness', () => {
    const {state} = setup();
    state.visState.layers[0].config.isVisible = false;

    expect(getFlatExportLayers(state, {mapIndex: 0})).toEqual([]);
    expect(state.visState.layers[0].config.isVisible).toBe(false);
  });

  test('combines scheduled fades and zoom fades at elapsed export times and restores static opacity', () => {
    const {source, state} = setup();
    const timing = {startTimeMs: 2000, endTimeMs: 6000, fadeInMs: 1000, fadeOutMs: 1000};
    state.visState.layers[0].config.visibilityTiming = timing;
    const frames = [0, 2000, 2500, 3500, 5500, 6000].map(animationTimeMs =>
      getFlatExportLayers(state, {
        mapIndex: 0,
        viewState: {...state.mapState, zoom: 3},
        animationTimeMs
      })
    );
    expect(frames.map(layers => layers.map(layer => layer.props.opacity))).toEqual([
      [],
      [],
      [0.2],
      [0.4],
      [0.2],
      []
    ]);
    expect(frames[2][0].props._subLayerProps['polygons-stroke'].opacity).toBe(0.15);
    expect(getFlatExportLayers(state, {mapIndex: 0})[0].props.opacity).toBe(0.8);
    expect(state.visState.layers[0].config.visibilityTiming).toEqual(timing);
    expect(source.props.opacity).toBe(0.8);
  });

  test('multiple opacity blocks hold through gaps and match live rendering at each export frame', () => {
    const {source, state} = setup();
    const transitions = [
      {
        id: 'in',
        startTimeMs: 1000,
        endTimeMs: 3000,
        startValue: 0,
        endValue: 0.5,
        easing: 'linear'
      },
      {
        id: 'up',
        startTimeMs: 6000,
        endTimeMs: 8000,
        startValue: 0.5,
        endValue: 1,
        easing: 'linear'
      },
      {
        id: 'out',
        startTimeMs: 10000,
        endTimeMs: 12000,
        startValue: 1,
        endValue: 0,
        easing: 'linear'
      }
    ];
    const config = state.visState.layers[0].config;
    config.opacityTransitions = transitions;
    config.visibilityTiming = {startTimeMs: 0, endTimeMs: 1000, fadeInMs: 0, fadeOutMs: 0};
    const saved = JSON.stringify(config);
    const times = [0, 2000, 4000, 7000, 9000, 11000, 12000];
    const viewState = {...state.mapState, zoom: 3};
    const frames = times.map(animationTimeMs =>
      getFlatExportLayers(state, {
        mapIndex: 0,
        viewState,
        animationTimeMs
      })
    );
    const live = times.map(animationTimeMs =>
      realComputeDeckLayers(
        {...state, mapState: viewState, animationTimeMs},
        {mapIndex: 0, primaryMap: true}
      )
        .flat(Infinity)
        .filter(layer => layer.props.visible !== false)
    );
    const expected = [0, 0.1, 0.2, 0.3, 0.4, 0.2, 0];
    frames.forEach((frame, index) => {
      expect(frame.length).toBe(expected[index] === 0 ? 0 : 1);
      expect(live[index].length).toBe(frame.length);
      if (frame.length) {
        expect(frame[0].props.opacity).toBeCloseTo(expected[index]);
        expect(frame[0].props.opacity).toBe(live[index][0].props.opacity);
        expect(frame[0].props.pickable).toBe(false);
      }
    });
    expect(frames[1][0].props._subLayerProps['polygons-stroke'].opacity).toBeCloseTo(0.075);
    expect(getFlatExportLayers(state, {mapIndex: 0})[0].props.opacity).toBe(0.8);
    expect(JSON.stringify(config)).toBe(saved);
    expect(source.props.opacity).toBe(0.8);
  });

  test('native numeric and color values match live and export frames alongside opacity transitions', () => {
    const {source, state} = setup();
    const layer = state.visState.layers[0];
    layer.animatableProps = [
      {name: 'opacity', label: 'Opacity', range: [0, 1], step: 0.01},
      {name: 'radius', label: 'Radius', range: [0, 100], step: 0.1},
      {name: 'color', label: 'Color', type: 'color'},
      {name: 'strokeColor', label: 'Stroke color', type: 'color'}
    ];
    layer.config.color = [10, 20, 30];
    layer.config.visConfig = {radius: 9, opacity: 0.8, strokeColor: [40, 50, 60]};
    layer.config.propertyTransitions = {
      opacity: [
        {id: 'dim', startTimeMs: 0, endTimeMs: 2000, startValue: 1, endValue: 0.5, easing: 'linear'}
      ],
      color: [
        {
          id: 'warm-to-cool',
          startTimeMs: 1000,
          endTimeMs: 3000,
          startValue: [200, 0, 0],
          endValue: [0, 100, 200],
          easing: 'linear'
        },
        {
          id: 'cool-to-green',
          startTimeMs: 8000,
          endTimeMs: 10000,
          startValue: [0, 100, 200],
          endValue: [40, 80, 0],
          easing: 'linear'
        }
      ],
      strokeColor: [
        {
          id: 'stroke',
          startTimeMs: 0,
          endTimeMs: 2000,
          startValue: [0, 0, 0],
          endValue: [100, 120, 140],
          easing: 'linear'
        }
      ],
      radius: [
        {
          id: 'grow',
          startTimeMs: 1000,
          endTimeMs: 3000,
          startValue: 2,
          endValue: 6,
          easing: 'linear'
        },
        {
          id: 'shrink',
          startTimeMs: 8000,
          endTimeMs: 10000,
          startValue: 6,
          endValue: 4,
          easing: 'linear'
        }
      ]
    };
    layer.renderLayer = function () {
      return [
        source.clone({
          radiusScale: this.config.visConfig.radius,
          getFillColor: this.config.color,
          getLineColor: this.config.visConfig.strokeColor
        })
      ];
    };
    const saved = JSON.stringify(layer.config);
    const viewState = {...state.mapState, zoom: 3};
    const times = [0, 2000, 5000, 9000, 12000];
    const expectedRadius = [2, 4, 6, 5, 4];
    const expectedOpacity = [0.4, 0.2, 0.2, 0.2, 0.2];
    const expectedColors = [
      [200, 0, 0],
      [100, 50, 100],
      [0, 100, 200],
      [20, 90, 100],
      [40, 80, 0]
    ];
    times.forEach((animationTimeMs, index) => {
      const [live] = realComputeDeckLayers(
        {...state, mapState: viewState, animationTimeMs},
        {mapIndex: 0, primaryMap: true}
      ).flat(Infinity);
      const [exported] = getFlatExportLayers(state, {mapIndex: 0, viewState, animationTimeMs});
      expect(exported.props.radiusScale).toBe(expectedRadius[index]);
      expect(exported.props.radiusScale).toBe(live.props.radiusScale);
      expect(exported.props.opacity).toBeCloseTo(expectedOpacity[index]);
      expect(exported.props.opacity).toBe(live.props.opacity);
      expect(exported.props.getFillColor).toEqual(expectedColors[index]);
      expect(exported.props.getFillColor).toEqual(live.props.getFillColor);
      expect(exported.props.getLineColor).toEqual(index === 0 ? [0, 0, 0] : [100, 120, 140]);
      expect(exported.props.getLineColor).toEqual(live.props.getLineColor);
      const globe = getGlobeExportLayers(state, {mapIndex: 0, viewState, animationTimeMs})
        .flat(Infinity)
        .find(deckLayer => deckLayer.id === live.id);
      expect(globe).toBeDefined();
      expect(globe.props.getFillColor).toEqual(live.props.getFillColor);
      expect(globe.props.getLineColor).toEqual(live.props.getLineColor);
    });
    const [staticLayer] = getFlatExportLayers(state, {mapIndex: 0});
    expect(staticLayer.props.radiusScale).toBe(9);
    expect(staticLayer.props.getFillColor).toEqual([10, 20, 30]);
    expect(staticLayer.props.getLineColor).toEqual([40, 50, 60]);
    expect(JSON.stringify(layer.config)).toBe(saved);
  });

  test('excludes split-hidden layers and creates separate visible instances', () => {
    const {state} = setup();
    state.visState.splitMaps = [{layers: {a: true}}, {layers: {a: false}}];
    const [left] = getFlatExportLayers(state, {mapIndex: 0});
    const right = getFlatExportLayers(state, {mapIndex: 1});
    const [nextLeft] = getFlatExportLayers(state, {mapIndex: 0});

    expect(left.props.visible).toBe(true);
    expect(right).toEqual([]);
    expect(nextLeft.props.visible).toBe(true);
    expect(nextLeft).not.toBe(left);
    expect(state.visState.splitMaps).toEqual([{layers: {a: true}}, {layers: {a: false}}]);
  });
});

describe('export zoom-fade scaling', () => {
  const {getLayerZoomOpacityFactor} = jest.requireActual('../../../reducers/src/interaction-utils');
  const interactionConfig = {
    tooltip: {enabled: true},
    zoomOpacity: {
      enabled: true,
      config: {
        controllers: [{id: 'fade', layerIds: ['a'], stops: {appear: 2, full: 4, fade: 8, gone: 10}}]
      }
    }
  };
  const map = {longitude: 12, latitude: 40, zoom: 6, width: 1440, height: 900};

  test.each([
    {width: 360, height: 225},
    {width: 540, height: 304}
  ])('preserves authored fades in a $width × $height export preview', container => {
    const original = JSON.parse(JSON.stringify(interactionConfig));
    const offset = scaleToVideoExport(map, container).zoom - map.zoom;
    const scaled = scaleZoomOpacityForVideoExport(interactionConfig, offset);

    for (const zoom of [1, 2, 3, 4, 6, 8, 9, 10, 12]) {
      expect(getLayerZoomOpacityFactor('a', zoom + offset, scaled)).toBeCloseTo(
        getLayerZoomOpacityFactor('a', zoom, interactionConfig)
      );
    }
    expect(scaled).not.toBe(interactionConfig);
    expect(scaled.zoomOpacity.config.controllers[0].stops).not.toBe(
      interactionConfig.zoomOpacity.config.controllers[0].stops
    );
    expect(scaled.tooltip).toEqual(interactionConfig.tooltip);
    expect(interactionConfig).toEqual(original);
  });

  test('preserves globe fades at the resized preview zoom', () => {
    const globeMap = {...map, globe: {enabled: true}};
    const offset = scaleToVideoExport(globeMap, {width: 360, height: 225}).zoom - map.zoom;

    expect(offset).toBe(-2);
    const scaled = scaleZoomOpacityForVideoExport(interactionConfig, offset);
    expect(getLayerZoomOpacityFactor('a', map.zoom + offset, scaled)).toBe(
      getLayerZoomOpacityFactor('a', map.zoom, interactionConfig)
    );
  });

  test.each([0, NaN, Infinity, -Infinity])(
    'leaves fade settings unchanged for offset %s',
    offset => {
      expect(scaleZoomOpacityForVideoExport(interactionConfig, offset)).toBe(interactionConfig);
    }
  );

  test('accepts missing fade settings', () => {
    const withoutFade = {tooltip: {enabled: true}};
    expect(scaleZoomOpacityForVideoExport(undefined, -2)).toBeUndefined();
    expect(scaleZoomOpacityForVideoExport(withoutFade, -2)).toBe(withoutFade);
  });
});
