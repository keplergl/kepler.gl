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

var ClusterBuilder =
/*#__PURE__*/
function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2NsdXN0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0R2VvSlNPTiIsImRhdGEiLCJnZXRQb3NpdGlvbiIsImZpbHRlckRhdGEiLCJyYXciLCJmaWx0ZXIiLCJtYXAiLCJkIiwidHlwZSIsInByb3BlcnRpZXMiLCJwb2ludHMiLCJwb2ludF9jb3VudCIsInBvaW50X2NvdW50X2FiYnJldmlhdGVkIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJjbHVzdGVyUmVzb2x2ZXIiLCJjbHVzdGVyUmFkaXVzIiwiZ2V0Q2x1c3RlcmVyIiwiZ2VvSlNPTiIsIlN1cGVyY2x1c3RlciIsIm1heFpvb20iLCJyYWRpdXMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRlZCIsInByb3BzIiwibG9hZCIsIkNsdXN0ZXJCdWlsZGVyIiwiY2x1c3RlcmVyIiwiYmJveCIsInpvb20iLCJjbHVzdGVycyIsImdldENsdXN0ZXJzIiwiYyIsImkiLCJwb3NpdGlvbiIsImluZGV4IiwiY2FjaGUiLCJjbGVhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLTyxTQUFTQSxVQUFULENBQW9CQyxJQUFwQixFQUEwQkMsV0FBMUIsRUFBdUNDLFVBQXZDLEVBQW1EO0FBQ3hELE1BQU1DLEdBQUcsR0FBRyxPQUFPRCxVQUFQLEtBQXNCLFVBQXRCLEdBQW1DRixJQUFJLENBQUNJLE1BQUwsQ0FBWUYsVUFBWixDQUFuQyxHQUE2REYsSUFBekU7QUFFQSxTQUFPRyxHQUFHLENBQ1BFLEdBREksQ0FDQSxVQUFBQyxDQUFDO0FBQUEsV0FBSztBQUNUQyxNQUFBQSxJQUFJLEVBQUUsT0FERztBQUVUQyxNQUFBQSxVQUFVLEVBQUU7QUFDVlIsUUFBQUEsSUFBSSxFQUFFTSxDQURJO0FBRVZHLFFBQUFBLE1BQU0sRUFBRSxDQUFDSCxDQUFELENBRkU7QUFHVkksUUFBQUEsV0FBVyxFQUFFLENBSEg7QUFJVkMsUUFBQUEsdUJBQXVCLEVBQUU7QUFKZixPQUZIO0FBUVRDLE1BQUFBLFFBQVEsRUFBRTtBQUNSQyxRQUFBQSxXQUFXLEVBQUVaLFdBQVcsQ0FBQ0ssQ0FBRDtBQURoQjtBQVJELEtBQUw7QUFBQSxHQURELEVBYUpGLE1BYkksQ0FhRyxVQUFBRSxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLFdBQVgsQ0FBdUJDLEtBQXZCLENBQTZCQyxNQUFNLENBQUNDLFFBQXBDLENBQUo7QUFBQSxHQWJKLENBQVA7QUFjRDs7QUFFRCxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCO0FBQUEsTUFBRUMsYUFBRixRQUFFQSxhQUFGO0FBQUEsbUJBQXdCQSxhQUF4QjtBQUFBLENBQXhCOztBQUVBLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBRUQsYUFBRixTQUFFQSxhQUFGO0FBQUEsTUFBaUJFLE9BQWpCLFNBQWlCQSxPQUFqQjtBQUFBLFNBQ25CLElBQUlDLHdCQUFKLENBQWlCO0FBQ2ZDLElBQUFBLE9BQU8sRUFBRSxFQURNO0FBRWZDLElBQUFBLE1BQU0sRUFBRUwsYUFGTztBQUdmTSxJQUFBQSxNQUFNLEVBQUUsZ0JBQUNDLFdBQUQsRUFBY0MsS0FBZCxFQUF3QjtBQUM5QkQsTUFBQUEsV0FBVyxDQUFDaEIsTUFBWixpREFBeUJnQixXQUFXLENBQUNoQixNQUFyQyx1Q0FBZ0RpQixLQUFLLENBQUNqQixNQUF0RDtBQUNELEtBTGM7QUFNZkosSUFBQUEsR0FBRyxFQUFFLGFBQUFxQixLQUFLO0FBQUEsYUFBSztBQUFDakIsUUFBQUEsTUFBTSxFQUFFLENBQUNpQixLQUFLLENBQUMxQixJQUFQO0FBQVQsT0FBTDtBQUFBO0FBTkssR0FBakIsRUFPRzJCLElBUEgsQ0FPUVAsT0FQUixDQURtQjtBQUFBLENBQXJCOztJQVVxQlEsYzs7O0FBQ25CLDRCQUFjO0FBQUE7QUFDWixTQUFLQyxTQUFMLEdBQWlCLHdCQUFRVixZQUFSLEVBQXNCRixlQUF0QixDQUFqQjtBQUNEOzs7OzBDQUVvRDtBQUFBLFVBQXJDYSxJQUFxQyxTQUFyQ0EsSUFBcUM7QUFBQSxVQUEvQlosYUFBK0IsU0FBL0JBLGFBQStCO0FBQUEsVUFBaEJFLE9BQWdCLFNBQWhCQSxPQUFnQjtBQUFBLFVBQVBXLElBQU8sU0FBUEEsSUFBTztBQUNuRCxVQUFNRixTQUFTLEdBQUcsS0FBS0EsU0FBTCxDQUFlO0FBQUNYLFFBQUFBLGFBQWEsRUFBYkEsYUFBRDtBQUFnQkUsUUFBQUEsT0FBTyxFQUFQQTtBQUFoQixPQUFmLENBQWxCLENBRG1ELENBR25EOztBQUNBLFVBQU1ZLFFBQVEsR0FBR0gsU0FBUyxDQUFDSSxXQUFWLENBQXNCSCxJQUF0QixFQUE0QkMsSUFBNUIsRUFBa0MxQixHQUFsQyxDQUFzQyxVQUFDNkIsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVztBQUNoRTFCLFVBQUFBLE1BQU0sRUFBRXlCLENBQUMsQ0FBQzFCLFVBQUYsQ0FBYUMsTUFEMkM7QUFFaEUyQixVQUFBQSxRQUFRLEVBQUVGLENBQUMsQ0FBQ3RCLFFBQUYsQ0FBV0MsV0FGMkM7QUFHaEV3QixVQUFBQSxLQUFLLEVBQUVGO0FBSHlELFNBQVg7QUFBQSxPQUF0QyxDQUFqQjtBQU1BLGFBQU9ILFFBQVA7QUFDRDs7OzBDQUVxQjtBQUNwQixXQUFLSCxTQUFMLENBQWVTLEtBQWYsQ0FBcUJDLEtBQXJCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgU3VwZXJjbHVzdGVyIGZyb20gJ3N1cGVyY2x1c3Rlcic7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW9KU09OKGRhdGEsIGdldFBvc2l0aW9uLCBmaWx0ZXJEYXRhKSB7XG4gIGNvbnN0IHJhdyA9IHR5cGVvZiBmaWx0ZXJEYXRhID09PSAnZnVuY3Rpb24nID8gZGF0YS5maWx0ZXIoZmlsdGVyRGF0YSkgOiBkYXRhO1xuXG4gIHJldHVybiByYXdcbiAgICAubWFwKGQgPT4gKHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGRhdGE6IGQsXG4gICAgICAgIHBvaW50czogW2RdLFxuICAgICAgICBwb2ludF9jb3VudDogMSxcbiAgICAgICAgcG9pbnRfY291bnRfYWJicmV2aWF0ZWQ6ICcxJ1xuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIGNvb3JkaW5hdGVzOiBnZXRQb3NpdGlvbihkKVxuICAgICAgfVxuICAgIH0pKVxuICAgIC5maWx0ZXIoZCA9PiBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpO1xufVxuXG5jb25zdCBjbHVzdGVyUmVzb2x2ZXIgPSAoe2NsdXN0ZXJSYWRpdXN9KSA9PiBgJHtjbHVzdGVyUmFkaXVzfWA7XG5cbmNvbnN0IGdldENsdXN0ZXJlciA9ICh7Y2x1c3RlclJhZGl1cywgZ2VvSlNPTn0pID0+XG4gIG5ldyBTdXBlcmNsdXN0ZXIoe1xuICAgIG1heFpvb206IDIwLFxuICAgIHJhZGl1czogY2x1c3RlclJhZGl1cyxcbiAgICByZWR1Y2U6IChhY2N1bXVsYXRlZCwgcHJvcHMpID0+IHtcbiAgICAgIGFjY3VtdWxhdGVkLnBvaW50cyA9IFsuLi5hY2N1bXVsYXRlZC5wb2ludHMsIC4uLnByb3BzLnBvaW50c107XG4gICAgfSxcbiAgICBtYXA6IHByb3BzID0+ICh7cG9pbnRzOiBbcHJvcHMuZGF0YV19KVxuICB9KS5sb2FkKGdlb0pTT04pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbHVzdGVyQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2x1c3RlcmVyID0gbWVtb2l6ZShnZXRDbHVzdGVyZXIsIGNsdXN0ZXJSZXNvbHZlcik7XG4gIH1cblxuICBjbHVzdGVyc0F0Wm9vbSh7YmJveCwgY2x1c3RlclJhZGl1cywgZ2VvSlNPTiwgem9vbX0pIHtcbiAgICBjb25zdCBjbHVzdGVyZXIgPSB0aGlzLmNsdXN0ZXJlcih7Y2x1c3RlclJhZGl1cywgZ2VvSlNPTn0pO1xuXG4gICAgLy8gbWFwIGNsdXN0ZXJzIHRvIGZvcm1hdHRlZCBiaW5zIHRvIGJlIHBhc3NlZCB0byBkZWNrLmdsIGJpbi1zb3J0ZXJcbiAgICBjb25zdCBjbHVzdGVycyA9IGNsdXN0ZXJlci5nZXRDbHVzdGVycyhiYm94LCB6b29tKS5tYXAoKGMsIGkpID0+ICh7XG4gICAgICBwb2ludHM6IGMucHJvcGVydGllcy5wb2ludHMsXG4gICAgICBwb3NpdGlvbjogYy5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGluZGV4OiBpXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIGNsdXN0ZXJzO1xuICB9XG5cbiAgY2xlYXJDbHVzdGVyZXJDYWNoZSgpIHtcbiAgICB0aGlzLmNsdXN0ZXJlci5jYWNoZS5jbGVhcigpO1xuICB9XG59XG4iXX0=