// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from '../base';

export default class ApiKey extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-api-key'
  };

  render() {
    return (
      <Base {...this.props}>
        <g fill="none" stroke="currentColor">
        <circle cx={9} cy={14} r={4}></circle>
          <path strokeLinecap="round" d="m12 11l3.5-3.5M17 6l-1.5 1.5m0 0L18 10"></path>
        </g>
      </Base>
    );
  }
}
