// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {snapToFloatingWidgets, snapFloatingWidgetResize} from './floating-widget-snapping';

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

test.each([300, 350])('snaps beside the rendered %ipx side panel in an embedded map', width => {
  const sidebar = document.createElement('div');
  sidebar.className = 'side-panel--container';
  root.appendChild(sidebar);
  const inner = widget(sidebar, rect(112, 112, width, 576));
  inner.className = 'side-bar__inner';
  const dragRect = rect(width + 120, 200);
  const drag = {...transform, x: -3};
  expect(snapToFloatingWidgets(moving, dragRect, drag, 300)).toEqual({...drag, x: 0});
  inner.remove(); // Closing the sidebar removes its inner content, leaving the container.
  expect(snapToFloatingWidgets(moving, dragRect, drag, 300)).toEqual(drag);
});

test('respects map margins when the sidebar has no outer padding', () => {
  const sidebar = document.createElement('div');
  sidebar.className = 'side-panel--container';
  root.appendChild(sidebar);
  widget(sidebar, rect(100, 100, 300, 600)).className = 'side-bar__inner';
  const drag = {...transform, x: 0};
  expect(snapToFloatingWidgets(moving, rect(414, 200), drag, 300).x).toBe(-4);
});

test('snaps beside visible right-side buttons, ignoring toolbar padding and menus', () => {
  const toolbar = widget(root, rect(700, 112, 188, 400));
  toolbar.className = 'map-control';
  const button = widget(toolbar, rect(850, 230, 32, 32));
  button.className = 'map-control-button map-navigation-control__zoom-in';
  const dragRect = rect(720, 200);
  expect(snapToFloatingWidgets(moving, dragRect, transform, 0)).toEqual({
    ...transform,
    x: 22,
    y: 30
  });
  button.style.visibility = 'hidden';
  expect(snapToFloatingWidgets(moving, dragRect, transform, 0)).toEqual(transform);
});

test('does not align a widget over a right-side button', () => {
  const toolbar = document.createElement('div');
  toolbar.className = 'map-control';
  root.appendChild(toolbar);
  widget(toolbar, rect(850, 230, 32, 32)).className = 'map-control-button';
  // The right edges almost align, but this would cover the button.
  expect(snapToFloatingWidgets(moving, rect(752, 200), transform, 0).x).toBe(25);
});

test.each(['hidden', 'nested', 'other map', 'distant'])('ignores %s fixed UI', kind => {
  let parent = root;
  if (kind === 'nested' || kind === 'other map') {
    parent = document.createElement('div');
    parent.className = 'kepler-gl';
    (kind === 'nested' ? root : document.body).appendChild(parent);
  }
  const sidebar = document.createElement('div');
  sidebar.className = 'side-panel--container';
  parent.appendChild(sidebar);
  const inner = widget(sidebar, rect(112, kind === 'distant' ? 500 : 112, 300, 100));
  inner.className = 'side-bar__inner';
  if (kind === 'hidden') inner.style.visibility = 'hidden';
  const drag = {...transform, x: -3};
  expect(snapToFloatingWidgets(moving, rect(420, 200), drag, 300)).toEqual(drag);
});

test.each([
  ['top', rect(308, 234), 230, 234],
  ['bottom', rect(308, 304), 400, 404]
])('snaps a resized edge to a neighboring %s level', (_edge, target, proposed, expected) => {
  widget(root, target);
  expect(snapFloatingWidgetResize(moving, movingRect, proposed, 110, 670)).toBe(expected);
});

test('resize snapping picks the nearest level and releases beyond the tolerance', () => {
  widget(root, rect(308, 306));
  widget(root, rect(308, 304));
  expect(snapFloatingWidgetResize(moving, movingRect, 400, 110, 670)).toBe(404);
  expect(snapFloatingWidgetResize(moving, movingRect, 420, 110, 670)).toBe(420);
});

test('resize snapping ignores out-of-limit, distant, hidden, and removed targets', () => {
  const target = widget(root, rect(308, 304));
  expect(snapFloatingWidgetResize(moving, movingRect, 400, 110, 402)).toBe(400);
  expect(snapFloatingWidgetResize(moving, movingRect, 308, 306, 670)).toBe(308);
  target.getBoundingClientRect = () => rect(500, 304);
  expect(snapFloatingWidgetResize(moving, movingRect, 400, 110, 670)).toBe(400);
  target.getBoundingClientRect = () => rect(308, 304);
  target.style.visibility = 'hidden';
  expect(snapFloatingWidgetResize(moving, movingRect, 400, 110, 670)).toBe(400);
  target.remove();
  expect(snapFloatingWidgetResize(moving, movingRect, 400, 110, 670)).toBe(400);
});
