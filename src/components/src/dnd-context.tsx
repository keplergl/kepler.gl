import React, {useCallback, useMemo, useState, PropsWithChildren} from 'react';
import styled from 'styled-components';
import {DndContext as DndKitContext, DragOverlay} from '@dnd-kit/core';
import Console from 'global/console';
import {useDispatch} from 'react-redux';
import {
  DND_EMPTY_MODIFIERS,
  DND_MODIFIERS,
  DROPPABLE_MAP_CONTAINER_TYPE,
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE,
  SORTABLE_EFFECT_TYPE,
  SORTABLE_EFFECT_PANEL_TYPE
} from '@kepler.gl/constants';
import {
  layerConfigChange,
  reorderLayer,
  toggleLayerForMap,
  updateEffect,
  reorderEffect
} from '@kepler.gl/actions';
import LayerPanelHeaderFactory from './side-panel/layer-panel/layer-panel-header';
import {withState} from './injector';
import {visStateLens} from '@kepler.gl/reducers';
import {reorderLayerOrder} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {Layer} from '@kepler.gl/layers';
import {Effect} from '@kepler.gl/types';
import {reorderEffectOrder} from '@kepler.gl/utils';

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
        layerType={layer.type}
        allowDuplicate={false}
        isDragNDropEnabled={false}
      />
    );
  };

  const DndContext = ({children, visState}: DndContextProps) => {
    const {datasets, layerOrder, layers, effects, effectOrder, splitMaps} = visState;

    const [activeLayer, setActiveLayer]: [
      Layer | undefined,
      (l: Layer | undefined) => void
    ] = useState();

    const [activeEffect, setActiveEffect]: [
      Effect | undefined,
      (l: Effect | undefined) => void
    ] = useState();

    const dispatch = useDispatch();
    const isSplit = useMemo(() => splitMaps?.length > 1, [splitMaps]);
    const dndModifiers = useMemo(() => (isSplit ? DND_EMPTY_MODIFIERS : DND_MODIFIERS), [isSplit]);

    const onLayerDragStart = useCallback(
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

    const onEffectDragStart = useCallback(
      event => {
        const {active} = event;
        const newActiveEffect = effects.find(effect => effect.id === active.id);
        if (newActiveEffect) {
          setActiveEffect(newActiveEffect);
          if (newActiveEffect.config.isConfigActive) {
            dispatch(updateEffect(newActiveEffect.id, {isConfigActive: false}));
          }
        }
      },
      [dispatch, effects]
    );

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

    const onLayerDragEnd = useCallback(
      event => {
        const {active, over} = event;

        const {id: activeLayerId} = active;
        const overType = over?.data.current?.type;

        if (!overType) {
          setActiveLayer(undefined);
          return;
        }

        switch (overType) {
          // moving layers into maps
          case DROPPABLE_MAP_CONTAINER_TYPE:
            const mapIndex = over.data.current?.index ?? 0;
            dispatch(toggleLayerForMap(mapIndex, activeLayerId));
            break;
          // swaping layers
          case SORTABLE_LAYER_TYPE:
            const newLayerOrder = reorderLayerOrder(layerOrder, activeLayerId, over.id);
            dispatch(reorderLayer(newLayerOrder));
            break;
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

    const onEffectDragEnd = useCallback(
      event => {
        const {active, over} = event;

        const {id: activeEffectId} = active;
        const overType = over?.data.current?.type;

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

    const onDragEnd = useCallback(
      event => {
        if (activeLayer) onLayerDragEnd(event);
        if (activeEffect) onEffectDragEnd(event);
      },
      [activeLayer, activeEffect, onLayerDragEnd, onEffectDragEnd]
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
