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
  // keep a copy of oldLayers
  var oldLayers = state.visState.layers.map(function (l) {
    return l.id;
  });

  var visState = (0, _visStateUpdaters.updateVisDataUpdater)(state.visState, action);

  var defaultOptions = { centerMap: true };
  var options = (0, _extends3.default)({}, defaultOptions, action.options);

  var bounds = void 0;
  if (options.centerMap) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3NlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlVmlzRGF0YUNvbXBvc2VkIiwic3RhdGUiLCJhY3Rpb24iLCJvbGRMYXllcnMiLCJ2aXNTdGF0ZSIsImxheWVycyIsIm1hcCIsImwiLCJpZCIsImRlZmF1bHRPcHRpb25zIiwiY2VudGVyTWFwIiwib3B0aW9ucyIsImJvdW5kcyIsIm5ld0xheWVycyIsImZpbHRlciIsImluY2x1ZGVzIiwibWFwU3RhdGUiLCJwYXlsb2FkIiwidWlTdGF0ZSIsInVwZGF0ZVZpc0RhdGFBbmRDb25maWdDb21wb3NlZCIsIm5ld0N1c3RvbVZpc1N0YXRlIiwiYXBwQ29uZmlnIiwibmV3U3RhdGUiLCJkYXRhc2V0cyIsImNvbXBvc3RlZFVwZGF0ZXJzIiwiVVBEQVRFX1ZJU19EQVRBIiwiVVBEQVRFX1ZJU19EQVRBX0NPTkZJRyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsd0JBQXdCLFNBQXhCQSxxQkFBd0IsQ0FBQ0MsS0FBRCxFQUFRQyxNQUFSLEVBQW1CO0FBQy9DO0FBQ0EsTUFBTUMsWUFBWUYsTUFBTUcsUUFBTixDQUFlQyxNQUFmLENBQXNCQyxHQUF0QixDQUEwQjtBQUFBLFdBQUtDLEVBQUVDLEVBQVA7QUFBQSxHQUExQixDQUFsQjs7QUFFQSxNQUFNSixXQUFXLDRDQUFxQkgsTUFBTUcsUUFBM0IsRUFBcUNGLE1BQXJDLENBQWpCOztBQUVBLE1BQU1PLGlCQUFpQixFQUFDQyxXQUFXLElBQVosRUFBdkI7QUFDQSxNQUFNQyxxQ0FDREYsY0FEQyxFQUVEUCxPQUFPUyxPQUZOLENBQU47O0FBS0EsTUFBSUMsZUFBSjtBQUNBLE1BQUlELFFBQVFELFNBQVosRUFBdUI7QUFDckI7QUFDQSxRQUFNRyxZQUFZVCxTQUFTQyxNQUFULENBQWdCUyxNQUFoQixDQUF1QjtBQUFBLGFBQUssQ0FBQ1gsVUFBVVksUUFBVixDQUFtQlIsRUFBRUMsRUFBckIsQ0FBTjtBQUFBLEtBQXZCLENBQWxCO0FBQ0FJLGFBQVMsOEJBQWNDLFNBQWQsQ0FBVDtBQUNEOztBQUVELG9DQUNLWixLQURMO0FBRUVHLHNCQUZGO0FBR0VZLGNBQVVKLFNBQ04sd0NBQWlCWCxNQUFNZSxRQUF2QixFQUFpQztBQUMvQkMsZUFBU0w7QUFEc0IsS0FBakMsQ0FETSxHQUlOWCxNQUFNZSxRQVBaO0FBUUVFLGFBQVMseUNBQW1CakIsTUFBTWlCLE9BQXpCLEVBQWtDLEVBQUNELFNBQVMsSUFBVixFQUFsQztBQVJYO0FBVUQsQ0E3QkQ7O0FBK0JBOzs7Ozs7QUFNQSxJQUFNRSxpQ0FBaUMsU0FBakNBLDhCQUFpQyxDQUFDbEIsS0FBRCxFQUFRQyxNQUFSLEVBQW1CO0FBQ3hELE1BQU1rQixvQkFBb0IsK0NBQXdCbkIsS0FBeEIsRUFBK0IsRUFBQ2dCLG9DQUFhZixPQUFPbUIsU0FBcEIsQ0FBRCxFQUEvQixDQUExQjs7QUFFQSxNQUFNQyxzQ0FDRHJCLEtBREM7QUFFSkcsY0FBVWdCO0FBRk4sSUFBTjs7QUFLQSxvQ0FDS0UsUUFETCxFQUVLdEIsc0JBQXNCc0IsUUFBdEIsRUFBZ0MsRUFBQ0MsVUFBVXJCLE9BQU9xQixRQUFsQixFQUFoQyxDQUZMO0FBSUQsQ0FaRDs7QUFjQSxJQUFNQyxnR0FDSCxzQkFBWUMsZUFEVCxFQUMyQnpCLHFCQUQzQixxREFFSCxzQkFBWTBCLHNCQUZULEVBRWtDUCw4QkFGbEMsc0JBQU47O2tCQUtlSyxpQiIsImZpbGUiOiJjb21wb3NlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQge2ZpdEJvdW5kc1VwZGF0ZXJ9IGZyb20gJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7dG9nZ2xlTW9kYWxVcGRhdGVyfSBmcm9tICcuL3VpLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7cmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIsIHVwZGF0ZVZpc0RhdGFVcGRhdGVyfSBmcm9tICcuL3Zpcy1zdGF0ZS11cGRhdGVycyc7XG5pbXBvcnQge2ZpbmRNYXBCb3VuZHN9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuLy8gY29tcG9zZSBhY3Rpb24gdG8gYXBwbHkgcmVzdWx0IG11bHRpcGxlIHJlZHVjZXJzLCB3aXRoIHRoZSBvdXRwdXQgb2Ygb25lXG5cbi8qKlxuICogQXBwbHkgbWFwIGJvdW5kcyB0byBtYXBTdGF0ZSBmcm9tIHJlY2VpdmVkIHZpcyBkYXRhXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHt7dmlzU3RhdGUsIG1hcFN0YXRlOiB7bGF0aXR1ZGUsIGxvbmdpdHVkZSwgem9vbX19fVxuICovXG5jb25zdCB1cGRhdGVWaXNEYXRhQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBrZWVwIGEgY29weSBvZiBvbGRMYXllcnNcbiAgY29uc3Qgb2xkTGF5ZXJzID0gc3RhdGUudmlzU3RhdGUubGF5ZXJzLm1hcChsID0+IGwuaWQpO1xuXG4gIGNvbnN0IHZpc1N0YXRlID0gdXBkYXRlVmlzRGF0YVVwZGF0ZXIoc3RhdGUudmlzU3RhdGUsIGFjdGlvbik7XG5cbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7Y2VudGVyTWFwOiB0cnVlfTtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAuLi5hY3Rpb24ub3B0aW9uc1xuICB9O1xuXG4gIGxldCBib3VuZHM7XG4gIGlmIChvcHRpb25zLmNlbnRlck1hcCkge1xuICAgIC8vIGZpbmQgbWFwIGJvdW5kcyBmb3IgbmV3IGxheWVyc1xuICAgIGNvbnN0IG5ld0xheWVycyA9IHZpc1N0YXRlLmxheWVycy5maWx0ZXIobCA9PiAhb2xkTGF5ZXJzLmluY2x1ZGVzKGwuaWQpKTtcbiAgICBib3VuZHMgPSBmaW5kTWFwQm91bmRzKG5ld0xheWVycyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHZpc1N0YXRlLFxuICAgIG1hcFN0YXRlOiBib3VuZHNcbiAgICAgID8gZml0Qm91bmRzVXBkYXRlcihzdGF0ZS5tYXBTdGF0ZSwge1xuICAgICAgICAgIHBheWxvYWQ6IGJvdW5kc1xuICAgICAgICB9KVxuICAgICAgOiBzdGF0ZS5tYXBTdGF0ZSxcbiAgICB1aVN0YXRlOiB0b2dnbGVNb2RhbFVwZGF0ZXIoc3RhdGUudWlTdGF0ZSwge3BheWxvYWQ6IG51bGx9KVxuICB9O1xufTtcblxuLyoqXG4gKiBDb21iaW5lIGRhdGEgYW5kIGNvbmZpZ3VyYXRpb24gdXBkYXRlIGluIGEgc2luZ2xlIGFjdGlvblxuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmNvbnN0IHVwZGF0ZVZpc0RhdGFBbmRDb25maWdDb21wb3NlZCA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IG5ld0N1c3RvbVZpc1N0YXRlID0gcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIoc3RhdGUsIHtwYXlsb2FkOiB7Li4uYWN0aW9uLmFwcENvbmZpZ319KTtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICB2aXNTdGF0ZTogbmV3Q3VzdG9tVmlzU3RhdGVcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIC4uLnVwZGF0ZVZpc0RhdGFDb21wb3NlZChuZXdTdGF0ZSwge2RhdGFzZXRzOiBhY3Rpb24uZGF0YXNldHN9KVxuICB9O1xufTtcblxuY29uc3QgY29tcG9zdGVkVXBkYXRlcnMgPSB7XG4gIFtBY3Rpb25UeXBlcy5VUERBVEVfVklTX0RBVEFdOiB1cGRhdGVWaXNEYXRhQ29tcG9zZWQsXG4gIFtBY3Rpb25UeXBlcy5VUERBVEVfVklTX0RBVEFfQ09ORklHXTogdXBkYXRlVmlzRGF0YUFuZENvbmZpZ0NvbXBvc2VkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb3N0ZWRVcGRhdGVycztcbiJdfQ==