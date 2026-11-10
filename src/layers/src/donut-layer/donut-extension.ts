// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayerExtension} from '@deck.gl/core';
import {RGBColor} from '@kepler.gl/types';
import {DONUT_COLORS, DONUT_NEUTRAL_COLOR} from './donut-utils';

export type DonutExtensionProps = {
  donutColors?: RGBColor[];
  getDonutStart?: (row: any) => number[];
  getDonutEnd?: (row: any) => number[];
};

const uniformBlock = `\
layout(std140) uniform donutUniforms {
  vec3 color0;
  vec3 color1;
  vec3 color2;
  vec3 color3;
  vec3 color4;
  vec3 color5;
  vec3 neutralColor;
} donut;
`;
const donutUniforms = {
  name: 'donut',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    color0: 'vec3<f32>',
    color1: 'vec3<f32>',
    color2: 'vec3<f32>',
    color3: 'vec3<f32>',
    color4: 'vec3<f32>',
    color5: 'vec3<f32>',
    neutralColor: 'vec3<f32>'
  } as const
};

/** Screen-facing rings share ScatterplotLayer's projection, filtering and picking. */
export default class DonutExtension extends LayerExtension {
  static extensionName = 'DonutExtension';
  static defaultProps = {
    donutColors: DONUT_COLORS,
    getDonutStart: {type: 'accessor', value: [0, 0, 0]},
    getDonutEnd: {type: 'accessor', value: [0, 0, 0]}
  };

  initializeState(this: Layer<DonutExtensionProps>) {
    this.getAttributeManager()?.addInstanced({
      instanceDonutStart: {size: 3, accessor: 'getDonutStart'},
      instanceDonutEnd: {size: 3, accessor: 'getDonutEnd'}
    });
  }

  getShaders() {
    return {
      modules: [donutUniforms],
      inject: {
        'vs:#decl':
          'in vec3 instanceDonutStart; in vec3 instanceDonutEnd; out vec3 donutStart; out vec3 donutEnd;',
        'fs:#decl': 'in vec3 donutStart; in vec3 donutEnd;',
        'vs:#main-end': 'donutStart = instanceDonutStart; donutEnd = instanceDonutEnd;',
        'fs:DECKGL_FILTER_COLOR': `
          float radius = length(geometry.uv);
          float edge = max(fwidth(radius), 0.001);
          float ring = smoothstep(0.6 - edge, 0.6 + edge, radius);
          if (ring <= 0.0) discard;
          float angle = mod(atan(geometry.uv.x, geometry.uv.y) / 6.28318530718 + 1.0, 1.0);
          color.rgb = donutEnd.z <= 0.0 ? donut.neutralColor :
            angle < donutStart.x ? donut.color0 :
            angle < donutStart.y ? donut.color1 :
            angle < donutStart.z ? donut.color2 :
            angle < donutEnd.x ? donut.color3 :
            angle < donutEnd.y ? donut.color4 : donut.color5;
          color.a *= ring;
        `
      }
    };
  }

  draw(this: Layer<DonutExtensionProps>) {
    const colors = this.props.donutColors || DONUT_COLORS;
    const uniforms = {neutralColor: DONUT_NEUTRAL_COLOR.map(value => value / 255)};
    for (let index = 0; index < 6; index++) {
      uniforms[`color${index}`] = (colors[index] || DONUT_COLORS[index]).map(value => value / 255);
    }
    for (const model of this.getModels()) model.shaderInputs.setProps({donut: uniforms});
  }
}
