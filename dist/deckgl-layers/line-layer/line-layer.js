"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _layers = require("@deck.gl/layers");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _shaderUtils = require("../layer-utils/shader-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultProps = _objectSpread({}, _layers.LineLayer.defaultProps, {
  getTargetColor: function getTargetColor(x) {
    return x.color || [0, 0, 0, 255];
  }
});

function addInstanceColorShader(vs) {
  var targetColorVs = (0, _shaderUtils.editShader)(vs, 'line target color vs', 'attribute vec4 instanceColors;', 'attribute vec4 instanceColors; attribute vec4 instanceTargetColors;');
  return (0, _shaderUtils.editShader)(targetColorVs, 'line color vs', 'vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);', "vec4 color = mix(instanceColors, instanceTargetColors, positions.x);" + "vColor = vec4(color.rgb, color.a * opacity);");
}

var EnhancedLineLayer =
/*#__PURE__*/
function (_LineLayer) {
  (0, _inherits2["default"])(EnhancedLineLayer, _LineLayer);

  function EnhancedLineLayer() {
    (0, _classCallCheck2["default"])(this, EnhancedLineLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EnhancedLineLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(EnhancedLineLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedLineLayer.prototype), "getShaders", this).call(this);
      return _objectSpread({}, shaders, {
        vs: addInstanceColorShader(shaders.vs)
      });
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedLineLayer.prototype), "initializeState", this).call(this);
      var attributeManager = this.state.attributeManager;
      attributeManager.addInstanced({
        instanceTargetColors: {
          size: this.props.colorFormat.length,
          type: _constants["default"].UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: 'getTargetColor',
          defaultValue: [0, 0, 0, 255]
        }
      });
    }
  }]);
  return EnhancedLineLayer;
}(_layers.LineLayer);

