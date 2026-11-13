// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render} from '@testing-library/react';
import {observeDimensions, unobserveDimensions} from '@kepler.gl/utils';
import LayoutSplitter, {LayoutSplitterMode, LayoutSplitterProps} from './layout-splitter';

jest.mock('@kepler.gl/utils', () => ({
  observeDimensions: jest.fn(),
  unobserveDimensions: jest.fn()
}));

// jsdom does not implement PointerEvent or pointer capture. Supply only the
// missing browser surface; dispatch real DOM events through React's handlers.
function pointer(target: HTMLElement, type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, {bubbles: true, cancelable: true, clientX, clientY});
  Object.defineProperty(event, 'pointerId', {value: 7});
  fireEvent(target, event);
  return event;
}

function setup(overrides: Partial<LayoutSplitterProps> = {}) {
  const props: LayoutSplitterProps = {
    mode: LayoutSplitterMode.VERTICAL,
    referenceElement: {left: 100, right: 500, top: 50, bottom: 250},
    percentageSplit: 25,
    onMove: jest.fn(),
    onRelease: jest.fn(),
    ...overrides
  };
  const parentPointer = jest.fn();
  const parentClick = jest.fn();
  const view = (next: LayoutSplitterProps) => (
    <div
      onPointerDown={parentPointer}
      onPointerMove={parentPointer}
      onPointerUp={parentPointer}
      onPointerCancel={parentPointer}
      onClick={parentClick}
    >
      <LayoutSplitter {...next} />
    </div>
  );
  const result = render(view(props));
  const splitter = result.container.querySelector<HTMLElement>('.layout-splitter');
  if (!splitter) throw new Error('Missing layout splitter');
  splitter.setPointerCapture = jest.fn();
  splitter.releasePointerCapture = jest.fn();
  return {
    ...result,
    props,
    splitter,
    parentPointer,
    parentClick,
    update: (updates: Partial<LayoutSplitterProps>) =>
      result.rerender(view(Object.assign(props, updates)))
  };
}

beforeEach(() => jest.clearAllMocks());

describe('LayoutSplitter pointer interaction', () => {
  test.each([
    [LayoutSplitterMode.VERTICAL, 400, 80, 'left', '100px'],
    [LayoutSplitterMode.HORIZONTAL, 120, 200, 'top', '50px']
  ] as const)(
    'converts %s dragging to a controlled percentage and captures the pointer',
    (mode, x, y, axis, position) => {
      const {splitter, props, update, parentPointer} = setup({mode});
      expect(splitter.style[axis]).toBe(position);
      const down = pointer(splitter, 'pointerdown', 200, 100);
      expect(down.defaultPrevented).toBe(true);
      expect(splitter.setPointerCapture).toHaveBeenCalledWith(7);
      const move = pointer(splitter, 'pointermove', x, y);
      expect(move.defaultPrevented).toBe(true);
      expect(props.onMove).toHaveBeenCalledWith(75);
      expect(props.onRelease).not.toHaveBeenCalled();
      // A drag requests a change; only the parent's controlled value moves it.
      expect(splitter.style[axis]).toBe(position);
      update({percentageSplit: 75});
      expect(splitter.style[axis]).toBe(mode === LayoutSplitterMode.VERTICAL ? '300px' : '150px');
      pointer(splitter, 'pointerup', x, y);
      expect(props.onMove).toHaveBeenCalledTimes(1);
      expect(props.onRelease).toHaveBeenCalledWith(75);
      expect(splitter.releasePointerCapture).toHaveBeenCalledWith(7);
      expect(parentPointer).not.toHaveBeenCalled();
      pointer(splitter, 'pointermove', 300, 150);
      expect(props.onMove).toHaveBeenCalledTimes(1);
    }
  );

  test.each([LayoutSplitterMode.VERTICAL, LayoutSplitterMode.HORIZONTAL])(
    'clamps %s moves and release outside the reference bounds',
    mode => {
      const {splitter, props} = setup({mode});
      pointer(splitter, 'pointerdown', 200, 100);
      pointer(splitter, 'pointermove', -100, -100);
      expect(props.onMove).toHaveBeenLastCalledWith(0);
      pointer(splitter, 'pointerup', 1000, 1000);
      expect(props.onMove).toHaveBeenLastCalledWith(100);
      expect(props.onRelease).toHaveBeenCalledWith(100);
    }
  );

  test('ignores idle moves/releases and does not emit redundant controlled values', () => {
    const {splitter, props} = setup();
    pointer(splitter, 'pointermove', 400, 100);
    pointer(splitter, 'pointerup', 400, 100);
    expect(splitter.releasePointerCapture).not.toHaveBeenCalled();
    pointer(splitter, 'pointerdown', 200, 100);
    pointer(splitter, 'pointermove', 200, 100);
    pointer(splitter, 'pointerup', 200, 100);
    expect(props.onMove).not.toHaveBeenCalled();
    expect(props.onRelease).toHaveBeenCalledTimes(1);
    expect(props.onRelease).toHaveBeenCalledWith(25);
  });

  test('cancellation releases capture and ends the gesture', () => {
    const {splitter, props, parentPointer} = setup();
    pointer(splitter, 'pointerdown', 200, 100);
    pointer(splitter, 'pointercancel', 300, 100);
    expect(splitter.releasePointerCapture).toHaveBeenCalledWith(7);
    expect(props.onRelease).toHaveBeenCalledWith(50);
    expect(parentPointer).not.toHaveBeenCalled();
    pointer(splitter, 'pointermove', 400, 100);
    pointer(splitter, 'pointerup', 400, 100);
    expect(props.onMove).toHaveBeenCalledTimes(1);
    expect(props.onRelease).toHaveBeenCalledTimes(1);
  });

  test('supports an inert splitter without callbacks and isolates clicks from the map', () => {
    const {splitter, parentClick} = setup({onMove: undefined, onRelease: undefined});
    pointer(splitter, 'pointerdown', 200, 100);
    pointer(splitter, 'pointermove', 300, 100);
    pointer(splitter, 'pointerup', 400, 100);
    fireEvent.click(splitter);
    expect(parentClick).not.toHaveBeenCalled();
    expect(splitter.releasePointerCapture).toHaveBeenCalledWith(7);
  });
});

