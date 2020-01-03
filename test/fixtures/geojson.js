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

export const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        OBJECTID: 1,
        ZIP_CODE: 94107,
        ID: 94107,
        TRIPS: 11,
        RATE: 'a'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.401159718585049, 37.782024266952142],
            [-122.400374366843309, 37.782644515545172],
            [-122.400019020063766, 37.782925153640136],
            [-122.399891477967842, 37.783025880124256],
            [-122.398930331092998, 37.783784933304034],
            [-122.397811613142864, 37.784666586003652],
            [-122.396705177550587, 37.785542130425938],
            [-122.395895701657864, 37.784896929203114],
            [-122.395160622349934, 37.78431101230386],
            [-122.394398389309941, 37.783701667981575],
            [-122.401159718585049, 37.782024266952142]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        OBJECTID: 2,
        ZIP_CODE: 94105,
        ID: 94105,
        TRIPS: 4,
        RATE: 'b'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        OBJECTID: 3,
        ZIP_CODE: 94109,
        ID: 94109,
        TRIPS: 20
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        OBJECTID: 4,
        ZIP_CODE: 94111,
        ID: 94111,
        RATE: 'c'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    }
  ]
};

export const geoJsonDataId = 'ieukmgne';

export const fields = [
  {
    type: 'geojson',
    name: '_geojson',
    format: '',
    tableFieldIndex: 1,
    analyzerType: 'GEOMETRY'
  },
  {
    type: 'integer',
    name: 'OBJECTID',
    format: '',
    tableFieldIndex: 2,
    analyzerType: 'INT'
  },
  {
    type: 'integer',
    name: 'ZIP_CODE',
    format: '',
    tableFieldIndex: 3,
    analyzerType: 'INT'
  },
  {
    type: 'integer',
    name: 'ID',
    format: '',
    tableFieldIndex: 4,
    analyzerType: 'INT'
  },
  {
    type: 'integer',
    name: 'TRIPS',
    format: '',
    tableFieldIndex: 5,
    analyzerType: 'INT'
  },
  {
    type: 'string',
    name: 'RATE',
    format: '',
    tableFieldIndex: 6,
    analyzerType: 'STRING'
  }
];

export const datasetFields = fields.map(f => ({
  ...f,
  id: f.name
}));

export const rows = [
  [
    {
      type: 'Feature',
      properties: {
        OBJECTID: 1,
        ZIP_CODE: 94107,
        ID: 94107,
        TRIPS: 11,
        RATE: 'a'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.401159718585049, 37.782024266952142],
            [-122.400374366843309, 37.782644515545172],
            [-122.400019020063766, 37.782925153640136],
            [-122.399891477967842, 37.783025880124256],
            [-122.398930331092998, 37.783784933304034],
            [-122.397811613142864, 37.784666586003652],
            [-122.396705177550587, 37.785542130425938],
            [-122.395895701657864, 37.784896929203114],
            [-122.395160622349934, 37.78431101230386],
            [-122.394398389309941, 37.783701667981575],
            [-122.401159718585049, 37.782024266952142]
          ]
        ]
      }
    },
    1,
    94107,
    94107,
    11,
    'a'
  ],
  [
    {
      type: 'Feature',
      properties: {
        OBJECTID: 2,
        ZIP_CODE: 94105,
        ID: 94105,
        TRIPS: 4,
        RATE: 'b'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    },
    2,
    94105,
    94105,
    4,
    'b'
  ],
  [
    {
      type: 'Feature',
      properties: {
        OBJECTID: 3,
        ZIP_CODE: 94109,
        ID: 94109,
        TRIPS: 20
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    },
    3,
    94109,
    94109,
    20,
    null
  ],
  [
    {
      type: 'Feature',
      properties: {
        OBJECTID: 4,
        ZIP_CODE: 94111,
        ID: 94111,
        RATE: 'c'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.39249932896719, 37.793768814133983],
            [-122.391890260341384, 37.794278544568918],
            [-122.391788865572423, 37.794170982455135],
            [-122.39173429034625, 37.79420276052317],
            [-122.391666728649753, 37.794132425256194],
            [-122.391723034266192, 37.79410061945832],
            [-122.391673228351905, 37.794047854124599],
            [-122.391982015107928, 37.793871906128679],
            [-122.39249932896719, 37.793768814133983]
          ]
        ]
      }
    },
    4,
    94111,
    94111,
    null,
    'c'
  ]
];

// add index to properties
export const datasetAllData = rows.map((row, index) =>
  row.map((cell, i) =>
    i === 0
      ? {
          ...cell,
          properties: {
            ...cell.properties,
            index
          }
        }
      : cell
  )
);

