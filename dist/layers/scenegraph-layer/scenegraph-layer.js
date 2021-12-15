"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.scenegraphVisConfigs = exports.scenegraphPosAccessor = exports.scenegraphOptionalColumns = exports.scenegraphRequiredColumns = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _meshLayers = require("@deck.gl/mesh-layers");

var _core = require("@loaders.gl/core");

var _gltf = require("@loaders.gl/gltf");

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _scenegraphLayerIcon = _interopRequireDefault(require("./scenegraph-layer-icon"));

var _scenegraphInfoModal = _interopRequireDefault(require("./scenegraph-info-modal"));

var _layerFactory = require("../layer-factory");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var scenegraphRequiredColumns = ['lat', 'lng'];
exports.scenegraphRequiredColumns = scenegraphRequiredColumns;
var scenegraphOptionalColumns = ['altitude'];
exports.scenegraphOptionalColumns = scenegraphOptionalColumns;

function fetch(url, _ref) {
  var propName = _ref.propName,
      layer = _ref.layer;

  if (propName === 'scenegraph') {
    return (0, _core.load)(url, _gltf.GLTFLoader, layer.getLoadOptions());
  }

  return fetch(url).then(function (response) {
    return response.json();
  });
}

var scenegraphPosAccessor = function scenegraphPosAccessor(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng,
      altitude = _ref2.altitude;
  return function (d) {
    return [// lng
    d.data[lng.fieldIdx], // lat
    d.data[lat.fieldIdx], // altitude
    altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0];
  };
};

exports.scenegraphPosAccessor = scenegraphPosAccessor;
var scenegraphVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  //
  sizeScale: 'sizeScale',
  angleX: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.angle), {}, {
    property: 'angleX',
    label: 'angle X'
  }),
  angleY: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.angle), {}, {
    property: 'angleY',
    label: 'angle Y'
  }),
  angleZ: _objectSpread(_objectSpread({}, _layerFactory.LAYER_VIS_CONFIGS.angle), {}, {
    property: 'angleZ',
    defaultValue: 90,
    label: 'angle Z'
  })
};
exports.scenegraphVisConfigs = scenegraphVisConfigs;
var DEFAULT_MODEL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb';
var DEFAULT_TRANSITION = [0, 0, 0];
var DEFAULT_SCALE = [1, 1, 1];
var DEFAULT_COLOR = [255, 255, 255, 255];

var ScenegraphLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(ScenegraphLayer, _Layer);

  var _super = _createSuper(ScenegraphLayer);

  function ScenegraphLayer(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ScenegraphLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(scenegraphVisConfigs);

    _this.getPositionAccessor = function () {
      return scenegraphPosAccessor(_this.config.columns);
    }; // prepare layer info modal


    _this._layerInfoModal = (0, _scenegraphInfoModal["default"])();
    return _this;
  }

  (0, _createClass2["default"])(ScenegraphLayer, [{
    key: "type",
    get: function get() {
      return '3D';
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return scenegraphRequiredColumns;
    }
  }, {
    key: "optionalColumns",
    get: function get() {
      return scenegraphOptionalColumns;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _scenegraphLayerIcon["default"];
    }
  }, {
    key: "layerInfoModal",
    get: function get() {
      return {
        id: 'scenegraphInfo',
        template: this._layerInfoModal,
        modalProps: {
          title: 'How to use Scenegraph'
        }
      };
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref3, getPosition) {
      var allData = _ref3.allData,
          filteredIndex = _ref3.filteredIndex;
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var pos = getPosition({
          data: allData[index]
        }); // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null

        if (pos.every(Number.isFinite)) {
          data.push({
            data: allData[index],
            position: pos,
            // index is important for filter
            index: index
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

      var getPosition = this.getPositionAccessor();
      return {
        data: data,
        getPosition: getPosition,
        getFilterValue: gpuFilter.filterValueAccessor()
      };
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getPosition) {
      var bounds = this.getPointsBounds(allData, function (d) {
        return getPosition({
          data: d
        });
      });
      this.updateMeta({
        bounds: bounds
      });
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter;
      var _this$config$visConfi = this.config.visConfig,
          _this$config$visConfi2 = _this$config$visConfi.sizeScale,
          sizeScale = _this$config$visConfi2 === void 0 ? 1 : _this$config$visConfi2,
          _this$config$visConfi3 = _this$config$visConfi.angleX,
          angleX = _this$config$visConfi3 === void 0 ? 0 : _this$config$visConfi3,
          _this$config$visConfi4 = _this$config$visConfi.angleY,
          angleY = _this$config$visConfi4 === void 0 ? 0 : _this$config$visConfi4,
          _this$config$visConfi5 = _this$config$visConfi.angleZ,
          angleZ = _this$config$visConfi5 === void 0 ? 90 : _this$config$visConfi5;
      return [new _meshLayers.ScenegraphLayer(_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultDeckLayerProps(opts)), data), {}, {
        fetch: fetch,
        scenegraph: this.config.visConfig.scenegraph || DEFAULT_MODEL,
        sizeScale: sizeScale,
        getTranslation: DEFAULT_TRANSITION,
        getScale: DEFAULT_SCALE,
        getOrientation: [angleX, angleY, angleZ],
        getColor: DEFAULT_COLOR,
        // parameters
        parameters: {
          depthTest: true,
          blend: false
        },
        // update triggers
        updateTriggers: {
          getOrientation: {
            angleX: angleX,
            angleY: angleY,
            angleZ: angleZ
          },
          getPosition: this.config.columns,
          getFilterValue: gpuFilter.filterValueUpdateTriggers
        }
      }))];
    }
  }]);
  return ScenegraphLayer;
}(_baseLayer["default"]);

