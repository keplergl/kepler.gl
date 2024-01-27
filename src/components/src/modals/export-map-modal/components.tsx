// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {StyledExportSection} from '../../common/styled-components';

export const StyledExportMapSection = styled(StyledExportSection)`
  margin-top: ${props => props.theme.exportIntraSectionMargin}px;
`;

export const StyledWarning = styled.span`
  color: ${props => props.theme.errorColor};
  font-weight: ${props => props.theme.selectFontWeightBold};
`;

export const StyledExportLink = styled.a`
  text-decoration-line: underline !important;
`;

export const ExportMapLink = ({children, ...props}) => (
  <StyledExportLink target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </StyledExportLink>
);
