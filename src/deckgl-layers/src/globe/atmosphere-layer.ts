// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Shaders ported from iTowns, based on Sean O'Neil's approach in GPU Gems 2
// SEE: https://github.com/iTowns/itowns/blob/master/src/Core/Prefab/Globe/Atmosphere.js
// SEE: https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {SphereGeometry} from '@luma.gl/engine';
import {Vector3} from '@math.gl/core';
import {getSunPosition} from '@math.gl/sun';

import {DEFAULT_GLOBE_CONFIG, type GlobeConfig} from '@kepler.gl/constants';

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const angleToVec = (angle: number): [number, number, number] => {
  return [Math.sin(angle), Math.cos(angle), 0];
};

const angleToSunPos = (angle: number): number[] => {
  return new Vector3(angleToVec(angle)).normalize() as unknown as number[];
};

const GLOBE_MESH_INNER = new SphereGeometry({
  radius: 6.4e6,
  nlat: 100,
  nlong: 100
});

const GLOBE_MESH_OUTER = new SphereGeometry({
  radius: 6.7e6,
  nlat: 100,
  nlong: 100
});

// ~14% larger than the globe surface mesh — yields a thick soft aura (~0.1–0.15R).
const GLOBE_MESH_HUGE_HALO = new SphereGeometry({
  radius: 7.3e6,
  nlat: 100,
  nlong: 100
});

const [lon, lat] = [0, 90];
const sunPosNow = getSunPosition(Date.now(), lat, lon);
const v3SunPosNow = angleToSunPos(sunPosNow.azimuth + Math.PI);

const NUM_SAMPLE_RAYS = 3;

/**
 * Zoom range over which the atmosphere effect fades out.
 * Below ATMOSPHERE_FADE_ZOOM_START the effect is fully visible.
 * Above ATMOSPHERE_FADE_ZOOM_END the effect is completely hidden.
 */
const ATMOSPHERE_FADE_ZOOM_START = 3.5;
const ATMOSPHERE_FADE_ZOOM_END = 6;

/**
 * Convert a mapState zoom level to a [0, 1] atmosphere opacity multiplier.
 * Returns 1 (fully visible) below ATMOSPHERE_FADE_ZOOM_START, smoothly
 * interpolates to 0 between the two thresholds, and returns 0 above
 * ATMOSPHERE_FADE_ZOOM_END.
 */
export function atmosphereZoomFade(zoom: number): number {
  if (zoom <= ATMOSPHERE_FADE_ZOOM_START) return 1;
  if (zoom >= ATMOSPHERE_FADE_ZOOM_END) return 0;
  const t = (zoom - ATMOSPHERE_FADE_ZOOM_START) / (ATMOSPHERE_FADE_ZOOM_END - ATMOSPHERE_FADE_ZOOM_START);
  // Smooth-step for a perceptually gentle transition.
  return 1 - t * t * (3 - 2 * t);
}

const ATMOSPHERE_UNIFORMS = {
  v3SunPos: v3SunPosNow,
  exposure: 2,
  fSamples: 3,
  g: -0.65,
  fKrESun: 0.00025 * 20,
  fKmESun: 0.0001 * 20,
  fKr4PI: 0.00025 * 4 * Math.PI,
  fKm4PI: 0.0001 * 4 * Math.PI,
  fScaleDepth: 0.25,
  fInnerRadius: 258,
  fOuterRadius: 265,
  fTerminatorAttenuateFactor: 0.8,
  fTerminatorOpacityFactor: 1
};

type AtmosphereLayerProps = {
  config: GlobeConfig;
  /** Pre-computed [0, 1] zoom-fade multiplier; 1 = fully visible, 0 = hidden. */
  zoomFade: number;
};

export class AtmosphereLayerRealistic extends SimpleMeshLayer<any, AtmosphereLayerProps> {
  static layerName = 'AtmosphereLayerRealistic';

