'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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
    return (0, _possibleConstructorReturn3.default)(this, (ScatterplotBrushingLayer.__proto__ || Object.getPrototypeOf(ScatterplotBrushingLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ScatterplotBrushingLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      // get customized shaders
      return {
        vs: _isPointInRange2.default + _scatterplotBrushingLayerVertex2.default,
        fs: _scatterplotBrushingLayerFragment2.default,
        shaderCache: this.context.shaderCache
      };
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;

      // add uniforms
      (0, _get3.default)(ScatterplotBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(ScatterplotBrushingLayer.prototype), 'draw', this).call(this, {
        uniforms: (0, _extends3.default)({}, uniforms, {
          brushRadius: this.props.brushRadius,
          outsideBrushRadius: this.props.outsideBrushRadius,
          mousePos: this.props.mousePosition ? new Float32Array(this.unproject(this.props.mousePosition)) : defaultProps.mousePosition,
          enableBrushing: this.props.enableBrushing
        })
      });
    }
  }]);
  return ScatterplotBrushingLayer;
}(_deck.ScatterplotLayer);

exports.default = ScatterplotBrushingLayer;


ScatterplotBrushingLayer.layerName = 'ScatterplotBrushingLayer';
ScatterplotBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsImVuYWJsZUJydXNoaW5nIiwiYnJ1c2hSYWRpdXMiLCJtb3VzZVBvc2l0aW9uIiwib3V0c2lkZUJydXNoUmFkaXVzIiwiU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIiwidnMiLCJmcyIsInNoYWRlckNhY2hlIiwiY29udGV4dCIsInVuaWZvcm1zIiwicHJvcHMiLCJtb3VzZVBvcyIsIkZsb2F0MzJBcnJheSIsInVucHJvamVjdCIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsdUJBQWlCQSxZQURoQjtBQUVKQyxrQkFBZ0IsSUFGWjtBQUdKO0FBQ0FDLGVBQWEsTUFKVDtBQUtKQyxpQkFBZSxDQUFDLENBQUQsRUFBSSxDQUFKLENBTFg7QUFNSkMsc0JBQW9CO0FBTmhCLEVBQU47O0lBU3FCQyx3Qjs7Ozs7Ozs7OztpQ0FDTjtBQUNYO0FBQ0EsYUFBTztBQUNMQyxZQUFJLG1FQURDO0FBRUxDLHNEQUZLO0FBR0xDLHFCQUFhLEtBQUtDLE9BQUwsQ0FBYUQ7QUFIckIsT0FBUDtBQUtEOzs7K0JBRWdCO0FBQUEsVUFBWEUsUUFBVyxRQUFYQSxRQUFXOztBQUNmO0FBQ0EsNkpBQVc7QUFDVEEsNkNBQ0tBLFFBREw7QUFFRVIsdUJBQWEsS0FBS1MsS0FBTCxDQUFXVCxXQUYxQjtBQUdFRSw4QkFBb0IsS0FBS08sS0FBTCxDQUFXUCxrQkFIakM7QUFJRVEsb0JBQVUsS0FBS0QsS0FBTCxDQUFXUixhQUFYLEdBQ04sSUFBSVUsWUFBSixDQUFpQixLQUFLQyxTQUFMLENBQWUsS0FBS0gsS0FBTCxDQUFXUixhQUExQixDQUFqQixDQURNLEdBRU5ILGFBQWFHLGFBTm5CO0FBT0VGLDBCQUFnQixLQUFLVSxLQUFMLENBQVdWO0FBUDdCO0FBRFMsT0FBWDtBQVdEOzs7OztrQkF2QmtCSSx3Qjs7O0FBMEJyQkEseUJBQXlCVSxTQUF6QixHQUFxQywwQkFBckM7QUFDQVYseUJBQXlCTCxZQUF6QixHQUF3Q0EsWUFBeEMiLCJmaWxlIjoic2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuXG5pbXBvcnQgc2NhdHRlcnBsb3RWZXJ0ZXggZnJvbSAnLi9zY2F0dGVycGxvdC1icnVzaGluZy1sYXllci12ZXJ0ZXguZ2xzbCc7XG5pbXBvcnQgaXNQdEluUmFuZ2UgZnJvbSAnLi4vLi4vc2hhZGVybGliL2lzLXBvaW50LWluLXJhbmdlJztcbmltcG9ydCBzY2F0dGVycGxvdEZyYWdtZW50IGZyb20gJy4vc2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXItZnJhZ21lbnQuZ2xzbCc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uU2NhdHRlcnBsb3RMYXllci5kZWZhdWx0UHJvcHMsXG4gIGVuYWJsZUJydXNoaW5nOiB0cnVlLFxuICAvLyBicnVzaCByYWRpdXMgaW4gbWV0ZXJzXG4gIGJydXNoUmFkaXVzOiAxMDAwMDAsXG4gIG1vdXNlUG9zaXRpb246IFswLCAwXSxcbiAgb3V0c2lkZUJydXNoUmFkaXVzOiAwXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIgZXh0ZW5kcyBTY2F0dGVycGxvdExheWVyIHtcbiAgZ2V0U2hhZGVycygpIHtcbiAgICAvLyBnZXQgY3VzdG9taXplZCBzaGFkZXJzXG4gICAgcmV0dXJuIHtcbiAgICAgIHZzOiBpc1B0SW5SYW5nZSArIHNjYXR0ZXJwbG90VmVydGV4LFxuICAgICAgZnM6IHNjYXR0ZXJwbG90RnJhZ21lbnQsXG4gICAgICBzaGFkZXJDYWNoZTogdGhpcy5jb250ZXh0LnNoYWRlckNhY2hlXG4gICAgfTtcbiAgfVxuXG4gIGRyYXcoe3VuaWZvcm1zfSkge1xuICAgIC8vIGFkZCB1bmlmb3Jtc1xuICAgIHN1cGVyLmRyYXcoe1xuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLi4udW5pZm9ybXMsXG4gICAgICAgIGJydXNoUmFkaXVzOiB0aGlzLnByb3BzLmJydXNoUmFkaXVzLFxuICAgICAgICBvdXRzaWRlQnJ1c2hSYWRpdXM6IHRoaXMucHJvcHMub3V0c2lkZUJydXNoUmFkaXVzLFxuICAgICAgICBtb3VzZVBvczogdGhpcy5wcm9wcy5tb3VzZVBvc2l0aW9uXG4gICAgICAgICAgPyBuZXcgRmxvYXQzMkFycmF5KHRoaXMudW5wcm9qZWN0KHRoaXMucHJvcHMubW91c2VQb3NpdGlvbikpXG4gICAgICAgICAgOiBkZWZhdWx0UHJvcHMubW91c2VQb3NpdGlvbixcbiAgICAgICAgZW5hYmxlQnJ1c2hpbmc6IHRoaXMucHJvcHMuZW5hYmxlQnJ1c2hpbmdcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIubGF5ZXJOYW1lID0gJ1NjYXR0ZXJwbG90QnJ1c2hpbmdMYXllcic7XG5TY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19