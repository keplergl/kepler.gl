// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Base} from '../base';

class VectorTileIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string.isRequired)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'vector-tile-layer-icon',
    totalColor: 2
  };

  render(): React.ReactNode {
    return (
      <Base {...this.props}>
        <g id="vector-tile-layer">
          <polygon
            id="Path"
            points="12.1949893 42.9771532 3 37.4596134 12.2699446 31.9771532 21 37.45407"
            style={{opacity: 0.6}}
          />
          <polygon
            id="Path-Copy-3"
            points="22.2609912 37 13.0660019 31.4824602 22.3359466 26 31.0660019 31.4769168"
            style={{opacity: 1}}
          />
          <polygon
            id="Path-Copy-6"
            points="32.1949893 21 23 15.4824602 32.2699446 10 41 15.4769168"
            style={{
              opacity: 1
            }}
          />
          <polygon
            id="Path-Copy"
            points="22.2609912 49 13.0660019 43.4824602 22.3359466 38 31.0660019 43.4769168"
            style={{opacity: 1}}
          />
          <polygon
            id="Path-Copy-4"
            points="32.3269931 43.0228468 23.1320038 37.505307 32.4019485 32.0228468 41.1320038 37.4997636"
            style={{opacity: 0.6}}
          />
          <polygon
            id="Path-Copy-7"
            points="42.3269931 37.0228468 33.1320038 31.505307 42.4019485 26.0228468 51.1320038 31.4997636"
            style={{opacity: 1}}
          />
          <polygon
            id="Path-Copy-2"
            points="32.2609912 55 23.0660019 49.4824602 32.3359466 44 41.0660019 49.4769168"
            style={{opacity: 0.6}}
          />
          <polygon
            id="Path-Copy-5"
            points="42.3269931 49.0228468 33.1320038 43.505307 42.4019485 38.0228468 51.1320038 43.4997636"
            style={{opacity: 1}}
          />
          <polygon
            id="Path-Copy-8"
            points="53.3269931 43.0228468 44.1320038 37.505307 53.4019485 32.0228468 62.1320038 37.4997636"
            style={{opacity: 0.4}}
          />
        </g>
      </Base>
    );
  }
}

export default VectorTileIcon;
