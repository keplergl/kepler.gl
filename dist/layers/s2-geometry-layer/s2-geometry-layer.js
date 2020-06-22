"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.S2VisConfigs = exports.defaultLineWidth = exports.defaultElevation = exports.S2TokenAccessor = exports.s2RequiredColumns = exports.S2_TOKEN_FIELDS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _geoLayers = require("@deck.gl/geo-layers");

var _colorUtils = require("../../utils/color-utils");

var _defaultSettings = require("../../constants/default-settings");

var _layerFactory = require("../layer-factory");

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _s2LayerIcon = _interopRequireDefault(require("./s2-layer-icon"));

var _s2Utils = require("./s2-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var zoomFactorValue = 8;
var S2_TOKEN_FIELDS = {
  token: ['s2', 's2_token']
};
exports.S2_TOKEN_FIELDS = S2_TOKEN_FIELDS;
var s2RequiredColumns = ['token'];
exports.s2RequiredColumns = s2RequiredColumns;

var S2TokenAccessor = function S2TokenAccessor(_ref) {
  var token = _ref.token;
  return function (d) {
    return d[token.fieldIdx];
  };
};

exports.S2TokenAccessor = S2TokenAccessor;
var defaultElevation = 500;
exports.defaultElevation = defaultElevation;
var defaultLineWidth = 1;
exports.defaultLineWidth = defaultLineWidth;
var S2VisConfigs = {
  // Filled color
  opacity: 'opacity',
  colorRange: 'colorRange',
  filled: {
    type: 'boolean',
    label: 'Fill Color',
    defaultValue: true,
    property: 'filled'
  },
  // stroke
  thickness: _objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, {
    defaultValue: 0.5
  }),
  strokeColor: 'strokeColor',
  strokeColorRange: 'strokeColorRange',
  sizeRange: 'strokeWidthRange',
  stroked: 'stroked',
  // height
  enable3d: 'enable3d',
  elevationScale: 'elevationScale',
  heightRange: 'elevationRange',
  // wireframe
  wireframe: 'wireframe'
};
exports.S2VisConfigs = S2VisConfigs;

