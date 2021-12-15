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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _layers = require("@deck.gl/layers");

var _aggregationLayers = require("@deck.gl/aggregation-layers");

var _geoViewport = _interopRequireDefault(require("@mapbox/geo-viewport"));

var _cpuAggregator = _interopRequireWildcard(require("../layer-utils/cpu-aggregator"));

var _viewportMercatorProject = require("viewport-mercator-project");

var _d3Array = require("d3-array");

var _layerFactory = require("../../layers/layer-factory");

var _defaultSettings = require("../../constants/default-settings");

var _colorRanges = require("../../constants/color-ranges");

var _clusterUtils = _interopRequireWildcard(require("../layer-utils/cluster-utils"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
  colorRange: _colorRanges.DEFAULT_COLOR_RANGE,
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

var ClusterLayer = /*#__PURE__*/function (_AggregationLayer) {
  (0, _inherits2["default"])(ClusterLayer, _AggregationLayer);

  var _super = _createSuper(ClusterLayer);

  function ClusterLayer() {
    (0, _classCallCheck2["default"])(this, ClusterLayer);
    return _super.apply(this, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NsdXN0ZXItbGF5ZXIvY2x1c3Rlci1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmFkaXVzIiwiTEFZRVJfVklTX0NPTkZJR1MiLCJjbHVzdGVyUmFkaXVzIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1c1JhbmdlIiwiZGVmYXVsdEdldENvbG9yVmFsdWUiLCJwb2ludHMiLCJsZW5ndGgiLCJkZWZhdWx0R2V0UmFkaXVzVmFsdWUiLCJjZWxsIiwiZmlsdGVyZWRQb2ludHMiLCJwcm9jZXNzR2VvSlNPTiIsInN0ZXAiLCJwcm9wcyIsImFnZ3JlZ2F0aW9uIiwidmlld3BvcnQiLCJkYXRhIiwiZ2V0UG9zaXRpb24iLCJmaWx0ZXJEYXRhIiwiZ2VvSlNPTiIsImNsdXN0ZXJCdWlsZGVyIiwiQ2x1c3RlckJ1aWxkZXIiLCJzZXRTdGF0ZSIsImdldENsdXN0ZXJzIiwic3RhdGUiLCJ6b29tIiwid2lkdGgiLCJoZWlnaHQiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImJib3giLCJnZW9WaWV3cG9ydCIsImJvdW5kcyIsImNsdXN0ZXJzIiwiY2x1c3RlcnNBdFpvb20iLCJsYXllckRhdGEiLCJnZXRTdWJMYXllclJhZGl1cyIsImRpbWVuc2lvblN0YXRlIiwiZGltZW5zaW9uIiwibGF5ZXJQcm9wcyIsImdldFJhZGl1c1ZhbHVlIiwic2NhbGVGdW5jIiwiY2x1c3RlckFnZ3JlZ2F0aW9uIiwia2V5IiwidXBkYXRlU3RlcHMiLCJ0cmlnZ2VycyIsInBvc2l0aW9uIiwicHJvcCIsInVwZGF0ZVRyaWdnZXIiLCJ1cGRhdGVyIiwiZ2V0UmFkaXVzVmFsdWVEb21haW4iLCJkaW1lbnNpb25VcGRhdGVyIiwidmFsdWVEb21haW4iLCJfc2V0RGltZW5zaW9uU3RhdGUiLCJjbHVzdGVyTGF5ZXJEaW1lbnNpb25zIiwiZGVmYXVsdENvbG9yRGltZW5zaW9uIiwiYWNjZXNzb3IiLCJudWxsVmFsdWUiLCJ2YWx1ZSIsImRvbWFpbiIsInJhbmdlIiwic2NhbGVUeXBlIiwiZ2V0RGltZW5zaW9uU2NhbGUiLCJnZXRTdWJMYXllckFjY2Vzc29yIiwiZ2V0UGlja2luZ0luZm8iLCJyYWRpdXNWYWx1ZSIsImRlZmF1bHRQcm9wcyIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsIkRFRkFVTFRfQ09MT1JfUkFOR0UiLCJjb2xvclNjYWxlVHlwZSIsIlNDQUxFX1RZUEVTIiwicXVhbnRpemUiLCJyYWRpdXNTY2FsZVR5cGUiLCJzcXJ0IiwicmFkaXVzUmFuZ2UiLCJ0eXBlIiwieCIsImdldENvbG9yVmFsdWUiLCJDbHVzdGVyTGF5ZXIiLCJjcHVBZ2dyZWdhdG9yIiwiQ1BVQWdncmVnYXRvciIsImRpbWVuc2lvbnMiLCJhZ2dyZWdhdG9yU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiZ2V0QXR0cmlidXRlTWFuYWdlciIsImFkZCIsInBvc2l0aW9ucyIsInNpemUiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwidXBkYXRlU3RhdGUiLCJjb250ZXh0IiwiYXR0cmlidXRlcyIsImdldEF0dHJpYnV0ZXMiLCJudW1JbnN0YW5jZXMiLCJnZXROdW1JbnN0YW5jZXMiLCJpbmZvIiwiZ2V0VXBkYXRlVHJpZ2dlcnMiLCJnZXRSYWRpdXMiLCJnZXRBY2Nlc3NvciIsImdldEZpbGxDb2xvciIsImlkIiwicmFkaXVzU2NhbGUiLCJvcGFjaXR5IiwicGlja2FibGUiLCJhdXRvSGlnaGxpZ2h0IiwiaGlnaGxpZ2h0Q29sb3IiLCJ1cGRhdGVUcmlnZ2VycyIsIl9nZXRTdWJsYXllclVwZGF0ZVRyaWdnZXJzIiwiYWNjZXNzb3JzIiwiX2dldFN1YkxheWVyQWNjZXNzb3JzIiwiZGlzdGFuY2VTY2FsZSIsIm1ldGVyc1BlclBpeGVsIiwiU2NhdHRlcnBsb3RMYXllciIsIkFnZ3JlZ2F0aW9uTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUlBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHQyxnQ0FBa0JDLGFBQWxCLENBQWdDQyxZQUF0RDtBQUNBLElBQU1DLGtCQUFrQixHQUFHSCxnQ0FBa0JJLGtCQUFsQixDQUFxQ0YsWUFBaEU7O0FBRUEsSUFBTUcsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixDQUFBQyxNQUFNO0FBQUEsU0FBSUEsTUFBTSxDQUFDQyxNQUFYO0FBQUEsQ0FBbkM7O0FBQ0EsSUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFBQyxJQUFJO0FBQUEsU0FDaENBLElBQUksQ0FBQ0MsY0FBTCxHQUFzQkQsSUFBSSxDQUFDQyxjQUFMLENBQW9CSCxNQUExQyxHQUFtREUsSUFBSSxDQUFDSCxNQUFMLENBQVlDLE1BRC9CO0FBQUEsQ0FBbEM7O0FBR0EsU0FBU0ksY0FBVCxDQUF3QkMsSUFBeEIsRUFBOEJDLEtBQTlCLEVBQXFDQyxXQUFyQyxRQUE4RDtBQUFBLE1BQVhDLFFBQVcsUUFBWEEsUUFBVztBQUFBLE1BQ3JEQyxJQURxRCxHQUNwQkgsS0FEb0IsQ0FDckRHLElBRHFEO0FBQUEsTUFDL0NDLFdBRCtDLEdBQ3BCSixLQURvQixDQUMvQ0ksV0FEK0M7QUFBQSxNQUNsQ0MsVUFEa0MsR0FDcEJMLEtBRG9CLENBQ2xDSyxVQURrQztBQUU1RCxNQUFNQyxPQUFPLEdBQUcsOEJBQVdILElBQVgsRUFBaUJDLFdBQWpCLEVBQThCQyxVQUE5QixDQUFoQjtBQUNBLE1BQU1FLGNBQWMsR0FBRyxJQUFJQyx3QkFBSixFQUF2QjtBQUVBLE9BQUtDLFFBQUwsQ0FBYztBQUFDSCxJQUFBQSxPQUFPLEVBQVBBLE9BQUQ7QUFBVUMsSUFBQUEsY0FBYyxFQUFkQTtBQUFWLEdBQWQ7QUFDRDs7QUFFRCxTQUFTRyxXQUFULENBQXFCWCxJQUFyQixFQUEyQkMsS0FBM0IsRUFBa0NDLFdBQWxDLFNBQTJEO0FBQUEsTUFBWEMsUUFBVyxTQUFYQSxRQUFXO0FBQUEsb0JBQ3ZCLEtBQUtTLEtBRGtCO0FBQUEsTUFDbERMLE9BRGtELGVBQ2xEQSxPQURrRDtBQUFBLE1BQ3pDQyxjQUR5QyxlQUN6Q0EsY0FEeUM7QUFBQSxNQUVsRG5CLGFBRmtELEdBRVpZLEtBRlksQ0FFbERaLGFBRmtEO0FBQUEsTUFFbkN3QixJQUZtQyxHQUVaWixLQUZZLENBRW5DWSxJQUZtQztBQUFBLE1BRTdCQyxLQUY2QixHQUVaYixLQUZZLENBRTdCYSxLQUY2QjtBQUFBLE1BRXRCQyxNQUZzQixHQUVaZCxLQUZZLENBRXRCYyxNQUZzQjtBQUFBLE1BR2xEQyxTQUhrRCxHQUczQmIsUUFIMkIsQ0FHbERhLFNBSGtEO0FBQUEsTUFHdkNDLFFBSHVDLEdBRzNCZCxRQUgyQixDQUd2Q2MsUUFIdUMsRUFLekQ7O0FBQ0EsTUFBTUMsSUFBSSxHQUFHQyx3QkFBWUMsTUFBWixDQUFtQixDQUFDSixTQUFELEVBQVlDLFFBQVosQ0FBbkIsRUFBMENKLElBQTFDLEVBQWdELENBQUNDLEtBQUQsRUFBUUMsTUFBUixDQUFoRCxDQUFiOztBQUNBLE1BQU1NLFFBQVEsR0FBR2IsY0FBYyxDQUFDYyxjQUFmLENBQThCO0FBQUNKLElBQUFBLElBQUksRUFBSkEsSUFBRDtBQUFPN0IsSUFBQUEsYUFBYSxFQUFiQSxhQUFQO0FBQXNCa0IsSUFBQUEsT0FBTyxFQUFQQSxPQUF0QjtBQUErQk0sSUFBQUEsSUFBSSxFQUFKQTtBQUEvQixHQUE5QixDQUFqQjtBQUVBLE9BQUtILFFBQUwsQ0FBYztBQUNaYSxJQUFBQSxTQUFTLEVBQUU7QUFBQ25CLE1BQUFBLElBQUksRUFBRWlCO0FBQVA7QUFEQyxHQUFkO0FBR0Q7O0FBRUQsU0FBU0csaUJBQVQsQ0FBMkJDLGNBQTNCLEVBQTJDQyxTQUEzQyxFQUFzREMsVUFBdEQsRUFBa0U7QUFDaEUsU0FBTyxVQUFBOUIsSUFBSSxFQUFJO0FBQUEsUUFDTitCLGNBRE0sR0FDWUQsVUFEWixDQUNOQyxjQURNO0FBQUEsUUFFTkMsU0FGTSxHQUVPSixjQUZQLENBRU5JLFNBRk07QUFHYixXQUFPQSxTQUFTLENBQUNELGNBQWMsQ0FBQy9CLElBQUQsQ0FBZixDQUFoQjtBQUNELEdBSkQ7QUFLRDs7QUFFTSxJQUFNaUMsa0JBQWtCLEdBQUc7QUFDaENDLEVBQUFBLEdBQUcsRUFBRSxVQUQyQjtBQUVoQ0MsRUFBQUEsV0FBVyxFQUFFLENBQ1g7QUFDRUQsSUFBQUEsR0FBRyxFQUFFLFNBRFA7QUFFRUUsSUFBQUEsUUFBUSxFQUFFO0FBQ1JDLE1BQUFBLFFBQVEsRUFBRTtBQUNSQyxRQUFBQSxJQUFJLEVBQUUsYUFERTtBQUVSQyxRQUFBQSxhQUFhLEVBQUU7QUFGUCxPQURGO0FBS1I5QixNQUFBQSxVQUFVLEVBQUU7QUFDVjZCLFFBQUFBLElBQUksRUFBRSxZQURJO0FBRVZDLFFBQUFBLGFBQWEsRUFBRTtBQUZMO0FBTEosS0FGWjtBQVlFQyxJQUFBQSxPQUFPLEVBQUV0QztBQVpYLEdBRFcsRUFlWDtBQUNFZ0MsSUFBQUEsR0FBRyxFQUFFLFlBRFA7QUFFRUUsSUFBQUEsUUFBUSxFQUFFO0FBQ1I1QyxNQUFBQSxhQUFhLEVBQUU7QUFDYjhDLFFBQUFBLElBQUksRUFBRTtBQURPLE9BRFA7QUFJUnRCLE1BQUFBLElBQUksRUFBRTtBQUNKc0IsUUFBQUEsSUFBSSxFQUFFO0FBREYsT0FKRTtBQU9SckIsTUFBQUEsS0FBSyxFQUFFO0FBQ0xxQixRQUFBQSxJQUFJLEVBQUU7QUFERCxPQVBDO0FBVVJwQixNQUFBQSxNQUFNLEVBQUU7QUFDTm9CLFFBQUFBLElBQUksRUFBRTtBQURBO0FBVkEsS0FGWjtBQWdCRUUsSUFBQUEsT0FBTyxFQUFFMUI7QUFoQlgsR0FmVztBQUZtQixDQUEzQjs7O0FBc0NQLFNBQVMyQixvQkFBVCxDQUE4QnRDLElBQTlCLEVBQW9DQyxLQUFwQyxFQUEyQ3NDLGdCQUEzQyxFQUE2RDtBQUFBLE1BQ3BEUixHQURvRCxHQUM3Q1EsZ0JBRDZDLENBQ3BEUixHQURvRDtBQUFBLE1BRXBESCxjQUZvRCxHQUVsQzNCLEtBRmtDLENBRXBEMkIsY0FGb0Q7QUFBQSxNQUdwREwsU0FIb0QsR0FHdkMsS0FBS1gsS0FIa0MsQ0FHcERXLFNBSG9EO0FBSzNELE1BQU1pQixXQUFXLEdBQUcsQ0FBQyxDQUFELEVBQUksa0JBQUlqQixTQUFTLENBQUNuQixJQUFkLEVBQW9Cd0IsY0FBcEIsQ0FBSixDQUFwQjs7QUFDQSxPQUFLYSxrQkFBTCxDQUF3QlYsR0FBeEIsRUFBNkI7QUFBQ1MsSUFBQUEsV0FBVyxFQUFYQTtBQUFELEdBQTdCO0FBQ0Q7O0FBRUQsSUFBTUUsc0JBQXNCLEdBQUcsQ0FDN0JDLG9DQUQ2QixFQUU3QjtBQUNFWixFQUFBQSxHQUFHLEVBQUUsUUFEUDtBQUVFYSxFQUFBQSxRQUFRLEVBQUUsV0FGWjtBQUdFQyxFQUFBQSxTQUFTLEVBQUUsQ0FIYjtBQUlFYixFQUFBQSxXQUFXLEVBQUUsQ0FDWDtBQUNFRCxJQUFBQSxHQUFHLEVBQUUsV0FEUDtBQUVFRSxJQUFBQSxRQUFRLEVBQUU7QUFDUmEsTUFBQUEsS0FBSyxFQUFFO0FBQ0xYLFFBQUFBLElBQUksRUFBRSxnQkFERDtBQUVMQyxRQUFBQSxhQUFhLEVBQUU7QUFGVjtBQURDLEtBRlo7QUFRRUMsSUFBQUEsT0FBTyxFQUFFQztBQVJYLEdBRFcsRUFXWDtBQUNFUCxJQUFBQSxHQUFHLEVBQUUsY0FEUDtBQUVFRSxJQUFBQSxRQUFRLEVBQUU7QUFDUmMsTUFBQUEsTUFBTSxFQUFFO0FBQUNaLFFBQUFBLElBQUksRUFBRTtBQUFQLE9BREE7QUFFUmEsTUFBQUEsS0FBSyxFQUFFO0FBQUNiLFFBQUFBLElBQUksRUFBRTtBQUFQLE9BRkM7QUFHUmMsTUFBQUEsU0FBUyxFQUFFO0FBQUNkLFFBQUFBLElBQUksRUFBRTtBQUFQO0FBSEgsS0FGWjtBQU9FRSxJQUFBQSxPQUFPLEVBQUVhO0FBUFgsR0FYVyxDQUpmO0FBeUJFQyxFQUFBQSxtQkFBbUIsRUFBRTNCLGlCQXpCdkI7QUEwQkU0QixFQUFBQSxjQUFjLEVBQUUsd0JBQUMzQixjQUFELEVBQWlCNUIsSUFBakIsRUFBdUI4QixVQUF2QixFQUFzQztBQUNwRCxRQUFNMEIsV0FBVyxHQUFHMUIsVUFBVSxDQUFDQyxjQUFYLENBQTBCL0IsSUFBMUIsQ0FBcEI7QUFDQSxXQUFPO0FBQUN3RCxNQUFBQSxXQUFXLEVBQVhBO0FBQUQsS0FBUDtBQUNEO0FBN0JILENBRjZCLENBQS9CO0FBbUNBLElBQU1DLFlBQVksR0FBRztBQUNuQmpFLEVBQUFBLGFBQWEsRUFBRUYsYUFESTtBQUVuQm9FLEVBQUFBLFdBQVcsRUFBRSxJQUZNO0FBR25CQyxFQUFBQSxVQUFVLEVBQUVDLGdDQUhPO0FBSW5CQyxFQUFBQSxjQUFjLEVBQUVDLDZCQUFZQyxRQUpUO0FBS25CQyxFQUFBQSxlQUFlLEVBQUVGLDZCQUFZRyxJQUxWO0FBTW5CQyxFQUFBQSxXQUFXLEVBQUV4RSxrQkFOTTtBQU9uQmMsRUFBQUEsV0FBVyxFQUFFO0FBQUMyRCxJQUFBQSxJQUFJLEVBQUUsVUFBUDtBQUFtQmxCLElBQUFBLEtBQUssRUFBRSxlQUFBbUIsQ0FBQztBQUFBLGFBQUlBLENBQUMsQ0FBQy9CLFFBQU47QUFBQTtBQUEzQixHQVBNO0FBUW5CZ0MsRUFBQUEsYUFBYSxFQUFFO0FBQUNGLElBQUFBLElBQUksRUFBRSxVQUFQO0FBQW1CbEIsSUFBQUEsS0FBSyxFQUFFckQ7QUFBMUIsR0FSSTtBQVNuQm1DLEVBQUFBLGNBQWMsRUFBRTtBQUFDb0MsSUFBQUEsSUFBSSxFQUFFLFVBQVA7QUFBbUJsQixJQUFBQSxLQUFLLEVBQUVsRDtBQUExQjtBQVRHLENBQXJCOztJQVlxQnVFLFk7Ozs7Ozs7Ozs7OztXQUNuQiwyQkFBa0I7QUFDaEIsVUFBTUMsYUFBYSxHQUFHLElBQUlDLHlCQUFKLENBQWtCO0FBQ3RDbkUsUUFBQUEsV0FBVyxFQUFFNEIsa0JBRHlCO0FBRXRDd0MsUUFBQUEsVUFBVSxFQUFFNUI7QUFGMEIsT0FBbEIsQ0FBdEI7QUFLQSxXQUFLOUIsS0FBTCxHQUFhO0FBQ1h3RCxRQUFBQSxhQUFhLEVBQWJBLGFBRFc7QUFFWEcsUUFBQUEsZUFBZSxFQUFFSCxhQUFhLENBQUN4RDtBQUZwQixPQUFiO0FBSUEsVUFBTTRELGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLEVBQXpCO0FBQ0FELE1BQUFBLGdCQUFnQixDQUFDRSxHQUFqQixDQUFxQjtBQUNuQkMsUUFBQUEsU0FBUyxFQUFFO0FBQUNDLFVBQUFBLElBQUksRUFBRSxDQUFQO0FBQVVoQyxVQUFBQSxRQUFRLEVBQUU7QUFBcEI7QUFEUSxPQUFyQjtBQUdEOzs7V0FFRCw0QkFBNEM7QUFBQSxVQUEvQmlDLFFBQStCLFNBQS9CQSxRQUErQjtBQUFBLFVBQXJCNUUsS0FBcUIsU0FBckJBLEtBQXFCO0FBQUEsVUFBZDZFLFdBQWMsU0FBZEEsV0FBYztBQUMxQyxXQUFLcEUsUUFBTCxDQUFjO0FBQ1o7QUFDQTZELFFBQUFBLGVBQWUsRUFBRSxLQUFLM0QsS0FBTCxDQUFXd0QsYUFBWCxDQUF5QlcsV0FBekIsQ0FDZjtBQUFDRixVQUFBQSxRQUFRLEVBQVJBLFFBQUQ7QUFBVzVFLFVBQUFBLEtBQUssRUFBTEEsS0FBWDtBQUFrQjZFLFVBQUFBLFdBQVcsRUFBWEE7QUFBbEIsU0FEZSxFQUVmO0FBQ0UzRSxVQUFBQSxRQUFRLEVBQUUsS0FBSzZFLE9BQUwsQ0FBYTdFLFFBRHpCO0FBRUU4RSxVQUFBQSxVQUFVLEVBQUUsS0FBS0MsYUFBTCxFQUZkO0FBR0VDLFVBQUFBLFlBQVksRUFBRSxLQUFLQyxlQUFMLENBQXFCbkYsS0FBckI7QUFIaEIsU0FGZTtBQUZMLE9BQWQ7QUFXRDs7O1dBRUQsK0JBQXVCO0FBQUEsVUFBUG9GLElBQU8sU0FBUEEsSUFBTztBQUNyQixhQUFPLEtBQUt6RSxLQUFMLENBQVd3RCxhQUFYLENBQXlCaEIsY0FBekIsQ0FBd0M7QUFBQ2lDLFFBQUFBLElBQUksRUFBSkE7QUFBRCxPQUF4QyxFQUFnRCxLQUFLcEYsS0FBckQsQ0FBUDtBQUNEOzs7V0FFRCxzQ0FBNkI7QUFDM0IsYUFBTyxLQUFLVyxLQUFMLENBQVd3RCxhQUFYLENBQXlCa0IsaUJBQXpCLENBQTJDLEtBQUtyRixLQUFoRCxDQUFQO0FBQ0Q7OztXQUVELGlDQUF3QjtBQUN0QixhQUFPO0FBQ0xzRixRQUFBQSxTQUFTLEVBQUUsS0FBSzNFLEtBQUwsQ0FBV3dELGFBQVgsQ0FBeUJvQixXQUF6QixDQUFxQyxRQUFyQyxFQUErQyxLQUFLdkYsS0FBcEQsQ0FETjtBQUVMd0YsUUFBQUEsWUFBWSxFQUFFLEtBQUs3RSxLQUFMLENBQVd3RCxhQUFYLENBQXlCb0IsV0FBekIsQ0FBcUMsV0FBckMsRUFBa0QsS0FBS3ZGLEtBQXZEO0FBRlQsT0FBUDtBQUlEOzs7V0FFRCx3QkFBZTtBQUNiO0FBQ0E7QUFGYSx3QkFHYSxLQUFLQSxLQUhsQjtBQUFBLFVBR055RixFQUhNLGVBR05BLEVBSE07QUFBQSxVQUdGQyxXQUhFLGVBR0ZBLFdBSEU7QUFBQSxVQUlOdkIsYUFKTSxHQUlXLEtBQUt4RCxLQUpoQixDQUlOd0QsYUFKTSxFQU1iOztBQU5hLHlCQU84QyxLQUFLbkUsS0FQbkQ7QUFBQSxVQU9OMkYsT0FQTSxnQkFPTkEsT0FQTTtBQUFBLFVBT0dDLFFBUEgsZ0JBT0dBLFFBUEg7QUFBQSxVQU9hQyxhQVBiLGdCQU9hQSxhQVBiO0FBQUEsVUFPNEJDLGNBUDVCLGdCQU80QkEsY0FQNUI7O0FBUWIsVUFBTUMsY0FBYyxHQUFHLEtBQUtDLDBCQUFMLEVBQXZCOztBQUNBLFVBQU1DLFNBQVMsR0FBRyxLQUFLQyxxQkFBTCxFQUFsQjs7QUFFQSxVQUFNQyxhQUFhLEdBQUcsZ0RBQWtCLEtBQUtwQixPQUFMLENBQWE3RSxRQUEvQixDQUF0QjtBQUNBLFVBQU1rRyxjQUFjLEdBQUdELGFBQWEsQ0FBQ0MsY0FBZCxDQUE2QixDQUE3QixDQUF2QixDQVphLENBY2I7O0FBQ0EsYUFBTyxJQUFJQyx3QkFBSjtBQUNMWixRQUFBQSxFQUFFLFlBQUtBLEVBQUwsYUFERztBQUVMdEYsUUFBQUEsSUFBSSxFQUFFZ0UsYUFBYSxDQUFDeEQsS0FBZCxDQUFvQlcsU0FBcEIsQ0FBOEJuQixJQUYvQjtBQUdMdUYsUUFBQUEsV0FBVyxFQUFFVSxjQUFjLEdBQUdWLFdBSHpCO0FBSUxDLFFBQUFBLE9BQU8sRUFBUEEsT0FKSztBQUtMQyxRQUFBQSxRQUFRLEVBQVJBLFFBTEs7QUFNTEMsUUFBQUEsYUFBYSxFQUFiQSxhQU5LO0FBT0xDLFFBQUFBLGNBQWMsRUFBZEEsY0FQSztBQVFMQyxRQUFBQSxjQUFjLEVBQWRBO0FBUkssU0FTRkUsU0FURSxFQUFQO0FBV0Q7OztFQXhFdUNLLG9DOzs7QUEyRTFDcEMsWUFBWSxDQUFDcUMsU0FBYixHQUF5QixjQUF6QjtBQUNBckMsWUFBWSxDQUFDYixZQUFiLEdBQTRCQSxZQUE1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7U2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcbmltcG9ydCB7X0FnZ3JlZ2F0aW9uTGF5ZXIgYXMgQWdncmVnYXRpb25MYXllcn0gZnJvbSAnQGRlY2suZ2wvYWdncmVnYXRpb24tbGF5ZXJzJztcblxuaW1wb3J0IGdlb1ZpZXdwb3J0IGZyb20gJ0BtYXBib3gvZ2VvLXZpZXdwb3J0JztcbmltcG9ydCBDUFVBZ2dyZWdhdG9yLCB7XG4gIGRlZmF1bHRDb2xvckRpbWVuc2lvbixcbiAgZ2V0RGltZW5zaW9uU2NhbGVcbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY3B1LWFnZ3JlZ2F0b3InO1xuaW1wb3J0IHtnZXREaXN0YW5jZVNjYWxlc30gZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5pbXBvcnQge21heH0gZnJvbSAnZDMtYXJyYXknO1xuXG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQge1NDQUxFX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0RFRkFVTFRfQ09MT1JfUkFOR0V9IGZyb20gJ2NvbnN0YW50cy9jb2xvci1yYW5nZXMnO1xuaW1wb3J0IENsdXN0ZXJCdWlsZGVyLCB7Z2V0R2VvSlNPTn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY2x1c3Rlci11dGlscyc7XG5cbmNvbnN0IGRlZmF1bHRSYWRpdXMgPSBMQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzLmRlZmF1bHRWYWx1ZTtcbmNvbnN0IGRlZmF1bHRSYWRpdXNSYW5nZSA9IExBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXNSYW5nZS5kZWZhdWx0VmFsdWU7XG5cbmNvbnN0IGRlZmF1bHRHZXRDb2xvclZhbHVlID0gcG9pbnRzID0+IHBvaW50cy5sZW5ndGg7XG5jb25zdCBkZWZhdWx0R2V0UmFkaXVzVmFsdWUgPSBjZWxsID0+XG4gIGNlbGwuZmlsdGVyZWRQb2ludHMgPyBjZWxsLmZpbHRlcmVkUG9pbnRzLmxlbmd0aCA6IGNlbGwucG9pbnRzLmxlbmd0aDtcblxuZnVuY3Rpb24gcHJvY2Vzc0dlb0pTT04oc3RlcCwgcHJvcHMsIGFnZ3JlZ2F0aW9uLCB7dmlld3BvcnR9KSB7XG4gIGNvbnN0IHtkYXRhLCBnZXRQb3NpdGlvbiwgZmlsdGVyRGF0YX0gPSBwcm9wcztcbiAgY29uc3QgZ2VvSlNPTiA9IGdldEdlb0pTT04oZGF0YSwgZ2V0UG9zaXRpb24sIGZpbHRlckRhdGEpO1xuICBjb25zdCBjbHVzdGVyQnVpbGRlciA9IG5ldyBDbHVzdGVyQnVpbGRlcigpO1xuXG4gIHRoaXMuc2V0U3RhdGUoe2dlb0pTT04sIGNsdXN0ZXJCdWlsZGVyfSk7XG59XG5cbmZ1bmN0aW9uIGdldENsdXN0ZXJzKHN0ZXAsIHByb3BzLCBhZ2dyZWdhdGlvbiwge3ZpZXdwb3J0fSkge1xuICBjb25zdCB7Z2VvSlNPTiwgY2x1c3RlckJ1aWxkZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgY29uc3Qge2NsdXN0ZXJSYWRpdXMsIHpvb20sIHdpZHRoLCBoZWlnaHR9ID0gcHJvcHM7XG4gIGNvbnN0IHtsb25naXR1ZGUsIGxhdGl0dWRlfSA9IHZpZXdwb3J0O1xuXG4gIC8vIHpvb20gbmVlZHMgdG8gYmUgYW4gaW50ZWdlciBmb3IgdGhlIGRpZmZlcmVudCBtYXAgdXRpbHMuIEFsc28gaGVscHMgd2l0aCBjYWNoZSBrZXkuXG4gIGNvbnN0IGJib3ggPSBnZW9WaWV3cG9ydC5ib3VuZHMoW2xvbmdpdHVkZSwgbGF0aXR1ZGVdLCB6b29tLCBbd2lkdGgsIGhlaWdodF0pO1xuICBjb25zdCBjbHVzdGVycyA9IGNsdXN0ZXJCdWlsZGVyLmNsdXN0ZXJzQXRab29tKHtiYm94LCBjbHVzdGVyUmFkaXVzLCBnZW9KU09OLCB6b29tfSk7XG5cbiAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgbGF5ZXJEYXRhOiB7ZGF0YTogY2x1c3RlcnN9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRTdWJMYXllclJhZGl1cyhkaW1lbnNpb25TdGF0ZSwgZGltZW5zaW9uLCBsYXllclByb3BzKSB7XG4gIHJldHVybiBjZWxsID0+IHtcbiAgICBjb25zdCB7Z2V0UmFkaXVzVmFsdWV9ID0gbGF5ZXJQcm9wcztcbiAgICBjb25zdCB7c2NhbGVGdW5jfSA9IGRpbWVuc2lvblN0YXRlO1xuICAgIHJldHVybiBzY2FsZUZ1bmMoZ2V0UmFkaXVzVmFsdWUoY2VsbCkpO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2x1c3RlckFnZ3JlZ2F0aW9uID0ge1xuICBrZXk6ICdwb3NpdGlvbicsXG4gIHVwZGF0ZVN0ZXBzOiBbXG4gICAge1xuICAgICAga2V5OiAnZ2VvanNvbicsXG4gICAgICB0cmlnZ2Vyczoge1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHByb3A6ICdnZXRQb3NpdGlvbicsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcjogJ2dldFBvc2l0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJEYXRhOiB7XG4gICAgICAgICAgcHJvcDogJ2ZpbHRlckRhdGEnLFxuICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdmaWx0ZXJEYXRhJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdXBkYXRlcjogcHJvY2Vzc0dlb0pTT05cbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogJ2NsdXN0ZXJpbmcnLFxuICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgY2x1c3RlclJhZGl1czoge1xuICAgICAgICAgIHByb3A6ICdjbHVzdGVyUmFkaXVzJ1xuICAgICAgICB9LFxuICAgICAgICB6b29tOiB7XG4gICAgICAgICAgcHJvcDogJ3pvb20nXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgcHJvcDogJ3dpZHRoJ1xuICAgICAgICB9LFxuICAgICAgICBoZWlnaHQ6IHtcbiAgICAgICAgICBwcm9wOiAnaGVpZ2h0J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdXBkYXRlcjogZ2V0Q2x1c3RlcnNcbiAgICB9XG4gIF1cbn07XG5cbmZ1bmN0aW9uIGdldFJhZGl1c1ZhbHVlRG9tYWluKHN0ZXAsIHByb3BzLCBkaW1lbnNpb25VcGRhdGVyKSB7XG4gIGNvbnN0IHtrZXl9ID0gZGltZW5zaW9uVXBkYXRlcjtcbiAgY29uc3Qge2dldFJhZGl1c1ZhbHVlfSA9IHByb3BzO1xuICBjb25zdCB7bGF5ZXJEYXRhfSA9IHRoaXMuc3RhdGU7XG5cbiAgY29uc3QgdmFsdWVEb21haW4gPSBbMCwgbWF4KGxheWVyRGF0YS5kYXRhLCBnZXRSYWRpdXNWYWx1ZSldO1xuICB0aGlzLl9zZXREaW1lbnNpb25TdGF0ZShrZXksIHt2YWx1ZURvbWFpbn0pO1xufVxuXG5jb25zdCBjbHVzdGVyTGF5ZXJEaW1lbnNpb25zID0gW1xuICBkZWZhdWx0Q29sb3JEaW1lbnNpb24sXG4gIHtcbiAgICBrZXk6ICdyYWRpdXMnLFxuICAgIGFjY2Vzc29yOiAnZ2V0UmFkaXVzJyxcbiAgICBudWxsVmFsdWU6IDAsXG4gICAgdXBkYXRlU3RlcHM6IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiAnZ2V0RG9tYWluJyxcbiAgICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgcHJvcDogJ2dldFJhZGl1c1ZhbHVlJyxcbiAgICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdnZXRSYWRpdXNWYWx1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZXI6IGdldFJhZGl1c1ZhbHVlRG9tYWluXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdnZXRTY2FsZUZ1bmMnLFxuICAgICAgICB0cmlnZ2Vyczoge1xuICAgICAgICAgIGRvbWFpbjoge3Byb3A6ICdyYWRpdXNEb21haW4nfSxcbiAgICAgICAgICByYW5nZToge3Byb3A6ICdyYWRpdXNSYW5nZSd9LFxuICAgICAgICAgIHNjYWxlVHlwZToge3Byb3A6ICdyYWRpdXNTY2FsZVR5cGUnfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVyOiBnZXREaW1lbnNpb25TY2FsZVxuICAgICAgfVxuICAgIF0sXG4gICAgZ2V0U3ViTGF5ZXJBY2Nlc3NvcjogZ2V0U3ViTGF5ZXJSYWRpdXMsXG4gICAgZ2V0UGlja2luZ0luZm86IChkaW1lbnNpb25TdGF0ZSwgY2VsbCwgbGF5ZXJQcm9wcykgPT4ge1xuICAgICAgY29uc3QgcmFkaXVzVmFsdWUgPSBsYXllclByb3BzLmdldFJhZGl1c1ZhbHVlKGNlbGwpO1xuICAgICAgcmV0dXJuIHtyYWRpdXNWYWx1ZX07XG4gICAgfVxuICB9XG5dO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGNsdXN0ZXJSYWRpdXM6IGRlZmF1bHRSYWRpdXMsXG4gIGNvbG9yRG9tYWluOiBudWxsLFxuICBjb2xvclJhbmdlOiBERUZBVUxUX0NPTE9SX1JBTkdFLFxuICBjb2xvclNjYWxlVHlwZTogU0NBTEVfVFlQRVMucXVhbnRpemUsXG4gIHJhZGl1c1NjYWxlVHlwZTogU0NBTEVfVFlQRVMuc3FydCxcbiAgcmFkaXVzUmFuZ2U6IGRlZmF1bHRSYWRpdXNSYW5nZSxcbiAgZ2V0UG9zaXRpb246IHt0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogeCA9PiB4LnBvc2l0aW9ufSxcbiAgZ2V0Q29sb3JWYWx1ZToge3R5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiBkZWZhdWx0R2V0Q29sb3JWYWx1ZX0sXG4gIGdldFJhZGl1c1ZhbHVlOiB7dHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IGRlZmF1bHRHZXRSYWRpdXNWYWx1ZX1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJMYXllciBleHRlbmRzIEFnZ3JlZ2F0aW9uTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3QgY3B1QWdncmVnYXRvciA9IG5ldyBDUFVBZ2dyZWdhdG9yKHtcbiAgICAgIGFnZ3JlZ2F0aW9uOiBjbHVzdGVyQWdncmVnYXRpb24sXG4gICAgICBkaW1lbnNpb25zOiBjbHVzdGVyTGF5ZXJEaW1lbnNpb25zXG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3B1QWdncmVnYXRvcixcbiAgICAgIGFnZ3JlZ2F0b3JTdGF0ZTogY3B1QWdncmVnYXRvci5zdGF0ZVxuICAgIH07XG4gICAgY29uc3QgYXR0cmlidXRlTWFuYWdlciA9IHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkKHtcbiAgICAgIHBvc2l0aW9uczoge3NpemU6IDMsIGFjY2Vzc29yOiAnZ2V0UG9zaXRpb24nfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe29sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3N9KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAvLyBtYWtlIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgY3B1QWdncmVnYXRvciBmb3IgdGVzdGluZ1xuICAgICAgYWdncmVnYXRvclN0YXRlOiB0aGlzLnN0YXRlLmNwdUFnZ3JlZ2F0b3IudXBkYXRlU3RhdGUoXG4gICAgICAgIHtvbGRQcm9wcywgcHJvcHMsIGNoYW5nZUZsYWdzfSxcbiAgICAgICAge1xuICAgICAgICAgIHZpZXdwb3J0OiB0aGlzLmNvbnRleHQudmlld3BvcnQsXG4gICAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXRBdHRyaWJ1dGVzKCksXG4gICAgICAgICAgbnVtSW5zdGFuY2VzOiB0aGlzLmdldE51bUluc3RhbmNlcyhwcm9wcylcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGlja2luZ0luZm8oe2luZm99KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY3B1QWdncmVnYXRvci5nZXRQaWNraW5nSW5mbyh7aW5mb30sIHRoaXMucHJvcHMpO1xuICB9XG5cbiAgX2dldFN1YmxheWVyVXBkYXRlVHJpZ2dlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY3B1QWdncmVnYXRvci5nZXRVcGRhdGVUcmlnZ2Vycyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIF9nZXRTdWJMYXllckFjY2Vzc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UmFkaXVzOiB0aGlzLnN0YXRlLmNwdUFnZ3JlZ2F0b3IuZ2V0QWNjZXNzb3IoJ3JhZGl1cycsIHRoaXMucHJvcHMpLFxuICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLnN0YXRlLmNwdUFnZ3JlZ2F0b3IuZ2V0QWNjZXNzb3IoJ2ZpbGxDb2xvcicsIHRoaXMucHJvcHMpXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICAvLyBmb3Igc3ViY2xhc3NpbmcsIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIHJldHVyblxuICAgIC8vIGN1c3RvbWl6ZWQgc3ViIGxheWVyIHByb3BzXG4gICAgY29uc3Qge2lkLCByYWRpdXNTY2FsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjcHVBZ2dyZWdhdG9yfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAvLyBiYXNlIGxheWVyIHByb3BzXG4gICAgY29uc3Qge29wYWNpdHksIHBpY2thYmxlLCBhdXRvSGlnaGxpZ2h0LCBoaWdobGlnaHRDb2xvcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0gdGhpcy5fZ2V0U3VibGF5ZXJVcGRhdGVUcmlnZ2VycygpO1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldFN1YkxheWVyQWNjZXNzb3JzKCk7XG5cbiAgICBjb25zdCBkaXN0YW5jZVNjYWxlID0gZ2V0RGlzdGFuY2VTY2FsZXModGhpcy5jb250ZXh0LnZpZXdwb3J0KTtcbiAgICBjb25zdCBtZXRlcnNQZXJQaXhlbCA9IGRpc3RhbmNlU2NhbGUubWV0ZXJzUGVyUGl4ZWxbMF07XG5cbiAgICAvLyByZXR1cm4gcHJvcHMgdG8gdGhlIHN1YmxheWVyIGNvbnN0cnVjdG9yXG4gICAgcmV0dXJuIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgIGlkOiBgJHtpZH0tY2x1c3RlcmAsXG4gICAgICBkYXRhOiBjcHVBZ2dyZWdhdG9yLnN0YXRlLmxheWVyRGF0YS5kYXRhLFxuICAgICAgcmFkaXVzU2NhbGU6IG1ldGVyc1BlclBpeGVsICogcmFkaXVzU2NhbGUsXG4gICAgICBvcGFjaXR5LFxuICAgICAgcGlja2FibGUsXG4gICAgICBhdXRvSGlnaGxpZ2h0LFxuICAgICAgaGlnaGxpZ2h0Q29sb3IsXG4gICAgICB1cGRhdGVUcmlnZ2VycyxcbiAgICAgIC4uLmFjY2Vzc29yc1xuICAgIH0pO1xuICB9XG59XG5cbkNsdXN0ZXJMYXllci5sYXllck5hbWUgPSAnQ2x1c3RlckxheWVyJztcbkNsdXN0ZXJMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=