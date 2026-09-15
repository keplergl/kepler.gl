// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {useCallback, useState} from 'react';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {reorderEffect, updateEffect} from '@kepler.gl/actions';
import {reorderEffectOrder} from '@kepler.gl/utils';
import {Effect} from '@kepler.gl/types';
import {SORTABLE_EFFECT_TYPE} from '@kepler.gl/components';

import {useStoreWithKepler} from '../KeplerSlice';

// TODO import from @kepler.gl/components once 3.2.1 release is available
const SORTABLE_EFFECT_PANEL_TYPE = 'root';

type DndEffectsHook = {
  activeEffect: Effect | undefined;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const useDndEffects: (
  mapId: string | undefined,
  effects: Effect[],
  effectOrder: string[]
) => DndEffectsHook = (mapId, effects, effectOrder) => {
  // Use the proper sqlrooms dispatch mechanism instead of useDispatch
  const dispatch = useStoreWithKepler(state => state.kepler.dispatchAction);

  const [activeEffect, setActiveEffect]: [
    Effect | undefined,
    (effect: Effect | undefined) => void
  ] = useState();

  const onEffectDragStart = useCallback(
    (event: DragStartEvent) => {
      const {active} = event;
      if (!mapId) return;
      const newActiveEffect = effects.find(effect => effect.id === active.id);
      if (newActiveEffect) {
        setActiveEffect(newActiveEffect);
        if ((newActiveEffect as any).isConfigActive) {
          dispatch(mapId, updateEffect(newActiveEffect.id, {isConfigActive: false}));
        }
      }
    },
    [dispatch, effects, mapId]
  );

  const onEffectDragEnd = useCallback(
    (event: DragEndEvent) => {
      const {active, over} = event;
      if (!mapId) return;

      const {id: activeEffectId} = active;
      const overType = over?.data?.current?.type;

      if (!overType) {
        setActiveEffect(undefined);
        return;
      }

      switch (overType) {
        // swaping effects
        case SORTABLE_EFFECT_TYPE:
          dispatch(
            mapId,
            reorderEffect(
              reorderEffectOrder(effectOrder, activeEffectId.toString(), over.id.toString())
            )
          );
          break;
        //  moving effects within side panel
        case SORTABLE_EFFECT_PANEL_TYPE:
          // move effect to the end of the list
          dispatch(
            mapId,
            reorderEffect(
              reorderEffectOrder(
                effectOrder,
                activeEffectId.toString(),
                effectOrder[effectOrder.length - 1] || ''
              )
            )
          );
          break;
        default:
          break;
      }

      setActiveEffect(undefined);
    },
    [dispatch, effectOrder, mapId]
  );

  return {
    activeEffect,
    onDragStart: onEffectDragStart,
    onDragEnd: onEffectDragEnd
  };
};

export default useDndEffects;
