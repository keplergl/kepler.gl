// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {alignExportShadowPass} from './custom-deck-lighting-effect';

describe('alignExportShadowPass', () => {
  function createShadowPass() {
    const canvasContext = {
      getDrawingBufferSize: jest.fn((): [number, number] => [1080, 608]),
      cssToDeviceRatio: jest.fn(() => 2)
    };
    const gl = {
      drawingBufferWidth: 1920,
      drawingBufferHeight: 1080,
      DEPTH_RANGE: 0x0b70,
      depthRange: jest.fn(),
      getParameter: jest.fn(() => [0, 0.979])
    };
    const shadowPass = {
      device: {gl, canvasContext},
      render: jest.fn((_params?: unknown) => ({
        size: canvasContext.getDrawingBufferSize(),
        ratio: canvasContext.cssToDeviceRatio()
      }))
    };
    return {shadowPass, canvasContext, gl};
  }

  test('sizes the shadow pass to the live GL buffer during export, then restores', () => {
    const {shadowPass, canvasContext, gl} = createShadowPass();
    alignExportShadowPass(shadowPass, () => true);

    expect(shadowPass.render({viewports: [{width: 540}]})).toEqual({
      size: [1920, 1080],
      ratio: 1920 / 540
    });
    expect(canvasContext.getDrawingBufferSize()).toEqual([1080, 608]);
    expect(canvasContext.cssToDeviceRatio()).toBe(2);
    expect(gl.depthRange.mock.calls).toEqual([
      [0, 1],
      [0, 0.979]
    ]);
  });

  test('does not override luma sizes outside export mode', () => {
    const {shadowPass} = createShadowPass();
    alignExportShadowPass(shadowPass, () => false);

    expect(shadowPass.render({viewports: [{width: 540}]})).toEqual({
      size: [1080, 608],
      ratio: 2
    });
  });
});
