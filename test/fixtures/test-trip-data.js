// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const fields = [
  {
    name: 'tpep_pickup_datetime',
    format: 'YYYY-M-D H:m:s',
    type: 'timestamp'
  },
  {
    name: 'tpep_dropoff_datetime',
    format: 'YYYY-M-D H:m:s',
    type: 'timestamp'
  },
  {
    name: 'passenger_count',
    format: '',
    type: 'integer'
  },
  {name: 'trip_distance', format: '', type: 'real'},
  {name: 'pickup_longitude', format: '', type: 'real'},
  {name: 'pickup_latitude', format: '', type: 'real'},
  {name: 'dropoff_longitude', format: '', type: 'real'},
  {name: 'dropoff_latitude', format: '', type: 'real'},
  {name: 'fare_amount', format: '', type: 'real'},
  {name: 'is_completed', format: '', type: 'boolean'},
  {name: 'fare_type', format: '', type: 'string'}
];

export const rows = [
  [
    '2015-01-15 19:05:39',
    '2015-01-15 19:23:42',
    1,
    1.59,
    -73.99389648,
    40.75011063,
    -73.97478485,
    40.75061798,
    12,
    true,
    'orange peel'
  ],
  [
    '2015-01-15 19:05:39',
    '2015-01-15 19:32:00',
    0,
    2.38,
    -73.97642517,
    40.73981094,
    -73.98397827,
    40.75788879,
    16.5,
    false,
    'banana peel'
  ],
  [
    '2015-01-15 19:05:40',
    '2015-01-15 19:21:00',
    5,
    2.83,
    -73.96870422,
    40.75424576,
    -73.9551239,
    40.7868576,
    12.5,
    false,
    'apple tree'
  ],
  [
    '2015-01-15 19:05:40',
    '2015-01-15 19:28:18',
    5,
    8.33,
    -73.86306,
    40.76958084,
    -73.95271301,
    40.78578186,
    26,
    true,
    'orange peel'
  ],
  [
    '2015-01-15 19:05:41',
    '2015-01-15 19:20:36',
    1,
    2.37,
    -73.94554138,
    40.77942276,
    -73.98085022,
    40.78608322,
    11.5,
    true,
    'apple tree'
  ],
  [
    '2015-01-15 19:05:41',
    '2015-01-15 19:20:22',
    2,
    7.13,
    -73.87445831,
    40.7740097,
    -73.95237732,
    40.71858978,
    21.5,
    true,
    'orange peel'
  ]
];

export const dataId = 'test_trip_data';
export const config = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          type: 'heatmap',
          config: {
            dataId,
            columns: {
              lat: 'pickup_latitude',
              lng: 'pickup_longitude'
            },
            isVisible: true
          }
        },
        {
          type: 'point',
          config: {
            dataId,
            columns: {
              lat: 'pickup_latitude',
              lng: 'pickup_longitude'
            },
            isVisible: true,
            visConfig: {
              colorRange: {
                name: 'Ice And Fire 8',
                type: 'diverging',
                category: 'Uber',
                colors: [
                  '#7F1941',
                  '#D50255',
                  '#FEAD54',
                  '#FEEDB1',
                  '#E8FEB5',
                  '#49E3CE',
                  '#0198BD',
                  '#007A99'
                ],
                reversed: true
              },
              strokeColorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#5A1846',
                  '#900C3F',
                  '#C70039',
                  '#E3611C',
                  '#F1920E',
                  '#FFC300'
                ]
              }
            }
          },
          visualChannels: {
            colorField: {
              name: 'trip_distance',
              type: 'real'
            },
            sizeField: {
              name: 'passenger_count',
              type: 'integer'
            }
          }
        },
        {
          type: 'arc',
          config: {
            dataId,
            columns: {
              lat0: 'pickup_latitude',
              lng0: 'pickup_longitude',
              lat1: 'dropoff_latitude',
              lng1: 'dropoff_longitude'
            },
            isVisible: true
          }
        },
        {
          id: '38f7j6',
          type: 'hexagon',
          config: {
            dataId,
            label: 'new layer',
            columns: {
              lat: 'pickup_latitude',
              lng: 'pickup_longitude'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.76,
              worldUnitSize: 0.3,
              colorRange: {
                name: 'ColorBrewer PuOr-10',
                type: 'diverging',
                category: 'ColorBrewer',
                colors: [
                  '#7f3b08',
                  '#b35806',
                  '#e08214',
                  '#fdb863',
                  '#fee0b6',
                  '#d8daeb',
                  '#b2abd2',
                  '#8073ac',
                  '#542788',
                  '#2d004b'
                ]
              }
            }
          }
        }
      ],
      filters: [
        {
          id: 'me',
          dataId,
          name: 'tpep_pickup_datetime',
          type: 'timeRange',
          enlarged: true
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            [dataId]: ['tpep_pickup_datetime', 'tpep_dropoff_datetime']
          },
          enabled: true
        }
      }
    }
  }
};

