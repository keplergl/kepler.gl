// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {act} from '@testing-library/react';
import {preparePreviewFrame, renderPreviewFrame} from './render-preview-frame';
import {compositeVideoAnnotations} from './video-annotation-overlay';
import {calculateLayerData, visStateUpdaters} from '@kepler.gl/reducers';

let mockModalProps;
jest.mock('./export-video-modal', () => ({
  __esModule: true,
  default: () => props => {
    mockModalProps = props;
    return null;
  }
}));
jest.mock('./video-annotation-overlay', () => ({
  compositeVideoAnnotations: jest.fn(async () => undefined)
}));
jest.mock('../annotations/annotation-readout', () => ({getAnnotationReadoutValues: () => ({})}));
jest.mock('./hubble-utils', () => ({getAnimatableFilters: data => data.visState.filters}));
jest.mock('@kepler.gl/reducers', () => ({
  calculateLayerData: jest.fn(layer => ({layer, layerData: {owner: layer}})),
  visStateUpdaters: {
    setLayerAnimationTimeUpdater: jest.fn((state, {value}) => ({
      ...state,
      animationConfig: {...state.animationConfig, currentTime: value}
    })),
    setFilterAnimationTimeUpdater: jest.fn((state, {idx, value}) => ({
      ...state,
      filters: state.filters.map((filter, index) => ({
        ...filter,
        value: idx === index ? value : filter.value
      }))
    }))
  }
}));
jest.mock('@kepler.gl/utils', () => ({
  cameraForMap: camera => camera,
  getCameraTourDuration: tour => tour?.duration || 0,
  evaluateCameraTour: (_tour, time) => ({longitude: time / 1000, latitude: 20, zoom: 4})
}));
jest.mock('@kepler.gl/deckgl-layers', () => ({
  getGlobeClearColor: () => [1, 2, 3],
  drawStarsBackground: jest.fn()
}));

class TestLayer {
  isValid = true;
  id;
  config;
  meta = {};
  cache = [];
  read = () => {
    this.cache.push('read');
    return this.config.label;
  };
  constructor(config) {
    this.id = config.id;
    this.config = config;
  }
}
function fixture() {
  return {
    mapState: {longitude: 1, latitude: 20, zoom: 4, width: 1000, height: 700},
    mapStyle: {},
    visState: {
      layers: [new TestLayer({id: 'points', label: 'Points', animation: {enabled: true}})],
      layerData: [],
      datasets: {data: {filteredIndex: [0, 1]}},
      filters: [],
      animationConfig: {currentTime: 100},
      cameraTour: {duration: 1000},
      effects: [{clone: () => ({parameters: {strength: 1}})}],
      annotations: [{id: 'label', isVisible: true}]
    }
  };
}
const size = {width: 1000, height: 700};
const renderOptions = {mapboxApiAccessToken: ''};
let draw;
let pixelRatio;
beforeEach(() => {
  jest.clearAllMocks();
  mockModalProps = undefined;
  pixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
  draw = jest.fn();
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue({drawImage: draw, fillRect: jest.fn()});
  jest
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/png;base64,cHJldmlldw==');
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  Object.defineProperty(window, 'devicePixelRatio', pixelRatio);
});

function frame() {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const layer = {isLoaded: false};
  const panel = {
    props: {mapData: mockModalProps, exportVideoWidth: 500},
    state: {
      viewState: mockModalProps.mapState,
      adapter: {deck: {props: {layers: [layer]}, redraw: jest.fn()}}
    },
    _getContainer: () => ({width: 500, height: 350})
  };
  const map = {
    getCanvas: () => canvas,
    isStyleLoaded: () => true,
    areTilesLoaded: jest.fn(() => false)
  };
  return {canvas, panel, layer, map};
}

test('isolates mutable layers, bound callbacks, effects, datasets and requested clocks', () => {
  const live = fixture();
  const snapshot = preparePreviewFrame(live, {...size, dataTime: 250, cameraTimeMs: 500});
  expect(snapshot.mapState.longitude).toBe(0.5);
  expect(snapshot.visState.animationConfig.currentTime).toBe(250);
  snapshot.visState.layers[0].read();
  snapshot.visState.effects[0].parameters.strength = 2;
  snapshot.visState.datasets.data.filteredIndex.push(2);
  expect(live.visState.layers[0].cache).toEqual([]);
  expect(live.visState.datasets.data.filteredIndex).toEqual([0, 1]);
  expect(live.mapState.longitude).toBe(1);
  expect(live.visState.animationConfig.currentTime).toBe(100);
  expect(snapshot.visState.layerData[0].owner).toBe(snapshot.visState.layers[0]);
  expect(calculateLayerData).toHaveBeenCalled();
});

