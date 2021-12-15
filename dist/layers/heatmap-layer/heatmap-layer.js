"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.heatmapVisConfigs = exports.pointColResolver = exports.pointPosAccessor = exports.MAX_ZOOM_LEVEL = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _reselect = require("reselect");

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _defaultSettings = require("../../constants/default-settings");

var _colorUtils = require("../../utils/color-utils");

var _mapboxglLayer = _interopRequireDefault(require("../mapboxgl-layer"));

var _heatmapLayerIcon = _interopRequireDefault(require("./heatmap-layer-icon"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MAX_ZOOM_LEVEL = 18;
exports.MAX_ZOOM_LEVEL = MAX_ZOOM_LEVEL;

var pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return function (d) {
    return [// lng
    d[lng.fieldIdx], // lat
    d[lat.fieldIdx]];
  };
};

exports.pointPosAccessor = pointPosAccessor;

var pointColResolver = function pointColResolver(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng;
  return "".concat(lat.fieldIdx, "-").concat(lng.fieldIdx);
};

exports.pointColResolver = pointColResolver;
var heatmapVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  radius: 'heatmapRadius'
};
/**
 *
 * @param {Object} colorRange
 * @return {Array} [
 *  0, "rgba(33,102,172,0)",
 *  0.2, "rgb(103,169,207)",
 *  0.4, "rgb(209,229,240)",
 *  0.6, "rgb(253,219,199)",
 *  0.8, "rgb(239,138,98)",
 *  1, "rgb(178,24,43)"
 * ]
 */

exports.heatmapVisConfigs = heatmapVisConfigs;

var heatmapDensity = function heatmapDensity(colorRange) {
  var scaleFunction = _defaultSettings.SCALE_FUNC.quantize;
  var colors = ['#000000'].concat((0, _toConsumableArray2["default"])(colorRange.colors));
  var scale = scaleFunction().domain([0, 1]).range(colors);
  var colorDensity = scale.range().reduce(function (bands, level) {
    var invert = scale.invertExtent(level);
    return [].concat((0, _toConsumableArray2["default"])(bands), [invert[0], // first value in the range
    "rgb(".concat((0, _colorUtils.hexToRgb)(level).join(','), ")") // color
    ]);
  }, []);
  colorDensity[1] = 'rgba(0,0,0,0)';
  return colorDensity;
};

