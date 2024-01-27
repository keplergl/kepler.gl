// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Sunrise extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '12px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '12px',
    viewBox: '0 0 12 12',
    predefinedClassName: 'data-ex-icons-sunrise'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_85_57889)">
            <path d="M11.2494 10.125H0.75V10.875H11.2494V10.125Z" />
            <path d="M6 7.5C6.39769 7.50045 6.77896 7.65863 7.06017 7.93983C7.34137 8.22104 7.49955 8.60231 7.5 9H8.25C8.25 8.40326 8.01295 7.83097 7.59099 7.40901C7.16903 6.98705 6.59674 6.75 6 6.75C5.40326 6.75 4.83097 6.98705 4.40901 7.40901C3.98705 7.83097 3.75 8.40326 3.75 9H4.5C4.50045 8.60231 4.65863 8.22104 4.93983 7.93983C5.22104 7.65863 5.60231 7.50045 6 7.5Z" />
            <path d="M11.25 8.25H9.375V9H11.25V8.25Z" />
            <path d="M9.44701 5.02259L8.13232 6.33728L8.6626 6.86756L9.97729 5.55287L9.44701 5.02259Z" />
            <path d="M6 1.5L4.125 3.375L4.65375 3.90375L5.625 2.93625V3V5.625H6.375V3V2.93625L7.34625 3.90375L7.875 3.375L6 1.5Z" />
            <path d="M2.55274 5.02258L2.02246 5.55286L3.33715 6.86754L3.86743 6.33727L2.55274 5.02258Z" />
            <path d="M2.625 8.25H0.75V9H2.625V8.25Z" />
          </g>
          <defs>
            <clipPath id="clip0_85_57889">
              <rect width="12" height="12" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}
