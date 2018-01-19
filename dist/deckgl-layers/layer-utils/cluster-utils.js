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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2NsdXN0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0R2VvSlNPTiIsImNsdXN0ZXJzQXRab29tIiwiY2xlYXJDbHVzdGVyZXJDYWNoZSIsImRhdGEiLCJnZXRQb3NpdGlvbiIsIm1hcCIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiZCIsInBvaW50cyIsInBvaW50X2NvdW50IiwicG9pbnRfY291bnRfYWJicmV2aWF0ZWQiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZmlsdGVyIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImNsdXN0ZXJSZXNvbHZlciIsImNsdXN0ZXJSYWRpdXMiLCJnZXRDbHVzdGVyZXIiLCJnZW9KU09OIiwibWF4Wm9vbSIsInJhZGl1cyIsImluaXRpYWwiLCJwcm9wcyIsInJlZHVjZSIsImFjY3VtdWxhdGVkIiwiZm9yRWFjaCIsInB1c2giLCJwIiwibG9hZCIsImJib3giLCJ6b29tIiwiY2x1c3RlcmVyIiwiZ2V0Q2x1c3RlcnMiLCJjYWNoZSIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7OztRQUdnQkEsVSxHQUFBQSxVO1FBc0NBQyxjLEdBQUFBLGM7UUFNQUMsbUIsR0FBQUEsbUI7O0FBL0NoQjs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTRixVQUFULENBQW9CRyxJQUFwQixFQUEwQkMsV0FBMUIsRUFBdUM7QUFDNUMsU0FBT0QsS0FDSkUsR0FESSxDQUNBO0FBQUEsV0FBTTtBQUNUQyxZQUFNLE9BREc7QUFFVEMsa0JBQVk7QUFDVkosY0FBTUssQ0FESTtBQUVWQyxnQkFBUSxDQUFDRCxDQUFELENBRkU7QUFHVkUscUJBQWEsQ0FISDtBQUlWQyxpQ0FBeUI7QUFKZixPQUZIO0FBUVRDLGdCQUFVO0FBQ1JDLHFCQUFhVCxZQUFZSSxDQUFaO0FBREw7QUFSRCxLQUFOO0FBQUEsR0FEQSxFQWFKTSxNQWJJLENBYUc7QUFBQSxXQUFLTixFQUFFSSxRQUFGLENBQVdDLFdBQVgsQ0FBdUJFLEtBQXZCLENBQTZCQyxPQUFPQyxRQUFwQyxDQUFMO0FBQUEsR0FiSCxDQUFQO0FBY0Q7O0FBRUQsSUFBTUMsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVDLGFBQUYsUUFBRUEsYUFBRjtBQUFBLGNBQXdCQSxhQUF4QjtBQUFBLENBQXhCOztBQUVBLElBQU1DLGVBQWUsdUJBQVEsaUJBQThCO0FBQUEsTUFBNUJELGFBQTRCLFNBQTVCQSxhQUE0QjtBQUFBLE1BQWJFLE9BQWEsU0FBYkEsT0FBYTs7QUFDekQsU0FBTyw0QkFBYTtBQUNsQkMsYUFBUyxFQURTO0FBRWxCQyxZQUFRSixhQUZVO0FBR2xCSyxhQUFTO0FBQUEsYUFBTyxFQUFDZixRQUFRLEVBQVQsRUFBUDtBQUFBLEtBSFM7QUFJbEJKLFNBQUs7QUFBQSxhQUFTb0IsTUFBTXRCLElBQWY7QUFBQSxLQUphO0FBS2xCdUIsWUFBUSxnQkFBQ0MsV0FBRCxFQUFjRixLQUFkLEVBQXdCO0FBQzlCLFVBQUlBLE1BQU1oQixNQUFWLEVBQWtCO0FBQ2hCO0FBQ0FnQixjQUFNaEIsTUFBTixDQUFhbUIsT0FBYixDQUFxQixhQUFLO0FBQ3hCRCxzQkFBWWxCLE1BQVosQ0FBbUJvQixJQUFuQixDQUF3QkMsQ0FBeEI7QUFDRCxTQUZEO0FBR0QsT0FMRCxNQUtPO0FBQ0xILG9CQUFZbEIsTUFBWixDQUFtQm9CLElBQW5CLENBQXdCSixLQUF4QjtBQUNEO0FBQ0Y7QUFkaUIsR0FBYixFQWVKTSxJQWZJLENBZUNWLE9BZkQsQ0FBUDtBQWdCRCxDQWpCb0IsRUFpQmxCSCxlQWpCa0IsQ0FBckI7O0FBbUJPLFNBQVNqQixjQUFULFFBQThEO0FBQUEsTUFBckMrQixJQUFxQyxTQUFyQ0EsSUFBcUM7QUFBQSxNQUEvQmIsYUFBK0IsU0FBL0JBLGFBQStCO0FBQUEsTUFBaEJFLE9BQWdCLFNBQWhCQSxPQUFnQjtBQUFBLE1BQVBZLElBQU8sU0FBUEEsSUFBTzs7QUFDbkUsTUFBTUMsWUFBWWQsYUFBYSxFQUFDRCw0QkFBRCxFQUFnQkUsZ0JBQWhCLEVBQWIsQ0FBbEI7O0FBRUEsU0FBT2EsVUFBVUMsV0FBVixDQUFzQkgsSUFBdEIsRUFBNEJDLElBQTVCLENBQVA7QUFDRDs7QUFFTSxTQUFTL0IsbUJBQVQsR0FBK0I7QUFDcENrQixlQUFhZ0IsS0FBYixDQUFtQkMsS0FBbkI7QUFDRCIsImZpbGUiOiJjbHVzdGVyLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN1cGVyY2x1c3RlciBmcm9tICdzdXBlcmNsdXN0ZXInO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoL21lbW9pemUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvSlNPTihkYXRhLCBnZXRQb3NpdGlvbikge1xuICByZXR1cm4gZGF0YVxuICAgIC5tYXAoZCA9PiAoe1xuICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZGF0YTogZCxcbiAgICAgICAgcG9pbnRzOiBbZF0sXG4gICAgICAgIHBvaW50X2NvdW50OiAxLFxuICAgICAgICBwb2ludF9jb3VudF9hYmJyZXZpYXRlZDogJzEnXG4gICAgICB9LFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgY29vcmRpbmF0ZXM6IGdldFBvc2l0aW9uKGQpXG4gICAgICB9XG4gICAgfSkpXG4gICAgLmZpbHRlcihkID0+IGQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSk7XG59XG5cbmNvbnN0IGNsdXN0ZXJSZXNvbHZlciA9ICh7Y2x1c3RlclJhZGl1c30pID0+IGAke2NsdXN0ZXJSYWRpdXN9YDtcblxuY29uc3QgZ2V0Q2x1c3RlcmVyID0gbWVtb2l6ZSgoe2NsdXN0ZXJSYWRpdXMsIGdlb0pTT059KSA9PiB7XG4gIHJldHVybiBzdXBlcmNsdXN0ZXIoe1xuICAgIG1heFpvb206IDIwLFxuICAgIHJhZGl1czogY2x1c3RlclJhZGl1cyxcbiAgICBpbml0aWFsOiAoKSA9PiAoe3BvaW50czogW119KSxcbiAgICBtYXA6IHByb3BzID0+IHByb3BzLmRhdGEsXG4gICAgcmVkdWNlOiAoYWNjdW11bGF0ZWQsIHByb3BzKSA9PiB7XG4gICAgICBpZiAocHJvcHMucG9pbnRzKSB7XG4gICAgICAgIC8vIGF2b2lkIHVzaW5nIHNwcmVhZCB0byBwcmV2ZW50IG1heCBjYWxsIHN0YWNrIGV4Y2VlZGVkIGVycm9yXG4gICAgICAgIHByb3BzLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgIGFjY3VtdWxhdGVkLnBvaW50cy5wdXNoKHApO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjY3VtdWxhdGVkLnBvaW50cy5wdXNoKHByb3BzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pLmxvYWQoZ2VvSlNPTik7XG59LCBjbHVzdGVyUmVzb2x2ZXIpO1xuXG5leHBvcnQgZnVuY3Rpb24gY2x1c3RlcnNBdFpvb20oe2Jib3gsIGNsdXN0ZXJSYWRpdXMsIGdlb0pTT04sIHpvb219KSB7XG4gIGNvbnN0IGNsdXN0ZXJlciA9IGdldENsdXN0ZXJlcih7Y2x1c3RlclJhZGl1cywgZ2VvSlNPTn0pO1xuXG4gIHJldHVybiBjbHVzdGVyZXIuZ2V0Q2x1c3RlcnMoYmJveCwgem9vbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNsdXN0ZXJlckNhY2hlKCkge1xuICBnZXRDbHVzdGVyZXIuY2FjaGUuY2xlYXIoKTtcbn1cbiJdfQ==