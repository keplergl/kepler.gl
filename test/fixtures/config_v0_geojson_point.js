// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const savedConfigV0 = {
  version: 'v0',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'z2',
          dataId: '9sayb4m9r',
          label: 'addresses_no_r',
          color: [174, 14, 127],
          columns: {
            geojson: {
              value: '_geojson',
              fieldIdx: 0
            }
          },
          isVisible: true,
          isAggregated: false,
          type: 'geojson',
          colorField: {
            name: 'addresses',
            type: 'string'
          },
          colorScale: 'ordinal',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            colorRange: {
              name: 'ColorBrewer Dark2-6',
              type: 'qualitative',
              category: 'ColorBrewer',
              colors: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
              reversed: false
            },
            opacity: 0.8,
            thickness: 2,
            radius: 15.8,
            sizeRange: [0, 10],
            radiusRange: [0, 50],
            elevationRange: [0, 500],
            elevationScale: 5,
            stroked: false,
            filled: true,
            extruded: false,
            wireframe: false,
            'hi-precision': false
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            '9sayb4m9r': ['fillColor', 'hi-precision', 'addresses', 'id']
          }
        }
      },
      layerBlending: 'normal'
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
      bearing: 0,
      dragRotate: false,
      latitude: 39.98437808125723,
      longitude: -105.15546105385808,
      pitch: 0,
      zoom: 16.060632707350504
    }
  }
};

export const parsedConfigV0 = {
  visState: {
    filters: [],
    layers: [
      {
        id: 'z2',
        type: 'geojson',
        config: {
          dataId: '9sayb4m9r',
          label: 'addresses_no_r',
          color: [174, 14, 127],
          columns: {
            geojson: '_geojson'
          },
          isVisible: true,
          colorField: {
            name: 'addresses',
            type: 'string'
          },
          colorScale: 'ordinal',
          sizeField: null,
          visConfig: {
            colorRange: {
              name: 'ColorBrewer Dark2-6',
              type: 'qualitative',
              category: 'ColorBrewer',
              colors: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
              reversed: false
            },
            strokeColorRange: {
              name: 'ColorBrewer Dark2-6',
              type: 'qualitative',
              category: 'ColorBrewer',
              colors: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
              reversed: false
            },
            strokeColor: [174, 14, 127],
            opacity: 0.8,
            thickness: 2,
            radius: 15.8,
            sizeRange: [0, 10],
            radiusRange: [0, 50],
            heightRange: [0, 500],
            elevationScale: 5,
            stroked: false,
            filled: true,
            enable3d: false,
            wireframe: false,
            'hi-precision': false
          }
        }
      }
    ],
    interactionConfig: {
      tooltip: {
        enabled: true,
        fieldsToShow: {
          '9sayb4m9r': [
            {
              name: 'fillColor',
              format: null
            },
            {
              name: 'hi-precision',
              format: null
            },
            {
              name: 'addresses',
              format: null
            },
            {
              name: 'id',
              format: null
            }
          ]
        }
      },
      brush: {
        enabled: false
      }
    },
    layerBlending: 'normal'
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
    bearing: 0,
    dragRotate: false,
    latitude: 39.98437808125723,
    longitude: -105.15546105385808,
    pitch: 0,
    zoom: 16.060632707350504
  }
};
