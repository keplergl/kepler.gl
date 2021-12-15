"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.featureResolver = exports.featureAccessor = exports.geoJsonRequiredColumns = exports.tripVisConfigs = exports.defaultLineWidth = exports.defaultThickness = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _lodash2 = _interopRequireDefault(require("lodash.uniq"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _geoLayers = require("@deck.gl/geo-layers");

var _defaultSettings = require("../../constants/default-settings");

var _tripLayerIcon = _interopRequireDefault(require("./trip-layer-icon"));

var _geojsonUtils = require("../geojson-layer/geojson-utils");

var _tripUtils = require("./trip-utils");

var _tripInfoModal = _interopRequireDefault(require("./trip-info-modal"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var zoomFactorValue = 8;
var defaultThickness = 0.5;
exports.defaultThickness = defaultThickness;
var defaultLineWidth = 1;
exports.defaultLineWidth = defaultLineWidth;
var tripVisConfigs = {
  opacity: 'opacity',
  thickness: {
    type: 'number',
    defaultValue: defaultThickness,
    label: 'Stroke Width',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: 'stroke',
    property: 'thickness'
  },
  colorRange: 'colorRange',
  trailLength: 'trailLength',
  sizeRange: 'strokeWidthRange'
};
exports.tripVisConfigs = tripVisConfigs;
var geoJsonRequiredColumns = ['geojson'];
exports.geoJsonRequiredColumns = geoJsonRequiredColumns;

var featureAccessor = function featureAccessor(_ref) {
  var geojson = _ref.geojson;
  return function (d) {
    return d[geojson.fieldIdx];
  };
};

exports.featureAccessor = featureAccessor;

var featureResolver = function featureResolver(_ref2) {
  var geojson = _ref2.geojson;
  return geojson.fieldIdx;
};

exports.featureResolver = featureResolver;

var TripLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(TripLayer, _Layer);

  var _super = _createSuper(TripLayer);

  function TripLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, TripLayer);
    _this = _super.call(this, props);
    _this.dataToFeature = [];
    _this.dataToTimeStamp = [];

    _this.registerVisConfig(tripVisConfigs);

    _this.getFeature = (0, _lodash["default"])(featureAccessor, featureResolver);
    _this._layerInfoModal = (0, _tripInfoModal["default"])();
    return _this;
  }

  (0, _createClass2["default"])(TripLayer, [{
    key: "type",
    get: function get() {
      return 'trip';
    }
  }, {
    key: "name",
    get: function get() {
      return 'Trip';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _tripLayerIcon["default"];
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return geoJsonRequiredColumns;
    }
  }, {
    key: "visualChannels",
    get: function get() {
      var visualChannels = (0, _get2["default"])((0, _getPrototypeOf2["default"])(TripLayer.prototype), "visualChannels", this);
      return _objectSpread(_objectSpread({}, visualChannels), {}, {
        color: _objectSpread(_objectSpread({}, visualChannels.color), {}, {
          accessor: 'getColor',
          nullValue: visualChannels.color.nullValue,
          getAttributeValue: function getAttributeValue(config) {
            return function (d) {
              return d.properties.lineColor || config.color;
            };
          },
          // used this to get updateTriggers
          defaultValue: function defaultValue(config) {
            return config.color;
          }
        }),
        size: _objectSpread(_objectSpread({}, visualChannels.size), {}, {
          property: 'stroke',
          accessor: 'getWidth',
          condition: function condition(config) {
            return config.visConfig.stroked;
          },
          nullValue: 0,
          getAttributeValue: function getAttributeValue() {
            return function (d) {
              return d.properties.lineWidth || defaultLineWidth;
            };
          }
        })
      });
    }
  }, {
    key: "animationDomain",
    get: function get() {
      return this.config.animation.domain;
    }
  }, {
    key: "layerInfoModal",
    get: function get() {
      return {
        id: 'iconInfo',
        template: this._layerInfoModal,
        modalProps: {
          title: 'modal.tripInfo.title'
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
    value: function getDefaultLayerConfig(props) {
      return _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(TripLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
        animation: {
          enabled: true,
          domain: null
        }
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
    value: function calculateDataAttribute(_ref3, getPosition) {
      var _this2 = this;

      var allData = _ref3.allData,
          filteredIndex = _ref3.filteredIndex;
      return filteredIndex.map(function (i) {
        return _this2.dataToFeature[i];
      }).filter(function (d) {
        return d && d.geometry.type === 'LineString';
      });
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _this3 = this;

      // to-do: parse segment from allData
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
        getFilterValue: gpuFilter.filterValueAccessor(indexAccessor, valueAccessor),
        getPath: function getPath(d) {
          return d.geometry.coordinates;
        },
        getTimestamps: function getTimestamps(d) {
          return _this3.dataToTimeStamp[d.properties.index];
        }
      }, accessors);
    }
  }, {
    key: "updateAnimationDomain",
    value: function updateAnimationDomain(domain) {
      this.updateLayerConfig({
        animation: _objectSpread(_objectSpread({}, this.config.animation), {}, {
          domain: domain
        })
      });
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData) {
      var getFeature = this.getPositionAccessor();

      if (getFeature === this.meta.getFeature) {
        // TODO: revisit this after gpu filtering
        return;
      }

      this.dataToFeature = (0, _geojsonUtils.getGeojsonDataMaps)(allData, getFeature);

      var _parseTripGeoJsonTime = (0, _tripUtils.parseTripGeoJsonTimestamp)(this.dataToFeature),
          dataToTimeStamp = _parseTripGeoJsonTime.dataToTimeStamp,
          animationDomain = _parseTripGeoJsonTime.animationDomain;

      this.dataToTimeStamp = dataToTimeStamp;
      this.updateAnimationDomain(animationDomain); // get bounds from features

      var bounds = (0, _geojsonUtils.getGeojsonBounds)(this.dataToFeature); // keep a record of what type of geometry the collection has

      var featureTypes = (0, _geojsonUtils.getGeojsonFeatureTypes)(this.dataToFeature);
      this.updateMeta({
        bounds: bounds,
        featureTypes: featureTypes,
        getFeature: getFeature
      });
    }
  }, {
    key: "setInitialLayerConfig",
    value: function setInitialLayerConfig(_ref4) {
      var allData = _ref4.allData;
      this.updateLayerMeta(allData);
      return this;
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var _animationConfig$doma;

      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          mapState = opts.mapState,
          animationConfig = opts.animationConfig;
      var visConfig = this.config.visConfig;
      var zoomFactor = this.getZoomFactor(mapState);
      var isValidTime = animationConfig && Array.isArray(animationConfig.domain) && animationConfig.domain.every(Number.isFinite) && Number.isFinite(animationConfig.currentTime);

      if (!isValidTime) {
        return [];
      }

      var domain0 = (_animationConfig$doma = animationConfig.domain) === null || _animationConfig$doma === void 0 ? void 0 : _animationConfig$doma[0];

      var updateTriggers = _objectSpread(_objectSpread({}, this.getVisualChannelUpdateTriggers()), {}, {
        getTimestamps: {
          columns: this.config.columns,
          domain0: domain0
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      });

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      return [new _geoLayers.TripsLayer(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), data), {}, {
        getTimestamps: function getTimestamps(d) {
          return data.getTimestamps(d).map(function (ts) {
            return ts - domain0;
          });
        },
        widthScale: this.config.visConfig.thickness * zoomFactor * zoomFactorValue,
        rounded: true,
        wrapLongitude: false,
        parameters: {
          depthTest: mapState.dragRotate,
          depthMask: false
        },
        trailLength: visConfig.trailLength * 1000,
        currentTime: animationConfig.currentTime - domain0,
        updateTriggers: updateTriggers
      }))];
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref5, foundLayers) {
      var _this4 = this;

      var label = _ref5.label,
          _ref5$fields = _ref5.fields,
          fields = _ref5$fields === void 0 ? [] : _ref5$fields,
          _ref5$allData = _ref5.allData,
          allData = _ref5$allData === void 0 ? [] : _ref5$allData,
          id = _ref5.id;
      var geojsonColumns = fields.filter(function (f) {
        return f.type === 'geojson';
      }).map(function (f) {
        return f.name;
      });
      var defaultColumns = {
        geojson: (0, _lodash2["default"])([].concat((0, _toConsumableArray2["default"])(_defaultSettings.GEOJSON_FIELDS.geojson), (0, _toConsumableArray2["default"])(geojsonColumns)))
      };
      var geoJsonColumns = this.findDefaultColumnField(defaultColumns, fields);
      var tripColumns = (geoJsonColumns || []).filter(function (col) {
        return (0, _tripUtils.isTripGeoJsonField)(allData, fields[col.geojson.fieldIdx]);
      });

      if (!tripColumns.length) {
        return {
          props: []
        };
      }

      return {
        props: tripColumns.map(function (columns) {
          return {
            label: typeof label === 'string' && label.replace(/\.[^/.]+$/, '') || _this4.type,
            columns: columns,
            isVisible: true
          };
        }),
        // if a geojson layer is created from this column, delete it
        foundLayers: foundLayers.filter(function (prop) {
          return prop.type !== 'geojson' || prop.dataId !== id || !tripColumns.find(function (c) {
            return prop.columns.geojson.name === c.geojson.name;
          });
        })
      };
    }
  }]);
  return TripLayer;
}(_baseLayer["default"]);

