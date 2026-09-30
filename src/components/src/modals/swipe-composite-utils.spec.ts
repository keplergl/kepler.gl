// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

jest.mock('@kepler.gl/deckgl-layers', () => ({
  drawStarsBackground: jest.fn()
}));

import {drawStarsBackground} from '@kepler.gl/deckgl-layers';
import {compositeSwipeFrame} from './swipe-composite-utils';

function mockCanvas(width: number, height: number, ctx: CanvasRenderingContext2D | null) {
  return {
    width,
    height,
    getContext: () => ctx
  } as unknown as HTMLCanvasElement;
}

function mockCompositeCtx() {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    shadowColor: '',
    shadowBlur: 0,
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn()
  };
}

describe('compositeSwipeFrame', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('tiles stars after the globe background color when showStars is true', () => {
    const ctx = mockCompositeCtx();
    const left = mockCanvas(10, 10, ctx as unknown as CanvasRenderingContext2D);
    const right = mockCanvas(10, 10, ctx as unknown as CanvasRenderingContext2D);
    const output = mockCanvas(100, 50, ctx as unknown as CanvasRenderingContext2D);

    compositeSwipeFrame(left, right, output, 50, false, 'rgb(1, 2, 3)', true);

    expect(ctx.fillStyle).toBe('rgb(1, 2, 3)');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
    expect(drawStarsBackground).toHaveBeenCalledWith(ctx, 100, 50);
    expect(ctx.fillRect.mock.invocationCallOrder[0]).toBeLessThan(
      (drawStarsBackground as jest.Mock).mock.invocationCallOrder[0]
    );
  });

  test('does not draw stars when showStars is omitted', () => {
    const ctx = mockCompositeCtx();
    const left = mockCanvas(10, 10, ctx as unknown as CanvasRenderingContext2D);
    const right = mockCanvas(10, 10, ctx as unknown as CanvasRenderingContext2D);
    const output = mockCanvas(100, 50, ctx as unknown as CanvasRenderingContext2D);

    compositeSwipeFrame(left, right, output, 50, false, 'rgb(1, 2, 3)');

    expect(drawStarsBackground).not.toHaveBeenCalled();
  });
});
