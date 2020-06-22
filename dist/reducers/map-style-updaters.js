"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMapStyles = getMapStyles;
exports.getInitialInputStyle = getInitialInputStyle;
exports.set3dBuildingColorUpdater = exports.addCustomMapStyleUpdater = exports.inputMapStyleUpdater = exports.loadCustomMapStyleUpdater = exports.resetMapConfigMapStyleUpdater = exports.receiveMapConfigUpdater = exports.requestMapStylesUpdater = exports.loadMapStyleErrUpdater = exports.loadMapStylesUpdater = exports.mapStyleChangeUpdater = exports.mapConfigChangeUpdater = exports.initMapStyleUpdater = exports.INITIAL_MAP_STYLE = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _tasks = _interopRequireWildcard(require("react-palm/tasks"));

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

var _mapboxGlStyleEditor = require("../utils/map-style-utils/mapbox-gl-style-editor");

var _defaultSettings = require("../constants/default-settings");

var _utils = require("../utils/utils");

var _tasks2 = require("../tasks/tasks");

var _mapStyleActions = require("../actions/map-style-actions");

var _d3Color = require("d3-color");

var _colorUtils = require("../utils/color-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_BLDG_COLOR = '#D1CEC7';
/**
 * @return {import('./map-style-updaters').MapStyle}
 */

var getDefaultState = function getDefaultState() {
  var visibleLayerGroups = {};
  var styleType = 'dark';
  var topLayerGroups = {};
  return {
    styleType: styleType,
    visibleLayerGroups: visibleLayerGroups,
    topLayerGroups: topLayerGroups,
    mapStyles: _defaultSettings.DEFAULT_MAP_STYLES.reduce(function (accu, curr) {
      return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, curr.id, curr));
    }, {}),
    // save mapbox access token
    mapboxApiAccessToken: null,
    mapboxApiUrl: _defaultSettings.DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: (0, _colorUtils.hexToRgb)(DEFAULT_BLDG_COLOR),
    custom3DBuildingColor: false
  };
};
/**
 * Updaters for `mapStyle`. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {mapStyleUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to hide label from background map
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             mapStyle: mapStyleUpdaters.mapConfigChangeUpdater(
 *               mapStyle,
 *               {payload: {visibleLayerGroups: {label: false, road: true, background: true}}}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */

/* eslint-disable no-unused-vars */


var mapStyleUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `mapStyle`
 * @memberof mapStyleUpdaters
 * @constant
 * @property styleType - Default: `'dark'`
 * @property visibleLayerGroups - Default: `{}`
 * @property topLayerGroups - Default: `{}`
 * @property mapStyles - mapping from style key to style object
 * @property mapboxApiAccessToken - Default: `null`
 * @Property mapboxApiUrl - Default null
 * @Property mapStylesReplaceDefault - Default: `false`
 * @property inputStyle - Default: `{}`
 * @property threeDBuildingColor - Default: `[r, g, b]`
 * @type {import('./map-style-updaters').MapStyle}
 * @public
 */

var INITIAL_MAP_STYLE = getDefaultState();
/**
 * Create two map styles from preset map style, one for top map one for bottom
 *
 * @param {string} styleType - current map style
 * @param {Object} visibleLayerGroups - visible layers of bottom map
 * @param {Object} topLayerGroups - visible layers of top map
 * @param {Object} mapStyles - a dictionary of all map styles
 * @returns {Object} bottomMapStyle | topMapStyle | isRaster
 */

exports.INITIAL_MAP_STYLE = INITIAL_MAP_STYLE;

function getMapStyles(_ref) {
  var styleType = _ref.styleType,
      visibleLayerGroups = _ref.visibleLayerGroups,
      topLayerGroups = _ref.topLayerGroups,
      mapStyles = _ref.mapStyles;
  var mapStyle = mapStyles[styleType]; // style might not be loaded yet

  if (!mapStyle || !mapStyle.style) {
    return {};
  }

  var editable = Object.keys(visibleLayerGroups).length;
  var bottomMapStyle = !editable ? mapStyle.style : (0, _mapboxGlStyleEditor.editBottomMapStyle)({
    id: styleType,
    mapStyle: mapStyle,
    visibleLayerGroups: visibleLayerGroups
  });
  var hasTopLayer = editable && Object.values(topLayerGroups).some(function (v) {
    return v;
  }); // mute top layer if not visible in bottom layer

  var topLayers = hasTopLayer && Object.keys(topLayerGroups).reduce(function (accu, key) {
    return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, topLayerGroups[key] && visibleLayerGroups[key]));
  }, {});
  var topMapStyle = hasTopLayer ? (0, _mapboxGlStyleEditor.editTopMapStyle)({
    id: styleType,
    mapStyle: mapStyle,
    visibleLayerGroups: topLayers
  }) : null;
  return {
    bottomMapStyle: bottomMapStyle,
    topMapStyle: topMapStyle,
    editable: editable
  };
}

function findLayerFillColor(layer) {
  return layer && layer.paint && layer.paint['background-color'];
}

function get3DBuildingColor(style) {
  // set building color to be the same as the background color.
  if (!style.style) {
    return (0, _colorUtils.hexToRgb)(DEFAULT_BLDG_COLOR);
  }

  var backgroundLayer = (style.style.layers || []).find(function (_ref2) {
    var id = _ref2.id;
    return id === 'background';
  });
  var buildingLayer = (style.style.layers || []).find(function (_ref3) {
    var id = _ref3.id;
    return id.match(/building/);
  });
  var buildingColor = findLayerFillColor(buildingLayer) || findLayerFillColor(backgroundLayer) || DEFAULT_BLDG_COLOR; // brighten or darken building based on style

  var operation = style.id.match(/(?=(dark|night))/) ? 'brighter' : 'darker';
  var alpha = 0.2;
  var rgbObj = (0, _d3Color.rgb)(buildingColor)[operation]([alpha]);
  return [rgbObj.r, rgbObj.g, rgbObj.b];
}

function getLayerGroupsFromStyle(style) {
  return Array.isArray(style.layers) ? _defaultSettings.DEFAULT_LAYER_GROUPS.filter(function (lg) {
    return style.layers.filter(lg.filter).length;
  }) : [];
} // Updaters

/**
 * Propagate `mapStyle` reducer with `mapboxApiAccessToken` and `mapStylesReplaceDefault`.
 * if mapStylesReplaceDefault is true mapStyles is emptied; loadMapStylesUpdater() will
 * populate mapStyles.
 *
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').initMapStyleUpdater}
 * @public
 */


var initMapStyleUpdater = function initMapStyleUpdater(state, action) {
  return _objectSpread({}, state, {
    // save mapbox access token to map style state
    mapboxApiAccessToken: (action.payload || {}).mapboxApiAccessToken,
    mapboxApiUrl: (action.payload || {}).mapboxApiUrl || state.mapboxApiUrl,
    mapStyles: action.payload && !action.payload.mapStylesReplaceDefault ? state.mapStyles : {},
    mapStylesReplaceDefault: action.payload.mapStylesReplaceDefault || false
  });
}; // });

/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').mapConfigChangeUpdater}
 * @public
 */


exports.initMapStyleUpdater = initMapStyleUpdater;

var mapConfigChangeUpdater = function mapConfigChangeUpdater(state, action) {
  return _objectSpread({}, state, {}, action.payload, {}, getMapStyles(_objectSpread({}, state, {}, action.payload)));
};
/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').mapStyleChangeUpdater}
 * @public
 */


exports.mapConfigChangeUpdater = mapConfigChangeUpdater;

var mapStyleChangeUpdater = function mapStyleChangeUpdater(state, _ref4) {
  var styleType = _ref4.payload;

  if (!state.mapStyles[styleType]) {
    // we might not have received the style yet
    return state;
  }

  var defaultLGVisibility = (0, _mapboxGlStyleEditor.getDefaultLayerGroupVisibility)(state.mapStyles[styleType]);
  var visibleLayerGroups = (0, _mapboxGlStyleEditor.mergeLayerGroupVisibility)(defaultLGVisibility, state.visibleLayerGroups);
  var threeDBuildingColor = state.custom3DBuildingColor ? state.threeDBuildingColor : get3DBuildingColor(state.mapStyles[styleType]);
  return _objectSpread({}, state, {
    styleType: styleType,
    visibleLayerGroups: visibleLayerGroups,
    threeDBuildingColor: threeDBuildingColor
  }, getMapStyles(_objectSpread({}, state, {
    visibleLayerGroups: visibleLayerGroups,
    styleType: styleType
  })));
};
/**
 * Callback when load map style success
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').loadMapStylesUpdater}
 * @public
 */


exports.mapStyleChangeUpdater = mapStyleChangeUpdater;

var loadMapStylesUpdater = function loadMapStylesUpdater(state, action) {
  var newStyles = action.payload || {};
  var addLayerGroups = Object.keys(newStyles).reduce(function (accu, id) {
    return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, id, _objectSpread({}, newStyles[id], {
      layerGroups: newStyles[id].layerGroups || getLayerGroupsFromStyle(newStyles[id].style)
    })));
  }, {}); // add new styles to state

  var newState = _objectSpread({}, state, {
    mapStyles: _objectSpread({}, state.mapStyles, {}, addLayerGroups)
  });

  return newStyles[state.styleType] ? mapStyleChangeUpdater(newState, {
    payload: state.styleType
  }) : newState;
};
/**
 * Callback when load map style error
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').loadMapStyleErrUpdater}
 * @public
 */
// do nothing for now, if didn't load, skip it


exports.loadMapStylesUpdater = loadMapStylesUpdater;

var loadMapStyleErrUpdater = function loadMapStyleErrUpdater(state) {
  return state;
};
/**
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').requestMapStylesUpdater}
 * @public
 */


exports.loadMapStyleErrUpdater = loadMapStyleErrUpdater;

var requestMapStylesUpdater = function requestMapStylesUpdater(state, _ref5) {
  var mapStyles = _ref5.payload;
  var loadMapStyleTasks = getLoadMapStyleTasks(mapStyles, state.mapboxApiAccessToken, state.mapboxApiUrl);
  return (0, _tasks.withTask)(state, loadMapStyleTasks);
};
/**
 * Load map style object when pass in saved map config
 * @memberof mapStyleUpdaters
 * @param state `mapStyle`
 * @param action
 * @param action.payload saved map config `{mapStyle, visState, mapState}`
 * @returns nextState or `react-pam` tasks to load map style object
 * @type {typeof import('./map-style-updaters').receiveMapConfigUpdater}
 */


exports.requestMapStylesUpdater = requestMapStylesUpdater;

