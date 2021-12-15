"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.defaultRadius = exports.defaultLineWidth = exports.defaultElevation = exports.featureAccessor = exports.geoJsonRequiredColumns = exports.geojsonVisConfigs = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _typeAnalyzer = require("type-analyzer");

var _baseLayer = _interopRequireWildcard(require("../base-layer"));

var _layers = require("@deck.gl/layers");

var _geojsonUtils = require("./geojson-utils");

var _geojsonLayerIcon = _interopRequireDefault(require("./geojson-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _layerFactory = require("../layer-factory");

var _SUPPORTED_ANALYZER_T;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SUPPORTED_ANALYZER_TYPES = (_SUPPORTED_ANALYZER_T = {}, (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.GEOMETRY, true), (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.GEOMETRY_FROM_STRING, true), (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING, true), _SUPPORTED_ANALYZER_T);
var geojsonVisConfigs = {
  opacity: 'opacity',
  strokeOpacity: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.opacity), {}, {
    property: 'strokeOpacity'
  }),
  thickness: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.thickness), {}, {
    defaultValue: 0.5
  }),
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radius: 'radius',
  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};
exports.geojsonVisConfigs = geojsonVisConfigs;
var geoJsonRequiredColumns = ['geojson'];
exports.geoJsonRequiredColumns = geoJsonRequiredColumns;

var featureAccessor = function featureAccessor(_ref) {
  var geojson = _ref.geojson;
  return function (d) {
    return d[geojson.fieldIdx];
  };
}; // access feature properties from geojson sub layer


exports.featureAccessor = featureAccessor;
var defaultElevation = 500;
exports.defaultElevation = defaultElevation;
var defaultLineWidth = 1;
exports.defaultLineWidth = defaultLineWidth;
var defaultRadius = 1;
exports.defaultRadius = defaultRadius;

var GeoJsonLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(GeoJsonLayer, _Layer);

  var _super = _createSuper(GeoJsonLayer);

  function GeoJsonLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, GeoJsonLayer);
    _this = _super.call(this, props);
    _this.dataToFeature = [];

    _this.registerVisConfig(geojsonVisConfigs);

    _this.getPositionAccessor = function () {
      return featureAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(GeoJsonLayer, [{
    key: "type",
    get: function get() {
      return 'geojson';
    }
  }, {
    key: "name",
    get: function get() {
      return 'Polygon';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _geojsonLayerIcon["default"];
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return geoJsonRequiredColumns;
    }
  }, {
    key: "visualChannels",
    get: function get() {
      var visualChannels = (0, _get2["default"])((0, _getPrototypeOf2["default"])(GeoJsonLayer.prototype), "visualChannels", this);
      return {
        color: _objectSpread(_objectSpread({}, visualChannels.color), {}, {
          accessor: 'getFillColor',
          condition: function condition(config) {
            return config.visConfig.filled;
          },
          nullValue: visualChannels.color.nullValue,
          getAttributeValue: function getAttributeValue(config) {
            return function (d) {
              return d.properties.fillColor || config.color;
            };
          },
          // used this to get updateTriggers
          defaultValue: function defaultValue(config) {
            return config.color;
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
          accessor: 'getLineColor',
          condition: function condition(config) {
            return config.visConfig.stroked;
          },
          nullValue: visualChannels.color.nullValue,
          getAttributeValue: function getAttributeValue(config) {
            return function (d) {
              return d.properties.lineColor || config.visConfig.strokeColor || config.color;
            };
          },
          // used this to get updateTriggers
          defaultValue: function defaultValue(config) {
            return config.visConfig.strokeColor || config.color;
          }
        },
        size: _objectSpread(_objectSpread({}, visualChannels.size), {}, {
          property: 'stroke',
          accessor: 'getLineWidth',
          condition: function condition(config) {
            return config.visConfig.stroked;
          },
          nullValue: 0,
          getAttributeValue: function getAttributeValue() {
            return function (d) {
              return d.properties.lineWidth || defaultLineWidth;
            };
          }
        }),
        height: {
          property: 'height',
          field: 'heightField',
          scale: 'heightScale',
          domain: 'heightDomain',
          range: 'heightRange',
          key: 'height',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.size,
          accessor: 'getElevation',
          condition: function condition(config) {
            return config.visConfig.enable3d;
          },
          nullValue: 0,
          getAttributeValue: function getAttributeValue() {
            return function (d) {
              return d.properties.elevation || defaultElevation;
            };
          }
        },
        radius: {
          property: 'radius',
          field: 'radiusField',
          scale: 'radiusScale',
          domain: 'radiusDomain',
          range: 'radiusRange',
          key: 'radius',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.radius,
          accessor: 'getRadius',
          nullValue: 0,
          getAttributeValue: function getAttributeValue() {
            return function (d) {
              return d.properties.radius || defaultRadius;
            };
          }
        }
      };
    }
  }, {
    key: "getPositionAccessor",
    value: function getPositionAccessor() {
      return this.getFeature(this.config.columns);
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(GeoJsonLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
        // add height visual channel
        heightField: null,
        heightDomain: [0, 1],
        heightScale: 'linear',
        // add radius visual channel
        radiusField: null,
        radiusDomain: [0, 1],
        radiusScale: 'linear',
        // add stroke color visual channel
        strokeColorField: null,
        strokeColorDomain: [0, 1],
        strokeColorScale: 'quantile'
      });
    }
  }, {
    key: "getHoverData",
    value: function getHoverData(object, allData) {
      // index of allData is saved to feature.properties
      return allData[object.properties.index];
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getPosition) {
      var _this2 = this;

      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      return filteredIndex.map(function (i) {
        return _this2.dataToFeature[i];
      }).filter(function (d) {
        return d;
      });
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _datasets$this$config = datasets[this.config.dataId],
          allData = _datasets$this$config.allData,
          gpuFilter = _datasets$this$config.gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var valueAccessor = function valueAccessor(f) {
        return allData[f.properties.index];
      };

      var indexAccessor = function indexAccessor(f) {
        return f.properties.index;
      };

      var accessors = this.getAttributeAccessors(valueAccessor);
      return _objectSpread({
        data: data,
        getFilterValue: gpuFilter.filterValueAccessor(indexAccessor, valueAccessor)
      }, accessors);
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData) {
      var getFeature = this.getPositionAccessor();
      this.dataToFeature = (0, _geojsonUtils.getGeojsonDataMaps)(allData, getFeature); // get bounds from features

      var bounds = (0, _geojsonUtils.getGeojsonBounds)(this.dataToFeature); // if any of the feature has properties.radius set to be true

      var fixedRadius = Boolean(this.dataToFeature.find(function (d) {
        return d && d.properties && d.properties.radius;
      })); // keep a record of what type of geometry the collection has

      var featureTypes = (0, _geojsonUtils.getGeojsonFeatureTypes)(this.dataToFeature);
      this.updateMeta({
        bounds: bounds,
        fixedRadius: fixedRadius,
        featureTypes: featureTypes
      });
    }
  }, {
    key: "setInitialLayerConfig",
    value: function setInitialLayerConfig(_ref3) {
      var allData = _ref3.allData;
      this.updateLayerMeta(allData);
      var featureTypes = this.meta.featureTypes; // default settings is stroke: true, filled: false

      if (featureTypes && featureTypes.polygon) {
        // set both fill and stroke to true
        return this.updateLayerVisConfig({
          filled: true,
          stroked: true,
          strokeColor: _baseLayer.colorMaker.next().value
        });
      } else if (featureTypes && featureTypes.point) {
        // set fill to true if detect point
        return this.updateLayerVisConfig({
          filled: true,
          stroked: false
        });
      }

      return this;
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState,
          interactionConfig = opts.interactionConfig;
      var _this$meta = this.meta,
          fixedRadius = _this$meta.fixedRadius,
          featureTypes = _this$meta.featureTypes;
      var radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);
      var zoomFactor = this.getZoomFactor(mapState);
      var eleZoomFactor = this.getElevationZoomFactor(mapState);
      var visConfig = this.config.visConfig;
      var layerProps = {
        lineWidthScale: visConfig.thickness * zoomFactor * 8,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        pointRadiusScale: radiusScale,
        lineMiterLimit: 4
      };

      var updateTriggers = _objectSpread(_objectSpread({}, this.getVisualChannelUpdateTriggers()), {}, {
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      });

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var opaOverwrite = {
        opacity: visConfig.strokeOpacity
      };
      var pickable = interactionConfig.tooltip.enabled;
      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [new _layers.GeoJsonLayer(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), layerProps), data), {}, {
        pickable: pickable,
        highlightColor: _defaultSettings.HIGHLIGH_COLOR_3D,
        autoHighlight: visConfig.enable3d && pickable,
        stroked: visConfig.stroked,
        filled: visConfig.filled,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        wrapLongitude: false,
        lineMiterLimit: 2,
        rounded: true,
        updateTriggers: updateTriggers,
        _subLayerProps: _objectSpread(_objectSpread(_objectSpread({}, featureTypes.polygon ? {
          'polygons-stroke': opaOverwrite
        } : {}), featureTypes.line ? {
          'line-strings': opaOverwrite
        } : {}), featureTypes.point ? {
          points: {
            lineOpacity: visConfig.strokeOpacity
          }
        } : {})
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject && !visConfig.enable3d ? [new _layers.GeoJsonLayer(_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), layerProps), {}, {
        wrapLongitude: false,
        data: [hoveredObject],
        getLineWidth: data.getLineWidth,
        getRadius: data.getRadius,
        getElevation: data.getElevation,
        getLineColor: this.config.highlightColor,
        getFillColor: this.config.highlightColor,
        // always draw outline
        stroked: true,
        filled: false
      }))] : []));
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref4) {
      var _this3 = this;

      var label = _ref4.label,
          _ref4$fields = _ref4.fields,
          fields = _ref4$fields === void 0 ? [] : _ref4$fields;
      var geojsonColumns = fields.filter(function (f) {
        return f.type === 'geojson' && SUPPORTED_ANALYZER_TYPES[f.analyzerType];
      }).map(function (f) {
        return f.name;
      });
      var defaultColumns = {
        geojson: (0, _lodash["default"])([].concat((0, _toConsumableArray2["default"])(_defaultSettings.GEOJSON_FIELDS.geojson), (0, _toConsumableArray2["default"])(geojsonColumns)))
      };
      var foundColumns = this.findDefaultColumnField(defaultColumns, fields);

      if (!foundColumns || !foundColumns.length) {
        return {
          props: []
        };
      }

      return {
        props: foundColumns.map(function (columns) {
          return {
            label: typeof label === 'string' && label.replace(/\.[^/.]+$/, '') || _this3.type,
            columns: columns,
            isVisible: true
          };
        })
      };
    }
  }]);
  return GeoJsonLayer;
}(_baseLayer["default"]);

