// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

class S2LayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };
  static defaultProps = {
    height: '18px',
    predefinedClassName: 's2-layer-icon'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M14.76,58,15,20.54,50.06,6.75V44Zm4-34.86L18.6,52.38l27.66-11V12.33Z" />
        <path d="M27.21,38.58a7.38,7.38,0,0,1-3.62-.9l.3-2a6.49,6.49,0,0,0,3.3.9c1.49,0,2.18-.59,2.18-1.63,0-2.26-5.71-1.28-5.71-5.3,0-2,1.26-3.54,4.16-3.54a8.38,8.38,0,0,1,3.28.64l-.29,1.9a8.41,8.41,0,0,0-2.88-.54c-1.63,0-2.14.66-2.14,1.42,0,2.19,5.71,1.18,5.71,5.27C31.5,37.16,29.93,38.58,27.21,38.58Z" />
        <path d="M36.17,36.36v0h5.06l0,2H33.32V36.9c3-2.88,5.67-5.09,5.67-7,0-1-.64-1.67-2.19-1.67a5,5,0,0,0-3,1.1l-.53-1.79a6.31,6.31,0,0,1,3.91-1.28c2.66,0,4,1.34,4,3.41C41.21,31.94,39.13,33.89,36.17,36.36Z" />
      </Base>
    );
  }
}

export default S2LayerIcon;
