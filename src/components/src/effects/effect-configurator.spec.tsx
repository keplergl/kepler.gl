// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Effect} from '@kepler.gl/types';
import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import EffectConfiguratorFactory from './effect-configurator';
import RangeSliderFactory from '../common/range-slider';
import EffectTimeConfiguratorFactory from './effect-time-configurator';
import SurfaceFogElevationSectionFactory from './surface-fog-section';

// Exercise configuration routing independently of child controls' pointer/popover mechanics.
jest.mock('./compact-color-picker', () => ({
  __esModule: true,
  default: ({color, onSetColor}: {color: number[]; onSetColor: (color: number[]) => void}) => (
    <button onClick={() => onSetColor([0, 20, 30])}>{JSON.stringify(color)}</button>
  )
}));
const Slider = (({value1, range = [0, 1], step, onChange}) => (
  <input
    aria-label="parameter"
    type="number"
    value={value1}
    min={range[0]}
    max={range[1]}
    step={step}
    onChange={event => onChange?.([0, Number(event.target.value)])}
  />
)) as ReturnType<typeof RangeSliderFactory>;
const Time = (({onChange}) => (
  <>
    <button onClick={() => onChange({timestamp: 0, timezone: 'UTC', timeMode: 'pick'})}>
      epoch
    </button>
    <button onClick={() => onChange({timestamp: null, timezone: '', timeMode: undefined})}>
      incomplete time
    </button>
  </>
)) as ReturnType<typeof EffectTimeConfiguratorFactory>;
const Elevation = (() => <div>elevation section</div>) as ReturnType<
  typeof SurfaceFogElevationSectionFactory
>;
const Configurator = EffectConfiguratorFactory(Slider, Time, Elevation);
function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </IntlProvider>
  );
}
function makeEffect(descriptions: unknown[], parameters = {}, uniforms = {}): Effect {
  return {
    id: 'effect',
    type: 'test',
    parameters,
    deckEffect: {module: {propTypes: uniforms}},
    getParameterDescriptions: () => descriptions
  } as unknown as Effect;
}
function setup(effect: Effect) {
  const update = jest.fn();
  const view = render(<Configurator effect={effect} updateEffectConfig={update} />, {
    wrapper: Wrapper
  });
  return {update, ...view};
}
function change(index: number, value: number) {
  fireEvent.change(screen.getAllByRole('spinbutton')[index], {target: {value: String(value)}});
}

