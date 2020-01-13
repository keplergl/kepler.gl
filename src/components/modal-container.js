// Copyright (c) 2020 Uber Technologies, Inc.
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
import {css} from 'styled-components';
import {findDOMNode} from 'react-dom';
import {Blob} from 'global/window';

import ModalDialogFactory from './modals/modal-dialog';
import {formatCsv} from 'processors/data-processor';
import KeplerGlSchema from 'schemas';
import {downloadFile, dataURItoBlob} from 'utils/export-image-utils';
// modals
import DeleteDatasetModalFactory from './modals/delete-data-modal';
import DataTableModalFactory from './modals/data-table-modal';
import LoadDataModalFactory from './modals/load-data-modal';
import ExportImageModalFactory from './modals/export-image-modal';
import ExportDataModalFactory from './modals/export-data-modal';
import ExportMapModalFactory from './modals/export-map-modal/export-map-modal';
import AddMapStyleModalFactory from './modals/add-map-style-modal';

// Breakpoints
import {media} from 'styles/media-breakpoints';

// Template
import {exportMapToHTML} from 'templates/export-map-html';
import {
  ADD_DATA_ID,
  DATA_TABLE_ID,
  DEFAULT_EXPORT_IMAGE_NAME,
  DELETE_DATA_ID,
  EXPORT_DATA_ID,
  EXPORT_DATA_TYPE,
  EXPORT_IMAGE_ID,
  EXPORT_MAP_ID,
  ADD_MAP_STYLE_ID
} from 'constants/default-settings';
import {EXPORT_MAP_FORMATS} from '../constants/default-settings';

const DataTableModalStyle = css`
  top: 80px;
  padding: 32px 0 0 0;

  ${media.portable`
    padding: 0;
  `}

  ${media.palm`
    padding: 0;
    margin: 0 auto;
  `}
`;

const DeleteDatasetModalStyled = css`
  width: 40%;
  padding: 40px 40px 32px 40px;
`;

const LoadDataModalStyle = css`
  top: 60px;
`;

ModalContainerFactory.deps = [
  DeleteDatasetModalFactory,
  DataTableModalFactory,
  LoadDataModalFactory,
  ExportImageModalFactory,
  ExportDataModalFactory,
  ExportMapModalFactory,
  AddMapStyleModalFactory,
  ModalDialogFactory
];