export const geoJsonTripHistogram = [
  {count: 1, x0: 4, x1: 4.5},
  {count: 0, x0: 4.5, x1: 5},
  {count: 0, x0: 5, x1: 5.5},
  {count: 0, x0: 5.5, x1: 6},
  {count: 0, x0: 6, x1: 6.5},
  {count: 0, x0: 6.5, x1: 7},
  {count: 0, x0: 7, x1: 7.5},
  {count: 0, x0: 7.5, x1: 8},
  {count: 0, x0: 8, x1: 8.5},
  {count: 0, x0: 8.5, x1: 9},
  {count: 0, x0: 9, x1: 9.5},
  {count: 0, x0: 9.5, x1: 10},
  {count: 0, x0: 10, x1: 10.5},
  {count: 0, x0: 10.5, x1: 11},
  {count: 1, x0: 11, x1: 11.5},
  {count: 0, x0: 11.5, x1: 12},
  {count: 0, x0: 12, x1: 12.5},
  {count: 0, x0: 12.5, x1: 13},
  {count: 0, x0: 13, x1: 13.5},
  {count: 0, x0: 13.5, x1: 14},
  {count: 0, x0: 14, x1: 14.5},
  {count: 0, x0: 14.5, x1: 15},
  {count: 0, x0: 15, x1: 15.5},
  {count: 0, x0: 15.5, x1: 16},
  {count: 0, x0: 16, x1: 16.5},
  {count: 0, x0: 16.5, x1: 17},
  {count: 0, x0: 17, x1: 17.5},
  {count: 0, x0: 17.5, x1: 18},
  {count: 0, x0: 18, x1: 18.5},
  {count: 0, x0: 18.5, x1: 19},
  {count: 0, x0: 19, x1: 19.5},
  {count: 0, x0: 19.5, x1: 20},
  {count: 1, x0: 20, x1: 20}
];

export const geoJsonTripHistogramEnlarged = [
  {count: 1, x0: 4, x1: 4.2},
  {count: 0, x0: 4.2, x1: 4.4},
  {count: 0, x0: 4.4, x1: 4.6},
  {count: 0, x0: 4.6, x1: 4.8},
  {count: 0, x0: 4.8, x1: 5},
  {count: 0, x0: 5, x1: 5.2},
  {count: 0, x0: 5.2, x1: 5.4},
  {count: 0, x0: 5.4, x1: 5.6},
  {count: 0, x0: 5.6, x1: 5.8},
  {count: 0, x0: 5.8, x1: 6},
  {count: 0, x0: 6, x1: 6.2},
  {count: 0, x0: 6.2, x1: 6.4},
  {count: 0, x0: 6.4, x1: 6.6},
  {count: 0, x0: 6.6, x1: 6.8},
  {count: 0, x0: 6.8, x1: 7},
  {count: 0, x0: 7, x1: 7.2},
  {count: 0, x0: 7.2, x1: 7.4},
  {count: 0, x0: 7.4, x1: 7.6},
  {count: 0, x0: 7.6, x1: 7.8},
  {count: 0, x0: 7.8, x1: 8},
  {count: 0, x0: 8, x1: 8.2},
  {count: 0, x0: 8.2, x1: 8.4},
  {count: 0, x0: 8.4, x1: 8.6},
  {count: 0, x0: 8.6, x1: 8.8},
  {count: 0, x0: 8.8, x1: 9},
  {count: 0, x0: 9, x1: 9.2},
  {count: 0, x0: 9.2, x1: 9.4},
  {count: 0, x0: 9.4, x1: 9.6},
  {count: 0, x0: 9.6, x1: 9.8},
  {count: 0, x0: 9.8, x1: 10},
  {count: 0, x0: 10, x1: 10.2},
  {count: 0, x0: 10.2, x1: 10.4},
  {count: 0, x0: 10.4, x1: 10.6},
  {count: 0, x0: 10.6, x1: 10.8},
  {count: 0, x0: 10.8, x1: 11},
  {count: 1, x0: 11, x1: 11.2},
  {count: 0, x0: 11.2, x1: 11.4},
  {count: 0, x0: 11.4, x1: 11.6},
  {count: 0, x0: 11.6, x1: 11.8},
  {count: 0, x0: 11.8, x1: 12},
  {count: 0, x0: 12, x1: 12.2},
  {count: 0, x0: 12.2, x1: 12.4},
  {count: 0, x0: 12.4, x1: 12.6},
  {count: 0, x0: 12.6, x1: 12.8},
  {count: 0, x0: 12.8, x1: 13},
  {count: 0, x0: 13, x1: 13.2},
  {count: 0, x0: 13.2, x1: 13.4},
  {count: 0, x0: 13.4, x1: 13.6},
  {count: 0, x0: 13.6, x1: 13.8},
  {count: 0, x0: 13.8, x1: 14},
  {count: 0, x0: 14, x1: 14.2},
  {count: 0, x0: 14.2, x1: 14.4},
  {count: 0, x0: 14.4, x1: 14.6},
  {count: 0, x0: 14.6, x1: 14.8},
  {count: 0, x0: 14.8, x1: 15},
  {count: 0, x0: 15, x1: 15.2},
  {count: 0, x0: 15.2, x1: 15.4},
  {count: 0, x0: 15.4, x1: 15.6},
  {count: 0, x0: 15.6, x1: 15.8},
  {count: 0, x0: 15.8, x1: 16},
  {count: 0, x0: 16, x1: 16.2},
  {count: 0, x0: 16.2, x1: 16.4},
  {count: 0, x0: 16.4, x1: 16.6},
  {count: 0, x0: 16.6, x1: 16.8},
  {count: 0, x0: 16.8, x1: 17},
  {count: 0, x0: 17, x1: 17.2},
  {count: 0, x0: 17.2, x1: 17.4},
  {count: 0, x0: 17.4, x1: 17.6},
  {count: 0, x0: 17.6, x1: 17.8},
  {count: 0, x0: 17.8, x1: 18},
  {count: 0, x0: 18, x1: 18.2},
  {count: 0, x0: 18.2, x1: 18.4},
  {count: 0, x0: 18.4, x1: 18.6},
  {count: 0, x0: 18.6, x1: 18.8},
  {count: 0, x0: 18.8, x1: 19},
  {count: 0, x0: 19, x1: 19.2},
  {count: 0, x0: 19.2, x1: 19.4},
  {count: 0, x0: 19.4, x1: 19.6},
  {count: 0, x0: 19.6, x1: 19.8},
  {count: 0, x0: 19.8, x1: 20},
  {count: 1, x0: 20, x1: 20}
];

