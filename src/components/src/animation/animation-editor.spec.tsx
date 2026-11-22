// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {createEffect, getEffectAnimationEntries} from '@kepler.gl/effects';
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import type {Layer} from '@kepler.gl/layers';
import {DEFAULT_LAYER_ANIMATABLE_PROPS, rgbToHex} from '@kepler.gl/utils';
import type {
  Annotation,
  CameraTour,
  LayerAnimatableProp,
  LayerPropertyTransition,
  RGBColor
} from '@kepler.gl/types';
import AnimationEditorFactory, {
  AnimationEditorPlayback,
  AnimationEditorProps
} from './animation-editor';
import RangeSliderFactory from '../common/range-slider';

const Editor = AnimationEditorFactory(
  RangeSliderFactory(
    () => <></>,
    () => <></>
  )
);
const camera = {longitude: 10, latitude: 20, zoom: 6, pitch: 0, bearing: 0};
const tour: CameraTour = {
  stops: [
    {id: 'first', name: 'First', camera, holdDurationMs: 3000, travelDurationMs: 5000},
    {id: 'last', name: 'Last', camera, holdDurationMs: 12000, travelDurationMs: 0}
  ]
};
function effect(timing = {startTimeMs: 3000, endTimeMs: 7000}) {
  return createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0.2},
    animation: {
      brightness: {
        startValue: 0,
        endValue: 1,
        easing: 'linear',
        ...timing
      }
    }
  });
}
function layer(transitions?: LayerPropertyTransition[]) {
  return {
    id: 'points',
    animatableProps: DEFAULT_LAYER_ANIMATABLE_PROPS,
    config: {
      label: 'Points',
      color: [10, 20, 30],
      isVisible: true,
      propertyTransitions: transitions ? {opacity: transitions} : undefined
    }
  } as Layer;
}
function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </IntlProvider>
  );
}
function setup(overrides: Partial<AnimationEditorProps> = {}) {
  const playback: AnimationEditorPlayback = {
    elapsed: 5000,
    duration: 20000,
    running: false,
    run: jest.fn(),
    pause: jest.fn(),
    seek: jest.fn(),
    stop: jest.fn(),
    speed: 1,
    setSpeed: jest.fn(),
    loop: false,
    setLoop: jest.fn()
  };
  const props: AnimationEditorProps = {
    effects: [effect()],
    tour,
    playback,
    updateEffectConfig: jest.fn(),
    onLayerConfigChange: jest.fn(),
    onAnnotationChange: jest.fn(),
    onEditCamera: jest.fn(),
    ...overrides
  };
  return {...render(<Editor {...props} />, {wrapper: Wrapper}), props};
}
const originalPointerEvent = window.PointerEvent;
beforeAll(() => {
  window.PointerEvent = class extends MouseEvent {
    pointerId: number;
    isPrimary: boolean;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.isPrimary = init.isPrimary ?? true;
      // Retain subpixel coordinates in the PointerEvent shim.
      Object.defineProperty(this, 'clientX', {value: init.clientX ?? 0});
    }
  } as typeof PointerEvent;
});
afterAll(() => {
  window.PointerEvent = originalPointerEvent;
});
beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 400,
    height: 44,
    right: 400,
    bottom: 44,
    x: 0,
    y: 0,
    toJSON: () => ({})
  });
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
});
afterEach(() => jest.restoreAllMocks());
function drag(element: HTMLElement, from: number, to: number) {
  fireEvent.pointerDown(element, {pointerId: 1, button: 0, clientX: from});
  fireEvent.pointerMove(window, {pointerId: 1, clientX: to});
  fireEvent.pointerUp(window, {pointerId: 1, clientX: to});
}

test('uses a shared time ruler and compact playback controls independently of the data timeline', () => {
  const {props} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  expect(props.playback.run).toHaveBeenCalledTimes(1);
  const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
  fireEvent.click(ruler, {clientX: 150});
  expect(props.playback.seek).toHaveBeenCalledWith(7500);
  fireEvent.keyDown(ruler, {key: 'ArrowRight', shiftKey: true});
  expect(props.playback.seek).toHaveBeenLastCalledWith(6000);
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Speed'}), {target: {value: '2'}});
  expect(props.playback.setSpeed).toHaveBeenCalledWith(2);
  fireEvent.click(screen.getByRole('checkbox', {name: 'Loop'}));
  expect(props.playback.setLoop).toHaveBeenCalledWith(true);
  fireEvent.click(screen.getByRole('button', {name: 'Edit camera route'}));
  expect(props.onEditCamera).not.toHaveBeenCalled();
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Edit camera route'}));
  expect(props.onEditCamera).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(screen.getByRole('button', {name: 'Edit camera route'}), {key: 'Enter'});
  expect(props.onEditCamera).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole('button', {name: 'Stop'}));
  expect(props.playback.stop).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test('orders timeline tracks by layers, annotations, then effects', () => {
  setup({
    tour: undefined,
    layers: [layer(opacityTransitions())],
    annotations: [annotation(opacityTransitions())]
  });
  expect(screen.getAllByRole('group').map(row => row.getAttribute('aria-label'))).toEqual([
    'Layer opacity: Points',
    'Annotation opacity: Harbor',
    'Brightness Contrast: Brightness'
  ]);
});

test('holding and dragging the playhead seeks continuously and updates the displayed frame', () => {
  const {props, rerender} = setup();
  (props.playback.seek as jest.Mock).mockImplementation(elapsed => {
    rerender(<Editor {...props} playback={{...props.playback, elapsed}} />);
  });
  const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
  let captured: number | null = null;
  ruler.setPointerCapture = jest.fn(pointerId => {
    captured = pointerId;
  });
  ruler.hasPointerCapture = pointerId => captured === pointerId;
  ruler.releasePointerCapture = jest.fn(() => {
    captured = null;
  });
  fireEvent.pointerDown(ruler, {pointerId: 7, button: 0, clientX: 50});
  expect(props.playback.seek).toHaveBeenLastCalledWith(2500);
  expect(ruler).toHaveAttribute('aria-valuenow', '2500');
  expect(ruler).toHaveFocus();
  expect(ruler.setPointerCapture).toHaveBeenCalledWith(7);
  fireEvent.pointerMove(ruler, {pointerId: 7, clientX: 80});
  expect(props.playback.seek).toHaveBeenLastCalledWith(4000);
  fireEvent.pointerMove(ruler, {pointerId: 7, clientX: 165.5});
  expect(props.playback.seek).toHaveBeenLastCalledWith(8275);
  expect(ruler).toHaveAttribute('aria-valuenow', '8275');
  expect(screen.getByLabelText('Animation time')).toHaveTextContent('8.28 s / 20 s');
  fireEvent.pointerUp(ruler, {pointerId: 7, clientX: 210});
  expect(props.playback.seek).toHaveBeenLastCalledWith(10500);
  expect(ruler.releasePointerCapture).toHaveBeenCalledWith(7);
  const calls = (props.playback.seek as jest.Mock).mock.calls.length;
  fireEvent.click(ruler, {clientX: 50});
  fireEvent.pointerMove(ruler, {pointerId: 7, clientX: 300});
  expect(props.playback.seek).toHaveBeenCalledTimes(calls);
  expect(ruler).toHaveAttribute('aria-valuenow', '10500');
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
});

test('playhead dragging uses the zoomed ruler and clamps captured movement outside its bounds', () => {
  const {props} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
  const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
  jest.spyOn(ruler, 'getBoundingClientRect').mockReturnValue({
    ...ruler.getBoundingClientRect(),
    left: 100,
    right: 500
  });
  fireEvent.pointerDown(ruler, {pointerId: 1, button: 0, clientX: 150});
  expect(props.playback.seek).toHaveBeenLastCalledWith(5000);
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 50});
  expect(props.playback.seek).toHaveBeenLastCalledWith(0);
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 600});
  expect(props.playback.seek).toHaveBeenLastCalledWith(20000);
  fireEvent.pointerUp(ruler, {pointerId: 1, clientX: 450});
  expect(props.playback.seek).toHaveBeenLastCalledWith(20000);
});

