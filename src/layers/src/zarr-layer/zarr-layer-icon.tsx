// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

/** Stacked chunk grid, evoking a chunked multi-dimensional array. */
const ZarrLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'zarr-layer-icon',
  totalColor = 2,
  viewBox = '0 0 30 30',
  ...props
}) => (
  <Base
    height={height}
    predefinedClassName={predefinedClassName}
    totalColor={totalColor}
    viewBox={viewBox}
    {...props}
  >
    <path d="M14.76 2L1 9.75L15.24 17.76L29 10.02L14.76 2Z" fill="#BFC0D1" />
    <path d="M14.76 7.67L1 15.42L15.24 23.43L29 15.69L14.76 7.67Z" fill="#9DA0B9" />
    <path d="M14.76 12.24L1 19.98L15.24 28L29 20.25L14.76 12.24Z" fill="currentColor" />
    <g fill="white" fillOpacity="0.85">
      <rect x="9.6" y="18.2" width="3.4" height="2" transform="skewY(29.5)" />
      <rect x="16.4" y="14.4" width="3.4" height="2" transform="skewY(-29.5)" />
    </g>
  </Base>
);

export default ZarrLayerIcon;
