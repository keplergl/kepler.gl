// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

class PointLayerIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'point-layer-icon',
    totalColor: 6
  };

  render() {
    return (
      <Base {...this.props}>
        <circle cx="29.4" cy="31.6" r="8.4" className="cr1" />
        <circle cx="48.5" cy="15.7" r="6.5" className="cr2" />
        <circle cx="11" cy="44.2" r="3" className="cr3" />
        <circle cx="50" cy="44.2" r="5" className="cr4" />
        <circle cx="34" cy="54.2" r="3" className="cr5" />
        <circle cx="14" cy="16.2" r="4" className="cr6" />
      </Base>
    );
  }
}

export default PointLayerIcon;