describe('LayoutSplitter reference dimensions', () => {
  test.each([LayoutSplitterMode.VERTICAL, LayoutSplitterMode.HORIZONTAL])(
    'repositions %s on observed resize and uses the latest bounds for dragging',
    mode => {
      const referenceElement = document.createElement('div');
      const rect = jest.spyOn(referenceElement, 'getBoundingClientRect');
      rect.mockReturnValue({left: 100, right: 500, top: 50, bottom: 250} as DOMRect);
      const {splitter, props, unmount} = setup({mode, referenceElement, resizeThrottleDelay: 80});
      expect(observeDimensions).toHaveBeenCalledWith(referenceElement, expect.any(Function), 80);
      rect.mockReturnValue({left: 200, right: 1000, top: 100, bottom: 500} as DOMRect);
      const resize = jest.mocked(observeDimensions).mock.calls[0][1];
      act(() => resize({width: 800, height: 400}));
      expect(splitter.style[mode === LayoutSplitterMode.VERTICAL ? 'left' : 'top']).toBe(
        mode === LayoutSplitterMode.VERTICAL ? '200px' : '100px'
      );
      expect(props.onMove).not.toHaveBeenCalled();
      pointer(splitter, 'pointerdown', 400, 200);
      pointer(splitter, 'pointerup', 800, 400);
      expect(props.onRelease).toHaveBeenCalledWith(75);
      unmount();
      expect(unobserveDimensions).toHaveBeenCalledTimes(1);
      expect(unobserveDimensions).toHaveBeenCalledWith(referenceElement);
    }
  );

  test('uses updated virtual bounds without subscribing to DOM dimension observers', () => {
    const {splitter, update, unmount} = setup();
    expect(observeDimensions).not.toHaveBeenCalled();
    update({referenceElement: {left: 20, right: 820, top: 10, bottom: 410}});
    expect(splitter.style.left).toBe('200px');
    update({percentageSplit: -10});
    expect(splitter.style.left).toBe('0px');
    update({percentageSplit: 110});
    expect(splitter.style.left).toBe('800px');
    unmount();
    expect(unobserveDimensions).not.toHaveBeenCalled();
  });
});
