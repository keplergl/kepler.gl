// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

import {GetUniformsOutput, ShaderModule} from '../types';

const inf = Math.pow(2, 62);

function getUniforms(
  opts: {imageMask?: Texture2D; maskKeepMin?: number; maskKeepMax?: number} = {}
): GetUniformsOutput {
  const {imageMask, maskKeepMin, maskKeepMax} = opts;
  if (!imageMask) {
    return null;
  }

  return {
    bitmapTextureMask: imageMask,
    uMaskKeepMin: Number.isFinite(maskKeepMin) ? maskKeepMin : -inf,
    uMaskKeepMax: Number.isFinite(maskKeepMax) ? maskKeepMax : inf
  };
}

const fs1 = `\
uniform sampler2D bitmapTextureMask;
uniform float uMaskKeepMin;
uniform float uMaskKeepMax;
`;

const fs2 = `\
precision mediump float;
precision mediump int;
precision mediump usampler2D;

#ifdef SAMPLER_TYPE
  uniform SAMPLER_TYPE bitmapTextureMask;
#else
  uniform sampler2D bitmapTextureMask;
#endif

uniform float uMaskKeepMin;
uniform float uMaskKeepMax;
`;

const mask: ShaderModule = {
  name: 'mask-image',
  fs1,
  fs2,
  getUniforms,
  defines: {
    SAMPLER_TYPE: 'sampler2D'
  },
  inject: {
    'fs:DECKGL_CREATE_COLOR': `
    float mask_value = float(texture2D(bitmapTextureMask, coord).r);
    if (mask_value < uMaskKeepMin) discard;
    if (mask_value > uMaskKeepMax) discard;
    `
  }
};

export const maskFloat: ShaderModule = {
  ...mask,
  name: 'mask-image-float'
};
export const maskUint: ShaderModule = {
  ...mask,
  name: 'mask-image-uint',
  defines: {
    SAMPLER_TYPE: 'usampler2D'
  }
};
export const maskInt: ShaderModule = {
  ...mask,
  name: 'mask-image-int',
  defines: {
    SAMPLER_TYPE: 'isampler2D'
  }
};
