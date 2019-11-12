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

/* eslint-disable max-lens */
const data = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,id,time,begintrip_ts_utc,begintrip_ts_local,date
2016-09-17 00:09:55,29.9900937,31.2590542,driver_analytics,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
2016-09-17 00:10:56,29.9927699,31.2461142,driver_analytics,1472688000000,False,2,2016-09-23T00:00:00.000Z,2016-10-01 09:46:37+00:00,2016-10-01 16:46:37+00:00,2016-09-23
2016-09-17 00:11:56,29.9907261,31.2312742,driver_analytics,1472688000000,False,3,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:12:58,29.9870074,31.2175827,driver_analytics,1472688000000,False,4,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:14:00,29.9923041,31.2154899,driver_analytics,1472688000000,False,5,2016-09-23T00:00:00.000Z,2016-10-01 09:47:37+00:00,2016-10-01 16:47:37+00:00,
2016-09-17 00:15:01,29.9968249,31.2149361,driver_analytics,1472688000000,False,12124,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:16:03,30.0037217,31.2164035,driver_analytics,1472688000000,False,222,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:17:05,30.0116207,31.2179346,driver_analytics,1472688000000,False,345,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:18:09,30.0208925,31.2179556,driver_analytics,1472708000000,False,,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:19:12,30.0218999,31.2178842,driver_analytics,1472708000000,False,,2016-09-23T06:00:00.000Z,,,2016-09-24
2016-09-17 00:19:27,30.0229344,31.2179138,driver_analytics,1472708000000,False,,2016-09-23T05:00:00.000Z,,,2016-09-24
2016-09-17 00:20:14,30.0264237,31.2179415,driver_analytics,1472708000000,False,,,,,2016-09-24
2016-09-17 00:21:17,30.0292134,31.2181809,driver_analytics,1472754400000,False,,,,,2016-09-24
2016-09-17 00:22:20,30.034391,31.2193991,driver_analytics,1472754400000,,,2016-09-23T06:00:00.000Z,,,
2016-09-17 00:23:22,30.0352752,31.2181803,driver_analytics,1472754400000,,,2016-09-23T06:00:00.000Z,2016-10-01 10:01:54+00:00,2016-10-01 17:01:54+00:00,
2016-09-17 00:24:24,30.0395918,31.2195902,driver_analytics,1472754400000,,1,2016-09-23T00:00:00.000Z,2016-10-01 09:53:04+00:00,2016-10-01 16:53:04+00:00,
2016-09-17 00:25:28,30.0497387,31.2174421,driver_analytics,1472774400000,,,2016-09-23T07:00:00.000Z,2016-10-01 09:55:23+00:00,2016-10-01 16:55:23+00:00,
2016-09-17 00:26:29,30.0538936,31.2165983,driver_analytics,1472774400000,,43,2016-09-23T07:00:00.000Z,2016-10-01 09:59:53+00:00,2016-10-01 16:59:53+00:00,2016-10-10
2016-09-17 00:27:31,30.060911,31.2148748,driver_analytics,1472774400000,,4,2016-09-23T07:00:00.000Z,2016-10-01 09:57:11+00:00,2016-10-01 16:57:11+00:00,2016-10-10
2016-09-17 00:28:35,30.060334,31.2212278,driver_analytics,1472774400000,,5,2016-09-23T07:00:00.000Z,2016-10-01 09:59:27+00:00,2016-10-01 16:59:27+00:00,2016-10-10
2016-09-17 00:29:40,30.0554663,31.2288985,driver_analytics,1472774400000,True,,2016-09-23T07:00:00.000Z,2016-10-01 09:46:36+00:00,2016-10-01 16:46:36+00:00,2016-10-10
2016-09-17 00:30:03,30.0614122,31.2187021,driver_gps,1472774400000,True,6,2016-09-23T08:00:00.000Z,2016-10-01 09:54:31+00:00,2016-10-01 16:54:31+00:00,2016-10-10
2016-09-17 00:30:03,30.0612697,31.2191059,driver_gps,1472774400000,True,7,2016-09-23T08:00:00.000Z,2016-10-01 09:53:35+00:00,2016-10-01 16:53:35+00:00,2016-10-10
2016-09-17 00:30:08,30.0610977,31.2194728,driver_gps,1472774400000,True,,2016-09-23T08:00:00.000Z,,,`;

const dataId = 'test_trip_data';

export const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [
        {
          dataId,
          id: 'c75x65vlb',
          name: 'gps_data.utc_timestamp',
          type: 'timeRange',
          value: [1474071773000, 1474072208000],
          enlarged: true,
          plotType: 'histogram',
          yAxis: null
        }
      ],
      layers: [
        {
          id: '3zucml7',
          type: 'point',
          config: {
            dataId,
            label: 'gps data',
            color: [18, 147, 154],
            columns: {
              lat: 'gps_data.lat',
              lng: 'gps_data.lng',
              altitude: null
            },
            isVisible: true,
            visConfig: {
              radius: 39.2,
              fixedRadius: false,
              opacity: 0.74,
              outline: true,
              thickness: 2,
              strokeColor: [254, 242, 26],
              colorRange: {
                name: 'UberPool 3',
                type: 'diverging',
                category: 'Uber',
                colors: ['#213E9A', '#CA168E', '#F9E200'],
                reversed: false
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
              radiusRange: [28.5, 194.7],
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
              name: 'gps_data.types',
              type: 'string'
            },
            colorScale: 'ordinal',
            strokeColorField: null,
            strokeColorScale: 'quantile',
            sizeField: {
              name: 'id',
              type: 'integer'
            },
            sizeScale: 'sqrt'
          }
        },
        {
          id: 'nob639j',
          type: 'hexagon',
          config: {
            dataId,
            label: 'hexbin',
            color: [34, 63, 154],
            columns: {
              lat: 'gps_data.lat',
              lng: 'gps_data.lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              worldUnitSize: 1,
              resolution: 8,
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
            [dataId]: ['gps_data.types', 'has_result', 'id', 'time']
          },
          enabled: true
        },
        brush: {
          size: 0.5,
          enabled: false
        }
      },
      layerBlending: 'normal',
      splitMaps: [
        {
          layers: {
            '3zucml7': {
              isAvailable: true,
              isVisible: true
            },
            nob639j: {
              isAvailable: true,
              isVisible: false
            }
          }
        },
        {
          layers: {
            '3zucml7': {
              isAvailable: true,
              isVisible: false
            },
            nob639j: {
              isAvailable: true,
              isVisible: true
            }
          }
        }
      ]
    },
    mapState: {
      bearing: 24,
      dragRotate: true,
      latitude: 30.028974821846045,
      longitude: 31.205476105912005,
      pitch: 50,
      zoom: 12.456401285586372,
      isSplit: true
    },
    mapStyle: {
      styleType: 'light',
      topLayerGroups: {
        road: true
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

export const sampleConfig = {
  dataId,
  config
};

export const dataWithNulls = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,id,time,begintrip_ts_utc,begintrip_ts_local,date
2016-09-17 00:09:55,29.9900937,31.2590542,driver_analytics,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
2016-09-17 00:10:56,29.9927699,31.2461142,driver_analytics,1472688000000,False,null,2016-09-23T00:00:00.000Z,2016-10-01 09:46:37+00:00,2016-10-01 16:46:37+00:00,2016-09-23
2016-09-17 00:11:56,29.9907261,NaN,driver_analytics,1472688000000,False,3,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:12:58,29.9870074,31.2175827,driver_analytics,1472688000000,False,4,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:14:00,29.9923041,31.2154899,driver_analytics,1472688000000,1,5,2016-09-23T00:00:00.000Z,2016-10-01 09:47:37+00:00,2016-10-01 16:47:37+00:00,
2016-09-17 00:15:01,29.9968249,31.2149361,driver_analytics,1472688000000,False,12124,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:16:03,Null,31.2164035,driver_analytics,1472688000000,False,222,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:17:05,30.0116207,31.2179346,driver_analytics,1472688000000,False,345,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:18:09,30.0208925,31.2179556,driver_analytics,1472708000000,False,,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:19:12,30.0218999,31.2178842,driver_analytics,NULL,0,,2016-09-23T06:00:00.000Z,,,2016-09-24
2016-09-17 00:19:27,30.0229344,31.2179138,driver_analytics,1472708000000,False,,2016-09-23T05:00:00.000Z,,,2016-09-24
2016-09-17 00:20:14,30.0264237,31.2179415,driver_analytics,1472708000000,False,,,,,2016-09-24
2016-09-17 00:21:17,30.0292134,31.2181809,driver_analytics,1472754400000,False,,,,,2016-09-24`;