test.each(['pointerCancel', 'lostPointerCapture'] as const)(
  '%s ends playhead dragging without another seek',
  eventName => {
    const {props} = setup();
    const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
    fireEvent.pointerDown(ruler, {pointerId: 1, button: 0, clientX: 100});
    fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 200});
    fireEvent[eventName](ruler, {pointerId: 1, clientX: 300});
    fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 300});
    fireEvent.pointerUp(ruler, {pointerId: 1, clientX: 300});
    expect(props.playback.seek).toHaveBeenCalledTimes(2);
    expect(props.playback.seek).toHaveBeenLastCalledWith(10000);
    fireEvent.pointerDown(ruler, {pointerId: 2, button: 0, clientX: 50});
    expect(props.playback.seek).toHaveBeenLastCalledWith(2500);
  }
);

test('playhead dragging ignores other pointers, non-primary input and a zero-width ruler', () => {
  const {props} = setup();
  const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
  fireEvent.pointerDown(ruler, {pointerId: 1, button: 2, clientX: 100});
  fireEvent.pointerDown(ruler, {pointerId: 2, button: 0, isPrimary: false, clientX: 100});
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 100});
  expect(props.playback.seek).not.toHaveBeenCalled();
  fireEvent.pointerDown(ruler, {pointerId: 1, button: 0, clientX: 100});
  fireEvent.pointerDown(ruler, {pointerId: 2, button: 0, clientX: 200});
  fireEvent.pointerMove(ruler, {pointerId: 2, clientX: 200});
  fireEvent.pointerUp(ruler, {pointerId: 2, clientX: 200});
  expect(props.playback.seek).toHaveBeenCalledTimes(1);
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 200});
  expect(props.playback.seek).toHaveBeenLastCalledWith(10000);
  fireEvent.pointerUp(ruler, {pointerId: 1, clientX: 200});
  (props.playback.seek as jest.Mock).mockClear();
  jest.spyOn(ruler, 'getBoundingClientRect').mockReturnValue({
    ...ruler.getBoundingClientRect(),
    width: 0
  });
  fireEvent.pointerDown(ruler, {pointerId: 1, button: 0, clientX: 100});
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 200});
  expect(props.playback.seek).not.toHaveBeenCalled();
});

test('unmounting during a playhead drag leaves no active seeking', () => {
  const {props, unmount} = setup();
  const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
  fireEvent.pointerDown(ruler, {pointerId: 1, button: 0, clientX: 100});
  unmount();
  fireEvent.pointerMove(ruler, {pointerId: 1, clientX: 200});
  fireEvent.pointerUp(ruler, {pointerId: 1, clientX: 200});
  fireEvent.pointerMove(window, {pointerId: 1, clientX: 200});
  expect(props.playback.seek).toHaveBeenCalledTimes(1);
});

test('elapsed time keeps its reserved width as fractions and digit counts change during playback', () => {
  const {props, rerender} = setup();
  const showTime = (elapsed: number) =>
    rerender(
      <Editor
        {...props}
        playback={{...props.playback, elapsed, duration: 1000000, running: true}}
      />
    );
  showTime(0);
  const readout = screen.getByLabelText('Animation time');
  const currentTime = within(readout).getByText('0 s');
  const reservedWidth = getComputedStyle(currentTime).width;
  expect(parseFloat(reservedWidth)).toBeGreaterThan(0);
  expect(getComputedStyle(readout).flexShrink).toBe('0');
  for (const [elapsed, label] of [
    [9990, '9.99'],
    [10000, '10'],
    [99990, '99.99'],
    [100000, '100'],
    [999990, '999.99'],
    [1000000, '1000'],
    [0, '0']
  ] as const) {
    showTime(elapsed);
    expect(readout).toHaveTextContent(`${label} s / 1000 s`);
    expect(getComputedStyle(currentTime).width).toBe(reservedWidth);
  }
});

test('moving an effect block preserves its length and values and commits without opening settings', () => {
  const source = effect();
  const {props} = setup({effects: [source]});
  const block = screen.getByRole('button', {name: 'Brightness'});
  fireEvent.pointerDown(block, {pointerId: 1, button: 0, clientX: 80});
  fireEvent.pointerMove(window, {pointerId: 1, clientX: 120});
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.pointerUp(window, {pointerId: 1, clientX: 120});
  fireEvent.click(block);
  expect(props.playback.pause).toHaveBeenCalledTimes(1);
  expect(props.updateEffectConfig).toHaveBeenCalledTimes(1);
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    animation: {
      brightness: {
        startValue: 0,
        endValue: 1,
        easing: 'linear',
        startTimeMs: 5000,
        endTimeMs: 9000
      }
    }
  });
  expect(source.parameters.brightness).toBe(0.2);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test.each([
  ['Start', 60, 100, 5000, 7000],
  ['End', 140, 220, 3000, 11000]
])(
  'resizing the %s edge changes only that effect boundary',
  (side, from, to, startTimeMs, endTimeMs) => {
    const {props} = setup();
    drag(
      screen.getByRole('slider', {name: `${side} time for Brightness`}),
      Number(from),
      Number(to)
    );
    expect(props.updateEffectConfig).toHaveBeenCalledWith(null, 'brightness', {
      animation: {
        brightness: {
          startValue: 0,
          endValue: 1,
          easing: 'linear',
          startTimeMs,
          endTimeMs
        }
      }
    });
  }
);

test('double-click opens a value/time popup outside the timeline and saves both together', () => {
  const source = effect();
  const {props} = setup({effects: [source]});
  const editor = screen.getByRole('region', {name: 'Animation editor'});
  const block = screen.getByRole('button', {name: 'Brightness'});
  fireEvent.click(block);
  expect(block).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  expect(props.playback.pause).not.toHaveBeenCalled();
  fireEvent.doubleClick(block);
  const dialog = screen.getByRole('dialog', {name: 'Block settings'});
  expect(editor).not.toContainElement(dialog);
  expect(editor).toContainElement(block);
  expect(props.playback.pause).toHaveBeenCalledTimes(1);
  const inspector = within(dialog);
  expect(inspector.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(3);
  expect(inspector.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(7);
  const end = inspector.getByRole('spinbutton', {name: 'End value'});
  fireEvent.change(end, {target: {value: '0.75'}});
  fireEvent.blur(end);
  fireEvent.change(inspector.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '9'}
  });
  fireEvent.click(inspector.getByRole('button', {name: 'Save'}));
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    parameters: {brightness: 0},
    animation: {
      brightness: {
        startValue: 0,
        endValue: 0.75,
        easing: 'linear',
        startTimeMs: 3000,
        endTimeMs: 9000
      }
    }
  });
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test('opens settings at each selected block without animating from the previous position', async () => {
  setup({
    layers: [layer(opacityTransitions())],
    annotations: [annotation(opacityTransitions())]
  });
  for (const {name, left, top} of [
    {name: 'Brightness', left: 100, top: 80},
    {name: 'Opacity 1 · Points', left: 240, top: 140},
    {name: 'Opacity 1 · Harbor', left: 160, top: 200}
  ]) {
    const block = screen.getByRole('button', {name});
    jest.spyOn(block, 'getBoundingClientRect').mockReturnValue({
      ...block.getBoundingClientRect(),
      left,
      top,
      right: left + 120,
      bottom: top + 24,
      width: 120,
      height: 24
    });
    fireEvent.doubleClick(block);
    const dialog = screen.getByRole('dialog', {name: 'Block settings'});
    const popup = dialog.querySelector('.portaled-content');
    // The portal measures after mounting, before showing its first visible frame.
    await waitFor(() => expect(popup).toHaveStyle({opacity: '1', marginTop: '0px'}));
    expect(popup).toHaveStyle({left: `${left}px`, top: `${top + 28}px`, transition: 'none'});
    fireEvent.click(dialog.parentElement!);
  }
});

