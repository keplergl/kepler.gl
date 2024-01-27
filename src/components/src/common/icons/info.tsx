// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Info extends Component<Partial<BaseProps> & {stroke?: string}> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-info',
    stroke: '#FFF'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <circle
          cx="25"
          cy="25"
          fill="none"
          r="24"
          stroke={this.props.stroke}
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path d="M23.779,16.241c-0.216,0-0.357-0.144-0.357-0.359v-2.618c0-0.215,0.142-0.359,0.357-0.359h2.439  c0.215,0,0.359,0.144,0.359,0.359v2.618c0,0.215-0.145,0.359-0.359,0.359H23.779z M23.852,37.293c-0.215,0-0.358-0.143-0.358-0.358  V20.473c0-0.215,0.144-0.359,0.358-0.359h2.295c0.216,0,0.359,0.144,0.359,0.359v16.462c0,0.216-0.144,0.358-0.359,0.358H23.852z" />
      </Base>
    );
  }
}
