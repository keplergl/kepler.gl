// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {NativeWebMEncoder} from './native-webm-encoder';

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return {promise, resolve, reject};
}

const mockPacketAdd = jest.fn();
const mockPacketClose = jest.fn();
const mockMuxStart = jest.fn();
const mockMuxFinalize = jest.fn();
const mockMuxCancel = jest.fn();
const mockOutputs: any[] = [];
const mockSources: any[] = [];
const mockFallbacks: any[] = [];

jest.mock(
  'mediabunny',
  () => ({
    BufferTarget: class {
      buffer: ArrayBuffer | null = null;
    },
    WebMOutputFormat: class {},
    Output: class {
      target: {buffer: ArrayBuffer | null};
      addVideoTrack = jest.fn();
      start = mockMuxStart;
      cancel = mockMuxCancel;
      finalize = jest.fn(async () => {
        await mockMuxFinalize();
        this.target.buffer = new Uint8Array([1, 2, 3]).buffer;
      });
      constructor({target}) {
        this.target = target;
        mockOutputs.push(this);
      }
    },
    EncodedVideoPacketSource: class {
      add = mockPacketAdd;
      close = mockPacketClose;
      constructor(codec) {
        mockSources.push({codec, source: this});
      }
    },
    EncodedPacket: {fromEncodedChunk: chunk => ({chunk})}
  }),
  {virtual: true}
);

jest.mock('@hubble.gl/core', () => ({
  WebMEncoder: class {
    start = jest.fn();
    add = jest.fn().mockResolvedValue(undefined);
    save = jest.fn().mockResolvedValue(new Blob(['fallback'], {type: 'video/webm'}));
    constructor(settings) {
      mockFallbacks.push({settings, encoder: this});
    }
  }
}));

const nativeEncoders: FakeVideoEncoder[] = [];
const frames: FakeVideoFrame[] = [];
let configureError: Error | undefined;
class FakeVideoEncoder extends EventTarget {
  static isConfigSupported = jest.fn();
  encodeQueueSize = 0;
  state = 'configured';
  configure = jest.fn(() => {
    if (configureError) throw configureError;
  });
  encode = jest.fn();
  flush = jest.fn().mockResolvedValue(undefined);
  close = jest.fn(() => {
    this.state = 'closed';
  });
  constructor(public callbacks: {output: Function; error: Function}) {
    super();
    nativeEncoders.push(this);
  }
}
class FakeVideoFrame {
  close = jest.fn();
  constructor(
    public canvas: HTMLCanvasElement,
    public init: {timestamp: number; duration: number}
  ) {
    frames.push(this);
  }
}
const originalVideoEncoder = Object.getOwnPropertyDescriptor(globalThis, 'VideoEncoder');
const originalVideoFrame = Object.getOwnPropertyDescriptor(globalThis, 'VideoFrame');
let canvas: HTMLCanvasElement;

async function settle() {
  for (let index = 0; index < 15; index++) await Promise.resolve();
}

