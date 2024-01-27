// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const polygonFilterMap = {
  datasets: [
    {
      version: 'v1',
      data: {
        id: '9bluyz5s2',
        label: 'kepler-gl_new dataset (3).csv',
        color: [143, 47, 191],
        allData: [
          [
            '1967/08/01 10:33:50.47',
            36.08,
            -121.07083,
            80.339,
            2.5,
            'Mx',
            10,
            292,
            42,
            0.25,
            'NCSN',
            1000872
          ],
          [
            '1967/08/02 02:49:12.55',
            35.63433,
            -120.75716,
            3.98,
            2.6,
            'Mx',
            9,
            322,
            108,
            0.24,
            'NCSN',
            1000887
          ],
          [
            '1967/08/03 05:55:26.73',
            36.37967,
            -121.0085,
            39.609,
            2.7,
            'Mx',
            10,
            298,
            21,
            0.41,
            'NCSN',
            1000912
          ],
          [
            '1967/08/03 06:57:01.25',
            36.3955,
            -121.01667,
            40.159,
            2.7,
            'Mx',
            10,
            293,
            19,
            0.46,
            'NCSN',
            1000916
          ],
          [
            '1967/08/03 20:21:26.52',
            36.5435,
            -121.17216,
            5.945,
            2.6,
            'Mx',
            10,
            132,
            6,
            0.07,
            'NCSN',
            1000926
          ],
          [
            '1967/08/09 04:53:59.73',
            35.4015,
            -120.58783,
            4.06,
            2.6,
            'Mx',
            7,
            331,
            131,
            0.26,
            'NCSN',
            1000979
          ],
          [
            '1967/08/09 07:27:32.82',
            36.15567,
            -121.09367,
            68.79,
            2.7,
            'Mx',
            10,
            284,
            33,
            0.39,
            'NCSN',
            1000981
          ],
          [
            '1967/08/13 20:29:14.27',
            35.4195,
            -121.109,
            4.05,
            2.7,
            'Mx',
            9,
            325,
            124,
            0.28,
            'NCSN',
            1001030
          ],
          [
            '1967/08/15 16:53:24.26',
            35.48417,
            -121.01167,
            4.585,
            2.9,
            'Mx',
            8,
            322,
            107,
            0.77,
            'NCSN',
            1001047
          ],
          [
            '1967/08/22 08:04:34.06',
            37.65333,
            -122.4295,
            39.675,
            2.5,
            'Mx',
            25,
            329,
            30,
            0.24,
            'NCSN',
            1001119
          ]
        ],
        fields: [
          {
            name: 'DateTime',
            type: 'timestamp',
            format: 'YYYY/M/D HH:mm:ss.SSSS',
            analyzerType: 'DATETIME'
          },
          {
            name: 'Latitude',
            type: 'real',
            format: '',
            analyzerType: 'FLOAT'
          },
          {
            name: 'Longitude',
            type: 'real',
            format: '',
            analyzerType: 'FLOAT'
          },
          {
            name: 'Depth',
            type: 'real',
            format: '',
            analyzerType: 'FLOAT'
          },
          {
            name: 'Magnitude',
            type: 'real',
            format: '',
            analyzerType: 'FLOAT'
          },
          {
            name: 'MagType',
            type: 'string',
            format: '',
            analyzerType: 'STRING'
          },
          {
            name: 'NbStations',
            type: 'integer',
            format: '',
            analyzerType: 'INT'
          },
          {
            name: 'Gap',
            type: 'integer',
            format: '',
            analyzerType: 'INT'
          },
          {
            name: 'Distance',
            type: 'integer',
            format: '',
            analyzerType: 'INT'
          },
          {
            name: 'RMS',
            type: 'real',
            format: '',
            analyzerType: 'FLOAT'
          },
          {
            name: 'Source',
            type: 'string',
            format: '',
            analyzerType: 'STRING'
          },
          {
            name: 'EventID',
            type: 'integer',
            format: '',
            analyzerType: 'INT'
          }
        ]
      }
    }
  ],
  config: {
    version: 'v1',
    config: {
      visState: {
        filters: [
          {
            dataId: ['9bluyz5s2'],
            id: '1545pmr0s',
            name: ['Point'],
            type: 'polygon',
            value: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [-121.20301917819414, 36.19054006644038],
                    [-121.20301917819414, 36.05580399351024],
                    [-120.91706956830599, 36.05580399351024],
                    [-120.91706956830599, 36.19054006644038],
                    [-121.20301917819414, 36.19054006644038]
                  ]
                ]
              },
              properties: {
                renderType: 'Rectangle',
                isClosed: true,
                bbox: {
                  xmin: -121.20518546311551,
                  xmax: null,
                  ymin: 36.19054006644038,
                  ymax: null
                }
              },
              id: '3f29ec21-4c67-4741-9504-1d6f0eb831c4'
            },
            enlarged: false,
            plotType: 'histogram',
            yAxis: null,
            fixedDomain: true,
            layerId: ['i1w1f0m']
          }
        ],
        layers: [
          {
            id: 'i1w1f0m',
            type: 'point',
            config: {
              dataId: '9bluyz5s2',
              label: 'Point',
              color: [183, 136, 94],
              columns: {
                lat: 'Latitude',
                lng: 'Longitude',
                altitude: null
              },
              isVisible: true,
              visConfig: {
                radius: 10,
                fixedRadius: false,
                opacity: 0.8,
                outline: false,
                thickness: 2,
                strokeColor: null,
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
                radiusRange: [0, 50],
                filled: true
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
              strokeColorField: null,
              strokeColorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear'
            }
          }
        ],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {
              '9bluyz5s2': ['DateTime', 'Latitude', 'Longitude', 'Depth', 'Magnitude']
            },
            enabled: true
          },
          brush: {
            size: 0.5,
            enabled: false
          }
        },
        layerBlending: 'normal',
        splitMaps: [],
        animationConfig: {
          currentTime: null,
          speed: 1
        }
      },
      mapState: {
        bearing: 0,
        dragRotate: false,
        latitude: 35.89276276972923,
        longitude: -121.07954093755023,
        pitch: 0,
        zoom: 8.342414373255385,
        isSplit: false
      },
      mapStyle: {
        styleType: 'dark',
        topLayerGroups: {},
        visibleLayerGroups: {
          label: true,
          road: true,
          border: false,
          building: true,
          water: true,
          land: true,
          '3d building': false
        },
        threeDBuildingColor: [9.665468314072013, 17.18305478057247, 31.1442867897876],
        mapStyles: {}
      }
    }
  },
  info: {
    app: 'kepler.gl',
    created_at: 'Thu Dec 26 2019 16:00:54 GMT+0100 (Central European Standard Time)'
  }
};
