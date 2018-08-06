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

import {ScatterplotLayer} from 'deck.gl';
import {editShader} from 'deckgl-layers/layer-utils/shader-utils';

function addBrushingVsShader(vs) {
  return editShader(
    vs,
    'scatterplot brushing vs',
    'outerRadiusPixels += outline * strokeWidth / 2.0;',
    'outerRadiusPixels = brushing_getRadius(instancePositions, outerRadiusPixels + outline * strokeWidth / 2.0);'
  );
}

const defaultProps = {
  ...ScatterplotLayer.defaultProps,
  enableBrushing: true,
  // brush radius in meters
  brushRadius: 100000,
  mousePosition: [0, 0],
  outsideBrushRadius: 0
};

export default class ScatterplotBrushingLayer extends ScatterplotLayer {

  getShaders() {
    const shaders = super.getShaders();
    return {
      vs: addBrushingVsShader(shaders.vs),
      fs: shaders.fs,
      modules: shaders.modules.concat(['brushing'])
    };
  }
  draw(opts) {
    const {uniforms} = opts;
    const {
      brushRadius,
      enableBrushing,
      mousePosition,
      outsideBrushRadius
    } = this.props;

    // add uniforms
    super.draw({
      ...opts,
      uniforms: {
        ...uniforms,
        brushing_uBrushRadius: brushRadius,
        brushing_uOutsideBrushRadius: outsideBrushRadius,
        brushing_uMousePosition: mousePosition
          ? new Float32Array(this.unproject(mousePosition))
          : defaultProps.mousePosition,
        brushing_uEnableBrushing: enableBrushing ? 1 : 0
      }
    });
  }
}

ScatterplotBrushingLayer.layerName = 'ScatterplotBrushingLayer';
ScatterplotBrushingLayer.defaultProps = defaultProps;
