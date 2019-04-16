// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/*
 * data filter shader module
 */

import {LayerExtension} from 'deckgl-layers/layer-utils/layer-extension';

const DATA_TYPE_FROM_SIZE = {
  1: 'float',
  2: 'vec2',
  3: 'vec3',
  4: 'vec4'
};

export default class DataFilterExtension extends LayerExtension {
  constructor({filterSize = 4} = {}) {
    if (!DATA_TYPE_FROM_SIZE[filterSize]) {
      throw new Error('filterSize out of range');
    }
    super({filterSize});
  }

  get name() {
    return 'DataFilter';
  }

  getDefaultProps() {
    return {
      getFilterValue: 1,
      filterRange: [0, 2]
    };
  }

  getShaders() {
    const {filterSize} = this.opts;
    const dataType = DATA_TYPE_FROM_SIZE[filterSize];

    return {
      modules: [getDataFilterShaderModule(filterSize)],
      inject: {
        'vs:#decl': `
  attribute ${dataType} instanceFilterValue;
  `,
        'vs:#main-end': `
  filter_setValue(instanceFilterValue);
  `,
        'fs:#main-end': `
  gl_FragColor = filter_filterColor(gl_FragColor);
  `
      }
    };
  }

  initializeState(layer) {
    layer.getAttributeManager().addInstanced({
      instanceFilterValue: {
        size: this.opts.filterSize,
        accessor: 'getFilterValue'
      }
    });
  }
}

// Cache generated shader modules
const dataFilterShaderModules = {};

function getDataFilterShaderModule(filterSize) {
  if (dataFilterShaderModules[filterSize]) {
    return dataFilterShaderModules[filterSize];
  }

  const dataType = DATA_TYPE_FROM_SIZE[filterSize];

  const vs = `
  uniform ${dataType} filtering_uFilterMin;
  uniform ${dataType} filtering_uFilterMax;
  varying float filter_isVisible;
  void filter_setValue(bool visible) {
    filter_isVisible = float(visible);
  }
  void filter_setValue(${dataType} value) {
    filter_setValue(${
      filterSize === 1
        ? 'value <= filtering_uFilterMax && value >= filtering_uFilterMin'
        : 'all(lessThanEqual(value, filtering_uFilterMax)) && all(greaterThanEqual(value, filtering_uFilterMin))'
    });
  }
  `;

  const fs = `
  varying float filter_isVisible;
  vec4 filter_filterColor(vec4 color) {
    if (filter_isVisible < 0.5) {
      discard;
    }
    return color;
  }
  `;

  const dataFilterModule = {
    name: `data-filter-${filterSize}`,
    vs,
    fs,
    getUniforms: (opts = {}) =>
      opts.filterRange
        ? {
            filtering_uFilterMin: opts.filterRange.filterMin,
            filtering_uFilterMax: opts.filterRange.filterMax
          }
        : {}
  };

  // Save generated shader module
  dataFilterShaderModules[filterSize] = dataFilterModule;

  return dataFilterModule;
}
