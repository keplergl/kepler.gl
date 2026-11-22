// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Effect} from '@kepler.gl/types';
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import SurfaceFogElevationSectionFactory from './surface-fog-section';
import EffectAnimationControl from './effect-animation-control';
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
function setupAnimation(parameters: Record<string, unknown> = {}, animation?: Effect['animation']) {
  const update = jest.fn();
  const view = render(
    <EffectAnimationControl
      effect={
        {
          ...effect(parameters),
          animation: animation ?? {
            height: [
              {
                id: 'height-1',
                startValue: parameters.height ?? 10,
                endValue: parameters.height ?? 10,
                easing: 'easeInOut',
                startTimeMs: 0,
                endTimeMs: 10000
              }
            ]
          }
        } as Effect
      }
      blockId="height-1"
      name="height"
      RangeSlider={Slider}
      step={1}
      updateEffectConfig={update}
    />,
    {wrapper: Wrapper}
  );
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

  test('ignores obsolete fog animation flags when adding a block', () => {
    const {update} = setupAnimation({
      height: 100,
      heightEnd: 0,
      animateHeight: true,
      linearEasing: true
    });
    const dialog = within(screen.getByRole('group', {name: /^Effect Transition:/}));
    expect(
      (
        within(dialog.getByRole('group', {name: 'End value'})).getByRole(
          'spinbutton'
        ) as HTMLInputElement
      ).value
    ).toBe('100');
    expect(
      (dialog.getByRole('checkbox', {name: 'Linear easing'}) as HTMLInputElement).checked
    ).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });

  test('saving a new height block writes explicit times without changing unrelated parameters', () => {
    const {update} = setupAnimation({height: 100, heightEnd: 500, animateHeight: true});
    const dialog = within(screen.getByRole('group', {name: /^Effect Transition:/}));
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '800'}}
    );
    fireEvent.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, 'fog', {
      animation: {
        height: [
          {
            id: 'height-1',
            startValue: 100,
            endValue: 800,
            easing: 'easeInOut',
            startTimeMs: 0,
            endTimeMs: 10000
          }
        ]
      }
    });
  });

  test('removing a height block preserves static parameters', () => {
    const {update} = setupAnimation(
      {height: 100},
      {
        height: [
          {
            id: 'height-1',
            startValue: 100,
            endValue: 500,
            easing: 'linear',
            startTimeMs: 0,
            endTimeMs: 10000
          }
        ]
      }
    );
    fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
    expect(update).toHaveBeenCalledWith(null, 'fog', {
      animation: {}
    });
  });

  test('opens explicit height timing independently of obsolete fog flags', () => {
    const {update, rerender} = setupAnimation();
    const next = effect({height: 100, heightEnd: 500, animateHeight: true, linearEasing: true});
    next.animation = {
      height: [
        {
          id: 'height-1',
          startValue: 0,
          endValue: 0,
          easing: 'easeInOut',
          startTimeMs: 2000,
          endTimeMs: 7000
        }
      ]
    };
    rerender(
      <EffectAnimationControl
        key="replacement"
        effect={next}
        blockId="height-1"
        name="height"
        RangeSlider={Slider}
        step={1}
        updateEffectConfig={update}
      />
    );
    const dialog = within(screen.getByRole('group', {name: /^Effect Transition:/}));
    expect(dialog.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(2);
    expect(dialog.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(7);
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
