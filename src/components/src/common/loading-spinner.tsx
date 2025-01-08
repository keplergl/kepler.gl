// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {CSSProperties} from 'react';
import styled, {keyframes, IStyledComponent} from 'styled-components';

import {BaseComponentProps} from '../types';

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

export type LoadingWrapperProps = BaseComponentProps & {
  borderColor?: CSSProperties['borderColor'];
};

const LoadingWrapper: IStyledComponent<
  'web',
  LoadingWrapperProps
> = styled.div<LoadingWrapperProps>`
  border-radius: 50%;
  border: 3px solid ${props => props.borderColor || props.theme.borderColorLT};
  padding: 2px;
`;

export type LoadingSpinnerProps = {
  size?: number;
  color?: string;
  borderColor?: CSSProperties['borderColor'];
  strokeWidth?: number;
  gap?: number;
};

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
