"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _layers = require("@deck.gl/layers");

var _shaderUtils = require("../layer-utils/shader-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function addInstanceCoverage(vs) {
  var addDecl = (0, _shaderUtils.editShader)(vs, 'hexagon cell vs add instance', 'attribute vec3 instancePickingColors;', "attribute vec3 instancePickingColors;\n     attribute float instanceCoverage;");
  return (0, _shaderUtils.editShader)(addDecl, 'hexagon cell vs add instance', 'float dotRadius = radius * coverage * shouldRender;', 'float dotRadius = radius * coverage * instanceCoverage * shouldRender;');
} // TODO: export all deck.gl layers from kepler.gl


var EnhancedColumnLayer = /*#__PURE__*/function (_ColumnLayer) {
  (0, _inherits2["default"])(EnhancedColumnLayer, _ColumnLayer);

  var _super = _createSuper(EnhancedColumnLayer);

  function EnhancedColumnLayer() {
    (0, _classCallCheck2["default"])(this, EnhancedColumnLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(EnhancedColumnLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedColumnLayer.prototype), "getShaders", this).call(this);
      return _objectSpread(_objectSpread({}, shaders), {}, {
        vs: addInstanceCoverage(shaders.vs)
      });
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedColumnLayer.prototype), "initializeState", this).call(this);
      this.getAttributeManager().addInstanced({
        instanceCoverage: {
          size: 1,
          accessor: 'getCoverage'
        }
      });
    }
  }]);
  return EnhancedColumnLayer;
}(_layers.ColumnLayer);

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';
var _default = EnhancedColumnLayer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NvbHVtbi1sYXllci9lbmhhbmNlZC1jb2x1bW4tbGF5ZXIuanMiXSwibmFtZXMiOlsiYWRkSW5zdGFuY2VDb3ZlcmFnZSIsInZzIiwiYWRkRGVjbCIsIkVuaGFuY2VkQ29sdW1uTGF5ZXIiLCJzaGFkZXJzIiwiZ2V0QXR0cmlidXRlTWFuYWdlciIsImFkZEluc3RhbmNlZCIsImluc3RhbmNlQ292ZXJhZ2UiLCJzaXplIiwiYWNjZXNzb3IiLCJDb2x1bW5MYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxtQkFBVCxDQUE2QkMsRUFBN0IsRUFBaUM7QUFDL0IsTUFBTUMsT0FBTyxHQUFHLDZCQUNkRCxFQURjLEVBRWQsOEJBRmMsRUFHZCx1Q0FIYyxrRkFBaEI7QUFRQSxTQUFPLDZCQUNMQyxPQURLLEVBRUwsOEJBRkssRUFHTCxxREFISyxFQUlMLHdFQUpLLENBQVA7QUFNRCxDLENBRUQ7OztJQUNNQyxtQjs7Ozs7Ozs7Ozs7O1dBQ0osc0JBQWE7QUFDWCxVQUFNQyxPQUFPLHdIQUFiO0FBRUEsNkNBQ0tBLE9BREw7QUFFRUgsUUFBQUEsRUFBRSxFQUFFRCxtQkFBbUIsQ0FBQ0ksT0FBTyxDQUFDSCxFQUFUO0FBRnpCO0FBSUQ7OztXQUVELDJCQUFrQjtBQUNoQjtBQUVBLFdBQUtJLG1CQUFMLEdBQTJCQyxZQUEzQixDQUF3QztBQUN0Q0MsUUFBQUEsZ0JBQWdCLEVBQUU7QUFBQ0MsVUFBQUEsSUFBSSxFQUFFLENBQVA7QUFBVUMsVUFBQUEsUUFBUSxFQUFFO0FBQXBCO0FBRG9CLE9BQXhDO0FBR0Q7OztFQWhCK0JDLG1COztBQW1CbENQLG1CQUFtQixDQUFDUSxTQUFwQixHQUFnQyxxQkFBaEM7ZUFFZVIsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0NvbHVtbkxheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuaW1wb3J0IHtlZGl0U2hhZGVyfSBmcm9tICdkZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL3NoYWRlci11dGlscyc7XG5cbmZ1bmN0aW9uIGFkZEluc3RhbmNlQ292ZXJhZ2UodnMpIHtcbiAgY29uc3QgYWRkRGVjbCA9IGVkaXRTaGFkZXIoXG4gICAgdnMsXG4gICAgJ2hleGFnb24gY2VsbCB2cyBhZGQgaW5zdGFuY2UnLFxuICAgICdhdHRyaWJ1dGUgdmVjMyBpbnN0YW5jZVBpY2tpbmdDb2xvcnM7JyxcbiAgICBgYXR0cmlidXRlIHZlYzMgaW5zdGFuY2VQaWNraW5nQ29sb3JzO1xuICAgICBhdHRyaWJ1dGUgZmxvYXQgaW5zdGFuY2VDb3ZlcmFnZTtgXG4gICk7XG5cbiAgcmV0dXJuIGVkaXRTaGFkZXIoXG4gICAgYWRkRGVjbCxcbiAgICAnaGV4YWdvbiBjZWxsIHZzIGFkZCBpbnN0YW5jZScsXG4gICAgJ2Zsb2F0IGRvdFJhZGl1cyA9IHJhZGl1cyAqIGNvdmVyYWdlICogc2hvdWxkUmVuZGVyOycsXG4gICAgJ2Zsb2F0IGRvdFJhZGl1cyA9IHJhZGl1cyAqIGNvdmVyYWdlICogaW5zdGFuY2VDb3ZlcmFnZSAqIHNob3VsZFJlbmRlcjsnXG4gICk7XG59XG5cbi8vIFRPRE86IGV4cG9ydCBhbGwgZGVjay5nbCBsYXllcnMgZnJvbSBrZXBsZXIuZ2xcbmNsYXNzIEVuaGFuY2VkQ29sdW1uTGF5ZXIgZXh0ZW5kcyBDb2x1bW5MYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zaGFkZXJzLFxuICAgICAgdnM6IGFkZEluc3RhbmNlQ292ZXJhZ2Uoc2hhZGVycy52cylcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemVTdGF0ZSgpO1xuXG4gICAgdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCkuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlQ292ZXJhZ2U6IHtzaXplOiAxLCBhY2Nlc3NvcjogJ2dldENvdmVyYWdlJ31cbiAgICB9KTtcbiAgfVxufVxuXG5FbmhhbmNlZENvbHVtbkxheWVyLmxheWVyTmFtZSA9ICdFbmhhbmNlZENvbHVtbkxheWVyJztcblxuZXhwb3J0IGRlZmF1bHQgRW5oYW5jZWRDb2x1bW5MYXllcjtcbiJdfQ==