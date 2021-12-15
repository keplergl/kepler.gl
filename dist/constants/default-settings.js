"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATASET_FORMATS = exports.LOADING_METHODS = exports.MAP_INFO_CHARACTER = exports.MAP_THUMBNAIL_DIMENSION = exports.MAX_GPU_FILTERS = exports.EDITOR_AVAILABLE_LAYERS = exports.EDITOR_MODES = exports.GEOCODER_ICON_SIZE = exports.GEOCODER_ICON_COLOR = exports.GEOCODER_GEO_OFFSET = exports.GEOCODER_LAYER_ID = exports.GEOCODER_DATASET_NAME = exports.SPEED_CONTROL_STEP = exports.SPEED_CONTROL_RANGE = exports.DEFAULT_TIME_FORMAT = exports.ANIMATION_WINDOW = exports.FPS = exports.BASE_SPEED = exports.THROTTLE_NOTIFICATION_TIME = exports.DEFAULT_NOTIFICATION_TOPICS = exports.DEFAULT_NOTIFICATION_TYPES = exports.DEFAULT_NOTIFICATION_MESSAGE = exports.DEFAULT_UUID_COUNT = exports.EXPORT_HTML_MAP_MODE_OPTIONS = exports.EXPORT_MAP_FORMAT_OPTIONS = exports.EXPORT_HTML_MAP_MODES = exports.EXPORT_MAP_FORMATS = exports.EXPORT_DATA_TYPE_OPTIONS = exports.EXPORT_DATA_TYPE = exports.EXPORT_IMG_RESOLUTION_OPTIONS = exports.EXPORT_IMG_RATIO_OPTIONS = exports.EXPORT_IMG_RATIOS = exports.RESOLUTIONS = exports.MAX_DEFAULT_TOOLTIPS = exports.LAYER_BLENDINGS = exports.NO_VALUE_COLOR = exports.DEFAULT_TOOLTIP_FIELDS = exports.DEFAULT_LAYER_COLOR = exports.CHANNEL_SCALE_SUPPORTED_FIELDS = exports.FIELD_OPTS = exports.DEFAULT_AGGREGATION = exports.notSupportAggrOpts = exports.notSupportedScaleOpts = exports.ordinalFieldAggrScaleFunctions = exports.ordinalFieldScaleFunctions = exports.linearFieldAggrScaleFunctions = exports.linearFieldScaleFunctions = exports.AGGREGATION_TYPES = exports.CHANNEL_SCALES = exports.HIGHLIGH_COLOR_3D = exports.FIELD_COLORS = exports.FILED_TYPE_DISPLAY = exports.TABLE_OPTION_LIST = exports.TABLE_OPTION = exports.SORT_ORDER = exports.ALL_FIELD_TYPES = exports.SCALE_FUNC = exports.SCALE_TYPES = exports.FILTER_TYPES = exports.TRIP_ARC_FIELDS = exports.TRIP_POINT_FIELDS = exports.ICON_FIELDS = exports.GEOJSON_FIELDS = exports.DEFAULT_MAP_STYLES = exports.DEFAULT_LAYER_GROUPS = exports.PANELS = exports.SIDEBAR_PANELS = exports.THEME = exports.DIMENSIONS = exports.KEPLER_GL_WEBSITE = exports.KEPLER_GL_VERSION = exports.KEPLER_GL_NAME = exports.SHARE_MAP_ID = exports.OVERWRITE_MAP_ID = exports.SAVE_MAP_ID = exports.EXPORT_MAP_ID = exports.ADD_MAP_STYLE_ID = exports.EXPORT_DATA_ID = exports.EXPORT_IMAGE_ID = exports.ADD_DATA_ID = exports.DELETE_DATA_ID = exports.DATA_TABLE_ID = exports.DEFAULT_MAPBOX_API_URL = exports.ICON_PREFIX = exports.CLOUDFRONT = exports.ACTION_PREFIX = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _keymirror = _interopRequireDefault(require("keymirror"));

var _reactMapGlDraw = require("react-map-gl-draw");

var _d3Scale = require("d3-scale");

var _icons = require("../components/common/icons");

var _utils = require("../utils/utils");

var _tooltip = require("./tooltip");

var _types = require("../layers/types");

var _SCALE_FUNC, _FILED_TYPE_DISPLAY, _linearFieldScaleFunc, _CHANNEL_SCALES$color, _CHANNEL_SCALES$sizeA, _linearFieldAggrScale, _ordinalFieldScaleFun, _CHANNEL_SCALES$color2, _ordinalFieldAggrScal, _notSupportedScaleOpt, _notSupportAggrOpts, _DEFAULT_AGGREGATION;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ACTION_PREFIX = '@@kepler.gl/';
exports.ACTION_PREFIX = ACTION_PREFIX;
var CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
exports.CLOUDFRONT = CLOUDFRONT;
var ICON_PREFIX = "".concat(CLOUDFRONT, "/geodude");
exports.ICON_PREFIX = ICON_PREFIX;
var DEFAULT_MAPBOX_API_URL = 'https://api.mapbox.com'; // Modal Ids

/**
 * Modal id: data table
 * @constant
 * @type {string}
 * @public
 */

exports.DEFAULT_MAPBOX_API_URL = DEFAULT_MAPBOX_API_URL;
var DATA_TABLE_ID = 'dataTable';
/**
 * Modal id: delete dataset confirm dialog
 * @constant
 * @type {string}
 * @public
 */

exports.DATA_TABLE_ID = DATA_TABLE_ID;
var DELETE_DATA_ID = 'deleteData';
/**
 * Modal id: add data modal
 * @constant
 * @type {string}
 * @public
 */

exports.DELETE_DATA_ID = DELETE_DATA_ID;
var ADD_DATA_ID = 'addData';
/**
 * Modal id: export image modal
 * @constant
 * @type {string}
 * @public
 */

exports.ADD_DATA_ID = ADD_DATA_ID;
var EXPORT_IMAGE_ID = 'exportImage';
/**
 * Modal id: export data modal
 * @constant
 * @type {string}
 * @public
 */

exports.EXPORT_IMAGE_ID = EXPORT_IMAGE_ID;
var EXPORT_DATA_ID = 'exportData';
/**
 * Modal id: add custom map style modal
 * @constant
 * @type {string}
 * @public
 */

exports.EXPORT_DATA_ID = EXPORT_DATA_ID;
var ADD_MAP_STYLE_ID = 'addMapStyle';
/**
 * Modal id: export map modal
 * @constant
 * @type {string}
 * @public
 */

exports.ADD_MAP_STYLE_ID = ADD_MAP_STYLE_ID;
var EXPORT_MAP_ID = 'exportMap';
/**
 * Modal id: save map modal
 * @constant
 * @type {string}
 * @public
 */

exports.EXPORT_MAP_ID = EXPORT_MAP_ID;
var SAVE_MAP_ID = 'saveMap';
/**
 * Modal id: confirm to overwrite saved map
 * @constant
 * @type {string}
 * @public
 */

exports.SAVE_MAP_ID = SAVE_MAP_ID;
var OVERWRITE_MAP_ID = 'overwriteMap';
/**
 * Modal id: share map url modal
 * @constant
 * @type {string}
 * @public
 */

exports.OVERWRITE_MAP_ID = OVERWRITE_MAP_ID;
var SHARE_MAP_ID = 'shareMap';
exports.SHARE_MAP_ID = SHARE_MAP_ID;
var KEPLER_GL_NAME = 'kepler.gl'; // __PACKAGE_VERSION__ is automatically injected by Babel/Webpack during the building process
// Since we are injecting this during the build process with babel
// while developing VERSION is not defined, we capture the exception and return
// an empty string which will allow us to retrieve the latest umd version

exports.KEPLER_GL_NAME = KEPLER_GL_NAME;
var KEPLER_GL_VERSION = "2.5.4";
exports.KEPLER_GL_VERSION = KEPLER_GL_VERSION;
var KEPLER_GL_WEBSITE = 'http://kepler.gl/';
exports.KEPLER_GL_WEBSITE = KEPLER_GL_WEBSITE;
var DIMENSIONS = {
  sidePanel: {
    width: 300,
    margin: {
      top: 20,
      left: 20,
      bottom: 30,
      right: 20
    },
    headerHeight: 96
  },
  mapControl: {
    width: 184,
    padding: 12
  }
};
/**
 * Theme name that can be passed to `KeplerGl` `prop.theme`.
 * Available themes are `THEME.light` and `THEME.dark`. Default theme is `THEME.dark`
 * @constant
 * @type {object}
 * @public
 * @example
 * ```js
 * const Map = () => <KeplerGl theme={THEME.light} id="map"/>
 * ```
 */

exports.DIMENSIONS = DIMENSIONS;
var THEME = (0, _keymirror["default"])({
  light: null,
  dark: null,
  base: null
});
exports.THEME = THEME;
var SIDEBAR_PANELS = [{
  id: 'layer',
  label: 'sidebar.panels.layer',
  iconComponent: _icons.Layers,
  onClick: null
}, {
  id: 'filter',
  label: 'sidebar.panels.filter',
  iconComponent: _icons.FilterFunnel,
  onClick: null
}, {
  id: 'interaction',
  label: 'sidebar.panels.interaction',
  iconComponent: _icons.CursorClick,
  onClick: null
}, {
  id: 'map',
  label: 'sidebar.panels.basemap',
  iconComponent: _icons.Settings,
  onClick: null
}]; // backward compatibility

exports.SIDEBAR_PANELS = SIDEBAR_PANELS;
var PANELS = SIDEBAR_PANELS; // MAP STYLES

exports.PANELS = PANELS;
var DEFAULT_LAYER_GROUPS = [{
  slug: 'label',
  filter: function filter(_ref) {
    var id = _ref.id;
    return id.match(/(?=(label|place-|poi-))/);
  },
  defaultVisibility: true
}, {
  slug: 'road',
  filter: function filter(_ref2) {
    var id = _ref2.id;
    return id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/);
  },
  defaultVisibility: true
}, {
  slug: 'border',
  filter: function filter(_ref3) {
    var id = _ref3.id;
    return id.match(/border|boundaries/);
  },
  defaultVisibility: false
}, {
  slug: 'building',
  filter: function filter(_ref4) {
    var id = _ref4.id;
    return id.match(/building/);
  },
  defaultVisibility: true
}, {
  slug: 'water',
  filter: function filter(_ref5) {
    var id = _ref5.id;
    return id.match(/(?=(water|stream|ferry))/);
  },
  defaultVisibility: true
}, {
  slug: 'land',
  filter: function filter(_ref6) {
    var id = _ref6.id;
    return id.match(/(?=(parks|landcover|industrial|sand|hillshade))/);
  },
  defaultVisibility: true
}, {
  slug: '3d building',
  filter: function filter() {
    return false;
  },
  defaultVisibility: false
}];
exports.DEFAULT_LAYER_GROUPS = DEFAULT_LAYER_GROUPS;
var DEFAULT_MAP_STYLES = [{
  id: 'dark',
  label: 'Dark',
  url: 'mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09',
  icon: "".concat(ICON_PREFIX, "/UBER_DARK_V2.png"),
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'light',
  label: 'Light',
  url: 'mapbox://styles/uberdata/cjoqb9j339k1f2sl9t5ic5bn4',
  icon: "".concat(ICON_PREFIX, "/UBER_LIGHT_V2.png"),
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'muted',
  label: 'Muted Light',
  url: 'mapbox://styles/uberdata/cjfyl03kp1tul2smf5v2tbdd4',
  icon: "".concat(ICON_PREFIX, "/UBER_MUTED_LIGHT.png"),
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'muted_night',
  label: 'Muted Night',
  url: 'mapbox://styles/uberdata/cjfxhlikmaj1b2soyzevnywgs',
  icon: "".concat(ICON_PREFIX, "/UBER_MUTED_NIGHT.png"),
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'satellite',
  label: 'Satellite',
  url: "mapbox://styles/mapbox/satellite-v9",
  icon: "".concat(ICON_PREFIX, "/UBER_SATELLITE.png")
}];
exports.DEFAULT_MAP_STYLES = DEFAULT_MAP_STYLES;
var GEOJSON_FIELDS = {
  geojson: ['_geojson', 'all_points', 'geojson']
};
exports.GEOJSON_FIELDS = GEOJSON_FIELDS;
var ICON_FIELDS = {
  icon: ['icon']
};
exports.ICON_FIELDS = ICON_FIELDS;
var TRIP_POINT_FIELDS = [['lat', 'lng'], ['lat', 'lon'], ['latitude', 'longitude']];
exports.TRIP_POINT_FIELDS = TRIP_POINT_FIELDS;
var TRIP_ARC_FIELDS = {
  lat0: 'begintrip',
  lng0: 'begintrip',
  lat1: 'dropoff',
  lng1: 'dropoff'
};
exports.TRIP_ARC_FIELDS = TRIP_ARC_FIELDS;
var FILTER_TYPES = (0, _keymirror["default"])({
  range: null,
  select: null,
  input: null,
  timeRange: null,
  multiSelect: null,
  polygon: null
});
exports.FILTER_TYPES = FILTER_TYPES;
var SCALE_TYPES = (0, _keymirror["default"])({
  ordinal: null,
  quantile: null,
  quantize: null,
  linear: null,
  sqrt: null,
  log: null,
  // ordinal domain to linear range
  point: null
});
exports.SCALE_TYPES = SCALE_TYPES;
var SCALE_FUNC = (_SCALE_FUNC = {}, (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.linear, _d3Scale.scaleLinear), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.quantize, _d3Scale.scaleQuantize), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.quantile, _d3Scale.scaleQuantile), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.ordinal, _d3Scale.scaleOrdinal), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.sqrt, _d3Scale.scaleSqrt), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.log, _d3Scale.scaleLog), (0, _defineProperty2["default"])(_SCALE_FUNC, SCALE_TYPES.point, _d3Scale.scalePoint), _SCALE_FUNC);
exports.SCALE_FUNC = SCALE_FUNC;
var ALL_FIELD_TYPES = (0, _keymirror["default"])({
  "boolean": null,
  date: null,
  geojson: null,
  integer: null,
  real: null,
  string: null,
  timestamp: null,
  array: null,
  point: null
}); // Data Table

