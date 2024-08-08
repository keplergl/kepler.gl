// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';

import {reorderEffect, updateEffect} from '@kepler.gl/actions';
import {SORTABLE_EFFECT_PANEL_TYPE, SORTABLE_EFFECT_TYPE} from '@kepler.gl/constants';
import {reorderEffectOrder} from '@kepler.gl/utils';
import {Effect} from '@kepler.gl/types';

type DndEffectsHook = {
  activeEffect: Effect | undefined;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const useDndEffects: (effects: Effect[], effectOrder: string[]) => DndEffectsHook = (
  effects,
  effectOrder
) => {
  const dispatch = useDispatch();
  const [activeEffect, setActiveEffect]: [
    Effect | undefined,
    (effect: Effect | undefined) => void
  ] = useState();
  const onEffectDragStart = useCallback(
    event => {
      const {active} = event;
      const newActiveEffect = effects.find(effect => effect.id === active.id);
      if (newActiveEffect) {
        setActiveEffect(newActiveEffect);
        if (newActiveEffect.isConfigActive) {
          dispatch(updateEffect(newActiveEffect.id, {isConfigActive: false}));
        }
      }
    },
    [dispatch, effects]
  );

  const onEffectDragEnd = useCallback(
    event => {
      const {active, over} = event;

      const {id: activeEffectId} = active;
      const overType = over?.data?.current?.type;

      if (!overType) {
        setActiveEffect(undefined);
        return;
      }

      switch (overType) {
        // swaping effects
        case SORTABLE_EFFECT_TYPE:
          dispatch(reorderEffect(reorderEffectOrder(effectOrder, activeEffectId, over.id)));
          break;
        //  moving effects within side panel
        case SORTABLE_EFFECT_PANEL_TYPE:
          // move effect to the end of the list
          dispatch(
            reorderEffect(
              reorderEffectOrder(effectOrder, activeEffectId, effectOrder[effectOrder.length - 1])
            )
          );
          break;
        default:
          break;
      }

      setActiveEffect(undefined);
    },
    [dispatch, effectOrder]
  );

  return {activeEffect, onDragStart: onEffectDragStart, onDragEnd: onEffectDragEnd};
};

export default useDndEffects;
