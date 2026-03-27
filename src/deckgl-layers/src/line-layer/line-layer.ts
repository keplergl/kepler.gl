// @ts-nocheck
// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LineLayer, LineLayerProps} from '@deck.gl/layers';
import type {Color} from '@deck.gl/core';
import {editShader} from '../';

type RGBAColor = Color;

const elevationScaleUniforms = {
  name: 'elevationScale',
  vs: `uniform elevationScaleUniforms {
  float elevationScale;
} elevationScaleProps;
`,
  uniformTypes: {
    elevationScale: 'f32'
  }
};

const defaultProps = {
  ...LineLayer.defaultProps,
  getTargetColor: x => x.color || [0, 0, 0, 255]
};

function addInstanceColorShader(vs) {
  const targetColorVs = editShader(
    vs,
    'line target color vs',
    'in vec4 instanceColors;',
    'in vec4 instanceColors; in vec4 instanceTargetColors;'
  );

  return editShader(
    targetColorVs,
    'line color vs',
    'vColor = vec4(instanceColors.rgb, instanceColors.a * layer.opacity);',
    `vec4 color = mix(instanceColors, instanceTargetColors, positions.x);` +
      `vColor = vec4(color.rgb, color.a * layer.opacity);`
  );
}

function addElevationScale(vs) {
  return editShader(
    vs,
    'line elevation scale vs - multiply by elevation scale',
    `geometry.worldPosition = instanceSourcePositions;
geometry.worldPositionAlt = instanceTargetPositions;
vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;`,
    `vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;
source_world.z *= elevationScaleProps.elevationScale;
target_world.z *= elevationScaleProps.elevationScale;
geometry.worldPosition = source_world;
geometry.worldPositionAlt = target_world;`
  );
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
      vs,
      modules: [...(shaders.modules || []), elevationScaleUniforms]
    };
  }

  draw(opts) {
    const model = this.state.model;
    if (model) {
      model.shaderInputs.setProps({
        elevationScale: {
          elevationScale: this.props.elevationScale ?? 1
        }
      });
    }
    super.draw(opts);
  }

  initializeState() {
    super.initializeState();
    const {attributeManager} = this.state;
    attributeManager.addInstanced({
      instanceTargetColors: {
        size: this.props.colorFormat?.length,
        type: 'unorm8',
        transition: true,
        accessor: 'getTargetColor',
        defaultValue: [0, 0, 0, 255]
      }
    });
  }
}

EnhancedLineLayer.layerName = 'EnhancedLineLayer';
EnhancedLineLayer.defaultProps = defaultProps;
