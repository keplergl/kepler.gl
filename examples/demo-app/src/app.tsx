// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect, useDispatch} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import {ScreenshotWrapper} from 'react-ai-assist';
import {
  messages as aiAssistantMessages,
  setStartScreenCapture,
  setScreenCaptured
} from '@kepler.gl/ai-assistant';
import {panelBorderColor, theme} from '@kepler.gl/styles';
import {useSelector} from 'react-redux';
import {ParsedConfig} from '@kepler.gl/types';
import {SqlPanel} from 'keplergl-duckdb-plugin';
import Banner from './components/banner';
import Announcement, {FormLink} from './components/announcement';
import {replaceLoadDataModal} from './factories/load-data-modal';
import {replaceMapControl} from './factories/map-control';
import {replacePanelHeader} from './factories/panel-header';
import {CLOUD_PROVIDERS_CONFIGURATION, DEFAULT_FEATURE_FLAGS} from './constants/default-settings';
import {messages} from './constants/localization';

import {
  loadRemoteMap,
  loadSampleConfigurations,
  onExportFileSuccess,
  onLoadCloudMapSuccess
} from './actions';

import {
  loadCloudMap,
  addDataToMap,
  replaceDataInMap,
  toggleMapControl,
  toggleModal
} from '@kepler.gl/actions';
import {CLOUD_PROVIDERS} from './cloud-providers';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';

