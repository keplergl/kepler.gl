// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Folder extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-folder'
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
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </Base>
    );
  }
}
