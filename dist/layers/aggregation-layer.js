"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.aggregateRequiredColumns = exports.getFilterDataFunc = exports.getValueAggrFunc = exports.pointPosResolver = exports.pointPosAccessor = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _baseLayer = _interopRequireDefault(require("./base-layer"));

var _colorUtils = require("../utils/color-utils");

var _aggregateUtils = require("../utils/aggregate-utils");

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx]];
  };
};

exports.pointPosAccessor = pointPosAccessor;

var pointPosResolver = function pointPosResolver(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng;
  return "".concat(lat.fieldIdx, "-").concat(lng.fieldIdx);
};

exports.pointPosResolver = pointPosResolver;

var getValueAggrFunc = function getValueAggrFunc(field, aggregation) {
  return function (points) {
    return field ? (0, _aggregateUtils.aggregate)(points.map(function (p) {
      return p.data[field.tableFieldIndex - 1];
    }), aggregation) : points.length;
  };
};

exports.getValueAggrFunc = getValueAggrFunc;

var getFilterDataFunc = function getFilterDataFunc(filterRange, getFilterValue) {
  return function (pt) {
    return getFilterValue(pt).every(function (val, i) {
      return val >= filterRange[i][0] && val <= filterRange[i][1];
    });
  };
};

exports.getFilterDataFunc = getFilterDataFunc;

var getLayerColorRange = function getLayerColorRange(colorRange) {
  return colorRange.colors.map(_colorUtils.hexToRgb);
};

var aggregateRequiredColumns = ['lat', 'lng'];
exports.aggregateRequiredColumns = aggregateRequiredColumns;

var AggregationLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(AggregationLayer, _Layer);

  function AggregationLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, AggregationLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AggregationLayer).call(this, props));

    _this.getPositionAccessor = function () {
      return pointPosAccessor(_this.config.columns);
    };

    _this.getColorRange = (0, _lodash["default"])(getLayerColorRange);
    return _this;
  }

  (0, _createClass2["default"])(AggregationLayer, [{
    key: "getVisualChannelDescription",

    /**
     * Get the description of a visualChannel config
     * @param key
     * @returns {{label: string, measure: (string|string)}}
     */
    value: function getVisualChannelDescription(key) {
      // e.g. label: Color, measure: Average of ETA
      var _this$visualChannels$ = this.visualChannels[key],
          range = _this$visualChannels$.range,
          field = _this$visualChannels$.field,
          defaultMeasure = _this$visualChannels$.defaultMeasure,
          aggregation = _this$visualChannels$.aggregation;
      return {
        label: this.visConfigSettings[range].label,
        measure: this.config[field] ? "".concat(this.config.visConfig[aggregation], " of ").concat(this.config[field].name) : defaultMeasure
      };
    }
  }, {
    key: "getHoverData",
    value: function getHoverData(object) {
      // return aggregated object
      return object;
    }
    /**
     * Aggregation layer handles visual channel aggregation inside deck.gl layer
     */

  }, {
    key: "updateLayerVisualChannel",
    value: function updateLayerVisualChannel(_ref3, channel) {
      var data = _ref3.data,
          allData = _ref3.allData;
      this.validateVisualChannel(channel);
    }
    /**
     * Validate aggregation type on top of basic layer visual channel validation
     * @param channel
     */

  }, {
    key: "validateVisualChannel",
    value: function validateVisualChannel(channel) {
      // field type decides aggregation type decides scale type
      this.validateFieldType(channel);
      this.validateAggregationType(channel);
      this.validateScale(channel);
    }
    /**
     * Validate aggregation type based on selected field
     */

  }, {
    key: "validateAggregationType",
    value: function validateAggregationType(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          aggregation = visualChannel.aggregation;
      var aggregationOptions = this.getAggregationOptions(channel);

      if (!aggregation) {
        return;
      }

      if (!aggregationOptions.length) {
        // if field cannot be aggregated, set field to null
        this.updateLayerConfig((0, _defineProperty2["default"])({}, field, null));
      } else if (!aggregationOptions.includes(this.config.visConfig[aggregation])) {
        // current aggregation type is not supported by this field
        // set aggregation to the first supported option
        this.updateLayerVisConfig((0, _defineProperty2["default"])({}, aggregation, aggregationOptions[0]));
      }
    }
  }, {
    key: "getAggregationOptions",
    value: function getAggregationOptions(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          channelScaleType = visualChannel.channelScaleType;
      return Object.keys(this.config[field] ? _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType] : _defaultSettings.DEFAULT_AGGREGATION[channelScaleType]);
    }
    /**
     * Get scale options based on current field and aggregation type
     * @param {string} channel
     * @returns {string[]}
     */

  }, {
    key: "getScaleOptions",
    value: function getScaleOptions(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          aggregation = visualChannel.aggregation,
          channelScaleType = visualChannel.channelScaleType;
      var aggregationType = this.config.visConfig[aggregation];
      return this.config[field] ? // scale options based on aggregation
      _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType][aggregationType] : // default scale options for point count
      _defaultSettings.DEFAULT_AGGREGATION[channelScaleType][aggregationType];
    }
    /**
     * Aggregation layer handles visual channel aggregation inside deck.gl layer
     */

  }, {
    key: "updateLayerDomain",
    value: function updateLayerDomain(datasets, newFilter) {
      return this;
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getPosition) {
      // get bounds from points
      var bounds = this.getPointsBounds(allData, function (d) {
        return getPosition({
          data: d
        });
      });
      this.updateMeta({
        bounds: bounds
      });
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref4, getPosition) {
      var allData = _ref4.allData,
          filteredIndex = _ref4.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var pos = getPosition({
          data: allData[index]
        }); // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null

        if (pos.every(Number.isFinite)) {
          data.push({
            index: index,
            data: allData[index]
          });
        }
      }

      return data;
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var getPosition = this.getPositionAccessor(); // if (

      var gpuFilter = datasets[this.config.dataId].gpuFilter;
      var getColorValue = getValueAggrFunc(this.config.colorField, this.config.visConfig.colorAggregation);
      var getElevationValue = getValueAggrFunc(this.config.sizeField, this.config.visConfig.sizeAggregation);
      var hasFilter = Object.values(gpuFilter.filterRange).some(function (arr) {
        return arr.some(function (v) {
          return v !== 0;
        });
      });
      var getFilterValue = gpuFilter.filterValueAccessor();
      var filterData = hasFilter ? getFilterDataFunc(gpuFilter.filterRange, getFilterValue) : undefined;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      return _objectSpread({
        data: data,
        getPosition: getPosition,
        _filterData: filterData
      }, getColorValue ? {
        getColorValue: getColorValue
      } : {}, {}, getElevationValue ? {
        getElevationValue: getElevationValue
      } : {});
    }
  }, {
    key: "getDefaultDeckLayerProps",
    value: function getDefaultDeckLayerProps(opts) {
      var baseProp = (0, _get2["default"])((0, _getPrototypeOf2["default"])(AggregationLayer.prototype), "getDefaultDeckLayerProps", this).call(this, opts);
      return _objectSpread({}, baseProp, {
        highlightColor: _defaultSettings.HIGHLIGH_COLOR_3D,
        // gpu data filtering is not supported in aggregation layer
        extensions: [],
        autoHighlight: this.config.visConfig.enable3d
      });
    }
  }, {
    key: "getDefaultAggregationLayerProp",
    value: function getDefaultAggregationLayerProp(opts) {
      var gpuFilter = opts.gpuFilter,
          mapState = opts.mapState,
          _opts$layerCallbacks = opts.layerCallbacks,
          layerCallbacks = _opts$layerCallbacks === void 0 ? {} : _opts$layerCallbacks;
      var visConfig = this.config.visConfig;
      var eleZoomFactor = this.getElevationZoomFactor(mapState);
      var updateTriggers = {
        getColorValue: {
          colorField: this.config.colorField,
          colorAggregation: this.config.visConfig.colorAggregation
        },
        getElevationValue: {
          sizeField: this.config.sizeField,
          sizeAggregation: this.config.visConfig.sizeAggregation
        },
        _filterData: _objectSpread({
          filterRange: gpuFilter.filterRange
        }, gpuFilter.filterValueUpdateTriggers)
      };
      return _objectSpread({}, this.getDefaultDeckLayerProps(opts), {
        coverage: visConfig.coverage,
        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScaleType: this.config.colorScale,
        upperPercentile: visConfig.percentile[1],
        lowerPercentile: visConfig.percentile[0],
        colorAggregation: visConfig.colorAggregation,
        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        elevationScaleType: this.config.sizeScale,
        elevationRange: visConfig.sizeRange,
        elevationLowerPercentile: visConfig.elevationPercentile[0],
        elevationUpperPercentile: visConfig.elevationPercentile[1],
        // updateTriggers
        updateTriggers: updateTriggers,
        // callbacks
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      });
    }
  }, {
    key: "isAggregated",
    get: function get() {
      return true;
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return aggregateRequiredColumns;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: "noneLayerDataAffectingProps",
    get: function get() {
      return [].concat((0, _toConsumableArray2["default"])((0, _get2["default"])((0, _getPrototypeOf2["default"])(AggregationLayer.prototype), "noneLayerDataAffectingProps", this)), ['enable3d', 'colorRange', 'colorDomain', 'sizeRange', 'sizeScale', 'sizeDomain', 'percentile', 'coverage', 'elevationPercentile', 'elevationScale']);
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        color: {
          aggregation: 'colorAggregation',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.colorAggr,
          defaultMeasure: 'property.pointCount',
          domain: 'colorDomain',
          field: 'colorField',
          key: 'color',
          property: 'color',
          range: 'colorRange',
          scale: 'colorScale'
        },
        size: {
          aggregation: 'sizeAggregation',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.sizeAggr,
          condition: function condition(config) {
            return config.visConfig.enable3d;
          },
          defaultMeasure: 'property.pointCount',
          domain: 'sizeDomain',
          field: 'sizeField',
          key: 'size',
          property: 'height',
          range: 'sizeRange',
          scale: 'sizeScale'
        }
      };
    }
  }]);
  return AggregationLayer;
}(_baseLayer["default"]);

