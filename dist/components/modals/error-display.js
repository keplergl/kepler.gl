"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _errorBoundary = _interopRequireDefault(require("../common/error-boundary"));

var _notificationItem = _interopRequireDefault(require("../notification-panel/notification-item"));

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
var NotificationItem = (0, _notificationItem["default"])();

var ErrorDisplay = function ErrorDisplay(_ref) {
  var error = _ref.error;
  return _react["default"].createElement(_errorBoundary["default"], null, _react["default"].createElement(NotificationItem, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9lcnJvci1kaXNwbGF5LmpzIl0sIm5hbWVzIjpbIk5vdGlmaWNhdGlvbkl0ZW0iLCJFcnJvckRpc3BsYXkiLCJlcnJvciIsInR5cGUiLCJtZXNzYWdlIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQSxJQUFNQSxnQkFBZ0IsR0FBRyxtQ0FBekI7O0FBRUEsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxTQUNuQixnQ0FBQyx5QkFBRCxRQUNFLGdDQUFDLGdCQUFEO0FBQ0UsSUFBQSxZQUFZLEVBQUU7QUFDWkMsTUFBQUEsSUFBSSxFQUFFLE9BRE07QUFFWkMsTUFBQUEsT0FBTyxFQUFFRixLQUZHO0FBR1pHLE1BQUFBLEVBQUUsRUFBRTtBQUhRLEtBRGhCO0FBTUUsSUFBQSxVQUFVO0FBTlosSUFERixDQURtQjtBQUFBLENBQXJCOztlQWFlSixZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBFcnJvckJvdW5kYXJ5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2Vycm9yLWJvdW5kYXJ5JztcbmltcG9ydCBOb3RpZmljYXRpb25JdGVtRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL25vdGlmaWNhdGlvbi1wYW5lbC9ub3RpZmljYXRpb24taXRlbSc7XG5jb25zdCBOb3RpZmljYXRpb25JdGVtID0gTm90aWZpY2F0aW9uSXRlbUZhY3RvcnkoKTtcblxuY29uc3QgRXJyb3JEaXNwbGF5ID0gKHtlcnJvcn0pID0+IChcbiAgPEVycm9yQm91bmRhcnk+XG4gICAgPE5vdGlmaWNhdGlvbkl0ZW1cbiAgICAgIG5vdGlmaWNhdGlvbj17e1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiBlcnJvcixcbiAgICAgICAgaWQ6ICdjbG91ZC1leHBvcnQtZXJyb3InXG4gICAgICB9fVxuICAgICAgaXNFeHBhbmRlZFxuICAgIC8+XG4gIDwvRXJyb3JCb3VuZGFyeT5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yRGlzcGxheTtcbiJdfQ==