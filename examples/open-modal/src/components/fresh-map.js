// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import KeplerGl from '@kepler.gl/components';

import sampleData from '../data/sample-data';
import config from '../configurations/config';

export default class FreshMap extends Component {
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
        })
      )
    );
  }

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
          />
        )}
      </AutoSizer>
    );
  }
}
