"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGeoJson = isGeoJson;
exports.isFeature = isFeature;
exports.isFeatureCollection = isFeatureCollection;
exports.isRowObject = isRowObject;
exports.isKeplerGlMap = isKeplerGlMap;
exports.makeProgressIterator = makeProgressIterator;
exports.readBatch = readBatch;
exports.readFileInBatches = readFileInBatches;
exports.processFileData = processFileData;
exports.filesToDataPayload = filesToDataPayload;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

require("@loaders.gl/polyfills");

var _core = require("@loaders.gl/core");

var _json = require("@loaders.gl/json");

var _csv = require("@loaders.gl/csv");

var _dataProcessor = require("./data-processor");

var _utils = require("../utils/utils");

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var BATCH_TYPE = {
  METADATA: 'metadata',
  PARTIAL_RESULT: 'partial-result',
  FINAL_RESULT: 'final-result'
};
var CSV_LOADER_OPTIONS = {
  batchSize: 4000,
  // Auto de tect number of rows per batch (network batch size)
  rowFormat: 'object',
  dynamicTyping: false // not working for now

};
var JSON_LOADER_OPTIONS = {
  // instruct loaders.gl on what json paths to stream
  jsonpaths: ['$', // JSON Row array
  '$.features', // GeoJSON
  '$.datasets' // KeplerGL JSON
  ]
};

function isGeoJson(json) {
  // json can be feature collection
  // or single feature
  return (0, _utils.isPlainObject)(json) && (isFeature(json) || isFeatureCollection(json));
}

function isFeature(json) {
  return json.type === 'Feature' && json.geometry;
}

function isFeatureCollection(json) {
  return json.type === 'FeatureCollection' && json.features;
}

function isRowObject(json) {
  return Array.isArray(json) && (0, _utils.isPlainObject)(json[0]);
}

function isKeplerGlMap(json) {
  return Boolean((0, _utils.isPlainObject)(json) && json.datasets && json.config && json.info && json.info.app === 'kepler.gl');
}

function makeProgressIterator(_x, _x2) {
  return _makeProgressIterator.apply(this, arguments);
} // eslint-disable-next-line complexity


function _makeProgressIterator() {
  _makeProgressIterator = (0, _wrapAsyncGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(asyncIterator, info) {
    var rowCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, batch, rowCountInBatch, percent, progress;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            rowCount = 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 3;
            _iterator = (0, _asyncIterator2["default"])(asyncIterator);

          case 5:
            _context.next = 7;
            return (0, _awaitAsyncGenerator2["default"])(_iterator.next());

          case 7:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 11;
            return (0, _awaitAsyncGenerator2["default"])(_step.value);

          case 11:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 23;
              break;
            }

            batch = _value;
            rowCountInBatch = batch.data && batch.data.length || 0;
            rowCount += rowCountInBatch;
            percent = Number.isFinite(batch.bytesUsed) ? batch.bytesUsed / info.size : null; // Update progress object

            progress = _objectSpread({
              rowCount: rowCount,
              rowCountInBatch: rowCountInBatch
            }, Number.isFinite(percent) ? {
              percent: percent
            } : {});
            _context.next = 20;
            return _objectSpread(_objectSpread({}, batch), {}, {
              progress: progress
            });

          case 20:
            _iteratorNormalCompletion = true;
            _context.next = 5;
            break;

          case 23:
            _context.next = 29;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 29:
            _context.prev = 29;
            _context.prev = 30;

            if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
              _context.next = 34;
              break;
            }

            _context.next = 34;
            return (0, _awaitAsyncGenerator2["default"])(_iterator["return"]());

          case 34:
            _context.prev = 34;

            if (!_didIteratorError) {
              _context.next = 37;
              break;
            }

            throw _iteratorError;

          case 37:
            return _context.finish(34);

          case 38:
            return _context.finish(29);

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 25, 29, 39], [30,, 34, 38]]);
  }));
  return _makeProgressIterator.apply(this, arguments);
}

function readBatch(_x3, _x4) {
  return _readBatch.apply(this, arguments);
}

