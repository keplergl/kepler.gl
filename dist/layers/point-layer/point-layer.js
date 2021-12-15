"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointVisConfigs = exports.pointOptionalColumns = exports.pointRequiredColumns = exports.pointPosAccessor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _extensions = require("@deck.gl/extensions");

var _layers = require("@deck.gl/layers");

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _colorUtils = require("../../utils/color-utils");

var _datasetUtils = require("../../utils/dataset-utils");

var _pointLayerIcon = _interopRequireDefault(require("./point-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _layerTextLabel = require("../layer-text-label");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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

var PointLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(PointLayer, _Layer);

  var _super = _createSuper(PointLayer);

  function PointLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, PointLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(pointVisConfigs);

    _this.getPositionAccessor = function () {
      return pointPosAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(PointLayer, [{
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
        color: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "visualChannels", this).color), {}, {
          accessor: 'getFillColor',
          condition: function condition(config) {
            return config.visConfig.filled;
          },
          defaultValue: function defaultValue(config) {
            return config.color;
          }
        }),
        strokeColor: {
          property: 'strokeColor',
          key: 'strokeColor',
          field: 'strokeColorField',
          scale: 'strokeColorScale',
          domain: 'strokeColorDomain',
          range: 'strokeColorRange',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color,
          accessor: 'getLineColor',
          condition: function condition(config) {
            return config.visConfig.outline;
          },
          defaultValue: function defaultValue(config) {
            return config.visConfig.strokeColor || config.color;
          }
        },
        size: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "visualChannels", this).size), {}, {
          property: 'radius',
          range: 'radiusRange',
          fixed: 'fixedRadius',
          channelScaleType: 'radius',
          accessor: 'getRadius',
          defaultValue: 1
        })
      };
    }
  }, {
    key: "setInitialLayerConfig",
    value: function setInitialLayerConfig(dataset) {
      var defaultColorField = (0, _datasetUtils.findDefaultColorField)(dataset);

      if (defaultColorField) {
        this.updateLayerConfig({
          colorField: defaultColorField
        });
        this.updateLayerVisualChannel(dataset, 'color');
      }

      return this;
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(PointLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
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
      var textLabel = this.config.textLabel;
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data,
          triggerChanged = _this$updateData.triggerChanged;

      var getPosition = this.getPositionAccessor(); // get all distinct characters in the text labels

      var textLabels = (0, _layerTextLabel.formatTextLabelData)({
        textLabel: textLabel,
        triggerChanged: triggerChanged,
        oldLayerData: oldLayerData,
        data: data
      });
      var accessors = this.getAttributeAccessors();
      return _objectSpread({
        data: data,
        getPosition: getPosition,
        getFilterValue: gpuFilter.filterValueAccessor(),
        textLabels: textLabels
      }, accessors);
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
      var _this$config$columns$;

      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState,
          interactionConfig = opts.interactionConfig; // if no field size is defined we need to pass fixed radius = false

      var fixedRadius = this.config.visConfig.fixedRadius && Boolean(this.config.sizeField);
      var radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);

      var layerProps = _objectSpread({
        stroked: this.config.visConfig.outline,
        filled: this.config.visConfig.filled,
        lineWidthScale: this.config.visConfig.thickness,
        radiusScale: radiusScale
      }, this.config.visConfig.fixedRadius ? {} : {
        radiusMaxPixels: 500
      });

      var updateTriggers = _objectSpread({
        getPosition: this.config.columns,
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      }, this.getVisualChannelUpdateTriggers());

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var brushingProps = this.getBrushingExtensionProps(interactionConfig);
      var getPixelOffset = (0, _layerTextLabel.getTextOffsetByRadius)(radiusScale, data.getRadius, mapState);
      var extensions = [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [brushingExtension]);

      var sharedProps = _objectSpread({
        getFilterValue: data.getFilterValue,
        extensions: extensions,
        filterRange: defaultLayerProps.filterRange
      }, brushingProps);

      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [new _layers.ScatterplotLayer(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), brushingProps), layerProps), data), {}, {
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: ((_this$config$columns$ = this.config.columns.altitude) === null || _this$config$columns$ === void 0 ? void 0 : _this$config$columns$.fieldIdx) > -1
        },
        lineWidthUnits: 'pixels',
        updateTriggers: updateTriggers,
        extensions: extensions
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject ? [new _layers.ScatterplotLayer(_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), layerProps), {}, {
        data: [hoveredObject],
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
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fieldPairs = _ref3.fieldPairs,
          fieldPairs = _ref3$fieldPairs === void 0 ? [] : _ref3$fieldPairs;
      var props = []; // Make layer for each pair

      fieldPairs.forEach(function (pair) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UmVxdWlyZWRDb2x1bW5zIiwicG9pbnRPcHRpb25hbENvbHVtbnMiLCJicnVzaGluZ0V4dGVuc2lvbiIsIkJydXNoaW5nRXh0ZW5zaW9uIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsInN0cm9rZUNvbG9yIiwiY29sb3JSYW5nZSIsInN0cm9rZUNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsImZpbGxlZCIsInR5cGUiLCJsYWJlbCIsImRlZmF1bHRWYWx1ZSIsInByb3BlcnR5IiwiUG9pbnRMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsIlBvaW50TGF5ZXJJY29uIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJjb2xvciIsImFjY2Vzc29yIiwiY29uZGl0aW9uIiwidmlzQ29uZmlnIiwia2V5IiwiZmllbGQiLCJzY2FsZSIsImRvbWFpbiIsInJhbmdlIiwiY2hhbm5lbFNjYWxlVHlwZSIsIkNIQU5ORUxfU0NBTEVTIiwic2l6ZSIsImZpeGVkIiwiZGF0YXNldCIsImRlZmF1bHRDb2xvckZpZWxkIiwidXBkYXRlTGF5ZXJDb25maWciLCJjb2xvckZpZWxkIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsIiwic3Ryb2tlQ29sb3JGaWVsZCIsInN0cm9rZUNvbG9yRG9tYWluIiwic3Ryb2tlQ29sb3JTY2FsZSIsImdldFBvc2l0aW9uIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJpIiwibGVuZ3RoIiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsInBvc2l0aW9uIiwiZGF0YXNldHMiLCJvbGRMYXllckRhdGEiLCJ0ZXh0TGFiZWwiLCJncHVGaWx0ZXIiLCJkYXRhSWQiLCJ1cGRhdGVEYXRhIiwidHJpZ2dlckNoYW5nZWQiLCJ0ZXh0TGFiZWxzIiwiYWNjZXNzb3JzIiwiZ2V0QXR0cmlidXRlQWNjZXNzb3JzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsIkJvb2xlYW4iLCJzaXplRmllbGQiLCJyYWRpdXNTY2FsZSIsImdldFJhZGl1c1NjYWxlQnlab29tIiwibGF5ZXJQcm9wcyIsInN0cm9rZWQiLCJsaW5lV2lkdGhTY2FsZSIsInJhZGl1c01heFBpeGVscyIsInVwZGF0ZVRyaWdnZXJzIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsImdldFZpc3VhbENoYW5uZWxVcGRhdGVUcmlnZ2VycyIsImRlZmF1bHRMYXllclByb3BzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwiYnJ1c2hpbmdQcm9wcyIsImdldEJydXNoaW5nRXh0ZW5zaW9uUHJvcHMiLCJnZXRQaXhlbE9mZnNldCIsImdldFJhZGl1cyIsImV4dGVuc2lvbnMiLCJzaGFyZWRQcm9wcyIsImZpbHRlclJhbmdlIiwiaG92ZXJlZE9iamVjdCIsImhhc0hvdmVyZWRPYmplY3QiLCJTY2F0dGVycGxvdExheWVyIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImxpbmVXaWR0aFVuaXRzIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsImdldExpbmVDb2xvciIsImhpZ2hsaWdodENvbG9yIiwiZ2V0RmlsbENvbG9yIiwicmVuZGVyVGV4dExhYmVsTGF5ZXIiLCJmaWVsZFBhaXJzIiwiZm9yRWFjaCIsInBhaXIiLCJsYXRGaWVsZCIsImxuZ0ZpZWxkIiwibGF5ZXJOYW1lIiwiZGVmYXVsdE5hbWUiLCJwcm9wIiwidmFsdWUiLCJERUZBVUxUX0xBWUVSX0NPTE9SIiwiaXNWaXNpYmxlIiwib3B0aW9uYWwiLCJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQUVPLElBQU1BLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUM3RDtBQUNBQSxJQUFBQSxDQUFDLENBQUNDLElBQUYsQ0FBT0gsR0FBRyxDQUFDSSxRQUFYLENBRjZELEVBRzdEO0FBQ0FGLElBQUFBLENBQUMsQ0FBQ0MsSUFBRixDQUFPSixHQUFHLENBQUNLLFFBQVgsQ0FKNkQsRUFLN0RILFFBQVEsSUFBSUEsUUFBUSxDQUFDRyxRQUFULEdBQW9CLENBQUMsQ0FBakMsR0FBcUNGLENBQUMsQ0FBQ0MsSUFBRixDQUFPRixRQUFRLENBQUNHLFFBQWhCLENBQXJDLEdBQWlFLENBTEosQ0FBSjtBQUFBLEdBQTNCO0FBQUEsQ0FBekI7OztBQVFBLElBQU1DLG9CQUFvQixHQUFHLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBN0I7O0FBQ0EsSUFBTUMsb0JBQW9CLEdBQUcsQ0FBQyxVQUFELENBQTdCOztBQUVQLElBQU1DLGlCQUFpQixHQUFHLElBQUlDLDZCQUFKLEVBQTFCO0FBRU8sSUFBTUMsZUFBZSxHQUFHO0FBQzdCQyxFQUFBQSxNQUFNLEVBQUUsUUFEcUI7QUFFN0JDLEVBQUFBLFdBQVcsRUFBRSxhQUZnQjtBQUc3QkMsRUFBQUEsT0FBTyxFQUFFLFNBSG9CO0FBSTdCQyxFQUFBQSxPQUFPLEVBQUUsU0FKb0I7QUFLN0JDLEVBQUFBLFNBQVMsRUFBRSxXQUxrQjtBQU03QkMsRUFBQUEsV0FBVyxFQUFFLGFBTmdCO0FBTzdCQyxFQUFBQSxVQUFVLEVBQUUsWUFQaUI7QUFRN0JDLEVBQUFBLGdCQUFnQixFQUFFLGtCQVJXO0FBUzdCQyxFQUFBQSxXQUFXLEVBQUUsYUFUZ0I7QUFVN0JDLEVBQUFBLE1BQU0sRUFBRTtBQUNOQyxJQUFBQSxJQUFJLEVBQUUsU0FEQTtBQUVOQyxJQUFBQSxLQUFLLEVBQUUsaUJBRkQ7QUFHTkMsSUFBQUEsWUFBWSxFQUFFLElBSFI7QUFJTkMsSUFBQUEsUUFBUSxFQUFFO0FBSko7QUFWcUIsQ0FBeEI7OztJQWtCY0MsVTs7Ozs7QUFDbkIsc0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTtBQUNqQiw4QkFBTUEsS0FBTjs7QUFFQSxVQUFLQyxpQkFBTCxDQUF1QmpCLGVBQXZCOztBQUNBLFVBQUtrQixtQkFBTCxHQUEyQjtBQUFBLGFBQU03QixnQkFBZ0IsQ0FBQyxNQUFLOEIsTUFBTCxDQUFZQyxPQUFiLENBQXRCO0FBQUEsS0FBM0I7O0FBSmlCO0FBS2xCOzs7O1NBRUQsZUFBVztBQUNULGFBQU8sT0FBUDtBQUNEOzs7U0FFRCxlQUFtQjtBQUNqQixhQUFPLEtBQVA7QUFDRDs7O1NBRUQsZUFBZ0I7QUFDZCxhQUFPQywwQkFBUDtBQUNEOzs7U0FDRCxlQUEyQjtBQUN6QixhQUFPekIsb0JBQVA7QUFDRDs7O1NBRUQsZUFBc0I7QUFDcEIsYUFBT0Msb0JBQVA7QUFDRDs7O1NBRUQsZUFBa0I7QUFDaEIsYUFBTyxLQUFLeUIsdUJBQVo7QUFDRDs7O1NBRUQsZUFBa0M7QUFDaEMsaUxBQThDLFFBQTlDO0FBQ0Q7OztTQUVELGVBQXFCO0FBQ25CLGFBQU87QUFDTEMsUUFBQUEsS0FBSyxrQ0FDQSxzR0FBcUJBLEtBRHJCO0FBRUhDLFVBQUFBLFFBQVEsRUFBRSxjQUZQO0FBR0hDLFVBQUFBLFNBQVMsRUFBRSxtQkFBQU4sTUFBTTtBQUFBLG1CQUFJQSxNQUFNLENBQUNPLFNBQVAsQ0FBaUJoQixNQUFyQjtBQUFBLFdBSGQ7QUFJSEcsVUFBQUEsWUFBWSxFQUFFLHNCQUFBTSxNQUFNO0FBQUEsbUJBQUlBLE1BQU0sQ0FBQ0ksS0FBWDtBQUFBO0FBSmpCLFVBREE7QUFPTGpCLFFBQUFBLFdBQVcsRUFBRTtBQUNYUSxVQUFBQSxRQUFRLEVBQUUsYUFEQztBQUVYYSxVQUFBQSxHQUFHLEVBQUUsYUFGTTtBQUdYQyxVQUFBQSxLQUFLLEVBQUUsa0JBSEk7QUFJWEMsVUFBQUEsS0FBSyxFQUFFLGtCQUpJO0FBS1hDLFVBQUFBLE1BQU0sRUFBRSxtQkFMRztBQU1YQyxVQUFBQSxLQUFLLEVBQUUsa0JBTkk7QUFPWEMsVUFBQUEsZ0JBQWdCLEVBQUVDLGdDQUFlVixLQVB0QjtBQVFYQyxVQUFBQSxRQUFRLEVBQUUsY0FSQztBQVNYQyxVQUFBQSxTQUFTLEVBQUUsbUJBQUFOLE1BQU07QUFBQSxtQkFBSUEsTUFBTSxDQUFDTyxTQUFQLENBQWlCdEIsT0FBckI7QUFBQSxXQVROO0FBVVhTLFVBQUFBLFlBQVksRUFBRSxzQkFBQU0sTUFBTTtBQUFBLG1CQUFJQSxNQUFNLENBQUNPLFNBQVAsQ0FBaUJwQixXQUFqQixJQUFnQ2EsTUFBTSxDQUFDSSxLQUEzQztBQUFBO0FBVlQsU0FQUjtBQW1CTFcsUUFBQUEsSUFBSSxrQ0FDQyxzR0FBcUJBLElBRHRCO0FBRUZwQixVQUFBQSxRQUFRLEVBQUUsUUFGUjtBQUdGaUIsVUFBQUEsS0FBSyxFQUFFLGFBSEw7QUFJRkksVUFBQUEsS0FBSyxFQUFFLGFBSkw7QUFLRkgsVUFBQUEsZ0JBQWdCLEVBQUUsUUFMaEI7QUFNRlIsVUFBQUEsUUFBUSxFQUFFLFdBTlI7QUFPRlgsVUFBQUEsWUFBWSxFQUFFO0FBUFo7QUFuQkMsT0FBUDtBQTZCRDs7O1dBRUQsK0JBQXNCdUIsT0FBdEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLEdBQUcseUNBQXNCRCxPQUF0QixDQUExQjs7QUFFQSxVQUFJQyxpQkFBSixFQUF1QjtBQUNyQixhQUFLQyxpQkFBTCxDQUF1QjtBQUNyQkMsVUFBQUEsVUFBVSxFQUFFRjtBQURTLFNBQXZCO0FBR0EsYUFBS0csd0JBQUwsQ0FBOEJKLE9BQTlCLEVBQXVDLE9BQXZDO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7OztXQXFDRCxpQ0FBa0M7QUFBQSxVQUFacEIsS0FBWSx1RUFBSixFQUFJO0FBQ2hDLHFLQUNpQ0EsS0FEakM7QUFHRTtBQUNBeUIsUUFBQUEsZ0JBQWdCLEVBQUUsSUFKcEI7QUFLRUMsUUFBQUEsaUJBQWlCLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUxyQjtBQU1FQyxRQUFBQSxnQkFBZ0IsRUFBRTtBQU5wQjtBQVFEOzs7V0FFRCx1Q0FBaURDLFdBQWpELEVBQThEO0FBQUEsVUFBdENDLE9BQXNDLFNBQXRDQSxPQUFzQztBQUFBLFVBQTdCQyxhQUE2QixTQUE3QkEsYUFBNkI7QUFDNUQsVUFBTXBELElBQUksR0FBRyxFQUFiOztBQUVBLFdBQUssSUFBSXFELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELGFBQWEsQ0FBQ0UsTUFBbEMsRUFBMENELENBQUMsRUFBM0MsRUFBK0M7QUFDN0MsWUFBTUUsS0FBSyxHQUFHSCxhQUFhLENBQUNDLENBQUQsQ0FBM0I7QUFDQSxZQUFNRyxHQUFHLEdBQUdOLFdBQVcsQ0FBQztBQUFDbEQsVUFBQUEsSUFBSSxFQUFFbUQsT0FBTyxDQUFDSSxLQUFEO0FBQWQsU0FBRCxDQUF2QixDQUY2QyxDQUk3QztBQUNBOztBQUNBLFlBQUlDLEdBQUcsQ0FBQ0MsS0FBSixDQUFVQyxNQUFNLENBQUNDLFFBQWpCLENBQUosRUFBZ0M7QUFDOUIzRCxVQUFBQSxJQUFJLENBQUM0RCxJQUFMLENBQVU7QUFDUjVELFlBQUFBLElBQUksRUFBRW1ELE9BQU8sQ0FBQ0ksS0FBRCxDQURMO0FBRVJNLFlBQUFBLFFBQVEsRUFBRUwsR0FGRjtBQUdSO0FBQ0FELFlBQUFBLEtBQUssRUFBTEE7QUFKUSxXQUFWO0FBTUQ7QUFDRjs7QUFDRCxhQUFPdkQsSUFBUDtBQUNEOzs7V0FFRCx5QkFBZ0I4RCxRQUFoQixFQUEwQkMsWUFBMUIsRUFBd0M7QUFBQSxVQUMvQkMsU0FEK0IsR0FDbEIsS0FBS3ZDLE1BRGEsQ0FDL0J1QyxTQUQrQjtBQUFBLFVBRS9CQyxTQUYrQixHQUVsQkgsUUFBUSxDQUFDLEtBQUtyQyxNQUFMLENBQVl5QyxNQUFiLENBRlUsQ0FFL0JELFNBRitCOztBQUFBLDZCQUdQLEtBQUtFLFVBQUwsQ0FBZ0JMLFFBQWhCLEVBQTBCQyxZQUExQixDQUhPO0FBQUEsVUFHL0IvRCxJQUgrQixvQkFHL0JBLElBSCtCO0FBQUEsVUFHekJvRSxjQUh5QixvQkFHekJBLGNBSHlCOztBQUl0QyxVQUFNbEIsV0FBVyxHQUFHLEtBQUsxQixtQkFBTCxFQUFwQixDQUpzQyxDQU10Qzs7QUFDQSxVQUFNNkMsVUFBVSxHQUFHLHlDQUFvQjtBQUNyQ0wsUUFBQUEsU0FBUyxFQUFUQSxTQURxQztBQUVyQ0ksUUFBQUEsY0FBYyxFQUFkQSxjQUZxQztBQUdyQ0wsUUFBQUEsWUFBWSxFQUFaQSxZQUhxQztBQUlyQy9ELFFBQUFBLElBQUksRUFBSkE7QUFKcUMsT0FBcEIsQ0FBbkI7QUFPQSxVQUFNc0UsU0FBUyxHQUFHLEtBQUtDLHFCQUFMLEVBQWxCO0FBRUE7QUFDRXZFLFFBQUFBLElBQUksRUFBSkEsSUFERjtBQUVFa0QsUUFBQUEsV0FBVyxFQUFYQSxXQUZGO0FBR0VzQixRQUFBQSxjQUFjLEVBQUVQLFNBQVMsQ0FBQ1EsbUJBQVYsRUFIbEI7QUFJRUosUUFBQUEsVUFBVSxFQUFWQTtBQUpGLFNBS0tDLFNBTEw7QUFPRDtBQUNEOzs7O1dBRUEseUJBQWdCbkIsT0FBaEIsRUFBeUI7QUFDdkIsVUFBTUQsV0FBVyxHQUFHLEtBQUsxQixtQkFBTCxFQUFwQjtBQUNBLFVBQU1rRCxNQUFNLEdBQUcsS0FBS0MsZUFBTCxDQUFxQnhCLE9BQXJCLEVBQThCLFVBQUFwRCxDQUFDO0FBQUEsZUFBSW1ELFdBQVcsQ0FBQztBQUFDbEQsVUFBQUEsSUFBSSxFQUFFRDtBQUFQLFNBQUQsQ0FBZjtBQUFBLE9BQS9CLENBQWY7QUFDQSxXQUFLNkUsVUFBTCxDQUFnQjtBQUFDRixRQUFBQSxNQUFNLEVBQU5BO0FBQUQsT0FBaEI7QUFDRDs7O1dBRUQscUJBQVlHLElBQVosRUFBa0I7QUFBQTs7QUFBQSxVQUNUN0UsSUFEUyxHQUNzRDZFLElBRHRELENBQ1Q3RSxJQURTO0FBQUEsVUFDSGlFLFNBREcsR0FDc0RZLElBRHRELENBQ0haLFNBREc7QUFBQSxVQUNRYSxhQURSLEdBQ3NERCxJQUR0RCxDQUNRQyxhQURSO0FBQUEsVUFDdUJDLFFBRHZCLEdBQ3NERixJQUR0RCxDQUN1QkUsUUFEdkI7QUFBQSxVQUNpQ0MsaUJBRGpDLEdBQ3NESCxJQUR0RCxDQUNpQ0csaUJBRGpDLEVBR2hCOztBQUNBLFVBQU14RSxXQUFXLEdBQUcsS0FBS2lCLE1BQUwsQ0FBWU8sU0FBWixDQUFzQnhCLFdBQXRCLElBQXFDeUUsT0FBTyxDQUFDLEtBQUt4RCxNQUFMLENBQVl5RCxTQUFiLENBQWhFO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLEtBQUtDLG9CQUFMLENBQTBCTCxRQUExQixFQUFvQ3ZFLFdBQXBDLENBQXBCOztBQUVBLFVBQU02RSxVQUFVO0FBQ2RDLFFBQUFBLE9BQU8sRUFBRSxLQUFLN0QsTUFBTCxDQUFZTyxTQUFaLENBQXNCdEIsT0FEakI7QUFFZE0sUUFBQUEsTUFBTSxFQUFFLEtBQUtTLE1BQUwsQ0FBWU8sU0FBWixDQUFzQmhCLE1BRmhCO0FBR2R1RSxRQUFBQSxjQUFjLEVBQUUsS0FBSzlELE1BQUwsQ0FBWU8sU0FBWixDQUFzQnJCLFNBSHhCO0FBSWR3RSxRQUFBQSxXQUFXLEVBQVhBO0FBSmMsU0FLVixLQUFLMUQsTUFBTCxDQUFZTyxTQUFaLENBQXNCeEIsV0FBdEIsR0FBb0MsRUFBcEMsR0FBeUM7QUFBQ2dGLFFBQUFBLGVBQWUsRUFBRTtBQUFsQixPQUwvQixDQUFoQjs7QUFRQSxVQUFNQyxjQUFjO0FBQ2xCdkMsUUFBQUEsV0FBVyxFQUFFLEtBQUt6QixNQUFMLENBQVlDLE9BRFA7QUFFbEI4QyxRQUFBQSxjQUFjLEVBQUVQLFNBQVMsQ0FBQ3lCO0FBRlIsU0FHZixLQUFLQyw4QkFBTCxFQUhlLENBQXBCOztBQU1BLFVBQU1DLGlCQUFpQixHQUFHLEtBQUtDLHdCQUFMLENBQThCaEIsSUFBOUIsQ0FBMUI7QUFDQSxVQUFNaUIsYUFBYSxHQUFHLEtBQUtDLHlCQUFMLENBQStCZixpQkFBL0IsQ0FBdEI7QUFDQSxVQUFNZ0IsY0FBYyxHQUFHLDJDQUFzQmIsV0FBdEIsRUFBbUNuRixJQUFJLENBQUNpRyxTQUF4QyxFQUFtRGxCLFFBQW5ELENBQXZCO0FBQ0EsVUFBTW1CLFVBQVUsaURBQU9OLGlCQUFpQixDQUFDTSxVQUF6QixJQUFxQzlGLGlCQUFyQyxFQUFoQjs7QUFFQSxVQUFNK0YsV0FBVztBQUNmM0IsUUFBQUEsY0FBYyxFQUFFeEUsSUFBSSxDQUFDd0UsY0FETjtBQUVmMEIsUUFBQUEsVUFBVSxFQUFWQSxVQUZlO0FBR2ZFLFFBQUFBLFdBQVcsRUFBRVIsaUJBQWlCLENBQUNRO0FBSGhCLFNBSVpOLGFBSlksQ0FBakI7O0FBTUEsVUFBTU8sYUFBYSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCeEIsYUFBdEIsQ0FBdEI7QUFFQSxjQUNFLElBQUl5Qix3QkFBSiwyRUFDS1gsaUJBREwsR0FFS0UsYUFGTCxHQUdLVCxVQUhMLEdBSUtyRixJQUpMO0FBS0V3RyxRQUFBQSxVQUFVLEVBQUU7QUFDVjtBQUNBQyxVQUFBQSxTQUFTLEVBQUUsK0JBQUtoRixNQUFMLENBQVlDLE9BQVosQ0FBb0I1QixRQUFwQixnRkFBOEJHLFFBQTlCLElBQXlDLENBQUM7QUFGM0MsU0FMZDtBQVNFeUcsUUFBQUEsY0FBYyxFQUFFLFFBVGxCO0FBVUVqQixRQUFBQSxjQUFjLEVBQWRBLGNBVkY7QUFXRVMsUUFBQUEsVUFBVSxFQUFWQTtBQVhGLFNBREYsNkNBZU1HLGFBQWEsR0FDYixDQUNFLElBQUlFLHdCQUFKLCtDQUNLLEtBQUtJLHlCQUFMLEVBREwsR0FFS3RCLFVBRkw7QUFHRXJGLFFBQUFBLElBQUksRUFBRSxDQUFDcUcsYUFBRCxDQUhSO0FBSUVPLFFBQUFBLFlBQVksRUFBRSxLQUFLbkYsTUFBTCxDQUFZb0YsY0FKNUI7QUFLRUMsUUFBQUEsWUFBWSxFQUFFLEtBQUtyRixNQUFMLENBQVlvRixjQUw1QjtBQU1FWixRQUFBQSxTQUFTLEVBQUVqRyxJQUFJLENBQUNpRyxTQU5sQjtBQU9FL0MsUUFBQUEsV0FBVyxFQUFFbEQsSUFBSSxDQUFDa0Q7QUFQcEIsU0FERixDQURhLEdBWWIsRUEzQk4sdUNBNkJLLEtBQUs2RCxvQkFBTCxDQUNEO0FBQ0U3RCxRQUFBQSxXQUFXLEVBQUVsRCxJQUFJLENBQUNrRCxXQURwQjtBQUVFaUQsUUFBQUEsV0FBVyxFQUFYQSxXQUZGO0FBR0VILFFBQUFBLGNBQWMsRUFBZEEsY0FIRjtBQUlFUCxRQUFBQSxjQUFjLEVBQWRBO0FBSkYsT0FEQyxFQU9EWixJQVBDLENBN0JMO0FBdUNEOzs7V0E1S0Qsc0NBQWdEO0FBQUEsbUNBQWxCbUMsVUFBa0I7QUFBQSxVQUFsQkEsVUFBa0IsaUNBQUwsRUFBSztBQUM5QyxVQUFNMUYsS0FBSyxHQUFHLEVBQWQsQ0FEOEMsQ0FHOUM7O0FBQ0EwRixNQUFBQSxVQUFVLENBQUNDLE9BQVgsQ0FBbUIsVUFBQUMsSUFBSSxFQUFJO0FBQ3pCLFlBQU1DLFFBQVEsR0FBR0QsSUFBSSxDQUFDQSxJQUFMLENBQVV0SCxHQUEzQjtBQUNBLFlBQU13SCxRQUFRLEdBQUdGLElBQUksQ0FBQ0EsSUFBTCxDQUFVckgsR0FBM0I7QUFDQSxZQUFNd0gsU0FBUyxHQUFHSCxJQUFJLENBQUNJLFdBQXZCO0FBRUEsWUFBTUMsSUFBSSxHQUFHO0FBQ1hyRyxVQUFBQSxLQUFLLEVBQUVtRyxTQUFTLENBQUMvRCxNQUFWLEdBQW1CK0QsU0FBbkIsR0FBK0I7QUFEM0IsU0FBYixDQUx5QixDQVN6Qjs7QUFDQSxZQUFJRixRQUFRLENBQUNLLEtBQVQsSUFBa0JDLG9DQUF0QixFQUEyQztBQUN6Q0YsVUFBQUEsSUFBSSxDQUFDMUYsS0FBTCxHQUFhLDBCQUFTNEYscUNBQW9CTixRQUFRLENBQUNLLEtBQTdCLENBQVQsQ0FBYjtBQUNELFNBWndCLENBY3pCOzs7QUFDQSxZQUFJbEcsS0FBSyxDQUFDZ0MsTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QmlFLFVBQUFBLElBQUksQ0FBQ0csU0FBTCxHQUFpQixJQUFqQjtBQUNEOztBQUVESCxRQUFBQSxJQUFJLENBQUM3RixPQUFMLEdBQWU7QUFDYjlCLFVBQUFBLEdBQUcsRUFBRXVILFFBRFE7QUFFYnRILFVBQUFBLEdBQUcsRUFBRXVILFFBRlE7QUFHYnRILFVBQUFBLFFBQVEsRUFBRTtBQUFDMEgsWUFBQUEsS0FBSyxFQUFFLElBQVI7QUFBY3ZILFlBQUFBLFFBQVEsRUFBRSxDQUFDLENBQXpCO0FBQTRCMEgsWUFBQUEsUUFBUSxFQUFFO0FBQXRDO0FBSEcsU0FBZjtBQU1BckcsUUFBQUEsS0FBSyxDQUFDc0MsSUFBTixDQUFXMkQsSUFBWDtBQUNELE9BMUJEO0FBNEJBLGFBQU87QUFBQ2pHLFFBQUFBLEtBQUssRUFBTEE7QUFBRCxPQUFQO0FBQ0Q7OztFQWpIcUNzRyxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7QnJ1c2hpbmdFeHRlbnNpb259IGZyb20gJ0BkZWNrLmdsL2V4dGVuc2lvbnMnO1xuaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2ZpbmREZWZhdWx0Q29sb3JGaWVsZH0gZnJvbSAndXRpbHMvZGF0YXNldC11dGlscyc7XG5pbXBvcnQgUG9pbnRMYXllckljb24gZnJvbSAnLi9wb2ludC1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUiwgQ0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtnZXRUZXh0T2Zmc2V0QnlSYWRpdXMsIGZvcm1hdFRleHRMYWJlbERhdGF9IGZyb20gJy4uL2xheWVyLXRleHQtbGFiZWwnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIC8vIGxuZ1xuICBkLmRhdGFbbG5nLmZpZWxkSWR4XSxcbiAgLy8gbGF0XG4gIGQuZGF0YVtsYXQuZmllbGRJZHhdLFxuICBhbHRpdHVkZSAmJiBhbHRpdHVkZS5maWVsZElkeCA+IC0xID8gZC5kYXRhW2FsdGl0dWRlLmZpZWxkSWR4XSA6IDBcbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludFJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZyddO1xuZXhwb3J0IGNvbnN0IHBvaW50T3B0aW9uYWxDb2x1bW5zID0gWydhbHRpdHVkZSddO1xuXG5jb25zdCBicnVzaGluZ0V4dGVuc2lvbiA9IG5ldyBCcnVzaGluZ0V4dGVuc2lvbigpO1xuXG5leHBvcnQgY29uc3QgcG9pbnRWaXNDb25maWdzID0ge1xuICByYWRpdXM6ICdyYWRpdXMnLFxuICBmaXhlZFJhZGl1czogJ2ZpeGVkUmFkaXVzJyxcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBvdXRsaW5lOiAnb3V0bGluZScsXG4gIHRoaWNrbmVzczogJ3RoaWNrbmVzcycsXG4gIHN0cm9rZUNvbG9yOiAnc3Ryb2tlQ29sb3InLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHN0cm9rZUNvbG9yUmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gIGZpbGxlZDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBsYWJlbDogJ2xheWVyLmZpbGxDb2xvcicsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHByb3BlcnR5OiAnZmlsbGVkJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcocG9pbnRWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBwb2ludFBvc0FjY2Vzc29yKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdwb2ludCc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFBvaW50TGF5ZXJJY29uO1xuICB9XG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gcG9pbnRSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBwb2ludE9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsICdyYWRpdXMnXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0RmlsbENvbG9yJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5maWxsZWQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogY29uZmlnID0+IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHN0cm9rZUNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlQ29sb3InLFxuICAgICAgICBrZXk6ICdzdHJva2VDb2xvcicsXG4gICAgICAgIGZpZWxkOiAnc3Ryb2tlQ29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc3Ryb2tlQ29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3N0cm9rZUNvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0TGluZUNvbG9yJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5vdXRsaW5lLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZUNvbG9yIHx8IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdyYWRpdXMnLFxuICAgICAgICByYW5nZTogJ3JhZGl1c1JhbmdlJyxcbiAgICAgICAgZml4ZWQ6ICdmaXhlZFJhZGl1cycsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6ICdyYWRpdXMnLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFJhZGl1cycsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogMVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzZXRJbml0aWFsTGF5ZXJDb25maWcoZGF0YXNldCkge1xuICAgIGNvbnN0IGRlZmF1bHRDb2xvckZpZWxkID0gZmluZERlZmF1bHRDb2xvckZpZWxkKGRhdGFzZXQpO1xuXG4gICAgaWYgKGRlZmF1bHRDb2xvckZpZWxkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtcbiAgICAgICAgY29sb3JGaWVsZDogZGVmYXVsdENvbG9yRmllbGRcbiAgICAgIH0pO1xuICAgICAgdGhpcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWwoZGF0YXNldCwgJ2NvbG9yJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW119KSB7XG4gICAgY29uc3QgcHJvcHMgPSBbXTtcblxuICAgIC8vIE1ha2UgbGF5ZXIgZm9yIGVhY2ggcGFpclxuICAgIGZpZWxkUGFpcnMuZm9yRWFjaChwYWlyID0+IHtcbiAgICAgIGNvbnN0IGxhdEZpZWxkID0gcGFpci5wYWlyLmxhdDtcbiAgICAgIGNvbnN0IGxuZ0ZpZWxkID0gcGFpci5wYWlyLmxuZztcbiAgICAgIGNvbnN0IGxheWVyTmFtZSA9IHBhaXIuZGVmYXVsdE5hbWU7XG5cbiAgICAgIGNvbnN0IHByb3AgPSB7XG4gICAgICAgIGxhYmVsOiBsYXllck5hbWUubGVuZ3RoID8gbGF5ZXJOYW1lIDogJ1BvaW50J1xuICAgICAgfTtcblxuICAgICAgLy8gZGVmYXVsdCBsYXllciBjb2xvciBmb3IgYmVnaW50cmlwIGFuZCBkcm9wb2ZmIHBvaW50XG4gICAgICBpZiAobGF0RmllbGQudmFsdWUgaW4gREVGQVVMVF9MQVlFUl9DT0xPUikge1xuICAgICAgICBwcm9wLmNvbG9yID0gaGV4VG9SZ2IoREVGQVVMVF9MQVlFUl9DT0xPUltsYXRGaWVsZC52YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdGhlIGZpcnN0IGxheWVyIHRvIGJlIHZpc2libGVcbiAgICAgIGlmIChwcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHJvcC5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBwcm9wLmNvbHVtbnMgPSB7XG4gICAgICAgIGxhdDogbGF0RmllbGQsXG4gICAgICAgIGxuZzogbG5nRmllbGQsXG4gICAgICAgIGFsdGl0dWRlOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9O1xuXG4gICAgICBwcm9wcy5wdXNoKHByb3ApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtwcm9wc307XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICAvLyBhZGQgc3Ryb2tlIGNvbG9yIHZpc3VhbCBjaGFubmVsXG4gICAgICBzdHJva2VDb2xvckZpZWxkOiBudWxsLFxuICAgICAgc3Ryb2tlQ29sb3JEb21haW46IFswLCAxXSxcbiAgICAgIHN0cm9rZUNvbG9yU2NhbGU6ICdxdWFudGlsZSdcbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgLy8gaW5kZXggaXMgaW1wb3J0YW50IGZvciBmaWx0ZXJcbiAgICAgICAgICBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSkge1xuICAgIGNvbnN0IHt0ZXh0TGFiZWx9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3Qge2dwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhLCB0cmlnZ2VyQ2hhbmdlZH0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG4gICAgY29uc3QgZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcblxuICAgIC8vIGdldCBhbGwgZGlzdGluY3QgY2hhcmFjdGVycyBpbiB0aGUgdGV4dCBsYWJlbHNcbiAgICBjb25zdCB0ZXh0TGFiZWxzID0gZm9ybWF0VGV4dExhYmVsRGF0YSh7XG4gICAgICB0ZXh0TGFiZWwsXG4gICAgICB0cmlnZ2VyQ2hhbmdlZCxcbiAgICAgIG9sZExheWVyRGF0YSxcbiAgICAgIGRhdGFcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuZ2V0QXR0cmlidXRlQWNjZXNzb3JzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldFBvc2l0aW9uLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKCksXG4gICAgICB0ZXh0TGFiZWxzLFxuICAgICAgLi4uYWNjZXNzb3JzXG4gICAgfTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZCA9PiBnZXRQb3NpdGlvbih7ZGF0YTogZH0pKTtcbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30gPSBvcHRzO1xuXG4gICAgLy8gaWYgbm8gZmllbGQgc2l6ZSBpcyBkZWZpbmVkIHdlIG5lZWQgdG8gcGFzcyBmaXhlZCByYWRpdXMgPSBmYWxzZVxuICAgIGNvbnN0IGZpeGVkUmFkaXVzID0gdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzICYmIEJvb2xlYW4odGhpcy5jb25maWcuc2l6ZUZpZWxkKTtcbiAgICBjb25zdCByYWRpdXNTY2FsZSA9IHRoaXMuZ2V0UmFkaXVzU2NhbGVCeVpvb20obWFwU3RhdGUsIGZpeGVkUmFkaXVzKTtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBzdHJva2VkOiB0aGlzLmNvbmZpZy52aXNDb25maWcub3V0bGluZSxcbiAgICAgIGZpbGxlZDogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpbGxlZCxcbiAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzLFxuICAgICAgcmFkaXVzU2NhbGUsXG4gICAgICAuLi4odGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzID8ge30gOiB7cmFkaXVzTWF4UGl4ZWxzOiA1MDB9KVxuICAgIH07XG5cbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGdldFBvc2l0aW9uOiB0aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzLFxuICAgICAgLi4udGhpcy5nZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMoKVxuICAgIH07XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIGNvbnN0IGJydXNoaW5nUHJvcHMgPSB0aGlzLmdldEJydXNoaW5nRXh0ZW5zaW9uUHJvcHMoaW50ZXJhY3Rpb25Db25maWcpO1xuICAgIGNvbnN0IGdldFBpeGVsT2Zmc2V0ID0gZ2V0VGV4dE9mZnNldEJ5UmFkaXVzKHJhZGl1c1NjYWxlLCBkYXRhLmdldFJhZGl1cywgbWFwU3RhdGUpO1xuICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBbLi4uZGVmYXVsdExheWVyUHJvcHMuZXh0ZW5zaW9ucywgYnJ1c2hpbmdFeHRlbnNpb25dO1xuXG4gICAgY29uc3Qgc2hhcmVkUHJvcHMgPSB7XG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZGF0YS5nZXRGaWx0ZXJWYWx1ZSxcbiAgICAgIGV4dGVuc2lvbnMsXG4gICAgICBmaWx0ZXJSYW5nZTogZGVmYXVsdExheWVyUHJvcHMuZmlsdGVyUmFuZ2UsXG4gICAgICAuLi5icnVzaGluZ1Byb3BzXG4gICAgfTtcbiAgICBjb25zdCBob3ZlcmVkT2JqZWN0ID0gdGhpcy5oYXNIb3ZlcmVkT2JqZWN0KG9iamVjdEhvdmVyZWQpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgIC4uLmJydXNoaW5nUHJvcHMsXG4gICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAvLyBjaXJjbGVzIHdpbGwgYmUgZmxhdCBvbiB0aGUgbWFwIHdoZW4gdGhlIGFsdGl0dWRlIGNvbHVtbiBpcyBub3QgdXNlZFxuICAgICAgICAgIGRlcHRoVGVzdDogdGhpcy5jb25maWcuY29sdW1ucy5hbHRpdHVkZT8uZmllbGRJZHggPiAtMVxuICAgICAgICB9LFxuICAgICAgICBsaW5lV2lkdGhVbml0czogJ3BpeGVscycsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICBleHRlbnNpb25zXG4gICAgICB9KSxcbiAgICAgIC8vIGhvdmVyIGxheWVyXG4gICAgICAuLi4oaG92ZXJlZE9iamVjdFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCksXG4gICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgIGRhdGE6IFtob3ZlcmVkT2JqZWN0XSxcbiAgICAgICAgICAgICAgZ2V0TGluZUNvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0UmFkaXVzOiBkYXRhLmdldFJhZGl1cyxcbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb25cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKSxcbiAgICAgIC8vIHRleHQgbGFiZWwgbGF5ZXJcbiAgICAgIC4uLnRoaXMucmVuZGVyVGV4dExhYmVsTGF5ZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBnZXRQb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbixcbiAgICAgICAgICBzaGFyZWRQcm9wcyxcbiAgICAgICAgICBnZXRQaXhlbE9mZnNldCxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgICB9LFxuICAgICAgICBvcHRzXG4gICAgICApXG4gICAgXTtcbiAgfVxufVxuIl19