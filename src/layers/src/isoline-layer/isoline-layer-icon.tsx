// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const IsolineLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'isoline-layer-icon',
  totalColor = 3,
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} totalColor={totalColor} {...props}>
    {/* Outer blob */}
    <ellipse cx="32" cy="32" rx="26" ry="20" className="cr1" style={{opacity: 0.25}} />
    {/* Middle ring */}
    <ellipse cx="32" cy="32" rx="18" ry="13" className="cr2" style={{opacity: 0.4}} fill="none" strokeWidth="2.5" stroke="currentColor" />
    {/* Inner ring */}
    <ellipse cx="32" cy="32" rx="10" ry="7" className="cr2" style={{opacity: 0.7}} fill="none" strokeWidth="2.5" stroke="currentColor" />
    {/* Innermost fill */}
    <ellipse cx="32" cy="32" rx="4" ry="3" className="cr3" />
    {/* Outer ring stroke */}
    <ellipse cx="32" cy="32" rx="26" ry="20" className="cr1" fill="none" strokeWidth="2" stroke="currentColor" style={{opacity: 0.6}} />
  </Base>
);

export default IsolineLayerIcon;
