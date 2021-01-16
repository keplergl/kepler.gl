// Copyright (c) 2021 Uber Technologies, Inc.
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

import React from 'react';
import styled from 'styled-components';
import {CenterVerticalFlexbox} from 'components/common/styled-components';
import {UploadAnimation} from './status-panel';
import ImageModalContainer from './image-modal-container';
import {FormattedMessage} from 'localization';

/** @typedef {import('./overwrite-map-modal').OverwriteMapModalProps} OverwriteMapModalProps */

const StyledMsg = styled.div`
  margin-top: 24px;
  font-size: 14px;
`;

const StyledTitle = styled.span`
  font-weight: 600;
  color: black;
`;

const StyledIcon = styled.div`
  margin-top: 24px;
`;

const StyledOverwriteMapModal = styled(CenterVerticalFlexbox)`
  padding: 24px 12px;
  min-height: 220px;
`;

const OverwriteMapModalFactory = () => {
  /**
   * @type {React.FunctionComponent<OverwriteMapModalProps>}
   */
  const OverwriteMapModal = ({
    mapSaved,
    title,
    currentProvider,
    cloudProviders,
    isProviderLoading,
    onUpdateImageSetting,
    cleanupExportImage
  }) => {
    const provider = cloudProviders.find(cp => cp.name === currentProvider);
    return (
      <ImageModalContainer
        currentProvider={currentProvider}
        cloudProviders={cloudProviders}
        onUpdateImageSetting={onUpdateImageSetting}
        cleanupExportImage={cleanupExportImage}
      >
        <StyledOverwriteMapModal className="overwrite-map-modal">
          {isProviderLoading ? (
            <StyledMsg>
              <StyledTitle>
                <FormattedMessage id={'modal.overwriteMap.title'} />
              </StyledTitle>
              <UploadAnimation icon={provider && provider.icon} />
            </StyledMsg>
          ) : (
            <>
              <StyledIcon>
                {provider && provider.icon ? <provider.icon height="64px" /> : null}
              </StyledIcon>
              <StyledMsg className="overwrite-map-msg">
                <StyledTitle>{title} </StyledTitle>
                <FormattedMessage id={'modal.overwriteMap.alreadyExists'} values={{mapSaved}} />
              </StyledMsg>
            </>
          )}
        </StyledOverwriteMapModal>
      </ImageModalContainer>
    );
  };
  return OverwriteMapModal;
};

export const OverwriteMapModal = OverwriteMapModalFactory();
export default OverwriteMapModalFactory;