  draw({uniforms}: {uniforms: object}): void {
    const {config, zoomFade} = this.props;
    const model = this.state.model;
    if (model) {
      (model as any).props.uniforms = {
        ...(model as any).props.uniforms,
        ...ATMOSPHERE_UNIFORMS,
        fTerminatorOpacityFactor: config.terminator ? config.terminatorOpacity : 0,
        v3SunPos: config.azimuth ? angleToSunPos(toRadians(config.azimuthAngle)) : v3SunPosNow,
        fAtmosphereZoomFade: zoomFade
      };
    }
    super.draw({uniforms});
  }

  getShaders(): any {
    return {
      ...super.getShaders(),
      inject: {
        'fs:#decl': `
          uniform vec3 v3SunPos;

          uniform float g;
          uniform float exposure;

          uniform float fSamples;

          uniform float fInnerRadius;
          uniform float fOuterRadius;
          uniform float fKrESun;
          uniform float fKmESun;
          uniform float fKr4PI;
          uniform float fKm4PI;
          uniform float fScaleDepth;

          uniform float fTerminatorAttenuateFactor;
          uniform float fTerminatorOpacityFactor;
          uniform float fAtmosphereZoomFade;

          const int nSamples = ${NUM_SAMPLE_RAYS};

          float scale(float fCos) {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.8 + x*5.25))));
          }
        `,
        'fs:#main-end': `
          vec3 v3CameraPos = cameraPosition;
          vec3 v3Pos = position_commonspace.xyz;

          float g2 = g * g;

          vec3 v3InvWavelength = vec3(1.0 / pow(0.650, 4.0), 1.0 / pow(0.570, 4.0), 1.0 / pow(0.475, 4.0));

          float fInnerRadius2 = fInnerRadius * fInnerRadius;
          float fOuterRadius2 = fOuterRadius * fOuterRadius;
          float fScale = 1.0 / (fOuterRadius - fInnerRadius);
          float fScaleOverScaleDepth = 1.0 / (fOuterRadius - fInnerRadius) / fScaleDepth;

          float cameraHeight2 = length(v3CameraPos) * length(v3CameraPos);

          vec3 v3Ray = v3Pos - v3CameraPos;
          float fFar = length(v3Ray);
          v3Ray /= fFar;

          float B = 2.0 * dot(v3CameraPos, v3Ray);
          float C = cameraHeight2 - fOuterRadius2;
          float fDet = max(0.0, B*B - 4.0 * C);
          float fNear = 0.5 * (-B - sqrt(fDet));

          vec3 v3Start = v3CameraPos + v3Ray * fNear;
          fFar -= fNear;

          float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);
          float fCameraAngle = dot(-v3Ray, v3Pos) / length(v3Pos);
          float fLightAngle = dot(v3SunPos, v3Pos) / length(v3Pos);
          float fCameraScale = scale(fCameraAngle);
          float fLightScale = scale(fLightAngle);
          float fCameraOffset = fDepth*fCameraScale;
          float fTemp = (fLightScale + fCameraScale);

          float fSampleLength = fFar / fSamples;
          float fScaledLength = fSampleLength * fScale;
          vec3 v3SampleRay = v3Ray * fSampleLength;
          vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

          vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
          vec3 v3Attenuate = vec3(0.0, 0.0, 0.0);
          for(int i=0; i<nSamples; i++)
          {
              float fHeight = length(v3SamplePoint);
              float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
              float fScatter = fDepth*fTemp - fCameraOffset;
              v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
              v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
              v3SamplePoint += v3SampleRay;
          }

          vec3 c0 = v3Attenuate;
          vec3 c1 = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);

          fragColor = vec4(c1, 1.0 - c0 * fTerminatorAttenuateFactor);
          fragColor.a *= fTerminatorOpacityFactor;

          // Keep the day hemisphere completely unshaded — the attenuation-based
          // alpha above is non-zero even at noon, which slightly darkens the lit
          // side. Gate it with a day/night mask so darkening only appears across
          // the terminator and onto the night side.
          // fLightAngle = dot(sunDir, surfaceNormal): +1 at the subsolar point
          // (noon), 0 at the terminator, -1 at midnight. smoothstep maps the day
          // side (>= 0.2) to 0 (no darkening), ramps through the terminator, and
          // reaches full darkening on the night side (<= -0.2).
          float fNightMask = smoothstep(0.2, -0.2, fLightAngle);
          fragColor.a *= fNightMask;

          // Fade out the entire day/night shading effect as the user zooms in.
          // At zoom levels above ATMOSPHERE_FADE_ZOOM_END the effect is invisible,
          // so it doesn't obscure map detail at street/city scale.
          fragColor.a *= fAtmosphereZoomFade;
        `,
        'fs:DECKGL_FILTER_COLOR': ``
      }
    };
  }
}

