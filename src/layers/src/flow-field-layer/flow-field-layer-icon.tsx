// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const FlowFieldLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'flow-field-layer-icon',
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} viewBox="0 0 64 64" {...props}>
    <path
      d="M6 40 C14 36 18 28 26 26 C34 24 38 30 46 28 C52 26 56 20 60 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M4 52 C16 50 20 42 30 40 C40 38 44 46 54 44 C58 43 60 40 62 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M8 22 C16 18 22 12 32 14 C42 16 46 10 58 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </Base>
);

export default FlowFieldLayerIcon;