test('dismisses the popup with Escape or an outside click without saving draft values', () => {
  const {props} = setup();
  const block = screen.getByRole('button', {name: 'Brightness'});
  fireEvent.keyDown(block, {key: 'Enter'});
  const end = screen.getByRole('spinbutton', {name: 'End time (seconds)'});
  fireEvent.change(end, {target: {value: '15'}});
  fireEvent.keyDown(end, {key: 'Escape', code: 'Escape', keyCode: 27});
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.doubleClick(block);
  expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(7);
  const overlay = screen.getByRole('dialog', {name: 'Block settings'}).parentElement!;
  fireEvent.click(overlay);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
});

test.each(['Cancel', 'Escape', 'outside'])(
  '%s dismisses removal without deleting the block',
  action => {
    const {props} = setup();
    fireEvent.click(screen.getByRole('button', {name: 'Remove Brightness'}));
    const dialog = screen.getByRole('dialog', {name: 'Remove animation action'});
    expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
    expect(props.updateEffectConfig).not.toHaveBeenCalled();
    expect(props.playback.pause).toHaveBeenCalled();
    if (action === 'Cancel') fireEvent.click(within(dialog).getByRole('button', {name: 'Cancel'}));
    else if (action === 'Escape') {
      fireEvent.keyDown(dialog, {key: 'Escape', code: 'Escape', keyCode: 27});
    } else fireEvent.click(dialog.parentElement!);
    expect(screen.queryByRole('dialog', {name: 'Remove animation action'})).toBeNull();
    expect(screen.getByRole('button', {name: 'Brightness'})).toBeInTheDocument();
    expect(props.updateEffectConfig).not.toHaveBeenCalled();
    fireEvent.doubleClick(screen.getByRole('button', {name: 'Brightness'}));
    expect(screen.getByRole('dialog', {name: 'Block settings'})).toBeInTheDocument();
  }
);

test('confirming effect removal keeps the effect, its values, and other animated parameters', () => {
  const source = effect();
  const contrast = {...source.animation!.brightness, startValue: 0.2, endValue: 0.8};
  source.animation = {...source.animation, contrast};
  const parameters = {...source.parameters};
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_index, _id, config) => {
    Object.assign(source, config);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Remove Brightness'}));
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Remove'}));
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    animation: {contrast}
  });
  expect(source.parameters).toEqual(parameters);
  expect(screen.queryByRole('button', {name: 'Brightness'})).toBeNull();
  expect(screen.getByRole('button', {name: 'Contrast'})).toBeInTheDocument();
  expect(screen.queryByRole('dialog', {name: 'Remove animation action'})).toBeNull();
});

test('removing a fog height block preserves static parameters', () => {
  const source = createEffect({
    id: 'fog',
    type: SURFACE_FOG_TYPE,
    parameters: {animateHeight: true},
    animation: {height: {...effect().animation!.brightness}}
  });
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_index, _id, config) => {
    source.animation = config.animation;
    Object.assign(source.parameters, config.parameters);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Remove Elevation (m)'}));
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Remove'}));
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    animation: {}
  });
  expect(screen.queryByRole('button', {name: 'Elevation (m)'})).toBeNull();
  expect(source.parameters.animateHeight).toBe(true);
});

test.each(['layer', 'annotation'])(
  'confirmed %s removal preserves sibling blocks and other targets',
  kind => {
    const transitions = opacityTransitions();
    const sourceLayer = layer(transitions);
    const sourceAnnotation = annotation(transitions, 'points', 'Points');
    const {props, rerender} = setup({layers: [sourceLayer], annotations: [sourceAnnotation]});
    (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
      Object.assign(sourceLayer.config, config);
      rerender(<Editor {...props} />);
    });
    (props.onAnnotationChange as jest.Mock).mockImplementation((_id, config) => {
      Object.assign(sourceAnnotation, config);
      rerender(<Editor {...props} />);
    });
    const rowName = `${kind === 'layer' ? 'Layer' : 'Annotation'} opacity: Points`;
    const row = screen.getByRole('group', {name: rowName});
    fireEvent.click(within(row).getByRole('button', {name: 'Remove Opacity 1 · Points'}));
    expect(props.onLayerConfigChange).not.toHaveBeenCalled();
    expect(props.onAnnotationChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {name: 'Remove'}));
    const remaining =
      kind === 'layer'
        ? sourceLayer.config.propertyTransitions!.opacity
        : sourceAnnotation.propertyTransitions?.opacity;
    expect(remaining).toEqual([transitions[1]]);
    expect(sourceLayer.config.isVisible).toBe(true);
    expect(sourceAnnotation.isVisible).toBe(true);
    expect(
      kind === 'layer' ? props.onAnnotationChange : props.onLayerConfigChange
    ).not.toHaveBeenCalled();
    expect(props.updateEffectConfig).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', {name: 'Remove animation action'})).toBeNull();
    fireEvent.click(within(row).getByRole('button', {name: 'Remove Opacity 1 · Points'}));
    fireEvent.click(screen.getByRole('button', {name: 'Remove'}));
    expect(
      kind === 'layer'
        ? sourceLayer.config.propertyTransitions!.opacity
        : sourceAnnotation.propertyTransitions?.opacity
    ).toEqual([]);
    expect(screen.queryByRole('group', {name: rowName})).toBeNull();
  }
);

test('effect blocks keep authored timing when the playback duration changes', () => {
  const source = effect({startTimeMs: 0, endTimeMs: 20000});
  const {props, rerender} = setup({effects: [source], tour: null});
  expect(screen.getByRole('slider', {name: 'Start time for Brightness'})).toHaveAttribute(
    'aria-valuenow',
    '0'
  );
  expect(screen.getByRole('slider', {name: 'End time for Brightness'})).toHaveAttribute(
    'aria-valuenow',
    '20000'
  );
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Brightness'}));
  expect(screen.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(0);
  expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(20);
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  rerender(<Editor {...props} playback={{...props.playback, duration: 30000}} />);
  expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(20);
  rerender(<Editor {...props} />);
  fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
  fireEvent.click(screen.getByRole('button', {name: 'Fit'}));
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 400, 240);
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, 'brightness', {
    animation: {
      brightness: {
        startValue: 0,
        endValue: 1,
        easing: 'linear',
        startTimeMs: 0,
        endTimeMs: 12000
      }
    }
  });
});

function opacityTransitions(): LayerPropertyTransition[] {
  return [
    {id: 'in', startTimeMs: 3000, endTimeMs: 5000, startValue: 0, endValue: 1, easing: 'linear'},
    {id: 'out', startTimeMs: 10000, endTimeMs: 12000, startValue: 1, endValue: 0, easing: 'linear'}
  ];
}

const radiusProperty: LayerAnimatableProp = {
  name: 'radius',
  label: 'Radius',
  range: [0, 50],
  step: 0.5
};
const strokeProperty: LayerAnimatableProp = {
  name: 'thickness',
  label: 'Stroke width',
  range: [0, 10],
  step: 0.1
};
const colorProperty: LayerAnimatableProp = {name: 'color', label: 'Color', type: 'color'};
function propertyLayer(
  properties: LayerAnimatableProp[] = [radiusProperty],
  propertyTransitions?: Record<string, LayerPropertyTransition[]>
): Layer {
  const source = layer();
  return {
    ...source,
    animatableProps: [...DEFAULT_LAYER_ANIMATABLE_PROPS, ...properties],
    config: {...source.config, visConfig: {radius: 12, thickness: 2}, propertyTransitions}
  } as unknown as Layer;
}

test('Add action selects an entity before its supported property, with Back and Escape navigation', () => {
  const points = propertyLayer();
  const arcs = propertyLayer([strokeProperty]);
  arcs.id = 'arcs';
  arcs.config.label = 'Arcs';
  const {props} = setup({layers: [points, arcs], annotations: [annotation()]});
  const addButton = screen.getByRole('button', {name: 'Add action'});
  addButton.focus();
  fireEvent.click(addButton);
  expect(screen.getAllByRole('menuitem').map(item => item.textContent)).toEqual([
    'Points',
    'Arcs',
    'Harbor',
    'Brightness Contrast'
  ]);
  expect(screen.getByRole('menuitem', {name: 'Points'})).toHaveFocus();
  expect(screen.queryByRole('menuitem', {name: 'Camera route'})).not.toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Radius'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Stroke width'})).toBeNull();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.playback.pause).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Back'}));
  expect(screen.getByRole('menuitem', {name: 'Points'})).toHaveFocus();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Arcs'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Stroke width'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.getByRole('menuitem', {name: 'Points'})).toHaveFocus();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Harbor'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Opacity'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.getByRole('menuitem', {name: 'Points'})).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.queryByRole('menu')).toBeNull();
  expect(addButton).toHaveFocus();
  expect(props.playback.pause).not.toHaveBeenCalled();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
});

