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

import React, {Component, useCallback} from 'react';

import {injectIntl, WrappedComponentProps} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import styled from 'styled-components';

import LayerListFactory from './layer-panel/layer-list';
import DatasetLayerGroupFactory from './layer-panel/dataset-layer-group';
import PanelViewListToggleFactory from './layer-panel/panel-view-list-toggle';
import PanelTitleFactory from './panel-title';
import DatasetSectionFactory from './layer-panel/dataset-section';
import AddLayerButtonFactory from './layer-panel/add-layer-button';

import ItemSelector from 'components/common/item-selector/item-selector';
import {PanelLabel, SidePanelDivider, SidePanelSection} from 'components/common/styled-components';

import {LAYER_BLENDINGS} from '@kepler.gl/constants';
import {Datasets} from '../../utils';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import * as UiStateActions from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import {SidePanelItem} from 'components/types';
import {LayerPanelListView} from 'reducers/ui-state-updaters';
import {ActionHandler} from 'actions';

type LayerBlendingSelectorProps = {
  layerBlending: string;
  updateLayerBlending: ActionHandler<typeof VisStateActions.updateLayerBlending>;
} & WrappedComponentProps;

type LayerManagerProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: number[];
  layerClasses: LayerClassesType;
  layerBlending: string;
  uiStateActions: typeof UiStateActions;
  visStateActions: typeof VisStateActions;
  showAddDataModal: () => void;
  removeDataset: ActionHandler<typeof UiStateActions.openDeleteModal>;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  layerPanelListView: LayerPanelListView;
  panelMetadata: SidePanelItem;
} & WrappedComponentProps;

const LayerHeader = styled.div.attrs({
  className: 'layer-manager-header'
})`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 16px;
`;

const LayerBlendingSelector = ({
  layerBlending,
  updateLayerBlending,
  intl
}: LayerBlendingSelectorProps) => {
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

LayerManagerFactory.deps = [
  LayerListFactory,
  DatasetLayerGroupFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  DatasetSectionFactory,
  AddLayerButtonFactory
];

function LayerManagerFactory(
  LayerList: ReturnType<typeof LayerListFactory>,
  DatasetLayerGroup: ReturnType<typeof DatasetLayerGroupFactory>,
  PanelViewListToggle: ReturnType<typeof PanelViewListToggleFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>,
  DatasetSection: ReturnType<typeof DatasetSectionFactory>,
  AddLayerButton: ReturnType<typeof AddLayerButtonFactory>
) {
  class LayerManager extends Component<LayerManagerProps> {
    _addEmptyNewLayer = (dataset: string) => {
      const {visStateActions} = this.props;
      visStateActions.addLayer(undefined, dataset);
    };

    _toggleLayerPanelListView = (listView: string) => {
      const {uiStateActions} = this.props;
      uiStateActions.toggleLayerPanelListView(listView);
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
            <PanelViewListToggle
              toggleLayerPanelListView={this._toggleLayerPanelListView}
              layerPanelListViewMode={layerPanelListView}
            />
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
                // TODO replace ignore
                // @ts-ignore
                <AddLayerButton
                  datasets={datasets}
                  typeaheadPlaceholder="Search datasets"
                  intl={intl}
                  onOptionSelected={this._addEmptyNewLayer}
                />
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
              // TODO replace ignore
              // @ts-ignore
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
