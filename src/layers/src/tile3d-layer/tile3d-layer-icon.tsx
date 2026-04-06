// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

export default class Tile3DLayerIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'tile3d-layer-icon',
    totalColor: 2
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(6, 6)">
          <path d="M24 2L44 13.5V36.5L24 48L4 36.5V13.5L24 2Z" fill="currentColor" opacity="0.2" />
          <path d="M24 2L44 13.5L24 25L4 13.5L24 2Z" fill="currentColor" opacity="0.6" />
          <path d="M24 25V48L4 36.5V13.5L24 25Z" fill="currentColor" opacity="0.4" />
          <path d="M24 25V48L44 36.5V13.5L24 25Z" fill="currentColor" opacity="0.8" />
          <path d="M14 7.5L34 19V35.5L14 24V7.5Z" fill="currentColor" opacity="0.3" />
        </g>
      </Base>
    );
  }
}