function _readBatch() {
  _readBatch = (0, _wrapAsyncGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(asyncIterator, fileName) {
    var result, batches, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, batch, streamingPath, i;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = null;
            batches = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _context2.prev = 4;
            _iterator2 = (0, _asyncIterator2["default"])(asyncIterator);

          case 6:
            _context2.next = 8;
            return (0, _awaitAsyncGenerator2["default"])(_iterator2.next());

          case 8:
            _step2 = _context2.sent;
            _iteratorNormalCompletion2 = _step2.done;
            _context2.next = 12;
            return (0, _awaitAsyncGenerator2["default"])(_step2.value);

          case 12:
            _value2 = _context2.sent;

            if (_iteratorNormalCompletion2) {
              _context2.next = 21;
              break;
            }

            batch = _value2;

            // Last batch will have this special type and will provide all the root
            // properties of the parsed document.
            // Only json parse will have `FINAL_RESULT`
            if (batch.batchType === BATCH_TYPE.FINAL_RESULT) {
              if (batch.container) {
                result = _objectSpread({}, batch.container);
              } // Set the streamed data correctly is Batch json path is set
              // and the path streamed is not the top level object (jsonpath = '$')


              if (batch.jsonpath && batch.jsonpath.length > 1) {
                streamingPath = new _json._JSONPath(batch.jsonpath);
                streamingPath.setFieldAtPath(result, batches);
              } else if (batch.jsonpath && batch.jsonpath.length === 1) {
                // The streamed object is a ROW JSON-batch (jsonpath = '$')
                // row objects
                result = batches;
              }
            } else {
              for (i = 0; i < batch.data.length; i++) {
                batches.push(batch.data[i]);
              }
            }

            _context2.next = 18;
            return _objectSpread(_objectSpread(_objectSpread({}, batch), batch.schema ? {
              headers: Object.keys(batch.schema)
            } : {}), {}, {
              fileName: fileName,
              // if dataset is CSV, data is set to the raw batches
              data: result ? result : batches
            });

          case 18:
            _iteratorNormalCompletion2 = true;
            _context2.next = 6;
            break;

          case 21:
            _context2.next = 27;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 27:
            _context2.prev = 27;
            _context2.prev = 28;

            if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
              _context2.next = 32;
              break;
            }

            _context2.next = 32;
            return (0, _awaitAsyncGenerator2["default"])(_iterator2["return"]());

          case 32:
            _context2.prev = 32;

            if (!_didIteratorError2) {
              _context2.next = 35;
              break;
            }

            throw _iteratorError2;

          case 35:
            return _context2.finish(32);

          case 36:
            return _context2.finish(27);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 23, 27, 37], [28,, 32, 36]]);
  }));
  return _readBatch.apply(this, arguments);
}

function readFileInBatches(_x5) {
  return _readFileInBatches.apply(this, arguments);
}

function _readFileInBatches() {
  _readFileInBatches = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref) {
    var file, _ref$fileCache, fileCache, _ref$loaders, loaders, _ref$loadOptions, loadOptions, batchIterator, progressIterator;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            file = _ref.file, _ref$fileCache = _ref.fileCache, fileCache = _ref$fileCache === void 0 ? [] : _ref$fileCache, _ref$loaders = _ref.loaders, loaders = _ref$loaders === void 0 ? [] : _ref$loaders, _ref$loadOptions = _ref.loadOptions, loadOptions = _ref$loadOptions === void 0 ? {} : _ref$loadOptions;
            loaders = [_json.JSONLoader, _csv.CSVLoader].concat((0, _toConsumableArray2["default"])(loaders));
            loadOptions = _objectSpread({
              csv: CSV_LOADER_OPTIONS,
              json: JSON_LOADER_OPTIONS,
              metadata: true
            }, loadOptions);
            _context3.next = 5;
            return (0, _core.parseInBatches)(file, loaders, loadOptions);

          case 5:
            batchIterator = _context3.sent;
            progressIterator = makeProgressIterator(batchIterator, {
              size: file.size
            });
            return _context3.abrupt("return", readBatch(progressIterator, file.name));

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _readFileInBatches.apply(this, arguments);
}

