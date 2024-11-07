// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getBinThresholds, histogramFromThreshold} from '@kepler.gl/utils';

/* eslint-disable max-len */
const data = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,uid,time,begintrip_ts_utc,begintrip_ts_local,date
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

export const dataId = '190vdll3di';
export const gpsPointBounds = [31.2148748, 29.9870074, 31.2590542, 30.0614122];
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
            hidden: false,
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
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
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
            hidden: false,
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              worldUnitSize: 1,
              resolution: 8,
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              },
              coverage: 1,
              sizeRange: [0, 500],
              percentile: [0, 100],
              elevationPercentile: [0, 100],
              elevationScale: 5,
              enableElevationZoomFactor: true,
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
        },
        geocoder: {
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

export const dataWithNulls = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,uid,time,begintrip_ts_utc,begintrip_ts_local,date
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
7015,,,7,C_Medium_High,22.22
7014,"{""type"":""Polygon"",""coordinates"":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}","POLYGON ((-74.158491 40.835947, -74.157914 40.83902, -74.148473 40.834522))",7.5,C_Medium_High,29.1
7016,"{""type"":""Polygon"",""coordinates"":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}","POLYGON ((-74.31687 40.656696, -74.319449 40.658154, -74.31687 40.656696))",,C_Medium_High,27.6
7023,"{""type"":""Polygon"",""coordinates"":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}","POLYGON ((-74.387589 40.632238, -74.387589 40.632238))",7.6,C_Medium_High,23.8
7029,"{""type"":""Polygon"",""coordinates"":[[[-74.165995,40.747969],[-74.165987,40.745199],[-74.165995,40.747969]]]}","POLYGON ((-74.165995 40.747969, -74.165987 40.745199, -74.165995 40.747969))",11.8,C_Medium_High,39.1
7416,"{""type"":""MultiPolygon"",""coordinates"":[[[[-74.566993,41.087294],[-74.564908,41.089339],[-74.552353,41.091647],[-74.566993,41.087294]]],[[[-74.593264,41.088526],[-74.593264,41.088526]]]]}","MULTIPOLYGON (((-74.566993 41.087294, -74.564908 41.089339, -74.552353 41.091647, -74.566993 41.087294)),((-74.593264 41.088526, -74.593264 41.088526)))",10,A_Low_Rural,13.8
7023,"{""type"":""LineString"",""coordinates"":[[-74.387589,40.632238],[-74.387589,40.632238]]}","LINESTRING (-74.387589 40.632238, -74.387589 40.632238)",7.6,C_Medium_High,29.2
`;

// output of processCsvData
export const testFields = [
  {
    type: 'timestamp',
    fieldIdx: 0,
    name: 'gps_data.utc_timestamp',
    id: 'gps_data.utc_timestamp',
    displayName: 'gps_data.utc_timestamp',
    format: 'YYYY-M-D H:m:s',
    analyzerType: 'DATETIME',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 0);
    }
  },
  {
    type: 'real',
    fieldIdx: 1,
    name: 'gps_data.lat',
    id: 'gps_data.lat',
    displayName: 'gps_data.lat',
    format: '',
    analyzerType: 'FLOAT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 1);
    }
  },
  {
    type: 'real',
    fieldIdx: 2,
    name: 'gps_data.lng',
    id: 'gps_data.lng',
    displayName: 'gps_data.lng',
    format: '',
    analyzerType: 'FLOAT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 2);
    }
  },
  {
    type: 'string',
    fieldIdx: 3,
    name: 'gps_data.types',
    id: 'gps_data.types',
    displayName: 'gps_data.types',
    format: '',
    analyzerType: 'STRING',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 3);
    }
  },
  {
    type: 'timestamp',
    fieldIdx: 4,
    name: 'epoch',
    id: 'epoch',
    displayName: 'epoch',
    format: 'X',
    analyzerType: 'TIME',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 4);
    }
  },
  {
    type: 'boolean',
    fieldIdx: 5,
    name: 'has_result',
    id: 'has_result',
    displayName: 'has_result',
    format: '',
    analyzerType: 'BOOLEAN',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 5);
    }
  },
  {
    type: 'integer',
    fieldIdx: 6,
    name: 'uid',
    id: 'uid',
    displayName: 'uid',
    format: '',
    analyzerType: 'INT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 6);
    }
  },
  {
    type: 'timestamp',
    fieldIdx: 7,
    name: 'time',
    id: 'time',
    displayName: 'time',
    format: 'YYYY-M-DTHH:mm:ss.SSSS',
    analyzerType: 'DATETIME',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 7);
    }
  },
  {
    type: 'timestamp',
    fieldIdx: 8,
    name: 'begintrip_ts_utc',
    id: 'begintrip_ts_utc',
    displayName: 'begintrip_ts_utc',
    format: 'YYYY-M-D HH:mm:ssZZ',
    analyzerType: 'DATETIME',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 8);
    }
  },
  {
    type: 'timestamp',
    fieldIdx: 9,
    name: 'begintrip_ts_local',
    id: 'begintrip_ts_local',
    displayName: 'begintrip_ts_local',
    format: 'YYYY-M-D HH:mm:ssZZ',
    analyzerType: 'DATETIME',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 9);
    }
  },
  {
    type: 'date',
    fieldIdx: 10,
    name: 'date',
    id: 'date',
    displayName: 'date',
    format: 'YYYY-M-D',
    analyzerType: 'DATE',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 10);
    }
  }
];

export const testCsvFieldPairs = [
  {
    defaultName: 'gps_data',
    pair: {
      lat: {
        value: 'gps_data.lat',
        fieldIdx: 1
      },
      lng: {
        value: 'gps_data.lng',
        fieldIdx: 2
      }
    },
    suffix: ['lat', 'lng']
  }
];
export const timeMappedValue = [
  1474588800000,
  1474588800000,
  1474588800000,
  1474588800000,
  1474588800000,
  1474606800000,
  1474606800000,
  1474588800000,
  1474588800000,
  1474610400000,
  1474606800000,
  null,
  null,
  1474610400000,
  1474610400000,
  1474588800000,
  1474614000000,
  1474614000000,
  1474614000000,
  1474614000000,
  1474614000000,
  1474617600000,
  1474617600000,
  1474617600000
];

export const epochMappedValue = [
  1472688000000, 1472688000000, 1472688000000, 1472688000000, 1472688000000, 1472688000000,
  1472688000000, 1472688000000, 1472708000000, 1472708000000, 1472708000000, 1472708000000,
  1472754400000, 1472754400000, 1472754400000, 1472754400000, 1472774400000, 1472774400000,
  1472774400000, 1472774400000, 1472774400000, 1472774400000, 1472774400000, 1472774400000
];

export const timeStampmappedValue = [
  1474070995000,
  1474071056000,
  1474071116000,
  1474071178000,
  1474071240000,
  1474071301000,
  1474071363000,
  1474071425000,
  1474071489000,
  1474071552000,
  1474071567000,
  1474071614000,
  1474071677000,
  1474071740000,
  1474071802000,
  1474071864000,
  1474071928000,
  1474071989000,
  1474072051000,
  1474072115000,
  1474072180000,
  1474072203000,
  1474072203000,
  1474072208000
];

export const timeFilterProps = {
  domain: [1474588800000, 1474617600000],
  step: 1000,
  mappedValue: timeMappedValue,
  fieldType: 'timestamp',
  type: 'timeRange',
  view: 'enlarged',
  fixedDomain: true,
  gpu: true,
  value: [1474588800000, 1474617600000],
  defaultTimeFormat: 'L LTS',
  plotType: {}
};

export const mergedTimeFilter = {
  ...timeFilterProps,
  animationWindow: 'free',
  dataId: [dataId],
  id: 'time-0',
  enabled: true,
  fixedDomain: true,
  view: 'enlarged',
  isAnimating: false,
  speed: 4,
  name: ['time'],
  type: 'timeRange',
  fieldIdx: [7],
  plotType: {
    interval: '1-hour',
    defaultTimeFormat: 'L  H A',
    type: 'histogram',
    aggregation: 'sum'
  },
  yAxis: null,
  value: [1474606800000, 1474617600000],
  gpuChannel: [0],
  timeBins: {
    [dataId]: {
      '1-hour': [
        {count: 8, indexes: [0, 1, 2, 3, 4, 7, 8, 15], x0: 1474588800000, x1: 1474592400000},
        {count: 3, indexes: [5, 6, 10], x0: 1474606800000, x1: 1474610400000},
        {count: 3, indexes: [9, 13, 14], x0: 1474610400000, x1: 1474614000000},
        {count: 5, indexes: [16, 17, 18, 19, 20], x0: 1474614000000, x1: 1474617600000},
        {count: 3, indexes: [21, 22, 23], x0: 1474617600000, x1: 1474621200000}
      ]
    }
  }
};

export const epochFilterProps = {
  domain: [1472688000000, 1472774400000],
  step: 1000,
  mappedValue: epochMappedValue,
  fieldType: 'timestamp',
  type: 'timeRange',
  view: 'enlarged',
  fixedDomain: true,
  gpu: true,
  value: [1472688000000, 1472774400000],
  defaultTimeFormat: 'L LTS',
  plotType: {}
};

// value set mockStateWithFilters 1472700000000, 1472760000000
export const mergedEpochFilter = {
  ...epochFilterProps,
  animationWindow: 'free',
  dataId: [dataId],
  id: 'epoch-1',
  enabled: true,
  fixedDomain: true,
  view: 'side',
  isAnimating: false,
  speed: 1,
  name: ['epoch'],
  type: 'timeRange',
  fieldIdx: [4],
  plotType: {
    interval: '15-minute',
    defaultTimeFormat: 'L  LT',
    type: 'histogram',
    aggregation: 'sum'
  },
  yAxis: null,
  value: [1472700000000, 1472760000000],
  // time filter is in channel 0
  gpuChannel: [1],
  timeBins: {
    [dataId]: {
      '15-minute': histogramFromThreshold(
        getBinThresholds('15-minute', [1472688000000, 1472774400000]),
        epochMappedValue,
        epochMappedValue.map((_, i) => i)
      )
    }
  }
};

export const expectedSyncedTsFilter = {
  id: 'filter-0',
  enabled: true,
  dataId: ['test-csv-data-1', 'test-csv-data-2'],
  name: ['gps_data.utc_timestamp', 'gps_data.utc_timestamp'],
  fieldIdx: [0, 0],
  // domain
  // 2016-09-17 00:09:55 // 1474070995000
  // 2016-09-17 00:30:08 // 1474072208000
  domain: [1474070995000, 1474072208000],
  value: [1474071116000, 1474072188000],
  animationWindow: 'free',
  defaultTimeFormat: 'L LTS',
  view: 'enlarged',
  fieldType: 'timestamp',
  fixedDomain: true,
  gpu: true,
  gpuChannel: [0, 0],
  isAnimating: false,
  plotType: {
    interval: '15-second',
    defaultTimeFormat: 'L  LTS',
    type: 'histogram',
    aggregation: 'sum',
    colorsByDataId: {
      'test-csv-data-1': '#FF0000',
      'test-csv-data-2': '#00FF00'
    }
  },
  speed: 1,
  step: 1000,
  type: 'timeRange',
  yAxis: null,
  timeBins: {
    'test-csv-data-1': {
      '15-second': histogramFromThreshold(
        getBinThresholds('15-second', [1474070995000, 1474072208000]),
        timeStampmappedValue.slice(0, 20),
        epochMappedValue.map((_, i) => i)
      )
    },
    'test-csv-data-2': {
      '15-second': histogramFromThreshold(
        getBinThresholds('15-second', [1474070995000, 1474072208000]),
        timeStampmappedValue.slice(5, timeStampmappedValue.length),
        epochMappedValue.map((_, i) => i)
      )
    }
  },
  mappedValue: [
    1474071301000,
    1474071363000,
    1474071425000,
    1474071489000,
    1474071552000,
    1474071567000,
    1474071614000,
    1474071677000,
    1474071740000,
    1474071802000,
    1474071864000,
    1474071928000,
    1474071989000,
    1474072051000,
    1474072115000,
    1474072180000,
    1474072203000,
    1474072203000,
    1474072208000
  ]
};

export const dateFilterProps = {
  domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
  fieldType: 'date',
  type: 'multiSelect',
  gpu: false,
  value: [],
  view: 'side'
};

export const mergedDateFilter = {
  ...dateFilterProps,
  animationWindow: 'free',
  dataId: [dataId],
  id: 'date-2',
  enabled: true,
  fixedDomain: false,
  view: 'side',
  isAnimating: false,
  speed: 1,
  name: ['date'],
  type: 'multiSelect',
  fieldIdx: [10],
  value: ['2016-09-24', '2016-09-23'],
  plotType: {
    type: 'histogram'
  },
  yAxis: null
};

export const wktCsvFields = [
  {
    type: 'integer',
    name: 'a_zip',
    id: 'a_zip',
    displayName: 'a_zip',
    format: '',
    fieldIdx: 0,
    analyzerType: 'INT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 0);
    }
  },
  {
    type: 'geojson',
    name: 'simplified_shape_v2',
    id: 'simplified_shape_v2',
    displayName: 'simplified_shape_v2',
    format: '',
    fieldIdx: 1,
    analyzerType: 'PAIR_GEOMETRY_FROM_STRING',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 1);
    }
  },
  {
    type: 'geojson',
    name: 'simplified_shape',
    id: 'simplified_shape',
    displayName: 'simplified_shape',
    format: '',
    fieldIdx: 2,
    analyzerType: 'GEOMETRY_FROM_STRING',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 2);
    }
  },
  {
    type: 'real',
    name: 'm_rate',
    id: 'm_rate',
    displayName: 'm_rate',
    format: '',
    fieldIdx: 3,
    analyzerType: 'FLOAT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 3);
    }
  },
  {
    type: 'string',
    name: 'c_zip_type',
    id: 'c_zip_type',
    displayName: 'c_zip_type',
    format: '',
    fieldIdx: 4,
    analyzerType: 'STRING',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 4);
    }
  },
  {
    type: 'real',
    name: 'c_number',
    id: 'c_number',
    displayName: 'c_number',
    format: '',
    fieldIdx: 5,
    analyzerType: 'FLOAT',
    valueAccessor: dc => d => {
      return dc.valueAt(d.index, 5);
    }
  }
];

export const wktCsvRows = [
  [7015, null, null, 7, 'C_Medium_High', 22.22],
  [
    7014,
    '{"type":"Polygon","coordinates":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}',
    'POLYGON ((-74.158491 40.835947, -74.157914 40.83902, -74.148473 40.834522))',
    7.5,
    'C_Medium_High',
    29.1
  ],
  [
    7016,
    '{"type":"Polygon","coordinates":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}',
    'POLYGON ((-74.31687 40.656696, -74.319449 40.658154, -74.31687 40.656696))',
    null,
    'C_Medium_High',
    27.6
  ],
  [
    7023,
    '{"type":"Polygon","coordinates":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}',
    'POLYGON ((-74.387589 40.632238, -74.387589 40.632238))',
    7.6,
    'C_Medium_High',
    23.8
  ],
  [
    7029,
    '{"type":"Polygon","coordinates":[[[-74.165995,40.747969],[-74.165987,40.745199],[-74.165995,40.747969]]]}',
    'POLYGON ((-74.165995 40.747969, -74.165987 40.745199, -74.165995 40.747969))',
    11.8,
    'C_Medium_High',
    39.1
  ],
  [
    7416,
    '{"type":"MultiPolygon","coordinates":[[[[-74.566993,41.087294],[-74.564908,41.089339],[-74.552353,41.091647],[-74.566993,41.087294]]],[[[-74.593264,41.088526],[-74.593264,41.088526]]]]}',
    'MULTIPOLYGON (((-74.566993 41.087294, -74.564908 41.089339, -74.552353 41.091647, -74.566993 41.087294)),((-74.593264 41.088526, -74.593264 41.088526)))',
    10,
    'A_Low_Rural',
    13.8
  ],
  [
    7023,
    '{"type":"LineString","coordinates":[[-74.387589,40.632238],[-74.387589,40.632238]]}',
    'LINESTRING (-74.387589 40.632238, -74.387589 40.632238)',
    7.6,
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

export const testCsvDataSlice1 = testAllData.slice(0, 20);
export const testCsvDataSlice1Id = 'test-csv-data-1';
export const timeFieldDomainSlice1 = [1474070995000, 1474072115000];

export const testCsvDataSlice2 = testAllData.slice(5, testAllData.length);
export const timeFieldDomainSlice2 = [1474071301000, 1474072208000];
export const testCsvDataSlice2Id = 'test-csv-data-2';

// the synced value intersect domain of both slices
export const syncTimeFilterValue = [1474071116000, 1474072188000];

export default data;

// geojson layer from wktcsv
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
        coordinates: [
          [
            [-74.387589, 40.632238],
            [-74.387589, 40.632238]
          ]
        ]
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
          [
            [
              [-74.593264, 41.088526],
              [-74.593264, 41.088526]
            ]
          ]
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
        coordinates: [
          [-74.387589, 40.632238],
          [-74.387589, 40.632238]
        ]
      }
    }
  ],
  meta: {
    featureTypes: {polygon: true, line: true},
    bounds: [-74.593264, 40.632238, -74.148473, 41.091647],
    fixedRadius: false
  }
};
/* eslint-enable max-len */

export const numericRangesCsv = `smallest,small,negative,medium,large
0.00000,0,-10,10,0
0.00001,1,-20,20,200
0.00005,1.5,-30,30,400
0.00099,2,-40,40,800
`;
