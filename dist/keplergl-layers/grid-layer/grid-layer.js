'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.gridVisConfigs = undefined;

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

var _enhancedGridLayer = require('../../deckgl-layers/grid-layer/enhanced-grid-layer');

var _enhancedGridLayer2 = _interopRequireDefault(_enhancedGridLayer);

var _gridUtils = require('./grid-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gridVisConfigs = exports.gridVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'percentile',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation',
  enable3d: 'enable3d'
};

var GridLayer = function (_AggregationLayer) {
  (0, _inherits3.default)(GridLayer, _AggregationLayer);

  function GridLayer(props) {
    (0, _classCallCheck3.default)(this, GridLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _AggregationLayer.call(this, props));

    _this.registerVisConfig(gridVisConfigs);
    return _this;
  }

  GridLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var formattedData = _AggregationLayer.prototype.formatLayerData.call(this, _, allData, filteredIndex, oldLayerData, opt);

    var getPosition = formattedData.getPosition,
        data = formattedData.data;

    // TODO: fix this in deck.gl layer

    var cleaned = data.filter(function (d) {
      var pos = getPosition(d);
      return pos.every(Number.isFinite);
    });

    // All data processing is done in deck.gl layer
    return (0, _extends3.default)({}, formattedData, {
      data: cleaned
    });
  };

  GridLayer.prototype.renderLayer = function renderLayer(_ref) {
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

    var cellSize = visConfig.worldUnitSize * 1000;

    return [new _enhancedGridLayer2.default((0, _extends3.default)({}, data, layerInteraction, {
      id: this.id,
      idx: idx,
      cellSize: cellSize,
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
      lightSettings: this.meta && this.meta.lightSettings,

      // callbacks
      onSetColorDomain: layerCallbacks.onSetLayerDomain
    }))].concat(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _deck.GeoJsonLayer({
      id: this.id + '-hovered',
      data: [(0, _gridUtils.pointToPolygonGeo)({
        object: objectHovered.object,
        cellSize: cellSize,
        coverage: visConfig.coverage,
        properties: { lineColor: this.config.highlightColor },
        mapState: mapState
      })],
      lineWidthScale: 8 * zoomFactor
    })] : []);
  };

  (0, _createClass3.default)(GridLayer, [{
    key: 'type',
    get: function get() {
      return 'grid';
    }
  }]);
  return GridLayer;
}(_aggregationLayer2.default);

