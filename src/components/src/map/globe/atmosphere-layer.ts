// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Shaders ported from iTowns, based on Sean O'Neil's approach in GPU Gems 2
// SEE: https://github.com/iTowns/itowns/blob/master/src/Core/Prefab/Globe/Atmosphere.js
// SEE: https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {SphereGeometry} from '@luma.gl/engine';
import {toRadians, Vector3} from '@math.gl/core';
import {getSunPosition} from '@math.gl/sun';
import type {GlobeConfig} from '@kepler.gl/constants';

const angleToVec = (angle: number) => {
  return [Math.sin(angle), Math.cos(angle), 0];
};

const angleToSunPos = (angle: number) => {
  return new Vector3(angleToVec(angle)).normalize();
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

const [lon, lat] = [0, 90];
const sunPosNow = getSunPosition(Date.now(), lat, lon);
const v3SunPosNow = angleToSunPos(sunPosNow.azimuth + Math.PI);

const NUM_SAMPLE_RAYS = 3;

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

export class AtmosphereLayerRealistic extends SimpleMeshLayer<any, any> {
  draw({uniforms}: {uniforms: any}): void {
    const {config} = this.props as any;

    super.draw({
      uniforms: {
        ...uniforms,
        ...ATMOSPHERE_UNIFORMS,
        fTerminatorOpacityFactor: config.terminator ? config.terminatorOpacity : 0,
        v3SunPos: config.azimuth ? angleToSunPos(toRadians(config.azimuthAngle)) : v3SunPosNow
      }
    });
  }

  getShaders(): any {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          varying vec3 v3CameraPos;
        `,
        'vs:#main-start': `
          v3CameraPos = project_uCameraPosition;
        `,
        'fs:#decl': `
          varying vec3 v3CameraPos;
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

          const int nSamples = ${NUM_SAMPLE_RAYS};

          float scale(float fCos) {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.8 + x*5.25))));
          }
        `,
        'fs:#main-end': `
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
        `,
        'fs:DECKGL_FILTER_COLOR': ``
      }
    };
  }
}

export class AtmosphereSkyLayerRealistic extends SimpleMeshLayer<any, any> {
  draw({uniforms}: {uniforms: any}): void {
    const {config} = this.props as any;

    super.draw({
      uniforms: {
        ...uniforms,
        ...ATMOSPHERE_UNIFORMS,
        v3SunPos: config.azimuth ? angleToSunPos(toRadians(config.azimuthAngle)) : v3SunPosNow
      }
    });
  }

  getShaders(): any {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          varying vec3 v3CameraPos;
        `,
        'vs:#main-start': `
          v3CameraPos = project_uCameraPosition;
        `,
        'fs:#decl': `
          varying vec3 v3CameraPos;
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
        `,
        'fs:DECKGL_FILTER_COLOR': ``
      }
    };
  }
}

const ATMOSPHERE_PARAMETERS = {
  depthWriteEnabled: false,
  depthCompare: 'always' as const,
  blend: true,
  blendColorSrcFactor: 'src-alpha' as const,
  blendColorDstFactor: 'one-minus-src-alpha' as const,
  blendAlphaSrcFactor: 'one' as const,
  blendAlphaDstFactor: 'one-minus-src-alpha' as const,
  blendColorOperation: 'add' as const,
  blendAlphaOperation: 'add' as const
};

const ATMOSPHERE_SKY_PARAMETERS = {
  cullMode: 'front' as const,
  depthWriteEnabled: false,
  blend: true,
  blendColorSrcFactor: 'src-alpha' as const,
  blendColorDstFactor: 'one-minus-src-alpha' as const,
  blendAlphaSrcFactor: 'one' as const,
  blendAlphaDstFactor: 'one-minus-src-alpha' as const,
  blendColorOperation: 'add' as const,
  blendAlphaOperation: 'add' as const
};

export const getGlobeAtmosphereLayer = ({config}: {config: GlobeConfig}): any => {
  return new AtmosphereLayerRealistic({
    id: 'atmosphere',
    data: [[0, 0, 0]],
    config,
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: (d: any) => d,
    getColor: [0, 0, 0],
    mesh: GLOBE_MESH_INNER,
    pickable: false,
    parameters: ATMOSPHERE_PARAMETERS
  } as any);
};

export const getGlobeAtmosphereSkyLayer = ({config}: {config: GlobeConfig}): any => {
  return new AtmosphereSkyLayerRealistic({
    id: 'atmosphere-sky',
    data: [[0, 0, 0]],
    config,
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: (d: any) => d,
    getColor: [0, 0, 0],
    mesh: GLOBE_MESH_OUTER,
    pickable: false,
    parameters: ATMOSPHERE_SKY_PARAMETERS
  } as any);
};
