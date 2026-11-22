// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {act, fireEvent, screen, waitFor} from '@testing-library/react';
import {MapStateActions, VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {createEffect} from '@kepler.gl/effects';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import type {Annotation} from '@kepler.gl/types';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import {RootContext} from '../context';
import AnimationControlFactory, {AnimationControlProps} from './animation-control';
import MapControlFactory, {MapControlProps} from './map-control';
import MapControlPanelFactory from './map-control-panel';
import MapControlTooltipFactory from './map-control-tooltip';
import EffectAnimationPreviewProvider, {
  EffectAnimationPreviewContext
} from '../effects/effect-animation-preview';
import type {AnimationEditorProps} from '../animation/animation-editor';

const originalEnabled = getApplicationConfig().enableAnimationEditor;
beforeEach(() => initApplicationConfig({enableAnimationEditor: true}));
afterEach(() => initApplicationConfig({enableAnimationEditor: originalEnabled}));

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 0, pitch: 0};
const tour = {
  stops: [{id: 'first', name: 'First', camera, holdDurationMs: 10000, travelDurationMs: 0}]
};

function Editor(props: AnimationEditorProps) {
  return (
    <div data-testid="editor">
      <output aria-label="Editor frame">{props.playback.elapsed}</output>
      <output aria-label="Editor running">{String(props.playback.running)}</output>
      <output aria-label="Camera enabled">{String(props.cameraEnabled)}</output>
      <output aria-label="Authored effect">{props.effects[0]?.parameters.brightness}</output>
      <output aria-label="Authored annotation">{props.annotations?.[0]?.label}</output>
      <button onClick={props.playback.run}>Start preview</button>
      <button
        onClick={() =>
          props.updateEffectConfig(null, 'brightness', {parameters: {brightness: 0.4}})
        }
      >
        Save effect
      </button>
      <button onClick={props.onEditCamera}>Edit camera settings</button>
      <button
        onClick={() =>
          props.onAnnotationChange?.(props.annotations![0].id, {propertyTransitions: {opacity: []}})
        }
      >
        Clear annotation animation
      </button>
    </div>
  );
}

const AnimationControl = AnimationControlFactory(
  MapControlTooltipFactory(),
  MapControlPanelFactory(),
  Editor
);

function playbackValue() {
  return {
    effects: null,
    animationTimeMs: null,
    hasAnimation: true,
    running: true,
    elapsed: 2500,
    duration: 10000,
    run: jest.fn(),
    pause: jest.fn(),
    seek: jest.fn(),
    reset: jest.fn(),
    stop: jest.fn(),
    speed: 1,
    setSpeed: jest.fn(),
    loop: false,
    setLoop: jest.fn()
  };
}

function setup(overrides: Partial<AnimationControlProps> = {}) {
  const playback = playbackValue();
  const updateEffect = jest.fn();
  const updateAnnotation = jest.fn();
  const onEditCamera = jest.fn();
  const effect = createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0.2}
  });
  const root = document.createElement('div');
  root.className = 'kepler-gl';
  document.body.appendChild(root);
  const tree = () => (
    <IntlWrapper>
      <RootContext.Provider value={{current: root}}>
        <EffectAnimationPreviewContext.Provider value={playback}>
          <div className="maps">
            <AnimationControl
              mapState={{...INITIAL_MAP_STATE, width: 1000, height: 800}}
              mapControls={{cameraTour: {show: true, active: false}}}
              effects={[effect]}
              cameraTour={tour}
              visStateActions={{...VisStateActions, updateEffect, updateAnnotation}}
              onEditCamera={onEditCamera}
              {...overrides}
            />
          </div>
        </EffectAnimationPreviewContext.Provider>
      </RootContext.Provider>
    </IntlWrapper>
  );
  const result = renderWithTheme(tree(), {container: root});
  return {
    ...result,
    root,
    playback,
    updateEffect,
    updateAnnotation,
    onEditCamera,
    refresh: () => renderWithTheme(tree(), {container: root})
  };
}

test('the Animation editor is disabled by default', () => {
  expect(originalEnabled).toBe(false);
  initApplicationConfig({enableAnimationEditor: originalEnabled});
  setup();
  expect(screen.queryByRole('button', {name: 'Animation'})).toBeNull();
  expect(screen.queryByTestId('editor')).toBeNull();
});

