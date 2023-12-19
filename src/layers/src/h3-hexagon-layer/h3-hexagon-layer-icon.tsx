// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

class H3HexagonLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'h3-hexagon-layer-icon',
    totalColor: 4
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M44.59,54.5H19.41L6.81,32.68,19.41,10.87H44.59L57.19,32.68Zm-23-3.83H42.38l10.38-18-10.38-18H21.62l-10.38,18Z" />
        <polygon points="24.65 32.86 24.65 37.79 22.53 37.79 22.53 26.3 24.65 26.3 24.65 30.91 29.32 30.91 29.32 26.3 31.43 26.3 31.43 37.79 29.32 37.79 29.32 32.86 24.65 32.86" />
        <path d="M33.79,37.05l.6-1.67a5.86,5.86,0,0,0,1.39.61,5.59,5.59,0,0,0,1.5.19A2.57,2.57,0,0,0,39,35.66a1.81,1.81,0,0,0,.61-1.46A1.29,1.29,0,0,0,38.94,33a4.55,4.55,0,0,0-2.05-.32H35.74V31h1.1A5.4,5.4,0,0,0,38,30.85a2.1,2.1,0,0,0,.77-.29,1.53,1.53,0,0,0,.51-.54,1.58,1.58,0,0,0,.15-.73,1.14,1.14,0,0,0-.51-1,2.67,2.67,0,0,0-1.5-.34,4.56,4.56,0,0,0-1.51.24,5,5,0,0,0-1.34.73l-.7-1.61a4.92,4.92,0,0,1,1.66-.83,6.91,6.91,0,0,1,2-.31,4.41,4.41,0,0,1,2.81.79,2.71,2.71,0,0,1,1,2.24,2.33,2.33,0,0,1-.54,1.62,3.45,3.45,0,0,1-1.46.93v0a3,3,0,0,1,1.67.81,2.3,2.3,0,0,1,.64,1.7A3.27,3.27,0,0,1,40.48,37a5,5,0,0,1-3.16.91A6.77,6.77,0,0,1,33.79,37.05Z" />
      </Base>
    );
  }
}

export default H3HexagonLayerIcon;
