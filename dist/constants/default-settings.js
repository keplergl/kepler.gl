'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_DEFAULT_TOOLTIPS = exports.AGGREGATION_TYPES = exports.LAYER_BLENDINGS = exports.NO_VALUE_COLOR = exports.DEFAULT_LIGHT_SETTINGS = exports.DEFAULT_TOOLTIP_FIELDS = exports.LAYER_CLASSES = exports.LAYER_TYPES = exports.CHANNEL_SCALE_SUPPORTED_FIELDS = exports.FIELD_OPTS = exports.notSupportedScaleOpts = exports.OrdinalFieldAggrScaleFunctions = exports.OrdinalFieldScaleFunctions = exports.linearFieldAggrScaleFunctions = exports.linearFieldScaleFunctions = exports.CHANNEL_SCALES = exports.FIELD_DISPLAY_FORMAT = exports.defaultFormat = exports.FILED_TYPE_DISPLAY = exports.FIELD_COLORS = exports.ALL_FIELD_TYPES = exports.SCALE_FUNC = exports.SCALE_TYPES = exports.TRIP_ARC_FIELDS = exports.TRIP_POINT_FIELDS = exports.ICON_FIELDS = exports.HEXAGON_ID_FIELDS = exports.GEOJSON_FIELDS = exports.DEFAULT_MAP_STYLES = exports.DEFAULT_LAYER_GROUPS = exports.DEFAULT_BLDG_COLOR = exports.INITIAL_STYLE_TYPE = exports.PANELS_FOOTER = exports.PANELS = exports.DIMENSIONS = exports.ADD_DATA_ID = exports.DELETE_DATA_ID = exports.DATA_TABLE_ID = exports.LAYER_CONFIG_ID = exports.MAPZEN_API_KEY = exports.MAPBOX_ACCESS_TOKEN = exports.ACTION_PREFIX = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _FILED_TYPE_DISPLAY, _FIELD_DISPLAY_FORMAT, _linearFieldScaleFunc, _linearFieldAggrScale, _OrdinalFieldScaleFun, _OrdinalFieldAggrScal, _notSupportedScaleOpt, _LAYER_CLASSES;

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

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

  sideBarWidth: 360,
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
  icon: 'layers'
}, {
  id: 'filter',
  label: 'Filters',
  icon: 'search'
}, {
  id: 'interaction',
  label: 'Interactions',
  icon: 'location'
}, {
  id: 'map',
  label: 'Base map',
  icon: 'place'
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

var FILED_TYPE_DISPLAY = exports.FILED_TYPE_DISPLAY = (_FILED_TYPE_DISPLAY = {}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.boolean] = {
  label: 'bool',
  color: PINK
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.date] = {
  label: 'date',
  color: PURPLE
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.geojson] = {
  label: 'geo',
  color: BLUE2
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.integer] = {
  label: 'int',
  color: ORANGE
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.real] = {
  label: 'float',
  color: ORANGE
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.string] = {
  label: 'string',
  color: BLUE
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.timestamp] = {
  label: 'time',
  color: GREEN
}, _FILED_TYPE_DISPLAY[ALL_FIELD_TYPES.point] = {
  label: 'point',
  color: BLUE3
}, _FILED_TYPE_DISPLAY);

var defaultFormat = exports.defaultFormat = function defaultFormat(d) {
  return d;
};

var FIELD_DISPLAY_FORMAT = exports.FIELD_DISPLAY_FORMAT = (_FIELD_DISPLAY_FORMAT = {}, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.string] = defaultFormat, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.timestamp] = defaultFormat, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.integer] = defaultFormat, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.boolean] = function (d) {
  return String(d);
}, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.date] = defaultFormat, _FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.geojson] = defaultFormat, _FIELD_DISPLAY_FORMAT);

var CHANNEL_SCALES = exports.CHANNEL_SCALES = (0, _keymirror2.default)({
  color: null,
  radius: null,
  size: null,
  colorAggr: null,
  sizeAggr: null
});

var linearFieldScaleFunctions = exports.linearFieldScaleFunctions = (_linearFieldScaleFunc = {}, _linearFieldScaleFunc[CHANNEL_SCALES.color] = [SCALE_TYPES.quantize, SCALE_TYPES.quantile], _linearFieldScaleFunc[CHANNEL_SCALES.radius] = [SCALE_TYPES.sqrt], _linearFieldScaleFunc[CHANNEL_SCALES.size] = [SCALE_TYPES.linear], _linearFieldScaleFunc);

var linearFieldAggrScaleFunctions = exports.linearFieldAggrScaleFunctions = (_linearFieldAggrScale = {}, _linearFieldAggrScale[CHANNEL_SCALES.colorAggr] = [SCALE_TYPES.quantize, SCALE_TYPES.quantile], _linearFieldAggrScale[CHANNEL_SCALES.sizeAggr] = [SCALE_TYPES.linear], _linearFieldAggrScale);

var OrdinalFieldScaleFunctions = exports.OrdinalFieldScaleFunctions = (_OrdinalFieldScaleFun = {}, _OrdinalFieldScaleFun[CHANNEL_SCALES.color] = [SCALE_TYPES.ordinal], _OrdinalFieldScaleFun[CHANNEL_SCALES.radius] = [SCALE_TYPES.point], _OrdinalFieldScaleFun[CHANNEL_SCALES.size] = [SCALE_TYPES.point], _OrdinalFieldScaleFun);

