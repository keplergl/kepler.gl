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

import keyMirror from 'keymirror';
import {EditorModes} from 'react-map-gl-draw';

export const ACTION_PREFIX = '@@kepler.gl/';
export const CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
export const ICON_PREFIX = `${CLOUDFRONT}/geodude`;

// Modal Ids
/**
 * Modal id: data table
 * @constant
 * @type {string}
 * @public
 */
export const DATA_TABLE_ID = 'dataTable';
/**
 * Modal id: delete dataset confirm dialog
 * @constant
 * @type {string}
 * @public
 */
export const DELETE_DATA_ID = 'deleteData';
/**
 * Modal id: add data modal
 * @constant
 * @type {string}
 * @public
 */
export const ADD_DATA_ID = 'addData';
/**
 * Modal id: export image modal
 * @constant
 * @type {string}
 * @public
 */
export const EXPORT_IMAGE_ID = 'exportImage';
/**
 * Modal id: export data modal
 * @constant
 * @type {string}
 * @public
 */
export const EXPORT_DATA_ID = 'exportData';
/**
 * Modal id: add custom map style modal
 * @constant
 * @type {string}
 * @public
 */
export const ADD_MAP_STYLE_ID = 'addMapStyle';
/**
 * Modal id: export map modal
 * @constant
 * @type {string}
 * @public
 */
export const EXPORT_MAP_ID = 'exportMap';

import {
  Layers,
  FilterFunnel,
  Settings,
  CursorClick
} from 'components/common/icons';

export const KEPLER_GL_NAME = 'kepler.gl';

// __PACKAGE_VERSION__ is automatically injected by Babel/Webpack during the building process
// Since we are injecting this during the build process with babel
// while developing VERSION is not defined, we capture the exception and return
// an empty string which will allow us to retrieve the latest umd version
export const KEPLER_GL_VERSION = "__PACKAGE_VERSION__";
export const KEPLER_GL_WEBSITE = 'http://kepler.gl/';

export const DIMENSIONS = {
  sidePanel: {
    width: 300,
    margin: {top: 20, left: 20, bottom: 30, right: 20},
    headerHeight: 96
  },
  mapControl: {
    width: 204,
    padding: 12
  }
};

/**
 * Theme name that can be passed to `KeplerGl` `prop.theme`.
 * Available themes are `Theme.light` and `Theme.dark`. Default theme is `Theme.dark`
 * @constant
 * @type {string}
 * @public
 * @example
 * ```js
 * const Map = () => <KeplerGl theme={THEME.light} id="map"/>
 * ```
 */
export const THEME = keyMirror({
  light: null,
  dark: null
});

export const PANELS = [
  {
    id: 'layer',
    label: 'Layers',
    iconComponent: Layers
  },
  {
    id: 'filter',
    label: 'Filters',
    iconComponent: FilterFunnel
  },
  {
    id: 'interaction',
    label: 'Interactions',
    iconComponent: CursorClick
  },
  {
    id: 'map',
    label: 'Base map',
    iconComponent: Settings
  }
];

// MAP STYLES

export const DEFAULT_LAYER_GROUPS = [
  {
    slug: 'label',
    filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
    defaultVisibility: true
  },
  {
    slug: 'road',
    filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
    defaultVisibility: true
  },
  {
    slug: 'border',
    filter: ({id}) => id.match(/border|boundaries/),
    defaultVisibility: false
  },
  {
    slug: 'building',
    filter: ({id}) => id.match(/building/),
    defaultVisibility: true
  },
  {
    slug: 'water',
    filter: ({id}) => id.match(/(?=(water|stream|ferry))/),
    defaultVisibility: true
  },
  {
    slug: 'land',
    filter: ({id}) => id.match(/(?=(parks|landcover|industrial|sand|hillshade))/),
    defaultVisibility: true
  },
  {
    slug: '3d building',
    filter: () => false,
    defaultVisibility: false
  }
];