exports["default"] = TripLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvdHJpcC1sYXllci90cmlwLWxheWVyLmpzIl0sIm5hbWVzIjpbInpvb21GYWN0b3JWYWx1ZSIsImRlZmF1bHRUaGlja25lc3MiLCJkZWZhdWx0TGluZVdpZHRoIiwidHJpcFZpc0NvbmZpZ3MiLCJvcGFjaXR5IiwidGhpY2tuZXNzIiwidHlwZSIsImRlZmF1bHRWYWx1ZSIsImxhYmVsIiwiaXNSYW5nZWQiLCJyYW5nZSIsInN0ZXAiLCJncm91cCIsInByb3BlcnR5IiwiY29sb3JSYW5nZSIsInRyYWlsTGVuZ3RoIiwic2l6ZVJhbmdlIiwiZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyIsImZlYXR1cmVBY2Nlc3NvciIsImdlb2pzb24iLCJkIiwiZmllbGRJZHgiLCJmZWF0dXJlUmVzb2x2ZXIiLCJUcmlwTGF5ZXIiLCJwcm9wcyIsImRhdGFUb0ZlYXR1cmUiLCJkYXRhVG9UaW1lU3RhbXAiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldEZlYXR1cmUiLCJfbGF5ZXJJbmZvTW9kYWwiLCJUcmlwTGF5ZXJJY29uIiwidmlzdWFsQ2hhbm5lbHMiLCJjb2xvciIsImFjY2Vzc29yIiwibnVsbFZhbHVlIiwiZ2V0QXR0cmlidXRlVmFsdWUiLCJjb25maWciLCJwcm9wZXJ0aWVzIiwibGluZUNvbG9yIiwic2l6ZSIsImNvbmRpdGlvbiIsInZpc0NvbmZpZyIsInN0cm9rZWQiLCJsaW5lV2lkdGgiLCJhbmltYXRpb24iLCJkb21haW4iLCJpZCIsInRlbXBsYXRlIiwibW9kYWxQcm9wcyIsInRpdGxlIiwiY29sdW1ucyIsImVuYWJsZWQiLCJvYmplY3QiLCJhbGxEYXRhIiwiaW5kZXgiLCJnZXRQb3NpdGlvbiIsImZpbHRlcmVkSW5kZXgiLCJtYXAiLCJpIiwiZmlsdGVyIiwiZ2VvbWV0cnkiLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsImRhdGFJZCIsImdwdUZpbHRlciIsInVwZGF0ZURhdGEiLCJkYXRhIiwidmFsdWVBY2Nlc3NvciIsImYiLCJpbmRleEFjY2Vzc29yIiwiYWNjZXNzb3JzIiwiZ2V0QXR0cmlidXRlQWNjZXNzb3JzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiZ2V0UGF0aCIsImNvb3JkaW5hdGVzIiwiZ2V0VGltZXN0YW1wcyIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZ2V0UG9zaXRpb25BY2Nlc3NvciIsIm1ldGEiLCJhbmltYXRpb25Eb21haW4iLCJ1cGRhdGVBbmltYXRpb25Eb21haW4iLCJib3VuZHMiLCJmZWF0dXJlVHlwZXMiLCJ1cGRhdGVNZXRhIiwidXBkYXRlTGF5ZXJNZXRhIiwib3B0cyIsIm1hcFN0YXRlIiwiYW5pbWF0aW9uQ29uZmlnIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJpc1ZhbGlkVGltZSIsIkFycmF5IiwiaXNBcnJheSIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJjdXJyZW50VGltZSIsImRvbWFpbjAiLCJ1cGRhdGVUcmlnZ2VycyIsImdldFZpc3VhbENoYW5uZWxVcGRhdGVUcmlnZ2VycyIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsIkRlY2tHTFRyaXBzTGF5ZXIiLCJ0cyIsIndpZHRoU2NhbGUiLCJyb3VuZGVkIiwid3JhcExvbmdpdHVkZSIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJkcmFnUm90YXRlIiwiZGVwdGhNYXNrIiwiZm91bmRMYXllcnMiLCJmaWVsZHMiLCJnZW9qc29uQ29sdW1ucyIsIm5hbWUiLCJkZWZhdWx0Q29sdW1ucyIsIkdFT0pTT05fRklFTERTIiwiZ2VvSnNvbkNvbHVtbnMiLCJmaW5kRGVmYXVsdENvbHVtbkZpZWxkIiwidHJpcENvbHVtbnMiLCJjb2wiLCJsZW5ndGgiLCJyZXBsYWNlIiwiaXNWaXNpYmxlIiwicHJvcCIsImZpbmQiLCJjIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QWdCakIsRUFEaEIsSUFFQSxDQUFDMkUsV0FBVyxDQUFDTSxJQUFaLENBQWlCLFVBQUFDLENBQUM7QUFBQSxtQkFBSUYsSUFBSSxDQUFDNUUsT0FBTCxDQUFhL0IsT0FBYixDQUFxQmlHLElBQXJCLEtBQThCWSxDQUFDLENBQUM3RyxPQUFGLENBQVVpRyxJQUE1QztBQUFBLFdBQWxCLENBSEM7QUFBQSxTQURPO0FBUlIsT0FBUDtBQWVEOzs7RUFyR29DYSxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7VHJpcHNMYXllciBhcyBEZWNrR0xUcmlwc0xheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcblxuaW1wb3J0IHtHRU9KU09OX0ZJRUxEU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IFRyaXBMYXllckljb24gZnJvbSAnLi90cmlwLWxheWVyLWljb24nO1xuXG5pbXBvcnQge1xuICBnZXRHZW9qc29uRGF0YU1hcHMsXG4gIGdldEdlb2pzb25Cb3VuZHMsXG4gIGdldEdlb2pzb25GZWF0dXJlVHlwZXNcbn0gZnJvbSAnbGF5ZXJzL2dlb2pzb24tbGF5ZXIvZ2VvanNvbi11dGlscyc7XG5cbmltcG9ydCB7aXNUcmlwR2VvSnNvbkZpZWxkLCBwYXJzZVRyaXBHZW9Kc29uVGltZXN0YW1wfSBmcm9tICcuL3RyaXAtdXRpbHMnO1xuaW1wb3J0IFRyaXBJbmZvTW9kYWxGYWN0b3J5IGZyb20gJy4vdHJpcC1pbmZvLW1vZGFsJztcblxuY29uc3Qgem9vbUZhY3RvclZhbHVlID0gODtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaGlja25lc3MgPSAwLjU7XG5leHBvcnQgY29uc3QgZGVmYXVsdExpbmVXaWR0aCA9IDE7XG5cbmV4cG9ydCBjb25zdCB0cmlwVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6IHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRUaGlja25lc3MsXG4gICAgbGFiZWw6ICdTdHJva2UgV2lkdGgnLFxuICAgIGlzUmFuZ2VkOiBmYWxzZSxcbiAgICByYW5nZTogWzAsIDEwMF0sXG4gICAgc3RlcDogMC4xLFxuICAgIGdyb3VwOiAnc3Ryb2tlJyxcbiAgICBwcm9wZXJ0eTogJ3RoaWNrbmVzcydcbiAgfSxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICB0cmFpbExlbmd0aDogJ3RyYWlsTGVuZ3RoJyxcbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZSdcbn07XG5cbmV4cG9ydCBjb25zdCBnZW9Kc29uUmVxdWlyZWRDb2x1bW5zID0gWydnZW9qc29uJ107XG5leHBvcnQgY29uc3QgZmVhdHVyZUFjY2Vzc29yID0gKHtnZW9qc29ufSkgPT4gZCA9PiBkW2dlb2pzb24uZmllbGRJZHhdO1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVSZXNvbHZlciA9ICh7Z2VvanNvbn0pID0+IGdlb2pzb24uZmllbGRJZHg7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaXBMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSBbXTtcbiAgICB0aGlzLmRhdGFUb1RpbWVTdGFtcCA9IFtdO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcodHJpcFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0RmVhdHVyZSA9IG1lbW9pemUoZmVhdHVyZUFjY2Vzc29yLCBmZWF0dXJlUmVzb2x2ZXIpO1xuICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gVHJpcEluZm9Nb2RhbEZhY3RvcnkoKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAndHJpcCc7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gJ1RyaXAnO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gVHJpcExheWVySWNvbjtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gZ2VvSnNvblJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVscyA9IHN1cGVyLnZpc3VhbENoYW5uZWxzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnZpc3VhbENoYW5uZWxzLFxuICAgICAgY29sb3I6IHtcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0Q29sb3InLFxuICAgICAgICBudWxsVmFsdWU6IHZpc3VhbENoYW5uZWxzLmNvbG9yLm51bGxWYWx1ZSxcbiAgICAgICAgZ2V0QXR0cmlidXRlVmFsdWU6IGNvbmZpZyA9PiBkID0+IGQucHJvcGVydGllcy5saW5lQ29sb3IgfHwgY29uZmlnLmNvbG9yLFxuICAgICAgICAvLyB1c2VkIHRoaXMgdG8gZ2V0IHVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogY29uZmlnID0+IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2UnLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFdpZHRoJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBudWxsVmFsdWU6IDAsXG4gICAgICAgIGdldEF0dHJpYnV0ZVZhbHVlOiAoKSA9PiBkID0+IGQucHJvcGVydGllcy5saW5lV2lkdGggfHwgZGVmYXVsdExpbmVXaWR0aFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXQgYW5pbWF0aW9uRG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5hbmltYXRpb24uZG9tYWluO1xuICB9XG5cbiAgZ2V0IGxheWVySW5mb01vZGFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2ljb25JbmZvJyxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLl9sYXllckluZm9Nb2RhbCxcbiAgICAgIG1vZGFsUHJvcHM6IHtcbiAgICAgICAgdGl0bGU6ICdtb2RhbC50cmlwSW5mby50aXRsZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0UG9zaXRpb25BY2Nlc3NvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGZWF0dXJlKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuICB9XG5cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyh7bGFiZWwsIGZpZWxkcyA9IFtdLCBhbGxEYXRhID0gW10sIGlkfSwgZm91bmRMYXllcnMpIHtcbiAgICBjb25zdCBnZW9qc29uQ29sdW1ucyA9IGZpZWxkcy5maWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdnZW9qc29uJykubWFwKGYgPT4gZi5uYW1lKTtcblxuICAgIGNvbnN0IGRlZmF1bHRDb2x1bW5zID0ge1xuICAgICAgZ2VvanNvbjogdW5pcShbLi4uR0VPSlNPTl9GSUVMRFMuZ2VvanNvbiwgLi4uZ2VvanNvbkNvbHVtbnNdKVxuICAgIH07XG5cbiAgICBjb25zdCBnZW9Kc29uQ29sdW1ucyA9IHRoaXMuZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0Q29sdW1ucywgZmllbGRzKTtcblxuICAgIGNvbnN0IHRyaXBDb2x1bW5zID0gKGdlb0pzb25Db2x1bW5zIHx8IFtdKS5maWx0ZXIoY29sID0+XG4gICAgICBpc1RyaXBHZW9Kc29uRmllbGQoYWxsRGF0YSwgZmllbGRzW2NvbC5nZW9qc29uLmZpZWxkSWR4XSlcbiAgICApO1xuXG4gICAgaWYgKCF0cmlwQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7cHJvcHM6IFtdfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcHJvcHM6IHRyaXBDb2x1bW5zLm1hcChjb2x1bW5zID0+ICh7XG4gICAgICAgIGxhYmVsOiAodHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJyAmJiBsYWJlbC5yZXBsYWNlKC9cXC5bXi8uXSskLywgJycpKSB8fCB0aGlzLnR5cGUsXG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIGlzVmlzaWJsZTogdHJ1ZVxuICAgICAgfSkpLFxuXG4gICAgICAvLyBpZiBhIGdlb2pzb24gbGF5ZXIgaXMgY3JlYXRlZCBmcm9tIHRoaXMgY29sdW1uLCBkZWxldGUgaXRcbiAgICAgIGZvdW5kTGF5ZXJzOiBmb3VuZExheWVycy5maWx0ZXIoXG4gICAgICAgIHByb3AgPT5cbiAgICAgICAgICBwcm9wLnR5cGUgIT09ICdnZW9qc29uJyB8fFxuICAgICAgICAgIHByb3AuZGF0YUlkICE9PSBpZCB8fFxuICAgICAgICAgICF0cmlwQ29sdW1ucy5maW5kKGMgPT4gcHJvcC5jb2x1bW5zLmdlb2pzb24ubmFtZSA9PT0gYy5nZW9qc29uLm5hbWUpXG4gICAgICApXG4gICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGRvbWFpbjogbnVsbFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0LCBhbGxEYXRhKSB7XG4gICAgLy8gaW5kZXggb2YgYWxsRGF0YSBpcyBzYXZlZCB0byBmZWF0dXJlLnByb3BlcnRpZXNcbiAgICByZXR1cm4gYWxsRGF0YVtvYmplY3QucHJvcGVydGllcy5pbmRleF07XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4fSwgZ2V0UG9zaXRpb24pIHtcbiAgICByZXR1cm4gZmlsdGVyZWRJbmRleFxuICAgICAgLm1hcChpID0+IHRoaXMuZGF0YVRvRmVhdHVyZVtpXSlcbiAgICAgIC5maWx0ZXIoZCA9PiBkICYmIGQuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKSB7XG4gICAgLy8gdG8tZG86IHBhcnNlIHNlZ21lbnQgZnJvbSBhbGxEYXRhXG4gICAgY29uc3Qge2FsbERhdGEsIGdwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcblxuICAgIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBmID0+IGFsbERhdGFbZi5wcm9wZXJ0aWVzLmluZGV4XTtcbiAgICBjb25zdCBpbmRleEFjY2Vzc29yID0gZiA9PiBmLnByb3BlcnRpZXMuaW5kZXg7XG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5nZXRBdHRyaWJ1dGVBY2Nlc3NvcnModmFsdWVBY2Nlc3Nvcik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcihpbmRleEFjY2Vzc29yLCB2YWx1ZUFjY2Vzc29yKSxcbiAgICAgIGdldFBhdGg6IGQgPT4gZC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGdldFRpbWVzdGFtcHM6IGQgPT4gdGhpcy5kYXRhVG9UaW1lU3RhbXBbZC5wcm9wZXJ0aWVzLmluZGV4XSxcbiAgICAgIC4uLmFjY2Vzc29yc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGVBbmltYXRpb25Eb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgLi4udGhpcy5jb25maWcuYW5pbWF0aW9uLFxuICAgICAgICBkb21haW5cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhKSB7XG4gICAgY29uc3QgZ2V0RmVhdHVyZSA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGlmIChnZXRGZWF0dXJlID09PSB0aGlzLm1ldGEuZ2V0RmVhdHVyZSkge1xuICAgICAgLy8gVE9ETzogcmV2aXNpdCB0aGlzIGFmdGVyIGdwdSBmaWx0ZXJpbmdcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSBnZXRHZW9qc29uRGF0YU1hcHMoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG5cbiAgICBjb25zdCB7ZGF0YVRvVGltZVN0YW1wLCBhbmltYXRpb25Eb21haW59ID0gcGFyc2VUcmlwR2VvSnNvblRpbWVzdGFtcCh0aGlzLmRhdGFUb0ZlYXR1cmUpO1xuXG4gICAgdGhpcy5kYXRhVG9UaW1lU3RhbXAgPSBkYXRhVG9UaW1lU3RhbXA7XG4gICAgdGhpcy51cGRhdGVBbmltYXRpb25Eb21haW4oYW5pbWF0aW9uRG9tYWluKTtcblxuICAgIC8vIGdldCBib3VuZHMgZnJvbSBmZWF0dXJlc1xuICAgIGNvbnN0IGJvdW5kcyA9IGdldEdlb2pzb25Cb3VuZHModGhpcy5kYXRhVG9GZWF0dXJlKTtcblxuICAgIC8vIGtlZXAgYSByZWNvcmQgb2Ygd2hhdCB0eXBlIG9mIGdlb21ldHJ5IHRoZSBjb2xsZWN0aW9uIGhhc1xuICAgIGNvbnN0IGZlYXR1cmVUeXBlcyA9IGdldEdlb2pzb25GZWF0dXJlVHlwZXModGhpcy5kYXRhVG9GZWF0dXJlKTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzLCBmZWF0dXJlVHlwZXMsIGdldEZlYXR1cmV9KTtcbiAgfVxuXG4gIHNldEluaXRpYWxMYXllckNvbmZpZyh7YWxsRGF0YX0pIHtcbiAgICB0aGlzLnVwZGF0ZUxheWVyTWV0YShhbGxEYXRhKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbmRlckxheWVyKG9wdHMpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ3B1RmlsdGVyLCBtYXBTdGF0ZSwgYW5pbWF0aW9uQ29uZmlnfSA9IG9wdHM7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCB6b29tRmFjdG9yID0gdGhpcy5nZXRab29tRmFjdG9yKG1hcFN0YXRlKTtcbiAgICBjb25zdCBpc1ZhbGlkVGltZSA9XG4gICAgICBhbmltYXRpb25Db25maWcgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoYW5pbWF0aW9uQ29uZmlnLmRvbWFpbikgJiZcbiAgICAgIGFuaW1hdGlvbkNvbmZpZy5kb21haW4uZXZlcnkoTnVtYmVyLmlzRmluaXRlKSAmJlxuICAgICAgTnVtYmVyLmlzRmluaXRlKGFuaW1hdGlvbkNvbmZpZy5jdXJyZW50VGltZSk7XG5cbiAgICBpZiAoIWlzVmFsaWRUaW1lKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZG9tYWluMCA9IGFuaW1hdGlvbkNvbmZpZy5kb21haW4/LlswXTtcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgLi4udGhpcy5nZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMoKSxcbiAgICAgIGdldFRpbWVzdGFtcHM6IHtcbiAgICAgICAgY29sdW1uczogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgICAgZG9tYWluMFxuICAgICAgfSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc1xuICAgIH07XG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMVHJpcHNMYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBnZXRUaW1lc3RhbXBzOiBkID0+IGRhdGEuZ2V0VGltZXN0YW1wcyhkKS5tYXAodHMgPT4gdHMgLSBkb21haW4wKSxcbiAgICAgICAgd2lkdGhTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiB6b29tRmFjdG9yVmFsdWUsXG4gICAgICAgIHJvdW5kZWQ6IHRydWUsXG4gICAgICAgIHdyYXBMb25naXR1ZGU6IGZhbHNlLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgZGVwdGhUZXN0OiBtYXBTdGF0ZS5kcmFnUm90YXRlLFxuICAgICAgICAgIGRlcHRoTWFzazogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgdHJhaWxMZW5ndGg6IHZpc0NvbmZpZy50cmFpbExlbmd0aCAqIDEwMDAsXG4gICAgICAgIGN1cnJlbnRUaW1lOiBhbmltYXRpb25Db25maWcuY3VycmVudFRpbWUgLSBkb21haW4wLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=