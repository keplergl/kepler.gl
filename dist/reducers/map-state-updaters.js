"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMapDimForSplitMap = getMapDimForSplitMap;
exports.toggleSplitMapUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.togglePerspectiveUpdater = exports.fitBoundsUpdater = exports.updateMapUpdater = exports.INITIAL_MAP_STATE = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _projectionUtils = require("../utils/projection-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @typedef {import('./map-state-updaters').MapState} MapState */

/**
 * Updaters for `mapState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {mapStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to close side panel
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             mapState: mapStateUpdaters.fitBoundsUpdater(
 *               mapState, {payload: [127.34, 31.09, 127.56, 31.59]]}
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
// @ts-ignore
var mapStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `mapState`
 * @memberof mapStateUpdaters
 * @constant
 * @property pitch Default: `0`
 * @property bearing Default: `0`
 * @property latitude Default: `37.75043`
 * @property longitude Default: `-122.34679`
 * @property zoom Default: `9`
 * @property dragRotate Default: `false`
 * @property width Default: `800`
 * @property height Default: `800`
 * @property isSplit Default: `false`
 * @type {MapState}
 * @public
 */

var INITIAL_MAP_STATE = {
  pitch: 0,
  bearing: 0,
  latitude: 37.75043,
  longitude: -122.34679,
  zoom: 9,
  dragRotate: false,
  width: 800,
  height: 800,
  isSplit: false
};
/* Updaters */

/**
 * Update map viewport
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').updateMapUpdater}
 * @public
 */

exports.INITIAL_MAP_STATE = INITIAL_MAP_STATE;

var updateMapUpdater = function updateMapUpdater(state, action) {
  return _objectSpread(_objectSpread({}, state), action.payload || {});
};
/**
 * Fit map viewport to bounds
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').fitBoundsUpdater}
 * @public
 */


exports.updateMapUpdater = updateMapUpdater;

var fitBoundsUpdater = function fitBoundsUpdater(state, action) {
  var centerAndZoom = (0, _projectionUtils.getCenterAndZoomFromBounds)(action.payload, {
    width: state.width,
    height: state.height
  });

  if (!centerAndZoom) {
    // bounds is invalid
    return state;
  }

  return _objectSpread(_objectSpread({}, state), {}, {
    latitude: centerAndZoom.center[1],
    longitude: centerAndZoom.center[0]
  }, Number.isFinite(centerAndZoom.zoom) ? {
    zoom: centerAndZoom.zoom
  } : {});
};
/**
 * Toggle between 3d and 2d map.
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').togglePerspectiveUpdater}
 * @public
 */


exports.fitBoundsUpdater = fitBoundsUpdater;

var togglePerspectiveUpdater = function togglePerspectiveUpdater(state) {
  return _objectSpread(_objectSpread(_objectSpread({}, state), {
    pitch: state.dragRotate ? 0 : 50,
    bearing: state.dragRotate ? 0 : 24
  }), {}, {
    dragRotate: !state.dragRotate
  });
};
/**
 * reset mapState to initial State
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').resetMapConfigUpdater}
 * @public
 */


exports.togglePerspectiveUpdater = togglePerspectiveUpdater;

var resetMapConfigUpdater = function resetMapConfigUpdater(state) {
  return _objectSpread(_objectSpread(_objectSpread({}, INITIAL_MAP_STATE), state.initialState), {}, {
    initialState: state.initialState
  });
}; // consider case where you have a split map and user wants to reset

/**
 * Update `mapState` to propagate a new config
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').receiveMapConfigUpdater}
 * @public
 */


exports.resetMapConfigUpdater = resetMapConfigUpdater;

var receiveMapConfigUpdater = function receiveMapConfigUpdater(state, _ref) {
  var _ref$payload = _ref.payload,
      _ref$payload$config = _ref$payload.config,
      config = _ref$payload$config === void 0 ? {} : _ref$payload$config,
      _ref$payload$options = _ref$payload.options,
      options = _ref$payload$options === void 0 ? {} : _ref$payload$options,
      _ref$payload$bounds = _ref$payload.bounds,
      bounds = _ref$payload$bounds === void 0 ? null : _ref$payload$bounds;

  var _ref2 = config || {},
      mapState = _ref2.mapState; // merged received mapstate with previous state


  var mergedState = _objectSpread(_objectSpread({}, state), mapState); // if center map
  // center map will override mapState config


  if (options.centerMap && bounds) {
    mergedState = fitBoundsUpdater(mergedState, {
      payload: bounds
    });
  }

  return _objectSpread(_objectSpread({}, mergedState), getMapDimForSplitMap(mergedState.isSplit, state));
};
/**
 * Toggle between one or split maps
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').toggleSplitMapUpdater}
 * @public
 */


exports.receiveMapConfigUpdater = receiveMapConfigUpdater;

var toggleSplitMapUpdater = function toggleSplitMapUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSplit: !state.isSplit
  }, getMapDimForSplitMap(!state.isSplit, state));
}; // Helpers


