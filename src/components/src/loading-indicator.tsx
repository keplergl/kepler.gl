// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren, useRef, useEffect} from 'react';
import styled, {withTheme, keyframes, css} from 'styled-components';

import {getNumRasterTilesBeingLoaded, getNumVectorTilesBeingLoaded} from '@kepler.gl/layers';

type StyledContainerProps = {
  $isVisible?: boolean;
  $left: number;
  $bottomOffset: number;
};

const indeterminateSlide = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
`;

const StyledLabel = styled.div`
  color: ${props => props.theme.textColorHl};
  line-height: 1.2;
`;

const StyledHint = styled.div`
  margin-top: 3px;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  font-weight: 400;
  line-height: 1.3;
`;

const StyledTrack = styled.div`
  margin-top: 4px;
  height: 4px;
  width: 100%;
  background-color: color-mix(in srgb, ${props => props.theme.activeColor} 20%, transparent);
  border-radius: 4px;
  overflow: hidden;
`;

const barFill = css`
  height: 100%;
  border-radius: 4px;
  background-color: ${props => props.theme.activeColor};
`;

const StyledBar = styled.div<{$percent: number}>`
  ${barFill};
  width: ${props => props.$percent}%;
  transition: width 0.2s ease-out;
`;

const StyledIndeterminateBar = styled.div`
  ${barFill};
  width: 32%;
  animation: ${indeterminateSlide} 1.2s ease-in-out infinite;
`;

export const StyledContainer = styled.div<StyledContainerProps>`
  position: absolute;
  left: ${props => props.$left}px;
  bottom: ${props => props.theme.sidePanel.margin.left + props.$bottomOffset}px;
  z-index: 1;
  min-width: 220px;
  max-width: 280px;
  padding: 10px 12px;
  color: ${props => props.theme.textColor};
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  background-color: ${props => props.theme.sidePanelBg};
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  pointer-events: none;
`;

type LoadingIndicatorProps = {
  isVisible?: boolean;
  activeSidePanel?: boolean;
  sidePanelWidth?: number;
  hasAttributionLogos?: boolean;
  hasMapScale?: boolean;
  /** Combined download progress 0–100. Omit or 0 for an indeterminate bar. */
  percent?: number;
  /** Number of remote files currently being fetched from a saved config. */
  remoteDatasetCount?: number;
  /** Remote files whose download finished and that are now being parsed. */
  processingDatasetCount?: number;
};

/** Extra adjustment for the loading indicator when side panel is visible */
const LEFT_POSITION_ADJUSTMENT = 3;
/** Height of the map scale bar, used to stack the loading indicator above it */
const MAP_SCALE_HEIGHT = 24;

/**
 * Average per-dataset download percents. Returns undefined when every value is
 * 0 so the indicator stays an indeterminate bar (no Content-Length).
 */
export function aggregateLoadingPercent(progress?: Record<string, number>): number | undefined {
  if (!progress) {
    return undefined;
  }
  const values = Object.values(progress);
  if (!values.length || values.every(value => value <= 0)) {
    return undefined;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

const LoadingIndicator: React.FC<LoadingIndicatorProps & {theme: any}> = ({
  isVisible,
  activeSidePanel,
  sidePanelWidth,
  hasAttributionLogos,
  hasMapScale,
  percent,
  remoteDatasetCount = 0,
  processingDatasetCount = 0,
  theme
}) => {
  const left =
    (activeSidePanel ? (sidePanelWidth || 0) + LEFT_POSITION_ADJUSTMENT : 0) +
    theme.sidePanel.margin.left;
  const bottomOffset = (hasAttributionLogos ? 24 : 0) + (hasMapScale ? MAP_SCALE_HEIGHT : 0);

  // Helper message to track number of tiles that are being loaded
  const numRasterTilesInProgress = getNumRasterTilesBeingLoaded();
  const numVectorTilesInProgress = getNumVectorTilesBeingLoaded();

  const downloadingCount = Math.max(remoteDatasetCount - processingDatasetCount, 0);
  const remoteMessage = [
    downloadingCount === 1
      ? 'Remote dataset is being loaded'
      : downloadingCount > 1
      ? `${downloadingCount} remote datasets are being loaded`
      : '',
    processingDatasetCount === 1
      ? 'Processing remote dataset'
      : processingDatasetCount > 1
      ? `Processing ${processingDatasetCount} remote datasets`
      : ''
  ]
    .filter(Boolean)
    .join('\n');

  let tileMessage = '';
  if (numRasterTilesInProgress > 0 && numVectorTilesInProgress > 0) {
    const totalTiles = numRasterTilesInProgress + numVectorTilesInProgress;
    tileMessage = `${totalTiles} tile${totalTiles === 1 ? ' is' : 's are'} being loaded`;
  } else if (numRasterTilesInProgress > 0) {
    tileMessage = `${numRasterTilesInProgress} raster tile${
      numRasterTilesInProgress === 1 ? ' is' : 's are'
    } being loaded`;
  } else if (numVectorTilesInProgress > 0) {
    tileMessage = `${numVectorTilesInProgress} vector tile${
      numVectorTilesInProgress === 1 ? ' is' : 's are'
    } being loaded`;
  }

  const extraMessage = [remoteMessage, tileMessage].filter(Boolean).join('\n');

  const processingOnly = processingDatasetCount > 0 && downloadingCount === 0;
  const hasProgress = !processingOnly && typeof percent === 'number' && percent > 0;

  // Preserve the last message / percent during fade-out
  const lastMessageRef = useRef(extraMessage);
  const lastPercentRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (isVisible && extraMessage) {
      lastMessageRef.current = extraMessage;
    }
    if (isVisible && hasProgress) {
      lastPercentRef.current = percent;
    }
  }, [isVisible, extraMessage, hasProgress, percent]);

  const displayMessage = isVisible ? extraMessage : lastMessageRef.current;
  const displayPercent = isVisible ? (hasProgress ? percent : undefined) : lastPercentRef.current;
  const determinatePercent =
    typeof displayPercent === 'number' && displayPercent > 0 ? displayPercent : null;

  return (
    <StyledContainer $isVisible={isVisible} $left={left} $bottomOffset={bottomOffset}>
      <StyledLabel>Loading...</StyledLabel>
      {displayMessage
        ? displayMessage.split('\n').map(line => <StyledHint key={line}>{line}</StyledHint>)
        : null}
      <StyledTrack
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinatePercent === null ? undefined : Math.round(determinatePercent)}
        aria-label="Loading"
      >
        {determinatePercent === null ? (
          <StyledIndeterminateBar />
        ) : (
          <StyledBar $percent={determinatePercent} />
        )}
      </StyledTrack>
    </StyledContainer>
  );
};

export default withTheme(LoadingIndicator) as React.FC<PropsWithChildren<LoadingIndicatorProps>>;
