// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createVideoExportService, VIDEO_EXPORT_CHUNK_BYTES} from './video-export';
import type {
  VideoExportCapabilities,
  VideoExportRenderer,
  VideoExportSettings
} from './video-export';

const settings: VideoExportSettings = {
  width: 1920,
  height: 1080,
  durationMs: 20000,
  frameRate: 30,
  format: 'webm'
};
const capabilities: VideoExportCapabilities = {
  available: true,
  formats: ['webm'],
  dimensions: [{width: 1920, height: 1080}],
  frameRates: [30]
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return {promise, resolve, reject};
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};
let id = 0;
beforeEach(() => {
  Object.defineProperty(crypto, 'randomUUID', {configurable: true, value: () => `export-${++id}`});
});

test('returns a job before render finishes, reports progress and transfers the finalized artifact', async () => {
  const completion = deferred<Blob>();
  let hooks!: Parameters<VideoExportRenderer>[1];
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: jest.fn((_settings, callbacks) => {
      hooks = callbacks;
      return completion.promise;
    })
  });
  const started = await service.start(settings);
  expect(started.status).toBe('queued');
  expect(started.settings).toEqual({...settings, cameraAnimation: true, dataAnimation: true});
  expect(service.status(started.jobId).status).toBe('rendering');
  hooks.onProgress(0.4);
  expect(service.status(started.jobId).progress).toBe(0.4);
  hooks.onProgress(0.9, 'encoding');
  expect(service.status(started.jobId)).toMatchObject({status: 'encoding', progress: 0.9});
  completion.resolve(new Blob(['encoded frames'], {type: 'video/webm'}));
  await flush();
  expect(service.status(started.jobId)).toMatchObject({
    status: 'succeeded',
    progress: 1,
    artifact: {jobId: started.jobId, mimeType: 'video/webm', size: 14}
  });
  expect(await service.read(started.jobId)).toMatchObject({
    base64: btoa('encoded frames'),
    offset: 0,
    nextOffset: 14,
    totalBytes: 14,
    mimeType: 'video/webm'
  });
  service.dispose();
});

test('cancellation aborts rendering and ignores late completion and progress', async () => {
  const completion = deferred<Blob>();
  let hooks!: Parameters<VideoExportRenderer>[1];
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: (_settings, callbacks) => {
      hooks = callbacks;
      return completion.promise;
    }
  });
  const job = await service.start(settings);
  expect(service.cancel(job.jobId).status).toBe('cancelled');
  expect(hooks.signal.aborted).toBe(true);
  hooks.onProgress(1, 'encoding');
  completion.resolve(new Blob(['partial']));
  await flush();
  expect(service.status(job.jobId)).toMatchObject({status: 'cancelled', progress: 0});
  expect(service.status(job.jobId).artifact).toBeUndefined();
  await expect(service.read(job.jobId)).rejects.toThrow(/not ready/);
  service.dispose();
});

test('reports actionable renderer errors and rejects concurrent work', async () => {
  const completion = deferred<Blob>();
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: () => completion.promise
  });
  const job = await service.start(settings);
  await expect(service.start(settings)).rejects.toThrow(/already running/);
  completion.reject(new Error('The basemap could not load. Check its connection and retry.'));
  await flush();
  expect(service.status(job.jobId)).toMatchObject({
    status: 'failed',
    error: expect.stringMatching(/basemap could not load/)
  });
  expect(() => service.status('unknown')).toThrow(/not found or has expired/);
  service.dispose();
});

test.each([
  [{...settings, width: 0}, /positive integer/],
  [{...settings, height: NaN}, /positive integer/],
  [{...settings, durationMs: Infinity}, /finite positive/],
  [{...settings, durationMs: 0}, /finite positive/],
  [{...settings, frameRate: 60}, /30 frames/],
  [{...settings, format: 'mp4'}, /Unsupported video format/],
  [{...settings, dataAnimation: 'yes'}, /dataAnimation must/],
  [{...settings, width: 960}, /dimensions are unsupported/],
  [{...settings, format: 'webm-native'}, /unavailable at these dimensions/],
  [{...settings, durationMs: 600001}, /duration exceeds/]
])(
  'rejects invalid or unsupported settings without invoking the renderer (%j)',
  async (input, error) => {
    const render = jest.fn();
    const service = createVideoExportService({getCapabilities: async () => capabilities, render});
    await expect(service.start(input as VideoExportSettings)).rejects.toThrow(error as RegExp);
    expect(render).not.toHaveBeenCalled();
    service.dispose();
  }
);

