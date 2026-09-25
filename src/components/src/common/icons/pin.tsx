// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

type PinProps = Partial<BaseProps> & {
  /** When true, render a solid pin (active / pinned state). */
  filled?: boolean;
};

export default class Pin extends Component<PinProps> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 24 24',
    predefinedClassName: 'data-ex-icons-pin',
    filled: false
  };

  render() {
    const {filled, ...rest} = this.props;
    return (
      <Base
        {...rest}
        style={
          filled
            ? {fill: 'currentColor', stroke: 'currentColor'}
            : {fill: 'none', stroke: 'currentColor'}
        }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 17v5" fill="none" />
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
      </Base>
    );
  }
}
