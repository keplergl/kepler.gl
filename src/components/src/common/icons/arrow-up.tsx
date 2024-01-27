// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowUp extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrow_up'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M50.9,46.7c-0.4,0.4-1.1,0.4-1.6,0L32,29.3L14.6,46.7c-0.4,0.4-1.1,0.4-1.6,0l-4.7-4.7c-0.4-0.4-0.4-1.1,0-1.6l22.9-22.9
	c0.4-0.4,1.1-0.4,1.6,0l22.9,22.9c0.4,0.4,0.4,1.1,0,1.6L50.9,46.7z"
        />
      </Base>
    );
  }
}
