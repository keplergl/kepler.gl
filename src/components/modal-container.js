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
import {css} from 'styled-components';
import {findDOMNode} from 'react-dom';
import {Blob, URL} from 'global/window';
import document from 'global/document';

import ModalDialog from './common/modal';
import {formatCsv} from 'processors/data-processor';

// modals
import DeleteDatasetModalFactory from './modals/delete-data-modal';
import IconInfoModalFactory from './modals/icon-info-modal';
import DataTableModalFactory from './modals/data-table-modal';
import LoadDataModalFactory from './modals/load-data-modal';
import ExportImageModalFactory from './modals/export-image-modal';
import ExportDataModalFactory from './modals/export-data-modal';
import AddMapStyleModalFactory from './modals/add-map-style-modal';

import {
  ADD_DATA_ID,
  DATA_TABLE_ID,
  DEFAULT_EXPORT_IMAGE_NAME,
  DELETE_DATA_ID,
  EXPORT_DATA_ID,
  EXPORT_DATA_TYPE,
  EXPORT_IMAGE_ID,
  ADD_MAP_STYLE_ID
} from 'constants/default-settings';

const propTypes = {
  rootNode: PropTypes.object,
  containerW: PropTypes.number,
  containerH: PropTypes.number,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  mapState: PropTypes.object.isRequired,
  mapStyle: PropTypes.object.isRequired,
  uiState: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
  visStateActions: PropTypes.object.isRequired,
  uiStateActions: PropTypes.object.isRequired,
  mapStyleActions: PropTypes.object.isRequired
};

const DataTableModalStyle = css`
  height: 85%;
  width: 90%;
  top: 80px;
  padding: 32px 0 0 0;
  max-width: unset;
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
  IconInfoModalFactory,
  DataTableModalFactory,
  LoadDataModalFactory,
  ExportImageModalFactory,
  ExportDataModalFactory,
  AddMapStyleModalFactory
];

export default function ModalContainerFactory(
  DeleteDatasetModal,
  IconInfoModal,
  DataTableModal,
  LoadDataModal,
  ExportImageModal,
  ExportDataModal,
  AddMapStyleModal
) {
  class ModalWrapper extends Component {
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
        const link = document.createElement('a');
        link.download = DEFAULT_EXPORT_IMAGE_NAME;
        link.href = imageDataUri;
        link.click();
      }
      this.props.uiStateActions.cleanupExportImage();
      this._closeModal();
    };

    _onExportData = () => {
      const {datasets} = this.props.visState;
      const {selectedDataset, dataType, filtered} = this.props.uiState.exportData;
      // get the selected data
      const filename = 'kepler-gl';
      const selectedData = datasets[selectedDataset];
      if (!selectedData) {
        // error: selected dataset not found.
        this._closeModal();
      }
      const {allData, data, fields, label} = selectedData;
      const exportData = filtered ? data : allData;
      // start to export data according to selected data type
      switch (dataType) {
        case EXPORT_DATA_TYPE.CSV: {
          const type = 'text/csv';
          const csv = formatCsv(exportData, fields);
          const csvFile = new Blob([csv], {type});
          const url = URL.createObjectURL(csvFile);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `${filename}_${label}.csv`);
          link.click();
          URL.revokeObjectURL(url);
          break;
        }
        // TODO: support more different data type later.
        default:
        break;
      }
      this._closeModal();
    };

    render() {
      const {
        containerW,
        containerH,
        mapStyle,
        uiState,
        visState,
        rootNode,
        visStateActions
      } = this.props;
      const {currentModal, datasetKeyToRemove} = uiState;
      const {datasets, layers, editingDataset} = visState;

      let template = null;
      let modalProps = {};

      switch (currentModal) {
        case 'iconInfo':
          template = <IconInfoModal />;
          modalProps.title = 'How to draw icons';
          break;

        case DATA_TABLE_ID:
          template = (
            <DataTableModal
              width={containerW * 0.9}
              height={containerH * 0.85}
              datasets={datasets}
              dataId={editingDataset}
              showDatasetTable={visStateActions.showDatasetTable}
            />
          );
          modalProps.cssStyle = DataTableModalStyle;
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
          const {ratio, legend, resolution, exporting, imageDataUri} = uiState.exportImage;
          template = (
            <ExportImageModal
              width={containerW}
              height={containerH}
              legend={legend}
              ratio={ratio}
              resolution={resolution}
              exporting={exporting}
              imageDataUri={imageDataUri}
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
              children: 'Export'
            }
          };
          break;

        case EXPORT_DATA_ID:
          const {selectedDataset, dataType, filtered} = uiState.exportData;
          template = (
            <ExportDataModal
              datasets={datasets}
              selectedDataset={selectedDataset}
              dataType={dataType}
              filtered={filtered}
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

        case ADD_MAP_STYLE_ID:
          template = (
            <AddMapStyleModal
              mapboxApiAccessToken={this.props.mapboxApiAccessToken}
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
  }

  ModalWrapper.propTypes = propTypes;

  return ModalWrapper;
}
