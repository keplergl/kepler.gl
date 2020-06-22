"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.hexagonAggregation = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _aggregationLayers = require("@deck.gl/aggregation-layers");

var _cpuAggregator = _interopRequireWildcard(require("../layer-utils/cpu-aggregator"));

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
var hexagonAggregation = {
  key: 'position',
  updateSteps: [{
    key: 'aggregate',
    triggers: {
      cellSize: {
        prop: 'radius'
      },
      position: {
        prop: 'getPosition',
        updateTrigger: 'getPosition'
      },
      aggregator: {
        prop: 'hexagonAggregator'
      }
    },
    updater: _cpuAggregator.getAggregatedData
  }]
};
exports.hexagonAggregation = hexagonAggregation;

var ScaleEnhancedHexagonLayer =
/*#__PURE__*/
function (_HexagonLayer) {
  (0, _inherits2["default"])(ScaleEnhancedHexagonLayer, _HexagonLayer);

  function ScaleEnhancedHexagonLayer() {
    (0, _classCallCheck2["default"])(this, ScaleEnhancedHexagonLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ScaleEnhancedHexagonLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ScaleEnhancedHexagonLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var cpuAggregator = new _cpuAggregator["default"]({
        aggregation: hexagonAggregation
      });
      this.state = {
        cpuAggregator: cpuAggregator,
        aggregatorState: cpuAggregator.state
      };
      var attributeManager = this.getAttributeManager();
      attributeManager.add({
        positions: {
          size: 3,
          accessor: 'getPosition'
        }
      });
    }
  }]);
  return ScaleEnhancedHexagonLayer;
}(_aggregationLayers.HexagonLayer);

