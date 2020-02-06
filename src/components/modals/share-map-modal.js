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

import React, {useState, Component} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {themeLT} from 'styles/base';
import ImageModalContainer from './image-modal-container';

import {
  StyledModalContent,
  StyledExportSection,
  InputLight,
  Button
} from 'components/common/styled-components';
import CloudTile from './cloud-tile';
import StatusPanel from './status-panel';
import {SHARE_DISCLAIMER} from 'constants/default-settings';

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

export const SharingUrl = ({url, message}) => {
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

export const MAP_URI = 'demo/map?mapUrl=';

/**
 * Returns a permalink with the given map url: kepler.gl/[]
 * @param mapLink the cloud-providers url used to store the map
 * @returns {string}
 */
export function getMapPermalink(mapLink, fullURL = true) {
  return fullURL
    ? `${window.location.protocol}//${window.location.host}/${MAP_URI}${mapLink}`
    : `/${MAP_URI}${mapLink}`;
}

const StyledShareMapModal = styled(StyledModalContent)`
  padding: 24px 72px 40px 72px;
  margin: 0 -72px -40px -72px;
`;

const StyledInnerDiv = styled.div`
  min-height: 500px;
`;

export default function ShareMapUrlModalFactory() {
  class ShareMapUrlModal extends Component {
    static defaultProps = {
      isLoading: false,
      onExport: nop,
      cloudProviders: [],
      currentProvider: null,
      error: null,
      successInfo: {},
      onSetCloudProvider: nop
    };

    render() {
      const {
        isLoading,
        isReady,
        onExport,
        cloudProviders,
        currentProvider,
        error,
        successInfo,
        onSetCloudProvider,
        onUpdateImageSetting
      } = this.props;
      const {metaUrl, folderLink} = successInfo;
      const provider = currentProvider
        ? cloudProviders.find(p => p.name === currentProvider)
        : null;

      // TODO: A better way to obtain sharingLink
      const sharingLink = metaUrl
        ? provider && provider.getMapPermalink
          ? provider.getMapPermalink(metaUrl, true)
          : getMapPermalink(metaUrl, true)
        : null;

      return (
        <ThemeProvider theme={themeLT}>
          <ImageModalContainer
            currentProvider={currentProvider}
            cloudProviders={cloudProviders}
            onUpdateImageSetting={onUpdateImageSetting}
            onSetCloudProvider={onSetCloudProvider}
          >
            <StyledShareMapModal className="export-cloud-modal">
              <StyledInnerDiv>
                <StyledExportSection>
                  <div className="description">
                    <div className="title">Share Map Url</div>
                    <div className="subtitle">
                      Generate a map url to share with others
                    </div>
                  </div>
                  <div className="selection">
                    <div className="title warning">{SHARE_DISCLAIMER}</div>
                  </div>
                </StyledExportSection>
                <StyledExportSection disabled={isLoading}>
                  <div className="description">
                    <div className="title">Cloud storage</div>
                    <div className="subtitle">
                      Login and upload map data to your personal cloud storage
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
                {isLoading || error ? (
                  <StatusPanel
                    isLoading={isLoading}
                    error={error}
                    providerIcon={provider && provider.icon}
                  />
                ) : null}
                {sharingLink && (
                  <StyledExportSection>
                    <div className="description">
                      <div className="title">Share Url</div>
                    </div>
                    <div className="selection">
                      <SharingUrl key={0} url={sharingLink} />
                      {folderLink && (
                        <a
                          key={1}
                          href={folderLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{textDecoration: 'underline'}}
                        >
                          Go to your Kepler.gl {currentProvider} page
                        </a>
                      )}
                    </div>
                  </StyledExportSection>
                )}
              </StyledInnerDiv>
            </StyledShareMapModal>
          </ImageModalContainer>
        </ThemeProvider>
      );
    }
  }

  return ShareMapUrlModal;
}
