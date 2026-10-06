// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import get from 'es-toolkit/compat/get';
import {IntlShape, useIntl} from 'react-intl';

import {Button} from '../common';
import Checkbox from '../common/checkbox';
import {Docs} from '../common/icons';
import TippyTooltip from '../common/tippy-tooltip';
import FileUploadFactory from '../common/file-uploader/file-upload';
import {selectedStagedDatasets} from '../common/file-uploader/upload-file-list';
import LoadStorageMapFactory from './load-storage-map';
import LoadTilesetFactory from './tilesets-modals/load-tileset';
import ModalTabsFactory from './modal-tabs';
import LoadingDialog from './loading-dialog';
import AutoCreateLayersCheckbox from './auto-create-layers-checkbox';

import {LOADING_METHODS} from '@kepler.gl/constants';
import {media} from '@kepler.gl/styles';
import {FileLoading, FileLoadingProgress, LoadFiles} from '@kepler.gl/types';

const StyledLoadDataModal = styled.div.attrs({
  className: 'load-data-modal'
})<{$withFooter?: boolean}>`
  padding: 10px 0 ${props => (props.$withFooter ? 0 : '50px')};
  min-height: 360px;
  display: flex;
  flex-direction: column;

  ${props =>
    props.$withFooter
      ? ''
      : media.portable`
          padding-bottom: 34px;
        `}
`;

const AddDataBar = styled.div.attrs({
  className: 'add-data-bar'
})`
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  /* Pull the rule out to the dialog edges. Side padding matches the modal. */
  margin: 16px -72px 0;
  padding: 16px 72px;
  border-top: 1px solid #d8d8d8;

  ${media.portable`
    margin-left: -36px;
    margin-right: -36px;
    padding-left: 36px;
    padding-right: 36px;
  `}
`;

const StagedLabel = styled.div`
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.subtextColorLT};
  font-size: 12px;
`;

const FooterError = styled.div`
  color: ${props => props.theme.negativeBtnColor};
  font-size: 12px;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AddDataActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex-shrink: 0;
`;

const Dimmed = styled.div<{$dimmed?: boolean}>`
  opacity: ${props => (props.$dimmed ? 0.4 : 1)};
  pointer-events: ${props => (props.$dimmed ? 'none' : 'auto')};
`;

const ModalMain = styled(Dimmed)`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const ProcessingSpinner = styled.span.attrs({
  className: 'add-data-bar__spinner',
  'aria-hidden': true
})`
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderColorLT};
  border-top-color: ${props => props.theme.primaryBtnBgd};
  will-change: transform;
  animation: ${spin} 0.7s linear infinite;
`;

const ProcessingStatus = styled.div.attrs({
  className: 'add-data-bar__processing',
  role: 'status'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
`;

const noop = () => {
  return;
};
const getDefaultMethod = <T,>(methods: T[] = []) =>
  Array.isArray(methods) ? get(methods, [0]) : null;
export interface LoadingMethod {
  id: string;
  label: string;
  elementType: React.ComponentType<any>;
  tabElementType?: React.ComponentType<{onClick: React.MouseEventHandler; intl: IntlShape}>;
}

export type LoadDataOptions = {
  autoCreateLayers?: boolean;
  /** Staged datasets the user left checked. */
  datasets?: Array<{info?: {label?: string}; metadata?: {source?: string}}>;
  /** When replacing, drop the original dataset after layers and filters are remapped. */
  deleteOriginalDataset?: boolean;
};

const RemoveOriginalRow = styled.div.attrs({
  className: 'remove-original-dataset'
})`
  display: flex;
  align-items: center;
  min-width: 0;

  .kg-checkbox {
    margin-left: 0;
    min-width: 0;
  }

  .kg-checkbox__label {
    margin-bottom: 0;
    margin-left: 0;
    color: ${props => props.theme.textColorLT};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const InfoButton = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.subtextColorLT};
  cursor: help;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.theme.textColorLT};
  }
`;

type TilesetDraft = {
  canAdd: boolean;
  loading?: boolean;
  error?: string | null;
  dataset?: {name: string; type: string; metadata: Record<string, any>};
  metadata?: Record<string, any>;
};

function progressErrors(progress: FileLoadingProgress = {}): string[] {
  return Object.values(progress)
    .map(item => {
      const error = item?.error;
      if (!error) {
        return '';
      }
      return typeof error === 'string' ? error : error.message || '';
    })
    .filter(Boolean);
}

