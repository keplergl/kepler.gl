// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useCallback, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {UIStateActions, VisStateActions, MapStateActions} from '@kepler.gl/actions';
import {LayerOrderGroup, LayerOrder, LayerOrderHierarchy, MapState} from '@kepler.gl/types';

import {useDroppable} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import LayerPanelFactory from './layer-panel';
import LayerGroupHeaderFactory from './layer-group-header';
import {buildLayerOrderHierarchy} from '@kepler.gl/reducers';
import {dataTestIds} from '@kepler.gl/constants';
import {SplitMap} from '@kepler.gl/types';
import {
  SORTABLE_LAYER_TYPE,
  SORTABLE_SIDE_PANEL_TYPE,
  SORTABLE_LAYER_GROUP_TYPE,
  SORTABLE_LAYER_GROUP_DROPPABLE_TYPE,
  SORTABLE_LAYER_END_PLACEHOLDER,
  SORTABLE_LAYER_END_TYPE
} from '../../common/dnd-layer-items';

export type LayerListProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: LayerOrder;
  layerClasses: LayerClassesType;
  isSortable?: boolean;
  splitMap?: SplitMap;
  mapState?: MapState;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
};

export type LayerListFactoryDeps = [
  typeof LayerPanelFactory,
  typeof LayerGroupHeaderFactory
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const animateLayoutChanges = args => {
  const {isSorting, wasDragging} = args;
  if (isSorting || wasDragging) {
    return false;
  }
  return defaultAnimateLayoutChanges(args);
};

const EndPlaceholder = styled.div`
  height: 4px;
`;

interface SortableStyledItemProps {
  $transition?: string;
  $transform?: string;
}

const SortableStyledItem = styled.div<SortableStyledItemProps>`
  transition: ${props => props.$transition};
  transform: ${props => props.$transform};
  &.sorting {
    opacity: 0.3;
    pointer-events: none;
  }
  &.sorting-layers .layer-panel__header {
    background-color: ${props => props.theme.panelBackgroundHover};
    font-family: ${props => props.theme.fontFamily};
    font-weight: ${props => props.theme.fontWeight};
    font-size: ${props => props.theme.fontSize};
    line-height: ${props => props.theme.lineHeight};
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    .layer__drag-handle {
      opacity: 1;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const CollapsibleGroupContent = styled.div<{$isOver?: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 0;
  min-height: 32px;
  background-color: ${props => (props.$isOver ? props.theme.panelBackgroundHover : 'transparent')};
  transition: background-color 0.15s ease;
`;

const CollapsedDropZone = styled.div<{$isOver?: boolean}>`
  min-height: 4px;
  background-color: ${props => (props.$isOver ? props.theme.activeColor : 'transparent')};
  transition: background-color 0.15s ease, min-height 0.15s ease;
  ${props => props.$isOver && 'min-height: 24px;'}
`;

const EmptyLayerGroup = styled.div`
  display: flex;
  font-size: 11px;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  border: 1px dashed ${props => props.theme.labelColor};
  border-radius: 4px;
  margin-top: 4px;
  color: ${props => props.theme.subtextColor};
`;

const TREE_TILE_WIDTH = 10;
const TREE_TILE_BORDER_WIDTH = 1;

const StyledColumn = styled.div<{$isLast?: boolean}>`
  border-left: ${props => (props.$isLast ? 0 : 1)}px dashed ${props => props.theme.labelColor};
`;

const TreeTile = styled.div<{$isLast?: boolean}>`
  width: ${TREE_TILE_WIDTH}px;
  border-bottom: 1px dashed ${props => props.theme.labelColor};
  height: ${props => (props.theme.layerPanelHeaderHeight || 32) / 2}px;
  margin-top: 2px;
  border-left: ${props => (props.$isLast ? 1 : 0)}px dashed ${props => props.theme.labelColor};
`;

const NestedLayerContainer = styled.div`
  display: flex;
`;

const NestedLayerContent = styled.div`
  width: calc(100% - ${TREE_TILE_WIDTH + TREE_TILE_BORDER_WIDTH}px);
  padding-top: 8px;
`;

LayerListFactory.deps = [LayerPanelFactory, LayerGroupHeaderFactory];

function LayerListFactory(
  LayerPanel: ReturnType<typeof LayerPanelFactory>,
  LayerGroupHeader: ReturnType<typeof LayerGroupHeaderFactory>
) {
  const NestedLayer: React.FC<{children: React.ReactNode; isLast?: boolean}> = ({
    children,
    isLast
  }) => (
    <NestedLayerContainer>
      <StyledColumn $isLast={isLast}>
        <TreeTile $isLast={isLast} />
      </StyledColumn>
      <NestedLayerContent>{children}</NestedLayerContent>
    </NestedLayerContainer>
  );

  const SortableLayerItem = ({layer, idx, panelProps, layerActions, disabled, parent}: {
    layer: Layer;
    idx: number;
    panelProps: any;
    layerActions: any;
    disabled?: boolean;
    parent?: LayerOrderGroup;
  }) => {
    const {attributes, listeners, setNodeRef, isDragging, transform, transition} = useSortable({
      id: layer.id,
      data: {
        type: SORTABLE_LAYER_TYPE,
        parent
      },
      disabled,
      animateLayoutChanges
    });

    return (
      <SortableStyledItem
        ref={setNodeRef}
        className={classnames(
          {[dataTestIds.sortableLayerItem]: !disabled},
          {[dataTestIds.staticLayerItem]: disabled},
          {sorting: isDragging}
        )}
        data-testid={disabled ? dataTestIds.staticLayerItem : dataTestIds.sortableLayerItem}
        $transform={CSS.Transform.toString(transform)}
        $transition={transition}
        {...attributes}
      >
        <LayerPanel
          {...panelProps}
          {...layerActions}
          key={layer.id}
          idx={idx}
          layer={layer}
          listeners={listeners}
          isDraggable={!disabled}
        />
      </SortableStyledItem>
    );
  };

  const SortableGroupItem: React.FC<{
    layerGroup: LayerOrderGroup;
    layers: Layer[];
    panelProps: any;
    layerActions: any;
    disabled?: boolean;
  }> = ({layerGroup, layers, panelProps, layerActions, disabled}) => {
    const {attributes, isDragging, listeners, setNodeRef, transform, transition} = useSortable({
      id: layerGroup.id,
      data: {type: SORTABLE_LAYER_GROUP_TYPE},
      disabled,
      animateLayoutChanges
    });

    const layerEntriesToShow = buildLayerOrderHierarchy(layerGroup.layerOrder, layers);
    const dndItems = layerEntriesToShow.map(entry => entry[1].id ?? entry[1]);

    const [isSectionOpen, setIsSectionOpen] = useState(true);
    const onToggle = useCallback(() => setIsSectionOpen(prev => !prev), []);

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
      }),
      [isDragging, transform, transition]
    );

    const {isOver, setNodeRef: droppableSetNodeRef} = useDroppable({
      id: `droppable-layer-group-content-${layerGroup.id}`,
      data: {
        type: SORTABLE_LAYER_GROUP_DROPPABLE_TYPE,
        parent: layerGroup
      }
    });

    const isOpen = useMemo(() => isSectionOpen && !isDragging, [isSectionOpen, isDragging]);

    return (
      <div style={style}>
        <div ref={setNodeRef} {...attributes}>
          <LayerGroupHeader
            layerGroup={layerGroup}
            onToggleLayerGroupContent={onToggle}
            isLayerGroupContentOpen={isSectionOpen}
            listeners={listeners}
          />
        </div>
        {isOpen ? (
          <CollapsibleGroupContent ref={droppableSetNodeRef} $isOver={isOver}>
            {layerEntriesToShow.length ? (
              <SortableContext
                id={`sortable-group-${layerGroup.id}`}
                items={dndItems}
                strategy={verticalListSortingStrategy}
              >
                {layerEntriesToShow.map(([type, nestedEntry], index) =>
                  type === 'layer' ? (
                    <NestedLayer
                      key={nestedEntry.id}
                      isLast={index === layerEntriesToShow.length - 1}
                    >
                      <SortableLayerItem
                        layer={nestedEntry as Layer}
                        idx={layers.findIndex(l => l?.id === nestedEntry.id)}
                        panelProps={panelProps}
                        layerActions={layerActions}
                        disabled={disabled}
                        parent={layerGroup}
                      />
                    </NestedLayer>
                  ) : null
                )}
              </SortableContext>
            ) : (
              <EmptyLayerGroup>Drag layer here</EmptyLayerGroup>
            )}
          </CollapsibleGroupContent>
        ) : (
          <CollapsedDropZone ref={droppableSetNodeRef} $isOver={isOver} />
        )}
      </div>
    );
  };

  const SortableEndPlaceholder = () => {
    const {setNodeRef} = useSortable({
      id: SORTABLE_LAYER_END_PLACEHOLDER,
      data: {type: SORTABLE_LAYER_END_TYPE},
      animateLayoutChanges
    });
    return <EndPlaceholder ref={setNodeRef} />;
  };

  const LayerList: React.FC<LayerListProps> = props => {
    const {
      layers,
      datasets,
      layerOrder,
      uiStateActions,
      visStateActions,
      mapStateActions,
      mapState,
      layerClasses,
      isSortable = true,
      splitMap
    } = props;
    const {toggleModal: openModal} = uiStateActions;

    const layerEntriesToShow: LayerOrderHierarchy = useMemo(
      () => buildLayerOrderHierarchy(layerOrder, layers),
      [layerOrder, layers]
    );

    const sidePanelDndItems = useMemo(() => {
      const items = layerEntriesToShow.map(entry => entry[1].id ?? entry[1]);
      items.push(SORTABLE_LAYER_END_PLACEHOLDER);
      return items;
    }, [layerEntriesToShow]);

    const layerTypeOptions = useMemo(
      () =>
        Object.keys(layerClasses).map(key => {
          const layer = new layerClasses[key]({dataId: ''});
          return {
            id: key,
            label: layer.name,
            icon: layer.layerIcon,
            requireData: layer.requireData
          };
        }),
      [layerClasses]
    );

    const layerActions = useMemo(
      () => ({
        layerColorUIChange: visStateActions.layerColorUIChange,
        layerConfigChange: visStateActions.layerConfigChange,
        layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
        layerToggleVisibility: visStateActions.layerToggleVisibility,
        layerTypeChange: visStateActions.layerTypeChange,
        layerVisConfigChange: visStateActions.layerVisConfigChange,
        layerTextLabelChange: visStateActions.layerTextLabelChange,
        removeLayer: visStateActions.removeLayer,
        zoomToLayer: mapStateActions.fitBounds,
        duplicateLayer: visStateActions.duplicateLayer,
        layerSetIsValid: visStateActions.layerSetIsValid
      }),
      [visStateActions, mapStateActions]
    );

    const panelProps = useMemo(
      () => ({
        datasets,
        openModal,
        layerTypeOptions,
        splitMap,
        mapState
      }),
      [datasets, openModal, layerTypeOptions, splitMap, mapState]
    );

    return (
      <Container>
        <SortableContext
          id={SORTABLE_SIDE_PANEL_TYPE}
          items={sidePanelDndItems}
          strategy={verticalListSortingStrategy}
          disabled={!isSortable}
        >
          {layerEntriesToShow.map(([type, item]) =>
            type === 'layer' ? (
              <SortableLayerItem
                key={item.id}
                layer={item as Layer}
                idx={layers.findIndex(l => l?.id === item.id)}
                panelProps={panelProps}
                layerActions={layerActions}
                disabled={!isSortable}
              />
            ) : (
              <SortableGroupItem
                key={(item as LayerOrderGroup).id}
                layerGroup={item as LayerOrderGroup}
                layers={layers}
                panelProps={panelProps}
                layerActions={layerActions}
                disabled={!isSortable}
              />
            )
          )}
          <SortableEndPlaceholder />
        </SortableContext>
      </Container>
    );
  };
  return LayerList;
}
export default LayerListFactory;
