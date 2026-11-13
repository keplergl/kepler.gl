// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {act, cleanup, render} from '@testing-library/react';
import {SwipeExportVideoPreview} from './swipe-export-video-preview';
import {GlobeExportVideoPreview} from './globe-export-video-preview';
import {compositeSwipeFrame} from './swipe-composite-utils';
import {getGlobeExportLayers} from './hubble-utils';
import {createKeplerLayers} from '@hubble.gl/react';

const mockDecks = [];
const mockMaps = [];
jest.mock('@deck.gl/react', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    const record = React.useRef();
    if (!record.current) {
      const canvas = globalThis.document.createElement('canvas');
      record.current = {deck: {getCanvas: () => canvas}, props};
      mockDecks.push(record.current);
    }
    record.current.props = props;
    record.current.deck.props = props;
    React.useImperativeHandle(ref, () => ({deck: record.current.deck}));
    return null;
  });
});
jest.mock('react-map-gl/maplibre', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      const record = React.useRef();
      if (!record.current) {
        const canvas = globalThis.document.createElement('canvas');
        const handlers = {};
        const map = {
          getCanvas: () => canvas,
          areTilesLoaded: jest.fn(() => true),
          on: jest.fn((name, callback) => {
            handlers[name] = callback;
          })
        };
        record.current = {map, handlers, props};
        mockMaps.push(record.current);
      }
      record.current.props = props;
      React.useImperativeHandle(ref, () => ({getMap: () => record.current.map}));
      return props.children;
    }),
    useControl: factory => {
      const value = React.useRef();
      if (!value.current) value.current = factory();
      return value.current;
    }
  };
});
jest.mock('@deck.gl/mapbox', () => ({
  MapboxOverlay: class {
    constructor(props) {
      this._deck = {props};
    }
    setProps(props) {
      this._deck.props = props;
    }
  }
}));
jest.mock('@hubble.gl/react', () => ({createKeplerLayers: jest.fn()}));
jest.mock('./hubble-utils', () => ({
  EXPORT_DECK_DEVICE_PROPS: {antialias: true},
  EXPORT_OVERLAY_DEVICE_PROPS: {},
  getGlobeExportLayers: jest.fn()
}));
jest.mock('./swipe-composite-utils', () => ({
  ...jest.requireActual('./swipe-composite-utils'),
  compositeSwipeFrame: jest.fn()
}));
jest.mock('@kepler.gl/deckgl-layers', () => ({getStarsBackgroundStyle: jest.fn(() => ({}))}));

function props(overrides = {}) {
  return {
    mapData: {mapState: {}},
    resolution: [1280, 720],
    exportVideoWidth: 640,
    disableBaseMap: true,
    viewState: {longitude: 10, latitude: 20, zoom: 3},
    adapter: {getProps: jest.fn(({extraProps}) => extraProps)},
    rendering: false,
    saving: false,
    setViewState: jest.fn(),
    durationMs: 1000,
    swipeStartPct: 0,
    swipeEndPct: 100,
    swipeEasing: 'linear',
    currentTimeMs: 250,
    backgroundColor: '#123456',
    ...overrides
  };
}

let originalPixelRatio;
beforeEach(() => {
  originalPixelRatio = window.devicePixelRatio;
  mockDecks.length = 0;
  mockMaps.length = 0;
  jest.clearAllMocks();
  createKeplerLayers.mockImplementation((_data, _view, side) => [
    {id: `map-${side}`, isLoaded: true}
  ]);
  getGlobeExportLayers.mockImplementation((_data, {mapIndex}) => [
    {id: `globe-${mapIndex}`, isLoaded: true}
  ]);
});
afterEach(() => {
  cleanup();
  window.devicePixelRatio = originalPixelRatio;
});

