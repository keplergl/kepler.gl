// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// csv restul returned by loaders.gl
// Nulls are returned as string
import {geojsonData} from 'test/fixtures/geojson';

// TODO: this is result returned by loaders.gl
// ideally we would test loaders.gl from start to end
// need to upgrade JSDom to
export const csvWithNull = [
  {
    'gps_data.utc_timestamp': 'Null',
    'gps_data.lat': 29.9900937,
    'gps_data.lng': 31.2590542,
    'gps_data.types': 'driver_analytics_0',
    epoch: 1472688000000,
    has_result: 'False',
    id: 1,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: '2016-10-01 09:41:39+00:00',
    begintrip_ts_local: '2016-10-01 09:41:39+00:00',
    date: '2016-09-23'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:10:56',
    'gps_data.lat': 29.9927699,
    'gps_data.lng': 31.2461142,
    'gps_data.types': 'null',
    epoch: 1472688000000,
    has_result: 'False',
    id: 'null',
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: '2016-10-01 09:46:37+00:00',
    begintrip_ts_local: '2016-10-01 16:46:37+00:00',
    date: '2016-09-23'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:11:56',
    'gps_data.lat': 29.9907261,
    'gps_data.lng': 'NaN',
    'gps_data.types': 'driver_analytics',
    epoch: 1472688000000,
    has_result: 'False',
    id: 3,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-23'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:12:58',
    'gps_data.lat': 29.9870074,
    'gps_data.lng': 31.2175827,
    'gps_data.types': 'driver_gps',
    epoch: 1472688000000,
    has_result: 'False',
    id: 4,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-23'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:14:00',
    'gps_data.lat': 29.9923041,
    'gps_data.lng': 31.2154899,
    'gps_data.types': 'driver_analytics',
    epoch: 1472688000000,
    has_result: 1,
    id: 5,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: '2016-10-01 09:47:37+00:00',
    begintrip_ts_local: '2016-10-01 16:47:37+00:00',
    date: null
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:15:01',
    'gps_data.lat': 29.9968249,
    'gps_data.lng': 31.2149361,
    'gps_data.types': 'driver_analytics',
    epoch: 1472688000000,
    has_result: 'False',
    id: 12124,
    time: '2016-09-23T05:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: null
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:16:03',
    'gps_data.lat': 'Null',
    'gps_data.lng': 31.2164035,
    'gps_data.types': 'driver_analytics',
    epoch: 1472688000000,
    has_result: 'False',
    id: 222,
    time: '2016-09-23T05:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: null
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:17:05',
    'gps_data.lat': 30.0116207,
    'gps_data.lng': 31.2179346,
    'gps_data.types': 'driver_analytics',
    epoch: 1472688000000,
    has_result: 'False',
    id: 345,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:18:09',
    'gps_data.lat': 30.0208925,
    'gps_data.lng': 31.2179556,
    'gps_data.types': 'driver_analytics',
    epoch: 1472708000000,
    has_result: 'False',
    id: null,
    time: '2016-09-23T00:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:19:12',
    'gps_data.lat': 30.0218999,
    'gps_data.lng': 31.2178842,
    'gps_data.types': 'driver_analytics',
    epoch: 'NULL',
    has_result: 0,
    id: null,
    time: '2016-09-23T06:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:19:27',
    'gps_data.lat': 30.0229344,
    'gps_data.lng': 31.2179138,
    'gps_data.types': 'driver_gps',
    epoch: 1472708000000,
    has_result: 'False',
    id: null,
    time: '2016-09-23T05:00:00.000Z',
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:20:14',
    'gps_data.lat': 30.0264237,
    'gps_data.lng': 31.2179415,
    'gps_data.types': 'driver_gps',
    epoch: 1472708000000,
    has_result: 'False',
    id: null,
    time: null,
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  },
  {
    'gps_data.utc_timestamp': '2016-09-17 00:21:17',
    'gps_data.lat': 30.0292134,
    'gps_data.lng': 31.2181809,
    'gps_data.types': 'driver_gps',
    epoch: 1472754400000,
    has_result: 'False',
    id: null,
    time: null,
    begintrip_ts_utc: null,
    begintrip_ts_local: null,
    date: '2016-09-24'
  }
];

// metaData batch csv
export const csvMetaDataBatch = {
  batchType: 'metadata',
  bytesUsed: 0,
  data: [],
  metadata: {
    _context: {},
    _loader: {}
  }
};

export const csvSchema = {
  'gps_data.utc_timestamp': {
    name: 'gps_data.utc_timestamp',
    index: 0
  },
  'gps_data.lat': {
    name: 'gps_data.lat',
    index: 1
  },
  'gps_data.lng': {
    name: 'gps_data.lng',
    index: 2
  },
  'gps_data.types': {
    name: 'gps_data.types',
    index: 3
  },
  epoch: {
    name: 'epoch',
    index: 4
  },
  has_result: {
    name: 'has_result',
    index: 5
  },
  id: {
    name: 'id',
    index: 6
  },
  time: {
    name: 'time',
    index: 7
  },
  begintrip_ts_utc: {
    name: 'begintrip_ts_utc',
    index: 8
  },
  begintrip_ts_local: {
    name: 'begintrip_ts_local',
    index: 9
  },
  date: {
    name: 'date',
    index: 10
  }
};

// data batch csv
export const csvDataBatch0 = {
  bytesUsed: 2000,
  count: 0,
  // cursor: 0
  data: csvWithNull.slice(0, 6),
  length: 6,
  schema: csvSchema
};

export const csvDataBatch1 = {
  bytesUsed: 3000,
  count: 1,
  // cursor: 0
  data: csvWithNull.slice(6, 13),
  length: 7,
  schema: csvSchema
};

export const geojsonMetaBatch = {
  batchType: 'metadata',
  bytesUsed: 0,
  // data is empty in metaBatch
  data: [],
  // omit loader
  metadata: {_loader: {}, _context: {}},
  progress: {
    percent: 0,
    rowCount: 0,
    rowCountInBatch: 0
  }
};
export const geoJsonPartialBatch = {
  batchType: 'partial-result',
  bytesUsed: 0,
  container: {type: 'FeatureCollection', features: []},
  data: [],
  jsonpath: '$.features',
  schema: {}
};

export const geoJsonDataBatch0 = {
  bytesUsed: 2000,
  count: 1,
  cursor: 0,
  data: geojsonData.features.slice(0, 2),
  jsonpath: '$.features',
  length: 5,
  schema: null
};

export const geoJsonDataBatch1 = {
  bytesUsed: 4000,
  count: 2,
  cursor: 0,
  data: geojsonData.features.slice(2, 5),
  jsonpath: '$.features',
  length: 3,
  schema: null
};

export const geoJsonFinalBatch = {
  batchType: 'final-result',
  container: {type: 'FeatureCollection', features: []},
  data: [],
  jsonpath: '$.features',
  schema: null
};
