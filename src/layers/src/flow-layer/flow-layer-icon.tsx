// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Base, BaseProps} from '../base';

const FlowLayerIcon: React.FC<Partial<BaseProps>> = ({
  height = '16px',
  predefinedClassName = 'flow-layer-icon',
  totalColor = 3,
  ...props
}) => (
  <Base height={height} predefinedClassName={predefinedClassName} totalColor={totalColor} {...props} viewBox="0 0 64 64">
    {/* Left point */}
    <circle cx="10" cy="42" r="4.5" className="cr1" />
    {/* Right point */}
    <circle cx="54" cy="42" r="4.5" className="cr2" />
    {/* Top point */}
    <circle cx="36" cy="10" r="4.5" className="cr3" />

    {/* Arrow left -> right: gentle upper arc, thick band */}
    <path d="M17,38 C26,26 42,26 49,36 L48,32 C42,23 24,23 16,34 Z" className="cr1" />
    {/* Arrowhead right */}
    <path d="M47,30 L52,38 L45,37 Z" className="cr1" />

    {/* Arrow right -> left: gentle lower arc, thick band */}
    <path d="M47,46 C38,58 22,58 15,48 L16,52 C22,61 40,61 48,50 Z" className="cr2" />
    {/* Arrowhead left */}
    <path d="M17,54 L12,46 L19,47 Z" className="cr2" />

    {/* Arrow left -> top: gentle curve */}
    <path d="M13,37 C12,24 20,15 32,11 L30,14 C20,18 15,26 15,36 Z" className="cr3" />
    {/* Arrowhead top */}
    <path d="M29,9 L35,12 L29,16 Z" className="cr3" />
  </Base>
);

export default FlowLayerIcon;
