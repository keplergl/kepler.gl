// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer} from '@deck.gl/core';
import PulseRippleExtension, {
  getPulseRippleUniforms,
  PulseRippleProps,
  encodePulseTime,
  isPulseTimeActive,
  EventPulseRippleExtension,
  EventPulseRippleProps
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

describe('Recorded event Pulse / Ripple', () => {
  test('has one half-open event window, including epoch zero, without looping', () => {
    for (const start of [0, Date.UTC(2026, 10, 2)]) {
      for (const [offset, active] of [
        [-1, false],
        [0, true],
        [500, true],
        [999, true],
        [1000, false],
        [1500, false],
        [2000, false]
      ] as const) {
        expect(isPulseTimeActive(start + offset, start, 1000)).toBe(active);
      }
    }
    for (const value of [null, undefined, NaN, Infinity]) {
      expect(isPulseTimeActive(value, 0, 1000)).toBe(false);
    }
    for (const duration of [0, -1, NaN, Infinity]) {
      expect(isPulseTimeActive(0, 0, duration)).toBe(false);
    }
  });
  test('preserves millisecond differences across long datasets and rejects missing times', () => {
    const start = Date.UTC(2026, 10, 2) - Date.UTC(2000, 0, 1);
    for (const offset of [0, 1, 499, 500, 999, 1000, 1001]) {
      const a = encodePulseTime(start).map(Math.fround);
      const b = encodePulseTime(start + offset).map(Math.fround);
      const gpuAge = Math.fround(Math.fround(b[0] - a[0]) + Math.fround(b[1] - a[1]));
      expect(gpuAge).toBe(offset);
    }
    expect(encodePulseTime(0)).toEqual([0, 0, 1]);
    for (const value of [null, undefined, NaN, Infinity, -Infinity]) {
      expect(encodePulseTime(value)).toEqual([0, 0, 0]);
    }
  });

  test('uses only the playhead, including pause, scrubbing and replay; never requests redraw', () => {
    const extension = new EventPulseRippleExtension();
    const setProps = jest.fn();
    const redraw = jest.fn();
    const host = {
      props: {pulseCurrentTime: 500, pulseDurationMs: 1000, pulseExpansion: 3, pulseMode: 'ripple'},
      getModels: () => [{shaderInputs: {setProps}}],
      setNeedsRedraw: redraw
    };
    for (const time of [500, 500, 1200, -1, 0, 500]) {
      host.props.pulseCurrentTime = time;
      extension.draw.call(host as unknown as Layer<EventPulseRippleProps>);
      expect(setProps).toHaveBeenLastCalledWith({
        eventPulse: {
          currentTime: encodePulseTime(time),
          duration: 1000,
          expansion: 3,
          ripple: 1
        }
      });
    }
    expect(redraw).not.toHaveBeenCalled();
    for (const duration of [0, -1, NaN, Infinity]) {
      host.props.pulseDurationMs = duration;
      extension.draw.call(host as unknown as Layer<EventPulseRippleProps>);
      expect(setProps).toHaveBeenLastCalledWith({
        eventPulse: expect.objectContaining({duration: 0})
      });
    }
  });
});
