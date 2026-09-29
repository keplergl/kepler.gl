// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {injectElevationOffsetShader} from './offset-solid-polygon-layer';

describe('injectElevationOffsetShader', () => {
  const vs = `in float elevations;
void calculatePosition() {
  if (solidPolygon.extruded) {
    pos.z += props.elevations * solidPolygon.elevationScale;
  }
}`;

  test('declares the offset attribute and adds it to extruded Z', () => {
    const injected = injectElevationOffsetShader(vs);

    expect(injected).toContain('in float elevationOffsets;');
    expect(injected).toContain('pos.z += elevationOffsets;');
    expect(injected).toContain('pos.z += props.elevations * solidPolygon.elevationScale;');
    expect(injected).not.toContain('elevationOffsets * solidPolygon.elevationScale');
  });

  test('applies offset outside extrusion so it works without Enable height', () => {
    const injected = injectElevationOffsetShader(vs);

    expect(injected.indexOf('pos.z += elevationOffsets')).toBeGreaterThan(-1);
    expect(injected.indexOf('pos.z += elevationOffsets')).toBeLessThan(
      injected.indexOf('if (solidPolygon.extruded)')
    );
  });
});
