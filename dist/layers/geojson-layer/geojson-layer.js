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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _typeAnalyzer = require("type-analyzer");

var _baseLayer = _interopRequireWildcard(require("../base-layer"));

var _layers = require("@deck.gl/layers");

var _colorUtils = require("../../utils/color-utils");

var _geojsonUtils = require("./geojson-utils");

var _geojsonLayerIcon = _interopRequireDefault(require("./geojson-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _layerFactory = require("../layer-factory");

var _SUPPORTED_ANALYZER_T;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SUPPORTED_ANALYZER_TYPES = (_SUPPORTED_ANALYZER_T = {}, (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.GEOMETRY, true), (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.GEOMETRY_FROM_STRING, true), (0, _defineProperty2["default"])(_SUPPORTED_ANALYZER_T, _typeAnalyzer.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING, true), _SUPPORTED_ANALYZER_T);
var geojsonVisConfigs = {
  opacity: 'opacity',
  strokeOpacity: _objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, {
    property: 'strokeOpacity'
  }),
  thickness: _objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, {
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
};

exports.featureAccessor = featureAccessor;
var defaultElevation = 500;
exports.defaultElevation = defaultElevation;
var defaultLineWidth = 1;
exports.defaultLineWidth = defaultLineWidth;
var defaultRadius = 1;
exports.defaultRadius = defaultRadius;

var GeoJsonLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(GeoJsonLayer, _Layer);

  function GeoJsonLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, GeoJsonLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GeoJsonLayer).call(this, props));
    _this.dataToFeature = [];

    _this.registerVisConfig(geojsonVisConfigs);

    _this.getPositionAccessor = function () {
      return featureAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(GeoJsonLayer, [{
    key: "getPositionAccessor",
    value: function getPositionAccessor() {
      return this.getFeature(this.config.columns);
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(GeoJsonLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
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
    } // TODO: fix complexity

    /* eslint-disable complexity */

  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _this3 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorField = _this$config.colorField,
          colorDomain = _this$config.colorDomain,
          strokeColorField = _this$config.strokeColorField,
          strokeColorScale = _this$config.strokeColorScale,
          strokeColorDomain = _this$config.strokeColorDomain,
          color = _this$config.color,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          sizeField = _this$config.sizeField,
          heightField = _this$config.heightField,
          heightDomain = _this$config.heightDomain,
          heightScale = _this$config.heightScale,
          radiusField = _this$config.radiusField,
          radiusDomain = _this$config.radiusDomain,
          radiusScale = _this$config.radiusScale,
          visConfig = _this$config.visConfig;
      var enable3d = visConfig.enable3d,
          stroked = visConfig.stroked,
          colorRange = visConfig.colorRange,
          heightRange = visConfig.heightRange,
          sizeRange = visConfig.sizeRange,
          radiusRange = visConfig.radiusRange,
          strokeColorRange = visConfig.strokeColorRange,
          strokeColor = visConfig.strokeColor;
      var _datasets$this$config = datasets[this.config.dataId],
          allData = _datasets$this$config.allData,
          gpuFilter = _datasets$this$config.gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data; // fill color


      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // stroke color

      var scScale = strokeColorField && this.getVisChannelScale(strokeColorScale, strokeColorDomain, strokeColorRange.colors.map(_colorUtils.hexToRgb)); // calculate stroke scale - if stroked = true

      var sScale = sizeField && stroked && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange); // calculate elevation scale - if extruded = true

      var eScale = heightField && enable3d && this.getVisChannelScale(heightScale, heightDomain, heightRange); // point radius

      var rScale = radiusField && this.getVisChannelScale(radiusScale, radiusDomain, radiusRange); // access feature properties from geojson sub layer

      var getDataForGpuFilter = function getDataForGpuFilter(f) {
        return allData[f.properties.index];
      };

      var getIndexForGpuFilter = function getIndexForGpuFilter(f) {
        return f.properties.index;
      };

      return {
        data: data,
        getFilterValue: gpuFilter.filterValueAccessor(getIndexForGpuFilter, getDataForGpuFilter),
        getFillColor: function getFillColor(d) {
          return cScale ? _this3.getEncodedChannelValue(cScale, allData[d.properties.index], colorField) : d.properties.fillColor || color;
        },
        getLineColor: function getLineColor(d) {
          return scScale ? _this3.getEncodedChannelValue(scScale, allData[d.properties.index], strokeColorField) : d.properties.lineColor || strokeColor || color;
        },
        getLineWidth: function getLineWidth(d) {
          return sScale ? _this3.getEncodedChannelValue(sScale, allData[d.properties.index], sizeField, 0) : d.properties.lineWidth || defaultLineWidth;
        },
        getElevation: function getElevation(d) {
          return eScale ? _this3.getEncodedChannelValue(eScale, allData[d.properties.index], heightField, 0) : d.properties.elevation || defaultElevation;
        },
        getRadius: function getRadius(d) {
          return rScale ? _this3.getEncodedChannelValue(rScale, allData[d.properties.index], radiusField, 0) : d.properties.radius || defaultRadius;
        }
      };
    }
    /* eslint-enable complexity */

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
    value: function setInitialLayerConfig(allData) {
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
          mapState = opts.mapState;
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
      var updateTriggers = {
        getElevation: {
          heightField: this.config.heightField,
          heightScaleType: this.config.heightScale,
          heightRange: visConfig.heightRange
        },
        getFillColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: visConfig.colorRange,
          colorScale: this.config.colorScale
        },
        getLineColor: {
          color: visConfig.strokeColor,
          colorField: this.config.strokeColorField,
          colorRange: visConfig.strokeColorRange,
          colorScale: this.config.strokeColorScale
        },
        getLineWidth: {
          sizeField: this.config.sizeField,
          sizeRange: visConfig.sizeRange
        },
        getRadius: {
          radiusField: this.config.radiusField,
          radiusRange: visConfig.radiusRange
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var opaOverwrite = {
        opacity: visConfig.strokeOpacity
      };
      return [new _layers.GeoJsonLayer(_objectSpread({}, defaultLayerProps, {}, layerProps, {}, data, {
        highlightColor: _defaultSettings.HIGHLIGH_COLOR_3D,
        autoHighlight: visConfig.enable3d,
        stroked: visConfig.stroked,
        filled: visConfig.filled,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        wrapLongitude: false,
        lineMiterLimit: 2,
        rounded: true,
        updateTriggers: updateTriggers,
        _subLayerProps: _objectSpread({}, featureTypes.polygon ? {
          'polygons-stroke': opaOverwrite
        } : {}, {}, featureTypes.line ? {
          'line-strings': opaOverwrite
        } : {}, {}, featureTypes.point ? {
          points: {
            lineOpacity: visConfig.strokeOpacity
          }
        } : {})
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _layers.GeoJsonLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {}, layerProps, {
        wrapLongitude: false,
        data: [objectHovered.object],
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
  }, {
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
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(GeoJsonLayer.prototype), "visualChannels", this), {
        strokeColor: {
          property: 'strokeColor',
          field: 'strokeColorField',
          scale: 'strokeColorScale',
          domain: 'strokeColorDomain',
          range: 'strokeColorRange',
          key: 'strokeColor',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color,
          condition: function condition(config) {
            return config.visConfig.stroked;
          }
        },
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(GeoJsonLayer.prototype), "visualChannels", this).size, {
          property: 'stroke',
          condition: function condition(config) {
            return config.visConfig.stroked;
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
          condition: function condition(config) {
            return config.visConfig.enable3d;
          }
        },
        radius: {
          property: 'radius',
          field: 'radiusField',
          scale: 'radiusScale',
          domain: 'radiusDomain',
          range: 'radiusRange',
          key: 'radius',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.radius
        }
      });
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _this4 = this;

      var label = _ref3.label,
          _ref3$fields = _ref3.fields,
          fields = _ref3$fields === void 0 ? [] : _ref3$fields;
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
            label: typeof label === 'string' && label.replace(/\.[^/.]+$/, '') || _this4.type,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIlNVUFBPUlRFRF9BTkFMWVpFUl9UWVBFUyIsIkRBVEFfVFlQRVMiLCJHRU9NRVRSWSIsIkdFT01FVFJZX0ZST01fU1RSSU5HIiwiUEFJUl9HRU9NRVRSWV9GUk9NX1NUUklORyIsImdlb2pzb25WaXNDb25maWdzIiwib3BhY2l0eSIsInN0cm9rZU9wYWNpdHkiLCJMQVlFUl9WSVNfQ09ORklHUyIsInByb3BlcnR5IiwidGhpY2tuZXNzIiwiZGVmYXVsdFZhbHVlIiwic3Ryb2tlQ29sb3IiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInJhZGl1cyIsInNpemVSYW5nZSIsInJhZGl1c1JhbmdlIiwiaGVpZ2h0UmFuZ2UiLCJlbGV2YXRpb25TY2FsZSIsInN0cm9rZWQiLCJmaWxsZWQiLCJlbmFibGUzZCIsIndpcmVmcmFtZSIsImdlb0pzb25SZXF1aXJlZENvbHVtbnMiLCJmZWF0dXJlQWNjZXNzb3IiLCJnZW9qc29uIiwiZCIsImZpZWxkSWR4IiwiZGVmYXVsdEVsZXZhdGlvbiIsImRlZmF1bHRMaW5lV2lkdGgiLCJkZWZhdWx0UmFkaXVzIiwiR2VvSnNvbkxheWVyIiwicHJvcHMiLCJkYXRhVG9GZWF0dXJlIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImdldEZlYXR1cmUiLCJoZWlnaHRGaWVsZCIsImhlaWdodERvbWFpbiIsImhlaWdodFNjYWxlIiwicmFkaXVzRmllbGQiLCJyYWRpdXNEb21haW4iLCJyYWRpdXNTY2FsZSIsInN0cm9rZUNvbG9yRmllbGQiLCJzdHJva2VDb2xvckRvbWFpbiIsInN0cm9rZUNvbG9yU2NhbGUiLCJvYmplY3QiLCJhbGxEYXRhIiwicHJvcGVydGllcyIsImluZGV4IiwiZ2V0UG9zaXRpb24iLCJmaWx0ZXJlZEluZGV4IiwibWFwIiwiaSIsImZpbHRlciIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29sb3JTY2FsZSIsImNvbG9yRmllbGQiLCJjb2xvckRvbWFpbiIsImNvbG9yIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsImRhdGFJZCIsImdwdUZpbHRlciIsInVwZGF0ZURhdGEiLCJkYXRhIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwiaGV4VG9SZ2IiLCJzY1NjYWxlIiwic1NjYWxlIiwiZVNjYWxlIiwiclNjYWxlIiwiZ2V0RGF0YUZvckdwdUZpbHRlciIsImYiLCJnZXRJbmRleEZvckdwdUZpbHRlciIsImdldEZpbHRlclZhbHVlIiwiZmlsdGVyVmFsdWVBY2Nlc3NvciIsImdldEZpbGxDb2xvciIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJmaWxsQ29sb3IiLCJnZXRMaW5lQ29sb3IiLCJsaW5lQ29sb3IiLCJnZXRMaW5lV2lkdGgiLCJsaW5lV2lkdGgiLCJnZXRFbGV2YXRpb24iLCJlbGV2YXRpb24iLCJnZXRSYWRpdXMiLCJib3VuZHMiLCJmaXhlZFJhZGl1cyIsIkJvb2xlYW4iLCJmaW5kIiwiZmVhdHVyZVR5cGVzIiwidXBkYXRlTWV0YSIsInVwZGF0ZUxheWVyTWV0YSIsIm1ldGEiLCJwb2x5Z29uIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJjb2xvck1ha2VyIiwibmV4dCIsInZhbHVlIiwicG9pbnQiLCJvcHRzIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiZ2V0UmFkaXVzU2NhbGVCeVpvb20iLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsImVsZVpvb21GYWN0b3IiLCJnZXRFbGV2YXRpb25ab29tRmFjdG9yIiwibGF5ZXJQcm9wcyIsImxpbmVXaWR0aFNjYWxlIiwicG9pbnRSYWRpdXNTY2FsZSIsImxpbmVNaXRlckxpbWl0IiwidXBkYXRlVHJpZ2dlcnMiLCJoZWlnaHRTY2FsZVR5cGUiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZGVmYXVsdExheWVyUHJvcHMiLCJnZXREZWZhdWx0RGVja0xheWVyUHJvcHMiLCJvcGFPdmVyd3JpdGUiLCJEZWNrR0xHZW9Kc29uTGF5ZXIiLCJoaWdobGlnaHRDb2xvciIsIkhJR0hMSUdIX0NPTE9SXzNEIiwiYXV0b0hpZ2hsaWdodCIsImV4dHJ1ZGVkIiwid3JhcExvbmdpdHVkZSIsInJvdW5kZWQiLCJfc3ViTGF5ZXJQcm9wcyIsImxpbmUiLCJwb2ludHMiLCJsaW5lT3BhY2l0eSIsImlzTGF5ZXJIb3ZlcmVkIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsIkdlb2pzb25MYXllckljb24iLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIiwiQ0hBTk5FTF9TQ0FMRVMiLCJjb25kaXRpb24iLCJzaXplIiwiaGVpZ2h0IiwibGFiZWwiLCJmaWVsZHMiLCJnZW9qc29uQ29sdW1ucyIsInR5cGUiLCJhbmFseXplclR5cGUiLCJuYW1lIiwiZGVmYXVsdENvbHVtbnMiLCJHRU9KU09OX0ZJRUxEUyIsImZvdW5kQ29sdW1ucyIsImZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJsZW5ndGgiLCJyZXBsYWNlIiwiaXNWaXNpYmxlIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSx3QkFBd0Isd0ZBQzNCQyx5QkFBV0MsUUFEZ0IsRUFDTCxJQURLLDJEQUUzQkQseUJBQVdFLG9CQUZnQixFQUVPLElBRlAsMkRBRzNCRix5QkFBV0cseUJBSGdCLEVBR1ksSUFIWix5QkFBOUI7QUFNTyxJQUFNQyxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsT0FBTyxFQUFFLFNBRHNCO0FBRS9CQyxFQUFBQSxhQUFhLG9CQUNSQyxnQ0FBa0JGLE9BRFY7QUFF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T0FBdkI7QUFJQSxVQUFNTSxZQUFZLEdBQUcsS0FBS0Msc0JBQUwsQ0FBNEJILGNBQTVCLEVBQTRDTCxNQUE1QyxDQUFyQjs7QUFDQSxVQUFJLENBQUNPLFlBQUQsSUFBaUIsQ0FBQ0EsWUFBWSxDQUFDRSxNQUFuQyxFQUEyQztBQUN6QyxlQUFPO0FBQUNqSSxVQUFBQSxLQUFLLEVBQUU7QUFBUixTQUFQO0FBQ0Q7O0FBRUQsYUFBTztBQUNMQSxRQUFBQSxLQUFLLEVBQUUrSCxZQUFZLENBQUN6RyxHQUFiLENBQWlCLFVBQUFqQixPQUFPO0FBQUEsaUJBQUs7QUFDbENrSCxZQUFBQSxLQUFLLEVBQUcsT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUE2QkEsS0FBSyxDQUFDVyxPQUFOLENBQWMsV0FBZCxFQUEyQixFQUEzQixDQUE5QixJQUFpRSxNQUFJLENBQUNSLElBRDNDO0FBRWxDckgsWUFBQUEsT0FBTyxFQUFQQSxPQUZrQztBQUdsQzhILFlBQUFBLFNBQVMsRUFBRTtBQUh1QixXQUFMO0FBQUEsU0FBeEI7QUFERixPQUFQO0FBT0Q7OztFQTFGdUNDLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHtEQVRBX1RZUEVTfSBmcm9tICd0eXBlLWFuYWx5emVyJztcblxuaW1wb3J0IExheWVyLCB7Y29sb3JNYWtlcn0gZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQge0dlb0pzb25MYXllciBhcyBEZWNrR0xHZW9Kc29uTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2dldEdlb2pzb25EYXRhTWFwcywgZ2V0R2VvanNvbkJvdW5kcywgZ2V0R2VvanNvbkZlYXR1cmVUeXBlc30gZnJvbSAnLi9nZW9qc29uLXV0aWxzJztcbmltcG9ydCBHZW9qc29uTGF5ZXJJY29uIGZyb20gJy4vZ2VvanNvbi1sYXllci1pY29uJztcbmltcG9ydCB7R0VPSlNPTl9GSUVMRFMsIEhJR0hMSUdIX0NPTE9SXzNELCBDSEFOTkVMX1NDQUxFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtMQVlFUl9WSVNfQ09ORklHU30gZnJvbSAnbGF5ZXJzL2xheWVyLWZhY3RvcnknO1xuXG5jb25zdCBTVVBQT1JURURfQU5BTFlaRVJfVFlQRVMgPSB7XG4gIFtEQVRBX1RZUEVTLkdFT01FVFJZXTogdHJ1ZSxcbiAgW0RBVEFfVFlQRVMuR0VPTUVUUllfRlJPTV9TVFJJTkddOiB0cnVlLFxuICBbREFUQV9UWVBFUy5QQUlSX0dFT01FVFJZX0ZST01fU1RSSU5HXTogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IGdlb2pzb25WaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5LFxuICAgIHByb3BlcnR5OiAnc3Ryb2tlT3BhY2l0eSdcbiAgfSxcbiAgdGhpY2tuZXNzOiB7XG4gICAgLi4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzLFxuICAgIGRlZmF1bHRWYWx1ZTogMC41XG4gIH0sXG4gIHN0cm9rZUNvbG9yOiAnc3Ryb2tlQ29sb3InLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHN0cm9rZUNvbG9yUmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgcmFkaXVzOiAncmFkaXVzJyxcblxuICBzaXplUmFuZ2U6ICdzdHJva2VXaWR0aFJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gIGhlaWdodFJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuICBlbGV2YXRpb25TY2FsZTogJ2VsZXZhdGlvblNjYWxlJyxcbiAgc3Ryb2tlZDogJ3N0cm9rZWQnLFxuICBmaWxsZWQ6ICdmaWxsZWQnLFxuICBlbmFibGUzZDogJ2VuYWJsZTNkJyxcbiAgd2lyZWZyYW1lOiAnd2lyZWZyYW1lJ1xufTtcblxuZXhwb3J0IGNvbnN0IGdlb0pzb25SZXF1aXJlZENvbHVtbnMgPSBbJ2dlb2pzb24nXTtcbmV4cG9ydCBjb25zdCBmZWF0dXJlQWNjZXNzb3IgPSAoe2dlb2pzb259KSA9PiBkID0+IGRbZ2VvanNvbi5maWVsZElkeF07XG5leHBvcnQgY29uc3QgZGVmYXVsdEVsZXZhdGlvbiA9IDUwMDtcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGluZVdpZHRoID0gMTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0UmFkaXVzID0gMTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VvSnNvbkxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IFtdO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoZ2VvanNvblZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IGZlYXR1cmVBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnZ2VvanNvbic7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gJ1BvbHlnb24nO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gR2VvanNvbkxheWVySWNvbjtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gZ2VvSnNvblJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzdHJva2VDb2xvcjoge1xuICAgICAgICBwcm9wZXJ0eTogJ3N0cm9rZUNvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdzdHJva2VDb2xvckZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzdHJva2VDb2xvclNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnc3Ryb2tlQ29sb3JEb21haW4nLFxuICAgICAgICByYW5nZTogJ3N0cm9rZUNvbG9yUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzdHJva2VDb2xvcicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZWRcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkXG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiB7XG4gICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcbiAgICAgICAgZmllbGQ6ICdoZWlnaHRGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnaGVpZ2h0U2NhbGUnLFxuICAgICAgICBkb21haW46ICdoZWlnaHREb21haW4nLFxuICAgICAgICByYW5nZTogJ2hlaWdodFJhbmdlJyxcbiAgICAgICAga2V5OiAnaGVpZ2h0JyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZSxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgfSxcbiAgICAgIHJhZGl1czoge1xuICAgICAgICBwcm9wZXJ0eTogJ3JhZGl1cycsXG4gICAgICAgIGZpZWxkOiAncmFkaXVzRmllbGQnLFxuICAgICAgICBzY2FsZTogJ3JhZGl1c1NjYWxlJyxcbiAgICAgICAgZG9tYWluOiAncmFkaXVzRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gICAgICAgIGtleTogJ3JhZGl1cycsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnJhZGl1c1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRQb3NpdGlvbkFjY2Vzc29yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZlYXR1cmUodGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtsYWJlbCwgZmllbGRzID0gW119KSB7XG4gICAgY29uc3QgZ2VvanNvbkNvbHVtbnMgPSBmaWVsZHNcbiAgICAgIC5maWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdnZW9qc29uJyAmJiBTVVBQT1JURURfQU5BTFlaRVJfVFlQRVNbZi5hbmFseXplclR5cGVdKVxuICAgICAgLm1hcChmID0+IGYubmFtZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0Q29sdW1ucyA9IHtcbiAgICAgIGdlb2pzb246IHVuaXEoWy4uLkdFT0pTT05fRklFTERTLmdlb2pzb24sIC4uLmdlb2pzb25Db2x1bW5zXSlcbiAgICB9O1xuXG4gICAgY29uc3QgZm91bmRDb2x1bW5zID0gdGhpcy5maW5kRGVmYXVsdENvbHVtbkZpZWxkKGRlZmF1bHRDb2x1bW5zLCBmaWVsZHMpO1xuICAgIGlmICghZm91bmRDb2x1bW5zIHx8ICFmb3VuZENvbHVtbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge3Byb3BzOiBbXX07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3BzOiBmb3VuZENvbHVtbnMubWFwKGNvbHVtbnMgPT4gKHtcbiAgICAgICAgbGFiZWw6ICh0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnICYmIGxhYmVsLnJlcGxhY2UoL1xcLlteLy5dKyQvLCAnJykpIHx8IHRoaXMudHlwZSxcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgaXNWaXNpYmxlOiB0cnVlXG4gICAgICB9KSlcbiAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzID0ge30pIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIuZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzKSxcblxuICAgICAgLy8gYWRkIGhlaWdodCB2aXN1YWwgY2hhbm5lbFxuICAgICAgaGVpZ2h0RmllbGQ6IG51bGwsXG4gICAgICBoZWlnaHREb21haW46IFswLCAxXSxcbiAgICAgIGhlaWdodFNjYWxlOiAnbGluZWFyJyxcblxuICAgICAgLy8gYWRkIHJhZGl1cyB2aXN1YWwgY2hhbm5lbFxuICAgICAgcmFkaXVzRmllbGQ6IG51bGwsXG4gICAgICByYWRpdXNEb21haW46IFswLCAxXSxcbiAgICAgIHJhZGl1c1NjYWxlOiAnbGluZWFyJyxcblxuICAgICAgLy8gYWRkIHN0cm9rZSBjb2xvciB2aXN1YWwgY2hhbm5lbFxuICAgICAgc3Ryb2tlQ29sb3JGaWVsZDogbnVsbCxcbiAgICAgIHN0cm9rZUNvbG9yRG9tYWluOiBbMCwgMV0sXG4gICAgICBzdHJva2VDb2xvclNjYWxlOiAncXVhbnRpbGUnXG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEpIHtcbiAgICAvLyBpbmRleCBvZiBhbGxEYXRhIGlzIHNhdmVkIHRvIGZlYXR1cmUucHJvcGVydGllc1xuICAgIHJldHVybiBhbGxEYXRhW29iamVjdC5wcm9wZXJ0aWVzLmluZGV4XTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXh9LCBnZXRQb3NpdGlvbikge1xuICAgIHJldHVybiBmaWx0ZXJlZEluZGV4Lm1hcChpID0+IHRoaXMuZGF0YVRvRmVhdHVyZVtpXSkuZmlsdGVyKGQgPT4gZCk7XG4gIH1cbiAgLy8gVE9ETzogZml4IGNvbXBsZXhpdHlcbiAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgc3Ryb2tlQ29sb3JGaWVsZCxcbiAgICAgIHN0cm9rZUNvbG9yU2NhbGUsXG4gICAgICBzdHJva2VDb2xvckRvbWFpbixcbiAgICAgIGNvbG9yLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIGhlaWdodEZpZWxkLFxuICAgICAgaGVpZ2h0RG9tYWluLFxuICAgICAgaGVpZ2h0U2NhbGUsXG4gICAgICByYWRpdXNGaWVsZCxcbiAgICAgIHJhZGl1c0RvbWFpbixcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgdmlzQ29uZmlnXG4gICAgfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgZW5hYmxlM2QsXG4gICAgICBzdHJva2VkLFxuICAgICAgY29sb3JSYW5nZSxcbiAgICAgIGhlaWdodFJhbmdlLFxuICAgICAgc2l6ZVJhbmdlLFxuICAgICAgcmFkaXVzUmFuZ2UsXG4gICAgICBzdHJva2VDb2xvclJhbmdlLFxuICAgICAgc3Ryb2tlQ29sb3JcbiAgICB9ID0gdmlzQ29uZmlnO1xuXG4gICAgY29uc3Qge2FsbERhdGEsIGdwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcblxuICAgIC8vIGZpbGwgY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoY29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYikpO1xuXG4gICAgLy8gc3Ryb2tlIGNvbG9yXG4gICAgY29uc3Qgc2NTY2FsZSA9XG4gICAgICBzdHJva2VDb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgc3Ryb2tlQ29sb3JTY2FsZSxcbiAgICAgICAgc3Ryb2tlQ29sb3JEb21haW4sXG4gICAgICAgIHN0cm9rZUNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICAgICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgc3Ryb2tlIHNjYWxlIC0gaWYgc3Ryb2tlZCA9IHRydWVcbiAgICBjb25zdCBzU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmIHN0cm9rZWQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoc2l6ZVNjYWxlLCBzaXplRG9tYWluLCBzaXplUmFuZ2UpO1xuXG4gICAgLy8gY2FsY3VsYXRlIGVsZXZhdGlvbiBzY2FsZSAtIGlmIGV4dHJ1ZGVkID0gdHJ1ZVxuICAgIGNvbnN0IGVTY2FsZSA9XG4gICAgICBoZWlnaHRGaWVsZCAmJiBlbmFibGUzZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShoZWlnaHRTY2FsZSwgaGVpZ2h0RG9tYWluLCBoZWlnaHRSYW5nZSk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPSByYWRpdXNGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShyYWRpdXNTY2FsZSwgcmFkaXVzRG9tYWluLCByYWRpdXNSYW5nZSk7XG5cbiAgICAvLyBhY2Nlc3MgZmVhdHVyZSBwcm9wZXJ0aWVzIGZyb20gZ2VvanNvbiBzdWIgbGF5ZXJcbiAgICBjb25zdCBnZXREYXRhRm9yR3B1RmlsdGVyID0gZiA9PiBhbGxEYXRhW2YucHJvcGVydGllcy5pbmRleF07XG4gICAgY29uc3QgZ2V0SW5kZXhGb3JHcHVGaWx0ZXIgPSBmID0+IGYucHJvcGVydGllcy5pbmRleDtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKGdldEluZGV4Rm9yR3B1RmlsdGVyLCBnZXREYXRhRm9yR3B1RmlsdGVyKSxcbiAgICAgIGdldEZpbGxDb2xvcjogZCA9PlxuICAgICAgICBjU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgY29sb3JGaWVsZClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5maWxsQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRMaW5lQ29sb3I6IGQgPT5cbiAgICAgICAgc2NTY2FsZVxuICAgICAgICAgID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNjU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgc3Ryb2tlQ29sb3JGaWVsZClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5saW5lQ29sb3IgfHwgc3Ryb2tlQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRMaW5lV2lkdGg6IGQgPT5cbiAgICAgICAgc1NjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoc1NjYWxlLCBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sIHNpemVGaWVsZCwgMClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5saW5lV2lkdGggfHwgZGVmYXVsdExpbmVXaWR0aCxcbiAgICAgIGdldEVsZXZhdGlvbjogZCA9PlxuICAgICAgICBlU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShlU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgaGVpZ2h0RmllbGQsIDApXG4gICAgICAgICAgOiBkLnByb3BlcnRpZXMuZWxldmF0aW9uIHx8IGRlZmF1bHRFbGV2YXRpb24sXG4gICAgICBnZXRSYWRpdXM6IGQgPT5cbiAgICAgICAgclNjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoclNjYWxlLCBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sIHJhZGl1c0ZpZWxkLCAwKVxuICAgICAgICAgIDogZC5wcm9wZXJ0aWVzLnJhZGl1cyB8fCBkZWZhdWx0UmFkaXVzXG4gICAgfTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSkge1xuICAgIGNvbnN0IGdldEZlYXR1cmUgPSB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSBnZXRHZW9qc29uRGF0YU1hcHMoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG5cbiAgICAvLyBnZXQgYm91bmRzIGZyb20gZmVhdHVyZXNcbiAgICBjb25zdCBib3VuZHMgPSBnZXRHZW9qc29uQm91bmRzKHRoaXMuZGF0YVRvRmVhdHVyZSk7XG4gICAgLy8gaWYgYW55IG9mIHRoZSBmZWF0dXJlIGhhcyBwcm9wZXJ0aWVzLnJhZGl1cyBzZXQgdG8gYmUgdHJ1ZVxuICAgIGNvbnN0IGZpeGVkUmFkaXVzID0gQm9vbGVhbihcbiAgICAgIHRoaXMuZGF0YVRvRmVhdHVyZS5maW5kKGQgPT4gZCAmJiBkLnByb3BlcnRpZXMgJiYgZC5wcm9wZXJ0aWVzLnJhZGl1cylcbiAgICApO1xuXG4gICAgLy8ga2VlcCBhIHJlY29yZCBvZiB3aGF0IHR5cGUgb2YgZ2VvbWV0cnkgdGhlIGNvbGxlY3Rpb24gaGFzXG4gICAgY29uc3QgZmVhdHVyZVR5cGVzID0gZ2V0R2VvanNvbkZlYXR1cmVUeXBlcyh0aGlzLmRhdGFUb0ZlYXR1cmUpO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHMsIGZpeGVkUmFkaXVzLCBmZWF0dXJlVHlwZXN9KTtcbiAgfVxuXG4gIHNldEluaXRpYWxMYXllckNvbmZpZyhhbGxEYXRhKSB7XG4gICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSk7XG5cbiAgICBjb25zdCB7ZmVhdHVyZVR5cGVzfSA9IHRoaXMubWV0YTtcbiAgICAvLyBkZWZhdWx0IHNldHRpbmdzIGlzIHN0cm9rZTogdHJ1ZSwgZmlsbGVkOiBmYWxzZVxuICAgIGlmIChmZWF0dXJlVHlwZXMgJiYgZmVhdHVyZVR5cGVzLnBvbHlnb24pIHtcbiAgICAgIC8vIHNldCBib3RoIGZpbGwgYW5kIHN0cm9rZSB0byB0cnVlXG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVMYXllclZpc0NvbmZpZyh7XG4gICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGNvbG9yTWFrZXIubmV4dCgpLnZhbHVlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGZlYXR1cmVUeXBlcyAmJiBmZWF0dXJlVHlwZXMucG9pbnQpIHtcbiAgICAgIC8vIHNldCBmaWxsIHRvIHRydWUgaWYgZGV0ZWN0IHBvaW50XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVMYXllclZpc0NvbmZpZyh7ZmlsbGVkOiB0cnVlLCBzdHJva2VkOiBmYWxzZX0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlfSA9IG9wdHM7XG5cbiAgICBjb25zdCB7Zml4ZWRSYWRpdXMsIGZlYXR1cmVUeXBlc30gPSB0aGlzLm1ldGE7XG4gICAgY29uc3QgcmFkaXVzU2NhbGUgPSB0aGlzLmdldFJhZGl1c1NjYWxlQnlab29tKG1hcFN0YXRlLCBmaXhlZFJhZGl1cyk7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZSk7XG4gICAgY29uc3QgZWxlWm9vbUZhY3RvciA9IHRoaXMuZ2V0RWxldmF0aW9uWm9vbUZhY3RvcihtYXBTdGF0ZSk7XG5cbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgY29uc3QgbGF5ZXJQcm9wcyA9IHtcbiAgICAgIGxpbmVXaWR0aFNjYWxlOiB2aXNDb25maWcudGhpY2tuZXNzICogem9vbUZhY3RvciAqIDgsXG4gICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHJhZGl1c1NjYWxlLFxuICAgICAgbGluZU1pdGVyTGltaXQ6IDRcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRFbGV2YXRpb246IHtcbiAgICAgICAgaGVpZ2h0RmllbGQ6IHRoaXMuY29uZmlnLmhlaWdodEZpZWxkLFxuICAgICAgICBoZWlnaHRTY2FsZVR5cGU6IHRoaXMuY29uZmlnLmhlaWdodFNjYWxlLFxuICAgICAgICBoZWlnaHRSYW5nZTogdmlzQ29uZmlnLmhlaWdodFJhbmdlXG4gICAgICB9LFxuICAgICAgZ2V0RmlsbENvbG9yOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbmZpZy5jb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgY29sb3JSYW5nZTogdmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRMaW5lQ29sb3I6IHtcbiAgICAgICAgY29sb3I6IHZpc0NvbmZpZy5zdHJva2VDb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuc3Ryb2tlQ29sb3JGaWVsZCxcbiAgICAgICAgY29sb3JSYW5nZTogdmlzQ29uZmlnLnN0cm9rZUNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLnN0cm9rZUNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRMaW5lV2lkdGg6IHtcbiAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICAgIHNpemVSYW5nZTogdmlzQ29uZmlnLnNpemVSYW5nZVxuICAgICAgfSxcbiAgICAgIGdldFJhZGl1czoge1xuICAgICAgICByYWRpdXNGaWVsZDogdGhpcy5jb25maWcucmFkaXVzRmllbGQsXG4gICAgICAgIHJhZGl1c1JhbmdlOiB2aXNDb25maWcucmFkaXVzUmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICB9O1xuXG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcbiAgICBjb25zdCBvcGFPdmVyd3JpdGUgPSB7XG4gICAgICBvcGFjaXR5OiB2aXNDb25maWcuc3Ryb2tlT3BhY2l0eVxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IERlY2tHTEdlb0pzb25MYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5sYXllclByb3BzLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBoaWdobGlnaHRDb2xvcjogSElHSExJR0hfQ09MT1JfM0QsXG4gICAgICAgIGF1dG9IaWdobGlnaHQ6IHZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgc3Ryb2tlZDogdmlzQ29uZmlnLnN0cm9rZWQsXG4gICAgICAgIGZpbGxlZDogdmlzQ29uZmlnLmZpbGxlZCxcbiAgICAgICAgZXh0cnVkZWQ6IHZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgd2lyZWZyYW1lOiB2aXNDb25maWcud2lyZWZyYW1lLFxuICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZSxcbiAgICAgICAgbGluZU1pdGVyTGltaXQ6IDIsXG4gICAgICAgIHJvdW5kZWQ6IHRydWUsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAgIC4uLihmZWF0dXJlVHlwZXMucG9seWdvbiA/IHsncG9seWdvbnMtc3Ryb2tlJzogb3BhT3ZlcndyaXRlfSA6IHt9KSxcbiAgICAgICAgICAuLi4oZmVhdHVyZVR5cGVzLmxpbmUgPyB7J2xpbmUtc3RyaW5ncyc6IG9wYU92ZXJ3cml0ZX0gOiB7fSksXG4gICAgICAgICAgLi4uKGZlYXR1cmVUeXBlcy5wb2ludFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgcG9pbnRzOiB7XG4gICAgICAgICAgICAgICAgICBsaW5lT3BhY2l0eTogdmlzQ29uZmlnLnN0cm9rZU9wYWNpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDoge30pXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZCkgJiYgIXZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBEZWNrR0xHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgICAgICAgd3JhcExvbmdpdHVkZTogZmFsc2UsXG4gICAgICAgICAgICAgIGRhdGE6IFtvYmplY3RIb3ZlcmVkLm9iamVjdF0sXG4gICAgICAgICAgICAgIGdldExpbmVXaWR0aDogZGF0YS5nZXRMaW5lV2lkdGgsXG4gICAgICAgICAgICAgIGdldFJhZGl1czogZGF0YS5nZXRSYWRpdXMsXG4gICAgICAgICAgICAgIGdldEVsZXZhdGlvbjogZGF0YS5nZXRFbGV2YXRpb24sXG4gICAgICAgICAgICAgIGdldExpbmVDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIC8vIGFsd2F5cyBkcmF3IG91dGxpbmVcbiAgICAgICAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgZmlsbGVkOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19