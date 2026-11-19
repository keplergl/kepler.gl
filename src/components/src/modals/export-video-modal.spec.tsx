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
import {WebMercatorViewport, _LayersPass as LayersPass} from '@deck.gl/core';
import {CanvasContext} from '@luma.gl/core';
import {isBrowser} from '@probe.gl/env';
import PointLayer from '../../../layers/src/point-layer/point-layer';

jest.mock('@probe.gl/env', () => {
  const actual = jest.requireActual('@probe.gl/env');
  return {...actual, isBrowser: jest.fn(actual.isBrowser)};
});

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  };
});

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
  RESOLUTIONS: jest.requireActual('./hubble-utils').RESOLUTIONS,
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
  getResolutionSetting: jest.fn(value =>
    jest.requireActual('./hubble-utils').getResolutionSetting(value)
  )
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

// Load the real preview helpers outside timed tests; cold dependency transforms
// should not consume the interaction test's timeout budget.
const actualHubbleUtils = jest.requireActual('./hubble-utils');
const ActualSwipeContainer = jest.requireActual(
  './swipe-export-video-container'
).SwipeExportVideoPanelContainer;
const ActualGlobeContainer = jest.requireActual(
  './globe-export-video-container'
).GlobeExportVideoPanelContainer;

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

  test.each(['regular', 'swipe', 'globe'])(
    'preserves fades and preview cameras when changing resolution in an open %s export',
    async mode => {
      const utils = require('./hubble-utils');
      const actualUtils = actualHubbleUtils;
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
      const SwipeContainer = ActualSwipeContainer;
      const mockGlobe = jest.requireMock(
        './globe-export-video-container'
      ).GlobeExportVideoPanelContainer;
      const GlobeContainer = ActualGlobeContainer;
      const isOwnContainer = mode !== 'regular';
      const mockContainer = mode === 'globe' ? mockGlobe : mockSwipe;
      const Container = mode === 'globe' ? GlobeContainer : SwipeContainer;
      let swipePanel;
      if (isOwnContainer) {
        mockContainer.mockImplementation(({ref, ...props}) => (
          <Container
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
          ...(mode === 'swipe' ? {isSplit: true, mapSplitMode: MapSplitMode.SWIPE_COMPARE} : {}),
          ...(mode === 'globe' ? {globe: {enabled: true}} : {})
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
          expect(isOwnContainer ? mockContainer : mockExportVideoPanelContainer).toHaveBeenCalled();
          expect(isOwnContainer ? swipePanel : mockHubbleContainerRef.current).toBeTruthy();
        });
        const panel = isOwnContainer ? swipePanel : mockHubbleContainerRef.current;
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
            if (isOwnContainer) panel.setResolution(resolution);
            else panel.props.onSettingsChange({resolution});
          });
          const settings = isOwnContainer ? panel.state : panel.props.initialState;
          expect(settings.resolution).toBe(resolution);
          const {width, height, zoom, minZoom, maxZoom, zoomOffset} = panel.props.mapData.mapState;
          const globeCameraBounds = mode === 'globe' ? {minZoom, maxZoom, zoomOffset} : {};
          const zoomDelta = zoom - initialCamera.zoom;
          expect(opacity()).toBeCloseTo(1);
          expect(panel.state.viewState).toMatchObject({
            ...userCamera,
            ...globeCameraBounds,
            width,
            height,
            zoom: userCamera.zoom + zoomDelta
          });
          expect(panel.state.memo.viewState).toMatchObject({
            ...initialCamera,
            ...globeCameraBounds,
            width,
            height,
            zoom: initialCamera.zoom + zoomDelta
          });
          expect(isOwnContainer ? swipePanel : mockHubbleContainerRef.current).toBe(panel);
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
        mockContainer.mockImplementation(() => null);
      }
    }
  );

  test('preserves point radii relative to the map across video resolutions and animation zooms', async () => {
    const utils = require('./hubble-utils');
    const actualUtils = actualHubbleUtils;
    const originalScale = utils.scaleToVideoExport.getMockImplementation();
    utils.scaleToVideoExport.mockImplementation(actualUtils.scaleToVideoExport);
    const point = new PointLayer({id: 'points', dataId: 'data'});
    const source = {
      ...DEFAULT_PROPS.mapState,
      width: 1440,
      height: 810,
      pitch: 0,
      bearing: 0
    };
    const props = {...DEFAULT_PROPS, containerW: 1600, mapState: source};
    const relativeRadius = (mapState, fixedRadius) => {
      const viewport = new WebMercatorViewport(mapState);
      return (
        point.getRadiusScaleByZoom(mapState, fixedRadius) / viewport.metersPerPixel / viewport.width
      );
    };
    let mounted;
    try {
      mounted = await renderAndWaitForPanel(props);
      const panel = mockHubbleContainerRef.current;
      for (const resolution of ['1280x720', '1920x1080', '1280x960']) {
        act(() => panel.props.onSettingsChange({resolution}));
        const exported = panel.props.mapData.mapState;
        const zoomDelta = exported.zoom - source.zoom;
        const scale = Math.min(exported.width / source.width, exported.height / source.height);
        // A different aspect ratio may add space around the map; use the same
        // fitting scale for the expected normalized radius.
        const fit = (scale * source.width) / exported.width;
        for (const zoom of [4, 13, 14, 16]) {
          const live = {...source, zoom};
          const frame = {...exported, zoom: zoom + zoomDelta};
          for (const fixedRadius of [false, true]) {
            expect(relativeRadius(frame, fixedRadius)).toBeCloseTo(
              relativeRadius(live, fixedRadius) * fit,
              8
            );
          }
        }
      }
      expect(source).not.toHaveProperty('zoomOffset');
    } finally {
      mounted?.unmount();
      utils.scaleToVideoExport.mockImplementation(originalScale);
    }
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

  test('offers the experimental native format and retains its selection in regular export', async () => {
    await renderAndWaitForPanel(DEFAULT_PROPS);
    const options = [
      {value: 'webm', label: 'WebM Video'},
      {value: 'gif', label: 'GIF'}
    ];
    let ui = mockExportVideoPanelContainer.mock.lastCall[1];
    expect(ui.ItemSelector({options}).props.options.map(option => option.value)).toEqual([
      'webm',
      'gif',
      'webm-native'
    ]);
    act(() => mockHubbleContainerRef.current.props.onSettingsChange({mediaType: 'webm-native'}));
    ui = mockExportVideoPanelContainer.mock.lastCall[1];
    expect(ui.ItemSelector({options}).props.selectedItems.value).toBe('webm-native');
    expect(DEFAULT_PROPS.exportVideo.mediaType).toBe('webm');
  });

  test('offers higher resolutions in regular export and retains the selected value', async () => {
    await renderAndWaitForPanel(DEFAULT_PROPS);
    const options = [{value: '1280x720', label: 'High (720p)', aspectRatio: '16:9'}];
    const selector = () => {
      const ui = mockExportVideoPanelContainer.mock.lastCall[1];
      return ui.ItemSelector({
        options,
        multiSelect: false,
        searchable: false,
        getOptionValue: option => option.value,
        displayOption: option => option.label,
        onChange: resolution => mockHubbleContainerRef.current.props.onSettingsChange({resolution})
      });
    };
    const {rerender} = renderWithThemeLocal(selector());
    let selectedLabel = 'High (720p)';
    for (const [resolution, label] of [
      ['2560x1440', 'Quad HD (1440p)'],
      ['3840x2160', 'Ultra HD (4K)']
    ]) {
      fireEvent.click(screen.getByText(selectedLabel));
      fireEvent.click(screen.getByText(label));
      expect(mockHubbleContainerRef.current.props.initialState.resolution).toBe(resolution);
      rerender(selector());
      expect(screen.getByText(label)).toBeInTheDocument();
      selectedLabel = label;
    }
    const ui = mockExportVideoPanelContainer.mock.lastCall[1];
    const fourByThree = ui.ItemSelector({
      options: [{value: '640x480', aspectRatio: '4:3'}]
    });
    expect(fourByThree.props.options.map(option => option.value)).toEqual([
      '640x480',
      '1280x960',
      '1920x1440'
    ]);
  });

  test.each([
    ['swipe', ActualSwipeContainer],
    ['globe', ActualGlobeContainer]
  ])('%s export selects higher resolutions and uses their canvas dimensions', (mode, Container) => {
    const ref = React.createRef();
    const onSettingsChange = jest.fn();
    renderWithThemeLocal(
      <Container
        ref={ref}
        initialState={{resolution: '1280x720'}}
        mapData={{
          mapState: {
            ...DEFAULT_PROPS.mapState,
            width: 1280,
            height: 720,
            bearing: 0,
            pitch: 0,
            globe: {enabled: mode === 'globe'}
          },
          visState: {...DEFAULT_PROPS.visState, animationConfig: {}}
        }}
        exportVideoWidth={480}
        mapProps={{}}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.click(screen.getByText('Settings'));
    let selectedLabel = 'High (720p)';
    for (const [resolution, label, width, height] of [
      ['2560x1440', 'Quad HD (1440p)', 2560, 1440],
      ['3840x2160', 'Ultra HD (4K)', 3840, 2160]
    ]) {
      fireEvent.click(screen.getByText(selectedLabel));
      fireEvent.click(screen.getByText(label));
      expect(onSettingsChange).toHaveBeenLastCalledWith(expect.objectContaining({resolution}));
      expect(ref.current.getCanvasSize()).toEqual({width, height});
      expect(screen.getByText(label)).toBeInTheDocument();
      selectedLabel = label;
    }
  });

  describe('capability-aware default format', () => {
    const formats = require('./video-export-formats');
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
    test.each(modes)(
      '$mode probes before mount and preserves subsequent explicit legacy choice',
      async ({mapState, panel}) => {
        let finish;
        const probe = jest.spyOn(formats, 'getNativeWebMConfig').mockReturnValue(
          new Promise(resolve => {
            finish = resolve;
          })
        );
        const props = {
          ...DEFAULT_PROPS,
          mapState: {...DEFAULT_PROPS.mapState, ...mapState},
          exportVideo: {...DEFAULT_PROPS.exportVideo, mediaType: 'webm-native'}
        };
        try {
          const view = renderWithThemeLocal(<ExportVideoModal {...props} />);
          expect(panel).not.toHaveBeenCalled();
          expect(probe).toHaveBeenCalledWith(1280, 720);
          await act(async () => finish({codec: 'vp8', config: {}}));
          await waitFor(() => expect(panel).toHaveBeenCalled());
          expect(panel.mock.lastCall[0].initialState.mediaType).toBe('webm-native');
          act(() => panel.mock.lastCall[0].onSettingsChange({mediaType: 'webm'}));
          view.rerender(<ExportVideoModal {...props} containerW={1000} />);
          expect(panel.mock.lastCall[0].initialState.mediaType).toBe('webm');
          expect(probe).toHaveBeenCalledTimes(1);
        } finally {
          probe.mockRestore();
        }
      }
    );
    test('new export defaults request capability-aware native encoding', () => {
      const {DEFAULT_EXPORT_VIDEO} = jest.requireActual('../../../reducers/src/ui-state-updaters');
      expect(DEFAULT_EXPORT_VIDEO.mediaType).toBe('webm-native');
    });
    test('ignores a closed modal probe after reopening with an explicit legacy choice', async () => {
      let finish;
      const probe = jest.spyOn(formats, 'getNativeWebMConfig').mockReturnValue(
        new Promise(resolve => {
          finish = resolve;
        })
      );
      try {
        const view = renderWithThemeLocal(
          <ExportVideoModal
            {...DEFAULT_PROPS}
            exportVideo={{...DEFAULT_PROPS.exportVideo, mediaType: 'webm-native'}}
          />
        );
        view.unmount();
        await renderAndWaitForPanel(DEFAULT_PROPS);
        await act(async () => finish({codec: 'vp9', config: {}}));
        expect(mockExportVideoPanelContainer.mock.lastCall[0].initialState.mediaType).toBe('webm');
      } finally {
        probe.mockRestore();
      }
    });
    test.each(['unsupported', 'rejected'])(
      'uses legacy WebM for a %s capability probe',
      async result => {
        const probe = jest.spyOn(formats, 'getNativeWebMConfig');
        if (result === 'rejected') probe.mockRejectedValue(new Error('unavailable'));
        else probe.mockResolvedValue(undefined);
        try {
          await renderAndWaitForPanel({
            ...DEFAULT_PROPS,
            exportVideo: {...DEFAULT_PROPS.exportVideo, mediaType: 'webm-native'}
          });
          expect(mockExportVideoPanelContainer.mock.lastCall[0].initialState.mediaType).toBe(
            'webm'
          );
          expect(mockHubbleContainerRef.current.state.viewState).toMatchObject({
            zoom: DEFAULT_PROPS.mapState.zoom
          });
        } finally {
          probe.mockRestore();
        }
      }
    );
    test.each(['webm', 'gif', 'png', 'jpeg'])(
      'does not probe or replace explicit %s',
      async mediaType => {
        const probe = jest.spyOn(formats, 'getNativeWebMConfig');
        try {
          await renderAndWaitForPanel({
            ...DEFAULT_PROPS,
            exportVideo: {...DEFAULT_PROPS.exportVideo, mediaType}
          });
          expect(mockExportVideoPanelContainer.mock.lastCall[0].initialState.mediaType).toBe(
            mediaType
          );
          expect(probe).not.toHaveBeenCalled();
        } finally {
          probe.mockRestore();
        }
      }
    );
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
        mockExportVideoPanelContainer.mock.lastCall[0].deckProps.onBeforeRender({
          device: {canvasContext: null}
        });
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
      mockExportVideoPanelContainer.mockImplementation(() => (
        <div data-testid="export-video-panel">Mock Panel</div>
      ));
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

    test('fills the resized basemap with Deck at 1080p, 1440p, and 4K without clearing it', async () => {
      await renderAndWaitForPanel();
      const {exportVideoWidth, deckProps} = mockExportVideoPanelContainer.mock.lastCall[0];
      const previewHeight = (exportVideoWidth * 9) / 16;
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      Object.defineProperties(canvas, {
        clientWidth: {value: exportVideoWidth},
        clientHeight: {value: previewHeight}
      });
      // Keep luma's real size tracking and Deck's real viewport calculation;
      // only replace the GPU framebuffer and render-pass operations.
      class TestCanvasContext extends CanvasContext {
        _configureDevice() {
          return undefined;
        }
        _getCurrentFramebuffer() {
          return {width: this.drawingBufferWidth, height: this.drawingBufferHeight};
        }
      }
      isBrowser.mockReturnValueOnce(true);
      const canvasContext = new TestCanvasContext({canvas, autoResize: false});
      canvasContext.getCurrentFramebuffer();
      const renderPass = {setParameters: jest.fn(), end: jest.fn()};
      const device = {
        type: 'webgl',
        canvasContext,
        beginRenderPass: () => renderPass,
        submit: jest.fn()
      };
      const layersPass = new LayersPass(device);
      const viewport = new WebMercatorViewport({width: exportVideoWidth, height: previewHeight});
      const setWidth = jest.spyOn(canvas, 'width', 'set');
      const setHeight = jest.spyOn(canvas, 'height', 'set');

      try {
        for (const [width, height] of [
          [1280, 720],
          [1920, 1080],
          [2560, 1440],
          [3840, 2160],
          [1280, 720]
        ]) {
          // MapLibre changes the backing buffer without changing CSS size,
          // so luma's ResizeObserver does not update its cached dimensions.
          canvas.width = width;
          canvas.height = height;
          setWidth.mockClear();
          setHeight.mockClear();
          deckProps.onBeforeRender({device});
          layersPass.render({layers: [], viewports: [viewport], clearCanvas: false});

          expect(renderPass.setParameters).toHaveBeenLastCalledWith({
            viewport: [0, 0, width, height]
          });
          expect(setWidth).not.toHaveBeenCalled();
          expect(setHeight).not.toHaveBeenCalled();
        }
      } finally {
        setWidth.mockRestore();
        setHeight.mockRestore();
        canvasContext.destroy();
      }
    });

    test('preserves a pending resize when Deck owns the canvas', async () => {
      await renderAndWaitForPanel();
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      isBrowser.mockReturnValueOnce(true);
      const canvasContext = new CanvasContext({canvas, autoResize: true});
      canvasContext.setDrawingBufferSize(3840, 2160);
      mockExportVideoPanelContainer.mock.lastCall[0].deckProps.onBeforeRender({
        device: {canvasContext}
      });
      expect(canvasContext.getDrawingBufferSize()).toEqual([3840, 2160]);
      canvasContext.destroy();
    });

    test('resizes the capture buffer with the current quality before passive effects run', async () => {
      const canvas = document.createElement('canvas');
      function ResizePreview({exportVideoWidth}) {
        const mounted = React.useRef(false);
        const {resolution, previewing} = mockHubbleContainerRef.current.state;
        const [width, height] = (resolution || '1280x720').split('x').map(Number);
        // Hubble's child preview writes DPR and resizes MapLibre during
        // componentDidUpdate, before the modal's passive DPR effect runs.
        React.useLayoutEffect(() => {
          if (!mounted.current) {
            mounted.current = true;
            return;
          }
          window.devicePixelRatio = previewing ? 1 : width / exportVideoWidth;
          canvas.width = Math.floor(exportVideoWidth * window.devicePixelRatio);
          canvas.height = Math.floor((exportVideoWidth * height * window.devicePixelRatio) / width);
        }, [exportVideoWidth, width, height, previewing]);
        return null;
      }
      mockExportVideoPanelContainer.mockImplementation(props => <ResizePreview {...props} />);
      const {rerender, unmount} = await renderAndWaitForPanel();
      const panel = mockHubbleContainerRef.current;
      const setResolution = resolution => {
        act(() => {
          // Match Hubble's setStateAndNotify: update local settings and notify
          // the modal together, then let the mounted preview resize.
          panel.setState({resolution});
          panel.props.onSettingsChange({resolution});
        });
      };

      for (const resolution of ['1920x1080', '1280x720', '960x540', '1280x960']) {
        setResolution(resolution);
        expect([canvas.width, canvas.height]).toEqual(resolution.split('x').map(Number));
      }

      act(() => panel.setState({previewing: true}));
      expect([canvas.width, canvas.height]).toEqual([1280, 960]);
      act(() => panel.setState({previewing: false, rendering: true}));
      expect([canvas.width, canvas.height]).toEqual([1280, 960]);

      rerender(<ExportVideoModal {...DEFAULT_PROPS} containerW={1800} />);
      expect(mockHubbleContainerRef.current).toBe(panel);
      expect([canvas.width, canvas.height]).toEqual([1280, 960]);
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
  test.each([
    ['2560x1440', 2560, 1440],
    ['3840x2160', 3840, 2160]
  ])(
    'regular export uses %s for its canvas and encoder dimensions',
    (resolution, width, height) => {
      const {ExportVideoPanelContainer} = jest.requireActual('@hubble.gl/react');
      const Container = withCameraTourExport(ExportVideoPanelContainer);
      const instance = new Container({
        initialState: {resolution},
        mapData: {mapState: {...camera, width: 1280, height: 720}},
        exportVideoWidth: 480
      });
      expect(instance.getCanvasSize()).toEqual({width, height});
      expect(instance.getFormatConfigs().gif).toMatchObject({width, height});
      expect(instance._getContainer()).toEqual({width: 480, height: 270});
    }
  );

  test('restores the camera and clears saving after a native encoding failure', () => {
    const encoders = require('./native-webm-encoder');
    let hooks;
    const createEncoder = jest
      .spyOn(encoders, 'createNativeWebMEncoder')
      .mockImplementation(value => {
        hooks = value;
        return class {};
      });
    class Base {
      state = {
        adapter: {videoCapture: {encoder: {cancel: jest.fn()}}},
        mediaType: 'webm-native',
        rendering: true,
        saving: true,
        viewState: {...camera, zoom: 10},
        memo: {viewState: camera}
      };
      setState(update) {
        Object.assign(this.state, update);
      }
      onStop() {
        return undefined;
      }
    }
    try {
      const Container = withCameraTourExport(Base);
      const instance = new Container();
      instance.getEncoder();
      hooks.onError(new Error('finalization failed'));
      expect(instance.state.viewState).toEqual(camera);
      expect(instance.state.rendering).toBe(false);
      expect(instance.state.saving).toBe(false);
      expect(instance.state.encodingError).toContain('Video encoding failed');
      expect(instance.state.adapter.videoCapture.encoder.cancel).toHaveBeenCalledTimes(1);
    } finally {
      createEncoder.mockRestore();
    }
  });
  test('isolates recording sessions and cancels native resources when aborted', () => {
    const {NativeWebMEncoder} = require('./native-webm-encoder');
    class Capture {
      encoder = {cancel: jest.fn()};
      download = jest.fn();
    }
    const legacy = class {};
    class Base {
      state = {
        adapter: {
          videoCapture: new Capture(),
          animationManager: {setKeyframes: jest.fn()},
          render: jest.fn(options => {
            this.state.adapter.videoCapture.encoder = new options.Encoder({framerate: 30});
          }),
          stop: jest.fn(options => options.onStopped?.())
        },
        mediaType: 'webm',
        viewState: camera
      };
      setState(update) {
        Object.assign(this.state, update);
      }
      getEncoder() {
        return legacy;
      }
      getFilterKeyframes() {
        return {};
      }
      getTripKeyframes() {
        return {};
      }
      getFormatConfigs() {
        return {};
      }
      getTimecode() {
        return {framerate: 30};
      }
      getFileName() {
        return 'recording';
      }
      onRenderVideo() {
        return undefined;
      }
      onStop() {
        return undefined;
      }
    }
    const Container = withCameraTourExport(Base);
    const instance = new Container();
    instance.getCameraKeyframes = () => ({});
    expect(new (instance.getEncoder())()).toBeInstanceOf(legacy);
    instance.state.mediaType = 'webm-native';
    const Encoder = instance.getEncoder();
    expect(new Encoder({framerate: 30})).toBeInstanceOf(NativeWebMEncoder);
    const previous = instance.state.adapter.videoCapture;
    instance.onRenderVideo();
    expect(previous.encoder.cancel).toHaveBeenCalledTimes(1);
    expect(instance.state.adapter.videoCapture).not.toBe(previous);
    const current = instance.state.adapter.videoCapture;
    jest.spyOn(current.encoder, 'cancel');
    const renderOptions = instance.state.adapter.render.mock.lastCall[0];
    renderOptions.onStopped();
    expect(instance.state.saving).toBe(true);
    instance.onRenderVideo();
    expect(instance.state.adapter.videoCapture).toBe(current);
    instance.onStop();
    expect(current.encoder.cancel).not.toHaveBeenCalled();
    expect(instance.state.adapter.stop.mock.lastCall[0].onSave).toBe(renderOptions.onSave);
    const blob = new Blob(['video']);
    renderOptions.onSave(blob);
    expect(current.download).toHaveBeenCalledWith(blob);
    expect(instance.state.rendering).toBe(false);
    expect(instance.state.saving).toBe(false);
    instance.onStop({abort: true});
    expect(current.encoder.cancel).toHaveBeenCalledTimes(1);
  });
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
  test.each([0, 40])(
    'keeps a resized globe tour below the live-map minimum at latitude %s',
    latitude => {
      const zoomOffset = -2;
      const source = {
        ...camera,
        latitude,
        zoom: 2 + Math.log2(Math.cos((latitude * Math.PI) / 180))
      };
      const scaledTour = {
        stops: [{...tour.stops[0], camera: {...source, zoom: source.zoom + zoomOffset}}]
      };
      const result = resolveCameraTourExportFrame(
        {cameraTourTime: 0},
        scaledTour,
        {width: 360},
        true,
        zoomOffset
      );
      expect(result).toMatchObject({
        latitude,
        zoom: source.zoom + zoomOffset,
        pitch: 0,
        bearing: 0
      });
      expect(scaledTour.stops[0].camera.zoom).toBe(source.zoom + zoomOffset);
    }
  );

  test('ordinary presets and manual view updates are unchanged', () => {
    expect(
      getCameraTourExportKeyframes(tour, 'Orbit (90º)', 5000, {width: 800, height: 600})
    ).toBeNull();
    expect(
      getCameraTourExportKeyframes(null, CAMERA_TOUR_PRESET, 5000, {width: 800, height: 600})
    ).toBeNull();
    expect(resolveCameraTourExportFrame(camera, tour)).toBe(camera);
  });

  test.each(['onRenderVideo', 'onPreviewVideo'])(
    '%s isolates a new capture from a stopped asynchronous frame',
    async method => {
      const {DeckAdapter} = require('@hubble.gl/core');
      let finishOld;
      const oldCapture = new DeckAdapter({}).videoCapture;
      oldCapture.recording = true;
      oldCapture._capture = () =>
        new Promise(resolve => {
          finishOld = resolve;
        });
      oldCapture.capture(document.createElement('canvas'), jest.fn());
      class Base {
        state = {adapter: {videoCapture: oldCapture}};
        onRenderVideo() {
          this.state.adapter.videoCapture.capturing = true;
        }
        onPreviewVideo() {
          this.state.adapter.videoCapture.capturing = true;
        }
      }
      const Container = withCameraTourExport(Base);
      const instance = new Container();
      oldCapture.recording = false;
      instance[method]();
      const currentCapture = instance.state.adapter.videoCapture;
      expect(currentCapture).not.toBe(oldCapture);
      finishOld({kind: 'stop'});
      await Promise.resolve();
      expect(oldCapture.capturing).toBe(false);
      expect(currentCapture.capturing).toBe(true);
    }
  );

  test('normal Stop preserves partial encoder output while abort cancels it', () => {
    const encoder = {cancel: jest.fn(), cancelAnnotationCapture: jest.fn()};
    const onStop = jest.fn();
    class Base {
      state = {adapter: {videoCapture: {encoder}}};
      onStop(options) {
        onStop(options);
      }
    }
    const Container = withCameraTourExport(Base);
    const instance = new Container();
    instance.onStop({abort: false});
    expect(encoder.cancelAnnotationCapture).toHaveBeenCalledTimes(1);
    expect(encoder.cancel).not.toHaveBeenCalled();
    expect(onStop).toHaveBeenLastCalledWith({abort: false});
    instance.onStop({abort: true});
    expect(encoder.cancel).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenLastCalledWith({abort: true});
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
