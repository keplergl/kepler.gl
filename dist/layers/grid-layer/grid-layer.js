"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.gridVisConfigs = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _enhancedCpuGridLayer = _interopRequireDefault(require("../../deckgl-layers/grid-layer/enhanced-cpu-grid-layer"));

var _aggregationLayer = _interopRequireDefault(require("../aggregation-layer"));

var _gridUtils = require("./grid-utils");

var _gridLayerIcon = _interopRequireDefault(require("./grid-layer-icon"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var gridVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'elevationPercentile',
  elevationScale: 'elevationScale',
  colorAggregation: 'aggregation',
  sizeAggregation: 'sizeAggregation',
  enable3d: 'enable3d'
};
exports.gridVisConfigs = gridVisConfigs;

var GridLayer =
/*#__PURE__*/
function (_AggregationLayer) {
  (0, _inherits2["default"])(GridLayer, _AggregationLayer);

  function GridLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, GridLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GridLayer).call(this, props));

    _this.registerVisConfig(gridVisConfigs);

    _this.visConfigSettings.worldUnitSize.label = 'columns.grid.worldUnitSize';
    return _this;
  }

  (0, _createClass2["default"])(GridLayer, [{
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState;
      var zoomFactor = this.getZoomFactor(mapState);
      var visConfig = this.config.visConfig;
      var cellSize = visConfig.worldUnitSize * 1000;
      return [new _enhancedCpuGridLayer["default"](_objectSpread({}, this.getDefaultAggregationLayerProp(opts), {}, data, {
        wrapLongitude: false,
        cellSize: cellSize
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _layers.GeoJsonLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {
        wrapLongitude: false,
        data: [(0, _gridUtils.pointToPolygonGeo)({
          object: objectHovered.object,
          cellSize: cellSize,
          coverage: visConfig.coverage,
          mapState: mapState
        })],
        getLineColor: this.config.highlightColor,
        lineWidthScale: 8 * zoomFactor
      }))] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'grid';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _gridLayerIcon["default"];
    }
  }]);
  return GridLayer;
}(_aggregationLayer["default"]);

