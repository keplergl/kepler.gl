// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Trash extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '14px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-trash'
  };

  render() {
    return (
      <Base
        {...this.props}
        style={{fill: 'none', stroke: 'currentcolor'}}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </Base>
    );
  }
}
