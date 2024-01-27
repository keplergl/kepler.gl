// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Sunset extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '12px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '12px',
    viewBox: '0 0 12 12',
    predefinedClassName: 'data-ex-icons-sunset'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_85_57899)">
            <path d="M11.2494 10.1268H0.75V10.8768H11.2494V10.1268Z" />
            <path d="M6 7.50183C6.39769 7.50228 6.77896 7.66046 7.06017 7.94166C7.34137 8.22287 7.49955 8.60414 7.5 9.00183H8.25C8.25 8.40509 8.01295 7.8328 7.59099 7.41084C7.16903 6.98888 6.59674 6.75183 6 6.75183C5.40326 6.75183 4.83097 6.98888 4.40901 7.41084C3.98705 7.8328 3.75 8.40509 3.75 9.00183H4.5C4.50045 8.60414 4.65863 8.22287 4.93983 7.94166C5.22104 7.66046 5.60231 7.50228 6 7.50183Z" />
            <path d="M11.25 8.25183H9.375V9.00183H11.25V8.25183Z" />
            <path d="M9.44701 5.02442L8.13232 6.33911L8.6626 6.86939L9.97729 5.5547L9.44701 5.02442Z" />
            <path d="M7.34625 3.59808L6.375 4.56558V1.50183H5.625V4.56558L4.65375 3.59808L4.125 4.12683L6 6.00183L7.875 4.12683L7.34625 3.59808Z" />
            <path d="M2.55274 5.02441L2.02246 5.55469L3.33715 6.86938L3.86743 6.3391L2.55274 5.02441Z" />
            <path d="M2.625 8.25183H0.75V9.00183H2.625V8.25183Z" />
          </g>
          <defs>
            <clipPath id="clip0_85_57899">
              <rect width="12" height="12" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}
