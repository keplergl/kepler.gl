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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLmpzIl0sIm5hbWVzIjpbImNsdXN0ZXJWaXNDb25maWdzIiwib3BhY2l0eSIsImNsdXN0ZXJSYWRpdXMiLCJjb2xvclJhbmdlIiwicmFkaXVzUmFuZ2UiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiQ2x1c3RlckxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsInJlbmRlckxheWVyIiwiZGF0YSIsImlkeCIsImxheWVySW50ZXJhY3Rpb24iLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbiIsImxheWVyQ2FsbGJhY2tzIiwidmlzQ29uZmlnIiwiY29uZmlnIiwiaWQiLCJyYWRpdXNTY2FsZSIsImdldENvbG9yUmFuZ2UiLCJjb2xvclNjYWxlIiwicGlja2FibGUiLCJmcDY0IiwibGlnaHRTZXR0aW5ncyIsIm1ldGEiLCJvblNldENvbG9yRG9tYWluIiwib25TZXRMYXllckRvbWFpbiIsImlzTGF5ZXJIb3ZlcmVkIiwib2JqZWN0IiwiZ2V0Q29sb3IiLCJoaWdobGlnaHRDb2xvciIsImNvbG9yIiwicHJvcGVydHkiLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJkZWZhdWx0TWVhc3VyZSIsImNoYW5uZWxTY2FsZVR5cGUiLCJjb2xvckFnZ3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLGdEQUFvQjtBQUMvQkMsV0FBUyxTQURzQjtBQUUvQkMsaUJBQWUsZUFGZ0I7QUFHL0JDLGNBQVksWUFIbUI7QUFJL0JDLGVBQWEsb0JBSmtCO0FBSy9CLGtCQUFnQixjQUxlO0FBTS9CQyxvQkFBa0IsYUFOYTtBQU8vQkMsbUJBQWlCO0FBUGMsQ0FBMUI7O0lBVWNDLFk7OztBQUNuQix3QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtEQUNqQiw2QkFBTUEsS0FBTixDQURpQjs7QUFHakIsVUFBS0MsaUJBQUwsQ0FBdUJULGlCQUF2QjtBQUhpQjtBQUlsQjs7eUJBcUJEVSxXLDhCQUFpRztBQUFBOztBQUFBLFFBQXBGQyxJQUFvRixRQUFwRkEsSUFBb0Y7QUFBQSxRQUE5RUMsR0FBOEUsUUFBOUVBLEdBQThFO0FBQUEsUUFBekVDLGdCQUF5RSxRQUF6RUEsZ0JBQXlFO0FBQUEsUUFBdkRDLGFBQXVELFFBQXZEQSxhQUF1RDtBQUFBLFFBQXhDQyxRQUF3QyxRQUF4Q0EsUUFBd0M7QUFBQSxRQUE5QkMsV0FBOEIsUUFBOUJBLFdBQThCO0FBQUEsUUFBakJDLGNBQWlCLFFBQWpCQSxjQUFpQjtBQUFBLFFBQ3hGQyxTQUR3RixHQUMzRSxLQUFLQyxNQURzRSxDQUN4RkQsU0FEd0Y7OztBQUcvRixZQUNFLHNEQUNLUCxJQURMLEVBRUtFLGdCQUZMO0FBR0VPLFVBQUksS0FBS0EsRUFIWDtBQUlFUixjQUpGO0FBS0VTLG1CQUFhLENBTGY7QUFNRWpCLG1CQUFhYyxVQUFVZCxXQU56QjtBQU9FRixxQkFBZWdCLFVBQVVoQixhQVAzQjtBQVFFQyxrQkFBWSxLQUFLbUIsYUFBTCxDQUFtQkosVUFBVWYsVUFBN0IsQ0FSZDtBQVNFb0Isa0JBQVksS0FBS0osTUFBTCxDQUFZSSxVQVQxQjtBQVVFQyxnQkFBVSxJQVZaO0FBV0V2QixlQUFTaUIsVUFBVWpCLE9BWHJCO0FBWUV3QixZQUFNUCxVQUFVLGNBQVYsQ0FaUjtBQWFFUSxxQkFBZSxLQUFLQyxJQUFMLENBQVVELGFBYjNCOztBQWVFO0FBQ0FFLHdCQUFrQlgsZUFBZVk7QUFoQm5DLE9BREYsU0FvQkssS0FBS0MsY0FBTCxDQUFvQmhCLGFBQXBCLElBQ0QsQ0FBQywyQkFBcUI7QUFDcEJNLFVBQU8sS0FBS0EsRUFBWixhQURvQjtBQUVwQlQsWUFBTSxDQUFDRyxjQUFjaUIsTUFBZixDQUZjO0FBR3BCQyxnQkFBVTtBQUFBLGVBQUssT0FBS2IsTUFBTCxDQUFZYyxjQUFqQjtBQUFBO0FBSFUsS0FBckIsQ0FBRCxDQURDLEdBS0ssRUF6QlY7QUEyQkQsRzs7Ozt3QkFqRFU7QUFDVCxhQUFPLFNBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQixhQUFPO0FBQ0xDLGVBQU87QUFDTEMsb0JBQVUsT0FETDtBQUVMQyxpQkFBTyxZQUZGO0FBR0xDLGlCQUFPLFlBSEY7QUFJTEMsa0JBQVEsYUFKSDtBQUtMQyxpQkFBTyxZQUxGO0FBTUxDLGVBQUssT0FOQTtBQU9MQywwQkFBZ0IsYUFQWDtBQVFMQyw0QkFBa0IsZ0NBQWVDO0FBUjVCO0FBREYsT0FBUDtBQVlEOzs7OztrQkF4QmtCcEMsWSIsImZpbGUiOiJjbHVzdGVyLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCBBZ2dyZWdhdGlvbkxheWVyIGZyb20gJy4uL2FnZ3JlZ2F0aW9uLWxheWVyJztcbmltcG9ydCBEZWNrR0xDbHVzdGVyTGF5ZXIgZnJvbSAnZGVja2dsLWxheWVycy9jbHVzdGVyLWxheWVyL2NsdXN0ZXItbGF5ZXInO1xuaW1wb3J0IHtDSEFOTkVMX1NDQUxFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgY2x1c3RlclZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgY2x1c3RlclJhZGl1czogJ2NsdXN0ZXJSYWRpdXMnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAnY2x1c3RlclJhZGl1c1JhbmdlJyxcbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nLFxuICBjb2xvckFnZ3JlZ2F0aW9uOiAnYWdncmVnYXRpb24nLFxuICBzaXplQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJMYXllciBleHRlbmRzIEFnZ3JlZ2F0aW9uTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoY2x1c3RlclZpc0NvbmZpZ3MpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdjbHVzdGVyJztcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ1BvaW50IENvdW50JyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe2RhdGEsIGlkeCwgbGF5ZXJJbnRlcmFjdGlvbiwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGUsIGludGVyYWN0aW9uLCBsYXllckNhbGxiYWNrc30pIHtcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBEZWNrR0xDbHVzdGVyTGF5ZXIoe1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgaWR4LFxuICAgICAgICByYWRpdXNTY2FsZTogMSxcbiAgICAgICAgcmFkaXVzUmFuZ2U6IHZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgY2x1c3RlclJhZGl1czogdmlzQ29uZmlnLmNsdXN0ZXJSYWRpdXMsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuZ2V0Q29sb3JSYW5nZSh2aXNDb25maWcuY29sb3JSYW5nZSksXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICBvcGFjaXR5OiB2aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgZnA2NDogdmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgbGlnaHRTZXR0aW5nczogdGhpcy5tZXRhLmxpZ2h0U2V0dGluZ3MsXG5cbiAgICAgICAgLy8gY2FsbCBiYWNrIGZyb20gbGF5ZXIgYWZ0ZXIgY2FsY3VsYXRlIGNsdXN0ZXJzXG4gICAgICAgIG9uU2V0Q29sb3JEb21haW46IGxheWVyQ2FsbGJhY2tzLm9uU2V0TGF5ZXJEb21haW5cbiAgICAgIH0pLFxuXG4gICAgICAuLi50aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpID9cbiAgICAgICAgW25ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICAgICAgZGF0YTogW29iamVjdEhvdmVyZWQub2JqZWN0XSxcbiAgICAgICAgICBnZXRDb2xvcjogZCA9PiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvclxuICAgICAgICB9KV0gOiBbXVxuICAgIF07XG4gIH1cbn1cbiJdfQ==