test('outside clicks dismiss either Add action menu level and preserve the clicked toolbar action', () => {
  const {props} = setup({layers: [propertyLayer()]});
  const addButton = screen.getByRole('button', {name: 'Add action'});
  fireEvent.click(addButton);
  fireEvent.click(document.body);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(addButton).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(addButton);
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  expect(screen.getByRole('menuitem', {name: 'Radius'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(props.playback.run).toHaveBeenCalledTimes(1);
  fireEvent.click(addButton);
  expect(screen.getByRole('menuitem', {name: 'Points'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Back'})).not.toBeInTheDocument();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
});

test('Add action trigger toggles the menu without reopening it during outside-click dismissal', () => {
  setup({layers: [propertyLayer()]});
  const addButton = screen.getByRole('button', {name: 'Add action'});
  fireEvent.click(addButton);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  fireEvent.click(addButton.querySelector('svg')!);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  fireEvent.click(addButton);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  fireEvent.click(addButton);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(addButton).toHaveAttribute('aria-expanded', 'false');
});

test('Add action closes even when an outside control stops click propagation', () => {
  const {props, rerender} = setup();
  const onOutsideClick = jest.fn();
  rerender(
    <>
      <Editor {...props} />
      <button
        onClick={event => {
          event.stopPropagation();
          onOutsideClick();
        }}
      >
        Outside control
      </button>
    </>
  );
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  const outside = screen.getByRole('button', {name: 'Outside control'});
  outside.focus();
  fireEvent.click(outside);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(onOutsideClick).toHaveBeenCalledTimes(1);
  expect(outside).toHaveFocus();
});

test('choosing a native layer property creates its block and opens range-aware settings', () => {
  const source = propertyLayer();
  const {props, rerender} = setup({layers: [source]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  expect(props.playback.pause).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Radius'}));
  expect(source.config.propertyTransitions?.radius).toEqual([
    {
      id: 'radius-1',
      startTimeMs: 5000,
      endTimeMs: 7000,
      startValue: 12,
      endValue: 12,
      easing: 'easeInOut'
    }
  ]);
  expect(screen.getByRole('dialog', {name: 'Block settings'})).toBeInTheDocument();
  const start = screen.getByRole('spinbutton', {name: 'Start radius'});
  const end = screen.getByRole('spinbutton', {name: 'End radius'});
  expect(start).toHaveValue(12);
  expect(end).toHaveAttribute('min', '0');
  expect(end).toHaveAttribute('max', '50');
  expect(end).toHaveAttribute('step', '0.5');
  fireEvent.change(end, {target: {value: '51'}});
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  fireEvent.change(start, {target: {value: '6.5'}});
  fireEvent.change(end, {target: {value: '24.5'}});
  fireEvent.click(screen.getByRole('checkbox', {name: 'Linear easing'}));
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(source.config.propertyTransitions?.radius[0]).toEqual({
    id: 'radius-1',
    startTimeMs: 5000,
    endTimeMs: 7000,
    startValue: 6.5,
    endValue: 24.5,
    easing: 'linear'
  });
  expect(screen.getByRole('button', {name: 'Radius 1 · Points'})).toHaveTextContent('6.5 → 24.5');
  expect(source.config.visConfig.radius).toBe(12);
});

test('a legacy numeric property named color keeps its authored visConfig value', () => {
  const source = propertyLayer([{name: 'color', label: 'Color scale', range: [0, 100], step: 1}]);
  source.config.visConfig.color = 23;
  const {props, rerender} = setup({layers: [source]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Color scale'}));
  expect(source.config.propertyTransitions?.color).toEqual([
    {
      id: 'color-1',
      startTimeMs: 5000,
      endTimeMs: 7000,
      startValue: 23,
      endValue: 23,
      easing: 'easeInOut'
    }
  ]);
  expect(screen.getByRole('spinbutton', {name: 'Start color scale'})).toHaveValue(23);
  expect(screen.queryByRole('button', {name: 'Start color'})).toBeNull();
  expect(source.config.color).toEqual([10, 20, 30]);
});

function pickEndpointColor(label: string, index: number): RGBColor {
  fireEvent.click(screen.getByRole('button', {name: label}));
  const dialog = screen.getByRole('dialog', {name: label});
  const swatch = dialog.querySelectorAll<HTMLElement>('.single-color-palette__block')[index];
  const channels = swatch.style.backgroundColor.match(/\d+/g)!.map(Number);
  const color: RGBColor = [channels[0], channels[1], channels[2]];
  fireEvent.click(swatch);
  fireEvent.keyDown(dialog, {key: 'Escape', code: 'Escape', keyCode: 27});
  expect(screen.queryByRole('dialog', {name: label})).toBeNull();
  expect(screen.getByRole('dialog', {name: 'Block settings'})).toBeInTheDocument();
  return color;
}

test('layer color blocks use authored colors and edit both endpoints through the existing pickers', () => {
  const radius = [{...opacityTransitions()[0], startValue: 12, endValue: 24}];
  const source = propertyLayer([radiusProperty, colorProperty], {radius});
  const annotationSource = annotation(opacityTransitions());
  const {props, rerender} = setup({layers: [source], annotations: [annotationSource]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  const addColor = () => {
    fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Color'}));
  };
  addColor();
  const initial = source.config.propertyTransitions!.color[0];
  expect(initial).toEqual({
    id: 'color-1',
    startTimeMs: 5000,
    endTimeMs: 7000,
    startValue: [10, 20, 30],
    endValue: [10, 20, 30],
    easing: 'easeInOut'
  });
  expect(initial.startValue).not.toBe(source.config.color);
  expect(initial.endValue).not.toBe(initial.startValue);
  const startColor = pickEndpointColor('Start color', 0);
  const endColor = pickEndpointColor('End color', 5);
  expect(source.config.propertyTransitions!.color[0]).toEqual(initial);
  fireEvent.click(screen.getByRole('checkbox', {name: 'Linear easing'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '8'}
  });
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  const first = source.config.propertyTransitions!.color[0];
  expect(first).toEqual({
    ...initial,
    endTimeMs: 8000,
    startValue: startColor,
    endValue: endColor,
    easing: 'linear'
  });
  expect(screen.getByRole('button', {name: 'Color 1 · Points'})).toHaveTextContent(
    `${rgbToHex(startColor)} → ${rgbToHex(endColor)}`
  );
  expect(source.config.propertyTransitions!.radius).toEqual(radius);
  expect(source.config.color).toEqual([10, 20, 30]);
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
  expect(annotationSource.propertyTransitions?.opacity).toEqual(opacityTransitions());

  addColor();
  const second = source.config.propertyTransitions!.color[1];
  expect(second).toEqual({
    id: 'color-2',
    startTimeMs: 8000,
    endTimeMs: 10000,
    startValue: endColor,
    endValue: endColor,
    easing: 'easeInOut'
  });
  expect(second.startValue).not.toBe(first.endValue);
  expect(second.endValue).not.toBe(second.startValue);
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Start time (seconds)'}), {
    target: {value: '9'}
  });
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(source.config.propertyTransitions!.color[1]).toEqual({...second, startTimeMs: 9000});
  expect(screen.getAllByRole('group', {name: 'Layer color: Points'})).toHaveLength(1);
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Color 2 · Points'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.config.propertyTransitions).toEqual({radius, color: [first]});
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Harbor'}));
  expect(screen.queryByRole('menuitem', {name: 'Color'})).toBeNull();
  expect(screen.getByRole('menuitem', {name: 'Opacity'})).toBeInTheDocument();
});

test.each<[string, RGBColor | null, RGBColor]>([
  ['strokeColor', null, [10, 20, 30]],
  ['targetColor', [40, 50, 60], [40, 50, 60]]
])(
  'new %s color blocks initialize from their authored visual value or base color',
  (name, value, expected) => {
    const property: LayerAnimatableProp = {name, label: 'Secondary color', type: 'color'};
    const source = propertyLayer([property]);
    source.config.visConfig[property.name] = value;
    const {props} = setup({layers: [source]});
    fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Secondary color'}));
    expect(props.onLayerConfigChange).toHaveBeenCalledWith(source, {
      propertyTransitions: {
        [property.name]: [
          {
            id: `${property.name}-1`,
            startTimeMs: 5000,
            endTimeMs: 7000,
            startValue: expected,
            endValue: expected,
            easing: 'easeInOut'
          }
        ]
      }
    });
  }
);

test('color blocks reject overlap and preserve endpoint arrays when their timing is dragged', () => {
  const color: LayerPropertyTransition[] = opacityTransitions().map(transition => ({
    ...transition,
    startValue: [10, 20, 30],
    endValue: [40, 50, 60]
  }));
  const source = propertyLayer([colorProperty], {color});
  const {props} = setup({layers: [source]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Color 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '11'}
  });
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  drag(screen.getByRole('button', {name: 'Color 1 · Points'}), 80, 300);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {color: [{...color[0], startTimeMs: 8000, endTimeMs: 10000}, color[1]]}
  });
  expect(color[0].startTimeMs).toBe(3000);
  expect(color[0].startValue).toEqual([10, 20, 30]);
});

test('effect selection is separate from choosing a parameter and preserves existing animation', () => {
  const source = effect();
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, next) => {
    source.setProps(next);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Brightness Contrast'}));
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  expect(props.playback.pause).not.toHaveBeenCalled();
  expect(screen.queryByRole('menuitem', {name: 'Brightness'})).toBeNull();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Contrast'}));
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    animation: {
      brightness: effect().animation!.brightness,
      contrast: {startValue: 0, endValue: 0, easing: 'easeInOut', startTimeMs: 0, endTimeMs: 10000}
    }
  });
  expect(screen.getByRole('dialog', {name: 'Block settings'})).toBeInTheDocument();
});

test('Add action preserves saved parameters on disabled effects', () => {
  const source = effect();
  source.setProps({isEnabled: false});
  const savedBrightness = source.animation!.brightness;
  const {props} = setup({effects: [source]});
  expect(screen.queryByRole('group', {name: 'Brightness Contrast: Brightness'})).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Brightness Contrast'}));
  expect(screen.queryByRole('menuitem', {name: 'Brightness'})).toBeNull();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Contrast'}));
  expect(props.updateEffectConfig).toHaveBeenCalledWith(null, source.id, {
    animation: {
      brightness: savedBrightness,
      contrast: {startValue: 0, endValue: 0, easing: 'easeInOut', startTimeMs: 0, endTimeMs: 10000}
    }
  });
  expect(source.animation!.brightness).toEqual(savedBrightness);
  expect(source.isEnabled).toBe(false);
});

test('concurrent property rows edit independently and preserve sibling tracks', () => {
  const radius = [{...opacityTransitions()[0], id: 'in', startValue: 12, endValue: 24}];
  const unsupported = [{...radius[0], endValue: 30}];
  const opacity = opacityTransitions();
  const source = propertyLayer([radiusProperty], {opacity, radius, unsupported});
  const {props, rerender} = setup({layers: [source]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  expect(screen.getByRole('group', {name: 'Layer opacity: Points'})).toBeInTheDocument();
  expect(screen.getByRole('group', {name: 'Layer radius: Points'})).toBeInTheDocument();
  expect(screen.queryByRole('group', {name: /unsupported/i})).toBeNull();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Radius 1 · Points'}));
  expect(screen.getByRole('button', {name: 'Opacity 1 · Points'})).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Radius 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End radius'}), {target: {value: '32'}});
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '9'}
  });
  expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled();
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(source.config.propertyTransitions).toEqual({
    opacity,
    radius: [{...radius[0], endValue: 32, endTimeMs: 9000}],
    unsupported
  });
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Radius 1 · Points'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.config.propertyTransitions).toEqual({
    opacity,
    radius: [],
    unsupported
  });
  expect(screen.queryByRole('group', {name: 'Layer radius: Points'})).toBeNull();
  expect(screen.getByRole('group', {name: 'Layer opacity: Points'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  expect(screen.queryByRole('menuitem', {name: /unsupported/i})).toBeNull();
});

test('native-property blocks reject overlap within their row and preserve other property tracks on drag', () => {
  const opacity = opacityTransitions();
  const radius = opacity.map(transition => ({...transition, startValue: 12, endValue: 24}));
  const source = propertyLayer([radiusProperty], {radius, opacity});
  const {props} = setup({layers: [source]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Radius 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '11'}
  });
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  drag(screen.getByRole('button', {name: 'Radius 1 · Points'}), 80, 300);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {
      opacity,
      radius: [{...radius[0], startTimeMs: 8000, endTimeMs: 10000}, radius[1]]
    }
  });
});

test('adds multiple opacity blocks on one layer row and removes only the selected block', () => {
  const source = layer();
  const {props, rerender} = setup({layers: [source]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  const add = () => {
    fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Opacity'}));
  };
  add();
  expect(source.config.propertyTransitions?.opacity).toEqual([
    {
      id: 'opacity-1',
      startTimeMs: 5000,
      endTimeMs: 7000,
      startValue: 0,
      endValue: 1,
      easing: 'easeInOut'
    }
  ]);
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  add();
  expect(source.config.propertyTransitions?.opacity).toHaveLength(2);
  expect(source.config.propertyTransitions!.opacity[1]).toEqual({
    id: 'opacity-2',
    startTimeMs: 7000,
    endTimeMs: 9000,
    startValue: 1,
    endValue: 0,
    easing: 'easeInOut'
  });
  expect(screen.getAllByRole('group', {name: 'Layer opacity: Points'})).toHaveLength(1);
  expect(screen.getByRole('button', {name: 'Opacity 1 · Points'})).toHaveTextContent('0% → 100%');
  expect(screen.getByRole('button', {name: 'Opacity 2 · Points'})).toHaveTextContent('100% → 0%');
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.config.propertyTransitions?.opacity).toHaveLength(1);
  expect(source.config.propertyTransitions!.opacity[0].id).toBe('opacity-1');
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Points'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.config.propertyTransitions?.opacity).toEqual([]);
  expect(source.config.isVisible).toBe(true);
  expect(screen.queryByRole('group', {name: 'Layer opacity: Points'})).toBeNull();
});

test('double-click edits one opacity transition with percentages, times and easing', () => {
  const transitions = opacityTransitions();
  const source = layer(transitions);
  const {props} = setup({layers: [source]});
  const block = screen.getByRole('button', {name: 'Opacity 1 · Points'});
  fireEvent.click(block);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  fireEvent.doubleClick(block);
  const dialog = screen.getByRole('dialog', {name: 'Block settings'});
  expect(screen.getByRole('region', {name: 'Animation editor'})).not.toContainElement(dialog);
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Start opacity (%)'}), {
    target: {value: '20'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End opacity (%)'}), {
    target: {value: '60'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '4.5'}
  });
  fireEvent.click(screen.getByRole('checkbox', {name: 'Linear easing'}));
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(props.onLayerConfigChange).toHaveBeenCalledWith(source, {
    propertyTransitions: {
      opacity: [
        {...transitions[0], endTimeMs: 4500, startValue: 0.2, endValue: 0.6, easing: 'easeInOut'},
        transitions[1]
      ]
    }
  });
  expect(source.config.propertyTransitions?.opacity).toEqual(transitions);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test.each([
  ['Start opacity (%)', '-1'],
  ['End opacity (%)', '101'],
  ['End opacity (%)', ''],
  ['Start time (seconds)', '-1'],
  ['End time (seconds)', '2'],
  ['End time (seconds)', '11']
])('rejects invalid or overlapping opacity edits: %s = %s', (name, value) => {
  const {props} = setup({layers: [layer(opacityTransitions())]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name}), {target: {value}});
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
});

test('dragging and resizing opacity blocks preserve values and stop at neighboring blocks', () => {
  const transitions = opacityTransitions();
  const source = layer(transitions);
  const {props} = setup({layers: [source]});
  drag(screen.getByRole('button', {name: 'Opacity 1 · Points'}), 80, 300);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {
      opacity: [{...transitions[0], startTimeMs: 8000, endTimeMs: 10000}, transitions[1]]
    }
  });
  drag(screen.getByRole('slider', {name: 'End time for Opacity 1 · Points'}), 100, 300);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {opacity: [{...transitions[0], endTimeMs: 10000}, transitions[1]]}
  });
  drag(screen.getByRole('slider', {name: 'Start time for Opacity 2 · Points'}), 200, 20);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {opacity: [transitions[0], {...transitions[1], startTimeMs: 5000}]}
  });
});

