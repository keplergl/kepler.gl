// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, render, renderHook, screen} from '@testing-library/react';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {Layer} from '@kepler.gl/layers';
import {Effect, LayerOrder} from '@kepler.gl/types';
import {VisState} from '@kepler.gl/schemas';
import {
  layerConfigChange,
  reorderEffect,
  reorderLayer,
  toggleLayerForMap,
  updateEffect
} from '@kepler.gl/actions';
import {
  DND_EMPTY_MODIFIERS,
  DND_MODIFIERS,
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_EFFECT_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE
} from '@kepler.gl/components';
import {useStoreWithKepler} from '../KeplerSlice';
import useDndLayers from '../hooks/useDndLayers';
import useDndEffects from '../hooks/useDndEffects';
import {CustomDndContextFactory} from './CustomDndContext';

jest.mock('../KeplerSlice', () => ({useStoreWithKepler: jest.fn()}));

// The DnD sensor is a boundary: exercise its callbacks with the real SQLRooms hooks.
let mockDndProps: any;
let mockOverlayProps: any;
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: props => {
    mockDndProps = props;
    return props.children;
  },
  DragOverlay: props => {
    mockOverlayProps = props;
    return props.children;
  }
}));

const dispatch = jest.fn();
const layer = (id: string, open = false) =>
  ({id, type: 'point', config: {label: id, dataId: 'data', isConfigActive: open}} as Layer);
const effect = (id: string, open = false) => ({id, isConfigActive: open} as Effect);
const layers = [layer('a', true), layer('b'), layer('c')];
const effects = [effect('e1', true), effect('e2'), effect('e3')];
const start = (id: string, type = SORTABLE_LAYER_TYPE): DragStartEvent => ({
  active: {id, data: {current: {type}}, rect: {current: {initial: null, translated: null}}},
  activatorEvent: new Event('pointerdown')
});
const end = (id: string, overId: string, type?: string, index?: number): DragEndEvent => ({
  ...start(id),
  over: {
    id: overId,
    data: {current: {type, index}},
    disabled: false,
    rect: {top: 0, left: 0, right: 100, bottom: 100, width: 100, height: 100}
  },
  collisions: null,
  delta: {x: 0, y: 0}
});

beforeEach(() => {
  dispatch.mockReset();
  mockOverlayProps = undefined;
  jest
    .mocked(useStoreWithKepler)
    .mockImplementation(selector => selector({kepler: {dispatchAction: dispatch, map: {}}} as any));
});

