// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {Provider, useSelector} from 'react-redux';
import {createStore} from 'redux';
import {IntlProvider, useIntl} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {createEffect} from '@kepler.gl/effects';
import {theme} from '@kepler.gl/styles';
import type {Effect} from '@kepler.gl/types';
import EffectManagerFactory from './effect-manager';
import EffectAnimationPreviewProvider, {
  EffectAnimationPreviewContext
} from './effect-animation-preview';

const Manager = EffectManagerFactory(
  (() => null) as Parameters<typeof EffectManagerFactory>[0],
  (({children}) => <div>{children}</div>) as Parameters<typeof EffectManagerFactory>[1],
  (() => null) as Parameters<typeof EffectManagerFactory>[2]
);

let now: number;
let frames: Map<number, FrameRequestCallback>;

beforeEach(() => {
  now = 0;
  frames = new Map();
  let nextFrame = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    frames.delete(id);
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

function advanceFrame(time: number) {
  now = time;
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach(callback => callback(time)));
}

function animatedBrightness() {
  return createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0, contrast: 0.3},
    animation: {brightness: {endValue: 1, easing: 'linear'}}
  });
}

function setup(effects: Effect[], enabled = true) {
  const initialState = {visState: {effects, effectOrder: effects.map(effect => effect.id)}};
  const store = createStore((state = initialState, action: {type: string; effects?: Effect[]}) =>
    action.type === 'replaceEffects' && action.effects
      ? {visState: {effects: action.effects, effectOrder: action.effects.map(effect => effect.id)}}
      : state
  );
  let previewEffects: Effect[] | null = null;
  function MapPreview() {
    const playback = useContext(EffectAnimationPreviewContext);
    const saved = useSelector((state: typeof initialState) => state.visState.effects);
    previewEffects = playback?.effects ?? null;
    return (
      <output aria-label="Rendered effects">
        {JSON.stringify((previewEffects ?? saved).map(effect => effect.parameters))}
      </output>
    );
  }
  function Content({active}: {active: boolean}) {
    const intl = useIntl();
    const saved = useSelector((state: typeof initialState) => state.visState.effects);
    return (
      <EffectAnimationPreviewProvider effects={saved} enabled={active}>
        <Manager intl={intl} />
        <MapPreview />
      </EffectAnimationPreviewProvider>
    );
  }
  const tree = (active: boolean) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={{'effectManager.effects': 'Effects'}}>
          <Content active={active} />
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
  const view = render(tree(enabled));
  return {
    ...view,
    store,
    getPreviewEffects: () => previewEffects,
    parameters: () => JSON.parse(screen.getByLabelText('Rendered effects').textContent || '[]'),
    setEnabled: (active: boolean) => view.rerender(tree(active)),
    replaceEffects: (next: Effect[]) => {
      act(() => store.dispatch({type: 'replaceEffects', effects: next}));
    }
  };
}