describe('swipe preview frame lifecycle', () => {
  test('renders distinct sides, captures at export resolution, and forwards camera changes', () => {
    const input = props();
    const ref = React.createRef<SwipeExportVideoPreview>();
    render(<SwipeExportVideoPreview ref={ref} {...input} />);
    expect(createKeplerLayers.mock.calls.map(call => call[2])).toEqual([0, 1]);
    expect(ref.current.getCompositeCanvas().width).toBe(1280);
    expect(ref.current.getCompositeCanvas().height).toBe(720);
    const camera = {...input.viewState, zoom: 5};
    act(() => mockDecks[0].props.onViewStateChange({viewState: camera}));
    expect(input.setViewState).toHaveBeenCalledWith(camera);
    expect(window.devicePixelRatio).toBe(2);
  });

  test('composites live deck frames while streaming, but captures only when both sides are loaded', () => {
    const adapterRender = jest.fn();
    const input = props({
      adapter: {getProps: ({extraProps}) => ({...extraProps, onAfterRender: adapterRender})}
    });
    const ref = React.createRef<SwipeExportVideoPreview>();
    render(<SwipeExportVideoPreview ref={ref} {...input} />);
    mockDecks[1].deck.props.layers[0].isLoaded = false;
    act(() => mockDecks[0].props.onAfterRender({frame: 1}));
    expect(adapterRender).toHaveBeenCalledWith({frame: 1});
    expect(compositeSwipeFrame).toHaveBeenCalledWith(
      mockDecks[0].deck.getCanvas(),
      mockDecks[1].deck.getCanvas(),
      ref.current.getCompositeCanvas(),
      25,
      true,
      '#123456',
      false,
      input.viewState
    );
    const capture = jest.fn();
    compositeSwipeFrame.mockClear();
    mockDecks[1].deck.props.layers[0].isLoaded = false;
    ref.current.onAfterRender(capture);
    expect(capture).not.toHaveBeenCalled();
    expect(compositeSwipeFrame).not.toHaveBeenCalled();
    mockDecks[1].deck.props.layers[0].isLoaded = true;
    ref.current.onAfterRender(capture);
    expect(compositeSwipeFrame).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(compositeSwipeFrame.mock.invocationCallOrder[0]).toBeLessThan(
      capture.mock.invocationCallOrder[0]
    );
  });

  test('waits for basemap tiles and uses map canvases instead of deck canvases', () => {
    const ref = React.createRef<SwipeExportVideoPreview>();
    render(<SwipeExportVideoPreview ref={ref} {...props({disableBaseMap: false})} />);
    const capture = jest.fn();
    mockMaps[0].map.areTilesLoaded.mockReturnValue(false);
    ref.current.onAfterRender(capture);
    expect(capture).not.toHaveBeenCalled();
    mockMaps[0].map.areTilesLoaded.mockReturnValue(true);
    mockMaps[1].map.areTilesLoaded.mockReturnValue(false);
    ref.current.onAfterRender(capture);
    expect(capture).not.toHaveBeenCalled();
    mockMaps[1].map.areTilesLoaded.mockReturnValue(true);
    ref.current.onAfterRender(capture);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(compositeSwipeFrame.mock.calls[0].slice(0, 2)).toEqual(
      mockMaps.map(({map}) => map.getCanvas())
    );
  });

  test('paints basemap previews after both maps report a render', () => {
    render(<SwipeExportVideoPreview {...props({disableBaseMap: false})} />);
    act(() => mockMaps.forEach(record => record.props.onLoad()));
    act(() => mockMaps[0].handlers.render());
    expect(compositeSwipeFrame).not.toHaveBeenCalled();
    act(() => mockMaps[1].handlers.render());
    act(() => mockMaps[0].handlers.render());
    expect(compositeSwipeFrame).toHaveBeenCalled();
  });

  test('recomposites changed time and swipe settings, but not unchanged props', () => {
    const input = props();
    const {rerender} = render(<SwipeExportVideoPreview {...input} />);
    rerender(<SwipeExportVideoPreview {...input} />);
    expect(compositeSwipeFrame).not.toHaveBeenCalled();
    rerender(<SwipeExportVideoPreview {...input} currentTimeMs={750} />);
    expect(compositeSwipeFrame.mock.lastCall[3]).toBe(75);
    rerender(
      <SwipeExportVideoPreview {...input} currentTimeMs={750} swipeStartPct={20} swipeEndPct={60} />
    );
    expect(compositeSwipeFrame.mock.lastCall[3]).toBe(50);
    rerender(<SwipeExportVideoPreview {...input} currentTimeMs={750} resolution={[1920, 1080]} />);
    expect(window.devicePixelRatio).toBe(3);
  });

  test('creates independent globe layers per split side and passes star settings to composition', () => {
    const input = props({
      mapData: {mapState: {globe: {enabled: true, config: {stars: true}}}},
      mapProps: {mapboxApiAccessToken: 'token', mapboxApiUrl: 'api'}
    });
    render(<SwipeExportVideoPreview {...input} />);
    expect(getGlobeExportLayers.mock.calls.map(call => call[1])).toEqual(
      [0, 1].map(mapIndex => ({
        mapIndex,
        viewState: input.viewState,
        mapboxApiAccessToken: 'token',
        mapboxApiUrl: 'api'
      }))
    );
    expect(mockDecks[0].props.layers).not.toBe(mockDecks[1].props.layers);
    act(() => mockDecks[1].props.onAfterRender({}));
    expect(compositeSwipeFrame.mock.lastCall[6]).toBe(true);
  });

  test('clones explicit deck layers instead of sharing stateful instances', () => {
    const layer = {id: 'points', clone: jest.fn(options => ({...options, isLoaded: true}))};
    render(<SwipeExportVideoPreview {...props({deckProps: {layers: [layer]}})} />);
    expect(layer.clone.mock.calls).toEqual([[{id: 'points-swipe-0'}], [{id: 'points-swipe-1'}]]);
    expect(mockDecks[0].props.layers[0]).not.toBe(mockDecks[1].props.layers[0]);
    expect(createKeplerLayers).not.toHaveBeenCalled();
  });

  test('does not composite or capture before deck refs are available', () => {
    const preview = new SwipeExportVideoPreview(props());
    const capture = jest.fn();
    preview.onAfterRender(capture);
    expect(capture).not.toHaveBeenCalled();
    expect(compositeSwipeFrame).not.toHaveBeenCalled();
    expect(preview.getCompositeCanvas()).toBeNull();
  });
});

