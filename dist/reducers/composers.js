'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _compostedUpdaters;

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _mapState = require('./map-state');

var _uiState = require('./ui-state');

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
  var _receiveVisData = (0, _visStateUpdaters.receiveVisData)(state.visState, action),
      visState = _receiveVisData.visState,
      bounds = _receiveVisData.bounds;

  return (0, _extends3.default)({}, state, {
    visState: visState,
    mapState: bounds ? (0, _mapState.fitMapBounds)(state.mapState, {
      payload: bounds
    }) : state.mapState,
    uiState: (0, _uiState.closeAddDataModel)(state.uiState)
  });
};

var addDataComposed = function addDataComposed(state, action) {};

var compostedUpdaters = (_compostedUpdaters = {}, _compostedUpdaters[_actionTypes2.default.UPDATE_VIS_DATA] = updateVisDataComposed, _compostedUpdaters);

exports.default = compostedUpdaters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3NlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlVmlzRGF0YUNvbXBvc2VkIiwic3RhdGUiLCJhY3Rpb24iLCJ2aXNTdGF0ZSIsImJvdW5kcyIsIm1hcFN0YXRlIiwicGF5bG9hZCIsInVpU3RhdGUiLCJhZGREYXRhQ29tcG9zZWQiLCJjb21wb3N0ZWRVcGRhdGVycyIsIlVQREFURV9WSVNfREFUQSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOztBQUVBOzs7Ozs7QUFNQSxJQUFNQSx3QkFBd0IsU0FBeEJBLHFCQUF3QixDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFBQSx3QkFDcEIsc0NBQWVELE1BQU1FLFFBQXJCLEVBQStCRCxNQUEvQixDQURvQjtBQUFBLE1BQ3hDQyxRQUR3QyxtQkFDeENBLFFBRHdDO0FBQUEsTUFDOUJDLE1BRDhCLG1CQUM5QkEsTUFEOEI7O0FBRS9DLG9DQUNLSCxLQURMO0FBRUVFLHNCQUZGO0FBR0VFLGNBQVVELFNBQVMsNEJBQWFILE1BQU1JLFFBQW5CLEVBQTZCO0FBQzlDQyxlQUFTRjtBQURxQyxLQUE3QixDQUFULEdBRUxILE1BQU1JLFFBTGI7QUFNRUUsYUFBUyxnQ0FBa0JOLE1BQU1NLE9BQXhCO0FBTlg7QUFRRCxDQVZEOztBQVlBLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ1AsS0FBRCxFQUFRQyxNQUFSLEVBQW1CLENBRTFDLENBRkQ7O0FBSUEsSUFBTU8saUVBQ0gsc0JBQVlDLGVBRFQsSUFDMkJWLHFCQUQzQixxQkFBTjs7a0JBS2VTLGlCIiwiZmlsZSI6ImNvbXBvc2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7Zml0TWFwQm91bmRzfSBmcm9tICcuL21hcC1zdGF0ZSc7XG5pbXBvcnQge2Nsb3NlQWRkRGF0YU1vZGVsfSBmcm9tICcuL3VpLXN0YXRlJztcbmltcG9ydCB7cmVjZWl2ZVZpc0RhdGF9IGZyb20gJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJztcblxuLy8gY29tcG9zZSBhY3Rpb24gdG8gYXBwbHkgcmVzdWx0IG11bHRpcGxlIHJlZHVjZXJzLCB3aXRoIHRoZSBvdXRwdXQgb2Ygb25lXG5cbi8qKlxuICogQXBwbHkgbWFwIGJvdW5kcyB0byBtYXBTdGF0ZSBmcm9tIHJlY2VpdmVkIHZpcyBkYXRhXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHt7dmlzU3RhdGUsIG1hcFN0YXRlOiB7bGF0aXR1ZGUsIGxvbmdpdHVkZSwgem9vbX19fVxuICovXG5jb25zdCB1cGRhdGVWaXNEYXRhQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7dmlzU3RhdGUsIGJvdW5kc30gPSByZWNlaXZlVmlzRGF0YShzdGF0ZS52aXNTdGF0ZSwgYWN0aW9uKTtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICB2aXNTdGF0ZSxcbiAgICBtYXBTdGF0ZTogYm91bmRzID8gZml0TWFwQm91bmRzKHN0YXRlLm1hcFN0YXRlLCB7XG4gICAgICBwYXlsb2FkOiBib3VuZHNcbiAgICB9KSA6IHN0YXRlLm1hcFN0YXRlLFxuICAgIHVpU3RhdGU6IGNsb3NlQWRkRGF0YU1vZGVsKHN0YXRlLnVpU3RhdGUpXG4gIH07XG59O1xuXG5jb25zdCBhZGREYXRhQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXG59O1xuXG5jb25zdCBjb21wb3N0ZWRVcGRhdGVycyA9IHtcbiAgW0FjdGlvblR5cGVzLlVQREFURV9WSVNfREFUQV06IHVwZGF0ZVZpc0RhdGFDb21wb3NlZFxuICAvLyBbQWN0aW9uVHlwZXMuQUREX0RBVEFdOlxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zdGVkVXBkYXRlcnNcbiJdfQ==