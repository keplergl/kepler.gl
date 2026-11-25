// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {snapToFloatingWidgets} from './floating-widget-snapping';

function rect(left: number, top: number, width = 100, height = 100): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  };
}

function widget(parent: Element, bounds: DOMRect) {
  const element = document.createElement('div');
  element.className = 'draggable-legend';
  element.getBoundingClientRect = () => bounds;
  parent.appendChild(element);
  return element;
}

const movingRect = rect(200, 200);
const transform = {x: 25, y: 25, scaleX: 1, scaleY: 1};
let root: HTMLElement;
let moving: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = '<div class="kepler-gl"></div>';
  root = document.querySelector('.kepler-gl')!;
  // Nonzero offsets model an embedded map, not the browser viewport.
  root.getBoundingClientRect = () => rect(100, 100, 800, 600);
  moving = widget(root, movingRect);
});

test.each([
  ['left edges', rect(230, 340), 30, 32],
  ['right edges', rect(170, 340, 150), 20, 32],
  ['left adjacency', rect(110, 230), 18, 30],
  ['right adjacency', rect(330, 230), 22, 30],
  ['top edges', rect(340, 230), 32, 30],
  ['bottom edges', rect(340, 170, 100, 150), 32, 20],
  ['top adjacency', rect(230, 110), 30, 18],
  ['bottom adjacency', rect(230, 330), 30, 22]
])('snaps %s with an adjacent gap', (_label, neighborRect, x, y) => {
  widget(root, neighborRect);
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0)).toEqual({...transform, x, y});
});

test('chooses the nearest edge regardless of target order', () => {
  widget(root, rect(232, 340));
  widget(root, rect(228, 340));
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0).x).toBe(28);
});

test.each([
  [
    'empty',
    () => {
      // Leave the moving widget without any neighbors.
    }
  ],
  ['distant', () => widget(root, rect(230, 500))],
  ['outside tolerance', () => widget(root, rect(250, 350))],
  [
    'hidden',
    () => {
      widget(root, rect(230, 340)).style.visibility = 'hidden';
    }
  ],
  ['zero size', () => widget(root, rect(230, 340, 0, 0))],
  [
    'other instance',
    () => {
      const other = document.createElement('div');
      other.className = 'kepler-gl';
      document.body.appendChild(other);
      widget(other, rect(230, 340));
    }
  ],
  [
    'nested instance',
    () => {
      const nested = document.createElement('div');
      nested.className = 'kepler-gl';
      root.appendChild(nested);
      widget(nested, rect(230, 340));
    }
  ],
  ['missing root', () => moving.remove()]
])('ignores %s targets', (_label, setup) => {
  setup();
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0)).toEqual(transform);
});

test('does not snap across the side panel or map margins', () => {
  widget(root, rect(218, 340));
  // The proposed left alignment would cross the sidebar's right edge (220).
  expect(snapToFloatingWidgets(moving, movingRect, transform, 110).x).toBe(25);
  root.getBoundingClientRect = () => rect(100, 100, 800, 250);
  // The proposed adjacency would cross the bottom margin (320).
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0).y).toBe(25);
});

test('uses current target geometry and ignores removed widgets', () => {
  const target = widget(root, rect(230, 340));
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0).x).toBe(30);
  target.getBoundingClientRect = () => rect(250, 350);
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0)).toEqual(transform);
  target.remove();
  expect(snapToFloatingWidgets(moving, movingRect, transform, 0)).toEqual(transform);
});
