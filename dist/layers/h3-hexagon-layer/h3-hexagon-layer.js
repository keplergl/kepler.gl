"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.HexagonIdVisConfigs = exports.defaultCoverage = exports.defaultElevation = exports.hexIdAccessor = exports.hexIdRequiredColumns = exports.HEXAGON_ID_FIELDS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _layers = require("@deck.gl/layers");

var _geoLayers = require("@deck.gl/geo-layers");

var _enhancedColumnLayer = _interopRequireDefault(require("../../deckgl-layers/column-layer/enhanced-column-layer"));

var _h3Utils = require("./h3-utils");

var _h3HexagonLayerIcon = _interopRequireDefault(require("./h3-hexagon-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _colorUtils = require("../../utils/color-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_LINE_SCALE_VALUE = 8;
var HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id', 'h3_id']
};
exports.HEXAGON_ID_FIELDS = HEXAGON_ID_FIELDS;
var hexIdRequiredColumns = ['hex_id'];
exports.hexIdRequiredColumns = hexIdRequiredColumns;

var hexIdAccessor = function hexIdAccessor(_ref) {
  var hex_id = _ref.hex_id;
  return function (d) {
    return d.data[hex_id.fieldIdx];
  };
};

exports.hexIdAccessor = hexIdAccessor;
var defaultElevation = 500;
exports.defaultElevation = defaultElevation;
var defaultCoverage = 1;
exports.defaultCoverage = defaultCoverage;
var HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  coverage: 'coverage',
  enable3d: 'enable3d',
  sizeRange: 'elevationRange',
  coverageRange: 'coverageRange',
  elevationScale: 'elevationScale'
};
exports.HexagonIdVisConfigs = HexagonIdVisConfigs;

var HexagonIdLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(HexagonIdLayer, _Layer);

  function HexagonIdLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, HexagonIdLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(HexagonIdLayer).call(this, props));

    _this.registerVisConfig(HexagonIdVisConfigs);

    _this.getPositionAccessor = function () {
      return hexIdAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(HexagonIdLayer, [{
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HexagonIdLayer.prototype), "getDefaultLayerConfig", this).call(this, props), {
        // add height visual channel
        coverageField: null,
        coverageDomain: [0, 1],
        coverageScale: 'linear'
      });
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getHexId) {
      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var id = getHexId({
          data: allData[index]
        });
        var centroid = this.dataToFeature.centroids[index];

        if (centroid) {
          data.push({
            // keep a reference to the original data index
            index: index,
            data: allData[index],
            id: id,
            centroid: centroid
          });
        }
      }

      return data;
    } // TODO: fix complexity

    /* eslint-disable complexity */

  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var _this2 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorDomain = _this$config.colorDomain,
          colorField = _this$config.colorField,
          color = _this$config.color,
          sizeField = _this$config.sizeField,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          coverageField = _this$config.coverageField,
          coverageScale = _this$config.coverageScale,
          coverageDomain = _this$config.coverageDomain,
          _this$config$visConfi = _this$config.visConfig,
          sizeRange = _this$config$visConfi.sizeRange,
          colorRange = _this$config$visConfi.colorRange,
          coverageRange = _this$config$visConfi.coverageRange,
          enable3d = _this$config$visConfi.enable3d;
      var gpuFilter = datasets[this.config.dataId].gpuFilter;
      var getHexId = this.getPositionAccessor();

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data; // color


      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(function (c) {
        return (0, _colorUtils.hexToRgb)(c);
      })); // height

      var sScale = sizeField && enable3d && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange, 0); // coverage

      var coScale = coverageField && this.getVisChannelScale(coverageScale, coverageDomain, coverageRange, 0);
      var getElevation = sScale ? function (d) {
        return _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0);
      } : defaultElevation;
      var getFillColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;
      var getCoverage = coScale ? function (d) {
        return _this2.getEncodedChannelValue(coScale, d.data, coverageField, 0);
      } : defaultCoverage;
      return {
        data: data,
        getElevation: getElevation,
        getFillColor: getFillColor,
        getHexId: getHexId,
        getCoverage: getCoverage,
        getFilterValue: gpuFilter.filterValueAccessor()
      };
    }
    /* eslint-enable complexity */

  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getHexId) {
      var centroids = allData.map(function (d, index) {
        var id = getHexId({
          data: d
        });

        if (!(0, _h3Utils.h3IsValid)(id)) {
          return null;
        } // save a reference of centroids to dataToFeature
        // so we don't have to re calculate it again


        return (0, _h3Utils.getCentroid)({
          id: id
        });
      });
      var bounds = this.getPointsBounds(centroids);
      this.dataToFeature = {
        centroids: centroids
      };
      this.updateMeta({
        bounds: bounds
      });
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState;
      var zoomFactor = this.getZoomFactor(mapState);
      var eleZoomFactor = this.getElevationZoomFactor(mapState);
      var config = this.config;
      var visConfig = config.visConfig;
      var h3HexagonLayerTriggers = {
        getFillColor: {
          color: config.color,
          colorField: config.colorField,
          colorRange: visConfig.colorRange,
          colorScale: config.colorScale
        },
        getElevation: {
          sizeField: config.sizeField,
          sizeRange: visConfig.sizeRange,
          sizeScale: config.sizeScale,
          enable3d: visConfig.enable3d
        },
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      var columnLayerTriggers = {
        getCoverage: {
          coverageField: config.coverageField,
          coverageRange: visConfig.coverageRange
        }
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      return [new _geoLayers.H3HexagonLayer(_objectSpread({}, defaultLayerProps, {}, data, {
        wrapLongitude: false,
        getHexagon: function getHexagon(x) {
          return x.id;
        },
        // coverage
        coverage: config.coverageField ? 1 : visConfig.coverage,
        // highlight
        autoHighlight: visConfig.enable3d,
        highlightColor: _defaultSettings.HIGHLIGH_COLOR_3D,
        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        // render
        updateTriggers: h3HexagonLayerTriggers,
        _subLayerProps: {
          'hexagon-cell': {
            type: _enhancedColumnLayer["default"],
            getCoverage: data.getCoverage,
            updateTriggers: columnLayerTriggers
          }
        }
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) && !config.sizeField ? [new _layers.GeoJsonLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {
        data: [(0, _h3Utils.idToPolygonGeo)(objectHovered)],
        getLineColor: config.highlightColor,
        lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
        wrapLongitude: false
      }))] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'hexagonId';
    }
  }, {
    key: "name",
    get: function get() {
      return 'H3';
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return hexIdRequiredColumns;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      // use hexagon layer icon for now
      return _h3HexagonLayerIcon["default"];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HexagonIdLayer.prototype), "visualChannels", this), {
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HexagonIdLayer.prototype), "visualChannels", this).size, {
          property: 'height'
        }),
        coverage: {
          property: 'coverage',
          field: 'coverageField',
          scale: 'coverageScale',
          domain: 'coverageDomain',
          range: 'coverageRange',
          key: 'coverage',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.radius
        }
      });
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fields = _ref3.fields,
          fields = _ref3$fields === void 0 ? [] : _ref3$fields;
      var foundColumns = this.findDefaultColumnField(HEXAGON_ID_FIELDS, fields);

      if (!foundColumns || !foundColumns.length) {
        return {
          props: []
        };
      }

      return {
        props: foundColumns.map(function (columns) {
          return {
            isVisible: true,
            label: 'H3 Hexagon',
            columns: columns
          };
        })
      };
    }
  }]);
  return HexagonIdLayer;
}(_baseLayer["default"]);

