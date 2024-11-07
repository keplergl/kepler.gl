// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import {IntlShape, useIntl} from 'react-intl';

import FileUploadFactory from '../common/file-uploader/file-upload';
import LoadStorageMapFactory from './load-storage-map';
import ModalTabsFactory from './modal-tabs';
import LoadingDialog from './loading-dialog';

import {LOADING_METHODS} from '@kepler.gl/constants';
import {FileLoading, FileLoadingProgress, LoadFiles} from '@kepler.gl/types';

/** @typedef {import('./load-data-modal').LoadDataModalProps} LoadDataModalProps */

const StyledLoadDataModal = styled.div.attrs({
  className: 'load-data-modal'
})`
  padding: ${props => props.theme.modalPadding};
  min-height: 440px;
  display: flex;
  flex-direction: column;
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
  fileLoading: FileLoading | false;
  loadingMethods?: LoadingMethod[];
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions: string[];
  isCloudMapLoading: boolean;
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
  onClose?: (...args: any) => any;

  loadFiles: LoadFiles;
  fileLoadingProgress: FileLoadingProgress;
};

LoadDataModalFactory.deps = [ModalTabsFactory, FileUploadFactory, LoadStorageMapFactory];

export function LoadDataModalFactory(
  ModalTabs: ReturnType<typeof ModalTabsFactory>,
  FileUpload: ReturnType<typeof FileUploadFactory>,
  LoadStorageMap: ReturnType<typeof LoadStorageMapFactory>
) {
  const defaultLoadingMethods = [
    {
      id: LOADING_METHODS.upload,
      label: 'modal.loadData.upload',
      elementType: FileUpload
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
    fileLoading = false,
    loadingMethods = defaultLoadingMethods,
    isCloudMapLoading,
    ...restProps
  }) => {
    const intl = useIntl();
    const currentModalProps = {
      ...restProps,
      onFileUpload,
      fileLoading,
      isCloudMapLoading
    };
    // const {loadingMethods, isCloudMapLoading} = props;
    const [currentMethod, toggleMethod] = useState(getDefaultMethod(loadingMethods));

    const ElementType = currentMethod?.elementType;

    return (
      <StyledLoadDataModal>
        <ModalTabs
          currentMethod={currentMethod?.id}
          loadingMethods={loadingMethods}
          toggleMethod={toggleMethod}
        />
        {isCloudMapLoading ? (
          <LoadingDialog size={64} />
        ) : (
          ElementType && <ElementType key={currentMethod?.id} intl={intl} {...currentModalProps} />
        )}
      </StyledLoadDataModal>
    );
  };

  LoadDataModal.defaultLoadingMethods = defaultLoadingMethods;

  return LoadDataModal;
}

export default LoadDataModalFactory;
