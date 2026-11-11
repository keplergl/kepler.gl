// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {MapSplitMode} from '@kepler.gl/constants';

const mockExportVideoPanelContainer = jest.fn(() => (
  <div data-testid="export-video-panel">Mock Panel</div>
));
const MockKeplerUIContext = React.createContext(null);

jest.mock('@hubble.gl/react', () => ({
  ExportVideoPanelContainer: class extends require('react').Component {
    static contextType = MockKeplerUIContext;
    state = {viewState: {}};
    setViewState(viewState) {
      this.setState({viewState});
    }
    render() {
      return mockExportVideoPanelContainer(this.props, this.context);
    }
  },
  KeplerUIContext: MockKeplerUIContext
}));

// loadHubble imports these containers even for regular export. Keep their WebGL
// and encoder dependencies out of the modal unit tests and first-render timeout.
jest.mock('./swipe-export-video-container', () => ({
  SwipeExportVideoPanelContainer: jest.fn(() => null)
}));

jest.mock('./globe-export-video-container', () => ({
  GlobeExportVideoPanelContainer: jest.fn(() => null)
}));

jest.mock('./swipe-export-video-preview', () => ({
  SwipeExportVideoPreview: jest.fn(() => null)
}));

jest.mock('./globe-export-video-preview', () => ({
  GlobeExportVideoPreview: jest.fn(() => null)
}));

// Exercise the settings' controlled range without pointer geometry in JSDOM.
jest.mock('../common/slider/slider', () => ({
  __esModule: true,
  default: ({value1, minValue, maxValue, step, onSlider1Change}) => (
    <input
      type="range"
      value={value1}
      min={minValue}
      max={maxValue}
      step={step}
      onChange={event => onSlider1Change(Number(event.target.value))}
    />
  )
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
  getAnimatableFilters: jest.fn(() => []),
  scaleToVideoExport: jest.fn((viewState, container) => ({
    ...viewState,
    width: container.width,
    height: container.height
  })),
  getVideoExportContainer: jest.fn((exportVideoWidth, resolution) => {
    const [width, height] = String(resolution || '1280x720')
      .split('x')
      .map(Number);
    return {width: exportVideoWidth, height: exportVideoWidth / (width / height)};
  }),
  getResolutionSetting: jest.fn(value => {
    const [width, height] = String(value || '1280x720')
      .split('x')
      .map(Number);
    return {value, width, height, label: value};
  })
}));

import ExportVideoModalFactory from './export-video-modal';
import {DeckShadowCompositingEffect} from '@kepler.gl/effects';

