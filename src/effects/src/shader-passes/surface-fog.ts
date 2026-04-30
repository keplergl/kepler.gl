// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';
import {patchTileViewportIds} from '../tile-viewport-fix';

export type SurfaceFogProps = {
  density: number;
  /** Fog ceiling elevation in meters. Geometry below this gets fog. */
  height: number;
  /** Vertical transition zone in meters above the ceiling. */
  thickness: number;
  fogColor: [number, number, number];
  /** When true, render a static wave/water pattern instead of plain fog. */
  pattern: boolean;
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
  float viewportWidth;
  float viewportHeight;
  float unitsPerMeter;
  float pattern;
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

// --- Gradient noise for pattern detail ---

vec2 hashGrad(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  float a = fract(sin(h) * 43758.5453) * 6.2831853;
  return vec2(cos(a), sin(a));
}

float noise2d(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n00 = dot(hashGrad(i), f);
  float n10 = dot(hashGrad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(hashGrad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(hashGrad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

// 3-octave FBM with rotation to break axis-alignment.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  // ~47.6° rotation per octave — avoids 45°/90° multiples that reinforce grid lines
  mat2 rot = mat2(0.6731, 0.7395, -0.7395, 0.6731);
  for (int i = 0; i < 3; i++) {
    v += a * noise2d(p);
    p = rot * p * 2.03;
    a *= 0.5;
  }
  return v;
}

// Wave normal from layered sine trains + multi-octave noise.
vec3 waveNormal(vec2 m) {
  float normalScale = 6.0;
  vec2 dh = vec2(0.0);
  float p;

  // Low-frequency pattern
  p = dot(m, vec2( 0.014,  0.008)); dh += cos(p) * 0.50 * vec2( 0.014,  0.008);
  p = dot(m, vec2(-0.009,  0.019)); dh += cos(p) * 0.40 * vec2(-0.009,  0.019);
  p = dot(m, vec2( 0.022, -0.011)); dh += cos(p) * 0.30 * vec2( 0.022, -0.011);
  p = dot(m, vec2(-0.005, -0.025)); dh += cos(p) * 0.25 * vec2(-0.005, -0.025);

  // Mid-frequency pattern
  p = dot(m, vec2( 0.041,  0.029)); dh += cos(p) * 0.18 * vec2( 0.041,  0.029);
  p = dot(m, vec2(-0.033,  0.037)); dh += cos(p) * 0.15 * vec2(-0.033,  0.037);
  p = dot(m, vec2( 0.057, -0.019)); dh += cos(p) * 0.10 * vec2( 0.057, -0.019);
  p = dot(m, vec2(-0.018, -0.051)); dh += cos(p) * 0.08 * vec2(-0.018, -0.051);

  // High-frequency pattern for fine detail when zoomed in
  p = dot(m, vec2( 0.083,  0.061)); dh += cos(p) * 0.06 * vec2( 0.083,  0.061);
  p = dot(m, vec2(-0.071,  0.089)); dh += cos(p) * 0.05 * vec2(-0.071,  0.089);
  p = dot(m, vec2( 0.097, -0.067)); dh += cos(p) * 0.04 * vec2( 0.097, -0.067);
  p = dot(m, vec2(-0.059, -0.103)); dh += cos(p) * 0.04 * vec2(-0.059, -0.103);
  p = dot(m, vec2( 0.131,  0.047)); dh += cos(p) * 0.03 * vec2( 0.131,  0.047);
  p = dot(m, vec2(-0.113,  0.127)); dh += cos(p) * 0.03 * vec2(-0.113,  0.127);

  // Very high-frequency pattern for close-up detail
  p = dot(m, vec2( 0.173, -0.139)); dh += cos(p) * 0.025 * vec2( 0.173, -0.139);
  p = dot(m, vec2(-0.149,  0.181)); dh += cos(p) * 0.020 * vec2(-0.149,  0.181);
  p = dot(m, vec2( 0.211,  0.157)); dh += cos(p) * 0.018 * vec2( 0.211,  0.157);
  p = dot(m, vec2(-0.193, -0.167)); dh += cos(p) * 0.015 * vec2(-0.193, -0.167);

  // Multi-octave noise via FBM for organic variation
  float eps = 0.5;
  float nc = fbm(m * 0.04);
  float nx = fbm((m + vec2(eps, 0.0)) * 0.04);
  float ny = fbm((m + vec2(0.0, eps)) * 0.04);
  dh += vec2(nc - nx, nc - ny) * (0.4 / eps);

  return normalize(vec3(-dh.x * normalScale, 1.0, -dh.y * normalScale));
}

const vec3 SUN_DIR   = normalize(vec3(0.3, 0.8, 0.5));
const vec3 SUN_COLOR = vec3(1.0, 0.95, 0.8);

void sunLight(vec3 normal, vec3 eyeDir, float shiny, float spec, float diff,
              inout vec3 diffuseOut, inout vec3 specularOut) {
  vec3 refl = normalize(reflect(-SUN_DIR, normal));
  float d = max(0.0, dot(eyeDir, refl));
  specularOut += pow(d, shiny) * SUN_COLOR * spec;
  diffuseOut  += max(dot(SUN_DIR, normal), 0.0) * SUN_COLOR * diff;
}

void main() {
  vec4 color = texture(texSrc, coordinate);
  float depth = texture(texDepth, coordinate).r;

  vec2 screenXY = vec2(
    coordinate.x * surfaceFog.viewportWidth,
    (1.0 - coordinate.y) * surfaceFog.viewportHeight
  );

  mat4 invMat = mat4(
    surfaceFog.invCol0,
    surfaceFog.invCol1,
    surfaceFog.invCol2,
    surfaceFog.invCol3
  );

  bool isBasemap = depth >= 0.999;
  bool usePattern = surfaceFog.pattern > 0.5;

  float submersion;
  float fogFactor;
  vec2 worldMeters = vec2(0.0);

  if (isBasemap) {
    // Basemap sits at z=0 in common space.
    float groundZ = 0.0;
    submersion = 1.0 - smoothstep(surfaceFog.fogHeight,
                                   surfaceFog.fogHeight + surfaceFog.fogThickness,
                                   groundZ);
    fogFactor = submersion * surfaceFog.density;
    if (fogFactor <= 0.001) {
      fragColor = color;
      return;
    }
    vec4 nearH = invMat * vec4(screenXY, -1.0, 1.0);
    vec4 farH  = invMat * vec4(screenXY,  1.0, 1.0);
    vec3 nearP = nearH.xyz / nearH.w;
    vec3 farP  = farH.xyz / farH.w;
    float denom = farP.z - nearP.z;
    float t = abs(denom) > 1e-6 ? -nearP.z / denom : 0.0;
    vec2 groundXY = nearP.xy + t * (farP.xy - nearP.xy);
    worldMeters = groundXY / surfaceFog.unitsPerMeter;
  } else {
    vec4 commonPos = invMat * vec4(screenXY, depth * 2.0 - 1.0, 1.0);
    commonPos /= commonPos.w;
    submersion = 1.0 - smoothstep(surfaceFog.fogHeight,
                                   surfaceFog.fogHeight + surfaceFog.fogThickness,
                                   commonPos.z);
    fogFactor = submersion * surfaceFog.density;
    if (usePattern) {
      worldMeters = commonPos.xy / surfaceFog.unitsPerMeter;
    }
  }

  if (fogFactor <= 0.001) {
    fragColor = color;
    return;
  }

  vec3 fogColorNorm = surfaceFog.fogColor / 255.0;

  if (!usePattern) {
    float ff = clamp(fogFactor, 0.0, 1.0);
    vec3 baseRgb = color.a > 0.001 ? color.rgb / color.a : fogColorNorm;
    vec3 straightRgb = mix(baseRgb, fogColorNorm, ff);
    float outAlpha = ff + color.a * (1.0 - ff);
    fragColor = vec4(straightRgb * outAlpha, outAlpha);
    return;
  }

  // --- Pattern mode ---

  vec3 N = waveNormal(worldMeters);
  vec3 eyeDir = vec3(0.0, 1.0, 0.0);
  vec3 diffuse  = vec3(0.0);
  vec3 specular = vec3(0.0);
  sunLight(N, eyeDir, 100.0, 2.0, 0.5, diffuse, specular);

  vec3 baseRgb = color.a > 0.001 ? color.rgb / color.a : fogColorNorm;
  vec3 tinted = mix(baseRgb, fogColorNorm, submersion);
  vec3 waterSurface = clamp(tinted * (diffuse + vec3(0.1)) + specular, 0.0, 1.0);

  float wf = clamp(fogFactor, 0.0, 1.0);
  vec3 straightRgb = mix(baseRgb, waterSurface, wf);
  float outAlpha = wf + color.a * (1.0 - wf);
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
    invCol3: 'vec4<f32>',
    viewportWidth: 'f32',
    viewportHeight: 'f32',
    unitsPerMeter: 'f32',
    pattern: 'f32'
  },
  defaultUniforms: {
    density: 0.6,
    fogHeight: 0,
    fogThickness: 0,
    fogColor: [230, 235, 242],
    invCol0: [1, 0, 0, 0],
    invCol1: [0, 1, 0, 0],
    invCol2: [0, 0, 1, 0],
    invCol3: [0, 0, 0, 1],
    viewportWidth: 1,
    viewportHeight: 1,
    unitsPerMeter: 1,
    pattern: 0
  },
  propTypes: {
    density: {value: 0.6, min: 0, max: 1},
    fogColor: {value: [230, 235, 242]},
    pattern: {value: 0, min: 0, max: 1},
    fogHeight: {value: 0, private: true},
    fogThickness: {value: 0, private: true},
    invCol0: {value: [1, 0, 0, 0], private: true},
    invCol1: {value: [0, 1, 0, 0], private: true},
    invCol2: {value: [0, 0, 1, 0], private: true},
    invCol3: {value: [0, 0, 0, 1], private: true},
    viewportWidth: {value: 1, private: true},
    viewportHeight: {value: 1, private: true},
    unitsPerMeter: {value: 1, private: true}
  }
} as const satisfies ShaderModule;

/**
 * Surface Fog / Water Effect — elevation-based ground-level fog or ocean overlay.
 *
 * When `pattern` is false the effect behaves as a classic flat-colour fog layer.
 * When `pattern` is true a static wave pattern (layered sine trains + FBM noise,
 * lit with diffuse+specular sun shading) replaces the flat tint and the
 * effect also renders over basemap areas via straight-alpha compositing.
 */
export class DeckSurfaceFogEffect {
  id = 'surface-fog-effect';
  props: SurfaceFogProps;
  module = surfaceFogModule;
  isExportMode = false;
  private model: InstanceType<typeof ClipSpace> | null = null;

  constructor(props: Partial<SurfaceFogProps> = {}) {
    this.props = {
      density: 0.6,
      height: 50,
      thickness: 50,
      fogColor: [230, 235, 242],
      pattern: false,
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

  private _unpatchViewports: (() => void) | null = null;

  preRender(opts?: any): void {
    if (this.isExportMode && opts) {
      this._unpatchViewports = patchTileViewportIds(opts);
    }
    // Reset depthRange to [0,1]. Maplibre/mapbox basemap rendering sets a
    // compressed depthRange (e.g. [0, 0.979]) and doesn't restore it.  When
    // deck.gl layers render to the offscreen FBO their depth values get
    // compressed into that range, causing the fog shader's depth
    // reconstruction (depth * 2 − 1) to return incorrect z values.
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

    let invCol0 = [1, 0, 0, 0];
    let invCol1 = [0, 1, 0, 0];
    let invCol2 = [0, 0, 1, 0];
    let invCol3 = [0, 0, 0, 1];
    let unitsPerMeterZ = 1;
    let viewportWidth = 1;
    let viewportHeight = 1;

    if (params.viewports?.length > 0) {
      const viewport = params.viewports[0];

      viewportWidth = viewport.width;
      viewportHeight = viewport.height;

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
        invCol3,
        viewportWidth,
        viewportHeight,
        unitsPerMeter: unitsPerMeterZ,
        pattern: this.props.pattern ? 1.0 : 0.0
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