export const parsedDataWithNulls = [
  [
    '2016-09-17 00:09:55',
    29.9900937,
    31.2590542,
    'driver_analytics',
    1472688000000,
    false,
    1,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:41:39+00:00',
    '2016-10-01 09:41:39+00:00',
    '2016-09-23'
  ],
  [
    '2016-09-17 00:10:56',
    29.9927699,
    31.2461142,
    'driver_analytics',
    1472688000000,
    false,
    null,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:46:37+00:00',
    '2016-10-01 16:46:37+00:00',
    '2016-09-23'
  ],
  [
    '2016-09-17 00:11:56',
    29.9907261,
    null,
    'driver_analytics',
    1472688000000,
    false,
    3,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-23'
  ],
  [
    '2016-09-17 00:12:58',
    29.9870074,
    31.2175827,
    'driver_analytics',
    1472688000000,
    false,
    4,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-23'
  ],
  [
    '2016-09-17 00:14:00',
    29.9923041,
    31.2154899,
    'driver_analytics',
    1472688000000,
    true,
    5,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:47:37+00:00',
    '2016-10-01 16:47:37+00:00',
    null
  ],
  [
    '2016-09-17 00:15:01',
    29.9968249,
    31.2149361,
    'driver_analytics',
    1472688000000,
    false,
    12124,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    null
  ],
  [
    '2016-09-17 00:16:03',
    null,
    31.2164035,
    'driver_analytics',
    1472688000000,
    false,
    222,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    null
  ],
  [
    '2016-09-17 00:17:05',
    30.0116207,
    31.2179346,
    'driver_analytics',
    1472688000000,
    false,
    345,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:18:09',
    30.0208925,
    31.2179556,
    'driver_analytics',
    1472708000000,
    false,
    null,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:19:12',
    30.0218999,
    31.2178842,
    'driver_analytics',
    null,
    false,
    null,
    '2016-09-23T06:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:19:27',
    30.0229344,
    31.2179138,
    'driver_analytics',
    1472708000000,
    false,
    null,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:20:14',
    30.0264237,
    31.2179415,
    'driver_analytics',
    1472708000000,
    false,
    null,
    null,
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:21:17',
    30.0292134,
    31.2181809,
    'driver_analytics',
    1472754400000,
    false,
    null,
    null,
    null,
    null,
    '2016-09-24'
  ]
];