type LoadDataModalProps = {
  // call backs
  onFileUpload: (files: File[]) => void;
  onAddRemoteDataset?: (remote: {url: string; format?: string}) => void;
  onConfirmAddData?: (options: LoadDataOptions) => void;
  stagedToAdd?: Array<{
    info?: {id?: string; label?: string};
    metadata?: {source?: string};
  }> | null;
  onLoadCloudMap: (provider: any, vis: any) => void;
  onTilesetAdded: (
    tileset: {name: string; type: string; metadata: Record<string, any>},
    processedMetadata?: Record<string, any>,
    options?: LoadDataOptions
  ) => void;
  fileLoading: FileLoading | false;
  loadingMethods?: LoadingMethod[];
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions: string[];
  /** Extensions shown as icons in the uploader. Defaults to `fileExtensions`. */
  displayedFileExtensions?: string[];
  isCloudMapLoading: boolean;
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
  onClose?: (...args: any) => any;

  loadFiles: LoadFiles;
  fileLoadingProgress: FileLoadingProgress;

  /** When set, confirming the staged upload replaces this dataset. */
  replaceDatasetId?: string | null;
  replaceDatasetLabel?: string;
};

LoadDataModalFactory.deps = [
  ModalTabsFactory,
  FileUploadFactory,
  LoadStorageMapFactory,
  LoadTilesetFactory
];

