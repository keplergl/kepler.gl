// Copyright (c) 2018 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import document from 'global/document';
import {Blob, URL} from 'global/window';

import Sidebar from './side-panel/side-bar';
import PanelHeaderFactory from './side-panel/panel-header';
import LayerManager from './side-panel/layer-manager';
import FilterManager from './side-panel/filter-manager';
import InteractionManager from './side-panel/interaction-manager';
import MapManager from './side-panel/map-manager';
import PanelToggle from './side-panel/panel-toggle';
import {formatCsv} from 'processors/data-processor';

import {
  PANELS,
  DATA_TABLE_ID,
  ADD_DATA_ID
} from 'constants/default-settings';

const propTypes = {
  filters: PropTypes.array.isRequired,
  interactionConfig: PropTypes.object.isRequired,
  layerBlending: PropTypes.string.isRequired,
  layers: PropTypes.array.isRequired,
  mapStyle: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  datasets: PropTypes.object.isRequired,
  visStateActions: PropTypes.object.isRequired,
  mapStyleActions: PropTypes.object.isRequired
};

const SidePanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  flex-grow: 1;
  padding: 16px;
  overflow-y: overlay;
`;

const PanelTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1.25px;
  margin-bottom: 14px;
`;

SidePanelFactory.deps = [PanelHeaderFactory];

/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */
export default function SidePanelFactory(PanelHeader) {

  class SidePanel extends Component {
    /* component private functions */
    _onOpenOrClose = () => {
      this.props.uiStateActions.toggleSidePanel(
        this.props.uiState.activeSidePanel ? null : 'layer'
      );
    };

    _showDatasetTable = dataId => {
      // this will open data table modal
      this.props.visStateActions.showDatasetTable(dataId);
      this.props.uiStateActions.toggleModal(DATA_TABLE_ID);
    };

    _showAddDataModal = () => {
      this.props.uiStateActions.toggleModal(ADD_DATA_ID);
    };

    _removeDataset = key => {
      // this will show the modal dialog to confirm deletion
      this.props.uiStateActions.openDeleteModal(key);
    };

    _onDownloadCsv = () => {
      const filename = 'kepler-gl';

      // save multiple csv
      Object.values(this.props.datasets).forEach(({data, fields, label}) => {
        const type = 'text/csv';
        const csv = formatCsv(data, fields);
        const csvFile = new Blob([csv], {type});
        const url = URL.createObjectURL(csvFile);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${label}.csv`);
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    render() {
      const {
        appName,
        version,
        datasets,
        filters,
        layers,
        layerBlending,
        uiState,
        layerOrder,
        interactionConfig,
        visStateActions,
        mapStyleActions,
        uiStateActions
      } = this.props;
      const {activeSidePanel} = uiState;
      const isOpen = Boolean(activeSidePanel);

      const layerManagerActions = {
        addLayer: visStateActions.addLayer,
        layerConfigChange: visStateActions.layerConfigChange,
        layerVisualChannelConfigChange:
        visStateActions.layerVisualChannelConfigChange,
        layerTypeChange: visStateActions.layerTypeChange,
        layerVisConfigChange: visStateActions.layerVisConfigChange,
        updateLayerBlending: visStateActions.updateLayerBlending,
        updateLayerOrder: visStateActions.reorderLayer,
        showDatasetTable: this._showDatasetTable,
        showAddDataModal: this._showAddDataModal,
        removeLayer: visStateActions.removeLayer,
        removeDataset: this._removeDataset
      };

      const filterManagerActions = {
        addFilter: visStateActions.addFilter,
        removeFilter: visStateActions.removeFilter,
        setFilter: visStateActions.setFilter,
        showDatasetTable: this._showDatasetTable,
        showAddDataModal: this._showAddDataModal,
        toggleAnimation: visStateActions.toggleAnimation,
        enlargeFilter: visStateActions.enlargeFilter
      };

      const interactionManagerActions = {
        onConfigChange: visStateActions.interactionConfigChange
      };

      const mapManagerActions = {
        onConfigChange: mapStyleActions.mapConfigChange,
        onStyleChange: mapStyleActions.mapStyleChange,
        onBuildingChange: mapStyleActions.mapBuildingChange
      };

      return (
        <div>
          <Sidebar
            width={this.props.width}
            isOpen={isOpen}
            minifiedWidth={0}
            onOpenOrClose={this._onOpenOrClose}
          >
            <PanelHeader
              appName={appName}
              version={version}
              onDownloadData={this._onDownloadCsv}
              onSaveMap={this.props.onSaveMap}
            />
            <PanelToggle
              panels={PANELS}
              activePanel={activeSidePanel}
              togglePanel={uiStateActions.toggleSidePanel}
            />
            <SidePanelContent className="side-panel__content">
              <div>
                <PanelTitle className="side-panel__content__title">
                  {(PANELS.find(({id}) => id === activeSidePanel) || {}).label}
                </PanelTitle>
                {activeSidePanel === 'layer' && (
                  <LayerManager
                    {...layerManagerActions}
                    datasets={datasets}
                    layers={layers}
                    layerOrder={layerOrder}
                    layerBlending={layerBlending}
                    openModal={uiStateActions.toggleModal}
                  />
                )}
                {activeSidePanel === 'filter' && (
                  <FilterManager
                    {...filterManagerActions}
                    datasets={datasets}
                    filters={filters}
                  />
                )}
                {activeSidePanel === 'interaction' && (
                  <InteractionManager
                    {...interactionManagerActions}
                    datasets={datasets}
                    interactionConfig={interactionConfig}
                  />
                )}
                {activeSidePanel === 'map' && (
                  <MapManager
                    {...mapManagerActions}
                    mapStyle={this.props.mapStyle}
                  />
                )}
              </div>
            </SidePanelContent>
          </Sidebar>
        </div>
      );
    }
  }

  SidePanel.propTypes = propTypes;

  return SidePanel;
}