test.each([false, undefined])(
  'hides an open editor when the flag is %s without changing playback',
  enabled => {
    const view = setup();
    fireEvent.click(screen.getByRole('button', {name: 'Animation'}));
    expect(screen.getByRole('region', {name: 'Animation panel'})).toBeInTheDocument();
    initApplicationConfig({enableAnimationEditor: enabled});
    view.refresh();
    expect(screen.queryByRole('button', {name: 'Animation'})).toBeNull();
    expect(screen.queryByRole('region', {name: 'Animation panel'})).toBeNull();
    expect(screen.queryByTestId('editor')).toBeNull();
    expect(view.playback.pause).not.toHaveBeenCalled();
    expect(view.playback.stop).not.toHaveBeenCalled();
    expect(view.playback.reset).not.toHaveBeenCalled();
    expect(view.updateEffect).not.toHaveBeenCalled();
    expect(view.updateAnnotation).not.toHaveBeenCalled();
  }
);

test('opens an independent floating editor and keeps authored settings accessible', () => {
  const view = setup();
  const button = screen.getByRole('button', {name: 'Animation'});
  expect(button).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(button);
  const panel = screen.getByRole('region', {name: 'Animation panel'});
  expect(view.root).toContainElement(panel);
  expect(view.root.querySelector('.maps')).not.toContainElement(panel);
  expect(screen.getByTestId('editor')).toBeInTheDocument();
  expect(screen.getByLabelText('Authored effect')).toHaveTextContent('0.2');
  expect(screen.getByLabelText('Camera enabled')).toHaveTextContent('true');
  expect(screen.getByRole('button', {name: 'Move Animation'})).toBeInTheDocument();
  expect(screen.getAllByRole('button', {name: 'Resize Animation'})).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', {name: 'Save effect'}));
  expect(view.updateEffect).toHaveBeenCalledWith('brightness', {parameters: {brightness: 0.4}});
  fireEvent.click(screen.getByRole('button', {name: 'Edit camera settings'}));
  expect(view.onEditCamera).toHaveBeenCalledTimes(1);
  fireEvent.click(panel.querySelector('.close-map-control-item')!);
  expect(screen.queryByRole('region', {name: 'Animation panel'})).toBeNull();
  expect(button).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(button);
  expect(screen.getByLabelText('Editor frame')).toHaveTextContent('2500');
  expect(view.playback.pause).not.toHaveBeenCalled();
  expect(view.playback.stop).not.toHaveBeenCalled();
  expect(view.playback.reset).not.toHaveBeenCalled();
});

test('forwards annotation tracks and writes changes through the annotation action', () => {
  const annotation = {id: 'callout', label: 'Place', isVisible: true} as Annotation;
  const view = setup({annotations: [annotation]});
  fireEvent.click(screen.getByRole('button', {name: 'Animation'}));
  expect(screen.getByLabelText('Authored annotation')).toHaveTextContent('Place');
  fireEvent.click(screen.getByRole('button', {name: 'Clear annotation animation'}));
  expect(view.updateAnnotation).toHaveBeenCalledWith('callout', {
    propertyTransitions: {opacity: []}
  });
  expect(view.updateEffect).not.toHaveBeenCalled();
});

test.each([{readOnly: true}, {isExport: true}, {isSplit: true, primary: false}])(
  'does not expose editing on excluded map surfaces: %p',
  props => {
    setup(props);
    expect(screen.queryByRole('button', {name: 'Animation'})).toBeNull();
    expect(screen.queryByTestId('editor')).toBeNull();
  }
);

test('appears once in the primary map toolbar without the Effects manager', () => {
  const Empty = () => null;
  const MapControl = MapControlFactory(
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    Empty as any,
    AnimationControl
  );
  const props = {
    mapState: {...INITIAL_MAP_STATE, width: 1000, height: 800},
    mapStateActions: MapStateActions,
    visStateActions: VisStateActions,
    mapControls: {},
    layers: [],
    isSplit: true,
    primary: true
  } as unknown as MapControlProps;
  renderWithTheme(
    <IntlWrapper>
      <EffectAnimationPreviewContext.Provider value={playbackValue()}>
        <MapControl {...props} />
      </EffectAnimationPreviewContext.Provider>
    </IntlWrapper>
  );
  expect(screen.getAllByRole('button', {name: 'Animation'})).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', {name: 'Animation'}));
  expect(screen.getByRole('region', {name: 'Animation panel'})).toBeInTheDocument();
});

