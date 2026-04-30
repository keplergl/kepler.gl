// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';
import {patchTileViewportIds} from '../tile-viewport-fix';

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
  vec4 invCol0;
  vec4 invCol1;
  vec4 invCol2;
  vec4 invCol3;
  float viewportWidth;
  float viewportHeight;
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

  bool isBasemap = depth >= 0.999;
  float linearDepth;

  if (isBasemap) {
    vec2 screenXY = vec2(
      coordinate.x * distanceFog.viewportWidth,
      (1.0 - coordinate.y) * distanceFog.viewportHeight
    );
    mat4 invMat = mat4(
      distanceFog.invCol0,
      distanceFog.invCol1,
      distanceFog.invCol2,
      distanceFog.invCol3
    );
    vec4 nearH = invMat * vec4(screenXY, -1.0, 1.0);
    vec4 farH  = invMat * vec4(screenXY,  1.0, 1.0);
    vec3 nearP = nearH.xyz / nearH.w;
    vec3 farP  = farH.xyz / farH.w;
    float denom = farP.z - nearP.z;
    float t = abs(denom) > 1e-6 ? -nearP.z / denom : 0.0;
    linearDepth = clamp(t, 0.0, 1.0);
  } else {
    float eyeZ = n * f / (f - depth * (f - n));
    linearDepth = (eyeZ - n) / (f - n);
  }

  vec3 fogColor = distanceFog.fogColor / 255.0;
  float end = distanceFog.fogStart + distanceFog.fogRange;
  float fogFactor = smoothstep(distanceFog.fogStart, end, linearDepth) * distanceFog.density;

  if (fogFactor <= 0.001) {
    fragColor = color;
    return;
  }

  // Porter-Duff source-over for correct compositing over transparent basemap pixels.
  vec3 baseRgb = color.a > 0.001 ? color.rgb / color.a : fogColor;
  vec3 straightRgb = mix(baseRgb, fogColor, fogFactor);
  float outAlpha = fogFactor + color.a * (1.0 - fogFactor);
  fragColor = vec4(straightRgb * outAlpha, outAlpha);
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
    fogColor: 'vec3<f32>',
    invCol0: 'vec4<f32>',
    invCol1: 'vec4<f32>',
    invCol2: 'vec4<f32>',
    invCol3: 'vec4<f32>',
    viewportWidth: 'f32',
    viewportHeight: 'f32'
  },
  defaultUniforms: {
    density: 0.5,
    fogStart: 0.3,
    fogRange: 0.5,
    nearPlane: 0.1,
    farPlane: 1000,
    fogColor: [217, 222, 230],
    invCol0: [1, 0, 0, 0],
    invCol1: [0, 1, 0, 0],
    invCol2: [0, 0, 1, 0],
    invCol3: [0, 0, 0, 1],
    viewportWidth: 1,
    viewportHeight: 1
  },
  propTypes: {
    density: {value: 0.5, min: 0, max: 1},
    fogStart: {value: 0.3, min: 0, max: 1},
    fogRange: {value: 0.5, min: 0.01, max: 1},
    fogColor: {value: [217, 222, 230]},
    nearPlane: {value: 0.1, private: true},
    farPlane: {value: 1000, private: true},
    invCol0: {value: [1, 0, 0, 0], private: true},
    invCol1: {value: [0, 1, 0, 0], private: true},
    invCol2: {value: [0, 0, 1, 0], private: true},
    invCol3: {value: [0, 0, 0, 1], private: true},
    viewportWidth: {value: 1, private: true},
    viewportHeight: {value: 1, private: true}
  }
} as const satisfies ShaderModule;

/**
 * Distance Fog Effect - uses the depth buffer to apply fog based on
 * camera-to-fragment distance. The raw depth buffer values are linearized
 * using the camera's near/far planes (extracted from the viewport projection
 * matrix) so that the fog gradient is perceptually uniform with distance.
 * Basemap pixels (no depth) use ray-ground-plane intersection to compute
 * their true linear depth so fog fades correctly with distance.
 */
export class DeckDistanceFogEffect {
  id = 'distance-fog-effect';
  props: DistanceFogProps;
  module = distanceFogModule;
  isExportMode = false;
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

  private _unpatchViewports: (() => void) | null = null;

  preRender(opts?: any): void {
    if (this.isExportMode && opts) {
      this._unpatchViewports = patchTileViewportIds(opts);
    }
    if (this.model) {
      const gl = (this.model.device as any).gl as WebGL2RenderingContext | undefined;
      if (gl) {
        gl.depthRange(0, 1);
      }
    }
  }

  postRender(params: any): any {
    if (this._unpatchViewports) {
      this._unpatchViewports();
      this._unpatchViewports = null;
    }
    const {inputBuffer, swapBuffer, target} = params;
    const outputBuffer = target !== undefined ? target : swapBuffer;

    if (!this.model) return inputBuffer;

    const depthAttachment = inputBuffer.depthStencilAttachment;
    if (!depthAttachment) return inputBuffer;

    let nearPlane = 0.1;
    let farPlane = 1000;
    let invCol0 = [1, 0, 0, 0];
    let invCol1 = [0, 1, 0, 0];
    let invCol2 = [0, 0, 1, 0];
    let invCol3 = [0, 0, 0, 1];
    let viewportWidth = 1;
    let viewportHeight = 1;

    if (params.viewports?.length > 0) {
      const viewport = params.viewports[0];

      viewportWidth = viewport.width;
      viewportHeight = viewport.height;

      const pm = viewport.projectionMatrix;
      if (pm) {
        const n = pm[14] / (pm[10] - 1);
        const f = pm[14] / (pm[10] + 1);
        if (Number.isFinite(n) && Number.isFinite(f) && n > 0 && f > n) {
          nearPlane = n;
          farPlane = f;
        }
      }

      const pum = viewport.pixelUnprojectionMatrix;
      if (pum) {
        invCol0 = [pum[0], pum[1], pum[2], pum[3]];
        invCol1 = [pum[4], pum[5], pum[6], pum[7]];
        invCol2 = [pum[8], pum[9], pum[10], pum[11]];
        invCol3 = [pum[12], pum[13], pum[14], pum[15]];
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
        fogColor: this.props.fogColor,
        invCol0,
        invCol1,
        invCol2,
        invCol3,
        viewportWidth,
        viewportHeight
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
