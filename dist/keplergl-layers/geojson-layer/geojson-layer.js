'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.featureResolver = exports.featureAccessor = exports.geoJsonRequiredColumns = exports.pointVisConfigs = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _deck = require('deck.gl');

var _colorUtils = require('../../utils/color-utils');

var _geojsonUtils = require('./geojson-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pointVisConfigs = exports.pointVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  radius: 'radius',

  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',

  'hi-precision': 'hi-precision',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};

var geoJsonRequiredColumns = exports.geoJsonRequiredColumns = ['geojson'];
var featureAccessor = exports.featureAccessor = function featureAccessor(_ref) {
  var geojson = _ref.geojson;
  return function (d) {
    return d[geojson.fieldIdx];
  };
};
var featureResolver = exports.featureResolver = function featureResolver(_ref2) {
  var geojson = _ref2.geojson;
  return geojson.fieldIdx;
};

var GeoJsonLayer = function (_Layer) {
  (0, _inherits3.default)(GeoJsonLayer, _Layer);

  function GeoJsonLayer(props) {
    (0, _classCallCheck3.default)(this, GeoJsonLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GeoJsonLayer.__proto__ || Object.getPrototypeOf(GeoJsonLayer)).call(this, props));

    _this.config = (0, _extends3.default)({}, _this.config, {

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add radius visual channel
      radiusField: null,
      radiusDomain: [0, 1],
      radiusScale: 'linear'
    });

    _this.dataToFeature = {};

    _this.registerVisConfig(pointVisConfigs);
    _this.getFeature = (0, _lodash2.default)(featureAccessor, featureResolver);
    return _this;
  }

  (0, _createClass3.default)(GeoJsonLayer, [{
    key: 'getHoverData',
    value: function getHoverData(object, allData) {
      // index of allData is saved to feature.properties
      return allData[object.properties.index];
    }
  }, {
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
      var _this2 = this;

      var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var _config = this.config,
          colorScale = _config.colorScale,
          colorField = _config.colorField,
          colorDomain = _config.colorDomain,
          color = _config.color,
          sizeScale = _config.sizeScale,
          sizeDomain = _config.sizeDomain,
          sizeField = _config.sizeField,
          heightField = _config.heightField,
          heightDomain = _config.heightDomain,
          heightScale = _config.heightScale,
          radiusField = _config.radiusField,
          radiusDomain = _config.radiusDomain,
          radiusScale = _config.radiusScale,
          visConfig = _config.visConfig,
          columns = _config.columns;
      var enable3d = visConfig.enable3d,
          stroked = visConfig.stroked,
          colorRange = visConfig.colorRange,
          heightRange = visConfig.heightRange,
          sizeRange = visConfig.sizeRange,
          radiusRange = visConfig.radiusRange;


      var getFeature = this.getFeature(columns);

      // geojson feature are object, if doesn't exists
      // create it and save to layer
      if (!oldLayerData || oldLayerData.getFeature !== getFeature) {
        this.updateLayerMeta(allData, getFeature);
      }

      var geojsonData = void 0;

      if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getFeature === getFeature) {
        // no need to create a new array of data
        // use updateTriggers to selectively re-calculate attributes
        geojsonData = oldLayerData.data;
      } else {
        // filteredIndex is a reference of index in allData which can map to feature
        geojsonData = filteredIndex.map(function (i) {
          return _this2.dataToFeature[i];
        }).filter(function (d) {
          return d;
        });
      }

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

      // calculate stroke scale - if stroked = true
      var sScale = sizeField && stroked && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

      // calculate elevation scale - if extruded = true
      var eScale = heightField && enable3d && this.getVisChannelScale(heightScale, heightDomain, heightRange);

      // point radius
      var rScale = radiusField && this.getVisChannelScale(radiusScale, radiusDomain, radiusRange);

      return {
        data: geojsonData,
        getFeature: getFeature,
        getFillColor: function getFillColor(d) {
          return cScale ? _this2.getEncodedChannelValue(cScale, allData[d.properties.index], colorField) : d.properties.fillColor || color;
        },
        getLineColor: function getLineColor(d) {
          return cScale ? _this2.getEncodedChannelValue(cScale, allData[d.properties.index], colorField) : d.properties.lineColor || color;
        },
        getLineWidth: function getLineWidth(d) {
          return sScale ? _this2.getEncodedChannelValue(sScale, allData[d.properties.index], sizeField, 0) : d.properties.lineWidth || 1;
        },
        getElevation: function getElevation(d) {
          return eScale ? _this2.getEncodedChannelValue(eScale, allData[d.properties.index], heightField, 0) : d.properties.elevation || 500;
        },
        getRadius: function getRadius(d) {
          return rScale ? _this2.getEncodedChannelValue(rScale, allData[d.properties.index], radiusField, 0) : d.properties.radius || 1;
        }
      };
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getFeature) {
      this.dataToFeature = (0, _geojsonUtils.getGeojsonDataMaps)(allData, getFeature);

      // calculate layer meta
      var allFeatures = Object.values(this.dataToFeature);

      // get bounds from features
      var bounds = (0, _geojsonUtils.getGeojsonBounds)(allFeatures);

      // get lightSettings from points
      var lightSettings = this.getLightSettingsFromBounds(bounds);

      // if any of the feature has properties.hi-precision set to be true
      var fp64 = Boolean(allFeatures.find(function (d) {
        return d && d.properties && d.properties['hi-precision'];
      }));
      var fixedRadius = Boolean(allFeatures.find(function (d) {
        return d && d.properties && d.properties.radius;
      }));

      // keep a record of what type of geometry the collection has
      var featureTypes = allFeatures.reduce(function (accu, f) {
        var geoType = (0, _geojsonUtils.featureToDeckGlGeoType)(f && f.geometry && f.geometry.type);

        if (geoType) {
          accu[geoType] = true;
        }
        return accu;
      }, {});

      this.updateMeta({ bounds: bounds, lightSettings: lightSettings, fp64: fp64, fixedRadius: fixedRadius, featureTypes: featureTypes });
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(_ref3) {
      var data = _ref3.data,
          idx = _ref3.idx,
          layerInteraction = _ref3.layerInteraction,
          objectHovered = _ref3.objectHovered,
          mapState = _ref3.mapState,
          interactionConfig = _ref3.interactionConfig;
      var _meta = this.meta,
          fp64 = _meta.fp64,
          lightSettings = _meta.lightSettings,
          fixedRadius = _meta.fixedRadius;

      var radiusScale = this.getRadiusScaleByZoom(mapState.zoom, fixedRadius);
      var zoomFactor = this.getZoomFactor(mapState.zoom);

      var layerProps = {
        // multiplier applied just so it being consistent with previously saved maps
        lineWidthScale: this.config.visConfig.thickness * zoomFactor * 8,
        lineWidthMinPixels: 1,
        elevationScale: this.config.visConfig.elevationScale,
        pointRadiusScale: radiusScale,
        fp64: fp64 || this.config.visConfig['hi-precision'],
        lineMiterLimit: 10 * zoomFactor,
        rounded: true
      };

      var updateTriggers = {
        getElevation: {
          heightField: this.config.heightField,
          heightScale: this.config.heightScale,
          heightRange: this.config.visConfig.heightRange
        },
        getFillColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: this.config.visConfig.colorRange,
          colorScale: this.config.colorScale
        },
        getLineColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: this.config.visConfig.colorRange,
          colorScale: this.config.colorScale
        },
        getLineWidth: {
          sizeField: this.config.sizeField,
          sizeRange: this.config.visConfig.sizeRange
        },
        getRadius: {
          radiusField: this.config.radiusField,
          radiusRange: this.config.visConfig.radiusRange
        }
      };

      return [new _deck.GeoJsonLayer((0, _extends3.default)({}, layerProps, layerInteraction, {
        id: this.id,
        idx: idx,
        data: data.data,
        getFillColor: data.getFillColor,
        getLineColor: data.getLineColor,
        getLineWidth: data.getLineWidth,
        getRadius: data.getRadius,
        getElevation: data.getElevation,
        pickable: true,
        opacity: this.config.visConfig.opacity,
        stroked: this.config.visConfig.stroked,
        filled: this.config.visConfig.filled,
        extruded: this.config.visConfig.enable3d,
        wireframe: this.config.visConfig.wireframe,
        lightSettings: lightSettings,
        updateTriggers: updateTriggers
      }))].concat((0, _toConsumableArray3.default)(this.isLayerHovered(objectHovered) ? [new _deck.GeoJsonLayer((0, _extends3.default)({}, layerProps, {
        id: this.id + '-hovered',
        data: [(0, _extends3.default)({}, objectHovered.object, {
          properties: (0, _extends3.default)({}, objectHovered.object.properties, {
            lineColor: this.config.highlightColor,
            fillColor: this.config.highlightColor
          }),
          getLineWidth: data.getLineWidth,
          getRadius: data.getRadius,
          getElevation: data.getElevation
        })],
        updateTriggers: updateTriggers,
        stroked: true,
        pickable: false,
        filled: false
      }))] : []));
    }
  }, {
    key: 'type',
    get: function get() {
      return 'geojson';
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return geoJsonRequiredColumns;
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, (0, _get3.default)(GeoJsonLayer.prototype.__proto__ || Object.getPrototypeOf(GeoJsonLayer.prototype), 'visualChannels', this), {
        size: (0, _extends3.default)({}, (0, _get3.default)(GeoJsonLayer.prototype.__proto__ || Object.getPrototypeOf(GeoJsonLayer.prototype), 'visualChannels', this).size, {
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
          channelScaleType: 'size',
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
          channelScaleType: 'radius'
        }
      });
    }
  }]);
  return GeoJsonLayer;
}(_baseLayer2.default);

