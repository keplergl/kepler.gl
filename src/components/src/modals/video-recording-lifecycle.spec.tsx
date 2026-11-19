// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render, renderHook, screen} from '@testing-library/react';
import download from 'downloadjs';
import {GlobeExportVideoPanelContainer} from './globe-export-video-container';
import {SwipeExportVideoPanelContainer} from './swipe-export-video-container';
import {drawStarsBackground} from '@kepler.gl/deckgl-layers';
import {useEffectAnimation} from './effect-animation';
import {NativeWebMEncoder} from './native-webm-encoder';
import {compositeVideoAnnotations} from './video-annotation-overlay';
import type {Annotation, Effect} from '@kepler.gl/types';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return {promise, resolve};
}

const mockEncoders: any[] = [];
const mockManagers: any[] = [];
const mockPreview = {
  areLayersLoaded: jest.fn(),
  getCanvas: jest.fn(),
  getCompositeCanvas: jest.fn(),
  _compositeFrame: jest.fn()
};
jest.mock('downloadjs', () => ({__esModule: true, default: jest.fn()}));
jest.mock('@hubble.gl/core', () => {
  class Encoder {
    extension = '.webm';
    mimeType = 'video/webm';
    start = jest.fn();
    addFrame = jest.fn((_canvas: HTMLCanvasElement) => Promise.resolve());
    save = jest.fn(() => Promise.resolve(null));
    constructor() {
      jest.spyOn(this as Encoder, 'add');
      jest.spyOn(this as Encoder, 'cancel');
      mockEncoders.push(this);
    }
    cancel() {
      return undefined;
    }
    add(canvas: HTMLCanvasElement) {
      return this.addFrame(canvas);
    }
  }
  return {
    DeckAdapter: class {
      animationManager = {
        attachAnimation: jest.fn(),
        setKeyframes: jest.fn(),
        timeline: {setTime: jest.fn()},
        draw: jest.fn()
      };
      constructor() {
        mockManagers.push(this.animationManager);
      }
    },
    KeplerAnimation: jest.fn(),
    WebMEncoder: Encoder,
    JPEGSequenceEncoder: Encoder,
    PNGSequenceEncoder: Encoder,
    GifEncoder: Encoder
  };
});
jest.mock('./video-annotation-overlay', () => ({
  VideoAnnotationPreview: ({children}) => children,
  compositeVideoAnnotations: jest.fn(() => Promise.resolve())
}));
jest.mock('./globe-export-video-preview', () => {
  const React = require('react');
  return {
    GlobeExportVideoPreview: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => mockPreview);
      React.useLayoutEffect(() => props.deckProps?.onBeforeRender?.());
      return null;
    })
  };
});
jest.mock('./swipe-export-video-preview', () => {
  const React = require('react');
  return {
    SwipeExportVideoPreview: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => mockPreview);
      React.useLayoutEffect(() => props.deckProps?.onBeforeRender?.());
      return null;
    })
  };
});
jest.mock('./swipe-export-settings', () => ({__esModule: true, default: () => null}));
jest.mock('../common', () => ({
  Button: ({children, ...props}) => <button {...props}>{children}</button>
}));
jest.mock('@kepler.gl/utils', () => ({getCameraTourDuration: () => 0}));
jest.mock('@kepler.gl/effects', () => jest.requireActual('../../../effects/src/animation-utils'));
jest.mock('@kepler.gl/deckgl-layers', () => ({
  drawStarsBackground: jest.fn(),
  getGlobeClearColor: () => [12, 34, 56],
  getStarsBackgroundImage: () => 'stars'
}));
jest.mock('./hubble-utils', () => ({
  scaleToVideoExport: (viewState, container) => ({...viewState, ...container}),
  getResolutionSetting: resolution => {
    const [width, height] = resolution.split('x').map(Number);
    return {width, height};
  },
  parseSetCameraType: (_preset, state) => state
}));

type Container = GlobeExportVideoPanelContainer | SwipeExportVideoPanelContainer;
let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let context: {
  fillRect: jest.Mock;
  drawImage: jest.Mock;
  getImageData: jest.Mock;
  fillStyle: string;
};
let source: HTMLCanvasElement;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockEncoders.length = 0;
  mockManagers.length = 0;
  frames = new Map();
  frameId = 0;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++frameId, callback);
    return frameId;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    frames.delete(id);
  });
  context = {
    fillRect: jest.fn(),
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({data: [1, 0, 0, 255]})),
    fillStyle: ''
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context as any);
  source = document.createElement('canvas');
  mockPreview.areLayersLoaded.mockReturnValue(true);
  mockPreview.getCanvas.mockReturnValue(source);
  mockPreview.getCompositeCanvas.mockReturnValue(source);
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  jest.useRealTimers();
});

