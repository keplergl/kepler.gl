// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Hash extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-hash'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M33.3763 45.978H24.1434L20.3011 64H8.88889L12.7312 45.978H0V37.9341H14.4516L16.9749 26.3297H4.30108V18.2857H18.6953L22.6523 0H34.0072L30.1075 18.2857H39.3405L43.2975 0H54.7097L50.7527 18.2857H64V26.3297H49.0323L46.509 37.9341H59.6416V45.978H44.7885L40.9462 64H29.5341L33.3763 45.978ZM25.8638 37.9341H35.0968L37.6201 26.3297H28.3871L25.8638 37.9341Z" />
      </Base>
    );
  }
}