exports.toggleSplitMapUpdater = toggleSplitMapUpdater;

function getMapDimForSplitMap(isSplit, state) {
  // cases:
  // 1. state split: true - isSplit: true
  // do nothing
  // 2. state split: false - isSplit: false
  // do nothing
  if (state.isSplit === isSplit) {
    return {};
  }

  var width = state.isSplit && !isSplit ? // 3. state split: true - isSplit: false
  // double width
  state.width * 2 : // 4. state split: false - isSplit: true
  // split width
  state.width / 2;
  return {
    width: width
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9tYXAtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibWFwU3RhdGVVcGRhdGVycyIsIklOSVRJQUxfTUFQX1NUQVRFIiwicGl0Y2giLCJiZWFyaW5nIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwiZHJhZ1JvdGF0ZSIsIndpZHRoIiwiaGVpZ2h0IiwiaXNTcGxpdCIsInVwZGF0ZU1hcFVwZGF0ZXIiLCJzdGF0ZSIsImFjdGlvbiIsInBheWxvYWQiLCJmaXRCb3VuZHNVcGRhdGVyIiwiY2VudGVyQW5kWm9vbSIsImNlbnRlciIsIk51bWJlciIsImlzRmluaXRlIiwidG9nZ2xlUGVyc3BlY3RpdmVVcGRhdGVyIiwicmVzZXRNYXBDb25maWdVcGRhdGVyIiwiaW5pdGlhbFN0YXRlIiwicmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIiLCJjb25maWciLCJvcHRpb25zIiwiYm91bmRzIiwibWFwU3RhdGUiLCJtZXJnZWRTdGF0ZSIsImNlbnRlck1hcCIsImdldE1hcERpbUZvclNwbGl0TWFwIiwidG9nZ2xlU3BsaXRNYXBVcGRhdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7OztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBLElBQU1BLGdCQUFnQixHQUFHLElBQXpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ08sSUFBTUMsaUJBQWlCLEdBQUc7QUFDL0JDLEVBQUFBLEtB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bmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtnZXRDZW50ZXJBbmRab29tRnJvbUJvdW5kc30gZnJvbSAndXRpbHMvcHJvamVjdGlvbi11dGlscyc7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL21hcC1zdGF0ZS11cGRhdGVycycpLk1hcFN0YXRlfSBNYXBTdGF0ZSAqL1xuXG4vKipcbiAqIFVwZGF0ZXJzIGZvciBgbWFwU3RhdGVgIHJlZHVjZXIuIENhbiBiZSB1c2VkIGluIHlvdXIgcm9vdCByZWR1Y2VyIHRvIGRpcmVjdGx5IG1vZGlmeSBrZXBsZXIuZ2wncyBzdGF0ZS5cbiAqIFJlYWQgbW9yZSBhYm91dCBbVXNpbmcgdXBkYXRlcnNdKC4uL2FkdmFuY2VkLXVzYWdlL3VzaW5nLXVwZGF0ZXJzLm1kKVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQga2VwbGVyR2xSZWR1Y2VyLCB7bWFwU3RhdGVVcGRhdGVyc30gZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIC8vIFJvb3QgUmVkdWNlclxuICogY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICogIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKiAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAqICAgIC8vIGNsaWNrIGJ1dHRvbiB0byBjbG9zZSBzaWRlIHBhbmVsXG4gKiAgICBjYXNlICdDTElDS19CVVRUT04nOlxuICogICAgICByZXR1cm4ge1xuICogICAgICAgIC4uLnN0YXRlLFxuICogICAgICAgIGtlcGxlckdsOiB7XG4gKiAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbCxcbiAqICAgICAgICAgIGZvbzoge1xuICogICAgICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wuZm9vLFxuICogICAgICAgICAgICAgbWFwU3RhdGU6IG1hcFN0YXRlVXBkYXRlcnMuZml0Qm91bmRzVXBkYXRlcihcbiAqICAgICAgICAgICAgICAgbWFwU3RhdGUsIHtwYXlsb2FkOiBbMTI3LjM0LCAzMS4wOSwgMTI3LjU2LCAzMS41OV1dfVxuICogICAgICAgICAgICAgKVxuICogICAgICAgICAgfVxuICogICAgICAgIH1cbiAqICAgICAgfTtcbiAqICB9XG4gKiAgcmV0dXJuIHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICogfTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCBtYXBTdGF0ZVVwZGF0ZXJzID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuLyoqXG4gKiBEZWZhdWx0IGluaXRpYWwgYG1hcFN0YXRlYFxuICogQG1lbWJlcm9mIG1hcFN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHBpdGNoIERlZmF1bHQ6IGAwYFxuICogQHByb3BlcnR5IGJlYXJpbmcgRGVmYXVsdDogYDBgXG4gKiBAcHJvcGVydHkgbGF0aXR1ZGUgRGVmYXVsdDogYDM3Ljc1MDQzYFxuICogQHByb3BlcnR5IGxvbmdpdHVkZSBEZWZhdWx0OiBgLTEyMi4zNDY3OWBcbiAqIEBwcm9wZXJ0eSB6b29tIERlZmF1bHQ6IGA5YFxuICogQHByb3BlcnR5IGRyYWdSb3RhdGUgRGVmYXVsdDogYGZhbHNlYFxuICogQHByb3BlcnR5IHdpZHRoIERlZmF1bHQ6IGA4MDBgXG4gKiBAcHJvcGVydHkgaGVpZ2h0IERlZmF1bHQ6IGA4MDBgXG4gKiBAcHJvcGVydHkgaXNTcGxpdCBEZWZhdWx0OiBgZmFsc2VgXG4gKiBAdHlwZSB7TWFwU3RhdGV9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBJTklUSUFMX01BUF9TVEFURSA9IHtcbiAgcGl0Y2g6IDAsXG4gIGJlYXJpbmc6IDAsXG4gIGxhdGl0dWRlOiAzNy43NTA0MyxcbiAgbG9uZ2l0dWRlOiAtMTIyLjM0Njc5LFxuICB6b29tOiA5LFxuICBkcmFnUm90YXRlOiBmYWxzZSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDAsXG4gIGlzU3BsaXQ6IGZhbHNlXG59O1xuXG4vKiBVcGRhdGVycyAqL1xuLyoqXG4gKiBVcGRhdGUgbWFwIHZpZXdwb3J0XG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykudXBkYXRlTWFwVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZU1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIC4uLihhY3Rpb24ucGF5bG9hZCB8fCB7fSlcbn0pO1xuXG4vKipcbiAqIEZpdCBtYXAgdmlld3BvcnQgdG8gYm91bmRzXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykuZml0Qm91bmRzVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGZpdEJvdW5kc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBjZW50ZXJBbmRab29tID0gZ2V0Q2VudGVyQW5kWm9vbUZyb21Cb3VuZHMoYWN0aW9uLnBheWxvYWQsIHtcbiAgICB3aWR0aDogc3RhdGUud2lkdGgsXG4gICAgaGVpZ2h0OiBzdGF0ZS5oZWlnaHRcbiAgfSk7XG4gIGlmICghY2VudGVyQW5kWm9vbSkge1xuICAgIC8vIGJvdW5kcyBpcyBpbnZhbGlkXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXRpdHVkZTogY2VudGVyQW5kWm9vbS5jZW50ZXJbMV0sXG4gICAgbG9uZ2l0dWRlOiBjZW50ZXJBbmRab29tLmNlbnRlclswXSxcbiAgICAvLyBGb3IgbWFyZ2luYWwgb3IgaW52YWxpZCBib3VuZHMsIHpvb20gbWF5IGJlIE5hTi4gTWFrZSBzdXJlIHRvIHByb3ZpZGUgYSB2YWxpZCB2YWx1ZSBpbiBvcmRlclxuICAgIC8vIHRvIGF2b2lkIGNvcnJ1cHQgc3RhdGUgYW5kIHBvdGVudGlhbCBjcmFzaGVzIGFzIHpvb20gaXMgZXhwZWN0ZWQgdG8gYmUgYSBudW1iZXJcbiAgICAuLi4oTnVtYmVyLmlzRmluaXRlKGNlbnRlckFuZFpvb20uem9vbSkgPyB7em9vbTogY2VudGVyQW5kWm9vbS56b29tfSA6IHt9KVxuICB9O1xufTtcblxuLyoqXG4gKiBUb2dnbGUgYmV0d2VlbiAzZCBhbmQgMmQgbWFwLlxuICogQG1lbWJlcm9mIG1hcFN0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZVBlcnNwZWN0aXZlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVBlcnNwZWN0aXZlVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICAuLi57XG4gICAgcGl0Y2g6IHN0YXRlLmRyYWdSb3RhdGUgPyAwIDogNTAsXG4gICAgYmVhcmluZzogc3RhdGUuZHJhZ1JvdGF0ZSA/IDAgOiAyNFxuICB9LFxuICBkcmFnUm90YXRlOiAhc3RhdGUuZHJhZ1JvdGF0ZVxufSk7XG5cbi8qKlxuICogcmVzZXQgbWFwU3RhdGUgdG8gaW5pdGlhbCBTdGF0ZVxuICogQG1lbWJlcm9mIG1hcFN0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdGF0ZS11cGRhdGVycycpLnJlc2V0TWFwQ29uZmlnVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlc2V0TWFwQ29uZmlnVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLklOSVRJQUxfTUFQX1NUQVRFLFxuICAuLi5zdGF0ZS5pbml0aWFsU3RhdGUsXG4gIGluaXRpYWxTdGF0ZTogc3RhdGUuaW5pdGlhbFN0YXRlXG59KTtcblxuLy8gY29uc2lkZXIgY2FzZSB3aGVyZSB5b3UgaGF2ZSBhIHNwbGl0IG1hcCBhbmQgdXNlciB3YW50cyB0byByZXNldFxuLyoqXG4gKiBVcGRhdGUgYG1hcFN0YXRlYCB0byBwcm9wYWdhdGUgYSBuZXcgY29uZmlnXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykucmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlTWFwQ29uZmlnVXBkYXRlciA9IChcbiAgc3RhdGUsXG4gIHtwYXlsb2FkOiB7Y29uZmlnID0ge30sIG9wdGlvbnMgPSB7fSwgYm91bmRzID0gbnVsbH19XG4pID0+IHtcbiAgY29uc3Qge21hcFN0YXRlfSA9IGNvbmZpZyB8fCB7fTtcblxuICAvLyBtZXJnZWQgcmVjZWl2ZWQgbWFwc3RhdGUgd2l0aCBwcmV2aW91cyBzdGF0ZVxuICBsZXQgbWVyZ2VkU3RhdGUgPSB7Li4uc3RhdGUsIC4uLm1hcFN0YXRlfTtcblxuICAvLyBpZiBjZW50ZXIgbWFwXG4gIC8vIGNlbnRlciBtYXAgd2lsbCBvdmVycmlkZSBtYXBTdGF0ZSBjb25maWdcbiAgaWYgKG9wdGlvbnMuY2VudGVyTWFwICYmIGJvdW5kcykge1xuICAgIG1lcmdlZFN0YXRlID0gZml0Qm91bmRzVXBkYXRlcihtZXJnZWRTdGF0ZSwge1xuICAgICAgcGF5bG9hZDogYm91bmRzXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm1lcmdlZFN0YXRlLFxuICAgIC8vIHVwZGF0ZSB3aWR0aCBpZiBgaXNTcGxpdGAgaGFzIGNoYW5nZWRcbiAgICAuLi5nZXRNYXBEaW1Gb3JTcGxpdE1hcChtZXJnZWRTdGF0ZS5pc1NwbGl0LCBzdGF0ZSlcbiAgfTtcbn07XG5cbi8qKlxuICogVG9nZ2xlIGJldHdlZW4gb25lIG9yIHNwbGl0IG1hcHNcbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVTcGxpdE1hcFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVTcGxpdE1hcFVwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaXNTcGxpdDogIXN0YXRlLmlzU3BsaXQsXG4gIC4uLmdldE1hcERpbUZvclNwbGl0TWFwKCFzdGF0ZS5pc1NwbGl0LCBzdGF0ZSlcbn0pO1xuXG4vLyBIZWxwZXJzXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFwRGltRm9yU3BsaXRNYXAoaXNTcGxpdCwgc3RhdGUpIHtcbiAgLy8gY2FzZXM6XG4gIC8vIDEuIHN0YXRlIHNwbGl0OiB0cnVlIC0gaXNTcGxpdDogdHJ1ZVxuICAvLyBkbyBub3RoaW5nXG4gIC8vIDIuIHN0YXRlIHNwbGl0OiBmYWxzZSAtIGlzU3BsaXQ6IGZhbHNlXG4gIC8vIGRvIG5vdGhpbmdcbiAgaWYgKHN0YXRlLmlzU3BsaXQgPT09IGlzU3BsaXQpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCB3aWR0aCA9XG4gICAgc3RhdGUuaXNTcGxpdCAmJiAhaXNTcGxpdFxuICAgICAgPyAvLyAzLiBzdGF0ZSBzcGxpdDogdHJ1ZSAtIGlzU3BsaXQ6IGZhbHNlXG4gICAgICAgIC8vIGRvdWJsZSB3aWR0aFxuICAgICAgICBzdGF0ZS53aWR0aCAqIDJcbiAgICAgIDogLy8gNC4gc3RhdGUgc3BsaXQ6IGZhbHNlIC0gaXNTcGxpdDogdHJ1ZVxuICAgICAgICAvLyBzcGxpdCB3aWR0aFxuICAgICAgICBzdGF0ZS53aWR0aCAvIDI7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aFxuICB9O1xufVxuIl19