// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const Tile3DLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'tile3d-layer-icon',
  totalColor = 2,
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} totalColor={totalColor} {...props}>
    <g transform="translate(6, 6)">
      <path d="M24 2L44 13.5V36.5L24 48L4 36.5V13.5L24 2Z" fill="currentColor" opacity="0.2" />
      <path d="M24 2L44 13.5L24 25L4 13.5L24 2Z" fill="currentColor" opacity="0.6" />
      <path d="M24 25V48L4 36.5V13.5L24 25Z" fill="currentColor" opacity="0.4" />
      <path d="M24 25V48L44 36.5V13.5L24 25Z" fill="currentColor" opacity="0.8" />
      <path d="M14 7.5L34 19V35.5L14 24V7.5Z" fill="currentColor" opacity="0.3" />
    </g>
  </Base>
);

export default Tile3DLayerIcon;
