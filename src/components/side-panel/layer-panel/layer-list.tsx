// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import LayerPanelFactory from './layer-panel';
import {Layer, LayerClassesType, arrayMove} from '@kepler.gl/layers';
import * as UiStateActions from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import {Datasets} from 'reducers/table-utils/kepler-table';

type LayerListProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: number[];
  layerClasses: LayerClassesType;
  isSortable?: boolean;
  uiStateActions: typeof UiStateActions;
  visStateActions: typeof VisStateActions;
};

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
const SortableStyledItem = styled.div`
  z-index: ${props => props.theme.dropdownWrapperZ + 1};
  &.sorting {
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
  const SortableItem = SortableElement(({children, isSorting}) => {
    return (
      <SortableStyledItem className={classnames('sortable-layer-items', {sorting: isSorting})}>
        {children}
      </SortableStyledItem>
    );
  });

  const WrappedSortableContainer = SortableContainer(({children}) => {
    return <div>{children}</div>;
  });

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
    const [isSorting, setIsSorting] = useState(false);
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
      duplicateLayer: visStateActions.duplicateLayer
    };

    const panelProps = {
      datasets,
      openModal,
      layerTypeOptions
    };

    const _handleSort = useCallback(
      ({oldIndex, newIndex}) => {
        visStateActions.reorderLayer(arrayMove(props.layerOrder, oldIndex, newIndex));
        setIsSorting(false);
      },
      [props.layerOrder, visStateActions]
    );
    const _onSortStart = useCallback(() => {
      setIsSorting(true);
    }, []);
    const _updateBeforeSortStart = useCallback(() => {
      ({index}) => {
        const layerIdx = layerOrder[index];
        if (layers[layerIdx].config.isConfigActive) {
          visStateActions.layerConfigChange(layers[layerIdx], {isConfigActive: false});
        }
      };
    }, [layers, layerOrder, visStateActions]);
    return isSortable ? (
      <WrappedSortableContainer
        onSortEnd={_handleSort}
        onSortStart={_onSortStart}
        updateBeforeSortStart={_updateBeforeSortStart}
        lockAxis="y"
        helperClass="sorting-layers"
        useDragHandle
      >
        {layerOrder.map(
          (layerIdx, index) =>
            layers[layerIdx] &&
            !layers[layerIdx].config.hidden && (
              <SortableItem key={`layer-${layerIdx}`} index={index} isSorting={isSorting}>
                <LayerPanel
                  {...panelProps}
                  {...layerActions}
                  key={layers[layerIdx].id}
                  idx={layerIdx}
                  layer={layers[layerIdx]}
                />
              </SortableItem>
            )
        )}
      </WrappedSortableContainer>
    ) : (
      <>
        {layerOrder.map(
          (layerIdx, index) =>
            layers[layerIdx] &&
            !layers[layerIdx].config.hidden && (
              <LayerPanel
                {...panelProps}
                {...layerActions}
                key={layers[layerIdx].id}
                idx={layerIdx}
                layer={layers[layerIdx]}
                isDraggable={false}
              />
            )
        )}
      </>
    );
  };
  return LayerList;
}
export default LayerListFactory;
