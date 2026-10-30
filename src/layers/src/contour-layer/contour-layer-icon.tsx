// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

export default function ContourLayerIcon(props: Partial<BaseProps>) {
  return (
    <Base viewBox="0 0 64 64" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
        <path d="M5 36C3 19 19 5 33 9S55 7 59 26S48 57 30 55S8 50 5 36Z" />
        <path d="M15 34C12 24 23 15 32 20S47 17 49 30S40 46 30 45S17 43 15 34Z" />
        <path d="M25 34C23 28 28 25 34 28S41 33 37 37S27 39 25 34Z" />
      </g>
    </Base>
  );
}