export class AtmosphereSkyLayerRealistic extends SimpleMeshLayer<any, AtmosphereLayerProps> {
  static layerName = 'AtmosphereSkyLayerRealistic';

  draw({uniforms}: {uniforms: object}): void {
    const {config, zoomFade} = this.props;
    const model = this.state.model;
    if (model) {
      (model as any).props.uniforms = {
        ...(model as any).props.uniforms,
        ...ATMOSPHERE_UNIFORMS,
        v3SunPos: config.azimuth ? angleToSunPos(toRadians(config.azimuthAngle)) : v3SunPosNow,
        fAtmosphereZoomFade: zoomFade
      };
    }
    super.draw({uniforms});
  }

  getShaders(): any {
    return {
      ...super.getShaders(),
      inject: {
        'fs:#decl': `
          uniform vec3 v3SunPos;

          uniform float g;
          uniform float exposure;

          uniform float fSamples;

          uniform float fInnerRadius;
          uniform float fOuterRadius;
          uniform float fKrESun;
          uniform float fKmESun;
          uniform float fKr4PI;
          uniform float fKm4PI;
          uniform float fScaleDepth;
          uniform float fAtmosphereZoomFade;

          const int nSamples = ${NUM_SAMPLE_RAYS};

          float scale(float fCos) {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.8 + x*5.25))));
          }

          float getMiePhase(float fCos, float fCos2, float g, float g2) {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0 * g * fCos, 1.5);
          }

          float getRayleighPhase(float fCos2) {
            return 0.75 + 0.75 * fCos2;
          }
        `,
        'fs:#main-end': `
          vec3 v3CameraPos = cameraPosition;
          vec3 v3Pos = position_commonspace.xyz;

          float g2 = g * g;

          vec3 v3InvWavelength = vec3(1.0 / pow(0.650, 4.0), 1.0 / pow(0.570, 4.0), 1.0 / pow(0.475, 4.0));

          float fInnerRadius2 = fInnerRadius * fInnerRadius;
          float fOuterRadius2 = fOuterRadius * fOuterRadius;
          float fScale = 1.0 / (fOuterRadius - fInnerRadius);
          float fScaleOverScaleDepth = 1.0 / (fOuterRadius - fInnerRadius) / fScaleDepth;

          float cameraHeight2 = length(v3CameraPos) * length(v3CameraPos);

          vec3 v3Ray = v3Pos - v3CameraPos;
          float fFar = length(v3Ray);
          v3Ray /= fFar;

          float B = 2.0 * dot(v3CameraPos, v3Ray);
          float C = cameraHeight2 - fOuterRadius2;
          float fDet = max(0.0, B*B - 4.0 * C);
          float fNear = 0.5 * (-B - sqrt(fDet));

          vec3 v3Start = v3CameraPos + v3Ray * fNear;
          fFar -= fNear;
          float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius;
          float fStartDepth = exp(-1.0 / fScaleDepth);
          float fStartOffset = fStartDepth * scale(fStartAngle);

          float fSampleLength = fFar / fSamples;
          float fScaledLength = fSampleLength * fScale;
          vec3 v3SampleRay = v3Ray * fSampleLength;
          vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

          vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
          for(int i=0; i<nSamples; i++)
          {
            float fHeight = length(v3SamplePoint);
            float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
            float fLightAngle = dot(v3SunPos, v3SamplePoint) / fHeight;
            float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
            float fScatter = (fStartOffset + fDepth * (scale(fLightAngle) - scale(fCameraAngle)));
            vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));

            v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
            v3SamplePoint += v3SampleRay;
          }

          vec3 c0 = v3FrontColor * (v3InvWavelength * fKrESun);
          vec3 c1 = v3FrontColor * fKmESun;

          vec3 v3Direction = v3CameraPos - v3Pos;

          float fCos = dot(v3SunPos, v3Direction) / length(v3Direction);
          float fCos2 = fCos * fCos;

          vec3 skyColor = getRayleighPhase(fCos2) * c0 + getMiePhase(fCos, fCos2, g, g2) * c1;

          fragColor = vec4(skyColor, 1.0);
          fragColor.a = fragColor.b;

          // Fade the sky halo out as the user zooms in past continent scale.
          fragColor.a *= fAtmosphereZoomFade;
        `,
        'fs:DECKGL_FILTER_COLOR': ``
      }
    };
  }
}

