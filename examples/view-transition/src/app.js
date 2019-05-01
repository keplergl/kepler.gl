// Copyright (c) 2019 Uber Technologies, Inc.
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
import {FlyToInterpolator} from 'deck.gl';

import {addDataToMap, updateMap, wrapTo} from 'kepler.gl/actions';
import sampleData from './data/sample-data';
import config from './configurations/config';
import {Button} from 'kepler.gl/components';
import {theme} from 'kepler.gl/styles';
import {ThemeProvider} from 'styled-components';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// extra actions plugged into kepler.gl reducer (store.js)

const VIEW_STATES = [
  {
    bearing: -115.26986254314883,
    latitude: 37.753407152756395,
    longitude: -122.45465493097304,
    pitch: 41.05881084964972,
    zoom: 12.032736770460689
  },
  {
    bearing: 156.60683736618932,
    latitude: 37.7600625157958,
    longitude: -122.42156537912743,
    pitch: 37.416439908044126,
    zoom: 12.590216196236568
  },
  {
    bearing: 70.76821542602615,
    latitude: 37.806108426436246,
    longitude: -122.42756009071918,
    pitch: 40.03085831221525,
    zoom: 11.594914514305733
  }
];

class App extends Component {
  counter = 0;
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

  _goToNextView = () => {
    this.props.dispatch(
      wrapTo(
        'map1',
        updateMap({
          ...VIEW_STATES[this.counter],
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator()
        })
      )
    );
    this.counter =
      this.counter === VIEW_STATES.length - 1 ? 0 : this.counter + 1;
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div style={{position: 'absolute', width: '100%', height: '100%'}}>
          <div style={{position: 'absolute', zIndex: 999, margin: '50px'}}>
            <Button onClick={this._goToNextView}>Fly To Next Story</Button>
          </div>
          <AutoSizer>
            {({height, width}) => (
              <KeplerGl
                mapboxApiAccessToken={MAPBOX_TOKEN}
                id="map1"
                width={width}
                height={height}
              />
            )}
          </AutoSizer>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
