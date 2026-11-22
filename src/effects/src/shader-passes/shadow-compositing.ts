// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';

type CompositingDevice = InstanceType<typeof ClipSpace>['device'];

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
  // Filters such as brightness can leave RGB in transparent pixels. Keep the
  // final image premultiplied before blending it over the shared basemap.
  fragColor.rgb = clamp(fragColor.rgb, vec3(0.0), vec3(fragColor.a));
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
 * Final compositing effect for video export in interleaved mode.
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
 * It also finishes post-processing chains in a separate pass, so filter RGB
 * outside the layers' alpha coverage never reaches the basemap. Already valid
 * premultiplied colors (including translucent layers and shadows) are unchanged.
 */
export class DeckShadowCompositingEffect {
  id = 'shadow-compositing-effect';
  // Flat swipe export shares the effect between two Deck devices.
  private models = new Map<CompositingDevice, InstanceType<typeof ClipSpace>>();

  setup({device}: {device: CompositingDevice}) {
    if (this.models.has(device)) return;
    this.models.set(
      device,
      new ClipSpace(device, {
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
      })
    );
  }

  preRender(): void {
    // no-op — required by the effect interface
  }

  postRender(params: any): any {
    const {inputBuffer, swapBuffer, target} = params;
    const outputBuffer = target !== undefined ? target : swapBuffer;

    const model = this.models.get(inputBuffer.device);
    if (!model) return inputBuffer;

    const texSize: [number, number] = [inputBuffer.width, inputBuffer.height];

    model.shaderInputs.setProps({
      screen: {
        texSrc: inputBuffer.colorAttachments[0],
        texSize
      }
    });

    const renderPass = model.device.beginRenderPass({
      framebuffer: outputBuffer,
      parameters: {viewport: [0, 0, ...texSize]},
      clearColor: params.clearCanvas !== false ? [0, 0, 0, 0] : false,
      clearDepth: params.clearCanvas !== false ? 1 : false
    });
    model.draw(renderPass);
    renderPass.end();

    return outputBuffer || inputBuffer;
  }

  cleanup(context?: {device: CompositingDevice}): void {
    if (context) {
      this.models.get(context.device)?.destroy();
      this.models.delete(context.device);
    } else {
      for (const model of this.models.values()) model.destroy();
      this.models.clear();
    }
  }
}
