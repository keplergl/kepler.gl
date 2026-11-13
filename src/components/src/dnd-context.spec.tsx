// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render} from '@testing-library/react';
import {DndContext as DndKitContext, DragOverlay} from '@dnd-kit/core';
import DndContextFactory from './dnd-context';
import useDndLayers from './hooks/use-dnd-layers';
import useDndEffects from './hooks/use-dnd-effects';
import {DND_MODIFIERS, DND_EMPTY_MODIFIERS} from './common/dnd-layer-items';

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: jest.fn(({children}) => children),
  DragOverlay: jest.fn(({children}) => children)
}));
jest.mock('./hooks/use-dnd-layers', () => ({__esModule: true, default: jest.fn()}));
jest.mock('./hooks/use-dnd-effects', () => ({__esModule: true, default: jest.fn()}));
jest.mock('./side-panel/layer-panel/layer-panel-header', () => () => null);
jest.mock('./side-panel/layer-panel/layer-group-header', () => () => null);

const layerStart = jest.fn();
const layerEnd = jest.fn();
const effectStart = jest.fn();
const effectEnd = jest.fn();
const LayerHeader = jest.fn(() => null);
const GroupHeader = jest.fn(() => null);
const Context = DndContextFactory(LayerHeader, GroupHeader);
const state = {
  datasets: {},
  layers: [],
  layerOrder: [],
  effects: [],
  effectOrder: [],
  splitMaps: []
} as unknown as React.ComponentProps<typeof Context>['visState'];
const kitProps = () => jest.mocked(DndKitContext).mock.calls.at(-1)![0];
const event = (type?: string) => ({active: {data: {current: {type}}}});

// Use the real dnd-kit collision algorithms with overlapping drop targets.
const rect = {top: 0, left: 0, right: 100, bottom: 100, width: 100, height: 100};
const target = (id: string, type?: string, parent?: string) => ({
  id,
  key: id,
  disabled: false,
  node: {current: null},
  rect: {current: rect},
  data: {current: {type, parent}}
});
const collide = (type: string, targets: ReturnType<typeof target>[], pointer = true) => {
  const collisionDetection = kitProps().collisionDetection!;
  return collisionDetection({
    active: {
      id: 'active',
      data: {current: {type}},
      rect: {current: {initial: rect, translated: rect}}
    },
    collisionRect: rect,
    droppableRects: new Map(targets.map(t => [t.id, rect])),
    droppableContainers: targets,
    pointerCoordinates: pointer ? {x: 50, y: 50} : null
  }).map(c => c.id);
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useDndLayers).mockReturnValue({
    activeElement: null,
    onDragStart: layerStart,
    onDragEnd: layerEnd
  } as unknown as ReturnType<typeof useDndLayers>);
  jest.mocked(useDndEffects).mockReturnValue({
    activeEffect: undefined,
    onDragStart: effectStart,
    onDragEnd: effectEnd
  });
});

describe('core drag-and-drop context', () => {
  test.each(['layer', 'layerGroup', 'effect'])(
    'routes %s start and drop to the matching hooks',
    type => {
      render(
        <Context visState={state}>
          <span>Map content</span>
        </Context>
      );
      const dragEvent = event(type);
      kitProps().onDragStart!(dragEvent as never);
      kitProps().onDragEnd!(dragEvent as never);
      const isEffect = type === 'effect';
      expect(isEffect ? effectStart : layerStart).toHaveBeenCalledWith(dragEvent);
      expect(isEffect ? effectEnd : layerEnd).toHaveBeenCalledWith(dragEvent);
      expect(isEffect ? layerStart : effectStart).not.toHaveBeenCalled();
      expect(isEffect ? layerEnd : effectEnd).not.toHaveBeenCalled();
    }
  );

  test.each([undefined, 'unknown'])('ignores unsupported drag type %s', type => {
    render(<Context visState={state} />);
    kitProps().onDragStart!(event(type) as never);
    kitProps().onDragEnd!(event(type) as never);
    [layerStart, layerEnd, effectStart, effectEnd].forEach(fn => expect(fn).not.toHaveBeenCalled());
  });

  test('unlocks both drag and overlay movement in split view and restores vertical movement', () => {
    const {rerender} = render(<Context visState={state} />);
    const checkModifiers = expected => {
      expect(kitProps().modifiers).toBe(expected);
      expect(jest.mocked(DragOverlay).mock.calls.at(-1)![0].modifiers).toBe(expected);
    };
    checkModifiers(DND_MODIFIERS);
    rerender(<Context visState={{...state, splitMaps: [{layers: {}}, {layers: {}}]}} />);
    checkModifiers(DND_EMPTY_MODIFIERS);
    rerender(<Context visState={state} />);
    checkModifiers(DND_MODIFIERS);
  });

  test('group dragging only collides with root layers, groups and the end placeholder', () => {
    render(<Context visState={state} />);
    expect(
      collide('layerGroup', [
        target('nested', 'layer', 'group'),
        target('root', 'layer'),
        target('group', 'layerGroup'),
        target('end', 'layer-end-placeholder'),
        target('container', 'droppable-layer-group'),
        target('effect', 'effect'),
        target('missing')
      ])
    ).toEqual(['root', 'group', 'end']);
  });

  test('prefers a pointed empty group over its end placeholder', () => {
    render(<Context visState={state} />);
    expect(
      collide('layer', [
        target('end', 'layer-end-placeholder'),
        target('empty', 'droppable-layer-group')
      ])
    ).toEqual(['empty']);
  });

  test('keeps ordinary sortable collisions when the pointer also intersects a group', () => {
    render(<Context visState={state} />);
    expect(
      collide('layer', [target('layer', 'layer'), target('group', 'droppable-layer-group')])
    ).toEqual(['layer', 'group']);
  });

  test('without a pointer uses center collisions, including keyboard drags', () => {
    render(<Context visState={state} />);
    expect(
      collide(
        'layer',
        [target('end', 'layer-end-placeholder'), target('group', 'droppable-layer-group')],
        false
      )
    ).toEqual(['end', 'group']);
    expect(collide('layer', [])).toEqual([]);
  });

  test.each([
    ['data', [10, 20, 30]],
    ['missing', null],
    [undefined, null]
  ])('layer preview uses dataset color for %s and disables editing', (dataId, color) => {
    const layer = {id: 'points', type: 'point', config: {label: 'Points', dataId}};
    jest.mocked(useDndLayers).mockReturnValue({
      activeElement: ['layer', layer],
      onDragStart: layerStart,
      onDragEnd: layerEnd
    } as never);
    render(<Context visState={{...state, datasets: {data: {color: [10, 20, 30]}} as never}} />);
    expect(LayerHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        layerId: 'points',
        label: 'Points',
        layerType: 'point',
        labelRCGColorValues: color,
        allowDuplicate: false,
        isDragNDropEnabled: false,
        isConfigActive: false
      }),
      undefined
    );
    expect(GroupHeader).not.toHaveBeenCalled();
  });

  test('group preview renders the active group, not a layer preview', () => {
    const group = {id: 'group', label: 'Group', children: []};
    jest.mocked(useDndLayers).mockReturnValue({
      activeElement: ['layerGroup', group],
      onDragStart: layerStart,
      onDragEnd: layerEnd
    } as never);
    render(<Context visState={state} />);
    expect(GroupHeader).toHaveBeenCalledWith(
      expect.objectContaining({layerGroup: group}),
      undefined
    );
    expect(LayerHeader).not.toHaveBeenCalled();
  });
});
