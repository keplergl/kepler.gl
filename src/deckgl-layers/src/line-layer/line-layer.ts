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

import {LineLayer, LineLayerProps} from '@deck.gl/layers';
import GL from '@luma.gl/constants';
import {RGBAColor} from 'deck.gl';
import {editShader} from '../';

const defaultProps = {
  ...LineLayer.defaultProps,
  getTargetColor: x => x.color || [0, 0, 0, 255]
};

function addInstanceColorShader(vs) {
  const targetColorVs = editShader(
    vs,
    'line target color vs',
    'attribute vec4 instanceColors;',
    'attribute vec4 instanceColors; attribute vec4 instanceTargetColors;'
  );

  return editShader(
    targetColorVs,
    'line color vs',
    'vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);',
    `vec4 color = mix(instanceColors, instanceTargetColors, positions.x);` +
      `vColor = vec4(color.rgb, color.a * opacity);`
  );
}

function addElevationScale(vs) {
  let elevationVs = editShader(
    vs,
    'line elevation scale 1 vs - inject elevation scale',
    'uniform float widthMaxPixels;',
    `uniform float widthMaxPixels;
     uniform float elevationScale;`
  );

  elevationVs = editShader(
    elevationVs,
    'line elevation scale 2 vs - multiply by elevation scale',
    `geometry.worldPosition = instanceSourcePositions;
  geometry.worldPositionAlt = instanceTargetPositions;`,
    `vec3 source_world = instanceSourcePositions;
     vec3 target_world = instanceTargetPositions;
     source_world.z *= elevationScale;
     target_world.z *= elevationScale;
     
     geometry.worldPosition = source_world;
     geometry.worldPositionAlt = target_world;`
  );

  elevationVs = editShader(
    elevationVs,
    'line elevation scale 3 vs',
    `vec3 source_world = instanceSourcePositions;
  vec3 target_world = instanceTargetPositions;`,
    ''
  );

  return elevationVs;
}

export default class EnhancedLineLayer extends LineLayer<
  any,
  LineLayerProps<any> & {elevationScale: number; getTargetColor: RGBAColor}
> {
  getShaders() {
    const shaders = super.getShaders();

    let vs = addInstanceColorShader(shaders.vs);
    vs = addElevationScale(vs);

    return {
      ...shaders,
      vs
    };
  }

  draw({uniforms}) {
    const {elevationScale} = this.props;
    super.draw({uniforms: {...uniforms, elevationScale}});
  }

  initializeState() {
    super.initializeState(undefined);
    const {attributeManager} = this.state;
    attributeManager.addInstanced({
      instanceTargetColors: {
        size: this.props.colorFormat?.length,
        type: GL.UNSIGNED_BYTE,
        normalized: true,
        transition: true,
        accessor: 'getTargetColor',
        defaultValue: [0, 0, 0, 255]
      }
    });
  }
}

EnhancedLineLayer.layerName = 'EnhancedLineLayer';
EnhancedLineLayer.defaultProps = defaultProps;
