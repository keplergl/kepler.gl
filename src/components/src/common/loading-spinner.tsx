// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {CSSProperties} from 'react';
import styled, {keyframes, IStyledComponent} from 'styled-components';

import {BaseComponentProps} from '../types';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  border: 2px solid ${props => props.theme.borderColorLT || '#e0e0e0'};
  border-top: 2px solid ${props => props.color || props.theme.primaryBtnBgd};
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: ${spin} 1s linear infinite;
  display: block;
`;

export type LoadingWrapperProps = BaseComponentProps & {
  borderColor?: CSSProperties['borderColor'];
};

const LoadingWrapper: IStyledComponent<
  'web',
  LoadingWrapperProps
> = styled.div<LoadingWrapperProps>`
  display: inline-block;
  position: relative;
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
  strokeWidth = 2,
  gap = 0
}) => (
  <LoadingWrapper style={{width: `${size}px`, height: `${size}px`}}>
    <Loader
      color={color}
      style={{
        borderWidth: strokeWidth
      }}
    />
  </LoadingWrapper>
);

export default LoadingSpinner;