const KeplerGl = require('@kepler.gl/components').injectComponents([
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
import sampleAnimateTrip, {animateTripDataId} from './data/sample-animate-trip-data';
import sampleIconCsv from './data/sample-icon-csv';
import sampleGpsData from './data/sample-gps-data';
import sampleRowData, {config as rowDataConfig} from './data/sample-row-data';
import {processCsvData, processGeojson, processRowObject} from '@kepler.gl/processors';

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

const CONTAINER_STYLE = {
  transition: 'margin 1s, height 1s',
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#333'
};

const StyledResizeHandle = styled(PanelResizeHandle)`
  background-color: ${panelBorderColor};
  &:hover {
    background-color: #555;
  }
  width: 100%;
  height: 5px;
  cursor: row-resize;
`;

const App = props => {
  const [showBanner, toggleShowBanner] = useState(false);
  const {params: {id, provider} = {}, location: {query = {}} = {}} = props;
  const dispatch = useDispatch();

  const isSqlPanelOpen = useSelector(
    state => state?.demo?.keplerGl?.map?.uiState.mapControls.sqlPanel.active
  );

  useEffect(() => {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations

    const cloudProvider = CLOUD_PROVIDERS.find(c => c.name === provider);
    if (cloudProvider) {
      dispatch(
        loadCloudMap({
          loadParams: query,
          provider: cloudProvider,
          onSuccess: onLoadCloudMapSuccess
        })
      );
      return;
    }

    // Load sample using its id
    if (id) {
      dispatch(loadSampleConfigurations(id));
    }

    // Load map using a custom
    if (query.mapUrl) {
      // TODO?: validate map url
      dispatch(loadRemoteMap({dataUrl: query.mapUrl}));
    }

    if (query.sql) {
      dispatch(toggleMapControl('sqlPanel', 0));
      dispatch(toggleModal(null));
    }

    // delay zs to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //   window.setTimeout(_showBanner, 3000);
    // }
    // load sample data
    // _loadSampleData();

    // Notifications
    // _loadMockNotifications();
  }, [dispatch, id, provider, query]);

  const _setStartScreenCapture = useCallback(
    flag => {
      dispatch(setStartScreenCapture(flag));
    },
    [dispatch]
  );

  const _setScreenCaptured = useCallback(
    screenshot => {
      dispatch(setScreenCaptured(screenshot));
    },
    [dispatch]
  );

  // eslint-disable-next-line no-unused-vars
  const _showBanner = useCallback(() => {
    toggleShowBanner(true);
  }, [toggleShowBanner]);

  const hideBanner = useCallback(() => {
    toggleShowBanner(false);
  }, [toggleShowBanner]);

  const _disableBanner = useCallback(() => {
    hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  }, [hideBanner]);

  const _loadRowData = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Sample Visit Data',
              id: 'sample_visit_data'
            },
            data: processRowObject(sampleRowData)
          }
        ],
        config: rowDataConfig
      })
    );
  }, [dispatch]);

  const _loadPointData = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Sample Taxi Trips 1',
              id: 'test_trip_data',
              color: [255, 0, 0]
            },
            data: {
              rows: sampleTripData.rows.slice(0, 20),
              fields: cloneDeep(sampleTripData.fields)
            }
          },
          {
            info: {
              label: 'Sample Taxi Trips 2',
              id: 'test_trip_data_2',
              color: [0, 255, 0]
            },
            data: {
              rows: sampleTripData.rows.slice(5, sampleTripData.rows.length),
              fields: cloneDeep(sampleTripData.fields)
            }
          }
        ],
        options: {
          // centerMap: true,
          keepExistingConfig: true
        },
        config: sampleTripDataConfig
      })
    );
  }, [dispatch]);

  const _loadScenegraphLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Scenegraph Ducks',
            id: 'test_trip_data'
          },
          data: processCsvData(testCsvData)
        },
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: '3D',
                  config: {
                    dataId: 'test_trip_data',
                    columns: {
                      lat: 'gps_data.lat',
                      lng: 'gps_data.lng'
                    },
                    isVisible: true
                  }
                }
              ]
            }
          }
        }
      })
    );
  }, [dispatch]);

  const _loadIconData = useCallback(() => {
    // load icon data and config and process csv file
    dispatch(
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
  }, [dispatch]);

  const _loadTripGeoJson = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation', id: animateTripDataId},
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }, [dispatch]);

  const _loadGeojsonData = useCallback(() => {
    // load geojson
    const geojsonPoints = processGeojson(sampleGeojsonPoints);
    const geojsonZip = processGeojson(sampleGeojson);
    dispatch(
      addDataToMap({
        datasets: [
          geojsonPoints
            ? {
                info: {label: 'Bart Stops Geo', id: 'bart-stops-geo'},
                data: geojsonPoints
              }
            : null,
          geojsonZip
            ? {
                info: {label: 'SF Zip Geo', id: 'sf-zip-geo'},
                data: geojsonZip
              }
            : null
        ].filter(d => d !== null),
        options: {
          keepExistingConfig: true
        },
        config: sampleGeojsonConfig as ParsedConfig
      })
    );
  }, [dispatch]);

  const _replaceData = useCallback(() => {
    // add geojson data
    const sliceData = processGeojson({
      type: 'FeatureCollection',
      features: sampleGeojsonPoints.features.slice(0, 5)
    });
    _loadGeojsonData();
    window.setTimeout(() => {
      dispatch(
        replaceDataInMap({
          datasetToReplaceId: 'bart-stops-geo',
          datasetToUse: {
            info: {label: 'Bart Stops Geo Replaced', id: 'bart-stops-geo-2'},
            data: sliceData
          }
        })
      );
    }, 1000);
  }, [dispatch, _loadGeojsonData]);

  const _loadH3HexagonData = useCallback(() => {
    // load h3 hexagon
    dispatch(
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
  }, [dispatch]);

  const _loadS2Data = useCallback(() => {
    // load s2
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'S2 Data',
              id: s2DataId
            },
            data: processCsvData(sampleS2Data)
          }
        ],
        config: s2MapConfig as ParsedConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }, [dispatch]);

  const _loadGpsData = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Gps Data',
              id: 'gps-data'
            },
            data: processCsvData(sampleGpsData)
          }
        ],
        options: {
          keepExistingConfig: true
        }
      })
    );
  }, [dispatch]);

  const combinedMessages = useMemo(() => {
    return Object.keys(messages).reduce(
      (acc, language) => ({
        ...acc,
        [language]: {
          ...(messages[language] || {}),
          ...(aiAssistantMessages[language] || {})
        }
      }),
      {}
    );
  }, []);

  // eslint-disable-next-line no-unused-vars
  const _loadSampleData = useCallback(() => {
    // _loadPointData();
    // _loadGeojsonData();
    // _loadTripGeoJson();
    // _loadIconData();
    // _loadH3HexagonData();
    // _loadS2Data();
    // _loadScenegraphLayer();
    // _loadGpsData();
    // _loadRowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _loadPointData,
    _loadGeojsonData,
    _loadTripGeoJson,
    _loadIconData,
    _loadH3HexagonData,
    _loadS2Data,
    _loadScenegraphLayer,
    _loadGpsData,
    _loadRowData,
    _replaceData
  ]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle>
        <ScreenshotWrapper
          startScreenCapture={props.demo.aiAssistant.screenshotToAsk.startScreenCapture}
          setScreenCaptured={_setScreenCaptured}
          setStartScreenCapture={_setStartScreenCapture}
        >
          <Banner show={showBanner} height={BannerHeight} bgColor="#2E7CF6" onClose={hideBanner}>
            <Announcement onDisable={_disableBanner} />
          </Banner>
          <div style={CONTAINER_STYLE}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={isSqlPanelOpen ? 60 : 100}>
                <AutoSizer>
                  {({height, width}) => (
                    <KeplerGl
                      mapboxApiAccessToken={CLOUD_PROVIDERS_CONFIGURATION.MAPBOX_TOKEN}
                      id="map"
                      getState={keplerGlGetState}
                      width={width}
                      height={height}
                      cloudProviders={CLOUD_PROVIDERS}
                      localeMessages={combinedMessages}
                      onExportToCloudSuccess={onExportFileSuccess}
                      onLoadCloudMapSuccess={onLoadCloudMapSuccess}
                      featureFlags={DEFAULT_FEATURE_FLAGS}
                    />
                  )}
                </AutoSizer>
              </Panel>

              {isSqlPanelOpen && (
                <>
                  <StyledResizeHandle />
                  <Panel defaultSize={40} minSize={20}>
                    <SqlPanel initialSql={query.sql || ''} />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>
        </ScreenshotWrapper>
      </GlobalStyle>
    </ThemeProvider>
  );
};

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
