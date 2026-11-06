// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ShaderModule} from '../types';

// Calculate standard normalized difference
const fs = `\
float normalized_difference_calc(vec4 image) {
  float denominator = image.r + image.g;
  // Match hover NoData handling before division and colormap lookup.
  if (denominator == 0.) discard;
  return (image.r - image.g) / denominator;
}
`;

export const normalizedDifference: ShaderModule = {
  name: 'normalized_difference',
  fs,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = vec4(normalized_difference_calc(image), 0., 0., 0.);
    `
  }
};
