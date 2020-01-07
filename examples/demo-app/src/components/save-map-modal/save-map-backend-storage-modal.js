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

import React, { Component } from 'react';
import {Modal, LoadingSpinner} from 'kepler.gl/components';
import styled from 'styled-components';
import SaveMapModalContent from './save-map-modal-content'
import {BACKEND_PROVIDERS} from '../../utils/backend-providers';

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;
class SaveMapBackendStorageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      isUploading: false
    };
  }

  _saveTitle = (title) => {
    this.setState({ title: title });
  }

  _saveDescription = (description) => {
    this.setState({ description: description });
  }

  _saveMap = async () => {
    const provider = this._getActiveProvider();
    const extraData = {
      title: this.state.title.length ? this.state.title : null,
      description: this.state.description.length ? this.state.description : null
    };
    this.props.onSave(provider, extraData);
  }

  _isSaveDisabled = () => this.state.title.length < 3;

  _getActiveProvider = () => {
    const provider = Object.values(BACKEND_PROVIDERS).find((provider) => provider.isConnected);
    return provider ? provider.name : null
  }

  _updateStatus = () => {
    const sharing = this.props.sharing;
    if (sharing && sharing.info && sharing.info.status) {
      const status = sharing.info.status;
      if (status === 'uploading' && !this.state.isUploading) {
        this.setState({ isUploading: true });
      } else if (status === 'success' && this.state.isUploading) {
        this.setState({ isUploading: false });
        this.props.onSaveFinished();
      }
    }
  }

  _modalProps = {
    title: 'Save your map',
    footer: true,
    confirmButton: {
      large: true,
      disabled: false,
      children: 'Save'
    }
  }

  render() {
    const { isOpen, onClose, parentSelector, sharing } = this.props;
    const { title, description } = this.state;
    const isLoading = sharing.isLoading;
    this._isSaveDisabled = this._isSaveDisabled.bind(this);
    this._saveMap = this._saveMap.bind(this);
    this._updateStatus();
    return (
      <Modal
        isOpen={isOpen}
        close={onClose}
        parentSelector={parentSelector}
        onConfirm={ () => { this._saveMap(); }}
        {...this._modalProps}
      >
        {isLoading ?
          (
            <StyledSpinner>
              <LoadingSpinner />
            </StyledSpinner>
          ) : (
            <SaveMapModalContent
              title={title}
              onTitleChange={ this._saveTitle }
              description={description}
              onDescriptionChange={ this._saveDescription }
            />
          )
        }
      </Modal>
    );
  }
};

export default SaveMapBackendStorageModal;
