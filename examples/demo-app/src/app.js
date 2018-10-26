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
import styled from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import Banner from './components/banner';
import Announcement from './components/announcement';

import {loadSampleConfigurations} from './actions';
import {replaceLoadDataModal} from './factories/load-data-modal';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal()
]);

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData from './data/sample-trip-data';
import sampleGeojson from './data/sample-geojson.json';
import sampleH3Data from './data/sample-hex-id-csv';
import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {updateVisData, addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const BannerHeight = 30;
const BannerKey = 'kgHideBanner-iiba';

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentWillMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {params: {id: sampleMapId} = {}} = this.props;
    this.props.dispatch(loadSampleConfigurations(sampleMapId));
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentDidMount() {
    // delay 2s to show the banner
    if (!window.localStorage.getItem(BannerKey)) {
      window.setTimeout(this._showBanner, 3000);
    }
    // load sample data
    // this._loadSampleData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  _showBanner = () => {
    this.setState({showBanner: true});
  };

  _hideBanner = () => {
    this.setState({showBanner: false});
  };

  _disableBanner = () => {
    this._hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  };

  _loadSampleData() {
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
        {
          centerMap: true,
          readOnly: false
        },
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
        }
      )
    );

    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: Processors.processCsvData(sampleIconCsv)
          }
        ],
        options: {
          centerMap: false
        },
        config: savedMapConfig
      })
    );

    // load geojson
    this.props.dispatch(
      updateVisData({
        info: {label: 'SF Zip Geo'},
        data: Processors.processGeojson(sampleGeojson)
      })
    );

    // load h3 hexagon
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'H3 Hexagons V2',
              id: 'h3-hex-id'
            },
            data: Processors.processCsvData(sampleH3Data)
          }
        ]
      })
    );
  }

  render() {
    const {showBanner, width, height} = this.state;
    return (
      <GlobalStyleDiv>
        <Banner
          show={this.state.showBanner}
          height={BannerHeight}
          bgColor="#82368c"
          onClose={this._hideBanner}
        >
          <Announcement onDisable={this._disableBanner}/>
        </Banner>
        <div
          style={{
            transition: 'margin 1s, height 1s',
            position: 'absolute',
            width: '100%',
            height: showBanner ? `calc(100% - ${BannerHeight}px)` : '100%',
            minHeight: `calc(100% - ${BannerHeight}px)`,
            marginTop: showBanner ? `${BannerHeight}px` : 0
          }}
        >
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id="map"
            /*
             * Specify path to keplerGl state, because it is not mount at the root
             */
            getState={state => state.demo.keplerGl}
            width={width}
            height={height - (showBanner ? BannerHeight : 0)}
          />
        </div>
      </GlobalStyleDiv>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
