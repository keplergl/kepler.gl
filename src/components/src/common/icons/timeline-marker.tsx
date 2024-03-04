// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes, {any} from 'prop-types';
import Base from './base';

export default class TimelineMarker extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    // not expected?
    width: PropTypes.string,
    style: any
  };

  static defaultProps = {
    height: '12px',
    width: '5px',
    predefinedClassName: 'data-ex-icons-timeline-marker',
    viewBox: '0 0 5 12'
  };

  render() {
    return (
      <Base {...this.props}>
        <rect width="5" height="9" fill="currentColor" />
        <path d="M2.5 11.5L0 9H5L2.5 11.5Z" fill="currentColor" />
      </Base>
    );
  }
}