exports["default"] = GridLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLmpzIl0sIm5hbWVzIjpbImdyaWRWaXNDb25maWdzIiwib3BhY2l0eSIsIndvcmxkVW5pdFNpemUiLCJjb2xvclJhbmdlIiwiY292ZXJhZ2UiLCJzaXplUmFuZ2UiLCJwZXJjZW50aWxlIiwiZWxldmF0aW9uUGVyY2VudGlsZSIsImVsZXZhdGlvblNjYWxlIiwiY29sb3JBZ2dyZWdhdGlvbiIsInNpemVBZ2dyZWdhdGlvbiIsImVuYWJsZTNkIiwiR3JpZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsInZpc0NvbmZpZ1NldHRpbmdzIiwibGFiZWwiLCJvcHRzIiwiZGF0YSIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsInpvb21GYWN0b3IiLCJnZXRab29tRmFjdG9yIiwidmlzQ29uZmlnIiwiY29uZmlnIiwiY2VsbFNpemUiLCJFbmhhbmNlZEdyaWRMYXllciIsImdldERlZmF1bHRBZ2dyZWdhdGlvbkxheWVyUHJvcCIsIndyYXBMb25naXR1ZGUiLCJpc0xheWVySG92ZXJlZCIsIkdlb0pzb25MYXllciIsImdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMiLCJvYmplY3QiLCJnZXRMaW5lQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsImxpbmVXaWR0aFNjYWxlIiwiR3JpZExheWVySWNvbiIsIkFnZ3JlZ2F0aW9uTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxjQUFjLEdBQUc7QUFDNUJDLEVBQUFBLE9BQU8sRUFBRSxTQURtQjtBQUU1QkMsRUFBQUEsYUFBYSxFQUFFLGVBRmE7QUFHNUJDLEVBQUFBLFVBQVUsRUFBRSxZQUhnQjtBQUk1QkMsRUFBQUEsUUFBUSxFQUFFLFVBSmtCO0FBSzVCQyxFQUFBQSxTQUFTLEVBQUUsZ0JBTGlCO0FBTTVCQyxFQUFBQSxVQUFVLEVBQUUsWUFOZ0I7QUFPNUJDLEVBQUFBLG1CQUFtQixFQUFFLHFCQVBPO0FBUTVCQyxFQUFBQSxjQUFjLEVBQUUsZ0JBUlk7QUFTNUJDLEVBQUFBLGdCQUFnQixFQUFFLGFBVFU7QUFVNUJDLEVBQUFBLGVBQWUsRUFBRSxpQkFWVztBQVc1QkMsRUFBQUEsUUFBUSxFQUFFO0FBWGtCLENBQXZCOzs7SUFjY0MsUzs7Ozs7QUFDbkIscUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTtBQUNqQixxSEFBTUEsS0FBTjs7QUFFQSxVQUFLQyxpQkFBTCxDQUF1QmQsY0FBdkI7O0FBQ0EsVUFBS2UsaUJBQUwsQ0FBdUJiLGFBQXZCLENBQXFDYyxLQUFyQyxHQUE2Qyw0QkFBN0M7QUFKaUI7QUFLbEI7Ozs7Z0NBVVdDLEksRUFBTTtBQUFBLFVBQ1RDLElBRFMsR0FDd0JELElBRHhCLENBQ1RDLElBRFM7QUFBQSxVQUNIQyxhQURHLEdBQ3dCRixJQUR4QixDQUNIRSxhQURHO0FBQUEsVUFDWUMsUUFEWixHQUN3QkgsSUFEeEIsQ0FDWUcsUUFEWjtBQUdoQixVQUFNQyxVQUFVLEdBQUcsS0FBS0MsYUFBTCxDQUFtQkYsUUFBbkIsQ0FBbkI7QUFIZ0IsVUFJVEcsU0FKUyxHQUlJLEtBQUtDLE1BSlQsQ0FJVEQsU0FKUztBQUtoQixVQUFNRSxRQUFRLEdBQUdGLFNBQVMsQ0FBQ3JCLGFBQVYsR0FBMEIsSUFBM0M7QUFFQSxjQUNFLElBQUl3QixnQ0FBSixtQkFDSyxLQUFLQyw4QkFBTCxDQUFvQ1YsSUFBcEMsQ0FETCxNQUVLQyxJQUZMO0FBR0VVLFFBQUFBLGFBQWEsRUFBRSxLQUhqQjtBQUlFSCxRQUFBQSxRQUFRLEVBQVJBO0FBSkYsU0FERiw2Q0FTTSxLQUFLSSxjQUFMLENBQW9CVixhQUFwQixLQUFzQyxDQUFDSSxTQUFTLENBQUNaLFFBQWpELEdBQ0EsQ0FDRSxJQUFJbUIsb0JBQUosbUJBQ0ssS0FBS0MseUJBQUwsRUFETDtBQUVFSCxRQUFBQSxhQUFhLEVBQUUsS0FGakI7QUFHRVYsUUFBQUEsSUFBSSxFQUFFLENBQ0osa0NBQWtCO0FBQ2hCYyxVQUFBQSxNQUFNLEVBQUViLGFBQWEsQ0FBQ2EsTUFETjtBQUVoQlAsVUFBQUEsUUFBUSxFQUFSQSxRQUZnQjtBQUdoQnJCLFVBQUFBLFFBQVEsRUFBRW1CLFNBQVMsQ0FBQ25CLFFBSEo7QUFJaEJnQixVQUFBQSxRQUFRLEVBQVJBO0FBSmdCLFNBQWxCLENBREksQ0FIUjtBQVdFYSxRQUFBQSxZQUFZLEVBQUUsS0FBS1QsTUFBTCxDQUFZVSxjQVg1QjtBQVlFQyxRQUFBQSxjQUFjLEVBQUUsSUFBSWQ7QUFadEIsU0FERixDQURBLEdBaUJBLEVBMUJOO0FBNEJEOzs7d0JBM0NVO0FBQ1QsYUFBTyxNQUFQO0FBQ0Q7Ozt3QkFFZTtBQUNkLGFBQU9lLHlCQUFQO0FBQ0Q7OztFQWRvQ0MsNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0dlb0pzb25MYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcbmltcG9ydCBFbmhhbmNlZEdyaWRMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtY3B1LWdyaWQtbGF5ZXInO1xuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IHtwb2ludFRvUG9seWdvbkdlb30gZnJvbSAnLi9ncmlkLXV0aWxzJztcbmltcG9ydCBHcmlkTGF5ZXJJY29uIGZyb20gJy4vZ3JpZC1sYXllci1pY29uJztcblxuZXhwb3J0IGNvbnN0IGdyaWRWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHdvcmxkVW5pdFNpemU6ICd3b3JsZFVuaXRTaXplJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBjb3ZlcmFnZTogJ2NvdmVyYWdlJyxcbiAgc2l6ZVJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuICBwZXJjZW50aWxlOiAncGVyY2VudGlsZScsXG4gIGVsZXZhdGlvblBlcmNlbnRpbGU6ICdlbGV2YXRpb25QZXJjZW50aWxlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG4gIGNvbG9yQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbicsXG4gIHNpemVBZ2dyZWdhdGlvbjogJ3NpemVBZ2dyZWdhdGlvbicsXG4gIGVuYWJsZTNkOiAnZW5hYmxlM2QnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkTGF5ZXIgZXh0ZW5kcyBBZ2dyZWdhdGlvbkxheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGdyaWRWaXNDb25maWdzKTtcbiAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzLndvcmxkVW5pdFNpemUubGFiZWwgPSAnY29sdW1ucy5ncmlkLndvcmxkVW5pdFNpemUnO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdncmlkJztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIEdyaWRMYXllckljb247XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlfSA9IG9wdHM7XG5cbiAgICBjb25zdCB6b29tRmFjdG9yID0gdGhpcy5nZXRab29tRmFjdG9yKG1hcFN0YXRlKTtcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGNlbGxTaXplID0gdmlzQ29uZmlnLndvcmxkVW5pdFNpemUgKiAxMDAwO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBFbmhhbmNlZEdyaWRMYXllcih7XG4gICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJQcm9wKG9wdHMpLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZSxcbiAgICAgICAgY2VsbFNpemVcbiAgICAgIH0pLFxuXG4gICAgICAvLyByZW5kZXIgYW4gb3V0bGluZSBvZiBlYWNoIGNlbGwgaWYgbm90IGV4dHJ1ZGVkXG4gICAgICAuLi4odGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKSAmJiAhdmlzQ29uZmlnLmVuYWJsZTNkXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IEdlb0pzb25MYXllcih7XG4gICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcygpLFxuICAgICAgICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgICAgIHBvaW50VG9Qb2x5Z29uR2VvKHtcbiAgICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0SG92ZXJlZC5vYmplY3QsXG4gICAgICAgICAgICAgICAgICBjZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgIGNvdmVyYWdlOiB2aXNDb25maWcuY292ZXJhZ2UsXG4gICAgICAgICAgICAgICAgICBtYXBTdGF0ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIGdldExpbmVDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGxpbmVXaWR0aFNjYWxlOiA4ICogem9vbUZhY3RvclxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19