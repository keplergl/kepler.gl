// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import {theme} from '@kepler.gl/styles';

import sampleData, {config} from './data/sample-data';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

import {
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  CustomPanelsFactory,
  MapPopoverFactory,
  injectComponents
} from '@kepler.gl/components';

import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelFactory from './components/custom-panel';
import CustomMapPopoverFactory from './components/custom-map-popover';

const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 300px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 60px;
  padding: 10px;
`;

// Inject custom components
const KeplerGl = injectComponents([
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory],
  [PanelToggleFactory, CustomPanelToggleFactory],
  [CustomPanelsFactory, CustomSidePanelFactory],
  [MapPopoverFactory, CustomMapPopoverFactory]
]);

class App extends Component {
  componentDidMount() {
    this.props.dispatch(wrapTo('map1', addDataToMap({datasets: sampleData, config})));
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl mapboxApiAccessToken={MAPBOX_TOKEN} id="map1" width={width} height={height} />
          )}
        </AutoSizer>
        <StyledMapConfigDisplay>
          {this.props.app.mapConfig
            ? JSON.stringify(this.props.app.mapConfig)
            : 'Click Save Config to Display Config Here'}
        </StyledMapConfigDisplay>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
