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

import React, {Component, useCallback} from 'react';

import {injectIntl, WrappedComponentProps} from 'react-intl';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import LayerListFactory from './layer-panel/layer-list';
import DatasetLayerGroupFactory from './layer-panel/dataset-layer-group';
import PanelViewListToggleFactory from './panel-view-list-toggle';
import PanelTitleFactory from './panel-title';
import DatasetSectionFactory from './layer-panel/dataset-section';
import AddLayerButtonFactory from './layer-panel/add-layer-button';

import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel, SidePanelDivider, SidePanelSection} from '../common/styled-components';
import InfoHelperFactory from '../common/info-helper';

import {LAYER_BLENDINGS, OVERLAY_BLENDINGS, PANEL_VIEW_TOGGLES} from '@kepler.gl/constants';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {UIStateActions, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {SidePanelItem} from '../types';
import {PanelListView} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';

type LayerBlendingSelectorProps = {
  layerBlending: string;
  updateLayerBlending: ActionHandler<typeof VisStateActions.updateLayerBlending>;
} & WrappedComponentProps;

type OverlayBlendingSelectorProps = {
  overlayBlending: string;
  updateOverlayBlending: ActionHandler<typeof VisStateActions.updateOverlayBlending>;
  infoHelper: React.ReactNode;
} & WrappedComponentProps;

type LayerManagerProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: string[];
  layerClasses: LayerClassesType;
  layerBlending: string;
  overlayBlending: string;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  showAddDataModal: () => void;
  removeDataset: ActionHandler<typeof UIStateActions.openDeleteModal>;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  panelListView: PanelListView;
  panelMetadata: SidePanelItem;
} & WrappedComponentProps;

const LayerBlendingSelector = React.memo(
  ({layerBlending, updateLayerBlending, intl}: LayerBlendingSelectorProps) => {
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
  }
);
LayerBlendingSelector.displayName = 'LayerBlendingSelector';

const InfoHelperWrapper = styled.div`
  float: right;
`;

const OverlayBlendingSelectorTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OverlayBlendingSelector = React.memo(
  ({overlayBlending, updateOverlayBlending, intl, infoHelper}: OverlayBlendingSelectorProps) => {
    const labeledOverlayBlendings = Object.keys(OVERLAY_BLENDINGS).reduce(
      (acc, current) => ({
        ...acc,
        [intl.formatMessage({id: OVERLAY_BLENDINGS[current].label})]: current
      }),
      {}
    );

    const onChange = useCallback(
      blending => updateOverlayBlending(labeledOverlayBlendings[blending]),
      [updateOverlayBlending, labeledOverlayBlendings]
    );

    return (
      <SidePanelSection>
        <OverlayBlendingSelectorTitleRow>
          <PanelLabel>
            <FormattedMessage id="overlayBlending.title" />
          </PanelLabel>
          <InfoHelperWrapper>{infoHelper}</InfoHelperWrapper>
        </OverlayBlendingSelectorTitleRow>
        <ItemSelector
          selectedItems={intl.formatMessage({id: OVERLAY_BLENDINGS[overlayBlending].label})}
          options={Object.keys(labeledOverlayBlendings)}
          multiSelect={false}
          searchable={false}
          onChange={onChange}
        />
      </SidePanelSection>
    );
  }
);
OverlayBlendingSelector.displayName = 'OverlayBlendingSelector';

LayerManagerFactory.deps = [
  LayerListFactory,
  DatasetLayerGroupFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  DatasetSectionFactory,
  AddLayerButtonFactory,
  InfoHelperFactory
];

function LayerManagerFactory(
  LayerList: ReturnType<typeof LayerListFactory>,
  DatasetLayerGroup: ReturnType<typeof DatasetLayerGroupFactory>,
  PanelViewListToggle: ReturnType<typeof PanelViewListToggleFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>,
  DatasetSection: ReturnType<typeof DatasetSectionFactory>,
  AddLayerButton: ReturnType<typeof AddLayerButtonFactory>,
  InfoHelper: ReturnType<typeof InfoHelperFactory>
) {
  class LayerManager extends Component<LayerManagerProps> {
    _addLayer = (dataset: string) => {
      const {visStateActions} = this.props;
      visStateActions.addLayer(undefined, dataset);
    };

    _togglePanelListView = (listView: string) => {
      const {uiStateActions} = this.props;
      uiStateActions.togglePanelListView({panelId: 'layer', listView});
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
        panelListView,
        panelMetadata
      } = this.props;

      const isSortByDatasetMode = panelListView === PANEL_VIEW_TOGGLES.byDataset;

      return (
        <div className="layer-manager">
          <SidePanelSection>
            <PanelViewListToggle
              togglePanelListView={this._togglePanelListView}
              mode={panelListView}
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
          />
          <SidePanelDivider />
          <SidePanelSection>
            <PanelTitle
              className="layer-manager-title"
              title={intl.formatMessage({id: panelMetadata.label})}
            >
              <AddLayerButton datasets={datasets} onAdd={this._addLayer} />
            </PanelTitle>
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
          <OverlayBlendingSelector
            overlayBlending={this.props.overlayBlending}
            updateOverlayBlending={visStateActions.updateOverlayBlending}
            intl={intl}
            infoHelper={
              <InfoHelper
                id={`overlayBlending-description`}
                description={'overlayBlending.description'}
              />
            }
          />
        </div>
      );
    }
  }
  return injectIntl(LayerManager);
}

export default LayerManagerFactory;