describe('effect parameter editing', () => {
  test('updates one component of a wrapped array without discarding its sibling', () => {
    const {update} = setup(
      makeEffect(
        [{name: 'center', type: 'array', defaultValue: [0, 0], label: ['x', 'y']}],
        {center: [0.2, 0.8]},
        {center: {value: [0, 0]}}
      )
    );
    change(0, 0);
    expect(update).toHaveBeenLastCalledWith(undefined, 'effect', {parameters: {center: [0, 0.8]}});
    change(1, 0.5);
    expect(update).toHaveBeenLastCalledWith(undefined, 'effect', {
      parameters: {center: [0.2, 0.5]}
    });
  });

  test('omits private shader parameters and unsupported descriptions', () => {
    setup(
      makeEffect(
        [{name: 'private'}, {name: 'unknown'}, {name: 'badArray', type: 'array'}],
        {},
        {
          private: {private: true, value: 1}
        }
      )
    );
    expect(screen.queryByRole('spinbutton')).toBeNull();
  });

  test('edits plain numeric uniforms with descriptor limits and explicit zero', () => {
    const {update} = setup(
      makeEffect([{name: 'amount', min: -2, max: 2}], {amount: 0}, {amount: 1})
    );
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect([input.value, input.min, input.max]).toEqual(['0', '-2', '2']);
    change(0, -1);
    expect(update).toHaveBeenCalledWith(undefined, 'effect', {parameters: {amount: -1}});
  });

  test('uses soft shader bounds when no descriptor or hard bounds are provided', () => {
    const {update} = setup(
      makeEffect([{name: 'amount'}], {}, {amount: {value: 0, softMin: -20, softMax: 30}})
    );
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect([input.min, input.max, input.step]).toEqual(['-20', '30', '1']);
    change(0, 12);
    expect(update).toHaveBeenCalledWith(undefined, 'effect', {parameters: {amount: 12}});
  });

  test('descriptor bounds override shader bounds without losing a zero minimum', () => {
    setup(
      makeEffect(
        [{name: 'amount', min: 0, max: 1}],
        {amount: 0},
        {amount: {value: 2, min: -10, max: 100}}
      )
    );
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect([input.value, input.min, input.max, input.step]).toEqual(['0', '0', '1', '0.001']);
  });

  test('supports described parameters absent from shader uniforms', () => {
    const {update, rerender} = setup(
      makeEffect([{name: 'size', min: 0, max: 20, defaultValue: 5}])
    );
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('5');
    change(0, 9);
    expect(update).toHaveBeenCalledWith(undefined, 'effect', {parameters: {size: 9}});
    rerender(
      <Configurator
        effect={makeEffect([{name: 'size', min: 0, max: 20, defaultValue: 5}], {size: 0})}
        updateEffectConfig={update}
      />
    );
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('0');
  });

  test('routes standalone color edits using the descriptor default', () => {
    const {update} = setup(makeEffect([{name: 'tint', type: 'color', defaultValue: [1, 2, 3]}]));
    fireEvent.click(screen.getByRole('button', {name: '[1,2,3]'}));
    expect(update).toHaveBeenCalledWith(null, 'effect', {parameters: {tint: [0, 20, 30]}});
  });

  test('checkbox click dispatches once and can disable a saved value', () => {
    const {update} = setup(makeEffect([{name: 'enabled', type: 'checkbox'}], {enabled: true}));
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(null, 'effect', {parameters: {enabled: false}});
  });

  test('paired color checkbox label enables it without changing its color', () => {
    const {update} = setup(
      makeEffect([
        {name: 'tint', type: 'color'},
        {name: 'enabled', type: 'checkbox', label: 'use tint'}
      ])
    );
    fireEvent.click(screen.getByText('use tint'));
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(null, 'effect', {parameters: {enabled: true}});
  });

  test('paired checkbox hint does not toggle the setting', () => {
    const {update} = setup(
      makeEffect([
        {name: 'tint', type: 'color'},
        {name: 'enabled', type: 'checkbox', tooltip: 'Use the selected tint'}
      ])
    );
    fireEvent.click(screen.getByText('?'));
    expect(update).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(update).toHaveBeenCalledTimes(1);
  });

  test('elevation animation uses one specialized section instead of duplicate generic controls', () => {
    setup(
      makeEffect([
        {name: 'height', min: 0, max: 100},
        {name: 'heightEnd', min: 0, max: 100},
        {name: 'animateHeight', type: 'checkbox'},
        {name: 'linearEasing', type: 'checkbox'}
      ])
    );
    expect(screen.getAllByText('elevation section')).toHaveLength(1);
    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  test('replacement effect edits use the latest id, parameters and handler', () => {
    const descriptions = [{name: 'center', type: 'array', defaultValue: [0, 0]}];
    const {update, rerender} = setup(makeEffect(descriptions, {center: [0, 0]}, {center: [0, 0]}));
    const replacement = jest.fn();
    rerender(
      <Configurator
        effect={{...makeEffect(descriptions, {center: [0.1, 0.9]}, {center: [0, 0]}), id: 'new'}}
        updateEffectConfig={replacement}
      />
    );
    change(0, 0.4);
    expect(update).not.toHaveBeenCalled();
    expect(replacement).toHaveBeenCalledWith(undefined, 'new', {parameters: {center: [0.4, 0.9]}});
  });

  test('shadow time edits preserve Unix epoch zero and omit absent time fields', () => {
    const effect = {...makeEffect([]), type: LIGHT_AND_SHADOW_EFFECT.type};
    const {update} = setup(effect);
    fireEvent.click(screen.getByText('epoch'));
    expect(update).toHaveBeenLastCalledWith(null, 'effect', {
      parameters: {timestamp: 0, timezone: 'UTC', timeMode: 'pick'}
    });
    fireEvent.click(screen.getByText('incomplete time'));
    expect(update).toHaveBeenLastCalledWith(null, 'effect', {parameters: {}});
  });

  test('shadow intensity controls update their own parameter rather than every light', () => {
    const {update} = setup({
      ...makeEffect([{name: 'shadowIntensity', min: 0, max: 2}], {
        shadowIntensity: 0.2,
        ambientLightIntensity: 0.4,
        sunLightIntensity: 0.6
      }),
      type: LIGHT_AND_SHADOW_EFFECT.type
    });
    change(0, 0);
    change(1, 0.7);
    change(2, 0.8);
    expect(update.mock.calls.map(call => call[2])).toEqual([
      {parameters: {shadowIntensity: 0}},
      {parameters: {ambientLightIntensity: 0.7}},
      {parameters: {sunLightIntensity: 0.8}}
    ]);
  });
});
