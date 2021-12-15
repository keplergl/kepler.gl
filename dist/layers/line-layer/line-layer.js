"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.lineVisConfigs = exports.lineColumnLabels = exports.lineOptionalColumns = exports.lineRequiredColumns = exports.linePosAccessor = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extensions = require("@deck.gl/extensions");

var _layerFactory = require("../layer-factory");

var _lineLayerIcon = _interopRequireDefault(require("./line-layer-icon"));

var _arcLayer = _interopRequireDefault(require("../arc-layer/arc-layer"));

var _lineLayer = _interopRequireDefault(require("../../deckgl-layers/line-layer/line-layer"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var linePosAccessor = function linePosAccessor(_ref) {
  var lat0 = _ref.lat0,
      lng0 = _ref.lng0,
      lat1 = _ref.lat1,
      lng1 = _ref.lng1,
      alt0 = _ref.alt0,
      alt1 = _ref.alt1;
  return function (d) {
    return [d.data[lng0.fieldIdx], d.data[lat0.fieldIdx], (alt0 === null || alt0 === void 0 ? void 0 : alt0.fieldIdx) > -1 ? d.data[alt0.fieldIdx] : 0, d.data[lng1.fieldIdx], d.data[lat1.fieldIdx], (alt1 === null || alt1 === void 0 ? void 0 : alt1.fieldIdx) > -1 ? d.data[alt1.fieldIdx] : 0];
  };
};

exports.linePosAccessor = linePosAccessor;
var lineRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];
exports.lineRequiredColumns = lineRequiredColumns;
var lineOptionalColumns = ['alt0', 'alt1'];
exports.lineOptionalColumns = lineOptionalColumns;
var lineColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1',
  alt0: 'line.alt0',
  alt1: 'line.alt1'
};
exports.lineColumnLabels = lineColumnLabels;
var lineVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor',
  elevationScale: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale), {}, {
    defaultValue: 1
  })
};
exports.lineVisConfigs = lineVisConfigs;

var LineLayer = /*#__PURE__*/function (_ArcLayer) {
  (0, _inherits2["default"])(LineLayer, _ArcLayer);

  var _super = _createSuper(LineLayer);

  function LineLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, LineLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(lineVisConfigs);

    _this.getPositionAccessor = function () {
      return linePosAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(LineLayer, [{
    key: "type",
    get: function get() {
      return 'line';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _lineLayerIcon["default"];
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return lineRequiredColumns;
    }
  }, {
    key: "optionalColumns",
    get: function get() {
      return lineOptionalColumns;
    }
  }, {
    key: "columnLabels",
    get: function get() {
      return lineColumnLabels;
    }
  }, {
    key: "visualChannels",
    get: function get() {
      var visualChannels = (0, _get2["default"])((0, _getPrototypeOf2["default"])(LineLayer.prototype), "visualChannels", this);
      return _objectSpread(_objectSpread({}, visualChannels), {}, {
        sourceColor: _objectSpread(_objectSpread({}, visualChannels.sourceColor), {}, {
          accessor: 'getColor'
        })
      });
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          interactionConfig = opts.interactionConfig;
      var layerProps = {
        widthScale: this.config.visConfig.thickness,
        elevationScale: this.config.visConfig.elevationScale
      };

      var updateTriggers = _objectSpread({
        getPosition: this.config.columns,
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      }, this.getVisualChannelUpdateTriggers());

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [// base layer
      new _lineLayer["default"](_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), this.getBrushingExtensionProps(interactionConfig, 'source_target')), data), layerProps), {}, {
        updateTriggers: updateTriggers,
        extensions: [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [new _extensions.BrushingExtension()])
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject ? [new _lineLayer["default"](_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), layerProps), {}, {
        data: [hoveredObject],
        getColor: this.config.highlightColor,
        getTargetColor: this.config.highlightColor,
        getWidth: data.getWidth
      }))] : []));
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref2) {
      var _ref2$fieldPairs = _ref2.fieldPairs,
          fieldPairs = _ref2$fieldPairs === void 0 ? [] : _ref2$fieldPairs;

      if (fieldPairs.length < 2) {
        return {
          props: []
        };
      }

      var props = {}; // connect the first two point layer with line

      props.columns = {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        alt0: {
          value: null,
          fieldIdx: -1,
          optional: true
        },
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng,
        alt1: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      };
      props.label = "".concat(fieldPairs[0].defaultName, " -> ").concat(fieldPairs[1].defaultName, " line");
      return {
        props: [props]
      };
    }
  }]);
  return LineLayer;
}(_arcLayer["default"]);

