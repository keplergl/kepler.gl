// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {extent} from 'd3-array';
import {histogramFromDomain} from '@kepler.gl/utils';
import {BINS} from '@kepler.gl/constants';

export const geoJsonDataId = 'ieukmgne';

/**
 *
 * GeoJSON with Polygons
 */
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
    OBJ: {id: 1}
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
    OBJ: {id: 2}
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
    OBJ: {id: 3}
  }
};

const feature3 = {
  type: 'Feature',
  properties: {
    OBJECTID: 4,
    ZIP_CODE: 94111,
    ID: 94111,
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
    OBJ: {id: 4}
  }
};

const feature4 = {
  type: 'Feature',
  properties: {
    OBJECTID: 5,
    ZIP_CODE: 94107,
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
};

const feature4Parsed = {
  type: 'Feature',
  geometry: feature4.geometry,
  properties: {
    ...feature4.properties,
    TRIPS: null,
    OBJ: {id: 5}
  }
};

export const geojsonData = {
  type: 'FeatureCollection',
  features: [feature0, feature1, feature2, feature3, feature4]
};

export const fields = [
  {
    type: 'geojson',
    name: '_geojson',
    id: '_geojson',
    displayName: '_geojson',
    format: '',
    fieldIdx: 0,
    analyzerType: 'GEOMETRY',
    valueAccessor: values => values[0]
  },
  {
    type: 'integer',
    name: 'OBJECTID',
    id: 'OBJECTID',
    displayName: 'OBJECTID',
    format: '',
    fieldIdx: 1,
    analyzerType: 'INT',
    valueAccessor: values => values[1]
  },
  {
    type: 'integer',
    name: 'ZIP_CODE',
    id: 'ZIP_CODE',
    displayName: 'ZIP_CODE',
    format: '',
    fieldIdx: 2,
    analyzerType: 'INT',
    valueAccessor: values => values[2]
  },
  {
    type: 'integer',
    name: 'ID',
    id: 'ID',
    displayName: 'ID',
    format: '',
    fieldIdx: 3,
    analyzerType: 'INT',
    valueAccessor: values => values[3]
  },
  {
    type: 'integer',
    name: 'TRIPS',
    id: 'TRIPS',
    displayName: 'TRIPS',
    format: '',
    fieldIdx: 4,
    analyzerType: 'INT',
    valueAccessor: values => values[4]
  },
  {
    type: 'string',
    name: 'RATE',
    id: 'RATE',
    displayName: 'RATE',
    format: '',
    fieldIdx: 5,
    analyzerType: 'STRING',
    valueAccessor: values => values[5]
  },
  {
    type: 'object',
    name: 'OBJ',
    id: 'OBJ',
    displayName: 'OBJ',
    format: '',
    fieldIdx: 6,
    analyzerType: 'OBJECT',
    valueAccessor: values => values[6]
  }
];

export const rows = [
  [feature0Parsed, 1, 94107, 94107, 11, 'a', {id: 1}],
  [feature1Parsed, 2, 94105, 94105, 4, 'b', {id: 2}],
  [feature2Parsed, 3, 94109, 94109, 20, null, {id: 3}],
  [feature3Parsed, 4, 94111, 94111, null, 'c', {id: 4}],
  [feature4Parsed, 5, 94107, 9409, null, 'c', {id: 5}]
];

// add index to properties
export const datasetAllData = rows;

export const geoJsonTripFilterProps = {
  domain: [4, 20],
  fieldType: 'integer',
  step: 0.01,
  type: 'range',
  typeOptions: ['range'],
  value: [4, 20],
  gpu: true,
  view: 'side'
};

export const mergedTripFilter = {
  ...geoJsonTripFilterProps,
  animationWindow: 'free',
  dataId: [geoJsonDataId],
  id: 'TRIPS-3',
  enabled: true,
  fixedDomain: false,
  view: 'side',
  isAnimating: false,
  speed: 1,
  name: ['TRIPS'],
  fieldIdx: [4],
  value: [4, 12],
  plotType: {type: 'histogram'},
  yAxis: null,
  gpuChannel: [0],
  bins: {
    [geoJsonDataId]: histogramFromDomain(
      [4, 20],
      rows.map(r => r[4]),
      BINS
    )
  }
};

export const geoJsonRateFilterProps = {
  domain: ['a', 'b', 'c'],
  fieldType: 'string',
  type: 'multiSelect',
  value: [],
  gpu: false,
  view: 'side'
};

export const mergedRateFilter = {
  ...geoJsonRateFilterProps,
  animationWindow: 'free',
  name: ['RATE'],
  dataId: [geoJsonDataId],
  id: 'RATE-1',
  enabled: true,
  fixedDomain: false,
  view: 'side',
  isAnimating: false,
  speed: 1,
  fieldIdx: [5],
  value: ['a'],
  plotType: {
    type: 'histogram'
  },
  yAxis: null
};

export const geoBounds = [
  -122.40115971858505, 37.78202426695214, -122.39166672864975, 37.79427854456892
];

export const expectedDataToFeature = [
  feature0Parsed,
  feature1Parsed,
  feature2Parsed,
  feature3Parsed,
  feature4Parsed
].map((f, i) => ({
  ...f,
  properties: {...f.properties, index: i}
}));

export const updatedGeoJsonLayer = {
  dataToFeature: expectedDataToFeature,
  meta: {
    featureTypes: {polygon: true},
    bounds: geoBounds,
    fixedRadius: false
  }
};

export const mappedTripValue = geojsonData.features.map(f => f.properties.TRIPS);

export const tripDomain = extent(mappedTripValue);

/**
 * GeoJSON with style properties
 */
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
      geometry: {type: 'Point', coordinates: [-122.1, 37.3]}
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
      geometry: {type: 'Point', coordinates: [-122.2, 37.2]}
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
      geometry: {type: 'Point', coordinates: [-122.3, 37.1]}
    }
  ]
};