var HeatmapLayer = /*#__PURE__*/function (_MapboxGLLayer) {
  (0, _inherits2["default"])(HeatmapLayer, _MapboxGLLayer);

  var _super = _createSuper(HeatmapLayer);

  function HeatmapLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, HeatmapLayer);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "columnsSelector", function (config) {
      return pointColResolver(config.columns);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "visConfigSelector", function (config) {
      return config.visConfig;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "weightFieldSelector", function (config) {
      return config.weightField ? config.weightField.name : null;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "weightDomainSelector", function (config) {
      return config.weightDomain;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "paintSelector", (0, _reselect.createSelector)(_this.visConfigSelector, _this.weightFieldSelector, _this.weightDomainSelector, function (visConfig, weightField, weightDomain) {
      return {
        'heatmap-weight': weightField ? ['interpolate', ['linear'], ['get', weightField], weightDomain[0], 0, weightDomain[1], 1] : 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
        'heatmap-color': ['interpolate', ['linear'], ['heatmap-density']].concat((0, _toConsumableArray2["default"])(heatmapDensity(visConfig.colorRange))),
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, visConfig.radius // radius
        ],
        'heatmap-opacity': visConfig.opacity
      };
    }));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "computeHeatmapConfiguration", (0, _reselect.createSelector)(_this.sourceSelector, _this.filterSelector, _this.paintSelector, function (source, filter, paint) {
      return _objectSpread({
        type: 'heatmap',
        id: _this.id,
        source: source,
        layout: {
          visibility: 'visible'
        },
        maxzoom: MAX_ZOOM_LEVEL,
        paint: paint
      }, _this.isValidFilter(filter) ? {
        filter: filter
      } : {});
    }));

    _this.registerVisConfig(heatmapVisConfigs);

    _this.getPosition = (0, _lodash["default"])(pointPosAccessor, pointColResolver);
    return _this;
  }

  (0, _createClass2["default"])(HeatmapLayer, [{
    key: "type",
    get: function get() {
      return 'heatmap';
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        weight: {
          property: 'weight',
          field: 'weightField',
          scale: 'weightScale',
          domain: 'weightDomain',
          key: 'weight',
          // supportedFieldTypes can be determined by channelScaleType
          // or specified here
          defaultMeasure: 'property.density',
          supportedFieldTypes: [_defaultSettings.ALL_FIELD_TYPES.real, _defaultSettings.ALL_FIELD_TYPES.integer],
          channelScaleType: _defaultSettings.CHANNEL_SCALES.size
        }
      };
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _heatmapLayerIcon["default"];
    }
  }, {
    key: "getVisualChannelDescription",
    value: function getVisualChannelDescription(channel) {
      return channel === 'color' ? {
        label: 'property.color',
        measure: 'property.density'
      } : {
        label: 'property.weight',
        measure: this.config.weightField ? this.config.weightField.name : 'property.density'
      };
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // mapbox heatmap layer color is always based on density
      // no need to set colorField, colorDomain and colorScale

      /* eslint-disable no-unused-vars */
      var _get$call$weightField = _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HeatmapLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
        weightField: null,
        weightDomain: [0, 1],
        weightScale: 'linear'
      }),
          colorField = _get$call$weightField.colorField,
          colorDomain = _get$call$weightField.colorDomain,
          colorScale = _get$call$weightField.colorScale,
          layerConfig = (0, _objectWithoutProperties2["default"])(_get$call$weightField, ["colorField", "colorDomain", "colorScale"]);
      /* eslint-enable no-unused-vars */


      return layerConfig;
    }
  }, {
    key: "getPositionAccessor",
    value: function getPositionAccessor() {
      return this.getPosition(this.config.columns);
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData) {
      var getPosition = this.getPositionAccessor();
      var bounds = this.getPointsBounds(allData, function (d) {
        return getPosition(d);
      });
      this.updateMeta({
        bounds: bounds
      });
    }
  }, {
    key: "getGeometry",
    value: function getGeometry(position) {
      return position.every(Number.isFinite) ? {
        type: 'Point',
        coordinates: position
      } : null;
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var weightField = this.config.weightField;
      var getPosition = this.getPositionAccessor();

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var newConfig = this.computeHeatmapConfiguration(this.config, datasets);
      newConfig.id = this.id;
      return {
        columns: this.config.columns,
        config: newConfig,
        data: data,
        weightField: weightField,
        getPosition: getPosition
      };
    }
  }]);
  return HeatmapLayer;
}(_mapboxglLayer["default"]);

