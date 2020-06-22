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
var Info =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Info, _Component);

  function Info() {
    (0, _classCallCheck2["default"])(this, Info);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Info).apply(this, arguments));
  }

  (0, _createClass2["default"])(Info, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], (0, _extends2["default"])({
        viewBox: "0 0 64 64"
      }, this.props), _react["default"].createElement("circle", {
        cx: "25",
        cy: "25",
        fill: "none",
        r: "24",
        stroke: this.props.stroke,
        strokeLinecap: "round",
        strokeMiterlimit: "10",
        strokeWidth: "2"
      }), _react["default"].createElement("path", {
        d: "M23.779,16.241c-0.216,0-0.357-0.144-0.357-0.359v-2.618c0-0.215,0.142-0.359,0.357-0.359h2.439  c0.215,0,0.359,0.144,0.359,0.359v2.618c0,0.215-0.145,0.359-0.359,0.359H23.779z M23.852,37.293c-0.215,0-0.358-0.143-0.358-0.358  V20.473c0-0.215,0.144-0.359,0.358-0.359h2.295c0.216,0,0.359,0.144,0.359,0.359v16.462c0,0.216-0.144,0.358-0.359,0.358H23.852z"
      }));
    }
  }]);
  return Info;
}(_react.Component);

exports["default"] = Info;
(0, _defineProperty2["default"])(Info, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Info, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-info',
  stroke: '#FFF'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9pbmZvLmpzIl0sIm5hbWVzIjpbIkluZm8iLCJwcm9wcyIsInN0cm9rZSIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBTXFCQSxJOzs7Ozs7Ozs7Ozs7NkJBWVY7QUFDUCxhQUNFLGdDQUFDLGdCQUFEO0FBQU0sUUFBQSxPQUFPLEVBQUM7QUFBZCxTQUE4QixLQUFLQyxLQUFuQyxHQUNFO0FBQ0UsUUFBQSxFQUFFLEVBQUMsSUFETDtBQUVFLFFBQUEsRUFBRSxFQUFDLElBRkw7QUFHRSxRQUFBLElBQUksRUFBQyxNQUhQO0FBSUUsUUFBQSxDQUFDLEVBQUMsSUFKSjtBQUtFLFFBQUEsTUFBTSxFQUFFLEtBQUtBLEtBQUwsQ0FBV0MsTUFMckI7QUFNRSxRQUFBLGFBQWEsRUFBQyxPQU5oQjtBQU9FLFFBQUEsZ0JBQWdCLEVBQUMsSUFQbkI7QUFRRSxRQUFBLFdBQVcsRUFBQztBQVJkLFFBREYsRUFXRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFYRixDQURGO0FBZUQ7OztFQTVCK0JDLGdCOzs7aUNBQWJILEksZUFDQTtBQUNqQjtBQUNBSSxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQUZELEM7aUNBREFOLEksa0JBTUc7QUFDcEJJLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRSxvQkFGRDtBQUdwQkwsRUFBQUEsTUFBTSxFQUFFO0FBSFksQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZm8gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtaW5mbycsXG4gICAgc3Ryb2tlOiAnI0ZGRidcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHZpZXdCb3g9XCIwIDAgNjQgNjRcIiB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxjaXJjbGVcbiAgICAgICAgICBjeD1cIjI1XCJcbiAgICAgICAgICBjeT1cIjI1XCJcbiAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgcj1cIjI0XCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMucHJvcHMuc3Ryb2tlfVxuICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgc3Ryb2tlTWl0ZXJsaW1pdD1cIjEwXCJcbiAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzLjc3OSwxNi4yNDFjLTAuMjE2LDAtMC4zNTctMC4xNDQtMC4zNTctMC4zNTl2LTIuNjE4YzAtMC4yMTUsMC4xNDItMC4zNTksMC4zNTctMC4zNTloMi40MzkgIGMwLjIxNSwwLDAuMzU5LDAuMTQ0LDAuMzU5LDAuMzU5djIuNjE4YzAsMC4yMTUtMC4xNDUsMC4zNTktMC4zNTksMC4zNTlIMjMuNzc5eiBNMjMuODUyLDM3LjI5M2MtMC4yMTUsMC0wLjM1OC0wLjE0My0wLjM1OC0wLjM1OCAgVjIwLjQ3M2MwLTAuMjE1LDAuMTQ0LTAuMzU5LDAuMzU4LTAuMzU5aDIuMjk1YzAuMjE2LDAsMC4zNTksMC4xNDQsMC4zNTksMC4zNTl2MTYuNDYyYzAsMC4yMTYtMC4xNDQsMC4zNTgtMC4zNTksMC4zNThIMjMuODUyelwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19