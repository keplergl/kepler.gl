"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseGeoJsonRawFeature = parseGeoJsonRawFeature;
exports.getGeojsonDataMaps = getGeojsonDataMaps;
exports.parseGeometryFromString = parseGeometryFromString;
exports.getGeojsonBounds = getGeojsonBounds;
exports.getGeojsonFeatureTypes = getGeojsonFeatureTypes;
exports.featureToDeckGlGeoType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _wellknown = _interopRequireDefault(require("wellknown"));

var _geojsonNormalize = _interopRequireDefault(require("@mapbox/geojson-normalize"));

var _bbox = _interopRequireDefault(require("@turf/bbox"));

var _dataUtils = require("../../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function parseGeoJsonRawFeature(rawFeature) {
  if ((0, _typeof2["default"])(rawFeature) === 'object') {
    // Support GeoJson feature as object
    // probably need to normalize it as well
    var normalized = (0, _geojsonNormalize["default"])(rawFeature);

    if (!normalized || !Array.isArray(normalized.features)) {
      // fail to normalize GeoJson
      return null;
    }

    return normalized.features[0];
  } else if (typeof rawFeature === 'string') {
    return parseGeometryFromString(rawFeature);
  } else if (Array.isArray(rawFeature)) {
    // Support GeoJson  LineString as an array of points
    return {
      type: 'Feature',
      geometry: {
        // why do we need to flip it...
        coordinates: rawFeature.map(function (pts) {
          return [pts[1], pts[0]];
        }),
        type: 'LineString'
      }
    };
  }

  return null;
}
/**
 * Parse raw data to GeoJson feature
 * @param allData
 * @param getFeature
 * @returns {{}}
 */


function getGeojsonDataMaps(allData, getFeature) {
  var acceptableTypes = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];
  var dataToFeature = [];

  for (var index = 0; index < allData.length; index++) {
    var feature = parseGeoJsonRawFeature(getFeature(allData[index]));

    if (feature && feature.geometry && acceptableTypes.includes(feature.geometry.type)) {
      var cleaned = _objectSpread(_objectSpread({}, feature), {}, {
        // store index of the data in feature properties
        properties: _objectSpread(_objectSpread({}, feature.properties), {}, {
          index: index
        })
      });

      dataToFeature[index] = cleaned;
    } else {
      dataToFeature[index] = null;
    }
  }

  return dataToFeature;
}
/**
 * Parse geojson from string
 * @param {String} geoString
 * @returns {null | Object} geojson object or null if failed
 */


function parseGeometryFromString(geoString) {
  var parsedGeo; // try parse as geojson string
  // {"type":"Polygon","coordinates":[[[-74.158491,40.83594]]]}

  try {
    parsedGeo = JSON.parse(geoString);
  } catch (e) {// keep trying to parse
  } // try parse as wkt


  if (!parsedGeo) {
    try {
      parsedGeo = (0, _wellknown["default"])(geoString);
    } catch (e) {
      return null;
    }
  }

  if (!parsedGeo) {
    return null;
  }

  var normalized = (0, _geojsonNormalize["default"])(parsedGeo);

  if (!normalized || !Array.isArray(normalized.features)) {
    // fail to normalize geojson
    return null;
  }

  return normalized.features[0];
}

function getGeojsonBounds() {
  var features = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  // 70 ms for 10,000 polygons
  // here we only pick couple
  var maxCount = 10000;
  var samples = features.length > maxCount ? (0, _dataUtils.getSampleData)(features, maxCount) : features;
  var nonEmpty = samples.filter(function (d) {
    return d && d.geometry && d.geometry.coordinates && d.geometry.coordinates.length;
  });

  try {
    return (0, _bbox["default"])({
      type: 'FeatureCollection',
      features: nonEmpty
    });
  } catch (e) {
    return null;
  }
}

var featureToDeckGlGeoType = {
  Point: 'point',
  MultiPoint: 'point',
  LineString: 'line',
  MultiLineString: 'line',
  Polygon: 'polygon',
  MultiPolygon: 'polygon'
};
/**
 * Parse geojson from string
 * @param {Array<Object>} allFeatures
 * @returns {Object} mapping of feature type existence
 */

