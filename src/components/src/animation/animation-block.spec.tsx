// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import AnimationBlock, {AnimationBlockProps} from './animation-block';

const originalPointerEvent = window.PointerEvent;
let trackWidth: number;

beforeAll(() => {
  // jsdom does not provide PointerEvent. Keep real DOM pointer dispatch semantics.
  window.PointerEvent = class extends MouseEvent {
    pointerId: number;
    isPrimary: boolean;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.isPrimary = init.isPrimary ?? true;
    }
  } as typeof PointerEvent;
});
afterAll(() => {
  window.PointerEvent = originalPointerEvent;
});
beforeEach(() => {
  trackWidth = 1000;
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    left: 0,
    top: 0,
    right: trackWidth,
    bottom: 40,
    width: trackWidth,
    height: 40,
    x: 0,
    y: 0,
    toJSON: () => ({})
  }));
});
afterEach(() => jest.restoreAllMocks());

function setup(overrides: Partial<AnimationBlockProps> = {}) {
  const props: AnimationBlockProps = {
    label: 'Fog height',
    startTimeMs: 2000,
    endTimeMs: 6000,
    durationMs: 10000,
    onSelect: jest.fn(),
    onChange: jest.fn(),
    onDragStart: jest.fn(),
    ...overrides
  };
  const tree = (next: AnimationBlockProps) => (
    <ThemeProvider theme={theme}>
      <div style={{position: 'relative', width: 1000, height: 40}}>
        <AnimationBlock {...next} />
      </div>
    </ThemeProvider>
  );
  const view = render(tree(props));
  return {
    ...view,
    props,
    body: screen.getByRole('button', {name: props.label}),
    start: screen.getByRole('slider', {name: `Start time for ${props.label}`}),
    end: screen.getByRole('slider', {name: `End time for ${props.label}`}),
    update: (next: Partial<AnimationBlockProps>) => view.rerender(tree({...props, ...next}))
  };
}
function down(element: HTMLElement, clientX: number) {
  fireEvent.pointerDown(element, {pointerId: 1, button: 0, clientX});
}
function move(clientX: number) {
  fireEvent.pointerMove(window, {pointerId: 1, clientX});
}
function up(clientX: number) {
  fireEvent.pointerUp(window, {pointerId: 1, clientX});
}

// jsdom drops unsupported CSS math from computed styles and cannot hit-test.
// Read the authored rules and resolve lengths before checking target overlap.
function authoredStyle(element: HTMLElement, property: string): string {
  let value = getComputedStyle(element).getPropertyValue(property);
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule instanceof CSSStyleRule && element.matches(rule.selectorText)) {
        value = rule.style.getPropertyValue(property) || value;
      }
    }
  }
  return value;
}

function resolveLength(value: string, relativeWidth: number): number {
  const length = value.trim().match(/^(-?[\d.]+)(px|%)$/);
  if (length) return Number(length[1]) * (length[2] === '%' ? relativeWidth / 100 : 1);
  const calculation = value.trim().match(/^calc\((.+) ([+-]) (.+)\)$/);
  if (calculation) {
    return (
      resolveLength(calculation[1], relativeWidth) +
      (calculation[2] === '+' ? 1 : -1) * resolveLength(calculation[3], relativeWidth)
    );
  }
  const bounds = value.trim().match(/^clamp\(([^,]+),([^,]+),([^,]+)\)$/);
  if (bounds) {
    return Math.max(
      resolveLength(bounds[1], relativeWidth),
      Math.min(resolveLength(bounds[2], relativeWidth), resolveLength(bounds[3], relativeWidth))
    );
  }
  throw new Error(`Unsupported CSS length: ${value}`);
}

test('selects on click or keyboard without changing timing', () => {
  const {body, props} = setup();
  down(body, 300);
  up(301);
  fireEvent.click(body);
  fireEvent.keyDown(body, {key: 'Enter'});
  fireEvent.keyDown(body, {key: ' '});
  expect(props.onSelect).toHaveBeenCalledTimes(3);
  expect(props.onChange).not.toHaveBeenCalled();
  expect(props.onDragStart).not.toHaveBeenCalled();
});

test('body drag previews locally, snaps to a step and commits once without selecting', () => {
  const {body, start, end, props} = setup();
  down(body, 300);
  move(400);
  move(454);
  expect(props.onDragStart).toHaveBeenCalledTimes(1);
  expect(props.onChange).not.toHaveBeenCalled();
  expect(start).toHaveAttribute('aria-valuenow', '3500');
  expect(end).toHaveAttribute('aria-valuetext', '7.5 s');
  up(454);
  fireEvent.click(body);
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange).toHaveBeenCalledWith(3500, 7500);
  expect(props.onSelect).not.toHaveBeenCalled();
});