export const geoJsonTripFilterProps = {
  domain: [4, 20],
  fieldType: 'integer',
  histogram: geoJsonTripHistogram,
  enlargedHistogram: geoJsonTripHistogramEnlarged,
  step: 0.01,
  type: 'range',
  typeOptions: ['range'],
  value: [4, 20]
};

export const mergedTripFilter = {
  ...geoJsonTripFilterProps,
  dataId: [geoJsonDataId],
  freeze: true,
  id: 'TRIPS-3',
  fixedDomain: false,
  enlarged: false,
  isAnimating: false,
  speed: 1,
  name: ['TRIPS'],
  fieldIdx: [4],
  value: [4, 12],
  plotType: 'histogram',
  yAxis: null,
  interval: null
};

export const geoJsonRateFilterProps = {
  domain: ['a', 'b', 'c'],
  fieldType: 'string',
  type: 'multiSelect',
  value: []
};

export const mergedRateFilter = {
  ...geoJsonRateFilterProps,
  name: ['RATE'],
  dataId: [geoJsonDataId],
  freeze: true,
  id: 'RATE-1',
  fixedDomain: false,
  enlarged: false,
  isAnimating: false,
  speed: 1,
  fieldIdx: [5],
  value: ['a'],
  plotType: 'histogram',
  yAxis: null,
  interval: null
};

export const geoBounds = [
  -122.40115971858505,
  37.78202426695214,
  -122.39166672864975,
  37.79427854456892
];

export const geoJsonWithStyle = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        fillColor: [1, 2, 3],
        lineColor: [4, 5, 6],
        lineWidth: 1,
        elevation: 10,
        radius: 5
      },
      geometry: {type: 'Point', coordinates: [[-122, 37]]}
    },
    {
      type: 'Feature',
      properties: {
        fillColor: [7, 8, 9],
        lineColor: [4, 5, 6],
        lineWidth: 3,
        elevation: 10,
        radius: 5
      },
      geometry: {type: 'Point', coordinates: [[-122, 37]]}
    },
    {
      type: 'Feature',
      properties: {
        fillColor: [1, 2, 3],
        lineColor: [4, 5, 6],
        lineWidth: 4,
        elevation: 10,
        radius: 5
      },
      geometry: {type: 'Point', coordinates: [[-122, 37]]}
    }
  ]
};

// parsed fields and rows
export const geoStyleFields = [
  {
    name: '_geojson',
    format: '',
    tableFieldIndex: 1,
    type: 'geojson',
    analyzerType: 'GEOMETRY'
  },
  {
    name: 'fillColor',
    format: '',
    tableFieldIndex: 2,
    type: 'geojson',
    analyzerType: 'ARRAY'
  },
  {
    name: 'lineColor',
    format: '',
    tableFieldIndex: 3,
    type: 'geojson',
    analyzerType: 'ARRAY'
  },
  {
    name: 'lineWidth',
    format: '',
    tableFieldIndex: 4,
    type: 'integer',
    analyzerType: 'INT'
  },
  {
    name: 'elevation',
    format: '',
    tableFieldIndex: 5,
    type: 'integer',
    analyzerType: 'INT'
  },
  {
    name: 'radius',
    format: '',
    tableFieldIndex: 6,
    type: 'integer',
    analyzerType: 'INT'
  }
];

export const geoStyleRows = [
  [geoJsonWithStyle.features[0], [1, 2, 3], [4, 5, 6], 1, 10, 5],
  [geoJsonWithStyle.features[1], [7, 8, 9], [4, 5, 6], 3, 10, 5],
  [geoJsonWithStyle.features[2], [1, 2, 3], [4, 5, 6], 4, 10, 5]
];
