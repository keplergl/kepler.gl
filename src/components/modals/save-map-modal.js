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

import {
  MAP_THUMBNAIL_DIMENSION,
  MAP_INFO_CHARACTER
} from 'constants/default-settings';

import {
  StyledModalContent,
  InputLight,
  TextAreaLight,
  StyledModalVerticalPanel,
  StyledModalSection,
  StyledModalInputFootnote
} from 'components/common/styled-components';
import ImagePreview from 'components/common/image-preview';

const StyledSaveMapModal = styled.div.attrs({
  className: 'save-map-modal'
})`
  .save-map-modal-content {
    min-height: 400px;
  }

  .modal-vertical-panel {
    width: 40%;
  }

  .save-map-modal-description {
    .modal-section-subtitle {
      margin-left: 6px;
    }
  }
`;

function SaveMapModalFactory() {
  class SaveMapModal extends Component {
    static propTypes = {
      exportImage: PropTypes.object.isRequired,
      mapInfo: PropTypes.object.isRequired,
      onSetMapInfo: PropTypes.func.isRequired,
      thumbWidth: PropTypes.number.isRequired,
      thumbHeight: PropTypes.number.isRequired,
      characterLimits: PropTypes.object
    };

    static defaultProps = {
      thumbWidth: MAP_THUMBNAIL_DIMENSION.width,
      thumbHeight: MAP_THUMBNAIL_DIMENSION.height,
      destination: null,
      characterLimits: MAP_INFO_CHARACTER
    };

    componentDidMount() {
      this.props.onUpdateSetting({
        mapW: this.props.thumbWidth,
        mapH: this.props.thumbHeight
      });
    }

    _onChangeInput = (key, e) => {
      const {
        target: {value}
      } = e;
      this.props.onSetMapInfo({[key]: value});
    };

    render() {
      const {mapInfo, exportImage, characterLimits = {}} = this.props;

      return (
        <StyledSaveMapModal>
          <StyledModalContent className="save-map-modal-content">
            <StyledModalVerticalPanel>
              <StyledModalSection className="save-map-modal-name">
                <div className="modal-section-title">Name*</div>
                <div>
                  <InputLight
                    type="text"
                    value={mapInfo.title}
                    onChange={e => this._onChangeInput('title', e)}
                    placeholder="Type your title"
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
                    style={{resize: 'none'}}
                    value={mapInfo.description}
                    onChange={e => this._onChangeInput('description', e)}
                    placeholder="Type your description"
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
            </StyledModalVerticalPanel>
            <ImagePreview
              exportImage={exportImage}
              width={this.props.thumbWidth}
              showDimension={false}
            />
          </StyledModalContent>
        </StyledSaveMapModal>
      );
    }
  }
  return SaveMapModal;
}

export default SaveMapModalFactory;
