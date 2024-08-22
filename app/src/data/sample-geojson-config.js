// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [
        {
          dataId: ['bart-stops-geo-2'],
          id: '2ua7g6t8',
          name: ['exits'],
          type: 'range',
          value: [6121, 13547],
          plotType: {
            type: 'histogram'
          },
          animationWindow: 'free',
          yAxis: null,
          view: 'side',
          speed: 1,
          enabled: true
        },
        {
          dataId: ['sf-zip-geo'],
          id: 'kt1fkkbrb',
          name: ['ZIP_CODE'],
          type: 'range',
          value: [94103, 94133],
          plotType: {
            type: 'histogram'
          },
          animationWindow: 'free',
          yAxis: null,
          view: 'side',
          speed: 1,
          enabled: true
        }
      ],
      layers: [
        {
          id: 'ze2p6id',
          type: 'geojson',
          config: {
            dataId: 'bart-stops-geo',
            label: 'Bart Stops Geo',
            color: [151, 14, 45],
            columns: {
              geojson: '_geojson'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 0.5,
              strokeColor: [77, 193, 156],
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              },
              strokeColorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              },
              radius: 22.5,
              sizeRange: [0, 10],
              radiusRange: [0, 50],
              heightRange: [0, 500],
              elevationScale: 5,
              stroked: true,
              filled: true,
              enable3d: false,
              wireframe: false
            },
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            colorField: null,
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear',
            strokeColorField: null,
            strokeColorScale: 'quantile',
            heightField: null,
            heightScale: 'linear',
            radiusField: null,
            radiusScale: 'linear'
          }
        },
        {
          id: 'ho3fgt9',
          type: 'geojson',
          config: {
            dataId: 'sf-zip-geo',
            label: 'SF Zip Geo',
            color: [136, 87, 44],
            columns: {
              geojson: '_geojson'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 0.5,
              strokeColor: [255, 254, 213],
              colorRange: {
                name: 'UberPool 8',
                type: 'diverging',
                category: 'Uber',
                colors: [
                  '#213E9A',
                  '#3C1FA7',
                  '#811CB5',
                  '#C318B0',
                  '#D01367',
                  '#DE0F0E',
                  '#EC7007',
                  '#F9E200'
                ],
                reversed: false
              },
              strokeColorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              },
              radius: 10,
              sizeRange: [0, 10],
              radiusRange: [0, 50],
              heightRange: [0, 500],
              elevationScale: 5,
              stroked: true,
              filled: true,
              enable3d: false,
              wireframe: false
            },
            textLabel: [
              {
                field: null,
                color: [255, 255, 255],
                size: 18,
                offset: [0, 0],
                anchor: 'start',
                alignment: 'center'
              }
            ]
          },
          visualChannels: {
            colorField: {
              name: 'ID',
              type: 'integer'
            },
            colorScale: 'quantile',
            sizeField: null,
            sizeScale: 'linear',
            strokeColorField: null,
            strokeColorScale: 'quantile',
            heightField: null,
            heightScale: 'linear',
            radiusField: null,
            radiusScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            'bart-stops-geo': ['name'],
            'sf-zip-geo': ['OBJECTID', 'ZIP_CODE', 'ID', 'name', 'STREETNAME']
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
      layerBlending: 'normal'
    },

    mapStyle: {
      styleType: 'b9tnac',
      mapStyles: {
        b9tnac: {
          accessToken: null,
          custom: true,
          icon: 'https://api.mapbox.com/styles/v1/heshan0131/cjg0ks54x300a2squ8fr9vhvq/static/-122.3391,37.7922,9,0,0/400x300?access_token=pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pmc3hhd21uMzE3azJxczJhOWc4czBpYyJ9.HiDptGv2C0Bkcv_TGr_kJw&logo=false&attribution=false',
          id: 'b9tnac',
          label: 'label maker',
          url: 'mapbox://styles/heshan0131/cjg0ks54x300a2squ8fr9vhvq'
        }
      }
    }
  }
};

export default config;