test('keeps the time ruler fixed across committed edits and can expand its visible range', () => {
  const source = effect({startTimeMs: 0, endTimeMs: 20000});
  const {props, rerender} = setup({effects: [source], tour: null});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, next) => {
    source.setProps(next);
    props.playback.duration = next.animation.brightness.endTimeMs;
    rerender(<Editor {...props} />);
  });
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 400, 240);
  expect(getEffectAnimationEntries(source.animation?.brightness)[0].endTimeMs).toBe(12000);
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 240, 180);
  expect(getEffectAnimationEntries(source.animation?.brightness)[0].endTimeMs).toBe(9000);
  fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 90, 300);
  expect(getEffectAnimationEntries(source.animation?.brightness)[0].endTimeMs).toBe(30000);
});

test.each([1490, 1500, 1510])(
  'Fit contains ruler labels and end handles while retaining the exact %d ms range',
  endTimeMs => {
    const source = effect();
    source.animation!.brightness = {
      ...source.animation!.brightness,
      startTimeMs: 0,
      endTimeMs
    };
    const cut = layer([
      {
        id: 'cut',
        startTimeMs: endTimeMs,
        endTimeMs,
        startValue: 0,
        endValue: 1,
        easing: 'linear'
      }
    ]);
    const {props, rerender} = setup({
      effects: [source],
      layers: [cut],
      tour: {stops: [{...tour.stops[0], holdDurationMs: endTimeMs, travelDurationMs: 0}]}
    });
    rerender(
      <Editor {...props} playback={{...props.playback, elapsed: endTimeMs, duration: endTimeMs}} />
    );
    fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
    fireEvent.click(screen.getByRole('button', {name: 'Fit'}));
    const ruler = screen.getByRole('slider', {name: 'Animation playhead'});
    fireEvent.click(ruler, {clientX: 200});
    expect(props.playback.seek).toHaveBeenLastCalledWith(endTimeMs / 2);
    expect(props.updateEffectConfig).not.toHaveBeenCalled();
    expect(props.onLayerConfigChange).not.toHaveBeenCalled();

    // jsdom has no layout engine. Check the bounds for several intrinsic label
    // widths, including labels wider than the available track.
    const gutter = parseFloat(getComputedStyle(ruler).marginRight) || 0;
    const trackWidth = 400 - gutter;
    for (const tick of Array.from(ruler.querySelectorAll('span'))) {
      const style = getComputedStyle(tick);
      const position = parseFloat(style.left) / 100;
      const shift = Number(style.transform.match(/translateX\(([-\d.]+)%\)/)?.[1] ?? 0) / 100;
      const maxWidth = style.maxWidth.endsWith('%')
        ? (parseFloat(style.maxWidth) / 100) * trackWidth
        : parseFloat(style.maxWidth) || Infinity;
      for (const intrinsicWidth of [20, 80, trackWidth * 2]) {
        const width = Math.min(intrinsicWidth, maxWidth);
        const left = position * trackWidth + shift * width;
        expect(left).toBeGreaterThanOrEqual(-0.000001);
        expect(left + width).toBeLessThanOrEqual(trackWidth + 0.000001);
      }
    }
    const endHandle = screen.getByRole('slider', {name: 'End time for Opacity 1 · Points'});
    // jsdom also cannot resolve clamp(). Its lower bound is the furthest outward
    // handle offset, which must fit even for an instantaneous block at the end.
    const right = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules))
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
      .filter(rule => endHandle.matches(rule.selectorText))
      .map(rule => rule.style.getPropertyValue('right'))
      .filter(Boolean)
      .pop()!;
    const handleOverflow = -parseFloat(right.replace(/^clamp\(/, ''));
    const blockTrack = endHandle.parentElement!.parentElement!;
    expect(parseFloat(getComputedStyle(blockTrack).marginRight) || 0).toBeGreaterThanOrEqual(
      handleOverflow
    );
    expect(
      getComputedStyle(screen.getByRole('button', {name: 'Edit camera route'})).boxSizing
    ).toBe('border-box');
  }
);

