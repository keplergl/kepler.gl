// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from './base';

const Table: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  viewBox = '0 0 24 24',
  predefinedClassName = 'data-ex-icons-table',
  ...props
}) => (
  <Base
    height={height}
    viewBox={viewBox}
    predefinedClassName={predefinedClassName}
    {...props}
    style={{fill: 'none', stroke: 'currentcolor'}}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </Base>
);

export default Table;
