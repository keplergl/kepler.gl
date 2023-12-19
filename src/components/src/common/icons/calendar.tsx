// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Calendar extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-calendar'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.2537 3H13.5C14.0523 3 14.5 3.44772 14.5 4V13C14.5 13.5523 14.0523 14 13.5 14H2.5C1.94772 14 1.5 13.5523 1.5 13V4C1.5 3.44772 1.94772 3 2.5 3H4.73697V2.5C4.73697 2.22386 4.96082 2 5.23697 2C5.51311 2 5.73697 2.22386 5.73697 2.5V3H10.2537V2.5C10.2537 2.22386 10.4776 2 10.7537 2C11.0299 2 11.2537 2.22386 11.2537 2.5V3ZM2.5 13H13.5V7H2.5V13ZM13.5 6H2.5V4H4.7V4.45C4.7 4.75376 4.94624 5 5.25 5C5.55376 5 5.8 4.75376 5.8 4.45V4H10.2V4.45C10.2 4.75376 10.4462 5 10.75 5C11.0538 5 11.3 4.75376 11.3 4.45V4H13.5V6Z"
          />
        </svg>
      </Base>
    );
  }
}
