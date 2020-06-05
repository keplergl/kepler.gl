import React from 'react';
import styled from 'styled-components';

const StyledBar = styled.span.attrs({
  className: 'progress-bar__bar'
})`
  background-color: ${props => props.theme.activeColor};
  /* disable transition because shapify is too fast */
  transition: width 100ms;
  display: block;
`;

const ProgressBar = ({percent, height = 4, isLoading}) => (
  <div className="progress-bar" style={{background: 'transparent'}}>
    <StyledBar
      style={{width: percent, height: `${height}px`, opacity: isLoading ? 1 : 0}}
    />
  </div>
);
export default ProgressBar;
