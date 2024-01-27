// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {connect} from 'react-redux';
import KeplerGl from '@kepler.gl/components';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

const localeMessages = {
  en: {
    mapLayers: {
      terrain: 'Terrain'
    }
  }
};

const App = () => (
  <div style={{position: 'absolute', width: '100%', height: '100%'}}>
    <AutoSizer>
      {({height, width}) => (
        <KeplerGl
          mapboxApiAccessToken=""
          id="map"
          width={width}
          height={height}
          localeMessages={localeMessages}
        />
      )}
    </AutoSizer>
  </div>
);

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
