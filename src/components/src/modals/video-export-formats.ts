// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const NATIVE_WEBM_FORMAT = {
  value: 'webm-native',
  label: 'WebM Video (experimental native)'
};

export const VIDEO_ENCODING_ERROR =
  'Video encoding failed. Try the original WebM Video format or a lower resolution.';

export const NATIVE_WEBM_FALLBACK =
  'The experimental encoder is unavailable in this browser. Using the original WebM Video format.';

/** Probe the actual export size; API presence alone does not imply codec support. */
export async function getNativeWebMConfig(width: number, height: number, framerate = 30) {
  let codec: 'vp9' | 'vp8' | undefined;
  let config: VideoEncoderConfig | undefined;
  if (typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined') {
    for (const candidate of [
      {name: 'vp9' as const, codec: 'vp09.00.51.08'},
      {name: 'vp8' as const, codec: 'vp8'}
    ]) {
      const requested: VideoEncoderConfig = {
        codec: candidate.codec,
        width,
        height,
        bitrate: Math.round(
          Math.min(20000000, Math.max(2000000, width * height * framerate * 0.15))
        ),
        framerate,
        bitrateMode: 'variable',
        latencyMode: 'quality'
      };
      try {
        const support = await VideoEncoder.isConfigSupported(requested);
        if (support.supported) {
          codec = candidate.name;
          config = support.config;
          break;
        }
      } catch {
        // The next codec, or the original encoder, may still be available.
      }
    }
  }
  return codec && config ? {codec, config} : undefined;
}