describe('SQLRooms layer drag and drop', () => {
  test('closes configuration and reorders only the specified map without mutating order', () => {
    const order = ['a', 'b', 'c'];
    const {result} = renderHook(() => useDndLayers('map-two', layers, order));
    act(() => result.current.onDragStart(start('a')));
    expect(result.current.activeLayer).toBe(layers[0]);
    expect(dispatch).toHaveBeenLastCalledWith(
      'map-two',
      layerConfigChange(layers[0], {isConfigActive: false})
    );
    act(() => result.current.onDragEnd(end('a', 'c', SORTABLE_LAYER_TYPE)));
    expect(dispatch).toHaveBeenLastCalledWith('map-two', reorderLayer(['b', 'c', 'a']));
    expect(order).toEqual(['a', 'b', 'c']);
    expect(result.current.activeLayer).toBeUndefined();
  });

  test.each([undefined, 1])('drops onto split-map index %s (missing index uses zero)', index => {
    const {result} = renderHook(() => useDndLayers('map', layers, ['a', 'b', 'c']));
    act(() => result.current.onDragStart(start('b')));
    expect(dispatch).not.toHaveBeenCalled();
    act(() => result.current.onDragEnd(end('b', 'viewport', DROPPABLE_MAP_CONTAINER_TYPE, index)));
    expect(dispatch).toHaveBeenCalledWith('map', toggleLayerForMap(index ?? 0, 'b'));
    expect(result.current.activeLayer).toBeUndefined();
  });

  test('moves to the panel end using grouped order and handles an empty order', () => {
    const order: LayerOrder = [
      'a',
      {
        id: 'group',
        label: 'Group',
        isVisible: true,
        isIncludedInLegend: true,
        layerOrder: ['b', 'c']
      }
    ];
    const {result, rerender} = renderHook(({order}) => useDndLayers('map', layers, order), {
      initialProps: {order}
    });
    act(() => result.current.onDragEnd(end('a', 'panel', SORTABLE_SIDE_PANEL_TYPE)));
    expect(dispatch).toHaveBeenLastCalledWith('map', reorderLayer([order[1], 'a']));
    dispatch.mockClear();
    rerender({order: []});
    act(() => result.current.onDragEnd(end('a', 'panel', SORTABLE_SIDE_PANEL_TYPE)));
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('ignores unknown layers and unscoped maps, clears a cancelled drag, and uses new map props', () => {
    const {result, rerender} = renderHook(
      ({mapId}) => useDndLayers(mapId, layers, ['a', 'b', 'c']),
      {initialProps: {mapId: undefined as string | undefined}}
    );
    act(() => result.current.onDragStart(start('a')));
    act(() => result.current.onDragEnd(end('a', 'b', SORTABLE_LAYER_TYPE)));
    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.activeLayer).toBeUndefined();
    rerender({mapId: 'new-map'});
    act(() => result.current.onDragStart(start('unknown')));
    expect(result.current.activeLayer).toBeUndefined();
    act(() => result.current.onDragStart(start('b')));
    act(() => result.current.onDragEnd({...end('b', ''), over: null}));
    expect(result.current.activeLayer).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
    act(() => result.current.onDragEnd(end('b', 'c', SORTABLE_LAYER_TYPE)));
    expect(dispatch).toHaveBeenCalledWith('new-map', reorderLayer(['a', 'c', 'b']));
  });
});

describe('SQLRooms effect drag and drop', () => {
  test('closes effect configuration and moves effects within the correct map', () => {
    const order = ['e1', 'e2', 'e3'];
    const {result} = renderHook(() => useDndEffects('effect-map', effects, order));
    act(() => result.current.onDragStart(start('e1', SORTABLE_EFFECT_TYPE)));
    expect(result.current.activeEffect).toBe(effects[0]);
    expect(dispatch).toHaveBeenLastCalledWith(
      'effect-map',
      updateEffect('e1', {isConfigActive: false})
    );
    act(() => result.current.onDragEnd(end('e1', 'e2', SORTABLE_EFFECT_TYPE)));
    expect(dispatch).toHaveBeenLastCalledWith('effect-map', reorderEffect(['e2', 'e1', 'e3']));
    expect(result.current.activeEffect).toBeUndefined();
    expect(order).toEqual(['e1', 'e2', 'e3']);
    act(() => result.current.onDragEnd(end('e1', 'panel', 'root')));
    expect(dispatch).toHaveBeenLastCalledWith('effect-map', reorderEffect(['e2', 'e3', 'e1']));
  });

  test('ignores unscoped drags and unknown effects and clears rejected drops', () => {
    const {result, rerender} = renderHook(
      ({mapId}) => useDndEffects(mapId, effects, ['e1', 'e2', 'e3']),
      {initialProps: {mapId: undefined as string | undefined}}
    );
    act(() => result.current.onDragStart(start('e1')));
    act(() => result.current.onDragEnd(end('e1', 'e2', SORTABLE_EFFECT_TYPE)));
    expect(dispatch).not.toHaveBeenCalled();
    rerender({mapId: 'map'});
    act(() => result.current.onDragStart(start('missing')));
    expect(result.current.activeEffect).toBeUndefined();
    act(() => result.current.onDragStart(start('e2')));
    act(() => result.current.onDragEnd({...end('e2', ''), over: null}));
    expect(result.current.activeEffect).toBeUndefined();
    act(() => result.current.onDragStart(start('e2')));
    act(() => result.current.onDragEnd(end('e2', 'map', DROPPABLE_MAP_CONTAINER_TYPE)));
    expect(result.current.activeEffect).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

const Header = props => (
  <div data-testid="dragged-layer" data-color={JSON.stringify(props.labelRCGColorValues)}>
    {props.label}
  </div>
);
const Context = CustomDndContextFactory(Header);
const visState = (split = false) =>
  ({
    layers,
    layerOrder: ['a', 'b', 'c'],
    effects,
    effectOrder: ['e1', 'e2', 'e3'],
    datasets: {data: {color: [1, 2, 3]}},
    splitMaps: split ? [{}, {}] : []
  } as unknown as VisState);

describe('SQLRooms DnD context integration', () => {
  test('routes layer and effect events to the map owning this visState and displays the dragged layer', () => {
    const state = visState();
    jest.mocked(useStoreWithKepler).mockImplementation(selector =>
      selector({
        kepler: {
          dispatchAction: dispatch,
          map: {first: {visState: visState()}, second: {visState: state}}
        }
      } as any)
    );
    render(
      <Context visState={state}>
        <div>panel content</div>
      </Context>
    );
    expect(screen.getByText('panel content')).toBeTruthy();
    expect(mockDndProps.modifiers).toBe(DND_MODIFIERS);
    act(() => mockDndProps.onDragStart(start('b')));
    expect(screen.getByTestId('dragged-layer').textContent).toBe('b');
    expect(screen.getByTestId('dragged-layer').getAttribute('data-color')).toBe('[1,2,3]');
    expect(mockOverlayProps.modifiers).toBe(DND_MODIFIERS);
    act(() =>
      mockDndProps.onDragEnd({...end('b', 'c', SORTABLE_LAYER_TYPE), active: start('b').active})
    );
    expect(dispatch).toHaveBeenLastCalledWith('second', reorderLayer(['a', 'c', 'b']));
    expect(screen.queryByTestId('dragged-layer')).toBeNull();
    act(() => mockDndProps.onDragStart(start('e1', SORTABLE_EFFECT_TYPE)));
    expect(dispatch).toHaveBeenLastCalledWith(
      'second',
      updateEffect('e1', {isConfigActive: false})
    );
    act(() =>
      mockDndProps.onDragEnd({
        ...end('e1', 'e3', SORTABLE_EFFECT_TYPE),
        active: start('e1', SORTABLE_EFFECT_TYPE).active
      })
    );
    expect(dispatch).toHaveBeenLastCalledWith('second', reorderEffect(['e2', 'e3', 'e1']));
  });

  test('releases split-map drag constraints and safely ignores unmatched map state', () => {
    const state = visState(true);
    const {rerender} = render(<Context visState={state} />);
    expect(mockDndProps.modifiers).toBe(DND_EMPTY_MODIFIERS);
    act(() => mockDndProps.onDragStart(start('a')));
    expect(dispatch).not.toHaveBeenCalled();
    expect(screen.queryByTestId('dragged-layer')).toBeNull();
    rerender(<Context />);
    expect(mockDndProps.modifiers).toBe(DND_MODIFIERS);
    act(() =>
      mockDndProps.onDragEnd({...end('a', 'b', SORTABLE_LAYER_TYPE), active: start('a').active})
    );
    expect(dispatch).not.toHaveBeenCalled();
  });
});
