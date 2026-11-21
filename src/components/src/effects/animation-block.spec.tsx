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

test('instantaneous cuts keep separate pointer targets for moving and resizing', () => {
  const {body, start, end, props} = setup({startTimeMs: 2000, endTimeMs: 2000});
  expect(start).toHaveAttribute('aria-valuenow', '2000');
  expect(end).toHaveAttribute('aria-valuenow', '2000');
  // jsdom cannot hit-test: require each resize target to end outside the body.
  // The relationship matters here, rather than any particular handle width.
  for (const [handle, side] of [
    [start, 'left'],
    [end, 'right']
  ] as const) {
    const style = getComputedStyle(handle);
    expect(parseFloat(style[side]) + parseFloat(style.width)).toBeLessThanOrEqual(0);
  }
  down(body, 200);
  move(300);
  up(300);
  expect(props.onChange).toHaveBeenLastCalledWith(3000, 3000);
  down(start, 200);
  move(100);
  up(100);
  expect(props.onChange).toHaveBeenLastCalledWith(1000, 2000);
  down(end, 200);
  move(300);
  up(300);
  expect(props.onChange).toHaveBeenLastCalledWith(2000, 3000);
  fireEvent.keyDown(end, {key: 'ArrowRight'});
  expect(props.onChange).toHaveBeenLastCalledWith(2000, 2100);
});

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
