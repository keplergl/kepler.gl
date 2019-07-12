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
2016-09-17 00:09:55,29.9900937,31.2590542,driver_analytics_0,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
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

export const dataWithNulls = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,id,time,begintrip_ts_utc,begintrip_ts_local,date
Null,29.9900937,31.2590542,driver_analytics_0,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
2016-09-17 00:10:56,29.9927699,31.2461142,null,1472688000000,False,null,2016-09-23T00:00:00.000Z,2016-10-01 09:46:37+00:00,2016-10-01 16:46:37+00:00,2016-09-23
2016-09-17 00:11:56,29.9907261,NaN,driver_analytics,1472688000000,False,3,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:12:58,29.9870074,31.2175827,driver_gps,1472688000000,False,4,2016-09-23T00:00:00.000Z,,,2016-09-23
2016-09-17 00:14:00,29.9923041,31.2154899,driver_analytics,1472688000000,1,5,2016-09-23T00:00:00.000Z,2016-10-01 09:47:37+00:00,2016-10-01 16:47:37+00:00,
2016-09-17 00:15:01,29.9968249,31.2149361,driver_analytics,1472688000000,False,12124,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:16:03,Null,31.2164035,driver_analytics,1472688000000,False,222,2016-09-23T05:00:00.000Z,,,
2016-09-17 00:17:05,30.0116207,31.2179346,driver_analytics,1472688000000,False,345,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:18:09,30.0208925,31.2179556,driver_analytics,1472708000000,False,,2016-09-23T00:00:00.000Z,,,2016-09-24
2016-09-17 00:19:12,30.0218999,31.2178842,driver_analytics,NULL,0,,2016-09-23T06:00:00.000Z,,,2016-09-24
2016-09-17 00:19:27,30.0229344,31.2179138,driver_gps,1472708000000,False,,2016-09-23T05:00:00.000Z,,,2016-09-24
2016-09-17 00:20:14,30.0264237,31.2179415,driver_gps,1472708000000,False,,,,,2016-09-24
2016-09-17 00:21:17,30.0292134,31.2181809,driver_gps,1472754400000,False,,,,,2016-09-24`;

export const parsedDataWithNulls = [
  [
    null,
    29.9900937,
    31.2590542,
    'driver_analytics_0',
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
    null,
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
    'driver_gps',
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
    'driver_gps',
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
    'driver_gps',
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
    'driver_gps',
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
7014,"","POLYGON ((-74.158491 40.835947, -74.158491 40.835947))",7.5,C_Medium_High,29.1
7016,"{""type"":""Polygon"",""coordinates"":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}","POLYGON ((-74.31687 40.656696, -74.312298 40.654042, -74.31687 40.656696))",6.5,C_Medium_High,27.6
7023,"{""type"":""Polygon"",""coordinates"":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}","POLYGON ((-74.387589 40.632238, -74.382333 40.632417, -74.384457 40.630453, -74.387589 40.632238))",,,23.8
7029,"{""type"":""Polygon"",""coordinates"":[[[-74.165995,40.747969],[-74.165987,40.745199],[-74.165995,40.747969]]]}","POLYGON ((-74.165995 40.747969, -74.163788 40.739201, -74.165987 40.745199, -74.165995 40.747969))",11.8,C_Medium_High,39.1
7416,"{""type"":""MultiPolygon"",""coordinates"":[[[[-74.566993,41.087294],[-74.564908,41.089339],[-74.552353,41.091647],[-74.566993,41.087294]]],[[[-74.593264,41.088526],[-74.593264,41.088526]]]]}","MULTIPOLYGON (((-74.566993 41.087294, -74.564908 41.089339, -74.56559 41.090507, -74.557344 41.105958, -74.585763 41.083491, -74.593264 41.088526)))",10,A_Low_Rural,13.8
7014,"{""type"":""Polygon"",""coordinates"":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}","POLYGON ((-74.158491 40.835947, -74.158491 40.835947))",7.5,C_Medium_High,29.2
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

export const wktCsvRows = [
  [
    7014,
    null,
    'POLYGON ((-74.158491 40.835947, -74.158491 40.835947))',
    7.5,
    'C_Medium_High',
    29.1
  ],
  [
    7016,
    '{"type":"Polygon","coordinates":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}',
    'POLYGON ((-74.31687 40.656696, -74.312298 40.654042, -74.31687 40.656696))',
    6.5,
    'C_Medium_High',
    27.6
  ],
  [
    7023,
    '{"type":"Polygon","coordinates":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}',
    'POLYGON ((-74.387589 40.632238, -74.382333 40.632417, -74.384457 40.630453, -74.387589 40.632238))',
    null,
    null,
    23.8
  ],
  [
    7029,
    '{"type":"Polygon","coordinates":[[[-74.165995,40.747969],[-74.165987,40.745199],[-74.165995,40.747969]]]}',
    'POLYGON ((-74.165995 40.747969, -74.163788 40.739201, -74.165987 40.745199, -74.165995 40.747969))',
    11.8,
    'C_Medium_High',
    39.1
  ],
  [
    7416,
    '{"type":"MultiPolygon","coordinates":[[[[-74.566993,41.087294],[-74.564908,41.089339],[-74.552353,41.091647],[-74.566993,41.087294]]],[[[-74.593264,41.088526],[-74.593264,41.088526]]]]}',
    'MULTIPOLYGON (((-74.566993 41.087294, -74.564908 41.089339, -74.56559 41.090507, -74.557344 41.105958, -74.585763 41.083491, -74.593264 41.088526)))',
    10,
    'A_Low_Rural',
    13.8
  ],
  [
    7014,
    '{"type":"Polygon","coordinates":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}',
    'POLYGON ((-74.158491 40.835947, -74.158491 40.835947))',
    7.5,
    'C_Medium_High',
    29.2
  ]
];

export const testAllData = [
  [
    '2016-09-17 00:09:55',
    29.9900937,
    31.2590542,
    'driver_analytics_0',
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
  dataToFeature: {
    0: null,
    1: {
      type: 'Feature',
      properties: {
        index: 1
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
    2: {
      type: 'Feature',
      properties: {
        index: 2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.387589, 40.632238], [-74.387589, 40.632238]]]
      }
    },
    3: {
      type: 'Feature',
      properties: {
        index: 3
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
    4: {
      type: 'Feature',
      properties: {
        index: 4
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
    5: {
      type: 'Feature',
      properties: {
        index: 5
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
    }
  },
  meta: {
    featureTypes: {polygon: true},
    bounds: [-74.593264, 40.632238, -74.148473, 41.091647],
    lightSettings: {
      lightsPosition: [
        -74.593264,
        40.632238,
        8000,
        -74.148473,
        41.091647,
        8000
      ],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.3,
      lightsStrength: [0.9, 0, 0.8, 0],
      numberOfLights: 2
    },
    fixedRadius: false
  }
};

export const updatedLayerSimplifiedShape = {
  dataToFeature: {
    0: {
      type: 'Feature',
      properties: {
        index: 0
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.158491, 40.835947], [-74.158491, 40.835947]]]
      }
    },
    1: {
      type: 'Feature',
      properties: {
        index: 1
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.31687, 40.656696],
            [-74.312298, 40.654042],
            [-74.31687, 40.656696]
          ]
        ]
      }
    },
    2: {
      type: 'Feature',
      properties: {
        index: 2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.387589, 40.632238],
            [-74.382333, 40.632417],
            [-74.384457, 40.630453],
            [-74.387589, 40.632238]
          ]
        ]
      }
    },
    3: {
      type: 'Feature',
      properties: {
        index: 3
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.165995, 40.747969],
            [-74.163788, 40.739201],
            [-74.165987, 40.745199],
            [-74.165995, 40.747969]
          ]
        ]
      }
    },
    4: {
      type: 'Feature',
      properties: {
        index: 4
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-74.566993, 41.087294],
              [-74.564908, 41.089339],
              [-74.56559, 41.090507],
              [-74.557344, 41.105958],
              [-74.585763, 41.083491],
              [-74.593264, 41.088526]
            ]
          ]
        ]
      }
    },
    5: {
      type: 'Feature',
      properties: {
        index: 5
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.158491, 40.835947], [-74.158491, 40.835947]]]
      }
    }
  },
  meta: {
    featureTypes: {polygon: true},
    bounds: [-74.593264, 40.630453, -74.158491, 41.105958],
    lightSettings: {
      lightsPosition: [
        -74.593264,
        40.630453,
        8000,
        -74.158491,
        41.105958,
        8000
      ],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.3,
      lightsStrength: [0.9, 0, 0.8, 0],
      numberOfLights: 2
    },
    fixedRadius: false
  }
};

/* eslint-enable max-lens */
