// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ArrowUpSolid extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrowup-solid'
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon points="32.3,20 57.3,45 7.3,45 " />
      </Base>
    );
  }
}
