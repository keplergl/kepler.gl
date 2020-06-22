"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewDataEntry = createNewDataEntry;
exports.removeSuffixAndDelimiters = removeSuffixAndDelimiters;
exports.findPointFieldPairs = findPointFieldPairs;
exports.sortDatasetByColumn = sortDatasetByColumn;
exports.datasetColorMaker = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _colorUtils = require("./color-utils");

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _defaultSettings = require("../constants/default-settings");

var _utils = require("./utils");

var _dataProcessor = require("../processors/data-processor");

var _gpuFilterUtils = require("./gpu-filter-utils");

var _d3Array = require("d3-array");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _marked =
/*#__PURE__*/
_regenerator["default"].mark(generateColor);

// apply a color for each dataset
// to use as label colors
var datasetColors = ['#8F2FBF', '#005CFF', '#C06C84', '#F8B195', '#547A82', '#3EACA8', '#A2D4AB'].map(_colorUtils.hexToRgb);
/**
 * Random color generator
 * @return {Generator<import('reducers/types').RGBColor>}
 */

function generateColor() {
  var index;
  return _regenerator["default"].wrap(function generateColor$(_context) {
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
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var datasetColorMaker = generateColor();
/** @type {typeof import('./dataset-utils').getNewDatasetColor} */

exports.datasetColorMaker = datasetColorMaker;

function getNewDatasetColor(datasets) {
  var presetColors = datasetColors.map(String);
  var usedColors = (0, _lodash["default"])(Object.values(datasets).map(function (d) {
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
/**
 * Take datasets payload from addDataToMap, create datasets entry save to visState
 * @type {typeof import('./dataset-utils').createNewDataEntry}
 */


function createNewDataEntry(_ref) {
  var info = _ref.info,
      data = _ref.data;
  var datasets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var validatedData = (0, _dataProcessor.validateInputData)(data);

  if (!validatedData) {
    return {};
  }

  var allData = validatedData.rows;

  var datasetInfo = _objectSpread({
    id: (0, _utils.generateHashId)(4),
    label: 'new dataset'
  }, info || {});

  var dataId = datasetInfo.id; // add tableFieldIndex and id to fields
  // TODO: don't need id and name and tableFieldIndex anymore
  // Add value accessor instead

  var fields = validatedData.fields.map(function (f, i) {
    return _objectSpread({}, f, {
      id: f.name,
      tableFieldIndex: i + 1
    });
  });
  var allIndexes = allData.map(function (_, i) {
    return i;
  });
  return (0, _defineProperty2["default"])({}, dataId, _objectSpread({}, datasetInfo, {
    color: datasetInfo.color || getNewDatasetColor(datasets),
    id: dataId,
    allData: allData,
    allIndexes: allIndexes,
    filteredIndex: allIndexes,
    filteredIndexForDomain: allIndexes,
    fieldPairs: findPointFieldPairs(fields),
    fields: fields,
    gpuFilter: (0, _gpuFilterUtils.getGpuFilterProps)([], dataId, fields)
  }));
}

function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName.replace(new RegExp(suffix, 'ig'), '').replace(/[_,.]+/g, ' ').trim();
}
/**
 * Find point fields pairs from fields
 *
 * @param fields
 * @returns found point fields
 * @type {typeof import('./dataset-utils').findPointFieldPairs}
 */


function findPointFieldPairs(fields) {
  var allNames = fields.map(function (f) {
    return f.name.toLowerCase();
  }); // get list of all fields with matching suffixes

  return allNames.reduce(function (carry, fieldName, idx) {
    // This search for pairs will early exit if found.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _defaultSettings.TRIP_POINT_FIELDS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var suffixPair = _step.value;

        // match first suffix```
        if (fieldName.endsWith(suffixPair[0])) {
          var _ret = function () {
            // match second suffix
            var otherPattern = new RegExp("".concat(suffixPair[0], "$"));
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

          if ((0, _typeof2["default"])(_ret) === "object") return _ret.v;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return carry;
  }, []);
}
/**
 *
 * @param dataset
 * @param column
 * @param mode
 * @type {typeof import('./dataset-utils').sortDatasetByColumn}
 */


function sortDatasetByColumn(dataset, column, mode) {
  var allIndexes = dataset.allIndexes,
      fields = dataset.fields,
      allData = dataset.allData;
  var fieldIndex = fields.findIndex(function (f) {
    return f.name === column;
  });

  if (fieldIndex < 0) {
    return dataset;
  }

  var sortBy = _defaultSettings.SORT_ORDER[mode] || _defaultSettings.SORT_ORDER.ASCENDING;

  if (sortBy === _defaultSettings.SORT_ORDER.UNSORT) {
    return _objectSpread({}, dataset, {
      sortColumn: {},
      sortOrder: null
    });
  }

  var sortFunction = sortBy === _defaultSettings.SORT_ORDER.ASCENDING ? _d3Array.ascending : _d3Array.descending;
  var sortOrder = allIndexes.slice().sort(function (a, b) {
    return sortFunction(allData[a][fieldIndex], allData[b][fieldIndex]);
  });
  return _objectSpread({}, dataset, {
    sortColumn: (0, _defineProperty2["default"])({}, column, sortBy),
    sortOrder: sortOrder
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kYXRhc2V0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdlbmVyYXRlQ29sb3IiLCJkYXRhc2V0Q29sb3JzIiwibWFwIiwiaGV4VG9SZ2IiLCJpbmRleCIsImxlbmd0aCIsImRhdGFzZXRDb2xvck1ha2VyIiwiZ2V0TmV3RGF0YXNldENvbG9yIiwiZGF0YXNldHMiLCJwcmVzZXRDb2xvcnMiLCJTdHJpbmciLCJ1c2VkQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwiZCIsImNvbG9yIiwiZmlsdGVyIiwiYyIsImluY2x1ZGVzIiwibmV4dCIsInZhbHVlIiwiY3JlYXRlTmV3RGF0YUVudHJ5IiwiaW5mbyIsImRhdGEiLCJ2YWxpZGF0ZWREYXRhIiwiYWxsRGF0YSIsInJvd3MiLCJkYXRhc2V0SW5mbyIsImlkIiwibGFiZWwiLCJkYXRhSWQiLCJmaWVsZHMiLCJmIiwiaSIsIm5hbWUiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhbGxJbmRleGVzIiwiXyIsImZpbHRlcmVkSW5kZXgiLCJmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIiwiZmllbGRQYWlycyIsImZpbmRQb2ludEZpZWxkUGFpcnMiLCJncHVGaWx0ZXIiLCJyZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzIiwibGF5ZXJOYW1lIiwic3VmZml4IiwicmVwbGFjZSIsIlJlZ0V4cCIsInRyaW0iLCJhbGxOYW1lcyIsInRvTG93ZXJDYXNlIiwicmVkdWNlIiwiY2FycnkiLCJmaWVsZE5hbWUiLCJpZHgiLCJUUklQX1BPSU5UX0ZJRUxEUyIsInN1ZmZpeFBhaXIiLCJlbmRzV2l0aCIsIm90aGVyUGF0dGVybiIsInBhcnRuZXIiLCJwYXJ0bmVySWR4IiwiZmluZEluZGV4IiwiZGVmYXVsdE5hbWUiLCJwdXNoIiwicGFpciIsImxhdCIsImZpZWxkSWR4IiwibG5nIiwic29ydERhdGFzZXRCeUNvbHVtbiIsImRhdGFzZXQiLCJjb2x1bW4iLCJtb2RlIiwiZmllbGRJbmRleCIsInNvcnRCeSIsIlNPUlRfT1JERVIiLCJBU0NFTkRJTkciLCJVTlNPUlQiLCJzb3J0Q29sdW1uIiwic29ydE9yZGVyIiwic29ydEZ1bmN0aW9uIiwiYXNjZW5kaW5nIiwiZGVzY2VuZGluZyIsInNsaWNlIiwic29ydCIsImEiLCJiIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs2QkFpQlVBLGE7O0FBaEJWO0FBQ0E7QUFDQSxJQUFNQyxhQUFhLEdBQUcsQ0FDcEIsU0FEb0IsRUFFcEIsU0FGb0IsRUFHcEIsU0FIb0IsRUFJcEIsU0FKb0IsRUFLcEIsU0FMb0IsRUFNcEIsU0FOb0IsRUFPcEIsU0FQb0IsRUFRcEJDLEdBUm9CLENBUWhCQyxvQkFSZ0IsQ0FBdEI7QUFVQTs7Ozs7QUFJQSxTQUFVSCxhQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNNSSxVQUFBQSxLQUROLEdBQ2MsQ0FEZDs7QUFBQTtBQUFBLGdCQUVTQSxLQUFLLEdBQUdILGFBQWEsQ0FBQ0ksTUFBZCxHQUF1QixDQUZ4QztBQUFBO0FBQUE7QUFBQTs7QUFHSSxjQUFJRCxLQUFLLEtBQUtILGFBQWEsQ0FBQ0ksTUFBNUIsRUFBb0M7QUFDbENELFlBQUFBLEtBQUssR0FBRyxDQUFSO0FBQ0Q7O0FBTEw7QUFNSSxpQkFBTUgsYUFBYSxDQUFDRyxLQUFLLEVBQU4sQ0FBbkI7O0FBTko7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVVPLElBQU1FLGlCQUFpQixHQUFHTixhQUFhLEVBQXZDO0FBRVA7Ozs7QUFDQSxTQUFTTyxrQkFBVCxDQUE0QkMsUUFBNUIsRUFBc0M7QUFDcEMsTUFBTUMsWUFBWSxHQUFHUixhQUFhLENBQUNDLEdBQWQsQ0FBa0JRLE1BQWxCLENBQXJCO0FBQ0EsTUFBTUMsVUFBVSxHQUFHLHdCQUFLQyxNQUFNLENBQUNDLE1BQVAsQ0FBY0wsUUFBZCxFQUF3Qk4sR0FBeEIsQ0FBNEIsVUFBQVks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QUVFUSxNQUFBQSxVQUFVLEVBQUUsRUFGZDtBQUdFQyxNQUFBQSxTQUFTLEVBQUU7QUFIYjtBQUtEOztBQUVELE1BQU1DLFlBQVksR0FBR04sTUFBTSxLQUFLQyw0QkFBV0MsU0FBdEIsR0FBa0NLLGtCQUFsQyxHQUE4Q0MsbUJBQW5FO0FBQ0EsTUFBTUgsU0FBUyxHQUFHMUMsVUFBVSxDQUN6QjhDLEtBRGUsR0FFZkMsSUFGZSxDQUVWLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVVOLFlBQVksQ0FBQ3RELE9BQU8sQ0FBQzJELENBQUQsQ0FBUCxDQUFXWixVQUFYLENBQUQsRUFBeUIvQyxPQUFPLENBQUM0RCxDQUFELENBQVAsQ0FBV2IsVUFBWCxDQUF6QixDQUF0QjtBQUFBLEdBRlUsQ0FBbEI7QUFJQSwyQkFDS0gsT0FETDtBQUVFUSxJQUFBQSxVQUFVLHVDQUNQUCxNQURPLEVBQ0VHLE1BREYsQ0FGWjtBQUtFSyxJQUFBQSxTQUFTLEVBQVRBO0FBTEY7QUFPRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4vY29sb3ItdXRpbHMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHtUUklQX1BPSU5UX0ZJRUxEUywgU09SVF9PUkRFUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge3ZhbGlkYXRlSW5wdXREYXRhfSBmcm9tICdwcm9jZXNzb3JzL2RhdGEtcHJvY2Vzc29yJztcbmltcG9ydCB7Z2V0R3B1RmlsdGVyUHJvcHN9IGZyb20gJ3V0aWxzL2dwdS1maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHthc2NlbmRpbmcsIGRlc2NlbmRpbmd9IGZyb20gJ2QzLWFycmF5Jztcbi8vIGFwcGx5IGEgY29sb3IgZm9yIGVhY2ggZGF0YXNldFxuLy8gdG8gdXNlIGFzIGxhYmVsIGNvbG9yc1xuY29uc3QgZGF0YXNldENvbG9ycyA9IFtcbiAgJyM4RjJGQkYnLFxuICAnIzAwNUNGRicsXG4gICcjQzA2Qzg0JyxcbiAgJyNGOEIxOTUnLFxuICAnIzU0N0E4MicsXG4gICcjM0VBQ0E4JyxcbiAgJyNBMkQ0QUInXG5dLm1hcChoZXhUb1JnYik7XG5cbi8qKlxuICogUmFuZG9tIGNvbG9yIGdlbmVyYXRvclxuICogQHJldHVybiB7R2VuZXJhdG9yPGltcG9ydCgncmVkdWNlcnMvdHlwZXMnKS5SR0JDb2xvcj59XG4gKi9cbmZ1bmN0aW9uKiBnZW5lcmF0ZUNvbG9yKCkge1xuICBsZXQgaW5kZXggPSAwO1xuICB3aGlsZSAoaW5kZXggPCBkYXRhc2V0Q29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IGRhdGFzZXRDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHlpZWxkIGRhdGFzZXRDb2xvcnNbaW5kZXgrK107XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRhdGFzZXRDb2xvck1ha2VyID0gZ2VuZXJhdGVDb2xvcigpO1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YXNldC11dGlscycpLmdldE5ld0RhdGFzZXRDb2xvcn0gKi9cbmZ1bmN0aW9uIGdldE5ld0RhdGFzZXRDb2xvcihkYXRhc2V0cykge1xuICBjb25zdCBwcmVzZXRDb2xvcnMgPSBkYXRhc2V0Q29sb3JzLm1hcChTdHJpbmcpO1xuICBjb25zdCB1c2VkQ29sb3JzID0gdW5pcShPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoZCA9PiBTdHJpbmcoZC5jb2xvcikpKS5maWx0ZXIoYyA9PlxuICAgIHByZXNldENvbG9ycy5pbmNsdWRlcyhjKVxuICApO1xuXG4gIGlmICh1c2VkQ29sb3JzLmxlbmd0aCA9PT0gcHJlc2V0Q29sb3JzLmxlbmd0aCkge1xuICAgIC8vIGlmIHdlIGFscmVhZHkgZGVwbGV0ZWQgdGhlIHBvb2wgb2YgY29sb3JcbiAgICByZXR1cm4gZGF0YXNldENvbG9yTWFrZXIubmV4dCgpLnZhbHVlO1xuICB9XG5cbiAgbGV0IGNvbG9yID0gZGF0YXNldENvbG9yTWFrZXIubmV4dCgpLnZhbHVlO1xuICB3aGlsZSAodXNlZENvbG9ycy5pbmNsdWRlcyhTdHJpbmcoY29sb3IpKSkge1xuICAgIGNvbG9yID0gZGF0YXNldENvbG9yTWFrZXIubmV4dCgpLnZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGNvbG9yO1xufVxuXG4vKipcbiAqIFRha2UgZGF0YXNldHMgcGF5bG9hZCBmcm9tIGFkZERhdGFUb01hcCwgY3JlYXRlIGRhdGFzZXRzIGVudHJ5IHNhdmUgdG8gdmlzU3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGFzZXQtdXRpbHMnKS5jcmVhdGVOZXdEYXRhRW50cnl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdEYXRhRW50cnkoe2luZm8sIGRhdGF9LCBkYXRhc2V0cyA9IHt9KSB7XG4gIGNvbnN0IHZhbGlkYXRlZERhdGEgPSB2YWxpZGF0ZUlucHV0RGF0YShkYXRhKTtcbiAgaWYgKCF2YWxpZGF0ZWREYXRhKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgYWxsRGF0YSA9IHZhbGlkYXRlZERhdGEucm93cztcbiAgY29uc3QgZGF0YXNldEluZm8gPSB7XG4gICAgaWQ6IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgIGxhYmVsOiAnbmV3IGRhdGFzZXQnLFxuICAgIC4uLihpbmZvIHx8IHt9KVxuICB9O1xuICBjb25zdCBkYXRhSWQgPSBkYXRhc2V0SW5mby5pZDtcblxuICAvLyBhZGQgdGFibGVGaWVsZEluZGV4IGFuZCBpZCB0byBmaWVsZHNcbiAgLy8gVE9ETzogZG9uJ3QgbmVlZCBpZCBhbmQgbmFtZSBhbmQgdGFibGVGaWVsZEluZGV4IGFueW1vcmVcbiAgLy8gQWRkIHZhbHVlIGFjY2Vzc29yIGluc3RlYWRcbiAgY29uc3QgZmllbGRzID0gdmFsaWRhdGVkRGF0YS5maWVsZHMubWFwKChmLCBpKSA9PiAoe1xuICAgIC4uLmYsXG4gICAgaWQ6IGYubmFtZSxcbiAgICB0YWJsZUZpZWxkSW5kZXg6IGkgKyAxXG4gIH0pKTtcblxuICBjb25zdCBhbGxJbmRleGVzID0gYWxsRGF0YS5tYXAoKF8sIGkpID0+IGkpO1xuICByZXR1cm4ge1xuICAgIFtkYXRhSWRdOiB7XG4gICAgICAuLi5kYXRhc2V0SW5mbyxcbiAgICAgIGNvbG9yOiBkYXRhc2V0SW5mby5jb2xvciB8fCBnZXROZXdEYXRhc2V0Q29sb3IoZGF0YXNldHMpLFxuICAgICAgaWQ6IGRhdGFJZCxcbiAgICAgIGFsbERhdGEsXG4gICAgICBhbGxJbmRleGVzLFxuICAgICAgZmlsdGVyZWRJbmRleDogYWxsSW5kZXhlcyxcbiAgICAgIGZpbHRlcmVkSW5kZXhGb3JEb21haW46IGFsbEluZGV4ZXMsXG4gICAgICBmaWVsZFBhaXJzOiBmaW5kUG9pbnRGaWVsZFBhaXJzKGZpZWxkcyksXG4gICAgICBmaWVsZHMsXG4gICAgICBncHVGaWx0ZXI6IGdldEdwdUZpbHRlclByb3BzKFtdLCBkYXRhSWQsIGZpZWxkcylcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzKGxheWVyTmFtZSwgc3VmZml4KSB7XG4gIHJldHVybiBsYXllck5hbWVcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKHN1ZmZpeCwgJ2lnJyksICcnKVxuICAgIC5yZXBsYWNlKC9bXywuXSsvZywgJyAnKVxuICAgIC50cmltKCk7XG59XG5cbi8qKlxuICogRmluZCBwb2ludCBmaWVsZHMgcGFpcnMgZnJvbSBmaWVsZHNcbiAqXG4gKiBAcGFyYW0gZmllbGRzXG4gKiBAcmV0dXJucyBmb3VuZCBwb2ludCBmaWVsZHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2RhdGFzZXQtdXRpbHMnKS5maW5kUG9pbnRGaWVsZFBhaXJzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFBvaW50RmllbGRQYWlycyhmaWVsZHMpIHtcbiAgY29uc3QgYWxsTmFtZXMgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuXG4gIC8vIGdldCBsaXN0IG9mIGFsbCBmaWVsZHMgd2l0aCBtYXRjaGluZyBzdWZmaXhlc1xuICByZXR1cm4gYWxsTmFtZXMucmVkdWNlKChjYXJyeSwgZmllbGROYW1lLCBpZHgpID0+IHtcbiAgICAvLyBUaGlzIHNlYXJjaCBmb3IgcGFpcnMgd2lsbCBlYXJseSBleGl0IGlmIGZvdW5kLlxuICAgIGZvciAoY29uc3Qgc3VmZml4UGFpciBvZiBUUklQX1BPSU5UX0ZJRUxEUykge1xuICAgICAgLy8gbWF0Y2ggZmlyc3Qgc3VmZml4YGBgXG4gICAgICBpZiAoZmllbGROYW1lLmVuZHNXaXRoKHN1ZmZpeFBhaXJbMF0pKSB7XG4gICAgICAgIC8vIG1hdGNoIHNlY29uZCBzdWZmaXhcbiAgICAgICAgY29uc3Qgb3RoZXJQYXR0ZXJuID0gbmV3IFJlZ0V4cChgJHtzdWZmaXhQYWlyWzBdfVxcJGApO1xuICAgICAgICBjb25zdCBwYXJ0bmVyID0gZmllbGROYW1lLnJlcGxhY2Uob3RoZXJQYXR0ZXJuLCBzdWZmaXhQYWlyWzFdKTtcblxuICAgICAgICBjb25zdCBwYXJ0bmVySWR4ID0gYWxsTmFtZXMuZmluZEluZGV4KGQgPT4gZCA9PT0gcGFydG5lcik7XG4gICAgICAgIGlmIChwYXJ0bmVySWR4ID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IHJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMoZmllbGROYW1lLCBzdWZmaXhQYWlyWzBdKTtcblxuICAgICAgICAgIGNhcnJ5LnB1c2goe1xuICAgICAgICAgICAgZGVmYXVsdE5hbWUsXG4gICAgICAgICAgICBwYWlyOiB7XG4gICAgICAgICAgICAgIGxhdDoge1xuICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBpZHgsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1tpZHhdLm5hbWVcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbG5nOiB7XG4gICAgICAgICAgICAgICAgZmllbGRJZHg6IHBhcnRuZXJJZHgsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1twYXJ0bmVySWR4XS5uYW1lXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFBhaXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gY2Fycnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhcnJ5O1xuICB9LCBbXSk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBkYXRhc2V0XG4gKiBAcGFyYW0gY29sdW1uXG4gKiBAcGFyYW0gbW9kZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZGF0YXNldC11dGlscycpLnNvcnREYXRhc2V0QnlDb2x1bW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RGF0YXNldEJ5Q29sdW1uKGRhdGFzZXQsIGNvbHVtbiwgbW9kZSkge1xuICBjb25zdCB7YWxsSW5kZXhlcywgZmllbGRzLCBhbGxEYXRhfSA9IGRhdGFzZXQ7XG4gIGNvbnN0IGZpZWxkSW5kZXggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSBjb2x1bW4pO1xuICBpZiAoZmllbGRJbmRleCA8IDApIHtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGNvbnN0IHNvcnRCeSA9IFNPUlRfT1JERVJbbW9kZV0gfHwgU09SVF9PUkRFUi5BU0NFTkRJTkc7XG5cbiAgaWYgKHNvcnRCeSA9PT0gU09SVF9PUkRFUi5VTlNPUlQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGF0YXNldCxcbiAgICAgIHNvcnRDb2x1bW46IHt9LFxuICAgICAgc29ydE9yZGVyOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHNvcnRGdW5jdGlvbiA9IHNvcnRCeSA9PT0gU09SVF9PUkRFUi5BU0NFTkRJTkcgPyBhc2NlbmRpbmcgOiBkZXNjZW5kaW5nO1xuICBjb25zdCBzb3J0T3JkZXIgPSBhbGxJbmRleGVzXG4gICAgLnNsaWNlKClcbiAgICAuc29ydCgoYSwgYikgPT4gc29ydEZ1bmN0aW9uKGFsbERhdGFbYV1bZmllbGRJbmRleF0sIGFsbERhdGFbYl1bZmllbGRJbmRleF0pKTtcblxuICByZXR1cm4ge1xuICAgIC4uLmRhdGFzZXQsXG4gICAgc29ydENvbHVtbjoge1xuICAgICAgW2NvbHVtbl06IHNvcnRCeVxuICAgIH0sXG4gICAgc29ydE9yZGVyXG4gIH07XG59XG4iXX0=