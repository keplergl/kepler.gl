'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _compostedUpdaters;

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _mapStateUpdaters = require('./map-state-updaters');

var _uiStateUpdaters = require('./ui-state-updaters');

var _visStateUpdaters = require('./vis-state-updaters');

var _dataUtils = require('../utils/data-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action
 * @returns {{visState, mapState: {latitude, longitude, zoom}}}
 */
var updateVisDataComposed = function updateVisDataComposed(state, action) {
  var visState = (0, _visStateUpdaters.updateVisDataUpdater)(state.visState, action);
  var bounds = void 0;
  if (action.options.centerMap) {
    // find map bounds for new layers
    var newLayers = visState.layers.filter(function (l) {
      return !oldLayers.includes(l.id);
    });
    bounds = (0, _dataUtils.findMapBounds)(newLayers);
  }

  return (0, _extends3.default)({}, state, {
    visState: visState,
    mapState: bounds ? (0, _mapStateUpdaters.fitBoundsUpdater)(state.mapState, {
      payload: bounds
    }) : state.mapState,
    uiState: (0, _uiStateUpdaters.toggleModalUpdater)(state.uiState, { payload: null })
  });
};

/**
 * Combine data and configuration update in a single action
 * @param state
 * @param action
 * @returns {{}}
 */
var updateVisDataAndConfigComposed = function updateVisDataAndConfigComposed(state, action) {
  var newCustomVisState = (0, _visStateUpdaters.receiveMapConfigUpdater)(state, { payload: (0, _extends3.default)({}, action.appConfig) });

  var newState = (0, _extends3.default)({}, state, {
    visState: newCustomVisState
  });

  return (0, _extends3.default)({}, newState, updateVisDataComposed(newState, { datasets: action.datasets }));
};

var compostedUpdaters = (_compostedUpdaters = {}, (0, _defineProperty3.default)(_compostedUpdaters, _actionTypes2.default.UPDATE_VIS_DATA, updateVisDataComposed), (0, _defineProperty3.default)(_compostedUpdaters, _actionTypes2.default.UPDATE_VIS_DATA_CONFIG, updateVisDataAndConfigComposed), _compostedUpdaters);

exports.default = compostedUpdaters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3NlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlVmlzRGF0YUNvbXBvc2VkIiwic3RhdGUiLCJhY3Rpb24iLCJ2aXNTdGF0ZSIsImJvdW5kcyIsIm9wdGlvbnMiLCJjZW50ZXJNYXAiLCJuZXdMYXllcnMiLCJsYXllcnMiLCJmaWx0ZXIiLCJvbGRMYXllcnMiLCJpbmNsdWRlcyIsImwiLCJpZCIsIm1hcFN0YXRlIiwicGF5bG9hZCIsInVpU3RhdGUiLCJ1cGRhdGVWaXNEYXRhQW5kQ29uZmlnQ29tcG9zZWQiLCJuZXdDdXN0b21WaXNTdGF0ZSIsImFwcENvbmZpZyIsIm5ld1N0YXRlIiwiZGF0YXNldHMiLCJjb21wb3N0ZWRVcGRhdGVycyIsIlVQREFURV9WSVNfREFUQSIsIlVQREFURV9WSVNfREFUQV9DT05GSUciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7OztBQU1BLElBQU1BLHdCQUF3QixTQUF4QkEscUJBQXdCLENBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUMvQyxNQUFNQyxXQUFXLDRDQUFxQkYsTUFBTUUsUUFBM0IsRUFBcUNELE1BQXJDLENBQWpCO0FBQ0EsTUFBSUUsZUFBSjtBQUNBLE1BQUlGLE9BQU9HLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDNUI7QUFDQSxRQUFNQyxZQUFZSixTQUFTSyxNQUFULENBQWdCQyxNQUFoQixDQUF1QjtBQUFBLGFBQUssQ0FBQ0MsVUFBVUMsUUFBVixDQUFtQkMsRUFBRUMsRUFBckIsQ0FBTjtBQUFBLEtBQXZCLENBQWxCO0FBQ0FULGFBQVMsOEJBQWNHLFNBQWQsQ0FBVDtBQUNEOztBQUVELG9DQUNLTixLQURMO0FBRUVFLHNCQUZGO0FBR0VXLGNBQVVWLFNBQ04sd0NBQWlCSCxNQUFNYSxRQUF2QixFQUFpQztBQUMvQkMsZUFBU1g7QUFEc0IsS0FBakMsQ0FETSxHQUlOSCxNQUFNYSxRQVBaO0FBUUVFLGFBQVMseUNBQW1CZixNQUFNZSxPQUF6QixFQUFrQyxFQUFDRCxTQUFTLElBQVYsRUFBbEM7QUFSWDtBQVVELENBbkJEOztBQXFCQTs7Ozs7O0FBTUEsSUFBTUUsaUNBQWlDLFNBQWpDQSw4QkFBaUMsQ0FBQ2hCLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN4RCxNQUFNZ0Isb0JBQW9CLCtDQUF3QmpCLEtBQXhCLEVBQStCLEVBQUNjLG9DQUFhYixPQUFPaUIsU0FBcEIsQ0FBRCxFQUEvQixDQUExQjs7QUFFQSxNQUFNQyxzQ0FDRG5CLEtBREM7QUFFSkUsY0FBVWU7QUFGTixJQUFOOztBQUtBLG9DQUNLRSxRQURMLEVBRUtwQixzQkFBc0JvQixRQUF0QixFQUFnQyxFQUFDQyxVQUFVbkIsT0FBT21CLFFBQWxCLEVBQWhDLENBRkw7QUFJRCxDQVpEOztBQWNBLElBQU1DLGdHQUNILHNCQUFZQyxlQURULEVBQzJCdkIscUJBRDNCLHFEQUVILHNCQUFZd0Isc0JBRlQsRUFFa0NQLDhCQUZsQyxzQkFBTjs7a0JBS2VLLGlCIiwiZmlsZSI6ImNvbXBvc2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7Zml0Qm91bmRzVXBkYXRlcn0gZnJvbSAnLi9tYXAtc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHt0b2dnbGVNb2RhbFVwZGF0ZXJ9IGZyb20gJy4vdWktc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHtyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciwgdXBkYXRlVmlzRGF0YVVwZGF0ZXJ9IGZyb20gJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7ZmluZE1hcEJvdW5kc30gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG4vLyBjb21wb3NlIGFjdGlvbiB0byBhcHBseSByZXN1bHQgbXVsdGlwbGUgcmVkdWNlcnMsIHdpdGggdGhlIG91dHB1dCBvZiBvbmVcblxuLyoqXG4gKiBBcHBseSBtYXAgYm91bmRzIHRvIG1hcFN0YXRlIGZyb20gcmVjZWl2ZWQgdmlzIGRhdGFcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHJldHVybnMge3t2aXNTdGF0ZSwgbWFwU3RhdGU6IHtsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tfX19XG4gKi9cbmNvbnN0IHVwZGF0ZVZpc0RhdGFDb21wb3NlZCA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHZpc1N0YXRlID0gdXBkYXRlVmlzRGF0YVVwZGF0ZXIoc3RhdGUudmlzU3RhdGUsIGFjdGlvbik7XG4gIGxldCBib3VuZHM7XG4gIGlmIChhY3Rpb24ub3B0aW9ucy5jZW50ZXJNYXApIHtcbiAgICAvLyBmaW5kIG1hcCBib3VuZHMgZm9yIG5ldyBsYXllcnNcbiAgICBjb25zdCBuZXdMYXllcnMgPSB2aXNTdGF0ZS5sYXllcnMuZmlsdGVyKGwgPT4gIW9sZExheWVycy5pbmNsdWRlcyhsLmlkKSk7XG4gICAgYm91bmRzID0gZmluZE1hcEJvdW5kcyhuZXdMYXllcnMpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICB2aXNTdGF0ZSxcbiAgICBtYXBTdGF0ZTogYm91bmRzXG4gICAgICA/IGZpdEJvdW5kc1VwZGF0ZXIoc3RhdGUubWFwU3RhdGUsIHtcbiAgICAgICAgICBwYXlsb2FkOiBib3VuZHNcbiAgICAgICAgfSlcbiAgICAgIDogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogdG9nZ2xlTW9kYWxVcGRhdGVyKHN0YXRlLnVpU3RhdGUsIHtwYXlsb2FkOiBudWxsfSlcbiAgfTtcbn07XG5cbi8qKlxuICogQ29tYmluZSBkYXRhIGFuZCBjb25maWd1cmF0aW9uIHVwZGF0ZSBpbiBhIHNpbmdsZSBhY3Rpb25cbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHJldHVybnMge3t9fVxuICovXG5jb25zdCB1cGRhdGVWaXNEYXRhQW5kQ29uZmlnQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBuZXdDdXN0b21WaXNTdGF0ZSA9IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyKHN0YXRlLCB7cGF5bG9hZDogey4uLmFjdGlvbi5hcHBDb25maWd9fSk7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgdmlzU3RhdGU6IG5ld0N1c3RvbVZpc1N0YXRlXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICAuLi51cGRhdGVWaXNEYXRhQ29tcG9zZWQobmV3U3RhdGUsIHtkYXRhc2V0czogYWN0aW9uLmRhdGFzZXRzfSlcbiAgfTtcbn07XG5cbmNvbnN0IGNvbXBvc3RlZFVwZGF0ZXJzID0ge1xuICBbQWN0aW9uVHlwZXMuVVBEQVRFX1ZJU19EQVRBXTogdXBkYXRlVmlzRGF0YUNvbXBvc2VkLFxuICBbQWN0aW9uVHlwZXMuVVBEQVRFX1ZJU19EQVRBX0NPTkZJR106IHVwZGF0ZVZpc0RhdGFBbmRDb25maWdDb21wb3NlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zdGVkVXBkYXRlcnM7XG4iXX0=