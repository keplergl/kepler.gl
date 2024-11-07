// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Help extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-info'
  };

  render() {
    return (
      <Base viewBox="0 0 16 16" {...this.props}>
        <path d="M8 15.375C3.933 15.375.625 12.067.625 8S3.933.625 8 .625 15.375 3.933 15.375 8 12.067 15.375 8 15.375zM8 1.89C4.608 1.89 1.868 4.63 1.868 8A6.138 6.138 0 008 14.132 6.124 6.124 0 0014.132 8C14.11 4.629 11.372 1.89 8 1.89z" />
        <path d="M7.81 10.044a.634.634 0 01-.632-.632c0-.97.632-1.812 1.538-2.086.4-.127.675-.485.654-.906 0-.759-.632-1.391-1.391-1.391s-1.39.632-1.39 1.39a.634.634 0 01-.633.633.634.634 0 01-.632-.632C5.366 4.966 6.546 3.786 8 3.786a2.635 2.635 0 012.634 2.634c0 .969-.632 1.812-1.538 2.086-.4.126-.675.484-.653.906a.648.648 0 01-.633.632zM7.81 12.109a.759.759 0 100-1.517.759.759 0 000 1.517z" />
      </Base>
    );
  }
}