export const wktCsv = `a_zip,simplified_shape_v2,simplified_shape,m_rate,c_zip_type,c_number
7015,,,7,C_Medium_High,22.22
7014,"{""type"":""Polygon"",""coordinates"":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}","POLYGON ((-74.158491 40.835947, -74.157914 40.83902, -74.148473 40.834522))",7.5,C_Medium_High,29.07437458
7016,"{""type"":""Polygon"",""coordinates"":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}","POLYGON ((-74.31687 40.656696, -74.319449 40.658154, -74.31687 40.656696))",6.5,C_Medium_High,27.60106201
7023,"{""type"":""Polygon"",""coordinates"":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}","POLYGON ((-74.387589 40.632238, -74.387589 40.632238))",7.6,C_Medium_High,23.85239437
7029,"{""type"":""Polygon"",""coordinates"":[[[-74.165995,40.747969],[-74.165987,40.745199],[-74.165995,40.747969]]]}","POLYGON ((-74.165995 40.747969, -74.165987 40.745199, -74.165995 40.747969))",11.8,C_Medium_High,39.13775443
7416,"{""type"":""MultiPolygon"",""coordinates"":[[[[-74.566993,41.087294],[-74.564908,41.089339],[-74.552353,41.091647],[-74.566993,41.087294]]],[[[-74.593264,41.088526],[-74.593264,41.088526]]]]}","MULTIPOLYGON (((-74.566993 41.087294, -74.564908 41.089339, -74.552353 41.091647, -74.566993 41.087294)),((-74.593264 41.088526, -74.593264 41.088526)))",10,A_Low_Rural,13.81679389
7023,"{""type"":""LineString"",""coordinates"":[[-74.387589,40.632238],[-74.387589,40.632238]]}","LINESTRING (-74.387589 40.632238, -74.387589 40.632238)",7.6,C_Medium_High,23.85239437
`;

