"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = _interopRequireDefault(require("lodash.pick"));

var _window = require("global/window");

var _versions = require("./versions");

var _schema = _interopRequireDefault(require("./schema"));

var _dataProcessor = require("../processors/data-processor");

var _datasetSchema;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// version v0
var fieldPropertiesV0 = {
  name: null,
  type: null
};
var fieldPropertiesV1 = {
  name: null,
  type: null,
  format: null,
  analyzerType: null
};

var FieldSchema = /*#__PURE__*/function (_Schema) {
  (0, _inherits2["default"])(FieldSchema, _Schema);

  var _super = _createSuper(FieldSchema);

  function FieldSchema() {
    (0, _classCallCheck2["default"])(this, FieldSchema);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(FieldSchema, [{
    key: "save",
    value: function save(fields) {
      var _this = this;

      return (0, _defineProperty2["default"])({}, this.key, fields.map(function (f) {
        return _this.savePropertiesOrApplySchema(f)[_this.key];
      }));
    }
  }, {
    key: "load",
    value: function load(fields) {
      return (0, _defineProperty2["default"])({}, this.key, fields);
    }
  }]);
  return FieldSchema;
}(_schema["default"]);

var propertiesV0 = {
  id: null,
  label: null,
  color: null,
  allData: null,
  fields: new FieldSchema({
    key: 'fields',
    version: _versions.VERSIONS.v0,
    properties: fieldPropertiesV0
  })
};

var propertiesV1 = _objectSpread(_objectSpread({}, propertiesV0), {}, {
  fields: new FieldSchema({
    key: 'fields',
    version: _versions.VERSIONS.v1,
    properties: fieldPropertiesV1
  })
});

var DatasetSchema = /*#__PURE__*/function (_Schema2) {
  (0, _inherits2["default"])(DatasetSchema, _Schema2);

  var _super2 = _createSuper(DatasetSchema);

  function DatasetSchema() {
    var _this2;

    (0, _classCallCheck2["default"])(this, DatasetSchema);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "key", 'dataset');
    return _this2;
  }

  (0, _createClass2["default"])(DatasetSchema, [{
    key: "save",
    value: function save(dataset) {
      return this.savePropertiesOrApplySchema(dataset)[this.key];
    }
  }, {
    key: "load",
    value: function load(dataset) {
      var fields = dataset.fields,
          allData = dataset.allData;
      var updatedFields = fields; // recalculate field type
      // because we have updated type-analyzer
      // we need to add format to each field

      var needCalculateMeta = fields[0] && (!fields[0].hasOwnProperty('format') || !fields[0].hasOwnProperty('analyzerType'));

      if (needCalculateMeta) {
        var fieldOrder = fields.map(function (f) {
          return f.name;
        });
        var sampleData = (0, _dataProcessor.getSampleForTypeAnalyze)({
          fields: fieldOrder,
          allData: allData
        });
        var meta = (0, _dataProcessor.getFieldsFromData)(sampleData, fieldOrder);
        updatedFields = meta.map(function (f, i) {
          return _objectSpread(_objectSpread({}, (0, _lodash["default"])(meta[i], ['name', 'type', 'format'])), {}, {
            analyzerType: meta[i].analyzerType
          });
        });
        updatedFields.forEach(function (f, i) {
          if (fields[i].type !== f.type) {
            // if newly detected field type is different from saved type
            // we log it but won't update it, cause we don't want to break people's map
            _window.console.warn("detect ".concat(f.name, " type is now ").concat(f.type, " instead of ").concat(fields[i].type));
          }
        });
      } // get format of all fields


      return {
        data: {
          fields: updatedFields,
          rows: dataset.allData
        },
        info: (0, _lodash["default"])(dataset, ['id', 'label', 'color'])
      };
    }
  }]);
  return DatasetSchema;
}(_schema["default"]);

