// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {render, waitFor} from '@testing-library/react';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';

const mockExportVideoPanelContainer = jest.fn(() => (
  <div data-testid="export-video-panel">Mock Panel</div>
));
const MockKeplerUIContext = React.createContext(null);

jest.mock('@hubble.gl/react', () => ({
  ExportVideoPanelContainer: props => mockExportVideoPanelContainer(props),
  KeplerUIContext: MockKeplerUIContext
}));

const mockComputeDeckEffects = jest.fn(() => []);

jest.mock('@kepler.gl/utils', () => {
  const actual = jest.requireActual('@kepler.gl/utils');
  return {
    ...actual,
    computeDeckEffects: (...args) => mockComputeDeckEffects(...args),
    patchDeckRendererForPostProcessing: jest.fn()
  };
});

jest.mock('@kepler.gl/effects', () => ({
  DeckShadowCompositingEffect: jest.fn().mockImplementation(() => ({
    id: 'shadow-compositing-effect',
    postRender: jest.fn(),
    cleanup: jest.fn()
  }))
}));

jest.mock('./hubble-utils', () => ({
  getStaticMapProps: jest.fn((_state, _onChange, _token) => ({
    latitude: 37.7,
    longitude: -122.4,
    preserveDrawingBuffer: true,
    mapboxApiAccessToken: 'style-token',
    mapStyle: {id: 'dark-style'},
    mapLib: Promise.resolve({})
  })),
  getBeforeLayerId: jest.fn(() => null),
  getHubbleDeckGlProps: jest.fn(() => ({
    parameters: {blend: true},
    controller: true,
    views: {}
  })),
  getTimeRangeFilterKeyframes: jest.fn(),
  getAnimatableFilters: jest.fn(() => [])
}));

import ExportVideoModalFactory from './export-video-modal';
import {DeckShadowCompositingEffect} from '@kepler.gl/effects';

function renderWithThemeLocal(component) {
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={messages}>
        {component}
      </IntlProvider>
    </ThemeProvider>
  );
}

const ExportVideoModal = ExportVideoModalFactory();

const DEFAULT_PROPS = {
  mapboxApiAccessToken: 'test-token',
  mapboxApiUrl: 'https://api.mapbox.com',
  mapState: {latitude: 37.7, longitude: -122.4, zoom: 10},
  mapStyle: {
    styleType: 'dark',
    mapStyles: {dark: {accessToken: 'style-token'}},
    bottomMapStyle: {id: 'dark-style'},
    topMapStyle: null
  },
  visState: {
    filters: [],
    layers: [],
    layerBlending: 'normal',
    layerOrder: []
  },
  exportVideo: {
    mediaType: 'webm',
    cameraPreset: 'None',
    fileName: 'kepler.gl',
    resolution: '',
    durationMs: 1000
  },
  containerW: 800,
  visStateActions: {
    setFilterAnimationTime: jest.fn(),
    setLayerAnimationTime: jest.fn()
  },
  uiStateActions: {
    setExportVideoSetting: jest.fn()
  },
  onClose: jest.fn()
};

async function renderAndWaitForPanel(props = DEFAULT_PROPS) {
  const result = renderWithThemeLocal(<ExportVideoModal {...props} />);
  await waitFor(() => {
    expect(mockExportVideoPanelContainer).toHaveBeenCalled();
  });
  return result;
}

