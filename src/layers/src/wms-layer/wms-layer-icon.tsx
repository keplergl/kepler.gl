// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Base} from '../base';

class WMSLayerIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string.isRequired)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'WMS-layer-icon',
    totalColor: 2
  };

  render(): React.ReactNode {
    const baseColor = '#e0e0e0';
    const lineColor = '#606060';
    const accentColor = '#88c0d0';

    return (
      <Base {...this.props}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="WMS Layer Icon"
        >
          {/* Bottom (backmost) layer */}
          <rect x="16" y="16" width="36" height="36" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.4" />
          
          {/* Middle layer */}
          <rect x="12" y="12" width="36" height="36" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.6" />

          {/* Top (frontmost) tile */}
          <rect x="8" y="8" width="36" height="36" fill={baseColor} stroke={lineColor} strokeWidth="2" />
        </svg>
      </Base>
    );
  }
}

export default WMSLayerIcon;
