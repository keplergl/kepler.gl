// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayerExtension} from '@deck.gl/core';

/** Flowmap's shaders still consume the picking colors that deck.gl 9.4 stopped adding. */
export default class FlowPickingExtension extends LayerExtension {
  static extensionName = 'FlowPickingExtension';

  initializeState(this: Layer) {
    this.getAttributeManager()?.addInstanced({
      instancePickingColors: {
        size: 4,
        type: 'uint8',
        accessor: (_object, {index, target}) => {
          this.encodePickingColor(index, target);
          target[3] = 0;
          return target;
        }
      }
    });
  }
}
