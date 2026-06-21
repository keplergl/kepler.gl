// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, PropsWithChildren} from 'react';
import styled from 'styled-components';
import {
  DndContext as DndKitContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  CollisionDetection
} from '@dnd-kit/core';

import Console from 'global/console';
import {VisState} from '@kepler.gl/schemas';
import {LayerOrderGroup} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';

import LayerPanelHeaderFactory from './side-panel/layer-panel/layer-panel-header';
import LayerGroupHeaderFactory from './side-panel/layer-panel/layer-group-header';
import useDndLayers from './hooks/use-dnd-layers';
import useDndEffects from './hooks/use-dnd-effects';

import {
  DND_MODIFIERS,
  DND_EMPTY_MODIFIERS,
  SORTABLE_LAYER_TYPE,
  SORTABLE_LAYER_GROUP_TYPE,
  SORTABLE_LAYER_END_TYPE,
  SORTABLE_EFFECT_TYPE,
  SORTABLE_LAYER_GROUP_DROPPABLE_TYPE
} from './common/dnd-layer-items';

export type DndContextProps = PropsWithChildren<{
  visState: VisState;
}>;

export type DndContextComponent = React.FC<DndContextProps>;

export const DragItem = styled.div`
  color: ${props => props.theme.textColorHl};
  border-radius: ${props => props.theme.radioButtonRadius}px;
  padding: 5px 10px;
  display: inline;
`;

const nop = () => undefined;

/**
 * Hybrid collision detection: uses closestCenter for sortable items (stable reordering
 * without flickering) and pointerWithin for group droppable containers (reliable drop
 * detection even when group is the last item). When dragging a group, only root-level
 * sortable items are considered to prevent flickering from nested items.
 */
const layerGroupCollisionDetection: CollisionDetection = args => {
  const activeType = args.active.data?.current?.type;

  // When dragging a group, only consider root-level sortable items (no parent)
  if (activeType === SORTABLE_LAYER_GROUP_TYPE) {
    const filteredArgs = {
      ...args,
      droppableContainers: args.droppableContainers.filter(container => {
        const type = container.data?.current?.type;
        return (
          type === SORTABLE_LAYER_GROUP_TYPE ||
          type === SORTABLE_LAYER_END_TYPE ||
          (type === SORTABLE_LAYER_TYPE && !container.data?.current?.parent)
        );
      })
    };
    return closestCenter(filteredArgs);
  }

  const closestCenterCollisions = closestCenter(args);
  const pointerCollisions = pointerWithin(args);

  const groupDroppable = pointerCollisions.find(c => {
    const type = c.data?.droppableContainer?.data?.current?.type;
    return type === SORTABLE_LAYER_GROUP_DROPPABLE_TYPE;
  });

  if (groupDroppable && closestCenterCollisions.length === 0) {
    return [groupDroppable];
  }

  if (groupDroppable) {
    const hasNonGroupSortable = closestCenterCollisions.some(c => {
      const type = c.data?.droppableContainer?.data?.current?.type;
      return type !== SORTABLE_LAYER_GROUP_DROPPABLE_TYPE && type !== SORTABLE_LAYER_END_TYPE;
    });
    if (!hasNonGroupSortable) {
      return [groupDroppable];
    }
  }

  return closestCenterCollisions;
};

DndContextFactory.deps = [LayerPanelHeaderFactory, LayerGroupHeaderFactory];

function DndContextFactory(
  LayerPanelHeader: ReturnType<typeof LayerPanelHeaderFactory>,
  LayerGroupHeader: ReturnType<typeof LayerGroupHeaderFactory>
): React.FC<DndContextProps> {
  const LayerPanelOverlay = ({layer, datasets}) => {
    const color =
      layer.config.dataId && datasets[layer.config.dataId]
        ? datasets[layer.config.dataId].color
        : null;
    return (
      <LayerPanelHeader
        isConfigActive={false}
        layerId={layer.id}
        isVisible={true}
        isValid={true}
        label={layer.config.label}
        labelRCGColorValues={color}
        onToggleVisibility={nop}
        onResetIsValid={nop}
        onUpdateLayerLabel={nop}
        onToggleEnableConfig={nop}
        onDuplicateLayer={nop}
        onRemoveLayer={nop}
        onZoomToLayer={nop}
        layerType={layer.type}
        allowDuplicate={false}
        isDragNDropEnabled={false}
      />
    );
  };

  const DndContext = ({children, visState}: DndContextProps) => {
    const {datasets, layerOrder, layers, effects, effectOrder, splitMaps} = visState;

    const {
      activeElement,
      onDragStart: onLayerDragStart,
      onDragEnd: onLayerDragEnd
    } = useDndLayers(layers, layerOrder);
    const {onDragStart: onEffectDragStart, onDragEnd: onEffectDragEnd} = useDndEffects(
      effects,
      effectOrder
    );

    const isSplit = useMemo(() => splitMaps?.length > 1, [splitMaps]);
    const dndModifiers = useMemo(() => (isSplit ? DND_EMPTY_MODIFIERS : DND_MODIFIERS), [isSplit]);

    const activeElementType = activeElement?.[0];
    const activeElementObject = activeElement?.[1];

    const onDragStart = useCallback(
      event => {
        const activeType = event.active.data?.current?.type;
        switch (activeType) {
          case SORTABLE_LAYER_TYPE:
          case SORTABLE_LAYER_GROUP_TYPE:
            onLayerDragStart(event);
            break;
          case SORTABLE_EFFECT_TYPE:
            onEffectDragStart(event);
            break;
          default:
            Console.log(`activeType ${activeType} unknown`);
        }
      },
      [onLayerDragStart, onEffectDragStart]
    );

    const onDragEnd = useCallback(
      event => {
        const activeType = event.active.data?.current?.type;
        switch (activeType) {
          case SORTABLE_LAYER_TYPE:
          case SORTABLE_LAYER_GROUP_TYPE:
            onLayerDragEnd(event);
            break;
          case SORTABLE_EFFECT_TYPE:
            onEffectDragEnd(event);
            break;
          default:
            Console.log(`activeType ${activeType} unknown`);
        }
      },
      [onLayerDragEnd, onEffectDragEnd]
    );

    return (
      <DndKitContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={dndModifiers}
        collisionDetection={layerGroupCollisionDetection}
      >
        {children}
        <DragOverlay modifiers={dndModifiers} dropAnimation={null}>
          {activeElementType === 'layer' && activeElementObject ? (
            <DragItem>
              <LayerPanelOverlay layer={activeElementObject as Layer} datasets={datasets} />
            </DragItem>
          ) : null}
          {activeElementType === 'layerGroup' && activeElementObject ? (
            <DragItem>
              <LayerGroupHeader layerGroup={activeElementObject as LayerOrderGroup} />
            </DragItem>
          ) : null}
        </DragOverlay>
      </DndKitContext>
    );
  };

  return DndContext;
}

export default DndContextFactory;
