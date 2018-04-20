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
import styled from 'styled-components';

import UploadButton from './upload-button';
import {FileType, DragNDrop} from 'components/common/icons';
import {isChrome} from 'utils/utils';

const FileDrop =
  typeof document !== 'undefined' ? require('react-file-drop') : null;

// File.type is not reliable if the OS does not have a
// registered mapping for the extension.
// NOTE: Shapefiles must be in a compressed format since
// it requires multiple files to be present.
const defaultValidFileExt = [
  'csv',
  // 'tar.gz',
  // 'tgz',
  // 'zip',
  // 'gpx',
  'kml',
  'json',
  'geojson'
];

const MESSAGE = ' Drag & Drop Your File(s) Here';
const CHROME_MSG =
  '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari';
const fileIconColor = '#D3D8E0';

const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
`;

const PositiveMsg = styled.span`
  color: ${props => props.theme.primaryBtnActBgd};
`;

const StyledFileDrop = styled.div`
  background-color: white;
  border-radius: 4px;
  border-style: dashed;
  border-width: 1px;
  border-color: ${props => props.theme.subtextColorLT};
  height: 414px;
  padding-top: 60px;
  text-align: center;
  width: 100%;

  .file-upload-or {
    color: ${props => props.theme.linkBtnColor};
    padding-right: 4px;
  }
`;

const MsgWrapper = styled.div`
  color: ${props => props.theme.modalTitleColor};
  font-size: 20px;
  height: 36px;
`;

const StyledDragNDropIcon = styled.div`
  color: ${fileIconColor};
  margin-bottom: 60px;

  .file-type-row {
    margin-bottom: 26px;
  }
`;

const StyledFileUpload = styled.div`
  .filter-upload__input {
    visibility: hidden;
  }
`;

export default class FileUpload extends Component {
  static defaultProps = {
    validFileExt: defaultValidFileExt
  };

  static propTypes = {
    onFileUpload: PropTypes.func.isRequired,
    validFileExt: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    dragOver: false,
    files: null,
    errorFiles: []
  };

  _isValidFileType = filename => {
    const {validFileExt} = this.props;
    const fileExt = validFileExt.find(ext => filename.endsWith(ext));

    return Boolean(fileExt);
  };

  _handleFileDrop = (files, e) => {
    e.stopPropagation();

    const nextState = {files: [], errorFiles: [], dragOver: false};
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file && this._isValidFileType(file.name)) {
        nextState.files.push(file);
      } else {
        nextState.errorFiles.push(file.name);
      }
    }

    this.setState(
      nextState,
      () =>
        nextState.files.length ? this.props.onFileUpload(nextState.files) : null
    );
  };

  _toggleDragState = newState => {
    this.setState({dragOver: newState});
  };

  _renderMessage() {
    const {errorFiles} = this.state;

    if (errorFiles.length) {
      return (
        <WarningMsg>
          {`File ${errorFiles.join(', ')} is not supported.`}
        </WarningMsg>
      );
    }

    if (!this.state.files) {
      return null;
    }

    return (
      <span>
        Uploading...<PositiveMsg>
          {`${this.state.files.map(f => f.name).join(' and ')}...`}
        </PositiveMsg>
      </span>
    );
  }

  render() {
    const {dragOver} = this.state;
    const {validFileExt} = this.props;
    return (
      <StyledFileUpload
        className="file-uploader"
        innerRef={cmp => (this.frame = cmp)}
      >
        <input
          className="filter-upload__input"
          type="file"
          ref="fileInput"
          onChange={this._onChange}
        />
        {FileDrop ? (
          <FileDrop
            frame={this.frame}
            targetAlwaysVisible={true}
            onDragOver={() => this._toggleDragState(true)}
            onDragLeave={() => this._toggleDragState(false)}
            onDrop={this._handleFileDrop}
          >
            <StyledFileDrop dragOver={dragOver}>
              <div style={{opacity: dragOver ? 0.5 : 1}}>
                <StyledDragNDropIcon>
                  <div className="file-type-row">
                    {validFileExt.map(ext => (
                      <FileType key={ext} ext={ext} height="50px" fontSize="9px"/>
                    ))}
                  </div>
                  <DragNDrop height="44px" />
                </StyledDragNDropIcon>
                <div>{this._renderMessage()}</div>
              </div>
              <div>
                <MsgWrapper>{MESSAGE}</MsgWrapper>
                <span className="file-upload-or">or</span>
                <UploadButton onUpload={this._handleFileDrop}>
                  browse your files
                </UploadButton>
              </div>
            </StyledFileDrop>
          </FileDrop>
        ) : null}
        <WarningMsg>{isChrome() ? CHROME_MSG : ''}</WarningMsg>
      </StyledFileUpload>
    );
  }
}
