'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.featureResolver = exports.featureAccessor = exports.geoJsonRequiredColumns = exports.pointVisConfigs = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, props));

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

  GeoJsonLayer.prototype.getHoverData = function getHoverData(object, allData) {
    // index of allData is saved to feature.properties
    return allData[object.properties.index];
  };

  GeoJsonLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
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
  };

  GeoJsonLayer.prototype.updateLayerMeta = function updateLayerMeta(allData, getFeature) {
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
  };

  GeoJsonLayer.prototype.renderLayer = function renderLayer(_ref3) {
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
    }))].concat(this.isLayerHovered(objectHovered) ? [new _deck.GeoJsonLayer((0, _extends3.default)({}, layerProps, {
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
    }))] : []);
  };

  (0, _createClass3.default)(GeoJsonLayer, [{
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
      return (0, _extends3.default)({}, _Layer.prototype.visualChannels, {
        size: (0, _extends3.default)({}, _Layer.prototype.visualChannels.size, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLWxheWVyLmpzIl0sIm5hbWVzIjpbInBvaW50VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwicmFkaXVzIiwic2l6ZVJhbmdlIiwicmFkaXVzUmFuZ2UiLCJoZWlnaHRSYW5nZSIsImVsZXZhdGlvblNjYWxlIiwic3Ryb2tlZCIsImZpbGxlZCIsImVuYWJsZTNkIiwid2lyZWZyYW1lIiwiZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyIsImZlYXR1cmVBY2Nlc3NvciIsImdlb2pzb24iLCJkIiwiZmllbGRJZHgiLCJmZWF0dXJlUmVzb2x2ZXIiLCJHZW9Kc29uTGF5ZXIiLCJwcm9wcyIsImNvbmZpZyIsImhlaWdodEZpZWxkIiwiaGVpZ2h0RG9tYWluIiwiaGVpZ2h0U2NhbGUiLCJyYWRpdXNGaWVsZCIsInJhZGl1c0RvbWFpbiIsInJhZGl1c1NjYWxlIiwiZGF0YVRvRmVhdHVyZSIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0RmVhdHVyZSIsImdldEhvdmVyRGF0YSIsIm9iamVjdCIsImFsbERhdGEiLCJwcm9wZXJ0aWVzIiwiaW5kZXgiLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbG9yU2NhbGUiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvciIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2x1bW5zIiwidXBkYXRlTGF5ZXJNZXRhIiwiZ2VvanNvbkRhdGEiLCJkYXRhIiwic2FtZURhdGEiLCJtYXAiLCJpIiwiZmlsdGVyIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwic1NjYWxlIiwiZVNjYWxlIiwiclNjYWxlIiwiZ2V0RmlsbENvbG9yIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImZpbGxDb2xvciIsImdldExpbmVDb2xvciIsImxpbmVDb2xvciIsImdldExpbmVXaWR0aCIsImxpbmVXaWR0aCIsImdldEVsZXZhdGlvbiIsImVsZXZhdGlvbiIsImdldFJhZGl1cyIsImFsbEZlYXR1cmVzIiwiT2JqZWN0IiwidmFsdWVzIiwiYm91bmRzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwiZnA2NCIsIkJvb2xlYW4iLCJmaW5kIiwiZml4ZWRSYWRpdXMiLCJmZWF0dXJlVHlwZXMiLCJyZWR1Y2UiLCJhY2N1IiwiZiIsImdlb1R5cGUiLCJnZW9tZXRyeSIsInR5cGUiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJtZXRhIiwiZ2V0UmFkaXVzU2NhbGVCeVpvb20iLCJ6b29tIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJsYXllclByb3BzIiwibGluZVdpZHRoU2NhbGUiLCJsaW5lV2lkdGhNaW5QaXhlbHMiLCJwb2ludFJhZGl1c1NjYWxlIiwibGluZU1pdGVyTGltaXQiLCJyb3VuZGVkIiwidXBkYXRlVHJpZ2dlcnMiLCJpZCIsInBpY2thYmxlIiwiZXh0cnVkZWQiLCJpc0xheWVySG92ZXJlZCIsImhpZ2hsaWdodENvbG9yIiwidmlzdWFsQ2hhbm5lbHMiLCJzaXplIiwicHJvcGVydHkiLCJjb25kaXRpb24iLCJoZWlnaHQiLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFNTyxJQUFNQSw0Q0FBa0I7QUFDN0JDLFdBQVMsU0FEb0I7QUFFN0JDLGFBQVcsV0FGa0I7QUFHN0JDLGNBQVksWUFIaUI7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QUssUUFOQztBQU9OQyw0QkFBa0IsTUFQWjtBQVFOUCxxQkFBVztBQUFBLG1CQUFVaEcsT0FBTzJCLFNBQVAsQ0FBaUJyQyxRQUEzQjtBQUFBO0FBUkwsU0FQVjtBQWlCRVAsZ0JBQVE7QUFDTmdILG9CQUFVLFFBREo7QUFFTkcsaUJBQU8sYUFGRDtBQUdOQyxpQkFBTyxhQUhEO0FBSU5DLGtCQUFRLGNBSkY7QUFLTkMsaUJBQU8sYUFMRDtBQU1OQyxlQUFLLFFBTkM7QUFPTkMsNEJBQWtCO0FBUFo7QUFqQlY7QUEyQkQ7Ozs7O2tCQTNEa0J6RyxZIiwiZmlsZSI6Imdlb2pzb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7R2VvSnNvbkxheWVyIGFzIERlY2tHTEdlb0pzb25MYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge1xuICBnZXRHZW9qc29uRGF0YU1hcHMsXG4gIGdldEdlb2pzb25Cb3VuZHMsXG4gIGZlYXR1cmVUb0RlY2tHbEdlb1R5cGVcbn0gZnJvbSAnLi9nZW9qc29uLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IHBvaW50VmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1czogJ3JhZGl1cycsXG5cbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICBoZWlnaHRSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG5cbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nLFxuICBzdHJva2VkOiAnc3Ryb2tlZCcsXG4gIGZpbGxlZDogJ2ZpbGxlZCcsXG4gIGVuYWJsZTNkOiAnZW5hYmxlM2QnLFxuICB3aXJlZnJhbWU6ICd3aXJlZnJhbWUnXG59O1xuXG5leHBvcnQgY29uc3QgZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyA9IFsnZ2VvanNvbiddO1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVBY2Nlc3NvciA9ICh7Z2VvanNvbn0pID0+IGQgPT4gZFtnZW9qc29uLmZpZWxkSWR4XTtcbmV4cG9ydCBjb25zdCBmZWF0dXJlUmVzb2x2ZXIgPSAoe2dlb2pzb259KSA9PiBnZW9qc29uLmZpZWxkSWR4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW9Kc29uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4udGhpcy5jb25maWcsXG5cbiAgICAgIC8vIGFkZCBoZWlnaHQgdmlzdWFsIGNoYW5uZWxcbiAgICAgIGhlaWdodEZpZWxkOiBudWxsLFxuICAgICAgaGVpZ2h0RG9tYWluOiBbMCwgMV0sXG4gICAgICBoZWlnaHRTY2FsZTogJ2xpbmVhcicsXG5cbiAgICAgIC8vIGFkZCByYWRpdXMgdmlzdWFsIGNoYW5uZWxcbiAgICAgIHJhZGl1c0ZpZWxkOiBudWxsLFxuICAgICAgcmFkaXVzRG9tYWluOiBbMCwgMV0sXG4gICAgICByYWRpdXNTY2FsZTogJ2xpbmVhcidcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0ge307XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKHBvaW50VmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRGZWF0dXJlID0gbWVtb2l6ZShmZWF0dXJlQWNjZXNzb3IsIGZlYXR1cmVSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2dlb2pzb24nO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBnZW9Kc29uUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2UnLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZWRcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IHtcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ2hlaWdodEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdoZWlnaHRTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2hlaWdodERvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnaGVpZ2h0UmFuZ2UnLFxuICAgICAgICBrZXk6ICdoZWlnaHQnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAnc2l6ZScsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZW5hYmxlM2RcbiAgICAgIH0sXG4gICAgICByYWRpdXM6IHtcbiAgICAgICAgcHJvcGVydHk6ICdyYWRpdXMnLFxuICAgICAgICBmaWVsZDogJ3JhZGl1c0ZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdyYWRpdXNTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3JhZGl1c0RvbWFpbicsXG4gICAgICAgIHJhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAgICAgICBrZXk6ICdyYWRpdXMnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAncmFkaXVzJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0LCBhbGxEYXRhKSB7XG4gICAgLy8gaW5kZXggb2YgYWxsRGF0YSBpcyBzYXZlZCB0byBmZWF0dXJlLnByb3BlcnRpZXNcbiAgICByZXR1cm4gYWxsRGF0YVtvYmplY3QucHJvcGVydGllcy5pbmRleF07XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtjb2xvclNjYWxlLCBjb2xvckZpZWxkLCBjb2xvckRvbWFpbiwgY29sb3IsXG4gICAgICBzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVGaWVsZCxcbiAgICAgIGhlaWdodEZpZWxkLCBoZWlnaHREb21haW4sIGhlaWdodFNjYWxlLFxuICAgICAgcmFkaXVzRmllbGQsIHJhZGl1c0RvbWFpbiwgcmFkaXVzU2NhbGUsXG4gICAgICB2aXNDb25maWcsIGNvbHVtbnNcbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCB7ZW5hYmxlM2QsIHN0cm9rZWQsIGNvbG9yUmFuZ2UsIGhlaWdodFJhbmdlLCBzaXplUmFuZ2UsIHJhZGl1c1JhbmdlfSA9IHZpc0NvbmZpZztcblxuICAgIGNvbnN0IGdldEZlYXR1cmUgPSB0aGlzLmdldEZlYXR1cmUoY29sdW1ucyk7XG5cbiAgICAvLyBnZW9qc29uIGZlYXR1cmUgYXJlIG9iamVjdCwgaWYgZG9lc24ndCBleGlzdHNcbiAgICAvLyBjcmVhdGUgaXQgYW5kIHNhdmUgdG8gbGF5ZXJcbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0RmVhdHVyZSAhPT0gZ2V0RmVhdHVyZSkge1xuICAgICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG4gICAgfVxuXG4gICAgbGV0IGdlb2pzb25EYXRhO1xuXG4gICAgaWYgKG9sZExheWVyRGF0YSAmJiBvbGRMYXllckRhdGEuZGF0YSAmJiBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRGZWF0dXJlID09PSBnZXRGZWF0dXJlKSB7XG5cbiAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGFycmF5IG9mIGRhdGFcbiAgICAgIC8vIHVzZSB1cGRhdGVUcmlnZ2VycyB0byBzZWxlY3RpdmVseSByZS1jYWxjdWxhdGUgYXR0cmlidXRlc1xuICAgICAgZ2VvanNvbkRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAvLyBmaWx0ZXJlZEluZGV4IGlzIGEgcmVmZXJlbmNlIG9mIGluZGV4IGluIGFsbERhdGEgd2hpY2ggY2FuIG1hcCB0byBmZWF0dXJlXG4gICAgICBnZW9qc29uRGF0YSA9IGZpbHRlcmVkSW5kZXgubWFwKGkgPT4gdGhpcy5kYXRhVG9GZWF0dXJlW2ldKS5maWx0ZXIoZCA9PiBkKTtcbiAgICB9XG5cbiAgICBjb25zdCBjU2NhbGUgPSBjb2xvckZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgc3Ryb2tlIHNjYWxlIC0gaWYgc3Ryb2tlZCA9IHRydWVcbiAgICBjb25zdCBzU2NhbGUgPSBzaXplRmllbGQgJiYgc3Ryb2tlZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICBzaXplUmFuZ2VcbiAgICApO1xuXG4gICAgLy8gY2FsY3VsYXRlIGVsZXZhdGlvbiBzY2FsZSAtIGlmIGV4dHJ1ZGVkID0gdHJ1ZVxuICAgIGNvbnN0IGVTY2FsZSA9IGhlaWdodEZpZWxkICYmIGVuYWJsZTNkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgaGVpZ2h0U2NhbGUsXG4gICAgICBoZWlnaHREb21haW4sXG4gICAgICBoZWlnaHRSYW5nZVxuICAgICk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPSByYWRpdXNGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgcmFkaXVzRG9tYWluLFxuICAgICAgcmFkaXVzUmFuZ2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGdlb2pzb25EYXRhLFxuICAgICAgZ2V0RmVhdHVyZSxcbiAgICAgIGdldEZpbGxDb2xvcjogZCA9PiBjU2NhbGUgP1xuICAgICAgICB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sIGNvbG9yRmllbGQpIDogKGQucHJvcGVydGllcy5maWxsQ29sb3IgfHwgY29sb3IpLFxuICAgICAgZ2V0TGluZUNvbG9yOiBkID0+IGNTY2FsZSA/XG4gICAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgY29sb3JGaWVsZCkgOiAoZC5wcm9wZXJ0aWVzLmxpbmVDb2xvciB8fCBjb2xvciksXG4gICAgICBnZXRMaW5lV2lkdGg6IGQgPT4gc1NjYWxlID9cbiAgICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLCBzaXplRmllbGQsIDApIDogKGQucHJvcGVydGllcy5saW5lV2lkdGggfHwgMSksXG4gICAgICBnZXRFbGV2YXRpb246IGQgPT4gZVNjYWxlID9cbiAgICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGVTY2FsZSwgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLCBoZWlnaHRGaWVsZCwgMCkgOiAoZC5wcm9wZXJ0aWVzLmVsZXZhdGlvbiB8fCA1MDApLFxuICAgICAgZ2V0UmFkaXVzOiBkID0+IHJTY2FsZSA/XG4gICAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShyU2NhbGUsIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSwgcmFkaXVzRmllbGQsIDApIDogKGQucHJvcGVydGllcy5yYWRpdXMgfHwgMSlcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldEZlYXR1cmUpIHtcbiAgICB0aGlzLmRhdGFUb0ZlYXR1cmUgPSBnZXRHZW9qc29uRGF0YU1hcHMoYWxsRGF0YSwgZ2V0RmVhdHVyZSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgbGF5ZXIgbWV0YVxuICAgIGNvbnN0IGFsbEZlYXR1cmVzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGFUb0ZlYXR1cmUpO1xuXG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIGZlYXR1cmVzXG4gICAgY29uc3QgYm91bmRzID0gZ2V0R2VvanNvbkJvdW5kcyhhbGxGZWF0dXJlcyk7XG5cbiAgICAvLyBnZXQgbGlnaHRTZXR0aW5ncyBmcm9tIHBvaW50c1xuICAgIGNvbnN0IGxpZ2h0U2V0dGluZ3MgPSB0aGlzLmdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJvdW5kcyk7XG5cbiAgICAvLyBpZiBhbnkgb2YgdGhlIGZlYXR1cmUgaGFzIHByb3BlcnRpZXMuaGktcHJlY2lzaW9uIHNldCB0byBiZSB0cnVlXG4gICAgY29uc3QgZnA2NCA9IEJvb2xlYW4oYWxsRmVhdHVyZXMuZmluZChkID0+IGQgJiYgZC5wcm9wZXJ0aWVzICYmIGQucHJvcGVydGllc1snaGktcHJlY2lzaW9uJ10pKTtcbiAgICBjb25zdCBmaXhlZFJhZGl1cyA9IEJvb2xlYW4oYWxsRmVhdHVyZXMuZmluZChkID0+IGQgJiYgZC5wcm9wZXJ0aWVzICYmIGQucHJvcGVydGllcy5yYWRpdXMpKTtcblxuICAgIC8vIGtlZXAgYSByZWNvcmQgb2Ygd2hhdCB0eXBlIG9mIGdlb21ldHJ5IHRoZSBjb2xsZWN0aW9uIGhhc1xuICAgIGNvbnN0IGZlYXR1cmVUeXBlcyA9IGFsbEZlYXR1cmVzLnJlZHVjZSgoYWNjdSwgZikgPT4ge1xuICAgICAgY29uc3QgZ2VvVHlwZSA9IGZlYXR1cmVUb0RlY2tHbEdlb1R5cGUoZiAmJiBmLmdlb21ldHJ5ICYmIGYuZ2VvbWV0cnkudHlwZSk7XG5cbiAgICAgIGlmIChnZW9UeXBlKSB7XG4gICAgICAgIGFjY3VbZ2VvVHlwZV0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSwge30pO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHMsIGxpZ2h0U2V0dGluZ3MsIGZwNjQsIGZpeGVkUmFkaXVzLCBmZWF0dXJlVHlwZXN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtkYXRhLCBpZHgsIGxheWVySW50ZXJhY3Rpb24sIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30pIHtcbiAgICBjb25zdCB7ZnA2NCwgbGlnaHRTZXR0aW5ncywgZml4ZWRSYWRpdXN9ID0gdGhpcy5tZXRhO1xuICAgIGNvbnN0IHJhZGl1c1NjYWxlID0gdGhpcy5nZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZS56b29tLCBmaXhlZFJhZGl1cyk7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICAvLyBtdWx0aXBsaWVyIGFwcGxpZWQganVzdCBzbyBpdCBiZWluZyBjb25zaXN0ZW50IHdpdGggcHJldmlvdXNseSBzYXZlZCBtYXBzXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyAqIHpvb21GYWN0b3IgKiA4LFxuICAgICAgbGluZVdpZHRoTWluUGl4ZWxzOiAxLFxuICAgICAgZWxldmF0aW9uU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHJhZGl1c1NjYWxlLFxuICAgICAgZnA2NDogZnA2NCB8fCB0aGlzLmNvbmZpZy52aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgbGluZU1pdGVyTGltaXQ6IDEwICogem9vbUZhY3RvcixcbiAgICAgIHJvdW5kZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRFbGV2YXRpb246IHtcbiAgICAgICAgaGVpZ2h0RmllbGQ6IHRoaXMuY29uZmlnLmhlaWdodEZpZWxkLFxuICAgICAgICBoZWlnaHRTY2FsZTogdGhpcy5jb25maWcuaGVpZ2h0U2NhbGUsXG4gICAgICAgIGhlaWdodFJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuaGVpZ2h0UmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRGaWxsQ29sb3I6IHtcbiAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldExpbmVDb2xvcjoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0TGluZVdpZHRoOiB7XG4gICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgIH0sXG4gICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgcmFkaXVzRmllbGQ6IHRoaXMuY29uZmlnLnJhZGl1c0ZpZWxkLFxuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnJhZGl1c1JhbmdlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMR2VvSnNvbkxheWVyKHtcbiAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgZGF0YTogZGF0YS5kYXRhLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IGRhdGEuZ2V0RmlsbENvbG9yLFxuICAgICAgICBnZXRMaW5lQ29sb3I6IGRhdGEuZ2V0TGluZUNvbG9yLFxuICAgICAgICBnZXRMaW5lV2lkdGg6IGRhdGEuZ2V0TGluZVdpZHRoLFxuICAgICAgICBnZXRSYWRpdXM6IGRhdGEuZ2V0UmFkaXVzLFxuICAgICAgICBnZXRFbGV2YXRpb246IGRhdGEuZ2V0RWxldmF0aW9uLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5jb25maWcudmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VkLFxuICAgICAgICBmaWxsZWQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maWxsZWQsXG4gICAgICAgIGV4dHJ1ZGVkOiB0aGlzLmNvbmZpZy52aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIHdpcmVmcmFtZTogdGhpcy5jb25maWcudmlzQ29uZmlnLndpcmVmcmFtZSxcbiAgICAgICAgbGlnaHRTZXR0aW5ncyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnNcbiAgICAgIH0pLFxuICAgICAgLi4udGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKSA/IFtcbiAgICAgICAgbmV3IERlY2tHTEdlb0pzb25MYXllcih7XG4gICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgZGF0YTogW3tcbiAgICAgICAgICAuLi5vYmplY3RIb3ZlcmVkLm9iamVjdCxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAuLi5vYmplY3RIb3ZlcmVkLm9iamVjdC5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgbGluZUNvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgIGZpbGxDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3JcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExpbmVXaWR0aDogZGF0YS5nZXRMaW5lV2lkdGgsXG4gICAgICAgICAgZ2V0UmFkaXVzOiBkYXRhLmdldFJhZGl1cyxcbiAgICAgICAgICBnZXRFbGV2YXRpb246IGRhdGEuZ2V0RWxldmF0aW9uXG4gICAgICAgIH1dLFxuICAgICAgICB1cGRhdGVUcmlnZ2VycyxcbiAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICBmaWxsZWQ6IGZhbHNlXG4gICAgICB9KV0gOiBbXVxuICAgIF07XG4gIH1cbn1cbiJdfQ==