const ATMOSPHERE_PARAMETERS = {
  depthTest: false,
  blendFunc: [0x0302, 0x0303, 1, 0x0303], // SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ONE, ONE_MINUS_SRC_ALPHA
  blendEquation: [0x8006, 0x8006] // FUNC_ADD
};

const ATMOSPHERE_SKY_PARAMETERS = {
  cullFace: 0x0404, // GL.FRONT
  depthMask: false,
  blendFunc: [0x0302, 0x0303, 1, 0x0303],
  blendEquation: [0x8006, 0x8006]
};

/**
 * Soft, sun-independent glow. Radii are in deck.gl common space
 * (GLOBE_COMMON_RADIUS = 256; atmosphere uses ~258 as a slight fudge).
 * Outer ≈ 14% larger than inner at radius multiplier = 1 (matches the base mesh).
 */
const HUGE_HALO_INNER_RADIUS = 258;
const HUGE_HALO_BASE_OUTER_RADIUS = 294;
const HUGE_HALO_BASE_SHELL = HUGE_HALO_BASE_OUTER_RADIUS - HUGE_HALO_INNER_RADIUS;
/** Matches the Halo Radius slider max; higher values can produce a black-disc artifact. */
const HUGE_HALO_RADIUS_MAX = 3.5;

const HUGE_HALO_UNIFORMS = {
  fInnerRadius: HUGE_HALO_INNER_RADIUS,
  // Soft cyan matching the reference huge-halo look.
  v3HaloColor: [0.45, 0.72, 1.0],
  fHaloIntensity: 1.0
};

const HUGE_HALO_PARAMETERS = {
  cullFace: 0x0404, // GL.FRONT
  depthMask: false,
  // Large shells often enclose the camera; disable depth so the ring still draws.
  depthTest: false,
  blendFunc: [0x0302, 0x0303, 1, 0x0303], // SRC_ALPHA, ONE_MINUS_SRC_ALPHA
  blendEquation: [0x8006, 0x8006]
};

function resolveHugeHaloRadius(config: GlobeConfig): number {
  const multiplier = Number.isFinite(config.hugeHaloRadius)
    ? (config.hugeHaloRadius as number)
    : DEFAULT_GLOBE_CONFIG.hugeHaloRadius;
  // Scale shell thickness; keep outer above the planet surface.
  return (
    HUGE_HALO_INNER_RADIUS +
    HUGE_HALO_BASE_SHELL * Math.max(Math.min(multiplier, HUGE_HALO_RADIUS_MAX), 0.05)
  );
}

function resolveHugeHaloOpacity(config: GlobeConfig): number {
  const opacity = Number.isFinite(config.hugeHaloOpacity)
    ? (config.hugeHaloOpacity as number)
    : DEFAULT_GLOBE_CONFIG.hugeHaloOpacity;
  return Math.max(0, Math.min(1, opacity));
}

/**
 * View-independent atmosphere: a large uniform emissive aura around the globe.
 * Unlike AtmosphereSkyLayerRealistic, this ignores sun direction and uses a
 * linear radial falloff through a thick shell (max at the surface → 0 at outer radius).
 */
export class AtmosphereHugeHaloLayer extends SimpleMeshLayer<any, AtmosphereLayerProps> {
  static layerName = 'AtmosphereHugeHaloLayer';

