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
      // store index of the data in feature properties
      feature.properties = _objectSpread({}, feature.properties || {}, {
        index: index
      });
      dataToFeature[index] = feature;
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
  } catch (e) {} // keep trying to parse
  // try parse as wkt


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLXV0aWxzLmpzIl0sIm5hbWVzIjpbInBhcnNlR2VvSnNvblJhd0ZlYXR1cmUiLCJyYXdGZWF0dXJlIiwibm9ybWFsaXplZCIsIkFycmF5IiwiaXNBcnJheSIsImZlYXR1cmVzIiwicGFyc2VHZW9tZXRyeUZyb21TdHJpbmciLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm1hcCIsInB0cyIsImdldEdlb2pzb25EYXRhTWFwcyIsImFsbERhdGEiLCJnZXRGZWF0dXJlIiwiYWNjZXB0YWJsZVR5cGVzIiwiZGF0YVRvRmVhdHVyZSIsImluZGV4IiwibGVuZ3RoIiwiZmVhdHVyZSIsImluY2x1ZGVzIiwicHJvcGVydGllcyIsImdlb1N0cmluZyIsInBhcnNlZEdlbyIsIkpTT04iLCJwYXJzZSIsImUiLCJnZXRHZW9qc29uQm91bmRzIiwibWF4Q291bnQiLCJzYW1wbGVzIiwibm9uRW1wdHkiLCJmaWx0ZXIiLCJkIiwiZmVhdHVyZVRvRGVja0dsR2VvVHlwZSIsIlBvaW50IiwiTXVsdGlQb2ludCIsIkxpbmVTdHJpbmciLCJNdWx0aUxpbmVTdHJpbmciLCJQb2x5Z29uIiwiTXVsdGlQb2x5Z29uIiwiZ2V0R2VvanNvbkZlYXR1cmVUeXBlcyIsImFsbEZlYXR1cmVzIiwiZmVhdHVyZVR5cGVzIiwiZiIsImdlb1R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRU8sU0FBU0Esc0JBQVQsQ0FBZ0NDLFVBQWhDLEVBQTRDO0FBQ2pELE1BQUkseUJBQU9BLFVBQVAsTUFBc0IsUUFBMUIsRUFBb0M7QUFDbEM7QUFDQTtBQUNBLFFBQU1DLFVBQVUsR0FBRyxrQ0FBVUQsVUFBVixDQUFuQjs7QUFDQSxRQUFJLENBQUNDLFVBQUQsSUFBZSxDQUFDQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsVUFBVSxDQUFDRyxRQUF6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d0N5QixDQUFDLEVBQXpDLEVBQTZDO0FBQzNDLFFBQU14QixPQUFPLEdBQUdzQixXQUFXLENBQUNFLENBQUQsQ0FBM0I7QUFDQSxRQUFNQyxPQUFPLEdBQUdYLHNCQUFzQixDQUFDZCxPQUFPLElBQUlBLE9BQU8sQ0FBQ1gsUUFBbkIsSUFBK0JXLE9BQU8sQ0FBQ1gsUUFBUixDQUFpQkQsSUFBakQsQ0FBdEM7O0FBQ0EsUUFBSXFDLE9BQUosRUFBYTtBQUNYRixNQUFBQSxZQUFZLENBQUNFLE9BQUQsQ0FBWixHQUF3QixJQUF4QjtBQUNEO0FBQ0Y7O0FBRUQsU0FBT0YsWUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHdrdFBhcnNlciBmcm9tICd3ZWxsa25vd24nO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdAbWFwYm94L2dlb2pzb24tbm9ybWFsaXplJztcbmltcG9ydCBiYm94IGZyb20gJ0B0dXJmL2Jib3gnO1xuXG5pbXBvcnQge2dldFNhbXBsZURhdGF9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHZW9Kc29uUmF3RmVhdHVyZShyYXdGZWF0dXJlKSB7XG4gIGlmICh0eXBlb2YgcmF3RmVhdHVyZSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBTdXBwb3J0IEdlb0pzb24gZmVhdHVyZSBhcyBvYmplY3RcbiAgICAvLyBwcm9iYWJseSBuZWVkIHRvIG5vcm1hbGl6ZSBpdCBhcyB3ZWxsXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZShyYXdGZWF0dXJlKTtcbiAgICBpZiAoIW5vcm1hbGl6ZWQgfHwgIUFycmF5LmlzQXJyYXkobm9ybWFsaXplZC5mZWF0dXJlcykpIHtcbiAgICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIEdlb0pzb25cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBub3JtYWxpemVkLmZlYXR1cmVzWzBdO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByYXdGZWF0dXJlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXJzZUdlb21ldHJ5RnJvbVN0cmluZyhyYXdGZWF0dXJlKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJhd0ZlYXR1cmUpKSB7XG4gICAgLy8gU3VwcG9ydCBHZW9Kc29uICBMaW5lU3RyaW5nIGFzIGFuIGFycmF5IG9mIHBvaW50c1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICAvLyB3aHkgZG8gd2UgbmVlZCB0byBmbGlwIGl0Li4uXG4gICAgICAgIGNvb3JkaW5hdGVzOiByYXdGZWF0dXJlLm1hcChwdHMgPT4gW3B0c1sxXSwgcHRzWzBdXSksXG4gICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbi8qKlxuICogUGFyc2UgcmF3IGRhdGEgdG8gR2VvSnNvbiBmZWF0dXJlXG4gKiBAcGFyYW0gYWxsRGF0YVxuICogQHBhcmFtIGdldEZlYXR1cmVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEdlb2pzb25EYXRhTWFwcyhhbGxEYXRhLCBnZXRGZWF0dXJlKSB7XG4gIGNvbnN0IGFjY2VwdGFibGVUeXBlcyA9IFtcbiAgICAnUG9pbnQnLFxuICAgICdNdWx0aVBvaW50JyxcbiAgICAnTGluZVN0cmluZycsXG4gICAgJ011bHRpTGluZVN0cmluZycsXG4gICAgJ1BvbHlnb24nLFxuICAgICdNdWx0aVBvbHlnb24nLFxuICAgICdHZW9tZXRyeUNvbGxlY3Rpb24nXG4gIF07XG5cbiAgY29uc3QgZGF0YVRvRmVhdHVyZSA9IFtdO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhbGxEYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IGZlYXR1cmUgPSBwYXJzZUdlb0pzb25SYXdGZWF0dXJlKGdldEZlYXR1cmUoYWxsRGF0YVtpbmRleF0pKTtcblxuICAgIGlmIChmZWF0dXJlICYmIGZlYXR1cmUuZ2VvbWV0cnkgJiYgYWNjZXB0YWJsZVR5cGVzLmluY2x1ZGVzKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSkpIHtcbiAgICAgIC8vIHN0b3JlIGluZGV4IG9mIHRoZSBkYXRhIGluIGZlYXR1cmUgcHJvcGVydGllc1xuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzID0ge1xuICAgICAgICAuLi4oZmVhdHVyZS5wcm9wZXJ0aWVzIHx8IHt9KSxcbiAgICAgICAgaW5kZXhcbiAgICAgIH07XG5cbiAgICAgIGRhdGFUb0ZlYXR1cmVbaW5kZXhdID0gZmVhdHVyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YVRvRmVhdHVyZVtpbmRleF0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhVG9GZWF0dXJlO1xufVxuXG4vKipcbiAqIFBhcnNlIGdlb2pzb24gZnJvbSBzdHJpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBnZW9TdHJpbmdcbiAqIEByZXR1cm5zIHtudWxsIHwgT2JqZWN0fSBnZW9qc29uIG9iamVjdCBvciBudWxsIGlmIGZhaWxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHZW9tZXRyeUZyb21TdHJpbmcoZ2VvU3RyaW5nKSB7XG4gIGxldCBwYXJzZWRHZW87XG5cbiAgLy8gdHJ5IHBhcnNlIGFzIGdlb2pzb24gc3RyaW5nXG4gIC8vIHtcInR5cGVcIjpcIlBvbHlnb25cIixcImNvb3JkaW5hdGVzXCI6W1tbLTc0LjE1ODQ5MSw0MC44MzU5NF1dXX1cbiAgdHJ5IHtcbiAgICBwYXJzZWRHZW8gPSBKU09OLnBhcnNlKGdlb1N0cmluZyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBrZWVwIHRyeWluZyB0byBwYXJzZVxuICB9XG5cbiAgLy8gdHJ5IHBhcnNlIGFzIHdrdFxuICBpZiAoIXBhcnNlZEdlbykge1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWRHZW8gPSB3a3RQYXJzZXIoZ2VvU3RyaW5nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoIXBhcnNlZEdlbykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZShwYXJzZWRHZW8pO1xuXG4gIGlmICghbm9ybWFsaXplZCB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkLmZlYXR1cmVzKSkge1xuICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkLmZlYXR1cmVzWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvanNvbkJvdW5kcyhmZWF0dXJlcyA9IFtdKSB7XG4gIC8vIDcwIG1zIGZvciAxMCwwMDAgcG9seWdvbnNcbiAgLy8gaGVyZSB3ZSBvbmx5IHBpY2sgY291cGxlXG4gIGNvbnN0IG1heENvdW50ID0gMTAwMDA7XG4gIGNvbnN0IHNhbXBsZXMgPSBmZWF0dXJlcy5sZW5ndGggPiBtYXhDb3VudCA/IGdldFNhbXBsZURhdGEoZmVhdHVyZXMsIG1heENvdW50KSA6IGZlYXR1cmVzO1xuXG4gIGNvbnN0IG5vbkVtcHR5ID0gc2FtcGxlcy5maWx0ZXIoXG4gICAgZCA9PiBkICYmIGQuZ2VvbWV0cnkgJiYgZC5nZW9tZXRyeS5jb29yZGluYXRlcyAmJiBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aFxuICApO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGJib3goe1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBub25FbXB0eVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZlYXR1cmVUb0RlY2tHbEdlb1R5cGUgPSB7XG4gIFBvaW50OiAncG9pbnQnLFxuICBNdWx0aVBvaW50OiAncG9pbnQnLFxuICBMaW5lU3RyaW5nOiAnbGluZScsXG4gIE11bHRpTGluZVN0cmluZzogJ2xpbmUnLFxuICBQb2x5Z29uOiAncG9seWdvbicsXG4gIE11bHRpUG9seWdvbjogJ3BvbHlnb24nXG59O1xuXG4vKipcbiAqIFBhcnNlIGdlb2pzb24gZnJvbSBzdHJpbmdcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYWxsRmVhdHVyZXNcbiAqIEByZXR1cm5zIHtPYmplY3R9IG1hcHBpbmcgb2YgZmVhdHVyZSB0eXBlIGV4aXN0ZW5jZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvanNvbkZlYXR1cmVUeXBlcyhhbGxGZWF0dXJlcykge1xuICBjb25zdCBmZWF0dXJlVHlwZXMgPSB7fTtcbiAgZm9yIChsZXQgZiA9IDA7IGYgPCBhbGxGZWF0dXJlcy5sZW5ndGg7IGYrKykge1xuICAgIGNvbnN0IGZlYXR1cmUgPSBhbGxGZWF0dXJlc1tmXTtcbiAgICBjb25zdCBnZW9UeXBlID0gZmVhdHVyZVRvRGVja0dsR2VvVHlwZVtmZWF0dXJlICYmIGZlYXR1cmUuZ2VvbWV0cnkgJiYgZmVhdHVyZS5nZW9tZXRyeS50eXBlXTtcbiAgICBpZiAoZ2VvVHlwZSkge1xuICAgICAgZmVhdHVyZVR5cGVzW2dlb1R5cGVdID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmVhdHVyZVR5cGVzO1xufVxuIl19