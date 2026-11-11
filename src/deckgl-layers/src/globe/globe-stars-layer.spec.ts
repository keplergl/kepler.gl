// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {drawStarsBackground, getStarsBackgroundStyle} from './globe-stars-layer';

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
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function getContext(this: HTMLCanvasElement, type: string) {
        if (type === '2d') {
          return tileCtx as unknown as CanvasRenderingContext2D;
        }
        return originalGetContext.call(this, type);
      });

    const pattern = {id: 'stars-pattern'};
    const destCtx = {
      createPattern: jest.fn(() => pattern),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      fillRect: jest.fn(),
      fillStyle: '' as string | CanvasPattern
    };

    drawStarsBackground(destCtx as unknown as CanvasRenderingContext2D, 1280, 720);

    expect(destCtx.createPattern).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 'repeat');
    expect(destCtx.fillStyle).toBe(pattern);
    expect(destCtx.fillRect).toHaveBeenCalledWith(0, 0, 1280, 720);
    const camera = {longitude: 45, latitude: 30, zoom: 6};
    drawStarsBackground(destCtx as unknown as CanvasRenderingContext2D, 1280, 720, camera);
    const style = getStarsBackgroundStyle(camera, 1280, 720);
    const [x, y] = style.backgroundPosition.split(' ').map(parseFloat);
    const size = parseFloat(style.backgroundSize);
    expect(destCtx.translate).toHaveBeenCalledWith(x, y);
    expect(destCtx.scale).toHaveBeenCalledWith(size / 512, size / 512);
    expect(destCtx.restore).toHaveBeenCalledTimes(1);
    // Repeated camera updates reuse the tile instead of generating stars again.
    expect(tileCtx.arc).toHaveBeenCalledTimes(600);
  });
});

test('decorative motion responds to camera, wraps longitude, and scales with output resolution', () => {
  const camera = {longitude: 179, latitude: 30, zoom: 4};
  const style = getStarsBackgroundStyle(camera, 1000, 600);
  expect(getStarsBackgroundStyle({...camera, longitude: -181}, 1000, 600)).toEqual(style);
  expect(getStarsBackgroundStyle({...camera, longitude: 180}, 1000, 600)).not.toEqual(style);
  expect(getStarsBackgroundStyle({...camera, latitude: 40}, 1000, 600)).not.toEqual(style);
  expect(getStarsBackgroundStyle({...camera, zoom: 8}, 1000, 600)).not.toEqual(style);
  const doubled = getStarsBackgroundStyle(camera, 2000, 1200);
  expect(parseFloat(doubled.backgroundSize)).toBe(2 * parseFloat(style.backgroundSize));
  expect(doubled.backgroundPosition.split(' ').map(parseFloat)).toEqual(
    style.backgroundPosition.split(' ').map(value => parseFloat(value) * 2)
  );
  expect(parseFloat(getStarsBackgroundStyle({zoom: 1000}, 1000, 600).backgroundSize)).toBe(575);
  expect(getStarsBackgroundStyle({zoom: NaN, longitude: Infinity}, 1000, 600)).toEqual(
    getStarsBackgroundStyle({}, 1000, 600)
  );
});
