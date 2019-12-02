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
import {findDOMNode} from 'react-dom';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import {theme} from 'kepler.gl/styles';
import Banner from './components/banner';
import Announcement from './components/announcement';
import {replaceLoadDataModal} from './factories/load-data-modal';
import {replaceSaveMap} from './factories/save-map';
import {replaceMapControl} from './factories/map-control';
import {replacePanelHeader} from './factories/panel-header';
import ExportUrlModal from './components/sharing/export-url-modal';
import ConnectBackendStorageModal from './components/backend-storage-modal/connect-backend-storage-modal';
import {AUTH_TOKENS} from './constants/default-settings';
import {getCloudProvider} from './cloud-providers';

import {
  exportFileToCloud,
  loadRemoteMap,
  loadSampleConfigurations,
  setCloudLoginSuccess
} from './actions';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal(),
  replaceSaveMap(),
  replaceMapControl(),
  replacePanelHeader()
]);

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, {testCsvData, sampleTripDataConfig} from './data/sample-trip-data';
import sampleGeojson from './data/sample-small-geojson';
import sampleGeojsonPoints from './data/sample-geojson-points';
import sampleGeojsonConfig from './data/sample-geojson-config';
import sampleH3Data, {config as h3MapConfig} from './data/sample-hex-id-csv';
import sampleAnimateTrip from './data/sample-animate-trip-data';
import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {addDataToMap, addNotification} from 'kepler.gl/actions';
import {processCsvData, processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const BannerHeight = 30;
const BannerKey = 'kgHideBanner-iiba';
const keplerGlGetState = state => state.demo.keplerGl;

const GlobalStyle = styled.div`
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

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.labelColor};
  }
`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {
      params: {id, provider} = {},
      location: {query = {}} = {}
    } = this.props;

    if (provider) {
      const providerHandler = getCloudProvider(provider);

      if (providerHandler) {
        this.props.dispatch(providerHandler.loadMap(query));

        return;
      }
    }

    // Load sample using its id
    if (id) {
      this.props.dispatch(loadSampleConfigurations(id));
    }

    // Load map using a custom
    if (query.mapUrl) {
      // TODO?: validate map url
      this.props.dispatch(loadRemoteMap({dataUrl: query.mapUrl}));
    }

    // delay zs to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //   window.setTimeout(this._showBanner, 3000);
    // }
    // load sample data
    // this._loadSampleData();
    // Notifications
    // this._loadMockNotifications();
  }

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

  _loadMockNotifications = () => {
    const notifications = [
      [{message: 'Welcome to Kepler.gl'}, 3000],
      [{message: 'Something is wrong', type: 'error'}, 1000],
      [{message: 'I am getting better', type: 'warning'}, 1000],
      [{message: 'Everything is fine', type: 'success'}, 1000]
    ];

    this._addNotifications(notifications);
  };

  _addNotifications(notifications) {
    if (notifications && notifications.length) {
      const [notification, timeout] = notifications[0];

      window.setTimeout(() => {
        this.props.dispatch(addNotification(notification));
        this._addNotifications(notifications.slice(1));
      }, timeout);
    }
  }

  _loadSampleData() {
    this._loadPointData();
    // this._loadGeojsonData();
    this._loadTripGeoJson();
    // this._loadIconData();
    // this._loadGeojsonData();
    // this._loadH3HexagonData();
  }

  _loadPointData() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        options: {
          centerMap: true,
          readOnly: false
        },
        config: sampleTripDataConfig
      })
    );
  }

  _loadIconData() {
    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: processCsvData(sampleIconCsv)
          }
        ]
      })
    );
  }

  _loadTripGeoJson() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation'},
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }

  _loadGeojsonData() {
    // load geojson
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Bart Stops Geo', id: 'bart-stops-geo'},
            data: processGeojson(sampleGeojsonPoints)
          },
          {
            info: {label: 'SF Zip Geo', id: 'sf-zip-geo'},
            data: processGeojson(sampleGeojson)
          }
        ],
        options: {
          keepExistingConfig: true
        },
        config: sampleGeojsonConfig
      })
    );
  }

  _loadH3HexagonData() {
    // load h3 hexagon
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'H3 Hexagons V2',
              id: 'h3-hex-id'
            },
            data: processCsvData(sampleH3Data)
          }
        ],
        config: h3MapConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }

  _isCloudStorageEnabled = () => {
    const {app} = this.props.demo;
    return app.featureFlags.cloudStorage;
  };

  _isBackendStorageEnabled = () => {
    const {app} = this.props.demo;
    return app.featureFlags.backendStorage;
  };

  _toggleCloudModal = () => {
    // TODO: this lives only in the demo hence we use the state for now
    // REFCOTOR using redux
    this.setState({
      cloudModalOpen: !this.state.cloudModalOpen
    });
  };

  _toggleSettingsBackendModal = () => {
    this.setState({
      settingsBackendModalOpen: !this.state.settingsBackendModalOpen
    });
  };

  _onExportToCloud = (providerName) => {
    this.props.dispatch(exportFileToCloud(providerName));
  };

  _onCloudLoginSuccess = (providerName) => {
    this.props.dispatch(setCloudLoginSuccess(providerName));
  };

  _getMapboxRef = (mapbox, index) => {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  };

  render() {
    const {showBanner} = this.state;
    const {sharing} = this.props.demo;
    const rootNode = this.root;
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle
          // this is to apply the same modal style as kepler.gl core
          // because styled-components doesn't always return a node
          // https://github.com/styled-components/styled-components/issues/617
          ref={node => {
            node ? (this.root = node) : null;
          }}
        >
          <Banner
            show={this.state.showBanner}
            height={BannerHeight}
            bgColor="#82368c"
            onClose={this._hideBanner}
          >
            <Announcement onDisable={this._disableBanner} />
          </Banner>
          {this._isCloudStorageEnabled() && rootNode && (
            <ExportUrlModal
              sharing={sharing}
              isOpen={Boolean(this.state.cloudModalOpen)}
              onClose={this._toggleCloudModal}
              onExport={this._onExportToCloud}
              onCloudLoginSuccess={this._onCloudLoginSuccess}
              // this is to apply the same modal style as kepler.gl core
              parentSelector={() => findDOMNode(this.root)}
            />
          )}

          {this._isBackendStorageEnabled() && rootNode &&
            <ConnectBackendStorageModal
              isOpen={Boolean(this.state.settingsBackendModalOpen)}
              onClose={this._toggleSettingsBackendModal}
              parentSelector={() => findDOMNode(this.root)}
            />
          }

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
            <AutoSizer>
              {({height, width}) => (
                <KeplerGl
                  mapboxApiAccessToken={AUTH_TOKENS.MAPBOX_TOKEN}
                  id="map"
                  /*
                   * Specify path to keplerGl state, because it is not mount at the root
                   */
                  getState={keplerGlGetState}
                  width={width}
                  height={height - (showBanner ? BannerHeight : 0)}
                  onSaveMap={this._isCloudStorageEnabled() && this._toggleCloudModal}
                  onBackendStorageSettingsClick={this._isBackendStorageEnabled() && this._toggleSettingsBackendModal}
                />
              )}
            </AutoSizer>
          </div>
        </GlobalStyle>
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
