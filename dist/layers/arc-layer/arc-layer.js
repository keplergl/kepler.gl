"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.arcVisConfigs = exports.arcColumnLabels = exports.arcRequiredColumns = exports.arcPosAccessor = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _extensions = require("@deck.gl/extensions");

var _layers = require("@deck.gl/layers");

var _colorUtils = require("../../utils/color-utils");

var _arcLayerIcon = _interopRequireDefault(require("./arc-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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

var ArcLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(ArcLayer, _Layer);

  var _super = _createSuper(ArcLayer);

  function ArcLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ArcLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(arcVisConfigs);

    _this.getPositionAccessor = function () {
      return arcPosAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(ArcLayer, [{
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
      return {
        sourceColor: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(ArcLayer.prototype), "visualChannels", this).color), {}, {
          property: 'color',
          key: 'sourceColor',
          accessor: 'getSourceColor',
          defaultValue: function defaultValue(config) {
            return config.color;
          }
        }),
        targetColor: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(ArcLayer.prototype), "visualChannels", this).color), {}, {
          property: 'targetColor',
          key: 'targetColor',
          accessor: 'getTargetColor',
          defaultValue: function defaultValue(config) {
            return config.visConfig.targetColor || config.color;
          }
        }),
        size: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(ArcLayer.prototype), "visualChannels", this).size), {}, {
          accessor: 'getWidth',
          property: 'stroke'
        })
      };
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref2, getPosition) {
      var allData = _ref2.allData,
          filteredIndex = _ref2.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
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
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var accessors = this.getAttributeAccessors();
      return _objectSpread({
        data: data,
        getFilterValue: gpuFilter.filterValueAccessor()
      }, accessors);
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

      var updateTriggers = _objectSpread({
        getPosition: this.config.columns,
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      }, this.getVisualChannelUpdateTriggers());

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [new _layers.ArcLayer(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), this.getBrushingExtensionProps(interactionConfig, 'source_target')), data), {}, {
        widthScale: this.config.visConfig.thickness,
        updateTriggers: updateTriggers,
        extensions: [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [new _extensions.BrushingExtension()])
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject ? [new _layers.ArcLayer(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), {}, {
        data: [hoveredObject],
        widthScale: this.config.visConfig.thickness,
        getSourceColor: this.config.highlightColor,
        getTargetColor: this.config.highlightColor,
        getWidth: data.getWidth
      }))] : []));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUmVxdWlyZWRDb2x1bW5zIiwiYXJjQ29sdW1uTGFiZWxzIiwiYXJjVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsIkFyY0xheWVySWNvbiIsImRlZmF1bHRMaW5rQ29sdW1uUGFpcnMiLCJzb3VyY2VDb2xvciIsImNvbG9yIiwicHJvcGVydHkiLCJrZXkiLCJhY2Nlc3NvciIsImRlZmF1bHRWYWx1ZSIsInZpc0NvbmZpZyIsInNpemUiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiaSIsImxlbmd0aCIsImluZGV4IiwicG9zIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInB1c2giLCJzb3VyY2VQb3NpdGlvbiIsInRhcmdldFBvc2l0aW9uIiwiZGF0YXNldHMiLCJvbGRMYXllckRhdGEiLCJncHVGaWx0ZXIiLCJkYXRhSWQiLCJ1cGRhdGVEYXRhIiwiYWNjZXNzb3JzIiwiZ2V0QXR0cmlidXRlQWNjZXNzb3JzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwic0JvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsInRCb3VuZHMiLCJib3VuZHMiLCJNYXRoIiwibWluIiwibWF4IiwidXBkYXRlTWV0YSIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJ1cGRhdGVUcmlnZ2VycyIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJnZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImhvdmVyZWRPYmplY3QiLCJoYXNIb3ZlcmVkT2JqZWN0IiwiRGVja0FyY0xheWVyIiwiZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyIsIndpZHRoU2NhbGUiLCJleHRlbnNpb25zIiwiQnJ1c2hpbmdFeHRlbnNpb24iLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwiZ2V0U291cmNlQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsImdldFRhcmdldENvbG9yIiwiZ2V0V2lkdGgiLCJmaWVsZFBhaXJzIiwiREVGQVVMVF9MQVlFUl9DT0xPUiIsInRyaXBBcmMiLCJwYWlyIiwibGF0IiwibG5nIiwibGFiZWwiLCJkZWZhdWx0TmFtZSIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sSUFBTUEsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQjtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsUUFBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsUUFBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixRQUFvQkEsSUFBcEI7QUFBQSxTQUE4QixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUMvREEsQ0FBQyxDQUFDQyxJQUFGLENBQU9KLElBQUksQ0FBQ0ssUUFBWixDQUQrRCxFQUUvREYsQ0FBQyxDQUFDQyxJQUFGLENBQU9MLElBQUksQ0FBQ00sUUFBWixDQUYrRCxFQUcvRCxDQUgrRCxFQUkvREYsQ0FBQyxDQUFDQyxJQUFGLENBQU9GLElBQUksQ0FBQ0csUUFBWixDQUorRCxFQUsvREYsQ0FBQyxDQUFDQyxJQUFGLENBQU9ILElBQUksQ0FBQ0ksUUFBWixDQUwrRCxFQU0vRCxDQU4rRCxDQUFKO0FBQUEsR0FBL0I7QUFB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LEVBckJOO0FBdUJEOzs7V0FoSEQsc0NBQWdEO0FBQUEsbUNBQWxCQyxVQUFrQjtBQUFBLFVBQWxCQSxVQUFrQixpQ0FBTCxFQUFLOztBQUM5QyxVQUFJQSxVQUFVLENBQUM5QyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGVBQU87QUFBQ25CLFVBQUFBLEtBQUssRUFBRTtBQUFSLFNBQVA7QUFDRDs7QUFFRCxVQUFNQSxLQUFLLEdBQUc7QUFDWlEsUUFBQUEsS0FBSyxFQUFFLDBCQUFTMEQscUNBQW9CQyxPQUE3QjtBQURLLE9BQWQsQ0FMOEMsQ0FTOUM7O0FBQ0FuRSxNQUFBQSxLQUFLLENBQUNJLE9BQU4sR0FBZ0I7QUFDZHBCLFFBQUFBLElBQUksRUFBRWlGLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0csSUFBZCxDQUFtQkMsR0FEWDtBQUVkcEYsUUFBQUEsSUFBSSxFQUFFZ0YsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjRyxJQUFkLENBQW1CRSxHQUZYO0FBR2RwRixRQUFBQSxJQUFJLEVBQUUrRSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNHLElBQWQsQ0FBbUJDLEdBSFg7QUFJZGxGLFFBQUFBLElBQUksRUFBRThFLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0csSUFBZCxDQUFtQkU7QUFKWCxPQUFoQjtBQU1BdEUsTUFBQUEsS0FBSyxDQUFDdUUsS0FBTixhQUFpQk4sVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjTyxXQUEvQixpQkFBaURQLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY08sV0FBL0Q7QUFFQSxhQUFPO0FBQUN4RSxRQUFBQSxLQUFLLEVBQUUsQ0FBQ0EsS0FBRDtBQUFSLE9BQVA7QUFDRDs7O0VBMUVtQ3lFLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtCcnVzaGluZ0V4dGVuc2lvbn0gZnJvbSAnQGRlY2suZ2wvZXh0ZW5zaW9ucyc7XG5pbXBvcnQge0FyY0xheWVyIGFzIERlY2tBcmNMYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IEFyY0xheWVySWNvbiBmcm9tICcuL2FyYy1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgYXJjUG9zQWNjZXNzb3IgPSAoe2xhdDAsIGxuZzAsIGxhdDEsIGxuZzF9KSA9PiBkID0+IFtcbiAgZC5kYXRhW2xuZzAuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0MC5maWVsZElkeF0sXG4gIDAsXG4gIGQuZGF0YVtsbmcxLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdDEuZmllbGRJZHhdLFxuICAwXG5dO1xuXG5leHBvcnQgY29uc3QgYXJjUmVxdWlyZWRDb2x1bW5zID0gWydsYXQwJywgJ2xuZzAnLCAnbGF0MScsICdsbmcxJ107XG5leHBvcnQgY29uc3QgYXJjQ29sdW1uTGFiZWxzID0ge1xuICBsYXQwOiAnYXJjLmxhdDAnLFxuICBsbmcwOiAnYXJjLmxuZzAnLFxuICBsYXQxOiAnYXJjLmxhdDEnLFxuICBsbmcxOiAnYXJjLmxuZzEnXG59O1xuXG5leHBvcnQgY29uc3QgYXJjVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ3N0cm9rZVdpZHRoUmFuZ2UnLFxuICB0YXJnZXRDb2xvcjogJ3RhcmdldENvbG9yJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJjTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhhcmNWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IgPSAoKSA9PiBhcmNQb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnYXJjJztcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gQXJjTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBhcmNSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uTGFiZWxzKCkge1xuICAgIHJldHVybiBhcmNDb2x1bW5MYWJlbHM7XG4gIH1cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMaW5rQ29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUNvbG9yOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLmNvbG9yLFxuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAga2V5OiAnc291cmNlQ29sb3InLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFNvdXJjZUNvbG9yJyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBjb25maWcgPT4gY29uZmlnLmNvbG9yXG4gICAgICB9LFxuICAgICAgdGFyZ2V0Q29sb3I6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIHByb3BlcnR5OiAndGFyZ2V0Q29sb3InLFxuICAgICAgICBrZXk6ICd0YXJnZXRDb2xvcicsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0VGFyZ2V0Q29sb3InLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLnRhcmdldENvbG9yIHx8IGNvbmZpZy5jb2xvclxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRXaWR0aCcsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW119KSB7XG4gICAgaWYgKGZpZWxkUGFpcnMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIHtwcm9wczogW119O1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgY29sb3I6IGhleFRvUmdiKERFRkFVTFRfTEFZRVJfQ09MT1IudHJpcEFyYylcbiAgICB9O1xuXG4gICAgLy8gY29ubmVjdCB0aGUgZmlyc3QgdHdvIHBvaW50IGxheWVyIHdpdGggYXJjXG4gICAgcHJvcHMuY29sdW1ucyA9IHtcbiAgICAgIGxhdDA6IGZpZWxkUGFpcnNbMF0ucGFpci5sYXQsXG4gICAgICBsbmcwOiBmaWVsZFBhaXJzWzBdLnBhaXIubG5nLFxuICAgICAgbGF0MTogZmllbGRQYWlyc1sxXS5wYWlyLmxhdCxcbiAgICAgIGxuZzE6IGZpZWxkUGFpcnNbMV0ucGFpci5sbmdcbiAgICB9O1xuICAgIHByb3BzLmxhYmVsID0gYCR7ZmllbGRQYWlyc1swXS5kZWZhdWx0TmFtZX0gLT4gJHtmaWVsZFBhaXJzWzFdLmRlZmF1bHROYW1lfSBhcmNgO1xuXG4gICAgcmV0dXJuIHtwcm9wczogW3Byb3BzXX07XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4fSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIGluZGV4LFxuICAgICAgICAgIHNvdXJjZVBvc2l0aW9uOiBbcG9zWzBdLCBwb3NbMV0sIHBvc1syXV0sXG4gICAgICAgICAgdGFyZ2V0UG9zaXRpb246IFtwb3NbM10sIHBvc1s0XSwgcG9zWzVdXSxcbiAgICAgICAgICBkYXRhOiBhbGxEYXRhW2luZGV4XVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKSB7XG4gICAgY29uc3Qge2dwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLmdldEF0dHJpYnV0ZUFjY2Vzc29ycygpO1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKCksXG4gICAgICAuLi5hY2Nlc3NvcnNcbiAgICB9O1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhKSB7XG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIGFyY3NcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuXG4gICAgY29uc3Qgc0JvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzBdLCBwb3NbMV1dO1xuICAgIH0pO1xuICAgIGNvbnN0IHRCb3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBkfSk7XG4gICAgICByZXR1cm4gW3Bvc1szXSwgcG9zWzRdXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvdW5kcyA9XG4gICAgICB0Qm91bmRzICYmIHNCb3VuZHNcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBNYXRoLm1pbihzQm91bmRzWzBdLCB0Qm91bmRzWzBdKSxcbiAgICAgICAgICAgIE1hdGgubWluKHNCb3VuZHNbMV0sIHRCb3VuZHNbMV0pLFxuICAgICAgICAgICAgTWF0aC5tYXgoc0JvdW5kc1syXSwgdEJvdW5kc1syXSksXG4gICAgICAgICAgICBNYXRoLm1heChzQm91bmRzWzNdLCB0Qm91bmRzWzNdKVxuICAgICAgICAgIF1cbiAgICAgICAgOiBzQm91bmRzIHx8IHRCb3VuZHM7XG5cbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXIsIG9iamVjdEhvdmVyZWQsIGludGVyYWN0aW9uQ29uZmlnfSA9IG9wdHM7XG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRQb3NpdGlvbjogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyxcbiAgICAgIC4uLnRoaXMuZ2V0VmlzdWFsQ2hhbm5lbFVwZGF0ZVRyaWdnZXJzKClcbiAgICB9O1xuICAgIGNvbnN0IGRlZmF1bHRMYXllclByb3BzID0gdGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyk7XG4gICAgY29uc3QgaG92ZXJlZE9iamVjdCA9IHRoaXMuaGFzSG92ZXJlZE9iamVjdChvYmplY3RIb3ZlcmVkKTtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IERlY2tBcmNMYXllcih7XG4gICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAuLi50aGlzLmdldEJydXNoaW5nRXh0ZW5zaW9uUHJvcHMoaW50ZXJhY3Rpb25Db25maWcsICdzb3VyY2VfdGFyZ2V0JyksXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHdpZHRoU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICBleHRlbnNpb25zOiBbLi4uZGVmYXVsdExheWVyUHJvcHMuZXh0ZW5zaW9ucywgbmV3IEJydXNoaW5nRXh0ZW5zaW9uKCldXG4gICAgICB9KSxcbiAgICAgIC8vIGhvdmVyIGxheWVyXG4gICAgICAuLi4oaG92ZXJlZE9iamVjdFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBEZWNrQXJjTGF5ZXIoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgZGF0YTogW2hvdmVyZWRPYmplY3RdLFxuICAgICAgICAgICAgICB3aWR0aFNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzLFxuICAgICAgICAgICAgICBnZXRTb3VyY2VDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGdldFRhcmdldENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0V2lkdGg6IGRhdGEuZ2V0V2lkdGhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKVxuICAgIF07XG4gIH1cbn1cbiJdfQ==