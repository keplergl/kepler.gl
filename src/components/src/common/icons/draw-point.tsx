// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class DrawPoint extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-draw-point',
    viewBox: '0 0 22 16'
  };

  render() {
    return (
      <Base {...this.props}>
        <circle cx="11" cy="8" r="5" stroke="currentColor" fill="transparent" strokeWidth="1.5" />
        <circle cx="11" cy="8" r="2" />
      </Base>
    );
  }
}
