// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {keyframes} from 'styled-components';

const animationName = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.span`
    border-left-color: ${props => props.color || props.theme.primaryBtnBgd};
    animation: _preloader_spin_ 500ms linear infinite;
    border-radius: 50%;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    cursor: wait;
    border-style: solid;
    display: block;
    animation-name: ${animationName};
}`;

interface LoadingWrapperProps {
  borderColor?: string;
}

const LoadingWrapper = styled.div<LoadingWrapperProps>`
  border-radius: 50%;
  border: 3px solid ${props => props.borderColor || props.theme.borderColorLT};
  padding: 2px;
`;

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  borderColor?: string;
  strokeWidth?: number;
  gap?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  color = '',
  borderColor = '',
  strokeWidth = 3,
  gap = 2
}) => (
  <LoadingWrapper
    style={{width: `${size}px`, height: `${size}px`, padding: `${gap}px`, borderColor}}
  >
    <Loader
      color={color}
      style={{
        width: `${size - strokeWidth * 2 - gap * 2}px`,
        height: `${size - strokeWidth * 2 - gap * 2}px`,
        borderWidth: strokeWidth
      }}
    />
  </LoadingWrapper>
);

export default LoadingSpinner;
