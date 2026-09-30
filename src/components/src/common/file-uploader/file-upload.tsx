// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import styled from 'styled-components';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import UploadButton from './upload-button';
import {DragNDrop, FileType} from '../icons';
import FileUploadProgress from './file-upload-progress';
import FileDrop from './file-drop';
import {FileLoading, FileLoadingProgress} from '@kepler.gl/types';

import {GUIDES_FILE_FORMAT_DOC} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  fetchRemoteFileAsKeplerFile,
  getAcceptedRemoteFileFormats,
  getFileNameForRemoteUrl,
  isRemoteDatasetUrl
} from '@kepler.gl/processors';
import {media} from '@kepler.gl/styles';
import {getApplicationConfig} from '@kepler.gl/utils';
import Markdown from 'markdown-to-jsx';

import {Button, InputLight} from '../styled-components';
import LinkRenderer from '../link-renderer';

const fileIconColor = '#D3D8E0';

const StyledUploadMessage = styled.div`
  color: ${props => props.theme.textColorLT};
  font-size: 14px;
  margin-bottom: 12px;

  p {
    margin: 0;
  }

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
  $dragOver?: boolean;
}

const StyledFileDrop = styled.div<StyledFileDropProps>`
  background-color: white;
  border-radius: 4px;
  border-style: ${props => (props.$dragOver ? 'solid' : 'dashed')};
  border-width: 1px;
  border-color: ${props =>
    props.$dragOver ? props.theme.textColorLT : props.theme.subtextColorLT};
  text-align: center;
  width: 100%;
  min-height: 360px;
  padding: 24px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .file-type-row {
    opacity: 0.5;
  }
  ${media.portable`
    padding: 16px 8px 12px;
    min-height: 280px;
  `};
`;

const StyledDropBody = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const StyledActionLine = styled.div`
  color: ${props => props.theme.modalTitleColor};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;

  .upload-button {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.linkBtnColor};
    text-decoration: none;
  }
`;

const StyledDragNDropIcon = styled.div`
  color: ${fileIconColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledFileTypeFow = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 12px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledDisclaimer = styled(StyledMessage)`
  flex-shrink: 0;
  margin: 12px 12px 0;
`;

const StyledRemoteUrlForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 420px;
  margin: 8px auto 0;
`;

const StyledRemoteUrlRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: stretch;
  justify-content: center;
  width: 100%;
`;

const StyledRemoteUrlInput = styled(InputLight)`
  flex: 1;
  min-width: 0;
  max-width: 300px;
`;

const StyledRemoteFormatSelect = styled.select`
  ${props => props.theme.inputLT};
  width: 88px;
  flex-shrink: 0;
  height: auto;
  box-sizing: border-box;
  padding: 0 6px;
  cursor: pointer;
`;

const StyledRemoteFetchButton = styled(Button)`
  height: auto;
  box-sizing: border-box;
  padding: 0 12px;
  flex-shrink: 0;
`;

const REMOTE_DOWNLOAD_SHARE = 0.85;

function scaleFileProgress(
  progress: FileLoadingProgress,
  start: number,
  end: number
): FileLoadingProgress {
  return Object.keys(progress).reduce<FileLoadingProgress>((accu, key) => {
    const item = progress[key];
    accu[key] = {
      ...item,
      percent: start + (item.percent || 0) * (end - start)
    };
    return accu;
  }, {});
}

function getCombinedLoadProgress({
  fileLoading,
  fileLoadingProgress,
  remoteProgress
}: {
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  remoteProgress: FileLoadingProgress;
}): FileLoadingProgress {
  const isRemoteFetch = Object.keys(remoteProgress).length > 0;
  if (!isRemoteFetch) {
    return fileLoadingProgress;
  }
  if (fileLoading) {
    return scaleFileProgress(fileLoadingProgress, REMOTE_DOWNLOAD_SHARE, 1);
  }
  return scaleFileProgress(remoteProgress, 0, REMOTE_DOWNLOAD_SHARE);
}

type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  theme: object;
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames?: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions?: string[];
  /** Extensions shown as icons. Defaults to `fileExtensions`. */
  displayedFileExtensions?: string[];
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
} & WrappedComponentProps;

