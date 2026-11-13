// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import download from 'downloadjs';
import {GlobeExportVideoPanelContainer} from './globe-export-video-container';
import {SwipeExportVideoPanelContainer} from './swipe-export-video-container';
import {drawStarsBackground} from '@kepler.gl/deckgl-layers';

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
    add = jest.fn(() => Promise.resolve());
    save = jest.fn(() => Promise.resolve(null));
    constructor() {
      mockEncoders.push(this);
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
jest.mock('./globe-export-video-preview', () => {
  const React = require('react');
  return {
    GlobeExportVideoPreview: React.forwardRef((_props, ref) => {
      React.useImperativeHandle(ref, () => mockPreview);
      return null;
    })
  };
});
jest.mock('./swipe-export-video-preview', () => {
  const React = require('react');
  return {
    SwipeExportVideoPreview: React.forwardRef((_props, ref) => {
      React.useImperativeHandle(ref, () => mockPreview);
      return null;
    })
  };
});
jest.mock('./swipe-export-settings', () => ({__esModule: true, default: () => null}));
jest.mock('../common', () => ({
  Button: ({children, ...props}) => <button {...props}>{children}</button>
}));
jest.mock('@kepler.gl/utils', () => ({getCameraTourDuration: () => 0}));
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

function mount(kind: 'globe' | 'swipe', durationMs = 33) {
  const ref = React.createRef<any>();
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
      visState: {filters: [], layers: [], animationConfig: {}}
    },
    mapProps: {},
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
