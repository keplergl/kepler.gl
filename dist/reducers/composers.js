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

var addDataComposed = function addDataComposed(state, action) {};

var compostedUpdaters = (_compostedUpdaters = {}, _compostedUpdaters[_actionTypes2.default.UPDATE_VIS_DATA] = updateVisDataComposed, _compostedUpdaters);

exports.default = compostedUpdaters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3NlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlVmlzRGF0YUNvbXBvc2VkIiwic3RhdGUiLCJhY3Rpb24iLCJ2aXNTdGF0ZSIsImJvdW5kcyIsIm1hcFN0YXRlIiwicGF5bG9hZCIsInVpU3RhdGUiLCJhZGREYXRhQ29tcG9zZWQiLCJjb21wb3N0ZWRVcGRhdGVycyIsIlVQREFURV9WSVNfREFUQSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOztBQUVBOzs7Ozs7QUFNQSxJQUFNQSx3QkFBd0IsU0FBeEJBLHFCQUF3QixDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFBQSw4QkFDcEIsNENBQXFCRCxNQUFNRSxRQUEzQixFQUFxQ0QsTUFBckMsQ0FEb0I7QUFBQSxNQUN4Q0MsUUFEd0MseUJBQ3hDQSxRQUR3QztBQUFBLE1BQzlCQyxNQUQ4Qix5QkFDOUJBLE1BRDhCOztBQUUvQyxvQ0FDS0gsS0FETDtBQUVFRSxzQkFGRjtBQUdFRSxjQUFVRCxTQUFTLHdDQUFpQkgsTUFBTUksUUFBdkIsRUFBaUM7QUFDbERDLGVBQVNGO0FBRHlDLEtBQWpDLENBQVQsR0FFTEgsTUFBTUksUUFMYjtBQU1FRSxhQUFTLHlDQUFtQk4sTUFBTU0sT0FBekIsRUFBa0MsRUFBQ0QsU0FBUyxJQUFWLEVBQWxDO0FBTlg7QUFRRCxDQVZEOztBQVlBLElBQU1FLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ1AsS0FBRCxFQUFRQyxNQUFSLEVBQW1CLENBRTFDLENBRkQ7O0FBSUEsSUFBTU8saUVBQ0gsc0JBQVlDLGVBRFQsSUFDMkJWLHFCQUQzQixxQkFBTjs7a0JBS2VTLGlCIiwiZmlsZSI6ImNvbXBvc2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7Zml0Qm91bmRzVXBkYXRlcn0gZnJvbSAnLi9tYXAtc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHt0b2dnbGVNb2RhbFVwZGF0ZXJ9IGZyb20gJy4vdWktc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHt1cGRhdGVWaXNEYXRhVXBkYXRlcn0gZnJvbSAnLi92aXMtc3RhdGUtdXBkYXRlcnMnO1xuXG4vLyBjb21wb3NlIGFjdGlvbiB0byBhcHBseSByZXN1bHQgbXVsdGlwbGUgcmVkdWNlcnMsIHdpdGggdGhlIG91dHB1dCBvZiBvbmVcblxuLyoqXG4gKiBBcHBseSBtYXAgYm91bmRzIHRvIG1hcFN0YXRlIGZyb20gcmVjZWl2ZWQgdmlzIGRhdGFcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHJldHVybnMge3t2aXNTdGF0ZSwgbWFwU3RhdGU6IHtsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tfX19XG4gKi9cbmNvbnN0IHVwZGF0ZVZpc0RhdGFDb21wb3NlZCA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHt2aXNTdGF0ZSwgYm91bmRzfSA9IHVwZGF0ZVZpc0RhdGFVcGRhdGVyKHN0YXRlLnZpc1N0YXRlLCBhY3Rpb24pO1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHZpc1N0YXRlLFxuICAgIG1hcFN0YXRlOiBib3VuZHMgPyBmaXRCb3VuZHNVcGRhdGVyKHN0YXRlLm1hcFN0YXRlLCB7XG4gICAgICBwYXlsb2FkOiBib3VuZHNcbiAgICB9KSA6IHN0YXRlLm1hcFN0YXRlLFxuICAgIHVpU3RhdGU6IHRvZ2dsZU1vZGFsVXBkYXRlcihzdGF0ZS51aVN0YXRlLCB7cGF5bG9hZDogbnVsbH0pXG4gIH07XG59O1xuXG5jb25zdCBhZGREYXRhQ29tcG9zZWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXG59O1xuXG5jb25zdCBjb21wb3N0ZWRVcGRhdGVycyA9IHtcbiAgW0FjdGlvblR5cGVzLlVQREFURV9WSVNfREFUQV06IHVwZGF0ZVZpc0RhdGFDb21wb3NlZFxuICAvLyBbQWN0aW9uVHlwZXMuQUREX0RBVEFdOlxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zdGVkVXBkYXRlcnNcbiJdfQ==