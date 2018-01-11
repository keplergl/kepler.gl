// Copyright (c) 2015 Uber Technologies, Inc.
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

import {ArcLayer} from 'deck.gl';

import isPicked from '../../shaderlib/is-picked';
import isPtInRange from '../../shaderlib/is-point-in-range';
import getExtrusion from '../../shaderlib/get-extrusion-offset.glsl';

import vs from './arc-brushing-layer-vertex.glsl';
import vs64 from './arc-brushing-layer-vertex-64.glsl';

const defaultProps = {
  ...ArcLayer.defaultProps,
  // show arc if source is in brush
  brushSource: true,
  // show arc if target is in brush
  brushTarget: true,
  enableBrushing: true,
  getStrokeWidth: d => d.strokeWidth,
  strokeScale: 1,
  // brush radius in meters
  brushRadius: 100000,
  pickedColor: [254, 210, 26, 255],
  mousePosition: [0, 0]
};

export default class ArcBrushingLayer extends ArcLayer {

  getShaders() {
    const shaders = super.getShaders();
    const addons = getExtrusion + isPicked + isPtInRange;

    return {
      ...shaders,
      vs: addons + (this.props.fp64 ? vs64 : vs)
    };
  }

  initializeState() {
    super.initializeState();
    const {attributeManager} = this.state;
    attributeManager.addInstanced({
      instanceStrokeWidth: {
        size: 1,
        accessor: ['getStrokeWidth'],
        update: this.calculateInstanceStrokeWidth
      }
    });
  }

  draw({uniforms}) {
    const {brushSource, brushTarget, brushRadius, enableBrushing,
      pickedColor, mousePosition, strokeScale} = this.props;

    const picked = !Array.isArray(pickedColor) ? defaultProps.pickedColor : pickedColor;
    super.draw({uniforms: {
      ...uniforms,
      brushSource,
      brushTarget,
      brushRadius,
      enableBrushing,
      strokeScale,
      pickedColor: new Uint8ClampedArray(!Number.isFinite(pickedColor[3]) ? [...picked, 255] : picked),
      mousePos: mousePosition ?
        new Float32Array(this.unproject(mousePosition)) : defaultProps.mousePosition
    }});
  }

  calculateInstanceStrokeWidth(attribute) {
    const {data, getStrokeWidth} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const object of data) {
      const width = getStrokeWidth(object);
      value[i] = Number.isFinite(width) ? width : 1;
      i += size;
    }
  }
}

ArcBrushingLayer.layerName = 'ArcBrushingLayer';
ArcBrushingLayer.defaultProps = defaultProps;
