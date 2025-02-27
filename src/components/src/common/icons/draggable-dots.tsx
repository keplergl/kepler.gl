// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class DraggableDots extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-draggabledots'
  };

  render() {
    return (
      <Base {...this.props}>
        <circle cx="14" cy="5.5" r="1" transform="rotate(90 14 5.5)" />
        <circle cx="14" cy="10.5" r="1" transform="rotate(90 14 10.5)" />
        <circle cx="10" cy="5.5" r="1" transform="rotate(90 10 5.5)" />
        <circle cx="10" cy="10.5" r="1" transform="rotate(90 10 10.5)" />
        <circle cx="6" cy="5.5" r="1" transform="rotate(90 6 5.5)" />
        <circle cx="6" cy="10.5" r="1" transform="rotate(90 6 10.5)" />
        <circle cx="2" cy="5.5" r="1" transform="rotate(90 2 5.5)" />
        <circle cx="2" cy="10.5" r="1" transform="rotate(90 2 10.5)" />
      </Base>
    );
  }
}
