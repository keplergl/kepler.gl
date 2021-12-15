"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.S2VisConfigs = exports.defaultLineWidth = exports.defaultElevation = exports.S2TokenAccessor = exports.s2RequiredColumns = exports.S2_TOKEN_FIELDS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _geoLayers = require("@deck.gl/geo-layers");

var _defaultSettings = require("../../constants/default-settings");

var _layerFactory = require("../layer-factory");

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _s2LayerIcon = _interopRequireDefault(require("./s2-layer-icon"));

var _s2Utils = require("./s2-utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
    return d.data[token.fieldIdx];
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
  thickness: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.thickness), {}, {
    defaultValue: 0.5
  }),
  strokeColor: 'strokeColor',
  strokeColorRange: 'strokeColorRange',
  sizeRange: 'strokeWidthRange',
  stroked: 'stroked',
  // height
  enable3d: 'enable3d',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  heightRange: 'elevationRange',
  // wireframe
  wireframe: 'wireframe'
};
exports.S2VisConfigs = S2VisConfigs;

var S2GeometryLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(S2GeometryLayer, _Layer);

  var _super = _createSuper(S2GeometryLayer);

  function S2GeometryLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, S2GeometryLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(S2VisConfigs);

    _this.getPositionAccessor = function () {
      return S2TokenAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(S2GeometryLayer, [{
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
      var visualChannels = (0, _get2["default"])((0, _getPrototypeOf2["default"])(S2GeometryLayer.prototype), "visualChannels", this);
      return {
        color: _objectSpread(_objectSpread({}, visualChannels.color), {}, {
          accessor: 'getFillColor'
        }),
        size: _objectSpread(_objectSpread({}, visualChannels.size), {}, {
          property: 'stroke',
          accessor: 'getLineWidth',
          condition: function condition(config) {
            return config.visConfig.stroked;
          },
          defaultValue: defaultLineWidth
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
          defaultValue: function defaultValue(config) {
            return config.visConfig.strokeColor || config.color;
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
          accessor: 'getElevation',
          condition: function condition(config) {
            return config.visConfig.enable3d;
          },
          nullValue: 0,
          defaultValue: defaultElevation
        }
      };
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(S2GeometryLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
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
        var token = getS2Token({
          data: allData[index]
        });

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
        var s2Token = getS2Token({
          data: entry
        });
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
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var gpuFilter = datasets[this.config.dataId].gpuFilter;
      var getS2Token = this.getPositionAccessor();

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var accessors = this.getAttributeAccessors();
      return _objectSpread({
        data: data,
        getS2Token: getS2Token,
        getFilterValue: gpuFilter.filterValueAccessor()
      }, accessors);
    }
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

      var updateTriggers = _objectSpread(_objectSpread({}, this.getVisualChannelUpdateTriggers()), {}, {
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      });

      return [new _geoLayers.S2Layer(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), interactionConfig), data), {}, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvczItZ2VvbWV0cnktbGF5ZXIvczItZ2VvbWV0cnktbGF5ZXIuanMiXSwibmFtZXMiOlsiem9vbUZhY3RvclZhbHVlIiwiUzJfVE9LRU5fRklFTERTIiwidG9rZW4iLCJzMlJlcXVpcmVkQ29sdW1ucyIsIlMyVG9rZW5BY2Nlc3NvciIsImQiLCJkYXRhIiwiZmllbGRJZHgiLCJkZWZhdWx0RWxldmF0aW9uIiwiZGVmYXVsdExpbmVXaWR0aCIsIlMyVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwiZmlsbGVkIiwidHlwZSIsImxhYmVsIiwiZGVmYXVsdFZhbHVlIiwicHJvcGVydHkiLCJ0aGlja25lc3MiLCJMQVlFUl9WSVNfQ09ORklHUyIsInN0cm9rZUNvbG9yIiwic3Ryb2tlQ29sb3JSYW5nZSIsInNpemVSYW5nZSIsInN0cm9rZWQiLCJlbmFibGUzZCIsImVsZXZhdGlvblNjYWxlIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvciIsImhlaWdodFJhbmdlIiwid2lyZWZyYW1lIiwiUzJHZW9tZXRyeUxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldFBvc2l0aW9uQWNjZXNzb3IiLCJjb25maWciLCJjb2x1bW5zIiwiUzJMYXllckljb24iLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwiYWNjZXNzb3IiLCJzaXplIiwiY29uZGl0aW9uIiwidmlzQ29uZmlnIiwiZmllbGQiLCJzY2FsZSIsImRvbWFpbiIsInJhbmdlIiwia2V5IiwiY2hhbm5lbFNjYWxlVHlwZSIsIkNIQU5ORUxfU0NBTEVTIiwibnVsbFZhbHVlIiwiaGVpZ2h0IiwiaGVpZ2h0RmllbGQiLCJoZWlnaHREb21haW4iLCJoZWlnaHRTY2FsZSIsInN0cm9rZUNvbG9yRmllbGQiLCJzdHJva2VDb2xvckRvbWFpbiIsInN0cm9rZUNvbG9yU2NhbGUiLCJnZXRTMlRva2VuIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJpIiwibGVuZ3RoIiwiaW5kZXgiLCJwdXNoIiwiY2VudHJvaWRzIiwicmVkdWNlIiwiYWNjIiwiZW50cnkiLCJzMlRva2VuIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwiZGF0YVRvRmVhdHVyZSIsInVwZGF0ZU1ldGEiLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsIm9wdCIsImdwdUZpbHRlciIsImRhdGFJZCIsInVwZGF0ZURhdGEiLCJhY2Nlc3NvcnMiLCJnZXRBdHRyaWJ1dGVBY2Nlc3NvcnMiLCJnZXRGaWx0ZXJWYWx1ZSIsImZpbHRlclZhbHVlQWNjZXNzb3IiLCJvcHRzIiwiaW50ZXJhY3Rpb25Db25maWciLCJtYXBTdGF0ZSIsImRlZmF1bHRMYXllclByb3BzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwiZWxlWm9vbUZhY3RvciIsImdldEVsZXZhdGlvblpvb21GYWN0b3IiLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0VmlzdWFsQ2hhbm5lbFVwZGF0ZVRyaWdnZXJzIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsIlMyTGF5ZXIiLCJhdXRvSGlnaGxpZ2h0IiwiaGlnaGxpZ2h0Q29sb3IiLCJISUdITElHSF9DT0xPUl8zRCIsImxpbmVXaWR0aFNjYWxlIiwibGluZU1pdGVyTGltaXQiLCJ3cmFwTG9uZ2l0dWRlIiwiZXh0cnVkZWQiLCJwaWNrYWJsZSIsImZpZWxkcyIsImZvdW5kQ29sdW1ucyIsImZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJtYXAiLCJpc1Zpc2libGUiLCJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLGVBQWUsR0FBRyxDQUF4QjtBQUVPLElBQU1DLGVBQWUsR0FBRztBQUM3QkMsRUFBQUEsS0FBSyxFQUFFLENBQUMsSUFBRCxFQUFPLFVBQVA7QUFEc0IsQ0FBeEI7O0FB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OztXQXpHRCxzQ0FBNEM7QUFBQSwrQkFBZFksTUFBYztBQUFBLFVBQWRBLE1BQWMsNkJBQUwsRUFBSztBQUMxQyxVQUFNQyxZQUFZLEdBQUcsS0FBS0Msc0JBQUwsQ0FBNEJ6RyxlQUE1QixFQUE2Q3VHLE1BQTdDLENBQXJCOztBQUNBLFVBQUksQ0FBQ0MsWUFBRCxJQUFpQixDQUFDQSxZQUFZLENBQUM1QyxNQUFuQyxFQUEyQztBQUN6QyxlQUFPO0FBQUMvQixVQUFBQSxLQUFLLEVBQUU7QUFBUixTQUFQO0FBQ0Q7O0FBRUQsYUFBTztBQUNMQSxRQUFBQSxLQUFLLEVBQUUyRSxZQUFZLENBQUNFLEdBQWIsQ0FBaUIsVUFBQXpFLE9BQU87QUFBQSxpQkFBSztBQUNsQzBFLFlBQUFBLFNBQVMsRUFBRSxJQUR1QjtBQUVsQzdGLFlBQUFBLEtBQUssRUFBRSxJQUYyQjtBQUdsQ21CLFlBQUFBLE9BQU8sRUFBUEE7QUFIa0MsV0FBTDtBQUFBLFNBQXhCO0FBREYsT0FBUDtBQU9EOzs7RUEvRjBDMkUscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge1MyTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2dlby1sYXllcnMnO1xuaW1wb3J0IHtISUdITElHSF9DT0xPUl8zRCwgQ0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCBTMkxheWVySWNvbiBmcm9tICcuL3MyLWxheWVyLWljb24nO1xuaW1wb3J0IHtnZXRTMkNlbnRlcn0gZnJvbSAnLi9zMi11dGlscyc7XG5cbmNvbnN0IHpvb21GYWN0b3JWYWx1ZSA9IDg7XG5cbmV4cG9ydCBjb25zdCBTMl9UT0tFTl9GSUVMRFMgPSB7XG4gIHRva2VuOiBbJ3MyJywgJ3MyX3Rva2VuJ11cbn07XG5cbmV4cG9ydCBjb25zdCBzMlJlcXVpcmVkQ29sdW1ucyA9IFsndG9rZW4nXTtcbmV4cG9ydCBjb25zdCBTMlRva2VuQWNjZXNzb3IgPSAoe3Rva2VufSkgPT4gZCA9PiBkLmRhdGFbdG9rZW4uZmllbGRJZHhdO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRFbGV2YXRpb24gPSA1MDA7XG5leHBvcnQgY29uc3QgZGVmYXVsdExpbmVXaWR0aCA9IDE7XG5cbmV4cG9ydCBjb25zdCBTMlZpc0NvbmZpZ3MgPSB7XG4gIC8vIEZpbGxlZCBjb2xvclxuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgZmlsbGVkOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGxhYmVsOiAnRmlsbCBDb2xvcicsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHByb3BlcnR5OiAnZmlsbGVkJ1xuICB9LFxuXG4gIC8vIHN0cm9rZVxuICB0aGlja25lc3M6IHtcbiAgICAuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3MsXG4gICAgZGVmYXVsdFZhbHVlOiAwLjVcbiAgfSxcbiAgc3Ryb2tlQ29sb3I6ICdzdHJva2VDb2xvcicsXG4gIHN0cm9rZUNvbG9yUmFuZ2U6ICdzdHJva2VDb2xvclJhbmdlJyxcbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZScsXG4gIHN0cm9rZWQ6ICdzdHJva2VkJyxcblxuICAvLyBoZWlnaHRcbiAgZW5hYmxlM2Q6ICdlbmFibGUzZCcsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yOiAnZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvcicsXG4gIGhlaWdodFJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuXG4gIC8vIHdpcmVmcmFtZVxuICB3aXJlZnJhbWU6ICd3aXJlZnJhbWUnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTMkdlb21ldHJ5TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoUzJWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBTMlRva2VuQWNjZXNzb3IodGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ3MyJztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiAnUzInO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBzMlJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFMyTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWxzID0gc3VwZXIudmlzdWFsQ2hhbm5lbHM7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIC4uLnZpc3VhbENoYW5uZWxzLmNvbG9yLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldEZpbGxDb2xvcidcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJyxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRMaW5lV2lkdGgnLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZWQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdExpbmVXaWR0aFxuICAgICAgfSxcbiAgICAgIHN0cm9rZUNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlQ29sb3InLFxuICAgICAgICBmaWVsZDogJ3N0cm9rZUNvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ3N0cm9rZUNvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzdHJva2VDb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc3Ryb2tlQ29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ3N0cm9rZUNvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0TGluZUNvbG9yJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBudWxsVmFsdWU6IHZpc3VhbENoYW5uZWxzLmNvbG9yLm51bGxWYWx1ZSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VDb2xvciB8fCBjb25maWcuY29sb3JcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IHtcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ2hlaWdodEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdoZWlnaHRTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2hlaWdodERvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnaGVpZ2h0UmFuZ2UnLFxuICAgICAgICBrZXk6ICdoZWlnaHQnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5zaXplLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldEVsZXZhdGlvbicsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIG51bGxWYWx1ZTogMCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0RWxldmF0aW9uXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyA9IHt9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLmdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyksXG5cbiAgICAgIC8vIGFkZCBoZWlnaHQgdmlzdWFsIGNoYW5uZWxcbiAgICAgIGhlaWdodEZpZWxkOiBudWxsLFxuICAgICAgaGVpZ2h0RG9tYWluOiBbMCwgMV0sXG4gICAgICBoZWlnaHRTY2FsZTogJ2xpbmVhcicsXG5cbiAgICAgIC8vIGFkZCBzdHJva2UgY29sb3IgdmlzdWFsIGNoYW5uZWxcbiAgICAgIHN0cm9rZUNvbG9yRmllbGQ6IG51bGwsXG4gICAgICBzdHJva2VDb2xvckRvbWFpbjogWzAsIDFdLFxuICAgICAgc3Ryb2tlQ29sb3JTY2FsZTogJ3F1YW50aWxlJ1xuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZHMgPSBbXX0pIHtcbiAgICBjb25zdCBmb3VuZENvbHVtbnMgPSB0aGlzLmZpbmREZWZhdWx0Q29sdW1uRmllbGQoUzJfVE9LRU5fRklFTERTLCBmaWVsZHMpO1xuICAgIGlmICghZm91bmRDb2x1bW5zIHx8ICFmb3VuZENvbHVtbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge3Byb3BzOiBbXX07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3BzOiBmb3VuZENvbHVtbnMubWFwKGNvbHVtbnMgPT4gKHtcbiAgICAgICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgICAgICBsYWJlbDogJ1MyJyxcbiAgICAgICAgY29sdW1uc1xuICAgICAgfSkpXG4gICAgfTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXh9LCBnZXRTMlRva2VuKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyZWRJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSBmaWx0ZXJlZEluZGV4W2ldO1xuICAgICAgY29uc3QgdG9rZW4gPSBnZXRTMlRva2VuKHtkYXRhOiBhbGxEYXRhW2luZGV4XX0pO1xuXG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBkYXRhIGluZGV4XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF0sXG4gICAgICAgICAgdG9rZW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFMyVG9rZW4pIHtcbiAgICBjb25zdCBjZW50cm9pZHMgPSBhbGxEYXRhLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgczJUb2tlbiA9IGdldFMyVG9rZW4oe2RhdGE6IGVudHJ5fSk7XG4gICAgICByZXR1cm4gczJUb2tlbiA/IFsuLi5hY2MsIGdldFMyQ2VudGVyKHMyVG9rZW4pXSA6IGFjYztcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhjZW50cm9pZHMpO1xuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHtjZW50cm9pZHN9O1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG4gICAgY29uc3QgZ2V0UzJUb2tlbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuZ2V0QXR0cmlidXRlQWNjZXNzb3JzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldFMyVG9rZW4sXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlQWNjZXNzb3IoKSxcbiAgICAgIC4uLmFjY2Vzc29yc1xuICAgIH07XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgaW50ZXJhY3Rpb25Db25maWcsIG1hcFN0YXRlfSA9IG9wdHM7XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuXG4gICAgY29uc3QgZWxlWm9vbUZhY3RvciA9IHRoaXMuZ2V0RWxldmF0aW9uWm9vbUZhY3RvcihtYXBTdGF0ZSk7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZSk7XG4gICAgY29uc3Qge2NvbmZpZ30gPSB0aGlzO1xuICAgIGNvbnN0IHt2aXNDb25maWd9ID0gY29uZmlnO1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICAuLi50aGlzLmdldFZpc3VhbENoYW5uZWxVcGRhdGVUcmlnZ2VycygpLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzXG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgUzJMYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgZ2V0UzJUb2tlbjogZCA9PiBkLnRva2VuLFxuXG4gICAgICAgIGF1dG9IaWdobGlnaHQ6IHZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgaGlnaGxpZ2h0Q29sb3I6IEhJR0hMSUdIX0NPTE9SXzNELFxuXG4gICAgICAgIC8vIHN0cm9rZVxuICAgICAgICBsaW5lV2lkdGhTY2FsZTogdmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiB6b29tRmFjdG9yVmFsdWUsXG4gICAgICAgIHN0cm9rZWQ6IHZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogMixcblxuICAgICAgICAvLyBGaWxsZWQgY29sb3JcbiAgICAgICAgZmlsbGVkOiB2aXNDb25maWcuZmlsbGVkLFxuICAgICAgICBvcGFjaXR5OiB2aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgd3JhcExvbmdpdHVkZTogZmFsc2UsXG5cbiAgICAgICAgLy8gRWxldmF0aW9uXG4gICAgICAgIGVsZXZhdGlvblNjYWxlOiB2aXNDb25maWcuZWxldmF0aW9uU2NhbGUgKiBlbGVab29tRmFjdG9yLFxuICAgICAgICBleHRydWRlZDogdmlzQ29uZmlnLmVuYWJsZTNkLFxuXG4gICAgICAgIHdpcmVmcmFtZTogdmlzQ29uZmlnLndpcmVmcmFtZSxcblxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcblxuICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=