import React from 'react';
import styled from 'styled-components';

const StyledBar = styled.span.attrs({
  className: 'progress-bar__bar'
})`
  background-color: ${props => props.barColor || props.theme.progressBarColor};
  /* transition: width 200ms; */
  display: block;
`;
const StyledTrack = styled.div.attrs({
  className: 'progress-bar'
})`
  background-color: ${props => props.trackColor || props.theme.progressBarTrackColor};
`;

const ProgressBar = ({percent, height = 4, isLoading, barColor, trackColor}) => (
  <StyledTrack trackColor={trackColor}>
    <StyledBar
      barColor={barColor}
      style={{width: percent, height: `${height}px`, opacity: isLoading ? 1 : 0}}
    />
  </StyledTrack>
);

export default ProgressBar;
