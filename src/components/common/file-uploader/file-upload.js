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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UploadButton from './upload-button';
import {FileType, DragNDrop} from 'components/common/icons';
import LoadingSpinner from 'components/common/loading-spinner';
import {isChrome} from 'utils/utils';
// Breakpoints
import {media} from 'styles/media-breakpoints';

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
  // 'kml',
  'json',
  'geojson'
];

const MESSAGE = ' Drag & Drop Your File(s) Here';
const CHROME_MSG =
  '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari';
const DISCLAIMER = '*Kepler.gl is a client-side application with no server backend. Data lives only on your machine/browser. ' +
  'No information or map data is sent to any server.';
const CONFIG_UPLOAD_MESSAGE = 'Upload data files or upload a saved map via previously exported single Json of both config and data';

const fileIconColor = '#D3D8E0';

const StyledUploadMessage = styled.div`
  color: ${props => props.theme.textColorLT};
  font-size: 14px;
  margin-bottom: 12px;

  ${media.portable`
    font-size: 12px;
  `}
`;

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
  text-align: center;
  width: 100%;
  padding: 48px 8px 0;

  .file-upload-or {
    color: ${props => props.theme.linkBtnColor};
    padding-right: 4px;
  }

  ${media.portable`
    padding: 16px 4px 0;
  `};
`;

const MsgWrapper = styled.div`
  color: ${props => props.theme.modalTitleColor};
  font-size: 20px;
  height: 36px;
`;

const StyledDragNDropIcon = styled.div`
  color: ${fileIconColor};
  margin-bottom: 48px;

  ${media.portable`
    margin-bottom: 16px;
  `};
  ${media.palm`
    margin-bottom: 8px;
  `};
`;

const StyledFileTypeFow = styled.div`
  margin-bottom: 24px;
  ${media.portable`
    margin-bottom: 16px;
  `};
  ${media.palm`
    margin-bottom: 8px;
  `};
`;

const StyledFileUpload = styled.div`
  .filter-upload__input {
    visibility: hidden;
    height: 0;
    position: absolute;
  }

  .file-drop {
    position: relative;
  }
`;

const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDragFileWrapper = styled.div`
  margin-bottom: 32px;
  ${media.portable`
    margin-bottom: 24px;
  `};
  ${media.portable`
    margin-bottom: 16px;
  `}
`;

const StyledDisclaimer = styled(StyledMessage)`
  margin: 0 auto;
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
    files: [],
    errorFiles: []
  };

  frame = createRef();

  _isValidFileType = filename => {
    const {validFileExt} = this.props;
    const fileExt = validFileExt.find(ext => filename.endsWith(ext));

    return Boolean(fileExt);
  };

  _handleFileInput = (files, e) => {
    if (e) {
      e.stopPropagation();
    }

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
    const {errorFiles, files} = this.state;

    if (errorFiles.length) {
      return (
        <WarningMsg>
          {`File ${errorFiles.join(', ')} is not supported.`}
        </WarningMsg>
      );
    }

    if (!files.length) {
      return null;
    }

    return (
      <StyledMessage className="file-uploader__message">
        <div>Uploading...</div>
        <PositiveMsg>
          {`${files.map(f => f.name).join(' and ')}...`}
        </PositiveMsg>
        <LoadingSpinner size={20} />
      </StyledMessage>
    );
  }

  render() {
    const {dragOver, files} = this.state;
    const {validFileExt} = this.props;
    return (
      <StyledFileUpload
        className="file-uploader"
        ref={this.frame}
      >
        <input
          className="filter-upload__input"
          type="file"
          onChange={this._onChange}
        />
        {FileDrop ? (
          <FileDrop
            frame={this.frame.current || document}
            targetAlwaysVisible
            onDragOver={() => this._toggleDragState(true)}
            onDragLeave={() => this._toggleDragState(false)}
            onDrop={this._handleFileInput}
          >
            <StyledUploadMessage className="file-upload__message">{CONFIG_UPLOAD_MESSAGE}</StyledUploadMessage>
            <StyledFileDrop dragOver={dragOver}>
              <div style={{opacity: dragOver ? 0.5 : 1}}>
                <StyledDragNDropIcon>
                  <StyledFileTypeFow className="file-type-row">
                    {validFileExt.map(ext => (
                      <FileType key={ext} ext={ext} height="50px" fontSize="9px"/>
                    ))}
                  </StyledFileTypeFow>
                  <DragNDrop height="44px" />
                </StyledDragNDropIcon>
                <div>{this._renderMessage()}</div>
              </div>
              {!files.length ? (
                  <StyledDragFileWrapper>
                    <MsgWrapper>{MESSAGE}</MsgWrapper>
                    <span className="file-upload-or">or</span>
                    <UploadButton onUpload={this._handleFileInput}>
                      browse your files
                    </UploadButton>
                  </StyledDragFileWrapper>
              ) : null}
              <StyledDisclaimer>{DISCLAIMER}</StyledDisclaimer>
            </StyledFileDrop>
          </FileDrop>
        ) : null}

        <WarningMsg>{isChrome() ? CHROME_MSG : ''}</WarningMsg>
      </StyledFileUpload>
    );
  }
}