var S2GeometryLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(S2GeometryLayer, _Layer);

  function S2GeometryLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, S2GeometryLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(S2GeometryLayer).call(this, props));

    _this.registerVisConfig(S2VisConfigs);

    _this.getPositionAccessor = function () {
      return S2TokenAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(S2GeometryLayer, [{
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(S2GeometryLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
        // add height visual channel
        heightField: null,
        heightDomain: [0, 1],
        heightScale: 'linear',
        // add stroke color visual channel
        strokeColorField: null,
        strokeColorDomain: [0, 1],
        strokeColorScale: 'quantile'
      });
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getS2Token) {
      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var token = getS2Token(allData[index]);

        if (token) {
          data.push({
            // keep a reference to the original data index
            index: index,
            data: allData[index],
            token: token
          });
        }
      }

      return data;
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getS2Token) {
      var centroids = allData.reduce(function (acc, entry) {
        var s2Token = getS2Token(entry);
        return s2Token ? [].concat((0, _toConsumableArray2["default"])(acc), [(0, _s2Utils.getS2Center)(s2Token)]) : acc;
      }, []);
      var bounds = this.getPointsBounds(centroids);
      this.dataToFeature = {
        centroids: centroids
      };
      this.updateMeta({
        bounds: bounds
      });
    }
    /* eslint-disable complexity */

  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _this2 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorDomain = _this$config.colorDomain,
          colorField = _this$config.colorField,
          color = _this$config.color,
          heightField = _this$config.heightField,
          heightDomain = _this$config.heightDomain,
          heightScale = _this$config.heightScale,
          strokeColorField = _this$config.strokeColorField,
          strokeColorScale = _this$config.strokeColorScale,
          strokeColorDomain = _this$config.strokeColorDomain,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          sizeField = _this$config.sizeField,
          visConfig = _this$config.visConfig;
      var enable3d = visConfig.enable3d,
          stroked = visConfig.stroked,
          colorRange = visConfig.colorRange,
          heightRange = visConfig.heightRange,
          sizeRange = visConfig.sizeRange,
          strokeColorRange = visConfig.strokeColorRange,
          strokeColor = visConfig.strokeColor;
      var gpuFilter = datasets[this.config.dataId].gpuFilter;
      var getS2Token = this.getPositionAccessor();

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // calculate elevation scale - if extruded = true

      var eScale = heightField && enable3d && this.getVisChannelScale(heightScale, heightDomain, heightRange); // stroke color

      var scScale = strokeColorField && this.getVisChannelScale(strokeColorScale, strokeColorDomain, strokeColorRange.colors.map(_colorUtils.hexToRgb)); // calculate stroke scale - if stroked = true

      var sScale = sizeField && stroked && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);
      return {
        data: data,
        getS2Token: getS2Token,
        getLineColor: function getLineColor(d) {
          return scScale ? _this2.getEncodedChannelValue(scScale, d.data, strokeColorField) : strokeColor || color;
        },
        getLineWidth: function getLineWidth(d) {
          return sScale ? _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0) : defaultLineWidth;
        },
        getFillColor: function getFillColor(d) {
          return cScale ? _this2.getEncodedChannelValue(cScale, d.data, colorField) : color;
        },
        getElevation: function getElevation(d) {
          return eScale ? _this2.getEncodedChannelValue(eScale, d.data, heightField, 0) : defaultElevation;
        },
        getFilterValue: gpuFilter.filterValueAccessor()
      };
    }
    /* eslint-enable complexity */

  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          interactionConfig = opts.interactionConfig,
          mapState = opts.mapState;
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var eleZoomFactor = this.getElevationZoomFactor(mapState);
      var zoomFactor = this.getZoomFactor(mapState);
      var config = this.config;
      var visConfig = config.visConfig;
      var updateTriggers = {
        getLineColor: {
          color: visConfig.strokeColor,
          colorField: config.strokeColorField,
          colorRange: visConfig.strokeColorRange,
          colorScale: config.strokeColorScale
        },
        getLineWidth: {
          sizeField: config.sizeField,
          sizeRange: visConfig.sizeRange
        },
        getFillColor: {
          color: config.color,
          colorField: config.colorField,
          colorRange: visConfig.colorRange,
          colorScale: config.colorScale
        },
        getElevation: {
          heightField: config.heightField,
          heightScaleType: config.heightScale,
          heightRange: visConfig.heightRange
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      return [new _geoLayers.S2Layer(_objectSpread({}, defaultLayerProps, {}, interactionConfig, {}, data, {
        getS2Token: function getS2Token(d) {
          return d.token;
        },
        autoHighlight: visConfig.enable3d,
        highlightColor: _defaultSettings.HIGHLIGH_COLOR_3D,
        // stroke
        lineWidthScale: visConfig.thickness * zoomFactor * zoomFactorValue,
        stroked: visConfig.stroked,
        lineMiterLimit: 2,
        // Filled color
        filled: visConfig.filled,
        opacity: visConfig.opacity,
        wrapLongitude: false,
        // Elevation
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        pickable: true,
        updateTriggers: updateTriggers
      }))];
    }
  }, {
    key: "type",
    get: function get() {
      return 's2';
    }
  }, {
    key: "name",
    get: function get() {
      return 'S2';
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return s2RequiredColumns;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _s2LayerIcon["default"];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(S2GeometryLayer.prototype), "visualChannels", this), {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color
        },
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(S2GeometryLayer.prototype), "visualChannels", this).size, {
          property: 'stroke',
          condition: function condition(config) {
            return config.visConfig.stroked;
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
            return config.visConfig.stroked;
          }
        },
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
        }
      });
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fields = _ref3.fields,
          fields = _ref3$fields === void 0 ? [] : _ref3$fields;
      var foundColumns = this.findDefaultColumnField(S2_TOKEN_FIELDS, fields);

      if (!foundColumns || !foundColumns.length) {
        return {
          props: []
        };
      }

      return {
        props: foundColumns.map(function (columns) {
          return {
            isVisible: true,
            label: 'S2',
            columns: columns
          };
        })
      };
    }
  }]);
  return S2GeometryLayer;
}(_baseLayer["default"]);

