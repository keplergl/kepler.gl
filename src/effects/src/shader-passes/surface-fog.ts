// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import type {ShaderModule} from '@luma.gl/shadertools';
import {patchTileViewportIds, resetDepthRange} from '../tile-viewport-fix';

// Rebase the inverse matrix on the CPU before its doubles become GPU floats.
// This is an origin interval, not a texture repeat: the noise also receives the
// world lattice offset so neighboring origin tiles contain different waves.
// Keep local coordinates small enough to resolve sub-meter ripples consistently.
const WATER_ORIGIN_METERS = 512;

export type SurfaceFogProps = {
  density: number;
  /** Fog ceiling elevation in meters. Geometry below this gets fog. */
  height: number;
  /** Fog fade above the ceiling, or underwater color/visibility transition depth (meters). */
  thickness: number;
  fogColor: [number, number, number];
  /** When true, render a reflective water surface instead of plain fog. */
  pattern: boolean;
  /** Ripple strength: 0 gives flat water, 1 preserves the full wave field. */
  rippleModifier?: number;
  /** Playback speed multiplier: 0 freezes ripples, 1 preserves their normal speed. */
  rippleSpeed?: number;
};

// Render-only state, copied by deck.gl when it retains an effect instance.
// This clock never becomes a saved effect parameter.
type SurfaceFogRenderProps = SurfaceFogProps & {animationTimeMs?: number};

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
  float pixelRatio;
  float unitsPerMeter;
  float waveUnitsPerMeter;
  vec2 waveOrigin;
  float waveTime;
  float cameraHeight;
  float pattern;
  float rippleModifier;
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

const float WATER_ORIGIN_METERS = ${WATER_ORIGIN_METERS}.0;

// Gradient noise with analytic derivatives: irregular wave slopes, without
// regular sine trains or finite-difference sampling artifacts.
vec2 hashGrad(vec2 p) {
  // GPU mod can leave fractional errors even for integer lattice coordinates.
  // Round before hashing, so equivalent cells keep the same gradient on rebase.
  p = floor(mod(p, vec2(4093.0, 4091.0)) + 0.5);
  float h = dot(p, vec2(127.1, 311.7));
  float a = fract(sin(h) * 43758.5453) * 6.2831853;
  return vec2(cos(a), sin(a));
}

vec3 noiseGradient(vec2 p, vec2 origin) {
  vec2 cell = floor(p) + origin;
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f - 1.0) * (f - 1.0);
  vec2 g00 = hashGrad(cell);
  vec2 g10 = hashGrad(cell + vec2(1.0, 0.0));
  vec2 g01 = hashGrad(cell + vec2(0.0, 1.0));
  vec2 g11 = hashGrad(cell + vec2(1.0, 1.0));
  float n00 = dot(g00, f);
  float n10 = dot(g10, f - vec2(1.0, 0.0));
  float n01 = dot(g01, f - vec2(0.0, 1.0));
  float n11 = dot(g11, f - vec2(1.0, 1.0));
  float value = mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
  vec2 gradient = mix(mix(g00, g10, u.x), mix(g01, g11, u.x), u.y);
  gradient += du * vec2(mix(n10 - n00, n11 - n01, u.y),
                        mix(n01 - n00, n11 - n10, u.x));
  return vec3(value, gradient);
}

vec3 waveNoise(vec2 meters, float cellSize, mat2 frame) {
  // Add the global offset only to integer cell IDs. Fractional positions stay
  // local and precise even on a zoomed-in map thousands of kilometers away.
  // Binary scales/frames keep the lattice offset integral when rebasing.
  // Reduce the integer origin before scaling it to the fine-wave lattice.
  // Otherwise sub-meter bands exceed float integer precision at global map
  // coordinates. The frames use quarter increments, so both stages stay integral.
  vec2 period = vec2(4093.0, 4091.0);
  vec2 origin = frame * (surfaceFog.waveOrigin * 4.0);
  origin = floor(mod(origin, period) + 0.5);
  origin *= WATER_ORIGIN_METERS / (cellSize * 4.0);
  origin = floor(mod(origin, period) + 0.5);
  return noiseGradient(frame * (meters / cellSize), origin);
}

