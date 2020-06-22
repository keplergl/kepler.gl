"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.gridAggregation = void 0;

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
var gridAggregation = {
  key: 'position',
  updateSteps: [{
    key: 'aggregate',
    triggers: {
      cellSize: {
        prop: 'cellSize'
      },
      position: {
        prop: 'getPosition',
        updateTrigger: 'getPosition'
      },
      aggregator: {
        prop: 'gridAggregator'
      }
    },
    updater: _cpuAggregator.getAggregatedData
  }]
};
exports.gridAggregation = gridAggregation;

var ScaleEnhancedGridLayer =
/*#__PURE__*/
function (_CPUGridLayer) {
  (0, _inherits2["default"])(ScaleEnhancedGridLayer, _CPUGridLayer);

  function ScaleEnhancedGridLayer() {
    (0, _classCallCheck2["default"])(this, ScaleEnhancedGridLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ScaleEnhancedGridLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ScaleEnhancedGridLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var cpuAggregator = new _cpuAggregator["default"]({
        aggregation: gridAggregation
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
  return ScaleEnhancedGridLayer;
}(_aggregationLayers.CPUGridLayer);

exports["default"] = ScaleEnhancedGridLayer;
ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtY3B1LWdyaWQtbGF5ZXIuanMiXSwibmFtZXMiOlsiZ3JpZEFnZ3JlZ2F0aW9uIiwia2V5IiwidXBkYXRlU3RlcHMiLCJ0cmlnZ2VycyIsImNlbGxTaXplIiwicHJvcCIsInBvc2l0aW9uIiwidXBkYXRlVHJpZ2dlciIsImFnZ3JlZ2F0b3IiLCJ1cGRhdGVyIiwiZ2V0QWdncmVnYXRlZERhdGEiLCJTY2FsZUVuaGFuY2VkR3JpZExheWVyIiwiY3B1QWdncmVnYXRvciIsIkNQVUFnZ3JlZ2F0b3IiLCJhZ2dyZWdhdGlvbiIsInN0YXRlIiwiYWdncmVnYXRvclN0YXRlIiwiYXR0cmlidXRlTWFuYWdlciIsImdldEF0dHJpYnV0ZU1hbmFnZXIiLCJhZGQiLCJwb3NpdGlvbnMiLCJzaXplIiwiYWNjZXNzb3IiLCJDUFVHcmlkTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLTyxJQUFNQSxlQUFlLEdBQUc7QUFDN0JDLEVBQUFBLEdBQUcsRUFBRSxVQUR3QjtBQUU3QkMsRUFBQUEsV0FBVyxFQUFFLENBQ1g7QUFDRUQsSUFBQUEsR0FBRyxFQUFFLFdBRFA7QUFFRUUsSUFBQUEsUUFBUSxFQUFFO0FBQ1JDLE1BQUFBLFFBQVEsRUFBRTtBQUNSQyxRQUFBQSxJQUFJLEVBQUU7QUFERSxPQURGO0FBSVJDLE1BQUFBLFFBQVEsRUFBRTtBQUNSRCxRQUFBQSxJQUFJLEVBQUUsYUFERTtBQUVSRSxRQUFBQSxhQUFhLEVBQUU7QUFGUCxPQUpGO0FBUVJDLE1BQUFBLFVBQVUsRUFBRTtBQUNWSCxRQUFBQSxJQUFJLEVBQUU7QUFESTtBQVJKLEtBRlo7QUFjRUksSUFBQUEsT0FBTyxFQUFFQztBQWRYLEdBRFc7QUFGZ0IsQ0FBeEI7OztJQXNCY0Msc0I7Ozs7Ozs7Ozs7OztzQ0FDRDtBQUNoQixVQUFNQyxhQUFhLEdBQUcsSUFBSUMseUJBQUosQ0FBa0I7QUFDdENDLFFBQUFBLFdBQVcsRUFBRWQ7QUFEeUIsT0FBbEIsQ0FBdEI7QUFJQSxXQUFLZSxLQUFMLEdBQWE7QUFDWEgsUUFBQUEsYUFBYSxFQUFiQSxhQURXO0FBRVhJLFFBQUFBLGVBQWUsRUFBRUosYUFBYSxDQUFDRztBQUZwQixPQUFiO0FBSUEsVUFBTUUsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQUQsTUFBQUEsZ0JBQWdCLENBQUNFLEdBQWpCLENBQXFCO0FBQ25CQyxRQUFBQSxTQUFTLEVBQUU7QUFBQ0MsVUFBQUEsSUFBSSxFQUFFLENBQVA7QUFBVUMsVUFBQUEsUUFBUSxFQUFFO0FBQXBCO0FBRFEsT0FBckI7QUFHRDs7O0VBZGlEQywrQjs7O0FBaUJwRFosc0JBQXNCLENBQUNhLFNBQXZCLEdBQW1DLHdCQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Q1BVR3JpZExheWVyfSBmcm9tICdAZGVjay5nbC9hZ2dyZWdhdGlvbi1sYXllcnMnO1xuaW1wb3J0IENQVUFnZ3JlZ2F0b3IsIHtnZXRBZ2dyZWdhdGVkRGF0YX0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY3B1LWFnZ3JlZ2F0b3InO1xuXG5leHBvcnQgY29uc3QgZ3JpZEFnZ3JlZ2F0aW9uID0ge1xuICBrZXk6ICdwb3NpdGlvbicsXG4gIHVwZGF0ZVN0ZXBzOiBbXG4gICAge1xuICAgICAga2V5OiAnYWdncmVnYXRlJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIGNlbGxTaXplOiB7XG4gICAgICAgICAgcHJvcDogJ2NlbGxTaXplJ1xuICAgICAgICB9LFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHByb3A6ICdnZXRQb3NpdGlvbicsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcjogJ2dldFBvc2l0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICBhZ2dyZWdhdG9yOiB7XG4gICAgICAgICAgcHJvcDogJ2dyaWRBZ2dyZWdhdG9yJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdXBkYXRlcjogZ2V0QWdncmVnYXRlZERhdGFcbiAgICB9XG4gIF1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYWxlRW5oYW5jZWRHcmlkTGF5ZXIgZXh0ZW5kcyBDUFVHcmlkTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3QgY3B1QWdncmVnYXRvciA9IG5ldyBDUFVBZ2dyZWdhdG9yKHtcbiAgICAgIGFnZ3JlZ2F0aW9uOiBncmlkQWdncmVnYXRpb25cbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjcHVBZ2dyZWdhdG9yLFxuICAgICAgYWdncmVnYXRvclN0YXRlOiBjcHVBZ2dyZWdhdG9yLnN0YXRlXG4gICAgfTtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYW5hZ2VyID0gdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCk7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGQoe1xuICAgICAgcG9zaXRpb25zOiB7c2l6ZTogMywgYWNjZXNzb3I6ICdnZXRQb3NpdGlvbid9XG4gICAgfSk7XG4gIH1cbn1cblxuU2NhbGVFbmhhbmNlZEdyaWRMYXllci5sYXllck5hbWUgPSAnU2NhbGVFbmhhbmNlZEdyaWRMYXllcic7XG4iXX0=