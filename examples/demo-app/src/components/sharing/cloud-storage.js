// Copyright (c) 2019 Uber Technologies, Inc.
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
import get from 'lodash.get';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {StyledModalContent} from 'kepler.gl/components';
import CloudTile from './cloud-tile';
import StatusPanel from './status-panel';
import {CLOUD_PROVIDERS} from '../../utils/cloud-providers';
import {KEPLER_DISCLAIMER} from '../../constants/default-settings';
import {getMapPermalink} from '../../utils/url';

const StyledExportDataSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0;
  width: 100%;

  .description {
    .title {
      font-weight: 500;
      color: ${props => props.theme.textColorLT};
      font-size: 12px;
    }
    .subtitle {
      color: ${props => props.theme.textColor};
      font-size: 11px;
    }
  }

  .selection {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding-left: 50px;
  }
`;

export const StyledInputLabel = styled.label`
  font-size: 12px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => props.error ? 'red' : props.theme.titleColorLT};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: 14px;
  
  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

export const StyledBtn = styled.button`
  background-color: ${props => props.theme.primaryBtnActBgd};
  color: ${props => props.theme.primaryBtnActColor};
  &:focus {
    outline: none;
  }
`;

export const StyleSharingUrl = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 14px;
  flex-direction: column;
`;

const SharingUrl = ({url, message}) => (
  <StyleSharingUrl>
    <StyledInputLabel>{message}</StyledInputLabel>
    <div style={{display: 'flex'}}>
      <StyledInput type="text" value={url}/>
      <CopyToClipboard text={url}>
        <StyledBtn>copy</StyledBtn>
      </CopyToClipboard>
    </div>

  </StyleSharingUrl>
);

const ExportCloudModal = ({
  isLoading,
  info,
  onExport,
  onCloudLoginSuccess
}) => {
  const metaUrl = get(info, ['metadata', 'url']);
  const sharingLink = metaUrl ? getMapPermalink(metaUrl) : null;
  return (
    <div className="export-data-modal">
      <StyledModalContent>
        <div style={{width: '100%'}}>
          <StyledExportDataSection>
            <div className="description">
              <div className="title">
                Save and share current map via URL
              </div>
              <div className="subtitle" style={{color: 'red', fontWeight: 500}}>
                {KEPLER_DISCLAIMER}
              </div>
            </div>
          </StyledExportDataSection>

          <StyledExportDataSection>
            <div className="description">
              <div className="title">
                Data Type
              </div>
              <div className="subtitle">
                Choose the type of data you want to export
              </div>
            </div>
            <div className="selection">
              {Object.keys(CLOUD_PROVIDERS).map((name, index) => (
                <CloudTile
                  key={index}
                  token={CLOUD_PROVIDERS[name].getAccessToken()}
                  onExport={onExport}
                  onLogin={() => CLOUD_PROVIDERS[name].handleLogin(onCloudLoginSuccess)}
                  Icon={CLOUD_PROVIDERS[name].icon}
                />
              ))}
            </div>
          </StyledExportDataSection>
          <StyledExportDataSection>
            <div className="selection">
              <div style={{margin: 'auto', width: '100%'}}>
                {isLoading && (
                  <StatusPanel isLoading={isLoading} {...info} />
                )}
                {metaUrl && [
                  (<SharingUrl key={0} url={sharingLink} message={'Share your map with other users'}/>),
                  (<SharingUrl key={1} url={metaUrl} message={'Your new saved configuration'}/>)
                ]}
              </div>
            </div>
          </StyledExportDataSection>
        </div>
      </StyledModalContent>
    </div>
  )
};

export default ExportCloudModal;
