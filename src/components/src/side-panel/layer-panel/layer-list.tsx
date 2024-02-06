// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {UIStateActions, VisStateActions, MapStateActions} from '@kepler.gl/actions';

import {useSortable, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import LayerPanelFactory from './layer-panel';
import {findById} from '@kepler.gl/utils';
import {dataTestIds, SORTABLE_LAYER_TYPE, SORTABLE_SIDE_PANEL_TYPE} from '@kepler.gl/constants';

export type LayerListProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: string[];
  layerClasses: LayerClassesType;
  isSortable?: boolean;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
};

export type LayerListFactoryDeps = [typeof LayerPanelFactory];

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface SortableStyledItemProps {
  transition?: string;
  transform?: string;
}

const SortableStyledItem = styled.div<SortableStyledItemProps>`
  z-index: ${props => props.theme.dropdownWrapperZ + 1};
  transition: ${props => props.transition};
  transform: ${props => props.transform};
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

const INITIAL_LAYERS_TO_SHOW: Layer[] = [];

LayerListFactory.deps = [LayerPanelFactory];

function LayerListFactory(LayerPanel: ReturnType<typeof LayerPanelFactory>) {
  // By wrapping layer panel using a sortable element we don't have to implement the drag and drop logic into the panel itself;
  // Developers can provide any layer panel implementation and it will still be sortable
  const SortableItem = ({layer, idx, panelProps, layerActions, disabled}) => {
    const {attributes, listeners, setNodeRef, isDragging, transform, transition} = useSortable({
      id: layer.id,
      data: {
        type: SORTABLE_LAYER_TYPE,
        parent: SORTABLE_SIDE_PANEL_TYPE
      },
      disabled
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
        transform={CSS.Transform.toString(transform)}
        transition={transition}
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

  const LayerList: React.FC<LayerListProps> = props => {
    const {
      layers,
      datasets,
      layerOrder,
      uiStateActions,
      visStateActions,
      mapStateActions,
      layerClasses,
      isSortable = true
    } = props;
    const {toggleModal: openModal} = uiStateActions;

    const layersToShow = useMemo(() => {
      return layerOrder.reduce((acc, layerId) => {
        const layer = findById(layerId)(layers.filter(Boolean));
        if (!layer) {
          return acc;
        }
        return !layer.config.hidden ? [...acc, layer] : acc;
      }, INITIAL_LAYERS_TO_SHOW);
    }, [layers, layerOrder]);

    const sidePanelDndItems = useMemo(() => {
      return layersToShow.map(({id}) => id);
    }, [layersToShow]);

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
        layerTypeOptions
      }),
      [datasets, openModal, layerTypeOptions]
    );

    return (
      <Container>
        <SortableContext
          id={SORTABLE_SIDE_PANEL_TYPE}
          items={sidePanelDndItems}
          strategy={verticalListSortingStrategy}
          disabled={!isSortable}
        >
          {/* warning: containerId should be similar to the first key in dndItems defined in kepler-gl.js*/}
          {layersToShow.map(layer => (
            <SortableItem
              key={layer.id}
              layer={layer}
              idx={layers.findIndex(l => l?.id === layer.id)}
              panelProps={panelProps}
              layerActions={layerActions}
              disabled={!isSortable}
            />
          ))}
        </SortableContext>
      </Container>
    );
  };
  return LayerList;
}
export default LayerListFactory;
