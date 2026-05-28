// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const BitmapLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'bitmap-layer-icon',
  totalColor = 2,
  ...props
}) => (
  <Base
    height={height}
    predefinedClassName={predefinedClassName}
    totalColor={totalColor}
    {...props}
  >
    <g transform="translate(8, 10)">
      <rect x="0" y="0" width="48" height="36" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="2" y="2" width="44" height="32" rx="1" fill="currentColor" opacity="0.5" />
      <path d="M6 28L18 18L26 24L38 12L42 16V30H6V28Z" fill="currentColor" opacity="0.8" />
      <circle cx="14" cy="12" r="4" fill="currentColor" opacity="0.8" />
    </g>
  </Base>
);

export default BitmapLayerIcon;
