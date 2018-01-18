'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.getGeojsonDataMaps = getGeojsonDataMaps;
exports.parseGeometryFromString = parseGeometryFromString;
exports.getGeojsonBounds = getGeojsonBounds;
exports.featureToDeckGlGeoType = featureToDeckGlGeoType;

var _geojsonExtent = require('@mapbox/geojson-extent');

var _geojsonExtent2 = _interopRequireDefault(_geojsonExtent);

var _wellknown = require('wellknown');

var _wellknown2 = _interopRequireDefault(_wellknown);

var _geojsonNormalize = require('geojson-normalize');

var _geojsonNormalize2 = _interopRequireDefault(_geojsonNormalize);

var _dataUtils = require('../../utils/data-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse raw data to geojson feature
 * @param allData
 * @param getFeature
 * @returns {{}}
 */
function getGeojsonDataMaps(allData, getFeature) {
  var acceptableTypes = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];

  var dataToFeature = {};

  allData.forEach(function (d, index) {
    dataToFeature[index] = null;
    var rawFeature = getFeature(d);

    var feature = null;

    // parse feature from field
    if (Array.isArray(rawFeature)) {
      // Support geojson as an array of points
      feature = {
        type: 'Feature',
        geometry: {
          // why do we need to flip it...
          coordinates: rawFeature.map(function (pts) {
            return [pts[1], pts[0]];
          }),
          type: 'LineString'
        }
      };
    } else if (typeof rawFeature === 'string') {

      feature = parseGeometryFromString(rawFeature);
    } else if ((typeof rawFeature === 'undefined' ? 'undefined' : (0, _typeof3.default)(rawFeature)) === 'object') {
      // Support geojson feature as object
      // probably need to normalize it as well
      var normalized = (0, _geojsonNormalize2.default)(rawFeature);
      if (!normalized || !Array.isArray(normalized.features)) {
        // fail to normalize geojson
        return null;
      }

      feature = normalized.features[0];
    }

    if (feature && feature.geometry && acceptableTypes.includes(feature.geometry.type)) {

      // store index of the data in feature properties
      feature.properties = (0, _extends3.default)({}, feature.properties || {}, {
        index: index
      });

      dataToFeature[index] = feature;
    }
  });

  return dataToFeature;
}

/**
 * Parse geojson from string
 * @param {String} geoString
 * @returns {null | Object} geojson object or null if failed
 */
function parseGeometryFromString(geoString) {
  var parsedGeo = void 0;

  // try parse as geojson string
  // {"type":"Polygon","coordinates":[[[-74.158491,40.83594]]]}
  try {
    parsedGeo = JSON.parse(geoString);
  } catch (e) {}
  // keep trying to parse


  // try parse as wkt
  if (!parsedGeo) {
    try {
      parsedGeo = (0, _wellknown2.default)(geoString);
    } catch (e) {
      return null;
    }
  }

  if (!parsedGeo) {
    return null;
  }

  var normalized = (0, _geojsonNormalize2.default)(parsedGeo);

  if (!normalized || !Array.isArray(normalized.features)) {
    // fail to normalize geojson
    return null;
  }

  return normalized.features[0];
}

function getGeojsonBounds() {
  var features = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  // calculate feature bounds is computation heavy
  // here we only pick couple
  var samples = features.length > 500 ? (0, _dataUtils.getSampleData)(features, 500) : features;

  var nonEmpty = samples.filter(function (d) {
    return d && d.geometry && d.geometry.coordinates && d.geometry.coordinates.length;
  });

  try {
    return (0, _geojsonExtent2.default)({
      type: 'FeatureCollection',
      features: nonEmpty
    });
  } catch (e) {
    return null;
  }
}