function mount(
  kind: 'globe' | 'swipe',
  durationMs = 33,
  effects: Effect[] = [],
  annotations: Annotation[] = []
) {
  const ref = React.createRef<any>();
  const {result: animation} = renderHook(() => useEffectAnimation(effects, ref));
  const props = {
    exportVideoWidth: 320,
    handleClose: jest.fn(),
    header: false,
    mapData: {
      mapState: {
        longitude: 10,
        latitude: 20,
        zoom: 3,
        pitch: 0,
        bearing: 0,
        globe: {enabled: true, config: {stars: true}}
      },
      visState: {filters: [], layers: [], animationConfig: {}, annotations}
    },
    mapProps: {},
    deckProps: {onBeforeRender: animation.current},
    defaultFileName: 'recording',
    animatableFilters: [],
    onTripFrameUpdate: jest.fn(),
    onFilterFrameUpdate: jest.fn(),
    getTimeRangeFilterKeyframes: jest.fn(),
    onSettingsChange: jest.fn(),
    initialState: {durationMs, resolution: '640x360'},
    disableBaseMap: true,
    swipeStartPct: 0,
    swipeEndPct: 100,
    swipeEasing: 'linear' as const
  };
  const Component =
    kind === 'globe' ? GlobeExportVideoPanelContainer : SwipeExportVideoPanelContainer;
  const result = render(<Component {...props} ref={ref} />);
  return {...result, container: ref.current as Container};
}
async function flushFrames(count: number) {
  for (let i = 0; i < count; i++) {
    await act(async () => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(0));
      await Promise.resolve();
    });
  }
}
function start() {
  fireEvent.click(screen.getByText('Render'));
  act(() => {
    jest.advanceTimersByTime(500);
  });
  return mockEncoders[mockEncoders.length - 1];
}

