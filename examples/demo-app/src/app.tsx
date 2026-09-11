// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {ThemeProvider, StyleSheetManager} from 'styled-components';
import {useDispatch, useStore} from 'react-redux';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import isEqual from 'es-toolkit/compat/isEqual';
import {useSelector} from 'react-redux';
import isPropValid from '@emotion/is-prop-valid';
import {useParams, useSearchParams, useLocation} from 'react-router-dom';
import {WebMercatorViewport} from '@deck.gl/core';
import {setMapBoundary} from '@openassistant/kepler-assistant';
import {AiAssistantPanel} from '@openassistant/kepler-assistant';
import {theme} from '@kepler.gl/styles';
import {SidebarFactory} from '@kepler.gl/components';
import {KeplerAppShell, SqlroomsSidebarFactory} from '@kepler.gl/sqlrooms/shell';
import {SqlroomsDemoLayout} from './components/sqlrooms-demo-layout';
import {ThemeProvider as SqlroomsThemeProvider} from '@sqlrooms/ui';
import {ParsedConfig} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';
import {SqlPanel} from '@kepler.gl/duckdb/components';
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
  toggleModal,
  toggleSidePanel
} from '@kepler.gl/actions';
import {CLOUD_PROVIDERS} from './cloud-providers';

const KeplerGl = require('@kepler.gl/components').injectComponents([
  replaceLoadDataModal(),
  replaceMapControl(),
  replacePanelHeader(),
  [SidebarFactory, SqlroomsSidebarFactory]
]);

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, {testCsvData, sampleTripDataConfig} from './data/sample-trip-data';
// import sampleGeojson from './data/sample-small-geojson';
import sampleGeojsonPoints from './data/sample-geojson-points';
import sampleGeojsonConfig from './data/sample-geojson-config';
import sampleH3Data, {config as h3MapConfig} from './data/sample-hex-id-csv';
import sampleS2Data, {config as s2MapConfig, dataId as s2DataId} from './data/sample-s2-data';
import sampleA5Data, {config as a5MapConfig, dataId as a5DataId} from './data/sample-a5-data';
import sampleAnimateTrip, {
  pointData,
  pointDataId,
  animateTripDataId,
  replacePointData,
  config as syncedTripConfig
} from './data/sample-animate-trip-data';
import sampleGpsData from './data/sample-gps-data';
import sampleRowData, {config as rowDataConfig} from './data/sample-row-data';
import {sampleFlowData, config as flowDataConfig} from './data/sample-flow-data';
import {processCsvData, processGeojson, processRowObject} from '@kepler.gl/processors';

/* eslint-enable no-unused-vars */

