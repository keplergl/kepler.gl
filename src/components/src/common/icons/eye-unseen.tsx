// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class EyeUnseen extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-eyeunseen'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M17.55,44.49a42.79,42.79,0,0,1-4.18-3.08,36.09,36.09,0,0,1-5.05-5,1.92,1.92,0,0,1,0-2.56c.49-.6,1-1.17,1.56-1.73a40.33,40.33,0,0,1,9.88-7.63,26.07,26.07,0,0,1,7.4-2.73,21.09,21.09,0,0,1,8.51.12,24.12,24.12,0,0,1,3.41,1L34.34,27.7a7.49,7.49,0,0,0-9.59,9.59Z" />
        <path d="M23.14,47.37l5.73-5.73a7.49,7.49,0,0,0,9.82-9.82l6-6a42.78,42.78,0,0,1,4.18,3.09,36.15,36.15,0,0,1,5.05,5,1.86,1.86,0,0,1,.49,1V35s0,0,0,.09,0,.06,0,.09,0,.06,0,.09v.19a1.84,1.84,0,0,1-.49,1c-.49.6-1,1.17-1.56,1.73a40.37,40.37,0,0,1-9.88,7.63,26.06,26.06,0,0,1-7.41,2.73,21.05,21.05,0,0,1-8.51-.12A24.09,24.09,0,0,1,23.14,47.37Z" />
      </Base>
    );
  }
}
