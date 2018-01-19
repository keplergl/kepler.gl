'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _interactionPanel = require('./interaction-panel/interaction-panel');

var _interactionPanel2 = _interopRequireDefault(_interactionPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InteractionManager = function InteractionManager(_ref) {
  var interactionConfig = _ref.interactionConfig,
      datasets = _ref.datasets,
      onConfigChange = _ref.onConfigChange;
  return _react2.default.createElement(
    'div',
    null,
    Object.keys(interactionConfig).map(function (key) {
      return _react2.default.createElement(_interactionPanel2.default, {
        datasets: datasets,
        config: interactionConfig[key],
        key: key,
        onConfigChange: onConfigChange
      });
    })
  );
};

exports.default = InteractionManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJJbnRlcmFjdGlvbk1hbmFnZXIiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwib25Db25maWdDaGFuZ2UiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQUVDLGlCQUFGLFFBQUVBLGlCQUFGO0FBQUEsTUFBcUJDLFFBQXJCLFFBQXFCQSxRQUFyQjtBQUFBLE1BQStCQyxjQUEvQixRQUErQkEsY0FBL0I7QUFBQSxTQUN6QjtBQUFBO0FBQUE7QUFDR0MsV0FBT0MsSUFBUCxDQUFZSixpQkFBWixFQUErQkssR0FBL0IsQ0FBbUM7QUFBQSxhQUNsQztBQUNFLGtCQUFVSixRQURaO0FBRUUsZ0JBQVFELGtCQUFrQk0sR0FBbEIsQ0FGVjtBQUdFLGFBQUtBLEdBSFA7QUFJRSx3QkFBZ0JKO0FBSmxCLFFBRGtDO0FBQUEsS0FBbkM7QUFESCxHQUR5QjtBQUFBLENBQTNCOztrQkFhZUgsa0IiLCJmaWxlIjoiaW50ZXJhY3Rpb24tbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSW50ZXJhY3Rpb25QYW5lbCBmcm9tICcuL2ludGVyYWN0aW9uLXBhbmVsL2ludGVyYWN0aW9uLXBhbmVsJztcblxuY29uc3QgSW50ZXJhY3Rpb25NYW5hZ2VyID0gKHtpbnRlcmFjdGlvbkNvbmZpZywgZGF0YXNldHMsIG9uQ29uZmlnQ2hhbmdlfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtPYmplY3Qua2V5cyhpbnRlcmFjdGlvbkNvbmZpZykubWFwKGtleSA9PiAoXG4gICAgICA8SW50ZXJhY3Rpb25QYW5lbFxuICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgIGNvbmZpZz17aW50ZXJhY3Rpb25Db25maWdba2V5XX1cbiAgICAgICAga2V5PXtrZXl9XG4gICAgICAgIG9uQ29uZmlnQ2hhbmdlPXtvbkNvbmZpZ0NoYW5nZX1cbiAgICAgIC8+XG4gICAgKSl9XG4gIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJhY3Rpb25NYW5hZ2VyO1xuIl19