// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render, screen, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {createEffect} from '@kepler.gl/effects';
import {appInjector} from '../index';
import EffectConfiguratorFactory from './effect-configurator';
import WaterSimulationControls from './water-simulation-controls';

test('capture readiness gates playback and the controls follow runtime state', () => {
  let status = {ready: false, running: false, message: 'Ready to capture'};
  const listeners = new Set<() => void>();
  const simulation = {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => status,
    capture: jest.fn(),
    toggleRunning: jest.fn(),
    reset: jest.fn()
  };
  const view = render(
    <ThemeProvider theme={theme}>
      <WaterSimulationControls
        effect={{isEnabled: true, parameters: {rain: 0.01}, deckEffect: simulation} as any}
        onRainChange={jest.fn()}
      />
    </ThemeProvider>
  );
  expect((screen.getByRole('button', {name: 'Start'}) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', {name: 'Capture current view'}));
  expect(simulation.capture).toHaveBeenCalledTimes(1);
  act(() => {
    status = {ready: true, running: false, message: 'Captured'};
    listeners.forEach(fn => fn());
  });
  fireEvent.click(screen.getByRole('button', {name: 'Start'}));
  expect(simulation.toggleRunning).toHaveBeenCalledTimes(1);
  act(() => {
    status = {...status, running: true};
    listeners.forEach(fn => fn());
  });
  fireEvent.click(screen.getByRole('button', {name: 'Pause'}));
  expect(simulation.toggleRunning).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole('button', {name: 'Reset water'}));
  expect(simulation.reset).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('status').textContent).toBe('Captured');
  view.unmount();
  expect(listeners.size).toBe(0);
});

test('water settings expose a bounded resolution slider', () => {
  const EffectConfigurator = appInjector.get(EffectConfiguratorFactory);
  const effect = createEffect({id: 'water', type: 'waterSimulation'});
  const updateEffectConfig = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en">
        <EffectConfigurator effect={effect} updateEffectConfig={updateEffectConfig} />
      </IntlProvider>
    </ThemeProvider>
  );
  const resolution = screen.getByDisplayValue('256');
  fireEvent.change(resolution, {target: {value: '512'}});
  fireEvent.blur(resolution);
  expect(updateEffectConfig).toHaveBeenLastCalledWith(undefined, 'water', {
    parameters: {resolution: 512}
  });
  fireEvent.change(resolution, {target: {value: '2048'}});
  fireEvent.blur(resolution);
  expect(updateEffectConfig).toHaveBeenLastCalledWith(undefined, 'water', {
    parameters: {resolution: 1024}
  });
});

test('rainfall presets replace the slider and update the saved value and runtime effect', () => {
  const EffectConfigurator = appInjector.get(EffectConfiguratorFactory);
  const effect = createEffect({id: 'water', type: 'waterSimulation'});
  const capture = jest.spyOn(effect.deckEffect, 'capture');
  const updateEffectConfig = jest.fn((_event, _id, config) => {
    effect.setProps(config);
    view.rerender(content());
  });
  const content = () => (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en">
        <EffectConfigurator effect={effect} updateEffectConfig={updateEffectConfig} />
      </IntlProvider>
    </ThemeProvider>
  );
  const view = render(content());
  const group = within(screen.getByRole('group', {name: 'Rainfall'}));
  expect(group.getAllByRole('button')).toHaveLength(4);
  expect(group.getByRole('button', {name: 'Low'})).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByDisplayValue('0.01')).not.toBeInTheDocument();
  for (const [name, rain] of [
    ['High', 0.1],
    ['Mid', 0.05],
    ['Low', 0.01],
    ['Off', 0]
  ] as const) {
    fireEvent.click(group.getByRole('button', {name}));
    expect(updateEffectConfig).toHaveBeenLastCalledWith(null, 'water', {parameters: {rain}});
    expect(effect.parameters.rain).toBe(rain);
    expect(effect.deckEffect.props.rain).toBe(rain);
    expect(group.getByRole('button', {name, pressed: true})).toBeInTheDocument();
    expect(group.getAllByRole('button', {pressed: true})).toHaveLength(1);
  }
  expect(capture).not.toHaveBeenCalled();
});
