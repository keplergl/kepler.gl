// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
            hidden: false,
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
            hidden: false,
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
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              }
            },
            textLabel: [
              {
                field: {
                  name: 'pickup_latitude',
                  type: 'real'
                },
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
            hidden: false,
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
            hidden: false,
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
