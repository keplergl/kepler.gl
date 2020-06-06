import React from 'react';
import styled from 'styled-components';

const StyledBar = styled.span.attrs({
  className: 'progress-bar__bar'
})`
  background-color: ${props => props.theme.progressBarColor};
  /* disable transition because shapify is too fast */
  transition: width 100ms;
  display: block;
`;
const StyledBarCase = styled.div.attrs({
  className: 'progress-bar'
})`
  background-color: ${props => props.theme.progressBarTrackColor};
`;

const ProgressBar = ({percent, height = 4, isLoading}) => (
  <StyledBarCase className="progress-bar">
    <StyledBar style={{width: percent, height: `${height}px`, opacity: isLoading ? 1 : 0}} />
  </StyledBarCase>
);
export default ProgressBar;
