// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from './base';

const DefaultLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'default-layer-icon',
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} {...props}>
        <circle cx="29.4" cy="31.6" r="8.4" />
        <circle cx="48.5" cy="15.7" r="6.5" />
        <circle cx="11" cy="44.2" r="3" />
        <circle cx="50" cy="44.2" r="5" />
        <circle cx="34" cy="54.2" r="3" />
        <circle cx="14" cy="16.2" r="4" />
      </Base>
);

export default DefaultLayerIcon;
