'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _compostedUpdaters;

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _mapStateUpdaters = require('./map-state-updaters');

var _uiStateUpdaters = require('./ui-state-updaters');

var _visStateUpdaters = require('./vis-state-updaters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action
 * @returns {{visState, mapState: {latitude, longitude, zoom}}}
 */
var updateVisDataComposed = function updateVisDataComposed(state, action) {
  var _updateVisDataUpdater = (0, _visStateUpdaters.updateVisDataUpdater)(state.visState, action),
      visState = _updateVisDataUpdater.visState,
      bounds = _updateVisDataUpdater.bounds;

  return (0, _extends3.default)({}, state, {
    visState: visState,
    mapState: bounds ? (0, _mapStateUpdaters.fitBoundsUpdater)(state.mapState, {
      payload: bounds
    }) : state.mapState,
    uiState: (0, _uiStateUpdaters.toggleModalUpdater)(state.uiState, { payload: null })
  });
};

var compostedUpdaters = (_compostedUpdaters = {}, _compostedUpdaters[_actionTypes2.default.UPDATE_VIS_DATA] = updateVisDataComposed, _compostedUpdaters);

exports.default = compostedUpdaters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3NlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlVmlzRGF0YUNvbXBvc2VkIiwic3RhdGUiLCJhY3Rpb24iLCJ2aXNTdGF0ZSIsImJvdW5kcyIsIm1hcFN0YXRlIiwicGF5bG9hZCIsInVpU3RhdGUiLCJjb21wb3N0ZWRVcGRhdGVycyIsIlVQREFURV9WSVNfREFUQSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOztBQUVBOzs7Ozs7QUFNQSxJQUFNQSx3QkFBd0IsU0FBeEJBLHFCQUF3QixDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFBQSw4QkFDcEIsNENBQXFCRCxNQUFNRSxRQUEzQixFQUFxQ0QsTUFBckMsQ0FEb0I7QUFBQSxNQUN4Q0MsUUFEd0MseUJBQ3hDQSxRQUR3QztBQUFBLE1BQzlCQyxNQUQ4Qix5QkFDOUJBLE1BRDhCOztBQUUvQyxvQ0FDS0gsS0FETDtBQUVFRSxzQkFGRjtBQUdFRSxjQUFVRCxTQUNOLHdDQUFpQkgsTUFBTUksUUFBdkIsRUFBaUM7QUFDL0JDLGVBQVNGO0FBRHNCLEtBQWpDLENBRE0sR0FJTkgsTUFBTUksUUFQWjtBQVFFRSxhQUFTLHlDQUFtQk4sTUFBTU0sT0FBekIsRUFBa0MsRUFBQ0QsU0FBUyxJQUFWLEVBQWxDO0FBUlg7QUFVRCxDQVpEOztBQWNBLElBQU1FLGlFQUNILHNCQUFZQyxlQURULElBQzJCVCxxQkFEM0IscUJBQU47O2tCQUllUSxpQiIsImZpbGUiOiJjb21wb3NlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQge2ZpdEJvdW5kc1VwZGF0ZXJ9IGZyb20gJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7dG9nZ2xlTW9kYWxVcGRhdGVyfSBmcm9tICcuL3VpLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7dXBkYXRlVmlzRGF0YVVwZGF0ZXJ9IGZyb20gJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJztcblxuLy8gY29tcG9zZSBhY3Rpb24gdG8gYXBwbHkgcmVzdWx0IG11bHRpcGxlIHJlZHVjZXJzLCB3aXRoIHRoZSBvdXRwdXQgb2Ygb25lXG5cbi8qKlxuICogQXBwbHkgbWFwIGJvdW5kcyB0byBtYXBTdGF0ZSBmcm9tIHJlY2VpdmVkIHZpcyBkYXRhXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHt7dmlzU3RhdGUsIG1hcFN0YXRlOiB7bGF0aXR1ZGUsIGxvbmdpdHVkZSwgem9vbX19fVxuICovXG5jb25zdCB1cGRhdGVWaXNEYXRhQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7dmlzU3RhdGUsIGJvdW5kc30gPSB1cGRhdGVWaXNEYXRhVXBkYXRlcihzdGF0ZS52aXNTdGF0ZSwgYWN0aW9uKTtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICB2aXNTdGF0ZSxcbiAgICBtYXBTdGF0ZTogYm91bmRzXG4gICAgICA/IGZpdEJvdW5kc1VwZGF0ZXIoc3RhdGUubWFwU3RhdGUsIHtcbiAgICAgICAgICBwYXlsb2FkOiBib3VuZHNcbiAgICAgICAgfSlcbiAgICAgIDogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogdG9nZ2xlTW9kYWxVcGRhdGVyKHN0YXRlLnVpU3RhdGUsIHtwYXlsb2FkOiBudWxsfSlcbiAgfTtcbn07XG5cbmNvbnN0IGNvbXBvc3RlZFVwZGF0ZXJzID0ge1xuICBbQWN0aW9uVHlwZXMuVVBEQVRFX1ZJU19EQVRBXTogdXBkYXRlVmlzRGF0YUNvbXBvc2VkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb3N0ZWRVcGRhdGVycztcbiJdfQ==