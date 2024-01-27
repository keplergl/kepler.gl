// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

export default class GridLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'grid-layer-icon',
    totalColor: 6
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="11.2" y="11.2" className="cr1" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="25.4" y="11.2" className="cr2" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="39.6" y="11.2" width="13.1" height="13.1" className="cr3" />
        <rect x="11.2" y="25.4" className="cr4" width="13.1" height="13.1" style={{opacity: 0.4}} />
        <rect x="25.4" y="25.4" className="cr5" width="13.1" height="13.1" />
        <rect x="39.6" y="25.4" className="cr6" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="11.2" y="39.6" width="13.1" className="cr1" height="13.1" />
        <rect x="25.4" y="39.6" className="cr2" width="13.1" height="13.1" style={{opacity: 0.4}} />
        <rect x="39.6" y="39.6" className="cr3" width="13.1" height="13.1" style={{opacity: 0.4}} />
      </Base>
    );
  }
}
