'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOAD_FILE_TASK = exports.LOAD_BUILDING_TILE_TASK = undefined;

var _tasks = require('react-palm/tasks');

var _d3Request = require('d3-request');

var _d3Request2 = _interopRequireDefault(_d3Request);

var _mapzenUtils = require('../utils/mapzen-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * request vector building tile from Mapzen
 */
var LOAD_BUILDING_TILE_TASK = exports.LOAD_BUILDING_TILE_TASK = (0, _tasks.taskCreator)(function (_ref, success, error) {
  var x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      features = _ref.features;
  return new Promise(function (resolve, reject) {
    if (features) {
      resolve(features);
    } else {
      _d3Request2.default.json((0, _mapzenUtils.getQueryURL)(x, y, z), function (err, result) {
        if (err) {
          error(err);
        } else if (!result.features) {
          resolve(null);
        } else {
          var cleaned = result.features.filter(function (f) {
            return (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') && f.properties.height;
          });

          resolve(cleaned);
        }
      });
    }
  }).then(function (loaded) {
    return success(loaded);
  });
}, 'LOAD_BUILDING_TILE_TASK');

var LOAD_FILE_TASK = exports.LOAD_FILE_TASK = (0, _tasks.taskCreator)(function (_ref2, success, error) {
  var fileBlob = _ref2.fileBlob,
      info = _ref2.info,
      handler = _ref2.handler,
      processor = _ref2.processor;
  return handler(fileBlob, processor).then(function (result) {
    if (!result) {
      throw new Error('fail to load data');
    } else {
      success({ data: result, info: info });
    }
  }).catch(function (err) {
    return error(err);
  });
}, 'LOAD_FILE_TASK');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90YXNrcy90YXNrcy5qcyJdLCJuYW1lcyI6WyJMT0FEX0JVSUxESU5HX1RJTEVfVEFTSyIsInN1Y2Nlc3MiLCJlcnJvciIsIngiLCJ5IiwieiIsImZlYXR1cmVzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJqc29uIiwiZXJyIiwicmVzdWx0IiwiY2xlYW5lZCIsImZpbHRlciIsImYiLCJnZW9tZXRyeSIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiaGVpZ2h0IiwidGhlbiIsImxvYWRlZCIsIkxPQURfRklMRV9UQVNLIiwiZmlsZUJsb2IiLCJpbmZvIiwiaGFuZGxlciIsInByb2Nlc3NvciIsIkVycm9yIiwiZGF0YSIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7QUFHTyxJQUFNQSw0REFBMEIsd0JBQ3JDLGdCQUFzQkMsT0FBdEIsRUFBK0JDLEtBQS9CO0FBQUEsTUFBRUMsQ0FBRixRQUFFQSxDQUFGO0FBQUEsTUFBS0MsQ0FBTCxRQUFLQSxDQUFMO0FBQUEsTUFBUUMsQ0FBUixRQUFRQSxDQUFSO0FBQUEsTUFBV0MsUUFBWCxRQUFXQSxRQUFYO0FBQUEsU0FDRSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQy9CLFFBQUlILFFBQUosRUFBYztBQUNaRSxjQUFRRixRQUFSO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsMEJBQVFJLElBQVIsQ0FBYSw4QkFBWVAsQ0FBWixFQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixDQUFiLEVBQW1DLFVBQUNNLEdBQUQsRUFBTUMsTUFBTixFQUFpQjtBQUNsRCxZQUFJRCxHQUFKLEVBQVM7QUFDUFQsZ0JBQU1TLEdBQU47QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDQyxPQUFPTixRQUFaLEVBQXNCO0FBQzNCRSxrQkFBUSxJQUFSO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsY0FBTUssVUFBVUQsT0FBT04sUUFBUCxDQUFnQlEsTUFBaEIsQ0FDZDtBQUFBLG1CQUNFLENBQUNDLEVBQUVDLFFBQUYsQ0FBV0MsSUFBWCxLQUFvQixTQUFwQixJQUNDRixFQUFFQyxRQUFGLENBQVdDLElBQVgsS0FBb0IsY0FEdEIsS0FFQUYsRUFBRUcsVUFBRixDQUFhQyxNQUhmO0FBQUEsV0FEYyxDQUFoQjs7QUFPQVgsa0JBQVFLLE9BQVI7QUFDRDtBQUNGLE9BZkQ7QUFnQkQ7QUFDRixHQXJCRCxFQXFCR08sSUFyQkgsQ0FxQlE7QUFBQSxXQUFVbkIsUUFBUW9CLE1BQVIsQ0FBVjtBQUFBLEdBckJSLENBREY7QUFBQSxDQURxQyxFQXlCckMseUJBekJxQyxDQUFoQzs7QUE0QkEsSUFBTUMsMENBQWlCLHdCQUM1QixpQkFBdUNyQixPQUF2QyxFQUFnREMsS0FBaEQ7QUFBQSxNQUFFcUIsUUFBRixTQUFFQSxRQUFGO0FBQUEsTUFBWUMsSUFBWixTQUFZQSxJQUFaO0FBQUEsTUFBa0JDLE9BQWxCLFNBQWtCQSxPQUFsQjtBQUFBLE1BQTJCQyxTQUEzQixTQUEyQkEsU0FBM0I7QUFBQSxTQUNFRCxRQUFRRixRQUFSLEVBQWtCRyxTQUFsQixFQUNHTixJQURILENBQ1Esa0JBQVU7QUFDZCxRQUFJLENBQUNSLE1BQUwsRUFBYTtBQUNYLFlBQU0sSUFBSWUsS0FBSixDQUFVLG1CQUFWLENBQU47QUFDRCxLQUZELE1BRU87QUFDTDFCLGNBQVEsRUFBQzJCLE1BQU1oQixNQUFQLEVBQWVZLFVBQWYsRUFBUjtBQUNEO0FBQ0YsR0FQSCxFQVFHSyxLQVJILENBUVM7QUFBQSxXQUFPM0IsTUFBTVMsR0FBTixDQUFQO0FBQUEsR0FSVCxDQURGO0FBQUEsQ0FENEIsRUFZNUIsZ0JBWjRCLENBQXZCIiwiZmlsZSI6InRhc2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt0YXNrQ3JlYXRvcn0gZnJvbSAncmVhY3QtcGFsbS90YXNrcyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdkMy1yZXF1ZXN0JztcbmltcG9ydCB7Z2V0UXVlcnlVUkx9IGZyb20gJ3V0aWxzL21hcHplbi11dGlscyc7XG5cbi8qXG4gKiByZXF1ZXN0IHZlY3RvciBidWlsZGluZyB0aWxlIGZyb20gTWFwemVuXG4gKi9cbmV4cG9ydCBjb25zdCBMT0FEX0JVSUxESU5HX1RJTEVfVEFTSyA9IHRhc2tDcmVhdG9yKFxuICAoe3gsIHksIHosIGZlYXR1cmVzfSwgc3VjY2VzcywgZXJyb3IpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKGZlYXR1cmVzKSB7XG4gICAgICAgIHJlc29sdmUoZmVhdHVyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdC5qc29uKGdldFF1ZXJ5VVJMKHgsIHksIHopLCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvcihlcnIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXJlc3VsdC5mZWF0dXJlcykge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IHJlc3VsdC5mZWF0dXJlcy5maWx0ZXIoXG4gICAgICAgICAgICAgIGYgPT5cbiAgICAgICAgICAgICAgICAoZi5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicgfHxcbiAgICAgICAgICAgICAgICAgIGYuZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9seWdvbicpICYmXG4gICAgICAgICAgICAgICAgZi5wcm9wZXJ0aWVzLmhlaWdodFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShjbGVhbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLnRoZW4obG9hZGVkID0+IHN1Y2Nlc3MobG9hZGVkKSksXG5cbiAgJ0xPQURfQlVJTERJTkdfVElMRV9UQVNLJ1xuKTtcblxuZXhwb3J0IGNvbnN0IExPQURfRklMRV9UQVNLID0gdGFza0NyZWF0b3IoXG4gICh7ZmlsZUJsb2IsIGluZm8sIGhhbmRsZXIsIHByb2Nlc3Nvcn0sIHN1Y2Nlc3MsIGVycm9yKSA9PlxuICAgIGhhbmRsZXIoZmlsZUJsb2IsIHByb2Nlc3NvcilcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsIHRvIGxvYWQgZGF0YScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2Nlc3Moe2RhdGE6IHJlc3VsdCwgaW5mb30pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiBlcnJvcihlcnIpKSxcblxuICAnTE9BRF9GSUxFX1RBU0snXG4pO1xuIl19