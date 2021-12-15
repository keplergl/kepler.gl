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

var _layers = require("@deck.gl/layers");

var _core = require("@luma.gl/core");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

var ScatterplotIconLayer = /*#__PURE__*/function (_ScatterplotLayer) {
  (0, _inherits2["default"])(ScatterplotIconLayer, _ScatterplotLayer);

  var _super = _createSuper(ScatterplotIconLayer);

  function ScatterplotIconLayer() {
    (0, _classCallCheck2["default"])(this, ScatterplotIconLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ScatterplotIconLayer, [{
    key: "_getModel",
    value: function _getModel(gl) {
      // use default scatterplot shaders
      var shaders = this.getShaders();
      var iconGeometry = this.props.iconGeometry;
      var geometry = iconGeometry ? new _core.Geometry({
        drawMode: _constants["default"].TRIANGLES,
        attributes: {
          positions: new Float32Array(iconGeometry)
        }
      }) : new _core.Geometry({
        drawMode: _constants["default"].TRIANGLE_FAN,
        attributes: {
          positions: new Float32Array(DEFAULT_POS)
        }
      });
      return new _core.Model(gl, _objectSpread(_objectSpread({}, shaders), {}, {
        id: this.props.id,
        geometry: geometry,
        isInstanced: true,
        shaderCache: this.context.shaderCache
      }));
    }
  }]);
  return ScatterplotIconLayer;
}(_layers.ScatterplotLayer);

exports["default"] = ScatterplotIconLayer;
ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3NjYXR0ZXJwbG90LWljb24tbGF5ZXIuanMiXSwibmFtZXMiOlsiREVGQVVMVF9QT1MiLCJTY2F0dGVycGxvdEljb25MYXllciIsImdsIiwic2hhZGVycyIsImdldFNoYWRlcnMiLCJpY29uR2VvbWV0cnkiLCJwcm9wcyIsImdlb21ldHJ5IiwiR2VvbWV0cnkiLCJkcmF3TW9kZSIsIkdMIiwiVFJJQU5HTEVTIiwiYXR0cmlidXRlcyIsInBvc2l0aW9ucyIsIkZsb2F0MzJBcnJheSIsIlRSSUFOR0xFX0ZBTiIsIk1vZGVsIiwiaWQiLCJpc0luc3RhbmNlZCIsInNoYWRlckNhY2hlIiwiY29udGV4dCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUMsQ0FBTixFQUFTLENBQVQsRUFBWSxDQUFDLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBQyxDQUFuQyxFQUFzQyxDQUF0QyxDQUFwQjs7SUFDcUJDLG9COzs7Ozs7Ozs7Ozs7V0FDbkIsbUJBQVVDLEVBQVYsRUFBYztBQUNaO0FBQ0EsVUFBTUMsT0FBTyxHQUFHLEtBQUtDLFVBQUwsRUFBaEI7QUFGWSxVQUlMQyxZQUpLLEdBSVcsS0FBS0MsS0FKaEIsQ0FJTEQsWUFKSztBQU1aLFVBQU1FLFFBQVEsR0FBR0YsWUFBWSxHQUN6QixJQUFJRyxjQUFKLENBQWE7QUFDWEMsUUFBQUEsUUFBUSxFQUFFQyxzQkFBR0MsU0FERjtBQUVYQyxRQUFBQSxVQUFVLEVBQUU7QUFDVkMsVUFBQUEsU0FBUyxFQUFFLElBQUlDLFlBQUosQ0FBaUJULFlBQWpCO0FBREQ7QUFGRCxPQUFiLENBRHlCLEdBT3pCLElBQUlHLGNBQUosQ0FBYTtBQUNYQyxRQUFBQSxRQUFRLEVBQUVDLHNCQUFHSyxZQURGO0FBRVhILFFBQUFBLFVBQVUsRUFBRTtBQUNWQyxVQUFBQSxTQUFTLEVBQUUsSUFBSUMsWUFBSixDQUFpQmQsV0FBakI7QUFERDtBQUZELE9BQWIsQ0FQSjtBQWNBLGFBQU8sSUFBSWdCLFdBQUosQ0FBVWQsRUFBVixrQ0FDRkMsT0FERTtBQUVMYyxRQUFBQSxFQUFFLEVBQUUsS0FBS1gsS0FBTCxDQUFXVyxFQUZWO0FBR0xWLFFBQUFBLFFBQVEsRUFBUkEsUUFISztBQUlMVyxRQUFBQSxXQUFXLEVBQUUsSUFKUjtBQUtMQyxRQUFBQSxXQUFXLEVBQUUsS0FBS0MsT0FBTCxDQUFhRDtBQUxyQixTQUFQO0FBT0Q7OztFQTVCK0NFLHdCOzs7QUErQmxEcEIsb0JBQW9CLENBQUNxQixTQUFyQixHQUFpQyxzQkFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQge0dlb21ldHJ5LCBNb2RlbH0gZnJvbSAnQGx1bWEuZ2wvY29yZSc7XG5pbXBvcnQgR0wgZnJvbSAnQGx1bWEuZ2wvY29uc3RhbnRzJztcblxuY29uc3QgREVGQVVMVF9QT1MgPSBbLTEsIC0xLCAwLCAtMSwgMSwgMCwgMSwgMSwgMCwgMSwgLTEsIDBdO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RJY29uTGF5ZXIgZXh0ZW5kcyBTY2F0dGVycGxvdExheWVyIHtcbiAgX2dldE1vZGVsKGdsKSB7XG4gICAgLy8gdXNlIGRlZmF1bHQgc2NhdHRlcnBsb3Qgc2hhZGVyc1xuICAgIGNvbnN0IHNoYWRlcnMgPSB0aGlzLmdldFNoYWRlcnMoKTtcblxuICAgIGNvbnN0IHtpY29uR2VvbWV0cnl9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gaWNvbkdlb21ldHJ5XG4gICAgICA/IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgICAgZHJhd01vZGU6IEdMLlRSSUFOR0xFUyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBwb3NpdGlvbnM6IG5ldyBGbG9hdDMyQXJyYXkoaWNvbkdlb21ldHJ5KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIDogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgICBkcmF3TW9kZTogR0wuVFJJQU5HTEVfRkFOLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShERUZBVUxUX1BPUylcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBNb2RlbChnbCwge1xuICAgICAgLi4uc2hhZGVycyxcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgZ2VvbWV0cnksXG4gICAgICBpc0luc3RhbmNlZDogdHJ1ZSxcbiAgICAgIHNoYWRlckNhY2hlOiB0aGlzLmNvbnRleHQuc2hhZGVyQ2FjaGVcbiAgICB9KTtcbiAgfVxufVxuXG5TY2F0dGVycGxvdEljb25MYXllci5sYXllck5hbWUgPSAnU2NhdHRlcnBsb3RJY29uTGF5ZXInO1xuIl19