describe('effects panel animation preview', () => {
  test.each<[string, () => Effect[]]>([
    ['empty effects', () => []],
    ['missing animation', () => [createEffect({type: 'brightnessContrast'})]],
    [
      'invalid endpoint',
      () => [
        createEffect({
          type: 'brightnessContrast',
          animation: {brightness: {endValue: NaN, easing: 'linear'}}
        })
      ]
    ],
    [
      'invalid start',
      () => {
        const effect = animatedBrightness();
        effect.parameters.brightness = Infinity;
        return [effect];
      }
    ],
    [
      'disabled effect',
      () => {
        const effect = animatedBrightness();
        effect.setProps({isEnabled: false});
        return [effect];
      }
    ]
  ])('hides Run for %s', (_name, createEffects) => {
    setup(createEffects());
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
    expect(frames.size).toBe(0);
  });

  test('previews all configured values over ten seconds without changing saved starts', () => {
    const effects = [
      animatedBrightness(),
      createEffect({
        id: 'fog',
        type: 'surfaceFog',
        parameters: {
          height: 0,
          animateHeight: true,
          heightEnd: 100,
          linearEasing: false,
          fogColor: [0, 40, 80]
        },
        animation: {fogColor: {endValue: [80, 0, 40], easing: 'linear'}}
      })
    ];
    const saved = effects.map(effect => ({
      parameters: structuredClone(effect.parameters),
      animation: structuredClone(effect.animation)
    }));
    const view = setup(effects);
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(screen.getByRole('button', {name: 'Running'})).toBeDisabled();
    expect(view.getPreviewEffects()?.[0]).not.toBe(effects[0]);
    expect(view.parameters()[0]).toMatchObject({brightness: 0, contrast: 0.3});

    advanceFrame(0);
    advanceFrame(2500);
    expect(view.parameters()[0]).toMatchObject({brightness: 0.25, contrast: 0.3});
    expect(view.parameters()[1]).toMatchObject({height: 15.625, fogColor: [20, 30, 70]});
    advanceFrame(5000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(view.parameters()[1]).toMatchObject({height: 50, fogColor: [40, 20, 60]});
    expect(screen.getByRole('button', {name: 'Running'})).toBeDisabled();
    advanceFrame(10000);
    expect(view.parameters()[0].brightness).toBe(1);
    expect(view.parameters()[1]).toMatchObject({height: 100, fogColor: [80, 0, 40]});
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
    expect(frames.size).toBe(0);
    expect(effects.map(({parameters, animation}) => ({parameters, animation}))).toEqual(saved);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    expect(view.parameters()[1]).toMatchObject({height: 0, fogColor: [0, 40, 80]});
    advanceFrame(12500);
    expect(view.parameters()[0].brightness).toBe(0.25);
    expect(effects.map(({parameters, animation}) => ({parameters, animation}))).toEqual(saved);
  });

  test('uses the configured Start after static edits and restores the current static value', () => {
    const effect = animatedBrightness();
    const animation = {brightness: {startValue: 0, endValue: 1, easing: 'linear' as const}};
    effect.setProps({animation});
    const view = setup([effect]);
    effect.setProps({parameters: {brightness: 0.7}});
    view.replaceEffects([effect]);
    expect(view.parameters()[0].brightness).toBe(0.7);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    advanceFrame(5000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(effect.parameters.brightness).toBe(0.7);
    advanceFrame(10000);
    expect(view.parameters()[0].brightness).toBe(1);
    expect(effect.parameters.brightness).toBe(0.7);
    expect(effect.animation).toEqual(animation);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    // Mirror deck.gl retaining the original effect while accepting preview uniforms.
    effect.deckEffect.setProps(view.getPreviewEffects()?.[0].deckEffect.props);
    expect(effect.deckEffect.props.brightness).toBe(0);
    view.setEnabled(false);
    expect(view.getPreviewEffects()).toBeNull();
    expect(view.parameters()[0].brightness).toBe(0.7);
    expect(effect.parameters.brightness).toBe(0.7);
    expect(effect.deckEffect.props.brightness).toBe(0.7);
    expect(effect.animation).toEqual(animation);
    expect(frames.size).toBe(0);
  });

  test('runs explicit sunlight dates without changing the saved time mode', () => {
    const start = Date.UTC(2024, 5, 21);
    const end = start + 24 * 60 * 60 * 1000;
    const effect = createEffect({
      type: 'lightAndShadow',
      parameters: {timeMode: 'animation', timestamp: 0},
      animation: {timestamp: {startValue: start, endValue: end, easing: 'linear'}}
    });
    const view = setup([effect]);
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0]).toMatchObject({timeMode: 'pick', timestamp: start});
    advanceFrame(5000);
    expect(view.parameters()[0].timestamp).toBe(start + (end - start) / 2);
    advanceFrame(10000);
    expect(view.parameters()[0].timestamp).toBe(end);
    expect(effect.parameters).toMatchObject({timeMode: 'animation', timestamp: 0});
    view.setEnabled(false);
    expect(view.parameters()[0]).toMatchObject({timeMode: 'animation', timestamp: 0});
  });

  test('shows Run when an animation is configured and removes it when cleared', () => {
    const effect = createEffect({type: 'brightnessContrast'});
    const view = setup([effect]);
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
    effect.setProps({animation: {brightness: {endValue: 1, easing: 'linear'}}});
    view.replaceEffects([effect]);
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
    effect.setProps({animation: {}});
    view.replaceEffects([effect]);
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
  });

  test.each(['edit', 'disable', 'unmount'] as const)(
    'cancels playback and restores current saved runtime values on %s',
    cause => {
      const effect = animatedBrightness();
      const view = setup([effect]);
      fireEvent.click(screen.getByRole('button', {name: 'Run'}));
      advanceFrame(5000);
      const preview = view.getPreviewEffects()?.[0];
      expect(preview?.parameters.brightness).toBe(0.5);
      if (cause === 'edit') effect.setProps({parameters: {brightness: 0.2}});
      // deck.gl reuses the original runtime effect by ID, copying preview props into it.
      effect.deckEffect.setProps(preview?.deckEffect.props);
      expect(effect.deckEffect.props.brightness).toBe(0.5);
      expect(effect.parameters.brightness).toBe(cause === 'edit' ? 0.2 : 0);

      if (cause === 'edit') view.replaceEffects([effect]);
      else if (cause === 'disable') view.setEnabled(false);
      else view.unmount();

      expect(frames.size).toBe(0);
      expect(effect.deckEffect.props.brightness).toBe(cause === 'edit' ? 0.2 : 0);
      if (cause !== 'unmount') {
        expect(view.getPreviewEffects()).toBeNull();
        expect(view.parameters()[0].brightness).toBe(cause === 'edit' ? 0.2 : 0);
        if (cause === 'disable') {
          fireEvent.click(screen.getByRole('button', {name: 'Run'}));
          expect(view.getPreviewEffects()).toBeNull();
          expect(frames.size).toBe(0);
          view.setEnabled(true);
        }
        fireEvent.click(screen.getByRole('button', {name: 'Run'}));
        expect(view.parameters()[0].brightness).toBe(0);
        expect(effect.parameters.brightness).toBe(cause === 'edit' ? 0.2 : 0);
        expect(frames.size).toBe(1);
      }
    }
  );
});
