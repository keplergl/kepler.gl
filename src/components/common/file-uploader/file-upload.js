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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UploadButton from './upload-button';
import {DragNDrop, FileType} from 'components/common/icons';
import FileUploadProgress from 'components/common/file-uploader/file-upload-progress';
import FileDrop from './file-drop';

import {isChrome} from 'utils/utils';
import {GUIDES_FILE_FORMAT_DOC} from 'constants/user-guides';
import ReactMarkdown from 'react-markdown';
// Breakpoints
import {media} from 'styles/media-breakpoints';
import {FormattedMessage, injectIntl} from 'react-intl';

// File.type is not reliable if the OS does not have a
// registered mapping for the extension.
// NOTE: Shapefiles must be in a compressed format since
// it requires multiple files to be present.
const defaultValidFileExt = ['csv', 'json', 'geojson'];

const fileIconColor = '#D3D8E0';

const LinkRenderer = props => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};
const StyledUploadMessage = styled.div`
  color: ${props => props.theme.textColorLT};
  font-size: 14px;
  margin-bottom: 12px;

  ${media.portable`
    font-size: 12px;
  `}
`;

export const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
  font-weight: 500;
`;

const StyledFileDrop = styled.div`
  background-color: white;
  border-radius: 4px;
  border-style: ${props => (props.dragOver ? 'solid' : 'dashed')};
  border-width: 1px;
  border-color: ${props => (props.dragOver ? props.theme.textColorLT : props.theme.subtextColorLT)};
  text-align: center;
  width: 100%;
  padding: 48px 8px 0;
  height: 360px;

  .file-upload-or {
    color: ${props => props.theme.linkBtnColor};
    padding-right: 4px;
  }

  .file-type-row {
    opacity: 0.5;
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
  .file-drop {
    position: relative;
  }
`;

const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;

  .loading-action {
    margin-right: 10px;
  }
  .loading-spinner {
    margin-left: 10px;
  }
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

function FileUploadFactory() {
  class FileUpload extends Component {
    static propTypes = {
      onFileUpload: PropTypes.func.isRequired,
      validFileExt: PropTypes.arrayOf(PropTypes.string),
      fileLoading: PropTypes.bool
    };

    static defaultProps = {
      validFileExt: defaultValidFileExt
    };

    state = {
      dragOver: false,
      fileLoading: false,
      files: [],
      errorFiles: []
    };

    static getDerivedStateFromProps(props, state) {
      if (state.fileLoading && props.fileLoading === false && state.files.length) {
        return {
          files: [],
          fileLoading: props.fileLoading
        };
      }
      return {
        fileLoading: props.fileLoading
      };
    }

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

      this.setState(nextState, () =>
        nextState.files.length ? this.props.onFileUpload(nextState.files) : null
      );
    };

    _toggleDragState = newState => {
      this.setState({dragOver: newState});
    };

    render() {
      const {dragOver, files, errorFiles} = this.state;
      const {validFileExt, intl, fileLoading, fileLoadingProgress} = this.props;
      return (
        <StyledFileUpload className="file-uploader" ref={this.frame}>
          {FileDrop ? (
            <FileDrop
              frame={this.frame.current || document}
              onDragOver={() => this._toggleDragState(true)}
              onDragLeave={() => this._toggleDragState(false)}
              onDrop={this._handleFileInput}
              className="file-uploader__file-drop"
            >
              <StyledUploadMessage className="file-upload__message">
                <ReactMarkdown
                  source={`${intl.formatMessage({
                    id: 'fileUploader.configUploadMessage'
                  })}(${GUIDES_FILE_FORMAT_DOC}).`}
                  renderers={{link: LinkRenderer}}
                />
              </StyledUploadMessage>
              <StyledFileDrop dragOver={dragOver}>
                <StyledFileTypeFow className="file-type-row">
                  {validFileExt.map(ext => (
                    <FileType key={ext} ext={ext} height="50px" fontSize="9px" />
                  ))}
                </StyledFileTypeFow>
                {fileLoading ? (
                  <FileUploadProgress fileLoadingProgress={fileLoadingProgress} />
                ) : (
                  <>
                    <div
                      style={{opacity: dragOver ? 0.5 : 1}}
                      className="file-upload-display-message"
                    >
                      <StyledDragNDropIcon>
                        <DragNDrop height="44px" />
                      </StyledDragNDropIcon>

                      {errorFiles.length ? (
                        <WarningMsg>
                          <FormattedMessage
                            id={'fileUploader.fileNotSupported'}
                            values={{errorFiles: errorFiles.join(', ')}}
                          />
                        </WarningMsg>
                      ) : null}
                    </div>
                    {!files.length ? (
                      <StyledDragFileWrapper>
                        <MsgWrapper>
                          <FormattedMessage id={'fileUploader.message'} />
                        </MsgWrapper>
                        <span className="file-upload-or">
                          <FormattedMessage id={'fileUploader.or'} />
                        </span>
                        <UploadButton onUpload={this._handleFileInput}>
                          <FormattedMessage id={'fileUploader.browseFiles'} />
                        </UploadButton>
                      </StyledDragFileWrapper>
                    ) : null}

                    <StyledDisclaimer>
                      <FormattedMessage id={'fileUploader.disclaimer'} />
                    </StyledDisclaimer>
                  </>
                )}
              </StyledFileDrop>
            </FileDrop>
          ) : null}

          <WarningMsg>
            {isChrome() ? <FormattedMessage id={'fileUploader.chromeMessage'} /> : ''}
          </WarningMsg>
        </StyledFileUpload>
      );
    }
  }

  return injectIntl(FileUpload);
}

export default FileUploadFactory;
export const FileUpload = FileUploadFactory();
