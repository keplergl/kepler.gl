// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {ChartConfig, Filter} from '@kepler.gl/types';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import LayerJsonEditorFactory from '../side-panel/layer-panel/layer-json-editor';
import {Effect} from '@kepler.gl/effects';
import {initApplicationConfig} from '@kepler.gl/utils';
import AnimationControlFactory, {
  AnimationJsonEditorFactory
} from './animation-control/animation-json-editor';
import FilterJsonEditorFactory from '../side-panel/filter-panel/filter-json-editor';
import EffectJsonEditorFactory from '../effects/effect-json-editor';
import ChartJsonEditorFactory from '../map/charts/chart-json-editor';
import JsonEditor from './json-editor';
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

describe('layer JSON editor validation and dispatch', () => {
  const LayerEditor = LayerJsonEditorFactory();

  function fixture() {
    const dataset = new KeplerTable({info: {id: 'points'}, color: [0, 0, 0]}).updateSchema({
      fields: [
        {name: 'latitude', type: 'real'},
        {name: 'longitude', type: 'real'}
      ] as any,
      rows: [[37, -122]]
    });
    const layer = new KeplerGlLayers.PointLayer({id: 'point-layer', dataId: dataset.id});
    layer.updateLayerConfig({
      columns: {
        ...layer.config.columns,
        lat: {...layer.config.columns.lat, value: 'latitude', fieldIdx: 0},
        lng: {...layer.config.columns.lng, value: 'longitude', fieldIdx: 1}
      }
    });
    const visState = {...INITIAL_VIS_STATE, datasets: {[dataset.id]: dataset}, layers: [layer]};
    const config = {
      id: layer.id,
      type: 'point',
      config: {
        dataId: dataset.id,
        label: 'Edited points',
        columns: {lat: 'latitude', lng: 'longitude'},
        isVisible: false,
        visConfig: {radius: 0}
      }
    };
    return {layer, visState, config};
  }

  test('validates coordinate columns and dispatches edits with the current layer index', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn();
    render(<LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />, {
      wrapper: Wrapper
    });
    edit(config);
    expect(applyLayerConfig).toHaveBeenCalledWith(layer.id, config, 0);
    expect(layer.config.label).not.toBe(config.config.label);
    expect(layer.config.isVisible).toBe(true);
  });

  test('saved schema JSON can be edited and passed back without dropping visual channels', () => {
    const {layer, visState} = fixture();
    const applyLayerConfig = jest.fn();
    render(<LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />, {
      wrapper: Wrapper
    });
    const saved = displayedConfig();
    expect(saved).toHaveProperty('visualChannels');
    saved.config.label = 'Restored points';
    edit(saved);
    expect(applyLayerConfig).toHaveBeenCalledWith(layer.id, saved, 0);
  });

  test('rejects a removed dataset and can apply after it becomes available again', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn();
    const view = render(
      <LayerEditor
        layer={layer}
        visState={{...visState, datasets: {}}}
        applyLayerConfig={applyLayerConfig}
      />,
      {wrapper: Wrapper}
    );
    edit(config);
    expect(applyLayerConfig).not.toHaveBeenCalled();
    expect(screen.getByText(/Dataset "points" not found/)).toBeTruthy();
    view.rerender(
      <LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />
    );
    edit(config);
    expect(applyLayerConfig).toHaveBeenCalledTimes(1);
  });

  test('rejects a layer type absent from the registered classes', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn();
    render(<LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />, {
      wrapper: Wrapper
    });
    edit({...config, type: 'unregistered'});
    expect(applyLayerConfig).not.toHaveBeenCalled();
    expect(screen.getByText(/Layer has invalid type/)).toBeTruthy();
  });

  test('rejects a required coordinate column that no longer exists', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn();
    render(<LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />, {
      wrapper: Wrapper
    });
    edit({...config, config: {...config.config, columns: {lat: 'deleted', lng: 'longitude'}}});
    expect(applyLayerConfig).not.toHaveBeenCalled();
    expect(screen.getByText(/missing or invalid columns: lat/)).toBeTruthy();
  });

  test('reports an unavailable apply action rather than reporting success', () => {
    const {layer, visState, config} = fixture();
    render(<LayerEditor layer={layer} visState={visState} />, {wrapper: Wrapper});
    edit(config);
    expect(screen.getByText("Couldn't apply config")).toBeTruthy();
    expect(screen.queryByText('Config applied')).toBeNull();
  });

  test('does not dispatch when map state is unavailable', () => {
    const {layer, config} = fixture();
    const applyLayerConfig = jest.fn();
    render(<LayerEditor layer={layer} applyLayerConfig={applyLayerConfig} />, {wrapper: Wrapper});
    edit(config);
    expect(applyLayerConfig).not.toHaveBeenCalled();
    expect(screen.getByText("Couldn't apply config")).toBeTruthy();
  });

  test('surfaces reducer errors and permits a corrected retry', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn().mockImplementationOnce(() => {
      throw new Error('layer rejected');
    });
    render(<LayerEditor layer={layer} visState={visState} applyLayerConfig={applyLayerConfig} />, {
      wrapper: Wrapper
    });
    edit(config);
    expect(screen.getByText(/layer rejected/)).toBeTruthy();
    edit({...config, config: {...config.config, label: 'Retry'}});
    expect(applyLayerConfig).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Config applied')).toBeTruthy();
  });

  test('recomputes the target index after layers are reordered', () => {
    const {layer, visState, config} = fixture();
    const firstAction = jest.fn();
    const nextAction = jest.fn();
    const view = render(
      <LayerEditor layer={layer} visState={visState} applyLayerConfig={firstAction} />,
      {wrapper: Wrapper}
    );
    const other = new KeplerGlLayers.PointLayer({id: 'other'});
    view.rerender(
      <LayerEditor
        layer={layer}
        visState={{...visState, layers: [other, layer]}}
        applyLayerConfig={nextAction}
      />
    );
    edit(config);
    expect(firstAction).not.toHaveBeenCalled();
    expect(nextAction).toHaveBeenCalledWith(layer.id, config, 1);
  });

  test('does not send a negative index when the edited layer has been removed', () => {
    const {layer, visState, config} = fixture();
    const applyLayerConfig = jest.fn();
    render(
      <LayerEditor
        layer={layer}
        visState={{...visState, layers: []}}
        applyLayerConfig={applyLayerConfig}
      />,
      {wrapper: Wrapper}
    );
    edit(config);
    expect(applyLayerConfig).toHaveBeenCalledWith(layer.id, config, undefined);
  });
});

