"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _aggregationLayers = require("@deck.gl/aggregation-layers");

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
var EnhancedBinSorter =
/*#__PURE__*/
function (_BinSorter) {
  (0, _inherits2["default"])(EnhancedBinSorter, _BinSorter);

  function EnhancedBinSorter() {
    (0, _classCallCheck2["default"])(this, EnhancedBinSorter);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EnhancedBinSorter).apply(this, arguments));
  }

  (0, _createClass2["default"])(EnhancedBinSorter, [{
    key: "getValueRange",
    value: function getValueRange(percentileRange) {
      if (!this.sortedBins) {
        this.sortedBins = this.aggregatedBins.sort(function (a, b) {
          return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
        });
      }

      if (!this.sortedBins.length) {
        return [];
      }

      var lowerIdx = 0;
      var upperIdx = this.sortedBins.length - 1;

      if (Array.isArray(percentileRange)) {
        var idxRange = this._percentileToIndex(percentileRange);

        lowerIdx = idxRange[0];
        upperIdx = idxRange[1];
      }

      return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
    }
  }, {
    key: "getValueDomainByScale",
    value: function getValueDomainByScale(scale) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
          _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          _ref2$ = _ref2[0],
          lower = _ref2$ === void 0 ? 0 : _ref2$,
          _ref2$2 = _ref2[1],
          upper = _ref2$2 === void 0 ? 100 : _ref2$2;

      if (!this.sortedBins) {
        this.sortedBins = this.aggregatedBins.sort(function (a, b) {
          return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
        });
      }

      if (!this.sortedBins.length) {
        return [];
      }

      var indexEdge = this._percentileToIndex([lower, upper]);

      return this._getScaleDomain(scale, indexEdge);
    }
  }]);
  return EnhancedBinSorter;
}(_aggregationLayers._BinSorter);

