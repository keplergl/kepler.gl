'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoJSON = getGeoJSON;
exports.clustersAtZoom = clustersAtZoom;
exports.clearClustererCache = clearClustererCache;

var _supercluster = require('supercluster');

var _supercluster2 = _interopRequireDefault(_supercluster);

var _memoize = require('lodash/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGeoJSON(data, getPosition) {
  return data.map(function (d) {
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
  return '' + clusterRadius;
};

var getClusterer = (0, _memoize2.default)(function (_ref2) {
  var clusterRadius = _ref2.clusterRadius,
      geoJSON = _ref2.geoJSON;

  return (0, _supercluster2.default)({
    maxZoom: 20,
    radius: clusterRadius,
    initial: function initial() {
      return { points: [] };
    },
    map: function map(props) {
      return props.data;
    },
    reduce: function reduce(accumulated, props) {
      if (props.points) {
        // avoid using spread to prevent max call stack exceeded error
        props.points.forEach(function (p) {
          accumulated.points.push(p);
        });
      } else {
        accumulated.points.push(props);
      }
    }
  }).load(geoJSON);
}, clusterResolver);

function clustersAtZoom(_ref3) {
  var bbox = _ref3.bbox,
      clusterRadius = _ref3.clusterRadius,
      geoJSON = _ref3.geoJSON,
      zoom = _ref3.zoom;

  var clusterer = getClusterer({ clusterRadius: clusterRadius, geoJSON: geoJSON });

  return clusterer.getClusters(bbox, zoom);
}

function clearClustererCache() {
  getClusterer.cache.clear();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2NsdXN0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0R2VvSlNPTiIsImNsdXN0ZXJzQXRab29tIiwiY2xlYXJDbHVzdGVyZXJDYWNoZSIsImRhdGEiLCJnZXRQb3NpdGlvbiIsIm1hcCIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiZCIsInBvaW50cyIsInBvaW50X2NvdW50IiwicG9pbnRfY291bnRfYWJicmV2aWF0ZWQiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZmlsdGVyIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImNsdXN0ZXJSZXNvbHZlciIsImNsdXN0ZXJSYWRpdXMiLCJnZXRDbHVzdGVyZXIiLCJnZW9KU09OIiwibWF4Wm9vbSIsInJhZGl1cyIsImluaXRpYWwiLCJwcm9wcyIsInJlZHVjZSIsImFjY3VtdWxhdGVkIiwiZm9yRWFjaCIsInB1c2giLCJwIiwibG9hZCIsImJib3giLCJ6b29tIiwiY2x1c3RlcmVyIiwiZ2V0Q2x1c3RlcnMiLCJjYWNoZSIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7OztRQUdnQkEsVSxHQUFBQSxVO1FBb0NBQyxjLEdBQUFBLGM7UUFNQUMsbUIsR0FBQUEsbUI7O0FBN0NoQjs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTRixVQUFULENBQW9CRyxJQUFwQixFQUEwQkMsV0FBMUIsRUFBdUM7QUFDNUMsU0FBT0QsS0FBS0UsR0FBTCxDQUFTO0FBQUEsV0FBTTtBQUNwQkMsWUFBTSxPQURjO0FBRXBCQyxrQkFBWTtBQUNWSixjQUFNSyxDQURJO0FBRVZDLGdCQUFRLENBQUNELENBQUQsQ0FGRTtBQUdWRSxxQkFBYSxDQUhIO0FBSVZDLGlDQUF5QjtBQUpmLE9BRlE7QUFRcEJDLGdCQUFVO0FBQ1JDLHFCQUFhVCxZQUFZSSxDQUFaO0FBREw7QUFSVSxLQUFOO0FBQUEsR0FBVCxFQVdITSxNQVhHLENBV0k7QUFBQSxXQUFLTixFQUFFSSxRQUFGLENBQVdDLFdBQVgsQ0FBdUJFLEtBQXZCLENBQTZCQyxPQUFPQyxRQUFwQyxDQUFMO0FBQUEsR0FYSixDQUFQO0FBWUQ7O0FBRUQsSUFBTUMsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVDLGFBQUYsUUFBRUEsYUFBRjtBQUFBLGNBQXdCQSxhQUF4QjtBQUFBLENBQXhCOztBQUVBLElBQU1DLGVBQWUsdUJBQVEsaUJBQThCO0FBQUEsTUFBNUJELGFBQTRCLFNBQTVCQSxhQUE0QjtBQUFBLE1BQWJFLE9BQWEsU0FBYkEsT0FBYTs7QUFDekQsU0FBTyw0QkFBYTtBQUNsQkMsYUFBUyxFQURTO0FBRWxCQyxZQUFRSixhQUZVO0FBR2xCSyxhQUFTO0FBQUEsYUFBTyxFQUFDZixRQUFRLEVBQVQsRUFBUDtBQUFBLEtBSFM7QUFJbEJKLFNBQUs7QUFBQSxhQUFTb0IsTUFBTXRCLElBQWY7QUFBQSxLQUphO0FBS2xCdUIsWUFBUSxnQkFBQ0MsV0FBRCxFQUFjRixLQUFkLEVBQXdCO0FBQzlCLFVBQUlBLE1BQU1oQixNQUFWLEVBQWtCO0FBQ2hCO0FBQ0FnQixjQUFNaEIsTUFBTixDQUFhbUIsT0FBYixDQUFxQixhQUFLO0FBQ3hCRCxzQkFBWWxCLE1BQVosQ0FBbUJvQixJQUFuQixDQUF3QkMsQ0FBeEI7QUFDRCxTQUZEO0FBR0QsT0FMRCxNQUtPO0FBQ0xILG9CQUFZbEIsTUFBWixDQUFtQm9CLElBQW5CLENBQXdCSixLQUF4QjtBQUNEO0FBQ0Y7QUFkaUIsR0FBYixFQWVKTSxJQWZJLENBZUNWLE9BZkQsQ0FBUDtBQWdCRCxDQWpCb0IsRUFpQmxCSCxlQWpCa0IsQ0FBckI7O0FBbUJPLFNBQVNqQixjQUFULFFBQThEO0FBQUEsTUFBckMrQixJQUFxQyxTQUFyQ0EsSUFBcUM7QUFBQSxNQUEvQmIsYUFBK0IsU0FBL0JBLGFBQStCO0FBQUEsTUFBaEJFLE9BQWdCLFNBQWhCQSxPQUFnQjtBQUFBLE1BQVBZLElBQU8sU0FBUEEsSUFBTzs7QUFDbkUsTUFBTUMsWUFBWWQsYUFBYSxFQUFDRCw0QkFBRCxFQUFnQkUsZ0JBQWhCLEVBQWIsQ0FBbEI7O0FBRUEsU0FBT2EsVUFBVUMsV0FBVixDQUFzQkgsSUFBdEIsRUFBNEJDLElBQTVCLENBQVA7QUFDRDs7QUFFTSxTQUFTL0IsbUJBQVQsR0FBK0I7QUFDcENrQixlQUFhZ0IsS0FBYixDQUFtQkMsS0FBbkI7QUFDRCIsImZpbGUiOiJjbHVzdGVyLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN1cGVyY2x1c3RlciBmcm9tICdzdXBlcmNsdXN0ZXInO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoL21lbW9pemUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvSlNPTihkYXRhLCBnZXRQb3NpdGlvbikge1xuICByZXR1cm4gZGF0YS5tYXAoZCA9PiAoe1xuICAgIHR5cGU6ICdQb2ludCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZGF0YTogZCxcbiAgICAgIHBvaW50czogW2RdLFxuICAgICAgcG9pbnRfY291bnQ6IDEsXG4gICAgICBwb2ludF9jb3VudF9hYmJyZXZpYXRlZDogJzEnXG4gICAgfSxcbiAgICBnZW9tZXRyeToge1xuICAgICAgY29vcmRpbmF0ZXM6IGdldFBvc2l0aW9uKGQpXG4gICAgfVxuICB9KSkuZmlsdGVyKGQgPT4gZC5nZW9tZXRyeS5jb29yZGluYXRlcy5ldmVyeShOdW1iZXIuaXNGaW5pdGUpKTtcbn1cblxuY29uc3QgY2x1c3RlclJlc29sdmVyID0gKHtjbHVzdGVyUmFkaXVzfSkgPT4gYCR7Y2x1c3RlclJhZGl1c31gO1xuXG5jb25zdCBnZXRDbHVzdGVyZXIgPSBtZW1vaXplKCh7Y2x1c3RlclJhZGl1cywgZ2VvSlNPTn0pID0+IHtcbiAgcmV0dXJuIHN1cGVyY2x1c3Rlcih7XG4gICAgbWF4Wm9vbTogMjAsXG4gICAgcmFkaXVzOiBjbHVzdGVyUmFkaXVzLFxuICAgIGluaXRpYWw6ICgpID0+ICh7cG9pbnRzOiBbXX0pLFxuICAgIG1hcDogcHJvcHMgPT4gcHJvcHMuZGF0YSxcbiAgICByZWR1Y2U6IChhY2N1bXVsYXRlZCwgcHJvcHMpID0+IHtcbiAgICAgIGlmIChwcm9wcy5wb2ludHMpIHtcbiAgICAgICAgLy8gYXZvaWQgdXNpbmcgc3ByZWFkIHRvIHByZXZlbnQgbWF4IGNhbGwgc3RhY2sgZXhjZWVkZWQgZXJyb3JcbiAgICAgICAgcHJvcHMucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgYWNjdW11bGF0ZWQucG9pbnRzLnB1c2gocCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY2N1bXVsYXRlZC5wb2ludHMucHVzaChwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9KS5sb2FkKGdlb0pTT04pO1xufSwgY2x1c3RlclJlc29sdmVyKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsdXN0ZXJzQXRab29tKHtiYm94LCBjbHVzdGVyUmFkaXVzLCBnZW9KU09OLCB6b29tfSkge1xuICBjb25zdCBjbHVzdGVyZXIgPSBnZXRDbHVzdGVyZXIoe2NsdXN0ZXJSYWRpdXMsIGdlb0pTT059KTtcblxuICByZXR1cm4gY2x1c3RlcmVyLmdldENsdXN0ZXJzKGJib3gsIHpvb20pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDbHVzdGVyZXJDYWNoZSgpIHtcbiAgZ2V0Q2x1c3RlcmVyLmNhY2hlLmNsZWFyKCk7XG59XG4iXX0=