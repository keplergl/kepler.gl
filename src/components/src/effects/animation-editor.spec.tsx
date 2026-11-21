// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {createEffect} from '@kepler.gl/effects';
import type {Layer} from '@kepler.gl/layers';
import {
  DEFAULT_LAYER_ANIMATABLE_PROPS,
  getLayerOpacityTransitions,
  rgbToHex
} from '@kepler.gl/utils';
import type {
  Annotation,
  CameraTour,
  LayerAnimatableProp,
  LayerOpacityTransition,
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
function effect(timed = true) {
  return createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0.2},
    animation: {
      brightness: {
        startValue: 0,
        endValue: 1,
        easing: 'linear',
        ...(timed ? {startTimeMs: 3000, endTimeMs: 7000} : {})
      }
    }
  });
}
function layer(
  opacityTransitions?: LayerOpacityTransition[],
  visibilityTiming?: Layer['config']['visibilityTiming']
) {
  return {
    id: 'points',
    animatableProps: DEFAULT_LAYER_ANIMATABLE_PROPS,
    config: {
      label: 'Points',
      color: [10, 20, 30],
      isVisible: true,
      opacityTransitions,
      visibilityTiming
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

test('legacy effects keep full-duration timing until a block boundary is edited', () => {
  const source = effect(false);
  const {props} = setup({effects: [source], tour: null});
  expect(screen.getByRole('slider', {name: 'Start time for Brightness'})).toHaveAttribute(
    'aria-valuenow',
    '0'
  );
  expect(screen.getByRole('slider', {name: 'End time for Brightness'})).toHaveAttribute(
    'aria-valuenow',
    '20000'
  );
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Brightness'}));
  expect(screen.getByRole('checkbox', {name: 'Use full animation duration'})).toBeChecked();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
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

function opacityTransitions(): LayerOpacityTransition[] {
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
  expect(screen.getByRole('menuitem', {name: 'Brightness Contrast'})).toHaveFocus();
  expect(screen.queryByRole('menuitem', {name: 'Camera route'})).not.toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Points'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Radius'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Stroke width'})).toBeNull();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.playback.pause).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Back'}));
  expect(screen.getByRole('menuitem', {name: 'Brightness Contrast'})).toHaveFocus();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Arcs'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Stroke width'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.getByRole('menuitem', {name: 'Brightness Contrast'})).toHaveFocus();
  fireEvent.click(screen.getByRole('menuitem', {name: 'Harbor'}));
  expect(screen.getByRole('menuitem', {name: 'Back'})).toHaveFocus();
  expect(screen.getByRole('menuitem', {name: 'Opacity'})).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', {name: 'Radius'})).toBeNull();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.getByRole('menuitem', {name: 'Brightness Contrast'})).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, {key: 'Escape'});
  expect(screen.queryByRole('menu')).toBeNull();
  expect(addButton).toHaveFocus();
  expect(props.playback.pause).not.toHaveBeenCalled();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(props.onAnnotationChange).not.toHaveBeenCalled();
  expect(props.updateEffectConfig).not.toHaveBeenCalled();
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
  expect(annotationSource.opacityTransitions).toEqual(opacityTransitions());

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
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
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
      },
      opacityTransitions: undefined,
      visibilityTiming: undefined
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
    propertyTransitions: {color: [{...color[0], startTimeMs: 8000, endTimeMs: 10000}, color[1]]},
    opacityTransitions: undefined,
    visibilityTiming: undefined
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

test('concurrent property rows edit independently, preserve siblings and migrate legacy opacity', () => {
  const radius = [{...opacityTransitions()[0], id: 'in', startValue: 12, endValue: 24}];
  const unsupported = [{...radius[0], endValue: 30}];
  const source = propertyLayer([radiusProperty], {radius, unsupported});
  source.config.visibilityTiming = {
    startTimeMs: 3000,
    endTimeMs: 10000,
    fadeInMs: 2000,
    fadeOutMs: 1000
  };
  const legacyOpacity = getLayerOpacityTransitions(source.config);
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
    opacity: legacyOpacity,
    radius: [{...radius[0], endValue: 32, endTimeMs: 9000}],
    unsupported
  });
  expect(source.config.opacityTransitions).toBeUndefined();
  expect(source.config.visibilityTiming).toBeUndefined();
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Radius 1 · Points'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
  expect(source.config.propertyTransitions).toEqual({
    opacity: legacyOpacity,
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
    },
    opacityTransitions: undefined,
    visibilityTiming: undefined
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
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
  expect(source.config.propertyTransitions?.opacity).toHaveLength(1);
  expect(source.config.propertyTransitions!.opacity[0].id).toBe('opacity-1');
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Points'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
  expect(source.config.propertyTransitions?.opacity).toEqual([]);
  expect(source.config.visibilityTiming).toBeUndefined();
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
    },
    opacityTransitions: undefined,
    visibilityTiming: undefined
  });
  expect(source.config.opacityTransitions).toEqual(transitions);
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
    },
    opacityTransitions: undefined,
    visibilityTiming: undefined
  });
  drag(screen.getByRole('slider', {name: 'End time for Opacity 1 · Points'}), 100, 300);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {opacity: [{...transitions[0], endTimeMs: 10000}, transitions[1]]},
    opacityTransitions: undefined,
    visibilityTiming: undefined
  });
  drag(screen.getByRole('slider', {name: 'Start time for Opacity 2 · Points'}), 200, 20);
  expect(props.onLayerConfigChange).toHaveBeenLastCalledWith(source, {
    propertyTransitions: {opacity: [transitions[0], {...transitions[1], startTimeMs: 5000}]},
    opacityTransitions: undefined,
    visibilityTiming: undefined
  });
});