float waveWeight(float cellSize, float footprint) {
  return 1.0 - smoothstep(0.15, 0.7, footprint / cellSize);
}

vec2 waveSlope(vec2 meters, float cellSize, mat2 frame, float strength, float footprint,
               vec2 velocity) {
  float weight = waveWeight(cellSize, footprint);
  if (weight <= 0.0) {
    return vec2(0.0);
  }
  vec2 gradient = waveNoise(meters - velocity * surfaceFog.waveTime, cellSize, frame).yz;
  // Transform the gradient back to map coordinates, preserving stretched crests.
  return vec2(dot(frame[0], gradient), dot(frame[1], gradient)) *
         strength * weight;
}

vec3 waveNormal(vec2 meters, float footprint) {
  float warpedFootprint = footprint * 1.5;
  // If even the largest ripples are unresolved, skip the bend noise as well.
  if (surfaceFog.rippleModifier <= 0.0 || waveWeight(16.0, warpedFootprint) <= 0.0) {
    return vec3(0.0, 0.0, 1.0);
  }
  // Broad noise bends the ripple field without contributing a large surface
  // slope. Otherwise city views read the broad lighting bands as giant swells.
  vec3 bend = waveNoise(meters - vec2(0.18, -0.08) * surfaceFog.waveTime, 64.0, mat2(1.0));
  float bendWeight = waveWeight(64.0, footprint);
  vec2 p = meters + bend.yz * 4.0 * bendWeight;
  vec2 slope = vec2(0.0);
  // Modest slopes and meter-scale crests fit the surrounding buildings. Keep
  // their world scale fixed: unresolved ripples fade out as the map zooms out.
  // Longer waves travel faster; a small crosswind component lets the crests
  // evolve instead of sliding a single frozen texture across the surface.
  // Velocities are in map meters per playback second, independent of the camera.
  slope += waveSlope(p, 16.0, mat2(1.0, -0.25, 0.5, 0.5), 0.075, warpedFootprint, vec2(1.6, -0.8));
  slope += waveSlope(p,  8.0, mat2(0.5, -0.5, 0.25, 1.0), 0.045, warpedFootprint, vec2(1.0, -0.4));
  slope += waveSlope(p,  4.0, mat2(1.0, -0.25, 0.5, 0.5), 0.025, warpedFootprint, vec2(0.55, 0.3));
  // Fine surface ripples resolve only in close views. Fade each band before
  // it becomes subpixel, retaining the same quiet surface farther away.
  slope += waveSlope(p,  2.0, mat2(1.0, -0.25, 0.5, 0.5), 0.080, warpedFootprint, vec2(0.35, -0.15));
  slope += waveSlope(p,  1.0, mat2(0.5, -0.5, 0.25, 1.0), 0.090, warpedFootprint, vec2(0.18, 0.09));
  slope += waveSlope(p,  0.5, mat2(1.0, -0.25, 0.5, 0.5), 0.055, warpedFootprint, vec2(0.10, -0.04));
  return normalize(vec3(-slope * surfaceFog.rippleModifier, 1.0));
}

vec3 skyReflection(vec3 direction) {
  float elevation = pow(clamp(direction.z, 0.0, 1.0), 0.6);
  return mix(vec3(0.78, 0.87, 0.93), vec3(0.24, 0.45, 0.68), elevation);
}

// smoothstep is undefined when the transition is zero (a supported UI value).
float submerged(float elevation) {
  if (surfaceFog.fogThickness <= 0.0) {
    return step(elevation, surfaceFog.fogHeight);
  }
  return 1.0 - smoothstep(surfaceFog.fogHeight,
                          surfaceFog.fogHeight + surfaceFog.fogThickness, elevation);
}

