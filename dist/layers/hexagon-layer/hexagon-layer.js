"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.hexagonVisConfigs = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _aggregationLayer = _interopRequireDefault(require("../aggregation-layer"));

var _enhancedHexagonLayer = _interopRequireDefault(require("../../deckgl-layers/hexagon-layer/enhanced-hexagon-layer"));

var _hexagonUtils = require("./hexagon-utils");

var _hexagonLayerIcon = _interopRequireDefault(require("./hexagon-layer-icon"));

var _dataUtils = require("../../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var hexagonVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  resolution: 'resolution',
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
exports.hexagonVisConfigs = hexagonVisConfigs;

var HexagonLayer =
/*#__PURE__*/
function (_AggregationLayer) {
  (0, _inherits2["default"])(HexagonLayer, _AggregationLayer);

  function HexagonLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, HexagonLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(HexagonLayer).call(this, props));

    _this.registerVisConfig(hexagonVisConfigs);

    _this.visConfigSettings.worldUnitSize.label = 'columns.hexagon.worldUnitSize';
    return _this;
  }

  (0, _createClass2["default"])(HexagonLayer, [{
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState;
      var zoomFactor = this.getZoomFactor(mapState);
      var visConfig = this.config.visConfig;
      var radius = visConfig.worldUnitSize * 1000;
      return [new _enhancedHexagonLayer["default"](_objectSpread({}, this.getDefaultAggregationLayerProp(opts), {}, data, {
        wrapLongitude: false,
        radius: radius
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) && !visConfig.enable3d ? [new _layers.GeoJsonLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {
        wrapLongitude: false,
        data: [(0, _hexagonUtils.hexagonToPolygonGeo)(objectHovered, {}, radius * visConfig.coverage, mapState)].filter(function (d) {
          return d;
        }),
        getLineColor: this.config.highlightColor,
        lineWidthScale: (0, _dataUtils.clamp)([1, 100], radius * 0.1 * zoomFactor)
      }))] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'hexagon';
    }
  }, {
    key: "name",
    get: function get() {
      return 'Hexbin';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _hexagonLayerIcon["default"];
    }
  }]);
  return HexagonLayer;
}(_aggregationLayer["default"]);

