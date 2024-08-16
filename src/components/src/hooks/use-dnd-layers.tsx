// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {layerConfigChange, reorderLayer, toggleLayerForMap} from '@kepler.gl/actions';
import {
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE
} from '@kepler.gl/constants';
import {reorderLayerOrder} from '@kepler.gl/reducers';
import {Layer} from '@kepler.gl/layers';

type DndEffectsHook = {
  activeLayer: Layer | undefined;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const useDndLayers: (layers: Layer[], layerOrder: string[]) => DndEffectsHook = (
  layers,
  layerOrder
) => {
  const dispatch = useDispatch();

  const [activeLayer, setActiveLayer]: [
    activeEffect: Layer | undefined,
    setActiveEffect: (effect: Layer | undefined) => void
  ] = useState();

  const onDragStart = useCallback(
    event => {
      const {active} = event;
      const newActiveLayer = layers.find(layer => layer.id === active.id);
      if (newActiveLayer) {
        setActiveLayer(newActiveLayer);
        if (newActiveLayer?.config.isConfigActive) {
          dispatch(layerConfigChange(newActiveLayer, {isConfigActive: false}));
        }
      }
    },
    [dispatch, layers]
  );

  const onDragEnd = useCallback(
    event => {
      const {active, over} = event;

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
          dispatch(toggleLayerForMap(mapIndex, activeLayerId));
          break;
        }
        // swaping layers
        case SORTABLE_LAYER_TYPE: {
          const newLayerOrder = reorderLayerOrder(layerOrder, activeLayerId, over.id);
          dispatch(reorderLayer(newLayerOrder));
          break;
        }
        //  moving layers within side panel
        case SORTABLE_SIDE_PANEL_TYPE:
          // move layer to the end of the list
          dispatch(
            reorderLayer(
              reorderLayerOrder(layerOrder, activeLayerId, layerOrder[layerOrder.length - 1])
            )
          );
          break;
        default:
          break;
      }

      setActiveLayer(undefined);
    },
    [dispatch, layerOrder]
  );

  return {activeLayer, onDragStart, onDragEnd};
};

export default useDndLayers;
