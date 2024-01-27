// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers';
import {Geometry, Model} from '@luma.gl/core';
import GL from '@luma.gl/constants';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

export interface ScatterplotIconLayerProps extends ScatterplotLayerProps<any> {
  iconGeometry: number;
}

export default class ScatterplotIconLayer extends ScatterplotLayer<any, ScatterplotIconLayerProps> {
  _getModel(gl: WebGLRenderingContext) {
    // use default scatterplot shaders
    const shaders = this.getShaders(undefined);

    const {iconGeometry} = this.props;

    const geometry = iconGeometry
      ? new Geometry({
          drawMode: GL.TRIANGLES,
          attributes: {
            positions: new Float32Array(iconGeometry)
          }
        })
      : new Geometry({
          drawMode: GL.TRIANGLE_FAN,
          attributes: {
            positions: new Float32Array(DEFAULT_POS)
          }
        });

    return new Model(gl, {
      ...shaders,
      id: this.props.id,
      geometry,
      isInstanced: true,
      // @ts-ignore
      shaderCache: this.context.shaderCache
    });
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
