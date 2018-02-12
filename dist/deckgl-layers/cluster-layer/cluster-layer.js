'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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
    return (0, _possibleConstructorReturn3.default)(this, (ClusterLayer.__proto__ || Object.getPrototypeOf(ClusterLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ClusterLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      this.state = {
        clusters: null,
        geoJSON: null
      };
    }
  }, {
    key: 'shouldUpdateState',
    value: function shouldUpdateState(_ref) {
      var changeFlags = _ref.changeFlags;

      return changeFlags.somethingChanged;
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref2) {
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
    }
  }, {
    key: 'needsReProjectPoints',
    value: function needsReProjectPoints(oldProps, props) {
      return oldProps.clusterRadius !== props.clusterRadius || oldProps.getPosition !== props.getPosition;
    }
  }, {
    key: 'needsReclusterPoints',
    value: function needsReclusterPoints(oldContext, context) {
      return Math.round(oldContext.viewport.zoom) !== Math.round(context.viewport.zoom);
    }
  }, {
    key: 'needsRecalculateScaleFunction',
    value: function needsRecalculateScaleFunction(oldProps, props) {
      return (0, _utils.needsRecalculateColorDomain)(oldProps, props) || (0, _utils.needReCalculateScaleFunction)(oldProps, props) || (0, _utils.needsRecalculateRadiusRange)(oldProps, props) || oldProps.getColorValue !== props.getColorValue;
    }
  }, {
    key: 'processGeoJSON',
    value: function processGeoJSON() {
      var _props = this.props,
          data = _props.data,
          getPosition = _props.getPosition;

      this.setState({ geoJSON: (0, _clusterUtils.getGeoJSON)(data, getPosition) });
      (0, _clusterUtils.clearClustererCache)();
    }
  }, {
    key: 'getClusters',
    value: function getClusters() {
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
    }
  }, {
    key: 'getColorValueDomain',
    value: function getColorValueDomain() {
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
    }
  }, {
    key: 'getUpdateTriggers',
    value: function getUpdateTriggers() {
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
    }

    /*
     * override default layer method to calculate cell color based on color scale function
     */

  }, {
    key: '_onGetSublayerColor',
    value: function _onGetSublayerColor(cell) {
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
    }
  }, {
    key: '_onGetSublayerRadius',
    value: function _onGetSublayerRadius(cell) {
      var getRadiusValue = this.props.getRadiusValue;
      var radiusScaleFunc = this.state.radiusScaleFunc;

      return radiusScaleFunc(getRadiusValue(cell));
    }
  }, {
    key: 'getPickingInfo',
    value: function getPickingInfo(_ref3) {
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
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
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
    }
  }]);
  return ClusterLayer;
}(_deck.CompositeLayer);

