// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import LayerPanelFactory from './layer-panel';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';

import {useDroppable} from '@dnd-kit/core';
import {useSortable, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {findById} from '@kepler.gl/utils';

type LayerListProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: string[];
  layerClasses: LayerClassesType;
  isSortable?: boolean;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
};

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style

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

LayerListFactory.deps = [LayerPanelFactory];

function LayerListFactory(LayerPanel: ReturnType<typeof LayerPanelFactory>) {
  // By wrapping layer panel using a sortable element we don't have to implement the drag and drop logic into the panel itself;
  // Developers can provide any layer panel implementation and it will still be sortable
  const SortableItem = ({layer, layerIndex, panelProps, layerActions}) => {
    const {attributes, listeners, setNodeRef, isDragging, transform, transition} = useSortable({
      id: layer.id
    });

    return (
      <SortableStyledItem
        ref={setNodeRef}
        className={classnames('sortable-layer-items', {sorting: isDragging})}
        transform={CSS.Transform.toString(transform)}
        transition={transition}
        {...attributes}
      >
        <LayerPanel
          {...panelProps}
          {...layerActions}
          key={layer.id}
          idx={layerIndex}
          layer={layer}
          listeners={listeners}
        />
      </SortableStyledItem>
    );
  };

  const SortableList = ({containerId, sidePanelDndItems, children}) => {
    const {setNodeRef} = useDroppable({id: containerId});
    return (
      <SortableContext
        id={containerId}
        items={sidePanelDndItems}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>{children}</div>
      </SortableContext>
    );
  };

  const LayerList: React.FC<LayerListProps> = props => {
    const {
      layers,
      datasets,
      layerOrder,
      uiStateActions,
      visStateActions,
      layerClasses,
      isSortable = true
    } = props;
    const {toggleModal: openModal} = uiStateActions;

    const layersToShow = useMemo(() => {
      return layerOrder.reduce((acc, layerId) => {
        const layer = findById(layerId)(layers);
        if (!layer) {
          return acc;
        }
        return !layer.config.hidden ? [...acc, layer] : acc;
      }, [] as Layer[]);
    }, [layers, layerOrder]);

    const sidePanelDndItems = useMemo(() => {
      return layersToShow.map(({id}) => id);
    }, [layersToShow]);

    const layerTypeOptions = useMemo(
      () =>
        Object.keys(layerClasses).map(key => {
          const layer = new layerClasses[key]();
          return {
            id: key,
            label: layer.name,
            icon: layer.layerIcon,
            requireData: layer.requireData
          };
        }),
      [layerClasses]
    );

    const layerActions = {
      layerColorUIChange: visStateActions.layerColorUIChange,
      layerConfigChange: visStateActions.layerConfigChange,
      layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
      layerTypeChange: visStateActions.layerTypeChange,
      layerVisConfigChange: visStateActions.layerVisConfigChange,
      layerTextLabelChange: visStateActions.layerTextLabelChange,
      removeLayer: visStateActions.removeLayer,
      duplicateLayer: visStateActions.duplicateLayer,
      layerSetIsValid: visStateActions.layerSetIsValid
    };

    const panelProps = {
      datasets,
      openModal,
      layerTypeOptions
    };

    return isSortable ? (
      <>
        <SortableList containerId="sortablelist" sidePanelDndItems={sidePanelDndItems}>
          {/* warning: containerId should be similar to the first key in dndItems defined in kepler-gl.js*/}

          {layersToShow.map(layer => (
            <SortableItem
              key={layer.id}
              layer={layer}
              layerIndex={layers.findIndex(({id}) => id === layer.id)}
              panelProps={panelProps}
              layerActions={layerActions}
            />
          ))}
        </SortableList>
      </>
    ) : (
      <>
        {layersToShow.map(layer => (
          <LayerPanel
            {...panelProps}
            {...layerActions}
            key={layer.id}
            layer={layer}
            isDraggable={false}
          />
        ))}
      </>
    );
  };
  return LayerList;
}
export default LayerListFactory;
