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
var ArcLayerIcon =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ArcLayerIcon, _Component);

  function ArcLayerIcon() {
    (0, _classCallCheck2["default"])(this, ArcLayerIcon);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ArcLayerIcon).apply(this, arguments));
  }

  (0, _createClass2["default"])(ArcLayerIcon, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("path", {
        d: "M34.5,34.4c-0.6,0-1.2-0.4-1.4-1c-2.7-9.9-8.8-21.7-16.8-22.3c-3.1-0.2-5.6,1.5-7,4.8c-0.3,0.7-1.1,1.1-1.9,0.7 c-0.7-0.3-1.1-1.1-0.7-1.9c1.9-4.3,5.6-6.8,9.8-6.5c9.5,0.7,16.3,13,19.4,24.4c0.2,0.8-0.2,1.5-1,1.7C34.8,34.3,34.6,34.4,34.5,34.4 z",
        className: "cr1"
      }), _react["default"].createElement("path", {
        d: "M6.7,57c0,0-0.1,0-0.1,0c-0.5-0.1-0.9-0.6-0.8-1.1c2.4-17.3,9.6-30.3,17.5-31.8c3.1-0.6,7.8,0.4,12.1,8.3 c0.3,0.5,0.1,1-0.4,1.3c-0.5,0.3-1,0.1-1.3-0.4c-2.1-3.8-5.6-8.2-10.1-7.4C16.6,27.3,9.9,40,7.6,56.2C7.6,56.7,7.2,57,6.7,57z",
        className: "cr2"
      }), _react["default"].createElement("path", {
        d: "M56.8,56.4c-0.8,0-1.4-0.6-1.4-1.4c0-13.5-6.8-24.4-12.9-25.8c-3.5-0.8-5.6,2-6.7,4.4c-0.3,0.7-1.2,1-1.9,0.7 c-0.7-0.3-1-1.2-0.7-1.9c2.2-4.7,5.8-6.9,9.9-6c9,2,15.1,16.4,15.1,28.6C58.3,55.7,57.6,56.4,56.8,56.4z",
        className: "cr3"
      }), _react["default"].createElement("path", {
        d: "M34.5,32.7c-0.2,0-0.3,0-0.5,0c-1.3-0.3-2.1-1.5-1.8-2.8c3.5-17.4,10.3-20.7,14-21.2c4.4-0.5,8.6,2.3,11,7.4 c0.6,1.2,0,2.6-1.1,3.1c-1.2,0.6-2.6,0-3.1-1.1c-1.5-3.2-3.8-5-6.1-4.7c-1.5,0.2-6.8,2-9.9,17.4C36.6,32,35.6,32.7,34.5,32.7z",
        className: "cr4"
      }));
    }
  }]);
  return ArcLayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(ArcLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(ArcLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'point-layer-icon',
  totalColor: 4
});
var _default = ArcLayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci1pY29uLmpzIl0sIm5hbWVzIjpbIkFyY0xheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFNTUEsWTs7Ozs7Ozs7Ozs7OzZCQWFLO0FBQ1AsYUFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsRUFDRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLCtPQURKO0FBSUUsUUFBQSxTQUFTLEVBQUM7QUFKWixRQURGLEVBT0U7QUFDRSxRQUFBLENBQUMsRUFBQyxpT0FESjtBQUdFLFFBQUEsU0FBUyxFQUFDO0FBSFosUUFQRixFQVlFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsZ05BREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBWkYsRUFpQkU7QUFDRSxRQUFBLENBQUMsRUFBQyxvT0FESjtBQUdFLFFBQUEsU0FBUyxFQUFDO0FBSFosUUFqQkYsQ0FERjtBQXlCRDs7O0VBdkN3QkMsZ0I7O2lDQUFyQkYsWSxlQUNlO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BRkQ7QUFHakJDLEVBQUFBLE1BQU0sRUFBRUYsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVQyxNQUE1QjtBQUhTLEM7aUNBRGZMLFksa0JBT2tCO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkssRUFBQUEsbUJBQW1CLEVBQUUsa0JBRkQ7QUFHcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUhRLEM7ZUFtQ1RULFkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuY2xhc3MgQXJjTGF5ZXJJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ3BvaW50LWxheWVyLWljb24nLFxuICAgIHRvdGFsQ29sb3I6IDRcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTM0LjUsMzQuNGMtMC42LDAtMS4yLTAuNC0xLjQtMWMtMi43LTkuOS04LjgtMjEuNy0xNi44LTIyLjNjLTMuMS0wLjItNS42LDEuNS03LDQuOGMtMC4zLDAuNy0xLjEsMS4xLTEuOSwwLjdcblx0Yy0wLjctMC4zLTEuMS0xLjEtMC43LTEuOWMxLjktNC4zLDUuNi02LjgsOS44LTYuNWM5LjUsMC43LDE2LjMsMTMsMTkuNCwyNC40YzAuMiwwLjgtMC4yLDEuNS0xLDEuN0MzNC44LDM0LjMsMzQuNiwzNC40LDM0LjUsMzQuNFxuXHR6XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjFcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNi43LDU3YzAsMC0wLjEsMC0wLjEsMGMtMC41LTAuMS0wLjktMC42LTAuOC0xLjFjMi40LTE3LjMsOS42LTMwLjMsMTcuNS0zMS44YzMuMS0wLjYsNy44LDAuNCwxMi4xLDguM1xuXHRjMC4zLDAuNSwwLjEsMS0wLjQsMS4zYy0wLjUsMC4zLTEsMC4xLTEuMy0wLjRjLTIuMS0zLjgtNS42LTguMi0xMC4xLTcuNEMxNi42LDI3LjMsOS45LDQwLDcuNiw1Ni4yQzcuNiw1Ni43LDcuMiw1Nyw2LjcsNTd6XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjJcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNTYuOCw1Ni40Yy0wLjgsMC0xLjQtMC42LTEuNC0xLjRjMC0xMy41LTYuOC0yNC40LTEyLjktMjUuOGMtMy41LTAuOC01LjYsMi02LjcsNC40Yy0wLjMsMC43LTEuMiwxLTEuOSwwLjdcblx0Yy0wLjctMC4zLTEtMS4yLTAuNy0xLjljMi4yLTQuNyw1LjgtNi45LDkuOS02YzksMiwxNS4xLDE2LjQsMTUuMSwyOC42QzU4LjMsNTUuNyw1Ny42LDU2LjQsNTYuOCw1Ni40elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IzXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTM0LjUsMzIuN2MtMC4yLDAtMC4zLDAtMC41LDBjLTEuMy0wLjMtMi4xLTEuNS0xLjgtMi44YzMuNS0xNy40LDEwLjMtMjAuNywxNC0yMS4yYzQuNC0wLjUsOC42LDIuMywxMSw3LjRcblx0YzAuNiwxLjIsMCwyLjYtMS4xLDMuMWMtMS4yLDAuNi0yLjYsMC0zLjEtMS4xYy0xLjUtMy4yLTMuOC01LTYuMS00LjdjLTEuNSwwLjItNi44LDItOS45LDE3LjRDMzYuNiwzMiwzNS42LDMyLjcsMzQuNSwzMi43elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3I0XCJcbiAgICAgICAgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFyY0xheWVySWNvbjtcbiJdfQ==