exports.default = ClusterLayer;


ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmFkaXVzIiwiY2x1c3RlclJhZGl1cyIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHRSYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXNSYW5nZSIsImRlZmF1bHRQcm9wcyIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJxdWFudGl6ZSIsInJhZGl1c1JhbmdlIiwibG93ZXJQZXJjZW50aWxlIiwidXBwZXJQZXJjZW50aWxlIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwiZ2V0UmFkaXVzVmFsdWUiLCJjZWxsIiwicHJvcGVydGllcyIsInBvaW50X2NvdW50IiwiZnA2NCIsIkNsdXN0ZXJMYXllciIsInN0YXRlIiwiY2x1c3RlcnMiLCJnZW9KU09OIiwiY2hhbmdlRmxhZ3MiLCJzb21ldGhpbmdDaGFuZ2VkIiwib2xkQ29udGV4dCIsImNvbnRleHQiLCJvbGRQcm9wcyIsInByb3BzIiwiZGF0YUNoYW5nZWQiLCJuZWVkc1JlUHJvamVjdFBvaW50cyIsInByb2Nlc3NHZW9KU09OIiwiZ2V0Q2x1c3RlcnMiLCJnZXRDb2xvclZhbHVlRG9tYWluIiwibmVlZHNSZWNsdXN0ZXJQb2ludHMiLCJuZWVkc1JlY2FsY3VsYXRlU2NhbGVGdW5jdGlvbiIsIk1hdGgiLCJyb3VuZCIsInZpZXdwb3J0Iiwiem9vbSIsImRhdGEiLCJzZXRTdGF0ZSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiaGVpZ2h0Iiwid2lkdGgiLCJiYm94IiwiYm91bmRzIiwib25TZXRDb2xvckRvbWFpbiIsInJhZGl1c0RvbWFpbiIsImNvbG9yVmFsdWVzIiwibWFwIiwiZCIsImZpbHRlciIsIk51bWJlciIsImlzRmluaXRlIiwibiIsInNvcnQiLCJnZXRDb2xvciIsImdldFJhZGl1cyIsImNvbG9yU2NhbGVGdW5jIiwiY3YiLCJjb2xvciIsInJhZGl1c1NjYWxlRnVuYyIsImluZm8iLCJpc1BpY2tlZCIsInBpY2tlZCIsImluZGV4Iiwib2JqZWN0IiwiY2x1c3RlciIsImNvbG9yVmFsdWUiLCJyYWRpdXMiLCJfb25HZXRTdWJsYXllclJhZGl1cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJCb29sZWFuIiwiaWQiLCJyYWRpdXNTY2FsZSIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImJpbmQiLCJfb25HZXRTdWJsYXllckNvbG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXRVcGRhdGVUcmlnZ2VycyIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFPQTs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQU1BLElBQU1BLGdCQUFnQixnQ0FBa0JDLGFBQWxCLENBQWdDQyxZQUF0RDtBQUNBLElBQU1DLHFCQUFxQixnQ0FBa0JDLGtCQUFsQixDQUFxQ0YsWUFBaEU7O0FBRUEsSUFBTUcsZUFBZTtBQUNuQkosaUJBQWVELGFBREk7QUFFbkJNLGVBQWEsSUFGTTtBQUduQkMsa0RBSG1CO0FBSW5CQyxjQUFZLDZCQUFZQyxRQUpMO0FBS25CQyxlQUFhUCxrQkFMTTs7QUFPbkI7QUFDQVEsbUJBQWlCLENBUkU7QUFTbkJDLG1CQUFpQixHQVRFOztBQVduQkMsZUFBYTtBQUFBLFdBQUtDLEVBQUVDLFFBQVA7QUFBQSxHQVhNOztBQWFuQjtBQUNBQyxpQkFBZTtBQUFBLFdBQVVDLE9BQU9DLE1BQWpCO0FBQUEsR0FkSTs7QUFnQm5CO0FBQ0FDLGtCQUFnQjtBQUFBLFdBQVFDLEtBQUtDLFVBQUwsQ0FBZ0JDLFdBQXhCO0FBQUEsR0FqQkc7QUFrQm5CQyxRQUFNO0FBbEJhLENBQXJCOztJQXFCcUJDLFk7Ozs7Ozs7Ozs7c0NBQ0Q7QUFDaEIsV0FBS0MsS0FBTCxHQUFhO0FBQ1hDLGtCQUFVLElB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QUFRMUJDLDBCQVIwQjtBQVMxQnJCLGtCQUFVLEtBQUt1QixtQkFBTCxDQUF5QkQsSUFBekIsQ0FBOEIsSUFBOUIsQ0FUZ0I7QUFVMUJFLHdCQUFnQixLQUFLQyxpQkFBTDtBQVZVLE9BQXJCLENBQVA7QUFZRDs7Ozs7a0JBeE1rQmhFLFk7OztBQTJNckJBLGFBQWFpRSxTQUFiLEdBQXlCLGNBQXpCO0FBQ0FqRSxhQUFhbkIsWUFBYixHQUE0QkEsWUFBNUIiLCJmaWxlIjoiY2x1c3Rlci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlTGF5ZXIsIFNjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IGdlb1ZpZXdwb3J0IGZyb20gJ0BtYXBib3gvZ2VvLXZpZXdwb3J0JztcbmltcG9ydCB7YXNjZW5kaW5nLCBleHRlbnQsIG1heH0gZnJvbSAnZDMtYXJyYXknO1xuXG5pbXBvcnQge1xuICBnZXRDb2xvclNjYWxlRnVuY3Rpb24sXG4gIGdldFJhZGl1c1NjYWxlRnVuY3Rpb24sXG4gIG5lZWRzUmVjYWxjdWxhdGVSYWRpdXNSYW5nZSxcbiAgbmVlZHNSZWNhbGN1bGF0ZUNvbG9yRG9tYWluLFxuICBuZWVkUmVDYWxjdWxhdGVTY2FsZUZ1bmN0aW9uXG59IGZyb20gJy4uL2xheWVyLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7ZGVmYXVsdFViZXJDb2xvclJhbmdlfSBmcm9tICcuLi8uLi9jb25zdGFudHMvdWJlci12aXotY29sb3JzJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJy4uLy4uL2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCB7U0NBTEVfVFlQRVN9IGZyb20gJy4uLy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtcbiAgY2xlYXJDbHVzdGVyZXJDYWNoZSxcbiAgY2x1c3RlcnNBdFpvb20sXG4gIGdldEdlb0pTT05cbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY2x1c3Rlci11dGlscyc7XG5cbmNvbnN0IGRlZmF1bHRSYWRpdXMgPSBMQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzLmRlZmF1bHRWYWx1ZTtcbmNvbnN0IGRlZmF1bHRSYWRpdXNSYW5nZSA9IExBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXNSYW5nZS5kZWZhdWx0VmFsdWU7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY2x1c3RlclJhZGl1czogZGVmYXVsdFJhZGl1cyxcbiAgY29sb3JEb21haW46IG51bGwsXG4gIGNvbG9yUmFuZ2U6IGRlZmF1bHRVYmVyQ29sb3JSYW5nZSxcbiAgY29sb3JTY2FsZTogU0NBTEVfVFlQRVMucXVhbnRpemUsXG4gIHJhZGl1c1JhbmdlOiBkZWZhdWx0UmFkaXVzUmFuZ2UsXG5cbiAgLy8gbWF5YmUgbGF0ZXIuLi5cbiAgbG93ZXJQZXJjZW50aWxlOiAwLFxuICB1cHBlclBlcmNlbnRpbGU6IDEwMCxcblxuICBnZXRQb3NpdGlvbjogeCA9PiB4LnBvc2l0aW9uLFxuXG4gIC8vIGlmIHdhbnQgdG8gaGF2ZSBjb2xvciBiYXNlZCBvbiBjdXN0b21pemVkIGFnZ3JlZ2F0b3IsIGluc3RlYWQgb2YgY291bnRcbiAgZ2V0Q29sb3JWYWx1ZTogcG9pbnRzID0+IHBvaW50cy5sZW5ndGgsXG5cbiAgLy8gIGlmIHdhbnQgdG8gaGF2ZSByYWRpdXMgYmFzZWQgb24gY3VzdG9taXplZCBhZ2dyZWdhdG9yLCBpbnN0ZWFkIG9mIGNvdW50XG4gIGdldFJhZGl1c1ZhbHVlOiBjZWxsID0+IGNlbGwucHJvcGVydGllcy5wb2ludF9jb3VudCxcbiAgZnA2NDogZmFsc2Vcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJMYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjbHVzdGVyczogbnVsbCxcbiAgICAgIGdlb0pTT046IG51bGxcbiAgICB9O1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlU3RhdGUoe2NoYW5nZUZsYWdzfSkge1xuICAgIHJldHVybiBjaGFuZ2VGbGFncy5zb21ldGhpbmdDaGFuZ2VkO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe29sZENvbnRleHQsIGNvbnRleHQsIG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3N9KSB7XG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkIHx8IHRoaXMubmVlZHNSZVByb2plY3RQb2ludHMob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgLy8gcHJvamVjdCBkYXRhIGludG8gY2x1c3RlcnMsIGFuZCBnZXQgY2x1c3RlcmVkIGRhdGFcbiAgICAgIHRoaXMucHJvY2Vzc0dlb0pTT04oKTtcbiAgICAgIHRoaXMuZ2V0Q2x1c3RlcnMoKTtcblxuICAgICAgLy8gdGhpcyBuZWVkcyBjbHVzdGVyZWQgZGF0YSB0byBiZSBzZXRcbiAgICAgIHRoaXMuZ2V0Q29sb3JWYWx1ZURvbWFpbigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uZWVkc1JlY2x1c3RlclBvaW50cyhvbGRDb250ZXh0LCBjb250ZXh0KSkge1xuICAgICAgdGhpcy5nZXRDbHVzdGVycygpO1xuICAgICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5lZWRzUmVjYWxjdWxhdGVTY2FsZUZ1bmN0aW9uKG9sZFByb3BzLCBwcm9wcykpIHtcbiAgICAgIHRoaXMuZ2V0Q29sb3JWYWx1ZURvbWFpbigpO1xuICAgIH1cbiAgfVxuXG4gIG5lZWRzUmVQcm9qZWN0UG9pbnRzKG9sZFByb3BzLCBwcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICBvbGRQcm9wcy5jbHVzdGVyUmFkaXVzICE9PSBwcm9wcy5jbHVzdGVyUmFkaXVzIHx8XG4gICAgICBvbGRQcm9wcy5nZXRQb3NpdGlvbiAhPT0gcHJvcHMuZ2V0UG9zaXRpb25cbiAgICApO1xuICB9XG5cbiAgbmVlZHNSZWNsdXN0ZXJQb2ludHMob2xkQ29udGV4dCwgY29udGV4dCkge1xuICAgIHJldHVybiAoXG4gICAgICBNYXRoLnJvdW5kKG9sZENvbnRleHQudmlld3BvcnQuem9vbSkgIT09IE1hdGgucm91bmQoY29udGV4dC52aWV3cG9ydC56b29tKVxuICAgICk7XG4gIH1cblxuICBuZWVkc1JlY2FsY3VsYXRlU2NhbGVGdW5jdGlvbihvbGRQcm9wcywgcHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgbmVlZHNSZWNhbGN1bGF0ZUNvbG9yRG9tYWluKG9sZFByb3BzLCBwcm9wcykgfHxcbiAgICAgIG5lZWRSZUNhbGN1bGF0ZVNjYWxlRnVuY3Rpb24ob2xkUHJvcHMsIHByb3BzKSB8fFxuICAgICAgbmVlZHNSZWNhbGN1bGF0ZVJhZGl1c1JhbmdlKG9sZFByb3BzLCBwcm9wcykgfHxcbiAgICAgIG9sZFByb3BzLmdldENvbG9yVmFsdWUgIT09IHByb3BzLmdldENvbG9yVmFsdWVcbiAgICApO1xuICB9XG5cbiAgcHJvY2Vzc0dlb0pTT04oKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldFBvc2l0aW9ufSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Z2VvSlNPTjogZ2V0R2VvSlNPTihkYXRhLCBnZXRQb3NpdGlvbil9KTtcbiAgICBjbGVhckNsdXN0ZXJlckNhY2hlKCk7XG4gIH1cblxuICBnZXRDbHVzdGVycygpIHtcbiAgICBjb25zdCB7Z2VvSlNPTn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHtjbHVzdGVyUmFkaXVzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge1xuICAgICAgdmlld3BvcnQsXG4gICAgICB2aWV3cG9ydDoge2xvbmdpdHVkZSwgbGF0aXR1ZGUsIGhlaWdodCwgd2lkdGh9XG4gICAgfSA9IHRoaXMuY29udGV4dDtcblxuICAgIC8vIHpvb20gbmVlZHMgdG8gYmUgYW4gaW50ZWdlciBmb3IgdGhlIGRpZmZlcmVudCBtYXAgdXRpbHMuIEFsc28gaGVscHMgd2l0aCBjYWNoZSBrZXkuXG4gICAgY29uc3Qgem9vbSA9IE1hdGgucm91bmQodmlld3BvcnQuem9vbSk7XG4gICAgY29uc3QgYmJveCA9IGdlb1ZpZXdwb3J0LmJvdW5kcyhbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIHpvb20sIFtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgXSk7XG5cbiAgICBjb25zdCBjbHVzdGVycyA9IGNsdXN0ZXJzQXRab29tKHtiYm94LCBjbHVzdGVyUmFkaXVzLCBnZW9KU09OLCB6b29tfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtjbHVzdGVyc30pO1xuICB9XG5cbiAgZ2V0Q29sb3JWYWx1ZURvbWFpbigpIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgZ2V0Q29sb3JWYWx1ZSxcbiAgICAgIGdldFJhZGl1c1ZhbHVlLFxuICAgICAgb25TZXRDb2xvckRvbWFpblxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjbHVzdGVyc30gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgcmFkaXVzRG9tYWluID0gWzAsIG1heChjbHVzdGVycywgZ2V0UmFkaXVzVmFsdWUpXTtcblxuICAgIGNvbnN0IGNvbG9yVmFsdWVzID0gY2x1c3RlcnNcbiAgICAgIC5tYXAoZCA9PiBnZXRDb2xvclZhbHVlKGQucHJvcGVydGllcy5wb2ludHMpKVxuICAgICAgLmZpbHRlcihuID0+IE51bWJlci5pc0Zpbml0ZShuKSk7XG4gICAgY29uc3QgY29sb3JEb21haW4gPVxuICAgICAgY29sb3JTY2FsZSA9PT0gU0NBTEVfVFlQRVMucXVhbnRpemVcbiAgICAgICAgPyBleHRlbnQoY29sb3JWYWx1ZXMpXG4gICAgICAgIDogY29sb3JWYWx1ZXMuc29ydChhc2NlbmRpbmcpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIHJhZGl1c0RvbWFpblxuICAgIH0pO1xuXG4gICAgZ2V0Q29sb3JTY2FsZUZ1bmN0aW9uKHRoaXMpO1xuICAgIGdldFJhZGl1c1NjYWxlRnVuY3Rpb24odGhpcyk7XG5cbiAgICBvblNldENvbG9yRG9tYWluKGNvbG9yRG9tYWluKTtcbiAgfVxuXG4gIGdldFVwZGF0ZVRyaWdnZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRDb2xvcjoge1xuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLnByb3BzLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yRG9tYWluOiB0aGlzLnByb3BzLmNvbG9yRG9tYWluLFxuICAgICAgICBnZXRDb2xvclZhbHVlOiB0aGlzLnByb3BzLmdldENvbG9yVmFsdWUsXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMucHJvcHMuY29sb3JTY2FsZSxcbiAgICAgICAgbG93ZXJQZXJjZW50aWxlOiB0aGlzLnByb3BzLmxvd2VyUGVyY2VudGlsZSxcbiAgICAgICAgdXBwZXJQZXJjZW50aWxlOiB0aGlzLnByb3BzLnVwcGVyUGVyY2VudGlsZVxuICAgICAgfSxcbiAgICAgIGdldFJhZGl1czoge1xuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5wcm9wcy5yYWRpdXNSYW5nZSxcbiAgICAgICAgcmFkaXVzRG9tYWluOiB0aGlzLnByb3BzLnJhZGl1c0RvbWFpbixcbiAgICAgICAgZ2V0UmFkaXVzVmFsdWU6IHRoaXMucHJvcHMuZ2V0UmFkaXVzVmFsdWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLypcbiAgICogb3ZlcnJpZGUgZGVmYXVsdCBsYXllciBtZXRob2QgdG8gY2FsY3VsYXRlIGNlbGwgY29sb3IgYmFzZWQgb24gY29sb3Igc2NhbGUgZnVuY3Rpb25cbiAgICovXG4gIF9vbkdldFN1YmxheWVyQ29sb3IoY2VsbCkge1xuICAgIGNvbnN0IHtnZXRDb2xvclZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2NvbG9yU2NhbGVGdW5jLCBjb2xvckRvbWFpbn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgY3YgPSBnZXRDb2xvclZhbHVlKGNlbGwucHJvcGVydGllcy5wb2ludHMpO1xuXG4gICAgLy8gaWYgY2VsbCB2YWx1ZSBpcyBvdXRzaWRlIGRvbWFpbiwgc2V0IGFscGhhIHRvIDBcbiAgICBjb25zdCBjb2xvciA9XG4gICAgICBOdW1iZXIuaXNGaW5pdGUoY3YpICYmXG4gICAgICBjdiA+PSBjb2xvckRvbWFpblswXSAmJlxuICAgICAgY3YgPD0gY29sb3JEb21haW5bY29sb3JEb21haW4ubGVuZ3RoIC0gMV1cbiAgICAgICAgPyBjb2xvclNjYWxlRnVuYyhjdilcbiAgICAgICAgOiBbMCwgMCwgMCwgMF07XG5cbiAgICAvLyBhZGQgZmluYWwgYWxwaGEgdG8gY29sb3JcbiAgICBjb2xvclszXSA9IE51bWJlci5pc0Zpbml0ZShjb2xvclszXSkgPyBjb2xvclszXSA6IDI1NTtcblxuICAgIHJldHVybiBjb2xvcjtcbiAgfVxuXG4gIF9vbkdldFN1YmxheWVyUmFkaXVzKGNlbGwpIHtcbiAgICBjb25zdCB7Z2V0UmFkaXVzVmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7cmFkaXVzU2NhbGVGdW5jfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIHJhZGl1c1NjYWxlRnVuYyhnZXRSYWRpdXNWYWx1ZShjZWxsKSk7XG4gIH1cblxuICBnZXRQaWNraW5nSW5mbyh7aW5mb30pIHtcbiAgICBjb25zdCB7Y2x1c3RlcnN9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBpc1BpY2tlZCA9IGluZm8ucGlja2VkICYmIGluZm8uaW5kZXggPiAtMTtcblxuICAgIGxldCBvYmplY3QgPSBudWxsO1xuICAgIGlmIChpc1BpY2tlZCkge1xuICAgICAgLy8gYWRkIGNsdXN0ZXIgY29sb3JWYWx1ZSB0byBvYmplY3RcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVyc1tpbmZvLmluZGV4XTtcbiAgICAgIGNvbnN0IGNvbG9yVmFsdWUgPSB0aGlzLnByb3BzLmdldENvbG9yVmFsdWUoY2x1c3Rlci5wcm9wZXJ0aWVzLnBvaW50cyk7XG5cbiAgICAgIG9iamVjdCA9IHtcbiAgICAgICAgLi4uY2x1c3Rlci5wcm9wZXJ0aWVzLFxuICAgICAgICBjb2xvclZhbHVlLFxuICAgICAgICByYWRpdXM6IHRoaXMuX29uR2V0U3VibGF5ZXJSYWRpdXMoY2x1c3RlciksXG4gICAgICAgIHBvc2l0aW9uOiBjbHVzdGVyLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5pbmZvLFxuICAgICAgcGlja2VkOiBCb29sZWFuKG9iamVjdCksXG4gICAgICAvLyBvdmVycmlkZSBvYmplY3Qgd2l0aCBwaWNrZWQgY2x1c3RlciBwcm9wZXJ0eVxuICAgICAgb2JqZWN0XG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICAvLyBmb3Igc3ViY2xhc3NpbmcsIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIHJldHVyblxuICAgIC8vIGN1c3RvbWl6ZWQgc3ViIGxheWVyIHByb3BzXG4gICAgY29uc3Qge2lkLCByYWRpdXNTY2FsZSwgZnA2NH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gYmFzZSBsYXllciBwcm9wc1xuICAgIGNvbnN0IHtvcGFjaXR5LCBwaWNrYWJsZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gcmV0dXJuIHByb3BzIHRvIHRoZSBzdWJsYXllciBjb25zdHJ1Y3RvclxuICAgIHJldHVybiBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICBpZDogYCR7aWR9LWNsdXN0ZXJgLFxuICAgICAgZGF0YTogdGhpcy5zdGF0ZS5jbHVzdGVycyxcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgZnA2NCxcbiAgICAgIGdldFBvc2l0aW9uOiBkID0+IGQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICBnZXRSYWRpdXM6IHRoaXMuX29uR2V0U3VibGF5ZXJSYWRpdXMuYmluZCh0aGlzKSxcbiAgICAgIG9wYWNpdHksXG4gICAgICBwaWNrYWJsZSxcbiAgICAgIGdldENvbG9yOiB0aGlzLl9vbkdldFN1YmxheWVyQ29sb3IuYmluZCh0aGlzKSxcbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB0aGlzLmdldFVwZGF0ZVRyaWdnZXJzKClcbiAgICB9KTtcbiAgfVxufVxuXG5DbHVzdGVyTGF5ZXIubGF5ZXJOYW1lID0gJ0NsdXN0ZXJMYXllcic7XG5DbHVzdGVyTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19