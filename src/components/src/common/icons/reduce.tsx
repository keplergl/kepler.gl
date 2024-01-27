// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Reduce extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-reduce'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(12.000000, 12.000000)">
          <path
            d="M36.5208333,13.9791667 L31.7291666,9.1875 L37.75,3.2083334 L34.7916666,0.25 L28.8125,6.2708334 L24.0208333,1.4791667 L24.0208333,13.9791667 L36.5208333,13.9791667 Z M13.9791667,1.4791667 L9.1875,6.2708334 L3.2083334,0.25 L0.25,3.2083334 L6.2708334,9.1875 L1.4791667,13.9791667 L13.9791667,13.9791667 L13.9791667,1.4791667 Z M1.4791667,24.0208333 L6.2708334,28.8125 L0.25,34.7916666 L3.2083334,37.75 L9.1875,31.7291666 L13.9791667,36.5208333 L13.9791667,24.0208333 L1.4791667,24.0208333 Z M24.0208333,36.5208333 L28.8125,31.7291666 L34.7916666,37.75 L37.75,34.7916666 L31.7291666,28.8125 L36.5208333,24.0208333 L24.0208333,24.0208333 L24.0208333,36.5208333 Z"
            id="Shape"
          />
        </g>
      </Base>
    );
  }
}
