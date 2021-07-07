
// All in the App (which extends component)   

    const cloudProvider = CLOUD_PROVIDERS.find(c => c.name === provider);
    if (cloudProvider) {
      this.props.dispatch(
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
      this.props.dispatch(loadSampleConfigurations(id));
    }

  _loadSampleData() {
    this._loadPointData();
    // this._loadGeojsonData();
    this._loadTripGeoJson();
    // this._loadIconData();
    // this._loadH3HexagonData();
    // this._loadS2Data();
    // this._loadScenegraphLayer();
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

  _loadScenegraphLayer() {
    this.props.dispatch(
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

  _loadS2Data() {
    // load s2
    this.props.dispatch(
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
        config: s2MapConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }

  _toggleCloudModal = () => {
    // TODO: this lives only in the demo hence we use the state for now
    // REFCOTOR using redux
    this.setState({
      cloudModalOpen: !this.state.cloudModalOpen
    });
  };

            

...
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
                  cloudProviders={CLOUD_PROVIDERS}
                  localeMessages={messages}
                  onExportToCloudSuccess={onExportFileSuccess}
                  onLoadCloudMapSuccess={onLoadCloudMapSuccess}
                />
              )}
            </AutoSizer>
