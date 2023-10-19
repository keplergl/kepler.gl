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
  'vs:#decl': `
    varying float is_filtered;
  `,
  'vs:#main-end': `
    is_filtered = FILTER_ARROW_ATTRIB;
  `,
  'fs:#decl': `
    varying float is_filtered;
  `,
  'fs:DECKGL_FILTER_COLOR': `
    // abandon the fragments if  it is not filtered
    if (is_filtered == 0.) {
      discard;
    }
  `
};

export default {
  name: 'filter-arrow',
  dependencies: [project],
  vs: vs,
  fs: fs,
  inject: inject,
  getUniforms: () => {}
}
