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

var _base = _interopRequireDefault(require("./base"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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
var Login =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Login, _Component);

  function Login() {
    (0, _classCallCheck2["default"])(this, Login);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Login).apply(this, arguments));
  }

  (0, _createClass2["default"])(Login, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("polygon", {
        id: "Path",
        points: "26.9730089 40.981391 30.7141656 44.7225477 44.0754395 31.3612739 30.7141656 18 26.9730089 21.7411567 33.9208713 28.6890191 8 28.6890191 8 34.0335286 33.9208713 34.0335286"
      }), _react["default"].createElement("path", {
        d: "M50.7560765,8 L13.3445095,8 C10.4050293,8 8,10.4050293 8,13.3445095 L8,24.0335286 L13.3445095,24.0335286 L13.3445095,13.3445095 L50.7560765,13.3445095 L50.7560765,50.7560765 L13.3445095,50.7560765 L13.3445095,40.0670573 L8,40.0670573 L8,50.7560765 C8,53.6955566 10.4050293,56.1005859 13.3445095,56.1005859 L50.7560765,56.1005859 C53.6955566,56.1005859 56.1005859,53.6955566 56.1005859,50.7560765 L56.1005859,13.3445095 C56.1005859,10.4050293 53.6955566,8 50.7560765,8 Z"
      }));
    }
  }]);
  return Login;
}(_react.Component);

exports["default"] = Login;
(0, _defineProperty2["default"])(Login, "propTypes", {
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Login, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-login'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sb2dpbi5qcyJdLCJuYW1lcyI6WyJMb2dpbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBTXFCQSxLOzs7Ozs7Ozs7Ozs7NkJBVVY7QUFDUCxhQUNFLGdDQUFDLGdCQUFELEVBQVUsS0FBS0MsS0FBZixFQUNFO0FBQ0UsUUFBQSxFQUFFLEVBQUMsTUFETDtBQUVFLFFBQUEsTUFBTSxFQUFDO0FBRlQsUUFERixFQUtFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQUxGLENBREY7QUFTRDs7O0VBcEJnQ0MsZ0I7OztpQ0FBZEYsSyxlQUNBO0FBQ2pCRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQURELEM7aUNBREFMLEssa0JBS0c7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRTtBQUZELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1sb2dpbidcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBvbHlnb25cbiAgICAgICAgICBpZD1cIlBhdGhcIlxuICAgICAgICAgIHBvaW50cz1cIjI2Ljk3MzAwODkgNDAuOTgxMzkxIDMwLjcxNDE2NTYgNDQuNzIyNTQ3NyA0NC4wNzU0Mzk1IDMxLjM2MTI3MzkgMzAuNzE0MTY1NiAxOCAyNi45NzMwMDg5IDIxLjc0MTE1NjcgMzMuOTIwODcxMyAyOC42ODkwMTkxIDggMjguNjg5MDE5MSA4IDM0LjAzMzUyODYgMzMuOTIwODcxMyAzNC4wMzM1Mjg2XCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGggZD1cIk01MC43NTYwNzY1LDggTDEzLjM0NDUwOTUsOCBDMTAuNDA1MDI5Myw4IDgsMTAuNDA1MDI5MyA4LDEzLjM0NDUwOTUgTDgsMjQuMDMzNTI4NiBMMTMuMzQ0NTA5NSwyNC4wMzM1Mjg2IEwxMy4zNDQ1MDk1LDEzLjM0NDUwOTUgTDUwLjc1NjA3NjUsMTMuMzQ0NTA5NSBMNTAuNzU2MDc2NSw1MC43NTYwNzY1IEwxMy4zNDQ1MDk1LDUwLjc1NjA3NjUgTDEzLjM0NDUwOTUsNDAuMDY3MDU3MyBMOCw0MC4wNjcwNTczIEw4LDUwLjc1NjA3NjUgQzgsNTMuNjk1NTU2NiAxMC40MDUwMjkzLDU2LjEwMDU4NTkgMTMuMzQ0NTA5NSw1Ni4xMDA1ODU5IEw1MC43NTYwNzY1LDU2LjEwMDU4NTkgQzUzLjY5NTU1NjYsNTYuMTAwNTg1OSA1Ni4xMDA1ODU5LDUzLjY5NTU1NjYgNTYuMTAwNTg1OSw1MC43NTYwNzY1IEw1Ni4xMDA1ODU5LDEzLjM0NDUwOTUgQzU2LjEwMDU4NTksMTAuNDA1MDI5MyA1My42OTU1NTY2LDggNTAuNzU2MDc2NSw4IFpcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==