function renderWithThemeLocal(component) {
  return render(component, {
    wrapper: ({children}) => (
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          {children}
        </IntlProvider>
      </ThemeProvider>
    )
  });
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
    resolution: '1280x720',
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
    expect(mockExportVideoPanelContainer).toHaveBeenCalled();
  });

  test('passes correct props to ExportVideoPanelContainer', async () => {
    await renderAndWaitForPanel();

    expect(mockExportVideoPanelContainer).toHaveBeenCalled();
    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];

    expect(panelProps.header).toBe(false);
    expect(panelProps.disableBaseMap).toBe(false);
    expect(panelProps.defaultFileName).toBe('kepler.gl');
    expect(panelProps.exportVideoWidth).toBeLessThanOrEqual(540);
    expect(panelProps.exportVideoWidth).toBeGreaterThanOrEqual(320);
    expect(panelProps.handleClose).toBe(DEFAULT_PROPS.onClose);
    expect(panelProps.initialState).toEqual(DEFAULT_PROPS.exportVideo);
    expect(panelProps.mapData.visState).toEqual(DEFAULT_PROPS.visState);
    expect(panelProps.mapData.mapStyle).toEqual(DEFAULT_PROPS.mapStyle);
    expect(panelProps.mapData.mapState).toEqual(
      expect.objectContaining({
        latitude: DEFAULT_PROPS.mapState.latitude,
        longitude: DEFAULT_PROPS.mapState.longitude,
        zoom: DEFAULT_PROPS.mapState.zoom,
        width: panelProps.exportVideoWidth,
        height: expect.any(Number)
      })
    );
  });

  test('offers authored animation only for a playable tour and keeps saved cameras unchanged', async () => {
    const camera = {longitude: 12, latitude: 30, zoom: 5, bearing: 0, pitch: 0};
    const cameraTour = {
      stops: [{id: 'a', name: 'A', camera, holdDurationMs: 15000, travelDurationMs: 0}]
    };
    await renderAndWaitForPanel({
      ...DEFAULT_PROPS,
      visState: {...DEFAULT_PROPS.visState, cameraTour}
    });
    const [props, ui] = mockExportVideoPanelContainer.mock.calls[0];
    expect(ui.ItemSelector({options: ['None', 'Orbit (90º)']}).props.options).toContain(
      'Camera Animation'
    );
    expect(ui.ItemSelector({options: ['gif', 'webm']}).props.options).not.toContain(
      'Camera Animation'
    );
    expect(ui.Slider({maxValue: 10000, value1: 15000}).props.maxValue).toBe(15000);
    expect(props.mapData.visState.cameraTour.stops[0].camera).toEqual(camera);
    expect(cameraTour.stops[0].camera).toBe(camera);
  });

  describe('default camera preset', () => {
    const modes = [
      {mode: 'regular', mapState: {}, panel: mockExportVideoPanelContainer},
      {
        mode: 'globe',
        mapState: {globe: {enabled: true}},
        panel: jest.requireMock('./globe-export-video-container').GlobeExportVideoPanelContainer
      },
      {
        mode: 'swipe',
        mapState: {isSplit: true, mapSplitMode: MapSplitMode.SWIPE_COMPARE},
        panel: jest.requireMock('./swipe-export-video-container').SwipeExportVideoPanelContainer
      }
    ];
    const makeTour = duration => ({
      stops: [
        {
          id: 'a',
          name: 'A',
          camera: {longitude: 12, latitude: 30, zoom: 5, bearing: 0, pitch: 0},
          holdDurationMs: duration,
          travelDurationMs: 0
        }
      ]
    });

    test.each(modes)(
      '$mode export defaults to the authored animation and allows changing the preset',
      async ({mapState, panel}) => {
        const props = {
          ...DEFAULT_PROPS,
          mapState: {...DEFAULT_PROPS.mapState, ...mapState},
          visState: {...DEFAULT_PROPS.visState, cameraTour: makeTour(15000)}
        };
        const {rerender} = renderWithThemeLocal(<ExportVideoModal {...props} />);
        await waitFor(() => expect(panel).toHaveBeenCalled());
        expect(panel.mock.lastCall[0].initialState).toEqual({
          ...DEFAULT_PROPS.exportVideo,
          cameraPreset: 'Camera Animation',
          durationMs: 15000
        });
        act(() => {
          panel.mock.lastCall[0].onSettingsChange({cameraPreset: 'Zoom In', durationMs: 5000});
        });
        rerender(<ExportVideoModal {...props} containerW={1000} />);
        expect(panel.mock.lastCall[0].initialState).toMatchObject({
          cameraPreset: 'Zoom In',
          durationMs: 5000
        });
        expect(props.exportVideo.cameraPreset).toBe('None');
        expect(props.exportVideo.durationMs).toBe(1000);
      }
    );

    test.each(
      modes.flatMap(mode =>
        [
          {name: 'missing', cameraTour: undefined},
          {name: 'empty', cameraTour: {stops: []}},
          {name: 'zero-duration', cameraTour: makeTour(0)}
        ].map(tour => ({...mode, ...tour}))
      )
    )(
      '$mode export keeps existing settings for a $name tour',
      async ({mapState, panel, cameraTour}) => {
        renderWithThemeLocal(
          <ExportVideoModal
            {...DEFAULT_PROPS}
            mapState={{...DEFAULT_PROPS.mapState, ...mapState}}
            visState={{...DEFAULT_PROPS.visState, cameraTour}}
          />
        );
        await waitFor(() => expect(panel).toHaveBeenCalled());
        expect(panel.mock.lastCall[0].initialState).toEqual(DEFAULT_PROPS.exportVideo);
      }
    );
  });

  test('passes deckProps from getHubbleDeckGlProps', async () => {
    await renderAndWaitForPanel();

    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(panelProps.deckProps).toEqual({
      parameters: {blend: true},
      controller: true,
      views: {},
      _isExport: true,
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

  describe('devicePixelRatio freeze', () => {
    const originalDpr = window.devicePixelRatio;

    afterEach(() => {
      Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: originalDpr
      });
    });

    test('pins devicePixelRatio to export scale and restores it on unmount', async () => {
      const {unmount} = await renderAndWaitForPanel();
      const {exportVideoWidth} = mockExportVideoPanelContainer.mock.calls[0][0];

      expect(window.devicePixelRatio).toBe(1280 / exportVideoWidth);

      window.devicePixelRatio = 1;
      expect(window.devicePixelRatio).toBe(1280 / exportVideoWidth);

      unmount();
      expect(window.devicePixelRatio).toBe(originalDpr);
    });
  });
});

