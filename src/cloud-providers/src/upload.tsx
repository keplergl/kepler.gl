// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from './base';

const Upload: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'data-ex-icons-upload',
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} {...props}>
    <path d="M52 9v6a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h38a1 1 0 0 1 1 1zm-4 31L34.426 21.336a3 3 0 0 0-4.852 0L16 40h8v16h16V40h8z" />
  </Base>
);

export default Upload;
