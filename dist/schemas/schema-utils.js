"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePropertiesOrApplySchema = savePropertiesOrApplySchema;
exports.loadPropertiesOrApplySchema = loadPropertiesOrApplySchema;
exports.getPropertyValueFromSchema = getPropertyValueFromSchema;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

/**
 * Recursively save / load value for state based on property keys,
 * if property[key] is another schema
 * Use is to get value to save
 * @param {Object} state - state to save
 * @param {Object} properties - properties schema
 * @returns {Object} - saved state
 */
function savePropertiesOrApplySchema(state, properties) {
  return getPropertyValueFromSchema('save', state, properties);
}

function loadPropertiesOrApplySchema(state, properties) {
  return getPropertyValueFromSchema('load', state, properties);
}

function getPropertyValueFromSchema(operation, state, properties) {
  return Object.keys(properties).reduce(function (accu, key) {
    return _objectSpread({}, accu, {}, key in state ? properties[key] ? // if it's another schema
    properties[key][operation] ? // call save or load
    properties[key][operation](state[key], state) : // if it's another property object
    getPropertyValueFromSchema(operation, state[key], properties[key]) : (0, _defineProperty2["default"])({}, key, state[key]) : {});
  }, {});
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS11dGlscy5qcyJdLCJuYW1lcyI6WyJzYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJzdGF0ZSIsInByb3BlcnRpZXMiLCJnZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSIsImxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIm9wZXJhdGlvbiIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1Iiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQVFPLFNBQVNBLDJCQUFULENBQXFDQyxLQUFyQyxFQUE0Q0MsVUFBNUMsRUFBd0Q7QUFDN0QsU0FBT0MsMEJBQTBCLENBQUMsTUFBRCxFQUFTRixLQUFULEVBQWdCQyxVQUFoQixDQUFqQztBQUNEOztBQUVNLFNBQVNFLDJCQUFULENBQXFDSCxLQUFyQyxFQUE0Q0MsVUFBNUMsRUFBd0Q7QUFDN0QsU0FBT0MsMEJBQTBCLENBQUMsTUFBRCxFQUFTRixLQUFULEVBQWdCQyxVQUFoQixDQUFqQztBQUNEOztBQUVNLFNBQVNDLDBCQUFULENBQW9DRSxTQUFwQyxFQUErQ0osS0FBL0MsRUFBc0RDLFVBQXRELEVBQWtFO0FBQ3ZFLFNBQU9JLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxVQUFaLEVBQXdCTSxNQUF4QixDQUNMLFVBQUNDLElBQUQsRUFBT0MsR0FBUDtBQUFBLDZCQUNLRCxJQURMLE1BRU1DLEdBQUcsSUFBSVQsS0FBUCxHQUNBQyxVQUFVLENBQUNRLEdBQUQsQ0FBVixHQUNFO0FBQ0FSLElBQUFBLFVBQVUsQ0FBQ1EsR0FBRCxDQUFWLENBQWdCTCxTQUFoQixJQUNFO0FBQ0FILElBQUFBLFVBQVUsQ0FBQ1EsR0FBRCxDQUFWLENBQWdCTCxTQUFoQixFQUEyQkosS0FBSyxDQUFDUyxHQUFELENBQWhDLEVBQXVDVCxLQUF2QyxDQUZGLEdBR0U7QUFDQUUsSUFBQUEsMEJBQTBCLENBQUNFLFNBQUQsRUFBWUosS0FBSyxDQUFDUyxHQUFELENBQWpCLEVBQXdCUixVQUFVLENBQUNRLEdBQUQsQ0FBbEMsQ0FOOUIsd0NBT0lBLEdBUEosRUFPVVQsS0FBSyxDQUFDUyxHQUFELENBUGYsQ0FEQSxHQVNBLEVBWE47QUFBQSxHQURLLEVBY0wsRUFkSyxDQUFQO0FBZ0JEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBzYXZlIC8gbG9hZCB2YWx1ZSBmb3Igc3RhdGUgYmFzZWQgb24gcHJvcGVydHkga2V5cyxcbiAqIGlmIHByb3BlcnR5W2tleV0gaXMgYW5vdGhlciBzY2hlbWFcbiAqIFVzZSBpcyB0byBnZXQgdmFsdWUgdG8gc2F2ZVxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIC0gc3RhdGUgdG8gc2F2ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXMgLSBwcm9wZXJ0aWVzIHNjaGVtYVxuICogQHJldHVybnMge09iamVjdH0gLSBzYXZlZCBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKHN0YXRlLCBwcm9wZXJ0aWVzKSB7XG4gIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSgnc2F2ZScsIHN0YXRlLCBwcm9wZXJ0aWVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShzdGF0ZSwgcHJvcGVydGllcykge1xuICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEoJ2xvYWQnLCBzdGF0ZSwgcHJvcGVydGllcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYShvcGVyYXRpb24sIHN0YXRlLCBwcm9wZXJ0aWVzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5yZWR1Y2UoXG4gICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICAuLi4oa2V5IGluIHN0YXRlXG4gICAgICAgID8gcHJvcGVydGllc1trZXldXG4gICAgICAgICAgPyAvLyBpZiBpdCdzIGFub3RoZXIgc2NoZW1hXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV1bb3BlcmF0aW9uXVxuICAgICAgICAgICAgPyAvLyBjYWxsIHNhdmUgb3IgbG9hZFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV1bb3BlcmF0aW9uXShzdGF0ZVtrZXldLCBzdGF0ZSlcbiAgICAgICAgICAgIDogLy8gaWYgaXQncyBhbm90aGVyIHByb3BlcnR5IG9iamVjdFxuICAgICAgICAgICAgICBnZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYShvcGVyYXRpb24sIHN0YXRlW2tleV0sIHByb3BlcnRpZXNba2V5XSlcbiAgICAgICAgICA6IHtba2V5XTogc3RhdGVba2V5XX1cbiAgICAgICAgOiB7fSlcbiAgICB9KSxcbiAgICB7fVxuICApO1xufVxuIl19