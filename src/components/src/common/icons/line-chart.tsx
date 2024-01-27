// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class LineChart extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-linechart'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M53.4647408,17.8549995L35.8387756,35.4809608L25.5911236,25.2333088L6.607347,44.2427025
	l3.6122975,3.6122971l15.371479-15.3714752l10.2476521,10.2476501l21.2638779-21.2382584L53.4647408,17.8549995z"
        />
      </Base>
    );
  }
}
