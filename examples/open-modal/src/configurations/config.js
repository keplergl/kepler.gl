// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: '1s8r5md',
          type: 'point',
          config: {
            dataId: 'tree_data',
            label: 'location',
            color: [18, 147, 154],
            columns: {
              lat: 'Location_latitude',
              lng: 'Location_longitude',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.8,
              outline: false,
              thickness: 2,
              colorRange: {
                name: 'Ice And Fire',
                type: 'diverging',
                category: 'Uber',
                colors: ['#D50255', '#FEAD54', '#FEEDB1', '#E8FEB5', '#49E3CE', '#0198BD'],
                reversed: true
              },
              radiusRange: [33.6, 96.2],
              'hi-precision': false
            }
          },
          visualChannels: {
            colorField: {
              name: 'Species',
              type: 'string'
            },
            colorScale: 'ordinal',
            sizeField: {
              name: 'Age',
              type: 'integer'
            },
            sizeScale: 'sqrt'
          }
        },
        {
          id: '7otjdz',
          type: 'hexagon',
          config: {
            dataId: 'tree_data',
            label: 'Density',
            color: [23, 184, 190],
            columns: {
              lat: 'Location_latitude',
              lng: 'Location_longitude'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.2,
              worldUnitSize: 0.8,
              resolution: 8,
              colorRange: {
                name: 'ColorBrewer GnBu-6',
                type: 'sequential',
                category: 'ColorBrewer',
                colors: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac'],
                reversed: false
              },
              coverage: 1,
              sizeRange: [0, 500],
              percentile: [0, 100],
              elevationPercentile: [0, 100],
              elevationScale: 5,
              'hi-precision': false,
              colorAggregation: 'average',
              sizeAggregation: 'average',
              enable3d: false
            }
          },
          visualChannels: {
            colorField: null,
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            tree_data: ['TreeID', 'Species', 'Address', 'Has_Species', 'SiteInfo']
          },
          enabled: true
        },
        brush: {
          size: 0.5,
          enabled: false
        },
        geocoder: {
          enabled: false
        }
      },
      layerBlending: 'normal',
      splitMaps: []
    },
    mapState: {
      bearing: 0,
      dragRotate: false,
      latitude: 37.76544453921235,
      longitude: -122.46289885132524,
      pitch: 0,
      zoom: 12.032736770460689,
      isSplit: false
    },
    mapStyle: {
      styleType: 'light',
      topLayerGroups: {
        label: true
      },
      visibleLayerGroups: {
        label: true,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true
      }
    }
  }
};
