"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _base = _interopRequireDefault(require("../../components/common/icons/base"));

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var PointLayerIcon =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PointLayerIcon, _Component);

  function PointLayerIcon() {
    (0, _classCallCheck2["default"])(this, PointLayerIcon);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PointLayerIcon).apply(this, arguments));
  }

  (0, _createClass2["default"])(PointLayerIcon, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("circle", {
        cx: "29.4",
        cy: "31.6",
        r: "8.4",
        className: "cr1"
      }), _react["default"].createElement("circle", {
        cx: "48.5",
        cy: "15.7",
        r: "6.5",
        className: "cr2"
      }), _react["default"].createElement("circle", {
        cx: "11",
        cy: "44.2",
        r: "3",
        className: "cr3"
      }), _react["default"].createElement("circle", {
        cx: "50",
        cy: "44.2",
        r: "5",
        className: "cr4"
      }), _react["default"].createElement("circle", {
        cx: "34",
        cy: "54.2",
        r: "3",
        className: "cr5"
      }), _react["default"].createElement("circle", {
        cx: "14",
        cy: "16.2",
        r: "4",
        className: "cr6"
      }));
    }
  }]);
  return PointLayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(PointLayerIcon, "propTypes", {
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(PointLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'point-layer-icon',
  totalColor: 6
});
var _default = PointLayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXItaWNvbi5qcyJdLCJuYW1lcyI6WyJQb2ludExheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFNTUEsYzs7Ozs7Ozs7Ozs7OzZCQVlLO0FBQ1AsYUFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsRUFDRTtBQUFRLFFBQUEsRUFBRSxFQUFDLE1BQVg7QUFBa0IsUUFBQSxFQUFFLEVBQUMsTUFBckI7QUFBNEIsUUFBQSxDQUFDLEVBQUMsS0FBOUI7QUFBb0MsUUFBQSxTQUFTLEVBQUM7QUFBOUMsUUFERixFQUVFO0FBQVEsUUFBQSxFQUFFLEVBQUMsTUFBWDtBQUFrQixRQUFBLEVBQUUsRUFBQyxNQUFyQjtBQUE0QixRQUFBLENBQUMsRUFBQyxLQUE5QjtBQUFvQyxRQUFBLFNBQVMsRUFBQztBQUE5QyxRQUZGLEVBR0U7QUFBUSxRQUFBLEVBQUUsRUFBQyxJQUFYO0FBQWdCLFFBQUEsRUFBRSxFQUFDLE1BQW5CO0FBQTBCLFFBQUEsQ0FBQyxFQUFDLEdBQTVCO0FBQWdDLFFBQUEsU0FBUyxFQUFDO0FBQTFDLFFBSEYsRUFJRTtBQUFRLFFBQUEsRUFBRSxFQUFDLElBQVg7QUFBZ0IsUUFBQSxFQUFFLEVBQUMsTUFBbkI7QUFBMEIsUUFBQSxDQUFDLEVBQUMsR0FBNUI7QUFBZ0MsUUFBQSxTQUFTLEVBQUM7QUFBMUMsUUFKRixFQUtFO0FBQVEsUUFBQSxFQUFFLEVBQUMsSUFBWDtBQUFnQixRQUFBLEVBQUUsRUFBQyxNQUFuQjtBQUEwQixRQUFBLENBQUMsRUFBQyxHQUE1QjtBQUFnQyxRQUFBLFNBQVMsRUFBQztBQUExQyxRQUxGLEVBTUU7QUFBUSxRQUFBLEVBQUUsRUFBQyxJQUFYO0FBQWdCLFFBQUEsRUFBRSxFQUFDLE1BQW5CO0FBQTBCLFFBQUEsQ0FBQyxFQUFDLEdBQTVCO0FBQWdDLFFBQUEsU0FBUyxFQUFDO0FBQTFDLFFBTkYsQ0FERjtBQVVEOzs7RUF2QjBCQyxnQjs7aUNBQXZCRixjLGVBQ2U7QUFDakJHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BREQ7QUFFakJDLEVBQUFBLE1BQU0sRUFBRUYsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVQyxNQUE1QjtBQUZTLEM7aUNBRGZMLGMsa0JBTWtCO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkssRUFBQUEsbUJBQW1CLEVBQUUsa0JBRkQ7QUFHcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUhRLEM7ZUFvQlRULGMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuY2xhc3MgUG9pbnRMYXllckljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb2xvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAncG9pbnQtbGF5ZXItaWNvbicsXG4gICAgdG90YWxDb2xvcjogNlxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMjkuNFwiIGN5PVwiMzEuNlwiIHI9XCI4LjRcIiBjbGFzc05hbWU9XCJjcjFcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiNDguNVwiIGN5PVwiMTUuN1wiIHI9XCI2LjVcIiBjbGFzc05hbWU9XCJjcjJcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjQ0LjJcIiByPVwiM1wiIGNsYXNzTmFtZT1cImNyM1wiIC8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNDQuMlwiIHI9XCI1XCIgY2xhc3NOYW1lPVwiY3I0XCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjM0XCIgY3k9XCI1NC4yXCIgcj1cIjNcIiBjbGFzc05hbWU9XCJjcjVcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTRcIiBjeT1cIjE2LjJcIiByPVwiNFwiIGNsYXNzTmFtZT1cImNyNlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2ludExheWVySWNvbjtcbiJdfQ==