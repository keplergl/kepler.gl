"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMapDimForSplitMap = getMapDimForSplitMap;
exports.toggleSplitMapUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.togglePerspectiveUpdater = exports.fitBoundsUpdater = exports.updateMapUpdater = exports.INITIAL_MAP_STATE = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _geoViewport = _interopRequireDefault(require("@mapbox/geo-viewport"));

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
  return _objectSpread({}, state, {}, action.payload || {});
};
/**
 * Fit map viewport to bounds
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').fitBoundsUpdater}
 * @public
 */


exports.updateMapUpdater = updateMapUpdater;

var fitBoundsUpdater = function fitBoundsUpdater(state, action) {
  var bounds = action.payload;

  var _geoViewport$viewport = _geoViewport["default"].viewport(bounds, [state.width, state.height]),
      center = _geoViewport$viewport.center,
      zoom = _geoViewport$viewport.zoom;

  return _objectSpread({}, state, {
    latitude: center[1],
    longitude: center[0],
    zoom: zoom
  });
};
/**
 * Toggle between 3d and 2d map.
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').togglePerspectiveUpdater}
 * @public
 */


exports.fitBoundsUpdater = fitBoundsUpdater;

var togglePerspectiveUpdater = function togglePerspectiveUpdater(state) {
  return _objectSpread({}, state, {}, {
    pitch: state.dragRotate ? 0 : 50,
    bearing: state.dragRotate ? 0 : 24
  }, {
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
  return _objectSpread({}, INITIAL_MAP_STATE, {}, state.initialState, {
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


  var mergedState = _objectSpread({}, state, {}, mapState); // if center map
  // center map will override mapState config


  if (options.centerMap && bounds) {
    mergedState = fitBoundsUpdater(mergedState, {
      payload: bounds
    });
  }

  return _objectSpread({}, mergedState, {}, getMapDimForSplitMap(mergedState.isSplit, state));
};
/**
 * Toggle between one or split maps
 * @memberof mapStateUpdaters
 * @type {typeof import('./map-state-updaters').toggleSplitMapUpdater}
 * @public
 */


exports.receiveMapConfigUpdater = receiveMapConfigUpdater;

var toggleSplitMapUpdater = function toggleSplitMapUpdater(state) {
  return _objectSpread({}, state, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9tYXAtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibWFwU3RhdGVVcGRhdGVycyIsIklOSVRJQUxfTUFQX1NUQVRFIiwicGl0Y2giLCJiZWFyaW5nIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwiZHJhZ1JvdGF0ZSIsIndpZHRoIiwiaGVpZ2h0IiwiaXNTcGxpdCIsInVwZGF0ZU1hcFVwZGF0ZXIiLCJzdGF0ZSIsImFjdGlvbiIsInBheWxvYWQiLCJmaXRCb3VuZHNVcGRhdGVyIiwiYm91bmRzIiwiZ2VvVmlld3BvcnQiLCJ2aWV3cG9ydCIsImNlbnRlciIsInRvZ2dsZVBlcnNwZWN0aXZlVXBkYXRlciIsInJlc2V0TWFwQ29uZmlnVXBkYXRlciIsImluaXRpYWxTdGF0ZSIsInJlY2VpdmVNYXBDb25maWdVcGRhdGVyIiwiY29uZmlnIiwib3B0aW9ucyIsIm1hcFN0YXRlIiwibWVyZ2VkU3RhdGUiLCJjZW50ZXJNYXAiLCJnZXRNYXBEaW1Gb3JTcGxpdE1hcCIsInRvZ2dsZVNwbGl0TWFwVXBkYXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBO0FBQ0E7QUFDQSxJQUFNQSxnQkFBZ0IsR0FBRyxJQUF6QjtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWdCTyxJQUFNQyxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsS0FBSyxFQUFFLENBRHdCO0FBRS9CQyxFQUFBQSxPQUFPLEVBQUUsQ0FGc0I7QUFHL0JDLEVBQUFBLFFBQVEsRUFBRSxRQUhxQjtBQUkvQkMsRUFBQUEsU0FBUyxFQUFFLENBQUMsU0FKbUI7QUFLL0JDLEVBQUFBLElBQUksRUFBRSxDQUx5QjtBQU0vQkMsRUFBQUEsVUFBVSxFQUFFLEtBTm1CO0FBTy9CQyxFQUFBQSxLQUFLLEVBQUUsR0FQd0I7QUFRL0JDLEVBQUFB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QUFDakIsS0FBSyxDQUFDRixPQUFSLEVBQWlCRSxLQUFqQixDQUhpQjtBQUFBLENBQW5DLEMsQ0FNUDs7Ozs7QUFDTyxTQUFTaUIsb0JBQVQsQ0FBOEJuQixPQUE5QixFQUF1Q0UsS0FBdkMsRUFBOEM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUlBLEtBQUssQ0FBQ0YsT0FBTixLQUFrQkEsT0FBdEIsRUFBK0I7QUFDN0IsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsTUFBTUYsS0FBSyxHQUNUSSxLQUFLLENBQUNGLE9BQU4sSUFBaUIsQ0FBQ0EsT0FBbEIsR0FDSTtBQUNBO0FBQ0FFLEVBQUFBLEtBQUssQ0FBQ0osS0FBTixHQUFjLENBSGxCLEdBSUk7QUFDQTtBQUNBSSxFQUFBQSxLQUFLLENBQUNKLEtBQU4sR0FBYyxDQVBwQjtBQVNBLFNBQU87QUFDTEEsSUFBQUEsS0FBSyxFQUFMQTtBQURLLEdBQVA7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBnZW9WaWV3cG9ydCBmcm9tICdAbWFwYm94L2dlby12aWV3cG9ydCc7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL21hcC1zdGF0ZS11cGRhdGVycycpLk1hcFN0YXRlfSBNYXBTdGF0ZSAqL1xuXG4vKipcbiAqIFVwZGF0ZXJzIGZvciBgbWFwU3RhdGVgIHJlZHVjZXIuIENhbiBiZSB1c2VkIGluIHlvdXIgcm9vdCByZWR1Y2VyIHRvIGRpcmVjdGx5IG1vZGlmeSBrZXBsZXIuZ2wncyBzdGF0ZS5cbiAqIFJlYWQgbW9yZSBhYm91dCBbVXNpbmcgdXBkYXRlcnNdKC4uL2FkdmFuY2VkLXVzYWdlL3VzaW5nLXVwZGF0ZXJzLm1kKVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQga2VwbGVyR2xSZWR1Y2VyLCB7bWFwU3RhdGVVcGRhdGVyc30gZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIC8vIFJvb3QgUmVkdWNlclxuICogY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICogIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKiAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAqICAgIC8vIGNsaWNrIGJ1dHRvbiB0byBjbG9zZSBzaWRlIHBhbmVsXG4gKiAgICBjYXNlICdDTElDS19CVVRUT04nOlxuICogICAgICByZXR1cm4ge1xuICogICAgICAgIC4uLnN0YXRlLFxuICogICAgICAgIGtlcGxlckdsOiB7XG4gKiAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbCxcbiAqICAgICAgICAgIGZvbzoge1xuICogICAgICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wuZm9vLFxuICogICAgICAgICAgICAgbWFwU3RhdGU6IG1hcFN0YXRlVXBkYXRlcnMuZml0Qm91bmRzVXBkYXRlcihcbiAqICAgICAgICAgICAgICAgbWFwU3RhdGUsIHtwYXlsb2FkOiBbMTI3LjM0LCAzMS4wOSwgMTI3LjU2LCAzMS41OV1dfVxuICogICAgICAgICAgICAgKVxuICogICAgICAgICAgfVxuICogICAgICAgIH1cbiAqICAgICAgfTtcbiAqICB9XG4gKiAgcmV0dXJuIHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICogfTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCBtYXBTdGF0ZVVwZGF0ZXJzID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuLyoqXG4gKiBEZWZhdWx0IGluaXRpYWwgYG1hcFN0YXRlYFxuICogQG1lbWJlcm9mIG1hcFN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHBpdGNoIERlZmF1bHQ6IGAwYFxuICogQHByb3BlcnR5IGJlYXJpbmcgRGVmYXVsdDogYDBgXG4gKiBAcHJvcGVydHkgbGF0aXR1ZGUgRGVmYXVsdDogYDM3Ljc1MDQzYFxuICogQHByb3BlcnR5IGxvbmdpdHVkZSBEZWZhdWx0OiBgLTEyMi4zNDY3OWBcbiAqIEBwcm9wZXJ0eSB6b29tIERlZmF1bHQ6IGA5YFxuICogQHByb3BlcnR5IGRyYWdSb3RhdGUgRGVmYXVsdDogYGZhbHNlYFxuICogQHByb3BlcnR5IHdpZHRoIERlZmF1bHQ6IGA4MDBgXG4gKiBAcHJvcGVydHkgaGVpZ2h0IERlZmF1bHQ6IGA4MDBgXG4gKiBAcHJvcGVydHkgaXNTcGxpdCBEZWZhdWx0OiBgZmFsc2VgXG4gKiBAdHlwZSB7TWFwU3RhdGV9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBJTklUSUFMX01BUF9TVEFURSA9IHtcbiAgcGl0Y2g6IDAsXG4gIGJlYXJpbmc6IDAsXG4gIGxhdGl0dWRlOiAzNy43NTA0MyxcbiAgbG9uZ2l0dWRlOiAtMTIyLjM0Njc5LFxuICB6b29tOiA5LFxuICBkcmFnUm90YXRlOiBmYWxzZSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDAsXG4gIGlzU3BsaXQ6IGZhbHNlXG59O1xuXG4vKiBVcGRhdGVycyAqL1xuLyoqXG4gKiBVcGRhdGUgbWFwIHZpZXdwb3J0XG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykudXBkYXRlTWFwVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZU1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIC4uLihhY3Rpb24ucGF5bG9hZCB8fCB7fSlcbn0pO1xuXG4vKipcbiAqIEZpdCBtYXAgdmlld3BvcnQgdG8gYm91bmRzXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykuZml0Qm91bmRzVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGZpdEJvdW5kc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBib3VuZHMgPSBhY3Rpb24ucGF5bG9hZDtcbiAgY29uc3Qge2NlbnRlciwgem9vbX0gPSBnZW9WaWV3cG9ydC52aWV3cG9ydChib3VuZHMsIFtzdGF0ZS53aWR0aCwgc3RhdGUuaGVpZ2h0XSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXRpdHVkZTogY2VudGVyWzFdLFxuICAgIGxvbmdpdHVkZTogY2VudGVyWzBdLFxuICAgIHpvb21cbiAgfTtcbn07XG5cbi8qKlxuICogVG9nZ2xlIGJldHdlZW4gM2QgYW5kIDJkIG1hcC5cbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVQZXJzcGVjdGl2ZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVQZXJzcGVjdGl2ZVVwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgLi4ue1xuICAgIHBpdGNoOiBzdGF0ZS5kcmFnUm90YXRlID8gMCA6IDUwLFxuICAgIGJlYXJpbmc6IHN0YXRlLmRyYWdSb3RhdGUgPyAwIDogMjRcbiAgfSxcbiAgZHJhZ1JvdGF0ZTogIXN0YXRlLmRyYWdSb3RhdGVcbn0pO1xuXG4vKipcbiAqIHJlc2V0IG1hcFN0YXRlIHRvIGluaXRpYWwgU3RhdGVcbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3RhdGUtdXBkYXRlcnMnKS5yZXNldE1hcENvbmZpZ1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ1VwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5JTklUSUFMX01BUF9TVEFURSxcbiAgLi4uc3RhdGUuaW5pdGlhbFN0YXRlLFxuICBpbml0aWFsU3RhdGU6IHN0YXRlLmluaXRpYWxTdGF0ZVxufSk7XG5cbi8vIGNvbnNpZGVyIGNhc2Ugd2hlcmUgeW91IGhhdmUgYSBzcGxpdCBtYXAgYW5kIHVzZXIgd2FudHMgdG8gcmVzZXRcbi8qKlxuICogVXBkYXRlIGBtYXBTdGF0ZWAgdG8gcHJvcGFnYXRlIGEgbmV3IGNvbmZpZ1xuICogQG1lbWJlcm9mIG1hcFN0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdGF0ZS11cGRhdGVycycpLnJlY2VpdmVNYXBDb25maWdVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoXG4gIHN0YXRlLFxuICB7cGF5bG9hZDoge2NvbmZpZyA9IHt9LCBvcHRpb25zID0ge30sIGJvdW5kcyA9IG51bGx9fVxuKSA9PiB7XG4gIGNvbnN0IHttYXBTdGF0ZX0gPSBjb25maWcgfHwge307XG5cbiAgLy8gbWVyZ2VkIHJlY2VpdmVkIG1hcHN0YXRlIHdpdGggcHJldmlvdXMgc3RhdGVcbiAgbGV0IG1lcmdlZFN0YXRlID0gey4uLnN0YXRlLCAuLi5tYXBTdGF0ZX07XG5cbiAgLy8gaWYgY2VudGVyIG1hcFxuICAvLyBjZW50ZXIgbWFwIHdpbGwgb3ZlcnJpZGUgbWFwU3RhdGUgY29uZmlnXG4gIGlmIChvcHRpb25zLmNlbnRlck1hcCAmJiBib3VuZHMpIHtcbiAgICBtZXJnZWRTdGF0ZSA9IGZpdEJvdW5kc1VwZGF0ZXIobWVyZ2VkU3RhdGUsIHtcbiAgICAgIHBheWxvYWQ6IGJvdW5kc1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5tZXJnZWRTdGF0ZSxcbiAgICAvLyB1cGRhdGUgd2lkdGggaWYgYGlzU3BsaXRgIGhhcyBjaGFuZ2VkXG4gICAgLi4uZ2V0TWFwRGltRm9yU3BsaXRNYXAobWVyZ2VkU3RhdGUuaXNTcGxpdCwgc3RhdGUpXG4gIH07XG59O1xuXG4vKipcbiAqIFRvZ2dsZSBiZXR3ZWVuIG9uZSBvciBzcGxpdCBtYXBzXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJykudG9nZ2xlU3BsaXRNYXBVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlU3BsaXRNYXBVcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGlzU3BsaXQ6ICFzdGF0ZS5pc1NwbGl0LFxuICAuLi5nZXRNYXBEaW1Gb3JTcGxpdE1hcCghc3RhdGUuaXNTcGxpdCwgc3RhdGUpXG59KTtcblxuLy8gSGVscGVyc1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcERpbUZvclNwbGl0TWFwKGlzU3BsaXQsIHN0YXRlKSB7XG4gIC8vIGNhc2VzOlxuICAvLyAxLiBzdGF0ZSBzcGxpdDogdHJ1ZSAtIGlzU3BsaXQ6IHRydWVcbiAgLy8gZG8gbm90aGluZ1xuICAvLyAyLiBzdGF0ZSBzcGxpdDogZmFsc2UgLSBpc1NwbGl0OiBmYWxzZVxuICAvLyBkbyBub3RoaW5nXG4gIGlmIChzdGF0ZS5pc1NwbGl0ID09PSBpc1NwbGl0KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3Qgd2lkdGggPVxuICAgIHN0YXRlLmlzU3BsaXQgJiYgIWlzU3BsaXRcbiAgICAgID8gLy8gMy4gc3RhdGUgc3BsaXQ6IHRydWUgLSBpc1NwbGl0OiBmYWxzZVxuICAgICAgICAvLyBkb3VibGUgd2lkdGhcbiAgICAgICAgc3RhdGUud2lkdGggKiAyXG4gICAgICA6IC8vIDQuIHN0YXRlIHNwbGl0OiBmYWxzZSAtIGlzU3BsaXQ6IHRydWVcbiAgICAgICAgLy8gc3BsaXQgd2lkdGhcbiAgICAgICAgc3RhdGUud2lkdGggLyAyO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGhcbiAgfTtcbn1cbiJdfQ==