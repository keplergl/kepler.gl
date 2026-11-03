// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

export default function VoronoiLayerIcon(props: Partial<BaseProps>) {
  return (
    <Base viewBox="0 0 64 64" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
        <path d="M5 5H59V59H5Z M5 25L22 19L37 30L33 47L16 59 M22 19L26 5 M37 30L59 22 M33 47L59 53" />
      </g>
      <g fill="currentColor">
        <circle cx="14" cy="13" r="2" />
        <circle cx="44" cy="14" r="2" />
        <circle cx="18" cy="38" r="2" />
        <circle cx="48" cy="39" r="2" />
        <circle cx="35" cy="55" r="2" />
      </g>
    </Base>
  );
}