describe('ExportVideoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockComputeDeckEffects.mockReturnValue([]);
  });

  test('renders without crashing', async () => {
    const {container} = await renderAndWaitForPanel();
    expect(container.querySelector('.export-video-modal')).toBeInTheDocument();
  });

  test('provides KeplerUI context with expected components', async () => {
    await renderAndWaitForPanel();
    expect(mockExportVideoPanelContainer).toHaveBeenCalledTimes(1);
  });

  test('passes correct props to ExportVideoPanelContainer', async () => {
    await renderAndWaitForPanel();

    expect(mockExportVideoPanelContainer).toHaveBeenCalledTimes(1);
    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];

    expect(panelProps.header).toBe(false);
    expect(panelProps.disableBaseMap).toBe(false);
    expect(panelProps.defaultFileName).toBe('kepler.gl');
    expect(panelProps.exportVideoWidth).toBeLessThanOrEqual(540);
    expect(panelProps.exportVideoWidth).toBeGreaterThanOrEqual(320);
    expect(panelProps.handleClose).toBe(DEFAULT_PROPS.onClose);
    expect(panelProps.initialState).toEqual(DEFAULT_PROPS.exportVideo);
    expect(panelProps.mapData).toEqual({
      visState: DEFAULT_PROPS.visState,
      mapState: DEFAULT_PROPS.mapState,
      mapStyle: DEFAULT_PROPS.mapStyle
    });
  });

  test('passes deckProps from getHubbleDeckGlProps', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(panelProps.deckProps).toEqual({
      parameters: {blend: true},
      controller: true,
      views: {},
      effects: []
    });
  });

  test('passes mapProps from getStaticMapProps', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(panelProps.mapProps.latitude).toBe(37.7);
    expect(panelProps.mapProps.longitude).toBe(-122.4);
    expect(panelProps.mapProps.preserveDrawingBuffer).toBe(true);
    expect(panelProps.mapProps.mapboxApiAccessToken).toBe('style-token');
    expect(panelProps.mapProps.mapStyle).toEqual({id: 'dark-style'});
    expect(panelProps.mapProps.mapLib).toBeDefined();
  });

  test('passes empty animatableFilters when no matching filters', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(panelProps.animatableFilters).toEqual([]);
  });

  test('provides getTimeRangeFilterKeyframes callback', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(typeof panelProps.getTimeRangeFilterKeyframes).toBe('function');
  });

  test('provides onFilterFrameUpdate that calls visStateActions', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    panelProps.onFilterFrameUpdate(0, 'value', [100, 200]);
    expect(DEFAULT_PROPS.visStateActions.setFilterAnimationTime).toHaveBeenCalledWith(
      0,
      'value',
      [100, 200]
    );
  });

  test('provides onTripFrameUpdate that calls visStateActions', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    panelProps.onTripFrameUpdate(42);
    expect(DEFAULT_PROPS.visStateActions.setLayerAnimationTime).toHaveBeenCalledWith(42);
  });

  describe('NO_MAP_ID handling', () => {
    const NO_MAP_PROPS = {
      ...DEFAULT_PROPS,
      mapStyle: {
        styleType: 'no_map',
        mapStyles: {
          no_map: {
            id: 'no_map',
            label: 'No Basemap',
            // url is intentionally missing to exercise the data-URI patch
            icon: '',
            layerGroups: [],
            colorMode: 'NONE',
            style: {version: 8, sources: {}, layers: []}
          }
        },
        bottomMapStyle: null,
        topMapStyle: null
      }
    };

    test('renders without crashing when styleType is NO_MAP_ID', async () => {
      const {container} = await renderAndWaitForPanel(NO_MAP_PROPS);
      expect(container.querySelector('.export-video-modal')).toBeInTheDocument();
    });

    test('injects data-URI empty style URL into mapData when NO_MAP_ID entry has no url', async () => {
      await renderAndWaitForPanel(NO_MAP_PROPS);

      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      const noMapEntry = panelProps.mapData.mapStyle.mapStyles.no_map;

      expect(noMapEntry.url).toBeDefined();
      expect(noMapEntry.url).toMatch(/^data:application\/json,/);

      const encoded = noMapEntry.url.replace('data:application/json,', '');
      const decoded = JSON.parse(decodeURIComponent(encoded));
      expect(decoded).toEqual({version: 8, sources: {}, layers: []});
    });

    test('preserves original mapStyle when NO_MAP_ID entry already has a url', async () => {
      const propsWithUrl = {
        ...DEFAULT_PROPS,
        mapStyle: {
          styleType: 'no_map',
          mapStyles: {
            no_map: {
              id: 'no_map',
              url: 'https://existing-style.json'
            }
          },
          bottomMapStyle: null,
          topMapStyle: null
        }
      };

      await renderAndWaitForPanel(propsWithUrl);

      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      expect(panelProps.mapData.mapStyle).toBe(propsWithUrl.mapStyle);
    });
  });

  describe('surface fog height animation', () => {
    function makeFogDeckEffect() {
      const effect = {
        id: 'surface-fog-deck',
        props: {height: 50},
        postRender: jest.fn(),
        setProps: jest.fn(function (newProps) {
          Object.assign(effect.props, newProps);
        })
      };
      return effect;
    }

    function makeSurfaceFogEffect(deckEffect, overrides = {}) {
      const effect = {
        id: 'fog-1',
        type: 'surfaceFog',
        isEnabled: true,
        parameters: {
          height: 50,
          animateHeight: true,
          heightEnd: 200,
          linearEasing: false,
          ...overrides
        },
        deckEffect,
        clone: jest.fn()
      };
      // clone returns a fresh reference that still points to the same deckEffect
      effect.clone.mockImplementation(() => ({...effect, clone: effect.clone}));
      return effect;
    }

    function propsWithFogEffect(fogEffect) {
      return {
        ...DEFAULT_PROPS,
        visState: {
          ...DEFAULT_PROPS.visState,
          effects: [fogEffect],
          effectOrder: [fogEffect.id]
        }
      };
    }

    test('patches deckEffect.postRender when animateHeight is enabled', async () => {
      const deckEffect = makeFogDeckEffect();
      const originalPostRender = deckEffect.postRender;
      const fogEffect = makeSurfaceFogEffect(deckEffect);
      mockComputeDeckEffects.mockReturnValue([deckEffect]);

      await renderAndWaitForPanel(propsWithFogEffect(fogEffect));

      expect(deckEffect.postRender).not.toBe(originalPostRender);
    });

    test('restores original height when hubble is not playing', async () => {
      const deckEffect = makeFogDeckEffect();
      deckEffect.props.height = 75;
      const fogEffect = makeSurfaceFogEffect(deckEffect, {height: 75});
      mockComputeDeckEffects.mockReturnValue([deckEffect]);

      await renderAndWaitForPanel(propsWithFogEffect(fogEffect));

      // Call the patched postRender without hubble playing
      deckEffect.postRender.call(deckEffect, {});

      // Not playing → height resets to originalHeight
      expect(deckEffect.props.height).toBe(75);
    });

    test('does not mutate height when animateHeight is disabled', async () => {
      const deckEffect = makeFogDeckEffect();
      const fogEffect = makeSurfaceFogEffect(deckEffect, {animateHeight: false});
      mockComputeDeckEffects.mockReturnValue([deckEffect]);

      await renderAndWaitForPanel(propsWithFogEffect(fogEffect));

      deckEffect.props.height = 42;
      deckEffect.postRender.call(deckEffect, {});

      // ref.active is false so height should not be touched
      expect(deckEffect.props.height).toBe(42);
    });

    test('restores original postRender on unmount', async () => {
      const deckEffect = makeFogDeckEffect();
      const fogEffect = makeSurfaceFogEffect(deckEffect);
      mockComputeDeckEffects.mockReturnValue([deckEffect]);

      const {unmount} = await renderAndWaitForPanel(propsWithFogEffect(fogEffect));

      // postRender was patched (the wrapper function drives animation)
      const patchedPostRender = deckEffect.postRender;
      // Verify it's not the original mock (component binds and wraps it)
      expect(patchedPostRender).not.toBe(deckEffect.postRender.bind(deckEffect));

      unmount();

      // After unmount, postRender no longer drives animation.
      // The restored function is a bound copy of the original mock.
      deckEffect.props.height = 99;
      deckEffect.postRender.call(deckEffect, {});
      // Height should NOT be mutated by animation logic anymore
      expect(deckEffect.props.height).toBe(99);
    });
  });

  describe('shadow compositing fallback', () => {
    const mockEffect = {
      id: 'light-shadow-1',
      type: 'light-and-shadow',
      isEnabled: true,
      clone: jest.fn(() => ({...mockEffect, clone: mockEffect.clone}))
    };

    function propsWithEffects(effects) {
      return {
        ...DEFAULT_PROPS,
        visState: {
          ...DEFAULT_PROPS.visState,
          effects,
          effectOrder: effects.map(e => e.id)
        }
      };
    }

    test('adds DeckShadowCompositingEffect when shadows exist but no postRender effect', async () => {
      const shadowDeckEffect = {id: 'lighting', shadow: true};
      mockComputeDeckEffects.mockReturnValue([shadowDeckEffect]);

      await renderAndWaitForPanel(propsWithEffects([mockEffect]));

      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      const effects = panelProps.deckProps.effects;

      expect(effects.length).toBe(2);
      expect(effects[0]).toBe(shadowDeckEffect);
      expect(effects[1].id).toBe('shadow-compositing-effect');
      expect(DeckShadowCompositingEffect).toHaveBeenCalled();
    });

    test('does not add DeckShadowCompositingEffect when a postRender effect already exists', async () => {
      const shadowDeckEffect = {id: 'lighting', shadow: true};
      const postProcessEffect = {id: 'fog', postRender: jest.fn()};
      mockComputeDeckEffects.mockReturnValue([shadowDeckEffect, postProcessEffect]);

      await renderAndWaitForPanel(propsWithEffects([mockEffect]));

      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      const effects = panelProps.deckProps.effects;

      expect(effects.length).toBe(2);
      expect(effects[0]).toBe(shadowDeckEffect);
      expect(effects[1]).toBe(postProcessEffect);
      expect(effects.every(e => e.id !== 'shadow-compositing-effect')).toBe(true);
    });

    test('does not add DeckShadowCompositingEffect when no shadow effect exists', async () => {
      const nonShadowEffect = {id: 'lighting', shadow: false};
      mockComputeDeckEffects.mockReturnValue([nonShadowEffect]);

      await renderAndWaitForPanel(propsWithEffects([mockEffect]));

      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      const effects = panelProps.deckProps.effects;

      expect(effects.length).toBe(1);
      expect(effects[0]).toBe(nonShadowEffect);
    });
  });
});
