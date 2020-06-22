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
var HeatmapLayerIcon =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(HeatmapLayerIcon, _Component);

  function HeatmapLayerIcon() {
    (0, _classCallCheck2["default"])(this, HeatmapLayerIcon);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(HeatmapLayerIcon).apply(this, arguments));
  }

  (0, _createClass2["default"])(HeatmapLayerIcon, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("path", {
        d: "M51.87,21C49.55,16.67,43.77,15.29,39,18a11.42,11.42,0,0,0-1.65,1.13c-2.73,2.14-2.12,3-6,4.89-2.27,1.07-3.42,1.08-6.88,1.4l-2.24.21a14,14,0,0,0-2.86.84c-6.64,2.73-10.11,9.86-7.76,15.94s9.63,8.79,16.27,6.07A14,14,0,0,0,31.77,46l0,0,.06-.07c.43-.4.8-.78,1.14-1.14a2.66,2.66,0,0,0,.32-.36l.17-.19c3-3.53,2-5,4.9-7.39,2.38-1.93,5.41-.95,9-3C52.19,31.15,54.19,25.43,51.87,21ZM26,44.59a8.7,8.7,0,0,1-2.26.59A7.16,7.16,0,0,1,16,40.85c-1.44-3.72.68-8.08,4.73-9.74A8.33,8.33,0,0,1,23,30.53a7.15,7.15,0,0,1,7.71,4.32C32.19,38.57,30.06,42.93,26,44.59Z",
        className: "cr2",
        style: {
          opacity: 0.8
        }
      }), _react["default"].createElement("path", {
        d: "M57,18.18A14.56,14.56,0,0,0,42.25,10.7a16.62,16.62,0,0,0-6.12,2,17.35,17.35,0,0,0-2.39,1.65,20.15,20.15,0,0,0-2.83,2.73,4.52,4.52,0,0,1-2,1.45,5.88,5.88,0,0,1-2.26.63l-1.45.14-1.27.12-2.33.22-.2,0-.18,0a18.88,18.88,0,0,0-4,1.18c-9.6,3.93-14.51,14.57-11,23.71A17.59,17.59,0,0,0,24.81,55.4,20.19,20.19,0,0,0,30,54.05a20,20,0,0,0,5.26-3.19l.82-.71.05-.08,1-1c.21-.22.41-.45.59-.66l.13-.15a20,20,0,0,0,3.39-5.48c.36-.87.36-.87.68-1.14a9.09,9.09,0,0,1,1.56-.32,18.79,18.79,0,0,0,6.69-2.19,16.56,16.56,0,0,0,7.88-9.9A14.93,14.93,0,0,0,57,18.18ZM47.63,34.27a13.93,13.93,0,0,1-5.06,1.61,7.75,7.75,0,0,0-3.86,1.36,7.06,7.06,0,0,0-2.33,3.24,14.17,14.17,0,0,1-2.51,4.09l-.1.11a5.11,5.11,0,0,1-.43.47c-.31.35-.7.73-1.14,1.14l-.09.09-.12.09a14.4,14.4,0,0,1-4,2.44,14.73,14.73,0,0,1-3.84,1c-5.87.69-11.13-2.27-13.08-7.35-2.45-6.32,1.16-13.76,8-16.59a15,15,0,0,1,3-.87l2.29-.22.9-.07,2-.2a10.88,10.88,0,0,0,3.85-1.08,9.43,9.43,0,0,0,3.77-2.76A14.75,14.75,0,0,1,37,18.71a11.5,11.5,0,0,1,1.71-1.17,11.08,11.08,0,0,1,4.16-1.36,9.26,9.26,0,0,1,9.42,4.64C54.75,25.42,52.65,31.47,47.63,34.27Z",
        className: "cr1",
        style: {
          opacity: 0.36
        }
      }), _react["default"].createElement("path", {
        d: "M33,44.79a9.53,9.53,0,0,1-1.13,1.14C32.3,45.53,32.67,45.15,33,44.79Z",
        className: "cr1",
        style: {
          opacity: 0.36
        }
      }), _react["default"].createElement("path", {
        d: "M25.83,44.13c-3.82,1.55-8,0-9.33-3.46s.65-7.55,4.45-9.1,8,0,9.33,3.46S29.63,42.57,25.83,44.13Z",
        className: "cr3"
      }), _react["default"].createElement("path", {
        d: "M31.81,46a.09.09,0,0,1,0,0h0Z",
        className: "cr3"
      }));
    }
  }]);
  return HeatmapLayerIcon;
}(_react.Component);

