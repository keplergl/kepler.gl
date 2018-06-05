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

import {LineLayer} from 'deck.gl';
import {GL} from 'luma.gl';
import {editShader} from 'deckgl-layers/layer-utils/shader-utils';

const defaultProps = {
  ...LineLayer.defaultProps,
  // show arc if source is in brush
  brushSource: true,
  // show arc if target is in brush
  brushTarget: true,
  enableBrushing: true,
  getStrokeWidth: d => d.strokeWidth,
  getTargetColor: x => x.color || [0, 0, 0, 255],
  strokeScale: 1,

  // brush radius in meters
  brushRadius: 100000,
  mousePosition: [0, 0]
};

function addBrushingVsShader(vs) {
  const targetColorVs = editShader(
    vs,
    'line target color vs',
    'attribute vec4 instanceColors;',
    'attribute vec4 instanceColors; attribute vec4 instanceTargetColors;'
  );

  const brushingVs = editShader(
    targetColorVs,
    'line brushing vs',
    'vec2 offset = getExtrusionOffset(target.xy - source.xy, positions.y);',
    'vec2 offset = brushing_getExtrusionOffset(target.xy - source.xy, positions.y, project_uViewportSize, vec4(instanceSourcePositions.xy, instanceTargetPositions.xy), instanceWidths);'
  );

  return editShader(
    brushingVs,
    'line color vs',
    'vColor = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;',
    `vec4 color = mix(instanceColors, instanceTargetColors, positions.x) / 255.;` +
    `vColor = vec4(color.rgb, color.a * opacity);`
  )
}

export default class LineBrushingLayer extends LineLayer {
  getShaders() {
    const shaders = super.getShaders();
    // const addons = getExtrusion + isPicked + isPtInRange;

    return {
      // ...shaders,
      vs: addBrushingVsShader(shaders.vs),
      fs: shaders.fs,
      // vs: this.props.fp64 ? addons + vs64 : addons + vs,
      modules: shaders.modules.concat(['brushing'])
    };
  }

  initializeState() {
    super.initializeState();
    const {attributeManager} = this.state;
    attributeManager.addInstanced({
      instanceTargetColors: {
        size: 4,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getTargetColor',
        update: this.calculateInstanceTargetColors
      }
    });
  }

  draw({uniforms}) {
    const {
      brushSource,
      brushTarget,
      brushRadius,
      enableBrushing,
      mousePosition,
      strokeScale
    } = this.props;

    super.draw({
      uniforms: {
        ...uniforms,
        brushing_uBrushSource: brushSource ? 1 : 0,
        brushing_uBrushTarget: brushTarget ? 1 : 0,
        brushing_uBrushRadius: brushRadius,
        brushing_uEnableBrushing: enableBrushing ? 1 : 0,
        brushing_uStrokeScale: strokeScale,
        brushing_uMousePosition: mousePosition
          ? new Float32Array(this.unproject(mousePosition))
          : defaultProps.mousePosition
      }
    });
  }

  calculateInstanceTargetColors(attribute) {
    const {data, getTargetColor} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const object of data) {
      const color = getTargetColor(object);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    }
  }
}

LineBrushingLayer.layerName = 'LineBrushingLayer';
LineBrushingLayer.defaultProps = defaultProps;