export const testFields = [
  {
    type: 'timestamp',
    name: 'gps_data.utc_timestamp',
    format: 'YYYY-M-D H:m:s',
    tableFieldIndex: 1
  },
  {
    type: 'real',
    name: 'gps_data.lat',
    format: '',
    tableFieldIndex: 2
  },
  {
    type: 'real',
    name: 'gps_data.lng',
    format: '',
    tableFieldIndex: 3
  },
  {
    type: 'string',
    name: 'gps_data.types',
    format: '',
    tableFieldIndex: 4
  },
  {
    type: 'timestamp',
    name: 'epoch',
    format: 'X',
    tableFieldIndex: 5
  },
  {
    type: 'boolean',
    name: 'has_result',
    format: '',
    tableFieldIndex: 6
  },
  {
    type: 'integer',
    name: 'id',
    format: '',
    tableFieldIndex: 7
  },
  {
    type: 'timestamp',
    name: 'time',
    format: 'YYYY-M-DTHH:mm:ss.SSSS',
    tableFieldIndex: 8
  },
  {
    type: 'timestamp',
    name: 'begintrip_ts_utc',
    format: 'YYYY-M-D HH:mm:ssZZ',
    tableFieldIndex: 9
  },
  {
    type: 'timestamp',
    name: 'begintrip_ts_local',
    format: 'YYYY-M-D HH:mm:ssZZ',
    tableFieldIndex: 10
  },
  {
    type: 'date',
    name: 'date',
    format: 'YYYY-M-D',
    tableFieldIndex: 11
  }
];

export const wktCsvFields = [
  {
    type: 'integer',
    name: 'a_zip',
    format: '',
    tableFieldIndex: 1
  },
  {
    type: 'geojson',
    name: 'simplified_shape_v2',
    format: '',
    tableFieldIndex: 2
  },
  {
    type: 'geojson',
    name: 'simplified_shape',
    format: '',
    tableFieldIndex: 3
  },
  {
    type: 'real',
    name: 'm_rate',
    format: '',
    tableFieldIndex: 4
  },
  {
    type: 'string',
    name: 'c_zip_type',
    format: '',
    tableFieldIndex: 5
  },
  {
    type: 'real',
    name: 'c_number',
    format: '',
    tableFieldIndex: 6
  }
];