test.each([
  {part: 'start', origin: 200, target: 400, expected: [4000, 6000]},
  {part: 'end', origin: 600, target: 900, expected: [2000, 9000]}
])('resizes the $part edge independently', ({part, origin, target, expected}) => {
  const view = setup();
  down(part === 'start' ? view.start : view.end, origin);
  move(target);
  up(target);
  expect(view.props.onChange).toHaveBeenCalledWith(...expected);
});

test('constrains pointer movement and keyboard resizing to neighboring intervals', () => {
  const {body, start, end, props} = setup({minTimeMs: 1000, maxTimeMs: 7000});
  down(body, 300);
  move(-100);
  up(-100);
  expect(props.onChange).toHaveBeenLastCalledWith(1000, 5000);
  down(body, 300);
  move(900);
  up(900);
  expect(props.onChange).toHaveBeenLastCalledWith(3000, 7000);
  down(start, 200);
  up(0);
  expect(props.onChange).toHaveBeenLastCalledWith(1000, 6000);
  down(end, 600);
  up(900);
  expect(props.onChange).toHaveBeenLastCalledWith(2000, 7000);
  fireEvent.keyDown(start, {key: 'ArrowLeft', shiftKey: true});
  expect(props.onChange).toHaveBeenLastCalledWith(1000, 6000);
  fireEvent.keyDown(end, {key: 'ArrowRight', shiftKey: true});
  expect(props.onChange).toHaveBeenLastCalledWith(2000, 7000);
  expect(start).toHaveAttribute('aria-valuemin', '1000');
  expect(end).toHaveAttribute('aria-valuemax', '7000');
});

test.each([
  {target: 1200, expected: [6000, 10000]},
  {target: -300, expected: [0, 4000]}
])(
  'clamps body movement at the timeline boundary while preserving length',
  ({target, expected}) => {
    const {body, props} = setup();
    down(body, 300);
    move(target);
    up(target);
    expect(props.onChange).toHaveBeenCalledWith(...expected);
  }
);

test('edge resizing respects the minimum interval required by layer fades', () => {
  const view = setup({minimumDurationMs: 1500, kind: 'layer'});
  down(view.start, 200);
  move(800);
  up(800);
  expect(view.props.onChange).toHaveBeenLastCalledWith(4500, 6000);
  down(view.end, 600);
  move(100);
  up(100);
  expect(view.props.onChange).toHaveBeenLastCalledWith(2000, 3500);
});

test.each(['escape', 'pointercancel'])('%s discards local movement without saving', action => {
  const {body, start, end, props} = setup();
  down(body, 300);
  move(500);
  expect(start).toHaveAttribute('aria-valuenow', '4000');
  if (action === 'escape') fireEvent.keyDown(window, {key: 'Escape'});
  else fireEvent.pointerCancel(window, {pointerId: 1});
  expect(start).toHaveAttribute('aria-valuenow', '2000');
  expect(end).toHaveAttribute('aria-valuenow', '6000');
  up(500);
  expect(props.onChange).not.toHaveBeenCalled();
});

test('uses the scale and track width captured at gesture start', () => {
  const {body, end, props, update} = setup();
  down(body, 300);
  trackWidth = 500;
  update({durationMs: 20000});
  move(400);
  expect(end).toHaveAttribute('aria-valuemax', '10000');
  up(400);
  expect(props.onChange).toHaveBeenCalledWith(3000, 7000);
});

test('keyboard arrows move the block or its focused edge with larger Shift steps', () => {
  const {body, start, end, props} = setup();
  fireEvent.keyDown(body, {key: 'ArrowRight'});
  expect(props.onChange).toHaveBeenLastCalledWith(2100, 6100);
  fireEvent.keyDown(start, {key: 'ArrowRight', shiftKey: true});
  expect(props.onChange).toHaveBeenLastCalledWith(3000, 6000);
  fireEvent.keyDown(end, {key: 'ArrowLeft'});
  expect(props.onChange).toHaveBeenLastCalledWith(2000, 5900);
  expect(props.onSelect).not.toHaveBeenCalled();
});

