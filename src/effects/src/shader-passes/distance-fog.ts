// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';

export type DistanceFogProps = {
  density: number;
  fogStart: number;
  fogRange: number;
  fogColor: [number, number, number];
};

const DISTANCE_FOG_UNIFORM_BLOCK = /* glsl */ `\
uniform distanceFogUniforms {
  float density;
  float fogStart;
  float fogRange;
  float nearPlane;
  float farPlane;
  vec3 fogColor;
} distanceFog;
`;

const DISTANCE_FOG_FS = /* glsl */ `\
#version 300 es
precision highp float;

uniform sampler2D texSrc;
uniform sampler2D texDepth;

in vec2 position;
in vec2 coordinate;
in vec2 uv;

out vec4 fragColor;

void main() {
  vec4 color = texture(texSrc, coordinate);
  float depth = texture(texDepth, coordinate).r;

  float n = distanceFog.nearPlane;
  float f = distanceFog.farPlane;
  float eyeZ = n * f / (f - depth * (f - n));
  float linearDepth = (eyeZ - n) / (f - n);

  vec3 fogColor = distanceFog.fogColor / 255.0;
  float end = distanceFog.fogStart + distanceFog.fogRange;
  float fogFactor = smoothstep(distanceFog.fogStart, end, linearDepth) * distanceFog.density;

  fragColor = vec4(mix(color.rgb, fogColor, fogFactor), color.a);
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

const distanceFogModule = {
  name: 'distanceFog',
  fs: DISTANCE_FOG_UNIFORM_BLOCK,
  uniformTypes: {
    density: 'f32',
    fogStart: 'f32',
    fogRange: 'f32',
    nearPlane: 'f32',
    farPlane: 'f32',
    fogColor: 'vec3<f32>'
  },
  defaultUniforms: {
    density: 0.5,
    fogStart: 0.3,
    fogRange: 0.5,
    nearPlane: 0.1,
    farPlane: 1000,
    fogColor: [217, 222, 230]
  },
  propTypes: {
    density: {value: 0.5, min: 0, max: 1},
    fogStart: {value: 0.3, min: 0, max: 1},
    fogRange: {value: 0.5, min: 0.01, max: 1},
    fogColor: {value: [217, 222, 230]},
    nearPlane: {value: 0.1, private: true},
    farPlane: {value: 1000, private: true}
  }
} as const satisfies ShaderModule;

/**
 * Distance Fog Effect - uses the depth buffer to apply fog based on
 * camera-to-fragment distance. The raw depth buffer values are linearized
 * using the camera's near/far planes (extracted from the viewport projection
 * matrix) so that the fog gradient is perceptually uniform with distance.
 */
export class DeckDistanceFogEffect {
  id = 'distance-fog-effect';
  props: DistanceFogProps;
  module = distanceFogModule;
  private model: InstanceType<typeof ClipSpace> | null = null;

  constructor(props: Partial<DistanceFogProps> = {}) {
    this.props = {
      density: 0.5,
      fogStart: 0.3,
      fogRange: 0.5,
      fogColor: [217, 222, 230],
      ...props
    };
  }

  setup({device}) {
    this.model = new ClipSpace(device, {
      id: 'distance-fog-pass',
      fs: DISTANCE_FOG_FS,
      modules: [distanceFogModule, screenModule],
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

  setProps(props: Partial<DistanceFogProps>) {
    Object.assign(this.props, props);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  preRender(): void {}

  postRender(params: any): any {
    const {inputBuffer, swapBuffer, target} = params;
    const outputBuffer = target !== undefined ? target : swapBuffer;

    if (!this.model) return inputBuffer;

    // Distance fog always runs first among post-processing effects
    // (enforced by fixEffectOrder), so inputBuffer is always the scene
    // render target with valid depth data.
    const depthAttachment = inputBuffer.depthStencilAttachment;
    if (!depthAttachment) return inputBuffer;

    let nearPlane = 0.1;
    let farPlane = 1000;
    if (params.viewports?.length > 0) {
      const pm = params.viewports[0].projectionMatrix;
      if (pm) {
        const n = pm[14] / (pm[10] - 1);
        const f = pm[14] / (pm[10] + 1);
        if (Number.isFinite(n) && Number.isFinite(f) && n > 0 && f > n) {
          nearPlane = n;
          farPlane = f;
        }
      }
    }

    const texSize: [number, number] = [inputBuffer.width, inputBuffer.height];

    this.model.shaderInputs.setProps({
      screen: {
        texSrc: inputBuffer.colorAttachments[0],
        texSize
      },
      distanceFog: {
        texDepth: depthAttachment,
        density: this.props.density,
        fogStart: this.props.fogStart,
        fogRange: this.props.fogRange,
        nearPlane,
        farPlane,
        fogColor: this.props.fogColor
      }
    });

    const renderPass = this.model.device.beginRenderPass({
      framebuffer: outputBuffer,
      parameters: {viewport: [0, 0, ...texSize]},
      clearColor: [0, 0, 0, 0],
      clearDepth: 1
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
