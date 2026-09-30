// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const GeohashLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '18px',
  predefinedClassName = 'geohash-layer-icon',
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} {...props}>
    <path d="M8,12H56V52H8Zm4,4V48H52V16Z" />
    <path d="M20,22H44V42H20Zm4,4V38H40V26Z" />
  </Base>
);

export default GeohashLayerIcon;
