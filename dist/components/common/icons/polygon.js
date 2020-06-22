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
var DrawPolygon =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(DrawPolygon, _Component);

  function DrawPolygon() {
    (0, _classCallCheck2["default"])(this, DrawPolygon);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DrawPolygon).apply(this, arguments));
  }

  (0, _createClass2["default"])(DrawPolygon, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9 2L18 6L20 16L2 13L9 2Z",
        stroke: "currentColor",
        fill: "transparent",
        strokeWidth: "1.5"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 15C3.10457 15 4 14.1046 4 13C4 11.8954 3.10457 11 2 11C0.89543 11 0 11.8954 0 13C0 14.1046 0.89543 15 2 15Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z"
      }), _react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6C16 7.10457 16.8954 8 18 8Z"
      }));
    }
  }]);
  return DrawPolygon;
}(_react.Component);

exports["default"] = DrawPolygon;
(0, _defineProperty2["default"])(DrawPolygon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  predefinedClassName: _propTypes["default"].string,
  viewBox: _propTypes["default"].string,
  style: _propTypes["default"].object
});
(0, _defineProperty2["default"])(DrawPolygon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-polygon',
  viewBox: '0 0 22 18'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9wb2x5Z29uLmpzIl0sIm5hbWVzIjpbIkRyYXdQb2x5Z29uIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidmlld0JveCIsInN0eWxlIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFNcUJBLFc7Ozs7Ozs7Ozs7Ozs2QkFlVjtBQUNQLGFBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLEVBQ0U7QUFDRSxRQUFBLFFBQVEsRUFBQyxTQURYO0FBRUUsUUFBQSxRQUFRLEVBQUMsU0FGWDtBQUdFLFFBQUEsQ0FBQyxFQUFDLDJCQUhKO0FBSUUsUUFBQSxNQUFNLEVBQUMsY0FKVDtBQUtFLFFBQUEsSUFBSSxFQUFDLGFBTFA7QUFNRSxRQUFBLFdBQVcsRUFBQztBQU5kLFFBREYsRUFTRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQVRGLEVBY0U7QUFDRSxRQUFBLFFBQVEsRUFBQyxTQURYO0FBRUUsUUFBQSxRQUFRLEVBQUMsU0FGWDtBQUdFLFFBQUEsQ0FBQyxFQUFDO0FBSEosUUFkRixFQW1CRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQW5CRixFQXdCRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQXhCRixDQURGO0FBZ0NEOzs7RUFoRHNDQyxnQjs7O2lDQUFwQkYsVyxlQUNBO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BRkQ7QUFHakJDLEVBQUFBLG1CQUFtQixFQUFFRixzQkFBVUMsTUFIZDtBQUlqQkUsRUFBQUEsT0FBTyxFQUFFSCxzQkFBVUMsTUFKRjtBQUtqQkcsRUFBQUEsS0FBSyxFQUFFSixzQkFBVUs7QUFMQSxDO2lDQURBVCxXLGtCQVNHO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkcsRUFBQUEsbUJBQW1CLEVBQUUsdUJBRkQ7QUFHcEJDLEVBQUFBLE9BQU8sRUFBRTtBQUhXLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmF3UG9seWdvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlld0JveDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtcG9seWdvbicsXG4gICAgdmlld0JveDogJzAgMCAyMiAxOCdcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgZD1cIk05IDJMMTggNkwyMCAxNkwyIDEzTDkgMlpcIlxuICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNOSA0QzEwLjEwNDYgNCAxMSAzLjEwNDU3IDExIDJDMTEgMC44OTU0MyAxMC4xMDQ2IDAgOSAwQzcuODk1NDMgMCA3IDAuODk1NDMgNyAyQzcgMy4xMDQ1NyA3Ljg5NTQzIDQgOSA0WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMiAxNUMzLjEwNDU3IDE1IDQgMTQuMTA0NiA0IDEzQzQgMTEuODk1NCAzLjEwNDU3IDExIDIgMTFDMC44OTU0MyAxMSAwIDExLjg5NTQgMCAxM0MwIDE0LjEwNDYgMC44OTU0MyAxNSAyIDE1WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMjAgMThDMjEuMTA0NiAxOCAyMiAxNy4xMDQ2IDIyIDE2QzIyIDE0Ljg5NTQgMjEuMTA0NiAxNCAyMCAxNEMxOC44OTU0IDE0IDE4IDE0Ljg5NTQgMTggMTZDMTggMTcuMTA0NiAxOC44OTU0IDE4IDIwIDE4WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMTggOEMxOS4xMDQ2IDggMjAgNy4xMDQ1NyAyMCA2QzIwIDQuODk1NDMgMTkuMTA0NiA0IDE4IDRDMTYuODk1NCA0IDE2IDQuODk1NDMgMTYgNkMxNiA3LjEwNDU3IDE2Ljg5NTQgOCAxOCA4WlwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19