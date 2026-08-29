// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {patchShadowPassToDrawingBuffer} from './shadow-pass-drawing-buffer';

describe('patchShadowPassToDrawingBuffer', () => {
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
      render: jest.fn(function render(this: typeof shadowPass) {
        return {
          size: this.device.canvasContext.getDrawingBufferSize(),
          ratio: this.device.canvasContext.cssToDeviceRatio()
        };
      })
    };
    return {shadowPass, canvasContext, gl};
  }

  test('aligns shadow-pass ratio so viewport × ratio equals the live GL buffer', () => {
    const {shadowPass, canvasContext} = createShadowPass();
    patchShadowPassToDrawingBuffer(shadowPass, () => true);

    const result = shadowPass.render({viewports: [{width: 540, height: 304}]});

    expect(result).toEqual({size: [1920, 1080], ratio: 1920 / 540});
    expect(canvasContext.getDrawingBufferSize()).toEqual([1080, 608]);
    expect(canvasContext.cssToDeviceRatio()).toBe(2);
  });

  test('does not override luma sizes outside export mode', () => {
    const {shadowPass} = createShadowPass();
    patchShadowPassToDrawingBuffer(shadowPass, () => false);

    const result = shadowPass.render({viewports: [{width: 540, height: 304}]});

    expect(result).toEqual({size: [1080, 608], ratio: 2});
  });

  test('restores MapLibre depthRange after the shadow pass', () => {
    const {shadowPass, gl} = createShadowPass();
    patchShadowPassToDrawingBuffer(shadowPass, () => true);

    shadowPass.render({viewports: [{width: 540, height: 304}]});

    expect(gl.depthRange.mock.calls).toEqual([
      [0, 1],
      [0, 0.979]
    ]);
  });
});
