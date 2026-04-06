// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren, useRef, useEffect} from 'react';
import styled, {withTheme, keyframes} from 'styled-components';

import {getNumRasterTilesBeingLoaded, getNumVectorTilesBeingLoaded} from '@kepler.gl/layers';

type StyledContainerProps = {
  $isVisible?: boolean;
  $left: number;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid ${props => props.theme.textColorHl};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  vertical-align: middle;
`;

export const StyledContainer = styled.div<StyledContainerProps>`
  position: absolute;
  left: ${props => props.$left}px;
  bottom: ${props => props.theme.sidePanel.margin.left}px;
  z-index: 1;
  color: ${props => props.theme.textColor};
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  background-color: ${props => props.theme.sidePanelBg};
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

type LoadingIndicatorProps = {
  isVisible?: boolean;
  activeSidePanel?: boolean;
  sidePanelWidth?: number;
};

/** Extra adjustment for the loading indicator when side panel is visible */
const LEFT_POSITION_ADJUSTMENT = 3;

const LoadingIndicator: React.FC<LoadingIndicatorProps & {theme: any}> = ({
  isVisible,
  activeSidePanel,
  sidePanelWidth,
  theme
}) => {
  const left =
    (activeSidePanel ? (sidePanelWidth || 0) + LEFT_POSITION_ADJUSTMENT : 0) +
    theme.sidePanel.margin.left;

  // Helper message to track number of tiles that are being loaded
  const numRasterTilesInProgress = getNumRasterTilesBeingLoaded();
  const numVectorTilesInProgress = getNumVectorTilesBeingLoaded();

  let extraMessage = '';
  if (numRasterTilesInProgress > 0 && numVectorTilesInProgress > 0) {
    // Both types loading: show combined count
    const totalTiles = numRasterTilesInProgress + numVectorTilesInProgress;
    extraMessage = `${totalTiles} tile${totalTiles === 1 ? ' is' : 's are'} being loaded`;
  } else if (numRasterTilesInProgress > 0) {
    // Only raster tiles loading
    extraMessage = `${numRasterTilesInProgress} raster tile${
      numRasterTilesInProgress === 1 ? ' is' : 's are'
    } being loaded`;
  } else if (numVectorTilesInProgress > 0) {
    // Only vector tiles loading
    extraMessage = `${numVectorTilesInProgress} vector tile${
      numVectorTilesInProgress === 1 ? ' is' : 's are'
    } being loaded`;
  }

  // Preserve the last message during fade-out
  const lastMessageRef = useRef(extraMessage);
  useEffect(() => {
    if (isVisible && extraMessage) {
      lastMessageRef.current = extraMessage;
    }
  }, [isVisible, extraMessage]);

  const displayMessage = isVisible ? extraMessage : lastMessageRef.current;

  return (
    <StyledContainer $isVisible={isVisible} $left={left}>
      <Spinner />
      <span>{`Loading... ${displayMessage}`}</span>
    </StyledContainer>
  );
};

export default withTheme(LoadingIndicator) as React.FC<PropsWithChildren<LoadingIndicatorProps>>;
