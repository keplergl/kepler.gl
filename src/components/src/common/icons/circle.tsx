// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Circle extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-circle',
    viewBox: '0 0 22 16'
  };

  render() {
    return (
      <Base {...this.props}>
        <circle cx="11" cy="8" r="6" stroke="currentColor" fill="transparent" strokeWidth="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z"
        />
      </Base>
    );
  }
}
