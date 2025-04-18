// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform sampler2D uColormapTexture;
uniform int uHasCategoricalColors;
uniform int uCategoricalMinValue;
uniform int uCategoricalMaxValue;
uniform int uMaxPixelValue;

// Apply colormap texture given value
// Since the texture only varies in the x direction, setting v to 0.5 as a
// constant is fine
// Assumes the input range of value is -1 to 1
vec4 colormap(sampler2D cmap, vec4 image) {
  vec2 uv;
  if (uHasCategoricalColors == 1) {
    float step = float(uMaxPixelValue) / float(uCategoricalMaxValue - uCategoricalMinValue);
    uv = vec2(image.r * step, 0.5);
  } else {
    uv = vec2(0.5 * image.r + 0.5, 0.5);
  }
  vec4 color = texture2D(cmap, uv);
  if(color.a <= 0.0) discard;
  return color;
}
`;

function getUniforms(
  opts: {
    imageColormap?: Texture2D;
    minCategoricalBandValue?: number;
    maxCategoricalBandValue?: number;
    dataTypeMaxValue?: number;
    maxPixelValue?: number;
  } = {}
): GetUniformsOutput {
  const {
    imageColormap,
    minCategoricalBandValue,
    maxCategoricalBandValue,
    dataTypeMaxValue,
    maxPixelValue
  } = opts;

  if (!imageColormap) {
    return null;
  }

  const isSupportedDataType = Number.isFinite(dataTypeMaxValue);
  const isCategorical =
    isSupportedDataType &&
    Number.isFinite(maxPixelValue) &&
    Number.isFinite(minCategoricalBandValue) &&
    Number.isFinite(maxCategoricalBandValue);
  return {
    uColormapTexture: imageColormap,
    uHasCategoricalColors: isCategorical ? 1 : 0,
    uCategoricalMinValue: Number.isFinite(minCategoricalBandValue) ? minCategoricalBandValue : 0,
    uCategoricalMaxValue: Number.isFinite(maxCategoricalBandValue) ? maxCategoricalBandValue : 0,
    uMaxPixelValue: Number.isFinite(maxPixelValue) ? maxPixelValue : 0
  };
}

export const colormap: ShaderModule = {
  name: 'colormap',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = colormap(uColormapTexture, image);
    `
  }
};
