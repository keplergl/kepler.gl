// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Effect} from '@kepler.gl/types';
import {createEffect} from '@kepler.gl/effects';
import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import EffectConfiguratorFactory from './effect-configurator';
import RangeSliderFactory from '../common/range-slider';
import EffectTimeConfiguratorFactory from './effect-time-configurator';
import SurfaceFogElevationSectionFactory from './surface-fog-section';

// Exercise configuration routing independently of child controls' pointer/popover mechanics.
jest.mock('./compact-color-picker', () => ({
  ...jest.requireActual('./compact-color-picker'),
  __esModule: true,
  default: ({color, onSetColor, labelAction, label}) => (
    <>
      {labelAction}
      <button
        aria-label={label === 'Start color' || label === 'End color' ? label : undefined}
        onClick={() => onSetColor(label === 'Start color' ? [40, 50, 60] : [0, 20, 30])}
      >
        {JSON.stringify(color)}
      </button>
    </>
  )
}));
jest.mock('../side-panel/layer-panel/single-color-palette', () => ({
  __esModule: true,
  default: ({onSelectColor}) => (
    <button onClick={() => onSelectColor([0, 20, 30])}>Choose end color</button>
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
const RealConfigurator = EffectConfiguratorFactory(
  RangeSliderFactory(
    () => <></>,
    () => <></>
  ),
  Time,
  Elevation
);
function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider
      locale="en"
      messages={{'effectManager.date': 'Date', 'effectManager.time': 'Time'}}
    >
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
function setup(effect: Effect, Component = Configurator) {
  const update = jest.fn();
  const view = render(<Component effect={effect} updateEffectConfig={update} />, {
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

  test('shadow resolution presets are keyboard-accessible and reflect the saved selection', async () => {
    const user = userEvent.setup();
    const effect = {...makeEffect([]), type: LIGHT_AND_SHADOW_EFFECT.type};
    const {rerender, update} = setup(effect);
    const presets = within(screen.getByRole('group', {name: /shadow map resolution/i}));
    expect(presets.getByRole('button', {name: 'Auto', pressed: true})).toBeVisible();
    presets.getByRole('button', {name: 'High', pressed: false}).focus();
    await user.keyboard('{Enter}');
    expect(update).toHaveBeenCalledWith(null, 'effect', {
      parameters: {shadowMapResolution: 1.5}
    });

    rerender(
      <Configurator
        effect={{...effect, parameters: {shadowMapResolution: 1.5}}}
        updateEffectConfig={update}
      />
    );
    expect(presets.getByRole('button', {name: 'High', pressed: true})).toBeVisible();
    expect(presets.getByRole('button', {name: 'Auto', pressed: false})).toBeVisible();
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

  test('animation opens from the keyboard without saving and Escape discards the draft', async () => {
    const user = userEvent.setup();
    const {update} = setup(makeEffect([{name: 'amount', min: 0, max: 1}], {amount: 0.5}));
    screen.getByRole('button', {name: 'Animate amount'}).focus();
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog', {name: 'Effect Transition: amount'});
    fireEvent.change(
      within(within(dialog).getByRole('group', {name: 'Start value'})).getByRole('spinbutton'),
      {target: {value: '0.25'}}
    );
    fireEvent.change(
      within(within(dialog).getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '0'}}
    );
    expect(update).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(update).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Animate amount'}));
  });

  test('transition help is accessible on focus without changing configuration', async () => {
    const {update} = setup(makeEffect([{name: 'amount', min: 0, max: 1}], {amount: 0.5}));
    fireEvent.click(screen.getByRole('button', {name: 'Animate amount'}));
    const help = screen.getByRole('button', {name: 'About effect transitions'});
    fireEvent.focus(help);
    const tooltip = await screen.findByRole('tooltip');
    expect(help).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent(/Run in the effects panel or during video export/);
    expect(update).not.toHaveBeenCalled();
  });

  test.each([
    [2, 3],
    [2.25, 3.75],
    [0.5, 50]
  ])(
    'preserves Magnify zoom Start %s and End %s through real input blur and Save',
    async (start, end) => {
      const user = userEvent.setup();
      const effect = createEffect({type: 'magnify', parameters: {zoom: start}});
      const {update} = setup(effect, RealConfigurator);
      await user.click(screen.getByRole('button', {name: 'Animate zoom'}));
      const dialog = within(screen.getByRole('dialog'));
      const startInput = dialog.getByRole('spinbutton', {name: 'Start value'});
      const endInput = dialog.getByRole('spinbutton', {name: 'End value'});
      await user.click(startInput);
      await user.click(endInput);
      expect(startInput).toHaveValue(start);
      await user.clear(endInput);
      await user.type(endInput, String(end));
      await user.click(dialog.getByRole('button', {name: 'Save'}));
      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(null, effect.id, {
        parameters: {zoom: start},
        animation: {zoom: {startValue: start, endValue: end, easing: 'easeInOut'}}
      });
    }
  );

  test('labels real vector inputs by endpoint and component and saves only the edited component', async () => {
    const user = userEvent.setup();
    const effect = createEffect({type: 'magnify'});
    const {update} = setup(effect, RealConfigurator);
    await user.click(screen.getByRole('button', {name: 'Animate screenXY'}));
    const dialog = within(screen.getByRole('dialog'));
    const inputs = ['Start', 'End'].flatMap(endpoint =>
      ['Position X', 'Position Y'].map(component =>
        dialog.getByRole('spinbutton', {name: `${endpoint} value (${component})`})
      )
    );
    expect(new Set(inputs.map(input => input.id)).size).toBe(4);
    await user.click(dialog.getByText('End value (Position Y)'));
    expect(inputs[3]).toHaveFocus();
    await user.clear(inputs[3]);
    await user.type(inputs[3], '0.75');
    await user.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, effect.id, {
      parameters: {screenXY: [0.5, 0.5]},
      animation: {screenXY: {startValue: [0.5, 0.5], endValue: [0.5, 0.75], easing: 'easeInOut'}}
    });
  });

  test('keeps the saved Start when the main slider changes and the animation editor reopens', () => {
    const effect = createEffect({type: 'brightnessContrast', parameters: {brightness: 0}});
    const {update, rerender} = setup(effect);
    update.mockImplementation((_event, _id, props) => {
      effect.setProps(props);
      rerender(<Configurator effect={effect} updateEffectConfig={update} />);
    });
    fireEvent.click(screen.getByRole('button', {name: 'Animate brightness'}));
    fireEvent.change(
      within(screen.getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '1'}}
    );
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(effect.animation?.brightness).toEqual({
      startValue: 0,
      endValue: 1,
      easing: 'easeInOut'
    });

    // This is the ordinary effect slider, outside the animation editor.
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {target: {value: '0.7'}});
    expect(effect.parameters.brightness).toBe(0.7);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for brightness'}));
    expect(
      within(screen.getByRole('group', {name: 'Start value'})).getByRole('spinbutton')
    ).toHaveValue(0);
    expect(
      within(screen.getByRole('group', {name: 'End value'})).getByRole('spinbutton')
    ).toHaveValue(1);
  });

  test('Cancel discards both endpoint drafts and reopening uses saved values', () => {
    const effect = makeEffect([{name: 'amount', min: 0, max: 1}], {amount: 0.5});
    effect.animation = {amount: {endValue: 0.8, easing: 'linear'}};
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for amount'}));
    fireEvent.change(
      within(screen.getByRole('group', {name: 'Start value'})).getByRole('spinbutton'),
      {target: {value: '0.1'}}
    );
    fireEvent.change(
      within(screen.getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '0.2'}}
    );
    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    expect(update).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for amount'}));
    expect(
      (
        within(screen.getByRole('group', {name: 'Start value'})).getByRole(
          'spinbutton'
        ) as HTMLInputElement
      ).value
    ).toBe('0.5');
    expect(
      (
        within(screen.getByRole('group', {name: 'End value'})).getByRole(
          'spinbutton'
        ) as HTMLInputElement
      ).value
    ).toBe('0.8');
  });

  test('saves draft start, zero endpoint and easing together while preserving other animations', () => {
    const effect = makeEffect([{name: 'amount', min: 0, max: 1}], {amount: 0.5});
    effect.animation = {other: {endValue: 0.8, easing: 'easeInOut'}};
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Animate amount'}));
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'Start value'})).getByRole('spinbutton'),
      {target: {value: '0.25'}}
    );
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'End value'})).getByRole('spinbutton'),
      {target: {value: '0'}}
    );
    fireEvent.click(dialog.getByRole('checkbox', {name: 'Linear easing'}));
    fireEvent.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(null, 'effect', {
      animation: {
        other: {endValue: 0.8, easing: 'easeInOut'},
        amount: {startValue: 0.25, endValue: 0, easing: 'linear'}
      },
      parameters: {amount: 0.25}
    });
    expect(effect.parameters.amount).toBe(0.5);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('removes only the selected animation without applying the draft start', () => {
    const effect = makeEffect([{name: 'amount', min: 0, max: 1}], {amount: 0.5});
    effect.animation = {
      amount: {endValue: 0.1, easing: 'linear'},
      other: {endValue: 0.8, easing: 'easeInOut'}
    };
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for amount'}));
    fireEvent.change(
      within(screen.getByRole('group', {name: 'Start value'})).getByRole('spinbutton'),
      {target: {value: '0.9'}}
    );
    fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
    expect(update).toHaveBeenCalledWith(null, 'effect', {
      animation: {other: {endValue: 0.8, easing: 'easeInOut'}}
    });
  });

  test('edits vector endpoints together without changing sibling components', () => {
    const {update} = setup(
      makeEffect(
        [{name: 'center', type: 'array', min: 0, max: 1, defaultValue: [0, 0], label: ['X', 'Y']}],
        {center: [0.2, 0.8]},
        {center: {value: [0, 0]}}
      )
    );
    expect(screen.getAllByRole('button', {name: 'Animate center'})).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', {name: 'Animate center'}));
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'Start value'})).getAllByRole('spinbutton')[1],
      {target: {value: '0.4'}}
    );
    fireEvent.change(
      within(dialog.getByRole('group', {name: 'End value'})).getAllByRole('spinbutton')[0],
      {target: {value: '0'}}
    );
    fireEvent.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, 'effect', {
      animation: {center: {startValue: [0.2, 0.4], endValue: [0, 0.8], easing: 'easeInOut'}},
      parameters: {center: [0.2, 0.4]}
    });
  });

  test('offers date/time, color and shadow intensity endpoints', () => {
    const effect = makeEffect(
      [
        {name: 'shadowIntensity', min: 0, max: 1},
        {name: 'shadowColor', type: 'color', min: 0, max: 255, defaultValue: [0, 0, 0]},
        {name: 'timestamp', min: 0, max: Number.MAX_SAFE_INTEGER}
      ],
      {shadowIntensity: 0.5, shadowColor: [10, 20, 30]}
    );
    effect.type = LIGHT_AND_SHADOW_EFFECT.type;
    const {update} = setup(effect);
    expect(screen.getByRole('button', {name: 'Animate shadowIntensity'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Animate Date & Time'})).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {name: 'Animate shadowColor'}));
    fireEvent.click(screen.getByRole('button', {name: 'Start color'}));
    fireEvent.click(screen.getByRole('button', {name: 'End color'}));
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, 'effect', {
      animation: {
        shadowColor: {startValue: [40, 50, 60], endValue: [0, 20, 30], easing: 'easeInOut'}
      },
      parameters: {shadowColor: [40, 50, 60]}
    });
  });

  test('edits shadow Start and End using real date/time pickers in the effect timezone', () => {
    const effect = createEffect({
      type: LIGHT_AND_SHADOW_EFFECT.type,
      parameters: {
        timestamp: Date.UTC(2026, 5, 21, 19),
        timezone: 'America/Los_Angeles',
        timeMode: 'animation'
      },
      animation: {
        timestamp: {
          startValue: Date.UTC(2026, 5, 21, 13),
          endValue: Date.UTC(2026, 5, 22, 1),
          easing: 'linear'
        },
        shadowIntensity: {startValue: 0.2, endValue: 0.8, easing: 'easeInOut'}
      }
    });
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for Date & Time'}));
    const dialog = within(screen.getByRole('dialog', {name: 'Effect Transition: Date & Time'}));
    expect(dialog.getByRole('spinbutton', {name: 'Start hour'})).toHaveValue(6);
    expect(dialog.getByRole('spinbutton', {name: 'End hour'})).toHaveValue(6);
    expect(dialog.getByRole('combobox', {name: 'Start AM/PM'})).toHaveValue('am');
    expect(dialog.getByRole('combobox', {name: 'End AM/PM'})).toHaveValue('pm');
    fireEvent.change(dialog.getByRole('spinbutton', {name: 'Start hour'}), {target: {value: '7'}});
    fireEvent.change(dialog.getByRole('spinbutton', {name: 'End day'}), {target: {value: '22'}});
    expect(update).not.toHaveBeenCalled();
    fireEvent.click(dialog.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, effect.id, {
      animation: {
        ...effect.animation,
        timestamp: {
          startValue: Date.UTC(2026, 5, 21, 14),
          endValue: Date.UTC(2026, 5, 23, 1),
          easing: 'linear'
        }
      },
      parameters: {timestamp: Date.UTC(2026, 5, 21, 14)}
    });
    expect(effect.parameters.timeMode).toBe('animation');
  });

  test('supports epoch zero and rejects incomplete date/time endpoints without saving', () => {
    const effect = createEffect({
      type: LIGHT_AND_SHADOW_EFFECT.type,
      parameters: {timestamp: 0, timezone: 'UTC', timeMode: 'current'}
    });
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Animate Date & Time'}));
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByRole('spinbutton', {name: 'Start year'})).toHaveValue(1970);
    expect(dialog.getByRole('spinbutton', {name: 'Start hour'})).toHaveValue(12);
    expect(dialog.getByRole('button', {name: 'Save'})).toBeEnabled();
    fireEvent.change(dialog.getByRole('spinbutton', {name: 'End minute'}), {target: {value: ''}});
    expect(dialog.getByRole('button', {name: 'Save'})).toBeDisabled();
    fireEvent.change(dialog.getByRole('spinbutton', {name: 'End day'}), {target: {value: '2'}});
    expect(dialog.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(dialog.getByRole('spinbutton', {name: 'End minute'})).toHaveValue(null);
    fireEvent.change(dialog.getByRole('spinbutton', {name: 'End minute'}), {target: {value: '30'}});
    expect(dialog.getByRole('button', {name: 'Save'})).toBeEnabled();
    fireEvent.click(dialog.getByRole('button', {name: 'Cancel'}));
    expect(update).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {name: 'Animate Date & Time'}));
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(update).toHaveBeenCalledWith(null, effect.id, {
      animation: {timestamp: {startValue: 0, endValue: 0, easing: 'easeInOut'}},
      parameters: {timestamp: 0}
    });
  });

  test('removing a custom shadow time range preserves its normal clock and other animations', () => {
    const effect = createEffect({
      type: LIGHT_AND_SHADOW_EFFECT.type,
      parameters: {timestamp: 0, timezone: 'UTC', timeMode: 'animation'},
      animation: {
        timestamp: {startValue: 0, endValue: 3600000, easing: 'linear'},
        shadowIntensity: {endValue: 0.8, easing: 'linear'}
      }
    });
    const {update} = setup(effect);
    fireEvent.click(screen.getByRole('button', {name: 'Edit animation for Date & Time'}));
    fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
    expect(update).toHaveBeenCalledWith(null, effect.id, {
      animation: {shadowIntensity: {endValue: 0.8, easing: 'linear'}}
    });
  });
});
