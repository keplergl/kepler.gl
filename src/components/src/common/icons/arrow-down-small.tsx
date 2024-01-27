// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class ArrowDownSmall extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-arrow-down-small'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.4419 5.55807C12.1979 5.314 11.8021 5.314 11.5581 5.55807L8 9.11613L4.44194 5.55807C4.19786 5.314 3.80214 5.314 3.55806 5.55807C3.31398 5.80215 3.31398 6.19788 3.55806 6.44196L7.55806 10.442C7.67527 10.5592 7.83424 10.625 8 10.625C8.16576 10.625 8.32473 10.5592 8.44194 10.442L12.4419 6.44196C12.686 6.19788 12.686 5.80215 12.4419 5.55807Z"
          />
        </svg>
      </Base>
    );
  }
}
