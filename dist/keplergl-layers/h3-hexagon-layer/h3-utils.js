'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.getVertices = getVertices;
exports.getCentroid = getCentroid;
exports.idToPolygonGeo = idToPolygonGeo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('@uber/h3-transitional'),
    h3ToGeo = _require.h3ToGeo,
    h3ToGeoBoundary = _require.h3ToGeoBoundary;
// process.env.BROWSER || process.env.NODE_ENV === 'test'
//   ? require('@uber/h3-transitional')
//   : {h3ToGeo: null, h3ToGeoBoundary: null, V2: null};

// get vertices should return [lon, lat]


function getVertices(_ref) {
  var id = _ref.id;

  // always reverse it
  return h3ToGeoBoundary(id).map(function (d) {
    return d.reverse();
  });
}

// get centroid should return [lon, lat]
function getCentroid(_ref2) {
  var id = _ref2.id;

  // always reverse it to [lng, lat]
  return h3ToGeo(id).reverse();
}

function idToPolygonGeo(_ref3, properties) {
  var object = _ref3.object;

  if (!object || !object.id) {
    return null;
  }

  var vertices = getVertices(object);

  return {
    geometry: {
      coordinates: [].concat((0, _toConsumableArray3.default)(vertices), [vertices[0]]),
      type: 'LineString'
    },
    properties: properties
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXRWZXJ0aWNlcyIsImdldENlbnRyb2lkIiwiaWRUb1BvbHlnb25HZW8iLCJyZXF1aXJlIiwiaDNUb0dlbyIsImgzVG9HZW9Cb3VuZGFyeSIsImlkIiwibWFwIiwiZCIsInJldmVyc2UiLCJwcm9wZXJ0aWVzIiwib2JqZWN0IiwidmVydGljZXMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQU1nQkEsVyxHQUFBQSxXO1FBTUFDLFcsR0FBQUEsVztRQUtBQyxjLEdBQUFBLGM7Ozs7ZUFqQm1CQyxRQUFRLHVCQUFSLEM7SUFBNUJDLE8sWUFBQUEsTztJQUFTQyxlLFlBQUFBLGU7QUFDaEI7QUFDQTtBQUNBOztBQUVBOzs7QUFDTyxTQUFTTCxXQUFULE9BQTJCO0FBQUEsTUFBTE0sRUFBSyxRQUFMQSxFQUFLOztBQUNoQztBQUNBLFNBQU9ELGdCQUFnQkMsRUFBaEIsRUFBb0JDLEdBQXBCLENBQXdCO0FBQUEsV0FBS0MsRUFBRUMsT0FBRixFQUFMO0FBQUEsR0FBeEIsQ0FBUDtBQUNEOztBQUVEO0FBQ08sU0FBU1IsV0FBVCxRQUEyQjtBQUFBLE1BQUxLLEVBQUssU0FBTEEsRUFBSzs7QUFDaEM7QUFDQSxTQUFPRixRQUFRRSxFQUFSLEVBQVlHLE9BQVosRUFBUDtBQUNEOztBQUVNLFNBQVNQLGNBQVQsUUFBa0NRLFVBQWxDLEVBQThDO0FBQUEsTUFBckJDLE1BQXFCLFNBQXJCQSxNQUFxQjs7QUFDbkQsTUFBSSxDQUFDQSxNQUFELElBQVcsQ0FBQ0EsT0FBT0wsRUFBdkIsRUFBMkI7QUFDekIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBTU0sV0FBV1osWUFBWVcsTUFBWixDQUFqQjs7QUFFQSxTQUFPO0FBQ0xFLGNBQVU7QUFDUkMsOERBQWlCRixRQUFqQixJQUEyQkEsU0FBUyxDQUFULENBQTNCLEVBRFE7QUFFUkcsWUFBTTtBQUZFLEtBREw7QUFLTEw7QUFMSyxHQUFQO0FBT0QiLCJmaWxlIjoiaDMtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7aDNUb0dlbywgaDNUb0dlb0JvdW5kYXJ5fSA9IHJlcXVpcmUoJ0B1YmVyL2gzLXRyYW5zaXRpb25hbCcpO1xuLy8gcHJvY2Vzcy5lbnYuQlJPV1NFUiB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnXG4vLyAgID8gcmVxdWlyZSgnQHViZXIvaDMtdHJhbnNpdGlvbmFsJylcbi8vICAgOiB7aDNUb0dlbzogbnVsbCwgaDNUb0dlb0JvdW5kYXJ5OiBudWxsLCBWMjogbnVsbH07XG5cbi8vIGdldCB2ZXJ0aWNlcyBzaG91bGQgcmV0dXJuIFtsb24sIGxhdF1cbmV4cG9ydCBmdW5jdGlvbiBnZXRWZXJ0aWNlcyh7aWR9KSB7XG4gIC8vIGFsd2F5cyByZXZlcnNlIGl0XG4gIHJldHVybiBoM1RvR2VvQm91bmRhcnkoaWQpLm1hcChkID0+IGQucmV2ZXJzZSgpKTtcbn1cblxuLy8gZ2V0IGNlbnRyb2lkIHNob3VsZCByZXR1cm4gW2xvbiwgbGF0XVxuZXhwb3J0IGZ1bmN0aW9uIGdldENlbnRyb2lkKHtpZH0pIHtcbiAgLy8gYWx3YXlzIHJldmVyc2UgaXQgdG8gW2xuZywgbGF0XVxuICByZXR1cm4gaDNUb0dlbyhpZCkucmV2ZXJzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb1BvbHlnb25HZW8oe29iamVjdH0sIHByb3BlcnRpZXMpIHtcbiAgaWYgKCFvYmplY3QgfHwgIW9iamVjdC5pZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdmVydGljZXMgPSBnZXRWZXJ0aWNlcyhvYmplY3QpO1xuXG4gIHJldHVybiB7XG4gICAgZ2VvbWV0cnk6IHtcbiAgICAgIGNvb3JkaW5hdGVzOiBbLi4udmVydGljZXMsIHZlcnRpY2VzWzBdXSxcbiAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJ1xuICAgIH0sXG4gICAgcHJvcGVydGllc1xuICB9O1xufVxuIl19