var _default = HeatmapLayer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGVhdG1hcC1sYXllci9oZWF0bWFwLWxheWVyLmpzIl0sIm5hbWVzIjpbIk1BWF9aT09NX0xFVkVMIiwicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJmaWVsZElkeCIsInBvaW50Q29sUmVzb2x2ZXIiLCJoZWF0bWFwVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwicmFkaXVzIiwiaGVhdG1hcERlbnNpdHkiLCJzY2FsZUZ1bmN0aW9uIiwiU0NBTEVfRlVOQyIsInF1YW50aXplIiwiY29sb3JzIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImNvbG9yRGVuc2l0eSIsInJlZHVjZSIsImJhbmRzIiwibGV2ZWwiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJqb2luIiwiSGVhdG1hcExheWVyIiwicHJvcHMiLCJjb25maWciLCJjb2x1bW5zIiwidmlzQ29uZmlnIiwid2VpZ2h0RmllbGQiLCJuYW1lIiwid2VpZ2h0RG9tYWluIiwidmlzQ29uZmlnU2VsZWN0b3IiLCJ3ZWlnaHRGaWVsZFNlbGVjdG9yIiwid2VpZ2h0RG9tYWluU2VsZWN0b3IiLCJzb3VyY2VTZWxlY3RvciIsImZpbHRlclNlbGVjdG9yIiwicGFpbnRTZWxlY3RvciIsInNvdXJjZSIsImZpbHRlciIsInBhaW50IiwidHlwZSIsImlkIiwibGF5b3V0IiwidmlzaWJpbGl0eSIsIm1heHpvb20iLCJpc1ZhbGlkRmlsdGVyIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsIndlaWdodCIsInByb3BlcnR5IiwiZmllbGQiLCJrZXkiLCJkZWZhdWx0TWVhc3VyZSIsInN1cHBvcnRlZEZpZWxkVHlwZXMiLCJBTExfRklFTERfVFlQRVMiLCJyZWFsIiwiaW50ZWdlciIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsInNpemUiLCJIZWF0bWFwTGF5ZXJJY29uIiwiY2hhbm5lbCIsImxhYmVsIiwibWVhc3VyZSIsIndlaWdodFNjYWxlIiwiY29sb3JGaWVsZCIsImNvbG9yRG9tYWluIiwiY29sb3JTY2FsZSIsImxheWVyQ29uZmlnIiwiYWxsRGF0YSIsImdldFBvc2l0aW9uQWNjZXNzb3IiLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJ1cGRhdGVNZXRhIiwicG9zaXRpb24iLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwiY29vcmRpbmF0ZXMiLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsInVwZGF0ZURhdGEiLCJkYXRhIiwibmV3Q29uZmlnIiwiY29tcHV0ZUhlYXRtYXBDb25maWd1cmF0aW9uIiwiTWFwYm94R0xMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxjQUFjLEdBQUcsRUFBdkI7OztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxTQUFnQixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUNuRDtBQUNBQSxJQUFBQSxDQUFDLENBQUNELEdBQUcsQ0FBQ0UsUUFBTCxDQUZrRCxFQUduRDtBQUNBRCxJQUFBQSxDQUFDLENBQUNGLEdBQUcsQ0FBQ0csUUFBTCxDQUprRCxDQUFKO0FBQUEsR0FBakI7QUFBQSxDQUF6Qjs7OztBQU9BLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFSixHQUFGLFNBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFNBQU9BLEdBQVA7QUFBQSxtQkFBbUJELEdBQUcsQ0FBQ0csUUFBdkIsY0FBbUNGLEdBQUcsQ0FBQ0UsUUFBdkM7QUFBQSxDQUF6Qjs7O0FBRUEsSUFBTUUsaUJBQWlCLEdBQUc7QUFDL0JDLEVBQUFBLE9BQU8sRUFBRSxTQURzQjtBQUUvQkMsRUFBQUEsVUFB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S3dFLFVBQUwsQ0FBZ0I7QUFBQ0YsUUFBQUEsTUFBTSxFQUFOQTtBQUFELE9BQWhCO0FBQ0Q7OztXQXNERCxxQkFBWUcsUUFBWixFQUFzQjtBQUNwQixhQUFPQSxRQUFRLENBQUNDLEtBQVQsQ0FBZUMsTUFBTSxDQUFDQyxRQUF0QixJQUNIO0FBQ0VyQyxRQUFBQSxJQUFJLEVBQUUsT0FEUjtBQUVFc0MsUUFBQUEsV0FBVyxFQUFFSjtBQUZmLE9BREcsR0FLSCxJQUxKO0FBTUQ7OztXQUVELHlCQUFnQkssUUFBaEIsRUFBMEJDLFlBQTFCLEVBQXdDO0FBQUEsVUFDL0JwRCxXQUQrQixHQUNoQixLQUFLSCxNQURXLENBQy9CRyxXQUQrQjtBQUV0QyxVQUFNbUIsV0FBVyxHQUFHLEtBQUt1QixtQkFBTCxFQUFwQjs7QUFGc0MsNkJBR3ZCLEtBQUtXLFVBQUwsQ0FBZ0JGLFFBQWhCLEVBQTBCQyxZQUExQixDQUh1QjtBQUFBLFVBRy9CRSxJQUgrQixvQkFHL0JBLElBSCtCOztBQUt0QyxVQUFNQyxTQUFTLEdBQUcsS0FBS0MsMkJBQUwsQ0FBaUMsS0FBSzNELE1BQXRDLEVBQThDc0QsUUFBOUMsQ0FBbEI7QUFDQUksTUFBQUEsU0FBUyxDQUFDMUMsRUFBVixHQUFlLEtBQUtBLEVBQXBCO0FBRUEsYUFBTztBQUNMZixRQUFBQSxPQUFPLEVBQUUsS0FBS0QsTUFBTCxDQUFZQyxPQURoQjtBQUVMRCxRQUFBQSxNQUFNLEVBQUUwRCxTQUZIO0FBR0xELFFBQUFBLElBQUksRUFBSkEsSUFISztBQUlMdEQsUUFBQUEsV0FBVyxFQUFYQSxXQUpLO0FBS0xtQixRQUFBQSxXQUFXLEVBQVhBO0FBTEssT0FBUDtBQU9EOzs7RUFsSndCc0MseUI7O2VBcUpaOUQsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVMsIFNDQUxFX0ZVTkMsIEFMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IE1hcGJveEdMTGF5ZXIgZnJvbSAnLi4vbWFwYm94Z2wtbGF5ZXInO1xuaW1wb3J0IEhlYXRtYXBMYXllckljb24gZnJvbSAnLi9oZWF0bWFwLWxheWVyLWljb24nO1xuXG5leHBvcnQgY29uc3QgTUFYX1pPT01fTEVWRUwgPSAxODtcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zQWNjZXNzb3IgPSAoe2xhdCwgbG5nfSkgPT4gZCA9PiBbXG4gIC8vIGxuZ1xuICBkW2xuZy5maWVsZElkeF0sXG4gIC8vIGxhdFxuICBkW2xhdC5maWVsZElkeF1cbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludENvbFJlc29sdmVyID0gKHtsYXQsIGxuZ30pID0+IGAke2xhdC5maWVsZElkeH0tJHtsbmcuZmllbGRJZHh9YDtcblxuZXhwb3J0IGNvbnN0IGhlYXRtYXBWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzOiAnaGVhdG1hcFJhZGl1cydcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2xvclJhbmdlXG4gKiBAcmV0dXJuIHtBcnJheX0gW1xuICogIDAsIFwicmdiYSgzMywxMDIsMTcyLDApXCIsXG4gKiAgMC4yLCBcInJnYigxMDMsMTY5LDIwNylcIixcbiAqICAwLjQsIFwicmdiKDIwOSwyMjksMjQwKVwiLFxuICogIDAuNiwgXCJyZ2IoMjUzLDIxOSwxOTkpXCIsXG4gKiAgMC44LCBcInJnYigyMzksMTM4LDk4KVwiLFxuICogIDEsIFwicmdiKDE3OCwyNCw0MylcIlxuICogXVxuICovXG5jb25zdCBoZWF0bWFwRGVuc2l0eSA9IGNvbG9yUmFuZ2UgPT4ge1xuICBjb25zdCBzY2FsZUZ1bmN0aW9uID0gU0NBTEVfRlVOQy5xdWFudGl6ZTtcblxuICBjb25zdCBjb2xvcnMgPSBbJyMwMDAwMDAnLCAuLi5jb2xvclJhbmdlLmNvbG9yc107XG5cbiAgY29uc3Qgc2NhbGUgPSBzY2FsZUZ1bmN0aW9uKClcbiAgICAuZG9tYWluKFswLCAxXSlcbiAgICAucmFuZ2UoY29sb3JzKTtcblxuICBjb25zdCBjb2xvckRlbnNpdHkgPSBzY2FsZS5yYW5nZSgpLnJlZHVjZSgoYmFuZHMsIGxldmVsKSA9PiB7XG4gICAgY29uc3QgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGxldmVsKTtcbiAgICByZXR1cm4gW1xuICAgICAgLi4uYmFuZHMsXG4gICAgICBpbnZlcnRbMF0sIC8vIGZpcnN0IHZhbHVlIGluIHRoZSByYW5nZVxuICAgICAgYHJnYigke2hleFRvUmdiKGxldmVsKS5qb2luKCcsJyl9KWAgLy8gY29sb3JcbiAgICBdO1xuICB9LCBbXSk7XG4gIGNvbG9yRGVuc2l0eVsxXSA9ICdyZ2JhKDAsMCwwLDApJztcbiAgcmV0dXJuIGNvbG9yRGVuc2l0eTtcbn07XG5cbmNsYXNzIEhlYXRtYXBMYXllciBleHRlbmRzIE1hcGJveEdMTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGhlYXRtYXBWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uID0gbWVtb2l6ZShwb2ludFBvc0FjY2Vzc29yLCBwb2ludENvbFJlc29sdmVyKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaGVhdG1hcCc7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdlaWdodDoge1xuICAgICAgICBwcm9wZXJ0eTogJ3dlaWdodCcsXG4gICAgICAgIGZpZWxkOiAnd2VpZ2h0RmllbGQnLFxuICAgICAgICBzY2FsZTogJ3dlaWdodFNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnd2VpZ2h0RG9tYWluJyxcbiAgICAgICAga2V5OiAnd2VpZ2h0JyxcbiAgICAgICAgLy8gc3VwcG9ydGVkRmllbGRUeXBlcyBjYW4gYmUgZGV0ZXJtaW5lZCBieSBjaGFubmVsU2NhbGVUeXBlXG4gICAgICAgIC8vIG9yIHNwZWNpZmllZCBoZXJlXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAncHJvcGVydHkuZGVuc2l0eScsXG4gICAgICAgIHN1cHBvcnRlZEZpZWxkVHlwZXM6IFtBTExfRklFTERfVFlQRVMucmVhbCwgQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5zaXplXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIEhlYXRtYXBMYXllckljb247XG4gIH1cblxuICBnZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24oY2hhbm5lbCkge1xuICAgIHJldHVybiBjaGFubmVsID09PSAnY29sb3InXG4gICAgICA/IHtcbiAgICAgICAgICBsYWJlbDogJ3Byb3BlcnR5LmNvbG9yJyxcbiAgICAgICAgICBtZWFzdXJlOiAncHJvcGVydHkuZGVuc2l0eSdcbiAgICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgICAgbGFiZWw6ICdwcm9wZXJ0eS53ZWlnaHQnLFxuICAgICAgICAgIG1lYXN1cmU6IHRoaXMuY29uZmlnLndlaWdodEZpZWxkID8gdGhpcy5jb25maWcud2VpZ2h0RmllbGQubmFtZSA6ICdwcm9wZXJ0eS5kZW5zaXR5J1xuICAgICAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzID0ge30pIHtcbiAgICAvLyBtYXBib3ggaGVhdG1hcCBsYXllciBjb2xvciBpcyBhbHdheXMgYmFzZWQgb24gZGVuc2l0eVxuICAgIC8vIG5vIG5lZWQgdG8gc2V0IGNvbG9yRmllbGQsIGNvbG9yRG9tYWluIGFuZCBjb2xvclNjYWxlXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7Y29sb3JGaWVsZCwgY29sb3JEb21haW4sIGNvbG9yU2NhbGUsIC4uLmxheWVyQ29uZmlnfSA9IHtcbiAgICAgIC4uLnN1cGVyLmdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyksXG5cbiAgICAgIHdlaWdodEZpZWxkOiBudWxsLFxuICAgICAgd2VpZ2h0RG9tYWluOiBbMCwgMV0sXG4gICAgICB3ZWlnaHRTY2FsZTogJ2xpbmVhcidcbiAgICB9O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICAgIHJldHVybiBsYXllckNvbmZpZztcbiAgfVxuXG4gIGdldFBvc2l0aW9uQWNjZXNzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UG9zaXRpb24odGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZCA9PiBnZXRQb3NpdGlvbihkKSk7XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIGNvbHVtbnNTZWxlY3RvciA9IGNvbmZpZyA9PiBwb2ludENvbFJlc29sdmVyKGNvbmZpZy5jb2x1bW5zKTtcbiAgdmlzQ29uZmlnU2VsZWN0b3IgPSBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZztcbiAgd2VpZ2h0RmllbGRTZWxlY3RvciA9IGNvbmZpZyA9PiAoY29uZmlnLndlaWdodEZpZWxkID8gY29uZmlnLndlaWdodEZpZWxkLm5hbWUgOiBudWxsKTtcbiAgd2VpZ2h0RG9tYWluU2VsZWN0b3IgPSBjb25maWcgPT4gY29uZmlnLndlaWdodERvbWFpbjtcblxuICBwYWludFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy52aXNDb25maWdTZWxlY3RvcixcbiAgICB0aGlzLndlaWdodEZpZWxkU2VsZWN0b3IsXG4gICAgdGhpcy53ZWlnaHREb21haW5TZWxlY3RvcixcbiAgICAodmlzQ29uZmlnLCB3ZWlnaHRGaWVsZCwgd2VpZ2h0RG9tYWluKSA9PiAoe1xuICAgICAgJ2hlYXRtYXAtd2VpZ2h0Jzogd2VpZ2h0RmllbGRcbiAgICAgICAgPyBbJ2ludGVycG9sYXRlJywgWydsaW5lYXInXSwgWydnZXQnLCB3ZWlnaHRGaWVsZF0sIHdlaWdodERvbWFpblswXSwgMCwgd2VpZ2h0RG9tYWluWzFdLCAxXVxuICAgICAgICA6IDEsXG4gICAgICAnaGVhdG1hcC1pbnRlbnNpdHknOiBbJ2ludGVycG9sYXRlJywgWydsaW5lYXInXSwgWyd6b29tJ10sIDAsIDEsIE1BWF9aT09NX0xFVkVMLCAzXSxcbiAgICAgICdoZWF0bWFwLWNvbG9yJzogW1xuICAgICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgICBbJ2xpbmVhciddLFxuICAgICAgICBbJ2hlYXRtYXAtZGVuc2l0eSddLFxuICAgICAgICAuLi5oZWF0bWFwRGVuc2l0eSh2aXNDb25maWcuY29sb3JSYW5nZSlcbiAgICAgIF0sXG4gICAgICAnaGVhdG1hcC1yYWRpdXMnOiBbXG4gICAgICAgICdpbnRlcnBvbGF0ZScsXG4gICAgICAgIFsnbGluZWFyJ10sXG4gICAgICAgIFsnem9vbSddLFxuICAgICAgICAwLFxuICAgICAgICAyLFxuICAgICAgICBNQVhfWk9PTV9MRVZFTCxcbiAgICAgICAgdmlzQ29uZmlnLnJhZGl1cyAvLyByYWRpdXNcbiAgICAgIF0sXG4gICAgICAnaGVhdG1hcC1vcGFjaXR5JzogdmlzQ29uZmlnLm9wYWNpdHlcbiAgICB9KVxuICApO1xuXG4gIGNvbXB1dGVIZWF0bWFwQ29uZmlndXJhdGlvbiA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuc291cmNlU2VsZWN0b3IsXG4gICAgdGhpcy5maWx0ZXJTZWxlY3RvcixcbiAgICB0aGlzLnBhaW50U2VsZWN0b3IsXG4gICAgKHNvdXJjZSwgZmlsdGVyLCBwYWludCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2hlYXRtYXAnLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZSdcbiAgICAgICAgfSxcbiAgICAgICAgbWF4em9vbTogTUFYX1pPT01fTEVWRUwsXG4gICAgICAgIHBhaW50LFxuICAgICAgICAuLi4odGhpcy5pc1ZhbGlkRmlsdGVyKGZpbHRlcikgPyB7ZmlsdGVyfSA6IHt9KVxuICAgICAgfTtcbiAgICB9XG4gICk7XG5cbiAgZ2V0R2VvbWV0cnkocG9zaXRpb24pIHtcbiAgICByZXR1cm4gcG9zaXRpb24uZXZlcnkoTnVtYmVyLmlzRmluaXRlKVxuICAgICAgPyB7XG4gICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICBjb29yZGluYXRlczogcG9zaXRpb25cbiAgICAgICAgfVxuICAgICAgOiBudWxsO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpIHtcbiAgICBjb25zdCB7d2VpZ2h0RmllbGR9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3QgZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG5cbiAgICBjb25zdCBuZXdDb25maWcgPSB0aGlzLmNvbXB1dGVIZWF0bWFwQ29uZmlndXJhdGlvbih0aGlzLmNvbmZpZywgZGF0YXNldHMpO1xuICAgIG5ld0NvbmZpZy5pZCA9IHRoaXMuaWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uczogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIGNvbmZpZzogbmV3Q29uZmlnLFxuICAgICAgZGF0YSxcbiAgICAgIHdlaWdodEZpZWxkLFxuICAgICAgZ2V0UG9zaXRpb25cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlYXRtYXBMYXllcjtcbiJdfQ==