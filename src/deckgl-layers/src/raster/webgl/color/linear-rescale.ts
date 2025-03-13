// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform float linearRescaleScaler;
uniform float linearRescaleOffset;

// Perform a linear rescaling of image
vec4 linear_rescale(vec4 arr, float scaler, float offset) {
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
    linearRescaleScaler: Number.isFinite(linearRescaleScaler) ? linearRescaleScaler : 1,
    linearRescaleOffset: Number.isFinite(linearRescaleOffset) ? linearRescaleOffset : 0
  };
}

export const linearRescale: ShaderModule = {
  name: 'linear_rescale',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = linear_rescale(image, linearRescaleScaler, linearRescaleOffset);
    `
  }
};
