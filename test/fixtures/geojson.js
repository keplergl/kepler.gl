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
        ID: 9411,
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

export const fields = [
  {
    type: 'geojson',
    name: '_geojson',
    format: '',
    tableFieldIndex: 1
  },
  {
    type: 'integer',
    name: 'OBJECTID',
    format: '',
    tableFieldIndex: 2
  },
  {
    type: 'integer',
    name: 'ZIP_CODE',
    format: '',
    tableFieldIndex: 3
  },
  {
    type: 'integer',
    name: 'ID',
    format: '',
    tableFieldIndex: 4
  },
  {
    type: 'integer',
    name: 'TRIPS',
    format: '',
    tableFieldIndex: 5
  },
  {
    type: 'string',
    name: 'RATE',
    format: '',
    tableFieldIndex: 6
  }
];

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
        ID: 9411,
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
    9411,
    null,
    'c'
  ]
];

export const geoBounds = [
  -122.40115971858505,
  37.78202426695214,
  -122.39166672864975,
  37.79427854456892
];
export const geoLightSettings = {
  lightsPosition: [
    -122.40115971858505,
    37.78202426695214,
    8000,
    -122.39166672864975,
    37.79427854456892,
    8000
  ],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.3,
  lightsStrength: [0.9, 0, 0.8, 0],
  numberOfLights: 2
};