function featureToDeckGlGeoType(type) {
  switch (type) {
    case 'Point':
    case 'MultiPoint':
      return 'point';

    case 'LineString':
    case 'MultiLineString':
      return 'line';

    case 'Polygon':
    case 'MultiPolygon':
      return 'polygon';

    default:
      return null;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEdlb2pzb25EYXRhTWFwcyIsInBhcnNlR2VvbWV0cnlGcm9tU3RyaW5nIiwiZ2V0R2VvanNvbkJvdW5kcyIsImZlYXR1cmVUb0RlY2tHbEdlb1R5cGUiLCJhbGxEYXRhIiwiZ2V0RmVhdHVyZSIsImFjY2VwdGFibGVUeXBlcyIsImRhdGFUb0ZlYXR1cmUiLCJmb3JFYWNoIiwiZCIsImluZGV4IiwicmF3RmVhdHVyZSIsImZlYXR1cmUiLCJBcnJheSIsImlzQXJyYXkiLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm1hcCIsInB0cyIsIm5vcm1hbGl6ZWQiLCJmZWF0dXJlcyIsImluY2x1ZGVzIiwicHJvcGVydGllcyIsImdlb1N0cmluZyIsInBhcnNlZEdlbyIsIkpTT04iLCJwYXJzZSIsImUiLCJzYW1wbGVzIiwibGVuZ3RoIiwibm9uRW1wdHkiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBWWdCQSxrQixHQUFBQSxrQjtRQTREQUMsdUIsR0FBQUEsdUI7UUFrQ0FDLGdCLEdBQUFBLGdCO1FBbUJBQyxzQixHQUFBQSxzQjs7QUE3SGhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUE7Ozs7OztBQU1PLFNBQVNILGtCQUFULENBQTRCSSxPQUE1QixFQUFxQ0MsVUFBckMsRUFBaUQ7QUFDdEQsTUFBTUMsa0JBQWtCLENBQUMsT0FBRCxFQUFVLFlBQVYsRUFBd0IsWUFBeEIsRUFBc0MsaUJBQXRDLEVBQ3RCLFNBRHNCLEVBQ1gsY0FEVyxFQUNLLG9CQURMLENBQXhCOztBQUdBLE1BQU1DLGdCQUFnQixFQUF0Qjs7QUFFQUgsVUFBUUksT0FBUixDQUFnQixVQUFDQyxDQUFELEVBQUlDLEtBQUosRUFBYztBQUM1Qkgsa0JBQWNHLEtBQWQsSUFBdUIsSUFBdkI7QUFDQSxRQUFNQyxh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QUFFTSxTQUFTekIsc0JBQVQsQ0FBZ0NZLElBQWhDLEVBQXNDO0FBQzNDLFVBQVFBLElBQVI7QUFDRSxTQUFLLE9BQUw7QUFDQSxTQUFLLFlBQUw7QUFDRSxhQUFPLE9BQVA7O0FBRUYsU0FBSyxZQUFMO0FBQ0EsU0FBSyxpQkFBTDtBQUNFLGFBQU8sTUFBUDs7QUFFRixTQUFLLFNBQUw7QUFDQSxTQUFLLGNBQUw7QUFDRSxhQUFPLFNBQVA7O0FBRUY7QUFDRSxhQUFPLElBQVA7QUFkSjtBQWdCRCIsImZpbGUiOiJnZW9qc29uLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdlb2pzb25FeHRlbnQgZnJvbSAnQG1hcGJveC9nZW9qc29uLWV4dGVudCc7XG5pbXBvcnQgd2t0UGFyc2VyIGZyb20gJ3dlbGxrbm93bic7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ2dlb2pzb24tbm9ybWFsaXplJztcblxuaW1wb3J0IHtnZXRTYW1wbGVEYXRhfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuLyoqXG4gKiBQYXJzZSByYXcgZGF0YSB0byBnZW9qc29uIGZlYXR1cmVcbiAqIEBwYXJhbSBhbGxEYXRhXG4gKiBAcGFyYW0gZ2V0RmVhdHVyZVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvanNvbkRhdGFNYXBzKGFsbERhdGEsIGdldEZlYXR1cmUpIHtcbiAgY29uc3QgYWNjZXB0YWJsZVR5cGVzID0gWydQb2ludCcsICdNdWx0aVBvaW50JywgJ0xpbmVTdHJpbmcnLCAnTXVsdGlMaW5lU3RyaW5nJyxcbiAgICAnUG9seWdvbicsICdNdWx0aVBvbHlnb24nLCAnR2VvbWV0cnlDb2xsZWN0aW9uJ107XG5cbiAgY29uc3QgZGF0YVRvRmVhdHVyZSA9IHt9O1xuXG4gIGFsbERhdGEuZm9yRWFjaCgoZCwgaW5kZXgpID0+IHtcbiAgICBkYXRhVG9GZWF0dXJlW2luZGV4XSA9IG51bGw7XG4gICAgY29uc3QgcmF3RmVhdHVyZSA9IGdldEZlYXR1cmUoZCk7XG5cbiAgICBsZXQgZmVhdHVyZSA9IG51bGw7XG5cbiAgICAvLyBwYXJzZSBmZWF0dXJlIGZyb20gZmllbGRcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyYXdGZWF0dXJlKSkge1xuICAgICAgLy8gU3VwcG9ydCBnZW9qc29uIGFzIGFuIGFycmF5IG9mIHBvaW50c1xuICAgICAgZmVhdHVyZSA9ICh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAvLyB3aHkgZG8gd2UgbmVlZCB0byBmbGlwIGl0Li4uXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJhd0ZlYXR1cmUubWFwKHB0cyA9PiBbcHRzWzFdLCBwdHNbMF1dKSxcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZydcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByYXdGZWF0dXJlID09PSAnc3RyaW5nJykge1xuXG4gICAgICBmZWF0dXJlID0gcGFyc2VHZW9tZXRyeUZyb21TdHJpbmcocmF3RmVhdHVyZSk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByYXdGZWF0dXJlID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gU3VwcG9ydCBnZW9qc29uIGZlYXR1cmUgYXMgb2JqZWN0XG4gICAgICAvLyBwcm9iYWJseSBuZWVkIHRvIG5vcm1hbGl6ZSBpdCBhcyB3ZWxsXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHJhd0ZlYXR1cmUpO1xuICAgICAgaWYgKCFub3JtYWxpemVkIHx8ICFBcnJheS5pc0FycmF5KG5vcm1hbGl6ZWQuZmVhdHVyZXMpKSB7XG4gICAgICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGZlYXR1cmUgPSBub3JtYWxpemVkLmZlYXR1cmVzWzBdO1xuICAgIH1cblxuICAgIGlmIChmZWF0dXJlICYmIGZlYXR1cmUuZ2VvbWV0cnkgJiYgYWNjZXB0YWJsZVR5cGVzLmluY2x1ZGVzKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSkpIHtcblxuICAgICAgLy8gc3RvcmUgaW5kZXggb2YgdGhlIGRhdGEgaW4gZmVhdHVyZSBwcm9wZXJ0aWVzXG4gICAgICBmZWF0dXJlLnByb3BlcnRpZXMgPSB7XG4gICAgICAgIC4uLmZlYXR1cmUucHJvcGVydGllcyB8fCB7fSxcbiAgICAgICAgaW5kZXhcbiAgICAgIH07XG5cbiAgICAgIGRhdGFUb0ZlYXR1cmVbaW5kZXhdID0gZmVhdHVyZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhVG9GZWF0dXJlO1xufVxuXG4vKipcbiAqIFBhcnNlIGdlb2pzb24gZnJvbSBzdHJpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBnZW9TdHJpbmdcbiAqIEByZXR1cm5zIHtudWxsIHwgT2JqZWN0fSBnZW9qc29uIG9iamVjdCBvciBudWxsIGlmIGZhaWxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHZW9tZXRyeUZyb21TdHJpbmcoZ2VvU3RyaW5nKSB7XG4gIGxldCBwYXJzZWRHZW87XG5cbiAgLy8gdHJ5IHBhcnNlIGFzIGdlb2pzb24gc3RyaW5nXG4gIC8vIHtcInR5cGVcIjpcIlBvbHlnb25cIixcImNvb3JkaW5hdGVzXCI6W1tbLTc0LjE1ODQ5MSw0MC44MzU5NF1dXX1cbiAgdHJ5IHtcbiAgICBwYXJzZWRHZW8gPSBKU09OLnBhcnNlKGdlb1N0cmluZyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBrZWVwIHRyeWluZyB0byBwYXJzZVxuICB9XG5cbiAgLy8gdHJ5IHBhcnNlIGFzIHdrdFxuICBpZiAoIXBhcnNlZEdlbykge1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWRHZW8gPSB3a3RQYXJzZXIoZ2VvU3RyaW5nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoIXBhcnNlZEdlbykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZShwYXJzZWRHZW8pO1xuXG4gIGlmICghbm9ybWFsaXplZCB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkLmZlYXR1cmVzKSkge1xuICAgIC8vIGZhaWwgdG8gbm9ybWFsaXplIGdlb2pzb25cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkLmZlYXR1cmVzWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VvanNvbkJvdW5kcyhmZWF0dXJlcyA9IFtdKSB7XG5cbiAgLy8gY2FsY3VsYXRlIGZlYXR1cmUgYm91bmRzIGlzIGNvbXB1dGF0aW9uIGhlYXZ5XG4gIC8vIGhlcmUgd2Ugb25seSBwaWNrIGNvdXBsZVxuICBjb25zdCBzYW1wbGVzID0gZmVhdHVyZXMubGVuZ3RoID4gNTAwID8gZ2V0U2FtcGxlRGF0YShmZWF0dXJlcywgNTAwKSA6IGZlYXR1cmVzO1xuXG4gIGNvbnN0IG5vbkVtcHR5ID0gc2FtcGxlcy5maWx0ZXIoZCA9PiBkICYmIGQuZ2VvbWV0cnkgJiYgZC5nZW9tZXRyeS5jb29yZGluYXRlcyAmJlxuICBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aCk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZ2VvanNvbkV4dGVudCh7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IG5vbkVtcHR5XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVhdHVyZVRvRGVja0dsR2VvVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAgIHJldHVybiAncG9pbnQnO1xuXG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIHJldHVybiAnbGluZSc7XG5cbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgcmV0dXJuICdwb2x5Z29uJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19