describe.each(['globe', 'swipe'] as const)('%s recording orchestration', kind => {
  const framesPerCapture = kind === 'globe' ? 2 : 3;
  it('keeps native encoding opt-in and releases an active encoder when stopped', () => {
    const {container} = mount(kind);
    expect(new (container.getEncoder())({framerate: 30})).not.toBeInstanceOf(NativeWebMEncoder);
    act(() => container.setMediaType('webm-native'));
    const Native = container.getEncoder();
    expect(new Native({framerate: 30})).toBeInstanceOf(NativeWebMEncoder);
    act(() => container.setMediaType('webm'));
    expect(new (container.getEncoder())({framerate: 30})).not.toBeInstanceOf(NativeWebMEncoder);
    const encoder = start();
    act(() => container.onStop({abort: true}));
    expect(encoder.cancel).toHaveBeenCalledTimes(1);
  });

  it.each(['add', 'save'])(
    'recovers from %s rejection and permits another recording',
    async method => {
      const {container} = mount(kind, 0);
      const encoder = start();
      encoder[method].mockRejectedValueOnce(new Error('encoder unavailable'));
      await flushFrames(framesPerCapture);
      expect(screen.getByRole('alert')).toHaveTextContent('Video encoding failed');
      expect(container.state.rendering).toBe(false);
      expect(container.state.saving).toBe(false);
      expect(encoder.cancel).toHaveBeenCalledTimes(1);
      expect(download).not.toHaveBeenCalled();
      start();
      expect(screen.queryByRole('alert')).toBeNull();
      expect(container.state.rendering).toBe(true);
    }
  );
  const annotations = [{id: 'label', isVisible: true, mapIndex: 0}] as Annotation[];

  it('composites annotations before submitting frames to the opt-in native encoder', async () => {
    const {container} = mount(kind, 33, [], annotations);
    act(() => container.setMediaType('webm-native'));
    const Encoder = container.getEncoder();
    const encoder = new Encoder({framerate: 30});
    container.activeEncoder = encoder;
    const addNative = jest.spyOn(NativeWebMEncoder.prototype, 'add').mockResolvedValue(undefined);
    const pending = deferred<void>();
    jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
    let adding: Promise<void>;
    await act(async () => {
      adding = encoder.add(source);
      await Promise.resolve();
    });
    expect(compositeVideoAnnotations).toHaveBeenCalledTimes(1);
    expect(addNative).not.toHaveBeenCalled();
    await act(async () => {
      pending.resolve();
      await adding;
    });
    expect(addNative).toHaveBeenCalledWith(jest.mocked(compositeVideoAnnotations).mock.calls[0][0]);
    expect(addNative.mock.calls[0][0]).not.toBe(source);
  });

  it('waits for annotation composition before encoding and advancing the clock', async () => {
    mount(kind, 33, [], annotations);
    const pending = deferred<void>();
    jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
    const encoder = start();
    await flushFrames(framesPerCapture);
    expect(compositeVideoAnnotations).toHaveBeenCalledTimes(1);
    const [canvas, frame] = jest.mocked(compositeVideoAnnotations).mock.calls[0];
    expect([canvas.width, canvas.height]).toEqual([640, 360]);
    expect(frame.annotations).toBe(annotations);
    expect(frame.swipePercentage).toBe(kind === 'swipe' ? 0 : undefined);
    expect(encoder.addFrame).not.toHaveBeenCalled();
    expect(mockManagers[0].timeline.setTime.mock.calls).toEqual([[0]]);
    await flushFrames(framesPerCapture);
    expect(compositeVideoAnnotations).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve();
    });
    expect(encoder.addFrame).toHaveBeenCalledWith(canvas);
    expect(mockManagers[0].timeline.setTime.mock.calls).toEqual([[0], [33]]);
  });

  it('aborts annotation composition and discards its frame after cancellation', async () => {
    const {container} = mount(kind, 33, [], annotations);
    const pending = deferred<void>();
    jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
    const encoder = start();
    await flushFrames(framesPerCapture);
    const signal = jest.mocked(compositeVideoAnnotations).mock.calls[0][2];
    act(() => container.onStop());
    expect(signal?.aborted).toBe(true);
    await act(async () => {
      pending.resolve();
    });
    expect(encoder.addFrame).not.toHaveBeenCalled();
    expect(encoder.save).not.toHaveBeenCalled();
    expect(download).not.toHaveBeenCalled();
    expect(container.state.rendering).toBe(false);
    expect(mockManagers[0].timeline.setTime.mock.calls).toEqual([[0]]);
  });

  it('applies effect endpoints before captured frames and restores their starts after recording', async () => {
    const effect = {
      type: 'test-effect',
      isEnabled: true,
      parameters: {amount: 0},
      animation: {amount: {endValue: 100, easing: 'linear'}},
      getParameterDescriptions: () => [{name: 'amount', min: 0, max: 100}],
      setProps: ({parameters}) => Object.assign(effect.parameters, parameters)
    } as unknown as Effect;
    mount(kind, 66, [effect]);
    const encoder = start();
    const captured: number[] = [];
    encoder.add.mockImplementation(() => {
      captured.push(effect.parameters.amount);
      return Promise.resolve();
    });
    await flushFrames(framesPerCapture * 3);
    expect(captured).toEqual([0, 50, 100]);
    expect(effect.parameters.amount).toBe(0);
  });

  it('waits for each encoded frame and save before downloading, then restores the camera', async () => {
    const {container} = mount(kind);
    const initial = {...container.state.viewState};
    const encoder = start();
    const first = deferred<void>();
    const second = deferred<void>();
    const save = deferred<Blob>();
    encoder.add.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    encoder.save.mockReturnValue(save.promise);
    act(() => container.setViewState({...initial, longitude: 99} as any));
    await flushFrames(framesPerCapture);
    expect(encoder.start).toHaveBeenCalledTimes(1);
    expect(encoder.add).toHaveBeenCalledTimes(1);
    expect(mockManagers[0].timeline.setTime.mock.calls).toEqual([[0]]);
    const canvas = encoder.add.mock.calls[0][0];
    expect([canvas.width, canvas.height]).toEqual([640, 360]);
    expect(context.drawImage).toHaveBeenCalledWith(source, 0, 0, 640, 360);
    await flushFrames(5);
    expect(encoder.add).toHaveBeenCalledTimes(1);
    await act(async () => {
      first.resolve();
    });
    expect(mockManagers[0].timeline.setTime.mock.calls).toEqual([[0], [33]]);
    await flushFrames(framesPerCapture);
    expect(encoder.add).toHaveBeenCalledTimes(2);
    expect(encoder.save).not.toHaveBeenCalled();
    await act(async () => {
      second.resolve();
    });
    expect(screen.getByText('Saving...')).toBeTruthy();
    expect(download).not.toHaveBeenCalled();
    const blob = new Blob(['video']);
    await act(async () => {
      save.resolve(blob);
    });
    expect(download).toHaveBeenCalledWith(blob, 'recording.webm', 'video/webm');
    expect(container.state.viewState).toEqual(initial);
    expect(container.state).toMatchObject({rendering: false, saving: false, currentTimeMs: 0});
  });

  it('ignores a completed frame from a cancelled recording after a new recording starts', async () => {
    const {container} = mount(kind);
    const old = start();
    const pending = deferred<void>();
    old.add.mockReturnValue(pending.promise);
    await flushFrames(framesPerCapture);
    act(() => container.onStop());
    const current = start();
    const currentFrame = deferred<void>();
    current.add.mockReturnValue(currentFrame.promise);
    await act(async () => {
      pending.resolve();
    });
    expect(old.save).not.toHaveBeenCalled();
    await flushFrames(framesPerCapture);
    expect(current.add).toHaveBeenCalledTimes(1);
    expect(container.state.rendering).toBe(true);
    expect(download).not.toHaveBeenCalled();
  });

  it('ignores a pending save after cancellation', async () => {
    const {container} = mount(kind, 0);
    const encoder = start();
    const pending = deferred<Blob>();
    encoder.save.mockReturnValue(pending.promise);
    await flushFrames(framesPerCapture);
    expect(encoder.save).toHaveBeenCalledTimes(1);
    act(() => container.onStop());
    await act(async () => {
      pending.resolve(new Blob(['cancelled']));
    });
    expect(download).not.toHaveBeenCalled();
    expect(container.state.rendering).toBe(false);
  });

  it('does not capture after unmount during the initial delay', async () => {
    const {unmount} = mount(kind);
    fireEvent.click(screen.getByText('Render'));
    const encoder = mockEncoders[0];
    unmount();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await flushFrames(4);
    expect(encoder.add).not.toHaveBeenCalled();
    expect(encoder.save).not.toHaveBeenCalled();
  });

  it('stops queued capture callbacks before reading the preview', async () => {
    const {container} = mount(kind);
    const encoder = start();
    await flushFrames(1);
    act(() => container.onStop());
    await flushFrames(4);
    expect(encoder.add).not.toHaveBeenCalled();
    expect(mockPreview.getCanvas).not.toHaveBeenCalled();
    expect(mockPreview.getCompositeCanvas).not.toHaveBeenCalled();
  });

  it('completes without a download when the encoder has no output', async () => {
    const {container} = mount(kind, 0);
    const encoder = start();
    await flushFrames(framesPerCapture);
    expect(encoder.save).toHaveBeenCalledTimes(1);
    expect(download).not.toHaveBeenCalled();
    expect(container.state).toMatchObject({rendering: false, saving: false});
  });
});

