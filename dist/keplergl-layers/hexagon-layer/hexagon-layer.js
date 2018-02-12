'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.hexagonVisConfigs = undefined;

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

var _enhancedHexagonLayer = require('../../deckgl-layers/hexagon-layer/enhanced-hexagon-layer');

var _enhancedHexagonLayer2 = _interopRequireDefault(_enhancedHexagonLayer);

var _hexagonUtils = require('./hexagon-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexagonVisConfigs = exports.hexagonVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  resolution: 'resolution',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'elevationPercentile',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation',
  enable3d: 'enable3d'
};

var HexagonLayer = function (_AggregationLayer) {
  (0, _inherits3.default)(HexagonLayer, _AggregationLayer);

  function HexagonLayer(props) {
    (0, _classCallCheck3.default)(this, HexagonLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HexagonLayer.__proto__ || Object.getPrototypeOf(HexagonLayer)).call(this, props));

    _this.registerVisConfig(hexagonVisConfigs);
    return _this;
  }

  (0, _createClass3.default)(HexagonLayer, [{
    key: 'renderLayer',
    value: function renderLayer(_ref) {
      var data = _ref.data,
          idx = _ref.idx,
          layerInteraction = _ref.layerInteraction,
          objectHovered = _ref.objectHovered,
          mapState = _ref.mapState,
          interaction = _ref.interaction,
          layerCallbacks = _ref.layerCallbacks;

      var zoomFactor = this.getZoomFactor(mapState.zoom);
      var eleZoomFactor = this.getElevationZoomFactor(mapState.zoom);
      var visConfig = this.config.visConfig;

      var radius = visConfig.worldUnitSize * 1000;

      return [new _enhancedHexagonLayer2.default((0, _extends3.default)({}, data, layerInteraction, {
        id: this.id,
        idx: idx,
        radius: radius,
        coverage: visConfig.coverage,

        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScale: this.config.colorScale,
        opacity: visConfig.opacity,
        upperPercentile: visConfig.percentile[1],
        lowerPercentile: visConfig.percentile[0],

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        elevationLowerPercentile: visConfig.elevationPercentile[0],
        elevationUpperPercentile: visConfig.elevationPercentile[1],

        // render
        fp64: visConfig['hi-precision'],
        pickable: true,
        lightSettings: this.meta.lightSettings,

        // callbacks
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }))].concat((0, _toConsumableArray3.default)(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _deck.GeoJsonLayer({
        id: this.id + '-hovered',
        data: [(0, _hexagonUtils.hexagonToPolygonGeo)(objectHovered, { lineColor: this.config.highlightColor }, radius * visConfig.coverage, mapState)],
        lineWidthScale: 8 * zoomFactor
      })] : []));
    }
  }, {
    key: 'type',
    get: function get() {
      return 'hexagon';
    }
  }]);
  return HexagonLayer;
}(_aggregationLayer2.default);

