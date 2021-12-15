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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _aggregationLayer = _interopRequireDefault(require("../aggregation-layer"));

var _layers = require("@deck.gl/layers");

var _clusterLayer = _interopRequireDefault(require("../../deckgl-layers/cluster-layer/cluster-layer"));

var _defaultSettings = require("../../constants/default-settings");

var _clusterLayerIcon = _interopRequireDefault(require("./cluster-layer-icon"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var clusterVisConfigs = {
  opacity: 'opacity',
  clusterRadius: 'clusterRadius',
  colorRange: 'colorRange',
  radiusRange: 'clusterRadiusRange',
  colorAggregation: 'aggregation'
};
exports.clusterVisConfigs = clusterVisConfigs;

var ClusterLayer = /*#__PURE__*/function (_AggregationLayer) {
  (0, _inherits2["default"])(ClusterLayer, _AggregationLayer);

  var _super = _createSuper(ClusterLayer);

  function ClusterLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ClusterLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(clusterVisConfigs);

    return _this;
  }

  (0, _createClass2["default"])(ClusterLayer, [{
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
  }, {
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
      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [new _clusterLayer["default"](_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultDeckLayerProps(opts)), clusterData), {}, {
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
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject ? [new _layers.ScatterplotLayer({
        id: "".concat(this.id, "-hovered"),
        data: [hoveredObject],
        getFillColor: this.config.highlightColor,
        getRadius: function getRadius(d) {
          return d.radius;
        },
        radiusScale: 1,
        pickable: false
      })] : []));
    }
  }]);
  return ClusterLayer;
}(_aggregationLayer["default"]);