it('waits for globe layers and bounds readiness retries so export cannot wait indefinitely', async () => {
  mount('globe', 0);
  mockPreview.areLayersLoaded.mockReturnValue(false);
  const encoder = start();
  await flushFrames(2);
  expect(encoder.add).not.toHaveBeenCalled();
  await flushFrames(180);
  expect(mockPreview.areLayersLoaded).toHaveBeenCalledTimes(61);
  expect(encoder.add).toHaveBeenCalledTimes(1);
});

it('recomposites blank swipe frames and captures when content becomes ready', async () => {
  mount('swipe', 0);
  context.getImageData.mockReturnValueOnce({data: [0, 0, 0, 0]});
  const encoder = start();
  await flushFrames(3);
  expect(encoder.add).not.toHaveBeenCalled();
  expect(mockPreview._compositeFrame).toHaveBeenCalledTimes(1);
  await flushFrames(4);
  expect(encoder.add).toHaveBeenCalledTimes(1);
});

it('bounds retries for persistently blank swipe frames', async () => {
  mount('swipe', 0);
  context.getImageData.mockReturnValue({data: [0, 0, 0, 0]});
  const encoder = start();
  await flushFrames(43);
  expect(mockPreview._compositeFrame).toHaveBeenCalledTimes(10);
  expect(encoder.add).toHaveBeenCalledTimes(1);
});

it('still encodes a swipe canvas when cross-origin content prevents pixel inspection', async () => {
  mount('swipe', 0);
  context.getImageData.mockImplementation(() => {
    throw new DOMException('Tainted', 'SecurityError');
  });
  const encoder = start();
  await flushFrames(3);
  expect(encoder.add).toHaveBeenCalledTimes(1);
  expect(mockPreview._compositeFrame).not.toHaveBeenCalled();
});

it('reuses the globe output canvas and paints its background before each deck frame', async () => {
  mount('globe', 33);
  const encoder = start();
  await flushFrames(4);
  expect(encoder.add).toHaveBeenCalledTimes(2);
  expect(encoder.add.mock.calls[1][0]).toBe(encoder.add.mock.calls[0][0]);
  expect(context.fillRect).toHaveBeenCalledTimes(2);
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 640, 360);
  expect(drawStarsBackground).toHaveBeenCalledTimes(2);
  expect(context.fillRect.mock.invocationCallOrder[0]).toBeLessThan(
    context.drawImage.mock.invocationCallOrder[0]
  );
});