exports["default"] = GeoJsonLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIlNVUFBPUlRFRF9BTkFMWVpFUl9UWVBFUyIsIkRBVEFfVFlQRVMiLCJHRU9NRVRSWSIsIkdFT01FVFJZX0ZST01fU1RSSU5HIiwiUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklORyIsImdlb2pzb25WaXNDb25maWdzIiwib3BhY2l0eSIsInN0cm9rZU9wYWNpdHkiLCJMQVlFUl9WSVNfQ09ORklHUyIsInByb3BlcnR5IiwidGhpY2tuZXNzIiwiZGVmYXVsdFZhbHVlIiwic3Ryb2tlQ29sb3IiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInJhZGl1cyIsInNpemVSYW5nZSIsInJhZGl1c1JhbmdlIiwiaGVpZ2h0UmFuZ2UiLCJlbGV2YXRpb25TY2FsZSIsImVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3IiLCJzdHJva2VkIiwiZmlsbGVkIiwiZW5hYmxlM2QiLCJ3aXJlZnJhbWUiLCJnZW9Kc29uUmVxdWlyZWRDb2x1bW5zIiwiZmVhdHVyZUFjY2Vzc29yIiwiZ2VvanNvbiIsImQiLCJmaWVsZElkeCIsImRlZmF1bHRFbGV2YXRpb24iLCJkZWZhdWx0TGluZVdpZHRoIiwiZGVmYXVsdFJhZGl1cyIsIkdlb0pzb25MYXllciIsInByb3BzIiwiZGF0YVRvRmVhdHVyZSIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb25BY2Nlc3NvciIsImNvbmZpZyIsImNvbHVtbnMiLCJHZW9qc29uTGF5ZXJJY29uIiwidmlzdWFsQ2hhbm5lbHMiLCJjb2xvciIsImFjY2Vzc29yIiwiY29uZGl0aW9uIiwidmlzQ29uZmlnIiwibnVsbFZhbHVlIiwiZ2V0QXR0cmlidXRlVmFsdWUiLCJwcm9wZXJ0aWVzIiwiZmlsbENvbG9yIiwiZmllbGQiLCJzY2FsZSIsImRvbWFpbiIsInJhbmdlIiwia2V5IiwiY2hhbm5lbFNjYWxlVHlwZSIsIkNIQU5ORUxfU0NBTEVTIiwibGluZUNvbG9yIiwic2l6ZSIsImxpbmVXaWR0aCIsImhlaWdodCIsImVsZXZhdGlvbiIsImdldEZlYXR1cmUiLCJoZWlnaHRGaWVsZCIsImhlaWdodERvbWFpbiIsImhlaWdodFNjYWxlIiwicmFkaXVzRmllbGQiLCJyYWRpdXNEb21haW4iLCJyYWRpdXNTY2FsZSIsInN0cm9rZUNvbG9yRmllbGQiLCJzdHJva2VDb2xvckRvbWFpbiIsInN0cm9rZUNvbG9yU2NhbGUiLCJvYmplY3QiLCJhbGxEYXRhIiwiaW5kZXgiLCJnZXRQb3NpdGlvbiIsImZpbHRlcmVkSW5kZXgiLCJtYXAiLCJpIiwiZmlsdGVyIiwiZGF0YXNldHMiLCJvbGRMYXllckRhdGEiLCJkYXRhSWQiLCJncHVGaWx0ZXIiLCJ1cGRhdGVEYXRhIiwiZGF0YSIsInZhbHVlQWNjZXNzb3IiLCJmIiwiaW5kZXhBY2Nlc3NvciIsImFjY2Vzc29ycyIsImdldEF0dHJpYnV0ZUFjY2Vzc29ycyIsImdldEZpbHRlclZhbHVlIiwiZmlsdGVyVmFsdWVBY2Nlc3NvciIsImJvdW5kcyIsImZpeGVkUmFkaXVzIiwiQm9vbGVhbiIsImZpbmQiLCJmZWF0dXJlVHlwZXMiLCJ1cGRhdGVNZXRhIiwidXBkYXRlTGF5ZXJNZXRhIiwibWV0YSIsInBvbHlnb24iLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsImNvbG9yTWFrZXIiLCJuZXh0IiwidmFsdWUiLCJwb2ludCIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImdldFJhZGl1c1NjYWxlQnlab29tIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJlbGVab29tRmFjdG9yIiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsImxheWVyUHJvcHMiLCJsaW5lV2lkdGhTY2FsZSIsInBvaW50UmFkaXVzU2NhbGUiLCJsaW5lTWl0ZXJMaW1pdCIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0VmlzdWFsQ2hhbm5lbFVwZGF0ZVRyaWdnZXJzIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsImRlZmF1bHRMYXllclByb3BzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwib3BhT3ZlcndyaXRlIiwicGlja2FibGUiLCJ0b29sdGlwIiwiZW5hYmxlZCIsImhvdmVyZWRPYmplY3QiLCJoYXNIb3ZlcmVkT2JqZWN0IiwiRGVja0dMR2VvSnNvbkxheWVyIiwiaGlnaGxpZ2h0Q29sb3IiLCJISUdITElHSF9DT0xPUl8zRCIsImF1dG9IaWdobGlnaHQiLCJleHRydWRlZCIsIndyYXBMb25naXR1ZGUiLCJyb3VuZGVkIiwiX3N1YkxheWVyUHJvcHMiLCJsaW5lIiwicG9pbnRzIiwibGluZU9wYWNpdHkiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwiZ2V0TGluZVdpZHRoIiwiZ2V0UmFkaXVzIiwiZ2V0RWxldmF0aW9uIiwiZ2V0TGluZUNvbG9yIiwiZ2V0RmlsbENvbG9yIiwibGFiZWwiLCJmaWVsZHMiLCJnZW9qc29uQ29sdW1ucyIsInR5cGUiLCJhbmFseXplclR5cGUiLCJuYW1lIiwiZGVmYXVsdENvbHVtbnMiLCJHRU9KU09OX0ZJRUxEUyIsImZvdW5kQ29sdW1ucyIsImZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJsZW5ndGgiLCJyZXBsYWNlIiwiaXNWaXNpYmxlIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsd0JBQXdCLHdGQUMzQkMseUJBQVdDLFFBRGdCLEVBQ0wsSUFESywyREFFM0JELHlCQUFXRSxvQkFGZ0IsRUFFTyxJQUZQLDJEQUczQkYseUJBQVdHLHlCQUhnQixFQUdZLElBSFoseUJBQTlCO0FBTU8sSUFBTUMsaUJBQWlCLEdBQUc7QUFDL0JDLEVBQUFBLE9BQU8sRUFBRSxTQURzQjtBQUUvQkMsRUFBQUEsYUFBYSxrQ0FDUkMsZ0NBQWtCRixPQURWO0FBRVhH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O0FBQVIsU0FBUDtBQUNEOztBQUVELGFBQU87QUFDTEEsUUFBQUEsS0FBSyxFQUFFMEgsWUFBWSxDQUFDL0UsR0FBYixDQUFpQixVQUFBdEMsT0FBTztBQUFBLGlCQUFLO0FBQ2xDNkcsWUFBQUEsS0FBSyxFQUFHLE9BQU9BLEtBQVAsS0FBaUIsUUFBakIsSUFBNkJBLEtBQUssQ0FBQ1csT0FBTixDQUFjLFdBQWQsRUFBMkIsRUFBM0IsQ0FBOUIsSUFBaUUsTUFBSSxDQUFDUixJQUQzQztBQUVsQ2hILFlBQUFBLE9BQU8sRUFBUEEsT0FGa0M7QUFHbEN5SCxZQUFBQSxTQUFTLEVBQUU7QUFIdUIsV0FBTDtBQUFBLFNBQXhCO0FBREYsT0FBUDtBQU9EOzs7RUFsSHVDQyxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCB7REFUQV9UWVBFU30gZnJvbSAndHlwZS1hbmFseXplcic7XG5cbmltcG9ydCBMYXllciwge2NvbG9yTWFrZXJ9IGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtHZW9Kc29uTGF5ZXIgYXMgRGVja0dMR2VvSnNvbkxheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuaW1wb3J0IHtnZXRHZW9qc29uRGF0YU1hcHMsIGdldEdlb2pzb25Cb3VuZHMsIGdldEdlb2pzb25GZWF0dXJlVHlwZXN9IGZyb20gJy4vZ2VvanNvbi11dGlscyc7XG5pbXBvcnQgR2VvanNvbkxheWVySWNvbiBmcm9tICcuL2dlb2pzb24tbGF5ZXItaWNvbic7XG5pbXBvcnQge0dFT0pTT05fRklFTERTLCBISUdITElHSF9DT0xPUl8zRCwgQ0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcblxuY29uc3QgU1VQUE9SVEVEX0FOQUxZWkVSX1RZUEVTID0ge1xuICBbREFUQV9UWVBFUy5HRU9NRVRSWV06IHRydWUsXG4gIFtEQVRBX1RZUEVTLkdFT01FVFJZX0ZST01fU1RSSU5HXTogdHJ1ZSxcbiAgW0RBVEFfVFlQRVMuUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklOR106IHRydWVcbn07XG5cbmV4cG9ydCBjb25zdCBnZW9qc29uVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBzdHJva2VPcGFjaXR5OiB7XG4gICAgLi4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eSxcbiAgICBwcm9wZXJ0eTogJ3N0cm9rZU9wYWNpdHknXG4gIH0sXG4gIHRoaWNrbmVzczoge1xuICAgIC4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzcyxcbiAgICBkZWZhdWx0VmFsdWU6IDAuNVxuICB9LFxuICBzdHJva2VDb2xvcjogJ3N0cm9rZUNvbG9yJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBzdHJva2VDb2xvclJhbmdlOiAnc3Ryb2tlQ29sb3JSYW5nZScsXG4gIHJhZGl1czogJ3JhZGl1cycsXG5cbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICBoZWlnaHRSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG4gIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3I6ICdlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yJyxcbiAgc3Ryb2tlZDogJ3N0cm9rZWQnLFxuICBmaWxsZWQ6ICdmaWxsZWQnLFxuICBlbmFibGUzZDogJ2VuYWJsZTNkJyxcbiAgd2lyZWZyYW1lOiAnd2lyZWZyYW1lJ1xufTtcblxuZXhwb3J0IGNvbnN0IGdlb0pzb25SZXF1aXJlZENvbHVtbnMgPSBbJ2dlb2pzb24nXTtcbmV4cG9ydCBjb25zdCBmZWF0dXJlQWNjZXNzb3IgPSAoe2dlb2pzb259KSA9PiBkID0+IGRbZ2VvanNvbi5maWVsZElkeF07XG4vLyBhY2Nlc3MgZmVhdHVyZSBwcm9wZXJ0aWVzIGZyb20gZ2VvanNvbiBzdWIgbGF5ZXJcbmV4cG9ydCBjb25zdCBkZWZhdWx0RWxldmF0aW9uID0gNTAwO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRMaW5lV2lkdGggPSAxO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRSYWRpdXMgPSAxO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW9Kc29uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0gW107XG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhnZW9qc29uVmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yID0gKCkgPT4gZmVhdHVyZUFjY2Vzc29yKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdnZW9qc29uJztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiAnUG9seWdvbic7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBHZW9qc29uTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBnZW9Kc29uUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWxzID0gc3VwZXIudmlzdWFsQ2hhbm5lbHM7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIC4uLnZpc3VhbENoYW5uZWxzLmNvbG9yLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldEZpbGxDb2xvcicsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZmlsbGVkLFxuICAgICAgICBudWxsVmFsdWU6IHZpc3VhbENoYW5uZWxzLmNvbG9yLm51bGxWYWx1ZSxcbiAgICAgICAgZ2V0QXR0cmlidXRlVmFsdWU6IGNvbmZpZyA9PiBkID0+IGQucHJvcGVydGllcy5maWxsQ29sb3IgfHwgY29uZmlnLmNvbG9yLFxuICAgICAgICAvLyB1c2VkIHRoaXMgdG8gZ2V0IHVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogY29uZmlnID0+IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHN0cm9rZUNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlQ29sb3InLFxuICAgICAgICBmaWVsZDogJ3N0cm9rZUNvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ3N0cm9rZUNvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzdHJva2VDb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc3Ryb2tlQ29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ3N0cm9rZUNvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0TGluZUNvbG9yJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBudWxsVmFsdWU6IHZpc3VhbENoYW5uZWxzLmNvbG9yLm51bGxWYWx1ZSxcbiAgICAgICAgZ2V0QXR0cmlidXRlVmFsdWU6IGNvbmZpZyA9PiBkID0+XG4gICAgICAgICAgZC5wcm9wZXJ0aWVzLmxpbmVDb2xvciB8fCBjb25maWcudmlzQ29uZmlnLnN0cm9rZUNvbG9yIHx8IGNvbmZpZy5jb2xvcixcbiAgICAgICAgLy8gdXNlZCB0aGlzIHRvIGdldCB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgICBkZWZhdWx0VmFsdWU6IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZUNvbG9yIHx8IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2UnLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldExpbmVXaWR0aCcsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuc3Ryb2tlZCxcbiAgICAgICAgbnVsbFZhbHVlOiAwLFxuICAgICAgICBnZXRBdHRyaWJ1dGVWYWx1ZTogKCkgPT4gZCA9PiBkLnByb3BlcnRpZXMubGluZVdpZHRoIHx8IGRlZmF1bHRMaW5lV2lkdGhcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IHtcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ2hlaWdodEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdoZWlnaHRTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2hlaWdodERvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnaGVpZ2h0UmFuZ2UnLFxuICAgICAgICBrZXk6ICdoZWlnaHQnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5zaXplLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldEVsZXZhdGlvbicsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIG51bGxWYWx1ZTogMCxcbiAgICAgICAgZ2V0QXR0cmlidXRlVmFsdWU6ICgpID0+IGQgPT4gZC5wcm9wZXJ0aWVzLmVsZXZhdGlvbiB8fCBkZWZhdWx0RWxldmF0aW9uXG4gICAgICB9LFxuICAgICAgcmFkaXVzOiB7XG4gICAgICAgIHByb3BlcnR5OiAncmFkaXVzJyxcbiAgICAgICAgZmllbGQ6ICdyYWRpdXNGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAncmFkaXVzU2NhbGUnLFxuICAgICAgICBkb21haW46ICdyYWRpdXNEb21haW4nLFxuICAgICAgICByYW5nZTogJ3JhZGl1c1JhbmdlJyxcbiAgICAgICAga2V5OiAncmFkaXVzJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMucmFkaXVzLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFJhZGl1cycsXG4gICAgICAgIG51bGxWYWx1ZTogMCxcbiAgICAgICAgZ2V0QXR0cmlidXRlVmFsdWU6ICgpID0+IGQgPT4gZC5wcm9wZXJ0aWVzLnJhZGl1cyB8fCBkZWZhdWx0UmFkaXVzXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldFBvc2l0aW9uQWNjZXNzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmVhdHVyZSh0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2xhYmVsLCBmaWVsZHMgPSBbXX0pIHtcbiAgICBjb25zdCBnZW9qc29uQ29sdW1ucyA9IGZpZWxkc1xuICAgICAgLmZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2dlb2pzb24nICYmIFNVUFBPUlRFRF9BTkFMWVpFUl9UWVBFU1tmLmFuYWx5emVyVHlwZV0pXG4gICAgICAubWFwKGYgPT4gZi5uYW1lKTtcblxuICAgIGNvbnN0IGRlZmF1bHRDb2x1bW5zID0ge1xuICAgICAgZ2VvanNvbjogdW5pcShbLi4uR0VPSlNPTl9GSUVMRFMuZ2VvanNvbiwgLi4uZ2VvanNvbkNvbHVtbnNdKVxuICAgIH07XG5cbiAgICBjb25zdCBmb3VuZENvbHVtbnMgPSB0aGlzLmZpbmREZWZhdWx0Q29sdW1uRmllbGQoZGVmYXVsdENvbHVtbnMsIGZpZWxkcyk7XG4gICAgaWYgKCFmb3VuZENvbHVtbnMgfHwgIWZvdW5kQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7cHJvcHM6IFtdfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcHJvcHM6IGZvdW5kQ29sdW1ucy5tYXAoY29sdW1ucyA9PiAoe1xuICAgICAgICBsYWJlbDogKHR5cGVvZiBsYWJlbCA9PT0gJ3N0cmluZycgJiYgbGFiZWwucmVwbGFjZSgvXFwuW14vLl0rJC8sICcnKSkgfHwgdGhpcy50eXBlLFxuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBpc1Zpc2libGU6IHRydWVcbiAgICAgIH0pKVxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICAvLyBhZGQgaGVpZ2h0IHZpc3VhbCBjaGFubmVsXG4gICAgICBoZWlnaHRGaWVsZDogbnVsbCxcbiAgICAgIGhlaWdodERvbWFpbjogWzAsIDFdLFxuICAgICAgaGVpZ2h0U2NhbGU6ICdsaW5lYXInLFxuXG4gICAgICAvLyBhZGQgcmFkaXVzIHZpc3VhbCBjaGFubmVsXG4gICAgICByYWRpdXNGaWVsZDogbnVsbCxcbiAgICAgIHJhZGl1c0RvbWFpbjogWzAsIDFdLFxuICAgICAgcmFkaXVzU2NhbGU6ICdsaW5lYXInLFxuXG4gICAgICAvLyBhZGQgc3Ryb2tlIGNvbG9yIHZpc3VhbCBjaGFubmVsXG4gICAgICBzdHJva2VDb2xvckZpZWxkOiBudWxsLFxuICAgICAgc3Ryb2tlQ29sb3JEb21haW46IFswLCAxXSxcbiAgICAgIHN0cm9rZUNvbG9yU2NhbGU6ICdxdWFudGlsZSdcbiAgICB9O1xuICB9XG5cbiAgZ2V0SG92ZXJEYXRhKG9iamVjdCwgYWxsRGF0YSkge1xuICAgIC8vIGluZGV4IG9mIGFsbERhdGEgaXMgc2F2ZWQgdG8gZmVhdHVyZS5wcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGFsbERhdGFbb2JqZWN0LnByb3BlcnRpZXMuaW5kZXhdO1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIGZpbHRlcmVkSW5kZXgubWFwKGkgPT4gdGhpcy5kYXRhVG9GZWF0dXJlW2ldKS5maWx0ZXIoZCA9PiBkKTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKSB7XG4gICAgY29uc3Qge2FsbERhdGEsIGdwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gZiA9PiBhbGxEYXRhW2YucHJvcGVydGllcy5pbmRleF07XG4gICAgY29uc3QgaW5kZXhBY2Nlc3NvciA9IGYgPT4gZi5wcm9wZXJ0aWVzLmluZGV4O1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuZ2V0QXR0cmlidXRlQWNjZXNzb3JzKHZhbHVlQWNjZXNzb3IpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlQWNjZXNzb3IoaW5kZXhBY2Nlc3NvciwgdmFsdWVBY2Nlc3NvciksXG4gICAgICAuLi5hY2Nlc3NvcnNcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEpIHtcbiAgICBjb25zdCBnZXRGZWF0dXJlID0gdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yKCk7XG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0gZ2V0R2VvanNvbkRhdGFNYXBzKGFsbERhdGEsIGdldEZlYXR1cmUpO1xuXG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIGZlYXR1cmVzXG4gICAgY29uc3QgYm91bmRzID0gZ2V0R2VvanNvbkJvdW5kcyh0aGlzLmRhdGFUb0ZlYXR1cmUpO1xuICAgIC8vIGlmIGFueSBvZiB0aGUgZmVhdHVyZSBoYXMgcHJvcGVydGllcy5yYWRpdXMgc2V0IHRvIGJlIHRydWVcbiAgICBjb25zdCBmaXhlZFJhZGl1cyA9IEJvb2xlYW4oXG4gICAgICB0aGlzLmRhdGFUb0ZlYXR1cmUuZmluZChkID0+IGQgJiYgZC5wcm9wZXJ0aWVzICYmIGQucHJvcGVydGllcy5yYWRpdXMpXG4gICAgKTtcblxuICAgIC8vIGtlZXAgYSByZWNvcmQgb2Ygd2hhdCB0eXBlIG9mIGdlb21ldHJ5IHRoZSBjb2xsZWN0aW9uIGhhc1xuICAgIGNvbnN0IGZlYXR1cmVUeXBlcyA9IGdldEdlb2pzb25GZWF0dXJlVHlwZXModGhpcy5kYXRhVG9GZWF0dXJlKTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzLCBmaXhlZFJhZGl1cywgZmVhdHVyZVR5cGVzfSk7XG4gIH1cblxuICBzZXRJbml0aWFsTGF5ZXJDb25maWcoe2FsbERhdGF9KSB7XG4gICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSk7XG5cbiAgICBjb25zdCB7ZmVhdHVyZVR5cGVzfSA9IHRoaXMubWV0YTtcbiAgICAvLyBkZWZhdWx0IHNldHRpbmdzIGlzIHN0cm9rZTogdHJ1ZSwgZmlsbGVkOiBmYWxzZVxuICAgIGlmIChmZWF0dXJlVHlwZXMgJiYgZmVhdHVyZVR5cGVzLnBvbHlnb24pIHtcbiAgICAgIC8vIHNldCBib3RoIGZpbGwgYW5kIHN0cm9rZSB0byB0cnVlXG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVMYXllclZpc0NvbmZpZyh7XG4gICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGNvbG9yTWFrZXIubmV4dCgpLnZhbHVlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGZlYXR1cmVUeXBlcyAmJiBmZWF0dXJlVHlwZXMucG9pbnQpIHtcbiAgICAgIC8vIHNldCBmaWxsIHRvIHRydWUgaWYgZGV0ZWN0IHBvaW50XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVMYXllclZpc0NvbmZpZyh7ZmlsbGVkOiB0cnVlLCBzdHJva2VkOiBmYWxzZX0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30gPSBvcHRzO1xuXG4gICAgY29uc3Qge2ZpeGVkUmFkaXVzLCBmZWF0dXJlVHlwZXN9ID0gdGhpcy5tZXRhO1xuICAgIGNvbnN0IHJhZGl1c1NjYWxlID0gdGhpcy5nZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZSwgZml4ZWRSYWRpdXMpO1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUpO1xuXG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBsaW5lV2lkdGhTY2FsZTogdmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiA4LFxuICAgICAgZWxldmF0aW9uU2NhbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSAqIGVsZVpvb21GYWN0b3IsXG4gICAgICBwb2ludFJhZGl1c1NjYWxlOiByYWRpdXNTY2FsZSxcbiAgICAgIGxpbmVNaXRlckxpbWl0OiA0XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgLi4udGhpcy5nZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMoKSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc1xuICAgIH07XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIGNvbnN0IG9wYU92ZXJ3cml0ZSA9IHtcbiAgICAgIG9wYWNpdHk6IHZpc0NvbmZpZy5zdHJva2VPcGFjaXR5XG4gICAgfTtcblxuICAgIGNvbnN0IHBpY2thYmxlID0gaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkO1xuICAgIGNvbnN0IGhvdmVyZWRPYmplY3QgPSB0aGlzLmhhc0hvdmVyZWRPYmplY3Qob2JqZWN0SG92ZXJlZCk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IERlY2tHTEdlb0pzb25MYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5sYXllclByb3BzLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBwaWNrYWJsZSxcbiAgICAgICAgaGlnaGxpZ2h0Q29sb3I6IEhJR0hMSUdIX0NPTE9SXzNELFxuICAgICAgICBhdXRvSGlnaGxpZ2h0OiB2aXNDb25maWcuZW5hYmxlM2QgJiYgcGlja2FibGUsXG4gICAgICAgIHN0cm9rZWQ6IHZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBmaWxsZWQ6IHZpc0NvbmZpZy5maWxsZWQsXG4gICAgICAgIGV4dHJ1ZGVkOiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIHdpcmVmcmFtZTogdmlzQ29uZmlnLndpcmVmcmFtZSxcbiAgICAgICAgd3JhcExvbmdpdHVkZTogZmFsc2UsXG4gICAgICAgIGxpbmVNaXRlckxpbWl0OiAyLFxuICAgICAgICByb3VuZGVkOiB0cnVlLFxuICAgICAgICB1cGRhdGVUcmlnZ2VycyxcbiAgICAgICAgX3N1YkxheWVyUHJvcHM6IHtcbiAgICAgICAgICAuLi4oZmVhdHVyZVR5cGVzLnBvbHlnb24gPyB7J3BvbHlnb25zLXN0cm9rZSc6IG9wYU92ZXJ3cml0ZX0gOiB7fSksXG4gICAgICAgICAgLi4uKGZlYXR1cmVUeXBlcy5saW5lID8geydsaW5lLXN0cmluZ3MnOiBvcGFPdmVyd3JpdGV9IDoge30pLFxuICAgICAgICAgIC4uLihmZWF0dXJlVHlwZXMucG9pbnRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHBvaW50czoge1xuICAgICAgICAgICAgICAgICAgbGluZU9wYWNpdHk6IHZpc0NvbmZpZy5zdHJva2VPcGFjaXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHt9KVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIC4uLihob3ZlcmVkT2JqZWN0ICYmICF2aXNDb25maWcuZW5hYmxlM2RcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgRGVja0dMR2VvSnNvbkxheWVyKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCksXG4gICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgIHdyYXBMb25naXR1ZGU6IGZhbHNlLFxuICAgICAgICAgICAgICBkYXRhOiBbaG92ZXJlZE9iamVjdF0sXG4gICAgICAgICAgICAgIGdldExpbmVXaWR0aDogZGF0YS5nZXRMaW5lV2lkdGgsXG4gICAgICAgICAgICAgIGdldFJhZGl1czogZGF0YS5nZXRSYWRpdXMsXG4gICAgICAgICAgICAgIGdldEVsZXZhdGlvbjogZGF0YS5nZXRFbGV2YXRpb24sXG4gICAgICAgICAgICAgIGdldExpbmVDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIC8vIGFsd2F5cyBkcmF3IG91dGxpbmVcbiAgICAgICAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgZmlsbGVkOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19