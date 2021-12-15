"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointColResolver = exports.mapboxRequiredColumns = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _baseLayer = _interopRequireWildcard(require("./base-layer"));

var _reselect = require("reselect");

var _mapboxUtils = require("./mapbox-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var mapboxRequiredColumns = ['lat', 'lng'];
exports.mapboxRequiredColumns = mapboxRequiredColumns;

var pointColResolver = function pointColResolver(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return "".concat(lat.fieldIdx, "-").concat(lng.fieldIdx);
};

exports.pointColResolver = pointColResolver;

var MapboxLayerGL = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(MapboxLayerGL, _Layer);

  var _super = _createSuper(MapboxLayerGL);

  function MapboxLayerGL() {
    var _this;

    (0, _classCallCheck2["default"])(this, MapboxLayerGL);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "datasetSelector", function (config) {
      return config.dataId;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "gpuFilterSelector", function (config, datasets) {
      return (datasets[config.dataId] || {}).gpuFilter;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "columnsSelector", function (config) {
      return pointColResolver(config.columns);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sourceSelector", (0, _reselect.createSelector)(_this.datasetSelector, _this.columnsSelector, function (datasetId, columns) {
      return "".concat(datasetId, "-").concat(columns);
    }));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterSelector", (0, _reselect.createSelector)(_this.gpuFilterSelector, function (gpuFilter) {
      return (0, _mapboxUtils.gpuFilterToMapboxFilter)(gpuFilter);
    }));
    return _this;
  }

  (0, _createClass2["default"])(MapboxLayerGL, [{
    key: "overlayType",
    get: function get() {
      return _baseLayer.OVERLAY_TYPE.mapboxgl;
    }
  }, {
    key: "type",
    get: function get() {
      return null;
    }
  }, {
    key: "isAggregated",
    get: function get() {
      return true;
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return mapboxRequiredColumns;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: "noneLayerDataAffectingProps",
    get: function get() {
      return [];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {};
    }
  }, {
    key: "isValidFilter",
    value: function isValidFilter(filter) {
      // mapbox will crash if filter is not an array or empty
      return Array.isArray(filter) && filter.length;
    }
  }, {
    key: "getDataUpdateTriggers",
    value: function getDataUpdateTriggers(_ref2) {
      var _this2 = this;

      var filteredIndex = _ref2.filteredIndex,
          gpuFilter = _ref2.gpuFilter,
          id = _ref2.id;
      var columns = this.config.columns;
      var visualChannelFields = Object.values(this.visualChannels).reduce(function (accu, v) {
        return _objectSpread(_objectSpread({}, accu), _this2.config[v.field] ? (0, _defineProperty2["default"])({}, v.field, _this2.config[v.field].name) : {});
      }, {});
      var updateTriggers = {
        getData: _objectSpread(_objectSpread({
          datasetId: id,
          columns: columns,
          filteredIndex: filteredIndex
        }, visualChannelFields), gpuFilter.filterValueUpdateTriggers),
        getMeta: {
          datasetId: id,
          columns: columns
        }
      };
      return updateTriggers;
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref4, getPosition) {
      var _this3 = this;

      var allData = _ref4.allData,
          filteredIndex = _ref4.filteredIndex,
          gpuFilter = _ref4.gpuFilter;

      var getGeometry = function getGeometry(d) {
        return _this3.getGeometry(getPosition(d));
      };

      var vcFields = Object.values(this.visualChannels).map(function (v) {
        return _this3.config[v.field];
      }).filter(function (v) {
        return v;
      });
      var getPropertyFromVisualChanel = vcFields.length ? function (d) {
        return vcFields.reduce(function (accu, field) {
          return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, field.name, field.valueAccessor(d)));
        }, {});
      } : function (d) {
        return {};
      };
      var filterValueUpdateTriggers = gpuFilter.filterValueUpdateTriggers,
          filterValueAccessor = gpuFilter.filterValueAccessor; // gpuField To property

      var hasFilter = Object.values(filterValueUpdateTriggers).filter(function (d) {
        return d;
      }).length;
      var valueAccessor = filterValueAccessor();
      var getPropertyFromFilter = hasFilter ? function (d, index) {
        var filterValue = valueAccessor({
          data: d,
          index: index
        });
        return Object.values(filterValueUpdateTriggers).reduce(function (accu, name, i) {
          return _objectSpread(_objectSpread({}, accu), name ? (0, _defineProperty2["default"])({}, (0, _mapboxUtils.prefixGpuField)(name), filterValue[i]) : {});
        }, {});
      } : function (d) {
        return {};
      };

      var getProperties = function getProperties(d, i) {
        return _objectSpread(_objectSpread({}, getPropertyFromVisualChanel(d)), getPropertyFromFilter(d, i));
      };

      return (0, _mapboxUtils.geoJsonFromData)(allData, filteredIndex, getGeometry, getProperties);
    } // this layer is rendered at mapbox level
    // todo: maybe need to find a better solution for this one

  }, {
    key: "shouldRenderLayer",
    value: function shouldRenderLayer() {
      return this.type && this.config.isVisible && this.hasAllColumns();
    }
  }]);
  return MapboxLayerGL;
}(_baseLayer["default"]);

