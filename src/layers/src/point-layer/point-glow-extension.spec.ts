// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer} from '@deck.gl/core';
import PointGlowExtension, {getPointGlowUniforms, PointGlowProps} from './point-glow-extension';

describe('Point glow', () => {
  test('missing or nonfinite settings use safe defaults', () => {
    expect(getPointGlowUniforms({})).toEqual({extent: 2, strength: 0.5});
    for (const value of [undefined, NaN, Infinity, -Infinity]) {
      expect(getPointGlowUniforms({glowExtent: value, glowStrength: value})).toEqual({
        extent: 2,
        strength: 0.5
      });
    }
  });

  test('extent and strength are bounded without changing valid settings', () => {
    expect(getPointGlowUniforms({glowExtent: -3, glowStrength: -1})).toEqual({
      extent: 1,
      strength: 0
    });
    expect(getPointGlowUniforms({glowExtent: 100, glowStrength: 100})).toEqual({
      extent: 5,
      strength: 1
    });
    expect(getPointGlowUniforms({glowExtent: 3, glowStrength: 0.7})).toEqual({
      extent: 3,
      strength: 0.7
    });
  });

  test('updates uniforms without scheduling animation, including hidden and empty layers', () => {
    const extension = new PointGlowExtension();
    const setProps = jest.fn();
    const setNeedsRedraw = jest.fn();
    for (const visible of [true, false]) {
      for (const count of [0, 2]) {
        const host = {
          props: {glowExtent: 3, glowStrength: 0.7, visible},
          getModels: () => [{shaderInputs: {setProps}}],
          getNumInstances: () => count,
          setNeedsRedraw
        };
        extension.draw.call(host as unknown as Layer<PointGlowProps>);
        expect(setProps).toHaveBeenLastCalledWith({pointGlow: {extent: 3, strength: 0.7}});
        expect(setNeedsRedraw).not.toHaveBeenCalled();
      }
    }
    expect(() =>
      extension.draw.call({props: {}, getModels: () => []} as unknown as Layer<PointGlowProps>)
    ).not.toThrow();
  });
});
