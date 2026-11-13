// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {InputStyle, MapState} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';
import AddMapStyleModalFactory from './add-map-style-modal';

type Handler = () => void;
function mockCreateMap() {
  const listeners = new Map<string, Set<Handler>>();
  return {
    listeners,
    on: jest.fn((event: string, handler: Handler) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)?.add(handler);
    }),
    off: jest.fn((event: string, handler: Handler) => listeners.get(event)?.delete(handler)),
    emit: (event: string) => [...(listeners.get(event) || [])].forEach(handler => handler()),
    getStyle: jest.fn(() => ({version: 8, name: 'Loaded style', sources: {}, layers: []})),
    getCanvas: () => ({toDataURL: mockCapture}),
    count: (event: string) => listeners.get(event)?.size || 0
  };
}
const mockCapture = jest.fn(() => 'data:image/png;base64,preview');
type MapRecord = {
  map: ReturnType<typeof mockCreateMap>;
  props: Record<string, any>;
  provider: string;
};
const mockMaps: MapRecord[] = [];
function mockMapComponent(provider: string) {
  return React.forwardRef(function PreviewMap(props: Record<string, any>, ref) {
    const record = React.useRef<MapRecord | null>(null);
    if (!record.current) {
      record.current = {map: mockCreateMap(), props, provider};
      mockMaps.push(record.current);
    }
    record.current.props = props;
    const map = record.current.map;
    React.useImperativeHandle(ref, () => ({getMap: () => map}));
    return null;
  });
}
jest.mock('react-map-gl/mapbox-legacy', () => ({Map: mockMapComponent('mapbox')}));
jest.mock('@vis.gl/react-maplibre', () => ({Map: mockMapComponent('maplibre')}));

const Modal = AddMapStyleModalFactory();
const mapState = {longitude: 12, latitude: 48, zoom: 3, bearing: 0, pitch: 0} as MapState;
const inputStyle: InputStyle = {
  id: null,
  accessToken: null,
  error: false,
  isValid: true,
  label: null,
  style: null,
  url: 'https://example.com/style.json',
  icon: null,
  custom: true,
  uploadedFile: null
};
function setup(style: Partial<InputStyle> = {}) {
  const props = {
    inputStyle: {...inputStyle, ...style},
    inputMapStyle: jest.fn(),
    loadCustomMapStyle: jest.fn(),
    mapboxApiAccessToken: 'fallback-token',
    mapState
  };
  const tree = () => (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={{}} onError={() => undefined}>
        <Modal {...props} />
      </IntlProvider>
    </ThemeProvider>
  );
  const view = render(tree());
  return {props, view, rerender: () => view.rerender(tree())};
}
function latest() {
  return mockMaps[mockMaps.length - 1];
}

afterEach(() => {
  cleanup();
  mockMaps.length = 0;
  mockCapture.mockReset().mockReturnValue('data:image/png;base64,preview');
  jest.restoreAllMocks();
});