void main() {
  vec4 color = texture(texSrc, coordinate);
  // Density is uniform across the frame, so this preserves derivative validity
  // while avoiding all reconstruction and wave work for an invisible effect.
  if (surfaceFog.density <= 0.001) {
    fragColor = color;
    return;
  }
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

  vec4 sceneH = invMat * vec4(screenXY, depth * 2.0 - 1.0, 1.0);
  float sceneZ = isBasemap ? 0.0 : sceneH.z / sceneH.w;
  // Fog fades above its ceiling; water only covers geometry at or below its
  // surface. In pattern mode Transition controls visibility below that surface.
  float submersion = usePattern ? step(sceneZ, surfaceFog.fogHeight) : submerged(sceneZ);
  float fogFactor = clamp(submersion * surfaceFog.density, 0.0, 1.0);
  vec3 fogColorNorm = surfaceFog.fogColor / 255.0;
  vec3 baseRgb = color.a > 0.001 ? color.rgb / color.a : fogColorNorm;

  if (!usePattern) {
    if (fogFactor <= 0.001) {
      fragColor = color;
      return;
    }
    vec3 straightRgb = mix(baseRgb, fogColorNorm, fogFactor);
    float outAlpha = fogFactor + color.a * (1.0 - fogFactor);
    fragColor = vec4(straightRgb * outAlpha, outAlpha);
    return;
  }

  // Intersect the view ray with the water level, not with the submerged terrain.
  // This keeps waves continuous across buildings, terrain and basemap pixels.
  vec4 nearH = invMat * vec4(screenXY, -1.0, 1.0);
  vec4 farH = invMat * vec4(screenXY, 1.0, 1.0);
  vec3 nearP = nearH.xyz / nearH.w;
  vec3 ray = farH.xyz / farH.w - nearP;
  bool cameraAboveWater = surfaceFog.cameraHeight > surfaceFog.fogHeight;
  float waterDepth = max((surfaceFog.fogHeight - sceneZ) / surfaceFog.unitsPerMeter, 0.0);

  vec2 worldMeters = vec2(0.0);
  float footprint = 0.0;
  float shoreWidth = 0.0;
  vec3 N = vec3(0.0, 0.0, 1.0);
  float normalVariance = 0.0;
  // Camera elevation is uniform, so submerged views can skip the surface work
  // without making derivative evaluation nonuniform at the waterline.
  if (cameraAboveWater) {
    float rayZ = abs(ray.z) > 1e-6 ? ray.z : (ray.z < 0.0 ? -1e-6 : 1e-6);
    float waterT = (surfaceFog.fogHeight - nearP.z) / rayZ;
    // The surface can lie between the camera and its near plane (negative t).
    worldMeters = (nearP.xy + ray.xy * waterT) / surfaceFog.waveUnitsPerMeter;

    // Evaluate derivatives before any per-pixel early returns at the waterline.
    // Filter in displayed pixels so a Retina buffer or high-resolution export
    // retains the same water character instead of adding a different sheen.
    footprint = max(length(dFdx(worldMeters)), length(dFdy(worldMeters))) * surfaceFog.pixelRatio;
    shoreWidth = max(1.5, fwidth(waterDepth) * surfaceFog.pixelRatio);
    N = waveNormal(worldMeters, footprint);
    vec3 normalDx = dFdx(N) * surfaceFog.pixelRatio;
    vec3 normalDy = dFdy(N) * surfaceFog.pixelRatio;
    normalVariance = dot(normalDx, normalDx) + dot(normalDy, normalDy);
  }

  if (fogFactor <= 0.001 ||
      (cameraAboveWater && ray.z >= -1e-6)) {
    fragColor = color;
    return;
  }

  vec3 V = normalize(-ray);

  // One transition controls both bottom visibility and depth-based color. Zero
  // (or invalid negative) transition gives the same opaque body color at every
  // depth, so submerged silhouettes cannot appear through depth shading alone.
  float transitionDepth = surfaceFog.fogThickness / surfaceFog.unitsPerMeter;
  float depthFactor = transitionDepth > 0.0
    ? smoothstep(0.0, transitionDepth, waterDepth)
    : 1.0;
  float visibility = 1.0 - depthFactor;
  vec3 transmission = pow(vec3(visibility), vec3(3.6, 1.6, 1.0) / max(abs(V.z), 0.2));
  vec3 scattering = fogColorNorm * mix(vec3(0.85, 1.05, 1.1),
                                      vec3(0.32, 0.48, 0.62),
                                      depthFactor);
  vec3 waterBody = baseRgb * transmission + scattering * (1.0 - transmission);
  vec3 waterSurface = waterBody;

  if (cameraAboveWater) {
    vec3 L = normalize(vec3(0.35, -0.40, 0.85));
    float facing = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = 0.02 + 0.98 * pow(1.0 - facing, 5.0);
    vec3 reflectedSky = skyReflection(reflect(-V, N));
    waterSurface = mix(waterBody, reflectedSky, fresnel);

    // A broad sun sheen, filtered by normal variance. Narrow unfiltered lobes
    // turn subpixel ripples into isolated white pixels, even with filtered waves.
    float sunAlignment = max(dot(N, normalize(L + V)), 0.0);
    float shininess = 64.0 / (1.0 + 64.0 * normalVariance);
    float glint = 0.18 * (shininess / 64.0) * pow(sunAlignment, shininess) +
                  0.025 * pow(sunAlignment, 8.0);
    waterSurface += vec3(1.0, 0.96, 0.86) * glint;

    // Thin water at a contact should retain a subtly darker substrate, not a
    // pale foam halo. We have no material information, so preserve its color
    // and texture rather than assuming concrete, vegetation, or breaking waves.
    // Unknown basemap depth, opaque water and unresolved contacts get no band.
    if (!isBasemap && visibility > 0.0 && waterDepth < shoreWidth && footprint < 20.0) {
      float contact = visibility * (1.0 - smoothstep(0.0, shoreWidth, waterDepth)) *
                      (1.0 - smoothstep(5.0, 20.0, footprint));
      // Use the substrate before scattering and keep any darker reflections.
      // Fade the reflected light quadratically near contact: a linear blend
      // still lets bright glints bleach dark surfaces under very shallow water.
      vec3 wetSurface = min(waterSurface, baseRgb * 0.85);
      float reflectedLight = 1.0 - contact;
      waterSurface = mix(wetSurface, waterSurface, reflectedLight * reflectedLight);
    }
  }

  vec3 straightRgb = mix(baseRgb, clamp(waterSurface, 0.0, 1.0), fogFactor);
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
    pixelRatio: 'f32',
    unitsPerMeter: 'f32',
    waveUnitsPerMeter: 'f32',
    waveOrigin: 'vec2<f32>',
    waveTime: 'f32',
    cameraHeight: 'f32',
    pattern: 'f32',
    rippleModifier: 'f32'
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
    pixelRatio: 1,
    unitsPerMeter: 1,
    waveUnitsPerMeter: 1,
    waveOrigin: [0, 0],
    waveTime: 0,
    cameraHeight: 0,
    pattern: 0,
    rippleModifier: 1
  },
  propTypes: {
    density: {value: 0.6, min: 0, max: 1},
    fogColor: {value: [230, 235, 242]},
    pattern: {value: 0, min: 0, max: 1},
    rippleModifier: {value: 1, min: 0, max: 1},
    fogHeight: {value: 0, private: true},
    fogThickness: {value: 0, private: true},
    invCol0: {value: [1, 0, 0, 0], private: true},
    invCol1: {value: [0, 1, 0, 0], private: true},
    invCol2: {value: [0, 0, 1, 0], private: true},
    invCol3: {value: [0, 0, 0, 1], private: true},
    viewportWidth: {value: 1, private: true},
    viewportHeight: {value: 1, private: true},
    pixelRatio: {value: 1, private: true},
    unitsPerMeter: {value: 1, private: true},
    waveUnitsPerMeter: {value: 1, private: true},
    waveOrigin: {value: [0, 0], private: true},
    waveTime: {value: 0, private: true},
    cameraHeight: {value: 0, private: true}
  }
} as const satisfies ShaderModule;

