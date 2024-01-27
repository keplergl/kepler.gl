// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Split extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-split'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(7.500000, 7.500000)">
          <path d="M19.5,47.4137931 C19.5,48.8421157 20.6192881,50 22,50 C23.3807119,50 24.5,48.8421157 24.5,47.4137931 L24.5,2.5862069 C24.5,1.15788427 23.3807119,0 22,0 C20.6192881,0 19.5,1.15788427 19.5,2.5862069 L19.5,47.4137931 Z" />
          <rect x="0" y="4" width="44" height="5" rx="2.5" />
          <rect
            transform="translate(2.500000, 24.500000) rotate(90.000000) translate(-2.500000, -24.500000) "
            x="-18"
            y="22"
            width="41"
            height="5"
            rx="2.5"
          />
          <rect
            transform="translate(41.500000, 25.000000) rotate(90.000000) translate(-41.500000, -25.000000) "
            x="20.5"
            y="22.5"
            width="42"
            height="5"
            rx="2.5"
          />
          <rect x="0" y="41" width="44" height="5" rx="2.5" />
        </g>
      </Base>
    );
  }
}
