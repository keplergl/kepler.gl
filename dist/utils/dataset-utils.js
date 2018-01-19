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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhc2V0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZU5ld0RhdGFFbnRyeSIsInJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMiLCJmaW5kUG9pbnRGaWVsZFBhaXJzIiwiZ2VuZXJhdGVDb2xvciIsImRhdGFzZXRDb2xvcnMiLCJtYXAiLCJpbmRleCIsImxlbmd0aCIsImRhdGFzZXRDb2xvck1ha2VyIiwiZ2V0TmV3RGF0YXNldENvbG9yIiwiZGF0YXNldHMiLCJwcmVzZXRDb2xvcnMiLCJTdHJpbmciLCJ1c2VkQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwiZCIsImNvbG9yIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJjIiwibmV4dCIsInZhbHVlIiwiaW5mbyIsImRhdGEiLCJ2YWxpZGF0ZWREYXRhIiwiYWxsRGF0YSIsInJvd3MiLCJkYXRhc2V0SW5mbyIsImlkIiwibGFiZWwiLCJkYXRhSWQiLCJmaWVsZHMiLCJmIiwiaSIsIm5hbWUiLCJ0YWJsZUZpZWxkSW5kZXgiLCJzbGljZSIsImZpbHRlcmVkSW5kZXgiLCJfIiwiZmllbGRQYWlycyIsImxheWVyTmFtZSIsInN1ZmZpeCIsInJlcGxhY2UiLCJSZWdFeHAiLCJ0cmltIiwiYWxsTmFtZXMiLCJ0b0xvd2VyQ2FzZSIsInJlZHVjZSIsImNhcnJ5IiwiZmllbGROYW1lIiwiaWR4Iiwic3VmZml4UGFpciIsImVuZHNXaXRoIiwib3RoZXJQYXR0ZXJuIiwicGFydG5lciIsInBhcnRuZXJJZHgiLCJmaW5kSW5kZXgiLCJkZWZhdWx0TmFtZSIsInB1c2giLCJwYWlyIiwibGF0IiwiZmllbGRJZHgiLCJsbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFxRGdCQSxrQixHQUFBQSxrQjtRQXNDQUMseUIsR0FBQUEseUI7UUFhQUMsbUIsR0FBQUEsbUI7O0FBeEdoQjs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O3NEQWlCVUMsYTs7QUFmVjtBQUNBO0FB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LE9BQU9tQixHQUFQLEVBQVloQjtBQUZoQixpQkFERDtBQUtKNEIscUJBQUs7QUFDSEQsNEJBQVVOLFVBRFA7QUFFSGxDLHlCQUFPVSxPQUFPd0IsVUFBUCxFQUFtQnJCO0FBRnZCO0FBTEQsZUFGRztBQVlUTyxzQkFBUVU7QUFaQyxhQUFYO0FBY0E7QUFBQSxpQkFBT0g7QUFBUDtBQUNEO0FBM0JvQzs7QUFBQTtBQTRCdEM7QUFDRjtBQUNELFdBQU9BLEtBQVA7QUFDRCxHQW5DTSxFQW1DSixFQW5DSSxDQUFQO0FBb0NEIiwiZmlsZSI6ImRhdGFzZXQtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hleFRvUmdifSBmcm9tICcuL2NvbG9yLXV0aWxzJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCB7VFJJUF9QT0lOVF9GSUVMRFN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHt2YWxpZGF0ZUlucHV0RGF0YX0gZnJvbSAnLi9kYXRhLXV0aWxzJztcblxuLy8gYXBwbHkgYSBjb2xvciBmb3IgZWFjaCBkYXRhc2V0XG4vLyB0byB1c2UgYXMgbGFiZWwgY29sb3JzXG5jb25zdCBkYXRhc2V0Q29sb3JzID0gW1xuICAnIzM1NUM3RCcsXG4gICcjNkM1QjdCJyxcbiAgJyNDMDZDODQnLFxuICAnI0Y4QjE5NScsXG4gICcjNTQ3QTgyJyxcbiAgJyMzRUFDQTgnLFxuICAnI0EyRDRBQidcbl0ubWFwKGhleFRvUmdiKTtcblxuLyoqXG4gKiBSYW5kb20gY29sb3IgZ2VuZXJhdG9yXG4gKi9cbmZ1bmN0aW9uKiBnZW5lcmF0ZUNvbG9yKCkge1xuICBsZXQgaW5kZXggPSAwO1xuICB3aGlsZSAoaW5kZXggPCBkYXRhc2V0Q29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IGRhdGFzZXRDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHlpZWxkIGRhdGFzZXRDb2xvcnNbaW5kZXgrK107XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRhdGFzZXRDb2xvck1ha2VyID0gZ2VuZXJhdGVDb2xvcigpO1xuXG5mdW5jdGlvbiBnZXROZXdEYXRhc2V0Q29sb3IoZGF0YXNldHMpIHtcbiAgY29uc3QgcHJlc2V0Q29sb3JzID0gZGF0YXNldENvbG9ycy5tYXAoU3RyaW5nKTtcblxuICBjb25zdCB1c2VkQ29sb3JzID0gdW5pcShcbiAgICBPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoZCA9PiBTdHJpbmcoZC5jb2xvcikpXG4gICkuZmlsdGVyKGMgPT4gcHJlc2V0Q29sb3JzLmluY2x1ZGVzKGMpKTtcblxuICBpZiAodXNlZENvbG9ycy5sZW5ndGggPT09IHByZXNldENvbG9ycy5sZW5ndGgpIHtcbiAgICAvLyBpZiB3ZSBhbHJlYWR5IGRlcGxldGVkIHRoZSBwb29sIG9mIGNvbG9yXG4gICAgcmV0dXJuIGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgfVxuXG4gIGxldCBjb2xvciA9IGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgd2hpbGUgKHVzZWRDb2xvcnMuaW5jbHVkZXMoU3RyaW5nKGNvbG9yKSkpIHtcbiAgICBjb2xvciA9IGRhdGFzZXRDb2xvck1ha2VyLm5leHQoKS52YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5ld0RhdGFFbnRyeSh7aW5mbyA9IHt9LCBkYXRhfSwgZGF0YXNldHMpIHtcbiAgY29uc3QgdmFsaWRhdGVkRGF0YSA9IHZhbGlkYXRlSW5wdXREYXRhKGRhdGEpO1xuICBpZiAoIXZhbGlkYXRlZERhdGEpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCBhbGxEYXRhID0gdmFsaWRhdGVkRGF0YS5yb3dzO1xuICBjb25zdCBkYXRhc2V0SW5mbyA9IHtcbiAgICBpZDogZ2VuZXJhdGVIYXNoSWQoNCksXG4gICAgbGFiZWw6ICduZXcgZGF0YXNldCcsXG4gICAgLi4uaW5mb1xuICB9O1xuICBjb25zdCBkYXRhSWQgPSBkYXRhc2V0SW5mby5pZDtcblxuICAvLyBhZGQgdGFibGVGaWVsZEluZGV4IGFuZCBpZCB0byBmaWVsZHNcbiAgLy8gVE9ETzogZG9uJ3QgbmVlZCBpZCBhbmQgbmFtZSBhbmQgdGFibGVGaWVsZEluZGV4IGFueW1vcmVcbiAgLy8gQWRkIHZhbHVlIGFjY2Vzc29yIGluc3RlYWRcbiAgY29uc3QgZmllbGRzID0gdmFsaWRhdGVkRGF0YS5maWVsZHMubWFwKChmLCBpKSA9PiAoe1xuICAgIC4uLmYsXG4gICAgaWQ6IGYubmFtZSxcbiAgICB0YWJsZUZpZWxkSW5kZXg6IGkgKyAxXG4gIH0pKTtcblxuICByZXR1cm4ge1xuICAgIFtkYXRhSWRdOiB7XG4gICAgICAuLi5kYXRhc2V0SW5mbyxcbiAgICAgIGNvbG9yOiBkYXRhc2V0SW5mby5jb2xvciB8fCBnZXROZXdEYXRhc2V0Q29sb3IoZGF0YXNldHMpLFxuICAgICAgaWQ6IGRhdGFJZCxcbiAgICAgIGFsbERhdGEsXG4gICAgICAvLyBUT0RPOiBubyBuZWVkIHRvIG1ha2UgYSBjb3B5IGFueW1vcmUsIG9ubHkgc2F2ZSBmaWVsZGVkSW5kZXhcbiAgICAgIGRhdGE6IGFsbERhdGEuc2xpY2UoKSxcbiAgICAgIGZpbHRlcmVkSW5kZXg6IGFsbERhdGEubWFwKChfLCBpKSA9PiBpKSxcbiAgICAgIGZpZWxkUGFpcnM6IGZpbmRQb2ludEZpZWxkUGFpcnMoZmllbGRzKSxcbiAgICAgIGZpZWxkc1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMobGF5ZXJOYW1lLCBzdWZmaXgpIHtcbiAgcmV0dXJuIGxheWVyTmFtZVxuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoc3VmZml4LCAnaWcnKSwgJycpXG4gICAgLnJlcGxhY2UoL1tfLC5dKy9nLCAnICcpXG4gICAgLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBGaW5kIHBvaW50IGZpZWxkcyBwYWlycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBwb2ludCBmaWVsZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQb2ludEZpZWxkUGFpcnMoZmllbGRzKSB7XG4gIGNvbnN0IGFsbE5hbWVzID0gZmllbGRzLm1hcChmID0+IGYubmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuICAvLyBnZXQgbGlzdCBvZiBhbGwgZmllbGRzIHdpdGggbWF0Y2hpbmcgc3VmZml4ZXNcbiAgcmV0dXJuIGFsbE5hbWVzLnJlZHVjZSgoY2FycnksIGZpZWxkTmFtZSwgaWR4KSA9PiB7XG4gICAgLy8gVGhpcyBzZWFyY2ggZm9yIHBhaXJzIHdpbGwgZWFybHkgZXhpdCBpZiBmb3VuZC5cbiAgICBmb3IgKGNvbnN0IHN1ZmZpeFBhaXIgb2YgVFJJUF9QT0lOVF9GSUVMRFMpIHtcbiAgICAgIC8vIG1hdGNoIGZpcnN0IHN1ZmZpeGBgYFxuICAgICAgaWYgKGZpZWxkTmFtZS5lbmRzV2l0aChzdWZmaXhQYWlyWzBdKSkge1xuICAgICAgICAvLyBtYXRjaCBzZWNvbmQgc3VmZml4XG4gICAgICAgIGNvbnN0IG90aGVyUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7c3VmZml4UGFpclswXX1cXCRgKTtcbiAgICAgICAgY29uc3QgcGFydG5lciA9IGZpZWxkTmFtZS5yZXBsYWNlKG90aGVyUGF0dGVybiwgc3VmZml4UGFpclsxXSk7XG5cbiAgICAgICAgY29uc3QgcGFydG5lcklkeCA9IGFsbE5hbWVzLmZpbmRJbmRleChkID0+IGQgPT09IHBhcnRuZXIpO1xuICAgICAgICBpZiAocGFydG5lcklkeCA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdE5hbWUgPSByZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzKFxuICAgICAgICAgICAgZmllbGROYW1lLFxuICAgICAgICAgICAgc3VmZml4UGFpclswXVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjYXJyeS5wdXNoKHtcbiAgICAgICAgICAgIGRlZmF1bHROYW1lLFxuICAgICAgICAgICAgcGFpcjoge1xuICAgICAgICAgICAgICBsYXQ6IHtcbiAgICAgICAgICAgICAgICBmaWVsZElkeDogaWR4LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbaWR4XS5uYW1lXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGxuZzoge1xuICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBwYXJ0bmVySWR4LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbcGFydG5lcklkeF0ubmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VmZml4OiBzdWZmaXhQYWlyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYXJyeTtcbiAgfSwgW10pO1xufVxuIl19