exports["default"] = AggregationLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvYWdncmVnYXRpb24tbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJkYXRhIiwiZmllbGRJZHgiLCJwb2ludFBvc1Jlc29sdmVyIiwiZ2V0VmFsdWVBZ2dyRnVuYyIsImZpZWxkIiwiYWdncmVnYXRpb24iLCJwb2ludHMiLCJtYXAiLCJwIiwidGFibGVGaWVsZEluZGV4IiwibGVuZ3RoIiwiZ2V0RmlsdGVyRGF0YUZ1bmMiLCJmaWx0ZXJSYW5nZSIsImdldEZpbHRlclZhbHVlIiwicHQiLCJldmVyeSIsInZhbCIsImkiLCJnZXRMYXllckNvbG9yUmFuZ2UiLCJjb2xvclJhbmdlIiwiY29sb3JzIiwiaGV4VG9SZ2IiLCJhZ2dyZWdhdGVSZXF1aXJlZENvbHVtbnMiLCJBZ2dyZWdhdGlvbkxheWVyIiwicHJvcHMiLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImdldENvbG9yUmFuZ2UiLCJrZXkiLCJ2aXN1YWxDaGFubmVscyIsInJhbmdlIiwiZGVmYXVsdE1lYXN1cmUiLCJsYWJlbCIsInZpc0NvbmZpZ1NldHRpbmdzIiwibWVhc3VyZSIsInZpc0NvbmZpZyIsIm5hbWUiLCJvYmplY3QiLCJjaGFubmVsIiwiYWxsRGF0YSIsInZhbGlkYXRlVmlzdWFsQ2hhbm5lbCIsInZhbGlkYXRlRmllbGRUeXBlIiwidmFsaWRhdGVBZ2dyZWdhdGlvblR5cGUiLCJ2YWxpZGF0ZVNjYWxlIiwidmlzdWFsQ2hhbm5lbCIsImFnZ3JlZ2F0aW9uT3B0aW9ucyIsImdldEFnZ3JlZ2F0aW9uT3B0aW9ucyIsInVwZGF0ZUxheWVyQ29uZmlnIiwiaW5jbHVkZXMiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsImNoYW5uZWxTY2FsZVR5cGUiLCJPYmplY3QiLCJrZXlzIiwiRklFTERfT1BUUyIsInR5cGUiLCJzY2FsZSIsIkRFRkFVTFRfQUdHUkVHQVRJT04iLCJhZ2dyZWdhdGlvblR5cGUiLCJkYXRhc2V0cyIsIm5ld0ZpbHRlciIsImdldFBvc2l0aW9uIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsImZpbHRlcmVkSW5kZXgiLCJpbmRleCIsInBvcyIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsIm9sZExheWVyRGF0YSIsImdwdUZpbHRlciIsImRhdGFJZCIsImdldENvbG9yVmFsdWUiLCJjb2xvckZpZWxkIiwiY29sb3JBZ2dyZWdhdGlvbiIsImdldEVsZXZhdGlvblZhbHVlIiwic2l6ZUZpZWxkIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiaGFzRmlsdGVyIiwidmFsdWVzIiwic29tZSIsImFyciIsInYiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiZmlsdGVyRGF0YSIsInVuZGVmaW5lZCIsInVwZGF0ZURhdGEiLCJfZmlsdGVyRGF0YSIsIm9wdHMiLCJiYXNlUHJvcCIsImhpZ2hsaWdodENvbG9yIiwiSElHSExJR0hfQ09MT1JfM0QiLCJleHRlbnNpb25zIiwiYXV0b0hpZ2hsaWdodCIsImVuYWJsZTNkIiwibWFwU3RhdGUiLCJsYXllckNhbGxiYWNrcyIsImVsZVpvb21GYWN0b3IiLCJnZXRFbGV2YXRpb25ab29tRmFjdG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwiY292ZXJhZ2UiLCJjb2xvclNjYWxlVHlwZSIsImNvbG9yU2NhbGUiLCJ1cHBlclBlcmNlbnRpbGUiLCJwZXJjZW50aWxlIiwibG93ZXJQZXJjZW50aWxlIiwiZXh0cnVkZWQiLCJlbGV2YXRpb25TY2FsZSIsImVsZXZhdGlvblNjYWxlVHlwZSIsInNpemVTY2FsZSIsImVsZXZhdGlvblJhbmdlIiwic2l6ZVJhbmdlIiwiZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlIiwiZWxldmF0aW9uUGVyY2VudGlsZSIsImVsZXZhdGlvblVwcGVyUGVyY2VudGlsZSIsIm9uU2V0Q29sb3JEb21haW4iLCJvblNldExheWVyRG9tYWluIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJjb2xvciIsIkNIQU5ORUxfU0NBTEVTIiwiY29sb3JBZ2dyIiwiZG9tYWluIiwicHJvcGVydHkiLCJzaXplIiwic2l6ZUFnZ3IiLCJjb25kaXRpb24iLCJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBSU8sSUFBTUEsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVDLEdBQUYsUUFBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsUUFBT0EsR0FBUDtBQUFBLFNBQWdCLFVBQUFDLENBQUM7QUFBQSxXQUFJLENBQUNBLENBQUMsQ0FBQ0MsSUFBRixDQUFPRixHQUFHLENBQUNHLFFBQVgsQ0FBRCxFQUF1QkYsQ0FBQyxDQUFDQyxJQUFGLENBQU9ILEdBQUcsQ0FBQ0ksUUFBWCxDQUF2QixDQUFKO0FBQUEsR0FBakI7QUFBQSxDQUF6Qjs7OztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFTCxHQUFGLFNBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFNBQU9BLEdBQVA7QUFBQSxtQkFBbUJELEdBQUcsQ0FBQ0ksUUFBdkIsY0FBbUNILEdBQUcsQ0FBQ0csUUFBdkM7QUFBQSxDQUF6Qjs7OztBQUVBLElBQU1FLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsS0FBRCxFQUFRQyxXQUFSLEVBQXdCO0FBQ3RELFNBQU8sVUFBQUMsTUFBTSxFQUFJO0FBQ2YsV0FBT0YsS0FBSyxHQUNSLCtCQUNFRSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxVQUFBQyxDQUFDO0FBQUEsYUFBSUEsQ0FBQyxDQUFDUixJQUFGLENBQU9JLEtBQUssQ0FBQ0ssZUFBTixHQUF3QixDQUEvQixDQUFKO0FBQUEsS0FBWixDQURGLEVBRUVKLFdBRkYsQ0FEUSxHQUtSQyxNQUFNLENBQUNJLE1BTFg7QUFN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SnlCLFVBQUFBLEtBQUssRUFBRTtBQVZIO0FBWkQsT0FBUDtBQXlCRDs7O0VBOUQyQzBFLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IExheWVyIGZyb20gJy4vYmFzZS1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAndXRpbHMvYWdncmVnYXRlLXV0aWxzJztcbmltcG9ydCB7SElHSExJR0hfQ09MT1JfM0R9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtDSEFOTkVMX1NDQUxFUywgRklFTERfT1BUUywgREVGQVVMVF9BR0dSRUdBVElPTn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmd9KSA9PiBkID0+IFtkLmRhdGFbbG5nLmZpZWxkSWR4XSwgZC5kYXRhW2xhdC5maWVsZElkeF1dO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NSZXNvbHZlciA9ICh7bGF0LCBsbmd9KSA9PiBgJHtsYXQuZmllbGRJZHh9LSR7bG5nLmZpZWxkSWR4fWA7XG5cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZUFnZ3JGdW5jID0gKGZpZWxkLCBhZ2dyZWdhdGlvbikgPT4ge1xuICByZXR1cm4gcG9pbnRzID0+IHtcbiAgICByZXR1cm4gZmllbGRcbiAgICAgID8gYWdncmVnYXRlKFxuICAgICAgICAgIHBvaW50cy5tYXAocCA9PiBwLmRhdGFbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV0pLFxuICAgICAgICAgIGFnZ3JlZ2F0aW9uXG4gICAgICAgIClcbiAgICAgIDogcG9pbnRzLmxlbmd0aDtcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJEYXRhRnVuYyA9IChmaWx0ZXJSYW5nZSwgZ2V0RmlsdGVyVmFsdWUpID0+IHB0ID0+XG4gIGdldEZpbHRlclZhbHVlKHB0KS5ldmVyeSgodmFsLCBpKSA9PiB2YWwgPj0gZmlsdGVyUmFuZ2VbaV1bMF0gJiYgdmFsIDw9IGZpbHRlclJhbmdlW2ldWzFdKTtcblxuY29uc3QgZ2V0TGF5ZXJDb2xvclJhbmdlID0gY29sb3JSYW5nZSA9PiBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpO1xuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ3JlZ2F0aW9uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yID0gKCkgPT4gcG9pbnRQb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgICB0aGlzLmdldENvbG9yUmFuZ2UgPSBtZW1vaXplKGdldExheWVyQ29sb3JSYW5nZSk7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBhZ2dyZWdhdGVSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFBvaW50Q29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsXG4gICAgICAnZW5hYmxlM2QnLFxuICAgICAgJ2NvbG9yUmFuZ2UnLFxuICAgICAgJ2NvbG9yRG9tYWluJyxcbiAgICAgICdzaXplUmFuZ2UnLFxuICAgICAgJ3NpemVTY2FsZScsXG4gICAgICAnc2l6ZURvbWFpbicsXG4gICAgICAncGVyY2VudGlsZScsXG4gICAgICAnY292ZXJhZ2UnLFxuICAgICAgJ2VsZXZhdGlvblBlcmNlbnRpbGUnLFxuICAgICAgJ2VsZXZhdGlvblNjYWxlJ1xuICAgIF07XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIGFnZ3JlZ2F0aW9uOiAnY29sb3JBZ2dyZWdhdGlvbicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yQWdncixcbiAgICAgICAgZGVmYXVsdE1lYXN1cmU6ICdwcm9wZXJ0eS5wb2ludENvdW50JyxcbiAgICAgICAgZG9tYWluOiAnY29sb3JEb21haW4nLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBrZXk6ICdjb2xvcicsXG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICByYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBhZ2dyZWdhdGlvbjogJ3NpemVBZ2dyZWdhdGlvbicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnNpemVBZ2dyLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ3Byb3BlcnR5LnBvaW50Q291bnQnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgZmllbGQ6ICdzaXplRmllbGQnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICByYW5nZTogJ3NpemVSYW5nZScsXG4gICAgICAgIHNjYWxlOiAnc2l6ZVNjYWxlJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBkZXNjcmlwdGlvbiBvZiBhIHZpc3VhbENoYW5uZWwgY29uZmlnXG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHJldHVybnMge3tsYWJlbDogc3RyaW5nLCBtZWFzdXJlOiAoc3RyaW5nfHN0cmluZyl9fVxuICAgKi9cbiAgZ2V0VmlzdWFsQ2hhbm5lbERlc2NyaXB0aW9uKGtleSkge1xuICAgIC8vIGUuZy4gbGFiZWw6IENvbG9yLCBtZWFzdXJlOiBBdmVyYWdlIG9mIEVUQVxuICAgIGNvbnN0IHtyYW5nZSwgZmllbGQsIGRlZmF1bHRNZWFzdXJlLCBhZ2dyZWdhdGlvbn0gPSB0aGlzLnZpc3VhbENoYW5uZWxzW2tleV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW3JhbmdlXS5sYWJlbCxcbiAgICAgIG1lYXN1cmU6IHRoaXMuY29uZmlnW2ZpZWxkXVxuICAgICAgICA/IGAke3RoaXMuY29uZmlnLnZpc0NvbmZpZ1thZ2dyZWdhdGlvbl19IG9mICR7dGhpcy5jb25maWdbZmllbGRdLm5hbWV9YFxuICAgICAgICA6IGRlZmF1bHRNZWFzdXJlXG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICAvLyByZXR1cm4gYWdncmVnYXRlZCBvYmplY3RcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICB0aGlzLnZhbGlkYXRlVmlzdWFsQ2hhbm5lbChjaGFubmVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhZ2dyZWdhdGlvbiB0eXBlIG9uIHRvcCBvZiBiYXNpYyBsYXllciB2aXN1YWwgY2hhbm5lbCB2YWxpZGF0aW9uXG4gICAqIEBwYXJhbSBjaGFubmVsXG4gICAqL1xuICB2YWxpZGF0ZVZpc3VhbENoYW5uZWwoY2hhbm5lbCkge1xuICAgIC8vIGZpZWxkIHR5cGUgZGVjaWRlcyBhZ2dyZWdhdGlvbiB0eXBlIGRlY2lkZXMgc2NhbGUgdHlwZVxuICAgIHRoaXMudmFsaWRhdGVGaWVsZFR5cGUoY2hhbm5lbCk7XG4gICAgdGhpcy52YWxpZGF0ZUFnZ3JlZ2F0aW9uVHlwZShjaGFubmVsKTtcbiAgICB0aGlzLnZhbGlkYXRlU2NhbGUoY2hhbm5lbCk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgYWdncmVnYXRpb24gdHlwZSBiYXNlZCBvbiBzZWxlY3RlZCBmaWVsZFxuICAgKi9cbiAgdmFsaWRhdGVBZ2dyZWdhdGlvblR5cGUoY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtmaWVsZCwgYWdncmVnYXRpb259ID0gdmlzdWFsQ2hhbm5lbDtcbiAgICBjb25zdCBhZ2dyZWdhdGlvbk9wdGlvbnMgPSB0aGlzLmdldEFnZ3JlZ2F0aW9uT3B0aW9ucyhjaGFubmVsKTtcblxuICAgIGlmICghYWdncmVnYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWFnZ3JlZ2F0aW9uT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIC8vIGlmIGZpZWxkIGNhbm5vdCBiZSBhZ2dyZWdhdGVkLCBzZXQgZmllbGQgdG8gbnVsbFxuICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2ZpZWxkXTogbnVsbH0pO1xuICAgIH0gZWxzZSBpZiAoIWFnZ3JlZ2F0aW9uT3B0aW9ucy5pbmNsdWRlcyh0aGlzLmNvbmZpZy52aXNDb25maWdbYWdncmVnYXRpb25dKSkge1xuICAgICAgLy8gY3VycmVudCBhZ2dyZWdhdGlvbiB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBmaWVsZFxuICAgICAgLy8gc2V0IGFnZ3JlZ2F0aW9uIHRvIHRoZSBmaXJzdCBzdXBwb3J0ZWQgb3B0aW9uXG4gICAgICB0aGlzLnVwZGF0ZUxheWVyVmlzQ29uZmlnKHtbYWdncmVnYXRpb25dOiBhZ2dyZWdhdGlvbk9wdGlvbnNbMF19KTtcbiAgICB9XG4gIH1cblxuICBnZXRBZ2dyZWdhdGlvbk9wdGlvbnMoY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtmaWVsZCwgY2hhbm5lbFNjYWxlVHlwZX0gPSB2aXN1YWxDaGFubmVsO1xuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKFxuICAgICAgdGhpcy5jb25maWdbZmllbGRdXG4gICAgICAgID8gRklFTERfT1BUU1t0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZV0uc2NhbGVbY2hhbm5lbFNjYWxlVHlwZV1cbiAgICAgICAgOiBERUZBVUxUX0FHR1JFR0FUSU9OW2NoYW5uZWxTY2FsZVR5cGVdXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgc2NhbGUgb3B0aW9ucyBiYXNlZCBvbiBjdXJyZW50IGZpZWxkIGFuZCBhZ2dyZWdhdGlvbiB0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFubmVsXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICovXG4gIGdldFNjYWxlT3B0aW9ucyhjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG4gICAgY29uc3Qge2ZpZWxkLCBhZ2dyZWdhdGlvbiwgY2hhbm5lbFNjYWxlVHlwZX0gPSB2aXN1YWxDaGFubmVsO1xuICAgIGNvbnN0IGFnZ3JlZ2F0aW9uVHlwZSA9IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1thZ2dyZWdhdGlvbl07XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnW2ZpZWxkXVxuICAgICAgPyAvLyBzY2FsZSBvcHRpb25zIGJhc2VkIG9uIGFnZ3JlZ2F0aW9uXG4gICAgICAgIEZJRUxEX09QVFNbdGhpcy5jb25maWdbZmllbGRdLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdW2FnZ3JlZ2F0aW9uVHlwZV1cbiAgICAgIDogLy8gZGVmYXVsdCBzY2FsZSBvcHRpb25zIGZvciBwb2ludCBjb3VudFxuICAgICAgICBERUZBVUxUX0FHR1JFR0FUSU9OW2NoYW5uZWxTY2FsZVR5cGVdW2FnZ3JlZ2F0aW9uVHlwZV07XG4gIH1cblxuICAvKipcbiAgICogQWdncmVnYXRpb24gbGF5ZXIgaGFuZGxlcyB2aXN1YWwgY2hhbm5lbCBhZ2dyZWdhdGlvbiBpbnNpZGUgZGVjay5nbCBsYXllclxuICAgKi9cbiAgdXBkYXRlTGF5ZXJEb21haW4oZGF0YXNldHMsIG5ld0ZpbHRlcikge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKSB7XG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIHBvaW50c1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KSk7XG5cbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIGluZGV4LFxuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpIHtcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpOyAvLyBpZiAoXG4gICAgY29uc3Qge2dwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuXG4gICAgY29uc3QgZ2V0Q29sb3JWYWx1ZSA9IGdldFZhbHVlQWdnckZ1bmMoXG4gICAgICB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yQWdncmVnYXRpb25cbiAgICApO1xuXG4gICAgY29uc3QgZ2V0RWxldmF0aW9uVmFsdWUgPSBnZXRWYWx1ZUFnZ3JGdW5jKFxuICAgICAgdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnLnNpemVBZ2dyZWdhdGlvblxuICAgICk7XG4gICAgY29uc3QgaGFzRmlsdGVyID0gT2JqZWN0LnZhbHVlcyhncHVGaWx0ZXIuZmlsdGVyUmFuZ2UpLnNvbWUoYXJyID0+IGFyci5zb21lKHYgPT4gdiAhPT0gMCkpO1xuICAgIGNvbnN0IGdldEZpbHRlclZhbHVlID0gZ3B1RmlsdGVyLmZpbHRlclZhbHVlQWNjZXNzb3IoKTtcbiAgICBjb25zdCBmaWx0ZXJEYXRhID0gaGFzRmlsdGVyXG4gICAgICA/IGdldEZpbHRlckRhdGFGdW5jKGdwdUZpbHRlci5maWx0ZXJSYW5nZSwgZ2V0RmlsdGVyVmFsdWUpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0UG9zaXRpb24sXG4gICAgICBfZmlsdGVyRGF0YTogZmlsdGVyRGF0YSxcbiAgICAgIC4uLihnZXRDb2xvclZhbHVlID8ge2dldENvbG9yVmFsdWV9IDoge30pLFxuICAgICAgLi4uKGdldEVsZXZhdGlvblZhbHVlID8ge2dldEVsZXZhdGlvblZhbHVlfSA6IHt9KVxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cykge1xuICAgIGNvbnN0IGJhc2VQcm9wID0gc3VwZXIuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5iYXNlUHJvcCxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiBISUdITElHSF9DT0xPUl8zRCxcbiAgICAgIC8vIGdwdSBkYXRhIGZpbHRlcmluZyBpcyBub3Qgc3VwcG9ydGVkIGluIGFnZ3JlZ2F0aW9uIGxheWVyXG4gICAgICBleHRlbnNpb25zOiBbXSxcbiAgICAgIGF1dG9IaWdobGlnaHQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZFxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0QWdncmVnYXRpb25MYXllclByb3Aob3B0cykge1xuICAgIGNvbnN0IHtncHVGaWx0ZXIsIG1hcFN0YXRlLCBsYXllckNhbGxiYWNrcyA9IHt9fSA9IG9wdHM7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCBlbGVab29tRmFjdG9yID0gdGhpcy5nZXRFbGV2YXRpb25ab29tRmFjdG9yKG1hcFN0YXRlKTtcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0Q29sb3JWYWx1ZToge1xuICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvckFnZ3JlZ2F0aW9uOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvblxuICAgICAgfSxcbiAgICAgIGdldEVsZXZhdGlvblZhbHVlOiB7XG4gICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplQWdncmVnYXRpb246IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplQWdncmVnYXRpb25cbiAgICAgIH0sXG4gICAgICBfZmlsdGVyRGF0YToge1xuICAgICAgICBmaWx0ZXJSYW5nZTogZ3B1RmlsdGVyLmZpbHRlclJhbmdlLFxuICAgICAgICAuLi5ncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyksXG4gICAgICBjb3ZlcmFnZTogdmlzQ29uZmlnLmNvdmVyYWdlLFxuXG4gICAgICAvLyBjb2xvclxuICAgICAgY29sb3JSYW5nZTogdGhpcy5nZXRDb2xvclJhbmdlKHZpc0NvbmZpZy5jb2xvclJhbmdlKSxcbiAgICAgIGNvbG9yU2NhbGVUeXBlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlLFxuICAgICAgdXBwZXJQZXJjZW50aWxlOiB2aXNDb25maWcucGVyY2VudGlsZVsxXSxcbiAgICAgIGxvd2VyUGVyY2VudGlsZTogdmlzQ29uZmlnLnBlcmNlbnRpbGVbMF0sXG4gICAgICBjb2xvckFnZ3JlZ2F0aW9uOiB2aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvbixcblxuICAgICAgLy8gZWxldmF0aW9uXG4gICAgICBleHRydWRlZDogdmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgZWxldmF0aW9uU2NhbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSAqIGVsZVpvb21GYWN0b3IsXG4gICAgICBlbGV2YXRpb25TY2FsZVR5cGU6IHRoaXMuY29uZmlnLnNpemVTY2FsZSxcbiAgICAgIGVsZXZhdGlvblJhbmdlOiB2aXNDb25maWcuc2l6ZVJhbmdlLFxuICAgICAgZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVswXSxcbiAgICAgIGVsZXZhdGlvblVwcGVyUGVyY2VudGlsZTogdmlzQ29uZmlnLmVsZXZhdGlvblBlcmNlbnRpbGVbMV0sXG5cbiAgICAgIC8vIHVwZGF0ZVRyaWdnZXJzXG4gICAgICB1cGRhdGVUcmlnZ2VycyxcblxuICAgICAgLy8gY2FsbGJhY2tzXG4gICAgICBvblNldENvbG9yRG9tYWluOiBsYXllckNhbGxiYWNrcy5vblNldExheWVyRG9tYWluXG4gICAgfTtcbiAgfVxufVxuIl19