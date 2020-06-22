"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointColResolver = exports.mapboxRequiredColumns = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _baseLayer = _interopRequireWildcard(require("./base-layer"));

var _reselect = require("reselect");

var _mapboxUtils = require("./mapbox-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mapboxRequiredColumns = ['lat', 'lng'];
exports.mapboxRequiredColumns = mapboxRequiredColumns;

var pointColResolver = function pointColResolver(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return "".concat(lat.fieldIdx, "-").concat(lng.fieldIdx);
};

exports.pointColResolver = pointColResolver;

var MapboxLayerGL =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(MapboxLayerGL, _Layer);

  function MapboxLayerGL() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, MapboxLayerGL);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(MapboxLayerGL)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
        return _objectSpread({}, accu, {}, _this2.config[v.field] ? (0, _defineProperty2["default"])({}, v.field, _this2.config[v.field].name) : {});
      }, {});
      var updateTriggers = {
        getData: _objectSpread({
          datasetId: id,
          columns: columns,
          filteredIndex: filteredIndex
        }, visualChannelFields, {}, gpuFilter.filterValueUpdateTriggers),
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
          return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, field.name, d[field.tableFieldIndex - 1]));
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
          return _objectSpread({}, accu, {}, name ? (0, _defineProperty2["default"])({}, (0, _mapboxUtils.prefixGpuField)(name), filterValue[i]) : {});
        }, {});
      } : function (d) {
        return {};
      };

      var getProperties = function getProperties(d, i) {
        return _objectSpread({}, getPropertyFromVisualChanel(d), {}, getPropertyFromFilter(d, i));
      };

      return (0, _mapboxUtils.geoJsonFromData)(allData, filteredIndex, getGeometry, getProperties);
    } // this layer is rendered at mapbox level
    // todo: maybe need to find a better solution for this one

  }, {
    key: "shouldRenderLayer",
    value: function shouldRenderLayer() {
      return this.type && this.config.isVisible && this.hasAllColumns();
    }
  }, {
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
  }]);
  return MapboxLayerGL;
}(_baseLayer["default"]);

