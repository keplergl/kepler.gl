// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowDown extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrowdown'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M13.1,17.5c0.4-0.4,1.1-0.4,1.6,0L32,34.8l17.4-17.4c0.4-0.4,1.1-0.4,1.6,0l4.7,4.7c0.4,0.4,0.4,1.1,0,1.6L32.8,46.7
	c-0.4,0.4-1.1,0.4-1.6,0L8.3,23.8c-0.4-0.4-0.4-1.1,0-1.6L13.1,17.5z"
        />{' '}
      </Base>
    );
  }
}
