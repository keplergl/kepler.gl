// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

import {GetUniformsOutput, ShaderModule} from '../types';

// Brovey Method: Each resampled, multispectral pixel is
// multiplied by the ratio of the corresponding
// panchromatic pixel intensity to the sum of all the
// multispectral intensities.
// Original code from https://github.com/mapbox/rio-pansharpen
//
const fs1 = `\
uniform sampler2D bitmapTexturePan;
uniform float panWeight;

float pansharpen_brovey_ratio(vec4 rgb, float pan, float weight) {
  return pan / ((rgb.r + rgb.g + rgb.b * weight) / (2. + weight));
}

vec4 pansharpen_brovey_calc(vec4 rgb, float pan, float weight) {
  float ratio = pansharpen_brovey_ratio(rgb, pan, weight);
  return ratio * rgb;
}
`;

const fs2 = `\
precision mediump usampler2D;

#ifdef SAMPLER_TYPE
  uniform SAMPLER_TYPE bitmapTexturePan;
#else
  uniform sampler2D bitmapTexturePan;
#endif

uniform float panWeight;

float pansharpen_brovey_ratio(vec4 rgb, float pan, float weight) {
  return pan / ((rgb.r + rgb.g + rgb.b * weight) / (2. + weight));
}

vec4 pansharpen_brovey_calc(vec4 rgb, float pan, float weight) {
  float ratio = pansharpen_brovey_ratio(rgb, pan, weight);
  return ratio * rgb;
}
`;

function getUniforms(opts: {imagePan?: Texture2D; panWeight?: number} = {}): GetUniformsOutput {
  const {imagePan, panWeight = 0.2} = opts;

  if (!imagePan) {
    return null;
  }

  return {
    bitmapTexturePan: imagePan,
    panWeight
  };
}

export const pansharpenBrovey: ShaderModule = {
  name: 'pansharpen_brovey',
  fs1,
  fs2,
  defines: {
    SAMPLER_TYPE: 'sampler2D'
  },
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    float pan_band = float(texture2D(bitmapTexturePan, coord).r);
    image = pansharpen_brovey_calc(image, pan_band, panWeight);
    `
  }
};