exports["default"] = S2GeometryLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvczItZ2VvbWV0cnktbGF5ZXIvczItZ2VvbWV0cnktbGF5ZXIuanMiXSwibmFtZXMiOlsiem9vbUZhY3RvclZhbHVlIiwiUzJfVE9LRU5fRklFTERTIiwidG9rZW4iLCJzMlJlcXVpcmVkQ29sdW1ucyIsIlMyVG9rZW5BY2Nlc3NvciIsImQiLCJmaWVsZElkeCIsImRlZmF1bHRFbGV2YXRpb24iLCJkZWZhdWx0TGluZVdpZHRoIiwiUzJWaXNDb25maWdzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJmaWxsZWQiLCJ0eXBlIiwibGFiZWwiLCJkZWZhdWx0VmFsdWUiLCJwcm9wZXJ0eSIsInRoaWNrbmVzcyIsIkxBWUVSX1ZJU19DT05GSUdTIiwic3Ryb2tlQ29sb3IiLCJzdHJva2VDb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwic3Ryb2tlZCIsImVuYWJsZTNkIiwiZWxldmF0aW9uU2NhbGUiLCJoZWlnaHRSYW5nZSIsIndpcmVmcmFtZSIsIlMyR2VvbWV0cnlMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImhlaWdodEZpZWxkIiwiaGVpZ2h0RG9tYWluIiwiaGVpZ2h0U2NhbGUiLCJzdHJva2VDb2xvckZpZWxkIiwic3Ryb2tlQ29sb3JEb21haW4iLCJzdHJva2VDb2xvclNjYWxlIiwiZ2V0UzJUb2tlbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiZGF0YSIsImkiLCJsZW5ndGgiLCJpbmRleCIsInB1c2giLCJjZW50cm9pZHMiLCJyZWR1Y2UiLCJhY2MiLCJlbnRyeSIsInMyVG9rZW4iLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJkYXRhVG9GZWF0dXJlIiwidXBkYXRlTWV0YSIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsImdwdUZpbHRlciIsImRhdGFJZCIsInVwZGF0ZURhdGEiLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJoZXhUb1JnYiIsImVTY2FsZSIsInNjU2NhbGUiLCJzU2NhbGUiLCJnZXRMaW5lQ29sb3IiLCJnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlIiwiZ2V0TGluZVdpZHRoIiwiZ2V0RmlsbENvbG9yIiwiZ2V0RWxldmF0aW9uIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwib3B0cyIsImludGVyYWN0aW9uQ29uZmlnIiwibWFwU3RhdGUiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImVsZVpvb21GYWN0b3IiLCJnZXRFbGV2YXRpb25ab29tRmFjdG9yIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJ1cGRhdGVUcmlnZ2VycyIsImhlaWdodFNjYWxlVHlwZSIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJTMkxheWVyIiwiYXV0b0hpZ2hsaWdodCIsImhpZ2hsaWdodENvbG9yIiwiSElHSExJR0hfQ09MT1JfM0QiLCJsaW5lV2lkdGhTY2FsZSIsImxpbmVNaXRlckxpbWl0Iiwid3JhcExvbmdpdHVkZSIsImV4dHJ1ZGVkIiwicGlja2FibGUiLCJTMkxheWVySWNvbiIsImZpZWxkIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImtleSIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsInNpemUiLCJjb25kaXRpb24iLCJoZWlnaHQiLCJmaWVsZHMiLCJmb3VuZENvbHVtbnMiLCJmaW5kRGVmYXVsdENvbHVtbkZpZWxkIiwiaXNWaXNpYmxlIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7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QUM3QyxHQUFiLENBQWlCLFVBQUF6QyxPQUFPO0FBQUEsaUJBQUs7QUFDbEN3RixZQUFBQSxTQUFTLEVBQUUsSUFEdUI7QUFFbEMxRyxZQUFBQSxLQUFLLEVBQUUsSUFGMkI7QUFHbENrQixZQUFBQSxPQUFPLEVBQVBBO0FBSGtDLFdBQUw7QUFBQSxTQUF4QjtBQURGLE9BQVA7QUFPRDs7O0VBNUYwQ3lGLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtTMkxheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7SElHSExJR0hfQ09MT1JfM0QsIENIQU5ORUxfU0NBTEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQgUzJMYXllckljb24gZnJvbSAnLi9zMi1sYXllci1pY29uJztcbmltcG9ydCB7Z2V0UzJDZW50ZXJ9IGZyb20gJy4vczItdXRpbHMnO1xuXG5jb25zdCB6b29tRmFjdG9yVmFsdWUgPSA4O1xuXG5leHBvcnQgY29uc3QgUzJfVE9LRU5fRklFTERTID0ge1xuICB0b2tlbjogWydzMicsICdzMl90b2tlbiddXG59O1xuXG5leHBvcnQgY29uc3QgczJSZXF1aXJlZENvbHVtbnMgPSBbJ3Rva2VuJ107XG5leHBvcnQgY29uc3QgUzJUb2tlbkFjY2Vzc29yID0gKHt0b2tlbn0pID0+IGQgPT4gZFt0b2tlbi5maWVsZElkeF07XG5leHBvcnQgY29uc3QgZGVmYXVsdEVsZXZhdGlvbiA9IDUwMDtcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGluZVdpZHRoID0gMTtcblxuZXhwb3J0IGNvbnN0IFMyVmlzQ29uZmlncyA9IHtcbiAgLy8gRmlsbGVkIGNvbG9yXG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBmaWxsZWQ6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgbGFiZWw6ICdGaWxsIENvbG9yJyxcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgcHJvcGVydHk6ICdmaWxsZWQnXG4gIH0sXG5cbiAgLy8gc3Ryb2tlXG4gIHRoaWNrbmVzczoge1xuICAgIC4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzcyxcbiAgICBkZWZhdWx0VmFsdWU6IDAuNVxuICB9LFxuICBzdHJva2VDb2xvcjogJ3N0cm9rZUNvbG9yJyxcbiAgc3Ryb2tlQ29sb3JSYW5nZTogJ3N0cm9rZUNvbG9yUmFuZ2UnLFxuICBzaXplUmFuZ2U6ICdzdHJva2VXaWR0aFJhbmdlJyxcbiAgc3Ryb2tlZDogJ3N0cm9rZWQnLFxuXG4gIC8vIGhlaWdodFxuICBlbmFibGUzZDogJ2VuYWJsZTNkJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG4gIGhlaWdodFJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuXG4gIC8vIHdpcmVmcmFtZVxuICB3aXJlZnJhbWU6ICd3aXJlZnJhbWUnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTMkdlb21ldHJ5TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoUzJWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBTMlRva2VuQWNjZXNzb3IodGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ3MyJztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiAnUzInO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBzMlJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFMyTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkXG4gICAgICB9LFxuICAgICAgc3Ryb2tlQ29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2VDb2xvcicsXG4gICAgICAgIGZpZWxkOiAnc3Ryb2tlQ29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc3Ryb2tlQ29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3N0cm9rZUNvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnc3Ryb2tlQ29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvcixcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkXG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiB7XG4gICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcbiAgICAgICAgZmllbGQ6ICdoZWlnaHRGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnaGVpZ2h0U2NhbGUnLFxuICAgICAgICBkb21haW46ICdoZWlnaHREb21haW4nLFxuICAgICAgICByYW5nZTogJ2hlaWdodFJhbmdlJyxcbiAgICAgICAga2V5OiAnaGVpZ2h0JyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZSxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICAvLyBhZGQgaGVpZ2h0IHZpc3VhbCBjaGFubmVsXG4gICAgICBoZWlnaHRGaWVsZDogbnVsbCxcbiAgICAgIGhlaWdodERvbWFpbjogWzAsIDFdLFxuICAgICAgaGVpZ2h0U2NhbGU6ICdsaW5lYXInLFxuXG4gICAgICAvLyBhZGQgc3Ryb2tlIGNvbG9yIHZpc3VhbCBjaGFubmVsXG4gICAgICBzdHJva2VDb2xvckZpZWxkOiBudWxsLFxuICAgICAgc3Ryb2tlQ29sb3JEb21haW46IFswLCAxXSxcbiAgICAgIHN0cm9rZUNvbG9yU2NhbGU6ICdxdWFudGlsZSdcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyh7ZmllbGRzID0gW119KSB7XG4gICAgY29uc3QgZm91bmRDb2x1bW5zID0gdGhpcy5maW5kRGVmYXVsdENvbHVtbkZpZWxkKFMyX1RPS0VOX0ZJRUxEUywgZmllbGRzKTtcbiAgICBpZiAoIWZvdW5kQ29sdW1ucyB8fCAhZm91bmRDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtwcm9wczogW119O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm9wczogZm91bmRDb2x1bW5zLm1hcChjb2x1bW5zID0+ICh7XG4gICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgbGFiZWw6ICdTMicsXG4gICAgICAgIGNvbHVtbnNcbiAgICAgIH0pKVxuICAgIH07XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4fSwgZ2V0UzJUb2tlbikge1xuICAgIGNvbnN0IGRhdGEgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcmVkSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZmlsdGVyZWRJbmRleFtpXTtcbiAgICAgIGNvbnN0IHRva2VuID0gZ2V0UzJUb2tlbihhbGxEYXRhW2luZGV4XSk7XG5cbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIGRhdGEgaW5kZXhcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBkYXRhOiBhbGxEYXRhW2luZGV4XSxcbiAgICAgICAgICB0b2tlblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UzJUb2tlbikge1xuICAgIGNvbnN0IGNlbnRyb2lkcyA9IGFsbERhdGEucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBzMlRva2VuID0gZ2V0UzJUb2tlbihlbnRyeSk7XG4gICAgICByZXR1cm4gczJUb2tlbiA/IFsuLi5hY2MsIGdldFMyQ2VudGVyKHMyVG9rZW4pXSA6IGFjYztcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhjZW50cm9pZHMpO1xuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHtjZW50cm9pZHN9O1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBjb2xvcixcbiAgICAgIGhlaWdodEZpZWxkLFxuICAgICAgaGVpZ2h0RG9tYWluLFxuICAgICAgaGVpZ2h0U2NhbGUsXG4gICAgICBzdHJva2VDb2xvckZpZWxkLFxuICAgICAgc3Ryb2tlQ29sb3JTY2FsZSxcbiAgICAgIHN0cm9rZUNvbG9yRG9tYWluLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIHZpc0NvbmZpZ1xuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZTNkLFxuICAgICAgc3Ryb2tlZCxcbiAgICAgIGNvbG9yUmFuZ2UsXG4gICAgICBoZWlnaHRSYW5nZSxcbiAgICAgIHNpemVSYW5nZSxcbiAgICAgIHN0cm9rZUNvbG9yUmFuZ2UsXG4gICAgICBzdHJva2VDb2xvclxuICAgIH0gPSB2aXNDb25maWc7XG5cbiAgICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG4gICAgY29uc3QgZ2V0UzJUb2tlbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcblxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShjb2xvclNjYWxlLCBjb2xvckRvbWFpbiwgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgZWxldmF0aW9uIHNjYWxlIC0gaWYgZXh0cnVkZWQgPSB0cnVlXG4gICAgY29uc3QgZVNjYWxlID1cbiAgICAgIGhlaWdodEZpZWxkICYmIGVuYWJsZTNkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKGhlaWdodFNjYWxlLCBoZWlnaHREb21haW4sIGhlaWdodFJhbmdlKTtcblxuICAgIC8vIHN0cm9rZSBjb2xvclxuICAgIGNvbnN0IHNjU2NhbGUgPVxuICAgICAgc3Ryb2tlQ29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoXG4gICAgICAgIHN0cm9rZUNvbG9yU2NhbGUsXG4gICAgICAgIHN0cm9rZUNvbG9yRG9tYWluLFxuICAgICAgICBzdHJva2VDb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpXG4gICAgICApO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0cm9rZSBzY2FsZSAtIGlmIHN0cm9rZWQgPSB0cnVlXG4gICAgY29uc3Qgc1NjYWxlID1cbiAgICAgIHNpemVGaWVsZCAmJiBzdHJva2VkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgc2l6ZVJhbmdlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0UzJUb2tlbixcbiAgICAgIGdldExpbmVDb2xvcjogZCA9PlxuICAgICAgICBzY1NjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoc2NTY2FsZSwgZC5kYXRhLCBzdHJva2VDb2xvckZpZWxkKVxuICAgICAgICAgIDogc3Ryb2tlQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRMaW5lV2lkdGg6IGQgPT5cbiAgICAgICAgc1NjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApIDogZGVmYXVsdExpbmVXaWR0aCxcbiAgICAgIGdldEZpbGxDb2xvcjogZCA9PiAoY1NjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yKSxcbiAgICAgIGdldEVsZXZhdGlvbjogZCA9PlxuICAgICAgICBlU2NhbGUgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoZVNjYWxlLCBkLmRhdGEsIGhlaWdodEZpZWxkLCAwKSA6IGRlZmF1bHRFbGV2YXRpb24sXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlQWNjZXNzb3IoKVxuICAgIH07XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIGludGVyYWN0aW9uQ29uZmlnLCBtYXBTdGF0ZX0gPSBvcHRzO1xuXG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcblxuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IHtjb25maWd9ID0gdGhpcztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0TGluZUNvbG9yOiB7XG4gICAgICAgIGNvbG9yOiB2aXNDb25maWcuc3Ryb2tlQ29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IGNvbmZpZy5zdHJva2VDb2xvckZpZWxkLFxuICAgICAgICBjb2xvclJhbmdlOiB2aXNDb25maWcuc3Ryb2tlQ29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogY29uZmlnLnN0cm9rZUNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRMaW5lV2lkdGg6IHtcbiAgICAgICAgc2l6ZUZpZWxkOiBjb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplUmFuZ2U6IHZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRGaWxsQ29sb3I6IHtcbiAgICAgICAgY29sb3I6IGNvbmZpZy5jb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiBjb25maWcuY29sb3JTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldEVsZXZhdGlvbjoge1xuICAgICAgICBoZWlnaHRGaWVsZDogY29uZmlnLmhlaWdodEZpZWxkLFxuICAgICAgICBoZWlnaHRTY2FsZVR5cGU6IGNvbmZpZy5oZWlnaHRTY2FsZSxcbiAgICAgICAgaGVpZ2h0UmFuZ2U6IHZpc0NvbmZpZy5oZWlnaHRSYW5nZVxuICAgICAgfSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc1xuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFMyTGF5ZXIoe1xuICAgICAgICAuLi5kZWZhdWx0TGF5ZXJQcm9wcyxcbiAgICAgICAgLi4uaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGdldFMyVG9rZW46IGQgPT4gZC50b2tlbixcblxuICAgICAgICBhdXRvSGlnaGxpZ2h0OiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIGhpZ2hsaWdodENvbG9yOiBISUdITElHSF9DT0xPUl8zRCxcblxuICAgICAgICAvLyBzdHJva2VcbiAgICAgICAgbGluZVdpZHRoU2NhbGU6IHZpc0NvbmZpZy50aGlja25lc3MgKiB6b29tRmFjdG9yICogem9vbUZhY3RvclZhbHVlLFxuICAgICAgICBzdHJva2VkOiB2aXNDb25maWcuc3Ryb2tlZCxcbiAgICAgICAgbGluZU1pdGVyTGltaXQ6IDIsXG5cbiAgICAgICAgLy8gRmlsbGVkIGNvbG9yXG4gICAgICAgIGZpbGxlZDogdmlzQ29uZmlnLmZpbGxlZCxcbiAgICAgICAgb3BhY2l0eTogdmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHdyYXBMb25naXR1ZGU6IGZhbHNlLFxuXG4gICAgICAgIC8vIEVsZXZhdGlvblxuICAgICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcbiAgICAgICAgZXh0cnVkZWQ6IHZpc0NvbmZpZy5lbmFibGUzZCxcblxuICAgICAgICB3aXJlZnJhbWU6IHZpc0NvbmZpZy53aXJlZnJhbWUsXG5cbiAgICAgICAgcGlja2FibGU6IHRydWUsXG5cbiAgICAgICAgdXBkYXRlVHJpZ2dlcnNcbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19