// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

// Gamma correction is a nonlinear operation that
// adjusts the image's channel values pixel-by-pixel according
// to a power-law:
//
// .. math:: pixel_{out} = pixel_{in} ^ {gamma}
//
// Setting gamma (:math:gamma) to be less than 1.0 darkens the image and
// setting gamma to be greater than 1.0 lightens it.

// Parameters
// ----------
// gamma (:math:gamma): float
//     Reasonable values range from 0.8 to 2.4.

// NOTE: Input array must have float values between 0 and 1!
// NOTE: gamma must be >= 0
const fs = `\
#define epsilon 0.00000001

uniform float gamma1;
uniform float gamma2;
uniform float gamma3;
uniform float gamma4;

float gammaContrast(float arr, float g) {
  // Gamma must be > 0
  g = clamp(g, epsilon, g);

  return pow(arr, 1.0 / g);
}

vec4 gammaContrast(vec4 arr, float g1, float g2, float g3, float g4) {
  arr.r = gammaContrast(arr.r, g1);
  arr.g = gammaContrast(arr.g, g2);
  arr.b = gammaContrast(arr.b, g3);
  arr.a = gammaContrast(arr.a, g4);

  return arr;
}
`;

function getUniforms(
  opts: {
    gammaContrastValue?: number;
    gammaContrastValue1?: number;
    gammaContrastValue2?: number;
    gammaContrastValue3?: number;
    gammaContrastValue4?: number;
  } = {}
): GetUniformsOutput {
  const {
    gammaContrastValue,
    gammaContrastValue1,
    gammaContrastValue2,
    gammaContrastValue3,
    gammaContrastValue4
  } = opts;

  // Gamma must be > 0, so not using Number.isFinite is fine

  if (gammaContrastValue) {
    return {
      gamma1: gammaContrastValue,
      gamma2: gammaContrastValue,
      gamma3: gammaContrastValue,
      gamma4: gammaContrastValue
    };
  } else if (
    gammaContrastValue1 ||
    gammaContrastValue2 ||
    gammaContrastValue3 ||
    gammaContrastValue4
  ) {
    return {
      gamma1: gammaContrastValue1 || 1,
      gamma2: gammaContrastValue2 || 1,
      gamma3: gammaContrastValue3 || 1,
      gamma4: gammaContrastValue4 || 1
    };
  }

  return null;
}

export const gammaContrast: ShaderModule = {
  name: 'gamma_contrast',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = gammaContrast(image, gamma1, gamma2, gamma3, gamma4);
    `
  }
};