test('keeps the time ruler fixed across committed edits and can expand its visible range', () => {
  const source = effect(false);
  const {props, rerender} = setup({effects: [source], tour: null});
  (props.updateEffectConfig as jest.Mock).mockImplementation((_event, _id, next) => {
    source.setProps(next);
    props.playback.duration = next.animation.brightness.endTimeMs;
    rerender(<Editor {...props} />);
  });
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 400, 240);
  expect(source.animation!.brightness.endTimeMs).toBe(12000);
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 240, 180);
  expect(source.animation!.brightness.endTimeMs).toBe(9000);
  fireEvent.click(screen.getByRole('button', {name: 'Zoom out'}));
  drag(screen.getByRole('slider', {name: 'End time for Brightness'}), 90, 300);
  expect(source.animation!.brightness.endTimeMs).toBe(30000);
});

test('legacy visibility displays equivalent opacity blocks and converts only when edited', () => {
  const timing = {startTimeMs: 3000, endTimeMs: 10000, fadeInMs: 2000, fadeOutMs: 1000};
  const source = layer(undefined, timing);
  const {props} = setup({layers: [source]});
  expect(screen.getByRole('slider', {name: 'End time for Opacity 1 · Points'})).toHaveAttribute(
    'aria-valuenow',
    '5000'
  );
  expect(screen.getByRole('slider', {name: 'Start time for Opacity 2 · Points'})).toHaveAttribute(
    'aria-valuenow',
    '9000'
  );
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 2 · Points'}));
  expect(screen.getByRole('spinbutton', {name: 'Start opacity (%)'})).toHaveValue(100);
  expect(screen.getByRole('spinbutton', {name: 'End opacity (%)'})).toHaveValue(0);
  fireEvent.click(screen.getByRole('button', {name: 'Close block settings'}));
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  drag(screen.getByRole('slider', {name: 'End time for Opacity 2 · Points'}), 200, 240);
  expect(props.onLayerConfigChange).toHaveBeenCalledWith(source, {
    propertyTransitions: {
      opacity: [
        {
          id: 'legacy-visibility-in',
          startTimeMs: 3000,
          endTimeMs: 5000,
          startValue: 0,
          endValue: 1,
          easing: 'linear'
        },
        {
          id: 'legacy-visibility-out',
          startTimeMs: 9000,
          endTimeMs: 12000,
          startValue: 1,
          endValue: 0,
          easing: 'linear'
        }
      ]
    },
    opacityTransitions: undefined,
    visibilityTiming: undefined
  });
  expect(source.config.visibilityTiming).toEqual(timing);
});