// Authored tours use the same evaluator in live playback and recorded frames.
describe('Camera Animation video export', () => {
  const {
    getCameraTourExportKeyframes,
    resolveCameraTourExportFrame,
    withCameraTourExport,
    CAMERA_TOUR_PRESET
  } = require('./camera-tour-export');
  const {CameraKeyframes} = require('@hubble.gl/core');
  const camera = {longitude: 179, latitude: 0, zoom: 4, bearing: 350, pitch: 30};
  const tour = {
    stops: [
      {id: 'a', name: 'Start', camera, holdDurationMs: 1000, travelDurationMs: 2000},
      {
        id: 'b',
        name: 'End',
        camera: {...camera, longitude: -179, bearing: 10},
        holdDurationMs: 1000,
        travelDurationMs: 0
      }
    ]
  };
  test('export clock scales duration and preserves holds and shortest rotations', () => {
    const spec = getCameraTourExportKeyframes(tour, CAMERA_TOUR_PRESET, 8000, {
      width: 800,
      height: 600
    });
    const keyframes = new CameraKeyframes(spec);
    const at = time => {
      keyframes.setTime(time);
      return resolveCameraTourExportFrame(keyframes.getFrame(), tour, {width: 800});
    };
    expect(at(0)).toMatchObject(camera);
    expect(at(1000)).toMatchObject(camera);
    expect(at(4000)).toMatchObject({longitude: 180, bearing: 360, width: 800});
    expect(at(8000)).toMatchObject(tour.stops[1].camera);
    expect(at(4000)).not.toHaveProperty('cameraTourTime');
  });
  test('globe export adapts evaluated frames without changing saved cameras', () => {
    const globe = resolveCameraTourExportFrame({cameraTourTime: 2000}, tour, {width: 800}, true);
    expect(globe).toMatchObject({longitude: 180, latitude: 0, bearing: 0, pitch: 0, width: 800});
    expect(tour.stops[0].camera).toEqual(camera);
  });
  test('ordinary presets and manual view updates are unchanged', () => {
    expect(
      getCameraTourExportKeyframes(tour, 'Orbit (90º)', 5000, {width: 800, height: 600})
    ).toBeNull();
    expect(
      getCameraTourExportKeyframes(null, CAMERA_TOUR_PRESET, 5000, {width: 800, height: 600})
    ).toBeNull();
    expect(resolveCameraTourExportFrame(camera, tour)).toBe(camera);
  });
  test('regular Hubble adapter defaults to authored duration and evaluates cut boundaries', () => {
    class Base {
      constructor() {
        this.props = {mapData: {visState: {cameraTour: tour}}};
        this.state = {viewState: {width: 800}, durationMs: 5000, cameraPreset: 'None'};
      }
      setStateAndNotify(update) {
        Object.assign(this.state, update);
      }
      getCanvasSize() {
        return {width: 800, height: 600};
      }
      getCameraKeyframes() {
        return 'ordinary';
      }
      setViewState(viewState) {
        this.state.viewState = viewState;
      }
    }
    const Container = withCameraTourExport(Base);
    const instance = new Container();
    expect(instance.getCameraKeyframes()).toBe('ordinary');
    instance.setCameraPreset(CAMERA_TOUR_PRESET);
    expect(instance.state.durationMs).toBe(4000);
    expect(instance.getCameraKeyframes().timings).toEqual([0, 4000]);
    instance.props.mapData.visState.cameraTour = {
      stops: [{...tour.stops[0], travelDurationMs: 0}, tour.stops[1]]
    };
    instance.setViewState({cameraTourTime: 1000});
    expect(instance.state.viewState).toMatchObject({...tour.stops[1].camera, width: 800});
    instance.setCameraPreset('Zoom In');
    expect(instance.getCameraKeyframes()).toBe('ordinary');
  });
});

