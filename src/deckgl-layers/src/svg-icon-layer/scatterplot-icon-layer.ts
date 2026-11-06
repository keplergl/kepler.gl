// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Accessor, DefaultProps} from '@deck.gl/core';
import {ScatterplotLayer, ScatterplotLayerProps} from '@deck.gl/layers';
import {Geometry, Model} from '@luma.gl/engine';
import {TOPOLOGY} from '@kepler.gl/constants';

const DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

const globeModeUniforms = {
  name: 'globeMode',
  vs: `uniform globeModeUniforms {
  float globeModeMod;
  vec2 iconCenter;
} globeModeProps;
`,
  uniformTypes: {
    globeModeMod: 'f32',
    iconCenter: 'vec2<f32>'
  }
};

export const iconFragmentShader = /* glsl */ `\
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
  /** Counter-clockwise rotation in degrees around the mesh's bounding-box center. */
  getAngle?: Accessor<any, number>;
}

export default class ScatterplotIconLayer extends ScatterplotLayer<any, ScatterplotIconLayerProps> {
  static defaultProps: DefaultProps<ScatterplotIconLayerProps> = {
    getAngle: {type: 'accessor', value: 0}
  };

  initializeState() {
    super.initializeState();
    this.getAttributeManager()!.addInstanced({
      instanceAngles: {size: 1, accessor: 'getAngle', defaultValue: 0}
    });
  }

  getShaders() {
    const shaders = super.getShaders();
    return {
      ...shaders,
      fs: iconFragmentShader,
      modules: [...(shaders.modules || []), globeModeUniforms],
      inject: {
        'vs:#decl': 'in float instanceAngles;',
        'vs:#main-start': `
          // Shadow the vertex input locally so all ScatterplotLayer projection paths
          // (billboard, map-aligned, picking and globe) use the same rotated mesh.
          vec3 iconPosition = positions;
          vec3 positions = iconPosition;
          if (instanceAngles != 0.0) {
            float angle = radians(instanceAngles);
            float c = cos(angle);
            float s = sin(angle);
            positions.xy = mat2(c, s, -s, c) * (iconPosition.xy - globeModeProps.iconCenter)
              + globeModeProps.iconCenter;
          }`,
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

    // Compute once per mesh, not once per row or frame. Keeping the center in place
    // also preserves the position of asymmetric/custom icons at zero rotation.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i + 2 < positions.length; i += 3) {
      minX = Math.min(minX, positions[i]);
      minY = Math.min(minY, positions[i + 1]);
      maxX = Math.max(maxX, positions[i]);
      maxY = Math.max(maxY, positions[i + 1]);
    }
    const iconCenter = Number.isFinite(minX + minY + maxX + maxY)
      ? [(minX + maxX) / 2, (minY + maxY) / 2]
      : [0, 0];

    const model = new Model(this.context.device, {
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
    model.shaderInputs.setProps({globeMode: {iconCenter}});
    return model;
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
