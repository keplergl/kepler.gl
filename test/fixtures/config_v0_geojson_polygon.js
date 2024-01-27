// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const savedConfigV0 = {
  version: 'v0',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'mml',
          dataId: 'pjcln7ts',
          label: 'geojson_as_string',
          color: [221, 178, 124, 255],
          columns: {
            geojson: {
              value: 'simplified_shape',
              fieldIdx: 4
            }
          },
          isVisible: true,
          isAggregated: false,
          type: 'geojson',
          colorField: {
            name: 'c_riders',
            type: 'integer'
          },
          colorScale: 'quantile',
          sizeField: {
            name: 'd_population',
            type: 'integer'
          },
          sizeScale: 'linear',
          visConfig: {
            colorRange: {
              name: 'Pink Wine',
              type: 'sequential',
              category: 'Uber',
              colors: [
                '#2C1E3D',
                '#50315E',
                '#764476',
                '#9A5B88',
                '#B77495',
                '#CF91A3',
                '#E0B1B3',
                '#EDD1CA'
              ],
              reversed: false
            },
            opacity: 0.8,
            thickness: 13,
            radius: 10,
            sizeRange: [0, 10],
            radiusRange: [0, 50],
            elevationRange: [0, 500],
            elevationScale: 34,
            stroked: false,
            filled: true,
            extruded: true,
            wireframe: false,
            'hi-precision': false
          }
        },
        {
          id: '2oc',
          dataId: 'pjcln7ts',
          label: 'new layer',
          color: [136, 87, 44, 255],
          columns: {
            geojson: {
              value: 'simplified_shape_v2',
              fieldIdx: 3
            }
          },
          isVisible: true,
          isAggregated: false,
          type: 'geojson',
          colorField: null,
          colorScale: 'quantile',
          sizeField: {
            name: 'c_avg_trips_per_rider',
            type: 'real'
          },
          sizeScale: 'linear',
          visConfig: {
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            opacity: 0.8,
            thickness: 8,
            radius: 10,
            sizeRange: [0, 36.6],
            radiusRange: [0, 50],
            elevationRange: [0, 500],
            elevationScale: 5,
            stroked: true,
            filled: false,
            extruded: false,
            wireframe: false,
            'hi-precision': false
          }
        }
      ],
      interactionConfig: {},
      layerBlending: 'additive'
    },
    mapStyle: {
      styleType: 'dark',
      topLayerGroups: {},
      visibleLayerGroups: {
        label: true,
        places: true,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true
      },
      buildingLayer: {
        isVisible: false,
        color: [32, 32, 37],
        opacity: 0.7
      }
    },
    mapState: {
      bearing: -23.571428571428555,
      dragRotate: true,
      latitude: 40.19134928087266,
      longitude: -74.70082543743959,
      pitch: 13.654118895255545,
      zoom: 8.304174758743489
    }
  }
};

export const parsedConfigV0 = {
  visState: {
    filters: [],
    layers: [
      {
        id: 'mml',
        type: 'geojson',
        config: {
          dataId: 'pjcln7ts',
          label: 'geojson_as_string',
          color: [221, 178, 124, 255],
          columns: {
            geojson: 'simplified_shape'
          },
          isVisible: true,
          colorField: {
            name: 'c_riders',
            type: 'integer'
          },
          colorScale: 'quantile',
          heightField: {
            name: 'd_population',
            type: 'integer'
          },
          visConfig: {
            colorRange: {
              name: 'Pink Wine',
              type: 'sequential',
              category: 'Uber',
              colors: [
                '#2C1E3D',
                '#50315E',
                '#764476',
                '#9A5B88',
                '#B77495',
                '#CF91A3',
                '#E0B1B3',
                '#EDD1CA'
              ],
              reversed: false
            },
            strokeColor: [221, 178, 124, 255],
            strokeColorRange: {
              name: 'Pink Wine',
              type: 'sequential',
              category: 'Uber',
              colors: [
                '#2C1E3D',
                '#50315E',
                '#764476',
                '#9A5B88',
                '#B77495',
                '#CF91A3',
                '#E0B1B3',
                '#EDD1CA'
              ],
              reversed: false
            },
            opacity: 0.8,
            thickness: 13,
            radius: 10,
            sizeRange: [0, 10],
            radiusRange: [0, 50],
            heightRange: [0, 500],
            elevationScale: 34,
            stroked: false,
            filled: true,
            enable3d: true,
            wireframe: false,
            'hi-precision': false
          }
        }
      },
      {
        id: '2oc',
        type: 'geojson',
        config: {
          dataId: 'pjcln7ts',
          label: 'new layer',
          color: [136, 87, 44, 255],
          columns: {
            geojson: 'simplified_shape_v2'
          },
          isVisible: true,
          colorField: null,
          colorScale: 'quantile',
          strokeColorField: null,
          strokeColorScale: 'quantile',
          sizeField: {
            name: 'c_avg_trips_per_rider',
            type: 'real'
          },
          visConfig: {
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            strokeColor: [136, 87, 44, 255],
            strokeColorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            opacity: 0.8,
            thickness: 8,
            radius: 10,
            sizeRange: [0, 36.6],
            radiusRange: [0, 50],
            heightRange: [0, 500],
            elevationScale: 5,
            stroked: true,
            filled: false,
            enable3d: false,
            wireframe: false,
            'hi-precision': false
          }
        }
      }
    ],
    interactionConfig: {
      tooltip: {
        enabled: false
      },
      brush: {
        enabled: false
      }
    },
    layerBlending: 'additive'
  },
  mapStyle: {
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      places: true,
      road: true,
      border: false,
      building: true,
      water: true,
      land: true
    },
    buildingLayer: {
      isVisible: false,
      color: [32, 32, 37],
      opacity: 0.7
    }
  },
  mapState: {
    bearing: -23.571428571428555,
    dragRotate: true,
    latitude: 40.19134928087266,
    longitude: -74.70082543743959,
    pitch: 13.654118895255545,
    zoom: 8.304174758743489
  }
};