describe('chart JSON editor validation and dispatch', () => {
  const ChartEditor = ChartJsonEditorFactory();
  const chart: ChartConfig = {
    id: 'chart',
    type: 'bigNumber',
    title: 'Count',
    dataId: 'points',
    applyFilters: true,
    display: {},
    chartDisplay: {}
  };
  function fixture() {
    const dataset = new KeplerTable({info: {id: 'points'}, color: [0, 0, 0]}).updateSchema({
      fields: [{name: 'value', type: 'integer'}] as any,
      rows: [[1]]
    });
    return {...INITIAL_VIS_STATE, datasets: {points: dataset}};
  }

  test('applies a schema-serialized chart without losing its saved chart settings', () => {
    const updateChart = jest.fn();
    const onClose = jest.fn();
    render(
      <ChartEditor
        chart={chart}
        visState={fixture()}
        updateChart={updateChart}
        onClose={onClose}
      />,
      {wrapper: Wrapper}
    );
    const saved = displayedConfig();
    edit({
      ...saved,
      title: 'Edited',
      applyFilters: false,
      id: 'not-the-current-chart',
      display: {isConfigActive: true}
    });
    expect(updateChart).toHaveBeenCalledWith(
      chart.id,
      expect.objectContaining({
        id: chart.id,
        title: 'Edited',
        applyFilters: false,
        dataId: 'points',
        chartDisplay: {},
        display: {isConfigActive: true, isJsonEditorActive: true}
      })
    );
    fireEvent.click(screen.getByTestId('json-editor-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test.each(['state', 'action'])('does not report success without the chart %s', missing => {
    const updateChart = jest.fn();
    render(
      <ChartEditor
        chart={chart}
        visState={missing === 'state' ? undefined : fixture()}
        updateChart={missing === 'action' ? undefined : updateChart}
      />,
      {wrapper: Wrapper}
    );
    edit({...chart, title: 'Edited'});
    expect(updateChart).not.toHaveBeenCalled();
    expect(screen.getByText("Couldn't apply config")).toBeTruthy();
  });

  test('rejects a removed layer and recovers when that layer becomes available', () => {
    const updateChart = jest.fn();
    const visState = fixture();
    const view = render(
      <ChartEditor chart={chart} visState={visState} updateChart={updateChart} />,
      {wrapper: Wrapper}
    );
    const layerChart = {
      ...chart,
      type: 'layerChart',
      layerId: 'point-layer',
      layerChartType: 'bar'
    };
    edit(layerChart);
    expect(updateChart).not.toHaveBeenCalled();
    expect(screen.getByText(/Layer "point-layer" not found/)).toBeTruthy();
    const layer = new KeplerGlLayers.PointLayer({id: 'point-layer', dataId: 'points'});
    view.rerender(
      <ChartEditor
        chart={chart}
        visState={{...visState, layers: [layer]}}
        updateChart={updateChart}
      />
    );
    edit(layerChart);
    expect(updateChart).toHaveBeenCalledWith(
      chart.id,
      expect.objectContaining({type: 'layerChart', layerId: layer.id})
    );
  });

  test('does not dispatch a chart whose selected dataset has been removed', () => {
    const updateChart = jest.fn();
    render(
      <ChartEditor
        chart={chart}
        visState={{...fixture(), datasets: {}}}
        updateChart={updateChart}
      />,
      {wrapper: Wrapper}
    );
    edit({...chart, title: 'Edited'});
    expect(updateChart).not.toHaveBeenCalled();
    expect(screen.getByText(/Dataset "points" not found/)).toBeTruthy();
  });

  test('uses the current chart identity and action after a chart replacement', () => {
    const oldAction = jest.fn();
    const nextAction = jest.fn();
    const visState = fixture();
    const view = render(<ChartEditor chart={chart} visState={visState} updateChart={oldAction} />, {
      wrapper: Wrapper
    });
    view.rerender(
      <ChartEditor
        chart={{...chart, id: 'replacement'}}
        visState={visState}
        updateChart={nextAction}
      />
    );
    edit({...chart, title: 'Edited'});
    expect(oldAction).not.toHaveBeenCalled();
    expect(nextAction).toHaveBeenCalledWith(
      'replacement',
      expect.objectContaining({id: 'replacement'})
    );
  });

  test('preserves dirty chart edits across debounced changes and resets to the latest saved chart', () => {
    const visState = fixture();
    const view = render(<ChartEditor chart={chart} visState={visState} />, {wrapper: Wrapper});
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"title":"draft"}'}});
    view.rerender(<ChartEditor chart={{...chart, title: 'External update'}} visState={visState} />);
    act(() => jest.advanceTimersByTime(300));
    expect(displayedConfig()).toEqual({title: 'draft'});
    fireEvent.click(screen.getByTestId('json-editor-reset'));
    expect(displayedConfig().title).toBe('External update');
  });

  test('reports failed chart application and permits a subsequent corrected apply', () => {
    const updateChart = jest.fn().mockImplementationOnce(() => {
      throw new Error('chart rejected');
    });
    render(<ChartEditor chart={chart} visState={fixture()} updateChart={updateChart} />, {
      wrapper: Wrapper
    });
    edit({...chart, title: 'First attempt'});
    expect(screen.getByText(/chart rejected/)).toBeTruthy();
    edit({...chart, title: 'Second attempt'});
    expect(updateChart).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Config applied')).toBeTruthy();
  });
});

describe('shared JSON editing commands', () => {
  test('formats valid object JSON but prevents formatting or applying invalid syntax', () => {
    const onApply = jest.fn();
    render(<JsonEditor jsonText="{}" onApply={onApply} />, {wrapper: Wrapper});
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":0,"visible":false}'}});
    fireEvent.click(screen.getByTestId('json-editor-format'));
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(
      JSON.stringify({zoom: 0, visible: false}, null, 2)
    );
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":'}});
    expect((screen.getByTestId('json-editor-format') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId('json-editor-apply') as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByTestId('json-editor-apply'));
    expect(onApply).not.toHaveBeenCalled();
  });

  test.each(['ctrlKey', 'metaKey'])(
    'saves valid edits with %s+S and prevents the browser save action',
    modifier => {
      const onApply = jest.fn().mockReturnValue({status: 'success'});
      render(<JsonEditor jsonText="{}" onApply={onApply} />, {wrapper: Wrapper});
      fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":4}'}});
      const event = new KeyboardEvent('keydown', {
        key: 's',
        [modifier]: true,
        bubbles: true,
        cancelable: true
      });
      fireEvent(screen.getByRole('textbox'), event);
      expect(event.defaultPrevented).toBe(true);
      expect(onApply).toHaveBeenCalledWith('{"zoom":4}');
    }
  );

  test('copies the edited text rather than the last saved config', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText}});
    try {
      render(<JsonEditor jsonText="{}" />, {wrapper: Wrapper});
      fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":4}'}});
      await act(async () => fireEvent.click(screen.getByRole('button', {name: 'Copy JSON'})));
      expect(writeText).toHaveBeenCalledWith('{"zoom":4}');
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  test('a clipboard denial does not discard edits or prevent applying them', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('clipboard denied'));
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText}});
    try {
      const onApply = jest.fn().mockReturnValue({status: 'success'});
      render(<JsonEditor jsonText="{}" onApply={onApply} />, {wrapper: Wrapper});
      fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":4}'}});
      await act(async () => fireEvent.click(screen.getByRole('button', {name: 'Copy JSON'})));
      fireEvent.click(screen.getByTestId('json-editor-apply'));
      expect(onApply).toHaveBeenCalledWith('{"zoom":4}');
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  test('read-only mode disables mutation commands and the save shortcut', () => {
    const onApply = jest.fn();
    render(<JsonEditor jsonText='{"zoom":4}' isReadOnly onApply={onApply} />, {wrapper: Wrapper});
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).readOnly).toBe(true);
    expect(screen.queryByTestId('json-editor-apply')).toBeNull();
    expect(screen.queryByTestId('json-editor-format')).toBeNull();
    fireEvent.keyDown(screen.getByRole('textbox'), {key: 's', ctrlKey: true});
    expect(onApply).not.toHaveBeenCalled();
  });

  test('clears feedback after its timeout without dropping the applied text', () => {
    const onApply = jest.fn().mockReturnValue({status: 'success', message: 'Saved successfully'});
    render(<JsonEditor jsonText="{}" onApply={onApply} />, {wrapper: Wrapper});
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '{"zoom":4}'}});
    fireEvent.click(screen.getByTestId('json-editor-apply'));
    expect(screen.getByText('Saved successfully')).toBeTruthy();
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.queryByText('Saved successfully')).toBeNull();
    expect(displayedConfig()).toEqual({zoom: 4});
  });
});
