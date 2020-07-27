// Copyright (c) 2020 Uber Technologies, Inc.
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

export const tripDataInfo = {
  id: 'trip_data',
  label: 'Trip Data'
};

const tripGeoJson = {
  type: 'FeatureCollection',
  features: [
    // 0
    {
      type: 'Feature',
      properties: {vendor: 'A', types: 'driver_analytics_0', trip_distance: 1.59},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.78966, 40.6429, 0, 1565578338],
          [-73.7895, 40.64267, 0, 1565578346],
          [-73.78923, 40.6424, 0, 1565578356],
          [-73.78905, 40.64222, 0, 1565578364],
          [-73.7889, 40.64209, 0, 1565578365],
          [-73.78859, 40.64191, 0, 1565578367],
          [-73.78836, 40.64181, 0, 1565578368],
          [-73.78793, 40.6417, 0, 1565578371],
          [-73.78756, 40.64163, 0, 1565578373],
          [-73.78707, 40.64159, 0, 1565578375]
        ]
      }
    },
    // 1
    {
      type: 'Feature',
      properties: {vendor: 'B', value: 4, trip_distance: 2.38},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.33223, 40.64375, 0, 1565578213],
          [-74.33242, 40.64353, 0, 1565578217],
          [-74.33001, 40.64222, 0, 1565578243],
          [-74.32882, 40.64154, 0, 1565578256],
          [-74.32682, 40.64039, 0, 1565578278],
          [-74.32589, 40.63985, 0, 1565578288],
          [-74.31725, 40.63485, 0, 1565578382],
          [-74.31404, 40.63302, 0, 1565578417],
          [-74.30616, 40.6283, 0, 1565578504]
        ]
      }
    },
    // 2
    {
      type: 'Feature',
      properties: {vendor: 'A', value: 7, types: 'driver_analytics', trip_distance: 2.83},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.87893, 40.64672, 0, 1565578095],
          [-73.87969, 40.64624, 0, 1565578123],
          [-73.87976, 40.64619, 0, 1565578125],
          [-73.88064, 40.64697, 0, 1565578156],
          [-73.88138, 40.64765, 0, 1565578181],
          [-73.88234, 40.64849, 0, 1565578214],
          [-73.883, 40.64911, 0, 1565578237],
          [-73.88338, 40.64943, 0, 1565578250]
        ]
      }
    },
    // 3
    {
      type: 'Feature',
      properties: {vendor: 'A', value: 11, types: 'driver_gps', trip_distance: 8.33},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.18532, 40.69402, 0, 1565577961],
          [-74.18499, 40.6945, 0, 1565577967],
          [-74.18472, 40.69501, 0, 1565577973],
          [-74.1846, 40.69533, 0, 1565577976],
          [-74.18415, 40.69665, 0, 1565577991],
          [-74.18391, 40.6975, 0, 1565578000],
          [-74.18372, 40.6983, 0, 1565578008],
          [-74.18364, 40.69882, 0, 1565578014],
          [-74.18354, 40.6994, 0, 1565578018]
        ]
      }
    },
    // 4
    {
      type: 'Feature',
      properties: {vendor: 'A', value: 6, types: 'driver_analytics', trip_distance: 2.37},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.97301, 40.67601, 0, 1565578666],
          [-73.97161, 40.67546, 0, 1565578694],
          [-73.97142, 40.67575, 0, 1565578712],
          [-73.9719, 40.67641, 0, 1565578732],
          [-73.97244, 40.67716, 0, 1565578756],
          [-73.97234, 40.67744, 0, 1565578778],
          [-73.96917, 40.67678, 0, 1565578836]
        ]
      }
    },
    // 5
    {
      type: 'Feature',
      properties: {vendor: 'A', value: 1, types: 'driver_analytics', trip_distance: 7.13},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.03806, 40.74578, 0, 1565578252],
          [-74.03893, 40.74289, 0, 1565578322],
          [-74.03934, 40.74158, 0, 1565578354],
          [-74.0384, 40.74142, 0, 1565578376],
          [-74.03746, 40.74126, 0, 1565578399],
          [-74.03824, 40.73872, 0, 1565578465],
          [-74.03878, 40.73693, 0, 1565578511],
          [-74.03893, 40.73693, 0, 1565578513],
          [-74.03974, 40.73704, 0, 1565578524],
          [-74.03979, 40.7369, 0, 1565578528],
          [-74.03964, 40.73677, 0, 1565578531]
        ]
      }
    },
    // 6
    {
      type: 'Feature',
      properties: {vendor: 'B', value: 7, types: 'driver_analytics', trip_distance: 3.22},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.79007, 40.64681, 0, 1565577697],
          [-73.79092, 40.64643, 0, 1565577720],
          [-73.79108, 40.64631, 0, 1565577726],
          [-73.7912, 40.64613, 0, 1565577732],
          [-73.79121, 40.64597, 0, 1565577737],
          [-73.79116, 40.64581, 0, 1565577743],
          [-73.79106, 40.6457, 0, 1565577747],
          [-73.79094, 40.64557, 0, 1565577749],
          [-73.79072, 40.64542, 0, 1565577751],
          [-73.79057, 40.64534, 0, 1565577753]
        ]
      }
    },
    // 7
    {
      type: 'Feature',
      properties: {vendor: 'A', value: 15, types: 'driver_analytics', trip_distance: 11},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.87815, 40.88362, 0, 1565577773],
          [-73.87772, 40.88345, 0, 1565577786],
          [-73.87812, 40.88215, 0, 1565577814],
          [-73.87467, 40.88156, 0, 1565577872],
          [-73.87479, 40.88007, 0, 1565577904],
          [-73.87494, 40.87994, 0, 1565577907],
          [-73.87307, 40.88013, 0, 1565577938],
          [-73.87191, 40.88023, 0, 1565577957],
          [-73.87254, 40.87874, 0, 1565577974],
          [-73.87159, 40.87864, 0, 1565577993],
          [-73.87133, 40.8786, 0, 1565577999],
          [-73.87046, 40.87838, 0, 1565578017],
          [-73.87029, 40.87834, 0, 1565578020]
        ]
      }
    },
    // 8
    {
      type: 'Feature',
      properties: {vendor: 'A', types: 'driver_analytics', trip_distance: 4.12},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.00227, 40.62526, 0, 1565577261],
          [-74.00272, 40.62482, 0, 1565577277],
          [-74.00052, 40.62348, 0, 1565577315],
          [-74.01522, 40.60935, 0, 1565577685],
          [-74.01697, 40.60769, 0, 1565577728],
          [-74.01623, 40.60723, 0, 1565577750],
          [-74.01549, 40.60684, 0, 1565577771],
          [-74.0173, 40.60513, 0, 1565577796],
          [-74.01746, 40.60496, 0, 1565577799],
          [-74.01788, 40.60471, 0, 1565577802],
          [-74.01826, 40.60455, 0, 1565577805],
          [-74.01855, 40.6044, 0, 1565577807],
          [-74.01874, 40.60428, 0, 1565577809]
        ]
      }
    }
  ]
};

