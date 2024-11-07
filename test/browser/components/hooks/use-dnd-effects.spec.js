// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {renderHook, act} from '@testing-library/react';
import {useDispatch} from 'react-redux';
import {useDndEffects} from '@kepler.gl/components';
import {reorderEffect, updateEffect} from '@kepler.gl/actions';
import {SORTABLE_EFFECT_PANEL_TYPE, SORTABLE_EFFECT_TYPE} from '@kepler.gl/constants';
import {reorderEffectOrder} from '@kepler.gl/utils';

// Mock useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

// Mock dependencies
jest.mock('@kepler.gl/actions', () => ({
  ...jest.requireActual('@kepler.gl/actions'),
  reorderEffect: jest.fn(),
  updateEffect: jest.fn()
}));

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  reorderEffectOrder: jest.fn()
}));

describe('useDndEffects', () => {
  const effects = [
    {id: 1, isConfigActive: false},
    {id: 2, isConfigActive: false},
    {id: 3, isConfigActive: false}
  ];

  const effectOrder = [2, 1, 3];

  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    useDispatch.mockReset();
    dispatchMock.mockReset();
    reorderEffect.mockReset();
    updateEffect.mockReset();
    reorderEffectOrder.mockReset();
  });

  test('should initialize with correct initial state', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

    expect(result.current.activeEffect).toBeUndefined();
    expect(result.current.onDragStart).toBeInstanceOf(Function);
    expect(result.current.onDragEnd).toBeInstanceOf(Function);
  });

  test('onDragStart should update activeEffect and dispatch updateEffect if config is active', () => {
    const currentEffects = [
      {id: 1, isConfigActive: false},
      {id: 2, isConfigActive: true},
      {id: 3, isConfigActive: false}
    ];
    const {result} = renderHook(() => useDndEffects(currentEffects, effectOrder));

    const event = {
      active: {id: 2}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeEffect).toEqual(currentEffects[1]);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(updateEffect).toHaveBeenCalledWith(currentEffects[1].id, {isConfigActive: false});
  });

  test('onDragStart should not dispatch updateEffect if config is not active', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

    const event = {
      active: {id: 1}
    };

    act(() => {
      result.current.onDragStart(event);
    });

    expect(result.current.activeEffect).toEqual(effects[0]);
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(updateEffect).not.toHaveBeenCalled();
  });

  test('onDragEnd should reset activeEffect if overType is not defined', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

    const event = {
      active: {id: 2},
      over: {}
    };

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(result.current.activeEffect).toBeUndefined();
  });

  test('onDragEnd should dispatch reorderEffect when overType is SORTABLE_EFFECT_TYPE', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

    const event = {
      active: {id: 2},
      over: {
        data: {
          current: {
            type: SORTABLE_EFFECT_TYPE
          }
        }
      }
    };

    const newEffectOrder = [1, 2, 3];
    reorderEffectOrder.mockReturnValue(newEffectOrder);

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderEffect).toHaveBeenCalledWith(newEffectOrder);
  });

  test('onDragEnd should dispatch reorderEffect when overType is SORTABLE_EFFECT_PANEL_TYPE', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

    const event = {
      active: {id: 2},
      over: {
        data: {
          current: {
            type: SORTABLE_EFFECT_PANEL_TYPE
          }
        }
      }
    };

    const newEffectOrder = [1, 3, 2];
    reorderEffectOrder.mockReturnValue(newEffectOrder);

    act(() => {
      result.current.onDragEnd(event);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(reorderEffect).toHaveBeenCalledWith(newEffectOrder);
  });

  test('onDragEnd should do nothing if overType does not match any case', () => {
    const {result} = renderHook(() => useDndEffects(effects, effectOrder));

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
    expect(reorderEffect).not.toHaveBeenCalled();
  });
});
