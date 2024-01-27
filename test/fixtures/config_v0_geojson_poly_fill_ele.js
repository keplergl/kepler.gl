// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const savedConfigV0 = {
  config: {
    mapState: {
      bearing: 24,
      dragRotate: true,
      latitude: 37.76155771615539,
      longitude: -122.47016491117604,
      pitch: 50,
      zoom: 11.821729469300175
    },
    mapStyle: {
      buildingLayer: {
        color: [32, 32, 37],
        isVisible: false,
        opacity: 0.7
      },
      styleType: 'dark',
      topLayerGroups: {},
      visibleLayerGroups: {
        border: false,
        building: true,
        label: true,
        land: true,
        places: true,
        road: true,
        water: true
      }
    },
    visState: {
      filters: [],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            c0pd4bocg: ['ZIP_CODE', 'ID']
          }
        }
      },
      layerBlending: 'normal',
      layers: [
        {
          color: [18, 147, 154, 255],
          colorField: {
            name: 'ZIP_CODE',
            type: 'integer'
          },
          colorScale: 'quantize',
          columns: {
            geojson: {
              fieldIdx: 0,
              value: '_geojson'
            }
          },
          dataId: 'c0pd4bocg',
          id: '7oe',
          isAggregated: false,
          isVisible: true,
          label: 'sf.zip.geo',
          sizeField: {
            name: 'ID',
            type: 'integer'
          },
          sizeScale: 'linear',
          type: 'geojson',
          visConfig: {
            colorRange: {
              category: 'ColorBrewer',
              colors: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
              name: 'ColorBrewer YlGn-6',
              reversed: false,
              type: 'sequential'
            },
            elevationRange: [0, 500],
            elevationScale: 5,
            extruded: true,
            filled: true,
            'hi-precision': false,
            opacity: 0.8,
            radius: 10,
            radiusRange: [0, 50],
            sizeRange: [0, 10],
            stroked: false,
            thickness: 2,
            wireframe: false
          }
        }
      ]
    }
  },
  version: 'v0'
};

export const parsedConfigV0 = {
  mapState: {
    bearing: 24,
    dragRotate: true,
    latitude: 37.76155771615539,
    longitude: -122.47016491117604,
    pitch: 50,
    zoom: 11.821729469300175
  },
  mapStyle: {
    buildingLayer: {
      color: [32, 32, 37],
      isVisible: false,
      opacity: 0.7
    },
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {
      border: false,
      building: true,
      label: true,
      land: true,
      places: true,
      road: true,
      water: true
    }
  },
  visState: {
    filters: [],
    interactionConfig: {
      tooltip: {
        enabled: true,
        fieldsToShow: {
          c0pd4bocg: [
            {
              name: 'ZIP_CODE',
              format: null
            },
            {
              name: 'ID',
              format: null
            }
          ]
        }
      },
      brush: {
        enabled: false
      }
    },
    layerBlending: 'normal',
    layers: [
      {
        id: '7oe',
        type: 'geojson',
        config: {
          color: [18, 147, 154, 255],
          colorField: {
            name: 'ZIP_CODE',
            type: 'integer'
          },
          colorScale: 'quantize',
          columns: {
            geojson: '_geojson'
          },
          dataId: 'c0pd4bocg',
          isVisible: true,
          label: 'sf.zip.geo',
          heightField: {
            name: 'ID',
            type: 'integer'
          },
          visConfig: {
            colorRange: {
              category: 'ColorBrewer',
              colors: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
              name: 'ColorBrewer YlGn-6',
              reversed: false,
              type: 'sequential'
            },
            strokeColorRange: {
              category: 'ColorBrewer',
              colors: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
              name: 'ColorBrewer YlGn-6',
              reversed: false,
              type: 'sequential'
            },
            strokeColor: [18, 147, 154, 255],
            heightRange: [0, 500],
            elevationScale: 5,
            enable3d: true,
            filled: true,
            'hi-precision': false,
            opacity: 0.8,
            radius: 10,
            radiusRange: [0, 50],
            sizeRange: [0, 10],
            stroked: false,
            thickness: 2,
            wireframe: false
          }
        }
      }
    ]
  }
};
