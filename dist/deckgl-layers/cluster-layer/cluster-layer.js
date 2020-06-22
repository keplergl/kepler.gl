"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.clusterAggregation = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _aggregationLayers = require("@deck.gl/aggregation-layers");

var _geoViewport = _interopRequireDefault(require("@mapbox/geo-viewport"));

var _cpuAggregator = _interopRequireWildcard(require("../layer-utils/cpu-aggregator"));

var _viewportMercatorProject = require("viewport-mercator-project");

var _d3Array = require("d3-array");

var _colorRanges = require("../../constants/color-ranges");

var _layerFactory = require("../../layers/layer-factory");

var _defaultSettings = require("../../constants/default-settings");

var _clusterUtils = _interopRequireWildcard(require("../layer-utils/cluster-utils"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultRadius = _layerFactory.LAYER_VIS_CONFIGS.clusterRadius.defaultValue;
var defaultRadiusRange = _layerFactory.LAYER_VIS_CONFIGS.clusterRadiusRange.defaultValue;

var defaultGetColorValue = function defaultGetColorValue(points) {
  return points.length;
};

var defaultGetRadiusValue = function defaultGetRadiusValue(cell) {
  return cell.filteredPoints ? cell.filteredPoints.length : cell.points.length;
};

function processGeoJSON(step, props, aggregation, _ref) {
  var viewport = _ref.viewport;
  var data = props.data,
      getPosition = props.getPosition,
      filterData = props.filterData;
  var geoJSON = (0, _clusterUtils.getGeoJSON)(data, getPosition, filterData);
  var clusterBuilder = new _clusterUtils["default"]();
  this.setState({
    geoJSON: geoJSON,
    clusterBuilder: clusterBuilder
  });
}

function getClusters(step, props, aggregation, _ref2) {
  var viewport = _ref2.viewport;
  var _this$state = this.state,
      geoJSON = _this$state.geoJSON,
      clusterBuilder = _this$state.clusterBuilder;
  var clusterRadius = props.clusterRadius,
      zoom = props.zoom,
      width = props.width,
      height = props.height;
  var longitude = viewport.longitude,
      latitude = viewport.latitude; // zoom needs to be an integer for the different map utils. Also helps with cache key.

  var bbox = _geoViewport["default"].bounds([longitude, latitude], zoom, [width, height]);

  var clusters = clusterBuilder.clustersAtZoom({
    bbox: bbox,
    clusterRadius: clusterRadius,
    geoJSON: geoJSON,
    zoom: zoom
  });
  this.setState({
    layerData: {
      data: clusters
    }
  });
}

function getSubLayerRadius(dimensionState, dimension, layerProps) {
  return function (cell) {
    var getRadiusValue = layerProps.getRadiusValue;
    var scaleFunc = dimensionState.scaleFunc;
    return scaleFunc(getRadiusValue(cell));
  };
}

var clusterAggregation = {
  key: 'position',
  updateSteps: [{
    key: 'geojson',
    triggers: {
      position: {
        prop: 'getPosition',
        updateTrigger: 'getPosition'
      },
      filterData: {
        prop: 'filterData',
        updateTrigger: 'filterData'
      }
    },
    updater: processGeoJSON
  }, {
    key: 'clustering',
    triggers: {
      clusterRadius: {
        prop: 'clusterRadius'
      },
      zoom: {
        prop: 'zoom'
      },
      width: {
        prop: 'width'
      },
      height: {
        prop: 'height'
      }
    },
    updater: getClusters
  }]
};
exports.clusterAggregation = clusterAggregation;

function getRadiusValueDomain(step, props, dimensionUpdater) {
  var key = dimensionUpdater.key;
  var getRadiusValue = props.getRadiusValue;
  var layerData = this.state.layerData;
  var valueDomain = [0, (0, _d3Array.max)(layerData.data, getRadiusValue)];

  this._setDimensionState(key, {
    valueDomain: valueDomain
  });
}

var clusterLayerDimensions = [_cpuAggregator.defaultColorDimension, {
  key: 'radius',
  accessor: 'getRadius',
  nullValue: 0,
  updateSteps: [{
    key: 'getDomain',
    triggers: {
      value: {
        prop: 'getRadiusValue',
        updateTrigger: 'getRadiusValue'
      }
    },
    updater: getRadiusValueDomain
  }, {
    key: 'getScaleFunc',
    triggers: {
      domain: {
        prop: 'radiusDomain'
      },
      range: {
        prop: 'radiusRange'
      },
      scaleType: {
        prop: 'radiusScaleType'
      }
    },
    updater: _cpuAggregator.getDimensionScale
  }],
  getSubLayerAccessor: getSubLayerRadius,
  getPickingInfo: function getPickingInfo(dimensionState, cell, layerProps) {
    var radiusValue = layerProps.getRadiusValue(cell);
    return {
      radiusValue: radiusValue
    };
  }
}];
var defaultProps = {
  clusterRadius: defaultRadius,
  colorDomain: null,
  colorRange: _colorRanges.DefaultColorRange,
  colorScaleType: _defaultSettings.SCALE_TYPES.quantize,
  radiusScaleType: _defaultSettings.SCALE_TYPES.sqrt,
  radiusRange: defaultRadiusRange,
  getPosition: {
    type: 'accessor',
    value: function value(x) {
      return x.position;
    }
  },
  getColorValue: {
    type: 'accessor',
    value: defaultGetColorValue
  },
  getRadiusValue: {
    type: 'accessor',
    value: defaultGetRadiusValue
  }
};

var ClusterLayer =
/*#__PURE__*/
function (_AggregationLayer) {
  (0, _inherits2["default"])(ClusterLayer, _AggregationLayer);

  function ClusterLayer() {
    (0, _classCallCheck2["default"])(this, ClusterLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClusterLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ClusterLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var cpuAggregator = new _cpuAggregator["default"]({
        aggregation: clusterAggregation,
        dimensions: clusterLayerDimensions
      });
      this.state = {
        cpuAggregator: cpuAggregator,
        aggregatorState: cpuAggregator.state
      };
      var attributeManager = this.getAttributeManager();
      attributeManager.add({
        positions: {
          size: 3,
          accessor: 'getPosition'
        }
      });
    }
  }, {
    key: "updateState",
    value: function updateState(_ref3) {
      var oldProps = _ref3.oldProps,
          props = _ref3.props,
          changeFlags = _ref3.changeFlags;
      this.setState({
        // make a copy of the internal state of cpuAggregator for testing
        aggregatorState: this.state.cpuAggregator.updateState({
          oldProps: oldProps,
          props: props,
          changeFlags: changeFlags
        }, {
          viewport: this.context.viewport,
          attributes: this.getAttributes(),
          numInstances: this.getNumInstances(props)
        })
      });
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref4) {
      var info = _ref4.info;
      return this.state.cpuAggregator.getPickingInfo({
        info: info
      }, this.props);
    }
  }, {
    key: "_getSublayerUpdateTriggers",
    value: function _getSublayerUpdateTriggers() {
      return this.state.cpuAggregator.getUpdateTriggers(this.props);
    }
  }, {
    key: "_getSubLayerAccessors",
    value: function _getSubLayerAccessors() {
      return {
        getRadius: this.state.cpuAggregator.getAccessor('radius', this.props),
        getFillColor: this.state.cpuAggregator.getAccessor('fillColor', this.props)
      };
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      // for subclassing, override this method to return
      // customized sub layer props
      var _this$props = this.props,
          id = _this$props.id,
          radiusScale = _this$props.radiusScale;
      var cpuAggregator = this.state.cpuAggregator; // base layer props

      var _this$props2 = this.props,
          opacity = _this$props2.opacity,
          pickable = _this$props2.pickable,
          autoHighlight = _this$props2.autoHighlight,
          highlightColor = _this$props2.highlightColor;

      var updateTriggers = this._getSublayerUpdateTriggers();

      var accessors = this._getSubLayerAccessors();

      var distanceScale = (0, _viewportMercatorProject.getDistanceScales)(this.context.viewport);
      var metersPerPixel = distanceScale.metersPerPixel[0]; // return props to the sublayer constructor

      return new _layers.ScatterplotLayer(_objectSpread({
        id: "".concat(id, "-cluster"),
        data: cpuAggregator.state.layerData.data,
        radiusScale: metersPerPixel * radiusScale,
        opacity: opacity,
        pickable: pickable,
        autoHighlight: autoHighlight,
        highlightColor: highlightColor,
        updateTriggers: updateTriggers
      }, accessors));
    }
  }]);
  return ClusterLayer;
}(_aggregationLayers._AggregationLayer);

