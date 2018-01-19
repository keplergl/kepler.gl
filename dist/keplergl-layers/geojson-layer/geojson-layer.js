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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ2VvanNvbi1sYXllci9nZW9qc29uLWxheWVyLmpzIl0sIm5hbWVzIjpbInBvaW50VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwicmFkaXVzIiwic2l6ZVJhbmdlIiwicmFkaXVzUmFuZ2UiLCJoZWlnaHRSYW5nZSIsImVsZXZhdGlvblNjYWxlIiwic3Ryb2tlZCIsImZpbGxlZCIsImVuYWJsZTNkIiwid2lyZWZyYW1lIiwiZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyIsImZlYXR1cmVBY2Nlc3NvciIsImdlb2pzb24iLCJkIiwiZmllbGRJZHgiLCJmZWF0dXJlUmVzb2x2ZXIiLCJHZW9Kc29uTGF5ZXIiLCJwcm9wcyIsImNvbmZpZyIsImhlaWdodEZpZWxkIiwiaGVpZ2h0RG9tYWluIiwiaGVpZ2h0U2NhbGUiLCJyYWRpdXNGaWVsZCIsInJhZGl1c0RvbWFpbiIsInJhZGl1c1NjYWxlIiwiZGF0YVRvRmVhdHVyZSIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0RmVhdHVyZSIsImdldEhvdmVyRGF0YSIsIm9iamVjdCIsImFsbERhdGEiLCJwcm9wZXJ0aWVzIiwiaW5kZXgiLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbG9yU2NhbGUiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvciIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2x1bW5zIiwidXBkYXRlTGF5ZXJNZXRhIiwiZ2VvanNvbkRhdGEiLCJkYXRhIiwic2FtZURhdGEiLCJtYXAiLCJpIiwiZmlsdGVyIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwic1NjYWxlIiwiZVNjYWxlIiwiclNjYWxlIiwiZ2V0RmlsbENvbG9yIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImZpbGxDb2xvciIsImdldExpbmVDb2xvciIsImxpbmVDb2xvciIsImdldExpbmVXaWR0aCIsImxpbmVXaWR0aCIsImdldEVsZXZhdGlvbiIsImVsZXZhdGlvbiIsImdldFJhZGl1cyIsImFsbEZlYXR1cmVzIiwiT2JqZWN0IiwidmFsdWVzIiwiYm91bmRzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwiZnA2NCIsIkJvb2xlYW4iLCJmaW5kIiwiZml4ZWRSYWRpdXMiLCJmZWF0dXJlVHlwZXMiLCJyZWR1Y2UiLCJhY2N1IiwiZiIsImdlb1R5cGUiLCJnZW9tZXRyeSIsInR5cGUiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJtZXRhIiwiZ2V0UmFkaXVzU2NhbGVCeVpvb20iLCJ6b29tIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJsYXllclByb3BzIiwibGluZVdpZHRoU2NhbGUiLCJsaW5lV2lkdGhNaW5QaXhlbHMiLCJwb2ludFJhZGl1c1NjYWxlIiwibGluZU1pdGVyTGltaXQiLCJyb3VuZGVkIiwidXBkYXRlVHJpZ2dlcnMiLCJpZCIsInBpY2thYmxlIiwiZXh0cnVkZWQiLCJpc0xheWVySG92ZXJlZCIsImhpZ2hsaWdodENvbG9yIiwidmlzdWFsQ2hhbm5lbHMiLCJzaXplIiwicHJvcGVydHkiLCJjb25kaXRpb24iLCJoZWlnaHQiLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFNTyxJQUFNQSw0Q0FBa0I7QUFDN0JDLFdBQVMsU0FEb0I7QUFFN0JDLGFBQVcsV0FGa0I7QUFHN0JDLGNBQVksWUFIaUI7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VztBQUFBLG1CQUFVaEcsT0FBTzJCLFNBQVAsQ0FBaUJyQyxRQUEzQjtBQUFBO0FBUkwsU0FQVjtBQWlCRVAsZ0JBQVE7QUFDTmdILG9CQUFVLFFBREo7QUFFTkcsaUJBQU8sYUFGRDtBQUdOQyxpQkFBTyxhQUhEO0FBSU5DLGtCQUFRLGNBSkY7QUFLTkMsaUJBQU8sYUFMRDtBQU1OQyxlQUFLLFFBTkM7QUFPTkMsNEJBQWtCO0FBUFo7QUFqQlY7QUEyQkQ7Ozs7O2tCQTNEa0J6RyxZIiwiZmlsZSI6Imdlb2pzb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7R2VvSnNvbkxheWVyIGFzIERlY2tHTEdlb0pzb25MYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge1xuICBnZXRHZW9qc29uRGF0YU1hcHMsXG4gIGdldEdlb2pzb25Cb3VuZHMsXG4gIGZlYXR1cmVUb0RlY2tHbEdlb1R5cGVcbn0gZnJvbSAnLi9nZW9qc29uLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IHBvaW50VmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1czogJ3JhZGl1cycsXG5cbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICBoZWlnaHRSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG5cbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nLFxuICBzdHJva2VkOiAnc3Ryb2tlZCcsXG4gIGZpbGxlZDogJ2ZpbGxlZCcsXG4gIGVuYWJsZTNkOiAnZW5hYmxlM2QnLFxuICB3aXJlZnJhbWU6ICd3aXJlZnJhbWUnXG59O1xuXG5leHBvcnQgY29uc3QgZ2VvSnNvblJlcXVpcmVkQ29sdW1ucyA9IFsnZ2VvanNvbiddO1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVBY2Nlc3NvciA9ICh7Z2VvanNvbn0pID0+IGQgPT4gZFtnZW9qc29uLmZpZWxkSWR4XTtcbmV4cG9ydCBjb25zdCBmZWF0dXJlUmVzb2x2ZXIgPSAoe2dlb2pzb259KSA9PiBnZW9qc29uLmZpZWxkSWR4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW9Kc29uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4udGhpcy5jb25maWcsXG5cbiAgICAgIC8vIGFkZCBoZWlnaHQgdmlzdWFsIGNoYW5uZWxcbiAgICAgIGhlaWdodEZpZWxkOiBudWxsLFxuICAgICAgaGVpZ2h0RG9tYWluOiBbMCwgMV0sXG4gICAgICBoZWlnaHRTY2FsZTogJ2xpbmVhcicsXG5cbiAgICAgIC8vIGFkZCByYWRpdXMgdmlzdWFsIGNoYW5uZWxcbiAgICAgIHJhZGl1c0ZpZWxkOiBudWxsLFxuICAgICAgcmFkaXVzRG9tYWluOiBbMCwgMV0sXG4gICAgICByYWRpdXNTY2FsZTogJ2xpbmVhcidcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0ge307XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKHBvaW50VmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRGZWF0dXJlID0gbWVtb2l6ZShmZWF0dXJlQWNjZXNzb3IsIGZlYXR1cmVSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2dlb2pzb24nO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBnZW9Kc29uUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2UnLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnN0cm9rZWRcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IHtcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ2hlaWdodEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdoZWlnaHRTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2hlaWdodERvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnaGVpZ2h0UmFuZ2UnLFxuICAgICAgICBrZXk6ICdoZWlnaHQnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAnc2l6ZScsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZmlnID0+IGNvbmZpZy52aXNDb25maWcuZW5hYmxlM2RcbiAgICAgIH0sXG4gICAgICByYWRpdXM6IHtcbiAgICAgICAgcHJvcGVydHk6ICdyYWRpdXMnLFxuICAgICAgICBmaWVsZDogJ3JhZGl1c0ZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdyYWRpdXNTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3JhZGl1c0RvbWFpbicsXG4gICAgICAgIHJhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAgICAgICBrZXk6ICdyYWRpdXMnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAncmFkaXVzJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0LCBhbGxEYXRhKSB7XG4gICAgLy8gaW5kZXggb2YgYWxsRGF0YSBpcyBzYXZlZCB0byBmZWF0dXJlLnByb3BlcnRpZXNcbiAgICByZXR1cm4gYWxsRGF0YVtvYmplY3QucHJvcGVydGllcy5pbmRleF07XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvcixcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICBzaXplRmllbGQsXG4gICAgICBoZWlnaHRGaWVsZCxcbiAgICAgIGhlaWdodERvbWFpbixcbiAgICAgIGhlaWdodFNjYWxlLFxuICAgICAgcmFkaXVzRmllbGQsXG4gICAgICByYWRpdXNEb21haW4sXG4gICAgICByYWRpdXNTY2FsZSxcbiAgICAgIHZpc0NvbmZpZyxcbiAgICAgIGNvbHVtbnNcbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCB7XG4gICAgICBlbmFibGUzZCxcbiAgICAgIHN0cm9rZWQsXG4gICAgICBjb2xvclJhbmdlLFxuICAgICAgaGVpZ2h0UmFuZ2UsXG4gICAgICBzaXplUmFuZ2UsXG4gICAgICByYWRpdXNSYW5nZVxuICAgIH0gPSB2aXNDb25maWc7XG5cbiAgICBjb25zdCBnZXRGZWF0dXJlID0gdGhpcy5nZXRGZWF0dXJlKGNvbHVtbnMpO1xuXG4gICAgLy8gZ2VvanNvbiBmZWF0dXJlIGFyZSBvYmplY3QsIGlmIGRvZXNuJ3QgZXhpc3RzXG4gICAgLy8gY3JlYXRlIGl0IGFuZCBzYXZlIHRvIGxheWVyXG4gICAgaWYgKCFvbGRMYXllckRhdGEgfHwgb2xkTGF5ZXJEYXRhLmdldEZlYXR1cmUgIT09IGdldEZlYXR1cmUpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldEZlYXR1cmUpO1xuICAgIH1cblxuICAgIGxldCBnZW9qc29uRGF0YTtcblxuICAgIGlmIChcbiAgICAgIG9sZExheWVyRGF0YSAmJlxuICAgICAgb2xkTGF5ZXJEYXRhLmRhdGEgJiZcbiAgICAgIG9wdC5zYW1lRGF0YSAmJlxuICAgICAgb2xkTGF5ZXJEYXRhLmdldEZlYXR1cmUgPT09IGdldEZlYXR1cmVcbiAgICApIHtcbiAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGFycmF5IG9mIGRhdGFcbiAgICAgIC8vIHVzZSB1cGRhdGVUcmlnZ2VycyB0byBzZWxlY3RpdmVseSByZS1jYWxjdWxhdGUgYXR0cmlidXRlc1xuICAgICAgZ2VvanNvbkRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZmlsdGVyZWRJbmRleCBpcyBhIHJlZmVyZW5jZSBvZiBpbmRleCBpbiBhbGxEYXRhIHdoaWNoIGNhbiBtYXAgdG8gZmVhdHVyZVxuICAgICAgZ2VvanNvbkRhdGEgPSBmaWx0ZXJlZEluZGV4XG4gICAgICAgIC5tYXAoaSA9PiB0aGlzLmRhdGFUb0ZlYXR1cmVbaV0pXG4gICAgICAgIC5maWx0ZXIoZCA9PiBkKTtcbiAgICB9XG5cbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoXG4gICAgICAgIGNvbG9yU2NhbGUsXG4gICAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgICBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpXG4gICAgICApO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0cm9rZSBzY2FsZSAtIGlmIHN0cm9rZWQgPSB0cnVlXG4gICAgY29uc3Qgc1NjYWxlID1cbiAgICAgIHNpemVGaWVsZCAmJlxuICAgICAgc3Ryb2tlZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoc2l6ZVNjYWxlLCBzaXplRG9tYWluLCBzaXplUmFuZ2UpO1xuXG4gICAgLy8gY2FsY3VsYXRlIGVsZXZhdGlvbiBzY2FsZSAtIGlmIGV4dHJ1ZGVkID0gdHJ1ZVxuICAgIGNvbnN0IGVTY2FsZSA9XG4gICAgICBoZWlnaHRGaWVsZCAmJlxuICAgICAgZW5hYmxlM2QgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKGhlaWdodFNjYWxlLCBoZWlnaHREb21haW4sIGhlaWdodFJhbmdlKTtcblxuICAgIC8vIHBvaW50IHJhZGl1c1xuICAgIGNvbnN0IHJTY2FsZSA9XG4gICAgICByYWRpdXNGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUocmFkaXVzU2NhbGUsIHJhZGl1c0RvbWFpbiwgcmFkaXVzUmFuZ2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGdlb2pzb25EYXRhLFxuICAgICAgZ2V0RmVhdHVyZSxcbiAgICAgIGdldEZpbGxDb2xvcjogZCA9PlxuICAgICAgICBjU2NhbGVcbiAgICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICAgICAgICAgICAgY1NjYWxlLFxuICAgICAgICAgICAgICBhbGxEYXRhW2QucHJvcGVydGllcy5pbmRleF0sXG4gICAgICAgICAgICAgIGNvbG9yRmllbGRcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IGQucHJvcGVydGllcy5maWxsQ29sb3IgfHwgY29sb3IsXG4gICAgICBnZXRMaW5lQ29sb3I6IGQgPT5cbiAgICAgICAgY1NjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgICAgICAgICAgIGNTY2FsZSxcbiAgICAgICAgICAgICAgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLFxuICAgICAgICAgICAgICBjb2xvckZpZWxkXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBkLnByb3BlcnRpZXMubGluZUNvbG9yIHx8IGNvbG9yLFxuICAgICAgZ2V0TGluZVdpZHRoOiBkID0+XG4gICAgICAgIHNTY2FsZVxuICAgICAgICAgID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgICAgICAgICAgICBzU2NhbGUsXG4gICAgICAgICAgICAgIGFsbERhdGFbZC5wcm9wZXJ0aWVzLmluZGV4XSxcbiAgICAgICAgICAgICAgc2l6ZUZpZWxkLFxuICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBkLnByb3BlcnRpZXMubGluZVdpZHRoIHx8IDEsXG4gICAgICBnZXRFbGV2YXRpb246IGQgPT5cbiAgICAgICAgZVNjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgICAgICAgICAgIGVTY2FsZSxcbiAgICAgICAgICAgICAgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLFxuICAgICAgICAgICAgICBoZWlnaHRGaWVsZCxcbiAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogZC5wcm9wZXJ0aWVzLmVsZXZhdGlvbiB8fCA1MDAsXG4gICAgICBnZXRSYWRpdXM6IGQgPT5cbiAgICAgICAgclNjYWxlXG4gICAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgICAgICAgICAgIHJTY2FsZSxcbiAgICAgICAgICAgICAgYWxsRGF0YVtkLnByb3BlcnRpZXMuaW5kZXhdLFxuICAgICAgICAgICAgICByYWRpdXNGaWVsZCxcbiAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogZC5wcm9wZXJ0aWVzLnJhZGl1cyB8fCAxXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRGZWF0dXJlKSB7XG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0gZ2V0R2VvanNvbkRhdGFNYXBzKGFsbERhdGEsIGdldEZlYXR1cmUpO1xuXG4gICAgLy8gY2FsY3VsYXRlIGxheWVyIG1ldGFcbiAgICBjb25zdCBhbGxGZWF0dXJlcyA9IE9iamVjdC52YWx1ZXModGhpcy5kYXRhVG9GZWF0dXJlKTtcblxuICAgIC8vIGdldCBib3VuZHMgZnJvbSBmZWF0dXJlc1xuICAgIGNvbnN0IGJvdW5kcyA9IGdldEdlb2pzb25Cb3VuZHMoYWxsRmVhdHVyZXMpO1xuXG4gICAgLy8gZ2V0IGxpZ2h0U2V0dGluZ3MgZnJvbSBwb2ludHNcbiAgICBjb25zdCBsaWdodFNldHRpbmdzID0gdGhpcy5nZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpO1xuXG4gICAgLy8gaWYgYW55IG9mIHRoZSBmZWF0dXJlIGhhcyBwcm9wZXJ0aWVzLmhpLXByZWNpc2lvbiBzZXQgdG8gYmUgdHJ1ZVxuICAgIGNvbnN0IGZwNjQgPSBCb29sZWFuKFxuICAgICAgYWxsRmVhdHVyZXMuZmluZChkID0+IGQgJiYgZC5wcm9wZXJ0aWVzICYmIGQucHJvcGVydGllc1snaGktcHJlY2lzaW9uJ10pXG4gICAgKTtcbiAgICBjb25zdCBmaXhlZFJhZGl1cyA9IEJvb2xlYW4oXG4gICAgICBhbGxGZWF0dXJlcy5maW5kKGQgPT4gZCAmJiBkLnByb3BlcnRpZXMgJiYgZC5wcm9wZXJ0aWVzLnJhZGl1cylcbiAgICApO1xuXG4gICAgLy8ga2VlcCBhIHJlY29yZCBvZiB3aGF0IHR5cGUgb2YgZ2VvbWV0cnkgdGhlIGNvbGxlY3Rpb24gaGFzXG4gICAgY29uc3QgZmVhdHVyZVR5cGVzID0gYWxsRmVhdHVyZXMucmVkdWNlKChhY2N1LCBmKSA9PiB7XG4gICAgICBjb25zdCBnZW9UeXBlID0gZmVhdHVyZVRvRGVja0dsR2VvVHlwZShcbiAgICAgICAgZiAmJiBmLmdlb21ldHJ5ICYmIGYuZ2VvbWV0cnkudHlwZVxuICAgICAgKTtcblxuICAgICAgaWYgKGdlb1R5cGUpIHtcbiAgICAgICAgYWNjdVtnZW9UeXBlXSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCB7fSk7XG5cbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kcywgbGlnaHRTZXR0aW5ncywgZnA2NCwgZml4ZWRSYWRpdXMsIGZlYXR1cmVUeXBlc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe1xuICAgIGRhdGEsXG4gICAgaWR4LFxuICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgb2JqZWN0SG92ZXJlZCxcbiAgICBtYXBTdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9KSB7XG4gICAgY29uc3Qge2ZwNjQsIGxpZ2h0U2V0dGluZ3MsIGZpeGVkUmFkaXVzfSA9IHRoaXMubWV0YTtcbiAgICBjb25zdCByYWRpdXNTY2FsZSA9IHRoaXMuZ2V0UmFkaXVzU2NhbGVCeVpvb20obWFwU3RhdGUuem9vbSwgZml4ZWRSYWRpdXMpO1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUuem9vbSk7XG5cbiAgICBjb25zdCBsYXllclByb3BzID0ge1xuICAgICAgLy8gbXVsdGlwbGllciBhcHBsaWVkIGp1c3Qgc28gaXQgYmVpbmcgY29uc2lzdGVudCB3aXRoIHByZXZpb3VzbHkgc2F2ZWQgbWFwc1xuICAgICAgbGluZVdpZHRoU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MgKiB6b29tRmFjdG9yICogOCxcbiAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogMSxcbiAgICAgIGVsZXZhdGlvblNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuZWxldmF0aW9uU2NhbGUsXG4gICAgICBwb2ludFJhZGl1c1NjYWxlOiByYWRpdXNTY2FsZSxcbiAgICAgIGZwNjQ6IGZwNjQgfHwgdGhpcy5jb25maWcudmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgIGxpbmVNaXRlckxpbWl0OiAxMCAqIHpvb21GYWN0b3IsXG4gICAgICByb3VuZGVkOiB0cnVlXG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0RWxldmF0aW9uOiB7XG4gICAgICAgIGhlaWdodEZpZWxkOiB0aGlzLmNvbmZpZy5oZWlnaHRGaWVsZCxcbiAgICAgICAgaGVpZ2h0U2NhbGU6IHRoaXMuY29uZmlnLmhlaWdodFNjYWxlLFxuICAgICAgICBoZWlnaHRSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmhlaWdodFJhbmdlXG4gICAgICB9LFxuICAgICAgZ2V0RmlsbENvbG9yOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbmZpZy5jb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRMaW5lQ29sb3I6IHtcbiAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldExpbmVXaWR0aDoge1xuICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgc2l6ZVJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlXG4gICAgICB9LFxuICAgICAgZ2V0UmFkaXVzOiB7XG4gICAgICAgIHJhZGl1c0ZpZWxkOiB0aGlzLmNvbmZpZy5yYWRpdXNGaWVsZCxcbiAgICAgICAgcmFkaXVzUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IERlY2tHTEdlb0pzb25MYXllcih7XG4gICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgIC4uLmxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBpZHgsXG4gICAgICAgIGRhdGE6IGRhdGEuZGF0YSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBkYXRhLmdldEZpbGxDb2xvcixcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBkYXRhLmdldExpbmVDb2xvcixcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBkYXRhLmdldExpbmVXaWR0aCxcbiAgICAgICAgZ2V0UmFkaXVzOiBkYXRhLmdldFJhZGl1cyxcbiAgICAgICAgZ2V0RWxldmF0aW9uOiBkYXRhLmdldEVsZXZhdGlvbixcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICBzdHJva2VkOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc3Ryb2tlZCxcbiAgICAgICAgZmlsbGVkOiB0aGlzLmNvbmZpZy52aXNDb25maWcuZmlsbGVkLFxuICAgICAgICBleHRydWRlZDogdGhpcy5jb25maWcudmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgICB3aXJlZnJhbWU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy53aXJlZnJhbWUsXG4gICAgICAgIGxpZ2h0U2V0dGluZ3MsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzXG4gICAgICB9KSxcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IERlY2tHTEdlb0pzb25MYXllcih7XG4gICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIC4uLm9iamVjdEhvdmVyZWQub2JqZWN0LFxuICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmplY3RIb3ZlcmVkLm9iamVjdC5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICBsaW5lQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZ2V0TGluZVdpZHRoOiBkYXRhLmdldExpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgIGdldFJhZGl1czogZGF0YS5nZXRSYWRpdXMsXG4gICAgICAgICAgICAgICAgICBnZXRFbGV2YXRpb246IGRhdGEuZ2V0RWxldmF0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB1cGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICBmaWxsZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=