// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class LineString extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-line-string',
    viewBox: '0 0 22 16'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M2 13L8 3L14 11L20 3" stroke="currentColor" fill="transparent" strokeWidth="1.5" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 15C3.10457 15 4 14.1046 4 13C4 11.8954 3.10457 11 2 11C0.89543 11 0 11.8954 0 13C0 14.1046 0.89543 15 2 15Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 5C9.10457 5 10 4.10457 10 3C10 1.89543 9.10457 1 8 1C6.89543 1 6 1.89543 6 3C6 4.10457 6.89543 5 8 5Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 5C21.1046 5 22 4.10457 22 3C22 1.89543 21.1046 1 20 1C18.8954 1 18 1.89543 18 3C18 4.10457 18.8954 5 20 5Z"
        />
      </Base>
    );
  }
}