exports["default"] = ScaleEnhancedHexagonLayer;
ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2hleGFnb24tbGF5ZXIvZW5oYW5jZWQtaGV4YWdvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJoZXhhZ29uQWdncmVnYXRpb24iLCJrZXkiLCJ1cGRhdGVTdGVwcyIsInRyaWdnZXJzIiwiY2VsbFNpemUiLCJwcm9wIiwicG9zaXRpb24iLCJ1cGRhdGVUcmlnZ2VyIiwiYWdncmVnYXRvciIsInVwZGF0ZXIiLCJnZXRBZ2dyZWdhdGVkRGF0YSIsIlNjYWxlRW5oYW5jZWRIZXhhZ29uTGF5ZXIiLCJjcHVBZ2dyZWdhdG9yIiwiQ1BVQWdncmVnYXRvciIsImFnZ3JlZ2F0aW9uIiwic3RhdGUiLCJhZ2dyZWdhdG9yU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiZ2V0QXR0cmlidXRlTWFuYWdlciIsImFkZCIsInBvc2l0aW9ucyIsInNpemUiLCJhY2Nlc3NvciIsIkhleGFnb25MYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQXJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtPLElBQU1BLGtCQUFrQixHQUFHO0FBQ2hDQyxFQUFBQSxHQUFHLEVBQUUsVUFEMkI7QUFFaENDLEVBQUFBLFdBQVcsRUFBRSxDQUNYO0FBQ0VELElBQUFBLEdBQUcsRUFBRSxXQURQO0FBRUVFLElBQUFBLFFBQVEsRUFBRTtBQUNSQyxNQUFBQSxRQUFRLEVBQUU7QUFDUkMsUUFBQUEsSUFBSSxFQUFFO0FBREUsT0FERjtBQUlSQyxNQUFBQSxRQUFRLEVBQUU7QUFDUkQsUUFBQUEsSUFBSSxFQUFFLGFBREU7QUFFUkUsUUFBQUEsYUFBYSxFQUFFO0FBRlAsT0FKRjtBQVFSQyxNQUFBQSxVQUFVLEVBQUU7QUFDVkgsUUFBQUEsSUFBSSxFQUFFO0FBREk7QUFSSixLQUZaO0FBY0VJLElBQUFBLE9BQU8sRUFBRUM7QUFkWCxHQURXO0FBRm1CLENBQTNCOzs7SUFzQmNDLHlCOzs7Ozs7Ozs7Ozs7c0NBQ0Q7QUFDaEIsVUFBTUMsYUFBYSxHQUFHLElBQUlDLHlCQUFKLENBQWtCO0FBQ3RDQyxRQUFBQSxXQUFXLEVBQUVkO0FBRHlCLE9BQWxCLENBQXRCO0FBSUEsV0FBS2UsS0FBTCxHQUFhO0FBQ1hILFFBQUFBLGFBQWEsRUFBYkEsYUFEVztBQUVYSSxRQUFBQSxlQUFlLEVBQUVKLGFBQWEsQ0FBQ0c7QUFGcEIsT0FBYjtBQUlBLFVBQU1FLGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLEVBQXpCO0FBQ0FELE1BQUFBLGdCQUFnQixDQUFDRSxHQUFqQixDQUFxQjtBQUNuQkMsUUFBQUEsU0FBUyxFQUFFO0FBQUNDLFVBQUFBLElBQUksRUFBRSxDQUFQO0FBQVVDLFVBQUFBLFFBQVEsRUFBRTtBQUFwQjtBQURRLE9BQXJCO0FBR0Q7OztFQWRvREMsK0I7OztBQWlCdkRaLHlCQUF5QixDQUFDYSxTQUExQixHQUFzQywyQkFBdEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0hleGFnb25MYXllcn0gZnJvbSAnQGRlY2suZ2wvYWdncmVnYXRpb24tbGF5ZXJzJztcbmltcG9ydCBDUFVBZ2dyZWdhdG9yLCB7Z2V0QWdncmVnYXRlZERhdGF9IGZyb20gJy4uL2xheWVyLXV0aWxzL2NwdS1hZ2dyZWdhdG9yJztcblxuZXhwb3J0IGNvbnN0IGhleGFnb25BZ2dyZWdhdGlvbiA9IHtcbiAga2V5OiAncG9zaXRpb24nLFxuICB1cGRhdGVTdGVwczogW1xuICAgIHtcbiAgICAgIGtleTogJ2FnZ3JlZ2F0ZScsXG4gICAgICB0cmlnZ2Vyczoge1xuICAgICAgICBjZWxsU2l6ZToge1xuICAgICAgICAgIHByb3A6ICdyYWRpdXMnXG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgcHJvcDogJ2dldFBvc2l0aW9uJyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnZ2V0UG9zaXRpb24nXG4gICAgICAgIH0sXG4gICAgICAgIGFnZ3JlZ2F0b3I6IHtcbiAgICAgICAgICBwcm9wOiAnaGV4YWdvbkFnZ3JlZ2F0b3InXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cGRhdGVyOiBnZXRBZ2dyZWdhdGVkRGF0YVxuICAgIH1cbiAgXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhbGVFbmhhbmNlZEhleGFnb25MYXllciBleHRlbmRzIEhleGFnb25MYXllciB7XG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCBjcHVBZ2dyZWdhdG9yID0gbmV3IENQVUFnZ3JlZ2F0b3Ioe1xuICAgICAgYWdncmVnYXRpb246IGhleGFnb25BZ2dyZWdhdGlvblxuICAgIH0pO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNwdUFnZ3JlZ2F0b3IsXG4gICAgICBhZ2dyZWdhdG9yU3RhdGU6IGNwdUFnZ3JlZ2F0b3Iuc3RhdGVcbiAgICB9O1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hbmFnZXIgPSB0aGlzLmdldEF0dHJpYnV0ZU1hbmFnZXIoKTtcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZCh7XG4gICAgICBwb3NpdGlvbnM6IHtzaXplOiAzLCBhY2Nlc3NvcjogJ2dldFBvc2l0aW9uJ31cbiAgICB9KTtcbiAgfVxufVxuXG5TY2FsZUVuaGFuY2VkSGV4YWdvbkxheWVyLmxheWVyTmFtZSA9ICdTY2FsZUVuaGFuY2VkSGV4YWdvbkxheWVyJztcbiJdfQ==