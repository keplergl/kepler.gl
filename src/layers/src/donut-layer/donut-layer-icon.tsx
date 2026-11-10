// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

export default function DonutLayerIcon(props: Partial<BaseProps>) {
  return (
    <Base viewBox="0 0 64 64" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="12">
        <circle
          cx="32"
          cy="32"
          r="22"
          strokeDasharray="42 4 42 4 42 4"
          transform="rotate(-90 32 32)"
        />
      </g>
    </Base>
  );
}
