// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {assembleGLSLShaderPair} from '@luma.gl/shadertools';

import {withArrowHeadVertexInject} from './arrow-head-layer';

const platformInfo = {
  type: 'webgl' as const,
  shaderLanguage: 'glsl' as const,
  shaderLanguageVersion: 300 as const,
  gpu: 'test',
  features: new Set<string>()
};

const vs = `#version 300 es
#define SHADER_NAME arrow-test
in vec3 positions;
void main(void) {
  vec3 size = positions;
  DECKGL_FILTER_SIZE(size, geometry);
  gl_Position = vec4(size, 1.0);
}
`;

const fs = `#version 300 es
precision highp float;
out vec4 fragColor;
void main(void) {
  fragColor = vec4(1.0);
}
`;

function assemble(inject: Record<string, string>) {
  return assembleGLSLShaderPair({
    platformInfo,
    vs,
    fs,
    inject,
    modules: [],
    hookFunctions: [
      'vs:DECKGL_FILTER_SIZE(inout vec3 size, VertexGeometry geometry)',
      'vs:DECKGL_FILTER_GL_POSITION(inout vec4 position, VertexGeometry geometry)'
    ]
  }).vs;
}

describe('arrow head shader', () => {
  test('declares instanceAngles before the size hook uses it', () => {
    const assembled = assemble(withArrowHeadVertexInject());

    const declaration = assembled.indexOf('in float instanceAngles');
    const use = assembled.indexOf('radians(instanceAngles)');

    expect(declaration).toBeGreaterThan(-1);
    expect(use).toBeGreaterThan(declaration);
  });

  test('keeps an existing size injection such as the data filter', () => {
    const assembled = assemble(
      withArrowHeadVertexInject({
        'vs:DECKGL_FILTER_SIZE': 'size = size * dataFilter_value;'
      })
    );

    const filterAt = assembled.indexOf('size * dataFilter_value');
    const rotateAt = assembled.indexOf('radians(instanceAngles)');

    expect(filterAt).toBeGreaterThan(-1);
    expect(rotateAt).toBeGreaterThan(filterAt);
  });

  test('supplies source and target positions before brushing filters the arrow', () => {
    const assembled = assemble(
      withArrowHeadVertexInject({
        'vs:DECKGL_FILTER_GL_POSITION':
          'bool visible = brushing_arePointsInRange(geometry.worldPosition.xy, geometry.worldPositionAlt.xy);'
      })
    );

    const sourceAt = assembled.indexOf('geometry.worldPosition = instanceSourcePositions');
    const targetAt = assembled.indexOf('geometry.worldPositionAlt = instanceTargetPositions');
    const brushAt = assembled.indexOf('brushing_arePointsInRange');

    expect(sourceAt).toBeGreaterThan(-1);
    expect(targetAt).toBeGreaterThan(sourceAt);
    expect(brushAt).toBeGreaterThan(targetAt);
  });
});
