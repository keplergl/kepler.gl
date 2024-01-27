// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class LeftArrow extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-left-arrow'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M39.425 53.21L23.16 36.947l-4.242-4.243a1 1 0 0 1 0-1.414l4.242-4.243 16.264-16.263a1 1 0 0 1 1.414 0l4.242 4.242a1 1 0 0 1 0 1.414L29.525 31.997l15.556 15.556a1 1 0 0 1 0 1.414L40.84 53.21a1 1 0 0 1-1.414 0z" />
      </Base>
    );
  }
}
