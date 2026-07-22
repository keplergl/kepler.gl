// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import AutoSizerImport from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from '@kepler.gl/components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoSizer = AutoSizerImport as any;

export default class SavedMap extends Component<any> {
  render() {
    const {mapboxApiAccessToken, id} = this.props;

    return (
      <AutoSizer>
        {({height, width}: {height: number; width: number}) => (
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
