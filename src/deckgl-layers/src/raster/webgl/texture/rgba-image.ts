// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

import {GetUniformsOutput, ShaderModule} from '../types';

function getUniforms(opts: {imageRgba?: Texture2D} = {}): GetUniformsOutput {
  const {imageRgba} = opts;

  if (!imageRgba) {
    return null;
  }

  return {
    bitmapTextureRgba: imageRgba
  };
}

const fs1 = `\
uniform sampler2D bitmapTextureRgba;
`;

const fs2 = `\
precision mediump float;
precision mediump int;
precision mediump usampler2D;

#ifdef SAMPLER_TYPE
  uniform SAMPLER_TYPE bitmapTextureRgba;
#else
  uniform sampler2D bitmapTextureRgba;
#endif
`;

export const rgbaImage: ShaderModule = {
  name: 'rgba-image',
  fs1,
  fs2,
  getUniforms,
  defines: {
    SAMPLER_TYPE: 'sampler2D'
  },
  inject: {
    'fs:DECKGL_CREATE_COLOR': `
    image = vec4(texture2D(bitmapTextureRgba, coord));
    if (image.a < 0.5) {
      discard;
    }
    `
  }
};
