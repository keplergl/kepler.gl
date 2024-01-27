// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `utc_timestamp,lat,lng,lat_1,lng_1,types,has_result,id,hex_id,trip_distance,icon,s2x
Null,37.778564,-122.39096,37.769897,-122.41168,driver_analytics_0,FALSE,1,89283082c2fffff,1.59,accel,80858004
2016-09-17 00:10:56,37.78824,-122.40894,37.798237,-122.41889,null,FALSE,null,8928308288fffff,2.38,add-person,8085800c
2016-09-17 00:11:56,38.281445,NaN,37.76018,NaN,driver_analytics,FALSE,3,,2.83,alert,
2016-09-17 00:12:58,37.79354,-122.40121,37.37006,-121.96353,driver_gps,FALSE,4,89283082817ffff,8.33,android,80858014
2016-09-17 00:14:00,37.456535,-122.136795,37.418655,-122.149734,driver_analytics,1,5,89283082c3bffff,2.37,,8085801c
2016-09-17 00:15:01,37.40066,-122.10239,37.787052,-122.41089,driver_analytics,FALSE,34,89283082883ffff,7.13,attach,80858024
2016-09-17 00:16:03,Null,-122.42459,Null,-122.40495,driver_analytics,FALSE,222,89283082c33ffff,3.22,,80858034
2016-09-17 00:17:05,37.879066,-122.26108,37.753033,-122.42929,driver_analytics,TRUE,345,89283082c23ffff,11,car-suv,8085803c
2016-09-17 00:18:09,37.775578,-122.39363,37.749577,-122.41829,driver_analytics,FALSE,43,89283082887ffff,4.12,car-taxi,80858044
`;

export const iconGeometry = {
  accel: [1, 2, 3, 4],
  'add-person': [1, 2, 3, 4],
  alert: [1, 2, 3, 4],
  android: [1, 2, 3, 4],
  attach: [1, 2, 3, 4],
  'car-suv': [1, 2, 3, 4],
  'car-taxi': [1, 2, 3, 4]
};

export const bounds = {
  'lat-lng': [-122.42459, 37.40066, -122.10239, 38.281445],
  'lat_1-lng_1': [-122.42929, 37.37006, -121.96353, 37.798237],
  arc: [-122.42929, 37.37006, -121.96353, 38.281445],
  h3: [-122.42488652083654, 37.75385576067885, -122.42073136602062, 37.771654262080524]
};

export const fieldDomain = {
  id: [1, 3, 4, 5, 34, 43, 222, 345]
};
