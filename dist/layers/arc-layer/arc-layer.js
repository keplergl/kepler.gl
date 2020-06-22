"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.arcVisConfigs = exports.arcColumnLabels = exports.arcRequiredColumns = exports.arcPosAccessor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _extensions = require("@deck.gl/extensions");

var _layers = require("@deck.gl/layers");

var _colorUtils = require("../../utils/color-utils");

var _arcLayerIcon = _interopRequireDefault(require("./arc-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var arcPosAccessor = function arcPosAccessor(_ref) {
  var lat0 = _ref.lat0,
      lng0 = _ref.lng0,
      lat1 = _ref.lat1,
      lng1 = _ref.lng1;
  return function (d) {
    return [d.data[lng0.fieldIdx], d.data[lat0.fieldIdx], 0, d.data[lng1.fieldIdx], d.data[lat1.fieldIdx], 0];
  };
};

exports.arcPosAccessor = arcPosAccessor;
var arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];
exports.arcRequiredColumns = arcRequiredColumns;
var arcColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1'
};
exports.arcColumnLabels = arcColumnLabels;
var arcVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor'
};
exports.arcVisConfigs = arcVisConfigs;

var ArcLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(ArcLayer, _Layer);

  function ArcLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ArcLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ArcLayer).call(this, props));

    _this.registerVisConfig(arcVisConfigs);

    _this.getPositionAccessor = function () {
      return arcPosAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(ArcLayer, [{
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getPosition) {
      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        // data = filteredIndex.reduce((accu, index) => {
        var index = filteredIndex[i];
        var pos = getPosition({
          data: allData[index]
        }); // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null

        if (pos.every(Number.isFinite)) {
          data.push({
            index: index,
            sourcePosition: [pos[0], pos[1], pos[2]],
            targetPosition: [pos[3], pos[4], pos[5]],
            data: allData[index]
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
          _this$config$visConfi = _this$config.visConfig,
          sizeRange = _this$config$visConfi.sizeRange,
          colorRange = _this$config$visConfi.colorRange,
          targetColor = _this$config$visConfi.targetColor;
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data; // arc color


      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // arc thickness

      var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);
      var getStrokeWidth = sScale ? function (d) {
        return _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0);
      } : 1;
      var getSourceColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;
      var getTargetColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : targetColor || color;
      return {
        data: data,
        getSourceColor: getSourceColor,
        getTargetColor: getTargetColor,
        getWidth: getStrokeWidth,
        getFilterValue: gpuFilter.filterValueAccessor()
      };
    }
    /* eslint-enable complexity */

  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData) {
      // get bounds from arcs
      var getPosition = this.getPositionAccessor();
      var sBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({
          data: d
        });
        return [pos[0], pos[1]];
      });
      var tBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({
          data: d
        });
        return [pos[3], pos[4]];
      });
      var bounds = tBounds && sBounds ? [Math.min(sBounds[0], tBounds[0]), Math.min(sBounds[1], tBounds[1]), Math.max(sBounds[2], tBounds[2]), Math.max(sBounds[3], tBounds[3])] : sBounds || tBounds;
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
          interactionConfig = opts.interactionConfig;
      var colorUpdateTriggers = {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale,
        targetColor: this.config.visConfig.targetColor
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      return [new _layers.ArcLayer(_objectSpread({}, defaultLayerProps, {}, this.getBrushingExtensionProps(interactionConfig, 'source_target'), {}, data, {
        widthScale: this.config.visConfig.thickness,
        updateTriggers: {
          getFilterValue: gpuFilter.filterValueUpdateTriggers,
          getWidth: {
            sizeField: this.config.sizeField,
            sizeScale: this.config.sizeScale,
            sizeRange: this.config.visConfig.sizeRange
          },
          getSourceColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        },
        extensions: [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [new _extensions.BrushingExtension()])
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) ? [new _layers.ArcLayer(_objectSpread({}, this.getDefaultHoverLayerProps(), {
        data: [objectHovered.object],
        widthScale: this.config.visConfig.thickness,
        getSourceColor: this.config.highlightColor,
        getTargetColor: this.config.highlightColor,
        getWidth: data.getWidth
      }))] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'arc';
    }
  }, {
    key: "isAggregated",
    get: function get() {
      return false;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _arcLayerIcon["default"];
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return arcRequiredColumns;
    }
  }, {
    key: "columnLabels",
    get: function get() {
      return arcColumnLabels;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultLinkColumnPairs;
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(ArcLayer.prototype), "visualChannels", this), {
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(ArcLayer.prototype), "visualChannels", this).size, {
          property: 'stroke'
        })
      });
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fieldPairs = _ref3.fieldPairs,
          fieldPairs = _ref3$fieldPairs === void 0 ? [] : _ref3$fieldPairs;

      if (fieldPairs.length < 2) {
        return {
          props: []
        };
      }

      var props = {
        color: (0, _colorUtils.hexToRgb)(_defaultSettings.DEFAULT_LAYER_COLOR.tripArc)
      }; // connect the first two point layer with arc

      props.columns = {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng
      };
      props.label = "".concat(fieldPairs[0].defaultName, " -> ").concat(fieldPairs[1].defaultName, " arc");
      return {
        props: [props]
      };
    }
  }]);
  return ArcLayer;
}(_baseLayer["default"]);

