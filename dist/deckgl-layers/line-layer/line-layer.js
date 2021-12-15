"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _layers = require("@deck.gl/layers");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _shaderUtils = require("../layer-utils/shader-utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultProps = _objectSpread(_objectSpread({}, _layers.LineLayer.defaultProps), {}, {
  getTargetColor: function getTargetColor(x) {
    return x.color || [0, 0, 0, 255];
  }
});

function addInstanceColorShader(vs) {
  var targetColorVs = (0, _shaderUtils.editShader)(vs, 'line target color vs', 'attribute vec4 instanceColors;', 'attribute vec4 instanceColors; attribute vec4 instanceTargetColors;');
  return (0, _shaderUtils.editShader)(targetColorVs, 'line color vs', 'vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);', "vec4 color = mix(instanceColors, instanceTargetColors, positions.x);" + "vColor = vec4(color.rgb, color.a * opacity);");
}

function addElevationScale(vs) {
  var elevationVs = (0, _shaderUtils.editShader)(vs, 'line elevation scale 1 vs', 'uniform float widthMaxPixels;', "uniform float widthMaxPixels;\n     uniform float elevationScale;");
  elevationVs = (0, _shaderUtils.editShader)(elevationVs, 'line elevation scale 2 vs', "geometry.worldPosition = instanceSourcePositions;\n  geometry.worldPositionAlt = instanceTargetPositions;", "vec3 sourcePosAdjusted = instanceSourcePositions;\n     vec3 targetPosAdjusted = instanceTargetPositions;\n     sourcePosAdjusted.z *= elevationScale;\n     targetPosAdjusted.z *= elevationScale;\n     \n     geometry.worldPosition = sourcePosAdjusted;\n     geometry.worldPositionAlt = sourcePosAdjusted;");
  elevationVs = (0, _shaderUtils.editShader)(elevationVs, 'line elevation scale 3 vs', 'vec4 source = project_position_to_clipspace(instanceSourcePositions, instanceSourcePositions64Low, vec3(0.), source_commonspace);', 'vec4 source = project_position_to_clipspace(sourcePosAdjusted, instanceSourcePositions64Low, vec3(0.), source_commonspace);');
  elevationVs = (0, _shaderUtils.editShader)(elevationVs, 'line elevation scale 4 vs', 'vec4 target = project_position_to_clipspace(instanceTargetPositions, instanceTargetPositions64Low, vec3(0.), target_commonspace);', 'vec4 target = project_position_to_clipspace(targetPosAdjusted, instanceTargetPositions64Low, vec3(0.), target_commonspace);');
  return elevationVs;
}

