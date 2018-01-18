'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeAddDataModel = exports.onOpenDeleteModal = exports.onToggleModal = exports.onToggleSidePanel = exports.INITIAL_UI_STATE = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _handleActions;

var _reduxActions = require('redux-actions');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUERY_BEGIN = _actionTypes2.default.QUERY_BEGIN,
    TOGGLE_SIDE_PANEL = _actionTypes2.default.TOGGLE_SIDE_PANEL,
    TOGGLE_MODAL = _actionTypes2.default.TOGGLE_MODAL,
    OPEN_DELETE_MODAL = _actionTypes2.default.OPEN_DELETE_MODAL,
    UPDATE_SAVING_STATUS = _actionTypes2.default.UPDATE_SAVING_STATUS;
var INITIAL_UI_STATE = exports.INITIAL_UI_STATE = {
  activeSidePanel: null,
  isNavCollapsed: false,
  currentModal: 'addData',
  datasetKeyToRemove: null
};

/* Transition Functions */
var onToggleSidePanel = exports.onToggleSidePanel = function onToggleSidePanel(state, _ref) {
  var id = _ref.payload;

  if (id === state.activeSidePanel) {
    return state;
  }

  if (id === _defaultSettings.LAYER_CONFIG_ID) {
    return (0, _extends3.default)({}, state, {
      isNavCollapsed: true,
      currentModal: id
    });
  }

  return (0, _extends3.default)({}, state, {
    isNavCollapsed: true,
    activeSidePanel: id
  });
};

var onToggleModal = exports.onToggleModal = function onToggleModal(state, _ref2) {
  var id = _ref2.payload;
  return (0, _extends3.default)({}, state, {
    currentModal: id
  });
};

var onOpenDeleteModal = exports.onOpenDeleteModal = function onOpenDeleteModal(state, _ref3) {
  var datasetKeyToRemove = _ref3.payload;
  return (0, _extends3.default)({}, state, {
    currentModal: _defaultSettings.DELETE_DATA_ID,
    datasetKeyToRemove: datasetKeyToRemove
  });
};

var closeAddDataModel = exports.closeAddDataModel = function closeAddDataModel(state) {
  return (0, _extends3.default)({}, state, {
    currentModal: false // we always set to false since we show the dialog at the beginning
  });
};

/* Reducer */
var uiStateReducer = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[TOGGLE_SIDE_PANEL] = onToggleSidePanel, _handleActions[TOGGLE_MODAL] = onToggleModal, _handleActions[OPEN_DELETE_MODAL] = onOpenDeleteModal, _handleActions[QUERY_BEGIN] = closeAddDataModel, _handleActions[UPDATE_SAVING_STATUS] = closeAddDataModel, _handleActions), INITIAL_UI_STATE);