describe('custom basemap preview', () => {
  test('waits for a valid style and forwards style URL, camera and drawing-buffer options', () => {
    const {props, rerender} = setup({isValid: false});
    expect(mockMaps).toHaveLength(0);
    props.inputStyle.isValid = true;
    rerender();
    expect(latest().provider).toBe('maplibre');
    expect(latest().props).toMatchObject({
      ...mapState,
      mapStyle: inputStyle.url,
      preserveDrawingBuffer: true
    });
  });

  test('registers once per map and captures only after idle, once per loaded style', () => {
    const {props, rerender} = setup();
    const {map} = latest();
    rerender();
    expect(map.count('style.load')).toBe(1);
    expect(map.count('error')).toBe(1);
    act(() => map.emit('style.load'));
    expect(props.loadCustomMapStyle).toHaveBeenLastCalledWith({
      style: map.getStyle(),
      error: false
    });
    expect(mockCapture).not.toHaveBeenCalled();
    act(() => map.emit('idle'));
    expect(mockCapture).toHaveBeenCalledWith('image/png');
    expect(props.loadCustomMapStyle).toHaveBeenLastCalledWith({
      icon: 'data:image/png;base64,preview'
    });
    act(() => map.emit('idle'));
    expect(mockCapture).toHaveBeenCalledTimes(1);
  });

  test('replaces pending captures on repeated style loads and uses the latest action callback', () => {
    const {props, rerender} = setup();
    const oldCallback = props.loadCustomMapStyle;
    const {map} = latest();
    act(() => {
      map.emit('style.load');
      map.emit('style.load');
    });
    expect(map.count('idle')).toBe(1);
    props.loadCustomMapStyle = jest.fn();
    rerender();
    act(() => map.emit('idle'));
    expect(props.loadCustomMapStyle).toHaveBeenCalledWith({icon: 'data:image/png;base64,preview'});
    expect(oldCallback).toHaveBeenCalledTimes(2);
    act(() => map.emit('error'));
    expect(props.loadCustomMapStyle).toHaveBeenLastCalledWith({error: true});
  });

  test('detaches old map listeners and pending captures when switching sources', () => {
    const {props, rerender} = setup();
    const old = latest().map;
    act(() => old.emit('style.load'));
    props.inputStyle.url = 'https://example.com/other.json';
    rerender();
    expect(latest().map).not.toBe(old);
    expect(['style.load', 'error', 'idle'].map(event => old.count(event))).toEqual([0, 0, 0]);
    props.loadCustomMapStyle.mockClear();
    act(() => {
      old.emit('idle');
      old.emit('error');
    });
    expect(props.loadCustomMapStyle).not.toHaveBeenCalled();
    act(() => latest().map.emit('style.load'));
    expect(props.loadCustomMapStyle).toHaveBeenCalledWith({
      style: latest().map.getStyle(),
      error: false
    });
  });

  test('keeps a loaded style usable when its thumbnail canvas is tainted', () => {
    const {props} = setup();
    const {map} = latest();
    mockCapture.mockImplementation(() => {
      throw new Error('tainted canvas');
    });
    act(() => {
      map.emit('style.load');
      map.emit('idle');
    });
    expect(props.loadCustomMapStyle).toHaveBeenCalledTimes(1);
    expect(props.loadCustomMapStyle).toHaveBeenCalledWith({style: map.getStyle(), error: false});
    expect(map.count('idle')).toBe(0);
  });

  test('clears a load error when a subsequent style finishes loading', () => {
    const {props} = setup();
    const {map} = latest();
    act(() => map.emit('error'));
    expect(props.loadCustomMapStyle).toHaveBeenLastCalledWith({error: true});
    act(() => map.emit('style.load'));
    expect(props.loadCustomMapStyle).toHaveBeenLastCalledWith({
      style: map.getStyle(),
      error: false
    });
  });

  test('selects Mapbox for Mapbox styles and remounts on access-token changes', () => {
    const getMapLib = jest
      .spyOn(getApplicationConfig().baseMapLibraryConfig.mapbox, 'getMapLib')
      .mockReturnValue(Promise.resolve({}) as any);
    const {props, rerender} = setup({url: 'mapbox://styles/example/style'});
    expect(latest().provider).toBe('mapbox');
    expect(getMapLib).toHaveBeenCalled();
    expect(latest().props.mapboxAccessToken).toBe('fallback-token');
    const old = latest().map;
    props.inputStyle.accessToken = 'style-token';
    rerender();
    expect(latest().map).not.toBe(old);
    expect(latest().props.mapboxAccessToken).toBe('style-token');
    expect(old.count('style.load')).toBe(0);
  });

  test('forwards a custom request transformer with the effective access token', () => {
    const transformer = jest.fn((url: string) => ({url: `proxy:${url}`}));
    const factory = jest.fn(() => transformer);
    render(
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" onError={() => undefined}>
          <Modal
            inputStyle={{...inputStyle, accessToken: 'custom-token'}}
            inputMapStyle={jest.fn()}
            loadCustomMapStyle={jest.fn()}
            mapState={mapState}
            mapboxApiAccessToken="fallback"
            transformRequest={factory}
          />
        </IntlProvider>
      </ThemeProvider>
    );
    expect(factory).toHaveBeenCalledWith('custom-token');
    expect(latest().props.transformRequest('https://tiles.example', 'Tile')).toEqual({
      url: 'proxy:https://tiles.example'
    });
  });

  test('dispatches URL, name and token edits without mutating the supplied style', () => {
    const {props, view} = setup();
    const inputs = view.getAllByRole('textbox');
    fireEvent.change(inputs[0], {target: {value: 'https://example.com/new.json'}});
    expect(props.inputMapStyle).toHaveBeenLastCalledWith(
      expect.objectContaining({
        url: 'https://example.com/new.json',
        id: 'Custom Style',
        icon: expect.any(String)
      })
    );
    fireEvent.change(inputs[1], {target: {value: 'new-token'}});
    expect(props.inputMapStyle).toHaveBeenLastCalledWith({accessToken: 'new-token'});
    fireEvent.change(inputs[2], {target: {value: 'My style'}});
    expect(props.inputMapStyle).toHaveBeenLastCalledWith({label: 'My style'});
    expect(props.inputStyle).toEqual(inputStyle);
  });
});
