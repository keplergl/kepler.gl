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
    _ScatterplotLayer.prototype.draw.call(this, {
      uniforms: (0, _extends3.default)({}, uniforms, {
        brushRadius: this.props.brushRadius,
        outsideBrushRadius: this.props.outsideBrushRadius,
        mousePos: this.props.mousePosition ? new Float32Array(this.unproject(this.props.mousePosition)) : defaultProps.mousePosition,
        enableBrushing: this.props.enableBrushing
      })
    });
  };

  return ScatterplotBrushingLayer;
}(_deck.ScatterplotLayer);

exports.default = ScatterplotBrushingLayer;


ScatterplotBrushingLayer.layerName = 'ScatterplotBrushingLayer';
ScatterplotBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsImVuYWJsZUJydXNoaW5nIiwiYnJ1c2hSYWRpdXMiLCJtb3VzZVBvc2l0aW9uIiwib3V0c2lkZUJydXNoUmFkaXVzIiwiU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIiwiZ2V0U2hhZGVycyIsInZzIiwiZnMiLCJzaGFkZXJDYWNoZSIsImNvbnRleHQiLCJkcmF3IiwidW5pZm9ybXMiLCJwcm9wcyIsIm1vdXNlUG9zIiwiRmxvYXQzMkFycmF5IiwidW5wcm9qZWN0IiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsdUJBQWlCQSxZQURoQjtBQUVKQyxrQkFBZ0IsSUFGWjtBQUdKO0FBQ0FDLGVBQWEsTUFKVDtBQUtKQyxpQkFBZSxDQUFDLENBQUQsRUFBSSxDQUFKLENBTFg7QUFNSkMsc0JBQW9CO0FBTmhCLEVBQU47O0lBU3FCQyx3Qjs7Ozs7Ozs7cUNBQ25CQyxVLHlCQUFhO0FBQ1g7QUFDQSxXQUFPO0FBQ0xDLFVBQUksbUVBREM7QUFFTEMsb0RBRks7QUFHTEMsbUJBQWEsS0FBS0MsT0FBTCxDQUFhRDtBQUhyQixLQUFQO0FBS0QsRzs7cUNBRURFLEksdUJBQWlCO0FBQUEsUUFBWEMsUUFBVyxRQUFYQSxRQUFXOztBQUNmO0FBQ0EsZ0NBQU1ELElBQU4sWUFBVztBQUNUQywyQ0FDS0EsUUFETDtBQUVFVixxQkFBYSxLQUFLVyxLQUFMLENBQVdYLFdBRjFCO0FBR0VFLDRCQUFvQixLQUFLUyxLQUFMLENBQVdULGtCQUhqQztBQUlFVSxrQkFBVSxLQUFLRCxLQUFMLENBQVdWLGFBQVgsR0FDTixJQUFJWSxZQUFKLENBQWlCLEtBQUtDLFNBQUwsQ0FBZSxLQUFLSCxLQUFMLENBQVdWLGFBQTFCLENBQWpCLENBRE0sR0FFTkgsYUFBYUcsYUFObkI7QUFPRUYsd0JBQWdCLEtBQUtZLEtBQUwsQ0FBV1o7QUFQN0I7QUFEUyxLQUFYO0FBV0QsRzs7Ozs7a0JBdkJrQkksd0I7OztBQTBCckJBLHlCQUF5QlksU0FBekIsR0FBcUMsMEJBQXJDO0FBQ0FaLHlCQUF5QkwsWUFBekIsR0FBd0NBLFlBQXhDIiwiZmlsZSI6InNjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdkZWNrLmdsJztcblxuaW1wb3J0IHNjYXR0ZXJwbG90VmVydGV4IGZyb20gJy4vc2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXItdmVydGV4Lmdsc2wnO1xuaW1wb3J0IGlzUHRJblJhbmdlIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9pcy1wb2ludC1pbi1yYW5nZSc7XG5pbXBvcnQgc2NhdHRlcnBsb3RGcmFnbWVudCBmcm9tICcuL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLWZyYWdtZW50Lmdsc2wnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLlNjYXR0ZXJwbG90TGF5ZXIuZGVmYXVsdFByb3BzLFxuICBlbmFibGVCcnVzaGluZzogdHJ1ZSxcbiAgLy8gYnJ1c2ggcmFkaXVzIGluIG1ldGVyc1xuICBicnVzaFJhZGl1czogMTAwMDAwLFxuICBtb3VzZVBvc2l0aW9uOiBbMCwgMF0sXG4gIG91dHNpZGVCcnVzaFJhZGl1czogMFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIGV4dGVuZHMgU2NhdHRlcnBsb3RMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgLy8gZ2V0IGN1c3RvbWl6ZWQgc2hhZGVyc1xuICAgIHJldHVybiB7XG4gICAgICB2czogaXNQdEluUmFuZ2UgKyBzY2F0dGVycGxvdFZlcnRleCxcbiAgICAgIGZzOiBzY2F0dGVycGxvdEZyYWdtZW50LFxuICAgICAgc2hhZGVyQ2FjaGU6IHRoaXMuY29udGV4dC5zaGFkZXJDYWNoZVxuICAgIH07XG4gIH1cblxuICBkcmF3KHt1bmlmb3Jtc30pIHtcbiAgICAvLyBhZGQgdW5pZm9ybXNcbiAgICBzdXBlci5kcmF3KHtcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgICBicnVzaFJhZGl1czogdGhpcy5wcm9wcy5icnVzaFJhZGl1cyxcbiAgICAgICAgb3V0c2lkZUJydXNoUmFkaXVzOiB0aGlzLnByb3BzLm91dHNpZGVCcnVzaFJhZGl1cyxcbiAgICAgICAgbW91c2VQb3M6IHRoaXMucHJvcHMubW91c2VQb3NpdGlvblxuICAgICAgICAgID8gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnVucHJvamVjdCh0aGlzLnByb3BzLm1vdXNlUG9zaXRpb24pKVxuICAgICAgICAgIDogZGVmYXVsdFByb3BzLm1vdXNlUG9zaXRpb24sXG4gICAgICAgIGVuYWJsZUJydXNoaW5nOiB0aGlzLnByb3BzLmVuYWJsZUJydXNoaW5nXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyLmxheWVyTmFtZSA9ICdTY2F0dGVycGxvdEJydXNoaW5nTGF5ZXInO1xuU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==