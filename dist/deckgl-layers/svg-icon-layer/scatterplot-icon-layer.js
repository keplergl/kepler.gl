'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _luma = require('luma.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScatterplotIconLayer = function (_ScatterplotLayer) {
  (0, _inherits3.default)(ScatterplotIconLayer, _ScatterplotLayer);

  function ScatterplotIconLayer() {
    (0, _classCallCheck3.default)(this, ScatterplotIconLayer);
    return (0, _possibleConstructorReturn3.default)(this, _ScatterplotLayer.apply(this, arguments));
  }

  ScatterplotIconLayer.prototype._getModel = function _getModel(gl) {
    // use default scatterplot shaders
    var shaders = this.getShaders();
    var defaultPos = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];
    var iconGeometry = this.props.iconGeometry;


    var geometry = iconGeometry ? new _luma.Geometry({
      drawMode: _luma.GL.TRIANGLES,
      positions: new Float32Array(iconGeometry)
    }) : new _luma.Geometry({
      drawMode: _luma.GL.TRIANGLE_FAN,
      positions: new Float32Array(defaultPos)
    });

    return new _luma.Model(gl, (0, _extends3.default)({}, shaders, {
      id: this.props.id,
      geometry: geometry,
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));
  };

  return ScatterplotIconLayer;
}(_deck.ScatterplotLayer);

exports.default = ScatterplotIconLayer;


ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3NjYXR0ZXJwbG90LWljb24tbGF5ZXIuanMiXSwibmFtZXMiOlsiU2NhdHRlcnBsb3RJY29uTGF5ZXIiLCJfZ2V0TW9kZWwiLCJnbCIsInNoYWRlcnMiLCJnZXRTaGFkZXJzIiwiZGVmYXVsdFBvcyIsImljb25HZW9tZXRyeSIsInByb3BzIiwiZ2VvbWV0cnkiLCJkcmF3TW9kZSIsIlRSSUFOR0xFUyIsInBvc2l0aW9ucyIsIkZsb2F0MzJBcnJheSIsIlRSSUFOR0xFX0ZBTiIsImlkIiwiaXNJbnN0YW5jZWQiLCJzaGFkZXJDYWNoZSIsImNvbnRleHQiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7SUFFcUJBLG9COzs7Ozs7OztpQ0FFbkJDLFMsc0JBQVVDLEUsRUFBSTtBQUNaO0FBQ0EsUUFBTUMsVUFBVSxLQUFLQyxVQUFMLEVBQWhCO0FBQ0EsUUFBTUMsYUFBYSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUMsQ0FBTixFQUFTLENBQVQsRUFBWSxDQUFDLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBQyxDQUFuQyxFQUFzQyxDQUF0QyxDQUFuQjtBQUhZLFFBSUxDLFlBSkssR0FJVyxLQUFLQyxLQUpoQixDQUlMRCxZQUpLOzs7QUFNWixRQUFNRSxXQUFXRixlQUNmLG1CQUFhO0FBQ1hHLGdCQUFVLFNBQUdDLFNBREY7QUFFWEMsaUJBQVcsSUFBSUMsWUFBSixDQUFpQk4sWUFBakI7QUFGQSxLQUFiLENBRGUsR0FLZixtQkFBYTtBQUNYRyxnQkFBVSxTQUFHSSxZQURGO0FBRVhGLGlCQUFXLElBQUlDLFlBQUosQ0FBaUJQLFVBQWpCO0FBRkEsS0FBYixDQUxGOztBQVVBLFdBQU8sZ0JBQVVILEVBQVYsNkJBQ0ZDLE9BREU7QUFFTFcsVUFBSSxLQUFLUCxLQUFMLENBQVdPLEVBRlY7QUFHTE4sd0JBSEs7QUFJTE8sbUJBQWEsSUFKUjtBQUtMQyxtQkFBYSxLQUFLQyxPQUFMLENBQWFEO0FBTHJCLE9BQVA7QUFPRCxHOzs7OztrQkF6QmtCaEIsb0I7OztBQTRCckJBLHFCQUFxQmtCLFNBQXJCLEdBQWlDLHNCQUFqQyIsImZpbGUiOiJzY2F0dGVycGxvdC1pY29uLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTY2F0dGVycGxvdExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7R0wsIEdlb21ldHJ5LCBNb2RlbH0gZnJvbSAnbHVtYS5nbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJwbG90SWNvbkxheWVyIGV4dGVuZHMgU2NhdHRlcnBsb3RMYXllciB7XG5cbiAgX2dldE1vZGVsKGdsKSB7XG4gICAgLy8gdXNlIGRlZmF1bHQgc2NhdHRlcnBsb3Qgc2hhZGVyc1xuICAgIGNvbnN0IHNoYWRlcnMgPSB0aGlzLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCBkZWZhdWx0UG9zID0gWy0xLCAtMSwgMCwgLTEsIDEsIDAsIDEsIDEsIDAsIDEsIC0xLCAwXTtcbiAgICBjb25zdCB7aWNvbkdlb21ldHJ5fSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IGljb25HZW9tZXRyeSA/XG4gICAgICBuZXcgR2VvbWV0cnkoe1xuICAgICAgICBkcmF3TW9kZTogR0wuVFJJQU5HTEVTLFxuICAgICAgICBwb3NpdGlvbnM6IG5ldyBGbG9hdDMyQXJyYXkoaWNvbkdlb21ldHJ5KVxuICAgICAgfSkgOlxuICAgICAgbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgZHJhd01vZGU6IEdMLlRSSUFOR0xFX0ZBTixcbiAgICAgICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KGRlZmF1bHRQb3MpXG4gICAgICB9KTtcblxuICAgIHJldHVybiBuZXcgTW9kZWwoZ2wsIHtcbiAgICAgIC4uLnNoYWRlcnMsXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGdlb21ldHJ5LFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWUsXG4gICAgICBzaGFkZXJDYWNoZTogdGhpcy5jb250ZXh0LnNoYWRlckNhY2hlXG4gICAgfSk7XG4gIH1cbn1cblxuU2NhdHRlcnBsb3RJY29uTGF5ZXIubGF5ZXJOYW1lID0gJ1NjYXR0ZXJwbG90SWNvbkxheWVyJztcbiJdfQ==