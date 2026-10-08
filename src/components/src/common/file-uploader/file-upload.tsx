// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import styled from 'styled-components';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import UploadButton from './upload-button';
import {DragNDrop, FileType} from '../icons';
import FileDrop from './file-drop';
import UploadFileList, {UploadFileListItem} from './upload-file-list';
import {FileLoading, FileLoadingProgress} from '@kepler.gl/types';

import {GUIDES_FILE_FORMAT_DOC} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {getAcceptedRemoteFileFormats, isRemoteDatasetUrl} from '@kepler.gl/processors';
import {media} from '@kepler.gl/styles';
import {getApplicationConfig, getError} from '@kepler.gl/utils';
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
  flex: 1;
  min-width: 0;
  width: auto;
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

const UploadColumns = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  width: 100%;

  ${media.portable`
    flex-direction: column;
  `}
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
  /** Parsed files held until Add Data, used if this uploader remounts. */
  stagedToAdd?: Array<{
    info?: {label?: string; format?: string};
    metadata?: {source?: string};
  }> | null;
  /** Stage a remote URL without downloading it. Add Data runs the remote load. */
  onAddRemoteDataset?: (remote: {url: string; format?: string}) => void;
  /** Keys of datasets the user unchecked. Omitted keys stay selected. */
  deselectedDatasets?: Record<string, boolean>;
  onToggleDataset?: (key: string) => void;
  /** Dataset replace does not accept a saved map. */
  replaceDataset?: boolean;
} & WrappedComponentProps;

type FileUploadState = {
  dragOver: boolean;
  fileLoading: FileLoading | false;
  files: File[];
  errorFiles: string[];
  remoteUrl: string;
  remoteFormat: string;
  remoteError: {message: string} | null;
  deselectedDatasets: Record<string, boolean>;
};

function formatFileSize(size?: number): string {
  if (!Number.isFinite(size)) {
    return '';
  }
  const bytes = size as number;
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string): string {
  const part = name.includes('.') ? name.split('.').pop() : '';
  return part && part !== name ? part : '';
}

/**
 * A zip is only a dataset when parsing keeps its name (a single shapefile).
 * Once it has expanded into other files, drop the archive row so those files
 * are the only lines under "To add to map".
 */
function archiveExpandedAway(
  fileName: string,
  progress: FileLoadingProgress,
  stagedToAdd: Array<{info?: {label?: string}; metadata?: {source?: string}}> | null | undefined,
  fileLoading: unknown,
  droppedNames: Set<string>
): boolean {
  if (extensionOf(fileName).toLowerCase() !== 'zip') {
    return false;
  }
  if (progress[fileName]?.error) {
    return false;
  }
  const keptAsDataset = (stagedToAdd || []).some(
    item => !item?.metadata?.source && item?.info?.label === fileName
  );
  if (keptAsDataset || (fileLoading && progress[fileName])) {
    return false;
  }
  const unpackedName = (name?: string) => Boolean(name && !droppedNames.has(name));
  const unpackedFile = (stagedToAdd || []).some(
    item => !item?.metadata?.source && unpackedName(item?.info?.label)
  );
  const unpackedProgress = Object.keys(progress).some(unpackedName);
  return unpackedFile || unpackedProgress;
}

