// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowDown extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '24px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-arrowdown'
  };

  render() {
    return (
      <Base
        {...this.props}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{fill: 'none', stroke: 'currentColor'}}
      >
        <path d="m6 9 6 6 6-6" />
      </Base>
    );
  }
}
