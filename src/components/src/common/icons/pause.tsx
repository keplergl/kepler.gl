// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Pause extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-pause'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M23.015 56h-9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2zm29-2V10a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v44a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2z" />
      </Base>
    );
  }
}
