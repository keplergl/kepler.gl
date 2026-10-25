// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Suitability extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-suitability'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M1 12.5h4v2.5H1zM6 8.5h4V15H6zM11 3.5h4V15h-4z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 1.2 8.9 6.1 5.7 4 0.6 7.6l0.8 1.1 4.4-3.1 3.2 2.1 6.7-5.4z"
        />
      </Base>
    );
  }
}
