// Copyright (c) 2018 Uber Technologies, Inc.
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

import {HexagonCellLayer} from 'deck.gl';

/*
 * Amendment to default layer vertex shader
 * @param {string} vs
 * @param {bool} opt.highlightPicked - whether to highlight picked element
 *
 */
export function getCellLayerVertex(vs, {highlightPicked}) {
  let output = vs;

  if (highlightPicked) {
    output = output.replace(
      'vec3 lightWeightedColor = lightWeight * instanceColors.rgb;',

      `vec3 lightWeightedColor = lightWeight * mix(1.0, mix(1.0, 1.2, selected), extruded) * instanceColors.rgb;`
    );
  }

  return output;
}

export default class EnhancedHexagonCellLayer extends HexagonCellLayer {
  getShaders() {
    const shaders = super.getShaders();
    const vs = getCellLayerVertex(shaders.vs, {highlightPicked: true});
    return {...shaders, vs};
  }
}

EnhancedHexagonCellLayer.layerName = 'EnhancedHexagonCellLayer';
