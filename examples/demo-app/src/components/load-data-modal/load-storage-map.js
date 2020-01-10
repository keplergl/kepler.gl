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

import React, { useState, useEffect } from 'react';
import {getCloudProvider, getCloudProviders} from '../../cloud-providers';
import styled from 'styled-components';
import ProviderTile from './provider-tile';

const StyledBackendExportSection = styled.div`
  display: flex;
`;

const LoadStorageMap = ({onLoadCloudMap}) => {
  const [visualizations, setVisualizations] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = getCloudProviders();

  const selectProvider = (provider) => {
    if (!!provider.getAccessToken()) {
      updateSelectedProvider(provider.name);
    } else {
      provider.login(updateSelectedProvider);
    }
  }

  const updateSelectedProvider = (providerName) => {
    if (providerName) {
      setSelectedProvider(providerName);
      getVisualizations(providerName);
    } else {
      setSelectedProvider(null);
      setVisualizations(null);
    }
  }

  const getVisualizations = async (providerName) => {
    if (providerName) {
      const cartoProvider = getCloudProvider(providerName);
      const visualizations = await cartoProvider.getVisualizations();
      setVisualizations(visualizations);
    }
  };

  return (
    <div>
      {!selectedProvider && (<StyledBackendExportSection>
        {providers.map(provider => (
          provider.hasPrivateStorage() &&
          <ProviderTile
            key={provider.name}
            Icon={provider.icon}
            isConnected={() => !!provider.getAccessToken()}
            onConnect={() => {selectProvider(provider)}}
            onLogout={() => {provider.logout(updateSelectedProvider)}}
          />
        ))}
      </StyledBackendExportSection>)}
      {selectedProvider && visualizations &&
        (<ul>
          {visualizations.map(vis => (
              <a
                key={vis.id}
                onClick={() => {
                  onLoadCloudMap(vis.loadParams, selectedProvider, true);
                }}
              >{vis.title}</a>
            ))}
        </ul>)}
    </div>
  );
};

export default LoadStorageMap;
