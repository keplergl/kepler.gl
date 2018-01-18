'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datasetColorMaker = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.createNewDataEntry = createNewDataEntry;
exports.removeSuffixAndDelimiters = removeSuffixAndDelimiters;
exports.findPointFieldPairs = findPointFieldPairs;

var _colorUtils = require('./color-utils');

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultSettings = require('../constants/default-settings');

var _utils = require('./utils');

var _dataUtils = require('./data-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(generateColor);

// apply a color for each dataset
// to use as label colors
var datasetColors = ['#355C7D', '#6C5B7B', '#C06C84', '#F8B195', '#547A82', '#3EACA8', '#A2D4AB'].map(_colorUtils.hexToRgb);

/**
 * Random color generator
 */
function generateColor() {
  var index;
  return _regenerator2.default.wrap(function generateColor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < datasetColors.length + 1)) {
            _context.next = 7;
            break;
          }

          if (index === datasetColors.length) {
            index = 0;
          }
          _context.next = 5;
          return datasetColors[index++];

        case 5:
          _context.next = 1;
          break;

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

var datasetColorMaker = exports.datasetColorMaker = generateColor();

function getNewDatasetColor(datasets) {
  var presetColors = datasetColors.map(String);

  var usedColors = (0, _lodash2.default)(Object.values(datasets).map(function (d) {
    return String(d.color);
  })).filter(function (c) {
    return presetColors.includes(c);
  });

  if (usedColors.length === presetColors.length) {
    // if we already depleted the pool of color
    return datasetColorMaker.next().value;
  }

  var color = datasetColorMaker.next().value;
  while (usedColors.includes(String(color))) {
    color = datasetColorMaker.next().value;
  }

  return color;
}

function createNewDataEntry(_ref, datasets) {
  var _ref2;

  var _ref$info = _ref.info,
      info = _ref$info === undefined ? {} : _ref$info,
      data = _ref.data;


  var validatedData = (0, _dataUtils.validateInputData)(data);
  if (!validatedData) {
    return {};
  }

  var allData = validatedData.rows;
  var datasetInfo = (0, _extends3.default)({
    id: (0, _utils.generateHashId)(4),
    label: 'new dataset'
  }, info);
  var dataId = datasetInfo.id;

  // add tableFieldIndex and id to fields
  // TODO: don't need id and name and tableFieldIndex anymore
  // Add value accessor instead
  var fields = validatedData.fields.map(function (f, i) {
    return (0, _extends3.default)({}, f, {
      id: f.name,
      tableFieldIndex: i + 1
    });
  });

  return _ref2 = {}, _ref2[dataId] = (0, _extends3.default)({}, datasetInfo, {
    color: datasetInfo.color || getNewDatasetColor(datasets),
    id: dataId,
    allData: allData,
    // TODO: no need to make a copy anymore, only save fieldedIndex
    data: allData.slice(),
    filteredIndex: allData.map(function (_, i) {
      return i;
    }),
    fieldPairs: findPointFieldPairs(fields),
    fields: fields
  }), _ref2;
}

function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName.replace(new RegExp(suffix, 'ig'), '').replace(/[_,.]+/g, ' ').trim();
}

/**
 * Find point fields pairs from fields
 *
 * @param {Array} fields
 * @returns {Array} found point fields
 */
