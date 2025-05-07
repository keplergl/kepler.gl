// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren} from 'react';
import styled, {withTheme} from 'styled-components';

type StyledContainerProps = {
  $isVisible?: boolean;
  $left: number;
};

export const StyledContainer = styled.div<StyledContainerProps>`
  position: absolute;
  left: ${props => props.$left}px;
  bottom: ${props => props.theme.sidePanel.margin.left}px;
  z-index: 1;
  color: ${props => props.theme.textColorHl};
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  background-color: ${props => props.theme.sidePanelBg};
  border-radius: 0px;
  padding-left: 3px;
  padding-right: 3px;
  font-size: 12px;
`;

type LoadingIndicatorProps = {
  isVisible?: boolean;
  activeSidePanel?: boolean;
  sidePanelWidth?: number;
};

/** Extra adjustment for the loading indicator when side panel is visible */
const LEFT_POSITION_ADJUSTMENT = 3;

const LoadingIndicator: React.FC<PropsWithChildren<LoadingIndicatorProps> & {theme: any}> = ({
  isVisible,
  children,
  activeSidePanel,
  sidePanelWidth,
  theme
}) => {
  const left =
    (activeSidePanel ? (sidePanelWidth || 0) + LEFT_POSITION_ADJUSTMENT : 0) +
    theme.sidePanel.margin.left;

  return (
    <StyledContainer $isVisible={isVisible} $left={left}>
      {children}
    </StyledContainer>
  );
};

export default withTheme(LoadingIndicator) as React.FC<PropsWithChildren<LoadingIndicatorProps>>;
