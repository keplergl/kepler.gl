'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.clusterVisConfigs = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (ClusterLayer.__proto__ || Object.getPrototypeOf(ClusterLayer)).call(this, props));

    _this.registerVisConfig(clusterVisConfigs);
    return _this;
  }

  (0, _createClass3.default)(ClusterLayer, [{
    key: 'renderLayer',
    value: function renderLayer(_ref) {
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
      }))].concat((0, _toConsumableArray3.default)(this.isLayerHovered(objectHovered) ? [new _deck.ScatterplotLayer({
        id: this.id + '-hovered',
        data: [objectHovered.object],
        getColor: function getColor(d) {
          return _this2.config.highlightColor;
        }
      })] : []));
    }
  }, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLmpzIl0sIm5hbWVzIjpbImNsdXN0ZXJWaXNDb25maWdzIiwib3BhY2l0eSIsImNsdXN0ZXJSYWRpdXMiLCJjb2xvclJhbmdlIiwicmFkaXVzUmFuZ2UiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiQ2x1c3RlckxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImRhdGEiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb24iLCJsYXllckNhbGxiYWNrcyIsInZpc0NvbmZpZyIsImNvbmZpZyIsImlkIiwicmFkaXVzU2NhbGUiLCJnZXRDb2xvclJhbmdlIiwiY29sb3JTY2FsZSIsInBpY2thYmxlIiwiZnA2NCIsImxpZ2h0U2V0dGluZ3MiLCJtZXRhIiwib25TZXRDb2xvckRvbWFpbiIsIm9uU2V0TGF5ZXJEb21haW4iLCJpc0xheWVySG92ZXJlZCIsIm9iamVjdCIsImdldENvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJjb2xvciIsInByb3BlcnR5IiwiZmllbGQiLCJzY2FsZSIsImRvbWFpbiIsInJhbmdlIiwia2V5IiwiZGVmYXVsdE1lYXN1cmUiLCJjaGFubmVsU2NhbGVUeXBlIiwiY29sb3JBZ2dyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRU8sSUFBTUEsZ0RBQW9CO0FBQy9CQyxXQUFTLFNBRHNCO0FBRS9CQyxpQkFBZSxlQUZnQjtBQUcvQkMsY0FBWSxZQUhtQjtBQUkvQkMsZUFBYSxvQkFKa0I7QUFLL0Isa0JBQWdCLGNBTGU7QUFNL0JDLG9CQUFrQixhQU5hO0FBTy9CQyxtQkFBaUI7QUFQYyxDQUExQjs7SUFVY0MsWTs7O0FBQ25CLHdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMElBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLGlCQUFMLENBQXVCVCxpQkFBdkI7QUFIaUI7QUFJbEI7Ozs7c0NBNkJFO0FBQUE7O0FBQUEsVUFQRFUsSUFPQyxRQVBEQSxJQU9DO0FBQUEsVUFOREMsR0FNQyxRQU5EQSxHQU1DO0FBQUEsVUFMREMsZ0JBS0MsUUFMREEsZ0JBS0M7QUFBQSxVQUpEQyxhQUlDLFFBSkRBLGFBSUM7QUFBQSxVQUhEQyxRQUdDLFFBSERBLFFBR0M7QUFBQSxVQUZEQyxXQUVDLFFBRkRBLFdBRUM7QUFBQSxVQUREQyxjQUNDLFFBRERBLGNBQ0M7QUFBQSxVQUNNQyxTQUROLEdBQ21CLEtBQUtDLE1BRHhCLENBQ01ELFNBRE47OztBQUdELGNBQ0Usc0RBQ0tQLElBREwsRUFFS0UsZ0JBRkw7QUFHRU8sWUFBSSxLQUFLQSxFQUhYO0FBSUVSLGdCQUpGO0FBS0VTLHFCQUFhLENBTGY7QUFNRWhCLHFCQUFhYSxVQUFVYixXQU56QjtBQU9FRix1QkFBZWUsVUFBVWYsYUFQM0I7QUFRRUMsb0JBQVksS0FBS2tCLGFBQUwsQ0FBbUJKLFVBQVVkLFVBQTdCLENBUmQ7QUFTRW1CLG9CQUFZLEtBQUtKLE1BQUwsQ0FBWUksVUFUMUI7QUFVRUMsa0JBQVUsSUFWWjtBQVdFdEIsaUJBQVNnQixVQUFVaEIsT0FYckI7QUFZRXVCLGNBQU1QLFVBQVUsY0FBVixDQVpSO0FBYUVRLHVCQUFlLEtBQUtDLElBQUwsQ0FBVUQsYUFiM0I7O0FBZUU7QUFDQUUsMEJBQWtCWCxlQUFlWTtBQWhCbkMsU0FERiwwQ0FvQk0sS0FBS0MsY0FBTCxDQUFvQmhCLGFBQXBCLElBQ0EsQ0FDRSwyQkFBcUI7QUFDbkJNLFlBQU8sS0FBS0EsRUFBWixhQURtQjtBQUVuQlQsY0FBTSxDQUFDRyxjQUFjaUIsTUFBZixDQUZhO0FBR25CQyxrQkFBVTtBQUFBLGlCQUFLLE9BQUtiLE1BQUwsQ0FBWWMsY0FBakI7QUFBQTtBQUhTLE9BQXJCLENBREYsQ0FEQSxHQVFBLEVBNUJOO0FBOEJEOzs7d0JBNURVO0FBQ1QsYUFBTyxTQUFQO0FBQ0Q7Ozt3QkFFb0I7QUFDbkIsYUFBTztBQUNMQyxlQUFPO0FBQ0xDLG9CQUFVLE9BREw7QUFFTEMsaUJBQU8sWUFGRjtBQUdMQyxpQkFBTyxZQUhGO0FBSUxDLGtCQUFRLGFBSkg7QUFLTEMsaUJBQU8sWUFMRjtBQU1MQyxlQUFLLE9BTkE7QUFPTEMsMEJBQWdCLGFBUFg7QUFRTEMsNEJBQWtCLGdDQUFlQztBQVI1QjtBQURGLE9BQVA7QUFZRDs7Ozs7a0JBeEJrQm5DLFkiLCJmaWxlIjoiY2x1c3Rlci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQgQWdncmVnYXRpb25MYXllciBmcm9tICcuLi9hZ2dyZWdhdGlvbi1sYXllcic7XG5pbXBvcnQgRGVja0dMQ2x1c3RlckxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyJztcbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IGNsdXN0ZXJWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNsdXN0ZXJSYWRpdXM6ICdjbHVzdGVyUmFkaXVzJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICByYWRpdXNSYW5nZTogJ2NsdXN0ZXJSYWRpdXNSYW5nZScsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJyxcbiAgY29sb3JBZ2dyZWdhdGlvbjogJ2FnZ3JlZ2F0aW9uJyxcbiAgc2l6ZUFnZ3JlZ2F0aW9uOiAnYWdncmVnYXRpb24nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbHVzdGVyTGF5ZXIgZXh0ZW5kcyBBZ2dyZWdhdGlvbkxheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGNsdXN0ZXJWaXNDb25maWdzKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnY2x1c3Rlcic7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgZGVmYXVsdE1lYXN1cmU6ICdQb2ludCBDb3VudCcsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yQWdnclxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZW5kZXJMYXllcih7XG4gICAgZGF0YSxcbiAgICBpZHgsXG4gICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIG1hcFN0YXRlLFxuICAgIGludGVyYWN0aW9uLFxuICAgIGxheWVyQ2FsbGJhY2tzXG4gIH0pIHtcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBEZWNrR0xDbHVzdGVyTGF5ZXIoe1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgaWR4LFxuICAgICAgICByYWRpdXNTY2FsZTogMSxcbiAgICAgICAgcmFkaXVzUmFuZ2U6IHZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgY2x1c3RlclJhZGl1czogdmlzQ29uZmlnLmNsdXN0ZXJSYWRpdXMsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuZ2V0Q29sb3JSYW5nZSh2aXNDb25maWcuY29sb3JSYW5nZSksXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICBvcGFjaXR5OiB2aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgZnA2NDogdmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgbGlnaHRTZXR0aW5nczogdGhpcy5tZXRhLmxpZ2h0U2V0dGluZ3MsXG5cbiAgICAgICAgLy8gY2FsbCBiYWNrIGZyb20gbGF5ZXIgYWZ0ZXIgY2FsY3VsYXRlIGNsdXN0ZXJzXG4gICAgICAgIG9uU2V0Q29sb3JEb21haW46IGxheWVyQ2FsbGJhY2tzLm9uU2V0TGF5ZXJEb21haW5cbiAgICAgIH0pLFxuXG4gICAgICAuLi4odGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKVxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgICAgICAgICBkYXRhOiBbb2JqZWN0SG92ZXJlZC5vYmplY3RdLFxuICAgICAgICAgICAgICBnZXRDb2xvcjogZCA9PiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvclxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19