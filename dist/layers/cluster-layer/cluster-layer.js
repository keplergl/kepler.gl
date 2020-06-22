"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.clusterVisConfigs = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _aggregationLayer = _interopRequireDefault(require("../aggregation-layer"));

var _layers = require("@deck.gl/layers");

var _clusterLayer = _interopRequireDefault(require("../../deckgl-layers/cluster-layer/cluster-layer"));

var _defaultSettings = require("../../constants/default-settings");

var _clusterLayerIcon = _interopRequireDefault(require("./cluster-layer-icon"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var clusterVisConfigs = {
  opacity: 'opacity',
  clusterRadius: 'clusterRadius',
  colorRange: 'colorRange',
  radiusRange: 'clusterRadiusRange',
  colorAggregation: 'aggregation'
};
exports.clusterVisConfigs = clusterVisConfigs;

var ClusterLayer =
/*#__PURE__*/
function (_AggregationLayer) {
  (0, _inherits2["default"])(ClusterLayer, _AggregationLayer);

  function ClusterLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ClusterLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClusterLayer).call(this, props));

    _this.registerVisConfig(clusterVisConfigs);

    return _this;
  }

  (0, _createClass2["default"])(ClusterLayer, [{
    key: "renderLayer",
    value: function renderLayer(opts) {
      var visConfig = this.config.visConfig;
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState,
          layerCallbacks = opts.layerCallbacks;
      var updateTriggers = {
        getColorValue: {
          colorField: this.config.colorField,
          colorAggregation: this.config.visConfig.colorAggregation
        },
        filterData: _objectSpread({
          filterRange: gpuFilter.filterRange
        }, gpuFilter.filterValueUpdateTriggers)
      };
      var filterData = data._filterData,
          clusterData = (0, _objectWithoutProperties2["default"])(data, ["_filterData"]);
      return [new _clusterLayer["default"](_objectSpread({}, this.getDefaultDeckLayerProps(opts), {}, clusterData, {
        filterData: filterData,
        // radius
        radiusScale: 1,
        radiusRange: visConfig.radiusRange,
        clusterRadius: visConfig.clusterRadius,
        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScaleType: this.config.colorScale,
        colorAggregation: visConfig.colorAggregation,
        zoom: Math.round(mapState.zoom),
        width: mapState.width,
        height: mapState.height,
        // updateTriggers
        updateTriggers: updateTriggers,
        // call back from layer after calculate clusters
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) ? [new _layers.ScatterplotLayer({
        id: "".concat(this.id, "-hovered"),
        data: [objectHovered.object],
        getFillColor: this.config.highlightColor,
        getRadius: function getRadius(d) {
          return d.radius;
        },
        radiusScale: 1,
        pickable: false
      })] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'cluster';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _clusterLayerIcon["default"];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        color: {
          aggregation: 'colorAggregation',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.colorAggr,
          defaultMeasure: 'property.pointCount',
          domain: 'colorDomain',
          field: 'colorField',
          key: 'color',
          property: 'color',
          range: 'colorRange',
          scale: 'colorScale'
        }
      };
    }
  }]);
  return ClusterLayer;
}(_aggregationLayer["default"]);

exports["default"] = ClusterLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLmpzIl0sIm5hbWVzIjpbImNsdXN0ZXJWaXNDb25maWdzIiwib3BhY2l0eSIsImNsdXN0ZXJSYWRpdXMiLCJjb2xvclJhbmdlIiwicmFkaXVzUmFuZ2UiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiQ2x1c3RlckxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsIm9wdHMiLCJ2aXNDb25maWciLCJjb25maWciLCJkYXRhIiwiZ3B1RmlsdGVyIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwibGF5ZXJDYWxsYmFja3MiLCJ1cGRhdGVUcmlnZ2VycyIsImdldENvbG9yVmFsdWUiLCJjb2xvckZpZWxkIiwiZmlsdGVyRGF0YSIsImZpbHRlclJhbmdlIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsIl9maWx0ZXJEYXRhIiwiY2x1c3RlckRhdGEiLCJEZWNrR0xDbHVzdGVyTGF5ZXIiLCJnZXREZWZhdWx0RGVja0xheWVyUHJvcHMiLCJyYWRpdXNTY2FsZSIsImdldENvbG9yUmFuZ2UiLCJjb2xvclNjYWxlVHlwZSIsImNvbG9yU2NhbGUiLCJ6b29tIiwiTWF0aCIsInJvdW5kIiwid2lkdGgiLCJoZWlnaHQiLCJvblNldENvbG9yRG9tYWluIiwib25TZXRMYXllckRvbWFpbiIsImlzTGF5ZXJIb3ZlcmVkIiwiU2NhdHRlcnBsb3RMYXllciIsImlkIiwib2JqZWN0IiwiZ2V0RmlsbENvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJnZXRSYWRpdXMiLCJkIiwicmFkaXVzIiwicGlja2FibGUiLCJDbHVzdGVyTGF5ZXJJY29uIiwiY29sb3IiLCJhZ2dyZWdhdGlvbiIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsImNvbG9yQWdnciIsImRlZmF1bHRNZWFzdXJlIiwiZG9tYWluIiwiZmllbGQiLCJrZXkiLCJwcm9wZXJ0eSIsInJhbmdlIiwic2NhbGUi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QUFBQSxTQUFTLEVBQUUsbUJBQUFDLENBQUM7QUFBQSxpQkFBSUEsQ0FBQyxDQUFDQyxNQUFOO0FBQUEsU0FKTztBQUtuQm5CLFFBQUFBLFdBQVcsRUFBRSxDQUxNO0FBTW5Cb0IsUUFBQUEsUUFBUSxFQUFFO0FBTlMsT0FBckIsQ0FERixDQURBLEdBV0EsRUF0Q047QUF3Q0Q7Ozt3QkFoRlU7QUFDVCxhQUFPLFNBQVA7QUFDRDs7O3dCQUVlO0FBQ2QsYUFBT0MsNEJBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQixhQUFPO0FBQ0xDLFFBQUFBLEtBQUssRUFBRTtBQUNMQyxVQUFBQSxXQUFXLEVBQUUsa0JBRFI7QUFFTEMsVUFBQUEsZ0JBQWdCLEVBQUVDLGdDQUFlQyxTQUY1QjtBQUdMQyxVQUFBQSxjQUFjLEVBQUUscUJBSFg7QUFJTEMsVUFBQUEsTUFBTSxFQUFFLGFBSkg7QUFLTEMsVUFBQUEsS0FBSyxFQUFFLFlBTEY7QUFNTEMsVUFBQUEsR0FBRyxFQUFFLE9BTkE7QUFPTEMsVUFBQUEsUUFBUSxFQUFFLE9BUEw7QUFRTEMsVUFBQUEsS0FBSyxFQUFFLFlBUkY7QUFTTEMsVUFBQUEsS0FBSyxFQUFFO0FBVEY7QUFERixPQUFQO0FBYUQ7OztFQTVCdUNDLDRCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IEFnZ3JlZ2F0aW9uTGF5ZXIgZnJvbSAnLi4vYWdncmVnYXRpb24tbGF5ZXInO1xuaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuXG5pbXBvcnQgRGVja0dMQ2x1c3RlckxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyJztcbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBDbHVzdGVyTGF5ZXJJY29uIGZyb20gJy4vY2x1c3Rlci1sYXllci1pY29uJztcblxuZXhwb3J0IGNvbnN0IGNsdXN0ZXJWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNsdXN0ZXJSYWRpdXM6ICdjbHVzdGVyUmFkaXVzJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICByYWRpdXNSYW5nZTogJ2NsdXN0ZXJSYWRpdXNSYW5nZScsXG4gIGNvbG9yQWdncmVnYXRpb246ICdhZ2dyZWdhdGlvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJMYXllciBleHRlbmRzIEFnZ3JlZ2F0aW9uTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGNsdXN0ZXJWaXNDb25maWdzKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnY2x1c3Rlcic7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBDbHVzdGVyTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBhZ2dyZWdhdGlvbjogJ2NvbG9yQWdncmVnYXRpb24nLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAncHJvcGVydHkucG9pbnRDb3VudCcsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCB7ZGF0YSwgZ3B1RmlsdGVyLCBvYmplY3RIb3ZlcmVkLCBtYXBTdGF0ZSwgbGF5ZXJDYWxsYmFja3N9ID0gb3B0cztcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0Q29sb3JWYWx1ZToge1xuICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvckFnZ3JlZ2F0aW9uOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvblxuICAgICAgfSxcbiAgICAgIGZpbHRlckRhdGE6IHtcbiAgICAgICAgZmlsdGVyUmFuZ2U6IGdwdUZpbHRlci5maWx0ZXJSYW5nZSxcbiAgICAgICAgLi4uZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHtfZmlsdGVyRGF0YTogZmlsdGVyRGF0YSwgLi4uY2x1c3RlckRhdGF9ID0gZGF0YTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMQ2x1c3RlckxheWVyKHtcbiAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyksXG4gICAgICAgIC4uLmNsdXN0ZXJEYXRhLFxuICAgICAgICBmaWx0ZXJEYXRhLFxuXG4gICAgICAgIC8vIHJhZGl1c1xuICAgICAgICByYWRpdXNTY2FsZTogMSxcbiAgICAgICAgcmFkaXVzUmFuZ2U6IHZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgY2x1c3RlclJhZGl1czogdmlzQ29uZmlnLmNsdXN0ZXJSYWRpdXMsXG5cbiAgICAgICAgLy8gY29sb3JcbiAgICAgICAgY29sb3JSYW5nZTogdGhpcy5nZXRDb2xvclJhbmdlKHZpc0NvbmZpZy5jb2xvclJhbmdlKSxcbiAgICAgICAgY29sb3JTY2FsZVR5cGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIGNvbG9yQWdncmVnYXRpb246IHZpc0NvbmZpZy5jb2xvckFnZ3JlZ2F0aW9uLFxuXG4gICAgICAgIHpvb206IE1hdGgucm91bmQobWFwU3RhdGUuem9vbSksXG4gICAgICAgIHdpZHRoOiBtYXBTdGF0ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBtYXBTdGF0ZS5oZWlnaHQsXG5cbiAgICAgICAgLy8gdXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG5cbiAgICAgICAgLy8gY2FsbCBiYWNrIGZyb20gbGF5ZXIgYWZ0ZXIgY2FsY3VsYXRlIGNsdXN0ZXJzXG4gICAgICAgIG9uU2V0Q29sb3JEb21haW46IGxheWVyQ2FsbGJhY2tzLm9uU2V0TGF5ZXJEb21haW5cbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICAgICAgICAgIGRhdGE6IFtvYmplY3RIb3ZlcmVkLm9iamVjdF0sXG4gICAgICAgICAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldFJhZGl1czogZCA9PiBkLnJhZGl1cyxcbiAgICAgICAgICAgICAgcmFkaXVzU2NhbGU6IDEsXG4gICAgICAgICAgICAgIHBpY2thYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19