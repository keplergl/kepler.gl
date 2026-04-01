// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';

export type SurfaceFogProps = {
  density: number;
  /** Fog ceiling elevation in meters. Geometry below this gets fog. */
  height: number;
  /** Vertical transition zone in meters above the ceiling. */
  thickness: number;
  fogColor: [number, number, number];
};

const SURFACE_FOG_UNIFORM_BLOCK = /* glsl */ `\
uniform surfaceFogUniforms {
  float density;
  float fogHeight;
  float fogThickness;
  vec3 fogColor;
  vec4 invCol0;
  vec4 invCol1;
  vec4 invCol2;
  vec4 invCol3;
} surfaceFog;
`;

const SURFACE_FOG_FS = /* glsl */ `\
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

  if (depth >= 0.999) {
    fragColor = color;
    return;
  }

  // pixelUnprojectionMatrix maps (pixelX, pixelY, clipZ) → common space.
  // coordinate is 0..1 UV; convert to pixel coords matching deck.gl convention
  // (origin top-left, y-down).
  // Depth buffer stores [0,1]; convert to clip-space Z [-1,1] (WebGL NDC).
  vec2 texSize = vec2(textureSize(texSrc, 0));
  vec3 pixelPos = vec3(
    coordinate.x * texSize.x,
    (1.0 - coordinate.y) * texSize.y,
    depth * 2.0 - 1.0
  );

  mat4 invMat = mat4(
    surfaceFog.invCol0,
    surfaceFog.invCol1,
    surfaceFog.invCol2,
    surfaceFog.invCol3
  );

  vec4 commonPos = invMat * vec4(pixelPos, 1.0);
  commonPos /= commonPos.w;

  // commonPos.z is elevation in common-space units.
  // fogHeight and fogThickness are pre-converted to the same units on CPU.
  // Below fogHeight: full fog.
  // fogHeight → fogHeight + fogThickness: smooth transition.
  // Above fogHeight + fogThickness: no fog.
  float fogFactor = (1.0 - smoothstep(surfaceFog.fogHeight, surfaceFog.fogHeight + surfaceFog.fogThickness, commonPos.z))
                    * surfaceFog.density;

  vec3 fogColorNorm = surfaceFog.fogColor / 255.0;
  fragColor = vec4(mix(color.rgb, fogColorNorm, clamp(fogFactor, 0.0, 1.0)), color.a);
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

const surfaceFogModule = {
  name: 'surfaceFog',
  fs: SURFACE_FOG_UNIFORM_BLOCK,
  uniformTypes: {
    density: 'f32',
    fogHeight: 'f32',
    fogThickness: 'f32',
    fogColor: 'vec3<f32>',
    invCol0: 'vec4<f32>',
    invCol1: 'vec4<f32>',
    invCol2: 'vec4<f32>',
    invCol3: 'vec4<f32>'
  },
  defaultUniforms: {
    density: 0.6,
    fogHeight: 0,
    fogThickness: 0,
    fogColor: [230, 235, 242],
    invCol0: [1, 0, 0, 0],
    invCol1: [0, 1, 0, 0],
    invCol2: [0, 0, 1, 0],
    invCol3: [0, 0, 0, 1]
  },
  propTypes: {
    density: {value: 0.6, min: 0, max: 1},
    height: {value: 100, min: 0, max: 3000},
    thickness: {value: 200, min: 0, max: 1000},
    fogColor: {value: [230, 235, 242]},
    fogHeight: {value: 0, private: true},
    fogThickness: {value: 0, private: true},
    invCol0: {value: [1, 0, 0, 0], private: true},
    invCol1: {value: [0, 1, 0, 0], private: true},
    invCol2: {value: [0, 0, 1, 0], private: true},
    invCol3: {value: [0, 0, 0, 1], private: true}
  }
} as const satisfies ShaderModule;

/**
 * Surface Fog Effect — elevation-based ground-level fog.
 *
 * Uses deck.gl's pixelUnprojectionMatrix to reconstruct the common-space
 * position of each fragment from the depth buffer.  The Z component of
 * that position corresponds to the fragment's real-world elevation
 * (scaled by distanceScales.unitsPerMeter).  Fog is applied to all
 * fragments whose elevation is below the user-configured height (meters),
 * with a smooth transition zone controlled by thickness (meters).
 */
export class DeckSurfaceFogEffect {
  id = 'surface-fog-effect';
  props: SurfaceFogProps;
  module = surfaceFogModule;
  private model: InstanceType<typeof ClipSpace> | null = null;

  constructor(props: Partial<SurfaceFogProps> = {}) {
    this.props = {
      density: 0.6,
      height: 100,
      thickness: 200,
      fogColor: [230, 235, 242],
      ...props
    };
  }

  setup({device}) {
    this.model = new ClipSpace(device, {
      id: 'surface-fog-pass',
      fs: SURFACE_FOG_FS,
      modules: [surfaceFogModule, screenModule],
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

  setProps(props: Partial<SurfaceFogProps>) {
    Object.assign(this.props, props);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  preRender(): void {}

  postRender(params: any): any {
    const {inputBuffer, swapBuffer, target} = params;
    const outputBuffer = target !== undefined ? target : swapBuffer;

    if (!this.model) return inputBuffer;

    const depthAttachment = inputBuffer.depthStencilAttachment;
    if (!depthAttachment) return inputBuffer;

    let invCol0 = [1, 0, 0, 0];
    let invCol1 = [0, 1, 0, 0];
    let invCol2 = [0, 0, 1, 0];
    let invCol3 = [0, 0, 0, 1];
    let unitsPerMeterZ = 1;

    if (params.viewports?.length > 0) {
      const viewport = params.viewports[0];

      // pixelUnprojectionMatrix maps (pixelX, pixelY, depth) → common space
      const pum = viewport.pixelUnprojectionMatrix;
      if (pum) {
        invCol0 = [pum[0], pum[1], pum[2], pum[3]];
        invCol1 = [pum[4], pum[5], pum[6], pum[7]];
        invCol2 = [pum[8], pum[9], pum[10], pum[11]];
        invCol3 = [pum[12], pum[13], pum[14], pum[15]];
      }

      const ds = viewport.distanceScales;
      if (ds?.unitsPerMeter) {
        const z = Array.isArray(ds.unitsPerMeter) ? ds.unitsPerMeter[2] : ds.unitsPerMeter;
        if (Number.isFinite(z) && z > 0) {
          unitsPerMeterZ = z;
        }
      }
    }

    // Convert user-facing meters to common-space units for the shader
    const fogHeightCommon = this.props.height * unitsPerMeterZ;
    const fogThicknessCommon = this.props.thickness * unitsPerMeterZ;

    const texSize: [number, number] = [inputBuffer.width, inputBuffer.height];

    this.model.shaderInputs.setProps({
      screen: {
        texSrc: inputBuffer.colorAttachments[0],
        texSize
      },
      surfaceFog: {
        texDepth: depthAttachment,
        density: this.props.density,
        fogHeight: fogHeightCommon,
        fogThickness: fogThicknessCommon,
        fogColor: this.props.fogColor,
        invCol0,
        invCol1,
        invCol2,
        invCol3
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