exports["default"] = EnhancedBinSorter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2VuaGFuY2VkLWJpbi1zb3J0ZXIuanMiXSwibmFtZXMiOlsiRW5oYW5jZWRCaW5Tb3J0ZXIiLCJwZXJjZW50aWxlUmFuZ2UiLCJzb3J0ZWRCaW5zIiwiYWdncmVnYXRlZEJpbnMiLCJzb3J0IiwiYSIsImIiLCJ2YWx1ZSIsImxlbmd0aCIsImxvd2VySWR4IiwidXBwZXJJZHgiLCJBcnJheSIsImlzQXJyYXkiLCJpZHhSYW5nZSIsIl9wZXJjZW50aWxlVG9JbmRleCIsInNjYWxlIiwibG93ZXIiLCJ1cHBlciIsImluZGV4RWRnZSIsIl9nZXRTY2FsZURvbWFpbiIsIkJpblNvcnRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQXBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUlxQkEsaUI7Ozs7Ozs7Ozs7OztrQ0FDTEMsZSxFQUFpQjtBQUM3QixVQUFJLENBQUMsS0FBS0MsVUFBVixFQUFzQjtBQUNwQixhQUFLQSxVQUFMLEdBQWtCLEtBQUtDLGNBQUwsQ0FBb0JDLElBQXBCLENBQXlCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGlCQUN6Q0QsQ0FBQyxDQUFDRSxLQUFGLEdBQVVELENBQUMsQ0FBQ0MsS0FBWixHQUFvQixDQUFwQixHQUF3QkYsQ0FBQyxDQUFDRSxLQUFGLEdBQVVELENBQUMsQ0FBQ0MsS0FBWixHQUFvQixDQUFDLENBQXJCLEdBQXlCLENBRFI7QUFBQSxTQUF6QixDQUFsQjtBQUdEOztBQUNELFVBQUksQ0FBQyxLQUFLTCxVQUFMLENBQWdCTSxNQUFyQixFQUE2QjtBQUMzQixlQUFPLEVBQVA7QUFDRDs7QUFDRCxVQUFJQyxRQUFRLEdBQUcsQ0FBZjtBQUNBLFVBQUlDLFFBQVEsR0FBRyxLQUFLUixVQUFMLENBQWdCTSxNQUFoQixHQUF5QixDQUF4Qzs7QUFFQSxVQUFJRyxLQUFLLENBQUNDLE9BQU4sQ0FBY1gsZUFBZCxDQUFKLEVBQW9DO0FBQ2xDLFlBQU1ZLFFBQVEsR0FBRyxLQUFLQyxrQkFBTCxDQUF3QmIsZUFBeEIsQ0FBakI7O0FBQ0FRLFFBQUFBLFFBQVEsR0FBR0ksUUFBUSxDQUFDLENBQUQsQ0FBbkI7QUFDQUgsUUFBQUEsUUFBUSxHQUFHRyxRQUFRLENBQUMsQ0FBRCxDQUFuQjtBQUNEOztBQUVELGFBQU8sQ0FBQyxLQUFLWCxVQUFMLENBQWdCTyxRQUFoQixFQUEwQkYsS0FBM0IsRUFBa0MsS0FBS0wsVUFBTCxDQUFnQlEsUUFBaEIsRUFBMEJILEtBQTVELENBQVA7QUFDRDs7OzBDQUVxQlEsSyxFQUFzQztBQUFBLHFGQUFKLEVBQUk7QUFBQTtBQUFBO0FBQUEsVUFBOUJDLEtBQThCLHVCQUF0QixDQUFzQjtBQUFBO0FBQUEsVUFBbkJDLEtBQW1CLHdCQUFYLEdBQVc7O0FBQzFELFVBQUksQ0FBQyxLQUFLZixVQUFWLEVBQXNCO0FBQ3BCLGFBQUtBLFVBQUwsR0FBa0IsS0FBS0MsY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsaUJBQ3pDRCxDQUFDLENBQUNFLEtBQUYsR0FBVUQsQ0FBQyxDQUFDQyxLQUFaLEdBQW9CLENBQXBCLEdBQXdCRixDQUFDLENBQUNFLEtBQUYsR0FBVUQsQ0FBQyxDQUFDQyxLQUFaLEdBQW9CLENBQUMsQ0FBckIsR0FBeUIsQ0FEUjtBQUFBLFNBQXpCLENBQWxCO0FBR0Q7O0FBQ0QsVUFBSSxDQUFDLEtBQUtMLFVBQUwsQ0FBZ0JNLE1BQXJCLEVBQTZCO0FBQzNCLGVBQU8sRUFBUDtBQUNEOztBQUNELFVBQU1VLFNBQVMsR0FBRyxLQUFLSixrQkFBTCxDQUF3QixDQUFDRSxLQUFELEVBQVFDLEtBQVIsQ0FBeEIsQ0FBbEI7O0FBRUEsYUFBTyxLQUFLRSxlQUFMLENBQXFCSixLQUFyQixFQUE0QkcsU0FBNUIsQ0FBUDtBQUNEOzs7RUFsQzRDRSw2QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7X0JpblNvcnRlciBhcyBCaW5Tb3J0ZXJ9IGZyb20gJ0BkZWNrLmdsL2FnZ3JlZ2F0aW9uLWxheWVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuaGFuY2VkQmluU29ydGVyIGV4dGVuZHMgQmluU29ydGVyIHtcbiAgZ2V0VmFsdWVSYW5nZShwZXJjZW50aWxlUmFuZ2UpIHtcbiAgICBpZiAoIXRoaXMuc29ydGVkQmlucykge1xuICAgICAgdGhpcy5zb3J0ZWRCaW5zID0gdGhpcy5hZ2dyZWdhdGVkQmlucy5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLnZhbHVlID4gYi52YWx1ZSA/IDEgOiBhLnZhbHVlIDwgYi52YWx1ZSA/IC0xIDogMFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnNvcnRlZEJpbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGxldCBsb3dlcklkeCA9IDA7XG4gICAgbGV0IHVwcGVySWR4ID0gdGhpcy5zb3J0ZWRCaW5zLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwZXJjZW50aWxlUmFuZ2UpKSB7XG4gICAgICBjb25zdCBpZHhSYW5nZSA9IHRoaXMuX3BlcmNlbnRpbGVUb0luZGV4KHBlcmNlbnRpbGVSYW5nZSk7XG4gICAgICBsb3dlcklkeCA9IGlkeFJhbmdlWzBdO1xuICAgICAgdXBwZXJJZHggPSBpZHhSYW5nZVsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3RoaXMuc29ydGVkQmluc1tsb3dlcklkeF0udmFsdWUsIHRoaXMuc29ydGVkQmluc1t1cHBlcklkeF0udmFsdWVdO1xuICB9XG5cbiAgZ2V0VmFsdWVEb21haW5CeVNjYWxlKHNjYWxlLCBbbG93ZXIgPSAwLCB1cHBlciA9IDEwMF0gPSBbXSkge1xuICAgIGlmICghdGhpcy5zb3J0ZWRCaW5zKSB7XG4gICAgICB0aGlzLnNvcnRlZEJpbnMgPSB0aGlzLmFnZ3JlZ2F0ZWRCaW5zLnNvcnQoKGEsIGIpID0+XG4gICAgICAgIGEudmFsdWUgPiBiLnZhbHVlID8gMSA6IGEudmFsdWUgPCBiLnZhbHVlID8gLTEgOiAwXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc29ydGVkQmlucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgaW5kZXhFZGdlID0gdGhpcy5fcGVyY2VudGlsZVRvSW5kZXgoW2xvd2VyLCB1cHBlcl0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2dldFNjYWxlRG9tYWluKHNjYWxlLCBpbmRleEVkZ2UpO1xuICB9XG59XG4iXX0=