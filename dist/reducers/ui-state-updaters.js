'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openDeleteModalUpdater = exports.toggleModalUpdater = exports.toggleSidePanelUpdater = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Updaters */
var toggleSidePanelUpdater = exports.toggleSidePanelUpdater = function toggleSidePanelUpdater(state, _ref) {
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

var toggleModalUpdater = exports.toggleModalUpdater = function toggleModalUpdater(state, _ref2) {
  var id = _ref2.payload;
  return (0, _extends3.default)({}, state, {
    currentModal: id
  });
};

var openDeleteModalUpdater = exports.openDeleteModalUpdater = function openDeleteModalUpdater(state, _ref3) {
  var datasetKeyToRemove = _ref3.payload;
  return (0, _extends3.default)({}, state, {
    currentModal: _defaultSettings.DELETE_DATA_ID,
    datasetKeyToRemove: datasetKeyToRemove
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy91aS1zdGF0ZS11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJ0b2dnbGVTaWRlUGFuZWxVcGRhdGVyIiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJhY3RpdmVTaWRlUGFuZWwiLCJpc05hdkNvbGxhcHNlZCIsImN1cnJlbnRNb2RhbCIsInRvZ2dsZU1vZGFsVXBkYXRlciIsIm9wZW5EZWxldGVNb2RhbFVwZGF0ZXIiLCJkYXRhc2V0S2V5VG9SZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTtBQUNPLElBQU1BLDBEQUF5QixTQUF6QkEsc0JBQXlCLENBQUNDLEtBQUQsUUFBMEI7QUFBQSxNQUFSQyxFQUFRLFFBQWpCQyxPQUFpQjs7QUFDOUQsTUFBSUQsT0FBT0QsTUFBTUcsZUFBakIsRUFBa0M7QUFDaEMsV0FBT0gsS0FBUDtBQUNEOztBQUVELE1BQUlDLHVDQUFKLEVBQTRCO0FBQzFCLHNDQUNLRCxLQURMO0FBRUVJLHNCQUFnQixJQUZsQjtBQUdFQyxvQkFBY0o7QUFIaEI7QUFLRDs7QUFFRCxvQ0FDS0QsS0FETDtBQUVFSSxvQkFBZ0IsSUFGbEI7QUFHRUQscUJBQWlCRjtBQUhuQjtBQUtELENBbEJNOztBQW9CQSxJQUFNSyxrREFBcUIsU0FBckJBLGtCQUFxQixDQUFDTixLQUFEO0FBQUEsTUFBa0JDLEVBQWxCLFNBQVNDLE9BQVQ7QUFBQSxvQ0FDN0JGLEtBRDZCO0FBRWhDSyxrQkFBY0o7QUFGa0I7QUFBQSxDQUEzQjs7QUFLQSxJQUFNTSwwREFBeUIsU0FBekJBLHNCQUF5QixDQUNwQ1AsS0FEb0M7QUFBQSxNQUUxQlEsa0JBRjBCLFNBRW5DTixPQUZtQztBQUFBLG9DQUlqQ0YsS0FKaUM7QUFLcENLLGlEQUxvQztBQU1wQ0c7QUFOb0M7QUFBQSxDQUEvQiIsImZpbGUiOiJ1aS1zdGF0ZS11cGRhdGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TEFZRVJfQ09ORklHX0lELCBERUxFVEVfREFUQV9JRH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG4vKiBVcGRhdGVycyAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVNpZGVQYW5lbFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+IHtcbiAgaWYgKGlkID09PSBzdGF0ZS5hY3RpdmVTaWRlUGFuZWwpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBpZiAoaWQgPT09IExBWUVSX0NPTkZJR19JRCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGlzTmF2Q29sbGFwc2VkOiB0cnVlLFxuICAgICAgY3VycmVudE1vZGFsOiBpZFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGlzTmF2Q29sbGFwc2VkOiB0cnVlLFxuICAgIGFjdGl2ZVNpZGVQYW5lbDogaWRcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVNb2RhbFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjdXJyZW50TW9kYWw6IGlkXG59KTtcblxuZXhwb3J0IGNvbnN0IG9wZW5EZWxldGVNb2RhbFVwZGF0ZXIgPSAoXG4gIHN0YXRlLFxuICB7cGF5bG9hZDogZGF0YXNldEtleVRvUmVtb3ZlfVxuKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY3VycmVudE1vZGFsOiBERUxFVEVfREFUQV9JRCxcbiAgZGF0YXNldEtleVRvUmVtb3ZlXG59KTtcbiJdfQ==