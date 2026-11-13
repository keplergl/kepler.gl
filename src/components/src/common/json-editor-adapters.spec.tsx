// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {Filter} from '@kepler.gl/types';
import {Effect} from '@kepler.gl/effects';
import {initApplicationConfig} from '@kepler.gl/utils';
import AnimationControlFactory, {
  AnimationJsonEditorFactory
} from './animation-control/animation-json-editor';
import FilterJsonEditorFactory from '../side-panel/filter-panel/filter-json-editor';
import EffectJsonEditorFactory from '../effects/effect-json-editor';
import {animationConfigToJson, jsonToMapState, mapStateToJson} from './json-editor-utils';

// Keep serialization, the editor and its apply flow real; inject state/actions at
// the Redux boundary so each adapter can be exercised without a whole map.
jest.mock('../injector', () => ({
  withState: () => (Component: React.ComponentType) => Component
}));

const AnimationEditor = AnimationJsonEditorFactory();
const FilterEditor = FilterJsonEditorFactory();
const EffectEditor = EffectJsonEditorFactory();
const filter = {
  id: 'time-filter',
  type: FILTER_TYPES.timeRange,
  dataId: ['source'],
  name: ['time'],
  value: [0, 100],
  domain: [0, 100],
  enabled: true
} as Filter;
const state = {
  ...INITIAL_VIS_STATE,
  filters: [filter],
  animationConfig: {...INITIAL_VIS_STATE.animationConfig, currentTime: 0, speed: 1}
};

function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider locale="en" messages={{}}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </IntlProvider>
  );
}

function edit(value: unknown) {
  fireEvent.change(screen.getByRole('textbox'), {target: {value: JSON.stringify(value)}});
  fireEvent.click(screen.getByTestId('json-editor-apply'));
}

function displayedConfig() {
  return JSON.parse((screen.getByRole('textbox') as HTMLTextAreaElement).value);
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
  initApplicationConfig({});
});

