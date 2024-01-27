// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowDownSolid extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrowdown-solid'
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon points="6.4,20.8 56.4,20.8 31.4,45.8 " />
      </Base>
    );
  }
}
