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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmFkaXVzIiwiY2x1c3RlclJhZGl1cyIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHRSYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXNSYW5nZSIsImRlZmF1bHRQcm9wcyIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJxdWFudGl6ZSIsInJhZGl1c1JhbmdlIiwibG93ZXJQZXJjZW50aWxlIiwidXBwZXJQZXJjZW50aWxlIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwiZ2V0UmFkaXVzVmFsdWUiLCJjZWxsIiwicHJvcGVydGllcyIsInBvaW50X2NvdW50IiwiZnA2NCIsIkNsdXN0ZXJMYXllciIsImluaXRpYWxpemVTdGF0ZSIsInN0YXRlIiwiY2x1c3RlcnMiLCJnZW9KU09OIiwic2hvdWxkVXBkYXRlU3RhdGUiLCJjaGFuZ2VGbGFncyIsInNvbWV0aGluZ0NoYW5nZWQiLCJ1cGRhdGVTdGF0ZSIsIm9sZENvbnRleHQiLCJjb250ZXh0Iiwib2xkUHJvcHMiLCJwcm9wcyIsImRhdGFDaGFuZ2VkIiwibmVlZHNSZVByb2plY3RQb2ludHMiLCJwcm9jZXNzR2VvSlNPTiIsImdldENsdXN0ZXJzIiwiZ2V0Q29sb3JWYWx1ZURvbWFpbiIsIm5lZWRzUmVjbHVzdGVyUG9pbnRzIiwibmVlZHNSZWNhbGN1bGF0ZVNjYWxlRnVuY3Rpb24iLCJNYXRoIiwicm91bmQiLCJ2aWV3cG9ydCIsInpvb20iLCJkYXRhIiwic2V0U3RhdGUiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImhlaWdodCIsIndpZHRoIiwiYmJveCIsImJvdW5kcyIsIm9uU2V0Q29sb3JEb21haW4iLCJyYWRpdXNEb21haW4iLCJjb2xvclZhbHVlcyIsIm1hcCIsImQiLCJmaWx0ZXIiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIm4iLCJzb3J0IiwiZ2V0VXBkYXRlVHJpZ2dlcnMiLCJnZXRDb2xvciIsImdldFJhZGl1cyIsIl9vbkdldFN1YmxheWVyQ29sb3IiLCJjb2xvclNjYWxlRnVuYyIsImN2IiwiY29sb3IiLCJfb25HZXRTdWJsYXllclJhZGl1cyIsInJhZGl1c1NjYWxlRnVuYyIsImdldFBpY2tpbmdJbmZvIiwiaW5mbyIsImlzUGlja2VkIiwicGlja2VkIiwiaW5kZXgiLCJvYmplY3QiLCJjbHVzdGVyIiwiY29sb3JWYWx1ZSIsInJhZGl1cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJCb29sZWFuIiwicmVuZGVyTGF5ZXJzIiwiaWQiLCJyYWRpdXNTY2FsZSIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImJpbmQiLCJ1cGRhdGVUcmlnZ2VycyIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUVBOztBQU9BOztBQUNBOztBQUNBOztBQUVBOzs7O0FBTUEsSUFBTUEsZ0JBQWdCLGdDQUFrQkMsYUFBbEIsQ0FBZ0NDLFlBQXREO0FBQ0EsSUFBTUMscUJBQXFCLGdDQUFrQkMsa0JBQWxCLENBQXFDRixZQUFoRTs7QUFFQSxJQUFNRyxlQUFlO0FBQ25CSixpQkFBZUQsYUFESTtBQUVuQk0sZUFBYSxJQUZNO0FBR25CQyxrREFIbUI7QUFJbkJDLGNBQVksNkJBQVlDLFFBSkw7QUFLbkJDLGVBQWFQLGtCQUxNOztBQU9uQjtBQUNBUSxtQkFBaUIsQ0FSRTtBQVNuQkMsbUJBQWlCLEdBVEU7O0FBV25CQyxlQUFhO0FBQUEsV0FBS0MsRUFBRUMsUUFBUDtBQUFBLEdBWE07O0FBYW5CO0FBQ0FDLGlCQUFlO0FBQUEsV0FBVUMsT0FBT0MsTUFBakI7QUFBQSxHQWRJOztBQWdCbkI7QUFDQUMsa0JBQWdCO0FBQUEsV0FBUUMsS0FBS0MsVUFBTCxDQUFnQkMsV0FBeEI7QUFBQSxHQWpCRztBQWtCbkJD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LFdBQU8sMkJBQXFCO0FBQzFCSCxVQUFPQSxFQUFQLGFBRDBCO0FBRTFCeEMsWUFBTSxLQUFLdEIsS0FBTCxDQUFXQyxRQUZTO0FBRzFCOEQsOEJBSDBCO0FBSTFCbEUsZ0JBSjBCO0FBSzFCVixtQkFBYTtBQUFBLGVBQUsrQyxFQUFFd0IsUUFBRixDQUFXQyxXQUFoQjtBQUFBLE9BTGE7QUFNMUJqQixpQkFBVyxLQUFLSyxvQkFBTCxDQUEwQm1CLElBQTFCLENBQStCLElBQS9CLENBTmU7QUFPMUJGLHNCQVAwQjtBQVExQkMsd0JBUjBCO0FBUzFCeEIsZ0JBQVUsS0FBS0UsbUJBQUwsQ0FBeUJ1QixJQUF6QixDQUE4QixJQUE5QixDQVRnQjtBQVUxQkMsc0JBQWdCLEtBQUszQixpQkFBTDtBQVZVLEtBQXJCLENBQVA7QUFZRCxHOzs7OztrQkF4TWtCMUMsWTs7O0FBMk1yQkEsYUFBYXNFLFNBQWIsR0FBeUIsY0FBekI7QUFDQXRFLGFBQWFuQixZQUFiLEdBQTRCQSxZQUE1QiIsImZpbGUiOiJjbHVzdGVyLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb3NpdGVMYXllciwgU2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQgZ2VvVmlld3BvcnQgZnJvbSAnQG1hcGJveC9nZW8tdmlld3BvcnQnO1xuaW1wb3J0IHthc2NlbmRpbmcsIGV4dGVudCwgbWF4fSBmcm9tICdkMy1hcnJheSc7XG5cbmltcG9ydCB7XG4gIGdldENvbG9yU2NhbGVGdW5jdGlvbixcbiAgZ2V0UmFkaXVzU2NhbGVGdW5jdGlvbixcbiAgbmVlZHNSZWNhbGN1bGF0ZVJhZGl1c1JhbmdlLFxuICBuZWVkc1JlY2FsY3VsYXRlQ29sb3JEb21haW4sXG4gIG5lZWRSZUNhbGN1bGF0ZVNjYWxlRnVuY3Rpb25cbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtkZWZhdWx0VWJlckNvbG9yUmFuZ2V9IGZyb20gJy4uLy4uL2NvbnN0YW50cy91YmVyLXZpei1jb2xvcnMnO1xuaW1wb3J0IHtMQVlFUl9WSVNfQ09ORklHU30gZnJvbSAnLi4vLi4va2VwbGVyZ2wtbGF5ZXJzL2xheWVyLWZhY3RvcnknO1xuaW1wb3J0IHtTQ0FMRV9UWVBFU30gZnJvbSAnLi4vLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge1xuICBjbGVhckNsdXN0ZXJlckNhY2hlLFxuICBjbHVzdGVyc0F0Wm9vbSxcbiAgZ2V0R2VvSlNPTlxufSBmcm9tICcuLi9sYXllci11dGlscy9jbHVzdGVyLXV0aWxzJztcblxuY29uc3QgZGVmYXVsdFJhZGl1cyA9IExBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXMuZGVmYXVsdFZhbHVlO1xuY29uc3QgZGVmYXVsdFJhZGl1c1JhbmdlID0gTEFZRVJfVklTX0NPTkZJR1MuY2x1c3RlclJhZGl1c1JhbmdlLmRlZmF1bHRWYWx1ZTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBjbHVzdGVyUmFkaXVzOiBkZWZhdWx0UmFkaXVzLFxuICBjb2xvckRvbWFpbjogbnVsbCxcbiAgY29sb3JSYW5nZTogZGVmYXVsdFViZXJDb2xvclJhbmdlLFxuICBjb2xvclNjYWxlOiBTQ0FMRV9UWVBFUy5xdWFudGl6ZSxcbiAgcmFkaXVzUmFuZ2U6IGRlZmF1bHRSYWRpdXNSYW5nZSxcblxuICAvLyBtYXliZSBsYXRlci4uLlxuICBsb3dlclBlcmNlbnRpbGU6IDAsXG4gIHVwcGVyUGVyY2VudGlsZTogMTAwLFxuXG4gIGdldFBvc2l0aW9uOiB4ID0+IHgucG9zaXRpb24sXG5cbiAgLy8gaWYgd2FudCB0byBoYXZlIGNvbG9yIGJhc2VkIG9uIGN1c3RvbWl6ZWQgYWdncmVnYXRvciwgaW5zdGVhZCBvZiBjb3VudFxuICBnZXRDb2xvclZhbHVlOiBwb2ludHMgPT4gcG9pbnRzLmxlbmd0aCxcblxuICAvLyAgaWYgd2FudCB0byBoYXZlIHJhZGl1cyBiYXNlZCBvbiBjdXN0b21pemVkIGFnZ3JlZ2F0b3IsIGluc3RlYWQgb2YgY291bnRcbiAgZ2V0UmFkaXVzVmFsdWU6IGNlbGwgPT4gY2VsbC5wcm9wZXJ0aWVzLnBvaW50X2NvdW50LFxuICBmcDY0OiBmYWxzZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2x1c3RlckxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNsdXN0ZXJzOiBudWxsLFxuICAgICAgZ2VvSlNPTjogbnVsbFxuICAgIH07XG4gIH1cblxuICBzaG91bGRVcGRhdGVTdGF0ZSh7Y2hhbmdlRmxhZ3N9KSB7XG4gICAgcmV0dXJuIGNoYW5nZUZsYWdzLnNvbWV0aGluZ0NoYW5nZWQ7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7b2xkQ29udGV4dCwgY29udGV4dCwgb2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFnc30pIHtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQgfHwgdGhpcy5uZWVkc1JlUHJvamVjdFBvaW50cyhvbGRQcm9wcywgcHJvcHMpKSB7XG4gICAgICAvLyBwcm9qZWN0IGRhdGEgaW50byBjbHVzdGVycywgYW5kIGdldCBjbHVzdGVyZWQgZGF0YVxuICAgICAgdGhpcy5wcm9jZXNzR2VvSlNPTigpO1xuICAgICAgdGhpcy5nZXRDbHVzdGVycygpO1xuXG4gICAgICAvLyB0aGlzIG5lZWRzIGNsdXN0ZXJlZCBkYXRhIHRvIGJlIHNldFxuICAgICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5lZWRzUmVjbHVzdGVyUG9pbnRzKG9sZENvbnRleHQsIGNvbnRleHQpKSB7XG4gICAgICB0aGlzLmdldENsdXN0ZXJzKCk7XG4gICAgICB0aGlzLmdldENvbG9yVmFsdWVEb21haW4oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubmVlZHNSZWNhbGN1bGF0ZVNjYWxlRnVuY3Rpb24ob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG4gICAgfVxuICB9XG5cbiAgbmVlZHNSZVByb2plY3RQb2ludHMob2xkUHJvcHMsIHByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG9sZFByb3BzLmNsdXN0ZXJSYWRpdXMgIT09IHByb3BzLmNsdXN0ZXJSYWRpdXMgfHxcbiAgICAgIG9sZFByb3BzLmdldFBvc2l0aW9uICE9PSBwcm9wcy5nZXRQb3NpdGlvblxuICAgICk7XG4gIH1cblxuICBuZWVkc1JlY2x1c3RlclBvaW50cyhvbGRDb250ZXh0LCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIE1hdGgucm91bmQob2xkQ29udGV4dC52aWV3cG9ydC56b29tKSAhPT0gTWF0aC5yb3VuZChjb250ZXh0LnZpZXdwb3J0Lnpvb20pXG4gICAgKTtcbiAgfVxuXG4gIG5lZWRzUmVjYWxjdWxhdGVTY2FsZUZ1bmN0aW9uKG9sZFByb3BzLCBwcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICBuZWVkc1JlY2FsY3VsYXRlQ29sb3JEb21haW4ob2xkUHJvcHMsIHByb3BzKSB8fFxuICAgICAgbmVlZFJlQ2FsY3VsYXRlU2NhbGVGdW5jdGlvbihvbGRQcm9wcywgcHJvcHMpIHx8XG4gICAgICBuZWVkc1JlY2FsY3VsYXRlUmFkaXVzUmFuZ2Uob2xkUHJvcHMsIHByb3BzKSB8fFxuICAgICAgb2xkUHJvcHMuZ2V0Q29sb3JWYWx1ZSAhPT0gcHJvcHMuZ2V0Q29sb3JWYWx1ZVxuICAgICk7XG4gIH1cblxuICBwcm9jZXNzR2VvSlNPTigpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0UG9zaXRpb259ID0gdGhpcy5wcm9wcztcbiAgICB0aGlzLnNldFN0YXRlKHtnZW9KU09OOiBnZXRHZW9KU09OKGRhdGEsIGdldFBvc2l0aW9uKX0pO1xuICAgIGNsZWFyQ2x1c3RlcmVyQ2FjaGUoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJzKCkge1xuICAgIGNvbnN0IHtnZW9KU09OfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge2NsdXN0ZXJSYWRpdXN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7XG4gICAgICB2aWV3cG9ydCxcbiAgICAgIHZpZXdwb3J0OiB7bG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0LCB3aWR0aH1cbiAgICB9ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgLy8gem9vbSBuZWVkcyB0byBiZSBhbiBpbnRlZ2VyIGZvciB0aGUgZGlmZmVyZW50IG1hcCB1dGlscy4gQWxzbyBoZWxwcyB3aXRoIGNhY2hlIGtleS5cbiAgICBjb25zdCB6b29tID0gTWF0aC5yb3VuZCh2aWV3cG9ydC56b29tKTtcbiAgICBjb25zdCBiYm94ID0gZ2VvVmlld3BvcnQuYm91bmRzKFtsb25naXR1ZGUsIGxhdGl0dWRlXSwgem9vbSwgW1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICBdKTtcblxuICAgIGNvbnN0IGNsdXN0ZXJzID0gY2x1c3RlcnNBdFpvb20oe2Jib3gsIGNsdXN0ZXJSYWRpdXMsIGdlb0pTT04sIHpvb219KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2NsdXN0ZXJzfSk7XG4gIH1cblxuICBnZXRDb2xvclZhbHVlRG9tYWluKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBnZXRDb2xvclZhbHVlLFxuICAgICAgZ2V0UmFkaXVzVmFsdWUsXG4gICAgICBvblNldENvbG9yRG9tYWluXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2NsdXN0ZXJzfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCByYWRpdXNEb21haW4gPSBbMCwgbWF4KGNsdXN0ZXJzLCBnZXRSYWRpdXNWYWx1ZSldO1xuXG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSBjbHVzdGVyc1xuICAgICAgLm1hcChkID0+IGdldENvbG9yVmFsdWUoZC5wcm9wZXJ0aWVzLnBvaW50cykpXG4gICAgICAuZmlsdGVyKG4gPT4gTnVtYmVyLmlzRmluaXRlKG4pKTtcbiAgICBjb25zdCBjb2xvckRvbWFpbiA9XG4gICAgICBjb2xvclNjYWxlID09PSBTQ0FMRV9UWVBFUy5xdWFudGl6ZVxuICAgICAgICA/IGV4dGVudChjb2xvclZhbHVlcylcbiAgICAgICAgOiBjb2xvclZhbHVlcy5zb3J0KGFzY2VuZGluZyk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgcmFkaXVzRG9tYWluXG4gICAgfSk7XG5cbiAgICBnZXRDb2xvclNjYWxlRnVuY3Rpb24odGhpcyk7XG4gICAgZ2V0UmFkaXVzU2NhbGVGdW5jdGlvbih0aGlzKTtcblxuICAgIG9uU2V0Q29sb3JEb21haW4oY29sb3JEb21haW4pO1xuICB9XG5cbiAgZ2V0VXBkYXRlVHJpZ2dlcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldENvbG9yOiB7XG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMucHJvcHMuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JEb21haW46IHRoaXMucHJvcHMuY29sb3JEb21haW4sXG4gICAgICAgIGdldENvbG9yVmFsdWU6IHRoaXMucHJvcHMuZ2V0Q29sb3JWYWx1ZSxcbiAgICAgICAgY29sb3JTY2FsZTogdGhpcy5wcm9wcy5jb2xvclNjYWxlLFxuICAgICAgICBsb3dlclBlcmNlbnRpbGU6IHRoaXMucHJvcHMubG93ZXJQZXJjZW50aWxlLFxuICAgICAgICB1cHBlclBlcmNlbnRpbGU6IHRoaXMucHJvcHMudXBwZXJQZXJjZW50aWxlXG4gICAgICB9LFxuICAgICAgZ2V0UmFkaXVzOiB7XG4gICAgICAgIHJhZGl1c1JhbmdlOiB0aGlzLnByb3BzLnJhZGl1c1JhbmdlLFxuICAgICAgICByYWRpdXNEb21haW46IHRoaXMucHJvcHMucmFkaXVzRG9tYWluLFxuICAgICAgICBnZXRSYWRpdXNWYWx1ZTogdGhpcy5wcm9wcy5nZXRSYWRpdXNWYWx1ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBvdmVycmlkZSBkZWZhdWx0IGxheWVyIG1ldGhvZCB0byBjYWxjdWxhdGUgY2VsbCBjb2xvciBiYXNlZCBvbiBjb2xvciBzY2FsZSBmdW5jdGlvblxuICAgKi9cbiAgX29uR2V0U3VibGF5ZXJDb2xvcihjZWxsKSB7XG4gICAgY29uc3Qge2dldENvbG9yVmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7Y29sb3JTY2FsZUZ1bmMsIGNvbG9yRG9tYWlufSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBjdiA9IGdldENvbG9yVmFsdWUoY2VsbC5wcm9wZXJ0aWVzLnBvaW50cyk7XG5cbiAgICAvLyBpZiBjZWxsIHZhbHVlIGlzIG91dHNpZGUgZG9tYWluLCBzZXQgYWxwaGEgdG8gMFxuICAgIGNvbnN0IGNvbG9yID1cbiAgICAgIE51bWJlci5pc0Zpbml0ZShjdikgJiZcbiAgICAgIGN2ID49IGNvbG9yRG9tYWluWzBdICYmXG4gICAgICBjdiA8PSBjb2xvckRvbWFpbltjb2xvckRvbWFpbi5sZW5ndGggLSAxXVxuICAgICAgICA/IGNvbG9yU2NhbGVGdW5jKGN2KVxuICAgICAgICA6IFswLCAwLCAwLCAwXTtcblxuICAgIC8vIGFkZCBmaW5hbCBhbHBoYSB0byBjb2xvclxuICAgIGNvbG9yWzNdID0gTnVtYmVyLmlzRmluaXRlKGNvbG9yWzNdKSA/IGNvbG9yWzNdIDogMjU1O1xuXG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgX29uR2V0U3VibGF5ZXJSYWRpdXMoY2VsbCkge1xuICAgIGNvbnN0IHtnZXRSYWRpdXNWYWx1ZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtyYWRpdXNTY2FsZUZ1bmN9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gcmFkaXVzU2NhbGVGdW5jKGdldFJhZGl1c1ZhbHVlKGNlbGwpKTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHtpbmZvfSkge1xuICAgIGNvbnN0IHtjbHVzdGVyc30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGlzUGlja2VkID0gaW5mby5waWNrZWQgJiYgaW5mby5pbmRleCA+IC0xO1xuXG4gICAgbGV0IG9iamVjdCA9IG51bGw7XG4gICAgaWYgKGlzUGlja2VkKSB7XG4gICAgICAvLyBhZGQgY2x1c3RlciBjb2xvclZhbHVlIHRvIG9iamVjdFxuICAgICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJzW2luZm8uaW5kZXhdO1xuICAgICAgY29uc3QgY29sb3JWYWx1ZSA9IHRoaXMucHJvcHMuZ2V0Q29sb3JWYWx1ZShjbHVzdGVyLnByb3BlcnRpZXMucG9pbnRzKTtcblxuICAgICAgb2JqZWN0ID0ge1xuICAgICAgICAuLi5jbHVzdGVyLnByb3BlcnRpZXMsXG4gICAgICAgIGNvbG9yVmFsdWUsXG4gICAgICAgIHJhZGl1czogdGhpcy5fb25HZXRTdWJsYXllclJhZGl1cyhjbHVzdGVyKSxcbiAgICAgICAgcG9zaXRpb246IGNsdXN0ZXIuZ2VvbWV0cnkuY29vcmRpbmF0ZXNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmluZm8sXG4gICAgICBwaWNrZWQ6IEJvb2xlYW4ob2JqZWN0KSxcbiAgICAgIC8vIG92ZXJyaWRlIG9iamVjdCB3aXRoIHBpY2tlZCBjbHVzdGVyIHByb3BlcnR5XG4gICAgICBvYmplY3RcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIC8vIGZvciBzdWJjbGFzc2luZywgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcmV0dXJuXG4gICAgLy8gY3VzdG9taXplZCBzdWIgbGF5ZXIgcHJvcHNcbiAgICBjb25zdCB7aWQsIHJhZGl1c1NjYWxlLCBmcDY0fSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBiYXNlIGxheWVyIHByb3BzXG4gICAgY29uc3Qge29wYWNpdHksIHBpY2thYmxlfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyByZXR1cm4gcHJvcHMgdG8gdGhlIHN1YmxheWVyIGNvbnN0cnVjdG9yXG4gICAgcmV0dXJuIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgIGlkOiBgJHtpZH0tY2x1c3RlcmAsXG4gICAgICBkYXRhOiB0aGlzLnN0YXRlLmNsdXN0ZXJzLFxuICAgICAgcmFkaXVzU2NhbGUsXG4gICAgICBmcDY0LFxuICAgICAgZ2V0UG9zaXRpb246IGQgPT4gZC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGdldFJhZGl1czogdGhpcy5fb25HZXRTdWJsYXllclJhZGl1cy5iaW5kKHRoaXMpLFxuICAgICAgb3BhY2l0eSxcbiAgICAgIHBpY2thYmxlLFxuICAgICAgZ2V0Q29sb3I6IHRoaXMuX29uR2V0U3VibGF5ZXJDb2xvci5iaW5kKHRoaXMpLFxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHRoaXMuZ2V0VXBkYXRlVHJpZ2dlcnMoKVxuICAgIH0pO1xuICB9XG59XG5cbkNsdXN0ZXJMYXllci5sYXllck5hbWUgPSAnQ2x1c3RlckxheWVyJztcbkNsdXN0ZXJMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=