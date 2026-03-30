// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Texture} from '@luma.gl/core';
import {GetUniformsOutput, ShaderModule} from '../types';

const inf = Math.pow(2, 62);

function getUniforms(
  opts: {imageMask?: Texture; maskKeepMin?: number; maskKeepMax?: number} = {}
): GetUniformsOutput {
  const {imageMask, maskKeepMin, maskKeepMax} = opts;
  if (!imageMask) {
    return null;
  }

  return {
    bitmapTextureMask: imageMask,
    keepMin: Number.isFinite(maskKeepMin) ? maskKeepMin : -inf,
    keepMax: Number.isFinite(maskKeepMax) ? maskKeepMax : inf
  };
}

const maskUniformTypes = {
  keepMin: 'f32',
  keepMax: 'f32'
};

function makeMaskModule(name: string, samplerType: string): ShaderModule {
  const blockDecl = `\
uniform ${name}Uniforms {
  float keepMin;
  float keepMax;
} ${name};
`;

  const fs1 = `\
uniform sampler2D bitmapTextureMask;
${blockDecl}
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

${blockDecl}
`;

  return {
    name,
    fs1,
    fs2,
    uniformTypes: maskUniformTypes,
    getUniforms,
    defines: {
      SAMPLER_TYPE: samplerType
    },
    inject: {
      'fs:DECKGL_CREATE_COLOR': `
    float mask_value = float(texture(bitmapTextureMask, coord).r);
    if (mask_value < ${name}.keepMin) discard;
    if (mask_value > ${name}.keepMax) discard;
    `
    }
  };
}

export const maskFloat: ShaderModule = makeMaskModule('mask_image_float', 'sampler2D');
export const maskUint: ShaderModule = makeMaskModule('mask_image_uint', 'usampler2D');
export const maskInt: ShaderModule = makeMaskModule('mask_image_int', 'isampler2D');
