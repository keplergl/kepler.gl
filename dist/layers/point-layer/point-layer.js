"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointVisConfigs = exports.pointOptionalColumns = exports.pointRequiredColumns = exports.pointPosAccessor = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _extensions = require("@deck.gl/extensions");

var _layers = require("@deck.gl/layers");

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _colorUtils = require("../../utils/color-utils");

var _pointLayerIcon = _interopRequireDefault(require("./point-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _layerTextLabel = require("../layer-text-label");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng,
      altitude = _ref.altitude;
  return function (d) {
    return [// lng
    d.data[lng.fieldIdx], // lat
    d.data[lat.fieldIdx], altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0];
  };
};

exports.pointPosAccessor = pointPosAccessor;
var pointRequiredColumns = ['lat', 'lng'];
exports.pointRequiredColumns = pointRequiredColumns;
var pointOptionalColumns = ['altitude'];
exports.pointOptionalColumns = pointOptionalColumns;
var brushingExtension = new _extensions.BrushingExtension();
var pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radiusRange: 'radiusRange',
  filled: {
    type: 'boolean',
    label: 'layer.fillColor',
    defaultValue: true,
    property: 'filled'
  }
};
exports.pointVisConfigs = pointVisConfigs;

var PointLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(PointLayer, _Layer);

  function PointLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, PointLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PointLayer).call(this, props));

    _this.registerVisConfig(pointVisConfigs);

    _this.getPositionAccessor = function () {
      return pointPosAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(PointLayer, [{
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
        // add stroke color visual channel
        strokeColorField: null,
        strokeColorDomain: [0, 1],
        strokeColorScale: 'quantile'
      });
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getPosition) {
      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var pos = getPosition({
          data: allData[index]
        }); // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null

        if (pos.every(Number.isFinite)) {
          data.push({
            data: allData[index],
            position: pos,
            // index is important for filter
            index: index
          });
        }
      }

      return data;
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _this2 = this;

      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorDomain = _this$config.colorDomain,
          colorField = _this$config.colorField,
          strokeColorField = _this$config.strokeColorField,
          strokeColorScale = _this$config.strokeColorScale,
          strokeColorDomain = _this$config.strokeColorDomain,
          color = _this$config.color,
          sizeField = _this$config.sizeField,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          textLabel = _this$config.textLabel,
          _this$config$visConfi = _this$config.visConfig,
          radiusRange = _this$config$visConfi.radiusRange,
          fixedRadius = _this$config$visConfi.fixedRadius,
          colorRange = _this$config$visConfi.colorRange,
          strokeColorRange = _this$config$visConfi.strokeColorRange,
          strokeColor = _this$config$visConfi.strokeColor;
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data,
          triggerChanged = _this$updateData.triggerChanged;

      var getPosition = this.getPositionAccessor(); // point color

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // stroke color

      var scScale = strokeColorField && this.getVisChannelScale(strokeColorScale, strokeColorDomain, strokeColorRange.colors.map(_colorUtils.hexToRgb)); // point radius

      var rScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, fixedRadius);
      var getRadius = rScale ? function (d) {
        return _this2.getEncodedChannelValue(rScale, d.data, sizeField, 0);
      } : 1;
      var getFillColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;
      var getLineColor = scScale ? function (d) {
        return _this2.getEncodedChannelValue(scScale, d.data, strokeColorField);
      } : strokeColor || color; // get all distinct characters in the text labels

      var textLabels = (0, _layerTextLabel.formatTextLabelData)({
        textLabel: textLabel,
        triggerChanged: triggerChanged,
        oldLayerData: oldLayerData,
        data: data
      });
      return {
        data: data,
        getPosition: getPosition,
        getFillColor: getFillColor,
        getLineColor: getLineColor,
        getFilterValue: gpuFilter.filterValueAccessor(),
        getRadius: getRadius,
        textLabels: textLabels
      };
    }
    /* eslint-enable complexity */

  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData) {
      var getPosition = this.getPositionAccessor();
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
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState,
          interactionConfig = opts.interactionConfig;
      var radiusScale = this.getRadiusScaleByZoom(mapState);

      var layerProps = _objectSpread({
        stroked: this.config.visConfig.outline,
        filled: this.config.visConfig.filled,
        lineWidthScale: this.config.visConfig.thickness,
        radiusScale: radiusScale
      }, this.config.visConfig.fixedRadius ? {} : {
        radiusMaxPixels: 500
      });

      var updateTriggers = {
        getPosition: this.config.columns,
        getRadius: {
          sizeField: this.config.sizeField,
          radiusRange: this.config.visConfig.radiusRange,
          fixedRadius: this.config.visConfig.fixedRadius,
          sizeScale: this.config.sizeScale
        },
        getFillColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: this.config.visConfig.colorRange,
          colorScale: this.config.colorScale
        },
        getLineColor: {
          color: this.config.visConfig.strokeColor,
          colorField: this.config.strokeColorField,
          colorRange: this.config.visConfig.strokeColorRange,
          colorScale: this.config.strokeColorScale
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var brushingProps = this.getBrushingExtensionProps(interactionConfig);
      var getPixelOffset = (0, _layerTextLabel.getTextOffsetByRadius)(radiusScale, data.getRadius, mapState);
      var extensions = [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [brushingExtension]);

      var sharedProps = _objectSpread({
        getFilterValue: data.getFilterValue,
        extensions: extensions,
        filterRange: defaultLayerProps.filterRange
      }, brushingProps);

      return [new _layers.ScatterplotLayer(_objectSpread({}, defaultLayerProps, {}, brushingProps, {}, layerProps, {}, data, {
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: this.config.columns.altitude.fieldIdx > -1
        },
        lineWidthUnits: 'pixels',
        updateTriggers: updateTriggers,
        extensions: extensions
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) ? [new _layers.ScatterplotLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {}, layerProps, {
        data: [objectHovered.object],
        getLineColor: this.config.highlightColor,
        getFillColor: this.config.highlightColor,
        getRadius: data.getRadius,
        getPosition: data.getPosition
      }))] : []), (0, _toConsumableArray2["default"])(this.renderTextLabelLayer({
        getPosition: data.getPosition,
        sharedProps: sharedProps,
        getPixelOffset: getPixelOffset,
        updateTriggers: updateTriggers
      }, opts)));
    }
  }, {
    key: "type",
    get: function get() {
      return 'point';
    }
  }, {
    key: "isAggregated",
    get: function get() {
      return false;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _pointLayerIcon["default"];
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return pointRequiredColumns;
    }
  }, {
    key: "optionalColumns",
    get: function get() {
      return pointOptionalColumns;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: "noneLayerDataAffectingProps",
    get: function get() {
      return [].concat((0, _toConsumableArray2["default"])((0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "noneLayerDataAffectingProps", this)), ['radius']);
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        color: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "visualChannels", this).color, {
          condition: function condition(config) {
            return config.visConfig.filled;
          }
        }),
        strokeColor: {
          property: 'strokeColor',
          field: 'strokeColorField',
          scale: 'strokeColorScale',
          domain: 'strokeColorDomain',
          range: 'strokeColorRange',
          key: 'strokeColor',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color,
          condition: function condition(config) {
            return config.visConfig.outline;
          }
        },
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "visualChannels", this).size, {
          range: 'radiusRange',
          property: 'radius',
          channelScaleType: 'radius'
        })
      };
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fieldPairs = _ref3.fieldPairs,
          fieldPairs = _ref3$fieldPairs === void 0 ? [] : _ref3$fieldPairs;
      var props = []; // Make layer for each pair

      fieldPairs.forEach(function (pair) {
        // find fields for tableFieldIndex
        var latField = pair.pair.lat;
        var lngField = pair.pair.lng;
        var layerName = pair.defaultName;
        var prop = {
          label: layerName.length ? layerName : 'Point'
        }; // default layer color for begintrip and dropoff point

        if (latField.value in _defaultSettings.DEFAULT_LAYER_COLOR) {
          prop.color = (0, _colorUtils.hexToRgb)(_defaultSettings.DEFAULT_LAYER_COLOR[latField.value]);
        } // set the first layer to be visible


        if (props.length === 0) {
          prop.isVisible = true;
        }

        prop.columns = {
          lat: latField,
          lng: lngField,
          altitude: {
            value: null,
            fieldIdx: -1,
            optional: true
          }
        };
        props.push(prop);
      });
      return {
        props: props
      };
    }
  }]);
  return PointLayer;
}(_baseLayer["default"]);

