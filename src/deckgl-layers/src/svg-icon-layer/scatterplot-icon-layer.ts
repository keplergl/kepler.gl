// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers';
import {Geometry} from '@luma.gl/engine';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

export interface ScatterplotIconLayerProps extends ScatterplotLayerProps<any> {
  iconGeometry: number[];
}

export default class ScatterplotIconLayer extends ScatterplotLayer<any, ScatterplotIconLayerProps> {
  _getModel() {
    const {iconGeometry} = this.props;
    const positions = iconGeometry ? new Float32Array(iconGeometry) : new Float32Array(DEFAULT_POS);

    const geometry = new Geometry({
      topology: iconGeometry ? 'triangle-list' : 'triangle-strip',
      attributes: {
        positions: {size: 3, value: positions}
      }
    });

    const model = super._getModel();
    if (model) {
      model.setGeometry(geometry);
    }
    return model;
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
