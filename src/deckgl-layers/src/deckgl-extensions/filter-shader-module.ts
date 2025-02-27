// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project} from '@deck.gl/core';

const vs = `
  #ifdef NON_INSTANCED_MODEL
    #define FILTER_ARROW_ATTRIB filtered
  #else
    #define FILTER_ARROW_ATTRIB instanceFiltered
  #endif
  attribute float FILTER_ARROW_ATTRIB;
`;

const fs = ``;

const inject = {
  // create degenerate vertices in vertex shader instead of discarding pixels in the fragment shader.
  'vs:#main-start': `
    if (FILTER_ARROW_ATTRIB == 0.) {
      gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
  `
};

export default {
  name: 'filter-arrow',
  dependencies: [project],
  vs,
  fs,
  inject,
  getUniforms: () => {
    return;
  }
};