var receiveMapConfigUpdater = function receiveMapConfigUpdater(state, _ref6) {
  var _ref6$payload$config = _ref6.payload.config,
      config = _ref6$payload$config === void 0 ? {} : _ref6$payload$config;

  var _ref7 = config || {},
      mapStyle = _ref7.mapStyle;

  if (!mapStyle) {
    return state;
  } // if saved custom mapStyles load the style object


  var loadMapStyleTasks = mapStyle.mapStyles ? getLoadMapStyleTasks(mapStyle.mapStyles, state.mapboxApiAccessToken, state.mapboxApiUrl) : null; // merge default mapStyles

  var merged = mapStyle.mapStyles ? _objectSpread({}, mapStyle, {
    mapStyles: _objectSpread({}, mapStyle.mapStyles, {}, state.mapStyles)
  }) : mapStyle; // set custom3DBuildingColor: true if mapStyle contains threeDBuildingColor

  merged.custom3DBuildingColor = Boolean(mapStyle.threeDBuildingColor) || merged.custom3DBuildingColor;
  var newState = mapConfigChangeUpdater(state, {
    payload: merged
  });
  return loadMapStyleTasks ? (0, _tasks.withTask)(newState, loadMapStyleTasks) : newState;
};

exports.receiveMapConfigUpdater = receiveMapConfigUpdater;

function getLoadMapStyleTasks(mapStyles, mapboxApiAccessToken, mapboxApiUrl) {
  return [_tasks["default"].all(Object.values(mapStyles).map(function (_ref8) {
    var id = _ref8.id,
        url = _ref8.url,
        accessToken = _ref8.accessToken;
    return {
      id: id,
      url: (0, _mapboxGlStyleEditor.isValidStyleUrl)(url) ? (0, _mapboxGlStyleEditor.getStyleDownloadUrl)(url, accessToken || mapboxApiAccessToken, mapboxApiUrl) : url
    };
  }).map(_tasks2.LOAD_MAP_STYLE_TASK)).bimap( // success
  function (results) {
    return (0, _mapStyleActions.loadMapStyles)(results.reduce(function (accu, _ref9) {
      var id = _ref9.id,
          style = _ref9.style;
      return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, id, _objectSpread({}, mapStyles[id], {
        style: style
      })));
    }, {}));
  }, // error
  _mapStyleActions.loadMapStyleErr)];
}
/**
 * Reset map style config to initial state
 * @memberof mapStyleUpdaters
 * @param state `mapStyle`
 * @returns nextState
 * @type {typeof import('./map-style-updaters').resetMapConfigMapStyleUpdater}
 * @public
 */


var resetMapConfigMapStyleUpdater = function resetMapConfigMapStyleUpdater(state) {
  var emptyConfig = _objectSpread({}, INITIAL_MAP_STYLE, {
    mapboxApiAccessToken: state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl,
    mapStylesReplaceDefault: state.mapStylesReplaceDefault
  }, state.initialState, {
    mapStyles: state.mapStyles,
    initialState: state.initialState
  });

  return mapStyleChangeUpdater(emptyConfig, {
    payload: emptyConfig.styleType
  });
};
/**
 * Callback when a custom map style object is received
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').loadCustomMapStyleUpdater}
 * @public
 */


exports.resetMapConfigMapStyleUpdater = resetMapConfigMapStyleUpdater;

var loadCustomMapStyleUpdater = function loadCustomMapStyleUpdater(state, _ref10) {
  var _ref10$payload = _ref10.payload,
      icon = _ref10$payload.icon,
      style = _ref10$payload.style,
      error = _ref10$payload.error;
  return _objectSpread({}, state, {
    inputStyle: _objectSpread({}, state.inputStyle, {}, style ? {
      id: style.id || (0, _utils.generateHashId)(),
      // make a copy of the style object
      style: (0, _lodash["default"])(style),
      label: style.name,
      // gathering layer group info from style json
      layerGroups: getLayerGroupsFromStyle(style)
    } : {}, {}, icon ? {
      icon: icon
    } : {}, {}, error !== undefined ? {
      error: error
    } : {})
  });
};
/**
 * Input a custom map style object
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').inputMapStyleUpdater}
 * @public
 */


exports.loadCustomMapStyleUpdater = loadCustomMapStyleUpdater;

var inputMapStyleUpdater = function inputMapStyleUpdater(state, _ref11) {
  var _ref11$payload = _ref11.payload,
      inputStyle = _ref11$payload.inputStyle,
      mapState = _ref11$payload.mapState;

  var updated = _objectSpread({}, state.inputStyle, {}, inputStyle);

  var isValid = (0, _mapboxGlStyleEditor.isValidStyleUrl)(updated.url);
  var icon = isValid ? (0, _mapboxGlStyleEditor.getStyleImageIcon)({
    mapState: mapState,
    styleUrl: updated.url,
    mapboxApiAccessToken: updated.accessToken || state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl || _defaultSettings.DEFAULT_MAPBOX_API_URL
  }) : state.inputStyle.icon;
  return _objectSpread({}, state, {
    inputStyle: _objectSpread({}, updated, {
      isValid: isValid,
      icon: icon
    })
  });
};
/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').addCustomMapStyleUpdater}
 */


exports.inputMapStyleUpdater = inputMapStyleUpdater;

var addCustomMapStyleUpdater = function addCustomMapStyleUpdater(state) {
  var styleId = state.inputStyle.id;

  var newState = _objectSpread({}, state, {
    mapStyles: _objectSpread({}, state.mapStyles, (0, _defineProperty2["default"])({}, styleId, state.inputStyle)),
    // set to default
    inputStyle: getInitialInputStyle()
  }); // set new style


  return mapStyleChangeUpdater(newState, {
    payload: styleId
  });
};
/**
 * Updates 3d building color
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').set3dBuildingColorUpdater}
 */


exports.addCustomMapStyleUpdater = addCustomMapStyleUpdater;

var set3dBuildingColorUpdater = function set3dBuildingColorUpdater(state, _ref12) {
  var color = _ref12.payload;
  return _objectSpread({}, state, {
    threeDBuildingColor: color,
    custom3DBuildingColor: true
  });
};
/**
 * Return the initial input style
 * @return Object
 */


exports.set3dBuildingColorUpdater = set3dBuildingColorUpdater;

