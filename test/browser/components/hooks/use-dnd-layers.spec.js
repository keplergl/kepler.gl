// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {renderHook, act} from '@testing-library/react';
import {useDispatch} from 'react-redux';
import {useDndLayers} from '@kepler.gl/components';
import {layerConfigChange, reorderLayer, toggleLayerForMap} from '@kepler.gl/actions';
import {
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE
} from '@kepler.gl/constants';
import {reorderLayerOrder} from '@kepler.gl/reducers';

// Mock useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

// Mock dependencies
jest.mock('@kepler.gl/actions', () => ({
  ...jest.requireActual('@kepler.gl/actions'),
  layerConfigChange: jest.fn(),
  reorderLayer: jest.fn(),
  toggleLayerForMap: jest.fn()
}));

jest.mock('@kepler.gl/reducers', () => ({
  reorderLayerOrder: jest.fn()
}));

describe('useDndLayers', () => {
  const layers = [
    {id: 1, name: 'Layer 1', config: {isConfigActive: false}},
    {id: 2, name: 'Layer 2', config: {isConfigActive: false}},
    {id: 3, name: 'Layer 3', config: {isConfigActive: false}}
  ];

  const layerOrder = [2, 1, 3];

  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    useDispatch.mockReset();
    dispatchMock.mockReset();
    layerConfigChange.mockReset();
    reorderLayer.mockReset();
    toggleLayerForMap.mockReset();
    reorderLayerOrder.mockReset();
  });

  test('should initialize with correct initial state', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    expect(result.current.activeLayer).toBeUndefined();
    expect(result.current.onDragStart).toBeInstanceOf(Function);
    expect(result.current.onDragEnd).toBeInstanceOf(Function);
  });

  test('onDragStart should update activeLayer and dispatch layerConfigChange if config is active', () => {
    const currentLayers = [
      {id: 1, name: 'Layer 1', config: {isConfigActive: false}},
      {id: 2, name: 'Layer 2', config: {isConfigActive: true}},
      {id: 3, name: 'Layer 3', config: {isConfigActive: false}}
    ];
    const {result} = renderHook(() => useDndLayers(currentLayers, layerOrder));

    const event = {
      active: {id: 2}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeLayer).toEqual(currentLayers[1]);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(layerConfigChange).toHaveBeenCalledWith(currentLayers[1], {isConfigActive: false});
  });

  test('onDragStart should not dispatch layerConfigChange if config is not active', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 1}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeLayer).toEqual(layers[0]);
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(layerConfigChange).not.toHaveBeenCalled();
  });

  test('onDragEnd should reset activeLayer if overType is not defined', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 2},
      over: {}
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(result.current.activeLayer).toBeUndefined();
  });

  test('onDragEnd should dispatch toggleLayerForMap when overType is DROPPABLE_MAP_CONTAINER_TYPE', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 1},
      over: {
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
    expect(toggleLayerForMap).toHaveBeenCalledWith(1, 1);
  });

  test('onDragEnd should dispatch reorderLayer when overType is SORTABLE_LAYER_TYPE', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 2},
      over: {
        data: {
          current: {
            type: SORTABLE_LAYER_TYPE
          }
        }
      }
    };

    const newLayerOrder = [1, 2, 3];
    reorderLayerOrder.mockReturnValue(newLayerOrder);

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderLayer).toHaveBeenCalledWith(newLayerOrder);
  });

  test('onDragEnd should dispatch reorderLayer when overType is SORTABLE_SIDE_PANEL_TYPE', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 2},
      over: {
        data: {
          current: {
            type: SORTABLE_SIDE_PANEL_TYPE
          }
        }
      }
    };

    const newLayerOrder = [1, 3, 2];
    reorderLayerOrder.mockReturnValue(newLayerOrder);

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderLayer).toHaveBeenCalledWith(newLayerOrder);
  });

  test('onDragEnd should do nothing if overType does not match any case', () => {
    const {result} = renderHook(() => useDndLayers(layers, layerOrder));

    const event = {
      active: {id: 2},
      over: {
        data: {
          current: {
            type: 'UNKNOWN_TYPE'
          }
        }
      }
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(reorderLayer).not.toHaveBeenCalled();
    expect(toggleLayerForMap).not.toHaveBeenCalled();
  });
});