exports.featureToDeckGlGeoType = featureToDeckGlGeoType;

function getGeojsonFeatureTypes(allFeatures) {
  var featureTypes = {};

  for (var f = 0; f < allFeatures.length; f++) {
    var feature = allFeatures[f];
    var geoType = featureToDeckGlGeoType[feature && feature.geometry && feature.geometry.type];

    if (geoType) {
      featureTypes[geoType] = true;
    }
  }

  return featureTypes;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLXV0aWxzLmpzIl0sIm5hbWVzIjpbInBhcnNlR2VvSnNvblJhd0ZlYXR1cmUiLCJyYXdGZWF0dXJlIiwibm9ybWFsaXplZCIsIkFycmF5IiwiaXNBcnJheSIsImZlYXR1cmVzIiwicGFyc2VHZW9tZXRyeUZyb21TdHJpbmciLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm1hcCIsInB0cyIsImdldEdlb2pzb25EYXRhTWFwcyIsImFsbERhdGEiLCJnZXRGZWF0dXJlIiwiYWNjZXB0YWJsZVR5cGVzIiwiZGF0YVRvRmVhdHVyZSIsImluZGV4IiwibGVuZ3RoIiwiZmVhdHVyZSIsImluY2x1ZGVzIiwiY2xlYW5lZCIsInByb3BlcnRpZXMiLCJnZW9TdHJpbmciLCJwYXJzZWRHZW8iLCJKU09OIiwicGFyc2UiLCJlIiwiZ2V0R2VvanNvbkJvdW5kcyIsIm1heENvdW50Iiwic2FtcGxlcyIsIm5vbkVtcHR5IiwiZmlsdGVyIiwiZCIsImZlYXR1cmVUb0RlY2tHbEdlb1R5cGUiLCJQb2ludCIsIk11bHRpUG9pbnQiLCJMaW5lU3RyaW5nIiwiTXVsdGlMaW5lU3RyaW5nIiwiUG9seWdvbiIsIk11bHRpUG9seWdvbiIsImdldEdlb2pzb25GZWF0dXJlVHlwZXMiLCJhbGxGZWF0dXJlcyIsImZlYXR1cmVUeXBlcyIsImYiLCJnZW9UeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLFNBQVNBLHNCQUFULENBQWdDQyxVQUFoQyxFQUE0QztBQUNqRCxNQUFJLHlCQUFPQSxVQUFQLE1BQXNCLFFBQTFCLEVBQW9DO0FBQ2xDO0FBQ0E7QUFDQSxRQUFNQyxVQUFVLEdBQUcsa0NBQVVELFVBQVYsQ0FBbkI7O0FBQ0EsUUFBSSxDQUFDQyxVQUFELElBQWUsQ0FBQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNGLFVBQVUs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QUcsRUFBckI7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixXQUFXLENBQUN4QixNQUFoQyxFQUF3QzBCLENBQUMsRUFBekMsRUFBNkM7QUFDM0MsUUFBTXpCLE9BQU8sR0FBR3VCLFdBQVcsQ0FBQ0UsQ0FBRCxDQUEzQjtBQUNBLFFBQU1DLE9BQU8sR0FBR1gsc0JBQXNCLENBQUNmLE9BQU8sSUFBSUEsT0FBTyxDQUFDWCxRQUFuQixJQUErQlcsT0FBTyxDQUFDWCxRQUFSLENBQWlCRCxJQUFqRCxDQUF0Qzs7QUFDQSxRQUFJc0MsT0FBSixFQUFhO0FBQ1hGLE1BQUFBLFlBQVksQ0FBQ0UsT0FBRCxDQUFaLEdBQXdCLElBQXhCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPRixZQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgd2t0UGFyc2VyIGZyb20gJ3dlbGxrbm93bic7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ0BtYXBib3gvZ2VvanNvbi1ub3JtYWxpemUnO1xuaW1wb3J0IGJib3ggZnJvbSAnQHR1cmYvYmJveCc7XG5cbmltcG9ydCB7Z2V0U2FtcGxlRGF0YX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdlb0pzb25SYXdGZWF0dXJlKHJhd0ZlYXR1cmUpIHtcbiAgaWYgKHR5cGVvZiByYXdGZWF0dXJlID09PSAnb2JqZWN0Jykge1xuICAgIC8vIFN1cHBvcnQgR2VvSnNvbiBmZWF0dXJlIGFzIG9iamVjdFxuICAgIC8vIHByb2JhYmx5IG5lZWQgdG8gbm9ybWFsaXplIGl0IGFzIHdlbGxcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHJhd0ZlYXR1cmUpO1xuICAgIGlmICghbm9ybWFsaXplZCB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkLmZlYXR1cmVzKSkge1xuICAgICAgLy8gZmFpbCB0byBub3JtYWxpemUgR2VvSnNvblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQuZmVhdHVyZXNbMF07XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJhd0ZlYXR1cmUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHBhcnNlR2VvbWV0cnlGcm9tU3RyaW5nKHJhd0ZlYXR1cmUpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3RmVhdHVyZSkpIHtcbiAgICAvLyBTdXBwb3J0IEdlb0pzb24gIExpbmVTdHJpbmcgYXMgYW4gYXJyYXkgb2YgcG9pbnRzXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIC8vIHdoeSBkbyB3ZSBuZWVkIHRvIGZsaXAgaXQuLi5cbiAgICAgICAgY29vcmRpbmF0ZXM6IHJhd0ZlYXR1cmUubWFwKHB0cyA9PiBbcHRzWzFdLCBwdHNbMF1dKSxcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuLyoqXG4gKiBQYXJzZSByYXcgZGF0YSB0byBHZW9Kc29uIGZlYXR1cmVcbiAqIEBwYXJhbSBhbGxEYXRhXG4gKiBAcGFyYW0gZ2V0RmVhdHVyZVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvanNvbkRhdGFNYXBzKGFsbERhdGEsIGdldEZlYXR1cmUpIHtcbiAgY29uc3QgYWNjZXB0YWJsZVR5cGVzID0gW1xuICAgICdQb2ludCcsXG4gICAgJ011bHRpUG9pbnQnLFxuICAgICdMaW5lU3RyaW5nJyxcbiAgICAnTXVsdGlMaW5lU3RyaW5nJyxcbiAgICAnUG9seWdvbicsXG4gICAgJ011bHRpUG9seWdvbicsXG4gICAgJ0dlb21ldHJ5Q29sbGVjdGlvbidcbiAgXTtcblxuICBjb25zdCBkYXRhVG9GZWF0dXJlID0gW107XG5cbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGFsbERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgY29uc3QgZmVhdHVyZSA9IHBhcnNlR2VvSnNvblJhd0ZlYXR1cmUoZ2V0RmVhdHVyZShhbGxEYXRhW2luZGV4XSkpO1xuXG4gICAgaWYgKGZlYXR1cmUgJiYgZmVhdHVyZS5nZW9tZXRyeSAmJiBhY2NlcHRhYmxlVHlwZXMuaW5jbHVkZXMoZmVhdHVyZS5nZW9tZXRyeS50eXBlKSkge1xuICAgICAgY29uc3QgY2xlYW5lZCA9IHtcbiAgICAgICAgLi4uZmVhdHVyZSxcbiAgICAgICAgLy8gc3RvcmUgaW5kZXggb2YgdGhlIGRhdGEgaW4gZmVhdHVyZSBwcm9wZXJ0aWVzXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5mZWF0dXJlLnByb3BlcnRpZXMsXG4gICAgICAgICAgaW5kZXhcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZGF0YVRvRmVhdHVyZVtpbmRleF0gPSBjbGVhbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhVG9GZWF0dXJlW2luZGV4XSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGFUb0ZlYXR1cmU7XG59XG5cbi8qKlxuICogUGFyc2UgZ2VvanNvbiBmcm9tIHN0cmluZ1xuICogQHBhcmFtIHtTdHJpbmd9IGdlb1N0cmluZ1xuICogQHJldHVybnMge251bGwgfCBPYmplY3R9IGdlb2pzb24gb2JqZWN0IG9yIG51bGwgaWYgZmFpbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdlb21ldHJ5RnJvbVN0cmluZyhnZW9TdHJpbmcpIHtcbiAgbGV0IHBhcnNlZEdlbztcblxuICAvLyB0cnkgcGFyc2UgYXMgZ2VvanNvbiBzdHJpbmdcbiAgLy8ge1widHlwZVwiOlwiUG9seWdvblwiLFwiY29vcmRpbmF0ZXNcIjpbW1stNzQuMTU4NDkxLDQwLjgzNTk0XV1dfVxuICB0cnkge1xuICAgIHBhcnNlZEdlbyA9IEpTT04ucGFyc2UoZ2VvU3RyaW5nKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGtlZXAgdHJ5aW5nIHRvIHBhcnNlXG4gIH1cblxuICAvLyB0cnkgcGFyc2UgYXMgd2t0XG4gIGlmICghcGFyc2VkR2VvKSB7XG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZEdlbyA9IHdrdFBhcnNlcihnZW9TdHJpbmcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmICghcGFyc2VkR2VvKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHBhcnNlZEdlbyk7XG5cbiAgaWYgKCFub3JtYWxpemVkIHx8ICFBcnJheS5pc0FycmF5KG5vcm1hbGl6ZWQuZmVhdHVyZXMpKSB7XG4gICAgLy8gZmFpbCB0byBub3JtYWxpemUgZ2VvanNvblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWQuZmVhdHVyZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW9qc29uQm91bmRzKGZlYXR1cmVzID0gW10pIHtcbiAgLy8gNzAgbXMgZm9yIDEwLDAwMCBwb2x5Z29uc1xuICAvLyBoZXJlIHdlIG9ubHkgcGljayBjb3VwbGVcbiAgY29uc3QgbWF4Q291bnQgPSAxMDAwMDtcbiAgY29uc3Qgc2FtcGxlcyA9IGZlYXR1cmVzLmxlbmd0aCA+IG1heENvdW50ID8gZ2V0U2FtcGxlRGF0YShmZWF0dXJlcywgbWF4Q291bnQpIDogZmVhdHVyZXM7XG5cbiAgY29uc3Qgbm9uRW1wdHkgPSBzYW1wbGVzLmZpbHRlcihcbiAgICBkID0+IGQgJiYgZC5nZW9tZXRyeSAmJiBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzICYmIGQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoXG4gICk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gYmJveCh7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IG5vbkVtcHR5XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZmVhdHVyZVRvRGVja0dsR2VvVHlwZSA9IHtcbiAgUG9pbnQ6ICdwb2ludCcsXG4gIE11bHRpUG9pbnQ6ICdwb2ludCcsXG4gIExpbmVTdHJpbmc6ICdsaW5lJyxcbiAgTXVsdGlMaW5lU3RyaW5nOiAnbGluZScsXG4gIFBvbHlnb246ICdwb2x5Z29uJyxcbiAgTXVsdGlQb2x5Z29uOiAncG9seWdvbidcbn07XG5cbi8qKlxuICogUGFyc2UgZ2VvanNvbiBmcm9tIHN0cmluZ1xuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhbGxGZWF0dXJlc1xuICogQHJldHVybnMge09iamVjdH0gbWFwcGluZyBvZiBmZWF0dXJlIHR5cGUgZXhpc3RlbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW9qc29uRmVhdHVyZVR5cGVzKGFsbEZlYXR1cmVzKSB7XG4gIGNvbnN0IGZlYXR1cmVUeXBlcyA9IHt9O1xuICBmb3IgKGxldCBmID0gMDsgZiA8IGFsbEZlYXR1cmVzLmxlbmd0aDsgZisrKSB7XG4gICAgY29uc3QgZmVhdHVyZSA9IGFsbEZlYXR1cmVzW2ZdO1xuICAgIGNvbnN0IGdlb1R5cGUgPSBmZWF0dXJlVG9EZWNrR2xHZW9UeXBlW2ZlYXR1cmUgJiYgZmVhdHVyZS5nZW9tZXRyeSAmJiBmZWF0dXJlLmdlb21ldHJ5LnR5cGVdO1xuICAgIGlmIChnZW9UeXBlKSB7XG4gICAgICBmZWF0dXJlVHlwZXNbZ2VvVHlwZV0gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmZWF0dXJlVHlwZXM7XG59XG4iXX0=