exports["default"] = HeatmapLayerIcon;
(0, _defineProperty2["default"])(HeatmapLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(HeatmapLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'heatmap-layer-icon',
  totalColor: 3
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGVhdG1hcC1sYXllci9oZWF0bWFwLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiSGVhdG1hcExheWVySWNvbiIsInByb3BzIiwib3BhY2l0eSIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsImNvbG9ycyIsImFycmF5T2YiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidG90YWxDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBTXFCQSxnQjs7Ozs7Ozs7Ozs7OzZCQWFWO0FBQ1AsYUFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsRUFDRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLDZoQkFESjtBQUVFLFFBQUEsU0FBUyxFQUFDLEtBRlo7QUFHRSxRQUFBLEtBQUssRUFBRTtBQUFDQyxVQUFBQSxPQUFPLEVBQUU7QUFBVjtBQUhULFFBREYsRUFNRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLGlqQ0FESjtBQUVFLFFBQUEsU0FBUyxFQUFDLEtBRlo7QUFHRSxRQUFBLEtBQUssRUFBRTtBQUFDQSxVQUFBQSxPQUFPLEVBQUU7QUFBVjtBQUhULFFBTkYsRUFXRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLHNFQURKO0FBRUUsUUFBQSxTQUFTLEVBQUMsS0FGWjtBQUdFLFFBQUEsS0FBSyxFQUFFO0FBQUNBLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBSFQsUUFYRixFQWdCRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLGdHQURKO0FBRUUsUUFBQSxTQUFTLEVBQUM7QUFGWixRQWhCRixFQW9CRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLCtCQUFSO0FBQXdDLFFBQUEsU0FBUyxFQUFDO0FBQWxELFFBcEJGLENBREY7QUF3QkQ7OztFQXRDMkNDLGdCOzs7aUNBQXpCSCxnQixlQUNBO0FBQ2pCO0FBQ0FJLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BRkQ7QUFHakJDLEVBQUFBLE1BQU0sRUFBRUYsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVQyxNQUE1QjtBQUhTLEM7aUNBREFOLGdCLGtCQU9HO0FBQ3BCSSxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkssRUFBQUEsbUJBQW1CLEVBQUUsb0JBRkQ7QUFHcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUhRLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhdG1hcExheWVySWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbG9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdoZWF0bWFwLWxheWVyLWljb24nLFxuICAgIHRvdGFsQ29sb3I6IDNcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTUxLjg3LDIxQzQ5LjU1LDE2LjY3LDQzLjc3LDE1LjI5LDM5LDE4YTExLjQyLDExLjQyLDAsMCwwLTEuNjUsMS4xM2MtMi43MywyLjE0LTIuMTIsMy02LDQuODktMi4yNywxLjA3LTMuNDIsMS4wOC02Ljg4LDEuNGwtMi4yNC4yMWExNCwxNCwwLDAsMC0yLjg2Ljg0Yy02LjY0LDIuNzMtMTAuMTEsOS44Ni03Ljc2LDE1Ljk0czkuNjMsOC43OSwxNi4yNyw2LjA3QTE0LDE0LDAsMCwwLDMxLjc3LDQ2bDAsMCwuMDYtLjA3Yy40My0uNC44LS43OCwxLjE0LTEuMTRhMi42NiwyLjY2LDAsMCwwLC4zMi0uMzZsLjE3LS4xOWMzLTMuNTMsMi01LDQuOS03LjM5LDIuMzgtMS45Myw1LjQxLS45NSw5LTNDNTIuMTksMzEuMTUsNTQuMTksMjUuNDMsNTEuODcsMjFaTTI2LDQ0LjU5YTguNyw4LjcsMCwwLDEtMi4yNi41OUE3LjE2LDcuMTYsMCwwLDEsMTYsNDAuODVjLTEuNDQtMy43Mi42OC04LjA4LDQuNzMtOS43NEE4LjMzLDguMzMsMCwwLDEsMjMsMzAuNTNhNy4xNSw3LjE1LDAsMCwxLDcuNzEsNC4zMkMzMi4xOSwzOC41NywzMC4wNiw0Mi45MywyNiw0NC41OVpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyMlwiXG4gICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLjh9fVxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNTcsMTguMThBMTQuNTYsMTQuNTYsMCwwLDAsNDIuMjUsMTAuN2ExNi42MiwxNi42MiwwLDAsMC02LjEyLDIsMTcuMzUsMTcuMzUsMCwwLDAtMi4zOSwxLjY1LDIwLjE1LDIwLjE1LDAsMCwwLTIuODMsMi43Myw0LjUyLDQuNTIsMCwwLDEtMiwxLjQ1LDUuODgsNS44OCwwLDAsMS0yLjI2LjYzbC0xLjQ1LjE0LTEuMjcuMTItMi4zMy4yMi0uMiwwLS4xOCwwYTE4Ljg4LDE4Ljg4LDAsMCwwLTQsMS4xOGMtOS42LDMuOTMtMTQuNTEsMTQuNTctMTEsMjMuNzFBMTcuNTksMTcuNTksMCwwLDAsMjQuODEsNTUuNCwyMC4xOSwyMC4xOSwwLDAsMCwzMCw1NC4wNWEyMCwyMCwwLDAsMCw1LjI2LTMuMTlsLjgyLS43MS4wNS0uMDgsMS0xYy4yMS0uMjIuNDEtLjQ1LjU5LS42NmwuMTMtLjE1YTIwLDIwLDAsMCwwLDMuMzktNS40OGMuMzYtLjg3LjM2LS44Ny42OC0xLjE0YTkuMDksOS4wOSwwLDAsMSwxLjU2LS4zMiwxOC43OSwxOC43OSwwLDAsMCw2LjY5LTIuMTksMTYuNTYsMTYuNTYsMCwwLDAsNy44OC05LjlBMTQuOTMsMTQuOTMsMCwwLDAsNTcsMTguMThaTTQ3LjYzLDM0LjI3YTEzLjkzLDEzLjkzLDAsMCwxLTUuMDYsMS42MSw3Ljc1LDcuNzUsMCwwLDAtMy44NiwxLjM2LDcuMDYsNy4wNiwwLDAsMC0yLjMzLDMuMjQsMTQuMTcsMTQuMTcsMCwwLDEtMi41MSw0LjA5bC0uMS4xMWE1LjExLDUuMTEsMCwwLDEtLjQzLjQ3Yy0uMzEuMzUtLjcuNzMtMS4xNCwxLjE0bC0uMDkuMDktLjEyLjA5YTE0LjQsMTQuNCwwLDAsMS00LDIuNDQsMTQuNzMsMTQuNzMsMCwwLDEtMy44NCwxYy01Ljg3LjY5LTExLjEzLTIuMjctMTMuMDgtNy4zNS0yLjQ1LTYuMzIsMS4xNi0xMy43Niw4LTE2LjU5YTE1LDE1LDAsMCwxLDMtLjg3bDIuMjktLjIyLjktLjA3LDItLjJhMTAuODgsMTAuODgsMCwwLDAsMy44NS0xLjA4LDkuNDMsOS40MywwLDAsMCwzLjc3LTIuNzZBMTQuNzUsMTQuNzUsMCwwLDEsMzcsMTguNzFhMTEuNSwxMS41LDAsMCwxLDEuNzEtMS4xNywxMS4wOCwxMS4wOCwwLDAsMSw0LjE2LTEuMzYsOS4yNiw5LjI2LDAsMCwxLDkuNDIsNC42NEM1NC43NSwyNS40Miw1Mi42NSwzMS40Nyw0Ny42MywzNC4yN1pcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyMVwiXG4gICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLjM2fX1cbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTMzLDQ0Ljc5YTkuNTMsOS41MywwLDAsMS0xLjEzLDEuMTRDMzIuMyw0NS41MywzMi42Nyw0NS4xNSwzMyw0NC43OVpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyMVwiXG4gICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLjM2fX1cbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTI1LjgzLDQ0LjEzYy0zLjgyLDEuNTUtOCwwLTkuMzMtMy40NnMuNjUtNy41NSw0LjQ1LTkuMSw4LDAsOS4zMywzLjQ2UzI5LjYzLDQyLjU3LDI1LjgzLDQ0LjEzWlwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IzXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGggZD1cIk0zMS44MSw0NmEuMDkuMDksMCwwLDEsMCwwaDBaXCIgY2xhc3NOYW1lPVwiY3IzXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG4iXX0=