var datasetSchema = (_datasetSchema = {}, (0, _defineProperty2["default"])(_datasetSchema, _versions.VERSIONS.v0, new DatasetSchema({
  key: 'dataset',
  version: _versions.VERSIONS.v0,
  properties: propertiesV0
})), (0, _defineProperty2["default"])(_datasetSchema, _versions.VERSIONS.v1, new DatasetSchema({
  key: 'dataset',
  version: _versions.VERSIONS.v1,
  properties: propertiesV1
})), _datasetSchema);
var _default = datasetSchema;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2RhdGFzZXQtc2NoZW1hLmpzIl0sIm5hbWVzIjpbImZpZWxkUHJvcGVydGllc1YwIiwibmFtZSIsInR5cGUiLCJmaWVsZFByb3BlcnRpZXNWMSIsImZvcm1hdCIsImFuYWx5emVyVHlwZSIsIkZpZWxkU2NoZW1hIiwiZmllbGRzIiwia2V5IiwibWFwIiwiZiIsInNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIlNjaGVtYSIsInByb3BlcnRpZXNWMCIsImlkIiwibGFiZWwiLCJjb2xvciIsImFsbERhdGEiLCJ2ZXJzaW9uIiwiVkVSU0lPTlMiLCJ2MCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0aWVzVjEiLCJ2MSIsIkRhdGFzZXRTY2hlbWEiLCJkYXRhc2V0IiwidXBkYXRlZEZpZWxkcyIsIm5lZWRDYWxjdWxhdGVNZXRhIiwiaGFzT3duUHJvcGVydHkiLCJmaWVsZE9yZGVyIiwic2FtcGxlRGF0YSIsIm1ldGEiLCJpIiwiZm9yRWFjaCIsImdsb2JhbENvbnNvbGUiLCJ3YXJuIiwiZGF0YSIsInJvd3MiLCJpbmZvIiwiZGF0YXNldFNjaGVtYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsaUJBQWlCLEdBQUc7QUFDeEJDLEVBQUFBLElBQUksRUFBRSxJQURrQjtBQUV4QkMsRUFBQUEsSUFBSSxFQUFFO0FBRmtCLENBQTFCO0FBS0EsSUFBTUMsaUJBQWlCLEdBQUc7QUFDeEJGLEVBQUFBLElBQUksRUFBRSxJQURrQjtBQUV4QkMsRUFBQUEsSUFBSSxFQUFFLElBRmtCO0FBR3hCRSxFQUFBQSxNQUFNLEVBQUUsSUFIZ0I7QUFJeEJDLEVBQUFBLFlBQVksRUFBRTtBQUpVLENBQTFCOztJQU9NQyxXOzs7Ozs7Ozs7Ozs7V0FDSixjQUFLQyxNQUFMLEVBQWE7QUFBQTs7QUFDWCxrREFDRyxLQUFLQyxHQURS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LGtCQUE2QnpCLENBQUMsQ0FBQ1QsSUFBL0IsMEJBQW1EUyxDQUFDLENBQUNSLElBQXJELHlCQUF3RUssTUFBTSxDQUFDeUIsQ0FBRCxDQUFOLENBQVU5QixJQUFsRjtBQUNEO0FBQ0YsU0FORDtBQU9ELE9BN0JXLENBK0JaOzs7QUFDQSxhQUFPO0FBQ0xrQyxRQUFBQSxJQUFJLEVBQUU7QUFBQzdCLFVBQUFBLE1BQU0sRUFBRW1CLGFBQVQ7QUFBd0JXLFVBQUFBLElBQUksRUFBRVosT0FBTyxDQUFDUjtBQUF0QyxTQUREO0FBRUxxQixRQUFBQSxJQUFJLEVBQUUsd0JBQUtiLE9BQUwsRUFBYyxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQWQ7QUFGRCxPQUFQO0FBSUQ7OztFQTFDeUJiLGtCOztBQTZDNUIsSUFBTTJCLGFBQWEsMEVBQ2hCcEIsbUJBQVNDLEVBRE8sRUFDRixJQUFJSSxhQUFKLENBQWtCO0FBQy9CaEIsRUFBQUEsR0FBRyxFQUFFLFNBRDBCO0FBRS9CVSxFQUFBQSxPQUFPLEVBQUVDLG1CQUFTQyxFQUZhO0FBRy9CQyxFQUFBQSxVQUFVLEVBQUVSO0FBSG1CLENBQWxCLENBREUsb0RBTWhCTSxtQkFBU0ksRUFOTyxFQU1GLElBQUlDLGFBQUosQ0FBa0I7QUFDL0JoQixFQUFBQSxHQUFHLEVBQUUsU0FEMEI7QUFFL0JVLEVBQUFBLE9BQU8sRUFBRUMsbUJBQVNJLEVBRmE7QUFHL0JGLEVBQUFBLFVBQVUsRUFBRUM7QUFIbUIsQ0FBbEIsQ0FORSxrQkFBbkI7ZUFhZWlCLGEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgcGljayBmcm9tICdsb2Rhc2gucGljayc7XG5pbXBvcnQge2NvbnNvbGUgYXMgZ2xvYmFsQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IFNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2dldEZpZWxkc0Zyb21EYXRhLCBnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZX0gZnJvbSAncHJvY2Vzc29ycy9kYXRhLXByb2Nlc3Nvcic7XG5cbi8vIHZlcnNpb24gdjBcbmNvbnN0IGZpZWxkUHJvcGVydGllc1YwID0ge1xuICBuYW1lOiBudWxsLFxuICB0eXBlOiBudWxsXG59O1xuXG5jb25zdCBmaWVsZFByb3BlcnRpZXNWMSA9IHtcbiAgbmFtZTogbnVsbCxcbiAgdHlwZTogbnVsbCxcbiAgZm9ybWF0OiBudWxsLFxuICBhbmFseXplclR5cGU6IG51bGxcbn07XG5cbmNsYXNzIEZpZWxkU2NoZW1hIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZShmaWVsZHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogZmllbGRzLm1hcChmID0+IHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGYpW3RoaXMua2V5XSlcbiAgICB9O1xuICB9XG4gIGxvYWQoZmllbGRzKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBmaWVsZHN9O1xuICB9XG59XG5cbmNvbnN0IHByb3BlcnRpZXNWMCA9IHtcbiAgaWQ6IG51bGwsXG4gIGxhYmVsOiBudWxsLFxuICBjb2xvcjogbnVsbCxcbiAgYWxsRGF0YTogbnVsbCxcbiAgZmllbGRzOiBuZXcgRmllbGRTY2hlbWEoe1xuICAgIGtleTogJ2ZpZWxkcycsXG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogZmllbGRQcm9wZXJ0aWVzVjBcbiAgfSlcbn07XG5cbmNvbnN0IHByb3BlcnRpZXNWMSA9IHtcbiAgLi4ucHJvcGVydGllc1YwLFxuICBmaWVsZHM6IG5ldyBGaWVsZFNjaGVtYSh7XG4gICAga2V5OiAnZmllbGRzJyxcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBmaWVsZFByb3BlcnRpZXNWMVxuICB9KVxufTtcblxuY2xhc3MgRGF0YXNldFNjaGVtYSBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdkYXRhc2V0JztcblxuICBzYXZlKGRhdGFzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZGF0YXNldClbdGhpcy5rZXldO1xuICB9XG4gIGxvYWQoZGF0YXNldCkge1xuICAgIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gZGF0YXNldDtcbiAgICBsZXQgdXBkYXRlZEZpZWxkcyA9IGZpZWxkcztcblxuICAgIC8vIHJlY2FsY3VsYXRlIGZpZWxkIHR5cGVcbiAgICAvLyBiZWNhdXNlIHdlIGhhdmUgdXBkYXRlZCB0eXBlLWFuYWx5emVyXG4gICAgLy8gd2UgbmVlZCB0byBhZGQgZm9ybWF0IHRvIGVhY2ggZmllbGRcbiAgICBjb25zdCBuZWVkQ2FsY3VsYXRlTWV0YSA9XG4gICAgICBmaWVsZHNbMF0gJiZcbiAgICAgICghZmllbGRzWzBdLmhhc093blByb3BlcnR5KCdmb3JtYXQnKSB8fCAhZmllbGRzWzBdLmhhc093blByb3BlcnR5KCdhbmFseXplclR5cGUnKSk7XG5cbiAgICBpZiAobmVlZENhbGN1bGF0ZU1ldGEpIHtcbiAgICAgIGNvbnN0IGZpZWxkT3JkZXIgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKTtcblxuICAgICAgY29uc3Qgc2FtcGxlRGF0YSA9IGdldFNhbXBsZUZvclR5cGVBbmFseXplKHtmaWVsZHM6IGZpZWxkT3JkZXIsIGFsbERhdGF9KTtcbiAgICAgIGNvbnN0IG1ldGEgPSBnZXRGaWVsZHNGcm9tRGF0YShzYW1wbGVEYXRhLCBmaWVsZE9yZGVyKTtcblxuICAgICAgdXBkYXRlZEZpZWxkcyA9IG1ldGEubWFwKChmLCBpKSA9PiAoe1xuICAgICAgICAuLi5waWNrKG1ldGFbaV0sIFsnbmFtZScsICd0eXBlJywgJ2Zvcm1hdCddKSxcbiAgICAgICAgYW5hbHl6ZXJUeXBlOiBtZXRhW2ldLmFuYWx5emVyVHlwZVxuICAgICAgfSkpO1xuXG4gICAgICB1cGRhdGVkRmllbGRzLmZvckVhY2goKGYsIGkpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkc1tpXS50eXBlICE9PSBmLnR5cGUpIHtcbiAgICAgICAgICAvLyBpZiBuZXdseSBkZXRlY3RlZCBmaWVsZCB0eXBlIGlzIGRpZmZlcmVudCBmcm9tIHNhdmVkIHR5cGVcbiAgICAgICAgICAvLyB3ZSBsb2cgaXQgYnV0IHdvbid0IHVwZGF0ZSBpdCwgY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBicmVhayBwZW9wbGUncyBtYXBcbiAgICAgICAgICBnbG9iYWxDb25zb2xlLndhcm4oYGRldGVjdCAke2YubmFtZX0gdHlwZSBpcyBub3cgJHtmLnR5cGV9IGluc3RlYWQgb2YgJHtmaWVsZHNbaV0udHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IGZvcm1hdCBvZiBhbGwgZmllbGRzXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3M6IGRhdGFzZXQuYWxsRGF0YX0sXG4gICAgICBpbmZvOiBwaWNrKGRhdGFzZXQsIFsnaWQnLCAnbGFiZWwnLCAnY29sb3InXSlcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGRhdGFzZXRTY2hlbWEgPSB7XG4gIFtWRVJTSU9OUy52MF06IG5ldyBEYXRhc2V0U2NoZW1hKHtcbiAgICBrZXk6ICdkYXRhc2V0JyxcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjBcbiAgfSksXG4gIFtWRVJTSU9OUy52MV06IG5ldyBEYXRhc2V0U2NoZW1hKHtcbiAgICBrZXk6ICdkYXRhc2V0JyxcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjFcbiAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFzZXRTY2hlbWE7XG4iXX0=