exports["default"] = ClusterLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLmpzIl0sIm5hbWVzIjpbImNsdXN0ZXJWaXNDb25maWdzIiwib3BhY2l0eSIsImNsdXN0ZXJSYWRpdXMiLCJjb2xvclJhbmdlIiwicmFkaXVzUmFuZ2UiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiQ2x1c3RlckxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsIkNsdXN0ZXJMYXllckljb24iLCJjb2xvciIsImFnZ3JlZ2F0aW9uIiwiY2hhbm5lbFNjYWxlVHlwZSIsIkNIQU5ORUxfU0NBTEVTIiwiY29sb3JBZ2dyIiwiZGVmYXVsdE1lYXN1cmUiLCJkb21haW4iLCJmaWVsZCIsImtleSIsInByb3BlcnR5IiwicmFuZ2UiLCJzY2FsZSIsIm9wdHMiLCJ2aXNDb25maWciLCJjb25maWciLCJkYXRhIiwiZ3B1RmlsdGVyIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwibGF5ZXJDYWxsYmFja3MiLCJ1cGRhdGVUcmlnZ2VycyIsImdldENvbG9yVmFsdWUiLCJjb2xvckZpZWxkIiwiZmlsdGVyRGF0YSIsImZpbHRlclJhbmdlIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsIl9maWx0ZXJEYXRhIiwiY2x1c3RlckRhdGEiLCJob3ZlcmVkT2JqZWN0IiwiaGFzSG92ZXJlZE9iamVjdCIsIkRlY2tHTENsdXN0ZXJMYXllciIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsInJhZGl1c1NjYWxlIiwiZ2V0Q29sb3JSYW5nZSIsImNvbG9yU2NhbGVUeXBlIiwiY29sb3JTY2FsZSIsInpvb20iLCJNYXRoIiwicm91bmQiLCJ3aWR0aCIsImhlaWdodCIsIm9uU2V0Q29sb3JEb21haW4iLCJvblNldExheWVyRG9tYWluIiwiU2NhdHRlcnBsb3RMYXllciIsImlkIiwiZ2V0RmlsbENvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJnZXRSYWRpdXMiLCJkIiwicmFkaXVzIiwi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LGdCQWI5QjtBQWVFeUMsUUFBQUEsSUFBSSxFQUFFQyxJQUFJLENBQUNDLEtBQUwsQ0FBV3BCLFFBQVEsQ0FBQ2tCLElBQXBCLENBZlI7QUFnQkVHLFFBQUFBLEtBQUssRUFBRXJCLFFBQVEsQ0FBQ3FCLEtBaEJsQjtBQWlCRUMsUUFBQUEsTUFBTSxFQUFFdEIsUUFBUSxDQUFDc0IsTUFqQm5CO0FBbUJFO0FBQ0FwQixRQUFBQSxjQUFjLEVBQWRBLGNBcEJGO0FBc0JFO0FBQ0FxQixRQUFBQSxnQkFBZ0IsRUFBRXRCLGNBQWMsQ0FBQ3VCO0FBdkJuQyxTQURGLDZDQTJCTWQsYUFBYSxHQUNiLENBQ0UsSUFBSWUsd0JBQUosQ0FBcUI7QUFDbkJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLQSxFQUFWLGFBRGlCO0FBRW5CN0IsUUFBQUEsSUFBSSxFQUFFLENBQUNhLGFBQUQsQ0FGYTtBQUduQmlCLFFBQUFBLFlBQVksRUFBRSxLQUFLL0IsTUFBTCxDQUFZZ0MsY0FIUDtBQUluQkMsUUFBQUEsU0FBUyxFQUFFLG1CQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ0MsTUFBTjtBQUFBLFNBSk87QUFLbkJqQixRQUFBQSxXQUFXLEVBQUUsQ0FMTTtBQU1uQmtCLFFBQUFBLFFBQVEsRUFBRTtBQU5TLE9BQXJCLENBREYsQ0FEYSxHQVdiLEVBdENOO0FBd0NEOzs7RUF2RnVDQyw0QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBBZ2dyZWdhdGlvbkxheWVyIGZyb20gJy4uL2FnZ3JlZ2F0aW9uLWxheWVyJztcbmltcG9ydCB7U2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IERlY2tHTENsdXN0ZXJMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllcic7XG5pbXBvcnQge0NIQU5ORUxfU0NBTEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQgQ2x1c3RlckxheWVySWNvbiBmcm9tICcuL2NsdXN0ZXItbGF5ZXItaWNvbic7XG5cbmV4cG9ydCBjb25zdCBjbHVzdGVyVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjbHVzdGVyUmFkaXVzOiAnY2x1c3RlclJhZGl1cycsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdjbHVzdGVyUmFkaXVzUmFuZ2UnLFxuICBjb2xvckFnZ3JlZ2F0aW9uOiAnYWdncmVnYXRpb24nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbHVzdGVyTGF5ZXIgZXh0ZW5kcyBBZ2dyZWdhdGlvbkxheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhjbHVzdGVyVmlzQ29uZmlncyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2NsdXN0ZXInO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gQ2x1c3RlckxheWVySWNvbjtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgYWdncmVnYXRpb246ICdjb2xvckFnZ3JlZ2F0aW9uJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ3Byb3BlcnR5LnBvaW50Q291bnQnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHt2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGUsIGxheWVyQ2FsbGJhY2tzfSA9IG9wdHM7XG5cbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGdldENvbG9yVmFsdWU6IHtcbiAgICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgY29sb3JBZ2dyZWdhdGlvbjogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yQWdncmVnYXRpb25cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJEYXRhOiB7XG4gICAgICAgIGZpbHRlclJhbmdlOiBncHVGaWx0ZXIuZmlsdGVyUmFuZ2UsXG4gICAgICAgIC4uLmdwdUZpbHRlci5maWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCB7X2ZpbHRlckRhdGE6IGZpbHRlckRhdGEsIC4uLmNsdXN0ZXJEYXRhfSA9IGRhdGE7XG4gICAgY29uc3QgaG92ZXJlZE9iamVjdCA9IHRoaXMuaGFzSG92ZXJlZE9iamVjdChvYmplY3RIb3ZlcmVkKTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMQ2x1c3RlckxheWVyKHtcbiAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyksXG4gICAgICAgIC4uLmNsdXN0ZXJEYXRhLFxuICAgICAgICBmaWx0ZXJEYXRhLFxuXG4gICAgICAgIC8vIHJhZGl1c1xuICAgICAgICByYWRpdXNTY2FsZTogMSxcbiAgICAgICAgcmFkaXVzUmFuZ2U6IHZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgY2x1c3RlclJhZGl1czogdmlzQ29uZmlnLmNsdXN0ZXJSYWRpdXMsXG5cbiAgICAgICAgLy8gY29sb3JcbiAgICAgICAgY29sb3JSYW5nZTogdGhpcy5nZXRDb2xvclJhbmdlKHZpc0NvbmZpZy5jb2xvclJhbmdlKSxcbiAgICAgICAgY29sb3JTY2FsZVR5cGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGUsXG4gICAgICAgIGNvbG9yQWdncmVnYXRpb246IHZpc0NvbmZpZy5jb2xvckFnZ3JlZ2F0aW9uLFxuXG4gICAgICAgIHpvb206IE1hdGgucm91bmQobWFwU3RhdGUuem9vbSksXG4gICAgICAgIHdpZHRoOiBtYXBTdGF0ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBtYXBTdGF0ZS5oZWlnaHQsXG5cbiAgICAgICAgLy8gdXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG5cbiAgICAgICAgLy8gY2FsbCBiYWNrIGZyb20gbGF5ZXIgYWZ0ZXIgY2FsY3VsYXRlIGNsdXN0ZXJzXG4gICAgICAgIG9uU2V0Q29sb3JEb21haW46IGxheWVyQ2FsbGJhY2tzLm9uU2V0TGF5ZXJEb21haW5cbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLihob3ZlcmVkT2JqZWN0XG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICAgICAgICAgIGRhdGE6IFtob3ZlcmVkT2JqZWN0XSxcbiAgICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0UmFkaXVzOiBkID0+IGQucmFkaXVzLFxuICAgICAgICAgICAgICByYWRpdXNTY2FsZTogMSxcbiAgICAgICAgICAgICAgcGlja2FibGU6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=