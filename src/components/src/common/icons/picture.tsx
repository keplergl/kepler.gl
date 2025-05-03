// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import Base, {BaseProps} from './base';

export default class Picture extends React.Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 24 24',

    predefinedClassName: 'data-ex-icons-minus'
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
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />{' '}
      </Base>
    );
  }
}