exports["default"] = HexagonIdLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTElORV9TQ0FMRV9WQUxVRSIsIkhFWEFHT05fSURfRklFTERTIiwiaGV4X2lkIiwiaGV4SWRSZXF1aXJlZENvbHVtbnMiLCJoZXhJZEFjY2Vzc29yIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsImRlZmF1bHRFbGV2YXRpb24iLCJkZWZhdWx0Q292ZXJhZ2UiLCJIZXhhZ29uSWRWaXNDb25maWdzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJjb3ZlcmFnZSIsImVuYWJsZTNkIiwic2l6ZVJhbmdlIiwiY292ZXJhZ2VSYW5nZSIsImVsZXZhdGlvblNjYWxlIiwiSGV4YWdvbklkTGF5ZXIiLCJwcm9wcyIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb25BY2Nlc3NvciIsImNvbmZpZyIsImNvbHVtbnMiLCJjb3ZlcmFnZUZpZWxkIiwiY292ZXJhZ2VEb21haW4iLCJjb3ZlcmFnZVNjYWxlIiwiZ2V0SGV4SWQiLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsImkiLCJsZW5ndGgiLCJpbmRleCIsImlkIiwiY2VudHJvaWQiLCJkYXRhVG9GZWF0dXJlIiwiY2VudHJvaWRzIiwicHVzaCIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInZpc0NvbmZpZyIsImdwdUZpbHRlciIsImRhdGFJZCIsInVwZGF0ZURhdGEiLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJjIiwic1NjYWxlIiwiY29TY2FsZSIsImdldEVsZXZhdGlvbiIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRGaWxsQ29sb3IiLCJnZXRDb3ZlcmFnZSIsImdldEZpbHRlclZhbHVlIiwiZmlsdGVyVmFsdWVBY2Nlc3NvciIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsInVwZGF0ZU1ldGEiLCJvcHRzIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJlbGVab29tRmFjdG9yIiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsImgzSGV4YWdvbkxheWVyVHJpZ2dlcnMiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiY29sdW1uTGF5ZXJUcmlnZ2VycyIsImRlZmF1bHRMYXllclByb3BzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwiSDNIZXhhZ29uTGF5ZXIiLCJ3cmFwTG9uZ2l0dWRlIiwiZ2V0SGV4YWdvbiIsIngiLCJhdXRvSGlnaGxpZ2h0IiwiaGlnaGxpZ2h0Q29sb3IiLCJISUdITElHSF9DT0xPUl8zRCIsImV4dHJ1ZGVkIiwidXBkYXRlVHJpZ2dlcnMiLCJfc3ViTGF5ZXJQcm9wcyIsInR5cGUiLCJFbmhhbmNlZENvbHVtbkxheWVyIiwiaXNMYXllckhvdmVyZWQiLCJHZW9Kc29uTGF5ZXIiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwiZ2V0TGluZUNvbG9yIiwibGluZVdpZHRoU2NhbGUiLCJIM0hleGFnb25MYXllckljb24iLCJzaXplIiwicHJvcGVydHkiLCJmaWVsZCIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIiwiQ0hBTk5FTF9TQ0FMRVMiLCJyYWRpdXMiLCJmaWVsZHMiLCJmb3VuZENvbHVtbnMiLCJmaW5kRGVmYXVsdENvbHVtbkZpZWxkIiwiaXNWaXNpYmxlIiwibGFiZWwiLCJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsd0JBQXdCLEdBQUcsQ0FBakM7QUFFTyxJQUFNQyxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsTUFBTSxFQUFFLENBQUMsUUFBRCxFQUFXLFlBQVgsRUFBeUIsT0FBekI7QUFEdUIsQ0FBMUI7O0FBSUEsSUFBTUMsb0JBQW9CLEdBQUcsQ0FBQyxRQUFELENBQTdCOzs7QUFDQSxJQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRUYsTUFBRixRQUFFQSxNQUFGO0FBQUEsU0FBYyxVQUFBRyxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDQyxJQUFGLENBQU9KLE1BQU0sQ0FBQ0ssUUFBZCxDQUFKO0FBQUEsR0FBZjtBQUFBLENBQXRCOzs7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxHQUF6Qjs7QUFDQSxJQUFNQyxlQUFlLEdBQUcsQ0FBeEI7O0FBRUEsSUFBTUMsbUJBQW1CLEdBQUc7QUFDakNDLEVBQUFBLE9BQU8sRUFBRSxTQUR3QjtBQUVqQ0MsRUFBQUEsVUFBVSxFQUFFLFlBRnFCO0FBR2pDQyxFQUFBQSxRQUFRLEVBQUUsVUFIdUI7QUFJakNDLEVBQUFBLFFBQVEsRUFBRSxVQUp1QjtBQUtqQ0MsRUFBQUEsU0FBUyxFQUFFLGdCQUxzQjtBQU1qQ0MsRUFBQUEsYUFBYSxFQUFFLGVBTmtCO0FBT2pDQyxFQUFBQSxjQUFjLEVBQUU7QUFQaUIsQ0FBNUI7OztJQVVjQyxjOzs7OztBQUNuQiwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLDBIQUFNQSxLQUFOOztBQUNBLFVBQUtDLGlCQUFMLENBQXVCVixtQkFBdkI7O0FBQ0EsVUFBS1csbUJBQUwsR0FBMkI7QUFBQSxhQUFNakIsYUFBYSxDQUFDLE1BQUtrQixNQUFMLENBQVlDLE9BQWIsQ0FBbkI7QUFBQSxLQUEzQjs7QUFIaUI7QUFJbEI7Ozs7NENBcURpQztBQUFBLFVBQVpKLEtBQVksdUVBQUosRUFBSTtBQUNoQywySkFDaUNBLEtBRGpDO0FBR0U7QUFDQUssUUFBQUEsYUFBYSxFQUFFLElBSmpCO0FBS0VDLFFBQUFBLGNBQWMsRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBTGxCO0FBTUVDLFFBQUFBLGFBQWEsRUFBRTtBQU5qQjtBQVFEOzs7a0RBRWdEQyxRLEVBQVU7QUFBQSxVQUFuQ0MsT0FBbUMsU0FBbkNBLE9BQW1DO0FBQUEsVUFBMUJDLGFBQTBCLFNBQTFCQSxhQUEwQjtBQUN6RCxVQUFNdkIsSUFBSSxHQUFHLEVBQWI7O0FBRUEsV0FBSyxJQUFJd0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsYUFBYSxDQUFDRSxNQUFsQyxFQUEwQ0QsQ0FBQyxFQUEzQyxFQUErQztBQUM3QyxZQUFNRSxLQUFLLEdBQUdILGFBQWEsQ0FBQ0MsQ0FBRCxDQUEzQjtBQUNBLFlBQU1HLEVBQUUsR0FBR04sUUFBUSxDQUFDO0FBQUNyQixVQUFBQSxJQUFJLEVBQUVzQixPQUFPLENBQUNJLEtBQUQ7QUFBZCxTQUFELENBQW5CO0FBQ0EsWUFBTUUsUUFBUSxHQUFHLEtBQUtDLGFBQUwsQ0FBbUJDLFNBQW5CLENBQTZCSixLQUE3QixDQUFqQjs7QUFFQSxZQUFJRSxRQUFKLEVBQWM7QUFDWjVCLFVBQUFBLElBQUksQ0FBQytCLElBQUwsQ0FBVTtBQUNSO0FBQ0FMLFlBQUFBLEtBQUssRUFBTEEsS0FGUTtBQUdSMUIsWUFBQUEsSUFBSSxFQUFFc0IsT0FBTyxDQUFDSSxLQUFELENBSEw7QUFJUkMsWUFBQUEsRUFBRSxFQUFGQSxFQUpRO0FBS1JDLFlBQUFBLFFBQVEsRUFBUkE7QUFMUSxXQUFWO0FBT0Q7QUFDRjs7QUFDRCxhQUFPNUIsSUFBUDtBQUNELEssQ0FFRDs7QUFDQTs7OztvQ0FDZ0JnQyxRLEVBQVVDLFksRUFBd0I7QUFBQTs7QUFBQSxVQUFWQyxHQUFVLHVFQUFKLEVBQUk7QUFBQSx5QkFhNUMsS0FBS2xCLE1BYnVDO0FBQUEsVUFFOUNtQixVQUY4QyxnQkFFOUNBLFVBRjhDO0FBQUEsVUFHOUNDLFdBSDhDLGdCQUc5Q0EsV0FIOEM7QUFBQSxVQUk5Q0MsVUFKOEMsZ0JBSTlDQSxVQUo4QztBQUFBLFVBSzlDQyxLQUw4QyxnQkFLOUNBLEtBTDhDO0FBQUEsVUFNOUNDLFNBTjhDLGdCQU05Q0EsU0FOOEM7QUFBQSxVQU85Q0MsU0FQOEMsZ0JBTzlDQSxTQVA4QztBQUFBLFVBUTlDQyxVQVI4QyxnQkFROUNBLFVBUjhDO0FBQUEsVUFTOUN2QixhQVQ4QyxnQkFTOUNBLGFBVDhDO0FBQUEsVUFVOUNFLGFBVjhDLGdCQVU5Q0EsYUFWOEM7QUFBQSxVQVc5Q0QsY0FYOEMsZ0JBVzlDQSxjQVg4QztBQUFBLCtDQVk5Q3VCLFNBWjhDO0FBQUEsVUFZbENqQyxTQVprQyx5QkFZbENBLFNBWmtDO0FBQUEsVUFZdkJILFVBWnVCLHlCQVl2QkEsVUFadUI7QUFBQSxVQVlYSSxhQVpXLHlCQVlYQSxhQVpXO0FBQUEsVUFZSUYsUUFaSix5QkFZSUEsUUFaSjtBQUFBLFVBZXpDbUMsU0FmeUMsR0FlNUJYLFFBQVEsQ0FBQyxLQUFLaEIsTUFBTCxDQUFZNEIsTUFBYixDQWZvQixDQWV6Q0QsU0FmeUM7QUFnQmhELFVBQU10QixRQUFRLEdBQUcsS0FBS04sbUJBQUwsRUFBakI7O0FBaEJnRCw2QkFpQmpDLEtBQUs4QixVQUFMLENBQWdCYixRQUFoQixFQUEwQkMsWUFBMUIsQ0FqQmlDO0FBQUEsVUFpQnpDakMsSUFqQnlDLG9CQWlCekNBLElBakJ5QyxFQWtCaEQ7OztBQUNBLFVBQU04QyxNQUFNLEdBQ1ZULFVBQVUsSUFDVixLQUFLVSxrQkFBTCxDQUNFWixVQURGLEVBRUVDLFdBRkYsRUFHRTlCLFVBQVUsQ0FBQzBDLE1BQVgsQ0FBa0JDLEdBQWxCLENBQXNCLFVBQUFDLENBQUM7QUFBQSxlQUFJLDBCQUFTQSxDQUFULENBQUo7QUFBQSxPQUF2QixDQUhGLENBRkYsQ0FuQmdELENBMkJoRDs7QUFDQSxVQUFNQyxNQUFNLEdBQ1ZaLFNBQVMsSUFBSS9CLFFBQWIsSUFBeUIsS0FBS3VDLGtCQUFMLENBQXdCUCxTQUF4QixFQUFtQ0MsVUFBbkMsRUFBK0NoQyxTQUEvQyxFQUEwRCxDQUExRCxDQUQzQixDQTVCZ0QsQ0ErQmhEOztBQUNBLFVBQU0yQyxPQUFPLEdBQ1hsQyxhQUFhLElBQUksS0FBSzZCLGtCQUFMLENBQXdCM0IsYUFBeEIsRUFBdUNELGNBQXZDLEVBQXVEVCxhQUF2RCxFQUFzRSxDQUF0RSxDQURuQjtBQUdBLFVBQU0yQyxZQUFZLEdBQUdGLE1BQU0sR0FDdkIsVUFBQXBELENBQUM7QUFBQSxlQUFJLE1BQUksQ0FBQ3VELHNCQUFMLENBQTRCSCxNQUE1QixFQUFvQ3BELENBQUMsQ0FBQ0MsSUFBdEMsRUFBNEN1QyxTQUE1QyxFQUF1RCxDQUF2RCxDQUFKO0FBQUEsT0FEc0IsR0FFdkJyQyxnQkFGSjtBQUlBLFVBQU1xRCxZQUFZLEdBQUdULE1BQU0sR0FDdkIsVUFBQS9DLENBQUM7QUFBQSxlQUFJLE1BQUksQ0FBQ3VELHNCQUFMLENBQTRCUixNQUE1QixFQUFvQy9DLENBQUMsQ0FBQ0MsSUFBdEMsRUFBNENxQyxVQUE1QyxDQUFKO0FBQUEsT0FEc0IsR0FFdkJDLEtBRko7QUFJQSxVQUFNa0IsV0FBVyxHQUFHSixPQUFPLEdBQ3ZCLFVBQUFyRCxDQUFDO0FBQUEsZUFBSSxNQUFJLENBQUN1RCxzQkFBTCxDQUE0QkYsT0FBNUIsRUFBcUNyRCxDQUFDLENBQUNDLElBQXZDLEVBQTZDa0IsYUFBN0MsRUFBNEQsQ0FBNUQsQ0FBSjtBQUFBLE9BRHNCLEdBRXZCZixlQUZKO0FBSUEsYUFBTztBQUNMSCxRQUFBQSxJQUFJLEVBQUpBLElBREs7QUFFTHFELFFBQUFBLFlBQVksRUFBWkEsWUFGSztBQUdMRSxRQUFBQSxZQUFZLEVBQVpBLFlBSEs7QUFJTGxDLFFBQUFBLFFBQVEsRUFBUkEsUUFKSztBQUtMbUMsUUFBQUEsV0FBVyxFQUFYQSxXQUxLO0FBTUxDLFFBQUFBLGNBQWMsRUFBRWQsU0FBUyxDQUFDZSxtQkFBVjtBQU5YLE9BQVA7QUFRRDtBQUNEOzs7O29DQUVnQnBDLE8sRUFBU0QsUSxFQUFVO0FBQ2pDLFVBQU1TLFNBQVMsR0FBR1IsT0FBTyxDQUFDMkIsR0FBUixDQUFZLFVBQUNsRCxDQUFELEVBQUkyQixLQUFKLEVBQWM7QUFDMUMsWUFBTUMsRUFBRSxHQUFHTixRQUFRLENBQUM7QUFBQ3JCLFVBQUFBLElBQUksRUFBRUQ7QUFBUCxTQUFELENBQW5COztBQUNBLFlBQUksQ0FBQyx3QkFBVTRCLEVBQVYsQ0FBTCxFQUFvQjtBQUNsQixpQkFBTyxJQUFQO0FBQ0QsU0FKeUMsQ0FLMUM7QUFDQTs7O0FBQ0EsZUFBTywwQkFBWTtBQUFDQSxVQUFBQSxFQUFFLEVBQUZBO0FBQUQsU0FBWixDQUFQO0FBQ0QsT0FSaUIsQ0FBbEI7QUFVQSxVQUFNZ0MsTUFBTSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUI5QixTQUFyQixDQUFmO0FBQ0EsV0FBS0QsYUFBTCxHQUFxQjtBQUFDQyxRQUFBQSxTQUFTLEVBQVRBO0FBQUQsT0FBckI7QUFDQSxXQUFLK0IsVUFBTCxDQUFnQjtBQUFDRixRQUFBQSxNQUFNLEVBQU5BO0FBQUQsT0FBaEI7QUFDRDs7O2dDQUVXRyxJLEVBQU07QUFBQSxVQUNUOUQsSUFEUyxHQUNtQzhELElBRG5DLENBQ1Q5RCxJQURTO0FBQUEsVUFDSDJDLFNBREcsR0FDbUNtQixJQURuQyxDQUNIbkIsU0FERztBQUFBLFVBQ1FvQixhQURSLEdBQ21DRCxJQURuQyxDQUNRQyxhQURSO0FBQUEsVUFDdUJDLFFBRHZCLEdBQ21DRixJQURuQyxDQUN1QkUsUUFEdkI7QUFHaEIsVUFBTUMsVUFBVSxHQUFHLEtBQUtDLGFBQUwsQ0FBbUJGLFFBQW5CLENBQW5CO0FBQ0EsVUFBTUcsYUFBYSxHQUFHLEtBQUtDLHNCQUFMLENBQTRCSixRQUE1QixDQUF0QjtBQUpnQixVQUtUaEQsTUFMUyxHQUtDLElBTEQsQ0FLVEEsTUFMUztBQUFBLFVBTVQwQixTQU5TLEdBTUkxQixNQU5KLENBTVQwQixTQU5TO0FBUWhCLFVBQU0yQixzQkFBc0IsR0FBRztBQUM3QmQsUUFBQUEsWUFBWSxFQUFFO0FBQ1pqQixVQUFBQSxLQUFLLEVBQUV0QixNQUFNLENBQUNzQixLQURGO0FBRVpELFVBQUFBLFVBQVUsRUFBRXJCLE1BQU0sQ0FBQ3FCLFVBRlA7QUFHWi9CLFVBQUFBLFVBQVUsRUFBRW9DLFNBQVMsQ0FBQ3BDLFVBSFY7QUFJWjZCLFVBQUFBLFVBQVUsRUFBRW5CLE1BQU0sQ0FBQ21CO0FBSlAsU0FEZTtBQU83QmtCLFFBQUFBLFlBQVksRUFBRTtBQUNaZCxVQUFBQSxTQUFTLEVBQUV2QixNQUFNLENBQUN1QixTQUROO0FBRVo5QixVQUFBQSxTQUFTLEVBQUVpQyxTQUFTLENBQUNqQyxTQUZUO0FBR1orQixVQUFBQSxTQUFTLEVBQUV4QixNQUFNLENBQUN3QixTQUhOO0FBSVpoQyxVQUFBQSxRQUFRLEVBQUVrQyxTQUFTLENBQUNsQztBQUpSLFNBUGU7QUFhN0JpRCxRQUFBQSxjQUFjLEVBQUVkLFNBQVMsQ0FBQzJCO0FBYkcsT0FBL0I7QUFnQkEsVUFBTUMsbUJBQW1CLEdBQUc7QUFDMUJmLFFBQUFBLFdBQVcsRUFBRTtBQUNYdEMsVUFBQUEsYUFBYSxFQUFFRixNQUFNLENBQUNFLGFBRFg7QUFFWFIsVUFBQUEsYUFBYSxFQUFFZ0MsU0FBUyxDQUFDaEM7QUFGZDtBQURhLE9BQTVCO0FBT0EsVUFBTThELGlCQUFpQixHQUFHLEtBQUtDLHdCQUFMLENBQThCWCxJQUE5QixDQUExQjtBQUVBLGNBQ0UsSUFBSVkseUJBQUosbUJBQ0tGLGlCQURMLE1BRUt4RSxJQUZMO0FBR0UyRSxRQUFBQSxhQUFhLEVBQUUsS0FIakI7QUFLRUMsUUFBQUEsVUFBVSxFQUFFLG9CQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ2xELEVBQU47QUFBQSxTQUxmO0FBT0U7QUFDQXBCLFFBQUFBLFFBQVEsRUFBRVMsTUFBTSxDQUFDRSxhQUFQLEdBQXVCLENBQXZCLEdBQTJCd0IsU0FBUyxDQUFDbkMsUUFSakQ7QUFVRTtBQUNBdUUsUUFBQUEsYUFBYSxFQUFFcEMsU0FBUyxDQUFDbEMsUUFYM0I7QUFZRXVFLFFBQUFBLGNBQWMsRUFBRUMsa0NBWmxCO0FBY0U7QUFDQUMsUUFBQUEsUUFBUSxFQUFFdkMsU0FBUyxDQUFDbEMsUUFmdEI7QUFnQkVHLFFBQUFBLGNBQWMsRUFBRStCLFNBQVMsQ0FBQy9CLGNBQVYsR0FBMkJ3RCxhQWhCN0M7QUFrQkU7QUFDQWUsUUFBQUEsY0FBYyxFQUFFYixzQkFuQmxCO0FBb0JFYyxRQUFBQSxjQUFjLEVBQUU7QUFDZCwwQkFBZ0I7QUFDZEMsWUFBQUEsSUFBSSxFQUFFQywrQkFEUTtBQUVkN0IsWUFBQUEsV0FBVyxFQUFFeEQsSUFBSSxDQUFDd0QsV0FGSjtBQUdkMEIsWUFBQUEsY0FBYyxFQUFFWDtBQUhGO0FBREY7QUFwQmxCLFNBREYsNkNBNkJNLEtBQUtlLGNBQUwsQ0FBb0J2QixhQUFwQixLQUFzQyxDQUFDL0MsTUFBTSxDQUFDdUIsU0FBOUMsR0FDQSxDQUNFLElBQUlnRCxvQkFBSixtQkFDSyxLQUFLQyx5QkFBTCxFQURMO0FBRUV4RixRQUFBQSxJQUFJLEVBQUUsQ0FBQyw2QkFBZStELGFBQWYsQ0FBRCxDQUZSO0FBR0UwQixRQUFBQSxZQUFZLEVBQUV6RSxNQUFNLENBQUMrRCxjQUh2QjtBQUlFVyxRQUFBQSxjQUFjLEVBQUVoRyx3QkFBd0IsR0FBR3VFLFVBSjdDO0FBS0VVLFFBQUFBLGFBQWEsRUFBRTtBQUxqQixTQURGLENBREEsR0FVQSxFQXZDTjtBQXlDRDs7O3dCQXpPVTtBQUNULGFBQU8sV0FBUDtBQUNEOzs7d0JBRVU7QUFDVCxhQUFPLElBQVA7QUFDRDs7O3dCQUUwQjtBQUN6QixhQUFPOUUsb0JBQVA7QUFDRDs7O3dCQUVlO0FBQ2Q7QUFDQSxhQUFPOEYsOEJBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQjtBQUVFQyxRQUFBQSxJQUFJLG9CQUNDLDBHQUFxQkEsSUFEdEI7QUFFRkMsVUFBQUEsUUFBUSxFQUFFO0FBRlIsVUFGTjtBQU1FdEYsUUFBQUEsUUFBUSxFQUFFO0FBQ1JzRixVQUFBQSxRQUFRLEVBQUUsVUFERjtBQUVSQyxVQUFBQSxLQUFLLEVBQUUsZUFGQztBQUdSQyxVQUFBQSxLQUFLLEVBQUUsZUFIQztBQUlSQyxVQUFBQSxNQUFNLEVBQUUsZ0JBSkE7QUFLUkMsVUFBQUEsS0FBSyxFQUFFLGVBTEM7QUFNUkMsVUFBQUEsR0FBRyxFQUFFLFVBTkc7QUFPUkMsVUFBQUEsZ0JBQWdCLEVBQUVDLGdDQUFlQztBQVB6QjtBQU5aO0FBZ0JEOzs7aURBRTJDO0FBQUEsK0JBQWRDLE1BQWM7QUFBQSxVQUFkQSxNQUFjLDZCQUFMLEVBQUs7QUFDMUMsVUFBTUMsWUFBWSxHQUFHLEtBQUtDLHNCQUFMLENBQTRCN0csaUJBQTVCLEVBQStDMkcsTUFBL0MsQ0FBckI7O0FBQ0EsVUFBSSxDQUFDQyxZQUFELElBQWlCLENBQUNBLFlBQVksQ0FBQzlFLE1BQW5DLEVBQTJDO0FBQ3pDLGVBQU87QUFBQ1osVUFBQUEsS0FBSyxFQUFFO0FBQVIsU0FBUDtBQUNEOztBQUVELGFBQU87QUFDTEEsUUFBQUEsS0FBSyxFQUFFMEYsWUFBWSxDQUFDdEQsR0FBYixDQUFpQixVQUFBaEMsT0FBTztBQUFBLGlCQUFLO0FBQ2xDd0YsWUFBQUEsU0FBUyxFQUFFLElBRHVCO0FBRWxDQyxZQUFBQSxLQUFLLEVBQUUsWUFGMkI7QUFHbEN6RixZQUFBQSxPQUFPLEVBQVBBO0FBSGtDLFdBQUw7QUFBQSxTQUF4QjtBQURGLE9BQVA7QUFPRDs7O0VBeER5QzBGLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtHZW9Kc29uTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQge0gzSGV4YWdvbkxheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcbmltcG9ydCBFbmhhbmNlZENvbHVtbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvY29sdW1uLWxheWVyL2VuaGFuY2VkLWNvbHVtbi1sYXllcic7XG5pbXBvcnQge2dldENlbnRyb2lkLCBpZFRvUG9seWdvbkdlbywgaDNJc1ZhbGlkfSBmcm9tICcuL2gzLXV0aWxzJztcbmltcG9ydCBIM0hleGFnb25MYXllckljb24gZnJvbSAnLi9oMy1oZXhhZ29uLWxheWVyLWljb24nO1xuaW1wb3J0IHtDSEFOTkVMX1NDQUxFUywgSElHSExJR0hfQ09MT1JfM0R9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcblxuY29uc3QgREVGQVVMVF9MSU5FX1NDQUxFX1ZBTFVFID0gODtcblxuZXhwb3J0IGNvbnN0IEhFWEFHT05fSURfRklFTERTID0ge1xuICBoZXhfaWQ6IFsnaGV4X2lkJywgJ2hleGFnb25faWQnLCAnaDNfaWQnXVxufTtcblxuZXhwb3J0IGNvbnN0IGhleElkUmVxdWlyZWRDb2x1bW5zID0gWydoZXhfaWQnXTtcbmV4cG9ydCBjb25zdCBoZXhJZEFjY2Vzc29yID0gKHtoZXhfaWR9KSA9PiBkID0+IGQuZGF0YVtoZXhfaWQuZmllbGRJZHhdO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRFbGV2YXRpb24gPSA1MDA7XG5leHBvcnQgY29uc3QgZGVmYXVsdENvdmVyYWdlID0gMTtcblxuZXhwb3J0IGNvbnN0IEhleGFnb25JZFZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBjb3ZlcmFnZTogJ2NvdmVyYWdlJyxcbiAgZW5hYmxlM2Q6ICdlbmFibGUzZCcsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgY292ZXJhZ2VSYW5nZTogJ2NvdmVyYWdlUmFuZ2UnLFxuICBlbGV2YXRpb25TY2FsZTogJ2VsZXZhdGlvblNjYWxlJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGV4YWdvbklkTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoSGV4YWdvbklkVmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRQb3NpdGlvbkFjY2Vzc29yID0gKCkgPT4gaGV4SWRBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaGV4YWdvbklkJztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiAnSDMnO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBoZXhJZFJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgLy8gdXNlIGhleGFnb24gbGF5ZXIgaWNvbiBmb3Igbm93XG4gICAgcmV0dXJuIEgzSGV4YWdvbkxheWVySWNvbjtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0J1xuICAgICAgfSxcbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY292ZXJhZ2UnLFxuICAgICAgICBmaWVsZDogJ2NvdmVyYWdlRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvdmVyYWdlU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb3ZlcmFnZURvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY292ZXJhZ2VSYW5nZScsXG4gICAgICAgIGtleTogJ2NvdmVyYWdlJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMucmFkaXVzXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2ZpZWxkcyA9IFtdfSkge1xuICAgIGNvbnN0IGZvdW5kQ29sdW1ucyA9IHRoaXMuZmluZERlZmF1bHRDb2x1bW5GaWVsZChIRVhBR09OX0lEX0ZJRUxEUywgZmllbGRzKTtcbiAgICBpZiAoIWZvdW5kQ29sdW1ucyB8fCAhZm91bmRDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtwcm9wczogW119O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm9wczogZm91bmRDb2x1bW5zLm1hcChjb2x1bW5zID0+ICh7XG4gICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgbGFiZWw6ICdIMyBIZXhhZ29uJyxcbiAgICAgICAgY29sdW1uc1xuICAgICAgfSkpXG4gICAgfTtcbiAgfVxuXG4gIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyA9IHt9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLmdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyksXG5cbiAgICAgIC8vIGFkZCBoZWlnaHQgdmlzdWFsIGNoYW5uZWxcbiAgICAgIGNvdmVyYWdlRmllbGQ6IG51bGwsXG4gICAgICBjb3ZlcmFnZURvbWFpbjogWzAsIDFdLFxuICAgICAgY292ZXJhZ2VTY2FsZTogJ2xpbmVhcidcbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldEhleElkKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBpZCA9IGdldEhleElkKHtkYXRhOiBhbGxEYXRhW2luZGV4XX0pO1xuICAgICAgY29uc3QgY2VudHJvaWQgPSB0aGlzLmRhdGFUb0ZlYXR1cmUuY2VudHJvaWRzW2luZGV4XTtcblxuICAgICAgaWYgKGNlbnRyb2lkKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgZGF0YSBpbmRleFxuICAgICAgICAgIGluZGV4LFxuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRyb2lkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8vIFRPRE86IGZpeCBjb21wbGV4aXR5XG4gIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIGNvdmVyYWdlRmllbGQsXG4gICAgICBjb3ZlcmFnZVNjYWxlLFxuICAgICAgY292ZXJhZ2VEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtzaXplUmFuZ2UsIGNvbG9yUmFuZ2UsIGNvdmVyYWdlUmFuZ2UsIGVuYWJsZTNkfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IHtncHVGaWx0ZXJ9ID0gZGF0YXNldHNbdGhpcy5jb25maWcuZGF0YUlkXTtcbiAgICBjb25zdCBnZXRIZXhJZCA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgICAvLyBjb2xvclxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgY29sb3JTY2FsZSxcbiAgICAgICAgY29sb3JEb21haW4sXG4gICAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChjID0+IGhleFRvUmdiKGMpKVxuICAgICAgKTtcblxuICAgIC8vIGhlaWdodFxuICAgIGNvbnN0IHNTY2FsZSA9XG4gICAgICBzaXplRmllbGQgJiYgZW5hYmxlM2QgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoc2l6ZVNjYWxlLCBzaXplRG9tYWluLCBzaXplUmFuZ2UsIDApO1xuXG4gICAgLy8gY292ZXJhZ2VcbiAgICBjb25zdCBjb1NjYWxlID1cbiAgICAgIGNvdmVyYWdlRmllbGQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoY292ZXJhZ2VTY2FsZSwgY292ZXJhZ2VEb21haW4sIGNvdmVyYWdlUmFuZ2UsIDApO1xuXG4gICAgY29uc3QgZ2V0RWxldmF0aW9uID0gc1NjYWxlXG4gICAgICA/IGQgPT4gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApXG4gICAgICA6IGRlZmF1bHRFbGV2YXRpb247XG5cbiAgICBjb25zdCBnZXRGaWxsQ29sb3IgPSBjU2NhbGVcbiAgICAgID8gZCA9PiB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpXG4gICAgICA6IGNvbG9yO1xuXG4gICAgY29uc3QgZ2V0Q292ZXJhZ2UgPSBjb1NjYWxlXG4gICAgICA/IGQgPT4gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNvU2NhbGUsIGQuZGF0YSwgY292ZXJhZ2VGaWVsZCwgMClcbiAgICAgIDogZGVmYXVsdENvdmVyYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRFbGV2YXRpb24sXG4gICAgICBnZXRGaWxsQ29sb3IsXG4gICAgICBnZXRIZXhJZCxcbiAgICAgIGdldENvdmVyYWdlLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKClcbiAgICB9O1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRIZXhJZCkge1xuICAgIGNvbnN0IGNlbnRyb2lkcyA9IGFsbERhdGEubWFwKChkLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBnZXRIZXhJZCh7ZGF0YTogZH0pO1xuICAgICAgaWYgKCFoM0lzVmFsaWQoaWQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBvZiBjZW50cm9pZHMgdG8gZGF0YVRvRmVhdHVyZVxuICAgICAgLy8gc28gd2UgZG9uJ3QgaGF2ZSB0byByZSBjYWxjdWxhdGUgaXQgYWdhaW5cbiAgICAgIHJldHVybiBnZXRDZW50cm9pZCh7aWR9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGNlbnRyb2lkcyk7XG4gICAgdGhpcy5kYXRhVG9GZWF0dXJlID0ge2NlbnRyb2lkc307XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKG9wdHMpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ3B1RmlsdGVyLCBvYmplY3RIb3ZlcmVkLCBtYXBTdGF0ZX0gPSBvcHRzO1xuXG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZSk7XG4gICAgY29uc3QgZWxlWm9vbUZhY3RvciA9IHRoaXMuZ2V0RWxldmF0aW9uWm9vbUZhY3RvcihtYXBTdGF0ZSk7XG4gICAgY29uc3Qge2NvbmZpZ30gPSB0aGlzO1xuICAgIGNvbnN0IHt2aXNDb25maWd9ID0gY29uZmlnO1xuXG4gICAgY29uc3QgaDNIZXhhZ29uTGF5ZXJUcmlnZ2VycyA9IHtcbiAgICAgIGdldEZpbGxDb2xvcjoge1xuICAgICAgICBjb2xvcjogY29uZmlnLmNvbG9yLFxuICAgICAgICBjb2xvckZpZWxkOiBjb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgY29sb3JSYW5nZTogdmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yU2NhbGU6IGNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0RWxldmF0aW9uOiB7XG4gICAgICAgIHNpemVGaWVsZDogY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgc2l6ZVJhbmdlOiB2aXNDb25maWcuc2l6ZVJhbmdlLFxuICAgICAgICBzaXplU2NhbGU6IGNvbmZpZy5zaXplU2NhbGUsXG4gICAgICAgIGVuYWJsZTNkOiB2aXNDb25maWcuZW5hYmxlM2RcbiAgICAgIH0sXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICB9O1xuXG4gICAgY29uc3QgY29sdW1uTGF5ZXJUcmlnZ2VycyA9IHtcbiAgICAgIGdldENvdmVyYWdlOiB7XG4gICAgICAgIGNvdmVyYWdlRmllbGQ6IGNvbmZpZy5jb3ZlcmFnZUZpZWxkLFxuICAgICAgICBjb3ZlcmFnZVJhbmdlOiB2aXNDb25maWcuY292ZXJhZ2VSYW5nZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBIM0hleGFnb25MYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZSxcblxuICAgICAgICBnZXRIZXhhZ29uOiB4ID0+IHguaWQsXG5cbiAgICAgICAgLy8gY292ZXJhZ2VcbiAgICAgICAgY292ZXJhZ2U6IGNvbmZpZy5jb3ZlcmFnZUZpZWxkID8gMSA6IHZpc0NvbmZpZy5jb3ZlcmFnZSxcblxuICAgICAgICAvLyBoaWdobGlnaHRcbiAgICAgICAgYXV0b0hpZ2hsaWdodDogdmlzQ29uZmlnLmVuYWJsZTNkLFxuICAgICAgICBoaWdobGlnaHRDb2xvcjogSElHSExJR0hfQ09MT1JfM0QsXG5cbiAgICAgICAgLy8gZWxldmF0aW9uXG4gICAgICAgIGV4dHJ1ZGVkOiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIGVsZXZhdGlvblNjYWxlOiB2aXNDb25maWcuZWxldmF0aW9uU2NhbGUgKiBlbGVab29tRmFjdG9yLFxuXG4gICAgICAgIC8vIHJlbmRlclxuICAgICAgICB1cGRhdGVUcmlnZ2VyczogaDNIZXhhZ29uTGF5ZXJUcmlnZ2VycyxcbiAgICAgICAgX3N1YkxheWVyUHJvcHM6IHtcbiAgICAgICAgICAnaGV4YWdvbi1jZWxsJzoge1xuICAgICAgICAgICAgdHlwZTogRW5oYW5jZWRDb2x1bW5MYXllcixcbiAgICAgICAgICAgIGdldENvdmVyYWdlOiBkYXRhLmdldENvdmVyYWdlLFxuICAgICAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IGNvbHVtbkxheWVyVHJpZ2dlcnNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLi4uKHRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZCkgJiYgIWNvbmZpZy5zaXplRmllbGRcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgR2VvSnNvbkxheWVyKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCksXG4gICAgICAgICAgICAgIGRhdGE6IFtpZFRvUG9seWdvbkdlbyhvYmplY3RIb3ZlcmVkKV0sXG4gICAgICAgICAgICAgIGdldExpbmVDb2xvcjogY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICBsaW5lV2lkdGhTY2FsZTogREVGQVVMVF9MSU5FX1NDQUxFX1ZBTFVFICogem9vbUZhY3RvcixcbiAgICAgICAgICAgICAgd3JhcExvbmdpdHVkZTogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==