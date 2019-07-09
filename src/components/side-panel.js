// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SidebarFactory from './side-panel/side-bar';
import PanelHeaderFactory from './side-panel/panel-header';
import LayerManagerFactory from './side-panel/layer-manager';
import FilterManagerFactory from './side-panel/filter-manager';
import InteractionManagerFactory from './side-panel/interaction-manager';
import MapManagerFactory from './side-panel/map-manager';
import PanelToggleFactory from './side-panel/panel-toggle';

import {
  ADD_DATA_ID,
  ADD_MAP_STYLE_ID,
  DATA_TABLE_ID,
  EXPORT_IMAGE_ID,
  EXPORT_DATA_ID,
  EXPORT_MAP_ID,
  PANELS
} from 'constants/default-settings';

const SidePanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  flex-grow: 1;
  padding: 16px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const PanelTitleFactory = () => styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1.25px;
  margin-bottom: 14px;
`;

SidePanelFactory.deps = [
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  PanelTitleFactory,
  LayerManagerFactory,
  FilterManagerFactory,
  InteractionManagerFactory,
  MapManagerFactory
];

/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */
export default function SidePanelFactory(
  Sidebar,
  PanelHeader,
  PanelToggle,
  PanelTitle,
  LayerManager,
  FilterManager,
  InteractionManager,
  MapManager
) {

  return class SidePanel extends PureComponent {
    static propTypes = {
      filters: PropTypes.arrayOf(PropTypes.any).isRequired,
      interactionConfig: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      layerClasses: PropTypes.object.isRequired,
      mapStyle: PropTypes.object.isRequired,
      width: PropTypes.number.isRequired,
      datasets: PropTypes.object.isRequired,
      visStateActions: PropTypes.object.isRequired,
      mapStyleActions: PropTypes.object.isRequired
    };
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

    _showAddMapStyleModal = () => {
      this.props.uiStateActions.toggleModal(ADD_MAP_STYLE_ID);
    };

    _removeDataset = key => {
      // this will show the modal dialog to confirm deletion
      this.props.uiStateActions.openDeleteModal(key);
    };

    _onExportImage = () => this.props.uiStateActions.toggleModal(EXPORT_IMAGE_ID);

    _onExportData = () => this.props.uiStateActions.toggleModal(EXPORT_DATA_ID);

    _onExportMap = () => this.props.uiStateActions.toggleModal(EXPORT_MAP_ID);

    render() {
      const {
        appName,
        version,
        datasets,
        filters,
        layers,
        layerBlending,
        layerClasses,
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
        layerTextLabelChange: visStateActions.layerTextLabelChange,
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
        addMapStyleUrl: mapStyleActions.addMapStyleUrl,
        onConfigChange: mapStyleActions.mapConfigChange,
        onStyleChange: mapStyleActions.mapStyleChange,
        onBuildingChange: mapStyleActions.mapBuildingChange,
        set3dBuildingColor: mapStyleActions.set3dBuildingColor,
        showAddMapStyleModal: this._showAddMapStyleModal
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
              onExportImage={this._onExportImage}
              onExportData={this._onExportData}
              visibleDropdown={uiState.visibleDropdown}
              showExportDropdown={uiStateActions.showExportDropdown}
              hideExportDropdown={uiStateActions.hideExportDropdown}
              onExportMap={this._onExportMap}
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
                    layerClasses={layerClasses}
                    layerOrder={layerOrder}
                    layerBlending={layerBlending}
                    openModal={uiStateActions.toggleModal}
                    uiState={uiState}
                    uiStateActions={uiStateActions}
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
  };
}
