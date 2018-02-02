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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXRWZXJ0aWNlcyIsImdldENlbnRyb2lkIiwiaWRUb1BvbHlnb25HZW8iLCJyZXF1aXJlIiwiaDNUb0dlbyIsImgzVG9HZW9Cb3VuZGFyeSIsImlkIiwibWFwIiwiZCIsInJldmVyc2UiLCJwcm9wZXJ0aWVzIiwib2JqZWN0IiwidmVydGljZXMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFNZ0JBLFcsR0FBQUEsVztRQU1BQyxXLEdBQUFBLFc7UUFLQUMsYyxHQUFBQSxjOztlQWpCbUJDLFFBQVEsdUJBQVIsQztJQUE1QkMsTyxZQUFBQSxPO0lBQVNDLGUsWUFBQUEsZTtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7OztBQUNPLFNBQVNMLFdBQVQsT0FBMkI7QUFBQSxNQUFMTSxFQUFLLFFBQUxBLEVBQUs7O0FBQ2hDO0FBQ0EsU0FBT0QsZ0JBQWdCQyxFQUFoQixFQUFvQkMsR0FBcEIsQ0FBd0I7QUFBQSxXQUFLQyxFQUFFQyxPQUFGLEVBQUw7QUFBQSxHQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7QUFDTyxTQUFTUixXQUFULFFBQTJCO0FBQUEsTUFBTEssRUFBSyxTQUFMQSxFQUFLOztBQUNoQztBQUNBLFNBQU9GLFFBQVFFLEVBQVIsRUFBWUcsT0FBWixFQUFQO0FBQ0Q7O0FBRU0sU0FBU1AsY0FBVCxRQUFrQ1EsVUFBbEMsRUFBOEM7QUFBQSxNQUFyQkMsTUFBcUIsU0FBckJBLE1BQXFCOztBQUNuRCxNQUFJLENBQUNBLE1BQUQsSUFBVyxDQUFDQSxPQUFPTCxFQUF2QixFQUEyQjtBQUN6QixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFNTSxXQUFXWixZQUFZVyxNQUFaLENBQWpCOztBQUVBLFNBQU87QUFDTEUsY0FBVTtBQUNSQyw2QkFBaUJGLFFBQWpCLEdBQTJCQSxTQUFTLENBQVQsQ0FBM0IsRUFEUTtBQUVSRyxZQUFNO0FBRkUsS0FETDtBQUtMTDtBQUxLLEdBQVA7QUFPRCIsImZpbGUiOiJoMy11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtoM1RvR2VvLCBoM1RvR2VvQm91bmRhcnl9ID0gcmVxdWlyZSgnQHViZXIvaDMtdHJhbnNpdGlvbmFsJyk7XG4vLyBwcm9jZXNzLmVudi5CUk9XU0VSIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCdcbi8vICAgPyByZXF1aXJlKCdAdWJlci9oMy10cmFuc2l0aW9uYWwnKVxuLy8gICA6IHtoM1RvR2VvOiBudWxsLCBoM1RvR2VvQm91bmRhcnk6IG51bGwsIFYyOiBudWxsfTtcblxuLy8gZ2V0IHZlcnRpY2VzIHNob3VsZCByZXR1cm4gW2xvbiwgbGF0XVxuZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRpY2VzKHtpZH0pIHtcbiAgLy8gYWx3YXlzIHJldmVyc2UgaXRcbiAgcmV0dXJuIGgzVG9HZW9Cb3VuZGFyeShpZCkubWFwKGQgPT4gZC5yZXZlcnNlKCkpO1xufVxuXG4vLyBnZXQgY2VudHJvaWQgc2hvdWxkIHJldHVybiBbbG9uLCBsYXRdXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2VudHJvaWQoe2lkfSkge1xuICAvLyBhbHdheXMgcmV2ZXJzZSBpdCB0byBbbG5nLCBsYXRdXG4gIHJldHVybiBoM1RvR2VvKGlkKS5yZXZlcnNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpZFRvUG9seWdvbkdlbyh7b2JqZWN0fSwgcHJvcGVydGllcykge1xuICBpZiAoIW9iamVjdCB8fCAhb2JqZWN0LmlkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB2ZXJ0aWNlcyA9IGdldFZlcnRpY2VzKG9iamVjdCk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZW9tZXRyeToge1xuICAgICAgY29vcmRpbmF0ZXM6IFsuLi52ZXJ0aWNlcywgdmVydGljZXNbMF1dLFxuICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzXG4gIH07XG59XG4iXX0=