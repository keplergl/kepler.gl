// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ShaderModule} from '../types';

// Calculate modified soil-adjusted vegetation index
// Expected to be ordered:
// red: Landsat 8 band 5
// green: Landsat 8 band 4
//
// MSAVI = (2 * Band 5 + 1 – sqrt ((2 * Band 5 + 1)^2 – 8 * (Band 5 – Band 4))) / 2
// https://www.usgs.gov/land-resources/nli/landsat/landsat-modified-soil-adjusted-vegetation-index
const fs = `\
float modified_soil_adjusted_vegetation_index_calc(vec4 image) {
  float band5 = image.r;
  float band4 = image.g;

  float to_sqrt = ((2. * band5 + 1.) * (2. * band5 + 1.)) - (8. * (band5 - band4));
  return ((2. * band5) + 1. - sqrt(to_sqrt)) / 2.;
}
`;

export const modifiedSoilAdjustedVegetationIndex: ShaderModule = {
  name: 'modified_soil_adjusted_vegetation_index',
  fs,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = vec4(modified_soil_adjusted_vegetation_index_calc(image), 0., 0., 0.);
    `
  }
};
