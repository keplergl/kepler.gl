// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import get from 'es-toolkit/compat/get';
import {IntlShape, useIntl} from 'react-intl';

import FileUploadFactory from '../common/file-uploader/file-upload';
import LoadStorageMapFactory from './load-storage-map';
import LoadTilesetFactory from './tilesets-modals/load-tileset';
import ModalTabsFactory from './modal-tabs';
import LoadingDialog from './loading-dialog';

import {LOADING_METHODS} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {FileLoading, FileLoadingProgress, LoadFiles} from '@kepler.gl/types';

import Checkbox from '../common/checkbox';

const StyledLoadDataModal = styled.div.attrs({
  className: 'load-data-modal'
})`
  padding: ${props => props.theme.modalPadding};
  min-height: 360px;
  display: flex;
  flex-direction: column;
`;

const ReplaceDatasetOption = styled.div.attrs({
  className: 'load-data-modal__replace-option'
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;

  .replace-dataset-hint {
    color: ${props => props.theme.subtextColor};
    font-size: 11px;
    line-height: 14px;
  }
`;

const noop = () => {
  return;
};
const getDefaultMethod = <T,>(methods: T[] = []) =>
  Array.isArray(methods) ? get(methods, [0]) : null;
export interface LoadingMethod {
  id: string;
  label: string;
  elementType: React.ComponentType<any>;
  tabElementType?: React.ComponentType<{onClick: React.MouseEventHandler; intl: IntlShape}>;
}

type LoadDataModalProps = {
  // call backs
  onFileUpload: (files: File[]) => void;
  onLoadCloudMap: (provider: any, vis: any) => void;
  onTilesetAdded: (
    tileset: {name: string; type: string; metadata: Record<string, any>},
    processedMetadata?: Record<string, any>
  ) => void;
  fileLoading: FileLoading | false;
  loadingMethods?: LoadingMethod[];
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions: string[];
  /** Extensions shown as icons in the uploader. Defaults to `fileExtensions`. */
  displayedFileExtensions?: string[];
  isCloudMapLoading: boolean;
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
  onClose?: (...args: any) => any;

  loadFiles: LoadFiles;
  fileLoadingProgress: FileLoadingProgress;

  /** When set, the next upload replaces this dataset instead of adding one. */
  replaceDatasetId?: string | null;
  replaceDatasetLabel?: string;
  deleteOriginalDataset?: boolean;
  onToggleDeleteOriginalDataset?: () => void;
};

LoadDataModalFactory.deps = [
  ModalTabsFactory,
  FileUploadFactory,
  LoadStorageMapFactory,
  LoadTilesetFactory
];

export function LoadDataModalFactory(
  ModalTabs: ReturnType<typeof ModalTabsFactory>,
  FileUpload: ReturnType<typeof FileUploadFactory>,
  LoadStorageMap: ReturnType<typeof LoadStorageMapFactory>,
  LoadTileset: ReturnType<typeof LoadTilesetFactory>
) {
  const defaultLoadingMethods = [
    {
      id: LOADING_METHODS.upload,
      label: 'modal.loadData.upload',
      elementType: FileUpload
    },
    {
      id: LOADING_METHODS.tileset,
      label: 'modal.loadData.tileset',
      elementType: LoadTileset
    },
    {
      id: LOADING_METHODS.storage,
      label: 'modal.loadData.storage',
      elementType: LoadStorageMap
    }
  ];

  const LoadDataModal: React.FC<LoadDataModalProps> & {
    defaultLoadingMethods: LoadDataModalProps['loadingMethods'];
  } = ({
    onFileUpload = noop,
    onTilesetAdded = noop,
    fileLoading = false,
    loadingMethods = defaultLoadingMethods,
    isCloudMapLoading,
    replaceDatasetId,
    replaceDatasetLabel,
    deleteOriginalDataset = true,
    onToggleDeleteOriginalDataset,
    ...restProps
  }) => {
    const intl = useIntl();
    const currentModalProps = {
      ...restProps,
      onFileUpload,
      onTilesetAdded,
      fileLoading,
      isCloudMapLoading
    };
    // Replacing a table is a file upload. Tileset and saved-map tabs stay on Add Data.
    const availableMethods = useMemo(
      () =>
        replaceDatasetId
          ? loadingMethods.filter(method => method.id === LOADING_METHODS.upload)
          : loadingMethods,
      [loadingMethods, replaceDatasetId]
    );
    const [currentMethod, toggleMethod] = useState(getDefaultMethod(availableMethods));
    const selectedMethod = availableMethods.some(method => method.id === currentMethod?.id)
      ? currentMethod
      : getDefaultMethod(availableMethods);

    const ElementType = selectedMethod?.elementType;
    const datasetName = replaceDatasetLabel || replaceDatasetId;

    return (
      <StyledLoadDataModal>
        <ModalTabs
          currentMethod={selectedMethod?.id}
          loadingMethods={availableMethods}
          toggleMethod={toggleMethod}
        />
        {replaceDatasetId && onToggleDeleteOriginalDataset ? (
          <ReplaceDatasetOption>
            <Checkbox
              id="delete-original-dataset"
              checked={deleteOriginalDataset}
              label={intl.formatMessage(
                {id: 'modal.replaceDataset.removeOriginal'},
                {datasetName: datasetName ?? ''}
              )}
              onChange={onToggleDeleteOriginalDataset}
            />
            <div className="replace-dataset-hint">
              <FormattedMessage id="modal.replaceDataset.removeOriginalHint" />
            </div>
          </ReplaceDatasetOption>
        ) : null}
        {isCloudMapLoading ? (
          <LoadingDialog size={64} />
        ) : (
          ElementType && <ElementType key={selectedMethod?.id} intl={intl} {...currentModalProps} />
        )}
      </StyledLoadDataModal>
    );
  };

  LoadDataModal.defaultLoadingMethods = defaultLoadingMethods;

  return LoadDataModal;
}

export default LoadDataModalFactory;
