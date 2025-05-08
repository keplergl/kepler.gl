// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ShaderModule, GetUniformsOutput} from '../types';

/**
 * Reorder image bands on GPU
 * Uses a permutation matrix to reorder a vec4
 */

const fs = `\
uniform mat4 uReorder;

vec4 reorder_image(vec4 image, mat4 ordering) {
  return image.rgba * ordering;
}
`;

function getUniforms(opts: {ordering?: number[]} = {}): GetUniformsOutput {
  const {ordering} = opts;

  if (!ordering) {
    return null;
  }

  return {
    uReorder: constructPermutationMatrix(ordering)
  };
}

/**
 * Construct permutation matrix from vector
 *
 * @param vector  Vector describing how to reorder bands
 *
 * @return a mat4 permutation matrix representing how to reorder bands
 */
export function constructPermutationMatrix(vector: number[]): number[] {
  const mat4 = Array(16).fill(0);
  let row = 0;
  for (const index of vector) {
    mat4[row * 4 + index] = 1;
    row += 1;
  }

  // If input vector wasn't of length 4, add identity in final places
  for (let r = row; r < 4; r++) {
    mat4[r * 4 + r] = 1;
  }

  return mat4;
}

export const reorderBands: ShaderModule = {
  name: 'reorder-bands',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `
    image = reorder_image(image, uReorder);
    `
  }
};
