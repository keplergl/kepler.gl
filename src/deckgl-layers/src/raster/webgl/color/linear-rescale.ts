// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform linear_rescaleUniforms {
  float scaler;
  float offset;
} linear_rescale;

// Perform a linear rescaling of image
vec4 linear_rescale_fn(vec4 arr, float scaler, float offset) {
  return arr * scaler + offset;
}
`;

function getUniforms(
  opts: {linearRescaleScaler?: number; linearRescaleOffset?: number} = {}
): GetUniformsOutput {
  const {linearRescaleScaler, linearRescaleOffset} = opts;

  if (!Number.isFinite(linearRescaleScaler) && !Number.isFinite(linearRescaleOffset)) {
    return null;
  }

  return {
    scaler: Number.isFinite(linearRescaleScaler) ? linearRescaleScaler : 1,
    offset: Number.isFinite(linearRescaleOffset) ? linearRescaleOffset : 0
  };
}

export const linearRescale: ShaderModule = {
  name: 'linear_rescale',
  fs,
  uniformTypes: {
    scaler: 'f32',
    offset: 'f32'
  },
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = linear_rescale_fn(image, linear_rescale.scaler, linear_rescale.offset);
    `
  }
};
