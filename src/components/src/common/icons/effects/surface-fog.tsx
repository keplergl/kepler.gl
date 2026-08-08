// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class SurfaceFog extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-surface-fog'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3L8 1.5L11 3L8 4.5L5 3Z" opacity="0.6" />
          <path
            d="M3.5 5L8 2.5L12.5 5L8 7.5L3.5 5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <path
            opacity="0.35"
            d="M2 8.5C3.5 8 4.5 8.8 6 8.3C7.5 7.8 8.5 8.6 10 8.1C11.5 7.6 12.5 8.4 14 7.9"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            opacity="0.55"
            d="M1.5 10.3C3 9.8 4 10.6 5.5 10.1C7 9.6 8 10.4 9.5 9.9C11 9.4 12 10.2 14.5 9.7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            opacity="0.75"
            d="M2 12.2C3.5 11.7 4.5 12.5 6 12C7.5 11.5 8.5 12.3 10 11.8C11.5 11.3 12.5 12.1 14 11.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1.5 14C3 13.5 4 14.3 5.5 13.8C7 13.3 8 14.1 9.5 13.6C11 13.1 12 13.9 14.5 13.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </Base>
    );
  }
}
