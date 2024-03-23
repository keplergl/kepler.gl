// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_TEXT_LABEL, DEFAULT_COLOR_RANGE, DEFAULT_LAYER_OPACITY} from '@kepler.gl/constants';

const gps = `timestamp,location-lng,location-lat,ground-speed,heading,name,location-alt
2014-08-01 00:00:23.000,90.2266981,27.6162803,0.22,0.0,Thuub,3217.0
2014-08-01 00:10:07.000,,,0.27,140.9,Thuub,3212.3
2014-08-01 00:20:07.000,90.2267115,27.6162102,0.27,110.1,Thuub,3209.1
2014-08-01 00:30:07.000,90.2267409,27.6162514,0.32,0.0,Thuub,3206.2
2014-08-01 00:40:07.000,90.2265545,27.6163481,0.46,0.0,Thuub,3231.3
2014-08-01 00:50:07.000,90.2269491,27.6161884,0.51,0.0,Thuub,3178.8
2014-08-01 01:00:07.000,90.2265336,27.6163122,0.3,99.61,Thuub,3257.2
2014-08-01 01:10:07.000,90.2267568,27.6162647,0.33,0.0,Thuub,3192.5
2014-08-01 01:20:07.000,90.2267296,27.6163003,0.43,0.0,Thuub,3199.2
2014-08-01 06:42:41.000,82.1138274,27.4378974,15.95,64.23,Ngang Ka,966.3
,82.1139649,27.4379582,14.9,62.91,Ngang Ka,969.9
2014-08-01 06:42:43.000,82.1140881,27.4380211,13.67,58.33,Ngang Ka,972.8
2014-08-01 06:42:44.000,82.1141907,27.4380927,12.54,48.5,Ngang Ka,974.6
2014-08-01 06:42:45.000,82.114263,27.4381765,11.44,32.11,Ngang Ka,975.2
2014-08-01 06:42:46.000,82.1143013,27.438272,11.35,13.76,Ngang Ka,975.8
2014-08-01 06:42:47.000,82.11431,27.4383692,10.8,0.66,Ngang Ka,977.7
2014-08-01 06:42:48.000,82.1142962,27.4384518,8.76,346.69,Ngang Ka,980.6
2014-08-01 06:42:49.000,82.1142637,27.4385091,6.63,325.71,Ngang Ka,983.6
2014-08-01 06:42:50.000,82.1142176,27.4385368,5.34,292.95,Ngang Ka,985.9`;

export const tripCsvDataInfo = {
  id: 'trip_csv_data',
  label: 'Trip Csv Data',
  color: [100, 100, 100]
};

// test first 2
export const expectedCoordinates = [
  [90.2266981, 27.6162803, 3217, '2014-08-01 00:00:23.000'],
  [90.2267115, 27.6162102, 3209.1, '2014-08-01 00:20:07.000']
];
expectedCoordinates[0].datumIndex = 0;
expectedCoordinates[0].datum = [
  '2014-08-01 00:00:23.000',
  90.2266981,
  27.6162803,
  0.22,
  0,
  'Thuub',
  3217
];

expectedCoordinates[1].datumIndex = 2;
expectedCoordinates[1].datum = [
  '2014-08-01 00:20:07.000',
  90.2267115,
  27.6162102,
  0.27,
  110.1,
  'Thuub',
  3209.1
];

export const expectedTripLayerConfig = {
  id: 'dont_test_me',
  type: 'trip',
  config: {
    dataId: 'trip_csv_data',
    columnMode: 'table',
    label: 'location',
    color: [130, 154, 227],
    columns: {
      id: 'name',
      lat: 'location-lat',
      lng: 'location-lng',
      timestamp: 'timestamp',
      altitude: 'location-alt'
    },
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      thickness: 2,
      colorRange: DEFAULT_COLOR_RANGE,
      trailLength: 180,
      fadeTrail: true,
      billboard: false,
      sizeRange: [0, 10]
    },
    hidden: false,
    textLabel: [DEFAULT_TEXT_LABEL]
  },
  visualChannels: {
    colorField: {
      name: 'ground-speed',
      type: 'real'
    },
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear'
  }
};
export default gps;
