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

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import get from 'lodash.get';

import FileUploadFactory from 'components/common/file-uploader/file-upload';
import LoadStorageMapFactory from './load-storage-map';
import ModalTabsFactory from './modal-tabs';

import LoadingDialog from './loading-dialog';
import {LOADING_METHODS} from 'constants/default-settings';

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

LoadDataModalFactory.deps = [ModalTabsFactory, FileUploadFactory, LoadStorageMapFactory];

function LoadDataModalFactory(ModalTabs, FileUpload, LoadStorageMap) {
  const LoadDataModal = props => {
    const {fileLoading, loadingMethods, isCloudMapLoading} = props;
    const [currentMethod, toggleMethod] = useState(getDefaultMethod(loadingMethods));

    return (
      <StyledLoadDataModal>
        <ModalTabs
          currentMethod={currentMethod.id}
          loadingMethods={loadingMethods}
          toggleMethod={toggleMethod}
        />
        {fileLoading || isCloudMapLoading ? (
          <LoadingDialog size={64} />
        ) : (
          currentMethod && <currentMethod.elementType key={currentMethod.id} {...props} />
        )}
      </StyledLoadDataModal>
    );
  };

  LoadDataModal.propTypes = {
    // call backs
    onFileUpload: PropTypes.func.isRequired,
    onLoadCloudMap: PropTypes.func.isRequired,
    fileLoading: PropTypes.bool,
    loadingMethods: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        elementType: PropTypes.elementType,
        tabElementType: PropTypes.elementType
      })
    )
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