export const testAllData = [
  [
    '2016-09-17 00:09:55',
    29.9900937,
    31.2590542,
    'driver_analytics',
    1472688000000,
    false,
    1,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:41:39+00:00',
    '2016-10-01 09:41:39+00:00',
    '2016-09-23'
  ],
  [
    '2016-09-17 00:10:56',
    29.9927699,
    31.2461142,
    'driver_analytics',
    1472688000000,
    false,
    2,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:46:37+00:00',
    '2016-10-01 16:46:37+00:00',
    '2016-09-23'
  ],
  [
    '2016-09-17 00:11:56',
    29.9907261,
    31.2312742,
    'driver_analytics',
    1472688000000,
    false,
    3,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-23'
  ],
  [
    '2016-09-17 00:12:58',
    29.9870074,
    31.2175827,
    'driver_analytics',
    1472688000000,
    false,
    4,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-23'
  ],
  [
    '2016-09-17 00:14:00',
    29.9923041,
    31.2154899,
    'driver_analytics',
    1472688000000,
    false,
    5,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:47:37+00:00',
    '2016-10-01 16:47:37+00:00',
    null
  ],
  [
    '2016-09-17 00:15:01',
    29.9968249,
    31.2149361,
    'driver_analytics',
    1472688000000,
    false,
    12124,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    null
  ],
  [
    '2016-09-17 00:16:03',
    30.0037217,
    31.2164035,
    'driver_analytics',
    1472688000000,
    false,
    222,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    null
  ],
  [
    '2016-09-17 00:17:05',
    30.0116207,
    31.2179346,
    'driver_analytics',
    1472688000000,
    false,
    345,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:18:09',
    30.0208925,
    31.2179556,
    'driver_analytics',
    1472708000000,
    false,
    null,
    '2016-09-23T00:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:19:12',
    30.0218999,
    31.2178842,
    'driver_analytics',
    1472708000000,
    false,
    null,
    '2016-09-23T06:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:19:27',
    30.0229344,
    31.2179138,
    'driver_analytics',
    1472708000000,
    false,
    null,
    '2016-09-23T05:00:00.000Z',
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:20:14',
    30.0264237,
    31.2179415,
    'driver_analytics',
    1472708000000,
    false,
    null,
    null,
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:21:17',
    30.0292134,
    31.2181809,
    'driver_analytics',
    1472754400000,
    false,
    null,
    null,
    null,
    null,
    '2016-09-24'
  ],
  [
    '2016-09-17 00:22:20',
    30.034391,
    31.2193991,
    'driver_analytics',
    1472754400000,
    null,
    null,
    '2016-09-23T06:00:00.000Z',
    null,
    null,
    null
  ],
  [
    '2016-09-17 00:23:22',
    30.0352752,
    31.2181803,
    'driver_analytics',
    1472754400000,
    null,
    null,
    '2016-09-23T06:00:00.000Z',
    '2016-10-01 10:01:54+00:00',
    '2016-10-01 17:01:54+00:00',
    null
  ],
  [
    '2016-09-17 00:24:24',
    30.0395918,
    31.2195902,
    'driver_analytics',
    1472754400000,
    null,
    1,
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:53:04+00:00',
    '2016-10-01 16:53:04+00:00',
    null
  ],
  [
    '2016-09-17 00:25:28',
    30.0497387,
    31.2174421,
    'driver_analytics',
    1472774400000,
    null,
    null,
    '2016-09-23T07:00:00.000Z',
    '2016-10-01 09:55:23+00:00',
    '2016-10-01 16:55:23+00:00',
    null
  ],
  [
    '2016-09-17 00:26:29',
    30.0538936,
    31.2165983,
    'driver_analytics',
    1472774400000,
    null,
    43,
    '2016-09-23T07:00:00.000Z',
    '2016-10-01 09:59:53+00:00',
    '2016-10-01 16:59:53+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:27:31',
    30.060911,
    31.2148748,
    'driver_analytics',
    1472774400000,
    null,
    4,
    '2016-09-23T07:00:00.000Z',
    '2016-10-01 09:57:11+00:00',
    '2016-10-01 16:57:11+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:28:35',
    30.060334,
    31.2212278,
    'driver_analytics',
    1472774400000,
    null,
    5,
    '2016-09-23T07:00:00.000Z',
    '2016-10-01 09:59:27+00:00',
    '2016-10-01 16:59:27+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:29:40',
    30.0554663,
    31.2288985,
    'driver_analytics',
    1472774400000,
    true,
    null,
    '2016-09-23T07:00:00.000Z',
    '2016-10-01 09:46:36+00:00',
    '2016-10-01 16:46:36+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:30:03',
    30.0614122,
    31.2187021,
    'driver_gps',
    1472774400000,
    true,
    6,
    '2016-09-23T08:00:00.000Z',
    '2016-10-01 09:54:31+00:00',
    '2016-10-01 16:54:31+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:30:03',
    30.0612697,
    31.2191059,
    'driver_gps',
    1472774400000,
    true,
    7,
    '2016-09-23T08:00:00.000Z',
    '2016-10-01 09:53:35+00:00',
    '2016-10-01 16:53:35+00:00',
    '2016-10-10'
  ],
  [
    '2016-09-17 00:30:08',
    30.0610977,
    31.2194728,
    'driver_gps',
    1472774400000,
    true,
    null,
    '2016-09-23T08:00:00.000Z',
    null,
    null,
    null
  ]
];

export default data;

export const updatedLayerV2 = {
  dataToFeature: [
    null,
    {
      type: 'Feature',
      properties: {
        index: 1
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.158491, 40.835947],
            [-74.157914, 40.83902],
            [-74.148473, 40.834522]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        index: 2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.31687, 40.656696],
            [-74.319449, 40.658154],
            [-74.31687, 40.656696]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        index: 3
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.387589, 40.632238], [-74.387589, 40.632238]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        index: 4
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.165995, 40.747969],
            [-74.165987, 40.745199],
            [-74.165995, 40.747969]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        index: 5
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-74.566993, 41.087294],
              [-74.564908, 41.089339],
              [-74.552353, 41.091647],
              [-74.566993, 41.087294]
            ]
          ],
          [[[-74.593264, 41.088526], [-74.593264, 41.088526]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        index: 6
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-74.387589, 40.632238], [-74.387589, 40.632238]]
      }
    }
  ],
  meta: {
    featureTypes: {polygon: true, line: true},
    bounds: [-74.593264, 40.632238, -74.148473, 41.091647],
    fixedRadius: false
  }
};
/* eslint-enable max-lens */
