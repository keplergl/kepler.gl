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

var _base = _interopRequireDefault(require("./base"));

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
var Rectangle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Rectangle, _Component);

  function Rectangle() {
    (0, _classCallCheck2["default"])(this, Rectangle);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Rectangle).apply(this, arguments));
  }

  (0, _createClass2["default"])(Rectangle, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("rect", {
        x: "2",
        y: "2",
        width: "18",
        height: "12",
        stroke: "currentColor",
        fill: "transparent",
        strokeWidth: "1.5"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 16C3.10457 16 4 15.1046 4 14C4 12.8954 3.10457 12 2 12C0.89543 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20 16C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12C18.8954 12 18 12.8954 18 14C18 15.1046 18.8954 16 20 16Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20 4C21.1046 4 22 3.10457 22 2C22 0.89543 21.1046 0 20 0C18.8954 0 18 0.89543 18 2C18 3.10457 18.8954 4 20 4Z"
      }));
    }
  }]);
  return Rectangle;
}(_react.Component);

exports["default"] = Rectangle;
(0, _defineProperty2["default"])(Rectangle, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  predefinedClassName: _propTypes["default"].string,
  viewBox: _propTypes["default"].string,
  style: _propTypes["default"].object
});
(0, _defineProperty2["default"])(Rectangle, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-rectangle',
  viewBox: '0 0 22 16'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9yZWN0YW5nbGUuanMiXSwibmFtZXMiOlsiUmVjdGFuZ2xlIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidmlld0JveCIsInN0eWxlIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFNcUJBLFM7Ozs7Ozs7Ozs7Ozs2QkFlVjtBQUNQLGFBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLEVBQ0U7QUFDRSxRQUFBLENBQUMsRUFBQyxHQURKO0FBRUUsUUFBQSxDQUFDLEVBQUMsR0FGSjtBQUdFLFFBQUEsS0FBSyxFQUFDLElBSFI7QUFJRSxRQUFBLE1BQU0sRUFBQyxJQUpUO0FBS0UsUUFBQSxNQUFNLEVBQUMsY0FMVDtBQU1FLFFBQUEsSUFBSSxFQUFDLGFBTlA7QUFPRSxRQUFBLFdBQVcsRUFBQztBQVBkLFFBREYsRUFVRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQVZGLEVBZUU7QUFDRSxRQUFBLFFBQVEsRUFBQyxTQURYO0FBRUUsUUFBQSxRQUFRLEVBQUMsU0FGWDtBQUdFLFFBQUEsQ0FBQyxFQUFDO0FBSEosUUFmRixFQW9CRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQXBCRixFQXlCRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQXpCRixDQURGO0FBaUNEOzs7RUFqRG9DQyxnQjs7O2lDQUFsQkYsUyxlQUNBO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BRkQ7QUFHakJDLEVBQUFBLG1CQUFtQixFQUFFRixzQkFBVUMsTUFIZDtBQUlqQkUsRUFBQUEsT0FBTyxFQUFFSCxzQkFBVUMsTUFKRjtBQUtqQkcsRUFBQUEsS0FBSyxFQUFFSixzQkFBVUs7QUFMQSxDO2lDQURBVCxTLGtCQVNHO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkcsRUFBQUEsbUJBQW1CLEVBQUUseUJBRkQ7QUFHcEJDLEVBQUFBLE9BQU8sRUFBRTtBQUhXLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHZpZXdCb3g6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3RcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXJlY3RhbmdsZScsXG4gICAgdmlld0JveDogJzAgMCAyMiAxNidcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHJlY3RcbiAgICAgICAgICB4PVwiMlwiXG4gICAgICAgICAgeT1cIjJcIlxuICAgICAgICAgIHdpZHRoPVwiMThcIlxuICAgICAgICAgIGhlaWdodD1cIjEyXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgIGZpbGw9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBkPVwiTTIgNEMzLjEwNDU3IDQgNCAzLjEwNDU3IDQgMkM0IDAuODk1NDMgMy4xMDQ1NyAwIDIgMEMwLjg5NTQzIDAgMCAwLjg5NTQzIDAgMkMwIDMuMTA0NTcgMC44OTU0MyA0IDIgNFpcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBkPVwiTTIgMTZDMy4xMDQ1NyAxNiA0IDE1LjEwNDYgNCAxNEM0IDEyLjg5NTQgMy4xMDQ1NyAxMiAyIDEyQzAuODk1NDMgMTIgMCAxMi44OTU0IDAgMTRDMCAxNS4xMDQ2IDAuODk1NDMgMTYgMiAxNlpcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBkPVwiTTIwIDE2QzIxLjEwNDYgMTYgMjIgMTUuMTA0NiAyMiAxNEMyMiAxMi44OTU0IDIxLjEwNDYgMTIgMjAgMTJDMTguODk1NCAxMiAxOCAxMi44OTU0IDE4IDE0QzE4IDE1LjEwNDYgMTguODk1NCAxNiAyMCAxNlpcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBkPVwiTTIwIDRDMjEuMTA0NiA0IDIyIDMuMTA0NTcgMjIgMkMyMiAwLjg5NTQzIDIxLjEwNDYgMCAyMCAwQzE4Ljg5NTQgMCAxOCAwLjg5NTQzIDE4IDJDMTggMy4xMDQ1NyAxOC44OTU0IDQgMjAgNFpcIlxuICAgICAgICAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==