exports["default"] = ArcLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUmVxdWlyZWRDb2x1bW5zIiwiYXJjQ29sdW1uTGFiZWxzIiwiYXJjVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImdldFBvc2l0aW9uIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJpIiwibGVuZ3RoIiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsInNvdXJjZVBvc2l0aW9uIiwidGFyZ2V0UG9zaXRpb24iLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJ2aXNDb25maWciLCJncHVGaWx0ZXIiLCJkYXRhSWQiLCJ1cGRhdGVEYXRhIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwibWFwIiwiaGV4VG9SZ2IiLCJzU2NhbGUiLCJnZXRTdHJva2VXaWR0aCIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRTb3VyY2VDb2xvciIsImdldFRhcmdldENvbG9yIiwiZ2V0V2lkdGgiLCJnZXRGaWx0ZXJWYWx1ZSIsImZpbHRlclZhbHVlQWNjZXNzb3IiLCJzQm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidEJvdW5kcyIsImJvdW5kcyIsIk1hdGgiLCJtaW4iLCJtYXgiLCJ1cGRhdGVNZXRhIiwib3B0cyIsIm9iamVjdEhvdmVyZWQiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImNvbG9yVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsIkRlY2tBcmNMYXllciIsImdldEJydXNoaW5nRXh0ZW5zaW9uUHJvcHMiLCJ3aWR0aFNjYWxlIiwidXBkYXRlVHJpZ2dlcnMiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZXh0ZW5zaW9ucyIsIkJydXNoaW5nRXh0ZW5zaW9uIiwiaXNMYXllckhvdmVyZWQiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwib2JqZWN0IiwiaGlnaGxpZ2h0Q29sb3IiLCJBcmNMYXllckljb24iLCJkZWZhdWx0TGlua0NvbHVtblBhaXJzIiwic2l6ZSIsInByb3BlcnR5IiwiZmllbGRQYWlycyIsIkRFRkFVTFRfTEFZRVJfQ09MT1IiLCJ0cmlwQXJjIiwicGFpciIsImxhdCIsImxuZyIsImxhYmVsIiwiZGVmYXVsdE5hbWUiLCJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQjtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsUUFBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsUUFBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixRQUFvQkEsSUFBcEI7QUFBQSxTQUE4QixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUMvREEsQ0FBQyxDQUFDQyxJQUFGLENBQU9KLElBQUksQ0FBQ0ssUUFBWixDQUQrRCxFQUUvREYsQ0FBQyxDQUFDQyxJQUFGLENBQU9MLElBQUksQ0FBQ00sUUFBWixDQUYrRCxFQUcvRCxDQUgrRCxFQUkvREYsQ0FBQyxDQUFDQyxJQUFGLENBQU9GLElBQUksQ0FBQ0csUUFBWixDQUor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QixpQkFBaURQLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY08sV0FBL0Q7QUFFQSxhQUFPO0FBQUNqRixRQUFBQSxLQUFLLEVBQUUsQ0FBQ0EsS0FBRDtBQUFSLE9BQVA7QUFDRDs7O0VBNURtQ2tGLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtCcnVzaGluZ0V4dGVuc2lvbn0gZnJvbSAnQGRlY2suZ2wvZXh0ZW5zaW9ucyc7XG5pbXBvcnQge0FyY0xheWVyIGFzIERlY2tBcmNMYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IEFyY0xheWVySWNvbiBmcm9tICcuL2FyYy1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgYXJjUG9zQWNjZXNzb3IgPSAoe2xhdDAsIGxuZzAsIGxhdDEsIGxuZzF9KSA9PiBkID0+IFtcbiAgZC5kYXRhW2xuZzAuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0MC5maWVsZElkeF0sXG4gIDAsXG4gIGQuZGF0YVtsbmcxLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdDEuZmllbGRJZHhdLFxuICAwXG5dO1xuXG5leHBvcnQgY29uc3QgYXJjUmVxdWlyZWRDb2x1bW5zID0gWydsYXQwJywgJ2xuZzAnLCAnbGF0MScsICdsbmcxJ107XG5leHBvcnQgY29uc3QgYXJjQ29sdW1uTGFiZWxzID0ge1xuICBsYXQwOiAnYXJjLmxhdDAnLFxuICBsbmcwOiAnYXJjLmxuZzAnLFxuICBsYXQxOiAnYXJjLmxhdDEnLFxuICBsbmcxOiAnYXJjLmxuZzEnXG59O1xuXG5leHBvcnQgY29uc3QgYXJjVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ3N0cm9rZVdpZHRoUmFuZ2UnLFxuICB0YXJnZXRDb2xvcjogJ3RhcmdldENvbG9yJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJjTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhhcmNWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBhcmNQb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnYXJjJztcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gQXJjTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBhcmNSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uTGFiZWxzKCkge1xuICAgIHJldHVybiBhcmNDb2x1bW5MYWJlbHM7XG4gIH1cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMaW5rQ29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICBwcm9wZXJ0eTogJ3N0cm9rZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyh7ZmllbGRQYWlycyA9IFtdfSkge1xuICAgIGlmIChmaWVsZFBhaXJzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB7cHJvcHM6IFtdfTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIGNvbG9yOiBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SLnRyaXBBcmMpXG4gICAgfTtcblxuICAgIC8vIGNvbm5lY3QgdGhlIGZpcnN0IHR3byBwb2ludCBsYXllciB3aXRoIGFyY1xuICAgIHByb3BzLmNvbHVtbnMgPSB7XG4gICAgICBsYXQwOiBmaWVsZFBhaXJzWzBdLnBhaXIubGF0LFxuICAgICAgbG5nMDogZmllbGRQYWlyc1swXS5wYWlyLmxuZyxcbiAgICAgIGxhdDE6IGZpZWxkUGFpcnNbMV0ucGFpci5sYXQsXG4gICAgICBsbmcxOiBmaWVsZFBhaXJzWzFdLnBhaXIubG5nXG4gICAgfTtcbiAgICBwcm9wcy5sYWJlbCA9IGAke2ZpZWxkUGFpcnNbMF0uZGVmYXVsdE5hbWV9IC0+ICR7ZmllbGRQYWlyc1sxXS5kZWZhdWx0TmFtZX0gYXJjYDtcblxuICAgIHJldHVybiB7cHJvcHM6IFtwcm9wc119O1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyZWRJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBmaWx0ZXJlZEluZGV4W2ldO1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG5cbiAgICAgIC8vIGlmIGRvZXNuJ3QgaGF2ZSBwb2ludCBsYXQgb3IgbG5nLCBkbyBub3QgYWRkIHRoZSBwb2ludFxuICAgICAgLy8gZGVjay5nbCBjYW4ndCBoYW5kbGUgcG9zaXRpb24gPSBudWxsXG4gICAgICBpZiAocG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBzb3VyY2VQb3NpdGlvbjogW3Bvc1swXSwgcG9zWzFdLCBwb3NbMl1dLFxuICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiBbcG9zWzNdLCBwb3NbNF0sIHBvc1s1XV0sXG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvLyBUT0RPOiBmaXggY29tcGxleGl0eVxuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBjb2xvcixcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtzaXplUmFuZ2UsIGNvbG9yUmFuZ2UsIHRhcmdldENvbG9yfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIGNvbnN0IHtncHVGaWx0ZXJ9ID0gZGF0YXNldHNbdGhpcy5jb25maWcuZGF0YUlkXTtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG5cbiAgICAvLyBhcmMgY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoY29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYikpO1xuXG4gICAgLy8gYXJjIHRoaWNrbmVzc1xuICAgIGNvbnN0IHNTY2FsZSA9IHNpemVGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVSYW5nZSk7XG5cbiAgICBjb25zdCBnZXRTdHJva2VXaWR0aCA9IHNTY2FsZVxuICAgICAgPyBkID0+IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShzU2NhbGUsIGQuZGF0YSwgc2l6ZUZpZWxkLCAwKVxuICAgICAgOiAxO1xuXG4gICAgY29uc3QgZ2V0U291cmNlQ29sb3IgPSBjU2NhbGVcbiAgICAgID8gZCA9PiB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpXG4gICAgICA6IGNvbG9yO1xuXG4gICAgY29uc3QgZ2V0VGFyZ2V0Q29sb3IgPSBjU2NhbGVcbiAgICAgID8gZCA9PiB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpXG4gICAgICA6IHRhcmdldENvbG9yIHx8IGNvbG9yO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRTb3VyY2VDb2xvcixcbiAgICAgIGdldFRhcmdldENvbG9yLFxuICAgICAgZ2V0V2lkdGg6IGdldFN0cm9rZVdpZHRoLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKClcbiAgICB9O1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhKSB7XG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIGFyY3NcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuXG4gICAgY29uc3Qgc0JvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzBdLCBwb3NbMV1dO1xuICAgIH0pO1xuICAgIGNvbnN0IHRCb3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBkfSk7XG4gICAgICByZXR1cm4gW3Bvc1szXSwgcG9zWzRdXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvdW5kcyA9XG4gICAgICB0Qm91bmRzICYmIHNCb3VuZHNcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBNYXRoLm1pbihzQm91bmRzWzBdLCB0Qm91bmRzWzBdKSxcbiAgICAgICAgICAgIE1hdGgubWluKHNCb3VuZHNbMV0sIHRCb3VuZHNbMV0pLFxuICAgICAgICAgICAgTWF0aC5tYXgoc0JvdW5kc1syXSwgdEJvdW5kc1syXSksXG4gICAgICAgICAgICBNYXRoLm1heChzQm91bmRzWzNdLCB0Qm91bmRzWzNdKVxuICAgICAgICAgIF1cbiAgICAgICAgOiBzQm91bmRzIHx8IHRCb3VuZHM7XG5cbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIGludGVyYWN0aW9uQ29uZmlnfSA9IG9wdHM7XG5cbiAgICBjb25zdCBjb2xvclVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZSxcbiAgICAgIHRhcmdldENvbG9yOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGFyZ2V0Q29sb3JcbiAgICB9O1xuXG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0FyY0xheWVyKHtcbiAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgIC4uLnRoaXMuZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyhpbnRlcmFjdGlvbkNvbmZpZywgJ3NvdXJjZV90YXJnZXQnKSxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgd2lkdGhTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0V2lkdGg6IHtcbiAgICAgICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLmNvbmZpZy5zaXplU2NhbGUsXG4gICAgICAgICAgICBzaXplUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldFNvdXJjZUNvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldFRhcmdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuc2lvbnM6IFsuLi5kZWZhdWx0TGF5ZXJQcm9wcy5leHRlbnNpb25zLCBuZXcgQnJ1c2hpbmdFeHRlbnNpb24oKV1cbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IERlY2tBcmNMYXllcih7XG4gICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcygpLFxuICAgICAgICAgICAgICBkYXRhOiBbb2JqZWN0SG92ZXJlZC5vYmplY3RdLFxuICAgICAgICAgICAgICB3aWR0aFNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzLFxuICAgICAgICAgICAgICBnZXRTb3VyY2VDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldFRhcmdldENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0V2lkdGg6IGRhdGEuZ2V0V2lkdGhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==