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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloudTile from './cloud-tile';
import ImageModalContainer from './image-modal-container';

import {
  MAP_THUMBNAIL_DIMENSION,
  MAP_INFO_CHARACTER,
  EXPORT_IMG_RATIOS
} from 'constants/default-settings';

import {
  StyledModalContent,
  InputLight,
  TextAreaLight,
  StyledExportSection,
  StyledModalSection,
  StyledModalInputFootnote
} from 'components/common/styled-components';
import ImagePreview from 'components/common/image-preview';

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
      padding: 0
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

const nop = () => {};

function SaveMapModalFactory() {
  class SaveMapModal extends Component {
    static propTypes = {
      exportImage: PropTypes.object.isRequired,
      mapInfo: PropTypes.object.isRequired,
      isProviderLoading: PropTypes.bool.isRequired,
      thumbWidth: PropTypes.number,
      thumbHeight: PropTypes.number,
      characterLimits: PropTypes.object,
      cloudProviders: PropTypes.arrayOf(PropTypes.object),
      currentProvider: PropTypes.string,
      onSetMapInfo: PropTypes.func.isRequired,
      onSetCloudProvider: PropTypes.func.isRequired,
      onUpdateImageSetting: PropTypes.func.isRequired
    };

    static defaultProps = {
      characterLimits: MAP_INFO_CHARACTER,
      cloudProviders: [],
      currentProvider: null,
      providerError: null,
      isProviderLoading: false,
      onSetCloudProvider: nop
    };

    _onChangeInput = (key, e) => {
      const {
        target: {value}
      } = e;
      this.props.onSetMapInfo({[key]: value});
    };

    render() {
      const {
        mapInfo,
        exportImage,
        characterLimits = {},
        cloudProviders,
        isProviderLoading,
        currentProvider,
        onSetCloudProvider,
        onUpdateImageSetting
      } = this.props;

      return (
        <ImageModalContainer
          currentProvider={currentProvider}
          cloudProviders={cloudProviders}
          onUpdateImageSetting={onUpdateImageSetting}
          onSetCloudProvider={onSetCloudProvider}
        >
        <StyledSaveMapModal>
          <StyledModalContent className="save-map-modal-content">
            <StyledExportSection disabled={isProviderLoading}>
              <div className="description">
                <div className="title">Cloud storage</div>
                <div className="subtitle">
                  Login save map to your personal cloud storage
                </div>
              </div>
              <div className="selection">
                {cloudProviders.map(cloudProvider => (
                  <CloudTile
                    key={cloudProvider.name}
                    onSelect={() => onSetCloudProvider(cloudProvider.name)}
                    onSetCloudProvider={onSetCloudProvider}
                    cloudProvider={cloudProvider}
                    isSelected={cloudProvider.name === currentProvider}
                    isConnected={Boolean(cloudProvider.getAccessToken())}
                  />
                ))}
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
              <div className="selection map-info-panel">
                <StyledModalSection className="save-map-modal-name">
                  <div className="modal-section-title">Name*</div>
                  <div>
                    <InputLight
                      id="map-title"
                      type="text"
                      value={mapInfo.title}
                      onChange={e => this._onChangeInput('title', e)}
                      placeholder="Type map title"
                    />
                  </div>
                </StyledModalSection>
                <StyledModalSection>
                  <div
                    className="save-map-modal-description"
                    style={{display: 'flex'}}
                  >
                    <div className="modal-section-title">Description</div>
                    <div className="modal-section-subtitle">(optional)</div>
                  </div>
                  <div>
                    <TextAreaLight
                      rows="3"
                      id="map-description"
                      style={{resize: 'none'}}
                      value={mapInfo.description}
                      onChange={e => this._onChangeInput('description', e)}
                      placeholder="Type map description"
                    />
                  </div>
                  <StyledModalInputFootnote
                    className="save-map-modal-description__footnote"
                    error={
                      characterLimits.description &&
                      mapInfo.description.length > characterLimits.description
                    }
                  >
                    {mapInfo.description.length}/
                    {characterLimits.description ||
                      MAP_INFO_CHARACTER.description}{' '}
                    characters
                  </StyledModalInputFootnote>
                </StyledModalSection>
              </div>
            </StyledExportSection>
          </StyledModalContent>
        </StyledSaveMapModal>
        </ImageModalContainer>
      );
    }
  }
  return SaveMapModal;
}

export default SaveMapModalFactory;