export const DEFAULT_MAP_STYLES = [
  {
    id: 'dark',
    label: 'Dark',
    url: 'mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09',
    icon: `${ICON_PREFIX}/UBER_DARK_V2.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'light',
    label: 'Light',
    url: 'mapbox://styles/uberdata/cjoqb9j339k1f2sl9t5ic5bn4',
    icon: `${ICON_PREFIX}/UBER_LIGHT_V2.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'muted',
    label: 'Muted Light',
    url: 'mapbox://styles/uberdata/cjfyl03kp1tul2smf5v2tbdd4',
    icon: `${ICON_PREFIX}/UBER_MUTED_LIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'muted_night',
    label: 'Muted Night',
    url: 'mapbox://styles/uberdata/cjfxhlikmaj1b2soyzevnywgs',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  }
];

export const GEOJSON_FIELDS = {
  geojson: ['_geojson', 'all_points', 'geojson']
};

export const ICON_FIELDS = {
  icon: ['icon']
};

export const TRIP_POINT_FIELDS = [
  ['lat', 'lng'],
  ['lat', 'lon'],
  ['latitude', 'longitude']
];

export const TRIP_ARC_FIELDS = {
  lat0: 'begintrip',
  lng0: 'begintrip',
  lat1: 'dropoff',
  lng1: 'dropoff'
};

export const SCALE_TYPES = keyMirror({
  ordinal: null,
  quantile: null,
  quantize: null,
  linear: null,

  // for radius
  sqrt: null,
  // ordinal domain to linear range
  point: null
});

export const SCALE_FUNC = {
  linear: require('d3-scale').scaleLinear,
  quantize: require('d3-scale').scaleQuantize,
  quantile: require('d3-scale').scaleQuantile,
  ordinal: require('d3-scale').scaleOrdinal,
  sqrt: require('d3-scale').scaleSqrt,
  point: require('d3-scale').scalePoint
};

export const ALL_FIELD_TYPES = keyMirror({
  boolean: null,
  date: null,
  geojson: null,
  integer: null,
  real: null,
  string: null,
  timestamp: null,
  point: null
});

const ORANGE = '248, 194, 28';
const PINK = '231, 189, 194';
const PURPLE = '160, 106, 206';
const BLUE = '140, 210, 205';
const BLUE2 = '106, 160, 206';
const BLUE3 = '0, 172, 237';
const GREEN = '106, 160, 56';
const RED = '237, 88, 106';

export const HIGHLIGH_COLOR_3D = [255, 255, 255, 60];

export const FIELD_COLORS = {
  default: RED
};

export const FILED_TYPE_DISPLAY = {
  [ALL_FIELD_TYPES.boolean]: {
    label: 'bool',
    color: PINK
  },
  [ALL_FIELD_TYPES.date]: {
    label: 'date',
    color: PURPLE
  },
  [ALL_FIELD_TYPES.geojson]: {
    label: 'geo',
    color: BLUE2
  },
  [ALL_FIELD_TYPES.integer]: {
    label: 'int',
    color: ORANGE
  },
  [ALL_FIELD_TYPES.real]: {
    label: 'float',
    color: ORANGE
  },
  [ALL_FIELD_TYPES.string]: {
    label: 'string',
    color: BLUE
  },
  [ALL_FIELD_TYPES.timestamp]: {
    label: 'time',
    color: GREEN
  },
  // field pairs
  [ALL_FIELD_TYPES.point]: {
    label: 'point',
    color: BLUE3
  }
};

export const defaultFormat = d => d;

export const FIELD_DISPLAY_FORMAT = {
  [ALL_FIELD_TYPES.string]: defaultFormat,
  [ALL_FIELD_TYPES.timestamp]: defaultFormat,
  [ALL_FIELD_TYPES.integer]: defaultFormat,
  [ALL_FIELD_TYPES.boolean]: d => String(d),
  [ALL_FIELD_TYPES.date]: defaultFormat,
  [ALL_FIELD_TYPES.geojson]: defaultFormat
};

export const CHANNEL_SCALES = keyMirror({
  color: null,
  radius: null,
  size: null,
  colorAggr: null,
  sizeAggr: null
});

export const AGGREGATION_TYPES = {
  // default
  count: 'count',
  // linear
  average: 'average',
  maximum: 'maximum',
  minimum: 'minimum',
  median: 'median',
  sum: 'sum',
  // ordinal
  mode: 'mode',
  countUnique: 'count unique'
};

export const linearFieldScaleFunctions = {
  [CHANNEL_SCALES.color]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
  [CHANNEL_SCALES.radius]: [SCALE_TYPES.sqrt],
  [CHANNEL_SCALES.size]: [SCALE_TYPES.linear]
};

export const linearFieldAggrScaleFunctions = {
  [CHANNEL_SCALES.colorAggr]: {
    [AGGREGATION_TYPES.average]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
    [AGGREGATION_TYPES.maximum]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
    [AGGREGATION_TYPES.minimum]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
    [AGGREGATION_TYPES.median]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
    [AGGREGATION_TYPES.sum]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile]
  },

  [CHANNEL_SCALES.sizeAggr]: {
    [AGGREGATION_TYPES.average]: [SCALE_TYPES.linear],
    [AGGREGATION_TYPES.maximum]: [SCALE_TYPES.linear],
    [AGGREGATION_TYPES.minimum]: [SCALE_TYPES.linear],
    [AGGREGATION_TYPES.median]: [SCALE_TYPES.linear],
    [AGGREGATION_TYPES.sum]: [SCALE_TYPES.linear]
  }
};

export const ordinalFieldScaleFunctions = {
  [CHANNEL_SCALES.color]: [SCALE_TYPES.ordinal],
  [CHANNEL_SCALES.radius]: [SCALE_TYPES.point],
  [CHANNEL_SCALES.size]: [SCALE_TYPES.point]
};

export const ordinalFieldAggrScaleFunctions = {
  // [CHANNEL_SCALES.colorAggr]: [SCALE_TYPES.ordinal, SCALE_TYPES.linear],
  [CHANNEL_SCALES.colorAggr]: {
    [AGGREGATION_TYPES.mode]: [SCALE_TYPES.ordinal],
    [AGGREGATION_TYPES.countUnique]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile]
  },

  // Currently doesn't support yet
  [CHANNEL_SCALES.sizeAggr]: {}
};

export const notSupportedScaleOpts = {
  [CHANNEL_SCALES.color]: [],
  [CHANNEL_SCALES.radius]: [],
  [CHANNEL_SCALES.size]: []
};

export const  notSupportAggrOpts = {
  [CHANNEL_SCALES.colorAggr]: {},
  [CHANNEL_SCALES.sizeAggr]: {}
};

/**
 * Default aggregation are based on ocunt
 */
export const DEFAULT_AGGREGATION = {
  [CHANNEL_SCALES.colorAggr]: {
    [AGGREGATION_TYPES.count]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile]
  },
  [CHANNEL_SCALES.sizeAggr]: {
    [AGGREGATION_TYPES.count]: [SCALE_TYPES.linear]
  }
};

/**
 * Define what type of scale operation is allowed on each type of fields
 */
export const FIELD_OPTS = {
  string: {
    type: 'categorical',
    scale: {
      ...ordinalFieldScaleFunctions,
      ...ordinalFieldAggrScaleFunctions
    },
    format: {
      legend: d => d
    }
  },
  real: {
    type: 'numerical',
    scale: {
      ...linearFieldScaleFunctions,
      ...linearFieldAggrScaleFunctions
    },
    format: {
      legend: d => d
    }
  },
  timestamp: {
    type: 'time',
    scale: {
      ...linearFieldScaleFunctions,
      ...notSupportAggrOpts
    },
    format: {
      legend: d => d
    }
  },
  integer: {
    type: 'numerical',
    scale: {
      ...linearFieldScaleFunctions,
      ...linearFieldAggrScaleFunctions
    },
    format: {
      legend: d => d
    }
  },
  boolean: {
    type: 'boolean',
    scale: {
      ...ordinalFieldScaleFunctions,
      ...ordinalFieldAggrScaleFunctions
    },
    format: {
      legend: d => d
    }
  },
  date: {
    scale: {
      ...ordinalFieldScaleFunctions,
      ...ordinalFieldAggrScaleFunctions
    },
    format: {
      legend: d => d
    }
  },
  geojson: {
    type: 'geometry',
    scale: {
      ...notSupportedScaleOpts,
      ...notSupportAggrOpts
    },
    format: {
      legend: d => '...'
    }
  }
};

export const CHANNEL_SCALE_SUPPORTED_FIELDS = Object.keys(
  CHANNEL_SCALES
).reduce(
  (accu, key) => ({
    ...accu,
    [key]: Object.keys(FIELD_OPTS).filter(
      ft => Object.keys(FIELD_OPTS[ft].scale[key]).length
    )
  }),
  {}
);

// TODO: shan delete use of LAYER_TYPES
export const LAYER_TYPES = keyMirror({
  point: null,
  arc: null,
  cluster: null,
  line: null,
  grid: null,
  geojson: null,
  icon: null,
  heatmap: null,
  hexagon: null
});

export const DEFAULT_LAYER_COLOR = {
  tripArc: '#9226C6',
  begintrip_lat: '#1E96BE',
  dropoff_lat: '#FF991F',
  request_lat: '#52A353'
};

// let user pass in default tooltip fields
export const DEFAULT_TOOLTIP_FIELDS = [];

export const DEFAULT_LIGHT_SETTINGS = {
  lightsPosition: [-122.45, 37.66, 8000, -122.0, 38.0, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.3,
  lightsStrength: [0.9, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

export const NO_VALUE_COLOR = [0, 0, 0, 0];

export const LAYER_BLENDINGS = {
  additive: {
    blendFunc: ['SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: 'FUNC_ADD'
  },
  normal: {
    // reference to
    // https://limnu.com/webgl-blending-youre-probably-wrong/
    blendFunc: [
      'SRC_ALPHA',
      'ONE_MINUS_SRC_ALPHA',
      'ONE',
      'ONE_MINUS_SRC_ALPHA'
    ],
    blendEquation: ['FUNC_ADD', 'FUNC_ADD']
  },
  subtractive: {
    blendFunc: ['ONE', 'ONE_MINUS_DST_COLOR', 'SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: ['FUNC_SUBTRACT', 'FUNC_ADD']
  }
};

export const MAX_DEFAULT_TOOLTIPS = 5;

export const RESOLUTIONS = keyMirror({
  ONE_X: null,
  TWO_X: null
});

export const RATIOS = keyMirror({
  SCREEN: null,
  FOUR_BY_THREE: null,
  SIXTEEN_BY_NINE: null
});

export const RATIO_OPTIONS = [{
  id: RATIOS.SCREEN,
  label: 'Original Screen',
  getSize: (screenW, screenH) => ({width: screenW, height: screenH})
}, {
  id: RATIOS.FOUR_BY_THREE,
  label: '4:3',
  getSize: (screenW, screenH) => ({width: screenW, height: Math.round(screenW * 0.75)})
}, {
  id: RATIOS.SIXTEEN_BY_NINE,
  label: '16:9',
  getSize: (screenW, screenH) => ({width: screenW, height: Math.round(screenW * 0.5625)})
}];

export const RESOLUTION_OPTIONS = [{
  id: RESOLUTIONS.ONE_X,
  label: '1x',
  available: true,
  scale: 1,
  zoomOffset: Math.log2(1),
  getSize: (screenW, screenH) => ({
    width: screenW,
    height: screenH
  })
}, {
  id: RESOLUTIONS.TWO_X,
  label: '2x',
  available: true,
  scale: 2,
  zoomOffset: Math.log2(2),
  getSize: (screenW, screenH) => ({
    width: screenW * 2,
    height: screenH * 2
  })
}];

export const DEFAULT_EXPORT_IMAGE_NAME = 'kepler-gl.png';

export const EXPORT_DATA_TYPE = keyMirror({
  CSV: null
  // SHAPEFILE: null,
  // JSON: null,
  // GEOJSON: null,
  // TOPOJSON: null
});

export const EXPORT_DATA_TYPE_OPTIONS = [
  {
    id: EXPORT_DATA_TYPE.CSV,
    label: EXPORT_DATA_TYPE.CSV.toLowerCase(),
    available: true
  }
  // {
  //   id: EXPORT_DATA_TYPE.SHAPEFILE,
  //   label: 'shapefile',
  //   available: false
  // },
  // {
  //   id: EXPORT_DATA_TYPE.JSON,
  //   label: 'json',
  //   available: false
  // },
  // {
  //   id: EXPORT_DATA_TYPE.GEOJSON,
  //   label: 'geojson',
  //   available: false
  // },
  // {
  //   id: EXPORT_DATA_TYPE.TOPOJSON,
  //   label: 'topojson',
  //   available: false
  // }
];

// Export map types
export const EXPORT_MAP_FORMAT = keyMirror({
  HTML: null,
  JSON: null
});

// Export map options
export const EXPORT_MAP_FORMAT_OPTIONS = Object.entries(EXPORT_MAP_FORMAT)
  .map(entry => ({
    id: entry[0],
    label: entry[1].toLowerCase(),
    available: true
  }));

export const DEFAULT_UUID_COUNT = 6;

export const DEFAULT_NOTIFICATION_MESSAGE = 'MESSAGE_NOT_PROVIDED';

export const DEFAULT_NOTIFICATION_TYPES = keyMirror({
  info: null,
  error: null,
  warning: null,
  success: null
});

export const DEFAULT_NOTIFICATION_TOPICS = keyMirror({
  global: null,
  file: null
});

export const TOKEN_MISUSE_WARNING = '* If you do not provide your own token, the map may fail to display at any time when we replace ours to avoid misuse. ';
export const DISCLAIMER = 'You can change the Mapbox token later using the following instructions: ';
export const MAP_CONFIG_DESCRIPTION = 'Map config will be included in the Json file. If you are using kepler.gl in your own app. You can copy this config and pass it to ';

// We could use direcctly react-map-gl-draw EditorMode but this would
// create a direct dependency with react-map-gl-draw
// Created this map to be independent from react-map-gl-draw
export const MAP_MODES = {
  READ_ONLY: EditorModes.READ_ONLY,
  DRAW_POLYGON: EditorModes.DRAW_POLYGON,
  DRAW_RECTANGLE: EditorModes.DRAW_RECTANGLE,
  EDIT_VERTEX: EditorModes.EDIT_VERTEX
};