exports.ALL_FIELD_TYPES = ALL_FIELD_TYPES;
var SORT_ORDER = (0, _keymirror["default"])({
  ASCENDING: null,
  DESCENDING: null,
  UNSORT: null
});
exports.SORT_ORDER = SORT_ORDER;
var TABLE_OPTION = (0, _keymirror["default"])({
  SORT_ASC: null,
  SORT_DES: null,
  UNSORT: null,
  PIN: null,
  UNPIN: null,
  COPY: null
});
exports.TABLE_OPTION = TABLE_OPTION;
var TABLE_OPTION_LIST = [{
  value: TABLE_OPTION.SORT_ASC,
  display: 'Sort Ascending',
  icon: _icons.ArrowUp,
  condition: function condition(props) {
    return props.sortMode !== SORT_ORDER.ASCENDING;
  }
}, {
  value: TABLE_OPTION.SORT_DES,
  display: 'Sort Descending',
  icon: _icons.ArrowDown,
  condition: function condition(props) {
    return props.sortMode !== SORT_ORDER.DESCENDING;
  }
}, {
  value: TABLE_OPTION.UNSORT,
  display: 'Unsort Column',
  icon: _icons.Cancel,
  condition: function condition(props) {
    return props.isSorted;
  }
}, {
  value: TABLE_OPTION.PIN,
  display: 'Pin Column',
  icon: _icons.Pin,
  condition: function condition(props) {
    return !props.isPinned;
  }
}, {
  value: TABLE_OPTION.UNPIN,
  display: 'Unpin Column',
  icon: _icons.Cancel,
  condition: function condition(props) {
    return props.isPinned;
  }
}, {
  value: TABLE_OPTION.COPY,
  display: 'Copy Column',
  icon: _icons.Clipboard
}];
exports.TABLE_OPTION_LIST = TABLE_OPTION_LIST;
var ORANGE = '248, 194, 28';
var PINK = '231, 189, 194';
var PURPLE = '160, 106, 206';
var BLUE = '140, 210, 205';
var BLUE2 = '106, 160, 206';
var BLUE3 = '0, 172, 237';
var GREEN = '106, 160, 56';
var GREEN2 = '23, 207, 114';
var RED = '237, 88, 106';
var FILED_TYPE_DISPLAY = (_FILED_TYPE_DISPLAY = {}, (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES["boolean"], {
  label: 'bool',
  color: PINK
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.date, {
  label: 'date',
  color: PURPLE
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.geojson, {
  label: 'geo',
  color: BLUE2
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.integer, {
  label: 'int',
  color: ORANGE
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.real, {
  label: 'float',
  color: ORANGE
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.string, {
  label: 'string',
  color: BLUE
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.timestamp, {
  label: 'time',
  color: GREEN
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.array, {
  label: 'array',
  color: GREEN2
}), (0, _defineProperty2["default"])(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.point, {
  label: 'point',
  color: BLUE3
}), _FILED_TYPE_DISPLAY);
exports.FILED_TYPE_DISPLAY = FILED_TYPE_DISPLAY;
var FIELD_COLORS = {
  "default": RED
};
exports.FIELD_COLORS = FIELD_COLORS;
var HIGHLIGH_COLOR_3D = [255, 255, 255, 60];
exports.HIGHLIGH_COLOR_3D = HIGHLIGH_COLOR_3D;
var CHANNEL_SCALES = (0, _keymirror["default"])({
  color: null,
  radius: null,
  size: null,
  colorAggr: null,
  sizeAggr: null
});
exports.CHANNEL_SCALES = CHANNEL_SCALES;
var AGGREGATION_TYPES = {
  // default
  count: 'count',
  // linear
  average: 'average',
  maximum: 'maximum',
  minimum: 'minimum',
  median: 'median',
  stdev: 'stdev',
  sum: 'sum',
  variance: 'variance',
  // ordinal
  mode: 'mode',
  countUnique: 'count unique'
};
exports.AGGREGATION_TYPES = AGGREGATION_TYPES;
var linearFieldScaleFunctions = (_linearFieldScaleFunc = {}, (0, _defineProperty2["default"])(_linearFieldScaleFunc, CHANNEL_SCALES.color, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_linearFieldScaleFunc, CHANNEL_SCALES.radius, [SCALE_TYPES.sqrt]), (0, _defineProperty2["default"])(_linearFieldScaleFunc, CHANNEL_SCALES.size, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), _linearFieldScaleFunc);
exports.linearFieldScaleFunctions = linearFieldScaleFunctions;
var linearFieldAggrScaleFunctions = (_linearFieldAggrScale = {}, (0, _defineProperty2["default"])(_linearFieldAggrScale, CHANNEL_SCALES.colorAggr, (_CHANNEL_SCALES$color = {}, (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.average, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.maximum, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.minimum, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.median, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.stdev, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.sum, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color, AGGREGATION_TYPES.variance, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), _CHANNEL_SCALES$color)), (0, _defineProperty2["default"])(_linearFieldAggrScale, CHANNEL_SCALES.sizeAggr, (_CHANNEL_SCALES$sizeA = {}, (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.average, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.maximum, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.minimum, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.median, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.stdev, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.sum, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$sizeA, AGGREGATION_TYPES.variance, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log]), _CHANNEL_SCALES$sizeA)), _linearFieldAggrScale);
exports.linearFieldAggrScaleFunctions = linearFieldAggrScaleFunctions;
var ordinalFieldScaleFunctions = (_ordinalFieldScaleFun = {}, (0, _defineProperty2["default"])(_ordinalFieldScaleFun, CHANNEL_SCALES.color, [SCALE_TYPES.ordinal]), (0, _defineProperty2["default"])(_ordinalFieldScaleFun, CHANNEL_SCALES.radius, [SCALE_TYPES.point]), (0, _defineProperty2["default"])(_ordinalFieldScaleFun, CHANNEL_SCALES.size, [SCALE_TYPES.point]), _ordinalFieldScaleFun);
exports.ordinalFieldScaleFunctions = ordinalFieldScaleFunctions;
var ordinalFieldAggrScaleFunctions = (_ordinalFieldAggrScal = {}, (0, _defineProperty2["default"])(_ordinalFieldAggrScal, CHANNEL_SCALES.colorAggr, (_CHANNEL_SCALES$color2 = {}, (0, _defineProperty2["default"])(_CHANNEL_SCALES$color2, AGGREGATION_TYPES.mode, [SCALE_TYPES.ordinal]), (0, _defineProperty2["default"])(_CHANNEL_SCALES$color2, AGGREGATION_TYPES.countUnique, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), _CHANNEL_SCALES$color2)), (0, _defineProperty2["default"])(_ordinalFieldAggrScal, CHANNEL_SCALES.sizeAggr, {}), _ordinalFieldAggrScal);
exports.ordinalFieldAggrScaleFunctions = ordinalFieldAggrScaleFunctions;
var notSupportedScaleOpts = (_notSupportedScaleOpt = {}, (0, _defineProperty2["default"])(_notSupportedScaleOpt, CHANNEL_SCALES.color, []), (0, _defineProperty2["default"])(_notSupportedScaleOpt, CHANNEL_SCALES.radius, []), (0, _defineProperty2["default"])(_notSupportedScaleOpt, CHANNEL_SCALES.size, []), _notSupportedScaleOpt);
exports.notSupportedScaleOpts = notSupportedScaleOpts;
var notSupportAggrOpts = (_notSupportAggrOpts = {}, (0, _defineProperty2["default"])(_notSupportAggrOpts, CHANNEL_SCALES.colorAggr, {}), (0, _defineProperty2["default"])(_notSupportAggrOpts, CHANNEL_SCALES.sizeAggr, {}), _notSupportAggrOpts);
/**
 * Default aggregation are based on ocunt
 */

exports.notSupportAggrOpts = notSupportAggrOpts;
var DEFAULT_AGGREGATION = (_DEFAULT_AGGREGATION = {}, (0, _defineProperty2["default"])(_DEFAULT_AGGREGATION, CHANNEL_SCALES.colorAggr, (0, _defineProperty2["default"])({}, AGGREGATION_TYPES.count, [SCALE_TYPES.quantize, SCALE_TYPES.quantile])), (0, _defineProperty2["default"])(_DEFAULT_AGGREGATION, CHANNEL_SCALES.sizeAggr, (0, _defineProperty2["default"])({}, AGGREGATION_TYPES.count, [SCALE_TYPES.linear, SCALE_TYPES.sqrt, SCALE_TYPES.log])), _DEFAULT_AGGREGATION);
/**
 * Define what type of scale operation is allowed on each type of fields
 */

exports.DEFAULT_AGGREGATION = DEFAULT_AGGREGATION;
var FIELD_OPTS = {
  string: {
    type: 'categorical',
    scale: _objectSpread(_objectSpread({}, ordinalFieldScaleFunctions), ordinalFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: []
    }
  },
  real: {
    type: 'numerical',
    scale: _objectSpread(_objectSpread({}, linearFieldScaleFunctions), linearFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: [_tooltip.TOOLTIP_FORMAT_TYPES.NONE, _tooltip.TOOLTIP_FORMAT_TYPES.DECIMAL, _tooltip.TOOLTIP_FORMAT_TYPES.PERCENTAGE]
    }
  },
  timestamp: {
    type: 'time',
    scale: _objectSpread(_objectSpread({}, linearFieldScaleFunctions), notSupportAggrOpts),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: [_tooltip.TOOLTIP_FORMAT_TYPES.NONE, _tooltip.TOOLTIP_FORMAT_TYPES.DATE, _tooltip.TOOLTIP_FORMAT_TYPES.DATE_TIME]
    }
  },
  integer: {
    type: 'numerical',
    scale: _objectSpread(_objectSpread({}, linearFieldScaleFunctions), linearFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: [_tooltip.TOOLTIP_FORMAT_TYPES.NONE, _tooltip.TOOLTIP_FORMAT_TYPES.DECIMAL, _tooltip.TOOLTIP_FORMAT_TYPES.PERCENTAGE]
    }
  },
  "boolean": {
    type: 'boolean',
    scale: _objectSpread(_objectSpread({}, ordinalFieldScaleFunctions), ordinalFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: [_tooltip.TOOLTIP_FORMAT_TYPES.NONE, _tooltip.TOOLTIP_FORMAT_TYPES.BOOLEAN]
    }
  },
  date: {
    scale: _objectSpread(_objectSpread({}, ordinalFieldScaleFunctions), ordinalFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      },
      tooltip: [_tooltip.TOOLTIP_FORMAT_TYPES.NONE, _tooltip.TOOLTIP_FORMAT_TYPES.DATE]
    }
  },
  geojson: {
    type: 'geometry',
    scale: _objectSpread(_objectSpread({}, notSupportedScaleOpts), notSupportAggrOpts),
    format: {
      legend: function legend(d) {
        return '...';
      },
      tooltip: []
    }
  }
};
exports.FIELD_OPTS = FIELD_OPTS;
var CHANNEL_SCALE_SUPPORTED_FIELDS = Object.keys(CHANNEL_SCALES).reduce(function (accu, key) {
  return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, Object.keys(FIELD_OPTS).filter(function (ft) {
    return Object.keys(FIELD_OPTS[ft].scale[key]).length;
  })));
}, {});
exports.CHANNEL_SCALE_SUPPORTED_FIELDS = CHANNEL_SCALE_SUPPORTED_FIELDS;
var DEFAULT_LAYER_COLOR = {
  tripArc: '#9226C6',
  begintrip_lat: '#1E96BE',
  dropoff_lat: '#FF991F',
  request_lat: '#52A353'
}; // let user pass in default tooltip fields

exports.DEFAULT_LAYER_COLOR = DEFAULT_LAYER_COLOR;
var DEFAULT_TOOLTIP_FIELDS = [];
exports.DEFAULT_TOOLTIP_FIELDS = DEFAULT_TOOLTIP_FIELDS;
var NO_VALUE_COLOR = [0, 0, 0, 0];
exports.NO_VALUE_COLOR = NO_VALUE_COLOR;
var LAYER_BLENDINGS = {
  additive: {
    label: 'layerBlending.additive',
    blendFunc: ['SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: 'FUNC_ADD'
  },
  normal: {
    // reference to
    // https://limnu.com/webgl-blending-youre-probably-wrong/
    label: 'layerBlending.normal',
    blendFunc: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'ONE', 'ONE_MINUS_SRC_ALPHA'],
    blendEquation: ['FUNC_ADD', 'FUNC_ADD']
  },
  subtractive: {
    label: 'layerBlending.subtractive',
    blendFunc: ['ONE', 'ONE_MINUS_DST_COLOR', 'SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: ['FUNC_SUBTRACT', 'FUNC_ADD']
  }
};
exports.LAYER_BLENDINGS = LAYER_BLENDINGS;
var MAX_DEFAULT_TOOLTIPS = 5;
exports.MAX_DEFAULT_TOOLTIPS = MAX_DEFAULT_TOOLTIPS;
var RESOLUTIONS = (0, _keymirror["default"])({
  ONE_X: null,
  TWO_X: null
});
exports.RESOLUTIONS = RESOLUTIONS;
var EXPORT_IMG_RATIOS = (0, _keymirror["default"])({
  SCREEN: null,
  FOUR_BY_THREE: null,
  SIXTEEN_BY_NINE: null,
  CUSTOM: null
});
exports.EXPORT_IMG_RATIOS = EXPORT_IMG_RATIOS;
var EXPORT_IMG_RATIO_OPTIONS = [{
  id: EXPORT_IMG_RATIOS.SCREEN,
  label: 'modal.exportImage.ratioOriginalScreen',
  getSize: function getSize(screenW, screenH) {
    return {
      width: screenW,
      height: screenH
    };
  }
}, {
  id: EXPORT_IMG_RATIOS.CUSTOM,
  hidden: true,
  label: 'modal.exportImage.ratioCustom',
  getSize: function getSize(mapW, mapH) {
    return {
      width: mapW,
      height: mapH
    };
  }
}, {
  id: EXPORT_IMG_RATIOS.FOUR_BY_THREE,
  label: 'modal.exportImage.ratio4_3',
  getSize: function getSize(screenW, screenH) {
    return {
      width: screenW,
      height: Math.round(screenW * 0.75)
    };
  }
}, {
  id: EXPORT_IMG_RATIOS.SIXTEEN_BY_NINE,
  label: 'modal.exportImage.ratio16_9',
  getSize: function getSize(screenW, screenH) {
    return {
      width: screenW,
      height: Math.round(screenW * 0.5625)
    };
  }
}];
exports.EXPORT_IMG_RATIO_OPTIONS = EXPORT_IMG_RATIO_OPTIONS;
var EXPORT_IMG_RESOLUTION_OPTIONS = [{
  id: RESOLUTIONS.ONE_X,
  label: '1x',
  available: true,
  scale: 1,
  getSize: function getSize(screenW, screenH) {
    return {
      width: screenW,
      height: screenH
    };
  }
}, {
  id: RESOLUTIONS.TWO_X,
  label: '2x',
  available: true,
  scale: 2,
  getSize: function getSize(screenW, screenH) {
    return {
      width: screenW * 2,
      height: screenH * 2
    };
  }
}];
exports.EXPORT_IMG_RESOLUTION_OPTIONS = EXPORT_IMG_RESOLUTION_OPTIONS;
var EXPORT_DATA_TYPE = (0, _keymirror["default"])({
  CSV: null // SHAPEFILE: null,
  // JSON: null,
  // GEOJSON: null,
  // TOPOJSON: null

});
exports.EXPORT_DATA_TYPE = EXPORT_DATA_TYPE;
var EXPORT_DATA_TYPE_OPTIONS = [{
  id: EXPORT_DATA_TYPE.CSV,
  label: EXPORT_DATA_TYPE.CSV.toLowerCase(),
  available: true
} // {
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
]; // Export map types

exports.EXPORT_DATA_TYPE_OPTIONS = EXPORT_DATA_TYPE_OPTIONS;
var EXPORT_MAP_FORMATS = (0, _keymirror["default"])({
  HTML: null,
  JSON: null
});
exports.EXPORT_MAP_FORMATS = EXPORT_MAP_FORMATS;
var EXPORT_HTML_MAP_MODES = (0, _keymirror["default"])({
  READ: null,
  EDIT: null
}); // Export map options

exports.EXPORT_HTML_MAP_MODES = EXPORT_HTML_MAP_MODES;
var EXPORT_MAP_FORMAT_OPTIONS = Object.entries(EXPORT_MAP_FORMATS).map(function (entry) {
  return {
    id: entry[0],
    label: entry[1].toLowerCase(),
    available: true
  };
});
exports.EXPORT_MAP_FORMAT_OPTIONS = EXPORT_MAP_FORMAT_OPTIONS;
var EXPORT_HTML_MAP_MODE_OPTIONS = Object.entries(EXPORT_HTML_MAP_MODES).map(function (entry) {
  return {
    id: entry[0],
    label: "modal.exportMap.html.".concat(entry[1].toLowerCase()),
    available: true,
    url: (0, _utils.getHTMLMapModeTileUrl)(entry[1])
  };
});
exports.EXPORT_HTML_MAP_MODE_OPTIONS = EXPORT_HTML_MAP_MODE_OPTIONS;
var DEFAULT_UUID_COUNT = 6;
exports.DEFAULT_UUID_COUNT = DEFAULT_UUID_COUNT;
var DEFAULT_NOTIFICATION_MESSAGE = 'MESSAGE_NOT_PROVIDED';
exports.DEFAULT_NOTIFICATION_MESSAGE = DEFAULT_NOTIFICATION_MESSAGE;
var DEFAULT_NOTIFICATION_TYPES = (0, _keymirror["default"])({
  info: null,
  error: null,
  warning: null,
  success: null
});
exports.DEFAULT_NOTIFICATION_TYPES = DEFAULT_NOTIFICATION_TYPES;
var DEFAULT_NOTIFICATION_TOPICS = (0, _keymirror["default"])({
  global: null,
  file: null
}); // Minimum time between identical notifications about deck.gl errors

exports.DEFAULT_NOTIFICATION_TOPICS = DEFAULT_NOTIFICATION_TOPICS;
var THROTTLE_NOTIFICATION_TIME = 2500; // Animation

exports.THROTTLE_NOTIFICATION_TIME = THROTTLE_NOTIFICATION_TIME;
var BASE_SPEED = 600;
exports.BASE_SPEED = BASE_SPEED;
var FPS = 60;
/**
 * 4 Animation Window Types
 * 1. free
 *  |->  |->
 * Current time is a fixed range, animation controller calls next animation frames continuously to animation a moving window
 * The increment id based on domain / BASE_SPEED * SPEED
 *
 * 2. incremental
 * |    |->
 * Same as free, current time is a growing range, only the max value of range increment during animation.
 * The increment is also based on domain / BASE_SPEED * SPEED
 *
 * 3. point
 * o -> o
 * Current time is a point, animation controller calls next animation frame continuously to animation a moving point
 * The increment is based on domain / BASE_SPEED * SPEED
 *
 * 4. interval
 * o ~> o
 * Current time is a point. An array of sorted time steps need to be provided.
 * animation controller calls next animation at a interval when the point jumps to the next step
 */

exports.FPS = FPS;
var ANIMATION_WINDOW = (0, _keymirror["default"])({
  free: null,
  incremental: null,
  point: null,
  interval: null
});
exports.ANIMATION_WINDOW = ANIMATION_WINDOW;
var DEFAULT_TIME_FORMAT = 'MM/DD/YY HH:mm:ssa';
exports.DEFAULT_TIME_FORMAT = DEFAULT_TIME_FORMAT;
var SPEED_CONTROL_RANGE = [0, 10];
exports.SPEED_CONTROL_RANGE = SPEED_CONTROL_RANGE;
var SPEED_CONTROL_STEP = 0.001; // Geocoder

exports.SPEED_CONTROL_STEP = SPEED_CONTROL_STEP;
var GEOCODER_DATASET_NAME = 'geocoder_dataset';
exports.GEOCODER_DATASET_NAME = GEOCODER_DATASET_NAME;
var GEOCODER_LAYER_ID = 'geocoder_layer';
exports.GEOCODER_LAYER_ID = GEOCODER_LAYER_ID;
var GEOCODER_GEO_OFFSET = 0.05;
exports.GEOCODER_GEO_OFFSET = GEOCODER_GEO_OFFSET;
var GEOCODER_ICON_COLOR = [255, 0, 0];
exports.GEOCODER_ICON_COLOR = GEOCODER_ICON_COLOR;
var GEOCODER_ICON_SIZE = 80; // We could use directly react-map-gl-draw EditorMode but this would
// create a direct dependency with react-map-gl-draw
// Created this map to be independent from react-map-gl-draw

exports.GEOCODER_ICON_SIZE = GEOCODER_ICON_SIZE;
var EDITOR_MODES = {
  READ_ONLY: _reactMapGlDraw.EditorModes.READ_ONLY,
  DRAW_POLYGON: _reactMapGlDraw.EditorModes.DRAW_POLYGON,
  DRAW_RECTANGLE: _reactMapGlDraw.EditorModes.DRAW_RECTANGLE,
  EDIT: _reactMapGlDraw.EditorModes.EDIT_VERTEX
};
exports.EDITOR_MODES = EDITOR_MODES;
var EDITOR_AVAILABLE_LAYERS = [_types.LAYER_TYPES.point, _types.LAYER_TYPES.hexagon, _types.LAYER_TYPES.arc, _types.LAYER_TYPES.line, _types.LAYER_TYPES.hexagonId]; // GPU Filtering

/**
 * Max number of filter value buffers that deck.gl provides
 */

exports.EDITOR_AVAILABLE_LAYERS = EDITOR_AVAILABLE_LAYERS;
var MAX_GPU_FILTERS = 4;
exports.MAX_GPU_FILTERS = MAX_GPU_FILTERS;
var MAP_THUMBNAIL_DIMENSION = {
  width: 300,
  height: 200
};
exports.MAP_THUMBNAIL_DIMENSION = MAP_THUMBNAIL_DIMENSION;
var MAP_INFO_CHARACTER = {
  title: 100,
  description: 100
}; // Load data

exports.MAP_INFO_CHARACTER = MAP_INFO_CHARACTER;
var LOADING_METHODS = (0, _keymirror["default"])({
  upload: null,
  storage: null
});
exports.LOADING_METHODS = LOADING_METHODS;
var DATASET_FORMATS = (0, _keymirror["default"])({
  row: null,
  geojson: null,
  csv: null,
  keplergl: null
});
exports.DATASET_FORMATS = DATASET_FORMATS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJBQ1RJT05fUFJFRklYIiwiQ0xPVURGUk9OVCIsIklDT05fUFJFRklYIiwiREVGQVVMVF9NQVBCT1hfQVBJX1VSTCIsIkRBVEFfVEFCTEVfSUQiLCJERUxFVEVfREFUQV9JRCIsIkFERF9EQVRBX0lEIiwiRVhQT1JUX0lNQUdFX0lEIiwiRVhQT1JUX0RBVEFfSUQiLCJBRERfTUFQX1NUWUxFX0lEIiwiRVhQT1JUX01BUF9JRCIsIlNBVkVfTUFQX0lEIiwiT1ZFUldSSVRFX01BUF9JRCIsIlNIQVJFX01BUF9JRCIsIktFUExFUl9HTF9OQU1FIiwiS0VQTEVSX0dMX1ZFUlNJT04iLCJLRVBMRVJfR0xfV0VCU0lURSIsIkRJTUVOU0lPTlMiLCJzaWRlUGFuZWwiLCJ3aWR0aCIsIm1hcmdpbiIsInRvcCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsImhlYWRlckhlaWdodCIsIm1hcENvbnRyb2wiLCJwYWRkaW5nIiwiVEhFTUUiLCJsaWdodCIsImRhcmsiLCJiYXNlIiwiU0lERUJBUl9QQU5FTFMiLCJpZCIsImxhYmVsIiwiaWNvbkNvbXBvbmVudCIsIkxheWVycyIsIm9uQ2xpY2siLCJGaWx0ZXJGdW5uZWwiLCJDdXJzb3JDbGljayIsIlNldHRpbmdzIiwiUEFORUxTIiwiREVGQVVMVF9MQVlFUl9HUk9VUFMiLCJzbHVnIiwiZmlsdGVyIiwibWF0Y2giLCJkZWZhdWx0VmlzaWJpbGl0eSIsIkRFRkFVTFRfTUFQX1NUWUxFUyIsInVybCIsImljb24iLCJsYXllckdyb3VwcyIsIkdFT0pTT05fRklFTERTIiwiZ2VvanNvbiIsIklDT05fRklFTERTIiwiVFJJUF9QT0lOVF9GSUVMRFMiLCJUUklQX0FSQ19GSUVMRFMiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiRklMVEVSX1RZUEVTIiwicmFuZ2UiLCJzZWxlY3QiLCJpbnB1dCIsInRpbWVSYW5nZSIsIm11bHRpU2VsZWN0IiwicG9seWdvbiIsIlNDQUxFX1RZUEVTIiwib3JkaW5hbCIsInF1YW50aWxlIiwicXVhbnRpemUiLCJsaW5lYXIiLCJzcXJ0IiwibG9nIiwicG9pbnQiLCJTQ0FMRV9GVU5DIiwic2NhbGVMaW5lYXIiLCJzY2FsZVF1YW50aXplIiwic2NhbGVRdWFudGlsZSIsInNjYWxlT3JkaW5hbCIsInNjYWxlU3FydCIsInNjYWxlTG9nIiwic2NhbGVQb2ludCIsIkFMTF9GSUVMRF9UWVBFUyIsImRhdGUiLCJpbnRlZ2VyIiwicmVhbCIsInN0cmluZyIsInRpbWVzdGFtcCIsImFycmF5IiwiU09SVF9PUkRFUiIsIkFTQ0VORElORyIsIkRFU0NFTkRJTkciLCJVTlNPUlQiLCJUQUJMRV9PUFRJT04iLCJTT1JUX0FTQyIsIlNPUlRfREVTIiwiUElOIiwiVU5QSU4iLCJDT1BZIiwiVEFCTEVfT1BUSU9OX0xJU1QiLCJ2YWx1ZSIsImRpc3BsYXkiLCJBcnJvd1VwIiwiY29uZGl0aW9uIiwicHJvcHMiLCJzb3J0TW9kZSIsIkFycm93RG93biIsIkNhbmNlbCIsImlzU29ydGVkIiwiUGluIiwiaXNQaW5uZWQiLCJDbGlwYm9hcmQiLCJPUkFOR0UiLCJQSU5LIiwiUFVSUExFIiwiQkxVRSIsIkJMVUUyIiwiQkxVRTMiLCJHUkVFTiIsIkdSRUVOMiIsIlJFRCIsIkZJTEVEX1RZUEVfRElTUExBWSIsImNvbG9yIiwiRklFTERfQ09MT1JTIiwiSElHSExJR0hfQ09MT1JfM0QiLCJDSEFOTkVMX1NDQUxFUyIsInJhZGl1cyIsInNpemUiLCJjb2xvckFnZ3IiLCJzaXplQWdnciIsIkFHR1JFR0FUSU9OX1RZUEVTIiwiY291bnQiLCJhdmVyYWdlIiwibWF4aW11bSIsIm1pbmltdW0iLCJtZWRpYW4iLCJzdGRldiIsInN1bSIsInZhcmlhbmNlIiwibW9kZSIsImNvdW50VW5pcXVlIiwibGluZWFyRmllbGRTY2FsZUZ1bmN0aW9ucyIsImxpbmVhckZpZWxkQWdnclNjYWxlRnVuY3Rpb25zIiwib3JkaW5hbEZpZWxkU2NhbGVGdW5jdGlvbnMiLCJvcmRpbmFsRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnMiLCJub3RTdXBwb3J0ZWRTY2FsZU9wdHMiLCJub3RTdXBwb3J0QWdnck9wdHMiLCJERUZBVUxUX0FHR1JFR0FUSU9OIiwiRklFTERfT1BUUyIsInR5cGUiLCJzY2FsZSIsImZvcm1hdCIsImxlZ2VuZCIsImQiLCJ0b29sdGlwIiwiVE9PTFRJUF9GT1JNQVRfVFlQRVMiLCJOT05FIiwiREVDSU1BTCIsIlBFUkNFTlRBR0UiLCJEQVRFIiwiREFURV9USU1FIiwiQk9PTEVBTiIsIkNIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1Iiwia2V5IiwiZnQiLCJsZW5ndGgiLCJERUZBVUxUX0xBWUVSX0NPTE9SIiwidHJpcEFyYyIsImJlZ2ludHJpcF9sYXQiLCJkcm9wb2ZmX2xhdCIsInJlcXVlc3RfbGF0IiwiREVGQVVMVF9UT09MVElQX0ZJRUxEUyIsIk5PX1ZBTFVFX0NPTE9SIiwiTEFZRVJfQkxFTkRJTkdTIiwiYWRkaXRpdmUiLCJibGVuZEZ1bmMiLCJibGVuZEVxdWF0aW9uIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJNQVhfREVGQVVMVF9UT09MVElQUyIsIlJFU09MVVRJT05TIiwiT05FX1giLCJUV09fWCIsIkVYUE9SVF9JTUdfUkFUSU9TIiwiU0NSRUVOIiwiRk9VUl9CWV9USFJFRSIsIlNJWFRFRU5fQllfTklORSIsIkNVU1RPTSIsIkVYUE9SVF9JTUdfUkFUSU9fT1BUSU9OUyIsImdldFNpemUiLCJzY3JlZW5XIiwic2NyZWVuSCIsImhlaWdodCIsImhpZGRlbiIsIm1hcFciLCJtYXBIIiwiTWF0aCIsInJvdW5kIiwiRVhQT1JUX0lNR19SRVNPTFVUSU9OX09QVElPTlMiLCJhdmFpbGFibGUiLCJFWFBPUlRfREFUQV9UWVBFIiwiQ1NWIiwiRVhQT1JUX0RBVEFfVFlQRV9PUFRJT05TIiwidG9Mb3dlckNhc2UiLCJFWFBPUlRfTUFQX0ZPUk1BVFMiLCJIVE1MIiwiSlNPTiIsIkVYUE9SVF9IVE1MX01BUF9NT0RFUyIsIlJFQUQiLCJFRElUIiwiRVhQT1JUX01BUF9GT1JNQVRfT1BUSU9OUyIsImVudHJpZXMiLCJtYXAiLCJlbnRyeSIsIkVYUE9SVF9IVE1MX01BUF9NT0RFX09QVElPTlMiLCJERUZBVUxUX1VVSURfQ09VTlQiLCJERUZBVUxUX05PVElGSUNBVElPTl9NRVNTQUdFIiwiREVGQVVMVF9OT1RJRklDQVRJT05fVFlQRVMiLCJpbmZvIiwiZXJyb3IiLCJ3YXJuaW5nIiwic3VjY2VzcyIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyIsImdsb2JhbCIsImZpbGUiLCJUSFJPVFRMRV9OT1RJRklDQVRJT05fVElNRSIsIkJBU0VfU1BFRUQiLCJGUFMiLCJBTklNQVRJT05fV0lORE9XIiwiZnJlZSIsImluY3JlbWVudGFsIiwiaW50ZXJ2YWwiLCJERUZBVUxUX1RJTUVfRk9STUFUIiwiU1BFRURfQ09OVFJPTF9SQU5HRSIsIlNQRUVEX0NPTlRST0xfU1RFUCIsIkdFT0NPREVSX0RBVEFTRVRfTkFNRSIsIkdFT0NPREVSX0xBWUVSX0lEIiwiR0VPQ09ERVJfR0VPX09GRlNFVCIsIkdFT0NPREVSX0lDT05fQ09MT1IiLCJHRU9DT0RFUl9JQ09OX1NJWkUiLCJFRElUT1JfTU9ERVMiLCJSRUFEX09OTFkiLCJFZGl0b3JNb2RlcyIsIkRSQVdfUE9MWUdPTiIsIkRSQVdfUkVDVEFOR0xFIiwiRURJVF9WRVJURVgiLCJFRElUT1JfQVZBSUxBQkxFX0xBWUVSUyIsIkxBWUVSX1RZUEVTIiwiaGV4YWdvbiIsImFyYyIsImxpbmUiLCJoZXhhZ29uSWQiLCJNQVhfR1BVX0ZJTFRFUlMiLCJNQVBfVEhVTUJOQUlMX0RJTUVOU0lPTiIsIk1BUF9JTkZPX0NIQVJBQ1RFUiIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJMT0FESU5HX01FVEhPRFMiLCJ1cGxvYWQiLCJzdG9yYWdlIiwiREFUQVNFVF9GT1JNQVRTIiwicm93IiwiY3N2Iiwia2VwbGVyZ2wiXSwibWFw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QUUsSUFEK0I7QUFFdkNDLEVBQUFBLE9BQU8sRUFBRTtBQUY4QixDQUFWLENBQXhCOztBQUtBLElBQU1DLGVBQWUsR0FBRywyQkFBVTtBQUN2Q0MsRUFBQUEsR0FBRyxFQUFFLElBRGtDO0FBRXZDdE4sRUFBQUEsT0FBTyxFQUFFLElBRjhCO0FBR3ZDdU4sRUFBQUEsR0FBRyxFQUFFLElBSGtDO0FBSXZDQyxFQUFBQSxRQUFRLEVBQUU7QUFKNkIsQ0FBVixDQUF4QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCB7RWRpdG9yTW9kZXN9IGZyb20gJ3JlYWN0LW1hcC1nbC1kcmF3JztcblxuaW1wb3J0IHtcbiAgc2NhbGVMaW5lYXIsXG4gIHNjYWxlUXVhbnRpemUsXG4gIHNjYWxlUXVhbnRpbGUsXG4gIHNjYWxlT3JkaW5hbCxcbiAgc2NhbGVTcXJ0LFxuICBzY2FsZUxvZyxcbiAgc2NhbGVQb2ludFxufSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQge1xuICBMYXllcnMsXG4gIEZpbHRlckZ1bm5lbCxcbiAgU2V0dGluZ3MsXG4gIEN1cnNvckNsaWNrLFxuICBQaW4sXG4gIEFycm93RG93bixcbiAgQXJyb3dVcCxcbiAgQ2xpcGJvYXJkLFxuICBDYW5jZWxcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtnZXRIVE1MTWFwTW9kZVRpbGVVcmx9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7VE9PTFRJUF9GT1JNQVRfVFlQRVN9IGZyb20gJy4vdG9vbHRpcCc7XG5pbXBvcnQge0xBWUVSX1RZUEVTfSBmcm9tICdsYXllcnMvdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQUNUSU9OX1BSRUZJWCA9ICdAQGtlcGxlci5nbC8nO1xuZXhwb3J0IGNvbnN0IENMT1VERlJPTlQgPSAnaHR0cHM6Ly9kMWEzZjRzcGF6enJwNC5jbG91ZGZyb250Lm5ldC9rZXBsZXIuZ2wnO1xuZXhwb3J0IGNvbnN0IElDT05fUFJFRklYID0gYCR7Q0xPVURGUk9OVH0vZ2VvZHVkZWA7XG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVBCT1hfQVBJX1VSTCA9ICdodHRwczovL2FwaS5tYXBib3guY29tJztcblxuLy8gTW9kYWwgSWRzXG4vKipcbiAqIE1vZGFsIGlkOiBkYXRhIHRhYmxlXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBEQVRBX1RBQkxFX0lEID0gJ2RhdGFUYWJsZSc7XG4vKipcbiAqIE1vZGFsIGlkOiBkZWxldGUgZGF0YXNldCBjb25maXJtIGRpYWxvZ1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVMRVRFX0RBVEFfSUQgPSAnZGVsZXRlRGF0YSc7XG4vKipcbiAqIE1vZGFsIGlkOiBhZGQgZGF0YSBtb2RhbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgQUREX0RBVEFfSUQgPSAnYWRkRGF0YSc7XG4vKipcbiAqIE1vZGFsIGlkOiBleHBvcnQgaW1hZ2UgbW9kYWxcbiAqIEBjb25zdGFudFxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IEVYUE9SVF9JTUFHRV9JRCA9ICdleHBvcnRJbWFnZSc7XG4vKipcbiAqIE1vZGFsIGlkOiBleHBvcnQgZGF0YSBtb2RhbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgRVhQT1JUX0RBVEFfSUQgPSAnZXhwb3J0RGF0YSc7XG4vKipcbiAqIE1vZGFsIGlkOiBhZGQgY3VzdG9tIG1hcCBzdHlsZSBtb2RhbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgQUREX01BUF9TVFlMRV9JRCA9ICdhZGRNYXBTdHlsZSc7XG4vKipcbiAqIE1vZGFsIGlkOiBleHBvcnQgbWFwIG1vZGFsXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBFWFBPUlRfTUFQX0lEID0gJ2V4cG9ydE1hcCc7XG4vKipcbiAqIE1vZGFsIGlkOiBzYXZlIG1hcCBtb2RhbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgU0FWRV9NQVBfSUQgPSAnc2F2ZU1hcCc7XG4vKipcbiAqIE1vZGFsIGlkOiBjb25maXJtIHRvIG92ZXJ3cml0ZSBzYXZlZCBtYXBcbiAqIEBjb25zdGFudFxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IE9WRVJXUklURV9NQVBfSUQgPSAnb3ZlcndyaXRlTWFwJztcbi8qKlxuICogTW9kYWwgaWQ6IHNoYXJlIG1hcCB1cmwgbW9kYWxcbiAqIEBjb25zdGFudFxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IFNIQVJFX01BUF9JRCA9ICdzaGFyZU1hcCc7XG5cbmV4cG9ydCBjb25zdCBLRVBMRVJfR0xfTkFNRSA9ICdrZXBsZXIuZ2wnO1xuXG4vLyBfX1BBQ0tBR0VfVkVSU0lPTl9fIGlzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYnkgQmFiZWwvV2VicGFjayBkdXJpbmcgdGhlIGJ1aWxkaW5nIHByb2Nlc3Ncbi8vIFNpbmNlIHdlIGFyZSBpbmplY3RpbmcgdGhpcyBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3Mgd2l0aCBiYWJlbFxuLy8gd2hpbGUgZGV2ZWxvcGluZyBWRVJTSU9OIGlzIG5vdCBkZWZpbmVkLCB3ZSBjYXB0dXJlIHRoZSBleGNlcHRpb24gYW5kIHJldHVyblxuLy8gYW4gZW1wdHkgc3RyaW5nIHdoaWNoIHdpbGwgYWxsb3cgdXMgdG8gcmV0cmlldmUgdGhlIGxhdGVzdCB1bWQgdmVyc2lvblxuZXhwb3J0IGNvbnN0IEtFUExFUl9HTF9WRVJTSU9OID0gJ19fUEFDS0FHRV9WRVJTSU9OX18nO1xuZXhwb3J0IGNvbnN0IEtFUExFUl9HTF9XRUJTSVRFID0gJ2h0dHA6Ly9rZXBsZXIuZ2wvJztcblxuZXhwb3J0IGNvbnN0IERJTUVOU0lPTlMgPSB7XG4gIHNpZGVQYW5lbDoge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgbWFyZ2luOiB7dG9wOiAyMCwgbGVmdDogMjAsIGJvdHRvbTogMzAsIHJpZ2h0OiAyMH0sXG4gICAgaGVhZGVySGVpZ2h0OiA5NlxuICB9LFxuICBtYXBDb250cm9sOiB7XG4gICAgd2lkdGg6IDE4NCxcbiAgICBwYWRkaW5nOiAxMlxuICB9XG59O1xuXG4vKipcbiAqIFRoZW1lIG5hbWUgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIGBLZXBsZXJHbGAgYHByb3AudGhlbWVgLlxuICogQXZhaWxhYmxlIHRoZW1lcyBhcmUgYFRIRU1FLmxpZ2h0YCBhbmQgYFRIRU1FLmRhcmtgLiBEZWZhdWx0IHRoZW1lIGlzIGBUSEVNRS5kYXJrYFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7b2JqZWN0fVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiBjb25zdCBNYXAgPSAoKSA9PiA8S2VwbGVyR2wgdGhlbWU9e1RIRU1FLmxpZ2h0fSBpZD1cIm1hcFwiLz5cbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgVEhFTUUgPSBrZXlNaXJyb3Ioe1xuICBsaWdodDogbnVsbCxcbiAgZGFyazogbnVsbCxcbiAgYmFzZTogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBTSURFQkFSX1BBTkVMUyA9IFtcbiAge1xuICAgIGlkOiAnbGF5ZXInLFxuICAgIGxhYmVsOiAnc2lkZWJhci5wYW5lbHMubGF5ZXInLFxuICAgIGljb25Db21wb25lbnQ6IExheWVycyxcbiAgICBvbkNsaWNrOiBudWxsXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZpbHRlcicsXG4gICAgbGFiZWw6ICdzaWRlYmFyLnBhbmVscy5maWx0ZXInLFxuICAgIGljb25Db21wb25lbnQ6IEZpbHRlckZ1bm5lbCxcbiAgICBvbkNsaWNrOiBudWxsXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVyYWN0aW9uJyxcbiAgICBsYWJlbDogJ3NpZGViYXIucGFuZWxzLmludGVyYWN0aW9uJyxcbiAgICBpY29uQ29tcG9uZW50OiBDdXJzb3JDbGljayxcbiAgICBvbkNsaWNrOiBudWxsXG4gIH0sXG4gIHtcbiAgICBpZDogJ21hcCcsXG4gICAgbGFiZWw6ICdzaWRlYmFyLnBhbmVscy5iYXNlbWFwJyxcbiAgICBpY29uQ29tcG9uZW50OiBTZXR0aW5ncyxcbiAgICBvbkNsaWNrOiBudWxsXG4gIH1cbl07XG5cbi8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbmV4cG9ydCBjb25zdCBQQU5FTFMgPSBTSURFQkFSX1BBTkVMUztcblxuLy8gTUFQIFNUWUxFU1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQVlFUl9HUk9VUFMgPSBbXG4gIHtcbiAgICBzbHVnOiAnbGFiZWwnLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC8oPz0obGFiZWx8cGxhY2UtfHBvaS0pKS8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzbHVnOiAncm9hZCcsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PShyb2FkfHJhaWx3YXl8dHVubmVsfHN0cmVldHxicmlkZ2UpKSg/IS4qbGFiZWwpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdib3JkZXInLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC9ib3JkZXJ8Ym91bmRhcmllcy8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiBmYWxzZVxuICB9LFxuICB7XG4gICAgc2x1ZzogJ2J1aWxkaW5nJyxcbiAgICBmaWx0ZXI6ICh7aWR9KSA9PiBpZC5tYXRjaCgvYnVpbGRpbmcvKSxcbiAgICBkZWZhdWx0VmlzaWJpbGl0eTogdHJ1ZVxuICB9LFxuICB7XG4gICAgc2x1ZzogJ3dhdGVyJyxcbiAgICBmaWx0ZXI6ICh7aWR9KSA9PiBpZC5tYXRjaCgvKD89KHdhdGVyfHN0cmVhbXxmZXJyeSkpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdsYW5kJyxcbiAgICBmaWx0ZXI6ICh7aWR9KSA9PiBpZC5tYXRjaCgvKD89KHBhcmtzfGxhbmRjb3ZlcnxpbmR1c3RyaWFsfHNhbmR8aGlsbHNoYWRlKSkvKSxcbiAgICBkZWZhdWx0VmlzaWJpbGl0eTogdHJ1ZVxuICB9LFxuICB7XG4gICAgc2x1ZzogJzNkIGJ1aWxkaW5nJyxcbiAgICBmaWx0ZXI6ICgpID0+IGZhbHNlLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiBmYWxzZVxuICB9XG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVBfU1RZTEVTID0gW1xuICB7XG4gICAgaWQ6ICdkYXJrJyxcbiAgICBsYWJlbDogJ0RhcmsnLFxuICAgIHVybDogJ21hcGJveDovL3N0eWxlcy91YmVyZGF0YS9jam9xYmJmNmw5azMwMnNsOTZ0eXZrYTA5JyxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9EQVJLX1YyLnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6IERFRkFVTFRfTEFZRVJfR1JPVVBTXG4gIH0sXG4gIHtcbiAgICBpZDogJ2xpZ2h0JyxcbiAgICBsYWJlbDogJ0xpZ2h0JyxcbiAgICB1cmw6ICdtYXBib3g6Ly9zdHlsZXMvdWJlcmRhdGEvY2pvcWI5ajMzOWsxZjJzbDl0NWljNWJuNCcsXG4gICAgaWNvbjogYCR7SUNPTl9QUkVGSVh9L1VCRVJfTElHSFRfVjIucG5nYCxcbiAgICBsYXllckdyb3VwczogREVGQVVMVF9MQVlFUl9HUk9VUFNcbiAgfSxcbiAge1xuICAgIGlkOiAnbXV0ZWQnLFxuICAgIGxhYmVsOiAnTXV0ZWQgTGlnaHQnLFxuICAgIHVybDogJ21hcGJveDovL3N0eWxlcy91YmVyZGF0YS9jamZ5bDAza3AxdHVsMnNtZjV2MnRiZGQ0JyxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9NVVRFRF9MSUdIVC5wbmdgLFxuICAgIGxheWVyR3JvdXBzOiBERUZBVUxUX0xBWUVSX0dST1VQU1xuICB9LFxuICB7XG4gICAgaWQ6ICdtdXRlZF9uaWdodCcsXG4gICAgbGFiZWw6ICdNdXRlZCBOaWdodCcsXG4gICAgdXJsOiAnbWFwYm94Oi8vc3R5bGVzL3ViZXJkYXRhL2NqZnhobGlrbWFqMWIyc295emV2bnl3Z3MnLFxuICAgIGljb246IGAke0lDT05fUFJFRklYfS9VQkVSX01VVEVEX05JR0hULnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6IERFRkFVTFRfTEFZRVJfR1JPVVBTXG4gIH0sXG4gIHtcbiAgICBpZDogJ3NhdGVsbGl0ZScsXG4gICAgbGFiZWw6ICdTYXRlbGxpdGUnLFxuICAgIHVybDogYG1hcGJveDovL3N0eWxlcy9tYXBib3gvc2F0ZWxsaXRlLXY5YCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9TQVRFTExJVEUucG5nYFxuICB9XG5dO1xuXG5leHBvcnQgY29uc3QgR0VPSlNPTl9GSUVMRFMgPSB7XG4gIGdlb2pzb246IFsnX2dlb2pzb24nLCAnYWxsX3BvaW50cycsICdnZW9qc29uJ11cbn07XG5cbmV4cG9ydCBjb25zdCBJQ09OX0ZJRUxEUyA9IHtcbiAgaWNvbjogWydpY29uJ11cbn07XG5cbmV4cG9ydCBjb25zdCBUUklQX1BPSU5UX0ZJRUxEUyA9IFtcbiAgWydsYXQnLCAnbG5nJ10sXG4gIFsnbGF0JywgJ2xvbiddLFxuICBbJ2xhdGl0dWRlJywgJ2xvbmdpdHVkZSddXG5dO1xuXG5leHBvcnQgY29uc3QgVFJJUF9BUkNfRklFTERTID0ge1xuICBsYXQwOiAnYmVnaW50cmlwJyxcbiAgbG5nMDogJ2JlZ2ludHJpcCcsXG4gIGxhdDE6ICdkcm9wb2ZmJyxcbiAgbG5nMTogJ2Ryb3BvZmYnXG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgcmFuZ2U6IG51bGwsXG4gIHNlbGVjdDogbnVsbCxcbiAgaW5wdXQ6IG51bGwsXG4gIHRpbWVSYW5nZTogbnVsbCxcbiAgbXVsdGlTZWxlY3Q6IG51bGwsXG4gIHBvbHlnb246IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgU0NBTEVfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBvcmRpbmFsOiBudWxsLFxuICBxdWFudGlsZTogbnVsbCxcbiAgcXVhbnRpemU6IG51bGwsXG4gIGxpbmVhcjogbnVsbCxcbiAgc3FydDogbnVsbCxcbiAgbG9nOiBudWxsLFxuXG4gIC8vIG9yZGluYWwgZG9tYWluIHRvIGxpbmVhciByYW5nZVxuICBwb2ludDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBTQ0FMRV9GVU5DID0ge1xuICBbU0NBTEVfVFlQRVMubGluZWFyXTogc2NhbGVMaW5lYXIsXG4gIFtTQ0FMRV9UWVBFUy5xdWFudGl6ZV06IHNjYWxlUXVhbnRpemUsXG4gIFtTQ0FMRV9UWVBFUy5xdWFudGlsZV06IHNjYWxlUXVhbnRpbGUsXG4gIFtTQ0FMRV9UWVBFUy5vcmRpbmFsXTogc2NhbGVPcmRpbmFsLFxuICBbU0NBTEVfVFlQRVMuc3FydF06IHNjYWxlU3FydCxcbiAgW1NDQUxFX1RZUEVTLmxvZ106IHNjYWxlTG9nLFxuICBbU0NBTEVfVFlQRVMucG9pbnRdOiBzY2FsZVBvaW50XG59O1xuXG5leHBvcnQgY29uc3QgQUxMX0ZJRUxEX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgYm9vbGVhbjogbnVsbCxcbiAgZGF0ZTogbnVsbCxcbiAgZ2VvanNvbjogbnVsbCxcbiAgaW50ZWdlcjogbnVsbCxcbiAgcmVhbDogbnVsbCxcbiAgc3RyaW5nOiBudWxsLFxuICB0aW1lc3RhbXA6IG51bGwsXG4gIGFycmF5OiBudWxsLFxuICBwb2ludDogbnVsbFxufSk7XG5cbi8vIERhdGEgVGFibGVcbmV4cG9ydCBjb25zdCBTT1JUX09SREVSID0ga2V5TWlycm9yKHtcbiAgQVNDRU5ESU5HOiBudWxsLFxuICBERVNDRU5ESU5HOiBudWxsLFxuICBVTlNPUlQ6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgVEFCTEVfT1BUSU9OID0ga2V5TWlycm9yKHtcbiAgU09SVF9BU0M6IG51bGwsXG4gIFNPUlRfREVTOiBudWxsLFxuICBVTlNPUlQ6IG51bGwsXG4gIFBJTjogbnVsbCxcbiAgVU5QSU46IG51bGwsXG4gIENPUFk6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgVEFCTEVfT1BUSU9OX0xJU1QgPSBbXG4gIHtcbiAgICB2YWx1ZTogVEFCTEVfT1BUSU9OLlNPUlRfQVNDLFxuICAgIGRpc3BsYXk6ICdTb3J0IEFzY2VuZGluZycsXG4gICAgaWNvbjogQXJyb3dVcCxcbiAgICBjb25kaXRpb246IHByb3BzID0+IHByb3BzLnNvcnRNb2RlICE9PSBTT1JUX09SREVSLkFTQ0VORElOR1xuICB9LFxuICB7XG4gICAgdmFsdWU6IFRBQkxFX09QVElPTi5TT1JUX0RFUyxcbiAgICBkaXNwbGF5OiAnU29ydCBEZXNjZW5kaW5nJyxcbiAgICBpY29uOiBBcnJvd0Rvd24sXG4gICAgY29uZGl0aW9uOiBwcm9wcyA9PiBwcm9wcy5zb3J0TW9kZSAhPT0gU09SVF9PUkRFUi5ERVNDRU5ESU5HXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogVEFCTEVfT1BUSU9OLlVOU09SVCxcbiAgICBkaXNwbGF5OiAnVW5zb3J0IENvbHVtbicsXG4gICAgaWNvbjogQ2FuY2VsLFxuICAgIGNvbmRpdGlvbjogcHJvcHMgPT4gcHJvcHMuaXNTb3J0ZWRcbiAgfSxcbiAge3ZhbHVlOiBUQUJMRV9PUFRJT04uUElOLCBkaXNwbGF5OiAnUGluIENvbHVtbicsIGljb246IFBpbiwgY29uZGl0aW9uOiBwcm9wcyA9PiAhcHJvcHMuaXNQaW5uZWR9LFxuICB7XG4gICAgdmFsdWU6IFRBQkxFX09QVElPTi5VTlBJTixcbiAgICBkaXNwbGF5OiAnVW5waW4gQ29sdW1uJyxcbiAgICBpY29uOiBDYW5jZWwsXG4gICAgY29uZGl0aW9uOiBwcm9wcyA9PiBwcm9wcy5pc1Bpbm5lZFxuICB9LFxuICB7dmFsdWU6IFRBQkxFX09QVElPTi5DT1BZLCBkaXNwbGF5OiAnQ29weSBDb2x1bW4nLCBpY29uOiBDbGlwYm9hcmR9XG5dO1xuXG5jb25zdCBPUkFOR0UgPSAnMjQ4LCAxOTQsIDI4JztcbmNvbnN0IFBJTksgPSAnMjMxLCAxODksIDE5NCc7XG5jb25zdCBQVVJQTEUgPSAnMTYwLCAxMDYsIDIwNic7XG5jb25zdCBCTFVFID0gJzE0MCwgMjEwLCAyMDUnO1xuY29uc3QgQkxVRTIgPSAnMTA2LCAxNjAsIDIwNic7XG5jb25zdCBCTFVFMyA9ICcwLCAxNzIsIDIzNyc7XG5jb25zdCBHUkVFTiA9ICcxMDYsIDE2MCwgNTYnO1xuY29uc3QgR1JFRU4yID0gJzIzLCAyMDcsIDExNCc7XG5jb25zdCBSRUQgPSAnMjM3LCA4OCwgMTA2JztcblxuZXhwb3J0IGNvbnN0IEZJTEVEX1RZUEVfRElTUExBWSA9IHtcbiAgW0FMTF9GSUVMRF9UWVBFUy5ib29sZWFuXToge1xuICAgIGxhYmVsOiAnYm9vbCcsXG4gICAgY29sb3I6IFBJTktcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5kYXRlXToge1xuICAgIGxhYmVsOiAnZGF0ZScsXG4gICAgY29sb3I6IFBVUlBMRVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb25dOiB7XG4gICAgbGFiZWw6ICdnZW8nLFxuICAgIGNvbG9yOiBCTFVFMlxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiB7XG4gICAgbGFiZWw6ICdpbnQnLFxuICAgIGNvbG9yOiBPUkFOR0VcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXToge1xuICAgIGxhYmVsOiAnZmxvYXQnLFxuICAgIGNvbG9yOiBPUkFOR0VcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5zdHJpbmddOiB7XG4gICAgbGFiZWw6ICdzdHJpbmcnLFxuICAgIGNvbG9yOiBCTFVFXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMudGltZXN0YW1wXToge1xuICAgIGxhYmVsOiAndGltZScsXG4gICAgY29sb3I6IEdSRUVOXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMuYXJyYXldOiB7XG4gICAgbGFiZWw6ICdhcnJheScsXG4gICAgY29sb3I6IEdSRUVOMlxuICB9LFxuICAvLyBmaWVsZCBwYWlyc1xuICBbQUxMX0ZJRUxEX1RZUEVTLnBvaW50XToge1xuICAgIGxhYmVsOiAncG9pbnQnLFxuICAgIGNvbG9yOiBCTFVFM1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgRklFTERfQ09MT1JTID0ge1xuICBkZWZhdWx0OiBSRURcbn07XG5leHBvcnQgY29uc3QgSElHSExJR0hfQ09MT1JfM0QgPSBbMjU1LCAyNTUsIDI1NSwgNjBdO1xuZXhwb3J0IGNvbnN0IENIQU5ORUxfU0NBTEVTID0ga2V5TWlycm9yKHtcbiAgY29sb3I6IG51bGwsXG4gIHJhZGl1czogbnVsbCxcbiAgc2l6ZTogbnVsbCxcbiAgY29sb3JBZ2dyOiBudWxsLFxuICBzaXplQWdncjogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBBR0dSRUdBVElPTl9UWVBFUyA9IHtcbiAgLy8gZGVmYXVsdFxuICBjb3VudDogJ2NvdW50JyxcbiAgLy8gbGluZWFyXG4gIGF2ZXJhZ2U6ICdhdmVyYWdlJyxcbiAgbWF4aW11bTogJ21heGltdW0nLFxuICBtaW5pbXVtOiAnbWluaW11bScsXG4gIG1lZGlhbjogJ21lZGlhbicsXG4gIHN0ZGV2OiAnc3RkZXYnLFxuICBzdW06ICdzdW0nLFxuICB2YXJpYW5jZTogJ3ZhcmlhbmNlJyxcbiAgLy8gb3JkaW5hbFxuICBtb2RlOiAnbW9kZScsXG4gIGNvdW50VW5pcXVlOiAnY291bnQgdW5pcXVlJ1xufTtcblxuZXhwb3J0IGNvbnN0IGxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvcl06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdLFxuICBbQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXTogW1NDQUxFX1RZUEVTLnNxcnRdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuc2l6ZV06IFtTQ0FMRV9UWVBFUy5saW5lYXIsIFNDQUxFX1RZUEVTLnNxcnQsIFNDQUxFX1RZUEVTLmxvZ11cbn07XG5cbmV4cG9ydCBjb25zdCBsaW5lYXJGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9ucyA9IHtcbiAgW0NIQU5ORUxfU0NBTEVTLmNvbG9yQWdncl06IHtcbiAgICBbQUdHUkVHQVRJT05fVFlQRVMuYXZlcmFnZV06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdLFxuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5tYXhpbXVtXTogW1NDQUxFX1RZUEVTLnF1YW50aXplLCBTQ0FMRV9UWVBFUy5xdWFudGlsZV0sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLm1pbmltdW1dOiBbU0NBTEVfVFlQRVMucXVhbnRpemUsIFNDQUxFX1RZUEVTLnF1YW50aWxlXSxcbiAgICBbQUdHUkVHQVRJT05fVFlQRVMubWVkaWFuXTogW1NDQUxFX1RZUEVTLnF1YW50aXplLCBTQ0FMRV9UWVBFUy5xdWFudGlsZV0sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLnN0ZGV2XTogW1NDQUxFX1RZUEVTLnF1YW50aXplLCBTQ0FMRV9UWVBFUy5xdWFudGlsZV0sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLnN1bV06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdLFxuICAgIFtBR0dSRUdBVElPTl9UWVBFUy52YXJpYW5jZV06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdXG4gIH0sXG5cbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXToge1xuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5hdmVyYWdlXTogW1NDQUxFX1RZUEVTLmxpbmVhciwgU0NBTEVfVFlQRVMuc3FydCwgU0NBTEVfVFlQRVMubG9nXSxcbiAgICBbQUdHUkVHQVRJT05fVFlQRVMubWF4aW11bV06IFtTQ0FMRV9UWVBFUy5saW5lYXIsIFNDQUxFX1RZUEVTLnNxcnQsIFNDQUxFX1RZUEVTLmxvZ10sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLm1pbmltdW1dOiBbU0NBTEVfVFlQRVMubGluZWFyLCBTQ0FMRV9UWVBFUy5zcXJ0LCBTQ0FMRV9UWVBFUy5sb2ddLFxuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5tZWRpYW5dOiBbU0NBTEVfVFlQRVMubGluZWFyLCBTQ0FMRV9UWVBFUy5zcXJ0LCBTQ0FMRV9UWVBFUy5sb2ddLFxuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5zdGRldl06IFtTQ0FMRV9UWVBFUy5saW5lYXIsIFNDQUxFX1RZUEVTLnNxcnQsIFNDQUxFX1RZUEVTLmxvZ10sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLnN1bV06IFtTQ0FMRV9UWVBFUy5saW5lYXIsIFNDQUxFX1RZUEVTLnNxcnQsIFNDQUxFX1RZUEVTLmxvZ10sXG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLnZhcmlhbmNlXTogW1NDQUxFX1RZUEVTLmxpbmVhciwgU0NBTEVfVFlQRVMuc3FydCwgU0NBTEVfVFlQRVMubG9nXVxuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgb3JkaW5hbEZpZWxkU2NhbGVGdW5jdGlvbnMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvcl06IFtTQ0FMRV9UWVBFUy5vcmRpbmFsXSxcbiAgW0NIQU5ORUxfU0NBTEVTLnJhZGl1c106IFtTQ0FMRV9UWVBFUy5wb2ludF0sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplXTogW1NDQUxFX1RZUEVTLnBvaW50XVxufTtcblxuZXhwb3J0IGNvbnN0IG9yZGluYWxGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9ucyA9IHtcbiAgLy8gW0NIQU5ORUxfU0NBTEVTLmNvbG9yQWdncl06IFtTQ0FMRV9UWVBFUy5vcmRpbmFsLCBTQ0FMRV9UWVBFUy5saW5lYXJdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyXToge1xuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5tb2RlXTogW1NDQUxFX1RZUEVTLm9yZGluYWxdLFxuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5jb3VudFVuaXF1ZV06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdXG4gIH0sXG5cbiAgLy8gQ3VycmVudGx5IGRvZXNuJ3Qgc3VwcG9ydCB5ZXRcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXToge31cbn07XG5cbmV4cG9ydCBjb25zdCBub3RTdXBwb3J0ZWRTY2FsZU9wdHMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvcl06IFtdLFxuICBbQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXTogW10sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplXTogW11cbn07XG5cbmV4cG9ydCBjb25zdCBub3RTdXBwb3J0QWdnck9wdHMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JdOiB7fSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXToge31cbn07XG5cbi8qKlxuICogRGVmYXVsdCBhZ2dyZWdhdGlvbiBhcmUgYmFzZWQgb24gb2N1bnRcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQUdHUkVHQVRJT04gPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JdOiB7XG4gICAgW0FHR1JFR0FUSU9OX1RZUEVTLmNvdW50XTogW1NDQUxFX1RZUEVTLnF1YW50aXplLCBTQ0FMRV9UWVBFUy5xdWFudGlsZV1cbiAgfSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXToge1xuICAgIFtBR0dSRUdBVElPTl9UWVBFUy5jb3VudF06IFtTQ0FMRV9UWVBFUy5saW5lYXIsIFNDQUxFX1RZUEVTLnNxcnQsIFNDQUxFX1RZUEVTLmxvZ11cbiAgfVxufTtcblxuLyoqXG4gKiBEZWZpbmUgd2hhdCB0eXBlIG9mIHNjYWxlIG9wZXJhdGlvbiBpcyBhbGxvd2VkIG9uIGVhY2ggdHlwZSBvZiBmaWVsZHNcbiAqL1xuZXhwb3J0IGNvbnN0IEZJRUxEX09QVFMgPSB7XG4gIHN0cmluZzoge1xuICAgIHR5cGU6ICdjYXRlZ29yaWNhbCcsXG4gICAgc2NhbGU6IHtcbiAgICAgIC4uLm9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ub3JkaW5hbEZpZWxkQWdnclNjYWxlRnVuY3Rpb25zXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkLFxuICAgICAgdG9vbHRpcDogW11cbiAgICB9XG4gIH0sXG4gIHJlYWw6IHtcbiAgICB0eXBlOiAnbnVtZXJpY2FsJyxcbiAgICBzY2FsZToge1xuICAgICAgLi4ubGluZWFyRmllbGRTY2FsZUZ1bmN0aW9ucyxcbiAgICAgIC4uLmxpbmVhckZpZWxkQWdnclNjYWxlRnVuY3Rpb25zXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkLFxuICAgICAgdG9vbHRpcDogW1xuICAgICAgICBUT09MVElQX0ZPUk1BVF9UWVBFUy5OT05FLFxuICAgICAgICBUT09MVElQX0ZPUk1BVF9UWVBFUy5ERUNJTUFMLFxuICAgICAgICBUT09MVElQX0ZPUk1BVF9UWVBFUy5QRVJDRU5UQUdFXG4gICAgICBdXG4gICAgfVxuICB9LFxuICB0aW1lc3RhbXA6IHtcbiAgICB0eXBlOiAndGltZScsXG4gICAgc2NhbGU6IHtcbiAgICAgIC4uLmxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgICAuLi5ub3RTdXBwb3J0QWdnck9wdHNcbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGQsXG4gICAgICB0b29sdGlwOiBbXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLk5PTkUsXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLkRBVEUsXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLkRBVEVfVElNRVxuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgaW50ZWdlcjoge1xuICAgIHR5cGU6ICdudW1lcmljYWwnLFxuICAgIHNjYWxlOiB7XG4gICAgICAuLi5saW5lYXJGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ubGluZWFyRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnNcbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGQsXG4gICAgICB0b29sdGlwOiBbXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLk5PTkUsXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUwsXG4gICAgICAgIFRPT0xUSVBfRk9STUFUX1RZUEVTLlBFUkNFTlRBR0VcbiAgICAgIF1cbiAgICB9XG4gIH0sXG4gIGJvb2xlYW46IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgc2NhbGU6IHtcbiAgICAgIC4uLm9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ub3JkaW5hbEZpZWxkQWdnclNjYWxlRnVuY3Rpb25zXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkLFxuICAgICAgdG9vbHRpcDogW1RPT0xUSVBfRk9STUFUX1RZUEVTLk5PTkUsIFRPT0xUSVBfRk9STUFUX1RZUEVTLkJPT0xFQU5dXG4gICAgfVxuICB9LFxuICBkYXRlOiB7XG4gICAgc2NhbGU6IHtcbiAgICAgIC4uLm9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ub3JkaW5hbEZpZWxkQWdnclNjYWxlRnVuY3Rpb25zXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkLFxuICAgICAgdG9vbHRpcDogW1RPT0xUSVBfRk9STUFUX1RZUEVTLk5PTkUsIFRPT0xUSVBfRk9STUFUX1RZUEVTLkRBVEVdXG4gICAgfVxuICB9LFxuICBnZW9qc29uOiB7XG4gICAgdHlwZTogJ2dlb21ldHJ5JyxcbiAgICBzY2FsZToge1xuICAgICAgLi4ubm90U3VwcG9ydGVkU2NhbGVPcHRzLFxuICAgICAgLi4ubm90U3VwcG9ydEFnZ3JPcHRzXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiAnLi4uJyxcbiAgICAgIHRvb2x0aXA6IFtdXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTID0gT2JqZWN0LmtleXMoQ0hBTk5FTF9TQ0FMRVMpLnJlZHVjZShcbiAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAuLi5hY2N1LFxuICAgIFtrZXldOiBPYmplY3Qua2V5cyhGSUVMRF9PUFRTKS5maWx0ZXIoZnQgPT4gT2JqZWN0LmtleXMoRklFTERfT1BUU1tmdF0uc2NhbGVba2V5XSkubGVuZ3RoKVxuICB9KSxcbiAge31cbik7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0xBWUVSX0NPTE9SID0ge1xuICB0cmlwQXJjOiAnIzkyMjZDNicsXG4gIGJlZ2ludHJpcF9sYXQ6ICcjMUU5NkJFJyxcbiAgZHJvcG9mZl9sYXQ6ICcjRkY5OTFGJyxcbiAgcmVxdWVzdF9sYXQ6ICcjNTJBMzUzJ1xufTtcblxuLy8gbGV0IHVzZXIgcGFzcyBpbiBkZWZhdWx0IHRvb2x0aXAgZmllbGRzXG5leHBvcnQgY29uc3QgREVGQVVMVF9UT09MVElQX0ZJRUxEUyA9IFtdO1xuXG5leHBvcnQgY29uc3QgTk9fVkFMVUVfQ09MT1IgPSBbMCwgMCwgMCwgMF07XG5cbmV4cG9ydCBjb25zdCBMQVlFUl9CTEVORElOR1MgPSB7XG4gIGFkZGl0aXZlOiB7XG4gICAgbGFiZWw6ICdsYXllckJsZW5kaW5nLmFkZGl0aXZlJyxcbiAgICBibGVuZEZ1bmM6IFsnU1JDX0FMUEhBJywgJ0RTVF9BTFBIQSddLFxuICAgIGJsZW5kRXF1YXRpb246ICdGVU5DX0FERCdcbiAgfSxcbiAgbm9ybWFsOiB7XG4gICAgLy8gcmVmZXJlbmNlIHRvXG4gICAgLy8gaHR0cHM6Ly9saW1udS5jb20vd2ViZ2wtYmxlbmRpbmcteW91cmUtcHJvYmFibHktd3JvbmcvXG4gICAgbGFiZWw6ICdsYXllckJsZW5kaW5nLm5vcm1hbCcsXG4gICAgYmxlbmRGdW5jOiBbJ1NSQ19BTFBIQScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJywgJ09ORScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJ10sXG4gICAgYmxlbmRFcXVhdGlvbjogWydGVU5DX0FERCcsICdGVU5DX0FERCddXG4gIH0sXG4gIHN1YnRyYWN0aXZlOiB7XG4gICAgbGFiZWw6ICdsYXllckJsZW5kaW5nLnN1YnRyYWN0aXZlJyxcbiAgICBibGVuZEZ1bmM6IFsnT05FJywgJ09ORV9NSU5VU19EU1RfQ09MT1InLCAnU1JDX0FMUEhBJywgJ0RTVF9BTFBIQSddLFxuICAgIGJsZW5kRXF1YXRpb246IFsnRlVOQ19TVUJUUkFDVCcsICdGVU5DX0FERCddXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBNQVhfREVGQVVMVF9UT09MVElQUyA9IDU7XG5cbmV4cG9ydCBjb25zdCBSRVNPTFVUSU9OUyA9IGtleU1pcnJvcih7XG4gIE9ORV9YOiBudWxsLFxuICBUV09fWDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBFWFBPUlRfSU1HX1JBVElPUyA9IGtleU1pcnJvcih7XG4gIFNDUkVFTjogbnVsbCxcbiAgRk9VUl9CWV9USFJFRTogbnVsbCxcbiAgU0lYVEVFTl9CWV9OSU5FOiBudWxsLFxuICBDVVNUT006IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgRVhQT1JUX0lNR19SQVRJT19PUFRJT05TID0gW1xuICB7XG4gICAgaWQ6IEVYUE9SVF9JTUdfUkFUSU9TLlNDUkVFTixcbiAgICBsYWJlbDogJ21vZGFsLmV4cG9ydEltYWdlLnJhdGlvT3JpZ2luYWxTY3JlZW4nLFxuICAgIGdldFNpemU6IChzY3JlZW5XLCBzY3JlZW5IKSA9PiAoe3dpZHRoOiBzY3JlZW5XLCBoZWlnaHQ6IHNjcmVlbkh9KVxuICB9LFxuICB7XG4gICAgaWQ6IEVYUE9SVF9JTUdfUkFUSU9TLkNVU1RPTSxcbiAgICBoaWRkZW46IHRydWUsXG4gICAgbGFiZWw6ICdtb2RhbC5leHBvcnRJbWFnZS5yYXRpb0N1c3RvbScsXG4gICAgZ2V0U2l6ZTogKG1hcFcsIG1hcEgpID0+ICh7d2lkdGg6IG1hcFcsIGhlaWdodDogbWFwSH0pXG4gIH0sXG4gIHtcbiAgICBpZDogRVhQT1JUX0lNR19SQVRJT1MuRk9VUl9CWV9USFJFRSxcbiAgICBsYWJlbDogJ21vZGFsLmV4cG9ydEltYWdlLnJhdGlvNF8zJyxcbiAgICBnZXRTaXplOiAoc2NyZWVuVywgc2NyZWVuSCkgPT4gKHtcbiAgICAgIHdpZHRoOiBzY3JlZW5XLFxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHNjcmVlblcgKiAwLjc1KVxuICAgIH0pXG4gIH0sXG4gIHtcbiAgICBpZDogRVhQT1JUX0lNR19SQVRJT1MuU0lYVEVFTl9CWV9OSU5FLFxuICAgIGxhYmVsOiAnbW9kYWwuZXhwb3J0SW1hZ2UucmF0aW8xNl85JyxcbiAgICBnZXRTaXplOiAoc2NyZWVuVywgc2NyZWVuSCkgPT4gKHtcbiAgICAgIHdpZHRoOiBzY3JlZW5XLFxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHNjcmVlblcgKiAwLjU2MjUpXG4gICAgfSlcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IEVYUE9SVF9JTUdfUkVTT0xVVElPTl9PUFRJT05TID0gW1xuICB7XG4gICAgaWQ6IFJFU09MVVRJT05TLk9ORV9YLFxuICAgIGxhYmVsOiAnMXgnLFxuICAgIGF2YWlsYWJsZTogdHJ1ZSxcbiAgICBzY2FsZTogMSxcbiAgICBnZXRTaXplOiAoc2NyZWVuVywgc2NyZWVuSCkgPT4gKHtcbiAgICAgIHdpZHRoOiBzY3JlZW5XLFxuICAgICAgaGVpZ2h0OiBzY3JlZW5IXG4gICAgfSlcbiAgfSxcbiAge1xuICAgIGlkOiBSRVNPTFVUSU9OUy5UV09fWCxcbiAgICBsYWJlbDogJzJ4JyxcbiAgICBhdmFpbGFibGU6IHRydWUsXG4gICAgc2NhbGU6IDIsXG4gICAgZ2V0U2l6ZTogKHNjcmVlblcsIHNjcmVlbkgpID0+ICh7XG4gICAgICB3aWR0aDogc2NyZWVuVyAqIDIsXG4gICAgICBoZWlnaHQ6IHNjcmVlbkggKiAyXG4gICAgfSlcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IEVYUE9SVF9EQVRBX1RZUEUgPSBrZXlNaXJyb3Ioe1xuICBDU1Y6IG51bGxcbiAgLy8gU0hBUEVGSUxFOiBudWxsLFxuICAvLyBKU09OOiBudWxsLFxuICAvLyBHRU9KU09OOiBudWxsLFxuICAvLyBUT1BPSlNPTjogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBFWFBPUlRfREFUQV9UWVBFX09QVElPTlMgPSBbXG4gIHtcbiAgICBpZDogRVhQT1JUX0RBVEFfVFlQRS5DU1YsXG4gICAgbGFiZWw6IEVYUE9SVF9EQVRBX1RZUEUuQ1NWLnRvTG93ZXJDYXNlKCksXG4gICAgYXZhaWxhYmxlOiB0cnVlXG4gIH1cbiAgLy8ge1xuICAvLyAgIGlkOiBFWFBPUlRfREFUQV9UWVBFLlNIQVBFRklMRSxcbiAgLy8gICBsYWJlbDogJ3NoYXBlZmlsZScsXG4gIC8vICAgYXZhaWxhYmxlOiBmYWxzZVxuICAvLyB9LFxuICAvLyB7XG4gIC8vICAgaWQ6IEVYUE9SVF9EQVRBX1RZUEUuSlNPTixcbiAgLy8gICBsYWJlbDogJ2pzb24nLFxuICAvLyAgIGF2YWlsYWJsZTogZmFsc2VcbiAgLy8gfSxcbiAgLy8ge1xuICAvLyAgIGlkOiBFWFBPUlRfREFUQV9UWVBFLkdFT0pTT04sXG4gIC8vICAgbGFiZWw6ICdnZW9qc29uJyxcbiAgLy8gICBhdmFpbGFibGU6IGZhbHNlXG4gIC8vIH0sXG4gIC8vIHtcbiAgLy8gICBpZDogRVhQT1JUX0RBVEFfVFlQRS5UT1BPSlNPTixcbiAgLy8gICBsYWJlbDogJ3RvcG9qc29uJyxcbiAgLy8gICBhdmFpbGFibGU6IGZhbHNlXG4gIC8vIH1cbl07XG5cbi8vIEV4cG9ydCBtYXAgdHlwZXNcbmV4cG9ydCBjb25zdCBFWFBPUlRfTUFQX0ZPUk1BVFMgPSBrZXlNaXJyb3Ioe1xuICBIVE1MOiBudWxsLFxuICBKU09OOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IEVYUE9SVF9IVE1MX01BUF9NT0RFUyA9IGtleU1pcnJvcih7XG4gIFJFQUQ6IG51bGwsXG4gIEVESVQ6IG51bGxcbn0pO1xuXG4vLyBFeHBvcnQgbWFwIG9wdGlvbnNcbmV4cG9ydCBjb25zdCBFWFBPUlRfTUFQX0ZPUk1BVF9PUFRJT05TID0gT2JqZWN0LmVudHJpZXMoRVhQT1JUX01BUF9GT1JNQVRTKS5tYXAoZW50cnkgPT4gKHtcbiAgaWQ6IGVudHJ5WzBdLFxuICBsYWJlbDogZW50cnlbMV0udG9Mb3dlckNhc2UoKSxcbiAgYXZhaWxhYmxlOiB0cnVlXG59KSk7XG5cbmV4cG9ydCBjb25zdCBFWFBPUlRfSFRNTF9NQVBfTU9ERV9PUFRJT05TID0gT2JqZWN0LmVudHJpZXMoRVhQT1JUX0hUTUxfTUFQX01PREVTKS5tYXAoZW50cnkgPT4gKHtcbiAgaWQ6IGVudHJ5WzBdLFxuICBsYWJlbDogYG1vZGFsLmV4cG9ydE1hcC5odG1sLiR7ZW50cnlbMV0udG9Mb3dlckNhc2UoKX1gLFxuICBhdmFpbGFibGU6IHRydWUsXG4gIHVybDogZ2V0SFRNTE1hcE1vZGVUaWxlVXJsKGVudHJ5WzFdKVxufSkpO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9VVUlEX0NPVU5UID0gNjtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTk9USUZJQ0FUSU9OX01FU1NBR0UgPSAnTUVTU0FHRV9OT1RfUFJPVklERUQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9OT1RJRklDQVRJT05fVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBpbmZvOiBudWxsLFxuICBlcnJvcjogbnVsbCxcbiAgd2FybmluZzogbnVsbCxcbiAgc3VjY2VzczogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX05PVElGSUNBVElPTl9UT1BJQ1MgPSBrZXlNaXJyb3Ioe1xuICBnbG9iYWw6IG51bGwsXG4gIGZpbGU6IG51bGxcbn0pO1xuXG4vLyBNaW5pbXVtIHRpbWUgYmV0d2VlbiBpZGVudGljYWwgbm90aWZpY2F0aW9ucyBhYm91dCBkZWNrLmdsIGVycm9yc1xuZXhwb3J0IGNvbnN0IFRIUk9UVExFX05PVElGSUNBVElPTl9USU1FID0gMjUwMDtcblxuLy8gQW5pbWF0aW9uXG5leHBvcnQgY29uc3QgQkFTRV9TUEVFRCA9IDYwMDtcbmV4cG9ydCBjb25zdCBGUFMgPSA2MDtcblxuLyoqXG4gKiA0IEFuaW1hdGlvbiBXaW5kb3cgVHlwZXNcbiAqIDEuIGZyZWVcbiAqICB8LT4gIHwtPlxuICogQ3VycmVudCB0aW1lIGlzIGEgZml4ZWQgcmFuZ2UsIGFuaW1hdGlvbiBjb250cm9sbGVyIGNhbGxzIG5leHQgYW5pbWF0aW9uIGZyYW1lcyBjb250aW51b3VzbHkgdG8gYW5pbWF0aW9uIGEgbW92aW5nIHdpbmRvd1xuICogVGhlIGluY3JlbWVudCBpZCBiYXNlZCBvbiBkb21haW4gLyBCQVNFX1NQRUVEICogU1BFRURcbiAqXG4gKiAyLiBpbmNyZW1lbnRhbFxuICogfCAgICB8LT5cbiAqIFNhbWUgYXMgZnJlZSwgY3VycmVudCB0aW1lIGlzIGEgZ3Jvd2luZyByYW5nZSwgb25seSB0aGUgbWF4IHZhbHVlIG9mIHJhbmdlIGluY3JlbWVudCBkdXJpbmcgYW5pbWF0aW9uLlxuICogVGhlIGluY3JlbWVudCBpcyBhbHNvIGJhc2VkIG9uIGRvbWFpbiAvIEJBU0VfU1BFRUQgKiBTUEVFRFxuICpcbiAqIDMuIHBvaW50XG4gKiBvIC0+IG9cbiAqIEN1cnJlbnQgdGltZSBpcyBhIHBvaW50LCBhbmltYXRpb24gY29udHJvbGxlciBjYWxscyBuZXh0IGFuaW1hdGlvbiBmcmFtZSBjb250aW51b3VzbHkgdG8gYW5pbWF0aW9uIGEgbW92aW5nIHBvaW50XG4gKiBUaGUgaW5jcmVtZW50IGlzIGJhc2VkIG9uIGRvbWFpbiAvIEJBU0VfU1BFRUQgKiBTUEVFRFxuICpcbiAqIDQuIGludGVydmFsXG4gKiBvIH4+IG9cbiAqIEN1cnJlbnQgdGltZSBpcyBhIHBvaW50LiBBbiBhcnJheSBvZiBzb3J0ZWQgdGltZSBzdGVwcyBuZWVkIHRvIGJlIHByb3ZpZGVkLlxuICogYW5pbWF0aW9uIGNvbnRyb2xsZXIgY2FsbHMgbmV4dCBhbmltYXRpb24gYXQgYSBpbnRlcnZhbCB3aGVuIHRoZSBwb2ludCBqdW1wcyB0byB0aGUgbmV4dCBzdGVwXG4gKi9cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fV0lORE9XID0ga2V5TWlycm9yKHtcbiAgZnJlZTogbnVsbCxcbiAgaW5jcmVtZW50YWw6IG51bGwsXG4gIHBvaW50OiBudWxsLFxuICBpbnRlcnZhbDogbnVsbFxufSk7XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FX0ZPUk1BVCA9ICdNTS9ERC9ZWSBISDptbTpzc2EnO1xuZXhwb3J0IGNvbnN0IFNQRUVEX0NPTlRST0xfUkFOR0UgPSBbMCwgMTBdO1xuZXhwb3J0IGNvbnN0IFNQRUVEX0NPTlRST0xfU1RFUCA9IDAuMDAxO1xuXG4vLyBHZW9jb2RlclxuZXhwb3J0IGNvbnN0IEdFT0NPREVSX0RBVEFTRVRfTkFNRSA9ICdnZW9jb2Rlcl9kYXRhc2V0JztcbmV4cG9ydCBjb25zdCBHRU9DT0RFUl9MQVlFUl9JRCA9ICdnZW9jb2Rlcl9sYXllcic7XG5leHBvcnQgY29uc3QgR0VPQ09ERVJfR0VPX09GRlNFVCA9IDAuMDU7XG5leHBvcnQgY29uc3QgR0VPQ09ERVJfSUNPTl9DT0xPUiA9IFsyNTUsIDAsIDBdO1xuZXhwb3J0IGNvbnN0IEdFT0NPREVSX0lDT05fU0laRSA9IDgwO1xuXG4vLyBXZSBjb3VsZCB1c2UgZGlyZWN0bHkgcmVhY3QtbWFwLWdsLWRyYXcgRWRpdG9yTW9kZSBidXQgdGhpcyB3b3VsZFxuLy8gY3JlYXRlIGEgZGlyZWN0IGRlcGVuZGVuY3kgd2l0aCByZWFjdC1tYXAtZ2wtZHJhd1xuLy8gQ3JlYXRlZCB0aGlzIG1hcCB0byBiZSBpbmRlcGVuZGVudCBmcm9tIHJlYWN0LW1hcC1nbC1kcmF3XG5leHBvcnQgY29uc3QgRURJVE9SX01PREVTID0ge1xuICBSRUFEX09OTFk6IEVkaXRvck1vZGVzLlJFQURfT05MWSxcbiAgRFJBV19QT0xZR09OOiBFZGl0b3JNb2Rlcy5EUkFXX1BPTFlHT04sXG4gIERSQVdfUkVDVEFOR0xFOiBFZGl0b3JNb2Rlcy5EUkFXX1JFQ1RBTkdMRSxcbiAgRURJVDogRWRpdG9yTW9kZXMuRURJVF9WRVJURVhcbn07XG5cbmV4cG9ydCBjb25zdCBFRElUT1JfQVZBSUxBQkxFX0xBWUVSUyA9IFtcbiAgTEFZRVJfVFlQRVMucG9pbnQsXG4gIExBWUVSX1RZUEVTLmhleGFnb24sXG4gIExBWUVSX1RZUEVTLmFyYyxcbiAgTEFZRVJfVFlQRVMubGluZSxcbiAgTEFZRVJfVFlQRVMuaGV4YWdvbklkXG5dO1xuLy8gR1BVIEZpbHRlcmluZ1xuLyoqXG4gKiBNYXggbnVtYmVyIG9mIGZpbHRlciB2YWx1ZSBidWZmZXJzIHRoYXQgZGVjay5nbCBwcm92aWRlc1xuICovXG5leHBvcnQgY29uc3QgTUFYX0dQVV9GSUxURVJTID0gNDtcbmV4cG9ydCBjb25zdCBNQVBfVEhVTUJOQUlMX0RJTUVOU0lPTiA9IHtcbiAgd2lkdGg6IDMwMCxcbiAgaGVpZ2h0OiAyMDBcbn07XG5cbmV4cG9ydCBjb25zdCBNQVBfSU5GT19DSEFSQUNURVIgPSB7XG4gIHRpdGxlOiAxMDAsXG4gIGRlc2NyaXB0aW9uOiAxMDBcbn07XG5cbi8vIExvYWQgZGF0YVxuZXhwb3J0IGNvbnN0IExPQURJTkdfTUVUSE9EUyA9IGtleU1pcnJvcih7XG4gIHVwbG9hZDogbnVsbCxcbiAgc3RvcmFnZTogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBEQVRBU0VUX0ZPUk1BVFMgPSBrZXlNaXJyb3Ioe1xuICByb3c6IG51bGwsXG4gIGdlb2pzb246IG51bGwsXG4gIGNzdjogbnVsbCxcbiAga2VwbGVyZ2w6IG51bGxcbn0pO1xuIl19