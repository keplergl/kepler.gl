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

import React, {useState} from 'react';
import styled from 'styled-components';
import get from 'lodash.get';
import {IntlShape, useIntl} from 'react-intl';

import FileUploadFactory from 'components/common/file-uploader/file-upload';
import LoadStorageMapFactory from './load-storage-map';
import ModalTabsFactory from './modal-tabs';
import LoadingDialog from './loading-dialog';

import {LOADING_METHODS} from '@kepler.gl/constants';
import {FileLoading} from '@kepler.gl/types';

/** @typedef {import('./load-data-modal').LoadDataModalProps} LoadDataModalProps */

const StyledLoadDataModal = styled.div.attrs({
  className: 'load-data-modal'
})`
  padding: ${props => props.theme.modalPadding};
  min-height: 440px;
  display: flex;
  flex-direction: column;
`;

const noop = () => {};
const getDefaultMethod = methods => (Array.isArray(methods) ? get(methods, [0]) : null);
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
  loadingMethods: LoadingMethod[];
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions: string[];
  isCloudMapLoading: boolean;
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
};

LoadDataModalFactory.deps = [ModalTabsFactory, FileUploadFactory, LoadStorageMapFactory];

export function LoadDataModalFactory(
  ModalTabs: ReturnType<typeof ModalTabsFactory>,
  FileUpload: ReturnType<typeof FileUploadFactory>,
  LoadStorageMap: ReturnType<typeof LoadStorageMapFactory>
) {
  /** @type {React.FunctionComponent<LoadDataModalProps>} */
  const LoadDataModal: React.FC<LoadDataModalProps> = props => {
    const intl = useIntl();
    const {loadingMethods, isCloudMapLoading} = props;
    const [currentMethod, toggleMethod] = useState(getDefaultMethod(loadingMethods));

    const ElementType = currentMethod.elementType;

    return (
      <StyledLoadDataModal>
        <ModalTabs
          currentMethod={currentMethod.id}
          loadingMethods={loadingMethods}
          toggleMethod={toggleMethod}
        />
        {isCloudMapLoading ? (
          <LoadingDialog size={64} />
        ) : (
          currentMethod && <ElementType key={currentMethod.id} intl={intl} {...props} />
        )}
      </StyledLoadDataModal>
    );
  };

  LoadDataModal.defaultProps = {
    onFileUpload: noop,
    fileLoading: false,
    loadingMethods: [
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
    ]
  };

  return LoadDataModal;
}

export default LoadDataModalFactory;