var OrdinalFieldAggrScaleFunctions = exports.OrdinalFieldAggrScaleFunctions = (_OrdinalFieldAggrScal = {}, _OrdinalFieldAggrScal[CHANNEL_SCALES.colorAggr] = [], _OrdinalFieldAggrScal[CHANNEL_SCALES.sizeAggr] = [], _OrdinalFieldAggrScal);

var notSupportedScaleOpts = exports.notSupportedScaleOpts = (_notSupportedScaleOpt = {}, _notSupportedScaleOpt[CHANNEL_SCALES.color] = [], _notSupportedScaleOpt[CHANNEL_SCALES.radius] = [], _notSupportedScaleOpt[CHANNEL_SCALES.size] = [], _notSupportedScaleOpt[CHANNEL_SCALES.colorAggr] = [], _notSupportedScaleOpt[CHANNEL_SCALES.sizeAggr] = [], _notSupportedScaleOpt);

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
  var _extends2;

  return (0, _extends4.default)({}, accu, (_extends2 = {}, _extends2[key] = Object.keys(FIELD_OPTS).filter(function (ft) {
    return FIELD_OPTS[ft].scale[key] && FIELD_OPTS[ft].scale[key].length;
  }), _extends2));
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
var LAYER_CLASSES = exports.LAYER_CLASSES = (_LAYER_CLASSES = {}, _LAYER_CLASSES[LAYER_TYPES.point] = 'PointLayer', _LAYER_CLASSES[LAYER_TYPES.arc] = 'ArcLayer', _LAYER_CLASSES[LAYER_TYPES.cluster] = 'ClusterLayer', _LAYER_CLASSES[LAYER_TYPES.line] = 'LineLayer', _LAYER_CLASSES[LAYER_TYPES.grid] = 'GridLayer', _LAYER_CLASSES[LAYER_TYPES.geojson] = 'GeojsonLayer', _LAYER_CLASSES[LAYER_TYPES.icon] = 'IconLayer', _LAYER_CLASSES[LAYER_TYPES.hexagon] = 'HexagonLayer', _LAYER_CLASSES[LAYER_TYPES.hexagonId] = 'H3HexagonLayer', _LAYER_CLASSES);

