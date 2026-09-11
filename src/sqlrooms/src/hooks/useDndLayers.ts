// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {useCallback, useState} from 'react';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {layerConfigChange, reorderLayer, toggleLayerForMap} from '@kepler.gl/actions';
import {reorderLayerOrder} from '@kepler.gl/reducers';
import {Layer} from '@kepler.gl/layers';
import type {LayerOrder} from '@kepler.gl/types';
import {
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE
} from '@kepler.gl/components';
import {useStoreWithKepler} from '../KeplerSlice';

type DndEffectsHook = {
  activeLayer: Layer | undefined;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const useDndLayers: (
  mapId: string | undefined,
  layers: Layer[],
  layerOrder: LayerOrder
) => DndEffectsHook = (mapId, layers, layerOrder) => {
  const dispatch = useStoreWithKepler(state => state.kepler.dispatchAction);

  const [activeLayer, setActiveLayer]: [
    activeEffect: Layer | undefined,
    setActiveEffect: (effect: Layer | undefined) => void
  ] = useState();

  const onDragStart = useCallback(
    (event: any) => {
      const {active} = event;
      if (!mapId) return;
      const newActiveLayer = layers.find(layer => layer.id === active.id);
      if (newActiveLayer) {
        setActiveLayer(newActiveLayer);
        if (newActiveLayer?.config.isConfigActive) {
          dispatch(mapId, layerConfigChange(newActiveLayer, {isConfigActive: false}));
        }
      }
    },
    [dispatch, layers, mapId]
  );

  const onDragEnd = useCallback(
    (event: any) => {
      const {active, over} = event;
      if (!mapId) return;

      const {id: activeLayerId} = active;
      const overType = over?.data?.current?.type;

      if (!overType) {
        setActiveLayer(undefined);
        return;
      }

      switch (overType) {
        // moving layers into maps
        case DROPPABLE_MAP_CONTAINER_TYPE: {
          const mapIndex = over.data.current?.index ?? 0;
          dispatch(mapId, toggleLayerForMap(mapIndex, activeLayerId));
          break;
        }
        // swaping layers
        case SORTABLE_LAYER_TYPE: {
          const newLayerOrder = reorderLayerOrder(layerOrder, activeLayerId, over.id);
          dispatch(mapId, reorderLayer(newLayerOrder));
          break;
        }
        //  moving layers within side panel
        case SORTABLE_SIDE_PANEL_TYPE: {
          const lastEntry = layerOrder[layerOrder.length - 1];
          const destinationId = typeof lastEntry === 'string' ? lastEntry : lastEntry?.id;
          if (!destinationId) break;
          // move layer to the end of the list
          dispatch(
            mapId,
            reorderLayer(reorderLayerOrder(layerOrder, activeLayerId, destinationId))
          );
          break;
        }
        default:
          break;
      }

      setActiveLayer(undefined);
    },
    [dispatch, layerOrder, mapId]
  );

  return {activeLayer, onDragStart, onDragEnd};
};

export default useDndLayers;
