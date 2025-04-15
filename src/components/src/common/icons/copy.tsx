// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Copy extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '14px',
    viewBox: '0 0 14 14',
    predefinedClassName: 'data-ex-icons-copy',
    style: {
      fill: 'none',
      stroke: 'currentColor'
    }
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.8002 4.98792H6.4002C5.73745 4.98792 5.2002 5.52517 5.2002 6.18792V11.5879C5.2002 12.2507 5.73745 12.7879 6.4002 12.7879H11.8002C12.4629 12.7879 13.0002 12.2507 13.0002 11.5879V6.18792C13.0002 5.52517 12.4629 4.98792 11.8002 4.98792Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.8 8.58796H2.2C1.88174 8.58796 1.57652 8.46154 1.35147 8.23649C1.12643 8.01145 1 7.70622 1 7.38796V1.98796C1 1.6697 1.12643 1.36448 1.35147 1.13944C1.57652 0.914392 1.88174 0.787964 2.2 0.787964H7.6C7.91826 0.787964 8.22348 0.914392 8.44853 1.13944C8.67357 1.36448 8.8 1.6697 8.8 1.98796V2.58796"
        />
      </Base>
    );
  }
}
