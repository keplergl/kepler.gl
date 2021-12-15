"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceReduxMiddleware = enhanceReduxMiddleware;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _tasks = require("react-palm/tasks");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2luZGV4LmpzIl0sIm5hbWVzIjpbImVuaGFuY2VSZWR1eE1pZGRsZXdhcmUiLCJtaWRkbGV3YXJlcyIsInRhc2tNaWRkbGV3YXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQXVCQTs7QUF2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0Esc0JBQVQsR0FBa0Q7QUFBQSxNQUFsQkMsV0FBa0IsdUVBQUosRUFBSTtBQUN2RCx1REFBV0EsV0FBWCxJQUF3QkMscUJBQXhCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBFeHRyYSBoZWxwZXJzIGZvciByZWR1eFxuLy8gV2UgYXJlIGV4cG9zaW5nIHRoaXMgc2VjYXVzZSByZWFjdC1wYWxtIGhhcyBubyBVTUQgbW9kdWxlIGFuZFxuLy8gdXNlcnMgbmVlZCB0YXNrTWlkZGxld2FyZSB0byBpbml0aWF0ZSB0aGVpciByZWR1eCBtaWRkbGUgd2FyZVxuaW1wb3J0IHt0YXNrTWlkZGxld2FyZX0gZnJvbSAncmVhY3QtcGFsbS90YXNrcyc7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCB0byBlbmhhbmNlIHJlZHV4IG1pZGRsZXdhcmUgYW5kIHByb3ZpZGVcbiAqIGZ1bmN0aW9uYWxpdHkgdG8gc3VwcG9ydCByZWFjdC1wYWxtXG4gKiBAcGFyYW0gbWlkZGxld2FyZXMgY3VycmVudCByZWR1eCBtaWRkbGV3YXJlc1xuICogQHJldHVybnMgeypbXX0gdGhlIG9yaWdpbmFsIGxpc3Qgb2YgbWlkZGxld2FyZXMgcGx1cyB0aGUgcmVhY3QtcGFsbSBtaWRkbGV3YXJlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmhhbmNlUmVkdXhNaWRkbGV3YXJlKG1pZGRsZXdhcmVzID0gW10pIHtcbiAgcmV0dXJuIFsuLi5taWRkbGV3YXJlcywgdGFza01pZGRsZXdhcmVdO1xufVxuIl19