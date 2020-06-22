"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.featureResolver = exports.featureAccessor = exports.geoJsonRequiredColumns = exports.tripVisConfigs = exports.defaultWidth = exports.defaultThickness = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _lodash2 = _interopRequireDefault(require("lodash.uniq"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _geoLayers = require("@deck.gl/geo-layers");

var _defaultSettings = require("../../constants/default-settings");

var _tripLayerIcon = _interopRequireDefault(require("./trip-layer-icon"));

var _geojsonUtils = require("../geojson-layer/geojson-utils");

var _tripUtils = require("./trip-utils");

var _colorUtils = require("../../utils/color-utils");

var _tripInfoModal = _interopRequireDefault(require("./trip-info-modal"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var zoomFactorValue = 8;
var defaultThickness = 0.5;
exports.defaultThickness = defaultThickness;
var defaultWidth = 1;
exports.defaultWidth = defaultWidth;
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

var TripLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(TripLayer, _Layer);

  function TripLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, TripLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TripLayer).call(this, props));
    _this.dataToFeature = [];
    _this.dataToTimeStamp = [];

    _this.registerVisConfig(tripVisConfigs);

    _this.getFeature = (0, _lodash["default"])(featureAccessor, featureResolver);
    _this._layerInfoModal = (0, _tripInfoModal["default"])();
    return _this;
  }

  (0, _createClass2["default"])(TripLayer, [{
    key: "getPositionAccessor",
    value: function getPositionAccessor() {
      return this.getFeature(this.config.columns);
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig(props) {
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(TripLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
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
      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorField = _this$config.colorField,
          colorDomain = _this$config.colorDomain,
          color = _this$config.color,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          sizeField = _this$config.sizeField,
          visConfig = _this$config.visConfig;
      var colorRange = visConfig.colorRange,
          sizeRange = visConfig.sizeRange;
      var _datasets$this$config = datasets[this.config.dataId],
          allData = _datasets$this$config.allData,
          gpuFilter = _datasets$this$config.gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data; // color


      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // calculate stroke scale - if stroked = true

      var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange); // access feature properties from geojson sub layer

      var getDataForGpuFilter = function getDataForGpuFilter(f) {
        return allData[f.properties.index];
      };

      var getIndexForGpuFilter = function getIndexForGpuFilter(f) {
        return f.properties.index;
      };

      return {
        data: data,
        getFilterValue: gpuFilter.filterValueAccessor(getIndexForGpuFilter, getDataForGpuFilter),
        getPath: function getPath(d) {
          return d.geometry.coordinates;
        },
        getTimestamps: function getTimestamps(d) {
          return _this3.dataToTimeStamp[d.properties.index];
        },
        getColor: function getColor(d) {
          return cScale ? _this3.getEncodedChannelValue(cScale, allData[d.properties.index], colorField) : d.properties.fillColor || color;
        },
        getWidth: function getWidth(d) {
          return sScale ? _this3.getEncodedChannelValue(sScale, allData[d.properties.index], sizeField, 0) : d.properties.lineWidth || defaultWidth;
        }
      };
    }
  }, {
    key: "updateAnimationDomain",
    value: function updateAnimationDomain(domain) {
      this.updateLayerConfig({
        animation: _objectSpread({}, this.config.animation, {
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
    value: function setInitialLayerConfig(allData) {
      this.updateLayerMeta(allData);
      return this;
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          mapState = opts.mapState,
          animationConfig = opts.animationConfig;
      var visConfig = this.config.visConfig;
      var zoomFactor = this.getZoomFactor(mapState);
      var updateTriggers = {
        getColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: visConfig.colorRange,
          colorScale: this.config.colorScale
        },
        getWidth: {
          sizeField: this.config.sizeField,
          sizeRange: visConfig.sizeRange
        },
        getTimestamps: {
          columns: this.config.columns,
          domain0: animationConfig.domain[0]
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      return [new _geoLayers.TripsLayer(_objectSpread({}, defaultLayerProps, {}, data, {
        getTimestamps: function getTimestamps(d) {
          return data.getTimestamps(d).map(function (ts) {
            return ts - animationConfig.domain[0];
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
        currentTime: animationConfig.currentTime - animationConfig.domain[0],
        updateTriggers: updateTriggers
      }))];
    }
  }, {
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
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(TripLayer.prototype), "visualChannels", this), {
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(TripLayer.prototype), "visualChannels", this).size, {
          property: 'stroke',
          condition: function condition(config) {
            return config.visConfig.stroked;
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
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref4, foundLayers) {
      var _this4 = this;

      var label = _ref4.label,
          _ref4$fields = _ref4.fields,
          fields = _ref4$fields === void 0 ? [] : _ref4$fields,
          _ref4$allData = _ref4.allData,
          allData = _ref4$allData === void 0 ? [] : _ref4$allData,
          id = _ref4.id;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvdHJpcC1sYXllci90cmlwLWxheWVyLmpzIl0sIm5hbWVzIjpbInpvb21GYWN0b3JWYWx1ZSIsImRlZmF1bHRUaGlja25lc3MiLCJkZWZhdWx0V2lkdGgiLCJ0cmlwVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJ0eXBlIiwiZGVmYXVsdFZhbHVlIiwibGFiZWwiLCJpc1JhbmdlZCIsInJhbmdlIiwic3RlcCIsImdyb3VwIiwicHJvcGVydHkiLCJjb2xvclJhbmdlIiwidHJhaWxMZW5ndGgiLCJzaXplUmFuZ2UiLCJnZW9Kc29uUmVxdWlyZWRDb2x1bW5zIiwiZmVhdHVyZUFjY2Vzc29yIiwiZ2VvanNvbiIsImQiLCJmaWVsZElkeCIsImZlYXR1cmVSZXNvbHZlciIsIlRyaXBMYXllciIsInByb3BzIiwiZGF0YVRvRmVhdHVyZSIsImRhdGFUb1RpbWVTdGFtcCIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0RmVhdHVyZSIsIl9sYXllckluZm9Nb2RhbCIsImNvbmZpZyIsImNvbHVtbnMiLCJhbmltYXRpb24iLCJlbmFibGVkIiwiZG9tYWluIiwib2JqZWN0IiwiYWxsRGF0YSIsInByb3BlcnRpZXMiLCJpbmRleCIsImdldFBvc2l0aW9uIiwiZmlsdGVyZWRJbmRleCIsIm1hcCIsImkiLCJmaWx0ZXIiLCJnZW9tZXRyeSIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwiY29sb3JTY2FsZSIsImNvbG9yRmllbGQiLCJjb2xvckRvbWFpbiIsImNvbG9yIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsImRhdGFJZCIsImdwdUZpbHRlciIsInVwZGF0ZURhdGEiLCJkYXRhIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwiaGV4VG9SZ2IiLCJzU2NhbGUiLCJnZXREYXRhRm9yR3B1RmlsdGVyIiwiZiIsImdldEluZGV4Rm9yR3B1RmlsdGVyIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiZ2V0UGF0aCIsImNvb3JkaW5hdGVzIiwiZ2V0VGltZXN0YW1wcyIsImdldENvbG9yIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImZpbGxDb2xvciIsImdldFdpZHRoIiwibGluZVdpZHRoIiwidXBkYXRlTGF5ZXJDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwibWV0YSIsImFuaW1hdGlvbkRvbWFpbiIsInVwZGF0ZUFuaW1hdGlvbkRvbWFpbiIsImJvdW5kcyIsImZlYXR1cmVUeXBlcyIsInVwZGF0ZU1ldGEiLCJ1cGRhdGVMYXllck1ldGEiLCJvcHRzIiwibWFwU3RhdGUiLCJhbmltYXRpb25Db25maWciLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsInVwZGF0ZVRyaWdnZXJzIiwiZG9tYWluMCIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsIkRlY2tHTFRyaXBzTGF5ZXIiLCJ0cyIsIndpZHRoU2NhbGUiLCJyb3VuZGVkIiwid3JhcExvbmdpdHVkZSIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJkcmFnUm90YXRlIiwiZGVwdGhNYXNrIiwiY3VycmVudFRpbWUiLCJUcmlwTGF5ZXJJY29uIiwic2l6ZSIsImNvbmRpdGlvbiIsInN0cm9rZWQiLCJpZCIsInRlbXBsYXRlIiwibW9kYWxQcm9wcyIsInRpdGxlIiwiZm91bmRMYXllcnMiLCJmaWVsZHMiLCJnZW9qc29uQ29sdW1ucyIsIm5hbWUiLCJkZWZhdWx0Q29sdW1ucyIsIkdFT0pTT05fRklFTERTIiwiZ2VvSnNvbkNvbHVtbnMiLCJmaW5kRGVmYXVsdENvbHVtbkZpZWxkIiwidHJpcENvbHVtbnMiLCJjb2wiLCJsZW5ndGgiLCJyZXBsYWNlIiwiaXNWaXNpYmxlIiwicHJvcCIsImZpbmQiLCJjIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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O0FBQVIsU0FBUDtBQUNEOztBQUVELGFBQU87QUFDTEEsUUFBQUEsS0FBSyxFQUFFa0csV0FBVyxDQUFDakYsR0FBWixDQUFnQixVQUFBVixPQUFPO0FBQUEsaUJBQUs7QUFDakN2QixZQUFBQSxLQUFLLEVBQUcsT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUE2QkEsS0FBSyxDQUFDcUgsT0FBTixDQUFjLFdBQWQsRUFBMkIsRUFBM0IsQ0FBOUIsSUFBaUUsTUFBSSxDQUFDdkgsSUFENUM7QUFFakN5QixZQUFBQSxPQUFPLEVBQVBBLE9BRmlDO0FBR2pDK0YsWUFBQUEsU0FBUyxFQUFFO0FBSHNCLFdBQUw7QUFBQSxTQUF2QixDQURGO0FBT0w7QUFDQVosUUFBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUN2RSxNQUFaLENBQ1gsVUFBQW9GLElBQUk7QUFBQSxpQkFDRkEsSUFBSSxDQUFDekgsSUFBTCxLQUFjLFNBQWQsSUFDQXlILElBQUksQ0FBQ3hFLE1BQUwsS0FBZ0J1RCxFQURoQixJQUVBLENBQUNZLFdBQVcsQ0FBQ00sSUFBWixDQUFpQixVQUFBQyxDQUFDO0FBQUEsbUJBQUlGLElBQUksQ0FBQ2hHLE9BQUwsQ0FBYVosT0FBYixDQUFxQmtHLElBQXJCLEtBQThCWSxDQUFDLENBQUM5RyxPQUFGLENBQVVrRyxJQUE1QztBQUFBLFdBQWxCLENBSEM7QUFBQSxTQURPO0FBUlIsT0FBUDtBQWVEOzs7RUF6Rm9DYSxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7VHJpcHNMYXllciBhcyBEZWNrR0xUcmlwc0xheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcblxuaW1wb3J0IHtHRU9KU09OX0ZJRUxEU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IFRyaXBMYXllckljb24gZnJvbSAnLi90cmlwLWxheWVyLWljb24nO1xuXG5pbXBvcnQge1xuICBnZXRHZW9qc29uRGF0YU1hcHMsXG4gIGdldEdlb2pzb25Cb3VuZHMsXG4gIGdldEdlb2pzb25GZWF0dXJlVHlwZXNcbn0gZnJvbSAnbGF5ZXJzL2dlb2pzb24tbGF5ZXIvZ2VvanNvbi11dGlscyc7XG5cbmltcG9ydCB7aXNUcmlwR2VvSnNvbkZpZWxkLCBwYXJzZVRyaXBHZW9Kc29uVGltZXN0YW1wfSBmcm9tICcuL3RyaXAtdXRpbHMnO1xuXG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQgVHJpcEluZm9Nb2RhbEZhY3RvcnkgZnJvbSAnLi90cmlwLWluZm8tbW9kYWwnO1xuXG5jb25zdCB6b29tRmFjdG9yVmFsdWUgPSA4O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFRoaWNrbmVzcyA9IDAuNTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0V2lkdGggPSAxO1xuXG5leHBvcnQgY29uc3QgdHJpcFZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgdGhpY2tuZXNzOiB7XG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VGhpY2tuZXNzLFxuICAgIGxhYmVsOiAnU3Ryb2tlIFdpZHRoJyxcbiAgICBpc1JhbmdlZDogZmFsc2UsXG4gICAgcmFuZ2U6IFswLCAxMDBdLFxuICAgIHN0ZXA6IDAuMSxcbiAgICBncm91cDogJ3N0cm9rZScsXG4gICAgcHJvcGVydHk6ICd0aGlja25lc3MnXG4gIH0sXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgdHJhaWxMZW5ndGg6ICd0cmFpbExlbmd0aCcsXG4gIHNpemVSYW5nZTogJ3N0cm9rZVdpZHRoUmFuZ2UnXG59O1xuXG5leHBvcnQgY29uc3QgZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyA9IFsnZ2VvanNvbiddO1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVBY2Nlc3NvciA9ICh7Z2VvanNvbn0pID0+IGQgPT4gZFtnZW9qc29uLmZpZWxkSWR4XTtcbmV4cG9ydCBjb25zdCBmZWF0dXJlUmVzb2x2ZXIgPSAoe2dlb2pzb259KSA9PiBnZW9qc29uLmZpZWxkSWR4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlwTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0gW107XG4gICAgdGhpcy5kYXRhVG9UaW1lU3RhbXAgPSBbXTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKHRyaXBWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldEZlYXR1cmUgPSBtZW1vaXplKGZlYXR1cmVBY2Nlc3NvciwgZmVhdHVyZVJlc29sdmVyKTtcbiAgICB0aGlzLl9sYXllckluZm9Nb2RhbCA9IFRyaXBJbmZvTW9kYWxGYWN0b3J5KCk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ3RyaXAnO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuICdUcmlwJztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFRyaXBMYXllckljb247XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGdlb0pzb25SZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldCBhbmltYXRpb25Eb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmFuaW1hdGlvbi5kb21haW47XG4gIH1cblxuICBnZXQgbGF5ZXJJbmZvTW9kYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAnaWNvbkluZm8nLFxuICAgICAgdGVtcGxhdGU6IHRoaXMuX2xheWVySW5mb01vZGFsLFxuICAgICAgbW9kYWxQcm9wczoge1xuICAgICAgICB0aXRsZTogJ21vZGFsLnRyaXBJbmZvLnRpdGxlJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRQb3NpdGlvbkFjY2Vzc29yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZlYXR1cmUodGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtsYWJlbCwgZmllbGRzID0gW10sIGFsbERhdGEgPSBbXSwgaWR9LCBmb3VuZExheWVycykge1xuICAgIGNvbnN0IGdlb2pzb25Db2x1bW5zID0gZmllbGRzLmZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2dlb2pzb24nKS5tYXAoZiA9PiBmLm5hbWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdENvbHVtbnMgPSB7XG4gICAgICBnZW9qc29uOiB1bmlxKFsuLi5HRU9KU09OX0ZJRUxEUy5nZW9qc29uLCAuLi5nZW9qc29uQ29sdW1uc10pXG4gICAgfTtcblxuICAgIGNvbnN0IGdlb0pzb25Db2x1bW5zID0gdGhpcy5maW5kRGVmYXVsdENvbHVtbkZpZWxkKGRlZmF1bHRDb2x1bW5zLCBmaWVsZHMpO1xuXG4gICAgY29uc3QgdHJpcENvbHVtbnMgPSAoZ2VvSnNvbkNvbHVtbnMgfHwgW10pLmZpbHRlcihjb2wgPT5cbiAgICAgIGlzVHJpcEdlb0pzb25GaWVsZChhbGxEYXRhLCBmaWVsZHNbY29sLmdlb2pzb24uZmllbGRJZHhdKVxuICAgICk7XG5cbiAgICBpZiAoIXRyaXBDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtwcm9wczogW119O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm9wczogdHJpcENvbHVtbnMubWFwKGNvbHVtbnMgPT4gKHtcbiAgICAgICAgbGFiZWw6ICh0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnICYmIGxhYmVsLnJlcGxhY2UoL1xcLlteLy5dKyQvLCAnJykpIHx8IHRoaXMudHlwZSxcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgaXNWaXNpYmxlOiB0cnVlXG4gICAgICB9KSksXG5cbiAgICAgIC8vIGlmIGEgZ2VvanNvbiBsYXllciBpcyBjcmVhdGVkIGZyb20gdGhpcyBjb2x1bW4sIGRlbGV0ZSBpdFxuICAgICAgZm91bmRMYXllcnM6IGZvdW5kTGF5ZXJzLmZpbHRlcihcbiAgICAgICAgcHJvcCA9PlxuICAgICAgICAgIHByb3AudHlwZSAhPT0gJ2dlb2pzb24nIHx8XG4gICAgICAgICAgcHJvcC5kYXRhSWQgIT09IGlkIHx8XG4gICAgICAgICAgIXRyaXBDb2x1bW5zLmZpbmQoYyA9PiBwcm9wLmNvbHVtbnMuZ2VvanNvbi5uYW1lID09PSBjLmdlb2pzb24ubmFtZSlcbiAgICAgIClcbiAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLmdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyksXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZG9tYWluOiBudWxsXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEpIHtcbiAgICAvLyBpbmRleCBvZiBhbGxEYXRhIGlzIHNhdmVkIHRvIGZlYXR1cmUucHJvcGVydGllc1xuICAgIHJldHVybiBhbGxEYXRhW29iamVjdC5wcm9wZXJ0aWVzLmluZGV4XTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXh9LCBnZXRQb3NpdGlvbikge1xuICAgIHJldHVybiBmaWx0ZXJlZEluZGV4XG4gICAgICAubWFwKGkgPT4gdGhpcy5kYXRhVG9GZWF0dXJlW2ldKVxuICAgICAgLmZpbHRlcihkID0+IGQgJiYgZC5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpIHtcbiAgICAvLyB0by1kbzogcGFyc2Ugc2VnbWVudCBmcm9tIGFsbERhdGFcblxuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvcixcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICBzaXplRmllbGQsXG4gICAgICB2aXNDb25maWdcbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCB7Y29sb3JSYW5nZSwgc2l6ZVJhbmdlfSA9IHZpc0NvbmZpZztcbiAgICBjb25zdCB7YWxsRGF0YSwgZ3B1RmlsdGVyfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy51cGRhdGVEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpO1xuXG4gICAgLy8gY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoY29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYikpO1xuICAgIC8vIGNhbGN1bGF0ZSBzdHJva2Ugc2NhbGUgLSBpZiBzdHJva2VkID0gdHJ1ZVxuICAgIGNvbnN0IHNTY2FsZSA9IHNpemVGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVSYW5nZSk7XG4gICAgLy8gYWNjZXNzIGZlYXR1cmUgcHJvcGVydGllcyBmcm9tIGdlb2pzb24gc3ViIGxheWVyXG4gICAgY29uc3QgZ2V0RGF0YUZvckdwdUZpbHRlciA9IGYgPT4gYWxsRGF0YVtmLnByb3BlcnRpZXMuaW5kZXhdO1xuICAgIGNvbnN0IGdldEluZGV4Rm9yR3B1RmlsdGVyID0gZiA9PiBmLnByb3BlcnRpZXMuaW5kZXg7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcihnZXRJbmRleEZvckdwdUZpbHRlciwgZ2V0RGF0YUZvckdwdUZpbHRlciksXG4gICAgICBnZXRQYXRoOiBkID0+IGQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICBnZXRUaW1lc3RhbXBzOiBkID0+IHRoaXMuZGF0YVRvVGltZVN0YW1wW2QucHJvcGVydGllcy5pbmRleF0sXG4gICAgICBnZXRDb2xvcjogZCA9PlxuICAgICAgICBjU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgY29sb3JGaWVsZClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5maWxsQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRXaWR0aDogZCA9PlxuICAgICAgICBzU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShzU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgc2l6ZUZpZWxkLCAwKVxuICAgICAgICAgIDogZC5wcm9wZXJ0aWVzLmxpbmVXaWR0aCB8fCBkZWZhdWx0V2lkdGhcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlQW5pbWF0aW9uRG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIC4uLnRoaXMuY29uZmlnLmFuaW1hdGlvbixcbiAgICAgICAgZG9tYWluXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSkge1xuICAgIGNvbnN0IGdldEZlYXR1cmUgPSB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcbiAgICBpZiAoZ2V0RmVhdHVyZSA9PT0gdGhpcy5tZXRhLmdldEZlYXR1cmUpIHtcbiAgICAgIC8vIFRPRE86IHJldmlzaXQgdGhpcyBhZnRlciBncHUgZmlsdGVyaW5nXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0gZ2V0R2VvanNvbkRhdGFNYXBzKGFsbERhdGEsIGdldEZlYXR1cmUpO1xuXG4gICAgY29uc3Qge2RhdGFUb1RpbWVTdGFtcCwgYW5pbWF0aW9uRG9tYWlufSA9IHBhcnNlVHJpcEdlb0pzb25UaW1lc3RhbXAodGhpcy5kYXRhVG9GZWF0dXJlKTtcblxuICAgIHRoaXMuZGF0YVRvVGltZVN0YW1wID0gZGF0YVRvVGltZVN0YW1wO1xuICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uRG9tYWluKGFuaW1hdGlvbkRvbWFpbik7XG5cbiAgICAvLyBnZXQgYm91bmRzIGZyb20gZmVhdHVyZXNcbiAgICBjb25zdCBib3VuZHMgPSBnZXRHZW9qc29uQm91bmRzKHRoaXMuZGF0YVRvRmVhdHVyZSk7XG5cbiAgICAvLyBrZWVwIGEgcmVjb3JkIG9mIHdoYXQgdHlwZSBvZiBnZW9tZXRyeSB0aGUgY29sbGVjdGlvbiBoYXNcbiAgICBjb25zdCBmZWF0dXJlVHlwZXMgPSBnZXRHZW9qc29uRmVhdHVyZVR5cGVzKHRoaXMuZGF0YVRvRmVhdHVyZSk7XG5cbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kcywgZmVhdHVyZVR5cGVzLCBnZXRGZWF0dXJlfSk7XG4gIH1cblxuICBzZXRJbml0aWFsTGF5ZXJDb25maWcoYWxsRGF0YSkge1xuICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG1hcFN0YXRlLCBhbmltYXRpb25Db25maWd9ID0gb3B0cztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRDb2xvcjoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0V2lkdGg6IHtcbiAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICAgIHNpemVSYW5nZTogdmlzQ29uZmlnLnNpemVSYW5nZVxuICAgICAgfSxcbiAgICAgIGdldFRpbWVzdGFtcHM6IHtcbiAgICAgICAgY29sdW1uczogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgICAgZG9tYWluMDogYW5pbWF0aW9uQ29uZmlnLmRvbWFpblswXVxuICAgICAgfSxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc1xuICAgIH07XG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMVHJpcHNMYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBnZXRUaW1lc3RhbXBzOiBkID0+IGRhdGEuZ2V0VGltZXN0YW1wcyhkKS5tYXAodHMgPT4gdHMgLSBhbmltYXRpb25Db25maWcuZG9tYWluWzBdKSxcbiAgICAgICAgd2lkdGhTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiB6b29tRmFjdG9yVmFsdWUsXG4gICAgICAgIHJvdW5kZWQ6IHRydWUsXG4gICAgICAgIHdyYXBMb25naXR1ZGU6IGZhbHNlLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgZGVwdGhUZXN0OiBtYXBTdGF0ZS5kcmFnUm90YXRlLFxuICAgICAgICAgIGRlcHRoTWFzazogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgdHJhaWxMZW5ndGg6IHZpc0NvbmZpZy50cmFpbExlbmd0aCAqIDEwMDAsXG4gICAgICAgIGN1cnJlbnRUaW1lOiBhbmltYXRpb25Db25maWcuY3VycmVudFRpbWUgLSBhbmltYXRpb25Db25maWcuZG9tYWluWzBdLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=