describe('authored export duration range', () => {
  const camera = {longitude: 12, latitude: 30, zoom: 5, bearing: 0, pitch: 0};
  const makeTour = duration => ({
    stops: [{id: 'a', name: 'A', camera, holdDurationMs: duration, travelDurationMs: 0}]
  });

  test('regular export retains the authored maximum after shortening and updates it with the tour', async () => {
    const props = {
      ...DEFAULT_PROPS,
      visState: {...DEFAULT_PROPS.visState, cameraTour: makeTour(20000)}
    };
    const {rerender} = await renderAndWaitForPanel(props);
    let ui = mockExportVideoPanelContainer.mock.lastCall[1];
    expect(ui.Slider({maxValue: 10000, value1: 20000}).props.maxValue).toBe(20000);
    expect(ui.Slider({maxValue: 10000, value1: 15000}).props.maxValue).toBe(20000);
    expect(ui.Slider({maxValue: 100, value1: 50}).props.maxValue).toBe(100);
    rerender(
      <ExportVideoModal {...props} visState={{...props.visState, cameraTour: makeTour(30000)}} />
    );
    ui = mockExportVideoPanelContainer.mock.lastCall[1];
    expect(ui.Slider({maxValue: 10000, value1: 15000}).props.maxValue).toBe(30000);
  });

  test.each([
    ['globe', jest.requireActual('./globe-export-video-container').GlobeExportVideoPanelContainer],
    ['swipe', jest.requireActual('./swipe-export-video-container').SwipeExportVideoPanelContainer]
  ])(
    '%s export can restore a shortened authored duration without reselecting the preset',
    (mode, Container) => {
      const onSettingsChange = jest.fn();
      const props = {
        initialState: {durationMs: 20000, cameraPreset: 'Camera Animation'},
        mapData: {
          mapState: {...DEFAULT_PROPS.mapState, globe: {enabled: mode === 'globe'}},
          visState: {...DEFAULT_PROPS.visState, animationConfig: {}, cameraTour: makeTour(20000)}
        },
        exportVideoWidth: 480,
        mapProps: {},
        swipeStartPct: 0,
        swipeEndPct: 100,
        swipeEasing: 'linear',
        onSettingsChange
      };
      const {rerender} = renderWithThemeLocal(<Container {...props} />);
      const slider = screen.getAllByRole('slider')[0];
      expect(slider).toHaveAttribute('max', '20000');
      fireEvent.change(slider, {target: {value: '15000'}});
      expect(onSettingsChange).toHaveBeenLastCalledWith(
        expect.objectContaining({durationMs: 15000})
      );
      expect(slider).toHaveAttribute('max', '20000');
      fireEvent.change(slider, {target: {value: '20000'}});
      expect(onSettingsChange).toHaveBeenLastCalledWith(
        expect.objectContaining({durationMs: 20000})
      );
      rerender(
        <Container
          {...props}
          mapData={{
            ...props.mapData,
            visState: {...props.mapData.visState, cameraTour: makeTour(30000)}
          }}
        />
      );
      expect(slider).toHaveAttribute('max', '30000');
    }
  );
});