test.each(['layer', 'annotation'] as const)(
  '%s block time inputs display and edit seconds with at most two decimal places',
  kind => {
    const timing = {
      id: 'precise',
      startTimeMs: 1234.5678,
      endTimeMs: 9876.5432,
      startValue: 0,
      endValue: 1,
      easing: 'linear' as const
    };
    const points = layer([timing]);
    const harbor = annotation([timing]);
    const {props, rerender} = setup({layers: [points], annotations: [harbor]});
    const open = () =>
      fireEvent.doubleClick(
        screen.getByRole('button', {name: `Opacity 1 · ${kind === 'layer' ? 'Points' : 'Harbor'}`})
      );
    const saved = () =>
      kind === 'layer'
        ? (props.onLayerConfigChange as jest.Mock).mock.lastCall[1].propertyTransitions.opacity
        : (props.onAnnotationChange as jest.Mock).mock.lastCall[1].propertyTransitions?.opacity;
    open();
    expect(screen.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(1.23);
    expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(9.88);
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(saved()).toEqual([timing]);
    open();
    const moved = {...timing, startTimeMs: 3456.789, endTimeMs: 8765.432};
    points.config.propertyTransitions = {opacity: [moved]};
    harbor.propertyTransitions = {opacity: [moved]};
    rerender(<Editor {...props} />);
    const start = screen.getByRole('spinbutton', {name: 'Start time (seconds)'});
    const end = screen.getByRole('spinbutton', {name: 'End time (seconds)'});
    expect(start).toHaveValue(3.46);
    expect(end).toHaveValue(8.77);
    fireEvent.change(start, {target: {value: ''}});
    expect(start).toHaveValue(null);
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    fireEvent.change(start, {target: {value: '2.3456'}});
    fireEvent.change(end, {target: {value: '7.891'}});
    expect(start).toHaveValue(2.35);
    expect(end).toHaveValue(7.89);
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(saved()).toEqual([{...timing, startTimeMs: 2350, endTimeMs: 7890}]);
  }
);

test('opacity popup times follow a block edit while unsaved endpoint values remain', () => {
  const source = layer(opacityTransitions());
  const {props, rerender} = setup({layers: [source]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End opacity (%)'}), {
    target: {value: '25'}
  });
  source.config.propertyTransitions = {
    opacity: source.config.propertyTransitions!.opacity.map((transition, index) =>
      index === 0 ? {...transition, startTimeMs: 5000, endTimeMs: 7000} : transition
    )
  };
  rerender(<Editor {...props} />);
  expect(screen.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(5);
  expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(7);
  expect(screen.getByRole('spinbutton', {name: 'End opacity (%)'})).toHaveValue(25);
});

function annotation(transitions?: LayerPropertyTransition[], id = 'harbor', label = 'Harbor') {
  return {
    id,
    label,
    isVisible: true,
    propertyTransitions: {opacity: transitions}
  } as unknown as Annotation;
}

test('adds multiple annotation opacity blocks on one shared ruler and removes only the selected block', () => {
  const source = annotation();
  const {props, rerender} = setup({annotations: [source], layers: [layer(opacityTransitions())]});
  (props.onAnnotationChange as jest.Mock).mockImplementation((_id, next) => {
    Object.assign(source, next);
    rerender(<Editor {...props} />);
  });
  const add = () => {
    fireEvent.click(screen.getByRole('button', {name: 'Add action'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Harbor'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Opacity'}));
  };
  add();
  expect(source.propertyTransitions?.opacity).toEqual([
    {
      id: 'opacity-1',
      startTimeMs: 5000,
      endTimeMs: 7000,
      startValue: 0,
      endValue: 1,
      easing: 'easeInOut'
    }
  ]);
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  add();
  expect(source.propertyTransitions?.opacity).toHaveLength(2);
  expect(source.propertyTransitions!.opacity[1]).toEqual({
    id: 'opacity-2',
    startTimeMs: 7000,
    endTimeMs: 9000,
    startValue: 1,
    endValue: 0,
    easing: 'easeInOut'
  });
  const row = within(screen.getByRole('group', {name: 'Annotation opacity: Harbor'}));
  expect(row.getByRole('button', {name: 'Opacity 1 · Harbor'})).toHaveTextContent('0% → 100%');
  expect(row.getByRole('button', {name: 'Opacity 2 · Harbor'})).toHaveTextContent('100% → 0%');
  expect(screen.getAllByRole('slider', {name: 'Animation playhead'})).toHaveLength(1);
  expect(screen.getByRole('group', {name: 'Layer opacity: Points'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.propertyTransitions?.opacity).toHaveLength(1);
  expect(source.propertyTransitions!.opacity[0].id).toBe('opacity-1');
  fireEvent.doubleClick(row.getByRole('button', {name: 'Opacity 1 · Harbor'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.propertyTransitions?.opacity).toEqual([]);
  expect(source.isVisible).toBe(true);
  expect(screen.queryByRole('group', {name: 'Annotation opacity: Harbor'})).toBeNull();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
});

test('annotation settings save values, times and easing without changing a layer with the same id', () => {
  const transitions = opacityTransitions();
  const source = annotation(transitions, 'points', 'Points');
  const futureProperty = [{...transitions[0], startValue: 10, endValue: 20}];
  source.propertyTransitions!.futureProperty = futureProperty;
  const layerSource = layer(opacityTransitions());
  const {props} = setup({annotations: [source], layers: [layerSource]});
  const annotationRow = within(screen.getByRole('group', {name: 'Annotation opacity: Points'}));
  const layerRow = within(screen.getByRole('group', {name: 'Layer opacity: Points'}));
  const block = annotationRow.getByRole('button', {name: 'Opacity 1 · Points'});
  fireEvent.click(block);
  expect(block).toHaveAttribute('aria-pressed', 'true');
  expect(layerRow.getByRole('button', {name: 'Opacity 1 · Points'})).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
  fireEvent.doubleClick(block);
  expect(screen.getByRole('region', {name: 'Animation editor'})).not.toContainElement(
    screen.getByRole('dialog', {name: 'Block settings'})
  );
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Start opacity (%)'}), {
    target: {value: '20'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End opacity (%)'}), {
    target: {value: '60'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '4.5'}
  });
  fireEvent.click(screen.getByRole('checkbox', {name: 'Linear easing'}));
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(props.onAnnotationChange).toHaveBeenCalledWith('points', {
    propertyTransitions: {
      futureProperty,
      opacity: [
        {...transitions[0], endTimeMs: 4500, startValue: 0.2, endValue: 0.6, easing: 'easeInOut'},
        transitions[1]
      ]
    }
  });
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(layerSource.config.propertyTransitions?.opacity).toEqual(transitions);
  expect(source.propertyTransitions?.opacity).toEqual(transitions);
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test('annotation opacity settings reject overlapping blocks', () => {
  const {props} = setup({annotations: [annotation(opacityTransitions())]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Harbor'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End time (seconds)'}), {
    target: {value: '11'}
  });
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
});

test('annotation block movement and both edges preserve values and respect neighboring blocks', () => {
  const transitions = opacityTransitions();
  const source = annotation(transitions);
  const {props} = setup({annotations: [source]});
  drag(screen.getByRole('button', {name: 'Opacity 1 · Harbor'}), 80, 300);
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    propertyTransitions: {
      opacity: [{...transitions[0], startTimeMs: 8000, endTimeMs: 10000}, transitions[1]]
    }
  });
  drag(screen.getByRole('slider', {name: 'End time for Opacity 1 · Harbor'}), 100, 300);
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    propertyTransitions: {opacity: [{...transitions[0], endTimeMs: 10000}, transitions[1]]}
  });
  drag(screen.getByRole('slider', {name: 'Start time for Opacity 2 · Harbor'}), 200, 20);
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    propertyTransitions: {opacity: [transitions[0], {...transitions[1], startTimeMs: 5000}]}
  });
  fireEvent.keyDown(screen.getByRole('button', {name: 'Opacity 1 · Harbor'}), {key: 'ArrowRight'});
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    propertyTransitions: {
      opacity: [{...transitions[0], startTimeMs: 3100, endTimeMs: 5100}, transitions[1]]
    }
  });
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test('hidden annotation blocks remain editable without enabling playback', () => {
  const source = annotation(opacityTransitions());
  source.isVisible = false;
  const {props, rerender} = setup({annotations: [source], effects: [], tour: null});
  rerender(<Editor {...props} playback={{...props.playback, duration: 0}} />);
  expect(screen.getByRole('group', {name: 'Annotation opacity: Harbor'})).toHaveTextContent(
    'Hidden annotation'
  );
  expect(screen.getByRole('button', {name: 'Play'})).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('button', {name: 'Opacity 1 · Harbor'}), {key: 'Enter'});
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End opacity (%)'}), {
    target: {value: '40'}
  });
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(props.onAnnotationChange).toHaveBeenCalledWith(source.id, {
    propertyTransitions: {
      opacity: [
        {...source.propertyTransitions!.opacity[0], endValue: 0.4},
        source.propertyTransitions!.opacity[1]
      ]
    }
  });
  expect(source.isVisible).toBe(false);
});