exports.default = GeoJsonLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLWxheWVyLmpzIl0sIm5hbWVzIjpbInBvaW50VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwicmFkaXVzIiwic2l6ZVJhbmdlIiwicmFkaXVzUmFuZ2UiLCJoZWlnaHRSYW5nZSIsImVsZXZhdGlvblNjYWxlIiwic3Ryb2tlZCIsImZpbGxlZCIsImVuYWJsZTNkIiwid2lyZWZyYW1lIiwiZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyIsImZlYXR1cmVBY2Nlc3NvciIsImdlb2pzb24iLCJkIiwiZmllbGRJZHgiLCJmZWF0dXJlUmVzb2x2ZXIiLCJHZW9Kc29uTGF5ZXIiLCJwcm9wcyIsImNvbmZpZyIsImhlaWdodEZpZWxkIiwiaGVpZ2h0RG9tYWluIiwiaGVpZ2h0U2NhbGUiLCJyYWRpdXNGaWVsZCIsInJhZGl1c0RvbWFpbiIsInJhZGl1c1NjYWxlIiwiZGF0YVRvRmVhdHVyZSIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0RmVhdHVyZSIsIm9iamVjdCIsImFsbERhdGEiLCJwcm9wZXJ0aWVzIiwiaW5kZXgiLCJfIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbG9yU2NhbGUiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvciIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2x1bW5zIiwidXBkYXRlTGF5ZXJNZXRhIiwiZ2VvanNvbkRhdGEiLCJkYXRhIiwic2FtZURhdGEiLCJtYXAiLCJpIiwiZmlsdGVyIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwic1NjYWxlIiwiZVNjYWxlIiwiclNjYWxlIiwiZ2V0RmlsbENvbG9yIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImZpbGxDb2xvciIsImdldExpbmVDb2xvciIsImxpbmVDb2xvciIsImdldExpbmVXaWR0aCIsImxpbmVXaWR0aCIsImdldEVsZXZhdGlvbiIsImVsZXZhdGlvbiIsImdldFJhZGl1cyIsImFsbEZlYXR1cmVzIiwiT2JqZWN0IiwidmFsdWVzIiwiYm91bmRzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwiZnA2NCIsIkJvb2xlYW4iLCJmaW5kIiwiZml4ZWRSYWRpdXMiLCJmZWF0dXJlVHlwZXMiLCJyZWR1Y2UiLCJhY2N1IiwiZiIsImdlb1R5cGUiLCJnZW9tZXRyeSIsInR5cGUiLCJ1cGRhdGVNZXRhIiwiaWR4IiwibGF5ZXJJbnRlcmFjdGlvbiIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uQ29uZmlnIiwibWV0YSIsImdldFJhZGl1c1NjYWxlQnlab29tIiwiem9vbSIsInpvb21GYWN0b3IiLCJnZXRab29tRmFjdG9yIiwibGF5ZXJQcm9wcyIsImxpbmVXaWR0aFNjYWxlIiwibGluZVdpZHRoTWluUGl4ZWxzIiwicG9pbnRSYWRpdXNTY2FsZSIsImxpbmVNaXRlckxpbWl0Iiwicm91bmRlZCIsInVwZGF0ZVRyaWdnZXJzIiwiaWQiLCJwaWNrYWJsZSIsImV4dHJ1ZGVkIiwiaXNMYXllckhvdmVyZWQiLCJoaWdobGlnaHRDb2xvciIsInNpemUiLCJwcm9wZXJ0eSIsImNvbmRpdGlvbiIsImhlaWdodCIsImZpZWxkIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImtleSIsImNoYW5uZWxTY2FsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBTU8sSUFBTUEsNENBQWtCO0FBQzdCQyxXQUFTLFNBRG9CO0FBRTdCQyxhQUFXLFdBRmtCO0FBRzdCQyxjQUFZLFlBSGlCO0FBSTdCQyxVQUFRLFFBSnFCOztBQU03QkMsYUFBVyxrQkFOa0I7QUFPN0JDLGVBQWEsYUFQZ0I7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TkMsa0JBQVEsY0FKRjtBQUtOQyxpQkFBTyxhQUxEO0FBTU5DLGVBQUssUUFOQztBQU9OQyw0QkFBa0I7QUFQWjtBQWpCVjtBQTJCRDs7Ozs7a0JBM0RrQnJHLFkiLCJmaWxlIjoiZ2VvanNvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtHZW9Kc29uTGF5ZXIgYXMgRGVja0dMR2VvSnNvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7XG4gIGdldEdlb2pzb25EYXRhTWFwcyxcbiAgZ2V0R2VvanNvbkJvdW5kcyxcbiAgZmVhdHVyZVRvRGVja0dsR2VvVHlwZVxufSBmcm9tICcuL2dlb2pzb24tdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHRoaWNrbmVzczogJ3RoaWNrbmVzcycsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzOiAncmFkaXVzJyxcblxuICBzaXplUmFuZ2U6ICdzdHJva2VXaWR0aFJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gIGhlaWdodFJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuICBlbGV2YXRpb25TY2FsZTogJ2VsZXZhdGlvblNjYWxlJyxcblxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbicsXG4gIHN0cm9rZWQ6ICdzdHJva2VkJyxcbiAgZmlsbGVkOiAnZmlsbGVkJyxcbiAgZW5hYmxlM2Q6ICdlbmFibGUzZCcsXG4gIHdpcmVmcmFtZTogJ3dpcmVmcmFtZSdcbn07XG5cbmV4cG9ydCBjb25zdCBnZW9Kc29uUmVxdWlyZWRDb2x1bW5zID0gWydnZW9qc29uJ107XG5leHBvcnQgY29uc3QgZmVhdHVyZUFjY2Vzc29yID0gKHtnZW9qc29ufSkgPT4gZCA9PiBkW2dlb2pzb24uZmllbGRJZHhdO1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVSZXNvbHZlciA9ICh7Z2VvanNvbn0pID0+IGdlb2pzb24uZmllbGRJZHg7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlb0pzb25MYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi50aGlzLmNvbmZpZyxcblxuICAgICAgLy8gYWRkIGhlaWdodCB2aXN1YWwgY2hhbm5lbFxuICAgICAgaGVpZ2h0RmllbGQ6IG51bGwsXG4gICAgICBoZWlnaHREb21haW46IFswLCAxXSxcbiAgICAgIGhlaWdodFNjYWxlOiAnbGluZWFyJyxcblxuICAgICAgLy8gYWRkIHJhZGl1cyB2aXN1YWwgY2hhbm5lbFxuICAgICAgcmFkaXVzRmllbGQ6IG51bGwsXG4gICAgICByYWRpdXNEb21haW46IFswLCAxXSxcbiAgICAgIHJhZGl1c1NjYWxlOiAnbGluZWFyJ1xuICAgIH07XG5cbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSB7fTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcocG9pbnRWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldEZlYXR1cmUgPSBtZW1vaXplKGZlYXR1cmVBY2Nlc3NvciwgZmVhdHVyZVJlc29sdmVyKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnZ2VvanNvbic7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGdlb0pzb25SZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICBwcm9wZXJ0eTogJ3N0cm9rZScsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuc3Ryb2tlZFxuICAgICAgfSxcbiAgICAgIGhlaWdodDoge1xuICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXG4gICAgICAgIGZpZWxkOiAnaGVpZ2h0RmllbGQnLFxuICAgICAgICBzY2FsZTogJ2hlaWdodFNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnaGVpZ2h0RG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdoZWlnaHRSYW5nZScsXG4gICAgICAgIGtleTogJ2hlaWdodCcsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6ICdzaXplJyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgfSxcbiAgICAgIHJhZGl1czoge1xuICAgICAgICBwcm9wZXJ0eTogJ3JhZGl1cycsXG4gICAgICAgIGZpZWxkOiAncmFkaXVzRmllbGQnLFxuICAgICAgICBzY2FsZTogJ3JhZGl1c1NjYWxlJyxcbiAgICAgICAgZG9tYWluOiAncmFkaXVzRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gICAgICAgIGtleTogJ3JhZGl1cycsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6ICdyYWRpdXMnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEpIHtcbiAgICAvLyBpbmRleCBvZiBhbGxEYXRhIGlzIHNhdmVkIHRvIGZlYXR1cmUucHJvcGVydGllc1xuICAgIHJldHVybiBhbGxEYXRhW29iamVjdC5wcm9wZXJ0aWVzLmluZGV4XTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIGhlaWdodEZpZWxkLFxuICAgICAgaGVpZ2h0RG9tYWluLFxuICAgICAgaGVpZ2h0U2NhbGUsXG4gICAgICByYWRpdXNGaWVsZCxcbiAgICAgIHJhZGl1c0RvbWFpbixcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgdmlzQ29uZmlnLFxuICAgICAgY29sdW1uc1xuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZTNkLFxuICAgICAgc3Ryb2tlZCxcbiAgICAgIGNvbG9yUmFuZ2UsXG4gICAgICBoZWlnaHRSYW5nZSxcbiAgICAgIHNpemVSYW5nZSxcbiAgICAgIHJhZGl1c1JhbmdlXG4gICAgfSA9IHZpc0NvbmZpZztcblxuICAgIGNvbnN0IGdldEZlYXR1cmUgPSB0aGlzLmdldEZlYXR1cmUoY29sdW1ucyk7XG5cbiAgICAvLyBnZW9qc29uIGZlYXR1cmUgYXJlIG9iamVjdCwgaWYgZG9lc24ndCBleGlzdHNcbiAgICAvLyBjcmVhdGUgaXQgYW5kIHNhdmUgdG8gbGF5ZXJcbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0RmVhdHVyZSAhPT0gZ2V0RmVhdHVyZSkge1xuICAgICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG4gICAgfVxuXG4gICAgbGV0IGdlb2pzb25EYXRhO1xuXG4gICAgaWYgKFxuICAgICAgb2xkTGF5ZXJEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZGF0YSAmJlxuICAgICAgb3B0LnNhbWVEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZ2V0RmVhdHVyZSA9PT0gZ2V0RmVhdHVyZVxuICAgICkge1xuICAgICAgLy8gbm8gbmVlZCB0byBjcmVhdGUgYSBuZXcgYXJyYXkgb2YgZGF0YVxuICAgICAgLy8gdXNlIHVwZGF0ZVRyaWdnZXJzIHRvIHNlbGVjdGl2ZWx5IHJlLWNhbGN1bGF0ZSBhdHRyaWJ1dGVzXG4gICAgICBnZW9qc29uRGF0YSA9IG9sZExheWVyRGF0YS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmaWx0ZXJlZEluZGV4IGlzIGEgcmVmZXJlbmNlIG9mIGluZGV4IGluIGFsbERhdGEgd2hpY2ggY2FuIG1hcCB0byBmZWF0dXJlXG4gICAgICBnZW9qc29uRGF0YSA9IGZpbHRlcmVkSW5kZXhcbiAgICAgICAgLm1hcChpID0+IHRoaXMuZGF0YVRvRmVhdHVyZVtpXSlcbiAgICAgICAgLmZpbHRlcihkID0+IGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgY29sb3JTY2FsZSxcbiAgICAgICAgY29sb3JEb21haW4sXG4gICAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICAgICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgc3Ryb2tlIHNjYWxlIC0gaWYgc3Ryb2tlZCA9IHRydWVcbiAgICBjb25zdCBzU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmXG4gICAgICBzdHJva2VkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVSYW5nZSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgZWxldmF0aW9uIHNjYWxlIC0gaWYgZXh0cnVkZWQgPSB0cnVlXG4gICAgY29uc3QgZVNjYWxlID1cbiAgICAgIGhlaWdodEZpZWxkICYmXG4gICAgICBlbmFibGUzZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoaGVpZ2h0U2NhbGUsIGhlaWdodERvbWFpbiwgaGVpZ2h0UmFuZ2UpO1xuXG4gICAgLy8gcG9pbnQgcmFkaXVzXG4gICAgY29uc3QgclNjYWxlID1cbiAgICAgIHJhZGl1c0ZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShyYWRpdXNTY2FsZSwgcmFkaXVzRG9tYWluLCByYWRpdXNSYW5nZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogZ2VvanNvbkRhdGEsXG4gICAgICBnZXRGZWF0dXJlLFxuICAgICAgZ2V0RmlsbENvbG9yOiBkID0+XG4gICAgICAgIGNTY2FsZVxuICAgICAgICAgID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgICAgICAgICAgICBjU2NhbGUsXG4gICAgICAgICAgICAgIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSxcbiAgICAgICAgICAgICAgY29sb3JGaWVsZFxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogZC5wcm9wZXJ0aWVzLmZpbGxDb2xvciB8fCBjb2xvcixcbiAgICAgIGdldExpbmVDb2xvcjogZCA9PlxuICAgICAgICBjU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICAgICAgICAgICAgY1NjYWxlLFxuICAgICAgICAgICAgICBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sXG4gICAgICAgICAgICAgIGNvbG9yRmllbGRcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5saW5lQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRMaW5lV2lkdGg6IGQgPT5cbiAgICAgICAgc1NjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgICAgICAgICAgIHNTY2FsZSxcbiAgICAgICAgICAgICAgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLFxuICAgICAgICAgICAgICBzaXplRmllbGQsXG4gICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5saW5lV2lkdGggfHwgMSxcbiAgICAgIGdldEVsZXZhdGlvbjogZCA9PlxuICAgICAgICBlU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICAgICAgICAgICAgZVNjYWxlLFxuICAgICAgICAgICAgICBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sXG4gICAgICAgICAgICAgIGhlaWdodEZpZWxkLFxuICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBkLnByb3BlcnRpZXMuZWxldmF0aW9uIHx8IDUwMCxcbiAgICAgIGdldFJhZGl1czogZCA9PlxuICAgICAgICByU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICAgICAgICAgICAgclNjYWxlLFxuICAgICAgICAgICAgICBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sXG4gICAgICAgICAgICAgIHJhZGl1c0ZpZWxkLFxuICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBkLnByb3BlcnRpZXMucmFkaXVzIHx8IDFcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldEZlYXR1cmUpIHtcbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSBnZXRHZW9qc29uRGF0YU1hcHMoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgbGF5ZXIgbWV0YVxuICAgIGNvbnN0IGFsbEZlYXR1cmVzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGFUb0ZlYXR1cmUpO1xuXG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIGZlYXR1cmVzXG4gICAgY29uc3QgYm91bmRzID0gZ2V0R2VvanNvbkJvdW5kcyhhbGxGZWF0dXJlcyk7XG5cbiAgICAvLyBnZXQgbGlnaHRTZXR0aW5ncyBmcm9tIHBvaW50c1xuICAgIGNvbnN0IGxpZ2h0U2V0dGluZ3MgPSB0aGlzLmdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJvdW5kcyk7XG5cbiAgICAvLyBpZiBhbnkgb2YgdGhlIGZlYXR1cmUgaGFzIHByb3BlcnRpZXMuaGktcHJlY2lzaW9uIHNldCB0byBiZSB0cnVlXG4gICAgY29uc3QgZnA2NCA9IEJvb2xlYW4oXG4gICAgICBhbGxGZWF0dXJlcy5maW5kKGQgPT4gZCAmJiBkLnByb3BlcnRpZXMgJiYgZC5wcm9wZXJ0aWVzWydoaS1wcmVjaXNpb24nXSlcbiAgICApO1xuICAgIGNvbnN0IGZpeGVkUmFkaXVzID0gQm9vbGVhbihcbiAgICAgIGFsbEZlYXR1cmVzLmZpbmQoZCA9PiBkICYmIGQucHJvcGVydGllcyAmJiBkLnByb3BlcnRpZXMucmFkaXVzKVxuICAgICk7XG5cbiAgICAvLyBrZWVwIGEgcmVjb3JkIG9mIHdoYXQgdHlwZSBvZiBnZW9tZXRyeSB0aGUgY29sbGVjdGlvbiBoYXNcbiAgICBjb25zdCBmZWF0dXJlVHlwZXMgPSBhbGxGZWF0dXJlcy5yZWR1Y2UoKGFjY3UsIGYpID0+IHtcbiAgICAgIGNvbnN0IGdlb1R5cGUgPSBmZWF0dXJlVG9EZWNrR2xHZW9UeXBlKFxuICAgICAgICBmICYmIGYuZ2VvbWV0cnkgJiYgZi5nZW9tZXRyeS50eXBlXG4gICAgICApO1xuXG4gICAgICBpZiAoZ2VvVHlwZSkge1xuICAgICAgICBhY2N1W2dlb1R5cGVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1O1xuICAgIH0sIHt9KTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzLCBsaWdodFNldHRpbmdzLCBmcDY0LCBmaXhlZFJhZGl1cywgZmVhdHVyZVR5cGVzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcih7XG4gICAgZGF0YSxcbiAgICBpZHgsXG4gICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIG1hcFN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH0pIHtcbiAgICBjb25zdCB7ZnA2NCwgbGlnaHRTZXR0aW5ncywgZml4ZWRSYWRpdXN9ID0gdGhpcy5tZXRhO1xuICAgIGNvbnN0IHJhZGl1c1NjYWxlID0gdGhpcy5nZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZS56b29tLCBmaXhlZFJhZGl1cyk7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICAvLyBtdWx0aXBsaWVyIGFwcGxpZWQganVzdCBzbyBpdCBiZWluZyBjb25zaXN0ZW50IHdpdGggcHJldmlvdXNseSBzYXZlZCBtYXBzXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiA4LFxuICAgICAgbGluZVdpZHRoTWluUGl4ZWxzOiAxLFxuICAgICAgZWxldmF0aW9uU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHJhZGl1c1NjYWxlLFxuICAgICAgZnA2NDogZnA2NCB8fCB0aGlzLmNvbmZpZy52aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgbGluZU1pdGVyTGltaXQ6IDEwICogem9vbUZhY3RvcixcbiAgICAgIHJvdW5kZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRFbGV2YXRpb246IHtcbiAgICAgICAgaGVpZ2h0RmllbGQ6IHRoaXMuY29uZmlnLmhlaWdodEZpZWxkLFxuICAgICAgICBoZWlnaHRTY2FsZTogdGhpcy5jb25maWcuaGVpZ2h0U2NhbGUsXG4gICAgICAgIGhlaWdodFJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuaGVpZ2h0UmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRGaWxsQ29sb3I6IHtcbiAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldExpbmVDb2xvcjoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0TGluZVdpZHRoOiB7XG4gICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgcmFkaXVzRmllbGQ6IHRoaXMuY29uZmlnLnJhZGl1c0ZpZWxkLFxuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnJhZGl1c1JhbmdlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMR2VvSnNvbkxheWVyKHtcbiAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgZGF0YTogZGF0YS5kYXRhLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IGRhdGEuZ2V0RmlsbENvbG9yLFxuICAgICAgICBnZXRMaW5lQ29sb3I6IGRhdGEuZ2V0TGluZUNvbG9yLFxuICAgICAgICBnZXRMaW5lV2lkdGg6IGRhdGEuZ2V0TGluZVdpZHRoLFxuICAgICAgICBnZXRSYWRpdXM6IGRhdGEuZ2V0UmFkaXVzLFxuICAgICAgICBnZXRFbGV2YXRpb246IGRhdGEuZ2V0RWxldmF0aW9uLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5jb25maWcudmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBmaWxsZWQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maWxsZWQsXG4gICAgICAgIGV4dHJ1ZGVkOiB0aGlzLmNvbmZpZy52aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIHdpcmVmcmFtZTogdGhpcy5jb25maWcudmlzQ29uZmlnLndpcmVmcmFtZSxcbiAgICAgICAgbGlnaHRTZXR0aW5ncyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnNcbiAgICAgIH0pLFxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZClcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgRGVja0dMR2VvSnNvbkxheWVyKHtcbiAgICAgICAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgLi4ub2JqZWN0SG92ZXJlZC5vYmplY3QsXG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9iamVjdEhvdmVyZWQub2JqZWN0LnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgICAgIGxpbmVDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3JcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBnZXRMaW5lV2lkdGg6IGRhdGEuZ2V0TGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgZ2V0UmFkaXVzOiBkYXRhLmdldFJhZGl1cyxcbiAgICAgICAgICAgICAgICAgIGdldEVsZXZhdGlvbjogZGF0YS5nZXRFbGV2YXRpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgICAgICBzdHJva2VkOiB0cnVlLFxuICAgICAgICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIGZpbGxlZDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==