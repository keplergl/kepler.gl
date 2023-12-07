// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {Base, BaseProps} from './base';

export default class Upload extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-upload'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M52 9v6a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h38a1 1 0 0 1 1 1zm-4 31L34.426 21.336a3 3 0 0 0-4.852 0L16 40h8v16h16V40h8z" />
      </Base>
    );
  }
}
