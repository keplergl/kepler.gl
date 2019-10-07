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
import {StyledModalContent} from 'kepler.gl/components';
import CloudTile from './cloud-tile';
import StatusPanel from './status-panel';
import {CLOUD_PROVIDERS} from '../../utils/cloud-providers';
import {KEPLER_DISCLAIMER} from '../../constants/default-settings';
 
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

const ExportCloudModal = ({
  isLoading,
  info,
  onExport,
  onCloudLoginSuccess
}) => {
  const meta = get(info, ['metadata']);
  const error = get(info, ['error']);

  return (

    <StyledModalContent className="export-cloud-modal">
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
              Upload through
            </div>
          </div>
          <div className="selection">
            {Object.keys(CLOUD_PROVIDERS).map((name, index) => (
              <CloudTile
                key={index}
                token={CLOUD_PROVIDERS[name].getAccessToken()}
                onExport={() => onExport(name)}
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
                {error && (
                  <div className="subtitle" style={{color: 'red', fontWeight: 500}}>
                    {error.error}
                  </div>
                )}
                {
                  meta && CLOUD_PROVIDERS[meta.provider].renderMeta(meta)
                }
              </div>
            </div>
          </StyledExportDataSection>
      </div>
    </StyledModalContent>

  )
};

export default ExportCloudModal;
