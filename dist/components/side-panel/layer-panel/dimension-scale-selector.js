'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('../../common/styled-components');

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DimensionScaleSelector = function DimensionScaleSelector(_ref) {
  var label = _ref.label,
      onSelect = _ref.onSelect,
      options = _ref.options,
      scaleType = _ref.scaleType,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === undefined ? false : _ref$disabled;

  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      label || 'Scale'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      disabled: disabled,
      selectedItems: scaleType,
      options: options,
      multiSelect: false,
      searchable: false,
      onChange: onSelect })
  );
};

exports.default = DimensionScaleSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yLmpzIl0sIm5hbWVzIjpbIkRpbWVuc2lvblNjYWxlU2VsZWN0b3IiLCJsYWJlbCIsIm9uU2VsZWN0Iiwib3B0aW9ucyIsInNjYWxlVHlwZSIsImRpc2FibGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx5QkFBeUIsU0FBekJBLHNCQUF5QixPQUE2RDtBQUFBLE1BQTNEQyxLQUEyRCxRQUEzREEsS0FBMkQ7QUFBQSxNQUFwREMsUUFBb0QsUUFBcERBLFFBQW9EO0FBQUEsTUFBMUNDLE9BQTBDLFFBQTFDQSxPQUEwQztBQUFBLE1BQWpDQyxTQUFpQyxRQUFqQ0EsU0FBaUM7QUFBQSwyQkFBdEJDLFFBQXNCO0FBQUEsTUFBdEJBLFFBQXNCLGlDQUFYLEtBQVc7O0FBQzFGLFNBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQWFKLGVBQVM7QUFBdEIsS0FERjtBQUVFO0FBQ0UsZ0JBQVVJLFFBRFo7QUFFRSxxQkFBZUQsU0FGakI7QUFHRSxlQUFTRCxPQUhYO0FBSUUsbUJBQWEsS0FKZjtBQUtFLGtCQUFZLEtBTGQ7QUFNRSxnQkFBVUQsUUFOWjtBQUZGLEdBREY7QUFZRCxDQWJEOztrQkFlZUYsc0IiLCJmaWxlIjoiZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuXG5jb25zdCBEaW1lbnNpb25TY2FsZVNlbGVjdG9yID0gKHtsYWJlbCwgb25TZWxlY3QsIG9wdGlvbnMsIHNjYWxlVHlwZSwgZGlzYWJsZWQgPSBmYWxzZX0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDxQYW5lbExhYmVsPntsYWJlbCB8fCAnU2NhbGUnfTwvUGFuZWxMYWJlbD5cbiAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBzZWxlY3RlZEl0ZW1zPXtzY2FsZVR5cGV9XG4gICAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICAgIG9uQ2hhbmdlPXtvblNlbGVjdH0vPlxuICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERpbWVuc2lvblNjYWxlU2VsZWN0b3I7XG4iXX0=