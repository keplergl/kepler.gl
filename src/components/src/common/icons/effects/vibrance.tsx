// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class Vibrance extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-vibrance'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_129_11266)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.19047 14.0953L1.5238 1.90479L14.8571 1.90479L8.19047 14.0953ZM10.6483 8.01305L8.19047 12.5073L5.73266 8.01305C6.32652 8.70473 7.20733 9.14288 8.19047 9.14288C9.17361 9.14288 10.0544 8.70473 10.6483 8.01305ZM11.2935 6.83324L13.5721 2.66669L8.19332 2.66669C9.98036 2.66823 11.4286 4.11738 11.4286 5.90478C11.4286 6.22747 11.3814 6.53913 11.2935 6.83324ZM8.18762 2.66669L2.80887 2.66669L5.08745 6.83325C4.99958 6.53914 4.95238 6.22747 4.95238 5.90478C4.95238 4.11738 6.40058 2.66823 8.18762 2.66669Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_129_11266">
              <rect width="16" height="16" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}