var EnhancedLineLayer = /*#__PURE__*/function (_LineLayer) {
  (0, _inherits2["default"])(EnhancedLineLayer, _LineLayer);

  var _super = _createSuper(EnhancedLineLayer);

  function EnhancedLineLayer() {
    (0, _classCallCheck2["default"])(this, EnhancedLineLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(EnhancedLineLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedLineLayer.prototype), "getShaders", this).call(this);
      var vs = addInstanceColorShader(shaders.vs);
      vs = addElevationScale(vs);
      return _objectSpread(_objectSpread({}, shaders), {}, {
        vs: vs
      });
    }
  }, {
    key: "draw",
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;
      var elevationScale = this.props.elevationScale;
      (0, _get2["default"])((0, _getPrototypeOf2["default"])(EnhancedLineLayer.prototype), "draw", this).call(this, {
        uniforms: _objectSpread(_objectSpread({}, uniforms), {}, {
          elevationScale: elevationScale
        })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJMaW5lTGF5ZXIiLCJnZXRUYXJnZXRDb2xvciIsIngiLCJjb2xvciIsImFkZEluc3RhbmNlQ29sb3JTaGFkZXIiLCJ2cyIsInRhcmdldENvbG9yVnMiLCJhZGRFbGV2YXRpb25TY2FsZSIsImVsZXZhdGlvblZzIiwiRW5oYW5jZWRMaW5lTGF5ZXIiLCJzaGFkZXJzIiwidW5pZm9ybXMiLCJlbGV2YXRpb25TY2FsZSIsInByb3BzIiwiYXR0cmlidXRlTWFuYWdlciIsInN0YXRlIiwiYWRkSW5zdGFuY2VkIiwiaW5zdGFuY2VUYXJnZXRDb2xvcnMiLCJzaXplIiwiY29sb3JGb3JtYXQiLCJsZW5ndGgiLCJ0eXBlIiwiR0wiLCJVTlNJR05FRF9CWVRFIiwibm9ybWFsaXplZCIsInRyYW5zaXRpb24iLCJhY2Nlc3NvciIsImRlZmF1bHRWYWx1ZSIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLG1DQUNiQyxrQkFBVUQsWUFERztBQUVoQkUsRUFBQUEsY0FBYyxFQUFFLHdCQUFBQyxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDQyxLQUFGLElBQVcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQWY7QUFBQTtBQUZELEVBQWxCOztBQUtBLFNBQVNDLHNCQUFULENBQWdDQyxFQUFoQyxFQUFvQztBQUNsQyxNQUFNQyxhQUFhLEdBQUcsNkJBQ3BCRCxFQURvQixFQUVwQixzQkFGb0IsRUFHcEIsZ0NBSG9CLEVBSXBCLHFFQUpvQixDQUF0QjtBQU9BLFNBQU8sNkJBQ0xDLGFBREssRUFFTCxlQUZLLEVBR0wsZ0VBSEssRUFJTCx1SEFKSyxDQUFQO0FBT0Q7O0FBRUQsU0FBU0MsaUJBQVQsQ0FBMkJGLEVBQTNCLEVBQStCO0FBQzdCLE1BQUlHLFdBQVcsR0FBRyw2QkFDaEJILEVBRGdCLEVBRWhCLDJCQUZnQixFQUdoQiwrQkFIZ0Isc0VBQWxCO0FBUUFHLEVBQUFBLFdBQVcsR0FBRyw2QkFDWkEsV0FEWSxFQUVaLDJCQUZZLG1hQUFkO0FBY0FBLEVBQUFBLFdBQVcsR0FBRyw2QkFDWkEsV0FEWSxFQUVaLDJCQUZZLEVBR1osbUlBSFksRUFJWiw2SEFKWSxDQUFkO0FBT0FBLEVBQUFBLFdBQVcsR0FBRyw2QkFDWkEsV0FEWSxFQUVaLDJCQUZZLEVBR1osbUlBSFksRUFJWiw2SEFKWSxDQUFkO0FBT0EsU0FBT0EsV0FBUDtBQUNEOztJQUVvQkMsaUI7Ozs7Ozs7Ozs7OztXQUNuQixzQkFBYTtBQUNYLFVBQU1DLE9BQU8sc0hBQWI7QUFFQSxVQUFJTCxFQUFFLEdBQUdELHNCQUFzQixDQUFDTSxPQUFPLENBQUNMLEVBQVQsQ0FBL0I7QUFDQUEsTUFBQUEsRUFBRSxHQUFHRSxpQkFBaUIsQ0FBQ0YsRUFBRCxDQUF0QjtBQUVBLDZDQUNLSyxPQURMO0FBRUVMLFFBQUFBLEVBQUUsRUFBRkE7QUFGRjtBQUlEOzs7V0FFRCxvQkFBaUI7QUFBQSxVQUFYTSxRQUFXLFFBQVhBLFFBQVc7QUFBQSxVQUNSQyxjQURRLEdBQ1UsS0FBS0MsS0FEZixDQUNSRCxjQURRO0FBRWYsb0hBQVc7QUFBQ0QsUUFBQUEsUUFBUSxrQ0FBTUEsUUFBTjtBQUFnQkMsVUFBQUEsY0FBYyxFQUFkQTtBQUFoQjtBQUFULE9BQVg7QUFDRDs7O1dBRUQsMkJBQWtCO0FBQ2hCO0FBRGdCLFVBRVRFLGdCQUZTLEdBRVcsS0FBS0MsS0FGaEIsQ0FFVEQsZ0JBRlM7QUFHaEJBLE1BQUFBLGdCQUFnQixDQUFDRSxZQUFqQixDQUE4QjtBQUM1QkMsUUFBQUEsb0JBQW9CLEVBQUU7QUFDcEJDLFVBQUFBLElBQUksRUFBRSxLQUFLTCxLQUFMLENBQVdNLFdBQVgsQ0FBdUJDLE1BRFQ7QUFFcEJDLFVBQUFBLElBQUksRUFBRUMsc0JBQUdDLGFBRlc7QUFHcEJDLFVBQUFBLFVBQVUsRUFBRSxJQUhRO0FBSXBCQyxVQUFBQSxVQUFVLEVBQUUsSUFKUTtBQUtwQkMsVUFBQUEsUUFBUSxFQUFFLGdCQUxVO0FBTXBCQyxVQUFBQSxZQUFZLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWO0FBTk07QUFETSxPQUE5QjtBQVVEOzs7RUEvQjRDM0IsaUI7OztBQWtDL0NTLGlCQUFpQixDQUFDbUIsU0FBbEIsR0FBOEIsbUJBQTlCO0FBQ0FuQixpQkFBaUIsQ0FBQ1YsWUFBbEIsR0FBaUNBLFlBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMaW5lTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQgR0wgZnJvbSAnQGx1bWEuZ2wvY29uc3RhbnRzJztcbmltcG9ydCB7ZWRpdFNoYWRlcn0gZnJvbSAnZGVja2dsLWxheWVycy9sYXllci11dGlscy9zaGFkZXItdXRpbHMnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLkxpbmVMYXllci5kZWZhdWx0UHJvcHMsXG4gIGdldFRhcmdldENvbG9yOiB4ID0+IHguY29sb3IgfHwgWzAsIDAsIDAsIDI1NV1cbn07XG5cbmZ1bmN0aW9uIGFkZEluc3RhbmNlQ29sb3JTaGFkZXIodnMpIHtcbiAgY29uc3QgdGFyZ2V0Q29sb3JWcyA9IGVkaXRTaGFkZXIoXG4gICAgdnMsXG4gICAgJ2xpbmUgdGFyZ2V0IGNvbG9yIHZzJyxcbiAgICAnYXR0cmlidXRlIHZlYzQgaW5zdGFuY2VDb2xvcnM7JyxcbiAgICAnYXR0cmlidXRlIHZlYzQgaW5zdGFuY2VDb2xvcnM7IGF0dHJpYnV0ZSB2ZWM0IGluc3RhbmNlVGFyZ2V0Q29sb3JzOydcbiAgKTtcblxuICByZXR1cm4gZWRpdFNoYWRlcihcbiAgICB0YXJnZXRDb2xvclZzLFxuICAgICdsaW5lIGNvbG9yIHZzJyxcbiAgICAndkNvbG9yID0gdmVjNChpbnN0YW5jZUNvbG9ycy5yZ2IsIGluc3RhbmNlQ29sb3JzLmEgKiBvcGFjaXR5KTsnLFxuICAgIGB2ZWM0IGNvbG9yID0gbWl4KGluc3RhbmNlQ29sb3JzLCBpbnN0YW5jZVRhcmdldENvbG9ycywgcG9zaXRpb25zLngpO2AgK1xuICAgICAgYHZDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogb3BhY2l0eSk7YFxuICApO1xufVxuXG5mdW5jdGlvbiBhZGRFbGV2YXRpb25TY2FsZSh2cykge1xuICBsZXQgZWxldmF0aW9uVnMgPSBlZGl0U2hhZGVyKFxuICAgIHZzLFxuICAgICdsaW5lIGVsZXZhdGlvbiBzY2FsZSAxIHZzJyxcbiAgICAndW5pZm9ybSBmbG9hdCB3aWR0aE1heFBpeGVsczsnLFxuICAgIGB1bmlmb3JtIGZsb2F0IHdpZHRoTWF4UGl4ZWxzO1xuICAgICB1bmlmb3JtIGZsb2F0IGVsZXZhdGlvblNjYWxlO2BcbiAgKTtcblxuICBlbGV2YXRpb25WcyA9IGVkaXRTaGFkZXIoXG4gICAgZWxldmF0aW9uVnMsXG4gICAgJ2xpbmUgZWxldmF0aW9uIHNjYWxlIDIgdnMnLFxuICAgIGBnZW9tZXRyeS53b3JsZFBvc2l0aW9uID0gaW5zdGFuY2VTb3VyY2VQb3NpdGlvbnM7XG4gIGdlb21ldHJ5LndvcmxkUG9zaXRpb25BbHQgPSBpbnN0YW5jZVRhcmdldFBvc2l0aW9ucztgLFxuICAgIGB2ZWMzIHNvdXJjZVBvc0FkanVzdGVkID0gaW5zdGFuY2VTb3VyY2VQb3NpdGlvbnM7XG4gICAgIHZlYzMgdGFyZ2V0UG9zQWRqdXN0ZWQgPSBpbnN0YW5jZVRhcmdldFBvc2l0aW9ucztcbiAgICAgc291cmNlUG9zQWRqdXN0ZWQueiAqPSBlbGV2YXRpb25TY2FsZTtcbiAgICAgdGFyZ2V0UG9zQWRqdXN0ZWQueiAqPSBlbGV2YXRpb25TY2FsZTtcbiAgICAgXG4gICAgIGdlb21ldHJ5LndvcmxkUG9zaXRpb24gPSBzb3VyY2VQb3NBZGp1c3RlZDtcbiAgICAgZ2VvbWV0cnkud29ybGRQb3NpdGlvbkFsdCA9IHNvdXJjZVBvc0FkanVzdGVkO2BcbiAgKTtcblxuICBlbGV2YXRpb25WcyA9IGVkaXRTaGFkZXIoXG4gICAgZWxldmF0aW9uVnMsXG4gICAgJ2xpbmUgZWxldmF0aW9uIHNjYWxlIDMgdnMnLFxuICAgICd2ZWM0IHNvdXJjZSA9IHByb2plY3RfcG9zaXRpb25fdG9fY2xpcHNwYWNlKGluc3RhbmNlU291cmNlUG9zaXRpb25zLCBpbnN0YW5jZVNvdXJjZVBvc2l0aW9uczY0TG93LCB2ZWMzKDAuKSwgc291cmNlX2NvbW1vbnNwYWNlKTsnLFxuICAgICd2ZWM0IHNvdXJjZSA9IHByb2plY3RfcG9zaXRpb25fdG9fY2xpcHNwYWNlKHNvdXJjZVBvc0FkanVzdGVkLCBpbnN0YW5jZVNvdXJjZVBvc2l0aW9uczY0TG93LCB2ZWMzKDAuKSwgc291cmNlX2NvbW1vbnNwYWNlKTsnXG4gICk7XG5cbiAgZWxldmF0aW9uVnMgPSBlZGl0U2hhZGVyKFxuICAgIGVsZXZhdGlvblZzLFxuICAgICdsaW5lIGVsZXZhdGlvbiBzY2FsZSA0IHZzJyxcbiAgICAndmVjNCB0YXJnZXQgPSBwcm9qZWN0X3Bvc2l0aW9uX3RvX2NsaXBzcGFjZShpbnN0YW5jZVRhcmdldFBvc2l0aW9ucywgaW5zdGFuY2VUYXJnZXRQb3NpdGlvbnM2NExvdywgdmVjMygwLiksIHRhcmdldF9jb21tb25zcGFjZSk7JyxcbiAgICAndmVjNCB0YXJnZXQgPSBwcm9qZWN0X3Bvc2l0aW9uX3RvX2NsaXBzcGFjZSh0YXJnZXRQb3NBZGp1c3RlZCwgaW5zdGFuY2VUYXJnZXRQb3NpdGlvbnM2NExvdywgdmVjMygwLiksIHRhcmdldF9jb21tb25zcGFjZSk7J1xuICApO1xuXG4gIHJldHVybiBlbGV2YXRpb25Wcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRMaW5lTGF5ZXIgZXh0ZW5kcyBMaW5lTGF5ZXIge1xuICBnZXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IHNoYWRlcnMgPSBzdXBlci5nZXRTaGFkZXJzKCk7XG5cbiAgICBsZXQgdnMgPSBhZGRJbnN0YW5jZUNvbG9yU2hhZGVyKHNoYWRlcnMudnMpO1xuICAgIHZzID0gYWRkRWxldmF0aW9uU2NhbGUodnMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNoYWRlcnMsXG4gICAgICB2c1xuICAgIH07XG4gIH1cblxuICBkcmF3KHt1bmlmb3Jtc30pIHtcbiAgICBjb25zdCB7ZWxldmF0aW9uU2NhbGV9ID0gdGhpcy5wcm9wcztcbiAgICBzdXBlci5kcmF3KHt1bmlmb3Jtczogey4uLnVuaWZvcm1zLCBlbGV2YXRpb25TY2FsZX19KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlVGFyZ2V0Q29sb3JzOiB7XG4gICAgICAgIHNpemU6IHRoaXMucHJvcHMuY29sb3JGb3JtYXQubGVuZ3RoLFxuICAgICAgICB0eXBlOiBHTC5VTlNJR05FRF9CWVRFLFxuICAgICAgICBub3JtYWxpemVkOiB0cnVlLFxuICAgICAgICB0cmFuc2l0aW9uOiB0cnVlLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFRhcmdldENvbG9yJyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBbMCwgMCwgMCwgMjU1XVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbkVuaGFuY2VkTGluZUxheWVyLmxheWVyTmFtZSA9ICdFbmhhbmNlZExpbmVMYXllcic7XG5FbmhhbmNlZExpbmVMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=