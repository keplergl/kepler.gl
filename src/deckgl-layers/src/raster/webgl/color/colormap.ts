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
  float inputScale;
  float inputOffset;
} colormap;

// Apply colormap texture given value
// Since the texture only varies in the x direction, setting v to 0.5 as a
// constant is fine
// Single-band stretches use 0..1; spectral indices keep their signed -1..1 domain.
vec4 colormapApply(sampler2D cmap, vec4 image) {
  vec2 uv;
  if (colormap.hasCategoricalColors == 1) {
    // Sample the center of the same class interval used to build the categorical bitmap.
    // Recover the integer class without rejecting endpoints due to rescaling roundoff.
    float value = round(image.r * float(colormap.maxPixelValue));
    if (value < float(colormap.categoricalMinValue) || value > float(colormap.categoricalMaxValue)) {
      discard;
    }
    float count = float(colormap.categoricalMaxValue - colormap.categoricalMinValue + 1);
    uv = vec2((value - float(colormap.categoricalMinValue) + 0.5) / count, 0.5);
  } else {
    uv = vec2(colormap.inputScale * image.r + colormap.inputOffset, 0.5);
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
    colormapInputNormalized?: boolean;
  } = {}
): GetUniformsOutput {
  const {
    imageColormap,
    minCategoricalBandValue,
    maxCategoricalBandValue,
    dataTypeMaxValue,
    maxPixelValue,
    colormapInputNormalized = false
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
    inputScale: colormapInputNormalized ? 1 : 0.5,
    inputOffset: colormapInputNormalized ? 0 : 0.5,
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
    maxPixelValue: 'i32',
    inputScale: 'f32',
    inputOffset: 'f32'
  },
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = colormapApply(uColormapTexture, image);
    `
  }
};
