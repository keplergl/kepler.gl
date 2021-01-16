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

import React, {useState} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {themeLT} from 'styles/base';
import ImageModalContainer from './image-modal-container';
import ProviderModalContainer from './provider-modal-container';

import {
  StyledModalContent,
  StyledExportSection,
  InputLight,
  Button
} from 'components/common/styled-components';
import CloudTile from './cloud-tile';
import StatusPanel from './status-panel';
import {FormattedMessage} from 'localization';

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

export const SharingUrl = ({url, message = ''}) => {
  const [copied, setCopy] = useState(false);
  return (
    <StyleSharingUrl>
      <StyledInputLabel>{message}</StyledInputLabel>
      <div style={{display: 'flex'}}>
        <InputLight type="text" value={url} readOnly selected />
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
`;

const StyledInnerDiv = styled.div`
  min-height: 500px;
`;

export default function ShareMapUrlModalFactory() {
  const ShareMapUrlModal = ({
    isProviderLoading,
    isReady,
    onExport,
    cloudProviders,
    currentProvider,
    providerError,
    successInfo,
    onSetCloudProvider,
    onUpdateImageSetting,
    cleanupExportImage
  }) => {
    const {shareUrl, folderLink} = successInfo;
    const provider = currentProvider ? cloudProviders.find(p => p.name === currentProvider) : null;

    return (
      <ThemeProvider theme={themeLT}>
        <ProviderModalContainer
          onSetCloudProvider={onSetCloudProvider}
          cloudProviders={cloudProviders}
          currentProvider={currentProvider}
        >
          <ImageModalContainer
            currentProvider={currentProvider}
            cloudProviders={cloudProviders}
            onUpdateImageSetting={onUpdateImageSetting}
            cleanupExportImage={cleanupExportImage}
          >
            <StyledShareMapModal className="export-cloud-modal">
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
                  <div className="selection">
                    {cloudProviders.map(cloudProvider => (
                      <CloudTile
                        key={cloudProvider.name}
                        onSelect={() => onExport(cloudProvider)}
                        onSetCloudProvider={onSetCloudProvider}
                        cloudProvider={cloudProvider}
                        actionName="Upload"
                        isSelected={cloudProvider.name === currentProvider}
                        isConnected={Boolean(cloudProvider.getAccessToken())}
                        isReady={isReady}
                      />
                    ))}
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
                          style={{textDecoration: 'underline'}}
                        >
                          <FormattedMessage
                            id={'modal.shareMap.gotoPage'}
                            values={{currentProvider}}
                          />
                        </a>
                      )}
                    </div>
                  </StyledExportSection>
                )}
              </StyledInnerDiv>
            </StyledShareMapModal>
          </ImageModalContainer>
        </ProviderModalContainer>
      </ThemeProvider>
    );
  };

  ShareMapUrlModal.defaultProps = {
    isProviderLoading: false,
    onExport: nop,
    cloudProviders: [],
    currentProvider: null,
    providerError: null,
    successInfo: {},
    onSetCloudProvider: nop,
    onUpdateImageSetting: nop
  };

  return ShareMapUrlModal;
}