test.each([0, 30, 60, 100, 120, 180, 400])(
  '%d ms intervals keep separate pointer targets for moving, resizing and opening settings',
  lengthMs => {
    const onOpen = jest.fn();
    const {body, start, end, props} = setup({
      startTimeMs: 2000,
      endTimeMs: 2000 + lengthMs,
      onOpen
    });
    expect(start).toHaveAttribute('aria-valuenow', '2000');
    expect(end).toHaveAttribute('aria-valuenow', String(2000 + lengthMs));
    const block = body.parentElement!;
    const width = Math.max(
      resolveLength(authoredStyle(block, 'width'), trackWidth),
      resolveLength(authoredStyle(block, 'min-width'), trackWidth)
    );
    const startLeft = resolveLength(authoredStyle(start, 'left'), width);
    const startRight = startLeft + resolveLength(authoredStyle(start, 'width'), width);
    const endRight = width - resolveLength(authoredStyle(end, 'right'), width);
    const endLeft = endRight - resolveLength(authoredStyle(end, 'width'), width);
    const moveLeft = Math.max(0, startRight);
    const moveRight = Math.min(width, endLeft);
    expect(moveRight).toBeGreaterThan(moveLeft);
    expect(resolveLength(authoredStyle(body, 'padding-inline'), width) * 2).toBeLessThanOrEqual(
      width
    );
    const targetAt = (x: number) => {
      if (x >= endLeft && x < endRight) return end;
      if (x >= startLeft && x < startRight) return start;
      return x >= 0 && x < width ? body : null;
    };
    const moveX = (moveLeft + moveRight) / 2;
    const startX = (startLeft + startRight) / 2;
    const endX = (endLeft + endRight) / 2;
    expect(targetAt(moveX)).toBe(body);
    expect(targetAt(startX)).toBe(start);
    expect(targetAt(endX)).toBe(end);
    down(targetAt(moveX)!, 200 + moveX);
    move(300 + moveX);
    up(300 + moveX);
    expect(props.onChange).toHaveBeenLastCalledWith(3000, 3000 + lengthMs);
    down(targetAt(startX)!, 200 + startX);
    move(100 + startX);
    up(100 + startX);
    expect(props.onChange).toHaveBeenLastCalledWith(1000, 2000 + lengthMs);
    down(targetAt(endX)!, 200 + endX);
    move(300 + endX);
    up(300 + endX);
    expect(props.onChange).toHaveBeenLastCalledWith(2000, 3000 + lengthMs);
    fireEvent.keyDown(end, {key: 'ArrowRight'});
    expect(props.onChange).toHaveBeenLastCalledWith(2000, 2100 + lengthMs);
    down(targetAt(moveX)!, 200 + moveX);
    up(200 + moveX);
    fireEvent.doubleClick(targetAt(moveX)!);
    expect(onOpen).toHaveBeenCalledWith(body);
  }
);

test('disabled blocks remain selectable but do not change timing', () => {
  const {body, start, props} = setup({disabled: true});
  down(body, 300);
  move(600);
  up(600);
  fireEvent.click(body);
  fireEvent.keyDown(start, {key: 'ArrowRight'});
  expect(props.onSelect).toHaveBeenCalledTimes(1);
  expect(props.onChange).not.toHaveBeenCalled();
  expect(props.onDragStart).not.toHaveBeenCalled();
  expect(start).toHaveAttribute('aria-disabled', 'true');
});

test('unmounting during a gesture removes listeners without committing', () => {
  const {body, props, unmount} = setup();
  down(body, 300);
  move(400);
  unmount();
  move(500);
  up(500);
  expect(props.onChange).not.toHaveBeenCalled();
});

test('single click selects and double-click opens settings anchored to the block body', () => {
  const onOpen = jest.fn();
  const {body, start, props} = setup({onOpen});
  fireEvent.click(body);
  expect(props.onSelect).toHaveBeenCalledTimes(1);
  expect(onOpen).not.toHaveBeenCalled();
  fireEvent.doubleClick(body);
  expect(onOpen).toHaveBeenCalledWith(body);
  fireEvent.doubleClick(start);
  expect(onOpen).toHaveBeenLastCalledWith(body);
  expect(props.onChange).not.toHaveBeenCalled();
});

test.each(['commit', 'Escape', 'pointercancel'])(
  'camera settings reopen after a duration resize ends with %s',
  finish => {
    const onOpen = jest.fn();
    const view = setup({label: 'Move to next stop', onOpen});
    view.update({editMode: 'duration'});
    down(view.end, 600);
    move(700);
    if (finish === 'commit') up(700);
    else if (finish === 'Escape') fireEvent.keyDown(window, {key: 'Escape'});
    else fireEvent.pointerCancel(window, {pointerId: 1});

    // Ignore a double-click generated by the resize itself.
    fireEvent.doubleClick(view.body);
    expect(onOpen).not.toHaveBeenCalled();

    // A fresh pointer interaction must allow opening the duration popup again.
    for (let click = 0; click < 2; click++) {
      down(view.body, 300);
      up(300);
      fireEvent.click(view.body);
    }
    fireEvent.doubleClick(view.body);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(view.body);
    expect(view.props.onSelect).toHaveBeenCalledTimes(2);
    expect(view.props.onChange).toHaveBeenCalledTimes(finish === 'commit' ? 1 : 0);
    if (finish === 'commit') expect(view.props.onChange).toHaveBeenCalledWith(2000, 7000);
  }
);

