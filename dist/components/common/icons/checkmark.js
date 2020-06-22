"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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
var Checkmark =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Checkmark, _Component);

  function Checkmark() {
    (0, _classCallCheck2["default"])(this, Checkmark);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Checkmark).apply(this, arguments));
  }

  (0, _createClass2["default"])(Checkmark, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], (0, _extends2["default"])({
        viewBox: "0 0 42 42"
      }, this.props), _react["default"].createElement("path", {
        d: "M16,0C7.163,0,0,7.163,0,16c0,8.837,7.163,16,16,16c8.836,0,16-7.164,16-16C32,7.163,24.836,0,16,0z M16,30   C8.268,30,2,23.732,2,16C2,8.268,8.268,2,16,2s14,6.268,14,14C30,23.732,23.732,30,16,30z"
      }), _react["default"].createElement("path", {
        d: "M23.3,10.393L13.012,20.589l-4.281-4.196c-0.394-0.391-1.034-0.391-1.428,0   c-0.395,0.391-0.395,1.024,0,1.414l4.999,4.899c0.41,0.361,1.023,0.401,1.428,0l10.999-10.899c0.394-0.39,0.394-1.024,0-1.414   C24.334,10.003,23.695,10.003,23.3,10.393z"
      }));
    }
  }]);
  return Checkmark;
}(_react.Component);

exports["default"] = Checkmark;
(0, _defineProperty2["default"])(Checkmark, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Checkmark, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-checkmark',
  stroke: '#FFF'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jaGVja21hcmsuanMiXSwibmFtZXMiOlsiQ2hlY2ttYXJrIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwic3Ryb2tlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQU1xQkEsUzs7Ozs7Ozs7Ozs7OzZCQVlWO0FBQ1AsYUFDRSxnQ0FBQyxnQkFBRDtBQUFNLFFBQUEsT0FBTyxFQUFDO0FBQWQsU0FBOEIsS0FBS0MsS0FBbkMsR0FDRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFERixFQUVFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQUZGLENBREY7QUFNRDs7O0VBbkJvQ0MsZ0I7OztpQ0FBbEJGLFMsZUFDQTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQUZELEM7aUNBREFMLFMsa0JBTUc7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRSx5QkFGRDtBQUdwQkMsRUFBQUEsTUFBTSxFQUFFO0FBSFksQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNrbWFyayBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1jaGVja21hcmsnLFxuICAgIHN0cm9rZTogJyNGRkYnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB2aWV3Qm94PVwiMCAwIDQyIDQyXCIgey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2LDBDNy4xNjMsMCwwLDcuMTYzLDAsMTZjMCw4LjgzNyw3LjE2MywxNiwxNiwxNmM4LjgzNiwwLDE2LTcuMTY0LDE2LTE2QzMyLDcuMTYzLDI0LjgzNiwwLDE2LDB6IE0xNiwzMCAgIEM4LjI2OCwzMCwyLDIzLjczMiwyLDE2QzIsOC4yNjgsOC4yNjgsMiwxNiwyczE0LDYuMjY4LDE0LDE0QzMwLDIzLjczMiwyMy43MzIsMzAsMTYsMzB6XCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yMy4zLDEwLjM5M0wxMy4wMTIsMjAuNTg5bC00LjI4MS00LjE5NmMtMC4zOTQtMC4zOTEtMS4wMzQtMC4zOTEtMS40MjgsMCAgIGMtMC4zOTUsMC4zOTEtMC4zOTUsMS4wMjQsMCwxLjQxNGw0Ljk5OSw0Ljg5OWMwLjQxLDAuMzYxLDEuMDIzLDAuNDAxLDEuNDI4LDBsMTAuOTk5LTEwLjg5OWMwLjM5NC0wLjM5LDAuMzk0LTEuMDI0LDAtMS40MTQgICBDMjQuMzM0LDEwLjAwMywyMy42OTUsMTAuMDAzLDIzLjMsMTAuMzkzelwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19