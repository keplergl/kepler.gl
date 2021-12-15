"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSuffixAndDelimiters = removeSuffixAndDelimiters;
exports.findPointFieldPairs = findPointFieldPairs;
exports.sortDatasetByColumn = sortDatasetByColumn;
exports.copyTable = copyTable;
exports.copyTableAndUpdate = copyTableAndUpdate;
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _console = require("global/console");

var _defaultSettings = require("../../constants/default-settings");

var _d3Array = require("d3-array");

var _utils = require("../utils");

var _gpuFilterUtils = require("../gpu-filter-utils");

var _filterUtils = require("../filter-utils");

var _dataUtils = require("../data-utils");

var _dataScaleUtils = require("../data-scale-utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Unique identifier of each field
var FID_KEY = 'name';
/** @typedef {import('./kepler-table').KeplerTable} KeplerTableClass} */

/**
 * @type {KeplerTableClass}
 */

var KeplerTable = /*#__PURE__*/function () {
  function KeplerTable(_ref) {
    var _ref$info = _ref.info,
        info = _ref$info === void 0 ? {} : _ref$info,
        data = _ref.data,
        color = _ref.color,
        metadata = _ref.metadata;
    (0, _classCallCheck2["default"])(this, KeplerTable);
    // TODO - what to do if validation fails? Can kepler handle exceptions?
    // const validatedData = validateInputData(data);
    // if (!validatedData) {
    //   return this;
    // }
    var allData = data.rows;

    var datasetInfo = _objectSpread({
      id: (0, _utils.generateHashId)(4),
      label: 'new dataset'
    }, info || {});

    var dataId = datasetInfo.id;
    var fields = data.fields.map(function (f, i) {
      return _objectSpread(_objectSpread({}, f), {}, {
        fieldIdx: i,
        id: f.name,
        displayName: f.displayName || f.name,
        valueAccessor: _dataUtils.maybeToDate.bind(null, // is time
        f.type === _defaultSettings.ALL_FIELD_TYPES.timestamp, i, f.format)
      });
    });
    var allIndexes = allData.map(function (_, i) {
      return i;
    });
    this.id = datasetInfo.id;
    this.label = datasetInfo.label;
    this.color = color;
    this.metadata = _objectSpread(_objectSpread({}, metadata), {}, {
      id: datasetInfo.id,
      label: datasetInfo.label
    });
    this.allData = allData;
    this.allIndexes = allIndexes;
    this.filteredIndex = allIndexes;
    this.filteredIndexForDomain = allIndexes;
    this.fieldPairs = findPointFieldPairs(fields);
    this.fields = fields;
    this.gpuFilter = (0, _gpuFilterUtils.getGpuFilterProps)([], dataId, fields);
  }
  /**
   * Get field
   * @param columnName
   */


  (0, _createClass2["default"])(KeplerTable, [{
    key: "getColumnField",
    value: function getColumnField(columnName) {
      var field = this.fields.find(function (fd) {
        return fd[FID_KEY] === columnName;
      });

      this._assetField(columnName, field);

      return field;
    }
    /**
     * Get fieldIdx
     * @param columnName
     */

  }, {
    key: "getColumnFieldIdx",
    value: function getColumnFieldIdx(columnName) {
      var fieldIdx = this.fields.findIndex(function (fd) {
        return fd[FID_KEY] === columnName;
      });

      this._assetField(columnName, Boolean(fieldIdx > -1));

      return fieldIdx;
    }
    /**
     * Get the value of a cell
     */

  }, {
    key: "getValue",
    value: function getValue(columnName, rowIdx) {
      var field = this.getColumnField(columnName);
      return field ? field.valueAccessor(this.allData[rowIdx]) : null;
    }
    /**
     * Updates existing field with a new object
     * @param fieldIdx
     * @param newField
     */

  }, {
    key: "updateColumnField",
    value: function updateColumnField(fieldIdx, newField) {
      this.fields = Object.assign((0, _toConsumableArray2["default"])(this.fields), (0, _defineProperty2["default"])({}, fieldIdx, newField));
    }
    /**
     * Save filterProps to field and retrieve it
     * @param {string} columnName
     */

  }, {
    key: "getColumnFilterProps",
    value: function getColumnFilterProps(columnName) {
      var fieldIdx = this.getColumnFieldIdx(columnName);

      if (fieldIdx < 0) {
        return null;
      }

      var field = this.fields[fieldIdx];

      if (field.hasOwnProperty('filterProps')) {
        return field.filterProps;
      }

      var fieldDomain = this.getColumnFilterDomain(field);

      if (!fieldDomain) {
        return null;
      }

      var filterProps = (0, _filterUtils.getFilterProps)(field, fieldDomain);

      var newField = _objectSpread(_objectSpread({}, field), {}, {
        filterProps: filterProps
      });

      this.updateColumnField(fieldIdx, newField);
      return filterProps;
    }
    /**
     *
     * Apply filters to dataset, return the filtered dataset with updated `gpuFilter`, `filterRecord`, `filteredIndex`, `filteredIndexForDomain`
     * @param filters
     * @param layers
     * @param opt
     */

  }, {
    key: "filterTable",
    value: function filterTable(filters, layers, opt) {
      var _this = this;

      var allData = this.allData,
          dataId = this.id,
          oldFilterRecord = this.filterRecord,
          fields = this.fields; // if there is no filters

      var filterRecord = (0, _filterUtils.getFilterRecord)(dataId, filters, opt || {});
      this.filterRecord = filterRecord;
      this.gpuFilter = (0, _gpuFilterUtils.getGpuFilterProps)(filters, dataId, fields); // const newDataset = set(['filterRecord'], filterRecord, dataset);

      if (!filters.length) {
        this.filteredIndex = this.allIndexes;
        this.filteredIndexForDomain = this.allIndexes;
        return this;
      }

      this.changedFilters = (0, _filterUtils.diffFilters)(filterRecord, oldFilterRecord); // generate 2 sets of filter result
      // filteredIndex used to calculate layer data
      // filteredIndexForDomain used to calculate layer Domain

      var shouldCalDomain = Boolean(this.changedFilters.dynamicDomain);
      var shouldCalIndex = Boolean(this.changedFilters.cpu);
      var filterResult = {};

      if (shouldCalDomain || shouldCalIndex) {
        var dynamicDomainFilters = shouldCalDomain ? filterRecord.dynamicDomain : null;
        var cpuFilters = shouldCalIndex ? filterRecord.cpu : null;
        var filterFuncs = filters.reduce(function (acc, filter) {
          var fieldIndex = (0, _gpuFilterUtils.getDatasetFieldIndexForFilter)(_this.id, filter);
          var field = fieldIndex !== -1 ? fields[fieldIndex] : null;
          return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, filter.id, (0, _filterUtils.getFilterFunction)(field, _this.id, filter, layers)));
        }, {});
        filterResult = (0, _filterUtils.filterDataByFilterTypes)({
          dynamicDomainFilters: dynamicDomainFilters,
          cpuFilters: cpuFilters,
          filterFuncs: filterFuncs
        }, allData);
      }

      this.filteredIndex = filterResult.filteredIndex || this.filteredIndex;
      this.filteredIndexForDomain = filterResult.filteredIndexForDomain || this.filteredIndexForDomain;
      return this;
    }
    /**
     * Apply filters to a dataset all on CPU, assign to `filteredIdxCPU`, `filterRecordCPU`
     * @param filters
     * @param layers
     */

  }, {
    key: "filterTableCPU",
    value: function filterTableCPU(filters, layers) {
      var opt = {
        cpuOnly: true,
        ignoreDomain: true
      }; // no filter

      if (!filters.length) {
        this.filteredIdxCPU = this.allIndexes;
        this.filterRecordCPU = (0, _filterUtils.getFilterRecord)(this.id, filters, opt);
        return this;
      } // no gpu filter


      if (!filters.find(function (f) {
        return f.gpu;
      })) {
        this.filteredIdxCPU = this.filteredIndex;
        this.filterRecordCPU = (0, _filterUtils.getFilterRecord)(this.id, filters, opt);
        return this;
      } // make a copy for cpu filtering


      var copied = copyTable(this);
      copied.filterRecord = this.filterRecordCPU;
      copied.filteredIndex = this.filteredIdxCPU || [];
      var filtered = copied.filterTable(filters, layers, opt);
      this.filteredIdxCPU = filtered.filteredIndex;
      this.filterRecordCPU = filtered.filterRecord;
      return this;
    }
    /**
     * Calculate field domain based on field type and data
     * for Filter
     */

  }, {
    key: "getColumnFilterDomain",
    value: function getColumnFilterDomain(field) {
      var allData = this.allData;
      var valueAccessor = field.valueAccessor;
      var domain;

      switch (field.type) {
        case _defaultSettings.ALL_FIELD_TYPES.real:
        case _defaultSettings.ALL_FIELD_TYPES.integer:
          // calculate domain and step
          return (0, _filterUtils.getNumericFieldDomain)(allData, valueAccessor);

        case _defaultSettings.ALL_FIELD_TYPES["boolean"]:
          return {
            domain: [true, false]
          };

        case _defaultSettings.ALL_FIELD_TYPES.array:
        case _defaultSettings.ALL_FIELD_TYPES.string:
        case _defaultSettings.ALL_FIELD_TYPES.date:
          domain = (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor);
          return {
            domain: domain
          };

        case _defaultSettings.ALL_FIELD_TYPES.timestamp:
          return (0, _filterUtils.getTimestampFieldDomain)(allData, valueAccessor);

        default:
          return {
            domain: (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor)
          };
      }
    }
    /**
     *  Get the domain of this column based on scale type
     */

  }, {
    key: "getColumnLayerDomain",
    value: function getColumnLayerDomain(field, scaleType) {
      var allData = this.allData,
          filteredIndexForDomain = this.filteredIndexForDomain;

      if (!_defaultSettings.SCALE_TYPES[scaleType]) {
        _console.console.error("scale type ".concat(scaleType, " not supported"));

        return null;
      }

      var valueAccessor = field.valueAccessor;

      var indexValueAccessor = function indexValueAccessor(i) {
        return valueAccessor(allData[i]);
      };

      var sortFunction = (0, _dataUtils.getSortingFunction)(field.type);

      switch (scaleType) {
        case _defaultSettings.SCALE_TYPES.ordinal:
        case _defaultSettings.SCALE_TYPES.point:
          // do not recalculate ordinal domain based on filtered data
          // don't need to update ordinal domain every time
          return (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor);

        case _defaultSettings.SCALE_TYPES.quantile:
          return (0, _dataScaleUtils.getQuantileDomain)(filteredIndexForDomain, indexValueAccessor, sortFunction);

        case _defaultSettings.SCALE_TYPES.log:
          return (0, _dataScaleUtils.getLogDomain)(filteredIndexForDomain, indexValueAccessor);

        case _defaultSettings.SCALE_TYPES.quantize:
        case _defaultSettings.SCALE_TYPES.linear:
        case _defaultSettings.SCALE_TYPES.sqrt:
        default:
          return (0, _dataScaleUtils.getLinearDomain)(filteredIndexForDomain, indexValueAccessor);
      }
    }
    /**
     * Get a sample of rows to calculate layer boundaries
     */
    // getSampleData(rows)

    /**
     * Parse cell value based on column type and return a string representation
     * Value the field value, type the field type
     */
    // parseFieldValue(value, type)
    // sortDatasetByColumn()

    /**
     * Assert whether field exist
     * @param fieldName
     * @param condition
     */

  }, {
    key: "_assetField",
    value: function _assetField(fieldName, condition) {
      if (!condition) {
        _console.console.error("".concat(fieldName, " doesnt exist in dataset ").concat(this.id));
      }
    }
  }]);
  return KeplerTable;
}(); // HELPER FUNCTIONS (MAINLY EXPORTED FOR TEST...)


