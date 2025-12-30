// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file needs significant refactoring for deck.gl 9.x APIs
// TODO: Update layer patterns for deck.gl 9.x

import {LineLayer, LineLayerProps} from '@deck.gl/layers';
import type {Color} from '@deck.gl/core';
import {GL} from '@kepler.gl/constants';
import {editShader} from '../';

type RGBAColor = Color;

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
    super.initializeState(this.context);
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
