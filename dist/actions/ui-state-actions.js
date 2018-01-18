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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3VpLXN0YXRlLWFjdGlvbnMuanMiXSwibmFtZXMiOlsiVE9HR0xFX1NJREVfUEFORUwiLCJUT0dHTEVfTU9EQUwiLCJPUEVOX0RFTEVURV9NT0RBTCIsIm1hcCIsImEiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ0b2dnbGVNb2RhbCIsIm9wZW5EZWxldGVNb2RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7SUFHRUEsaUIseUJBQUFBLGlCO0lBQ0FDLFkseUJBQUFBLFk7SUFDQUMsaUIseUJBQUFBLGlCOztBQUdGOztXQUtJLENBQ0ZGLGlCQURFLEVBRUZDLFlBRkUsRUFHRkMsaUJBSEUsRUFJRkMsR0FKRSxDQUlFO0FBQUEsU0FBSyxnQ0FBYUMsQ0FBYixDQUFMO0FBQUEsQ0FKRixDO0lBSEZDLGU7SUFDQUMsVztJQUNBQyxlOztRQVFBRixlLEdBQUFBLGU7UUFDQUMsVyxHQUFBQSxXO1FBQ0FDLGUsR0FBQUEsZSIsImZpbGUiOiJ1aS1zdGF0ZS1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG5jb25zdCB7XG4gIFRPR0dMRV9TSURFX1BBTkVMLFxuICBUT0dHTEVfTU9EQUwsXG4gIE9QRU5fREVMRVRFX01PREFMXG59ID0gQWN0aW9uVHlwZXM7XG5cbi8vIHNlY29uZCBhcmd1bWVudCBvZiBjcmVhdGVBY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgcGF5bG9hZENyZWF0b3Igb3IgdW5kZWZpbmVkXG5jb25zdCBbXG4gIHRvZ2dsZVNpZGVQYW5lbCxcbiAgdG9nZ2xlTW9kYWwsXG4gIG9wZW5EZWxldGVNb2RhbFxuXSA9IFtcbiAgVE9HR0xFX1NJREVfUEFORUwsXG4gIFRPR0dMRV9NT0RBTCxcbiAgT1BFTl9ERUxFVEVfTU9EQUxcbl0ubWFwKGEgPT4gY3JlYXRlQWN0aW9uKGEpKTtcblxuZXhwb3J0IHtcbiAgdG9nZ2xlU2lkZVBhbmVsLFxuICB0b2dnbGVNb2RhbCxcbiAgb3BlbkRlbGV0ZU1vZGFsXG59O1xuIl19