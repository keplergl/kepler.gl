'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _geoViewport = require('@mapbox/geo-viewport');

var _geoViewport2 = _interopRequireDefault(_geoViewport);

var _d3Array = require('d3-array');

var _utils = require('../layer-utils/utils');

var _uberVizColors = require('../../constants/uber-viz-colors');

var _layerFactory = require('../../keplergl-layers/layer-factory');

var _defaultSettings = require('../../constants/default-settings');

var _clusterUtils = require('../layer-utils/cluster-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRadius = _layerFactory.LAYER_VIS_CONFIGS.clusterRadius.defaultValue;
var defaultRadiusRange = _layerFactory.LAYER_VIS_CONFIGS.clusterRadiusRange.defaultValue;

var defaultProps = {
  clusterRadius: defaultRadius,
  colorDomain: null,
  colorRange: _uberVizColors.defaultUberColorRange,
  colorScale: _defaultSettings.SCALE_TYPES.quantize,
  radiusRange: defaultRadiusRange,

  // maybe later...
  lowerPercentile: 0,
  upperPercentile: 100,

  getPosition: function getPosition(x) {
    return x.position;
  },

  // if want to have color based on customized aggregator, instead of count
  getColorValue: function getColorValue(points) {
    return points.length;
  },

  //  if want to have radius based on customized aggregator, instead of count
  getRadiusValue: function getRadiusValue(cell) {
    return cell.properties.point_count;
  },
  fp64: false
};

var ClusterLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(ClusterLayer, _CompositeLayer);

  function ClusterLayer() {
    (0, _classCallCheck3.default)(this, ClusterLayer);
    return (0, _possibleConstructorReturn3.default)(this, _CompositeLayer.apply(this, arguments));
  }

  ClusterLayer.prototype.initializeState = function initializeState() {
    this.state = {
      clusters: null,
      geoJSON: null
    };
  };

  ClusterLayer.prototype.shouldUpdateState = function shouldUpdateState(_ref) {
    var changeFlags = _ref.changeFlags;

    return changeFlags.somethingChanged;
  };

  ClusterLayer.prototype.updateState = function updateState(_ref2) {
    var oldContext = _ref2.oldContext,
        context = _ref2.context,
        oldProps = _ref2.oldProps,
        props = _ref2.props,
        changeFlags = _ref2.changeFlags;

    if (changeFlags.dataChanged || this.needsReProjectPoints(oldProps, props)) {
      // project data into clusters, and get clustered data
      this.processGeoJSON();
      this.getClusters();

      // this needs clustered data to be set
      this.getColorValueDomain();
    } else if (this.needsReclusterPoints(oldContext, context)) {

      this.getClusters();
      this.getColorValueDomain();
    } else if (this.needsRecalculateScaleFunction(oldProps, props)) {

      this.getColorValueDomain();
    }
  };

  ClusterLayer.prototype.needsReProjectPoints = function needsReProjectPoints(oldProps, props) {
    return oldProps.clusterRadius !== props.clusterRadius || oldProps.getPosition !== props.getPosition;
  };

  ClusterLayer.prototype.needsReclusterPoints = function needsReclusterPoints(oldContext, context) {
    return Math.round(oldContext.viewport.zoom) !== Math.round(context.viewport.zoom);
  };

  ClusterLayer.prototype.needsRecalculateScaleFunction = function needsRecalculateScaleFunction(oldProps, props) {
    return (0, _utils.needsRecalculateColorDomain)(oldProps, props) || (0, _utils.needReCalculateScaleFunction)(oldProps, props) || (0, _utils.needsRecalculateRadiusRange)(oldProps, props) || oldProps.getColorValue !== props.getColorValue;
  };

  ClusterLayer.prototype.processGeoJSON = function processGeoJSON() {
    var _props = this.props,
        data = _props.data,
        getPosition = _props.getPosition;

    this.setState({ geoJSON: (0, _clusterUtils.getGeoJSON)(data, getPosition) });
    (0, _clusterUtils.clearClustererCache)();
  };

  ClusterLayer.prototype.getClusters = function getClusters() {
    var geoJSON = this.state.geoJSON;
    var clusterRadius = this.props.clusterRadius;
    var _context = this.context,
        viewport = _context.viewport,
        _context$viewport = _context.viewport,
        longitude = _context$viewport.longitude,
        latitude = _context$viewport.latitude,
        height = _context$viewport.height,
        width = _context$viewport.width;

    // zoom needs to be an integer for the different map utils. Also helps with cache key.

    var zoom = Math.round(viewport.zoom);
    var bbox = _geoViewport2.default.bounds([longitude, latitude], zoom, [width, height]);

    var clusters = (0, _clusterUtils.clustersAtZoom)({ bbox: bbox, clusterRadius: clusterRadius, geoJSON: geoJSON, zoom: zoom });

    this.setState({ clusters: clusters });
  };

  ClusterLayer.prototype.getColorValueDomain = function getColorValueDomain() {
    var _props2 = this.props,
        colorScale = _props2.colorScale,
        getColorValue = _props2.getColorValue,
        getRadiusValue = _props2.getRadiusValue,
        onSetColorDomain = _props2.onSetColorDomain;
    var clusters = this.state.clusters;


    var radiusDomain = [0, (0, _d3Array.max)(clusters, getRadiusValue)];

    var colorValues = clusters.map(function (d) {
      return getColorValue(d.properties.points);
    }).filter(function (n) {
      return Number.isFinite(n);
    });
    var colorDomain = colorScale === _defaultSettings.SCALE_TYPES.quantize ? (0, _d3Array.extent)(colorValues) : colorValues.sort(_d3Array.ascending);

    this.setState({
      colorDomain: colorDomain,
      radiusDomain: radiusDomain
    });

    (0, _utils.getColorScaleFunction)(this);
    (0, _utils.getRadiusScaleFunction)(this);

    onSetColorDomain(colorDomain);
  };

  ClusterLayer.prototype.getUpdateTriggers = function getUpdateTriggers() {
    return {
      getColor: {
        colorRange: this.props.colorRange,
        colorDomain: this.props.colorDomain,
        getColorValue: this.props.getColorValue,
        colorScale: this.props.colorScale,
        lowerPercentile: this.props.lowerPercentile,
        upperPercentile: this.props.upperPercentile
      },
      getRadius: {
        radiusRange: this.props.radiusRange,
        radiusDomain: this.props.radiusDomain,
        getRadiusValue: this.props.getRadiusValue
      }
    };
  };

  /*
  * override default layer method to calculate cell color based on color scale function
  */


  ClusterLayer.prototype._onGetSublayerColor = function _onGetSublayerColor(cell) {
    var getColorValue = this.props.getColorValue;
    var _state = this.state,
        colorScaleFunc = _state.colorScaleFunc,
        colorDomain = _state.colorDomain;


    var cv = getColorValue(cell.properties.points);

    // if cell value is outside domain, set alpha to 0
    var color = Number.isFinite(cv) && cv >= colorDomain[0] && cv <= colorDomain[colorDomain.length - 1] ? colorScaleFunc(cv) : [0, 0, 0, 0];

    // add final alpha to color
    color[3] = Number.isFinite(color[3]) ? color[3] : 255;

    return color;
  };

  ClusterLayer.prototype._onGetSublayerRadius = function _onGetSublayerRadius(cell) {
    var getRadiusValue = this.props.getRadiusValue;
    var radiusScaleFunc = this.state.radiusScaleFunc;

    return radiusScaleFunc(getRadiusValue(cell));
  };

  ClusterLayer.prototype.getPickingInfo = function getPickingInfo(_ref3) {
    var info = _ref3.info;
    var clusters = this.state.clusters;

    var isPicked = info.picked && info.index > -1;

    var object = null;
    if (isPicked) {

      // add cluster colorValue to object
      var cluster = clusters[info.index];
      var colorValue = this.props.getColorValue(cluster.properties.points);

      object = (0, _extends3.default)({}, cluster.properties, {
        colorValue: colorValue,
        radius: this._onGetSublayerRadius(cluster),
        position: cluster.geometry.coordinates
      });
    }

    return (0, _extends3.default)({}, info, {
      picked: Boolean(object),
      // override object with picked cluster property
      object: object
    });
  };

  ClusterLayer.prototype.renderLayers = function renderLayers() {
    // for subclassing, override this method to return
    // customized sub layer props
    var _props3 = this.props,
        id = _props3.id,
        radiusScale = _props3.radiusScale,
        fp64 = _props3.fp64;

    // base layer props

    var _props4 = this.props,
        opacity = _props4.opacity,
        pickable = _props4.pickable;

    // return props to the sublayer constructor

    return new _deck.ScatterplotLayer({
      id: id + '-cluster',
      data: this.state.clusters,
      radiusScale: radiusScale,
      fp64: fp64,
      getPosition: function getPosition(d) {
        return d.geometry.coordinates;
      },
      getRadius: this._onGetSublayerRadius.bind(this),
      opacity: opacity,
      pickable: pickable,
      getColor: this._onGetSublayerColor.bind(this),
      updateTriggers: this.getUpdateTriggers()
    });
  };

  return ClusterLayer;
}(_deck.CompositeLayer);

