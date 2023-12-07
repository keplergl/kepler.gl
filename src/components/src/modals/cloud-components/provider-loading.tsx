// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import LoadingDialog from '../loading-dialog';
import styled from 'styled-components';

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

export const ProviderLoading = () => {
  return (
    <StyledSpinner>
      <LoadingDialog size={64} />
    </StyledSpinner>
  );
};
