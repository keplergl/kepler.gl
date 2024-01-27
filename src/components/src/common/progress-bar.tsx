// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

/** @typedef {import('./progress-bar').ProgressBarProps} ProgressBarProps */

interface StyledBarProps {
  barColor?: string;
}

const StyledBar = styled.span.attrs({
  className: 'progress-bar__bar'
})<StyledBarProps>`
  background-color: ${props => props.barColor || props.theme.progressBarColor};
  /* transition: width 200ms; */
  display: block;
`;

interface StyledTrackProps {
  trackColor?: string;
}

const StyledTrack = styled.div.attrs({
  className: 'progress-bar'
})<StyledTrackProps>`
  background-color: ${props => props.trackColor || props.theme.progressBarTrackColor};
`;

export type ProgressBarProps = {
  percent: string;
  height?: number;
  isLoading: boolean;
  barColor: string;
  trackColor?: string;
  theme: any;
};

/** @type {React.FunctionComponent<ProgressBarProps>} */
const ProgressBar = ({
  percent,
  height = 4,
  isLoading,
  barColor,
  trackColor,
  theme
}: ProgressBarProps) => (
  <StyledTrack trackColor={trackColor} theme={theme}>
    <StyledBar
      barColor={barColor}
      style={{width: percent, height: `${height}px`, opacity: isLoading ? 1 : 0}}
    />
  </StyledTrack>
);

export default ProgressBar;
