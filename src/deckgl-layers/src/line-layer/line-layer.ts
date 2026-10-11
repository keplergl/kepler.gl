// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LineLayer, LineLayerProps} from '@deck.gl/layers';
import type {Color, AttributeManager} from '@deck.gl/core';
import {console as Console} from 'global/window';

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

// deck.gl's published shader is flat; the TypeScript source the demo bundles is indented
// and has a blank line between the two assignments. Match either form.
const LINE_ELEVATION_ANCHOR =
  /geometry\.worldPosition = instanceSourcePositions;\s*geometry\.worldPositionAlt = instanceTargetPositions;\s*vec3 source_world = instanceSourcePositions;\s*vec3 target_world = instanceTargetPositions;/;

const LINE_ELEVATION_REPLACEMENT = `vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;
source_world.z *= elevationScaleProps.elevationScale;
target_world.z *= elevationScaleProps.elevationScale;
geometry.worldPosition = source_world;
geometry.worldPositionAlt = target_world;`;

export function injectLineElevationScale(vs: string): string {
  if (!LINE_ELEVATION_ANCHOR.test(vs)) {
    Console.error('Cannot edit line elevation scale vs - multiply by elevation scale layer shader');
    return vs;
  }

  return vs.replace(LINE_ELEVATION_ANCHOR, LINE_ELEVATION_REPLACEMENT);
}

export default class EnhancedLineLayer extends LineLayer<
  any,
  LineLayerProps<any> & {elevationScale: number; getTargetColor: RGBAColor}
> {
  getShaders() {
    const shaders = super.getShaders();

    let vs = addInstanceColorShader(shaders.vs);
    vs = injectLineElevationScale(vs);

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
    const {attributeManager} = this.state as {attributeManager: AttributeManager};
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