test('updates every time filter even when the previous update replaces other filter objects', () => {
  const live = fixture();
  live.visState.filters = ['first', 'second'].map(id => ({
    id,
    value: [100, 150],
    animationWindow: 'free'
  }));
  const snapshot = preparePreviewFrame(live, {...size, dataTime: 250});
  expect(snapshot.visState.filters.map(filter => filter.value)).toEqual([
    [200, 250],
    [200, 250]
  ]);
  expect(
    visStateUpdaters.setFilterAnimationTimeUpdater.mock.calls.map(call => call[1].idx)
  ).toEqual([0, 1]);
  expect(live.visState.filters[0].value).toEqual([100, 150]);
});

test.each([
  {width: 0},
  {height: NaN},
  {width: 9000},
  {dataTime: Infinity},
  {cameraTimeMs: -1},
  {cameraTimeMs: 1001}
])('rejects invalid frame requests: %p', invalid => {
  expect(() => preparePreviewFrame(fixture(), {...size, ...invalid})).toThrow(/Preview/);
});

test('waits for committed export buffers, layers and basemap and normalizes bounded pixel rounding', async () => {
  const live = fixture();
  let result;
  await act(async () => {
    result = renderPreviewFrame(live, {...size, dataTime: 250, cameraTimeMs: 500}, renderOptions);
  });
  const {canvas, panel, layer, map} = frame();
  const callbacks = mockModalProps.framePreview;
  callbacks.onRender(panel, map);
  expect(draw).not.toHaveBeenCalled();
  callbacks.onReady(panel);
  callbacks.onRender(panel, map);
  expect(draw).not.toHaveBeenCalled();
  map.areTilesLoaded.mockReturnValue(true);
  callbacks.onRender(panel, map);
  expect(draw).not.toHaveBeenCalled();
  layer.isLoaded = true;
  canvas.width = 540;
  callbacks.onRender(panel, map);
  expect(draw).not.toHaveBeenCalled();
  canvas.width = size.width - 1;
  canvas.height = size.height - 2;
  await act(async () => {
    callbacks.onRender(panel, map);
    await result;
  });
  expect(draw).toHaveBeenCalledWith(canvas, 0, 0, size.width, size.height);
  expect(compositeVideoAnnotations).toHaveBeenCalledWith(
    expect.objectContaining(size),
    expect.objectContaining({
      mapState: panel.state.viewState,
      animationTimeMs: 500,
      annotations: live.visState.annotations,
      width: 500,
      height: 350
    }),
    expect.any(AbortSignal)
  );
  await expect(result).resolves.toEqual({...size, data: 'cHJldmlldw==', mimeType: 'image/png'});
  expect(Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')).toEqual(pixelRatio);
  expect(live.visState.animationConfig.currentTime).toBe(100);
});

test('preserves omitted camera/data clocks and cancels without leaving a mount or changed DPR', async () => {
  const live = fixture();
  const controller = new AbortController();
  let result;
  await act(async () => {
    result = renderPreviewFrame(live, size, {...renderOptions, signal: controller.signal});
  });
  expect(mockModalProps.mapState).toEqual(live.mapState);
  expect(mockModalProps.visState.animationConfig).toEqual(live.visState.animationConfig);
  expect(mockModalProps.framePreview.animationTimeMs).toBeUndefined();
  const failure = expect(result).rejects.toThrow('canceled');
  await act(async () => {
    controller.abort();
    await failure;
  });
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  expect(Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')).toEqual(pixelRatio);
});

test('rejects concurrent capture and reports native rendering failures', async () => {
  let result;
  await act(async () => {
    result = renderPreviewFrame(fixture(), size, renderOptions);
  });
  await expect(renderPreviewFrame(fixture(), size, renderOptions)).rejects.toThrow(
    'already rendering'
  );
  const failure = expect(result).rejects.toThrow('Tile request failed');
  await act(async () => {
    mockModalProps.framePreview.onError(new Error('Tile request failed'));
    await failure;
  });
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
});

test('times out unfinished rendering with a useful error and releases the request lock', async () => {
  jest.useFakeTimers();
  let result;
  await act(async () => {
    result = renderPreviewFrame(fixture(), size, renderOptions);
  });
  const failure = expect(result).rejects.toThrow('45 seconds');
  await act(async () => {
    jest.advanceTimersByTime(45000);
    await failure;
  });
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  expect(Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')).toEqual(pixelRatio);
});

test('reports visible layer rebuild failures instead of omitting them from the image', () => {
  calculateLayerData.mockImplementationOnce(layer => ({
    layer: {...layer, isValid: false, errorMessage: 'Invalid coordinates'},
    layerData: {}
  }));
  expect(() => preparePreviewFrame(fixture(), size)).toThrow('Invalid coordinates');
});

test('reports visible async Zarr layers as unsupported instead of returning an incomplete frame', () => {
  const live = fixture();
  live.visState.layers[0].type = 'zarr';
  live.visState.layers[0].config.isVisible = true;
  expect(() => preparePreviewFrame(live, size)).toThrow('visible Zarr');
});
