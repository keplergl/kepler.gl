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
      return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, curr.id, curr));
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
    return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, topLayerGroups[key] && visibleLayerGroups[key]));
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


var initMapStyleUpdater = function initMapStyleUpdater(state, _ref4) {
  var _ref4$payload = _ref4.payload,
      payload = _ref4$payload === void 0 ? {} : _ref4$payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    // save mapbox access token to map style state
    mapboxApiAccessToken: payload.mapboxApiAccessToken || state.mapboxApiAccessToken,
    mapboxApiUrl: payload.mapboxApiUrl || state.mapboxApiUrl,
    mapStyles: !payload.mapStylesReplaceDefault ? state.mapStyles : {},
    mapStylesReplaceDefault: payload.mapStylesReplaceDefault || false
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
  return _objectSpread(_objectSpread(_objectSpread({}, state), action.payload), getMapStyles(_objectSpread(_objectSpread({}, state), action.payload)));
};
/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleUpdaters
 * @type {typeof import('./map-style-updaters').mapStyleChangeUpdater}
 * @public
 */


exports.mapConfigChangeUpdater = mapConfigChangeUpdater;

var mapStyleChangeUpdater = function mapStyleChangeUpdater(state, _ref5) {
  var styleType = _ref5.payload;

  if (!state.mapStyles[styleType]) {
    // we might not have received the style yet
    return state;
  }

  var defaultLGVisibility = (0, _mapboxGlStyleEditor.getDefaultLayerGroupVisibility)(state.mapStyles[styleType]);
  var visibleLayerGroups = (0, _mapboxGlStyleEditor.mergeLayerGroupVisibility)(defaultLGVisibility, state.visibleLayerGroups);
  var threeDBuildingColor = state.custom3DBuildingColor ? state.threeDBuildingColor : get3DBuildingColor(state.mapStyles[styleType]);
  return _objectSpread(_objectSpread({}, state), {}, {
    styleType: styleType,
    visibleLayerGroups: visibleLayerGroups,
    threeDBuildingColor: threeDBuildingColor
  }, getMapStyles(_objectSpread(_objectSpread({}, state), {}, {
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
    return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, id, _objectSpread(_objectSpread({}, newStyles[id]), {}, {
      layerGroups: newStyles[id].layerGroups || getLayerGroupsFromStyle(newStyles[id].style)
    })));
  }, {}); // add new styles to state

  var newState = _objectSpread(_objectSpread({}, state), {}, {
    mapStyles: _objectSpread(_objectSpread({}, state.mapStyles), addLayerGroups)
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

var requestMapStylesUpdater = function requestMapStylesUpdater(state, _ref6) {
  var mapStyles = _ref6.payload;
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

var receiveMapConfigUpdater = function receiveMapConfigUpdater(state, _ref7) {
  var _ref7$payload$config = _ref7.payload.config,
      config = _ref7$payload$config === void 0 ? {} : _ref7$payload$config;

  var _ref8 = config || {},
      mapStyle = _ref8.mapStyle;

  if (!mapStyle) {
    return state;
  } // if saved custom mapStyles load the style object


  var loadMapStyleTasks = mapStyle.mapStyles ? getLoadMapStyleTasks(mapStyle.mapStyles, state.mapboxApiAccessToken, state.mapboxApiUrl) : null; // merge default mapStyles

  var merged = mapStyle.mapStyles ? _objectSpread(_objectSpread({}, mapStyle), {}, {
    mapStyles: _objectSpread(_objectSpread({}, mapStyle.mapStyles), state.mapStyles)
  }) : mapStyle; // set custom3DBuildingColor: true if mapStyle contains threeDBuildingColor

  merged.custom3DBuildingColor = Boolean(mapStyle.threeDBuildingColor) || merged.custom3DBuildingColor;
  var newState = mapConfigChangeUpdater(state, {
    payload: merged
  });
  return loadMapStyleTasks ? (0, _tasks.withTask)(newState, loadMapStyleTasks) : newState;
};

exports.receiveMapConfigUpdater = receiveMapConfigUpdater;

function getLoadMapStyleTasks(mapStyles, mapboxApiAccessToken, mapboxApiUrl) {
  return [_tasks["default"].all(Object.values(mapStyles).map(function (_ref9) {
    var id = _ref9.id,
        url = _ref9.url,
        accessToken = _ref9.accessToken;
    return {
      id: id,
      url: (0, _mapboxGlStyleEditor.isValidStyleUrl)(url) ? (0, _mapboxGlStyleEditor.getStyleDownloadUrl)(url, accessToken || mapboxApiAccessToken, mapboxApiUrl) : url
    };
  }).map(_tasks2.LOAD_MAP_STYLE_TASK)).bimap( // success
  function (results) {
    return (0, _mapStyleActions.loadMapStyles)(results.reduce(function (accu, _ref10) {
      var id = _ref10.id,
          style = _ref10.style;
      return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, id, _objectSpread(_objectSpread({}, mapStyles[id]), {}, {
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
  var emptyConfig = _objectSpread(_objectSpread(_objectSpread({}, INITIAL_MAP_STYLE), {}, {
    mapboxApiAccessToken: state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl,
    mapStylesReplaceDefault: state.mapStylesReplaceDefault
  }, state.initialState), {}, {
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

var loadCustomMapStyleUpdater = function loadCustomMapStyleUpdater(state, _ref11) {
  var _ref11$payload = _ref11.payload,
      icon = _ref11$payload.icon,
      style = _ref11$payload.style,
      error = _ref11$payload.error;
  return _objectSpread(_objectSpread({}, state), {}, {
    inputStyle: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, state.inputStyle), style ? {
      id: style.id || (0, _utils.generateHashId)(),
      // make a copy of the style object
      style: (0, _lodash["default"])(style),
      label: style.name,
      // gathering layer group info from style json
      layerGroups: getLayerGroupsFromStyle(style)
    } : {}), icon ? {
      icon: icon
    } : {}), error !== undefined ? {
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

var inputMapStyleUpdater = function inputMapStyleUpdater(state, _ref12) {
  var _ref12$payload = _ref12.payload,
      inputStyle = _ref12$payload.inputStyle,
      mapState = _ref12$payload.mapState;

  var updated = _objectSpread(_objectSpread({}, state.inputStyle), inputStyle);

  var isValid = (0, _mapboxGlStyleEditor.isValidStyleUrl)(updated.url);
  var icon = isValid ? (0, _mapboxGlStyleEditor.getStyleImageIcon)({
    mapState: mapState,
    styleUrl: updated.url,
    mapboxApiAccessToken: updated.accessToken || state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl || _defaultSettings.DEFAULT_MAPBOX_API_URL
  }) : state.inputStyle.icon;
  return _objectSpread(_objectSpread({}, state), {}, {
    inputStyle: _objectSpread(_objectSpread({}, updated), {}, {
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
    mapStyles: _objectSpread(_objectSpread({}, state.mapStyles), {}, (0, _defineProperty2["default"])({}, styleId, state.inputStyle)),
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

var set3dBuildingColorUpdater = function set3dBuildingColorUpdater(state, _ref13) {
  var color = _ref13.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9tYXAtc3R5bGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsiREVGQVVMVF9CTERHX0NPTE9SIiwiZ2V0RGVmYXVsdFN0YXRlIiwidmlzaWJsZUxheWVyR3JvdXBzIiwic3R5bGVUeXBlIiwidG9wTGF5ZXJHcm91cHMiLCJtYXBTdHlsZXMiLCJERUZBVUxUX01BUF9TVFlMRVMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImlkIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJtYXBib3hBcGlVcmwiLCJERUZBVUxUX01BUEJPWF9BUElfVVJMIiwibWFwU3R5bGVzUmVwbGFjZURlZmF1bHQiLCJpbnB1dFN0eWxlIiwiZ2V0SW5pdGlhbElucHV0U3R5bGUiLCJ0aHJlZURCdWlsZGluZ0NvbG9yIiwiY3VzdG9tM0RCdWlsZGluZ0NvbG9yIiwibWFwU3R5bGVVcGRhdGVycyIsIklOSVRJQUxfTUFQX1NUWUxFIiwiZ2V0TWFwU3R5bGVzIiwibWFwU3R5bGUiLCJzdHlsZSIsImVkaXRhYmxlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImJvdHRvbU1hcFN0eWxlIiwiaGFzVG9wTGF5ZXIiLCJ2YWx1ZXMiLCJzb21lIiwidiIsInRvcExheWVycyIsImtleSIsInRvcE1hcFN0eWxlIiwiZmluZExheWVyRmlsbENvbG9yIiwibGF5ZXIiLCJwYWludCIsImdldDNEQnVpbGRpbmdDb2xvciIsImJhY2tncm91bmRMYXllciIsImxheWVycyIsImZpbmQiLCJidWlsZGluZ0xheWVyIiwibWF0Y2giLCJidWlsZGluZ0NvbG9yIiwib3BlcmF0aW9uIiwiYWxwaGEiLCJyZ2JPYmoiLCJyIiwiZyIsImIiLCJnZXRMYXllckdyb3Vwc0Zyb21TdHlsZSIsIkFycmF5IiwiaXNBcnJheSIsIkRFRkFVTFRfTEFZRVJfR1JPVVBTIiwiZmlsdGVyIiwibGciLCJpbml0TWFwU3R5bGVVcGRhdGVyIiwic3RhdGUiLCJwYXlsb2FkIiwibWFwQ29uZmlnQ2hhbmdlVXBkYXRlciIsImFjdGlvbiIsIm1hcFN0eWxlQ2hhbmdlVXBkYXRlciIsImRlZmF1bHRMR1Zpc2liaWxpdHkiLCJsb2FkTWFwU3R5bGVzVXBkYXRlciIsIm5ld1N0eWxlcyIsImFkZExheWVyR3JvdXBzIiwibGF5ZXJHcm91cHMiLCJuZXdTdGF0ZSIsImxvYWRNYXBTdHlsZUVyclVwZGF0ZXIiLCJyZXF1ZXN0TWFwU3R5bGVzVXBkYXRlciIsImxvYWRNYXBTdHlsZVRhc2tzIiwiZ2V0TG9hZE1hcFN0eWxlVGFza3MiLCJyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciIsImNvbmZpZyIsIm1lcmdlZCIsIkJvb2xlYW4iLCJUYXNrIiwiYWxsIiwibWFwIiwidXJsIiwiYWNjZXNzVG9rZW4iLCJMT0FEX01BUF9TVFlMRV9UQVNLIiwiYmltYXAiLCJyZXN1bHRzIiwibG9hZE1hcFN0eWxlRXJyIiwicmVzZXRNYXBDb25maWdNYXBTdHlsZVVwZGF0ZXIiLCJlbXB0eUNvbmZpZyIsImluaXRpYWxTdGF0ZSIsImxvYWRDdXN0b21NYXBTdHlsZVVwZGF0ZXIiLCJpY29uIiwiZXJyb3IiLCJsYWJlbCIsIm5hbWUiLCJ1bmRlZmluZWQiLCJpbnB1dE1hcFN0eWxlVXBkYXRlciIsIm1hcFN0YXRlIiwidXBkYXRlZCIsImlzVmFsaWQiLCJzdHlsZVVybCIsImFkZEN1c3RvbU1hcFN0eWxlVXBkYXRlciIsInN0eWxlSWQiLCJzZXQzZEJ1aWxkaW5nQ29sb3JVcGRhdGVyIiwiY29sb3IiLCJjdXN0b20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTs7QUFDQTs7QUFHQTs7QUFTQTs7QUFLQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsU0FBM0I7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixHQUFNO0FBQzVCLE1BQU1DLGtCQUFrQixHQUFHLEVBQTNCO0FBQ0EsTUFBTUMsU0FBUyxHQUFHLE1BQWxCO0FBQ0EsTUFB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QUFBQSxHQUFHLEVBQUUsSUFOQTtBQU9MVSxJQUFBQSxJQUFJLEVBQUUsSUFQRDtBQVFMYyxJQUFBQSxNQUFNLEVBQUU7QUFSSCxHQUFQO0FBVUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBAdHMtbm9jaGVja1xuaW1wb3J0IFRhc2ssIHt3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbS90YXNrcyc7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdExheWVyR3JvdXBWaXNpYmlsaXR5LFxuICBpc1ZhbGlkU3R5bGVVcmwsXG4gIGdldFN0eWxlRG93bmxvYWRVcmwsXG4gIG1lcmdlTGF5ZXJHcm91cFZpc2liaWxpdHksXG4gIGVkaXRUb3BNYXBTdHlsZSxcbiAgZWRpdEJvdHRvbU1hcFN0eWxlLFxuICBnZXRTdHlsZUltYWdlSWNvblxufSBmcm9tICd1dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LWdsLXN0eWxlLWVkaXRvcic7XG5pbXBvcnQge1xuICBERUZBVUxUX01BUF9TVFlMRVMsXG4gIERFRkFVTFRfTEFZRVJfR1JPVVBTLFxuICBERUZBVUxUX01BUEJPWF9BUElfVVJMXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7TE9BRF9NQVBfU1RZTEVfVEFTS30gZnJvbSAndGFza3MvdGFza3MnO1xuaW1wb3J0IHtsb2FkTWFwU3R5bGVzLCBsb2FkTWFwU3R5bGVFcnJ9IGZyb20gJ2FjdGlvbnMvbWFwLXN0eWxlLWFjdGlvbnMnO1xuaW1wb3J0IHtyZ2J9IGZyb20gJ2QzLWNvbG9yJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcblxuY29uc3QgREVGQVVMVF9CTERHX0NPTE9SID0gJyNEMUNFQzcnO1xuXG4vKipcbiAqIEByZXR1cm4ge2ltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5NYXBTdHlsZX1cbiAqL1xuY29uc3QgZ2V0RGVmYXVsdFN0YXRlID0gKCkgPT4ge1xuICBjb25zdCB2aXNpYmxlTGF5ZXJHcm91cHMgPSB7fTtcbiAgY29uc3Qgc3R5bGVUeXBlID0gJ2RhcmsnO1xuICBjb25zdCB0b3BMYXllckdyb3VwcyA9IHt9O1xuXG4gIHJldHVybiB7XG4gICAgc3R5bGVUeXBlLFxuICAgIHZpc2libGVMYXllckdyb3VwcyxcbiAgICB0b3BMYXllckdyb3VwcyxcbiAgICBtYXBTdHlsZXM6IERFRkFVTFRfTUFQX1NUWUxFUy5yZWR1Y2UoXG4gICAgICAoYWNjdSwgY3VycikgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2N1cnIuaWRdOiBjdXJyXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKSxcbiAgICAvLyBzYXZlIG1hcGJveCBhY2Nlc3MgdG9rZW5cbiAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogbnVsbCxcbiAgICBtYXBib3hBcGlVcmw6IERFRkFVTFRfTUFQQk9YX0FQSV9VUkwsXG4gICAgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQ6IGZhbHNlLFxuICAgIGlucHV0U3R5bGU6IGdldEluaXRpYWxJbnB1dFN0eWxlKCksXG4gICAgdGhyZWVEQnVpbGRpbmdDb2xvcjogaGV4VG9SZ2IoREVGQVVMVF9CTERHX0NPTE9SKSxcbiAgICBjdXN0b20zREJ1aWxkaW5nQ29sb3I6IGZhbHNlXG4gIH07XG59O1xuXG4vKipcbiAqIFVwZGF0ZXJzIGZvciBgbWFwU3R5bGVgLiBDYW4gYmUgdXNlZCBpbiB5b3VyIHJvb3QgcmVkdWNlciB0byBkaXJlY3RseSBtb2RpZnkga2VwbGVyLmdsJ3Mgc3RhdGUuXG4gKiBSZWFkIG1vcmUgYWJvdXQgW1VzaW5nIHVwZGF0ZXJzXSguLi9hZHZhbmNlZC11c2FnZS91c2luZy11cGRhdGVycy5tZClcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogaW1wb3J0IGtlcGxlckdsUmVkdWNlciwge21hcFN0eWxlVXBkYXRlcnN9IGZyb20gJ2tlcGxlci5nbC9yZWR1Y2Vycyc7XG4gKiAvLyBSb290IFJlZHVjZXJcbiAqIGNvbnN0IHJlZHVjZXJzID0gY29tYmluZVJlZHVjZXJzKHtcbiAqICBrZXBsZXJHbDoga2VwbGVyR2xSZWR1Y2VyLFxuICogIGFwcDogYXBwUmVkdWNlclxuICogfSk7XG4gKlxuICogY29uc3QgY29tcG9zZWRSZWR1Y2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAqICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gKiAgICAvLyBjbGljayBidXR0b24gdG8gaGlkZSBsYWJlbCBmcm9tIGJhY2tncm91bmQgbWFwXG4gKiAgICBjYXNlICdDTElDS19CVVRUT04nOlxuICogICAgICByZXR1cm4ge1xuICogICAgICAgIC4uLnN0YXRlLFxuICogICAgICAgIGtlcGxlckdsOiB7XG4gKiAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbCxcbiAqICAgICAgICAgIGZvbzoge1xuICogICAgICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wuZm9vLFxuICogICAgICAgICAgICAgbWFwU3R5bGU6IG1hcFN0eWxlVXBkYXRlcnMubWFwQ29uZmlnQ2hhbmdlVXBkYXRlcihcbiAqICAgICAgICAgICAgICAgbWFwU3R5bGUsXG4gKiAgICAgICAgICAgICAgIHtwYXlsb2FkOiB7dmlzaWJsZUxheWVyR3JvdXBzOiB7bGFiZWw6IGZhbHNlLCByb2FkOiB0cnVlLCBiYWNrZ3JvdW5kOiB0cnVlfX19XG4gKiAgICAgICAgICAgICApXG4gKiAgICAgICAgICB9XG4gKiAgICAgICAgfVxuICogICAgICB9O1xuICogIH1cbiAqICByZXR1cm4gcmVkdWNlcnMoc3RhdGUsIGFjdGlvbik7XG4gKiB9O1xuICpcbiAqIGV4cG9ydCBkZWZhdWx0IGNvbXBvc2VkUmVkdWNlcjtcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmNvbnN0IG1hcFN0eWxlVXBkYXRlcnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLyoqXG4gKiBEZWZhdWx0IGluaXRpYWwgYG1hcFN0eWxlYFxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHN0eWxlVHlwZSAtIERlZmF1bHQ6IGAnZGFyaydgXG4gKiBAcHJvcGVydHkgdmlzaWJsZUxheWVyR3JvdXBzIC0gRGVmYXVsdDogYHt9YFxuICogQHByb3BlcnR5IHRvcExheWVyR3JvdXBzIC0gRGVmYXVsdDogYHt9YFxuICogQHByb3BlcnR5IG1hcFN0eWxlcyAtIG1hcHBpbmcgZnJvbSBzdHlsZSBrZXkgdG8gc3R5bGUgb2JqZWN0XG4gKiBAcHJvcGVydHkgbWFwYm94QXBpQWNjZXNzVG9rZW4gLSBEZWZhdWx0OiBgbnVsbGBcbiAqIEBQcm9wZXJ0eSBtYXBib3hBcGlVcmwgLSBEZWZhdWx0IG51bGxcbiAqIEBQcm9wZXJ0eSBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCAtIERlZmF1bHQ6IGBmYWxzZWBcbiAqIEBwcm9wZXJ0eSBpbnB1dFN0eWxlIC0gRGVmYXVsdDogYHt9YFxuICogQHByb3BlcnR5IHRocmVlREJ1aWxkaW5nQ29sb3IgLSBEZWZhdWx0OiBgW3IsIGcsIGJdYFxuICogQHR5cGUge2ltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5NYXBTdHlsZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IElOSVRJQUxfTUFQX1NUWUxFID0gZ2V0RGVmYXVsdFN0YXRlKCk7XG5cbi8qKlxuICogQ3JlYXRlIHR3byBtYXAgc3R5bGVzIGZyb20gcHJlc2V0IG1hcCBzdHlsZSwgb25lIGZvciB0b3AgbWFwIG9uZSBmb3IgYm90dG9tXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlVHlwZSAtIGN1cnJlbnQgbWFwIHN0eWxlXG4gKiBAcGFyYW0ge09iamVjdH0gdmlzaWJsZUxheWVyR3JvdXBzIC0gdmlzaWJsZSBsYXllcnMgb2YgYm90dG9tIG1hcFxuICogQHBhcmFtIHtPYmplY3R9IHRvcExheWVyR3JvdXBzIC0gdmlzaWJsZSBsYXllcnMgb2YgdG9wIG1hcFxuICogQHBhcmFtIHtPYmplY3R9IG1hcFN0eWxlcyAtIGEgZGljdGlvbmFyeSBvZiBhbGwgbWFwIHN0eWxlc1xuICogQHJldHVybnMge09iamVjdH0gYm90dG9tTWFwU3R5bGUgfCB0b3BNYXBTdHlsZSB8IGlzUmFzdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXBTdHlsZXMoe3N0eWxlVHlwZSwgdmlzaWJsZUxheWVyR3JvdXBzLCB0b3BMYXllckdyb3VwcywgbWFwU3R5bGVzfSkge1xuICBjb25zdCBtYXBTdHlsZSA9IG1hcFN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIC8vIHN0eWxlIG1pZ2h0IG5vdCBiZSBsb2FkZWQgeWV0XG4gIGlmICghbWFwU3R5bGUgfHwgIW1hcFN0eWxlLnN0eWxlKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgZWRpdGFibGUgPSBPYmplY3Qua2V5cyh2aXNpYmxlTGF5ZXJHcm91cHMpLmxlbmd0aDtcblxuICBjb25zdCBib3R0b21NYXBTdHlsZSA9ICFlZGl0YWJsZVxuICAgID8gbWFwU3R5bGUuc3R5bGVcbiAgICA6IGVkaXRCb3R0b21NYXBTdHlsZSh7XG4gICAgICAgIGlkOiBzdHlsZVR5cGUsXG4gICAgICAgIG1hcFN0eWxlLFxuICAgICAgICB2aXNpYmxlTGF5ZXJHcm91cHNcbiAgICAgIH0pO1xuXG4gIGNvbnN0IGhhc1RvcExheWVyID0gZWRpdGFibGUgJiYgT2JqZWN0LnZhbHVlcyh0b3BMYXllckdyb3Vwcykuc29tZSh2ID0+IHYpO1xuXG4gIC8vIG11dGUgdG9wIGxheWVyIGlmIG5vdCB2aXNpYmxlIGluIGJvdHRvbSBsYXllclxuICBjb25zdCB0b3BMYXllcnMgPVxuICAgIGhhc1RvcExheWVyICYmXG4gICAgT2JqZWN0LmtleXModG9wTGF5ZXJHcm91cHMpLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB0b3BMYXllckdyb3Vwc1trZXldICYmIHZpc2libGVMYXllckdyb3Vwc1trZXldXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICBjb25zdCB0b3BNYXBTdHlsZSA9IGhhc1RvcExheWVyXG4gICAgPyBlZGl0VG9wTWFwU3R5bGUoe1xuICAgICAgICBpZDogc3R5bGVUeXBlLFxuICAgICAgICBtYXBTdHlsZSxcbiAgICAgICAgdmlzaWJsZUxheWVyR3JvdXBzOiB0b3BMYXllcnNcbiAgICAgIH0pXG4gICAgOiBudWxsO1xuXG4gIHJldHVybiB7Ym90dG9tTWFwU3R5bGUsIHRvcE1hcFN0eWxlLCBlZGl0YWJsZX07XG59XG5cbmZ1bmN0aW9uIGZpbmRMYXllckZpbGxDb2xvcihsYXllcikge1xuICByZXR1cm4gbGF5ZXIgJiYgbGF5ZXIucGFpbnQgJiYgbGF5ZXIucGFpbnRbJ2JhY2tncm91bmQtY29sb3InXTtcbn1cblxuZnVuY3Rpb24gZ2V0M0RCdWlsZGluZ0NvbG9yKHN0eWxlKSB7XG4gIC8vIHNldCBidWlsZGluZyBjb2xvciB0byBiZSB0aGUgc2FtZSBhcyB0aGUgYmFja2dyb3VuZCBjb2xvci5cbiAgaWYgKCFzdHlsZS5zdHlsZSkge1xuICAgIHJldHVybiBoZXhUb1JnYihERUZBVUxUX0JMREdfQ09MT1IpO1xuICB9XG5cbiAgY29uc3QgYmFja2dyb3VuZExheWVyID0gKHN0eWxlLnN0eWxlLmxheWVycyB8fCBbXSkuZmluZCgoe2lkfSkgPT4gaWQgPT09ICdiYWNrZ3JvdW5kJyk7XG5cbiAgY29uc3QgYnVpbGRpbmdMYXllciA9IChzdHlsZS5zdHlsZS5sYXllcnMgfHwgW10pLmZpbmQoKHtpZH0pID0+IGlkLm1hdGNoKC9idWlsZGluZy8pKTtcblxuICBjb25zdCBidWlsZGluZ0NvbG9yID1cbiAgICBmaW5kTGF5ZXJGaWxsQ29sb3IoYnVpbGRpbmdMYXllcikgfHwgZmluZExheWVyRmlsbENvbG9yKGJhY2tncm91bmRMYXllcikgfHwgREVGQVVMVF9CTERHX0NPTE9SO1xuXG4gIC8vIGJyaWdodGVuIG9yIGRhcmtlbiBidWlsZGluZyBiYXNlZCBvbiBzdHlsZVxuICBjb25zdCBvcGVyYXRpb24gPSBzdHlsZS5pZC5tYXRjaCgvKD89KGRhcmt8bmlnaHQpKS8pID8gJ2JyaWdodGVyJyA6ICdkYXJrZXInO1xuXG4gIGNvbnN0IGFscGhhID0gMC4yO1xuICBjb25zdCByZ2JPYmogPSByZ2IoYnVpbGRpbmdDb2xvcilbb3BlcmF0aW9uXShbYWxwaGFdKTtcbiAgcmV0dXJuIFtyZ2JPYmouciwgcmdiT2JqLmcsIHJnYk9iai5iXTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF5ZXJHcm91cHNGcm9tU3R5bGUoc3R5bGUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc3R5bGUubGF5ZXJzKVxuICAgID8gREVGQVVMVF9MQVlFUl9HUk9VUFMuZmlsdGVyKGxnID0+IHN0eWxlLmxheWVycy5maWx0ZXIobGcuZmlsdGVyKS5sZW5ndGgpXG4gICAgOiBbXTtcbn1cblxuLy8gVXBkYXRlcnNcbi8qKlxuICogUHJvcGFnYXRlIGBtYXBTdHlsZWAgcmVkdWNlciB3aXRoIGBtYXBib3hBcGlBY2Nlc3NUb2tlbmAgYW5kIGBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdGAuXG4gKiBpZiBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCBpcyB0cnVlIG1hcFN0eWxlcyBpcyBlbXB0aWVkOyBsb2FkTWFwU3R5bGVzVXBkYXRlcigpIHdpbGxcbiAqIHBvcHVsYXRlIG1hcFN0eWxlcy5cbiAqXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykuaW5pdE1hcFN0eWxlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGluaXRNYXBTdHlsZVVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkID0ge319KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgLy8gc2F2ZSBtYXBib3ggYWNjZXNzIHRva2VuIHRvIG1hcCBzdHlsZSBzdGF0ZVxuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogcGF5bG9hZC5tYXBib3hBcGlBY2Nlc3NUb2tlbiB8fCBzdGF0ZS5tYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgbWFwYm94QXBpVXJsOiBwYXlsb2FkLm1hcGJveEFwaVVybCB8fCBzdGF0ZS5tYXBib3hBcGlVcmwsXG4gIG1hcFN0eWxlczogIXBheWxvYWQubWFwU3R5bGVzUmVwbGFjZURlZmF1bHQgPyBzdGF0ZS5tYXBTdHlsZXMgOiB7fSxcbiAgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQ6IHBheWxvYWQubWFwU3R5bGVzUmVwbGFjZURlZmF1bHQgfHwgZmFsc2Vcbn0pO1xuLy8gfSk7XG5cbi8qKlxuICogVXBkYXRlIGB2aXNpYmxlTGF5ZXJHcm91cHNgdG8gY2hhbmdlIGxheWVyIGdyb3VwIHZpc2liaWxpdHlcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5tYXBDb25maWdDaGFuZ2VVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbWFwQ29uZmlnQ2hhbmdlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgLi4uYWN0aW9uLnBheWxvYWQsXG4gIC4uLmdldE1hcFN0eWxlcyh7XG4gICAgLi4uc3RhdGUsXG4gICAgLi4uYWN0aW9uLnBheWxvYWRcbiAgfSlcbn0pO1xuXG4vKipcbiAqIENoYW5nZSB0byBhbm90aGVyIG1hcCBzdHlsZS4gVGhlIHNlbGVjdGVkIHN0eWxlIHNob3VsZCBhbHJlYWR5IGJlZW4gbG9hZGVkIGludG8gYG1hcFN0eWxlLm1hcFN0eWxlc2BcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5tYXBTdHlsZUNoYW5nZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBtYXBTdHlsZUNoYW5nZVVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBzdHlsZVR5cGV9KSA9PiB7XG4gIGlmICghc3RhdGUubWFwU3R5bGVzW3N0eWxlVHlwZV0pIHtcbiAgICAvLyB3ZSBtaWdodCBub3QgaGF2ZSByZWNlaXZlZCB0aGUgc3R5bGUgeWV0XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IGRlZmF1bHRMR1Zpc2liaWxpdHkgPSBnZXREZWZhdWx0TGF5ZXJHcm91cFZpc2liaWxpdHkoc3RhdGUubWFwU3R5bGVzW3N0eWxlVHlwZV0pO1xuXG4gIGNvbnN0IHZpc2libGVMYXllckdyb3VwcyA9IG1lcmdlTGF5ZXJHcm91cFZpc2liaWxpdHkoXG4gICAgZGVmYXVsdExHVmlzaWJpbGl0eSxcbiAgICBzdGF0ZS52aXNpYmxlTGF5ZXJHcm91cHNcbiAgKTtcblxuICBjb25zdCB0aHJlZURCdWlsZGluZ0NvbG9yID0gc3RhdGUuY3VzdG9tM0RCdWlsZGluZ0NvbG9yXG4gICAgPyBzdGF0ZS50aHJlZURCdWlsZGluZ0NvbG9yXG4gICAgOiBnZXQzREJ1aWxkaW5nQ29sb3Ioc3RhdGUubWFwU3R5bGVzW3N0eWxlVHlwZV0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3R5bGVUeXBlLFxuICAgIHZpc2libGVMYXllckdyb3VwcyxcbiAgICB0aHJlZURCdWlsZGluZ0NvbG9yLFxuICAgIC4uLmdldE1hcFN0eWxlcyh7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHZpc2libGVMYXllckdyb3VwcyxcbiAgICAgIHN0eWxlVHlwZVxuICAgIH0pXG4gIH07XG59O1xuXG4vKipcbiAqIENhbGxiYWNrIHdoZW4gbG9hZCBtYXAgc3R5bGUgc3VjY2Vzc1xuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLmxvYWRNYXBTdHlsZXNVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZE1hcFN0eWxlc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBuZXdTdHlsZXMgPSBhY3Rpb24ucGF5bG9hZCB8fCB7fTtcbiAgY29uc3QgYWRkTGF5ZXJHcm91cHMgPSBPYmplY3Qua2V5cyhuZXdTdHlsZXMpLnJlZHVjZShcbiAgICAoYWNjdSwgaWQpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgW2lkXToge1xuICAgICAgICAuLi5uZXdTdHlsZXNbaWRdLFxuICAgICAgICBsYXllckdyb3VwczogbmV3U3R5bGVzW2lkXS5sYXllckdyb3VwcyB8fCBnZXRMYXllckdyb3Vwc0Zyb21TdHlsZShuZXdTdHlsZXNbaWRdLnN0eWxlKVxuICAgICAgfVxuICAgIH0pLFxuICAgIHt9XG4gICk7XG5cbiAgLy8gYWRkIG5ldyBzdHlsZXMgdG8gc3RhdGVcbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbWFwU3R5bGVzOiB7XG4gICAgICAuLi5zdGF0ZS5tYXBTdHlsZXMsXG4gICAgICAuLi5hZGRMYXllckdyb3Vwc1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbmV3U3R5bGVzW3N0YXRlLnN0eWxlVHlwZV1cbiAgICA/IG1hcFN0eWxlQ2hhbmdlVXBkYXRlcihuZXdTdGF0ZSwge3BheWxvYWQ6IHN0YXRlLnN0eWxlVHlwZX0pXG4gICAgOiBuZXdTdGF0ZTtcbn07XG5cbi8qKlxuICogQ2FsbGJhY2sgd2hlbiBsb2FkIG1hcCBzdHlsZSBlcnJvclxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLmxvYWRNYXBTdHlsZUVyclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbi8vIGRvIG5vdGhpbmcgZm9yIG5vdywgaWYgZGlkbid0IGxvYWQsIHNraXAgaXRcbmV4cG9ydCBjb25zdCBsb2FkTWFwU3R5bGVFcnJVcGRhdGVyID0gc3RhdGUgPT4gc3RhdGU7XG5cbi8qKlxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLnJlcXVlc3RNYXBTdHlsZXNVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVxdWVzdE1hcFN0eWxlc1VwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBtYXBTdHlsZXN9KSA9PiB7XG4gIGNvbnN0IGxvYWRNYXBTdHlsZVRhc2tzID0gZ2V0TG9hZE1hcFN0eWxlVGFza3MoXG4gICAgbWFwU3R5bGVzLFxuICAgIHN0YXRlLm1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgIHN0YXRlLm1hcGJveEFwaVVybFxuICApO1xuICByZXR1cm4gd2l0aFRhc2soc3RhdGUsIGxvYWRNYXBTdHlsZVRhc2tzKTtcbn07XG5cbi8qKlxuICogTG9hZCBtYXAgc3R5bGUgb2JqZWN0IHdoZW4gcGFzcyBpbiBzYXZlZCBtYXAgY29uZmlnXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGBtYXBTdHlsZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBzYXZlZCBtYXAgY29uZmlnIGB7bWFwU3R5bGUsIHZpc1N0YXRlLCBtYXBTdGF0ZX1gXG4gKiBAcmV0dXJucyBuZXh0U3RhdGUgb3IgYHJlYWN0LXBhbWAgdGFza3MgdG8gbG9hZCBtYXAgc3R5bGUgb2JqZWN0XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5yZWNlaXZlTWFwQ29uZmlnVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDoge2NvbmZpZyA9IHt9fX0pID0+IHtcbiAgY29uc3Qge21hcFN0eWxlfSA9IGNvbmZpZyB8fCB7fTtcblxuICBpZiAoIW1hcFN0eWxlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gaWYgc2F2ZWQgY3VzdG9tIG1hcFN0eWxlcyBsb2FkIHRoZSBzdHlsZSBvYmplY3RcbiAgY29uc3QgbG9hZE1hcFN0eWxlVGFza3MgPSBtYXBTdHlsZS5tYXBTdHlsZXNcbiAgICA/IGdldExvYWRNYXBTdHlsZVRhc2tzKG1hcFN0eWxlLm1hcFN0eWxlcywgc3RhdGUubWFwYm94QXBpQWNjZXNzVG9rZW4sIHN0YXRlLm1hcGJveEFwaVVybClcbiAgICA6IG51bGw7XG5cbiAgLy8gbWVyZ2UgZGVmYXVsdCBtYXBTdHlsZXNcbiAgY29uc3QgbWVyZ2VkID0gbWFwU3R5bGUubWFwU3R5bGVzXG4gICAgPyB7XG4gICAgICAgIC4uLm1hcFN0eWxlLFxuICAgICAgICBtYXBTdHlsZXM6IHtcbiAgICAgICAgICAuLi5tYXBTdHlsZS5tYXBTdHlsZXMsXG4gICAgICAgICAgLi4uc3RhdGUubWFwU3R5bGVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA6IG1hcFN0eWxlO1xuXG4gIC8vIHNldCBjdXN0b20zREJ1aWxkaW5nQ29sb3I6IHRydWUgaWYgbWFwU3R5bGUgY29udGFpbnMgdGhyZWVEQnVpbGRpbmdDb2xvclxuICBtZXJnZWQuY3VzdG9tM0RCdWlsZGluZ0NvbG9yID1cbiAgICBCb29sZWFuKG1hcFN0eWxlLnRocmVlREJ1aWxkaW5nQ29sb3IpIHx8IG1lcmdlZC5jdXN0b20zREJ1aWxkaW5nQ29sb3I7XG4gIGNvbnN0IG5ld1N0YXRlID0gbWFwQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwge3BheWxvYWQ6IG1lcmdlZH0pO1xuXG4gIHJldHVybiBsb2FkTWFwU3R5bGVUYXNrcyA/IHdpdGhUYXNrKG5ld1N0YXRlLCBsb2FkTWFwU3R5bGVUYXNrcykgOiBuZXdTdGF0ZTtcbn07XG5cbmZ1bmN0aW9uIGdldExvYWRNYXBTdHlsZVRhc2tzKG1hcFN0eWxlcywgbWFwYm94QXBpQWNjZXNzVG9rZW4sIG1hcGJveEFwaVVybCkge1xuICByZXR1cm4gW1xuICAgIFRhc2suYWxsKFxuICAgICAgT2JqZWN0LnZhbHVlcyhtYXBTdHlsZXMpXG4gICAgICAgIC5tYXAoKHtpZCwgdXJsLCBhY2Nlc3NUb2tlbn0pID0+ICh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgdXJsOiBpc1ZhbGlkU3R5bGVVcmwodXJsKVxuICAgICAgICAgICAgPyBnZXRTdHlsZURvd25sb2FkVXJsKHVybCwgYWNjZXNzVG9rZW4gfHwgbWFwYm94QXBpQWNjZXNzVG9rZW4sIG1hcGJveEFwaVVybClcbiAgICAgICAgICAgIDogdXJsXG4gICAgICAgIH0pKVxuICAgICAgICAubWFwKExPQURfTUFQX1NUWUxFX1RBU0spXG4gICAgKS5iaW1hcChcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIHJlc3VsdHMgPT5cbiAgICAgICAgbG9hZE1hcFN0eWxlcyhcbiAgICAgICAgICByZXN1bHRzLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCB7aWQsIHN0eWxlfSkgPT4gKHtcbiAgICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgICAgW2lkXToge1xuICAgICAgICAgICAgICAgIC4uLm1hcFN0eWxlc1tpZF0sXG4gICAgICAgICAgICAgICAgc3R5bGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgIC8vIGVycm9yXG4gICAgICBsb2FkTWFwU3R5bGVFcnJcbiAgICApXG4gIF07XG59XG4vKipcbiAqIFJlc2V0IG1hcCBzdHlsZSBjb25maWcgdG8gaW5pdGlhbCBzdGF0ZVxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgbWFwU3R5bGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLnJlc2V0TWFwQ29uZmlnTWFwU3R5bGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVzZXRNYXBDb25maWdNYXBTdHlsZVVwZGF0ZXIgPSBzdGF0ZSA9PiB7XG4gIGNvbnN0IGVtcHR5Q29uZmlnID0ge1xuICAgIC4uLklOSVRJQUxfTUFQX1NUWUxFLFxuICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBzdGF0ZS5tYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICBtYXBib3hBcGlVcmw6IHN0YXRlLm1hcGJveEFwaVVybCxcbiAgICBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdDogc3RhdGUubWFwU3R5bGVzUmVwbGFjZURlZmF1bHQsXG4gICAgLi4uc3RhdGUuaW5pdGlhbFN0YXRlLFxuICAgIG1hcFN0eWxlczogc3RhdGUubWFwU3R5bGVzLFxuICAgIGluaXRpYWxTdGF0ZTogc3RhdGUuaW5pdGlhbFN0YXRlXG4gIH07XG5cbiAgcmV0dXJuIG1hcFN0eWxlQ2hhbmdlVXBkYXRlcihlbXB0eUNvbmZpZywge3BheWxvYWQ6IGVtcHR5Q29uZmlnLnN0eWxlVHlwZX0pO1xufTtcblxuLyoqXG4gKiBDYWxsYmFjayB3aGVuIGEgY3VzdG9tIG1hcCBzdHlsZSBvYmplY3QgaXMgcmVjZWl2ZWRcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtdXBkYXRlcnMnKS5sb2FkQ3VzdG9tTWFwU3R5bGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZEN1c3RvbU1hcFN0eWxlVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHtpY29uLCBzdHlsZSwgZXJyb3J9fSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGlucHV0U3R5bGU6IHtcbiAgICAuLi5zdGF0ZS5pbnB1dFN0eWxlLFxuICAgIC8vIHN0eWxlIGpzb24gYW5kIGljb24gd2lsbCBsb2FkIGFzeW5jaHJvbm91c2x5XG4gICAgLi4uKHN0eWxlXG4gICAgICA/IHtcbiAgICAgICAgICBpZDogc3R5bGUuaWQgfHwgZ2VuZXJhdGVIYXNoSWQoKSxcbiAgICAgICAgICAvLyBtYWtlIGEgY29weSBvZiB0aGUgc3R5bGUgb2JqZWN0XG4gICAgICAgICAgc3R5bGU6IGNsb25lRGVlcChzdHlsZSksXG4gICAgICAgICAgbGFiZWw6IHN0eWxlLm5hbWUsXG4gICAgICAgICAgLy8gZ2F0aGVyaW5nIGxheWVyIGdyb3VwIGluZm8gZnJvbSBzdHlsZSBqc29uXG4gICAgICAgICAgbGF5ZXJHcm91cHM6IGdldExheWVyR3JvdXBzRnJvbVN0eWxlKHN0eWxlKVxuICAgICAgICB9XG4gICAgICA6IHt9KSxcbiAgICAuLi4oaWNvbiA/IHtpY29ufSA6IHt9KSxcbiAgICAuLi4oZXJyb3IgIT09IHVuZGVmaW5lZCA/IHtlcnJvcn0gOiB7fSlcbiAgfVxufSk7XG5cbi8qKlxuICogSW5wdXQgYSBjdXN0b20gbWFwIHN0eWxlIG9iamVjdFxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLmlucHV0TWFwU3R5bGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgaW5wdXRNYXBTdHlsZVVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiB7aW5wdXRTdHlsZSwgbWFwU3RhdGV9fSkgPT4ge1xuICBjb25zdCB1cGRhdGVkID0ge1xuICAgIC4uLnN0YXRlLmlucHV0U3R5bGUsXG4gICAgLi4uaW5wdXRTdHlsZVxuICB9O1xuXG4gIGNvbnN0IGlzVmFsaWQgPSBpc1ZhbGlkU3R5bGVVcmwodXBkYXRlZC51cmwpO1xuICBjb25zdCBpY29uID0gaXNWYWxpZFxuICAgID8gZ2V0U3R5bGVJbWFnZUljb24oe1xuICAgICAgICBtYXBTdGF0ZSxcbiAgICAgICAgc3R5bGVVcmw6IHVwZGF0ZWQudXJsLFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogdXBkYXRlZC5hY2Nlc3NUb2tlbiB8fCBzdGF0ZS5tYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgbWFwYm94QXBpVXJsOiBzdGF0ZS5tYXBib3hBcGlVcmwgfHwgREVGQVVMVF9NQVBCT1hfQVBJX1VSTFxuICAgICAgfSlcbiAgICA6IHN0YXRlLmlucHV0U3R5bGUuaWNvbjtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGlucHV0U3R5bGU6IHtcbiAgICAgIC4uLnVwZGF0ZWQsXG4gICAgICBpc1ZhbGlkLFxuICAgICAgaWNvblxuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogQWRkIG1hcCBzdHlsZSBmcm9tIHVzZXIgaW5wdXQgdG8gcmVkdWNlciBhbmQgc2V0IGl0IHRvIGN1cnJlbnQgc3R5bGVcbiAqIFRoaXMgYWN0aW9uIGlzIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2sgY29uZmlybSBhZnRlciBwdXR0aW5nIGluIGEgdmFsaWQgc3R5bGUgdXJsIGluIHRoZSBjdXN0b20gbWFwIHN0eWxlIGRpYWxvZy5cbiAqIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIGZyb20gb3V0c2lkZSBrZXBsZXIuZ2wgd2l0aG91dCBhIHZhbGlkIGBpbnB1dFN0eWxlYCBpbiB0aGUgYG1hcFN0eWxlYCByZWR1Y2VyLlxuICogQG1lbWJlcm9mIG1hcFN0eWxlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS11cGRhdGVycycpLmFkZEN1c3RvbU1hcFN0eWxlVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGFkZEN1c3RvbU1hcFN0eWxlVXBkYXRlciA9IHN0YXRlID0+IHtcbiAgY29uc3Qgc3R5bGVJZCA9IHN0YXRlLmlucHV0U3R5bGUuaWQ7XG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIG1hcFN0eWxlczoge1xuICAgICAgLi4uc3RhdGUubWFwU3R5bGVzLFxuICAgICAgW3N0eWxlSWRdOiBzdGF0ZS5pbnB1dFN0eWxlXG4gICAgfSxcbiAgICAvLyBzZXQgdG8gZGVmYXVsdFxuICAgIGlucHV0U3R5bGU6IGdldEluaXRpYWxJbnB1dFN0eWxlKClcbiAgfTtcbiAgLy8gc2V0IG5ldyBzdHlsZVxuICByZXR1cm4gbWFwU3R5bGVDaGFuZ2VVcGRhdGVyKG5ld1N0YXRlLCB7cGF5bG9hZDogc3R5bGVJZH0pO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIDNkIGJ1aWxkaW5nIGNvbG9yXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0eWxlLXVwZGF0ZXJzJykuc2V0M2RCdWlsZGluZ0NvbG9yVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNldDNkQnVpbGRpbmdDb2xvclVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBjb2xvcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICB0aHJlZURCdWlsZGluZ0NvbG9yOiBjb2xvcixcbiAgY3VzdG9tM0RCdWlsZGluZ0NvbG9yOiB0cnVlXG59KTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGluaXRpYWwgaW5wdXQgc3R5bGVcbiAqIEByZXR1cm4gT2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsSW5wdXRTdHlsZSgpIHtcbiAgcmV0dXJuIHtcbiAgICBhY2Nlc3NUb2tlbjogbnVsbCxcbiAgICBlcnJvcjogZmFsc2UsXG4gICAgaXNWYWxpZDogZmFsc2UsXG4gICAgbGFiZWw6IG51bGwsXG4gICAgc3R5bGU6IG51bGwsXG4gICAgdXJsOiBudWxsLFxuICAgIGljb246IG51bGwsXG4gICAgY3VzdG9tOiB0cnVlXG4gIH07XG59XG4iXX0=