// parsed fields and rows
export const geoStyleFields = [
  {
    name: '_geojson',
    id: '_geojson',
    displayName: '_geojson',
    format: '',
    fieldIdx: 0,
    type: 'geojson',
    analyzerType: 'GEOMETRY',
    valueAccessor: values => values[0]
  },
  {
    name: 'fillColor',
    id: 'fillColor',
    displayName: 'fillColor',
    format: '',
    fieldIdx: 1,
    type: 'array',
    analyzerType: 'ARRAY',
    valueAccessor: values => values[1]
  },
  {
    name: 'lineColor',
    id: 'lineColor',
    displayName: 'lineColor',
    format: '',
    fieldIdx: 2,
    type: 'array',
    analyzerType: 'ARRAY',
    valueAccessor: values => values[2]
  },
  {
    name: 'lineWidth',
    id: 'lineWidth',
    displayName: 'lineWidth',
    format: '',
    fieldIdx: 3,
    type: 'integer',
    analyzerType: 'INT',
    valueAccessor: values => values[3]
  },
  {
    name: 'elevation',
    id: 'elevation',
    displayName: 'elevation',
    format: '',
    fieldIdx: 4,
    type: 'integer',
    analyzerType: 'INT',
    valueAccessor: values => values[4]
  },
  {
    name: 'radius',
    id: 'radius',
    displayName: 'radius',
    format: '',
    fieldIdx: 5,
    type: 'integer',
    analyzerType: 'INT',
    valueAccessor: values => values[5]
  }
];

export const geoStyleRows = [
  [geoJsonWithStyle.features[0], [1, 2, 3], [4, 5, 6], 1, 10, 5],
  [geoJsonWithStyle.features[1], [7, 8, 9], [4, 5, 6], 3, 10, 5],
  [geoJsonWithStyle.features[2], [1, 2, 3], [4, 5, 6], 4, 10, 5]
];

export const geoStyleDataToFeature = geoJsonWithStyle.features.map((f, i) => ({
  ...f,
  properties: {...f.properties, index: i}
}));

export const geoStyleBounds = [-122.3, 37.1, -122.1, 37.3];

export const geoStyleMeta = {
  featureTypes: {point: true},
  bounds: geoStyleBounds,
  fixedRadius: true
};