test('opacity popup times follow a block edit while unsaved endpoint values remain', () => {
  const source = layer(opacityTransitions());
  const {props, rerender} = setup({layers: [source]});
  fireEvent.doubleClick(screen.getByRole('button', {name: 'Opacity 1 · Points'}));
  fireEvent.change(screen.getByRole('spinbutton', {name: 'End opacity (%)'}), {
    target: {value: '25'}
  });
  source.config.opacityTransitions = source.config.opacityTransitions!.map((transition, index) =>
    index === 0 ? {...transition, startTimeMs: 5000, endTimeMs: 7000} : transition
  );
  rerender(<Editor {...props} />);
  expect(screen.getByRole('spinbutton', {name: 'Start time (seconds)'})).toHaveValue(5);
  expect(screen.getByRole('spinbutton', {name: 'End time (seconds)'})).toHaveValue(7);
  expect(screen.getByRole('spinbutton', {name: 'End opacity (%)'})).toHaveValue(25);
});

function annotation(transitions?: LayerOpacityTransition[], id = 'harbor', label = 'Harbor') {
  return {id, label, isVisible: true, opacityTransitions: transitions} as unknown as Annotation;
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
  expect(source.opacityTransitions).toEqual([
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
  expect(source.opacityTransitions).toHaveLength(2);
  expect(source.opacityTransitions![1]).toEqual({
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
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
  expect(source.opacityTransitions).toHaveLength(1);
  expect(source.opacityTransitions![0].id).toBe('opacity-1');
  fireEvent.doubleClick(row.getByRole('button', {name: 'Opacity 1 · Harbor'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove action'}));
  expect(source.opacityTransitions).toEqual([]);
  expect(source.isVisible).toBe(true);
  expect(screen.queryByRole('group', {name: 'Annotation opacity: Harbor'})).toBeNull();
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
});

test('annotation settings save values, times and easing without changing a layer with the same id', () => {
  const transitions = opacityTransitions();
  const source = annotation(transitions, 'points', 'Points');
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
    opacityTransitions: [
      {...transitions[0], endTimeMs: 4500, startValue: 0.2, endValue: 0.6, easing: 'easeInOut'},
      transitions[1]
    ]
  });
  expect(props.onLayerConfigChange).not.toHaveBeenCalled();
  expect(layerSource.config.opacityTransitions).toEqual(transitions);
  expect(source.opacityTransitions).toEqual(transitions);
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
    opacityTransitions: [{...transitions[0], startTimeMs: 8000, endTimeMs: 10000}, transitions[1]]
  });
  drag(screen.getByRole('slider', {name: 'End time for Opacity 1 · Harbor'}), 100, 300);
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    opacityTransitions: [{...transitions[0], endTimeMs: 10000}, transitions[1]]
  });
  drag(screen.getByRole('slider', {name: 'Start time for Opacity 2 · Harbor'}), 200, 20);
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    opacityTransitions: [transitions[0], {...transitions[1], startTimeMs: 5000}]
  });
  fireEvent.keyDown(screen.getByRole('button', {name: 'Opacity 1 · Harbor'}), {key: 'ArrowRight'});
  expect(props.onAnnotationChange).toHaveBeenLastCalledWith(source.id, {
    opacityTransitions: [{...transitions[0], startTimeMs: 3100, endTimeMs: 5100}, transitions[1]]
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
    opacityTransitions: [
      {...source.opacityTransitions![0], endValue: 0.4},
      source.opacityTransitions![1]
    ]
  });
  expect(source.isVisible).toBe(false);
});
