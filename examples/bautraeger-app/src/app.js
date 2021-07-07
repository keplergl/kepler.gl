import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';

import {theme} from './gb-theme';
//import {theme} from 'kepler.gl/styles';
import Banner from './components/banner';
import Announcement, {FormLink} from './components/announcement';
import {replaceLoadDataModal} from './factories/load-data-modal';
import {replaceMapControl} from './factories/map-control';
import {replacePanelHeader} from './factories/panel-header';
import {AUTH_TOKENS, APP_NAME, APP_WEBSITE, APP_VERSION} from './constants/default-settings';
import {messages} from './constants/localization';

import {
  loadRemoteMap
  // loadSampleConfigurations,
  // onExportFileSuccess,
  // onLoadCloudMapSuccess
} from './actions';

// import {loadCloudMap} from 'kepler.gl/actions';
// import {CLOUD_PROVIDERS} from './cloud-providers';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal(),
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
import sampleS2Data, {config as s2MapConfig, dataId as s2DataId} from './data/sample-s2-data';
import sampleAnimateTrip from './data/sample-animate-trip-data';
import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {addDataToMap, addNotification} from 'kepler.gl/actions';
import {processCsvData, processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const BannerHeight = 48;
const BannerKey = `banner-${FormLink}`;
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

const StyledTemplateForAComponent = styled.div`
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

class App extends Component {
  state = {
    showBanner: true,
    width: window.innerWidth,
    height: window.innerHeight,
    someCustomProp: {some_dummy_value: [1, 2, 3, 4]}
  };

  componentDidMount() {
    console.log('componentDidMount123');
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {
      params: {id, provider} = {},
      location: {query = {}} = {}} = this.props;

    // Load map using a custom
    if (query.mapUrl) {
      // TODO?: validate map url
      this.props.dispatch(loadRemoteMap({dataUrl: query.mapUrl}));
    }

    // delay zs to show the banner
    if (!window.localStorage.getItem(BannerKey)) {
      window.setTimeout(this._showBanner, 2000);
    }
    // load sample data
    // this._loadSampleData();
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

  _addNotifications(notifications) {
    if (notifications && notifications.length) {
      const [notification, timeout] = notifications[0];

      window.setTimeout(() => {
        this.props.dispatch(addNotification(notification));
        this._addNotifications(notifications.slice(1));
      }, timeout);
    }
  }

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

  // window.DBKeplerGl = KeplerGl;
  render() {
    console.log("Messages:")
    console.log(messages)
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
            bgColor="#2E7CF6"
            onClose={this._hideBanner}
          >
            <Announcement onDisable={this._disableBanner} />
          </Banner>
          <div
            style={{
              transition: 'margin 1s, height 1s',
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0
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
                  appName={APP_NAME}
                  appWebsite={APP_WEBSITE}
                  version={APP_VERSION}
                  getState={keplerGlGetState}
                  width={width}
                  height={height}
                  localeMessages={messages}
                />
              )}
            </AutoSizer>
            <StyledTemplateForAComponent>
              {this.state.someCustomProp
                ? `Data got read correctly from this.state.someCustomProp : ${JSON.stringify(
                    this.state.someCustomProp
                  )}`
                : 'Data displayed here if this.state.someCustomProp is not null'}
            </StyledTemplateForAComponent>
          </div>
        </GlobalStyle>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
