"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _errorBoundary = _interopRequireDefault(require("../common/error-boundary"));

var _notificationItem = _interopRequireDefault(require("../notification-panel/notification-item"));

// Copyright (c) 2021 Uber Technologies, Inc.
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
var NotificationItem = (0, _notificationItem["default"])();

var ErrorDisplay = function ErrorDisplay(_ref) {
  var error = _ref.error;
  return /*#__PURE__*/_react["default"].createElement(_errorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(NotificationItem, {
    notification: {
      type: 'error',
      message: error,
      id: 'cloud-export-error'
    },
    isExpanded: true
  }));
};

var _default = ErrorDisplay;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9lcnJvci1kaXNwbGF5LmpzIl0sIm5hbWVzIjpbIk5vdGlmaWNhdGlvbkl0ZW0iLCJFcnJvckRpc3BsYXkiLCJlcnJvciIsInR5cGUiLCJtZXNzYWdlIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQSxJQUFNQSxnQkFBZ0IsR0FBRyxtQ0FBekI7O0FBRUEsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxzQkFDbkIsZ0NBQUMseUJBQUQscUJBQ0UsZ0NBQUMsZ0JBQUQ7QUFDRSxJQUFBLFlBQVksRUFBRTtBQUNaQyxNQUFBQSxJQUFJLEVBQUUsT0FETTtBQUVaQyxNQUFBQSxPQUFPLEVBQUVGLEtBRkc7QUFHWkcsTUFBQUEsRUFBRSxFQUFFO0FBSFEsS0FEaEI7QUFNRSxJQUFBLFVBQVU7QUFOWixJQURGLENBRG1CO0FBQUEsQ0FBckI7O2VBYWVKLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEVycm9yQm91bmRhcnkgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZXJyb3ItYm91bmRhcnknO1xuaW1wb3J0IE5vdGlmaWNhdGlvbkl0ZW1GYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvbm90aWZpY2F0aW9uLXBhbmVsL25vdGlmaWNhdGlvbi1pdGVtJztcbmNvbnN0IE5vdGlmaWNhdGlvbkl0ZW0gPSBOb3RpZmljYXRpb25JdGVtRmFjdG9yeSgpO1xuXG5jb25zdCBFcnJvckRpc3BsYXkgPSAoe2Vycm9yfSkgPT4gKFxuICA8RXJyb3JCb3VuZGFyeT5cbiAgICA8Tm90aWZpY2F0aW9uSXRlbVxuICAgICAgbm90aWZpY2F0aW9uPXt7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLFxuICAgICAgICBpZDogJ2Nsb3VkLWV4cG9ydC1lcnJvcidcbiAgICAgIH19XG4gICAgICBpc0V4cGFuZGVkXG4gICAgLz5cbiAgPC9FcnJvckJvdW5kYXJ5PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JEaXNwbGF5O1xuIl19