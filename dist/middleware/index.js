"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceReduxMiddleware = enhanceReduxMiddleware;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _tasks = require("react-palm/tasks");

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
// Extra helpers for redux
// We are exposing this secause react-palm has no UMD module and
// users need taskMiddleware to initiate their redux middle ware

/**
 * This method is used to enhance redux middleware and provide
 * functionality to support react-palm
 * @param middlewares current redux middlewares
 * @returns {*[]} the original list of middlewares plus the react-palm middleware
 */
function enhanceReduxMiddleware() {
  var middlewares = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return [].concat((0, _toConsumableArray2["default"])(middlewares), [_tasks.taskMiddleware]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2luZGV4LmpzIl0sIm5hbWVzIjpbImVuaGFuY2VSZWR1eE1pZGRsZXdhcmUiLCJtaWRkbGV3YXJlcyIsInRhc2tNaWRkbGV3YXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQXVCQTs7QUF2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBR0E7Ozs7OztBQU1PLFNBQVNBLHNCQUFULEdBQWtEO0FBQUEsTUFBbEJDLFdBQWtCLHVFQUFKLEVBQUk7QUFDdkQsdURBQVdBLFdBQVgsSUFBd0JDLHFCQUF4QjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gRXh0cmEgaGVscGVycyBmb3IgcmVkdXhcbi8vIFdlIGFyZSBleHBvc2luZyB0aGlzIHNlY2F1c2UgcmVhY3QtcGFsbSBoYXMgbm8gVU1EIG1vZHVsZSBhbmRcbi8vIHVzZXJzIG5lZWQgdGFza01pZGRsZXdhcmUgdG8gaW5pdGlhdGUgdGhlaXIgcmVkdXggbWlkZGxlIHdhcmVcbmltcG9ydCB7dGFza01pZGRsZXdhcmV9IGZyb20gJ3JlYWN0LXBhbG0vdGFza3MnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gZW5oYW5jZSByZWR1eCBtaWRkbGV3YXJlIGFuZCBwcm92aWRlXG4gKiBmdW5jdGlvbmFsaXR5IHRvIHN1cHBvcnQgcmVhY3QtcGFsbVxuICogQHBhcmFtIG1pZGRsZXdhcmVzIGN1cnJlbnQgcmVkdXggbWlkZGxld2FyZXNcbiAqIEByZXR1cm5zIHsqW119IHRoZSBvcmlnaW5hbCBsaXN0IG9mIG1pZGRsZXdhcmVzIHBsdXMgdGhlIHJlYWN0LXBhbG0gbWlkZGxld2FyZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5oYW5jZVJlZHV4TWlkZGxld2FyZShtaWRkbGV3YXJlcyA9IFtdKSB7XG4gIHJldHVybiBbLi4ubWlkZGxld2FyZXMsIHRhc2tNaWRkbGV3YXJlXTtcbn1cbiJdfQ==