// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Expand extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-expand'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(6.000000, 6.000000)">
          <path d="M31.25,6.25 L36.0416667,11.0416667 L30.0208333,17.0208333 L32.9791667,19.9791667 L38.9583333,13.9583333 L43.75,18.75 L43.75,6.25 L31.25,6.25 Z M6.25,18.75 L11.0416667,13.9583333 L17.0208333,19.9791667 L19.9791667,17.0208333 L13.9583333,11.0416667 L18.75,6.25 L6.25,6.25 L6.25,18.75 Z M18.75,43.75 L13.9583333,38.9583333 L19.9791667,32.9791667 L17.0208333,30.0208333 L11.0416667,36.0416667 L6.25,31.25 L6.25,43.75 L18.75,43.75 Z M43.75,31.25 L38.9583333,36.0416667 L32.9791667,30.0208333 L30.0208333,32.9791667 L36.0416667,38.9583333 L31.25,43.75 L43.75,43.75 L43.75,31.25 Z" />
        </g>
      </Base>
    );
  }
}