const fts = tripGeoJson.features;
export const dataToFeature = [
  {
    type: 'Feature',
    properties: {...fts[0].properties, value: null, index: 0},
    geometry: fts[0].geometry
  },
  {
    type: 'Feature',
    properties: {...fts[1].properties, types: null, index: 1},
    geometry: fts[1].geometry
  },
  {type: 'Feature', properties: {...fts[2].properties, index: 2}, geometry: fts[2].geometry},
  {type: 'Feature', properties: {...fts[3].properties, index: 3}, geometry: fts[3].geometry},
  {type: 'Feature', properties: {...fts[4].properties, index: 4}, geometry: fts[4].geometry},
  {type: 'Feature', properties: {...fts[5].properties, index: 5}, geometry: fts[5].geometry},
  {type: 'Feature', properties: {...fts[6].properties, index: 6}, geometry: fts[6].geometry},
  {type: 'Feature', properties: {...fts[7].properties, index: 7}, geometry: fts[7].geometry},
  {
    type: 'Feature',
    properties: {...fts[8].properties, value: null, index: 8},
    geometry: fts[8].geometry
  }
];

export const dataToTimeStamp = [
  [
    1565578338000,
    1565578346000,
    1565578356000,
    1565578364000,
    1565578365000,
    1565578367000,
    1565578368000,
    1565578371000,
    1565578373000,
    1565578375000
  ],
  [
    1565578213000,
    1565578217000,
    1565578243000,
    1565578256000,
    1565578278000,
    1565578288000,
    1565578382000,
    1565578417000,
    1565578504000
  ],
  [
    1565578095000,
    1565578123000,
    1565578125000,
    1565578156000,
    1565578181000,
    1565578214000,
    1565578237000,
    1565578250000
  ],
  [
    1565577961000,
    1565577967000,
    1565577973000,
    1565577976000,
    1565577991000,
    1565578000000,
    1565578008000,
    1565578014000,
    1565578018000
  ],
  [
    1565578666000,
    1565578694000,
    1565578712000,
    1565578732000,
    1565578756000,
    1565578778000,
    1565578836000
  ],
  [
    1565578252000,
    1565578322000,
    1565578354000,
    1565578376000,
    1565578399000,
    1565578465000,
    1565578511000,
    1565578513000,
    1565578524000,
    1565578528000,
    1565578531000
  ],
  [
    1565577697000,
    1565577720000,
    1565577726000,
    1565577732000,
    1565577737000,
    1565577743000,
    1565577747000,
    1565577749000,
    1565577751000,
    1565577753000
  ],
  [
    1565577773000,
    1565577786000,
    1565577814000,
    1565577872000,
    1565577904000,
    1565577907000,
    1565577938000,
    1565577957000,
    1565577974000,
    1565577993000,
    1565577999000,
    1565578017000,
    1565578020000
  ],
  [
    1565577261000,
    1565577277000,
    1565577315000,
    1565577685000,
    1565577728000,
    1565577750000,
    1565577771000,
    1565577796000,
    1565577799000,
    1565577802000,
    1565577805000,
    1565577807000,
    1565577809000
  ]
];
export const timeStampDomain = [1565577261000, 1565578836000];
export const tripBounds = [-74.33242, 40.60428, -73.78707, 40.88362];
export const valueDomain = [1, 15];

export const TripLayerMeta = {
  bounds: tripBounds,
  featureTypes: {line: true},
  getFeature: 'test separate'
};

export default tripGeoJson;
