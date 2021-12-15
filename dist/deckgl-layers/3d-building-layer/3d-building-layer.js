"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _core = require("@deck.gl/core");

var _geoLayers = require("@deck.gl/geo-layers");

var _dBuildingUtils = require("./3d-building-utils");

var _layers = require("@deck.gl/layers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ThreeDBuildingLayer = /*#__PURE__*/function (_CompositeLayer) {
  (0, _inherits2["default"])(ThreeDBuildingLayer, _CompositeLayer);

  var _super = _createSuper(ThreeDBuildingLayer);

  function ThreeDBuildingLayer() {
    (0, _classCallCheck2["default"])(this, ThreeDBuildingLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ThreeDBuildingLayer, [{
    key: "renderSubLayers",
    value: // this layer add its subLayers to the redux store, and push sample data
    function renderSubLayers(props) {
      return new _layers.SolidPolygonLayer(_objectSpread(_objectSpread({}, props), {}, {
        parameter: {
          blendFunc: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'ONE', 'ONE_MINUS_SRC_ALPHA'],
          blendEquation: ['FUNC_ADD', 'FUNC_ADD']
        },
        extruded: true,
        opacity: 1,
        filled: true,
        getElevation: function getElevation(feature) {
          return feature.properties.height || 0;
        },
        getPolygon: function getPolygon(feature) {
          return feature.coordinates;
        },
        getFillColor: this.props.threeDBuildingColor
      }));
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this = this;

      return [new _geoLayers.TileLayer({
        getTileData: function getTileData(args) {
          return (0, _dBuildingUtils.getTileData)(_this.props.mapboxApiUrl, _this.props.mapboxApiAccessToken, args);
        },
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })];
    }
  }]);
  return ThreeDBuildingLayer;
}(_core.CompositeLayer);

