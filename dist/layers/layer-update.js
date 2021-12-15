"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffUpdateTriggers = diffUpdateTriggers;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

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

/* eslint-disable guard-for-in */

/**
 *
 * @param {Object} updateTriggers {getPosition: {column}, getData: {filteredIndex}}
 * @param {Object} oldUpdateTriggers
 * @returns {boolean|object} `false` if nothing changed, or `triggerChanged` as an object
 */
function diffUpdateTriggers(updateTriggers) {
  var oldUpdateTriggers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var triggerChanged = {};
  /** @type {boolean|object} */

  var reason = false;

  for (var triggerName in updateTriggers) {
    var newTriggers = updateTriggers[triggerName] || {};
    var oldTriggers = oldUpdateTriggers[triggerName] || {};
    var diffReason = compareUpdateTrigger(newTriggers, oldTriggers, triggerName);

    if (diffReason) {
      triggerChanged[triggerName] = true;
      reason = triggerChanged;
    }
  }

  return reason;
}

function compareUpdateTrigger(newTriggers, oldTriggers, triggerName) {
  if ((0, _typeof2["default"])(oldTriggers) !== 'object') {
    return oldTriggers === newTriggers ? null : "".concat(triggerName, " changed shallowly");
  }

  for (var key in oldTriggers) {
    if (!(key in newTriggers)) {
      return "".concat(triggerName, ".").concat(key, " deleted");
    } // shallow compare


    if (oldTriggers[key] !== newTriggers[key]) {
      return "".concat(triggerName, ".").concat(key, " changed shallowly");
    }
  }

  for (var _key in newTriggers) {
    if (!(_key in oldTriggers)) {
      return "".concat(triggerName, ".").concat(_key, " added");
    }
  }

  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvbGF5ZXItdXBkYXRlLmpzIl0sIm5hbWVzIjpbImRpZmZVcGRhdGVUcmlnZ2VycyIsInVwZGF0ZVRyaWdnZXJzIiwib2xkVXBkYXRlVHJpZ2dlcnMiLCJ0cmlnZ2VyQ2hhbmdlZCIsInJlYXNvbiIsInRyaWdnZXJOYW1lIiwibmV3VHJpZ2dlcnMiLCJvbGRUcmlnZ2VycyIsImRpZmZSZWFzb24iLCJjb21wYXJlVXBkYXRlVHJpZ2dlciIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxrQkFBVCxDQUE0QkMsY0FBNUIsRUFBb0U7QUFBQSxNQUF4QkMsaUJBQXdCLHVFQUFKLEVBQUk7QUFDekUsTUFBTUMsY0FBYyxHQUFHLEVBQXZCO0FBQ0E7O0FBQ0EsTUFBSUMsTUFBTSxHQUFHLEtBQWI7O0FBRUEsT0FBSyxJQUFNQyxXQUFYLElBQTBCSixjQUExQixFQUEwQztBQUN4QyxRQUFNSyxXQUFXLEdBQUdMLGNBQWMsQ0FBQ0ksV0FBRCxDQUFkLElBQStCLEVBQW5EO0FBQ0EsUUFBTUUsV0FBVyxHQUFHTCxpQkFBaUIsQ0FBQ0csV0FBRCxDQUFqQixJQUFrQyxFQUF0RDtBQUNBLFFBQU1HLFVBQVUsR0FBR0Msb0JBQW9CLENBQUNILFdBQUQsRUFBY0MsV0FBZCxFQUEyQkYsV0FBM0IsQ0FBdkM7O0FBRUEsUUFBSUcsVUFBSixFQUFnQjtBQUNkTCxNQUFBQSxjQUFjLENBQUNFLFdBQUQsQ0FBZCxHQUE4QixJQUE5QjtBQUNBRCxNQUFBQSxNQUFNLEdBQUdELGNBQVQ7QUFDRDtBQUNGOztBQUVELFNBQU9DLE1BQVA7QUFDRDs7QUFFRCxTQUFTSyxvQkFBVCxDQUE4QkgsV0FBOUIsRUFBMkNDLFdBQTNDLEVBQXdERixXQUF4RCxFQUFxRTtBQUNuRSxNQUFJLHlCQUFPRSxXQUFQLE1BQXVCLFFBQTNCLEVBQXFDO0FBQ25DLFdBQU9BLFdBQVcsS0FBS0QsV0FBaEIsR0FBOEIsSUFBOUIsYUFBd0NELFdBQXhDLHVCQUFQO0FBQ0Q7O0FBRUQsT0FBSyxJQUFNSyxHQUFYLElBQWtCSCxXQUFsQixFQUErQjtBQUM3QixRQUFJLEVBQUVHLEdBQUcsSUFBSUosV0FBVCxDQUFKLEVBQTJCO0FBQ3pCLHVCQUFVRCxXQUFWLGNBQXlCSyxHQUF6QjtBQUNELEtBSDRCLENBSzdCOzs7QUFDQSxRQUFJSCxXQUFXLENBQUNHLEdBQUQsQ0FBWCxLQUFxQkosV0FBVyxDQUFDSSxHQUFELENBQXBDLEVBQTJDO0FBQ3pDLHVCQUFVTCxXQUFWLGNBQXlCSyxHQUF6QjtBQUNEO0FBQ0Y7O0FBRUQsT0FBSyxJQUFNQSxJQUFYLElBQWtCSixXQUFsQixFQUErQjtBQUM3QixRQUFJLEVBQUVJLElBQUcsSUFBSUgsV0FBVCxDQUFKLEVBQTJCO0FBQ3pCLHVCQUFVRixXQUFWLGNBQXlCSyxJQUF6QjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBndWFyZC1mb3ItaW4gKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRyaWdnZXJzIHtnZXRQb3NpdGlvbjoge2NvbHVtbn0sIGdldERhdGE6IHtmaWx0ZXJlZEluZGV4fX1cbiAqIEBwYXJhbSB7T2JqZWN0fSBvbGRVcGRhdGVUcmlnZ2Vyc1xuICogQHJldHVybnMge2Jvb2xlYW58b2JqZWN0fSBgZmFsc2VgIGlmIG5vdGhpbmcgY2hhbmdlZCwgb3IgYHRyaWdnZXJDaGFuZ2VkYCBhcyBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZVcGRhdGVUcmlnZ2Vycyh1cGRhdGVUcmlnZ2Vycywgb2xkVXBkYXRlVHJpZ2dlcnMgPSB7fSkge1xuICBjb25zdCB0cmlnZ2VyQ2hhbmdlZCA9IHt9O1xuICAvKiogQHR5cGUge2Jvb2xlYW58b2JqZWN0fSAqL1xuICBsZXQgcmVhc29uID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCB0cmlnZ2VyTmFtZSBpbiB1cGRhdGVUcmlnZ2Vycykge1xuICAgIGNvbnN0IG5ld1RyaWdnZXJzID0gdXBkYXRlVHJpZ2dlcnNbdHJpZ2dlck5hbWVdIHx8IHt9O1xuICAgIGNvbnN0IG9sZFRyaWdnZXJzID0gb2xkVXBkYXRlVHJpZ2dlcnNbdHJpZ2dlck5hbWVdIHx8IHt9O1xuICAgIGNvbnN0IGRpZmZSZWFzb24gPSBjb21wYXJlVXBkYXRlVHJpZ2dlcihuZXdUcmlnZ2Vycywgb2xkVHJpZ2dlcnMsIHRyaWdnZXJOYW1lKTtcblxuICAgIGlmIChkaWZmUmVhc29uKSB7XG4gICAgICB0cmlnZ2VyQ2hhbmdlZFt0cmlnZ2VyTmFtZV0gPSB0cnVlO1xuICAgICAgcmVhc29uID0gdHJpZ2dlckNoYW5nZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlYXNvbjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZVVwZGF0ZVRyaWdnZXIobmV3VHJpZ2dlcnMsIG9sZFRyaWdnZXJzLCB0cmlnZ2VyTmFtZSkge1xuICBpZiAodHlwZW9mIG9sZFRyaWdnZXJzICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBvbGRUcmlnZ2VycyA9PT0gbmV3VHJpZ2dlcnMgPyBudWxsIDogYCR7dHJpZ2dlck5hbWV9IGNoYW5nZWQgc2hhbGxvd2x5YDtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIG9sZFRyaWdnZXJzKSB7XG4gICAgaWYgKCEoa2V5IGluIG5ld1RyaWdnZXJzKSkge1xuICAgICAgcmV0dXJuIGAke3RyaWdnZXJOYW1lfS4ke2tleX0gZGVsZXRlZGA7XG4gICAgfVxuXG4gICAgLy8gc2hhbGxvdyBjb21wYXJlXG4gICAgaWYgKG9sZFRyaWdnZXJzW2tleV0gIT09IG5ld1RyaWdnZXJzW2tleV0pIHtcbiAgICAgIHJldHVybiBgJHt0cmlnZ2VyTmFtZX0uJHtrZXl9IGNoYW5nZWQgc2hhbGxvd2x5YDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBuZXdUcmlnZ2Vycykge1xuICAgIGlmICghKGtleSBpbiBvbGRUcmlnZ2VycykpIHtcbiAgICAgIHJldHVybiBgJHt0cmlnZ2VyTmFtZX0uJHtrZXl9IGFkZGVkYDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==