exports["default"] = HexagonLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGV4YWdvbi1sYXllci9oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImhleGFnb25WaXNDb25maWdzIiwib3BhY2l0eSIsIndvcmxkVW5pdFNpemUiLCJyZXNvbHV0aW9uIiwiY29sb3JSYW5nZSIsImNvdmVyYWdlIiwic2l6ZVJhbmdlIiwicGVyY2VudGlsZSIsImVsZXZhdGlvblBlcmNlbnRpbGUiLCJlbGV2YXRpb25TY2FsZSIsImNvbG9yQWdncmVnYXRpb24iLCJzaXplQWdncmVnYXRpb24iLCJlbmFibGUzZCIsIkhleGFnb25MYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJ2aXNDb25maWdTZXR0aW5ncyIsImxhYmVsIiwib3B0cyIsImRhdGEiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsInZpc0NvbmZpZyIsImNvbmZpZyIsInJhZGl1cyIsIkVuaGFuY2VkSGV4YWdvbkxheWVyIiwiZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJQcm9wIiwid3JhcExvbmdpdHVkZSIsImlzTGF5ZXJIb3ZlcmVkIiwiR2VvSnNvbkxheWVyIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsImZpbHRlciIsImQiLCJnZXRMaW5lQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsImxpbmVXaWR0aFNjYWxlIiwiSGV4YWdvbkxheWVySWNvbiIsIkFnZ3JlZ2F0aW9uTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsT0FBTyxFQUFFLFNBRHNCO0FBRS9CQyxFQUFBQSxhQUFhLEVBQUUsZUFGZ0I7QUFHL0JDLEVBQUFBLFVBQVUsRUFBRSxZQUhtQjtBQUkvQkMsRUFBQUEsVUFBVSxFQUFFLFlBSm1CO0FBSy9CQyxFQUFBQSxRQUFRLEVBQUUsVUFMcUI7QUFNL0JDLEVBQUFBLFNBQVMsRUFBRSxnQkFOb0I7QUFPL0JDLEVBQUFBLFVBQVUsRUFBRSxZQVBtQjtBQVEvQkMsRUFBQUEsbUJBQW1CLEVBQUUscUJBUlU7QUFTL0JDLEVBQUFBLGNBQWMsRUFBRSxnQkFUZTtBQVUvQkMsRUFBQUEsZ0JBQWdCLEVBQUUsYUFWYTtBQVcvQkMsRUFBQUEsZUFBZSxFQUFFLGlCQVhjO0FBWS9CQyxFQUFBQSxRQUFRLEVBQUU7QUFacUIsQ0FBMUI7OztJQWVjQyxZOzs7OztBQUNuQix3QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLHdIQUFNQSxLQUFOOztBQUVBLFVBQUtDLGlCQUFMLENBQXVCZixpQkFBdkI7O0FBQ0EsVUFBS2dCLGlCQUFMLENBQXVCZCxhQUF2QixDQUFxQ2UsS0FBckMsR0FBNkMsK0JBQTdDO0FBSmlCO0FBS2xCOzs7O2dDQWNXQyxJLEVBQU07QUFBQSxVQUNUQyxJQURTLEdBQ3dCRCxJQUR4QixDQUNUQyxJQURTO0FBQUEsVUFDSEMsYUFERyxHQUN3QkYsSUFEeEIsQ0FDSEUsYUFERztBQUFBLFVBQ1lDLFFBRFosR0FDd0JILElBRHhCLENBQ1lHLFFBRFo7QUFFaEIsVUFBTUMsVUFBVSxHQUFHLEtBQUtDLGFBQUwsQ0FBbUJGLFFBQW5CLENBQW5CO0FBRmdCLFVBR1RHLFNBSFMsR0FHSSxLQUFLQyxNQUhULENBR1RELFNBSFM7QUFJaEIsVUFBTUUsTUFBTSxHQUFHRixTQUFTLENBQUN0QixhQUFWLEdBQTBCLElBQXpDO0FBRUEsY0FDRSxJQUFJeUIsZ0NBQUosbUJBQ0ssS0FBS0MsOEJBQUwsQ0FBb0NWLElBQXBDLENBREwsTUFFS0MsSUFGTDtBQUdFVSxRQUFBQSxhQUFhLEVBQUUsS0FIakI7QUFJRUgsUUFBQUEsTUFBTSxFQUFOQTtBQUpGLFNBREYsNkNBU00sS0FBS0ksY0FBTCxDQUFvQlYsYUFBcEIsS0FBc0MsQ0FBQ0ksU0FBUyxDQUFDWixRQUFqRCxHQUNBLENBQ0UsSUFBSW1CLG9CQUFKLG1CQUNLLEtBQUtDLHlCQUFMLEVBREw7QUFFRUgsUUFBQUEsYUFBYSxFQUFFLEtBRmpCO0FBR0VWLFFBQUFBLElBQUksRUFBRSxDQUNKLHVDQUFvQkMsYUFBcEIsRUFBbUMsRUFBbkMsRUFBdUNNLE1BQU0sR0FBR0YsU0FBUyxDQUFDbkIsUUFBMUQsRUFBb0VnQixRQUFwRSxDQURJLEVBRUpZLE1BRkksQ0FFRyxVQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUo7QUFBQSxTQUZKLENBSFI7QUFNRUMsUUFBQUEsWUFBWSxFQUFFLEtBQUtWLE1BQUwsQ0FBWVcsY0FONUI7QUFPRUMsUUFBQUEsY0FBYyxFQUFFLHNCQUFNLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUFnQlgsTUFBTSxHQUFHLEdBQVQsR0FBZUosVUFBL0I7QUFQbEIsU0FERixDQURBLEdBWUEsRUFyQk47QUF1QkQ7Ozt3QkF6Q1U7QUFDVCxhQUFPLFNBQVA7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxRQUFQO0FBQ0Q7Ozt3QkFFZTtBQUNkLGFBQU9nQiw0QkFBUDtBQUNEOzs7RUFsQnVDQyw0QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7R2VvSnNvbkxheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IEVuaGFuY2VkSGV4YWdvbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvaGV4YWdvbi1sYXllci9lbmhhbmNlZC1oZXhhZ29uLWxheWVyJztcbmltcG9ydCB7aGV4YWdvblRvUG9seWdvbkdlb30gZnJvbSAnLi9oZXhhZ29uLXV0aWxzJztcbmltcG9ydCBIZXhhZ29uTGF5ZXJJY29uIGZyb20gJy4vaGV4YWdvbi1sYXllci1pY29uJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgaGV4YWdvblZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgd29ybGRVbml0U2l6ZTogJ3dvcmxkVW5pdFNpemUnLFxuICByZXNvbHV0aW9uOiAncmVzb2x1dGlvbicsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgY292ZXJhZ2U6ICdjb3ZlcmFnZScsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgcGVyY2VudGlsZTogJ3BlcmNlbnRpbGUnLFxuICBlbGV2YXRpb25QZXJjZW50aWxlOiAnZWxldmF0aW9uUGVyY2VudGlsZScsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICBjb2xvckFnZ3JlZ2F0aW9uOiAnYWdncmVnYXRpb24nLFxuICBzaXplQWdncmVnYXRpb246ICdzaXplQWdncmVnYXRpb24nLFxuICBlbmFibGUzZDogJ2VuYWJsZTNkJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGV4YWdvbkxheWVyIGV4dGVuZHMgQWdncmVnYXRpb25MYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhoZXhhZ29uVmlzQ29uZmlncyk7XG4gICAgdGhpcy52aXNDb25maWdTZXR0aW5ncy53b3JsZFVuaXRTaXplLmxhYmVsID0gJ2NvbHVtbnMuaGV4YWdvbi53b3JsZFVuaXRTaXplJztcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaGV4YWdvbic7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gJ0hleGJpbic7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBIZXhhZ29uTGF5ZXJJY29uO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBvYmplY3RIb3ZlcmVkLCBtYXBTdGF0ZX0gPSBvcHRzO1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IHt2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3QgcmFkaXVzID0gdmlzQ29uZmlnLndvcmxkVW5pdFNpemUgKiAxMDAwO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBFbmhhbmNlZEhleGFnb25MYXllcih7XG4gICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJQcm9wKG9wdHMpLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZSxcbiAgICAgICAgcmFkaXVzXG4gICAgICB9KSxcblxuICAgICAgLy8gcmVuZGVyIGFuIG91dGxpbmUgb2YgZWFjaCBoZXhhZ29uIGlmIG5vdCBleHRydWRlZFxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZCkgJiYgIXZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgd3JhcExvbmdpdHVkZTogZmFsc2UsXG4gICAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgICBoZXhhZ29uVG9Qb2x5Z29uR2VvKG9iamVjdEhvdmVyZWQsIHt9LCByYWRpdXMgKiB2aXNDb25maWcuY292ZXJhZ2UsIG1hcFN0YXRlKVxuICAgICAgICAgICAgICBdLmZpbHRlcihkID0+IGQpLFxuICAgICAgICAgICAgICBnZXRMaW5lQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICBsaW5lV2lkdGhTY2FsZTogY2xhbXAoWzEsIDEwMF0sIHJhZGl1cyAqIDAuMSAqIHpvb21GYWN0b3IpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=