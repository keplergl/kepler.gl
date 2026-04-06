// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project} from '@deck.gl/core';

const vs = `
  in float filtered;
`;

const fs = ``;

const inject = {
  'vs:#main-start': `
    if (filtered == 0.) {
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
