// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Close extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-closewindow'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(32,32)">
          <path d="M-16,-16 L16,16 M16,-16 L-16,16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </Base>
    );
  }
}
