// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform bandFilterUniforms {
  float min1;
  float max1;
  float min2;
  float max2;
  float min3;
  float max3;
  float min4;
  float max4;
} bandFilter;
`;

// You can't pass JS' -Infinity or Infinity to a shader as a uniform
const inf = Math.pow(2, 62);

// eslint-disable-next-line complexity
function getUniforms(
  opts: {
    filterMin1?: number;
    filterMin2?: number;
    filterMin3?: number;
    filterMin4?: number;
    filterMax1?: number;
    filterMax2?: number;
    filterMax3?: number;
    filterMax4?: number;
  } = {}
): GetUniformsOutput {
  const {
    filterMin1,
    filterMin2,
    filterMin3,
    filterMin4,
    filterMax1,
    filterMax2,
    filterMax3,
    filterMax4
  } = opts;

  if (
    Number.isFinite(filterMin1) ||
    Number.isFinite(filterMin2) ||
    Number.isFinite(filterMin3) ||
    Number.isFinite(filterMin4) ||
    Number.isFinite(filterMax1) ||
    Number.isFinite(filterMax2) ||
    Number.isFinite(filterMax3) ||
    Number.isFinite(filterMax4)
  ) {
    return {
      min1: Number.isFinite(filterMin1) ? filterMin1 : -inf,
      min2: Number.isFinite(filterMin2) ? filterMin2 : -inf,
      min3: Number.isFinite(filterMin3) ? filterMin3 : -inf,
      min4: Number.isFinite(filterMin4) ? filterMin4 : -inf,
      max1: Number.isFinite(filterMax1) ? filterMax1 : inf,
      max2: Number.isFinite(filterMax2) ? filterMax2 : inf,
      max3: Number.isFinite(filterMax3) ? filterMax3 : inf,
      max4: Number.isFinite(filterMax4) ? filterMax4 : inf
    };
  }

  return null;
}

export const filter: ShaderModule = {
  name: 'bandFilter',
  fs,
  uniformTypes: {
    min1: 'f32',
    max1: 'f32',
    min2: 'f32',
    max2: 'f32',
    min3: 'f32',
    max3: 'f32',
    min4: 'f32',
    max4: 'f32'
  },
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    if (image.r < bandFilter.min1) discard;
    if (image.g < bandFilter.min2) discard;
    if (image.b < bandFilter.min3) discard;
    if (image.a < bandFilter.min4) discard;
    if (image.r > bandFilter.max1) discard;
    if (image.g > bandFilter.max2) discard;
    if (image.b > bandFilter.max3) discard;
    if (image.a > bandFilter.max4) discard;
    `
  }
};
