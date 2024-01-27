// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Rocket extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-rocket'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M40.67,13,26.22,27.43H17.56L8.89,39s9.18-2.56,14.53-1.36L8.89,56.32l19-14.81c2.65,6.08-1.71,14.81-1.71,14.81l11.55-8.67V39L52.22,24.54,55.11,10.1Z" />
      </Base>
    );
  }
}
