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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEdlb2pzb25EYXRhTWFwcyIsInBhcnNlR2VvbWV0cnlGcm9tU3RyaW5nIiwiZ2V0R2VvanNvbkJvdW5kcyIsImZlYXR1cmVUb0RlY2tHbEdlb1R5cGUiLCJhbGxEYXRhIiwiZ2V0RmVhdHVyZSIsImFjY2VwdGFibGVUeXBlcyIsImRhdGFUb0ZlYXR1cmUiLCJmb3JFYWNoIiwiZCIsImluZGV4IiwicmF3RmVhdHVyZSIsImZlYXR1cmUiLCJBcnJheSIsImlzQXJyYXkiLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm1hcCIsInB0cyIsIm5vcm1hbGl6ZWQiLCJmZWF0dXJlcyIsImluY2x1ZGVzIiwicHJvcGVydGllcyIsImdlb1N0cmluZyIsInBhcnNlZEdlbyIsIkpTT04iLCJwYXJzZSIsImUiLCJzYW1wbGVzIiwibGVuZ3RoIiwibm9uRW1wdHkiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBWWdCQSxrQixHQUFBQSxrQjtRQW1FQUMsdUIsR0FBQUEsdUI7UUFrQ0FDLGdCLEdBQUFBLGdCO1FBcUJBQyxzQixHQUFBQSxzQjs7QUF0SWhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUE7Ozs7OztBQU1PLFNBQVNILGtCQUFULENBQTRCSSxPQUE1QixFQUFxQ0MsVUFBckMsRUFBaUQ7QUFDdEQsTUFBTUMsa0JBQWtCLENBQ3RCLE9BRHNCLEVBRXRCLFlBRnNCLEVBR3RCLFlBSHNCLEVBSXRCLGlCQUpzQixFQUt0QixTQUxzQixFQU10QixjQU5zQixFQU90QixvQkFQc0IsQ0FBeEI7O0FBVUEsTUFBTUMsZ0JBQWdCLEVBQXRCOztBQUVBSCxVQUFRSSxPQUFSLENBQWdCLFVBQUNDLENBQUQsRUFBSUMsS0FBSixFQUFjO0FBQzVCSCxrQkFBY0csS0FBZCxJQUF1QixJQUF2QjtBQUNB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O0FBRU0sU0FBU3pCLHNCQUFULENBQWdDWSxJQUFoQyxFQUFzQztBQUMzQyxVQUFRQSxJQUFSO0FBQ0UsU0FBSyxPQUFMO0FBQ0EsU0FBSyxZQUFMO0FBQ0UsYUFBTyxPQUFQOztBQUVGLFNBQUssWUFBTDtBQUNBLFNBQUssaUJBQUw7QUFDRSxhQUFPLE1BQVA7O0FBRUYsU0FBSyxTQUFMO0FBQ0EsU0FBSyxjQUFMO0FBQ0UsYUFBTyxTQUFQOztBQUVGO0FBQ0UsYUFBTyxJQUFQO0FBZEo7QUFnQkQiLCJmaWxlIjoiZ2VvanNvbi11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZW9qc29uRXh0ZW50IGZyb20gJ0BtYXBib3gvZ2VvanNvbi1leHRlbnQnO1xuaW1wb3J0IHdrdFBhcnNlciBmcm9tICd3ZWxsa25vd24nO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdnZW9qc29uLW5vcm1hbGl6ZSc7XG5cbmltcG9ydCB7Z2V0U2FtcGxlRGF0YX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbi8qKlxuICogUGFyc2UgcmF3IGRhdGEgdG8gZ2VvanNvbiBmZWF0dXJlXG4gKiBAcGFyYW0gYWxsRGF0YVxuICogQHBhcmFtIGdldEZlYXR1cmVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEdlb2pzb25EYXRhTWFwcyhhbGxEYXRhLCBnZXRGZWF0dXJlKSB7XG4gIGNvbnN0IGFjY2VwdGFibGVUeXBlcyA9IFtcbiAgICAnUG9pbnQnLFxuICAgICdNdWx0aVBvaW50JyxcbiAgICAnTGluZVN0cmluZycsXG4gICAgJ011bHRpTGluZVN0cmluZycsXG4gICAgJ1BvbHlnb24nLFxuICAgICdNdWx0aVBvbHlnb24nLFxuICAgICdHZW9tZXRyeUNvbGxlY3Rpb24nXG4gIF07XG5cbiAgY29uc3QgZGF0YVRvRmVhdHVyZSA9IHt9O1xuXG4gIGFsbERhdGEuZm9yRWFjaCgoZCwgaW5kZXgpID0+IHtcbiAgICBkYXRhVG9GZWF0dXJlW2luZGV4XSA9IG51bGw7XG4gICAgY29uc3QgcmF3RmVhdHVyZSA9IGdldEZlYXR1cmUoZCk7XG5cbiAgICBsZXQgZmVhdHVyZSA9IG51bGw7XG5cbiAgICAvLyBwYXJzZSBmZWF0dXJlIGZyb20gZmllbGRcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyYXdGZWF0dXJlKSkge1xuICAgICAgLy8gU3VwcG9ydCBnZW9qc29uIGFzIGFuIGFycmF5IG9mIHBvaW50c1xuICAgICAgZmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIC8vIHdoeSBkbyB3ZSBuZWVkIHRvIGZsaXAgaXQuLi5cbiAgICAgICAgICBjb29yZGluYXRlczogcmF3RmVhdHVyZS5tYXAocHRzID0+IFtwdHNbMV0sIHB0c1swXV0pLFxuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJhd0ZlYXR1cmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmZWF0dXJlID0gcGFyc2VHZW9tZXRyeUZyb21TdHJpbmcocmF3RmVhdHVyZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmF3RmVhdHVyZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIC8vIFN1cHBvcnQgZ2VvanNvbiBmZWF0dXJlIGFzIG9iamVjdFxuICAgICAgLy8gcHJvYmFibHkgbmVlZCB0byBub3JtYWxpemUgaXQgYXMgd2VsbFxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZShyYXdGZWF0dXJlKTtcbiAgICAgIGlmICghbm9ybWFsaXplZCB8fCAhQXJyYXkuaXNBcnJheShub3JtYWxpemVkLmZlYXR1cmVzKSkge1xuICAgICAgICAvLyBmYWlsIHRvIG5vcm1hbGl6ZSBnZW9qc29uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBmZWF0dXJlID0gbm9ybWFsaXplZC5mZWF0dXJlc1swXTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBmZWF0dXJlICYmXG4gICAgICBmZWF0dXJlLmdlb21ldHJ5ICYmXG4gICAgICBhY2NlcHRhYmxlVHlwZXMuaW5jbHVkZXMoZmVhdHVyZS5nZW9tZXRyeS50eXBlKVxuICAgICkge1xuICAgICAgLy8gc3RvcmUgaW5kZXggb2YgdGhlIGRhdGEgaW4gZmVhdHVyZSBwcm9wZXJ0aWVzXG4gICAgICBmZWF0dXJlLnByb3BlcnRpZXMgPSB7XG4gICAgICAgIC4uLihmZWF0dXJlLnByb3BlcnRpZXMgfHwge30pLFxuICAgICAgICBpbmRleFxuICAgICAgfTtcblxuICAgICAgZGF0YVRvRmVhdHVyZVtpbmRleF0gPSBmZWF0dXJlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGFUb0ZlYXR1cmU7XG59XG5cbi8qKlxuICogUGFyc2UgZ2VvanNvbiBmcm9tIHN0cmluZ1xuICogQHBhcmFtIHtTdHJpbmd9IGdlb1N0cmluZ1xuICogQHJldHVybnMge251bGwgfCBPYmplY3R9IGdlb2pzb24gb2JqZWN0IG9yIG51bGwgaWYgZmFpbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdlb21ldHJ5RnJvbVN0cmluZyhnZW9TdHJpbmcpIHtcbiAgbGV0IHBhcnNlZEdlbztcblxuICAvLyB0cnkgcGFyc2UgYXMgZ2VvanNvbiBzdHJpbmdcbiAgLy8ge1widHlwZVwiOlwiUG9seWdvblwiLFwiY29vcmRpbmF0ZXNcIjpbW1stNzQuMTU4NDkxLDQwLjgzNTk0XV1dfVxuICB0cnkge1xuICAgIHBhcnNlZEdlbyA9IEpTT04ucGFyc2UoZ2VvU3RyaW5nKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGtlZXAgdHJ5aW5nIHRvIHBhcnNlXG4gIH1cblxuICAvLyB0cnkgcGFyc2UgYXMgd2t0XG4gIGlmICghcGFyc2VkR2VvKSB7XG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZEdlbyA9IHdrdFBhcnNlcihnZW9TdHJpbmcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmICghcGFyc2VkR2VvKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHBhcnNlZEdlbyk7XG5cbiAgaWYgKCFub3JtYWxpemVkIHx8ICFBcnJheS5pc0FycmF5KG5vcm1hbGl6ZWQuZmVhdHVyZXMpKSB7XG4gICAgLy8gZmFpbCB0byBub3JtYWxpemUgZ2VvanNvblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWQuZmVhdHVyZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW9qc29uQm91bmRzKGZlYXR1cmVzID0gW10pIHtcbiAgLy8gY2FsY3VsYXRlIGZlYXR1cmUgYm91bmRzIGlzIGNvbXB1dGF0aW9uIGhlYXZ5XG4gIC8vIGhlcmUgd2Ugb25seSBwaWNrIGNvdXBsZVxuICBjb25zdCBzYW1wbGVzID1cbiAgICBmZWF0dXJlcy5sZW5ndGggPiA1MDAgPyBnZXRTYW1wbGVEYXRhKGZlYXR1cmVzLCA1MDApIDogZmVhdHVyZXM7XG5cbiAgY29uc3Qgbm9uRW1wdHkgPSBzYW1wbGVzLmZpbHRlcihcbiAgICBkID0+XG4gICAgICBkICYmIGQuZ2VvbWV0cnkgJiYgZC5nZW9tZXRyeS5jb29yZGluYXRlcyAmJiBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aFxuICApO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGdlb2pzb25FeHRlbnQoe1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBub25FbXB0eVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZlYXR1cmVUb0RlY2tHbEdlb1R5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgICByZXR1cm4gJ3BvaW50JztcblxuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICByZXR1cm4gJ2xpbmUnO1xuXG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIHJldHVybiAncG9seWdvbic7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==