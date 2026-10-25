// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import ImageModalContainer, {ImageModalContainerProps} from './image-modal-container';
import StatusPanel, {UploadAnimation} from './status-panel';
import {ProviderSelect} from './cloud-components/provider-select';
import {CloudStorageDisclaimer} from './cloud-components/cloud-storage-disclaimer';
import {MAP_THUMBNAIL_DIMENSION, MAP_INFO_CHARACTER, dataTestIds} from '@kepler.gl/constants';

import {
  StyledModalContent,
  InputLight,
  StyledExportSection,
  StyledModalSection
} from '../common/styled-components';
import ImagePreview from '../common/image-preview';
import {FormattedMessage} from '@kepler.gl/localization';
import {MapInfo, ExportImage} from '@kepler.gl/types';
import {Provider} from '@kepler.gl/cloud-providers';
import {setMapInfo, cleanupExportImage as cleanupExportImageAction} from '@kepler.gl/actions';
import {ModalFooter} from '../common/modal';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';

const StyledSaveMapModal = styled.div.attrs({
  className: 'save-map-modal'
})`
  .save-map-modal-content {
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .description {
    width: 300px;
  }

  .image-preview-panel {
    width: 300px;

    .image-preview {
      padding: 0;
    }
  }

  .map-info-panel {
    flex-direction: column;
  }

  .save-map-modal-description {
    .modal-section-subtitle {
      margin-left: 6px;
    }
  }
`;

const StyledCompactExportSection = styled(StyledExportSection)`
  margin: 5px 0;
`;

const nop = () => {
  return;
};

type CharacterLimits = {
  title?: number;
  description?: number;
};

type SaveMapModalProps = {
  mapInfo: MapInfo;
  exportImage: ExportImage;
  isProviderLoading: boolean;
  providerError?: Error;
  characterLimits?: CharacterLimits;
  fileName?: string;
  onChangeFileName?: (fileName: string) => void;
  /** Latest name and description. Applied when the map is saved, not while typing. */
  onMapInfoDraft?: (info: {title: string; description: string}) => void;

  // callbacks
  onUpdateImageSetting: ImageModalContainerProps['onUpdateImageSetting'];
  cleanupExportImage: typeof cleanupExportImageAction;
  onSetMapInfo: typeof setMapInfo;
  onConfirm: (provider: Provider) => void;
  onCancel: () => void;
};

type MapInfoPanelProps = Pick<
  SaveMapModalProps,
  'mapInfo' | 'characterLimits' | 'fileName' | 'onChangeFileName'