/**
 * Surface Fog / Water Effect — elevation-based ground-level fog or ocean overlay.
 *
 * When `pattern` is false the effect behaves as a classic flat-colour fog layer.
 * When `pattern` is true, a level water surface uses filtered wave normals,
 * view-dependent sky/sun reflections, depth absorption and subtle contact darkening.
 * In that mode `thickness` sets the underwater color and visibility transition.
 * Zero hides submerged geometry and disables depth shading at full density.
 * Geometry above the water surface is left unchanged.
 * Ripples follow the playback clock; paused frames and tiled exports are deterministic.
 */
export class DeckSurfaceFogEffect {
  id = 'surface-fog-effect';
  props: SurfaceFogRenderProps;
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
      rippleModifier: 1,
      rippleSpeed: 1,
      animationTimeMs: 0,
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

  setProps(props: Partial<SurfaceFogRenderProps>) {
    Object.assign(this.props, props);
  }

  private _unpatchViewports: (() => void) | null = null;

  preRender(opts?: any): void {
    if (this.isExportMode && opts) {
      this._unpatchViewports = patchTileViewportIds(opts);
    }
    resetDepthRange(this.model);
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
    let waveUnitsPerMeter = 1;
    let waveOrigin = [0, 0];
    let cameraHeight = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let pixelRatio = 1;

    if (params.viewports?.length > 0) {
      const viewport = params.viewports[0];

      viewportWidth = viewport.width;
      viewportHeight = viewport.height;
      if (Number.isFinite(viewportWidth) && viewportWidth > 0) {
        pixelRatio = Math.max(1, inputBuffer.width / viewportWidth);
      }
      if (Number.isFinite(viewport.cameraPosition?.[2])) {
        cameraHeight = viewport.cameraPosition[2];
      }

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

      // Remove Mercator's latitude scale for the wave field, so north/south
      // panning does not slide the pattern across the map. Elevations still use
      // the local meters-to-common-space conversion above.
      waveUnitsPerMeter = unitsPerMeterZ;
      if (Number.isFinite(viewport.latitude) && Math.abs(viewport.latitude) < 90) {
        waveUnitsPerMeter *= Math.cos((viewport.latitude * Math.PI) / 180);
      }

      // Subtract the origin in homogeneous coordinates using CPU doubles.
      // Subtracting it in GLSL would be too late: global XY has already lost
      // the fractional meters that distinguish neighboring pixels when zoomed in.
      const tileSize = WATER_ORIGIN_METERS * waveUnitsPerMeter;
      const center = viewport.center || [0, 0];
      if (pum) {
        waveOrigin = [
          Number.isFinite(center[0]) ? Math.floor(center[0] / tileSize) : 0,
          Number.isFinite(center[1]) ? Math.floor(center[1] / tileSize) : 0
        ];
        const originX = waveOrigin[0] * tileSize;
        const originY = waveOrigin[1] * tileSize;
        for (const column of [invCol0, invCol1, invCol2, invCol3]) {
          column[0] -= originX * column[3];
          column[1] -= originY * column[3];
        }
      }
    }

    const fogHeightCommon = this.props.height * unitsPerMeterZ;
    const fogThicknessCommon = this.props.thickness * unitsPerMeterZ;
    const rippleSpeed = Number.isFinite(this.props.rippleSpeed)
      ? Math.max(0, Math.min(5, this.props.rippleSpeed!))
      : 1;

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
        pixelRatio,
        unitsPerMeter: unitsPerMeterZ,
        waveUnitsPerMeter,
        waveOrigin,
        waveTime: Number.isFinite(this.props.animationTimeMs)
          ? (Math.max(0, this.props.animationTimeMs!) / 1000) * rippleSpeed
          : 0,
        cameraHeight,
        pattern: this.props.pattern ? 1.0 : 0.0,
        rippleModifier: Number.isFinite(this.props.rippleModifier)
          ? Math.max(0, Math.min(1, this.props.rippleModifier!))
          : 1
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
