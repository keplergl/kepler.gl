'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_DEFAULT_TOOLTIPS = exports.AGGREGATION_TYPES = exports.LAYER_BLENDINGS = exports.NO_VALUE_COLOR = exports.DEFAULT_LIGHT_SETTINGS = exports.DEFAULT_TOOLTIP_FIELDS = exports.LAYER_CLASSES = exports.LAYER_TYPES = exports.CHANNEL_SCALE_SUPPORTED_FIELDS = exports.FIELD_OPTS = exports.notSupportedScaleOpts = exports.OrdinalFieldAggrScaleFunctions = exports.OrdinalFieldScaleFunctions = exports.linearFieldAggrScaleFunctions = exports.linearFieldScaleFunctions = exports.CHANNEL_SCALES = exports.FIELD_DISPLAY_FORMAT = exports.defaultFormat = exports.FILED_TYPE_DISPLAY = exports.FIELD_COLORS = exports.ALL_FIELD_TYPES = exports.SCALE_FUNC = exports.SCALE_TYPES = exports.TRIP_ARC_FIELDS = exports.TRIP_POINT_FIELDS = exports.ICON_FIELDS = exports.HEXAGON_ID_FIELDS = exports.GEOJSON_FIELDS = exports.DEFAULT_MAP_STYLES = exports.DEFAULT_LAYER_GROUPS = exports.DEFAULT_BLDG_COLOR = exports.INITIAL_STYLE_TYPE = exports.PANELS_FOOTER = exports.PANELS = exports.DIMENSIONS = exports.ADD_DATA_ID = exports.DELETE_DATA_ID = exports.DATA_TABLE_ID = exports.LAYER_CONFIG_ID = exports.MAPZEN_API_KEY = exports.MAPBOX_ACCESS_TOKEN = exports.ACTION_PREFIX = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _FILED_TYPE_DISPLAY, _FIELD_DISPLAY_FORMAT, _linearFieldScaleFunc, _linearFieldAggrScale, _OrdinalFieldScaleFun, _OrdinalFieldAggrScal, _notSupportedScaleOpt, _LAYER_CLASSES;

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _icons = require('../components/common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toolsDark = {
  layers: [{
    paint: {
      'background-opacity': 1,
      'background-color': '#09101d'
    },
    type: 'background',
    id: 'background'
  }, {
    source: 'composite',
    filter: ['any', ['in', 'Place.type', 'PARK_OR_OPEN_SPACE', 'GOLF_COURSE'], ['in', 'PlaceFeature.categoryName', 'PARK', 'GOLF'], ['in', 'PlaceAreaFeature.categoryName', 'PARK', 'GOLF']],
    paint: {
      'fill-color': '#01171E',
      'fill-opacity': 1
    },
    minzoom: 1,
    'source-layer': 'polygons',
    type: 'fill',
    id: 'parks'
  }, {
    source: 'composite',
    filter: ['any', ['in', 'Place.type', 'AIRPORT'], ['in', 'PlaceFeature.categoryName', 'AIRPORT'], ['in', 'PlaceAreaFeature.categoryName', 'AIRPORT']],
    paint: {
      'fill-color': {
        stops: [[11, '#101520'], [16, '#101520']]
      },
      'fill-opacity': 1
    },
    minzoom: 7,
    'source-layer': 'polygons',
    type: 'fill',
    id: 'place-airport'
  }, {
    source: 'composite',
    filter: ['any', ['in', 'Place.type', 'AIRPORT_RUNWAY'], ['in', 'PlaceFeature.categoryName', 'AIRPORT_RUNWAY'], ['in', 'PlaceAreaFeature.categoryName', 'AIRPORT_RUNWAY']],
    paint: {
      'fill-color': {
        stops: [[11, '#151c28'], [16, '#151c28']]
      },
      'fill-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'polygons',
    type: 'fill',
    id: 'place-airport-runways'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['any', ['all', ['in', 'NaturalFeature.type', 'INTERMITTENT_STREAM'], ['in', 'NaturalFeature.priority', 'MEDIUM', 'LOW', 'VERY_LOW']], ['all', ['in', 'DisplayNaturalFeature.type', 'INTERMITTENT_STREAM'], ['in', 'DisplayNaturalFeature.priority', 'MEDIUM', 'LOW', 'VERY_LOW']]],
    paint: {
      'line-color': '#0a151e',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 2], [17, 7]]
      }
    },
    minzoom: 14,
    'source-layer': 'lines',
    type: 'line',
    id: 'stream-intermittent-minor-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['any', ['all', ['in', 'NaturalFeature.type', 'INTERMITTENT_STREAM'], ['in', 'NaturalFeature.priority', 'VERY_HIGH', 'HIGH']], ['all', ['in', 'DisplayNaturalFeature.type', 'INTERMITTENT_STREAM'], ['in', 'DisplayNaturalFeature.priority', 'VERY_HIGH', 'HIGH']]],
    paint: {
      'line-color': '#0a151e',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 2], [17, 7]]
      }
    },
    minzoom: 13,
    'source-layer': 'lines',
    type: 'line',
    id: 'stream-intermittent-major-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['any', ['all', ['in', 'NaturalFeature.type', 'STREAM'], ['in', 'NaturalFeature.priority', 'MEDIUM', 'LOW', 'VERY_LOW']], ['all', ['in', 'DisplayNaturalFeature.type', 'STREAM'], ['in', 'DisplayNaturalFeature.priority', 'MEDIUM', 'LOW', 'VERY_LOW']]],
    paint: {
      'line-color': '#0a151e',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 2], [17, 7]]
      }
    },
    minzoom: 13,
    'source-layer': 'lines',
    type: 'line',
    id: 'stream-minor-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['any', ['all', ['in', 'NaturalFeature.type', 'STREAM'], ['in', 'NaturalFeature.priority', 'VERY_HIGH', 'HIGH']], ['all', ['in', 'DisplayNaturalFeature.type', 'STREAM'], ['in', 'DisplayNaturalFeature.priority', 'VERY_HIGH', 'HIGH']]],
    paint: {
      'line-color': '#0a151e',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 2], [17, 7]]
      }
    },
    minzoom: 11,
    'source-layer': 'lines',
    type: 'line',
    id: 'stream-major-CASING'
  }, {
    paint: {
      'line-color': '#0e1d28',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 0.5], [17, 5]]
      }
    },
    ref: 'stream-intermittent-minor-CASING',
    id: 'stream-intermittent-minor-FILL'
  }, {
    paint: {
      'line-color': '#0e1d28',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 0.5], [17, 5]]
      }
    },
    ref: 'stream-intermittent-major-CASING',
    id: 'stream-intermittent-major-FILL'
  }, {
    paint: {
      'line-color': '#0e1d28',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 0.5], [17, 5]]
      }
    },
    ref: 'stream-minor-CASING',
    id: 'stream-minor-FILL'
  }, {
    paint: {
      'line-color': '#0e1d28',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 0.5], [17, 5]]
      }
    },
    ref: 'stream-major-CASING',
    id: 'stream-major-FILL'
  }, {
    source: 'composite',
    filter: ['any', ['in', 'NaturalFeature.type', 'SEA_OR_OCEAN', 'LAKE', 'OTHER_WATER'], ['in', 'DisplayNaturalFeature.type', 'WATER']],
    paint: {
      'fill-outline-color': '#0a151e',
      'fill-color': '#0E1D28',
      'fill-antialias': true,
      'fill-opacity': 1
    },
    'source-layer': 'polygons',
    type: 'fill',
    id: 'water'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['==', 'Segment.type', 'FERRY']],
    paint: {
      'line-color': '#0f2431',
      'line-opacity': 0,
      'line-width': {
        stops: [[8.9, 0], [9, 0.25], [10, 0.25], [11, 0.5], [12, 1], [13, 1], [15.5, 2]]
      }
    },
    minzoom: 9,
    'source-layer': 'lines',
    type: 'line',
    id: 'ferry'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_ARTERY'], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [13, 1.5], [13.8, 3.5], [14, 4], [15, 7], [16, 11], [17, 19.5], [18, 22], [20, 66]]
      }
    },
    minzoom: 8,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-minor-arterial-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MAJOR_ARTERY'], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': {
        stops: [[14, '#09101d'], [16, '#09101d']]
      },
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-major-arterial-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['!=', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 7,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-UNcontrolled-minor-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 7,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-controlled-minor-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['any', ['in', 'Segment.roadUsage', 'WALKWAY', 'STAIRS']],
    paint: {
      'line-color': {
        stops: [[15, '#09101d'], [17, '#09101d']]
      },
      'line-opacity': 0,
      'line-width': {
        stops: [[15, 4], [17, 5], [20, 26]]
      }
    },
    minzoom: 15,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-path-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadUsage', 'PARKING_ROAD']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0
    },
    minzoom: 14,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-parking-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'LOCAL_ROAD_MINOR_IMPORTANCE'], ['!in', 'Segment.roadUsage', 'WALKWAY'], ['!in', 'Segment.roadUsage', 'STAIRS'], ['!in', 'Segment.roadUsage', 'PARKING_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[12.95, 0], [14, 0], [14.2, 1.5], [14.3, 2.5], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 12,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-local-minor-importance-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'LOCAL_ROAD'], ['!in', 'Segment.roadUsage', 'WALKWAY'], ['!in', 'Segment.roadUsage', 'STAIRS'], ['!in', 'Segment.roadUsage', 'PARKING_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[12.95, 0], [14, 0], [14.2, 1.5], [14.3, 2.5], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 11,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-local-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_ARTERY'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 2], [14.3, 4], [15, 7], [16, 11], [17, 19.5], [18, 22], [20, 66]]
      }
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-minor-arterial-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MAJOR_ARTERY'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-major-arterial-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['!=', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 7,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-UNcontrolled-minor-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 7,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-controlled-minor-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-width': {
        stops: [[12.95, 0], [14, 2], [14.2, 3], [14.3, 4], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-ramp-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-width': {
        stops: [[12.95, 0], [14, 2], [14.2, 3], [14.3, 4], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-ramp-highway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-width': {
        stops: [[12.95, 0], [14, 2], [14.2, 3], [14.3, 4], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-ramp-motorway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-width': {
        stops: [[12.95, 0], [14, 2], [14.2, 3], [14.3, 4], [15, 5], [16, 8], [17, 13], [18, 18], [20, 42]]
      }
    },
    minzoom: 9,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-ramp-motorway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!=', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-UNcontrolled-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!=', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-UNcontrolled-highway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-UNcontrolled-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#f99f1c',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-UNcontrolled-highway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-controlled-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-controlled-highway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['in', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-controlled-highway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['in', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-controlled-highway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-motorway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['==', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 0,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 5,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-tunnel-motorway-CASING-GBR-IRL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 4,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-motorway-CASING'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'line-color': '#09101d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0], [14, 0], [14.2, 4], [14.3, 5], [15, 8], [16, 12], [17, 22], [18, 26], [20, 66]]
      }
    },
    minzoom: 4,
    'source-layer': 'roads',
    type: 'line',
    id: 'road-motorway-CASING-GBR-IRL'
  }, {
    paint: {
      'line-color': '#31393d',
      'line-opacity': 1,
      'line-width': {
        stops: [[10.95, 0.5], [11, 1], [12.5, 1], [13, 1.5], [14, 3], [15, 5], [16, 9], [17, 17.5], [18, 20], [20, 64]]
      }
    },
    ref: 'road-tunnel-minor-arterial-CASING',
    id: 'road-tunnel-minor-arterial-FILL'
  }, {
    paint: {
      'line-color': '#31393d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-major-arterial-CASING',
    id: 'road-tunnel-major-arterial-FILL'
  }, {
    paint: {
      'line-color': '#31393d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-UNcontrolled-minor-highway-CASING',
    id: 'road-tunnel-UNcontrolled-minor-highway-FILL'
  }, {
    paint: {
      'line-color': '#31393d',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-controlled-minor-highway-CASING',
    id: 'road-tunnel-controlled-minor-highway-FILL'
  }, {
    paint: {
      'line-color': '#1e2027',
      'line-opacity': 1,
      'line-width': {
        stops: [[15, 2], [17, 3], [20, 24]]
      }
    },
    ref: 'road-path-CASING',
    id: 'road-path-FILL'
  }, {
    paint: {
      'line-color': '#132834',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 1], [15, 2], [16, 3.5], [17, 8], [18, 12], [20, 36]]
      }
    },
    ref: 'road-parking-CASING',
    id: 'road-parking-FILL'
  }, {
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    source: 'composite',
    type: 'line',
    filter: ['all', ['==', 'Segment.type', 'RAILWAY']],
    paint: {
      'line-color': '#182539',
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 1], [15, 2], [16, 5], [17, 6], [18, 7], [22, 25]]
      }
    },
    minzoom: 14,
    'source-layer': 'lines',
    'is-stroke': true,
    id: 'railway-line'
  }, {
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    },
    source: 'composite',
    filter: ['all', ['==', 'Segment.type', 'RAILWAY']],
    paint: {
      'line-color': '#182539',
      'line-dasharray': [0.1, 2.1, 0.1],
      'line-opacity': 1,
      'line-width': {
        stops: [[14, 0], [15, 6], [16, 10], [17, 12], [18, 18], [19, 20], [20, 29]]
      }
    },
    minzoom: 14,
    'source-layer': 'lines',
    type: 'line',
    id: 'railway-crosshatch'
  }, {
    paint: {
      'line-color': {
        stops: [[13, '#12212a'], [14, '#21394a']]
      },
      'line-opacity': {
        stops: [[12, 0.3], [13, 1]]
      },
      'line-width': {
        stops: [[12.95, 0.5], [13.95, 0.75], [14, 1], [15, 2], [16, 3.5], [17, 8], [18, 12], [20, 36]]
      }
    },
    ref: 'road-local-minor-importance-CASING',
    id: 'road-local-minor-importance-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[13, '#12212a'], [14, '#21394a']]
      },
      'line-opacity': {
        stops: [[12, 0.3], [13, 1]]
      },
      'line-width': {
        stops: [[12.95, 0.5], [13.95, 1], [14, 1.5], [15, 3], [16, 6], [17, 11], [18, 16], [20, 40]]
      }
    },
    ref: 'road-local-CASING',
    id: 'road-local-FILL'
  }, {
    layout: {
      'icon-image': {
        stops: [[15, 'oneway-spaced-large'], [16, 'oneway-spaced-xl'], [17, 'oneway-spaced-xxl']]
      },
      'symbol-spacing': 200,
      'icon-rotation-alignment': 'map',
      'symbol-placement': 'line',
      'icon-padding': 2
    },
    source: 'composite',
    filter: ['all', ['==', 'oneway', true], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD', 'PARKING_ROAD', 'CONNECTOR', 'WALKWAY', 'ROUNDABOUT'], ['in', 'Segment.roadClass', 'LOCAL_ROAD', 'LOCAL_ROAD_MINOR_IMPORTANCE']],
    paint: {
      'icon-opacity': 0
    },
    minzoom: 15,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-oneway-arrows-minor'
  }, {
    layout: {
      'icon-image': {
        stops: [[16, 'oneway-spaced-xl'], [17, 'oneway-spaced-xxl']]
      },
      'symbol-spacing': 200,
      'icon-rotation-alignment': 'map',
      'symbol-placement': 'line',
      'icon-padding': 2
    },
    source: 'composite',
    filter: ['all', ['==', 'oneway', true], ['==', 'Segment.roadUsage', 'ROUNDABOUT'], ['in', 'Segment.roadClass', 'LOCAL_ROAD', 'LOCAL_ROAD_MINOR_IMPORTANCE']],
    paint: {
      'icon-opacity': 0
    },
    minzoom: 16,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-oneway-arrows-minor-ROUNDABOUT'
  }, {
    paint: {
      'line-color': {
        stops: [[12, '#12212a'], [13, '#21394a']]
      },
      'line-opacity': 1,
      'line-width': {
        stops: [[10.95, 0.5], [12, 0.5], [12.5, 1], [13, 1.5], [14, 3], [15, 5], [16, 9], [17, 17.5], [18, 20], [20, 64]]
      }
    },
    ref: 'road-minor-arterial-CASING',
    id: 'road-minor-arterial-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[9, '#0f1c23'], [12, '#18323e'], [13, '#21394a']]
      },
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-major-arterial-CASING',
    id: 'road-major-arterial-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[12, '#18323e'], [13, '#21394a']]
      },
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0.3], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-UNcontrolled-minor-highway-CASING',
    id: 'road-UNcontrolled-minor-highway-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[12, '#18323e'], [13, '#21394a']]
      },
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 0.3], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-controlled-minor-highway-CASING',
    id: 'road-controlled-minor-highway-FILL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-width': {
        stops: [[6, 0], [12, 1.5], [14, 2], [15, 3], [16, 6], [17, 11], [18, 16], [20, 40]]
      }
    },
    ref: 'road-ramp-highway-CASING',
    id: 'road-ramp-highway-FILL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-width': {
        stops: [[6, 0], [12, 1.5], [14, 2], [15, 3], [16, 6], [17, 11], [18, 16], [20, 40]]
      }
    },
    ref: 'road-ramp-highway-CASING-GBR-IRL',
    id: 'road-ramp-highway-FILL-GBR-IRL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-width': {
        stops: [[6, 0], [12, 1.5], [14, 2], [15, 3], [16, 6], [17, 11], [18, 16], [20, 40]]
      }
    },
    'line-color': {
      stops: [[6, '#fff'], [12, '#ffbe33']]
    },
    ref: 'road-ramp-motorway-CASING',
    id: 'road-ramp-motorway-FILL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-width': {
        stops: [[6, 0], [12, 1.5], [14, 2], [15, 3], [16, 6], [17, 11], [18, 16], [20, 40]]
      }
    },
    ref: 'road-ramp-motorway-CASING-GBR-IRL',
    id: 'road-ramp-motorway-FILL-GBR-IRL'
  }, {
    layout: {
      'icon-image': {
        stops: [[14, 'oneway-spaced-large'], [16, 'oneway-spaced-xl'], [17, 'oneway-spaced-xxl']]
      },
      'symbol-spacing': 200,
      'icon-rotation-alignment': 'map',
      'symbol-placement': 'line',
      'icon-padding': 2
    },
    paint: {
      'icon-opacity': 0
    },
    filter: ['all', ['==', 'oneway', true], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD', 'CONNECTOR', 'WALKWAY', 'PARKING_ROAD', 'ROUNDABOUT'], ['in', 'Segment.roadClass', 'MINOR_ARTERY', 'MAJOR_ARTERY', 'MINOR_HIGHWAY']],
    source: 'composite',
    minzoom: 14,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-oneway-arrows-major'
  }, {
    layout: {
      'icon-image': {
        stops: [[16, 'oneway-spaced-xl'], [17, 'oneway-spaced-xxl']]
      },
      'symbol-spacing': 200,
      'icon-rotation-alignment': 'map',
      'symbol-placement': 'line',
      'icon-padding': 2
    },
    paint: {
      'icon-opacity': 0
    },
    filter: ['all', ['==', 'oneway', true], ['==', 'Segment.roadUsage', 'ROUNDABOUT'], ['in', 'Segment.roadClass', 'MINOR_ARTERY', 'MAJOR_ARTERY', 'MINOR_HIGHWAY']],
    source: 'composite',
    minzoom: 16,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-oneway-arrows-major-ROUNDABOUT'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-opacity': 0.49,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-UNcontrolled-highway-CASING',
    id: 'road-tunnel-UNcontrolled-highway-FILL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-opacity': 0.49,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-UNcontrolled-highway-CASING-GBR-IRL',
    id: 'road-tunnel-UNcontrolled-highway-FILL-GBR-IRL'
  }, {
    paint: {
      'line-color': {
        stops: [[4, '#1D2D3D'], [6, '#314A5C']]
      },
      'line-opacity': {
        stops: [[6, 0.2], [7, 1]]
      },
      'line-width': {
        stops: [[6, 0.3], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-UNcontrolled-highway-CASING',
    id: 'road-UNcontrolled-highway-FILL'
  }, {
    paint: {
      'line-color': '#314A5C',
      'line-opacity': {
        stops: [[6, 0.2], [7, 1]]
      },
      'line-width': {
        stops: [[6, 0.3], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-UNcontrolled-highway-CASING-GBR-IRL',
    id: 'road-UNcontrolled-highway-FILL-GBR-IRL'
  }, {
    paint: {
      'line-color': '#476072',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-controlled-highway-CASING',
    id: 'road-tunnel-controlled-highway-FILL'
  }, {
    paint: {
      'line-color': '#476072',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-controlled-highway-CASING-GBR-IRL',
    id: 'road-tunnel-controlled-highway-FILL-GBR-IRL'
  }, {
    paint: {
      'line-color': {
        stops: [[4, '#283948'], [6, '#476072']]
      },
      'line-opacity': {
        stops: [[6, 0.2], [7, 1]]
      },
      'line-width': {
        stops: [[6, 0.5], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-controlled-highway-CASING',
    id: 'road-controlled-highway-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[4, '#283948'], [6, '#476072']]
      },
      'line-opacity': {
        stops: [[6, 0.2], [7, 1]]
      },
      'line-width': {
        stops: [[6, 0.5], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-controlled-highway-CASING-GBR-IRL',
    id: 'road-controlled-highway-FILL-GBR-IRL'
  }, {
    layout: {
      'icon-image': {
        stops: [[14, 'oneway-spaced-highway-large'], [16, 'oneway-spaced-highway-xl'], [17, 'oneway-spaced-highway-xxl']]
      },
      'symbol-spacing': 200,
      'icon-rotation-alignment': 'map',
      'symbol-placement': 'line',
      'icon-padding': 2
    },
    source: 'composite',
    filter: ['all', ['==', 'oneway', true], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.roadUsage', 'RAMP', 'SLIP_ROAD'], ['!=', 'Segment.controlledAccessRoad', true], ['!=', 'Segment.groundLevel', 'TUNNEL']],
    paint: {
      'icon-opacity': 0
    },
    minzoom: 14,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-oneway-arrows-highway'
  }, {
    paint: {
      'line-color': '#476072',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-motorway-CASING',
    id: 'road-tunnel-motorway-FILL'
  }, {
    paint: {
      'line-color': '#476072',
      'line-opacity': 1,
      'line-width': {
        stops: [[6, 1], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-tunnel-motorway-CASING-GBR-IRL',
    id: 'road-tunnel-motorway-FILL-GBR-IRL'
  }, {
    paint: {
      'line-color': {
        stops: [[4, '#283948'], [6, '#476072']]
      },
      'line-opacity': {
        stops: [[4, 0.2], [5, 1]]
      },
      'line-width': {
        stops: [[4, 0.5], [6, 0.8], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-motorway-CASING',
    id: 'road-motorway-FILL'
  }, {
    paint: {
      'line-color': {
        stops: [[4, '#283948'], [6, '#476072']]
      },
      'line-opacity': {
        stops: [[4, 0.2], [5, 1]]
      },
      'line-width': {
        stops: [[4, 0.5], [6, 0.8], [8, 1], [10, 1.5], [12, 2], [13, 2], [14, 3], [15, 6], [16, 10], [17, 20], [18, 24], [20, 64]]
      }
    },
    ref: 'road-motorway-CASING-GBR-IRL',
    id: 'road-motorway-FILL-GBR-IRL'
  }, {
    source: 'buildings',
    filter: ['==', 'PhysicalSpace.spaceType', 'STRUCTURE'],
    paint: {
      'fill-translate': [0, 3],
      'fill-color': '#000',
      'fill-opacity': 0.06
    },
    minzoom: 16,
    'source-layer': 'polygons',
    type: 'fill',
    id: 'building-shadow'
  }, {
    paint: {
      'fill-color': '#111723',
      'fill-opacity': 0
    },
    ref: 'building-shadow',
    id: 'building-fill'
  }, {
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Border.adminType', 'G1_COUNTRY_SUBDIVISION'], ['!in', 'WorldFeature.iso_3166_1_a2', 'AU', 'BR', 'CA', 'CN', 'IN', 'MX', 'RU', 'US']],
    paint: {
      'line-color': '#283f5d',
      'line-dasharray': [0.5, 1, 0.5],
      'line-opacity': 1,
      'line-width': {
        base: 1.3,
        stops: [[3, 0.7], [5, 1], [7, 1.2], [10, 1.7], [22, 15]]
      }
    },
    minzoom: 4,
    'source-layer': 'lines',
    type: 'line',
    id: 'state-border-minor'
  }, {
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['all', ['in', 'Border.adminType', 'G1_COUNTRY_SUBDIVISION'], ['in', 'WorldFeature.iso_3166_1_a2', 'AU', 'BR', 'CA', 'CN', 'IN', 'MX', 'RU', 'US']],
    paint: {
      'line-color': '#283f5d',
      'line-dasharray': [0.5, 1, 0.5],
      'line-opacity': {
        stops: [[2, 0], [2.5, 1]]
      },
      'line-width': {
        base: 1.3,
        stops: [[3, 0.7], [5, 1], [7, 1.2], [10, 1.7], [22, 15]]
      }
    },
    minzoom: 2,
    'source-layer': 'lines',
    type: 'line',
    id: 'state-border-major'
  }, {
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    },
    source: 'composite',
    'is-stroke': true,
    filter: ['in', 'Border.adminType', 'G0_COUNTRY'],
    paint: {
      'line-color': '#24528b',
      'line-dasharray': [0.5, 1, 0.5],
      'line-opacity': 1,
      'line-width': {
        base: 1.3,
        stops: [[3, 0.7], [5, 1], [7, 1.2], [10, 1.7], [22, 15]]
      }
    },
    'source-layer': 'lines',
    type: 'line',
    id: 'country-border'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[14, 0.075], [15, 0.1], [16, 0.11], [17, 0.09], [18, 0.07]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 10], [17, 11], [18, 13]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'Segment.roadClass', 'LOCAL_ROAD', 'LOCAL_ROAD_MINOR_IMPORTANCE'], ['!in', 'Segment.roadUsage', 'WALKWAY']],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#dbdae0']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 14,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-minor'
  }, {
    layout: {
      'text-letter-spacing': 0.04,
      'icon-padding': 20,
      'text-padding': 2,
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'Arial Unicode'],
      'text-anchor': 'top-left',
      'icon-image': {
        stops: [[12, '{icon}-small'], [13, '{icon}-medium']]
      },
      'text-field': '{name}',
      'text-justify': 'left',
      'text-offset': [0, 0.8],
      'text-size': {
        stops: [[12, 10.5], [15, 11], [16, 12]]
      },
      'text-max-width': 8,
      'icon-offset': [6, 0]
    },
    source: 'composite',
    filter: ['all', ['in', '$type', 'Point'], ['in', 'PlaceFeature.categoryName', 'PARK']],
    paint: {
      'text-color': '#496248',
      'icon-opacity': 0,
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': 0
    },
    minzoom: 5,
    'source-layer': 'points',
    type: 'symbol',
    id: 'poi-label-park-composite',
    interactive: true
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [15, 0.1]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 10], [17, 11], [18, 13]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_ARTERY']],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#dbdae0']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 11,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-minor-arterial'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 10], [13, 12]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['any', ['in', 'Locality.type', 'NEIGHBORHOOD'], ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_12']]],
    paint: {
      'text-color': '#5d707c',
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[14, 1], [14.5, 0]]
      }
    },
    minzoom: 10,
    'source-layer': 'points',
    maxzoom: 14.5,
    type: 'symbol',
    id: 'neighborhood-label'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.06], [12, 0.05], [15, 0.1], [16, 0.08]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 11], [12, 11], [17, 12], [18, 13]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'Segment.roadClass', 'MAJOR_ARTERY']],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#dbdae0']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 11,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-major-arterial'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 8], [12, 12], [17, 14]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['!in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#dbdae0']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 11,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-UNcontrolled-minor-highway'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 14], [12, 14], [17, 16], [18, 17]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'Segment.roadClass', 'MINOR_HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#dbdae0']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 11,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-controlled-minor-highway'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.1]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 8], [12, 12], [17, 14]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[16, '#bbbabf'], [17, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-UNcontrolled-highway'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.1]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 14], [12, 14], [17, 16], [18, 17]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['!in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-UNcontrolled-highway-GBR-IRL'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 12], [12, 12], [17, 14], [18, 15]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[16.9, '#bbbabf'], [17, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-controlled-highway'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.08], [12, 0.05], [13, 0.1], [14, 0.05]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0.2]], [15, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 14], [12, 14], [17, 16], [18, 17]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'HIGHWAY'], ['in', 'Segment.controlledAccessRoad', true]],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(235, 240, 240, 1)'], [17, 'rgba(235, 240, 240, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-controlled-highway-GBR-IRL'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.06], [12, 0.04], [13, 0.04]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0]], [17, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 12], [12, 12], [17, 14], [18, 15]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['!in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY']],
    paint: {
      'text-color': {
        stops: [[16.9, '#bbbabf'], [17, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(9, 16, 29, 0.8)'], [17, 'rgba(9, 16, 29, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-motorway'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[11, 0.06], [12, 0.04], [13, 0.04]]
      },
      'text-max-angle': 28,
      'symbol-placement': 'line',
      'text-padding': 1,
      'text-font': ['ClanProForUBER-News', 'NotoSansHebrew-Regular', 'NotoSansThai-Regular', 'NotoSansDevanagari-Regular', 'KacstBook', 'Arial Unicode'],
      'text-anchor': {
        stops: [[14, 'bottom'], [15, 'center']]
      },
      'text-field': '{name}',
      'text-offset': {
        stops: [[14, [0, 0]], [17, [0, 0]]]
      },
      'text-rotation-alignment': 'map',
      'text-size': {
        stops: [[9, 14], [12, 14], [17, 16], [18, 17]]
      },
      'symbol-spacing': 300
    },
    source: 'composite',
    filter: ['all', ['in', 'GeographyRelations.countryCode', 'GBR', 'IRL'], ['in', 'Segment.roadClass', 'MOTORWAY']],
    paint: {
      'text-color': {
        stops: [[14, '#bbbabf'], [15, '#efedef']]
      },
      'text-halo-width': 1,
      'text-halo-color': {
        stops: [[16, 'rgba(235, 240, 240, 1)'], [17, 'rgba(235, 240, 240, 0)']]
      },
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'road-label-motorway-GBR-IRL'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'USA_ROUTE_66'],
    paint: {
      'text-opacity': 0,
      'text-color': '#A47D6E',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-A47D6E'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'ISR_NATIONAL_ROAD', 'USA_STATE_SOUTH_CAROLINA'],
    paint: {
      'text-opacity': 0,
      'text-color': '#5676DD',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-5676DD'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'ISR_INNER_CITY_ROAD'],
    paint: {
      'text-opacity': 0,
      'text-color': '#ED427C',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-ED427C'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'ARE_EMIRATE_HIGHWAY', 'ARE_NATIONAL_HIGHWAY', 'AUS_NATIONAL_HIGHWAY', 'AUS_NATIONAL_HIGHWAY', 'AUS_NATIONAL_HIGHWAY', 'AUS_STATE_ROAD', 'AUS_STATE_ROAD', 'AUS_STATE_ROAD', 'AUS_STATE_ROAD', 'GBR_PRIMARY_ROAD', 'IRL_PRIMARY_ROAD', 'USA_COUNTY_HIGHWAY', 'ZAF_PROVINCIAL_ROAD'],
    paint: {
      'text-opacity': 0,
      'text-color': '#FFD344',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-FFD344'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'CAN_TRANS_CANADA_HIGHWAY', 'CAN_TRANS_CANADA_HIGHWAY', 'ISR_REGIONAL_ROAD', 'USA_STATE_VERMONT'],
    paint: {
      'text-opacity': 0,
      'text-color': '#28A084',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-28A084'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'ESP_CARRETERA_AUTONOMICA_ORANGE'],
    paint: {
      'text-opacity': 0,
      'text-color': '#515051',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-515051'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'ARE_OTHER_HIGHWAY', 'ASIAN_HIGHWAY', 'ASIAN_HIGHWAY', 'ASIAN_HIGHWAY', 'AUS_STATE_HIGHWAY', 'AUS_TOURIST_DRIVE', 'AUT_AUTOBAHN', 'AUT_BUNDESSTRASSE', 'AUT_SCHNELLSTRASSE', 'BEL_NATIONAL_ROAD', 'CAN_AUTOROUTE_QUEBEC', 'CAN_PROVINCIAL_NEW_BRUNSWICK', 'CAN_PROVINCIAL_QUEBEC', 'CAN_PROVINCIAL_SASKATCHEWAN', 'CHE_AUTOBAHN', 'CHE_KANTONSSTRASSE', 'CHL_FEDERAL_HIGHWAY', 'CHL_STATE_HIGHWAY', 'DEU_AUTOBAHN', 'ESP_AUTOPISTA', 'ESP_CARRETERA_AUTONOMICA_RED', 'ESP_CARRETERA_RIGE', 'EST_MAIN_ROAD', 'EUROPEAN_ROAD', 'FIN_VALTATIE', 'FIN_YHDYSTIE', 'FRA_AUTOROUTE', 'FRA_METROPOLITAN_ROAD', 'FRA_NATIONAL_ROAD', 'GBR_MOTORWAY', 'GRC_MOTORWAY', 'GRC_NATIONAL_ROAD', 'HUN_FREEWAY', 'HUN_PRIMARY_SECONDARY', 'IRL_MOTORWAY', 'ITA_AUTOSTRADA', 'ITA_STATE_HIGHWAY', 'ITA_TRAFORO', 'JPN_NATIONAL_ROAD', 'JPN_REGIONAL_ROAD', 'JPN_URBAN_EXPRESSWAY', 'KOR_EXPRESS_HIGHWAY', 'KOR_MOTORWAY', 'KOR_NATIONAL_ROAD', 'LTU_MAIN_ROAD', 'MEX_MEXICO_CITY_EJE_VIAL', 'MEX_MONTERREY_EJE_METROPOLITANO', 'NLD_AUTOSNELWEG', 'NOR_RIKSVEG', 'NZL_STATE_HIGHWAY', 'POL_NATIONAL_ROAD', 'PRT_AUTO_ESTRADA_IP_IC', 'PRT_MAIN_ROAD', 'ROU_COUNTY_ROAD', 'ROU_MOTORWAY', 'ROU_NATIONAL_ROAD', 'RUS_FEDERAL_ROAD', 'SGP_MOTORWAY', 'SVK_CESTY', 'SVK_DIALNICE', 'SWE_RIKSVAG', 'THA_MOTORWAY', 'TUR_GOVERNMENTAL_ROAD', 'TUR_MOTORWAY', 'TWN_EXPRESSWAY', 'TWN_PROVINCE_ROAD', 'UKR_INTERNATIONAL_NATIONAL_REGIONAL', 'USA_INTERSTATE_BUSINESS', 'USA_INTERSTATE_HIGHWAY', 'USA_STATE_CALIFORNIA', 'USA_STATE_MINNESOTA', 'ZAF_NATIONAL_ROAD'],
    paint: {
      'text-opacity': 0,
      'text-color': '#FFFFFF',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-FFFFFF'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, '{shield}-{reflen}-large'], [12, '{shield}-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.1],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['in', 'shield', 'AUS_METROPOLITAN_ROAD', 'AUS_NATIONAL_HIGHWAY_ALT', 'AUS_NATIONAL_ROAD', 'BEL_AUTOROUTE', 'BEL_RINGWEG', 'BRA_FEDERAL_HIGHWAY', 'BRA_STATE_HIGHWAY', 'CAN_PROVINCIAL_ALBERTA', 'CAN_PROVINCIAL_BRITISH_COLUMBIA', 'CAN_PROVINCIAL_MANITOBA', 'CAN_PROVINCIAL_PRINCE_EDWARD', 'DEU_BUNDESSTRASSE', 'DNK_PRIMARY_ROAD', 'ESP_CARRETERA_AUTONOMICA_YELLOW', 'EST_STATE_ROAD', 'FIN_KANTATIE', 'FRA_DEPARTMENTAL_ROAD', 'IDN_NATIONAL_ROAD', 'IDN_PROVINCIAL_ROAD', 'IND_NATIONAL_EXPRESSWAY', 'IND_NATIONAL_HIGHWAY', 'IND_STATE_HIGHWAY', 'LTU_STATE_ROAD', 'MEX_FEDERAL_HIGHWAY', 'MEX_STATE_HIGHWAY', 'MYS_EXPRESSWAY', 'NLD_NATIONAL_ROAD', 'NLD_ONTSLUITINGS_ROAD', 'NOR_RING_ROAD', 'POL_VOIVODESHIP', 'ROU_LOCAL_ROAD', 'SAU_NATIONAL_HIGHWAY', 'SAU_NATIONAL_HIGHWAY_BYWAY', 'THA_NATIONAL_ROAD', 'TWN_NATIONAL_HIGHWAY', 'USA_DISTRICT_WASHINGTON_DC', 'USA_HIGHWAY', 'USA_HIGHWAY_ALTERNATE_ROUTE', 'USA_HIGHWAY_BUSINESS_ROUTE', 'USA_STATE_ALABAMA', 'USA_STATE_ALASKA', 'USA_STATE_ARIZONA', 'USA_STATE_ARKANSAS', 'USA_STATE_COLORADO', 'USA_STATE_CONNECTICUT', 'USA_STATE_DELAWARE', 'USA_STATE_FLORIDA', 'USA_STATE_GEORGIA', 'USA_STATE_HAWAII', 'USA_STATE_IDAHO', 'USA_STATE_ILLINOIS', 'USA_STATE_INDIANA', 'USA_STATE_IOWA', 'USA_STATE_KANSAS', 'USA_STATE_KENTUCKY', 'USA_STATE_LOUISIANA', 'USA_STATE_MAINE', 'USA_STATE_MARYLAND', 'USA_STATE_MASSACHUSETTS', 'USA_STATE_MICHIGAN', 'USA_STATE_MISSISSIPPI', 'USA_STATE_MISSOURI', 'USA_STATE_MONTANA', 'USA_STATE_NEBRASKA', 'USA_STATE_NEVADA', 'USA_STATE_NEW_HAMPSHIRE', 'USA_STATE_NEW_JERSEY', 'USA_STATE_NEW_MEXICO', 'USA_STATE_NEW_YORK', 'USA_STATE_NORTH_CAROLINA', 'USA_STATE_NORTH_DAKOTA', 'USA_STATE_OHIO', 'USA_STATE_OKLAHOMA', 'USA_STATE_OREGON', 'USA_STATE_PENNSYLVANIA', 'USA_STATE_RHODE_ISLAND', 'USA_STATE_SOUTH_DAKOTA', 'USA_STATE_TENNESSEE', 'USA_STATE_TEXAS', 'USA_STATE_UTAH', 'USA_STATE_VIRGINIA', 'USA_STATE_WASHINGTON', 'USA_STATE_WEST_VIRGINIA', 'USA_STATE_WISCONSIN', 'USA_STATE_WYOMING', 'ZAF_REGIONAL_ROAD'],
    paint: {
      'text-opacity': 0,
      'text-color': '#666466',
      'icon-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-text-color-666466'
  }, {
    layout: {
      'text-letter-spacing': 0.01,
      'text-max-angle': 360,
      'symbol-placement': 'line',
      'icon-padding': {
        stops: [[6, 15], [9, 5]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'icon-image': {
        stops: [[9, 'default-{reflen}-large'], [12, 'default-{reflen}-xl']]
      },
      'text-field': '{ref}',
      'icon-rotation-alignment': 'viewport',
      'text-offset': [0, 0.05],
      'text-rotation-alignment': 'viewport',
      'text-size': {
        stops: [[11.99, 11], [12, 13]]
      },
      'symbol-spacing': 375
    },
    source: 'composite',
    filter: ['==', 'shield', 'default'],
    paint: {
      'text-color': '#666466',
      'icon-opacity': 0,
      'text-opacity': 0
    },
    minzoom: 6,
    'source-layer': 'roads',
    type: 'symbol',
    id: 'shield-default'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 10], [11.5, 10], [12, 11], [13, 14]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_11']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 9,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-11'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[11.5, 10], [12, 11], [13, 14]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_10']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 8.5,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-10'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 10], [11, 11], [12, 13], [13, 16]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_9']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 8,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-9'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 11], [11, 13], [12, 14], [13, 16]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_8']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 8,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-8'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 10], [12, 14], [13, 16]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 10,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['!in', 'Locality.countryCode', 'GBR'], ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_7']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 7,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-7'
  }, {
    layout: {
      'text-letter-spacing': 0.2,
      'text-size': {
        stops: [[6, 10], [12, 14], [13, 16]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 30,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.countryCode', 'GBR'], ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_7']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 7,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-7-GBR-TOMTOM'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[5, 0.3], [6, 0.4], [7, 0.5]]
      },
      'text-size': {
        stops: [[5, 8], [6, 10], [7, 14]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'Arial Unicode'],
      visibility: 'none',
      'text-field': '{name}',
      'text-padding': 5,
      'text-transform': 'uppercase'
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G1_COUNTRY_SUBDIVISION'], ['!in', 'WorldFeature.iso_3166_1_a2', 'AU', 'BR', 'CA', 'CN', 'IN', 'MX', 'US']],
    paint: {
      'text-color': '#2d5267',
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': 0
    },
    minzoom: 5,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'state-label-minor'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[3, 0.3], [4, 0.4], [5, 0.5]]
      },
      'text-size': {
        stops: [[3, 8], [5, 10], [8, 16]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'Arial Unicode'],
      'text-field': '{name}',
      'text-padding': 5,
      'text-transform': 'uppercase'
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G1_COUNTRY_SUBDIVISION'], ['in', 'WorldFeature.iso_3166_1_a2', 'AU', 'BR', 'CA', 'CN', 'IN', 'MX', 'US']],
    paint: {
      'text-color': '#2d5267',
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[3, 0], [3.3, 1]]
      }
    },
    minzoom: 3,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'state-label-major'
  }, {
    layout: {
      'text-letter-spacing': 0.04,
      'icon-padding': 2,
      'text-padding': 2,
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'Arial Unicode'],
      'text-anchor': 'top-left',
      'icon-image': {
        stops: [[12, '{icon}-small'], [13, '{icon}-medium']]
      },
      'text-field': '{name}',
      'text-justify': 'left',
      'text-offset': [0, 0.8],
      'text-size': {
        stops: [[15, 11], [16, 12]]
      },
      'text-max-width': 8,
      'icon-offset': [6, 0]
    },
    source: 'composite',
    filter: ['all', ['in', '$type', 'Point'], ['in', 'PlaceFeature.categoryName', 'AIRPORT']],
    paint: {
      'text-color': '#4e5f67',
      'icon-opacity': 1,
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': 1
    },
    minzoom: 10,
    'source-layer': 'points',
    type: 'symbol',
    id: 'poi-label-airport-composite',
    interactive: true
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[6, 10], [11, 13.5], [12, 16], [13, 19]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_6']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 6,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-6'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[5, 8], [6, 10], [11, 14.5], [12, 17], [13, 20]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_5']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 5.5,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-5'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[5, 8], [6, 10], [11, 14.5], [12, 17], [13, 20]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_4']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 5,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-4'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[2, 0.2], [3, 0.3], [4, 0.3], [5, 0.4]]
      },
      'text-size': {
        stops: [[1, 6], [3, 12], [5, 16], [8, 22]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 1,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G0_COUNTRY'], ['!in', 'AdminFeature.displayClass', 'CLASS_1', 'CLASS_2', 'CLASS_3']],
    paint: {
      'text-color': '#7398ad',
      'text-halo-width': 2,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[7, 1], [7.5, 0]]
      }
    },
    minzoom: 3,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'country-label-4'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[5, 8], [6, 10], [10, 15], [11, 18.5], [12, 21]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_3']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 5,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-3'
  }, {
    layout: {
      'text-letter-spacing': 0.15,
      'text-size': {
        stops: [[4, 6], [5, 8], [6, 10], [10, 15], [11, 18.5], [12, 21]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_2']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[2, 0], [2.3, 1], [12, 1], [12.5, 0]]
      }
    },
    minzoom: 1,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-2'
  }, {
    layout: {
      'text-letter-spacing': 0.2,
      'text-size': {
        stops: [[4, 6], [6, 10], [10, 14.5], [11, 18], [12, 21]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 2,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'Locality.type', 'CITY', 'CAPITAL_CITY'], ['in', 'Locality.displayClass', 'CLASS_1']],
    paint: {
      'text-color': {
        stops: [[10.5, '#7398ad'], [11, '#5d707c']]
      },
      'text-halo-width': 1,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[12, 1], [12.5, 0]]
      }
    },
    minzoom: 1,
    'source-layer': 'points',
    maxzoom: 12.5,
    type: 'symbol',
    id: 'municipality-label-1'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[2, 0.2], [3, 0.3], [4, 0.3], [5, 0.4]]
      },
      'text-size': {
        stops: [[1, 6], [3, 12], [5, 16], [8, 22]]
      },
      'text-font': ['ClanPro-NarrMedium', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 1,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G0_COUNTRY'], ['in', 'AdminFeature.displayClass', 'CLASS_3']],
    paint: {
      'text-color': '#7398ad',
      'text-halo-width': 2,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[7, 1], [7.5, 0]]
      }
    },
    minzoom: 1,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'country-label-3'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[2, 0.2], [3, 0.3], [4, 0.4], [5, 0.5]]
      },
      'text-size': {
        stops: [[1, 6], [3, 12], [5, 16], [8, 22]]
      },
      'text-font': ['ClanPro-NarrMedium', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 1,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G0_COUNTRY'], ['in', 'AdminFeature.displayClass', 'CLASS_2']],
    paint: {
      'text-color': '#7398ad',
      'text-halo-width': 2,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[7, 1], [7.5, 0]]
      }
    },
    minzoom: 1,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'country-label-2'
  }, {
    layout: {
      'text-letter-spacing': {
        stops: [[2, 0.2], [3, 0.3], [4, 0.4], [5, 0.5]]
      },
      'text-size': {
        stops: [[1, 6], [3, 12], [5, 16], [8, 22]]
      },
      'text-font': ['ClanProForUBER-MediumNarrow', 'NotoSansHebrew-Bold', 'NotoSansThai-Bold', 'NotoSansDevanagari-Bold', 'KacstBook', 'ArialUnicode-Bold'],
      'text-field': '{name}',
      'text-padding': 1,
      'text-transform': 'uppercase',
      'text-max-width': 8
    },
    source: 'composite',
    filter: ['all', ['in', 'AdminFeature.adminType', 'G0_COUNTRY'], ['in', 'AdminFeature.displayClass', 'CLASS_1']],
    paint: {
      'text-color': '#7398ad',
      'text-halo-width': 2,
      'text-halo-color': 'rgba(9, 16, 29, 0.8)',
      'text-opacity': {
        stops: [[7, 1], [7.5, 0]]
      }
    },
    minzoom: 1,
    'source-layer': 'points',
    maxzoom: 8,
    type: 'symbol',
    id: 'country-label-1'
  }],
  name: 'uber-stylesheet',
  created: '2015-07-30',
  sources: {
    composite: {
      tiles: ['https://d3dt5tsgfu6lcf.cloudfront.net/tile/v1/{z}/{x}/{y}/COMPOSITE'],
      name: 'uber',
      bounds: [-180, -85.0511, 180, 85.0511],
      prefetchable: true,
      minzoom: 0,
      maxzoom: 14,
      tilejson: '2.0.0',
      scheme: 'xyz',
      type: 'vector',
      tilezooms: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      center: [0, 0, 0]
    },
    buildings: {
      tiles: ['https://d3dt5tsgfu6lcf.cloudfront.net/tile/v1/{z}/{x}/{y}/BUILDINGS'],
      name: 'uber',
      bounds: [-180, -85.0511, 180, 85.0511],
      minzoom: 15,
      maxzoom: 15,
      tilejson: '2.0.0',
      scheme: 'xyz',
      type: 'vector',
      tilezooms: [15],
      center: [0, 0, 0]
    }
  },
  minzoom: 0,
  version: 8,
  owner: 'cwachsman',
  maxzoom: 22,
  glyphs: 'https://d3dt5tsgfu6lcf.cloudfront.net/glyph/{fontstack}/{range}',
  sprite: 'https://d3dt5tsgfu6lcf.cloudfront.net/sprite/tools/5/sprites'
};
var ACTION_PREFIX = exports.ACTION_PREFIX = '@@kepler.gl/';

var MAPBOX_ACCESS_TOKEN = exports.MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoidGllX' + '1gxUSJ9.gElUooDF7u51guCQREmAhg';

// TODO: don't include mapzen in kepler.gl
var MAPZEN_API_KEY = exports.MAPZEN_API_KEY = 'vector-tiles-u4xpG7G';

// TODO: cleanup styles, don't load uber style
var CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net';
var STYLE_PREFIX = CLOUDFRONT + '/map_styles';
var ICON_PREFIX = CLOUDFRONT + '/geodude';

// Modal Ids
var LAYER_CONFIG_ID = exports.LAYER_CONFIG_ID = 'copyConfig';
var DATA_TABLE_ID = exports.DATA_TABLE_ID = 'dataTable';
var DELETE_DATA_ID = exports.DELETE_DATA_ID = 'deleteData';
var ADD_DATA_ID = exports.ADD_DATA_ID = 'addData';

var DIMENSIONS = exports.DIMENSIONS = {
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

var PANELS = exports.PANELS = [{
  id: 'layer',
  label: 'Layers',
  iconComponent: _icons.Layers
}, {
  id: 'filter',
  label: 'Filters',
  iconComponent: _icons.FilterFunnel
}, {
  id: 'interaction',
  label: 'Interactions',
  iconComponent: _icons.CursorClick
}, {
  id: 'map',
  label: 'Base map',
  iconComponent: _icons.Settings
}];

var PANELS_FOOTER = exports.PANELS_FOOTER = [{
  id: LAYER_CONFIG_ID,
  label: 'Copy Config',
  icon: 'clipboard'
}];

// MAP STYLES
var INITIAL_STYLE_TYPE = exports.INITIAL_STYLE_TYPE = 'dark';
var DEFAULT_BLDG_COLOR = exports.DEFAULT_BLDG_COLOR = '#D1CEC7';

var DEFAULT_LAYER_GROUPS = exports.DEFAULT_LAYER_GROUPS = [{
  slug: 'label',
  filter: function filter(_ref) {
    var id = _ref.id;
    return id.match(/label/);
  },
  defaultVisibility: true
}, {
  slug: 'road',
  filter: function filter(_ref2) {
    var id = _ref2.id;
    return id.match(/(?=(road|railway))(?!.*label)/);
  },
  defaultVisibility: true
}, {
  slug: 'border',
  filter: function filter(_ref3) {
    var id = _ref3.id;
    return id.match(/border/);
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
    return id.match(/(?=(parks))/);
  },
  defaultVisibility: true
}];

var DEFAULT_MAP_STYLES = exports.DEFAULT_MAP_STYLES = [{
  id: 'dark',
  label: 'Dark',
  url: STYLE_PREFIX + '/tools-dark.json',
  icon: ICON_PREFIX + '/UBER_DARK_V2.png',
  style: toolsDark,
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'light',
  label: 'Light',
  url: STYLE_PREFIX + '/tools-light.json',
  icon: ICON_PREFIX + '/UBER_LIGHT_V2.png',
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'places',
  label: 'Places',
  url: STYLE_PREFIX + '/driver-ticker.json',
  icon: ICON_PREFIX + '/UBER_DRIVER_TICKER.png',
  layerGroups: [].concat(DEFAULT_LAYER_GROUPS, [{
    slug: 'places',
    filter: function filter(_ref7) {
      var id = _ref7.id;
      return id.match(/poi/);
    },
    defaultVisibility: true,
    editable: true
  }])
}, {
  id: 'muted',
  label: 'Muted',
  url: STYLE_PREFIX + '/driver-muted.json',
  icon: ICON_PREFIX + '/UBER_MUTED.png',
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'muted_night',
  label: 'Muted Night',
  url: STYLE_PREFIX + '/driver-night-muted.json',
  icon: ICON_PREFIX + '/UBER_NIGHT_MUTED.png',
  layerGroups: DEFAULT_LAYER_GROUPS
}, {
  id: 'street',
  label: 'Street',
  url: STYLE_PREFIX + '/tools-street.json',
  icon: ICON_PREFIX + '/UBER_MAP.jpg'
}, {
  label: 'Google Satellite',
  id: 'google_satellite',
  url: STYLE_PREFIX + '/tools-google-satellite.json',
  icon: ICON_PREFIX + '/GOOGLE_SATELLITE.jpg'
}];

var GEOJSON_FIELDS = exports.GEOJSON_FIELDS = {
  geojson: ['_geojson', 'all_points', 'geojson']
};

var HEXAGON_ID_FIELDS = exports.HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id']
};

var ICON_FIELDS = exports.ICON_FIELDS = {
  icon: ['icon']
};

var TRIP_POINT_FIELDS = exports.TRIP_POINT_FIELDS = [['lat', 'lng'], ['lat', 'lon'], ['latitude', 'longitude']];

var TRIP_ARC_FIELDS = exports.TRIP_ARC_FIELDS = {
  lat0: 'begintrip_lat',
  lng0: 'begintrip_lng',
  lat1: 'dropoff_lat',
  lng1: 'dropoff_lng'
};

var SCALE_TYPES = exports.SCALE_TYPES = (0, _keymirror2.default)({
  ordinal: null,
  quantile: null,
  quantize: null,
  linear: null,

  // for radius
  sqrt: null,
  // ordinal domain to linear range
  point: null
});

var SCALE_FUNC = exports.SCALE_FUNC = {
  linear: require('d3-scale').scaleLinear,
  quantize: require('d3-scale').scaleQuantize,
  quantile: require('d3-scale').scaleQuantile,
  ordinal: require('d3-scale').scaleOrdinal,
  sqrt: require('d3-scale').scaleSqrt,
  point: require('d3-scale').scalePoint
};

var ALL_FIELD_TYPES = exports.ALL_FIELD_TYPES = (0, _keymirror2.default)({
  boolean: null,
  date: null,
  geojson: null,
  integer: null,
  real: null,
  string: null,
  timestamp: null,
  point: null
});

var ORANGE = '248, 194, 28';
var PINK = '231, 189, 194';
var PURPLE = '160, 106, 206';
var BLUE = '140, 210, 205';
var BLUE2 = '106, 160, 206';
var BLUE3 = '0, 172, 237';
var GREEN = '106, 160, 56';
var RED = '237, 88, 106';

var FIELD_COLORS = exports.FIELD_COLORS = {
  default: RED
};

var FILED_TYPE_DISPLAY = exports.FILED_TYPE_DISPLAY = (_FILED_TYPE_DISPLAY = {}, (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.boolean, {
  label: 'bool',
  color: PINK
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.date, {
  label: 'date',
  color: PURPLE
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.geojson, {
  label: 'geo',
  color: BLUE2
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.integer, {
  label: 'int',
  color: ORANGE
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.real, {
  label: 'float',
  color: ORANGE
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.string, {
  label: 'string',
  color: BLUE
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.timestamp, {
  label: 'time',
  color: GREEN
}), (0, _defineProperty3.default)(_FILED_TYPE_DISPLAY, ALL_FIELD_TYPES.point, {
  label: 'point',
  color: BLUE3
}), _FILED_TYPE_DISPLAY);

var defaultFormat = exports.defaultFormat = function defaultFormat(d) {
  return d;
};

var FIELD_DISPLAY_FORMAT = exports.FIELD_DISPLAY_FORMAT = (_FIELD_DISPLAY_FORMAT = {}, (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.string, defaultFormat), (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.timestamp, defaultFormat), (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.integer, defaultFormat), (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.boolean, function (d) {
  return String(d);
}), (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.date, defaultFormat), (0, _defineProperty3.default)(_FIELD_DISPLAY_FORMAT, ALL_FIELD_TYPES.geojson, defaultFormat), _FIELD_DISPLAY_FORMAT);

var CHANNEL_SCALES = exports.CHANNEL_SCALES = (0, _keymirror2.default)({
  color: null,
  radius: null,
  size: null,
  colorAggr: null,
  sizeAggr: null
});

var linearFieldScaleFunctions = exports.linearFieldScaleFunctions = (_linearFieldScaleFunc = {}, (0, _defineProperty3.default)(_linearFieldScaleFunc, CHANNEL_SCALES.color, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty3.default)(_linearFieldScaleFunc, CHANNEL_SCALES.radius, [SCALE_TYPES.sqrt]), (0, _defineProperty3.default)(_linearFieldScaleFunc, CHANNEL_SCALES.size, [SCALE_TYPES.linear]), _linearFieldScaleFunc);

var linearFieldAggrScaleFunctions = exports.linearFieldAggrScaleFunctions = (_linearFieldAggrScale = {}, (0, _defineProperty3.default)(_linearFieldAggrScale, CHANNEL_SCALES.colorAggr, [SCALE_TYPES.quantize, SCALE_TYPES.quantile]), (0, _defineProperty3.default)(_linearFieldAggrScale, CHANNEL_SCALES.sizeAggr, [SCALE_TYPES.linear]), _linearFieldAggrScale);

var OrdinalFieldScaleFunctions = exports.OrdinalFieldScaleFunctions = (_OrdinalFieldScaleFun = {}, (0, _defineProperty3.default)(_OrdinalFieldScaleFun, CHANNEL_SCALES.color, [SCALE_TYPES.ordinal]), (0, _defineProperty3.default)(_OrdinalFieldScaleFun, CHANNEL_SCALES.radius, [SCALE_TYPES.point]), (0, _defineProperty3.default)(_OrdinalFieldScaleFun, CHANNEL_SCALES.size, [SCALE_TYPES.point]), _OrdinalFieldScaleFun);

var OrdinalFieldAggrScaleFunctions = exports.OrdinalFieldAggrScaleFunctions = (_OrdinalFieldAggrScal = {}, (0, _defineProperty3.default)(_OrdinalFieldAggrScal, CHANNEL_SCALES.colorAggr, []), (0, _defineProperty3.default)(_OrdinalFieldAggrScal, CHANNEL_SCALES.sizeAggr, []), _OrdinalFieldAggrScal);

var notSupportedScaleOpts = exports.notSupportedScaleOpts = (_notSupportedScaleOpt = {}, (0, _defineProperty3.default)(_notSupportedScaleOpt, CHANNEL_SCALES.color, []), (0, _defineProperty3.default)(_notSupportedScaleOpt, CHANNEL_SCALES.radius, []), (0, _defineProperty3.default)(_notSupportedScaleOpt, CHANNEL_SCALES.size, []), (0, _defineProperty3.default)(_notSupportedScaleOpt, CHANNEL_SCALES.colorAggr, []), (0, _defineProperty3.default)(_notSupportedScaleOpt, CHANNEL_SCALES.sizeAggr, []), _notSupportedScaleOpt);

/**
 * Define what type of scale operation is allowed on each type of fields
 */
var FIELD_OPTS = exports.FIELD_OPTS = {
  string: {
    type: 'categorical',
    scale: (0, _extends4.default)({}, OrdinalFieldScaleFunctions, OrdinalFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  real: {
    type: 'numerical',
    scale: (0, _extends4.default)({}, linearFieldScaleFunctions, linearFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  timestamp: {
    type: 'time',
    scale: linearFieldScaleFunctions,
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  integer: {
    type: 'numerical',
    scale: (0, _extends4.default)({}, linearFieldScaleFunctions, linearFieldAggrScaleFunctions),
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  boolean: {
    type: 'boolean',
    scale: OrdinalFieldScaleFunctions,
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  date: {
    scale: OrdinalFieldScaleFunctions,
    format: {
      legend: function legend(d) {
        return d;
      }
    }
  },
  geojson: {
    type: 'geometry',
    scale: notSupportedScaleOpts,
    format: {
      legend: function legend(d) {
        return '...';
      }
    }
  }
};

var CHANNEL_SCALE_SUPPORTED_FIELDS = exports.CHANNEL_SCALE_SUPPORTED_FIELDS = Object.keys(CHANNEL_SCALES).reduce(function (accu, key) {
  return (0, _extends4.default)({}, accu, (0, _defineProperty3.default)({}, key, Object.keys(FIELD_OPTS).filter(function (ft) {
    return FIELD_OPTS[ft].scale[key] && FIELD_OPTS[ft].scale[key].length;
  })));
}, {});

var LAYER_TYPES = exports.LAYER_TYPES = (0, _keymirror2.default)({
  point: null,
  arc: null,
  cluster: null,
  line: null,
  grid: null,
  geojson: null,
  icon: null,
  hexagon: null,
  hexagonId: null
});

// layer type to map-gl-layers
var LAYER_CLASSES = exports.LAYER_CLASSES = (_LAYER_CLASSES = {}, (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.point, 'PointLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.arc, 'ArcLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.cluster, 'ClusterLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.line, 'LineLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.grid, 'GridLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.geojson, 'GeojsonLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.icon, 'IconLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.hexagon, 'HexagonLayer'), (0, _defineProperty3.default)(_LAYER_CLASSES, LAYER_TYPES.hexagonId, 'H3HexagonLayer'), _LAYER_CLASSES);

// let user pass in default tooltip fields
var DEFAULT_TOOLTIP_FIELDS = exports.DEFAULT_TOOLTIP_FIELDS = [];

var DEFAULT_LIGHT_SETTINGS = exports.DEFAULT_LIGHT_SETTINGS = {
  lightsPosition: [-122.45, 37.66, 8000, -122.0, 38.0, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.3,
  lightsStrength: [0.9, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

var NO_VALUE_COLOR = exports.NO_VALUE_COLOR = [147, 147, 147];

var LAYER_BLENDINGS = exports.LAYER_BLENDINGS = {
  additive: {
    enable: true,
    blendFunc: ['SRC_ALPHA', 'DST_ALPHA'],
    blendEquation: 'FUNC_ADD'
  },
  normal: {
    enable: true,
    // reference to
    // https://limnu.com/webgl-blending-youre-probably-wrong/
    blendFuncSeparate: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'ONE', 'ONE_MINUS_SRC_ALPHA'],
    blendEquationSeparate: ['FUNC_ADD', 'FUNC_ADD']
  },
  subtractive: {
    enable: true,
    blendFuncSeparate: ['ONE', 'ONE_MINUS_DST_COLOR', 'SRC_ALPHA', 'DST_ALPHA'],
    blendEquationSeparate: ['FUNC_SUBTRACT', 'FUNC_ADD']
  }
};

var AGGREGATION_TYPES = exports.AGGREGATION_TYPES = (0, _keymirror2.default)({
  average: null,
  maximum: null,
  minimum: null,
  median: null,
  sum: null,
  countUnique: null
});

var MAX_DEFAULT_TOOLTIPS = exports.MAX_DEFAULT_TOOLTIPS = 5;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJBQ1RJT05fUFJFRklYIiwiTUFQQk9YX0FDQ0VTU19UT0tFTiIsIk1BUFpFTl9BUElfS0VZIiwiQ0xPVURGUk9OVCIsIlNUWUxFX1BSRUZJWCIsIklDT05fUFJFRklYIiwiTEFZRVJfQ09ORklHX0lEIiwiREFUQV9UQUJMRV9JRCIsIkRFTEVURV9EQVRBX0lEIiwiQUREX0RBVEFfSUQiLCJESU1FTlNJT05TIiwicWJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJzaWRlUGFuZWwiLCJ3aWR0aCIsIm1hcmdpbiIsInNpZGVQYW5lbFdpZHRoIiwic2lkZU5hdlciLCJzaWRlTmF2QyIsInRvcE9mZnNldCIsInNpZGVCYXJQYWRkaW5nIiwibGF5ZXJQYW5lbFBhZGRpbmciLCJtYXBMYXllclNlbGVjdG9ySGVpZ2h0IiwibWFwQ29udHJvbFdpZHRoIiwibWFwQ29udHJvbFBhZGRpbmciLCJQQU5FTFMiLCJpZCIsImxhYmVsIiwiaWNvbkNvbXBvbmVudCIsIlBBTkVMU19GT09URVIiLCJpY29uIiwiSU5JVElBTF9TVFlMRV9UWVBFIiwiREVGQVVMVF9CTERHX0NPTE9SIiwiREVGQVVMVF9MQVlFUl9HUk9VUFMiLCJzbHVnIiwiZmlsdGVyIiwibWF0Y2giLCJkZWZhdWx0VmlzaWJpbGl0eSIsIkRFRkFVTFRfTUFQX1NUWUxFUyIsInVybCIsInN0eWxlIiwidG9vbHNEYXJrIiwibGF5ZXJHcm91cHMiLCJlZGl0YWJsZSIsIkdFT0pTT05fRklFTERTIiwiZ2VvanNvbiIsIkhFWEFHT05fSURfRklFTERTIiwiaGV4X2lkIiwiSUNPTl9GSUVMRFMiLCJUUklQX1BPSU5UX0ZJRUxEUyIsIlRSSVBfQVJDX0ZJRUxEUyIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJTQ0FMRV9UWVBFUyIsIm9yZGluYWwiLCJxdWFudGlsZSIsInF1YW50aXplIiwibGluZWFyIiwic3FydCIsInBvaW50IiwiU0NBTEVfRlVOQyIsInJlcXVpcmUiLCJzY2FsZUxpbmVhciIsInNjYWxlUXVhbnRpemUiLCJzY2FsZVF1YW50aWxlIiwic2NhbGVPcmRpbmFsIiwic2NhbGVTcXJ0Iiwic2NhbGVQb2ludCIsIkFMTF9GSUVMRF9UWVBFUyIsImJvb2xlYW4iLCJkYXRlIiwiaW50ZWdlciIsInJlYWwiLCJzdHJpbmciLCJ0aW1lc3RhbXAiLCJPUkFOR0UiLCJQSU5LIiwiUFVSUExFIiwiQkxVRSIsIkJMVUUyIiwiQkxVRTMiLCJHUkVFTiIsIlJFRCIsIkZJRUxEX0NPTE9SUyIsImRlZmF1bHQiLCJGSUxFRF9UWVBFX0RJU1BMQVkiLCJjb2xvciIsImRlZmF1bHRGb3JtYXQiLCJkIiwiRklFTERfRElTUExBWV9GT1JNQVQiLCJTdHJpbmciLCJDSEFOTkVMX1NDQUxFUyIsInJhZGl1cyIsInNpemUiLCJjb2xvckFnZ3IiLCJzaXplQWdnciIsImxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMiLCJsaW5lYXJGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9ucyIsIk9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zIiwiT3JkaW5hbEZpZWxkQWdnclNjYWxlRnVuY3Rpb25zIiwibm90U3VwcG9ydGVkU2NhbGVPcHRzIiwiRklFTERfT1BUUyIsInR5cGUiLCJzY2FsZSIsImZvcm1hdCIsImxlZ2VuZCIsIkNIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1Iiwia2V5IiwiZnQiLCJsZW5ndGgiLCJMQVlFUl9UWVBFUyIsImFyYyIsImNsdXN0ZXIiLCJsaW5lIiwiZ3JpZCIsImhleGFnb24iLCJoZXhhZ29uSWQiLCJMQVlFUl9DTEFTU0VTIiwiREVGQVVMVF9UT09MVElQX0ZJRUxEUyIsIkRFRkFVTFRfTElHSFRfU0VUVElOR1MiLCJsaWdodHNQb3NpdGlvbiIsImFtYmllbnRSYXRpbyIsImRpZmZ1c2VSYXRpbyIsInNwZWN1bGFyUmF0aW8iLCJsaWdodHNTdHJlbmd0aCIsIm51bWJlck9mTGlnaHRzIiwiTk9fVkFMVUVfQ09MT1IiLCJMQVlFUl9CTEVORElOR1MiLCJhZGRpdGl2ZSIsImVuYWJsZSIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJub3JtYWwiLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsInN1YnRyYWN0aXZlIiwiQUdHUkVHQVRJT05fVFlQRVMiLCJhdmVyYWdlIiwibWF4aW11bSIsIm1pbmltdW0iLCJtZWRpYW4iLCJzdW0iLCJjb3VudFVuaXF1ZSIsIk1BWF9ERUZBVUxUX1RPT0xUSVBTIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBc0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUF1QixDQUFDLFVBQUQsRUFBYSxVQUFiO0FBVmpCLEdBTnFCO0FBa0I3QkMsZUFBYTtBQUNYTixZQUFRLElBREc7QUFFWEksdUJBQW1CLENBQUMsS0FBRCxFQUFRLHFCQUFSLEVBQStCLFdBQS9CLEVBQTRDLFdBQTVDLENBRlI7QUFHWEMsMkJBQXVCLENBQUMsZUFBRCxFQUFrQixVQUFsQjtBQUhaO0FBbEJnQixDQUF4Qjs7QUF5QkEsSUFBTUUsZ0RBQW9CLHlCQUFVO0FBQ3pDQyxXQUFTLElBRGdDO0FBRXpDQyxXQUFTLElBRmdDO0FBR3pDQyxXQUFTLElBSGdDO0FBSXpDQyxVQUFRLElBSmlDO0FBS3pDQyxPQUFLLElBTG9DO0FBTXpDQyxlQUFhO0FBTjRCLENBQVYsQ0FBMUI7O0FBU0EsSUFBTUMsc0RBQXVCLENBQTdCIiwiZmlsZSI6ImRlZmF1bHQtc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5pbXBvcnQgdG9vbHNEYXJrIGZyb20gJy4vbWFwLXN0eWxlcy90b29scy1kYXJrLmpzb24nO1xuXG5leHBvcnQgY29uc3QgQUNUSU9OX1BSRUZJWCA9ICdAQGtlcGxlci5nbC8nO1xuXG5leHBvcnQgY29uc3QgTUFQQk9YX0FDQ0VTU19UT0tFTiA9XG4gICdway5leUoxSWpvaWRXSmxjbVJoZEdFaUxDSmhJam9pZEdsbFgnICsgJzFneFVTSjkuZ0VsVW9vREY3dTUxZ3VDUVJFbUFoZyc7XG5cbi8vIFRPRE86IGRvbid0IGluY2x1ZGUgbWFwemVuIGluIGtlcGxlci5nbFxuZXhwb3J0IGNvbnN0IE1BUFpFTl9BUElfS0VZID0gJ3ZlY3Rvci10aWxlcy11NHhwRzdHJztcblxuLy8gVE9ETzogY2xlYW51cCBzdHlsZXMsIGRvbid0IGxvYWQgdWJlciBzdHlsZVxuY29uc3QgQ0xPVURGUk9OVCA9ICdodHRwczovL2QxYTNmNHNwYXp6cnA0LmNsb3VkZnJvbnQubmV0JztcbmNvbnN0IFNUWUxFX1BSRUZJWCA9IGAke0NMT1VERlJPTlR9L21hcF9zdHlsZXNgO1xuY29uc3QgSUNPTl9QUkVGSVggPSBgJHtDTE9VREZST05UfS9nZW9kdWRlYDtcblxuLy8gTW9kYWwgSWRzXG5leHBvcnQgY29uc3QgTEFZRVJfQ09ORklHX0lEID0gJ2NvcHlDb25maWcnO1xuZXhwb3J0IGNvbnN0IERBVEFfVEFCTEVfSUQgPSAnZGF0YVRhYmxlJztcbmV4cG9ydCBjb25zdCBERUxFVEVfREFUQV9JRCA9ICdkZWxldGVEYXRhJztcbmV4cG9ydCBjb25zdCBBRERfREFUQV9JRCA9ICdhZGREYXRhJztcblxuaW1wb3J0IHtcbiAgTGF5ZXJzLFxuICBGaWx0ZXJGdW5uZWwsXG4gIFNldHRpbmdzLFxuICBDdXJzb3JDbGlja1xufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmV4cG9ydCBjb25zdCBESU1FTlNJT05TID0ge1xuICAvLyBUT0RPOiByZW1vdmUgdXNlIHRvIHFiSGVpaGd0XG4gIHFiSGVpZ2h0OiA2MixcbiAgaGVhZGVySGVpZ2h0OiA1NSxcblxuICBzaWRlUGFuZWw6IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIG1hcmdpbjogMjAsXG4gICAgaGVhZGVySGVpZ2h0OiA5NlxuICB9LFxuXG4gIHNpZGVQYW5lbFdpZHRoOiAzMDAsXG5cbiAgc2lkZU5hdlc6IDEyMCxcbiAgc2lkZU5hdkM6IDQwLFxuICB0b3BPZmZzZXQ6IDExNyxcbiAgc2lkZUJhclBhZGRpbmc6IDI0LFxuICBsYXllclBhbmVsUGFkZGluZzogMTIsXG4gIG1hcExheWVyU2VsZWN0b3JIZWlnaHQ6IDI1MCxcbiAgbWFwQ29udHJvbFdpZHRoOiAyMDQsXG4gIG1hcENvbnRyb2xQYWRkaW5nOiAxMlxufTtcblxuZXhwb3J0IGNvbnN0IFBBTkVMUyA9IFtcbiAge1xuICAgIGlkOiAnbGF5ZXInLFxuICAgIGxhYmVsOiAnTGF5ZXJzJyxcbiAgICBpY29uQ29tcG9uZW50OiBMYXllcnNcbiAgfSxcbiAge1xuICAgIGlkOiAnZmlsdGVyJyxcbiAgICBsYWJlbDogJ0ZpbHRlcnMnLFxuICAgIGljb25Db21wb25lbnQ6IEZpbHRlckZ1bm5lbFxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlcmFjdGlvbicsXG4gICAgbGFiZWw6ICdJbnRlcmFjdGlvbnMnLFxuICAgIGljb25Db21wb25lbnQ6IEN1cnNvckNsaWNrXG4gIH0sXG4gIHtcbiAgICBpZDogJ21hcCcsXG4gICAgbGFiZWw6ICdCYXNlIG1hcCcsXG4gICAgaWNvbkNvbXBvbmVudDogU2V0dGluZ3NcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IFBBTkVMU19GT09URVIgPSBbXG4gIHtcbiAgICBpZDogTEFZRVJfQ09ORklHX0lELFxuICAgIGxhYmVsOiAnQ29weSBDb25maWcnLFxuICAgIGljb246ICdjbGlwYm9hcmQnXG4gIH1cbl07XG5cbi8vIE1BUCBTVFlMRVNcbmV4cG9ydCBjb25zdCBJTklUSUFMX1NUWUxFX1RZUEUgPSAnZGFyayc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CTERHX0NPTE9SID0gJyNEMUNFQzcnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQVlFUl9HUk9VUFMgPSBbXG4gIHtcbiAgICBzbHVnOiAnbGFiZWwnLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC9sYWJlbC8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzbHVnOiAncm9hZCcsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PShyb2FkfHJhaWx3YXkpKSg/IS4qbGFiZWwpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdib3JkZXInLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC9ib3JkZXIvKSxcbiAgICBkZWZhdWx0VmlzaWJpbGl0eTogZmFsc2VcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdidWlsZGluZycsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goL2J1aWxkaW5nLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICd3YXRlcicsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PSh3YXRlcnxzdHJlYW18ZmVycnkpKS8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzbHVnOiAnbGFuZCcsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PShwYXJrcykpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFQX1NUWUxFUyA9IFtcbiAge1xuICAgIGlkOiAnZGFyaycsXG4gICAgbGFiZWw6ICdEYXJrJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vdG9vbHMtZGFyay5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9EQVJLX1YyLnBuZ2AsXG4gICAgc3R5bGU6IHRvb2xzRGFyayxcbiAgICBsYXllckdyb3VwczogREVGQVVMVF9MQVlFUl9HUk9VUFNcbiAgfSxcbiAge1xuICAgIGlkOiAnbGlnaHQnLFxuICAgIGxhYmVsOiAnTGlnaHQnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS90b29scy1saWdodC5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9MSUdIVF9WMi5wbmdgLFxuICAgIGxheWVyR3JvdXBzOiBERUZBVUxUX0xBWUVSX0dST1VQU1xuICB9LFxuICB7XG4gICAgaWQ6ICdwbGFjZXMnLFxuICAgIGxhYmVsOiAnUGxhY2VzJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vZHJpdmVyLXRpY2tlci5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9EUklWRVJfVElDS0VSLnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6IFtcbiAgICAgIC4uLkRFRkFVTFRfTEFZRVJfR1JPVVBTLFxuICAgICAge1xuICAgICAgICBzbHVnOiAncGxhY2VzJyxcbiAgICAgICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goL3BvaS8pLFxuICAgICAgICBkZWZhdWx0VmlzaWJpbGl0eTogdHJ1ZSxcbiAgICAgICAgZWRpdGFibGU6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ211dGVkJyxcbiAgICBsYWJlbDogJ011dGVkJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vZHJpdmVyLW11dGVkLmpzb25gLFxuICAgIGljb246IGAke0lDT05fUFJFRklYfS9VQkVSX01VVEVELnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6IERFRkFVTFRfTEFZRVJfR1JPVVBTXG4gIH0sXG4gIHtcbiAgICBpZDogJ211dGVkX25pZ2h0JyxcbiAgICBsYWJlbDogJ011dGVkIE5pZ2h0JyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vZHJpdmVyLW5pZ2h0LW11dGVkLmpzb25gLFxuICAgIGljb246IGAke0lDT05fUFJFRklYfS9VQkVSX05JR0hUX01VVEVELnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6IERFRkFVTFRfTEFZRVJfR1JPVVBTXG4gIH0sXG4gIHtcbiAgICBpZDogJ3N0cmVldCcsXG4gICAgbGFiZWw6ICdTdHJlZXQnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS90b29scy1zdHJlZXQuanNvbmAsXG4gICAgaWNvbjogYCR7SUNPTl9QUkVGSVh9L1VCRVJfTUFQLmpwZ2BcbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnR29vZ2xlIFNhdGVsbGl0ZScsXG4gICAgaWQ6ICdnb29nbGVfc2F0ZWxsaXRlJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vdG9vbHMtZ29vZ2xlLXNhdGVsbGl0ZS5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vR09PR0xFX1NBVEVMTElURS5qcGdgXG4gIH1cbl07XG5cbmV4cG9ydCBjb25zdCBHRU9KU09OX0ZJRUxEUyA9IHtcbiAgZ2VvanNvbjogWydfZ2VvanNvbicsICdhbGxfcG9pbnRzJywgJ2dlb2pzb24nXVxufTtcblxuZXhwb3J0IGNvbnN0IEhFWEFHT05fSURfRklFTERTID0ge1xuICBoZXhfaWQ6IFsnaGV4X2lkJywgJ2hleGFnb25faWQnXVxufTtcblxuZXhwb3J0IGNvbnN0IElDT05fRklFTERTID0ge1xuICBpY29uOiBbJ2ljb24nXVxufTtcblxuZXhwb3J0IGNvbnN0IFRSSVBfUE9JTlRfRklFTERTID0gW1xuICBbJ2xhdCcsICdsbmcnXSxcbiAgWydsYXQnLCAnbG9uJ10sXG4gIFsnbGF0aXR1ZGUnLCAnbG9uZ2l0dWRlJ11cbl07XG5cbmV4cG9ydCBjb25zdCBUUklQX0FSQ19GSUVMRFMgPSB7XG4gIGxhdDA6ICdiZWdpbnRyaXBfbGF0JyxcbiAgbG5nMDogJ2JlZ2ludHJpcF9sbmcnLFxuICBsYXQxOiAnZHJvcG9mZl9sYXQnLFxuICBsbmcxOiAnZHJvcG9mZl9sbmcnXG59O1xuXG5leHBvcnQgY29uc3QgU0NBTEVfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBvcmRpbmFsOiBudWxsLFxuICBxdWFudGlsZTogbnVsbCxcbiAgcXVhbnRpemU6IG51bGwsXG4gIGxpbmVhcjogbnVsbCxcblxuICAvLyBmb3IgcmFkaXVzXG4gIHNxcnQ6IG51bGwsXG4gIC8vIG9yZGluYWwgZG9tYWluIHRvIGxpbmVhciByYW5nZVxuICBwb2ludDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBTQ0FMRV9GVU5DID0ge1xuICBsaW5lYXI6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVMaW5lYXIsXG4gIHF1YW50aXplOiByZXF1aXJlKCdkMy1zY2FsZScpLnNjYWxlUXVhbnRpemUsXG4gIHF1YW50aWxlOiByZXF1aXJlKCdkMy1zY2FsZScpLnNjYWxlUXVhbnRpbGUsXG4gIG9yZGluYWw6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVPcmRpbmFsLFxuICBzcXJ0OiByZXF1aXJlKCdkMy1zY2FsZScpLnNjYWxlU3FydCxcbiAgcG9pbnQ6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVQb2ludFxufTtcblxuZXhwb3J0IGNvbnN0IEFMTF9GSUVMRF9UWVBFUyA9IGtleU1pcnJvcih7XG4gIGJvb2xlYW46IG51bGwsXG4gIGRhdGU6IG51bGwsXG4gIGdlb2pzb246IG51bGwsXG4gIGludGVnZXI6IG51bGwsXG4gIHJlYWw6IG51bGwsXG4gIHN0cmluZzogbnVsbCxcbiAgdGltZXN0YW1wOiBudWxsLFxuICBwb2ludDogbnVsbFxufSk7XG5cbmNvbnN0IE9SQU5HRSA9ICcyNDgsIDE5NCwgMjgnO1xuY29uc3QgUElOSyA9ICcyMzEsIDE4OSwgMTk0JztcbmNvbnN0IFBVUlBMRSA9ICcxNjAsIDEwNiwgMjA2JztcbmNvbnN0IEJMVUUgPSAnMTQwLCAyMTAsIDIwNSc7XG5jb25zdCBCTFVFMiA9ICcxMDYsIDE2MCwgMjA2JztcbmNvbnN0IEJMVUUzID0gJzAsIDE3MiwgMjM3JztcbmNvbnN0IEdSRUVOID0gJzEwNiwgMTYwLCA1Nic7XG5jb25zdCBSRUQgPSAnMjM3LCA4OCwgMTA2JztcblxuZXhwb3J0IGNvbnN0IEZJRUxEX0NPTE9SUyA9IHtcbiAgZGVmYXVsdDogUkVEXG59O1xuXG5leHBvcnQgY29uc3QgRklMRURfVFlQRV9ESVNQTEFZID0ge1xuICBbQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW5dOiB7XG4gICAgbGFiZWw6ICdib29sJyxcbiAgICBjb2xvcjogUElOS1xuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLmRhdGVdOiB7XG4gICAgbGFiZWw6ICdkYXRlJyxcbiAgICBjb2xvcjogUFVSUExFXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMuZ2VvanNvbl06IHtcbiAgICBsYWJlbDogJ2dlbycsXG4gICAgY29sb3I6IEJMVUUyXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06IHtcbiAgICBsYWJlbDogJ2ludCcsXG4gICAgY29sb3I6IE9SQU5HRVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiB7XG4gICAgbGFiZWw6ICdmbG9hdCcsXG4gICAgY29sb3I6IE9SQU5HRVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnN0cmluZ106IHtcbiAgICBsYWJlbDogJ3N0cmluZycsXG4gICAgY29sb3I6IEJMVUVcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXBdOiB7XG4gICAgbGFiZWw6ICd0aW1lJyxcbiAgICBjb2xvcjogR1JFRU5cbiAgfSxcbiAgLy8gZmllbGQgcGFpcnNcbiAgW0FMTF9GSUVMRF9UWVBFUy5wb2ludF06IHtcbiAgICBsYWJlbDogJ3BvaW50JyxcbiAgICBjb2xvcjogQkxVRTNcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRGb3JtYXQgPSBkID0+IGQ7XG5cbmV4cG9ydCBjb25zdCBGSUVMRF9ESVNQTEFZX0ZPUk1BVCA9IHtcbiAgW0FMTF9GSUVMRF9UWVBFUy5zdHJpbmddOiBkZWZhdWx0Rm9ybWF0LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcF06IGRlZmF1bHRGb3JtYXQsXG4gIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06IGRlZmF1bHRGb3JtYXQsXG4gIFtBTExfRklFTERfVFlQRVMuYm9vbGVhbl06IGQgPT4gU3RyaW5nKGQpLFxuICBbQUxMX0ZJRUxEX1RZUEVTLmRhdGVdOiBkZWZhdWx0Rm9ybWF0LFxuICBbQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb25dOiBkZWZhdWx0Rm9ybWF0XG59O1xuXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TQ0FMRVMgPSBrZXlNaXJyb3Ioe1xuICBjb2xvcjogbnVsbCxcbiAgcmFkaXVzOiBudWxsLFxuICBzaXplOiBudWxsLFxuICBjb2xvckFnZ3I6IG51bGwsXG4gIHNpemVBZ2dyOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IGxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvcl06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdLFxuICBbQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXTogW1NDQUxFX1RZUEVTLnNxcnRdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuc2l6ZV06IFtTQ0FMRV9UWVBFUy5saW5lYXJdXG59O1xuXG5leHBvcnQgY29uc3QgbGluZWFyRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JdOiBbU0NBTEVfVFlQRVMucXVhbnRpemUsIFNDQUxFX1RZUEVTLnF1YW50aWxlXSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXTogW1NDQUxFX1RZUEVTLmxpbmVhcl1cbn07XG5cbmV4cG9ydCBjb25zdCBPcmRpbmFsRmllbGRTY2FsZUZ1bmN0aW9ucyA9IHtcbiAgW0NIQU5ORUxfU0NBTEVTLmNvbG9yXTogW1NDQUxFX1RZUEVTLm9yZGluYWxdLFxuICBbQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXTogW1NDQUxFX1RZUEVTLnBvaW50XSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVdOiBbU0NBTEVfVFlQRVMucG9pbnRdXG59O1xuXG5leHBvcnQgY29uc3QgT3JkaW5hbEZpZWxkQWdnclNjYWxlRnVuY3Rpb25zID0ge1xuICAvLyBDdXJyZW50bHkgZG9lc24ndCBzdXBwb3J0IHlldFxuICBbQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyXTogW10sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplQWdncl06IFtdXG59O1xuXG5leHBvcnQgY29uc3Qgbm90U3VwcG9ydGVkU2NhbGVPcHRzID0ge1xuICBbQ0hBTk5FTF9TQ0FMRVMuY29sb3JdOiBbXSxcbiAgW0NIQU5ORUxfU0NBTEVTLnJhZGl1c106IFtdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuc2l6ZV06IFtdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyXTogW10sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplQWdncl06IFtdXG59O1xuXG4vKipcbiAqIERlZmluZSB3aGF0IHR5cGUgb2Ygc2NhbGUgb3BlcmF0aW9uIGlzIGFsbG93ZWQgb24gZWFjaCB0eXBlIG9mIGZpZWxkc1xuICovXG5leHBvcnQgY29uc3QgRklFTERfT1BUUyA9IHtcbiAgc3RyaW5nOiB7XG4gICAgdHlwZTogJ2NhdGVnb3JpY2FsJyxcbiAgICBzY2FsZToge1xuICAgICAgLi4uT3JkaW5hbEZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgICAuLi5PcmRpbmFsRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnNcbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGRcbiAgICB9XG4gIH0sXG4gIHJlYWw6IHtcbiAgICB0eXBlOiAnbnVtZXJpY2FsJyxcbiAgICBzY2FsZToge1xuICAgICAgLi4ubGluZWFyRmllbGRTY2FsZUZ1bmN0aW9ucyxcbiAgICAgIC4uLmxpbmVhckZpZWxkQWdnclNjYWxlRnVuY3Rpb25zXG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkXG4gICAgfVxuICB9LFxuICB0aW1lc3RhbXA6IHtcbiAgICB0eXBlOiAndGltZScsXG4gICAgc2NhbGU6IGxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgZm9ybWF0OiB7XG4gICAgICBsZWdlbmQ6IGQgPT4gZFxuICAgIH1cbiAgfSxcbiAgaW50ZWdlcjoge1xuICAgIHR5cGU6ICdudW1lcmljYWwnLFxuICAgIHNjYWxlOiB7XG4gICAgICAuLi5saW5lYXJGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ubGluZWFyRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnNcbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGRcbiAgICB9XG4gIH0sXG4gIGJvb2xlYW46IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgc2NhbGU6IE9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGRcbiAgICB9XG4gIH0sXG4gIGRhdGU6IHtcbiAgICBzY2FsZTogT3JkaW5hbEZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgZm9ybWF0OiB7XG4gICAgICBsZWdlbmQ6IGQgPT4gZFxuICAgIH1cbiAgfSxcbiAgZ2VvanNvbjoge1xuICAgIHR5cGU6ICdnZW9tZXRyeScsXG4gICAgc2NhbGU6IG5vdFN1cHBvcnRlZFNjYWxlT3B0cyxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiAnLi4uJ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUyA9IE9iamVjdC5rZXlzKFxuICBDSEFOTkVMX1NDQUxFU1xuKS5yZWR1Y2UoXG4gIChhY2N1LCBrZXkpID0+ICh7XG4gICAgLi4uYWNjdSxcbiAgICBba2V5XTogT2JqZWN0LmtleXMoRklFTERfT1BUUykuZmlsdGVyKFxuICAgICAgZnQgPT4gRklFTERfT1BUU1tmdF0uc2NhbGVba2V5XSAmJiBGSUVMRF9PUFRTW2Z0XS5zY2FsZVtrZXldLmxlbmd0aFxuICAgIClcbiAgfSksXG4gIHt9XG4pO1xuXG5leHBvcnQgY29uc3QgTEFZRVJfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBwb2ludDogbnVsbCxcbiAgYXJjOiBudWxsLFxuICBjbHVzdGVyOiBudWxsLFxuICBsaW5lOiBudWxsLFxuICBncmlkOiBudWxsLFxuICBnZW9qc29uOiBudWxsLFxuICBpY29uOiBudWxsLFxuICBoZXhhZ29uOiBudWxsLFxuICBoZXhhZ29uSWQ6IG51bGxcbn0pO1xuXG4vLyBsYXllciB0eXBlIHRvIG1hcC1nbC1sYXllcnNcbmV4cG9ydCBjb25zdCBMQVlFUl9DTEFTU0VTID0ge1xuICBbTEFZRVJfVFlQRVMucG9pbnRdOiAnUG9pbnRMYXllcicsXG4gIFtMQVlFUl9UWVBFUy5hcmNdOiAnQXJjTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuY2x1c3Rlcl06ICdDbHVzdGVyTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMubGluZV06ICdMaW5lTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuZ3JpZF06ICdHcmlkTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuZ2VvanNvbl06ICdHZW9qc29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaWNvbl06ICdJY29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaGV4YWdvbl06ICdIZXhhZ29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaGV4YWdvbklkXTogJ0gzSGV4YWdvbkxheWVyJ1xufTtcblxuLy8gbGV0IHVzZXIgcGFzcyBpbiBkZWZhdWx0IHRvb2x0aXAgZmllbGRzXG5leHBvcnQgY29uc3QgREVGQVVMVF9UT09MVElQX0ZJRUxEUyA9IFtdO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MSUdIVF9TRVRUSU5HUyA9IHtcbiAgbGlnaHRzUG9zaXRpb246IFstMTIyLjQ1LCAzNy42NiwgODAwMCwgLTEyMi4wLCAzOC4wLCA4MDAwXSxcbiAgYW1iaWVudFJhdGlvOiAwLjQsXG4gIGRpZmZ1c2VSYXRpbzogMC42LFxuICBzcGVjdWxhclJhdGlvOiAwLjMsXG4gIGxpZ2h0c1N0cmVuZ3RoOiBbMC45LCAwLjAsIDAuOCwgMC4wXSxcbiAgbnVtYmVyT2ZMaWdodHM6IDJcbn07XG5cbmV4cG9ydCBjb25zdCBOT19WQUxVRV9DT0xPUiA9IFsxNDcsIDE0NywgMTQ3XTtcblxuZXhwb3J0IGNvbnN0IExBWUVSX0JMRU5ESU5HUyA9IHtcbiAgYWRkaXRpdmU6IHtcbiAgICBlbmFibGU6IHRydWUsXG4gICAgYmxlbmRGdW5jOiBbJ1NSQ19BTFBIQScsICdEU1RfQUxQSEEnXSxcbiAgICBibGVuZEVxdWF0aW9uOiAnRlVOQ19BREQnXG4gIH0sXG4gIG5vcm1hbDoge1xuICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAvLyByZWZlcmVuY2UgdG9cbiAgICAvLyBodHRwczovL2xpbW51LmNvbS93ZWJnbC1ibGVuZGluZy15b3VyZS1wcm9iYWJseS13cm9uZy9cbiAgICBibGVuZEZ1bmNTZXBhcmF0ZTogW1xuICAgICAgJ1NSQ19BTFBIQScsXG4gICAgICAnT05FX01JTlVTX1NSQ19BTFBIQScsXG4gICAgICAnT05FJyxcbiAgICAgICdPTkVfTUlOVVNfU1JDX0FMUEhBJ1xuICAgIF0sXG4gICAgYmxlbmRFcXVhdGlvblNlcGFyYXRlOiBbJ0ZVTkNfQUREJywgJ0ZVTkNfQUREJ11cbiAgfSxcbiAgc3VidHJhY3RpdmU6IHtcbiAgICBlbmFibGU6IHRydWUsXG4gICAgYmxlbmRGdW5jU2VwYXJhdGU6IFsnT05FJywgJ09ORV9NSU5VU19EU1RfQ09MT1InLCAnU1JDX0FMUEhBJywgJ0RTVF9BTFBIQSddLFxuICAgIGJsZW5kRXF1YXRpb25TZXBhcmF0ZTogWydGVU5DX1NVQlRSQUNUJywgJ0ZVTkNfQUREJ11cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEFHR1JFR0FUSU9OX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgYXZlcmFnZTogbnVsbCxcbiAgbWF4aW11bTogbnVsbCxcbiAgbWluaW11bTogbnVsbCxcbiAgbWVkaWFuOiBudWxsLFxuICBzdW06IG51bGwsXG4gIGNvdW50VW5pcXVlOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IE1BWF9ERUZBVUxUX1RPT0xUSVBTID0gNTtcbiJdfQ==