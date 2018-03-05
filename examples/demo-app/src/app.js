// Copyright (c) 2018 Uber Technologies, Inc.
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
import window from 'global/window';

import Processor from '@uber/kepler.gl/processors';
import KeplerGlSchema from '@uber/kepler.gl/schemas';
import {withState, injectComponents, PanelHeaderFactory} from '@uber/kepler.gl/components';
import {updateVisDataAndConfiguration, updateVisData} from '@uber/kepler.gl/actions';
import {visStateLens} from '@uber/kepler.gl/reducers';
import {wrapTo} from '@uber/kepler.gl/actions';
import KeplerGl from '@uber/kepler.gl';

/*
  define custom header
  inject custom component factory to replace default one
 */
// custom action wrap to mounted instance
const addTodo = (text) => wrapTo('map', {
    type: 'ADD_TODO',
    text
});

const CustomHeader = ({visState, addTodo}) => (
  <div onClick={() => addTodo('hello')}>{`${Object.keys(visState.datasets).length} dataset loaded`}</div>
);
const headerStateToProps = state => ({loaded: state.app.loaded});
const myCustomHeaderFactory = () => withState(
  // keplerGl state lenses
  [visStateLens],
  // customMapStateToProps
  headerStateToProps,
  // actions
  {addTodo}
)(CustomHeader);

//
// const KeplerGl = injectComponents([
//   [PanelHeaderFactory, myCustomHeaderFactory]
// ]);

// Sample data
/* eslint-disable no-unused-vars */
import sampleData from './data/sample-data';
import sampleTripData from './data/sample-trip-data';
import sampleHexIdCsv from './data/sample-hex-id-csv';
import sampleGeojson from './data/sample-geojson.json';
import sampleIconCsv from './data/sample-icon-csv';
/* eslint-enable no-unused-vars */



class App extends Component {
  state = {
    width: window.innerWidth,
    height: 800
  };

  componentWillMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentDidMount() {
    // load trip based data with config
    this.props.dispatch(
      updateVisData(
        // datasets
        {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        // option
        {},
        // config
        {
          filters: [
            {
              id: 'me',
              dataId: 'test_trip_data',
              name: 'tpep_pickup_datetime',
              type: 'timeRange',
              enlarged: true
            }
          ]
        })
    );

    // load point based data
    // this.props.dispatch(updateVisData(sampleData));

    // load data with h3 hex id
    // this.props.dispatch(
    //   updateVisData({
    //     info: {
    //       label: 'Hexagon by Id',
    //       id: 'test_phone_data'
    //     },
    //     data: Processor.processCsvData(sampleHexIdCsv)
    //   })
    // );

    // load icon data
    // this.props.dispatch(
    //   updateVisData({
    //     info: {
    //       label: 'Icon Data',
    //       id: 'test_icon_data'
    //     },
    //     data: Processor.processCsvData(sampleIconCsv)
    //   })
    // );

    // load geojson
    // this.props.dispatch(
    //   updateVisData({
    //     info: {label: 'SF Zip Geo'},
    //     data: Processor.processGeojson(sampleGeojson)
    //   })
    // );
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <KeplerGl
          id="map"
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
