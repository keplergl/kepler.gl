// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {connect} from 'react-redux';
import AutoSizerImport from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import KeplerGl from '@kepler.gl/components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoSizer = AutoSizerImport as any;

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const StyledWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

const App = () => (
  <StyledWrapper>
    <AutoSizer>
      {({height, width}: {height: number; width: number}) => (
        <KeplerGl mapboxApiAccessToken={MAPBOX_TOKEN} id="map1" width={width} height={height} />
      )}
    </AutoSizer>
  </StyledWrapper>
);

const mapStateToProps = (state: any) => state;
const dispatchToProps = (dispatch: any) => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
