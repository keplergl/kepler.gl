// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class Sepia extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-sepia'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.5" d="M1.90479 1.90479H14.0953V14.0953H1.90479V1.90479Z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.3334 2.66669H2.66669V13.3334H13.3334V2.66669ZM1.90479 1.90479V14.0953H14.0953V1.90479H1.90479Z"
          />
          <path d="M6.92068 5.36513C6.92068 6.22424 6.22424 6.92068 5.36513 6.92068C4.50602 6.92068 3.80957 6.22424 3.80957 5.36513C3.80957 4.50602 4.50602 3.80957 5.36513 3.80957C6.22424 3.80957 6.92068 4.50602 6.92068 5.36513Z" />
          <path d="M5.3726 8.73856L2.28577 13.7143H13.3334V10.449L10.7339 6.09521L7.48465 11.5374L5.3726 8.73856Z" />
        </svg>
      </Base>
    );
  }
}
