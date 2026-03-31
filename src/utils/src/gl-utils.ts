// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';
import {
  LAYER_BLENDINGS,
  GL_BLEND_FUNC_TO_WEBGPU,
  GL_BLEND_EQ_TO_WEBGPU,
  BLEND_OPERATION,
  BLEND_FACTOR,
  FILTER_MODE,
  DEPTH_STENCIL_FORMAT
} from '@kepler.gl/constants';
import {DeckRenderer} from '@deck.gl/core';

/**
 * Convert layer blending config to deck.gl 9.x parameters format.
 * In deck.gl 9.x, blending is set via `parameters` prop using WebGPU-style string constants
 * instead of calling setParameters with GL constants.
 */
export function getLayerBlendingParameters(layerBlending: string): Record<string, any> {
  const blending = LAYER_BLENDINGS[layerBlending];
  if (!blending) return {};
  const {blendFunc, blendEquation} = blending;
  if (!blendFunc) return {};

  const params: Record<string, any> = {
    blend: true
  };

  if (blendFunc.length >= 2) {
    if (!GL_BLEND_FUNC_TO_WEBGPU[blendFunc[0]])
      Console.warn(`Unmapped blend function: ${blendFunc[0]}, falling back to 'one'`);
    if (!GL_BLEND_FUNC_TO_WEBGPU[blendFunc[1]])
      Console.warn(`Unmapped blend function: ${blendFunc[1]}, falling back to 'zero'`);
    params.blendColorSrcFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[0]] || BLEND_FACTOR.ONE;
    params.blendColorDstFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[1]] || BLEND_FACTOR.ZERO;
  }
  if (blendFunc.length >= 4) {
    if (!GL_BLEND_FUNC_TO_WEBGPU[blendFunc[2]])
      Console.warn(`Unmapped blend function: ${blendFunc[2]}, falling back to 'one'`);
    if (!GL_BLEND_FUNC_TO_WEBGPU[blendFunc[3]])
      Console.warn(`Unmapped blend function: ${blendFunc[3]}, falling back to 'zero'`);
    params.blendAlphaSrcFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[2]] || BLEND_FACTOR.ONE;
    params.blendAlphaDstFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[3]] || BLEND_FACTOR.ZERO;
  } else {
    params.blendAlphaSrcFactor = params.blendColorSrcFactor;
    params.blendAlphaDstFactor = params.blendColorDstFactor;
  }

  if (Array.isArray(blendEquation)) {
    params.blendColorOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation[0]] || BLEND_OPERATION.ADD;
    params.blendAlphaOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation[1]] || BLEND_OPERATION.ADD;
  } else if (blendEquation) {
    params.blendColorOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation] || BLEND_OPERATION.ADD;
    params.blendAlphaOperation = params.blendColorOperation;
  }

  return params;
}

/**
 * Patch DeckRenderer to include depth-stencil attachments on post-processing
 * framebuffers. In deck.gl 9, _resizeRenderBuffers creates FBOs with only color
 * attachments, which breaks depth testing when post-processing effects are active.
 * This was not an issue in deck.gl 8 where Framebuffer() auto-created a depth buffer.
 */
let _deckRendererPatched = false;
export function patchDeckRendererForPostProcessing(): void {
  if (_deckRendererPatched) return;
  _deckRendererPatched = true;

  const proto = DeckRenderer.prototype as any;
  const original =
    typeof proto._resizeRenderBuffers === 'function' ? proto._resizeRenderBuffers : null;

  proto._resizeRenderBuffers = function _resizeRenderBufferPatched() {
    if (!this.device?.canvasContext) {
      return original?.call(this);
    }

    const {renderBuffers} = this;
    const size = this.device.canvasContext.getDrawingBufferSize();
    const [width, height] = size;
    if (renderBuffers.length === 0) {
      [0, 1].map((i: number) => {
        const texture = this.device.createTexture({
          sampler: {minFilter: FILTER_MODE.LINEAR, magFilter: FILTER_MODE.LINEAR},
          width,
          height
        });
        renderBuffers.push(
          this.device.createFramebuffer({
            id: `deck-renderbuffer-${i}`,
            colorAttachments: [texture],
            depthStencilAttachment: DEPTH_STENCIL_FORMAT.DEPTH24_PLUS
          })
        );
      });
    }
    for (const buffer of renderBuffers) {
      buffer.resize(size);
    }
  };
}
