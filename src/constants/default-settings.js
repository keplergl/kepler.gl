// Copyright (c) 2018 Uber Technologies, Inc.
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
import toolsDark from './map-styles/tools-dark.json';

export const ACTION_PREFIX = '@@kepler.gl/';

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoidGllX' + '1gxUSJ9.gElUooDF7u51guCQREmAhg';

// TODO: don't include mapzen in kepler.gl
export const MAPZEN_API_KEY = 'vector-tiles-u4xpG7G';

// TODO: cleanup styles, don't load uber style
export const CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net';
export const STYLE_PREFIX = `${CLOUDFRONT}/map_styles`;
export const ICON_PREFIX = `${CLOUDFRONT}/geodude`;

// Modal Ids
export const LAYER_CONFIG_ID = 'copyConfig';
export const DATA_TABLE_ID = 'dataTable';
export const DELETE_DATA_ID = 'deleteData';
export const ADD_DATA_ID = 'addData';

import {
  Layers,
  FilterFunnel,
  Settings,
  CursorClick
} from 'components/common/icons';

export const DIMENSIONS = {
  // TODO: remove use to qbHeihgt
  qbHeight: 62,
  headerHeight: 55,

  sidePanel: {
    width: 300,
    margin: 20,
    headerHeight: 96
  },

  sidePanelWidth: 300,

  sideNavW: 120,
  sideNavC: 40,
  topOffset: 117,
  sideBarPadding: 24,
  layerPanelPadding: 12,
  mapLayerSelectorHeight: 250,
  mapControlWidth: 204,
  mapControlPadding: 12
};

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

export const PANELS_FOOTER = [
  {
    id: LAYER_CONFIG_ID,
    label: 'Copy Config',
    icon: 'clipboard'
  }
];

// MAP STYLES
export const INITIAL_STYLE_TYPE = 'dark';
export const DEFAULT_BLDG_COLOR = '#D1CEC7';

export const DEFAULT_LAYER_GROUPS = [
  {
    slug: 'label',
    filter: ({id}) => id.match(/label/),
    defaultVisibility: true
  },
  {
    slug: 'road',
    filter: ({id}) => id.match(/(?=(road|railway))(?!.*label)/),
    defaultVisibility: true
  },
  {
    slug: 'border',
    filter: ({id}) => id.match(/border/),
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
    filter: ({id}) => id.match(/(?=(parks))/),
    defaultVisibility: true
  }
];

