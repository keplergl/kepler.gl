'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.gridVisConfigs = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (GridLayer.__proto__ || Object.getPrototypeOf(GridLayer)).call(this, props));

    _this.registerVisConfig(gridVisConfigs);
    return _this;
  }

  (0, _createClass3.default)(GridLayer, [{
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
      var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var formattedData = (0, _get3.default)(GridLayer.prototype.__proto__ || Object.getPrototypeOf(GridLayer.prototype), 'formatLayerData', this).call(this, _, allData, filteredIndex, oldLayerData, opt);

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
    }
  }, {
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
      }))].concat((0, _toConsumableArray3.default)(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _deck.GeoJsonLayer({
        id: this.id + '-hovered',
        data: [(0, _gridUtils.pointToPolygonGeo)({
          object: objectHovered.object,
          cellSize: cellSize,
          coverage: visConfig.coverage,
          properties: { lineColor: this.config.highlightColor },
          mapState: mapState
        })],
        lineWidthScale: 8 * zoomFactor
      })] : []));
    }
  }, {
    key: 'type',
    get: function get() {
      return 'grid';
    }
  }]);
  return GridLayer;
}(_aggregationLayer2.default);

exports.default = GridLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLmpzIl0sIm5hbWVzIjpbImdyaWRWaXNDb25maWdzIiwib3BhY2l0eSIsIndvcmxkVW5pdFNpemUiLCJjb2xvclJhbmdlIiwiY292ZXJhZ2UiLCJzaXplUmFuZ2UiLCJwZXJjZW50aWxlIiwiZWxldmF0aW9uUGVyY2VudGlsZSIsImVsZXZhdGlvblNjYWxlIiwiY29sb3JBZ2dyZWdhdGlvbiIsInNpemVBZ2dyZWdhdGlvbiIsImVuYWJsZTNkIiwiR3JpZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImZvcm1hdHRlZERhdGEiLCJnZXRQb3NpdGlvbiIsImRhdGEiLCJjbGVhbmVkIiwiZmlsdGVyIiwicG9zIiwiZCIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb24iLCJsYXllckNhbGxiYWNrcyIsInpvb21GYWN0b3IiLCJnZXRab29tRmFjdG9yIiwiem9vbSIsImVsZVpvb21GYWN0b3IiLCJnZXRFbGV2YXRpb25ab29tRmFjdG9yIiwidmlzQ29uZmlnIiwiY29uZmlnIiwiY2VsbFNpemUiLCJpZCIsImdldENvbG9yUmFuZ2UiLCJjb2xvclNjYWxlIiwidXBwZXJQZXJjZW50aWxlIiwibG93ZXJQZXJjZW50aWxlIiwiZXh0cnVkZWQiLCJlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUiLCJlbGV2YXRpb25VcHBlclBlcmNlbnRpbGUiLCJmcDY0IiwicGlja2FibGUiLCJsaWdodFNldHRpbmdzIiwibWV0YSIsIm9uU2V0Q29sb3JEb21haW4iLCJvblNldExheWVyRG9tYWluIiwiaXNMYXllckhvdmVyZWQiLCJvYmplY3QiLCJwcm9wZXJ0aWVzIiwibGluZUNvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJsaW5lV2lkdGhTY2FsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFNQSwwQ0FBaUI7QUFDNUJDLFdBQVMsU0FEbUI7QUFFNUJDLGlCQUFlLGVBRmE7QUFHNUJDLGNBQVksWUFIZ0I7QUFJNUJDLFlBQVUsVUFKa0I7QUFLNUJDLGFBQVcsZ0JBTGlCO0FBTTVCQyxjQUFZLFlBTmdCO0FBTzVCQyx1QkFBcUIsWUFQTztBQVE1QkMsa0JBQWdCLGdCQVJZO0FBUzVCLGtCQUFnQixjQVRZO0FBVTVCQyxvQkFBa0IsYUFWVTtBQVc1QkMsbUJBQWlCLGFBWFc7QUFZNUJDLFlBQVU7QUFaa0IsQ0FBdkI7O0lBZWNDLFM7OztBQUNuQixxQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLG9JQUNYQSxLQURXOztBQUdqQixVQUFLQyxpQkFBTCxDQUF1QmQsY0FBdkI7QUFIaUI7QUFJbEI7Ozs7b0NBTWVlLEMsRUFBR0MsTyxFQUFTQyxhLEVBQWVDLFksRUFBd0I7QUFBQSxVQUFWQyxHQUFVLHVFQUFKLEVBQUk7O0FBQ2pFLFVBQU1DLG9KQUNKTCxDQURJLEVBRUpDLE9BRkksRUFHSkMsYUFISSxFQUlKQyxZQUpJLEVBS0pDLEdBTEksQ0FBTjs7QUFEaUUsVUFTMURFLFdBVDBELEdBU3JDRCxhQVRxQyxDQVMxREMsV0FUMEQ7QUFBQSxVQVM3Q0MsSUFUNkMsR0FTckNGLGFBVHFDLENBUzdDRSxJQVQ2Qzs7QUFXakU7O0FBQ0EsVUFBTUMsVUFBVUQsS0FBS0UsTUFBTCxDQUFZLGFBQUs7QUFDL0IsWUFBTUMsTUFBTUosWUFBWUssQ0FBWixDQUFaO0FBQ0EsZUFBT0QsSUFBSUUsS0FBSixDQUFVQyxPQUFPQyxRQUFqQixDQUFQO0FBQ0QsT0FIZSxDQUFoQjs7QUFLQTtBQUNBLHdDQUNLVCxhQURMO0FBRUVFLGNBQU1DO0FBRlI7QUFJRDs7O3NDQVVFO0FBQUEsVUFQREQsSUFPQyxRQVBEQSxJQU9DO0FBQUEsVUFORFEsR0FNQyxRQU5EQSxHQU1DO0FBQUEsVUFMREMsZ0JBS0MsUUFMREEsZ0JBS0M7QUFBQSxVQUpEQyxhQUlDLFFBSkRBLGFBSUM7QUFBQSxVQUhEQyxRQUdDLFFBSERBLFFBR0M7QUFBQSxVQUZEQyxXQUVDLFFBRkRBLFdBRUM7QUFBQSxVQUREQyxjQUNDLFFBRERBLGNBQ0M7O0FBQ0QsVUFBTUMsYUFBYSxLQUFLQyxhQUFMLENBQW1CSixTQUFTSyxJQUE1QixDQUFuQjtBQUNBLFVBQU1DLGdCQUFnQixLQUFLQyxzQkFBTCxDQUE0QlAsU0FBU0ssSUFBckMsQ0FBdEI7QUFGQyxVQUdNRyxTQUhOLEdBR21CLEtBQUtDLE1BSHhCLENBR01ELFNBSE47O0FBSUQsVUFBTUUsV0FBV0YsVUFBVXZDLGFBQVYsR0FBMEIsSUFBM0M7O0FBRUEsY0FDRSwyREFDS29CLElBREwsRUFFS1MsZ0JBRkw7QUFHRWEsWUFBSSxLQUFLQSxFQUhYO0FBSUVkLGdCQUpGO0FBS0VhLDBCQUxGO0FBTUV2QyxrQkFBVXFDLFVBQVVyQyxRQU50Qjs7QUFRRTtBQUNBRCxvQkFBWSxLQUFLMEMsYUFBTCxDQUFtQkosVUFBVXRDLFVBQTdCLENBVGQ7QUFVRTJDLG9CQUFZLEtBQUtKLE1BQUwsQ0FBWUksVUFWMUI7QUFXRTdDLGlCQUFTd0MsVUFBVXhDLE9BWHJCO0FBWUU4Qyx5QkFBaUJOLFVBQVVuQyxVQUFWLENBQXFCLENBQXJCLENBWm5CO0FBYUUwQyx5QkFBaUJQLFVBQVVuQyxVQUFWLENBQXFCLENBQXJCLENBYm5COztBQWVFO0FBQ0EyQyxrQkFBVVIsVUFBVTlCLFFBaEJ0QjtBQWlCRUgsd0JBQWdCaUMsVUFBVWpDLGNBQVYsR0FBMkIrQixhQWpCN0M7QUFrQkVXLGtDQUEwQlQsVUFBVWxDLG1CQUFWLENBQThCLENBQTlCLENBbEI1QjtBQW1CRTRDLGtDQUEwQlYsVUFBVWxDLG1CQUFWLENBQThCLENBQTlCLENBbkI1Qjs7QUFxQkU7QUFDQTZDLGNBQU1YLFVBQVUsY0FBVixDQXRCUjtBQXVCRVksa0JBQVUsSUF2Qlo7QUF3QkVDLHVCQUFlLEtBQUtDLElBQUwsSUFBYSxLQUFLQSxJQUFMLENBQVVELGFBeEJ4Qzs7QUEwQkU7QUFDQUUsMEJBQWtCckIsZUFBZXNCO0FBM0JuQyxTQURGLDBDQStCTSxLQUFLQyxjQUFMLENBQW9CMUIsYUFBcEIsS0FBc0MsQ0FBQ1MsVUFBVTlCLFFBQWpELEdBQ0EsQ0FDRSx1QkFBaUI7QUFDZmlDLFlBQU8sS0FBS0EsRUFBWixhQURlO0FBRWZ0QixjQUFNLENBQ0osa0NBQWtCO0FBQ2hCcUMsa0JBQVEzQixjQUFjMkIsTUFETjtBQUVoQmhCLDRCQUZnQjtBQUdoQnZDLG9CQUFVcUMsVUFBVXJDLFFBSEo7QUFJaEJ3RCxzQkFBWSxFQUFDQyxXQUFXLEtBQUtuQixNQUFMLENBQVlvQixjQUF4QixFQUpJO0FBS2hCN0I7QUFMZ0IsU0FBbEIsQ0FESSxDQUZTO0FBV2Y4Qix3QkFBZ0IsSUFBSTNCO0FBWEwsT0FBakIsQ0FERixDQURBLEdBZ0JBLEVBL0NOO0FBaUREOzs7d0JBM0ZVO0FBQ1QsYUFBTyxNQUFQO0FBQ0Q7Ozs7O2tCQVRrQnhCLFMiLCJmaWxlIjoiZ3JpZC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7R2VvSnNvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcblxuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IEVuaGFuY2VkR3JpZExheWVyIGZyb20gJy4uLy4uL2RlY2tnbC1sYXllcnMvZ3JpZC1sYXllci9lbmhhbmNlZC1ncmlkLWxheWVyJztcbmltcG9ydCB7cG9pbnRUb1BvbHlnb25HZW99IGZyb20gJy4vZ3JpZC11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBncmlkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB3b3JsZFVuaXRTaXplOiAnd29ybGRVbml0U2l6ZScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgY292ZXJhZ2U6ICdjb3ZlcmFnZScsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgcGVyY2VudGlsZTogJ3BlcmNlbnRpbGUnLFxuICBlbGV2YXRpb25QZXJjZW50aWxlOiAncGVyY2VudGlsZScsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbicsXG4gIGNvbG9yQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbicsXG4gIHNpemVBZ2dyZWdhdGlvbjogJ2FnZ3JlZ2F0aW9uJyxcbiAgZW5hYmxlM2Q6ICdlbmFibGUzZCdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRMYXllciBleHRlbmRzIEFnZ3JlZ2F0aW9uTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoZ3JpZFZpc0NvbmZpZ3MpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdncmlkJztcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3QgZm9ybWF0dGVkRGF0YSA9IHN1cGVyLmZvcm1hdExheWVyRGF0YShcbiAgICAgIF8sXG4gICAgICBhbGxEYXRhLFxuICAgICAgZmlsdGVyZWRJbmRleCxcbiAgICAgIG9sZExheWVyRGF0YSxcbiAgICAgIG9wdFxuICAgICk7XG5cbiAgICBjb25zdCB7Z2V0UG9zaXRpb24sIGRhdGF9ID0gZm9ybWF0dGVkRGF0YTtcblxuICAgIC8vIFRPRE86IGZpeCB0aGlzIGluIGRlY2suZ2wgbGF5ZXJcbiAgICBjb25zdCBjbGVhbmVkID0gZGF0YS5maWx0ZXIoZCA9PiB7XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbihkKTtcbiAgICAgIHJldHVybiBwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKTtcbiAgICB9KTtcblxuICAgIC8vIEFsbCBkYXRhIHByb2Nlc3NpbmcgaXMgZG9uZSBpbiBkZWNrLmdsIGxheWVyXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZvcm1hdHRlZERhdGEsXG4gICAgICBkYXRhOiBjbGVhbmVkXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb24sXG4gICAgbGF5ZXJDYWxsYmFja3NcbiAgfSkge1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUuem9vbSk7XG4gICAgY29uc3QgZWxlWm9vbUZhY3RvciA9IHRoaXMuZ2V0RWxldmF0aW9uWm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGNlbGxTaXplID0gdmlzQ29uZmlnLndvcmxkVW5pdFNpemUgKiAxMDAwO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBFbmhhbmNlZEdyaWRMYXllcih7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIC4uLmxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBpZHgsXG4gICAgICAgIGNlbGxTaXplLFxuICAgICAgICBjb3ZlcmFnZTogdmlzQ29uZmlnLmNvdmVyYWdlLFxuXG4gICAgICAgIC8vIGNvbG9yXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuZ2V0Q29sb3JSYW5nZSh2aXNDb25maWcuY29sb3JSYW5nZSksXG4gICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIG9wYWNpdHk6IHZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICB1cHBlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5wZXJjZW50aWxlWzFdLFxuICAgICAgICBsb3dlclBlcmNlbnRpbGU6IHZpc0NvbmZpZy5wZXJjZW50aWxlWzBdLFxuXG4gICAgICAgIC8vIGVsZXZhdGlvblxuICAgICAgICBleHRydWRlZDogdmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcbiAgICAgICAgZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVswXSxcbiAgICAgICAgZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlOiB2aXNDb25maWcuZWxldmF0aW9uUGVyY2VudGlsZVsxXSxcblxuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgZnA2NDogdmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIGxpZ2h0U2V0dGluZ3M6IHRoaXMubWV0YSAmJiB0aGlzLm1ldGEubGlnaHRTZXR0aW5ncyxcblxuICAgICAgICAvLyBjYWxsYmFja3NcbiAgICAgICAgb25TZXRDb2xvckRvbWFpbjogbGF5ZXJDYWxsYmFja3Mub25TZXRMYXllckRvbWFpblxuICAgICAgfSksXG5cbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpICYmICF2aXNDb25maWcuZW5hYmxlM2RcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgR2VvSnNvbkxheWVyKHtcbiAgICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAgcG9pbnRUb1BvbHlnb25HZW8oe1xuICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3RIb3ZlcmVkLm9iamVjdCxcbiAgICAgICAgICAgICAgICAgIGNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgY292ZXJhZ2U6IHZpc0NvbmZpZy5jb3ZlcmFnZSxcbiAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtsaW5lQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yfSxcbiAgICAgICAgICAgICAgICAgIG1hcFN0YXRlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgbGluZVdpZHRoU2NhbGU6IDggKiB6b29tRmFjdG9yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=