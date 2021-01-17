// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import {connect} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
import {createAction} from 'redux-actions';

import {addDataToMap, wrapTo} from 'kepler.gl/actions';
import sampleData from './data/sample-data';
import config from './configurations/config';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// extra actions plugged into kepler.gl reducer (store.js)
const hideAndShowSidePanel = createAction('HIDE_AND_SHOW_SIDE_PANEL');

class App extends Component {
  componentDidMount() {
    this.props.dispatch(
      wrapTo(
        'map1',
        addDataToMap({
          datasets: sampleData,
          config
        })
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
          {({height, width}) => (
            <KeplerGl mapboxApiAccessToken={MAPBOX_TOKEN} id="map1" width={width} height={height} />
          )}
        </AutoSizer>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