test('the separate remove control requests confirmation without dragging or opening settings', () => {
  const onRequestRemove = jest.fn();
  const onOpen = jest.fn();
  const {body, props} = setup({onRequestRemove, onOpen});
  const remove = screen.getByRole('button', {name: 'Remove Fog height'});
  expect(remove).toHaveAttribute('aria-haspopup', 'dialog');
  expect(body).not.toContainElement(remove);
  expect(authoredStyle(remove.parentElement!, 'bottom')).toBe('100%');
  down(remove, 600);
  up(600);
  fireEvent.click(remove);
  fireEvent.doubleClick(remove);
  expect(onRequestRemove).toHaveBeenCalledTimes(1);
  expect(onRequestRemove).toHaveBeenCalledWith(remove);
  expect(onOpen).not.toHaveBeenCalled();
  expect(props.onSelect).not.toHaveBeenCalled();
  expect(props.onChange).not.toHaveBeenCalled();
  expect(props.onDragStart).not.toHaveBeenCalled();
});

test.each(['pointer', 'keyboard'])('removal requires a fresh %s action after dragging', action => {
  const onRequestRemove = jest.fn();
  const {body} = setup({onRequestRemove});
  const remove = screen.getByRole('button', {name: 'Remove Fog height'});
  down(body, 300);
  move(400);
  expect(remove).toBeDisabled();
  fireEvent.click(remove);
  expect(onRequestRemove).not.toHaveBeenCalled();
  up(400);
  expect(remove).toBeEnabled();
  fireEvent.click(remove);
  expect(onRequestRemove).not.toHaveBeenCalled();
  if (action === 'pointer') {
    down(remove, 700);
    up(700);
  } else {
    remove.focus();
    fireEvent.keyDown(remove, {key: 'Enter'});
  }
  fireEvent.click(remove);
  expect(onRequestRemove).toHaveBeenCalledTimes(1);
});

test('only removable, enabled blocks can request removal', () => {
  const {update} = setup();
  expect(screen.queryByRole('button', {name: 'Remove Fog height'})).toBeNull();
  const onRequestRemove = jest.fn();
  update({onRequestRemove, disabled: true});
  const remove = screen.getByRole('button', {name: 'Remove Fog height'});
  expect(remove).toBeDisabled();
  fireEvent.click(remove);
  expect(onRequestRemove).not.toHaveBeenCalled();
});

test('Enter and Space open settings using the body anchor when available', () => {
  const onOpen = jest.fn();
  const {body, end, props} = setup({onOpen});
  fireEvent.keyDown(body, {key: 'Enter'});
  fireEvent.keyDown(end, {key: ' '});
  expect(onOpen).toHaveBeenCalledTimes(2);
  expect(onOpen).toHaveBeenNthCalledWith(1, body);
  expect(onOpen).toHaveBeenNthCalledWith(2, body);
  expect(props.onSelect).not.toHaveBeenCalled();
  expect(props.onChange).not.toHaveBeenCalled();
});

test('post-drag click suppression also suppresses a following double-click', () => {
  const onOpen = jest.fn();
  const {body, props} = setup({onOpen});
  down(body, 300);
  move(400);
  up(400);
  fireEvent.click(body);
  fireEvent.doubleClick(body);
  expect(props.onSelect).not.toHaveBeenCalled();
  expect(onOpen).not.toHaveBeenCalled();
  down(body, 300);
  up(300);
  fireEvent.click(body);
  fireEvent.doubleClick(body);
  expect(props.onSelect).toHaveBeenCalledTimes(1);
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onOpen).toHaveBeenCalledWith(body);
});

test('cancelled and active drags do not open settings', () => {
  const onOpen = jest.fn();
  const {body} = setup({onOpen});
  down(body, 300);
  move(400);
  fireEvent.keyDown(body, {key: 'Enter'});
  fireEvent.doubleClick(body);
  expect(onOpen).not.toHaveBeenCalled();
  fireEvent.pointerCancel(window, {pointerId: 1});
  fireEvent.click(body);
  fireEvent.doubleClick(body);
  expect(onOpen).not.toHaveBeenCalled();
});
