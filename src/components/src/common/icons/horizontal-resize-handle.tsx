// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class HorizontalResizeHandle extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-horizontalresizehandle'
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="15" y="6" width="1" height="14" rx="0.5" transform="rotate(90 15 6)" />
        <rect x="15" y="9" width="1" height="14" rx="0.5" transform="rotate(90 15 9)" />
      </Base>
    );
  }
}