> & {
  onChangeInput: (
    type: string,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
};

export const MapInfoPanel: React.FC<MapInfoPanelProps> = ({
  mapInfo,
  characterLimits,
  fileName = '',
  onChangeFileName,
  onChangeInput
}) => {
  const {description = '', title = ''} = mapInfo;
  return (
    <div className="selection map-info-panel" data-testid={dataTestIds.providerMapInfoPanel}>
      <StyledModalSection className="save-map-modal-file-name">
        <label className="modal-section-title" htmlFor="save-map-file-name">
          <FormattedMessage id="modal.exportFileName.title" />
        </label>
        <div>
          <InputLight
            id="save-map-file-name"
            type="text"
            value={fileName}
            onChange={event => onChangeFileName?.(event.target.value)}
            placeholder="kepler.gl"
          />
        </div>
      </StyledModalSection>
      <StyledModalSection className="save-map-modal-name">
        <label className="modal-section-title" htmlFor="map-title">
          Name
        </label>
        <div>
          <InputLight
            id="map-title"
            type="text"
            value={title}
            maxLength={characterLimits?.title || MAP_INFO_CHARACTER.title}
            onChange={e => onChangeInput('title', e)}
          />
        </div>
      </StyledModalSection>
      <StyledModalSection className="save-map-modal-description">
        <label className="modal-section-title" htmlFor="map-description">
          Description
        </label>
        <div>
          <InputLight
            id="map-description"
            type="text"
            value={description}
            maxLength={characterLimits?.description || MAP_INFO_CHARACTER.description}
            onChange={e => onChangeInput('description', e)}
          />
        </div>
      </StyledModalSection>
    </div>
  );
};

const SaveMapHeader = ({cloudProviders}) => {
  return (
    <StyledExportSection>
      <div className="description">
        <div className="title">
          <FormattedMessage id={'modal.saveMap.title'} />
        </div>
        <div className="subtitle">
          <FormattedMessage id={'modal.saveMap.subtitle'} />
        </div>
      </div>
      <ProviderSelect cloudProviders={cloudProviders} />
    </StyledExportSection>
  );
};

const STYLED_EXPORT_SECTION_STYLE = {margin: '2px 0'};
const PROVIDER_MANAGER_URL_STYLE = {textDecoration: 'underline'};

function SaveMapModalFactory() {
  const SaveMapModal: React.FC<SaveMapModalProps> = ({
    mapInfo,
    exportImage,
    characterLimits = MAP_INFO_CHARACTER,
    isProviderLoading,
    providerError,
    onUpdateImageSetting = nop,
    cleanupExportImage,
    onSetMapInfo,
    onCancel,
    onConfirm,
    fileName,
    onChangeFileName,
    onMapInfoDraft
  }) => {
    const {provider, cloudProviders} = useCloudListProvider();
    const [draftTitle, setDraftTitle] = useState(mapInfo.title || '');
    const [draftDescription, setDraftDescription] = useState(mapInfo.description || '');

    const onChangeInput = (
      key: string,
      {target: {value}}: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      if (key === 'title') {
        setDraftTitle(value);
      } else if (key === 'description') {
        setDraftDescription(value);
      }
    };

    const confirmButton = useMemo(
      () => ({
        large: true,
        disabled: !provider,
        children: 'modal.button.save'
      }),
      [provider]
    );

    const confirm = useCallback(() => {
      if (provider) {
        const info = {title: draftTitle, description: draftDescription};
        onMapInfoDraft?.(info);
        onSetMapInfo(info);
        onConfirm(provider);
      }
    }, [draftDescription, draftTitle, onConfirm, onMapInfoDraft, onSetMapInfo, provider]);

    return (
      <ImageModalContainer
        provider={provider}
        onUpdateImageSetting={onUpdateImageSetting}
        cleanupExportImage={cleanupExportImage}
      >
        <StyledSaveMapModal>
          <StyledModalContent className="save-map-modal-content">
            <SaveMapHeader cloudProviders={cloudProviders} />
            {provider && (
              <>
                {provider.getManagementUrl ? (
                  <StyledExportSection style={STYLED_EXPORT_SECTION_STYLE}>
                    <div className="selection">
                      <a
                        key={1}
                        href={provider.getManagementUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={PROVIDER_MANAGER_URL_STYLE}
                      >
                        Go to your Kepler.gl {provider.displayName} page
                      </a>
                    </div>
                  </StyledExportSection>
                ) : null}
                <StyledCompactExportSection>
                  <div className="description image-preview-panel">
                    <ImagePreview
                      exportImage={exportImage}
                      width={MAP_THUMBNAIL_DIMENSION.width}
                      showDimension={false}
                    />
                  </div>
                  {isProviderLoading ? (
                    <div
                      data-testid={dataTestIds.providerLoading}
                      className="selection map-saving-animation"
                    >
                      <UploadAnimation icon={provider && provider.icon} />
                    </div>
                  ) : (
                    <MapInfoPanel
                      mapInfo={{...mapInfo, title: draftTitle, description: draftDescription}}
                      characterLimits={characterLimits}
                      fileName={fileName}
                      onChangeFileName={onChangeFileName}
                      onChangeInput={onChangeInput}
                    />
                  )}
                </StyledCompactExportSection>
              </>
            )}
            {providerError ? (
              <StatusPanel
                isLoading={false}
                error={providerError.message}
                providerIcon={provider && provider.icon}
              />
            ) : null}
            <CloudStorageDisclaimer />
          </StyledModalContent>
        </StyledSaveMapModal>
        <ModalFooter cancel={onCancel} confirm={confirm} confirmButton={confirmButton} />
      </ImageModalContainer>
    );
  };

  return SaveMapModal;
}

export default SaveMapModalFactory;
