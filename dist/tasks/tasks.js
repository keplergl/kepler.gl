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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90YXNrcy90YXNrcy5qcyJdLCJuYW1lcyI6WyJMT0FEX0JVSUxESU5HX1RJTEVfVEFTSyIsInN1Y2Nlc3MiLCJlcnJvciIsIngiLCJ5IiwieiIsImZlYXR1cmVzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJqc29uIiwiZXJyIiwicmVzdWx0IiwiY2xlYW5lZCIsImZpbHRlciIsImYiLCJnZW9tZXRyeSIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiaGVpZ2h0IiwidGhlbiIsImxvYWRlZCIsIkxPQURfRklMRV9UQVNLIiwiZmlsZUJsb2IiLCJpbmZvIiwiaGFuZGxlciIsInByb2Nlc3NvciIsIkVycm9yIiwiZGF0YSIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7QUFHTyxJQUFNQSw0REFBMEIsd0JBQ3JDLGdCQUFzQkMsT0FBdEIsRUFBK0JDLEtBQS9CO0FBQUEsTUFBRUMsQ0FBRixRQUFFQSxDQUFGO0FBQUEsTUFBS0MsQ0FBTCxRQUFLQSxDQUFMO0FBQUEsTUFBUUMsQ0FBUixRQUFRQSxDQUFSO0FBQUEsTUFBV0MsUUFBWCxRQUFXQSxRQUFYO0FBQUEsU0FDRSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQy9CLFFBQUlILFFBQUosRUFBYztBQUNaRSxjQUFRRixRQUFSO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsMEJBQVFJLElBQVIsQ0FBYSw4QkFBWVAsQ0FBWixFQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixDQUFiLEVBQW1DLFVBQUNNLEdBQUQsRUFBTUMsTUFBTixFQUFpQjtBQUNsRCxZQUFJRCxHQUFKLEVBQVM7QUFDUFQsZ0JBQU1TLEdBQU47QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDQyxPQUFPTixRQUFaLEVBQXNCO0FBQzNCRSxrQkFBUSxJQUFSO0FBQ0QsU0FGTSxNQUVBOztBQUVMLGNBQU1LLFVBQVVELE9BQU9OLFFBQVAsQ0FBZ0JRLE1BQWhCLENBQXVCO0FBQUEsbUJBQ3JDLENBQUNDLEVBQUVDLFFBQUYsQ0FBV0MsSUFBWCxLQUFvQixTQUFwQixJQUFpQ0YsRUFBRUMsUUFBRixDQUFXQyxJQUFYLEtBQW9CLGNBQXRELEtBQXlFRixFQUFFRyxVQUFGLENBQWFDLE1BRGpEO0FBQUEsV0FBdkIsQ0FBaEI7O0FBSUFYLGtCQUFRSyxPQUFSO0FBQ0Q7QUFDRixPQWJEO0FBY0Q7QUFDRixHQW5CRCxFQW1CR08sSUFuQkgsQ0FtQlE7QUFBQSxXQUFVbkIsUUFBUW9CLE1BQVIsQ0FBVjtBQUFBLEdBbkJSLENBREY7QUFBQSxDQURxQyxFQXVCckMseUJBdkJxQyxDQUFoQzs7QUEwQkEsSUFBTUMsMENBQWlCLHdCQUM1QixpQkFBdUNyQixPQUF2QyxFQUFnREMsS0FBaEQ7QUFBQSxNQUFFcUIsUUFBRixTQUFFQSxRQUFGO0FBQUEsTUFBWUMsSUFBWixTQUFZQSxJQUFaO0FBQUEsTUFBa0JDLE9BQWxCLFNBQWtCQSxPQUFsQjtBQUFBLE1BQTJCQyxTQUEzQixTQUEyQkEsU0FBM0I7QUFBQSxTQUNFRCxRQUFRRixRQUFSLEVBQWtCRyxTQUFsQixFQUE2Qk4sSUFBN0IsQ0FBa0Msa0JBQVU7QUFDMUMsUUFBSSxDQUFDUixNQUFMLEVBQWE7QUFDWCxZQUFNLElBQUllLEtBQUosQ0FBVSxtQkFBVixDQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0wxQixjQUFRLEVBQUMyQixNQUFNaEIsTUFBUCxFQUFlWSxVQUFmLEVBQVI7QUFDRDtBQUNGLEdBTkQsRUFPR0ssS0FQSCxDQU9TO0FBQUEsV0FBTzNCLE1BQU1TLEdBQU4sQ0FBUDtBQUFBLEdBUFQsQ0FERjtBQUFBLENBRDRCLEVBVzVCLGdCQVg0QixDQUF2QiIsImZpbGUiOiJ0YXNrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dGFza0NyZWF0b3J9IGZyb20gJ3JlYWN0LXBhbG0vdGFza3MnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnZDMtcmVxdWVzdCc7XG5pbXBvcnQge2dldFF1ZXJ5VVJMfSBmcm9tICcuLi91dGlscy9tYXB6ZW4tdXRpbHMnO1xuXG4vKlxuICogcmVxdWVzdCB2ZWN0b3IgYnVpbGRpbmcgdGlsZSBmcm9tIE1hcHplblxuICovXG5leHBvcnQgY29uc3QgTE9BRF9CVUlMRElOR19USUxFX1RBU0sgPSB0YXNrQ3JlYXRvcihcbiAgKHt4LCB5LCB6LCBmZWF0dXJlc30sIHN1Y2Nlc3MsIGVycm9yKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChmZWF0dXJlcykge1xuICAgICAgICByZXNvbHZlKGZlYXR1cmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QuanNvbihnZXRRdWVyeVVSTCh4LCB5LCB6KSwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZXJyb3IoZXJyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFyZXN1bHQuZmVhdHVyZXMpIHtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IHJlc3VsdC5mZWF0dXJlcy5maWx0ZXIoZiA9PlxuICAgICAgICAgICAgICAoZi5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicgfHwgZi5nZW9tZXRyeS50eXBlID09PSAnTXVsdGlQb2x5Z29uJykgJiYgZi5wcm9wZXJ0aWVzLmhlaWdodFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShjbGVhbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLnRoZW4obG9hZGVkID0+IHN1Y2Nlc3MobG9hZGVkKSksXG5cbiAgJ0xPQURfQlVJTERJTkdfVElMRV9UQVNLJ1xuKTtcblxuZXhwb3J0IGNvbnN0IExPQURfRklMRV9UQVNLID0gdGFza0NyZWF0b3IoXG4gICh7ZmlsZUJsb2IsIGluZm8sIGhhbmRsZXIsIHByb2Nlc3Nvcn0sIHN1Y2Nlc3MsIGVycm9yKSA9PlxuICAgIGhhbmRsZXIoZmlsZUJsb2IsIHByb2Nlc3NvcikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsIHRvIGxvYWQgZGF0YScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWNjZXNzKHtkYXRhOiByZXN1bHQsIGluZm99KTtcbiAgICAgIH1cbiAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiBlcnJvcihlcnIpKSxcblxuICAnTE9BRF9GSUxFX1RBU0snXG4pO1xuIl19