export const DEFAULT_MAP_STYLES = [
  {
    id: 'dark',
    label: 'Dark',
    url: `${STYLE_PREFIX}/tools-dark.json`,
    icon: `${ICON_PREFIX}/UBER_DARK_V2.png`,
    style: toolsDark,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'light',
    label: 'Light',
    url: `${STYLE_PREFIX}/tools-light.json`,
    icon: `${ICON_PREFIX}/UBER_LIGHT_V2.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'places',
    label: 'Places',
    url: `${STYLE_PREFIX}/driver-ticker.json`,
    icon: `${ICON_PREFIX}/UBER_DRIVER_TICKER.png`,
    layerGroups: [
      ...DEFAULT_LAYER_GROUPS,
      {
        slug: 'places',
        filter: ({id}) => id.match(/poi/),
        defaultVisibility: true,
        editable: true
      }
    ]
  },
  {
    id: 'muted',
    label: 'Muted',
    url: `${STYLE_PREFIX}/driver-muted.json`,
    icon: `${ICON_PREFIX}/UBER_MUTED.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'muted_night',
    label: 'Muted Night',
    url: `${STYLE_PREFIX}/driver-night-muted.json`,
    icon: `${ICON_PREFIX}/UBER_NIGHT_MUTED.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'street',
    label: 'Street',
    url: `${STYLE_PREFIX}/tools-street.json`,
    icon: `${ICON_PREFIX}/UBER_MAP.jpg`
  },
  {
    label: 'Google Satellite',
    id: 'google_satellite',
    url: `${STYLE_PREFIX}/tools-google-satellite.json`,
    icon: `${ICON_PREFIX}/GOOGLE_SATELLITE.jpg`
  }
];

export const GEOJSON_FIELDS = {
  geojson: ['_geojson', 'all_points', 'geojson']
};

export const HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id']
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
  lat0: 'begintrip_lat',
  lng0: 'begintrip_lng',
  lat1: 'dropoff_lat',
  lng1: 'dropoff_lng'
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

export const linearFieldScaleFunctions = {
  [CHANNEL_SCALES.color]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
  [CHANNEL_SCALES.radius]: [SCALE_TYPES.sqrt],
  [CHANNEL_SCALES.size]: [SCALE_TYPES.linear]
};

export const linearFieldAggrScaleFunctions = {
  [CHANNEL_SCALES.colorAggr]: [SCALE_TYPES.quantize, SCALE_TYPES.quantile],
  [CHANNEL_SCALES.sizeAggr]: [SCALE_TYPES.linear]
};

export const OrdinalFieldScaleFunctions = {
  [CHANNEL_SCALES.color]: [SCALE_TYPES.ordinal],
  [CHANNEL_SCALES.radius]: [SCALE_TYPES.point],
  [CHANNEL_SCALES.size]: [SCALE_TYPES.point]
};

export const OrdinalFieldAggrScaleFunctions = {
  // Currently doesn't support yet
  [CHANNEL_SCALES.colorAggr]: [],
  [CHANNEL_SCALES.sizeAggr]: []
};

export const notSupportedScaleOpts = {
  [CHANNEL_SCALES.color]: [],
  [CHANNEL_SCALES.radius]: [],
  [CHANNEL_SCALES.size]: [],
  [CHANNEL_SCALES.colorAggr]: [],
  [CHANNEL_SCALES.sizeAggr]: []
};

/**
 * Define what type of scale operation is allowed on each type of fields
 */
export const FIELD_OPTS = {
  string: {
    type: 'categorical',
    scale: {
      ...OrdinalFieldScaleFunctions,
      ...OrdinalFieldAggrScaleFunctions
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
    scale: linearFieldScaleFunctions,
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
    scale: OrdinalFieldScaleFunctions,
    format: {
      legend: d => d
    }
  },
  date: {
    scale: OrdinalFieldScaleFunctions,
    format: {
      legend: d => d
    }
  },
  geojson: {
    type: 'geometry',
    scale: notSupportedScaleOpts,
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
      ft => FIELD_OPTS[ft].scale[key] && FIELD_OPTS[ft].scale[key].length
    )
  }),
  {}
);

export const LAYER_TYPES = keyMirror({
  point: null,
  arc: null,
  cluster: null,
  line: null,
  grid: null,
  geojson: null,
  icon: null,
  heatmap: null,
  hexagon: null,
  hexagonId: null
});

// layer type to map-gl-layers
export const LAYER_CLASSES = {
  [LAYER_TYPES.point]: 'PointLayer',
  [LAYER_TYPES.arc]: 'ArcLayer',
  [LAYER_TYPES.cluster]: 'ClusterLayer',
  [LAYER_TYPES.line]: 'LineLayer',
  [LAYER_TYPES.grid]: 'GridLayer',
  [LAYER_TYPES.geojson]: 'GeojsonLayer',
  [LAYER_TYPES.icon]: 'IconLayer',
  [LAYER_TYPES.heatmap]: 'HeatmapLayer',
  [LAYER_TYPES.hexagon]: 'HexagonLayer',
  [LAYER_TYPES.hexagonId]: 'H3HexagonLayer'
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

export const NO_VALUE_COLOR = [147, 147, 147];

export const LAYER_BLENDINGS = {
  additive: {
    enable: true,
    blendFunc: ['SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: 'FUNC_ADD'
  },
  normal: {
    enable: true,
    // reference to
    // https://limnu.com/webgl-blending-youre-probably-wrong/
    blendFuncSeparate: [
      'SRC_ALPHA',
      'ONE_MINUS_SRC_ALPHA',
      'ONE',
      'ONE_MINUS_SRC_ALPHA'
    ],
    blendEquationSeparate: ['FUNC_ADD', 'FUNC_ADD']
  },
  subtractive: {
    enable: true,
    blendFuncSeparate: ['ONE', 'ONE_MINUS_DST_COLOR', 'SRC_ALPHA', 'DST_ALPHA'],
    blendEquationSeparate: ['FUNC_SUBTRACT', 'FUNC_ADD']
  }
};

export const AGGREGATION_TYPES = keyMirror({
  average: null,
  maximum: null,
  minimum: null,
  median: null,
  sum: null,
  countUnique: null
});

export const MAX_DEFAULT_TOOLTIPS = 5;
