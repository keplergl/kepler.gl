"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.HexagonIdVisConfigs = exports.defaultCoverage = exports.defaultElevation = exports.hexIdAccessor = exports.hexIdRequiredColumns = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _datasetUtils = require("../../utils/dataset-utils");

var _layers = require("@deck.gl/layers");

var _geoLayers = require("@deck.gl/geo-layers");

var _enhancedColumnLayer = _interopRequireDefault(require("../../deckgl-layers/column-layer/enhanced-column-layer"));

var _h3Utils = require("./h3-utils");

var _h3HexagonLayerIcon = _interopRequireDefault(require("./h3-hexagon-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DEFAULT_LINE_SCALE_VALUE = 8;
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
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor'
};
exports.HexagonIdVisConfigs = HexagonIdVisConfigs;

var HexagonIdLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(HexagonIdLayer, _Layer);

  var _super = _createSuper(HexagonIdLayer);

  function HexagonIdLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, HexagonIdLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(HexagonIdVisConfigs);

    _this.getPositionAccessor = function () {
      return hexIdAccessor(_this.config.columns);
    };

    return _this;
  }

  (0, _createClass2["default"])(HexagonIdLayer, [{
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
      var visualChannels = (0, _get2["default"])((0, _getPrototypeOf2["default"])(HexagonIdLayer.prototype), "visualChannels", this);
      return {
        color: _objectSpread(_objectSpread({}, visualChannels.color), {}, {
          accessor: 'getFillColor'
        }),
        size: _objectSpread(_objectSpread({}, visualChannels.size), {}, {
          property: 'height',
          accessor: 'getElevation',
          nullValue: 0,
          condition: function condition(config) {
            return config.visConfig.enable3d;
          },
          defaultValue: defaultElevation
        }),
        coverage: {
          property: 'coverage',
          field: 'coverageField',
          scale: 'coverageScale',
          domain: 'coverageDomain',
          range: 'coverageRange',
          key: 'coverage',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.radius,
          accessor: 'getCoverage',
          nullValue: 0,
          defaultValue: defaultCoverage
        }
      };
    }
  }, {
    key: "setInitialLayerConfig",
    value: function setInitialLayerConfig(dataset) {
      var defaultColorField = (0, _datasetUtils.findDefaultColorField)(dataset);

      if (defaultColorField) {
        this.updateLayerConfig({
          colorField: defaultColorField
        });
        this.updateLayerVisualChannel(dataset, 'color');
      }

      return this;
    }
  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(HexagonIdLayer.prototype), "getDefaultLayerConfig", this).call(this, props)), {}, {
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
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var gpuFilter = datasets[this.config.dataId].gpuFilter;
      var getHexId = this.getPositionAccessor();

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data;

      var accessors = this.getAttributeAccessors();
      return _objectSpread({
        data: data,
        getHexId: getHexId,
        getFilterValue: gpuFilter.filterValueAccessor()
      }, accessors);
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
      var updateTriggers = this.getVisualChannelUpdateTriggers();
      var h3HexagonLayerTriggers = {
        getHexagon: this.config.columns,
        getFillColor: updateTriggers.getFillColor,
        getElevation: updateTriggers.getElevation,
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      };
      var columnLayerTriggers = {
        getCoverage: updateTriggers.getCoverage
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var hoveredObject = this.hasHoveredObject(objectHovered);
      return [new _geoLayers.H3HexagonLayer(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), data), {}, {
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
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject && !config.sizeField ? [new _layers.GeoJsonLayer(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), {}, {
        data: [(0, _h3Utils.idToPolygonGeo)(hoveredObject)],
        getLineColor: config.highlightColor,
        lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
        wrapLongitude: false
      }))] : []));
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref3) {
      var _ref3$fields = _ref3.fields,
          fields = _ref3$fields === void 0 ? [] : _ref3$fields,
          _ref3$allData = _ref3.allData,
          allData = _ref3$allData === void 0 ? [] : _ref3$allData;
      var hexFields = (0, _h3Utils.getHexFields)(fields, allData);

      if (!hexFields.length) {
        return {
          props: []
        };
      }

      return {
        props: hexFields.map(function (f) {
          return {
            isVisible: true,
            label: f.displayName || f.name,
            columns: {
              hex_id: {
                value: f.name,
                fieldIdx: fields.findIndex(function (fid) {
                  return fid.name === f.name;
                })
              }
            }
          };
        })
      };
    }
  }]);
  return HexagonIdLayer;
}(_baseLayer["default"]);