exports.default = uiStateReducer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy91aS1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJRVUVSWV9CRUdJTiIsIlRPR0dMRV9TSURFX1BBTkVMIiwiVE9HR0xFX01PREFMIiwiT1BFTl9ERUxFVEVfTU9EQUwiLCJVUERBVEVfU0FWSU5HX1NUQVRVUyIsIklOSVRJQUxfVUlfU1RBVEUiLCJhY3RpdmVTaWRlUGFuZWwiLCJpc05hdkNvbGxhcHNlZCIsImN1cnJlbnRNb2RhbCIsImRhdGFzZXRLZXlUb1JlbW92ZSIsIm9uVG9nZ2xlU2lkZVBhbmVsIiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJvblRvZ2dsZU1vZGFsIiwib25PcGVuRGVsZXRlTW9kYWwiLCJjbG9zZUFkZERhdGFNb2RlbCIsInVpU3RhdGVSZWR1Y2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztJQUdFQSxXLHlCQUFBQSxXO0lBQ0FDLGlCLHlCQUFBQSxpQjtJQUNBQyxZLHlCQUFBQSxZO0lBQ0FDLGlCLHlCQUFBQSxpQjtJQUNBQyxvQix5QkFBQUEsb0I7QUFHSyxJQUFNQyw4Q0FBbUI7QUFDOUJDLG1CQUFpQixJQURhO0FBRTlCQyxrQkFBZ0IsS0FGYztBQUc5QkMsZ0JBQWMsU0FIZ0I7QUFJOUJDLHNCQUFvQjtBQUpVLENBQXpCOztBQU9QO0FBQ08sSUFBTUMsZ0RBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQ0MsS0FBRCxRQUEwQjtBQUFBLE1BQVJDLEVBQVEsUUFBakJDLE9BQWlCOztBQUN6RCxNQUFJRCxPQUFPRCxNQUFNTCxlQUFqQixFQUFrQztBQUNoQyxXQUFPSyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsdUNBQUosRUFBNEI7QUFDMUIsc0NBQ0tELEtBREw7QUFFRUosc0JBQWdCLElBRmxCO0FBR0VDLG9CQUFjSTtBQUhoQjtBQUtEOztBQUVELG9DQUNLRCxLQURMO0FBRUVKLG9CQUFnQixJQUZsQjtBQUdFRCxxQkFBaUJNO0FBSG5CO0FBS0QsQ0FsQk07O0FBb0JBLElBQU1FLHdDQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0gsS0FBRDtBQUFBLE1BQWtCQyxFQUFsQixTQUFTQyxPQUFUO0FBQUEsb0NBQ3hCRixLQUR3QjtBQUUzQkgsa0JBQWNJO0FBRmE7QUFBQSxDQUF0Qjs7QUFLQSxJQUFNRyxnREFBb0IsU0FBcEJBLGlCQUFvQixDQUFDSixLQUFEO0FBQUEsTUFBa0JGLGtCQUFsQixTQUFTSSxPQUFUO0FBQUEsb0NBQzVCRixLQUQ0QjtBQUUvQkgsaURBRitCO0FBRy9CQztBQUgrQjtBQUFBLENBQTFCOztBQU1BLElBQU1PLGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQUNMLEtBQUQ7QUFBQSxvQ0FDNUJBLEtBRDRCO0FBRS9CSCxrQkFBYyxLQUZpQixDQUVYO0FBRlc7QUFBQSxDQUExQjs7QUFLUDtBQUNBLElBQU1TLGlCQUFpQixzRUFDcEJoQixpQkFEb0IsSUFDQVMsaUJBREEsaUJBRXBCUixZQUZvQixJQUVMWSxhQUZLLGlCQUdwQlgsaUJBSG9CLElBR0FZLGlCQUhBLGlCQUlwQmYsV0FKb0IsSUFJTmdCLGlCQUpNLGlCQUtwQlosb0JBTG9CLElBS0dZLGlCQUxILG1CQU1wQlgsZ0JBTm9CLENBQXZCOztrQkFRZVksYyIsImZpbGUiOiJ1aS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGFuZGxlQWN0aW9uc30gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQge0xBWUVSX0NPTkZJR19JRCwgREVMRVRFX0RBVEFfSUR9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3Qge1xuICBRVUVSWV9CRUdJTixcbiAgVE9HR0xFX1NJREVfUEFORUwsXG4gIFRPR0dMRV9NT0RBTCxcbiAgT1BFTl9ERUxFVEVfTU9EQUwsXG4gIFVQREFURV9TQVZJTkdfU1RBVFVTXG59ID0gQWN0aW9uVHlwZXM7XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX1VJX1NUQVRFID0ge1xuICBhY3RpdmVTaWRlUGFuZWw6IG51bGwsXG4gIGlzTmF2Q29sbGFwc2VkOiBmYWxzZSxcbiAgY3VycmVudE1vZGFsOiAnYWRkRGF0YScsXG4gIGRhdGFzZXRLZXlUb1JlbW92ZTogbnVsbFxufTtcblxuLyogVHJhbnNpdGlvbiBGdW5jdGlvbnMgKi9cbmV4cG9ydCBjb25zdCBvblRvZ2dsZVNpZGVQYW5lbCA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4ge1xuICBpZiAoaWQgPT09IHN0YXRlLmFjdGl2ZVNpZGVQYW5lbCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGlmIChpZCA9PT0gTEFZRVJfQ09ORklHX0lEKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgaXNOYXZDb2xsYXBzZWQ6IHRydWUsXG4gICAgICBjdXJyZW50TW9kYWw6IGlkXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc05hdkNvbGxhcHNlZDogdHJ1ZSxcbiAgICBhY3RpdmVTaWRlUGFuZWw6IGlkXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgb25Ub2dnbGVNb2RhbCA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGN1cnJlbnRNb2RhbDogaWRcbn0pO1xuXG5leHBvcnQgY29uc3Qgb25PcGVuRGVsZXRlTW9kYWwgPSAoc3RhdGUsIHtwYXlsb2FkOiBkYXRhc2V0S2V5VG9SZW1vdmV9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY3VycmVudE1vZGFsOiBERUxFVEVfREFUQV9JRCxcbiAgZGF0YXNldEtleVRvUmVtb3ZlXG59KTtcblxuZXhwb3J0IGNvbnN0IGNsb3NlQWRkRGF0YU1vZGVsID0gKHN0YXRlKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY3VycmVudE1vZGFsOiBmYWxzZSAvLyB3ZSBhbHdheXMgc2V0IHRvIGZhbHNlIHNpbmNlIHdlIHNob3cgdGhlIGRpYWxvZyBhdCB0aGUgYmVnaW5uaW5nXG59KTtcblxuLyogUmVkdWNlciAqL1xuY29uc3QgdWlTdGF0ZVJlZHVjZXIgPSBoYW5kbGVBY3Rpb25zKHtcbiAgW1RPR0dMRV9TSURFX1BBTkVMXTogb25Ub2dnbGVTaWRlUGFuZWwsXG4gIFtUT0dHTEVfTU9EQUxdOiBvblRvZ2dsZU1vZGFsLFxuICBbT1BFTl9ERUxFVEVfTU9EQUxdOiBvbk9wZW5EZWxldGVNb2RhbCxcbiAgW1FVRVJZX0JFR0lOXTogY2xvc2VBZGREYXRhTW9kZWwsXG4gIFtVUERBVEVfU0FWSU5HX1NUQVRVU106IGNsb3NlQWRkRGF0YU1vZGVsXG59LCBJTklUSUFMX1VJX1NUQVRFKTtcblxuZXhwb3J0IGRlZmF1bHQgdWlTdGF0ZVJlZHVjZXI7XG4iXX0=