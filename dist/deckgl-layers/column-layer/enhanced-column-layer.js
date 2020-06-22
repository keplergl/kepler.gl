"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _shaderUtils = require("../layer-utils/shader-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function addInstanceCoverage(vs) {
  var addDecl = (0, _shaderUtils.editShader)(vs, 'hexagon cell vs add instance', 'attribute vec3 instancePickingColors;', "attribute vec3 instancePickingColors;\n     attribute float instanceCoverage;");
  return (0, _shaderUtils.editShader)(addDecl, 'hexagon cell vs add instance', 'float dotRadius = radius * coverage * shouldRender;', 'float dotRadius = radius * coverage * instanceCoverage * shouldRender;');
} // TODO: export all deck.gl layers from kepler.gl


var EnhancedColumnLayer =
/*#__PURE__*/
function (_ColumnLayer) {
  (0, _inherits2["default"])(EnhancedColumnLayer, _ColumnLayer);

  function EnhancedColumnLayer() {
    (0, _classCallCheck2["default"])(this, EnhancedColumnLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EnhancedColumnLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(EnhancedColumnLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedColumnLayer.prototype), "getShaders", this).call(this);
      return _objectSpread({}, shaders, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2NvbHVtbi1sYXllci9lbmhhbmNlZC1jb2x1bW4tbGF5ZXIuanMiXSwibmFtZXMiOlsiYWRkSW5zdGFuY2VDb3ZlcmFnZSIsInZzIiwiYWRkRGVjbCIsIkVuaGFuY2VkQ29sdW1uTGF5ZXIiLCJzaGFkZXJzIiwiZ2V0QXR0cmlidXRlTWFuYWdlciIsImFkZEluc3RhbmNlZCIsImluc3RhbmNlQ292ZXJhZ2UiLCJzaXplIiwiYWNjZXNzb3IiLCJDb2x1bW5MYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLG1CQUFULENBQTZCQyxFQUE3QixFQUFpQztBQUMvQixNQUFNQyxPQUFPLEdBQUcsNkJBQ2RELEVBRGMsRUFFZCw4QkFGYyxFQUdkLHVDQUhjLGtGQUFoQjtBQVFBLFNBQU8sNkJBQ0xDLE9BREssRUFFTCw4QkFGSyxFQUdMLHFEQUhLLEVBSUwsd0VBSkssQ0FBUDtBQU1ELEMsQ0FFRDs7O0lBQ01DLG1COzs7Ozs7Ozs7Ozs7aUNBQ1M7QUFDWCxVQUFNQyxPQUFPLHdIQUFiO0FBRUEsK0JBQ0tBLE9BREw7QUFFRUgsUUFBQUEsRUFBRSxFQUFFRCxtQkFBbUIsQ0FBQ0ksT0FBTyxDQUFDSCxFQUFUO0FBRnpCO0FBSUQ7OztzQ0FFaUI7QUFDaEI7QUFFQSxXQUFLSSxtQkFBTCxHQUEyQkMsWUFBM0IsQ0FBd0M7QUFDdENDLFFBQUFBLGdCQUFnQixFQUFFO0FBQUNDLFVBQUFBLElBQUksRUFBRSxDQUFQO0FBQVVDLFVBQUFBLFFBQVEsRUFBRTtBQUFwQjtBQURvQixPQUF4QztBQUdEOzs7RUFoQitCQyxtQjs7QUFtQmxDUCxtQkFBbUIsQ0FBQ1EsU0FBcEIsR0FBZ0MscUJBQWhDO2VBRWVSLG1CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtDb2x1bW5MYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcbmltcG9ydCB7ZWRpdFNoYWRlcn0gZnJvbSAnZGVja2dsLWxheWVycy9sYXllci11dGlscy9zaGFkZXItdXRpbHMnO1xuXG5mdW5jdGlvbiBhZGRJbnN0YW5jZUNvdmVyYWdlKHZzKSB7XG4gIGNvbnN0IGFkZERlY2wgPSBlZGl0U2hhZGVyKFxuICAgIHZzLFxuICAgICdoZXhhZ29uIGNlbGwgdnMgYWRkIGluc3RhbmNlJyxcbiAgICAnYXR0cmlidXRlIHZlYzMgaW5zdGFuY2VQaWNraW5nQ29sb3JzOycsXG4gICAgYGF0dHJpYnV0ZSB2ZWMzIGluc3RhbmNlUGlja2luZ0NvbG9ycztcbiAgICAgYXR0cmlidXRlIGZsb2F0IGluc3RhbmNlQ292ZXJhZ2U7YFxuICApO1xuXG4gIHJldHVybiBlZGl0U2hhZGVyKFxuICAgIGFkZERlY2wsXG4gICAgJ2hleGFnb24gY2VsbCB2cyBhZGQgaW5zdGFuY2UnLFxuICAgICdmbG9hdCBkb3RSYWRpdXMgPSByYWRpdXMgKiBjb3ZlcmFnZSAqIHNob3VsZFJlbmRlcjsnLFxuICAgICdmbG9hdCBkb3RSYWRpdXMgPSByYWRpdXMgKiBjb3ZlcmFnZSAqIGluc3RhbmNlQ292ZXJhZ2UgKiBzaG91bGRSZW5kZXI7J1xuICApO1xufVxuXG4vLyBUT0RPOiBleHBvcnQgYWxsIGRlY2suZ2wgbGF5ZXJzIGZyb20ga2VwbGVyLmdsXG5jbGFzcyBFbmhhbmNlZENvbHVtbkxheWVyIGV4dGVuZHMgQ29sdW1uTGF5ZXIge1xuICBnZXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IHNoYWRlcnMgPSBzdXBlci5nZXRTaGFkZXJzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2hhZGVycyxcbiAgICAgIHZzOiBhZGRJbnN0YW5jZUNvdmVyYWdlKHNoYWRlcnMudnMpXG4gICAgfTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgIHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZUNvdmVyYWdlOiB7c2l6ZTogMSwgYWNjZXNzb3I6ICdnZXRDb3ZlcmFnZSd9XG4gICAgfSk7XG4gIH1cbn1cblxuRW5oYW5jZWRDb2x1bW5MYXllci5sYXllck5hbWUgPSAnRW5oYW5jZWRDb2x1bW5MYXllcic7XG5cbmV4cG9ydCBkZWZhdWx0IEVuaGFuY2VkQ29sdW1uTGF5ZXI7XG4iXX0=