describe('JSON editor section adapters', () => {
  test('animation edits dispatch timeline config, including time zero, and forward close', () => {
    const setAnimationConfig = jest.fn();
    const onClose = jest.fn();
    render(
      <AnimationEditor
        visState={state}
        setAnimationConfig={setAnimationConfig}
        onClose={onClose}
      />,
      {wrapper: Wrapper}
    );
    edit({currentTime: 0, speed: 2, isAnimating: false});
    expect(setAnimationConfig).toHaveBeenCalledWith({currentTime: 0, speed: 2, isAnimating: false});
    expect(screen.getByText('Config applied')).toBeTruthy();
    fireEvent.click(screen.getByTestId('json-editor-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('filter animation edits target the selected filter and cannot replace its identity', () => {
    const applyFilterConfig = jest.fn();
    const setAnimationConfig = jest.fn();
    render(
      <AnimationEditor
        filterId={filter.id}
        visState={state}
        applyFilterConfig={applyFilterConfig}
        setAnimationConfig={setAnimationConfig}
        onClose={jest.fn()}
      />,
      {wrapper: Wrapper}
    );
    edit({id: 'other', type: 'select', dataId: ['other-source'], value: [0, 25]});
    expect(applyFilterConfig).toHaveBeenCalledWith(filter.id, {...filter, value: [0, 25]});
    expect(setAnimationConfig).not.toHaveBeenCalled();
  });

  test.each(['missing-filter', 'missing-action'])('animation handles %s without dispatch', mode => {
    const applyFilterConfig = jest.fn();
    render(
      <AnimationEditor
        filterId={mode === 'missing-filter' ? 'removed' : filter.id}
        visState={state}
        applyFilterConfig={mode === 'missing-action' ? undefined : applyFilterConfig}
        onClose={jest.fn()}
      />,
      {wrapper: Wrapper}
    );
    edit({value: [10, 20]});
    expect(applyFilterConfig).not.toHaveBeenCalled();
    expect(screen.getByText("Couldn't apply config")).toBeTruthy();
  });

  test('non-object JSON and thrown action errors remain editable and can recover', () => {
    const setAnimationConfig = jest.fn().mockImplementationOnce(() => {
      throw new Error('timeline rejected');
    });
    render(
      <AnimationEditor
        visState={state}
        setAnimationConfig={setAnimationConfig}
        onClose={jest.fn()}
      />,
      {wrapper: Wrapper}
    );
    edit([]);
    expect(setAnimationConfig).not.toHaveBeenCalled();
    expect(screen.getByText(/JSON must be an object/)).toBeTruthy();
    edit({speed: 2});
    expect(screen.getByText(/timeline rejected/)).toBeTruthy();
    edit({speed: 3});
    expect(setAnimationConfig).toHaveBeenLastCalledWith({speed: 3});
    expect(screen.getByText('Config applied')).toBeTruthy();
  });

  test('timeline updates debounce, preserve dirty edits, and reset to the latest config', () => {
    const props = {setAnimationConfig: jest.fn(), onClose: jest.fn()};
    const view = render(<AnimationEditor {...props} visState={state} />, {wrapper: Wrapper});
    view.rerender(
      <AnimationEditor
        {...props}
        visState={{...state, animationConfig: {...state.animationConfig, currentTime: 50}}}
      />
    );
    expect(displayedConfig().currentTime).toBe(0);
    act(() => jest.advanceTimersByTime(300));
    expect(displayedConfig().currentTime).toBe(50);
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"speed":9}'}});
    view.rerender(
      <AnimationEditor
        {...props}
        visState={{...state, animationConfig: {...state.animationConfig, currentTime: 75}}}
      />
    );
    act(() => jest.advanceTimersByTime(300));
    expect(displayedConfig()).toEqual({speed: 9});
    fireEvent.click(screen.getByTestId('json-editor-reset'));
    expect(displayedConfig().currentTime).toBe(75);
  });

  test('editor wheel and drag events do not reach the timeline', () => {
    const wheel = jest.fn();
    const mouseDown = jest.fn();
    render(
      <div onWheel={wheel} onMouseDown={mouseDown}>
        <AnimationEditor visState={state} onClose={jest.fn()} />
      </div>,
      {wrapper: Wrapper}
    );
    fireEvent.wheel(screen.getByRole('textbox'));
    fireEvent.mouseDown(screen.getByRole('textbox'));
    expect(wheel).not.toHaveBeenCalled();
    expect(mouseDown).not.toHaveBeenCalled();
  });

  test('animation control respects feature flags and chooses filter only for time ranges', () => {
    const Probe = ({filterId, onClose}: {filterId?: string; onClose: () => void}) => (
      <button onClick={onClose}>{filterId || 'timeline'}</button>
    );
    const Control = AnimationControlFactory(Probe);
    initApplicationConfig({enableJsonEditors: true, enableAnimationJsonEditor: true});
    const view = render(<Control filter={filter} />, {wrapper: Wrapper});
    fireEvent.click(view.container.querySelector('.animation-json-control-button') as HTMLElement);
    fireEvent.click(screen.getByText(filter.id));
    expect(screen.queryByText(filter.id)).toBeNull();
    view.rerender(<Control filter={{...filter, type: FILTER_TYPES.range}} />);
    fireEvent.click(view.container.querySelector('.animation-json-control-button') as HTMLElement);
    expect(screen.getByText('timeline')).toBeTruthy();
    view.rerender(<Control showAnimationWindowControl />);
    expect(view.container.querySelector('.animation-json-control-button')).toBeNull();
    initApplicationConfig({enableJsonEditors: false});
    view.rerender(<Control />);
    expect(view.container.querySelector('.animation-json-control-button')).toBeNull();
  });

  test('filter section applies current filter edits and rejects non-object JSON', () => {
    const applyFilterConfig = jest.fn();
    const view = render(
      <FilterEditor filter={filter} visState={state} applyFilterConfig={applyFilterConfig} />,
      {wrapper: Wrapper}
    );
    edit({value: [10, 90], enabled: false});
    expect(applyFilterConfig).toHaveBeenCalledWith(filter.id, {
      ...filter,
      value: [10, 90],
      enabled: false
    });
    const replacement = {...filter, id: 'replacement'};
    view.rerender(
      <FilterEditor filter={replacement} visState={state} applyFilterConfig={applyFilterConfig} />
    );
    edit(null);
    expect(applyFilterConfig).toHaveBeenCalledTimes(1);
    edit({value: [0, 10]});
    expect(applyFilterConfig).toHaveBeenLastCalledWith(replacement.id, {
      ...replacement,
      value: [0, 10]
    });
  });

  test('effect section drops runtime state, preserves identity, and surfaces action errors', () => {
    const effect = new Effect({
      id: 'effect',
      type: 'brightnessContrast',
      isEnabled: true,
      parameters: {brightness: 0}
    });
    const updateEffect = jest.fn();
    render(<EffectEditor effect={effect} updateEffect={updateEffect} />, {wrapper: Wrapper});
    edit({
      id: 'wrong',
      type: 'wrong',
      deckEffect: {runtime: true},
      isEnabled: false,
      parameters: {brightness: 0.2}
    });
    expect(updateEffect).toHaveBeenCalledWith(effect.id, {
      id: effect.id,
      type: effect.type,
      isEnabled: false,
      parameters: {brightness: 0.2}
    });
    updateEffect.mockImplementationOnce(() => {
      throw new Error('effect rejected');
    });
    edit({parameters: {brightness: 0.3}});
    expect(screen.getByText(/effect rejected/)).toBeTruthy();
  });

  test('animation serialization omits runtime fields without losing falsy configuration', () => {
    const input = {
      ...state.animationConfig,
      currentTime: 0,
      isAnimating: false,
      hideControl: false,
      runtimeOnly: 'ignore'
    };
    expect(JSON.parse(animationConfigToJson(input))).toMatchObject({
      currentTime: 0,
      isAnimating: false,
      hideControl: false
    });
    expect(JSON.parse(animationConfigToJson(input))).not.toHaveProperty('runtimeOnly');
    expect(animationConfigToJson(undefined)).toBe('{}');
    expect(animationConfigToJson(filter)).toBe('{}');
    expect(JSON.parse(animationConfigToJson(filter, state.schema))).toHaveProperty('id', filter.id);
  });

  test('viewport adapter uses saved schema for split-map and zero camera values', () => {
    const input = {
      latitude: 0,
      longitude: 0,
      zoom: 0,
      bearing: 0,
      pitch: 0,
      isSplit: true,
      splitMapViewports: [{zoom: 2}, {zoom: 3}]
    } as Parameters<typeof mapStateToJson>[0];
    const json = mapStateToJson(input);
    expect(jsonToMapState(json)).toMatchObject({
      latitude: 0,
      longitude: 0,
      zoom: 0,
      bearing: 0,
      pitch: 0,
      isSplit: true
    });
    expect(() => jsonToMapState('[]')).toThrow('JSON must be an object');
  });
});
