// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, PropsWithChildren} from 'react';
import styled from 'styled-components';
import {DndContext as DndKitContext, DragOverlay} from '@dnd-kit/core';
import Console from 'global/console';

import {
  DND_EMPTY_MODIFIERS,
  DND_MODIFIERS,
  SORTABLE_LAYER_TYPE,
  SORTABLE_EFFECT_TYPE
} from '@kepler.gl/constants';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import LayerPanelHeaderFactory from './side-panel/layer-panel/layer-panel-header';
import {withState} from './injector';
import useDndLayers from './hooks/use-dnd-layers';
import useDndEffects from './hooks/use-dnd-effects';

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

DndContextFactory.deps = [LayerPanelHeaderFactory];

function DndContextFactory(
  LayerPanelHeader: ReturnType<typeof LayerPanelHeaderFactory>
): React.FC<PropsWithChildren> {
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
      activeLayer,
      onDragStart: onLayerDragStart,
      onDragEnd: onLayerDragEnd
    } = useDndLayers(layers, layerOrder);
    const {onDragStart: onEffectDragStart, onDragEnd: onEffectDragEnd} = useDndEffects(
      effects,
      effectOrder
    );

    const isSplit = useMemo(() => splitMaps?.length > 1, [splitMaps]);
    const dndModifiers = useMemo(() => (isSplit ? DND_EMPTY_MODIFIERS : DND_MODIFIERS), [isSplit]);

    const onDragStart = useCallback(
      event => {
        const activeType = event.active.data?.current?.type;
        switch (activeType) {
          case SORTABLE_LAYER_TYPE:
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
      <DndKitContext onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={dndModifiers}>
        {children}
        {activeLayer ? (
          <DragOverlay modifiers={dndModifiers} dropAnimation={null}>
            <DragItem>
              <LayerPanelOverlay layer={activeLayer} datasets={datasets} />
            </DragItem>
          </DragOverlay>
        ) : null}
      </DndKitContext>
    );
  };

  return withState([visStateLens], state => state)(DndContext) as React.FC<PropsWithChildren>;
}

export default DndContextFactory;
