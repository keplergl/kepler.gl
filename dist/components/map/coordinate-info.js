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
// 6th decimal is worth up to 0.11 m
// https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
var DECIMAL = 6;
var DECIMAL_Z = 1;

var CoordinateInfoFactory = function CoordinateInfoFactory() {
  var CoordinateInfo = function CoordinateInfo(_ref) {
    var coordinate = _ref.coordinate,
        zoom = _ref.zoom;
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "coordingate-hover-info"
    }, /*#__PURE__*/_react["default"].createElement(_layerHoverInfo.StyledLayerName, {
      className: "map-popover__layer-name"
    }, /*#__PURE__*/_react["default"].createElement(_icons.CursorClick, {
      height: "12px"
    }), "Coordinate"), /*#__PURE__*/_react["default"].createElement("table", null, /*#__PURE__*/_react["default"].createElement("tbody", null, /*#__PURE__*/_react["default"].createElement("tr", {
      className: "row"
    }, /*#__PURE__*/_react["default"].createElement("td", {
      className: "row__value"
    }, (0, _dataUtils.preciseRound)(coordinate[1], DECIMAL), ","), /*#__PURE__*/_react["default"].createElement("td", {
      className: "row__value"
    }, (0, _dataUtils.preciseRound)(coordinate[0], DECIMAL), ","), /*#__PURE__*/_react["default"].createElement("td", {
      className: "row__value"
    }, (0, _dataUtils.preciseRound)(zoom, DECIMAL_Z), "z")))));
  };

  return CoordinateInfo;
};

var _default = CoordinateInfoFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9jb29yZGluYXRlLWluZm8uanMiXSwibmFtZXMiOlsiREVDSU1BTCIsIkRFQ0lNQUxfWiIsIkNvb3JkaW5hdGVJbmZvRmFjdG9yeSIsIkNvb3JkaW5hdGVJbmZvIiwiY29vcmRpbmF0ZSIsInpvb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUF2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0EsSUFBTUEsT0FBTyxHQUFHLENBQWhCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLENBQWxCOztBQUVBLElBQU1DLHFCQUFxQixHQUFHLFNBQXhCQSxxQkFBd0IsR0FBTTtBQUNsQyxNQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCO0FBQUEsUUFBRUMsVUFBRixRQUFFQSxVQUFGO0FBQUEsUUFBY0MsSUFBZCxRQUFjQSxJQUFkO0FBQUEsd0JBQ3JCO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRSxnQ0FBQywrQkFBRDtBQUFpQixNQUFBLFNBQVMsRUFBQztBQUEzQixvQkFDRSxnQ0FBQyxrQkFBRDtBQUFhLE1BQUEsTUFBTSxFQUFDO0FBQXBCLE1BREYsZUFERixlQUtFLDREQUNFLDREQUNFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxvQkFDRTtBQUFJLE1BQUEsU0FBUyxFQUFDO0FBQWQsT0FBNEIsNkJBQWFELFVBQVUsQ0FBQyxDQUFELENBQXZCLEVBQTRCSixPQUE1QixDQUE1QixNQURGLGVBRUU7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQTRCLDZCQUFhSSxVQUFVLENBQUMsQ0FBRCxDQUF2QixFQUE0QkosT0FBNUIsQ0FBNUIsTUFGRixlQUdFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxPQUE0Qiw2QkFBYUssSUFBYixFQUFtQkosU0FBbkIsQ0FBNUIsTUFIRixDQURGLENBREYsQ0FMRixDQURxQjtBQUFBLEdBQXZCOztBQWtCQSxTQUFPRSxjQUFQO0FBQ0QsQ0FwQkQ7O2VBc0JlRCxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3ByZWNpc2VSb3VuZH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge0N1cnNvckNsaWNrfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1N0eWxlZExheWVyTmFtZX0gZnJvbSAnLi9sYXllci1ob3Zlci1pbmZvJztcblxuLy8gNnRoIGRlY2ltYWwgaXMgd29ydGggdXAgdG8gMC4xMSBtXG4vLyBodHRwczovL2dpcy5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvODY1MC9tZWFzdXJpbmctYWNjdXJhY3ktb2YtbGF0aXR1ZGUtYW5kLWxvbmdpdHVkZVxuY29uc3QgREVDSU1BTCA9IDY7XG5jb25zdCBERUNJTUFMX1ogPSAxO1xuXG5jb25zdCBDb29yZGluYXRlSW5mb0ZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IENvb3JkaW5hdGVJbmZvID0gKHtjb29yZGluYXRlLCB6b29tfSkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29vcmRpbmdhdGUtaG92ZXItaW5mb1wiPlxuICAgICAgPFN0eWxlZExheWVyTmFtZSBjbGFzc05hbWU9XCJtYXAtcG9wb3Zlcl9fbGF5ZXItbmFtZVwiPlxuICAgICAgICA8Q3Vyc29yQ2xpY2sgaGVpZ2h0PVwiMTJweFwiIC8+XG4gICAgICAgIENvb3JkaW5hdGVcbiAgICAgIDwvU3R5bGVkTGF5ZXJOYW1lPlxuICAgICAgPHRhYmxlPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgPHRyIGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fdmFsdWVcIj57cHJlY2lzZVJvdW5kKGNvb3JkaW5hdGVbMV0sIERFQ0lNQUwpfSw8L3RkPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fdmFsdWVcIj57cHJlY2lzZVJvdW5kKGNvb3JkaW5hdGVbMF0sIERFQ0lNQUwpfSw8L3RkPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fdmFsdWVcIj57cHJlY2lzZVJvdW5kKHpvb20sIERFQ0lNQUxfWil9ejwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gICk7XG5cbiAgcmV0dXJuIENvb3JkaW5hdGVJbmZvO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29vcmRpbmF0ZUluZm9GYWN0b3J5O1xuIl19