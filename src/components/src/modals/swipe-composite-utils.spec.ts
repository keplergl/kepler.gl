// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

jest.mock('@kepler.gl/deckgl-layers', () => ({
  drawStarsBackground: jest.fn()
}));

import {drawStarsBackground} from '@kepler.gl/deckgl-layers';
import {compositeSwipeFrame, getSwipePercentageAtTime} from './swipe-composite-utils';

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

    compositeSwipeFrame(left, right, output, 50, false, 'rgb(1, 2, 3)', true, {
      longitude: 40,
      zoom: 2
    });

    expect(ctx.fillStyle).toBe('rgb(1, 2, 3)');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
    expect(drawStarsBackground).toHaveBeenCalledWith(ctx, 100, 50, {longitude: 40, zoom: 2});
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

describe('getSwipePercentageAtTime', () => {
  test.each([
    [-100, 20],
    [0, 20],
    [250, 35],
    [500, 50],
    [1000, 80],
    [1200, 80]
  ])('clamps and interpolates linear progress at %i ms', (time, expected) => {
    expect(getSwipePercentageAtTime(time, 1000, 20, 80, 'linear')).toBe(expected);
  });

  test('supports a reverse swipe and a stationary divider', () => {
    expect(getSwipePercentageAtTime(250, 1000, 80, 20, 'linear')).toBe(65);
    expect(getSwipePercentageAtTime(500, 1000, 42, 42)).toBe(42);
  });

  test('defaults to easing that slows the start and end without moving the midpoint', () => {
    const at = (time: number) => getSwipePercentageAtTime(time, 1000, 20, 80);
    expect(at(0)).toBe(20);
    expect(at(250)).toBeGreaterThan(20);
    expect(at(250)).toBeLessThan(35);
    expect(at(500)).toBeCloseTo(50);
    expect(at(750)).toBeGreaterThan(65);
    expect(at(750)).toBeLessThan(80);
    expect(at(1000)).toBe(80);
    expect(at(250)).toBe(getSwipePercentageAtTime(250, 1000, 20, 80, 'ease-in-out'));
  });
});

describe('swipe export composition', () => {
  test.each([
    [0, 0],
    [33, 33],
    [50, 51],
    [100, 101]
  ])('clips the left view at %i percent of the output width', (percentage, splitX) => {
    const ctx = mockCompositeCtx();
    const left = mockCanvas(400, 200, null);
    const right = mockCanvas(800, 600, null);
    const output = mockCanvas(101, 60, ctx as unknown as CanvasRenderingContext2D);

    compositeSwipeFrame(left, right, output, percentage, false);

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 101, 60);
    expect(ctx.fillRect).not.toHaveBeenCalled();
    expect(ctx.drawImage.mock.calls).toEqual([
      [right, 0, 0, 101, 60],
      [left, 0, 0, 101, 60]
    ]);
    expect(ctx.rect).toHaveBeenCalledWith(0, 0, splitX, 60);
    // The right view must remain unclipped; the left view replaces only its side.
    const drawOrder = [
      ctx.clearRect.mock.invocationCallOrder[0],
      ctx.drawImage.mock.invocationCallOrder[0],
      ctx.save.mock.invocationCallOrder[0],
      ctx.beginPath.mock.invocationCallOrder[0],
      ctx.rect.mock.invocationCallOrder[0],
      ctx.clip.mock.invocationCallOrder[0],
      ctx.drawImage.mock.invocationCallOrder[1],
      ctx.restore.mock.invocationCallOrder[0]
    ];
    expect(drawOrder).toEqual([...drawOrder].sort((a, b) => a - b));
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).not.toHaveBeenCalled();
    expect(ctx.arc).not.toHaveBeenCalled();
  });

  test('draws the default divider on top of both views after restoring the clip', () => {
    const ctx = mockCompositeCtx();
    const output = mockCanvas(101, 60, ctx as unknown as CanvasRenderingContext2D);

    compositeSwipeFrame(mockCanvas(10, 10, null), mockCanvas(10, 10, null), output, 50);

    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 51, 0);
    expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 51, 60);
    expect(ctx.arc.mock.calls[0].slice(0, 2)).toEqual([51, 30]);
    expect(ctx.restore.mock.invocationCallOrder[0]).toBeGreaterThan(
      ctx.drawImage.mock.invocationCallOrder[1]
    );
    expect(ctx.stroke.mock.invocationCallOrder[0]).toBeGreaterThan(
      ctx.restore.mock.invocationCallOrder[0]
    );
    expect(ctx.save).toHaveBeenCalledTimes(2);
    expect(ctx.restore).toHaveBeenCalledTimes(2);
  });

  test('does nothing if the output has no 2D context', () => {
    const left = mockCanvas(10, 10, null);
    const right = mockCanvas(10, 10, null);
    const stars = drawStarsBackground as jest.Mock;
    stars.mockClear();

    expect(() =>
      compositeSwipeFrame(left, right, mockCanvas(100, 50, null), 50, true, '#000', true)
    ).not.toThrow();
    expect(stars).not.toHaveBeenCalled();
  });
});
