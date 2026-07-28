// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers';
import {Geometry, Model} from '@luma.gl/engine';
import {TOPOLOGY} from '@kepler.gl/constants';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

const globeModeUniforms = {
  name: 'globeMode',
  vs: `uniform globeModeUniforms {
  float globeModeMod;
} globeModeProps;
`,
  uniformTypes: {
    globeModeMod: 'f32'
  }
};

const iconFragmentShader = /* glsl */ `\
#version 300 es
#define SHADER_NAME scatterplot-icon-layer-fragment-shader
precision highp float;
in vec4 vFillColor;
in vec4 vLineColor;
in vec2 unitPosition;
in float innerUnitRadius;
in float outerRadiusPixels;
out vec4 fragColor;
void main(void) {
  geometry.uv = unitPosition;
  fragColor = vFillColor;
  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;

export interface ScatterplotIconLayerProps extends ScatterplotLayerProps<any> {
  iconGeometry: number[];
}

export default class ScatterplotIconLayer extends ScatterplotLayer<any, ScatterplotIconLayerProps> {
  getShaders() {
    const shaders = super.getShaders();
    return {
      ...shaders,
      fs: iconFragmentShader,
      modules: [...(shaders.modules || []), globeModeUniforms],
      inject: {
        'vs:DECKGL_FILTER_SIZE': `
          size.xy *= globeModeProps.globeModeMod;`
      }
    };
  }

  draw(opts) {
    const model = this.state.model;
    if (model) {
      model.shaderInputs.setProps({
        globeMode: {
          globeModeMod: (this.context.viewport as any).resolution ? -0.5 : 1
        }
      });
    }
    super.draw(opts);
  }

  _getModel() {
    const {iconGeometry} = this.props;
    const positions = iconGeometry ? new Float32Array(iconGeometry) : new Float32Array(DEFAULT_POS);

    return new Model(this.context.device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
      geometry: new Geometry({
        topology: iconGeometry ? TOPOLOGY.TRIANGLE_LIST : TOPOLOGY.TRIANGLE_STRIP,
        attributes: {
          positions: {size: 3, value: positions}
        }
      }),
      isInstanced: true
    });
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