test.each(['layer', 'annotation'] as const)(
  'double-clicking empty %s row space inserts short held-value blocks without changing siblings',
  kind => {
    const transitions = opacityTransitions();
    const sourceLayer = layer(transitions);
    const sourceAnnotation = annotation(transitions);
    const {props, rerender} = setup({layers: [sourceLayer], annotations: [sourceAnnotation]});
    (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
      Object.assign(sourceLayer.config, config);
      rerender(<Editor {...props} />);
    });
    (props.onAnnotationChange as jest.Mock).mockImplementation((_id, config) => {
      Object.assign(sourceAnnotation, config);
      rerender(<Editor {...props} />);
    });
    const row = screen.getByRole('group', {
      name: kind === 'layer' ? 'Layer opacity: Points' : 'Annotation opacity: Harbor'
    });
    const track = row.lastElementChild!;
    for (const [start, end, value] of [
      [1000, 2000, 0],
      [6000, 7000, 1],
      [9500, 10000, 1],
      [19500, 20000, 0]
    ]) {
      fireEvent.doubleClick(track, {clientX: start / 50});
      const blocks = (kind === 'layer' ? sourceLayer.config : sourceAnnotation).propertyTransitions!
        .opacity;
      expect(blocks).toEqual(expect.arrayContaining(transitions));
      expect(blocks).toContainEqual(
        expect.objectContaining({
          startTimeMs: start,
          endTimeMs: end,
          startValue: value,
          endValue: value
        })
      );
      expect(screen.getByRole('spinbutton', {name: 'Start opacity (%)'})).toHaveValue(value * 100);
      expect(screen.getByRole('spinbutton', {name: 'End opacity (%)'})).toHaveValue(value * 100);
      fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
    }
    expect(
      kind === 'layer' ? props.onAnnotationChange : props.onLayerConfigChange
    ).not.toHaveBeenCalled();
    expect(props.updateEffectConfig).not.toHaveBeenCalled();
    const change = kind === 'layer' ? props.onLayerConfigChange : props.onAnnotationChange;
    (change as jest.Mock).mockClear();
    fireEvent.doubleClick(track, {clientX: 80}); // Existing 3–5 second block.
    fireEvent.doubleClick(track, {clientX: 400}); // No room at the ruler's end.
    fireEvent.doubleClick(track, {clientX: -1});
    fireEvent.doubleClick(track, {clientX: 300, button: 2});
    fireEvent.doubleClick(within(row).getAllByRole('button', {name: /^Opacity \d/})[0]);
    expect(screen.getByRole('dialog', {name: 'Block settings'})).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  }
);

