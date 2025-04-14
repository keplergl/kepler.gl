// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

import {GetUniformsOutput, ShaderModule} from '../types';

function getUniforms(opts: {imageBands?: Texture2D[]} = {}): GetUniformsOutput {
  const {imageBands} = opts;

  if (!imageBands || imageBands.length === 0) {
    return null;
  }

  const [bitmapTextureR, bitmapTextureG, bitmapTextureB, bitmapTextureA] = imageBands;

  // return default values to prevent deck.gl validation warnings.
  // Note: all bands must be set for the shadow effect to work as expected.
  return {
    bitmapTextureR: bitmapTextureR || bitmapTextureR,
    bitmapTextureG: bitmapTextureG || bitmapTextureR,
    bitmapTextureB: bitmapTextureB || bitmapTextureR,
    bitmapTextureA: bitmapTextureA || bitmapTextureR
  };
}

const fs1 = `\
uniform sampler2D bitmapTextureR;
uniform sampler2D bitmapTextureG;
uniform sampler2D bitmapTextureB;
uniform sampler2D bitmapTextureA;
`;

const fs2 = `\
precision mediump float;
precision mediump int;
precision mediump usampler2D;

#ifdef SAMPLER_TYPE
  uniform SAMPLER_TYPE bitmapTextureR;
  uniform SAMPLER_TYPE bitmapTextureG;
  uniform SAMPLER_TYPE bitmapTextureB;
  uniform SAMPLER_TYPE bitmapTextureA;
#else
  uniform sampler2D bitmapTextureR;
  uniform sampler2D bitmapTextureG;
  uniform sampler2D bitmapTextureB;
  uniform sampler2D bitmapTextureA;
#endif
`;

const combineBands: ShaderModule = {
  name: 'combine-bands',
  fs1,
  fs2,
  getUniforms,
  defines: {
    SAMPLER_TYPE: 'sampler2D'
  },
  inject: {
    'fs:DECKGL_CREATE_COLOR': `
    float channel1 = float(texture2D(bitmapTextureR, coord).r);
    float channel2 = float(texture2D(bitmapTextureG, coord).r);
    float channel3 = float(texture2D(bitmapTextureB, coord).r);
    float channel4 = float(texture2D(bitmapTextureA, coord).r);

    image = vec4(channel1, channel2, channel3, channel4);
    `
  }
};

export const combineBandsFloat: ShaderModule = {
  ...combineBands,
  name: 'combine-bands-float'
};
export const combineBandsUint: ShaderModule = {
  ...combineBands,
  name: 'combine-bands-uint',
  defines: {
    SAMPLER_TYPE: 'usampler2D'
  }
};
export const combineBandsInt: ShaderModule = {
  ...combineBands,
  name: 'combine-bands-int',
  defines: {
    SAMPLER_TYPE: 'isampler2D'
  }
};
