'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openDeleteModal = exports.toggleModal = exports.toggleSidePanel = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _reduxActions = require('redux-actions');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOGGLE_SIDE_PANEL = _actionTypes2.default.TOGGLE_SIDE_PANEL,
    TOGGLE_MODAL = _actionTypes2.default.TOGGLE_MODAL,
    OPEN_DELETE_MODAL = _actionTypes2.default.OPEN_DELETE_MODAL;

// second argument of createAction is expected to be payloadCreator or undefined

var _map = [TOGGLE_SIDE_PANEL, TOGGLE_MODAL, OPEN_DELETE_MODAL].map(function (a) {
  return (0, _reduxActions.createAction)(a);
}),
    _map2 = (0, _slicedToArray3.default)(_map, 3),
    toggleSidePanel = _map2[0],
    toggleModal = _map2[1],
    openDeleteModal = _map2[2];

exports.toggleSidePanel = toggleSidePanel;
exports.toggleModal = toggleModal;
exports.openDeleteModal = openDeleteModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3VpLXN0YXRlLWFjdGlvbnMuanMiXSwibmFtZXMiOlsiVE9HR0xFX1NJREVfUEFORUwiLCJUT0dHTEVfTU9EQUwiLCJPUEVOX0RFTEVURV9NT0RBTCIsIm1hcCIsImEiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ0b2dnbGVNb2RhbCIsIm9wZW5EZWxldGVNb2RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0lBRU9BLGlCLHlCQUFBQSxpQjtJQUFtQkMsWSx5QkFBQUEsWTtJQUFjQyxpQix5QkFBQUEsaUI7O0FBRXhDOztXQUN3RCxDQUN0REYsaUJBRHNELEVBRXREQyxZQUZzRCxFQUd0REMsaUJBSHNELEVBSXREQyxHQUpzRCxDQUlsRDtBQUFBLFNBQUssZ0NBQWFDLENBQWIsQ0FBTDtBQUFBLENBSmtELEM7O0lBQWpEQyxlO0lBQWlCQyxXO0lBQWFDLGU7O1FBTTdCRixlLEdBQUFBLGU7UUFBaUJDLFcsR0FBQUEsVztRQUFhQyxlLEdBQUFBLGUiLCJmaWxlIjoidWktc3RhdGUtYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvYWN0aW9uLXR5cGVzJztcblxuY29uc3Qge1RPR0dMRV9TSURFX1BBTkVMLCBUT0dHTEVfTU9EQUwsIE9QRU5fREVMRVRFX01PREFMfSA9IEFjdGlvblR5cGVzO1xuXG4vLyBzZWNvbmQgYXJndW1lbnQgb2YgY3JlYXRlQWN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIHBheWxvYWRDcmVhdG9yIG9yIHVuZGVmaW5lZFxuY29uc3QgW3RvZ2dsZVNpZGVQYW5lbCwgdG9nZ2xlTW9kYWwsIG9wZW5EZWxldGVNb2RhbF0gPSBbXG4gIFRPR0dMRV9TSURFX1BBTkVMLFxuICBUT0dHTEVfTU9EQUwsXG4gIE9QRU5fREVMRVRFX01PREFMXG5dLm1hcChhID0+IGNyZWF0ZUFjdGlvbihhKSk7XG5cbmV4cG9ydCB7dG9nZ2xlU2lkZVBhbmVsLCB0b2dnbGVNb2RhbCwgb3BlbkRlbGV0ZU1vZGFsfTtcbiJdfQ==