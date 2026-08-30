// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {patchShadowPassDepth} from './custom-deck-lighting-effect';

describe('patchShadowPassDepth', () => {
  test('forces WebGL depth writes and disables polygon offset', () => {
    const pass = {
      getLayerParameters: () => ({
        depthTest: true,
        depthMask: false,
        blend: true
      })
    };

    patchShadowPassDepth(pass as Parameters<typeof patchShadowPassDepth>[0]);

    expect(pass.getLayerParameters({} as any, 0, null)).toMatchObject({
      depthTest: true,
      depthMask: true,
      polygonOffsetFill: false,
      polygonOffset: [0, 0]
    });
  });
});