test('resizes through the existing keyboard handles and keeps size after reopening', async () => {
  const view = setup();
  const rect = {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
    right: 1000,
    bottom: 800,
    toJSON: () => ({})
  };
  view.root.getBoundingClientRect = () => rect;
  fireEvent.click(screen.getByRole('button', {name: 'Animation'}));
  const panel = screen.getByRole('region', {name: 'Animation panel'});
  const floating = panel.closest('.draggable-legend') as HTMLElement;
  const content = panel.querySelector('.map-control__panel-content') as HTMLElement;
  floating.getBoundingClientRect = () => ({
    ...rect,
    x: 84,
    y: 300,
    left: 84,
    top: 300,
    width: 900,
    height: 374,
    right: 984,
    bottom: 674
  });
  Object.defineProperty(content, 'offsetHeight', {
    get: () => parseFloat(getComputedStyle(content).height)
  });
  const handle = screen.getAllByRole('button', {name: 'Resize Animation'})[0];
  handle.getBoundingClientRect = () => ({
    ...rect,
    x: 518,
    y: 294,
    left: 518,
    top: 294,
    width: 32,
    height: 12,
    right: 550,
    bottom: 306
  });
  const initialHeight = getComputedStyle(content).height;
  handle.focus();
  fireEvent.keyDown(handle, {code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {code: 'ArrowUp'});
  await waitFor(() =>
    expect(parseFloat(getComputedStyle(content).height)).toBeGreaterThan(parseFloat(initialHeight))
  );
  fireEvent.keyDown(document, {code: 'Space'});
  await waitFor(() => expect(handle).not.toHaveAttribute('aria-pressed', 'true'));
  const resizedHeight = getComputedStyle(content).height;
  fireEvent.click(panel.querySelector('.close-map-control-item')!);
  fireEvent.click(screen.getByRole('button', {name: 'Animation'}));
  expect(
    getComputedStyle(
      screen
        .getByRole('region', {name: 'Animation panel'})
        .querySelector('.map-control__panel-content')!
    ).height
  ).toBe(resizedHeight);
});

test('opening and closing the toolbar panel does not interrupt the shared camera clock', () => {
  let frame: FrameRequestCallback | undefined;
  jest.spyOn(performance, 'now').mockReturnValue(0);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frame = callback;
    return 1;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    frame = undefined;
  });
  const root = document.createElement('div');
  root.className = 'kepler-gl';
  document.body.appendChild(root);
  function Status() {
    const playback = useContext(EffectAnimationPreviewContext)!;
    return (
      <output aria-label="Playback status">
        {playback.running ? 'playing' : 'paused'}:{playback.elapsed}
      </output>
    );
  }
  try {
    renderWithTheme(
      <IntlWrapper>
        <RootContext.Provider value={{current: root}}>
          <EffectAnimationPreviewProvider
            effects={[]}
            enabled
            cameraTour={tour}
            cameraEnabled
            updateMap={jest.fn()}
          >
            <div className="maps">
              <AnimationControl
                mapState={INITIAL_MAP_STATE}
                cameraTour={tour}
                visStateActions={VisStateActions}
              />
            </div>
            <Status />
          </EffectAnimationPreviewProvider>
        </RootContext.Provider>
      </IntlWrapper>,
      {container: root}
    );
    const button = screen.getByRole('button', {name: 'Animation'});
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', {name: 'Start preview'}));
    expect(screen.getByLabelText('Playback status')).toHaveTextContent('playing:0');
    fireEvent.click(
      screen
        .getByRole('region', {name: 'Animation panel'})
        .querySelector('.close-map-control-item')!
    );
    fireEvent.pointerDown(button);
    fireEvent.click(button);
    expect(screen.getByLabelText('Playback status')).toHaveTextContent('playing:0');
    act(() => frame?.(1000));
    expect(screen.getByLabelText('Playback status')).toHaveTextContent('playing:1000');
  } finally {
    jest.restoreAllMocks();
  }
});