exports.default = HexagonLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaGV4YWdvbi1sYXllci9oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImhleGFnb25WaXNDb25maWdzIiwib3BhY2l0eSIsIndvcmxkVW5pdFNpemUiLCJyZXNvbHV0aW9uIiwiY29sb3JSYW5nZSIsImNvdmVyYWdlIiwic2l6ZVJhbmdlIiwicGVyY2VudGlsZSIsImVsZXZhdGlvblBlcmNlbnRpbGUiLCJlbGV2YXRpb25TY2FsZSIsImNvbG9yQWdncmVnYXRpb24iLCJzaXplQWdncmVnYXRpb24iLCJlbmFibGUzZCIsIkhleGFnb25MYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJkYXRhIiwiaWR4IiwibGF5ZXJJbnRlcmFjdGlvbiIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uIiwibGF5ZXJDYWxsYmFja3MiLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsInpvb20iLCJlbGVab29tRmFjdG9yIiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsInZpc0NvbmZpZyIsImNvbmZpZyIsInJhZGl1cyIsImlkIiwiZ2V0Q29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJ1cHBlclBlcmNlbnRpbGUiLCJsb3dlclBlcmNlbnRpbGUiLCJleHRydWRlZCIsImVsZXZhdGlvbkxvd2VyUGVyY2VudGlsZSIsImVsZXZhdGlvblVwcGVyUGVyY2VudGlsZSIsImZwNjQiLCJwaWNrYWJsZSIsImxpZ2h0U2V0dGluZ3MiLCJtZXRhIiwib25TZXRDb2xvckRvbWFpbiIsIm9uU2V0TGF5ZXJEb21haW4iLCJpc0xheWVySG92ZXJlZCIsImxpbmVDb2xvciIsImhpZ2hsaWdodENvbG9yIiwibGluZVdpZHRoU2NhbGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxnREFBb0I7QUFDL0JDLFdBQVMsU0FEc0I7QUFFL0JDLGlCQUFlLGVBRmdCO0FBRy9CQyxjQUFZLFlBSG1CO0FBSS9CQyxjQUFZLFlBSm1CO0FBSy9CQyxZQUFVLFVBTHFCO0FBTS9CQyxhQUFXLGdCQU5vQjtBQU8vQkMsY0FBWSxZQVBtQjtBQVEvQkMsdUJBQXFCLHFCQVJVO0FBUy9CQyxrQkFBZ0IsZ0JBVGU7QUFVL0Isa0JBQWdCLGNBVmU7QUFXL0JDLG9CQUFrQixhQVhhO0FBWS9CQyxtQkFBaUIsYUFaYztBQWEvQkMsWUFBVTtBQWJxQixDQUExQjs7SUFnQmNDLFk7OztBQUNuQix3QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBJQUNYQSxLQURXOztBQUdqQixVQUFLQyxpQkFBTCxDQUF1QmYsaUJBQXZCO0FBSGlCO0FBSWxCOzs7O3NDQWNFO0FBQUEsVUFQRGdCLElBT0MsUUFQREEsSUFPQztBQUFBLFVBTkRDLEdBTUMsUUFOREEsR0FNQztBQUFBLFVBTERDLGdCQUtDLFFBTERBLGdCQUtDO0FBQUEsVUFKREMsYUFJQyxRQUpEQSxhQUlDO0FBQUEsVUFIREMsUUFHQyxRQUhEQSxRQUdDO0FBQUEsVUFGREMsV0FFQyxRQUZEQSxXQUVDO0FBQUEsVUFEREMsY0FDQyxRQUREQSxjQUNDOztBQUNELFVBQU1DLGFBQWEsS0FBS0MsYUFBTCxDQUFtQkosU0FBU0ssSUFBNUIsQ0FBbkI7QUFDQSxVQUFNQyxnQkFBZ0IsS0FBS0Msc0JBQUwsQ0FBNEJQLFNBQVNLLElBQXJDLENBQXRCO0FBRkMsVUFHTUcsU0FITixHQUdtQixLQUFLQyxNQUh4QixDQUdNRCxTQUhOOztBQUlELFVBQU1FLFNBQVNGLFVBQVUxQixhQUFWLEdBQTBCLElBQXpDOztBQUVBLGNBQ0UsOERBQ0tjLElBREwsRUFFS0UsZ0JBRkw7QUFHRWEsWUFBSSxLQUFLQSxFQUhYO0FBSUVkLGdCQUpGO0FBS0VhLHNCQUxGO0FBTUV6QixrQkFBVXVCLFVBQVV2QixRQU50Qjs7QUFRRTtBQUNBRCxvQkFBWSxLQUFLNEIsYUFBTCxDQUFtQkosVUFBVXhCLFVBQTdCLENBVGQ7QUFVRTZCLG9CQUFZLEtBQUtKLE1BQUwsQ0FBWUksVUFWMUI7QUFXRWhDLGlCQUFTMkIsVUFBVTNCLE9BWHJCO0FBWUVpQyx5QkFBaUJOLFVBQVVyQixVQUFWLENBQXFCLENBQXJCLENBWm5CO0FBYUU0Qix5QkFBaUJQLFVBQVVyQixVQUFWLENBQXFCLENBQXJCLENBYm5COztBQWVFO0FBQ0E2QixrQkFBVVIsVUFBVWhCLFFBaEJ0QjtBQWlCRUgsd0JBQWdCbUIsVUFBVW5CLGNBQVYsR0FBMkJpQixhQWpCN0M7QUFrQkVXLGtDQUEwQlQsVUFBVXBCLG1CQUFWLENBQThCLENBQTlCLENBbEI1QjtBQW1CRThCLGtDQUEwQlYsVUFBVXBCLG1CQUFWLENBQThCLENBQTlCLENBbkI1Qjs7QUFxQkU7QUFDQStCLGNBQU1YLFVBQVUsY0FBVixDQXRCUjtBQXVCRVksa0JBQVUsSUF2Qlo7QUF3QkVDLHVCQUFlLEtBQUtDLElBQUwsQ0FBVUQsYUF4QjNCOztBQTBCRTtBQUNBRSwwQkFBa0JyQixlQUFlc0I7QUEzQm5DLFNBREYsMENBK0JNLEtBQUtDLGNBQUwsQ0FBb0IxQixhQUFwQixLQUFzQyxDQUFDUyxVQUFVaEIsUUFBakQsR0FDQSxDQUNFLHVCQUFpQjtBQUNmbUIsWUFBTyxLQUFLQSxFQUFaLGFBRGU7QUFFZmYsY0FBTSxDQUNKLHVDQUNFRyxhQURGLEVBRUUsRUFBQzJCLFdBQVcsS0FBS2pCLE1BQUwsQ0FBWWtCLGNBQXhCLEVBRkYsRUFHRWpCLFNBQVNGLFVBQVV2QixRQUhyQixFQUlFZSxRQUpGLENBREksQ0FGUztBQVVmNEIsd0JBQWdCLElBQUl6QjtBQVZMLE9BQWpCLENBREYsQ0FEQSxHQWVBLEVBOUNOO0FBZ0REOzs7d0JBbEVVO0FBQ1QsYUFBTyxTQUFQO0FBQ0Q7Ozs7O2tCQVRrQlYsWSIsImZpbGUiOiJoZXhhZ29uLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHZW9Kc29uTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IEVuaGFuY2VkSGV4YWdvbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvaGV4YWdvbi1sYXllci9lbmhhbmNlZC1oZXhhZ29uLWxheWVyJztcbmltcG9ydCB7aGV4YWdvblRvUG9seWdvbkdlb30gZnJvbSAnLi9oZXhhZ29uLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IGhleGFnb25WaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHdvcmxkVW5pdFNpemU6ICd3b3JsZFVuaXRTaXplJyxcbiAgcmVzb2x1dGlvbjogJ3Jlc29sdXRpb24nLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIGNvdmVyYWdlOiAnY292ZXJhZ2UnLFxuICBzaXplUmFuZ2U6ICdlbGV2YXRpb25SYW5nZScsXG4gIHBlcmNlbnRpbGU6ICdwZXJjZW50aWxlJyxcbiAgZWxldmF0aW9uUGVyY2VudGlsZTogJ2VsZXZhdGlvblBlcmNlbnRpbGUnLFxuICBlbGV2YXRpb25TY2FsZTogJ2VsZXZhdGlvblNjYWxlJyxcbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nLFxuICBjb2xvckFnZ3JlZ2F0aW9uOiAnYWdncmVnYXRpb24nLFxuICBzaXplQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbicsXG4gIGVuYWJsZTNkOiAnZW5hYmxlM2QnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZXhhZ29uTGF5ZXIgZXh0ZW5kcyBBZ2dyZWdhdGlvbkxheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGhleGFnb25WaXNDb25maWdzKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaGV4YWdvbic7XG4gIH1cblxuICByZW5kZXJMYXllcih7XG4gICAgZGF0YSxcbiAgICBpZHgsXG4gICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIG1hcFN0YXRlLFxuICAgIGludGVyYWN0aW9uLFxuICAgIGxheWVyQ2FsbGJhY2tzXG4gIH0pIHtcbiAgICBjb25zdCB6b29tRmFjdG9yID0gdGhpcy5nZXRab29tRmFjdG9yKG1hcFN0YXRlLnpvb20pO1xuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUuem9vbSk7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCByYWRpdXMgPSB2aXNDb25maWcud29ybGRVbml0U2l6ZSAqIDEwMDA7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IEVuaGFuY2VkSGV4YWdvbkxheWVyKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgcmFkaXVzLFxuICAgICAgICBjb3ZlcmFnZTogdmlzQ29uZmlnLmNvdmVyYWdlLFxuXG4gICAgICAgIC8vIGNvbG9yXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuZ2V0Q29sb3JSYW5nZSh2aXNDb25maWcuY29sb3JSYW5nZSksXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIG9wYWNpdHk6IHZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICB1cHBlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5wZXJjZW50aWxlWzFdLFxuICAgICAgICBsb3dlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5wZXJjZW50aWxlWzBdLFxuXG4gICAgICAgIC8vIGVsZXZhdGlvblxuICAgICAgICBleHRydWRlZDogdmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcbiAgICAgICAgZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVswXSxcbiAgICAgICAgZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVsxXSxcblxuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgZnA2NDogdmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIGxpZ2h0U2V0dGluZ3M6IHRoaXMubWV0YS5saWdodFNldHRpbmdzLFxuXG4gICAgICAgIC8vIGNhbGxiYWNrc1xuICAgICAgICBvblNldENvbG9yRG9tYWluOiBsYXllckNhbGxiYWNrcy5vblNldExheWVyRG9tYWluXG4gICAgICB9KSxcblxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZCkgJiYgIXZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgICBoZXhhZ29uVG9Qb2x5Z29uR2VvKFxuICAgICAgICAgICAgICAgICAgb2JqZWN0SG92ZXJlZCxcbiAgICAgICAgICAgICAgICAgIHtsaW5lQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yfSxcbiAgICAgICAgICAgICAgICAgIHJhZGl1cyAqIHZpc0NvbmZpZy5jb3ZlcmFnZSxcbiAgICAgICAgICAgICAgICAgIG1hcFN0YXRlXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBsaW5lV2lkdGhTY2FsZTogOCAqIHpvb21GYWN0b3JcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==