exports["default"] = ThreeDBuildingLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzLzNkLWJ1aWxkaW5nLWxheWVyLzNkLWJ1aWxkaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbIlRocmVlREJ1aWxkaW5nTGF5ZXIiLCJwcm9wcyIsIlNvbGlkUG9seWdvbkxheWVyIiwicGFyYW1ldGVyIiwiYmxlbmRGdW5jIiwiYmxlbmRFcXVhdGlvbiIsImV4dHJ1ZGVkIiwib3BhY2l0eSIsImZpbGxlZCIsImdldEVsZXZhdGlvbiIsImZlYXR1cmUiLCJwcm9wZXJ0aWVzIiwiaGVpZ2h0IiwiZ2V0UG9seWdvbiIsImNvb3JkaW5hdGVzIiwiZ2V0RmlsbENvbG9yIiwidGhyZWVEQnVpbGRpbmdDb2xvciIsIkRlY2tHTFRpbGVMYXllciIsImdldFRpbGVEYXRhIiwiYXJncyIsIm1hcGJveEFwaVVybCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWluWm9vbSIsInJlbmRlclN1YkxheWVycyIsImJpbmQiLCJ1cGRhdGVUcmlnZ2VycyIsIkNvbXBvc2l0ZUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7SUFFcUJBLG1COzs7Ozs7Ozs7Ozs7V0FDbkI7QUFFQSw2QkFBZ0JDLEtBQWhCLEVBQXVCO0FBQ3JCLGFBQU8sSUFBSUMseUJBQUosaUNBQ0ZELEtBREU7QUFFTEUsUUFBQUEsU0FBUyxFQUFFO0FBQ1RDLFVBQUFBLFNBQVMsRUFBRSxDQUFDLFdBQUQsRUFBYyxxQkFBZCxFQUFxQyxLQUFyQyxFQUE0QyxxQkFBNUMsQ0FERjtBQUVUQyxVQUFBQSxhQUFhLEVBQUUsQ0FBQyxVQUFELEVBQWEsVUFBYjtBQUZOLFNBRk47QUFNTEMsUUFBQUEsUUFBUSxFQUFFLElBTkw7QUFPTEMsUUFBQUEsT0FBTyxFQUFFLENBUEo7QUFRTEMsUUFBQUEsTUFBTSxFQUFFLElBUkg7QUFTTEMsUUFBQUEsWUFBWSxFQUFFLHNCQUFBQyxPQUFPO0FBQUEsaUJBQUlBLE9BQU8sQ0FBQ0MsVUFBUixDQUFtQkMsTUFBbkIsSUFBNkIsQ0FBakM7QUFBQSxTQVRoQjtBQVVMQyxRQUFBQSxVQUFVLEVBQUUsb0JBQUFILE9BQU87QUFBQSxpQkFBSUEsT0FBTyxDQUFDSSxXQUFaO0FBQUEsU0FWZDtBQVdMQyxRQUFBQSxZQUFZLEVBQUUsS0FBS2QsS0FBTCxDQUFXZTtBQVhwQixTQUFQO0FBYUQ7OztXQUVELHdCQUFlO0FBQUE7O0FBQ2IsYUFBTyxDQUNMLElBQUlDLG9CQUFKLENBQW9CO0FBQ2xCQyxRQUFBQSxXQUFXLEVBQUUscUJBQUFDLElBQUk7QUFBQSxpQkFDZixpQ0FBWSxLQUFJLENBQUNsQixLQUFMLENBQVdtQixZQUF2QixFQUFxQyxLQUFJLENBQUNuQixLQUFMLENBQVdvQixvQkFBaEQsRUFBc0VGLElBQXRFLENBRGU7QUFBQSxTQURDO0FBR2xCRyxRQUFBQSxPQUFPLEVBQUUsRUFIUztBQUlsQkMsUUFBQUEsZUFBZSxFQUFFLEtBQUtBLGVBQUwsQ0FBcUJDLElBQXJCLENBQTBCLElBQTFCLENBSkM7QUFLbEJDLFFBQUFBLGNBQWMsRUFBRSxLQUFLeEIsS0FBTCxDQUFXd0I7QUFMVCxPQUFwQixDQURLLENBQVA7QUFTRDs7O0VBN0I4Q0Msb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0NvbXBvc2l0ZUxheWVyfSBmcm9tICdAZGVjay5nbC9jb3JlJztcbmltcG9ydCB7VGlsZUxheWVyIGFzIERlY2tHTFRpbGVMYXllcn0gZnJvbSAnQGRlY2suZ2wvZ2VvLWxheWVycyc7XG5pbXBvcnQge2dldFRpbGVEYXRhfSBmcm9tICcuLzNkLWJ1aWxkaW5nLXV0aWxzJztcbmltcG9ydCB7U29saWRQb2x5Z29uTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRocmVlREJ1aWxkaW5nTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIHRoaXMgbGF5ZXIgYWRkIGl0cyBzdWJMYXllcnMgdG8gdGhlIHJlZHV4IHN0b3JlLCBhbmQgcHVzaCBzYW1wbGUgZGF0YVxuXG4gIHJlbmRlclN1YkxheWVycyhwcm9wcykge1xuICAgIHJldHVybiBuZXcgU29saWRQb2x5Z29uTGF5ZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBwYXJhbWV0ZXI6IHtcbiAgICAgICAgYmxlbmRGdW5jOiBbJ1NSQ19BTFBIQScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJywgJ09ORScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJ10sXG4gICAgICAgIGJsZW5kRXF1YXRpb246IFsnRlVOQ19BREQnLCAnRlVOQ19BREQnXVxuICAgICAgfSxcbiAgICAgIGV4dHJ1ZGVkOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgIGdldEVsZXZhdGlvbjogZmVhdHVyZSA9PiBmZWF0dXJlLnByb3BlcnRpZXMuaGVpZ2h0IHx8IDAsXG4gICAgICBnZXRQb2x5Z29uOiBmZWF0dXJlID0+IGZlYXR1cmUuY29vcmRpbmF0ZXMsXG4gICAgICBnZXRGaWxsQ29sb3I6IHRoaXMucHJvcHMudGhyZWVEQnVpbGRpbmdDb2xvclxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgRGVja0dMVGlsZUxheWVyKHtcbiAgICAgICAgZ2V0VGlsZURhdGE6IGFyZ3MgPT5cbiAgICAgICAgICBnZXRUaWxlRGF0YSh0aGlzLnByb3BzLm1hcGJveEFwaVVybCwgdGhpcy5wcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbiwgYXJncyksXG4gICAgICAgIG1pblpvb206IDEzLFxuICAgICAgICByZW5kZXJTdWJMYXllcnM6IHRoaXMucmVuZGVyU3ViTGF5ZXJzLmJpbmQodGhpcyksXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB0aGlzLnByb3BzLnVwZGF0ZVRyaWdnZXJzXG4gICAgICB9KVxuICAgIF07XG4gIH1cbn1cbiJdfQ==