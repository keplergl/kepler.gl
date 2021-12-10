import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {arrayMove} from 'utils/data-utils';
import styled from 'styled-components';
import {createSelector} from 'reselect';
import classnames from 'classnames';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import LayerPanelFactory from './layer-panel';

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

function LayerListFactory(LayerPanel) {
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

  const LayerList = props => {
    const {
      layers,
      datasets,
      layerOrder,
      uiStateActions,
      visStateActions,
      layerClasses,
      isSortable
    } = props;
    const {toggleModal: openModal} = uiStateActions;
    const [isSorting, setIsSorting] = useState(false);

    const layerClassSelector = () => layerClasses;
    const layerTypeOptionsSelector = createSelector(layerClassSelector, layerCls =>
      Object.keys(layerCls).map(key => {
        const layer = new layerCls[key]();
        return {
          id: key,
          label: layer.name,
          icon: layer.layerIcon,
          requireData: layer.requireData
        };
      })
    );

    const layerTypeOptions = layerTypeOptionsSelector(props);

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

    const _handleSort = ({oldIndex, newIndex}) => {
      visStateActions.reorderLayer(arrayMove(props.layerOrder, oldIndex, newIndex));
      setIsSorting(false);
    };

    const _onSortStart = () => {
      setIsSorting(true);
    };

    const _updateBeforeSortStart = ({index}) => {
      const layerIdx = layerOrder[index];
      if (layers[layerIdx].config.isConfigActive) {
        visStateActions.layerConfigChange(layers[layerIdx], {isConfigActive: false});
      }
    };

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
            !layers[layerIdx].config.hidden && (
              <SortableItem key={`layer-${layerIdx}`} index={index} isSorting={isSorting}>
                <LayerPanel
                  {...panelProps}
                  {...layerActions}
                  sortData={layerIdx}
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
            !layers[layerIdx].config.hidden && (
              <LayerPanel
                {...panelProps}
                {...layerActions}
                sortData={layerIdx}
                key={layers[layerIdx].id}
                idx={layerIdx}
                layer={layers[layerIdx]}
              />
            )
        )}
      </>
    );
  };

  LayerList.propTypes = {
    datasets: PropTypes.object.isRequired,
    layerClasses: PropTypes.object.isRequired,
    layers: PropTypes.arrayOf(PropTypes.any).isRequired,
    visStateActions: PropTypes.object.isRequired,
    layerOrder: PropTypes.arrayOf(PropTypes.any).isRequired,
    uiStateActions: PropTypes.object.isRequired,
    isSortable: PropTypes.bool.isRequired
  };

  return LayerList;
}

export default LayerListFactory;
