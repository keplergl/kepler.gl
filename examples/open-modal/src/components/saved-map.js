// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from '@kepler.gl/components';

export default class SavedMap extends Component {
  render() {
    const {mapboxApiAccessToken, id} = this.props;

    return (
      <AutoSizer>
        {({height, width}) => (
          <KeplerGl
            mapboxApiAccessToken={mapboxApiAccessToken}
            id={id}
            width={width}
            height={height}
            mint={false}
          />
        )}
      </AutoSizer>
    );
  }
}