exports["default"] = HexagonIdLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTElORV9TQ0FMRV9WQUxVRSIsImhleElkUmVxdWlyZWRDb2x1bW5zIiwiaGV4SWRBY2Nlc3NvciIsImhleF9pZCIsImQiLCJkYXRhIiwiZmllbGRJZHgiLCJkZWZhdWx0RWxldmF0aW9uIiwiZGVmYXVsdENvdmVyYWdlIiwiSGV4YWdvbklkVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwiY292ZXJhZ2UiLCJlbmFibGUzZCIsInNpemVSYW5nZSIsImNvdmVyYWdlUmFuZ2UiLCJlbGV2YXRpb25TY2FsZSIsImVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3IiLCJIZXhhZ29uSWRMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsIkgzSGV4YWdvbkxheWVySWNvbiIsInZpc3VhbENoYW5uZWxzIiwiY29sb3IiLCJhY2Nlc3NvciIsInNpemUiLCJwcm9wZXJ0eSIsIm51bGxWYWx1ZSIsImNvbmRpdGlvbiIsInZpc0NvbmZpZyIsImRlZmF1bHRWYWx1ZSIsImZpZWxkIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImtleSIsImNoYW5uZWxTY2FsZVR5cGUiLCJDSEFOTkVMX1NDQUxFUyIsInJhZGl1cyIsImRhdGFzZXQiLCJkZWZhdWx0Q29sb3JGaWVsZCIsInVwZGF0ZUxheWVyQ29uZmlnIiwiY29sb3JGaWVsZCIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsImNvdmVyYWdlRmllbGQiLCJjb3ZlcmFnZURvbWFpbiIsImNvdmVyYWdlU2NhbGUiLCJnZXRIZXhJZCIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiaSIsImxlbmd0aCIsImluZGV4IiwiaWQiLCJjZW50cm9pZCIsImRhdGFUb0ZlYXR1cmUiLCJjZW50cm9pZHMiLCJwdXNoIiwiZGF0YXNldHMiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJncHVGaWx0ZXIiLCJkYXRhSWQiLCJ1cGRhdGVEYXRhIiwiYWNjZXNzb3JzIiwiZ2V0QXR0cmlidXRlQWNjZXNzb3JzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwibWFwIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJ6b29tRmFjdG9yIiwiZ2V0Wm9vbUZhY3RvciIsImVsZVpvb21GYWN0b3IiLCJnZXRFbGV2YXRpb25ab29tRmFjdG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMiLCJoM0hleGFnb25MYXllclRyaWdnZXJzIiwiZ2V0SGV4YWdvbiIsImdldEZpbGxDb2xvciIsImdldEVsZXZhdGlvbiIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJjb2x1bW5MYXllclRyaWdnZXJzIiwiZ2V0Q292ZXJhZ2UiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImhvdmVyZWRPYmplY3QiLCJoYXNIb3ZlcmVkT2JqZWN0IiwiSDNIZXhhZ29uTGF5ZXIiLCJ3cmFwTG9uZ2l0dWRlIiwieCIsImF1dG9IaWdobGlnaHQiLCJoaWdobGlnaHRDb2xvciIsIkhJR0hMSUdIX0NPTE9SXzNEIiwiZXh0cnVkZWQiLCJfc3ViTGF5ZXJQcm9wcyIsInR5cGUiLCJFbmhhbmNlZENvbHVtbkxheWVyIiwic2l6ZUZpZWxkIiwiR2VvSnNvbkxheWVyIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsImdldExpbmVDb2xvciIsImxpbmVXaWR0aFNjYWxlIiwiZmllbGRzIiwiaGV4RmllbGRzIiwiZiIsImlzVmlzaWJsZSIsImxhYmVsIiwiZGlzcGxheU5hbWUiLCJuYW1lIiwidmFsdWUiLCJmaW5kSW5kZXgiLCJmaWQiLCJMYXllciJd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QUE1QkEsTUFBNEIsNkJBQW5CLEVBQW1CO0FBQUEsZ0NBQWYzRCxPQUFlO0FBQUEsVUFBZkEsT0FBZSw4QkFBTCxFQUFLO0FBQ3hELFVBQU00RCxTQUFTLEdBQUcsMkJBQWFELE1BQWIsRUFBcUIzRCxPQUFyQixDQUFsQjs7QUFDQSxVQUFJLENBQUM0RCxTQUFTLENBQUN6RCxNQUFmLEVBQXVCO0FBQ3JCLGVBQU87QUFBQ25DLFVBQUFBLEtBQUssRUFBRTtBQUFSLFNBQVA7QUFDRDs7QUFFRCxhQUFPO0FBQ0xBLFFBQUFBLEtBQUssRUFBRTRGLFNBQVMsQ0FBQ3hDLEdBQVYsQ0FBYyxVQUFBeUMsQ0FBQztBQUFBLGlCQUFLO0FBQ3pCQyxZQUFBQSxTQUFTLEVBQUUsSUFEYztBQUV6QkMsWUFBQUEsS0FBSyxFQUFFRixDQUFDLENBQUNHLFdBQUYsSUFBaUJILENBQUMsQ0FBQ0ksSUFGRDtBQUd6QjdGLFlBQUFBLE9BQU8sRUFBRTtBQUNQcEIsY0FBQUEsTUFBTSxFQUFFO0FBQ05rSCxnQkFBQUEsS0FBSyxFQUFFTCxDQUFDLENBQUNJLElBREg7QUFFTjlHLGdCQUFBQSxRQUFRLEVBQUV3RyxNQUFNLENBQUNRLFNBQVAsQ0FBaUIsVUFBQUMsR0FBRztBQUFBLHlCQUFJQSxHQUFHLENBQUNILElBQUosS0FBYUosQ0FBQyxDQUFDSSxJQUFuQjtBQUFBLGlCQUFwQjtBQUZKO0FBREQ7QUFIZ0IsV0FBTDtBQUFBLFNBQWY7QUFERixPQUFQO0FBWUQ7OztFQXJGeUNJLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtmaW5kRGVmYXVsdENvbG9yRmllbGR9IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuaW1wb3J0IHtHZW9Kc29uTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQge0gzSGV4YWdvbkxheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcbmltcG9ydCBFbmhhbmNlZENvbHVtbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvY29sdW1uLWxheWVyL2VuaGFuY2VkLWNvbHVtbi1sYXllcic7XG5pbXBvcnQge2dldENlbnRyb2lkLCBpZFRvUG9seWdvbkdlbywgaDNJc1ZhbGlkLCBnZXRIZXhGaWVsZHN9IGZyb20gJy4vaDMtdXRpbHMnO1xuaW1wb3J0IEgzSGV4YWdvbkxheWVySWNvbiBmcm9tICcuL2gzLWhleGFnb24tbGF5ZXItaWNvbic7XG5pbXBvcnQge0NIQU5ORUxfU0NBTEVTLCBISUdITElHSF9DT0xPUl8zRH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBERUZBVUxUX0xJTkVfU0NBTEVfVkFMVUUgPSA4O1xuXG5leHBvcnQgY29uc3QgaGV4SWRSZXF1aXJlZENvbHVtbnMgPSBbJ2hleF9pZCddO1xuZXhwb3J0IGNvbnN0IGhleElkQWNjZXNzb3IgPSAoe2hleF9pZH0pID0+IGQgPT4gZC5kYXRhW2hleF9pZC5maWVsZElkeF07XG5leHBvcnQgY29uc3QgZGVmYXVsdEVsZXZhdGlvbiA9IDUwMDtcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q292ZXJhZ2UgPSAxO1xuXG5leHBvcnQgY29uc3QgSGV4YWdvbklkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIGNvdmVyYWdlOiAnY292ZXJhZ2UnLFxuICBlbmFibGUzZDogJ2VuYWJsZTNkJyxcbiAgc2l6ZVJhbmdlOiAnZWxldmF0aW9uUmFuZ2UnLFxuICBjb3ZlcmFnZVJhbmdlOiAnY292ZXJhZ2VSYW5nZScsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yOiAnZW5hYmxlRWxldmF0aW9uWm9vbUZhY3Rvcidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhleGFnb25JZExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKEhleGFnb25JZFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IGhleElkQWNjZXNzb3IodGhpcy5jb25maWcuY29sdW1ucyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2hleGFnb25JZCc7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gJ0gzJztcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gaGV4SWRSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIC8vIHVzZSBoZXhhZ29uIGxheWVyIGljb24gZm9yIG5vd1xuICAgIHJldHVybiBIM0hleGFnb25MYXllckljb247XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbHMgPSBzdXBlci52aXN1YWxDaGFubmVscztcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0RmlsbENvbG9yJ1xuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4udmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldEVsZXZhdGlvbicsXG4gICAgICAgIG51bGxWYWx1ZTogMCxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0RWxldmF0aW9uXG4gICAgICB9LFxuICAgICAgY292ZXJhZ2U6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb3ZlcmFnZScsXG4gICAgICAgIGZpZWxkOiAnY292ZXJhZ2VGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY292ZXJhZ2VTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvdmVyYWdlRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb3ZlcmFnZVJhbmdlJyxcbiAgICAgICAga2V5OiAnY292ZXJhZ2UnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5yYWRpdXMsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0Q292ZXJhZ2UnLFxuICAgICAgICBudWxsVmFsdWU6IDAsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdENvdmVyYWdlXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHNldEluaXRpYWxMYXllckNvbmZpZyhkYXRhc2V0KSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yRmllbGQgPSBmaW5kRGVmYXVsdENvbG9yRmllbGQoZGF0YXNldCk7XG5cbiAgICBpZiAoZGVmYXVsdENvbG9yRmllbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgICBjb2xvckZpZWxkOiBkZWZhdWx0Q29sb3JGaWVsZFxuICAgICAgfSk7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbChkYXRhc2V0LCAnY29sb3InKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2ZpZWxkcyA9IFtdLCBhbGxEYXRhID0gW119KSB7XG4gICAgY29uc3QgaGV4RmllbGRzID0gZ2V0SGV4RmllbGRzKGZpZWxkcywgYWxsRGF0YSk7XG4gICAgaWYgKCFoZXhGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge3Byb3BzOiBbXX07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3BzOiBoZXhGaWVsZHMubWFwKGYgPT4gKHtcbiAgICAgICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgICAgICBsYWJlbDogZi5kaXNwbGF5TmFtZSB8fCBmLm5hbWUsXG4gICAgICAgIGNvbHVtbnM6IHtcbiAgICAgICAgICBoZXhfaWQ6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmLm5hbWUsXG4gICAgICAgICAgICBmaWVsZElkeDogZmllbGRzLmZpbmRJbmRleChmaWQgPT4gZmlkLm5hbWUgPT09IGYubmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMpLFxuXG4gICAgICAvLyBhZGQgaGVpZ2h0IHZpc3VhbCBjaGFubmVsXG4gICAgICBjb3ZlcmFnZUZpZWxkOiBudWxsLFxuICAgICAgY292ZXJhZ2VEb21haW46IFswLCAxXSxcbiAgICAgIGNvdmVyYWdlU2NhbGU6ICdsaW5lYXInXG4gICAgfTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXh9LCBnZXRIZXhJZCkge1xuICAgIGNvbnN0IGRhdGEgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyZWRJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSBmaWx0ZXJlZEluZGV4W2ldO1xuICAgICAgY29uc3QgaWQgPSBnZXRIZXhJZCh7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcbiAgICAgIGNvbnN0IGNlbnRyb2lkID0gdGhpcy5kYXRhVG9GZWF0dXJlLmNlbnRyb2lkc1tpbmRleF07XG5cbiAgICAgIGlmIChjZW50cm9pZCkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIGRhdGEgaW5kZXhcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBkYXRhOiBhbGxEYXRhW2luZGV4XSxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50cm9pZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvLyBUT0RPOiBmaXggY29tcGxleGl0eVxuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtncHVGaWx0ZXJ9ID0gZGF0YXNldHNbdGhpcy5jb25maWcuZGF0YUlkXTtcbiAgICBjb25zdCBnZXRIZXhJZCA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMudXBkYXRlRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLmdldEF0dHJpYnV0ZUFjY2Vzc29ycygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRIZXhJZCxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcigpLFxuICAgICAgLi4uYWNjZXNzb3JzXG4gICAgfTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0SGV4SWQpIHtcbiAgICBjb25zdCBjZW50cm9pZHMgPSBhbGxEYXRhLm1hcCgoZCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gZ2V0SGV4SWQoe2RhdGE6IGR9KTtcbiAgICAgIGlmICghaDNJc1ZhbGlkKGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2Ugb2YgY2VudHJvaWRzIHRvIGRhdGFUb0ZlYXR1cmVcbiAgICAgIC8vIHNvIHdlIGRvbid0IGhhdmUgdG8gcmUgY2FsY3VsYXRlIGl0IGFnYWluXG4gICAgICByZXR1cm4gZ2V0Q2VudHJvaWQoe2lkfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhjZW50cm9pZHMpO1xuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHtjZW50cm9pZHN9O1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGV9ID0gb3B0cztcblxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IHtjb25maWd9ID0gdGhpcztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IGNvbmZpZztcbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHRoaXMuZ2V0VmlzdWFsQ2hhbm5lbFVwZGF0ZVRyaWdnZXJzKCk7XG5cbiAgICBjb25zdCBoM0hleGFnb25MYXllclRyaWdnZXJzID0ge1xuICAgICAgZ2V0SGV4YWdvbjogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIGdldEZpbGxDb2xvcjogdXBkYXRlVHJpZ2dlcnMuZ2V0RmlsbENvbG9yLFxuICAgICAgZ2V0RWxldmF0aW9uOiB1cGRhdGVUcmlnZ2Vycy5nZXRFbGV2YXRpb24sXG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICB9O1xuXG4gICAgY29uc3QgY29sdW1uTGF5ZXJUcmlnZ2VycyA9IHtcbiAgICAgIGdldENvdmVyYWdlOiB1cGRhdGVUcmlnZ2Vycy5nZXRDb3ZlcmFnZVxuICAgIH07XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIGNvbnN0IGhvdmVyZWRPYmplY3QgPSB0aGlzLmhhc0hvdmVyZWRPYmplY3Qob2JqZWN0SG92ZXJlZCk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IEgzSGV4YWdvbkxheWVyKHtcbiAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHdyYXBMb25naXR1ZGU6IGZhbHNlLFxuXG4gICAgICAgIGdldEhleGFnb246IHggPT4geC5pZCxcblxuICAgICAgICAvLyBjb3ZlcmFnZVxuICAgICAgICBjb3ZlcmFnZTogY29uZmlnLmNvdmVyYWdlRmllbGQgPyAxIDogdmlzQ29uZmlnLmNvdmVyYWdlLFxuXG4gICAgICAgIC8vIGhpZ2hsaWdodFxuICAgICAgICBhdXRvSGlnaGxpZ2h0OiB2aXNDb25maWcuZW5hYmxlM2QsXG4gICAgICAgIGhpZ2hsaWdodENvbG9yOiBISUdITElHSF9DT0xPUl8zRCxcblxuICAgICAgICAvLyBlbGV2YXRpb25cbiAgICAgICAgZXh0cnVkZWQ6IHZpc0NvbmZpZy5lbmFibGUzZCxcbiAgICAgICAgZWxldmF0aW9uU2NhbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSAqIGVsZVpvb21GYWN0b3IsXG5cbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiBoM0hleGFnb25MYXllclRyaWdnZXJzLFxuICAgICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAgICdoZXhhZ29uLWNlbGwnOiB7XG4gICAgICAgICAgICB0eXBlOiBFbmhhbmNlZENvbHVtbkxheWVyLFxuICAgICAgICAgICAgZ2V0Q292ZXJhZ2U6IGRhdGEuZ2V0Q292ZXJhZ2UsXG4gICAgICAgICAgICB1cGRhdGVUcmlnZ2VyczogY29sdW1uTGF5ZXJUcmlnZ2Vyc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAuLi4oaG92ZXJlZE9iamVjdCAmJiAhY29uZmlnLnNpemVGaWVsZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgZGF0YTogW2lkVG9Qb2x5Z29uR2VvKGhvdmVyZWRPYmplY3QpXSxcbiAgICAgICAgICAgICAgZ2V0TGluZUNvbG9yOiBjb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgIGxpbmVXaWR0aFNjYWxlOiBERUZBVUxUX0xJTkVfU0NBTEVfVkFMVUUgKiB6b29tRmFjdG9yLFxuICAgICAgICAgICAgICB3cmFwTG9uZ2l0dWRlOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19