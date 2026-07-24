// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import AutoSizerImport from 'react-virtualized/dist/commonjs/AutoSizer';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import KeplerGl from '@kepler.gl/components';

import sampleData from '../data/sample-data';
import config from '../configurations/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoSizer = AutoSizerImport as any;

export default class FreshMap extends Component<any> {
  componentDidMount() {
    this.props.dispatch(
      wrapTo(
        this.props.id,
        addDataToMap({
          datasets: sampleData,
          options: {
            centerMap: true
          },
          config
        } as any)
      )
    );
  }

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
          />
        )}
      </AutoSizer>
    );
  }
}
