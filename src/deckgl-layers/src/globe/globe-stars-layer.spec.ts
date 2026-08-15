// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {drawStarsBackground} from './globe-stars-layer';

describe('globe-stars-layer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('drawStarsBackground tiles the star canvas with a repeating pattern', () => {
    const tileCtx = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillStyle: ''
    };
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function getContext(
      this: HTMLCanvasElement,
      type: string
    ) {
      if (type === '2d') {
        return tileCtx as unknown as CanvasRenderingContext2D;
      }
      return originalGetContext.call(this, type);
    });

    const pattern = {id: 'stars-pattern'};
    const destCtx = {
      createPattern: jest.fn(() => pattern),
      fillRect: jest.fn(),
      fillStyle: '' as string | CanvasPattern
    };

    drawStarsBackground(destCtx as unknown as CanvasRenderingContext2D, 1280, 720);

    expect(destCtx.createPattern).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 'repeat');
    expect(destCtx.fillStyle).toBe(pattern);
    expect(destCtx.fillRect).toHaveBeenCalledWith(0, 0, 1280, 720);
  });
});