  draw({uniforms}: {uniforms: object}): void {
    const {config, zoomFade} = this.props;
    const model = this.state.model;
    if (model) {
      (model as any).props.uniforms = {
        ...(model as any).props.uniforms,
        ...HUGE_HALO_UNIFORMS,
        fHaloOpacity: resolveHugeHaloOpacity(config),
        fAtmosphereZoomFade: zoomFade
      };
    }
    super.draw({uniforms});
  }

  getShaders(): any {
    return {
      ...super.getShaders(),
      inject: {
        'fs:#decl': `
          uniform float fInnerRadius;
          uniform vec3 v3HaloColor;
          uniform float fHaloIntensity;
          uniform float fHaloOpacity;
          uniform float fAtmosphereZoomFade;
        `,
        'fs:#main-end': `
          vec3 v3CameraPos = cameraPosition;
          vec3 v3Pos = position_commonspace.xyz;
          // Outer radius from the actual mesh vertex so sizeScale stays in sync.
          float fOuterRadius = length(v3Pos);
          vec3 v3Ray = normalize(v3Pos - v3CameraPos);

          // Impact parameter of the view ray (perpendicular distance from globe
          // center to the ray). Stable when the camera is inside the outer shell,
          // unlike near/far sphere-intersection math which breaks in that case
          // and produced a black disc at high radius multipliers.
          float fDMin = length(cross(v3CameraPos, v3Ray));

          // Linear falloff in the annulus only: max at the surface, zero at outer.
          float fShell = max(fOuterRadius - fInnerRadius, 0.0001);
          float fGlow = 0.0;
          if (fDMin >= fInnerRadius && fDMin < fOuterRadius) {
            float t = (fDMin - fInnerRadius) / fShell;
            fGlow = 1.0 - t;
          }

          fGlow *= fHaloIntensity;

          // Straight alpha (not premultiplied) for SRC_ALPHA blending.
          fragColor = vec4(v3HaloColor, fGlow * fHaloOpacity);
          fragColor.a *= fAtmosphereZoomFade;
        `,
        'fs:DECKGL_FILTER_COLOR': ``
      }
    };
  }
}

export const getGlobeAtmosphereLayer = ({config, zoom}: {config: GlobeConfig; zoom?: number}) => {
  const zoomFade = atmosphereZoomFade(zoom ?? 0);
  return new AtmosphereLayerRealistic({
    id: 'atmosphere',
    data: [[0, 0, 0]],
    config,
    zoomFade,
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: ((d: number[]) => d) as any,
    getColor: [0, 0, 0],
    mesh: GLOBE_MESH_INNER,
    parameters: ATMOSPHERE_PARAMETERS
  });
};

/** Realistic sun-lit scattering sky halo (thin limb glow). */
export const getGlobeAtmosphereSkyLayer = ({config, zoom}: {config: GlobeConfig; zoom?: number}) => {
  const zoomFade = atmosphereZoomFade(zoom ?? 0);
  return new AtmosphereSkyLayerRealistic({
    id: 'atmosphere-sky',
    data: [[0, 0, 0]],
    config,
    zoomFade,
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: ((d: number[]) => d) as any,
    getColor: [0, 0, 0],
    mesh: GLOBE_MESH_OUTER,
    parameters: ATMOSPHERE_SKY_PARAMETERS
  });
};

/**
 * Large uniform glow drawn in addition to the realistic sky halo when
 * `config.hugeHalo` is enabled. Returns null when disabled.
 */
export const getGlobeHugeHaloLayer = ({config, zoom}: {config: GlobeConfig; zoom?: number}) => {
  if (!config.hugeHalo) {
    return null;
  }
  const zoomFade = atmosphereZoomFade(zoom ?? 0);
  const outerRadius = resolveHugeHaloRadius(config);
  // Keep mesh extent in sync with the desired outer radius (base mesh = default outer).
  const sizeScale = outerRadius / HUGE_HALO_BASE_OUTER_RADIUS;
  return new AtmosphereHugeHaloLayer({
    id: 'atmosphere-huge-halo',
    data: [[0, 0, 0]],
    config,
    zoomFade,
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: ((d: number[]) => d) as any,
    getColor: [0, 0, 0],
    mesh: GLOBE_MESH_HUGE_HALO,
    sizeScale,
    parameters: HUGE_HALO_PARAMETERS
  });
};