var _default = MapboxLayerGL;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvbWFwYm94Z2wtbGF5ZXIuanMiXSwibmFtZXMiOlsibWFwYm94UmVxdWlyZWRDb2x1bW5zIiwicG9pbnRDb2xSZXNvbHZlciIsImxhdCIsImxuZyIsImZpZWxkSWR4IiwiTWFwYm94TGF5ZXJHTCIsImNvbmZpZyIsImRhdGFJZCIsImRhdGFzZXRzIiwiZ3B1RmlsdGVyIiwiY29sdW1ucyIsImRhdGFzZXRTZWxlY3RvciIsImNvbHVtbnNTZWxlY3RvciIsImRhdGFzZXRJZCIsImdwdUZpbHRlclNlbGVjdG9yIiwiZmlsdGVyIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiZmlsdGVyZWRJbmRleCIsImlkIiwidmlzdWFsQ2hhbm5lbEZpZWxkcyIsIk9iamVjdCIsInZhbHVlcyIsInZpc3VhbENoYW5uZWxzIiwicmVkdWNlIiwiYWNjdSIsInYiLCJmaWVsZCIsIm5hbWUiLCJ1cGRhdGVUcmlnZ2VycyIsImdldERhdGEiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZ2V0TWV0YSIsImdldFBvc2l0aW9uIiwiYWxsRGF0YSIsImdldEdlb21ldHJ5IiwiZCIsInZjRmllbGRzIiwibWFwIiwiZ2V0UHJvcGVydHlGcm9tVmlzdWFsQ2hhbmVsIiwidGFibGVGaWVsZEluZGV4IiwiZmlsdGVyVmFsdWVBY2Nlc3NvciIsImhhc0ZpbHRlciIsInZhbHVlQWNjZXNzb3IiLCJnZXRQcm9wZXJ0eUZyb21GaWx0ZXIiLCJpbmRleCIsImZpbHRlclZhbHVlIiwiZGF0YSIsImkiLCJnZXRQcm9wZXJ0aWVzIiwidHlwZSIsImlzVmlzaWJsZSIsImhhc0FsbENvbHVtbnMiLCJPVkVSTEFZX1RZUEUiLCJtYXBib3hnbCIsImRlZmF1bHRQb2ludENvbHVtblBhaXJzIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLElBQU1BLHFCQUFxQixHQUFHLENBQUMs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bUNBQ0t2QixJQURMLE1BRU1HLElBQUksd0NBQUssaUNBQWVBLElBQWYsQ0FBTCxFQUE0QmtCLFdBQVcsQ0FBQ0UsQ0FBRCxDQUF2QyxJQUE4QyxFQUZ4RDtBQUFBLFNBREssRUFLTCxFQUxLLENBQVA7QUFPRCxPQVZrQyxHQVduQyxVQUFBWixDQUFDO0FBQUEsZUFBSyxFQUFMO0FBQUEsT0FYTDs7QUFhQSxVQUFNYSxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNiLENBQUQsRUFBSVksQ0FBSjtBQUFBLGlDQUNqQlQsMkJBQTJCLENBQUNILENBQUQsQ0FEVixNQUVqQlEscUJBQXFCLENBQUNSLENBQUQsRUFBSVksQ0FBSixDQUZKO0FBQUEsT0FBdEI7O0FBS0EsYUFBTyxrQ0FBZ0JkLE9BQWhCLEVBQXlCaEIsYUFBekIsRUFBd0NpQixXQUF4QyxFQUFxRGMsYUFBckQsQ0FBUDtBQUNELEssQ0FFRDtBQUNBOzs7O3dDQUNvQjtBQUNsQixhQUFPLEtBQUtDLElBQUwsSUFBYSxLQUFLN0MsTUFBTCxDQUFZOEMsU0FBekIsSUFBc0MsS0FBS0MsYUFBTCxFQUE3QztBQUNEOzs7d0JBeEhpQjtBQUNoQixhQUFPQyx3QkFBYUMsUUFBcEI7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkFFa0I7QUFDakIsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkFFMEI7QUFDekIsYUFBT3ZELHFCQUFQO0FBQ0Q7Ozt3QkFFaUI7QUFDaEIsYUFBTyxLQUFLd0QsdUJBQVo7QUFDRDs7O3dCQUVpQztBQUNoQyxhQUFPLEVBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQixhQUFPLEVBQVA7QUFDRDs7O0VBM0J5QkMscUI7O2VBNEhicEQsYSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciwge09WRVJMQVlfVFlQRX0gZnJvbSAnLi9iYXNlLWxheWVyJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IHtnZW9Kc29uRnJvbURhdGEsIHByZWZpeEdwdUZpZWxkLCBncHVGaWx0ZXJUb01hcGJveEZpbHRlcn0gZnJvbSAnLi9tYXBib3gtdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgbWFwYm94UmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5cbmV4cG9ydCBjb25zdCBwb2ludENvbFJlc29sdmVyID0gKHtsYXQsIGxuZ30pID0+IGAke2xhdC5maWVsZElkeH0tJHtsbmcuZmllbGRJZHh9YDtcblxuY2xhc3MgTWFwYm94TGF5ZXJHTCBleHRlbmRzIExheWVyIHtcbiAgZ2V0IG92ZXJsYXlUeXBlKCkge1xuICAgIHJldHVybiBPVkVSTEFZX1RZUEUubWFwYm94Z2w7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIG1hcGJveFJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBkYXRhc2V0U2VsZWN0b3IgPSBjb25maWcgPT4gY29uZmlnLmRhdGFJZDtcbiAgZ3B1RmlsdGVyU2VsZWN0b3IgPSAoY29uZmlnLCBkYXRhc2V0cykgPT4gKGRhdGFzZXRzW2NvbmZpZy5kYXRhSWRdIHx8IHt9KS5ncHVGaWx0ZXI7XG4gIGNvbHVtbnNTZWxlY3RvciA9IGNvbmZpZyA9PiBwb2ludENvbFJlc29sdmVyKGNvbmZpZy5jb2x1bW5zKTtcblxuICBzb3VyY2VTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZGF0YXNldFNlbGVjdG9yLFxuICAgIHRoaXMuY29sdW1uc1NlbGVjdG9yLFxuICAgIChkYXRhc2V0SWQsIGNvbHVtbnMpID0+IGAke2RhdGFzZXRJZH0tJHtjb2x1bW5zfWBcbiAgKTtcblxuICBmaWx0ZXJTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZ3B1RmlsdGVyU2VsZWN0b3IsIGdwdUZpbHRlciA9PlxuICAgIGdwdUZpbHRlclRvTWFwYm94RmlsdGVyKGdwdUZpbHRlcilcbiAgKTtcblxuICBpc1ZhbGlkRmlsdGVyKGZpbHRlcikge1xuICAgIC8vIG1hcGJveCB3aWxsIGNyYXNoIGlmIGZpbHRlciBpcyBub3QgYW4gYXJyYXkgb3IgZW1wdHlcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShmaWx0ZXIpICYmIGZpbHRlci5sZW5ndGg7XG4gIH1cblxuICBnZXREYXRhVXBkYXRlVHJpZ2dlcnMoe2ZpbHRlcmVkSW5kZXgsIGdwdUZpbHRlciwgaWR9KSB7XG4gICAgY29uc3Qge2NvbHVtbnN9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCB2aXN1YWxDaGFubmVsRmllbGRzID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwgdikgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgLi4uKHRoaXMuY29uZmlnW3YuZmllbGRdID8ge1t2LmZpZWxkXTogdGhpcy5jb25maWdbdi5maWVsZF0ubmFtZX0gOiB7fSlcbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXREYXRhOiB7XG4gICAgICAgIGRhdGFzZXRJZDogaWQsXG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIGZpbHRlcmVkSW5kZXgsXG4gICAgICAgIC4uLnZpc3VhbENoYW5uZWxGaWVsZHMsXG4gICAgICAgIC4uLmdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzXG4gICAgICB9LFxuICAgICAgZ2V0TWV0YToge2RhdGFzZXRJZDogaWQsIGNvbHVtbnN9XG4gICAgfTtcblxuICAgIHJldHVybiB1cGRhdGVUcmlnZ2VycztcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXgsIGdwdUZpbHRlcn0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZ2V0R2VvbWV0cnkgPSBkID0+IHRoaXMuZ2V0R2VvbWV0cnkoZ2V0UG9zaXRpb24oZCkpO1xuXG4gICAgY29uc3QgdmNGaWVsZHMgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpXG4gICAgICAubWFwKHYgPT4gdGhpcy5jb25maWdbdi5maWVsZF0pXG4gICAgICAuZmlsdGVyKHYgPT4gdik7XG5cbiAgICBjb25zdCBnZXRQcm9wZXJ0eUZyb21WaXN1YWxDaGFuZWwgPSB2Y0ZpZWxkcy5sZW5ndGhcbiAgICAgID8gZCA9PlxuICAgICAgICAgIHZjRmllbGRzLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCBmaWVsZCkgPT4gKHtcbiAgICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgICAgW2ZpZWxkLm5hbWVdOiBkW2ZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFdXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICAgKVxuICAgICAgOiBkID0+ICh7fSk7XG5cbiAgICBjb25zdCB7ZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycywgZmlsdGVyVmFsdWVBY2Nlc3Nvcn0gPSBncHVGaWx0ZXI7XG5cbiAgICAvLyBncHVGaWVsZCBUbyBwcm9wZXJ0eVxuICAgIGNvbnN0IGhhc0ZpbHRlciA9IE9iamVjdC52YWx1ZXMoZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycykuZmlsdGVyKGQgPT4gZCkubGVuZ3RoO1xuICAgIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBmaWx0ZXJWYWx1ZUFjY2Vzc29yKCk7XG5cbiAgICBjb25zdCBnZXRQcm9wZXJ0eUZyb21GaWx0ZXIgPSBoYXNGaWx0ZXJcbiAgICAgID8gKGQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsdGVyVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKHtkYXRhOiBkLCBpbmRleH0pO1xuICAgICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMpLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCBuYW1lLCBpKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4obmFtZSA/IHtbcHJlZml4R3B1RmllbGQobmFtZSldOiBmaWx0ZXJWYWx1ZVtpXX0gOiB7fSlcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAge31cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICA6IGQgPT4gKHt9KTtcblxuICAgIGNvbnN0IGdldFByb3BlcnRpZXMgPSAoZCwgaSkgPT4gKHtcbiAgICAgIC4uLmdldFByb3BlcnR5RnJvbVZpc3VhbENoYW5lbChkKSxcbiAgICAgIC4uLmdldFByb3BlcnR5RnJvbUZpbHRlcihkLCBpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdlb0pzb25Gcm9tRGF0YShhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBnZXRHZW9tZXRyeSwgZ2V0UHJvcGVydGllcyk7XG4gIH1cblxuICAvLyB0aGlzIGxheWVyIGlzIHJlbmRlcmVkIGF0IG1hcGJveCBsZXZlbFxuICAvLyB0b2RvOiBtYXliZSBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgc29sdXRpb24gZm9yIHRoaXMgb25lXG4gIHNob3VsZFJlbmRlckxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgJiYgdGhpcy5jb25maWcuaXNWaXNpYmxlICYmIHRoaXMuaGFzQWxsQ29sdW1ucygpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcGJveExheWVyR0w7XG4iXX0=