test('row insertion respects the visible ruler and holds numeric and color properties', () => {
  const radius = opacityTransitions().map(block => ({...block, startValue: 12, endValue: 24}));
  const color = opacityTransitions().map(block => ({
    ...block,
    startValue: [200, 0, 20] as RGBColor,
    endValue: [0, 100, 220] as RGBColor
  }));
  const source = propertyLayer([radiusProperty, colorProperty], {radius, color});
  const {props, rerender} = setup({layers: [source]});
  (props.onLayerConfigChange as jest.Mock).mockImplementation((_layer, config) => {
    Object.assign(source.config, config);
    rerender(<Editor {...props} />);
  });
  fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
  fireEvent.doubleClick(
    screen.getByRole('group', {name: 'Layer radius: Points'}).lastElementChild!,
    {clientX: 60}
  );
  expect(source.config.propertyTransitions!.radius[1]).toMatchObject({
    startTimeMs: 6000,
    endTimeMs: 7000,
    startValue: 24,
    endValue: 24
  });
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  fireEvent.doubleClick(
    screen.getByRole('group', {name: 'Layer color: Points'}).lastElementChild!,
    {clientX: 60}
  );
  const added = source.config.propertyTransitions!.color[1];
  expect(added).toMatchObject({
    startTimeMs: 6000,
    endTimeMs: 7000,
    startValue: [0, 100, 220],
    endValue: [0, 100, 220]
  });
  expect(added.startValue).not.toBe(added.endValue);
  expect(source.config.propertyTransitions!.radius).toHaveLength(3);
});

test('empty row insertion ignores missing callbacks and unmeasurable tracks', () => {
  const {props} = setup({
    layers: [layer(opacityTransitions())],
    annotations: [annotation(opacityTransitions())],
    onLayerConfigChange: undefined
  });
  fireEvent.doubleClick(
    screen.getByRole('group', {name: 'Layer opacity: Points'}).lastElementChild!,
    {clientX: 120}
  );
  const track = screen.getByRole('group', {name: 'Annotation opacity: Harbor'}).lastElementChild!;
  jest
    .spyOn(track, 'getBoundingClientRect')
    .mockReturnValue({...track.getBoundingClientRect(), width: 0});
  fireEvent.doubleClick(track, {clientX: 120});
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog', {name: 'Block settings'})).toBeNull();
});

test('effect row insertion preserves its original block and edits, drags and removes one new block', () => {
  const source = effect();
  const original = source.animation!.brightness;
  const parameters = {...source.parameters};
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, config) => {
    source.setProps(config);
    rerender(<Editor {...props} />);
  });
  const row = screen.getByRole('group', {name: 'Brightness Contrast: Brightness'});
  fireEvent.doubleClick(row.lastElementChild!, {clientX: 180});
  const blocks = getEffectAnimationEntries(source.animation?.brightness);
  expect(blocks).toEqual([
    {...original, id: 'brightness-1'},
    {
      id: 'brightness-2',
      startTimeMs: 9000,
      endTimeMs: 10000,
      startValue: 1,
      endValue: 1,
      easing: 'linear'
    }
  ]);
  expect(source.parameters).toEqual(parameters);
  expect(screen.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(9);
  expect(screen.getByRole('spinbutton', {name: 'End value'})).toHaveValue(1);
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Start time (seconds)'}), {
    target: {value: '6'}
  });
  expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Start time (seconds)'}), {
    target: {value: '9'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End value'}), {target: {value: '0.5'}});
  fireEvent.blur(screen.getByRole('spinbutton', {name: 'End value'}));
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  expect(getEffectAnimationEntries(source.animation?.brightness)).toEqual([
    blocks[0],
    {...blocks[1], endValue: 0.5}
  ]);
  expect(source.parameters).toEqual(parameters);
  drag(screen.getByRole('button', {name: 'Brightness 2'}), 180, 240);
  expect(getEffectAnimationEntries(source.animation?.brightness)[1]).toMatchObject({
    startTimeMs: 12000,
    endTimeMs: 13000,
    startValue: 1,
    endValue: 0.5
  });
  drag(screen.getByRole('slider', {name: 'Start time for Brightness 2'}), 240, 40);
  expect(getEffectAnimationEntries(source.animation?.brightness)[1].startTimeMs).toBe(7000);
  // Start a fresh click sequence after the drag, as the browser does before a double-click.
  drag(screen.getByRole('button', {name: 'Brightness 2'}), 140, 140);
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Brightness 2'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove animation'}));
  expect(source.animation?.brightness).toEqual([blocks[0]]);
  fireEvent.click(screen.getByRole('button', {name: 'Remove Brightness'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove'}));
  expect(source.animation).toBeUndefined();
  expect(source.parameters).toEqual(parameters);
});

test('effect blocks fit around existing blocks and preserve their explicit timing', () => {
  const source = effect();
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, config) => {
    source.setProps(config);
    rerender(<Editor {...props} />);
  });
  fireEvent.doubleClick(
    screen.getByRole('group', {name: 'Brightness Contrast: Brightness'}).lastElementChild!,
    {clientX: 50}
  );
  expect(getEffectAnimationEntries(source.animation?.brightness)[0]).toMatchObject({
    startTimeMs: 2500,
    endTimeMs: 3000,
    startValue: 0,
    endValue: 0
  });
  fireEvent.click(screen.getByRole('button', {name: 'Close effect settings'}));
  source.setProps({animation: effect({startTimeMs: 0, endTimeMs: 20000}).animation});
  rerender(<Editor {...props} />);
  const track = screen.getByRole('group', {name: 'Brightness Contrast: Brightness'})
    .lastElementChild!;
  (props.updateEffectConfig as jest.Mock).mockClear();
  fireEvent.doubleClick(track, {clientX: 200});
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
  fireEvent.doubleClick(track, {clientX: 250});
  expect(getEffectAnimationEntries(source.animation?.brightness)).toEqual([
    {
      id: 'brightness-1',
      startTimeMs: 0,
      endTimeMs: 20000,
      startValue: 0,
      endValue: 1,
      easing: 'linear'
    },
    {
      id: 'brightness-2',
      startTimeMs: 25000,
      endTimeMs: 26000,
      startValue: 1,
      endValue: 1,
      easing: 'linear'
    }
  ]);
});

test('effect row insertion copies vector endpoints and preserves authored parameters', () => {
  const source = createEffect({
    type: 'dotScreen',
    parameters: {center: [0.1, 0.9]},
    animation: {
      center: {
        startValue: [0.2, 0.8],
        endValue: [0.8, 0.2],
        startTimeMs: 1000,
        endTimeMs: 2000,
        easing: 'linear'
      }
    }
  });
  const {props, rerender} = setup({effects: [source]});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, config) => {
    source.setProps(config);
    rerender(<Editor {...props} />);
  });
  const row = screen.getByRole('group', {name: 'Dot Screen: Center'});
  fireEvent.doubleClick(row.lastElementChild!, {clientX: 120});
  const blocks = getEffectAnimationEntries(source.animation?.center);
  expect(blocks[1]).toMatchObject({
    startTimeMs: 6000,
    endTimeMs: 7000,
    startValue: [0.8, 0.2],
    endValue: [0.8, 0.2]
  });
  expect(blocks[1].startValue).not.toBe(blocks[1].endValue);
  expect(blocks[1].startValue).not.toBe(blocks[0].endValue);
  expect(source.parameters.center).toEqual([0.1, 0.9]);
});
