// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent} from '@testing-library/react';
import {ZOOM_OPACITY_RANGE} from '@kepler.gl/reducers';
import ZoomOpacitySlider from './zoom-opacity-slider';

import {VisStateActions} from '@kepler.gl/actions';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';

import PanelHeaderActionFactory from '../panel-header-action';
import ZoomOpacityConfigFactory from './zoom-opacity-config';

const ZoomOpacityConfig = ZoomOpacityConfigFactory(PanelHeaderActionFactory());

describe('ZoomOpacityConfig', () => {
  test('renders for existing callers that omit annotations', () => {
    const {container} = renderWithTheme(
      <ZoomOpacityConfig layers={[]} visStateActions={VisStateActions} />
    );

    expect(container.querySelector('.interaction-zoom-opacity')).not.toBeNull();
  });
});

describe('ZoomOpacitySlider interactions', () => {
  const stops = {appear: 2, full: 4, fade: 12, gone: 16};
  const originalObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver');
  const originalPointer = Object.getOwnPropertyDescriptor(window, 'PointerEvent');
  let measure: () => void;
  let width: number;
  let observe: jest.Mock;
  let disconnect: jest.Mock;

  beforeEach(() => {
    width = 220;
    observe = jest.fn();
    disconnect = jest.fn();
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: class {
        constructor(callback: () => void) {
          measure = callback;
        }
        observe = observe;
        disconnect = disconnect;
      }
    });
    Object.defineProperty(window, 'PointerEvent', {configurable: true, value: MouseEvent});
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      x: 100,
      y: 0,
      left: 100,
      top: 0,
      right: 100 + width,
      bottom: 40,
      width,
      height: 40,
      toJSON: () => undefined
    }));
  });

  afterEach(() => {
    fireEvent.pointerCancel(window);
    cleanup();
    jest.restoreAllMocks();
    if (originalObserver) Object.defineProperty(globalThis, 'ResizeObserver', originalObserver);
    else Reflect.deleteProperty(globalThis, 'ResizeObserver');
    if (originalPointer) Object.defineProperty(window, 'PointerEvent', originalPointer);
    else Reflect.deleteProperty(window, 'PointerEvent');
  });

  function setup() {
    const onChange = jest.fn();
    const view = renderWithTheme(
      <IntlWrapper>
        <ZoomOpacitySlider idPrefix="test" stops={stops} onChange={onChange} />
      </IntlWrapper>
    );
    return {...view, onChange};
  }

  test.each([
    ['ArrowLeft', false, -0.1],
    ['ArrowDown', true, -1],
    ['ArrowRight', false, 0.1],
    ['ArrowUp', true, 1]
  ])('adjusts each stop with %s (shift=%s)', (key, shiftKey, delta) => {
    const {getAllByRole, onChange} = setup();
    getAllByRole('slider').forEach((handle, index) => {
      const stop = Object.keys(stops)[index];
      expect(handle).toHaveAttribute('aria-valuenow', String(stops[stop]));
      expect(handle).toHaveAttribute('aria-valuemin', String(ZOOM_OPACITY_RANGE[0]));
      expect(handle).toHaveAttribute('aria-valuemax', String(ZOOM_OPACITY_RANGE[1]));
      fireEvent.keyDown(handle, {key, shiftKey});
      expect(onChange).toHaveBeenLastCalledWith(stop, stops[stop] + Number(delta));
    });
    onChange.mockClear();
    fireEvent.keyDown(getAllByRole('slider')[0], {key: 'Tab'});
    expect(onChange).not.toHaveBeenCalled();
  });

  test.each(['pointerUp', 'pointerCancel'])(
    'ends dragging on %s and can start another stop',
    end => {
      const {getAllByRole, onChange} = setup();
      const handles = getAllByRole('slider');
      const capture = jest.fn();
      Object.defineProperty(handles[0], 'setPointerCapture', {value: capture});
      fireEvent.pointerDown(handles[0], {clientX: 210});
      expect(capture).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(
        'appear',
        (ZOOM_OPACITY_RANGE[0] + ZOOM_OPACITY_RANGE[1]) / 2
      );
      fireEvent.pointerMove(window, {clientX: 50});
      expect(onChange).toHaveBeenLastCalledWith('appear', ZOOM_OPACITY_RANGE[0]);
      fireEvent.pointerMove(window, {clientX: 500});
      expect(onChange).toHaveBeenLastCalledWith('appear', ZOOM_OPACITY_RANGE[1]);
      fireEvent[end](window);
      onChange.mockClear();
      fireEvent.pointerMove(window, {clientX: 210});
      expect(onChange).not.toHaveBeenCalled();
      // jsdom has no setPointerCapture: fallback must still support dragging.
      fireEvent.pointerDown(handles[2], {clientX: 210});
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(
        'fade',
        (ZOOM_OPACITY_RANGE[0] + ZOOM_OPACITY_RANGE[1]) / 2
      );
      fireEvent.pointerUp(window);
    }
  );

  test('waits for layout, remeasures resized coordinates and disconnects on unmount', () => {
    width = 0;
    const {queryAllByRole, getAllByRole, onChange, unmount} = setup();
    expect(queryAllByRole('slider')).toHaveLength(0);
    expect(observe).toHaveBeenCalledTimes(1);
    width = 420;
    act(() => measure());
    expect(getAllByRole('slider')).toHaveLength(4);
    fireEvent.pointerDown(getAllByRole('slider')[1], {clientX: 310});
    expect(onChange).toHaveBeenLastCalledWith(
      'full',
      (ZOOM_OPACITY_RANGE[0] + ZOOM_OPACITY_RANGE[1]) / 2
    );
    fireEvent.pointerUp(window);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