function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName.replace(new RegExp(suffix, 'ig'), '').replace(/[_,.]+/g, ' ').trim();
}
/**
 * Find point fields pairs from fields
 *
 * @param fields
 * @returns found point fields
 * @type {typeof import('./kepler-table').findPointFieldPairs}
 */


function findPointFieldPairs(fields) {
  var allNames = fields.map(function (f) {
    return f.name.toLowerCase();
  }); // get list of all fields with matching suffixes

  return allNames.reduce(function (carry, fieldName, idx) {
    // This search for pairs will early exit if found.
    var _iterator = _createForOfIteratorHelper(_defaultSettings.TRIP_POINT_FIELDS),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return carry;
  }, []);
}
/**
 *
 * @param dataset
 * @param column
 * @param mode
 * @type {typeof import('./kepler-table').sortDatasetByColumn}
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
    return _objectSpread(_objectSpread({}, dataset), {}, {
      sortColumn: {},
      sortOrder: null
    });
  }

  var sortFunction = sortBy === _defaultSettings.SORT_ORDER.ASCENDING ? _d3Array.ascending : _d3Array.descending;
  var sortOrder = allIndexes.slice().sort(function (a, b) {
    return sortFunction(allData[a][fieldIndex], allData[b][fieldIndex]);
  });
  return _objectSpread(_objectSpread({}, dataset), {}, {
    sortColumn: (0, _defineProperty2["default"])({}, column, sortBy),
    sortOrder: sortOrder
  });
}

function copyTable(original) {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}

function copyTableAndUpdate(original) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.entries(options).reduce(function (acc, entry) {
    acc[entry[0]] = entry[1];
    return acc;
  }, copyTable(original));
}

var _default = KeplerTable;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy90YWJsZS11dGlscy9rZXBsZXItdGFibGUuanMiXSwibmFtZXMiOlsiRklEX0tFWSIsIktlcGxlclRhYmxlIiwiaW5mbyIsImRhdGEiLCJjb2xvciIsIm1ldGFkYXRhIiwiYWxsRGF0YSIsInJvd3MiLCJkYXRhc2V0SW5mbyIsImlkIiwibGFiZWwiLCJkYXRhSWQiLCJmaWVsZHMiLCJtYXAiLCJmIiwiaSIsImZpZWxkSWR4IiwibmFtZSIsImRpc3BsYXlOYW1lIiwidmFsdWVBY2Nlc3NvciIsIm1heWJlVG9EYXRlIiwiYmluZCIsInR5cGUiLCJBTExfRklFTERfVFlQRVMiLCJ0aW1lc3RhbXAiLCJmb3JtYXQiLCJhbGxJbmRleGVzIiwiXyIsImZpbHRlcmVkSW5kZXgiLCJmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIiwiZmllbGRQYWlycyIsImZpbmRQb2ludEZpZWxkUGFpcnMiLCJncHVGaWx0ZXIiLCJjb2x1bW5OYW1lIiwiZmllbGQiLCJmaW5kIiwiZmQiLCJfYXNzZXRGaWVsZCIsImZpbmRJbmRleCIsIkJvb2xlYW4iLCJyb3dJZHgiLCJnZXRDb2x1bW5GaWVsZCIsIm5ld0ZpZWxkIiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0Q29sdW1uRmllbGRJZHgiLCJoYXNPd25Qcm9wZXJ0eSIsImZpbHRlclByb3BzIiwiZmllbGREb21haW4iLCJnZXRDb2x1bW5GaWx0ZXJEb21haW4iLCJ1cGRhdGVDb2x1bW5GaWVsZCIsImZpbHRlcnMiLCJsYXllcnMiLCJvcHQiLCJvbGRGaWx0ZXJSZWNvcmQiLCJmaWx0ZXJSZWNvcmQiLCJsZW5ndGgiLCJjaGFuZ2VkRmlsdGVycyIsInNob3VsZENhbERvbWFpbiIsImR5bmFtaWNEb21haW4iLCJzaG91bGRDYWxJbmRleCIsImNwdSIsImZpbHRlclJlc3VsdCIsImR5bmFtaWNEb21haW5GaWx0ZXJzIiwiY3B1RmlsdGVycyIsImZpbHRlckZ1bmNzIiwicmVkdWNlIiwiYWNjIiwiZmlsdGVyIiwiZmllbGRJbmRleCIsImNwdU9ubHkiLCJpZ25vcmVEb21haW4iLCJmaWx0ZXJlZElkeENQVSIsImZpbHRlclJlY29yZENQVSIsImdwdSIsImNvcGllZCIsImNvcHlUYWJsZSIsImZpbHRlcmVkIiwiZmlsdGVyVGFibGUiLCJkb21haW4iLCJyZWFsIiwiaW50ZWdlciIsImFycmF5Iiwic3RyaW5nIiwiZGF0ZSIsInNjYWxlVHlwZSIsIlNDQUxFX1RZUEVTIiwiQ29uc29sZSIsImVycm9yIiwiaW5kZXhWYWx1ZUFjY2Vzc29yIiwic29ydEZ1bmN0aW9uIiwib3JkaW5hbCIsInBvaW50IiwicXVhbnRpbGUiLCJsb2ciLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJmaWVsZE5hbWUiLCJjb25kaXRpb24iLCJyZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzIiwibGF5ZXJOYW1lIiwic3VmZml4IiwicmVwbGFjZSIsIlJlZ0V4cCIsInRyaW0iLCJhbGxOYW1lcyIsInRvTG93ZXJDYXNlIiwiY2FycnkiLCJpZHgiLCJUUklQX1BPSU5UX0ZJRUxEUyIsInN1ZmZpeFBhaXIiLCJlbmRzV2l0aCIsIm90aGVyUGF0dGVybiIsInBhcnRuZXIiLCJwYXJ0bmVySWR4IiwiZCIsImRlZmF1bHROYW1lIiwicHVzaCIsInBhaXIiLCJsYXQiLCJ2YWx1ZSIsImxuZyIsInNvcnREYXRhc2V0QnlDb2x1bW4iLCJkYXRhc2V0IiwiY29sdW1uIiwibW9kZSIsInNvcnRCeSIsIlNPUlRfT1JERVIiLCJBU0NFTkRJTkciLCJVTlNPUlQiLCJzb3J0Q29sdW1uIiwic29ydE9yZGVyIiwiYXNjZW5kaW5nIiwiZGVzY2VuZGluZyIsInNsaWNlIiwic29ydCIsImEiLCJiIiwib3JpZ2luYWwiLCJjcmVhdGUiLCJnZXRQcm90b3R5cGVPZiIsImNvcHlUYWJsZUFuZFVwZGF0ZSIsIm9wdGlvbnMiLCJlbnRyaWVzIiwiZW50cnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFHQTs7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QixFQUFvRDtBQUFBLE1BQWRJLE9BQWMsdUVBQUosRUFBSTtBQUN6RCxTQUFPcEcsTUFBTSxDQUFDcUcsT0FBUCxDQUFlRCxPQUFmLEVBQXdCN0UsTUFBeEIsQ0FBK0IsVUFBQ0MsR0FBRCxFQUFNOEUsS0FBTixFQUFnQjtBQUNwRDlFLElBQUFBLEdBQUcsQ0FBQzhFLEtBQUssQ0FBQyxDQUFELENBQU4sQ0FBSCxHQUFnQkEsS0FBSyxDQUFDLENBQUQsQ0FBckI7QUFDQSxXQUFPOUUsR0FBUDtBQUNELEdBSE0sRUFHSlMsU0FBUyxDQUFDK0QsUUFBRCxDQUhMLENBQVA7QUFJRDs7ZUFFYzFJLFciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuaW1wb3J0IHtUUklQX1BPSU5UX0ZJRUxEUywgU09SVF9PUkRFUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHthc2NlbmRpbmcsIGRlc2NlbmRpbmd9IGZyb20gJ2QzLWFycmF5JztcblxuLy8gaW1wb3J0IHt2YWxpZGF0ZUlucHV0RGF0YX0gZnJvbSAncHJvY2Vzc29ycy9kYXRhLXByb2Nlc3Nvcic7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkfSBmcm9tICd1dGlscy91dGlscyc7XG5pbXBvcnQge2dldEdwdUZpbHRlclByb3BzLCBnZXREYXRhc2V0RmllbGRJbmRleEZvckZpbHRlcn0gZnJvbSAndXRpbHMvZ3B1LWZpbHRlci11dGlscyc7XG5pbXBvcnQge1xuICBnZXRGaWx0ZXJQcm9wcyxcbiAgZ2V0RmlsdGVyUmVjb3JkLFxuICBkaWZmRmlsdGVycyxcbiAgZ2V0RmlsdGVyRnVuY3Rpb24sXG4gIGZpbHRlckRhdGFCeUZpbHRlclR5cGVzLFxuICBnZXROdW1lcmljRmllbGREb21haW4sXG4gIGdldFRpbWVzdGFtcEZpZWxkRG9tYWluXG59IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge21heWJlVG9EYXRlLCBnZXRTb3J0aW5nRnVuY3Rpb259IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0UXVhbnRpbGVEb21haW4sXG4gIGdldE9yZGluYWxEb21haW4sXG4gIGdldExvZ0RvbWFpbixcbiAgZ2V0TGluZWFyRG9tYWluXG59IGZyb20gJ3V0aWxzL2RhdGEtc2NhbGUtdXRpbHMnO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFUywgU0NBTEVfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gVW5pcXVlIGlkZW50aWZpZXIgb2YgZWFjaCBmaWVsZFxuY29uc3QgRklEX0tFWSA9ICduYW1lJztcblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4va2VwbGVyLXRhYmxlJykuS2VwbGVyVGFibGV9IEtlcGxlclRhYmxlQ2xhc3N9ICovXG5cbi8qKlxuICogQHR5cGUge0tlcGxlclRhYmxlQ2xhc3N9XG4gKi9cbmNsYXNzIEtlcGxlclRhYmxlIHtcbiAgY29uc3RydWN0b3Ioe2luZm8gPSB7fSwgZGF0YSwgY29sb3IsIG1ldGFkYXRhfSkge1xuICAgIC8vIFRPRE8gLSB3aGF0IHRvIGRvIGlmIHZhbGlkYXRpb24gZmFpbHM/IENhbiBrZXBsZXIgaGFuZGxlIGV4Y2VwdGlvbnM/XG4gICAgLy8gY29uc3QgdmFsaWRhdGVkRGF0YSA9IHZhbGlkYXRlSW5wdXREYXRhKGRhdGEpO1xuICAgIC8vIGlmICghdmFsaWRhdGVkRGF0YSkge1xuICAgIC8vICAgcmV0dXJuIHRoaXM7XG4gICAgLy8gfVxuXG4gICAgY29uc3QgYWxsRGF0YSA9IGRhdGEucm93cztcbiAgICBjb25zdCBkYXRhc2V0SW5mbyA9IHtcbiAgICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICAgIGxhYmVsOiAnbmV3IGRhdGFzZXQnLFxuICAgICAgLi4uKGluZm8gfHwge30pXG4gICAgfTtcbiAgICBjb25zdCBkYXRhSWQgPSBkYXRhc2V0SW5mby5pZDtcblxuICAgIGNvbnN0IGZpZWxkcyA9IGRhdGEuZmllbGRzLm1hcCgoZiwgaSkgPT4gKHtcbiAgICAgIC4uLmYsXG4gICAgICBmaWVsZElkeDogaSxcbiAgICAgIGlkOiBmLm5hbWUsXG4gICAgICBkaXNwbGF5TmFtZTogZi5kaXNwbGF5TmFtZSB8fCBmLm5hbWUsXG4gICAgICB2YWx1ZUFjY2Vzc29yOiBtYXliZVRvRGF0ZS5iaW5kKFxuICAgICAgICBudWxsLFxuICAgICAgICAvLyBpcyB0aW1lXG4gICAgICAgIGYudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcCxcbiAgICAgICAgaSxcbiAgICAgICAgZi5mb3JtYXRcbiAgICAgIClcbiAgICB9KSk7XG5cbiAgICBjb25zdCBhbGxJbmRleGVzID0gYWxsRGF0YS5tYXAoKF8sIGkpID0+IGkpO1xuXG4gICAgdGhpcy5pZCA9IGRhdGFzZXRJbmZvLmlkO1xuICAgIHRoaXMubGFiZWwgPSBkYXRhc2V0SW5mby5sYWJlbDtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy5tZXRhZGF0YSA9IHtcbiAgICAgIC4uLm1ldGFkYXRhLFxuICAgICAgaWQ6IGRhdGFzZXRJbmZvLmlkLFxuICAgICAgbGFiZWw6IGRhdGFzZXRJbmZvLmxhYmVsXG4gICAgfTtcbiAgICB0aGlzLmFsbERhdGEgPSBhbGxEYXRhO1xuICAgIHRoaXMuYWxsSW5kZXhlcyA9IGFsbEluZGV4ZXM7XG4gICAgdGhpcy5maWx0ZXJlZEluZGV4ID0gYWxsSW5kZXhlcztcbiAgICB0aGlzLmZpbHRlcmVkSW5kZXhGb3JEb21haW4gPSBhbGxJbmRleGVzO1xuICAgIHRoaXMuZmllbGRQYWlycyA9IGZpbmRQb2ludEZpZWxkUGFpcnMoZmllbGRzKTtcbiAgICB0aGlzLmZpZWxkcyA9IGZpZWxkcztcbiAgICB0aGlzLmdwdUZpbHRlciA9IGdldEdwdUZpbHRlclByb3BzKFtdLCBkYXRhSWQsIGZpZWxkcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGZpZWxkXG4gICAqIEBwYXJhbSBjb2x1bW5OYW1lXG4gICAqL1xuICBnZXRDb2x1bW5GaWVsZChjb2x1bW5OYW1lKSB7XG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkcy5maW5kKGZkID0+IGZkW0ZJRF9LRVldID09PSBjb2x1bW5OYW1lKTtcbiAgICB0aGlzLl9hc3NldEZpZWxkKGNvbHVtbk5hbWUsIGZpZWxkKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGZpZWxkSWR4XG4gICAqIEBwYXJhbSBjb2x1bW5OYW1lXG4gICAqL1xuICBnZXRDb2x1bW5GaWVsZElkeChjb2x1bW5OYW1lKSB7XG4gICAgY29uc3QgZmllbGRJZHggPSB0aGlzLmZpZWxkcy5maW5kSW5kZXgoZmQgPT4gZmRbRklEX0tFWV0gPT09IGNvbHVtbk5hbWUpO1xuICAgIHRoaXMuX2Fzc2V0RmllbGQoY29sdW1uTmFtZSwgQm9vbGVhbihmaWVsZElkeCA+IC0xKSk7XG4gICAgcmV0dXJuIGZpZWxkSWR4O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBjZWxsXG4gICAqL1xuICBnZXRWYWx1ZShjb2x1bW5OYW1lLCByb3dJZHgpIHtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuZ2V0Q29sdW1uRmllbGQoY29sdW1uTmFtZSk7XG4gICAgcmV0dXJuIGZpZWxkID8gZmllbGQudmFsdWVBY2Nlc3Nvcih0aGlzLmFsbERhdGFbcm93SWR4XSkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgZXhpc3RpbmcgZmllbGQgd2l0aCBhIG5ldyBvYmplY3RcbiAgICogQHBhcmFtIGZpZWxkSWR4XG4gICAqIEBwYXJhbSBuZXdGaWVsZFxuICAgKi9cbiAgdXBkYXRlQ29sdW1uRmllbGQoZmllbGRJZHgsIG5ld0ZpZWxkKSB7XG4gICAgdGhpcy5maWVsZHMgPSBPYmplY3QuYXNzaWduKFsuLi50aGlzLmZpZWxkc10sIHtbZmllbGRJZHhdOiBuZXdGaWVsZH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgZmlsdGVyUHJvcHMgdG8gZmllbGQgYW5kIHJldHJpZXZlIGl0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2x1bW5OYW1lXG4gICAqL1xuICBnZXRDb2x1bW5GaWx0ZXJQcm9wcyhjb2x1bW5OYW1lKSB7XG4gICAgY29uc3QgZmllbGRJZHggPSB0aGlzLmdldENvbHVtbkZpZWxkSWR4KGNvbHVtbk5hbWUpO1xuICAgIGlmIChmaWVsZElkeCA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2ZpZWxkSWR4XTtcbiAgICBpZiAoZmllbGQuaGFzT3duUHJvcGVydHkoJ2ZpbHRlclByb3BzJykpIHtcbiAgICAgIHJldHVybiBmaWVsZC5maWx0ZXJQcm9wcztcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZERvbWFpbiA9IHRoaXMuZ2V0Q29sdW1uRmlsdGVyRG9tYWluKGZpZWxkKTtcbiAgICBpZiAoIWZpZWxkRG9tYWluKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJQcm9wcyA9IGdldEZpbHRlclByb3BzKGZpZWxkLCBmaWVsZERvbWFpbik7XG4gICAgY29uc3QgbmV3RmllbGQgPSB7XG4gICAgICAuLi5maWVsZCxcbiAgICAgIGZpbHRlclByb3BzXG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlQ29sdW1uRmllbGQoZmllbGRJZHgsIG5ld0ZpZWxkKTtcblxuICAgIHJldHVybiBmaWx0ZXJQcm9wcztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBBcHBseSBmaWx0ZXJzIHRvIGRhdGFzZXQsIHJldHVybiB0aGUgZmlsdGVyZWQgZGF0YXNldCB3aXRoIHVwZGF0ZWQgYGdwdUZpbHRlcmAsIGBmaWx0ZXJSZWNvcmRgLCBgZmlsdGVyZWRJbmRleGAsIGBmaWx0ZXJlZEluZGV4Rm9yRG9tYWluYFxuICAgKiBAcGFyYW0gZmlsdGVyc1xuICAgKiBAcGFyYW0gbGF5ZXJzXG4gICAqIEBwYXJhbSBvcHRcbiAgICovXG4gIGZpbHRlclRhYmxlKGZpbHRlcnMsIGxheWVycywgb3B0KSB7XG4gICAgY29uc3Qge2FsbERhdGEsIGlkOiBkYXRhSWQsIGZpbHRlclJlY29yZDogb2xkRmlsdGVyUmVjb3JkLCBmaWVsZHN9ID0gdGhpcztcblxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIGZpbHRlcnNcbiAgICBjb25zdCBmaWx0ZXJSZWNvcmQgPSBnZXRGaWx0ZXJSZWNvcmQoZGF0YUlkLCBmaWx0ZXJzLCBvcHQgfHwge30pO1xuXG4gICAgdGhpcy5maWx0ZXJSZWNvcmQgPSBmaWx0ZXJSZWNvcmQ7XG4gICAgdGhpcy5ncHVGaWx0ZXIgPSBnZXRHcHVGaWx0ZXJQcm9wcyhmaWx0ZXJzLCBkYXRhSWQsIGZpZWxkcyk7XG5cbiAgICAvLyBjb25zdCBuZXdEYXRhc2V0ID0gc2V0KFsnZmlsdGVyUmVjb3JkJ10sIGZpbHRlclJlY29yZCwgZGF0YXNldCk7XG5cbiAgICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZpbHRlcmVkSW5kZXggPSB0aGlzLmFsbEluZGV4ZXM7XG4gICAgICB0aGlzLmZpbHRlcmVkSW5kZXhGb3JEb21haW4gPSB0aGlzLmFsbEluZGV4ZXM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5nZWRGaWx0ZXJzID0gZGlmZkZpbHRlcnMoZmlsdGVyUmVjb3JkLCBvbGRGaWx0ZXJSZWNvcmQpO1xuXG4gICAgLy8gZ2VuZXJhdGUgMiBzZXRzIG9mIGZpbHRlciByZXN1bHRcbiAgICAvLyBmaWx0ZXJlZEluZGV4IHVzZWQgdG8gY2FsY3VsYXRlIGxheWVyIGRhdGFcbiAgICAvLyBmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIHVzZWQgdG8gY2FsY3VsYXRlIGxheWVyIERvbWFpblxuICAgIGNvbnN0IHNob3VsZENhbERvbWFpbiA9IEJvb2xlYW4odGhpcy5jaGFuZ2VkRmlsdGVycy5keW5hbWljRG9tYWluKTtcbiAgICBjb25zdCBzaG91bGRDYWxJbmRleCA9IEJvb2xlYW4odGhpcy5jaGFuZ2VkRmlsdGVycy5jcHUpO1xuXG4gICAgbGV0IGZpbHRlclJlc3VsdCA9IHt9O1xuICAgIGlmIChzaG91bGRDYWxEb21haW4gfHwgc2hvdWxkQ2FsSW5kZXgpIHtcbiAgICAgIGNvbnN0IGR5bmFtaWNEb21haW5GaWx0ZXJzID0gc2hvdWxkQ2FsRG9tYWluID8gZmlsdGVyUmVjb3JkLmR5bmFtaWNEb21haW4gOiBudWxsO1xuICAgICAgY29uc3QgY3B1RmlsdGVycyA9IHNob3VsZENhbEluZGV4ID8gZmlsdGVyUmVjb3JkLmNwdSA6IG51bGw7XG5cbiAgICAgIGNvbnN0IGZpbHRlckZ1bmNzID0gZmlsdGVycy5yZWR1Y2UoKGFjYywgZmlsdGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBnZXREYXRhc2V0RmllbGRJbmRleEZvckZpbHRlcih0aGlzLmlkLCBmaWx0ZXIpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkSW5kZXggIT09IC0xID8gZmllbGRzW2ZpZWxkSW5kZXhdIDogbnVsbDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICBbZmlsdGVyLmlkXTogZ2V0RmlsdGVyRnVuY3Rpb24oZmllbGQsIHRoaXMuaWQsIGZpbHRlciwgbGF5ZXJzKVxuICAgICAgICB9O1xuICAgICAgfSwge30pO1xuXG4gICAgICBmaWx0ZXJSZXN1bHQgPSBmaWx0ZXJEYXRhQnlGaWx0ZXJUeXBlcyhcbiAgICAgICAge2R5bmFtaWNEb21haW5GaWx0ZXJzLCBjcHVGaWx0ZXJzLCBmaWx0ZXJGdW5jc30sXG4gICAgICAgIGFsbERhdGFcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJlZEluZGV4ID0gZmlsdGVyUmVzdWx0LmZpbHRlcmVkSW5kZXggfHwgdGhpcy5maWx0ZXJlZEluZGV4O1xuICAgIHRoaXMuZmlsdGVyZWRJbmRleEZvckRvbWFpbiA9XG4gICAgICBmaWx0ZXJSZXN1bHQuZmlsdGVyZWRJbmRleEZvckRvbWFpbiB8fCB0aGlzLmZpbHRlcmVkSW5kZXhGb3JEb21haW47XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBmaWx0ZXJzIHRvIGEgZGF0YXNldCBhbGwgb24gQ1BVLCBhc3NpZ24gdG8gYGZpbHRlcmVkSWR4Q1BVYCwgYGZpbHRlclJlY29yZENQVWBcbiAgICogQHBhcmFtIGZpbHRlcnNcbiAgICogQHBhcmFtIGxheWVyc1xuICAgKi9cbiAgZmlsdGVyVGFibGVDUFUoZmlsdGVycywgbGF5ZXJzKSB7XG4gICAgY29uc3Qgb3B0ID0ge1xuICAgICAgY3B1T25seTogdHJ1ZSxcbiAgICAgIGlnbm9yZURvbWFpbjogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBubyBmaWx0ZXJcbiAgICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZpbHRlcmVkSWR4Q1BVID0gdGhpcy5hbGxJbmRleGVzO1xuICAgICAgdGhpcy5maWx0ZXJSZWNvcmRDUFUgPSBnZXRGaWx0ZXJSZWNvcmQodGhpcy5pZCwgZmlsdGVycywgb3B0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIG5vIGdwdSBmaWx0ZXJcbiAgICBpZiAoIWZpbHRlcnMuZmluZChmID0+IGYuZ3B1KSkge1xuICAgICAgdGhpcy5maWx0ZXJlZElkeENQVSA9IHRoaXMuZmlsdGVyZWRJbmRleDtcbiAgICAgIHRoaXMuZmlsdGVyUmVjb3JkQ1BVID0gZ2V0RmlsdGVyUmVjb3JkKHRoaXMuaWQsIGZpbHRlcnMsIG9wdCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBtYWtlIGEgY29weSBmb3IgY3B1IGZpbHRlcmluZ1xuICAgIGNvbnN0IGNvcGllZCA9IGNvcHlUYWJsZSh0aGlzKTtcblxuICAgIGNvcGllZC5maWx0ZXJSZWNvcmQgPSB0aGlzLmZpbHRlclJlY29yZENQVTtcbiAgICBjb3BpZWQuZmlsdGVyZWRJbmRleCA9IHRoaXMuZmlsdGVyZWRJZHhDUFUgfHwgW107XG5cbiAgICBjb25zdCBmaWx0ZXJlZCA9IGNvcGllZC5maWx0ZXJUYWJsZShmaWx0ZXJzLCBsYXllcnMsIG9wdCk7XG5cbiAgICB0aGlzLmZpbHRlcmVkSWR4Q1BVID0gZmlsdGVyZWQuZmlsdGVyZWRJbmRleDtcbiAgICB0aGlzLmZpbHRlclJlY29yZENQVSA9IGZpbHRlcmVkLmZpbHRlclJlY29yZDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBmaWVsZCBkb21haW4gYmFzZWQgb24gZmllbGQgdHlwZSBhbmQgZGF0YVxuICAgKiBmb3IgRmlsdGVyXG4gICAqL1xuICBnZXRDb2x1bW5GaWx0ZXJEb21haW4oZmllbGQpIHtcbiAgICBjb25zdCB7YWxsRGF0YX0gPSB0aGlzO1xuICAgIGNvbnN0IHt2YWx1ZUFjY2Vzc29yfSA9IGZpZWxkO1xuXG4gICAgbGV0IGRvbWFpbjtcblxuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXI6XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBkb21haW4gYW5kIHN0ZXBcbiAgICAgICAgcmV0dXJuIGdldE51bWVyaWNGaWVsZERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgICAgY2FzZSBBTExfRklFTERfVFlQRVMuYm9vbGVhbjpcbiAgICAgICAgcmV0dXJuIHtkb21haW46IFt0cnVlLCBmYWxzZV19O1xuXG4gICAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5hcnJheTpcbiAgICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnN0cmluZzpcbiAgICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmRhdGU6XG4gICAgICAgIGRvbWFpbiA9IGdldE9yZGluYWxEb21haW4oYWxsRGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgIHJldHVybiB7ZG9tYWlufTtcblxuICAgICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgICByZXR1cm4gZ2V0VGltZXN0YW1wRmllbGREb21haW4oYWxsRGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7ZG9tYWluOiBnZXRPcmRpbmFsRG9tYWluKGFsbERhdGEsIHZhbHVlQWNjZXNzb3IpfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEdldCB0aGUgZG9tYWluIG9mIHRoaXMgY29sdW1uIGJhc2VkIG9uIHNjYWxlIHR5cGVcbiAgICovXG4gIGdldENvbHVtbkxheWVyRG9tYWluKGZpZWxkLCBzY2FsZVR5cGUpIHtcbiAgICBjb25zdCB7YWxsRGF0YSwgZmlsdGVyZWRJbmRleEZvckRvbWFpbn0gPSB0aGlzO1xuXG4gICAgaWYgKCFTQ0FMRV9UWVBFU1tzY2FsZVR5cGVdKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGBzY2FsZSB0eXBlICR7c2NhbGVUeXBlfSBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7dmFsdWVBY2Nlc3Nvcn0gPSBmaWVsZDtcbiAgICBjb25zdCBpbmRleFZhbHVlQWNjZXNzb3IgPSBpID0+IHZhbHVlQWNjZXNzb3IoYWxsRGF0YVtpXSk7XG4gICAgY29uc3Qgc29ydEZ1bmN0aW9uID0gZ2V0U29ydGluZ0Z1bmN0aW9uKGZpZWxkLnR5cGUpO1xuXG4gICAgc3dpdGNoIChzY2FsZVR5cGUpIHtcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMub3JkaW5hbDpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucG9pbnQ6XG4gICAgICAgIC8vIGRvIG5vdCByZWNhbGN1bGF0ZSBvcmRpbmFsIGRvbWFpbiBiYXNlZCBvbiBmaWx0ZXJlZCBkYXRhXG4gICAgICAgIC8vIGRvbid0IG5lZWQgdG8gdXBkYXRlIG9yZGluYWwgZG9tYWluIGV2ZXJ5IHRpbWVcbiAgICAgICAgcmV0dXJuIGdldE9yZGluYWxEb21haW4oYWxsRGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpbGU6XG4gICAgICAgIHJldHVybiBnZXRRdWFudGlsZURvbWFpbihmaWx0ZXJlZEluZGV4Rm9yRG9tYWluLCBpbmRleFZhbHVlQWNjZXNzb3IsIHNvcnRGdW5jdGlvbik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMubG9nOlxuICAgICAgICByZXR1cm4gZ2V0TG9nRG9tYWluKGZpbHRlcmVkSW5kZXhGb3JEb21haW4sIGluZGV4VmFsdWVBY2Nlc3Nvcik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpemU6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLmxpbmVhcjpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMuc3FydDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBnZXRMaW5lYXJEb21haW4oZmlsdGVyZWRJbmRleEZvckRvbWFpbiwgaW5kZXhWYWx1ZUFjY2Vzc29yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgc2FtcGxlIG9mIHJvd3MgdG8gY2FsY3VsYXRlIGxheWVyIGJvdW5kYXJpZXNcbiAgICovXG4gIC8vIGdldFNhbXBsZURhdGEocm93cylcblxuICAvKipcbiAgICogUGFyc2UgY2VsbCB2YWx1ZSBiYXNlZCBvbiBjb2x1bW4gdHlwZSBhbmQgcmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAqIFZhbHVlIHRoZSBmaWVsZCB2YWx1ZSwgdHlwZSB0aGUgZmllbGQgdHlwZVxuICAgKi9cbiAgLy8gcGFyc2VGaWVsZFZhbHVlKHZhbHVlLCB0eXBlKVxuXG4gIC8vIHNvcnREYXRhc2V0QnlDb2x1bW4oKVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgd2hldGhlciBmaWVsZCBleGlzdFxuICAgKiBAcGFyYW0gZmllbGROYW1lXG4gICAqIEBwYXJhbSBjb25kaXRpb25cbiAgICovXG4gIF9hc3NldEZpZWxkKGZpZWxkTmFtZSwgY29uZGl0aW9uKSB7XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoYCR7ZmllbGROYW1lfSBkb2VzbnQgZXhpc3QgaW4gZGF0YXNldCAke3RoaXMuaWR9YCk7XG4gICAgfVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlMgKE1BSU5MWSBFWFBPUlRFRCBGT1IgVEVTVC4uLilcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMobGF5ZXJOYW1lLCBzdWZmaXgpIHtcbiAgcmV0dXJuIGxheWVyTmFtZVxuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoc3VmZml4LCAnaWcnKSwgJycpXG4gICAgLnJlcGxhY2UoL1tfLC5dKy9nLCAnICcpXG4gICAgLnRyaW0oKTtcbn1cblxuLyoqXG4gKiBGaW5kIHBvaW50IGZpZWxkcyBwYWlycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSBmaWVsZHNcbiAqIEByZXR1cm5zIGZvdW5kIHBvaW50IGZpZWxkc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4va2VwbGVyLXRhYmxlJykuZmluZFBvaW50RmllbGRQYWlyc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQb2ludEZpZWxkUGFpcnMoZmllbGRzKSB7XG4gIGNvbnN0IGFsbE5hbWVzID0gZmllbGRzLm1hcChmID0+IGYubmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuICAvLyBnZXQgbGlzdCBvZiBhbGwgZmllbGRzIHdpdGggbWF0Y2hpbmcgc3VmZml4ZXNcbiAgcmV0dXJuIGFsbE5hbWVzLnJlZHVjZSgoY2FycnksIGZpZWxkTmFtZSwgaWR4KSA9PiB7XG4gICAgLy8gVGhpcyBzZWFyY2ggZm9yIHBhaXJzIHdpbGwgZWFybHkgZXhpdCBpZiBmb3VuZC5cbiAgICBmb3IgKGNvbnN0IHN1ZmZpeFBhaXIgb2YgVFJJUF9QT0lOVF9GSUVMRFMpIHtcbiAgICAgIC8vIG1hdGNoIGZpcnN0IHN1ZmZpeGBgYFxuICAgICAgaWYgKGZpZWxkTmFtZS5lbmRzV2l0aChzdWZmaXhQYWlyWzBdKSkge1xuICAgICAgICAvLyBtYXRjaCBzZWNvbmQgc3VmZml4XG4gICAgICAgIGNvbnN0IG90aGVyUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7c3VmZml4UGFpclswXX1cXCRgKTtcbiAgICAgICAgY29uc3QgcGFydG5lciA9IGZpZWxkTmFtZS5yZXBsYWNlKG90aGVyUGF0dGVybiwgc3VmZml4UGFpclsxXSk7XG5cbiAgICAgICAgY29uc3QgcGFydG5lcklkeCA9IGFsbE5hbWVzLmZpbmRJbmRleChkID0+IGQgPT09IHBhcnRuZXIpO1xuICAgICAgICBpZiAocGFydG5lcklkeCA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdE5hbWUgPSByZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzKGZpZWxkTmFtZSwgc3VmZml4UGFpclswXSk7XG5cbiAgICAgICAgICBjYXJyeS5wdXNoKHtcbiAgICAgICAgICAgIGRlZmF1bHROYW1lLFxuICAgICAgICAgICAgcGFpcjoge1xuICAgICAgICAgICAgICBsYXQ6IHtcbiAgICAgICAgICAgICAgICBmaWVsZElkeDogaWR4LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbaWR4XS5uYW1lXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGxuZzoge1xuICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBwYXJ0bmVySWR4LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbcGFydG5lcklkeF0ubmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VmZml4OiBzdWZmaXhQYWlyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYXJyeTtcbiAgfSwgW10pO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHBhcmFtIGNvbHVtblxuICogQHBhcmFtIG1vZGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2tlcGxlci10YWJsZScpLnNvcnREYXRhc2V0QnlDb2x1bW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RGF0YXNldEJ5Q29sdW1uKGRhdGFzZXQsIGNvbHVtbiwgbW9kZSkge1xuICBjb25zdCB7YWxsSW5kZXhlcywgZmllbGRzLCBhbGxEYXRhfSA9IGRhdGFzZXQ7XG4gIGNvbnN0IGZpZWxkSW5kZXggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSBjb2x1bW4pO1xuICBpZiAoZmllbGRJbmRleCA8IDApIHtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGNvbnN0IHNvcnRCeSA9IFNPUlRfT1JERVJbbW9kZV0gfHwgU09SVF9PUkRFUi5BU0NFTkRJTkc7XG5cbiAgaWYgKHNvcnRCeSA9PT0gU09SVF9PUkRFUi5VTlNPUlQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGF0YXNldCxcbiAgICAgIHNvcnRDb2x1bW46IHt9LFxuICAgICAgc29ydE9yZGVyOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHNvcnRGdW5jdGlvbiA9IHNvcnRCeSA9PT0gU09SVF9PUkRFUi5BU0NFTkRJTkcgPyBhc2NlbmRpbmcgOiBkZXNjZW5kaW5nO1xuICBjb25zdCBzb3J0T3JkZXIgPSBhbGxJbmRleGVzXG4gICAgLnNsaWNlKClcbiAgICAuc29ydCgoYSwgYikgPT4gc29ydEZ1bmN0aW9uKGFsbERhdGFbYV1bZmllbGRJbmRleF0sIGFsbERhdGFbYl1bZmllbGRJbmRleF0pKTtcblxuICByZXR1cm4ge1xuICAgIC4uLmRhdGFzZXQsXG4gICAgc29ydENvbHVtbjoge1xuICAgICAgW2NvbHVtbl06IHNvcnRCeVxuICAgIH0sXG4gICAgc29ydE9yZGVyXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VGFibGUob3JpZ2luYWwpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob3JpZ2luYWwpKSwgb3JpZ2luYWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRhYmxlQW5kVXBkYXRlKG9yaWdpbmFsLCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG9wdGlvbnMpLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgIGFjY1tlbnRyeVswXV0gPSBlbnRyeVsxXTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCBjb3B5VGFibGUob3JpZ2luYWwpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgS2VwbGVyVGFibGU7XG4iXX0=