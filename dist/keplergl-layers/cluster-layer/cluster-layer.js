'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.clusterVisConfigs = undefined;

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

var _aggregationLayer = require('../aggregation-layer');

var _aggregationLayer2 = _interopRequireDefault(_aggregationLayer);

var _clusterLayer = require('../../deckgl-layers/cluster-layer/cluster-layer');

var _clusterLayer2 = _interopRequireDefault(_clusterLayer);

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clusterVisConfigs = exports.clusterVisConfigs = {
  opacity: 'opacity',
  clusterRadius: 'clusterRadius',
  colorRange: 'colorRange',
  radiusRange: 'clusterRadiusRange',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation'
};

var ClusterLayer = function (_AggregationLayer) {
  (0, _inherits3.default)(ClusterLayer, _AggregationLayer);

  function ClusterLayer(props) {
    (0, _classCallCheck3.default)(this, ClusterLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _AggregationLayer.call(this, props));

    _this.registerVisConfig(clusterVisConfigs);
    return _this;
  }

  ClusterLayer.prototype.renderLayer = function renderLayer(_ref) {
    var _this2 = this;

    var data = _ref.data,
        idx = _ref.idx,
        layerInteraction = _ref.layerInteraction,
        objectHovered = _ref.objectHovered,
        mapState = _ref.mapState,
        interaction = _ref.interaction,
        layerCallbacks = _ref.layerCallbacks;
    var visConfig = this.config.visConfig;


    return [new _clusterLayer2.default((0, _extends3.default)({}, data, layerInteraction, {
      id: this.id,
      idx: idx,
      radiusScale: 1,
      radiusRange: visConfig.radiusRange,
      clusterRadius: visConfig.clusterRadius,
      colorRange: this.getColorRange(visConfig.colorRange),
      colorScale: this.config.colorScale,
      pickable: true,
      opacity: visConfig.opacity,
      fp64: visConfig['hi-precision'],
      lightSettings: this.meta.lightSettings,

      // call back from layer after calculate clusters
      onSetColorDomain: layerCallbacks.onSetLayerDomain
    }))].concat(this.isLayerHovered(objectHovered) ? [new _deck.ScatterplotLayer({
      id: this.id + '-hovered',
      data: [objectHovered.object],
      getColor: function getColor(d) {
        return _this2.config.highlightColor;
      }
    })] : []);
  };

  (0, _createClass3.default)(ClusterLayer, [{
    key: 'type',
    get: function get() {
      return 'cluster';
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          defaultMeasure: 'Point Count',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.colorAggr
        }
      };
    }
  }]);
  return ClusterLayer;
}(_aggregationLayer2.default);

