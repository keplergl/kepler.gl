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

import {extent} from 'd3-array';

const feature0 = {
  type: 'Feature',
  properties: {
    OBJECTID: 1,
    ZIP_CODE: 94107,
    ID: 94107,
    TRIPS: 11,
    RATE: 'a',
    OBJ: {
      id: 1
    }
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.401159718585049, 37.782024266952142],
        [-122.400374366843309, 37.782644515545172],
        [-122.400019020063766, 37.782925153640136],
        [-122.399891477967842, 37.783025880124256],
        [-122.398930331092998, 37.783784933304034]
      ]
    ]
  }
};
const feature0Parsed = {
  type: 'Feature',
  geometry: feature0.geometry,
  properties: {
    ...feature0.properties,
    OBJ: '{"id":1}'
  }
};
const feature1 = {
  type: 'Feature',
  properties: {
    OBJECTID: 2,
    ZIP_CODE: 94105,
    ID: 94105,
    TRIPS: 4,
    RATE: 'b',
    OBJ: {
      id: 2
    }
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.39249932896719, 37.793768814133983],
        [-122.391890260341384, 37.794278544568918],
        [-122.391666728649753, 37.794132425256194],
        [-122.391723034266192, 37.79410061945832],
        [-122.39249932896719, 37.793768814133983]
      ]
    ]
  }
};
const feature1Parsed = {
  type: 'Feature',
  geometry: feature1.geometry,
  properties: {
    ...feature1.properties,
    OBJ: '{"id":2}'
  }
};
const feature2 = {
  type: 'Feature',
  properties: {
    OBJECTID: 3,
    ZIP_CODE: 94109,
    ID: 94109,
    TRIPS: 20,
    RATE: null,
    OBJ: {
      id: 3
    }
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.39249932896719, 37.793768814133983],
        [-122.391890260341384, 37.794278544568918],
        [-122.391982015107928, 37.793871906128679],
        [-122.39249932896719, 37.793768814133983]
      ]
    ]
  }
};
const feature2Parsed = {
  type: 'Feature',
  geometry: feature2.geometry,
  properties: {
    ...feature2.properties,
    OBJ: '{"id":3}'
  }
};

const feature3 = {
  type: 'Feature',
  properties: {
    OBJECTID: 4,
    ZIP_CODE: 94111,
    ID: 9411,
    RATE: 'c',
    OBJ: {
      id: 4
    }
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.39249932896719, 37.793768814133983],
        [-122.391666728649753, 37.794132425256194],
        [-122.391723034266192, 37.79410061945832],
        [-122.391673228351905, 37.794047854124599],
        [-122.391982015107928, 37.793871906128679],
        [-122.39249932896719, 37.793768814133983]
      ]
    ]
  }
};
const feature3Parsed = {
  type: 'Feature',
  geometry: feature3.geometry,
  properties: {
    ...feature3.properties,
    TRIPS: null,
    OBJ: '{"id":4}'
  }
};
const feature4 = {
  type: 'Feature',
  properties: {
    OBJECTID: 5,
    ZIP_CODE: 74107,
    ID: 9409,
    RATE: 'c',
    OBJ: {
      id: 5
    }
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.39249932896719, 37.793768814133983],
        [-122.391890260341384, 37.794278544568918],
        [-122.391788865572423, 37.794170982455135],
        [-122.39249932896719, 37.793768814133983]
      ]
    ]
  }
}
const feature4Parsed = {
  type: 'Feature',
  geometry: feature4.geometry,
  properties: {
    ...feature4.properties,
    TRIPS: null,
    OBJ: '{"id":5}'
  }
};
export const geojsonData = {
  type: 'FeatureCollection',
  features: [
    feature0,
    feature1,
    feature2,
    feature3,
    feature4
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
  },
  {
    type: 'string',
    name: 'OBJ',
    format: '',
    tableFieldIndex: 7
  }
];

export const rows = [
  [
    feature0Parsed,
    1,
    94107,
    94107,
    11,
    'a',
    '{"id":1}'
  ],
  [
    feature1Parsed,
    2,
    94105,
    94105,
    4,
    'b',
    '{"id":2}'
  ],
  [
    feature2,
    3,
    94109,
    94109,
    20,
    null,
    '{"id":3}'
  ],
  [
    feature3Parsed,
    4,
    94111,
    9411,
    null,
    'c',
    '{"id":4}'
  ],
  [
    feature4Parsed,
    5,
    74107,
    9409,
    null,
    'c',
    '{"id":5}'
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

export const expectedDataToFeature = [
  feature0Parsed,
  feature1Parsed,
  feature2Parsed,
  feature3Parsed,
  feature4Parsed
].reduce(
  (accu, f, i) => ({
    ...accu,
    [i]: {
      ...f,
      properties: {...f.properties, index: i}
    }
  }),
  {}
);

export const updatedGeoJsonLayer = {
  dataToFeature: expectedDataToFeature,
  meta: {
    featureTypes: {polygon: true},
    bounds: geoBounds,
    lightSettings: geoLightSettings,
    fixedRadius: false
  }
};
export const mappedTripValue = geojsonData.features.map(f => f.properties.TRIPS);
export const tripDomain = extent(mappedTripValue);
