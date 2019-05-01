const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
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
              opacity: 1,
              worldUnitSize: 0.5,
              resolution: 8,
              colorRange: {
                name: 'ColorBrewer GnBu-6',
                type: 'sequential',
                category: 'ColorBrewer',
                colors: [
                  '#f0f9e8',
                  '#ccebc5',
                  '#a8ddb5',
                  '#7bccc4',
                  '#43a2ca',
                  '#0868ac'
                ],
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
              enable3d: true
            },
            textLabel: {
              field: null,
              color: [255, 255, 255],
              size: 50,
              offset: [0, 0],
              anchor: 'middle'
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
            tree_data: [
              'TreeID',
              'Species',
              'Address',
              'Has_Species',
              'SiteInfo'
            ]
          },
          enabled: true
        },
        brush: {
          size: 0.5,
          enabled: false
        }
      },
      layerBlending: 'normal',
      splitMaps: []
    },
    mapState: {
      bearing: -47.05590062111801,
      dragRotate: true,
      latitude: 37.76544453921235,
      longitude: -122.46289885132524,
      pitch: 50.92150170648464,
      zoom: 12.032736770460689,
      isSplit: false
    },
    mapStyle: {
      styleType: 'light',
      topLayerGroups: {
        label: true
      },
      visibleLayerGroups: {
        label: false,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true,
        '3d building': false
      },
      mapStyles: {}
    }
  }
};

export default config;
