"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  background-color: transparent;\n  border: none;\n  cursor: pointer;\n  outline: none;\n  transition: ", ";\n  height: 2rem;\n  display: flex;\n  align-items: center;\n  padding: 0;\n\n  &:hover {\n    opacity: 0.8;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledButton = _styledComponents["default"].button(_templateObject(), function (props) {
  return props.theme.optionButtonColor;
}, function (props) {
  return props.theme.transition;
});

var noop = function noop() {};

var TableHeaderButton = function TableHeaderButton(_ref) {
  var _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? noop : _ref$onClick,
      disabled = _ref.disabled,
      text = _ref.text,
      children = _ref.children,
      props = (0, _objectWithoutProperties2["default"])(_ref, ["onClick", "disabled", "text", "children"]);
  return _react["default"].createElement(StyledButton, (0, _extends2["default"])({}, props, {
    onClick: disabled ? null : onClick
  }), text || children);
};

var _default = TableHeaderButton;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2J1dHRvbi5qcyJdLCJuYW1lcyI6WyJTdHlsZWRCdXR0b24iLCJzdHlsZWQiLCJidXR0b24iLCJwcm9wcyIsInRoZW1lIiwib3B0aW9uQnV0dG9uQ29sb3IiLCJ0cmFuc2l0aW9uIiwibm9vcCIsIlRhYmxlSGVhZGVyQnV0dG9uIiwib25DbGljayIsImRpc2FibGVkIiwidGV4dCIsImNoaWxkcmVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBR0MsNkJBQU9DLE1BQVYsb0JBQ1AsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxpQkFBaEI7QUFBQSxDQURFLEVBTUYsVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxVQUFoQjtBQUFBLENBTkgsQ0FBbEI7O0FBZ0JBLElBQU1DLElBQUksR0FBRyxTQUFQQSxJQUFPLEdBQU0sQ0FBRSxDQUFyQjs7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CO0FBQUEsMEJBQUVDLE9BQUY7QUFBQSxNQUFFQSxPQUFGLDZCQUFZRixJQUFaO0FBQUEsTUFBa0JHLFFBQWxCLFFBQWtCQSxRQUFsQjtBQUFBLE1BQTRCQyxJQUE1QixRQUE0QkEsSUFBNUI7QUFBQSxNQUFrQ0MsUUFBbEMsUUFBa0NBLFFBQWxDO0FBQUEsTUFBK0NULEtBQS9DO0FBQUEsU0FDeEIsZ0NBQUMsWUFBRCxnQ0FBa0JBLEtBQWxCO0FBQXlCLElBQUEsT0FBTyxFQUFFTyxRQUFRLEdBQUcsSUFBSCxHQUFVRDtBQUFwRCxNQUNHRSxJQUFJLElBQUlDLFFBRFgsQ0FEd0I7QUFBQSxDQUExQjs7ZUFNZUosaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFN0eWxlZEJ1dHRvbiA9IHN0eWxlZC5idXR0b25gXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm9wdGlvbkJ1dHRvbkNvbG9yfTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvdXRsaW5lOiBub25lO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBoZWlnaHQ6IDJyZW07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDA7XG5cbiAgJjpob3ZlciB7XG4gICAgb3BhY2l0eTogMC44O1xuICB9XG5gO1xuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuY29uc3QgVGFibGVIZWFkZXJCdXR0b24gPSAoe29uQ2xpY2sgPSBub29wLCBkaXNhYmxlZCwgdGV4dCwgY2hpbGRyZW4sIC4uLnByb3BzfSkgPT4gKFxuICA8U3R5bGVkQnV0dG9uIHsuLi5wcm9wc30gb25DbGljaz17ZGlzYWJsZWQgPyBudWxsIDogb25DbGlja30+XG4gICAge3RleHQgfHwgY2hpbGRyZW59XG4gIDwvU3R5bGVkQnV0dG9uPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgVGFibGVIZWFkZXJCdXR0b247XG4iXX0=