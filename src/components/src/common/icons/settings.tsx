// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Settings extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '24px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-settings'
  };

  render() {
    return (
      <Base
        {...this.props}
        style={{fill: 'none', stroke: 'currentcolor'}}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 7h-9" />
        <path d="M14 17H5" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </Base>
    );
  }
}
