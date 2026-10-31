// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer} from '@deck.gl/core';
import PulseRippleExtension, {
  getPulseRippleUniforms,
  PulseRippleProps
} from './pulse-ripple-extension';

describe('Pulse / Ripple animation', () => {
  test('disabled and missing settings leave point rendering unchanged', () => {
    expect(getPulseRippleUniforms({}, 500)).toEqual({radiusScale: 1, opacity: 1, ripple: 0});
    expect(getPulseRippleUniforms({pulseEnabled: false, pulseExpansion: 5}, 500)).toEqual({
      radiusScale: 1,
      opacity: 1,
      ripple: 0
    });
  });

  test('pulse grows, fades, and returns smoothly to its initial appearance', () => {
    const props: PulseRippleProps = {pulseEnabled: true, pulseExpansion: 3};
    expect(getPulseRippleUniforms(props, 0)).toEqual({radiusScale: 1, opacity: 1, ripple: 0});
    expect(getPulseRippleUniforms(props, 500)).toEqual({radiusScale: 3, opacity: 0.4, ripple: 0});
    expect(getPulseRippleUniforms(props, 250)).toEqual(getPulseRippleUniforms(props, 1250));
    expect(getPulseRippleUniforms(props, 1000)).toEqual(getPulseRippleUniforms(props, 0));
  });

  test('ripple expands and fades, with speed controlling the cycle duration', () => {
    const props: PulseRippleProps = {pulseEnabled: true, pulseMode: 'ripple', pulseExpansion: 3};
    expect(getPulseRippleUniforms(props, 500)).toEqual({radiusScale: 2, opacity: 0.25, ripple: 1});
    expect(getPulseRippleUniforms({...props, pulseSpeed: 2}, 250)).toEqual(
      getPulseRippleUniforms(props, 500)
    );
    expect(getPulseRippleUniforms({...props, pulseSpeed: 2}, 500)).toEqual(
      getPulseRippleUniforms(props, 0)
    );
    expect(getPulseRippleUniforms(props, 999).opacity).toBeLessThan(0.00001);
  });

  test('missing and nonfinite numeric settings use safe defaults', () => {
    for (const value of [undefined, NaN, Infinity, -Infinity]) {
      expect(
        getPulseRippleUniforms({pulseEnabled: true, pulseSpeed: value, pulseExpansion: value}, 500)
      ).toEqual(
        getPulseRippleUniforms({pulseEnabled: true, pulseSpeed: 1, pulseExpansion: 2}, 500)
      );
    }
    for (const time of [NaN, Infinity, -1]) {
      expect(getPulseRippleUniforms({pulseEnabled: true}, time)).toEqual({
        radiusScale: 1,
        opacity: 1,
        ripple: 0
      });
    }
  });

  test('out-of-range settings cannot invert or excessively expand points', () => {
    expect(
      getPulseRippleUniforms({pulseEnabled: true, pulseSpeed: 0, pulseExpansion: -5}, 5000)
    ).toEqual({radiusScale: 1, opacity: 0.4, ripple: 0});
    expect(
      getPulseRippleUniforms({pulseEnabled: true, pulseSpeed: 100, pulseExpansion: 100}, 500)
    ).toEqual({radiusScale: 5, opacity: 0.4, ripple: 0});
  });

  test('updates GPU uniforms and requests redraw only for visible, enabled, nonempty points', () => {
    const extension = new PulseRippleExtension();
    const setProps = jest.fn();
    const redraw = jest.fn();
    const host = {
      props: {pulseEnabled: true, visible: true},
      getModels: () => [{shaderInputs: {setProps}}],
      getNumInstances: () => 2,
      setNeedsRedraw: redraw
    };
    extension.draw.call(host as unknown as Layer<PulseRippleProps>);
    expect(setProps).toHaveBeenCalledWith({pulseRipple: expect.objectContaining({ripple: 0})});
    expect(redraw).toHaveBeenCalledTimes(1);
    for (const changes of [
      {props: {pulseEnabled: false, visible: true}},
      {props: {pulseEnabled: true, visible: false}},
      {getNumInstances: () => 0},
      {getModels: () => []}
    ]) {
      redraw.mockClear();
      extension.draw.call({...host, ...changes} as unknown as Layer<PulseRippleProps>);
      expect(redraw).not.toHaveBeenCalled();
    }
  });
});