exports["default"] = LineLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbImxpbmVQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJhbHQwIiwiYWx0MSIsImQiLCJkYXRhIiwiZmllbGRJZHgiLCJsaW5lUmVxdWlyZWRDb2x1bW5zIiwibGluZU9wdGlvbmFsQ29sdW1ucyIsImxpbmVDb2x1bW5MYWJlbHMiLCJsaW5lVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJlbGV2YXRpb25TY2FsZSIsIkxBWUVSX1ZJU19DT05GSUdTIiwiZGVmYXVsdFZhbHVlIiwiTGluZUxheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldFBvc2l0aW9uQWNjZXNzb3IiLCJjb25maWciLCJjb2x1bW5zIiwiTGluZUxheWVySWNvbiIsInZpc3VhbENoYW5uZWxzIiwic291cmNlQ29sb3IiLCJhY2Nlc3NvciIsIm9wdHMiLCJncHVGaWx0ZXIiLCJvYmplY3RIb3ZlcmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJsYXllclByb3BzIiwid2lkdGhTY2FsZSIsInZpc0NvbmZpZyIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0UG9zaXRpb24iLCJnZXRGaWx0ZXJWYWx1ZSIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJnZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImhvdmVyZWRPYmplY3QiLCJoYXNIb3ZlcmVkT2JqZWN0IiwiRW5oYW5jZWRMaW5lTGF5ZXIiLCJnZXRCcnVzaGluZ0V4dGVuc2lvblByb3BzIiwiZXh0ZW5zaW9ucyIsIkJydXNoaW5nRXh0ZW5zaW9uIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsImdldENvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJnZXRUYXJnZXRDb2xvciIsImdldFdpZHRoIiwiZmllbGRQYWlycyIsImxlbmd0aCIsInBhaXIiLCJsYXQiLCJsbmciLCJ2YWx1ZSIsIm9wdGlvbmFsIiwibGFiZWwiLCJkZWZhdWx0TmFtZSIsIkFyY0xheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sSUFBTUEsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsUUFBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsUUFBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixRQUFvQkEsSUFBcEI7QUFBQSxNQUEwQkMsSUFBMUIsUUFBMEJBLElBQTFCO0FBQUEsTUFBZ0NDLElBQWhDLFFBQWdDQSxJQUFoQztBQUFBLFNBQTBDLFVBQUFDLENBQUM7QUFBQSxXQUFJLENBQzVFQSxDQUFDLENBQUNDLElBQUYsQ0FBT04sSUFBSSxDQUFDTyxRQUFaLENBRDRFLEVBRTVFRixDQUFDLENBQUNDLElBQUYsQ0FBT1AsSUFBSSxDQUFDUSxRQUFaLENBRjRFLEVBRzVFLENBQUFKLElBQUksU0FBSixJQUFBQSxJQUFJLFdBQUosWUFBQUEsSUFBSSxDQUFFSSxRQUFOLElBQWlCLENBQUMsQ0FBbEIsR0FBc0JGLENBQUMsQ0FBQ0MsSUFBRixDQUFPSCxJQUFJLENBQUNJLFFBQVosQ0FBdEIsR0FBOEMsQ0FIOEIsRUFJNUVGLENBQUMsQ0FBQ0MsSUFBRixDQUFPSixJQUFJLENBQUNLLFFBQVosQ0FKNEUsRUFLNUVGLENBQUMsQ0FBQ0MsSUFBRixDQUFPTCxJQUFJLENBQUNNLFFBQVosQ0FMNEUsRUFNNUUsQ0FBQUgsSUFBSSxTQUFKLElBQUFBLElBQUksV0FBSixZQUFBQSxJQUFJLENBQUVHLFFBQU4sSUFBaUIsQ0FBQyxDQUFsQixHQUFzQkYsQ0FBQyxDQUFDQyxJQUFGLENB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O0FBSWQ1RCxRQUFBQSxJQUFJLEVBQUVzRCxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNFLElBQWQsQ0FBbUJDLEdBSlg7QUFLZHhELFFBQUFBLElBQUksRUFBRXFELFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0UsSUFBZCxDQUFtQkUsR0FMWDtBQU1kdkQsUUFBQUEsSUFBSSxFQUFFO0FBQUN3RCxVQUFBQSxLQUFLLEVBQUUsSUFBUjtBQUFjckQsVUFBQUEsUUFBUSxFQUFFLENBQUMsQ0FBekI7QUFBNEJzRCxVQUFBQSxRQUFRLEVBQUU7QUFBdEM7QUFOUSxPQUFoQjtBQVFBeEMsTUFBQUEsS0FBSyxDQUFDeUMsS0FBTixhQUFpQlAsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjUSxXQUEvQixpQkFBaURSLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY1EsV0FBL0Q7QUFFQSxhQUFPO0FBQUMxQyxRQUFBQSxLQUFLLEVBQUUsQ0FBQ0EsS0FBRDtBQUFSLE9BQVA7QUFDRDs7O0VBekRvQzJDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCcnVzaGluZ0V4dGVuc2lvbn0gZnJvbSAnQGRlY2suZ2wvZXh0ZW5zaW9ucyc7XG5cbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCBMaW5lTGF5ZXJJY29uIGZyb20gJy4vbGluZS1sYXllci1pY29uJztcbmltcG9ydCBBcmNMYXllciBmcm9tICcuLi9hcmMtbGF5ZXIvYXJjLWxheWVyJztcbmltcG9ydCBFbmhhbmNlZExpbmVMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllcic7XG5cbmV4cG9ydCBjb25zdCBsaW5lUG9zQWNjZXNzb3IgPSAoe2xhdDAsIGxuZzAsIGxhdDEsIGxuZzEsIGFsdDAsIGFsdDF9KSA9PiBkID0+IFtcbiAgZC5kYXRhW2xuZzAuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0MC5maWVsZElkeF0sXG4gIGFsdDA/LmZpZWxkSWR4ID4gLTEgPyBkLmRhdGFbYWx0MC5maWVsZElkeF0gOiAwLFxuICBkLmRhdGFbbG5nMS5maWVsZElkeF0sXG4gIGQuZGF0YVtsYXQxLmZpZWxkSWR4XSxcbiAgYWx0MT8uZmllbGRJZHggPiAtMSA/IGQuZGF0YVthbHQxLmZpZWxkSWR4XSA6IDBcbl07XG5cbmV4cG9ydCBjb25zdCBsaW5lUmVxdWlyZWRDb2x1bW5zID0gWydsYXQwJywgJ2xuZzAnLCAnbGF0MScsICdsbmcxJ107XG5leHBvcnQgY29uc3QgbGluZU9wdGlvbmFsQ29sdW1ucyA9IFsnYWx0MCcsICdhbHQxJ107XG5cbmV4cG9ydCBjb25zdCBsaW5lQ29sdW1uTGFiZWxzID0ge1xuICBsYXQwOiAnYXJjLmxhdDAnLFxuICBsbmcwOiAnYXJjLmxuZzAnLFxuICBsYXQxOiAnYXJjLmxhdDEnLFxuICBsbmcxOiAnYXJjLmxuZzEnLFxuICBhbHQwOiAnbGluZS5hbHQwJyxcbiAgYWx0MTogJ2xpbmUuYWx0MSdcbn07XG5cbmV4cG9ydCBjb25zdCBsaW5lVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ3N0cm9rZVdpZHRoUmFuZ2UnLFxuICB0YXJnZXRDb2xvcjogJ3RhcmdldENvbG9yJyxcbiAgZWxldmF0aW9uU2NhbGU6IHtcbiAgICAuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25TY2FsZSxcbiAgICBkZWZhdWx0VmFsdWU6IDFcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUxheWVyIGV4dGVuZHMgQXJjTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcobGluZVZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IGxpbmVQb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnbGluZSc7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBMaW5lTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBsaW5lUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gbGluZU9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5MYWJlbHMoKSB7XG4gICAgcmV0dXJuIGxpbmVDb2x1bW5MYWJlbHM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbHMgPSBzdXBlci52aXN1YWxDaGFubmVscztcbiAgICByZXR1cm4ge1xuICAgICAgLi4udmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzb3VyY2VDb2xvcjoge1xuICAgICAgICAuLi52aXN1YWxDaGFubmVscy5zb3VyY2VDb2xvcixcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRDb2xvcidcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyh7ZmllbGRQYWlycyA9IFtdfSkge1xuICAgIGlmIChmaWVsZFBhaXJzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB7cHJvcHM6IFtdfTtcbiAgICB9XG4gICAgY29uc3QgcHJvcHMgPSB7fTtcblxuICAgIC8vIGNvbm5lY3QgdGhlIGZpcnN0IHR3byBwb2ludCBsYXllciB3aXRoIGxpbmVcbiAgICBwcm9wcy5jb2x1bW5zID0ge1xuICAgICAgbGF0MDogZmllbGRQYWlyc1swXS5wYWlyLmxhdCxcbiAgICAgIGxuZzA6IGZpZWxkUGFpcnNbMF0ucGFpci5sbmcsXG4gICAgICBhbHQwOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9LFxuICAgICAgbGF0MTogZmllbGRQYWlyc1sxXS5wYWlyLmxhdCxcbiAgICAgIGxuZzE6IGZpZWxkUGFpcnNbMV0ucGFpci5sbmcsXG4gICAgICBhbHQxOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgfTtcbiAgICBwcm9wcy5sYWJlbCA9IGAke2ZpZWxkUGFpcnNbMF0uZGVmYXVsdE5hbWV9IC0+ICR7ZmllbGRQYWlyc1sxXS5kZWZhdWx0TmFtZX0gbGluZWA7XG5cbiAgICByZXR1cm4ge3Byb3BzOiBbcHJvcHNdfTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKG9wdHMpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ3B1RmlsdGVyLCBvYmplY3RIb3ZlcmVkLCBpbnRlcmFjdGlvbkNvbmZpZ30gPSBvcHRzO1xuXG4gICAgY29uc3QgbGF5ZXJQcm9wcyA9IHtcbiAgICAgIHdpZHRoU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG4gICAgICBlbGV2YXRpb25TY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlXG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0UG9zaXRpb246IHRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMsXG4gICAgICAuLi50aGlzLmdldFZpc3VhbENoYW5uZWxVcGRhdGVUcmlnZ2VycygpXG4gICAgfTtcbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIGNvbnN0IGhvdmVyZWRPYmplY3QgPSB0aGlzLmhhc0hvdmVyZWRPYmplY3Qob2JqZWN0SG92ZXJlZCk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgLy8gYmFzZSBsYXllclxuICAgICAgbmV3IEVuaGFuY2VkTGluZUxheWVyKHtcbiAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgIC4uLnRoaXMuZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyhpbnRlcmFjdGlvbkNvbmZpZywgJ3NvdXJjZV90YXJnZXQnKSxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgIGV4dGVuc2lvbnM6IFsuLi5kZWZhdWx0TGF5ZXJQcm9wcy5leHRlbnNpb25zLCBuZXcgQnJ1c2hpbmdFeHRlbnNpb24oKV1cbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLihob3ZlcmVkT2JqZWN0XG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IEVuaGFuY2VkTGluZUxheWVyKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCksXG4gICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgIGRhdGE6IFtob3ZlcmVkT2JqZWN0XSxcbiAgICAgICAgICAgICAgZ2V0Q29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICBnZXRUYXJnZXRDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldFdpZHRoOiBkYXRhLmdldFdpZHRoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=