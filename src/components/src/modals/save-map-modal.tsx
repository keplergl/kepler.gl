// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {useMemo} from 'react';
import styled from 'styled-components';
import ImageModalContainer, {ImageModalContainerProps} from './image-modal-container';
import {FlexContainer} from '../common/flex-container';
import StatusPanel, {UploadAnimation} from './status-panel';
import {ProviderSelect} from './cloud-components/provider-select';
import {MAP_THUMBNAIL_DIMENSION, MAP_INFO_CHARACTER, ExportImage} from '@kepler.gl/constants';

import {
  StyledModalContent,
  InputLight,
  TextAreaLight,
  StyledExportSection,
  StyledModalSection,
  StyledModalInputFootnote
} from '../common/styled-components';
import ImagePreview from '../common/image-preview';
import {FormattedMessage} from '@kepler.gl/localization';
import {MapInfo} from '@kepler.gl/types';
import {Provider} from '@kepler.gl/cloud-providers';
import {setMapInfo, cleanupExportImage as cleanupExportImageAction} from '@kepler.gl/actions';
import {ModalFooter, useCloudListProvider} from '@kepler.gl/components';

/** @typedef {import('./save-map-modal').SaveMapModalProps} SaveMapModalProps */

const StyledSaveMapModal = styled.div.attrs({
  className: 'save-map-modal'
})`
  .save-map-modal-content {
    min-height: 400px;
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

const nop = _ => {};
const TEXT_AREA_LIGHT_STYLE = {resize: 'none'};

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

  // callbacks
  onUpdateImageSetting: ImageModalContainerProps['onUpdateImageSetting'];
  cleanupExportImage: typeof cleanupExportImageAction;
  onSetMapInfo: typeof setMapInfo;
  onConfirm: (provider: Provider) => void;
  onCancel: () => void;
};

type MapInfoPanelProps = Pick<SaveMapModalProps, 'mapInfo' | 'characterLimits'> & {
  onChangeInput: (
    type: string,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
};

export const MapInfoPanel: React.FC<MapInfoPanelProps> = ({
  mapInfo = {description: '', title: ''},
  characterLimits,
  onChangeInput
}) => (
  <div className="selection map-info-panel">
    <StyledModalSection className="save-map-modal-name">
      <div className="modal-section-title">Name*</div>
      <div>
        <InputLight
          id="map-title"
          type="text"
          value={mapInfo.title}
          onChange={e => onChangeInput('title', e)}
          placeholder="Type map title"
        />
      </div>
    </StyledModalSection>
    <StyledModalSection>
      <FlexContainer className="save-map-modal-description">
        <div className="modal-section-title">Description</div>
        <div className="modal-section-subtitle">(optional)</div>
      </FlexContainer>
      <div>
        <TextAreaLight
          rows={3}
          id="map-description"
          style={TEXT_AREA_LIGHT_STYLE as React.CSSProperties}
          value={mapInfo.description}
          onChange={e => onChangeInput('description', e)}
          placeholder="Type map description"
        />
      </div>
      <StyledModalInputFootnote
        error={
          Boolean(characterLimits?.description) &&
          mapInfo.description.length > Number(characterLimits?.description)
        }
      >
        {mapInfo.description.length}/
        {characterLimits?.description || MAP_INFO_CHARACTER.description} characters
      </StyledModalInputFootnote>
    </StyledModalSection>
  </div>
);

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
    onConfirm
  }) => {
    const {provider, cloudProviders} = useCloudListProvider();

    const onChangeInput = (
      key: string,
      {target: {value}}: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      onSetMapInfo({[key]: value});
    };

    const confirmButton = useMemo(
      () => ({
        large: true,
        disabled: Boolean(!(provider && mapInfo.title)),
        children: 'modal.button.save'
      }),
      [provider, mapInfo]
    );

    return (
      <ImageModalContainer
        provider={provider}
        onUpdateImageSetting={onUpdateImageSetting}
        cleanupExportImage={cleanupExportImage}
      >
        <StyledSaveMapModal>
          <StyledModalContent className="save-map-modal-content">
            <SaveMapHeader cloudProviders={cloudProviders} />
            {provider && provider.getManagementUrl && (
              <>
                <StyledExportSection style={STYLED_EXPORT_SECTION_STYLE}>
                  <div className="description" />
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
                <StyledExportSection>
                  <div className="description image-preview-panel">
                    <ImagePreview
                      exportImage={exportImage}
                      width={MAP_THUMBNAIL_DIMENSION.width}
                      showDimension={false}
                    />
                  </div>
                  {isProviderLoading ? (
                    <div className="selection map-saving-animation">
                      <UploadAnimation icon={provider && provider.icon} />
                    </div>
                  ) : (
                    <MapInfoPanel
                      mapInfo={mapInfo}
                      characterLimits={characterLimits}
                      onChangeInput={onChangeInput}
                    />
                  )}
                </StyledExportSection>
              </>
            )}
            {providerError ? (
              <StatusPanel
                isLoading={false}
                error={providerError.message}
                providerIcon={provider && provider.icon}
              />
            ) : null}
          </StyledModalContent>
        </StyledSaveMapModal>
        <ModalFooter
          cancel={onCancel}
          confirm={() => provider && onConfirm(provider)}
          confirmButton={confirmButton}
        />
      </ImageModalContainer>
    );
  };

  return SaveMapModal;
}

export default SaveMapModalFactory;
