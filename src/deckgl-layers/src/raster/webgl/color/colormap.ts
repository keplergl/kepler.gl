// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Texture} from '@luma.gl/core';
import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform sampler2D uColormapTexture;

uniform colormapUniforms {
  int hasCategoricalColors;
  int categoricalMinValue;
  int categoricalMaxValue;
  int maxPixelValue;
} colormap;

// Apply colormap texture given value
// Since the texture only varies in the x direction, setting v to 0.5 as a
// constant is fine
// Assumes the input range of value is -1 to 1
vec4 colormapApply(sampler2D cmap, vec4 image) {
  vec2 uv;
  if (colormap.hasCategoricalColors == 1) {
    float step = float(colormap.maxPixelValue) / float(colormap.categoricalMaxValue - colormap.categoricalMinValue);
    uv = vec2(image.r * step, 0.5);
  } else {
    uv = vec2(0.5 * image.r + 0.5, 0.5);
  }
  vec4 color = texture(cmap, uv);
  if(color.a <= 0.0) discard;
  return color;
}
`;

function getUniforms(
  opts: {
    imageColormap?: Texture;
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
    hasCategoricalColors: isCategorical ? 1 : 0,
    categoricalMinValue: Number.isFinite(minCategoricalBandValue) ? minCategoricalBandValue : 0,
    categoricalMaxValue: Number.isFinite(maxCategoricalBandValue) ? maxCategoricalBandValue : 0,
    maxPixelValue: Number.isFinite(maxPixelValue) ? maxPixelValue : 0
  };
}

export const colormap: ShaderModule = {
  name: 'colormap',
  fs,
  uniformTypes: {
    hasCategoricalColors: 'i32',
    categoricalMinValue: 'i32',
    categoricalMaxValue: 'i32',
    maxPixelValue: 'i32'
  },
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = colormapApply(uColormapTexture, image);
    `
  }
};
