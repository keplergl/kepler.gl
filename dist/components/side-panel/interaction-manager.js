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
    { className: 'interaction-manager' },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJJbnRlcmFjdGlvbk1hbmFnZXIiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwib25Db25maWdDaGFuZ2UiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQUVDLGlCQUFGLFFBQUVBLGlCQUFGO0FBQUEsTUFBcUJDLFFBQXJCLFFBQXFCQSxRQUFyQjtBQUFBLE1BQStCQyxjQUEvQixRQUErQkEsY0FBL0I7QUFBQSxTQUN6QjtBQUFBO0FBQUEsTUFBSyxXQUFVLHFCQUFmO0FBQ0dDLFdBQU9DLElBQVAsQ0FBWUosaUJBQVosRUFBK0JLLEdBQS9CLENBQW1DO0FBQUEsYUFDbEM7QUFDRSxrQkFBVUosUUFEWjtBQUVFLGdCQUFRRCxrQkFBa0JNLEdBQWxCLENBRlY7QUFHRSxhQUFLQSxHQUhQO0FBSUUsd0JBQWdCSjtBQUpsQixRQURrQztBQUFBLEtBQW5DO0FBREgsR0FEeUI7QUFBQSxDQUEzQjs7a0JBYWVILGtCIiwiZmlsZSI6ImludGVyYWN0aW9uLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEludGVyYWN0aW9uUGFuZWwgZnJvbSAnLi9pbnRlcmFjdGlvbi1wYW5lbC9pbnRlcmFjdGlvbi1wYW5lbCc7XG5cbmNvbnN0IEludGVyYWN0aW9uTWFuYWdlciA9ICh7aW50ZXJhY3Rpb25Db25maWcsIGRhdGFzZXRzLCBvbkNvbmZpZ0NoYW5nZX0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1tYW5hZ2VyXCI+XG4gICAge09iamVjdC5rZXlzKGludGVyYWN0aW9uQ29uZmlnKS5tYXAoa2V5ID0+IChcbiAgICAgIDxJbnRlcmFjdGlvblBhbmVsXG4gICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgY29uZmlnPXtpbnRlcmFjdGlvbkNvbmZpZ1trZXldfVxuICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgb25Db25maWdDaGFuZ2U9e29uQ29uZmlnQ2hhbmdlfVxuICAgICAgLz5cbiAgICApKX1cbiAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBJbnRlcmFjdGlvbk1hbmFnZXI7XG4iXX0=