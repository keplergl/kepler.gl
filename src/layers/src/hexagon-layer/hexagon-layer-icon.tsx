// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

export default class HexagonLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'hexagon-layer-icon',
    totalColor: 6
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon
          className="cr1"
          points="23.9,10 30.9,14 30.9,22.1 23.9,26.2 16.8,22.1 16.8,14 "
          style={{opacity: 0.6}}
        />
        <polygon
          className="cr2"
          points="23.9,37.8 30.9,41.9 30.9,50 23.9,54 16.8,50 16.8,41.9 "
          style={{opacity: 0.4}}
        />
        <polygon className="cr6" points="40.1,10 47.2,14 47.2,22.1 40.1,26.2 33.1,22.1 33.1,14 " />
        <polygon
          className="cr3"
          points="40.1,37.8 47.2,41.9 47.2,50 40.1,54 33.1,50 33.1,41.9 "
          style={{opacity: 0.8}}
        />
        <polygon
          className="cr1"
          points="15.8,23.9 22.8,27.9 22.8,36.1 15.8,40.1 8.7,36.1 8.7,27.9 "
        />
        <polygon
          className="cr4"
          points="32,23.9 39,27.9 39,36.1 32,40.1 25,36.1 25,27.9 "
          style={{opacity: 0.8}}
        />
        <polygon
          className="cr5"
          points="48.2,23.9 55.3,27.9 55.3,36.1 48.2,40.1 41.2,36.1 41.2,27.9 "
          style={{opacity: 0.4}}
        />
      </Base>
    );
  }
}
