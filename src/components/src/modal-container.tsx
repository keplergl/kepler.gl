// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {css} from 'styled-components';
import get from 'lodash.get';
import document from 'global/document';

import ModalDialogFactory from './modals/modal-dialog';
import {exportHtml, exportMap, exportJson, exportImage} from '@kepler.gl/utils';
import {
  exportData,
  getFileFormatNames,
  getFileExtensions,
  MapStyle,
  ProviderState
} from '@kepler.gl/reducers';

// modals
import DeleteDatasetModalFactory from './modals/delete-data-modal';
import OverWriteMapModalFactory from './modals/overwrite-map-modal';
import DataTableModalFactory from './modals/data-table-modal';
import LoadDataModalFactory from './modals/load-data-modal';
import ExportImageModalFactory from './modals/export-image-modal';
import ExportDataModalFactory from './modals/export-data-modal';
import ExportMapModalFactory from './modals/export-map-modal/export-map-modal';
import AddMapStyleModalFactory from './modals/add-map-style-modal';
import SaveMapModalFactory from './modals/save-map-modal';
import ShareMapModalFactory from './modals/share-map-modal';

// Breakpoints
import {media} from '@kepler.gl/styles';

// Template
import {
  EXPORT_DATA_TYPE_OPTIONS,
  EXPORT_MAP_FORMATS,
  KeyEvent,
  ADD_DATA_ID,
  DATA_TABLE_ID,
  DELETE_DATA_ID,
  EXPORT_DATA_ID,
  EXPORT_IMAGE_ID,
  EXPORT_MAP_ID,
  ADD_MAP_STYLE_ID,
  SAVE_MAP_ID,
  SHARE_MAP_ID,
  OVERWRITE_MAP_ID
} from '@kepler.gl/constants';

import {MapState, UiState, OnSuccessCallBack, OnErrorCallBack} from '@kepler.gl/types';

import {
  VisStateActions,
  UIStateActions,
  MapStyleActions,
  ProviderActions
} from '@kepler.gl/actions';
import {ModalDialogProps} from './common/modal';
import {Provider} from '@kepler.gl/cloud-providers';
import {findDOMNode} from 'react-dom';
import {VisState} from '@kepler.gl/schemas';

const DataTableModalStyle = css`
  top: 70px;
  padding: 0;
  width: 90vw;
  max-width: 90vw;

  ${media.portable`
    padding: 0;
  `} ${media.palm`
    padding: 0;
    margin: 0 auto;
  `};
`;
const smallModalCss = css`
  width: 40%;
  padding: 40px 40px 32px 40px;
`;

const LoadDataModalStyle = css`
  top: 60px;
`;

const DefaultStyle = css`
  max-width: 960px;
`;

export type ModalContainerProps = {
  appName: string;
  rootNode: React.ReactInstance | null | undefined;
  containerW: number;
  containerH: number;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState: MapState;
  mapStyle: MapStyle;
  uiState: UiState;
  visState: VisState;
  providerState: ProviderState;
  visStateActions: typeof VisStateActions;
  uiStateActions: typeof UIStateActions;
  mapStyleActions: typeof MapStyleActions;
  providerActions: typeof ProviderActions;
  onSaveToStorage?: () => void;
  cloudProviders: Provider[];
  onLoadCloudMapSuccess?: OnSuccessCallBack;
  onLoadCloudMapError?: OnErrorCallBack;
  onExportToCloudSuccess?: OnSuccessCallBack;
  onExportToCloudError?: OnErrorCallBack;
};

ModalContainerFactory.deps = [
  DeleteDatasetModalFactory,
  OverWriteMapModalFactory,
  DataTableModalFactory,
  LoadDataModalFactory,
  ExportImageModalFactory,
  ExportDataModalFactory,
  ExportMapModalFactory,
  AddMapStyleModalFactory,
  ModalDialogFactory,
  SaveMapModalFactory,
  ShareMapModalFactory
];