export default function ModalContainerFactory(
  DeleteDatasetModal,
  DataTableModal,
  LoadDataModal,
  ExportImageModal,
  ExportDataModal,
  ExportMapModal,
  AddMapStyleModal,
  ModalDialog
) {
  class ModalWrapper extends Component {
    static propTypes = {
      rootNode: PropTypes.object,
      containerW: PropTypes.number,
      containerH: PropTypes.number,
      mapboxApiAccessToken: PropTypes.string.isRequired,
      mapboxApiUrl: PropTypes.string,
      mapState: PropTypes.object.isRequired,
      mapStyle: PropTypes.object.isRequired,
      uiState: PropTypes.object.isRequired,
      visState: PropTypes.object.isRequired,
      visStateActions: PropTypes.object.isRequired,
      uiStateActions: PropTypes.object.isRequired,
      mapStyleActions: PropTypes.object.isRequired
    };

    _closeModal = () => {
      this.props.uiStateActions.toggleModal(null);
    };

    _deleteDataset = key => {
      this.props.visStateActions.removeDataset(key);
      this._closeModal();
    };

    _onAddCustomMapStyle = () => {
      this.props.mapStyleActions.addCustomMapStyle();
      this._closeModal();
    };

    _onFileUpload = blob => {
      this.props.visStateActions.loadFiles(blob);
    };

    _onExportImage = () => {
      const {exporting, imageDataUri} = this.props.uiState.exportImage;
      if (!exporting && imageDataUri) {
        const file = dataURItoBlob(imageDataUri);
        downloadFile(file, DEFAULT_EXPORT_IMAGE_NAME);
      }
      this.props.uiStateActions.cleanupExportImage();
      this._closeModal();
    };

    _downloadFile(data, type, filename) {
      const fileBlob = new Blob([data], {type});
      downloadFile(fileBlob, filename);
    }

    _onExportData = () => {
      const {visState, uiState} = this.props;
      const {datasets} = visState;
      const {selectedDataset, dataType, filtered} = uiState.exportData;
      // get the selected data
      const filename = 'kepler-gl';
      const selectedDatasets = datasets[selectedDataset] ?
        [datasets[selectedDataset]] : Object.values(datasets);

      if (!selectedDatasets.length) {
        // error: selected dataset not found.
        this._closeModal();
      }

      selectedDatasets.forEach(selectedData => {
        const {allData, fields, label, filteredIdxCPU = []} = selectedData;
        const exportData = filtered ? filteredIdxCPU.map(i => allData[i]) : allData;
        // start to export data according to selected data type
        switch (dataType) {
          case EXPORT_DATA_TYPE.CSV: {
            const type = 'text/csv';
            const csv = formatCsv(exportData, fields);
            this._downloadFile(csv, type, `${filename}_${label}.csv`);
            break;
          }
          // TODO: support more file types.
          default:
            break;
        }
      });

      this._closeModal();
    };

    _onExportJSONMap = () => {
      const {uiState} = this.props;
      const {hasData} = uiState.exportMap[EXPORT_MAP_FORMATS.JSON];

      // we pass all props because we avoid to create new variables
      const data = hasData ? KeplerGlSchema.save(this.props)
        : KeplerGlSchema.getConfigToSave(this.props);

      this._downloadFile(
        JSON.stringify(data, null, 2),
        'application/json',
        'keplergl.json'
      );

      this._closeModal();
    };

    _onExportHTMLMap = () => {
      const {uiState} = this.props;
      const {userMapboxToken, exportMapboxAccessToken, mode} = uiState.exportMap[EXPORT_MAP_FORMATS.HTML];

      const data = {
        ...KeplerGlSchema.save(this.props),
        mapboxApiAccessToken: (userMapboxToken || '') !== '' ? userMapboxToken : exportMapboxAccessToken,
        mode
      };

      this._downloadFile(
        exportMapToHTML(data),
        'text/html',
        'kepler.gl.html'
      );

      this._closeModal();
    };

    _onExportMap = () => {
      const {uiState} = this.props;
      const {format} = uiState.exportMap;

      const downloader = {
        [EXPORT_MAP_FORMATS.HTML]: this._onExportHTMLMap,
        [EXPORT_MAP_FORMATS.JSON]: this._onExportJSONMap
      }[format];

      downloader && downloader();
    };

    /* eslint-disable complexity */
    render() {
      const {
        containerW,
        containerH,
        mapStyle,
        mapState,
        uiState,
        visState,
        rootNode,
        visStateActions
      } = this.props;
      const {currentModal, datasetKeyToRemove} = uiState;
      const {datasets, layers, editingDataset} = visState;

      let template = null;
      let modalProps = {};

      if (currentModal && currentModal.id &&
        currentModal.template) {
        // if currentMdoal template is already provided
        // TODO: need to check whether template is valid
        template = (<currentModal.template/>);
        modalProps = currentModal.modalProps;
      } else {
        switch (currentModal) {
          case DATA_TABLE_ID:
            const width = containerW * 0.9;
            template = (
              <DataTableModal
                width={containerW * 0.9}
                height={containerH * 0.85}
                datasets={datasets}
                dataId={editingDataset}
                showDatasetTable={visStateActions.showDatasetTable}
              />
            );

            // TODO: we need to make this width consistent with the css rule defined modal.js:32 max-width: 70vw
            modalProps.cssStyle = css`
              ${DataTableModalStyle};
              ${media.palm`
                width: ${width}px;
              `}
            `;
            break;
          case DELETE_DATA_ID:
            // validate options
            if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
              template = (
                <DeleteDatasetModal
                  dataset={datasets[datasetKeyToRemove]}
                  layers={layers}
                />
              );

              modalProps = {
                title: 'Delete Dataset',
                cssStyle: DeleteDatasetModalStyled,
                footer: true,
                onConfirm: () => this._deleteDataset(datasetKeyToRemove),
                onCancel: this._closeModal,
                confirmButton: {
                  negative: true,
                  large: true,
                  children: 'Delete'
                }
              };
            }
            break; // in case we add a new case after this one
          case ADD_DATA_ID:
            template = (
              <LoadDataModal
                onClose={this._closeModal}
                onFileUpload={this._onFileUpload}
                {...uiState.loadFiles}
              />
            );
            modalProps = {
              title: 'Add Data To Map',
              cssStyle: LoadDataModalStyle,
              footer: false,
              onConfirm: this._closeModal
            };
            break;
          case EXPORT_IMAGE_ID:
            template = (
              <ExportImageModal
                {...uiState.exportImage}
                width={containerW}
                height={containerH}
                onChangeRatio={this.props.uiStateActions.setRatio}
                onChangeResolution={this.props.uiStateActions.setResolution}
                onToggleLegend={this.props.uiStateActions.toggleLegend}
              />
            );
            modalProps = {
              close: false,
              title: 'Export Image',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportImage,
              confirmButton: {
                large: true,
                disabled: uiState.exportImage.exporting,
                children: 'Download'
              }
            };
            break;
          case EXPORT_DATA_ID:
            template = (
              <ExportDataModal
                {...uiState.exportData}
                datasets={datasets}
                applyCPUFilter={this.props.visStateActions.applyCPUFilter}
                onClose={this._closeModal}
                onChangeExportDataType={this.props.uiStateActions.setExportDataType}
                onChangeExportSelectedDataset={this.props.uiStateActions.setExportSelectedDataset}
                onChangeExportFiltered={this.props.uiStateActions.setExportFiltered}
              />
            );
            modalProps = {
              close: false,
              title: 'Export Data',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportData,
              confirmButton: {
                large: true,
                children: 'Export'
              }
            };
            break;
          case EXPORT_MAP_ID:
            const keplerGlConfig = KeplerGlSchema.getConfigToSave(
              { mapStyle, visState, mapState, uiState }
            );
            template = (
              <ExportMapModal
                config={keplerGlConfig}
                options={uiState.exportMap}
                onChangeExportMapFormat={this.props.uiStateActions.setExportMapFormat}
                onEditUserMapboxAccessToken={this.props.uiStateActions.setUserMapboxAccessToken}
                onChangeExportMapHTMLMode={this.props.uiStateActions.setExportHTMLMapMode}
              />
            );
            modalProps = {
              close: false,
              title: 'Export Map',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportMap,
              confirmButton: {
                large: true,
                children: 'Export'
              }
            };
            break;
          case ADD_MAP_STYLE_ID:
            template = (
              <AddMapStyleModal
                mapboxApiAccessToken={this.props.mapboxApiAccessToken}
                mapboxApiUrl={this.props.mapboxApiUrl}
                mapState={this.props.mapState}
                inputStyle={mapStyle.inputStyle}
                inputMapStyle={this.props.mapStyleActions.inputMapStyle}
                loadCustomMapStyle={this.props.mapStyleActions.loadCustomMapStyle}
              />
            );
            modalProps = {
              close: false,
              title: 'Add Custom Mapbox Style',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onAddCustomMapStyle,
              confirmButton: {
                large: true,
                disabled: !mapStyle.inputStyle.style,
                children: 'Add Style'
              }
            };
            break;

          default:
            break;
        }
      }

      return this.props.rootNode ? (
        <ModalDialog
          {...modalProps}
          parentSelector={() => findDOMNode(rootNode)}
          isOpen={Boolean(currentModal)}
          close={this._closeModal}
        >
          {template}
        </ModalDialog>
      ) : null;
    }
    /* eslint-enable complexity */
  }

  return ModalWrapper;
}
