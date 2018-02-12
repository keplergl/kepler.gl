'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
    return (0, _possibleConstructorReturn3.default)(this, (ScatterplotIconLayer.__proto__ || Object.getPrototypeOf(ScatterplotIconLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ScatterplotIconLayer, [{
    key: '_getModel',
    value: function _getModel(gl) {
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
    }
  }]);
  return ScatterplotIconLayer;
}(_deck.ScatterplotLayer);

exports.default = ScatterplotIconLayer;


ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3NjYXR0ZXJwbG90LWljb24tbGF5ZXIuanMiXSwibmFtZXMiOlsiU2NhdHRlcnBsb3RJY29uTGF5ZXIiLCJnbCIsInNoYWRlcnMiLCJnZXRTaGFkZXJzIiwiZGVmYXVsdFBvcyIsImljb25HZW9tZXRyeSIsInByb3BzIiwiZ2VvbWV0cnkiLCJkcmF3TW9kZSIsIlRSSUFOR0xFUyIsInBvc2l0aW9ucyIsIkZsb2F0MzJBcnJheSIsIlRSSUFOR0xFX0ZBTiIsImlkIiwiaXNJbnN0YW5jZWQiLCJzaGFkZXJDYWNoZSIsImNvbnRleHQiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQSxvQjs7Ozs7Ozs7Ozs4QkFDVEMsRSxFQUFJO0FBQ1o7QUFDQSxVQUFNQyxVQUFVLEtBQUtDLFVBQUwsRUFBaEI7QUFDQSxVQUFNQyxhQUFhLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBQyxDQUFOLEVBQVMsQ0FBVCxFQUFZLENBQUMsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxDQUFDLENBQW5DLEVBQXNDLENBQXRDLENBQW5CO0FBSFksVUFJTEMsWUFKSyxHQUlXLEtBQUtDLEtBSmhCLENBSUxELFlBSks7OztBQU1aLFVBQU1FLFdBQVdGLGVBQ2IsbUJBQWE7QUFDWEcsa0JBQVUsU0FBR0MsU0FERjtBQUVYQyxtQkFBVyxJQUFJQyxZQUFKLENBQWlCTixZQUFqQjtBQUZBLE9BQWIsQ0FEYSxHQUtiLG1CQUFhO0FBQ1hHLGtCQUFVLFNBQUdJLFlBREY7QUFFWEYsbUJBQVcsSUFBSUMsWUFBSixDQUFpQlAsVUFBakI7QUFGQSxPQUFiLENBTEo7O0FBVUEsYUFBTyxnQkFBVUgsRUFBViw2QkFDRkMsT0FERTtBQUVMVyxZQUFJLEtBQUtQLEtBQUwsQ0FBV08sRUFGVjtBQUdMTiwwQkFISztBQUlMTyxxQkFBYSxJQUpSO0FBS0xDLHFCQUFhLEtBQUtDLE9BQUwsQ0FBYUQ7QUFMckIsU0FBUDtBQU9EOzs7OztrQkF4QmtCZixvQjs7O0FBMkJyQkEscUJBQXFCaUIsU0FBckIsR0FBaUMsc0JBQWpDIiwiZmlsZSI6InNjYXR0ZXJwbG90LWljb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtHTCwgR2VvbWV0cnksIE1vZGVsfSBmcm9tICdsdW1hLmdsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RJY29uTGF5ZXIgZXh0ZW5kcyBTY2F0dGVycGxvdExheWVyIHtcbiAgX2dldE1vZGVsKGdsKSB7XG4gICAgLy8gdXNlIGRlZmF1bHQgc2NhdHRlcnBsb3Qgc2hhZGVyc1xuICAgIGNvbnN0IHNoYWRlcnMgPSB0aGlzLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCBkZWZhdWx0UG9zID0gWy0xLCAtMSwgMCwgLTEsIDEsIDAsIDEsIDEsIDAsIDEsIC0xLCAwXTtcbiAgICBjb25zdCB7aWNvbkdlb21ldHJ5fSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IGljb25HZW9tZXRyeVxuICAgICAgPyBuZXcgR2VvbWV0cnkoe1xuICAgICAgICAgIGRyYXdNb2RlOiBHTC5UUklBTkdMRVMsXG4gICAgICAgICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KGljb25HZW9tZXRyeSlcbiAgICAgICAgfSlcbiAgICAgIDogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgICBkcmF3TW9kZTogR0wuVFJJQU5HTEVfRkFOLFxuICAgICAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShkZWZhdWx0UG9zKVxuICAgICAgICB9KTtcblxuICAgIHJldHVybiBuZXcgTW9kZWwoZ2wsIHtcbiAgICAgIC4uLnNoYWRlcnMsXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGdlb21ldHJ5LFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWUsXG4gICAgICBzaGFkZXJDYWNoZTogdGhpcy5jb250ZXh0LnNoYWRlckNhY2hlXG4gICAgfSk7XG4gIH1cbn1cblxuU2NhdHRlcnBsb3RJY29uTGF5ZXIubGF5ZXJOYW1lID0gJ1NjYXR0ZXJwbG90SWNvbkxheWVyJztcbiJdfQ==