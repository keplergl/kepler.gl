// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

type GL = {
  drawingBufferWidth: number;
  drawingBufferHeight: number;
  DEPTH_RANGE?: number;
  depthRange?(zNear: number, zFar: number): void;
  getParameter?(pname: number): Float32Array | number[] | null;
};

type CanvasContextLike = {
  getDrawingBufferSize(): [number, number];
  cssToDeviceRatio(): number;
};

type ShadowPassLike = {
  device?: {
    gl?: GL;
    canvasContext?: CanvasContextLike;
  };
  render(params: Record<string, unknown>): unknown;
};

const GL_DEPTH_RANGE = 0x0b70;

function overrideMethod<K extends keyof CanvasContextLike>(
  object: CanvasContextLike,
  key: K,
  impl: CanvasContextLike[K]
): () => void {
  const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
  const previous = object[key];
  object[key] = impl;
  return () => {
    if (hadOwn) {
      object[key] = previous;
    } else {
      delete object[key];
    }
  };
}

/**
 * In interleaved video export, MapLibre owns the canvas (export-scale bitmap)
 * while luma's cssToDeviceRatio() still tracks a smaller buffer. ShadowPass
 * then sizes its FBO to `viewport * ratio` and LayersPass begins the pass with
 * `getDrawingBufferSize()`. When those disagree, the shadow scene is
 * rasterized into a corner of the FBO; the rest stays uncleared (depth 0) and
 * samples as fully shadowed — which is why shadows only look right in the
 * top-left of the preview.
 *
 * Overrides apply only for the shadow pass and are removed afterward so the
 * color pass and MapLibre keep the same view.
 */
export function patchShadowPassToDrawingBuffer(
  shadowPass: ShadowPassLike,
  isExportMode: () => boolean
): void {
  if ((shadowPass as {__keplerShadowBufferPatched?: boolean}).__keplerShadowBufferPatched) {
    return;
  }
  (shadowPass as {__keplerShadowBufferPatched?: boolean}).__keplerShadowBufferPatched = true;

  const originalRender = shadowPass.render.bind(shadowPass);

  shadowPass.render = function renderToDrawingBuffer(params: Record<string, unknown>) {
    if (!isExportMode()) {
      return originalRender(params);
    }

    const gl = shadowPass.device?.gl;
    const canvasContext = shadowPass.device?.canvasContext;
    const viewport = (params?.viewports as {width?: number}[] | undefined)?.[0];

    if (!gl || !canvasContext || !viewport) {
      return originalRender(params);
    }

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    if (!(width > 0 && height > 0)) {
      return originalRender(params);
    }

    const restoreDepthRange = beginExportShadowDepthRange(gl);
    const pixelRatio = viewport.width && viewport.width > 0 ? width / viewport.width : 1;
    const restoreSize = overrideMethod(canvasContext, 'getDrawingBufferSize', () => [
      width,
      height
    ]);
    const restoreRatio = overrideMethod(canvasContext, 'cssToDeviceRatio', () => pixelRatio);

    try {
      return originalRender(params);
    } finally {
      restoreRatio();
      restoreSize();
      restoreDepthRange();
    }
  };
}

function beginExportShadowDepthRange(gl: GL): () => void {
  const depthRangeName = gl.DEPTH_RANGE ?? GL_DEPTH_RANGE;
  const previous = gl.getParameter?.(depthRangeName);
  gl.depthRange?.(0, 1);
  return () => {
    if (previous && previous.length >= 2) {
      gl.depthRange?.(previous[0], previous[1]);
    }
  };
}
