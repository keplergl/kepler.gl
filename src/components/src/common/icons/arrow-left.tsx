// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowLeft extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrowleft'
  };

  render() {
    return (
      <Base {...this.props}>
        <g
          id="arrow-left"
          transform="translate(32.000000, 31.500000) scale(-1, 1) translate(-32.000000, -31.500000) translate(17.000000, 9.000000)"
        >
          <path d="M5.7,44.7 L1.2,40.3 C0.8,39.9 0.8,39.3 1.2,38.9 L17.6,23 L1.2,7 C0.8,6.6 0.8,6 1.2,5.5 L5.7,1.1 C6.1,0.7 6.8,0.7 7.2,1.1 L24.3,17.8 L28.8,22.2 C29.2,22.6 29.2,23.2 28.8,23.6 L24.2,28 L7.2,44.7 C6.8,45.1 6.1,45.1 5.7,44.7" />
        </g>{' '}
      </Base>
    );
  }
}
