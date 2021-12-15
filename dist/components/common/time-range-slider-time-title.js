"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("./icons");

var _dataUtils = require("../../utils/data-utils");

var _templateObject;

var TimeValueWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  font-size: ", ";\n  justify-content: ", ";\n\n  .horizontal-bar {\n    padding: 0 12px;\n    color: ", ";\n  }\n\n  .time-value {\n    display: flex;\n    flex-direction: ", ";\n    align-items: flex-start;\n    max-width: ", ";\n    span {\n      color: ", ";\n    }\n  }\n\n  .time-value:last-child {\n    align-items: flex-end;\n    text-align: right;\n  }\n"])), function (props) {
  return props.theme.timeTitleFontSize;
}, function (props) {
  return props.isEnlarged ? 'center' : 'space-between';
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.isEnlarged ? 'row' : 'column';
}, function (props) {
  return !props.isEnlarged ? '40%' : 'auto';
}, function (props) {
  return props.theme.textColor;
});

var TimeValue = function TimeValue(_ref) {
  var value = _ref.value;
  return (
    /*#__PURE__*/
    // render two lines if not enlarged
    _react["default"].createElement("div", {
      className: "time-value"
    }, /*#__PURE__*/_react["default"].createElement("span", null, value))
  );
};

function TimeRangeSliderTimeTitleFactory() {
  var TimeTitle = function TimeTitle(_ref2) {
    var value = _ref2.value,
        isEnlarged = _ref2.isEnlarged,
        timezone = _ref2.timezone,
        timeFormat = _ref2.timeFormat;
    return /*#__PURE__*/_react["default"].createElement(TimeValueWrapper, {
      isEnlarged: isEnlarged,
      className: "time-range-slider__time-title"
    }, /*#__PURE__*/_react["default"].createElement(TimeValue, {
      key: 0,
      value: (0, _dataUtils.datetimeFormatter)(timezone)(timeFormat)(value[0])
    }), isEnlarged ? /*#__PURE__*/_react["default"].createElement("div", {
      className: "horizontal-bar"
    }, /*#__PURE__*/_react["default"].createElement(_icons.Minus, {
      height: "12px"
    })) : null, /*#__PURE__*/_react["default"].createElement(TimeValue, {
      key: 1,
      value: (0, _dataUtils.datetimeFormatter)(timezone)(timeFormat)(value[1])
    }));
  };

  return TimeTitle;
}

var _default = TimeRangeSliderTimeTitleFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci10aW1lLXRpdGxlLmpzIl0sIm5hbWVzIjpbIlRpbWVWYWx1ZVdyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGltZVRpdGxlRm9udFNpemUiLCJpc0VubGFyZ2VkIiwidGV4dENvbG9yIiwiVGltZVZhbHVlIiwidmFsdWUiLCJUaW1lUmFuZ2VTbGlkZXJUaW1lVGl0bGVGYWN0b3J5IiwiVGltZVRpdGxlIiwidGltZXpvbmUiLCJ0aW1lRm9ybWF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLGdCQUFnQixHQUFHQyw2QkFBT0MsR0FBViw4ZUFHUCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGlCQUFoQjtBQUFBLENBSEUsRUFJRCxVQUFBRixLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDRyxVQUFOLEdBQW1CLFFBQW5CLEdBQThCLGVBQW5DO0FBQUEsQ0FKSixFQVFULFVBQUFILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsU0FBaEI7QUFBQSxDQVJJLEVBYUEsVUFBQUosS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0csVUFBTixHQUFtQixLQUFuQixHQUEyQixRQUFoQztBQUFBLENBYkwsRUFlTCxVQUFBSCxLQUFLO0FBQUEsU0FBSyxDQUFDQSxLQUFLLENBQUNHLFVBQVAsR0FBb0IsS0FBcEIsR0FBNEIsTUFBakM7QUFBQSxDQWZBLEVBaUJQLFVBQUFILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsU0FBaEI7QUFBQSxDQWpCRSxDQUF0Qjs7QUEyQkEsSUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVk7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQTtBQUFBO0FBQ2hCO0FBQ0E7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLDhDQUFPQSxLQUFQLENBREY7QUFGZ0I7QUFBQSxDQUFsQjs7QUFPQSxTQUFTQywrQkFBVCxHQUEyQztBQUN6QyxNQUFNQyxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLFFBQUVGLEtBQUYsU0FBRUEsS0FBRjtBQUFBLFFBQVNILFVBQVQsU0FBU0EsVUFBVDtBQUFBLFFBQXFCTSxRQUFyQixTQUFxQkEsUUFBckI7QUFBQSxRQUErQkMsVUFBL0IsU0FBK0JBLFVBQS9CO0FBQUEsd0JBQ2hCLGdDQUFDLGdCQUFEO0FBQWtCLE1BQUEsVUFBVSxFQUFFUCxVQUE5QjtBQUEwQyxNQUFBLFNBQVMsRUFBQztBQUFwRCxvQkFDRSxnQ0FBQyxTQUFEO0FBQVcsTUFBQSxHQUFHLEVBQUUsQ0FBaEI7QUFBbUIsTUFBQSxLQUFLLEVBQUUsa0NBQWtCTSxRQUFsQixFQUE0QkMsVUFBNUIsRUFBd0NKLEtBQUssQ0FBQyxDQUFELENBQTdDO0FBQTFCLE1BREYsRUFFR0gsVUFBVSxnQkFDVDtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsZ0NBQUMsWUFBRDtBQUFPLE1BQUEsTUFBTSxFQUFDO0FBQWQsTUFERixDQURTLEdBSVAsSUFOTixlQU9FLGdDQUFDLFNBQUQ7QUFBVyxNQUFBLEdBQUcsRUFBRSxDQUFoQjtBQUFtQixNQUFBLEtBQUssRUFBRSxrQ0FBa0JNLFFBQWxCLEVBQTRCQyxVQUE1QixFQUF3Q0osS0FBSyxDQUFDLENBQUQsQ0FBN0M7QUFBMUIsTUFQRixDQURnQjtBQUFBLEdBQWxCOztBQVlBLFNBQU9FLFNBQVA7QUFDRDs7ZUFFY0QsK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge01pbnVzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge2RhdGV0aW1lRm9ybWF0dGVyfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuY29uc3QgVGltZVZhbHVlV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aW1lVGl0bGVGb250U2l6ZX07XG4gIGp1c3RpZnktY29udGVudDogJHtwcm9wcyA9PiAocHJvcHMuaXNFbmxhcmdlZCA/ICdjZW50ZXInIDogJ3NwYWNlLWJldHdlZW4nKX07XG5cbiAgLmhvcml6b250YWwtYmFyIHtcbiAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgfVxuXG4gIC50aW1lLXZhbHVlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiAke3Byb3BzID0+IChwcm9wcy5pc0VubGFyZ2VkID8gJ3JvdycgOiAnY29sdW1uJyl9O1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIG1heC13aWR0aDogJHtwcm9wcyA9PiAoIXByb3BzLmlzRW5sYXJnZWQgPyAnNDAlJyA6ICdhdXRvJyl9O1xuICAgIHNwYW4ge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICB9XG4gIH1cblxuICAudGltZS12YWx1ZTpsYXN0LWNoaWxkIHtcbiAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIH1cbmA7XG5cbmNvbnN0IFRpbWVWYWx1ZSA9ICh7dmFsdWV9KSA9PiAoXG4gIC8vIHJlbmRlciB0d28gbGluZXMgaWYgbm90IGVubGFyZ2VkXG4gIDxkaXYgY2xhc3NOYW1lPVwidGltZS12YWx1ZVwiPlxuICAgIDxzcGFuPnt2YWx1ZX08L3NwYW4+XG4gIDwvZGl2PlxuKTtcblxuZnVuY3Rpb24gVGltZVJhbmdlU2xpZGVyVGltZVRpdGxlRmFjdG9yeSgpIHtcbiAgY29uc3QgVGltZVRpdGxlID0gKHt2YWx1ZSwgaXNFbmxhcmdlZCwgdGltZXpvbmUsIHRpbWVGb3JtYXR9KSA9PiAoXG4gICAgPFRpbWVWYWx1ZVdyYXBwZXIgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH0gY2xhc3NOYW1lPVwidGltZS1yYW5nZS1zbGlkZXJfX3RpbWUtdGl0bGVcIj5cbiAgICAgIDxUaW1lVmFsdWUga2V5PXswfSB2YWx1ZT17ZGF0ZXRpbWVGb3JtYXR0ZXIodGltZXpvbmUpKHRpbWVGb3JtYXQpKHZhbHVlWzBdKX0gLz5cbiAgICAgIHtpc0VubGFyZ2VkID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvcml6b250YWwtYmFyXCI+XG4gICAgICAgICAgPE1pbnVzIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgICAgPFRpbWVWYWx1ZSBrZXk9ezF9IHZhbHVlPXtkYXRldGltZUZvcm1hdHRlcih0aW1lem9uZSkodGltZUZvcm1hdCkodmFsdWVbMV0pfSAvPlxuICAgIDwvVGltZVZhbHVlV3JhcHBlcj5cbiAgKTtcblxuICByZXR1cm4gVGltZVRpdGxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lUmFuZ2VTbGlkZXJUaW1lVGl0bGVGYWN0b3J5O1xuIl19