function findPointFieldPairs(fields) {
  var allNames = fields.map(function (f) {
    return f.name.toLowerCase();
  });

  // get list of all fields with matching suffixes
  return allNames.reduce(function (carry, fieldName, idx) {
    // This search for pairs will early exit if found.
    for (var _iterator = _defaultSettings.TRIP_POINT_FIELDS, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref3 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref3 = _i.value;
      }

      var suffixPair = _ref3;

      // match first suffix```
      if (fieldName.endsWith(suffixPair[0])) {
        var _ret = function () {
          // match second suffix
          var otherPattern = new RegExp(suffixPair[0] + '$');
          var partner = fieldName.replace(otherPattern, suffixPair[1]);

          var partnerIdx = allNames.findIndex(function (d) {
            return d === partner;
          });
          if (partnerIdx > -1) {
            var defaultName = removeSuffixAndDelimiters(fieldName, suffixPair[0]);

            carry.push({
              defaultName: defaultName,
              pair: {
                lat: {
                  fieldIdx: idx,
                  value: fields[idx].name
                },
                lng: {
                  fieldIdx: partnerIdx,
                  value: fields[partnerIdx].name
                }
              },
              suffix: suffixPair
            });
            return {
              v: carry
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
      }
    }
    return carry;
  }, []);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhc2V0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZU5ld0RhdGFFbnRyeSIsInJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMiLCJmaW5kUG9pbnRGaWVsZFBhaXJzIiwiZ2VuZXJhdGVDb2xvciIsImRhdGFzZXRDb2xvcnMiLCJtYXAiLCJpbmRleCIsImxlbmd0aCIsImRhdGFzZXRDb2xvck1ha2VyIiwiZ2V0TmV3RGF0YXNldENvbG9yIiwiZGF0YXNldHMiLCJwcmVzZXRDb2xvcnMiLCJTdHJpbmciLCJ1c2VkQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwiZCIsImNvbG9yIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJjIiwibmV4dCIsInZhbHVlIiwiaW5mbyIsImRhdGEiLCJ2YWxpZGF0ZWREYXRhIiwiYWxsRGF0YSIsInJvd3MiLCJkYXRhc2V0SW5mbyIsImlkIiwibGFiZWwiLCJkYXRhSWQiLCJmaWVsZHMiLCJmIiwiaSIsIm5hbWUiLCJ0YWJsZUZpZWxkSW5kZXgiLCJzbGljZSIsImZpbHRlcmVkSW5kZXgiLCJfIiwiZmllbGRQYWlycyIsImxheWVyTmFtZSIsInN1ZmZpeCIsInJlcGxhY2UiLCJSZWdFeHAiLCJ0cmltIiwiYWxsTmFtZXMiLCJ0b0xvd2VyQ2FzZSIsInJlZHVjZSIsImNhcnJ5IiwiZmllbGROYW1lIiwiaWR4Iiwic3VmZml4UGFpciIsImVuZHNXaXRoIiwib3RoZXJQYXR0ZXJuIiwicGFydG5lciIsInBhcnRuZXJJZHgiLCJmaW5kSW5kZXgiLCJkZWZhdWx0TmFtZSIsInB1c2giLCJwYWlyIiwibGF0IiwiZmllbGRJZHgiLCJsbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFvRGdCQSxrQixHQUFBQSxrQjtRQXVDQUMseUIsR0FBQUEseUI7UUFhQUMsbUIsR0FBQUEsbUI7O0FBeEdoQjs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O3NEQWlCVUMsYTs7QUFmVjtBQUNBO0FB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T0FBT21CLEdBQVAsRUFBWWhCO0FBRmhCLGlCQUREO0FBS0o0QixxQkFBSztBQUNIRCw0QkFBVU4sVUFEUDtBQUVIbEMseUJBQU9VLE9BQU93QixVQUFQLEVBQW1CckI7QUFGdkI7QUFMRCxlQUZHO0FBWVRPLHNCQUFRVTtBQVpDLGFBQVg7QUFjQTtBQUFBLGlCQUFPSDtBQUFQO0FBQ0Q7QUEzQm9DOztBQUFBO0FBNEJ0QztBQUNGO0FBQ0QsV0FBT0EsS0FBUDtBQUNELEdBbkNNLEVBbUNKLEVBbkNJLENBQVA7QUFvQ0QiLCJmaWxlIjoiZGF0YXNldC11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4vY29sb3ItdXRpbHMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHtUUklQX1BPSU5UX0ZJRUxEU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7dmFsaWRhdGVJbnB1dERhdGF9IGZyb20gJy4vZGF0YS11dGlscyc7XG5cbi8vIGFwcGx5IGEgY29sb3IgZm9yIGVhY2ggZGF0YXNldFxuLy8gdG8gdXNlIGFzIGxhYmVsIGNvbG9yc1xuY29uc3QgZGF0YXNldENvbG9ycyA9IFtcbiAgJyMzNTVDN0QnLFxuICAnIzZDNUI3QicsXG4gICcjQzA2Qzg0JyxcbiAgJyNGOEIxOTUnLFxuICAnIzU0N0E4MicsXG4gICcjM0VBQ0E4JyxcbiAgJyNBMkQ0QUInXG5dLm1hcChoZXhUb1JnYik7XG5cbi8qKlxuICogUmFuZG9tIGNvbG9yIGdlbmVyYXRvclxuICovXG5mdW5jdGlvbiogZ2VuZXJhdGVDb2xvcigpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgd2hpbGUgKGluZGV4IDwgZGF0YXNldENvbG9ycy5sZW5ndGggKyAxKSB7XG4gICAgaWYgKGluZGV4ID09PSBkYXRhc2V0Q29sb3JzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICB5aWVsZCBkYXRhc2V0Q29sb3JzW2luZGV4KytdO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkYXRhc2V0Q29sb3JNYWtlciA9IGdlbmVyYXRlQ29sb3IoKTtcblxuZnVuY3Rpb24gZ2V0TmV3RGF0YXNldENvbG9yKGRhdGFzZXRzKSB7XG4gIGNvbnN0IHByZXNldENvbG9ycyA9IGRhdGFzZXRDb2xvcnMubWFwKFN0cmluZyk7XG5cbiAgY29uc3QgdXNlZENvbG9ycyA9IHVuaXEoT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKGQgPT4gU3RyaW5nKGQuY29sb3IpKSlcbiAgICAuZmlsdGVyKGMgPT4gcHJlc2V0Q29sb3JzLmluY2x1ZGVzKGMpKTtcblxuICBpZiAodXNlZENvbG9ycy5sZW5ndGggPT09IHByZXNldENvbG9ycy5sZW5ndGgpIHtcbiAgICAvLyBpZiB3ZSBhbHJlYWR5IGRlcGxldGVkIHRoZSBwb29sIG9mIGNvbG9yXG4gICAgcmV0dXJuIGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgfVxuXG4gIGxldCBjb2xvciA9IGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgd2hpbGUgKHVzZWRDb2xvcnMuaW5jbHVkZXMoU3RyaW5nKGNvbG9yKSkpIHtcbiAgICBjb2xvciA9IGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld0RhdGFFbnRyeSh7aW5mbyA9IHt9LCBkYXRhfSwgZGF0YXNldHMpIHtcblxuICBjb25zdCB2YWxpZGF0ZWREYXRhID0gdmFsaWRhdGVJbnB1dERhdGEoZGF0YSk7XG4gIGlmICghdmFsaWRhdGVkRGF0YSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IGFsbERhdGEgPSB2YWxpZGF0ZWREYXRhLnJvd3M7XG4gIGNvbnN0IGRhdGFzZXRJbmZvID0ge1xuICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICBsYWJlbDogJ25ldyBkYXRhc2V0JyxcbiAgICAuLi5pbmZvXG4gIH07XG4gIGNvbnN0IGRhdGFJZCA9IGRhdGFzZXRJbmZvLmlkO1xuXG4gIC8vIGFkZCB0YWJsZUZpZWxkSW5kZXggYW5kIGlkIHRvIGZpZWxkc1xuICAvLyBUT0RPOiBkb24ndCBuZWVkIGlkIGFuZCBuYW1lIGFuZCB0YWJsZUZpZWxkSW5kZXggYW55bW9yZVxuICAvLyBBZGQgdmFsdWUgYWNjZXNzb3IgaW5zdGVhZFxuICBjb25zdCBmaWVsZHMgPSB2YWxpZGF0ZWREYXRhLmZpZWxkcy5tYXAoKGYsIGkpID0+ICh7XG4gICAgLi4uZixcbiAgICBpZDogZi5uYW1lLFxuICAgIHRhYmxlRmllbGRJbmRleDogaSArIDFcbiAgfSkpO1xuXG4gIHJldHVybiB7XG4gICAgW2RhdGFJZF06IHtcbiAgICAgIC4uLmRhdGFzZXRJbmZvLFxuICAgICAgY29sb3I6IGRhdGFzZXRJbmZvLmNvbG9yIHx8IGdldE5ld0RhdGFzZXRDb2xvcihkYXRhc2V0cyksXG4gICAgICBpZDogZGF0YUlkLFxuICAgICAgYWxsRGF0YSxcbiAgICAgIC8vIFRPRE86IG5vIG5lZWQgdG8gbWFrZSBhIGNvcHkgYW55bW9yZSwgb25seSBzYXZlIGZpZWxkZWRJbmRleFxuICAgICAgZGF0YTogYWxsRGF0YS5zbGljZSgpLFxuICAgICAgZmlsdGVyZWRJbmRleDogYWxsRGF0YS5tYXAoKF8sIGkpID0+IGkpLFxuICAgICAgZmllbGRQYWlyczogZmluZFBvaW50RmllbGRQYWlycyhmaWVsZHMpLFxuICAgICAgZmllbGRzXG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU3VmZml4QW5kRGVsaW1pdGVycyhsYXllck5hbWUsIHN1ZmZpeCkge1xuICByZXR1cm4gbGF5ZXJOYW1lXG4gICAgLnJlcGxhY2UobmV3IFJlZ0V4cChzdWZmaXgsICdpZycpLCAnJylcbiAgICAucmVwbGFjZSgvW18sLl0rL2csICcgJylcbiAgICAudHJpbSgpO1xufVxuXG4vKipcbiAqIEZpbmQgcG9pbnQgZmllbGRzIHBhaXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIHBvaW50IGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFBvaW50RmllbGRQYWlycyhmaWVsZHMpIHtcbiAgY29uc3QgYWxsTmFtZXMgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuXG4gIC8vIGdldCBsaXN0IG9mIGFsbCBmaWVsZHMgd2l0aCBtYXRjaGluZyBzdWZmaXhlc1xuICByZXR1cm4gYWxsTmFtZXMucmVkdWNlKChjYXJyeSwgZmllbGROYW1lLCBpZHgpID0+IHtcbiAgICAvLyBUaGlzIHNlYXJjaCBmb3IgcGFpcnMgd2lsbCBlYXJseSBleGl0IGlmIGZvdW5kLlxuICAgIGZvciAoY29uc3Qgc3VmZml4UGFpciBvZiBUUklQX1BPSU5UX0ZJRUxEUykge1xuICAgICAgLy8gbWF0Y2ggZmlyc3Qgc3VmZml4YGBgXG4gICAgICBpZiAoZmllbGROYW1lLmVuZHNXaXRoKHN1ZmZpeFBhaXJbMF0pKSB7XG4gICAgICAgIC8vIG1hdGNoIHNlY29uZCBzdWZmaXhcbiAgICAgICAgY29uc3Qgb3RoZXJQYXR0ZXJuID0gbmV3IFJlZ0V4cChgJHtzdWZmaXhQYWlyWzBdfVxcJGApO1xuICAgICAgICBjb25zdCBwYXJ0bmVyID0gZmllbGROYW1lLnJlcGxhY2Uob3RoZXJQYXR0ZXJuLCBzdWZmaXhQYWlyWzFdKTtcblxuICAgICAgICBjb25zdCBwYXJ0bmVySWR4ID0gYWxsTmFtZXMuZmluZEluZGV4KGQgPT4gZCA9PT0gcGFydG5lcik7XG4gICAgICAgIGlmIChwYXJ0bmVySWR4ID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IHJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMoXG4gICAgICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgICAgICBzdWZmaXhQYWlyWzBdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNhcnJ5LnB1c2goe1xuICAgICAgICAgICAgZGVmYXVsdE5hbWUsXG4gICAgICAgICAgICBwYWlyOiB7XG4gICAgICAgICAgICAgIGxhdDoge1xuICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBpZHgsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1tpZHhdLm5hbWVcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbG5nOiB7XG4gICAgICAgICAgICAgICAgZmllbGRJZHg6IHBhcnRuZXJJZHgsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1twYXJ0bmVySWR4XS5uYW1lXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFBhaXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gY2Fycnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhcnJ5O1xuICB9LCBbXSk7XG59XG4iXX0=