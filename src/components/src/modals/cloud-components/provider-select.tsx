// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import CloudTile from '../cloud-tile';
import React from 'react';
import styled from 'styled-components';
import {Provider} from '@kepler.gl/cloud-providers';
import {dataTestIds} from '@kepler.gl/constants';

const StyledProviderSection = styled.div.attrs({
  className: 'provider-selection'
})`
  display: flex;
  gap: 8px;
`;

type ProviderSelectProps = {
  cloudProviders: Provider[];
};

export const ProviderSelect: React.FC<ProviderSelectProps> = ({cloudProviders = []}) => (
  <div data-testid={dataTestIds.providerSelect}>
    {cloudProviders.length ? (
      <StyledProviderSection>
        {cloudProviders.map(provider => (
          <CloudTile key={provider.name} provider={provider} />
        ))}
      </StyledProviderSection>
    ) : (
      <p>No storage provider available</p>
    )}
  </div>
);
