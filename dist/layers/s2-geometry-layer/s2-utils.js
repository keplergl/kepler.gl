"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getS2Center = getS2Center;

var _long = _interopRequireDefault(require("long"));

var _s2Geometry = require("s2-geometry");

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
var MAXIMUM_TOKEN_LENGTH = 16;
/**
 * Retrieve S2 geometry center
 * @param s2Token string | number
 * @return {*[]}
 */

function getS2Center(s2Token) {
  var paddedToken = s2Token.toString().padEnd(MAXIMUM_TOKEN_LENGTH, '0');

  var s2Id = _long["default"].fromString(paddedToken, MAXIMUM_TOKEN_LENGTH);

  var _S2$idToLatLng = _s2Geometry.S2.idToLatLng(s2Id.toString()),
      lat = _S2$idToLatLng.lat,
      lng = _S2$idToLatLng.lng;

  return [lng, lat];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvczItZ2VvbWV0cnktbGF5ZXIvczItdXRpbHMuanMiXSwibmFtZXMiOlsiTUFYSU1VTV9UT0tFTl9MRU5HVEgiLCJnZXRTMkNlbnRlciIsInMyVG9rZW4iLCJwYWRkZWRUb2tlbiIsInRvU3RyaW5nIiwicGFkRW5kIiwiczJJZCIsIkxvbmciLCJmcm9tU3RyaW5nIiwiUzIiLCJpZFRvTGF0TG5nIiwibGF0IiwibG5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0EsSUFBTUEsb0JBQW9CLEdBQUcsRUFBN0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLFNBQVNDLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQThCO0FBQ25DLE1BQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDRSxRQUFSLEdBQW1CQyxNQUFuQixDQUEwQkwsb0JBQTFCLEVBQWdELEdBQWhELENBQXBCOztBQUNBLE1BQU1NLElBQUksR0FBR0MsaUJBQUtDLFVBQUwsQ0FBZ0JMLFdBQWhCLEVBQTZCSCxvQkFBN0IsQ0FBYjs7QUFGbUMsdUJBR2hCUyxlQUFHQyxVQUFILENBQWNKLElBQUksQ0FBQ0YsUUFBTCxFQUFkLENBSGdCO0FBQUEsTUFHNUJPLEdBSDRCLGtCQUc1QkEsR0FINEI7QUFBQSxNQUd2QkMsR0FIdUIsa0JBR3ZCQSxHQUh1Qjs7QUFJbkMsU0FBTyxDQUFDQSxHQUFELEVBQU1ELEdBQU4sQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExvbmcgZnJvbSAnbG9uZyc7XG5pbXBvcnQge1MyfSBmcm9tICdzMi1nZW9tZXRyeSc7XG5cbmNvbnN0IE1BWElNVU1fVE9LRU5fTEVOR1RIID0gMTY7XG5cbi8qKlxuICogUmV0cmlldmUgUzIgZ2VvbWV0cnkgY2VudGVyXG4gKiBAcGFyYW0gczJUb2tlbiBzdHJpbmcgfCBudW1iZXJcbiAqIEByZXR1cm4geypbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFMyQ2VudGVyKHMyVG9rZW4pIHtcbiAgY29uc3QgcGFkZGVkVG9rZW4gPSBzMlRva2VuLnRvU3RyaW5nKCkucGFkRW5kKE1BWElNVU1fVE9LRU5fTEVOR1RILCAnMCcpO1xuICBjb25zdCBzMklkID0gTG9uZy5mcm9tU3RyaW5nKHBhZGRlZFRva2VuLCBNQVhJTVVNX1RPS0VOX0xFTkdUSCk7XG4gIGNvbnN0IHtsYXQsIGxuZ30gPSBTMi5pZFRvTGF0TG5nKHMySWQudG9TdHJpbmcoKSk7XG4gIHJldHVybiBbbG5nLCBsYXRdO1xufVxuIl19