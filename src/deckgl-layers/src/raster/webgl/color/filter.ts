// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GetUniformsOutput, ShaderModule} from '../types';

const fs = `\
uniform float filterMin1;
uniform float filterMax1;
uniform float filterMin2;
uniform float filterMax2;
uniform float filterMin3;
uniform float filterMax3;
uniform float filterMin4;
uniform float filterMax4;
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
      filterMin1: Number.isFinite(filterMin1) ? filterMin1 : -inf,
      filterMin2: Number.isFinite(filterMin2) ? filterMin2 : -inf,
      filterMin3: Number.isFinite(filterMin3) ? filterMin3 : -inf,
      filterMin4: Number.isFinite(filterMin4) ? filterMin4 : -inf,
      filterMax1: Number.isFinite(filterMax1) ? filterMax1 : inf,
      filterMax2: Number.isFinite(filterMax2) ? filterMax2 : inf,
      filterMax3: Number.isFinite(filterMax3) ? filterMax3 : inf,
      filterMax4: Number.isFinite(filterMax4) ? filterMax4 : inf
    };
  }

  return null;
}

export const filter: ShaderModule = {
  name: 'filter',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    if (image.r < filterMin1) discard;
    if (image.g < filterMin2) discard;
    if (image.b < filterMin3) discard;
    if (image.a < filterMin4) discard;
    if (image.r > filterMax1) discard;
    if (image.g > filterMax2) discard;
    if (image.b > filterMax3) discard;
    if (image.a > filterMax4) discard;
    `
  }
};
