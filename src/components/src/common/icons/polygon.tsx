// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class DrawPolygon extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-polygon',
    viewBox: '0 0 22 18'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 2L18 6L20 16L2 13L9 2Z"
          stroke="currentColor"
          fill="transparent"
          strokeWidth="1.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 15C3.10457 15 4 14.1046 4 13C4 11.8954 3.10457 11 2 11C0.89543 11 0 11.8954 0 13C0 14.1046 0.89543 15 2 15Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6C16 7.10457 16.8954 8 18 8Z"
        />
      </Base>
    );
  }
}
