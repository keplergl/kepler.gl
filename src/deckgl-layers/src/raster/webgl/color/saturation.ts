// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

/**
 * Adjusts the saturation of a color.
 * From cesium:
 * https://github.com/CesiumGS/cesium/blob/master/Source/Shaders/Builtin/Functions/saturation.glsl
 *
 * @param {vec3} rgb The color.
 * @param {float} adjustment The amount to adjust the saturation of the color. Usually between 0 and 2.
 *
 * @returns {vec3} The color with the saturation adjusted.
 */
const fs = `\
uniform float uSaturationValue;
vec3 saturate(vec3 rgb, float adjustment) {
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
`;

function getUniforms(opts: {saturationValue?: number} = {}): GetUniformsOutput {
  const {saturationValue} = opts;

  if (!saturationValue) {
    return null;
  }

  return {
    uSaturationValue: Number.isFinite(saturationValue) ? saturationValue : 1
  };
}

export const saturation: ShaderModule = {
  name: 'saturation',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = vec4(saturate(image.rgb, uSaturationValue), image.a);
    `
  }
};
