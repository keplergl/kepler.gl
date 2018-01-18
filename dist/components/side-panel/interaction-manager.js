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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJJbnRlcmFjdGlvbk1hbmFnZXIiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwib25Db25maWdDaGFuZ2UiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQzFCQyxpQkFEMEIsUUFDMUJBLGlCQUQwQjtBQUFBLE1BQ1BDLFFBRE8sUUFDUEEsUUFETztBQUFBLE1BQ0dDLGNBREgsUUFDR0EsY0FESDtBQUFBLFNBR3pCO0FBQUE7QUFBQTtBQUNHQyxXQUFPQyxJQUFQLENBQVlKLGlCQUFaLEVBQStCSyxHQUEvQixDQUFtQztBQUFBLGFBQ2xDO0FBQ0Usa0JBQVVKLFFBRFo7QUFFRSxnQkFBUUQsa0JBQWtCTSxHQUFsQixDQUZWO0FBR0UsYUFBS0EsR0FIUDtBQUlFLHdCQUFnQko7QUFKbEIsUUFEa0M7QUFBQSxLQUFuQztBQURILEdBSHlCO0FBQUEsQ0FBM0I7O2tCQWVlSCxrQiIsImZpbGUiOiJpbnRlcmFjdGlvbi1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJbnRlcmFjdGlvblBhbmVsIGZyb20gJy4vaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwnO1xuXG5jb25zdCBJbnRlcmFjdGlvbk1hbmFnZXIgPSAoe1xuIGludGVyYWN0aW9uQ29uZmlnLCBkYXRhc2V0cywgb25Db25maWdDaGFuZ2Vcbn0pID0+IChcbiAgPGRpdj5cbiAgICB7T2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Db25maWcpLm1hcChrZXkgPT4gKFxuICAgICAgPEludGVyYWN0aW9uUGFuZWxcbiAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICBjb25maWc9e2ludGVyYWN0aW9uQ29uZmlnW2tleV19XG4gICAgICAgIGtleT17a2V5fVxuICAgICAgICBvbkNvbmZpZ0NoYW5nZT17b25Db25maWdDaGFuZ2V9XG4gICAgICAvPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyYWN0aW9uTWFuYWdlcjtcbiJdfQ==