// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LAYER_BLENDINGS} from '@kepler.gl/constants';
import {DeckRenderer} from '@deck.gl/core';

const GL_BLEND_FUNC_TO_WEBGPU: Record<string, string> = {
  SRC_ALPHA: 'src-alpha',
  ONE_MINUS_SRC_ALPHA: 'one-minus-src-alpha',
  DST_ALPHA: 'dst-alpha',
  ONE: 'one',
  ONE_MINUS_DST_COLOR: 'one-minus-dst',
  DST_COLOR: 'dst',
  ZERO: 'zero',
  SRC_COLOR: 'src'
};

const GL_BLEND_EQ_TO_WEBGPU: Record<string, string> = {
  FUNC_ADD: 'add',
  FUNC_SUBTRACT: 'subtract',
  FUNC_REVERSE_SUBTRACT: 'reverse-subtract'
};

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
    params.blendColorSrcFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[0]] || 'one';
    params.blendColorDstFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[1]] || 'zero';
  }
  if (blendFunc.length >= 4) {
    params.blendAlphaSrcFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[2]] || 'one';
    params.blendAlphaDstFactor = GL_BLEND_FUNC_TO_WEBGPU[blendFunc[3]] || 'zero';
  } else {
    params.blendAlphaSrcFactor = params.blendColorSrcFactor;
    params.blendAlphaDstFactor = params.blendColorDstFactor;
  }

  if (Array.isArray(blendEquation)) {
    params.blendColorOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation[0]] || 'add';
    params.blendAlphaOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation[1]] || 'add';
  } else if (blendEquation) {
    params.blendColorOperation = GL_BLEND_EQ_TO_WEBGPU[blendEquation] || 'add';
    params.blendAlphaOperation = params.blendColorOperation;
  }

  return params;
}

/**
 * @deprecated Use getLayerBlendingParameters() instead. In deck.gl 9.x,
 * blending is set via the `parameters` prop, not via direct GL calls.
 * This function is kept for backward compatibility but is a no-op.
 */
export function setLayerBlending(_gl: unknown, _layerBlending: string): void {
  // no-op in deck.gl 9.x - blending is handled via parameters prop
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

  proto._resizeRenderBuffers = function _resizeRenderBufferPatched() {
    const {renderBuffers} = this;
    const size = this.device.canvasContext!.getDrawingBufferSize();
    const [width, height] = size;
    if (renderBuffers.length === 0) {
      [0, 1].map((i: number) => {
        const texture = this.device.createTexture({
          sampler: {minFilter: 'linear', magFilter: 'linear'},
          width,
          height
        });
        renderBuffers.push(
          this.device.createFramebuffer({
            id: `deck-renderbuffer-${i}`,
            colorAttachments: [texture],
            depthStencilAttachment: 'depth24plus'
          })
        );
      });
    }
    for (const buffer of renderBuffers) {
      buffer.resize(size);
    }
  };
}
