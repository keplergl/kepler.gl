// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {readFileSync} from 'fs';
import {join} from 'path';

import {injectLineElevationScale} from './line-layer';

// The demo aliases @deck.gl to this TypeScript source, which is indented and
// has a blank line the published bundle does not.
const sourceShader = readFileSync(
  join(
    __dirname,
    '../../../../node_modules/@deck.gl/layers/src/line-layer/line-layer-vertex.glsl.ts'
  ),
  'utf8'
);

const flatShader = `void main(void) {
geometry.worldPosition = instanceSourcePositions;
geometry.worldPositionAlt = instanceTargetPositions;
vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;
}`;

describe('injectLineElevationScale', () => {
  test('scales elevation in the indented deck.gl source shader', () => {
    const injected = injectLineElevationScale(sourceShader);

    expect(injected).toContain('source_world.z *= elevationScaleProps.elevationScale');
    expect(injected).toContain('target_world.z *= elevationScaleProps.elevationScale');
  });

  test('scales elevation in the flattened published shader', () => {
    const injected = injectLineElevationScale(flatShader);

    expect(injected).toContain('source_world.z *= elevationScaleProps.elevationScale');
    expect(injected.indexOf('source_world.z *=')).toBeLessThan(
      injected.indexOf('geometry.worldPosition = source_world')
    );
  });
});
