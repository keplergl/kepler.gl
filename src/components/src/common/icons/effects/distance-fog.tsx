// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class DistanceFog extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-distance-fog'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.3"
            d="M2 3.5H14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            opacity="0.45"
            d="M3 5.8H13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            opacity="0.6"
            d="M2.5 8.1H13.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            opacity="0.8"
            d="M3 10.4H13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M2 12.7H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Base>
    );
  }
}
