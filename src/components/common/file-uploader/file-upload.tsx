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

import React, {Component, createRef} from 'react';
import styled from 'styled-components';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import UploadButton from './upload-button';
import {DragNDrop, FileType} from 'components/common/icons';
import FileUploadProgress from 'components/common/file-uploader/file-upload-progress';
import FileDrop from './file-drop';
import {FileLoading, FileLoadingProgress} from '@kepler.gl/types';

import {isChrome} from '@kepler.gl/utils';
import {GUIDES_FILE_FORMAT_DOC} from '@kepler.gl/constants';
import ReactMarkdown from 'react-markdown';
// Breakpoints
import {FormattedMessage} from '@kepler.gl/localization';
import {media} from '@kepler.gl/styles';

/** @typedef {import('./file-upload').FileUploadProps} FileUploadProps */

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
  `};
`;

export const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
  font-weight: 500;
`;

interface StyledFileDropProps {
  dragOver?: boolean;
}

const StyledFileDrop = styled.div<StyledFileDropProps>`
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
  `};
`;

const StyledDisclaimer = styled(StyledMessage)`
  margin: 0 auto;
`;

type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  theme: object;
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames?: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions?: string[];
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
} & WrappedComponentProps;

function FileUploadFactory() {
  /** @augments {Component<FileUploadProps>} */
  class FileUpload extends Component<FileUploadProps> {
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

    frame = createRef<HTMLDivElement>();

    _isValidFileType = filename => {
      const {fileExtensions = []} = this.props;
      const fileExt = fileExtensions.find(ext => filename.endsWith(ext));

      return Boolean(fileExt);
    };

    /** @param {FileList} fileList */
    _handleFileInput = (fileList: FileList, event: any) => {
      if (event) {
        event.stopPropagation();
      }

      const files = [...fileList].filter(Boolean);

      const {disableExtensionFilter = false} = this.props;

      // TODO - move this code out of the component
      const filesToLoad: File[] = [];
      const errorFiles: string[] = [];
      for (const file of files) {
        if (disableExtensionFilter || this._isValidFileType(file.name)) {
          filesToLoad.push(file);
        } else {
          errorFiles.push(file.name);
        }
      }

      const nextState = {files: filesToLoad, errorFiles, dragOver: false};

      this.setState(nextState, () =>
        nextState.files.length ? this.props.onFileUpload(nextState.files) : null
      );
    };

    _toggleDragState = newState => {
      this.setState({dragOver: newState});
    };

    render() {
      const {dragOver, files, errorFiles} = this.state;
      const {fileLoading, fileLoadingProgress, theme, intl} = this.props;
      const {fileExtensions = [], fileFormatNames = []} = this.props;
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
                  source={`${intl.formatMessage(
                    {
                      id: 'fileUploader.configUploadMessage'
                    },
                    {
                      fileFormatNames: fileFormatNames.map(format => `**${format}**`).join(', ')
                    }
                  )}(${GUIDES_FILE_FORMAT_DOC}).`}
                  renderers={{link: LinkRenderer}}
                />
              </StyledUploadMessage>
              <StyledFileDrop dragOver={dragOver}>
                <StyledFileTypeFow className="file-type-row">
                  {fileExtensions.map(ext => (
                    <FileType key={ext} ext={ext} height="50px" fontSize="9px" />
                  ))}
                </StyledFileTypeFow>
                {fileLoading ? (
                  <FileUploadProgress fileLoadingProgress={fileLoadingProgress} theme={theme} />
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
