// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {act, fireEvent, render, renderHook, screen, waitFor} from '@testing-library/react';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {MapSplitMode} from '@kepler.gl/constants';

const mockExportVideoPanelContainer = jest.fn(() => (
  <div data-testid="export-video-panel">Mock Panel</div>
));
const MockKeplerUIContext = React.createContext(null);
const mockHubbleContainerRef = React.createRef();

jest.mock('@hubble.gl/react', () => ({
  ExportVideoPanelContainer: class extends require('react').Component {
    static contextType = MockKeplerUIContext;
    state = {viewState: {}};
    constructor(props) {
      super(props);
      mockHubbleContainerRef.current = this;
    }
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
  ...jest.requireActual('../../../effects/src/animation-utils'),
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
  getFlatExportLayers: jest.fn(() => []),
  scaleZoomOpacityForVideoExport: jest.fn(config => config),
  parseSetCameraType: (...args) => jest.requireActual('./hubble-utils').parseSetCameraType(...args),
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
import {useEffectAnimation} from './effect-animation';
import {DeckShadowCompositingEffect} from '@kepler.gl/effects';
import LightingEffect from '../../../effects/src/lighting-effect';

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

  test('passes the preview zoom correction to export-only fade settings', async () => {
    const {scaleToVideoExport, scaleZoomOpacityForVideoExport} = require('./hubble-utils');
    const interactionConfig = {zoomOpacity: {enabled: true, config: {controllers: []}}};
    const scaled = {...interactionConfig, exportOnly: true};
    scaleToVideoExport.mockImplementationOnce((camera, container) => ({
      ...camera,
      ...container,
      zoom: camera.zoom - 2
    }));
    scaleZoomOpacityForVideoExport.mockReturnValueOnce(scaled);
    const props = {
      ...DEFAULT_PROPS,
      visState: {...DEFAULT_PROPS.visState, interactionConfig}
    };
    await renderAndWaitForPanel(props);
    const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
    expect(scaleZoomOpacityForVideoExport).toHaveBeenCalledWith(interactionConfig, -2);
    expect(panelProps.mapData.visState.interactionConfig).toBe(scaled);
    expect(props.visState.interactionConfig).toBe(interactionConfig);
    expect(interactionConfig).not.toHaveProperty('exportOnly');
  });

  test.each(['regular', 'swipe'])(
    'preserves fades and preview cameras when changing resolution in an open %s export',
    async mode => {
      const utils = require('./hubble-utils');
      const actualUtils = jest.requireActual('./hubble-utils');
      const {getLayerZoomOpacityFactor} = jest.requireActual(
        '../../../reducers/src/interaction-utils'
      );
      const originalScale = utils.scaleToVideoExport.getMockImplementation();
      const originalFadeScale = utils.scaleZoomOpacityForVideoExport.getMockImplementation();
      utils.scaleToVideoExport.mockImplementation(actualUtils.scaleToVideoExport);
      utils.scaleZoomOpacityForVideoExport.mockImplementation(
        actualUtils.scaleZoomOpacityForVideoExport
      );
      const mockSwipe = jest.requireMock(
        './swipe-export-video-container'
      ).SwipeExportVideoPanelContainer;
      const SwipeContainer = jest.requireActual(
        './swipe-export-video-container'
      ).SwipeExportVideoPanelContainer;
      let swipePanel;
      if (mode === 'swipe') {
        mockSwipe.mockImplementation(({ref, ...props}) => (
          <SwipeContainer
            {...props}
            ref={panel => {
              ref.current = panel;
              swipePanel = panel;
            }}
          />
        ));
      }
      const props = {
        ...DEFAULT_PROPS,
        mapState: {
          ...DEFAULT_PROPS.mapState,
          width: 1440,
          height: 900,
          zoom: 4.1,
          pitch: 0,
          bearing: 0,
          ...(mode === 'swipe' ? {isSplit: true, mapSplitMode: MapSplitMode.SWIPE_COMPARE} : {})
        },
        visState: {
          ...DEFAULT_PROPS.visState,
          animationConfig: {},
          interactionConfig: {
            zoomOpacity: {
              enabled: true,
              config: {
                controllers: [
                  {id: 'fade', layerIds: ['a'], stops: {appear: 4, full: 4.1, fade: 8, gone: 10}}
                ]
              }
            }
          }
        }
      };
      const savedProps = JSON.stringify({mapState: props.mapState, visState: props.visState});
      let mounted;
      try {
        mounted = renderWithThemeLocal(<ExportVideoModal {...props} />);
        await waitFor(() => {
          expect(mode === 'swipe' ? mockSwipe : mockExportVideoPanelContainer).toHaveBeenCalled();
          expect(mode === 'swipe' ? swipePanel : mockHubbleContainerRef.current).toBeTruthy();
        });
        const panel = mode === 'swipe' ? swipePanel : mockHubbleContainerRef.current;
        const initialCamera = {...panel.state.viewState};
        const userCamera = {
          ...initialCamera,
          longitude: 20,
          bearing: 35,
          pitch: 40,
          zoom: initialCamera.zoom + 0.02
        };
        act(() => panel.setViewState(userCamera));
        const opacity = () =>
          getLayerZoomOpacityFactor(
            'a',
            panel.state.viewState.zoom,
            panel.props.mapData.visState.interactionConfig
          );
        expect(opacity()).toBeCloseTo(1);

        for (const resolution of ['1280x960', '1920x1440', '1280x720']) {
          act(() => {
            if (mode === 'swipe') panel.setResolution(resolution);
            else panel.props.onSettingsChange({resolution});
          });
          const settings = mode === 'swipe' ? panel.state : panel.props.initialState;
          expect(settings.resolution).toBe(resolution);
          const {width, height, zoom} = panel.props.mapData.mapState;
          const zoomDelta = zoom - initialCamera.zoom;
          expect(opacity()).toBeCloseTo(1);
          expect(panel.state.viewState).toMatchObject({
            ...userCamera,
            width,
            height,
            zoom: userCamera.zoom + zoomDelta
          });
          expect(panel.state.memo.viewState).toMatchObject({
            ...initialCamera,
            width,
            height,
            zoom: initialCamera.zoom + zoomDelta
          });
          expect(mode === 'swipe' ? swipePanel : mockHubbleContainerRef.current).toBe(panel);
        }

        const currentCamera = panel.state.viewState;
        mounted.rerender(
          <ExportVideoModal {...props} visState={{...props.visState, filters: []}} />
        );
        expect(panel.state.viewState).toBe(currentCamera);
        expect(JSON.stringify({mapState: props.mapState, visState: props.visState})).toBe(
          savedProps
        );
      } finally {
        mounted?.unmount();
        utils.scaleToVideoExport.mockImplementation(originalScale);
        utils.scaleZoomOpacityForVideoExport.mockImplementation(originalFadeScale);
        mockSwipe.mockImplementation(() => null);
      }
    }
  );

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
      effects: [],
      onBeforeRender: expect.any(Function)
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

  describe('effect animation during video export', () => {
    const descriptions = [
      {name: 'amount', min: -100, max: 100},
      {name: 'color', type: 'color', min: 0, max: 255, defaultValue: [0, 0, 0]},
      {name: 'height', min: -200, max: 6000},
      {name: 'sunLightIntensity', min: 0, max: 10}
    ];

    function makeEffect(parameters = {amount: 0}, animation = undefined, overrides = {}) {
      const effect = {
        id: 'effect-1',
        type: 'test-effect',
        isEnabled: true,
        parameters: {...parameters},
        animation,
        deckEffect: {postRender: jest.fn()},
        getParameterDescriptions: () => descriptions,
        setProps: jest.fn(({parameters: update}) => {
          effect.parameters = {...effect.parameters, ...update};
        }),
        ...overrides
      };
      effect.clone = jest.fn(() => makeEffect(effect.parameters, effect.animation, overrides));
      return effect;
    }

    function mountAnimation(effects, state = {}, onLightingTimeChange = undefined) {
      const containerRef = {
        current: {
          state: {
            previewing: true,
            adapter: {videoCapture: {timeMs: 250, timecode: {start: 0, duration: 1000}}},
            ...state
          }
        }
      };
      const hook = renderHook(() =>
        useEffectAnimation(effects, containerRef, onLightingTimeChange)
      );
      return {...hook, state: containerRef.current.state, draw: () => hook.result.current()};
    }

    test('wires a pre-render callback and animates export clones without changing live effects', async () => {
      const liveEffect = makeEffect({amount: 2}, {amount: {endValue: 10, easing: 'linear'}});
      await renderAndWaitForPanel({
        ...DEFAULT_PROPS,
        visState: {
          ...DEFAULT_PROPS.visState,
          effects: [liveEffect],
          effectOrder: [liveEffect.id]
        }
      });
      const panelProps = mockExportVideoPanelContainer.mock.calls[0][0];
      expect(panelProps.deckProps.onBeforeRender).toEqual(expect.any(Function));
      const clone = liveEffect.clone.mock.results[0].value;
      const {draw} = mountAnimation([clone]);
      draw();
      expect(clone.parameters.amount).toBe(4);
      expect(liveEffect.parameters.amount).toBe(2);
      expect(liveEffect.setProps).not.toHaveBeenCalled();
    });

    test('interpolates multiple effects, scalars and vectors with independent easing', () => {
      const linear = makeEffect(
        {amount: 0, color: [0, 40, 80], untouched: 7},
        {
          amount: {endValue: 100, easing: 'linear'},
          color: {endValue: [80, 0, 40], easing: 'linear'}
        }
      );
      const smooth = makeEffect({amount: 0}, {amount: {endValue: 100, easing: 'easeInOut'}});
      const {draw, state} = mountAnimation([linear, smooth]);
      draw();
      expect(linear.parameters).toEqual({amount: 25, color: [20, 30, 70], untouched: 7});
      expect(smooth.parameters.amount).toBe(15.625);
      state.adapter.videoCapture.timeMs = 500;
      draw();
      expect(linear.parameters.amount).toBe(50);
      expect(smooth.parameters.amount).toBe(50);
      state.adapter.videoCapture.timeMs = 2000;
      draw();
      expect(linear.parameters.amount).toBe(100);
      state.adapter.videoCapture.timeMs = -100;
      draw();
      expect(linear.parameters.amount).toBe(0);
    });

    test('uses saved starts after static edits and restores the edited static values', () => {
      const effect = makeEffect(
        {amount: 70, color: [10, 20, 30]},
        {
          amount: {startValue: 0, endValue: 100, easing: 'linear'},
          color: {startValue: [0, 40, 80], endValue: [80, 0, 40], easing: 'linear'}
        }
      );
      const {draw, state, unmount} = mountAnimation([effect]);
      state.adapter.videoCapture.timeMs = 0;
      draw();
      expect(effect.parameters).toEqual({amount: 0, color: [0, 40, 80]});
      state.adapter.videoCapture.timeMs = 500;
      draw();
      expect(effect.parameters).toEqual({amount: 50, color: [40, 20, 60]});
      state.adapter.videoCapture.timeMs = 1000;
      draw();
      expect(effect.parameters).toEqual({amount: 100, color: [80, 0, 40]});
      state.previewing = false;
      draw();
      expect(effect.parameters).toEqual({amount: 70, color: [10, 20, 30]});
      state.previewing = true;
      state.adapter.videoCapture.timeMs = 0;
      draw();
      expect(effect.parameters).toEqual({amount: 0, color: [0, 40, 80]});
      unmount();
      expect(effect.parameters).toEqual({amount: 70, color: [10, 20, 30]});
    });

    test.each(['previewing', 'rendering'])('uses the globe/swipe clock while %s', mode => {
      const effect = makeEffect({amount: 0}, {amount: {endValue: 100, easing: 'linear'}});
      const {draw, state} = mountAnimation([effect], {
        previewing: false,
        [mode]: true,
        currentTimeMs: 750,
        durationMs: 1000,
        adapter: {videoCapture: {timeMs: 0, timecode: null}}
      });
      draw();
      expect(effect.parameters.amount).toBe(75);
      state.currentTimeMs = 1000;
      draw();
      expect(effect.parameters.amount).toBe(100);
      state[mode] = false;
      draw();
      expect(effect.parameters.amount).toBe(0);
    });

    test('leaves missing, invalid and disabled animations untouched', () => {
      const effects = [
        makeEffect(),
        makeEffect({amount: 0}, {amount: {endValue: NaN, easing: 'linear'}}),
        makeEffect({amount: 0}, {amount: {endValue: [1], easing: 'linear'}}),
        makeEffect({color: [0, 0, 0]}, {color: {endValue: [100], easing: 'linear'}}),
        makeEffect({amount: Infinity}, {amount: {endValue: 100, easing: 'linear'}}),
        makeEffect({amount: 0}, {amount: {endValue: 100, easing: 'linear'}}, {isEnabled: false})
      ];
      const {draw, unmount} = mountAnimation(effects);
      draw();
      unmount();
      effects.forEach(effect => expect(effect.setProps).not.toHaveBeenCalled());
    });

    test('restores starts on stop, invalid timing, restart and cleanup without patching effects', () => {
      const effect = makeEffect({amount: 10}, {amount: {endValue: 90, easing: 'linear'}});
      const originalPostRender = effect.deckEffect.postRender;
      const {draw, state, unmount} = mountAnimation([effect]);
      draw();
      expect(effect.parameters.amount).toBe(30);
      state.previewing = false;
      draw();
      expect(effect.parameters.amount).toBe(10);
      effect.setProps.mockClear();
      draw();
      expect(effect.setProps).not.toHaveBeenCalled();
      state.previewing = true;
      draw();
      expect(effect.parameters.amount).toBe(30);
      state.adapter.videoCapture.timecode.duration = 0;
      draw();
      expect(effect.parameters.amount).toBe(10);
      state.adapter.videoCapture.timecode.duration = 1000;
      draw();
      unmount();
      expect(effect.parameters.amount).toBe(10);
      expect(effect.deckEffect.postRender).toBe(originalPostRender);
    });

    test('keeps legacy fog playable and gives generic height settings precedence', () => {
      const parameters = {height: 0, animateHeight: true, heightEnd: 100, linearEasing: false};
      const legacy = makeEffect(parameters, undefined, {type: 'surfaceFog'});
      const generic = makeEffect(
        parameters,
        {height: {endValue: 200, easing: 'linear'}},
        {type: 'surfaceFog'}
      );
      const disabled = makeEffect({...parameters, animateHeight: false}, undefined, {
        type: 'surfaceFog'
      });
      const {draw} = mountAnimation([legacy, generic, disabled]);
      draw();
      expect(legacy.parameters.height).toBe(15.625);
      expect(generic.parameters.height).toBe(50);
      expect(disabled.setProps).not.toHaveBeenCalled();
    });

    test.each(['current', 'animation'])(
      'preserves %s lighting time and nighttime suppression',
      timeMode => {
        const sunLight = {timestamp: 1234, intensity: 0, shadow: false};
        const effect = makeEffect(
          {sunLightIntensity: 2, timestamp: 99, timeMode},
          {sunLightIntensity: {endValue: 6, easing: 'linear'}},
          {
            type: 'lightAndShadow',
            deckEffect: {directionalLights: [sunLight], outputUniformShadow: true, shadow: false}
          }
        );
        effect.setProps.mockImplementation(({parameters}) => {
          effect.parameters = {...effect.parameters, ...parameters};
          sunLight.timestamp = effect.parameters.timestamp;
          sunLight.intensity = effect.parameters.sunLightIntensity;
        });
        const {draw} = mountAnimation([effect]);
        draw();
        expect(effect.parameters.sunLightIntensity).toBe(3);
        expect(sunLight).toEqual({timestamp: 1234, intensity: 0, shadow: false});
        expect(effect.deckEffect.shadow).toBe(false);
        effect.deckEffect.outputUniformShadow = false;
        draw();
        expect(sunLight.intensity).toBe(3);
      }
    );

    test.each(['pick', 'current', 'animation'])(
      'plays explicit sunlight dates independently of %s mode and restores that mode',
      timeMode => {
        const midnight = Date.UTC(2024, 5, 21);
        const noon = midnight + 12 * 60 * 60 * 1000;
        const savedTimestamp = Date.UTC(2024, 4, 1, 12);
        const live = new LightingEffect({
          parameters: {timeMode, timestamp: savedTimestamp, sunLightIntensity: 2},
          animation: {
            timestamp: {
              startValue: midnight,
              endValue: midnight + 24 * 60 * 60 * 1000,
              easing: 'linear'
            },
            sunLightIntensity: {startValue: 2, endValue: 4, easing: 'linear'}
          }
        });
        const effect = live.clone();
        const compute = jest.requireActual('@kepler.gl/utils').computeDeckEffects;
        const refreshLighting = () =>
          compute({
            visState: {
              effects: [effect],
              effectOrder: [effect.id],
              animationConfig: {currentTime: 0},
              filters: []
            },
            mapState: {latitude: 0, longitude: 0},
            isExport: true
          });
        const clock = jest.spyOn(Date, 'now').mockReturnValue(noon);
        try {
          refreshLighting();
          const {draw, state, unmount} = mountAnimation(
            [effect],
            {currentTimeMs: 0, durationMs: 1000},
            refreshLighting
          );
          const sunLight = effect.deckEffect.directionalLights[0];
          draw();
          expect(effect.parameters.timeMode).toBe('pick');
          expect(sunLight.timestamp).toBe(midnight);
          expect(effect.deckEffect.outputUniformShadow).toBe(true);
          expect(sunLight.intensity).toBe(0);
          state.currentTimeMs = 500;
          draw();
          expect(sunLight.timestamp).toBe(noon);
          expect(effect.deckEffect.outputUniformShadow).toBe(false);
          expect(sunLight.intensity).toBe(3);
          state.currentTimeMs = 1000;
          draw();
          expect(sunLight.timestamp).toBe(midnight + 24 * 60 * 60 * 1000);
          expect(effect.deckEffect.outputUniformShadow).toBe(true);
          expect(sunLight.intensity).toBe(0);
          expect(live.parameters).toMatchObject({timeMode, timestamp: savedTimestamp});

          state.previewing = false;
          draw();
          expect(effect.parameters).toMatchObject({
            timeMode,
            timestamp: savedTimestamp,
            sunLightIntensity: 2
          });
          expect(sunLight.timestamp).toBe(
            timeMode === 'animation' ? 0 : timeMode === 'current' ? noon : savedTimestamp
          );
          expect(effect.deckEffect.outputUniformShadow).toBe(timeMode === 'animation');
          expect(sunLight.intensity).toBe(timeMode === 'animation' ? 0 : 2);
          state.previewing = true;
          state.currentTimeMs = 0;
          draw();
          expect(sunLight.timestamp).toBe(midnight);
          unmount();
          expect(effect.parameters).toMatchObject({timeMode, timestamp: savedTimestamp});
        } finally {
          clock.mockRestore();
        }
      }
    );

    test('refreshes export sunlight after each timestamp frame using the export camera', async () => {
      const midnight = Date.UTC(2024, 5, 21);
      const live = new LightingEffect({
        parameters: {timeMode: 'animation', timestamp: 99},
        animation: {
          timestamp: {
            startValue: midnight,
            endValue: midnight + 24 * 60 * 60 * 1000,
            easing: 'linear'
          }
        }
      });
      mockComputeDeckEffects.mockImplementation(
        jest.requireActual('@kepler.gl/utils').computeDeckEffects
      );
      await renderAndWaitForPanel({
        ...DEFAULT_PROPS,
        visState: {
          ...DEFAULT_PROPS.visState,
          effects: [live],
          effectOrder: [live.id],
          animationConfig: {currentTime: 0},
          filters: []
        }
      });
      const draw = time => {
        act(() => {
          mockHubbleContainerRef.current.setState({
            previewing: true,
            currentTimeMs: time,
            durationMs: 1000,
            viewState: {latitude: 0, longitude: 0}
          });
        });
        mockExportVideoPanelContainer.mock.lastCall[0].deckProps.onBeforeRender();
        return mockComputeDeckEffects.mock.lastCall[0].visState.effects[0].deckEffect;
      };
      expect(draw(0).outputUniformShadow).toBe(true);
      const daytime = draw(500);
      expect(daytime.directionalLights[0].timestamp).toBe(midnight + 12 * 60 * 60 * 1000);
      expect(daytime.outputUniformShadow).toBe(false);
      expect(daytime.directionalLights[0].intensity).toBe(1);
      expect(draw(1000).outputUniformShadow).toBe(true);
      expect(mockComputeDeckEffects.mock.lastCall[0].mapState).toMatchObject({
        latitude: 0,
        longitude: 0
      });
      expect(live.parameters).toMatchObject({timeMode: 'animation', timestamp: 99});
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

  test('rebuilds regular export layers from each animated frame while preserving deck settings', () => {
    const {getFlatExportLayers} = require('./hubble-utils');
    class Base {
      props = {
        mapData: {visState: {}, mapState: camera},
        deckProps: {effects: ['lighting'], onBeforeRender: jest.fn()},
        mapboxLayerBeforeId: 'labels'
      };
      state = {viewState: camera};
      render() {
        return <div deckProps={this.props.deckProps} />;
      }
    }
    const Container = withCameraTourExport(Base);
    const instance = new Container();
    const frames = [[{id: 'first'}], [{id: 'next'}]];
    getFlatExportLayers.mockReturnValueOnce(frames[0]).mockReturnValueOnce(frames[1]);
    for (const [i, zoom] of [4, 6].entries()) {
      instance.state.viewState = {...camera, zoom};
      const panel = instance.render();
      expect(getFlatExportLayers).toHaveBeenLastCalledWith(instance.props.mapData, {
        mapIndex: 0,
        viewState: instance.state.viewState,
        beforeId: 'labels'
      });
      expect(panel.props.deckProps).toEqual({...instance.props.deckProps, layers: frames[i]});
    }
    instance.props.deckProps = {...instance.props.deckProps, layers: frames[0]};
    getFlatExportLayers.mockClear();
    expect(instance.render().props.deckProps.layers).toBe(frames[0]);
    expect(getFlatExportLayers).not.toHaveBeenCalled();
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
