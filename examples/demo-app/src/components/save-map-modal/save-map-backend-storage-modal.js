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
import {Modal} from 'kepler.gl/components';
import SaveMapModalContent from './save-map-modal-content'
import {BACKEND_PROVIDERS} from '../../utils/backend-providers';

class SaveMapBackendStorageModal extends Component {
  mapTitle = '';
  mapDescription = '';

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    };
  }

  _saveTitle = (title) => {
    this.setState({ title: title });
  }

  _saveDescription = (description) => {
    this.setState({ description: description });
  }

  _saveMap = async (map) => {
    // // Prepare data
    // const mapData = KeplerGlSchema.save(map);
    // const data = JSON.stringify(mapData);
    // const newBlob = new Blob([data], {type: 'application/json'});
    // const fileName = `/keplergl_${this.state.title}.json`;
    // const file = new File([newBlob], fileName);

    // const activeProvider = this._getActiveProvider();
    // const result = await activeProvider.uploadFile({
    //   data,
    //   type: 'application/json',
    //   blob: file,
    //   name: fileName,
    //   isPublic: false,
    //   activeProvider
    // });
    // console.log(`Saving map "${this.state.title}" => ${result.url}`);

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
    const { isOpen, onClose, parentSelector } = this.props;
    const { title, description } = this.state;
    this._isSaveDisabled = this._isSaveDisabled.bind(this);
    this._saveMap = this._saveMap.bind(this);
    return (
      <Modal
        isOpen={isOpen}
        close={onClose}
        parentSelector={parentSelector}
        onConfirm={ () => { this._saveMap(); }}
        {...this._modalProps}
      >
        <SaveMapModalContent
          title={title}
          onTitleChange={ this._saveTitle }
          description={description}
          onDescriptionChange={ this._saveDescription }
        />
      </Modal>
    );
  }
};

export default SaveMapBackendStorageModal;