export function LoadDataModalFactory(
  ModalTabs: ReturnType<typeof ModalTabsFactory>,
  FileUpload: ReturnType<typeof FileUploadFactory>,
  LoadStorageMap: ReturnType<typeof LoadStorageMapFactory>,
  LoadTileset: ReturnType<typeof LoadTilesetFactory>
) {
  const defaultLoadingMethods = [
    {
      id: LOADING_METHODS.upload,
      label: 'modal.loadData.upload',
      elementType: FileUpload
    },
    {
      id: LOADING_METHODS.tileset,
      label: 'modal.loadData.tileset',
      elementType: LoadTileset
    },
    {
      id: LOADING_METHODS.storage,
      label: 'modal.loadData.storage',
      elementType: LoadStorageMap
    }
  ];

  const LoadDataModal: React.FC<LoadDataModalProps> & {
    defaultLoadingMethods: LoadDataModalProps['loadingMethods'];
  } = ({
    onFileUpload = noop,
    onAddRemoteDataset = noop,
    onTilesetAdded = noop,
    onConfirmAddData = noop,
    onClose = noop,
    fileLoading = false,
    fileLoadingProgress = {},
    stagedToAdd = null,
    loadingMethods = defaultLoadingMethods,
    isCloudMapLoading,
    replaceDatasetId,
    replaceDatasetLabel,
    ...restProps
  }) => {
    const intl = useIntl();
    const isReplace = Boolean(replaceDatasetId);
    const availableMethods = isReplace
      ? loadingMethods.filter(method => method.id === LOADING_METHODS.upload)
      : loadingMethods;
    const [autoCreateLayers, setAutoCreateLayers] = useState(true);
    const [preparingLayers, setPreparingLayers] = useState(false);
    const prepareFrames = useRef<number[]>([]);
    useEffect(() => {
      const frames = prepareFrames.current;
      return () => {
        frames.forEach(id => window.cancelAnimationFrame(id));
      };
    }, []);
    const [deleteOriginalDataset, setDeleteOriginalDataset] = useState(true);
    const [deselectedDatasets, setDeselectedDatasets] = useState<Record<string, boolean>>({});
    const onToggleDataset = useCallback((key: string) => {
      setDeselectedDatasets(prev => ({...prev, [key]: !prev[key]}));
    }, []);
    const [tilesetDraft, setTilesetDraft] = useState<TilesetDraft | null>(null);
    const onToggleAutoCreateLayers = useCallback(() => {
      setAutoCreateLayers(value => !value);
    }, []);
    const handleFileUpload = useCallback(
      (files: File[]) => {
        onFileUpload(files);
      },
      [onFileUpload]
    );
    const handleTilesetAdded = useCallback(
      (
        tileset: {name: string; type: string; metadata: Record<string, any>},
        processedMetadata?: Record<string, any>
      ) => {
        onTilesetAdded(tileset, processedMetadata, {autoCreateLayers});
      },
      [onTilesetAdded, autoCreateLayers]
    );
    const onTilesetDraftChange = useCallback((draft: TilesetDraft) => {
      setTilesetDraft(draft);
    }, []);
    const [currentMethod, toggleMethod] = useState(getDefaultMethod(availableMethods));
    const selectMethod = useCallback((method: LoadingMethod) => {
      setTilesetDraft(null);
      toggleMethod(method);
    }, []);
    const isUpload = currentMethod?.id === LOADING_METHODS.upload;
    const isTileset = currentMethod?.id === LOADING_METHODS.tileset;
    const showAddBar = isUpload || isTileset;
    const datasetsToAdd = selectedStagedDatasets(stagedToAdd, deselectedDatasets);
    const canAdd = isTileset
      ? Boolean(tilesetDraft?.canAdd) && !tilesetDraft?.loading
      : Boolean(datasetsToAdd.length) && !fileLoading;
    const onAddData = useCallback(() => {
      if (!canAdd || preparingLayers) {
        return;
      }
      const commit = () => {
        if (isTileset) {
          if (tilesetDraft?.canAdd && tilesetDraft.dataset) {
            handleTilesetAdded(tilesetDraft.dataset, tilesetDraft.metadata);
          }
          return;
        }
        onConfirmAddData(
          isReplace
            ? {autoCreateLayers: false, datasets: datasetsToAdd, deleteOriginalDataset}
            : {autoCreateLayers, datasets: datasetsToAdd}
        );
      };
      // Layer creation blocks the main thread. Paint this status first so the
      // spinner can keep moving on the compositor during that work.
      // Replace never creates layers, so it commits immediately.
      if (autoCreateLayers && !isReplace) {
        setPreparingLayers(true);
        const first = window.requestAnimationFrame(() => {
          const second = window.requestAnimationFrame(commit);
          prepareFrames.current.push(second);
        });
        prepareFrames.current.push(first);
        return;
      }
      commit();
    }, [
      autoCreateLayers,
      canAdd,
      datasetsToAdd,
      deleteOriginalDataset,
      handleTilesetAdded,
      isReplace,
      isTileset,
      onConfirmAddData,
      preparingLayers,
      tilesetDraft
    ]);
    const uploadError = !fileLoading && isUpload ? progressErrors(fileLoadingProgress)[0] : '';
    const tilesetError = isTileset ? tilesetDraft?.error : '';

    const currentModalProps = {
      ...restProps,
      onFileUpload: handleFileUpload,
      onTilesetAdded: handleTilesetAdded,
      fileLoading,
      fileLoadingProgress,
      isCloudMapLoading,
      ...(isUpload
        ? {
            stagedToAdd,
            onAddRemoteDataset,
            deselectedDatasets,
            onToggleDataset,
            replaceDataset: isReplace
          }
        : {}),
      ...(isTileset ? {confirmInParent: true, onTilesetDraftChange} : {})
    };
    const ElementType = currentMethod?.elementType;

    return (
      <StyledLoadDataModal $withFooter={showAddBar}>
        <ModalMain $dimmed={preparingLayers}>
          <ModalTabs
            currentMethod={currentMethod?.id}
            loadingMethods={availableMethods}
            toggleMethod={selectMethod}
          />
          {isCloudMapLoading ? (
            <LoadingDialog size={64} />
          ) : (
            ElementType && (
              <ElementType key={currentMethod?.id} intl={intl} {...currentModalProps} />
            )
          )}
        </ModalMain>
        {showAddBar ? (
          <AddDataBar>
            <Dimmed $dimmed={preparingLayers}>
              {isReplace ? (
                <RemoveOriginalRow>
                  <Checkbox
                    id="delete-original-dataset"
                    type="checkbox"
                    label={intl.formatMessage(
                      {id: 'modal.replaceDataset.removeOriginal'},
                      {datasetName: replaceDatasetLabel || replaceDatasetId || ''}
                    )}
                    checked={deleteOriginalDataset}
                    onChange={() => setDeleteOriginalDataset(value => !value)}
                  />
                  <TippyTooltip
                    placement="top"
                    isLightTheme
                    render={() => (
                      <div>
                        {intl.formatMessage({id: 'modal.replaceDataset.removeOriginalHint'})}
                      </div>
                    )}
                  >
                    <InfoButton
                      aria-label={intl.formatMessage({
                        id: 'modal.replaceDataset.removeOriginalHint'
                      })}
                    >
                      <Docs height="16px" />
                    </InfoButton>
                  </TippyTooltip>
                </RemoveOriginalRow>
              ) : (
                <AutoCreateLayersCheckbox
                  checked={autoCreateLayers}
                  disabled={preparingLayers}
                  onToggle={onToggleAutoCreateLayers}
                />
              )}
            </Dimmed>
            <StagedLabel />
            {uploadError || tilesetError ? (
              <FooterError>{uploadError || tilesetError}</FooterError>
            ) : null}
            {preparingLayers ? (
              <ProcessingStatus
                aria-label={intl.formatMessage({id: 'modal.loadData.processingLayers'})}
              >
                <ProcessingSpinner />
              </ProcessingStatus>
            ) : (
              <AddDataActions>
                <Button type="button" link onClick={onClose}>
                  {intl.formatMessage({id: 'modal.button.defaultCancel'})}
                </Button>
                <Button type="button" cta disabled={!canAdd} onClick={onAddData}>
                  {intl.formatMessage({
                    id: isReplace ? 'modal.button.replace' : 'layerManager.addData'
                  })}
                </Button>
              </AddDataActions>
            )}
          </AddDataBar>
        ) : null}
      </StyledLoadDataModal>
    );
  };

  LoadDataModal.defaultLoadingMethods = defaultLoadingMethods;

  return LoadDataModal;
}

export default LoadDataModalFactory;
