// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {renderHook, act} from '@testing-library/react';
import {useDispatch} from 'react-redux';
import {useDndLayers} from '@kepler.gl/components';
import {reorderLayer, toggleLayerForMap} from '@kepler.gl/actions';
import {
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_LAYER_GROUP_DROPPABLE_TYPE
} from '@kepler.gl/components/common/dnd-layer-items';
import {reorderLayerOrder} from '@kepler.gl/reducers';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

jest.mock('@kepler.gl/actions', () => ({
  ...jest.requireActual('@kepler.gl/actions'),
  layerConfigChange: jest.fn(),
  reorderLayer: jest.fn(),
  toggleLayerForMap: jest.fn()
}));

jest.mock('@kepler.gl/reducers', () => ({
  ...jest.requireActual('@kepler.gl/reducers'),
  reorderLayerOrder: jest.fn()
}));

describe('useDndLayers', () => {
  const layers = [
    {id: '1', name: 'Layer 1', config: {isConfigActive: false}},
    {id: '2', name: 'Layer 2', config: {isConfigActive: false}},
    {id: '3', name: 'Layer 3', config: {isConfigActive: false}}
  ];

  const layerOrder = ['2', '1', '3'];

  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    useDispatch.mockReset();
    dispatchMock.mockReset();
    reorderLayer.mockReset();
    toggleLayerForMap.mockReset();
    reorderLayerOrder.mockReset();
  });

  test('should initialize with correct initial state', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    expect(result.current.activeElement).toBeUndefined();
    expect(result.current.onDragStart).toBeInstanceOf(Function);
    expect(result.current.onDragEnd).toBeInstanceOf(Function);
  });

  test('onDragStart should update activeElement for layer type', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: '2', data: {current: {type: SORTABLE_LAYER_TYPE}}}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeElement).toEqual(['layer', layers[1]]);
  });

  test('onDragStart should not set activeElement if type is not provided', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: '1', data: {current: {}}}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeElement).toBeUndefined();
  });

  test('onDragEnd should reset activeElement if overId is null and no parent', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: '2', data: {current: {type: SORTABLE_LAYER_TYPE}}},
      over: null
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(result.current.activeElement).toBeUndefined();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  test('onDragEnd should dispatch toggleLayerForMap when overType is DROPPABLE_MAP_CONTAINER_TYPE', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: '1', data: {current: {type: SORTABLE_LAYER_TYPE}}},
      over: {
        id: 'map-0',
        data: {
          current: {
            type: DROPPABLE_MAP_CONTAINER_TYPE,
            index: 1
          }
        }
      }
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(toggleLayerForMap).toHaveBeenCalledWith(1, '1');
  });

  test('onDragEnd should dispatch reorderLayer when dropping layer at same level', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: '2', data: {current: {type: SORTABLE_LAYER_TYPE, parent: undefined}}},
      over: {
        id: '1',
        data: {
          current: {
            type: SORTABLE_LAYER_TYPE,
            parent: undefined
          }
        }
      }
    };

    const newLayerOrder = ['1', '2', '3'];
    reorderLayerOrder.mockReturnValue(newLayerOrder);

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderLayer).toHaveBeenCalledWith(newLayerOrder);
  });

  test('onDragEnd should reorder within same group even with different parent object instances', () => {
    const layerGroup = {id: 'group1', label: 'Group 1', isVisible: true, layerOrder: ['2', '3']};
    const layerOrderWithGroup = ['1', layerGroup];

    const {result} = renderHook(() => useDndLayers(layers, layerOrderWithGroup));

    const newGroupOrder = ['3', '2'];
    reorderLayerOrder.mockReturnValue(newGroupOrder);

    const event = {
      active: {id: '2', data: {current: {type: SORTABLE_LAYER_TYPE, parent: {id: 'group1', label: 'Group 1', isVisible: true, layerOrder: ['2', '3']}}}},
      over: {
        id: '3',
        data: {
          current: {
            type: SORTABLE_LAYER_TYPE,
            parent: {id: 'group1', label: 'Group 1', isVisible: true, layerOrder: ['2', '3']}
          }
        }
      }
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderLayer).toHaveBeenCalled();
    expect(reorderLayerOrder).toHaveBeenCalledWith(layerGroup.layerOrder, '2', '3');
  });

  test('onDragEnd should dispatch reorderLayer when moving layer into a group', () => {
    const layerGroup = {id: 'group1', label: 'Group 1', isVisible: true, layerOrder: ['3']};
    const layerOrderWithGroup = ['2', '1', layerGroup];

    const {result} = renderHook(() => useDndLayers(layers, layerOrderWithGroup));

    const event = {
      active: {id: '2', data: {current: {type: SORTABLE_LAYER_TYPE, parent: undefined}}},
      over: {
        id: 'group1',
        data: {
          current: {
            type: SORTABLE_LAYER_GROUP_DROPPABLE_TYPE
          }
        }
      }
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderLayer).toHaveBeenCalled();
  });

  test('onDragEnd should not dispatch if overType is unknown and parents differ without group droppable', () => {
    const layerGroup1 = {id: 'group1', label: 'Group 1', isVisible: true, layerOrder: ['2']};
    const layerGroup2 = {id: 'group2', label: 'Group 2', isVisible: true, layerOrder: ['3']};
    const layerOrderWithGroups = ['1', layerGroup1, layerGroup2];

    const {result} = renderHook(() => useDndLayers(layers, layerOrderWithGroups));

    const event = {
      active: {id: '1', data: {current: {type: SORTABLE_LAYER_TYPE, parent: undefined}}},
      over: {
        id: 'unknown',
        data: {
          current: {
            type: 'UNKNOWN_TYPE',
            parent: layerGroup2
          }
        }
      }
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(toggleLayerForMap).not.toHaveBeenCalled();
  });
});
