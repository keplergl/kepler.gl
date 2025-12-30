// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file needs significant refactoring for deck.gl 9.x APIs
// TODO: Update layer patterns for deck.gl 9.x

import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers';
import {Geometry} from '@luma.gl/engine';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

export interface ScatterplotIconLayerProps extends ScatterplotLayerProps<any> {
  iconGeometry: number[];
}

export default class ScatterplotIconLayer extends ScatterplotLayer<any, ScatterplotIconLayerProps> {
  // In deck.gl 9.x, _getModel is replaced by getShaders and deck manages the model
  // Override initializeState to set up custom geometry
  initializeState() {
    super.initializeState(this.context);

    const {iconGeometry} = this.props;

    // Store the geometry info for use in rendering
    this.state.iconGeometry = iconGeometry;
  }

  // Override to provide custom geometry
  protected _getModel() {
    const {iconGeometry} = this.props;

    // Create geometry with the icon shape
    const positions = iconGeometry
      ? new Float32Array(iconGeometry)
      : new Float32Array(DEFAULT_POS);

    const geometry = new Geometry({
      topology: iconGeometry ? 'triangle-list' : 'triangle-strip',
      attributes: {
        positions: {size: 3, value: positions}
      }
    });

    return super._getModel?.() || null;
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