function getInitialInputStyle() {
  return {
    accessToken: null,
    error: false,
    isValid: false,
    label: null,
    style: null,
    url: null,
    icon: null,
    custom: true
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9tYXAtc3R5bGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsiREVGQVVMVF9CTERHX0NPTE9SIiwiZ2V0RGVmYXVsdFN0YXRlIiwidmlzaWJsZUxheWVyR3JvdXBzIiwic3R5bGVUeXBlIiwidG9wTGF5ZXJHcm91cHMiLCJtYXBTdHlsZXMiLCJERUZBVUxUX01BUF9TVFlMRVMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImlkIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJtYXBib3hBcGlVcmwiLCJERUZBVUxUX01BUEJPWF9BUElfVVJMIiwibWFwU3R5bGVzUmVwbGFjZURlZmF1bHQiLCJpbnB1dFN0eWxlIiwiZ2V0SW5pdGlhbElucHV0U3R5bGUiLCJ0aHJlZURCdWlsZGluZ0NvbG9yIiwiY3VzdG9tM0RCdWlsZGluZ0NvbG9yIiwibWFwU3R5bGVVcGRhdGVycyIsIklOSVRJQUxfTUFQX1NUWUxFIiwiZ2V0TWFwU3R5bGVzIiwibWFwU3R5bGUiLCJzdHlsZSIsImVkaXRhYmxlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImJvdHRvbU1hcFN0eWxlIiwiaGFzVG9wTGF5ZXIiLCJ2YWx1ZXMiLCJzb21lIiwidiIsInRvcExheWVycyIsImtleSIsInRvcE1hcFN0eWxlIiwiZmluZExheWVyRmlsbENvbG9yIiwibGF5ZXIiLCJwYWludCIsImdldDNEQnVpbGRpbmdDb2xvciIsImJhY2tncm91bmRMYXllciIsImxheWVycyIsImZpbmQiLCJidWlsZGluZ0xheWVyIiwibWF0Y2giLCJidWlsZGluZ0NvbG9yIiwib3BlcmF0aW9uIiwiYWxwaGEiLCJyZ2JPYmoiLCJyIiwiZyIsImIiLCJnZXRMYXllckdyb3Vwc0Zyb21TdHlsZSIsIkFycmF5IiwiaXNBcnJheSIsIkRFRkFVTFRfTEFZRVJfR1JPVVBTIiwiZmlsdGVyIiwibGciLCJpbml0TWFwU3R5bGVVcGRhdGVyIiwic3RhdGUiLCJhY3Rpb24iLCJwYXlsb2FkIiwibWFwQ29uZmlnQ2hhbmdlVXBkYXRlciIsIm1hcFN0eWxlQ2hhbmdlVXBkYXRlciIsImRlZmF1bHRMR1Zpc2liaWxpdHkiLCJsb2FkTWFwU3R5bGVzVXBkYXRlciIsIm5ld1N0eWxlcyIsImFkZExheWVyR3JvdXBzIiwibGF5ZXJHcm91cHMiLCJuZXdTdGF0ZSIsImxvYWRNYXBTdHlsZUVyclVwZGF0ZXIiLCJyZXF1ZXN0TWFwU3R5bGVzVXBkYXRlciIsImxvYWRNYXBTdHlsZVRhc2tzIiwiZ2V0TG9hZE1hcFN0eWxlVGFza3MiLCJyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciIsImNvbmZpZyIsIm1lcmdlZCIsIkJvb2xlYW4iLCJUYXNrIiwiYWxsIiwibWFwIiwidXJsIiwiYWNjZXNzVG9rZW4iLCJMT0FEX01BUF9TVFlMRV9UQVNLIiwiYmltYXAiLCJyZXN1bHRzIiwibG9hZE1hcFN0eWxlRXJyIiwicmVzZXRNYXBDb25maWdNYXBTdHlsZVVwZGF0ZXIiLCJlbXB0eUNvbmZpZyIsImluaXRpYWxTdGF0ZSIsImxvYWRDdXN0b21NYXBTdHlsZVVwZGF0ZXIiLCJpY29uIiwiZXJyb3IiLCJsYWJlbCIsIm5hbWUiLCJ1bmRlZmluZWQiLCJpbnB1dE1hcFN0eWxlVXBkYXRlciIsIm1hcFN0YXRlIiwidXBkYXRlZCIsImlzVmFsaWQiLCJzdHlsZVVybCIsImFkZEN1c3RvbU1hcFN0eWxlVXBkYXRlciIsInN0eWxlSWQiLCJzZXQzZEJ1aWxkaW5nQ29sb3JVcGRhdGVyIiwiY29sb3IiLCJjdXN0b20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTs7QUFDQTs7QUFHQTs7QUFTQTs7QUFLQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsU0FBM0I7QUFFQTs7OztBQUdBLElBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsR0FBTTtBQUM1QixNQUFNQyxrQkFBa0IsR0FBRyxFQUEzQjtBQUNBLE1BQU1DLFNBQVMsR0FBRyxNQUFsQjtBQUNBLE1BQU1DLGNBQWMsR0FBRyxFQUF2QjtBQUVBLFNBQU87QUFDTEQsSUFBQUEsU0FBUyxFQUFUQSxTQURLO0FBRUxELElBQUFBLGtCQUFrQixFQUFsQkEsa0JBRks7QUFHTEUsSUFBQUEsY0FBYyxFQUFkQSxjQUhLO0FBSUxDLElBQUFBLFNBQVMsRUFBRUMsb0NBQW1CQyxNQUFuQixDQUNULFVBQUNDLElBQUQsRUFBT0MsSUFBUDtBQUFBLCtCQUNLRCxJQURMLHVDQUVHQyxJQUFJLENBQUNDLEVBRlIsRUFFYUQsSUFGYjtBQUFBLEtBRFMsRUFLVCxFQUxTLENBSk47QUFXTDtBQUNBRSxJQUFBQSxvQkFBb0IsRUFBRSxJQVpqQjtBQWFMQyxJQUFBQSxZQUFZLEVBQUVDLHVDQWJUO0FBY0xDLElBQUFBLHVCQUF1QixFQUFFLEtBZHBCO0FBZUxDLElBQUFBLFVBQVUsRUFBRUMsb0JBQW9CLEVBZjNCO0FBZ0JMQyxJQUFBQSxtQkFBbUIsRUFBRSwwQkFBU2pCLGtCQUFULENBaEJoQjtBQWlCTGtCLElBQUFBLHFCQUFxQixFQUFFO0FBakJsQixHQUFQO0FBbUJELENBeEJEO0FBMEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NBOzs7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxJQUF6QjtBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWdCTyxJQUFNQyxpQkFBaUIsR0FBR25CLGVBQWUsRUFBekM7QUFFUDs7Ozs7Ozs7Ozs7O0FBU08sU0FBU29CLFlBQVQsT0FBa0Y7QUFBQSxNQUEzRGxCLFNBQTJELFFBQTNEQSxTQUEyRDtBQUFBLE1BQWhERCxrQkFBZ0QsUUFBaERBLGtCQUFnRDtBQUFBLE1BQTVCRSxjQUE0QixRQUE1QkEsY0FBNEI7QUFBQSxNQUFaQyxTQUFZLFFBQVpBLFNBQVk7QUFDdkYsTUFBTWlCLFFBQVEsR0FBR2pCLFNBQVMsQ0FBQ0YsU0FBRCxDQUExQixDQUR1RixDQUd2Rjs7QUFDQSxNQUFJLENBQUNtQixRQUFELElBQWEsQ0FBQ0EsUUFBUSxDQUFDQyxLQUEzQixFQUFrQztBQUNoQyxXQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFNQyxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZeEIsa0JBQVosRUFBZ0N5QixNQUFqRDtBQUVBLE1BQU1DLGNBQWMsR0FBRyxDQUFDSixRQUFELEdBQ25CRixRQUFRLENBQUNDLEtBRFUsR0FFbkIsNkNBQW1CO0FBQ2pCYixJQUFBQSxFQUFFLEVBQUVQLFNBRGE7QUFFakJtQixJQUFBQSxRQUFRLEVBQVJBLFFBRmlCO0FBR2pCcEIsSUFBQUEsa0JBQWtCLEVBQWxCQTtBQUhpQixHQUFuQixDQUZKO0FBUUEsTUFBTTJCLFdBQVcsR0FBR0wsUUFBUSxJQUFJQyxNQUFNLENBQUNLLE1BQVAsQ0FBYzFCLGNBQWQsRUFBOEIyQixJQUE5QixDQUFtQyxVQUFBQyxDQUFDO0FBQUEsV0FBSUEsQ0FBSjtBQUFBLEdBQXBDLENBQWhDLENBbEJ1RixDQW9CdkY7O0FBQ0EsTUFBTUMsU0FBUyxHQUNiSixXQUFXLElBQ1hKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZdEIsY0FBWixFQUE0QkcsTUFBNUIsQ0FDRSxVQUFDQyxJQUFELEVBQU8wQixHQUFQO0FBQUEsNkJBQ0sxQixJQURMLHVDQUVHMEIsR0FGSCxFQUVTOUIsY0FBYyxDQUFDOEIsR0FBRCxDQUFkLElBQXVCaEMsa0JBQWtCLENBQUNnQyxHQUFELENBRmxEO0FBQUEsR0FERixFQUtFLEVBTEYsQ0FGRjtBQVVBLE1BQU1DLFdBQVcsR0FBR04sV0FBVyxHQUMzQiwwQ0FBZ0I7QUFDZG5CLElBQUFBLEVBQUUsRUFBRVAsU0FEVTtBQUVkbUIsSUFBQUEsUUFBUSxFQUFSQSxRQUZjO0FBR2RwQixJQUFBQSxrQkFBa0IsRUFBRStCO0FBSE4sR0FBaEIsQ0FEMkIsR0FNM0IsSUFOSjtBQVFBLFNBQU87QUFBQ0wsSUFBQUEsY0FBYyxFQUFkQSxjQUFEO0FBQWlCTyxJQUFBQSxXQUFXLEVBQVhBLFdBQWpCO0FBQThCWCxJQUFBQSxRQUFRLEVBQVJBO0FBQTlCLEdBQVA7QUFDRDs7QUFFRCxTQUFTWSxrQkFBVCxDQUE0QkMsS0FBNUIsRUFBbUM7QUFDakMsU0FBT0EsS0FBSyxJQUFJQSxLQUFLLENBQUNDLEtBQWYsSUFBd0JELEtBQUssQ0FBQ0MsS0FBTixDQUFZLGtCQUFaLENBQS9CO0FBQ0Q7O0FBRUQsU0FBU0Msa0JBQVQsQ0FBNEJoQixLQUE1QixFQUFtQztBQUNqQztBQUNBLE1BQUksQ0FBQ0EsS0FBSyxDQUFDQSxLQUFYLEVBQWtCO0FBQ2hCLFdBQU8sMEJBQVN2QixrQkFBVCxDQUFQO0FBQ0Q7O0FBRUQsTUFBTXdDLGVBQWUsR0FBRyxDQUFDakIsS0FBSyxDQUFDQSxLQUFOLENBQVlrQixNQUFaLElBQXNCLEVBQXZCLEVBQTJCQyxJQUEzQixDQUFnQztBQUFBLFFBQUVoQyxFQUFGLFNBQUVBLEVBQUY7QUFBQSxXQUFVQSxFQUFFLEtBQUssWUFBakI7QUFBQSxHQUFoQyxDQUF4QjtBQUVBLE1BQU1pQyxhQUFhLEdBQUcsQ0FBQ3BCLEtBQUssQ0FBQ0EsS0FBTixDQUFZa0IsTUFBWixJQUFzQixFQUF2QixFQUEyQkMsSUFBM0IsQ0FBZ0M7QUFBQSxRQUFFaEMsRUFBRixTQUFFQSxFQUFGO0FBQUEsV0FBVUEsRUFBRSxDQUFDa0MsS0FBSCxDQUFTLFVBQVQsQ0FBVjtBQUFBLEdBQWhDLENBQXRCO0FBRUEsTUFBTUMsYUFBYSxHQUNqQlQsa0JBQWtCLENBQUNPLGFBQUQsQ0FBbEIsSUFBcUNQLGtCQUFrQixDQUFDSSxlQUFELENBQXZELElBQTRFeEMsa0JBRDlFLENBVmlDLENBYWpDOztBQUNBLE1BQU04QyxTQUFTLEdBQUd2QixLQUFLLENBQUNiLEVBQU4sQ0FBU2tDLEtBQVQsQ0FBZSxrQkFBZixJQUFxQyxVQUFyQyxHQUFrRCxRQUFwRTtBQUVBLE1BQU1HLEtBQUssR0FBRyxHQUFkO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLGtCQUFJSCxhQUFKLEVBQW1CQyxTQUFuQixFQUE4QixDQUFDQyxLQUFELENBQTlCLENBQWY7QUFDQSxTQUFPLENBQUNDLE1BQU0sQ0FBQ0MsQ0FBUixFQUFXRCxNQUFNLENBQUNFLENBQWxCLEVBQXFCRixNQUFNLENBQUNHLENBQTVCLENBQVA7QUFDRDs7QUFFRCxTQUFTQyx1QkFBVCxDQUFpQzdCLEtBQWpDLEVBQXdDO0FBQ3RDLFNBQU84QixLQUFLLENBQUNDLE9BQU4sQ0FBYy9CLEtBQUssQ0FBQ2tCLE1BQXBCLElBQ0hjLHNDQUFxQkMsTUFBckIsQ0FBNEIsVUFBQUMsRUFBRTtBQUFBLFdBQUlsQyxLQUFLLENBQUNrQixNQUFOLENBQWFlLE1BQWIsQ0FBb0JDLEVBQUUsQ0FBQ0QsTUFBdkIsRUFBK0I3QixNQUFuQztBQUFBLEdBQTlCLENBREcsR0FFSCxFQUZKO0FBR0QsQyxDQUVEOztBQUNBOzs7Ozs7Ozs7OztBQVNPLElBQU0rQixtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLENBQUNDLEtBQUQsRUFBUUMsTUFBUjtBQUFBLDJCQUM5QkQsS0FEOEI7QUFFakM7QUFDQWhELElBQUFBLG9CQUFvQixFQUFFLENBQUNpRCxNQUFNLENBQUNDLE9BQVAsSUFBa0IsRUFBbkIsRUFBdUJsRCxvQkFIWjtBQUlqQ0MsSUFBQUEsWUFBWSxFQUFFLENBQUNnRCxNQUFNLENBQUNDLE9BQVAsSUFBa0IsRUFBbkIsRUFBdUJqRCxZQUF2QixJQUF1QytDLEtBQUssQ0FBQy9DLFlBSjFCO0FBS2pDUCxJQUFBQSxTQUFTLEVBQUV1RCxNQUFNLENBQUNDLE9BQVAsSUFBa0IsQ0FBQ0QsTUFBTSxDQUFDQyxPQUFQLENBQWUvQyx1QkFBbEMsR0FBNEQ2QyxLQUFLLENBQUN0RCxTQUFsRSxHQUE4RSxFQUx4RDtBQU1qQ1MsSUFBQUEsdUJBQXVCLEVBQUU4QyxNQUFNLENBQUNDLE9BQVAsQ0FBZS9DLHVCQUFmLElBQTBDO0FBTmxDO0FBQUEsQ0FBNUIsQyxDQVFQOztBQUVBOzs7Ozs7Ozs7O0FBTU8sSUFBTWdELHNCQUFzQixHQUFHLFNBQXpCQSxzQkFBeUIsQ0FBQ0gsS0FBRCxFQUFRQyxNQUFSO0FBQUEsMkJBQ2pDRCxLQURpQyxNQUVqQ0MsTUFBTSxDQUFDQyxPQUYwQixNQUdqQ3hDLFlBQVksbUJBQ1ZzQyxLQURVLE1BRVZDLE1BQU0sQ0FBQ0MsT0FGRyxFQUhxQjtBQUFBLENBQS9CO0FBU1A7Ozs7Ozs7Ozs7QUFNTyxJQUFNRSxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUNKLEtBQUQsU0FBaUM7QUFBQSxNQUFmeEQsU0FBZSxTQUF4QjBELE9BQXdCOztBQUNwRSxNQUFJLENBQUNGLEtBQUssQ0FBQ3RELFNBQU4sQ0FBZ0JGLFNBQWhCLENBQUwsRUFBaUM7QUFDL0I7QUFDQSxXQUFPd0QsS0FBUDtBQUNEOztBQUNELE1BQU1LLG1CQUFtQixHQUFHLHlEQUErQkwsS0FBSyxDQUFDdEQsU0FBTixDQUFnQkYsU0FBaEIsQ0FBL0IsQ0FBNUI7QUFFQSxNQUFNRCxrQkFBa0IsR0FBRyxvREFDekI4RCxtQkFEeUIsRUFFekJMLEtBQUssQ0FBQ3pELGtCQUZtQixDQUEzQjtBQUtBLE1BQU1lLG1CQUFtQixHQUFHMEMsS0FBSyxDQUFDekMscUJBQU4sR0FDeEJ5QyxLQUFLLENBQUMxQyxtQkFEa0IsR0FFeEJzQixrQkFBa0IsQ0FBQ29CLEtBQUssQ0FBQ3RELFNBQU4sQ0FBZ0JGLFNBQWhCLENBQUQsQ0FGdEI7QUFJQSwyQkFDS3dELEtBREw7QUFFRXhELElBQUFBLFNBQVMsRUFBVEEsU0FGRjtBQUdFRCxJQUFBQSxrQkFBa0IsRUFBbEJBLGtCQUhGO0FBSUVlLElBQUFBLG1CQUFtQixFQUFuQkE7QUFKRixLQUtLSSxZQUFZLG1CQUNWc0MsS0FEVTtBQUViekQsSUFBQUEsa0JBQWtCLEVBQWxCQSxrQkFGYTtBQUdiQyxJQUFBQSxTQUFTLEVBQVRBO0FBSGEsS0FMakI7QUFXRCxDQTNCTTtBQTZCUDs7Ozs7Ozs7OztBQU1PLElBQU04RCxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLENBQUNOLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUNyRCxNQUFNTSxTQUFTLEdBQUdOLE1BQU0sQ0FBQ0MsT0FBUCxJQUFrQixFQUFwQztBQUNBLE1BQU1NLGNBQWMsR0FBRzFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZd0MsU0FBWixFQUF1QjNELE1BQXZCLENBQ3JCLFVBQUNDLElBQUQsRUFBT0UsRUFBUDtBQUFBLDZCQUNLRixJQURMLHVDQUVHRSxFQUZILG9CQUdPd0QsU0FBUyxDQUFDeEQsRUFBRCxDQUhoQjtBQUlJMEQsTUFBQUEsV0FBVyxFQUFFRixTQUFTLENBQUN4RCxFQUFELENBQVQsQ0FBYzBELFdBQWQsSUFBNkJoQix1QkFBdUIsQ0FBQ2MsU0FBUyxDQUFDeEQsRUFBRCxDQUFULENBQWNhLEtBQWY7QUFKckU7QUFBQSxHQURxQixFQVFyQixFQVJxQixDQUF2QixDQUZxRCxDQWFyRDs7QUFDQSxNQUFNOEMsUUFBUSxxQkFDVFYsS0FEUztBQUVadEQsSUFBQUEsU0FBUyxvQkFDSnNELEtBQUssQ0FBQ3RELFNBREYsTUFFSjhELGNBRkk7QUFGRyxJQUFkOztBQVFBLFNBQU9ELFNBQVMsQ0FBQ1AsS0FBSyxDQUFDeEQsU0FBUCxDQUFULEdBQ0g0RCxxQkFBcUIsQ0FBQ00sUUFBRCxFQUFXO0FBQUNSLElBQUFBLE9BQU8sRUFBRUYsS0FBSyxDQUFDeEQ7QUFBaEIsR0FBWCxDQURsQixHQUVIa0UsUUFGSjtBQUdELENBekJNO0FBMkJQOzs7Ozs7QUFNQTs7Ozs7QUFDTyxJQUFNQyxzQkFBc0IsR0FBRyxTQUF6QkEsc0JBQXlCLENBQUFYLEtBQUs7QUFBQSxTQUFJQSxLQUFKO0FBQUEsQ0FBcEM7QUFFUDs7Ozs7Ozs7O0FBS08sSUFBTVksdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixDQUFDWixLQUFELFNBQWlDO0FBQUEsTUFBZnRELFNBQWUsU0FBeEJ3RCxPQUF3QjtBQUN0RSxNQUFNVyxpQkFBaUIsR0FBR0Msb0JBQW9CLENBQzVDcEUsU0FENEMsRUFFNUNzRCxLQUFLLENBQUNoRCxvQkFGc0MsRUFHNUNnRCxLQUFLLENBQUMvQyxZQUhzQyxDQUE5QztBQUtBLFNBQU8scUJBQVMrQyxLQUFULEVBQWdCYSxpQkFBaEIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7Ozs7OztBQVNPLElBQU1FLHVCQUF1QixHQUFHLFNBQTFCQSx1QkFBMEIsQ0FBQ2YsS0FBRCxTQUFxQztBQUFBLG1DQUE1QkUsT0FBNEIsQ0FBbEJjLE1BQWtCO0FBQUEsTUFBbEJBLE1BQWtCLHFDQUFULEVBQVM7O0FBQUEsY0FDdkRBLE1BQU0sSUFBSSxFQUQ2QztBQUFBLE1BQ25FckQsUUFEbUUsU0FDbkVBLFFBRG1FOztBQUcxRSxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLFdBQU9xQyxLQUFQO0FBQ0QsR0FMeUUsQ0FPMUU7OztBQUNBLE1BQU1hLGlCQUFpQixHQUFHbEQsUUFBUSxDQUFDakIsU0FBVCxHQUN0Qm9FLG9CQUFvQixDQUFDbkQsUUFBUSxDQUFDakIsU0FBVixFQUFxQnNELEtBQUssQ0FBQ2hELG9CQUEzQixFQUFpRGdELEtBQUssQ0FBQy9DLFlBQXZELENBREUsR0FFdEIsSUFGSixDQVIwRSxDQVkxRTs7QUFDQSxNQUFNZ0UsTUFBTSxHQUFHdEQsUUFBUSxDQUFDakIsU0FBVCxxQkFFTmlCLFFBRk07QUFHVGpCLElBQUFBLFNBQVMsb0JBQ0ppQixRQUFRLENBQUNqQixTQURMLE1BRUpzRCxLQUFLLENBQUN0RCxTQUZGO0FBSEEsT0FRWGlCLFFBUkosQ0FiMEUsQ0F1QjFFOztBQUNBc0QsRUFBQUEsTUFBTSxDQUFDMUQscUJBQVAsR0FDRTJELE9BQU8sQ0FBQ3ZELFFBQVEsQ0FBQ0wsbUJBQVYsQ0FBUCxJQUF5QzJELE1BQU0sQ0FBQzFELHFCQURsRDtBQUVBLE1BQU1tRCxRQUFRLEdBQUdQLHNCQUFzQixDQUFDSCxLQUFELEVBQVE7QUFBQ0UsSUFBQUEsT0FBTyxFQUFFZTtBQUFWLEdBQVIsQ0FBdkM7QUFFQSxTQUFPSixpQkFBaUIsR0FBRyxxQkFBU0gsUUFBVCxFQUFtQkcsaUJBQW5CLENBQUgsR0FBMkNILFFBQW5FO0FBQ0QsQ0E3Qk07Ozs7QUErQlAsU0FBU0ksb0JBQVQsQ0FBOEJwRSxTQUE5QixFQUF5Q00sb0JBQXpDLEVBQStEQyxZQUEvRCxFQUE2RTtBQUMzRSxTQUFPLENBQ0xrRSxrQkFBS0MsR0FBTCxDQUNFdEQsTUFBTSxDQUFDSyxNQUFQLENBQWN6QixTQUFkLEVBQ0cyRSxHQURILENBQ087QUFBQSxRQUFFdEUsRUFBRixTQUFFQSxFQUFGO0FBQUEsUUFBTXVFLEdBQU4sU0FBTUEsR0FBTjtBQUFBLFFBQVdDLFdBQVgsU0FBV0EsV0FBWDtBQUFBLFdBQTZCO0FBQ2hDeEUsTUFBQUEsRUFBRSxFQUFGQSxFQURnQztBQUVoQ3VFLE1BQUFBLEdBQUcsRUFBRSwwQ0FBZ0JBLEdBQWhCLElBQ0QsOENBQW9CQSxHQUFwQixFQUF5QkMsV0FBVyxJQUFJdkUsb0JBQXhDLEVBQThEQyxZQUE5RCxDQURDLEdBRURxRTtBQUo0QixLQUE3QjtBQUFBLEdBRFAsRUFPR0QsR0FQSCxDQU9PRywyQkFQUCxDQURGLEVBU0VDLEtBVEYsRUFVRTtBQUNBLFlBQUFDLE9BQU87QUFBQSxXQUNMLG9DQUNFQSxPQUFPLENBQUM5RSxNQUFSLENBQ0UsVUFBQ0MsSUFBRDtBQUFBLFVBQVFFLEVBQVIsU0FBUUEsRUFBUjtBQUFBLFVBQVlhLEtBQVosU0FBWUEsS0FBWjtBQUFBLCtCQUNLZixJQURMLHVDQUVHRSxFQUZILG9CQUdPTCxTQUFTLENBQUNLLEVBQUQsQ0FIaEI7QUFJSWEsUUFBQUEsS0FBSyxFQUFMQTtBQUpKO0FBQUEsS0FERixFQVFFLEVBUkYsQ0FERixDQURLO0FBQUEsR0FYVCxFQXdCRTtBQUNBK0Qsa0NBekJGLENBREssQ0FBUDtBQTZCRDtBQUNEOzs7Ozs7Ozs7O0FBUU8sSUFBTUMsNkJBQTZCLEdBQUcsU0FBaENBLDZCQUFnQyxDQUFBNUIsS0FBSyxFQUFJO0FBQ3BELE1BQU02QixXQUFXLHFCQUNacEUsaUJBRFk7QUFFZlQsSUFBQUEsb0JBQW9CLEVBQUVnRCxLQUFLLENBQUNoRCxvQkFGYjtBQUdmQyxJQUFBQSxZQUFZLEVBQUUrQyxLQUFLLENBQUMvQyxZQUhMO0FBSWZFLElBQUFBLHVCQUF1QixFQUFFNkMsS0FBSyxDQUFDN0M7QUFKaEIsS0FLWjZDLEtBQUssQ0FBQzhCLFlBTE07QUFNZnBGLElBQUFBLFNBQVMsRUFBRXNELEtBQUssQ0FBQ3RELFNBTkY7QUFPZm9GLElBQUFBLFlBQVksRUFBRTlCLEtBQUssQ0FBQzhCO0FBUEwsSUFBakI7O0FBVUEsU0FBTzFCLHFCQUFxQixDQUFDeUIsV0FBRCxFQUFjO0FBQUMzQixJQUFBQSxPQUFPLEVBQUUyQixXQUFXLENBQUNyRjtBQUF0QixHQUFkLENBQTVCO0FBQ0QsQ0FaTTtBQWNQOzs7Ozs7Ozs7O0FBTU8sSUFBTXVGLHlCQUF5QixHQUFHLFNBQTVCQSx5QkFBNEIsQ0FBQy9CLEtBQUQ7QUFBQSw4QkFBU0UsT0FBVDtBQUFBLE1BQW1COEIsSUFBbkIsa0JBQW1CQSxJQUFuQjtBQUFBLE1BQXlCcEUsS0FBekIsa0JBQXlCQSxLQUF6QjtBQUFBLE1BQWdDcUUsS0FBaEMsa0JBQWdDQSxLQUFoQztBQUFBLDJCQUNwQ2pDLEtBRG9DO0FBRXZDNUMsSUFBQUEsVUFBVSxvQkFDTDRDLEtBQUssQ0FBQzVDLFVBREQsTUFHSlEsS0FBSyxHQUNMO0FBQ0ViLE1BQUFBLEVBQUUsRUFBRWEsS0FBSyxDQUFDYixFQUFOLElBQVksNEJBRGxCO0FBRUU7QUFDQWEsTUFBQUEsS0FBSyxFQUFFLHdCQUFVQSxLQUFWLENBSFQ7QUFJRXNFLE1BQUFBLEtBQUssRUFBRXRFLEtBQUssQ0FBQ3VFLElBSmY7QUFLRTtBQUNBMUIsTUFBQUEsV0FBVyxFQUFFaEIsdUJBQXVCLENBQUM3QixLQUFEO0FBTnRDLEtBREssR0FTTCxFQVpJLE1BYUpvRSxJQUFJLEdBQUc7QUFBQ0EsTUFBQUEsSUFBSSxFQUFKQTtBQUFELEtBQUgsR0FBWSxFQWJaLE1BY0pDLEtBQUssS0FBS0csU0FBVixHQUFzQjtBQUFDSCxNQUFBQSxLQUFLLEVBQUxBO0FBQUQsS0FBdEIsR0FBZ0MsRUFkNUI7QUFGNkI7QUFBQSxDQUFsQztBQW9CUDs7Ozs7Ozs7OztBQU1PLElBQU1JLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsQ0FBQ3JDLEtBQUQsVUFBOEM7QUFBQSw4QkFBckNFLE9BQXFDO0FBQUEsTUFBM0I5QyxVQUEyQixrQkFBM0JBLFVBQTJCO0FBQUEsTUFBZmtGLFFBQWUsa0JBQWZBLFFBQWU7O0FBQ2hGLE1BQU1DLE9BQU8scUJBQ1J2QyxLQUFLLENBQUM1QyxVQURFLE1BRVJBLFVBRlEsQ0FBYjs7QUFLQSxNQUFNb0YsT0FBTyxHQUFHLDBDQUFnQkQsT0FBTyxDQUFDakIsR0FBeEIsQ0FBaEI7QUFDQSxNQUFNVSxJQUFJLEdBQUdRLE9BQU8sR0FDaEIsNENBQWtCO0FBQ2hCRixJQUFBQSxRQUFRLEVBQVJBLFFBRGdCO0FBRWhCRyxJQUFBQSxRQUFRLEVBQUVGLE9BQU8sQ0FBQ2pCLEdBRkY7QUFHaEJ0RSxJQUFBQSxvQkFBb0IsRUFBRXVGLE9BQU8sQ0FBQ2hCLFdBQVIsSUFBdUJ2QixLQUFLLENBQUNoRCxvQkFIbkM7QUFJaEJDLElBQUFBLFlBQVksRUFBRStDLEtBQUssQ0FBQy9DLFlBQU4sSUFBc0JDO0FBSnBCLEdBQWxCLENBRGdCLEdBT2hCOEMsS0FBSyxDQUFDNUMsVUFBTixDQUFpQjRFLElBUHJCO0FBU0EsMkJBQ0toQyxLQURMO0FBRUU1QyxJQUFBQSxVQUFVLG9CQUNMbUYsT0FESztBQUVSQyxNQUFBQSxPQUFPLEVBQVBBLE9BRlE7QUFHUlIsTUFBQUEsSUFBSSxFQUFKQTtBQUhRO0FBRlo7QUFRRCxDQXhCTTtBQTBCUDs7Ozs7Ozs7Ozs7QUFPTyxJQUFNVSx3QkFBd0IsR0FBRyxTQUEzQkEsd0JBQTJCLENBQUExQyxLQUFLLEVBQUk7QUFDL0MsTUFBTTJDLE9BQU8sR0FBRzNDLEtBQUssQ0FBQzVDLFVBQU4sQ0FBaUJMLEVBQWpDOztBQUNBLE1BQU0yRCxRQUFRLHFCQUNUVixLQURTO0FBRVp0RCxJQUFBQSxTQUFTLG9CQUNKc0QsS0FBSyxDQUFDdEQsU0FERix1Q0FFTmlHLE9BRk0sRUFFSTNDLEtBQUssQ0FBQzVDLFVBRlYsRUFGRztBQU1aO0FBQ0FBLElBQUFBLFVBQVUsRUFBRUMsb0JBQW9CO0FBUHBCLElBQWQsQ0FGK0MsQ0FXL0M7OztBQUNBLFNBQU8rQyxxQkFBcUIsQ0FBQ00sUUFBRCxFQUFXO0FBQUNSLElBQUFBLE9BQU8sRUFBRXlDO0FBQVYsR0FBWCxDQUE1QjtBQUNELENBYk07QUFlUDs7Ozs7Ozs7O0FBS08sSUFBTUMseUJBQXlCLEdBQUcsU0FBNUJBLHlCQUE0QixDQUFDNUMsS0FBRDtBQUFBLE1BQWtCNkMsS0FBbEIsVUFBUzNDLE9BQVQ7QUFBQSwyQkFDcENGLEtBRG9DO0FBRXZDMUMsSUFBQUEsbUJBQW1CLEVBQUV1RixLQUZrQjtBQUd2Q3RGLElBQUFBLHFCQUFxQixFQUFFO0FBSGdCO0FBQUEsQ0FBbEM7QUFNUDs7Ozs7Ozs7QUFJTyxTQUFTRixvQkFBVCxHQUFnQztBQUNyQyxTQUFPO0FBQ0xrRSxJQUFBQSxXQUFXLEVBQUUsSUFEUjtBQUVMVSxJQUFBQSxLQUFLLEVBQUUsS0FGRjtBQUdMTyxJQUFBQSxPQUFPLEVBQUUsS0FISjtBQUlMTixJQUFBQSxLQUFLLEVBQUUsSUFKRjtBQUtMdEUsSUFBQUEsS0FBSyxFQUFFLElBTEY7QUFNTDBELElBQUFBLEdBQUcsRUFBRSxJQU5BO0FBT0xVLElBQUFBLElBQUksRUFBRSxJQVBEO0FBUUxjLElBQUFBLE1BQU0sRUFBRTtBQVJILEdBQVA7QUFVRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgVGFzaywge3dpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtL3Rhc2tzJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbi8vIFV0aWxzXG5pbXBvcnQge1xuICBnZXREZWZhdWx0TGF5ZXJHcm91cFZpc2liaWxpdHksXG4gIGlzVmFsaWRTdHlsZVVybCxcbiAgZ2V0U3R5bGVEb3dubG9hZFVybCxcbiAgbWVyZ2VMYXllckdyb3VwVmlzaWJpbGl0eSxcbiAgZWRpdFRvcE1hcFN0eWxlLFxuICBlZGl0Qm90dG9tTWFwU3R5bGUsXG4gIGdldFN0eWxlSW1hZ2VJY29uXG59IGZyb20gJ3V0aWxzL21hcC1zdHlsZS11dGlscy9tYXBib3gtZ2wtc3R5bGUtZWRpdG9yJztcbmltcG9ydCB7XG4gIERFRkFVTFRfTUFQX1NUWUxFUyxcbiAgREVGQVVMVF9MQVlFUl9HUk9VUFMsXG4gIERFRkFVTFRfTUFQQk9YX0FQSV9VUkxcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtMT0FEX01BUF9TVFlMRV9UQVNLfSBmcm9tICd0YXNrcy90YXNrcyc7XG5pbXBvcnQge2xvYWRNYXBTdHlsZXMsIGxvYWRNYXBTdHlsZUVycn0gZnJvbSAnYWN0aW9ucy9tYXAtc3R5bGUtYWN0aW9ucyc7XG5pbXBvcnQge3JnYn0gZnJvbSAnZDMtY29sb3InO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuXG5jb25zdCBERUZBVUxUX0JMREdfQ09MT1IgPSAnI0QxQ0VDNyc7XG5cbi8qKlxuICogQHJldHVybiB7aW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLk1hcFN0eWxlfVxuICovXG5jb25zdCBnZXREZWZhdWx0U3RhdGUgPSAoKSA9PiB7XG4gIGNvbnN0IHZpc2libGVMYXllckdyb3VwcyA9IHt9O1xuICBjb25zdCBzdHlsZVR5cGUgPSAnZGFyayc7XG4gIGNvbnN0IHRvcExheWVyR3JvdXBzID0ge307XG5cbiAgcmV0dXJuIHtcbiAgICBzdHlsZVR5cGUsXG4gICAgdmlzaWJsZUxheWVyR3JvdXBzLFxuICAgIHRvcExheWVyR3JvdXBzLFxuICAgIG1hcFN0eWxlczogREVGQVVMVF9NQVBfU1RZTEVTLnJlZHVjZShcbiAgICAgIChhY2N1LCBjdXJyKSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBbY3Vyci5pZF06IGN1cnJcbiAgICAgIH0pLFxuICAgICAge31cbiAgICApLFxuICAgIC8vIHNhdmUgbWFwYm94IGFjY2VzcyB0b2tlblxuICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBudWxsLFxuICAgIG1hcGJveEFwaVVybDogREVGQVVMVF9NQVBCT1hfQVBJX1VSTCxcbiAgICBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdDogZmFsc2UsXG4gICAgaW5wdXRTdHlsZTogZ2V0SW5pdGlhbElucHV0U3R5bGUoKSxcbiAgICB0aHJlZURCdWlsZGluZ0NvbG9yOiBoZXhUb1JnYihERUZBVUxUX0JMREdfQ09MT1IpLFxuICAgIGN1c3RvbTNEQnVpbGRpbmdDb2xvcjogZmFsc2VcbiAgfTtcbn07XG5cbi8qKlxuICogVXBkYXRlcnMgZm9yIGBtYXBTdHlsZWAuIENhbiBiZSB1c2VkIGluIHlvdXIgcm9vdCByZWR1Y2VyIHRvIGRpcmVjdGx5IG1vZGlmeSBrZXBsZXIuZ2wncyBzdGF0ZS5cbiAqIFJlYWQgbW9yZSBhYm91dCBbVXNpbmcgdXBkYXRlcnNdKC4uL2FkdmFuY2VkLXVzYWdlL3VzaW5nLXVwZGF0ZXJzLm1kKVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQga2VwbGVyR2xSZWR1Y2VyLCB7bWFwU3R5bGVVcGRhdGVyc30gZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIC8vIFJvb3QgUmVkdWNlclxuICogY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICogIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKiAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAqICAgIC8vIGNsaWNrIGJ1dHRvbiB0byBoaWRlIGxhYmVsIGZyb20gYmFja2dyb3VuZCBtYXBcbiAqICAgIGNhc2UgJ0NMSUNLX0JVVFRPTic6XG4gKiAgICAgIHJldHVybiB7XG4gKiAgICAgICAgLi4uc3RhdGUsXG4gKiAgICAgICAga2VwbGVyR2w6IHtcbiAqICAgICAgICAgIC4uLnN0YXRlLmtlcGxlckdsLFxuICogICAgICAgICAgZm9vOiB7XG4gKiAgICAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbC5mb28sXG4gKiAgICAgICAgICAgICBtYXBTdHlsZTogbWFwU3R5bGVVcGRhdGVycy5tYXBDb25maWdDaGFuZ2VVcGRhdGVyKFxuICogICAgICAgICAgICAgICBtYXBTdHlsZSxcbiAqICAgICAgICAgICAgICAge3BheWxvYWQ6IHt2aXNpYmxlTGF5ZXJHcm91cHM6IHtsYWJlbDogZmFsc2UsIHJvYWQ6IHRydWUsIGJhY2tncm91bmQ6IHRydWV9fX1cbiAqICAgICAgICAgICAgIClcbiAqICAgICAgICAgIH1cbiAqICAgICAgICB9XG4gKiAgICAgIH07XG4gKiAgfVxuICogIHJldHVybiByZWR1Y2VycyhzdGF0ZSwgYWN0aW9uKTtcbiAqIH07XG4gKlxuICogZXhwb3J0IGRlZmF1bHQgY29tcG9zZWRSZWR1Y2VyO1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuY29uc3QgbWFwU3R5bGVVcGRhdGVycyA9IG51bGw7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4vKipcbiAqIERlZmF1bHQgaW5pdGlhbCBgbWFwU3R5bGVgXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQGNvbnN0YW50XG4gKiBAcHJvcGVydHkgc3R5bGVUeXBlIC0gRGVmYXVsdDogYCdkYXJrJ2BcbiAqIEBwcm9wZXJ0eSB2aXNpYmxlTGF5ZXJHcm91cHMgLSBEZWZhdWx0OiBge31gXG4gKiBAcHJvcGVydHkgdG9wTGF5ZXJHcm91cHMgLSBEZWZhdWx0OiBge31gXG4gKiBAcHJvcGVydHkgbWFwU3R5bGVzIC0gbWFwcGluZyBmcm9tIHN0eWxlIGtleSB0byBzdHlsZSBvYmplY3RcbiAqIEBwcm9wZXJ0eSBtYXBib3hBcGlBY2Nlc3NUb2tlbiAtIERlZmF1bHQ6IGBudWxsYFxuICogQFByb3BlcnR5IG1hcGJveEFwaVVybCAtIERlZmF1bHQgbnVsbFxuICogQFByb3BlcnR5IG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IC0gRGVmYXVsdDogYGZhbHNlYFxuICogQHByb3BlcnR5IGlucHV0U3R5bGUgLSBEZWZhdWx0OiBge31gXG4gKiBAcHJvcGVydHkgdGhyZWVEQnVpbGRpbmdDb2xvciAtIERlZmF1bHQ6IGBbciwgZywgYl1gXG4gKiBAdHlwZSB7aW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLk1hcFN0eWxlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgSU5JVElBTF9NQVBfU1RZTEUgPSBnZXREZWZhdWx0U3RhdGUoKTtcblxuLyoqXG4gKiBDcmVhdGUgdHdvIG1hcCBzdHlsZXMgZnJvbSBwcmVzZXQgbWFwIHN0eWxlLCBvbmUgZm9yIHRvcCBtYXAgb25lIGZvciBib3R0b21cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGVUeXBlIC0gY3VycmVudCBtYXAgc3R5bGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB2aXNpYmxlTGF5ZXJHcm91cHMgLSB2aXNpYmxlIGxheWVycyBvZiBib3R0b20gbWFwXG4gKiBAcGFyYW0ge09iamVjdH0gdG9wTGF5ZXJHcm91cHMgLSB2aXNpYmxlIGxheWVycyBvZiB0b3AgbWFwXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwU3R5bGVzIC0gYSBkaWN0aW9uYXJ5IG9mIGFsbCBtYXAgc3R5bGVzXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBib3R0b21NYXBTdHlsZSB8IHRvcE1hcFN0eWxlIHwgaXNSYXN0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcFN0eWxlcyh7c3R5bGVUeXBlLCB2aXNpYmxlTGF5ZXJHcm91cHMsIHRvcExheWVyR3JvdXBzLCBtYXBTdHlsZXN9KSB7XG4gIGNvbnN0IG1hcFN0eWxlID0gbWFwU3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgLy8gc3R5bGUgbWlnaHQgbm90IGJlIGxvYWRlZCB5ZXRcbiAgaWYgKCFtYXBTdHlsZSB8fCAhbWFwU3R5bGUuc3R5bGUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCBlZGl0YWJsZSA9IE9iamVjdC5rZXlzKHZpc2libGVMYXllckdyb3VwcykubGVuZ3RoO1xuXG4gIGNvbnN0IGJvdHRvbU1hcFN0eWxlID0gIWVkaXRhYmxlXG4gICAgPyBtYXBTdHlsZS5zdHlsZVxuICAgIDogZWRpdEJvdHRvbU1hcFN0eWxlKHtcbiAgICAgICAgaWQ6IHN0eWxlVHlwZSxcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIHZpc2libGVMYXllckdyb3Vwc1xuICAgICAgfSk7XG5cbiAgY29uc3QgaGFzVG9wTGF5ZXIgPSBlZGl0YWJsZSAmJiBPYmplY3QudmFsdWVzKHRvcExheWVyR3JvdXBzKS5zb21lKHYgPT4gdik7XG5cbiAgLy8gbXV0ZSB0b3AgbGF5ZXIgaWYgbm90IHZpc2libGUgaW4gYm90dG9tIGxheWVyXG4gIGNvbnN0IHRvcExheWVycyA9XG4gICAgaGFzVG9wTGF5ZXIgJiZcbiAgICBPYmplY3Qua2V5cyh0b3BMYXllckdyb3VwcykucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHRvcExheWVyR3JvdXBzW2tleV0gJiYgdmlzaWJsZUxheWVyR3JvdXBzW2tleV1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gIGNvbnN0IHRvcE1hcFN0eWxlID0gaGFzVG9wTGF5ZXJcbiAgICA/IGVkaXRUb3BNYXBTdHlsZSh7XG4gICAgICAgIGlkOiBzdHlsZVR5cGUsXG4gICAgICAgIG1hcFN0eWxlLFxuICAgICAgICB2aXNpYmxlTGF5ZXJHcm91cHM6IHRvcExheWVyc1xuICAgICAgfSlcbiAgICA6IG51bGw7XG5cbiAgcmV0dXJuIHtib3R0b21NYXBTdHlsZSwgdG9wTWFwU3R5bGUsIGVkaXRhYmxlfTtcbn1cblxuZnVuY3Rpb24gZmluZExheWVyRmlsbENvbG9yKGxheWVyKSB7XG4gIHJldHVybiBsYXllciAmJiBsYXllci5wYWludCAmJiBsYXllci5wYWludFsnYmFja2dyb3VuZC1jb2xvciddO1xufVxuXG5mdW5jdGlvbiBnZXQzREJ1aWxkaW5nQ29sb3Ioc3R5bGUpIHtcbiAgLy8gc2V0IGJ1aWxkaW5nIGNvbG9yIHRvIGJlIHRoZSBzYW1lIGFzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yLlxuICBpZiAoIXN0eWxlLnN0eWxlKSB7XG4gICAgcmV0dXJuIGhleFRvUmdiKERFRkFVTFRfQkxER19DT0xPUik7XG4gIH1cblxuICBjb25zdCBiYWNrZ3JvdW5kTGF5ZXIgPSAoc3R5bGUuc3R5bGUubGF5ZXJzIHx8IFtdKS5maW5kKCh7aWR9KSA9PiBpZCA9PT0gJ2JhY2tncm91bmQnKTtcblxuICBjb25zdCBidWlsZGluZ0xheWVyID0gKHN0eWxlLnN0eWxlLmxheWVycyB8fCBbXSkuZmluZCgoe2lkfSkgPT4gaWQubWF0Y2goL2J1aWxkaW5nLykpO1xuXG4gIGNvbnN0IGJ1aWxkaW5nQ29sb3IgPVxuICAgIGZpbmRMYXllckZpbGxDb2xvcihidWlsZGluZ0xheWVyKSB8fCBmaW5kTGF5ZXJGaWxsQ29sb3IoYmFja2dyb3VuZExheWVyKSB8fCBERUZBVUxUX0JMREdfQ09MT1I7XG5cbiAgLy8gYnJpZ2h0ZW4gb3IgZGFya2VuIGJ1aWxkaW5nIGJhc2VkIG9uIHN0eWxlXG4gIGNvbnN0IG9wZXJhdGlvbiA9IHN0eWxlLmlkLm1hdGNoKC8oPz0oZGFya3xuaWdodCkpLykgPyAnYnJpZ2h0ZXInIDogJ2Rhcmtlcic7XG5cbiAgY29uc3QgYWxwaGEgPSAwLjI7XG4gIGNvbnN0IHJnYk9iaiA9IHJnYihidWlsZGluZ0NvbG9yKVtvcGVyYXRpb25dKFthbHBoYV0pO1xuICByZXR1cm4gW3JnYk9iai5yLCByZ2JPYmouZywgcmdiT2JqLmJdO1xufVxuXG5mdW5jdGlvbiBnZXRMYXllckdyb3Vwc0Zyb21TdHlsZShzdHlsZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShzdHlsZS5sYXllcnMpXG4gICAgPyBERUZBVUxUX0xBWUVSX0dST1VQUy5maWx0ZXIobGcgPT4gc3R5bGUubGF5ZXJzLmZpbHRlcihsZy5maWx0ZXIpLmxlbmd0aClcbiAgICA6IFtdO1xufVxuXG4vLyBVcGRhdGVyc1xuLyoqXG4gKiBQcm9wYWdhdGUgYG1hcFN0eWxlYCByZWR1Y2VyIHdpdGggYG1hcGJveEFwaUFjY2Vzc1Rva2VuYCBhbmQgYG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0YC5cbiAqIGlmIG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IGlzIHRydWUgbWFwU3R5bGVzIGlzIGVtcHRpZWQ7IGxvYWRNYXBTdHlsZXNVcGRhdGVyKCkgd2lsbFxuICogcG9wdWxhdGUgbWFwU3R5bGVzLlxuICpcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5pbml0TWFwU3R5bGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgaW5pdE1hcFN0eWxlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgLy8gc2F2ZSBtYXBib3ggYWNjZXNzIHRva2VuIHRvIG1hcCBzdHlsZSBzdGF0ZVxuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogKGFjdGlvbi5wYXlsb2FkIHx8IHt9KS5tYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgbWFwYm94QXBpVXJsOiAoYWN0aW9uLnBheWxvYWQgfHwge30pLm1hcGJveEFwaVVybCB8fCBzdGF0ZS5tYXBib3hBcGlVcmwsXG4gIG1hcFN0eWxlczogYWN0aW9uLnBheWxvYWQgJiYgIWFjdGlvbi5wYXlsb2FkLm1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0ID8gc3RhdGUubWFwU3R5bGVzIDoge30sXG4gIG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0OiBhY3Rpb24ucGF5bG9hZC5tYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCB8fCBmYWxzZVxufSk7XG4vLyB9KTtcblxuLyoqXG4gKiBVcGRhdGUgYHZpc2libGVMYXllckdyb3Vwc2B0byBjaGFuZ2UgbGF5ZXIgZ3JvdXAgdmlzaWJpbGl0eVxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLm1hcENvbmZpZ0NoYW5nZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBtYXBDb25maWdDaGFuZ2VVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICAuLi5hY3Rpb24ucGF5bG9hZCxcbiAgLi4uZ2V0TWFwU3R5bGVzKHtcbiAgICAuLi5zdGF0ZSxcbiAgICAuLi5hY3Rpb24ucGF5bG9hZFxuICB9KVxufSk7XG5cbi8qKlxuICogQ2hhbmdlIHRvIGFub3RoZXIgbWFwIHN0eWxlLiBUaGUgc2VsZWN0ZWQgc3R5bGUgc2hvdWxkIGFscmVhZHkgYmVlbiBsb2FkZWQgaW50byBgbWFwU3R5bGUubWFwU3R5bGVzYFxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLm1hcFN0eWxlQ2hhbmdlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IG1hcFN0eWxlQ2hhbmdlVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHN0eWxlVHlwZX0pID0+IHtcbiAgaWYgKCFzdGF0ZS5tYXBTdHlsZXNbc3R5bGVUeXBlXSkge1xuICAgIC8vIHdlIG1pZ2h0IG5vdCBoYXZlIHJlY2VpdmVkIHRoZSBzdHlsZSB5ZXRcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3QgZGVmYXVsdExHVmlzaWJpbGl0eSA9IGdldERlZmF1bHRMYXllckdyb3VwVmlzaWJpbGl0eShzdGF0ZS5tYXBTdHlsZXNbc3R5bGVUeXBlXSk7XG5cbiAgY29uc3QgdmlzaWJsZUxheWVyR3JvdXBzID0gbWVyZ2VMYXllckdyb3VwVmlzaWJpbGl0eShcbiAgICBkZWZhdWx0TEdWaXNpYmlsaXR5LFxuICAgIHN0YXRlLnZpc2libGVMYXllckdyb3Vwc1xuICApO1xuXG4gIGNvbnN0IHRocmVlREJ1aWxkaW5nQ29sb3IgPSBzdGF0ZS5jdXN0b20zREJ1aWxkaW5nQ29sb3JcbiAgICA/IHN0YXRlLnRocmVlREJ1aWxkaW5nQ29sb3JcbiAgICA6IGdldDNEQnVpbGRpbmdDb2xvcihzdGF0ZS5tYXBTdHlsZXNbc3R5bGVUeXBlXSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzdHlsZVR5cGUsXG4gICAgdmlzaWJsZUxheWVyR3JvdXBzLFxuICAgIHRocmVlREJ1aWxkaW5nQ29sb3IsXG4gICAgLi4uZ2V0TWFwU3R5bGVzKHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdmlzaWJsZUxheWVyR3JvdXBzLFxuICAgICAgc3R5bGVUeXBlXG4gICAgfSlcbiAgfTtcbn07XG5cbi8qKlxuICogQ2FsbGJhY2sgd2hlbiBsb2FkIG1hcCBzdHlsZSBzdWNjZXNzXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykubG9hZE1hcFN0eWxlc1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkTWFwU3R5bGVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IG5ld1N0eWxlcyA9IGFjdGlvbi5wYXlsb2FkIHx8IHt9O1xuICBjb25zdCBhZGRMYXllckdyb3VwcyA9IE9iamVjdC5rZXlzKG5ld1N0eWxlcykucmVkdWNlKFxuICAgIChhY2N1LCBpZCkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICBbaWRdOiB7XG4gICAgICAgIC4uLm5ld1N0eWxlc1tpZF0sXG4gICAgICAgIGxheWVyR3JvdXBzOiBuZXdTdHlsZXNbaWRdLmxheWVyR3JvdXBzIHx8IGdldExheWVyR3JvdXBzRnJvbVN0eWxlKG5ld1N0eWxlc1tpZF0uc3R5bGUpXG4gICAgICB9XG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICAvLyBhZGQgbmV3IHN0eWxlcyB0byBzdGF0ZVxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBtYXBTdHlsZXM6IHtcbiAgICAgIC4uLnN0YXRlLm1hcFN0eWxlcyxcbiAgICAgIC4uLmFkZExheWVyR3JvdXBzXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBuZXdTdHlsZXNbc3RhdGUuc3R5bGVUeXBlXVxuICAgID8gbWFwU3R5bGVDaGFuZ2VVcGRhdGVyKG5ld1N0YXRlLCB7cGF5bG9hZDogc3RhdGUuc3R5bGVUeXBlfSlcbiAgICA6IG5ld1N0YXRlO1xufTtcblxuLyoqXG4gKiBDYWxsYmFjayB3aGVuIGxvYWQgbWFwIHN0eWxlIGVycm9yXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykubG9hZE1hcFN0eWxlRXJyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuLy8gZG8gbm90aGluZyBmb3Igbm93LCBpZiBkaWRuJ3QgbG9hZCwgc2tpcCBpdFxuZXhwb3J0IGNvbnN0IGxvYWRNYXBTdHlsZUVyclVwZGF0ZXIgPSBzdGF0ZSA9PiBzdGF0ZTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykucmVxdWVzdE1hcFN0eWxlc1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZXF1ZXN0TWFwU3R5bGVzVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IG1hcFN0eWxlc30pID0+IHtcbiAgY29uc3QgbG9hZE1hcFN0eWxlVGFza3MgPSBnZXRMb2FkTWFwU3R5bGVUYXNrcyhcbiAgICBtYXBTdHlsZXMsXG4gICAgc3RhdGUubWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgc3RhdGUubWFwYm94QXBpVXJsXG4gICk7XG4gIHJldHVybiB3aXRoVGFzayhzdGF0ZSwgbG9hZE1hcFN0eWxlVGFza3MpO1xufTtcblxuLyoqXG4gKiBMb2FkIG1hcCBzdHlsZSBvYmplY3Qgd2hlbiBwYXNzIGluIHNhdmVkIG1hcCBjb25maWdcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYG1hcFN0eWxlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIHNhdmVkIG1hcCBjb25maWcgYHttYXBTdHlsZSwgdmlzU3RhdGUsIG1hcFN0YXRlfWBcbiAqIEByZXR1cm5zIG5leHRTdGF0ZSBvciBgcmVhY3QtcGFtYCB0YXNrcyB0byBsb2FkIG1hcCBzdHlsZSBvYmplY3RcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLnJlY2VpdmVNYXBDb25maWdVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiB7Y29uZmlnID0ge319fSkgPT4ge1xuICBjb25zdCB7bWFwU3R5bGV9ID0gY29uZmlnIHx8IHt9O1xuXG4gIGlmICghbWFwU3R5bGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBpZiBzYXZlZCBjdXN0b20gbWFwU3R5bGVzIGxvYWQgdGhlIHN0eWxlIG9iamVjdFxuICBjb25zdCBsb2FkTWFwU3R5bGVUYXNrcyA9IG1hcFN0eWxlLm1hcFN0eWxlc1xuICAgID8gZ2V0TG9hZE1hcFN0eWxlVGFza3MobWFwU3R5bGUubWFwU3R5bGVzLCBzdGF0ZS5tYXBib3hBcGlBY2Nlc3NUb2tlbiwgc3RhdGUubWFwYm94QXBpVXJsKVxuICAgIDogbnVsbDtcblxuICAvLyBtZXJnZSBkZWZhdWx0IG1hcFN0eWxlc1xuICBjb25zdCBtZXJnZWQgPSBtYXBTdHlsZS5tYXBTdHlsZXNcbiAgICA/IHtcbiAgICAgICAgLi4ubWFwU3R5bGUsXG4gICAgICAgIG1hcFN0eWxlczoge1xuICAgICAgICAgIC4uLm1hcFN0eWxlLm1hcFN0eWxlcyxcbiAgICAgICAgICAuLi5zdGF0ZS5tYXBTdHlsZXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIDogbWFwU3R5bGU7XG5cbiAgLy8gc2V0IGN1c3RvbTNEQnVpbGRpbmdDb2xvcjogdHJ1ZSBpZiBtYXBTdHlsZSBjb250YWlucyB0aHJlZURCdWlsZGluZ0NvbG9yXG4gIG1lcmdlZC5jdXN0b20zREJ1aWxkaW5nQ29sb3IgPVxuICAgIEJvb2xlYW4obWFwU3R5bGUudGhyZWVEQnVpbGRpbmdDb2xvcikgfHwgbWVyZ2VkLmN1c3RvbTNEQnVpbGRpbmdDb2xvcjtcbiAgY29uc3QgbmV3U3RhdGUgPSBtYXBDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCB7cGF5bG9hZDogbWVyZ2VkfSk7XG5cbiAgcmV0dXJuIGxvYWRNYXBTdHlsZVRhc2tzID8gd2l0aFRhc2sobmV3U3RhdGUsIGxvYWRNYXBTdHlsZVRhc2tzKSA6IG5ld1N0YXRlO1xufTtcblxuZnVuY3Rpb24gZ2V0TG9hZE1hcFN0eWxlVGFza3MobWFwU3R5bGVzLCBtYXBib3hBcGlBY2Nlc3NUb2tlbiwgbWFwYm94QXBpVXJsKSB7XG4gIHJldHVybiBbXG4gICAgVGFzay5hbGwoXG4gICAgICBPYmplY3QudmFsdWVzKG1hcFN0eWxlcylcbiAgICAgICAgLm1hcCgoe2lkLCB1cmwsIGFjY2Vzc1Rva2VufSkgPT4gKHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICB1cmw6IGlzVmFsaWRTdHlsZVVybCh1cmwpXG4gICAgICAgICAgICA/IGdldFN0eWxlRG93bmxvYWRVcmwodXJsLCBhY2Nlc3NUb2tlbiB8fCBtYXBib3hBcGlBY2Nlc3NUb2tlbiwgbWFwYm94QXBpVXJsKVxuICAgICAgICAgICAgOiB1cmxcbiAgICAgICAgfSkpXG4gICAgICAgIC5tYXAoTE9BRF9NQVBfU1RZTEVfVEFTSylcbiAgICApLmJpbWFwKFxuICAgICAgLy8gc3VjY2Vzc1xuICAgICAgcmVzdWx0cyA9PlxuICAgICAgICBsb2FkTWFwU3R5bGVzKFxuICAgICAgICAgIHJlc3VsdHMucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIHtpZCwgc3R5bGV9KSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICBbaWRdOiB7XG4gICAgICAgICAgICAgICAgLi4ubWFwU3R5bGVzW2lkXSxcbiAgICAgICAgICAgICAgICBzdHlsZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgLy8gZXJyb3JcbiAgICAgIGxvYWRNYXBTdHlsZUVyclxuICAgIClcbiAgXTtcbn1cbi8qKlxuICogUmVzZXQgbWFwIHN0eWxlIGNvbmZpZyB0byBpbml0aWFsIHN0YXRlXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGBtYXBTdHlsZWBcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykucmVzZXRNYXBDb25maWdNYXBTdHlsZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ01hcFN0eWxlVXBkYXRlciA9IHN0YXRlID0+IHtcbiAgY29uc3QgZW1wdHlDb25maWcgPSB7XG4gICAgLi4uSU5JVElBTF9NQVBfU1RZTEUsXG4gICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IHN0YXRlLm1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgIG1hcGJveEFwaVVybDogc3RhdGUubWFwYm94QXBpVXJsLFxuICAgIG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0OiBzdGF0ZS5tYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCxcbiAgICAuLi5zdGF0ZS5pbml0aWFsU3RhdGUsXG4gICAgbWFwU3R5bGVzOiBzdGF0ZS5tYXBTdHlsZXMsXG4gICAgaW5pdGlhbFN0YXRlOiBzdGF0ZS5pbml0aWFsU3RhdGVcbiAgfTtcblxuICByZXR1cm4gbWFwU3R5bGVDaGFuZ2VVcGRhdGVyKGVtcHR5Q29uZmlnLCB7cGF5bG9hZDogZW1wdHlDb25maWcuc3R5bGVUeXBlfSk7XG59O1xuXG4vKipcbiAqIENhbGxiYWNrIHdoZW4gYSBjdXN0b20gbWFwIHN0eWxlIG9iamVjdCBpcyByZWNlaXZlZFxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLmxvYWRDdXN0b21NYXBTdHlsZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkQ3VzdG9tTWFwU3R5bGVVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDoge2ljb24sIHN0eWxlLCBlcnJvcn19KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaW5wdXRTdHlsZToge1xuICAgIC4uLnN0YXRlLmlucHV0U3R5bGUsXG4gICAgLy8gc3R5bGUganNvbiBhbmQgaWNvbiB3aWxsIGxvYWQgYXN5bmNocm9ub3VzbHlcbiAgICAuLi4oc3R5bGVcbiAgICAgID8ge1xuICAgICAgICAgIGlkOiBzdHlsZS5pZCB8fCBnZW5lcmF0ZUhhc2hJZCgpLFxuICAgICAgICAgIC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBzdHlsZSBvYmplY3RcbiAgICAgICAgICBzdHlsZTogY2xvbmVEZWVwKHN0eWxlKSxcbiAgICAgICAgICBsYWJlbDogc3R5bGUubmFtZSxcbiAgICAgICAgICAvLyBnYXRoZXJpbmcgbGF5ZXIgZ3JvdXAgaW5mbyBmcm9tIHN0eWxlIGpzb25cbiAgICAgICAgICBsYXllckdyb3VwczogZ2V0TGF5ZXJHcm91cHNGcm9tU3R5bGUoc3R5bGUpXG4gICAgICAgIH1cbiAgICAgIDoge30pLFxuICAgIC4uLihpY29uID8ge2ljb259IDoge30pLFxuICAgIC4uLihlcnJvciAhPT0gdW5kZWZpbmVkID8ge2Vycm9yfSA6IHt9KVxuICB9XG59KTtcblxuLyoqXG4gKiBJbnB1dCBhIGN1c3RvbSBtYXAgc3R5bGUgb2JqZWN0XG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykuaW5wdXRNYXBTdHlsZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBpbnB1dE1hcFN0eWxlVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHtpbnB1dFN0eWxlLCBtYXBTdGF0ZX19KSA9PiB7XG4gIGNvbnN0IHVwZGF0ZWQgPSB7XG4gICAgLi4uc3RhdGUuaW5wdXRTdHlsZSxcbiAgICAuLi5pbnB1dFN0eWxlXG4gIH07XG5cbiAgY29uc3QgaXNWYWxpZCA9IGlzVmFsaWRTdHlsZVVybCh1cGRhdGVkLnVybCk7XG4gIGNvbnN0IGljb24gPSBpc1ZhbGlkXG4gICAgPyBnZXRTdHlsZUltYWdlSWNvbih7XG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBzdHlsZVVybDogdXBkYXRlZC51cmwsXG4gICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiB1cGRhdGVkLmFjY2Vzc1Rva2VuIHx8IHN0YXRlLm1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgICBtYXBib3hBcGlVcmw6IHN0YXRlLm1hcGJveEFwaVVybCB8fCBERUZBVUxUX01BUEJPWF9BUElfVVJMXG4gICAgICB9KVxuICAgIDogc3RhdGUuaW5wdXRTdHlsZS5pY29uO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW5wdXRTdHlsZToge1xuICAgICAgLi4udXBkYXRlZCxcbiAgICAgIGlzVmFsaWQsXG4gICAgICBpY29uXG4gICAgfVxuICB9O1xufTtcblxuLyoqXG4gKiBBZGQgbWFwIHN0eWxlIGZyb20gdXNlciBpbnB1dCB0byByZWR1Y2VyIGFuZCBzZXQgaXQgdG8gY3VycmVudCBzdHlsZVxuICogVGhpcyBhY3Rpb24gaXMgY2FsbGVkIHdoZW4gdXNlciBjbGljayBjb25maXJtIGFmdGVyIHB1dHRpbmcgaW4gYSB2YWxpZCBzdHlsZSB1cmwgaW4gdGhlIGN1c3RvbSBtYXAgc3R5bGUgZGlhbG9nLlxuICogSXQgc2hvdWxkIG5vdCBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIGtlcGxlci5nbCB3aXRob3V0IGEgdmFsaWQgYGlucHV0U3R5bGVgIGluIHRoZSBgbWFwU3R5bGVgIHJlZHVjZXIuXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykuYWRkQ3VzdG9tTWFwU3R5bGVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgYWRkQ3VzdG9tTWFwU3R5bGVVcGRhdGVyID0gc3RhdGUgPT4ge1xuICBjb25zdCBzdHlsZUlkID0gc3RhdGUuaW5wdXRTdHlsZS5pZDtcbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbWFwU3R5bGVzOiB7XG4gICAgICAuLi5zdGF0ZS5tYXBTdHlsZXMsXG4gICAgICBbc3R5bGVJZF06IHN0YXRlLmlucHV0U3R5bGVcbiAgICB9LFxuICAgIC8vIHNldCB0byBkZWZhdWx0XG4gICAgaW5wdXRTdHlsZTogZ2V0SW5pdGlhbElucHV0U3R5bGUoKVxuICB9O1xuICAvLyBzZXQgbmV3IHN0eWxlXG4gIHJldHVybiBtYXBTdHlsZUNoYW5nZVVwZGF0ZXIobmV3U3RhdGUsIHtwYXlsb2FkOiBzdHlsZUlkfSk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgM2QgYnVpbGRpbmcgY29sb3JcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5zZXQzZEJ1aWxkaW5nQ29sb3JVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0M2RCdWlsZGluZ0NvbG9yVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGNvbG9yfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIHRocmVlREJ1aWxkaW5nQ29sb3I6IGNvbG9yLFxuICBjdXN0b20zREJ1aWxkaW5nQ29sb3I6IHRydWVcbn0pO1xuXG4vKipcbiAqIFJldHVybiB0aGUgaW5pdGlhbCBpbnB1dCBzdHlsZVxuICogQHJldHVybiBPYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxJbnB1dFN0eWxlKCkge1xuICByZXR1cm4ge1xuICAgIGFjY2Vzc1Rva2VuOiBudWxsLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICBsYWJlbDogbnVsbCxcbiAgICBzdHlsZTogbnVsbCxcbiAgICB1cmw6IG51bGwsXG4gICAgaWNvbjogbnVsbCxcbiAgICBjdXN0b206IHRydWVcbiAgfTtcbn1cbiJdfQ==