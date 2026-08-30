// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {media} from '@kepler.gl/styles';
import {StyledExportSection, StyledModalContent} from '../../common/styled-components';

export const StyledExportMapModalContent = styled(StyledModalContent)`
  padding-top: 12px;
  padding-bottom: 12px;

  ${media.portable`
    padding-top: 8px;
    padding-bottom: 8px;
  `};
`;

export const StyledExportMapSection = styled(StyledExportSection)`
  margin: 8px 0 12px;
`;

export const StyledExportMapNote = styled.p`
  color: ${props => props.theme.textColorLT};
  font-size: 12px;
  line-height: 1.4;
  margin: 0 0 8px;
`;

export const StyledExportMapFormatPanels = styled.div`
  display: grid;
`;

export const StyledExportMapFormatPanel = styled.div<{$active: boolean}>`
  grid-area: 1 / 1;
  overflow: hidden;
  visibility: ${props => (props.$active ? 'visible' : 'hidden')};
  pointer-events: ${props => (props.$active ? 'auto' : 'none')};
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