type FileUploadState = {
  dragOver: boolean;
  fileLoading: FileLoading | false;
  files: File[];
  errorFiles: string[];
  remoteUrl: string;
  remoteFormat: string;
  remoteError: {message: string} | null;
  remoteLoading: boolean;
  remoteProgress: FileLoadingProgress;
};

function FileUploadFactory() {
  /** @augments {Component<FileUploadProps>} */
  class FileUpload extends Component<FileUploadProps, FileUploadState> {
    state: FileUploadState = {
      dragOver: false,
      fileLoading: false,
      files: [],
      errorFiles: [],
      remoteUrl: '',
      remoteFormat: 'auto',
      remoteError: null,
      remoteLoading: false,
      remoteProgress: {}
    };

    static getDerivedStateFromProps(props, state) {
      if (state.fileLoading && props.fileLoading === false && state.files.length) {
        return {
          files: [],
          fileLoading: props.fileLoading,
          remoteLoading: false,
          remoteProgress: {}
        };
      }
      return {
        fileLoading: props.fileLoading,
        ...(props.fileLoading ? {remoteLoading: false} : {})
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

    _onRemoteUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const remoteUrl = event.target.value;
      this.setState({
        remoteUrl,
        remoteError: remoteUrl && !isRemoteDatasetUrl(remoteUrl) ? {message: 'Incorrect URL'} : null
      });
    };

    _onRemoteFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({remoteFormat: event.target.value});
    };

    _onRemoteUrlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this._handleLoadRemoteFile();
      }
    };

    _handleLoadRemoteFile = async () => {
      const {remoteUrl, remoteFormat, remoteError} = this.state;
      const {intl} = this.props;
      const showFormatSelector = getApplicationConfig().enableRemoteFileFormatSelector;
      const format = showFormatSelector && remoteFormat !== 'auto' ? remoteFormat : undefined;
      if (!remoteUrl || remoteError || this.state.remoteLoading) {
        if (!remoteUrl) {
          this.setState({remoteError: {message: 'Incorrect URL'}});
        }
        return;
      }
      if (!isRemoteDatasetUrl(remoteUrl)) {
        this.setState({remoteError: {message: 'Incorrect URL'}});
        return;
      }

      const fileName = getFileNameForRemoteUrl(remoteUrl, format);
      const downloading = intl.formatMessage({id: 'fileUploader.downloading'});
      this.setState({
        remoteLoading: true,
        remoteError: null,
        remoteProgress: {
          [fileName]: {
            fileName,
            percent: 0,
            message: downloading,
            error: null
          }
        }
      });

      try {
        let lastUpdate = 0;
        const file = await fetchRemoteFileAsKeplerFile(remoteUrl, format, ({percent}) => {
          const now = Date.now();
          if (percent < 1 && now - lastUpdate < 100) {
            return;
          }
          lastUpdate = now;
          this.setState(prev => {
            const name = Object.keys(prev.remoteProgress)[0] || fileName;
            return {
              remoteProgress: {
                [name]: {
                  fileName: name,
                  percent,
                  message: downloading,
                  error: null
                }
              }
            };
          });
        });
        this.setState(
          {
            files: [file],
            errorFiles: [],
            dragOver: false
          },
          () => this.props.onFileUpload([file])
        );
      } catch (error) {
        this.setState({
          remoteLoading: false,
          remoteProgress: {},
          remoteError: {
            message: error instanceof Error ? error.message : `Failed to load ${remoteUrl}`
          }
        });
      }
    };

    render() {
      const {
        dragOver,
        files,
        errorFiles,
        remoteUrl,
        remoteFormat,
        remoteError,
        remoteLoading,
        remoteProgress
      } = this.state;
      const {fileLoading, fileLoadingProgress, theme, intl} = this.props;
      const {fileExtensions = [], displayedFileExtensions} = this.props;
      const iconExtensions = displayedFileExtensions?.length
        ? displayedFileExtensions
        : fileExtensions;
      const showFormatSelector = getApplicationConfig().enableRemoteFileFormatSelector;
      const fileUploadInfoText = `${intl.formatMessage({
        id: 'fileUploader.configUploadMessage'
      })}(${GUIDES_FILE_FORMAT_DOC}).`;
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
                <Markdown
                  options={{
                    overrides: {
                      a: {
                        component: LinkRenderer
                      }
                    }
                  }}
                >
                  {fileUploadInfoText}
                </Markdown>
              </StyledUploadMessage>
              <StyledFileDrop $dragOver={dragOver}>
                <StyledDropBody>
                  <StyledFileTypeFow className="file-type-row">
                    {iconExtensions.map(ext => (
                      <FileType key={ext} ext={ext} height="50px" fontSize="9px" />
                    ))}
                  </StyledFileTypeFow>
                  {fileLoading || remoteLoading ? (
                    <FileUploadProgress
                      fileLoadingProgress={getCombinedLoadProgress({
                        fileLoading,
                        fileLoadingProgress,
                        remoteProgress
                      })}
                      theme={theme}
                    />
                  ) : (
                    <>
                      <StyledDragNDropIcon
                        style={{opacity: dragOver ? 0.5 : 1}}
                        className="file-upload-display-message"
                      >
                        <DragNDrop height="36px" />
                        {errorFiles.length ? (
                          <WarningMsg>
                            <FormattedMessage
                              id={'fileUploader.fileNotSupported'}
                              values={{errorFiles: errorFiles.join(', ')}}
                            />
                          </WarningMsg>
                        ) : null}
                      </StyledDragNDropIcon>
                      {!files.length ? (
                        <StyledDragFileWrapper>
                          <StyledActionLine>
                            <FormattedMessage
                              id={'fileUploader.dropMessage'}
                              values={{
                                browse: (
                                  <UploadButton key="browse" onUpload={this._handleFileInput}>
                                    {intl.formatMessage({id: 'fileUploader.browseFiles'})}
                                  </UploadButton>
                                )
                              }}
                            />
                          </StyledActionLine>
                          <StyledRemoteUrlForm
                            className="file-uploader__remote-url"
                            onClick={event => event.stopPropagation()}
                          >
                            <StyledRemoteUrlRow>
                              <StyledRemoteUrlInput
                                type="url"
                                value={remoteUrl}
                                aria-label={intl.formatMessage({
                                  id: 'fileUploader.urlPlaceholder'
                                })}
                                placeholder={intl.formatMessage({
                                  id: 'fileUploader.urlPlaceholder'
                                })}
                                onChange={this._onRemoteUrlChange}
                                onKeyDown={this._onRemoteUrlKeyDown}
                                disabled={remoteLoading}
                              />
                              {showFormatSelector ? (
                                <StyledRemoteFormatSelect
                                  className="file-uploader__remote-format"
                                  aria-label={intl.formatMessage({id: 'fileUploader.format'})}
                                  value={remoteFormat}
                                  onChange={this._onRemoteFormatChange}
                                  disabled={remoteLoading}
                                >
                                  {getAcceptedRemoteFileFormats().map(format => (
                                    <option key={format} value={format}>
                                      {format === 'auto'
                                        ? intl.formatMessage({id: 'fileUploader.formatAuto'})
                                        : format.toUpperCase()}
                                    </option>
                                  ))}
                                </StyledRemoteFormatSelect>
                              ) : null}
                              <StyledRemoteFetchButton
                                type="button"
                                cta
                                small
                                disabled={!remoteUrl || remoteLoading}
                                onClick={this._handleLoadRemoteFile}
                              >
                                <FormattedMessage id={'fileUploader.fetch'} />
                              </StyledRemoteFetchButton>
                            </StyledRemoteUrlRow>
                            {remoteError ? <WarningMsg>{remoteError.message}</WarningMsg> : null}
                          </StyledRemoteUrlForm>
                        </StyledDragFileWrapper>
                      ) : null}
                    </>
                  )}
                </StyledDropBody>
                {fileLoading || remoteLoading ? null : (
                  <StyledDisclaimer>
                    <FormattedMessage id={'fileUploader.disclaimer'} />
                  </StyledDisclaimer>
                )}
              </StyledFileDrop>
            </FileDrop>
          ) : null}
        </StyledFileUpload>
      );
    }
  }

  return injectIntl(FileUpload);
}

export default FileUploadFactory;
export const FileUpload = FileUploadFactory();