// This implements the default behavior from styled-components v5
function shouldForwardProp(propName: string, target: unknown) {
  if (typeof target === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
}

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

// The SQLRooms sidebar is outside the map viewport, so Kepler must not reserve
// a second sidebar margin when positioning legends, timelines, and geocoders.
const shellMapTheme = {
  ...theme,
  sidePanel: {...theme.sidePanel, margin: {top: 0, right: 0, bottom: 0, left: 0}}
};

const App = () => {
  const [showBanner, toggleShowBanner] = useState(false);
  const {id, provider} = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = Object.fromEntries(searchParams.entries());
  const dispatch = useDispatch();
  const reduxStore = useStore();
  const mapReady = useSelector((state: any) => Boolean(state?.demo?.keplerGl?.map));
  const modalOpen = useSelector((state: any) =>
    Boolean(state?.demo?.keplerGl?.map?.uiState.currentModal)
  );
  const activeSidePanel = useSelector(
    (state: any) => state?.demo?.keplerGl?.map?.uiState.activeSidePanel
  );
  const readOnly = useSelector((state: any) => state?.demo?.keplerGl?.map?.uiState.readOnly);
  const mapTitle = useSelector((state: any) => state?.demo?.keplerGl?.map?.visState.mapInfo?.title);
  const lastSidePanel = useRef('layer');
  useEffect(() => {
    if (activeSidePanel) lastSidePanel.current = activeSidePanel;
  }, [activeSidePanel]);
  const onSidebarOpenChange = useCallback(
    (open: boolean) => {
      dispatch(toggleSidePanel(open ? lastSidePanel.current : ''));
    },
    [dispatch]
  );

  // TODO find another way to check for existence of duckDb plugin
  const duckDbPluginEnabled = (getApplicationConfig().plugins || []).some(p => p.name === 'duckdb');

  const isSqlPanelOpen = useSelector(
    state => duckDbPluginEnabled && state?.demo?.keplerGl?.map?.uiState.mapControls.sqlPanel?.active
  );

  const isAiAssistantPanelOpen = useSelector(
    state => state?.demo?.keplerGl?.map?.uiState.mapControls.aiAssistant?.active
  );
  const onPanelOpenChange = useCallback(
    (panelId: string, open: boolean) => {
      if (panelId === 'sql' && duckDbPluginEnabled && open !== Boolean(isSqlPanelOpen)) {
        dispatch(toggleMapControl('sqlPanel'));
      } else if (panelId === 'assistant' && open !== Boolean(isAiAssistantPanelOpen)) {
        dispatch(toggleMapControl('aiAssistant'));
      }
    },
    [dispatch, duckDbPluginEnabled, isSqlPanelOpen, isAiAssistantPanelOpen]
  );

  const prevQueryRef = useRef<{
    provider?: string;
    id?: string;
    query: Record<string, string>;
  } | null>(null);

  const [mapContainerNode, setMapContainerNode] = useState<HTMLDivElement | null>(null);
  const [mapDimensions, setMapDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!mapContainerNode) return;
    const observer = new ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect;
      setMapDimensions({width, height});
    });
    observer.observe(mapContainerNode);
    return () => observer.disconnect();
  }, [mapContainerNode]);

  // Handle OAuth callback on /auth route
  useEffect(() => {
    if (location.pathname === '/auth' && window.opener) {
      const {getCloudProvider, DEFAULT_CLOUD_PROVIDER} = require('./cloud-providers');
      const authProvider = getCloudProvider(DEFAULT_CLOUD_PROVIDER);
      const token = authProvider.getAccessTokenFromLocation(location);
      window.opener.postMessage({token}, window.location.origin);
    }
  }, [location]);

  useEffect(() => {
    // SQLRooms lazy-loads layout nodes. Wait for Kepler to register the map
    // before dispatching route-driven loads, including cached sample responses.
    if (!mapReady) return;
    if (isEqual(prevQueryRef.current, {provider, id, query})) return;
    prevQueryRef.current = {provider, id, query};

    // if we pass an id as part of the url
    // we try to fetch along map configurations
    const cloudProvider = CLOUD_PROVIDERS.find(c => c.name === provider);
    if (cloudProvider) {
      dispatch(
        loadCloudMap({
          loadParams: query,
          provider: cloudProvider,
          onSuccess: onLoadCloudMapSuccess
        })
      );
      prevQueryRef.current = {provider, id, query};
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

    if (duckDbPluginEnabled && query.sql) {
      dispatch(toggleMapControl('sqlPanel', 0));
      dispatch(toggleModal(null));
    }

    // delay zs to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //   window.setTimeout(_showBanner, 3000);
    // }
    // load sample data
    _loadSampleData();

    // Notifications

    // Route identity is compared above; sample helper closures use the same dispatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, provider, id, searchParams]);

  /**
   * Update map boundary when view state changes, used by ai-assistant to
   * get data from vector tiles when map boundary changes
   */
  const onViewStateChange = useCallback(
    viewState => {
      const viewport = new WebMercatorViewport(viewState);
      const nw = viewport.unproject([0, 0]);
      const se = viewport.unproject([viewport.width, viewport.height]);
      dispatch(setMapBoundary(nw, se));
    },
    [dispatch]
  );

  /*
  const _showBanner = useCallback(() => {
    toggleShowBanner(true);
  }, [toggleShowBanner]);
  */

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

  const _loadVectorTileData = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Railroads',
              id: 'railroads.pmtiles',
              color: [255, 0, 0],
              type: 'vector-tile'
            },
            data: {
              rows: [],
              fields: [
                {
                  name: 'continent',
                  type: 'string',
                  format: '',
                  analyzerType: 'STRING'
                }
              ]
            },
            metadata: {
              name: 'output.pmtiles',
              description: 'output.pmtiles',
              type: 'remote',
              remoteTileFormat: 'pmtiles',
              tilesetDataUrl:
                'https://4sq-studio-public.s3.us-west-2.amazonaws.com/pmtiles-test/161727fe-7952-4e57-aa05-850b3086b0b2.pmtiles',
              tilesetMetadataUrl:
                'https://4sq-studio-public.s3.us-west-2.amazonaws.com/pmtiles-test/161727fe-7952-4e57-aa05-850b3086b0b2.pmtiles',
              id: 'sz6uy1xtj',
              format: 'rows',
              label: 'output.pmtiles',
              metaJson: null,
              bounds: [-150.1122219, -51.8952777, 179.3577783, 69.6043747],
              center: [14.0625, 50.7026397, 6],
              maxZoom: 6,
              minZoom: 0,
              fields: [
                {
                  name: 'continent',
                  id: 'continent',
                  format: '',
                  filterProps: {
                    domain: [
                      'Africa',
                      'Asia',
                      'Europe',
                      'North America',
                      'Oceania',
                      'South America'
                    ],
                    value: [],
                    type: 'multiSelect',
                    gpu: false
                  },
                  type: 'string',
                  analyzerType: 'STRING'
                }
              ]
            }
          }
        ],
        options: {
          autoCreateLayers: true
        }
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
    // Demonstrates all 3 icon sources:
    // 1. CDN icons (e.g. 'accel') - fetched automatically
    // 2. Inline custom icons (e.g. 'custom-star'') - via initApplicationConfig({ customIcons })
    // 3. Remote custom icons (e.g. 'remote-triangle', 'remote-cross', 'remote-hexagon') - via customIconUrl
    const csvData = [
      'time,lat,lng,icon,annotation-severity,annotation-html',
      '2016-06-28 20:10:00,37.780,-122.410,accel,5,"Default CDN icon"',
      '2016-06-28 20:10:10,37.782,-122.415,custom-star,5,"Inline custom star"',
      '2016-06-28 20:10:30,37.778,-122.405,remote-triangle,3,"Remote triangle icon"',
      '2016-06-28 20:10:40,37.784,-122.420,remote-cross,2,"Remote cross icon"',
      '2016-06-28 20:10:50,37.772,-122.412,remote-hexagon,4,"Remote hexagon icon"'
    ].join('\n');

    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: processCsvData(csvData)
          }
        ],
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: 'icon',
                  config: {
                    dataId: 'test_icon_data',
                    label: 'Custom Icons',
                    columns: {
                      lat: 'lat',
                      lng: 'lng',
                      icon: 'icon'
                    },
                    isVisible: true,
                    visConfig: {
                      radius: 100
                    }
                  }
                }
              ]
            }
          }
        }
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
    const geojsonZip = null; // processGeojson(sampleGeojson);
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

  const _loadSyncedFilterWTripLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation', id: animateTripDataId},
            data: processGeojson(sampleAnimateTrip)
          },
          {
            info: {
              label: 'Sample Taxi Trips',
              id: pointDataId,
              color: [255, 0, 0]
            },
            data: pointData
          }
        ],
        config: syncedTripConfig,
        options: {
          centerMap: true
        }
      })
    );
  }, [dispatch]);

  const _replaceSyncedFilterWTripLayer = useCallback(() => {
    window.setTimeout(() => {
      dispatch(
        replaceDataInMap({
          datasetToReplaceId: pointDataId,
          datasetToUse: {
            info: {label: 'Sample Taxi Trips Replaced', id: `${pointDataId}-2`},
            data: replacePointData
          }
        })
      );
    }, 1000);
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
        } as any)
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

  const _loadA5Data = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'A5 Data',
              id: a5DataId
            },
            data: processCsvData(sampleA5Data)
          }
        ],
        config: a5MapConfig as ParsedConfig,
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

  const _loadFlowData = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'NYC Flow Data',
              id: 'flow_data'
            },
            data: processCsvData(sampleFlowData)
          }
        ],
        config: flowDataConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }, [dispatch]);

  const _loadWmsLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'OpenStreetMap WMS',
              id: 'osm-wms',
              type: 'wms-tile'
            },
            data: {
              fields: [],
              rows: []
            },
            metadata: {
              type: 'remote',
              remoteTileFormat: 'wms',
              tilesetDataUrl: 'https://ows.terrestris.de/osm/service',
              tilesetMetadataUrl:
                'https://ows.terrestris.de/osm/service?service=WMS&request=GetCapabilities',
              version: '1.1.1',
              layers: [
                {
                  name: 'OSM-WMS',
                  title: 'OpenStreetMap WMS',
                  boundingBox: [-180, -88, 180, 88]
                }
              ],
              label: 'OpenStreetMap WMS'
            },
            disableDataOperation: true
          }
        ],
        options: {
          autoCreateLayers: true,
          centerMap: true
        }
      })
    );
  }, [dispatch]);

  const _loadRasterTileLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Swiss Historical Map',
              id: 'swiss-historical-raster',
              type: 'raster-tile'
            },
            data: {
              fields: [],
              rows: []
            },
            metadata: {
              metadataUrl:
                'https://public-bucket-for-tests.s3.us-east-1.amazonaws.com/historic-swis-18xx.pmtiles',
              pmtilesType: 'raster'
            },
            disableDataOperation: true
          }
        ],
        options: {
          autoCreateLayers: true,
          centerMap: true
        }
      })
    );
  }, [dispatch]);

  const _loadBitmapLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'SF Bitmap Overlay',
              id: 'sf-bitmap',
              type: 'bitmap'
            },
            data: {
              fields: [],
              rows: []
            },
            metadata: {
              imageUrl:
                'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
              bounds: [-122.5179, 37.70391916246189, -122.35462834588868, 37.830428246756696]
            },
            disableDataOperation: true
          }
        ],
        options: {
          autoCreateLayers: true,
          centerMap: true
        }
      })
    );
  }, [dispatch]);

  const _loadTile3DLayer = useCallback(() => {
    dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Royal Exhibition Building',
              id: 'royal-exhibition-3d',
              type: 'tile-3d'
            },
            data: {
              fields: [],
              rows: []
            },
            metadata: {
              tile3dUrl:
                'https://raw.githubusercontent.com/visgl/deck.gl-data/master/3d-tiles/RoyalExhibitionBuilding/tileset.json'
            },
            disableDataOperation: true
          }
        ],
        config: {
          version: 'v1',
          config: {
            visState: {
              effects: [
                {
                  type: 'surfaceFog',
                  isEnabled: true,
                  parameters: {
                    density: 1,
                    height: 40,
                    thickness: 50,
                    fogColor: [70, 130, 180]
                  }
                }
              ]
            },
            mapState: {
              pitch: 0,
              dragRotate: false
            }
          }
        },
        options: {
          autoCreateLayers: true,
          centerMap: true
        }
      })
    );
  }, [dispatch]);

  const _loadSampleData = useCallback(() => {
    // _loadPointData();
    // _loadGeojsonData();
    // _loadTripGeoJson();
    // _loadIconData();
    // _loadH3HexagonData();
    // _loadS2Data();
    // _loadA5Data();
    // _loadScenegraphLayer();
    // _loadGpsData();
    // _loadRowData();
    // _loadVectorTileData();
    // _loadFlowData();
    // _loadWmsLayer();
    // _loadRasterTileLayer();
    // _loadBitmapLayer();
    // _loadTile3DLayer();
    // _loadSyncedFilterWTripLayer();
    // _replaceSyncedFilterWTripLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _loadPointData,
    _loadGeojsonData,
    _loadTripGeoJson,
    _loadIconData,
    _loadH3HexagonData,
    _loadS2Data,
    _loadA5Data,
    _loadScenegraphLayer,
    _loadGpsData,
    _loadRowData,
    _replaceData,
    _loadVectorTileData,
    _loadFlowData,
    _loadWmsLayer,
    _loadRasterTileLayer,
    _loadBitmapLayer,
    _loadTile3DLayer,
    _loadSyncedFilterWTripLayer,
    _replaceSyncedFilterWTripLayer
  ]);

  return (
    <SqlroomsThemeProvider defaultTheme="dark" storageKey="kepler-ui-theme">
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ThemeProvider theme={theme}>
          <GlobalStyle
          // this is to apply the same modal style as kepler.gl core
          // because styled-components doesn't always return a node
          // https://github.com/styled-components/styled-components/issues/617
          // ref={node => {
          //   node ? (this.root = node) : null;
          // }}
          >
            <Banner show={showBanner} height={BannerHeight} bgColor="#2E7CF6" onClose={hideBanner}>
              <Announcement onDisable={_disableBanner} />
            </Banner>
            <div style={CONTAINER_STYLE}>
              <KeplerAppShell
                sidebarOpen={Boolean(activeSidePanel)}
                onSidebarOpenChange={onSidebarOpenChange}
                readOnly={readOnly}
                modalOpen={modalOpen}
                title={mapTitle || 'Untitled Map'}
              >
                <SqlroomsDemoLayout
                  sqlEnabled={duckDbPluginEnabled}
                  sqlOpen={Boolean(isSqlPanelOpen)}
                  assistantOpen={Boolean(isAiAssistantPanelOpen)}
                  onPanelOpenChange={onPanelOpenChange}
                  map={
                    <div
                      ref={setMapContainerNode}
                      style={{width: '100%', height: '100%', overflow: 'clip'}}
                    >
                      <KeplerGl
                        mapboxApiAccessToken={CLOUD_PROVIDERS_CONFIGURATION.MAPBOX_TOKEN}
                        id="map"
                        getState={keplerGlGetState}
                        width={mapDimensions.width}
                        height={mapDimensions.height}
                        sidePanelWidth={0}
                        theme={shellMapTheme}
                        cloudProviders={CLOUD_PROVIDERS}
                        localeMessages={messages}
                        onExportToCloudSuccess={onExportFileSuccess}
                        onLoadCloudMapSuccess={onLoadCloudMapSuccess}
                        featureFlags={DEFAULT_FEATURE_FLAGS}
                        onViewStateChange={onViewStateChange}
                      />
                    </div>
                  }
                  sql={<SqlPanel initialSql={query.sql || ''} />}
                  assistant={
                    <AiAssistantPanel
                      reduxStore={reduxStore}
                      stateAccessors={{
                        getVisState: () =>
                          (reduxStore?.getState() as any)?.demo?.keplerGl?.map?.visState,
                        getMapBoundary: () =>
                          (reduxStore?.getState() as any)?.demo?.aiAssistant?.keplerGl?.mapBoundary
                      }}
                    />
                  }
                />
              </KeplerAppShell>
            </div>
          </GlobalStyle>
        </ThemeProvider>
      </StyleSheetManager>
    </SqlroomsThemeProvider>
  );
};

export default App;
