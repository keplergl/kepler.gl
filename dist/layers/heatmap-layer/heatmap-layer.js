"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.heatmapVisConfigs = exports.pointColResolver = exports.pointPosAccessor = exports.MAX_ZOOM_LEVEL = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var HeatmapLayer =
/*#__PURE__*/
function (_MapboxGLLayer) {
  (0, _inherits2["default"])(HeatmapLayer, _MapboxGLLayer);

  function HeatmapLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, HeatmapLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(HeatmapLayer).call(this, props));
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
      var _get$call$weightField = _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HeatmapLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
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
  }, {
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
  }]);
  return HeatmapLayer;
}(_mapboxglLayer["default"]);

var _default = HeatmapLayer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGVhdG1hcC1sYXllci9oZWF0bWFwLWxheWVyLmpzIl0sIm5hbWVzIjpbIk1BWF9aT09NX0xFVkVMIiwicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJmaWVsZElkeCIsInBvaW50Q29sUmVzb2x2ZXIiLCJoZWF0bWFwVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwicmFkaXVzIiwiaGVhdG1hcERlbnNpdHkiLCJzY2FsZUZ1bmN0aW9uIiwiU0NBTEVfRlVOQyIsInF1YW50aXplIiwiY29sb3JzIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImNvbG9yRGVuc2l0eSIsInJlZHVjZSIsImJhbmRzIiwibGV2ZWwiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJqb2luIiwiSGVhdG1hcExheWVyIiwicHJvcHMiLCJjb25maWciLCJjb2x1bW5zIiwidmlzQ29uZmlnIiwid2VpZ2h0RmllbGQiLCJuYW1lIiwid2VpZ2h0RG9tYWluIiwidmlzQ29uZmlnU2VsZWN0b3IiLCJ3ZWlnaHRGaWVsZFNlbGVjdG9yIiwid2VpZ2h0RG9tYWluU2VsZWN0b3IiLCJzb3VyY2VTZWxlY3RvciIsImZpbHRlclNlbGVjdG9yIiwicGFpbnRTZWxlY3RvciIsInNvdXJjZSIsImZpbHRlciIsInBhaW50IiwidHlwZSIsImlkIiwibGF5b3V0IiwidmlzaWJpbGl0eSIsIm1heHpvb20iLCJpc1ZhbGlkRmlsdGVyIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsImNoYW5uZWwiLCJsYWJlbCIsIm1lYXN1cmUiLCJ3ZWlnaHRTY2FsZSIsImNvbG9yRmllbGQiLCJjb2xvckRvbWFpbiIsImNvbG9yU2NhbGUiLCJsYXllckNvbmZpZyIsImFsbERhdGEiLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsInBvc2l0aW9uIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImNvb3JkaW5hdGVzIiwiZGF0YXNldHMiLCJvbGRMYXllckRhdGEiLCJ1cGRhdGVEYXRhIiwiZGF0YSIsIm5ld0NvbmZpZyIsImNvbXB1dGVIZWF0bWFwQ29uZmlndXJhdGlvbiIsIndlaWdodCIsInByb3BlcnR5IiwiZmllbGQiLCJrZXkiLCJkZWZhdWx0TWVhc3VyZSIsInN1cHBvcnRlZEZpZWxkVHlwZXMiLCJBTExfRklFTERfVFlQRVMiLCJyZWFsIiwiaW50ZWdlciIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsInNpemUiLCJIZWF0bWFwTGF5ZXJJY29uIiwiTWFwYm94R0xMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLElBQU1BLGNBQWMsR0FBRyxFQUF2Qjs7O0FBRUEsSUFBTUMsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVDLEdBQUYsUUFBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsUUFBT0EsR0FBUDtBQUFBLFNBQWdCLFVBQUFDLENBQUM7QUFBQSxXQUFJLENBQ25EO0FBQ0FBLElBQUFBLENBQUMsQ0FBQ0QsR0FBRyxDQUFDRSxRQUFMLENBRmtELEVBR25EO0FBQ0FELElBQUFBLENBQUMsQ0FBQ0YsR0FBRyxDQUFDRyxRQUFMLENBSmtELENBQUo7QUFBQSxHQUFqQjtBQUFBLENBQXpCOzs7O0FBT0EsSUFBTUMsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVKLEdBQUYsU0FBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsU0FBT0EsR0FBUDtBQUFBLG1CQUFtQkQsR0FBRyxDQUFDRyxRQUF2QixjQUFtQ0YsR0FBRyxDQUFDRSxRQUF2QztBQUFBLENBQXpCOzs7QUFFQSxJQUFNRSxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsT0FBTyxFQUFFLFNBRHNCO0FBRS9CQyxFQUFBQSxVQUFVLEVB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LFNBQVMsQ0FBQzdCLEVBQVYsR0FBZSxLQUFLQSxFQUFwQjtBQUVBLGFBQU87QUFDTGYsUUFBQUEsT0FBTyxFQUFFLEtBQUtELE1BQUwsQ0FBWUMsT0FEaEI7QUFFTEQsUUFBQUEsTUFBTSxFQUFFNkMsU0FGSDtBQUdMRCxRQUFBQSxJQUFJLEVBQUpBLElBSEs7QUFJTHpDLFFBQUFBLFdBQVcsRUFBWEEsV0FKSztBQUtMbUIsUUFBQUEsV0FBVyxFQUFYQTtBQUxLLE9BQVA7QUFPRDs7O3dCQTNJVTtBQUNULGFBQU8sU0FBUDtBQUNEOzs7d0JBRW9CO0FBQ25CLGFBQU87QUFDTHlCLFFBQUFBLE1BQU0sRUFBRTtBQUNOQyxVQUFBQSxRQUFRLEVBQUUsUUFESjtBQUVOQyxVQUFBQSxLQUFLLEVBQUUsYUFGRDtBQUdON0QsVUFBQUEsS0FBSyxFQUFFLGFBSEQ7QUFJTkMsVUFBQUEsTUFBTSxFQUFFLGNBSkY7QUFLTjZELFVBQUFBLEdBQUcsRUFBRSxRQUxDO0FBTU47QUFDQTtBQUNBQyxVQUFBQSxjQUFjLEVBQUUsa0JBUlY7QUFTTkMsVUFBQUEsbUJBQW1CLEVBQUUsQ0FBQ0MsaUNBQWdCQyxJQUFqQixFQUF1QkQsaUNBQWdCRSxPQUF2QyxDQVRmO0FBVU5DLFVBQUFBLGdCQUFnQixFQUFFQyxnQ0FBZUM7QUFWM0I7QUFESCxPQUFQO0FBY0Q7Ozt3QkFFZTtBQUNkLGFBQU9DLDRCQUFQO0FBQ0Q7OztFQTlCd0JDLHlCOztlQXFKWjlELFkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5pbXBvcnQge0NIQU5ORUxfU0NBTEVTLCBTQ0FMRV9GVU5DLCBBTExfRklFTERfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCBNYXBib3hHTExheWVyIGZyb20gJy4uL21hcGJveGdsLWxheWVyJztcbmltcG9ydCBIZWF0bWFwTGF5ZXJJY29uIGZyb20gJy4vaGVhdG1hcC1sYXllci1pY29uJztcblxuZXhwb3J0IGNvbnN0IE1BWF9aT09NX0xFVkVMID0gMTg7XG5cbmV4cG9ydCBjb25zdCBwb2ludFBvc0FjY2Vzc29yID0gKHtsYXQsIGxuZ30pID0+IGQgPT4gW1xuICAvLyBsbmdcbiAgZFtsbmcuZmllbGRJZHhdLFxuICAvLyBsYXRcbiAgZFtsYXQuZmllbGRJZHhdXG5dO1xuXG5leHBvcnQgY29uc3QgcG9pbnRDb2xSZXNvbHZlciA9ICh7bGF0LCBsbmd9KSA9PiBgJHtsYXQuZmllbGRJZHh9LSR7bG5nLmZpZWxkSWR4fWA7XG5cbmV4cG9ydCBjb25zdCBoZWF0bWFwVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1czogJ2hlYXRtYXBSYWRpdXMnXG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29sb3JSYW5nZVxuICogQHJldHVybiB7QXJyYXl9IFtcbiAqICAwLCBcInJnYmEoMzMsMTAyLDE3MiwwKVwiLFxuICogIDAuMiwgXCJyZ2IoMTAzLDE2OSwyMDcpXCIsXG4gKiAgMC40LCBcInJnYigyMDksMjI5LDI0MClcIixcbiAqICAwLjYsIFwicmdiKDI1MywyMTksMTk5KVwiLFxuICogIDAuOCwgXCJyZ2IoMjM5LDEzOCw5OClcIixcbiAqICAxLCBcInJnYigxNzgsMjQsNDMpXCJcbiAqIF1cbiAqL1xuY29uc3QgaGVhdG1hcERlbnNpdHkgPSBjb2xvclJhbmdlID0+IHtcbiAgY29uc3Qgc2NhbGVGdW5jdGlvbiA9IFNDQUxFX0ZVTkMucXVhbnRpemU7XG5cbiAgY29uc3QgY29sb3JzID0gWycjMDAwMDAwJywgLi4uY29sb3JSYW5nZS5jb2xvcnNdO1xuXG4gIGNvbnN0IHNjYWxlID0gc2NhbGVGdW5jdGlvbigpXG4gICAgLmRvbWFpbihbMCwgMV0pXG4gICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgY29uc3QgY29sb3JEZW5zaXR5ID0gc2NhbGUucmFuZ2UoKS5yZWR1Y2UoKGJhbmRzLCBsZXZlbCkgPT4ge1xuICAgIGNvbnN0IGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChsZXZlbCk7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLmJhbmRzLFxuICAgICAgaW52ZXJ0WzBdLCAvLyBmaXJzdCB2YWx1ZSBpbiB0aGUgcmFuZ2VcbiAgICAgIGByZ2IoJHtoZXhUb1JnYihsZXZlbCkuam9pbignLCcpfSlgIC8vIGNvbG9yXG4gICAgXTtcbiAgfSwgW10pO1xuICBjb2xvckRlbnNpdHlbMV0gPSAncmdiYSgwLDAsMCwwKSc7XG4gIHJldHVybiBjb2xvckRlbnNpdHk7XG59O1xuXG5jbGFzcyBIZWF0bWFwTGF5ZXIgZXh0ZW5kcyBNYXBib3hHTExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhoZWF0bWFwVmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRQb3NpdGlvbiA9IG1lbW9pemUocG9pbnRQb3NBY2Nlc3NvciwgcG9pbnRDb2xSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2hlYXRtYXAnO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgcHJvcGVydHk6ICd3ZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ3dlaWdodEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICd3ZWlnaHRTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3dlaWdodERvbWFpbicsXG4gICAgICAgIGtleTogJ3dlaWdodCcsXG4gICAgICAgIC8vIHN1cHBvcnRlZEZpZWxkVHlwZXMgY2FuIGJlIGRldGVybWluZWQgYnkgY2hhbm5lbFNjYWxlVHlwZVxuICAgICAgICAvLyBvciBzcGVjaWZpZWQgaGVyZVxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ3Byb3BlcnR5LmRlbnNpdHknLFxuICAgICAgICBzdXBwb3J0ZWRGaWVsZFR5cGVzOiBbQUxMX0ZJRUxEX1RZUEVTLnJlYWwsIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXSxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBIZWF0bWFwTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0VmlzdWFsQ2hhbm5lbERlc2NyaXB0aW9uKGNoYW5uZWwpIHtcbiAgICByZXR1cm4gY2hhbm5lbCA9PT0gJ2NvbG9yJ1xuICAgICAgPyB7XG4gICAgICAgICAgbGFiZWw6ICdwcm9wZXJ0eS5jb2xvcicsXG4gICAgICAgICAgbWVhc3VyZTogJ3Byb3BlcnR5LmRlbnNpdHknXG4gICAgICAgIH1cbiAgICAgIDoge1xuICAgICAgICAgIGxhYmVsOiAncHJvcGVydHkud2VpZ2h0JyxcbiAgICAgICAgICBtZWFzdXJlOiB0aGlzLmNvbmZpZy53ZWlnaHRGaWVsZCA/IHRoaXMuY29uZmlnLndlaWdodEZpZWxkLm5hbWUgOiAncHJvcGVydHkuZGVuc2l0eSdcbiAgICAgICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyA9IHt9KSB7XG4gICAgLy8gbWFwYm94IGhlYXRtYXAgbGF5ZXIgY29sb3IgaXMgYWx3YXlzIGJhc2VkIG9uIGRlbnNpdHlcbiAgICAvLyBubyBuZWVkIHRvIHNldCBjb2xvckZpZWxkLCBjb2xvckRvbWFpbiBhbmQgY29sb3JTY2FsZVxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge2NvbG9yRmllbGQsIGNvbG9yRG9tYWluLCBjb2xvclNjYWxlLCAuLi5sYXllckNvbmZpZ30gPSB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICB3ZWlnaHRGaWVsZDogbnVsbCxcbiAgICAgIHdlaWdodERvbWFpbjogWzAsIDFdLFxuICAgICAgd2VpZ2h0U2NhbGU6ICdsaW5lYXInXG4gICAgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgICByZXR1cm4gbGF5ZXJDb25maWc7XG4gIH1cblxuICBnZXRQb3NpdGlvbkFjY2Vzc29yKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBvc2l0aW9uKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEpIHtcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4gZ2V0UG9zaXRpb24oZCkpO1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICBjb2x1bW5zU2VsZWN0b3IgPSBjb25maWcgPT4gcG9pbnRDb2xSZXNvbHZlcihjb25maWcuY29sdW1ucyk7XG4gIHZpc0NvbmZpZ1NlbGVjdG9yID0gY29uZmlnID0+IGNvbmZpZy52aXNDb25maWc7XG4gIHdlaWdodEZpZWxkU2VsZWN0b3IgPSBjb25maWcgPT4gKGNvbmZpZy53ZWlnaHRGaWVsZCA/IGNvbmZpZy53ZWlnaHRGaWVsZC5uYW1lIDogbnVsbCk7XG4gIHdlaWdodERvbWFpblNlbGVjdG9yID0gY29uZmlnID0+IGNvbmZpZy53ZWlnaHREb21haW47XG5cbiAgcGFpbnRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMudmlzQ29uZmlnU2VsZWN0b3IsXG4gICAgdGhpcy53ZWlnaHRGaWVsZFNlbGVjdG9yLFxuICAgIHRoaXMud2VpZ2h0RG9tYWluU2VsZWN0b3IsXG4gICAgKHZpc0NvbmZpZywgd2VpZ2h0RmllbGQsIHdlaWdodERvbWFpbikgPT4gKHtcbiAgICAgICdoZWF0bWFwLXdlaWdodCc6IHdlaWdodEZpZWxkXG4gICAgICAgID8gWydpbnRlcnBvbGF0ZScsIFsnbGluZWFyJ10sIFsnZ2V0Jywgd2VpZ2h0RmllbGRdLCB3ZWlnaHREb21haW5bMF0sIDAsIHdlaWdodERvbWFpblsxXSwgMV1cbiAgICAgICAgOiAxLFxuICAgICAgJ2hlYXRtYXAtaW50ZW5zaXR5JzogWydpbnRlcnBvbGF0ZScsIFsnbGluZWFyJ10sIFsnem9vbSddLCAwLCAxLCBNQVhfWk9PTV9MRVZFTCwgM10sXG4gICAgICAnaGVhdG1hcC1jb2xvcic6IFtcbiAgICAgICAgJ2ludGVycG9sYXRlJyxcbiAgICAgICAgWydsaW5lYXInXSxcbiAgICAgICAgWydoZWF0bWFwLWRlbnNpdHknXSxcbiAgICAgICAgLi4uaGVhdG1hcERlbnNpdHkodmlzQ29uZmlnLmNvbG9yUmFuZ2UpXG4gICAgICBdLFxuICAgICAgJ2hlYXRtYXAtcmFkaXVzJzogW1xuICAgICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgICBbJ2xpbmVhciddLFxuICAgICAgICBbJ3pvb20nXSxcbiAgICAgICAgMCxcbiAgICAgICAgMixcbiAgICAgICAgTUFYX1pPT01fTEVWRUwsXG4gICAgICAgIHZpc0NvbmZpZy5yYWRpdXMgLy8gcmFkaXVzXG4gICAgICBdLFxuICAgICAgJ2hlYXRtYXAtb3BhY2l0eSc6IHZpc0NvbmZpZy5vcGFjaXR5XG4gICAgfSlcbiAgKTtcblxuICBjb21wdXRlSGVhdG1hcENvbmZpZ3VyYXRpb24gPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLnNvdXJjZVNlbGVjdG9yLFxuICAgIHRoaXMuZmlsdGVyU2VsZWN0b3IsXG4gICAgdGhpcy5wYWludFNlbGVjdG9yLFxuICAgIChzb3VyY2UsIGZpbHRlciwgcGFpbnQpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdoZWF0bWFwJyxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgbGF5b3V0OiB7XG4gICAgICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnXG4gICAgICAgIH0sXG4gICAgICAgIG1heHpvb206IE1BWF9aT09NX0xFVkVMLFxuICAgICAgICBwYWludCxcbiAgICAgICAgLi4uKHRoaXMuaXNWYWxpZEZpbHRlcihmaWx0ZXIpID8ge2ZpbHRlcn0gOiB7fSlcbiAgICAgIH07XG4gICAgfVxuICApO1xuXG4gIGdldEdlb21ldHJ5KHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHBvc2l0aW9uLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSlcbiAgICAgID8ge1xuICAgICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHBvc2l0aW9uXG4gICAgICAgIH1cbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKSB7XG4gICAgY29uc3Qge3dlaWdodEZpZWxkfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy51cGRhdGVEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpO1xuXG4gICAgY29uc3QgbmV3Q29uZmlnID0gdGhpcy5jb21wdXRlSGVhdG1hcENvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIGRhdGFzZXRzKTtcbiAgICBuZXdDb25maWcuaWQgPSB0aGlzLmlkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBjb25maWc6IG5ld0NvbmZpZyxcbiAgICAgIGRhdGEsXG4gICAgICB3ZWlnaHRGaWVsZCxcbiAgICAgIGdldFBvc2l0aW9uXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWF0bWFwTGF5ZXI7XG4iXX0=