test('rejects unavailable renderer with its recovery advice', async () => {
  const service = createVideoExportService({
    getCapabilities: async () => ({
      ...capabilities,
      available: false,
      reason: 'Enable video export in the host.'
    }),
    render: jest.fn()
  });
  await expect(service.start(settings)).rejects.toThrow('Enable video export in the host.');
  service.dispose();
});

test('rejects empty and oversized results instead of publishing unusable artifacts', async () => {
  const render = jest
    .fn()
    .mockResolvedValueOnce(new Blob())
    .mockResolvedValueOnce(new Blob(['large']));
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render,
    maxArtifactBytes: 4
  });
  const empty = await service.start(settings);
  await flush();
  expect(service.status(empty.jobId)).toMatchObject({
    status: 'failed',
    error: expect.stringMatching(/empty video/)
  });
  const large = await service.start(settings);
  await flush();
  expect(service.status(large.jobId)).toMatchObject({
    status: 'failed',
    error: expect.stringMatching(/artifact limit/)
  });
  service.dispose();
});

test('bounds chunks, validates offsets, and drops old artifacts to enforce total retained bytes', async () => {
  const size = VIDEO_EXPORT_CHUNK_BYTES + 10;
  const bytes = new Uint8Array(size).fill(7);
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: async () => new Blob([bytes]),
    maxArtifactBytes: size
  });
  const first = await service.start(settings);
  await flush();
  const chunk = await service.read(first.jobId);
  expect(chunk.nextOffset).toBe(VIDEO_EXPORT_CHUNK_BYTES);
  expect(atob(chunk.base64)).toHaveLength(VIDEO_EXPORT_CHUNK_BYTES);
  const last = await service.read(first.jobId, chunk.nextOffset);
  expect(last.nextOffset).toBe(size);
  expect(atob(last.base64)).toHaveLength(10);
  await expect(service.read(first.jobId, size)).rejects.toThrow(/offset/);
  await expect(service.read(first.jobId, -1)).rejects.toThrow(/offset/);
  await service.start(settings);
  await flush();
  expect(() => service.status(first.jobId)).toThrow(/expired/);
  service.dispose();
});

test('bounds job history and revokes URLs when evicting or disposing artifacts', async () => {
  const createObjectURL = jest.fn(() => 'blob:finished-video');
  const revokeObjectURL = jest.fn();
  Object.defineProperty(URL, 'createObjectURL', {configurable: true, value: createObjectURL});
  Object.defineProperty(URL, 'revokeObjectURL', {configurable: true, value: revokeObjectURL});
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: async () => new Blob(['video']),
    maxJobs: 1
  });
  const first = await service.start(settings);
  await flush();
  await service.start(settings);
  await flush();
  expect(() => service.status(first.jobId)).toThrow(/expired/);
  expect(revokeObjectURL).toHaveBeenCalledTimes(1);
  service.dispose();
  expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  await expect(service.start(settings)).rejects.toThrow(/disconnected/);
  delete (URL as any).createObjectURL;
  delete (URL as any).revokeObjectURL;
});

test('disconnect cancels a pending start and the service can be used after reconnecting', async () => {
  const probe = deferred<VideoExportCapabilities>();
  const render = jest.fn(async () => new Blob(['video']));
  const getCapabilities = jest
    .fn()
    .mockImplementationOnce(() => probe.promise)
    .mockResolvedValue(capabilities);
  const service = createVideoExportService({getCapabilities, render});
  const starting = service.start(settings);
  await expect(service.start(settings)).rejects.toThrow(/already running/);
  service.cancelActive();
  probe.resolve(capabilities);
  await expect(starting).rejects.toThrow(/cancelled before rendering/);
  expect(render).not.toHaveBeenCalled();
  const job = await service.start(settings);
  await flush();
  expect(service.status(job.jobId).status).toBe('succeeded');
  service.dispose();
});

test('disconnect aborts the active renderer but retains the cancelled job for status', async () => {
  const completion = deferred<Blob>();
  let signal!: AbortSignal;
  const service = createVideoExportService({
    getCapabilities: async () => capabilities,
    render: (_settings, hooks) => {
      signal = hooks.signal;
      return completion.promise;
    }
  });
  const job = await service.start(settings);
  service.cancelActive();
  expect(signal.aborted).toBe(true);
  expect(service.status(job.jobId).status).toBe('cancelled');
  completion.resolve(new Blob(['late video']));
  await flush();
  expect(service.status(job.jobId).artifact).toBeUndefined();
  service.dispose();
});
