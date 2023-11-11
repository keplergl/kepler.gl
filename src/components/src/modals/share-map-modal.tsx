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

import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {themeLT} from '@kepler.gl/styles';
import ImageModalContainer, {ImageModalContainerProps} from './image-modal-container';

import {
  StyledModalContent,
  StyledExportSection,
  InputLight,
  Button
} from '../common/styled-components';
import StatusPanel from './status-panel';
import {FormattedMessage} from '@kepler.gl/localization';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {ProviderSelect} from './cloud-components/provider-select';
import {Provider} from '@kepler.gl/cloud-providers';
import {cleanupExportImage as cleanupExportImageAction} from '@kepler.gl/actions';

export const StyledInputLabel = styled.label`
  font-size: 12px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
`;

export const StyleSharingUrl = styled.div.attrs({
  className: 'sharing-url'
})`
  width: 100%;
  display: flex;
  margin-bottom: 14px;
  flex-direction: column;

  input {
    border-right: 0;
  }

  .button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

interface SharingUrlProps {
  url: string;
  message?: string;
}

export const SharingUrl: React.FC<SharingUrlProps> = ({url, message = ''}) => {
  const [copied, setCopy] = useState(false);
  return (
    <StyleSharingUrl>
      <StyledInputLabel>{message}</StyledInputLabel>
      <div style={{display: 'flex'}}>
        <InputLight type="text" value={url} readOnly />
        <CopyToClipboard text={url} onCopy={() => setCopy(true)}>
          <Button width="80px">{copied ? 'Copied!' : 'Copy'}</Button>
        </CopyToClipboard>
      </div>
    </StyleSharingUrl>
  );
};
const nop = () => {};

const StyledShareMapModal = styled(StyledModalContent)`
  padding: 24px 72px 40px 72px;
  margin: 0 -72px -40px -72px;
  display: flex;
  flex-direction: column;
`;

const StyledInnerDiv = styled.div`
  min-height: 500px;
`;

const UNDERLINE_TEXT_DECORATION_STYLE = {textDecoration: 'underline'};

const ShareMapHeader = ({cloudProviders}) => {
  return (
    <StyledExportSection>
      <div className="description">
        <div className="title">
          <FormattedMessage id={'modal.saveMap.title'} />
        </div>
      </div>
      <ProviderSelect cloudProviders={cloudProviders} />
    </StyledExportSection>
  );
};

interface ShareMapUrlModalFactoryProps {
  isProviderLoading?: boolean;
  isReady?: boolean;
  onExport?: (provider: Provider) => void;
  currentProvider: string | null;
  providerError?: string;
  successInfo?: {shareUrl?: string; folderLink?: string};
  onUpdateImageSetting: ImageModalContainerProps['onUpdateImageSetting'];
  cleanupExportImage: typeof cleanupExportImageAction;
}

export default function ShareMapUrlModalFactory() {
  const ShareMapUrlModal: React.FC<ShareMapUrlModalFactoryProps> = ({
    isProviderLoading = false,
    onExport = nop,
    providerError = null,
    successInfo = {},
    onUpdateImageSetting = nop,
    cleanupExportImage
  }) => {
    const {provider, cloudProviders} = useCloudListProvider();
    const {shareUrl, folderLink} = successInfo;

    useEffect(() => {
      if (provider) {
        onExport(provider);
      }
    }, [provider]);

    return (
      <ThemeProvider theme={themeLT}>
        <ImageModalContainer
          provider={provider}
          onUpdateImageSetting={onUpdateImageSetting}
          cleanupExportImage={cleanupExportImage}
        >
          <StyledShareMapModal className="export-cloud-modal">
            <ShareMapHeader cloudProviders={cloudProviders} />
            {provider && provider.hasSharingUrl() ? (
              <StyledInnerDiv>
                <StyledExportSection>
                  <div className="description">
                    <div className="title">
                      <FormattedMessage id={'modal.shareMap.shareUriTitle'} />
                    </div>
                    <div className="subtitle">
                      <FormattedMessage id={'modal.shareMap.shareUriSubtitle'} />
                    </div>
                  </div>
                  <div className="selection">
                    <div className="title warning">
                      <FormattedMessage id={'modal.shareMap.shareDisclaimer'} />
                    </div>
                  </div>
                </StyledExportSection>
                <StyledExportSection disabled={isProviderLoading}>
                  <div className="description">
                    <div className="title">
                      <FormattedMessage id={'modal.shareMap.cloudTitle'} />
                    </div>
                    <div className="subtitle">
                      <FormattedMessage id={'modal.shareMap.cloudSubtitle'} />
                    </div>
                  </div>
                </StyledExportSection>
                {isProviderLoading || providerError ? (
                  <StatusPanel
                    isLoading={isProviderLoading}
                    error={providerError}
                    providerIcon={provider && provider.icon}
                  />
                ) : null}
                {shareUrl && (
                  <StyledExportSection>
                    <div className="description">
                      <div className="title">Share Url</div>
                    </div>
                    <div className="selection">
                      <SharingUrl key={0} url={shareUrl} />
                      {provider && folderLink && (
                        <a
                          key={1}
                          href={folderLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={UNDERLINE_TEXT_DECORATION_STYLE}
                        >
                          {provider.name}
                        </a>
                      )}
                    </div>
                  </StyledExportSection>
                )}
              </StyledInnerDiv>
            ) : null}
          </StyledShareMapModal>
        </ImageModalContainer>
      </ThemeProvider>
    );
  };

  return ShareMapUrlModal;
}
