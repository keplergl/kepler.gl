// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import Base, {BaseProps} from './base';

export default class Histogram extends React.Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-histogram'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(7.500000, 7.500000)">
          <path
            d="M5,40.593203 L16.7666161,40.593203 L16.7666161,10 L5,10 L5,40.593203 L5,40.593203 Z M33.2333839,40.593203 L45,40.593203 L45,10 L33.2333839,10 L33.2333839,40.593203 L33.2333839,40.593203 Z M30.883308,40.5892837 L30.883308,26.4693451 L19.116692,26.4693451 L19.116692,40.5892837 L30.883308,40.5892837 Z"
            id="Shape"
          />
        </g>
      </Base>
    );
  }
}
