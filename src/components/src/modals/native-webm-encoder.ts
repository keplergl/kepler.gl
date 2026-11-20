// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getNativeWebMConfig} from './video-export-formats';
import type {FrameEncoder} from '@hubble.gl/core';
import type {BufferTarget, EncodedVideoPacketSource, Output} from 'mediabunny';

type Settings = {framerate?: number; webm?: {quality: number}};
type Hooks = {onFallback?: () => void; onError?: (error: unknown) => void};

/** Experimental inter-frame WebM encoder. Capture remains offline and frame based. */
export class NativeWebMEncoder {
  extension = '.webm';
  mimeType = 'video/webm';
  framerate: number;
  private settings: Settings;
  private encoder?: VideoEncoder;
  private fallback?: FrameEncoder;
  private output?: Output;
  private target?: BufferTarget;
  private packetSource?: EncodedVideoPacketSource;
  private initializing?: Promise<void>;
  private adding?: Promise<void>;
  private writes: Promise<void> = Promise.resolve();
  private frameIndex = 0;
  private cancelled = false;
  private failure?: Error;
  private wakeQueue?: () => void;

  constructor(settings: Settings = {}, private hooks: Hooks = {}) {
    this.settings = settings;
    this.framerate = settings.framerate || 30;
  }

  start() {
    // Hubble does not await start(). Initialization belongs to the first add().
  }

  private async initialize(canvas: HTMLCanvasElement) {
    const supported = await getNativeWebMConfig(canvas.width, canvas.height, this.framerate);
    const {codec, config} = supported || {};
    if (this.cancelled) return;
    if (!codec || !config) {
      const {WebMEncoder} = await import('@hubble.gl/core');
      if (this.cancelled) return;
      this.fallback = new WebMEncoder(this.settings);
      this.fallback.start();
      this.hooks.onFallback?.();
      return;
    }

    const {BufferTarget, Output, WebMOutputFormat, EncodedVideoPacketSource, EncodedPacket} =
      await import('./native-webm-muxer');
    if (this.cancelled) return;
    this.target = new BufferTarget();
    this.output = new Output({format: new WebMOutputFormat(), target: this.target});
    const source = new EncodedVideoPacketSource(codec);
    this.packetSource = source;
    this.output.addVideoTrack(source, {frameRate: this.framerate});
    await this.output.start();
    if (this.cancelled) return;
    this.encoder = new VideoEncoder({
      output: (chunk, metadata) => {
        if (this.cancelled) return;
        const packet = EncodedPacket.fromEncodedChunk(chunk);
        this.writes = this.writes
          .then(() => (this.cancelled ? undefined : source.add(packet, metadata)))
          .catch(error => this.fail(error));
      },
      error: error => this.fail(error)
    });
    this.encoder.configure(config);
  }

  private fail(error: unknown) {
    this.failure = error instanceof Error ? error : new Error(String(error));
    this.wakeQueue?.();
  }

  private checkFailure() {
    if (this.failure) throw this.failure;
  }

  async add(canvas: HTMLCanvasElement) {
    const adding = this.addFrame(canvas);
    this.adding = adding;
    try {
      await adding;
    } catch (error) {
      if (!this.cancelled) {
        this.cancel();
        this.hooks.onError?.(error);
      }
      throw error;
    } finally {
      if (this.adding === adding) this.adding = undefined;
    }
  }

  private async addFrame(canvas: HTMLCanvasElement) {
    this.checkCancelled();
    this.initializing ||= this.initialize(canvas);
    await this.initializing;
    this.checkCancelled();
    this.checkFailure();
    if (this.fallback) {
      await this.fallback.add(canvas);
      this.checkCancelled();
      return;
    }
    const encoder = this.encoder!;
    // Bound pending raw frames without flushing between frames (which would
    // prevent the encoder from efficiently using temporal compression).
    if (encoder.encodeQueueSize >= 4) {
      await new Promise<void>(resolve => {
        const check = () => {
          if (encoder.encodeQueueSize < 4 || this.failure || this.cancelled) {
            encoder.removeEventListener('dequeue', check);
            this.wakeQueue = undefined;
            resolve();
          }
        };
        this.wakeQueue = check;
        encoder.addEventListener('dequeue', check);
        check();
      });
    }
    this.checkCancelled();
    this.checkFailure();
    const timestamp = Math.round((this.frameIndex * 1000000) / this.framerate);
    const duration = Math.round(((this.frameIndex + 1) * 1000000) / this.framerate) - timestamp;
    const frame = new VideoFrame(canvas, {timestamp, duration});
    try {
      encoder.encode(frame, {keyFrame: this.frameIndex % Math.round(this.framerate * 2) === 0});
      this.frameIndex++;
    } finally {
      frame.close();
    }
    await this.writes;
    this.checkCancelled();
    this.checkFailure();
  }

  async save(): Promise<Blob | null> {
    if (this.cancelled || !this.initializing) return null;
    try {
      await this.initializing;
      // Stop can request save while capture is still awaiting backpressure.
      // Include that in-flight frame before flushing the encoder.
      await this.adding;
      if (this.cancelled) return null;
      if (this.fallback) {
        const blob = await this.fallback.save();
        return this.cancelled ? null : blob;
      }
      this.checkFailure();
      await this.encoder!.flush();
      await this.writes;
      if (this.cancelled) return null;
      this.checkFailure();
      this.packetSource!.close();
      await this.output!.finalize();
      return this.cancelled ? null : new Blob([this.target!.buffer!], {type: this.mimeType});
    } catch (error) {
      if (this.cancelled) return null;
      if (!this.cancelled) {
        this.cancel();
        this.hooks.onError?.(error);
      }
      throw error;
    } finally {
      this.closeEncoder();
    }
  }

  private closeEncoder() {
    if (this.encoder && this.encoder.state !== 'closed') this.encoder.close();
  }

  private checkCancelled() {
    if (this.cancelled) throw new DOMException('Video recording was cancelled', 'AbortError');
  }

  cancel() {
    this.cancelled = true;
    this.wakeQueue?.();
    this.closeEncoder();
    void this.output?.cancel().catch(() => undefined);
    this.fallback = undefined;
  }
}

export function createNativeWebMEncoder(
  hooks: Hooks
): new (settings: Settings) => NativeWebMEncoder {
  return class extends NativeWebMEncoder {
    constructor(settings: Settings) {
      super(settings, hooks);
    }
  };
}
