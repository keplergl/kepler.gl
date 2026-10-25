// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Grouping extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-grouping'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 5H10C11.6569 5 13 6.34315 13 8C13 9.65685 11.6569 11 10 11H6C4.34315 11 3 9.65685 3 8C3 6.34315 4.34315 5 6 5ZM2 8C2 5.79086 3.79086 4 6 4H10C12.2091 4 14 5.79086 14 8C14 10.2091 12.2091 12 10 12H6C3.79086 12 2 10.2091 2 8ZM7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8ZM11 8C11 8.55228 10.5523 9 10 9C9.44772 9 9 8.55228 9 8C9 7.44772 9.44772 7 10 7C10.5523 7 11 7.44772 11 8Z"
        />
      </Base>
    );
  }
}
