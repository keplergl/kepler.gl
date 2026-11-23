// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  getNativeVideoExportCapabilities,
  programmaticTimecode,
  renderNativeVideo,
  withVideoExportErrors
} from './programmatic-video-export';
import {getNativeWebMConfig} from './video-export-formats';

jest.mock('./video-export-formats', () => ({getNativeWebMConfig: jest.fn()}));
jest.mock('./hubble-utils', () => ({RESOLUTIONS: [{width: 1920, height: 1080}]}));

const request = () => ({
  signal: new AbortController().signal,
  onProgress: jest.fn(),
  onComplete: jest.fn(),
  onError: jest.fn()
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

test('reports only encoders supported at the requested size', async () => {
  jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,');
  jest.mocked(getNativeWebMConfig).mockResolvedValue(undefined);
  expect(await getNativeVideoExportCapabilities(1920, 1080)).toMatchObject({
    available: false,
    formats: [],
    frameRates: [30],
    probedSize: {width: 1920, height: 1080}
  });
  jest.mocked(getNativeWebMConfig).mockResolvedValue({
    codec: 'vp9',
    config: {codec: 'vp09.00.51.08', width: 1920, height: 1080}
  });
  expect(await getNativeVideoExportCapabilities(1920, 1080)).toMatchObject({
    available: true,
    formats: ['webm-native'],
    nativeCodec: 'vp9'
  });
  expect(getNativeWebMConfig).toHaveBeenLastCalledWith(1920, 1080, 30);
});

test('records exactly 600 frames for a 20-second 30 fps export', () => {
  const timecode = {start: 0, end: 20000, framerate: 30};
  const automated = programmaticTimecode(timecode, request());
  const timestamps = Array.from({length: 602}, (_, index) => (index * 1000) / 30).filter(
    time => time <= automated.end
  );
  expect(timestamps).toHaveLength(600);
  expect(programmaticTimecode(timecode)).toBe(timecode);
});

test('starts without UI, reports rendering and encoding, and cancels the native renderer', () => {
  jest.useFakeTimers();
  const controller = new AbortController();
  const callbacks = {...request(), signal: controller.signal};
  const panel = {
    state: {durationMs: 1000, currentTimeMs: 0, saving: false},
    onRenderVideo: jest.fn(),
    onStop: jest.fn()
  };
  const cleanup = renderNativeVideo(panel, callbacks);
  expect(panel.onRenderVideo).toHaveBeenCalledTimes(1);
  panel.state.currentTimeMs = 500;
  jest.advanceTimersByTime(250);
  expect(callbacks.onProgress).toHaveBeenLastCalledWith(0.5, 'rendering');
  panel.state.saving = true;
  jest.advanceTimersByTime(250);
  expect(callbacks.onProgress).toHaveBeenLastCalledWith(0.5, 'encoding');
  controller.abort();
  cleanup();
  expect(panel.onStop).toHaveBeenCalledTimes(1);
  expect(panel.onStop).toHaveBeenCalledWith({abort: true});
  expect(jest.getTimerCount()).toBe(0);
});

test('reports an actionable timeout instead of leaving a stalled job active', () => {
  jest.useFakeTimers();
  const callbacks = request();
  const panel = {
    state: {durationMs: 1000, currentTimeMs: 0},
    onRenderVideo: jest.fn(),
    onStop: jest.fn()
  };
  renderNativeVideo(panel, callbacks);
  jest.advanceTimersByTime(121000);
  expect(callbacks.onError).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining('Check basemap access and data loading')
    })
  );
  expect(panel.onStop).toHaveBeenCalledWith({abort: true});
  expect(jest.getTimerCount()).toBe(0);
});

test('surfaces asynchronous frame and finalization failures swallowed by Hubble', async () => {
  const callbacks = request();
  class Encoder {
    add() {
      return Promise.reject(new Error('frame unavailable'));
    }
    save() {
      return Promise.reject(new Error('encoder flush failed'));
    }
  }
  const Wrapped = withVideoExportErrors(Encoder, callbacks);
  const encoder = new Wrapped();
  await expect(encoder.add()).rejects.toThrow('frame unavailable');
  await expect(encoder.save()).rejects.toThrow('encoder flush failed');
  expect(callbacks.onError.mock.calls.map(([error]) => error.message)).toEqual([
    expect.stringContaining('frame unavailable'),
    expect.stringContaining('encoder flush failed')
  ]);
});
