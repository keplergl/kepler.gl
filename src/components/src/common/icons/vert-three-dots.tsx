// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class VertThreeDots extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-vert-three-dots'
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="28" y="44" width="8" height="8" />
        <rect x="28" y="28" width="8" height="8" />
        <rect x="28" y="12" width="8" height="8" />
      </Base>
    );
  }
}
