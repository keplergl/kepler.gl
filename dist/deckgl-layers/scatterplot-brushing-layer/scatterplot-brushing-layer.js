'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _deck = require('deck.gl');

var _scatterplotBrushingLayerVertex = require('./scatterplot-brushing-layer-vertex.glsl');

var _scatterplotBrushingLayerVertex2 = _interopRequireDefault(_scatterplotBrushingLayerVertex);

var _isPointInRange = require('../../shaderlib/is-point-in-range');

var _isPointInRange2 = _interopRequireDefault(_isPointInRange);

var _scatterplotBrushingLayerFragment = require('./scatterplot-brushing-layer-fragment.glsl');

var _scatterplotBrushingLayerFragment2 = _interopRequireDefault(_scatterplotBrushingLayerFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = (0, _extends3.default)({}, _deck.ScatterplotLayer.defaultProps, {
  enableBrushing: true,
  // brush radius in meters
  brushRadius: 100000,
  mousePosition: [0, 0],
  outsideBrushRadius: 0
});

var ScatterplotBrushingLayer = function (_ScatterplotLayer) {
  (0, _inherits3.default)(ScatterplotBrushingLayer, _ScatterplotLayer);

  function ScatterplotBrushingLayer() {
    (0, _classCallCheck3.default)(this, ScatterplotBrushingLayer);
    return (0, _possibleConstructorReturn3.default)(this, _ScatterplotLayer.apply(this, arguments));
  }

  ScatterplotBrushingLayer.prototype.getShaders = function getShaders() {
    // get customized shaders
    return {
      vs: _isPointInRange2.default + _scatterplotBrushingLayerVertex2.default,
      fs: _scatterplotBrushingLayerFragment2.default,
      shaderCache: this.context.shaderCache
    };
  };

  ScatterplotBrushingLayer.prototype.draw = function draw(_ref) {
    var uniforms = _ref.uniforms;

    // add uniforms
    _ScatterplotLayer.prototype.draw.call(this, { uniforms: (0, _extends3.default)({}, uniforms, {
        brushRadius: this.props.brushRadius,
        outsideBrushRadius: this.props.outsideBrushRadius,
        mousePos: this.props.mousePosition ? new Float32Array(this.unproject(this.props.mousePosition)) : defaultProps.mousePosition,
        enableBrushing: this.props.enableBrushing
      }) });
  };

  return ScatterplotBrushingLayer;
}(_deck.ScatterplotLayer);

exports.default = ScatterplotBrushingLayer;


ScatterplotBrushingLayer.layerName = 'ScatterplotBrushingLayer';
ScatterplotBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsImVuYWJsZUJydXNoaW5nIiwiYnJ1c2hSYWRpdXMiLCJtb3VzZVBvc2l0aW9uIiwib3V0c2lkZUJydXNoUmFkaXVzIiwiU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIiwiZ2V0U2hhZGVycyIsInZzIiwiZnMiLCJzaGFkZXJDYWNoZSIsImNvbnRleHQiLCJkcmF3IiwidW5pZm9ybXMiLCJwcm9wcyIsIm1vdXNlUG9zIiwiRmxvYXQzMkFycmF5IiwidW5wcm9qZWN0IiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsdUJBQWlCQSxZQURoQjtBQUVKQyxrQkFBZ0IsSUFGWjtBQUdKO0FBQ0FDLGVBQWEsTUFKVDtBQUtKQyxpQkFBZSxDQUFDLENBQUQsRUFBSSxDQUFKLENBTFg7QUFNSkMsc0JBQW9CO0FBTmhCLEVBQU47O0lBU3FCQyx3Qjs7Ozs7Ozs7cUNBRW5CQyxVLHlCQUFhO0FBQ1g7QUFDQSxXQUFPO0FBQ0xDLFVBQUksbUVBREM7QUFFTEMsb0RBRks7QUFHTEMsbUJBQWEsS0FBS0MsT0FBTCxDQUFhRDtBQUhyQixLQUFQO0FBS0QsRzs7cUNBRURFLEksdUJBQWlCO0FBQUEsUUFBWEMsUUFBVyxRQUFYQSxRQUFXOztBQUNmO0FBQ0EsZ0NBQU1ELElBQU4sWUFBVyxFQUFDQyxxQ0FDUEEsUUFETztBQUVWVixxQkFBYSxLQUFLVyxLQUFMLENBQVdYLFdBRmQ7QUFHVkUsNEJBQW9CLEtBQUtTLEtBQUwsQ0FBV1Qsa0JBSHJCO0FBSVZVLGtCQUFVLEtBQUtELEtBQUwsQ0FBV1YsYUFBWCxHQUNSLElBQUlZLFlBQUosQ0FBaUIsS0FBS0MsU0FBTCxDQUFlLEtBQUtILEtBQUwsQ0FBV1YsYUFBMUIsQ0FBakIsQ0FEUSxHQUNxREgsYUFBYUcsYUFMbEU7QUFNVkYsd0JBQWdCLEtBQUtZLEtBQUwsQ0FBV1o7QUFOakIsUUFBRCxFQUFYO0FBUUQsRzs7Ozs7a0JBckJrQkksd0I7OztBQXdCckJBLHlCQUF5QlksU0FBekIsR0FBcUMsMEJBQXJDO0FBQ0FaLHlCQUF5QkwsWUFBekIsR0FBd0NBLFlBQXhDIiwiZmlsZSI6InNjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdkZWNrLmdsJztcblxuaW1wb3J0IHNjYXR0ZXJwbG90VmVydGV4IGZyb20gJy4vc2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXItdmVydGV4Lmdsc2wnO1xuaW1wb3J0IGlzUHRJblJhbmdlIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9pcy1wb2ludC1pbi1yYW5nZSc7XG5pbXBvcnQgc2NhdHRlcnBsb3RGcmFnbWVudCBmcm9tICcuL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLWZyYWdtZW50Lmdsc2wnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLlNjYXR0ZXJwbG90TGF5ZXIuZGVmYXVsdFByb3BzLFxuICBlbmFibGVCcnVzaGluZzogdHJ1ZSxcbiAgLy8gYnJ1c2ggcmFkaXVzIGluIG1ldGVyc1xuICBicnVzaFJhZGl1czogMTAwMDAwLFxuICBtb3VzZVBvc2l0aW9uOiBbMCwgMF0sXG4gIG91dHNpZGVCcnVzaFJhZGl1czogMFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIGV4dGVuZHMgU2NhdHRlcnBsb3RMYXllciB7XG5cbiAgZ2V0U2hhZGVycygpIHtcbiAgICAvLyBnZXQgY3VzdG9taXplZCBzaGFkZXJzXG4gICAgcmV0dXJuIHtcbiAgICAgIHZzOiBpc1B0SW5SYW5nZSArIHNjYXR0ZXJwbG90VmVydGV4LFxuICAgICAgZnM6IHNjYXR0ZXJwbG90RnJhZ21lbnQsXG4gICAgICBzaGFkZXJDYWNoZTogdGhpcy5jb250ZXh0LnNoYWRlckNhY2hlXG4gICAgfTtcbiAgfVxuXG4gIGRyYXcoe3VuaWZvcm1zfSkge1xuICAgIC8vIGFkZCB1bmlmb3Jtc1xuICAgIHN1cGVyLmRyYXcoe3VuaWZvcm1zOiB7XG4gICAgICAuLi51bmlmb3JtcyxcbiAgICAgIGJydXNoUmFkaXVzOiB0aGlzLnByb3BzLmJydXNoUmFkaXVzLFxuICAgICAgb3V0c2lkZUJydXNoUmFkaXVzOiB0aGlzLnByb3BzLm91dHNpZGVCcnVzaFJhZGl1cyxcbiAgICAgIG1vdXNlUG9zOiB0aGlzLnByb3BzLm1vdXNlUG9zaXRpb24gP1xuICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHRoaXMudW5wcm9qZWN0KHRoaXMucHJvcHMubW91c2VQb3NpdGlvbikpIDogZGVmYXVsdFByb3BzLm1vdXNlUG9zaXRpb24sXG4gICAgICBlbmFibGVCcnVzaGluZzogdGhpcy5wcm9wcy5lbmFibGVCcnVzaGluZ1xuICAgIH19KTtcbiAgfVxufVxuXG5TY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIubGF5ZXJOYW1lID0gJ1NjYXR0ZXJwbG90QnJ1c2hpbmdMYXllcic7XG5TY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19