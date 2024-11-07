// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class ArrowDown extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    style: PropTypes.any
  };

  static defaultProps = {
    height: '8px',
    width: '8px',
    predefinedClassName: 'data-ex-icons-arrowdown-full',
    viewBox: '0 0 8 4'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M4 4L0 0H8L4 4Z" fill="currentColor" />
      </Base>
    );
  }
}
