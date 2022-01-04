// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {Component, useCallback} from 'react';

import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';
import styled from 'styled-components';

import LayerListFactory from './layer-panel/layer-list';
import DatasetLayerGroupFactory from './layer-panel/dataset-layer-group';
import PanelViewListToggleFactory from './layer-panel/panel-view-list-toggle';
import PanelTitleFactory from './panel-title';
import DatasetSectionFactory from './layer-panel/dataset-section';

import {Add} from 'components/common/icons';
import ItemSelector from 'components/common/item-selector/item-selector';
import DropdownList from 'components/common/item-selector/dropdown-list';
import Tippy from '@tippyjs/react';
import {
  Button,
  PanelLabel,
  SidePanelDivider,
  SidePanelSection
} from 'components/common/styled-components';

import {LAYER_BLENDINGS} from 'constants/default-settings';

const LayerHeader = styled.div.attrs({
  className: 'layer-manager-header'
})`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 16px;
`;

const LayerBlendingSelector = ({layerBlending, updateLayerBlending, intl}) => {
  const labeledLayerBlendings = Object.keys(LAYER_BLENDINGS).reduce(
    (acc, current) => ({
      ...acc,
      [intl.formatMessage({id: LAYER_BLENDINGS[current].label})]: current
    }),
    {}
  );

  const onChange = useCallback(blending => updateLayerBlending(labeledLayerBlendings[blending]), [
    updateLayerBlending,
    labeledLayerBlendings
  ]);

  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id="layerBlending.title" />
      </PanelLabel>
      <ItemSelector
        selectedItems={intl.formatMessage({id: LAYER_BLENDINGS[layerBlending].label})}
        options={Object.keys(labeledLayerBlendings)}
        multiSelect={false}
        searchable={false}
        onChange={onChange}
      />
    </SidePanelSection>
  );
};

const DropdownContainer = styled.div`
  .list-selector {
    border-top: 0;
    width: max-content;
    padding: 8px 0;
    /* disable scrolling, currently set to 280px internally */
    max-height: unset;
  }

  .list__header {
    padding: 8px 20px;
  }

  .list__item {
    padding: 8px 20px;

    &:hover {
      background: ${props => `${props.theme.PURPLE2}22`};
    }
    &:hover > div {
      color: ${props => props.theme.PURPLE2};
    }
  }

  .list__item > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    line-height: 18px;
    padding: 0;

    svg {
      margin-right: 10px;
    }
  }
`;

const AddLayerMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 100%;
  left: -53px;
  z-index: 5;
`;

LayerManagerFactory.deps = [
  LayerListFactory,
  DatasetLayerGroupFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  DatasetSectionFactory
];

function LayerManagerFactory(
  LayerList,
  DatasetLayerGroup,
  PanelViewListToggle,
  PanelTitle,
  DatasetSection
) {
  class LayerManager extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layerClasses: PropTypes.object.isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      visStateActions: PropTypes.object.isRequired,
      // functions
      removeDataset: PropTypes.func.isRequired,
      showDatasetTable: PropTypes.func.isRequired,
      updateTableColor: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {showAddLayerDropdown: false};
    }

    _addEmptyNewLayer = (dataset, event) => {
      // DropdownList executes onClick handler on both onClick and onMouseDown events
      // so we need to execute this handler only on click
      if (event.type === 'click') {
        const {visStateActions} = this.props;
        visStateActions.addLayer(undefined, dataset.id);
      }
    };

    toggleAddLayerDropdown = () => {
      this.setState((state, props) => ({
        showAddLayerDropdown: !state.showAddLayerDropdown
      }));
    };

    render() {
      const {
        layers,
        datasets,
        intl,
        layerOrder,
        showAddDataModal,
        updateTableColor,
        showDatasetTable,
        removeDataset,
        uiStateActions,
        visStateActions,
        layerPanelListView,
        panelMetadata
      } = this.props;

      const defaultDataset = Object.keys(datasets)[0];
      const isSortByDatasetMode = layerPanelListView === 'sortByDataset';

      return (
        <div className="layer-manager">
          <SidePanelSection>
            <PanelViewListToggle />
          </SidePanelSection>
          <DatasetSection
            datasets={datasets}
            showDatasetTable={showDatasetTable}
            updateTableColor={updateTableColor}
            removeDataset={removeDataset}
            showDeleteDataset
            showDatasetList={!isSortByDatasetMode}
            showAddDataModal={showAddDataModal}
            defaultDataset={defaultDataset}
          />
          <SidePanelDivider />
          <SidePanelSection>
            <LayerHeader>
              <PanelTitle className="layer-manager-title">
                <FormattedMessage id={panelMetadata.label} />
              </PanelTitle>
              {defaultDataset ? (
                <Tippy
                  visible={this.state.showAddLayerDropdown}
                  arrow={false}
                  interactive
                  placement="bottom"
                  appendTo="parent"
                  duration={0}
                  content={
                    <div>
                      <AddLayerMenu>
                        <DropdownContainer>
                          <DropdownList
                            displayOption={d => d.label}
                            options={Object.values(datasets)}
                            onOptionSelected={(dataset, event) =>
                              this._addEmptyNewLayer(dataset, event)
                            }
                          />
                        </DropdownContainer>
                      </AddLayerMenu>
                    </div>
                  }
                >
                  <Button
                    tabIndex={-1}
                    onBlur={this.toggleAddLayerDropdown}
                    className="add-layer-button"
                    width="105px"
                    onClick={this.toggleAddLayerDropdown}
                  >
                    <Add height="12px" />
                    <FormattedMessage id={'layerManager.addLayer'} />
                  </Button>
                </Tippy>
              ) : null}
            </LayerHeader>
          </SidePanelSection>
          <SidePanelSection>
            {isSortByDatasetMode ? (
              <DatasetLayerGroup
                datasets={datasets}
                showDatasetTable={showDatasetTable}
                layers={layers}
                updateTableColor={updateTableColor}
                removeDataset={removeDataset}
                layerOrder={layerOrder}
                layerClasses={this.props.layerClasses}
                uiStateActions={uiStateActions}
                visStateActions={visStateActions}
                showDeleteDataset
              />
            ) : (
              <LayerList
                layers={layers}
                datasets={datasets}
                layerOrder={layerOrder}
                uiStateActions={uiStateActions}
                visStateActions={visStateActions}
                layerClasses={this.props.layerClasses}
              />
            )}
          </SidePanelSection>
          <LayerBlendingSelector
            layerBlending={this.props.layerBlending}
            updateLayerBlending={visStateActions.updateLayerBlending}
            intl={intl}
          />
        </div>
      );
    }
  }
  return injectIntl(LayerManager);
}

export default LayerManagerFactory;