// user should pass in tooltip fields
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJBQ1RJT05fUFJFRklYIiwiTUFQQk9YX0FDQ0VTU19UT0tFTiIsIk1BUFpFTl9BUElfS0VZIiwiQ0xPVURGUk9OVCIsIlNUWUxFX1BSRUZJWCIsIklDT05fUFJFRklYIiwiTEFZRVJfQ09ORklHX0lEIiwiREFUQV9UQUJMRV9JRCIsIkRFTEVURV9EQVRBX0lEIiwiQUREX0RBVEFfSUQiLCJESU1FTlNJT05TIiwicWJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJzaWRlQmFyV2lkdGgiLCJzaWRlTmF2VyIsInNpZGVOYXZDIiwidG9wT2Zmc2V0Iiwic2lkZUJhclBhZGRpbmciLCJsYXllclBhbmVsUGFkZGluZyIsIm1hcExheWVyU2VsZWN0b3JIZWlnaHQiLCJtYXBDb250cm9sV2lkdGgiLCJtYXBDb250cm9sUGFkZGluZyIsIlBBTkVMUyIsImlkIiwibGFiZWwiLCJpY29uIiwiUEFORUxTX0ZPT1RFUiIsIklOSVRJQUxfU1RZTEVfVFlQRSIsIkRFRkFVTFRfQkxER19DT0xPUiIsIkRFRkFVTFRfTEFZRVJfR1JPVVBTIiwic2x1ZyIsImZpbHRlciIsIm1hdGNoIiwiZGVmYXVsdFZpc2liaWxpdHkiLCJERUZBVUxUX01BUF9TVFlMRVMiLCJ1cmwiLCJzdHlsZSIsInRvb2xzRGFyayIsImxheWVyR3JvdXBzIiwiZWRpdGFibGUiLCJHRU9KU09OX0ZJRUxEUyIsImdlb2pzb24iLCJIRVhBR09OX0lEX0ZJRUxEUyIsImhleF9pZCIsIklDT05fRklFTERTIiwiVFJJUF9QT0lOVF9GSUVMRFMiLCJUUklQX0FSQ19GSUVMRFMiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiU0NBTEVfVFlQRVMiLCJvcmRpbmFsIiwicXVhbnRpbGUiLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJwb2ludCIsIlNDQUxFX0ZVTkMiLCJyZXF1aXJlIiwic2NhbGVMaW5lYXIiLCJzY2FsZVF1YW50aXplIiwic2NhbGVRdWFudGlsZSIsInNjYWxlT3JkaW5hbCIsInNjYWxlU3FydCIsInNjYWxlUG9pbnQiLCJBTExfRklFTERfVFlQRVMiLCJib29sZWFuIiwiZGF0ZSIsImludGVnZXIiLCJyZWFsIiwic3RyaW5nIiwidGltZXN0YW1wIiwiT1JBTkdFIiwiUElOSyIsIlBVUlBMRSIsIkJMVUUiLCJCTFVFMiIsIkJMVUUzIiwiR1JFRU4iLCJSRUQiLCJGSUVMRF9DT0xPUlMiLCJkZWZhdWx0IiwiRklMRURfVFlQRV9ESVNQTEFZIiwiY29sb3IiLCJkZWZhdWx0Rm9ybWF0IiwiZCIsIkZJRUxEX0RJU1BMQVlfRk9STUFUIiwiU3RyaW5nIiwiQ0hBTk5FTF9TQ0FMRVMiLCJyYWRpdXMiLCJzaXplIiwiY29sb3JBZ2dyIiwic2l6ZUFnZ3IiLCJsaW5lYXJGaWVsZFNjYWxlRnVuY3Rpb25zIiwibGluZWFyRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnMiLCJPcmRpbmFsRmllbGRTY2FsZUZ1bmN0aW9ucyIsIk9yZGluYWxGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9ucyIsIm5vdFN1cHBvcnRlZFNjYWxlT3B0cyIsIkZJRUxEX09QVFMiLCJ0eXBlIiwic2NhbGUiLCJmb3JtYXQiLCJsZWdlbmQiLCJDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjdSIsImtleSIsImZ0IiwibGVuZ3RoIiwiTEFZRVJfVFlQRVMiLCJhcmMiLCJjbHVzdGVyIiwibGluZSIsImdyaWQiLCJoZXhhZ29uIiwiaGV4YWdvbklkIiwiTEFZRVJfQ0xBU1NFUyIsIkRFRkFVTFRfVE9PTFRJUF9GSUVMRFMiLCJERUZBVUxUX0xJR0hUX1NFVFRJTkdTIiwibGlnaHRzUG9zaXRpb24iLCJhbWJpZW50UmF0aW8iLCJkaWZmdXNlUmF0aW8iLCJzcGVjdWxhclJhdGlvIiwibGlnaHRzU3RyZW5ndGgiLCJudW1iZXJPZkxpZ2h0cyIsIk5PX1ZBTFVFX0NPTE9SIiwiTEFZRVJfQkxFTkRJTkdTIiwiYWRkaXRpdmUiLCJlbmFibGUiLCJibGVuZEZ1bmMiLCJibGVuZEVxdWF0aW9uIiwibm9ybWFsIiwiYmxlbmRGdW5jU2VwYXJhdGUiLCJibGVuZEVxdWF0aW9uU2VwYXJhdGUiLCJzdWJ0cmFjdGl2ZSIsIkFHR1JFR0FUSU9OX1RZUEVTIiwiYXZlcmFnZSIsIm1heGltdW0iLCJtaW5pbXVtIiwibWVkaWFuIiwic3VtIiwiY291bnRVbmlxdWUiLCJNQVhfREVGQVVMVF9UT09MVElQUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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L0IsRUFBNEMsV0FBNUMsQ0FGUjtBQUdYQywyQkFBdUIsQ0FBQyxlQUFELEVBQWtCLFVBQWxCO0FBSFo7QUFsQmdCLENBQXhCOztBQXlCQSxJQUFNRSxnREFBb0IseUJBQVU7QUFDekNDLFdBQVMsSUFEZ0M7QUFFekNDLFdBQVMsSUFGZ0M7QUFHekNDLFdBQVMsSUFIZ0M7QUFJekNDLFVBQVEsSUFKaUM7QUFLekNDLE9BQUssSUFMb0M7QUFNekNDLGVBQWE7QUFONEIsQ0FBVixDQUExQjs7QUFTQSxJQUFNQyxzREFBdUIsQ0FBN0IiLCJmaWxlIjoiZGVmYXVsdC1zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBrZXlNaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCB0b29sc0RhcmsgZnJvbSAnLi9tYXAtc3R5bGVzL3Rvb2xzLWRhcmsuanNvbic7XG5cbmV4cG9ydCBjb25zdCBBQ1RJT05fUFJFRklYID0gJ0BAa2VwbGVyLmdsLyc7XG5cbmV4cG9ydCBjb25zdCBNQVBCT1hfQUNDRVNTX1RPS0VOID1cbiAgJ3BrLmV5SjFJam9pZFdKbGNtUmhkR0VpTENKaElqb2lkR2xsWCcgKyAnMWd4VVNKOS5nRWxVb29ERjd1NTFndUNRUkVtQWhnJztcblxuLy8gVE9ETzogZG9uJ3QgaW5jbHVkZSBtYXB6ZW4gaW4ga2VwbGVyLmdsXG5leHBvcnQgY29uc3QgTUFQWkVOX0FQSV9LRVkgPSAndmVjdG9yLXRpbGVzLXU0eHBHN0cnO1xuXG4vLyBUT0RPOiBjbGVhbnVwIHN0eWxlcywgZG9uJ3QgbG9hZCB1YmVyIHN0eWxlXG5jb25zdCBDTE9VREZST05UID0gJ2h0dHBzOi8vZDFhM2Y0c3BhenpycDQuY2xvdWRmcm9udC5uZXQnO1xuY29uc3QgU1RZTEVfUFJFRklYID0gYCR7Q0xPVURGUk9OVH0vbWFwX3N0eWxlc2A7XG5jb25zdCBJQ09OX1BSRUZJWCA9IGAke0NMT1VERlJPTlR9L2dlb2R1ZGVgO1xuXG4vLyBNb2RhbCBJZHNcbmV4cG9ydCBjb25zdCBMQVlFUl9DT05GSUdfSUQgPSAnY29weUNvbmZpZyc7XG5leHBvcnQgY29uc3QgREFUQV9UQUJMRV9JRCA9ICdkYXRhVGFibGUnO1xuZXhwb3J0IGNvbnN0IERFTEVURV9EQVRBX0lEID0gJ2RlbGV0ZURhdGEnO1xuZXhwb3J0IGNvbnN0IEFERF9EQVRBX0lEID0gJ2FkZERhdGEnO1xuXG5leHBvcnQgY29uc3QgRElNRU5TSU9OUyA9IHtcbiAgLy8gVE9ETzogcmVtb3ZlIHVzZSB0byBxYkhlaWhndFxuICBxYkhlaWdodDogNjIsXG4gIGhlYWRlckhlaWdodDogNTUsXG5cbiAgc2lkZUJhcldpZHRoOiAzNjAsXG4gIHNpZGVOYXZXOiAxMjAsXG4gIHNpZGVOYXZDOiA0MCxcbiAgdG9wT2Zmc2V0OiAxMTcsXG4gIHNpZGVCYXJQYWRkaW5nOiAyNCxcbiAgbGF5ZXJQYW5lbFBhZGRpbmc6IDEyLFxuICBtYXBMYXllclNlbGVjdG9ySGVpZ2h0OiAyNTAsXG4gIG1hcENvbnRyb2xXaWR0aDogMjA0LFxuICBtYXBDb250cm9sUGFkZGluZzogMTJcbn07XG5cbmV4cG9ydCBjb25zdCBQQU5FTFMgPSBbXG4gIHtcbiAgICBpZDogJ2xheWVyJyxcbiAgICBsYWJlbDogJ0xheWVycycsXG4gICAgaWNvbjogJ2xheWVycydcbiAgfSxcbiAge1xuICAgIGlkOiAnZmlsdGVyJyxcbiAgICBsYWJlbDogJ0ZpbHRlcnMnLFxuICAgIGljb246ICdzZWFyY2gnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVyYWN0aW9uJyxcbiAgICBsYWJlbDogJ0ludGVyYWN0aW9ucycsXG4gICAgaWNvbjogJ2xvY2F0aW9uJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdtYXAnLFxuICAgIGxhYmVsOiAnQmFzZSBtYXAnLFxuICAgIGljb246ICdwbGFjZSdcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IFBBTkVMU19GT09URVIgPSBbXG4gIHtcbiAgICBpZDogTEFZRVJfQ09ORklHX0lELFxuICAgIGxhYmVsOiAnQ29weSBDb25maWcnLFxuICAgIGljb246ICdjbGlwYm9hcmQnXG4gIH1cbl07XG5cbi8vIE1BUCBTVFlMRVNcbmV4cG9ydCBjb25zdCBJTklUSUFMX1NUWUxFX1RZUEUgPSAnZGFyayc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CTERHX0NPTE9SID0gJyNEMUNFQzcnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQVlFUl9HUk9VUFMgPSBbXG4gIHtcbiAgICBzbHVnOiAnbGFiZWwnLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC9sYWJlbC8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzbHVnOiAncm9hZCcsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PShyb2FkfHJhaWx3YXkpKSg/IS4qbGFiZWwpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdib3JkZXInLFxuICAgIGZpbHRlcjogKHtpZH0pID0+IGlkLm1hdGNoKC9ib3JkZXIvKSxcbiAgICBkZWZhdWx0VmlzaWJpbGl0eTogZmFsc2VcbiAgfSxcbiAge1xuICAgIHNsdWc6ICdidWlsZGluZycsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goL2J1aWxkaW5nLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfSxcbiAge1xuICAgIHNsdWc6ICd3YXRlcicsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PSh3YXRlcnxzdHJlYW18ZmVycnkpKS8pLFxuICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzbHVnOiAnbGFuZCcsXG4gICAgZmlsdGVyOiAoe2lkfSkgPT4gaWQubWF0Y2goLyg/PShwYXJrcykpLyksXG4gICAgZGVmYXVsdFZpc2liaWxpdHk6IHRydWVcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFQX1NUWUxFUyA9IFtcbiAge1xuICAgIGlkOiAnZGFyaycsXG4gICAgbGFiZWw6ICdEYXJrJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vdG9vbHMtZGFyay5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9EQVJLX1YyLnBuZ2AsXG4gICAgc3R5bGU6IHRvb2xzRGFyayxcbiAgICBsYXllckdyb3VwczogREVGQVVMVF9MQVlFUl9HUk9VUFNcbiAgfSxcbiAge1xuICAgIGlkOiAnbGlnaHQnLFxuICAgIGxhYmVsOiAnTGlnaHQnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS90b29scy1saWdodC5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9MSUdIVF9WMi5wbmdgLFxuICAgIGxheWVyR3JvdXBzOiBERUZBVUxUX0xBWUVSX0dST1VQU1xuICB9LFxuICB7XG4gICAgaWQ6ICdwbGFjZXMnLFxuICAgIGxhYmVsOiAnUGxhY2VzJyxcbiAgICB1cmw6IGAke1NUWUxFX1BSRUZJWH0vZHJpdmVyLXRpY2tlci5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9EUklWRVJfVElDS0VSLnBuZ2AsXG4gICAgbGF5ZXJHcm91cHM6W1xuICAgICAgLi4uREVGQVVMVF9MQVlFUl9HUk9VUFMsXG4gICAgICB7XG4gICAgICAgIHNsdWc6ICdwbGFjZXMnLFxuICAgICAgICBmaWx0ZXI6ICh7aWR9KSA9PiBpZC5tYXRjaCgvcG9pLyksXG4gICAgICAgIGRlZmF1bHRWaXNpYmlsaXR5OiB0cnVlLFxuICAgICAgICBlZGl0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAnbXV0ZWQnLFxuICAgIGxhYmVsOiAnTXV0ZWQnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS9kcml2ZXItbXV0ZWQuanNvbmAsXG4gICAgaWNvbjogYCR7SUNPTl9QUkVGSVh9L1VCRVJfTVVURUQucG5nYCxcbiAgICBsYXllckdyb3VwczogREVGQVVMVF9MQVlFUl9HUk9VUFNcbiAgfSxcbiAge1xuICAgIGlkOiAnbXV0ZWRfbmlnaHQnLFxuICAgIGxhYmVsOiAnTXV0ZWQgTmlnaHQnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS9kcml2ZXItbmlnaHQtbXV0ZWQuanNvbmAsXG4gICAgaWNvbjogYCR7SUNPTl9QUkVGSVh9L1VCRVJfTklHSFRfTVVURUQucG5nYCxcbiAgICBsYXllckdyb3VwczogREVGQVVMVF9MQVlFUl9HUk9VUFNcbiAgfSxcbiAge1xuICAgIGlkOiAnc3RyZWV0JyxcbiAgICBsYWJlbDogJ1N0cmVldCcsXG4gICAgdXJsOiBgJHtTVFlMRV9QUkVGSVh9L3Rvb2xzLXN0cmVldC5qc29uYCxcbiAgICBpY29uOiBgJHtJQ09OX1BSRUZJWH0vVUJFUl9NQVAuanBnYFxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdHb29nbGUgU2F0ZWxsaXRlJyxcbiAgICBpZDogJ2dvb2dsZV9zYXRlbGxpdGUnLFxuICAgIHVybDogYCR7U1RZTEVfUFJFRklYfS90b29scy1nb29nbGUtc2F0ZWxsaXRlLmpzb25gLFxuICAgIGljb246IGAke0lDT05fUFJFRklYfS9HT09HTEVfU0FURUxMSVRFLmpwZ2BcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IEdFT0pTT05fRklFTERTID0ge1xuICBnZW9qc29uOiBbJ19nZW9qc29uJywgJ2FsbF9wb2ludHMnLCAnZ2VvanNvbiddXG59O1xuXG5leHBvcnQgY29uc3QgSEVYQUdPTl9JRF9GSUVMRFMgPSB7XG4gIGhleF9pZDogWydoZXhfaWQnLCAnaGV4YWdvbl9pZCddXG59O1xuXG5leHBvcnQgY29uc3QgSUNPTl9GSUVMRFMgPSB7XG4gIGljb246IFsnaWNvbiddXG59O1xuXG5leHBvcnQgY29uc3QgVFJJUF9QT0lOVF9GSUVMRFMgPSBbXG4gIFsnbGF0JywgJ2xuZyddLFxuICBbJ2xhdCcsICdsb24nXSxcbiAgWydsYXRpdHVkZScsICdsb25naXR1ZGUnXVxuXTtcblxuZXhwb3J0IGNvbnN0IFRSSVBfQVJDX0ZJRUxEUyA9IHtcbiAgbGF0MDogJ2JlZ2ludHJpcF9sYXQnLFxuICBsbmcwOiAnYmVnaW50cmlwX2xuZycsXG4gIGxhdDE6ICdkcm9wb2ZmX2xhdCcsXG4gIGxuZzE6ICdkcm9wb2ZmX2xuZydcbn07XG5cbmV4cG9ydCBjb25zdCBTQ0FMRV9UWVBFUyA9IGtleU1pcnJvcih7XG4gIG9yZGluYWw6IG51bGwsXG4gIHF1YW50aWxlOiBudWxsLFxuICBxdWFudGl6ZTogbnVsbCxcbiAgbGluZWFyOiBudWxsLFxuXG4gIC8vIGZvciByYWRpdXNcbiAgc3FydDogbnVsbCxcbiAgLy8gb3JkaW5hbCBkb21haW4gdG8gbGluZWFyIHJhbmdlXG4gIHBvaW50OiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IFNDQUxFX0ZVTkMgPSB7XG4gIGxpbmVhcjogcmVxdWlyZSgnZDMtc2NhbGUnKS5zY2FsZUxpbmVhcixcbiAgcXVhbnRpemU6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVRdWFudGl6ZSxcbiAgcXVhbnRpbGU6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVRdWFudGlsZSxcbiAgb3JkaW5hbDogcmVxdWlyZSgnZDMtc2NhbGUnKS5zY2FsZU9yZGluYWwsXG4gIHNxcnQ6IHJlcXVpcmUoJ2QzLXNjYWxlJykuc2NhbGVTcXJ0LFxuICBwb2ludDogcmVxdWlyZSgnZDMtc2NhbGUnKS5zY2FsZVBvaW50XG59O1xuXG5leHBvcnQgY29uc3QgQUxMX0ZJRUxEX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgYm9vbGVhbjogbnVsbCxcbiAgZGF0ZTogbnVsbCxcbiAgZ2VvanNvbjogbnVsbCxcbiAgaW50ZWdlcjogbnVsbCxcbiAgcmVhbDogbnVsbCxcbiAgc3RyaW5nOiBudWxsLFxuICB0aW1lc3RhbXA6IG51bGwsXG4gIHBvaW50OiBudWxsXG59KTtcblxuY29uc3QgT1JBTkdFID0gJzI0OCwgMTk0LCAyOCc7XG5jb25zdCBQSU5LID0gJzIzMSwgMTg5LCAxOTQnO1xuY29uc3QgUFVSUExFID0gJzE2MCwgMTA2LCAyMDYnO1xuY29uc3QgQkxVRSA9ICcxNDAsIDIxMCwgMjA1JztcbmNvbnN0IEJMVUUyID0gJzEwNiwgMTYwLCAyMDYnO1xuY29uc3QgQkxVRTMgPSAnMCwgMTcyLCAyMzcnO1xuY29uc3QgR1JFRU4gPSAnMTA2LCAxNjAsIDU2JztcbmNvbnN0IFJFRCA9ICcyMzcsIDg4LCAxMDYnO1xuXG5leHBvcnQgY29uc3QgRklFTERfQ09MT1JTID0ge1xuICBkZWZhdWx0OiBSRURcbn07XG5cbmV4cG9ydCBjb25zdCBGSUxFRF9UWVBFX0RJU1BMQVkgPSB7XG4gIFtBTExfRklFTERfVFlQRVMuYm9vbGVhbl06IHtcbiAgICBsYWJlbDogJ2Jvb2wnLFxuICAgIGNvbG9yOiBQSU5LXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMuZGF0ZV06IHtcbiAgICBsYWJlbDogJ2RhdGUnLFxuICAgIGNvbG9yOiBQVVJQTEVcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5nZW9qc29uXToge1xuICAgIGxhYmVsOiAnZ2VvJyxcbiAgICBjb2xvcjogQkxVRTJcbiAgfSxcbiAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXToge1xuICAgIGxhYmVsOiAnaW50JyxcbiAgICBjb2xvcjogT1JBTkdFXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMucmVhbF06IHtcbiAgICBsYWJlbDogJ2Zsb2F0JyxcbiAgICBjb2xvcjogT1JBTkdFXG4gIH0sXG4gIFtBTExfRklFTERfVFlQRVMuc3RyaW5nXToge1xuICAgIGxhYmVsOiAnc3RyaW5nJyxcbiAgICBjb2xvcjogQkxVRVxuICB9LFxuICBbQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcF06IHtcbiAgICBsYWJlbDogJ3RpbWUnLFxuICAgIGNvbG9yOiBHUkVFTlxuICB9LFxuICAvLyBmaWVsZCBwYWlyc1xuICBbQUxMX0ZJRUxEX1RZUEVTLnBvaW50XToge1xuICAgIGxhYmVsOiAncG9pbnQnLFxuICAgIGNvbG9yOiBCTFVFM1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdEZvcm1hdCA9IGQgPT4gZDtcblxuZXhwb3J0IGNvbnN0IEZJRUxEX0RJU1BMQVlfRk9STUFUID0ge1xuICBbQUxMX0ZJRUxEX1RZUEVTLnN0cmluZ106IGRlZmF1bHRGb3JtYXQsXG4gIFtBTExfRklFTERfVFlQRVMudGltZXN0YW1wXTogZGVmYXVsdEZvcm1hdCxcbiAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogZGVmYXVsdEZvcm1hdCxcbiAgW0FMTF9GSUVMRF9UWVBFUy5ib29sZWFuXTogZCA9PiBTdHJpbmcoZCksXG4gIFtBTExfRklFTERfVFlQRVMuZGF0ZV06IGRlZmF1bHRGb3JtYXQsXG4gIFtBTExfRklFTERfVFlQRVMuZ2VvanNvbl06IGRlZmF1bHRGb3JtYXRcbn07XG5cbmV4cG9ydCBjb25zdCBDSEFOTkVMX1NDQUxFUyA9IGtleU1pcnJvcih7XG4gIGNvbG9yOiBudWxsLFxuICByYWRpdXM6IG51bGwsXG4gIHNpemU6IG51bGwsXG4gIGNvbG9yQWdncjogbnVsbCxcbiAgc2l6ZUFnZ3I6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgbGluZWFyRmllbGRTY2FsZUZ1bmN0aW9ucyA9IHtcbiAgW0NIQU5ORUxfU0NBTEVTLmNvbG9yXTogW1NDQUxFX1RZUEVTLnF1YW50aXplLCBTQ0FMRV9UWVBFUy5xdWFudGlsZV0sXG4gIFtDSEFOTkVMX1NDQUxFUy5yYWRpdXNdOiBbU0NBTEVfVFlQRVMuc3FydF0sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplXTogW1NDQUxFX1RZUEVTLmxpbmVhcl1cbn07XG5cbmV4cG9ydCBjb25zdCBsaW5lYXJGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9ucyA9IHtcbiAgW0NIQU5ORUxfU0NBTEVTLmNvbG9yQWdncl06IFtTQ0FMRV9UWVBFUy5xdWFudGl6ZSwgU0NBTEVfVFlQRVMucXVhbnRpbGVdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuc2l6ZUFnZ3JdOiBbU0NBTEVfVFlQRVMubGluZWFyXVxufTtcblxuZXhwb3J0IGNvbnN0IE9yZGluYWxGaWVsZFNjYWxlRnVuY3Rpb25zID0ge1xuICBbQ0hBTk5FTF9TQ0FMRVMuY29sb3JdOiBbU0NBTEVfVFlQRVMub3JkaW5hbF0sXG4gIFtDSEFOTkVMX1NDQUxFUy5yYWRpdXNdOiBbU0NBTEVfVFlQRVMucG9pbnRdLFxuICBbQ0hBTk5FTF9TQ0FMRVMuc2l6ZV06IFtTQ0FMRV9UWVBFUy5wb2ludF1cbn07XG5cbmV4cG9ydCBjb25zdCBPcmRpbmFsRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnMgPSB7XG4gIC8vIEN1cnJlbnRseSBkb2Vzbid0IHN1cHBvcnQgeWV0XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JdOiBbXSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXTogW11cbn07XG5cbmV4cG9ydCBjb25zdCBub3RTdXBwb3J0ZWRTY2FsZU9wdHMgPSB7XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvcl06IFtdLFxuICBbQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXTogW10sXG4gIFtDSEFOTkVMX1NDQUxFUy5zaXplXTogW10sXG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JdOiBbXSxcbiAgW0NIQU5ORUxfU0NBTEVTLnNpemVBZ2dyXTogW11cbn07XG5cbi8qKlxuICogRGVmaW5lIHdoYXQgdHlwZSBvZiBzY2FsZSBvcGVyYXRpb24gaXMgYWxsb3dlZCBvbiBlYWNoIHR5cGUgb2YgZmllbGRzXG4gKi9cbmV4cG9ydCBjb25zdCBGSUVMRF9PUFRTID0ge1xuICBzdHJpbmc6IHtcbiAgICB0eXBlOiAnY2F0ZWdvcmljYWwnLFxuICAgIHNjYWxlOiB7XG4gICAgICAuLi5PcmRpbmFsRmllbGRTY2FsZUZ1bmN0aW9ucyxcbiAgICAgIC4uLk9yZGluYWxGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9uc1xuICAgIH0sXG4gICAgZm9ybWF0OiB7XG4gICAgICBsZWdlbmQ6IGQgPT4gZFxuICAgIH1cbiAgfSxcbiAgcmVhbDoge1xuICAgIHR5cGU6ICdudW1lcmljYWwnLFxuICAgIHNjYWxlOiB7XG4gICAgICAuLi5saW5lYXJGaWVsZFNjYWxlRnVuY3Rpb25zLFxuICAgICAgLi4ubGluZWFyRmllbGRBZ2dyU2NhbGVGdW5jdGlvbnNcbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+IGRcbiAgICB9XG4gIH0sXG4gIHRpbWVzdGFtcDoge1xuICAgIHR5cGU6ICd0aW1lJyxcbiAgICBzY2FsZTogbGluZWFyRmllbGRTY2FsZUZ1bmN0aW9ucyxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkXG4gICAgfVxuICB9LFxuICBpbnRlZ2VyOiB7XG4gICAgdHlwZTogJ251bWVyaWNhbCcsXG4gICAgc2NhbGU6IHtcbiAgICAgIC4uLmxpbmVhckZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgICAuLi5saW5lYXJGaWVsZEFnZ3JTY2FsZUZ1bmN0aW9uc1xuICAgIH0sXG4gICAgZm9ybWF0OiB7XG4gICAgICBsZWdlbmQ6IGQgPT4gZFxuICAgIH1cbiAgfSxcbiAgYm9vbGVhbjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBzY2FsZTogT3JkaW5hbEZpZWxkU2NhbGVGdW5jdGlvbnMsXG4gICAgZm9ybWF0OiB7XG4gICAgICBsZWdlbmQ6IGQgPT4gZFxuICAgIH1cbiAgfSxcbiAgZGF0ZToge1xuICAgIHNjYWxlOiBPcmRpbmFsRmllbGRTY2FsZUZ1bmN0aW9ucyxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIGxlZ2VuZDogZCA9PiBkXG4gICAgfVxuICB9LFxuICBnZW9qc29uOiB7XG4gICAgdHlwZTogJ2dlb21ldHJ5JyxcbiAgICBzY2FsZTogbm90U3VwcG9ydGVkU2NhbGVPcHRzLFxuICAgIGZvcm1hdDoge1xuICAgICAgbGVnZW5kOiBkID0+ICcuLi4nXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTID0gT2JqZWN0LmtleXMoQ0hBTk5FTF9TQ0FMRVMpLnJlZHVjZSgoYWNjdSwga2V5KSA9PiAoe1xuICAuLi5hY2N1LFxuICBba2V5XTogT2JqZWN0LmtleXMoRklFTERfT1BUUylcbiAgICAuZmlsdGVyKGZ0ID0+IEZJRUxEX09QVFNbZnRdLnNjYWxlW2tleV0gJiYgRklFTERfT1BUU1tmdF0uc2NhbGVba2V5XS5sZW5ndGgpXG59KSwge30pO1xuXG5leHBvcnQgY29uc3QgTEFZRVJfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBwb2ludDogbnVsbCxcbiAgYXJjOiBudWxsLFxuICBjbHVzdGVyOiBudWxsLFxuICBsaW5lOiBudWxsLFxuICBncmlkOiBudWxsLFxuICBnZW9qc29uOiBudWxsLFxuICBpY29uOiBudWxsLFxuICBoZXhhZ29uOiBudWxsLFxuICBoZXhhZ29uSWQ6IG51bGxcbn0pO1xuXG4vLyBsYXllciB0eXBlIHRvIG1hcC1nbC1sYXllcnNcbmV4cG9ydCBjb25zdCBMQVlFUl9DTEFTU0VTID0ge1xuICBbTEFZRVJfVFlQRVMucG9pbnRdOiAnUG9pbnRMYXllcicsXG4gIFtMQVlFUl9UWVBFUy5hcmNdOiAnQXJjTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuY2x1c3Rlcl06ICdDbHVzdGVyTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMubGluZV06ICdMaW5lTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuZ3JpZF06ICdHcmlkTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuZ2VvanNvbl06ICdHZW9qc29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaWNvbl06ICdJY29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaGV4YWdvbl06ICdIZXhhZ29uTGF5ZXInLFxuICBbTEFZRVJfVFlQRVMuaGV4YWdvbklkXTogJ0gzSGV4YWdvbkxheWVyJ1xufTtcblxuLy8gdXNlciBzaG91bGQgcGFzcyBpbiB0b29sdGlwIGZpZWxkc1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVE9PTFRJUF9GSUVMRFMgPSBbXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTElHSFRfU0VUVElOR1MgPSB7XG4gIGxpZ2h0c1Bvc2l0aW9uOiBbLTEyMi40NSwgMzcuNjYsIDgwMDAsIC0xMjIuMCwgMzguMCwgODAwMF0sXG4gIGFtYmllbnRSYXRpbzogMC40LFxuICBkaWZmdXNlUmF0aW86IDAuNixcbiAgc3BlY3VsYXJSYXRpbzogMC4zLFxuICBsaWdodHNTdHJlbmd0aDogWzAuOSwgMC4wLCAwLjgsIDAuMF0sXG4gIG51bWJlck9mTGlnaHRzOiAyXG59O1xuXG5leHBvcnQgY29uc3QgTk9fVkFMVUVfQ09MT1IgPSBbMTQ3LCAxNDcsIDE0N107XG5cbmV4cG9ydCBjb25zdCBMQVlFUl9CTEVORElOR1MgPSB7XG4gIGFkZGl0aXZlOiB7XG4gICAgZW5hYmxlOiB0cnVlLFxuICAgIGJsZW5kRnVuYzogWydTUkNfQUxQSEEnLCAnRFNUX0FMUEhBJ10sXG4gICAgYmxlbmRFcXVhdGlvbjogJ0ZVTkNfQUREJ1xuICB9LFxuICBub3JtYWw6IHtcbiAgICBlbmFibGU6IHRydWUsXG4gICAgLy8gcmVmZXJlbmNlIHRvXG4gICAgLy8gaHR0cHM6Ly9saW1udS5jb20vd2ViZ2wtYmxlbmRpbmcteW91cmUtcHJvYmFibHktd3JvbmcvXG4gICAgYmxlbmRGdW5jU2VwYXJhdGU6IFtcbiAgICAgICdTUkNfQUxQSEEnLFxuICAgICAgJ09ORV9NSU5VU19TUkNfQUxQSEEnLFxuICAgICAgJ09ORScsXG4gICAgICAnT05FX01JTlVTX1NSQ19BTFBIQSdcbiAgICBdLFxuICAgIGJsZW5kRXF1YXRpb25TZXBhcmF0ZTogWydGVU5DX0FERCcsICdGVU5DX0FERCddXG4gIH0sXG4gIHN1YnRyYWN0aXZlOiB7XG4gICAgZW5hYmxlOiB0cnVlLFxuICAgIGJsZW5kRnVuY1NlcGFyYXRlOiBbJ09ORScsICdPTkVfTUlOVVNfRFNUX0NPTE9SJywgJ1NSQ19BTFBIQScsICdEU1RfQUxQSEEnXSxcbiAgICBibGVuZEVxdWF0aW9uU2VwYXJhdGU6IFsnRlVOQ19TVUJUUkFDVCcsICdGVU5DX0FERCddXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBBR0dSRUdBVElPTl9UWVBFUyA9IGtleU1pcnJvcih7XG4gIGF2ZXJhZ2U6IG51bGwsXG4gIG1heGltdW06IG51bGwsXG4gIG1pbmltdW06IG51bGwsXG4gIG1lZGlhbjogbnVsbCxcbiAgc3VtOiBudWxsLFxuICBjb3VudFVuaXF1ZTogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBNQVhfREVGQVVMVF9UT09MVElQUyA9IDU7XG4iXX0=