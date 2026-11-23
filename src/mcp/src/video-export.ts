// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** Browser-safe asynchronous access to the host's native video renderer. */
export type VideoExportFormat = 'webm' | 'webm-native';

export type VideoExportSettings = {
  width: number;
  height: number;
  durationMs: number;
  frameRate: 30;
  format: VideoExportFormat;
  /** Use the project's authored camera tour. Defaults to true. */
  cameraAnimation?: boolean;
  /** Use the project's time filters and animated layers. Defaults to true. */
  dataAnimation?: boolean;
};

export type VideoExportCapabilities = {
  available: boolean;
  reason?: string;
  formats: VideoExportFormat[];
  dimensions: Array<{width: number; height: number}>;
  frameRates: number[];
  maxDurationMs?: number;
  /** A native codec probe applies to these dimensions. */
  probedSize?: {width: number; height: number};
};

export type VideoExportJob = {
  jobId: string;
  status: 'queued' | 'rendering' | 'encoding' | 'succeeded' | 'failed' | 'cancelled';
  progress: number;
  settings: VideoExportSettings;
  error?: string;
  artifact?: {
    jobId: string;
    fileName: string;
    mimeType: string;
    size: number;
    /** Browser-local download; an MCP bridge transfers the bytes using read(). */
    url?: string;
  };
};

export type VideoExportChunk = {
  base64: string;
  offset: number;
  nextOffset: number;
  totalBytes: number;
  mimeType: string;
  fileName: string;
};

export type VideoExportProvider = {
  getCapabilities: (size?: {width: number; height: number}) => Promise<VideoExportCapabilities>;
  start: (settings: VideoExportSettings) => Promise<VideoExportJob>;
  status: (jobId: string) => VideoExportJob;
  cancel: (jobId: string) => VideoExportJob;
  read: (jobId: string, offset?: number) => Promise<VideoExportChunk>;
  /** Cancel work owned by a disconnected client, retaining completed files. */
  cancelActive: () => void;
  dispose: () => void;
};

export type VideoExportRenderer = (
  settings: VideoExportSettings,
  hooks: {
    signal: AbortSignal;
    onProgress: (progress: number, phase?: 'rendering' | 'encoding') => void;
  }
) => Promise<Blob>;

export const VIDEO_EXPORT_CHUNK_BYTES = 256 * 1024;
const DEFAULT_MAX_ARTIFACT_BYTES = 256 * 1024 * 1024;
const DEFAULT_MAX_DURATION_MS = 10 * 60 * 1000;

type StoredJob = {
  value: VideoExportJob;
  controller: AbortController;
  blob?: Blob;
};

function validateSettings(settings: VideoExportSettings): void {
  if (!settings || typeof settings !== 'object') {
    throw new Error('Provide video settings with width, height, durationMs, frameRate and format.');
  }
  if (
    !Number.isInteger(settings.width) ||
    settings.width <= 0 ||
    !Number.isInteger(settings.height) ||
    settings.height <= 0
  ) {
    throw new Error('Video width and height must be positive integer dimensions.');
  }
  if (!Number.isFinite(settings.durationMs) || settings.durationMs <= 0) {
    throw new Error('Video durationMs must be a finite positive number.');
  }
  if (settings.frameRate !== 30) {
    throw new Error('The native renderer supports 30 frames per second. Set frameRate to 30.');
  }
  if (settings.format !== 'webm' && settings.format !== 'webm-native') {
    throw new Error('Unsupported video format. Read capabilities and choose a supported format.');
  }
  for (const key of ['cameraAnimation', 'dataAnimation'] as const) {
    if (settings[key] !== undefined && typeof settings[key] !== 'boolean') {
      throw new Error(`${key} must be true or false.`);
    }
  }
}

