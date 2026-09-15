// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  alignCollisionFilterEffect,
  installCollisionFilterEffectAlignment
} from './collision-filter-effect';

describe('alignCollisionFilterEffect', () => {
  function createEffect() {
    const canvasContext = {
      getPixelSize: jest.fn((): [number, number] => [1080, 608]),
      getDevicePixelRatio: jest.fn(() => 3.555),
      getDrawingBufferSize: jest.fn((): [number, number] => [1080, 608]),
      cssToDeviceRatio: jest.fn(() => 2)
    };
    const gl = {
      drawingBufferWidth: 1920,
      drawingBufferHeight: 1080
    };
    const effect = {
      id: 'collision-filter-effect',
      lastViewport: {id: 'stale'},
      context: {device: {gl, canvasContext}},
      preRender: jest.fn(function (this: {lastViewport?: unknown}) {
        return {
          pixelSize: canvasContext.getPixelSize(),
          devicePixelRatio: canvasContext.getDevicePixelRatio(),
          lastViewport: this.lastViewport
        };
      })
    };
    return {effect, canvasContext};
  }

  test('sizes the collision FBO from the live GL buffer and CSS viewport', () => {
    const {effect, canvasContext} = createEffect();
    const originalGetPixelSize = canvasContext.getPixelSize;
    const originalGetDevicePixelRatio = canvasContext.getDevicePixelRatio;
    alignCollisionFilterEffect(effect);

    expect(effect.preRender({viewports: [{width: 540}]})).toEqual({
      pixelSize: [1920, 1080],
      devicePixelRatio: 1920 / 540,
      lastViewport: undefined
    });
    expect(canvasContext.getPixelSize).toBe(originalGetPixelSize);
    expect(canvasContext.getDevicePixelRatio).toBe(originalGetDevicePixelRatio);
    expect(canvasContext.getPixelSize()).toEqual([1080, 608]);
    expect(canvasContext.getDevicePixelRatio()).toBe(3.555);
  });

  test('falls back to luma drawing-buffer size when GL sizes are missing', () => {
    const canvasContext = {
      getPixelSize: jest.fn((): [number, number] => [800, 600]),
      getDevicePixelRatio: jest.fn(() => 2),
      getDrawingBufferSize: jest.fn((): [number, number] => [1600, 1200]),
      cssToDeviceRatio: jest.fn(() => 2)
    };
    const effect = {
      context: {device: {canvasContext}},
      preRender: jest.fn(() => ({
        pixelSize: canvasContext.getPixelSize(),
        devicePixelRatio: canvasContext.getDevicePixelRatio()
      }))
    };
    alignCollisionFilterEffect(effect);

    expect(effect.preRender({viewports: [{width: 800}]})).toEqual({
      pixelSize: [1600, 1200],
      devicePixelRatio: 2
    });
  });

  test('only invalidates lastViewport when the drawing buffer size changes', () => {
    const {effect} = createEffect();
    alignCollisionFilterEffect(effect);

    effect.preRender({viewports: [{width: 540}]});
    effect.lastViewport = {id: 'current'};
    expect(effect.preRender({viewports: [{width: 540}]})).toMatchObject({
      lastViewport: {id: 'current'}
    });
  });
});

describe('installCollisionFilterEffectAlignment', () => {
  test('wraps CollisionFilterEffect before Deck adds it as a default effect', () => {
    const added: unknown[] = [];
    const addDefaultEffect = jest.fn((effect: {id?: string; preRender?: () => string}) => {
      added.push(effect.preRender?.());
    });
    const deck = {
      _addDefaultEffect: addDefaultEffect
    };
    installCollisionFilterEffectAlignment(deck);

    const canvasContext = {
      getPixelSize: () => [100, 100] as [number, number],
      getDevicePixelRatio: () => 1,
      getDrawingBufferSize: () => [200, 200] as [number, number],
      cssToDeviceRatio: () => 2
    };
    const effect = {
      id: 'collision-filter-effect',
      context: {device: {canvasContext}},
      preRender: () => String(canvasContext.getPixelSize())
    };

    deck._addDefaultEffect(effect);
    expect(added).toEqual(['200,200']);
    expect(deck.__keplerCollisionFilterAligned).toBe(true);

    installCollisionFilterEffectAlignment(deck);
    expect(addDefaultEffect).toHaveBeenCalledTimes(1);
  });

  test('does not wrap unrelated default effects', () => {
    const lighting = {id: 'lighting', preRender: jest.fn()};
    const deck = {
      _addDefaultEffect: jest.fn()
    };
    installCollisionFilterEffectAlignment(deck);
    deck._addDefaultEffect(lighting);
    expect(lighting.preRender.mock.calls.length).toBe(0);
  });
});
