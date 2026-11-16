// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import RangeBrushFactory, {RangeBrushProps} from './range-brush';

const RangeBrush = RangeBrushFactory();

function setup(overrides: Partial<RangeBrushProps> = {}) {
  const props: RangeBrushProps = {
    range: [0, 100],
    value: [20, 60],
    width: 200,
    height: 50,
    step: 1,
    onBrush: jest.fn(),
    onBrushStart: jest.fn(),
    onBrushEnd: jest.fn(),
    onMouseoverHandle: jest.fn(),
    onMouseoutHandle: jest.fn(),
    ...overrides
  };
  const view = (next: RangeBrushProps) => (
    <ThemeProvider theme={theme}>
      <svg
        viewBox={`0 0 ${next.width} ${next.height}`}
        ref={svg => {
          // jsdom does not implement SVG viewBox.baseVal, used by real d3-brush.
          if (svg)
            Object.defineProperty(svg, 'viewBox', {
              configurable: true,
              value: {
                baseVal: {x: 0, y: 0, width: next.width, height: next.height}
              }
            });
        }}
      >
        <RangeBrush {...next} />
      </svg>
    </ThemeProvider>
  );
  // Child mount runs before a parent ref callback, so supply the SVG API on the prototype.
  const descriptor = Object.getOwnPropertyDescriptor(SVGElement.prototype, 'viewBox');
  Object.defineProperty(SVGElement.prototype, 'viewBox', {
    configurable: true,
    get: () => ({baseVal: {x: 0, y: 0, width: props.width, height: props.height}})
  });
  try {
    const result = render(view(props));
    return {
      ...result,
      props,
      update: (updates: Partial<RangeBrushProps>) => result.rerender(view({...props, ...updates}))
    };
  } finally {
    if (descriptor) Object.defineProperty(SVGElement.prototype, 'viewBox', descriptor);
    else delete (SVGElement.prototype as any).viewBox;
  }
}

function drag(target: Element, start: number, end: number, clientY = 10) {
  fireEvent.mouseDown(target, {clientX: start, clientY, button: 0, view: window});
  fireEvent.mouseMove(window, {clientX: end, clientY, buttons: 1, view: window});
  fireEvent.mouseUp(window, {clientX: end, clientY, button: 0, view: window});
}

function element(container: HTMLElement, selector: string): Element {
  const result = container.querySelector(selector);
  if (!result) throw new Error(`Missing brush element: ${selector}`);
  return result;
}

function selection(container: HTMLElement) {
  const rect = element(container, '.selection');
  return [Number(rect.getAttribute('x')), Number(rect.getAttribute('width'))];
}

describe('RangeBrush interaction', () => {
  test('reflects controlled values, resize and domain changes without emitting a filter update', () => {
    const {container, props, update} = setup();
    expect(selection(container)).toEqual([40, 80]);
    update({value: [30, 70]});
    expect(selection(container)).toEqual([60, 80]);
    update({width: 400});
    expect(selection(container)).toEqual([80, 160]);
    update({range: [-100, 100]});
    expect(selection(container)).toEqual([120, 40]);
    expect(props.onBrush).not.toHaveBeenCalled();
  });

  test('converts a real D3 drag to a snapped range and finishes the gesture', () => {
    const {container, props} = setup({step: 10});
    jest.mocked(props.onBrushStart).mockClear();
    jest.mocked(props.onBrushEnd).mockClear();
    drag(element(container, '.overlay'), 31, 153);
    expect(props.onBrush).toHaveBeenLastCalledWith(20, 80);
    expect(props.onBrushStart).toHaveBeenCalled();
    expect(props.onBrushEnd).toHaveBeenCalled();
    expect(selection(container)).toEqual([40, 120]);
    const calls = jest.mocked(props.onBrush).mock.calls.length;
    fireEvent.mouseMove(window, {clientX: 190, buttons: 0, view: window});
    expect(props.onBrush).toHaveBeenCalledTimes(calls);
  });

  test.each([true, false])(
    'refreshes brush coverage and centers handles after a height change (ranged=%s)',
    isRanged => {
      const {container, props, update} = setup({isRanged});
      const initialSelection = selection(container);
      const handles = Array.from(container.querySelectorAll('.handle--custom'));
      const initialTransforms = handles.map(handle => handle.getAttribute('transform'));
      const handleStartY = (handle: Element) =>
        Number(handle.getAttribute('d')?.match(/^M[^,]+,([^c]+)/)?.[1]);
      const initialHandleY = handles.map(handleStartY);

      update({height: 150});
      expect(element(container, '.overlay')).toHaveAttribute('height', '150');
      expect(element(container, '.selection')).toHaveAttribute('height', '150');
      expect(selection(container)).toEqual(initialSelection);
      expect(handles.map(handle => handle.getAttribute('transform'))).toEqual(initialTransforms);
      handles.forEach((handle, index) => {
        expect(handleStartY(handle) - initialHandleY[index]).toBe(50);
        if (!isRanged) expect(handle).toHaveAttribute('display', 'none');
      });
      expect(props.onBrush).not.toHaveBeenCalled();

      drag(element(container, '.overlay'), 40, 140, 125);
      expect(props.onBrush).toHaveBeenLastCalledWith(...(isRanged ? [20, 70] : [70, 70]));

      update({height: 40});
      expect(element(container, '.overlay')).toHaveAttribute('height', '40');
      expect(element(container, '.selection')).toHaveAttribute('height', '40');
      handles.forEach((handle, index) => {
        expect(handleStartY(handle) - initialHandleY[index]).toBe(-5);
      });
    }
  );

  test('snaps to marks while keeping the exact lower domain boundary', () => {
    const {container, props} = setup({marks: [10, 25, 50, 100]});
    drag(element(container, '.overlay'), 0, 110);
    expect(props.onBrush).toHaveBeenLastCalledWith(0, 50);
  });

  test.each([
    [40, 140, 70],
    [140, 40, 20]
  ])('selects the moving endpoint in single-value mode (%s to %s)', (start, end, value) => {
    const {container, props} = setup({isRanged: false, value: [10, 10]});
    drag(element(container, '.overlay'), start, end);
    expect(props.onBrush).toHaveBeenLastCalledWith(value, value);
    expect(selection(container)).toEqual([value * 2, 1]);
  });

  test('does not emit unchanged ranges and forwards handle hover callbacks', () => {
    const {container, props} = setup();
    drag(element(container, '.overlay'), 40, 120);
    expect(props.onBrush).not.toHaveBeenCalled();
    const handle = element(container, '.handle--custom');
    fireEvent.mouseOver(handle);
    fireEvent.mouseOut(handle);
    expect(props.onMouseoverHandle).toHaveBeenCalledTimes(1);
    expect(props.onMouseoutHandle).toHaveBeenCalledTimes(1);
  });
});
