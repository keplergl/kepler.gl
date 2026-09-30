// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

const StyledDisclaimer = styled.p.attrs({
  className: 'cloud-storage-disclaimer'
})`
  margin-top: auto;
  margin-bottom: 0;
  padding-top: 16px;
  font-size: 11px;
  line-height: 1.4;
  color: ${props => props.theme.subtextColor};
  max-width: 100%;
`;

export const CloudStorageDisclaimer: React.FC = () => (
  <StyledDisclaimer>
    <FormattedMessage id="modal.providerSelect.disclaimer" />
  </StyledDisclaimer>
);
