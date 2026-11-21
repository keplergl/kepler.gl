// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Effect} from '@kepler.gl/types';
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import SurfaceFogElevationSectionFactory from './surface-fog-section';
import RangeSliderFactory from '../common/range-slider';

// Isolate the slider's pointer mechanics while exercising real fog configuration.
const Slider = (({value1, onChange}: {value1: number; onChange: (value: number[]) => void}) => (
  <input
    aria-label="elevation"
    type="number"
    value={value1}
    onChange={event => onChange([0, Number(event.target.value)])}
  />
)) as ReturnType<typeof RangeSliderFactory>;
const Section = SurfaceFogElevationSectionFactory(Slider);
const descriptions = [
  {name: 'height', min: -200, max: 6000, defaultValue: 10},
  {name: 'heightEnd', min: -100, max: 7000, defaultValue: 1000},
  {name: 'animateHeight'},
  {name: 'linearEasing'}
];
function effect(parameters: Record<string, unknown> = {}, desc = descriptions) {
  return {
    id: 'fog',
    type: SURFACE_FOG_TYPE,
    parameters,
    getParameterDescriptions: () => desc
  } as unknown as Effect;
}
function Wrapper({children}: {children: React.ReactNode}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
function setup(parameters: Record<string, unknown> = {}, desc = descriptions) {
  const update = jest.fn();
  const view = render(<Section effect={effect(parameters, desc)} updateEffectConfig={update} />, {
    wrapper: Wrapper
  });
  return {update, ...view};
}

describe('surface fog elevation editing', () => {
  test('does not offer an elevation control when height is absent', () => {
    const {container} = setup(
      {},
      descriptions.filter(d => d.name !== 'height')
    );
    expect(container.firstChild).toBeNull();
  });

  test('uses the descriptor default and preserves explicit zero without showing extra controls', () => {
    const {rerender} = setup();
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('10');
    expect(screen.queryByRole('checkbox')).toBeNull();
    rerender(<Section effect={effect({height: 0, heightEnd: 0})} updateEffectConfig={jest.fn()} />);
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('0');
  });

  test('updates elevation without replacing animation or unrelated parameters', () => {
    const {update} = setup({height: 100, heightEnd: 500, animateHeight: true});
    fireEvent.change(screen.getByRole('spinbutton'), {target: {value: '200'}});
    expect(update).toHaveBeenLastCalledWith(undefined, 'fog', {parameters: {height: 200}});
  });

  test('opens legacy endpoint and easing without migrating on open', () => {
    const {update} = setup({height: 100, heightEnd: 0, animateHeight: true, linearEasing: true});
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for height'}));
    const dialog = within(screen.getByRole('dialog'));
    expect(
      (
        within(dialog.getByRole('group', {name: 'End value'})).getByRole(
          'spinbutton'
        ) as HTMLInputElement
      ).value
    ).toBe('0');
    expect(
      (dialog.getByRole('checkbox', {name: 'Linear easing'}) as HTMLInputElement).checked
    ).toBe(true);
    expect(update).not.toHaveBeenCalled();
  });

  test('saving a legacy endpoint uses generic animation and disables the legacy flag', () => {
    const {update} = setup({height: 100, heightEnd: 500, animateHeight: true});
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for height'}));
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '800'}}
    );
    fireEvent.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, 'fog', {
      animation: {height: {startValue: 100, endValue: 800, easing: 'easeInOut'}},
      parameters: {height: 100, animateHeight: false}
    });
  });

  test('removing legacy animation prevents it from reappearing', () => {
    const {update} = setup({height: 100, heightEnd: 500, animateHeight: true});
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for height'}));
    fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
    expect(update).toHaveBeenCalledWith(null, 'fog', {
      animation: {},
      parameters: {animateHeight: false}
    });
  });

  test('generic height animation takes precedence over legacy settings', () => {
    const {update, rerender} = setup();
    const next = effect({height: 100, heightEnd: 500, animateHeight: true, linearEasing: true});
    next.animation = {height: {endValue: 0, easing: 'easeInOut'}};
    rerender(<Section effect={next} updateEffectConfig={update} />);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for height'}));
    const dialog = within(screen.getByRole('dialog'));
    expect(
      (
        within(dialog.getByRole('group', {name: 'End value'})).getByRole(
          'spinbutton'
        ) as HTMLInputElement
      ).value
    ).toBe('0');
    expect(
      (dialog.getByRole('checkbox', {name: 'Linear easing'}) as HTMLInputElement).checked
    ).toBe(false);
  });

  test('uses current effect identity and callback after replacement', () => {
    const {update, rerender} = setup({height: 100});
    const replacement = jest.fn();
    const next = {...effect({height: 200, heightEnd: 800}), id: 'replacement'};
    rerender(<Section effect={next} updateEffectConfig={replacement} />);
    fireEvent.change(screen.getByRole('spinbutton'), {target: {value: '300'}});
    expect(update).not.toHaveBeenCalled();
    expect(replacement).toHaveBeenCalledWith(undefined, 'replacement', {parameters: {height: 300}});
  });
});