exports.default = ClusterLayer;


ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmFkaXVzIiwiY2x1c3RlclJhZGl1cyIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHRSYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXNSYW5nZSIsImRlZmF1bHRQcm9wcyIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJxdWFudGl6ZSIsInJhZGl1c1JhbmdlIiwibG93ZXJQZXJjZW50aWxlIiwidXBwZXJQZXJjZW50aWxlIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwiZ2V0UmFkaXVzVmFsdWUiLCJjZWxsIiwicHJvcGVydGllcyIsInBvaW50X2NvdW50IiwiZnA2NCIsIkNsdXN0ZXJMYXllciIsImluaXRpYWxpemVTdGF0ZSIsInN0YXRlIiwiY2x1c3RlcnMiLCJnZW9KU09OIiwic2hvdWxkVXBkYXRlU3RhdGUiLCJjaGFuZ2VGbGFncyIsInNvbWV0aGluZ0NoYW5nZWQiLCJ1cGRhdGVTdGF0ZSIsIm9sZENvbnRleHQiLCJjb250ZXh0Iiwib2xkUHJvcHMiLCJwcm9wcyIsImRhdGFDaGFuZ2VkIiwibmVlZHNSZVByb2plY3RQb2ludHMiLCJwcm9jZXNzR2VvSlNPTiIsImdldENsdXN0ZXJzIiwiZ2V0Q29sb3JWYWx1ZURvbWFpbiIsIm5lZWRzUmVjbHVzdGVyUG9pbnRzIiwibmVlZHNSZWNhbGN1bGF0ZVNjYWxlRnVuY3Rpb24iLCJNYXRoIiwicm91bmQiLCJ2aWV3cG9ydCIsInpvb20iLCJkYXRhIiwic2V0U3RhdGUiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImhlaWdodCIsIndpZHRoIiwiYmJveCIsImJvdW5kcyIsIm9uU2V0Q29sb3JEb21haW4iLCJyYWRpdXNEb21haW4iLCJjb2xvclZhbHVlcyIsIm1hcCIsImQiLCJmaWx0ZXIiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIm4iLCJzb3J0IiwiZ2V0VXBkYXRlVHJpZ2dlcnMiLCJnZXRDb2xvciIsImdldFJhZGl1cyIsIl9vbkdldFN1YmxheWVyQ29sb3IiLCJjb2xvclNjYWxlRnVuYyIsImN2IiwiY29sb3IiLCJfb25HZXRTdWJsYXllclJhZGl1cyIsInJhZGl1c1NjYWxlRnVuYyIsImdldFBpY2tpbmdJbmZvIiwiaW5mbyIsImlzUGlja2VkIiwicGlja2VkIiwiaW5kZXgiLCJvYmplY3QiLCJjbHVzdGVyIiwiY29sb3JWYWx1ZSIsInJhZGl1cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJCb29sZWFuIiwicmVuZGVyTGF5ZXJzIiwiaWQiLCJyYWRpdXNTY2FsZSIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImJpbmQiLCJ1cGRhdGVUcmlnZ2VycyIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUVBOztBQU9BOztBQUNBOztBQUNBOztBQUVBOzs7O0FBRUEsSUFBTUEsZ0JBQWdCLGdDQUFrQkMsYUFBbEIsQ0FBZ0NDLFlBQXREO0FBQ0EsSUFBTUMscUJBQXFCLGdDQUFrQkMsa0JBQWxCLENBQXFDRixZQUFoRTs7QUFFQSxJQUFNRyxlQUFlO0FBQ25CSixpQkFBZUQsYUFESTtBQUVuQk0sZUFBYSxJQUZNO0FBR25CQyxrREFIbUI7QUFJbkJDLGNBQVksNkJBQVlDLFFBSkw7QUFLbkJDLGVBQWFQLGtCQUxNOztBQU9uQjtBQUNBUSxtQkFBaUIsQ0FSRTtBQVNuQkMsbUJBQWlCLEdBVEU7O0FBV25CQyxlQUFhO0FBQUEsV0FBS0MsRUFBRUMsUUFBUDtBQUFBLEdBWE07O0FBYW5CO0FBQ0FDLGlCQUFlO0FBQUEsV0FBVUMsT0FBT0MsTUFBakI7QUFBQSxHQWRJOztBQWdCbkI7QUFDQUMsa0JBQWdCO0FBQUEsV0FBUUMsS0FBS0MsVUFBTCxDQUFnQkMsV0FBeEI7QUFBQSxHQWpCRztBQWtCbkJD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Yjs7QUFDQSxXQUFPLDJCQUFxQjtBQUMxQkgsVUFBT0EsRUFBUCxhQUQwQjtBQUUxQnhDLFlBQU0sS0FBS3RCLEtBQUwsQ0FBV0MsUUFGUztBQUcxQjhELDhCQUgwQjtBQUkxQmxFLGdCQUowQjtBQUsxQlYsbUJBQWE7QUFBQSxlQUFLK0MsRUFBRXdCLFFBQUYsQ0FBV0MsV0FBaEI7QUFBQSxPQUxhO0FBTTFCakIsaUJBQVcsS0FBS0ssb0JBQUwsQ0FBMEJtQixJQUExQixDQUErQixJQUEvQixDQU5lO0FBTzFCRixzQkFQMEI7QUFRMUJDLHdCQVIwQjtBQVMxQnhCLGdCQUFVLEtBQUtFLG1CQUFMLENBQXlCdUIsSUFBekIsQ0FBOEIsSUFBOUIsQ0FUZ0I7QUFVMUJDLHNCQUFnQixLQUFLM0IsaUJBQUw7QUFWVSxLQUFyQixDQUFQO0FBWUQsRzs7Ozs7a0JBcExrQjFDLFk7OztBQXVMckJBLGFBQWFzRSxTQUFiLEdBQXlCLGNBQXpCO0FBQ0F0RSxhQUFhbkIsWUFBYixHQUE0QkEsWUFBNUIiLCJmaWxlIjoiY2x1c3Rlci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlTGF5ZXIsIFNjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IGdlb1ZpZXdwb3J0IGZyb20gJ0BtYXBib3gvZ2VvLXZpZXdwb3J0JztcbmltcG9ydCB7YXNjZW5kaW5nLCBleHRlbnQsIG1heH0gZnJvbSAnZDMtYXJyYXknO1xuXG5pbXBvcnQge1xuICBnZXRDb2xvclNjYWxlRnVuY3Rpb24sXG4gIGdldFJhZGl1c1NjYWxlRnVuY3Rpb24sXG4gIG5lZWRzUmVjYWxjdWxhdGVSYWRpdXNSYW5nZSxcbiAgbmVlZHNSZWNhbGN1bGF0ZUNvbG9yRG9tYWluLFxuICBuZWVkUmVDYWxjdWxhdGVTY2FsZUZ1bmN0aW9uXG59IGZyb20gJy4uL2xheWVyLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7ZGVmYXVsdFViZXJDb2xvclJhbmdlfSBmcm9tICcuLi8uLi9jb25zdGFudHMvdWJlci12aXotY29sb3JzJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJy4uLy4uL2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCB7U0NBTEVfVFlQRVN9IGZyb20gJy4uLy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtjbGVhckNsdXN0ZXJlckNhY2hlLCBjbHVzdGVyc0F0Wm9vbSwgZ2V0R2VvSlNPTn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY2x1c3Rlci11dGlscyc7XG5cbmNvbnN0IGRlZmF1bHRSYWRpdXMgPSBMQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzLmRlZmF1bHRWYWx1ZTtcbmNvbnN0IGRlZmF1bHRSYWRpdXNSYW5nZSA9IExBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXNSYW5nZS5kZWZhdWx0VmFsdWU7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY2x1c3RlclJhZGl1czogZGVmYXVsdFJhZGl1cyxcbiAgY29sb3JEb21haW46IG51bGwsXG4gIGNvbG9yUmFuZ2U6IGRlZmF1bHRVYmVyQ29sb3JSYW5nZSxcbiAgY29sb3JTY2FsZTogU0NBTEVfVFlQRVMucXVhbnRpemUsXG4gIHJhZGl1c1JhbmdlOiBkZWZhdWx0UmFkaXVzUmFuZ2UsXG5cbiAgLy8gbWF5YmUgbGF0ZXIuLi5cbiAgbG93ZXJQZXJjZW50aWxlOiAwLFxuICB1cHBlclBlcmNlbnRpbGU6IDEwMCxcblxuICBnZXRQb3NpdGlvbjogeCA9PiB4LnBvc2l0aW9uLFxuXG4gIC8vIGlmIHdhbnQgdG8gaGF2ZSBjb2xvciBiYXNlZCBvbiBjdXN0b21pemVkIGFnZ3JlZ2F0b3IsIGluc3RlYWQgb2YgY291bnRcbiAgZ2V0Q29sb3JWYWx1ZTogcG9pbnRzID0+IHBvaW50cy5sZW5ndGgsXG5cbiAgLy8gIGlmIHdhbnQgdG8gaGF2ZSByYWRpdXMgYmFzZWQgb24gY3VzdG9taXplZCBhZ2dyZWdhdG9yLCBpbnN0ZWFkIG9mIGNvdW50XG4gIGdldFJhZGl1c1ZhbHVlOiBjZWxsID0+IGNlbGwucHJvcGVydGllcy5wb2ludF9jb3VudCxcbiAgZnA2NDogZmFsc2Vcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJMYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNsdXN0ZXJzOiBudWxsLFxuICAgICAgZ2VvSlNPTjogbnVsbFxuICAgIH07XG4gIH1cblxuICBzaG91bGRVcGRhdGVTdGF0ZSh7Y2hhbmdlRmxhZ3N9KSB7XG4gICAgcmV0dXJuIGNoYW5nZUZsYWdzLnNvbWV0aGluZ0NoYW5nZWQ7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7b2xkQ29udGV4dCwgY29udGV4dCwgb2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFnc30pIHtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQgfHwgdGhpcy5uZWVkc1JlUHJvamVjdFBvaW50cyhvbGRQcm9wcywgcHJvcHMpKSB7XG4gICAgICAvLyBwcm9qZWN0IGRhdGEgaW50byBjbHVzdGVycywgYW5kIGdldCBjbHVzdGVyZWQgZGF0YVxuICAgICAgdGhpcy5wcm9jZXNzR2VvSlNPTigpO1xuICAgICAgdGhpcy5nZXRDbHVzdGVycygpO1xuXG4gICAgICAvLyB0aGlzIG5lZWRzIGNsdXN0ZXJlZCBkYXRhIHRvIGJlIHNldFxuICAgICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMubmVlZHNSZWNsdXN0ZXJQb2ludHMob2xkQ29udGV4dCwgY29udGV4dCkpIHtcblxuICAgICAgdGhpcy5nZXRDbHVzdGVycygpO1xuICAgICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMubmVlZHNSZWNhbGN1bGF0ZVNjYWxlRnVuY3Rpb24ob2xkUHJvcHMsIHByb3BzKSkge1xuXG4gICAgICB0aGlzLmdldENvbG9yVmFsdWVEb21haW4oKTtcbiAgICB9XG4gIH1cblxuICBuZWVkc1JlUHJvamVjdFBvaW50cyhvbGRQcm9wcywgcHJvcHMpIHtcbiAgICByZXR1cm4gb2xkUHJvcHMuY2x1c3RlclJhZGl1cyAhPT0gcHJvcHMuY2x1c3RlclJhZGl1cyB8fFxuICAgICAgb2xkUHJvcHMuZ2V0UG9zaXRpb24gIT09IHByb3BzLmdldFBvc2l0aW9uO1xuICB9XG5cbiAgbmVlZHNSZWNsdXN0ZXJQb2ludHMob2xkQ29udGV4dCwgY29udGV4dCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG9sZENvbnRleHQudmlld3BvcnQuem9vbSkgIT09IE1hdGgucm91bmQoY29udGV4dC52aWV3cG9ydC56b29tKTtcbiAgfVxuXG4gIG5lZWRzUmVjYWxjdWxhdGVTY2FsZUZ1bmN0aW9uKG9sZFByb3BzLCBwcm9wcykge1xuICAgIHJldHVybiBuZWVkc1JlY2FsY3VsYXRlQ29sb3JEb21haW4ob2xkUHJvcHMsIHByb3BzKSB8fFxuICAgICAgbmVlZFJlQ2FsY3VsYXRlU2NhbGVGdW5jdGlvbihvbGRQcm9wcywgcHJvcHMpIHx8XG4gICAgICBuZWVkc1JlY2FsY3VsYXRlUmFkaXVzUmFuZ2Uob2xkUHJvcHMsIHByb3BzKSB8fFxuICAgICAgb2xkUHJvcHMuZ2V0Q29sb3JWYWx1ZSAhPT0gcHJvcHMuZ2V0Q29sb3JWYWx1ZTtcbiAgfVxuXG4gIHByb2Nlc3NHZW9KU09OKCkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRQb3NpdGlvbn0gPSB0aGlzLnByb3BzO1xuICAgIHRoaXMuc2V0U3RhdGUoe2dlb0pTT046IGdldEdlb0pTT04oZGF0YSwgZ2V0UG9zaXRpb24pfSk7XG4gICAgY2xlYXJDbHVzdGVyZXJDYWNoZSgpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlcnMoKSB7XG4gICAgY29uc3Qge2dlb0pTT059ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7Y2x1c3RlclJhZGl1c30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2aWV3cG9ydCwgdmlld3BvcnQ6IHtsb25naXR1ZGUsIGxhdGl0dWRlLCBoZWlnaHQsIHdpZHRofX0gPSB0aGlzLmNvbnRleHQ7XG5cbiAgICAvLyB6b29tIG5lZWRzIHRvIGJlIGFuIGludGVnZXIgZm9yIHRoZSBkaWZmZXJlbnQgbWFwIHV0aWxzLiBBbHNvIGhlbHBzIHdpdGggY2FjaGUga2V5LlxuICAgIGNvbnN0IHpvb20gPSBNYXRoLnJvdW5kKHZpZXdwb3J0Lnpvb20pO1xuICAgIGNvbnN0IGJib3ggPSBnZW9WaWV3cG9ydC5ib3VuZHMoW2xvbmdpdHVkZSwgbGF0aXR1ZGVdLCB6b29tLCBbd2lkdGgsIGhlaWdodF0pO1xuXG4gICAgY29uc3QgY2x1c3RlcnMgPSBjbHVzdGVyc0F0Wm9vbSh7YmJveCwgY2x1c3RlclJhZGl1cywgZ2VvSlNPTiwgem9vbX0pO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2x1c3RlcnN9KTtcbiAgfVxuXG4gIGdldENvbG9yVmFsdWVEb21haW4oKSB7XG4gICAgY29uc3Qge2NvbG9yU2NhbGUsIGdldENvbG9yVmFsdWUsIGdldFJhZGl1c1ZhbHVlLCBvblNldENvbG9yRG9tYWlufSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2NsdXN0ZXJzfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCByYWRpdXNEb21haW4gPSBbMCwgbWF4KGNsdXN0ZXJzLCBnZXRSYWRpdXNWYWx1ZSldO1xuXG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSBjbHVzdGVycy5tYXAoZCA9PiBnZXRDb2xvclZhbHVlKGQucHJvcGVydGllcy5wb2ludHMpKS5maWx0ZXIobiA9PiBOdW1iZXIuaXNGaW5pdGUobikpO1xuICAgIGNvbnN0IGNvbG9yRG9tYWluID0gY29sb3JTY2FsZSA9PT0gU0NBTEVfVFlQRVMucXVhbnRpemUgPyBleHRlbnQoY29sb3JWYWx1ZXMpIDogY29sb3JWYWx1ZXMuc29ydChhc2NlbmRpbmcpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIHJhZGl1c0RvbWFpblxuICAgIH0pO1xuXG4gICAgZ2V0Q29sb3JTY2FsZUZ1bmN0aW9uKHRoaXMpO1xuICAgIGdldFJhZGl1c1NjYWxlRnVuY3Rpb24odGhpcyk7XG5cbiAgICBvblNldENvbG9yRG9tYWluKGNvbG9yRG9tYWluKTtcbiAgfVxuXG4gIGdldFVwZGF0ZVRyaWdnZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRDb2xvcjoge1xuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLnByb3BzLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yRG9tYWluOiB0aGlzLnByb3BzLmNvbG9yRG9tYWluLFxuICAgICAgICBnZXRDb2xvclZhbHVlOiB0aGlzLnByb3BzLmdldENvbG9yVmFsdWUsXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMucHJvcHMuY29sb3JTY2FsZSxcbiAgICAgICAgbG93ZXJQZXJjZW50aWxlOiB0aGlzLnByb3BzLmxvd2VyUGVyY2VudGlsZSxcbiAgICAgICAgdXBwZXJQZXJjZW50aWxlOiB0aGlzLnByb3BzLnVwcGVyUGVyY2VudGlsZVxuICAgICAgfSxcbiAgICAgIGdldFJhZGl1czoge1xuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5wcm9wcy5yYWRpdXNSYW5nZSxcbiAgICAgICAgcmFkaXVzRG9tYWluOiB0aGlzLnByb3BzLnJhZGl1c0RvbWFpbixcbiAgICAgICAgZ2V0UmFkaXVzVmFsdWU6IHRoaXMucHJvcHMuZ2V0UmFkaXVzVmFsdWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgIC8qXG4gICAqIG92ZXJyaWRlIGRlZmF1bHQgbGF5ZXIgbWV0aG9kIHRvIGNhbGN1bGF0ZSBjZWxsIGNvbG9yIGJhc2VkIG9uIGNvbG9yIHNjYWxlIGZ1bmN0aW9uXG4gICAqL1xuICBfb25HZXRTdWJsYXllckNvbG9yKGNlbGwpIHtcbiAgICBjb25zdCB7Z2V0Q29sb3JWYWx1ZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjb2xvclNjYWxlRnVuYywgY29sb3JEb21haW59ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGN2ID0gZ2V0Q29sb3JWYWx1ZShjZWxsLnByb3BlcnRpZXMucG9pbnRzKTtcblxuICAgIC8vIGlmIGNlbGwgdmFsdWUgaXMgb3V0c2lkZSBkb21haW4sIHNldCBhbHBoYSB0byAwXG4gICAgY29uc3QgY29sb3IgPSBOdW1iZXIuaXNGaW5pdGUoY3YpICYmIGN2ID49IGNvbG9yRG9tYWluWzBdICYmIGN2IDw9IGNvbG9yRG9tYWluW2NvbG9yRG9tYWluLmxlbmd0aCAtIDFdID9cbiAgICAgIGNvbG9yU2NhbGVGdW5jKGN2KSA6IFswLCAwLCAwLCAwXTtcblxuICAgIC8vIGFkZCBmaW5hbCBhbHBoYSB0byBjb2xvclxuICAgIGNvbG9yWzNdID0gTnVtYmVyLmlzRmluaXRlKGNvbG9yWzNdKSA/IGNvbG9yWzNdIDogMjU1O1xuXG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgX29uR2V0U3VibGF5ZXJSYWRpdXMoY2VsbCkge1xuICAgIGNvbnN0IHtnZXRSYWRpdXNWYWx1ZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtyYWRpdXNTY2FsZUZ1bmN9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gcmFkaXVzU2NhbGVGdW5jKGdldFJhZGl1c1ZhbHVlKGNlbGwpKTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHtpbmZvfSkge1xuICAgIGNvbnN0IHtjbHVzdGVyc30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGlzUGlja2VkID0gaW5mby5waWNrZWQgJiYgaW5mby5pbmRleCA+IC0xO1xuXG4gICAgbGV0IG9iamVjdCA9IG51bGw7XG4gICAgaWYgKGlzUGlja2VkKSB7XG5cbiAgICAgIC8vIGFkZCBjbHVzdGVyIGNvbG9yVmFsdWUgdG8gb2JqZWN0XG4gICAgICBjb25zdCBjbHVzdGVyID0gY2x1c3RlcnNbaW5mby5pbmRleF07XG4gICAgICBjb25zdCBjb2xvclZhbHVlID0gdGhpcy5wcm9wcy5nZXRDb2xvclZhbHVlKGNsdXN0ZXIucHJvcGVydGllcy5wb2ludHMpO1xuXG4gICAgICBvYmplY3QgPSB7XG4gICAgICAgIC4uLmNsdXN0ZXIucHJvcGVydGllcyxcbiAgICAgICAgY29sb3JWYWx1ZSxcbiAgICAgICAgcmFkaXVzOiB0aGlzLl9vbkdldFN1YmxheWVyUmFkaXVzKGNsdXN0ZXIpLFxuICAgICAgICBwb3NpdGlvbjogY2x1c3Rlci5nZW9tZXRyeS5jb29yZGluYXRlc1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uaW5mbyxcbiAgICAgIHBpY2tlZDogQm9vbGVhbihvYmplY3QpLFxuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGNsdXN0ZXIgcHJvcGVydHlcbiAgICAgIG9iamVjdFxuICAgIH07XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgLy8gZm9yIHN1YmNsYXNzaW5nLCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byByZXR1cm5cbiAgICAvLyBjdXN0b21pemVkIHN1YiBsYXllciBwcm9wc1xuICAgIGNvbnN0IHtpZCwgcmFkaXVzU2NhbGUsIGZwNjR9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGJhc2UgbGF5ZXIgcHJvcHNcbiAgICBjb25zdCB7b3BhY2l0eSwgcGlja2FibGV9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIHJldHVybiBwcm9wcyB0byB0aGUgc3VibGF5ZXIgY29uc3RydWN0b3JcbiAgICByZXR1cm4gbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgaWQ6IGAke2lkfS1jbHVzdGVyYCxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuY2x1c3RlcnMsXG4gICAgICByYWRpdXNTY2FsZSxcbiAgICAgIGZwNjQsXG4gICAgICBnZXRQb3NpdGlvbjogZCA9PiBkLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgZ2V0UmFkaXVzOiB0aGlzLl9vbkdldFN1YmxheWVyUmFkaXVzLmJpbmQodGhpcyksXG4gICAgICBvcGFjaXR5LFxuICAgICAgcGlja2FibGUsXG4gICAgICBnZXRDb2xvcjogdGhpcy5fb25HZXRTdWJsYXllckNvbG9yLmJpbmQodGhpcyksXG4gICAgICB1cGRhdGVUcmlnZ2VyczogdGhpcy5nZXRVcGRhdGVUcmlnZ2VycygpXG4gICAgfSk7XG4gIH1cbn1cblxuQ2x1c3RlckxheWVyLmxheWVyTmFtZSA9ICdDbHVzdGVyTGF5ZXInO1xuQ2x1c3RlckxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==