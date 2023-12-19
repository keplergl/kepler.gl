// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Base} from '../base';

export default class GeojsonLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: null,
    size: 'tiny',
    predefinedClassName: 'geojson-layer-icon'
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon
          className="cr1"
          points="25.04 23.08 9.72 31.79 8.19 43.2 19.57 53.83 28.79 53.83 35.6 46.57 39.45 30.08 25.04 23.08"
        />
        <polygon
          className="cr2"
          points="52.8 26.3 41.74 30.32 37.9 46.75 45.26 53.83 51.45 53.83 55.07 43.51 52.8 26.3"
          style={{opacity: 0.8}}
        />
        <polygon
          className="cr3"
          points="36.69 48.75 31.93 53.83 41.96 53.83 36.69 48.75"
          style={{opacity: 0.4}}
        />
        <polygon
          className="cr3"
          points="25.95 20.98 40.84 28.22 52.57 24.06 50.89 11.5 23.24 11.5 25.95 20.98"
          style={{opacity: 0.4}}
        />
        <polygon
          className="cr4"
          points="20.79 11.9 11.73 15.72 10.08 28.96 23.64 21.25 20.79 11.9"
          style={{opacity: 0.8}}
        />
      </Base>
    );
  }
}