exports["default"] = EnhancedLineLayer;
EnhancedLineLayer.layerName = 'EnhancedLineLayer';
EnhancedLineLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJMaW5lTGF5ZXIiLCJnZXRUYXJnZXRDb2xvciIsIngiLCJjb2xvciIsImFkZEluc3RhbmNlQ29sb3JTaGFkZXIiLCJ2cyIsInRhcmdldENvbG9yVnMiLCJFbmhhbmNlZExpbmVMYXllciIsInNoYWRlcnMiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwic3RhdGUiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVRhcmdldENvbG9ycyIsInNpemUiLCJwcm9wcyIsImNvbG9yRm9ybWF0IiwibGVuZ3RoIiwidHlwZSIsIkdMIiwiVU5TSUdORURfQllURSIsIm5vcm1hbGl6ZWQiLCJ0cmFuc2l0aW9uIiwiYWNjZXNzb3IiLCJkZWZhdWx0VmFsdWUiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZLHFCQUNiQyxrQkFBVUQsWUFERztBQUVoQkUsRUFBQUEsY0FBYyxFQUFFLHdCQUFBQyxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDQyxLQUFGLElBQVcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQWY7QUFBQTtBQUZELEVBQWxCOztBQUtBLFNBQVNDLHNCQUFULENBQWdDQyxFQUFoQyxFQUFvQztBQUNsQyxNQUFNQyxhQUFhLEdBQUcsNkJBQ3BCRCxFQURvQixFQUVwQixzQkFGb0IsRUFHcEIsZ0NBSG9CLEVBSXBCLHFFQUpvQixDQUF0QjtBQU9BLFNBQU8sNkJBQ0xDLGFBREssRUFFTCxlQUZLLEVBR0wsZ0VBSEssRUFJTCx1SEFKSyxDQUFQO0FBT0Q7O0lBRW9CQyxpQjs7Ozs7Ozs7Ozs7O2lDQUNOO0FBQ1gsVUFBTUMsT0FBTyxzSEFBYjtBQUVBLCtCQUNLQSxPQURMO0FBRUVILFFBQUFBLEVBQUUsRUFBRUQsc0JBQXNCLENBQUNJLE9BQU8sQ0FBQ0gsRUFBVDtBQUY1QjtBQUlEOzs7c0NBRWlCO0FBQ2hCO0FBRGdCLFVBRVRJLGdCQUZTLEdBRVcsS0FBS0MsS0FGaEIsQ0FFVEQsZ0JBRlM7QUFHaEJBLE1BQUFBLGdCQUFnQixDQUFDRSxZQUFqQixDQUE4QjtBQUM1QkMsUUFBQUEsb0JBQW9CLEVBQUU7QUFDcEJDLFVBQUFBLElBQUksRUFBRSxLQUFLQyxLQUFMLENBQVdDLFdBQVgsQ0FBdUJDLE1BRFQ7QUFFcEJDLFVBQUFBLElBQUksRUFBRUMsc0JBQUdDLGFBRlc7QUFHcEJDLFVBQUFBLFVBQVUsRUFBRSxJQUhRO0FBSXBCQyxVQUFBQSxVQUFVLEVBQUUsSUFKUTtBQUtwQkMsVUFBQUEsUUFBUSxFQUFFLGdCQUxVO0FBTXBCQyxVQUFBQSxZQUFZLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWO0FBTk07QUFETSxPQUE5QjtBQVVEOzs7RUF2QjRDdkIsaUI7OztBQTBCL0NPLGlCQUFpQixDQUFDaUIsU0FBbEIsR0FBOEIsbUJBQTlCO0FBQ0FqQixpQkFBaUIsQ0FBQ1IsWUFBbEIsR0FBaUNBLFlBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMaW5lTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQgR0wgZnJvbSAnQGx1bWEuZ2wvY29uc3RhbnRzJztcbmltcG9ydCB7ZWRpdFNoYWRlcn0gZnJvbSAnZGVja2dsLWxheWVycy9sYXllci11dGlscy9zaGFkZXItdXRpbHMnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLkxpbmVMYXllci5kZWZhdWx0UHJvcHMsXG4gIGdldFRhcmdldENvbG9yOiB4ID0+IHguY29sb3IgfHwgWzAsIDAsIDAsIDI1NV1cbn07XG5cbmZ1bmN0aW9uIGFkZEluc3RhbmNlQ29sb3JTaGFkZXIodnMpIHtcbiAgY29uc3QgdGFyZ2V0Q29sb3JWcyA9IGVkaXRTaGFkZXIoXG4gICAgdnMsXG4gICAgJ2xpbmUgdGFyZ2V0IGNvbG9yIHZzJyxcbiAgICAnYXR0cmlidXRlIHZlYzQgaW5zdGFuY2VDb2xvcnM7JyxcbiAgICAnYXR0cmlidXRlIHZlYzQgaW5zdGFuY2VDb2xvcnM7IGF0dHJpYnV0ZSB2ZWM0IGluc3RhbmNlVGFyZ2V0Q29sb3JzOydcbiAgKTtcblxuICByZXR1cm4gZWRpdFNoYWRlcihcbiAgICB0YXJnZXRDb2xvclZzLFxuICAgICdsaW5lIGNvbG9yIHZzJyxcbiAgICAndkNvbG9yID0gdmVjNChpbnN0YW5jZUNvbG9ycy5yZ2IsIGluc3RhbmNlQ29sb3JzLmEgKiBvcGFjaXR5KTsnLFxuICAgIGB2ZWM0IGNvbG9yID0gbWl4KGluc3RhbmNlQ29sb3JzLCBpbnN0YW5jZVRhcmdldENvbG9ycywgcG9zaXRpb25zLngpO2AgK1xuICAgICAgYHZDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogb3BhY2l0eSk7YFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmhhbmNlZExpbmVMYXllciBleHRlbmRzIExpbmVMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zaGFkZXJzLFxuICAgICAgdnM6IGFkZEluc3RhbmNlQ29sb3JTaGFkZXIoc2hhZGVycy52cylcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemVTdGF0ZSgpO1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoe1xuICAgICAgaW5zdGFuY2VUYXJnZXRDb2xvcnM6IHtcbiAgICAgICAgc2l6ZTogdGhpcy5wcm9wcy5jb2xvckZvcm1hdC5sZW5ndGgsXG4gICAgICAgIHR5cGU6IEdMLlVOU0lHTkVEX0JZVEUsXG4gICAgICAgIG5vcm1hbGl6ZWQ6IHRydWUsXG4gICAgICAgIHRyYW5zaXRpb246IHRydWUsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0VGFyZ2V0Q29sb3InLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IFswLCAwLCAwLCAyNTVdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuRW5oYW5jZWRMaW5lTGF5ZXIubGF5ZXJOYW1lID0gJ0VuaGFuY2VkTGluZUxheWVyJztcbkVuaGFuY2VkTGluZUxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==