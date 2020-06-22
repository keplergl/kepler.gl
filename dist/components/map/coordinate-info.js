"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _dataUtils = require("../../utils/data-utils");

var _icons = require("../common/icons");

var _layerHoverInfo = require("./layer-hover-info");

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
// 6th decimal is worth up to 0.11 m
// https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
var DECIMAL = 6;

var CoordinateInfoFactory = function CoordinateInfoFactory() {
  var CoordinateInfo = function CoordinateInfo(_ref) {
    var coordinate = _ref.coordinate;
    return _react["default"].createElement("div", null, _react["default"].createElement(_layerHoverInfo.StyledLayerName, {
      className: "map-popover__layer-name"
    }, _react["default"].createElement(_icons.CursorClick, {
      height: "12px"
    }), "Coordinate"), _react["default"].createElement("table", null, _react["default"].createElement("tbody", null, _react["default"].createElement("tr", {
      className: "row"
    }, _react["default"].createElement("td", {
      className: "row__value"
    }, (0, _dataUtils.preciseRound)(coordinate[1], DECIMAL), ","), _react["default"].createElement("td", {
      className: "row__value"
    }, (0, _dataUtils.preciseRound)(coordinate[0], DECIMAL))))));
  };

  return CoordinateInfo;
};

var _default = CoordinateInfoFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9jb29yZGluYXRlLWluZm8uanMiXSwibmFtZXMiOlsiREVDSU1BTCIsIkNvb3JkaW5hdGVJbmZvRmFjdG9yeSIsIkNvb3JkaW5hdGVJbmZvIiwiY29vcmRpbmF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQSxJQUFNQSxPQUFPLEdBQUcsQ0FBaEI7O0FBRUEsSUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixHQUFNO0FBQ2xDLE1BQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUI7QUFBQSxRQUFFQyxVQUFGLFFBQUVBLFVBQUY7QUFBQSxXQUNyQiw2Q0FDRSxnQ0FBQywrQkFBRDtBQUFpQixNQUFBLFNBQVMsRUFBQztBQUEzQixPQUNFLGdDQUFDLGtCQUFEO0FBQWEsTUFBQSxNQUFNLEVBQUM7QUFBcEIsTUFERixlQURGLEVBS0UsK0NBQ0UsK0NBQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQTRCLDZCQUFhQSxVQUFVLENBQUMsQ0FBRCxDQUF2QixFQUE0QkgsT0FBNUIsQ0FBNUIsTUFERixFQUVFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxPQUE0Qiw2QkFBYUcsVUFBVSxDQUFDLENBQUQsQ0FBdkIsRUFBNEJILE9BQTVCLENBQTVCLENBRkYsQ0FERixDQURGLENBTEYsQ0FEcUI7QUFBQSxHQUF2Qjs7QUFpQkEsU0FBT0UsY0FBUDtBQUNELENBbkJEOztlQXFCZUQscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwcmVjaXNlUm91bmR9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtDdXJzb3JDbGlja30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtTdHlsZWRMYXllck5hbWV9IGZyb20gJy4vbGF5ZXItaG92ZXItaW5mbyc7XG5cbi8vIDZ0aCBkZWNpbWFsIGlzIHdvcnRoIHVwIHRvIDAuMTEgbVxuLy8gaHR0cHM6Ly9naXMuc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzg2NTAvbWVhc3VyaW5nLWFjY3VyYWN5LW9mLWxhdGl0dWRlLWFuZC1sb25naXR1ZGVcbmNvbnN0IERFQ0lNQUwgPSA2O1xuXG5jb25zdCBDb29yZGluYXRlSW5mb0ZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IENvb3JkaW5hdGVJbmZvID0gKHtjb29yZGluYXRlfSkgPT4gKFxuICAgIDxkaXY+XG4gICAgICA8U3R5bGVkTGF5ZXJOYW1lIGNsYXNzTmFtZT1cIm1hcC1wb3BvdmVyX19sYXllci1uYW1lXCI+XG4gICAgICAgIDxDdXJzb3JDbGljayBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgICAgQ29vcmRpbmF0ZVxuICAgICAgPC9TdHlsZWRMYXllck5hbWU+XG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicm93X192YWx1ZVwiPntwcmVjaXNlUm91bmQoY29vcmRpbmF0ZVsxXSwgREVDSU1BTCl9LDwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicm93X192YWx1ZVwiPntwcmVjaXNlUm91bmQoY29vcmRpbmF0ZVswXSwgREVDSU1BTCl9PC90ZD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gQ29vcmRpbmF0ZUluZm87XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb29yZGluYXRlSW5mb0ZhY3Rvcnk7XG4iXX0=