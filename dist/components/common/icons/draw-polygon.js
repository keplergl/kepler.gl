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
        d: "M5 6L13 2L22 9L21 23L2 17L5 6Z",
        stroke: "currentColor",
        fill: "transparent",
        strokeWidth: "1.5"
      }), _react["default"].createElement("path", {
        d: "M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z"
      }), _react["default"].createElement("path", {
        d: "M11.5 16C12.3284 16 13 15.3284 13 14.5C13 13.6716 12.3284 13 11.5 13C10.6716 13 10 13.6716 10 14.5C10 15.3284 10.6716 16 11.5 16Z"
      }), _react["default"].createElement("path", {
        d: "M15.5 12C16.3284 12 17 11.3284 17 10.5C17 9.67157 16.3284 9 15.5 9C14.6716 9 14 9.67157 14 10.5C14 11.3284 14.6716 12 15.5 12Z"
      }), _react["default"].createElement("path", {
        d: "M22 11C23.1046 11 24 10.1046 24 9C24 7.89543 23.1046 7 22 7C20.8954 7 20 7.89543 20 9C20 10.1046 20.8954 11 22 11Z"
      }), _react["default"].createElement("path", {
        d: "M21 25C22.1046 25 23 24.1046 23 23C23 21.8954 22.1046 21 21 21C19.8954 21 19 21.8954 19 23C19 24.1046 19.8954 25 21 25Z"
      }), _react["default"].createElement("path", {
        d: "M2 19C3.10457 19 4 18.1046 4 17C4 15.8954 3.10457 15 2 15C0.89543 15 0 15.8954 0 17C0 18.1046 0.89543 19 2 19Z"
      }), _react["default"].createElement("path", {
        d: "M13 4C14.1046 4 15 3.10457 15 2C15 0.89543 14.1046 0 13 0C11.8954 0 11 0.89543 11 2C11 3.10457 11.8954 4 13 4Z"
      }), _react["default"].createElement("path", {
        d: "M5 8C6.10457 8 7 7.10457 7 6C7 4.89543 6.10457 4 5 4C3.89543 4 3 4.89543 3 6C3 7.10457 3.89543 8 5 8Z"
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
  predefinedClassName: 'data-ex-icons-draw-polygon',
  viewBox: '0 0 24 25'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9kcmF3LXBvbHlnb24uanMiXSwibmFtZXMiOlsiRHJhd1BvbHlnb24iLCJwcm9wcyIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ2aWV3Qm94Iiwic3R5bGUiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQU1xQkEsVzs7Ozs7Ozs7Ozs7OzZCQWVWO0FBQ1AsYUFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsRUFDRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLGdDQURKO0FBRUUsUUFBQSxNQUFNLEVBQUMsY0FGVDtBQUdFLFFBQUEsSUFBSSxFQUFDLGFBSFA7QUFJRSxRQUFBLFdBQVcsRUFBQztBQUpkLFFBREYsRUFPRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFQRixFQVFFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQVJGLEVBU0U7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBVEYsRUFVRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFWRixFQVdFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQVhGLEVBWUU7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBWkYsRUFhRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFiRixFQWNFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQWRGLENBREY7QUFrQkQ7OztFQWxDc0NDLGdCOzs7aUNBQXBCRixXLGVBQ0E7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsbUJBQW1CLEVBQUVGLHNCQUFVQyxNQUhkO0FBSWpCRSxFQUFBQSxPQUFPLEVBQUVILHNCQUFVQyxNQUpGO0FBS2pCRyxFQUFBQSxLQUFLLEVBQUVKLHNCQUFVSztBQUxBLEM7aUNBREFULFcsa0JBU0c7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRSw0QkFGRDtBQUdwQkMsRUFBQUEsT0FBTyxFQUFFO0FBSFcsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdQb2x5Z29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB2aWV3Qm94OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1kcmF3LXBvbHlnb24nLFxuICAgIHZpZXdCb3g6ICcwIDAgMjQgMjUnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk01IDZMMTMgMkwyMiA5TDIxIDIzTDIgMTdMNSA2WlwiXG4gICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICBmaWxsPVwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGggZD1cIk0xMCAxMUMxMC41NTIzIDExIDExIDEwLjU1MjMgMTEgMTBDMTEgOS40NDc3MiAxMC41NTIzIDkgMTAgOUM5LjQ0NzcyIDkgOSA5LjQ0NzcyIDkgMTBDOSAxMC41NTIzIDkuNDQ3NzIgMTEgMTAgMTFaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0xMS41IDE2QzEyLjMyODQgMTYgMTMgMTUuMzI4NCAxMyAxNC41QzEzIDEzLjY3MTYgMTIuMzI4NCAxMyAxMS41IDEzQzEwLjY3MTYgMTMgMTAgMTMuNjcxNiAxMCAxNC41QzEwIDE1LjMyODQgMTAuNjcxNiAxNiAxMS41IDE2WlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTUuNSAxMkMxNi4zMjg0IDEyIDE3IDExLjMyODQgMTcgMTAuNUMxNyA5LjY3MTU3IDE2LjMyODQgOSAxNS41IDlDMTQuNjcxNiA5IDE0IDkuNjcxNTcgMTQgMTAuNUMxNCAxMS4zMjg0IDE0LjY3MTYgMTIgMTUuNSAxMlpcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIyIDExQzIzLjEwNDYgMTEgMjQgMTAuMTA0NiAyNCA5QzI0IDcuODk1NDMgMjMuMTA0NiA3IDIyIDdDMjAuODk1NCA3IDIwIDcuODk1NDMgMjAgOUMyMCAxMC4xMDQ2IDIwLjg5NTQgMTEgMjIgMTFaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yMSAyNUMyMi4xMDQ2IDI1IDIzIDI0LjEwNDYgMjMgMjNDMjMgMjEuODk1NCAyMi4xMDQ2IDIxIDIxIDIxQzE5Ljg5NTQgMjEgMTkgMjEuODk1NCAxOSAyM0MxOSAyNC4xMDQ2IDE5Ljg5NTQgMjUgMjEgMjVaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE5QzMuMTA0NTcgMTkgNCAxOC4xMDQ2IDQgMTdDNCAxNS44OTU0IDMuMTA0NTcgMTUgMiAxNUMwLjg5NTQzIDE1IDAgMTUuODk1NCAwIDE3QzAgMTguMTA0NiAwLjg5NTQzIDE5IDIgMTlaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0xMyA0QzE0LjEwNDYgNCAxNSAzLjEwNDU3IDE1IDJDMTUgMC44OTU0MyAxNC4xMDQ2IDAgMTMgMEMxMS44OTU0IDAgMTEgMC44OTU0MyAxMSAyQzExIDMuMTA0NTcgMTEuODk1NCA0IDEzIDRaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk01IDhDNi4xMDQ1NyA4IDcgNy4xMDQ1NyA3IDZDNyA0Ljg5NTQzIDYuMTA0NTcgNCA1IDRDMy44OTU0MyA0IDMgNC44OTU0MyAzIDZDMyA3LjEwNDU3IDMuODk1NDMgOCA1IDhaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG4iXX0=