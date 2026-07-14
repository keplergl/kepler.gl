// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {reorderLayer, toggleLayerForMap} from '@kepler.gl/actions';
import {
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_LAYER_GROUP_TYPE,
  SORTABLE_LAYER_GROUP_DROPPABLE_TYPE,
  SORTABLE_LAYER_END_TYPE
} from '../common/dnd-layer-items';
import {
  reorderLayerOrder,
  getLayerGroupFromLayerOrder,
  getIndexFromLayerEntryId,
  addLayerOrGroupToLayerOrder,
  removeElementFromLayerOrder,
  updateLayerGroupInLayerOrder
} from '@kepler.gl/reducers';
import {Layer} from '@kepler.gl/layers';
import {LayerOrderGroup, LayerOrder, LayerOrderHierarchyEntry} from '@kepler.gl/types';

type DndLayersHook = {
  activeElement: LayerOrderHierarchyEntry | undefined;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const useDndLayers: (layers: Layer[], layerOrder: LayerOrder) => DndLayersHook = (
  layers,
  layerOrder
) => {
  const dispatch = useDispatch();

  const [activeElement, setActiveElement] = useState<LayerOrderHierarchyEntry | undefined>();

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const {active} = event;
      const activeType = event.active.data.current?.type;

      if (!activeType) {
        return;
      }

      switch (activeType) {
        case SORTABLE_LAYER_TYPE: {
          const activeLayer = layers.find(l => l.id === active.id);
          if (activeLayer) {
            setActiveElement(['layer', activeLayer]);
          }
          break;
        }
        case SORTABLE_LAYER_GROUP_TYPE: {
          const activeLayerGroup = getLayerGroupFromLayerOrder(layerOrder, active.id as string);
          if (activeLayerGroup) {
            setActiveElement(['layerGroup', activeLayerGroup as LayerOrderGroup]);
          }
          break;
        }
        default:
          break;
      }
    },
    [layerOrder, layers]
  );

  // eslint-disable-next-line complexity
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const {active, over} = event;
      const activeId = active.id as string;
      const overId = over?.id as string | null;
      const activeParent = active.data?.current?.parent;
      const activeType = active.data?.current?.type;
      const overParent = over?.data?.current?.parent;
      const overType = over?.data?.current?.type;
      setActiveElement(undefined);

      if (!overId) {
        if (activeParent && activeType === SORTABLE_LAYER_TYPE) {
          let newLayerOrder = removeElementFromLayerOrder(layerOrder, activeId);
          newLayerOrder = addLayerOrGroupToLayerOrder(newLayerOrder, activeId, newLayerOrder.length);
          dispatch(reorderLayer(newLayerOrder));
        }
        return;
      }

      if (overType === DROPPABLE_MAP_CONTAINER_TYPE) {
        if (activeType === SORTABLE_LAYER_TYPE) {
          const mapIndex = over?.data.current?.index ?? 0;
          dispatch(toggleLayerForMap(mapIndex, activeId));
        }
        return;
      }

      if (overType === SORTABLE_LAYER_END_TYPE) {
        const groupObj = getLayerGroupFromLayerOrder(layerOrder, activeId);
        let newLayerOrder = removeElementFromLayerOrder(layerOrder, activeId);
        newLayerOrder = addLayerOrGroupToLayerOrder(
          newLayerOrder,
          groupObj ?? activeId,
          newLayerOrder.length
        );
        dispatch(reorderLayer(newLayerOrder));
        return;
      }

      // swap layers at same level
      if (activeParent?.id === overParent?.id) {
        if (!activeParent) {
          const newLayerOrder = reorderLayerOrder(layerOrder, activeId, overId);
          dispatch(reorderLayer(newLayerOrder));
        } else {
          const currentLayerGroup = activeParent as LayerOrderGroup;
          const newGroupLayerOrder = reorderLayerOrder(
            currentLayerGroup.layerOrder,
            activeId,
            overId
          );
          const newLayerGroup = {
            ...currentLayerGroup,
            layerOrder: newGroupLayerOrder
          };
          const newLayerOrder = updateLayerGroupInLayerOrder(layerOrder, newLayerGroup);
          dispatch(reorderLayer(newLayerOrder));
        }
        return;
      }

      // move into a group (either empty group droppable or onto a layer inside group)
      if (overType === SORTABLE_LAYER_GROUP_DROPPABLE_TYPE || overParent) {
        if (activeType === SORTABLE_LAYER_TYPE) {
          const currentLayerGroup = overParent
            ? overParent
            : getLayerGroupFromLayerOrder(layerOrder, overId);

          if (!currentLayerGroup) return;

          const overIndex =
            overType === SORTABLE_LAYER_GROUP_DROPPABLE_TYPE
              ? 0
              : getIndexFromLayerEntryId(currentLayerGroup.layerOrder, overId);

          const newLayerGroup = {
            ...currentLayerGroup,
            layerOrder: addLayerOrGroupToLayerOrder(
              currentLayerGroup.layerOrder,
              activeId,
              overIndex
            )
          };

          let newLayerOrder = removeElementFromLayerOrder(layerOrder, activeId);
          newLayerOrder = updateLayerGroupInLayerOrder(newLayerOrder, newLayerGroup);
          dispatch(reorderLayer(newLayerOrder));
        }
        return;
      }

      // moving layer/group onto root
      if (!overParent) {
        const groupObj = getLayerGroupFromLayerOrder(layerOrder, activeId as string);
        let newLayerOrder = removeElementFromLayerOrder(layerOrder, activeId);
        const overIndex = over?.data.current?.sortable?.index ?? 0;
        newLayerOrder = addLayerOrGroupToLayerOrder(newLayerOrder, groupObj ?? activeId, overIndex);
        dispatch(reorderLayer(newLayerOrder));
      }
    },
    [dispatch, layerOrder]
  );

  return {activeElement, onDragStart, onDragEnd};
};

export default useDndLayers;