exports.default = ClusterLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLmpzIl0sIm5hbWVzIjpbImNsdXN0ZXJWaXNDb25maWdzIiwib3BhY2l0eSIsImNsdXN0ZXJSYWRpdXMiLCJjb2xvclJhbmdlIiwicmFkaXVzUmFuZ2UiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiQ2x1c3RlckxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsInJlbmRlckxheWVyIiwiZGF0YSIsImlkeCIsImxheWVySW50ZXJhY3Rpb24iLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbiIsImxheWVyQ2FsbGJhY2tzIiwidmlzQ29uZmlnIiwiY29uZmlnIiwiaWQiLCJyYWRpdXNTY2FsZSIsImdldENvbG9yUmFuZ2UiLCJjb2xvclNjYWxlIiwicGlja2FibGUiLCJmcDY0IiwibGlnaHRTZXR0aW5ncyIsIm1ldGEiLCJvblNldENvbG9yRG9tYWluIiwib25TZXRMYXllckRvbWFpbiIsImlzTGF5ZXJIb3ZlcmVkIiwib2JqZWN0IiwiZ2V0Q29sb3IiLCJoaWdobGlnaHRDb2xvciIsImNvbG9yIiwicHJvcGVydHkiLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJkZWZhdWx0TWVhc3VyZSIsImNoYW5uZWxTY2FsZVR5cGUiLCJjb2xvckFnZ3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLGdEQUFvQjtBQUMvQkMsV0FBUyxTQURzQjtBQUUvQkMsaUJBQWUsZUFGZ0I7QUFHL0JDLGNBQVksWUFIbUI7QUFJL0JDLGVBQWEsb0JBSmtCO0FBSy9CLGtCQUFnQixjQUxlO0FBTS9CQyxvQkFBa0IsYUFOYTtBQU8vQkMsbUJBQWlCO0FBUGMsQ0FBMUI7O0lBVWNDLFk7OztBQUNuQix3QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtEQUNqQiw2QkFBTUEsS0FBTixDQURpQjs7QUFHakIsVUFBS0MsaUJBQUwsQ0FBdUJULGlCQUF2QjtBQUhpQjtBQUlsQjs7eUJBcUJEVSxXLDhCQVFHO0FBQUE7O0FBQUEsUUFQREMsSUFPQyxRQVBEQSxJQU9DO0FBQUEsUUFOREMsR0FNQyxRQU5EQSxHQU1DO0FBQUEsUUFMREMsZ0JBS0MsUUFMREEsZ0JBS0M7QUFBQSxRQUpEQyxhQUlDLFFBSkRBLGFBSUM7QUFBQSxRQUhEQyxRQUdDLFFBSERBLFFBR0M7QUFBQSxRQUZEQyxXQUVDLFFBRkRBLFdBRUM7QUFBQSxRQUREQyxjQUNDLFFBRERBLGNBQ0M7QUFBQSxRQUNNQyxTQUROLEdBQ21CLEtBQUtDLE1BRHhCLENBQ01ELFNBRE47OztBQUdELFlBQ0Usc0RBQ0tQLElBREwsRUFFS0UsZ0JBRkw7QUFHRU8sVUFBSSxLQUFLQSxFQUhYO0FBSUVSLGNBSkY7QUFLRVMsbUJBQWEsQ0FMZjtBQU1FakIsbUJBQWFjLFVBQVVkLFdBTnpCO0FBT0VGLHFCQUFlZ0IsVUFBVWhCLGFBUDNCO0FBUUVDLGtCQUFZLEtBQUttQixhQUFMLENBQW1CSixVQUFVZixVQUE3QixDQVJkO0FBU0VvQixrQkFBWSxLQUFLSixNQUFMLENBQVlJLFVBVDFCO0FBVUVDLGdCQUFVLElBVlo7QUFXRXZCLGVBQVNpQixVQUFVakIsT0FYckI7QUFZRXdCLFlBQU1QLFVBQVUsY0FBVixDQVpSO0FBYUVRLHFCQUFlLEtBQUtDLElBQUwsQ0FBVUQsYUFiM0I7O0FBZUU7QUFDQUUsd0JBQWtCWCxlQUFlWTtBQWhCbkMsT0FERixTQW9CTSxLQUFLQyxjQUFMLENBQW9CaEIsYUFBcEIsSUFDQSxDQUNFLDJCQUFxQjtBQUNuQk0sVUFBTyxLQUFLQSxFQUFaLGFBRG1CO0FBRW5CVCxZQUFNLENBQUNHLGNBQWNpQixNQUFmLENBRmE7QUFHbkJDLGdCQUFVO0FBQUEsZUFBSyxPQUFLYixNQUFMLENBQVljLGNBQWpCO0FBQUE7QUFIUyxLQUFyQixDQURGLENBREEsR0FRQSxFQTVCTjtBQThCRCxHOzs7O3dCQTVEVTtBQUNULGFBQU8sU0FBUDtBQUNEOzs7d0JBRW9CO0FBQ25CLGFBQU87QUFDTEMsZUFBTztBQUNMQyxvQkFBVSxPQURMO0FBRUxDLGlCQUFPLFlBRkY7QUFHTEMsaUJBQU8sWUFIRjtBQUlMQyxrQkFBUSxhQUpIO0FBS0xDLGlCQUFPLFlBTEY7QUFNTEMsZUFBSyxPQU5BO0FBT0xDLDBCQUFnQixhQVBYO0FBUUxDLDRCQUFrQixnQ0FBZUM7QUFSNUI7QUFERixPQUFQO0FBWUQ7Ozs7O2tCQXhCa0JwQyxZIiwiZmlsZSI6ImNsdXN0ZXItbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IERlY2tHTENsdXN0ZXJMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllcic7XG5pbXBvcnQge0NIQU5ORUxfU0NBTEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBjb25zdCBjbHVzdGVyVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjbHVzdGVyUmFkaXVzOiAnY2x1c3RlclJhZGl1cycsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdjbHVzdGVyUmFkaXVzUmFuZ2UnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbicsXG4gIGNvbG9yQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbicsXG4gIHNpemVBZ2dyZWdhdGlvbjogJ2FnZ3JlZ2F0aW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2x1c3RlckxheWVyIGV4dGVuZHMgQWdncmVnYXRpb25MYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhjbHVzdGVyVmlzQ29uZmlncyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2NsdXN0ZXInO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnY29sb3JEb21haW4nLFxuICAgICAgICByYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICAgICAgICBrZXk6ICdjb2xvcicsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAnUG9pbnQgQ291bnQnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3JcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe1xuICAgIGRhdGEsXG4gICAgaWR4LFxuICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgb2JqZWN0SG92ZXJlZCxcbiAgICBtYXBTdGF0ZSxcbiAgICBpbnRlcmFjdGlvbixcbiAgICBsYXllckNhbGxiYWNrc1xuICB9KSB7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMQ2x1c3RlckxheWVyKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgcmFkaXVzU2NhbGU6IDEsXG4gICAgICAgIHJhZGl1c1JhbmdlOiB2aXNDb25maWcucmFkaXVzUmFuZ2UsXG4gICAgICAgIGNsdXN0ZXJSYWRpdXM6IHZpc0NvbmZpZy5jbHVzdGVyUmFkaXVzLFxuICAgICAgICBjb2xvclJhbmdlOiB0aGlzLmdldENvbG9yUmFuZ2UodmlzQ29uZmlnLmNvbG9yUmFuZ2UpLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgb3BhY2l0eTogdmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIGZwNjQ6IHZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICAgIGxpZ2h0U2V0dGluZ3M6IHRoaXMubWV0YS5saWdodFNldHRpbmdzLFxuXG4gICAgICAgIC8vIGNhbGwgYmFjayBmcm9tIGxheWVyIGFmdGVyIGNhbGN1bGF0ZSBjbHVzdGVyc1xuICAgICAgICBvblNldENvbG9yRG9tYWluOiBsYXllckNhbGxiYWNrcy5vblNldExheWVyRG9tYWluXG4gICAgICB9KSxcblxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZClcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgICAgICAgZGF0YTogW29iamVjdEhvdmVyZWQub2JqZWN0XSxcbiAgICAgICAgICAgICAgZ2V0Q29sb3I6IGQgPT4gdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3JcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==