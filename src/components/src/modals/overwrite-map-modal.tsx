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
import {CenterVerticalFlexbox} from '../common/styled-components';
import {UploadAnimation} from './status-panel';
import {FormattedMessage} from '@kepler.gl/localization';
import ImageModalContainer, {ImageModalContainerProps} from './image-modal-container';
import {Provider} from '@kepler.gl/cloud-providers';
import {cleanupExportImage as cleanupExportImageAction} from '@kepler.gl/actions';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {ModalFooter} from '../common/modal';

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

type OverwriteMapModalProps = {
  mapSaved: string | null;
  title: string;
  isProviderLoading: boolean;

  // callbacks
  onUpdateImageSetting: ImageModalContainerProps['onUpdateImageSetting'];
  cleanupExportImage: typeof cleanupExportImageAction;
  onConfirm: (provider: Provider) => void;
  onCancel: () => void;
};

const CONFIRM_BUTTON = {
  large: true,
  children: 'Yes',
  disabled: false
};

const OverwriteMapModalFactory = () => {
  /**
   * @type {React.FunctionComponent<OverwriteMapModalProps>}
   */
  const OverwriteMapModal: React.FC<OverwriteMapModalProps> = ({
    mapSaved,
    title,
    isProviderLoading,
    onUpdateImageSetting,
    cleanupExportImage,
    onCancel,
    onConfirm
  }) => {
    const {provider} = useCloudListProvider();

    const confirmButton = useMemo(
      () => ({
        ...CONFIRM_BUTTON,
        disabled: !provider
      }),
      [provider]
    );

    return (
      <ImageModalContainer
        provider={provider}
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
        <ModalFooter
          cancel={onCancel}
          confirm={() => provider && onConfirm(provider)}
          confirmButton={confirmButton}
        />
      </ImageModalContainer>
    );
  };
  return OverwriteMapModal;
};

export const OverwriteMapModal = OverwriteMapModalFactory();
export default OverwriteMapModalFactory;