function readBytes(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Cannot read the finished video. Export it again.'));
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Keep rendering outside tool calls: start returns a job, and status/read remain
 * short even for long recordings. Cancelling a job aborts its renderer and late
 * completion can never publish a partial or cancelled file.
 */
export function createVideoExportService(options: {
  getCapabilities: VideoExportProvider['getCapabilities'];
  render: VideoExportRenderer;
  maxJobs?: number;
  maxArtifactBytes?: number;
}): VideoExportProvider {
  const maxJobs = options.maxJobs ?? 5;
  const maxArtifactBytes = options.maxArtifactBytes ?? DEFAULT_MAX_ARTIFACT_BYTES;
  if (!Number.isInteger(maxJobs) || maxJobs < 1 || maxArtifactBytes < 1) {
    throw new Error('Video export storage limits must be positive.');
  }
  const jobs = new Map<string, StoredJob>();
  let active: StoredJob | undefined;
  let starting = false;
  let disposed = false;
  let generation = 0;

  const assertOpen = () => {
    if (disposed)
      throw new Error('The video renderer was disconnected. Reconnect the map and retry.');
  };
  const get = (jobId: string) => {
    assertOpen();
    const job = jobs.get(jobId);
    if (!job)
      throw new Error(
        `Video export job "${jobId}" was not found or has expired. Start a new export.`
      );
    return job;
  };
  const snapshot = (job: StoredJob): VideoExportJob => ({
    ...job.value,
    settings: {...job.value.settings},
    ...(job.value.artifact ? {artifact: {...job.value.artifact}} : {})
  });
  const release = (job: StoredJob) => {
    if (job.value.artifact?.url) URL.revokeObjectURL(job.value.artifact.url);
    job.blob = undefined;
    jobs.delete(job.value.jobId);
  };
  const getCapabilities: VideoExportProvider['getCapabilities'] = async size => {
    assertOpen();
    const capabilities = await options.getCapabilities(size);
    assertOpen();
    return {...capabilities, maxDurationMs: capabilities.maxDurationMs ?? DEFAULT_MAX_DURATION_MS};
  };
  const cancelActive = () => {
    generation++;
    if (active && ['queued', 'rendering', 'encoding'].includes(active.value.status)) {
      active.value.status = 'cancelled';
      active.controller.abort();
    }
  };
  const run = async (job: StoredJob) => {
    const {signal} = job.controller;
    if (signal.aborted) {
      if (active === job) active = undefined;
      return;
    }
    job.value.status = 'rendering';
    try {
      const blob = await options.render(job.value.settings, {
        signal,
        onProgress: (progress, phase = 'rendering') => {
          if (signal.aborted || !Number.isFinite(progress)) return;
          job.value.status = phase;
          job.value.progress = Math.max(job.value.progress, Math.min(0.99, Math.max(0, progress)));
        }
      });
      if (signal.aborted) return;
      if (!blob || blob.size === 0) {
        throw new Error('The renderer produced an empty video. Check the map and export again.');
      }
      if (blob.size > maxArtifactBytes) {
        throw new Error(
          `The video exceeds the ${Math.floor(
            maxArtifactBytes / 1048576
          )} MiB artifact limit. Reduce its duration or dimensions and retry.`
        );
      }
      // The cap is total retained bytes, not just the size of one recording.
      let retained = [...jobs.values()].reduce((sum, entry) => sum + (entry.blob?.size ?? 0), 0);
      for (const previous of [...jobs.values()]) {
        if (retained + blob.size <= maxArtifactBytes) break;
        if (previous === job || !previous.blob) continue;
        retained -= previous.blob.size;
        release(previous);
      }
      job.blob = blob;
      job.value.artifact = {
        jobId: job.value.jobId,
        fileName: `kepler-${job.value.jobId}.webm`,
        mimeType: 'video/webm',
        size: blob.size,
        ...(typeof URL.createObjectURL === 'function' ? {url: URL.createObjectURL(blob)} : {})
      };
      job.value.progress = 1;
      job.value.status = 'succeeded';
    } catch (error) {
      if (!signal.aborted) {
        job.value.status = 'failed';
        job.value.error = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (active === job) active = undefined;
    }
  };

  return {
    getCapabilities,
    async start(settings) {
      assertOpen();
      validateSettings(settings);
      settings = {...settings};
      if (active || starting) {
        throw new Error(
          'A video export is already running or stopping. Wait for it to finish before starting another.'
        );
      }
      starting = true;
      const startGeneration = generation;
      try {
        const capabilities = await getCapabilities({
          width: settings.width,
          height: settings.height
        });
        if (startGeneration !== generation) {
          throw new Error(
            'The video export was cancelled before rendering started. Reconnect and retry.'
          );
        }
        if (!capabilities.available) {
          throw new Error(
            capabilities.reason ||
              'The connected map has no video renderer. Enable video export and retry.'
          );
        }
        if (!capabilities.formats.includes(settings.format)) {
          throw new Error(
            `Format "${settings.format}" is unavailable at these dimensions. Read capabilities and choose a supported format.`
          );
        }
        if (!capabilities.frameRates.includes(settings.frameRate)) {
          throw new Error(
            'The requested frame rate is unavailable. Read capabilities and choose a supported frame rate.'
          );
        }
        if (
          !capabilities.dimensions.some(
            size => size.width === settings.width && size.height === settings.height
          )
        ) {
          throw new Error(
            'The requested dimensions are unsupported. Read capabilities and choose a supported width and height.'
          );
        }
        if (settings.durationMs > capabilities.maxDurationMs!) {
          throw new Error(
            `Video duration exceeds ${capabilities.maxDurationMs} ms. Choose a shorter duration.`
          );
        }
        const job: StoredJob = {
          value: {
            jobId: crypto.randomUUID(),
            status: 'queued',
            progress: 0,
            settings: {
              ...settings,
              cameraAnimation: settings.cameraAnimation ?? true,
              dataAnimation: settings.dataAnimation ?? true
            }
          },
          controller: new AbortController()
        };
        while (jobs.size >= maxJobs) release(jobs.values().next().value!);
        jobs.set(job.value.jobId, job);
        active = job;
        const result = snapshot(job);
        void Promise.resolve().then(() => run(job));
        return result;
      } finally {
        starting = false;
      }
    },
    status(jobId) {
      return snapshot(get(jobId));
    },
    cancel(jobId) {
      const job = get(jobId);
      if (['queued', 'rendering', 'encoding'].includes(job.value.status)) {
        job.value.status = 'cancelled';
        job.controller.abort();
      }
      return snapshot(job);
    },
    async read(jobId, offset = 0) {
      const job = get(jobId);
      const blob = job.blob;
      if (job.value.status !== 'succeeded' || !blob || !job.value.artifact) {
        throw new Error(
          'The video is not ready. Poll status until the job succeeds before reading its artifact.'
        );
      }
      if (!Number.isInteger(offset) || offset < 0 || offset >= blob.size) {
        throw new Error('Video read offset must be a nonnegative integer smaller than totalBytes.');
      }
      const artifact = job.value.artifact;
      const bytes = new Uint8Array(
        await readBytes(blob.slice(offset, offset + VIDEO_EXPORT_CHUNK_BYTES))
      );
      let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      return {
        base64: btoa(binary),
        offset,
        nextOffset: offset + bytes.length,
        totalBytes: blob.size,
        mimeType: artifact.mimeType,
        fileName: artifact.fileName
      };
    },
    cancelActive,
    dispose() {
      disposed = true;
      cancelActive();
      for (const job of [...jobs.values()]) release(job);
    }
  };
}
