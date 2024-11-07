// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayerExtension} from '@deck.gl/core';
import GL from '@luma.gl/constants';

import shaderModule from './filter-shader-module';

const VALUE_FILTERED = 1;

const defaultProps = {
  getFiltered: {type: 'accessor', value: VALUE_FILTERED}
};

export type FilterArrowExtensionProps = {
  getFiltered?: () => number;
};

/**
 * FilterArrowExtension - a deck.gl extension to filter arrow layer
 *
 * A simple extension to filter arrow layer based on the result of CPU filteredIndex,
 * so we can avoid filtering on the raw Arrow table and recreating geometry attributes.
 * Specifically, an attribute `filtered` is added to the layer to indicate whether the feature has been Filtered
 * the shader module is modified to discard the feature if filtered value is 0
 * the accessor getFiltered is used to get the value of `filtered` based on the value `filteredIndex` in Arrowlayer
 */
export default class FilterArrowExtension extends LayerExtension {
  static defaultProps = defaultProps;
  static extensionName = 'FilterArrowExtension';

  getShaders() {
    return {
      modules: [shaderModule],
      defines: {}
    };
  }

  initializeState(this: Layer<FilterArrowExtensionProps>) {
    const attributeManager = this.getAttributeManager();
    if (attributeManager) {
      attributeManager.add({
        filtered: {
          size: 1,
          type: GL.FLOAT,
          accessor: 'getFiltered',
          shaderAttributes: {
            filtered: {
              divisor: 0
            },
            instanceFiltered: {
              divisor: 1
            }
          }
        }
      });
    }
  }
}
