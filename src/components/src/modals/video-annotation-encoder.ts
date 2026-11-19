// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {FrameEncoder} from '@hubble.gl/core';
import type {Annotation, InteractionConfig, MapState} from '@kepler.gl/types';

export type VideoAnnotationFrame = {
  annotations: Annotation[];
  interactionConfig?: InteractionConfig;
  mapState: MapState & {zoomOffset?: number};
  width: number;
  height: number;
  /** Undefined for a single map; otherwise clip each map's annotations at this percentage. */
  swipePercentage?: number;
};

/** Keep composition inside add(), so every encoder waits before advancing its clock. */
export function createAnnotationVideoEncoder(
  Encoder: typeof FrameEncoder,
  getFrame: () => VideoAnnotationFrame,
  isActive: (encoder: FrameEncoder) => boolean,
  onError: (error: unknown) => void
): typeof FrameEncoder {
  return class AnnotationVideoEncoder extends Encoder {
    annotationCanvas: HTMLCanvasElement | null = null;
    annotationCapture: AbortController | null = null;

    cancelAnnotationCapture() {
      this.annotationCapture?.abort();
    }

    cancel() {
      this.cancelAnnotationCapture();
      (Encoder.prototype as FrameEncoder & {cancel?: () => void}).cancel?.call(this);
    }

    async add(canvas: HTMLCanvasElement) {
      const frame = getFrame();
      if (
        !frame.annotations?.some(
          annotation =>
            annotation.isVisible &&
            ((annotation.mapIndex ?? 0) === 0 ||
              (frame.swipePercentage !== undefined && annotation.mapIndex === 1))
        )
      ) {
        return super.add(canvas);
      }

      // Both the mutable source canvas and camera must be frozen before the
      // asynchronous DOM rasterization starts. Redux annotation objects are immutable.
      const snapshot = {...frame, mapState: {...frame.mapState}};
      const output = this.annotationCanvas || document.createElement('canvas');
      this.annotationCanvas = output;
      output.width = canvas.width;
      output.height = canvas.height;
      const capture = new AbortController();
      this.annotationCapture = capture;
      try {
        const context = output.getContext('2d');
        if (!context) throw new Error('Annotation export requires a 2D canvas');
        context.drawImage(canvas, 0, 0);
        const {compositeVideoAnnotations} = await import('./video-annotation-overlay');
        if (!isActive(this)) throw new DOMException('Video export stopped', 'AbortError');
        await compositeVideoAnnotations(output, snapshot, capture.signal);
        if (!isActive(this)) throw new DOMException('Video export stopped', 'AbortError');
        return await super.add(output);
      } catch (error) {
        if (isActive(this)) onError(error);
        throw error;
      } finally {
        this.annotationCapture = null;
      }
    }
  };
}
