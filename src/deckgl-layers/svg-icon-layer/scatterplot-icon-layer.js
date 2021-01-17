// Copyright (c) 2021 Uber Technologies, Inc.
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

import {ScatterplotLayer} from '@deck.gl/layers';
import {Geometry, Model} from '@luma.gl/core';
import GL from '@luma.gl/constants';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];
export default class ScatterplotIconLayer extends ScatterplotLayer {
  _getModel(gl) {
    // use default scatterplot shaders
    const shaders = this.getShaders();

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
      shaderCache: this.context.shaderCache
    });
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