exports.default = GridLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLmpzIl0sIm5hbWVzIjpbImdyaWRWaXNDb25maWdzIiwib3BhY2l0eSIsIndvcmxkVW5pdFNpemUiLCJjb2xvclJhbmdlIiwiY292ZXJhZ2UiLCJzaXplUmFuZ2UiLCJwZXJjZW50aWxlIiwiZWxldmF0aW9uUGVyY2VudGlsZSIsImVsZXZhdGlvblNjYWxlIiwiY29sb3JBZ2dyZWdhdGlvbiIsInNpemVBZ2dyZWdhdGlvbiIsImVuYWJsZTNkIiwiR3JpZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImZvcm1hdExheWVyRGF0YSIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImZvcm1hdHRlZERhdGEiLCJnZXRQb3NpdGlvbiIsImRhdGEiLCJjbGVhbmVkIiwiZmlsdGVyIiwicG9zIiwiZCIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJyZW5kZXJMYXllciIsImlkeCIsImxheWVySW50ZXJhY3Rpb24iLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbiIsImxheWVyQ2FsbGJhY2tzIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJ6b29tIiwiZWxlWm9vbUZhY3RvciIsImdldEVsZXZhdGlvblpvb21GYWN0b3IiLCJ2aXNDb25maWciLCJjb25maWciLCJjZWxsU2l6ZSIsImlkIiwiZ2V0Q29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJ1cHBlclBlcmNlbnRpbGUiLCJsb3dlclBlcmNlbnRpbGUiLCJleHRydWRlZCIsImVsZXZhdGlvbkxvd2VyUGVyY2VudGlsZSIsImVsZXZhdGlvblVwcGVyUGVyY2VudGlsZSIsImZwNjQiLCJwaWNrYWJsZSIsImxpZ2h0U2V0dGluZ3MiLCJtZXRhIiwib25TZXRDb2xvckRvbWFpbiIsIm9uU2V0TGF5ZXJEb21haW4iLCJpc0xheWVySG92ZXJlZCIsIm9iamVjdCIsInByb3BlcnRpZXMiLCJsaW5lQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsImxpbmVXaWR0aFNjYWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFNQSwwQ0FBaUI7QUFDNUJDLFdBQVMsU0FEbUI7QUFFNUJDLGlCQUFlLGVBRmE7QUFHNUJDLGNBQVksWUFIZ0I7QUFJNUJDLFlBQVUsVUFKa0I7QUFLNUJDLGFBQVcsZ0JBTGlCO0FBTTVCQyxjQUFZLFlBTmdCO0FBTzVCQyx1QkFBcUIsWUFQTztBQVE1QkMsa0JBQWdCLGdCQVJZO0FBUzVCLGtCQUFnQixjQVRZO0FBVTVCQyxvQkFBa0IsYUFWVTtBQVc1QkMsbUJBQWlCLGFBWFc7QUFZNUJDLFlBQVU7QUFaa0IsQ0FBdkI7O0lBZWNDLFM7OztBQUNuQixxQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtEQUNqQiw2QkFBTUEsS0FBTixDQURpQjs7QUFHakIsVUFBS0MsaUJBQUwsQ0FBdUJkLGNBQXZCO0FBSGlCO0FBSWxCOztzQkFNRGUsZSw0QkFBZ0JDLEMsRUFBR0MsTyxFQUFTQyxhLEVBQWVDLFksRUFBd0I7QUFBQSxRQUFWQyxHQUFVLHVFQUFKLEVBQUk7O0FBQ2pFLFFBQU1DLGdCQUFnQiw0QkFBTU4sZUFBTixZQUFzQkMsQ0FBdEIsRUFBeUJDLE9BQXpCLEVBQWtDQyxhQUFsQyxFQUFpREMsWUFBakQsRUFBK0RDLEdBQS9ELENBQXRCOztBQURpRSxRQUcxREUsV0FIMEQsR0FHckNELGFBSHFDLENBRzFEQyxXQUgwRDtBQUFBLFFBRzdDQyxJQUg2QyxHQUdyQ0YsYUFIcUMsQ0FHN0NFLElBSDZDOztBQUtqRTs7QUFDQSxRQUFNQyxVQUFVRCxLQUFLRSxNQUFMLENBQVksYUFBSztBQUMvQixVQUFNQyxNQUFNSixZQUFZSyxDQUFaLENBQVo7QUFDQSxhQUFPRCxJQUFJRSxLQUFKLENBQVVDLE9BQU9DLFFBQWpCLENBQVA7QUFDRCxLQUhlLENBQWhCOztBQUtBO0FBQ0Esc0NBQ0tULGFBREw7QUFFRUUsWUFBTUM7QUFGUjtBQUlELEc7O3NCQUVETyxXLDhCQUFpRztBQUFBLFFBQXBGUixJQUFvRixRQUFwRkEsSUFBb0Y7QUFBQSxRQUE5RVMsR0FBOEUsUUFBOUVBLEdBQThFO0FBQUEsUUFBekVDLGdCQUF5RSxRQUF6RUEsZ0JBQXlFO0FBQUEsUUFBdkRDLGFBQXVELFFBQXZEQSxhQUF1RDtBQUFBLFFBQXhDQyxRQUF3QyxRQUF4Q0EsUUFBd0M7QUFBQSxRQUE5QkMsV0FBOEIsUUFBOUJBLFdBQThCO0FBQUEsUUFBakJDLGNBQWlCLFFBQWpCQSxjQUFpQjs7QUFDL0YsUUFBTUMsYUFBYSxLQUFLQyxhQUFMLENBQW1CSixTQUFTSyxJQUE1QixDQUFuQjtBQUNBLFFBQU1DLGdCQUFnQixLQUFLQyxzQkFBTCxDQUE0QlAsU0FBU0ssSUFBckMsQ0FBdEI7QUFGK0YsUUFHeEZHLFNBSHdGLEdBRzNFLEtBQUtDLE1BSHNFLENBR3hGRCxTQUh3Rjs7QUFJL0YsUUFBTUUsV0FBV0YsVUFBVXpDLGFBQVYsR0FBMEIsSUFBM0M7O0FBRUEsWUFDRSwyREFDS3FCLElBREwsRUFFS1UsZ0JBRkw7QUFHRWEsVUFBSSxLQUFLQSxFQUhYO0FBSUVkLGNBSkY7QUFLRWEsd0JBTEY7QUFNRXpDLGdCQUFVdUMsVUFBVXZDLFFBTnRCOztBQVFFO0FBQ0FELGtCQUFZLEtBQUs0QyxhQUFMLENBQW1CSixVQUFVeEMsVUFBN0IsQ0FUZDtBQVVFNkMsa0JBQVksS0FBS0osTUFBTCxDQUFZSSxVQVYxQjtBQVdFL0MsZUFBUzBDLFVBQVUxQyxPQVhyQjtBQVlFZ0QsdUJBQWlCTixVQUFVckMsVUFBVixDQUFxQixDQUFyQixDQVpuQjtBQWFFNEMsdUJBQWlCUCxVQUFVckMsVUFBVixDQUFxQixDQUFyQixDQWJuQjs7QUFlRTtBQUNBNkMsZ0JBQVVSLFVBQVVoQyxRQWhCdEI7QUFpQkVILHNCQUFnQm1DLFVBQVVuQyxjQUFWLEdBQTJCaUMsYUFqQjdDO0FBa0JFVyxnQ0FBMEJULFVBQVVwQyxtQkFBVixDQUE4QixDQUE5QixDQWxCNUI7QUFtQkU4QyxnQ0FBMEJWLFVBQVVwQyxtQkFBVixDQUE4QixDQUE5QixDQW5CNUI7O0FBcUJFO0FBQ0ErQyxZQUFNWCxVQUFVLGNBQVYsQ0F0QlI7QUF1QkVZLGdCQUFVLElBdkJaO0FBd0JFQyxxQkFBZSxLQUFLQyxJQUFMLElBQWEsS0FBS0EsSUFBTCxDQUFVRCxhQXhCeEM7O0FBMEJFO0FBQ0FFLHdCQUFrQnJCLGVBQWVzQjtBQTNCbkMsT0FERixTQStCSyxLQUFLQyxjQUFMLENBQW9CMUIsYUFBcEIsS0FBc0MsQ0FBQ1MsVUFBVWhDLFFBQWpELEdBQ0QsQ0FBQyx1QkFBaUI7QUFDaEJtQyxVQUFPLEtBQUtBLEVBQVosYUFEZ0I7QUFFaEJ2QixZQUFNLENBQ0osa0NBQWtCO0FBQ2hCc0MsZ0JBQVEzQixjQUFjMkIsTUFETjtBQUVoQmhCLDBCQUZnQjtBQUdoQnpDLGtCQUFVdUMsVUFBVXZDLFFBSEo7QUFJaEIwRCxvQkFBWSxFQUFDQyxXQUFXLEtBQUtuQixNQUFMLENBQVlvQixjQUF4QixFQUpJO0FBS2hCN0I7QUFMZ0IsT0FBbEIsQ0FESSxDQUZVO0FBV2hCOEIsc0JBQWdCLElBQUkzQjtBQVhKLEtBQWpCLENBQUQsQ0FEQyxHQWFLLEVBNUNWO0FBOENELEc7Ozs7d0JBMUVVO0FBQ1QsYUFBTyxNQUFQO0FBQ0Q7Ozs7O2tCQVRrQjFCLFMiLCJmaWxlIjoiZ3JpZC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7R2VvSnNvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcblxuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IEVuaGFuY2VkR3JpZExheWVyIGZyb20gJy4uLy4uL2RlY2tnbC1sYXllcnMvZ3JpZC1sYXllci9lbmhhbmNlZC1ncmlkLWxheWVyJztcbmltcG9ydCB7cG9pbnRUb1BvbHlnb25HZW99IGZyb20gJy4vZ3JpZC11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBncmlkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB3b3JsZFVuaXRTaXplOiAnd29ybGRVbml0U2l6ZScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgY292ZXJhZ2U6ICdjb3ZlcmFnZScsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgcGVyY2VudGlsZTogJ3BlcmNlbnRpbGUnLFxuICBlbGV2YXRpb25QZXJjZW50aWxlOiAncGVyY2VudGlsZScsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbicsXG4gIGNvbG9yQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbicsXG4gIHNpemVBZ2dyZWdhdGlvbjogJ2FnZ3JlZ2F0aW9uJyxcbiAgZW5hYmxlM2Q6ICdlbmFibGUzZCdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRMYXllciBleHRlbmRzIEFnZ3JlZ2F0aW9uTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoZ3JpZFZpc0NvbmZpZ3MpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdncmlkJztcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3QgZm9ybWF0dGVkRGF0YSA9IHN1cGVyLmZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCk7XG5cbiAgICBjb25zdCB7Z2V0UG9zaXRpb24sIGRhdGF9ID0gZm9ybWF0dGVkRGF0YTtcblxuICAgIC8vIFRPRE86IGZpeCB0aGlzIGluIGRlY2suZ2wgbGF5ZXJcbiAgICBjb25zdCBjbGVhbmVkID0gZGF0YS5maWx0ZXIoZCA9PiB7XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbihkKTtcbiAgICAgIHJldHVybiBwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKTtcbiAgICB9KTtcblxuICAgIC8vIEFsbCBkYXRhIHByb2Nlc3NpbmcgaXMgZG9uZSBpbiBkZWNrLmdsIGxheWVyXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZvcm1hdHRlZERhdGEsXG4gICAgICBkYXRhOiBjbGVhbmVkXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtkYXRhLCBpZHgsIGxheWVySW50ZXJhY3Rpb24sIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbiwgbGF5ZXJDYWxsYmFja3N9KSB7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcbiAgICBjb25zdCBlbGVab29tRmFjdG9yID0gdGhpcy5nZXRFbGV2YXRpb25ab29tRmFjdG9yKG1hcFN0YXRlLnpvb20pO1xuICAgIGNvbnN0IHt2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3QgY2VsbFNpemUgPSB2aXNDb25maWcud29ybGRVbml0U2l6ZSAqIDEwMDA7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IEVuaGFuY2VkR3JpZExheWVyKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgY2VsbFNpemUsXG4gICAgICAgIGNvdmVyYWdlOiB2aXNDb25maWcuY292ZXJhZ2UsXG5cbiAgICAgICAgLy8gY29sb3JcbiAgICAgICAgY29sb3JSYW5nZTogdGhpcy5nZXRDb2xvclJhbmdlKHZpc0NvbmZpZy5jb2xvclJhbmdlKSxcbiAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZSxcbiAgICAgICAgb3BhY2l0eTogdmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHVwcGVyUGVyY2VudGlsZTogdmlzQ29uZmlnLnBlcmNlbnRpbGVbMV0sXG4gICAgICAgIGxvd2VyUGVyY2VudGlsZTogdmlzQ29uZmlnLnBlcmNlbnRpbGVbMF0sXG5cbiAgICAgICAgLy8gZWxldmF0aW9uXG4gICAgICAgIGV4dHJ1ZGVkOiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIGVsZXZhdGlvblNjYWxlOiB2aXNDb25maWcuZWxldmF0aW9uU2NhbGUgKiBlbGVab29tRmFjdG9yLFxuICAgICAgICBlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25QZXJjZW50aWxlWzBdLFxuICAgICAgICBlbGV2YXRpb25VcHBlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25QZXJjZW50aWxlWzFdLFxuXG4gICAgICAgIC8vIHJlbmRlclxuICAgICAgICBmcDY0OiB2aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgbGlnaHRTZXR0aW5nczogdGhpcy5tZXRhICYmIHRoaXMubWV0YS5saWdodFNldHRpbmdzLFxuXG4gICAgICAgIC8vIGNhbGxiYWNrc1xuICAgICAgICBvblNldENvbG9yRG9tYWluOiBsYXllckNhbGxiYWNrcy5vblNldExheWVyRG9tYWluXG4gICAgICB9KSxcblxuICAgICAgLi4udGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKSAmJiAhdmlzQ29uZmlnLmVuYWJsZTNkID9cbiAgICAgICAgW25ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICBwb2ludFRvUG9seWdvbkdlbyh7XG4gICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0SG92ZXJlZC5vYmplY3QsXG4gICAgICAgICAgICAgIGNlbGxTaXplLFxuICAgICAgICAgICAgICBjb3ZlcmFnZTogdmlzQ29uZmlnLmNvdmVyYWdlLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7bGluZUNvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcn0sXG4gICAgICAgICAgICAgIG1hcFN0YXRlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgbGluZVdpZHRoU2NhbGU6IDggKiB6b29tRmFjdG9yXG4gICAgICAgIH0pXSA6IFtdXG4gICAgXTtcbiAgfVxufVxuIl19