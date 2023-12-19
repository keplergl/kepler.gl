// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class Vignette extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-vignette'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.0953 1.90479H1.90479V14.0953H14.0953V1.90479ZM8.00002 13.7566C11.1793 13.7566 13.7566 11.1793 13.7566 8.00002C13.7566 4.82073 11.1793 2.24341 8.00002 2.24341C4.82073 2.24341 2.24341 4.82073 2.24341 8.00002C2.24341 11.1793 4.82073 13.7566 8.00002 13.7566Z"
          />
        </svg>
      </Base>
    );
  }
}
