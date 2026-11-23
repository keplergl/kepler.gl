// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RESOLUTIONS} from './hubble-utils';
import {getNativeWebMConfig} from './video-export-formats';

export type ProgrammaticVideoExport = {
  signal: AbortSignal;
  onProgress: (progress: number, phase?: 'rendering' | 'encoding') => void;
  onComplete: (blob: Blob) => void;
  onError: (error: Error) => void;
};

/** Probe the browser encoder at the dimensions that will actually be recorded. */
export async function getNativeVideoExportCapabilities(width = 1920, height = 1080) {
  const native = await getNativeWebMConfig(width, height, 30);
  let webm = false;
  try {
    webm = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    // The original encoder depends on the browser's WebP canvas serializer.
  }
  const formats: ('webm' | 'webm-native')[] = [];
  if (webm) formats.push('webm');
  if (native) formats.push('webm-native');
  return {
    available: formats.length > 0,
    ...(formats.length ? {} : {reason: 'This browser has no supported WebM video encoder.'}),
    formats,
    dimensions: RESOLUTIONS.map(({width: w, height: h}) => ({width: w, height: h})),
    frameRates: [30],
    probedSize: {width, height},
    ...(native ? {nativeCodec: native.codec} : {})
  };
}

/** Hubble includes the end timestamp; automation records [0, duration) instead. */
export function programmaticTimecode<T extends {end: number}>(
  timecode: T,
  request?: ProgrammaticVideoExport
): T {
  return request ? {...timecode, end: timecode.end - 0.000001} : timecode;
}

/** Hubble catches encoder promises internally, so surface their errors explicitly. */
export function withVideoExportErrors<T extends new (...args: any[]) => any>(
  Encoder: T,
  request?: ProgrammaticVideoExport
): T {
  if (!request) return Encoder;
  return class extends Encoder {
    async add(canvas: HTMLCanvasElement) {
      try {
        return await super.add(canvas);
      } catch (error) {
        if (!request.signal.aborted) {
          request.onError(videoExportError(error));
        }
        throw error;
      }
    }
    async save() {
      try {
        return await super.save();
      } catch (error) {
        if (!request.signal.aborted) {
          request.onError(videoExportError(error));
        }
        throw error;
      }
    }
  };
}

function videoExportError(error: unknown): Error {
  return new Error(
    `Video export failed: ${error instanceof Error ? error.message : String(error)}. ` +
      'Check the map data and basemap access, or retry with a lower resolution or WebM format.'
  );
}

/** Drive the same mounted renderer as the export UI, without clicking its controls. */
export function renderNativeVideo(panel: any, request: ProgrammaticVideoExport): () => void {
  let stopped = false;
  let lastProgress = -1;
  let lastPhase = '';
  let lastActivity = Date.now();
  const stop = () => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    request.signal.removeEventListener('abort', stop);
    panel.onStop?.({abort: true});
  };
  const timer = setInterval(() => {
    const state = panel.state;
    if (request.signal.aborted) {
      stop();
      return;
    }
    const time = state.currentTimeMs ?? state.adapter?.videoCapture?.timeMs ?? 0;
    const phase = state.saving ? 'encoding' : 'rendering';
    const progress = Math.min(0.99, Math.max(0, time / state.durationMs));
    if (progress !== lastProgress || phase !== lastPhase) {
      lastProgress = progress;
      lastPhase = phase;
      lastActivity = Date.now();
      request.onProgress(progress, phase);
    }
    if (state.encodingError || Date.now() - lastActivity > 120000) {
      stop();
      request.onError(
        new Error(
          state.encodingError ||
            'Video export stopped making progress. Check basemap access and data loading, then retry with a lower resolution.'
        )
      );
    }
  }, 250);
  request.signal.addEventListener('abort', stop, {once: true});
  if (request.signal.aborted) {
    stop();
  } else {
    try {
      request.onProgress(0, 'rendering');
      panel.onRenderVideo();
    } catch (error) {
      stop();
      request.onError(videoExportError(error));
    }
  }
  return stop;
}