exports["default"] = ScenegraphLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvc2NlbmVncmFwaC1sYXllci9zY2VuZWdyYXBoLWxheWVyLmpzIl0sIm5hbWVzIjpbInNjZW5lZ3JhcGhSZXF1aXJlZENvbHVtbnMiLCJzY2VuZWdyYXBoT3B0aW9uYWxDb2x1bW5zIiwiZmV0Y2giLCJ1cmwiLCJwcm9wTmFtZSIsImxheWVyIiwiR0xURkxvYWRlciIsImdldExvYWRPcHRpb25zIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInNjZW5lZ3JhcGhQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInNjZW5lZ3JhcGhWaXNDb25maWdzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzaXplU2NhbGUiLCJhbmdsZVgiLCJMQVlFUl9WSVNfQ09ORklHUyIsImFuZ2xlIiwicHJvcGVydHkiLCJsYWJlbCIsImFuZ2xlWSIsImFuZ2xlWiIsImRlZmF1bHRWYWx1ZSIsIkRFRkFVTFRfTU9ERUwiLCJERUZBVUxUX1RSQU5TSVRJT04iLCJERUZBVUxUX1NDQUxFIiwiREVGQVVMVF9DT0xPUiIsIlNjZW5lZ3JhcGhMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsIl9sYXllckluZm9Nb2RhbCIsImRlZmF1bHRQb2ludENvbHVtblBhaXJzIiwiU2NlbmVncmFwaExheWVySWNvbiIsImlkIiwidGVtcGxhdGUiLCJtb2RhbFByb3BzIiwidGl0bGUiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiaSIsImxlbmd0aCIsImluZGV4IiwicG9zIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInB1c2giLCJwb3NpdGlvbiIsImRhdGFzZXRzIiwib2xkTGF5ZXJEYXRhIiwiZ3B1RmlsdGVyIiwiZGF0YUlkIiwidXBkYXRlRGF0YSIsImdldEZpbHRlclZhbHVlIiwiZmlsdGVyVmFsdWVBY2Nlc3NvciIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsInVwZGF0ZU1ldGEiLCJvcHRzIiwidmlzQ29uZmlnIiwiRGVja1NjZW5lZ3JhcGhMYXllciIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsInNjZW5lZ3JhcGgiLCJnZXRUcmFuc2xhdGlvbiIsImdldFNjYWxlIiwiZ2V0T3JpZW50YXRpb24iLCJnZXRDb2xvciIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJibGVuZCIsInVwZGF0ZVRyaWdnZXJzIiwiZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSx5QkFBeUIsR0FBRyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQWxDOztBQUNBLElBQU1DLHlCQUF5QixHQUFHLENBQUMsVUFBRCxDQUFsQzs7O0FBRVAsU0FBU0MsS0FBVCxDQUFlQyxHQUFmLFFBQXVDO0FBQUEsTUFBbEJDLFFBQWtCLFFBQWxCQSxRQUFrQjtBQUFBLE1BQVJDLEtBQVEsUUFBUkEsS0FBUTs7QUFDckMsTUFBSUQsUUFBUSxLQUFLLFlBQWpCLEVBQStCO0FBQzdCLFdBQU8sZ0JBQUtELEdBQUwsRUFBVUcsZ0JBQVYsRUFBc0JELEtBQUssQ0FBQ0UsY0FBTixFQUF0QixDQUFQO0FBQ0Q7O0FBRUQsU0FBT0wsS0FBSyxDQUFDQyxHQUFELENBQUwsQ0FBV0ssSUFBWCxDQUFnQixVQUFBQyxRQUFRO0FBQUEsV0FBSUEsUUFBUSxDQUFDQyxJQUFULEVBQUo7QUFBQSxHQUF4QixDQUFQO0FBQ0Q7O0FBRU0sSUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QjtBQUFBLE1BQUVDLEdBQUYsU0FBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsU0FBT0EsR0FBUDtBQUFBLE1BQVlDLFFBQVosU0FBWUEsUUFBWjtBQUFB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Q3RELFlBQUFBLE1BQU0sRUFBTkEsTUFBRDtBQUFTSyxZQUFBQSxNQUFNLEVBQU5BLE1BQVQ7QUFBaUJDLFlBQUFBLE1BQU0sRUFBTkE7QUFBakIsV0FERjtBQUVkbUIsVUFBQUEsV0FBVyxFQUFFLEtBQUtULE1BQUwsQ0FBWUMsT0FGWDtBQUdkeUIsVUFBQUEsY0FBYyxFQUFFSCxTQUFTLENBQUNxQjtBQUhaO0FBYmxCLFNBREssQ0FBUDtBQXFCRDs7O0VBMUcwQ0MscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge1NjZW5lZ3JhcGhMYXllciBhcyBEZWNrU2NlbmVncmFwaExheWVyfSBmcm9tICdAZGVjay5nbC9tZXNoLWxheWVycyc7XG5pbXBvcnQge2xvYWR9IGZyb20gJ0Bsb2FkZXJzLmdsL2NvcmUnO1xuaW1wb3J0IHtHTFRGTG9hZGVyfSBmcm9tICdAbG9hZGVycy5nbC9nbHRmJztcblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IFNjZW5lZ3JhcGhMYXllckljb24gZnJvbSAnLi9zY2VuZWdyYXBoLWxheWVyLWljb24nO1xuaW1wb3J0IFNjZW5lZ3JhcGhJbmZvTW9kYWxGYWN0b3J5IGZyb20gJy4vc2NlbmVncmFwaC1pbmZvLW1vZGFsJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcblxuZXhwb3J0IGNvbnN0IHNjZW5lZ3JhcGhSZXF1aXJlZENvbHVtbnMgPSBbJ2xhdCcsICdsbmcnXTtcbmV4cG9ydCBjb25zdCBzY2VuZWdyYXBoT3B0aW9uYWxDb2x1bW5zID0gWydhbHRpdHVkZSddO1xuXG5mdW5jdGlvbiBmZXRjaCh1cmwsIHtwcm9wTmFtZSwgbGF5ZXJ9KSB7XG4gIGlmIChwcm9wTmFtZSA9PT0gJ3NjZW5lZ3JhcGgnKSB7XG4gICAgcmV0dXJuIGxvYWQodXJsLCBHTFRGTG9hZGVyLCBsYXllci5nZXRMb2FkT3B0aW9ucygpKTtcbiAgfVxuXG4gIHJldHVybiBmZXRjaCh1cmwpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNjZW5lZ3JhcGhQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIC8vIGxuZ1xuICBkLmRhdGFbbG5nLmZpZWxkSWR4XSxcbiAgLy8gbGF0XG4gIGQuZGF0YVtsYXQuZmllbGRJZHhdLFxuICAvLyBhbHRpdHVkZVxuICBhbHRpdHVkZSAmJiBhbHRpdHVkZS5maWVsZElkeCA+IC0xID8gZC5kYXRhW2FsdGl0dWRlLmZpZWxkSWR4XSA6IDBcbl07XG5cbmV4cG9ydCBjb25zdCBzY2VuZWdyYXBoVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIC8vXG4gIHNpemVTY2FsZTogJ3NpemVTY2FsZScsXG4gIGFuZ2xlWDoge1xuICAgIC4uLkxBWUVSX1ZJU19DT05GSUdTLmFuZ2xlLFxuICAgIHByb3BlcnR5OiAnYW5nbGVYJyxcbiAgICBsYWJlbDogJ2FuZ2xlIFgnXG4gIH0sXG4gIGFuZ2xlWToge1xuICAgIC4uLkxBWUVSX1ZJU19DT05GSUdTLmFuZ2xlLFxuICAgIHByb3BlcnR5OiAnYW5nbGVZJyxcbiAgICBsYWJlbDogJ2FuZ2xlIFknXG4gIH0sXG4gIGFuZ2xlWjoge1xuICAgIC4uLkxBWUVSX1ZJU19DT05GSUdTLmFuZ2xlLFxuICAgIHByb3BlcnR5OiAnYW5nbGVaJyxcbiAgICBkZWZhdWx0VmFsdWU6IDkwLFxuICAgIGxhYmVsOiAnYW5nbGUgWidcbiAgfVxufTtcblxuY29uc3QgREVGQVVMVF9NT0RFTCA9XG4gICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vS2hyb25vc0dyb3VwL2dsVEYtU2FtcGxlLU1vZGVscy9tYXN0ZXIvMi4wL0R1Y2svZ2xURi1CaW5hcnkvRHVjay5nbGInO1xuY29uc3QgREVGQVVMVF9UUkFOU0lUSU9OID0gWzAsIDAsIDBdO1xuY29uc3QgREVGQVVMVF9TQ0FMRSA9IFsxLCAxLCAxXTtcbmNvbnN0IERFRkFVTFRfQ09MT1IgPSBbMjU1LCAyNTUsIDI1NSwgMjU1XTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVncmFwaExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoc2NlbmVncmFwaFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IHNjZW5lZ3JhcGhQb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcblxuICAgIC8vIHByZXBhcmUgbGF5ZXIgaW5mbyBtb2RhbFxuICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gU2NlbmVncmFwaEluZm9Nb2RhbEZhY3RvcnkoKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnM0QnO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBzY2VuZWdyYXBoUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gc2NlbmVncmFwaE9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFNjZW5lZ3JhcGhMYXllckljb247XG4gIH1cblxuICBnZXQgbGF5ZXJJbmZvTW9kYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAnc2NlbmVncmFwaEluZm8nLFxuICAgICAgdGVtcGxhdGU6IHRoaXMuX2xheWVySW5mb01vZGFsLFxuICAgICAgbW9kYWxQcm9wczoge1xuICAgICAgICB0aXRsZTogJ0hvdyB0byB1c2UgU2NlbmVncmFwaCdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSh7YWxsRGF0YSwgZmlsdGVyZWRJbmRleH0sIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgLy8gaW5kZXggaXMgaW1wb3J0YW50IGZvciBmaWx0ZXJcbiAgICAgICAgICBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSkge1xuICAgIGNvbnN0IHtncHVGaWx0ZXJ9ID0gZGF0YXNldHNbdGhpcy5jb25maWcuZGF0YUlkXTtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG4gICAgY29uc3QgZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uQWNjZXNzb3IoKTtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldFBvc2l0aW9uLFxuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGdwdUZpbHRlci5maWx0ZXJWYWx1ZUFjY2Vzc29yKClcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZCA9PiBnZXRQb3NpdGlvbih7ZGF0YTogZH0pKTtcbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIob3B0cykge1xuICAgIGNvbnN0IHtkYXRhLCBncHVGaWx0ZXJ9ID0gb3B0cztcblxuICAgIGNvbnN0IHtcbiAgICAgIHZpc0NvbmZpZzoge3NpemVTY2FsZSA9IDEsIGFuZ2xlWCA9IDAsIGFuZ2xlWSA9IDAsIGFuZ2xlWiA9IDkwfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja1NjZW5lZ3JhcGhMYXllcih7XG4gICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBmZXRjaCxcbiAgICAgICAgc2NlbmVncmFwaDogdGhpcy5jb25maWcudmlzQ29uZmlnLnNjZW5lZ3JhcGggfHwgREVGQVVMVF9NT0RFTCxcbiAgICAgICAgc2l6ZVNjYWxlLFxuICAgICAgICBnZXRUcmFuc2xhdGlvbjogREVGQVVMVF9UUkFOU0lUSU9OLFxuICAgICAgICBnZXRTY2FsZTogREVGQVVMVF9TQ0FMRSxcbiAgICAgICAgZ2V0T3JpZW50YXRpb246IFthbmdsZVgsIGFuZ2xlWSwgYW5nbGVaXSxcbiAgICAgICAgZ2V0Q29sb3I6IERFRkFVTFRfQ09MT1IsXG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgcGFyYW1ldGVyczoge2RlcHRoVGVzdDogdHJ1ZSwgYmxlbmQ6IGZhbHNlfSxcbiAgICAgICAgLy8gdXBkYXRlIHRyaWdnZXJzXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgZ2V0T3JpZW50YXRpb246IHthbmdsZVgsIGFuZ2xlWSwgYW5nbGVafSxcbiAgICAgICAgICBnZXRQb3NpdGlvbjogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=