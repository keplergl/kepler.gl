// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {FILTER_TYPES, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {
  getTimeRangeFilterKeyframes,
  getBeforeLayerId,
  getStaticMapProps,
  getAnimatableFilters
} from './hubble-utils';

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  getBaseMapLibrary: jest.fn(() => 'maplibre')
}));

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
});