var _default = MapboxLayerGL;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvbWFwYm94Z2wtbGF5ZXIuanMiXSwibmFtZXMiOlsibWFwYm94UmVxdWlyZWRDb2x1bW5zIiwicG9pbnRDb2xSZXNvbHZlciIsImxhdCIsImxuZyIsImZpZWxkSWR4IiwiTWFwYm94TGF5ZXJHTCIsImNvbmZpZyIsImRhdGFJZCIsImRhdGFzZXRzIiwiZ3B1RmlsdGVyIiwiY29sdW1ucyIsImRhdGFzZXRTZWxlY3RvciIsImNvbHVtbnNTZWxlY3RvciIsImRhdGFzZXRJZCIsImdwdUZpbHRlclNlbGVjdG9yIiwiT1ZFUkxBWV9UWVBFIiwibWFwYm94Z2wiLCJkZWZhdWx0UG9pbnRDb2x1bW5QYWlycyIsImZpbHRlciIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImZpbHRlcmVkSW5kZXgiLCJpZCIsInZpc3VhbENoYW5uZWxGaWVsZHMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ2aXN1YWxDaGFubmVscyIsInJlZHVjZSIsImFjY3UiLCJ2IiwiZmllbGQiLCJuYW1lIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXREYXRhIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsImdldE1ldGEiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJnZXRHZW9tZXRyeSIsImQiLCJ2Y0ZpZWxkcyIsIm1hcCIsImdldFByb3BlcnR5RnJvbVZpc3VhbENoYW5lbCIsInZhbHVlQWNjZXNzb3IiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiaGFzRmlsdGVyIiwiZ2V0UHJvcGVydHlGcm9tRmlsdGVyIiwiaW5kZXgiLCJmaWx0ZXJWYWx1ZSIsImRhdGEiLCJpIiwiZ2V0UHJvcGVydGllcyIsInR5cGUiLCJpc1Zpc2libGUiLCJoYXNBbGxDb2x1bW5zIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxxQkFBcUIsR0FBRyxDQUFDLEtBQUQsRUFBUSxLQUFS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RUEsVUFBTUUscUJBQXFCLEdBQUdELFNBQVMsR0FDbkMsVUFBQ04sQ0FBRCxFQUFJUSxLQUFKLEVBQWM7QUFDWixZQUFNQyxXQUFXLEdBQUdMLGFBQWEsQ0FBQztBQUFDTSxVQUFBQSxJQUFJLEVBQUVWLENBQVA7QUFBVVEsVUFBQUEsS0FBSyxFQUFMQTtBQUFWLFNBQUQsQ0FBakM7QUFDQSxlQUFPdkIsTUFBTSxDQUFDQyxNQUFQLENBQWNTLHlCQUFkLEVBQXlDUCxNQUF6QyxDQUNMLFVBQUNDLElBQUQsRUFBT0csSUFBUCxFQUFhbUIsQ0FBYjtBQUFBLGlEQUNLdEIsSUFETCxHQUVNRyxJQUFJLHdDQUFLLGlDQUFlQSxJQUFmLENBQUwsRUFBNEJpQixXQUFXLENBQUNFLENBQUQsQ0FBdkMsSUFBOEMsRUFGeEQ7QUFBQSxTQURLLEVBS0wsRUFMSyxDQUFQO0FBT0QsT0FWa0MsR0FXbkMsVUFBQVgsQ0FBQztBQUFBLGVBQUssRUFBTDtBQUFBLE9BWEw7O0FBYUEsVUFBTVksYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDWixDQUFELEVBQUlXLENBQUo7QUFBQSwrQ0FDakJSLDJCQUEyQixDQUFDSCxDQUFELENBRFYsR0FFakJPLHFCQUFxQixDQUFDUCxDQUFELEVBQUlXLENBQUosQ0FGSjtBQUFBLE9BQXRCOztBQUtBLGFBQU8sa0NBQWdCYixPQUFoQixFQUF5QmhCLGFBQXpCLEVBQXdDaUIsV0FBeEMsRUFBcURhLGFBQXJELENBQVA7QUFDRCxLLENBRUQ7QUFDQTs7OztXQUNBLDZCQUFvQjtBQUNsQixhQUFPLEtBQUtDLElBQUwsSUFBYSxLQUFLL0MsTUFBTCxDQUFZZ0QsU0FBekIsSUFBc0MsS0FBS0MsYUFBTCxFQUE3QztBQUNEOzs7RUF6SHlCQyxxQjs7ZUE0SGJuRCxhIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyLCB7T1ZFUkxBWV9UWVBFfSBmcm9tICcuL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQge2dlb0pzb25Gcm9tRGF0YSwgcHJlZml4R3B1RmllbGQsIGdwdUZpbHRlclRvTWFwYm94RmlsdGVyfSBmcm9tICcuL21hcGJveC11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBtYXBib3hSZXF1aXJlZENvbHVtbnMgPSBbJ2xhdCcsICdsbmcnXTtcblxuZXhwb3J0IGNvbnN0IHBvaW50Q29sUmVzb2x2ZXIgPSAoe2xhdCwgbG5nfSkgPT4gYCR7bGF0LmZpZWxkSWR4fS0ke2xuZy5maWVsZElkeH1gO1xuXG5jbGFzcyBNYXBib3hMYXllckdMIGV4dGVuZHMgTGF5ZXIge1xuICBnZXQgb3ZlcmxheVR5cGUoKSB7XG4gICAgcmV0dXJuIE9WRVJMQVlfVFlQRS5tYXBib3hnbDtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gbWFwYm94UmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRQb2ludENvbHVtblBhaXJzO1xuICB9XG5cbiAgZ2V0IG5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGRhdGFzZXRTZWxlY3RvciA9IGNvbmZpZyA9PiBjb25maWcuZGF0YUlkO1xuICBncHVGaWx0ZXJTZWxlY3RvciA9IChjb25maWcsIGRhdGFzZXRzKSA9PiAoZGF0YXNldHNbY29uZmlnLmRhdGFJZF0gfHwge30pLmdwdUZpbHRlcjtcbiAgY29sdW1uc1NlbGVjdG9yID0gY29uZmlnID0+IHBvaW50Q29sUmVzb2x2ZXIoY29uZmlnLmNvbHVtbnMpO1xuXG4gIHNvdXJjZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kYXRhc2V0U2VsZWN0b3IsXG4gICAgdGhpcy5jb2x1bW5zU2VsZWN0b3IsXG4gICAgKGRhdGFzZXRJZCwgY29sdW1ucykgPT4gYCR7ZGF0YXNldElkfS0ke2NvbHVtbnN9YFxuICApO1xuXG4gIGZpbHRlclNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5ncHVGaWx0ZXJTZWxlY3RvciwgZ3B1RmlsdGVyID0+XG4gICAgZ3B1RmlsdGVyVG9NYXBib3hGaWx0ZXIoZ3B1RmlsdGVyKVxuICApO1xuXG4gIGlzVmFsaWRGaWx0ZXIoZmlsdGVyKSB7XG4gICAgLy8gbWFwYm94IHdpbGwgY3Jhc2ggaWYgZmlsdGVyIGlzIG5vdCBhbiBhcnJheSBvciBlbXB0eVxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGZpbHRlcikgJiYgZmlsdGVyLmxlbmd0aDtcbiAgfVxuXG4gIGdldERhdGFVcGRhdGVUcmlnZ2Vycyh7ZmlsdGVyZWRJbmRleCwgZ3B1RmlsdGVyLCBpZH0pIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IHZpc3VhbENoYW5uZWxGaWVsZHMgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLnJlZHVjZShcbiAgICAgIChhY2N1LCB2KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICAuLi4odGhpcy5jb25maWdbdi5maWVsZF0gPyB7W3YuZmllbGRdOiB0aGlzLmNvbmZpZ1t2LmZpZWxkXS5uYW1lfSA6IHt9KVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG5cbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGdldERhdGE6IHtcbiAgICAgICAgZGF0YXNldElkOiBpZCxcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgZmlsdGVyZWRJbmRleCxcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbEZpZWxkcyxcbiAgICAgICAgLi4uZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICAgIH0sXG4gICAgICBnZXRNZXRhOiB7ZGF0YXNldElkOiBpZCwgY29sdW1uc31cbiAgICB9O1xuXG4gICAgcmV0dXJuIHVwZGF0ZVRyaWdnZXJzO1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgZ3B1RmlsdGVyfSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBnZXRHZW9tZXRyeSA9IGQgPT4gdGhpcy5nZXRHZW9tZXRyeShnZXRQb3NpdGlvbihkKSk7XG5cbiAgICBjb25zdCB2Y0ZpZWxkcyA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscylcbiAgICAgIC5tYXAodiA9PiB0aGlzLmNvbmZpZ1t2LmZpZWxkXSlcbiAgICAgIC5maWx0ZXIodiA9PiB2KTtcblxuICAgIGNvbnN0IGdldFByb3BlcnR5RnJvbVZpc3VhbENoYW5lbCA9IHZjRmllbGRzLmxlbmd0aFxuICAgICAgPyBkID0+XG4gICAgICAgICAgdmNGaWVsZHMucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIGZpZWxkKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICBbZmllbGQubmFtZV06IGZpZWxkLnZhbHVlQWNjZXNzb3IoZClcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAge31cbiAgICAgICAgICApXG4gICAgICA6IGQgPT4gKHt9KTtcblxuICAgIGNvbnN0IHtmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzLCBmaWx0ZXJWYWx1ZUFjY2Vzc29yfSA9IGdwdUZpbHRlcjtcblxuICAgIC8vIGdwdUZpZWxkIFRvIHByb3BlcnR5XG4gICAgY29uc3QgaGFzRmlsdGVyID0gT2JqZWN0LnZhbHVlcyhmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzKS5maWx0ZXIoZCA9PiBkKS5sZW5ndGg7XG4gICAgY29uc3QgdmFsdWVBY2Nlc3NvciA9IGZpbHRlclZhbHVlQWNjZXNzb3IoKTtcblxuICAgIGNvbnN0IGdldFByb3BlcnR5RnJvbUZpbHRlciA9IGhhc0ZpbHRlclxuICAgICAgPyAoZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWx0ZXJWYWx1ZSA9IHZhbHVlQWNjZXNzb3Ioe2RhdGE6IGQsIGluZGV4fSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycykucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIG5hbWUsIGkpID0+ICh7XG4gICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgIC4uLihuYW1lID8ge1twcmVmaXhHcHVGaWVsZChuYW1lKV06IGZpbHRlclZhbHVlW2ldfSA6IHt9KVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIDogZCA9PiAoe30pO1xuXG4gICAgY29uc3QgZ2V0UHJvcGVydGllcyA9IChkLCBpKSA9PiAoe1xuICAgICAgLi4uZ2V0UHJvcGVydHlGcm9tVmlzdWFsQ2hhbmVsKGQpLFxuICAgICAgLi4uZ2V0UHJvcGVydHlGcm9tRmlsdGVyKGQsIGkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2VvSnNvbkZyb21EYXRhKGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIGdldEdlb21ldHJ5LCBnZXRQcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIC8vIHRoaXMgbGF5ZXIgaXMgcmVuZGVyZWQgYXQgbWFwYm94IGxldmVsXG4gIC8vIHRvZG86IG1heWJlIG5lZWQgdG8gZmluZCBhIGJldHRlciBzb2x1dGlvbiBmb3IgdGhpcyBvbmVcbiAgc2hvdWxkUmVuZGVyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSAmJiB0aGlzLmNvbmZpZy5pc1Zpc2libGUgJiYgdGhpcy5oYXNBbGxDb2x1bW5zKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwYm94TGF5ZXJHTDtcbiJdfQ==