describe('globe preview capture contract', () => {
  test('exposes canvas, waits for nonempty loaded layers, and clears ref on unmount', () => {
    const ref = React.createRef<GlobeExportVideoPreview>();
    const {unmount} = render(<GlobeExportVideoPreview ref={ref} {...props()} />);
    const preview = ref.current;
    expect(preview.getCanvas()).toBe(mockDecks[0].deck.getCanvas());
    expect(preview.areLayersLoaded()).toBe(true);
    mockDecks[0].deck.props.layers = [];
    expect(preview.areLayersLoaded()).toBe(false);
    mockDecks[0].deck.props.layers = [{isLoaded: false}];
    expect(preview.areLayersLoaded()).toBe(false);
    unmount();
    expect(preview.getCanvas()).toBeNull();
    expect(preview.areLayersLoaded()).toBe(false);
  });

  test('preserves controlled camera and full-resolution buffers when export resolution changes', () => {
    const input = props();
    const {rerender} = render(<GlobeExportVideoPreview {...input} />);
    expect(mockDecks[0].props.useDevicePixels * mockDecks[0].props.width).toBe(1280);
    const camera = {...input.viewState, longitude: 30};
    act(() => mockDecks[0].props.onViewStateChange({viewState: camera}));
    expect(input.setViewState).toHaveBeenCalledWith(camera);
    rerender(<GlobeExportVideoPreview {...input} resolution={[1920, 1080]} viewState={camera} />);
    expect(mockDecks[0].props.useDevicePixels * mockDecks[0].props.width).toBe(1920);
    expect(getGlobeExportLayers.mock.lastCall[1].viewState).toBe(camera);
    expect(mockDecks[0].props.viewState).toBe(camera);
  });
});
