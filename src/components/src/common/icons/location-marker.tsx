// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class LocationMarker extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-location-marker'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_118_4762)">
            <path d="M15 7.5H11.965C11.8528 6.62017 11.4517 5.80249 10.8246 5.17529C10.1975 4.54809 9.37982 4.14689 8.5 4.03465V1H7.5V4.03465C6.62018 4.14689 5.80254 4.54809 5.17541 5.17529C4.54827 5.80249 4.14715 6.62017 4.035 7.5H1V8.5H4.035C4.14715 9.37983 4.54827 10.1975 5.17541 10.8247C5.80254 11.4519 6.62018 11.8531 7.5 11.9654V15H8.5V11.9654C9.37986 11.8532 10.1976 11.452 10.8247 10.8248C11.4519 10.1976 11.8531 9.37986 11.9653 8.5H15V7.5ZM8 11C7.40666 11 6.82664 10.8241 6.33329 10.4944C5.83994 10.1648 5.45542 9.69623 5.22836 9.14805C5.0013 8.59987 4.94189 7.99667 5.05764 7.41473C5.1734 6.83279 5.45912 6.29824 5.87868 5.87868C6.29824 5.45912 6.83279 5.1734 7.41473 5.05764C7.99667 4.94189 8.59987 5.0013 9.14805 5.22836C9.69623 5.45542 10.1648 5.83994 10.4944 6.33329C10.8241 6.82664 11 7.40666 11 8C10.9991 8.79538 10.6828 9.55794 10.1204 10.1204C9.55794 10.6828 8.79538 10.9991 8 11Z" />
          </g>
          <defs>
            <clipPath id="clip0_118_4762">
              <rect width="16" height="16" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}