function fileListStatus(
  intl,
  file: {size?: number},
  progress: FileLoadingProgress[string] | undefined,
  loading: boolean
): Pick<UploadFileListItem, 'status' | 'percent' | 'isError' | 'isSuccess'> {
  if (progress?.error) {
    return {
      status: getError(progress.error) || intl.formatMessage({id: 'fileUploader.unableToLoad'}),
      percent: progress.percent || 0,
      isError: true,
      isSuccess: false
    };
  }
  if (!loading) {
    const size = formatFileSize(file.size);
    return {
      status: size
        ? intl.formatMessage({id: 'fileUploader.readyToAdd'}, {size})
        : intl.formatMessage({id: 'fileUploader.readyToAddNoSize'}),
      percent: 1,
      isError: false,
      isSuccess: true
    };
  }
  const size = formatFileSize(file.size);
  const loaded = formatFileSize((progress?.percent || 0) * (file.size || 0));
  return {
    status:
      size && loaded
        ? intl.formatMessage({id: 'fileUploader.loadingProgress'}, {loaded, total: size})
        : progress?.message || intl.formatMessage({id: 'fileUploader.loading'}),
    percent: progress?.percent || 0,
    isError: false,
    isSuccess: false
  };
}

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
      deselectedDatasets: {}
    };

    static getDerivedStateFromProps(props, state) {
      if (state.fileLoading !== props.fileLoading) {
        return {fileLoading: props.fileLoading};
      }
      return null;
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

      this.setState(
        prev => ({
          files: [...prev.files, ...filesToLoad],
          errorFiles: [...prev.errorFiles, ...errorFiles],
          dragOver: false
        }),
        () => (filesToLoad.length ? this.props.onFileUpload(filesToLoad) : null)
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

    _toggleDataset = (key: string) => {
      if (!key) {
        return;
      }
      if (this.props.onToggleDataset) {
        this.props.onToggleDataset(key);
        return;
      }
      this.setState(prev => ({
        deselectedDatasets: {
          ...prev.deselectedDatasets,
          [key]: !prev.deselectedDatasets[key]
        }
      }));
    };

    _handleLoadRemoteFile = () => {
      const {remoteUrl, remoteFormat, remoteError} = this.state;
      const showFormatSelector = getApplicationConfig().enableRemoteFileFormatSelector;
      const format = showFormatSelector && remoteFormat !== 'auto' ? remoteFormat : undefined;
      if (!remoteUrl || remoteError) {
        if (!remoteUrl) {
          this.setState({remoteError: {message: 'Incorrect URL'}});
        }
        return;
      }
      if (!isRemoteDatasetUrl(remoteUrl)) {
        this.setState({remoteError: {message: 'Incorrect URL'}});
        return;
      }

      this.props.onAddRemoteDataset?.({url: remoteUrl, ...(format ? {format} : {})});
      this.setState({remoteUrl: '', remoteError: null});
    };

    render() {
      const {dragOver, files, errorFiles, remoteUrl, remoteFormat, remoteError} = this.state;
      const {
        fileLoading,
        fileLoadingProgress,
        intl,
        stagedToAdd,
        deselectedDatasets: deselectedFromProps
      } = this.props;
      const deselected = deselectedFromProps || this.state.deselectedDatasets;
      const selectionFor = (
        item: Omit<UploadFileListItem, 'id' | 'selectable' | 'selected' | 'onToggle'>,
        key: string,
        selectable: boolean
      ): UploadFileListItem => ({
        ...item,
        id: key,
        selectable,
        selected: selectable && !deselected[key],
        selectionLabel: intl.formatMessage({id: 'fileUploader.includeDataset'}, {name: item.name}),
        onToggle: selectable ? () => this._toggleDataset(key) : undefined
      });
      const {fileExtensions = [], displayedFileExtensions} = this.props;
      const iconExtensions = displayedFileExtensions?.length
        ? displayedFileExtensions
        : fileExtensions;
      const showFormatSelector = getApplicationConfig().enableRemoteFileFormatSelector;
      const fileUploadInfoText = `${intl.formatMessage({
        id: this.props.replaceDataset
          ? 'fileUploader.replaceUploadMessage'
          : 'fileUploader.configUploadMessage'
      })}(${GUIDES_FILE_FORMAT_DOC}).`;
      const progress = fileLoadingProgress || {};
      const uploadItems: UploadFileListItem[] = [];
      const seen = new Set<string>();
      const localNames = new Set(files.map(file => file.name));
      (stagedToAdd || []).forEach(item => {
        const name = item?.info?.label;
        const source = item?.metadata?.source;
        if (!name || seen.has(source || name)) {
          return;
        }
        if (!source && localNames.has(name)) {
          return;
        }
        const key = source || name;
        seen.add(key);
        uploadItems.push(
          selectionFor(
            {
              name,
              ext: extensionOf(name) || 'url',
              status: source || intl.formatMessage({id: 'fileUploader.readyToAddNoSize'}),
              percent: 1,
              isSuccess: true
            },
            key,
            true
          )
        );
      });
      files.forEach(file => {
        if (
          seen.has(file.name) ||
          archiveExpandedAway(file.name, progress, stagedToAdd, fileLoading, localNames)
        ) {
          return;
        }
        seen.add(file.name);
        const fileProgress = progress[file.name];
        const status = fileListStatus(
          intl,
          file,
          fileProgress,
          Boolean(fileLoading && fileProgress)
        );
        uploadItems.push(
          selectionFor(
            {
              name: file.name,
              ext: extensionOf(file.name),
              ...status
            },
            file.name,
            !status.isError
          )
        );
      });
      // Files unpacked from a zip are not in the drop list. Show their progress
      // until they are staged under their own names.
      Object.values(progress).forEach(item => {
        if (!item?.fileName || seen.has(item.fileName)) {
          return;
        }
        seen.add(item.fileName);
        const status = fileListStatus(intl, {}, item, Boolean(fileLoading));
        uploadItems.push(
          selectionFor(
            {
              name: item.fileName,
              ext: extensionOf(item.fileName),
              ...status
            },
            item.fileName,
            Boolean(status.isSuccess) && !status.isError
          )
        );
      });
      errorFiles.forEach(name => {
        if (seen.has(name)) {
          return;
        }
        seen.add(name);
        uploadItems.push({
          name,
          ext: extensionOf(name),
          status: intl.formatMessage({id: 'fileUploader.unsupported'}),
          percent: 0,
          isError: true,
          isSuccess: false
        });
      });
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
              <UploadColumns>
                <StyledFileDrop $dragOver={dragOver}>
                  <StyledDropBody>
                    <StyledFileTypeFow className="file-type-row">
                      {iconExtensions.map(ext => (
                        <FileType key={ext} ext={ext} height="50px" fontSize="9px" />
                      ))}
                    </StyledFileTypeFow>
                    <StyledDragNDropIcon
                      style={{opacity: dragOver ? 0.5 : 1}}
                      className="file-upload-display-message"
                    >
                      <DragNDrop height="36px" />
                    </StyledDragNDropIcon>
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
                          />
                          {showFormatSelector ? (
                            <StyledRemoteFormatSelect
                              className="file-uploader__remote-format"
                              aria-label={intl.formatMessage({id: 'fileUploader.format'})}
                              value={remoteFormat}
                              onChange={this._onRemoteFormatChange}
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
                            className="file-uploader__remote-add"
                            cta
                            small
                            disabled={!remoteUrl}
                            onClick={this._handleLoadRemoteFile}
                          >
                            <FormattedMessage id={'fileUploader.addUrl'} />
                          </StyledRemoteFetchButton>
                        </StyledRemoteUrlRow>
                        {remoteError ? <WarningMsg>{remoteError.message}</WarningMsg> : null}
                      </StyledRemoteUrlForm>
                    </StyledDragFileWrapper>
                  </StyledDropBody>
                  <StyledDisclaimer>
                    <FormattedMessage id={'fileUploader.disclaimer'} />
                  </StyledDisclaimer>
                </StyledFileDrop>
                <UploadFileList
                  title={
                    uploadItems.length ? intl.formatMessage({id: 'fileUploader.toAdd'}) : undefined
                  }
                  items={uploadItems}
                />
              </UploadColumns>
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
