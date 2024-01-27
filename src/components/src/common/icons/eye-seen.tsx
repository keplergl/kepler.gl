// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class EyeSeen extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-eyeseen'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M55.25,35v-.09a1.86,1.86,0,0,0-.49-1,36.15,36.15,0,0,0-5.05-5,31.92,31.92,0,0,0-13.19-7A21.09,21.09,0,0,0,28,21.8a26.07,26.07,0,0,0-7.4,2.73,40.33,40.33,0,0,0-9.88,7.63c-.54.56-1.07,1.12-1.56,1.73a1.92,1.92,0,0,0,0,2.56,36.09,36.09,0,0,0,5.05,5,31.89,31.89,0,0,0,13.19,7,21.05,21.05,0,0,0,8.51.12,26.06,26.06,0,0,0,7.41-2.73,40.37,40.37,0,0,0,9.88-7.63c.54-.56,1.07-1.12,1.56-1.73a1.84,1.84,0,0,0,.49-1v-.19s0-.06,0-.09,0-.06,0-.09,0-.08,0-.09M32,44.51a9.35,9.35,0,1,1,9.28-9.35A9.31,9.31,0,0,1,32,44.51" />
        <path d="M32,32.07a3.1,3.1,0,1,1-3.07,3.1A3.08,3.08,0,0,1,32,32.07" />
      </Base>
    );
  }
}
