import {Layer, LayerExtension} from '@deck.gl/core';
import {LayerContext} from '@deck.gl/core/lib/layer';
import GL from '@luma.gl/constants';

import shaderModule from './filter-shader-module';

const defaultProps = {
  getFiltered: {type: 'accessor', value: 1}
};

export type FilterArrowExtensionProps = {
  getFiltered?: () => number;
};

// Write an extension to filter arrow layer:
// an instanced attribute 'instanceFiltered' is added to the layer to indicate whether the feature has been Filtered
// the shader module is modified to discard the feature if instanceFiltered is 0
// the accessor getFiltered is used to get the value of instanceFiltered based on filteredIndex in Arrowlayer
export default class FilterArrowExtension extends LayerExtension {
  static defaultProps = defaultProps;
  static extensionName = 'FilterArrowExtension';

  getShaders(extension: any) {
    return {
      modules: [shaderModule],
      defines: {}
    };
  }

  initializeState(this: Layer<FilterArrowExtensionProps>, context: LayerContext, extension: this) {
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
