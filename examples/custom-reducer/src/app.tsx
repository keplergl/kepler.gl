// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {connect} from 'react-redux';
import AutoSizerImport from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from '@kepler.gl/components';
import {createAction} from 'redux-actions';

import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import sampleData from './data/sample-data';
import config from './configurations/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoSizer = AutoSizerImport as any;

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// extra actions plugged into kepler.gl reducer (store.js)
const hideAndShowSidePanel = createAction('HIDE_AND_SHOW_SIDE_PANEL');

class App extends Component<any> {
  componentDidMount() {
    this.props.dispatch(
      wrapTo(
        'map1',
        addDataToMap({
          datasets: sampleData,
          config
        } as any)
      )
    );
  }

  _toggleSidePanelVisibility = () => {
    this.props.dispatch(wrapTo('map1', hideAndShowSidePanel()));
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <button onClick={this._toggleSidePanelVisibility}> Hide / Show Side Panel</button>
        <AutoSizer>
          {({height, width}: {height: number; width: number}) => (
            <KeplerGl mapboxApiAccessToken={MAPBOX_TOKEN} id="map1" width={width} height={height} />
          )}
        </AutoSizer>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => state;
const dispatchToProps = (dispatch: any) => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
