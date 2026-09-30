// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {css, keyframes} from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledProgress = styled.svg<{$indeterminate?: boolean}>`
  display: block;
  flex-shrink: 0;
  ${props =>
    props.$indeterminate &&
    css`
      animation: ${spin} 0.8s linear infinite;
    `}
`;

export type DatasetRefreshProgressIconProps = {
  /** Download progress from 0–100. Omit or 0 for an indeterminate spinner. */
  percent?: number;
  size?: number;
};

/**
 * Circular refresh indicator: spinning arc while size is unknown, filling ring
 * when Content-Length is available.
 */
export default function DatasetRefreshProgressIcon({
  percent,
  size = 14
}: DatasetRefreshProgressIconProps) {
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const determinate = typeof percent === 'number' && percent > 0;
  const clamped = determinate ? Math.max(0, Math.min(100, percent)) : 0;
  const dashOffset = determinate ? circumference * (1 - clamped / 100) : circumference * 0.75;

  return (
    <StyledProgress
      $indeterminate={!determinate}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? Math.round(clamped) : undefined}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.25}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </StyledProgress>
  );
}
