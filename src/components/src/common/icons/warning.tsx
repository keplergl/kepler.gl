// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Warning extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-warning',
    stroke: '#FFF'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M0.349,49h49.302L25,1.842L0.349,49z M3.651,47L25,6.159L46.349,47H3.651z" />
        <rect height="18" width="2" x="24" y="18" />
        <rect height="3" width="2" x="24" y="39" />
      </Base>
    );
  }
}
