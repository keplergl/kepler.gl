// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const A5LayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '18px',
  predefinedClassName = 'a5-layer-icon',
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} {...props}>
    <path d="M32,6.5,54.5,22.9,45.9,49.3H18.1L9.5,22.9Z" />
    <path d="M32,12.2,48.7,24.4,42.3,44.1H21.7L15.3,24.4Z" />
    <path d="M23.2,38.4V27.1h2.1v4.5h5.1V27.1h2.1V38.4H30.4V33.4H25.3v5Z" />
    <path d="M35.1,38.4l.7-1.9a4.8,4.8,0,0,0,1.5.6,4.3,4.3,0,0,0,1.5.2,2,2,0,0,0,1.4-.4,1.3,1.3,0,0,0,.5-1.1,1,1,0,0,0-.5-.9,3.7,3.7,0,0,0-1.8-.3h-1v-1.6h.9a3.9,3.9,0,0,0,1.5-.2,1.5,1.5,0,0,0,.9-1.4,1.2,1.2,0,0,0-.4-.9,2.3,2.3,0,0,0-1.4-.3,4.1,4.1,0,0,0-2.4.8l-.8-1.8a5.3,5.3,0,0,1,3.4-1.1,3.8,3.8,0,0,1,2.5.7,2.3,2.3,0,0,1,.9,1.9,2.1,2.1,0,0,1-.5,1.4,2.8,2.8,0,0,1-1.3.8v0a2.5,2.5,0,0,1,1.5.7,2,2,0,0,1,.6,1.5,2.8,2.8,0,0,1-1,2.3,4.4,4.4,0,0,1-2.9.8A6.3,6.3,0,0,1,35.1,38.4Z" />
  </Base>
);

export default A5LayerIcon;