function processFileData(_ref2) {
  var content = _ref2.content,
      fileCache = _ref2.fileCache;
  return new Promise(function (resolve, reject) {
    var data = content.data;
    var format;
    var processor;

    if (isKeplerGlMap(data)) {
      format = _defaultSettings.DATASET_FORMATS.keplergl;
      processor = _dataProcessor.processKeplerglJSON;
    } else if (isRowObject(data)) {
      format = _defaultSettings.DATASET_FORMATS.row;
      processor = _dataProcessor.processRowObject;
    } else if (isGeoJson(data)) {
      format = _defaultSettings.DATASET_FORMATS.geojson;
      processor = _dataProcessor.processGeojson;
    }

    if (format && processor) {
      var result = processor(data);
      resolve([].concat((0, _toConsumableArray2["default"])(fileCache), [{
        data: result,
        info: {
          label: content.fileName,
          format: format
        }
      }]));
    }

    reject('Unknow File Format');
  });
}

function filesToDataPayload(fileCache) {
  // seperate out files which could be a single datasets. or a keplergl map json
  var collection = fileCache.reduce(function (accu, file) {
    var data = file.data,
        _file$info = file.info,
        info = _file$info === void 0 ? {} : _file$info;
    var format = info.format;

    if (format === _defaultSettings.DATASET_FORMATS.keplergl) {
      // if file contains a single kepler map dataset & config
      accu.keplerMaps.push(_objectSpread(_objectSpread({}, data), {}, {
        options: {
          centerMap: !(data.config && data.config.mapState)
        }
      }));
    } else if (_defaultSettings.DATASET_FORMATS[format]) {
      // if file contains only data
      var newDataset = {
        data: data,
        info: _objectSpread({
          id: info.id || (0, _utils.generateHashId)(4)
        }, info)
      };
      accu.datasets.push(newDataset);
    }

    return accu;
  }, {
    datasets: [],
    keplerMaps: []
  }); // add kepler map first with config
  // add datasets later in one add data call

  return collection.keplerMaps.concat({
    datasets: collection.datasets
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3JzL2ZpbGUtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJCQVRDSF9UWVBFIiwiTUVUQURBVEEiLCJQQVJUSUFMX1JFU1VMVCIsIkZJTkFMX1JFU1VMVCIsIkNTVl9MT0FERVJfT1BUSU9OUyIsImJhdGNoU2l6ZSIsInJvd0Zvcm1hdCIsImR5bmFtaWNUeXBpbmciLCJKU09OX0xPQURFUl9PUFRJT05TIiwianNvbnBhdGhzIiwiaXNHZW9Kc29uIiwianNvbiIsImlzRmVhdHVyZSIsImlzRmVhdHVyZUNvbGxlY3Rpb24iLCJ0eXBlIiwiZ2VvbWV0cnkiLCJmZWF0dXJlcyIsImlzUm93T2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiaXNLZXBsZXJHbE1hcCIsIkJvb2xlYW4iLCJkYXRhc2V0cyIsImNvbmZpZyIsImluZm8iLCJhcHAiLCJtYWtlUHJvZ3Jlc3NJdGVyYXRvciIsImFzeW5jSXRlcmF0b3IiLCJyb3dDb3VudCIsImJhdGNoIiwicm93Q291bnRJbkJhdGNoIiwiZGF0YSIsImxlbmd0aCIsInBlcmNlbnQiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImJ5dGVzVXNlZCIsInNpemUiLCJwcm9ncmVzcyIsInJlYWRCYXRjaCIsImZpbGVOYW1lIiwicmVzdWx0IiwiYmF0Y2hlcyIsImJhdGNoVHlwZSIsImNvbnRhaW5lciIsImpzb25wYXRoIiwic3RyZWFtaW5nUGF0aCIsIl9KU09OUGF0aCIsInNldEZpZWxkQXRQYXRoIiwiaSIsInB1c2giLCJzY2hlbWEiLCJoZWFkZXJzIiwiT2JqZWN0Iiwia2V5cyIsInJlYWRGaWxlSW5CYXRjaGVzIiwiZmlsZSIsImZpbGVDYWNoZSIsImxvYWRlcnMiLCJsb2FkT3B0aW9ucyIsIkpTT05Mb2FkZXIiLCJDU1ZMb2FkZXIiLCJjc3YiLCJtZXRhZGF0YSIsImJhdGNoSXRlcmF0b3IiLCJwcm9ncmVzc0l0ZXJhdG9yIiwibmFtZSIsInByb2Nlc3NGaWxlRGF0YSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZvcm1hdCIsInByb2Nlc3NvciIsIkRBVEFTRVRfRk9STUFUUyIsImtlcGxlcmdsIiwicHJvY2Vzc0tlcGxlcmdsSlNPTiIsInJvdyIsInByb2Nlc3NSb3dPYmplY3QiLCJnZW9qc29uIiwicHJvY2Vzc0dlb2pzb24iLCJsYWJlbCIsImZpbGVzVG9EYXRhUGF5bG9hZCIsImNvbGxlY3Rpb24iLCJyZWR1Y2UiLCJhY2N1Iiwia2VwbGVyTWFwcyIsIm9wdGlvbnMiLCJjZW50ZXJNYXAiLCJtYXBTdGF0ZSIsIm5ld0RhdGFzZXQiLCJpZCIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsUUFBUSxFQUFFLFVBRE87QUFFakJDLEVBQUFBLGNBQWMsRUFBRSxnQkFGQztBQUdqQkMsRUFBQUEsWUFBWSxFQUFFO0FBSEcsQ0FBbkI7QUFNQSxJQUFNQyxrQkFBa0IsR0FBRztBQUN6QkMsRUFBQUEsU0FBUyxFQUFFLElBRGM7QUFDUjtBQUNqQkMsRUFBQUEsU0FBUyxFQUFFLFFBRmM7QUFHekJDLEVBQUFBLGFBQWEsRUFBRSxLQUhVLENBR0o7O0FBSEksQ0FBM0I7QUFNQSxJQUFNQyxtQkFBbUIsR0FBRztBQUMxQjtBQUNBQyxFQUFBQSxTQUFTLEVBQUUsQ0FDVCxHQURTLEVBQ0o7QUFDTCxjQUZTLEVBRUs7QUFDZCxjQUhTLENBR0k7QUFISjtBQUZlLENBQTVCOztBQVNPLFNBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCO0FBQzlCO0FBQ0E7QUFDQSxTQUFPLDBCQUFjQSxJQUFkLE1BQXdCQyxTQUFTLENBQUNELElBQUQsQ0FBVCxJQUFtQkUsbUJBQW1CLENBQUNGLElBQUQsQ0FBOUQsQ0FBUDtBQUNEOztBQUVNLFNBQVNDLFNBQVQsQ0FBbUJELElBQW5CLEVBQXlCO0FBQzlC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QUFBQSxxQkFDWXlCLElBRFosQ0FDRGhDLElBREM7QUFBQSxRQUNEQSxJQURDLDJCQUNNLEVBRE47QUFBQSxRQUVQZ0QsTUFGTyxHQUVHaEQsSUFGSCxDQUVQZ0QsTUFGTzs7QUFHZCxRQUFJQSxNQUFNLEtBQUtFLGlDQUFnQkMsUUFBL0IsRUFBeUM7QUFDdkM7QUFDQVUsTUFBQUEsSUFBSSxDQUFDQyxVQUFMLENBQWdCcEMsSUFBaEIsaUNBQ0tuQixJQURMO0FBRUV3RCxRQUFBQSxPQUFPLEVBQUU7QUFDUEMsVUFBQUEsU0FBUyxFQUFFLEVBQUV6RCxJQUFJLENBQUNSLE1BQUwsSUFBZVEsSUFBSSxDQUFDUixNQUFMLENBQVlrRSxRQUE3QjtBQURKO0FBRlg7QUFNRCxLQVJELE1BUU8sSUFBSWYsaUNBQWdCRixNQUFoQixDQUFKLEVBQTZCO0FBQ2xDO0FBQ0EsVUFBTWtCLFVBQVUsR0FBRztBQUNqQjNELFFBQUFBLElBQUksRUFBSkEsSUFEaUI7QUFFakJQLFFBQUFBLElBQUk7QUFDRm1FLFVBQUFBLEVBQUUsRUFBRW5FLElBQUksQ0FBQ21FLEVBQUwsSUFBVywyQkFBZSxDQUFmO0FBRGIsV0FFQ25FLElBRkQ7QUFGYSxPQUFuQjtBQU9BNkQsTUFBQUEsSUFBSSxDQUFDL0QsUUFBTCxDQUFjNEIsSUFBZCxDQUFtQndDLFVBQW5CO0FBQ0Q7O0FBQ0QsV0FBT0wsSUFBUDtBQUNELEdBeEJnQixFQXlCakI7QUFBQy9ELElBQUFBLFFBQVEsRUFBRSxFQUFYO0FBQWVnRSxJQUFBQSxVQUFVLEVBQUU7QUFBM0IsR0F6QmlCLENBQW5CLENBRjRDLENBOEI1QztBQUNBOztBQUNBLFNBQU9ILFVBQVUsQ0FBQ0csVUFBWCxDQUFzQk0sTUFBdEIsQ0FBNkI7QUFBQ3RFLElBQUFBLFFBQVEsRUFBRTZELFVBQVUsQ0FBQzdEO0FBQXRCLEdBQTdCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCAnQGxvYWRlcnMuZ2wvcG9seWZpbGxzJztcbmltcG9ydCB7cGFyc2VJbkJhdGNoZXN9IGZyb20gJ0Bsb2FkZXJzLmdsL2NvcmUnO1xuaW1wb3J0IHtKU09OTG9hZGVyLCBfSlNPTlBhdGh9IGZyb20gJ0Bsb2FkZXJzLmdsL2pzb24nO1xuaW1wb3J0IHtDU1ZMb2FkZXJ9IGZyb20gJ0Bsb2FkZXJzLmdsL2Nzdic7XG5pbXBvcnQge3Byb2Nlc3NHZW9qc29uLCBwcm9jZXNzS2VwbGVyZ2xKU09OLCBwcm9jZXNzUm93T2JqZWN0fSBmcm9tICcuL2RhdGEtcHJvY2Vzc29yJztcbmltcG9ydCB7aXNQbGFpbk9iamVjdCwgZ2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7REFUQVNFVF9GT1JNQVRTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IEJBVENIX1RZUEUgPSB7XG4gIE1FVEFEQVRBOiAnbWV0YWRhdGEnLFxuICBQQVJUSUFMX1JFU1VMVDogJ3BhcnRpYWwtcmVzdWx0JyxcbiAgRklOQUxfUkVTVUxUOiAnZmluYWwtcmVzdWx0J1xufTtcblxuY29uc3QgQ1NWX0xPQURFUl9PUFRJT05TID0ge1xuICBiYXRjaFNpemU6IDQwMDAsIC8vIEF1dG8gZGUgdGVjdCBudW1iZXIgb2Ygcm93cyBwZXIgYmF0Y2ggKG5ldHdvcmsgYmF0Y2ggc2l6ZSlcbiAgcm93Rm9ybWF0OiAnb2JqZWN0JyxcbiAgZHluYW1pY1R5cGluZzogZmFsc2UgLy8gbm90IHdvcmtpbmcgZm9yIG5vd1xufTtcblxuY29uc3QgSlNPTl9MT0FERVJfT1BUSU9OUyA9IHtcbiAgLy8gaW5zdHJ1Y3QgbG9hZGVycy5nbCBvbiB3aGF0IGpzb24gcGF0aHMgdG8gc3RyZWFtXG4gIGpzb25wYXRoczogW1xuICAgICckJywgLy8gSlNPTiBSb3cgYXJyYXlcbiAgICAnJC5mZWF0dXJlcycsIC8vIEdlb0pTT05cbiAgICAnJC5kYXRhc2V0cycgLy8gS2VwbGVyR0wgSlNPTlxuICBdXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNHZW9Kc29uKGpzb24pIHtcbiAgLy8ganNvbiBjYW4gYmUgZmVhdHVyZSBjb2xsZWN0aW9uXG4gIC8vIG9yIHNpbmdsZSBmZWF0dXJlXG4gIHJldHVybiBpc1BsYWluT2JqZWN0KGpzb24pICYmIChpc0ZlYXR1cmUoanNvbikgfHwgaXNGZWF0dXJlQ29sbGVjdGlvbihqc29uKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZlYXR1cmUoanNvbikge1xuICByZXR1cm4ganNvbi50eXBlID09PSAnRmVhdHVyZScgJiYganNvbi5nZW9tZXRyeTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmVhdHVyZUNvbGxlY3Rpb24oanNvbikge1xuICByZXR1cm4ganNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nICYmIGpzb24uZmVhdHVyZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Jvd09iamVjdChqc29uKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGpzb24pICYmIGlzUGxhaW5PYmplY3QoanNvblswXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tlcGxlckdsTWFwKGpzb24pIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgaXNQbGFpbk9iamVjdChqc29uKSAmJlxuICAgICAganNvbi5kYXRhc2V0cyAmJlxuICAgICAganNvbi5jb25maWcgJiZcbiAgICAgIGpzb24uaW5mbyAmJlxuICAgICAganNvbi5pbmZvLmFwcCA9PT0gJ2tlcGxlci5nbCdcbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uKiBtYWtlUHJvZ3Jlc3NJdGVyYXRvcihhc3luY0l0ZXJhdG9yLCBpbmZvKSB7XG4gIGxldCByb3dDb3VudCA9IDA7XG5cbiAgZm9yIGF3YWl0IChjb25zdCBiYXRjaCBvZiBhc3luY0l0ZXJhdG9yKSB7XG4gICAgY29uc3Qgcm93Q291bnRJbkJhdGNoID0gKGJhdGNoLmRhdGEgJiYgYmF0Y2guZGF0YS5sZW5ndGgpIHx8IDA7XG4gICAgcm93Q291bnQgKz0gcm93Q291bnRJbkJhdGNoO1xuICAgIGNvbnN0IHBlcmNlbnQgPSBOdW1iZXIuaXNGaW5pdGUoYmF0Y2guYnl0ZXNVc2VkKSA/IGJhdGNoLmJ5dGVzVXNlZCAvIGluZm8uc2l6ZSA6IG51bGw7XG5cbiAgICAvLyBVcGRhdGUgcHJvZ3Jlc3Mgb2JqZWN0XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB7XG4gICAgICByb3dDb3VudCxcbiAgICAgIHJvd0NvdW50SW5CYXRjaCxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIC4uLihOdW1iZXIuaXNGaW5pdGUocGVyY2VudCkgPyB7cGVyY2VudH0gOiB7fSlcbiAgICB9O1xuXG4gICAgeWllbGQgey4uLmJhdGNoLCBwcm9ncmVzc307XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiogcmVhZEJhdGNoKGFzeW5jSXRlcmF0b3IsIGZpbGVOYW1lKSB7XG4gIGxldCByZXN1bHQgPSBudWxsO1xuICBjb25zdCBiYXRjaGVzID0gW107XG5cbiAgZm9yIGF3YWl0IChjb25zdCBiYXRjaCBvZiBhc3luY0l0ZXJhdG9yKSB7XG4gICAgLy8gTGFzdCBiYXRjaCB3aWxsIGhhdmUgdGhpcyBzcGVjaWFsIHR5cGUgYW5kIHdpbGwgcHJvdmlkZSBhbGwgdGhlIHJvb3RcbiAgICAvLyBwcm9wZXJ0aWVzIG9mIHRoZSBwYXJzZWQgZG9jdW1lbnQuXG4gICAgLy8gT25seSBqc29uIHBhcnNlIHdpbGwgaGF2ZSBgRklOQUxfUkVTVUxUYFxuICAgIGlmIChiYXRjaC5iYXRjaFR5cGUgPT09IEJBVENIX1RZUEUuRklOQUxfUkVTVUxUKSB7XG4gICAgICBpZiAoYmF0Y2guY29udGFpbmVyKSB7XG4gICAgICAgIHJlc3VsdCA9IHsuLi5iYXRjaC5jb250YWluZXJ9O1xuICAgICAgfVxuICAgICAgLy8gU2V0IHRoZSBzdHJlYW1lZCBkYXRhIGNvcnJlY3RseSBpcyBCYXRjaCBqc29uIHBhdGggaXMgc2V0XG4gICAgICAvLyBhbmQgdGhlIHBhdGggc3RyZWFtZWQgaXMgbm90IHRoZSB0b3AgbGV2ZWwgb2JqZWN0IChqc29ucGF0aCA9ICckJylcbiAgICAgIGlmIChiYXRjaC5qc29ucGF0aCAmJiBiYXRjaC5qc29ucGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHN0cmVhbWluZ1BhdGggPSBuZXcgX0pTT05QYXRoKGJhdGNoLmpzb25wYXRoKTtcbiAgICAgICAgc3RyZWFtaW5nUGF0aC5zZXRGaWVsZEF0UGF0aChyZXN1bHQsIGJhdGNoZXMpO1xuICAgICAgfSBlbHNlIGlmIChiYXRjaC5qc29ucGF0aCAmJiBiYXRjaC5qc29ucGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgLy8gVGhlIHN0cmVhbWVkIG9iamVjdCBpcyBhIFJPVyBKU09OLWJhdGNoIChqc29ucGF0aCA9ICckJylcbiAgICAgICAgLy8gcm93IG9iamVjdHNcbiAgICAgICAgcmVzdWx0ID0gYmF0Y2hlcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYXRjaC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJhdGNoZXMucHVzaChiYXRjaC5kYXRhW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB5aWVsZCB7XG4gICAgICAuLi5iYXRjaCxcbiAgICAgIC4uLihiYXRjaC5zY2hlbWEgPyB7aGVhZGVyczogT2JqZWN0LmtleXMoYmF0Y2guc2NoZW1hKX0gOiB7fSksXG4gICAgICBmaWxlTmFtZSxcbiAgICAgIC8vIGlmIGRhdGFzZXQgaXMgQ1NWLCBkYXRhIGlzIHNldCB0byB0aGUgcmF3IGJhdGNoZXNcbiAgICAgIGRhdGE6IHJlc3VsdCA/IHJlc3VsdCA6IGJhdGNoZXNcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkRmlsZUluQmF0Y2hlcyh7ZmlsZSwgZmlsZUNhY2hlID0gW10sIGxvYWRlcnMgPSBbXSwgbG9hZE9wdGlvbnMgPSB7fX0pIHtcbiAgbG9hZGVycyA9IFtKU09OTG9hZGVyLCBDU1ZMb2FkZXIsIC4uLmxvYWRlcnNdO1xuICBsb2FkT3B0aW9ucyA9IHtcbiAgICBjc3Y6IENTVl9MT0FERVJfT1BUSU9OUyxcbiAgICBqc29uOiBKU09OX0xPQURFUl9PUFRJT05TLFxuICAgIG1ldGFkYXRhOiB0cnVlLFxuICAgIC4uLmxvYWRPcHRpb25zXG4gIH07XG5cbiAgY29uc3QgYmF0Y2hJdGVyYXRvciA9IGF3YWl0IHBhcnNlSW5CYXRjaGVzKGZpbGUsIGxvYWRlcnMsIGxvYWRPcHRpb25zKTtcbiAgY29uc3QgcHJvZ3Jlc3NJdGVyYXRvciA9IG1ha2VQcm9ncmVzc0l0ZXJhdG9yKGJhdGNoSXRlcmF0b3IsIHtzaXplOiBmaWxlLnNpemV9KTtcblxuICByZXR1cm4gcmVhZEJhdGNoKHByb2dyZXNzSXRlcmF0b3IsIGZpbGUubmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRmlsZURhdGEoe2NvbnRlbnQsIGZpbGVDYWNoZX0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB7ZGF0YX0gPSBjb250ZW50O1xuXG4gICAgbGV0IGZvcm1hdDtcbiAgICBsZXQgcHJvY2Vzc29yO1xuICAgIGlmIChpc0tlcGxlckdsTWFwKGRhdGEpKSB7XG4gICAgICBmb3JtYXQgPSBEQVRBU0VUX0ZPUk1BVFMua2VwbGVyZ2w7XG4gICAgICBwcm9jZXNzb3IgPSBwcm9jZXNzS2VwbGVyZ2xKU09OO1xuICAgIH0gZWxzZSBpZiAoaXNSb3dPYmplY3QoZGF0YSkpIHtcbiAgICAgIGZvcm1hdCA9IERBVEFTRVRfRk9STUFUUy5yb3c7XG4gICAgICBwcm9jZXNzb3IgPSBwcm9jZXNzUm93T2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoaXNHZW9Kc29uKGRhdGEpKSB7XG4gICAgICBmb3JtYXQgPSBEQVRBU0VUX0ZPUk1BVFMuZ2VvanNvbjtcbiAgICAgIHByb2Nlc3NvciA9IHByb2Nlc3NHZW9qc29uO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQgJiYgcHJvY2Vzc29yKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IoZGF0YSk7XG5cbiAgICAgIHJlc29sdmUoW1xuICAgICAgICAuLi5maWxlQ2FjaGUsXG4gICAgICAgIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgICAgaW5mbzoge1xuICAgICAgICAgICAgbGFiZWw6IGNvbnRlbnQuZmlsZU5hbWUsXG4gICAgICAgICAgICBmb3JtYXRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH1cblxuICAgIHJlamVjdCgnVW5rbm93IEZpbGUgRm9ybWF0Jyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZXNUb0RhdGFQYXlsb2FkKGZpbGVDYWNoZSkge1xuICAvLyBzZXBlcmF0ZSBvdXQgZmlsZXMgd2hpY2ggY291bGQgYmUgYSBzaW5nbGUgZGF0YXNldHMuIG9yIGEga2VwbGVyZ2wgbWFwIGpzb25cbiAgY29uc3QgY29sbGVjdGlvbiA9IGZpbGVDYWNoZS5yZWR1Y2UoXG4gICAgKGFjY3UsIGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHtkYXRhLCBpbmZvID0ge319ID0gZmlsZTtcbiAgICAgIGNvbnN0IHtmb3JtYXR9ID0gaW5mbztcbiAgICAgIGlmIChmb3JtYXQgPT09IERBVEFTRVRfRk9STUFUUy5rZXBsZXJnbCkge1xuICAgICAgICAvLyBpZiBmaWxlIGNvbnRhaW5zIGEgc2luZ2xlIGtlcGxlciBtYXAgZGF0YXNldCAmIGNvbmZpZ1xuICAgICAgICBhY2N1LmtlcGxlck1hcHMucHVzaCh7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjZW50ZXJNYXA6ICEoZGF0YS5jb25maWcgJiYgZGF0YS5jb25maWcubWFwU3RhdGUpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoREFUQVNFVF9GT1JNQVRTW2Zvcm1hdF0pIHtcbiAgICAgICAgLy8gaWYgZmlsZSBjb250YWlucyBvbmx5IGRhdGFcbiAgICAgICAgY29uc3QgbmV3RGF0YXNldCA9IHtcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGluZm86IHtcbiAgICAgICAgICAgIGlkOiBpbmZvLmlkIHx8IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgICAgICAgICAgLi4uaW5mb1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYWNjdS5kYXRhc2V0cy5wdXNoKG5ld0RhdGFzZXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSxcbiAgICB7ZGF0YXNldHM6IFtdLCBrZXBsZXJNYXBzOiBbXX1cbiAgKTtcblxuICAvLyBhZGQga2VwbGVyIG1hcCBmaXJzdCB3aXRoIGNvbmZpZ1xuICAvLyBhZGQgZGF0YXNldHMgbGF0ZXIgaW4gb25lIGFkZCBkYXRhIGNhbGxcbiAgcmV0dXJuIGNvbGxlY3Rpb24ua2VwbGVyTWFwcy5jb25jYXQoe2RhdGFzZXRzOiBjb2xsZWN0aW9uLmRhdGFzZXRzfSk7XG59XG4iXX0=