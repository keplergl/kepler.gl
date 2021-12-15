"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.aggregateRequiredColumns = exports.getFilterDataFunc = exports.getValueAggrFunc = exports.pointPosResolver = exports.pointPosAccessor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _baseLayer = _interopRequireDefault(require("./base-layer"));

var _colorUtils = require("../utils/color-utils");

var _aggregateUtils = require("../utils/aggregate-utils");

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
      return field.valueAccessor(p.data);
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

var AggregationLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(AggregationLayer, _Layer);

  var _super = _createSuper(AggregationLayer);

  function AggregationLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, AggregationLayer);
    _this = _super.call(this, props);

    _this.getPositionAccessor = function () {
      return pointPosAccessor(_this.config.columns);
    };

    _this.getColorRange = (0, _lodash["default"])(getLayerColorRange);
    return _this;
  }

  (0, _createClass2["default"])(AggregationLayer, [{
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
      return [].concat((0, _toConsumableArray2["default"])((0, _get2["default"])((0, _getPrototypeOf2["default"])(AggregationLayer.prototype), "noneLayerDataAffectingProps", this)), ['enable3d', 'colorRange', 'colorDomain', 'sizeRange', 'sizeScale', 'sizeDomain', 'percentile', 'coverage', 'elevationPercentile', 'elevationScale', 'enableElevationZoomFactor']);
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
    /**
     * Get the description of a visualChannel config
     * @param key
     * @returns {{label: string, measure: (string|string)}}
     */

  }, {
    key: "getVisualChannelDescription",
    value: function getVisualChannelDescription(key) {
      // e.g. label: Color, measure: Average of ETA
      var _this$visualChannels$ = this.visualChannels[key],
          range = _this$visualChannels$.range,
          field = _this$visualChannels$.field,
          defaultMeasure = _this$visualChannels$.defaultMeasure,
          aggregation = _this$visualChannels$.aggregation;
      var fieldConfig = this.config[field];
      return {
        label: this.visConfigSettings[range].label,
        measure: fieldConfig ? "".concat(this.config.visConfig[aggregation], " of ").concat(fieldConfig.displayName || fieldConfig.name) : defaultMeasure
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

      return _objectSpread(_objectSpread({
        data: data,
        getPosition: getPosition,
        _filterData: filterData
      }, getColorValue ? {
        getColorValue: getColorValue
      } : {}), getElevationValue ? {
        getElevationValue: getElevationValue
      } : {});
    }
  }, {
    key: "getDefaultDeckLayerProps",
    value: function getDefaultDeckLayerProps(opts) {
      var baseProp = (0, _get2["default"])((0, _getPrototypeOf2["default"])(AggregationLayer.prototype), "getDefaultDeckLayerProps", this).call(this, opts);
      return _objectSpread(_objectSpread({}, baseProp), {}, {
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
      return _objectSpread(_objectSpread({}, this.getDefaultDeckLayerProps(opts)), {}, {
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
  }]);
  return AggregationLayer;
}(_baseLayer["default"]);

exports["default"] = AggregationLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvYWdncmVnYXRpb24tbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJkYXRhIiwiZmllbGRJZHgiLCJwb2ludFBvc1Jlc29sdmVyIiwiZ2V0VmFsdWVBZ2dyRnVuYyIsImZpZWxkIiwiYWdncmVnYXRpb24iLCJwb2ludHMiLCJtYXAiLCJwIiwidmFsdWVBY2Nlc3NvciIsImxlbmd0aCIsImdldEZpbHRlckRhdGFGdW5jIiwiZmlsdGVyUmFuZ2UiLCJnZXRGaWx0ZXJWYWx1ZSIsInB0IiwiZXZlcnkiLCJ2YWwiLCJpIiwiZ2V0TGF5ZXJDb2xvclJhbmdlIiwiY29sb3JSYW5nZSIsImNvbG9ycyIsImhleFRvUmdiIiwiYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zIiwiQWdncmVnYXRpb25MYXllciIsInByb3BzIiwiZ2V0UG9zaXRpb25BY2Nlc3NvciIsImNvbmZpZyIsImNvbHVtbnMiLCJnZXRDb2xvclJhbmdlIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJjb2xvciIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsImNvbG9yQWdnciIsImRlZmF1bHRNZWFzdXJlIiwiZG9tYWluIiwia2V5IiwicHJvcGVydHkiLCJyYW5nZSIsInNjYWxlIiwic2l6ZSIsInNpemVBZ2dyIiwiY29uZGl0aW9uIiwidmlzQ29uZmlnIiwiZW5hYmxlM2QiLCJ2aXN1YWxDaGFubmVscyIsImZpZWxkQ29uZmlnIiwibGFiZWwiLCJ2aXNDb25maWdTZXR0aW5ncyIsIm1lYXN1cmUiLCJkaXNwbGF5TmFtZSIsIm5hbWUiLCJvYmplY3QiLCJjaGFubmVsIiwiYWxsRGF0YSIsInZhbGlkYXRlVmlzdWFsQ2hhbm5lbCIsInZhbGlkYXRlRmllbGRUeXBlIiwidmFsaWRhdGVBZ2dyZWdhdGlvblR5cGUiLCJ2YWxpZGF0ZVNjYWxlIiwidmlzdWFsQ2hhbm5lbCIsImFnZ3JlZ2F0aW9uT3B0aW9ucyIsImdldEFnZ3JlZ2F0aW9uT3B0aW9ucyIsInVwZGF0ZUxheWVyQ29uZmlnIiwiaW5jbHVkZXMiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsIk9iamVjdCIsImtleXMiLCJGSUVMRF9PUFRTIiwidHlwZSIsIkRFRkFVTFRfQUdHUkVHQVRJT04iLCJhZ2dyZWdhdGlvblR5cGUiLCJkYXRhc2V0cyIsIm5ld0ZpbHRlciIsImdldFBvc2l0aW9uIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsImZpbHRlcmVkSW5kZXgiLCJpbmRleCIsInBvcyIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsIm9sZExheWVyRGF0YSIsImdwdUZpbHRlciIsImRhdGFJZCIsImdldENvbG9yVmFsdWUiLCJjb2xvckZpZWxkIiwiY29sb3JBZ2dyZWdhdGlvbiIsImdldEVsZXZhdGlvblZhbHVlIiwic2l6ZUZpZWxkIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiaGFzRmlsdGVyIiwidmFsdWVzIiwic29tZSIsImFyciIsInYiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiZmlsdGVyRGF0YSIsInVuZGVmaW5lZCIsInVwZGF0ZURhdGEiLCJfZmlsdGVyRGF0YSIsIm9wdHMiLCJiYXNlUHJvcCIsImhpZ2hsaWdodENvbG9yIiwiSElHSExJR0hfQ09MT1JfM0QiLCJleHRlbnNpb25zIiwiYXV0b0hpZ2hsaWdodCIsIm1hcFN0YXRlIiwibGF5ZXJDYWxsYmFja3MiLCJlbGVab29tRmFjdG9yIiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsInVwZGF0ZVRyaWdnZXJzIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImNvdmVyYWdlIiwiY29sb3JTY2FsZVR5cGUiLCJjb2xvclNjYWxlIiwidXBwZXJQZXJjZW50aWxlIiwicGVyY2VudGlsZSIsImxvd2VyUGVyY2VudGlsZSIsImV4dHJ1ZGVkIiwiZWxldmF0aW9uU2NhbGUiLCJlbGV2YXRpb25TY2FsZVR5cGUiLCJzaXplU2NhbGUiLCJlbGV2YXRpb25SYW5nZSIsInNpemVSYW5nZSIsImVsZXZhdGlvbkxvd2VyUGVyY2VudGlsZSIsImVsZXZhdGlvblBlcmNlbnRpbGUiLCJlbGV2YXRpb25VcHBlclBlcmNlbnRpbGUiLCJvblNldENvbG9yRG9tYWluIiwib25TZXRMYXllckRvbWFpbiIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBSU8sSUFBTUEsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVDLEdBQUYsUUFBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsUUFBT0EsR0FBUDtBQUFBLFNBQWdCLFVBQUFDLENBQUM7QUFBQSxXQUFJLENBQUNBLENBQUMsQ0FBQ0MsSUFBRixDQUFPRixHQUFHLENBQUNHLFFBQVgsQ0FBRCxFQUF1QkYsQ0FBQyxDQUFDQyxJQUFGLENBQU9ILEdBQUcsQ0FBQ0ksUUFBWCxDQUF2QixDQUFKO0FBQUEsR0FBakI7QUFBQSxDQUF6Qjs7OztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFTCxHQUFGLFNBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFNBQU9BLEdBQVA7QUFBQSxtQkFBbUJELEdBQUcsQ0FBQ0ksUUFBdkIsY0FBbUNILEdBQUcsQ0FBQ0csUUFBdkM7QUFBQSxDQUF6Qjs7OztBQUVBLElBQU1FLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsS0FBRCxFQUFRQyxXQUFSLEVBQXdCO0FBQ3RELFNBQU8sVUFBQUMsTUFBTSxFQUFJO0FBQ2YsV0FBT0YsS0FBSyxHQUNSLCtCQUNFRSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxVQUFBQyxDQUFDO0FBQUEsYUFBSUosS0FBSyxDQUFDSyxhQUFOLENBQW9CRCxDQUFDLENBQUNSLElBQXRCLENBQUo7QUFBQSxLQUFaLENBREYsRUFFRUssV0FGRixDQURRLEdBS1JD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Y0FBYyxFQUFFL0UsU0FBUyxDQUFDK0UsY0FBVixHQUEyQlosYUFiN0M7QUFjRWEsUUFBQUEsa0JBQWtCLEVBQUUsS0FBS2pHLE1BQUwsQ0FBWWtHLFNBZGxDO0FBZUVDLFFBQUFBLGNBQWMsRUFBRWxGLFNBQVMsQ0FBQ21GLFNBZjVCO0FBZ0JFQyxRQUFBQSx3QkFBd0IsRUFBRXBGLFNBQVMsQ0FBQ3FGLG1CQUFWLENBQThCLENBQTlCLENBaEI1QjtBQWlCRUMsUUFBQUEsd0JBQXdCLEVBQUV0RixTQUFTLENBQUNxRixtQkFBVixDQUE4QixDQUE5QixDQWpCNUI7QUFtQkU7QUFDQWhCLFFBQUFBLGNBQWMsRUFBZEEsY0FwQkY7QUFzQkU7QUFDQWtCLFFBQUFBLGdCQUFnQixFQUFFckIsY0FBYyxDQUFDc0I7QUF2Qm5DO0FBeUJEOzs7RUFsUjJDQyxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCBMYXllciBmcm9tICcuL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IHthZ2dyZWdhdGV9IGZyb20gJ3V0aWxzL2FnZ3JlZ2F0ZS11dGlscyc7XG5pbXBvcnQge0hJR0hMSUdIX0NPTE9SXzNEfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVMsIEZJRUxEX09QVFMsIERFRkFVTFRfQUdHUkVHQVRJT059IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zQWNjZXNzb3IgPSAoe2xhdCwgbG5nfSkgPT4gZCA9PiBbZC5kYXRhW2xuZy5maWVsZElkeF0sIGQuZGF0YVtsYXQuZmllbGRJZHhdXTtcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zUmVzb2x2ZXIgPSAoe2xhdCwgbG5nfSkgPT4gYCR7bGF0LmZpZWxkSWR4fS0ke2xuZy5maWVsZElkeH1gO1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsdWVBZ2dyRnVuYyA9IChmaWVsZCwgYWdncmVnYXRpb24pID0+IHtcbiAgcmV0dXJuIHBvaW50cyA9PiB7XG4gICAgcmV0dXJuIGZpZWxkXG4gICAgICA/IGFnZ3JlZ2F0ZShcbiAgICAgICAgICBwb2ludHMubWFwKHAgPT4gZmllbGQudmFsdWVBY2Nlc3NvcihwLmRhdGEpKSxcbiAgICAgICAgICBhZ2dyZWdhdGlvblxuICAgICAgICApXG4gICAgICA6IHBvaW50cy5sZW5ndGg7XG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyRGF0YUZ1bmMgPSAoZmlsdGVyUmFuZ2UsIGdldEZpbHRlclZhbHVlKSA9PiBwdCA9PlxuICBnZXRGaWx0ZXJWYWx1ZShwdCkuZXZlcnkoKHZhbCwgaSkgPT4gdmFsID49IGZpbHRlclJhbmdlW2ldWzBdICYmIHZhbCA8PSBmaWx0ZXJSYW5nZVtpXVsxXSk7XG5cbmNvbnN0IGdldExheWVyQ29sb3JSYW5nZSA9IGNvbG9yUmFuZ2UgPT4gY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKTtcblxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZVJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZyddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZ2dyZWdhdGlvbkxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IHBvaW50UG9zQWNjZXNzb3IodGhpcy5jb25maWcuY29sdW1ucyk7XG4gICAgdGhpcy5nZXRDb2xvclJhbmdlID0gbWVtb2l6ZShnZXRMYXllckNvbG9yUmFuZ2UpO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRQb2ludENvbHVtblBhaXJzO1xuICB9XG5cbiAgZ2V0IG5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgLi4uc3VwZXIubm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzLFxuICAgICAgJ2VuYWJsZTNkJyxcbiAgICAgICdjb2xvclJhbmdlJyxcbiAgICAgICdjb2xvckRvbWFpbicsXG4gICAgICAnc2l6ZVJhbmdlJyxcbiAgICAgICdzaXplU2NhbGUnLFxuICAgICAgJ3NpemVEb21haW4nLFxuICAgICAgJ3BlcmNlbnRpbGUnLFxuICAgICAgJ2NvdmVyYWdlJyxcbiAgICAgICdlbGV2YXRpb25QZXJjZW50aWxlJyxcbiAgICAgICdlbGV2YXRpb25TY2FsZScsXG4gICAgICAnZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvcidcbiAgICBdO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBhZ2dyZWdhdGlvbjogJ2NvbG9yQWdncmVnYXRpb24nLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAncHJvcGVydHkucG9pbnRDb3VudCcsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJ1xuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgYWdncmVnYXRpb246ICdzaXplQWdncmVnYXRpb24nLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5zaXplQWdncixcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgZGVmYXVsdE1lYXN1cmU6ICdwcm9wZXJ0eS5wb2ludENvdW50JyxcbiAgICAgICAgZG9tYWluOiAnc2l6ZURvbWFpbicsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAga2V5OiAnc2l6ZScsXG4gICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBzY2FsZTogJ3NpemVTY2FsZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGVzY3JpcHRpb24gb2YgYSB2aXN1YWxDaGFubmVsIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt7bGFiZWw6IHN0cmluZywgbWVhc3VyZTogKHN0cmluZ3xzdHJpbmcpfX1cbiAgICovXG4gIGdldFZpc3VhbENoYW5uZWxEZXNjcmlwdGlvbihrZXkpIHtcbiAgICAvLyBlLmcuIGxhYmVsOiBDb2xvciwgbWVhc3VyZTogQXZlcmFnZSBvZiBFVEFcbiAgICBjb25zdCB7cmFuZ2UsIGZpZWxkLCBkZWZhdWx0TWVhc3VyZSwgYWdncmVnYXRpb259ID0gdGhpcy52aXN1YWxDaGFubmVsc1trZXldO1xuICAgIGNvbnN0IGZpZWxkQ29uZmlnID0gdGhpcy5jb25maWdbZmllbGRdO1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdGhpcy52aXNDb25maWdTZXR0aW5nc1tyYW5nZV0ubGFiZWwsXG4gICAgICBtZWFzdXJlOiBmaWVsZENvbmZpZ1xuICAgICAgICA/IGAke3RoaXMuY29uZmlnLnZpc0NvbmZpZ1thZ2dyZWdhdGlvbl19IG9mICR7ZmllbGRDb25maWcuZGlzcGxheU5hbWUgfHwgZmllbGRDb25maWcubmFtZX1gXG4gICAgICAgIDogZGVmYXVsdE1lYXN1cmVcbiAgICB9O1xuICB9XG5cbiAgZ2V0SG92ZXJEYXRhKG9iamVjdCkge1xuICAgIC8vIHJldHVybiBhZ2dyZWdhdGVkIG9iamVjdFxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogQWdncmVnYXRpb24gbGF5ZXIgaGFuZGxlcyB2aXN1YWwgY2hhbm5lbCBhZ2dyZWdhdGlvbiBpbnNpZGUgZGVjay5nbCBsYXllclxuICAgKi9cbiAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCkge1xuICAgIHRoaXMudmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFnZ3JlZ2F0aW9uIHR5cGUgb24gdG9wIG9mIGJhc2ljIGxheWVyIHZpc3VhbCBjaGFubmVsIHZhbGlkYXRpb25cbiAgICogQHBhcmFtIGNoYW5uZWxcbiAgICovXG4gIHZhbGlkYXRlVmlzdWFsQ2hhbm5lbChjaGFubmVsKSB7XG4gICAgLy8gZmllbGQgdHlwZSBkZWNpZGVzIGFnZ3JlZ2F0aW9uIHR5cGUgZGVjaWRlcyBzY2FsZSB0eXBlXG4gICAgdGhpcy52YWxpZGF0ZUZpZWxkVHlwZShjaGFubmVsKTtcbiAgICB0aGlzLnZhbGlkYXRlQWdncmVnYXRpb25UeXBlKGNoYW5uZWwpO1xuICAgIHRoaXMudmFsaWRhdGVTY2FsZShjaGFubmVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhZ2dyZWdhdGlvbiB0eXBlIGJhc2VkIG9uIHNlbGVjdGVkIGZpZWxkXG4gICAqL1xuICB2YWxpZGF0ZUFnZ3JlZ2F0aW9uVHlwZShjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG4gICAgY29uc3Qge2ZpZWxkLCBhZ2dyZWdhdGlvbn0gPSB2aXN1YWxDaGFubmVsO1xuICAgIGNvbnN0IGFnZ3JlZ2F0aW9uT3B0aW9ucyA9IHRoaXMuZ2V0QWdncmVnYXRpb25PcHRpb25zKGNoYW5uZWwpO1xuXG4gICAgaWYgKCFhZ2dyZWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghYWdncmVnYXRpb25PcHRpb25zLmxlbmd0aCkge1xuICAgICAgLy8gaWYgZmllbGQgY2Fubm90IGJlIGFnZ3JlZ2F0ZWQsIHNldCBmaWVsZCB0byBudWxsXG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZmllbGRdOiBudWxsfSk7XG4gICAgfSBlbHNlIGlmICghYWdncmVnYXRpb25PcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnLnZpc0NvbmZpZ1thZ2dyZWdhdGlvbl0pKSB7XG4gICAgICAvLyBjdXJyZW50IGFnZ3JlZ2F0aW9uIHR5cGUgaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGZpZWxkXG4gICAgICAvLyBzZXQgYWdncmVnYXRpb24gdG8gdGhlIGZpcnN0IHN1cHBvcnRlZCBvcHRpb25cbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJWaXNDb25maWcoe1thZ2dyZWdhdGlvbl06IGFnZ3JlZ2F0aW9uT3B0aW9uc1swXX0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEFnZ3JlZ2F0aW9uT3B0aW9ucyhjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG4gICAgY29uc3Qge2ZpZWxkLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoXG4gICAgICB0aGlzLmNvbmZpZ1tmaWVsZF1cbiAgICAgICAgPyBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXVxuICAgICAgICA6IERFRkFVTFRfQUdHUkVHQVRJT05bY2hhbm5lbFNjYWxlVHlwZV1cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzY2FsZSBvcHRpb25zIGJhc2VkIG9uIGN1cnJlbnQgZmllbGQgYW5kIGFnZ3JlZ2F0aW9uIHR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0U2NhbGVPcHRpb25zKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIGFnZ3JlZ2F0aW9uLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3QgYWdncmVnYXRpb25UeXBlID0gdGhpcy5jb25maWcudmlzQ29uZmlnW2FnZ3JlZ2F0aW9uXTtcbiAgICByZXR1cm4gdGhpcy5jb25maWdbZmllbGRdXG4gICAgICA/IC8vIHNjYWxlIG9wdGlvbnMgYmFzZWQgb24gYWdncmVnYXRpb25cbiAgICAgICAgRklFTERfT1BUU1t0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZV0uc2NhbGVbY2hhbm5lbFNjYWxlVHlwZV1bYWdncmVnYXRpb25UeXBlXVxuICAgICAgOiAvLyBkZWZhdWx0IHNjYWxlIG9wdGlvbnMgZm9yIHBvaW50IGNvdW50XG4gICAgICAgIERFRkFVTFRfQUdHUkVHQVRJT05bY2hhbm5lbFNjYWxlVHlwZV1bYWdncmVnYXRpb25UeXBlXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBsYXllciBoYW5kbGVzIHZpc3VhbCBjaGFubmVsIGFnZ3JlZ2F0aW9uIGluc2lkZSBkZWNrLmdsIGxheWVyXG4gICAqL1xuICB1cGRhdGVMYXllckRvbWFpbihkYXRhc2V0cywgbmV3RmlsdGVyKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICAvLyBnZXQgYm91bmRzIGZyb20gcG9pbnRzXG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZCA9PiBnZXRQb3NpdGlvbih7ZGF0YTogZH0pKTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4fSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcmVkSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZmlsdGVyZWRJbmRleFtpXTtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBhbGxEYXRhW2luZGV4XX0pO1xuXG4gICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgcG9pbnRcbiAgICAgIC8vIGRlY2suZ2wgY2FuJ3QgaGFuZGxlIHBvc2l0aW9uID0gbnVsbFxuICAgICAgaWYgKHBvcy5ldmVyeShOdW1iZXIuaXNGaW5pdGUpKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7IC8vIGlmIChcbiAgICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG5cbiAgICBjb25zdCBnZXRDb2xvclZhbHVlID0gZ2V0VmFsdWVBZ2dyRnVuYyhcbiAgICAgIHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvblxuICAgICk7XG5cbiAgICBjb25zdCBnZXRFbGV2YXRpb25WYWx1ZSA9IGdldFZhbHVlQWdnckZ1bmMoXG4gICAgICB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICB0aGlzLmNvbmZpZy52aXNDb25maWcuc2l6ZUFnZ3JlZ2F0aW9uXG4gICAgKTtcbiAgICBjb25zdCBoYXNGaWx0ZXIgPSBPYmplY3QudmFsdWVzKGdwdUZpbHRlci5maWx0ZXJSYW5nZSkuc29tZShhcnIgPT4gYXJyLnNvbWUodiA9PiB2ICE9PSAwKSk7XG4gICAgY29uc3QgZ2V0RmlsdGVyVmFsdWUgPSBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcigpO1xuICAgIGNvbnN0IGZpbHRlckRhdGEgPSBoYXNGaWx0ZXJcbiAgICAgID8gZ2V0RmlsdGVyRGF0YUZ1bmMoZ3B1RmlsdGVyLmZpbHRlclJhbmdlLCBnZXRGaWx0ZXJWYWx1ZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy51cGRhdGVEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIF9maWx0ZXJEYXRhOiBmaWx0ZXJEYXRhLFxuICAgICAgLi4uKGdldENvbG9yVmFsdWUgPyB7Z2V0Q29sb3JWYWx1ZX0gOiB7fSksXG4gICAgICAuLi4oZ2V0RWxldmF0aW9uVmFsdWUgPyB7Z2V0RWxldmF0aW9uVmFsdWV9IDoge30pXG4gICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKSB7XG4gICAgY29uc3QgYmFzZVByb3AgPSBzdXBlci5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmJhc2VQcm9wLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IEhJR0hMSUdIX0NPTE9SXzNELFxuICAgICAgLy8gZ3B1IGRhdGEgZmlsdGVyaW5nIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWdncmVnYXRpb24gbGF5ZXJcbiAgICAgIGV4dGVuc2lvbnM6IFtdLFxuICAgICAgYXV0b0hpZ2hsaWdodDogdGhpcy5jb25maWcudmlzQ29uZmlnLmVuYWJsZTNkXG4gICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHRBZ2dyZWdhdGlvbkxheWVyUHJvcChvcHRzKSB7XG4gICAgY29uc3Qge2dwdUZpbHRlciwgbWFwU3RhdGUsIGxheWVyQ2FsbGJhY2tzID0ge319ID0gb3B0cztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUpO1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRDb2xvclZhbHVlOiB7XG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yQWdncmVnYXRpb246IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvckFnZ3JlZ2F0aW9uXG4gICAgICB9LFxuICAgICAgZ2V0RWxldmF0aW9uVmFsdWU6IHtcbiAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICAgIHNpemVBZ2dyZWdhdGlvbjogdGhpcy5jb25maWcudmlzQ29uZmlnLnNpemVBZ2dyZWdhdGlvblxuICAgICAgfSxcbiAgICAgIF9maWx0ZXJEYXRhOiB7XG4gICAgICAgIGZpbHRlclJhbmdlOiBncHVGaWx0ZXIuZmlsdGVyUmFuZ2UsXG4gICAgICAgIC4uLmdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKSxcbiAgICAgIGNvdmVyYWdlOiB2aXNDb25maWcuY292ZXJhZ2UsXG5cbiAgICAgIC8vIGNvbG9yXG4gICAgICBjb2xvclJhbmdlOiB0aGlzLmdldENvbG9yUmFuZ2UodmlzQ29uZmlnLmNvbG9yUmFuZ2UpLFxuICAgICAgY29sb3JTY2FsZVR5cGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICB1cHBlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5wZXJjZW50aWxlWzFdLFxuICAgICAgbG93ZXJQZXJjZW50aWxlOiB2aXNDb25maWcucGVyY2VudGlsZVswXSxcbiAgICAgIGNvbG9yQWdncmVnYXRpb246IHZpc0NvbmZpZy5jb2xvckFnZ3JlZ2F0aW9uLFxuXG4gICAgICAvLyBlbGV2YXRpb25cbiAgICAgIGV4dHJ1ZGVkOiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcbiAgICAgIGVsZXZhdGlvblNjYWxlVHlwZTogdGhpcy5jb25maWcuc2l6ZVNjYWxlLFxuICAgICAgZWxldmF0aW9uUmFuZ2U6IHZpc0NvbmZpZy5zaXplUmFuZ2UsXG4gICAgICBlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25QZXJjZW50aWxlWzBdLFxuICAgICAgZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVsxXSxcblxuICAgICAgLy8gdXBkYXRlVHJpZ2dlcnNcbiAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuXG4gICAgICAvLyBjYWxsYmFja3NcbiAgICAgIG9uU2V0Q29sb3JEb21haW46IGxheWVyQ2FsbGJhY2tzLm9uU2V0TGF5ZXJEb21haW5cbiAgICB9O1xuICB9XG59XG4iXX0=