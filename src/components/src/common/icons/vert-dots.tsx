// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class VertDots extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-vertdot'
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="35.01" y="48.31" width="6.44" height="6.44" />
        <rect x="35.01" y="35.43" width="6.44" height="6.44" />
        <rect x="35.01" y="22.55" width="6.44" height="6.44" />
        <rect x="35.01" y="9.67" width="6.44" height="6.44" />
        <rect x="22.13" y="48.31" width="6.44" height="6.44" />
        <rect x="22.13" y="35.43" width="6.44" height="6.44" />
        <rect x="22.13" y="22.55" width="6.44" height="6.44" />
        <rect x="22.13" y="9.67" width="6.44" height="6.44" />
      </Base>
    );
  }
}
