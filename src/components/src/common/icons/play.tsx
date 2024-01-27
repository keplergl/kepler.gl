// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Play extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-play'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M15.625 7.434l36.738 23.378a2 2 0 0 1 0 3.375L15.625 57.566c-1.997 1.27-4.61-.164-4.61-2.531V9.965c0-2.368 2.613-3.802 4.61-2.531z" />
      </Base>
    );
  }
}
