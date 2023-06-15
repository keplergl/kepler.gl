// Copyright (c) 2023 Uber Technologies, Inc.
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

import {UNIT} from '@deck.gl/core';
import {ColumnLayer, ColumnLayerProps} from '@deck.gl/layers/typed';
import GL from '@luma.gl/constants';

import {editShader} from '../';

function addInstanceCoverage(vs) {
  const addDecl = editShader(
    vs,
    'hexagon cell vs add instance 1',
    'in vec3 instancePickingColors;',
    `in vec3 instancePickingColors;
     in float instanceCoverage;`
  );

  return editShader(
    addDecl,
    'hexagon cell vs add instance 2',
    'float dotRadius = radius * coverage * shouldRender;',
    'float dotRadius = radius * coverage * instanceCoverage * shouldRender;'
  );
}

type EnhancedColumnLayerProps = ColumnLayerProps<any> & {
  strokeOpacity: any;
};

// TODO: export all deck.gl layers from kepler.gl
class EnhancedColumnLayer extends ColumnLayer<any, EnhancedColumnLayerProps> {
  getShaders() {
    const shaders = super.getShaders();

    return {
      ...shaders,
      vs: addInstanceCoverage(shaders.vs)
    };
  }

  initializeState() {
    super.initializeState();

    this.getAttributeManager()?.addInstanced({
      instanceCoverage: {size: 1, accessor: 'getCoverage'}
    });
  }

  draw({uniforms}) {
    const {
      lineWidthUnits,
      lineWidthScale,
      lineWidthMinPixels,
      lineWidthMaxPixels,
      radiusUnits,
      elevationScale,
      extruded,
      filled,
      stroked,
      strokeOpacity,
      wireframe,
      offset,
      coverage,
      radius,
      angle
    } = this.props;
    const {model, fillVertexCount, wireframeVertexCount, edgeDistance} = this.state;

    model.setUniforms(uniforms).setUniforms({
      radius,
      angle: (angle / 180) * Math.PI,
      offset,
      extruded,
      stroked,
      coverage,
      elevationScale,
      edgeDistance,
      radiusUnits: UNIT[radiusUnits],
      widthUnits: UNIT[lineWidthUnits],
      widthScale: lineWidthScale,
      widthMinPixels: lineWidthMinPixels,
      widthMaxPixels: lineWidthMaxPixels
    });

    // When drawing 3d: draw wireframe first so it doesn't get occluded by depth test
    if (extruded && wireframe) {
      model.setProps({isIndexed: true});
      model
        .setVertexCount(wireframeVertexCount)
        .setDrawMode(GL.LINES)
        .setUniforms({isStroke: true})
        .draw();
    }
    if (filled) {
      model.setProps({isIndexed: false});
      model
        .setVertexCount(fillVertexCount)
        .setDrawMode(GL.TRIANGLE_STRIP)
        .setUniforms({isStroke: false})
        .draw();
    }
    // When drawing 2d: draw fill before stroke so that the outline is always on top
    if (!extruded && stroked) {
      model.setProps({isIndexed: false});
      // The width of the stroke is achieved by flattening the side of the cylinder.
      // Skip the last 1/3 of the vertices which is the top.
      model
        .setVertexCount((fillVertexCount * 2) / 3)
        .setDrawMode(GL.TRIANGLE_STRIP)
        .setUniforms({isStroke: true, opacity: strokeOpacity})
        .draw();
    }
  }
}

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';

export default EnhancedColumnLayer;