exports["default"] = PointLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UmVxdWlyZWRDb2x1bW5zIiwicG9pbnRPcHRpb25hbENvbHVtbnMiLCJicnVzaGluZ0V4dGVuc2lvbiIsIkJydXNoaW5nRXh0ZW5zaW9uIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsInN0cm9rZUNvbG9yIiwiY29sb3JSYW5nZSIsInN0cm9rZUNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsImZpbGxlZCIsInR5cGUiLCJsYWJlbCIsImRlZmF1bHRWYWx1ZSIsInByb3BlcnR5IiwiUG9pbnRMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsInN0cm9rZUNvbG9yRmllbGQiLCJzdHJva2VDb2xvckRvbWFpbiIsInN0cm9rZUNvbG9yU2NhbGUiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiaSIsImxlbmd0aCIsImluZGV4IiwicG9zIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInB1c2giLCJwb3NpdGlvbiIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInRleHRMYWJlbCIsInZpc0NvbmZpZyIsImdwdUZpbHRlciIsImRhdGFJZCIsInVwZGF0ZURhdGEiLCJ0cmlnZ2VyQ2hhbmdlZCIsImNTY2FsZSIsImdldFZpc0NoYW5uZWxTY2FsZSIsImNvbG9ycyIsIm1hcCIsImhleFRvUmdiIiwic2NTY2FsZSIsInJTY2FsZSIsImdldFJhZGl1cyIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRGaWxsQ29sb3IiLCJnZXRMaW5lQ29sb3IiLCJ0ZXh0TGFiZWxzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsInJhZGl1c1NjYWxlIiwiZ2V0UmFkaXVzU2NhbGVCeVpvb20iLCJsYXllclByb3BzIiwic3Ryb2tlZCIsImxpbmVXaWR0aFNjYWxlIiwicmFkaXVzTWF4UGl4ZWxzIiwidXBkYXRlVHJpZ2dlcnMiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZGVmYXVsdExheWVyUHJvcHMiLCJnZXREZWZhdWx0RGVja0xheWVyUHJvcHMiLCJicnVzaGluZ1Byb3BzIiwiZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyIsImdldFBpeGVsT2Zmc2V0IiwiZXh0ZW5zaW9ucyIsInNoYXJlZFByb3BzIiwiZmlsdGVyUmFuZ2UiLCJTY2F0dGVycGxvdExheWVyIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImxpbmVXaWR0aFVuaXRzIiwiaXNMYXllckhvdmVyZWQiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwib2JqZWN0IiwiaGlnaGxpZ2h0Q29sb3IiLCJyZW5kZXJUZXh0TGFiZWxMYXllciIsIlBvaW50TGF5ZXJJY29uIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJjb25kaXRpb24iLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIiwiQ0hBTk5FTF9TQ0FMRVMiLCJzaXplIiwiZmllbGRQYWlycyIsImZvckVhY2giLCJwYWlyIiwibGF0RmllbGQiLCJsbmdGaWVsZCIsImxheWVyTmFtZSIsImRlZmF1bHROYW1lIiwicHJvcCIsInZhbHVlIiwiREVGQVVMVF9MQVlFUl9DT0xPUiIsImlzVmlzaWJsZSIsIm9wdGlvbmFsIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLElBQU1BLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUM3RDtBQUNBQSxJQUFBQSxDQUFDLENBQUNDLElBQUYsQ0FBT0gsR0FBRyxDQUFDSSxRQUFYLENBRjZELEVBRzdEO0FBQ0FGLElBQUFBLENBQUMsQ0FBQ0MsSUFBRixDQUFPSixHQUFHLENBQUNLLFFBQVgsQ0FKNkQsRUFLN0RILFFBQVEsSUFBSUEsUUFBUSxDQUFDRyxRQUFULEdBQW9CLENBQUMsQ0FBakMsR0FBcUNGLENBQUMsQ0FBQ0MsSUFBRixDQUFPRixRQUFRLENBQUNHLFFBQWhCLENBQXJDLEdBQWlFLENBTEosQ0FBSjtBQUFBLEdBQTNCO0FBQUEsQ0FBekI7OztBQVFBLElBQU1DLG9CQUFvQixHQUFHLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBN0I7O0FBQ0EsSUFBTUMsb0JBQW9CLEdBQUcsQ0FBQyxVQUFELENBQTdCOztBQUVQLElBQU1DLGlCQUFpQixHQUFHLElBQUlDLDZCQUFKLEVBQTFCO0FBRU8sSUFBTUMsZUFBZSxHQUFHO0FBQzdCQyxFQUFBQSxNQUFNLEVBQUUsUUFEcUI7QUFFN0JDLEVBQUFBLFdBQVcsRUFBRSxhQUZnQjtBQUc3QkMsRUFBQUEsT0FBTyxFQUFFLFNBSG9CO0FBSTdCQyxFQUFBQSxPQUFPLEVBQUUsU0FKb0I7QUFLN0JDLEVBQUFBLFNBQVMsRUFBRSxXQUxrQjtBQU03QkMsRUFBQUEsV0FBVyxFQUFFLGFBTmdCO0FB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cUN3RyxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7QnJ1c2hpbmdFeHRlbnNpb259IGZyb20gJ0BkZWNrLmdsL2V4dGVuc2lvbnMnO1xuaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQgUG9pbnRMYXllckljb24gZnJvbSAnLi9wb2ludC1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUiwgQ0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtnZXRUZXh0T2Zmc2V0QnlSYWRpdXMsIGZvcm1hdFRleHRMYWJlbERhdGF9IGZyb20gJy4uL2xheWVyLXRleHQtbGFiZWwnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIC8vIGxuZ1xuICBkLmRhdGFbbG5nLmZpZWxkSWR4XSxcbiAgLy8gbGF0XG4gIGQuZGF0YVtsYXQuZmllbGRJZHhdLFxuICBhbHRpdHVkZSAmJiBhbHRpdHVkZS5maWVsZElkeCA+IC0xID8gZC5kYXRhW2FsdGl0dWRlLmZpZWxkSWR4XSA6IDBcbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludFJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZyddO1xuZXhwb3J0IGNvbnN0IHBvaW50T3B0aW9uYWxDb2x1bW5zID0gWydhbHRpdHVkZSddO1xuXG5jb25zdCBicnVzaGluZ0V4dGVuc2lvbiA9IG5ldyBCcnVzaGluZ0V4dGVuc2lvbigpO1xuXG5leHBvcnQgY29uc3QgcG9pbnRWaXNDb25maWdzID0ge1xuICByYWRpdXM6ICdyYWRpdXMnLFxuICBmaXhlZFJhZGl1czogJ2ZpeGVkUmFkaXVzJyxcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBvdXRsaW5lOiAnb3V0bGluZScsXG4gIHRoaWNrbmVzczogJ3RoaWNrbmVzcycsXG4gIHN0cm9rZUNvbG9yOiAnc3Ryb2tlQ29sb3InLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHN0cm9rZUNvbG9yUmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gIGZpbGxlZDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBsYWJlbDogJ2xheWVyLmZpbGxDb2xvcicsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHByb3BlcnR5OiAnZmlsbGVkJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcocG9pbnRWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBwb2ludFBvc0FjY2Vzc29yKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdwb2ludCc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFBvaW50TGF5ZXJJY29uO1xuICB9XG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gcG9pbnRSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBwb2ludE9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsICdyYWRpdXMnXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZmlsbGVkXG4gICAgICB9LFxuICAgICAgc3Ryb2tlQ29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2VDb2xvcicsXG4gICAgICAgIGZpZWxkOiAnc3Ryb2tlQ29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc3Ryb2tlQ29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3N0cm9rZUNvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnc3Ryb2tlQ29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvcixcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5vdXRsaW5lXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICByYW5nZTogJ3JhZGl1c1JhbmdlJyxcbiAgICAgICAgcHJvcGVydHk6ICdyYWRpdXMnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAncmFkaXVzJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW119KSB7XG4gICAgY29uc3QgcHJvcHMgPSBbXTtcblxuICAgIC8vIE1ha2UgbGF5ZXIgZm9yIGVhY2ggcGFpclxuICAgIGZpZWxkUGFpcnMuZm9yRWFjaChwYWlyID0+IHtcbiAgICAgIC8vIGZpbmQgZmllbGRzIGZvciB0YWJsZUZpZWxkSW5kZXhcbiAgICAgIGNvbnN0IGxhdEZpZWxkID0gcGFpci5wYWlyLmxhdDtcbiAgICAgIGNvbnN0IGxuZ0ZpZWxkID0gcGFpci5wYWlyLmxuZztcbiAgICAgIGNvbnN0IGxheWVyTmFtZSA9IHBhaXIuZGVmYXVsdE5hbWU7XG5cbiAgICAgIGNvbnN0IHByb3AgPSB7XG4gICAgICAgIGxhYmVsOiBsYXllck5hbWUubGVuZ3RoID8gbGF5ZXJOYW1lIDogJ1BvaW50J1xuICAgICAgfTtcblxuICAgICAgLy8gZGVmYXVsdCBsYXllciBjb2xvciBmb3IgYmVnaW50cmlwIGFuZCBkcm9wb2ZmIHBvaW50XG4gICAgICBpZiAobGF0RmllbGQudmFsdWUgaW4gREVGQVVMVF9MQVlFUl9DT0xPUikge1xuICAgICAgICBwcm9wLmNvbG9yID0gaGV4VG9SZ2IoREVGQVVMVF9MQVlFUl9DT0xPUltsYXRGaWVsZC52YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdGhlIGZpcnN0IGxheWVyIHRvIGJlIHZpc2libGVcbiAgICAgIGlmIChwcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHJvcC5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBwcm9wLmNvbHVtbnMgPSB7XG4gICAgICAgIGxhdDogbGF0RmllbGQsXG4gICAgICAgIGxuZzogbG5nRmllbGQsXG4gICAgICAgIGFsdGl0dWRlOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9O1xuXG4gICAgICBwcm9wcy5wdXNoKHByb3ApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtwcm9wc307XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICAvLyBhZGQgc3Ryb2tlIGNvbG9yIHZpc3VhbCBjaGFubmVsXG4gICAgICBzdHJva2VDb2xvckZpZWxkOiBudWxsLFxuICAgICAgc3Ryb2tlQ29sb3JEb21haW46IFswLCAxXSxcbiAgICAgIHN0cm9rZUNvbG9yU2NhbGU6ICdxdWFudGlsZSdcbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgLy8gaW5kZXggaXMgaW1wb3J0YW50IGZvciBmaWx0ZXJcbiAgICAgICAgICBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBzdHJva2VDb2xvckZpZWxkLFxuICAgICAgc3Ryb2tlQ29sb3JTY2FsZSxcbiAgICAgIHN0cm9rZUNvbG9yRG9tYWluLFxuICAgICAgY29sb3IsXG4gICAgICBzaXplRmllbGQsXG4gICAgICBzaXplU2NhbGUsXG4gICAgICBzaXplRG9tYWluLFxuICAgICAgdGV4dExhYmVsLFxuICAgICAgdmlzQ29uZmlnOiB7cmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzLCBjb2xvclJhbmdlLCBzdHJva2VDb2xvclJhbmdlLCBzdHJva2VDb2xvcn1cbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG4gICAgY29uc3Qge2RhdGEsIHRyaWdnZXJDaGFuZ2VkfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIC8vIHBvaW50IGNvbG9yXG5cbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoY29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYikpO1xuXG4gICAgLy8gc3Ryb2tlIGNvbG9yXG4gICAgY29uc3Qgc2NTY2FsZSA9XG4gICAgICBzdHJva2VDb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgc3Ryb2tlQ29sb3JTY2FsZSxcbiAgICAgICAgc3Ryb2tlQ29sb3JEb21haW4sXG4gICAgICAgIHN0cm9rZUNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICAgICk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgcmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzKTtcblxuICAgIGNvbnN0IGdldFJhZGl1cyA9IHJTY2FsZSA/IGQgPT4gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHJTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApIDogMTtcblxuICAgIGNvbnN0IGdldEZpbGxDb2xvciA9IGNTY2FsZVxuICAgICAgPyBkID0+IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGQuZGF0YSwgY29sb3JGaWVsZClcbiAgICAgIDogY29sb3I7XG5cbiAgICBjb25zdCBnZXRMaW5lQ29sb3IgPSBzY1NjYWxlXG4gICAgICA/IGQgPT4gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNjU2NhbGUsIGQuZGF0YSwgc3Ryb2tlQ29sb3JGaWVsZClcbiAgICAgIDogc3Ryb2tlQ29sb3IgfHwgY29sb3I7XG5cbiAgICAvLyBnZXQgYWxsIGRpc3RpbmN0IGNoYXJhY3RlcnMgaW4gdGhlIHRleHQgbGFiZWxzXG4gICAgY29uc3QgdGV4dExhYmVscyA9IGZvcm1hdFRleHRMYWJlbERhdGEoe1xuICAgICAgdGV4dExhYmVsLFxuICAgICAgdHJpZ2dlckNoYW5nZWQsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICBkYXRhXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldFBvc2l0aW9uLFxuICAgICAgZ2V0RmlsbENvbG9yLFxuICAgICAgZ2V0TGluZUNvbG9yLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKCksXG4gICAgICBnZXRSYWRpdXMsXG4gICAgICB0ZXh0TGFiZWxzXG4gICAgfTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZCA9PiBnZXRQb3NpdGlvbih7ZGF0YTogZH0pKTtcbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30gPSBvcHRzO1xuXG4gICAgY29uc3QgcmFkaXVzU2NhbGUgPSB0aGlzLmdldFJhZGl1c1NjYWxlQnlab29tKG1hcFN0YXRlKTtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBzdHJva2VkOiB0aGlzLmNvbmZpZy52aXNDb25maWcub3V0bGluZSxcbiAgICAgIGZpbGxlZDogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpbGxlZCxcbiAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzLFxuICAgICAgcmFkaXVzU2NhbGUsXG4gICAgICAuLi4odGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzID8ge30gOiB7cmFkaXVzTWF4UGl4ZWxzOiA1MDB9KVxuICAgIH07XG5cbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGdldFBvc2l0aW9uOiB0aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgZ2V0UmFkaXVzOiB7XG4gICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnJhZGl1c1JhbmdlLFxuICAgICAgICBmaXhlZFJhZGl1czogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzLFxuICAgICAgICBzaXplU2NhbGU6IHRoaXMuY29uZmlnLnNpemVTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldEZpbGxDb2xvcjoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0TGluZUNvbG9yOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc3Ryb2tlQ29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLnN0cm9rZUNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VDb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5zdHJva2VDb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzXG4gICAgfTtcblxuICAgIGNvbnN0IGRlZmF1bHRMYXllclByb3BzID0gdGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyk7XG4gICAgY29uc3QgYnJ1c2hpbmdQcm9wcyA9IHRoaXMuZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyhpbnRlcmFjdGlvbkNvbmZpZyk7XG4gICAgY29uc3QgZ2V0UGl4ZWxPZmZzZXQgPSBnZXRUZXh0T2Zmc2V0QnlSYWRpdXMocmFkaXVzU2NhbGUsIGRhdGEuZ2V0UmFkaXVzLCBtYXBTdGF0ZSk7XG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFsuLi5kZWZhdWx0TGF5ZXJQcm9wcy5leHRlbnNpb25zLCBicnVzaGluZ0V4dGVuc2lvbl07XG5cbiAgICBjb25zdCBzaGFyZWRQcm9wcyA9IHtcbiAgICAgIGdldEZpbHRlclZhbHVlOiBkYXRhLmdldEZpbHRlclZhbHVlLFxuICAgICAgZXh0ZW5zaW9ucyxcbiAgICAgIGZpbHRlclJhbmdlOiBkZWZhdWx0TGF5ZXJQcm9wcy5maWx0ZXJSYW5nZSxcbiAgICAgIC4uLmJydXNoaW5nUHJvcHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgIC4uLmJydXNoaW5nUHJvcHMsXG4gICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAvLyBjaXJjbGVzIHdpbGwgYmUgZmxhdCBvbiB0aGUgbWFwIHdoZW4gdGhlIGFsdGl0dWRlIGNvbHVtbiBpcyBub3QgdXNlZFxuICAgICAgICAgIGRlcHRoVGVzdDogdGhpcy5jb25maWcuY29sdW1ucy5hbHRpdHVkZS5maWVsZElkeCA+IC0xXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaWR0aFVuaXRzOiAncGl4ZWxzJyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgIGV4dGVuc2lvbnNcbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgICAgICAgZGF0YTogW29iamVjdEhvdmVyZWQub2JqZWN0XSxcbiAgICAgICAgICAgICAgZ2V0TGluZUNvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0UmFkaXVzOiBkYXRhLmdldFJhZGl1cyxcbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb25cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKSxcbiAgICAgIC8vIHRleHQgbGFiZWwgbGF5ZXJcbiAgICAgIC4uLnRoaXMucmVuZGVyVGV4dExhYmVsTGF5ZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBnZXRQb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbixcbiAgICAgICAgICBzaGFyZWRQcm9wcyxcbiAgICAgICAgICBnZXRQaXhlbE9mZnNldCxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgICB9LFxuICAgICAgICBvcHRzXG4gICAgICApXG4gICAgXTtcbiAgfVxufVxuIl19