beforeEach(() => {
  jest.clearAllMocks();
  configureError = undefined;
  nativeEncoders.length =
    frames.length =
    mockOutputs.length =
    mockSources.length =
    mockFallbacks.length =
      0;
  FakeVideoEncoder.isConfigSupported.mockImplementation(async config => ({
    supported: true,
    config
  }));
  mockPacketAdd.mockResolvedValue(undefined);
  mockMuxStart.mockResolvedValue(undefined);
  mockMuxFinalize.mockResolvedValue(undefined);
  mockMuxCancel.mockResolvedValue(undefined);
  Object.defineProperty(globalThis, 'VideoEncoder', {configurable: true, value: FakeVideoEncoder});
  Object.defineProperty(globalThis, 'VideoFrame', {configurable: true, value: FakeVideoFrame});
  canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
});
afterEach(() => {
  jest.restoreAllMocks();
  for (const [key, descriptor] of [
    ['VideoEncoder', originalVideoEncoder],
    ['VideoFrame', originalVideoFrame]
  ] as const) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

describe('NativeWebMEncoder', () => {
  test('timestamps every captured frame at the selected rate regardless of elapsed wall time', async () => {
    const encoder = new NativeWebMEncoder({framerate: 30});
    encoder.start();
    const clock = jest.spyOn(Date, 'now');
    for (const time of [0, 5000, 5001, 900000]) {
      clock.mockReturnValue(time);
      await encoder.add(canvas);
    }
    expect(frames.map(frame => frame.init)).toEqual([
      {timestamp: 0, duration: 33333},
      {timestamp: 33333, duration: 33334},
      {timestamp: 66667, duration: 33333},
      {timestamp: 100000, duration: 33333}
    ]);
    expect(frames.every(frame => frame.close.mock.calls.length === 1)).toBe(true);
    expect(nativeEncoders[0].configure).toHaveBeenCalledWith(
      expect.objectContaining({
        codec: 'vp09.00.51.08',
        width: 1280,
        height: 720,
        framerate: 30,
        latencyMode: 'quality',
        bitrateMode: 'variable'
      })
    );
    expect(mockOutputs[0].addVideoTrack).toHaveBeenCalledWith(mockSources[0].source, {
      frameRate: 30
    });
    encoder.cancel();
  });

  test('uses inter frames between periodic two-second keyframes without flushing each frame', async () => {
    const encoder = new NativeWebMEncoder({framerate: 30});
    for (let index = 0; index <= 60; index++) await encoder.add(canvas);
    const native = nativeEncoders[0];
    expect(
      native.encode.mock.calls
        .filter(([, options]) => options.keyFrame)
        .map(([frame]) => frame.init.timestamp)
    ).toEqual([0, 2000000]);
    expect(native.flush).not.toHaveBeenCalled();
    encoder.cancel();
  });

  test('waits for the native queue to drain before allocating another raw frame', async () => {
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    native.encodeQueueSize = 4;
    let finished = false;
    const pending = encoder.add(canvas).then(() => {
      finished = true;
    });
    await settle();
    expect(finished).toBe(false);
    expect(frames).toHaveLength(1);
    native.encodeQueueSize = 3;
    native.dispatchEvent(new Event('dequeue'));
    await pending;
    expect(frames).toHaveLength(2);
    encoder.cancel();
  });

  test('includes an in-flight frame when save is requested during queue backpressure', async () => {
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    native.encodeQueueSize = 4;
    const adding = encoder.add(canvas);
    const saving = encoder.save();
    await settle();
    expect(frames).toHaveLength(1);
    expect(native.flush).not.toHaveBeenCalled();
    expect(mockMuxFinalize).not.toHaveBeenCalled();

    native.encodeQueueSize = 3;
    native.dispatchEvent(new Event('dequeue'));
    await adding;
    const blob = await saving;
    expect(native.encode).toHaveBeenCalledTimes(2);
    expect(frames[1].init.timestamp).toBe(33333);
    expect(native.flush).toHaveBeenCalledTimes(1);
    expect(native.encode.mock.invocationCallOrder[1]).toBeLessThan(
      native.flush.mock.invocationCallOrder[0]
    );
    expect(mockMuxFinalize).toHaveBeenCalledTimes(1);
    expect(blob).toMatchObject({size: 3, type: 'video/webm'});
  });

  test('flushes delayed chunks and awaits packet writes and finalization before returning the WebM', async () => {
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    const flushed = deferred();
    const written = deferred();
    const finalized = deferred();
    native.flush.mockReturnValue(flushed.promise);
    mockPacketAdd.mockReturnValue(written.promise);
    mockMuxFinalize.mockReturnValue(finalized.promise);
    const chunk = {timestamp: 0};
    const metadata = {decoderConfig: {codec: 'vp09.00.51.08'}};
    let finished = false;
    const saving = encoder.save().then(blob => {
      finished = true;
      return blob;
    });
    await settle();
    expect(native.flush).toHaveBeenCalledTimes(1);
    native.callbacks.output(chunk, metadata);
    flushed.resolve();
    await settle();
    expect(mockPacketAdd).toHaveBeenCalledWith({chunk}, metadata);
    expect(mockMuxFinalize).not.toHaveBeenCalled();
    written.resolve();
    await settle();
    expect(mockPacketClose).toHaveBeenCalledTimes(1);
    expect(mockMuxFinalize).toHaveBeenCalledTimes(1);
    expect(finished).toBe(false);
    finalized.resolve();
    const blob = await saving;
    expect(blob).toMatchObject({size: 3, type: 'video/webm'});
    expect(native.close).toHaveBeenCalledTimes(1);
  });

  test('tries VP8 when VP9 is unavailable', async () => {
    FakeVideoEncoder.isConfigSupported.mockImplementation(async config => ({
      config,
      supported: config.codec === 'vp8'
    }));
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    expect(mockSources[0].codec).toBe('vp8');
    expect(nativeEncoders[0].configure).toHaveBeenCalledWith(
      expect.objectContaining({codec: 'vp8'})
    );
    expect(mockFallbacks).toHaveLength(0);
    encoder.cancel();
  });

  test.each(['missing API', 'unsupported codecs'])(
    'preserves the original WebM encoder for %s',
    async reason => {
      if (reason === 'missing API')
        Object.defineProperty(globalThis, 'VideoEncoder', {value: undefined});
      else FakeVideoEncoder.isConfigSupported.mockResolvedValue({supported: false});
      const onFallback = jest.fn();
      const settings = {framerate: 24, webm: {quality: 0.8}};
      const encoder = new NativeWebMEncoder(settings, {onFallback});
      encoder.start();
      await encoder.add(canvas);
      const fallback = mockFallbacks[0];
      expect(fallback.settings).toEqual(settings);
      expect(fallback.encoder.start).toHaveBeenCalledTimes(1);
      expect(fallback.encoder.add).toHaveBeenCalledWith(canvas);
      expect(await encoder.save()).toBe(await fallback.encoder.save.mock.results[0].value);
      expect(onFallback).toHaveBeenCalledTimes(1);
      expect(nativeEncoders).toHaveLength(0);
    }
  );

  test('cancellation waits for an in-flight fallback frame without resuming capture', async () => {
    Object.defineProperty(globalThis, 'VideoEncoder', {value: undefined});
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const added = deferred();
    mockFallbacks[0].encoder.add.mockReturnValue(added.promise);
    const pending = encoder.add(canvas);
    await settle();
    encoder.cancel();
    added.resolve();
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
  });

  test('discards fallback output when cancelled during save', async () => {
    Object.defineProperty(globalThis, 'VideoEncoder', {value: undefined});
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const saved = deferred<Blob>();
    mockFallbacks[0].encoder.save.mockReturnValue(saved.promise);
    const saving = encoder.save();
    await settle();
    encoder.cancel();
    saved.resolve(new Blob(['cancelled recording']));
    await expect(saving).resolves.toBeNull();
  });

  test('cancels a pending support check without starting an encoder', async () => {
    const support = deferred<any>();
    FakeVideoEncoder.isConfigSupported.mockReturnValue(support.promise);
    const encoder = new NativeWebMEncoder();
    const pending = encoder.add(canvas);
    encoder.cancel();
    support.resolve({supported: true, config: {codec: 'vp09.00.51.08'}});
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
    expect(nativeEncoders).toHaveLength(0);
    expect(mockOutputs).toHaveLength(0);
    expect(await encoder.save()).toBeNull();
  });

  test('cancels while starting the muxer without allocating native frames', async () => {
    const starting = deferred();
    mockMuxStart.mockReturnValue(starting.promise);
    const encoder = new NativeWebMEncoder();
    const pending = encoder.add(canvas);
    await settle();
    expect(mockMuxStart).toHaveBeenCalledTimes(1);
    encoder.cancel();
    starting.resolve();
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
    expect(mockMuxCancel).toHaveBeenCalledTimes(1);
    expect(nativeEncoders).toHaveLength(0);
  });

  test('cancellation releases queue backpressure and closes native resources', async () => {
    const encoder = new NativeWebMEncoder();
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    native.encodeQueueSize = 4;
    const pending = encoder.add(canvas);
    await settle();
    encoder.cancel();
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
    expect(native.close).toHaveBeenCalledTimes(1);
    expect(mockMuxCancel).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(1);
    expect(await encoder.save()).toBeNull();
  });

  test('cancels a pending flush without producing a download or reporting an encoding failure', async () => {
    const onError = jest.fn();
    const encoder = new NativeWebMEncoder({}, {onError});
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    const flush = deferred();
    native.flush.mockReturnValue(flush.promise);
    const saving = encoder.save();
    await settle();
    encoder.cancel();
    flush.reject(new DOMException('Encoder closed', 'AbortError'));
    await expect(saving).resolves.toBeNull();
    expect(onError).not.toHaveBeenCalled();
    expect(mockMuxFinalize).not.toHaveBeenCalled();
  });

  test('does not resume the capture loop after cancellation during a pending packet write', async () => {
    const onError = jest.fn();
    const encoder = new NativeWebMEncoder({}, {onError});
    await encoder.add(canvas);
    const written = deferred();
    mockPacketAdd.mockReturnValue(written.promise);
    const native = nativeEncoders[0];
    native.encode.mockImplementation(() => native.callbacks.output({timestamp: 33333}, {}));
    const pending = encoder.add(canvas);
    await settle();
    expect(mockPacketAdd).toHaveBeenCalledTimes(1);
    encoder.cancel();
    written.resolve();
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
    expect(onError).not.toHaveBeenCalled();
  });

  test.each(['muxer start', 'native configure'])(
    'releases initialized resources when %s fails',
    async phase => {
      const error = new Error(phase + ' failed');
      const onError = jest.fn();
      if (phase === 'muxer start') mockMuxStart.mockRejectedValue(error);
      else configureError = error;
      const encoder = new NativeWebMEncoder({}, {onError});
      await expect(encoder.add(canvas)).rejects.toThrow(error);
      expect(mockMuxCancel).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
      expect(frames).toHaveLength(0);
      if (phase === 'native configure') expect(nativeEncoders[0].close).toHaveBeenCalledTimes(1);
      expect(await encoder.save()).toBeNull();
    }
  );

  test('closes the raw frame and reports a synchronous native encode failure', async () => {
    const onError = jest.fn();
    const encoder = new NativeWebMEncoder({}, {onError});
    await encoder.add(canvas);
    const error = new Error('encode failed');
    nativeEncoders[0].encode.mockImplementation(() => {
      throw error;
    });
    await expect(encoder.add(canvas)).rejects.toThrow(error);
    expect(frames[1].close).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(error);
    encoder.cancel();
  });

  test('propagates asynchronous encoder errors and wakes blocked captures', async () => {
    const onError = jest.fn();
    const encoder = new NativeWebMEncoder({}, {onError});
    await encoder.add(canvas);
    const native = nativeEncoders[0];
    native.encodeQueueSize = 4;
    const pending = encoder.add(canvas);
    await settle();
    const error = new Error('codec failed');
    native.callbacks.error(error);
    await expect(pending).rejects.toThrow(error);
    expect(onError).toHaveBeenCalledWith(error);
    expect(frames).toHaveLength(1);
    encoder.cancel();
  });

  test('propagates muxer write failures instead of finalizing an incomplete recording', async () => {
    const onError = jest.fn();
    const encoder = new NativeWebMEncoder({}, {onError});
    await encoder.add(canvas);
    const error = new Error('mux write failed');
    mockPacketAdd.mockRejectedValue(error);
    nativeEncoders[0].callbacks.output({timestamp: 0}, {});
    await settle();
    await expect(encoder.save()).rejects.toThrow(error);
    expect(onError).toHaveBeenCalledWith(error);
    expect(mockMuxFinalize).not.toHaveBeenCalled();
    expect(nativeEncoders[0].close).toHaveBeenCalledTimes(1);
  });

  test('saving without any frames produces no empty file', async () => {
    const encoder = new NativeWebMEncoder();
    encoder.start();
    expect(await encoder.save()).toBeNull();
    expect(mockOutputs).toHaveLength(0);
  });
});