const exported = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          id: 'rsgg2rj',
          type: 'point',
          config: {
            dataId: 'test_trip_data',
            label: 'new layer',
            color: [221, 178, 124],
            columns: {
              lat: 'pickup_latitude',
              lng: 'pickup_longitude',
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
                name: 'Ice And Fire 8',
                type: 'diverging',
                category: 'Uber',
                colors: [
                  '#7F1941',
                  '#D50255',
                  '#FEAD54',
                  '#FEEDB1',
                  '#E8FEB5',
                  '#49E3CE',
                  '#0198BD',
                  '#007A99'
                ],
                reversed: true
              },
              strokeColorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#5A1846',
                  '#900C3F',
                  '#C70039',
                  '#E3611C',
                  '#F1920E',
                  '#FFC300'
                ]
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
            colorField: {
              name: 'trip_distance',
              type: 'real'
            },
            colorScale: 'quantile',
            strokeColorField: null,
            strokeColorScale: 'quantile',
            sizeField: {
              name: 'passenger_count',
              type: 'integer'
            },
            sizeScale: 'sqrt'
          }
        },
        {
          id: 'a9i93lg',
          type: 'arc',
          config: {
            dataId: 'test_trip_data',
            label: 'new layer',
            color: [136, 87, 44],
            columns: {
              lat0: 'pickup_latitude',
              lng0: 'pickup_longitude',
              lat1: 'dropoff_latitude',
              lng1: 'dropoff_longitude'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 2,
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: [
                  '#5A1846',
                  '#900C3F',
                  '#C70039',
                  '#E3611C',
                  '#F1920E',
                  '#FFC300'
                ]
              },
              sizeRange: [0, 10],
              targetColor: null
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
            sizeScale: 'linear'
          }
        },
        {
          id: '38f7j6',
          type: 'hexagon',
          config: {
            dataId: 'test_trip_data',
            label: 'new layer',
            color: [183, 136, 94],
            columns: {
              lat: 'pickup_latitude',
              lng: 'pickup_longitude'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.76,
              worldUnitSize: 0.3,
              resolution: 8,
              colorRange: {
                name: 'ColorBrewer PuOr-10',
                type: 'diverging',
                category: 'ColorBrewer',
                colors: [
                  '#7f3b08',
                  '#b35806',
                  '#e08214',
                  '#fdb863',
                  '#fee0b6',
                  '#d8daeb',
                  '#b2abd2',
                  '#8073ac',
                  '#542788',
                  '#2d004b'
                ]
              },
              coverage: 1,
              sizeRange: [0, 500],
              percentile: [0, 100],
              elevationPercentile: [0, 100],
              elevationScale: 5,
              colorAggregation: 'count',
              sizeAggregation: 'count',
              enable3d: false
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
            sizeScale: 'linear'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            test_trip_data: [
              'tpep_pickup_datetime',
              'tpep_dropoff_datetime',
              'passenger_count',
              'trip_distance',
              'fare_amount'
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
    }
  }
};
