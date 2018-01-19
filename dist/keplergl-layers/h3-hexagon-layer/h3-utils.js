'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVertices = getVertices;
exports.getCentroid = getCentroid;
exports.idToPolygonGeo = idToPolygonGeo;

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
      coordinates: [].concat(vertices, [vertices[0]]),
      type: 'LineString'
    },
    properties: properties
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXRWZXJ0aWNlcyIsImdldENlbnRyb2lkIiwiaWRUb1BvbHlnb25HZW8iLCJyZXF1aXJlIiwiaDNUb0dlbyIsImgzVG9HZW9Cb3VuZGFyeSIsImlkIiwibWFwIiwiZCIsInJldmVyc2UiLCJwcm9wZXJ0aWVzIiwib2JqZWN0IiwidmVydGljZXMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFNZ0JBLFcsR0FBQUEsVztRQU1BQyxXLEdBQUFBLFc7UUFLQUMsYyxHQUFBQSxjOztlQWpCbUJDLFFBQVEsdUJBQVIsQztJQUE1QkMsTyxZQUFBQSxPO0lBQVNDLGUsWUFBQUEsZTtBQUNkO0FBQ0E7QUFDQTs7QUFFRjs7O0FBQ08sU0FBU0wsV0FBVCxPQUEyQjtBQUFBLE1BQUxNLEVBQUssUUFBTEEsRUFBSzs7QUFDaEM7QUFDQSxTQUFPRCxnQkFBZ0JDLEVBQWhCLEVBQW9CQyxHQUFwQixDQUF3QjtBQUFBLFdBQUtDLEVBQUVDLE9BQUYsRUFBTDtBQUFBLEdBQXhCLENBQVA7QUFDRDs7QUFFRDtBQUNPLFNBQVNSLFdBQVQsUUFBMkI7QUFBQSxNQUFMSyxFQUFLLFNBQUxBLEVBQUs7O0FBQ2hDO0FBQ0EsU0FBT0YsUUFBUUUsRUFBUixFQUFZRyxPQUFaLEVBQVA7QUFDRDs7QUFFTSxTQUFTUCxjQUFULFFBQWtDUSxVQUFsQyxFQUE4QztBQUFBLE1BQXJCQyxNQUFxQixTQUFyQkEsTUFBcUI7O0FBQ25ELE1BQUksQ0FBQ0EsTUFBRCxJQUFXLENBQUNBLE9BQU9MLEVBQXZCLEVBQTJCO0FBQ3pCLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQU1NLFdBQVdaLFlBQVlXLE1BQVosQ0FBakI7O0FBRUEsU0FBTztBQUNMRSxjQUFVO0FBQ1JDLDZCQUFpQkYsUUFBakIsR0FBMkJBLFNBQVMsQ0FBVCxDQUEzQixFQURRO0FBRVJHLFlBQU07QUFGRSxLQURMO0FBS0xMO0FBTEssR0FBUDtBQU9EIiwiZmlsZSI6ImgzLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2gzVG9HZW8sIGgzVG9HZW9Cb3VuZGFyeX0gPSByZXF1aXJlKCdAdWJlci9oMy10cmFuc2l0aW9uYWwnKTtcbiAgLy8gcHJvY2Vzcy5lbnYuQlJPV1NFUiB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnXG4gIC8vICAgPyByZXF1aXJlKCdAdWJlci9oMy10cmFuc2l0aW9uYWwnKVxuICAvLyAgIDoge2gzVG9HZW86IG51bGwsIGgzVG9HZW9Cb3VuZGFyeTogbnVsbCwgVjI6IG51bGx9O1xuXG4vLyBnZXQgdmVydGljZXMgc2hvdWxkIHJldHVybiBbbG9uLCBsYXRdXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmVydGljZXMoe2lkfSkge1xuICAvLyBhbHdheXMgcmV2ZXJzZSBpdFxuICByZXR1cm4gaDNUb0dlb0JvdW5kYXJ5KGlkKS5tYXAoZCA9PiBkLnJldmVyc2UoKSk7XG59XG5cbi8vIGdldCBjZW50cm9pZCBzaG91bGQgcmV0dXJuIFtsb24sIGxhdF1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDZW50cm9pZCh7aWR9KSB7XG4gIC8vIGFsd2F5cyByZXZlcnNlIGl0IHRvIFtsbmcsIGxhdF1cbiAgcmV0dXJuIGgzVG9HZW8oaWQpLnJldmVyc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9Qb2x5Z29uR2VvKHtvYmplY3R9LCBwcm9wZXJ0aWVzKSB7XG4gIGlmICghb2JqZWN0IHx8ICFvYmplY3QuaWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHZlcnRpY2VzID0gZ2V0VmVydGljZXMob2JqZWN0KTtcblxuICByZXR1cm4ge1xuICAgIGdlb21ldHJ5OiB7XG4gICAgICBjb29yZGluYXRlczogWy4uLnZlcnRpY2VzLCB2ZXJ0aWNlc1swXV0sXG4gICAgICB0eXBlOiAnTGluZVN0cmluZydcbiAgICB9LFxuICAgIHByb3BlcnRpZXNcbiAgfTtcbn1cbiJdfQ==