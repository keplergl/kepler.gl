// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

// From mapbox/rio-color under the MIT License
//
// Sigmoidal contrast is a type of contrast control that
// adjusts the contrast without saturating highlights or shadows.
// It allows control over two factors:
// the contrast range from light to dark, and where the middle value
// of the mid-tones falls. The result is a non-linear and smooth
// contrast change.
// Parameters
// ----------
// arr : ndarray, float, 0 .. 1
//     Array of color values to adjust
// contrast : integer
//     Enhances the intensity differences between the lighter and darker
//     elements of the image. For example, 0 is none, 3 is typical and
//     20 is a lot.
// bias : float, between 0 and 1
//     Threshold level for the contrast function to center on
//     (typically centered at 0.5)
// Notes
// ----------
// Sigmoidal contrast is based on the sigmoidal transfer function:
// .. math:: g(u) = ( 1/(1 + e^{- \alpha * u + \beta)})
// This sigmoid function is scaled so that the output is bound by
// the interval [0, 1].
// .. math:: ( 1/(1 + e^(\beta * (\alpha - u))) - 1/(1 + e^(\beta * \alpha)))/
//     ( 1/(1 + e^(\beta*(\alpha - 1))) - 1/(1 + e^(\beta * \alpha)) )
// Where :math: `\alpha` is the threshold level, and :math: `\beta` the
// contrast factor to be applied.
// References
// ----------
// .. [CT] Hany Farid "Fundamentals of Image Processing"
//         http://www.cs.dartmouth.edu/farid/downloads/tutorials/fip.pdf
const fs = `\
#define epsilon 0.00000001

uniform float sigmoidalContrast;
uniform float sigmoidalBias;

// NOTE: Input array must have float values between 0 and 1!
// NOTE: bias must be a scalar float between 0 and 1!
vec4 calculateSigmoidalContrast(vec4 arr, float contrast, float bias) {
  // We use the names alpha and beta to match documentation.
  float alpha = bias;
  float beta = contrast;

  // alpha must be >= 0
  alpha = clamp(alpha, epsilon, alpha);

  if (beta > 0.) {
    vec4 numerator = 1. / (1. + exp(beta * (alpha - arr))) - 1. / (
      1. + exp(beta * alpha)
    );
    float denominator = 1. / (1. + exp(beta * (alpha - 1.))) - 1. / (
      1. + exp(beta * alpha)
    );
    arr = numerator / denominator;
  } else if (beta < 0.) {
    arr = (
      (beta * alpha) - log(
        (
          1.0 / (
            (arr / (1.0 + exp((beta * alpha) - beta))) -
            (arr / (1.0 + exp(beta * alpha))) +
            (1.0 / (1.0 + exp(beta * alpha)))
          )
        ) - 1.0)
    ) / beta;
  }

  return arr;
}
`;

function getUniforms(
  opts: {sigmoidalContrast?: number; sigmoidalBias?: number} = {}
): GetUniformsOutput {
  const {sigmoidalContrast, sigmoidalBias} = opts;

  if (!(Number.isFinite(sigmoidalContrast) || Number.isFinite(sigmoidalBias))) {
    return null;
  }

  return {
    sigmoidalContrast: Number.isFinite(sigmoidalContrast) ? sigmoidalContrast : 0,
    sigmoidalBias: Number.isFinite(sigmoidalBias) ? sigmoidalBias : 0.5
  };
}

export const sigmoidalContrast: ShaderModule = {
  name: 'sigmoidalContrast',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = calculateSigmoidalContrast(image, sigmoidalContrast, sigmoidalBias);
    `
  }
};