export default function ModalContainerFactory(
  DeleteDatasetModal: ReturnType<typeof DeleteDatasetModalFactory>,
  OverWriteMapModal: ReturnType<typeof OverWriteMapModalFactory>,
  DataTableModal: ReturnType<typeof DataTableModalFactory>,
  LoadDataModal: ReturnType<typeof LoadDataModalFactory>,
  ExportImageModal: ReturnType<typeof ExportImageModalFactory>,
  ExportDataModal: ReturnType<typeof ExportDataModalFactory>,
  ExportMapModal: ReturnType<typeof ExportMapModalFactory>,
  AddMapStyleModal: ReturnType<typeof AddMapStyleModalFactory>,
  ModalDialog: ReturnType<typeof ModalDialogFactory>,
  SaveMapModal: ReturnType<typeof SaveMapModalFactory>,
  ShareMapModal: ReturnType<typeof ShareMapModalFactory>
): React.ElementType<ModalContainerProps> {
  /** @augments React.Component<ModalContainerProps> */
  class ModalContainer extends Component<ModalContainerProps> {
    // TODO - remove when prop types are fully exported
    componentDidMount = () => {
      document.addEventListener('keyup', this._onKeyUp);
    };
    componentWillUnmount() {
      document.removeEventListener('keyup', this._onKeyUp);
    }

    _onKeyUp = event => {
      const keyCode = event.keyCode;
      if (keyCode === KeyEvent.DOM_VK_ESCAPE) {
        this._closeModal();
      }
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

    _onFileUpload = fileList => {
      this.props.visStateActions.loadFiles(fileList);
    };

    _onExportImage = () => {
      if (!this.props.uiState.exportImage.processing) {
        exportImage(this.props.uiState.exportImage, `${this.props.appName}.png`);
        this.props.uiStateActions.cleanupExportImage();
        this._closeModal();
      }
    };

    _onExportData = () => {
      exportData(this.props, this.props.uiState.exportData);
      this._closeModal();
    };

    _onExportMap = () => {
      const {uiState} = this.props;
      const {format} = uiState.exportMap;
      (format === EXPORT_MAP_FORMATS.HTML ? exportHtml : exportJson)(
        this.props,
        this.props.uiState.exportMap[format] || {}
      );
      this._closeModal();
    };

    _exportFileToCloud = ({provider, isPublic, overwrite, closeModal}) => {
      const toSave = exportMap(this.props);

      this.props.providerActions.exportFileToCloud({
        // @ts-ignore
        mapData: toSave,
        provider,
        options: {
          isPublic,
          overwrite
        },
        closeModal,
        onSuccess: this.props.onExportToCloudSuccess,
        onError: this.props.onExportToCloudError
      });
    };

    _onSaveMap = (provider, overwrite = false) => {
      this._exportFileToCloud({
        provider,
        isPublic: false,
        overwrite,
        closeModal: true
      });
    };

    _onOverwriteMap = () => {
      this._onSaveMap(true);
    };

    _onShareMapUrl = provider => {
      this._exportFileToCloud({provider, isPublic: true, overwrite: false, closeModal: false});
    };

    _onCloseSaveMap = () => {
      this.props.providerActions.resetProviderStatus();
      this._closeModal();
    };

    _onLoadCloudMap = payload => {
      this.props.providerActions.loadCloudMap({
        ...payload,
        onSuccess: this.props.onLoadCloudMapSuccess,
        onError: this.props.onLoadCloudMapError
      });
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
        visStateActions,
        uiStateActions,
        providerState
      } = this.props;
      const {currentModal, datasetKeyToRemove} = uiState;
      const {datasets, layers, editingDataset} = visState;

      let template: JSX.Element | null = null;
      let modalProps: Partial<ModalDialogProps> = {};

      // TODO - currentModal is a string
      // @ts-ignore
      if (currentModal && currentModal.id && currentModal.template) {
        // if currentMdoal template is already provided
        // TODO: need to check whether template is valid
        // @ts-ignore
        template = <currentModal.template />;
        // @ts-ignore
        modalProps = currentModal.modalProps;
      } else {
        switch (currentModal) {
          case DATA_TABLE_ID: {
            const width = containerW * 0.9;
            template = (
              <DataTableModal
                datasets={datasets}
                dataId={editingDataset}
                showDatasetTable={visStateActions.showDatasetTable}
                sortTableColumn={visStateActions.sortTableColumn}
                pinTableColumn={visStateActions.pinTableColumn}
                copyTableColumn={visStateActions.copyTableColumn}
                setColumnDisplayFormat={visStateActions.setColumnDisplayFormat}
                uiStateActions={uiStateActions}
                uiState={uiState}
              />
            );

            // TODO: we need to make this width consistent with the css rule defined modal.js:32 max-width: 70vw
            // @ts-ignore // TODO fix this after add types to Theme
            modalProps.cssStyle = css`
              ${DataTableModalStyle};
              ${media.palm`
                width: ${width}px;
              `};
            `;
            break;
          }
          case DELETE_DATA_ID: {
            // validate options
            if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
              template = (
                <DeleteDatasetModal dataset={datasets[datasetKeyToRemove]} layers={layers} />
              );
              modalProps = {
                title: 'modal.title.deleteDataset',
                cssStyle: smallModalCss,
                footer: true,
                onConfirm: () => this._deleteDataset(datasetKeyToRemove),
                onCancel: this._closeModal,
                confirmButton: {
                  negative: true,
                  large: true,
                  children: 'modal.button.delete'
                }
              };
            }
            break; // in case we add a new case after this one
          }
          case ADD_DATA_ID:
            template = (
              <LoadDataModal
                {...providerState}
                onClose={this._closeModal}
                onFileUpload={this._onFileUpload}
                onLoadCloudMap={this._onLoadCloudMap}
                loadFiles={uiState.loadFiles}
                fileLoading={visState.fileLoading}
                fileLoadingProgress={visState.fileLoadingProgress}
                fileFormatNames={getFileFormatNames(this.props.visState)}
                fileExtensions={getFileExtensions(this.props.visState)}
              />
            );
            modalProps = {
              title: 'modal.title.addDataToMap',
              cssStyle: LoadDataModalStyle,
              footer: false,
              onConfirm: this._closeModal
            };
            break;
          case EXPORT_IMAGE_ID:
            template = (
              <ExportImageModal
                exportImage={uiState.exportImage}
                mapW={containerW}
                mapH={containerH}
                onUpdateImageSetting={uiStateActions.setExportImageSetting}
                cleanupExportImage={uiStateActions.cleanupExportImage}
              />
            );
            modalProps = {
              title: 'modal.title.exportImage',
              cssStyle: '',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportImage,
              confirmButton: {
                large: true,
                disabled: uiState.exportImage.processing,
                children: 'modal.button.download'
              }
            };
            break;
          case EXPORT_DATA_ID:
            template = (
              <ExportDataModal
                {...uiState.exportData}
                supportedDataTypes={EXPORT_DATA_TYPE_OPTIONS}
                datasets={datasets}
                applyCPUFilter={this.props.visStateActions.applyCPUFilter}
                onChangeExportDataType={uiStateActions.setExportDataType}
                onChangeExportSelectedDataset={uiStateActions.setExportSelectedDataset}
                onChangeExportFiltered={uiStateActions.setExportFiltered}
              />
            );
            modalProps = {
              title: 'modal.title.exportData',
              cssStyle: '',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportData,
              confirmButton: {
                large: true,
                children: 'modal.button.export'
              }
            };
            break;
          case EXPORT_MAP_ID: {
            const keplerGlConfig = visState.schema.getConfigToSave({
              mapStyle,
              visState,
              mapState,
              uiState
            });
            template = (
              <ExportMapModal
                config={keplerGlConfig}
                options={uiState.exportMap}
                onChangeExportMapFormat={uiStateActions.setExportMapFormat}
                onEditUserMapboxAccessToken={uiStateActions.setUserMapboxAccessToken}
                onChangeExportMapHTMLMode={uiStateActions.setExportHTMLMapMode}
              />
            );
            modalProps = {
              title: 'modal.title.exportMap',
              cssStyle: '',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onExportMap,
              confirmButton: {
                large: true,
                children: 'modal.button.export'
              }
            };
            break;
          }
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
              title: 'modal.title.addCustomMapboxStyle',
              cssStyle: '',
              footer: true,
              onCancel: this._closeModal,
              onConfirm: this._onAddCustomMapStyle,
              confirmButton: {
                large: true,
                disabled: !mapStyle.inputStyle.url,
                children: 'modal.button.addStyle'
              }
            };
            break;
          case SAVE_MAP_ID:
            template = (
              <SaveMapModal
                {...providerState}
                exportImage={uiState.exportImage}
                mapInfo={visState.mapInfo}
                onSetMapInfo={visStateActions.setMapInfo}
                cleanupExportImage={uiStateActions.cleanupExportImage}
                onUpdateImageSetting={uiStateActions.setExportImageSetting}
                onCancel={this._closeModal}
                onConfirm={provider => this._onSaveMap(provider, false)}
              />
            );
            modalProps = {
              title: 'modal.title.saveMap',
              cssStyle: '',
              footer: false
            };
            break;
          case OVERWRITE_MAP_ID:
            template = (
              <OverWriteMapModal
                {...providerState}
                title={get(visState, ['mapInfo', 'title'])}
                onUpdateImageSetting={uiStateActions.setExportImageSetting}
                cleanupExportImage={uiStateActions.cleanupExportImage}
                onConfirm={this._onOverwriteMap}
                onCancel={this._closeModal}
              />
            );
            modalProps = {
              title: 'Overwrite Existing File?',
              cssStyle: smallModalCss,
              footer: false
            };
            break;
          case SHARE_MAP_ID:
            template = (
              <ShareMapModal
                {...providerState}
                onExport={this._onShareMapUrl}
                cleanupExportImage={uiStateActions.cleanupExportImage}
                onUpdateImageSetting={uiStateActions.setExportImageSetting}
              />
            );
            modalProps = {
              title: 'modal.title.shareURL',
              cssStyle: '',
              onCancel: this._onCloseSaveMap
            };
            break;
          default:
            break;
        }
      }

      return rootNode ? (
        <ModalDialog
          parentSelector={() => findDOMNode(rootNode) as HTMLElement}
          isOpen={Boolean(currentModal)}
          onCancel={this._closeModal}
          {...modalProps}
          cssStyle={DefaultStyle.concat(modalProps.cssStyle)}
        >
          {template}
        </ModalDialog>
      ) : null;
    }
    /* eslint-enable complexity */
  }

  return ModalContainer;
}
