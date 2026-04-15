// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';

const BLIT_FS = /* glsl */ `\
#version 300 es
precision highp float;

uniform sampler2D texSrc;

in vec2 position;
in vec2 coordinate;
in vec2 uv;

out vec4 fragColor;

void main() {
  fragColor = texture(texSrc, coordinate);
}
`;

const screenModule = {
  name: 'screen',
  fs: /* glsl */ `\
uniform screenUniforms {
  vec2 texSize;
} screen;
`,
  uniformTypes: {
    texSize: 'vec2<f32>'
  }
} as const satisfies ShaderModule;

/**
 * Pass-through compositing effect for shadow rendering in interleaved mode.
 *
 * In interleaved MapboxOverlay rendering, deck.gl layers share MapLibre's
 * WebGL context and depth buffer. The base LightingEffect renders shadow
 * maps once per drawLayer call with a single-layer filter, corrupting the
 * shadow map. When any post-processing effect is present, DeckRenderer
 * routes layers through offscreen FBOs (clearCanvas=true), giving deck.gl
 * its own clean depth buffer. The afterRender pass then re-renders all
 * layers with correct shadow maps into this clean FBO.
 *
 * This effect replicates that mechanism: its mere presence as a
 * post-processing effect (postRender) forces the offscreen FBO path.
 * The postRender itself is a simple source-over blit — it copies the
 * rendered layers from the offscreen buffer onto the screen, exactly
 * like the fog effect's Porter-Duff compositing but without any visual
 * transformation.
 */
export class DeckShadowCompositingEffect {
  id = 'shadow-compositing-effect';
  private model: InstanceType<typeof ClipSpace> | null = null;

  setup({device}) {
    this.model = new ClipSpace(device, {
      id: 'shadow-compositing-pass',
      fs: BLIT_FS,
      modules: [screenModule],
      parameters: {
        depthWriteEnabled: false,
        depthCompare: 'always' as const,
        blend: true,
        blendColorSrcFactor: 'one' as const,
        blendColorDstFactor: 'one-minus-src-alpha' as const,
        blendAlphaSrcFactor: 'one' as const,
        blendAlphaDstFactor: 'one-minus-src-alpha' as const,
        blendColorOperation: 'add' as const,
        blendAlphaOperation: 'add' as const
      }
    });
  }

  preRender(): void {
    // no-op — required by the effect interface
  }

  postRender(params: any): any {
    const {inputBuffer, swapBuffer, target} = params;
    const outputBuffer = target !== undefined ? target : swapBuffer;

    if (!this.model) return inputBuffer;

    const texSize: [number, number] = [inputBuffer.width, inputBuffer.height];

    this.model.shaderInputs.setProps({
      screen: {
        texSrc: inputBuffer.colorAttachments[0],
        texSize
      }
    });

    const renderPass = this.model.device.beginRenderPass({
      framebuffer: outputBuffer,
      parameters: {viewport: [0, 0, ...texSize]},
      clearColor: params.clearCanvas !== false ? [0, 0, 0, 0] : false,
      clearDepth: params.clearCanvas !== false ? 1 : false
    });
    this.model.draw(renderPass);
    renderPass.end();

    return outputBuffer || inputBuffer;
  }

  cleanup(): void {
    if (this.model) {
      this.model.destroy();
      this.model = null;
    }
  }
}
