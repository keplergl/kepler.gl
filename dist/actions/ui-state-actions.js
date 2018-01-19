'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openDeleteModal = exports.toggleModal = exports.toggleSidePanel = undefined;

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
    toggleSidePanel = _map[0],
    toggleModal = _map[1],
    openDeleteModal = _map[2];

exports.toggleSidePanel = toggleSidePanel;
exports.toggleModal = toggleModal;
exports.openDeleteModal = openDeleteModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3VpLXN0YXRlLWFjdGlvbnMuanMiXSwibmFtZXMiOlsiVE9HR0xFX1NJREVfUEFORUwiLCJUT0dHTEVfTU9EQUwiLCJPUEVOX0RFTEVURV9NT0RBTCIsIm1hcCIsImEiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ0b2dnbGVNb2RhbCIsIm9wZW5EZWxldGVNb2RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7SUFFT0EsaUIseUJBQUFBLGlCO0lBQW1CQyxZLHlCQUFBQSxZO0lBQWNDLGlCLHlCQUFBQSxpQjs7QUFFeEM7O1dBQ3dELENBQ3RERixpQkFEc0QsRUFFdERDLFlBRnNELEVBR3REQyxpQkFIc0QsRUFJdERDLEdBSnNELENBSWxEO0FBQUEsU0FBSyxnQ0FBYUMsQ0FBYixDQUFMO0FBQUEsQ0FKa0QsQztJQUFqREMsZTtJQUFpQkMsVztJQUFhQyxlOztRQU03QkYsZSxHQUFBQSxlO1FBQWlCQyxXLEdBQUFBLFc7UUFBYUMsZSxHQUFBQSxlIiwiZmlsZSI6InVpLXN0YXRlLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbmNvbnN0IHtUT0dHTEVfU0lERV9QQU5FTCwgVE9HR0xFX01PREFMLCBPUEVOX0RFTEVURV9NT0RBTH0gPSBBY3Rpb25UeXBlcztcblxuLy8gc2Vjb25kIGFyZ3VtZW50IG9mIGNyZWF0ZUFjdGlvbiBpcyBleHBlY3RlZCB0byBiZSBwYXlsb2FkQ3JlYXRvciBvciB1bmRlZmluZWRcbmNvbnN0IFt0b2dnbGVTaWRlUGFuZWwsIHRvZ2dsZU1vZGFsLCBvcGVuRGVsZXRlTW9kYWxdID0gW1xuICBUT0dHTEVfU0lERV9QQU5FTCxcbiAgVE9HR0xFX01PREFMLFxuICBPUEVOX0RFTEVURV9NT0RBTFxuXS5tYXAoYSA9PiBjcmVhdGVBY3Rpb24oYSkpO1xuXG5leHBvcnQge3RvZ2dsZVNpZGVQYW5lbCwgdG9nZ2xlTW9kYWwsIG9wZW5EZWxldGVNb2RhbH07XG4iXX0=