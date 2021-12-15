"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoJSON = getGeoJSON;
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _supercluster = _interopRequireDefault(require("supercluster"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

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
function getGeoJSON(data, getPosition, filterData) {
  var raw = typeof filterData === 'function' ? data.filter(filterData) : data;
  return raw.map(function (d) {
    return {
      type: 'Point',
      properties: {
        data: d,
        points: [d],
        point_count: 1,
        point_count_abbreviated: '1'
      },
      geometry: {
        coordinates: getPosition(d)
      }
    };
  }).filter(function (d) {
    return d.geometry.coordinates.every(Number.isFinite);
  });
}

var clusterResolver = function clusterResolver(_ref) {
  var clusterRadius = _ref.clusterRadius;
  return "".concat(clusterRadius);
};

var getClusterer = function getClusterer(_ref2) {
  var clusterRadius = _ref2.clusterRadius,
      geoJSON = _ref2.geoJSON;
  return new _supercluster["default"]({
    maxZoom: 20,
    radius: clusterRadius,
    reduce: function reduce(accumulated, props) {
      accumulated.points = [].concat((0, _toConsumableArray2["default"])(accumulated.points), (0, _toConsumableArray2["default"])(props.points));
    },
    map: function map(props) {
      return {
        points: [props.data]
      };
    }
  }).load(geoJSON);
};

var ClusterBuilder = /*#__PURE__*/function () {
  function ClusterBuilder() {
    (0, _classCallCheck2["default"])(this, ClusterBuilder);
    this.clusterer = (0, _lodash["default"])(getClusterer, clusterResolver);
  }

  (0, _createClass2["default"])(ClusterBuilder, [{
    key: "clustersAtZoom",
    value: function clustersAtZoom(_ref3) {
      var bbox = _ref3.bbox,
          clusterRadius = _ref3.clusterRadius,
          geoJSON = _ref3.geoJSON,
          zoom = _ref3.zoom;
      var clusterer = this.clusterer({
        clusterRadius: clusterRadius,
        geoJSON: geoJSON
      }); // map clusters to formatted bins to be passed to deck.gl bin-sorter

      var clusters = clusterer.getClusters(bbox, zoom).map(function (c, i) {
        return {
          points: c.properties.points,
          position: c.geometry.coordinates,
          index: i
        };
      });
      return clusters;
    }
  }, {
    key: "clearClustererCache",
    value: function clearClustererCache() {
      this.clusterer.cache.clear();
    }
  }]);
  return ClusterBuilder;
}();

exports["default"] = ClusterBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2NsdXN0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0R2VvSlNPTiIsImRhdGEiLCJnZXRQb3NpdGlvbiIsImZpbHRlckRhdGEiLCJyYXciLCJmaWx0ZXIiLCJtYXAiLCJkIiwidHlwZSIsInByb3BlcnRpZXMiLCJwb2ludHMiLCJwb2ludF9jb3VudCIsInBvaW50X2NvdW50X2FiYnJldmlhdGVkIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJjbHVzdGVyUmVzb2x2ZXIiLCJjbHVzdGVyUmFkaXVzIiwiZ2V0Q2x1c3RlcmVyIiwiZ2VvSlNPTiIsIlN1cGVyY2x1c3RlciIsIm1heFpvb20iLCJyYWRpdXMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRlZCIsInByb3BzIiwibG9hZCIsIkNsdXN0ZXJCdWlsZGVyIiwiY2x1c3RlcmVyIiwiYmJveCIsInpvb20iLCJjbHVzdGVycyIsImdldENsdXN0ZXJzIiwiYyIsImkiLCJwb3NpdGlvbiIsImluZGV4IiwiY2FjaGUiLCJjbGVhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLTyxTQUFTQSxVQUFULENBQW9CQyxJQUFwQixFQUEwQkMsV0FBMUIsRUFBdUNDLFVBQXZDLEVBQW1EO0FBQ3hELE1BQU1DLEdBQUcsR0FBRyxPQUFPRCxVQUFQLEtBQXNCLFVBQXRCLEdBQW1DRixJQUFJLENBQUNJLE1BQUwsQ0FBWUYsVUFBWixDQUFuQyxHQUE2REYsSUFBekU7QUFFQSxTQUFPRyxHQUFHLENBQ1BFLEdBREksQ0FDQSxVQUFBQyxDQUFDO0FBQUEsV0FBSztBQUNUQyxNQUFBQSxJQUFJLEVBQUUsT0FERztBQUVUQyxNQUFBQSxVQUFVLEVBQUU7QUFDVlIsUUFBQUEsSUFBSSxFQUFFTSxDQURJO0FBRVZHLFFBQUFBLE1BQU0sRUFBRSxDQUFDSCxDQUFELENBRkU7QUFHVkksUUFBQUEsV0FBVyxFQUFFLENBSEg7QUFJVkMsUUFBQUEsdUJBQXVCLEVBQUU7QUFKZixPQUZIO0FBUVRDLE1BQUFBLFFBQVEsRUFBRTtBQUNSQyxRQUFBQSxXQUFXLEVBQUVaLFdBQVcsQ0FBQ0ssQ0FBRDtBQURoQjtBQVJELEtBQUw7QUFBQSxHQURELEVBYUpGLE1BYkksQ0FhRyxVQUFBRSxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLFdBQVgsQ0FBdUJDLEtBQXZCLENBQTZCQyxNQUFNLENBQUNDLFFBQXBDLENBQUo7QUFBQSxHQWJKLENBQVA7QUFjRDs7QUFFRCxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCO0FBQUEsTUFBRUMsYUFBRixRQUFFQSxhQUFGO0FBQUEsbUJBQXdCQSxhQUF4QjtBQUFBLENBQXhCOztBQUVBLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBRUQsYUFBRixTQUFFQSxhQUFGO0FBQUEsTUFBaUJFLE9BQWpCLFNBQWlCQSxPQUFqQjtBQUFBLFNBQ25CLElBQUlDLHdCQUFKLENBQWlCO0FBQ2ZDLElBQUFBLE9BQU8sRUFBRSxFQURNO0FBRWZDLElBQUFBLE1BQU0sRUFBRUwsYUFGTztBQUdmTSxJQUFBQSxNQUFNLEVBQUUsZ0JBQUNDLFdBQUQsRUFBY0MsS0FBZCxFQUF3QjtBQUM5QkQsTUFBQUEsV0FBVyxDQUFDaEIsTUFBWixpREFBeUJnQixXQUFXLENBQUNoQixNQUFyQyx1Q0FBZ0RpQixLQUFLLENBQUNqQixNQUF0RDtBQUNELEtBTGM7QUFNZkosSUFBQUEsR0FBRyxFQUFFLGFBQUFxQixLQUFLO0FBQUEsYUFBSztBQUFDakIsUUFBQUEsTUFBTSxFQUFFLENBQUNpQixLQUFLLENBQUMxQixJQUFQO0FBQVQsT0FBTDtBQUFBO0FBTkssR0FBakIsRUFPRzJCLElBUEgsQ0FPUVAsT0FQUixDQURtQjtBQUFBLENBQXJCOztJQVVxQlEsYztBQUNuQiw0QkFBYztBQUFBO0FBQ1osU0FBS0MsU0FBTCxHQUFpQix3QkFBUVYsWUFBUixFQUFzQkYsZUFBdEIsQ0FBakI7QUFDRDs7OztXQUVELCtCQUFxRDtBQUFBLFVBQXJDYSxJQUFxQyxTQUFyQ0EsSUFBcUM7QUFBQSxVQUEvQlosYUFBK0IsU0FBL0JBLGFBQStCO0FBQUEsVUFBaEJFLE9BQWdCLFNBQWhCQSxPQUFnQjtBQUFBLFVBQVBXLElBQU8sU0FBUEEsSUFBTztBQUNuRCxVQUFNRixTQUFTLEdBQUcsS0FBS0EsU0FBTCxDQUFlO0FBQUNYLFFBQUFBLGFBQWEsRUFBYkEsYUFBRDtBQUFnQkUsUUFBQUEsT0FBTyxFQUFQQTtBQUFoQixPQUFmLENBQWxCLENBRG1ELENBR25EOztBQUNBLFVBQU1ZLFFBQVEsR0FBR0gsU0FBUyxDQUFDSSxXQUFWLENBQXNCSCxJQUF0QixFQUE0QkMsSUFBNUIsRUFBa0MxQixHQUFsQyxDQUFzQyxVQUFDNkIsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVztBQUNoRTFCLFVBQUFBLE1BQU0sRUFBRXlCLENBQUMsQ0FBQzFCLFVBQUYsQ0FBYUMsTUFEMkM7QUFFaEUyQixVQUFBQSxRQUFRLEVBQUVGLENBQUMsQ0FBQ3RCLFFBQUYsQ0FBV0MsV0FGMkM7QUFHaEV3QixVQUFBQSxLQUFLLEVBQUVGO0FBSHlELFNBQVg7QUFBQSxPQUF0QyxDQUFqQjtBQU1BLGFBQU9ILFFBQVA7QUFDRDs7O1dBRUQsK0JBQXNCO0FBQ3BCLFdBQUtILFNBQUwsQ0FBZVMsS0FBZixDQUFxQkMsS0FBckI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBTdXBlcmNsdXN0ZXIgZnJvbSAnc3VwZXJjbHVzdGVyJztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdlb0pTT04oZGF0YSwgZ2V0UG9zaXRpb24sIGZpbHRlckRhdGEpIHtcbiAgY29uc3QgcmF3ID0gdHlwZW9mIGZpbHRlckRhdGEgPT09ICdmdW5jdGlvbicgPyBkYXRhLmZpbHRlcihmaWx0ZXJEYXRhKSA6IGRhdGE7XG5cbiAgcmV0dXJuIHJhd1xuICAgIC5tYXAoZCA9PiAoe1xuICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZGF0YTogZCxcbiAgICAgICAgcG9pbnRzOiBbZF0sXG4gICAgICAgIHBvaW50X2NvdW50OiAxLFxuICAgICAgICBwb2ludF9jb3VudF9hYmJyZXZpYXRlZDogJzEnXG4gICAgICB9LFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgY29vcmRpbmF0ZXM6IGdldFBvc2l0aW9uKGQpXG4gICAgICB9XG4gICAgfSkpXG4gICAgLmZpbHRlcihkID0+IGQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSk7XG59XG5cbmNvbnN0IGNsdXN0ZXJSZXNvbHZlciA9ICh7Y2x1c3RlclJhZGl1c30pID0+IGAke2NsdXN0ZXJSYWRpdXN9YDtcblxuY29uc3QgZ2V0Q2x1c3RlcmVyID0gKHtjbHVzdGVyUmFkaXVzLCBnZW9KU09OfSkgPT5cbiAgbmV3IFN1cGVyY2x1c3Rlcih7XG4gICAgbWF4Wm9vbTogMjAsXG4gICAgcmFkaXVzOiBjbHVzdGVyUmFkaXVzLFxuICAgIHJlZHVjZTogKGFjY3VtdWxhdGVkLCBwcm9wcykgPT4ge1xuICAgICAgYWNjdW11bGF0ZWQucG9pbnRzID0gWy4uLmFjY3VtdWxhdGVkLnBvaW50cywgLi4ucHJvcHMucG9pbnRzXTtcbiAgICB9LFxuICAgIG1hcDogcHJvcHMgPT4gKHtwb2ludHM6IFtwcm9wcy5kYXRhXX0pXG4gIH0pLmxvYWQoZ2VvSlNPTik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jbHVzdGVyZXIgPSBtZW1vaXplKGdldENsdXN0ZXJlciwgY2x1c3RlclJlc29sdmVyKTtcbiAgfVxuXG4gIGNsdXN0ZXJzQXRab29tKHtiYm94LCBjbHVzdGVyUmFkaXVzLCBnZW9KU09OLCB6b29tfSkge1xuICAgIGNvbnN0IGNsdXN0ZXJlciA9IHRoaXMuY2x1c3RlcmVyKHtjbHVzdGVyUmFkaXVzLCBnZW9KU09OfSk7XG5cbiAgICAvLyBtYXAgY2x1c3RlcnMgdG8gZm9ybWF0dGVkIGJpbnMgdG8gYmUgcGFzc2VkIHRvIGRlY2suZ2wgYmluLXNvcnRlclxuICAgIGNvbnN0IGNsdXN0ZXJzID0gY2x1c3RlcmVyLmdldENsdXN0ZXJzKGJib3gsIHpvb20pLm1hcCgoYywgaSkgPT4gKHtcbiAgICAgIHBvaW50czogYy5wcm9wZXJ0aWVzLnBvaW50cyxcbiAgICAgIHBvc2l0aW9uOiBjLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgaW5kZXg6IGlcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gY2x1c3RlcnM7XG4gIH1cblxuICBjbGVhckNsdXN0ZXJlckNhY2hlKCkge1xuICAgIHRoaXMuY2x1c3RlcmVyLmNhY2hlLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==