exports["default"] = ClusterLayer;
ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmFkaXVzIiwiTEFZRVJfVklTX0NPTkZJR1MiLCJjbHVzdGVyUmFkaXVzIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1c1JhbmdlIiwiZGVmYXVsdEdldENvbG9yVmFsdWUiLCJwb2ludHMiLCJsZW5ndGgiLCJkZWZhdWx0R2V0UmFkaXVzVmFsdWUiLCJjZWxsIiwiZmlsdGVyZWRQb2ludHMiLCJwcm9jZXNzR2VvSlNPTiIsInN0ZXAiLCJwcm9wcyIsImFnZ3JlZ2F0aW9uIiwidmlld3BvcnQiLCJkYXRhIiwiZ2V0UG9zaXRpb24iLCJmaWx0ZXJEYXRhIiwiZ2VvSlNPTiIsImNsdXN0ZXJCdWlsZGVyIiwiQ2x1c3RlckJ1aWxkZXIiLCJzZXRTdGF0ZSIsImdldENsdXN0ZXJzIiwic3RhdGUiLCJ6b29tIiwid2lkdGgiLCJoZWlnaHQiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImJib3giLCJnZW9WaWV3cG9ydCIsImJvdW5kcyIsImNsdXN0ZXJzIiwiY2x1c3RlcnNBdFpvb20iLCJsYXllckRhdGEiLCJnZXRTdWJMYXllclJhZGl1cyIsImRpbWVuc2lvblN0YXRlIiwiZGltZW5zaW9uIiwibGF5ZXJQcm9wcyIsImdldFJhZGl1c1ZhbHVlIiwic2NhbGVGdW5jIiwiY2x1c3RlckFnZ3JlZ2F0aW9uIiwia2V5IiwidXBkYXRlU3RlcHMiLCJ0cmlnZ2VycyIsInBvc2l0aW9uIiwicHJvcCIsInVwZGF0ZVRyaWdnZXIiLCJ1cGRhdGVyIiwiZ2V0UmFkaXVzVmFsdWVEb21haW4iLCJkaW1lbnNpb25VcGRhdGVyIiwidmFsdWVEb21haW4iLCJfc2V0RGltZW5zaW9uU3RhdGUiLCJjbHVzdGVyTGF5ZXJEaW1lbnNpb25zIiwiZGVmYXVsdENvbG9yRGltZW5zaW9uIiwiYWNjZXNzb3IiLCJudWxsVmFsdWUiLCJ2YWx1ZSIsImRvbWFpbiIsInJhbmdlIiwic2NhbGVUeXBlIiwiZ2V0RGltZW5zaW9uU2NhbGUiLCJnZXRTdWJMYXllckFjY2Vzc29yIiwiZ2V0UGlja2luZ0luZm8iLCJyYWRpdXNWYWx1ZSIsImRlZmF1bHRQcm9wcyIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsIkRlZmF1bHRDb2xvclJhbmdlIiwiY29sb3JTY2FsZVR5cGUiLCJTQ0FMRV9UWVBFUyIsInF1YW50aXplIiwicmFkaXVzU2NhbGVUeXBlIiwic3FydCIsInJhZGl1c1JhbmdlIiwidHlwZSIsIngiLCJnZXRDb2xvclZhbHVlIiwiQ2x1c3RlckxheWVyIiwiY3B1QWdncmVnYXRvciIsIkNQVUFnZ3JlZ2F0b3IiLCJkaW1lbnNpb25zIiwiYWdncmVnYXRvclN0YXRlIiwiYXR0cmlidXRlTWFuYWdlciIsImdldEF0dHJpYnV0ZU1hbmFnZXIiLCJhZGQiLCJwb3NpdGlvbnMiLCJzaXplIiwib2xkUHJvcHMiLCJjaGFuZ2VGbGFncyIsInVwZGF0ZVN0YXRlIiwiY29udGV4dCIsImF0dHJpYnV0ZXMiLCJnZXRBdHRyaWJ1dGVzIiwibnVtSW5zdGFuY2VzIiwiZ2V0TnVtSW5zdGFuY2VzIiwiaW5mbyIsImdldFVwZGF0ZVRyaWdnZXJzIiwiZ2V0UmFkaXVzIiwiZ2V0QWNjZXNzb3IiLCJnZXRGaWxsQ29sb3IiLCJpZCIsInJhZGl1c1NjYWxlIiwib3BhY2l0eSIsInBpY2thYmxlIiwiYXV0b0hpZ2hsaWdodCIsImhpZ2hsaWdodENvbG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJfZ2V0U3VibGF5ZXJVcGRhdGVUcmlnZ2VycyIsImFjY2Vzc29ycyIsIl9nZXRTdWJMYXllckFjY2Vzc29ycyIsImRpc3RhbmNlU2NhbGUiLCJtZXRlcnNQZXJQaXhlbCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJBZ2dyZWdhdGlvbkxheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFD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QSxRQUxLO0FBTUxDLFFBQUFBLGFBQWEsRUFBYkEsYUFOSztBQU9MQyxRQUFBQSxjQUFjLEVBQWRBLGNBUEs7QUFRTEMsUUFBQUEsY0FBYyxFQUFkQTtBQVJLLFNBU0ZFLFNBVEUsRUFBUDtBQVdEOzs7RUF4RXVDSyxvQzs7O0FBMkUxQ3BDLFlBQVksQ0FBQ3FDLFNBQWIsR0FBeUIsY0FBekI7QUFDQXJDLFlBQVksQ0FBQ2IsWUFBYixHQUE0QkEsWUFBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQge19BZ2dyZWdhdGlvbkxheWVyIGFzIEFnZ3JlZ2F0aW9uTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2FnZ3JlZ2F0aW9uLWxheWVycyc7XG5cbmltcG9ydCBnZW9WaWV3cG9ydCBmcm9tICdAbWFwYm94L2dlby12aWV3cG9ydCc7XG5pbXBvcnQgQ1BVQWdncmVnYXRvciwge1xuICBkZWZhdWx0Q29sb3JEaW1lbnNpb24sXG4gIGdldERpbWVuc2lvblNjYWxlXG59IGZyb20gJy4uL2xheWVyLXV0aWxzL2NwdS1hZ2dyZWdhdG9yJztcbmltcG9ydCB7Z2V0RGlzdGFuY2VTY2FsZXN9IGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuaW1wb3J0IHttYXh9IGZyb20gJ2QzLWFycmF5JztcblxuaW1wb3J0IHtEZWZhdWx0Q29sb3JSYW5nZX0gZnJvbSAnY29uc3RhbnRzL2NvbG9yLXJhbmdlcyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQge1NDQUxFX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmltcG9ydCBDbHVzdGVyQnVpbGRlciwge2dldEdlb0pTT059IGZyb20gJy4uL2xheWVyLXV0aWxzL2NsdXN0ZXItdXRpbHMnO1xuXG5jb25zdCBkZWZhdWx0UmFkaXVzID0gTEFZRVJfVklTX0NPTkZJR1MuY2x1c3RlclJhZGl1cy5kZWZhdWx0VmFsdWU7XG5jb25zdCBkZWZhdWx0UmFkaXVzUmFuZ2UgPSBMQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzUmFuZ2UuZGVmYXVsdFZhbHVlO1xuXG5jb25zdCBkZWZhdWx0R2V0Q29sb3JWYWx1ZSA9IHBvaW50cyA9PiBwb2ludHMubGVuZ3RoO1xuY29uc3QgZGVmYXVsdEdldFJhZGl1c1ZhbHVlID0gY2VsbCA9PlxuICBjZWxsLmZpbHRlcmVkUG9pbnRzID8gY2VsbC5maWx0ZXJlZFBvaW50cy5sZW5ndGggOiBjZWxsLnBvaW50cy5sZW5ndGg7XG5cbmZ1bmN0aW9uIHByb2Nlc3NHZW9KU09OKHN0ZXAsIHByb3BzLCBhZ2dyZWdhdGlvbiwge3ZpZXdwb3J0fSkge1xuICBjb25zdCB7ZGF0YSwgZ2V0UG9zaXRpb24sIGZpbHRlckRhdGF9ID0gcHJvcHM7XG4gIGNvbnN0IGdlb0pTT04gPSBnZXRHZW9KU09OKGRhdGEsIGdldFBvc2l0aW9uLCBmaWx0ZXJEYXRhKTtcbiAgY29uc3QgY2x1c3RlckJ1aWxkZXIgPSBuZXcgQ2x1c3RlckJ1aWxkZXIoKTtcblxuICB0aGlzLnNldFN0YXRlKHtnZW9KU09OLCBjbHVzdGVyQnVpbGRlcn0pO1xufVxuXG5mdW5jdGlvbiBnZXRDbHVzdGVycyhzdGVwLCBwcm9wcywgYWdncmVnYXRpb24sIHt2aWV3cG9ydH0pIHtcbiAgY29uc3Qge2dlb0pTT04sIGNsdXN0ZXJCdWlsZGVyfSA9IHRoaXMuc3RhdGU7XG4gIGNvbnN0IHtjbHVzdGVyUmFkaXVzLCB6b29tLCB3aWR0aCwgaGVpZ2h0fSA9IHByb3BzO1xuICBjb25zdCB7bG9uZ2l0dWRlLCBsYXRpdHVkZX0gPSB2aWV3cG9ydDtcblxuICAvLyB6b29tIG5lZWRzIHRvIGJlIGFuIGludGVnZXIgZm9yIHRoZSBkaWZmZXJlbnQgbWFwIHV0aWxzLiBBbHNvIGhlbHBzIHdpdGggY2FjaGUga2V5LlxuICBjb25zdCBiYm94ID0gZ2VvVmlld3BvcnQuYm91bmRzKFtsb25naXR1ZGUsIGxhdGl0dWRlXSwgem9vbSwgW3dpZHRoLCBoZWlnaHRdKTtcbiAgY29uc3QgY2x1c3RlcnMgPSBjbHVzdGVyQnVpbGRlci5jbHVzdGVyc0F0Wm9vbSh7YmJveCwgY2x1c3RlclJhZGl1cywgZ2VvSlNPTiwgem9vbX0pO1xuXG4gIHRoaXMuc2V0U3RhdGUoe1xuICAgIGxheWVyRGF0YToge2RhdGE6IGNsdXN0ZXJzfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0U3ViTGF5ZXJSYWRpdXMoZGltZW5zaW9uU3RhdGUsIGRpbWVuc2lvbiwgbGF5ZXJQcm9wcykge1xuICByZXR1cm4gY2VsbCA9PiB7XG4gICAgY29uc3Qge2dldFJhZGl1c1ZhbHVlfSA9IGxheWVyUHJvcHM7XG4gICAgY29uc3Qge3NjYWxlRnVuY30gPSBkaW1lbnNpb25TdGF0ZTtcbiAgICByZXR1cm4gc2NhbGVGdW5jKGdldFJhZGl1c1ZhbHVlKGNlbGwpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNsdXN0ZXJBZ2dyZWdhdGlvbiA9IHtcbiAga2V5OiAncG9zaXRpb24nLFxuICB1cGRhdGVTdGVwczogW1xuICAgIHtcbiAgICAgIGtleTogJ2dlb2pzb24nLFxuICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICBwcm9wOiAnZ2V0UG9zaXRpb24nLFxuICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdnZXRQb3NpdGlvbidcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyRGF0YToge1xuICAgICAgICAgIHByb3A6ICdmaWx0ZXJEYXRhJyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnZmlsdGVyRGF0YSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IHByb2Nlc3NHZW9KU09OXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdjbHVzdGVyaW5nJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIGNsdXN0ZXJSYWRpdXM6IHtcbiAgICAgICAgICBwcm9wOiAnY2x1c3RlclJhZGl1cydcbiAgICAgICAgfSxcbiAgICAgICAgem9vbToge1xuICAgICAgICAgIHByb3A6ICd6b29tJ1xuICAgICAgICB9LFxuICAgICAgICB3aWR0aDoge1xuICAgICAgICAgIHByb3A6ICd3aWR0aCdcbiAgICAgICAgfSxcbiAgICAgICAgaGVpZ2h0OiB7XG4gICAgICAgICAgcHJvcDogJ2hlaWdodCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IGdldENsdXN0ZXJzXG4gICAgfVxuICBdXG59O1xuXG5mdW5jdGlvbiBnZXRSYWRpdXNWYWx1ZURvbWFpbihzdGVwLCBwcm9wcywgZGltZW5zaW9uVXBkYXRlcikge1xuICBjb25zdCB7a2V5fSA9IGRpbWVuc2lvblVwZGF0ZXI7XG4gIGNvbnN0IHtnZXRSYWRpdXNWYWx1ZX0gPSBwcm9wcztcbiAgY29uc3Qge2xheWVyRGF0YX0gPSB0aGlzLnN0YXRlO1xuXG4gIGNvbnN0IHZhbHVlRG9tYWluID0gWzAsIG1heChsYXllckRhdGEuZGF0YSwgZ2V0UmFkaXVzVmFsdWUpXTtcbiAgdGhpcy5fc2V0RGltZW5zaW9uU3RhdGUoa2V5LCB7dmFsdWVEb21haW59KTtcbn1cblxuY29uc3QgY2x1c3RlckxheWVyRGltZW5zaW9ucyA9IFtcbiAgZGVmYXVsdENvbG9yRGltZW5zaW9uLFxuICB7XG4gICAga2V5OiAncmFkaXVzJyxcbiAgICBhY2Nlc3NvcjogJ2dldFJhZGl1cycsXG4gICAgbnVsbFZhbHVlOiAwLFxuICAgIHVwZGF0ZVN0ZXBzOiBbXG4gICAgICB7XG4gICAgICAgIGtleTogJ2dldERvbWFpbicsXG4gICAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIHByb3A6ICdnZXRSYWRpdXNWYWx1ZScsXG4gICAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnZ2V0UmFkaXVzVmFsdWUnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVyOiBnZXRSYWRpdXNWYWx1ZURvbWFpblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnZ2V0U2NhbGVGdW5jJyxcbiAgICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgICBkb21haW46IHtwcm9wOiAncmFkaXVzRG9tYWluJ30sXG4gICAgICAgICAgcmFuZ2U6IHtwcm9wOiAncmFkaXVzUmFuZ2UnfSxcbiAgICAgICAgICBzY2FsZVR5cGU6IHtwcm9wOiAncmFkaXVzU2NhbGVUeXBlJ31cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlcjogZ2V0RGltZW5zaW9uU2NhbGVcbiAgICAgIH1cbiAgICBdLFxuICAgIGdldFN1YkxheWVyQWNjZXNzb3I6IGdldFN1YkxheWVyUmFkaXVzLFxuICAgIGdldFBpY2tpbmdJbmZvOiAoZGltZW5zaW9uU3RhdGUsIGNlbGwsIGxheWVyUHJvcHMpID0+IHtcbiAgICAgIGNvbnN0IHJhZGl1c1ZhbHVlID0gbGF5ZXJQcm9wcy5nZXRSYWRpdXNWYWx1ZShjZWxsKTtcbiAgICAgIHJldHVybiB7cmFkaXVzVmFsdWV9O1xuICAgIH1cbiAgfVxuXTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBjbHVzdGVyUmFkaXVzOiBkZWZhdWx0UmFkaXVzLFxuICBjb2xvckRvbWFpbjogbnVsbCxcbiAgY29sb3JSYW5nZTogRGVmYXVsdENvbG9yUmFuZ2UsXG4gIGNvbG9yU2NhbGVUeXBlOiBTQ0FMRV9UWVBFUy5xdWFudGl6ZSxcbiAgcmFkaXVzU2NhbGVUeXBlOiBTQ0FMRV9UWVBFUy5zcXJ0LFxuICByYWRpdXNSYW5nZTogZGVmYXVsdFJhZGl1c1JhbmdlLFxuICBnZXRQb3NpdGlvbjoge3R5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiB4ID0+IHgucG9zaXRpb259LFxuICBnZXRDb2xvclZhbHVlOiB7dHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IGRlZmF1bHRHZXRDb2xvclZhbHVlfSxcbiAgZ2V0UmFkaXVzVmFsdWU6IHt0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogZGVmYXVsdEdldFJhZGl1c1ZhbHVlfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2x1c3RlckxheWVyIGV4dGVuZHMgQWdncmVnYXRpb25MYXllciB7XG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCBjcHVBZ2dyZWdhdG9yID0gbmV3IENQVUFnZ3JlZ2F0b3Ioe1xuICAgICAgYWdncmVnYXRpb246IGNsdXN0ZXJBZ2dyZWdhdGlvbixcbiAgICAgIGRpbWVuc2lvbnM6IGNsdXN0ZXJMYXllckRpbWVuc2lvbnNcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjcHVBZ2dyZWdhdG9yLFxuICAgICAgYWdncmVnYXRvclN0YXRlOiBjcHVBZ2dyZWdhdG9yLnN0YXRlXG4gICAgfTtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYW5hZ2VyID0gdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCk7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGQoe1xuICAgICAgcG9zaXRpb25zOiB7c2l6ZTogMywgYWNjZXNzb3I6ICdnZXRQb3NpdGlvbid9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7b2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFnc30pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiBjcHVBZ2dyZWdhdG9yIGZvciB0ZXN0aW5nXG4gICAgICBhZ2dyZWdhdG9yU3RhdGU6IHRoaXMuc3RhdGUuY3B1QWdncmVnYXRvci51cGRhdGVTdGF0ZShcbiAgICAgICAge29sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3N9LFxuICAgICAgICB7XG4gICAgICAgICAgdmlld3BvcnQ6IHRoaXMuY29udGV4dC52aWV3cG9ydCxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLmdldEF0dHJpYnV0ZXMoKSxcbiAgICAgICAgICBudW1JbnN0YW5jZXM6IHRoaXMuZ2V0TnVtSW5zdGFuY2VzKHByb3BzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSk7XG4gIH1cblxuICBnZXRQaWNraW5nSW5mbyh7aW5mb30pIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jcHVBZ2dyZWdhdG9yLmdldFBpY2tpbmdJbmZvKHtpbmZvfSwgdGhpcy5wcm9wcyk7XG4gIH1cblxuICBfZ2V0U3VibGF5ZXJVcGRhdGVUcmlnZ2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jcHVBZ2dyZWdhdG9yLmdldFVwZGF0ZVRyaWdnZXJzKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgX2dldFN1YkxheWVyQWNjZXNzb3JzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRSYWRpdXM6IHRoaXMuc3RhdGUuY3B1QWdncmVnYXRvci5nZXRBY2Nlc3NvcigncmFkaXVzJywgdGhpcy5wcm9wcyksXG4gICAgICBnZXRGaWxsQ29sb3I6IHRoaXMuc3RhdGUuY3B1QWdncmVnYXRvci5nZXRBY2Nlc3NvcignZmlsbENvbG9yJywgdGhpcy5wcm9wcylcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIC8vIGZvciBzdWJjbGFzc2luZywgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcmV0dXJuXG4gICAgLy8gY3VzdG9taXplZCBzdWIgbGF5ZXIgcHJvcHNcbiAgICBjb25zdCB7aWQsIHJhZGl1c1NjYWxlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2NwdUFnZ3JlZ2F0b3J9ID0gdGhpcy5zdGF0ZTtcblxuICAgIC8vIGJhc2UgbGF5ZXIgcHJvcHNcbiAgICBjb25zdCB7b3BhY2l0eSwgcGlja2FibGUsIGF1dG9IaWdobGlnaHQsIGhpZ2hsaWdodENvbG9yfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB0aGlzLl9nZXRTdWJsYXllclVwZGF0ZVRyaWdnZXJzKCk7XG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0U3ViTGF5ZXJBY2Nlc3NvcnMoKTtcblxuICAgIGNvbnN0IGRpc3RhbmNlU2NhbGUgPSBnZXREaXN0YW5jZVNjYWxlcyh0aGlzLmNvbnRleHQudmlld3BvcnQpO1xuICAgIGNvbnN0IG1ldGVyc1BlclBpeGVsID0gZGlzdGFuY2VTY2FsZS5tZXRlcnNQZXJQaXhlbFswXTtcblxuICAgIC8vIHJldHVybiBwcm9wcyB0byB0aGUgc3VibGF5ZXIgY29uc3RydWN0b3JcbiAgICByZXR1cm4gbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgaWQ6IGAke2lkfS1jbHVzdGVyYCxcbiAgICAgIGRhdGE6IGNwdUFnZ3JlZ2F0b3Iuc3RhdGUubGF5ZXJEYXRhLmRhdGEsXG4gICAgICByYWRpdXNTY2FsZTogbWV0ZXJzUGVyUGl4ZWwgKiByYWRpdXNTY2FsZSxcbiAgICAgIG9wYWNpdHksXG4gICAgICBwaWNrYWJsZSxcbiAgICAgIGF1dG9IaWdobGlnaHQsXG4gICAgICBoaWdobGlnaHRDb2xvcixcbiAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuICAgICAgLi4uYWNjZXNzb3JzXG4gICAgfSk7XG4gIH1cbn1cblxuQ2x1c3RlckxheWVyLmxheWVyTmFtZSA9ICdDbHVzdGVyTGF5ZXInO1xuQ2x1c3RlckxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==